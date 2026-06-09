// src/lib/supabase/walletRequests.ts

"use server";

import { redirect } from "next/navigation";

import { createClient } from "./server";

type WalletRequestType = "deposit" | "withdraw";

type ReviewWalletRequestResponse = {
  success?: boolean;
  error?: string;
  status?: string;
  request_type?: string;
  amount?: number;
  new_balance?: number;
};

function getFormString(formData: FormData, key: string) {
  const value = formData.get(key);

  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

function redirectWithCashierMessage(message: string): never {
  redirect(`/cashier?message=${encodeURIComponent(message)}`);
}

function redirectWithCashierError(message: string): never {
  redirect(`/cashier?error=${encodeURIComponent(message)}`);
}

function redirectWithAdminWalletMessage(message: string): never {
  redirect(`/admin/wallet-requests?message=${encodeURIComponent(message)}`);
}

function redirectWithAdminWalletError(message: string): never {
  redirect(`/admin/wallet-requests?error=${encodeURIComponent(message)}`);
}

function isWalletRequestType(value: string): value is WalletRequestType {
  return value === "deposit" || value === "withdraw";
}

export async function submitWalletRequest(formData: FormData) {
  const requestType = getFormString(formData, "requestType");
  const amountText = getFormString(formData, "amount");
  const note = getFormString(formData, "note");

  if (!isWalletRequestType(requestType)) {
    redirectWithCashierError("Invalid wallet request type.");
  }

  const amount = Number(amountText);

  if (!Number.isFinite(amount) || amount < 1000) {
    redirectWithCashierError("Minimum request amount is 1,000 MMK.");
  }

  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login");
  }

  const { error } = await supabase.from("wallet_requests").insert({
    profile_id: user.id,
    request_type: requestType,
    amount,
    note: note || null,
    status: "pending",
  });

  if (error) {
    console.error("Wallet request submit error:", error.message);
    redirectWithCashierError("Could not submit wallet request.");
  }

  redirectWithCashierMessage("Wallet request submitted for admin review.");
}

async function reviewWalletRequest(
  formData: FormData,
  action: "approve" | "reject"
) {
  const requestId = getFormString(formData, "requestId");
  const adminNote = getFormString(formData, "adminNote");

  if (!requestId) {
    redirectWithAdminWalletError("Wallet request ID is missing.");
  }

  const supabase = await createClient();

  const { data, error } = await supabase.rpc("review_wallet_request", {
    p_request_id: requestId,
    p_action: action,
    p_admin_note: adminNote || null,
  });

  if (error) {
    console.error("Wallet request review RPC error:", error.message);
    redirectWithAdminWalletError("Could not review wallet request.");
  }

  const response = data as ReviewWalletRequestResponse | null;

  if (!response?.success) {
    console.error("Wallet request review rejected:", response?.error);
    redirectWithAdminWalletError(
      response?.error || "Wallet request review failed."
    );
  }

  if (action === "approve") {
    redirectWithAdminWalletMessage("Wallet request approved.");
  }

  redirectWithAdminWalletMessage("Wallet request rejected.");
}

export async function approveWalletRequest(formData: FormData) {
  await reviewWalletRequest(formData, "approve");
}

export async function rejectWalletRequest(formData: FormData) {
  await reviewWalletRequest(formData, "reject");
}