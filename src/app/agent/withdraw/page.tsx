// src/app/agent/withdraw/page.tsx

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

function getStatusLabel(status: WithdrawRow["status"]) {
  if (status === "pending") return "စောင့်နေ";
  if (status === "approved") return "အတည်ပြုပြီး";
  if (status === "paid") return "ငွေလွှဲပြီး";
  if (status === "rejected") return "ငြင်းပယ်";
  if (status === "cancelled") return "ပယ်ဖျက်";
  return "မသိ";
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

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-amber-100/70">
        {label}
      </span>
      {children}
    </label>
  );
}

function TextInput({
  name,
  placeholder,
  disabled,
  type = "text",
}: {
  name: string;
  placeholder: string;
  disabled: boolean;
  type?: string;
}) {
  return (
    <input
      name={name}
      required
      type={type}
      placeholder={placeholder}
      disabled={disabled}
      className="w-full rounded-2xl border border-amber-300/18 bg-black/35 px-4 py-3 text-base font-bold text-amber-50 outline-none placeholder:text-amber-100/28 focus:border-amber-300/55 disabled:opacity-50"
    />
  );
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
    <main className="min-h-dvh bg-[radial-gradient(circle_at_top,rgba(245,190,90,0.18),transparent_34%),linear-gradient(180deg,#260502,#070101)] px-4 py-4 text-amber-50">
      <div className="mx-auto w-full max-w-[430px] space-y-4">
        <header className="rounded-[1.7rem] border border-amber-300/24 bg-[linear-gradient(145deg,rgba(78,13,6,0.98),rgba(17,2,2,0.99),rgba(55,8,4,0.97))] p-4 shadow-2xl shadow-black/65">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-black tracking-[0.22em] text-amber-200/55">
                ငွေထုတ်ရန်
              </p>
              <h1 className="mt-1 text-2xl font-black text-amber-50">
                Agent Balance
              </h1>
              <p className="mt-1 text-sm font-bold text-amber-100/55">
                {agent.display_name ?? "Agent"}
              </p>
            </div>

            <Link
              href="/agent"
              className="rounded-full border border-amber-300/20 bg-black/25 px-3 py-2 text-xs font-black text-amber-100"
            >
              နောက်သို့
            </Link>
          </div>

          <div className="mt-4 rounded-[1.35rem] border border-amber-300/14 bg-black/25 p-4">
            <p className="text-sm font-bold text-amber-100/55">
              ထုတ်ယူနိုင်သောငွေ
            </p>

            <p className="mt-2 text-4xl font-black leading-none text-amber-50">
              {formatMMK(agent.available_balance)} MMK
            </p>

            <div className="mt-3 rounded-2xl border border-amber-300/12 bg-black/25 px-4 py-3">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-bold text-amber-100/50">
                  စောင့်နေသော ငွေထုတ်
                </p>
                <p className="text-base font-black text-amber-50">
                  {formatMMK(agent.pending_withdraw_amount)} MMK
                </p>
              </div>
            </div>
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
              ငွေထုတ်မှတ်တမ်း မဖွင့်နိုင်ပါ။
            </p>
            <p className="mt-1 text-xs text-red-100/70">
              {withdrawError.message}
            </p>
          </section>
        ) : null}

        <section className="rounded-[1.7rem] border border-amber-300/22 bg-[linear-gradient(145deg,rgba(44,7,3,0.97),rgba(9,1,1,0.99))] p-4 shadow-2xl shadow-black/55">
          <div>
            <p className="text-[10px] font-black tracking-[0.22em] text-amber-100/42">
              Request
            </p>
            <h2 className="mt-1 text-xl font-black text-amber-50">
              ငွေထုတ်တောင်းရန်
            </h2>
          </div>

          <form action={createAgentWithdrawAction} className="mt-4 space-y-4">
            <Field label="ငွေပမာဏ">
              <input
                name="amount"
                required
                type="number"
                min="1000"
                max={Math.max(availableBalance, 0)}
                step="1000"
                placeholder="10000"
                disabled={!canWithdraw}
                className="w-full rounded-2xl border border-amber-300/18 bg-black/35 px-4 py-3 text-base font-black text-amber-50 outline-none placeholder:text-amber-100/28 focus:border-amber-300/55 disabled:opacity-50"
              />
            </Field>

            <Field label="ငွေလက်ခံမည့် wallet">
<select
  name="payment_provider_key"
  required
  className="w-full rounded-2xl border border-amber-300/18 bg-black/35 px-4 py-3 text-base font-bold text-amber-50 outline-none focus:border-amber-300/55"
>
  <option value="kpay">KBZPay</option>
  <option value="wavepay">WavePay</option>
  <option value="ayapay">AYA Pay</option>
  <option value="cbpay">CB Pay</option>
  <option value="other">အခြား</option>
</select>
            </Field>

            <Field label="အကောင့်အမည်">
              <TextInput
                name="payment_account_name"
                placeholder="အကောင့်ပိုင်ရှင်အမည်"
                disabled={!canWithdraw}
              />
            </Field>

            <Field label="ဖုန်းနံပါတ် / အကောင့်နံပါတ်">
              <TextInput
                name="payment_account_number"
                placeholder="09112233445"
                disabled={!canWithdraw}
              />
            </Field>

            <input name="note" type="hidden" value="" />

            <button
              type="submit"
              disabled={!canWithdraw}
              className="w-full rounded-2xl border border-amber-200/45 bg-[linear-gradient(180deg,#f7d27a,#b87819)] px-5 py-3 text-base font-black text-[#2a0701] shadow-lg shadow-black/40 disabled:cursor-not-allowed disabled:opacity-50"
            >
              ငွေထုတ်တောင်းရန်
            </button>

            {!canWithdraw ? (
              <p className="rounded-2xl border border-amber-300/15 bg-black/25 px-4 py-3 text-center text-sm font-bold text-amber-100/55">
                ထုတ်ယူနိုင်သောငွေ မရှိသေးပါ။
              </p>
            ) : null}
          </form>
        </section>

        <section className="space-y-3">
          <div>
            <p className="text-[10px] font-black tracking-[0.22em] text-amber-100/42">
              မှတ်တမ်း
            </p>
            <h2 className="mt-1 text-xl font-black text-amber-50">
              ငွေထုတ်စာရင်း
            </h2>
          </div>

          {withdraws.length === 0 ? (
            <div className="rounded-[1.5rem] border border-amber-300/15 bg-black/25 p-5 text-center">
              <p className="text-lg font-black text-amber-50">
                ငွေထုတ်တောင်းထားခြင်း မရှိသေးပါ
              </p>
              <p className="mt-1 text-sm text-amber-100/55">
                တောင်းပြီးပါက ဤနေရာတွင် ပြပါမည်။
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
                    "rounded-full border px-3 py-1 text-[11px] font-black",
                    getStatusClass(request.status),
                  ].join(" ")}
                >
                  {getStatusLabel(request.status)}
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
                  Admin မှတ်ချက်: {request.admin_note}
                </p>
              ) : null}
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}