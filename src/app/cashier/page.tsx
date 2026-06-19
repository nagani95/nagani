// src/app/cashier/page.tsx

"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";

import CashierHero from "@/components/cashier/CashierHero";
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

function toSafeAmount(value: number | string | null | undefined) {
  const amount = Number(value ?? 0);

  return Number.isFinite(amount) ? amount : 0;
}

function formatMMK(amount: number) {
  return new Intl.NumberFormat("en-US").format(amount);
}

function formatTicketTime(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Yangon",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function formatRequestType(type: WalletRequestRow["request_type"]) {
  return type === "deposit" ? "ငွေသွင်း" : "ငွေထုတ်";
}

function formatRequestStatus(status: WalletRequestRow["status"]) {
  return status;
}

function CashierPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const successMessage = searchParams.get("message");
  const errorMessage = searchParams.get("error");

  const [supabase] = useState(() => createClient());
  const [walletBalance, setWalletBalance] = useState(0);
  const [recentTickets, setRecentTickets] = useState<CashierTicket[]>([]);

  const [activeTab, setActiveTab] = useState<CashierTab>("deposit");
  const [amount, setAmount] = useState("10000");
  const [note, setNote] = useState("");

  const numericAmount = toSafeAmount(amount);
  const isValidAmount = numericAmount >= 1000;

  const actionLabel = useMemo(() => {
    return activeTab === "deposit" ? "ငွေသွင်း တင်မည်" : "ငွေထုတ် တင်မည်";
  }, [activeTab]);

  useEffect(() => {
    let isMounted = true;

    async function fetchCashierData() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/login");
        return;
      }

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

      setWalletBalance(toSafeAmount(wallet?.balance));

      setRecentTickets(
        (requests ?? []).map((request) => ({
          id: `NG-WALLET-${request.id.slice(0, 8).toUpperCase()}`,
          type: formatRequestType(request.request_type),
          amount: toSafeAmount(request.amount),
          status: formatRequestStatus(request.status),
          time: formatTicketTime(request.created_at),
        }))
      );
    }

    void fetchCashierData();

    return () => {
      isMounted = false;
    };
  }, [router, supabase, successMessage]);

  function handleTabChange(tab: CashierTab) {
    setActiveTab(tab);
  }

  function handleAmountChange(value: string) {
    setAmount(value);
  }

  function handleNoteChange(value: string) {
    setNote(value);
  }

  async function handleSubmitRequest() {
    if (!isValidAmount) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.replace("/login");
      return;
    }

    const { error } = await supabase.from("wallet_requests").insert({
      profile_id: user.id,
      request_type: activeTab,
      amount: numericAmount,
      note: note || null,
      status: "pending",
    });

    if (error) {
      console.error("Wallet request submit error:", error.message);
      router.replace("/cashier?error=1");
      return;
    }

    setAmount("10000");
    setNote("");
    router.replace("/cashier?message=1");
  }

  return (
    <AppShell>
      <header className="flex items-center justify-between">
        <Link href="/" className="text-sm font-bold text-[#ffd77a]">
          မူလသို့
        </Link>

        <div className="rounded-full border border-[#d6a84f]/20 bg-[#d6a84f]/10 px-3 py-1 text-xs font-bold text-[#ffd77a]">
          ပိုက်ဆံအိတ်
        </div>
      </header>

      <CashierHero balanceLabel={`${formatMMK(walletBalance)} ကျပ်`} />

      {successMessage ? (
        <div className="mt-4 rounded-[1.25rem] border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm font-bold text-emerald-100">
          တင်သွင်းမှု အောင်မြင်ပါသည်။
        </div>
      ) : null}

      {errorMessage ? (
        <div className="mt-4 rounded-[1.25rem] border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm font-bold text-red-100">
          တင်သွင်းမှု မအောင်မြင်ပါ။ ပြန်စစ်ပါ။
        </div>
      ) : null}

      <CashierRequestForm
        activeTab={activeTab}
        amount={amount}
        note={note}
        amountLabel={formatMMK(numericAmount)}
        actionLabel={actionLabel}
        isValidAmount={isValidAmount}
        onTabChange={handleTabChange}
        onAmountChange={handleAmountChange}
        onNoteChange={handleNoteChange}
        onSubmitRequest={handleSubmitRequest}
      />

      <CashierRecentTickets tickets={recentTickets} />
    </AppShell>
  );
}

export default function CashierPage() {
  return (
    <Suspense
      fallback={
        <AppShell>
          <div className="rounded-[1.5rem] border border-[#d6a84f]/20 bg-black/40 p-5 text-sm font-bold text-[#fff3d0]">
            ပိုက်ဆံအိတ် ပြင်ဆင်နေပါသည်
          </div>
        </AppShell>
      }
    >
      <CashierPageContent />
    </Suspense>
  );
}