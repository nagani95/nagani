// src/app/admin/users/page.tsx

import Link from "next/link";

import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type ProfileRow = {
  id: string;
};

type WalletRow = {
  profile_id: string;
  balance: number | string;
  updated_at: string | null;
};

function formatMMK(amount: number | string | null | undefined) {
  const safeAmount = Number(amount ?? 0);

  return `${new Intl.NumberFormat("en-US").format(safeAmount)} MMK`;
}

function formatMemberId(profileId: string) {
  return `NG-${profileId.slice(0, 8).toUpperCase()}`;
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

export default async function AdminUsersPage() {
  const supabase = await createClient();

  const { data: profiles, error: profilesError } = await supabase
    .from("profiles")
    .select("id")
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

  const walletByProfileId = new Map(
    (wallets ?? []).map((wallet) => [wallet.profile_id, wallet])
  );

  const errors = [
    profilesError ? `Profiles: ${profilesError.message}` : null,
    walletsError ? `Wallets: ${walletsError.message}` : null,
  ].filter(Boolean);

  return (
    <main className="min-h-screen bg-[#090202] px-5 py-6 text-white">
      <section className="mx-auto w-full max-w-6xl">
        <Link href="/admin" className="text-sm font-bold text-amber-300">
          ← Admin Home
        </Link>

        <header className="mt-6 rounded-[2rem] border border-red-500/25 bg-gradient-to-br from-red-950 via-[#160303] to-black p-6">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-red-200/60">
            Member Records
          </p>
          <h1 className="mt-3 text-4xl font-black text-amber-100">Users</h1>
          <p className="mt-3 text-sm leading-6 text-amber-50/65">
            View registered members and their current wallet balances.
          </p>
        </header>

        {errors.length > 0 ? (
          <section className="mt-6 rounded-[1.5rem] border border-red-400/30 bg-red-950/30 p-5">
            <p className="text-sm font-black text-red-100">
              User records warning
            </p>

            <div className="mt-3 space-y-2">
              {errors.map((error) => (
                <p key={error} className="text-xs text-red-100/75">
                  {error}
                </p>
              ))}
            </div>
          </section>
        ) : null}

        <section className="mt-6 rounded-[1.75rem] border border-amber-400/15 bg-black/40 p-5">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-white/35">
                Latest Loaded Members
              </p>
              <h2 className="mt-2 text-2xl font-black text-amber-100">
                Member List
              </h2>
            </div>

            <div className="rounded-2xl border border-amber-400/20 bg-amber-400/10 px-5 py-4 text-right">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-200/55">
                Showing
              </p>
              <p className="mt-1 text-3xl font-black text-amber-100">
                {(profiles ?? []).length}
              </p>
            </div>
          </div>

          <div className="mt-5 overflow-hidden rounded-[1.25rem] border border-white/10">
            <div className="hidden grid-cols-[160px_1fr_180px_180px] border-b border-white/10 bg-white/[0.03] px-5 py-4 text-xs font-black uppercase tracking-[0.2em] text-white/35 md:grid">
              <p>Member ID</p>
              <p>Profile ID</p>
              <p>Wallet Balance</p>
              <p>Wallet Updated</p>
            </div>

            {(profiles ?? []).length === 0 ? (
              <div className="px-5 py-5 text-sm font-bold text-white/45">
                No members found.
              </div>
            ) : null}

            {(profiles ?? []).map((profile) => {
              const wallet = walletByProfileId.get(profile.id);

              return (
                <div
                  key={profile.id}
                  className="grid gap-3 border-b border-white/10 px-5 py-4 text-sm last:border-b-0 md:grid-cols-[160px_1fr_180px_180px] md:items-center"
                >
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.16em] text-white/30 md:hidden">
                      Member ID
                    </p>
                    <p className="font-black text-amber-100">
                      {formatMemberId(profile.id)}
                    </p>
                  </div>

                  <div className="min-w-0">
                    <p className="text-[10px] font-black uppercase tracking-[0.16em] text-white/30 md:hidden">
                      Profile ID
                    </p>
                    <p className="break-all font-bold text-white/45">
                      {profile.id}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.16em] text-white/30 md:hidden">
                      Wallet Balance
                    </p>
                    <p className="font-black text-emerald-100">
                      {formatMMK(wallet?.balance)}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.16em] text-white/30 md:hidden">
                      Wallet Updated
                    </p>
                    <p className="font-bold text-white/50">
                      {formatTime(wallet?.updated_at)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </section>
    </main>
  );
}