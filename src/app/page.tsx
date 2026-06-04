//src>app>page.tsx

import AppShell from "@/components/layout/AppShell";
import LobbyGameCards from "@/components/nagani/LobbyGameCards";
import LobbyHero from "@/components/nagani/LobbyHero";
import LobbyRecentActivity from "@/components/nagani/LobbyRecentActivity";
import { naganiAssets } from "@/lib/naganiAssets";
import { signInAnonymously } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";

const games = [
  {
    title: "၆ ကောင်ဂျင်",
    subtitle: "Myanmar traditional animal dice game",
    href: "/six-animal",
    tag: "Animal Dice",
  },
  {
    title: "၃၆ ကောင်ထီ",
    subtitle: "36-animal traditional draw game",
    href: "/thirty-six",
    tag: "Animal Draw",
  },
];

export default async function HomePage() {
  // 1. Check if user already has an active anonymous session
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

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
              နဂါးနီ
            </h1>
          </div>
        </div>

        {/* 2. Show connected status, or the login button */}
        {user ? (
          <div className="rounded-full border border-green-400/30 bg-green-400/10 px-3 py-1 text-xs font-bold text-green-200">
            Wallet Connected
          </div>
        ) : (
          <form action={signInAnonymously}>
            <button
              type="submit"
              className="rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-2 text-xs font-bold text-amber-200 hover:bg-amber-400/20 hover:text-white transition-colors cursor-pointer"
            >
              Play Demo
            </button>
          </form>
        )}
      </header>

      <LobbyHero balanceLabel={user ? "Wallet Active" : "0 MMK"} statusLabel="Open" />

      <LobbyGameCards games={games} />

      <LobbyRecentActivity />
    </AppShell>
  );
}