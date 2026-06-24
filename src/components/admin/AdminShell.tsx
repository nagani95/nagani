// src/components/admin/AdminShell.tsx

import type { ReactNode } from "react";
import Link from "next/link";

import { logout } from "@/lib/supabase/auth";

type AdminShellProps = {
  title: string;
  eyebrow?: string;
  description?: string;
  children: ReactNode;
  action?: ReactNode;
};

const adminNavItems = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/wallet-requests", label: "Balance" },
  { href: "/admin/wallet-addresses", label: "Wallet Address" },
  { href: "/admin/agents", label: "Agents" },
  { href: "/admin/referrals", label: "Referrals" },
  { href: "/admin/six-animal", label: "6 Animal" },
  { href: "/admin/backend-health", label: "Backend" },
  { href: "/admin/financial-integrity", label: "Finance" },
  { href: "/admin/audit-log", label: "Audit" },
  { href: "/admin/settings", label: "Settings" },
];

export default function AdminShell({
  title,
  eyebrow = "Nagani Admin Control",
  description,
  children,
  action,
}: AdminShellProps) {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#070101] text-white">
      <div className="sticky top-0 z-40 border-b border-amber-300/10 bg-[#100303]/96 shadow-2xl shadow-black/45 backdrop-blur-xl">
        <section className="w-full px-4 py-4 sm:px-6 lg:px-8 2xl:px-10">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
            <div className="min-w-0">
              <p className="text-[11px] font-black uppercase tracking-[0.3em] text-amber-200/45">
                {eyebrow}
              </p>

              <h1 className="mt-1 text-2xl font-black text-amber-100 sm:text-3xl">
                {title}
              </h1>

              {description ? (
                <p className="mt-1 max-w-5xl text-sm font-semibold leading-6 text-amber-100/45">
                  {description}
                </p>
              ) : null}
            </div>

            <div className="flex shrink-0 flex-wrap items-center gap-2">
              {action}

              <Link
                href="/"
                className="rounded-full border border-amber-300/15 bg-amber-300/10 px-4 py-2 text-xs font-black text-amber-100/75 transition hover:border-amber-200/40 hover:text-amber-100"
              >
                Lobby
              </Link>

              <form action={logout}>
                <button
                  type="submit"
                  className="rounded-full border border-red-300/20 bg-red-500/10 px-4 py-2 text-xs font-black text-red-100/80 transition hover:bg-red-400 hover:text-black"
                >
                  Logout
                </button>
              </form>
            </div>
          </div>

          <nav className="mt-4 flex w-full gap-2 overflow-x-auto pb-2 xl:flex-wrap xl:overflow-visible">
            {adminNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="shrink-0 rounded-full border border-white/10 bg-black/35 px-4 py-2 text-xs font-black text-white/55 transition hover:border-amber-300/35 hover:bg-amber-300/10 hover:text-amber-100"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </section>
      </div>

      <section className="w-full px-4 py-5 sm:px-6 lg:px-8 2xl:px-10">
        {children}
      </section>
    </main>
  );
}