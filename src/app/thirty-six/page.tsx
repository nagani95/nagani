// src/app/thirty-six/page.tsx

import Link from "next/link";

import AppShell from "@/components/layout/AppShell";

export default function ThirtySixPage() {
  return (
    <AppShell>
      <header className="flex items-center justify-between">
        <Link href="/" className="text-sm font-bold text-amber-300">
          ← Lobby
        </Link>

        <div className="rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-xs font-bold text-amber-100">
          Coming Soon
        </div>
      </header>

      <section className="mt-6 rounded-[2rem] border border-red-500/30 bg-gradient-to-br from-red-950 via-[#160303] to-black p-5 shadow-2xl shadow-red-950/30">
        <p className="text-xs font-bold uppercase tracking-[0.35em] text-red-200/60">
          Nagani Future Game
        </p>

        <h1 className="mt-3 text-4xl font-black text-amber-100">
          ၃၆ ကောင်ထီ
        </h1>

        <p className="mt-2 text-2xl font-black text-amber-200/80">
          Thirty Six
        </p>

        <p className="mt-4 text-sm leading-6 text-amber-50/65">
          Thirty Six is not live in the current MVP. The player release is
          focused on the Six Animal room.
        </p>

        <div className="mt-5 rounded-[1.5rem] border border-amber-400/15 bg-amber-400/10 p-4">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-200/55">
            Current Status
          </p>
          <p className="mt-2 text-2xl font-black text-amber-100">
            Coming Soon
          </p>
        </div>
      </section>

      <section className="mt-6 rounded-[1.75rem] border border-white/10 bg-black/40 p-5">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-white/35">
          MVP Notice
        </p>

        <h2 className="mt-2 text-2xl font-black text-amber-100">
          Not Available Yet
        </h2>

        <p className="mt-3 text-sm leading-6 text-white/55">
          No Thirty Six tickets, fake draw data, number selection, or result
          preview is available here. This page will open only after the real
          Thirty Six backend and ticket flow are ready.
        </p>

        <Link
          href="/six-animal"
          className="mt-5 block rounded-full border border-amber-400/20 bg-amber-400/10 px-5 py-4 text-center text-sm font-black text-amber-100 transition hover:bg-amber-300 hover:text-black"
        >
          Enter Six Animal
        </Link>
      </section>
    </AppShell>
  );
}