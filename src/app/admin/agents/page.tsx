// src/app/admin/agents/page.tsx

import Link from "next/link";
import { redirect } from "next/navigation";

import AdminShell from "@/components/admin/AdminShell";
import { createClient } from "@/lib/supabase/server";
import {
  activateAgentAction,
  createAgentAction,
  createAgentLoginAction,
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
  auth_user_id: string | null;
  agent_login_phone: string | null;
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
  return `${new Intl.NumberFormat("en-US").format(Number(amount || 0))} MMK`;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Yangon",
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(new Date(value));
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
      "id, agent_code, display_name, commission_rate, status, negative_carry, notes, created_at, auth_user_id, agent_login_phone"
    )
    .order("created_at", { ascending: false })
    .returns<AgentProfile[]>();

  const agents = data ?? [];

  const totalAgents = agents.length;
  const activeAgents = agents.filter((agent) => agent.status === "active").length;
  const pausedAgents = agents.filter((agent) => agent.status === "paused").length;
  const disabledAgents = agents.filter(
    (agent) => agent.status === "disabled"
  ).length;
  const totalNegativeCarry = agents.reduce(
    (sum, agent) => sum + Number(agent.negative_carry || 0),
    0
  );

  return (
    <AdminShell
      title="Agents"
      eyebrow="Referral Partners"
      description="Create agents, set monthly commission rate, pause partners, and prepare future agent settlement control."
action={
  <div className="flex flex-wrap gap-2">
    <Link
      href="/admin/referrals"
      className="rounded-full border border-amber-300/20 bg-amber-300/10 px-4 py-2 text-xs font-black text-amber-100/80 transition hover:bg-amber-300 hover:text-black"
    >
      Referrals
    </Link>

    <Link
      href="/admin/agent-withdraws"
      className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-4 py-2 text-xs font-black text-emerald-100/80 transition hover:bg-emerald-300 hover:text-black"
    >
      Agent Withdraws
    </Link>
  </div>
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

      {error ? (
        <section className="mt-3 rounded-2xl border border-red-400/25 bg-red-950/25 p-4">
          <p className="text-sm font-black text-red-100">
            Failed to load agents
          </p>
          <p className="mt-1 text-xs font-semibold text-red-100/70">
            {error.message}
          </p>
        </section>
      ) : null}

      <section className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <div className="rounded-2xl border border-amber-300/15 bg-amber-300/10 p-4">
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-amber-100/55">
            Total Agents
          </p>
          <p className="mt-2 text-2xl font-black text-amber-100">
            {totalAgents}
          </p>
        </div>

        <div className="rounded-2xl border border-emerald-300/15 bg-emerald-400/10 p-4">
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-emerald-100/55">
            Active
          </p>
          <p className="mt-2 text-2xl font-black text-emerald-100">
            {activeAgents}
          </p>
        </div>

        <div className="rounded-2xl border border-amber-300/15 bg-amber-300/10 p-4">
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-amber-100/55">
            Paused
          </p>
          <p className="mt-2 text-2xl font-black text-amber-100">
            {pausedAgents}
          </p>
        </div>

        <div className="rounded-2xl border border-red-300/15 bg-red-400/10 p-4">
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-red-100/55">
            Disabled
          </p>
          <p className="mt-2 text-2xl font-black text-red-100">
            {disabledAgents}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-white/40">
            Negative Carry
          </p>
          <p className="mt-2 truncate text-2xl font-black text-red-100">
            {formatMMK(totalNegativeCarry)}
          </p>
        </div>
      </section>

      <section className="mt-4 rounded-2xl border border-amber-300/12 bg-black/35 p-4">
        <div className="mb-4">
          <p className="text-[11px] font-black uppercase tracking-[0.28em] text-amber-200/45">
            Create Agent
          </p>
          <h2 className="mt-1 text-xl font-black text-amber-100">
            New Referral Partner
          </h2>
        </div>

        <form action={createAgentAction} className="grid gap-3 lg:grid-cols-6">
          <label>
            <span className="text-[11px] font-black uppercase tracking-[0.18em] text-white/40">
              Agent Code
            </span>
            <input
              name="agent_code"
              required
              placeholder="agent001"
              className="mt-2 w-full rounded-xl border border-amber-300/15 bg-black/35 px-4 py-3 text-sm font-bold text-amber-50 outline-none placeholder:text-white/25 focus:border-amber-300/40"
            />
          </label>

          <label>
            <span className="text-[11px] font-black uppercase tracking-[0.18em] text-white/40">
              Display Name
            </span>
            <input
              name="display_name"
              required
              placeholder="Agent A"
              className="mt-2 w-full rounded-xl border border-amber-300/15 bg-black/35 px-4 py-3 text-sm font-bold text-amber-50 outline-none placeholder:text-white/25 focus:border-amber-300/40"
            />
          </label>

<label>
  <span className="text-[11px] font-black uppercase tracking-[0.18em] text-white/40">
    Login Phone
  </span>
  <input
    name="phone_number"
    required
    placeholder="09957117174"
    className="mt-2 w-full rounded-xl border border-amber-300/15 bg-black/35 px-4 py-3 text-sm font-bold text-amber-50 outline-none placeholder:text-white/25 focus:border-amber-300/40"
  />
</label>

<label>
  <span className="text-[11px] font-black uppercase tracking-[0.18em] text-white/40">
    Password
  </span>
  <input
    name="password"
    required
    type="password"
    minLength={6}
    placeholder="Minimum 6 characters"
    className="mt-2 w-full rounded-xl border border-amber-300/15 bg-black/35 px-4 py-3 text-sm font-bold text-amber-50 outline-none placeholder:text-white/25 focus:border-amber-300/40"
  />
</label>

          <label>
            <span className="text-[11px] font-black uppercase tracking-[0.18em] text-white/40">
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
              className="mt-2 w-full rounded-xl border border-amber-300/15 bg-black/35 px-4 py-3 text-sm font-bold text-amber-50 outline-none focus:border-amber-300/40"
            />
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
              Create Agent
            </button>
          </div>
        </form>

        <p className="mt-3 rounded-xl border border-amber-300/10 bg-black/25 px-4 py-3 text-xs font-semibold leading-5 text-white/42">
          Agent commission is monthly only. No instant commission. Future agent
          portal will use separate login and only show assigned referral data.
        </p>
      </section>

      <section className="mt-4 rounded-2xl border border-amber-300/12 bg-black/35 p-4">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.28em] text-amber-200/45">
              Agent List
            </p>
            <h2 className="mt-1 text-xl font-black text-amber-100">
              Manage Partners
            </h2>
          </div>

          <p className="rounded-full border border-white/10 bg-black/30 px-4 py-2 text-xs font-black text-white/45">
            {agents.length} loaded
          </p>
        </div>

        {agents.length === 0 ? (
          <div className="mt-4 rounded-xl border border-white/10 bg-black/25 p-5 text-center">
            <p className="text-lg font-black text-amber-100">No agents yet</p>
            <p className="mt-1 text-sm font-semibold text-white/45">
              Create your first referral partner above.
            </p>
          </div>
        ) : null}

        <div className="mt-4 grid gap-3">
          {agents.map((agent) => (
            <article
              key={agent.id}
              className="rounded-xl border border-white/10 bg-[#120504] p-4"
            >
              <div className="grid gap-3 lg:grid-cols-[1fr_120px_150px_150px_130px] lg:items-center">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-black text-amber-100">
                      {agent.display_name}
                    </h3>

                    <span
                      className={`rounded-full border px-3 py-1 text-[11px] font-black uppercase tracking-[0.14em] ${getStatusClass(
                        agent.status
                      )}`}
                    >
                      {agent.status}
                    </span>
                  </div>

                  <p className="mt-1 text-sm font-bold text-white/45">
                    Code:{" "}
                    <span className="font-black text-amber-200">
                      {agent.agent_code}
                    </span>
                  </p>

                  {agent.notes ? (
                    <p className="mt-1 break-words text-xs font-semibold text-white/38">
                      {agent.notes}
                    </p>
                  ) : null}
                </div>

                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/30">
                    Rate
                  </p>
                  <p className="mt-1 text-lg font-black text-amber-100">
                    {formatPercent(agent.commission_rate)}%
                  </p>
                </div>

                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/30">
                    Negative Carry
                  </p>
                  <p className="mt-1 text-sm font-black text-red-100">
                    {formatMMK(agent.negative_carry)}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/30">
                    Created
                  </p>
                  <p className="mt-1 text-sm font-bold text-white/50">
                    {formatDate(agent.created_at)}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 lg:justify-end">
                  <Link
                    href="/admin/referrals"
                    className="rounded-full border border-amber-300/15 bg-amber-300/10 px-3 py-2 text-xs font-black text-amber-100/80 transition hover:bg-amber-300 hover:text-black"
                  >
                    Referrals
                  </Link>
                </div>
              </div>

              <form
                action={updateAgentAction}
                className="mt-4 grid gap-3 border-t border-white/10 pt-4 lg:grid-cols-12"
              >
                <input type="hidden" name="agent_id" value={agent.id} />

                <label className="lg:col-span-3">
                  <span className="text-[11px] font-black uppercase tracking-[0.18em] text-white/35">
                    Display Name
                  </span>
                  <input
                    name="display_name"
                    required
                    defaultValue={agent.display_name}
                    className="mt-2 w-full rounded-xl border border-amber-300/15 bg-black/35 px-4 py-3 text-sm font-bold text-amber-50 outline-none focus:border-amber-300/40"
                  />
                </label>

                <label className="lg:col-span-2">
                  <span className="text-[11px] font-black uppercase tracking-[0.18em] text-white/35">
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
                    className="mt-2 w-full rounded-xl border border-amber-300/15 bg-black/35 px-4 py-3 text-sm font-bold text-amber-50 outline-none focus:border-amber-300/40"
                  />
                </label>

                <label className="lg:col-span-2">
                  <span className="text-[11px] font-black uppercase tracking-[0.18em] text-white/35">
                    Status
                  </span>
                  <select
                    name="status"
                    defaultValue={agent.status}
                    className="mt-2 w-full rounded-xl border border-amber-300/15 bg-black/35 px-4 py-3 text-sm font-bold text-amber-50 outline-none focus:border-amber-300/40"
                  >
                    <option value="active">Active</option>
                    <option value="paused">Paused</option>
                    <option value="disabled">Disabled</option>
                  </select>
                </label>

                <label className="lg:col-span-3">
                  <span className="text-[11px] font-black uppercase tracking-[0.18em] text-white/35">
                    Notes
                  </span>
                  <input
                    name="notes"
                    defaultValue={agent.notes ?? ""}
                    placeholder="Optional"
                    className="mt-2 w-full rounded-xl border border-amber-300/15 bg-black/35 px-4 py-3 text-sm font-bold text-amber-50 outline-none placeholder:text-white/25 focus:border-amber-300/40"
                  />
                </label>

                <div className="flex items-end lg:col-span-2">
                  <button
                    type="submit"
                    className="w-full rounded-xl border border-amber-300/25 bg-amber-300/15 px-4 py-3 text-sm font-black text-amber-100 transition hover:bg-amber-300 hover:text-black"
                  >
                    Save
                  </button>
                </div>
              </form>

<div className="mt-4 rounded-xl border border-amber-300/10 bg-black/25 p-4">
  <div
    className={[
      "mb-3 rounded-xl border px-4 py-3 text-xs font-black uppercase tracking-[0.14em]",
      agent.auth_user_id
        ? "border-emerald-300/15 bg-emerald-400/10 text-emerald-100"
        : "border-amber-300/15 bg-amber-400/10 text-amber-100",
    ].join(" ")}
  >
    {agent.auth_user_id ? "Login Ready" : "Login Not Created"}
    {agent.agent_login_phone ? (
      <span className="ml-3 normal-case tracking-normal text-white/70">
        Phone: {agent.agent_login_phone}
      </span>
    ) : null}
  </div>

  <form action={createAgentLoginAction} className="grid gap-3 lg:grid-cols-3">
    <input type="hidden" name="agent_id" value={agent.id} />
    <input type="hidden" name="agent_code" value={agent.agent_code} />
    <input
      type="hidden"
      name="auth_user_id"
      value={agent.auth_user_id ?? ""}
    />

    <label>
      <span className="text-[11px] font-black uppercase tracking-[0.18em] text-white/35">
        Login Phone
      </span>
      <input
        name="phone_number"
        required
        defaultValue={agent.agent_login_phone ?? ""}
        placeholder="09957117174"
        className="mt-2 w-full rounded-xl border border-amber-300/15 bg-black/35 px-4 py-3 text-sm font-bold text-amber-50 outline-none placeholder:text-white/25 focus:border-amber-300/40"
      />
    </label>

    <label>
      <span className="text-[11px] font-black uppercase tracking-[0.18em] text-white/35">
        Password / Reset Password
      </span>
      <input
        name="password"
        required
        type="password"
        minLength={6}
        placeholder="Minimum 6 characters"
        className="mt-2 w-full rounded-xl border border-amber-300/15 bg-black/35 px-4 py-3 text-sm font-bold text-amber-50 outline-none placeholder:text-white/25 focus:border-amber-300/40"
      />
    </label>

    <div className="flex items-end">
      <button
        type="submit"
        className="w-full rounded-xl border border-amber-300/25 bg-amber-300/15 px-4 py-3 text-sm font-black text-amber-100 transition hover:bg-amber-300 hover:text-black"
      >
        {agent.auth_user_id ? "Save / Reset Login" : "Create Login"}
      </button>
    </div>
  </form>
</div>

              <div className="mt-3 flex flex-wrap gap-2">
                {agent.status === "active" ? (
                  <form action={pauseAgentAction}>
                    <input type="hidden" name="agent_id" value={agent.id} />
                    <button
                      type="submit"
                      className="rounded-full border border-amber-300/20 bg-amber-300/10 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-amber-100 transition hover:bg-amber-300/20"
                    >
                      Pause Agent
                    </button>
                  </form>
                ) : (
                  <form action={activateAgentAction}>
                    <input type="hidden" name="agent_id" value={agent.id} />
                    <button
                      type="submit"
                      className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-emerald-100 transition hover:bg-emerald-300/20"
                    >
                      Activate Agent
                    </button>
                  </form>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>
    </AdminShell>
  );
}