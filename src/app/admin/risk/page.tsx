// src/app/admin/risk/page.tsx

import AdminShell from "@/components/admin/AdminShell";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type JsonRecord = Record<string, unknown>;

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

function toText(value: unknown) {
  if (value === null || value === undefined) return "—";
  if (typeof value === "string") return value;

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  return "—";
}

function formatAmount(value: unknown) {
  return `${new Intl.NumberFormat("en-US").format(toNumber(value))} MMK`;
}

function formatTime(value: unknown) {
  if (typeof value !== "string" || value.length === 0) return "—";

  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Yangon",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
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
      <p className="mt-2 text-2xl font-black">{toText(value)}</p>
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

function EmptyState({ message }: { message: string }) {
  return (
    <p className="rounded-xl border border-white/10 bg-black/30 p-4 text-sm font-bold text-white/40">
      {message}
    </p>
  );
}

export default async function AdminRiskPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("get_admin_risk_dashboard_v1");

  const dashboard = toRecord(data);
  const profileSummary = toRecord(dashboard.profile_summary);
  const registrationSummary = toRecord(dashboard.registration_summary_24h);
  const deviceSummary = toRecord(dashboard.device_cluster_summary);
  const ipSummary = toRecord(dashboard.ip_cluster_summary);
  const walletRiskSummary = toRecord(dashboard.wallet_request_risk_summary_7d);
  const walletRequestSummary = toRecord(dashboard.wallet_request_summary_7d);

  const topRiskPlayers = asRecords(dashboard.top_risk_players);
  const topDeviceClusters = asRecords(dashboard.top_device_clusters);
  const topIpClusters = asRecords(dashboard.top_ip_clusters);
  const topPaymentClusters = asRecords(dashboard.top_payment_clusters_30d);
  const recentRiskWalletRequests = asRecords(
    dashboard.recent_risk_wallet_requests
  );

  return (
    <AdminShell
      title="Risk Dashboard"
      eyebrow="Admin Watch Center"
      description="Read-only overview for account trust, registration protection, wallet request risk, device/IP clusters, and payment reuse signals."
    >
      {error ? (
        <section className="rounded-2xl border border-red-400/25 bg-red-950/25 p-4">
          <p className="text-sm font-black text-red-100">
            Risk dashboard warning
          </p>
          <p className="mt-1 text-xs font-semibold text-red-100/70">
            {error.message}
          </p>
        </section>
      ) : null}

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
        <MetricCard
          label="Total Players"
          value={profileSummary.total_players}
          tone="blue"
        />
        <MetricCard
          label="Watch Players"
          value={profileSummary.risk_watch_count}
          tone="watch"
        />
        <MetricCard
          label="High Risk"
          value={profileSummary.risk_high_count}
          tone="danger"
        />
        <MetricCard
          label="Manual Review"
          value={profileSummary.manual_review_required_count}
          tone="watch"
        />
        <MetricCard
          label="W/D Unlocked"
          value={profileSummary.withdrawal_unlocked_count}
          tone="good"
        />
        <MetricCard
          label="Max Risk Score"
          value={profileSummary.max_risk_score}
          tone="danger"
        />
      </section>

      <section className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Reg Attempts 24h"
          value={registrationSummary.total_attempts}
          tone="blue"
        />
        <MetricCard
          label="Blocked Reg 24h"
          value={registrationSummary.blocked_count}
          tone="danger"
        />
        <MetricCard
          label="Shared Devices"
          value={deviceSummary.shared_device_cluster_count}
          tone="watch"
        />
        <MetricCard
          label="Shared IPs"
          value={ipSummary.shared_ip_cluster_count}
          tone="watch"
        />
      </section>

      <section className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Wallet Risk Snapshots"
          value={walletRiskSummary.snapshot_count}
          tone="blue"
        />
        <MetricCard
          label="Wallet Watch"
          value={walletRiskSummary.watch_count}
          tone="watch"
        />
        <MetricCard
          label="Wallet High"
          value={walletRiskSummary.high_count}
          tone="danger"
        />
        <MetricCard
          label="Pending Withdraw"
          value={formatAmount(walletRequestSummary.pending_withdraw_amount)}
          tone="watch"
        />
      </section>

      <section className="mt-4 grid gap-4 xl:grid-cols-2">
        <article className="rounded-2xl border border-red-300/12 bg-red-950/10 p-4">
          <SectionTitle
            eyebrow="Player Risk"
            title="Top Risk Players"
            description="Players with risk score, watch status, manual review requirement, or restricted/blocked status."
          />

          <div className="mt-4 space-y-3">
            {topRiskPlayers.map((player) => (
              <div
                key={toText(player.profile_id)}
                className="rounded-xl border border-white/10 bg-black/25 p-3"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-black text-amber-100">
                      {toText(player.phone_number)}
                    </p>
                    <p className="mt-1 text-xs font-bold text-white/35">
                      ID: {toText(player.member_code)}
                    </p>
                  </div>

                  <span className="rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-amber-100">
                    {toText(player.risk_level)} / {toText(player.risk_score)}
                  </span>
                </div>

                <p className="mt-2 break-all text-xs font-semibold leading-5 text-white/45">
                  Reasons: {JSON.stringify(player.risk_reasons ?? [])}
                </p>
              </div>
            ))}

            {topRiskPlayers.length === 0 ? (
              <EmptyState message="No player risk rows found." />
            ) : null}
          </div>
        </article>

        <article className="rounded-2xl border border-amber-300/12 bg-amber-950/10 p-4">
          <SectionTitle
            eyebrow="Wallet Risk"
            title="Recent Risk Wallet Requests"
            description="Medium/high/watch wallet request snapshots and duplicate device/IP/payment signals."
          />

          <div className="mt-4 space-y-3">
            {recentRiskWalletRequests.map((request) => (
              <div
                key={toText(request.wallet_request_id)}
                className="rounded-xl border border-white/10 bg-black/25 p-3"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-black text-amber-100">
                      {toText(request.request_type)} •{" "}
                      {formatAmount(request.amount)}
                    </p>
                    <p className="mt-1 text-xs font-bold text-white/35">
                      {toText(request.phone_number)} •{" "}
                      {toText(request.member_code)}
                    </p>
                  </div>

                  <span className="rounded-full border border-red-300/20 bg-red-400/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-red-100">
                    {toText(request.risk_level)} / {toText(request.risk_score)}
                  </span>
                </div>

                <p className="mt-2 text-xs font-semibold leading-5 text-white/45">
                  Device {toText(request.same_device_profile_count)} • IP{" "}
                  {toText(request.same_ip_profile_count)} • Payment{" "}
                  {toText(request.same_payment_profile_count)}
                </p>

                <p className="mt-1 text-xs font-semibold text-white/30">
                  {formatTime(request.created_at)}
                </p>
              </div>
            ))}

            {recentRiskWalletRequests.length === 0 ? (
              <EmptyState message="No recent risk wallet requests found." />
            ) : null}
          </div>
        </article>
      </section>

      <section className="mt-4 grid gap-4 xl:grid-cols-3">
        <article className="rounded-2xl border border-sky-300/12 bg-sky-950/10 p-4">
          <SectionTitle
            eyebrow="Device Clusters"
            title="Top Shared Devices"
          />

          <div className="mt-4 space-y-3">
            {topDeviceClusters.map((cluster) => (
              <div
                key={toText(cluster.device_hash)}
                className="rounded-xl border border-white/10 bg-black/25 p-3"
              >
                <p className="text-sm font-black text-sky-100">
                  {toText(cluster.profile_count)} profiles
                </p>
                <p className="mt-1 break-all text-[11px] font-semibold text-white/35">
                  {toText(cluster.device_hash)}
                </p>
                <p className="mt-1 text-xs font-semibold text-white/30">
                  Last: {formatTime(cluster.last_seen_at)}
                </p>
              </div>
            ))}

            {topDeviceClusters.length === 0 ? (
              <EmptyState message="No shared device clusters found." />
            ) : null}
          </div>
        </article>

        <article className="rounded-2xl border border-purple-300/12 bg-purple-950/10 p-4">
          <SectionTitle eyebrow="IP Clusters" title="Top Shared IPs" />

          <div className="mt-4 space-y-3">
            {topIpClusters.map((cluster) => (
              <div
                key={toText(cluster.ip_hash)}
                className="rounded-xl border border-white/10 bg-black/25 p-3"
              >
                <p className="text-sm font-black text-purple-100">
                  {toText(cluster.profile_count)} profiles
                </p>
                <p className="mt-1 break-all text-[11px] font-semibold text-white/35">
                  {toText(cluster.ip_hash)}
                </p>
                <p className="mt-1 text-xs font-semibold text-white/30">
                  Last: {formatTime(cluster.last_seen_at)}
                </p>
              </div>
            ))}

            {topIpClusters.length === 0 ? (
              <EmptyState message="No shared IP clusters found." />
            ) : null}
          </div>
        </article>

        <article className="rounded-2xl border border-emerald-300/12 bg-emerald-950/10 p-4">
          <SectionTitle
            eyebrow="Payment Clusters"
            title="Shared Payment Accounts"
          />

          <div className="mt-4 space-y-3">
            {topPaymentClusters.map((cluster) => (
              <div
                key={toText(cluster.payment_account_hash)}
                className="rounded-xl border border-white/10 bg-black/25 p-3"
              >
                <p className="text-sm font-black text-emerald-100">
                  {toText(cluster.profile_count)} profiles
                </p>
                <p className="mt-1 break-all text-[11px] font-semibold text-white/35">
                  {toText(cluster.payment_account_hash)}
                </p>
                <p className="mt-1 text-xs font-semibold text-white/30">
                  Last: {formatTime(cluster.latest_seen_at)}
                </p>
              </div>
            ))}

            {topPaymentClusters.length === 0 ? (
              <EmptyState message="No shared payment clusters found." />
            ) : null}
          </div>
        </article>
      </section>

      <section className="mt-4 rounded-2xl border border-white/10 bg-black/35 p-4">
        <SectionTitle eyebrow="Read-only Lock" title="No Action Buttons" />

        <p className="mt-2 text-sm font-semibold leading-6 text-white/50">
          This S11 dashboard only reads risk state. It does not block players,
          edit wallet balances, approve/reject wallet requests, change account
          trust status, or modify any risk scores.
        </p>

        <p className="mt-3 text-xs font-semibold text-white/35">
          Checked at: {formatTime(dashboard.checked_at)}
        </p>
      </section>
    </AdminShell>
  );
}