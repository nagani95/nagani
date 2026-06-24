//src/app/admin/agent-withdraws/page.tsx

import Link from "next/link";
import { redirect } from "next/navigation";

import AdminShell from "@/components/admin/AdminShell";
import { createClient } from "@/lib/supabase/server";
import { reviewAgentWithdrawAction } from "./actions";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 25;
const SEARCH_LOAD_LIMIT = 300;

type AgentWithdrawStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "paid"
  | "cancelled";

type StatusFilter = AgentWithdrawStatus | "all";

type AdminAgentWithdrawsPageProps = {
  searchParams?: Promise<{
    success?: string;
    error?: string;
    status?: string;
    q?: string;
    page?: string;
  }>;
};

type AgentJoin = {
  id: string;
  agent_code: string;
  display_name: string;
  agent_level: number;
  status: string;
  commission_rate: number;
};

type RawWithdrawRequest = {
  id: string;
  agent_id: string;
  amount: number | string;
  payment_provider_key: string | null;
  payment_provider_name: string | null;
  payment_account_name: string | null;
  payment_account_number: string | null;
  note: string | null;
  status: AgentWithdrawStatus;
  admin_note: string | null;
  reviewed_at: string | null;
  created_at: string;
  updated_at: string;
  agent_profiles: AgentJoin | AgentJoin[] | null;
};

type WithdrawRequest = Omit<RawWithdrawRequest, "agent_profiles"> & {
  agent_profiles: AgentJoin | null;
};

const AGENT_WITHDRAW_SELECT = `
  id,
  agent_id,
  amount,
  payment_provider_key,
  payment_provider_name,
  payment_account_name,
  payment_account_number,
  note,
  status,
  admin_note,
  reviewed_at,
  created_at,
  updated_at,
  agent_profiles (
    id,
    agent_code,
    display_name,
    agent_level,
    status,
    commission_rate
  )
`;

function normalizeAgent(agentProfiles: RawWithdrawRequest["agent_profiles"]) {
  if (Array.isArray(agentProfiles)) {
    return agentProfiles[0] ?? null;
  }

  return agentProfiles;
}

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function parseStatusFilter(value?: string): StatusFilter {
  if (
    value === "all" ||
    value === "pending" ||
    value === "approved" ||
    value === "paid" ||
    value === "rejected" ||
    value === "cancelled"
  ) {
    return value;
  }

  return "pending";
}

function parsePage(value?: string) {
  const parsedPage = Number(value ?? 1);
  return Number.isFinite(parsedPage) && parsedPage > 0
    ? Math.floor(parsedPage)
    : 1;
}

function formatMMK(value: number | string | null | undefined) {
  const amount = Number(value ?? 0);

  return `${new Intl.NumberFormat("en-US").format(
    Number.isFinite(amount) ? amount : 0
  )} MMK`;
}

function formatPercent(value: number | string | null | undefined) {
  const amount = Number(value ?? 0);
  return `${(amount * 100).toFixed(2).replace(/\.00$/, "")}%`;
}

function formatDate(value: string | null | undefined) {
  if (!value) return "-";

  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Yangon",
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function getStatusClass(status: AgentWithdrawStatus) {
  if (status === "pending") {
    return "border-amber-300/25 bg-amber-400/10 text-amber-100";
  }

  if (status === "approved") {
    return "border-sky-300/25 bg-sky-400/10 text-sky-100";
  }

  if (status === "paid") {
    return "border-emerald-300/25 bg-emerald-400/10 text-emerald-100";
  }

  if (status === "rejected") {
    return "border-red-300/25 bg-red-400/10 text-red-100";
  }

  return "border-white/10 bg-white/[0.03] text-white/45";
}

function getAgentLevelLabel(level: number | null | undefined) {
  if (level === 1) return "Primary";
  if (level === 2) return "Sub";
  return "Agent";
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

  return `/admin/agent-withdraws?${searchParams.toString()}`;
}

function matchesSearch(request: WithdrawRequest, searchTerm: string) {
  const target = searchTerm.trim().toLowerCase();
  if (!target) return true;

  const agent = request.agent_profiles;

  const searchableText = [
    request.id,
    request.agent_id,
    request.status,
    request.amount,
    request.payment_provider_key,
    request.payment_provider_name,
    request.payment_account_name,
    request.payment_account_number,
    request.note,
    request.admin_note,
    agent?.agent_code,
    agent?.display_name,
    agent?.agent_level,
    agent?.status,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return searchableText.includes(target);
}

function StatusBadge({ status }: { status: AgentWithdrawStatus }) {
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

function StatCard({
  label,
  value,
  sub,
  tone,
}: {
  label: string;
  value: string | number;
  sub?: string;
  tone: "amber" | "sky" | "emerald" | "red";
}) {
  return (
    <div
      className={cx(
        "rounded-2xl border p-4 text-center",
        tone === "amber" && "border-amber-300/15 bg-amber-300/10",
        tone === "sky" && "border-sky-300/15 bg-sky-400/10",
        tone === "emerald" && "border-emerald-300/15 bg-emerald-400/10",
        tone === "red" && "border-red-300/15 bg-red-400/10"
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

function ReviewButton({
  requestId,
  action,
  label,
  tone,
}: {
  requestId: string;
  action: "approve" | "reject" | "paid";
  label: string;
  tone: "gold" | "red" | "green";
}) {
  const buttonClass =
    tone === "red"
      ? "border-red-300/25 bg-red-400/10 text-red-100 hover:bg-red-300 hover:text-black"
      : tone === "green"
        ? "border-emerald-300/25 bg-emerald-400/10 text-emerald-100 hover:bg-emerald-300 hover:text-black"
        : "border-amber-300/25 bg-amber-300/15 text-amber-100 hover:bg-amber-300 hover:text-black";

  return (
    <details>
      <summary
        className={cx(
          "cursor-pointer list-none rounded-md border px-3 py-2 text-xs font-black transition",
          buttonClass
        )}
      >
        {label}
      </summary>

      <form
        action={reviewAgentWithdrawAction}
        className="mt-2 grid min-w-[190px] gap-2 rounded-xl border border-amber-300/15 bg-[#120504] p-2"
      >
        <input type="hidden" name="request_id" value={requestId} />
        <input type="hidden" name="action" value={action} />

        <input
          name="admin_note"
          placeholder="Admin note"
          className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-xs font-bold text-amber-50 outline-none placeholder:text-white/25 focus:border-amber-300/40"
        />

        <button
          type="submit"
          className={cx(
            "rounded-md border px-3 py-2 text-xs font-black transition",
            buttonClass
          )}
        >
          Confirm
        </button>
      </form>
    </details>
  );
}

function ActionCell({ request }: { request: WithdrawRequest }) {
  if (request.status === "pending") {
    return (
      <div className="flex flex-wrap items-center justify-center gap-2">
        <form action={reviewAgentWithdrawAction}>
          <input type="hidden" name="request_id" value={request.id} />
          <input type="hidden" name="action" value="approve" />
          <input type="hidden" name="admin_note" value="" />

          <button
            type="submit"
            className="rounded-md border border-amber-300/25 bg-amber-300/15 px-3 py-2 text-xs font-black text-amber-100 transition hover:bg-amber-300 hover:text-black"
          >
            Approve
          </button>
        </form>

        <ReviewButton
          requestId={request.id}
          action="reject"
          label="Reject"
          tone="red"
        />
      </div>
    );
  }

  if (request.status === "approved") {
    return (
      <div className="flex flex-wrap items-center justify-center gap-2">
        <form action={reviewAgentWithdrawAction}>
          <input type="hidden" name="request_id" value={request.id} />
          <input type="hidden" name="action" value="paid" />
          <input type="hidden" name="admin_note" value="" />

          <button
            type="submit"
            className="rounded-md border border-emerald-300/25 bg-emerald-400/10 px-3 py-2 text-xs font-black text-emerald-100 transition hover:bg-emerald-300 hover:text-black"
          >
            Mark Paid
          </button>
        </form>

        <ReviewButton
          requestId={request.id}
          action="reject"
          label="Reject"
          tone="red"
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-1">
      <StatusBadge status={request.status} />
      <p className="text-[10px] font-bold text-white/35">
        {formatDate(request.reviewed_at)}
      </p>
    </div>
  );
}

export default async function AdminAgentWithdrawsPage({
  searchParams,
}: AdminAgentWithdrawsPageProps) {
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
    .from("agent_withdraw_requests")
    .select(AGENT_WITHDRAW_SELECT, { count: "exact" })
    .order("created_at", { ascending: false });

  if (statusFilter !== "all") {
    listQuery = listQuery.eq("status", statusFilter);
  }

  const [
    allCountResult,
    pendingCountResult,
    approvedCountResult,
    paidCountResult,
    rejectedCountResult,
    amountResult,
    requestResult,
  ] = await Promise.all([
    supabase
      .from("agent_withdraw_requests")
      .select("id", { count: "exact", head: true }),

    supabase
      .from("agent_withdraw_requests")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending"),

    supabase
      .from("agent_withdraw_requests")
      .select("id", { count: "exact", head: true })
      .eq("status", "approved"),

    supabase
      .from("agent_withdraw_requests")
      .select("id", { count: "exact", head: true })
      .eq("status", "paid"),

    supabase
      .from("agent_withdraw_requests")
      .select("id", { count: "exact", head: true })
      .eq("status", "rejected"),

    supabase
      .from("agent_withdraw_requests")
      .select("status, amount")
      .limit(1000)
      .returns<Pick<WithdrawRequest, "status" | "amount">[]>(),

    searchTerm
      ? listQuery.limit(SEARCH_LOAD_LIMIT).returns<RawWithdrawRequest[]>()
      : listQuery
          .range(offset, offset + PAGE_SIZE - 1)
          .returns<RawWithdrawRequest[]>(),
  ]);

  const loadedRequests = (requestResult.data ?? []).map((request) => ({
    ...request,
    agent_profiles: normalizeAgent(request.agent_profiles),
  })) as WithdrawRequest[];

  const matchedRequests = searchTerm
    ? loadedRequests.filter((request) => matchesSearch(request, searchTerm))
    : loadedRequests;

  const visibleRequests = searchTerm
    ? matchedRequests.slice(offset, offset + PAGE_SIZE)
    : matchedRequests;

  const totalCount = searchTerm
    ? matchedRequests.length
    : requestResult.count ?? visibleRequests.length;

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const hasPreviousPage = page > 1;
  const hasNextPage = page < totalPages;

  const amountRows = amountResult.data ?? [];

  const pendingAmount = amountRows
    .filter((request) => request.status === "pending")
    .reduce((sum, request) => sum + Number(request.amount || 0), 0);

  const approvedAmount = amountRows
    .filter((request) => request.status === "approved")
    .reduce((sum, request) => sum + Number(request.amount || 0), 0);

  const paidAmount = amountRows
    .filter((request) => request.status === "paid")
    .reduce((sum, request) => sum + Number(request.amount || 0), 0);

  const errors = [
    requestResult.error ? `Agent withdraws: ${requestResult.error.message}` : null,
    allCountResult.error ? `All count: ${allCountResult.error.message}` : null,
    pendingCountResult.error
      ? `Pending count: ${pendingCountResult.error.message}`
      : null,
    approvedCountResult.error
      ? `Approved count: ${approvedCountResult.error.message}`
      : null,
    paidCountResult.error ? `Paid count: ${paidCountResult.error.message}` : null,
    rejectedCountResult.error
      ? `Rejected count: ${rejectedCountResult.error.message}`
      : null,
    amountResult.error ? `Amount totals: ${amountResult.error.message}` : null,
  ].filter((item): item is string => Boolean(item));

  const statusTabs: Array<{
    label: string;
    value: StatusFilter;
    count: number;
  }> = [
    { label: "Pending", value: "pending", count: pendingCountResult.count ?? 0 },
    {
      label: "Approved",
      value: "approved",
      count: approvedCountResult.count ?? 0,
    },
    { label: "Paid", value: "paid", count: paidCountResult.count ?? 0 },
    {
      label: "Rejected",
      value: "rejected",
      count: rejectedCountResult.count ?? 0,
    },
    { label: "All", value: "all", count: allCountResult.count ?? 0 },
  ];

  return (
    <AdminShell
      title="Agent Withdraws"
      eyebrow="Agent Cashout Control"
      description="Ledger-style agent withdrawal queue with paging, search, approval, rejection, and paid confirmation."
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
        <section className="rounded-2xl border border-red-400/25 bg-red-950/25 p-4">
          <p className="text-sm font-black text-red-100">
            Agent withdraw warning
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

      <section className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Pending"
          value={pendingCountResult.count ?? 0}
          sub={formatMMK(pendingAmount)}
          tone="amber"
        />

        <StatCard
          label="Approved"
          value={approvedCountResult.count ?? 0}
          sub={formatMMK(approvedAmount)}
          tone="sky"
        />

        <StatCard
          label="Paid"
          value={paidCountResult.count ?? 0}
          sub={formatMMK(paidAmount)}
          tone="emerald"
        />

        <StatCard
          label="Rejected"
          value={rejectedCountResult.count ?? 0}
          tone="red"
        />
      </section>

      <section className="mt-4 rounded-2xl border border-amber-300/12 bg-black/35 p-4">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.28em] text-amber-200/45">
              Agent Cashout Ledger
            </p>
            <h2 className="mt-1 text-xl font-black text-amber-100">
              Withdraw Queue
            </h2>
          </div>

          <form
            action="/admin/agent-withdraws"
            className="flex w-full flex-col gap-2 sm:flex-row xl:max-w-xl"
          >
            <input type="hidden" name="status" value={statusFilter} />

            <input
              name="q"
              defaultValue={searchTerm}
              placeholder="Search agent, code, provider, account..."
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
      </section>

      <section className="mt-4 rounded-2xl border border-amber-300/12 bg-black/30 p-4">
        <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.28em] text-white/35">
              Request Table
            </p>
            <h3 className="mt-1 text-lg font-black text-amber-100">
              Agent Withdraw Requests
            </h3>
          </div>

          <p className="rounded-full border border-white/10 bg-black/30 px-4 py-2 text-xs font-black text-white/50">
            Page {page} / {totalPages} · {totalCount} result
            {totalCount === 1 ? "" : "s"}
          </p>
        </div>

        <div className="overflow-hidden rounded-xl border border-amber-300/15 bg-[#050202]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1380px] border-collapse text-sm">
              <colgroup>
                <col className="w-[150px]" />
                <col className="w-[170px]" />
                <col className="w-[115px]" />
                <col className="w-[140px]" />
                <col className="w-[155px]" />
                <col className="w-[185px]" />
                <col className="w-[190px]" />
                <col className="w-[160px]" />
                <col className="w-[230px]" />
              </colgroup>

              <thead>
                <tr className="bg-[#24100b] text-[10px] font-black uppercase tracking-[0.16em] text-amber-100/70">
                  <th className="border-b border-r border-amber-300/15 px-4 py-4 text-left">
                    Time
                  </th>
                  <th className="border-b border-r border-amber-300/15 px-4 py-4 text-left">
                    Agent
                  </th>
                  <th className="border-b border-r border-amber-300/15 px-4 py-4 text-center">
                    Level
                  </th>
                  <th className="border-b border-r border-amber-300/15 px-4 py-4 text-center">
                    Status
                  </th>
                  <th className="border-b border-r border-amber-300/15 px-4 py-4 text-right">
                    Amount
                  </th>
                  <th className="border-b border-r border-amber-300/15 px-4 py-4 text-left">
                    Provider
                  </th>
                  <th className="border-b border-r border-amber-300/15 px-4 py-4 text-left">
                    Account
                  </th>
                  <th className="border-b border-r border-amber-300/15 px-4 py-4 text-left">
                    Note
                  </th>
                  <th className="border-b border-amber-300/15 px-4 py-4 text-center">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {visibleRequests.length === 0 ? (
                  <tr>
                    <td
                      colSpan={9}
                      className="px-4 py-8 text-center text-sm font-bold text-white/45"
                    >
                      No agent withdraw requests match this view.
                    </td>
                  </tr>
                ) : null}

                {visibleRequests.map((request) => {
                  const agent = request.agent_profiles;
                  const provider =
                    request.payment_provider_name ||
                    request.payment_provider_key ||
                    "Not provided";
                  const accountNumber = request.payment_account_number || "—";
                  const accountName = request.payment_account_name || "—";

                  return (
                    <tr
                      key={request.id}
                      tabIndex={0}
                      aria-label={`Select agent withdraw ${
                        agent?.agent_code ?? request.agent_id
                      }`}
                      className="group cursor-pointer border-b border-white/[0.06] bg-black/[0.16] outline-none transition hover:bg-amber-300/[0.045] focus:bg-amber-300/[0.09] focus-within:bg-amber-300/[0.09] active:bg-amber-300/[0.12]"
                    >
                      <td className="border-r border-white/[0.05] px-4 py-3 text-left font-bold tabular-nums text-white/52 group-focus:text-white/75">
                        {formatDate(request.created_at)}
                      </td>

                      <td className="border-r border-white/[0.05] px-4 py-3 text-left">
                        <p className="font-black text-amber-100">
                          {agent?.display_name ?? "Unknown Agent"}
                        </p>
                        <p className="mt-0.5 text-[11px] font-bold text-white/40">
                          Code:{" "}
                          <span className="text-amber-100/75">
                            {agent?.agent_code ?? "—"}
                          </span>
                        </p>
                      </td>

                      <td className="border-r border-white/[0.05] px-4 py-3 text-center">
                        <p className="font-black text-white/65">
                          {getAgentLevelLabel(agent?.agent_level)}
                        </p>
                        <p className="mt-0.5 text-[10px] font-bold text-white/35">
                          {formatPercent(agent?.commission_rate)}
                        </p>
                      </td>

                      <td className="border-r border-white/[0.05] px-4 py-3 text-center">
                        <StatusBadge status={request.status} />
                      </td>

                      <td className="border-r border-white/[0.05] px-4 py-3 text-right font-black tabular-nums text-amber-100">
                        {formatMMK(request.amount)}
                      </td>

                      <td className="border-r border-white/[0.05] px-4 py-3 text-left font-bold text-white/65">
                        <span className="break-all">{provider}</span>
                      </td>

                      <td className="border-r border-white/[0.05] px-4 py-3 text-left">
                        <p className="break-all font-black text-amber-100/85">
                          {accountNumber}
                        </p>
                        <p className="mt-0.5 break-all text-[11px] font-bold text-white/38">
                          {accountName}
                        </p>
                      </td>

                      <td className="border-r border-white/[0.05] px-4 py-3 text-left">
                        <p className="break-words font-bold text-white/55">
                          {request.note || "—"}
                        </p>
                        {request.admin_note ? (
                          <p className="mt-1 break-words text-[11px] font-bold text-amber-100/55">
                            Admin: {request.admin_note}
                          </p>
                        ) : null}
                      </td>

                      <td className="px-4 py-3 text-center">
                        <ActionCell request={request} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-center text-xs font-bold text-white/40 sm:text-left">
            Showing page {page} of {totalPages}
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