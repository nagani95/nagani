// src/app/admin/wallet-requests/page.tsx

import Link from "next/link";

import { createClient } from "@/lib/supabase/server";
import {
  approveWalletRequest,
  rejectWalletRequest,
} from "@/lib/supabase/walletRequests";

export const dynamic = "force-dynamic";

type WalletRequestRow = {
  id: string;
  profile_id: string;
  request_type: "deposit" | "withdraw";
  amount: number | string;
  note: string | null;
  status: "pending" | "approved" | "rejected" | "cancelled";
  created_at: string;
};

type AdminWalletRequestsPageProps = {
  searchParams?: Promise<{
    message?: string;
    error?: string;
  }>;
};

function formatMMK(amount: number) {
  return new Intl.NumberFormat("en-US").format(amount);
}

function formatRequestType(type: WalletRequestRow["request_type"]) {
  return type === "deposit" ? "Deposit" : "Withdraw";
}

function formatRequestStatus(status: WalletRequestRow["status"]) {
  if (status === "approved") return "Confirmed";
  if (status === "rejected") return "Rejected";
  if (status === "cancelled") return "Cancelled";

  return "Pending review";
}

function getStatusClass(status: WalletRequestRow["status"]) {
  if (status === "approved") {
    return "border-emerald-400/20 bg-emerald-400/10 text-emerald-100";
  }

  if (status === "rejected" || status === "cancelled") {
    return "border-red-400/20 bg-red-400/10 text-red-100";
  }

  return "border-amber-400/20 bg-amber-400/10 text-amber-100";
}

function formatTime(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Yangon",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function formatMemberId(profileId: string) {
  return `NG-${profileId.slice(0, 8).toUpperCase()}`;
}

export default async function AdminWalletRequestsPage({
  searchParams,
}: AdminWalletRequestsPageProps) {
  const params = await searchParams;
  const successMessage = params?.message;
  const errorMessage = params?.error;
  const supabase = await createClient();

  const { data: requests, error } = await supabase
    .from("wallet_requests")
    .select("id, profile_id, request_type, amount, note, status, created_at")
    .order("created_at", { ascending: false })
    .limit(50)
    .returns<WalletRequestRow[]>();

  const pendingCount = (requests ?? []).filter(
    (request) => request.status === "pending"
  ).length;

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

          <div className="mt-3 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-4xl font-black text-amber-100">
                Wallet Requests
              </h1>
              <p className="mt-3 text-sm leading-6 text-amber-50/65">
                Review deposit and withdraw settlement tickets submitted by
                registered players.
              </p>
            </div>

            <div className="rounded-2xl border border-amber-400/20 bg-amber-400/10 px-5 py-4 text-right">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-200/55">
                Pending
              </p>
              <p className="mt-1 text-3xl font-black text-amber-100">
                {pendingCount}
              </p>
            </div>
          </div>
        </header>

        {successMessage ? (
  <section className="mt-6 rounded-[1.5rem] border border-emerald-400/30 bg-emerald-950/30 p-5">
    <p className="text-sm font-black text-emerald-100">
      {successMessage}
    </p>
  </section>
) : null}

{errorMessage ? (
  <section className="mt-6 rounded-[1.5rem] border border-red-400/30 bg-red-950/30 p-5">
    <p className="text-sm font-black text-red-100">
      {errorMessage}
    </p>
  </section>
) : null}

        {error ? (
          <section className="mt-6 rounded-[1.5rem] border border-red-400/30 bg-red-950/30 p-5">
            <p className="text-sm font-black text-red-100">
              Wallet request warning
            </p>
            <p className="mt-2 text-xs text-red-100/75">{error.message}</p>
          </section>
        ) : null}

        <section className="mt-6 grid gap-4">
          {(requests ?? []).length === 0 ? (
            <div className="rounded-[1.5rem] border border-white/10 bg-black/40 p-5 text-sm font-bold text-white/45">
              No wallet requests yet.
            </div>
          ) : null}

          {(requests ?? []).map((request) => (
            <article
              key={request.id}
              className="rounded-[1.5rem] border border-amber-400/15 bg-black/40 p-5"
            >
              <div className="grid gap-4 md:grid-cols-[180px_1fr_140px_160px_160px] md:items-center">
                <div>
                  <p className="text-xs font-bold text-white/40">
                    NG-WALLET-{request.id.slice(0, 8).toUpperCase()}
                  </p>
                  <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white/30">
                    {formatTime(request.created_at)}
                  </p>
                </div>

                <div className="min-w-0">
                  <p className="text-lg font-black text-amber-100">
                    {formatMemberId(request.profile_id)}
                  </p>
                  <p className="mt-1 break-all text-xs text-white/35">
                    {request.profile_id}
                  </p>
                  {request.note ? (
                    <p className="mt-2 text-xs font-bold text-white/50">
                      Note: {request.note}
                    </p>
                  ) : null}
                </div>

                <p className="font-bold text-white/70">
                  {formatRequestType(request.request_type)}
                </p>

                <p className="font-black text-emerald-100">
                  {formatMMK(Number(request.amount))} MMK
                </p>

                <p
                  className={`rounded-full border px-3 py-2 text-center text-xs font-black uppercase tracking-[0.14em] ${getStatusClass(
                    request.status
                  )}`}
                >
                  {formatRequestStatus(request.status)}
                </p>
</div>

{request.status === "pending" ? (
  <div className="mt-5 grid gap-3 border-t border-white/10 pt-4 md:grid-cols-2">
    <form action={approveWalletRequest}>
      <input type="hidden" name="requestId" value={request.id} />
      <button
        type="submit"
        className="w-full rounded-full border border-emerald-300/30 bg-emerald-400/15 px-5 py-3 text-sm font-black text-emerald-100 transition hover:bg-emerald-300 hover:text-black"
      >
        Approve
      </button>
    </form>

    <form action={rejectWalletRequest}>
      <input type="hidden" name="requestId" value={request.id} />
      <button
        type="submit"
        className="w-full rounded-full border border-red-300/30 bg-red-500/15 px-5 py-3 text-sm font-black text-red-100 transition hover:bg-red-300 hover:text-black"
      >
        Reject
      </button>
    </form>
  </div>
) : null}
</article>
          ))}
        </section>
      </section>
    </main>
  );
}