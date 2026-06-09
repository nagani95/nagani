//src>app>page.tsx

import Link from "next/link";

import AppShell from "@/components/layout/AppShell";
import LobbyGameCards from "@/components/nagani/LobbyGameCards";
import LobbyHero from "@/components/nagani/LobbyHero";
import LobbyRecentActivity from "@/components/nagani/LobbyRecentActivity";
import { naganiAssets } from "@/lib/naganiAssets";
import { signInAnonymously } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";


const games = [
  {
    title: "Six Animal",
    subtitle: "Traditional animal dice live room",
    href: "/six-animal",
    tag: "Live Dice",
  },
  {
    title: "Thirty Six",
    subtitle: "Traditional 36-animal draw game",
    href: "/thirty-six",
    tag: "Draw Game",
  },
];

function formatMMK(amount: number) {
  return new Intl.NumberFormat("en-US").format(amount);
}

export default async function HomePage() {
  // 1. Check if user already has an active anonymous session
const supabase = await createClient();
const {
  data: { user },
} = await supabase.auth.getUser();

let walletBalance = 0;

if (user) {
  const { data: wallet } = await supabase
    .from("wallets")
    .select("balance")
    .eq("profile_id", user.id)
    .maybeSingle<{ balance: number | string | null }>();

  walletBalance = Number(wallet?.balance ?? 0);
}

  return (
    <AppShell>
      <header className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className="h-20 w-20 shrink-0 bg-contain bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${naganiAssets.shared.logo.conceptV1})`,
            }}
            aria-label="Nagani dragon mark"
          />

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-300/70">
              Nagani
            </p>
<h1 className="mt-1 text-2xl font-black tracking-tight text-amber-100">
  Nagani Traditional
</h1>
          </div>
        </div>

        {/* 2. Show connected status, or the login button */}
{user ? (
  <div className="rounded-full border border-green-400/30 bg-green-400/10 px-3 py-1 text-xs font-bold text-green-200">
    Wallet Connected
  </div>
) : (
<div className="flex items-center gap-2">
  <Link
    href="/login"
    className="rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-2 text-xs font-bold text-amber-200 transition hover:bg-amber-400/20 hover:text-white"
  >
    Login
  </Link>

  <Link
    href="/register"
    className="rounded-full border border-amber-300/40 bg-amber-300 px-4 py-2 text-xs font-black text-[#210807] shadow-lg shadow-black/20 transition hover:bg-amber-200"
  >
    Register
  </Link>

  <form action={signInAnonymously}>
    <button
      type="submit"
      className="rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-2 text-xs font-bold text-amber-200 transition-colors hover:bg-amber-400/20 hover:text-white"
    >
      Play Demo
    </button>
  </form>
</div>
)}
      </header>

<LobbyHero
  balanceLabel={`${formatMMK(walletBalance)} MMK`}
  statusLabel="Open"
/>

      <LobbyGameCards games={games} />

      <LobbyRecentActivity />
    </AppShell>
  );
}