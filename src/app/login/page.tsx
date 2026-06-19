// src/app/login/page.tsx

import Link from "next/link";

import {
  NaganiPageShell,
  NaganiRoyalButton,
  NaganiRoyalInput,
} from "@/components/nagani-v2";
import { naganiAssets } from "@/lib/naganiAssets";
import { loginWithEmail } from "@/lib/supabase/auth";

type LoginPageProps = {
  searchParams?: Promise<{
    error?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const errorMessage = params?.error;

  return (
    <NaganiPageShell>
      <section className="flex min-h-[100svh] items-start justify-center px-5 pb-8 pt-16 sm:pt-20">
        <div className="w-full max-w-sm">
          <div className="mb-6 text-center">
            <div
              className="mx-auto h-24 w-24 bg-contain bg-center bg-no-repeat drop-shadow-[0_8px_22px_rgba(0,0,0,0.65)]"
              style={{
                backgroundImage: `url(${naganiAssets.shared.logo.conceptV1})`,
              }}
              aria-label="နဂါးနီ"
            />

            <h1 className="mt-4 text-3xl font-black tracking-[0.12em] text-[#ffd77a]">
              နဂါးနီ
            </h1>

            <p className="mt-3 text-[0.95rem] font-bold leading-7 text-[#fff3d0]/82">
              မြန်မာ့ရိုးရာ တော်ဝင်ပွဲခန်းမသို့ ဝင်ရောက်ပါ
            </p>
          </div>

          <div className="rounded-[2rem] border border-[#d6a84f]/30 bg-[#090202]/68 px-5 py-6 shadow-2xl shadow-black/55 backdrop-blur-md">
            <form action={loginWithEmail} className="space-y-5">
              {errorMessage ? (
                <div className="rounded-2xl border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm font-bold text-red-100">
                  ဝင်ရောက်မှု မအောင်မြင်ပါ။ အချက်အလက်များကို ပြန်စစ်ပါ။
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
                label="စကားဝှက်"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                placeholder="စကားဝှက်"
              />

              <NaganiRoyalButton type="submit" className="w-full">
                ဝင်ရောက်မည်
              </NaganiRoyalButton>

              <div className="flex items-center justify-between gap-4 px-1 pt-3 text-[0.85rem] font-bold leading-6">
                <Link href="/" className="text-[#f7dfaa]/70 hover:text-[#fff3d0]">
                  မူလသို့
                </Link>

                <Link
                  href="/register"
                  className="text-[#ffd77a]/85 hover:text-[#ffd77a]"
                >
                  အကောင့်အသစ်ဖွင့်မည်
                </Link>
              </div>
            </form>
          </div>
        </div>
      </section>
    </NaganiPageShell>
  );
}