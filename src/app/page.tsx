// src/app/page.tsx

import Link from "next/link";

import {
  NaganiBottomNav,
  NaganiFloatingSupport,
  NaganiPageShell,
  NaganiVideoBackground,
} from "@/components/nagani-v2";
import { naganiAssets } from "@/lib/naganiAssets";
import { createClient } from "@/lib/supabase/server";

const SIX_ANIMAL_MIN_BALANCE = 1000;

function formatMMK(amount: number) {
  return new Intl.NumberFormat("en-US").format(amount);
}

function toSafeBalance(value: number | string | null | undefined) {
  const amount = Number(value ?? 0);

  return Number.isFinite(amount) ? amount : 0;
}

export default async function HomePage() {
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

    walletBalance = toSafeBalance(wallet?.balance);
  }

  const canEnterSixAnimal = Boolean(user) && walletBalance >= SIX_ANIMAL_MIN_BALANCE;

  const playHref = !user ? "/login" : canEnterSixAnimal ? "/six-animal" : "/cashier";
  const playLabel = !user
    ? "ဝင်ရောက်ရန် လိုအပ်ပါသည်"
    : canEnterSixAnimal
      ? "ကစားပွဲသို့"
      : "ငွေဖြည့်ရန် လိုအပ်ပါသည်";

  return (
    <NaganiPageShell
      background={<NaganiVideoBackground />}
      bottomNav={<NaganiBottomNav />}
      floatingSupport={<NaganiFloatingSupport />}
    >
      <section className="relative flex min-h-screen flex-col px-5 pb-8 pt-[calc(1.2rem+env(safe-area-inset-top))]">
        <header className="flex items-center justify-between gap-3">
          <div
            className="h-16 w-16 shrink-0 bg-contain bg-center bg-no-repeat drop-shadow-[0_8px_18px_rgba(0,0,0,0.7)]"
            style={{
              backgroundImage: `url(${naganiAssets.shared.logo.conceptV1})`,
            }}
            aria-label="နဂါးနီ"
          />

          <div className="rounded-full border border-[#d6a84f]/25 bg-black/35 px-4 py-2 text-right shadow-lg shadow-black/30 backdrop-blur-md">
            <div className="text-[0.65rem] font-semibold text-[#f7dfaa]/65">
              လက်ကျန်ငွေ
            </div>
            <div className="mt-0.5 text-sm font-black text-[#ffd77a]">
              {formatMMK(walletBalance)} ကျပ်
            </div>
          </div>
        </header>

        <div className="flex flex-1 flex-col items-center justify-center pb-24 text-center">
          <div className="mb-7">
            <h1 className="text-4xl font-black tracking-[0.14em] text-[#ffd77a] drop-shadow-[0_4px_14px_rgba(0,0,0,0.8)]">
              နဂါးနီ
            </h1>
            <p className="mt-3 text-sm font-semibold leading-6 text-[#fff3d0]/78">
              မြန်မာ့ရိုးရာ တော်ဝင်ပွဲခန်းမ
            </p>
          </div>

          <Link
            href={playHref}
            className="group flex flex-col items-center focus:outline-none"
            aria-label={playLabel}
          >
            <div className="relative flex h-44 w-44 items-center justify-center rounded-full border border-[#ffd77a]/35 bg-radial-[circle_at_50%_35%] from-[#fff3d0] via-[#d6a84f] to-[#5a2f18] shadow-[0_24px_70px_rgba(0,0,0,0.72)] transition group-active:scale-[0.98]">
              <div className="absolute inset-[-1.1rem] rounded-full border border-[#d6a84f]/15 bg-[#d6a84f]/5 blur-sm" />

              <div className="relative grid h-24 w-24 grid-cols-3 grid-rows-3 gap-2 rounded-3xl border border-[#7f1111]/20 bg-[#fff3d0] p-5 shadow-inner shadow-[#5a2f18]/30">
                <span className="col-start-1 row-start-1 rounded-full bg-[#4b0808]" />
                <span className="col-start-3 row-start-1 rounded-full bg-[#4b0808]" />
                <span className="col-start-2 row-start-2 rounded-full bg-[#4b0808]" />
                <span className="col-start-1 row-start-3 rounded-full bg-[#4b0808]" />
                <span className="col-start-3 row-start-3 rounded-full bg-[#4b0808]" />
              </div>
            </div>

            <div className="mt-7 rounded-full border border-[#ffd77a]/35 bg-gradient-to-b from-[#b21b16] via-[#7f1111] to-[#3a0707] px-9 py-4 text-base font-black text-[#fff3d0] shadow-[0_16px_34px_rgba(0,0,0,0.52)]">
              {playLabel}
            </div>
          </Link>

          <Link
            href="/thirty-six"
            className="mt-7 rounded-full border border-[#d6a84f]/15 bg-black/20 px-5 py-2.5 text-xs font-semibold text-[#f7dfaa]/62 backdrop-blur-sm"
          >
            ၃၆ ကောင်ထီ — မကြာမီလာမည်
          </Link>
        </div>
      </section>
    </NaganiPageShell>
  );
}