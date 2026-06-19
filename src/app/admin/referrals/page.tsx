// src/app/admin/referrals/page.tsx

import Link from "next/link";
import { redirect } from "next/navigation";

import AdminShell from "@/components/admin/AdminShell";
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

type AgentStatus = "active" | "paused" | "disabled";

type AgentOption = {
  id: string;
  agent_code: string;
  display_name: string;
  commission_rate: number;
  status: AgentStatus;
};

type AgentJoin = {
  agent_code: string;
  display_name: string;
  commission_rate: number;
  status: AgentStatus;
};

type RawActiveReferral = {
  id: string;
  player_id: string;
  agent_code_snapshot: string;
  status: "active" | "removed";
  assigned_at: string;
  notes: string | null;
  agent_profiles: AgentJoin | AgentJoin[] | null;
};

type ActiveReferral = {
  id: string;
  player_id: string;
  agent_code_snapshot: string;
  status: "active" | "removed";
  assigned_at: string;
  notes: string | null;
  agent_profiles: AgentJoin | null;
};

type ProfileRow = {
  id: string;
  username: string | null;
  member_code: string | null;
};

function formatPercent(rate: number) {
  return (Number(rate || 0) * 100).toFixed(2).replace(/\.00$/, "");
}

function shortId(id: string) {
  if (!id) return "-";
  return `${id.slice(0, 8)}...${id.slice(-6)}`;
}

function formatMemberId(profileId: string, memberCode?: string | null) {
  return memberCode || `NG-${profileId.slice(0, 8).toUpperCase()}`;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Yangon",
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(new Date(value));
}

function getAgentStatusClass(status: AgentStatus | null | undefined) {
  if (status === "active") {
    return "border-emerald-400/25 bg-emerald-400/10 text-emerald-100";
  }

  if (status === "paused") {
    return "border-amber-400/25 bg-amber-400/10 text-amber-100";
  }

  if (status === "disabled") {
    return "border-red-400/25 bg-red-400/10 text-red-100";
  }

  return "border-white/10 bg-white/[0.03] text-white/40";
}

function normalizeAgent(agentProfiles: RawActiveReferral["agent_profiles"]) {
  if (Array.isArray(agentProfiles)) {
    return agentProfiles[0] ?? null;
  }

  return agentProfiles;
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
    .order("created_at", { ascending: false })
    .returns<AgentOption[]>();

  const agents = agentData ?? [];
  const activeAgents = agents.filter((agent) => agent.status === "active");
  const pausedAgents = agents.filter((agent) => agent.status === "paused");

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
    `
    )
    .eq("status", "active")
    .order("assigned_at", { ascending: false });

  const referrals = ((referralData ?? []) as RawActiveReferral[]).map(
    (referral) => ({
      ...referral,
      agent_profiles: normalizeAgent(referral.agent_profiles),
    })
  ) as ActiveReferral[];

  const playerIds = Array.from(
    new Set(referrals.map((referral) => referral.player_id))
  );

  const { data: profiles, error: profilesError } =
    playerIds.length > 0
      ? await supabase
          .from("profiles")
          .select("id, username, member_code")
          .in("id", playerIds)
          .returns<ProfileRow[]>()
      : { data: [], error: null };

  const profileById = new Map(
    (profiles ?? []).map((profile) => [profile.id, profile])
  );

  const errors = [
    agentError ? `Agents: ${agentError.message}` : null,
    referralError ? `Referrals: ${referralError.message}` : null,
    profilesError ? `Profiles: ${profilesError.message}` : null,
  ].filter((error): error is string => Boolean(error));

  return (
    <AdminShell
      title="Referrals"
      eyebrow="Referral Assignment"
      description="Assign registered players to active agents. This prepares monthly net settlement only; it does not create instant commission."
      action={
        <Link
          href="/admin/agents"
          className="rounded-full border border-amber-300/20 bg-amber-300/10 px-4 py-2 text-xs font-black text-amber-100/80 transition hover:bg-amber-300 hover:text-black"
        >
          Agents
        </Link>
      }
    >
      {params.success ? (
        <section className="rounded-2xl border border-emerald-400/25 bg-emerald-950/25 p-4">
          <p className="text-sm font-black text-emerald-100">
            {params.success}
          </p>
        </section>
      ) : null}

      {params.error ? (
        <section className="rounded-2xl border border-red-400/25 bg-red-950/25 p-4">
          <p className="text-sm font-black text-red-100">{params.error}</p>
        </section>
      ) : null}

      {errors.length > 0 ? (
        <section className="mt-3 rounded-2xl border border-red-400/25 bg-red-950/25 p-4">
          <p className="text-sm font-black text-red-100">
            Referral warning
          </p>

          <div className="mt-2 space-y-1">
            {errors.map((error) => (
              <p key={error} className="text-xs font-semibold text-red-100/70">
                {error}
              </p>
            ))}
          </div>
        </section>
      ) : null}

      <section className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-emerald-300/15 bg-emerald-400/10 p-4">
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-emerald-100/55">
            Active Agents
          </p>
          <p className="mt-2 text-2xl font-black text-emerald-100">
            {activeAgents.length}
          </p>
        </div>

        <div className="rounded-2xl border border-amber-300/15 bg-amber-300/10 p-4">
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-amber-100/55">
            Assigned Players
          </p>
          <p className="mt-2 text-2xl font-black text-amber-100">
            {referrals.length}
          </p>
        </div>

        <div className="rounded-2xl border border-sky-300/15 bg-sky-400/10 p-4">
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-sky-100/55">
            Total Agents
          </p>
          <p className="mt-2 text-2xl font-black text-sky-100">
            {agents.length}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-white/40">
            Paused Agents
          </p>
          <p className="mt-2 text-2xl font-black text-amber-100">
            {pausedAgents.length}
          </p>
        </div>
      </section>

      <section className="mt-4 rounded-2xl border border-amber-300/12 bg-black/35 p-4">
        <div className="mb-4">
          <p className="text-[11px] font-black uppercase tracking-[0.28em] text-amber-200/45">
            Assign Player
          </p>
          <h2 className="mt-1 text-xl font-black text-amber-100">
            Link Player to Agent
          </h2>
        </div>

        <form
          action={assignPlayerToAgentAction}
          className="grid gap-3 lg:grid-cols-5"
        >
          <label className="lg:col-span-2">
            <span className="text-[11px] font-black uppercase tracking-[0.18em] text-white/40">
              Player UUID
            </span>
            <input
              name="player_id"
              required
              placeholder="Paste profile/player id"
              className="mt-2 w-full rounded-xl border border-amber-300/15 bg-black/35 px-4 py-3 text-sm font-bold text-amber-50 outline-none placeholder:text-white/25 focus:border-amber-300/40"
            />
          </label>

          <label>
            <span className="text-[11px] font-black uppercase tracking-[0.18em] text-white/40">
              Agent Code
            </span>
            <input
              name="agent_code"
              required
              list="active-agent-codes"
              placeholder="agent001"
              className="mt-2 w-full rounded-xl border border-amber-300/15 bg-black/35 px-4 py-3 text-sm font-bold text-amber-50 outline-none placeholder:text-white/25 focus:border-amber-300/40"
            />
            <datalist id="active-agent-codes">
              {activeAgents.map((agent) => (
                <option key={agent.id} value={agent.agent_code}>
                  {agent.display_name}
                </option>
              ))}
            </datalist>
          </label>

          <label>
            <span className="text-[11px] font-black uppercase tracking-[0.18em] text-white/40">
              Notes
            </span>
            <input
              name="notes"
              placeholder="Optional"
              className="mt-2 w-full rounded-xl border border-amber-300/15 bg-black/35 px-4 py-3 text-sm font-bold text-amber-50 outline-none placeholder:text-white/25 focus:border-amber-300/40"
            />
          </label>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full rounded-xl border border-amber-300/30 bg-amber-300 px-4 py-3 text-sm font-black text-black shadow-lg shadow-amber-950/30 transition hover:bg-amber-200"
            >
              Assign
            </button>
          </div>
        </form>

        <p className="mt-3 rounded-xl border border-amber-300/10 bg-black/25 px-4 py-3 text-xs font-semibold leading-5 text-white/42">
          If a player already has an active agent, assigning a new one removes
          the old active referral and creates a new active referral. Past
          settlement records remain auditable.
        </p>
      </section>

      <section className="mt-4 rounded-2xl border border-amber-300/12 bg-black/35 p-4">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.28em] text-amber-200/45">
              Active Referrals
            </p>
            <h2 className="mt-1 text-xl font-black text-amber-100">
              Assigned Players
            </h2>
          </div>

          <p className="rounded-full border border-white/10 bg-black/30 px-4 py-2 text-xs font-black text-white/45">
            {referrals.length} active
          </p>
        </div>

        {referrals.length === 0 ? (
          <div className="mt-4 rounded-xl border border-white/10 bg-black/25 p-5 text-center">
            <p className="text-lg font-black text-amber-100">
              No active referrals yet
            </p>
            <p className="mt-1 text-sm font-semibold text-white/45">
              Assign a player UUID to an active agent above.
            </p>
          </div>
        ) : null}

        <div className="mt-4 grid gap-3">
          {referrals.map((referral) => {
            const agent = referral.agent_profiles;
            const profile = profileById.get(referral.player_id);

            return (
              <article
                key={referral.id}
                className="rounded-xl border border-white/10 bg-[#120504] p-4"
              >
                <div className="grid gap-4 xl:grid-cols-[1.2fr_1fr_130px_160px_320px] xl:items-start">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-black text-amber-100">
                        {formatMemberId(
                          referral.player_id,
                          profile?.member_code
                        )}
                      </h3>

                      <span className="rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1 text-[11px] font-black uppercase tracking-[0.14em] text-emerald-100">
                        Active
                      </span>
                    </div>

                    <p className="mt-1 text-sm font-bold text-white/45">
                      Player {shortId(referral.player_id)}
                    </p>
                    <p className="mt-1 break-all text-xs font-semibold text-white/32">
                      {referral.player_id}
                    </p>
                    {profile?.username ? (
                      <p className="mt-1 text-xs font-bold text-white/40">
                        {profile.username}
                      </p>
                    ) : null}
                  </div>

                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/30">
                      Agent
                    </p>
                    <p className="mt-1 text-base font-black text-amber-100">
                      {agent?.display_name ?? "Unknown"}
                    </p>
                    <p className="mt-1 text-xs font-bold text-white/45">
                      {agent?.agent_code ?? referral.agent_code_snapshot}
                    </p>

                    {agent ? (
                      <span
                        className={`mt-2 inline-flex rounded-full border px-3 py-1 text-[11px] font-black uppercase tracking-[0.14em] ${getAgentStatusClass(
                          agent.status
                        )}`}
                      >
                        {agent.status}
                      </span>
                    ) : null}
                  </div>

                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/30">
                      Rate
                    </p>
                    <p className="mt-1 text-base font-black text-amber-100">
                      {agent ? `${formatPercent(agent.commission_rate)}%` : "—"}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/30">
                      Assigned
                    </p>
                    <p className="mt-1 text-sm font-bold text-white/55">
                      {formatDate(referral.assigned_at)}
                    </p>
                    {referral.notes ? (
                      <p className="mt-1 break-words text-xs font-semibold text-white/35">
                        {referral.notes}
                      </p>
                    ) : null}
                  </div>

                  <form
                    action={removePlayerReferralAction}
                    className="rounded-xl border border-red-300/10 bg-red-950/10 p-3"
                  >
                    <input
                      type="hidden"
                      name="player_id"
                      value={referral.player_id}
                    />

                    <label>
                      <span className="text-[11px] font-black uppercase tracking-[0.18em] text-red-100/55">
                        Remove Notes
                      </span>
                      <input
                        name="remove_notes"
                        placeholder="Optional"
                        className="mt-2 w-full rounded-xl border border-red-300/15 bg-black/35 px-4 py-3 text-sm font-bold text-amber-50 outline-none placeholder:text-white/25 focus:border-red-300/40"
                      />
                    </label>

                    <button
                      type="submit"
                      className="mt-3 w-full rounded-full border border-red-300/25 bg-red-400/10 px-4 py-3 text-sm font-black text-red-100 transition hover:bg-red-300 hover:text-black"
                    >
                      Remove Referral
                    </button>
                  </form>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </AdminShell>
  );
}