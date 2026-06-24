//src/app/agent/sub-agents/actions.ts

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

const AGENT_SUB_AGENTS_PATH = "/agent/sub-agents";

type CreatedAgent = {
  id?: string;
};

function getText(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function normalizeAgentCode(value: string) {
  return value.trim().replace(/\s+/g, "").toUpperCase();
}

function normalizeNaganiPhoneAuthEmail(value: string) {
  const digits = value.replace(/\D/g, "");
  return digits ? `${digits}@nagani.local` : "";
}

async function assertNoDuplicateAgentIdentity(params: {
  agentCode: string;
  cleanPhone: string;
}) {
  const supabaseAdmin = createAdminClient();

  const { data: codeMatch, error: codeError } = await supabaseAdmin
    .from("agent_profiles")
    .select("id")
    .eq("agent_code", params.agentCode)
    .limit(1)
    .maybeSingle();

  if (codeError) {
    throw new Error(codeError.message);
  }

if (codeMatch) {
  throw new Error(`Agent code already exists: ${params.agentCode}`);
}

  if (params.cleanPhone) {
    const { data: phoneMatch, error: phoneError } = await supabaseAdmin
      .from("agent_profiles")
      .select("id")
      .eq("agent_login_phone", params.cleanPhone)
      .limit(1)
      .maybeSingle();

    if (phoneError) {
      throw new Error(phoneError.message);
    }

    if (phoneMatch) {
      throw new Error("Agent phone number already exists");
    }
  }
}

function getPercentDecimal(formData: FormData, key: string) {
  const raw = getText(formData, key);
  const percent = Number(raw);

  if (!Number.isFinite(percent)) {
    throw new Error("Commission rate must be a number");
  }

  if (percent < 0 || percent > 100) {
    throw new Error("Commission rate must be between 0 and 100");
  }

  return percent / 100;
}

function getAmount(formData: FormData, key: string) {
  const raw = getText(formData, key);
  const amount = Number(raw || 0);

  if (!Number.isFinite(amount) || amount < 0) {
    throw new Error("Active player bonus must be 0 or higher");
  }

  return amount;
}

function redirectWithStatus(type: "success" | "error", message: string): never {
  redirect(`${AGENT_SUB_AGENTS_PATH}?${type}=${encodeURIComponent(message)}`);
}

async function assertActivePrimaryAgentAction() {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("get_my_agent_dashboard_v2");

  const agent = Array.isArray(data) ? data[0] : null;

  if (
    error ||
    !agent ||
    agent.agent_status !== "active" ||
    agent.agent_level !== 1 ||
    agent.can_create_sub_agents !== true
  ) {
    throw new Error("Active primary agent only");
  }

  return supabase;
}

async function createAgentAuthUser(params: {
  phoneNumber: string;
  password: string;
  agentCode: string;
}) {
  const supabaseAdmin = createAdminClient();
  const authEmail = normalizeNaganiPhoneAuthEmail(params.phoneNumber);
  const cleanPhone = params.phoneNumber.replace(/\D/g, "");

  if (!authEmail || !cleanPhone) {
    throw new Error("Agent phone number is required");
  }

  if (!params.password) {
    throw new Error("Agent password is required");
  }

  if (params.password.length < 6) {
    throw new Error("Agent password must be at least 6 characters");
  }

  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email: authEmail,
    password: params.password,
    email_confirm: true,
    user_metadata: {
      nagani_role: "agent",
      agent_code: params.agentCode,
      phone_number: cleanPhone,
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  if (!data.user?.id) {
    throw new Error("Failed to create sub agent login user");
  }

  return data.user.id;
}

export async function createSubAgentAction(formData: FormData) {
  let createdAuthUserId: string | null = null;
  let errorMessage: string | null = null;
  let supabaseAdmin: ReturnType<typeof createAdminClient> | null = null;

  try {
    const supabase = await assertActivePrimaryAgentAction();
    supabaseAdmin = createAdminClient();

    const agentCode = normalizeAgentCode(getText(formData, "agent_code"));
    const displayName = getText(formData, "display_name");
    const phoneNumber = getText(formData, "phone_number");
    const password = getText(formData, "password");
    const commissionRate = getPercentDecimal(formData, "commission_rate_percent");
    const activeBonusAmount = getAmount(formData, "active_player_bonus_amount");
    const notes = getText(formData, "notes") || null;
    const cleanPhone = phoneNumber.replace(/\D/g, "");

    if (!agentCode) {
      throw new Error("Sub agent code is required");
    }

if (!displayName) {
  throw new Error("Display name is required");
}

await assertNoDuplicateAgentIdentity({
  agentCode,
  cleanPhone,
});

createdAuthUserId = await createAgentAuthUser({
      phoneNumber,
      password,
      agentCode,
    });

    const { data, error } = await supabase.rpc("create_sub_agent_profile", {
      p_agent_code: agentCode,
      p_display_name: displayName,
      p_commission_rate: commissionRate,
      p_active_player_bonus_amount: activeBonusAmount,
      p_auth_user_id: createdAuthUserId,
      p_agent_login_phone: cleanPhone,
      p_notes: notes,
    });

    if (error) {
      throw new Error(error.message);
    }

    const createdAgent = data as CreatedAgent | null;

    if (!createdAgent?.id) {
      throw new Error("Sub agent profile was not created");
    }
  } catch (error) {
    if (createdAuthUserId && supabaseAdmin) {
      await supabaseAdmin.auth.admin.deleteUser(createdAuthUserId);
    }

    errorMessage =
      error instanceof Error ? error.message : "Failed to create sub agent";
  }

  if (errorMessage) {
    redirectWithStatus("error", errorMessage);
  }

  revalidatePath("/agent");
  revalidatePath(AGENT_SUB_AGENTS_PATH);
  redirectWithStatus("success", "Sub agent created successfully");
}