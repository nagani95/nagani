//src/app/admin/wallet-addresses/actions.ts

"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

function getText(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function getNumber(formData: FormData, key: string) {
  const value = Number(formData.get(key) ?? 0);
  return Number.isFinite(value) ? value : 0;
}

export async function updateWalletAddressAction(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: isAdmin, error: adminError } =
    await supabase.rpc("is_nagani_admin");

  if (adminError || !isAdmin) {
    redirect("/admin/wallet-addresses?error=Admin access denied");
  }

  const providerName = getText(formData, "provider_name");
  const accountName = getText(formData, "account_name");
  const accountNumber = getText(formData, "account_number");
  const qrAssetPath = getText(formData, "qr_asset_path");
  const adminNote = getText(formData, "admin_note");
  const minimumDeposit = getNumber(formData, "minimum_deposit");
  const minimumWithdraw = getNumber(formData, "minimum_withdraw");
  const isActive = formData.get("is_active") === "on";

  if (!providerName || !accountName || !accountNumber || !qrAssetPath) {
    redirect("/admin/wallet-addresses?error=Missing required wallet address field");
  }

  const { error } = await supabase.from("wallet_addresses").upsert({
    id: "main",
    provider_name: providerName,
    account_name: accountName,
    account_number: accountNumber,
    qr_asset_path: qrAssetPath,
    minimum_deposit: minimumDeposit,
    minimum_withdraw: minimumWithdraw,
    admin_note: adminNote,
    is_active: isActive,
    updated_by: user.id,
  });

  if (error) {
    redirect(`/admin/wallet-addresses?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/admin/wallet-addresses?success=Wallet address updated");
}