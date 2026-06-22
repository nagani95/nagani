//src/app/admin/wallet-addresses/page.tsx

import Link from "next/link";

import AdminShell from "@/components/admin/AdminShell";
import { createClient } from "@/lib/supabase/server";
import { updateWalletAddressAction } from "./actions";

export const dynamic = "force-dynamic";

type WalletAddressRow = {
  id: string;
  provider_key: string | null;
  provider_name: string;
  account_name: string;
  account_number: string;
  qr_asset_path: string;
  is_active: boolean;
  updated_at: string | null;
};

type AdminWalletAddressesPageProps = {
  searchParams?: Promise<{
    success?: string;
    error?: string;
  }>;
};

const PROVIDERS = [
  {
    id: "kbzpay",
    name: "KBZPay",
  },
  {
    id: "wavepay",
    name: "WavePay",
  },
  {
    id: "ayapay",
    name: "AyaPay",
  },
];

function buildWalletAddresses(rows: WalletAddressRow[]) {
  const rowsById = new Map(rows.map((row) => [row.id, row]));

  return PROVIDERS.map((provider) => {
    const row = rowsById.get(provider.id);

    return {
      id: provider.id,
      provider_key: provider.id,
      provider_name: provider.name,
      account_name: row?.account_name ?? "",
      account_number: row?.account_number ?? "",
      qr_asset_path: row?.qr_asset_path ?? "",
      is_active: row?.is_active ?? false,
      updated_at: row?.updated_at ?? null,
    } satisfies WalletAddressRow;
  });
}

export default async function AdminWalletAddressesPage({
  searchParams,
}: AdminWalletAddressesPageProps) {
  const params = searchParams ? await searchParams : {};
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("wallet_addresses")
    .select(
      "id, provider_key, provider_name, account_name, account_number, qr_asset_path, is_active, updated_at"
    )
    .order("sort_order", { ascending: true });

  const walletAddresses = buildWalletAddresses(
    (data ?? []) as WalletAddressRow[]
  );

  return (
    <AdminShell
      title="Wallet Addresses"
      eyebrow="Payment Networks"
      description="Upload QR screenshots and control KBZPay, WavePay, and AyaPay."
      action={
        <Link
          href="/admin/wallet-requests"
          className="rounded-full border border-emerald-300/20 bg-emerald-400/10 px-4 py-2 text-xs font-black text-emerald-100/85 transition hover:bg-emerald-300 hover:text-black"
        >
          Wallet Requests
        </Link>
      }
    >
      {params.success ? (
        <section className="rounded-2xl border border-emerald-400/25 bg-emerald-950/25 p-4">
          <p className="text-sm font-black text-emerald-100">
            {params.success}
          </p>
        </section>
      ) : null}

      {params.error ? (
        <section className="rounded-2xl border border-red-400/25 bg-red-950/25 p-4">
          <p className="text-sm font-black text-red-100">{params.error}</p>
        </section>
      ) : null}

      {error ? (
        <section className="mt-3 rounded-2xl border border-red-400/25 bg-red-950/25 p-4">
          <p className="text-sm font-black text-red-100">
            Wallet address warning
          </p>
          <p className="mt-1 text-xs font-semibold text-red-100/70">
            {error.message}
          </p>
        </section>
      ) : null}

      <section className="mt-4 grid gap-4 xl:grid-cols-3">
        {walletAddresses.map((walletAddress) => (
          <article
            key={walletAddress.id}
            className="rounded-2xl border border-amber-300/14 bg-black/35 p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.22em] text-amber-200/45">
                  Payment
                </p>
                <h2 className="mt-1 text-2xl font-black text-amber-100">
                  {walletAddress.provider_name}
                </h2>
              </div>

              <span
                className={
                  walletAddress.is_active
                    ? "rounded-full border border-emerald-300/20 bg-emerald-400/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-emerald-100"
                    : "rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-white/40"
                }
              >
                {walletAddress.is_active ? "Active" : "Hidden"}
              </span>
            </div>

            <div className="mt-4 overflow-hidden rounded-2xl border border-amber-300/15 bg-white p-3">
              {walletAddress.qr_asset_path ? (
                <img
                  src={walletAddress.qr_asset_path}
                  alt={`${walletAddress.provider_name} QR`}
                  className="aspect-square w-full rounded-xl object-contain"
                />
              ) : (
                <div className="flex aspect-square items-center justify-center rounded-xl bg-stone-100 text-center text-sm font-black text-stone-400">
                  QR screenshot မတင်ရသေးပါ
                </div>
              )}
            </div>

            <form
              action={updateWalletAddressAction}
              encType="multipart/form-data"
              className="mt-4 grid gap-3"
            >
              <input
                type="hidden"
                name="wallet_address_id"
                value={walletAddress.id}
              />

              <input
                type="hidden"
                name="current_qr_asset_path"
                value={walletAddress.qr_asset_path}
              />

              <label>
                <span className="text-[11px] font-black uppercase tracking-[0.16em] text-white/40">
                  Account Name
                </span>
                <input
                  name="account_name"
                  defaultValue={walletAddress.account_name}
                  placeholder="Account name"
                  className="mt-2 w-full rounded-xl border border-amber-300/15 bg-black/35 px-4 py-3 text-sm font-bold text-amber-50 outline-none placeholder:text-white/25 focus:border-amber-300/40"
                />
              </label>

              <label>
                <span className="text-[11px] font-black uppercase tracking-[0.16em] text-white/40">
                  Account Number
                </span>
                <input
                  name="account_number"
                  defaultValue={walletAddress.account_number}
                  placeholder="Phone / account number"
                  className="mt-2 w-full rounded-xl border border-amber-300/15 bg-black/35 px-4 py-3 text-sm font-bold text-amber-50 outline-none placeholder:text-white/25 focus:border-amber-300/40"
                />
              </label>

              <label>
                <span className="text-[11px] font-black uppercase tracking-[0.16em] text-white/40">
                  QR Screenshot
                </span>
                <input
                  name="qr_file"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="mt-2 w-full rounded-xl border border-amber-300/15 bg-black/35 px-4 py-3 text-sm font-bold text-amber-50 file:mr-3 file:rounded-full file:border-0 file:bg-amber-300 file:px-3 file:py-1.5 file:text-xs file:font-black file:text-black"
                />
                <p className="mt-1 text-[11px] font-bold text-white/35">
                  Upload screenshot QR PNG/JPG/WebP. Max 2MB.
                </p>
              </label>

              <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/25 px-4 py-3">
                <input
                  name="is_active"
                  type="checkbox"
                  defaultChecked={walletAddress.is_active}
                  className="h-4 w-4"
                />
                <span className="text-sm font-black text-amber-100">
                  Show {walletAddress.provider_name} to players
                </span>
              </label>

              <button
                type="submit"
                className="rounded-full border border-amber-200/35 bg-[linear-gradient(180deg,#f7c96b,#b45309)] px-5 py-4 text-sm font-black uppercase tracking-[0.18em] text-[#260703] shadow-lg shadow-amber-950/40 transition hover:brightness-110"
              >
                Save {walletAddress.provider_name}
              </button>
            </form>
          </article>
        ))}
      </section>
    </AdminShell>
  );
}