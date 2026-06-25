// src/app/agent/page.tsx

// src/app/agent/page.tsx

import Link from "next/link";
import { redirect } from "next/navigation";

import { AgentChangePasswordButton } from "@/components/agent/AgentChangePasswordButton";
import { CopyInviteButton } from "@/components/agent/CopyInviteButton";
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

type AgentLiveEstimateRow = {
  estimate_month: string | null;
  estimated_cash_bet: number | string | null;
  estimated_cash_payout: number | string | null;
  estimated_group_net_loss: number | string | null;
  estimated_eligible_net_loss: number | string | null;
  estimated_commission_amount: number | string | null;
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
  const monthNames = [
    "ဇန်နဝါရီ",
    "ဖေဖော်ဝါရီ",
    "မတ်",
    "ဧပြီ",
    "မေ",
    "ဇွန်",
    "ဇူလိုင်",
    "ဩဂုတ်",
    "စက်တင်ဘာ",
    "အောက်တိုဘာ",
    "နိုဝင်ဘာ",
    "ဒီဇင်ဘာ",
  ];

  if (Number.isNaN(date.getTime())) return "ယခုလ";

  return `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
}

function getStatusLabel(status: string | null | undefined) {
  if (status === "active") return "ဖွင့်ထား";
  if (status === "paused") return "ရပ်ထား";
  if (status === "paid") return "ပေးပြီး";
  if (status === "approved") return "အတည်ပြုပြီး";
  if (status === "pending") return "စောင့်နေ";
  if (status === "review") return "စစ်ဆေးနေ";
  if (status === "not_calculated") return "မတွက်ရသေး";

  return "မသိ";
}

function getAgentRoleLabel(level: number | null | undefined) {
  if (level === 1) return "ပင်မအေးဂျင့်";
  if (level === 2) return "အောက်ခံအေးဂျင့်";
  return "အေးဂျင့်";
}

function MiniStat({
  label,
  value,
  sub,
}: {
  label: string;
  value: React.ReactNode;
  sub: string;
}) {
  return (
    <div className="rounded-[1.15rem] border border-amber-300/14 bg-[#140302] p-3 shadow-inner shadow-black/40">
      <p className="text-[11px] font-bold leading-4 text-amber-100/50">
        {label}
      </p>
      <p className="mt-1 text-2xl font-black leading-none text-amber-50">
        {value}
      </p>
      <p className="mt-2 text-[11px] font-bold leading-4 text-amber-100/40">
        {sub}
      </p>
    </div>
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

  const { data: liveEstimateData } = await supabase
    .rpc("get_my_agent_live_estimate_v1")
    .maybeSingle();

  const agent = data as AgentDashboardRow | null;
  const liveEstimate = liveEstimateData as AgentLiveEstimateRow | null;

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
              Login အကောင့်ရှိသော်လည်း Agent profile နှင့် မချိတ်ဆက်ရသေးပါ။
            </p>

        <AgentChangePasswordButton />

        <form action={logoutAgent}>
          <button
            type="submit"
            className="w-full rounded-2xl border border-amber-300/25 bg-black/35 px-5 py-3 text-sm font-bold text-amber-100"
          >
            ထွက်ရန်
          </button>
        </form>
          </section>
        </div>
      </main>
    );
  }

  const isAgentActive = agent.agent_status === "active";
  const isPrimaryAgent = agent.agent_level === 1;
  const inviteCode = agent.agent_code ?? "-";
  const inviteUrl = `https://naganishweohh.com/register?ref=${agent.agent_code ?? ""}`;
  const totalEarnedAmount = Number(agent.total_earned_amount ?? 0);
const bonusEarnedAmount = Number(agent.active_bonus_earned_amount ?? 0);
const overrideEarnedAmount = Number(agent.override_earned_amount ?? 0);
const commissionEarnedAmount = Math.max(
  totalEarnedAmount - bonusEarnedAmount - overrideEarnedAmount,
  0,
);

const estimatedCommissionAmount = Number(
  liveEstimate?.estimated_commission_amount ?? 0,
);

const estimatedGroupNetLoss = Number(
  liveEstimate?.estimated_group_net_loss ?? 0,
);

const estimatedCashBet = Number(liveEstimate?.estimated_cash_bet ?? 0);
const estimatedCashPayout = Number(liveEstimate?.estimated_cash_payout ?? 0);

  return (
    <main className="min-h-dvh bg-[radial-gradient(circle_at_top,rgba(245,190,90,0.18),transparent_34%),linear-gradient(180deg,#260502,#070101)] px-4 py-4 text-amber-50">
      <div className="mx-auto w-full max-w-[430px] space-y-3">
        <section className="rounded-[1.7rem] border border-amber-300/24 bg-[linear-gradient(145deg,rgba(78,13,6,0.98),rgba(17,2,2,0.99),rgba(55,8,4,0.97))] p-4 shadow-2xl shadow-black/65">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-black tracking-[0.22em] text-amber-200/55">
                အေးဂျင့်စင်တာ
              </p>
              <h1 className="mt-1 text-2xl font-black text-amber-50">
                {agent.display_name ?? "Agent"}
              </h1>
              <p className="mt-1 text-sm font-bold text-amber-100/58">
                {getAgentRoleLabel(agent.agent_level)}
              </p>
            </div>

            <span
              className={[
                "rounded-full border px-3 py-1 text-xs font-black",
                isAgentActive
                  ? "border-emerald-300/35 bg-emerald-950/35 text-emerald-100"
                  : "border-red-300/35 bg-red-950/35 text-red-100",
              ].join(" ")}
            >
              {getStatusLabel(agent.agent_status)}
            </span>
          </div>

          <div className="mt-4 rounded-[1.35rem] border border-amber-300/14 bg-black/25 p-4">
            <p className="text-sm font-bold text-amber-100/55">
              ထုတ်ယူနိုင်သောငွေ
            </p>

            <p className="mt-2 text-4xl font-black leading-none text-amber-50">
              {formatMMK(agent.available_balance)} MMK
            </p>

            <div className="mt-4 grid grid-cols-[1.25fr_0.75fr] gap-2">
              <Link
                href="/agent/withdraw"
                className="rounded-2xl border border-amber-200/40 bg-[linear-gradient(180deg,#f7d27a,#b87819)] px-4 py-3 text-center text-sm font-black text-[#2a0701] shadow-lg shadow-black/30"
              >
                ငွေထုတ်ရန်
              </Link>

              <div className="rounded-2xl border border-amber-300/16 bg-black/30 px-3 py-2 text-center">
                <p className="text-[11px] font-bold text-amber-100/45">
                  စောင့်နေ
                </p>
                <p className="mt-1 text-base font-black text-amber-50">
                  {formatMMK(agent.pending_withdraw_amount)}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] font-black">
            <span className="rounded-full border border-amber-300/18 bg-black/25 px-3 py-2 text-center text-amber-100/65">
              {formatMonth(agent.settlement_month)}
            </span>
            <span className="rounded-full border border-amber-300/18 bg-black/25 px-3 py-2 text-center text-amber-100/65">
              {getStatusLabel(agent.settlement_status)}
            </span>
          </div>
        </section>

                <section className="rounded-[1.7rem] border border-amber-300/22 bg-[linear-gradient(145deg,rgba(72,11,5,0.97),rgba(13,1,1,0.99))] p-4 shadow-2xl shadow-black/55">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-black tracking-[0.22em] text-amber-100/42">
                LIVE ESTIMATE
              </p>
              <h2 className="mt-1 text-lg font-black text-amber-50">
                ယခုလ ခန့်မှန်းကော်မရှင်
              </h2>
            </div>

            <span className="rounded-full border border-amber-300/18 bg-black/25 px-3 py-1 text-[11px] font-black text-amber-100/60">
              မထုတ်ယူနိုင်သေး
            </span>
          </div>

          <div className="mt-3 rounded-[1.35rem] border border-amber-300/14 bg-black/25 p-4">
            <p className="text-sm font-bold text-amber-100/55">
              ခန့်မှန်းရရှိငွေ
            </p>

            <p className="mt-2 text-3xl font-black leading-none text-amber-50">
              {formatMMK(estimatedCommissionAmount)} MMK
            </p>

            <p className="mt-2 text-[11px] font-bold leading-5 text-amber-100/45">
              ဤငွေသည် လက်ရှိလအတွက် ခန့်မှန်းတွက်ချက်ထားခြင်းသာ ဖြစ်ပြီး
              လစာထုတ်ရက် မှသာ ထုတ်ယူနိုင်ပါသည်။
            </p>
          </div>

          <div className="mt-3 grid grid-cols-3 gap-2">
            <MiniStat
              label="Cash Bet"
              value={formatMMK(estimatedCashBet)}
              sub="Bonus မပါ"
            />

            <MiniStat
              label="Payout"
              value={formatMMK(estimatedCashPayout)}
              sub="Cash အခြေခံ"
            />

            <MiniStat
              label="Net"
              value={formatMMK(estimatedGroupNetLoss)}
              sub="ခန့်မှန်း"
            />
          </div>
        </section>

        <section className="rounded-[1.7rem] border border-amber-300/22 bg-[linear-gradient(145deg,rgba(44,7,3,0.97),rgba(9,1,1,0.99))] p-4 shadow-2xl shadow-black/55">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-black tracking-[0.22em] text-amber-100/42">
                ဖိတ်ခေါ်ရန်
              </p>
              <h2 className="mt-1 text-lg font-black text-amber-50">
                Player link
              </h2>
            </div>

            <p className="rounded-full border border-amber-300/15 bg-black/25 px-3 py-1 text-xs font-black text-amber-100/60">
              {inviteCode}
            </p>
          </div>

          <div className="mt-3">
            <CopyInviteButton
              inviteUrl={inviteUrl}
              disabled={!agent.agent_code || !isAgentActive}
            />
          </div>
        </section>

<section className="rounded-[1.7rem] border border-amber-300/22 bg-[linear-gradient(145deg,rgba(44,7,3,0.97),rgba(9,1,1,0.99))] p-4 shadow-2xl shadow-black/55">
  <h2 className="text-lg font-black text-amber-50">
    စာရင်းချုပ်
  </h2>

  <div className="mt-3 grid grid-cols-2 gap-2">
    <MiniStat
      label="ဖိတ်ထားသူ"
      value={agent.registered_player_count ?? 0}
      sub="သင့် link မှ ဝင်လာသူ"
    />

    <MiniStat
      label="Active ဖြစ်သူ"
      value={agent.active_player_count ?? 0}
      sub="Bonus/commission ဝင်မည်"
    />

    <MiniStat
      label="Commission"
      value={formatPercent(agent.commission_rate)}
      sub="လစဉ်တွက်မည့် rate"
    />

    <MiniStat
      label="Active Bonus"
      value={formatMMK(agent.active_player_bonus_amount)}
      sub="တစ်ယောက်လျှင်"
    />
  </div>

  <div className="mt-3 rounded-[1.25rem] border border-amber-300/14 bg-black/25 p-3">
    <p className="text-[11px] font-black text-amber-100/45">
      စုစုပေါင်း ရရှိထားသောငွေ
    </p>

    <div className="mt-3 grid grid-cols-2 gap-2">
      <div className="rounded-2xl border border-amber-300/12 bg-[#140302] p-3">
        <p className="text-[11px] font-bold text-amber-100/48">
          Commission ရရှိငွေ
        </p>
        <p className="mt-1 text-xl font-black text-amber-50">
          {formatMMK(commissionEarnedAmount)}
        </p>
        <p className="mt-1 text-[11px] font-bold text-amber-100/38">
          Lifetime
        </p>
      </div>

      <div className="rounded-2xl border border-amber-300/12 bg-[#140302] p-3">
        <p className="text-[11px] font-bold text-amber-100/48">
          Bonus ရရှိငွေ
        </p>
        <p className="mt-1 text-xl font-black text-amber-50">
          {formatMMK(bonusEarnedAmount)}
        </p>
        <p className="mt-1 text-[11px] font-bold text-amber-100/38">
          Lifetime
        </p>
      </div>
    </div>
  </div>
</section>

        {isPrimaryAgent ? (
          <section className="rounded-[1.7rem] border border-amber-300/22 bg-[linear-gradient(145deg,rgba(44,7,3,0.97),rgba(9,1,1,0.99))] p-4 shadow-2xl shadow-black/55">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-black text-amber-50">
                အောက်ခံအေးဂျင့်
              </h2>

              <Link
                href="/agent/sub-agents"
                className="rounded-2xl border border-amber-200/35 bg-black/30 px-4 py-2 text-xs font-black text-amber-100"
              >
                စီမံရန်
              </Link>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <MiniStat
                label="အေးဂျင့်"
                value={agent.sub_agent_count ?? 0}
                sub="သင်ဖန်တီးထားသူ"
              />

              <MiniStat
                label="Player"
                value={agent.sub_registered_player_count ?? 0}
                sub="အောက်ခံမှ ဝင်လာသူ"
              />
            </div>
          </section>
        ) : null}

        {!isAgentActive ? (
          <section className="rounded-[1.5rem] border border-red-300/25 bg-red-950/25 p-4 text-sm leading-6 text-red-100">
            ဤ Agent account သည် active မဟုတ်ပါ။ Invite link နှင့် ငွေထုတ်ခြင်း
            အသုံးပြု၍မရပါ။
          </section>
        ) : null}

        <form action={logoutAgent}>
          <button
            type="submit"
            className="w-full rounded-2xl border border-amber-300/25 bg-black/35 px-5 py-3 text-sm font-bold text-amber-100"
          >
            ထွက်ရန်
          </button>
        </form>
      </div>
    </main>
  );
}