// src/app/admin/page.tsx

import Link from "next/link";

import AdminShell from "@/components/admin/AdminShell";
import { createClient } from "@/lib/supabase/server";

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
  amount: number;
  settled: boolean;
};

type AdminAuditLog = {
  id: string;
  action: string;
  target_id: string | null;
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

function getPhaseTone(phase: string | null) {
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

export default async function AdminPage() {
  const supabase = await createClient();

  const { data: currentRound, error: currentRoundError } = await supabase
    .from("six_animal_rounds")
    .select(
      "id, room_id, round_number, phase, status, betting_starts_at, betting_ends_at, rolling_starts_at, result_revealed_at, next_round_starts_at, created_at"
    )
    .eq("room_id", MAIN_ROOM_ID)
    .order("round_number", { ascending: false })
    .limit(1)
    .maybeSingle<SixAnimalRound>();

  const { data: currentBets, error: currentBetsError } = currentRound?.id
    ? await supabase
        .from("six_animal_bets")
        .select("id, amount, settled")
        .eq("round_id", currentRound.id)
        .returns<SixAnimalBet[]>()
    : { data: [], error: null };

  const {
    count: pendingWalletRequestCount,
    error: pendingWalletRequestError,
  } = await supabase
    .from("wallet_requests")
    .select("id", { count: "exact", head: true })
    .eq("status", "pending");
  
  const { count: openSupportCount, error: openSupportError } = await supabase
  .from("support_conversations")
  .select("id", { count: "exact", head: true })
  .eq("status", "open");

  const { data: auditLogs, error: auditLogsError } = await supabase
    .from("admin_audit_logs")
    .select("id, action, target_id, created_at")
    .order("created_at", { ascending: false })
    .limit(5)
    .returns<AdminAuditLog[]>();

  const currentBetCount = currentBets?.length ?? 0;
  const currentBetTotal = (currentBets ?? []).reduce(
    (sum, bet) => sum + Number(bet.amount ?? 0),
    0
  );
  const currentSettledCount = (currentBets ?? []).filter(
    (bet) => bet.settled
  ).length;
  const currentUnsettledCount = currentBetCount - currentSettledCount;
  const phaseTarget = getPhaseTarget(currentRound);

  const errors: string[] = [
    currentRoundError ? `Current round: ${currentRoundError.message}` : null,
    currentBetsError ? `Current bets: ${currentBetsError.message}` : null,
pendingWalletRequestError
  ? `Wallet requests: ${pendingWalletRequestError.message}`
  : null,
openSupportError ? `Support: ${openSupportError.message}` : null,
auditLogsError ? `Audit logs: ${auditLogsError.message}` : null,
  ].filter((error): error is string => Boolean(error));

  const quickStats = [
    {
      label: "Six Animal Round",
      value: currentRound ? `#${currentRound.round_number}` : "—",
      tone: "border-amber-300/15 bg-amber-300/10 text-amber-100",
    },
    {
      label: "Live Phase",
      value: currentRound?.phase ?? "—",
      tone: "border-emerald-300/15 bg-emerald-300/10",
      valueClassName: `capitalize ${getPhaseTone(currentRound?.phase ?? null)}`,
    },
    {
      label: "Pending Wallet",
      value: String(pendingWalletRequestCount ?? 0),
      tone: "border-red-300/15 bg-red-500/10 text-red-100",
    },
    {
      label: "Current Bets",
      value: String(currentBetCount),
      tone: "border-sky-300/15 bg-sky-400/10 text-sky-100",
    },
    {
      label: "Bet Total",
      value: formatAmount(currentBetTotal),
      tone: "border-white/10 bg-white/[0.03] text-amber-100",
    },
  ];

  const controlSections = [
    {
      title: "Users",
      href: "/admin/users",
      label: "Members",
      detail: "Member records, wallet balance, referral status, and controls.",
      stat: "Open",
    },
    {
      title: "Wallet Requests",
      href: "/admin/wallet-requests",
      label: "Balance",
      detail: "Deposit and withdraw request review.",
      stat: `${pendingWalletRequestCount ?? 0}`,
    },
    {
  title: "Support Chat",
  href: "/admin/support",
  label: "Open",
  detail: "Read player messages and reply from admin support inbox.",
  stat: `${openSupportCount ?? 0}`,
},
    {
      title: "Agents",
      href: "/admin/agents",
      label: "Referral",
      detail: "Create agents, commission rate, pause/activate partners.",
      stat: "Open",
    },
    {
      title: "Referrals",
      href: "/admin/referrals",
      label: "Assign",
      detail: "Assign players to active agents for monthly net settlement.",
      stat: "Open",
    },
    {
      title: "Six Animal",
      href: "/admin/six-animal",
      label: currentRound?.phase ?? "Room",
      detail: "Read-only live room risk, payout, result, and bet monitor.",
      stat: currentRound ? `#${currentRound.round_number}` : "—",
    },
    {
      title: "Financial Integrity",
      href: "/admin/financial-integrity",
      label: "Safety",
      detail: "Wallet safety, duplicate bet, unsettled bet, payout flow checks.",
      stat: "Safe",
    },
    {
      title: "Backend Health",
      href: "/admin/backend-health",
      label: "Cron",
      detail: "Round runner status, backend age, failed runs, and warnings.",
      stat: "Live",
    },
    {
      title: "Audit Log",
      href: "/admin/audit-log",
      label: "Latest",
      detail: "Recent operator actions and admin records.",
      stat: `${auditLogs?.length ?? 0}`,
    },
  ];

  const recentActivity = [
    {
      id: currentRound ? `SIX-${currentRound.round_number}` : "SIX-ROOM",
      title: currentRound
        ? `Six Animal live round is ${currentRound.phase}`
        : "Six Animal live round not found",
      detail: currentRound
        ? `${currentBetCount} bet${
            currentBetCount === 1 ? "" : "s"
          } • ${formatAmount(currentBetTotal)}`
        : "Check Supabase room runner and round table.",
      status: currentRound?.status ?? "Needs check",
    },
    {
      id: "SETTLEMENT",
      title: "Current round settlement watch",
      detail: `${currentSettledCount} settled • ${currentUnsettledCount} unsettled`,
      status:
        currentUnsettledCount > 0 && currentRound?.phase === "result"
          ? "Watch"
          : "Normal",
    },
    {
      id: "BACKEND",
      title: "Backend room authority",
      detail:
        "Admin dashboard reads backend state only. It does not advance rounds, change results, or settle bets.",
      status: "Read-only",
    },
    ...(auditLogs ?? []).map((log) => ({
      id: `AUDIT-${log.id.slice(0, 8).toUpperCase()}`,
      title: log.action,
      detail: log.target_id ? `Target: ${log.target_id}` : "No target recorded",
      status: "Audit",
    })),
  ];

  return (
    <AdminShell
      title="Control Center"
      description="Compact operator overview for users, balance requests, agents, referrals, live room health, and audit activity."
      action={
        <Link
          href="/admin/six-animal"
          className="rounded-full border border-sky-300/20 bg-sky-400/10 px-4 py-2 text-xs font-black text-sky-100/85 transition hover:bg-sky-300 hover:text-black"
        >
          Six Animal Monitor
        </Link>
      }
    >
      {errors.length > 0 ? (
        <section className="rounded-2xl border border-red-400/25 bg-red-950/25 p-4">
          <p className="text-sm font-black text-red-100">Admin warning</p>

          <div className="mt-2 space-y-1">
            {errors.map((error) => (
              <p key={error} className="text-xs font-semibold text-red-100/70">
                {error}
              </p>
            ))}
          </div>
        </section>
      ) : null}

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {quickStats.map((stat) => (
          <div
            key={stat.label}
            className={`rounded-2xl border p-4 ${stat.tone}`}
          >
            <p className="text-[11px] font-black uppercase tracking-[0.2em] opacity-55">
              {stat.label}
            </p>
            <p
              className={`mt-2 truncate text-2xl font-black ${
                stat.valueClassName ?? ""
              }`}
            >
              {stat.value}
            </p>
          </div>
        ))}
      </section>

      <section className="mt-4 rounded-2xl border border-sky-300/15 bg-sky-950/10 p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.28em] text-sky-200/50">
              Main Live Room
            </p>
            <h2 className="mt-1 text-xl font-black text-amber-100">
              Backend Snapshot
            </h2>
            <p className="mt-1 text-sm font-semibold leading-6 text-white/45">
              Read-only room state. No timing, result, wallet, payout, or
              settlement mutation happens here.
            </p>
          </div>

          <Link
            href="/admin/six-animal"
            className="w-fit rounded-full border border-sky-300/20 bg-sky-300/10 px-4 py-2 text-xs font-black text-sky-100 transition hover:bg-sky-300 hover:text-black"
          >
            Open Monitor
          </Link>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-4">
          <div className="rounded-xl border border-white/10 bg-black/30 p-3">
            <p className="text-xs text-white/35">Room Status</p>
            <p className="mt-1 text-sm font-black text-white/75">
              {currentRound?.status ?? "—"}
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-black/30 p-3">
            <p className="text-xs text-white/35">Phase Target</p>
            <p className="mt-1 text-sm font-black text-white/75">
              {formatTime(phaseTarget)}
            </p>
          </div>

          <div className="rounded-xl border border-emerald-400/15 bg-emerald-400/10 p-3">
            <p className="text-xs text-emerald-200/55">Settled Bets</p>
            <p className="mt-1 text-xl font-black text-emerald-100">
              {currentSettledCount}
            </p>
          </div>

          <div className="rounded-xl border border-red-400/15 bg-red-400/10 p-3">
            <p className="text-xs text-red-200/55">Unsettled Bets</p>
            <p className="mt-1 text-xl font-black text-red-100">
              {currentUnsettledCount}
            </p>
          </div>
        </div>
      </section>

      <section className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {controlSections.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="group rounded-2xl border border-amber-300/12 bg-black/35 p-4 transition hover:border-amber-300/40 hover:bg-amber-300/8"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-lg font-black text-amber-100">
                  {section.title}
                </p>
                <p className="mt-2 line-clamp-2 text-xs font-semibold leading-5 text-white/45">
                  {section.detail}
                </p>
              </div>

              <div className="shrink-0 text-right">
                <p className="text-xl font-black text-amber-100">
                  {section.stat}
                </p>
                <p className="mt-1 text-[10px] font-black uppercase tracking-[0.18em] text-white/30">
                  {section.label}
                </p>
              </div>
            </div>

            <p className="mt-4 rounded-full border border-amber-300/12 bg-amber-300/8 px-3 py-2 text-center text-xs font-black text-amber-100/70 transition group-hover:bg-amber-300 group-hover:text-black">
              Open
            </p>
          </Link>
        ))}
      </section>

      <section className="mt-4 rounded-2xl border border-red-300/12 bg-red-950/10 p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.28em] text-red-200/55">
              Operation Log
            </p>
            <h2 className="mt-1 text-xl font-black text-amber-100">
              Recent Activity
            </h2>
          </div>

          <Link
            href="/admin/audit-log"
            className="shrink-0 rounded-full border border-amber-300/15 bg-amber-300/10 px-4 py-2 text-xs font-black text-amber-100/75"
          >
            Audit
          </Link>
        </div>

        <div className="mt-4 overflow-hidden rounded-xl border border-white/10">
          {recentActivity.map((item) => (
            <div
              key={item.id}
              className="grid gap-2 border-b border-white/10 bg-black/25 p-3 last:border-b-0 md:grid-cols-[150px_1fr_120px] md:items-center"
            >
              <p className="text-xs font-black text-white/35">{item.id}</p>

              <div className="min-w-0">
                <p className="truncate text-sm font-black text-amber-100">
                  {item.title}
                </p>
                <p className="mt-1 break-words text-xs font-semibold text-white/42">
                  {item.detail}
                </p>
              </div>

              <p className="text-left text-xs font-black text-emerald-100 md:text-right">
                {item.status}
              </p>
            </div>
          ))}
        </div>
      </section>
    </AdminShell>
  );
}