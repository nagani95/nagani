// src/app/admin/settings/page.tsx

import Link from "next/link";

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
    <main className="min-h-screen bg-[#090202] px-5 py-6 text-white">
      <section className="mx-auto w-full max-w-6xl">
        <Link href="/admin" className="text-sm font-bold text-amber-300">
          ← Admin Home
        </Link>

        <header className="mt-6 rounded-[2rem] border border-red-500/25 bg-gradient-to-br from-red-950 via-[#160303] to-black p-6">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-red-200/60">
            Platform Settings
          </p>

          <h1 className="mt-3 text-4xl font-black text-amber-100">
            MVP Settings
          </h1>

          <p className="mt-3 max-w-3xl text-sm leading-6 text-amber-50/65">
            Read-only summary of the current Nagani MVP operating rules. This
            page does not change wallets, bets, rounds, results, player access,
            or backend room behavior.
          </p>
        </header>

        <section className="mt-6 rounded-[1.75rem] border border-amber-400/15 bg-black/40 p-5">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-amber-200/50">
            Six Animal MVP
          </p>

          <h2 className="mt-2 text-2xl font-black text-amber-100">
            Current Game Rules
          </h2>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {sixAnimalSettings.map((setting) => (
              <div
                key={setting.title}
                className="rounded-[1.5rem] border border-amber-400/15 bg-amber-400/10 p-5"
              >
                <p className="text-sm font-bold text-white/45">
                  {setting.title}
                </p>
                <p className="mt-2 text-2xl font-black text-amber-100">
                  {setting.value}
                </p>
                <p className="mt-2 text-xs leading-5 text-white/45">
                  {setting.note}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-6 rounded-[1.75rem] border border-red-400/15 bg-red-950/10 p-5">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-red-200/50">
            Platform Surface
          </p>

          <h2 className="mt-2 text-2xl font-black text-amber-100">
            Release Status
          </h2>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {platformSettings.map((setting) => (
              <div
                key={setting.title}
                className="rounded-[1.5rem] border border-white/10 bg-black/30 p-5"
              >
                <p className="text-sm font-bold text-white/45">
                  {setting.title}
                </p>
                <p className="mt-2 text-2xl font-black text-amber-100">
                  {setting.value}
                </p>
                <p className="mt-2 text-xs leading-5 text-white/45">
                  {setting.note}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-6 rounded-[1.75rem] border border-white/10 bg-black/40 p-5">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-white/35">
            Read-only Lock
          </p>
          <p className="mt-2 text-sm leading-6 text-white/55">
            Admin setting controls are intentionally disabled for the current
            MVP. Any future editable setting should be added only after a
            protected backend setting source, admin audit logging, and production
            QA are ready.
          </p>
        </section>
      </section>
    </main>
  );
}