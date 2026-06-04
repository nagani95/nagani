//src>app>admin>layout.tsx

import type { ReactNode } from "react";
import Link from "next/link";

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
  userId,
}: {
  title: string;
  message: string;
  userId?: string;
}) {
  return (
    <main className="min-h-screen bg-[#090202] px-5 py-10 text-white">
      <section className="mx-auto flex min-h-[70vh] w-full max-w-xl items-center justify-center">
        <div className="w-full rounded-[2rem] border border-red-500/25 bg-gradient-to-br from-red-950 via-[#160303] to-black p-6 shadow-2xl shadow-red-950/30">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-red-200/60">
            Admin Access Control
          </p>

          <h1 className="mt-3 text-3xl font-black text-amber-100">
            {title}
          </h1>

          <p className="mt-3 text-sm leading-6 text-amber-50/65">
            {message}
          </p>

          {userId ? (
            <div className="mt-5 rounded-2xl border border-amber-400/15 bg-amber-400/10 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-200/50">
                Current Supabase User ID
              </p>
              <p className="mt-2 break-all text-sm font-black text-amber-100">
                {userId}
              </p>
            </div>
          ) : null}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/"
              className="rounded-full border border-amber-400/20 bg-amber-400/10 px-5 py-3 text-center text-sm font-black text-amber-100"
            >
              Open Lobby
            </Link>

            <Link
              href="/dev/login"
              className="rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-center text-sm font-black text-white/70"
            >
              Dev Login
            </Link>
          </div>

          <p className="mt-5 rounded-2xl border border-white/10 bg-black/30 p-4 text-xs leading-5 text-white/45">
            Chapter 61 guard: admin access is checked server-side against the
            database admin allowlist in public.admin_users. Normal players are
            blocked from operator routes.
          </p>
        </div>
      </section>
    </main>
  );
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return (
      <AdminBlockedScreen
        title="Admin login required"
        message="You must be logged in before opening the Nagani admin control center."
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
        message="This logged-in user is not listed as an enabled Nagani admin operator."
        userId={user.id}
      />
    );
  }

  return children;
}