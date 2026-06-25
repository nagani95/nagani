// src/app/admin/wallet-requests/page.tsx

import Link from "next/link";

import AdminWalletRequestsAutoRefresh from "@/components/admin/wallet-requests/AdminWalletRequestsAutoRefresh";
import AdminShell from "@/components/admin/AdminShell";
import AdminWalletRequestQueue, {
  type AdminWalletRequestItem,
  type AdminWalletRequestStatusFilter,
  type AdminWalletRequestTypeFilter,
} from "@/components/admin/wallet-requests/AdminWalletRequestQueue";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 30;
const SEARCH_LOAD_LIMIT = 300;

const WALLET_REQUEST_SELECT =
  "id, profile_id, request_type, amount, note, status, admin_note, reviewed_at, created_at, wallet_address_id, payment_provider_key, payment_provider_name, payment_account_name, payment_account_number";

type WalletRequestRow = Omit<
  AdminWalletRequestItem,
  "profile" | "current_balance"
>;

type ProfileRow = {
  id: string;
  username: string | null;
  member_code: string | null;
};

type WalletRow = {
  profile_id: string;
  balance: number | string | null;
};

type AdminWalletRequestsPageProps = {
  searchParams?: Promise<{
    message?: string;
    error?: string;
    status?: string;
    type?: string;
    q?: string;
    page?: string;
  }>;
};

function parseStatusFilter(value?: string): AdminWalletRequestStatusFilter {
  if (
    value === "all" ||
    value === "pending" ||
    value === "approved" ||
    value === "rejected" ||
    value === "cancelled"
  ) {
    return value;
  }

  return "pending";
}

function parseTypeFilter(value?: string): AdminWalletRequestTypeFilter {
  if (value === "deposit" || value === "withdraw" || value === "all") {
    return value;
  }

  return "all";
}

function parsePage(value?: string) {
  const parsedPage = Number(value ?? 1);

  if (!Number.isFinite(parsedPage) || parsedPage < 1) {
    return 1;
  }

  return Math.floor(parsedPage);
}

function matchesRequestSearch(
  request: WalletRequestRow,
  profile: ProfileRow | undefined,
  searchTerm: string
) {
  const target = searchTerm.trim().toLowerCase();

  if (!target) return true;

  const searchableText = [
    request.id,
    request.profile_id,
    profile?.member_code,
    profile?.username,
    request.request_type,
    request.status,
    String(request.amount),
    request.note,
    request.admin_note,
    request.wallet_address_id,
    request.payment_provider_key,
    request.payment_provider_name,
    request.payment_account_name,
    request.payment_account_number,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return searchableText.includes(target);
}

export default async function AdminWalletRequestsPage({
  searchParams,
}: AdminWalletRequestsPageProps) {
  const params = await searchParams;
  const successMessage = params?.message;
  const errorMessage = params?.error;
  const statusFilter = parseStatusFilter(params?.status);
  const typeFilter = parseTypeFilter(params?.type);
  const searchTerm = String(params?.q ?? "").trim();
  const page = parsePage(params?.page);
  const offset = (page - 1) * PAGE_SIZE;
  const supabase = await createClient();

  let listQuery = supabase
    .from("wallet_requests")
    .select(WALLET_REQUEST_SELECT, { count: "exact" })
    .order("created_at", { ascending: false });

  if (statusFilter !== "all") {
    listQuery = listQuery.eq("status", statusFilter);
  }

  if (typeFilter !== "all") {
    listQuery = listQuery.eq("request_type", typeFilter);
  }

  const [
    allCountResult,
    pendingCountResult,
    approvedCountResult,
    rejectedCountResult,
    pendingAmountResult,
    requestResult,
  ] = await Promise.all([
    supabase
      .from("wallet_requests")
      .select("id", { count: "exact", head: true }),

    supabase
      .from("wallet_requests")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending"),

    supabase
      .from("wallet_requests")
      .select("id", { count: "exact", head: true })
      .eq("status", "approved"),

    supabase
      .from("wallet_requests")
      .select("id", { count: "exact", head: true })
      .eq("status", "rejected"),

    supabase
      .from("wallet_requests")
      .select("request_type, amount")
      .eq("status", "pending")
      .limit(1000)
      .returns<Pick<WalletRequestRow, "request_type" | "amount">[]>(),

    searchTerm
      ? listQuery.limit(SEARCH_LOAD_LIMIT).returns<WalletRequestRow[]>()
      : listQuery
          .range(offset, offset + PAGE_SIZE - 1)
          .returns<WalletRequestRow[]>(),
  ]);

  const requestRows = requestResult.data ?? [];
  const profileIds = Array.from(
    new Set(requestRows.map((request) => request.profile_id))
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

  const { data: wallets, error: walletsError } =
    profileIds.length > 0
      ? await supabase
          .from("wallets")
          .select("profile_id, balance")
          .in("profile_id", profileIds)
          .returns<WalletRow[]>()
      : { data: [], error: null };

  const walletBalanceByProfileId = new Map(
    (wallets ?? []).map((wallet) => [wallet.profile_id, wallet.balance])
  );

  const matchedRows = searchTerm
    ? requestRows.filter((request) =>
        matchesRequestSearch(
          request,
          profileById.get(request.profile_id),
          searchTerm
        )
      )
    : requestRows;

  const visibleRows = searchTerm
    ? matchedRows.slice(offset, offset + PAGE_SIZE)
    : matchedRows;

  const totalCount = searchTerm
    ? matchedRows.length
    : requestResult.count ?? visibleRows.length;

  const pendingAmountRows = pendingAmountResult.data ?? [];
  const pendingDepositTotal = pendingAmountRows
    .filter((request) => request.request_type === "deposit")
    .reduce((sum, request) => sum + Number(request.amount ?? 0), 0);

  const pendingWithdrawTotal = pendingAmountRows
    .filter((request) => request.request_type === "withdraw")
    .reduce((sum, request) => sum + Number(request.amount ?? 0), 0);

  const requests: AdminWalletRequestItem[] = visibleRows.map((request) => {
    const currentBalance = Number(
      walletBalanceByProfileId.get(request.profile_id) ?? 0
    );

    return {
      ...request,
      current_balance: Number.isFinite(currentBalance) ? currentBalance : 0,
      profile: profileById.get(request.profile_id) ?? null,
    };
  });

  const errors = [
    requestResult.error ? `Wallet requests: ${requestResult.error.message}` : null,
    profilesError ? `Profiles: ${profilesError.message}` : null,
    walletsError ? `Wallets: ${walletsError.message}` : null,
    allCountResult.error ? `All count: ${allCountResult.error.message}` : null,
    pendingCountResult.error
      ? `Pending count: ${pendingCountResult.error.message}`
      : null,
    approvedCountResult.error
      ? `Approved count: ${approvedCountResult.error.message}`
      : null,
    rejectedCountResult.error
      ? `Rejected count: ${rejectedCountResult.error.message}`
      : null,
    pendingAmountResult.error
      ? `Pending amount: ${pendingAmountResult.error.message}`
      : null,
  ].filter((item): item is string => Boolean(item));

  return (
    <AdminShell
      title="Wallet Requests"
      eyebrow="Balance Operation"
      description="Compact cashier queue for deposit and withdraw approval."
      action={
        <Link
          href="/admin/users"
          className="rounded-full border border-amber-300/20 bg-amber-300/10 px-4 py-2 text-xs font-black text-amber-100/80 transition hover:bg-amber-300 hover:text-black"
        >
          Users
        </Link>
      }
    >
      <AdminWalletRequestsAutoRefresh />
      <AdminWalletRequestQueue
        successMessage={successMessage}
        errorMessage={errorMessage}
        errors={errors}
        summary={{
          allCount: allCountResult.count ?? 0,
          pendingCount: pendingCountResult.count ?? 0,
          approvedCount: approvedCountResult.count ?? 0,
          rejectedCount: rejectedCountResult.count ?? 0,
          pendingDepositTotal,
          pendingWithdrawTotal,
          viewCount: totalCount,
        }}
        filters={{
          status: statusFilter,
          type: typeFilter,
          q: searchTerm,
          page,
          pageSize: PAGE_SIZE,
          totalCount,
        }}
        requests={requests}
      />
    </AdminShell>
  );
}