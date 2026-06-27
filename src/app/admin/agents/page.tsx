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

const PAGE_SIZE = 25;
const SEARCH_LOAD_LIMIT = 300;

type AgentStatus = "active" | "paused" | "disabled";
type StatusFilter = AgentStatus | "all";

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
  max_commission_rate: number;
  active_player_bonus_amount: number;
  max_active_player_bonus_amount: number;
  can_create_sub_agents: boolean;
};

type AgentParentLite = Pick<AgentProfile, "id" | "agent_code" | "display_name">;

type AgentHierarchyLite = Pick<AgentProfile, "id" | "parent_agent_id">;

type AdminAgentsPageProps = {
  searchParams?: Promise<{
    success?: string;
    error?: string;
    status?: string;
    q?: string;
    page?: string;
  }>;
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function parseStatusFilter(value?: string): StatusFilter {
  if (
    value === "all" ||
    value === "active" ||
    value === "paused" ||
    value === "disabled"
  ) {
    return value;
  }

  return "all";
}

function parsePage(value?: string) {
  const parsedPage = Number(value ?? 1);
  return Number.isFinite(parsedPage) && parsedPage > 0
    ? Math.floor(parsedPage)
    : 1;
}

function formatPercent(rate: number | string | null | undefined) {
  return (Number(rate || 0) * 100).toFixed(2).replace(/\.00$/, "");
}

function formatMMK(amount: number | string | null | undefined) {
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

function getAgentLevelLabel(level: number | null | undefined) {
  if (level === 1) return "Agent A";
  if (level === 2) return "Agent B";
  return "Agent";
}

function getParentAgentLabel(
  agent: AgentProfile,
  parentAgentById: Map<string, AgentParentLite>
) {
  if (agent.agent_level === 1) return "Primary Agent";

  if (!agent.parent_agent_id) return "No parent";

  const parent = parentAgentById.get(agent.parent_agent_id);

  if (!parent) return "Parent not found";

  return `${parent.display_name} (${parent.agent_code})`;
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

function buildHref(params: {
  status: StatusFilter;
  q: string;
  page: number;
  next?: Partial<{
    status: StatusFilter;
    q: string;
    page: number;
  }>;
}) {
  const nextStatus = params.next?.status ?? params.status;
  const nextQ = params.next?.q ?? params.q;
  const nextPage = params.next?.page ?? params.page;

  const searchParams = new URLSearchParams();
  searchParams.set("status", nextStatus);

  if (nextQ.trim()) {
    searchParams.set("q", nextQ.trim());
  }

  if (nextPage > 1) {
    searchParams.set("page", String(nextPage));
  }

  return `/admin/agents?${searchParams.toString()}`;
}

function matchesSearch(agent: AgentProfile, searchTerm: string) {
  const target = searchTerm.trim().toLowerCase();
  if (!target) return true;

const searchableText = [
  agent.id,
  agent.agent_code,
  agent.display_name,
  agent.status,
  agent.agent_login_phone,
  agent.notes,
  agent.parent_agent_id,
  String(agent.agent_level),
  String(agent.commission_rate),
  String(agent.negative_carry),
  String(agent.active_player_bonus_amount),
  String(agent.max_commission_rate),
  String(agent.max_active_player_bonus_amount),
]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return searchableText.includes(target);
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

function LoginBadge({ agent }: { agent: AgentProfile }) {
  return (
    <span
      className={cx(
        "inline-flex rounded-full border px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.14em]",
        agent.auth_user_id
          ? "border-emerald-300/25 bg-emerald-400/10 text-emerald-100"
          : "border-amber-300/25 bg-amber-400/10 text-amber-100"
      )}
    >
      {agent.auth_user_id ? "Ready" : "No Login"}
    </span>
  );
}

function StatCard({
  label,
  value,
  sub,
  tone,
}: {
  label: string;
  value: string | number;
  sub?: string;
  tone: "amber" | "emerald" | "red" | "neutral";
}) {
  return (
    <div
      className={cx(
        "rounded-2xl border p-4 text-center",
        tone === "amber" && "border-amber-300/15 bg-amber-300/10",
        tone === "emerald" && "border-emerald-300/15 bg-emerald-400/10",
        tone === "red" && "border-red-300/15 bg-red-400/10",
        tone === "neutral" && "border-white/10 bg-white/[0.03]"
      )}
    >
      <p className="text-[11px] font-black uppercase tracking-[0.2em] text-white/45">
        {label}
      </p>
      <p className="mt-2 text-2xl font-black text-amber-100">{value}</p>
      {sub ? <p className="mt-1 text-xs font-bold text-white/45">{sub}</p> : null}
    </div>
  );
}

function AgentControls({ agent }: { agent: AgentProfile }) {
  return (
    <Link
      href={`/admin/agents/${agent.id}`}
      className="inline-flex w-full items-center justify-center rounded-md border border-amber-300/20 bg-amber-300/10 px-4 py-2 text-xs font-black text-amber-100/85 transition hover:border-amber-300/45 hover:bg-amber-300/15 hover:text-amber-50"
    >
      Open
    </Link>
  );
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

  const statusFilter = parseStatusFilter(params.status);
  const searchTerm = String(params.q ?? "").trim();
  const page = parsePage(params.page);
  const offset = (page - 1) * PAGE_SIZE;

  let listQuery = supabase
    .from("agent_profiles")
.select(
  "id, agent_code, display_name, commission_rate, status, negative_carry, notes, created_at, auth_user_id, agent_login_phone, parent_agent_id, agent_level, max_commission_rate, active_player_bonus_amount, max_active_player_bonus_amount, can_create_sub_agents",
  { count: "exact" }
)
    .order("created_at", { ascending: false });

  if (statusFilter !== "all") {
    listQuery = listQuery.eq("status", statusFilter);
  }

const [
  allCountResult,
  activeCountResult,
  pausedCountResult,
  disabledCountResult,
  negativeCarryResult,
  parentAgentsResult,
  hierarchyResult,
  agentResult,
] = await Promise.all([
    supabase.from("agent_profiles").select("id", { count: "exact", head: true }),

    supabase
      .from("agent_profiles")
      .select("id", { count: "exact", head: true })
      .eq("status", "active"),

    supabase
      .from("agent_profiles")
      .select("id", { count: "exact", head: true })
      .eq("status", "paused"),

    supabase
      .from("agent_profiles")
      .select("id", { count: "exact", head: true })
      .eq("status", "disabled"),

supabase
  .from("agent_profiles")
  .select("negative_carry")
  .limit(1000)
  .returns<Pick<AgentProfile, "negative_carry">[]>(),

supabase
  .from("agent_profiles")
  .select("id, agent_code, display_name")
  .eq("agent_level", 1)
  .limit(1000)
  .returns<AgentParentLite[]>(),

supabase
  .from("agent_profiles")
  .select("id, parent_agent_id")
  .limit(1000)
  .returns<AgentHierarchyLite[]>(),

searchTerm
  ? listQuery.limit(SEARCH_LOAD_LIMIT).returns<AgentProfile[]>()
  : listQuery.range(offset, offset + PAGE_SIZE - 1).returns<AgentProfile[]>(),
  ]);

  const loadedAgents = agentResult.data ?? [];
  const matchedAgents = searchTerm
    ? loadedAgents.filter((agent) => matchesSearch(agent, searchTerm))
    : loadedAgents;

  const visibleAgents = searchTerm
    ? matchedAgents.slice(offset, offset + PAGE_SIZE)
    : matchedAgents;

  const totalCount = searchTerm
    ? matchedAgents.length
    : agentResult.count ?? visibleAgents.length;

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const hasPreviousPage = page > 1;
  const hasNextPage = page < totalPages;

  const totalNegativeCarry = (negativeCarryResult.data ?? []).reduce(
    (sum, agent) => sum + Number(agent.negative_carry || 0),
    0
  );

  const parentAgentById = new Map(
  (parentAgentsResult.data ?? []).map((agent) => [agent.id, agent])
);

const childCountByParentId = new Map<string, number>();

for (const agent of hierarchyResult.data ?? []) {
  if (!agent.parent_agent_id) continue;

  childCountByParentId.set(
    agent.parent_agent_id,
    (childCountByParentId.get(agent.parent_agent_id) ?? 0) + 1
  );
}

  const errors = [
    agentResult.error ? `Agents: ${agentResult.error.message}` : null,
    allCountResult.error ? `All count: ${allCountResult.error.message}` : null,
    activeCountResult.error
      ? `Active count: ${activeCountResult.error.message}`
      : null,
    pausedCountResult.error
      ? `Paused count: ${pausedCountResult.error.message}`
      : null,
    disabledCountResult.error
      ? `Disabled count: ${disabledCountResult.error.message}`
      : null,
    negativeCarryResult.error
      ? `Negative carry: ${negativeCarryResult.error.message}`
      : null,
   parentAgentsResult.error
  ? `Parent agents: ${parentAgentsResult.error.message}`
  : null,
hierarchyResult.error
  ? `Agent hierarchy: ${hierarchyResult.error.message}`
  : null,
  ].filter((item): item is string => Boolean(item));

  const statusTabs: Array<{ label: string; value: StatusFilter; count: number }> =
    [
      { label: "All", value: "all", count: allCountResult.count ?? 0 },
      { label: "Active", value: "active", count: activeCountResult.count ?? 0 },
      { label: "Paused", value: "paused", count: pausedCountResult.count ?? 0 },
      {
        label: "Disabled",
        value: "disabled",
        count: disabledCountResult.count ?? 0,
      },
    ];

  return (
    <AdminShell
      title="Agents"
      eyebrow="Referral Partners"
      description="Ledger-style agent control with clean search, status filters, login control, and compact edit actions."
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

      {errors.length > 0 ? (
        <section className="rounded-2xl border border-red-400/25 bg-red-950/25 p-4">
          <p className="text-sm font-black text-red-100">
            Agent page warning
          </p>

          <div className="mt-2 space-y-1">
            {errors.map((item) => (
              <p key={item} className="text-xs font-semibold text-red-100/70">
                {item}
              </p>
            ))}
          </div>
        </section>
      ) : null}

      <section className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard
          label="Total Agents"
          value={allCountResult.count ?? 0}
          tone="amber"
        />
        <StatCard
          label="Active"
          value={activeCountResult.count ?? 0}
          tone="emerald"
        />
        <StatCard
          label="Paused"
          value={pausedCountResult.count ?? 0}
          tone="amber"
        />
        <StatCard
          label="Disabled"
          value={disabledCountResult.count ?? 0}
          tone="red"
        />
        <StatCard
          label="Negative Carry"
          value={formatMMK(totalNegativeCarry)}
          tone="neutral"
        />
      </section>

      <section className="mt-4 rounded-2xl border border-amber-300/12 bg-black/35 p-4">
        <details>
          <summary className="cursor-pointer list-none">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.28em] text-amber-200/45">
                  Create Agent
                </p>
                <h2 className="mt-1 text-xl font-black text-amber-100">
                  New Referral Partner
                </h2>
              </div>

              <span className="rounded-full border border-amber-300/20 bg-amber-300/10 px-4 py-2 text-xs font-black text-amber-100/80">
                Open Create Form
              </span>
            </div>
          </summary>

          <form
            action={createAgentAction}
            className="mt-4 grid gap-3 border-t border-white/10 pt-4 lg:grid-cols-7"
          >
            <label>
              <span className="text-[11px] font-black uppercase tracking-[0.18em] text-white/40">
                Agent Code
              </span>
<input
  name="agent_code"
  required
  autoCapitalize="characters"
  autoComplete="off"
  spellCheck={false}
  placeholder="AGENT001"
  className="mt-2 w-full rounded-xl border border-amber-300/15 bg-black/35 px-4 py-3 text-sm font-black uppercase tracking-[0.08em] text-amber-50 outline-none placeholder:text-white/25 focus:border-amber-300/40"
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
        </details>
      </section>

      <section className="mt-4 rounded-2xl border border-amber-300/12 bg-black/35 p-4">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.28em] text-amber-200/45">
              Agent Control Ledger
            </p>
            <h2 className="mt-1 text-xl font-black text-amber-100">
              Manage Partners
            </h2>
          </div>

          <form
            action="/admin/agents"
            className="flex w-full flex-col gap-2 sm:flex-row xl:max-w-xl"
          >
            <input type="hidden" name="status" value={statusFilter} />

            <input
              name="q"
              defaultValue={searchTerm}
              placeholder="Search agent, code, phone, notes..."
              className="min-w-0 flex-1 rounded-full border border-white/10 bg-black/45 px-4 py-2 text-sm font-bold text-amber-50 outline-none placeholder:text-white/25 focus:border-amber-300/35"
            />

            <button
              type="submit"
              className="rounded-full border border-amber-300/25 bg-amber-300/12 px-5 py-2 text-xs font-black text-amber-100 transition hover:bg-amber-300 hover:text-black"
            >
              Search
            </button>

            {searchTerm ? (
              <Link
                href={buildHref({
                  status: statusFilter,
                  q: "",
                  page: 1,
                  next: { q: "", page: 1 },
                })}
                className="rounded-full border border-white/10 bg-black/25 px-5 py-2 text-center text-xs font-black text-white/45 transition hover:text-amber-100"
              >
                Clear
              </Link>
            ) : null}
          </form>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {statusTabs.map((tab) => (
            <Link
              key={tab.value}
              href={buildHref({
                status: statusFilter,
                q: searchTerm,
                page,
                next: { status: tab.value, page: 1 },
              })}
              className={cx(
                "rounded-full border px-4 py-2 text-xs font-black transition",
                statusFilter === tab.value
                  ? "border-amber-300/35 bg-amber-300/18 text-amber-100"
                  : "border-white/10 bg-black/25 text-white/45 hover:border-amber-300/25 hover:text-amber-100"
              )}
            >
              {tab.label}
              <span className="ml-2 text-white/45">{tab.count}</span>
            </Link>
          ))}
        </div>

        <div className="mt-4 overflow-hidden rounded-xl border border-amber-300/15 bg-[#050202]">
          <div className="overflow-x-auto">
<table className="w-full min-w-[1280px] border-collapse text-sm">
<colgroup>
  <col className="w-[170px]" />
  <col className="w-[135px]" />
  <col className="w-[170px]" />
  <col className="w-[135px]" />
  <col className="w-[130px]" />
  <col className="w-[120px]" />
  <col className="w-[105px]" />
  <col className="w-[105px]" />
  <col className="w-[130px]" />
  <col className="w-[180px]" />
</colgroup>

<thead>
  <tr className="bg-[#24100b] text-[10px] font-black uppercase tracking-[0.16em] text-amber-100/70">
    <th className="border-b border-r border-amber-300/15 px-4 py-4 text-left">
      Agent
    </th>
    <th className="border-b border-r border-amber-300/15 px-4 py-4 text-left">
      Phone
    </th>
    <th className="border-b border-r border-amber-300/15 px-4 py-4 text-left">
      Parent
    </th>
    <th className="border-b border-r border-amber-300/15 px-4 py-4 text-left">
      Code
    </th>
    <th className="border-b border-r border-amber-300/15 px-4 py-4 text-center">
      Level
    </th>
    <th className="border-b border-r border-amber-300/15 px-4 py-4 text-center">
      Status
    </th>
    <th className="border-b border-r border-amber-300/15 px-4 py-4 text-right">
      Rate
    </th>
    <th className="border-b border-r border-amber-300/15 px-4 py-4 text-center">
      Children
    </th>
    <th className="border-b border-r border-amber-300/15 px-4 py-4 text-center">
      Created
    </th>
    <th className="border-b border-amber-300/15 px-4 py-4 text-center">
      Control
    </th>
  </tr>
</thead>

              <tbody>
                {visibleAgents.length === 0 ? (
                  <tr>
                    <td
                      colSpan={10}
                      className="px-4 py-8 text-center text-sm font-bold text-white/45"
                    >
                      No agents match this view.
                    </td>
                  </tr>
                ) : null}

{visibleAgents.map((agent) => (
  <tr
    key={agent.id}
    tabIndex={0}
    aria-label={`Select agent ${agent.display_name}`}
    className="group cursor-pointer border-b border-white/[0.06] bg-black/[0.16] outline-none transition hover:bg-amber-300/[0.045] focus:bg-amber-300/[0.09] active:bg-amber-300/[0.12]"
  >
    <td className="border-r border-white/[0.05] px-4 py-3 text-left">
<p className="font-black text-amber-100">
  {agent.display_name}
</p>
    </td>

    <td className="border-r border-white/[0.05] px-4 py-3 text-left">
      <p className="break-all font-black text-white/72">
        {agent.agent_login_phone || "—"}
      </p>
      <LoginBadge agent={agent} />
    </td>

    <td className="border-r border-white/[0.05] px-4 py-3 text-left">
      <p className="font-bold text-white/58">
        {getParentAgentLabel(agent, parentAgentById)}
      </p>
    </td>

    <td className="border-r border-white/[0.05] px-4 py-3 text-left font-black text-amber-100/85">
      {agent.agent_code}
    </td>

    <td className="border-r border-white/[0.05] px-4 py-3 text-center">
      <p className="font-black text-amber-100">
        {getAgentLevelLabel(agent.agent_level)}
      </p>
    </td>

    <td className="border-r border-white/[0.05] px-4 py-3 text-center">
      <StatusBadge status={agent.status} />
    </td>

    <td className="border-r border-white/[0.05] px-4 py-3 text-right font-black tabular-nums text-amber-100">
      {formatPercent(agent.commission_rate)}%
    </td>

    <td className="border-r border-white/[0.05] px-4 py-3 text-center font-black tabular-nums text-amber-100">
      {childCountByParentId.get(agent.id) ?? 0}
    </td>

    <td className="border-r border-white/[0.05] px-4 py-3 text-center font-bold tabular-nums text-white/48 group-focus:text-white/75">
      {formatDate(agent.created_at)}
    </td>

    <td className="px-4 py-3 text-center">
      <AgentControls agent={agent} />
    </td>
  </tr>
))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-center text-xs font-bold text-white/40 sm:text-left">
            Page {page} of {totalPages} · {totalCount} result
            {totalCount === 1 ? "" : "s"}
          </p>

          <div className="flex items-center justify-center gap-2">
            {hasPreviousPage ? (
              <Link
                href={buildHref({
                  status: statusFilter,
                  q: searchTerm,
                  page,
                  next: { page: page - 1 },
                })}
                className="rounded-full border border-white/10 bg-black/25 px-5 py-2 text-xs font-black text-white/55 transition hover:border-amber-300/25 hover:text-amber-100"
              >
                Previous
              </Link>
            ) : (
              <span className="rounded-full border border-white/5 bg-black/20 px-5 py-2 text-xs font-black text-white/20">
                Previous
              </span>
            )}

            {hasNextPage ? (
              <Link
                href={buildHref({
                  status: statusFilter,
                  q: searchTerm,
                  page,
                  next: { page: page + 1 },
                })}
                className="rounded-full border border-amber-300/25 bg-amber-300/12 px-5 py-2 text-xs font-black text-amber-100 transition hover:bg-amber-300 hover:text-black"
              >
                Next
              </Link>
            ) : (
              <span className="rounded-full border border-white/5 bg-black/20 px-5 py-2 text-xs font-black text-white/20">
                Next
              </span>
            )}
          </div>
        </div>
      </section>
    </AdminShell>
  );
}