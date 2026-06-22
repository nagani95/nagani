//src/app/agent/page.tsx

import Link from "next/link";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

type AgentDashboardRow = {
  agent_id: string;
  agent_code: string | null;
  display_name: string | null;
  agent_status: string | null;
  agent_level: number | null;
  parent_agent_id: string | null;
  parent_display_name: string | null;
  commission_rate: number | string | null;
  max_commission_rate: number | string | null;
  active_player_bonus_amount: number | string | null;
  max_active_player_bonus_amount: number | string | null;
  can_create_sub_agents: boolean | null;

  registered_player_count: number | null;
  direct_registered_player_count: number | null;
  sub_registered_player_count: number | null;

  active_player_count: number | null;
  direct_active_player_count: number | null;
  sub_active_player_count: number | null;

  sub_agent_count: number | null;

  available_balance: number | string | null;
  pending_withdraw_amount: number | string | null;
  total_earned_amount: number | string | null;
  active_bonus_earned_amount: number | string | null;
  override_earned_amount: number | string | null;

  settlement_month: string | null;
  settlement_status: string | null;
  group_net_loss: number | string | null;
  eligible_net_loss: number | string | null;
  commission_amount: number | string | null;
  paid_at: string | null;
};

function formatMMK(value: number | string | null | undefined) {
  const amount = Number(value ?? 0);

  return new Intl.NumberFormat("en-US").format(
    Number.isFinite(amount) ? amount : 0,
  );
}

function formatPercent(value: number | string | null | undefined) {
  const amount = Number(value ?? 0);
  return `${Math.round(amount * 100)}%`;
}

function formatMonth(value: string | null | undefined) {
  if (!value) return "ယခုလ";

  const date = new Date(`${value}T00:00:00`);

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(date);
}

function getStatusLabel(status: string | null | undefined) {
  if (status === "active") return "ACTIVE";
  if (status === "paused") return "PAUSED";
  if (status === "paid") return "PAID";
  if (status === "approved") return "APPROVED";
  if (status === "pending") return "PENDING";
  if (status === "review") return "REVIEW";
  if (status === "not_calculated") return "NOT CALCULATED";

  return status?.toUpperCase() ?? "UNKNOWN";
}

function getAgentRoleLabel(level: number | null | undefined) {
  if (level === 1) return "Primary Agent";
  if (level === 2) return "Sub Agent";
  return "Agent";
}

function StatCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: React.ReactNode;
  sub?: string;
}) {
  return (
    <div className="rounded-[1.4rem] border border-amber-300/15 bg-[#160302] p-4">
      <p className="text-[11px] font-black uppercase tracking-[0.18em] text-amber-100/45">
        {label}
      </p>
      <p className="mt-2 text-xl font-black text-amber-50">{value}</p>
      {sub ? <p className="mt-1 text-xs font-bold text-amber-100/45">{sub}</p> : null}
    </div>
  );
}

function ActionLink({
  href,
  title,
  description,
}: {
  href: string;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="block rounded-[1.4rem] border border-amber-300/15 bg-black/25 p-4 transition hover:border-amber-300/35 hover:bg-amber-300/10"
    >
      <p className="text-base font-black text-amber-50">{title}</p>
      <p className="mt-1 text-sm leading-5 text-amber-100/55">{description}</p>
    </Link>
  );
}

export default async function AgentDashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/agent/login");
  }

  const { data, error } = await supabase
    .rpc("get_my_agent_dashboard_v2")
    .maybeSingle();

  const agent = data as AgentDashboardRow | null;

  async function logoutAgent() {
    "use server";

    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/agent/login");
  }

  if (error || !agent) {
    return (
      <main className="min-h-dvh bg-[linear-gradient(180deg,#260502,#070101)] px-5 py-8 text-amber-50">
        <div className="mx-auto flex min-h-[calc(100dvh-4rem)] w-full max-w-[430px] items-center justify-center">
          <section className="rounded-[2rem] border border-amber-300/25 bg-black/35 p-6 text-center shadow-2xl shadow-black/70">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-200/60">
              Agent Portal
            </p>
            <h1 className="mt-3 text-2xl font-black">Access မရှိပါ</h1>
            <p className="mt-3 text-sm leading-6 text-amber-100/70">
              Login အကောင့်ရှိသော်လည်း agent profile နှင့် မချိတ်ဆက်ရသေးပါ။
            </p>

            <form action={logoutAgent} className="mt-5">
              <button
                type="submit"
                className="w-full rounded-2xl border border-amber-300/25 bg-black/35 px-5 py-3 text-sm font-bold text-amber-100"
              >
                Logout
              </button>
            </form>
          </section>
        </div>
      </main>
    );
  }

  const isAgentActive = agent.agent_status === "active";
  const isPrimaryAgent = agent.agent_level === 1;
  const referralPath = `/register?ref=${agent.agent_code ?? ""}`;

  return (
    <main className="min-h-dvh bg-[radial-gradient(circle_at_top,rgba(245,190,90,0.2),transparent_35%),linear-gradient(180deg,#260502,#070101)] px-5 py-6 text-amber-50">
      <div className="mx-auto w-full max-w-[430px] space-y-5">
        <header className="rounded-[2rem] border border-amber-300/25 bg-[linear-gradient(145deg,rgba(76,13,6,0.97),rgba(18,2,2,0.99),rgba(62,10,5,0.96))] p-5 shadow-2xl shadow-black/60">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-200/60">
                Agent Dashboard
              </p>
              <h1 className="mt-2 text-2xl font-black text-amber-50">
                {agent.display_name ?? "Agent"}
              </h1>
              <p className="mt-1 text-sm text-amber-100/65">
                {getAgentRoleLabel(agent.agent_level)}
                {agent.parent_display_name ? ` · ${agent.parent_display_name}` : ""}
              </p>
            </div>

            <span
              className={[
                "rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.18em]",
                isAgentActive
                  ? "border-emerald-300/35 bg-emerald-950/35 text-emerald-100"
                  : "border-red-300/35 bg-red-950/35 text-red-100",
              ].join(" ")}
            >
              {getStatusLabel(agent.agent_status)}
            </span>
          </div>
        </header>

        <section className="overflow-hidden rounded-[2rem] border border-amber-300/25 bg-[linear-gradient(145deg,rgba(44,8,4,0.96),rgba(10,1,1,0.98))] shadow-2xl shadow-black/60">
          <div className="border-b border-amber-300/15 p-5">
            <p className="text-sm font-semibold text-amber-100/70">
              ထုတ်ယူနိုင်သော Agent Balance
            </p>

            <p className="mt-3 text-4xl font-black tracking-tight text-amber-50">
              {formatMMK(agent.available_balance)} MMK
            </p>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <Link
                href="/agent/withdraw"
                className="rounded-2xl border border-amber-200/35 bg-[linear-gradient(180deg,#f7d27a,#b87819)] px-4 py-3 text-center text-sm font-black text-[#2a0701] shadow-lg shadow-black/30"
              >
                Withdraw
              </Link>

              <Link
                href="/agent/earnings"
                className="rounded-2xl border border-amber-300/20 bg-black/30 px-4 py-3 text-center text-sm font-black text-amber-100"
              >
                Earnings
              </Link>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-[0.16em]">
              <span className="rounded-full border border-amber-300/20 bg-black/25 px-3 py-1 text-amber-100/70">
                {formatMonth(agent.settlement_month)}
              </span>
              <span className="rounded-full border border-amber-300/20 bg-black/25 px-3 py-1 text-amber-100/70">
                {getStatusLabel(agent.settlement_status)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-px bg-amber-300/10">
            <StatCard
              label="Registered"
              value={agent.registered_player_count ?? 0}
              sub={`Direct ${agent.direct_registered_player_count ?? 0}`}
            />

            <StatCard
              label="Active Players"
              value={agent.active_player_count ?? 0}
              sub="Deposit ≥ 10,000"
            />

            <StatCard
              label="Rate"
              value={formatPercent(agent.commission_rate)}
              sub={`Cap ${formatPercent(agent.max_commission_rate)}`}
            />

            <StatCard
              label="Active Bonus"
              value={`${formatMMK(agent.active_player_bonus_amount)}`}
              sub="One-time"
            />

            <StatCard
              label="Pending Withdraw"
              value={formatMMK(agent.pending_withdraw_amount)}
              sub="Not paid yet"
            />

            <StatCard
              label="Total Earned"
              value={formatMMK(agent.total_earned_amount)}
              sub="Available + paid"
            />

            {isPrimaryAgent ? (
              <>
                <StatCard
                  label="Sub Agents"
                  value={agent.sub_agent_count ?? 0}
                  sub={`Players ${agent.sub_registered_player_count ?? 0}`}
                />

                <StatCard
                  label="Override"
                  value={formatMMK(agent.override_earned_amount)}
                  sub="From sub agents"
                />
              </>
            ) : null}
          </div>
        </section>

        <section className="rounded-[1.5rem] border border-amber-300/15 bg-black/25 p-4">
          <p className="text-[11px] font-black uppercase tracking-[0.22em] text-amber-100/45">
            Referral Code
          </p>

          <p className="mt-2 text-2xl font-black text-amber-50">
            {agent.agent_code ?? "-"}
          </p>

          <p className="mt-2 break-all rounded-2xl border border-amber-300/10 bg-black/30 px-4 py-3 text-xs font-bold text-amber-100/55">
            {referralPath}
          </p>
        </section>

        {!isAgentActive ? (
          <section className="rounded-[1.5rem] border border-red-300/25 bg-red-950/25 p-4 text-sm leading-6 text-red-100">
            ဤအေးဂျင့်အကောင့်သည် active မဟုတ်ပါ။ Balance ကို view-only အဖြစ်သာ ကြည့်နိုင်ပါသည်။
          </section>
        ) : null}

        <section className="grid gap-3">
          <ActionLink
            href="/agent/players"
            title="Players"
            description="Referral ဖြင့် ဝင်လာသော player များနှင့် active status ကြည့်ရန်။"
          />

          {isPrimaryAgent ? (
            <ActionLink
              href="/agent/sub-agents"
              title="Sub Agents"
              description="Agent B ဖန်တီးရန်၊ commission နှင့် active bonus သတ်မှတ်ရန်။"
            />
          ) : null}

          <ActionLink
            href="/agent/earnings"
            title="Earning Ledger"
            description="Commission, active bonus, override earning များ စစ်ရန်။"
          />
        </section>

        <section className="rounded-[1.5rem] border border-amber-300/15 bg-black/25 p-4 text-sm leading-6 text-amber-100/60">
          Settlement balance သည် invited players များ၏ လစဉ် group net loss,
          negative carry, commission rate နှင့် active player bonus အပေါ် မူတည်ပြီး တွက်ချက်ထားသည်။
        </section>

        <form action={logoutAgent}>
          <button
            type="submit"
            className="w-full rounded-2xl border border-amber-300/25 bg-black/35 px-5 py-3 text-sm font-bold text-amber-100"
          >
            Logout
          </button>
        </form>
      </div>
    </main>
  );
}