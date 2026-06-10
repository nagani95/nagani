//src>app>admin>six-animal>page.tsx

import Link from "next/link";
import {
  clearSixAnimalNextResult,
  setSixAnimalNextResult,
} from "@/lib/supabase/sixAnimalControls";

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

type SixAnimalRoomControl = {
  room_id: string;
  control_mode: string;
  pending_result_animals: unknown;
  pending_result_set_by: string | null;
  pending_result_set_at: string | null;
  updated_at: string | null;
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

export default async function AdminSixAnimalPage({
  searchParams,
}: AdminSixAnimalPageProps) {
  const params = await searchParams;
  const successMessage = params?.message;
  const errorMessage = params?.error;

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

const currentRoundId = currentRound?.id ?? null;

const {
  data: currentRoundResult,
  error: roundResultsError,
} = currentRoundId
  ? await supabase
      .from("six_animal_results")
      .select("round_id, result_animals, created_at")
      .eq("round_id", currentRoundId)
      .maybeSingle<SixAnimalResult>()
  : { data: null, error: null };

const {
  data: roomControl,
  error: roomControlError,
} = await supabase
  .from("six_animal_room_controls")
  .select(
    "room_id, control_mode, pending_result_animals, pending_result_set_by, pending_result_set_at, updated_at"
  )
  .eq("room_id", MAIN_ROOM_ID)
  .maybeSingle<SixAnimalRoomControl>();

const pendingResultAnimals = normalizeResultAnimals(
  roomControl?.pending_result_animals
);

const hasPendingNextResult = pendingResultAnimals.length === 3;

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

const currentResultAnimals = normalizeResultAnimals(
  currentRoundResult?.result_animals
);

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
  roundResultsError ? `Round results: ${roundResultsError.message}` : null,
  currentBetsError ? `Current bets: ${currentBetsError.message}` : null,
  roomControlError ? `Room control: ${roomControlError.message}` : null,
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
Read-only backend monitoring for the main Six Animal live room.
Manual control is not enabled yet. Backend remains the dealer.
Player room logic is untouched.
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

        {successMessage ? (
  <section className="mt-6 rounded-[1.5rem] border border-emerald-400/30 bg-emerald-950/30 p-5">
    <p className="text-sm font-black text-emerald-100">
      {successMessage}
    </p>
  </section>
) : null}

{errorMessage ? (
  <section className="mt-6 rounded-[1.5rem] border border-red-400/30 bg-red-950/30 p-5">
    <p className="text-sm font-black text-red-100">
      {errorMessage}
    </p>
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

        <section className="mt-6 rounded-[1.75rem] border border-amber-400/20 bg-gradient-to-br from-amber-950/20 via-black/45 to-red-950/20 p-5">
  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.3em] text-amber-200/50">
        Dealer Control
      </p>

      <h2 className="mt-2 text-2xl font-black text-amber-100">
        Manual Control Not Enabled
      </h2>

      <p className="mt-2 max-w-2xl text-sm leading-6 text-white/55">
        This panel is prepared for future Six Animal room control. For now,
        backend auto mode remains the only active dealer. No admin action here
        changes result, wallet, settlement, dice, or player room state.
      </p>
    </div>

    <div className="rounded-2xl border border-emerald-400/15 bg-emerald-400/10 px-4 py-3 text-center">
      <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-100/55">
        Mode
      </p>
      <p className="mt-1 text-lg font-black text-emerald-100">
        Auto
      </p>
    </div>
  </div>

  <div className="mt-5 rounded-2xl border border-white/10 bg-black/30 p-4">
  <p className="text-xs font-bold uppercase tracking-[0.24em] text-white/35">
    Pending Next Result
  </p>

  {hasPendingNextResult ? (
    <div className="mt-3 grid gap-2 md:grid-cols-3">
      {pendingResultAnimals.map((animal, index) => (
        <div
          key={`${animal}-${index}`}
          className="rounded-xl border border-amber-400/20 bg-amber-400/10 px-4 py-3 text-center"
        >
          <p className="text-xs font-bold text-white/35">
            Dice {index + 1}
          </p>
          <p className="mt-1 text-lg font-black capitalize text-amber-100">
            {animal}
          </p>
        </div>
      ))}
    </div>
  ) : (
    <p className="mt-3 text-sm font-bold text-white/45">
      No manual result is pending. Backend auto result will be used.
    </p>
  )}

  {roomControl?.pending_result_set_at ? (
    <p className="mt-3 text-xs font-bold text-white/35">
      Set at {formatTime(roomControl.pending_result_set_at)}
    </p>
  ) : null}
</div>

<div className="mt-5 grid gap-3 md:grid-cols-4">
  <button
    type="button"
    disabled
    className="cursor-not-allowed rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 text-sm font-black text-white/30"
  >
    Set Next Result
  </button>

  <form action={clearSixAnimalNextResult}>
    <button
      type="submit"
      className="w-full rounded-2xl border border-red-300/25 bg-red-500/12 px-4 py-4 text-sm font-black text-red-100 transition hover:bg-red-300 hover:text-black"
    >
      Clear Next Result
    </button>
  </form>

  <button
    type="button"
    disabled
    className="cursor-not-allowed rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 text-sm font-black text-white/30"
  >
    Pause Room
  </button>

  <button
    type="button"
    disabled
    className="cursor-not-allowed rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 text-sm font-black text-white/30"
  >
    Resume Room
  </button>
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
      </section>
    </main>
  );
}