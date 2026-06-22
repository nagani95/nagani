//src/app/agent/earnings/page.tsx

import Link from "next/link";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type AgentDashboardRow = {
  display_name: string | null;
  available_balance: number | string | null;
  total_earned_amount: number | string | null;
  active_bonus_earned_amount: number | string | null;
  override_earned_amount: number | string | null;
  commission_amount: number | string | null;
};

type EarningRow = {
  id: string;
  earning_type:
    | "monthly_commission"
    | "sub_agent_override"
    | "active_player_bonus"
    | "manual_adjustment";
  amount: number | string;
  status: "pending" | "available" | "locked" | "paid" | "cancelled";
  settlement_month: string | null;
  description: string | null;
  created_at: string;
};

function formatMMK(value: number | string | null | undefined) {
  const amount = Number(value ?? 0);

  return new Intl.NumberFormat("en-US").format(
    Number.isFinite(amount) ? amount : 0,
  );
}

function formatDate(value: string | null | undefined) {
  if (!value) return "-";

  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Yangon",
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function formatMonth(value: string | null | undefined) {
  if (!value) return "-";

  const date = new Date(`${value}T00:00:00`);

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(date);
}

function getEarningLabel(type: EarningRow["earning_type"]) {
  if (type === "monthly_commission") return "Monthly Commission";
  if (type === "sub_agent_override") return "Sub-agent Override";
  if (type === "active_player_bonus") return "Active Player Bonus";
  if (type === "manual_adjustment") return "Manual Adjustment";

  return type;
}

function getStatusClass(status: EarningRow["status"]) {
  if (status === "available") {
    return "border-emerald-300/25 bg-emerald-400/10 text-emerald-100";
  }

  if (status === "pending") {
    return "border-amber-300/25 bg-amber-400/10 text-amber-100";
  }

  if (status === "paid") {
    return "border-sky-300/25 bg-sky-400/10 text-sky-100";
  }

  if (status === "cancelled") {
    return "border-red-300/25 bg-red-400/10 text-red-100";
  }

  return "border-white/10 bg-white/[0.03] text-white/45";
}

function SummaryCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="rounded-[1.4rem] border border-amber-300/15 bg-black/25 p-4">
      <p className="text-[11px] font-black uppercase tracking-[0.18em] text-amber-100/45">
        {label}
      </p>
      <p className="mt-2 text-xl font-black text-amber-50">{value}</p>
      {sub ? <p className="mt-1 text-xs font-bold text-amber-100/45">{sub}</p> : null}
    </div>
  );
}

export default async function AgentEarningsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/agent/login");
  }

  const { data: dashboardData, error: dashboardError } = await supabase
    .rpc("get_my_agent_dashboard_v2")
    .maybeSingle();

  const agent = dashboardData as AgentDashboardRow | null;

  if (dashboardError || !agent) {
    redirect("/agent");
  }

  const { data: earningsData, error: earningsError } = await supabase
    .from("agent_earnings")
    .select(
      "id, earning_type, amount, status, settlement_month, description, created_at",
    )
    .order("created_at", { ascending: false })
    .returns<EarningRow[]>();

  const earnings = earningsData ?? [];

  const availableEarnings = earnings.filter(
    (earning) => earning.status === "available",
  );

  const paidEarnings = earnings.filter((earning) => earning.status === "paid");

  const availableAmount = availableEarnings.reduce(
    (sum, earning) => sum + Number(earning.amount || 0),
    0,
  );

  const paidAmount = paidEarnings.reduce(
    (sum, earning) => sum + Number(earning.amount || 0),
    0,
  );

  return (
    <main className="min-h-dvh bg-[radial-gradient(circle_at_top,rgba(245,190,90,0.2),transparent_35%),linear-gradient(180deg,#260502,#070101)] px-5 py-6 text-amber-50">
      <div className="mx-auto w-full max-w-[430px] space-y-5">
        <header className="rounded-[2rem] border border-amber-300/25 bg-[linear-gradient(145deg,rgba(76,13,6,0.97),rgba(18,2,2,0.99),rgba(62,10,5,0.96))] p-5 shadow-2xl shadow-black/60">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-200/60">
                Agent Earnings
              </p>
              <h1 className="mt-2 text-2xl font-black text-amber-50">
                Earning Ledger
              </h1>
              <p className="mt-1 text-sm leading-6 text-amber-100/65">
                {agent.display_name ?? "Agent"} commission နှင့် bonus မှတ်တမ်း။
              </p>
            </div>

            <Link
              href="/agent"
              className="rounded-full border border-amber-300/20 bg-black/25 px-3 py-2 text-xs font-black text-amber-100"
            >
              Back
            </Link>
          </div>
        </header>

        {earningsError ? (
          <section className="rounded-2xl border border-red-300/25 bg-red-950/25 p-4">
            <p className="text-sm font-black text-red-100">
              Failed to load earnings
            </p>
            <p className="mt-1 text-xs text-red-100/70">
              {earningsError.message}
            </p>
          </section>
        ) : null}

        <section className="grid grid-cols-2 gap-3">
          <SummaryCard
            label="Available"
            value={`${formatMMK(agent.available_balance)} MMK`}
            sub="Withdrawable"
          />

          <SummaryCard
            label="Total Earned"
            value={`${formatMMK(agent.total_earned_amount)} MMK`}
            sub="Available + paid"
          />

          <SummaryCard
            label="Active Bonus"
            value={`${formatMMK(agent.active_bonus_earned_amount)} MMK`}
            sub="One-time player bonus"
          />

          <SummaryCard
            label="Override"
            value={`${formatMMK(agent.override_earned_amount)} MMK`}
            sub="Primary agent only"
          />

          <SummaryCard
            label="Ledger Available"
            value={`${formatMMK(availableAmount)} MMK`}
          />

          <SummaryCard
            label="Ledger Paid"
            value={`${formatMMK(paidAmount)} MMK`}
          />
        </section>

        <section className="space-y-3">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-amber-200/45">
              History
            </p>
            <h2 className="mt-1 text-xl font-black text-amber-50">
              {earnings.length} Earnings
            </h2>
          </div>

          {earnings.length === 0 ? (
            <div className="rounded-[1.5rem] border border-amber-300/15 bg-black/25 p-5 text-center">
              <p className="text-lg font-black text-amber-50">
                No earnings yet
              </p>
              <p className="mt-1 text-sm leading-6 text-amber-100/55">
                Active player bonus or monthly commission will appear here.
              </p>
            </div>
          ) : null}

          {earnings.map((earning) => (
            <article
              key={earning.id}
              className="rounded-[1.5rem] border border-amber-300/15 bg-black/25 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-lg font-black text-amber-50">
                    {getEarningLabel(earning.earning_type)}
                  </p>
                  <p className="mt-1 text-xs font-bold text-amber-100/40">
                    {formatDate(earning.created_at)}
                  </p>
                </div>

                <span
                  className={[
                    "rounded-full border px-3 py-1 text-[11px] font-black uppercase tracking-[0.14em]",
                    getStatusClass(earning.status),
                  ].join(" ")}
                >
                  {earning.status}
                </span>
              </div>

              <p className="mt-3 text-2xl font-black text-amber-50">
                {formatMMK(earning.amount)} MMK
              </p>

              <div className="mt-3 rounded-2xl border border-amber-300/10 bg-black/25 p-3">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-100/40">
                  Settlement Month
                </p>
                <p className="mt-1 text-sm font-bold text-amber-100/65">
                  {formatMonth(earning.settlement_month)}
                </p>

                {earning.description ? (
                  <p className="mt-2 text-sm leading-6 text-amber-100/50">
                    {earning.description}
                  </p>
                ) : null}
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}