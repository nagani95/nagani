//src/app/admin/login/page.tsx

import Link from "next/link";

import { naganiAssets } from "@/lib/naganiAssets";
import { adminLoginWithEmail } from "@/lib/supabase/auth";

export const dynamic = "force-dynamic";

type AdminLoginPageProps = {
  searchParams?: Promise<{
    error?: string;
  }>;
};

export default async function AdminLoginPage({
  searchParams,
}: AdminLoginPageProps) {
  const params = await searchParams;
  const errorMessage = params?.error;

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#070101] px-5 py-8 text-white">
      <div
        className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-18"
        style={{
          backgroundImage: `url(${naganiAssets.shared.logo.conceptV1})`,
        }}
      />

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(245,158,11,0.18),transparent_36%),radial-gradient(circle_at_50%_100%,rgba(127,29,29,0.35),transparent_42%),linear-gradient(180deg,rgba(0,0,0,0.35),rgba(0,0,0,0.94))]" />

      <section className="relative z-10 w-full max-w-[390px] overflow-hidden rounded-[2rem] border border-amber-300/18 bg-[linear-gradient(145deg,rgba(35,5,4,0.98),rgba(8,1,1,0.99),rgba(52,8,5,0.96))] shadow-2xl shadow-black/80">
        <div className="relative border-b border-amber-200/10 px-6 pb-6 pt-7 text-center">
          <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-amber-200/60 to-transparent" />
          <div className="pointer-events-none absolute inset-x-12 bottom-0 h-px bg-gradient-to-r from-transparent via-red-300/30 to-transparent" />

          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-amber-300/22 bg-black/35 shadow-inner shadow-black/80">
            <div
              className="h-20 w-20 bg-contain bg-center bg-no-repeat"
              style={{
                backgroundImage: `url(${naganiAssets.shared.logo.conceptV1})`,
              }}
              aria-label="Nagani dragon mark"
            />
          </div>

          <p className="mt-4 text-[11px] font-black uppercase tracking-[0.34em] text-amber-200/50">
            Nagani Operator
          </p>

          <h1 className="mt-2 text-3xl font-black text-amber-100">
            Admin Login
          </h1>

          <p className="mx-auto mt-2 max-w-[270px] text-sm font-semibold leading-6 text-amber-100/55">
            Secure operator entrance for users, balance review, live room
            monitor, agents, and system health.
          </p>
        </div>

        <form action={adminLoginWithEmail} className="space-y-4 px-6 py-6">
          {errorMessage ? (
            <div className="rounded-2xl border border-red-300/30 bg-red-500/15 px-4 py-3 text-sm font-bold leading-5 text-red-100">
              {errorMessage}
            </div>
          ) : null}

          <label className="block">
            <span className="text-[11px] font-black uppercase tracking-[0.24em] text-amber-200/55">
              Admin Email
            </span>

            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              className="mt-2 w-full rounded-2xl border border-amber-300/15 bg-black/35 px-4 py-4 text-base font-bold text-amber-50 outline-none placeholder:text-amber-100/25 focus:border-amber-200/55"
              placeholder="admin@naganigame.com"
            />
          </label>

          <label className="block">
            <span className="text-[11px] font-black uppercase tracking-[0.24em] text-amber-200/55">
              Password
            </span>

            <input
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="mt-2 w-full rounded-2xl border border-amber-300/15 bg-black/35 px-4 py-4 text-base font-bold text-amber-50 outline-none placeholder:text-amber-100/25 focus:border-amber-200/55"
              placeholder="Admin password"
            />
          </label>

          <button
            type="submit"
            className="w-full rounded-full border border-amber-200/35 bg-[linear-gradient(180deg,#f7c96b,#b45309)] px-5 py-4 text-sm font-black uppercase tracking-[0.2em] text-[#260703] shadow-lg shadow-amber-950/40 transition hover:brightness-110"
          >
            Enter Admin
          </button>

          <div className="grid grid-cols-2 gap-3 pt-2 text-center text-xs font-black">
            <Link
              href="/"
              className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-3 text-amber-100/70 transition hover:border-amber-300/25 hover:text-amber-100"
            >
              Lobby
            </Link>

            <Link
              href="/login"
              className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-3 text-amber-100/70 transition hover:border-amber-300/25 hover:text-amber-100"
            >
              Player Login
            </Link>
          </div>
        </form>
      </section>
    </main>
  );
}