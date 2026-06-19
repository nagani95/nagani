// src/app/admin/audit-log/page.tsx

import AdminShell from "@/components/admin/AdminShell";
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

export default async function AdminAuditPage() {
  const supabase = await createClient();

  const { data: logs, error } = await supabase
    .from("admin_audit_logs")
    .select("id, admin_id, action, target_id, details, created_at")
    .order("created_at", { ascending: false })
    .limit(50)
    .returns<AdminAuditLog[]>();

  const loadedCount = logs?.length ?? 0;

  return (
    <AdminShell
      title="Audit Log"
      eyebrow="Operator Records"
      description="Read-only visibility for recorded admin actions. This page does not change wallets, settlements, rounds, results, or the player room."
    >
      {error ? (
        <section className="rounded-2xl border border-red-400/25 bg-red-950/25 p-4">
          <p className="text-sm font-black text-red-100">
            Audit log warning
          </p>
          <p className="mt-1 text-xs font-semibold text-red-100/70">
            {error.message}
          </p>
        </section>
      ) : null}

      <section className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-amber-300/15 bg-amber-300/10 p-4">
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-amber-100/55">
            Rows Loaded
          </p>
          <p className="mt-2 text-2xl font-black text-amber-100">
            {loadedCount}
          </p>
        </div>

        <div className="rounded-2xl border border-emerald-300/15 bg-emerald-400/10 p-4">
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-emerald-100/55">
            Mode
          </p>
          <p className="mt-2 text-2xl font-black text-emerald-100">
            Read Only
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-white/40">
            Loaded Range
          </p>
          <p className="mt-2 text-2xl font-black text-white/70">Last 50</p>
        </div>
      </section>

      <section className="mt-4 rounded-2xl border border-amber-300/12 bg-black/35 p-4">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.28em] text-amber-200/45">
              Latest Audit Events
            </p>
            <h2 className="mt-1 text-xl font-black text-amber-100">
              Operator Action History
            </h2>
          </div>

          <p className="rounded-full border border-white/10 bg-black/30 px-4 py-2 text-xs font-black text-white/45">
            Last 50 rows
          </p>
        </div>

        <div className="mt-4 grid gap-3">
          {(logs ?? []).map((log) => (
            <article
              key={log.id}
              className="rounded-xl border border-white/10 bg-[#120504] p-4"
            >
              <div className="grid gap-3 xl:grid-cols-[180px_1fr_180px] xl:items-start">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.18em] text-white/35">
                    Action
                  </p>
                  <p className="mt-2 break-words text-sm font-black text-amber-100">
                    {log.action}
                  </p>
                </div>

                <div className="min-w-0">
                  <p className="text-[11px] font-black uppercase tracking-[0.18em] text-white/35">
                    Target
                  </p>
                  <p className="mt-2 break-all text-sm font-bold text-white/65">
                    {log.target_id ?? "—"}
                  </p>
                </div>

                <div className="xl:text-right">
                  <p className="text-[11px] font-black uppercase tracking-[0.18em] text-white/35">
                    Created
                  </p>
                  <p className="mt-2 text-sm font-bold text-white/65">
                    {formatTime(log.created_at)}
                  </p>
                </div>
              </div>

              <div className="mt-3 grid gap-3 xl:grid-cols-[1fr_2fr]">
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                  <p className="text-[11px] font-black uppercase tracking-[0.18em] text-white/35">
                    Admin ID
                  </p>
                  <p className="mt-2 break-all text-xs font-bold text-white/60">
                    {log.admin_id ?? "System / Unknown"}
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                  <p className="text-[11px] font-black uppercase tracking-[0.18em] text-white/35">
                    Details
                  </p>
                  <pre className="mt-2 max-h-44 overflow-auto whitespace-pre-wrap break-words text-xs leading-5 text-white/55">
                    {formatDetails(log.details)}
                  </pre>
                </div>
              </div>
            </article>
          ))}

          {loadedCount === 0 ? (
            <div className="rounded-xl border border-white/10 bg-black/25 p-5">
              <p className="text-sm font-black text-amber-100">
                No audit logs found.
              </p>
              <p className="mt-1 text-xs font-semibold leading-5 text-white/45">
                Recorded admin actions will appear here after audit rows are
                created.
              </p>
            </div>
          ) : null}
        </div>
      </section>
    </AdminShell>
  );
}