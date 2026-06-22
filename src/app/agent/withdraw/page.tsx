//src/app/agent/withdraw/page.tsx

import Link from "next/link";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { createAgentWithdrawAction } from "./actions";

export const dynamic = "force-dynamic";

type AgentDashboardRow = {
  agent_id: string;
  display_name: string | null;
  agent_status: string | null;
  available_balance: number | string | null;
  pending_withdraw_amount: number | string | null;
};

type WithdrawRow = {
  id: string;
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
};

type AgentWithdrawPageProps = {
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

function getStatusClass(status: WithdrawRow["status"]) {
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

export default async function AgentWithdrawPage({
  searchParams,
}: AgentWithdrawPageProps) {
  const params = searchParams ? await searchParams : {};
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/agent/login");
  }

  const { data: dashboardData, error: dashboardError } = await supabase
    .rpc("get_my_agent_dashboard_v2")
    .maybeSingle();

  const agent = dashboardData as AgentDashboardRow | null;

  if (dashboardError || !agent) {
    redirect("/agent");
  }

  const { data: withdrawData, error: withdrawError } = await supabase
    .from("agent_withdraw_requests")
    .select(
      "id, amount, payment_provider_key, payment_provider_name, payment_account_name, payment_account_number, note, status, admin_note, reviewed_at, created_at",
    )
    .order("created_at", { ascending: false })
    .returns<WithdrawRow[]>();

  const withdraws = withdrawData ?? [];
  const availableBalance = Number(agent.available_balance ?? 0);
  const canWithdraw = agent.agent_status === "active" && availableBalance > 0;

  return (
    <main className="min-h-dvh bg-[radial-gradient(circle_at_top,rgba(245,190,90,0.2),transparent_35%),linear-gradient(180deg,#260502,#070101)] px-5 py-6 text-amber-50">
      <div className="mx-auto w-full max-w-[430px] space-y-5">
        <header className="rounded-[2rem] border border-amber-300/25 bg-[linear-gradient(145deg,rgba(76,13,6,0.97),rgba(18,2,2,0.99),rgba(62,10,5,0.96))] p-5 shadow-2xl shadow-black/60">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-200/60">
                Agent Withdraw
              </p>
              <h1 className="mt-2 text-2xl font-black text-amber-50">
                Withdraw Request
              </h1>
              <p className="mt-1 text-sm leading-6 text-amber-100/65">
                {agent.display_name ?? "Agent"} balance ထုတ်ယူရန်။
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

        {withdrawError ? (
          <section className="rounded-2xl border border-red-300/25 bg-red-950/25 p-4">
            <p className="text-sm font-black text-red-100">
              Failed to load withdraw history
            </p>
            <p className="mt-1 text-xs text-red-100/70">
              {withdrawError.message}
            </p>
          </section>
        ) : null}

        <section className="overflow-hidden rounded-[2rem] border border-amber-300/25 bg-[linear-gradient(145deg,rgba(44,8,4,0.96),rgba(10,1,1,0.98))] shadow-2xl shadow-black/60">
          <div className="border-b border-amber-300/15 p-5">
            <p className="text-sm font-semibold text-amber-100/70">
              ထုတ်ယူနိုင်သော Balance
            </p>
            <p className="mt-3 text-4xl font-black tracking-tight text-amber-50">
              {formatMMK(agent.available_balance)} MMK
            </p>
            <p className="mt-2 text-sm font-bold text-amber-100/45">
              Pending Withdraw: {formatMMK(agent.pending_withdraw_amount)} MMK
            </p>
          </div>

          <form action={createAgentWithdrawAction} className="space-y-4 p-5">
            <label className="block">
              <span className="mb-2 block text-sm font-bold text-amber-100">
                Amount
              </span>
              <input
                name="amount"
                required
                type="number"
                min="1000"
                max={Math.max(availableBalance, 0)}
                step="1000"
                placeholder="10000"
                disabled={!canWithdraw}
                className="w-full rounded-2xl border border-amber-300/20 bg-black/35 px-4 py-3 text-base font-bold text-amber-50 outline-none placeholder:text-amber-100/35 focus:border-amber-300/55 disabled:opacity-50"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-bold text-amber-100">
                Payment Method
              </span>
              <select
                name="payment_provider_key"
                required
                disabled={!canWithdraw}
                className="w-full rounded-2xl border border-amber-300/20 bg-black/35 px-4 py-3 text-base font-bold text-amber-50 outline-none focus:border-amber-300/55 disabled:opacity-50"
              >
                <option value="kpay">KBZPay</option>
                <option value="wavepay">WavePay</option>
                <option value="ayapay">AYA Pay</option>
                <option value="cbpay">CB Pay</option>
                <option value="other">Other</option>
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-bold text-amber-100">
                Account Name
              </span>
              <input
                name="payment_account_name"
                required
                placeholder="Account holder name"
                disabled={!canWithdraw}
                className="w-full rounded-2xl border border-amber-300/20 bg-black/35 px-4 py-3 text-base font-bold text-amber-50 outline-none placeholder:text-amber-100/35 focus:border-amber-300/55 disabled:opacity-50"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-bold text-amber-100">
                Account Number / Phone
              </span>
              <input
                name="payment_account_number"
                required
                placeholder="09112233445"
                disabled={!canWithdraw}
                className="w-full rounded-2xl border border-amber-300/20 bg-black/35 px-4 py-3 text-base font-bold text-amber-50 outline-none placeholder:text-amber-100/35 focus:border-amber-300/55 disabled:opacity-50"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-bold text-amber-100">
                Note
              </span>
              <input
                name="note"
                placeholder="Optional"
                disabled={!canWithdraw}
                className="w-full rounded-2xl border border-amber-300/20 bg-black/35 px-4 py-3 text-base font-bold text-amber-50 outline-none placeholder:text-amber-100/35 focus:border-amber-300/55 disabled:opacity-50"
              />
            </label>

            <button
              type="submit"
              disabled={!canWithdraw}
              className="w-full rounded-2xl border border-amber-200/45 bg-[linear-gradient(180deg,#f7d27a,#b87819)] px-5 py-3 text-base font-black text-[#2a0701] shadow-lg shadow-black/40 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Submit Withdraw
            </button>

            {!canWithdraw ? (
              <p className="rounded-2xl border border-amber-300/15 bg-black/25 px-4 py-3 text-center text-sm font-bold text-amber-100/55">
                Withdraw လုပ်ရန် available balance မရှိသေးပါ။
              </p>
            ) : null}
          </form>
        </section>

        <section className="space-y-3">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-amber-200/45">
              History
            </p>
            <h2 className="mt-1 text-xl font-black text-amber-50">
              Withdraw Requests
            </h2>
          </div>

          {withdraws.length === 0 ? (
            <div className="rounded-[1.5rem] border border-amber-300/15 bg-black/25 p-5 text-center">
              <p className="text-lg font-black text-amber-50">
                No withdraw requests yet
              </p>
              <p className="mt-1 text-sm text-amber-100/55">
                Submitted requests will appear here.
              </p>
            </div>
          ) : null}

          {withdraws.map((request) => (
            <article
              key={request.id}
              className="rounded-[1.5rem] border border-amber-300/15 bg-black/25 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xl font-black text-amber-50">
                    {formatMMK(request.amount)} MMK
                  </p>
                  <p className="mt-1 text-xs font-bold text-amber-100/40">
                    {formatDate(request.created_at)}
                  </p>
                </div>

                <span
                  className={[
                    "rounded-full border px-3 py-1 text-[11px] font-black uppercase tracking-[0.14em]",
                    getStatusClass(request.status),
                  ].join(" ")}
                >
                  {request.status}
                </span>
              </div>

              <div className="mt-3 rounded-2xl border border-amber-300/10 bg-black/25 p-3">
                <p className="text-sm font-black text-amber-100">
                  {request.payment_provider_name ||
                    request.payment_provider_key ||
                    "Payment"}
                </p>

                <p className="mt-1 text-sm font-bold text-amber-100/55">
                  {request.payment_account_name ?? "-"}
                </p>

                <p className="mt-1 break-all text-sm font-bold text-amber-100/55">
                  {request.payment_account_number ?? "-"}
                </p>
              </div>

              {request.admin_note ? (
                <p className="mt-3 rounded-2xl border border-amber-300/10 bg-amber-300/5 p-3 text-xs font-semibold leading-5 text-amber-100/55">
                  Admin: {request.admin_note}
                </p>
              ) : null}
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}