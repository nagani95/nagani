// src/app/admin/users/page.tsx

import Link from "next/link";

import AdminShell from "@/components/admin/AdminShell";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type ProfileRow = {
  id: string;
  username: string | null;
  member_code: string | null;
  created_at: string;
};

type WalletRow = {
  profile_id: string;
  balance: number | string;
  updated_at: string | null;
};

type AgentJoin = {
  agent_code: string;
  display_name: string;
  status: "active" | "paused" | "disabled";
};

type ActiveReferralRow = {
  player_id: string;
  agent_code_snapshot: string;
  status: "active" | "removed";
  agent_profiles: AgentJoin | AgentJoin[] | null;
};

function formatMMK(amount: number | string | null | undefined) {
  const safeAmount = Number(amount ?? 0);

  return `${new Intl.NumberFormat("en-US").format(safeAmount)} MMK`;
}

function formatMemberId(profile: ProfileRow) {
  return profile.member_code || `NG-${profile.id.slice(0, 8).toUpperCase()}`;
}

function formatTime(value: string | null | undefined) {
  if (!value) return "—";

  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Yangon",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function normalizeAgent(agentProfiles: ActiveReferralRow["agent_profiles"]) {
  if (Array.isArray(agentProfiles)) {
    return agentProfiles[0] ?? null;
  }

  return agentProfiles;
}

function getAgentStatusClass(status: AgentJoin["status"] | null | undefined) {
  if (status === "active") {
    return "border-emerald-400/20 bg-emerald-400/10 text-emerald-100";
  }

  if (status === "paused") {
    return "border-amber-400/20 bg-amber-400/10 text-amber-100";
  }

  if (status === "disabled") {
    return "border-red-400/20 bg-red-400/10 text-red-100";
  }

  return "border-white/10 bg-white/[0.03] text-white/40";
}

export default async function AdminUsersPage() {
  const supabase = await createClient();

  const { data: profiles, error: profilesError } = await supabase
    .from("profiles")
    .select("id, username, member_code, created_at")
    .order("created_at", { ascending: false })
    .limit(50)
    .returns<ProfileRow[]>();

  const profileIds = (profiles ?? []).map((profile) => profile.id);

  const { data: wallets, error: walletsError } =
    profileIds.length > 0
      ? await supabase
          .from("wallets")
          .select("profile_id, balance, updated_at")
          .in("profile_id", profileIds)
          .returns<WalletRow[]>()
      : { data: [], error: null };

  const { data: activeReferrals, error: referralsError } =
    profileIds.length > 0
      ? await supabase
          .from("player_referrals")
          .select(
            `
            player_id,
            agent_code_snapshot,
            status,
            agent_profiles (
              agent_code,
              display_name,
              status
            )
          `
          )
          .eq("status", "active")
          .in("player_id", profileIds)
          .returns<ActiveReferralRow[]>()
      : { data: [], error: null };

  const walletByProfileId = new Map(
    (wallets ?? []).map((wallet) => [wallet.profile_id, wallet])
  );

  const referralByProfileId = new Map(
    (activeReferrals ?? []).map((referral) => [
      referral.player_id,
      {
        ...referral,
        agent: normalizeAgent(referral.agent_profiles),
      },
    ])
  );

  const loadedCount = profiles?.length ?? 0;
  const walletCount = wallets?.length ?? 0;
  const referralCount = activeReferrals?.length ?? 0;
  const totalLoadedBalance = (wallets ?? []).reduce(
    (sum, wallet) => sum + Number(wallet.balance ?? 0),
    0
  );

  const errors = [
    profilesError ? `Profiles: ${profilesError.message}` : null,
    walletsError ? `Wallets: ${walletsError.message}` : null,
    referralsError ? `Referrals: ${referralsError.message}` : null,
  ].filter((error): error is string => Boolean(error));

  return (
    <AdminShell
      title="Users"
      eyebrow="Member Records"
      description="Latest registered members with wallet balance, member code, referral assignment, and safe admin navigation."
      action={
        <Link
          href="/admin/referrals"
          className="rounded-full border border-amber-300/20 bg-amber-300/10 px-4 py-2 text-xs font-black text-amber-100/80 transition hover:bg-amber-300 hover:text-black"
        >
          Referral Assignment
        </Link>
      }
    >
      {errors.length > 0 ? (
        <section className="rounded-2xl border border-red-400/25 bg-red-950/25 p-4">
          <p className="text-sm font-black text-red-100">
            User records warning
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

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-amber-300/15 bg-amber-300/10 p-4">
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-amber-100/55">
            Loaded Members
          </p>
          <p className="mt-2 text-2xl font-black text-amber-100">
            {loadedCount}
          </p>
        </div>

        <div className="rounded-2xl border border-emerald-300/15 bg-emerald-400/10 p-4">
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-emerald-100/55">
            Wallets Found
          </p>
          <p className="mt-2 text-2xl font-black text-emerald-100">
            {walletCount}
          </p>
        </div>

        <div className="rounded-2xl border border-sky-300/15 bg-sky-400/10 p-4">
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-sky-100/55">
            Assigned Agents
          </p>
          <p className="mt-2 text-2xl font-black text-sky-100">
            {referralCount}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-white/40">
            Loaded Balance
          </p>
          <p className="mt-2 truncate text-2xl font-black text-amber-100">
            {formatMMK(totalLoadedBalance)}
          </p>
        </div>
      </section>

      <section className="mt-4 rounded-2xl border border-amber-300/12 bg-black/35 p-4">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.28em] text-white/35">
              Latest Loaded Members
            </p>
            <h2 className="mt-1 text-xl font-black text-amber-100">
              Member List
            </h2>
          </div>

          <p className="rounded-full border border-white/10 bg-black/30 px-4 py-2 text-xs font-black text-white/45">
            Showing latest {loadedCount}
          </p>
        </div>

        <div className="mt-4 overflow-hidden rounded-xl border border-white/10">
<div className="hidden border-b border-white/10 bg-white/[0.03] px-4 py-3 text-[11px] font-black uppercase tracking-[0.18em] text-white/35 xl:grid xl:grid-cols-[150px_1.2fr_160px_160px_150px_150px]">
  <p>Member</p>
  <p>Phone / Login</p>
  <p>Balance</p>
  <p>Agent</p>
  <p>Joined</p>
  <p>Controls</p>
</div>

          {loadedCount === 0 ? (
            <div className="px-4 py-5 text-sm font-bold text-white/45">
              No members found.
            </div>
          ) : null}

          {(profiles ?? []).map((profile) => {
            const wallet = walletByProfileId.get(profile.id);
            const referral = referralByProfileId.get(profile.id);
            const agent = referral?.agent ?? null;

            return (
              <div
                key={profile.id}
                className="grid gap-3 border-b border-white/10 px-4 py-4 text-sm last:border-b-0 xl:grid-cols-[150px_1.2fr_160px_160px_150px_150px] xl:items-center"
              >
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.16em] text-white/30 xl:hidden">
                    Member
                  </p>
                  <p className="font-black text-amber-100">
                    {formatMemberId(profile)}
                  </p>
                </div>

<div className="min-w-0">
  <p className="text-[10px] font-black uppercase tracking-[0.16em] text-white/30 xl:hidden">
    Phone / Login
  </p>
  <p className="break-all text-base font-black text-amber-100">
    {profile.username || "—"}
  </p>
  <p className="mt-1 break-all text-[10px] font-semibold text-white/25">
    ID: {profile.id.slice(0, 8).toUpperCase()}
  </p>
</div>

                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.16em] text-white/30 xl:hidden">
                    Balance
                  </p>
                  <p className="font-black text-emerald-100">
                    {formatMMK(wallet?.balance)}
                  </p>
                  <p className="mt-1 text-[11px] font-semibold text-white/30">
                    {formatTime(wallet?.updated_at)}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.16em] text-white/30 xl:hidden">
                    Agent
                  </p>

                  <span
                    className={`inline-flex max-w-full rounded-full border px-3 py-1 text-[11px] font-black uppercase tracking-[0.12em] ${getAgentStatusClass(
                      agent?.status
                    )}`}
                  >
                    {agent?.display_name ?? "No Agent"}
                  </span>

                  {agent ? (
                    <p className="mt-1 text-[11px] font-bold text-white/35">
                      {agent.agent_code}
                    </p>
                  ) : null}
                </div>

                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.16em] text-white/30 xl:hidden">
                    Joined
                  </p>
                  <p className="font-bold text-white/50">
                    {formatTime(profile.created_at)}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 xl:justify-end">
                  <Link
                    href="/admin/wallet-requests"
                    className="rounded-full border border-emerald-300/15 bg-emerald-400/10 px-3 py-2 text-xs font-black text-emerald-100/80 transition hover:bg-emerald-300 hover:text-black"
                  >
                    Balance
                  </Link>

                  <Link
                    href="/admin/referrals"
                    className="rounded-full border border-amber-300/15 bg-amber-300/10 px-3 py-2 text-xs font-black text-amber-100/80 transition hover:bg-amber-300 hover:text-black"
                  >
                    Referral
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </AdminShell>
  );
}