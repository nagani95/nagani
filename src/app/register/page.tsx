// src/app/register/page.tsx

import Link from "next/link";

import {
  NaganiPageShell,
  NaganiRoyalButton,
  NaganiRoyalInput,
} from "@/components/nagani-v2";
import { naganiAssets } from "@/lib/naganiAssets";
import { registerWithEmail } from "@/lib/supabase/auth";

type RegisterPageProps = {
  searchParams?: Promise<{
    error?: string;
    message?: string;
  }>;
};

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const params = await searchParams;
  const errorMessage = params?.error;
  const successMessage = params?.message;

  return (
    <NaganiPageShell>
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#090202]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(214,168,79,0.2),transparent_34%),linear-gradient(180deg,rgba(44,8,4,0.96),rgba(8,1,1,0.98)_58%,rgba(24,3,2,1))]" />
        <div className="absolute inset-x-[-20%] top-[-8%] h-[42%] rounded-full bg-[#7b1711]/28 blur-3xl" />
        <div className="absolute inset-x-0 bottom-0 h-[38%] bg-[radial-gradient(circle_at_50%_100%,rgba(214,168,79,0.16),transparent_58%)]" />
      </div>

      <section className="relative z-10 flex min-h-[100svh] items-center justify-center px-5 pb-12 pt-10">
        <div className="w-full max-w-sm -translate-y-8">
          <div className="text-center">
            <div
              className="mx-auto h-24 w-24 bg-contain bg-center bg-no-repeat drop-shadow-[0_10px_28px_rgba(0,0,0,0.75)]"
              style={{
                backgroundImage: `url(${naganiAssets.shared.logo.conceptV1})`,
              }}
              aria-label="နဂါးနီ"
            />

            <h1 className="mt-4 text-4xl font-black tracking-[0.1em] text-[#ffd77a] drop-shadow-[0_3px_14px_rgba(0,0,0,0.85)]">
              နဂါးနီ
            </h1>

            <p className="mt-3 text-sm font-bold leading-7 text-[#fff3d0]/75">
              တော်ဝင်ပွဲခန်းမသို့ ဝင်ရန် အကောင့်ဖွင့်ပါ
            </p>
          </div>

          <div className="relative mt-7 overflow-hidden rounded-[2rem] border border-[#d6a84f]/35 bg-[linear-gradient(145deg,rgba(58,10,5,0.9),rgba(9,2,2,0.96),rgba(85,17,8,0.78))] p-5 shadow-2xl shadow-black/60">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,215,122,0.16),transparent_38%)]" />
            <div className="pointer-events-none absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-[#ffd77a]/70 to-transparent" />

            <form action={registerWithEmail} className="relative space-y-4">
              <div>
                <p className="text-xs font-black tracking-[0.16em] text-[#f7dfaa]/55">
                  အကောင့်အသစ်
                </p>
                <h2 className="mt-2 text-2xl font-black text-[#ffd77a]">
                  အကောင့်ဖွင့်မည်
                </h2>
              </div>

              {errorMessage ? (
                <div className="rounded-2xl border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm font-bold text-red-100">
                  အကောင့်ဖွင့်မှု မအောင်မြင်ပါ။ အချက်အလက်များကို ပြန်စစ်ပါ။
                </div>
              ) : null}

              {successMessage ? (
                <div className="rounded-2xl border border-emerald-400/25 bg-emerald-500/10 px-4 py-3 text-sm font-bold text-emerald-100">
                  အကောင့်ဖွင့်မှု အောင်မြင်ပါသည်။ ဝင်ရောက်နိုင်ပါပြီ။
                </div>
              ) : null}

<NaganiRoyalInput
  label="ဖုန်းနံပါတ်"
  name="email"
  type="tel"
  required
  autoComplete="tel"
  inputMode="tel"
  placeholder="ဖုန်းနံပါတ်"
/>

<NaganiRoyalInput
  label="မိတ်ဆက်ကုဒ်"
  name="referralCode"
  type="text"
  autoComplete="off"
  placeholder="ရှိလျှင် ထည့်ပါ"
/>

<NaganiRoyalInput
  label="စကားဝှက်"
  name="password"
                type="password"
                required
                minLength={6}
                autoComplete="new-password"
                placeholder="အနည်းဆုံး ၆ လုံး"
              />

              <NaganiRoyalInput
                label="စကားဝှက် ထပ်မံရေးပါ"
                name="confirmPassword"
                type="password"
                required
                minLength={6}
                autoComplete="new-password"
                placeholder="စကားဝှက် ထပ်မံရေးပါ"
              />

              <NaganiRoyalButton type="submit" className="w-full">
                အကောင့်ဖွင့်မည်
              </NaganiRoyalButton>

              <div className="flex items-center justify-between gap-4 border-t border-[#d6a84f]/12 px-1 pt-4 text-[0.85rem] font-black leading-6">
                <Link
                  href="/"
                  className="text-[#f7dfaa]/65 active:text-[#fff3d0]"
                >
                  မူလသို့
                </Link>

                <Link
                  href="/login"
                  className="text-[#ffd77a] active:text-[#fff3d0]"
                >
                  ဝင်ရောက်မည်
                </Link>
              </div>
            </form>
          </div>
        </div>
      </section>
    </NaganiPageShell>
  );
}