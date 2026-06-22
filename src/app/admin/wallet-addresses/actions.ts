//src/app/admin/wallet-addresses/actions.ts

"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

const PROVIDERS: Record<
  string,
  {
    providerName: string;
    sortOrder: number;
  }
> = {
  kbzpay: {
    providerName: "KBZPay",
    sortOrder: 1,
  },
  wavepay: {
    providerName: "WavePay",
    sortOrder: 2,
  },
  ayapay: {
    providerName: "AyaPay",
    sortOrder: 3,
  },
};

const DEFAULT_NOTE =
  "ငွေလွှဲပြီးပါက မှတ်ချက်ထဲတွင် လွှဲပြေစာနောက်ဆုံးနံပါတ် ၅လုံး ထည့်ပါ။";

function getText(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function getQrExtension(file: File) {
  if (file.type === "image/jpeg") return "jpg";
  if (file.type === "image/webp") return "webp";
  return "png";
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

  const walletAddressId = getText(formData, "wallet_address_id");
  const providerConfig = PROVIDERS[walletAddressId];

  if (!providerConfig) {
    redirect("/admin/wallet-addresses?error=Invalid payment provider");
  }

  const accountName = getText(formData, "account_name");
  const accountNumber = getText(formData, "account_number");
  const currentQrAssetPath = getText(formData, "current_qr_asset_path");
  const isActive = formData.get("is_active") === "on";
  const qrFileValue = formData.get("qr_file");

  let qrAssetPath = currentQrAssetPath;

  if (qrFileValue instanceof File && qrFileValue.size > 0) {
    if (!qrFileValue.type.startsWith("image/")) {
      redirect("/admin/wallet-addresses?error=QR file must be an image");
    }

    if (qrFileValue.size > 2 * 1024 * 1024) {
      redirect("/admin/wallet-addresses?error=QR image must be under 2MB");
    }

    const extension = getQrExtension(qrFileValue);
    const storagePath = `${walletAddressId}/${Date.now()}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from("wallet-qr")
      .upload(storagePath, qrFileValue, {
        cacheControl: "3600",
        contentType: qrFileValue.type,
        upsert: true,
      });

    if (uploadError) {
      redirect(
        `/admin/wallet-addresses?error=${encodeURIComponent(
          uploadError.message
        )}`
      );
    }

    const { data: publicUrlData } = supabase.storage
      .from("wallet-qr")
      .getPublicUrl(storagePath);

    qrAssetPath = publicUrlData.publicUrl;
  }

  if (isActive && (!accountName || !accountNumber || !qrAssetPath)) {
    redirect(
      `/admin/wallet-addresses?error=${encodeURIComponent(
        "Active provider needs account name, account number, and QR image"
      )}`
    );
  }

  const { error } = await supabase.from("wallet_addresses").upsert({
    id: walletAddressId,
    provider_key: walletAddressId,
    provider_name: providerConfig.providerName,
    account_name: accountName,
    account_number: accountNumber,
    qr_asset_path: qrAssetPath,
    minimum_deposit: 3000,
    minimum_withdraw: 3000,
    admin_note: DEFAULT_NOTE,
    sort_order: providerConfig.sortOrder,
    is_active: isActive,
    updated_by: user.id,
  });

  if (error) {
    redirect(
      `/admin/wallet-addresses?error=${encodeURIComponent(error.message)}`
    );
  }

  redirect(
    `/admin/wallet-addresses?success=${encodeURIComponent(
      `${providerConfig.providerName} saved`
    )}`
  );
}