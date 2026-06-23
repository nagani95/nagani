//src/app/agent/players/page.tsx

import Link from "next/link";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type AgentDashboardRow = {
  display_name: string | null;
  agent_level: number | null;
  registered_player_count: number | null;
  active_player_count: number | null;
  direct_registered_player_count: number | null;
  sub_registered_player_count: number | null;
};

type PlayerRow = {
  player_id: string;
  member_code: string | null;
  username: string | null;
  referral_id: string;
  assigned_at: string;
  owner_agent_id: string;
  owner_agent_code: string | null;
  owner_display_name: string | null;
  scope_kind: "direct" | "sub" | "unknown" | null;
  approved_deposit_total: number | string | null;
  is_active_player: boolean | null;
  active_rewarded_at: string | null;
  total_bet_debit: number | string | null;
  total_payout_credit: number | string | null;
  player_net_loss: number | string | null;
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

function formatMemberId(profileId: string, memberCode?: string | null) {
  return memberCode || `NG-${profileId.slice(0, 8).toUpperCase()}`;
}

function shortId(id: string) {
  if (!id) return "-";
  return `${id.slice(0, 8)}...${id.slice(-6)}`;
}

function getScopeLabel(scope: PlayerRow["scope_kind"]) {
  if (scope === "direct") return "Direct";
  if (scope === "sub") return "Sub Agent";
  return "Unknown";
}

function getScopeClass(scope: PlayerRow["scope_kind"]) {
  if (scope === "direct") {
    return "border-amber-300/25 bg-amber-400/10 text-amber-100";
  }

  if (scope === "sub") {
    return "border-sky-300/25 bg-sky-400/10 text-sky-100";
  }

  return "border-white/10 bg-white/[0.03] text-white/45";
}

function SummaryCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string | number;
  sub?: string;
}) {
  return (
    <div className="rounded-[1.4rem] border border-amber-300/15 bg-black/25 p-4">
      <p className="text-[11px] font-black uppercase tracking-[0.18em] text-amber-100/45">
        {label}
      </p>
      <p className="mt-2 text-xl font-black text-amber-50">{value}</p>
      {sub ? <p className="mt-1 text-xs font-bold text-amber-100/45">{sub}</p> : null}
    </div>
  );
}

export default async function AgentPlayersPage() {
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

const { data: playerData, error: playerError } =
  await supabase.rpc("get_my_agent_players");

const players = (Array.isArray(playerData) ? playerData : []) as PlayerRow[];

  const activePlayers = players.filter((player) => player.is_active_player);
  const depositPlayers = players.filter(
    (player) => Number(player.approved_deposit_total ?? 0) > 0,
  );
  const directPlayers = players.filter((player) => player.scope_kind === "direct");
  const subPlayers = players.filter((player) => player.scope_kind === "sub");

  return (
    <main className="min-h-dvh bg-[radial-gradient(circle_at_top,rgba(245,190,90,0.2),transparent_35%),linear-gradient(180deg,#260502,#070101)] px-5 py-6 text-amber-50">
      <div className="mx-auto w-full max-w-[430px] space-y-5">
        <header className="rounded-[2rem] border border-amber-300/25 bg-[linear-gradient(145deg,rgba(76,13,6,0.97),rgba(18,2,2,0.99),rgba(62,10,5,0.96))] p-5 shadow-2xl shadow-black/60">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-200/60">
                Agent Players
              </p>
              <h1 className="mt-2 text-2xl font-black text-amber-50">
                Referral Players
              </h1>
              <p className="mt-1 text-sm leading-6 text-amber-100/65">
                {agent.display_name ?? "Agent"} referral player များ။
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

        {playerError ? (
          <section className="rounded-2xl border border-red-300/25 bg-red-950/25 p-4">
            <p className="text-sm font-black text-red-100">
              Failed to load players
            </p>
            <p className="mt-1 text-xs text-red-100/70">
              {playerError.message}
            </p>
          </section>
        ) : null}

        <section className="grid grid-cols-2 gap-3">
          <SummaryCard
            label="Registered"
            value={players.length}
            sub="All referral players"
          />

          <SummaryCard
            label="Active"
            value={activePlayers.length}
            sub="Activated"
          />

          <SummaryCard
            label="Deposited"
            value={depositPlayers.length}
            sub="Approved deposit"
          />

          <SummaryCard
            label="Direct"
            value={directPlayers.length}
            sub={`Sub ${subPlayers.length}`}
          />
        </section>

        <section className="space-y-3">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-amber-200/45">
              Player List
            </p>
            <h2 className="mt-1 text-xl font-black text-amber-50">
              {players.length} Players
            </h2>
          </div>

          {players.length === 0 ? (
            <div className="rounded-[1.5rem] border border-amber-300/15 bg-black/25 p-5 text-center">
              <p className="text-lg font-black text-amber-50">
                No referral players yet
              </p>
              <p className="mt-1 text-sm leading-6 text-amber-100/55">
                Players registered through referral code will appear here.
              </p>
            </div>
          ) : null}

          {players.map((player) => (
            <article
              key={player.referral_id}
              className="rounded-[1.5rem] border border-amber-300/15 bg-black/25 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="text-lg font-black text-amber-50">
                    {formatMemberId(player.player_id, player.member_code)}
                  </h3>

                  <p className="mt-1 text-sm font-bold text-amber-100/45">
                    Player {shortId(player.player_id)}
                  </p>

                  {player.username ? (
                    <p className="mt-1 text-xs font-bold text-amber-100/35">
                      {player.username}
                    </p>
                  ) : null}
                </div>

                <div className="flex flex-col items-end gap-2">
                  <span
                    className={[
                      "rounded-full border px-3 py-1 text-[11px] font-black uppercase tracking-[0.14em]",
                      getScopeClass(player.scope_kind),
                    ].join(" ")}
                  >
                    {getScopeLabel(player.scope_kind)}
                  </span>

                  {player.is_active_player ? (
                    <span className="rounded-full border border-emerald-300/25 bg-emerald-400/10 px-3 py-1 text-[11px] font-black uppercase tracking-[0.14em] text-emerald-100">
                      Active
                    </span>
                  ) : (
                    <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] font-black uppercase tracking-[0.14em] text-white/40">
                      Registered
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <div className="rounded-2xl border border-amber-300/10 bg-black/25 p-3">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-amber-100/40">
                    Deposit
                  </p>
                  <p className="mt-1 text-lg font-black text-amber-50">
                    {formatMMK(player.approved_deposit_total)}
                  </p>
                </div>

                <div className="rounded-2xl border border-amber-300/10 bg-black/25 p-3">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-amber-100/40">
                    Net Loss
                  </p>
                  <p className="mt-1 text-lg font-black text-amber-50">
                    {formatMMK(player.player_net_loss)}
                  </p>
                </div>

                <div className="rounded-2xl border border-amber-300/10 bg-black/25 p-3">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-amber-100/40">
                    Bets
                  </p>
                  <p className="mt-1 text-lg font-black text-amber-50">
                    {formatMMK(player.total_bet_debit)}
                  </p>
                </div>

                <div className="rounded-2xl border border-amber-300/10 bg-black/25 p-3">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-amber-100/40">
                    Payout
                  </p>
                  <p className="mt-1 text-lg font-black text-amber-50">
                    {formatMMK(player.total_payout_credit)}
                  </p>
                </div>
              </div>

              <div className="mt-3 rounded-2xl border border-amber-300/10 bg-black/25 p-3">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-100/40">
                  Owner Agent
                </p>
                <p className="mt-1 text-sm font-black text-amber-100">
                  {player.owner_display_name ?? "Agent"}
                </p>
                <p className="mt-1 text-xs font-bold text-amber-100/45">
                  Code: {player.owner_agent_code ?? "-"}
                </p>
              </div>

              <p className="mt-3 text-xs font-bold text-amber-100/35">
                Assigned: {formatDate(player.assigned_at)}
              </p>

              {player.active_rewarded_at ? (
                <p className="mt-1 text-xs font-bold text-emerald-100/65">
                  Active reward: {formatDate(player.active_rewarded_at)}
                </p>
              ) : null}
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}