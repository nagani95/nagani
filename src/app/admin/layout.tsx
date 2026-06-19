// src/app/admin/layout.tsx

import type { ReactNode } from "react";
import Link from "next/link";
import { headers } from "next/headers";

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
    <main className="min-h-screen bg-[#090202] px-5 py-10 text-white">
      <section className="mx-auto flex min-h-[72vh] w-full max-w-xl items-center justify-center">
        <div className="relative w-full overflow-hidden rounded-[2rem] border border-[#d6a84f]/25 bg-[linear-gradient(145deg,#3a0707,#120202_52%,#050101)] p-[1px] shadow-2xl shadow-black/70">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,215,122,0.18),transparent_58%)]" />

          <div className="relative rounded-[1.95rem] border border-black/45 bg-black/25 p-6">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-[#ffd77a]/58">
              Nagani Admin
            </p>

            <h1 className="mt-3 text-3xl font-black leading-tight text-[#fff3d0]">
              {title}
            </h1>

            <p className="mt-3 text-sm font-semibold leading-6 text-[#f7dfaa]/68">
              {message}
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <Link
                href="/admin/login"
                className="rounded-full border border-[#ffd77a]/35 bg-[#d6a84f]/12 px-5 py-3 text-center text-sm font-black text-[#ffd77a] active:scale-[0.98]"
              >
                Admin Login
              </Link>

              <Link
                href="/"
                className="rounded-full border border-[#d6a84f]/20 bg-black/35 px-5 py-3 text-center text-sm font-black text-[#fff3d0] active:scale-[0.98]"
              >
                Open Lobby
              </Link>
            </div>

            <p className="mt-5 rounded-2xl border border-[#d6a84f]/15 bg-black/35 p-4 text-xs font-semibold leading-5 text-[#f7dfaa]/45">
              Admin access is checked on the server. Non-admin player accounts
              cannot open operator pages.
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
        title="Admin login required"
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
        title="Admin access denied"
        message="This account is not enabled for Nagani admin access."
      />
    );
  }

  return children;
}