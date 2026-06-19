// src/lib/supabase/auth.ts

"use server";

import { redirect } from "next/navigation";

import { createClient } from "./server";

function getFormString(formData: FormData, key: string) {
  const value = formData.get(key);

  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
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

export async function signInAnonymously() {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInAnonymously();

  if (error) {
    console.error("Error signing in anonymously:", error.message);
    throw new Error(error.message);
  }

  redirect("/six-animal");
}

export async function registerWithEmail(formData: FormData) {
  const email = normalizePlayerAuthEmail(getFormString(formData, "email"));
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

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    console.error("Register error:", error.message);
    redirectWithRegisterError("အကောင့်ဖွင့်မှု မအောင်မြင်ပါ။");
  }

  const userId = data.user?.id;

  if (!userId) {
    redirectWithRegisterError("အကောင့်ဖွင့်၍ မရပါ။");
  }

  if (!data.session) {
    redirectWithRegisterMessage(
      "အကောင့်ဖွင့်မှု အောင်မြင်ပါသည်။ ဖုန်းနံပါတ်ဖြင့် ဝင်ရောက်ပါ။"
    );
  }

  const { error: profileError } = await supabase
    .from("profiles")
    .upsert({ id: userId }, { onConflict: "id" });

  if (profileError) {
    console.error("Profile upsert error:", profileError.message);
    redirectWithRegisterError("ပရိုဖိုင် ပြင်ဆင်မှု မအောင်မြင်ပါ။");
  }

  redirect("/");
}

export async function loginWithEmail(formData: FormData) {
  const email = normalizePlayerAuthEmail(getFormString(formData, "email"));
  const password = getFormString(formData, "password");

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

  redirect("/");
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