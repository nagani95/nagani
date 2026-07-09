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
import NaganiLobbyBgm from "@/components/nagani-v2/NaganiLobbyBgm";
import { createClient } from "@/lib/supabase/server";
import { naganiAssets } from "@/lib/naganiAssets";

export const metadata: Metadata = {
  title: "Game Lobby | နဂါးနီရွှေအိုး",
  description: "နဂါးနီရွှေအိုး game lobby.",
};

const GAME_MIN_BALANCE = 1000;
const GAME_SELECT_CARD_IMAGE = "/assets/nagani/v2/lobbycard.png";

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
      image: "/assets/nagani/v2/dicecard.png",
      imageBoxClass: "h-[104%] w-[104%]",
      imageTranslateX: "-6px",
      href: canEnterGame ? "/six-animal" : "/cashier",
      status: canEnterGame ? "ဝင်ကစားမည်" : "ငွေဖြည့်ရန်",
    },
    {
      title: "နဂါးနီ Slot",
      subtitle: "ရွှေအိုး Slot ဂိမ်း",
      image: "/assets/nagani/v2/slotcard.png",
      imageBoxClass: "h-[76%] w-[76%]",
      imageTranslateX: "-6px",
      href: canEnterGame ? "/nagani-slot" : "/cashier",
      status: canEnterGame ? "ဝင်ကစားမည်" : "ငွေဖြည့်ရန်",
    },
  ];

  return (
<NaganiPageShell
  background={<NaganiVideoBackground />}
  bottomNav={<NaganiBottomNav />}
  contentClassName="relative z-10 h-[100svh] overflow-hidden"
>
  <NaganiLobbyBgm />

  <section className="relative h-[100svh] overflow-hidden px-4 pb-28 pt-[env(safe-area-inset-top)] text-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(255,215,122,0.16),transparent_34%),linear-gradient(180deg,rgba(0,0,0,0.08),rgba(0,0,0,0.42)_46%,rgba(0,0,0,0.86))]" />

        {/* Home-style ID / balance card */}
        <div className="absolute left-[1.4%] top-[2.7%] z-30 h-[7.25rem] w-[7.35rem]">
          <img
            src="/assets/nagani/v2/home-id-balance-card.png"
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 h-full w-full select-none object-fill drop-shadow-[0_12px_22px_rgba(0,0,0,0.55)]"
            draggable={false}
          />

          <div className="relative z-10 flex h-full flex-col items-center justify-center px-3 pb-2.5 pt-3 text-center">
            <div className="w-full">
              <p className="text-[0.58rem] font-black tracking-[0.14em] text-[#f7dfaa]/70">
                ID
              </p>
              <p className="mt-0.5 text-[0.88rem] font-black leading-none tracking-[0.1em] text-[#ffd77a] drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)]">
                {profile?.member_code ?? "------"}
              </p>
            </div>

            <div className="my-2 h-px w-[72%] bg-gradient-to-r from-transparent via-[#ffd77a]/55 to-transparent" />

            <div className="w-full">
              <p className="text-[0.58rem] font-bold leading-none text-[#f7dfaa]/70">
                သင့်ငွေ
              </p>
              <p className="mt-1 text-[0.72rem] font-black leading-none text-[#ffd77a] drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)]">
                {formatMMK(playableBalance)} ကျပ်
              </p>
            </div>
          </div>
        </div>

        {/* Same home top buttons */}
        <NaganiHomeTopControls />

        {/* Home-style center logo */}
        <div className="absolute left-1/2 top-[5.2%] z-20 flex -translate-x-1/2 flex-col items-center">
          <div
            className="h-36 w-36 bg-contain bg-center bg-no-repeat drop-shadow-[0_12px_28px_rgba(0,0,0,0.82)]"
            style={{
              backgroundImage: `url(${naganiAssets.shared.logo.conceptV1})`,
            }}
            aria-label="နဂါးနီရွှေအိုး"
          />

          <div className="-mt-3 rounded-full border border-[#ffd77a]/30 bg-[#090202]/42 px-4 py-1 text-sm font-black tracking-[0.12em] text-[#ffd77a] shadow-lg shadow-black/50 backdrop-blur-[2px]">
            ရွှေအိုး
          </div>
        </div>

        <div className="relative z-10 mx-auto flex h-full w-full max-w-[430px] flex-col pt-[14.9rem]">
          {!canEnterGame ? (
            <Link
              href={joinHref ?? "/cashier"}
              className="mb-3 block rounded-full border border-[#ffd77a]/55 bg-gradient-to-b from-[#d93a2b] via-[#941313] to-[#3a0707] px-5 py-3 text-center text-sm font-black text-[#fff3d0] shadow-[0_12px_26px_rgba(0,0,0,0.48)]"
            >
              အနည်းဆုံး ၁,၀၀၀ ကျပ် လိုအပ်ပါသည် · ငွေဖြည့်ရန်
            </Link>
          ) : null}

          <div className="grid gap-3.5">
            {games.map((game) => (
              <Link
                key={game.href}
                href={game.href}
                className="group relative block aspect-[3/1] w-full overflow-visible rounded-[1.45rem] drop-shadow-[0_18px_34px_rgba(0,0,0,0.72)] transition active:scale-[0.985]"
              >
                <img
                  src={GAME_SELECT_CARD_IMAGE}
                  alt=""
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 h-full w-full select-none object-fill"
                  draggable={false}
                />

                <div className="pointer-events-none absolute inset-0 rounded-[1.45rem] bg-[radial-gradient(circle_at_23%_48%,rgba(255,215,122,0.13),transparent_24%),linear-gradient(90deg,rgba(255,215,122,0.05),transparent_28%,rgba(0,0,0,0.1))]" />

                {/* Left icon chamber */}
                <div className="absolute left-[5.3%] top-1/2 z-10 flex h-[82%] w-[24.5%] -translate-y-1/2 items-center justify-center">
<div
  className={`flex ${game.imageBoxClass} items-center justify-center`}
  style={{
    transform: `translateX(${game.imageTranslateX})`,
  }}
>
                    <img
                      src={game.image}
                      alt=""
                      className="max-h-full max-w-full object-contain object-center drop-shadow-[0_10px_18px_rgba(0,0,0,0.72)] transition duration-300 group-active:scale-[0.97]"
                      draggable={false}
                    />
                  </div>
                </div>

                {/* Right text area */}
                <div className="absolute left-[34.5%] right-[6.5%] top-[16%] bottom-[14%] z-10 flex flex-col justify-start">
                  <h2 className="text-[clamp(0.98rem,4.5vw,1.3rem)] font-black leading-[1.12] tracking-[0.01em] text-[#fff3d0] drop-shadow-[0_2px_5px_rgba(0,0,0,0.9)]">
                    {game.title}
                  </h2>

                  <p className="mt-1.5 text-[clamp(0.56rem,2.7vw,0.74rem)] font-bold leading-[1.25] text-[#f7dfaa]/78 drop-shadow-[0_2px_4px_rgba(0,0,0,0.84)]">
                    {game.subtitle}
                  </p>

                  <div className="mt-3 inline-flex w-fit self-start rounded-full border border-[#ffd77a]/62 bg-gradient-to-b from-[#b82419] via-[#7c100d] to-[#2c0303] px-4 py-1.5 text-[clamp(0.56rem,2.7vw,0.72rem)] font-black leading-none text-[#ffd77a] shadow-[0_8px_16px_rgba(0,0,0,0.42),0_0_14px_rgba(255,215,122,0.12),inset_0_1px_0_rgba(255,243,208,0.24)]">
                    {game.status}
                  </div>
                </div>

                <div className="pointer-events-none absolute inset-x-[8%] top-[8%] z-20 h-px bg-gradient-to-r from-transparent via-[#fff3d0]/38 to-transparent" />
                <div className="pointer-events-none absolute inset-x-[8%] bottom-[8%] z-20 h-px bg-gradient-to-r from-transparent via-[#b97823]/34 to-transparent" />
              </Link>
            ))}
          </div>

          <div className="mt-5 text-center">
            <p className="text-[0.72rem] font-black tracking-[0.08em] text-[#ffd77a] drop-shadow-[0_2px_5px_rgba(0,0,0,0.9)]">
              နဂါးနီရွှေအိုး
            </p>

            <p className="mt-1 text-[0.58rem] font-semibold leading-4 text-[#f7dfaa]/62">
              အသက် ၁၈ နှစ်အထက်များအတွက်သာ · တာဝန်ယူကစားပါ
            </p>
          </div>
        </div>
      </section>
    </NaganiPageShell>
  );
}