//src>app>admin>users>page.tsx

import Link from "next/link";

const users = [
  {
    id: "NG-4821",
    name: "Member 4821",
    balance: "0 MMK",
    status: "Active",
    activity: "Today",
  },
  {
    id: "NG-1930",
    name: "Member 1930",
    balance: "120,000 MMK",
    status: "Active",
    activity: "Today",
  },
  {
    id: "NG-7712",
    name: "Member 7712",
    balance: "45,000 MMK",
    status: "Review",
    activity: "Yesterday",
  },
];

export default function AdminUsersPage() {
  return (
    <main className="min-h-screen bg-[#090202] px-5 py-6 text-white">
      <section className="mx-auto w-full max-w-6xl">
        <Link href="/admin" className="text-sm font-bold text-amber-300">
          ← Admin Home
        </Link>

        <header className="mt-6 rounded-[2rem] border border-red-500/25 bg-gradient-to-br from-red-950 via-[#160303] to-black p-6">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-red-200/60">
            User Management
          </p>
          <h1 className="mt-3 text-4xl font-black text-amber-100">Users</h1>
          <p className="mt-3 text-sm leading-6 text-amber-50/65">
            View members, balances, access status, and activity records.
          </p>
        </header>

        <section className="mt-6 overflow-hidden rounded-[1.75rem] border border-amber-400/15 bg-black/40">
          <div className="grid grid-cols-5 border-b border-white/10 px-5 py-4 text-xs font-black uppercase tracking-[0.2em] text-white/35">
            <p>ID</p>
            <p>Name</p>
            <p>Balance</p>
            <p>Status</p>
            <p>Activity</p>
          </div>

          {users.map((user) => (
            <div
              key={user.id}
              className="grid grid-cols-5 border-b border-white/10 px-5 py-4 text-sm last:border-b-0"
            >
              <p className="font-bold text-white/45">{user.id}</p>
              <p className="font-black text-amber-100">{user.name}</p>
              <p className="font-bold text-emerald-100">{user.balance}</p>
              <p className="font-bold text-amber-100">{user.status}</p>
              <p className="text-white/50">{user.activity}</p>
            </div>
          ))}
        </section>
      </section>
    </main>
  );
}