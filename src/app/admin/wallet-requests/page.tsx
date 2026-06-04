//src>app>admin>wallet-requests>page.tsx

import Link from "next/link";

const requests = [
  {
    id: "NG-WALLET-1003",
    user: "Member 4821",
    type: "Deposit",
    amount: "50,000 MMK",
    status: "Pending review",
  },
  {
    id: "NG-WALLET-1002",
    user: "Member 1930",
    type: "Withdraw",
    amount: "30,000 MMK",
    status: "Confirmed",
  },
];

export default function AdminWalletRequestsPage() {
  return (
    <main className="min-h-screen bg-[#090202] px-5 py-6 text-white">
      <section className="mx-auto w-full max-w-6xl">
        <Link href="/admin" className="text-sm font-bold text-amber-300">
          ← Admin Home
        </Link>

        <header className="mt-6 rounded-[2rem] border border-red-500/25 bg-gradient-to-br from-red-950 via-[#160303] to-black p-6">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-red-200/60">
            Wallet Operation
          </p>
          <h1 className="mt-3 text-4xl font-black text-amber-100">
            Wallet Requests
          </h1>
          <p className="mt-3 text-sm leading-6 text-amber-50/65">
            Review deposit and withdraw settlement tickets.
          </p>
        </header>

        <section className="mt-6 grid gap-4">
          {requests.map((request) => (
            <article
              key={request.id}
              className="rounded-[1.5rem] border border-amber-400/15 bg-black/40 p-5"
            >
              <div className="grid gap-4 md:grid-cols-[180px_1fr_140px_160px_160px] md:items-center">
                <p className="text-xs font-bold text-white/40">{request.id}</p>
                <p className="text-lg font-black text-amber-100">
                  {request.user}
                </p>
                <p className="font-bold text-white/70">{request.type}</p>
                <p className="font-black text-emerald-100">{request.amount}</p>
                <p className="rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-2 text-center text-xs font-black text-amber-100">
                  {request.status}
                </p>
              </div>
            </article>
          ))}
        </section>
      </section>
    </main>
  );
}