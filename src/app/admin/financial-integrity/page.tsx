//src/app/admin/financial-integrity/page.tsx

import Link from "next/link";

import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type FinancialIntegrityRow = {
  checked_at: string | null;
  negative_wallet_count: number | string | null;
  duplicate_bet_pair_count: number | string | null;
  old_unsettled_bet_count: number | string | null;
  recent_six_animal_transaction_count: number | string | null;
  recent_payout_count: number | string | null;
  latest_bet_created_at: string | null;
  latest_transaction_created_at: string | null;
  negative_wallets: unknown;
  duplicate_bets: unknown;
  old_unsettled_bets: unknown;
  recent_transactions: unknown;
  recent_payouts: unknown;
  latest_timeline: unknown;
};

type JsonRecord = Record<string, unknown>;

function toNumber(value: unknown) {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  return 0;
}

function toText(value: unknown) {
  if (value === null || value === undefined) return "—";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  return "—";
}

function toTimeValue(value: unknown) {
  return typeof value === "string" ? value : null;
}

function asRecords(value: unknown): JsonRecord[] {
  if (!Array.isArray(value)) return [];

  return value.filter(
    (item): item is JsonRecord =>
      typeof item === "object" && item !== null && !Array.isArray(item)
  );
}

function formatAmount(value: unknown) {
  return `${new Intl.NumberFormat("en-US").format(toNumber(value))} MMK`;
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

function getStatusTone(status: "healthy" | "watch" | "danger") {
  if (status === "healthy") {
    return "border-emerald-400/20 bg-emerald-400/10 text-emerald-100";
  }

  if (status === "watch") {
    return "border-amber-400/25 bg-amber-400/10 text-amber-100";
  }

  return "border-red-400/25 bg-red-400/10 text-red-100";
}

function buildWarnings(integrity: FinancialIntegrityRow | null) {
  if (!integrity) return ["Financial integrity snapshot was not returned."];

  const warnings: string[] = [];

  const negativeWalletCount = toNumber(integrity.negative_wallet_count);
  const duplicateBetPairCount = toNumber(integrity.duplicate_bet_pair_count);
  const oldUnsettledBetCount = toNumber(integrity.old_unsettled_bet_count);

  if (negativeWalletCount > 0) {
    warnings.push(`${negativeWalletCount} wallet balance issue found.`);
  }

  if (duplicateBetPairCount > 0) {
    warnings.push(`${duplicateBetPairCount} duplicate bet pair found.`);
  }

  if (oldUnsettledBetCount > 0) {
    warnings.push(`${oldUnsettledBetCount} old unsettled bet found.`);
  }

  return warnings;
}

function EmptyState({ message }: { message: string }) {
  return (
    <p className="rounded-2xl border border-white/10 bg-black/30 p-4 text-sm font-bold text-white/40">
      {message}
    </p>
  );
}

export default async function AdminFinancialIntegrityPage() {
  const supabase = await createClient();

  const { data: integrity, error } = await supabase
    .rpc("get_six_animal_financial_integrity")
    .maybeSingle<FinancialIntegrityRow>();

  const warnings = buildWarnings(integrity);
  const isHealthy = !error && warnings.length === 0;

  const negativeWallets = asRecords(integrity?.negative_wallets);
  const duplicateBets = asRecords(integrity?.duplicate_bets);
  const oldUnsettledBets = asRecords(integrity?.old_unsettled_bets);
  const recentTransactions = asRecords(integrity?.recent_transactions);
  const recentPayouts = asRecords(integrity?.recent_payouts);
  const latestTimeline = asRecords(integrity?.latest_timeline);

  return (
    <main className="min-h-screen bg-[#090202] px-5 py-6 text-white">
      <section className="mx-auto w-full max-w-6xl">
        <Link href="/admin" className="text-sm font-bold text-amber-300">
          ← Admin Home
        </Link>

        <header className="mt-6 rounded-[2rem] border border-red-500/25 bg-gradient-to-br from-red-950 via-[#160303] to-black p-6">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-red-200/60">
            Financial Integrity
          </p>

          <div className="mt-3 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-4xl font-black text-amber-100">
                Wallet Safety Monitor
              </h1>

              <p className="mt-3 max-w-3xl text-sm leading-6 text-amber-50/65">
                Read-only operator visibility for wallet balance safety, duplicate
                bet prevention, unsettled bet warnings, and Six Animal debit/payout
                transaction flow. This page does not edit wallets, settle bets,
                retry payouts, or touch the player room.
              </p>
            </div>

            <div
              className={`rounded-2xl border px-5 py-4 ${getStatusTone(
                isHealthy ? "healthy" : "watch"
              )}`}
            >
              <p className="text-xs font-bold uppercase tracking-[0.25em] opacity-60">
                Integrity Status
              </p>
              <p className="mt-2 text-2xl font-black">
                {isHealthy ? "Clean" : "Watch"}
              </p>
            </div>
          </div>
        </header>

        {error ? (
          <section className="mt-6 rounded-[1.5rem] border border-red-400/30 bg-red-950/30 p-5">
            <p className="text-sm font-black text-red-100">
              Financial integrity warning
            </p>
            <p className="mt-2 text-xs text-red-100/75">{error.message}</p>
          </section>
        ) : null}

        {!error && warnings.length > 0 ? (
          <section className="mt-6 rounded-[1.5rem] border border-amber-400/30 bg-amber-950/25 p-5">
            <p className="text-sm font-black text-amber-100">
              Operator watch warning
            </p>

            <div className="mt-3 space-y-2">
              {warnings.map((warning) => (
                <p key={warning} className="text-xs leading-5 text-amber-50/65">
                  {warning}
                </p>
              ))}
            </div>
          </section>
        ) : null}

        <section className="mt-6 grid gap-4 md:grid-cols-4">
          <div className="rounded-[1.5rem] border border-emerald-400/20 bg-emerald-400/10 p-5">
            <p className="text-xs text-emerald-200/60">Negative Wallets</p>
            <p className="mt-2 text-3xl font-black text-emerald-100">
              {integrity?.negative_wallet_count ?? "—"}
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-sky-400/20 bg-sky-400/10 p-5">
            <p className="text-xs text-sky-200/60">Duplicate Bet Pairs</p>
            <p className="mt-2 text-3xl font-black text-sky-100">
              {integrity?.duplicate_bet_pair_count ?? "—"}
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-red-400/20 bg-red-400/10 p-5">
            <p className="text-xs text-red-200/60">Old Unsettled Bets</p>
            <p className="mt-2 text-3xl font-black text-red-100">
              {integrity?.old_unsettled_bet_count ?? "—"}
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-amber-400/20 bg-amber-400/10 p-5">
            <p className="text-xs text-amber-200/60">Six Animal Txns</p>
            <p className="mt-2 text-3xl font-black text-amber-100">
              {integrity?.recent_six_animal_transaction_count ?? "—"}
            </p>
          </div>
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-[1.5rem] border border-purple-400/20 bg-purple-400/10 p-5">
            <p className="text-xs text-purple-200/60">Payout Transactions</p>
            <p className="mt-2 text-3xl font-black text-purple-100">
              {integrity?.recent_payout_count ?? "—"}
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5">
            <p className="text-xs text-white/40">Latest Bet</p>
            <p className="mt-2 text-sm font-black text-white/75">
              {formatTime(integrity?.latest_bet_created_at ?? null)}
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5">
            <p className="text-xs text-white/40">Latest Wallet Transaction</p>
            <p className="mt-2 text-sm font-black text-white/75">
              {formatTime(integrity?.latest_transaction_created_at ?? null)}
            </p>
          </div>
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-[1fr_1fr_1fr]">
          <article className="rounded-[1.75rem] border border-emerald-400/15 bg-emerald-950/10 p-5">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-emerald-200/50">
              Wallet Balance Safety
            </p>
            <h2 className="mt-2 text-2xl font-black text-amber-100">
              Negative Wallets
            </h2>

            <div className="mt-5 space-y-3">
              {negativeWallets.map((wallet) => (
                <div
                  key={toText(wallet.wallet_id)}
                  className="rounded-2xl border border-red-400/20 bg-red-400/10 p-4"
                >
                  <p className="break-all text-xs font-bold text-white/45">
                    {toText(wallet.profile_id)}
                  </p>
                  <p className="mt-2 text-xl font-black text-red-100">
                    {formatAmount(wallet.balance)}
                  </p>
                </div>
              ))}

              {negativeWallets.length === 0 ? (
                <EmptyState message="No negative wallet balances found." />
              ) : null}
            </div>
          </article>

          <article className="rounded-[1.75rem] border border-sky-400/15 bg-sky-950/10 p-5">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-sky-200/50">
              Bet Uniqueness
            </p>
            <h2 className="mt-2 text-2xl font-black text-amber-100">
              Duplicate Bet Pairs
            </h2>

            <div className="mt-5 space-y-3">
              {duplicateBets.map((bet) => (
                <div
                  key={`${toText(bet.round_id)}-${toText(bet.profile_id)}`}
                  className="rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4"
                >
                  <p className="break-all text-xs font-bold text-white/45">
                    {toText(bet.profile_id)}
                  </p>
                  <p className="mt-2 text-sm font-black text-amber-100">
                    {toText(bet.bet_count)} bets • {formatAmount(bet.total_amount)}
                  </p>
                </div>
              ))}

              {duplicateBets.length === 0 ? (
                <EmptyState message="No duplicate bet pairs found." />
              ) : null}
            </div>
          </article>

          <article className="rounded-[1.75rem] border border-red-400/15 bg-red-950/10 p-5">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-red-200/50">
              Settlement Safety
            </p>
            <h2 className="mt-2 text-2xl font-black text-amber-100">
              Old Unsettled Bets
            </h2>

            <div className="mt-5 space-y-3">
              {oldUnsettledBets.map((bet) => (
                <div
                  key={toText(bet.id)}
                  className="rounded-2xl border border-red-400/20 bg-red-400/10 p-4"
                >
                  <p className="text-xs font-bold text-white/45">
                    Round #{toText(bet.round_number)}
                  </p>
                  <p className="mt-2 text-sm font-black text-red-100">
                    {toText(bet.animal)} • {formatAmount(bet.amount)}
                  </p>
                  <p className="mt-1 text-xs text-white/40">
                    Revealed: {formatTime(toTimeValue(bet.result_revealed_at))}
                  </p>
                </div>
              ))}

              {oldUnsettledBets.length === 0 ? (
                <EmptyState message="No old unsettled result bets found." />
              ) : null}
            </div>
          </article>
        </section>

        <section className="mt-6 rounded-[1.75rem] border border-amber-400/15 bg-black/40 p-5">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-amber-200/50">
            Wallet Transaction Flow
          </p>
          <h2 className="mt-2 text-2xl font-black text-amber-100">
            Recent Six Animal Wallet Transactions
          </h2>

          <div className="mt-5 space-y-3">
            {recentTransactions.map((transaction) => (
              <article
                key={toText(transaction.id)}
                className="grid gap-3 rounded-2xl border border-white/10 bg-black/30 p-4 md:grid-cols-[180px_1fr_160px_170px]"
              >
                <p className="text-xs font-bold text-white/35">
                  {toText(transaction.transaction_type)}
                </p>

                <div>
                  <p className="break-all text-xs font-bold text-white/35">
                    {toText(transaction.profile_id)}
                  </p>
                  <p className="mt-1 text-sm text-white/60">
                    {toText(transaction.description)}
                  </p>
                </div>

                <p className="text-sm font-black text-emerald-100">
                  {formatAmount(transaction.amount)}
                </p>

                <p className="text-left text-xs font-bold text-white/35 md:text-right">
                  {formatTime(toTimeValue(transaction.created_at))}
                </p>
              </article>
            ))}

            {recentTransactions.length === 0 ? (
              <EmptyState message="No Six Animal wallet transactions found." />
            ) : null}
          </div>
        </section>

        <section className="mt-6 rounded-[1.75rem] border border-purple-400/15 bg-purple-950/10 p-5">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-purple-200/50">
            Payout Visibility
          </p>
          <h2 className="mt-2 text-2xl font-black text-amber-100">
            Recent Six Animal Payouts
          </h2>

          <div className="mt-5 space-y-3">
            {recentPayouts.map((payout) => (
              <article
                key={toText(payout.id)}
                className="grid gap-3 rounded-2xl border border-white/10 bg-black/30 p-4 md:grid-cols-[180px_1fr_160px_170px]"
              >
                <p className="text-xs font-bold text-white/35">
                  {toText(payout.transaction_type)}
                </p>

                <div>
                  <p className="break-all text-xs font-bold text-white/35">
                    {toText(payout.profile_id)}
                  </p>
                  <p className="mt-1 text-sm text-white/60">
                    {toText(payout.description)}
                  </p>
                </div>

                <p className="text-sm font-black text-purple-100">
                  {formatAmount(payout.amount)}
                </p>

                <p className="text-left text-xs font-bold text-white/35 md:text-right">
                  {formatTime(toTimeValue(payout.created_at))}
                </p>
              </article>
            ))}

            {recentPayouts.length === 0 ? (
              <EmptyState message="No Six Animal payout transactions found." />
            ) : null}
          </div>
        </section>

        <section className="mt-6 rounded-[1.75rem] border border-sky-400/15 bg-sky-950/10 p-5">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-sky-200/50">
            Combined Timeline
          </p>
          <h2 className="mt-2 text-2xl font-black text-amber-100">
            Latest Bets + Wallet Transactions
          </h2>

          <div className="mt-5 space-y-3">
            {latestTimeline.map((item) => (
              <article
                key={`${toText(item.row_type)}-${toText(item.id)}`}
                className="grid gap-3 rounded-2xl border border-white/10 bg-black/30 p-4 md:grid-cols-[170px_1fr_150px_170px]"
              >
                <p className="text-xs font-black text-sky-100">
                  {toText(item.row_type)}
                </p>

                <div>
                  <p className="break-all text-xs font-bold text-white/35">
                    {toText(item.profile_id)}
                  </p>
                  <p className="mt-1 text-sm font-black text-amber-100">
                    {toText(item.detail)}
                  </p>
                </div>

                <p className="text-sm font-black text-white/75">
                  {formatAmount(item.amount)}
                </p>

                <p className="text-left text-xs font-bold text-white/35 md:text-right">
                  {formatTime(toTimeValue(item.created_at))}
                </p>
              </article>
            ))}

            {latestTimeline.length === 0 ? (
              <EmptyState message="No Six Animal bet or wallet timeline rows found." />
            ) : null}
          </div>
        </section>

        <section className="mt-6 rounded-[1.75rem] border border-white/10 bg-black/40 p-5">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-white/35">
            Read-only Lock
          </p>
          <p className="mt-2 text-sm leading-6 text-white/55">
            This financial integrity page only reads wallet, bet, and transaction
            safety state. It has no admin write buttons, no wallet edit action, no
            manual settlement, no payout retry, no forced round advance, and no
            player room control.
          </p>

          <p className="mt-3 text-xs text-white/35">
            Checked at: {formatTime(integrity?.checked_at ?? null)}
          </p>
        </section>
      </section>
    </main>
  );
}