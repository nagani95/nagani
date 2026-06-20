//src/app/agent/page.tsx

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

type AgentDashboardRow = {
  agent_code: string | null;
  display_name: string | null;
  agent_status: string | null;
  commission_rate: number | string | null;
  negative_carry: number | string | null;
  settlement_month: string | null;
  settlement_status: string | null;
  invited_player_count: number | null;
  group_net_loss: number | string | null;
  eligible_net_loss: number | string | null;
  commission_amount: number | string | null;
  paid_at: string | null;
  available_commission: number | string | null;
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
  if (status === "not_calculated") return "NOT CALCULATED";
  return status?.toUpperCase() ?? "UNKNOWN";
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
    .rpc("get_my_agent_dashboard")
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
  const isPaid = Boolean(agent.paid_at);

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
                Code: {agent.agent_code ?? "-"}
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
              လစဉ်ထုတ်ယူနိုင်သော Referral Balance
            </p>

            <p className="mt-3 text-4xl font-black tracking-tight text-amber-50">
              {formatMMK(agent.available_commission)} MMK
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-[0.16em]">
              <span className="rounded-full border border-amber-300/20 bg-black/25 px-3 py-1 text-amber-100/70">
                {formatMonth(agent.settlement_month)}
              </span>
              <span className="rounded-full border border-amber-300/20 bg-black/25 px-3 py-1 text-amber-100/70">
                {getStatusLabel(agent.settlement_status)}
              </span>
              {isPaid ? (
                <span className="rounded-full border border-emerald-300/25 bg-emerald-950/30 px-3 py-1 text-emerald-100">
                  PAID
                </span>
              ) : null}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-px bg-amber-300/10">
            <div className="bg-[#160302] p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-amber-100/45">
                Players
              </p>
              <p className="mt-2 text-xl font-black text-amber-50">
                {agent.invited_player_count ?? 0}
              </p>
            </div>

            <div className="bg-[#160302] p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-amber-100/45">
                Rate
              </p>
              <p className="mt-2 text-xl font-black text-amber-50">
                {formatPercent(agent.commission_rate)}
              </p>
            </div>

            <div className="bg-[#160302] p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-amber-100/45">
                Group Net Loss
              </p>
              <p className="mt-2 text-xl font-black text-amber-50">
                {formatMMK(agent.group_net_loss)}
              </p>
            </div>

            <div className="bg-[#160302] p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-amber-100/45">
                Commission
              </p>
              <p className="mt-2 text-xl font-black text-amber-50">
                {formatMMK(agent.commission_amount)}
              </p>
            </div>

            <div className="bg-[#160302] p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-amber-100/45">
                Eligible Net
              </p>
              <p className="mt-2 text-xl font-black text-amber-50">
                {formatMMK(agent.eligible_net_loss)}
              </p>
            </div>

            <div className="bg-[#160302] p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-amber-100/45">
                Carry
              </p>
              <p className="mt-2 text-xl font-black text-amber-50">
                {formatMMK(agent.negative_carry)}
              </p>
            </div>
          </div>
        </section>

        {!isAgentActive ? (
          <section className="rounded-[1.5rem] border border-red-300/25 bg-red-950/25 p-4 text-sm leading-6 text-red-100">
            ဤအေးဂျင့်အကောင့်သည် active မဟုတ်ပါ။ Balance ကို view-only အဖြစ်သာ ကြည့်နိုင်ပါသည်။
          </section>
        ) : null}

        <section className="rounded-[1.5rem] border border-amber-300/15 bg-black/25 p-4 text-sm leading-6 text-amber-100/60">
          Settlement balance သည် invited players များ၏ လစဉ် group net loss,
          negative carry နှင့် commission rate အပေါ် မူတည်ပြီး တွက်ချက်ထားသည်။
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