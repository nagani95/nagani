//src>app>dev>login>page.tsx

import { signInAnonymously } from "@/lib/supabase/auth";

export default function DevLoginPage() {
  return (
    <main className="min-h-screen bg-[#120705] px-5 py-10 text-white">
      <div className="mx-auto max-w-sm rounded-3xl border border-yellow-500/25 bg-black/40 p-5 shadow-2xl">
        <p className="text-xs uppercase tracking-[0.25em] text-yellow-300/70">
          Nagani Dev Only
        </p>

        <h1 className="mt-2 text-2xl font-bold text-yellow-100">
          Test Player Login
        </h1>

        <p className="mt-3 text-sm leading-6 text-white/65">
          Temporary anonymous login for live room QA. Use one browser for
          Player A and another browser/private window for Player B.
        </p>

        <form action={signInAnonymously} className="mt-6">
          <button
            type="submit"
            className="w-full rounded-2xl bg-yellow-400 px-4 py-3 font-bold text-black shadow-lg shadow-yellow-900/30"
          >
            Continue as Anonymous Player
          </button>
        </form>

        <p className="mt-5 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs leading-5 text-white/55">
          This is not the final login/register page. This is only for backend
          live-room testing.
        </p>
      </div>
    </main>
  );
}