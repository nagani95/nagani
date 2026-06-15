// src/app/admin/six-animal/page.tsx

import Link from "next/link";

import SixAnimalAdminRefresh from "@/components/admin/SixAnimalAdminRefresh";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const MAIN_ROOM_ID = "11111111-1111-1111-1111-111111111111";

const SIX_ANIMALS = [
  "tiger",
  "dragon",
  "rooster",
  "fish",
  "crab",
  "elephant",
] as const;

type SixAnimalRound = {
  id: string;
  room_id: string;
  round_number: number;
  phase: string;
  status: string;
  result_animals: unknown;
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
  bet_type: "single" | "pair" | string;
  animal: string;
  animal_2: string | null;
  amount: number;
  locked: boolean;
  settled: boolean;
  created_at: string;
};

type AdminSixAnimalPageProps = {
  searchParams?: Promise<{
    message?: string;
    error?: string;
  }>;
};

function formatAmount(amount: number) {
  return `${new Intl.NumberFormat("en-US").format(amount)} MMK`;
}

function formatPercent(value: number | null) {
  if (value === null || Number.isNaN(value)) return "—";
  return `${value.toFixed(2)}%`;
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

function countAnimalMatches(resultAnimals: string[], animal: string) {
  return resultAnimals.filter((resultAnimal) => resultAnimal === animal).length;
}

function calculateBetPayout(bet: SixAnimalBet, resultAnimals: string[]) {
  if (resultAnimals.length !== 3) return 0;

  const amount = Number(bet.amount ?? 0);

  if (bet.bet_type === "pair") {
    if (!bet.animal || !bet.animal_2) return 0;

    const hasAnimal1 = resultAnimals.includes(bet.animal);
    const hasAnimal2 = resultAnimals.includes(bet.animal_2);

    return hasAnimal1 && hasAnimal2 ? amount * 5 : 0;
  }

  const matchCount = countAnimalMatches(resultAnimals, bet.animal);

  if (matchCount <= 0) return 0;

  return amount + amount * matchCount;
}

function getBetResultLabel(bet: SixAnimalBet, resultAnimals: string[]) {
  if (resultAnimals.length !== 3) return "Pending result";

  if (bet.bet_type === "pair") {
    if (!bet.animal_2) return "Invalid pair";

    const hasAnimal1 = resultAnimals.includes(bet.animal);
    const hasAnimal2 = resultAnimals.includes(bet.animal_2);

    return hasAnimal1 && hasAnimal2 ? "Pair hit" : "Pair miss";
  }

  const matchCount = countAnimalMatches(resultAnimals, bet.animal);

  return matchCount > 0 ? `${matchCount}/3 match` : "No match";
}

function getFestivalBucket(totalBetAmount: number, totalPayoutAmount: number) {
  if (totalBetAmount <= 0) return "No Bets";

  if (totalPayoutAmount === 0) return "Admin Keep";

  const payoutRatio = totalPayoutAmount / totalBetAmount;

  if (payoutRatio <= 1.25) return "Soft Hope";
  if (payoutRatio <= 2.5) return "Medium Drama";

  return "Danger";
}

function getFestivalBucketTone(bucket: string) {
  if (bucket === "Admin Keep") {
    return "border-emerald-400/20 bg-emerald-400/10 text-emerald-100";
  }

  if (bucket === "Soft Hope") {
    return "border-sky-400/20 bg-sky-400/10 text-sky-100";
  }

  if (bucket === "Medium Drama") {
    return "border-amber-400/20 bg-amber-400/10 text-amber-100";
  }

  if (bucket === "Danger") {
    return "border-red-400/25 bg-red-400/10 text-red-100";
  }

  return "border-white/10 bg-white/[0.03] text-white/45";
}

function getAdminNetTone(adminNet: number | null) {
  if (adminNet === null) return "text-white/45";
  if (adminNet > 0) return "text-emerald-100";
  if (adminNet < 0) return "text-red-100";
  return "text-sky-100";
}

export default async function AdminSixAnimalPage({
  searchParams,
}: AdminSixAnimalPageProps) {
  const params = await searchParams;
  const successMessage = params?.message;
  const errorMessage = params?.error;

  const supabase = await createClient();

  const { data: currentRound, error: currentRoundError } = await supabase
    .from("six_animal_rounds")
    .select(
      "id, room_id, round_number, phase, status, result_animals, betting_starts_at, betting_ends_at, rolling_starts_at, result_revealed_at, next_round_starts_at, created_at"
    )
    .eq("room_id", MAIN_ROOM_ID)
    .order("round_number", { ascending: false })
    .limit(1)
    .maybeSingle<SixAnimalRound>();

  const currentRoundId = currentRound?.id ?? null;

  const { data: currentBets, error: currentBetsError } = currentRoundId
    ? await supabase
        .from("six_animal_bets")
        .select(
          "id, round_id, profile_id, bet_type, animal, animal_2, amount, locked, settled, created_at"
        )
        .eq("round_id", currentRoundId)
        .order("created_at", { ascending: false })
        .returns<SixAnimalBet[]>()
    : { data: [], error: null };

  const currentBetsList = currentBets ?? [];
  const currentResultAnimals = normalizeResultAnimals(
    currentRound?.result_animals
  );

  const resultIsPreloaded = currentResultAnimals.length === 3;

  const totalBetAmount = currentBetsList.reduce(
    (sum, bet) => sum + Number(bet.amount ?? 0),
    0
  );

  const totalPayoutAmount = resultIsPreloaded
    ? currentBetsList.reduce(
        (sum, bet) => sum + calculateBetPayout(bet, currentResultAnimals),
        0
      )
    : 0;

  const adminNet = resultIsPreloaded
    ? totalBetAmount - totalPayoutAmount
    : null;

  const payoutPercent =
    resultIsPreloaded && totalBetAmount > 0
      ? (totalPayoutAmount / totalBetAmount) * 100
      : null;

  const festivalBucket = resultIsPreloaded
    ? getFestivalBucket(totalBetAmount, totalPayoutAmount)
    : "Pending";

  const currentBetsWithPayout = currentBetsList.map((bet) => ({
    ...bet,
    expectedPayout: resultIsPreloaded
      ? calculateBetPayout(bet, currentResultAnimals)
      : 0,
    resultLabel: getBetResultLabel(bet, currentResultAnimals),
  }));

  const betDistribution = SIX_ANIMALS.map((animal) => {
    const singleAmount = currentBetsList.reduce((sum, bet) => {
      if (bet.bet_type !== "single") return sum;
      return bet.animal === animal ? sum + Number(bet.amount ?? 0) : sum;
    }, 0);

    const pairAmount = currentBetsList.reduce((sum, bet) => {
      if (bet.bet_type !== "pair") return sum;

      const includesAnimal = bet.animal === animal || bet.animal_2 === animal;

      return includesAnimal ? sum + Number(bet.amount ?? 0) : sum;
    }, 0);

    const resultHits = resultIsPreloaded
      ? countAnimalMatches(currentResultAnimals, animal)
      : null;

    return {
      animal,
      singleAmount,
      pairAmount,
      totalExposure: singleAmount + pairAmount,
      resultHits,
    };
  });

  const settledCount = currentBetsList.filter((bet) => bet.settled).length;
  const unsettledCount = currentBetsList.length - settledCount;
  const phaseTarget = getPhaseTarget(currentRound);
  const snapshotGeneratedAt = new Date().toISOString();

  const hasSettlementWatch =
    currentRound?.phase === "result" && unsettledCount > 0;

  const errors = [
    currentRoundError ? `Current round: ${currentRoundError.message}` : null,
    currentBetsError ? `Current bets: ${currentBetsError.message}` : null,
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
                ၆ ကောင်ဂျင် Monitor
              </h1>
              <p className="mt-3 text-sm leading-6 text-amber-50/65">
                Read-only monitoring for the main Six Animal live room. This
                page does not change dice, results, wallets, settlements, or
                room timing.
              </p>
            </div>

            <div className="rounded-2xl border border-amber-400/15 bg-black/35 px-5 py-4">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-white/35">
                Main Room
              </p>
              <p className="mt-2 break-all text-sm font-black text-amber-100">
                {MAIN_ROOM_ID}
              </p>
            </div>
          </div>
        </header>

        {successMessage ? (
          <section className="mt-6 rounded-[1.5rem] border border-emerald-400/30 bg-emerald-950/30 p-5">
            <p className="text-sm font-black text-emerald-100">
              {successMessage}
            </p>
          </section>
        ) : null}

        {errorMessage ? (
          <section className="mt-6 rounded-[1.5rem] border border-red-400/30 bg-red-950/30 p-5">
            <p className="text-sm font-black text-red-100">{errorMessage}</p>
          </section>
        ) : null}

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
              Current round is in result phase and still has {unsettledCount}{" "}
              unsettled bet{unsettledCount === 1 ? "" : "s"}. This panel is
              only a monitor. It does not settle, retry, credit, debit, or
              change backend state.
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
              {currentBetsList.length}
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5">
            <p className="text-xs text-white/40">Total Bet Amount</p>
            <p className="mt-2 text-2xl font-black text-amber-100">
              {formatAmount(totalBetAmount)}
            </p>
          </div>
        </section>

        <section className="mt-6 rounded-[1.75rem] border border-purple-400/20 bg-gradient-to-br from-purple-950/25 via-black/50 to-red-950/20 p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-purple-200/55">
                Festival Result Engine
              </p>
              <h2 className="mt-2 text-2xl font-black text-amber-100">
                Admin-Safe Room Monitor
              </h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-white/55">
                Backend result mode is Festival Balance v2. Admin can monitor
                risk, payout pressure, and room result health, but cannot force
                a specific winning animal from this page.
              </p>
            </div>

            <div
              className={`rounded-2xl border px-4 py-3 text-center ${getFestivalBucketTone(
                festivalBucket
              )}`}
            >
              <p className="text-xs font-bold uppercase tracking-[0.22em] opacity-60">
                Bucket
              </p>
              <p className="mt-1 text-lg font-black">{festivalBucket}</p>
            </div>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-4">
            <div className="rounded-[1.5rem] border border-purple-400/15 bg-purple-400/10 p-4">
              <p className="text-xs text-purple-100/60">Result Mode</p>
              <p className="mt-2 text-lg font-black text-purple-100">
                festival_balance_v2
              </p>
            </div>

            <div className="rounded-[1.5rem] border border-sky-400/15 bg-sky-400/10 p-4">
              <p className="text-xs text-sky-100/60">Projected Payout</p>
              <p className="mt-2 text-xl font-black text-sky-100">
                {resultIsPreloaded ? formatAmount(totalPayoutAmount) : "—"}
              </p>
            </div>

            <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4">
              <p className="text-xs text-white/40">Payout Pressure</p>
              <p className="mt-2 text-xl font-black text-white/80">
                {formatPercent(payoutPercent)}
              </p>
            </div>

            <div className="rounded-[1.5rem] border border-white/10 bg-black/35 p-4">
              <p className="text-xs text-white/40">Admin Net This Round</p>
              <p className={`mt-2 text-xl font-black ${getAdminNetTone(adminNet)}`}>
                {adminNet === null ? "—" : formatAmount(adminNet)}
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-6">
            {betDistribution.map((item) => (
              <div
                key={item.animal}
                className="rounded-2xl border border-white/10 bg-black/30 p-4"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-black capitalize text-amber-100">
                    {item.animal}
                  </p>
                  <p className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-1 text-[10px] font-black text-white/45">
                    {item.resultHits === null ? "—" : `${item.resultHits}x`}
                  </p>
                </div>

                <p className="mt-3 text-xs text-white/35">Single</p>
                <p className="mt-1 text-sm font-black text-white/75">
                  {formatAmount(item.singleAmount)}
                </p>

                <p className="mt-2 text-xs text-white/35">Pair Exposure</p>
                <p className="mt-1 text-sm font-black text-white/55">
                  {formatAmount(item.pairAmount)}
                </p>
              </div>
            ))}
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
                <p className="text-xs text-amber-200/60">
                  Current Phase Target
                </p>
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
                      <p className="text-xl font-black capitalize text-amber-100">
                        {animal}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm font-bold text-white/45">
                  No backend result visible yet. Festival result will preload
                  when betting closes.
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
            {currentBetsWithPayout.slice(0, 10).map((bet) => (
              <div
                key={bet.id}
                className="grid gap-3 rounded-2xl border border-white/10 bg-black/30 p-4 md:grid-cols-[1fr_110px_170px_140px_130px_130px]"
              >
                <p className="truncate text-xs font-bold text-white/35">
                  {bet.profile_id}
                </p>

                <p className="text-sm font-black capitalize text-amber-100">
                  {bet.bet_type}
                </p>

                <div>
                  <p className="text-sm font-black capitalize text-amber-100">
                    {bet.animal}
                    {bet.bet_type === "pair" && bet.animal_2
                      ? ` + ${bet.animal_2}`
                      : ""}
                  </p>
                  <p className="mt-1 text-xs font-bold text-white/35">
                    {bet.resultLabel}
                  </p>
                </div>

                <p className="text-sm font-black text-white/75">
                  {formatAmount(Number(bet.amount ?? 0))}
                </p>

                <p className="text-sm font-black text-sky-100">
                  {resultIsPreloaded ? formatAmount(bet.expectedPayout) : "—"}
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

            {currentBetsWithPayout.length === 0 ? (
              <p className="rounded-2xl border border-white/10 bg-black/30 p-4 text-sm font-bold text-white/40">
                No bets in current round.
              </p>
            ) : null}
          </div>
        </section>
      </section>
    </main>
  );
}