// src/app/admin/users/page.tsx

import Link from "next/link";

import AdminShell from "@/components/admin/AdminShell";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 25;

type AdminUsersPageProps = {
  searchParams?: Promise<{
    page?: string;
  }>;
};

type ProfileRow = {
  id: string;
  username: string | null;
  member_code: string | null;
  created_at: string;
};

type WalletRow = {
  id: string;
  profile_id: string;
  balance: number | string;
  bonus_balance: number | string | null;
  updated_at: string | null;
};

type WalletTransactionRow = {
  wallet_id: string;
  transaction_type: string | null;
  amount: number | string;
  description: string | null;
};

type BetRow = {
  profile_id: string;
  amount: number | string;
  cash_amount: number | string | null;
  bonus_amount: number | string | null;
  settled: boolean | null;
};

function formatAmount(amount: number | string | null | undefined) {
  const safeAmount = Number(amount ?? 0);
  return new Intl.NumberFormat("en-US").format(safeAmount);
}

function formatMemberId(profile: ProfileRow) {
  return profile.member_code || `NG-${profile.id.slice(0, 8).toUpperCase()}`;
}

function formatTime(value: string | null | undefined) {
  if (!value) return "—";

  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Yangon",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function getSafePage(value: string | undefined) {
  const page = Number(value ?? 1);
  return Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
}

function isWinTransaction(transaction: WalletTransactionRow) {
  const text = `${transaction.transaction_type ?? ""} ${
    transaction.description ?? ""
  }`.toLowerCase();

  return (
    text.includes("win") ||
    text.includes("payout") ||
    text.includes("settle") ||
    text.includes("reward")
  );
}

export default async function AdminUsersPage({
  searchParams,
}: AdminUsersPageProps) {
  const resolvedSearchParams = await searchParams;
  const page = getSafePage(resolvedSearchParams?.page);
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const supabase = await createClient();

  const {
    data: profiles,
    error: profilesError,
    count: profileCount,
  } = await supabase
    .from("profiles")
    .select("id, username, member_code, created_at", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to)
    .returns<ProfileRow[]>();

  const profileIds = (profiles ?? []).map((profile) => profile.id);

  const { data: wallets, error: walletsError } =
    profileIds.length > 0
      ? await supabase
          .from("wallets")
          .select("id, profile_id, balance, bonus_balance, updated_at")
          .in("profile_id", profileIds)
          .returns<WalletRow[]>()
      : { data: [], error: null };

  const walletIds = (wallets ?? []).map((wallet) => wallet.id);

  const { data: walletTransactions, error: walletTransactionsError } =
    walletIds.length > 0
      ? await supabase
          .from("wallet_transactions")
          .select("wallet_id, transaction_type, amount, description")
          .in("wallet_id", walletIds)
          .returns<WalletTransactionRow[]>()
      : { data: [], error: null };

  const { data: settledBets, error: settledBetsError } =
    profileIds.length > 0
      ? await supabase
          .from("six_animal_bets")
          .select("profile_id, amount, cash_amount, bonus_amount, settled")
          .in("profile_id", profileIds)
          .eq("settled", true)
          .returns<BetRow[]>()
      : { data: [], error: null };

  const walletByProfileId = new Map(
    (wallets ?? []).map((wallet) => [wallet.profile_id, wallet])
  );

  const winByWalletId = new Map<string, number>();
  for (const transaction of walletTransactions ?? []) {
    if (!isWinTransaction(transaction)) continue;

    winByWalletId.set(
      transaction.wallet_id,
      (winByWalletId.get(transaction.wallet_id) ?? 0) +
        Math.abs(Number(transaction.amount ?? 0))
    );
  }

  const lossByProfileId = new Map<string, number>();
  for (const bet of settledBets ?? []) {
    lossByProfileId.set(
      bet.profile_id,
      (lossByProfileId.get(bet.profile_id) ?? 0) + Number(bet.amount ?? 0)
    );
  }

  const loadedCount = profiles?.length ?? 0;
  const totalPlayers = profileCount ?? loadedCount;
  const totalPages = Math.max(1, Math.ceil(totalPlayers / PAGE_SIZE));
  const walletCount = wallets?.length ?? 0;

  const totalCashBalance = (wallets ?? []).reduce(
    (sum, wallet) => sum + Number(wallet.balance ?? 0),
    0
  );

  const totalBonusBalance = (wallets ?? []).reduce(
    (sum, wallet) => sum + Number(wallet.bonus_balance ?? 0),
    0
  );

  const totalLoadedBalance = totalCashBalance + totalBonusBalance;

  const errors = [
    profilesError ? `Profiles: ${profilesError.message}` : null,
    walletsError ? `Wallets: ${walletsError.message}` : null,
    walletTransactionsError
      ? `Wallet transactions: ${walletTransactionsError.message}`
      : null,
    settledBetsError ? `Six animal bets: ${settledBetsError.message}` : null,
  ].filter((error): error is string => Boolean(error));

  const previousPage = Math.max(1, page - 1);
  const nextPage = Math.min(totalPages, page + 1);

  return (
    <AdminShell
      title="Users"
      eyebrow="Member Records"
      description="Latest registered players with clear wallet, bonus, win, lose, and paged admin navigation."
    >
      {errors.length > 0 ? (
        <section className="rounded-2xl border border-red-400/25 bg-red-950/25 p-4">
          <p className="text-sm font-black text-red-100">
            User records warning
          </p>

          <div className="mt-2 space-y-1">
            {errors.map((error) => (
              <p key={error} className="text-xs font-semibold text-red-100/70">
                {error}
              </p>
            ))}
          </div>
        </section>
      ) : null}

      <section className="grid gap-3 md:grid-cols-4">
        <div className="rounded-2xl border border-amber-300/15 bg-amber-300/10 p-4 text-center">
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-amber-100/55">
            Players
          </p>
          <p className="mt-2 text-2xl font-black text-amber-100">
            {formatAmount(totalPlayers)}
          </p>
        </div>

        <div className="rounded-2xl border border-emerald-300/15 bg-emerald-400/10 p-4 text-center">
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-emerald-100/55">
            Cash
          </p>
          <p className="mt-2 text-2xl font-black text-emerald-100">
            {formatAmount(totalCashBalance)}
          </p>
        </div>

        <div className="rounded-2xl border border-sky-300/15 bg-sky-400/10 p-4 text-center">
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-sky-100/55">
            Bonus
          </p>
          <p className="mt-2 text-2xl font-black text-sky-100">
            {formatAmount(totalBonusBalance)}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-center">
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-white/40">
            Total Loaded
          </p>
          <p className="mt-2 truncate text-2xl font-black text-amber-100">
            {formatAmount(totalLoadedBalance)}
          </p>
        </div>
      </section>

      <section className="mt-4 rounded-2xl border border-amber-300/12 bg-black/35 p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.28em] text-white/35">
              Loaded Players
            </p>
            <h2 className="mt-1 text-xl font-black text-amber-100">
              Player List
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <p className="rounded-full border border-white/10 bg-black/30 px-4 py-2 text-xs font-black text-white/50">
              Page {page} / {totalPages}
            </p>

            <p className="rounded-full border border-white/10 bg-black/30 px-4 py-2 text-xs font-black text-white/50">
              Showing {loadedCount} of {totalPlayers}
            </p>
          </div>
        </div>

<div className="mt-4 overflow-hidden rounded-xl border border-amber-300/15 bg-[#050202] shadow-[0_0_0_1px_rgba(251,191,36,0.04)]">
  <div className="overflow-x-auto">
    <table className="w-full min-w-[1180px] border-collapse text-sm">
      <colgroup>
        <col className="w-[130px]" />
        <col className="w-[170px]" />
        <col className="w-[135px]" />
        <col className="w-[135px]" />
        <col className="w-[145px]" />
        <col className="w-[135px]" />
        <col className="w-[135px]" />
        <col className="w-[150px]" />
        <col className="w-[105px]" />
      </colgroup>

      <thead>
        <tr className="bg-[#24100b] text-[10px] font-black uppercase tracking-[0.16em] text-amber-100/70">
          <th className="border-b border-r border-amber-300/15 px-4 py-4 text-left">
            Player
          </th>
          <th className="border-b border-r border-amber-300/15 px-4 py-4 text-left">
            Phone
          </th>
          <th className="border-b border-r border-amber-300/15 px-4 py-4 text-right">
            Cash
          </th>
          <th className="border-b border-r border-amber-300/15 px-4 py-4 text-right">
            Bonus
          </th>
          <th className="border-b border-r border-amber-300/15 px-4 py-4 text-right">
            Total
          </th>
          <th className="border-b border-r border-amber-300/15 px-4 py-4 text-right">
            Win
          </th>
          <th className="border-b border-r border-amber-300/15 px-4 py-4 text-right">
            Bet/Lose
          </th>
          <th className="border-b border-r border-amber-300/15 px-4 py-4 text-center">
            Joined
          </th>
          <th className="border-b border-amber-300/15 px-4 py-4 text-center">
            Control
          </th>
        </tr>
      </thead>

      <tbody>
        {loadedCount === 0 ? (
          <tr>
            <td
              colSpan={9}
              className="px-4 py-8 text-center text-sm font-bold text-white/45"
            >
              No players found.
            </td>
          </tr>
        ) : null}

        {(profiles ?? []).map((profile) => {
          const wallet = walletByProfileId.get(profile.id);
          const cashBalance = Number(wallet?.balance ?? 0);
          const bonusBalance = Number(wallet?.bonus_balance ?? 0);
          const totalBalance = cashBalance + bonusBalance;
          const totalWin = wallet ? winByWalletId.get(wallet.id) ?? 0 : 0;
          const totalLoss = lossByProfileId.get(profile.id) ?? 0;

          return (
            <tr
              key={profile.id}
              tabIndex={0}
              aria-label={`Select player ${formatMemberId(profile)}`}
              className="group cursor-pointer border-b border-white/[0.06] bg-black/[0.16] outline-none transition hover:bg-amber-300/[0.045] focus:bg-amber-300/[0.09] active:bg-amber-300/[0.12]"
            >
              <td className="border-r border-white/[0.05] px-4 py-3 text-left font-black text-amber-100 group-focus:text-white">
                {formatMemberId(profile)}
              </td>

              <td className="border-r border-white/[0.05] px-4 py-3 text-left font-bold text-white/70 group-focus:text-amber-50">
                <span className="break-all">{profile.username || "—"}</span>
              </td>

              <td className="border-r border-white/[0.05] px-4 py-3 text-right font-black tabular-nums text-emerald-100">
                {formatAmount(cashBalance)}
              </td>

              <td className="border-r border-white/[0.05] px-4 py-3 text-right font-black tabular-nums text-sky-100">
                {formatAmount(bonusBalance)}
              </td>

              <td className="border-r border-white/[0.05] px-4 py-3 text-right font-black tabular-nums text-amber-100">
                {formatAmount(totalBalance)}
              </td>

              <td className="border-r border-white/[0.05] px-4 py-3 text-right font-black tabular-nums text-lime-100">
                {formatAmount(totalWin)}
              </td>

              <td className="border-r border-white/[0.05] px-4 py-3 text-right font-black tabular-nums text-red-100/90">
                {formatAmount(totalLoss)}
              </td>

              <td className="border-r border-white/[0.05] px-4 py-3 text-center font-bold tabular-nums text-white/48 group-focus:text-white/75">
                {formatTime(profile.created_at)}
              </td>

              <td className="px-4 py-3 text-center">
                <Link
                  href="/admin/wallet-requests"
                  className="inline-flex items-center justify-center rounded-md border border-amber-300/20 bg-black/30 px-3 py-2 text-xs font-black text-amber-100/85 transition hover:border-amber-300/45 hover:bg-amber-300/15 hover:text-amber-50"
                >
                  Open
                </Link>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
</div>

        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-center text-xs font-bold text-white/40 sm:text-left">
            Wallets found on this page: {walletCount}
          </p>

          <div className="flex items-center justify-center gap-2">
            <Link
              href={`/admin/users?page=${previousPage}`}
              aria-disabled={page <= 1}
              className={`rounded-full border px-4 py-2 text-xs font-black transition ${
                page <= 1
                  ? "pointer-events-none border-white/10 bg-white/[0.02] text-white/20"
                  : "border-amber-300/20 bg-amber-300/10 text-amber-100 hover:bg-amber-300 hover:text-black"
              }`}
            >
              Previous
            </Link>

            <Link
              href={`/admin/users?page=${nextPage}`}
              aria-disabled={page >= totalPages}
              className={`rounded-full border px-4 py-2 text-xs font-black transition ${
                page >= totalPages
                  ? "pointer-events-none border-white/10 bg-white/[0.02] text-white/20"
                  : "border-amber-300/20 bg-amber-300/10 text-amber-100 hover:bg-amber-300 hover:text-black"
              }`}
            >
              Next
            </Link>
          </div>
        </div>
      </section>
    </AdminShell>
  );
}