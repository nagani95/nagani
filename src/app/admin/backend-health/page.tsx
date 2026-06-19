//src/app/admin/backend-health/page.tsx

import Link from "next/link";

import AdminShell from "@/components/admin/AdminShell";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type BackendHealthRow = {
  checked_at: string;
  room_id: string | null;
  current_round_id: string | null;
  round_number: number | null;
  phase: string | null;
  round_status: string | null;
  betting_starts_at: string | null;
  betting_ends_at: string | null;
  rolling_starts_at: string | null;
  result_revealed_at: string | null;
  next_round_starts_at: string | null;
  result_animals: unknown;
  round_age_seconds: number | null;
  jobid: number | null;
  jobname: string | null;
  schedule: string | null;
  cron_active: boolean | null;
  last_run_status: string | null;
  last_return_message: string | null;
  last_run_started_at: string | null;
  last_run_ended_at: string | null;
  last_run_duration_seconds: number | null;
  cron_last_run_age_seconds: number | null;
  failed_run_count_1h: number | null;
  latest_failed_run_status: string | null;
  latest_failed_run_message: string | null;
  latest_failed_run_started_at: string | null;
  old_unsettled_bet_count: number | null;
};

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

function formatSeconds(value: number | null) {
  if (value === null || Number.isNaN(value)) return "—";

  if (value < 60) return `${value}s`;

  const minutes = Math.floor(value / 60);
  const seconds = value % 60;

  return `${minutes}m ${seconds}s`;
}

function normalizeResultAnimals(value: unknown) {
  if (!Array.isArray(value)) return [];

  return value
    .map((animal) => (typeof animal === "string" ? animal : ""))
    .filter(Boolean);
}

function getPhaseTone(phase: string | null) {
  if (phase === "betting") return "text-emerald-100";
  if (phase === "closed") return "text-amber-100";
  if (phase === "rolling") return "text-sky-100";
  if (phase === "result") return "text-purple-100";

  return "text-white/55";
}

function getStatusTone(status: string | null) {
  if (!status) return "border-white/10 bg-white/[0.03] text-white/60";

  const normalizedStatus = status.toLowerCase();

  if (
    ["succeeded", "success", "active", "healthy", "normal"].includes(
      normalizedStatus
    )
  ) {
    return "border-emerald-400/20 bg-emerald-400/10 text-emerald-100";
  }

  if (["warning", "watch", "stale"].includes(normalizedStatus)) {
    return "border-amber-400/25 bg-amber-400/10 text-amber-100";
  }

  return "border-red-400/25 bg-red-400/10 text-red-100";
}

function getPhaseTarget(health: BackendHealthRow | null) {
  if (!health) return null;

  if (health.phase === "betting") return health.betting_ends_at;
  if (health.phase === "closed") return health.rolling_starts_at;
  if (health.phase === "rolling") return health.result_revealed_at;
  if (health.phase === "result") return health.next_round_starts_at;

  return null;
}

function buildHealthWarnings(health: BackendHealthRow | null) {
  if (!health) {
    return ["Backend health snapshot was not returned."];
  }

  const warnings: string[] = [];

  if (!health.cron_active) {
    warnings.push("Cron runner is not active.");
  }

  if (
    health.last_run_status &&
    !["succeeded", "success"].includes(health.last_run_status.toLowerCase())
  ) {
    warnings.push(`Latest cron run is ${health.last_run_status}.`);
  }

  if (
    health.cron_last_run_age_seconds !== null &&
    health.cron_last_run_age_seconds > 15
  ) {
    warnings.push(
      `Cron runner last run is stale: ${formatSeconds(
        health.cron_last_run_age_seconds
      )}.`
    );
  }

  if (
    health.failed_run_count_1h !== null &&
    health.failed_run_count_1h > 0
  ) {
    warnings.push(
      `${health.failed_run_count_1h} failed cron run${
        health.failed_run_count_1h === 1 ? "" : "s"
      } in the last hour.`
    );
  }

  if (
    health.old_unsettled_bet_count !== null &&
    health.old_unsettled_bet_count > 0
  ) {
    warnings.push(
      `${health.old_unsettled_bet_count} old unsettled bet${
        health.old_unsettled_bet_count === 1 ? "" : "s"
      } need investigation.`
    );
  }

  if (health.round_age_seconds !== null && health.round_age_seconds > 120) {
    warnings.push(
      `Current backend round age is high: ${formatSeconds(
        health.round_age_seconds
      )}.`
    );
  }

  return warnings;
}

export default async function AdminBackendHealthPage() {
  const supabase = await createClient();

  const { data: health, error } = await supabase
    .rpc("get_six_animal_backend_health")
    .maybeSingle<BackendHealthRow>();

  const warnings = buildHealthWarnings(health);
  const isHealthy = !error && warnings.length === 0;
  const phaseTarget = getPhaseTarget(health);
  const resultAnimals = normalizeResultAnimals(health?.result_animals ?? null);

  const timelineRows: Array<[string, string | null]> = [
    ["Betting Starts", health?.betting_starts_at ?? null],
    ["Betting Ends", health?.betting_ends_at ?? null],
    ["Rolling Starts", health?.rolling_starts_at ?? null],
    ["Result Revealed", health?.result_revealed_at ?? null],
    ["Next Round Starts", health?.next_round_starts_at ?? null],
  ];

  return (
    <AdminShell
      title="Backend Health"
      eyebrow="Cron Runner Monitor"
      description="Read-only operator visibility for the Six Animal backend dealer, cron runner, round age, failed runs, and old unsettled bet warnings."
      action={
        <Link
          href="/admin/six-animal"
          className="rounded-full border border-sky-300/20 bg-sky-400/10 px-4 py-2 text-xs font-black text-sky-100/85 transition hover:bg-sky-300 hover:text-black"
        >
          Six Animal Monitor
        </Link>
      }
    >
      {error ? (
        <section className="rounded-2xl border border-red-400/25 bg-red-950/25 p-4">
          <p className="text-sm font-black text-red-100">
            Backend health warning
          </p>
          <p className="mt-1 text-xs font-semibold text-red-100/70">
            {error.message}
          </p>
        </section>
      ) : null}

      {!error && warnings.length > 0 ? (
        <section className="rounded-2xl border border-amber-400/25 bg-amber-950/25 p-4">
          <p className="text-sm font-black text-amber-100">
            Operator watch warning
          </p>

          <div className="mt-2 space-y-1">
            {warnings.map((warning) => (
              <p
                key={warning}
                className="text-xs font-semibold leading-5 text-amber-50/65"
              >
                {warning}
              </p>
            ))}
          </div>
        </section>
      ) : null}

      <section className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <div
          className={`rounded-2xl border p-4 ${getStatusTone(
            isHealthy ? "healthy" : "warning"
          )}`}
        >
          <p className="text-[11px] font-black uppercase tracking-[0.2em] opacity-60">
            Health Status
          </p>
          <p className="mt-2 text-2xl font-black">
            {isHealthy ? "Healthy" : "Watch"}
          </p>
        </div>

        <div className="rounded-2xl border border-emerald-300/15 bg-emerald-400/10 p-4">
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-emerald-100/55">
            Cron Active
          </p>
          <p className="mt-2 text-2xl font-black text-emerald-100">
            {health?.cron_active ? "Yes" : "No"}
          </p>
        </div>

        <div className="rounded-2xl border border-sky-300/15 bg-sky-400/10 p-4">
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-sky-100/55">
            Last Run Age
          </p>
          <p className="mt-2 text-2xl font-black text-sky-100">
            {formatSeconds(health?.cron_last_run_age_seconds ?? null)}
          </p>
        </div>

        <div className="rounded-2xl border border-amber-300/15 bg-amber-300/10 p-4">
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-amber-100/55">
            Current Round
          </p>
          <p className="mt-2 text-2xl font-black text-amber-100">
            {health?.round_number ? `#${health.round_number}` : "—"}
          </p>
        </div>

        <div className="rounded-2xl border border-red-300/15 bg-red-500/10 p-4">
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-red-100/55">
            Old Unsettled
          </p>
          <p className="mt-2 text-2xl font-black text-red-100">
            {health?.old_unsettled_bet_count ?? "—"}
          </p>
        </div>
      </section>

      <section className="mt-4 grid gap-4 xl:grid-cols-[1fr_1fr]">
        <article className="rounded-2xl border border-sky-300/12 bg-sky-950/10 p-4">
          <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.28em] text-sky-200/50">
                Cron Runner
              </p>
              <h2 className="mt-1 text-xl font-black text-amber-100">
                six-animal-main-room-runner
              </h2>
            </div>

            <p
              className={`w-fit rounded-full border px-4 py-2 text-xs font-black uppercase tracking-[0.14em] ${getStatusTone(
                health?.last_run_status ?? null
              )}`}
            >
              {health?.last_run_status ?? "—"}
            </p>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <div className="rounded-xl border border-white/10 bg-black/30 p-3">
              <p className="text-xs text-white/40">Job ID</p>
              <p className="mt-1 text-sm font-black text-white/75">
                {health?.jobid ?? "—"}
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-black/30 p-3">
              <p className="text-xs text-white/40">Schedule</p>
              <p className="mt-1 text-sm font-black text-white/75">
                {health?.schedule ?? "—"}
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-black/30 p-3">
              <p className="text-xs text-white/40">Last Started</p>
              <p className="mt-1 text-sm font-black text-white/75">
                {formatTime(health?.last_run_started_at ?? null)}
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-black/30 p-3">
              <p className="text-xs text-white/40">Last Ended</p>
              <p className="mt-1 text-sm font-black text-white/75">
                {formatTime(health?.last_run_ended_at ?? null)}
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-black/30 p-3">
              <p className="text-xs text-white/40">Duration</p>
              <p className="mt-1 text-sm font-black text-white/75">
                {health?.last_run_duration_seconds === null ||
                health?.last_run_duration_seconds === undefined
                  ? "—"
                  : `${health.last_run_duration_seconds.toFixed(4)}s`}
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-black/30 p-3">
              <p className="text-xs text-white/40">Return Message</p>
              <p className="mt-1 break-words text-sm font-black text-white/75">
                {health?.last_return_message ?? "—"}
              </p>
            </div>
          </div>
        </article>

        <article className="rounded-2xl border border-amber-300/12 bg-black/35 p-4">
          <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.28em] text-amber-200/45">
                Live Room State
              </p>
              <h2 className="mt-1 text-xl font-black text-amber-100">
                Backend Dealer Snapshot
              </h2>
            </div>

            <p
              className={`w-fit rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-black uppercase tracking-[0.14em] ${getPhaseTone(
                health?.phase ?? null
              )}`}
            >
              {health?.phase ?? "—"}
            </p>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
              <p className="text-xs text-white/40">Round Status</p>
              <p className="mt-1 text-sm font-black text-white/75">
                {health?.round_status ?? "—"}
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
              <p className="text-xs text-white/40">Round Age</p>
              <p className="mt-1 text-sm font-black text-white/75">
                {formatSeconds(health?.round_age_seconds ?? null)}
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
              <p className="text-xs text-white/40">Phase Target</p>
              <p className="mt-1 text-sm font-black text-white/75">
                {formatTime(phaseTarget)}
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
              <p className="text-xs text-white/40">Checked At</p>
              <p className="mt-1 text-sm font-black text-white/75">
                {formatTime(health?.checked_at ?? null)}
              </p>
            </div>
          </div>
        </article>
      </section>

      <section className="mt-4 grid gap-4 xl:grid-cols-[1fr_1fr]">
        <article className="rounded-2xl border border-purple-300/12 bg-purple-950/10 p-4">
          <p className="text-[11px] font-black uppercase tracking-[0.28em] text-purple-200/50">
            Backend Timestamps
          </p>
          <h2 className="mt-1 text-xl font-black text-amber-100">
            Current Round Timeline
          </h2>

          <div className="mt-4 overflow-hidden rounded-xl border border-white/10">
            {timelineRows.map(([label, value]) => (
              <div
                key={label}
                className="grid gap-2 border-b border-white/10 bg-black/25 p-3 last:border-b-0 md:grid-cols-[180px_1fr]"
              >
                <p className="text-[11px] font-black uppercase tracking-[0.18em] text-white/35">
                  {label}
                </p>
                <p className="text-sm font-black text-white/70">
                  {formatTime(value)}
                </p>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-2xl border border-red-300/12 bg-red-950/10 p-4">
          <p className="text-[11px] font-black uppercase tracking-[0.28em] text-red-200/50">
            Safety Watch
          </p>
          <h2 className="mt-1 text-xl font-black text-amber-100">
            Failure / Settlement Visibility
          </h2>

          <div className="mt-4 grid gap-3">
            <div className="rounded-xl border border-white/10 bg-black/30 p-3">
              <p className="text-xs text-white/40">Failed Runs Last Hour</p>
              <p className="mt-1 text-2xl font-black text-red-100">
                {health?.failed_run_count_1h ?? "—"}
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-black/30 p-3">
              <p className="text-xs text-white/40">Latest Failed Run</p>
              <p className="mt-1 text-sm font-black text-white/75">
                {health?.latest_failed_run_status ?? "—"}
              </p>
              <p className="mt-1 text-xs font-semibold text-white/40">
                {formatTime(health?.latest_failed_run_started_at ?? null)}
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-black/30 p-3">
              <p className="text-xs text-white/40">Latest Failed Message</p>
              <p className="mt-1 break-words text-xs font-semibold leading-5 text-white/55">
                {health?.latest_failed_run_message ?? "—"}
              </p>
            </div>
          </div>
        </article>
      </section>

      <section className="mt-4 rounded-2xl border border-emerald-300/12 bg-emerald-950/10 p-4">
        <p className="text-[11px] font-black uppercase tracking-[0.28em] text-emerald-200/50">
          Result Source
        </p>
        <h2 className="mt-1 text-xl font-black text-amber-100">
          Latest Backend Result Animals
        </h2>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {resultAnimals.length > 0 ? (
            resultAnimals.map((animal, index) => (
              <div
                key={`${animal}-${index}`}
                className="rounded-xl border border-amber-400/15 bg-amber-400/10 p-4"
              >
                <p className="text-xs text-amber-200/55">Dice {index + 1}</p>
                <p className="mt-1 text-2xl font-black capitalize text-amber-100">
                  {animal}
                </p>
              </div>
            ))
          ) : (
            <p className="rounded-xl border border-white/10 bg-black/30 p-4 text-sm font-bold text-white/45 md:col-span-3">
              No result animals visible for the current round yet.
            </p>
          )}
        </div>
      </section>

      <section className="mt-4 rounded-2xl border border-white/10 bg-black/35 p-4">
        <p className="text-[11px] font-black uppercase tracking-[0.28em] text-white/35">
          Read-only Lock
        </p>
        <p className="mt-1 text-sm font-semibold leading-6 text-white/50">
          This health page only reads cron runner and Six Animal backend state.
          It has no admin write buttons, no manual settlement, no payout retry,
          no forced round advance, and no player room control.
        </p>
      </section>
    </AdminShell>
  );
}