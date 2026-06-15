// src/app/admin/agents/page.tsx

import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  activateAgentAction,
  createAgentAction,
  pauseAgentAction,
  updateAgentAction,
} from "./actions";

export const dynamic = "force-dynamic";

type AgentProfile = {
  id: string;
  agent_code: string;
  display_name: string;
  commission_rate: number;
  status: "active" | "paused" | "disabled";
  negative_carry: number;
  notes: string | null;
  created_at: string;
};

type AdminAgentsPageProps = {
  searchParams?: Promise<{
    success?: string;
    error?: string;
  }>;
};

function formatPercent(rate: number) {
  return (Number(rate || 0) * 100).toFixed(2).replace(/\.00$/, "");
}

function formatMMK(amount: number) {
  return new Intl.NumberFormat("en-US").format(Number(amount || 0));
}

function getStatusClass(status: AgentProfile["status"]) {
  if (status === "active") {
    return "border-emerald-400/25 bg-emerald-400/10 text-emerald-100";
  }

  if (status === "paused") {
    return "border-amber-400/25 bg-amber-400/10 text-amber-100";
  }

  return "border-red-400/25 bg-red-400/10 text-red-100";
}

export default async function AdminAgentsPage({
  searchParams,
}: AdminAgentsPageProps) {
  const params = searchParams ? await searchParams : {};
  const supabase = await createClient();

  const { data: isAdmin, error: adminError } =
    await supabase.rpc("is_nagani_admin");

  if (adminError || !isAdmin) {
    redirect("/admin/login");
  }

  const { data, error } = await supabase
    .from("agent_profiles")
    .select(
      "id, agent_code, display_name, commission_rate, status, negative_carry, notes, created_at",
    )
    .order("created_at", { ascending: false });

  const agents = (data ?? []) as AgentProfile[];

  const totalAgents = agents.length;
  const activeAgents = agents.filter((agent) => agent.status === "active").length;
  const pausedAgents = agents.filter((agent) => agent.status === "paused").length;
  const disabledAgents = agents.filter(
    (agent) => agent.status === "disabled",
  ).length;

  return (
    <main className="min-h-screen bg-[#130804] px-4 py-6 text-amber-50">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-amber-300/60">
              Nagani Admin
            </p>
            <h1 className="mt-2 text-3xl font-black text-amber-100">
              Agent Referral
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/55">
              Create agents, set custom commission percentages, pause partners,
              and prepare monthly net settlement. Agents earn only from true
              invited-player monthly net loss.
            </p>
          </div>

          <Link
            href="/admin"
            className="rounded-2xl border border-amber-300/20 bg-black/20 px-4 py-3 text-center text-sm font-black text-amber-100 hover:bg-amber-300/10"
          >
            Back to Admin
          </Link>
        </div>

        {params.success ? (
          <div className="mb-4 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm font-bold text-emerald-100">
            {params.success}
          </div>
        ) : null}

        {params.error ? (
          <div className="mb-4 rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm font-bold text-red-100">
            {params.error}
          </div>
        ) : null}

        {error ? (
          <div className="mb-4 rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm font-bold text-red-100">
            Failed to load agents: {error.message}
          </div>
        ) : null}

        <section className="grid gap-3 sm:grid-cols-4">
          <div className="rounded-3xl border border-amber-300/15 bg-black/25 p-4">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-white/40">
              Total
            </p>
            <p className="mt-2 text-2xl font-black text-amber-100">
              {totalAgents}
            </p>
          </div>

          <div className="rounded-3xl border border-emerald-300/15 bg-black/25 p-4">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-white/40">
              Active
            </p>
            <p className="mt-2 text-2xl font-black text-emerald-100">
              {activeAgents}
            </p>
          </div>

          <div className="rounded-3xl border border-amber-300/15 bg-black/25 p-4">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-white/40">
              Paused
            </p>
            <p className="mt-2 text-2xl font-black text-amber-100">
              {pausedAgents}
            </p>
          </div>

          <div className="rounded-3xl border border-red-300/15 bg-black/25 p-4">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-white/40">
              Disabled
            </p>
            <p className="mt-2 text-2xl font-black text-red-100">
              {disabledAgents}
            </p>
          </div>
        </section>

        <section className="mt-6 rounded-[2rem] border border-amber-300/15 bg-[#1b0d07]/85 p-5 shadow-2xl shadow-black/30">
          <div className="mb-5">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-amber-300/55">
              Create Agent
            </p>
            <h2 className="mt-2 text-xl font-black text-amber-100">
              New referral partner
            </h2>
          </div>

          <form action={createAgentAction} className="grid gap-4 lg:grid-cols-5">
            <label className="lg:col-span-1">
              <span className="text-xs font-black uppercase tracking-[0.18em] text-white/45">
                Agent Code
              </span>
              <input
                name="agent_code"
                required
                placeholder="agent001"
                className="mt-2 w-full rounded-2xl border border-amber-300/15 bg-black/35 px-4 py-3 text-sm font-bold text-amber-50 outline-none placeholder:text-white/25 focus:border-amber-300/40"
              />
            </label>

            <label className="lg:col-span-1">
              <span className="text-xs font-black uppercase tracking-[0.18em] text-white/45">
                Display Name
              </span>
              <input
                name="display_name"
                required
                placeholder="Agent A"
                className="mt-2 w-full rounded-2xl border border-amber-300/15 bg-black/35 px-4 py-3 text-sm font-bold text-amber-50 outline-none placeholder:text-white/25 focus:border-amber-300/40"
              />
            </label>

            <label className="lg:col-span-1">
              <span className="text-xs font-black uppercase tracking-[0.18em] text-white/45">
                Commission %
              </span>
              <input
                name="commission_rate_percent"
                required
                type="number"
                min="0"
                max="100"
                step="0.01"
                defaultValue="35"
                className="mt-2 w-full rounded-2xl border border-amber-300/15 bg-black/35 px-4 py-3 text-sm font-bold text-amber-50 outline-none focus:border-amber-300/40"
              />
            </label>

            <label className="lg:col-span-1">
              <span className="text-xs font-black uppercase tracking-[0.18em] text-white/45">
                Notes
              </span>
              <input
                name="notes"
                placeholder="Optional"
                className="mt-2 w-full rounded-2xl border border-amber-300/15 bg-black/35 px-4 py-3 text-sm font-bold text-amber-50 outline-none placeholder:text-white/25 focus:border-amber-300/40"
              />
            </label>

            <div className="flex items-end lg:col-span-1">
              <button
                type="submit"
                className="w-full rounded-2xl border border-amber-300/30 bg-amber-300 px-4 py-3 text-sm font-black text-black shadow-lg shadow-amber-950/30 hover:bg-amber-200"
              >
                Create Agent
              </button>
            </div>
          </form>

          <div className="mt-4 rounded-2xl border border-amber-300/10 bg-black/20 px-4 py-3 text-xs leading-5 text-white/45">
            Code format: lowercase letters, numbers, underscore or dash. Example:
            <span className="font-bold text-amber-100"> agent001</span>. Rate
            format: <span className="font-bold text-amber-100">35</span> means
            35%.
          </div>
        </section>

        <section className="mt-6">
          <div className="mb-4 flex items-end justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-amber-300/55">
                Agent List
              </p>
              <h2 className="mt-2 text-xl font-black text-amber-100">
                Manage partners
              </h2>
            </div>
          </div>

          {agents.length === 0 ? (
            <div className="rounded-[2rem] border border-white/10 bg-black/25 p-8 text-center">
              <p className="text-lg font-black text-amber-100">
                No agents yet
              </p>
              <p className="mt-2 text-sm text-white/45">
                Create your first referral partner above.
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {agents.map((agent) => (
                <article
                  key={agent.id}
                  className="rounded-[2rem] border border-amber-300/15 bg-[#1b0d07]/85 p-5 shadow-xl shadow-black/20"
                >
                  <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-xl font-black text-amber-100">
                          {agent.display_name}
                        </h3>
                        <span
                          className={`rounded-full border px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] ${getStatusClass(
                            agent.status,
                          )}`}
                        >
                          {agent.status}
                        </span>
                      </div>

                      <p className="mt-2 text-sm font-bold text-white/45">
                        Code:{" "}
                        <span className="font-black text-amber-200">
                          {agent.agent_code}
                        </span>
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-right">
                      <div className="rounded-2xl border border-amber-300/10 bg-black/25 px-4 py-3">
                        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/35">
                          Rate
                        </p>
                        <p className="mt-1 text-lg font-black text-amber-100">
                          {formatPercent(agent.commission_rate)}%
                        </p>
                      </div>

                      <div className="rounded-2xl border border-red-300/10 bg-black/25 px-4 py-3">
                        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/35">
                          Carry
                        </p>
                        <p className="mt-1 text-lg font-black text-red-100">
                          {formatMMK(agent.negative_carry)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <form action={updateAgentAction} className="grid gap-3 lg:grid-cols-12">
                    <input type="hidden" name="agent_id" value={agent.id} />

                    <label className="lg:col-span-3">
                      <span className="text-xs font-black uppercase tracking-[0.18em] text-white/40">
                        Display Name
                      </span>
                      <input
                        name="display_name"
                        required
                        defaultValue={agent.display_name}
                        className="mt-2 w-full rounded-2xl border border-amber-300/15 bg-black/35 px-4 py-3 text-sm font-bold text-amber-50 outline-none focus:border-amber-300/40"
                      />
                    </label>

                    <label className="lg:col-span-2">
                      <span className="text-xs font-black uppercase tracking-[0.18em] text-white/40">
                        Commission %
                      </span>
                      <input
                        name="commission_rate_percent"
                        required
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        defaultValue={formatPercent(agent.commission_rate)}
                        className="mt-2 w-full rounded-2xl border border-amber-300/15 bg-black/35 px-4 py-3 text-sm font-bold text-amber-50 outline-none focus:border-amber-300/40"
                      />
                    </label>

                    <label className="lg:col-span-2">
                      <span className="text-xs font-black uppercase tracking-[0.18em] text-white/40">
                        Status
                      </span>
                      <select
                        name="status"
                        defaultValue={agent.status}
                        className="mt-2 w-full rounded-2xl border border-amber-300/15 bg-black/35 px-4 py-3 text-sm font-bold text-amber-50 outline-none focus:border-amber-300/40"
                      >
                        <option value="active">Active</option>
                        <option value="paused">Paused</option>
                        <option value="disabled">Disabled</option>
                      </select>
                    </label>

                    <label className="lg:col-span-3">
                      <span className="text-xs font-black uppercase tracking-[0.18em] text-white/40">
                        Notes
                      </span>
                      <input
                        name="notes"
                        defaultValue={agent.notes ?? ""}
                        placeholder="Optional"
                        className="mt-2 w-full rounded-2xl border border-amber-300/15 bg-black/35 px-4 py-3 text-sm font-bold text-amber-50 outline-none placeholder:text-white/25 focus:border-amber-300/40"
                      />
                    </label>

                    <div className="flex items-end lg:col-span-2">
                      <button
                        type="submit"
                        className="w-full rounded-2xl border border-amber-300/25 bg-amber-300/15 px-4 py-3 text-sm font-black text-amber-100 hover:bg-amber-300/25"
                      >
                        Save
                      </button>
                    </div>
                  </form>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {agent.status === "active" ? (
                      <form action={pauseAgentAction}>
                        <input type="hidden" name="agent_id" value={agent.id} />
                        <button
                          type="submit"
                          className="rounded-2xl border border-amber-300/20 bg-amber-300/10 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-amber-100 hover:bg-amber-300/20"
                        >
                          Pause Agent
                        </button>
                      </form>
                    ) : (
                      <form action={activateAgentAction}>
                        <input type="hidden" name="agent_id" value={agent.id} />
                        <button
                          type="submit"
                          className="rounded-2xl border border-emerald-300/20 bg-emerald-300/10 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-emerald-100 hover:bg-emerald-300/20"
                        >
                          Activate Agent
                        </button>
                      </form>
                    )}

                    <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-2 text-xs font-bold text-white/40">
                      Created: {new Date(agent.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}