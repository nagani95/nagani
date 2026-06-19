//src>app>admin>thirty-six>page.tsx

import Link from "next/link";

import AdminShell from "@/components/admin/AdminShell";

export const dynamic = "force-dynamic";

export default function AdminThirtySixPage() {
  return (
    <AdminShell
      title="36 Draw"
      eyebrow="Admin Module"
      description="Thirty Six admin control is not connected yet. This page is a safe placeholder until the real draw backend, ticket records, and result publishing flow are designed and locked."
      action={
        <Link
          href="/admin/settings"
          className="rounded-full border border-amber-300/20 bg-amber-300/10 px-4 py-2 text-xs font-black text-amber-100/80 transition hover:bg-amber-300 hover:text-black"
        >
          Settings
        </Link>
      }
    >
      <section className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-red-300/15 bg-red-500/10 p-4">
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-red-100/55">
            Status
          </p>
          <p className="mt-2 text-2xl font-black text-red-100">
            Not Live
          </p>
        </div>

        <div className="rounded-2xl border border-amber-300/15 bg-amber-300/10 p-4">
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-amber-100/55">
            Backend
          </p>
          <p className="mt-2 text-2xl font-black text-amber-100">
            Not Built
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-white/40">
            Mode
          </p>
          <p className="mt-2 text-2xl font-black text-white/70">
            Placeholder
          </p>
        </div>
      </section>

      <section className="mt-4 rounded-2xl border border-amber-300/12 bg-black/35 p-4">
        <p className="text-[11px] font-black uppercase tracking-[0.28em] text-amber-200/45">
          Current Status
        </p>

        <h2 className="mt-1 text-xl font-black text-amber-100">
          Not Live Yet
        </h2>

        <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-white/50">
          No fake draw data is displayed here. Real admin tools will be added
          only after the Thirty Six backend source-of-truth is designed and
          locked.
        </p>

        <div className="mt-4 rounded-xl border border-red-300/15 bg-red-950/15 p-4">
          <p className="text-sm font-black text-red-100">
            Protected rule
          </p>
          <p className="mt-1 text-xs font-semibold leading-5 text-white/50">
            Do not add manual draw controls, fake results, fake ticket records,
            or ticket editing until the real Thirty Six backend foundation is
            ready.
          </p>
        </div>
      </section>

      <section className="mt-4 rounded-2xl border border-white/10 bg-black/35 p-4">
        <p className="text-[11px] font-black uppercase tracking-[0.28em] text-white/35">
          Future Foundation Required
        </p>

        <div className="mt-3 grid gap-3 md:grid-cols-2">
          {[
            "Draw source-of-truth table",
            "Ticket purchase records",
            "Result publishing flow",
            "Settlement function",
            "Admin audit logging",
            "Player read-only history",
          ].map((item) => (
            <div
              key={item}
              className="rounded-xl border border-white/10 bg-black/25 p-3 text-sm font-bold text-white/55"
            >
              {item}
            </div>
          ))}
        </div>
      </section>
    </AdminShell>
  );
}