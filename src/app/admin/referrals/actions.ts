// src/app/admin/referrals/actions.ts

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const ADMIN_REFERRALS_PATH = "/admin/referrals";

function getText(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function redirectWithStatus(type: "success" | "error", message: string): never {
  redirect(`${ADMIN_REFERRALS_PATH}?${type}=${encodeURIComponent(message)}`);
}

export async function assignPlayerToAgentAction(formData: FormData) {
  const supabase = await createClient();
  let errorMessage: string | null = null;

  try {
    const playerId = getText(formData, "player_id");
    const agentCode = getText(formData, "agent_code").toLowerCase();
    const notes = getText(formData, "notes") || null;

    const { error } = await supabase.rpc("assign_player_to_agent", {
      p_player_id: playerId,
      p_agent_code: agentCode,
      p_notes: notes,
    });

    if (error) {
      errorMessage = error.message;
    }
  } catch (error) {
    errorMessage =
      error instanceof Error ? error.message : "Failed to assign player";
  }

  if (errorMessage) {
    redirectWithStatus("error", errorMessage);
  }

  revalidatePath(ADMIN_REFERRALS_PATH);
  redirectWithStatus("success", "Player assigned to agent successfully");
}

export async function removePlayerReferralAction(formData: FormData) {
  const supabase = await createClient();
  let errorMessage: string | null = null;

  try {
    const playerId = getText(formData, "player_id");
    const notes = getText(formData, "remove_notes") || "Removed by admin";

    const { error } = await supabase.rpc("remove_player_agent_referral", {
      p_player_id: playerId,
      p_notes: notes,
    });

    if (error) {
      errorMessage = error.message;
    }
  } catch (error) {
    errorMessage =
      error instanceof Error ? error.message : "Failed to remove referral";
  }

  if (errorMessage) {
    redirectWithStatus("error", errorMessage);
  }

  revalidatePath(ADMIN_REFERRALS_PATH);
  redirectWithStatus("success", "Player referral removed successfully");
}

export async function calculateAgentSettlementAction(formData: FormData) {
  const supabase = await createClient();
  let errorMessage: string | null = null;

  try {
    const agentId = getText(formData, "agent_id");
    const settlementMonth =
      getText(formData, "settlement_month") ||
      new Date().toISOString().slice(0, 7) + "-01";

    const { error } = await supabase.rpc("calculate_agent_monthly_settlement", {
      p_agent_id: agentId,
      p_settlement_month: settlementMonth,
    });

    if (error) {
      errorMessage = error.message;
    }
  } catch (error) {
    errorMessage =
      error instanceof Error ? error.message : "Failed to calculate settlement";
  }

  if (errorMessage) {
    redirectWithStatus("error", errorMessage);
  }

  revalidatePath(ADMIN_REFERRALS_PATH);
  revalidatePath("/agent");
  redirectWithStatus("success", "Agent monthly settlement calculated");
}