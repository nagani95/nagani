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
  const email = getFormString(formData, "email").toLowerCase();
  const password = getFormString(formData, "password");
  const confirmPassword = getFormString(formData, "confirmPassword");

  if (!email) {
    redirectWithRegisterError("Email is required.");
  }

  if (!password) {
    redirectWithRegisterError("Password is required.");
  }

  if (password.length < 6) {
    redirectWithRegisterError("Password must be at least 6 characters.");
  }

  if (password !== confirmPassword) {
    redirectWithRegisterError("Passwords do not match.");
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    console.error("Register error:", error.message);
    redirectWithRegisterError(error.message);
  }

  const userId = data.user?.id;

  if (!userId) {
    redirectWithRegisterError("Could not create player account.");
  }

  // If email confirmation is enabled, Supabase may create the user without a session.
  // In that case, wait until login/confirmation before touching protected profile rows.
  if (!data.session) {
    redirectWithRegisterMessage(
      "Account created. Please check your email to confirm your account."
    );
  }

  // Conservative profile fix:
  // Only use `id` because the current profile page is still mock/client-only
  // and we should not invent profile columns yet.
  const { error: profileError } = await supabase
    .from("profiles")
    .upsert({ id: userId }, { onConflict: "id" });

  if (profileError) {
    console.error("Profile upsert error:", profileError.message);
    redirectWithRegisterError(
      "Account was created, but player profile setup failed."
    );
  }

  redirect("/");
}

export async function loginWithEmail(formData: FormData) {
  const email = getFormString(formData, "email").toLowerCase();
  const password = getFormString(formData, "password");

  if (!email) {
    redirectWithLoginError("Email is required.");
  }

  if (!password) {
    redirectWithLoginError("Password is required.");
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("Login error:", error.message);
    redirectWithLoginError(error.message);
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
    redirectWithAdminLoginError(error.message);
  }

  redirect("/admin");
}