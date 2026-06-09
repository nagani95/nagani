// src/app/login/page.tsx

import Link from "next/link";

import AppShell from "@/components/layout/AppShell";
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
    <AppShell>
      <main className="flex min-h-[calc(100vh-72px)] items-center justify-center px-2 py-8">
        <section className="w-full max-w-md overflow-hidden rounded-[2rem] border border-amber-400/20 bg-[#140604]/90 shadow-2xl shadow-black/40">
          <div className="border-b border-amber-400/10 bg-gradient-to-b from-amber-300/10 to-transparent px-6 py-6 text-center">
            <div
              className="mx-auto h-20 w-20 bg-contain bg-center bg-no-repeat"
              style={{
                backgroundImage: `url(${naganiAssets.shared.logo.conceptV1})`,
              }}
              aria-label="Nagani dragon mark"
            />

            <p className="mt-3 text-xs font-black uppercase tracking-[0.35em] text-amber-300/70">
              Nagani
            </p>

            <h1 className="mt-2 text-2xl font-black text-amber-100">
              Player Login
            </h1>

            <p className="mt-2 text-sm font-semibold leading-6 text-amber-100/60">
              Login to your player account and return to the lobby.
            </p>
          </div>

          <form action={loginWithEmail} className="space-y-4 px-6 py-6">
            {errorMessage ? (
              <div className="rounded-2xl border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm font-bold text-red-100">
                {errorMessage}
              </div>
            ) : null}

            <label className="block">
              <span className="text-xs font-black uppercase tracking-[0.2em] text-amber-300/70">
                Email
              </span>
              <input
                name="email"
                type="email"
                required
                autoComplete="email"
                className="mt-2 w-full rounded-2xl border border-amber-400/20 bg-black/30 px-4 py-4 text-base font-bold text-amber-50 outline-none placeholder:text-amber-100/25 focus:border-amber-300/60"
                placeholder="player@example.com"
              />
            </label>

            <label className="block">
              <span className="text-xs font-black uppercase tracking-[0.2em] text-amber-300/70">
                Password
              </span>
              <input
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="mt-2 w-full rounded-2xl border border-amber-400/20 bg-black/30 px-4 py-4 text-base font-bold text-amber-50 outline-none placeholder:text-amber-100/25 focus:border-amber-300/60"
                placeholder="Your password"
              />
            </label>

            <button
              type="submit"
              className="w-full rounded-full border border-amber-300/40 bg-amber-300 px-5 py-4 text-sm font-black uppercase tracking-[0.18em] text-[#210807] shadow-lg shadow-amber-950/30 transition hover:bg-amber-200"
            >
              Login
            </button>

            <div className="flex items-center justify-between pt-2 text-sm font-bold">
              <Link href="/" className="text-amber-200/70 hover:text-amber-100">
                ← Back to Lobby
              </Link>

              <Link
                href="/register"
                className="text-amber-200/70 hover:text-amber-100"
              >
                Create account
              </Link>
            </div>
          </form>
        </section>
      </main>
    </AppShell>
  );
}