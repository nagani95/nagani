//src/app/admin/wallet-addresses/page.tsx

import Image from "next/image";
import Link from "next/link";

import AdminShell from "@/components/admin/AdminShell";
import { createClient } from "@/lib/supabase/server";
import { updateWalletAddressAction } from "./actions";

export const dynamic = "force-dynamic";

type WalletAddressRow = {
  id: string;
  provider_name: string;
  account_name: string;
  account_number: string;
  qr_asset_path: string;
  minimum_deposit: number | string;
  minimum_withdraw: number | string;
  admin_note: string;
  is_active: boolean;
  updated_at: string | null;
};

type AdminWalletAddressesPageProps = {
  searchParams?: Promise<{
    success?: string;
    error?: string;
  }>;
};

const fallbackWalletAddress: WalletAddressRow = {
  id: "main",
  provider_name: "KBZ Pay",
  account_name: "စိုးပြည့်စုံ",
  account_number: "09957117174",
  qr_asset_path: "/assets/nagani/wallet/deposit-q.png",
  minimum_deposit: 3000,
  minimum_withdraw: 3000,
  admin_note:
    "ငွေလွှဲပြီးပါက မှတ်ချက်ထဲတွင် လွှဲပြေစာနောက်ဆုံးနံပါတ် 6လုံး ထည့်ပါ။",
  is_active: true,
  updated_at: null,
};

function formatMMK(amount: number | string | null | undefined) {
  const safeAmount = Number(amount ?? 0);
  return `${new Intl.NumberFormat("en-US").format(safeAmount)} MMK`;
}

function formatTime(value: string | null) {
  if (!value) return "—";

  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Yangon",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(new Date(value));
}

export default async function AdminWalletAddressesPage({
  searchParams,
}: AdminWalletAddressesPageProps) {
  const params = searchParams ? await searchParams : {};
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("wallet_addresses")
    .select(
      "id, provider_name, account_name, account_number, qr_asset_path, minimum_deposit, minimum_withdraw, admin_note, is_active, updated_at"
    )
    .eq("id", "main")
    .maybeSingle<WalletAddressRow>();

  const walletAddress = data ?? fallbackWalletAddress;

  return (
    <AdminShell
      title="Wallet Address"
      eyebrow="Deposit Account"
      description="Live deposit account shown to players on the cashier page. Admin edits here update the player wallet page."
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

      <section className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-emerald-300/15 bg-emerald-400/10 p-4">
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-emerald-100/55">
            Status
          </p>
          <p className="mt-2 text-2xl font-black text-emerald-100">
            {walletAddress.is_active ? "Active" : "Hidden"}
          </p>
        </div>

        <div className="rounded-2xl border border-amber-300/15 bg-amber-300/10 p-4">
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-amber-100/55">
            Provider
          </p>
          <p className="mt-2 text-2xl font-black text-amber-100">
            {walletAddress.provider_name}
          </p>
        </div>

        <div className="rounded-2xl border border-sky-300/15 bg-sky-400/10 p-4">
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-sky-100/55">
            Minimum Deposit
          </p>
          <p className="mt-2 text-2xl font-black text-sky-100">
            {formatMMK(walletAddress.minimum_deposit)}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-white/40">
            Updated
          </p>
          <p className="mt-2 text-sm font-black text-white/70">
            {formatTime(walletAddress.updated_at)}
          </p>
        </div>
      </section>

      <section className="mt-4 grid gap-4 xl:grid-cols-[360px_1fr]">
        <article className="rounded-2xl border border-amber-300/12 bg-black/35 p-4">
          <p className="text-[11px] font-black uppercase tracking-[0.28em] text-amber-200/45">
            Player Preview
          </p>

          <h2 className="mt-1 text-xl font-black text-amber-100">
            Deposit QR
          </h2>

          <div className="mt-4 overflow-hidden rounded-2xl border border-amber-300/15 bg-white p-4">
            <Image
              src={walletAddress.qr_asset_path}
              alt="Deposit QR code"
              width={320}
              height={320}
              className="h-auto w-full rounded-xl"
              priority
            />
          </div>

          <div className="mt-4 space-y-3 rounded-xl border border-white/10 bg-black/25 p-4">
            <div>
              <p className="text-xs font-bold text-white/35">Provider</p>
              <p className="mt-1 text-lg font-black text-amber-100">
                {walletAddress.provider_name}
              </p>
            </div>

            <div>
              <p className="text-xs font-bold text-white/35">Account Name</p>
              <p className="mt-1 text-lg font-black text-amber-100">
                {walletAddress.account_name}
              </p>
            </div>

            <div>
              <p className="text-xs font-bold text-white/35">Account Number</p>
              <p className="mt-1 text-lg font-black text-emerald-100">
                {walletAddress.account_number}
              </p>
            </div>
          </div>
        </article>

        <article className="rounded-2xl border border-amber-300/12 bg-black/35 p-4">
          <p className="text-[11px] font-black uppercase tracking-[0.28em] text-amber-200/45">
            Edit Live Wallet Address
          </p>

          <h2 className="mt-1 text-xl font-black text-amber-100">
            Player Cashier Deposit Info
          </h2>

          <form action={updateWalletAddressAction} className="mt-4 grid gap-3">
            <div className="grid gap-3 md:grid-cols-2">
              <label>
                <span className="text-[11px] font-black uppercase tracking-[0.18em] text-white/40">
                  Provider Name
                </span>
                <input
                  name="provider_name"
                  required
                  defaultValue={walletAddress.provider_name}
                  className="mt-2 w-full rounded-xl border border-amber-300/15 bg-black/35 px-4 py-3 text-sm font-bold text-amber-50 outline-none focus:border-amber-300/40"
                />
              </label>

              <label>
                <span className="text-[11px] font-black uppercase tracking-[0.18em] text-white/40">
                  Account Name
                </span>
                <input
                  name="account_name"
                  required
                  defaultValue={walletAddress.account_name}
                  className="mt-2 w-full rounded-xl border border-amber-300/15 bg-black/35 px-4 py-3 text-sm font-bold text-amber-50 outline-none focus:border-amber-300/40"
                />
              </label>

              <label>
                <span className="text-[11px] font-black uppercase tracking-[0.18em] text-white/40">
                  Account Number
                </span>
                <input
                  name="account_number"
                  required
                  defaultValue={walletAddress.account_number}
                  className="mt-2 w-full rounded-xl border border-amber-300/15 bg-black/35 px-4 py-3 text-sm font-bold text-amber-50 outline-none focus:border-amber-300/40"
                />
              </label>

              <label>
                <span className="text-[11px] font-black uppercase tracking-[0.18em] text-white/40">
                  QR Asset Path
                </span>
                <input
                  name="qr_asset_path"
                  required
                  defaultValue={walletAddress.qr_asset_path}
                  className="mt-2 w-full rounded-xl border border-amber-300/15 bg-black/35 px-4 py-3 text-sm font-bold text-amber-50 outline-none focus:border-amber-300/40"
                />
              </label>

              <label>
                <span className="text-[11px] font-black uppercase tracking-[0.18em] text-white/40">
                  Minimum Deposit
                </span>
                <input
                  name="minimum_deposit"
                  required
                  type="number"
                  min="0"
                  step="100"
                  defaultValue={Number(walletAddress.minimum_deposit)}
                  className="mt-2 w-full rounded-xl border border-amber-300/15 bg-black/35 px-4 py-3 text-sm font-bold text-amber-50 outline-none focus:border-amber-300/40"
                />
              </label>

              <label>
                <span className="text-[11px] font-black uppercase tracking-[0.18em] text-white/40">
                  Minimum Withdraw
                </span>
                <input
                  name="minimum_withdraw"
                  required
                  type="number"
                  min="0"
                  step="100"
                  defaultValue={Number(walletAddress.minimum_withdraw)}
                  className="mt-2 w-full rounded-xl border border-amber-300/15 bg-black/35 px-4 py-3 text-sm font-bold text-amber-50 outline-none focus:border-amber-300/40"
                />
              </label>
            </div>

            <label>
              <span className="text-[11px] font-black uppercase tracking-[0.18em] text-white/40">
                Player Note
              </span>
              <textarea
                name="admin_note"
                required
                defaultValue={walletAddress.admin_note}
                rows={3}
                className="mt-2 w-full rounded-xl border border-amber-300/15 bg-black/35 px-4 py-3 text-sm font-bold text-amber-50 outline-none focus:border-amber-300/40"
              />
            </label>

            <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/25 px-4 py-3">
              <input
                name="is_active"
                type="checkbox"
                defaultChecked={walletAddress.is_active}
                className="h-4 w-4"
              />
              <span className="text-sm font-black text-amber-100">
                Show this deposit address to players
              </span>
            </label>

            <button
              type="submit"
              className="rounded-full border border-amber-200/35 bg-[linear-gradient(180deg,#f7c96b,#b45309)] px-5 py-4 text-sm font-black uppercase tracking-[0.18em] text-[#260703] shadow-lg shadow-amber-950/40 transition hover:brightness-110"
            >
              Save Wallet Address
            </button>
          </form>
        </article>
      </section>
    </AdminShell>
  );
}