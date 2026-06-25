//src/app/agent/withdraw/actions.ts

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

const AGENT_WITHDRAW_PATH = "/agent/withdraw";

type WithdrawResult = {
  id?: string;
};

function getText(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function getAmount(formData: FormData) {
  const raw = getText(formData, "amount");
  const amount = Number(raw);

  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error("Withdraw amount must be greater than 0");
  }

  return amount;
}

function getProviderName(providerKey: string) {
  if (providerKey === "kpay") return "KBZPay";
  if (providerKey === "wavepay") return "WavePay";
  if (providerKey === "ayapay") return "AYA Pay";
  if (providerKey === "cbpay") return "CB Pay";
  return providerKey || "Other";
}

function redirectWithStatus(type: "success" | "error", message: string): never {
  redirect(`${AGENT_WITHDRAW_PATH}?${type}=${encodeURIComponent(message)}`);
}

export async function createAgentWithdrawAction(formData: FormData) {
  const supabase = await createClient();

  let errorMessage: string | null = null;

  try {
    const amount = getAmount(formData);
    const providerKey = getText(formData, "payment_provider_key");
    const accountName = getText(formData, "payment_account_name");
    const accountNumber = getText(formData, "payment_account_number");
    const currentPassword = getText(formData, "current_password");
    const note = getText(formData, "note") || null;

    if (!currentPassword) {
      throw new Error("လက်ရှိစကားဝှက် ရိုက်ပါ။");
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user?.email) {
      throw new Error("Agent login ပြန်ဝင်ပါ။");
    }

    const { error: passwordError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPassword,
    });

    if (passwordError) {
      throw new Error("လက်ရှိစကားဝှက် မှားနေပါသည်။");
    }

    if (!providerKey) {
      throw new Error("Payment method is required");
    }

    if (!accountName) {
      throw new Error("Account name is required");
    }

    if (!accountNumber) {
      throw new Error("Account number is required");
    }

    const { data, error } = await supabase.rpc("create_agent_withdraw_request", {
      p_amount: amount,
      p_payment_provider_key: providerKey,
      p_payment_provider_name: getProviderName(providerKey),
      p_payment_account_name: accountName,
      p_payment_account_number: accountNumber,
      p_note: note,
    });

    if (error) {
      throw new Error(error.message);
    }

    const result = data as WithdrawResult | null;

    if (!result?.id) {
      throw new Error("Withdraw request was not created");
    }
  } catch (error) {
    errorMessage =
      error instanceof Error ? error.message : "Failed to submit withdraw";
  }

  if (errorMessage) {
    redirectWithStatus("error", errorMessage);
  }

  revalidatePath("/agent");
  revalidatePath(AGENT_WITHDRAW_PATH);
  redirectWithStatus("success", "ငွေထုတ်တောင်းဆိုမှု ပို့ပြီးပါပြီ။");
}