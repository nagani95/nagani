//src>app>admin>six-animal>page.tsx

import Link from "next/link";

import { createClient } from "@/lib/supabase/server";
import SixAnimalAdminRefresh from "@/components/admin/SixAnimalAdminRefresh";

export const dynamic = "force-dynamic";

const MAIN_ROOM_ID = "11111111-1111-1111-1111-111111111111";

type SixAnimalRound = {
  id: string;
  room_id: string;
  round_number: number;
  phase: string;
  status: string;
  betting_starts_at: string | null;
  betting_ends_at: string | null;
  rolling_starts_at: string | null;
  result_revealed_at: string | null;
  next_round_starts_at: string | null;
  created_at: string;
};

type SixAnimalBet = {
  id: string;
  round_id: string;
  profile_id: string;
  animal: string;
  amount: number;
  locked: boolean;
  settled: boolean;
  created_at: string;
};

type SixAnimalResult = {
  round_id: string;
  result_animals: unknown;
  created_at: string;
};

type WalletTransaction = {
  id: string;
  wallet_id: string;
  amount: number;
  transaction_type: string;
  description: string | null;
  created_at: string;
};

function formatAmount(amount: number) {
  return `${new Intl.NumberFormat("en-US").format(amount)} MMK`;
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

function normalizeResultAnimals(value: unknown) {
  if (!Array.isArray(value)) return [];

  return value
    .map((animal) => (typeof animal === "string" ? animal : ""))
    .filter(Boolean);
}

function getPhaseTone(phase: string) {
  if (phase === "betting") return "text-emerald-100";
  if (phase === "closed") return "text-amber-100";
  if (phase === "rolling") return "text-sky-100";
  if (phase === "result") return "text-purple-100";
  return "text-white/70";
}

function getPhaseTarget(round: SixAnimalRound | null) {
  if (!round) return null;

  if (round.phase === "betting") return round.betting_ends_at;
  if (round.phase === "closed") return round.rolling_starts_at;
  if (round.phase === "rolling") return round.result_revealed_at;
  if (round.phase === "result") return round.next_round_starts_at;

  return null;
}

export default async function AdminSixAnimalPage() {
  const supabase = await createClient();

  const {
    data: currentRound,
    error: currentRoundError,
  } = await supabase
    .from("six_animal_rounds")
    .select(
      "id, room_id, round_number, phase, status, betting_starts_at, betting_ends_at, rolling_starts_at, result_revealed_at, next_round_starts_at, created_at"
    )
    .eq("room_id", MAIN_ROOM_ID)
    .order("round_number", { ascending: false })
    .limit(1)
    .maybeSingle<SixAnimalRound>();

  const {
    data: latestRounds,
    error: latestRoundsError,
  } = await supabase
    .from("six_animal_rounds")
    .select(
      "id, room_id, round_number, phase, status, betting_starts_at, betting_ends_at, rolling_starts_at, result_revealed_at, next_round_starts_at, created_at"
    )
    .eq("room_id", MAIN_ROOM_ID)
    .order("round_number", { ascending: false })
    .limit(8)
    .returns<SixAnimalRound[]>();

  const roundIds = latestRounds?.map((round) => round.id) ?? [];

  const {
    data: roundResults,
    error: roundResultsError,
  } = roundIds.length
    ? await supabase
        .from("six_animal_results")
        .select("round_id, result_animals, created_at")
        .in("round_id", roundIds)
        .returns<SixAnimalResult[]>()
    : { data: [], error: null };
  
    const {
  data: latestRoundBets,
  error: latestRoundBetsError,
} = roundIds.length
  ? await supabase
      .from("six_animal_bets")
      .select(
        "id, round_id, profile_id, animal, amount, locked, settled, created_at"
      )
      .in("round_id", roundIds)
      .returns<SixAnimalBet[]>()
  : { data: [], error: null };

  const currentRoundId = currentRound?.id ?? null;

  const {
    data: currentBets,
    error: currentBetsError,
  } = currentRoundId
    ? await supabase
        .from("six_animal_bets")
        .select(
          "id, round_id, profile_id, animal, amount, locked, settled, created_at"
        )
        .eq("round_id", currentRoundId)
        .order("created_at", { ascending: false })
        .returns<SixAnimalBet[]>()
    : { data: [], error: null };

  const {
    data: latestWalletTransactions,
    error: walletTransactionsError,
  } = await supabase
    .from("wallet_transactions")
    .select("id, wallet_id, amount, transaction_type, description, created_at")
    .order("created_at", { ascending: false })
    .limit(8)
    .returns<WalletTransaction[]>();

  const resultsByRoundId = new Map(
    (roundResults ?? []).map((result) => [
      result.round_id,
      normalizeResultAnimals(result.result_animals),
    ])
  );

const currentResultAnimals =
  currentRoundId && resultsByRoundId.has(currentRoundId)
    ? resultsByRoundId.get(currentRoundId) ?? []
    : [];

const latestRoundBetStats = new Map<
  string,
  {
    betCount: number;
    totalAmount: number;
    settledCount: number;
    unsettledCount: number;
  }
>();

for (const bet of latestRoundBets ?? []) {
  const current = latestRoundBetStats.get(bet.round_id) ?? {
    betCount: 0,
    totalAmount: 0,
    settledCount: 0,
    unsettledCount: 0,
  };

  current.betCount += 1;
  current.totalAmount += bet.amount;

  if (bet.settled) {
    current.settledCount += 1;
  } else {
    current.unsettledCount += 1;
  }

  latestRoundBetStats.set(bet.round_id, current);
}

const totalBetAmount = (currentBets ?? []).reduce(
  (sum, bet) => sum + bet.amount,
  0
);

  const settledCount = (currentBets ?? []).filter((bet) => bet.settled).length;
  const unsettledCount = (currentBets ?? []).length - settledCount;
  const phaseTarget = getPhaseTarget(currentRound);
  const snapshotGeneratedAt = new Date().toISOString();
  const hasSettlementWatch =
  currentRound?.phase === "result" && unsettledCount > 0;

const errors = [
  currentRoundError ? `Current round: ${currentRoundError.message}` : null,
  latestRoundsError ? `Latest rounds: ${latestRoundsError.message}` : null,
  roundResultsError ? `Round results: ${roundResultsError.message}` : null,
  latestRoundBetsError
    ? `Latest round bets: ${latestRoundBetsError.message}`
    : null,
  currentBetsError ? `Current bets: ${currentBetsError.message}` : null,
  walletTransactionsError
    ? `Wallet transactions: ${walletTransactionsError.message}`
    : null,
].filter(Boolean);

  return (
    <main className="min-h-screen bg-[#090202] px-5 py-6 text-white">
      <section className="mx-auto w-full max-w-6xl">
        <Link href="/admin" className="text-sm font-bold text-amber-300">
          ← Admin Home
        </Link>

        <header className="mt-6 rounded-[2rem] border border-red-500/25 bg-gradient-to-br from-red-950 via-[#160303] to-black p-6">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-red-200/60">
            Live Room Monitor
          </p>

          <div className="mt-3 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-4xl font-black text-amber-100">
                ၆ ကောင်ဂျင် Admin
              </h1>
              <p className="mt-3 text-sm leading-6 text-amber-50/65">
                Read-only backend monitoring for the main Six Animal live room.
                Backend remains the dealer. Player room logic is untouched.
              </p>
            </div>

            <div className="rounded-2xl border border-amber-400/15 bg-black/35 px-5 py-4">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-white/35">
                Main Room
              </p>
              <p className="mt-2 text-sm font-black text-amber-100">
                {MAIN_ROOM_ID}
              </p>
            </div>
          </div>
        </header>

        {errors.length > 0 ? (
          <section className="mt-6 rounded-[1.5rem] border border-red-400/30 bg-red-950/30 p-5">
            <p className="text-sm font-black text-red-100">
              Admin monitor warning
            </p>
            <div className="mt-3 space-y-2">
              {errors.map((error) => (
                <p key={error} className="text-xs text-red-100/75">
                  {error}
                </p>
              ))}
            </div>
          </section>
        ) : null}

        {hasSettlementWatch ? (
  <section className="mt-6 rounded-[1.5rem] border border-amber-400/30 bg-amber-950/25 p-5">
    <p className="text-sm font-black text-amber-100">
      Settlement watch
    </p>
    <p className="mt-2 text-xs leading-5 text-amber-50/60">
      Current round is in result phase and still has {unsettledCount} unsettled
      bet{unsettledCount === 1 ? "" : "s"}. This panel is only a monitor. It
      does not settle, retry, credit, debit, or change backend state.
    </p>
  </section>
) : null}

<SixAnimalAdminRefresh
  phase={currentRound?.phase ?? null}
  targetTime={phaseTarget}
  generatedAt={snapshotGeneratedAt}
/>

        <section className="mt-6 grid gap-4 md:grid-cols-4">
          <div className="rounded-[1.5rem] border border-amber-400/20 bg-amber-400/10 p-5">
            <p className="text-xs text-amber-200/60">Current Round</p>
            <p className="mt-2 text-3xl font-black text-amber-100">
              {currentRound ? `#${currentRound.round_number}` : "—"}
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-emerald-400/20 bg-emerald-400/10 p-5">
            <p className="text-xs text-emerald-200/60">Phase</p>
            <p
              className={`mt-2 text-3xl font-black capitalize ${
                currentRound ? getPhaseTone(currentRound.phase) : "text-white/40"
              }`}
            >
              {currentRound?.phase ?? "—"}
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-red-400/20 bg-red-400/10 p-5">
            <p className="text-xs text-red-200/60">Current Bets</p>
            <p className="mt-2 text-3xl font-black text-red-100">
              {(currentBets ?? []).length}
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5">
            <p className="text-xs text-white/40">Total Bet Amount</p>
            <p className="mt-2 text-2xl font-black text-amber-100">
              {formatAmount(totalBetAmount)}
            </p>
          </div>
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
          <article className="rounded-[1.75rem] border border-amber-400/15 bg-black/40 p-5">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-amber-200/50">
                  Backend Round State
                </p>
                <h2 className="mt-2 text-2xl font-black text-amber-100">
                  Current Live Round
                </h2>
              </div>

              <p className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-black text-white/55">
                Status: {currentRound?.status ?? "—"}
              </p>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-xs text-white/40">Betting Starts</p>
                <p className="mt-2 text-sm font-bold text-white/80">
                  {formatTime(currentRound?.betting_starts_at ?? null)}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-xs text-white/40">Betting Ends</p>
                <p className="mt-2 text-sm font-bold text-white/80">
                  {formatTime(currentRound?.betting_ends_at ?? null)}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-xs text-white/40">Rolling Starts</p>
                <p className="mt-2 text-sm font-bold text-white/80">
                  {formatTime(currentRound?.rolling_starts_at ?? null)}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-xs text-white/40">Result Revealed</p>
                <p className="mt-2 text-sm font-bold text-white/80">
                  {formatTime(currentRound?.result_revealed_at ?? null)}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-xs text-white/40">Next Round Starts</p>
                <p className="mt-2 text-sm font-bold text-white/80">
                  {formatTime(currentRound?.next_round_starts_at ?? null)}
                </p>
              </div>

              <div className="rounded-2xl border border-amber-400/15 bg-amber-400/10 p-4">
                <p className="text-xs text-amber-200/60">Current Phase Target</p>
                <p className="mt-2 text-sm font-bold text-amber-100">
                  {formatTime(phaseTarget)}
                </p>
              </div>
            </div>
          </article>

          <article className="rounded-[1.75rem] border border-emerald-400/15 bg-emerald-950/10 p-5">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-emerald-200/50">
              Result Visibility
            </p>
            <h2 className="mt-2 text-2xl font-black text-amber-100">
              Backend Result
            </h2>

            <div className="mt-5 rounded-[1.5rem] border border-white/10 bg-black/35 p-5">
              {currentResultAnimals.length > 0 ? (
                <div className="space-y-3">
                  {currentResultAnimals.map((animal, index) => (
                    <div
                      key={`${animal}-${index}`}
                      className="flex items-center justify-between rounded-2xl border border-amber-400/15 bg-amber-400/10 px-4 py-3"
                    >
                      <p className="text-xs font-bold text-white/35">
                        Dice {index + 1}
                      </p>
                      <p className="text-xl font-black text-amber-100">
                        {animal}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm font-bold text-white/45">
                  No backend result visible yet.
                </p>
              )}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-emerald-400/15 bg-emerald-400/10 p-4">
                <p className="text-xs text-emerald-200/55">Settled</p>
                <p className="mt-2 text-2xl font-black text-emerald-100">
                  {settledCount}
                </p>
              </div>

              <div className="rounded-2xl border border-red-400/15 bg-red-400/10 p-4">
                <p className="text-xs text-red-200/55">Unsettled</p>
                <p className="mt-2 text-2xl font-black text-red-100">
                  {unsettledCount}
                </p>
              </div>
            </div>
          </article>
        </section>

        <section className="mt-6 rounded-[1.75rem] border border-red-400/15 bg-red-950/10 p-5">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-red-200/60">
            Current Round Bets
          </p>
          <h2 className="mt-2 text-2xl font-black text-amber-100">
            Latest Bets
          </h2>

          <div className="mt-5 space-y-3">
            {(currentBets ?? []).slice(0, 10).map((bet) => (
              <div
                key={bet.id}
                className="grid gap-3 rounded-2xl border border-white/10 bg-black/30 p-4 md:grid-cols-[1fr_120px_160px_120px_120px]"
              >
                <p className="truncate text-xs font-bold text-white/35">
                  {bet.profile_id}
                </p>
                <p className="text-sm font-black text-amber-100">
                  {bet.animal}
                </p>
                <p className="text-sm font-black text-white/75">
                  {formatAmount(bet.amount)}
                </p>
                <p className="text-xs font-black text-white/45">
                  {bet.locked ? "Locked" : "Unlocked"}
                </p>
                <p
                  className={`text-left text-xs font-black md:text-right ${
                    bet.settled ? "text-emerald-100" : "text-red-100"
                  }`}
                >
                  {bet.settled ? "Settled" : "Unsettled"}
                </p>
              </div>
            ))}

            {(currentBets ?? []).length === 0 ? (
              <p className="rounded-2xl border border-white/10 bg-black/30 p-4 text-sm font-bold text-white/40">
                No bets in current round.
              </p>
            ) : null}
          </div>
        </section>

        <section className="mt-6 rounded-[1.75rem] border border-amber-400/15 bg-black/40 p-5">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-amber-200/50">
            Room History
          </p>
          <h2 className="mt-2 text-2xl font-black text-amber-100">
            Latest Backend Rounds
          </h2>

          <div className="mt-5 space-y-3">
{(latestRounds ?? []).map((round) => {
  const animals = resultsByRoundId.get(round.id) ?? [];
  const stats = latestRoundBetStats.get(round.id) ?? {
    betCount: 0,
    totalAmount: 0,
    settledCount: 0,
    unsettledCount: 0,
  };

  return (
    <article
      key={round.id}
      className="grid gap-3 rounded-2xl border border-white/10 bg-black/30 p-4 md:grid-cols-[110px_110px_1fr_130px_150px_150px]"
    >
      <p className="text-xs font-bold text-white/35">
        #{round.round_number}
      </p>

      <p
        className={`text-sm font-black capitalize ${getPhaseTone(
          round.phase
        )}`}
      >
        {round.phase}
      </p>

      <p className="text-sm font-black text-amber-100">
        {animals.length > 0 ? animals.join(" / ") : "—"}
      </p>

      <p className="text-xs font-black text-white/55">
        {stats.betCount} bet{stats.betCount === 1 ? "" : "s"}
      </p>

      <p className="text-xs font-black text-emerald-100">
        {formatAmount(stats.totalAmount)}
      </p>

      <div className="text-left text-xs font-black md:text-right">
        <p className="text-emerald-100">
          Settled {stats.settledCount}
        </p>
        <p
          className={
            stats.unsettledCount > 0 ? "text-red-100" : "text-white/35"
          }
        >
          Unsettled {stats.unsettledCount}
        </p>
      </div>
    </article>
  );
})}
          </div>
        </section>

        <section className="mt-6 rounded-[1.75rem] border border-emerald-400/15 bg-emerald-950/10 p-5">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-emerald-200/50">
            Wallet Visibility
          </p>
          <h2 className="mt-2 text-2xl font-black text-amber-100">
            Latest Wallet Transactions
          </h2>

          <div className="mt-5 space-y-3">
            {(latestWalletTransactions ?? []).map((transaction) => (
              <div
                key={transaction.id}
                className="grid gap-3 rounded-2xl border border-white/10 bg-black/30 p-4 md:grid-cols-[180px_1fr_160px_170px]"
              >
                <p className="text-xs font-bold text-white/35">
                  {transaction.transaction_type}
                </p>

                <p className="text-sm text-white/60">
                  {transaction.description ?? "No description"}
                </p>

                <p className="text-sm font-black text-emerald-100">
                  {formatAmount(transaction.amount)}
                </p>

                <p className="text-left text-xs font-bold text-white/35 md:text-right">
                  {formatTime(transaction.created_at)}
                </p>
              </div>
            ))}

            {(latestWalletTransactions ?? []).length === 0 ? (
              <p className="rounded-2xl border border-white/10 bg-black/30 p-4 text-sm font-bold text-white/40">
                No wallet transactions found.
              </p>
            ) : null}
          </div>
        </section>
      </section>
    </main>
  );
}