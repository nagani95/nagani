// src/app/admin/layout.tsx

import type { ReactNode } from "react";
import Link from "next/link";
import { headers } from "next/headers";

import { naganiAssets } from "@/lib/naganiAssets";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type AdminLayoutProps = {
  children: ReactNode;
};

type AdminUser = {
  user_id: string;
  enabled: boolean;
};

function AdminBlockedScreen({
  title,
  message,
}: {
  title: string;
  message: string;
}) {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#070101] px-5 py-8 text-white">
      <div
        className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-18"
        style={{
          backgroundImage: `url(${naganiAssets.shared.logo.conceptV1})`,
        }}
      />

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(245,158,11,0.18),transparent_36%),radial-gradient(circle_at_50%_100%,rgba(127,29,29,0.35),transparent_42%),linear-gradient(180deg,rgba(0,0,0,0.35),rgba(0,0,0,0.94))]" />

      <section className="relative z-10 flex min-h-[72vh] w-full max-w-[430px] items-center justify-center">
        <div className="relative w-full overflow-hidden rounded-[2rem] border border-amber-300/18 bg-[linear-gradient(145deg,rgba(35,5,4,0.98),rgba(8,1,1,0.99),rgba(52,8,5,0.96))] shadow-2xl shadow-black/80">
          <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-amber-200/60 to-transparent" />
          <div className="pointer-events-none absolute inset-x-12 bottom-0 h-px bg-gradient-to-r from-transparent via-red-300/30 to-transparent" />

          <div className="relative px-6 py-7 text-center">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-amber-300/22 bg-black/35 shadow-inner shadow-black/80">
              <div
                className="h-20 w-20 bg-contain bg-center bg-no-repeat"
                style={{
                  backgroundImage: `url(${naganiAssets.shared.logo.conceptV1})`,
                }}
                aria-label="Nagani dragon mark"
              />
            </div>

            <p className="mt-5 text-[11px] font-black uppercase tracking-[0.34em] text-amber-200/50">
              Nagani Admin
            </p>

            <h1 className="mt-2 text-3xl font-black leading-tight text-amber-100">
              {title}
            </h1>

            <p className="mx-auto mt-3 max-w-[310px] text-sm font-semibold leading-6 text-amber-100/55">
              {message}
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <Link
                href="/admin/login"
                className="rounded-full border border-amber-200/35 bg-[linear-gradient(180deg,#f7c96b,#b45309)] px-5 py-3 text-center text-sm font-black text-[#260703] shadow-lg shadow-amber-950/35 transition hover:brightness-110 active:scale-[0.98]"
              >
                Admin Login
              </Link>

              <Link
                href="/"
                className="rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-center text-sm font-black text-amber-100/75 transition hover:border-amber-300/25 hover:text-amber-100 active:scale-[0.98]"
              >
                Open Lobby
              </Link>
            </div>

            <p className="mt-5 rounded-2xl border border-amber-300/12 bg-black/35 p-4 text-xs font-semibold leading-5 text-amber-100/42">
              Admin access is checked on the server. Player accounts cannot
              open operator pages unless they are enabled in admin_users.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const headerStore = await headers();
  const pathname = headerStore.get("x-nagani-pathname");

  if (pathname === "/admin/login") {
    return children;
  }

  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return (
      <AdminBlockedScreen
        title="Admin Login Required"
        message="Please sign in with an approved Nagani admin account before opening the operator area."
      />
    );
  }

  const { data: adminUser, error: adminUserError } = await supabase
    .from("admin_users")
    .select("user_id, enabled")
    .eq("user_id", user.id)
    .eq("enabled", true)
    .maybeSingle<AdminUser>();

  if (adminUserError || !adminUser) {
    return (
      <AdminBlockedScreen
        title="Admin Access Denied"
        message="This account is signed in, but it is not enabled for Nagani operator access."
      />
    );
  }

  return children;
}