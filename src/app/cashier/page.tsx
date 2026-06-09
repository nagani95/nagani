// src/app/cashier/page.tsx

"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";

import CashierHero from "@/components/cashier/CashierHero";
import CashierNote from "@/components/cashier/CashierNote";
import CashierRecentTickets from "@/components/cashier/CashierRecentTickets";
import CashierRequestForm from "@/components/cashier/CashierRequestForm";
import AppShell from "@/components/layout/AppShell";
import { createClient } from "@/lib/supabase/client";

type CashierTab = "deposit" | "withdraw";

type WalletRequestRow = {
  id: string;
  request_type: "deposit" | "withdraw";
  amount: number | string;
  status: "pending" | "approved" | "rejected" | "cancelled";
  created_at: string;
};

type CashierTicket = {
  id: string;
  type: string;
  amount: number;
  status: string;
  time: string;
};

function formatMMK(amount: number) {
  return new Intl.NumberFormat("en-US").format(amount);
}

function formatTicketTime(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Yangon",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
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

function CashierPageContent() {
  const searchParams = useSearchParams();
  const successMessage = searchParams.get("message");
  const errorMessage = searchParams.get("error");

  const [supabase] = useState(() => createClient());
  const [walletBalance, setWalletBalance] = useState(0);
  const [recentTickets, setRecentTickets] = useState<CashierTicket[]>([]);

  const [activeTab, setActiveTab] = useState<CashierTab>("deposit");
  const [amount, setAmount] = useState("10000");
  const [note, setNote] = useState("");

  const numericAmount = Number(amount || 0);
  const isValidAmount = numericAmount >= 1000;

  const actionLabel = useMemo(() => {
    return activeTab === "deposit"
      ? "Submit Deposit Request"
      : "Submit Withdraw Request";
  }, [activeTab]);

  useEffect(() => {
    let isMounted = true;

    async function fetchCashierData() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data: wallet } = await supabase
        .from("wallets")
        .select("balance")
        .eq("profile_id", user.id)
        .maybeSingle<{ balance: number | string | null }>();

      const { data: requests } = await supabase
        .from("wallet_requests")
        .select("id, request_type, amount, status, created_at")
        .eq("profile_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10)
        .returns<WalletRequestRow[]>();

      if (!isMounted) return;

      setWalletBalance(Number(wallet?.balance ?? 0));

      setRecentTickets(
        (requests ?? []).map((request) => ({
          id: `NG-WALLET-${request.id.slice(0, 8).toUpperCase()}`,
          type: formatRequestType(request.request_type),
          amount: Number(request.amount),
          status: formatRequestStatus(request.status),
          time: formatTicketTime(request.created_at),
        }))
      );
    }

    void fetchCashierData();

    return () => {
      isMounted = false;
    };
  }, [supabase, successMessage]);

  function handleTabChange(tab: CashierTab) {
    setActiveTab(tab);
  }

  function handleAmountChange(value: string) {
    setAmount(value);
  }

  function handleNoteChange(value: string) {
    setNote(value);
  }

  function handleSubmitRequest() {
    // Server action handles submit now.
  }

  return (
    <AppShell>
      <header className="flex items-center justify-between">
        <Link href="/" className="text-sm font-bold text-amber-300">
          ← Lobby
        </Link>

        <div className="rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-xs font-bold text-amber-100">
          Wallet
        </div>
      </header>

      <CashierHero balanceLabel={`${formatMMK(walletBalance)} MMK`} />

      {successMessage ? (
        <div className="mt-4 rounded-[1.25rem] border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm font-bold text-emerald-100">
          {successMessage}
        </div>
      ) : null}

      {errorMessage ? (
        <div className="mt-4 rounded-[1.25rem] border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm font-bold text-red-100">
          {errorMessage}
        </div>
      ) : null}

      <CashierRequestForm
        activeTab={activeTab}
        amount={amount}
        note={note}
        amountLabel={formatMMK(numericAmount || 0)}
        actionLabel={actionLabel}
        isValidAmount={isValidAmount}
        onTabChange={handleTabChange}
        onAmountChange={handleAmountChange}
        onNoteChange={handleNoteChange}
        onSubmitRequest={handleSubmitRequest}
      />

      <CashierRecentTickets tickets={recentTickets} />

      <CashierNote />
    </AppShell>
  );
}

export default function CashierPage() {
  return (
    <Suspense
      fallback={
        <AppShell>
          <div className="rounded-[1.5rem] border border-amber-400/20 bg-black/40 p-5 text-sm font-bold text-amber-100">
            Loading cashier...
          </div>
        </AppShell>
      }
    >
      <CashierPageContent />
    </Suspense>
  );
}