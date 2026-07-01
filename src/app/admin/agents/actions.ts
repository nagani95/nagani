// src/app/admin/agents/actions.ts

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

const ADMIN_AGENTS_PATH = "/admin/agents";

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

function getFriendlyAgentErrorMessage(message: string) {
  const lower = message.toLowerCase();

  if (
    lower.includes("email address has already been registered") ||
    lower.includes("already been registered") ||
    lower.includes("user already registered") ||
    lower.includes("already exists")
  ) {
    return "This login phone already has an account. Use another phone, or link the existing Auth user manually.";
  }

  return message;
}

async function assertNoDuplicateAgentIdentity(params: {
  agentCode: string;
  cleanPhone: string;
  excludeAgentId?: string;
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

  if (codeMatch && codeMatch.id !== params.excludeAgentId) {
    throw new Error("Agent code already exists");
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

    if (phoneMatch && phoneMatch.id !== params.excludeAgentId) {
      throw new Error("Agent phone number already exists");
    }
  }
}

function getCommissionDecimal(formData: FormData) {
  const raw = getText(formData, "commission_rate_percent");
  const percent = Number(raw);

  if (!Number.isFinite(percent)) {
    throw new Error("Commission rate must be a number");
  }

  if (percent < 0 || percent > 100) {
    throw new Error("Commission rate must be between 0 and 100");
  }

  return percent / 100;
}

function redirectWithStatus(type: "success" | "error", message: string): never {
  redirect(`${ADMIN_AGENTS_PATH}?${type}=${encodeURIComponent(message)}`);
}

async function assertAdminAction() {
  const supabase = await createClient();

  const { data: isAdmin, error } = await supabase.rpc("is_nagani_admin");

  if (error || isAdmin !== true) {
    throw new Error("Admin only");
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

  if (!authEmail) {
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
    throw new Error("Failed to create agent login user");
  }

  return data.user.id;
}

export async function createAgentAction(formData: FormData) {
  let createdAuthUserId: string | null = null;
  let errorMessage: string | null = null;
  let supabaseAdmin: ReturnType<typeof createAdminClient> | null = null;

  try {
    const supabase = await assertAdminAction();
    supabaseAdmin = createAdminClient();

    const agentCode = normalizeAgentCode(getText(formData, "agent_code"));
    const displayName = getText(formData, "display_name");
    const commissionRate = getCommissionDecimal(formData);
    const notes = getText(formData, "notes") || null;
    const phoneNumber = getText(formData, "phone_number");
    const password = getText(formData, "password");
    const cleanPhone = phoneNumber.replace(/\D/g, "");

    if (!agentCode) {
      throw new Error("Agent code is required");
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

    const { data, error } = await supabase.rpc("create_agent_profile", {
      p_agent_code: agentCode,
      p_display_name: displayName,
      p_commission_rate: commissionRate,
      p_notes: notes,
    });

    if (error) {
      throw new Error(error.message);
    }

    const createdAgent = data as CreatedAgent | null;

    const updateQuery = supabaseAdmin.from("agent_profiles").update({
      auth_user_id: createdAuthUserId,
      agent_login_phone: cleanPhone,
    });

    const { error: linkError } = createdAgent?.id
      ? await updateQuery.eq("id", createdAgent.id)
      : await updateQuery.eq("agent_code", agentCode);

    if (linkError) {
      throw new Error(linkError.message);
    }
  } catch (error) {
    if (createdAuthUserId && supabaseAdmin) {
      await supabaseAdmin.auth.admin.deleteUser(createdAuthUserId);
    }

errorMessage =
  error instanceof Error
    ? getFriendlyAgentErrorMessage(error.message)
    : "Failed to create agent";
  }

  if (errorMessage) {
    redirectWithStatus("error", errorMessage);
  }

  revalidatePath(ADMIN_AGENTS_PATH);
  redirectWithStatus("success", "Agent created with phone login successfully");
}

export async function createAgentLoginAction(formData: FormData) {
  let createdAuthUserId: string | null = null;
  let errorMessage: string | null = null;
  let supabaseAdmin: ReturnType<typeof createAdminClient> | null = null;

  try {
    await assertAdminAction();
    supabaseAdmin = createAdminClient();

    const agentId = getText(formData, "agent_id");
    const agentCode = normalizeAgentCode(getText(formData, "agent_code"));
    const existingAuthUserId = getText(formData, "auth_user_id");
    const phoneNumber = getText(formData, "phone_number");
    const password = getText(formData, "password");
    const cleanPhone = phoneNumber.replace(/\D/g, "");
    const authEmail = normalizeNaganiPhoneAuthEmail(phoneNumber);

    if (!agentId) {
      throw new Error("Agent ID is required");
    }

    if (!authEmail || !cleanPhone) {
      throw new Error("Agent phone number is required");
    }

if (!password || password.length < 6) {
  throw new Error("Agent password must be at least 6 characters");
}

await assertNoDuplicateAgentIdentity({
  agentCode,
  cleanPhone,
  excludeAgentId: agentId,
});

if (existingAuthUserId) {
      const { error } = await supabaseAdmin.auth.admin.updateUserById(
        existingAuthUserId,
        {
          email: authEmail,
          password,
          email_confirm: true,
          user_metadata: {
            nagani_role: "agent",
            agent_code: agentCode,
            phone_number: cleanPhone,
          },
        },
      );

      if (error) {
        throw new Error(error.message);
      }

      const { error: profileError } = await supabaseAdmin
        .from("agent_profiles")
        .update({ agent_login_phone: cleanPhone })
        .eq("id", agentId);

      if (profileError) {
        throw new Error(profileError.message);
      }
    } else {
      createdAuthUserId = await createAgentAuthUser({
        phoneNumber,
        password,
        agentCode,
      });

      const { error } = await supabaseAdmin
        .from("agent_profiles")
        .update({
          auth_user_id: createdAuthUserId,
          agent_login_phone: cleanPhone,
        })
        .eq("id", agentId);

      if (error) {
        throw new Error(error.message);
      }
    }
  } catch (error) {
    if (createdAuthUserId && supabaseAdmin) {
      await supabaseAdmin.auth.admin.deleteUser(createdAuthUserId);
    }

errorMessage =
  error instanceof Error
    ? getFriendlyAgentErrorMessage(error.message)
    : "Failed to create agent login";
  }

  if (errorMessage) {
    redirectWithStatus("error", errorMessage);
  }

  revalidatePath(ADMIN_AGENTS_PATH);
  redirectWithStatus("success", "Agent phone login saved successfully");
}

export async function updateAgentAction(formData: FormData) {
  const supabase = await createClient();
  let errorMessage: string | null = null;

  try {
    const agentId = getText(formData, "agent_id");
    const displayName = getText(formData, "display_name");
    const commissionRate = getCommissionDecimal(formData);
    const status = getText(formData, "status");
    const notes = getText(formData, "notes") || null;

    const { error } = await supabase.rpc("update_agent_profile", {
      p_agent_id: agentId,
      p_display_name: displayName,
      p_commission_rate: commissionRate,
      p_status: status,
      p_notes: notes,
    });

    if (error) {
      errorMessage = error.message;
    }
  } catch (error) {
    errorMessage =
      error instanceof Error ? error.message : "Failed to update agent";
  }

  if (errorMessage) {
    redirectWithStatus("error", errorMessage);
  }

  revalidatePath(ADMIN_AGENTS_PATH);
  redirectWithStatus("success", "Agent updated successfully");
}

export async function pauseAgentAction(formData: FormData) {
  const supabase = await createClient();

  const agentId = getText(formData, "agent_id");

  const { error } = await supabase.rpc("pause_agent_profile", {
    p_agent_id: agentId,
  });

  if (error) {
    redirectWithStatus("error", error.message);
  }

  revalidatePath(ADMIN_AGENTS_PATH);
  redirectWithStatus("success", "Agent paused successfully");
}

export async function activateAgentAction(formData: FormData) {
  const supabase = await createClient();

  const agentId = getText(formData, "agent_id");

  const { error } = await supabase.rpc("activate_agent_profile", {
    p_agent_id: agentId,
  });

  if (error) {
    redirectWithStatus("error", error.message);
  }

  revalidatePath(ADMIN_AGENTS_PATH);
  redirectWithStatus("success", "Agent activated successfully");
}