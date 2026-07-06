//src/app/admin/slot-launch/page.tsx

import { revalidatePath } from "next/cache";

import AdminShell from "@/components/admin/AdminShell";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type JsonRecord = Record<string, unknown>;
type SlotLaunchSnapshotRow = {
  id: string;
  created_at: string | null;
  created_by: string | null;
  status: string | null;
  active_version: string | null;
  crown_star_status: string | null;
  blocker_count: number | string | null;
  warning_count: number | string | null;
  admin_note: string | null;
};

function toRecord(value: unknown): JsonRecord {
  if (typeof value === "object" && value !== null && !Array.isArray(value)) {
    return value as JsonRecord;
  }

  return {};
}

function asRecords(value: unknown): JsonRecord[] {
  if (!Array.isArray(value)) return [];

  return value.filter(
    (item): item is JsonRecord =>
      typeof item === "object" && item !== null && !Array.isArray(item)
  );
}

function toNumber(value: unknown) {
  if (typeof value === "number") return value;

  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  return 0;
}

function toBoolean(value: unknown) {
  return value === true;
}

function toText(value: unknown) {
  if (value === null || value === undefined) return "—";
  if (typeof value === "string") return value;

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  return "—";
}

function formatTime(value: unknown) {
  if (typeof value !== "string" || value.length === 0) return "—";

  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Yangon",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(new Date(value));
}

function formatLabel(value: string) {
  return value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function getStatusTone(status: unknown) {
  if (status === "pass") {
    return "border-emerald-300/20 bg-emerald-400/10 text-emerald-100";
  }

  if (status === "watch") {
    return "border-amber-300/25 bg-amber-400/10 text-amber-100";
  }

  return "border-red-300/25 bg-red-500/10 text-red-100";
}

function MetricCard({
  label,
  value,
  tone = "neutral",
}: {
  label: string;
  value: unknown;
  tone?: "neutral" | "good" | "watch" | "danger" | "blue";
}) {
  const toneClass =
    tone === "good"
      ? "border-emerald-300/15 bg-emerald-400/10 text-emerald-100"
      : tone === "watch"
        ? "border-amber-300/15 bg-amber-300/10 text-amber-100"
        : tone === "danger"
          ? "border-red-300/15 bg-red-500/10 text-red-100"
          : tone === "blue"
            ? "border-sky-300/15 bg-sky-400/10 text-sky-100"
            : "border-white/10 bg-white/[0.03] text-white/80";

  return (
    <div className={`rounded-2xl border p-4 ${toneClass}`}>
      <p className="text-[11px] font-black uppercase tracking-[0.2em] opacity-55">
        {label}
      </p>
      <p className="mt-2 break-words text-2xl font-black">{toText(value)}</p>
    </div>
  );
}

function SectionTitle({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div>
      <p className="text-[11px] font-black uppercase tracking-[0.28em] text-amber-200/50">
        {eyebrow}
      </p>
      <h2 className="mt-1 text-xl font-black text-amber-100">{title}</h2>
      {description ? (
        <p className="mt-1 text-xs font-semibold leading-5 text-white/45">
          {description}
        </p>
      ) : null}
    </div>
  );
}

function CheckRow({
  label,
  value,
}: {
  label: string;
  value: unknown;
}) {
  const ok = toBoolean(value);

  return (
    <div className="flex items-center justify-between gap-3 border-b border-white/10 py-3 last:border-b-0">
      <p className="text-sm font-bold text-white/55">{label}</p>

      <span
        className={`shrink-0 rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] ${
          ok
            ? "border-emerald-300/20 bg-emerald-400/10 text-emerald-100"
            : "border-red-300/20 bg-red-500/10 text-red-100"
        }`}
      >
        {ok ? "OK" : "Check"}
      </span>
    </div>
  );
}

function IssueList({
  title,
  items,
  tone,
}: {
  title: string;
  items: JsonRecord[];
  tone: "warning" | "danger";
}) {
  const toneClass =
    tone === "danger"
      ? "border-red-400/25 bg-red-950/25 text-red-100"
      : "border-amber-400/25 bg-amber-950/25 text-amber-100";

  return (
    <section className={`rounded-2xl border p-4 ${toneClass}`}>
      <p className="text-sm font-black">{title}</p>

      {items.length > 0 ? (
        <div className="mt-3 space-y-2">
          {items.map((item, index) => (
            <div
              key={`${toText(item.code)}-${index}`}
              className="rounded-xl border border-white/10 bg-black/25 p-3"
            >
              <p className="text-xs font-black uppercase tracking-[0.16em] opacity-70">
                {toText(item.code)}
              </p>
              <p className="mt-1 text-sm font-semibold leading-6 opacity-80">
                {toText(item.message)}
              </p>
              {item.count !== undefined ? (
                <p className="mt-1 text-xs font-bold opacity-55">
                  Count: {toText(item.count)}
                </p>
              ) : null}
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-2 text-xs font-semibold opacity-60">None.</p>
      )}
    </section>
  );
}

async function createLaunchReadinessSnapshot(formData: FormData) {
  "use server";

  const supabase = await createClient();

  const noteValue = formData.get("admin_note");
  const adminNote = typeof noteValue === "string" ? noteValue : "";

  const { error } = await supabase.rpc(
    "create_slot_launch_readiness_snapshot_v1",
    {
      p_admin_note: adminNote,
    }
  );

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/slot-launch");
}

export default async function AdminSlotLaunchPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("get_slot_launch_readiness_v1");
  const { data: dryRunData, error: dryRunError } = await supabase.rpc(
  "get_slot_activation_dry_run_v1"
);

const dryRun = toRecord(dryRunData);
const dryRunBlockers = asRecords(dryRun.blockers);
const dryRunWarnings = asRecords(dryRun.warnings);
const dryRunCurrentState = toRecord(dryRun.current_state);
const dryRunTargetState = toRecord(dryRun.target_state);
const dryRunLatestSnapshot = toRecord(dryRun.latest_snapshot);

  const { data: snapshotRows, error: snapshotError } = await supabase
  .from("slot_launch_readiness_snapshots")
  .select(
    "id, created_at, created_by, status, active_version, crown_star_status, blocker_count, warning_count, admin_note"
  )
  .order("created_at", { ascending: false })
  .limit(5);

const snapshots = Array.isArray(snapshotRows)
  ? (snapshotRows as SlotLaunchSnapshotRow[])
  : [];

  const readiness = toRecord(data);
  const status = readiness.status;

  const blockers = asRecords(readiness.blockers);
  const warnings = asRecords(readiness.warnings);

  const slotMath = toRecord(readiness.slot_math);
  const crownStarConfig = toRecord(readiness.crown_star_config);
  const backendFunctions = toRecord(readiness.backend_functions);
  const safetyCounters = toRecord(readiness.safety_counters);
  const freeSpinConstraints = toRecord(readiness.free_spin_constraints);
  const manualChecks = toRecord(readiness.manual_frontend_checks);
  const constraints = asRecords(freeSpinConstraints.constraints);

  const hasBlockers = blockers.length > 0;
  const hasWarnings = warnings.length > 0;

  return (
    <AdminShell
      title="Slot Launch Gate"
      eyebrow="S12 Production Readiness"
      description="Read-only launch checklist for premium slot math, Crown/Star draft safety, backend functions, free-spin constraints, wallet counters, and frontend manual checks."
    >
      {error ? (
        <section className="rounded-2xl border border-red-400/25 bg-red-950/25 p-4">
          <p className="text-sm font-black text-red-100">
            Slot launch readiness warning
          </p>
          <p className="mt-1 text-xs font-semibold text-red-100/70">
            {error.message}
          </p>
        </section>
      ) : null}

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <div className={`rounded-2xl border p-4 ${getStatusTone(status)}`}>
          <p className="text-[11px] font-black uppercase tracking-[0.2em] opacity-60">
            Launch Gate
          </p>
          <p className="mt-2 text-2xl font-black uppercase">
            {toText(status)}
          </p>
        </div>

        <MetricCard
          label="Active Math"
          value={slotMath.active_version}
          tone={toBoolean(slotMath.v1_low_cap_active_ok) ? "good" : "danger"}
        />

        <MetricCard
          label="Crown/Star"
          value={slotMath.crown_star_status}
          tone={toBoolean(slotMath.crown_star_draft_ok) ? "good" : "danger"}
        />

        <MetricCard
          label="Blockers"
          value={blockers.length}
          tone={hasBlockers ? "danger" : "good"}
        />

        <MetricCard
          label="Warnings"
          value={warnings.length}
          tone={hasWarnings ? "watch" : "good"}
        />
      </section>

      <section className="mt-4 grid gap-4 xl:grid-cols-2">
        <IssueList title="Blockers" items={blockers} tone="danger" />
        <IssueList title="Warnings" items={warnings} tone="warning" />
      </section>

      <section className="mt-4 rounded-2xl border border-amber-300/12 bg-black/35 p-4">
  <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
    <SectionTitle
      eyebrow="Launch Decision Snapshot"
      title="Save Readiness Checkpoint"
      description="Saves the current gate result for audit history. This does not activate Crown/Star and does not change slot math."
    />

    <form
      action={createLaunchReadinessSnapshot}
      className="flex w-full flex-col gap-2 xl:max-w-xl"
    >
      <input
        name="admin_note"
        placeholder="Admin note, example: checked before launch decision"
        className="rounded-xl border border-white/10 bg-black/45 px-4 py-3 text-sm font-bold text-white/80 outline-none placeholder:text-white/25 focus:border-amber-300/35"
      />

      <button
        type="submit"
        className="rounded-xl border border-amber-300/25 bg-amber-300/15 px-4 py-3 text-sm font-black text-amber-100 transition hover:bg-amber-300 hover:text-black"
      >
        Save Readiness Snapshot
      </button>

      <p className="text-[11px] font-bold text-white/35">
        No activation. No wallet update. No math switch.
      </p>
    </form>
  </div>

  {snapshotError ? (
    <p className="mt-4 rounded-xl border border-red-400/25 bg-red-950/25 p-3 text-xs font-bold text-red-100/80">
      {snapshotError.message}
    </p>
  ) : null}

  <div className="mt-4 overflow-hidden rounded-xl border border-white/10">
    {snapshots.map((snapshot) => (
      <article
        key={snapshot.id}
        className="grid gap-3 border-b border-white/10 bg-black/25 p-3 last:border-b-0 xl:grid-cols-[170px_1fr_120px_120px_180px] xl:items-center"
      >
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-amber-100">
            {toText(snapshot.status)}
          </p>
          <p className="mt-1 text-[11px] font-semibold text-white/35">
            {formatTime(snapshot.created_at)}
          </p>
        </div>

        <div className="min-w-0">
          <p className="break-all text-xs font-bold text-white/45">
            {toText(snapshot.active_version)}
          </p>
          <p className="mt-1 text-xs font-semibold text-white/35">
            Crown/Star: {toText(snapshot.crown_star_status)}
          </p>
          <p className="mt-1 text-xs font-semibold leading-5 text-white/45">
            {toText(snapshot.admin_note)}
          </p>
        </div>

        <p className="text-sm font-black text-red-100">
          Blockers: {toText(snapshot.blocker_count)}
        </p>

        <p className="text-sm font-black text-amber-100">
          Warnings: {toText(snapshot.warning_count)}
        </p>

        <p className="break-all text-[11px] font-semibold text-white/30">
          {toText(snapshot.created_by)}
        </p>
      </article>
    ))}

    {snapshots.length === 0 ? (
      <div className="bg-black/25 p-4">
        <p className="rounded-xl border border-white/10 bg-black/30 p-4 text-sm font-bold text-white/40">
          No launch readiness snapshots saved yet.
        </p>
      </div>
    ) : null}
  </div>
</section>

<section className="mt-4 rounded-2xl border border-purple-300/12 bg-purple-950/10 p-4">
  <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
    <SectionTitle
      eyebrow="Activation Dry-Run"
      title="Future Activation Plan Check"
      description="Read-only dry-run for the future Crown/Star activation step. This does not activate slot math."
    />

    <span
      className={`rounded-full border px-4 py-2 text-xs font-black uppercase tracking-[0.18em] ${getStatusTone(
        dryRun.status
      )}`}
    >
      {toText(dryRun.status)}
    </span>
  </div>

  {dryRunError ? (
    <p className="mt-4 rounded-xl border border-red-400/25 bg-red-950/25 p-3 text-xs font-bold text-red-100/80">
      {dryRunError.message}
    </p>
  ) : null}

  <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
    <MetricCard
      label="Dry-Run Status"
      value={dryRun.status}
      tone={
        dryRun.status === "pass"
          ? "good"
          : dryRun.status === "watch"
            ? "watch"
            : "danger"
      }
    />

    <MetricCard
      label="Dry-Run Blockers"
      value={dryRunBlockers.length}
      tone={dryRunBlockers.length === 0 ? "good" : "danger"}
    />

    <MetricCard
      label="Dry-Run Warnings"
      value={dryRunWarnings.length}
      tone={dryRunWarnings.length === 0 ? "good" : "watch"}
    />

    <MetricCard
      label="Activation Performed"
      value={dryRun.activation_performed}
      tone={dryRun.activation_performed === false ? "good" : "danger"}
    />

    <MetricCard
      label="Activation Allowed"
      value={dryRun.activation_allowed_by_this_rpc}
      tone={dryRun.activation_allowed_by_this_rpc === false ? "good" : "danger"}
    />
  </div>

  <div className="mt-4 grid gap-4 xl:grid-cols-2">
    <article className="rounded-2xl border border-sky-300/12 bg-black/25 p-4">
      <SectionTitle
        eyebrow="Current State"
        title="Live Active Math"
        description="This must still be the safe V1 active version before any future Crown/Star activation."
      />

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        <MetricCard
          label="Current Active"
          value={dryRunCurrentState.current_active_version}
          tone={
            toBoolean(dryRunCurrentState.current_active_expected_ok)
              ? "good"
              : "danger"
          }
        />

        <MetricCard
          label="Expected OK"
          value={dryRunCurrentState.current_active_expected_ok}
          tone={
            toBoolean(dryRunCurrentState.current_active_expected_ok)
              ? "good"
              : "danger"
          }
        />
      </div>

      <p className="mt-3 break-all text-xs font-semibold text-white/35">
        ID: {toText(dryRunCurrentState.current_active_id)}
      </p>
    </article>

    <article className="rounded-2xl border border-amber-300/12 bg-black/25 p-4">
      <SectionTitle
        eyebrow="Target State"
        title="Crown/Star Draft Target"
        description="This must remain draft and ready. Dry-run only checks it."
      />

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        <MetricCard
          label="Target Version"
          value={dryRunTargetState.activation_target_version}
          tone="blue"
        />

        <MetricCard
          label="Draft Ready"
          value={dryRunTargetState.target_is_draft_and_ready}
          tone={
            toBoolean(dryRunTargetState.target_is_draft_and_ready)
              ? "good"
              : "danger"
          }
        />
      </div>

      <p className="mt-3 break-all text-xs font-semibold text-white/35">
        ID: {toText(dryRunTargetState.activation_target_id)}
      </p>
    </article>
  </div>

  <div className="mt-4 grid gap-4 xl:grid-cols-2">
    <article className="rounded-2xl border border-emerald-300/12 bg-black/25 p-4">
      <SectionTitle
        eyebrow="Snapshot Requirement"
        title="Latest Readiness Snapshot"
        description="A fresh snapshot must exist before any future activation step."
      />

      <div className="mt-4 rounded-xl border border-white/10 bg-black/25 p-3">
        <CheckRow
          label="Snapshot exists"
          value={dryRunLatestSnapshot.exists}
        />
        <CheckRow
          label="Snapshot fresh within 24 hours"
          value={dryRunLatestSnapshot.fresh_24h_ok}
        />
        <CheckRow
          label="Snapshot has zero blockers"
          value={dryRunLatestSnapshot.clean_enough_for_decision}
        />
      </div>

      <p className="mt-3 text-xs font-semibold text-white/35">
        Snapshot status: {toText(dryRunLatestSnapshot.status)}
      </p>
      <p className="mt-1 text-xs font-semibold text-white/35">
        Snapshot time: {formatTime(dryRunLatestSnapshot.created_at)}
      </p>
    </article>

    <article className="rounded-2xl border border-red-300/12 bg-black/25 p-4">
      <SectionTitle
        eyebrow="Dry-Run Issues"
        title="Blockers + Warnings"
        description="Blockers stop activation. Warnings require operator review."
      />

      <div className="mt-4 grid gap-3">
        <IssueList
          title="Dry-Run Blockers"
          items={dryRunBlockers}
          tone="danger"
        />
        <IssueList
          title="Dry-Run Warnings"
          items={dryRunWarnings}
          tone="warning"
        />
      </div>
    </article>
  </div>

  <section className="mt-4 rounded-2xl border border-white/10 bg-black/35 p-4">
    <SectionTitle eyebrow="Read-only Lock" title="Dry-Run Only" />

    <p className="mt-2 text-sm font-semibold leading-6 text-white/50">
      This dry-run only checks whether a future activation step would be
      prepared. It does not update slot_math_versions, does not activate
      Crown/Star, does not edit wallets, and does not change player state.
    </p>

    <p className="mt-3 text-xs font-semibold text-white/35">
      Message: {toText(dryRun.message)}
    </p>
  </section>
</section>

      <section className="mt-4 grid gap-4 xl:grid-cols-2">
        <article className="rounded-2xl border border-emerald-300/12 bg-emerald-950/10 p-4">
          <SectionTitle
            eyebrow="Slot Math"
            title="Active + Draft State"
            description="Crown/Star must stay draft here. This page must not activate it."
          />

          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            <MetricCard
              label="Active Count"
              value={slotMath.active_count}
              tone={toNumber(slotMath.active_count) === 1 ? "good" : "danger"}
            />
            <MetricCard
              label="Active RTP"
              value={slotMath.active_rtp_target}
              tone="blue"
            />
            <MetricCard
              label="Crown/Star RTP"
              value={slotMath.crown_star_rtp_target}
              tone="blue"
            />
            <MetricCard
              label="Activation Allowed"
              value={readiness.activation_allowed_by_this_rpc}
              tone="watch"
            />
          </div>

          <div className="mt-4 rounded-xl border border-white/10 bg-black/25 p-3">
            <CheckRow
              label="V1 LOW CAP 82 is the only active math"
              value={slotMath.v1_low_cap_active_ok}
            />
            <CheckRow
              label="Old SYMBOL LOCK 83 is not active"
              value={slotMath.old_symbol_lock_not_active_ok}
            />
            <CheckRow
              label="Crown/Star draft exists"
              value={slotMath.crown_star_exists}
            />
            <CheckRow
              label="Crown/Star stays draft and RTP target is safe"
              value={slotMath.crown_star_draft_ok}
            />
          </div>
        </article>

        <article className="rounded-2xl border border-amber-300/12 bg-amber-950/10 p-4">
          <SectionTitle
            eyebrow="Crown/Star Config"
            title="Locked S10 Rules"
            description="Checks symbol keys, wild rule, scatter rules, reel count, reel length, and allowed Crown/Star reels."
          />

          <div className="mt-4 rounded-xl border border-white/10 bg-black/25 p-3">
            <CheckRow label="Crown symbol OK" value={crownStarConfig.crown_symbol_ok} />
            <CheckRow label="Star symbol OK" value={crownStarConfig.star_symbol_ok} />
            <CheckRow label="Wild does not replace Crown/Star" value={crownStarConfig.wild_rule_ok} />
            <CheckRow label="Crown free-spin rule OK" value={crownStarConfig.crown_rule_ok} />
            <CheckRow label="Star instant bonus rule OK" value={crownStarConfig.star_rule_ok} />
            <CheckRow label="5 reels OK" value={crownStarConfig.reel_count_ok} />
            <CheckRow label="180 length per reel OK" value={crownStarConfig.reel_length_ok} />
            <CheckRow label="Crown only on reels 2 and 4" value={crownStarConfig.crown_reels_ok} />
            <CheckRow label="Star on reels 0, 1, 3, 4" value={crownStarConfig.star_reels_ok} />
          </div>

          <p className="mt-3 text-xs font-semibold leading-5 text-white/40">
            Reel lengths: {JSON.stringify(crownStarConfig.reel_lengths ?? [])}
          </p>
          <p className="mt-1 text-xs font-semibold leading-5 text-white/40">
            Crown reels:{" "}
            {JSON.stringify(crownStarConfig.crown_reels_zero_indexed ?? [])}
          </p>
          <p className="mt-1 text-xs font-semibold leading-5 text-white/40">
            Star reels:{" "}
            {JSON.stringify(crownStarConfig.star_reels_zero_indexed ?? [])}
          </p>
        </article>
      </section>

      <section className="mt-4 grid gap-4 xl:grid-cols-2">
        <article className="rounded-2xl border border-sky-300/12 bg-sky-950/10 p-4">
          <SectionTitle
            eyebrow="Backend Functions"
            title="Required RPCs"
            description="All must exist before slot launch decision."
          />

          <div className="mt-4 rounded-xl border border-white/10 bg-black/25 p-3">
            {Object.entries(backendFunctions).map(([key, value]) => (
              <CheckRow key={key} label={formatLabel(key)} value={value} />
            ))}
          </div>
        </article>

        <article className="rounded-2xl border border-purple-300/12 bg-purple-950/10 p-4">
          <SectionTitle
            eyebrow="Free Spin Constraint"
            title="Crown 1/2 Trigger Support"
            description="trigger_scatter_count must allow Crown 1 and Crown 2 sessions."
          />

          <div className="mt-4 rounded-xl border border-white/10 bg-black/25 p-3">
            <CheckRow
              label="trigger_scatter_count allows Crown 1/2"
              value={freeSpinConstraints.trigger_scatter_count_ready_for_crown_1_2}
            />
          </div>

          <div className="mt-4 space-y-2">
            {constraints.map((constraint, index) => (
              <div
                key={`${toText(constraint.name)}-${index}`}
                className="rounded-xl border border-white/10 bg-black/25 p-3"
              >
                <p className="text-xs font-black text-purple-100">
                  {toText(constraint.name)}
                </p>
                <p className="mt-1 break-all text-[11px] font-semibold leading-5 text-white/35">
                  {toText(constraint.definition)}
                </p>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="mt-4 grid gap-4 xl:grid-cols-2">
        <article className="rounded-2xl border border-red-300/12 bg-red-950/10 p-4">
          <SectionTitle
            eyebrow="Safety Counters"
            title="Money + Settlement Safety"
            description="Negative wallets are blockers. Old unsettled Six Animal bets are warnings."
          />

          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            <MetricCard
              label="Negative Wallets"
              value={safetyCounters.negative_wallet_count}
              tone={
                toNumber(safetyCounters.negative_wallet_count) === 0
                  ? "good"
                  : "danger"
              }
            />
            <MetricCard
              label="Old Unsettled Bets"
              value={safetyCounters.old_unsettled_six_animal_bets}
              tone={
                toNumber(safetyCounters.old_unsettled_six_animal_bets) === 0
                  ? "good"
                  : "watch"
              }
            />
            <MetricCard
              label="Wallet High Risk"
              value={safetyCounters.wallet_risk_high_count}
              tone={
                toNumber(safetyCounters.wallet_risk_high_count) === 0
                  ? "good"
                  : "watch"
              }
            />
            <MetricCard
              label="Wallet Watch Risk"
              value={safetyCounters.wallet_risk_watch_count}
              tone={
                toNumber(safetyCounters.wallet_risk_watch_count) === 0
                  ? "good"
                  : "watch"
              }
            />
          </div>
        </article>

        <article className="rounded-2xl border border-white/10 bg-black/35 p-4">
          <SectionTitle
            eyebrow="Manual Frontend Checks"
            title="Admin Surface"
            description="These are manual gate reminders. Run build after this page is added."
          />

          <div className="mt-4 rounded-xl border border-white/10 bg-black/25 p-3">
            {Object.entries(manualChecks).map(([key, value]) => (
              <CheckRow key={key} label={formatLabel(key)} value={value} />
            ))}
          </div>
        </article>
      </section>

      <section className="mt-4 rounded-2xl border border-white/10 bg-black/35 p-4">
        <SectionTitle eyebrow="Read-only Lock" title="No Activation Button" />

        <p className="mt-2 text-sm font-semibold leading-6 text-white/50">
          This S12 launch gate only reads production readiness state. It does
          not activate Crown/Star math, does not update slot_math_versions,
          does not edit wallets, does not process bonus, does not approve
          withdrawals, and does not change risk status.
        </p>

        <p className="mt-3 text-xs font-semibold text-white/35">
          Checked at: {formatTime(readiness.checked_at)}
        </p>

        <p className="mt-1 text-xs font-semibold text-white/35">
          Message: {toText(readiness.message)}
        </p>
      </section>
    </AdminShell>
  );
}