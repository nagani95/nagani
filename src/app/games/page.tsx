// src/app/games/page.tsx

import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import {
  NaganiBottomNav,
  NaganiPageShell,
  NaganiVideoBackground,
} from "@/components/nagani-v2";
import NaganiHomeTopControls from "@/components/nagani-v2/NaganiHomeTopControls";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Game Lobby | နဂါးနီရွှေအိုး",
  description: "နဂါးနီရွှေအိုး game lobby.",
};

const GAME_MIN_BALANCE = 1000;

function toSafeBalance(value: number | string | null | undefined) {
  const amount = Number(value ?? 0);
  return Number.isFinite(amount) ? amount : 0;
}

function formatMMK(amount: number) {
  return new Intl.NumberFormat("en-US").format(amount);
}

export default async function GamesLobbyPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: wallet } = await supabase
    .from("wallets")
    .select("balance,bonus_balance")
    .eq("profile_id", user.id)
    .maybeSingle<{
      balance: number | string | null;
      bonus_balance: number | string | null;
    }>();

  const { data: profile } = await supabase
    .from("profiles")
    .select("member_code")
    .eq("id", user.id)
    .maybeSingle<{
      member_code: string | null;
    }>();

  const playableBalance =
    toSafeBalance(wallet?.balance) + toSafeBalance(wallet?.bonus_balance);

  const canEnterGame = playableBalance >= GAME_MIN_BALANCE;
  const joinHref = canEnterGame ? undefined : "/cashier";

  const games = [
    {
      title: "၆ ကောင်ဂျင်",
      subtitle: "မြန်မာရိုးရာ အံစာတုံးပွဲ",
      image: "/assets/nagani/v2/dice.jpg",
      href: canEnterGame ? "/six-animal" : "/cashier",
      status: canEnterGame ? "ဝင်ကစားမည်" : "ငွေဖြည့်ရန်",
    },
    {
      title: "နဂါးနီ Slot",
      subtitle: "ရွှေအိုး Slot ဂိမ်း",
      image: "/assets/nagani/slot/symbols/gold-pot.png",
      href: canEnterGame ? "/nagani-slot" : "/cashier",
      status: canEnterGame ? "ဝင်ကစားမည်" : "ငွေဖြည့်ရန်",
    },
  ];

  return (
    <NaganiPageShell
      background={<NaganiVideoBackground />}
      bottomNav={<NaganiBottomNav />}
      contentClassName="relative z-10 min-h-[100svh] overflow-hidden"
    >
      <section className="relative min-h-[100svh] overflow-hidden px-4 pb-28 pt-[env(safe-area-inset-top)] text-white">
        <NaganiHomeTopControls />

        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_22%,rgba(255,215,122,0.18),transparent_38%),linear-gradient(180deg,rgba(0,0,0,0.18),rgba(0,0,0,0.62)_58%,rgba(0,0,0,0.82))]" />

        <div className="relative z-10 mx-auto flex w-full max-w-[430px] flex-col">
          <div className="pt-7 text-center">
            <p className="text-xs font-black tracking-[0.22em] text-[#ffd77a]/80">
              နဂါးနီရွှေအိုး
            </p>

            <h1 className="mt-2 text-2xl font-black tracking-[0.04em] text-[#fff3d0] drop-shadow-[0_3px_8px_rgba(0,0,0,0.9)]">
              ကစားပွဲ Lobby
            </h1>

            <p className="mt-2 text-xs font-bold text-[#f7dfaa]/72">
              ကစားချင်သော game room ကိုရွေးပါ
            </p>
          </div>

          <div className="mt-5 rounded-[1.35rem] border border-[#ffd77a]/35 bg-[#180505]/72 p-4 shadow-[0_18px_42px_rgba(0,0,0,0.58),inset_0_1px_0_rgba(255,243,208,0.14)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[0.62rem] font-black tracking-[0.16em] text-[#f7dfaa]/62">
                  ID
                </p>
                <p className="mt-1 text-sm font-black text-[#ffd77a]">
                  {profile?.member_code ?? "------"}
                </p>
              </div>

              <div className="text-right">
                <p className="text-[0.62rem] font-bold text-[#f7dfaa]/62">
                  သင့်ငွေ
                </p>
                <p className="mt-1 text-sm font-black text-[#ffd77a]">
                  {formatMMK(playableBalance)} ကျပ်
                </p>
              </div>
            </div>

            {!canEnterGame ? (
              <Link
                href={joinHref ?? "/cashier"}
                className="mt-4 block rounded-full border border-[#ffd77a]/55 bg-gradient-to-b from-[#d93a2b] via-[#941313] to-[#3a0707] px-5 py-3 text-center text-sm font-black text-[#fff3d0] shadow-[0_12px_26px_rgba(0,0,0,0.48)]"
              >
                အနည်းဆုံး ၁,၀၀၀ ကျပ် လိုအပ်ပါသည် · ငွေဖြည့်ရန်
              </Link>
            ) : null}
          </div>

          <div className="mt-5 grid gap-4">
            {games.map((game) => (
              <Link
                key={game.href}
                href={game.href}
                className="group relative overflow-hidden rounded-[1.45rem] border border-[#ffd77a]/42 bg-[#100303]/78 p-3 shadow-[0_18px_38px_rgba(0,0,0,0.62),inset_0_1px_0_rgba(255,243,208,0.12)] active:scale-[0.985]"
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_18%,rgba(255,215,122,0.18),transparent_36%),linear-gradient(135deg,rgba(126,16,12,0.72),rgba(10,2,2,0.76)_58%,rgba(0,0,0,0.86))]" />

                <div className="relative z-10 flex items-center gap-4">
                  <div className="grid h-24 w-24 shrink-0 place-items-center rounded-[1.15rem] border border-[#ffd77a]/38 bg-black/32 shadow-[inset_0_1px_0_rgba(255,243,208,0.18)]">
                    <img
                      src={game.image}
                      alt=""
                      className="h-20 w-20 object-contain drop-shadow-[0_8px_14px_rgba(0,0,0,0.72)]"
                      draggable={false}
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h2 className="text-lg font-black text-[#fff3d0] drop-shadow-[0_2px_5px_rgba(0,0,0,0.86)]">
                      {game.title}
                    </h2>

                    <p className="mt-1 text-xs font-bold text-[#f7dfaa]/70">
                      {game.subtitle}
                    </p>

                    <div className="mt-4 inline-flex rounded-full border border-[#ffd77a]/48 bg-[#4d0a08]/78 px-4 py-2 text-xs font-black text-[#ffd77a] shadow-[inset_0_1px_0_rgba(255,243,208,0.16)]">
                      {game.status}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <p className="mt-5 text-center text-[0.58rem] font-semibold leading-4 text-[#f7dfaa]/54">
            အသက် ၁၈ နှစ်အထက်များအတွက်သာ · တာဝန်ယူကစားပါ
          </p>
        </div>
      </section>
    </NaganiPageShell>
  );
}