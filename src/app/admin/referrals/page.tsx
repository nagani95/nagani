// src/app/admin/referrals/page.tsx

import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  assignPlayerToAgentAction,
  removePlayerReferralAction,
} from "./actions";

export const dynamic = "force-dynamic";

type AdminReferralsPageProps = {
  searchParams?: Promise<{
    success?: string;
    error?: string;
  }>;
};

type ActiveReferral = {
  id: string;
  player_id: string;
  agent_code_snapshot: string;
  status: "active" | "removed";
  assigned_at: string;
  notes: string | null;
  agent_profiles:
    | {
        agent_code: string;
        display_name: string;
        commission_rate: number;
        status: "active" | "paused" | "disabled";
      }
    | null;
};

type AgentOption = {
  id: string;
  agent_code: string;
  display_name: string;
  commission_rate: number;
  status: "active" | "paused" | "disabled";
};

function formatPercent(rate: number) {
  return (Number(rate || 0) * 100).toFixed(2).replace(/\.00$/, "");
}

function shortId(id: string) {
  if (!id) return "-";
  return `${id.slice(0, 8)}...${id.slice(-6)}`;
}

function getAgentStatusClass(status: AgentOption["status"]) {
  if (status === "active") {
    return "border-emerald-400/25 bg-emerald-400/10 text-emerald-100";
  }

  if (status === "paused") {
    return "border-amber-400/25 bg-amber-400/10 text-amber-100";
  }

  return "border-red-400/25 bg-red-400/10 text-red-100";
}

export default async function AdminReferralsPage({
  searchParams,
}: AdminReferralsPageProps) {
  const params = searchParams ? await searchParams : {};
  const supabase = await createClient();

  const { data: isAdmin, error: adminError } =
    await supabase.rpc("is_nagani_admin");

  if (adminError || !isAdmin) {
    redirect("/admin/login");
  }

  const { data: agentData, error: agentError } = await supabase
    .from("agent_profiles")
    .select("id, agent_code, display_name, commission_rate, status")
    .order("created_at", { ascending: false });

  const agents = (agentData ?? []) as AgentOption[];
  const activeAgents = agents.filter((agent) => agent.status === "active");

  const { data: referralData, error: referralError } = await supabase
    .from("player_referrals")
    .select(
      `
      id,
      player_id,
      agent_code_snapshot,
      status,
      assigned_at,
      notes,
      agent_profiles (
        agent_code,
        display_name,
        commission_rate,
        status
      )
    `,
    )
    .eq("status", "active")
    .order("assigned_at", { ascending: false });

type RawActiveReferral = {
  id: string;
  player_id: string;
  agent_code_snapshot: string;
  status: "active" | "removed";
  assigned_at: string;
  notes: string | null;
  agent_profiles:
    | {
        agent_code: string;
        display_name: string;
        commission_rate: number;
        status: "active" | "paused" | "disabled";
      }
    | {
        agent_code: string;
        display_name: string;
        commission_rate: number;
        status: "active" | "paused" | "disabled";
      }[]
    | null;
};

const referrals = ((referralData ?? []) as RawActiveReferral[]).map(
  (referral) => ({
    ...referral,
    agent_profiles: Array.isArray(referral.agent_profiles)
      ? referral.agent_profiles[0] ?? null
      : referral.agent_profiles,
  }),
) as ActiveReferral[];

  return (
    <main className="min-h-screen bg-[#130804] px-4 py-6 text-amber-50">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-amber-300/60">
              Nagani Admin
            </p>
            <h1 className="mt-2 text-3xl font-black text-amber-100">
              Referral Assignment
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/55">
              Assign registered players to active agents. This does not pay
              instant commission. It only prepares monthly net settlement.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              href="/admin/agents"
              className="rounded-2xl border border-amber-300/20 bg-amber-300/10 px-4 py-3 text-center text-sm font-black text-amber-100 hover:bg-amber-300/20"
            >
              Agents
            </Link>

            <Link
              href="/admin"
              className="rounded-2xl border border-amber-300/20 bg-black/20 px-4 py-3 text-center text-sm font-black text-amber-100 hover:bg-amber-300/10"
            >
              Back to Admin
            </Link>
          </div>
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

        {agentError ? (
          <div className="mb-4 rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm font-bold text-red-100">
            Failed to load agents: {agentError.message}
          </div>
        ) : null}

        {referralError ? (
          <div className="mb-4 rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm font-bold text-red-100">
            Failed to load referrals: {referralError.message}
          </div>
        ) : null}

        <section className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-3xl border border-amber-300/15 bg-black/25 p-4">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-white/40">
              Active Agents
            </p>
            <p className="mt-2 text-2xl font-black text-emerald-100">
              {activeAgents.length}
            </p>
          </div>

          <div className="rounded-3xl border border-amber-300/15 bg-black/25 p-4">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-white/40">
              Assigned Players
            </p>
            <p className="mt-2 text-2xl font-black text-amber-100">
              {referrals.length}
            </p>
          </div>

          <div className="rounded-3xl border border-amber-300/15 bg-black/25 p-4">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-white/40">
              Settlement Rule
            </p>
            <p className="mt-2 text-sm font-black leading-6 text-amber-100">
              Monthly net only
            </p>
          </div>
        </section>

        <section className="mt-6 rounded-[2rem] border border-amber-300/15 bg-[#1b0d07]/85 p-5 shadow-2xl shadow-black/30">
          <div className="mb-5">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-amber-300/55">
              Assign Player
            </p>
            <h2 className="mt-2 text-xl font-black text-amber-100">
              Link player to agent
            </h2>
          </div>

          <form
            action={assignPlayerToAgentAction}
            className="grid gap-4 lg:grid-cols-5"
          >
            <label className="lg:col-span-2">
              <span className="text-xs font-black uppercase tracking-[0.18em] text-white/45">
                Player UUID
              </span>
              <input
                name="player_id"
                required
                placeholder="Paste profile/player id"
                className="mt-2 w-full rounded-2xl border border-amber-300/15 bg-black/35 px-4 py-3 text-sm font-bold text-amber-50 outline-none placeholder:text-white/25 focus:border-amber-300/40"
              />
            </label>

            <label className="lg:col-span-1">
              <span className="text-xs font-black uppercase tracking-[0.18em] text-white/45">
                Agent Code
              </span>
              <input
                name="agent_code"
                required
                list="active-agent-codes"
                placeholder="agent001"
                className="mt-2 w-full rounded-2xl border border-amber-300/15 bg-black/35 px-4 py-3 text-sm font-bold text-amber-50 outline-none placeholder:text-white/25 focus:border-amber-300/40"
              />
              <datalist id="active-agent-codes">
                {activeAgents.map((agent) => (
                  <option key={agent.id} value={agent.agent_code}>
                    {agent.display_name}
                  </option>
                ))}
              </datalist>
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
                Assign
              </button>
            </div>
          </form>

          <div className="mt-4 rounded-2xl border border-amber-300/10 bg-black/20 px-4 py-3 text-xs leading-5 text-white/45">
            If a player already has an active agent, assigning a new one removes
            the old active referral and creates a new active referral. Past
            monthly settlement records remain auditable.
          </div>
        </section>

        <section className="mt-6 rounded-[2rem] border border-amber-300/15 bg-[#1b0d07]/85 p-5 shadow-2xl shadow-black/30">
          <div className="mb-5">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-amber-300/55">
              Active Referrals
            </p>
            <h2 className="mt-2 text-xl font-black text-amber-100">
              Assigned players
            </h2>
          </div>

          {referrals.length === 0 ? (
            <div className="rounded-[2rem] border border-white/10 bg-black/25 p-8 text-center">
              <p className="text-lg font-black text-amber-100">
                No active referrals yet
              </p>
              <p className="mt-2 text-sm text-white/45">
                Assign a player UUID to an active agent above.
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {referrals.map((referral) => {
                const agent = referral.agent_profiles;

                return (
                  <article
                    key={referral.id}
                    className="rounded-[2rem] border border-amber-300/15 bg-black/25 p-5"
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-black text-amber-100">
                            Player {shortId(referral.player_id)}
                          </h3>

                          <span className="rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] text-emerald-100">
                            Active
                          </span>
                        </div>

                        <p className="mt-2 break-all text-xs font-bold text-white/40">
                          {referral.player_id}
                        </p>

                        <div className="mt-4 grid gap-2 sm:grid-cols-3">
                          <div className="rounded-2xl border border-amber-300/10 bg-black/25 px-4 py-3">
                            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/35">
                              Agent
                            </p>
                            <p className="mt-1 text-sm font-black text-amber-100">
                              {agent?.display_name ?? "Unknown"}
                            </p>
                            <p className="mt-1 text-xs font-bold text-white/45">
                              {agent?.agent_code ??
                                referral.agent_code_snapshot}
                            </p>
                          </div>

                          <div className="rounded-2xl border border-amber-300/10 bg-black/25 px-4 py-3">
                            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/35">
                              Rate
                            </p>
                            <p className="mt-1 text-sm font-black text-amber-100">
                              {agent
                                ? `${formatPercent(agent.commission_rate)}%`
                                : "-"}
                            </p>
                          </div>

                          <div className="rounded-2xl border border-amber-300/10 bg-black/25 px-4 py-3">
                            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/35">
                              Assigned
                            </p>
                            <p className="mt-1 text-sm font-black text-amber-100">
                              {new Date(
                                referral.assigned_at,
                              ).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        {agent ? (
                          <div className="mt-3">
                            <span
                              className={`rounded-full border px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] ${getAgentStatusClass(
                                agent.status,
                              )}`}
                            >
                              Agent {agent.status}
                            </span>
                          </div>
                        ) : null}

                        {referral.notes ? (
                          <p className="mt-3 text-sm leading-6 text-white/45">
                            Notes: {referral.notes}
                          </p>
                        ) : null}
                      </div>

                      <form
                        action={removePlayerReferralAction}
                        className="w-full rounded-2xl border border-red-300/10 bg-red-950/10 p-4 lg:w-80"
                      >
                        <input
                          type="hidden"
                          name="player_id"
                          value={referral.player_id}
                        />

                        <label>
                          <span className="text-xs font-black uppercase tracking-[0.18em] text-red-100/55">
                            Remove Notes
                          </span>
                          <input
                            name="remove_notes"
                            placeholder="Optional"
                            className="mt-2 w-full rounded-2xl border border-red-300/15 bg-black/35 px-4 py-3 text-sm font-bold text-amber-50 outline-none placeholder:text-white/25 focus:border-red-300/40"
                          />
                        </label>

                        <button
                          type="submit"
                          className="mt-3 w-full rounded-2xl border border-red-300/25 bg-red-400/10 px-4 py-3 text-sm font-black text-red-100 hover:bg-red-400/20"
                        >
                          Remove Referral
                        </button>
                      </form>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}