///admin/agent-withdraws

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

const ADMIN_AGENT_WITHDRAWS_PATH = "/admin/agent-withdraws";

function getText(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function redirectWithStatus(type: "success" | "error", message: string): never {
  redirect(`${ADMIN_AGENT_WITHDRAWS_PATH}?${type}=${encodeURIComponent(message)}`);
}

type ReviewResult = {
  success?: boolean;
  error?: string;
  status?: string;
};

export async function reviewAgentWithdrawAction(formData: FormData) {
  const supabase = await createClient();
  let errorMessage: string | null = null;
  let successMessage = "Agent withdraw updated";

  try {
    const requestId = getText(formData, "request_id");
    const action = getText(formData, "action");
    const adminNote = getText(formData, "admin_note") || null;

    if (!requestId) {
      throw new Error("Request ID is required");
    }

    if (!action) {
      throw new Error("Action is required");
    }

    const { data, error } = await supabase.rpc("review_agent_withdraw_request", {
      p_request_id: requestId,
      p_action: action,
      p_admin_note: adminNote,
    });

    if (error) {
      throw new Error(error.message);
    }

    const result = data as ReviewResult | null;

    if (!result?.success) {
      throw new Error(result?.error ?? "Failed to review agent withdraw");
    }

    if (result.status === "approved") {
      successMessage = "Agent withdraw approved";
    } else if (result.status === "rejected") {
      successMessage = "Agent withdraw rejected";
    } else if (result.status === "paid") {
      successMessage = "Agent withdraw marked as paid";
    }
  } catch (error) {
    errorMessage =
      error instanceof Error ? error.message : "Failed to review agent withdraw";
  }

  if (errorMessage) {
    redirectWithStatus("error", errorMessage);
  }

  revalidatePath(ADMIN_AGENT_WITHDRAWS_PATH);
  revalidatePath("/agent");
  redirectWithStatus("success", successMessage);
}