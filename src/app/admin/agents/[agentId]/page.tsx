//src/app/admin/agents/[agentId]/page.tsx

import Link from "next/link";
import { redirect } from "next/navigation";

import AdminShell from "@/components/admin/AdminShell";
import { createClient } from "@/lib/supabase/server";
import {
  activateAgentAction,
  createAgentLoginAction,
  pauseAgentAction,
  updateAgentAction,
} from "../actions";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{
    agentId: string;
  }>;
};

type AgentStatus = "active" | "paused" | "disabled";

type AgentProfile = {
  id: string;
  agent_code: string;
  display_name: string;
  commission_rate: number;
  status: AgentStatus;
  negative_carry: number;
  notes: string | null;
  created_at: string;
  auth_user_id: string | null;
  agent_login_phone: string | null;
  parent_agent_id: string | null;
  agent_level: number;
  active_player_bonus_amount: number;
  max_commission_rate: number;
  max_active_player_bonus_amount: number;
  can_create_sub_agents: boolean;
};

type ParentAgent = {
  id: string;
  agent_code: string;
  display_name: string;
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function formatPercent(rate: number | string | null | undefined) {
  return (Number(rate || 0) * 100).toFixed(2).replace(/\.00$/, "");
}

function formatMMK(amount: number | string | null | undefined) {
  return `${new Intl.NumberFormat("en-US").format(Number(amount || 0))} MMK`;
}

function getAgentLevelLabel(level: number | null | undefined) {
  if (level === 1) return "Agent A";
  if (level === 2) return "Agent B";
  return "Agent";
}

function getStatusClass(status: AgentStatus) {
  if (status === "active") {
    return "border-emerald-400/25 bg-emerald-400/10 text-emerald-100";
  }

  if (status === "paused") {
    return "border-amber-400/25 bg-amber-400/10 text-amber-100";
  }

  return "border-red-400/25 bg-red-400/10 text-red-100";
}

function StatusBadge({ status }: { status: AgentStatus }) {
  return (
    <span
      className={cx(
        "inline-flex rounded-full border px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.14em]",
        getStatusClass(status)
      )}
    >
      {status}
    </span>
  );
}

function InfoCard({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-2xl border border-amber-300/12 bg-black/30 p-4">
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/35">
        {label}
      </p>
      <p className="mt-2 break-all text-lg font-black text-amber-100">
        {value || "—"}
      </p>
    </div>
  );
}

export default async function AdminAgentDetailPage({ params }: PageProps) {
  const { agentId } = await params;
  const supabase = await createClient();

  const { data: isAdmin, error: adminError } =
    await supabase.rpc("is_nagani_admin");

  if (adminError || !isAdmin) {
    redirect("/admin/login");
  }

  const { data: agentData, error: agentError } = await supabase
    .from("agent_profiles")
    .select(
      "id, agent_code, display_name, commission_rate, status, negative_carry, notes, created_at, auth_user_id, agent_login_phone, parent_agent_id, agent_level, active_player_bonus_amount, max_commission_rate, max_active_player_bonus_amount, can_create_sub_agents"
    )
    .eq("id", agentId)
    .maybeSingle();

  const agent = agentData as AgentProfile | null;

  if (agentError || !agent) {
    redirect("/admin/agents?error=Agent%20not%20found");
  }

  let parentAgent: ParentAgent | null = null;

  if (agent.parent_agent_id) {
    const { data } = await supabase
      .from("agent_profiles")
      .select("id, agent_code, display_name")
      .eq("id", agent.parent_agent_id)
      .maybeSingle();

    parentAgent = data as ParentAgent | null;
  }

  const parentLabel =
    agent.agent_level === 1
      ? "Primary Agent"
      : parentAgent
        ? `${parentAgent.display_name} (${parentAgent.agent_code})`
        : "No parent";

  return (
    <AdminShell
      title="Agent Control"
      eyebrow="Referral Partner"
      description="Simple agent control page for login, commission, status, and referral monitoring."
      action={
        <Link
          href="/admin/agents"
          className="rounded-full border border-amber-300/20 bg-amber-300/10 px-4 py-2 text-xs font-black text-amber-100/80 transition hover:bg-amber-300 hover:text-black"
        >
          Back to Agents
        </Link>
      }
    >
      <section className="rounded-2xl border border-amber-300/15 bg-black/35 p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.28em] text-amber-200/45">
              Agent
            </p>
            <h2 className="mt-2 text-3xl font-black text-amber-100">
              {agent.display_name}
            </h2>
            <p className="mt-2 text-sm font-bold text-white/50">
              {agent.agent_code} · {getAgentLevelLabel(agent.agent_level)}
            </p>
          </div>

          <StatusBadge status={agent.status} />
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          <InfoCard label="Phone" value={agent.agent_login_phone || "—"} />
          <InfoCard label="Parent" value={parentLabel} />
          <InfoCard label="Commission" value={`${formatPercent(agent.commission_rate)}%`} />
          <InfoCard label="Children Allowed" value={agent.can_create_sub_agents ? "Yes" : "No"} />
          <InfoCard label="Negative Carry" value={formatMMK(agent.negative_carry)} />
        </div>
      </section>

      <section className="mt-4 grid gap-4 xl:grid-cols-2">
        <form
          action={updateAgentAction}
          className="rounded-2xl border border-amber-300/15 bg-black/35 p-5"
        >
          <p className="text-[11px] font-black uppercase tracking-[0.24em] text-amber-200/45">
            Edit Agent
          </p>

          <input type="hidden" name="agent_id" value={agent.id} />

          <div className="mt-4 grid gap-4">
            <label>
              <span className="text-[10px] font-black uppercase tracking-[0.16em] text-white/40">
                Display Name
              </span>
              <input
                name="display_name"
                required
                defaultValue={agent.display_name}
                className="mt-2 w-full rounded-xl border border-amber-300/15 bg-black/45 px-4 py-3 text-sm font-bold text-amber-50 outline-none focus:border-amber-300/45"
              />
            </label>

            <label>
              <span className="text-[10px] font-black uppercase tracking-[0.16em] text-white/40">
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
                className="mt-2 w-full rounded-xl border border-amber-300/15 bg-black/45 px-4 py-3 text-sm font-bold text-amber-50 outline-none focus:border-amber-300/45"
              />
            </label>

            <label>
              <span className="text-[10px] font-black uppercase tracking-[0.16em] text-white/40">
                Status
              </span>
              <select
                name="status"
                defaultValue={agent.status}
                className="mt-2 w-full rounded-xl border border-amber-300/15 bg-black/45 px-4 py-3 text-sm font-bold text-amber-50 outline-none focus:border-amber-300/45"
              >
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="disabled">Disabled</option>
              </select>
            </label>

            <label>
              <span className="text-[10px] font-black uppercase tracking-[0.16em] text-white/40">
                Notes
              </span>
              <input
                name="notes"
                defaultValue={agent.notes ?? ""}
                placeholder="Optional"
                className="mt-2 w-full rounded-xl border border-amber-300/15 bg-black/45 px-4 py-3 text-sm font-bold text-amber-50 outline-none placeholder:text-white/25 focus:border-amber-300/45"
              />
            </label>
          </div>

          <button
            type="submit"
            className="mt-5 w-full rounded-xl border border-amber-300/30 bg-amber-300 px-4 py-3 text-sm font-black text-black transition hover:bg-amber-200"
          >
            Save Agent Changes
          </button>
        </form>

        <section className="grid gap-4">
          <form
            action={createAgentLoginAction}
            className="rounded-2xl border border-emerald-300/15 bg-emerald-950/10 p-5"
          >
            <p className="text-[11px] font-black uppercase tracking-[0.24em] text-emerald-100/45">
              Login Control
            </p>

            <input type="hidden" name="agent_id" value={agent.id} />
            <input type="hidden" name="agent_code" value={agent.agent_code} />
            <input
              type="hidden"
              name="auth_user_id"
              value={agent.auth_user_id ?? ""}
            />

            <div className="mt-4 grid gap-4">
              <label>
                <span className="text-[10px] font-black uppercase tracking-[0.16em] text-white/40">
                  Login Phone
                </span>
                <input
                  name="phone_number"
                  required
                  defaultValue={agent.agent_login_phone ?? ""}
                  placeholder="09957117174"
                  className="mt-2 w-full rounded-xl border border-emerald-300/15 bg-black/45 px-4 py-3 text-sm font-bold text-amber-50 outline-none placeholder:text-white/25 focus:border-emerald-300/45"
                />
              </label>

              <label>
                <span className="text-[10px] font-black uppercase tracking-[0.16em] text-white/40">
                  New Password
                </span>
                <input
                  name="password"
                  required
                  type="password"
                  minLength={6}
                  placeholder="Minimum 6 characters"
                  className="mt-2 w-full rounded-xl border border-emerald-300/15 bg-black/45 px-4 py-3 text-sm font-bold text-amber-50 outline-none placeholder:text-white/25 focus:border-emerald-300/45"
                />
              </label>
            </div>

            <button
              type="submit"
              className="mt-5 w-full rounded-xl border border-emerald-300/25 bg-emerald-300/12 px-4 py-3 text-sm font-black text-emerald-100 transition hover:bg-emerald-300 hover:text-black"
            >
              Reset Login
            </button>
          </form>

          <div className="rounded-2xl border border-white/10 bg-black/35 p-5">
            <p className="text-[11px] font-black uppercase tracking-[0.24em] text-white/35">
              Quick Actions
            </p>

            <div className="mt-4 grid gap-3">
              <Link
                href="/admin/referrals"
                className="rounded-xl border border-amber-300/20 bg-amber-300/10 px-4 py-3 text-center text-sm font-black text-amber-100/85 transition hover:bg-amber-300 hover:text-black"
              >
                Open Referrals
              </Link>

              {agent.status === "active" ? (
                <form action={pauseAgentAction}>
                  <input type="hidden" name="agent_id" value={agent.id} />
                  <button
                    type="submit"
                    className="w-full rounded-xl border border-amber-300/20 bg-amber-300/10 px-4 py-3 text-sm font-black uppercase tracking-[0.14em] text-amber-100 transition hover:bg-amber-300/20"
                  >
                    Pause Agent
                  </button>
                </form>
              ) : (
                <form action={activateAgentAction}>
                  <input type="hidden" name="agent_id" value={agent.id} />
                  <button
                    type="submit"
                    className="w-full rounded-xl border border-emerald-300/20 bg-emerald-300/10 px-4 py-3 text-sm font-black uppercase tracking-[0.14em] text-emerald-100 transition hover:bg-emerald-300/20"
                  >
                    Activate Agent
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>
      </section>
    </AdminShell>
  );
}