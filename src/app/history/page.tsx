//src>app>history>page.tsx

"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import HistoryFilters from "@/components/history/HistoryFilters";
import HistoryHero from "@/components/history/HistoryHero";
import HistoryRecordList from "@/components/history/HistoryRecordList";
import AppShell from "@/components/layout/AppShell";

type HistoryFilter = "all" | "six-animal" | "thirty-six" | "wallet";

const historyItems = [
  {
    id: "NG-BET-2006",
    type: "six-animal",
    title: "၆ ကောင်ဂျင်",
    detail: "Selected: ကျား • Result: ကျား / ငါး / ကြက်",
    amount: 5000,
    status: "Won",
    payout: 10000,
    time: "Today, 12:45",
  },
  {
    id: "NG-BET-2005",
    type: "thirty-six",
    title: "၃၆ ကောင်ထီ",
    detail: "Selected: #12, #18, #29 • Pending draw",
    amount: 15000,
    status: "Pending",
    payout: 0,
    time: "Today, 11:20",
  },
  {
    id: "NG-WALLET-1003",
    type: "wallet",
    title: "Deposit Request",
    detail: "Wallet settlement request submitted",
    amount: 50000,
    status: "Pending review",
    payout: 0,
    time: "Today, 10:10",
  },
  {
    id: "NG-BET-2004",
    type: "six-animal",
    title: "၆ ကောင်ဂျင်",
    detail: "Selected: နဂါး • Result: ကြက် / ငါး / ဘူး",
    amount: 3000,
    status: "Lost",
    payout: 0,
    time: "Yesterday",
  },
];

export default function HistoryPage() {
  const [activeFilter, setActiveFilter] = useState<HistoryFilter>("all");

  const filteredItems = useMemo(() => {
    if (activeFilter === "all") return historyItems;
    return historyItems.filter((item) => item.type === activeFilter);
  }, [activeFilter]);

  const totalBets = historyItems.filter((item) => item.type !== "wallet").length;
  const totalWins = historyItems.filter((item) => item.status === "Won").length;

  return (
    <AppShell>
      <header className="flex items-center justify-between">
        <Link href="/" className="text-sm font-bold text-amber-300">
          ← Lobby
        </Link>

        <div className="rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-xs font-bold text-amber-100">
          Records
        </div>
      </header>

      <HistoryHero totalBets={totalBets} totalWins={totalWins} />

      <HistoryFilters
        activeFilter={activeFilter}
        onChangeFilter={setActiveFilter}
      />

      <HistoryRecordList items={filteredItems} />
    </AppShell>
  );
}