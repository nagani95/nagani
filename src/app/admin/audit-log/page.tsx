//src>admin>audit-log>page.tsx

import Link from "next/link";

import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type AdminAuditLog = {
  id: string;
  admin_id: string | null;
  action: string;
  target_id: string | null;
  details: unknown;
  created_at: string;
};

function formatTime(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Yangon",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(new Date(value));
}

function formatDetails(details: unknown) {
  if (details === null || details === undefined) return "—";

  try {
    return JSON.stringify(details, null, 2);
  } catch {
    return String(details);
  }
}

export default async function AdminAuditLogPage() {
  const supabase = await createClient();

  const { data: logs, error } = await supabase
    .from("admin_audit_logs")
    .select("id, admin_id, action, target_id, details, created_at")
    .order("created_at", { ascending: false })
    .limit(50)
    .returns<AdminAuditLog[]>();

  return (
    <main className="min-h-screen bg-[#090202] px-5 py-6 text-white">
      <section className="mx-auto w-full max-w-6xl">
        <Link href="/admin" className="text-sm font-bold text-amber-300">
          ← Admin Home
        </Link>

        <header className="mt-6 rounded-[2rem] border border-red-500/25 bg-gradient-to-br from-red-950 via-[#160303] to-black p-6">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-red-200/60">
            Operator Visibility
          </p>

          <h1 className="mt-3 text-4xl font-black text-amber-100">
            Admin Audit Log
          </h1>

          <p className="mt-3 max-w-3xl text-sm leading-6 text-amber-50/65">
            Read-only audit visibility for future admin/operator actions. This
            page does not write logs, retry settlement, change wallets, advance
            rounds, or control the player room.
          </p>
        </header>

        {error ? (
          <section className="mt-6 rounded-[1.5rem] border border-red-400/30 bg-red-950/30 p-5">
            <p className="text-sm font-black text-red-100">
              Audit log warning
            </p>
            <p className="mt-2 text-xs text-red-100/75">{error.message}</p>
          </section>
        ) : null}

        <section className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-[1.5rem] border border-amber-400/20 bg-amber-400/10 p-5">
            <p className="text-xs text-amber-200/60">Latest Rows Loaded</p>
            <p className="mt-2 text-3xl font-black text-amber-100">
              {logs?.length ?? 0}
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-emerald-400/20 bg-emerald-400/10 p-5">
            <p className="text-xs text-emerald-200/60">Mode</p>
            <p className="mt-2 text-3xl font-black text-emerald-100">
              Read Only
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5">
            <p className="text-xs text-white/40">Write Tools</p>
            <p className="mt-2 text-3xl font-black text-white/70">
              Disabled
            </p>
          </div>
        </section>

        <section className="mt-6 rounded-[1.75rem] border border-amber-400/15 bg-black/40 p-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-amber-200/50">
                Latest Audit Events
              </p>

              <h2 className="mt-2 text-2xl font-black text-amber-100">
                Operator Action History
              </h2>
            </div>

            <p className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-black text-white/55">
              Last 50 rows
            </p>
          </div>

          <div className="mt-5 space-y-3">
            {(logs ?? []).map((log) => (
              <article
                key={log.id}
                className="rounded-2xl border border-white/10 bg-black/30 p-4"
              >
                <div className="grid gap-3 md:grid-cols-[180px_1fr_180px] md:items-start">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/35">
                      Action
                    </p>
                    <p className="mt-2 text-sm font-black text-amber-100">
                      {log.action}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/35">
                      Target
                    </p>
                    <p className="mt-2 break-all text-sm font-bold text-white/65">
                      {log.target_id ?? "—"}
                    </p>
                  </div>

                  <div className="md:text-right">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/35">
                      Created
                    </p>
                    <p className="mt-2 text-sm font-bold text-white/65">
                      {formatTime(log.created_at)}
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 md:grid-cols-[1fr_2fr]">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/35">
                      Admin ID
                    </p>
                    <p className="mt-2 break-all text-xs font-bold text-white/60">
                      {log.admin_id ?? "System / Unknown"}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/35">
                      Details
                    </p>
                    <pre className="mt-2 max-h-48 overflow-auto whitespace-pre-wrap break-words text-xs leading-5 text-white/55">
                      {formatDetails(log.details)}
                    </pre>
                  </div>
                </div>
              </article>
            ))}

            {(logs ?? []).length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
                <p className="text-sm font-black text-amber-100">
                  No audit logs yet.
                </p>
                <p className="mt-2 text-xs leading-5 text-white/45">
                  This is expected right now. Chapter 62.2 only creates
                  read-only audit visibility. Future admin write actions must
                  create audit log rows before they are accepted.
                </p>
              </div>
            ) : null}
          </div>
        </section>
      </section>
    </main>
  );
}