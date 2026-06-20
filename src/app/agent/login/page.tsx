//src/app/agent/login/page.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

function normalizeNaganiPhoneAuthEmail(value: string) {
  const digits = value.replace(/\D/g, "");
  return digits ? `${digits}@nagani.local` : "";
}

export default function AgentLoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [errorText, setErrorText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const loginEmail = normalizeNaganiPhoneAuthEmail(phone);

    setErrorText("");

    if (!loginEmail) {
      setErrorText("ဖုန်းနံပါတ် ရိုက်ပါ။");
      return;
    }

    if (!password) {
      setErrorText("စကားဝှက် ရိုက်ပါ။");
      return;
    }

    setIsLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password,
    });

    setIsLoading(false);

    if (error) {
      setErrorText("အေးဂျင့်အကောင့်ဝင်မရပါ။ ဖုန်းနံပါတ် / စကားဝှက် စစ်ပါ။");
      return;
    }

    router.replace("/agent");
    router.refresh();
  }

  return (
    <main className="min-h-dvh bg-[radial-gradient(circle_at_top,rgba(245,190,90,0.18),transparent_34%),linear-gradient(180deg,#260502,#070101)] px-5 py-8 text-amber-50">
      <div className="mx-auto flex min-h-[calc(100dvh-4rem)] w-full max-w-[430px] items-center justify-center">
        <section className="relative w-full overflow-hidden rounded-[2rem] border border-amber-300/25 bg-[linear-gradient(145deg,rgba(76,13,6,0.97),rgba(18,2,2,0.99),rgba(62,10,5,0.96))] p-6 shadow-2xl shadow-black/70">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,219,138,0.18),transparent_44%)]" />

          <div className="relative">
            <div className="mb-7 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-200/70">
                NAGANI AGENT
              </p>
              <h1 className="mt-3 text-2xl font-black text-amber-50">
                အေးဂျင့် Login
              </h1>
              <p className="mt-2 text-sm leading-6 text-amber-100/70">
                လစဉ် Referral Settlement ကြည့်ရန်
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-amber-100">
                  ဖုန်းနံပါတ်
                </span>
                <input
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  type="tel"
                  inputMode="numeric"
                  required
                  autoComplete="tel"
                  className="w-full rounded-2xl border border-amber-300/20 bg-black/35 px-4 py-3 text-base text-amber-50 outline-none placeholder:text-amber-100/35 focus:border-amber-300/55"
                  placeholder="09112233445"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-amber-100">
                  စကားဝှက်
                </span>
                <input
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  type="password"
                  required
                  autoComplete="current-password"
                  className="w-full rounded-2xl border border-amber-300/20 bg-black/35 px-4 py-3 text-base text-amber-50 outline-none placeholder:text-amber-100/35 focus:border-amber-300/55"
                  placeholder="••••••••"
                />
              </label>

              {errorText ? (
                <p className="rounded-2xl border border-red-300/25 bg-red-950/35 px-4 py-3 text-sm text-red-100">
                  {errorText}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-2xl border border-amber-200/45 bg-[linear-gradient(180deg,#f7d27a,#b87819)] px-5 py-3 text-base font-black text-[#2a0701] shadow-lg shadow-black/40 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? "ဝင်နေပါသည်..." : "ဝင်မည်"}
              </button>
            </form>

            <p className="mt-5 text-center text-xs leading-5 text-amber-100/50">
              Admin မှ ချိတ်ဆက်ထားသော အေးဂျင့်ဖုန်းနံပါတ်ဖြင့် ဝင်ရောက်ပါ။
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}