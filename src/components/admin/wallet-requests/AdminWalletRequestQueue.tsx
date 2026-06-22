//src/components/admin/wallet-requests/AdminWalletRequestQueue.tsx

import Link from "next/link";
import type { ReactNode } from "react";

import {
  approveWalletRequest,
  rejectWalletRequest,
} from "@/lib/supabase/walletRequests";

export type AdminWalletRequestStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "cancelled";

export type AdminWalletRequestStatusFilter =
  | AdminWalletRequestStatus
  | "all";

export type AdminWalletRequestType = "deposit" | "withdraw";
export type AdminWalletRequestTypeFilter = AdminWalletRequestType | "all";

export type AdminWalletRequestItem = {
  id: string;
  profile_id: string;
  request_type: AdminWalletRequestType;
  amount: number | string;
  note: string | null;
  status: AdminWalletRequestStatus;
  admin_note: string | null;
  reviewed_at: string | null;
  created_at: string;
  wallet_address_id: string | null;
  payment_provider_key: string | null;
  payment_provider_name: string | null;
  payment_account_name: string | null;
  payment_account_number: string | null;
  profile: {
    username: string | null;
    member_code: string | null;
  } | null;
};

type AdminWalletRequestQueueProps = {
  successMessage?: string;
  errorMessage?: string;
  errors: string[];
  summary: {
    allCount: number;
    pendingCount: number;
    approvedCount: number;
    rejectedCount: number;
    pendingDepositTotal: number;
    pendingWithdrawTotal: number;
    viewCount: number;
  };
  filters: {
    status: AdminWalletRequestStatusFilter;
    type: AdminWalletRequestTypeFilter;
    q: string;
    page: number;
    pageSize: number;
    totalCount: number;
  };
  requests: AdminWalletRequestItem[];
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function formatMMK(amount: number | string | null | undefined) {
  const parsedAmount = Number(amount ?? 0);
  const safeAmount = Number.isFinite(parsedAmount) ? parsedAmount : 0;

  return `${new Intl.NumberFormat("en-US").format(safeAmount)} MMK`;
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

function formatRequestType(type: AdminWalletRequestType) {
  return type === "deposit" ? "Deposit" : "Withdraw";
}

function formatRequestStatus(status: AdminWalletRequestStatus) {
  if (status === "approved") return "Approved";
  if (status === "rejected") return "Rejected";
  if (status === "cancelled") return "Cancelled";

  return "Pending";
}

function getStatusClass(status: AdminWalletRequestStatus) {
  if (status === "approved") {
    return "border-emerald-300/25 bg-emerald-400/10 text-emerald-100";
  }

  if (status === "rejected" || status === "cancelled") {
    return "border-red-300/25 bg-red-500/10 text-red-100";
  }

  return "border-amber-300/25 bg-amber-300/10 text-amber-100";
}

function getTypeClass(type: AdminWalletRequestType) {
  if (type === "deposit") {
    return "border-emerald-300/25 bg-emerald-400/10 text-emerald-100";
  }

  return "border-sky-300/25 bg-sky-400/10 text-sky-100";
}

function getPaymentProviderLabel(request: AdminWalletRequestItem) {
  if (request.request_type === "withdraw") {
    return (
      request.payment_provider_name ||
      request.payment_provider_key ||
      "Withdraw target"
    );
  }

  return (
    request.payment_provider_name ||
    request.payment_provider_key ||
    request.wallet_address_id ||
    "Provider not saved"
  );
}

function buildHref(
  filters: AdminWalletRequestQueueProps["filters"],
  next: Partial<AdminWalletRequestQueueProps["filters"]>
) {
  const status = next.status ?? filters.status;
  const type = next.type ?? filters.type;
  const q = next.q ?? filters.q;
  const page = next.page ?? filters.page;

  const params = new URLSearchParams();

  params.set("status", status);
  params.set("type", type);

  if (q.trim()) {
    params.set("q", q.trim());
  }

  if (page > 1) {
    params.set("page", String(page));
  }

  return `/admin/wallet-requests?${params.toString()}`;
}

function StatCard({
  label,
  value,
  tone = "neutral",
}: {
  label: string;
  value: string | number;
  tone?: "neutral" | "amber" | "emerald" | "sky";
}) {
  return (
    <div
      className={cx(
        "rounded-2xl border p-4",
        tone === "amber" && "border-amber-300/15 bg-amber-300/10",
        tone === "emerald" && "border-emerald-300/15 bg-emerald-400/10",
        tone === "sky" && "border-sky-300/15 bg-sky-400/10",
        tone === "neutral" && "border-white/10 bg-white/[0.03]"
      )}
    >
      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/38">
        {label}
      </p>
      <p className="mt-2 truncate text-xl font-black text-amber-100">
        {value}
      </p>
    </div>
  );
}

function FilterPill({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cx(
        "rounded-full border px-4 py-2 text-xs font-black transition",
        active
          ? "border-amber-300/35 bg-amber-300/18 text-amber-100"
          : "border-white/10 bg-black/25 text-white/45 hover:border-amber-300/25 hover:text-amber-100"
      )}
    >
      {children}
    </Link>
  );
}

function RequestActionCell({ request }: { request: AdminWalletRequestItem }) {
  if (request.status !== "pending") {
    return (
      <div className="flex flex-col gap-1">
        <p
          className={cx(
            "w-fit rounded-full border px-3 py-2 text-xs font-black uppercase tracking-[0.14em]",
            getStatusClass(request.status)
          )}
        >
          {formatRequestStatus(request.status)}
        </p>

        <p className="text-xs font-bold text-white/35">
          {formatTime(request.reviewed_at)}
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-2">
      <form action={approveWalletRequest}>
        <input type="hidden" name="requestId" value={request.id} />
        <input type="hidden" name="adminNote" value="" />

        <button
          type="submit"
          className="w-full rounded-full border border-emerald-300/30 bg-emerald-400/15 px-4 py-2 text-xs font-black text-emerald-100 transition hover:bg-emerald-300 hover:text-black"
        >
          Approve
        </button>
      </form>

      <details className="rounded-2xl border border-red-300/20 bg-red-500/5 p-2">
        <summary className="cursor-pointer text-center text-xs font-black text-red-100/80">
          Reject / Note
        </summary>

        <form action={rejectWalletRequest} className="mt-2 grid gap-2">
          <input type="hidden" name="requestId" value={request.id} />

          <input
            name="adminNote"
            placeholder="Reject reason"
            className="w-full rounded-xl border border-red-300/15 bg-black/35 px-3 py-2 text-xs font-bold text-amber-50 outline-none placeholder:text-white/25 focus:border-red-300/40"
          />

          <button
            type="submit"
            className="w-full rounded-full border border-red-300/30 bg-red-500/15 px-4 py-2 text-xs font-black text-red-100 transition hover:bg-red-300 hover:text-black"
          >
            Confirm Reject
          </button>
        </form>
      </details>
    </div>
  );
}

function RequestRow({ request }: { request: AdminWalletRequestItem }) {
  const memberId = formatMemberId(
    request.profile_id,
    request.profile?.member_code
  );
  const phoneLabel = request.profile?.username || "Phone not saved";
  const shortProfileId = request.profile_id.slice(0, 8).toUpperCase();
  const providerLabel = getPaymentProviderLabel(request);
  const playerNote = request.note?.trim() || "No player note";

  return (
    <article className="overflow-hidden rounded-2xl border border-amber-300/12 bg-[#0b0302]">
      <div className="grid gap-3 p-3 xl:grid-cols-[110px_1.2fr_105px_145px_150px_1.3fr_190px] xl:items-center">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-white/28">
            Time
          </p>
          <p className="mt-1 text-xs font-bold text-white/55">
            {formatTime(request.created_at)}
          </p>
        </div>

        <div className="min-w-0">
          <p className="truncate text-base font-black text-amber-100">
            {memberId}
          </p>
          <p className="mt-1 truncate text-sm font-black text-[#ffe6a3]">
            {phoneLabel}
          </p>
          <p className="mt-1 text-[10px] font-semibold text-white/25">
            ID: {shortProfileId}
          </p>
        </div>

        <p
          className={cx(
            "w-fit rounded-full border px-3 py-2 text-xs font-black uppercase tracking-[0.14em]",
            getTypeClass(request.request_type)
          )}
        >
          {formatRequestType(request.request_type)}
        </p>

        <p
          className={cx(
            "text-base font-black",
            request.request_type === "deposit"
              ? "text-emerald-100"
              : "text-sky-100"
          )}
        >
          {formatMMK(request.amount)}
        </p>

        <div className="min-w-0">
          <p className="truncate text-xs font-black text-white/65">
            {providerLabel}
          </p>
          {request.payment_account_number ? (
            <p className="mt-1 truncate text-[11px] font-bold text-white/35">
              {request.payment_account_number}
            </p>
          ) : null}
        </div>

        <div className="min-w-0">
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-white/28">
            Note / Last 6
          </p>
          <p className="mt-1 truncate text-sm font-black text-amber-100/85">
            {playerNote}
          </p>
        </div>

        <RequestActionCell request={request} />
      </div>

      <details className="border-t border-white/10 px-3 py-2">
        <summary className="cursor-pointer text-xs font-black uppercase tracking-[0.18em] text-white/35 transition hover:text-amber-100">
          More Detail
        </summary>

        <div className="mt-3 grid gap-3 rounded-xl border border-white/10 bg-black/25 p-3 md:grid-cols-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-white/25">
              Receiver
            </p>
            <p className="mt-1 break-words text-sm font-black text-emerald-100">
              {providerLabel}
            </p>
          </div>

          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-white/25">
              Account Name
            </p>
            <p className="mt-1 break-words text-sm font-black text-amber-100">
              {request.payment_account_name || "—"}
            </p>
          </div>

          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-white/25">
              Account Number
            </p>
            <p className="mt-1 break-words text-sm font-black text-amber-100">
              {request.payment_account_number || "—"}
            </p>
          </div>

          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-white/25">
              Admin Note
            </p>
            <p className="mt-1 break-words text-sm font-semibold text-white/55">
              {request.admin_note || "—"}
            </p>
          </div>
        </div>
      </details>
    </article>
  );
}

export default function AdminWalletRequestQueue({
  successMessage,
  errorMessage,
  errors,
  summary,
  filters,
  requests,
}: AdminWalletRequestQueueProps) {
  const totalPages = Math.max(1, Math.ceil(filters.totalCount / filters.pageSize));
  const hasPreviousPage = filters.page > 1;
  const hasNextPage = filters.page < totalPages;

  const statusTabs: Array<{
    label: string;
    value: AdminWalletRequestStatusFilter;
    count?: number;
  }> = [
    { label: "Pending", value: "pending", count: summary.pendingCount },
    { label: "Approved", value: "approved", count: summary.approvedCount },
    { label: "Rejected", value: "rejected", count: summary.rejectedCount },
    { label: "All", value: "all", count: summary.allCount },
  ];

  const typeTabs: Array<{
    label: string;
    value: AdminWalletRequestTypeFilter;
  }> = [
    { label: "All Type", value: "all" },
    { label: "Deposit", value: "deposit" },
    { label: "Withdraw", value: "withdraw" },
  ];

  return (
    <div className="space-y-4">
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
        <section className="rounded-2xl border border-red-400/25 bg-red-950/25 p-4">
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

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Pending" value={summary.pendingCount} tone="amber" />
        <StatCard
          label="Pending Deposit"
          value={formatMMK(summary.pendingDepositTotal)}
          tone="emerald"
        />
        <StatCard
          label="Pending Withdraw"
          value={formatMMK(summary.pendingWithdrawTotal)}
          tone="sky"
        />
        <StatCard label="Current View" value={summary.viewCount} />
      </section>

      <section className="rounded-3xl border border-amber-300/12 bg-black/35 p-4">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.28em] text-amber-200/45">
              Cashier Queue
            </p>
            <h2 className="mt-1 text-xl font-black text-amber-100">
              Wallet Operation
            </h2>
          </div>

          <form
            action="/admin/wallet-requests"
            className="flex w-full flex-col gap-2 sm:flex-row xl:max-w-xl"
          >
            <input type="hidden" name="status" value={filters.status} />
            <input type="hidden" name="type" value={filters.type} />

            <input
              name="q"
              defaultValue={filters.q}
              placeholder="Search member, phone, last 6, provider..."
              className="min-w-0 flex-1 rounded-full border border-white/10 bg-black/35 px-4 py-2 text-sm font-bold text-amber-50 outline-none placeholder:text-white/25 focus:border-amber-300/35"
            />

            <button
              type="submit"
              className="rounded-full border border-amber-300/25 bg-amber-300/12 px-5 py-2 text-xs font-black text-amber-100 transition hover:bg-amber-300 hover:text-black"
            >
              Search
            </button>

            {filters.q ? (
              <Link
                href={buildHref(filters, { q: "", page: 1 })}
                className="rounded-full border border-white/10 bg-black/25 px-5 py-2 text-center text-xs font-black text-white/45 transition hover:text-amber-100"
              >
                Clear
              </Link>
            ) : null}
          </form>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {statusTabs.map((tab) => (
            <FilterPill
              key={tab.value}
              href={buildHref(filters, { status: tab.value, page: 1 })}
              active={filters.status === tab.value}
            >
              <span>{tab.label}</span>
              {typeof tab.count === "number" ? (
                <span className="ml-2 text-white/45">{tab.count}</span>
              ) : null}
            </FilterPill>
          ))}
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {typeTabs.map((tab) => (
            <FilterPill
              key={tab.value}
              href={buildHref(filters, { type: tab.value, page: 1 })}
              active={filters.type === tab.value}
            >
              {tab.label}
            </FilterPill>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-amber-300/12 bg-black/25 p-3">
        <div className="hidden border-b border-white/10 px-3 pb-3 text-[10px] font-black uppercase tracking-[0.18em] text-white/30 xl:grid xl:grid-cols-[110px_1.2fr_105px_145px_150px_1.3fr_190px]">
          <p>Time</p>
          <p>Player</p>
          <p>Type</p>
          <p>Amount</p>
          <p>Provider</p>
          <p>Note / Last 6</p>
          <p>Action</p>
        </div>

        <div className="mt-3 grid gap-3">
          {requests.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-black/25 p-6 text-center">
              <p className="text-sm font-black text-white/45">
                No wallet requests match this view.
              </p>
            </div>
          ) : null}

          {requests.map((request) => (
            <RequestRow key={request.id} request={request} />
          ))}
        </div>

        <div className="mt-4 flex flex-col gap-3 border-t border-white/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs font-bold text-white/40">
            Page {filters.page} of {totalPages} · {filters.totalCount} result
            {filters.totalCount === 1 ? "" : "s"}
          </p>

          <div className="flex gap-2">
            {hasPreviousPage ? (
              <Link
                href={buildHref(filters, { page: filters.page - 1 })}
                className="rounded-full border border-white/10 bg-black/25 px-5 py-2 text-xs font-black text-white/55 transition hover:border-amber-300/25 hover:text-amber-100"
              >
                Previous
              </Link>
            ) : (
              <span className="rounded-full border border-white/5 bg-black/20 px-5 py-2 text-xs font-black text-white/20">
                Previous
              </span>
            )}

            {hasNextPage ? (
              <Link
                href={buildHref(filters, { page: filters.page + 1 })}
                className="rounded-full border border-amber-300/25 bg-amber-300/12 px-5 py-2 text-xs font-black text-amber-100 transition hover:bg-amber-300 hover:text-black"
              >
                Next
              </Link>
            ) : (
              <span className="rounded-full border border-white/5 bg-black/20 px-5 py-2 text-xs font-black text-white/20">
                Next
              </span>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}