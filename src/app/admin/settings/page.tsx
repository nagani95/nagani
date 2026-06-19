// src/app/admin/settings/page.tsx

import Link from "next/link";

import AdminShell from "@/components/admin/AdminShell";

export const dynamic = "force-dynamic";

const sixAnimalSettings = [
  {
    title: "Minimum Bet",
    value: "1,000 MMK",
    note: "Locked MVP betting limit.",
  },
  {
    title: "Maximum Bet",
    value: "500,000 MMK",
    note: "Locked MVP betting limit.",
  },
  {
    title: "Six Animal Status",
    value: "Open",
    note: "Current live MVP game.",
  },
  {
    title: "Room Mode",
    value: "Backend Auto",
    note: "Global room timing and results are controlled by backend functions.",
  },
];

const platformSettings = [
  {
    title: "Player Navigation",
    value: "Home / Cashier / Profile",
    note: "History and Live pages are removed from player navigation.",
  },
  {
    title: "Wallet Requests",
    value: "Admin Review",
    note: "Deposits and withdrawals require admin approve/reject flow.",
  },
  {
    title: "Thirty Six",
    value: "Not in MVP",
    note: "Thirty Six remains outside the current player release surface.",
  },
  {
    title: "Admin Settings",
    value: "Read Only",
    note: "This page does not edit platform settings in the MVP.",
  },
];

export default function AdminSettingsPage() {
  return (
    <AdminShell
      title="Settings"
      eyebrow="Platform Settings"
      description="Read-only summary of current Nagani MVP operating rules. This page does not change wallets, bets, rounds, results, player access, or backend room behavior."
      action={
        <Link
          href="/admin/backend-health"
          className="rounded-full border border-sky-300/20 bg-sky-400/10 px-4 py-2 text-xs font-black text-sky-100/85 transition hover:bg-sky-300 hover:text-black"
        >
          Backend Health
        </Link>
      }
    >
      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-emerald-300/15 bg-emerald-400/10 p-4">
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-emerald-100/55">
            Six Animal
          </p>
          <p className="mt-2 text-2xl font-black text-emerald-100">Open</p>
        </div>

        <div className="rounded-2xl border border-amber-300/15 bg-amber-300/10 p-4">
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-amber-100/55">
            Wallet Flow
          </p>
          <p className="mt-2 text-2xl font-black text-amber-100">
            Admin Review
          </p>
        </div>

        <div className="rounded-2xl border border-sky-300/15 bg-sky-400/10 p-4">
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-sky-100/55">
            Room Mode
          </p>
          <p className="mt-2 text-2xl font-black text-sky-100">
            Backend Auto
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-white/40">
            Settings Mode
          </p>
          <p className="mt-2 text-2xl font-black text-white/70">Read Only</p>
        </div>
      </section>

      <section className="mt-4 rounded-2xl border border-amber-300/12 bg-black/35 p-4">
        <p className="text-[11px] font-black uppercase tracking-[0.28em] text-amber-200/45">
          Six Animal MVP
        </p>

        <h2 className="mt-1 text-xl font-black text-amber-100">
          Current Game Rules
        </h2>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {sixAnimalSettings.map((setting) => (
            <div
              key={setting.title}
              className="rounded-xl border border-amber-300/12 bg-amber-300/8 p-4"
            >
              <p className="text-sm font-bold text-white/45">
                {setting.title}
              </p>
              <p className="mt-2 text-2xl font-black text-amber-100">
                {setting.value}
              </p>
              <p className="mt-2 text-xs font-semibold leading-5 text-white/42">
                {setting.note}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-4 rounded-2xl border border-red-300/12 bg-red-950/10 p-4">
        <p className="text-[11px] font-black uppercase tracking-[0.28em] text-red-200/50">
          Platform Surface
        </p>

        <h2 className="mt-1 text-xl font-black text-amber-100">
          Release Status
        </h2>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {platformSettings.map((setting) => (
            <div
              key={setting.title}
              className="rounded-xl border border-white/10 bg-black/30 p-4"
            >
              <p className="text-sm font-bold text-white/45">
                {setting.title}
              </p>
              <p className="mt-2 text-2xl font-black text-amber-100">
                {setting.value}
              </p>
              <p className="mt-2 text-xs font-semibold leading-5 text-white/42">
                {setting.note}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-4 rounded-2xl border border-white/10 bg-black/35 p-4">
        <p className="text-[11px] font-black uppercase tracking-[0.28em] text-white/35">
          Read-only Lock
        </p>
        <p className="mt-1 text-sm font-semibold leading-6 text-white/50">
          Admin setting controls are intentionally disabled for the current MVP.
          Future editable settings should be added only after a protected backend
          setting source, admin audit logging, and production QA are ready.
        </p>
      </section>
    </AdminShell>
  );
}