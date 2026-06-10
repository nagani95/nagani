//src>app>admin>thirty-six>page.tsx

import Link from "next/link";

export default function AdminThirtySixPage() {
  return (
    <main className="min-h-screen bg-[#090202] px-5 py-6 text-white">
      <section className="mx-auto w-full max-w-5xl">
        <Link href="/admin" className="text-sm font-bold text-amber-300">
          ← Admin Home
        </Link>

        <header className="mt-6 rounded-[2rem] border border-red-500/25 bg-gradient-to-br from-red-950 via-[#160303] to-black p-6">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-red-200/60">
            Admin Module
          </p>

          <h1 className="mt-3 text-4xl font-black text-amber-100">
            ၃၆ ကောင်ထီ
          </h1>

          <p className="mt-3 text-sm leading-6 text-amber-50/65">
            Thirty Six admin control is not connected yet. This page is kept as
            a safe placeholder until the real draw backend, ticket records, and
            result publishing flow are built.
          </p>
        </header>

        <section className="mt-6 rounded-[1.75rem] border border-amber-400/15 bg-black/40 p-6">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-amber-200/50">
            Current Status
          </p>

          <h2 className="mt-3 text-2xl font-black text-amber-100">
            Not Live Yet
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/60">
            No fake draw data is displayed here. Real admin tools will be added
            only after the Thirty Six backend source-of-truth is designed and
            locked.
          </p>

          <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-sm font-bold text-white/55">
              Protected rule: do not add manual draw controls, fake results, or
              ticket editing until the real Thirty Six backend foundation is
              ready.
            </p>
          </div>
        </section>
      </section>
    </main>
  );
}