// src/lib/supabase/auth.ts

"use server";

import { createHash, randomUUID } from "crypto";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

import { createClient } from "./server";

function getFormString(formData: FormData, key: string) {
  const value = formData.get(key);

  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

function getSafeInternalPath(value: string) {
  const path = value.trim();

  if (!path.startsWith("/") || path.startsWith("//")) {
    return "";
  }

  if (path.includes("://")) {
    return "";
  }

  return path;
}

function normalizePlayerAuthEmail(value: string) {
  const input = value.trim().toLowerCase();

  if (!input) {
    return "";
  }

  if (input.includes("@")) {
    return input;
  }

  const digits = input.replace(/\D/g, "");

  return digits ? `${digits}@nagani.local` : "";
}

function getPhoneFromPlayerAuthEmail(email: string) {
  if (!email.endsWith("@nagani.local")) {
    return "";
  }

  return email.replace("@nagani.local", "");
}

const NAGANI_DEVICE_COOKIE = "nagani_device_id";

type RegistrationRiskResult = {
  result: "allowed" | "blocked" | "review";
  block_reason: string | null;
  risk_level: "normal" | "watch" | "medium" | "high" | "blocked";
  risk_score: number;
  risk_reasons: string[];
  same_device_profile_count: number;
  same_ip_profile_count: number;
};

function getRiskHashPepper() {
  return process.env.NAGANI_RISK_HASH_PEPPER || "nagani-risk-v1";
}

function hashRiskSignal(value: string) {
  return createHash("sha256")
    .update(`${getRiskHashPepper()}:${value}`)
    .digest("hex");
}

function normalizeRegistrationRisk(value: unknown): RegistrationRiskResult {
  const record =
    value && typeof value === "object"
      ? (value as Record<string, unknown>)
      : {};

  const riskReasons = Array.isArray(record.risk_reasons)
    ? record.risk_reasons.filter(
        (reason): reason is string => typeof reason === "string",
      )
    : [];

  const result =
    record.result === "blocked" || record.result === "review"
      ? record.result
      : "allowed";

  const riskLevel =
    record.risk_level === "watch" ||
    record.risk_level === "medium" ||
    record.risk_level === "high" ||
    record.risk_level === "blocked"
      ? record.risk_level
      : "normal";

  return {
    result,
    block_reason:
      typeof record.block_reason === "string" ? record.block_reason : null,
    risk_level: riskLevel,
    risk_score: Number(record.risk_score ?? 0) || 0,
    risk_reasons: riskReasons,
    same_device_profile_count:
      Number(record.same_device_profile_count ?? 0) || 0,
    same_ip_profile_count: Number(record.same_ip_profile_count ?? 0) || 0,
  };
}

function isDeviceSignupLimitDisabledForTesting() {
  // NOTE:
  // Local testing helper only.
  // Set NAGANI_DISABLE_REGISTRATION_DEVICE_LIMIT=true in .env.local
  // when we need to create many test users from the same browser/device.
  // Do NOT set this variable in Vercel production.
  return process.env.NAGANI_DISABLE_REGISTRATION_DEVICE_LIMIT === "true";
}

function getEffectiveRegistrationRisk(
  registrationRisk: RegistrationRiskResult,
): RegistrationRiskResult {
  if (
    isDeviceSignupLimitDisabledForTesting() &&
    registrationRisk.block_reason === "same_device_account_limit"
  ) {
    return {
      ...registrationRisk,
      result: "allowed",
      block_reason: null,
      risk_level: "normal",
      risk_score: 0,
      risk_reasons: registrationRisk.risk_reasons.filter(
        (reason) => reason !== "same_device_account_limit",
      ),
    };
  }

  return registrationRisk;
}

async function getRegistrationSignals() {
  const cookieStore = await cookies();
  const headerStore = await headers();

  let deviceId = cookieStore.get(NAGANI_DEVICE_COOKIE)?.value ?? "";

  if (!/^[a-zA-Z0-9-]{20,80}$/.test(deviceId)) {
    deviceId = randomUUID();

    cookieStore.set(NAGANI_DEVICE_COOKIE, deviceId, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });
  }

  const forwardedFor = headerStore.get("x-forwarded-for") ?? "";
  const realIp = headerStore.get("x-real-ip") ?? "";
  const ipAddress = forwardedFor.split(",")[0]?.trim() || realIp.trim();
  const userAgent = headerStore.get("user-agent") ?? "";

  return {
    deviceHash: hashRiskSignal(`device:${deviceId}`),
    ipHash: ipAddress ? hashRiskSignal(`ip:${ipAddress}`) : "",
    userAgentHash: userAgent ? hashRiskSignal(`ua:${userAgent}`) : "",
  };
}

function redirectWithRegisterError(message: string): never {
  redirect(`/register?error=${encodeURIComponent(message)}`);
}

function redirectWithRegisterMessage(message: string): never {
  redirect(`/register?message=${encodeURIComponent(message)}`);
}

function redirectWithLoginError(message: string): never {
  redirect(`/login?error=${encodeURIComponent(message)}`);
}

function redirectWithAdminLoginError(message: string): never {
  redirect(`/admin/login?error=${encodeURIComponent(message)}`);
}

function redirectWithAgentLoginError(message: string): never {
  redirect(`/agent/login?error=${encodeURIComponent(message)}`);
}

export async function registerWithEmail(formData: FormData) {
  const email = normalizePlayerAuthEmail(getFormString(formData, "email"));
  const phoneNumber = getPhoneFromPlayerAuthEmail(email);
  const referralCode = getFormString(formData, "referralCode").toUpperCase();
  const password = getFormString(formData, "password");
  const confirmPassword = getFormString(formData, "confirmPassword");

  if (!email) {
    redirectWithRegisterError("ဖုန်းနံပါတ် လိုအပ်ပါသည်။");
  }

  if (!password) {
    redirectWithRegisterError("စကားဝှက် လိုအပ်ပါသည်။");
  }

  if (password.length < 6) {
    redirectWithRegisterError("စကားဝှက် အနည်းဆုံး ၆ လုံး ရိုက်ပါ။");
  }

  if (password !== confirmPassword) {
    redirectWithRegisterError("စကားဝှက် နှစ်ခု မတူပါ။");
  }

  const supabase = await createClient();
  const registrationSignals = await getRegistrationSignals();

  const { data: riskData, error: riskError } = await supabase.rpc(
    "evaluate_registration_risk",
    {
      p_device_hash: registrationSignals.deviceHash,
      p_ip_hash: registrationSignals.ipHash,
      p_user_agent_hash: registrationSignals.userAgentHash,
    },
  );

  if (riskError) {
    console.error("Registration risk check error:", riskError.message);
    redirectWithRegisterError("အကောင့်ဖွင့်မှု စစ်ဆေးမှု မအောင်မြင်ပါ။");
  }

const rawRegistrationRisk = normalizeRegistrationRisk(riskData);
const registrationRisk = getEffectiveRegistrationRisk(rawRegistrationRisk);

if (registrationRisk.result === "blocked") {
    await supabase.rpc("record_registration_attempt", {
      p_phone_number: phoneNumber || null,
      p_device_hash: registrationSignals.deviceHash,
      p_ip_hash: registrationSignals.ipHash,
      p_user_agent_hash: registrationSignals.userAgentHash,
      p_result: "blocked",
      p_block_reason:
        registrationRisk.block_reason || "same_device_account_limit",
      p_created_profile_id: null,
    });

    redirectWithRegisterError(
      "ဤစက်ပစ္စည်းမှ အကောင့်ဖွင့်မှု များနေပါသည်။ Support ကို ဆက်သွယ်ပါ။",
    );
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        referral_code: referralCode || null,
      },
    },
  });

  if (error) {
    console.error("Register error:", error.message);

    await supabase.rpc("record_registration_attempt", {
      p_phone_number: phoneNumber || null,
      p_device_hash: registrationSignals.deviceHash,
      p_ip_hash: registrationSignals.ipHash,
      p_user_agent_hash: registrationSignals.userAgentHash,
      p_result: "blocked",
      p_block_reason: "auth_signup_failed",
      p_created_profile_id: null,
    });

    redirectWithRegisterError("အကောင့်ဖွင့်မှု မအောင်မြင်ပါ။");
  }

  const userId = data.user?.id;

  if (!userId) {
    redirectWithRegisterError("အကောင့်ဖွင့်၍ မရပါ။");
  }

  if (!data.session) {
    await supabase.rpc("record_registration_attempt", {
      p_phone_number: phoneNumber || null,
      p_device_hash: registrationSignals.deviceHash,
      p_ip_hash: registrationSignals.ipHash,
      p_user_agent_hash: registrationSignals.userAgentHash,
      p_result: "review",
      p_block_reason: "signup_created_without_session",
      p_created_profile_id: null,
    });

    redirectWithRegisterMessage(
      "အကောင့်ဖွင့်မှု အောင်မြင်ပါသည်။ ဖုန်းနံပါတ်ဖြင့် ဝင်ရောက်ပါ။",
    );
  }

  const { error: completeProfileError } = await supabase.rpc(
    "complete_player_registration_profile",
    {
      p_phone_number: phoneNumber || null,
      p_device_hash: registrationSignals.deviceHash,
      p_ip_hash: registrationSignals.ipHash,
      p_user_agent_hash: registrationSignals.userAgentHash,
      p_account_trust_status:
        registrationRisk.risk_level === "blocked" ? "blocked" : "unverified",
      p_manual_review_required:
        registrationRisk.result === "review" ||
        registrationRisk.risk_level === "high",
      p_risk_level: registrationRisk.risk_level,
      p_risk_score: registrationRisk.risk_score,
      p_risk_reasons: registrationRisk.risk_reasons,
      p_registration_result: registrationRisk.result,
      p_block_reason: registrationRisk.block_reason,
    },
  );

  if (completeProfileError) {
    console.error(
      "Complete player registration error:",
      completeProfileError.message,
    );
    redirectWithRegisterError("ပရိုဖိုင် ပြင်ဆင်မှု မအောင်မြင်ပါ။");
  }

if (referralCode) {
  const { data: referralResult, error: referralError } = await supabase.rpc(
    "assign_my_referral_code_v2",
    {
      p_referral_code: referralCode,
    },
  );

  if (referralError) {
    console.warn("Referral assign skipped:", referralError.message);
  } else if (
    referralResult &&
    typeof referralResult === "object" &&
    "success" in referralResult &&
    referralResult.success === false
  ) {
    console.warn("Referral assign skipped:", referralResult);
  }
}

  redirect("/");
}

export async function loginWithEmail(formData: FormData) {
  const email = normalizePlayerAuthEmail(getFormString(formData, "email"));
  const password = getFormString(formData, "password");
  const nextPath = getSafeInternalPath(getFormString(formData, "next"));

  if (!email) {
    redirectWithLoginError("ဖုန်းနံပါတ် လိုအပ်ပါသည်။");
  }

  if (!password) {
    redirectWithLoginError("စကားဝှက် လိုအပ်ပါသည်။");
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("Login error:", error.message);
    redirectWithLoginError("ဝင်ရောက်မှု မအောင်မြင်ပါ။");
  }

  redirect(nextPath || "/");
}

export async function logout() {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Logout error:", error.message);
    throw new Error(error.message);
  }

  redirect("/");
}

export async function adminLoginWithEmail(formData: FormData) {
  const email = getFormString(formData, "email").toLowerCase();
  const password = getFormString(formData, "password");

  if (!email) {
    redirectWithAdminLoginError("Admin email is required.");
  }

  if (!password) {
    redirectWithAdminLoginError("Admin password is required.");
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("Admin login error:", error.message);
    redirectWithAdminLoginError("Admin login failed.");
  }

  redirect("/admin");
}

export async function agentLoginWithPhone(formData: FormData) {
  const email = normalizePlayerAuthEmail(getFormString(formData, "phone"));
  const password = getFormString(formData, "password");

  if (!email) {
    redirectWithAgentLoginError("ဖုန်းနံပါတ် လိုအပ်ပါသည်။");
  }

  if (!password) {
    redirectWithAgentLoginError("စကားဝှက် လိုအပ်ပါသည်။");
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("Agent login error:", error.message);
    redirectWithAgentLoginError("အေးဂျင့် ဝင်ရောက်မှု မအောင်မြင်ပါ။");
  }

  redirect("/agent");
}