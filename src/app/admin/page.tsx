//src>app>admin>page.tsx

import Link from "next/link";

import { createClient } from "@/lib/supabase/server";
import { logout } from "@/lib/supabase/auth";

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
    data: currentBets,
    error: currentBetsError,
  } = currentRound?.id
    ? await supabase
        .from("six_animal_bets")
        .select("id, amount, settled")
        .eq("round_id", currentRound.id)
        .returns<SixAnimalBet[]>()
    : { data: [], error: null };
  
  const {
  data: auditLogs,
  error: auditLogsError,
} = await supabase
  .from("admin_audit_logs")
  .select("id, action, target_id, created_at")
  .order("created_at", { ascending: false })
  .limit(3)
  .returns<AdminAuditLog[]>();

  const currentBetCount = currentBets?.length ?? 0;
  const currentBetTotal = (currentBets ?? []).reduce(
    (sum, bet) => sum + bet.amount,
    0
  );
  const currentSettledCount = (currentBets ?? []).filter(
    (bet) => bet.settled
  ).length;
  const currentUnsettledCount = currentBetCount - currentSettledCount;
  const phaseTarget = getPhaseTarget(currentRound);

  const adminCards = [
    {
      title: "Users",
      description: "View members, wallet balance, access status, and activity.",
      href: "/admin/users",
      stat: "MVP",
      label: "Members",
    },
    {
  title: "Wallet Requests",
  description: "Review deposit and withdraw settlement tickets.",
  href: "/admin/wallet-requests",
  stat: "MVP",
  label: "Pending",
},
{
  title: "Audit Log",
  description:
    "View read-only operator action logs and future admin safety records.",
  href: "/admin/audit-log",
  stat: `${auditLogs?.length ?? 0}`,
  label: "Latest",
},
{
  title: "Backend Health",
  description:
    "Monitor cron runner status, backend round age, failed runs, and old unsettled bet warnings.",
  href: "/admin/backend-health",
  stat: "Live",
  label: "Cron",
},
{
  title: "Financial Integrity",
  description:
    "Monitor wallet safety, duplicate bets, unsettled bets, and Six Animal debit/payout flow.",
  href: "/admin/financial-integrity",
  stat: "Safe",
  label: "Wallet",
},
{
  title: "၆ ကောင်ဂျင်",
      description:
        "Monitor live Six Animal backend round, bets, settlement, and wallet activity.",
      href: "/admin/six-animal",
      stat: currentRound ? `#${currentRound.round_number}` : "—",
      label: currentRound?.phase ?? "No round",
    },
    {
      title: "၃၆ ကောင်ထီ",
      description: "Manage draw records, tickets, and published results.",
      href: "/admin/thirty-six",
      stat: "MVP",
      label: "Draws",
    },
  ];

  const recentActivity = [
    {
      id: currentRound ? `SIX-${currentRound.round_number}` : "SIX-ROOM",
      title: currentRound
        ? `၆ ကောင်ဂျင် live round is ${currentRound.phase}`
        : "၆ ကောင်ဂျင် live round not found",
      detail: currentRound
        ? `${currentBetCount} bet${currentBetCount === 1 ? "" : "s"} • ${formatAmount(
            currentBetTotal
          )}`
        : "Check Supabase room runner and round table",
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
      title: "Backend dealer authority",
      detail:
        "Admin home reads backend state only. It does not advance rounds or settle bets.",
      status: "Read-only",
    },
    ...(auditLogs ?? []).map((log) => ({
  id: "AUDIT",
  title: log.action,
  detail: log.target_id
    ? `Target: ${log.target_id}`
    : "No target recorded",
  status: "Audit",
})),
  ];

const errors = [
  currentRoundError ? `Current round: ${currentRoundError.message}` : null,
  currentBetsError ? `Current bets: ${currentBetsError.message}` : null,
  auditLogsError ? `Audit logs: ${auditLogsError.message}` : null,
].filter(Boolean);

  return (
    <main className="min-h-screen bg-[#090202] px-5 py-6 text-white">
      <section className="mx-auto w-full max-w-6xl">
        <header className="flex flex-col gap-4 rounded-[2rem] border border-red-500/25 bg-gradient-to-br from-red-950 via-[#160303] to-black p-6 shadow-2xl shadow-red-950/30 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-red-200/60">
              Nagani Operator
            </p>

            <h1 className="mt-3 text-4xl font-black text-amber-100">
              Control Center
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-amber-50/65">
              Monitor live room health, wallet activity, game records, and
              platform operation status for the Nagani MVP.
            </p>
          </div>

<div className="flex flex-col gap-3 sm:flex-row">
  <Link
    href="/"
    className="w-fit rounded-full border border-amber-400/20 bg-amber-400/10 px-5 py-3 text-center text-sm font-black text-amber-100"
  >
    Open Lobby
  </Link>

  <form action={logout}>
    <button
      type="submit"
      className="w-fit rounded-full border border-red-400/25 bg-red-500/10 px-5 py-3 text-sm font-black text-red-100 transition hover:bg-red-400 hover:text-black"
    >
      Logout
    </button>
  </form>
</div>
        </header>

        {errors.length > 0 ? (
          <section className="mt-6 rounded-[1.5rem] border border-red-400/30 bg-red-950/30 p-5">
            <p className="text-sm font-black text-red-100">
              Admin home warning
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

        <section className="mt-6 grid gap-4 md:grid-cols-4">
          <div className="rounded-[1.5rem] border border-amber-400/20 bg-amber-400/10 p-5">
            <p className="text-xs text-amber-200/60">Six Animal Round</p>
            <p className="mt-2 text-3xl font-black text-amber-100">
              {currentRound ? `#${currentRound.round_number}` : "—"}
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-emerald-400/20 bg-emerald-400/10 p-5">
            <p className="text-xs text-emerald-200/60">Live Phase</p>
            <p
              className={`mt-2 text-3xl font-black capitalize ${getPhaseTone(
                currentRound?.phase ?? null
              )}`}
            >
              {currentRound?.phase ?? "—"}
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-red-400/20 bg-red-400/10 p-5">
            <p className="text-xs text-red-200/60">Current Bets</p>
            <p className="mt-2 text-3xl font-black text-red-100">
              {currentBetCount}
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5">
            <p className="text-xs text-white/40">Current Bet Total</p>
            <p className="mt-2 text-2xl font-black text-amber-100">
              {formatAmount(currentBetTotal)}
            </p>
          </div>
        </section>

        <section className="mt-6 rounded-[1.75rem] border border-sky-400/15 bg-sky-950/10 p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-sky-200/55">
                Main Live Room
              </p>
              <h2 className="mt-2 text-2xl font-black text-amber-100">
                Backend Dealer Snapshot
              </h2>
              <p className="mt-2 text-sm leading-6 text-white/50">
                This panel reads the global backend room only. The player browser
                does not control timing, results, wallet debit, payout, or
                settlement.
              </p>
            </div>

            <Link
              href="/admin/six-animal"
              className="w-fit rounded-full border border-sky-300/25 bg-sky-300/10 px-5 py-3 text-sm font-black text-sky-100 transition hover:bg-sky-300 hover:text-black"
            >
              Open Six Animal Monitor
            </Link>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-4">
            <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
              <p className="text-xs text-white/40">Room Status</p>
              <p className="mt-2 text-sm font-black text-white/75">
                {currentRound?.status ?? "—"}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
              <p className="text-xs text-white/40">Phase Target</p>
              <p className="mt-2 text-sm font-black text-white/75">
                {formatTime(phaseTarget)}
              </p>
            </div>

            <div className="rounded-2xl border border-emerald-400/15 bg-emerald-400/10 p-4">
              <p className="text-xs text-emerald-200/55">Settled Bets</p>
              <p className="mt-2 text-2xl font-black text-emerald-100">
                {currentSettledCount}
              </p>
            </div>

            <div className="rounded-2xl border border-red-400/15 bg-red-400/10 p-4">
              <p className="text-xs text-red-200/55">Unsettled Bets</p>
              <p className="mt-2 text-2xl font-black text-red-100">
                {currentUnsettledCount}
              </p>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-2">
          {adminCards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="group rounded-[1.75rem] border border-amber-400/15 bg-black/40 p-5 transition hover:border-amber-300/50"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-amber-100">
                    {card.title}
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-white/55">
                    {card.description}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-3xl font-black text-amber-100">
                    {card.stat}
                  </p>
                  <p className="mt-1 text-xs font-bold uppercase tracking-[0.2em] text-white/35">
                    {card.label}
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-full border border-amber-400/15 bg-amber-400/10 px-4 py-3 text-center text-sm font-black text-amber-100 transition group-hover:bg-amber-300 group-hover:text-black">
                Open Section
              </div>
            </Link>
          ))}
        </section>

        <section className="mt-6 rounded-[1.75rem] border border-red-400/15 bg-red-950/10 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-red-200/60">
                Operation Log
              </p>
              <h2 className="mt-2 text-2xl font-black text-amber-100">
                Recent Activity
              </h2>
            </div>

            <Link
              href="/admin/settings"
              className="rounded-full border border-amber-400/20 bg-amber-400/10 px-4 py-2 text-xs font-black text-amber-100"
            >
              Settings
            </Link>
          </div>

          <div className="mt-5 space-y-3">
            {recentActivity.map((item) => (
              <div
                key={item.id}
                className="grid gap-3 rounded-2xl border border-white/10 bg-black/30 p-4 md:grid-cols-[160px_1fr_160px]"
              >
                <p className="text-xs font-bold text-white/35">{item.id}</p>

                <div>
                  <p className="text-sm font-black text-amber-100">
                    {item.title}
                  </p>
                  <p className="mt-1 text-xs text-white/45">{item.detail}</p>
                </div>

                <p className="text-left text-xs font-black text-emerald-100 md:text-right">
                  {item.status}
                </p>
              </div>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}