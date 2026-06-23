// src/app/agent/sub-agents/page.tsx

import Link from "next/link";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { createSubAgentAction } from "./actions";

export const dynamic = "force-dynamic";

type AgentDashboardRow = {
  agent_id: string;
  agent_code: string | null;
  display_name: string | null;
  agent_status: string | null;
  agent_level: number | null;
  max_commission_rate: number | string | null;
  max_active_player_bonus_amount: number | string | null;
  can_create_sub_agents: boolean | null;
};

type SubAgentRow = {
  agent_id: string;
  agent_code: string | null;
  display_name: string | null;
  agent_status: string | null;
  commission_rate: number | string | null;
  active_player_bonus_amount: number | string | null;
  agent_login_phone: string | null;
  registered_player_count: number | null;
  active_player_count: number | null;
  total_earned_amount: number | string | null;
  created_at: string | null;
};

type SubAgentsPageProps = {
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

function formatPercent(value: number | string | null | undefined) {
  const amount = Number(value ?? 0);
  return (amount * 100).toFixed(2).replace(/\.00$/, "");
}

function formatDate(value: string | null | undefined) {
  if (!value) return "-";

  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Yangon",
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(new Date(value));
}

function getStatusLabel(status: string | null | undefined) {
  if (status === "active") return "ဖွင့်ထား";
  if (status === "paused") return "ရပ်ထား";
  return "ပိတ်ထား";
}

function getStatusClass(status: string | null | undefined) {
  if (status === "active") {
    return "border-emerald-300/25 bg-emerald-950/35 text-emerald-100";
  }

  if (status === "paused") {
    return "border-amber-300/25 bg-amber-950/35 text-amber-100";
  }

  return "border-red-300/25 bg-red-950/35 text-red-100";
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
      <span className="mb-2 block text-sm font-bold text-amber-100/75">
        {label}
      </span>
      {children}
    </label>
  );
}

function TextInput({
  name,
  placeholder,
  type = "text",
  required = true,
  minLength,
}: {
  name: string;
  placeholder: string;
  type?: string;
  required?: boolean;
  minLength?: number;
}) {
  return (
    <input
      name={name}
      required={required}
      type={type}
      minLength={minLength}
      placeholder={placeholder}
      className="w-full rounded-2xl border border-amber-300/18 bg-black/35 px-4 py-3 text-base font-bold text-amber-50 outline-none placeholder:text-amber-100/28 focus:border-amber-300/55"
    />
  );
}

function NumberInput({
  name,
  min,
  max,
  step,
  defaultValue,
}: {
  name: string;
  min: string;
  max: string | number;
  step: string;
  defaultValue: string | number;
}) {
  return (
    <input
      name={name}
      required
      type="number"
      min={min}
      max={max}
      step={step}
      defaultValue={defaultValue}
      className="w-full rounded-2xl border border-amber-300/18 bg-black/35 px-4 py-3 text-base font-black text-amber-50 outline-none focus:border-amber-300/55"
    />
  );
}

function SmallStat({
  label,
  value,
  sub,
}: {
  label: string;
  value: React.ReactNode;
  sub: string;
}) {
  return (
    <div className="rounded-2xl border border-amber-300/12 bg-black/25 p-3">
      <p className="text-[11px] font-bold text-amber-100/45">{label}</p>
      <p className="mt-1 text-xl font-black text-amber-50">{value}</p>
      <p className="mt-1 text-[11px] font-bold leading-4 text-amber-100/35">
        {sub}
      </p>
    </div>
  );
}

export default async function AgentSubAgentsPage({
  searchParams,
}: SubAgentsPageProps) {
  const params = searchParams ? await searchParams : {};
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/agent/login");
  }

  const { data: dashboardData } = await supabase
    .rpc("get_my_agent_dashboard_v2")
    .maybeSingle();

  const agent = dashboardData as AgentDashboardRow | null;

  if (!agent) {
    redirect("/agent");
  }

  if (agent.agent_level !== 1 || !agent.can_create_sub_agents) {
    redirect("/agent");
  }

  const { data: subAgentData, error } = await supabase.rpc("get_my_sub_agents");

  const subAgents = (subAgentData ?? []) as SubAgentRow[];

  const maxCommissionPercent = formatPercent(agent.max_commission_rate);
  const maxActiveBonus = Number(agent.max_active_player_bonus_amount ?? 1000);

  return (
    <main className="min-h-dvh bg-[radial-gradient(circle_at_top,rgba(245,190,90,0.18),transparent_34%),linear-gradient(180deg,#260502,#070101)] px-4 py-4 text-amber-50">
      <div className="mx-auto w-full max-w-[430px] space-y-4">
        <header className="rounded-[1.7rem] border border-amber-300/24 bg-[linear-gradient(145deg,rgba(78,13,6,0.98),rgba(17,2,2,0.99),rgba(55,8,4,0.97))] p-4 shadow-2xl shadow-black/65">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-black tracking-[0.22em] text-amber-200/55">
                အောက်ခံအေးဂျင့်
              </p>
              <h1 className="mt-1 text-2xl font-black text-amber-50">
                စီမံရန်
              </h1>
              <p className="mt-1 text-sm font-bold leading-5 text-amber-100/55">
                သင်ဖန်တီးထားသော Agent B များကို ကြည့်ရန်နှင့် အသစ်ဖန်တီးရန်။
              </p>
            </div>

            <Link
              href="/agent"
              className="rounded-full border border-amber-300/20 bg-black/25 px-3 py-2 text-xs font-black text-amber-100"
            >
              နောက်သို့
            </Link>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <SmallStat
              label="Sub Agent"
              value={subAgents.length}
              sub="သင်ဖန်တီးထားသူ"
            />

            <SmallStat
              label="အများဆုံး Rate"
              value={`${maxCommissionPercent}%`}
              sub="ဒီထက်ပို မပေးနိုင်"
            />
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

        {error ? (
          <section className="rounded-2xl border border-red-300/25 bg-red-950/25 p-4">
            <p className="text-sm font-black text-red-100">
              Sub Agent စာရင်း မဖွင့်နိုင်ပါ။
            </p>
            <p className="mt-1 text-xs text-red-100/70">{error.message}</p>
          </section>
        ) : null}

        <section className="rounded-[1.7rem] border border-amber-300/22 bg-[linear-gradient(145deg,rgba(44,7,3,0.97),rgba(9,1,1,0.99))] p-4 shadow-2xl shadow-black/55">
          <div>
            <p className="text-[10px] font-black tracking-[0.22em] text-amber-100/42">
              အသစ်ဖန်တီးရန်
            </p>
            <h2 className="mt-1 text-xl font-black text-amber-50">
              Agent B အသစ်
            </h2>
            <p className="mt-2 text-sm font-bold leading-6 text-amber-100/50">
              Commission ကို 0 မှ {maxCommissionPercent}% အတွင်းသာ သတ်မှတ်နိုင်သည်။
              Active bonus ကို 0 မှ {formatMMK(maxActiveBonus)} MMK အတွင်းသာ
              သတ်မှတ်နိုင်သည်။
            </p>
          </div>

          <form action={createSubAgentAction} className="mt-5 space-y-4">
            <Field label="Agent code">
              <TextInput name="agent_code" placeholder="agentb001" />
            </Field>

            <Field label="အမည်">
              <TextInput name="display_name" placeholder="ဥပမာ - Agent B" />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Commission %">
                <NumberInput
                  name="commission_rate_percent"
                  min="0"
                  max={maxCommissionPercent}
                  step="0.01"
                  defaultValue={maxCommissionPercent}
                />
              </Field>

              <Field label="Active bonus">
                <NumberInput
                  name="active_player_bonus_amount"
                  min="0"
                  max={maxActiveBonus}
                  step="100"
                  defaultValue={maxActiveBonus}
                />
              </Field>
            </div>

            <Field label="Login phone">
              <TextInput
                name="phone_number"
                type="tel"
                placeholder="09112233445"
              />
            </Field>

            <Field label="Password">
              <TextInput
                name="password"
                type="password"
                minLength={6}
                placeholder="အနည်းဆုံး ၆ လုံး"
              />
            </Field>

            <input name="notes" type="hidden" value="" />

            <button
              type="submit"
              className="w-full rounded-2xl border border-amber-200/45 bg-[linear-gradient(180deg,#f7d27a,#b87819)] px-5 py-3 text-base font-black text-[#2a0701] shadow-lg shadow-black/40"
            >
              Sub Agent ဖန်တီးရန်
            </button>
          </form>
        </section>

        <section className="space-y-3">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-[10px] font-black tracking-[0.22em] text-amber-100/42">
                စာရင်း
              </p>
              <h2 className="mt-1 text-xl font-black text-amber-50">
                Sub Agent {subAgents.length} ယောက်
              </h2>
            </div>
          </div>

          {subAgents.length === 0 ? (
            <div className="rounded-[1.5rem] border border-amber-300/15 bg-black/25 p-5 text-center">
              <p className="text-lg font-black text-amber-50">
                Sub Agent မရှိသေးပါ
              </p>
              <p className="mt-1 text-sm text-amber-100/55">
                အပေါ်က form ဖြင့် Agent B အသစ်ဖန်တီးပါ။
              </p>
            </div>
          ) : null}

          {subAgents.map((subAgent) => (
            <article
              key={subAgent.agent_id}
              className="rounded-[1.5rem] border border-amber-300/15 bg-black/25 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-black text-amber-50">
                    {subAgent.display_name ?? "Sub Agent"}
                  </h3>
                  <p className="mt-1 text-sm font-bold text-amber-100/55">
                    Code: {subAgent.agent_code ?? "-"}
                  </p>
                  {subAgent.agent_login_phone ? (
                    <p className="mt-1 text-xs font-bold text-amber-100/40">
                      Phone: {subAgent.agent_login_phone}
                    </p>
                  ) : null}
                </div>

                <span
                  className={[
                    "rounded-full border px-3 py-1 text-[11px] font-black",
                    getStatusClass(subAgent.agent_status),
                  ].join(" ")}
                >
                  {getStatusLabel(subAgent.agent_status)}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <SmallStat
                  label="Commission"
                  value={`${formatPercent(subAgent.commission_rate)}%`}
                  sub="Agent B ရမည့် rate"
                />

                <SmallStat
                  label="Active Bonus"
                  value={formatMMK(subAgent.active_player_bonus_amount)}
                  sub="Active တစ်ယောက်လျှင်"
                />

                <SmallStat
                  label="Player"
                  value={subAgent.registered_player_count ?? 0}
                  sub="ဖိတ်ထားသူ"
                />

                <SmallStat
                  label="Active"
                  value={subAgent.active_player_count ?? 0}
                  sub="Bonus/commission ဝင်မည်"
                />
              </div>

              <p className="mt-3 text-xs font-bold text-amber-100/35">
                ဖန်တီးသည့်နေ့: {formatDate(subAgent.created_at)}
              </p>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}