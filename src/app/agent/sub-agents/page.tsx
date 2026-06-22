//src/app/agent/sub-agents/page.tsx

import Link from "next/link";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { createSubAgentAction } from "./actions";

export const dynamic = "force-dynamic";

type AgentDashboardRow = {
  agent_id: string;
  agent_code: string | null;
  display_name: string | null;
  agent_status: string | null;
  agent_level: number | null;
  max_commission_rate: number | string | null;
  max_active_player_bonus_amount: number | string | null;
  can_create_sub_agents: boolean | null;
};

type SubAgentRow = {
  agent_id: string;
  agent_code: string | null;
  display_name: string | null;
  agent_status: string | null;
  commission_rate: number | string | null;
  active_player_bonus_amount: number | string | null;
  agent_login_phone: string | null;
  registered_player_count: number | null;
  active_player_count: number | null;
  total_earned_amount: number | string | null;
  created_at: string | null;
};

type SubAgentsPageProps = {
  searchParams?: Promise<{
    success?: string;
    error?: string;
  }>;
};

function formatMMK(value: number | string | null | undefined) {
  const amount = Number(value ?? 0);

  return new Intl.NumberFormat("en-US").format(
    Number.isFinite(amount) ? amount : 0,
  );
}

function formatPercent(value: number | string | null | undefined) {
  const amount = Number(value ?? 0);
  return (amount * 100).toFixed(2).replace(/\.00$/, "");
}

function formatDate(value: string | null | undefined) {
  if (!value) return "-";

  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Yangon",
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(new Date(value));
}

function getStatusClass(status: string | null | undefined) {
  if (status === "active") {
    return "border-emerald-300/25 bg-emerald-950/35 text-emerald-100";
  }

  if (status === "paused") {
    return "border-amber-300/25 bg-amber-950/35 text-amber-100";
  }

  return "border-red-300/25 bg-red-950/35 text-red-100";
}

export default async function AgentSubAgentsPage({
  searchParams,
}: SubAgentsPageProps) {
  const params = searchParams ? await searchParams : {};
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/agent/login");
  }

  const { data: dashboardData } = await supabase
    .rpc("get_my_agent_dashboard_v2")
    .maybeSingle();

  const agent = dashboardData as AgentDashboardRow | null;

  if (!agent) {
    redirect("/agent");
  }

  if (agent.agent_level !== 1 || !agent.can_create_sub_agents) {
    redirect("/agent");
  }

  const { data: subAgentData, error } = await supabase.rpc("get_my_sub_agents");

  const subAgents = (subAgentData ?? []) as SubAgentRow[];

  const maxCommissionPercent = formatPercent(agent.max_commission_rate);
  const maxActiveBonus = Number(agent.max_active_player_bonus_amount ?? 1000);

  return (
    <main className="min-h-dvh bg-[radial-gradient(circle_at_top,rgba(245,190,90,0.2),transparent_35%),linear-gradient(180deg,#260502,#070101)] px-5 py-6 text-amber-50">
      <div className="mx-auto w-full max-w-[430px] space-y-5">
        <header className="rounded-[2rem] border border-amber-300/25 bg-[linear-gradient(145deg,rgba(76,13,6,0.97),rgba(18,2,2,0.99),rgba(62,10,5,0.96))] p-5 shadow-2xl shadow-black/60">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-200/60">
                Sub Agents
              </p>
              <h1 className="mt-2 text-2xl font-black text-amber-50">
                Agent B Control
              </h1>
              <p className="mt-1 text-sm leading-6 text-amber-100/65">
                {agent.display_name ?? "Primary Agent"} can create sub agents.
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

        {params.success ? (
          <section className="rounded-2xl border border-emerald-300/25 bg-emerald-950/25 p-4">
            <p className="text-sm font-black text-emerald-100">
              {params.success}
            </p>
          </section>
        ) : null}

        {params.error ? (
          <section className="rounded-2xl border border-red-300/25 bg-red-950/25 p-4">
            <p className="text-sm font-black text-red-100">{params.error}</p>
          </section>
        ) : null}

        {error ? (
          <section className="rounded-2xl border border-red-300/25 bg-red-950/25 p-4">
            <p className="text-sm font-black text-red-100">
              Failed to load sub agents
            </p>
            <p className="mt-1 text-xs text-red-100/70">{error.message}</p>
          </section>
        ) : null}

        <section className="rounded-[2rem] border border-amber-300/20 bg-[linear-gradient(145deg,rgba(44,8,4,0.96),rgba(10,1,1,0.98))] p-5 shadow-2xl shadow-black/60">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-amber-200/45">
            Create Agent B
          </p>

          <h2 className="mt-2 text-xl font-black text-amber-50">
            New Sub Agent
          </h2>

          <p className="mt-2 text-sm leading-6 text-amber-100/55">
            Commission must be 0–{maxCommissionPercent}%. Active player bonus
            must be 0–{formatMMK(maxActiveBonus)} MMK.
          </p>

          <form action={createSubAgentAction} className="mt-5 space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm font-bold text-amber-100">
                Agent Code
              </span>
              <input
                name="agent_code"
                required
                placeholder="agentb001"
                className="w-full rounded-2xl border border-amber-300/20 bg-black/35 px-4 py-3 text-base font-bold text-amber-50 outline-none placeholder:text-amber-100/35 focus:border-amber-300/55"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-bold text-amber-100">
                Display Name
              </span>
              <input
                name="display_name"
                required
                placeholder="Agent B"
                className="w-full rounded-2xl border border-amber-300/20 bg-black/35 px-4 py-3 text-base font-bold text-amber-50 outline-none placeholder:text-amber-100/35 focus:border-amber-300/55"
              />
            </label>

            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="mb-2 block text-sm font-bold text-amber-100">
                  Commission %
                </span>
                <input
                  name="commission_rate_percent"
                  required
                  type="number"
                  min="0"
                  max={maxCommissionPercent}
                  step="0.01"
                  defaultValue={maxCommissionPercent}
                  className="w-full rounded-2xl border border-amber-300/20 bg-black/35 px-4 py-3 text-base font-bold text-amber-50 outline-none focus:border-amber-300/55"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-bold text-amber-100">
                  Active Bonus
                </span>
                <input
                  name="active_player_bonus_amount"
                  required
                  type="number"
                  min="0"
                  max={maxActiveBonus}
                  step="100"
                  defaultValue={maxActiveBonus}
                  className="w-full rounded-2xl border border-amber-300/20 bg-black/35 px-4 py-3 text-base font-bold text-amber-50 outline-none focus:border-amber-300/55"
                />
              </label>
            </div>

            <label className="block">
              <span className="mb-2 block text-sm font-bold text-amber-100">
                Login Phone
              </span>
              <input
                name="phone_number"
                required
                type="tel"
                inputMode="numeric"
                placeholder="09112233445"
                className="w-full rounded-2xl border border-amber-300/20 bg-black/35 px-4 py-3 text-base font-bold text-amber-50 outline-none placeholder:text-amber-100/35 focus:border-amber-300/55"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-bold text-amber-100">
                Password
              </span>
              <input
                name="password"
                required
                type="password"
                minLength={6}
                placeholder="Minimum 6 characters"
                className="w-full rounded-2xl border border-amber-300/20 bg-black/35 px-4 py-3 text-base font-bold text-amber-50 outline-none placeholder:text-amber-100/35 focus:border-amber-300/55"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-bold text-amber-100">
                Notes
              </span>
              <input
                name="notes"
                placeholder="Optional"
                className="w-full rounded-2xl border border-amber-300/20 bg-black/35 px-4 py-3 text-base font-bold text-amber-50 outline-none placeholder:text-amber-100/35 focus:border-amber-300/55"
              />
            </label>

            <button
              type="submit"
              className="w-full rounded-2xl border border-amber-200/45 bg-[linear-gradient(180deg,#f7d27a,#b87819)] px-5 py-3 text-base font-black text-[#2a0701] shadow-lg shadow-black/40"
            >
              Create Sub Agent
            </button>
          </form>
        </section>

        <section className="space-y-3">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.28em] text-amber-200/45">
                Agent B List
              </p>
              <h2 className="mt-1 text-xl font-black text-amber-50">
                {subAgents.length} Sub Agents
              </h2>
            </div>
          </div>

          {subAgents.length === 0 ? (
            <div className="rounded-[1.5rem] border border-amber-300/15 bg-black/25 p-5 text-center">
              <p className="text-lg font-black text-amber-50">
                No sub agents yet
              </p>
              <p className="mt-1 text-sm text-amber-100/55">
                Create Agent B above.
              </p>
            </div>
          ) : null}

          {subAgents.map((subAgent) => (
            <article
              key={subAgent.agent_id}
              className="rounded-[1.5rem] border border-amber-300/15 bg-black/25 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-black text-amber-50">
                    {subAgent.display_name ?? "Sub Agent"}
                  </h3>
                  <p className="mt-1 text-sm font-bold text-amber-100/55">
                    Code: {subAgent.agent_code ?? "-"}
                  </p>
                  {subAgent.agent_login_phone ? (
                    <p className="mt-1 text-xs font-bold text-amber-100/40">
                      Phone: {subAgent.agent_login_phone}
                    </p>
                  ) : null}
                </div>

                <span
                  className={[
                    "rounded-full border px-3 py-1 text-[11px] font-black uppercase tracking-[0.14em]",
                    getStatusClass(subAgent.agent_status),
                  ].join(" ")}
                >
                  {subAgent.agent_status ?? "unknown"}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <div className="rounded-2xl border border-amber-300/10 bg-black/25 p-3">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-amber-100/40">
                    Rate
                  </p>
                  <p className="mt-1 text-lg font-black text-amber-50">
                    {formatPercent(subAgent.commission_rate)}%
                  </p>
                </div>

                <div className="rounded-2xl border border-amber-300/10 bg-black/25 p-3">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-amber-100/40">
                    Active Bonus
                  </p>
                  <p className="mt-1 text-lg font-black text-amber-50">
                    {formatMMK(subAgent.active_player_bonus_amount)}
                  </p>
                </div>

                <div className="rounded-2xl border border-amber-300/10 bg-black/25 p-3">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-amber-100/40">
                    Players
                  </p>
                  <p className="mt-1 text-lg font-black text-amber-50">
                    {subAgent.registered_player_count ?? 0}
                  </p>
                </div>

                <div className="rounded-2xl border border-amber-300/10 bg-black/25 p-3">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-amber-100/40">
                    Active
                  </p>
                  <p className="mt-1 text-lg font-black text-amber-50">
                    {subAgent.active_player_count ?? 0}
                  </p>
                </div>
              </div>

              <p className="mt-3 text-xs font-bold text-amber-100/35">
                Created: {formatDate(subAgent.created_at)}
              </p>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}