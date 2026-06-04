//src>app>admin>thirty-six>page.tsx

import Link from "next/link";

const draws = [
  {
    id: "DRAW-1200",
    name: "Morning Draw",
    result: "#12",
    tickets: "31",
    status: "Published",
  },
  {
    id: "DRAW-1800",
    name: "Evening Draw",
    result: "Pending",
    tickets: "18",
    status: "Open",
  },
];

export default function AdminThirtySixPage() {
  return (
    <main className="min-h-screen bg-[#090202] px-5 py-6 text-white">
      <section className="mx-auto w-full max-w-6xl">
        <Link href="/admin" className="text-sm font-bold text-amber-300">
          ← Admin Home
        </Link>

        <header className="mt-6 rounded-[2rem] border border-red-500/25 bg-gradient-to-br from-red-950 via-[#160303] to-black p-6">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-red-200/60">
            Animal Draw Operation
          </p>
          <h1 className="mt-3 text-4xl font-black text-amber-100">
            ၃၆ ကောင်ထီ
          </h1>
          <p className="mt-3 text-sm leading-6 text-amber-50/65">
            Manage draw records, tickets, and published results.
          </p>
        </header>

        <section className="mt-6 grid gap-4">
          {draws.map((draw) => (
            <article
              key={draw.id}
              className="rounded-[1.5rem] border border-amber-400/15 bg-black/40 p-5"
            >
              <div className="grid gap-4 md:grid-cols-[160px_1fr_120px_120px_140px] md:items-center">
                <p className="text-xs font-bold text-white/40">{draw.id}</p>
                <p className="text-lg font-black text-amber-100">
                  {draw.name}
                </p>
                <p className="text-2xl font-black text-amber-100">
                  {draw.result}
                </p>
                <p className="font-bold text-white/70">
                  {draw.tickets} tickets
                </p>
                <p className="text-right text-xs font-black text-emerald-100">
                  {draw.status}
                </p>
              </div>
            </article>
          ))}
        </section>
      </section>
    </main>
  );
}