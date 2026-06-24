// src/app/admin/six-animal/page.tsx

import { revalidatePath } from "next/cache";
import Link from "next/link";
import { redirect } from "next/navigation";

import AdminShell from "@/components/admin/AdminShell";
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

const SIX_ANIMAL_LABELS: Record<string, string> = {
  tiger: "ကျား",
  dragon: "နဂါး",
  rooster: "ကြက်",
  fish: "ငါး",
  crab: "ဂဏန်း",
  elephant: "ဆင်",
};

type SixAnimalRound = {
  id: string;
  room_id: string;
  round_number: number;
  phase: string;
  status: string;
  result_animals: unknown;
  betting_ends_at: string | null;
  rolling_starts_at: string | null;
  result_revealed_at: string | null;
  next_round_starts_at: string | null;
  created_at: string;
};

type SixAnimalBet = {
  id: string;
  bet_type: "single" | "pair" | string;
  animal: string;
  animal_2: string | null;
  amount: number;
  settled: boolean;
  created_at: string;
};

type AdminSixAnimalPageProps = {
  searchParams?: Promise<{
    message?: string;
    error?: string;
  }>;
};

async function setCommercialResultAction(formData: FormData) {
  "use server";

  const resultAnimals = ["dice_1", "dice_2", "dice_3"].map((key) =>
    String(formData.get(key) ?? "")
  );

  const supabase = await createClient();

  const { error } = await supabase.rpc(
    "admin_commercial_six_animal_quick_roll",
    {
      p_room_id: MAIN_ROOM_ID,
      p_result_animals: resultAnimals,
    }
  );

  if (error) {
    redirect(`/admin/six-animal?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/admin/six-animal");

  redirect(
    `/admin/six-animal?message=${encodeURIComponent(
      `Quick roll set: ${resultAnimals.join(" / ")}`
    )}`
  );
}

function formatAmount(amount: number) {
  return `${new Intl.NumberFormat("en-US").format(amount)} MMK`;
}

function normalizeResultAnimals(value: unknown) {
  if (!Array.isArray(value)) return [];

  return value
    .map((animal) => (typeof animal === "string" ? animal : ""))
    .filter(Boolean);
}

function getPhaseTone(phase: string | null | undefined) {
  if (phase === "betting") return "text-emerald-100";
  if (phase === "closed") return "text-amber-100";
  if (phase === "rolling") return "text-sky-100";
  if (phase === "result") return "text-purple-100";

  return "text-white/50";
}

function getPhaseTarget(round: SixAnimalRound | null) {
  if (!round) return null;

  if (round.phase === "betting") return round.betting_ends_at;
  if (round.phase === "closed") return round.rolling_starts_at;
  if (round.phase === "rolling") return round.result_revealed_at;
  if (round.phase === "result") return round.next_round_starts_at;

  return null;
}

function getStatusTone(status: string) {
  if (status === "READY") {
    return "border-emerald-300/25 bg-emerald-400/10 text-emerald-100";
  }

  if (status === "LOCKED") {
    return "border-sky-300/25 bg-sky-400/10 text-sky-100";
  }

  if (status === "BLOCKED") {
    return "border-red-300/25 bg-red-400/10 text-red-100";
  }

  return "border-white/10 bg-white/[0.03] text-white/40";
}

function getAnimalLabel(animal: string) {
  return `${SIX_ANIMAL_LABELS[animal] ?? animal} / ${animal}`;
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
      "id, room_id, round_number, phase, status, result_animals, betting_ends_at, rolling_starts_at, result_revealed_at, next_round_starts_at, created_at"
    )
    .eq("room_id", MAIN_ROOM_ID)
    .order("round_number", { ascending: false })
    .limit(1)
    .maybeSingle<SixAnimalRound>();

  const currentRoundId = currentRound?.id ?? null;

  const { data: currentBets, error: currentBetsError } = currentRoundId
    ? await supabase
        .from("six_animal_bets")
        .select("id, bet_type, animal, animal_2, amount, settled, created_at")
        .eq("round_id", currentRoundId)
        .order("created_at", { ascending: false })
        .returns<SixAnimalBet[]>()
    : { data: [], error: null };

  const currentBetsList = currentBets ?? [];
  const currentResultAnimals = normalizeResultAnimals(
    currentRound?.result_animals
  );

  const resultIsLocked = currentResultAnimals.length === 3;
  const currentPhase = currentRound?.phase ?? null;
  const hasCurrentBets = currentBetsList.length > 0;

  const totalBetAmount = currentBetsList.reduce(
    (sum, bet) => sum + Number(bet.amount ?? 0),
    0
  );

  const settledCount = currentBetsList.filter((bet) => bet.settled).length;
  const unsettledCount = currentBetsList.length - settledCount;

  const canCommercialQuickRoll =
    currentPhase === "betting" && !hasCurrentBets && !resultIsLocked;

  const controlStatus = !currentRound
    ? "NO ROUND"
    : hasCurrentBets
      ? "BLOCKED"
      : resultIsLocked
        ? "LOCKED"
        : canCommercialQuickRoll
          ? "READY"
          : "WAITING";

  const controlLabel =
    controlStatus === "READY"
      ? "READY TO QUICK ROLL"
      : controlStatus === "LOCKED"
        ? "RESULT LOCKED"
        : controlStatus === "BLOCKED"
          ? "BETS EXIST"
          : controlStatus === "NO ROUND"
            ? "NO ACTIVE ROUND"
            : "WAITING";

  const phaseTarget = getPhaseTarget(currentRound);
  const snapshotGeneratedAt = new Date().toISOString();

  const errors = [
    currentRoundError ? `Current round: ${currentRoundError.message}` : null,
    currentBetsError ? `Current bets: ${currentBetsError.message}` : null,
  ].filter((error): error is string => Boolean(error));

  return (
    <AdminShell
      title="6 Animal Monitor"
      eyebrow="Live Room"
      description="Simple live monitor and no-bet commercial quick roll."
      action={
        <Link
          href="/admin/backend-health"
          className="rounded-full border border-sky-300/20 bg-sky-400/10 px-4 py-2 text-xs font-black text-sky-100/85 transition hover:bg-sky-300 hover:text-black"
        >
          Backend Health
        </Link>
      }
    >
      {successMessage ? (
        <section className="rounded-2xl border border-emerald-400/25 bg-emerald-950/25 p-4">
          <p className="text-sm font-black text-emerald-100">
            {successMessage}
          </p>
        </section>
      ) : null}

      {errorMessage ? (
        <section className="rounded-2xl border border-red-400/25 bg-red-950/25 p-4">
          <p className="text-sm font-black text-red-100">{errorMessage}</p>
        </section>
      ) : null}

      {errors.length > 0 ? (
        <section className="mt-3 rounded-2xl border border-red-400/25 bg-red-950/25 p-4">
          {errors.map((error) => (
            <p key={error} className="text-xs font-semibold text-red-100/75">
              {error}
            </p>
          ))}
        </section>
      ) : null}

      <div className="mt-4">
        <SixAnimalAdminRefresh
          phase={currentPhase}
          targetTime={phaseTarget}
          generatedAt={snapshotGeneratedAt}
        />
      </div>

      <section className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-amber-300/15 bg-amber-300/10 p-4">
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-amber-100/55">
            Round
          </p>
          <p className="mt-2 text-2xl font-black text-amber-100">
            {currentRound ? `#${currentRound.round_number}` : "—"}
          </p>
        </div>

        <div className="rounded-2xl border border-emerald-300/15 bg-emerald-400/10 p-4">
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-emerald-100/55">
            Phase
          </p>
          <p
            className={`mt-2 text-2xl font-black capitalize ${getPhaseTone(
              currentPhase
            )}`}
          >
            {currentPhase ?? "—"}
          </p>
        </div>

        <div className="rounded-2xl border border-red-300/15 bg-red-500/10 p-4">
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-red-100/55">
            Bets
          </p>
          <p className="mt-2 text-2xl font-black text-red-100">
            {currentBetsList.length}
          </p>
        </div>

        <div className="rounded-2xl border border-sky-300/15 bg-sky-400/10 p-4">
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-sky-100/55">
            Bet Amount
          </p>
          <p className="mt-2 truncate text-2xl font-black text-sky-100">
            {formatAmount(totalBetAmount)}
          </p>
        </div>
      </section>

      <section className="mt-4 rounded-2xl border border-amber-300/15 bg-black/35 p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.24em] text-amber-200/45">
              Commercial Control
            </p>
            <h2 className="mt-1 text-xl font-black text-amber-100">
              No-Bet Quick Roll
            </h2>
          </div>

          <div className="flex flex-col items-start gap-2 lg:items-end">
            <p
              className={`rounded-full border px-4 py-2 text-xs font-black uppercase tracking-[0.14em] ${getStatusTone(
                controlStatus
              )}`}
            >
              {controlLabel}
            </p>

            <button
              form="commercial-quick-roll-form"
              type="submit"
              disabled={!canCommercialQuickRoll}
              className={`rounded-full border px-5 py-3 text-xs font-black uppercase tracking-[0.16em] transition ${
                canCommercialQuickRoll
                  ? "border-amber-300/25 bg-amber-300/15 text-amber-100 hover:bg-amber-300 hover:text-black"
                  : "cursor-not-allowed border-white/10 bg-white/[0.03] text-white/30"
              }`}
            >
              {canCommercialQuickRoll ? "Set + Roll Now" : "Not Available"}
            </button>
          </div>
        </div>

        {resultIsLocked ? (
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {currentResultAnimals.map((animal, index) => (
              <div
                key={`${animal}-${index}`}
                className="rounded-xl border border-sky-300/20 bg-sky-400/10 p-4"
              >
                <p className="text-[11px] font-black uppercase tracking-[0.16em] text-sky-100/55">
                  Locked Dice {index + 1}
                </p>
                <p className="mt-1 text-xl font-black text-amber-100">
                  {getAnimalLabel(animal)}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <form
            id="commercial-quick-roll-form"
            action={setCommercialResultAction}
            className="mt-4"
          >
            <div className="grid gap-3 md:grid-cols-3">
              {(["dice_1", "dice_2", "dice_3"] as const).map((name, index) => (
                <label
                  key={name}
                  className="rounded-xl border border-white/10 bg-black/30 p-3"
                >
                  <span className="text-xs font-black uppercase tracking-[0.16em] text-white/35">
                    Dice {index + 1}
                  </span>

                  <select
                    name={name}
                    disabled={!canCommercialQuickRoll}
                    defaultValue={SIX_ANIMALS[index] ?? "tiger"}
                    className={`mt-2 w-full rounded-xl border border-amber-300/15 bg-black px-3 py-3 text-sm font-black text-amber-100 outline-none ${
                      canCommercialQuickRoll
                        ? ""
                        : "cursor-not-allowed opacity-45"
                    }`}
                  >
                    {SIX_ANIMALS.map((animal) => (
                      <option key={animal} value={animal}>
                        {getAnimalLabel(animal)}
                      </option>
                    ))}
                  </select>
                </label>
              ))}
            </div>
          </form>
        )}
      </section>

      <section className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-emerald-300/15 bg-emerald-950/10 p-4">
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-emerald-100/55">
            Settled
          </p>
          <p className="mt-2 text-2xl font-black text-emerald-100">
            {settledCount}
          </p>
        </div>

        <div className="rounded-2xl border border-red-300/15 bg-red-950/10 p-4">
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-red-100/55">
            Unsettled
          </p>
          <p className="mt-2 text-2xl font-black text-red-100">
            {unsettledCount}
          </p>
        </div>
      </section>

      {currentBetsList.length > 0 ? (
        <section className="mt-4 rounded-2xl border border-red-300/12 bg-red-950/10 p-4">
          <div className="flex items-end justify-between gap-2">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.24em] text-red-200/55">
                Current Bets
              </p>
              <h2 className="mt-1 text-xl font-black text-amber-100">
                Latest Bets
              </h2>
            </div>

            <p className="rounded-full border border-white/10 bg-black/30 px-4 py-2 text-xs font-black text-white/45">
              {Math.min(currentBetsList.length, 10)} shown
            </p>
          </div>

          <div className="mt-4 overflow-hidden rounded-xl border border-white/10">
            {currentBetsList.slice(0, 10).map((bet) => (
              <div
                key={bet.id}
                className="grid gap-3 border-b border-white/10 bg-black/25 p-3 last:border-b-0 md:grid-cols-[120px_1fr_140px_120px] md:items-center"
              >
                <p className="text-sm font-black capitalize text-amber-100">
                  {bet.bet_type}
                </p>

                <p className="text-sm font-black capitalize text-white/80">
                  {bet.animal}
                  {bet.bet_type === "pair" && bet.animal_2
                    ? ` + ${bet.animal_2}`
                    : ""}
                </p>

                <p className="text-sm font-black text-sky-100">
                  {formatAmount(Number(bet.amount ?? 0))}
                </p>

                <p
                  className={`text-xs font-black ${
                    bet.settled ? "text-emerald-100" : "text-red-100"
                  }`}
                >
                  {bet.settled ? "Settled" : "Unsettled"}
                </p>
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </AdminShell>
  );
}