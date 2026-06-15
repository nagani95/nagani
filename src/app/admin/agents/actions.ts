// src/app/admin/agents/actions.ts

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const ADMIN_AGENTS_PATH = "/admin/agents";

function getText(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
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

export async function createAgentAction(formData: FormData) {
  const supabase = await createClient();
  let errorMessage: string | null = null;

  try {
    const agentCode = getText(formData, "agent_code").toLowerCase();
    const displayName = getText(formData, "display_name");
    const commissionRate = getCommissionDecimal(formData);
    const notes = getText(formData, "notes") || null;

    const { error } = await supabase.rpc("create_agent_profile", {
      p_agent_code: agentCode,
      p_display_name: displayName,
      p_commission_rate: commissionRate,
      p_notes: notes,
    });

    if (error) {
      errorMessage = error.message;
    }
  } catch (error) {
    errorMessage =
      error instanceof Error ? error.message : "Failed to create agent";
  }

  if (errorMessage) {
    redirectWithStatus("error", errorMessage);
  }

  revalidatePath(ADMIN_AGENTS_PATH);
  redirectWithStatus("success", "Agent created successfully");
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