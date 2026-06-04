//src>app>admin>settings>page.tsx

import Link from "next/link";

const settings = [
  {
    title: "Minimum Bet",
    value: "1,000 MMK",
  },
  {
    title: "Maximum Bet",
    value: "500,000 MMK",
  },
  {
    title: "၆ ကောင်ဂျင် Status",
    value: "Open",
  },
  {
    title: "၃၆ ကောင်ထီ Status",
    value: "Open",
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
            Game Settings
          </h1>
          <p className="mt-3 text-sm leading-6 text-amber-50/65">
            MVP game limits and platform status settings will be configured here.
          </p>
        </header>

        <section className="mt-6 grid gap-4 md:grid-cols-2">
          {settings.map((setting) => (
            <div
              key={setting.title}
              className="rounded-[1.5rem] border border-amber-400/15 bg-black/40 p-5"
            >
              <p className="text-sm text-white/45">{setting.title}</p>
              <p className="mt-2 text-2xl font-black text-amber-100">
                {setting.value}
              </p>
            </div>
          ))}
        </section>
      </section>
    </main>
  );
}