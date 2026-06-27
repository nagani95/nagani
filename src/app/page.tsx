// src/app/page.tsx

import Link from "next/link";

import {
  NaganiBottomNav,
  NaganiPageShell,
  NaganiPromoPopup,
  NaganiVideoBackground,
} from "@/components/nagani-v2";
import NaganiHomeTopControls from "@/components/nagani-v2/NaganiHomeTopControls";
import NaganiLobbyBgm from "@/components/nagani-v2/NaganiLobbyBgm";
import NaganiHomeWelcomeAnnouncement from "@/components/nagani-v2/NaganiHomeWelcomeAnnouncement";
import NaganiLobbyBootGate from "@/components/nagani-v2/NaganiLobbyBootGate";
import { naganiAssets } from "@/lib/naganiAssets";
import { createClient } from "@/lib/supabase/server";

const SIX_ANIMAL_MIN_BALANCE = 1000;

function toSafeBalance(value: number | string | null | undefined) {
  const amount = Number(value ?? 0);

  return Number.isFinite(amount) ? amount : 0;
}

function formatMMK(amount: number) {
  return new Intl.NumberFormat("en-US").format(amount);
}

export default async function HomePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

let walletBalance = 0;
let walletBonusBalance = 0;
let memberCode: string | null = null;
let promoSeenAt: string | null = null;

  if (user) {
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
      .select("member_code,promo_welcome_recharge_seen_at")
      .eq("id", user.id)
      .maybeSingle<{
        member_code: string | null;
        promo_welcome_recharge_seen_at: string | null;
      }>();

walletBalance = toSafeBalance(wallet?.balance);
walletBonusBalance = toSafeBalance(wallet?.bonus_balance);
memberCode = profile?.member_code ?? null;
promoSeenAt = profile?.promo_welcome_recharge_seen_at ?? null;
  }

const playableBalance = walletBalance + walletBonusBalance;

const canEnterSixAnimal =
  Boolean(user) && playableBalance >= SIX_ANIMAL_MIN_BALANCE;

  const memberIdLabel = user ? memberCode ?? "------" : "ဧည့်သည်";

  const playHref = !user
    ? "/login"
    : canEnterSixAnimal
      ? "/six-animal"
      : "/cashier";

  const playLabel = !user
    ? "ဝင်ရောက်ရန်"
    : canEnterSixAnimal
      ? "ကစားပွဲသို့"
      : "ငွေဖြည့်ရန်";

        async function markPromoSeen() {
    "use server";

    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    await supabase
      .from("profiles")
      .update({
        promo_welcome_recharge_seen_at: new Date().toISOString(),
      })
      .eq("id", user.id);
  }

  return (
    <NaganiLobbyBootGate>
      <NaganiPageShell
        background={<NaganiVideoBackground />}
        bottomNav={<NaganiBottomNav />}
        contentClassName="relative z-10 h-[100svh] overflow-hidden"
      >
        <NaganiLobbyBgm />
        <NaganiHomeWelcomeAnnouncement />

        <NaganiPromoPopup
          isLoggedIn={Boolean(user)}
          showForLoggedInUser={Boolean(user) && !promoSeenAt}
          markSeenAction={markPromoSeen}
        />

        <section className="relative h-[100svh] overflow-hidden">
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
                  {memberIdLabel}
                </p>
              </div>

              <div className="my-2 h-px w-[72%] bg-gradient-to-r from-transparent via-[#ffd77a]/55 to-transparent" />

              <div className="w-full">
                <p className="text-[0.58rem] font-bold leading-none text-[#f7dfaa]/70">
                  သင့်
                </p>
                <p className="mt-1 text-[0.72rem] font-black leading-none text-[#ffd77a] drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)]">
                  {formatMMK(playableBalance)} ကျပ်
                </p>
              </div>
            </div>
          </div>

          <NaganiHomeTopControls />

          <div className="absolute left-1/2 top-[5.6%] z-20 flex -translate-x-1/2 flex-col items-center">
            <div
              className="h-36 w-36 bg-contain bg-center bg-no-repeat drop-shadow-[0_12px_28px_rgba(0,0,0,0.82)]"
              style={{
                backgroundImage: `url(${naganiAssets.shared.logo.conceptV1})`,
              }}
              aria-label="ရွှေအိုး"
            />

            <div className="-mt-3 rounded-full border border-[#ffd77a]/30 bg-[#090202]/42 px-4 py-1 text-sm font-black tracking-[0.12em] text-[#ffd77a] shadow-lg shadow-black/50 backdrop-blur-[2px]">
              ရွှေအိုး
            </div>
          </div>

          <div className="pointer-events-none absolute left-1/2 top-[58.85%] z-10 h-36 w-36 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,215,122,0.46)_0%,rgba(214,168,79,0.18)_38%,transparent_72%)] blur-xl" />

          <div className="pointer-events-none absolute left-1/2 top-[58.85%] z-10 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#ffd77a]/25 bg-[#ffd77a]/10 shadow-[0_0_34px_rgba(255,215,122,0.45)]" />

          <Link
            href={playHref}
            aria-label={playLabel}
            className="absolute left-1/2 top-[58.85%] z-20 h-[3.35rem] w-[3.35rem] -translate-x-1/2 -translate-y-1/2 rounded-[0.72rem] bg-cover bg-center bg-no-repeat shadow-[0_0_16px_rgba(255,243,208,0.65),0_0_34px_rgba(255,215,122,0.42),0_12px_26px_rgba(0,0,0,0.58)] ring-1 ring-[#fff3d0]/55 transition active:scale-[0.95]"
            style={{
              backgroundImage: "url('/assets/nagani/v2/dice.jpg')",
            }}
          />

          <div className="absolute inset-x-0 top-[65.2%] z-20 flex justify-center px-5">
            <div className="relative">
              <div className="pointer-events-none absolute inset-[-0.55rem] rounded-full bg-[radial-gradient(circle,rgba(255,215,122,0.32)_0%,rgba(214,168,79,0.14)_42%,transparent_72%)] blur-md" />

              <Link
                href={playHref}
                className="relative block overflow-hidden rounded-full border border-[#ffd77a]/65 bg-gradient-to-b from-[#d93a2b] via-[#941313] to-[#3a0707] px-12 py-4 text-base font-black leading-6 text-[#fff3d0] shadow-[0_18px_38px_rgba(0,0,0,0.66),0_0_26px_rgba(255,215,122,0.28),inset_0_1px_0_rgba(255,243,208,0.32),inset_0_-8px_18px_rgba(0,0,0,0.28)] ring-1 ring-[#7a4a12]/45 transition active:scale-[0.98]"
              >
                <span className="pointer-events-none absolute inset-x-4 top-1 h-1/2 rounded-full bg-gradient-to-b from-white/20 via-white/8 to-transparent" />
                <span className="pointer-events-none absolute inset-x-5 bottom-1 h-1/3 rounded-full bg-gradient-to-t from-black/20 to-transparent" />

                <span className="relative tracking-[0.02em] drop-shadow-[0_2px_4px_rgba(0,0,0,0.72)]">
                  {playLabel}
                </span>
              </Link>
            </div>
          </div>
        </section>
      </NaganiPageShell>
    </NaganiLobbyBootGate>
  );
}