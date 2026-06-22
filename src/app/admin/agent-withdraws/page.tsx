//src/app/admin/agent-withdraws/page.tsx

import Link from "next/link";
import { redirect } from "next/navigation";

import AdminShell from "@/components/admin/AdminShell";
import { createClient } from "@/lib/supabase/server";
import { reviewAgentWithdrawAction } from "./actions";

export const dynamic = "force-dynamic";

type AdminAgentWithdrawsPageProps = {
  searchParams?: Promise<{
    success?: string;
    error?: string;
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
  status: "pending" | "approved" | "rejected" | "paid" | "cancelled";
  admin_note: string | null;
  reviewed_at: string | null;
  created_at: string;
  updated_at: string;
  agent_profiles: AgentJoin | AgentJoin[] | null;
};

type WithdrawRequest = Omit<RawWithdrawRequest, "agent_profiles"> & {
  agent_profiles: AgentJoin | null;
};

function normalizeAgent(agentProfiles: RawWithdrawRequest["agent_profiles"]) {
  if (Array.isArray(agentProfiles)) {
    return agentProfiles[0] ?? null;
  }

  return agentProfiles;
}

function formatMMK(value: number | string | null | undefined) {
  const amount = Number(value ?? 0);

  return `${new Intl.NumberFormat("en-US").format(
    Number.isFinite(amount) ? amount : 0,
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

function getStatusClass(status: WithdrawRequest["status"]) {
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
  if (level === 1) return "Primary Agent";
  if (level === 2) return "Sub Agent";
  return "Agent";
}

function ReviewForm({
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
    <form action={reviewAgentWithdrawAction} className="space-y-2">
      <input type="hidden" name="request_id" value={requestId} />
      <input type="hidden" name="action" value={action} />

      <input
        name="admin_note"
        placeholder="Admin note"
        className="w-full rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-xs font-bold text-amber-50 outline-none placeholder:text-white/25 focus:border-amber-300/40"
      />

      <button
        type="submit"
        className={`w-full rounded-xl border px-4 py-2 text-xs font-black transition ${buttonClass}`}
      >
        {label}
      </button>
    </form>
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

  const { data, error } = await supabase
    .from("agent_withdraw_requests")
    .select(
      `
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
    `,
    )
    .order("created_at", { ascending: false })
    .returns<RawWithdrawRequest[]>();

  const requests = (data ?? []).map((request) => ({
    ...request,
    agent_profiles: normalizeAgent(request.agent_profiles),
  })) as WithdrawRequest[];

  const pendingRequests = requests.filter((request) => request.status === "pending");
  const approvedRequests = requests.filter((request) => request.status === "approved");
  const paidRequests = requests.filter((request) => request.status === "paid");
  const rejectedRequests = requests.filter((request) => request.status === "rejected");

  const pendingAmount = pendingRequests.reduce(
    (sum, request) => sum + Number(request.amount || 0),
    0,
  );

  const approvedAmount = approvedRequests.reduce(
    (sum, request) => sum + Number(request.amount || 0),
    0,
  );

  const paidAmount = paidRequests.reduce(
    (sum, request) => sum + Number(request.amount || 0),
    0,
  );

  return (
    <AdminShell
      title="Agent Withdraws"
      eyebrow="Agent Cashout Control"
      description="Review, approve, reject, and mark paid agent withdrawal requests."
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

      {error ? (
        <section className="mt-3 rounded-2xl border border-red-400/25 bg-red-950/25 p-4">
          <p className="text-sm font-black text-red-100">
            Failed to load agent withdraws
          </p>
          <p className="mt-1 text-xs font-semibold text-red-100/70">
            {error.message}
          </p>
        </section>
      ) : null}

      <section className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-amber-300/15 bg-amber-300/10 p-4">
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-amber-100/55">
            Pending
          </p>
          <p className="mt-2 text-2xl font-black text-amber-100">
            {pendingRequests.length}
          </p>
          <p className="mt-1 text-xs font-bold text-amber-100/55">
            {formatMMK(pendingAmount)}
          </p>
        </div>

        <div className="rounded-2xl border border-sky-300/15 bg-sky-400/10 p-4">
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-sky-100/55">
            Approved
          </p>
          <p className="mt-2 text-2xl font-black text-sky-100">
            {approvedRequests.length}
          </p>
          <p className="mt-1 text-xs font-bold text-sky-100/55">
            {formatMMK(approvedAmount)}
          </p>
        </div>

        <div className="rounded-2xl border border-emerald-300/15 bg-emerald-400/10 p-4">
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-emerald-100/55">
            Paid
          </p>
          <p className="mt-2 text-2xl font-black text-emerald-100">
            {paidRequests.length}
          </p>
          <p className="mt-1 text-xs font-bold text-emerald-100/55">
            {formatMMK(paidAmount)}
          </p>
        </div>

        <div className="rounded-2xl border border-red-300/15 bg-red-400/10 p-4">
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-red-100/55">
            Rejected
          </p>
          <p className="mt-2 text-2xl font-black text-red-100">
            {rejectedRequests.length}
          </p>
        </div>
      </section>

      <section className="mt-4 rounded-2xl border border-amber-300/12 bg-black/35 p-4">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.28em] text-amber-200/45">
              Requests
            </p>
            <h2 className="mt-1 text-xl font-black text-amber-100">
              Agent Withdraw Queue
            </h2>
          </div>

          <p className="rounded-full border border-white/10 bg-black/30 px-4 py-2 text-xs font-black text-white/45">
            {requests.length} loaded
          </p>
        </div>

        {requests.length === 0 ? (
          <div className="mt-4 rounded-xl border border-white/10 bg-black/25 p-5 text-center">
            <p className="text-lg font-black text-amber-100">
              No agent withdraw requests
            </p>
            <p className="mt-1 text-sm font-semibold text-white/45">
              Agent requests will appear here.
            </p>
          </div>
        ) : null}

        <div className="mt-4 grid gap-3">
          {requests.map((request) => {
            const agent = request.agent_profiles;

            return (
              <article
                key={request.id}
                className="rounded-xl border border-white/10 bg-[#120504] p-4"
              >
                <div className="grid gap-4 xl:grid-cols-[1fr_150px_1fr_260px] xl:items-start">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-black text-amber-100">
                        {agent?.display_name ?? "Unknown Agent"}
                      </h3>

                      <span
                        className={`rounded-full border px-3 py-1 text-[11px] font-black uppercase tracking-[0.14em] ${getStatusClass(
                          request.status,
                        )}`}
                      >
                        {request.status}
                      </span>
                    </div>

                    <p className="mt-1 text-sm font-bold text-white/45">
                      Code:{" "}
                      <span className="font-black text-amber-200">
                        {agent?.agent_code ?? "-"}
                      </span>
                    </p>

                    <p className="mt-1 text-xs font-bold text-white/35">
                      {getAgentLevelLabel(agent?.agent_level)} · Rate{" "}
                      {formatPercent(agent?.commission_rate)}
                    </p>

                    <p className="mt-3 text-xs font-semibold text-white/35">
                      Requested: {formatDate(request.created_at)}
                    </p>

                    {request.reviewed_at ? (
                      <p className="mt-1 text-xs font-semibold text-white/35">
                        Reviewed: {formatDate(request.reviewed_at)}
                      </p>
                    ) : null}
                  </div>

                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/30">
                      Amount
                    </p>
                    <p className="mt-1 text-xl font-black text-amber-100">
                      {formatMMK(request.amount)}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/30">
                      Payment Account
                    </p>
                    <p className="mt-1 text-sm font-black text-amber-100">
                      {request.payment_provider_name ||
                        request.payment_provider_key ||
                        "Not provided"}
                    </p>

                    {request.payment_account_name ? (
                      <p className="mt-1 text-sm font-bold text-white/55">
                        {request.payment_account_name}
                      </p>
                    ) : null}

                    {request.payment_account_number ? (
                      <p className="mt-1 break-all text-sm font-bold text-white/55">
                        {request.payment_account_number}
                      </p>
                    ) : null}

                    {request.note ? (
                      <p className="mt-2 break-words rounded-xl border border-white/10 bg-black/25 p-3 text-xs font-semibold leading-5 text-white/45">
                        {request.note}
                      </p>
                    ) : null}

                    {request.admin_note ? (
                      <p className="mt-2 break-words rounded-xl border border-amber-300/10 bg-amber-300/5 p-3 text-xs font-semibold leading-5 text-amber-100/55">
                        Admin: {request.admin_note}
                      </p>
                    ) : null}
                  </div>

                  <div className="space-y-3 rounded-xl border border-white/10 bg-black/25 p-3">
                    {request.status === "pending" ? (
                      <>
                        <ReviewForm
                          requestId={request.id}
                          action="approve"
                          label="Approve"
                          tone="gold"
                        />

                        <ReviewForm
                          requestId={request.id}
                          action="reject"
                          label="Reject"
                          tone="red"
                        />
                      </>
                    ) : null}

                    {request.status === "approved" ? (
                      <>
                        <ReviewForm
                          requestId={request.id}
                          action="paid"
                          label="Mark Paid"
                          tone="green"
                        />

                        <ReviewForm
                          requestId={request.id}
                          action="reject"
                          label="Reject"
                          tone="red"
                        />
                      </>
                    ) : null}

                    {request.status === "paid" ? (
                      <p className="rounded-xl border border-emerald-300/20 bg-emerald-400/10 p-3 text-center text-sm font-black text-emerald-100">
                        Paid
                      </p>
                    ) : null}

                    {request.status === "rejected" ? (
                      <p className="rounded-xl border border-red-300/20 bg-red-400/10 p-3 text-center text-sm font-black text-red-100">
                        Rejected
                      </p>
                    ) : null}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </AdminShell>
  );
}