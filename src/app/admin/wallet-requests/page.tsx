// src/app/admin/wallet-requests/page.tsx

import Link from "next/link";

import AdminShell from "@/components/admin/AdminShell";
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
  admin_note: string | null;
  reviewed_at: string | null;
  created_at: string;
wallet_address_id: string | null;
payment_provider_key: string | null;
payment_provider_name: string | null;
payment_account_name: string | null;
payment_account_number: string | null;
};

type ProfileRow = {
  id: string;
  username: string | null;
  member_code: string | null;
};

type AdminWalletRequestsPageProps = {
  searchParams?: Promise<{
    message?: string;
    error?: string;
  }>;
};

function formatMMK(amount: number | string | null | undefined) {
  const safeAmount = Number(amount ?? 0);
  return `${new Intl.NumberFormat("en-US").format(safeAmount)} MMK`;
}

function formatRequestType(type: WalletRequestRow["request_type"]) {
  return type === "deposit" ? "Deposit" : "Withdraw";
}

function formatRequestStatus(status: WalletRequestRow["status"]) {
  if (status === "approved") return "Approved";
  if (status === "rejected") return "Rejected";
  if (status === "cancelled") return "Cancelled";

  return "Pending";
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

function getTypeClass(type: WalletRequestRow["request_type"]) {
  if (type === "deposit") {
    return "border-emerald-400/20 bg-emerald-400/10 text-emerald-100";
  }

  return "border-sky-400/20 bg-sky-400/10 text-sky-100";
}

function formatTime(value: string | null | undefined) {
  if (!value) return "—";

  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Yangon",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function formatMemberId(profileId: string, memberCode?: string | null) {
  return memberCode || `NG-${profileId.slice(0, 8).toUpperCase()}`;
}

function getPaymentProviderLabel(request: WalletRequestRow) {
  if (request.request_type === "withdraw") {
    return "Withdraw";
  }

  return (
    request.payment_provider_name ||
    request.wallet_address_id ||
    "Deposit provider not saved"
  );
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
    .select(
      "id, profile_id, request_type, amount, note, status, admin_note, reviewed_at, created_at, wallet_address_id, payment_provider_key, payment_provider_name, payment_account_name, payment_account_number"
    )
    .order("created_at", { ascending: false })
    .limit(50)
    .returns<WalletRequestRow[]>();

  const profileIds = Array.from(
    new Set((requests ?? []).map((request) => request.profile_id))
  );

  const { data: profiles, error: profilesError } =
    profileIds.length > 0
      ? await supabase
          .from("profiles")
          .select("id, username, member_code")
          .in("id", profileIds)
          .returns<ProfileRow[]>()
      : { data: [], error: null };

  const profileById = new Map(
    (profiles ?? []).map((profile) => [profile.id, profile])
  );

  const requestList = requests ?? [];
  const pendingRequests = requestList.filter(
    (request) => request.status === "pending"
  );
  const reviewedRequests = requestList.filter(
    (request) => request.status !== "pending"
  );

  const pendingDepositTotal = pendingRequests
    .filter((request) => request.request_type === "deposit")
    .reduce((sum, request) => sum + Number(request.amount ?? 0), 0);

  const pendingWithdrawTotal = pendingRequests
    .filter((request) => request.request_type === "withdraw")
    .reduce((sum, request) => sum + Number(request.amount ?? 0), 0);

  const errors = [
    error ? `Wallet requests: ${error.message}` : null,
    profilesError ? `Profiles: ${profilesError.message}` : null,
  ].filter((item): item is string => Boolean(item));

  return (
    <AdminShell
      title="Wallet Requests"
      eyebrow="Balance Operation"
      description="Review player deposit and withdraw requests. Approval and rejection still use the protected wallet review RPC."
      action={
        <Link
          href="/admin/users"
          className="rounded-full border border-amber-300/20 bg-amber-300/10 px-4 py-2 text-xs font-black text-amber-100/80 transition hover:bg-amber-300 hover:text-black"
        >
          Users
        </Link>
      }
    >
      {successMessage ? (
        <section className="rounded-2xl border border-emerald-400/25 bg-emerald-950/25 p-4">
          <p className="text-sm font-black text-emerald-100">
            {successMessage}
          </p>
        </section>
      ) : null}

      {errorMessage ? (
        <section className="rounded-2xl border border-red-400/25 bg-red-950/25 p-4">
          <p className="text-sm font-black text-red-100">{errorMessage}</p>
        </section>
      ) : null}

      {errors.length > 0 ? (
        <section className="mt-3 rounded-2xl border border-red-400/25 bg-red-950/25 p-4">
          <p className="text-sm font-black text-red-100">
            Wallet request warning
          </p>

          <div className="mt-2 space-y-1">
            {errors.map((item) => (
              <p key={item} className="text-xs font-semibold text-red-100/70">
                {item}
              </p>
            ))}
          </div>
        </section>
      ) : null}

      <section className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-amber-300/15 bg-amber-300/10 p-4">
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-amber-100/55">
            Pending
          </p>
          <p className="mt-2 text-2xl font-black text-amber-100">
            {pendingRequests.length}
          </p>
        </div>

        <div className="rounded-2xl border border-emerald-300/15 bg-emerald-400/10 p-4">
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-emerald-100/55">
            Pending Deposit
          </p>
          <p className="mt-2 truncate text-2xl font-black text-emerald-100">
            {formatMMK(pendingDepositTotal)}
          </p>
        </div>

        <div className="rounded-2xl border border-sky-300/15 bg-sky-400/10 p-4">
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-sky-100/55">
            Pending Withdraw
          </p>
          <p className="mt-2 truncate text-2xl font-black text-sky-100">
            {formatMMK(pendingWithdrawTotal)}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-white/40">
            Loaded Requests
          </p>
          <p className="mt-2 text-2xl font-black text-amber-100">
            {requestList.length}
          </p>
        </div>
      </section>

      <section className="mt-4 rounded-2xl border border-amber-300/12 bg-black/35 p-4">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.28em] text-amber-200/45">
              Pending Review
            </p>
            <h2 className="mt-1 text-xl font-black text-amber-100">
              Action Required
            </h2>
          </div>

          <p className="rounded-full border border-amber-300/15 bg-amber-300/10 px-4 py-2 text-xs font-black text-amber-100/70">
            {pendingRequests.length} pending
          </p>
        </div>

        <div className="mt-4 grid gap-3">
          {pendingRequests.length === 0 ? (
            <div className="rounded-xl border border-white/10 bg-black/25 p-4 text-sm font-bold text-white/45">
              No pending wallet requests.
            </div>
          ) : null}

          {pendingRequests.map((request) => {
            const profile = profileById.get(request.profile_id);

            return (
              <article
                key={request.id}
                className="rounded-xl border border-amber-300/15 bg-[#120504] p-4"
              >
                <div className="grid gap-3 lg:grid-cols-[160px_1fr_120px_160px_120px] lg:items-center">
<div>
  <p className="text-[10px] font-black uppercase tracking-[0.16em] text-white/30">
    Request Time
  </p>
  <p className="mt-1 text-xs font-bold text-white/45">
    {formatTime(request.created_at)}
  </p>
</div>

<div className="min-w-0">
  <p className="text-base font-black text-amber-100">
    {formatMemberId(request.profile_id, profile?.member_code)}
  </p>

  <p className="mt-1 break-all text-sm font-black text-[#ffe6a3]">
    {profile?.username || "Phone not saved"}
  </p>

  <p className="mt-1 break-all text-[10px] font-semibold text-white/25">
    ID: {request.profile_id.slice(0, 8).toUpperCase()}
  </p>
</div>

                  <p
                    className={`w-fit rounded-full border px-3 py-2 text-xs font-black uppercase tracking-[0.14em] ${getTypeClass(
                      request.request_type
                    )}`}
                  >
                    {formatRequestType(request.request_type)}
                  </p>

                  <p className="text-lg font-black text-emerald-100">
                    {formatMMK(request.amount)}
                  </p>

                  <p
                    className={`w-fit rounded-full border px-3 py-2 text-xs font-black uppercase tracking-[0.14em] ${getStatusClass(
                      request.status
                    )}`}
                  >
                    {formatRequestStatus(request.status)}
                  </p>
                </div>

                {request.request_type === "deposit" ? (
  <div className="mt-3 rounded-xl border border-emerald-300/15 bg-emerald-400/10 p-3">
    <p className="text-[11px] font-black uppercase tracking-[0.18em] text-emerald-100/45">
      Payment Receiver
    </p>

    <div className="mt-2 grid gap-2 md:grid-cols-3">
      <div>
        <p className="text-[10px] font-bold text-white/30">Provider</p>
        <p className="mt-1 text-sm font-black text-emerald-100">
          {getPaymentProviderLabel(request)}
        </p>
      </div>

      <div>
        <p className="text-[10px] font-bold text-white/30">Account Name</p>
        <p className="mt-1 text-sm font-black text-amber-100">
          {request.payment_account_name || "—"}
        </p>
      </div>

      <div>
        <p className="text-[10px] font-bold text-white/30">Account Number</p>
        <p className="mt-1 text-sm font-black text-amber-100">
          {request.payment_account_number || "—"}
        </p>
      </div>
    </div>
  </div>
) : null}

                {request.note ? (
                  <div className="mt-3 rounded-xl border border-white/10 bg-black/25 p-3">
                    <p className="text-[11px] font-black uppercase tracking-[0.18em] text-white/30">
                      Player Note
                    </p>
                    <p className="mt-1 break-words text-sm font-semibold text-white/55">
                      {request.note}
                    </p>
                  </div>
                ) : null}

                <div className="mt-4 grid gap-3 border-t border-white/10 pt-4 md:grid-cols-2">
                  <form action={approveWalletRequest} className="space-y-3">
                    <input type="hidden" name="requestId" value={request.id} />

                    <input
                      name="adminNote"
                      placeholder="Admin note for approval"
                      className="w-full rounded-xl border border-emerald-300/15 bg-black/35 px-4 py-3 text-sm font-bold text-amber-50 outline-none placeholder:text-white/25 focus:border-emerald-300/40"
                    />

                    <button
                      type="submit"
                      className="w-full rounded-full border border-emerald-300/30 bg-emerald-400/15 px-5 py-3 text-sm font-black text-emerald-100 transition hover:bg-emerald-300 hover:text-black"
                    >
                      Approve
                    </button>
                  </form>

                  <form action={rejectWalletRequest} className="space-y-3">
                    <input type="hidden" name="requestId" value={request.id} />

                    <input
                      name="adminNote"
                      placeholder="Admin note for rejection"
                      className="w-full rounded-xl border border-red-300/15 bg-black/35 px-4 py-3 text-sm font-bold text-amber-50 outline-none placeholder:text-white/25 focus:border-red-300/40"
                    />

                    <button
                      type="submit"
                      className="w-full rounded-full border border-red-300/30 bg-red-500/15 px-5 py-3 text-sm font-black text-red-100 transition hover:bg-red-300 hover:text-black"
                    >
                      Reject
                    </button>
                  </form>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="mt-4 rounded-2xl border border-white/10 bg-black/25 p-4">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.28em] text-white/35">
            Reviewed Requests
          </p>
          <h2 className="mt-1 text-xl font-black text-amber-100">
            Recent History
          </h2>
        </div>

        <div className="mt-4 overflow-hidden rounded-xl border border-white/10">
          {reviewedRequests.length === 0 ? (
            <div className="px-4 py-5 text-sm font-bold text-white/45">
              No reviewed requests loaded.
            </div>
          ) : null}

          {reviewedRequests.map((request) => {
            const profile = profileById.get(request.profile_id);

            return (
              <div
                key={request.id}
                className="grid gap-3 border-b border-white/10 p-4 last:border-b-0 xl:grid-cols-[150px_1fr_120px_150px_130px_150px] xl:items-center"
              >
<div>
  <p className="text-[10px] font-black uppercase tracking-[0.16em] text-white/30">
    Request Time
  </p>
  <p className="mt-1 text-xs font-bold text-white/45">
    {formatTime(request.created_at)}
  </p>
</div>

<div className="min-w-0">
  <p className="font-black text-amber-100">
    {formatMemberId(request.profile_id, profile?.member_code)}
  </p>

  <p className="mt-1 break-all text-sm font-black text-[#ffe6a3]">
    {profile?.username || "Phone not saved"}
  </p>

  <p className="mt-1 break-all text-[10px] font-semibold text-white/25">
    ID: {request.profile_id.slice(0, 8).toUpperCase()}
  </p>

  {request.request_type === "deposit" ? (
    <p className="mt-1 text-xs font-black text-emerald-100/70">
      {getPaymentProviderLabel(request)}
    </p>
  ) : null}
</div>

                <p
                  className={`w-fit rounded-full border px-3 py-2 text-xs font-black uppercase tracking-[0.14em] ${getTypeClass(
                    request.request_type
                  )}`}
                >
                  {formatRequestType(request.request_type)}
                </p>

                <p className="font-black text-emerald-100">
                  {formatMMK(request.amount)}
                </p>

                <p
                  className={`w-fit rounded-full border px-3 py-2 text-xs font-black uppercase tracking-[0.14em] ${getStatusClass(
                    request.status
                  )}`}
                >
                  {formatRequestStatus(request.status)}
                </p>

                <div>
                  <p className="text-xs font-bold text-white/35">
                    {formatTime(request.reviewed_at)}
                  </p>
                  {request.admin_note ? (
                    <p className="mt-1 break-words text-xs font-semibold text-white/45">
                      {request.admin_note}
                    </p>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </AdminShell>
  );
}