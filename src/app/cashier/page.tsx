//src>app>cashier>page.tsx

"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import CashierHero from "@/components/cashier/CashierHero";
import CashierNote from "@/components/cashier/CashierNote";
import CashierRecentTickets from "@/components/cashier/CashierRecentTickets";
import CashierRequestForm from "@/components/cashier/CashierRequestForm";
import AppShell from "@/components/layout/AppShell";

type CashierTab = "deposit" | "withdraw";

const recentTickets = [
  {
    id: "NG-WALLET-1003",
    type: "Deposit",
    amount: 50000,
    status: "Pending review",
    time: "Today",
  },
  {
    id: "NG-WALLET-1002",
    type: "Withdraw",
    amount: 30000,
    status: "Confirmed",
    time: "Yesterday",
  },
  {
    id: "NG-WALLET-1001",
    type: "Deposit",
    amount: 100000,
    status: "Confirmed",
    time: "2 days ago",
  },
];

function formatMMK(amount: number) {
  return new Intl.NumberFormat("en-US").format(amount);
}

export default function CashierPage() {
  const [activeTab, setActiveTab] = useState<CashierTab>("deposit");
  const [amount, setAmount] = useState("10000");
  const [note, setNote] = useState("");
  const [mockRequestMessage, setMockRequestMessage] = useState<string | null>(
    null
  );

  const numericAmount = Number(amount || 0);
  const isValidAmount = numericAmount >= 1000;

  const actionLabel = useMemo(() => {
    return activeTab === "deposit"
      ? "Submit Deposit Request"
      : "Submit Withdraw Request";
  }, [activeTab]);

  function handleTabChange(tab: CashierTab) {
    setActiveTab(tab);
    setMockRequestMessage(null);
  }

  function handleAmountChange(value: string) {
    setAmount(value);
    setMockRequestMessage(null);
  }

  function handleNoteChange(value: string) {
    setNote(value);
    setMockRequestMessage(null);
  }

  function handleSubmitRequest() {
    if (!isValidAmount) return;

    const requestType = activeTab === "deposit" ? "Deposit" : "Withdraw";

    setMockRequestMessage(
      `${requestType} request prepared • ${formatMMK(numericAmount)} MMK`
    );
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

      <CashierHero balanceLabel="0 MMK" />

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

      {mockRequestMessage && (
        <div className="mt-4 rounded-[1.25rem] border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm font-bold text-emerald-100">
          {mockRequestMessage}
        </div>
      )}

      <CashierRecentTickets tickets={recentTickets} />

      <CashierNote />
    </AppShell>
  );
}