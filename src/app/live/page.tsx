//src>app>live>page.tsx

"use client";

import Link from "next/link";
import { useState } from "react";

import LiveHero from "@/components/live/LiveHero";
import LiveRecentResults from "@/components/live/LiveRecentResults";
import LiveRecentWinners from "@/components/live/LiveRecentWinners";
import LiveResultNote from "@/components/live/LiveResultNote";
import LiveTabs from "@/components/live/LiveTabs";
import AppShell from "@/components/layout/AppShell";

type LiveTab = "all" | "six-animal" | "thirty-six" | "winners";

const liveResults = [
  {
    id: "SIX-3008",
    type: "six-animal",
    title: "၆ ကောင်ဂျင်",
    result: "ကျား / နဂါး / ငါး",
    label: "Latest Round",
    time: "Just now",
  },
  {
    id: "DRAW-1200",
    type: "thirty-six",
    title: "၃၆ ကောင်ထီ",
    result: "#12",
    label: "Morning Draw",
    time: "12:00",
  },
  {
    id: "SIX-3007",
    type: "six-animal",
    title: "၆ ကောင်ဂျင်",
    result: "ကြက် / ဂဏန်း / ဘူး",
    label: "Previous Round",
    time: "5 min ago",
  },
];

const recentWinners = [
  {
    id: "WIN-9004",
    name: "Member 4821",
    game: "၆ ကောင်ဂျင်",
    amount: 15000,
    time: "Just now",
  },
  {
    id: "WIN-9003",
    name: "Member 1930",
    game: "၃၆ ကောင်ထီ",
    amount: 300000,
    time: "Today",
  },
  {
    id: "WIN-9002",
    name: "Member 7712",
    game: "၆ ကောင်ဂျင်",
    amount: 8000,
    time: "Today",
  },
];

export default function LivePage() {
  const [activeTab, setActiveTab] = useState<LiveTab>("all");

  const visibleResults =
    activeTab === "all"
      ? liveResults
      : liveResults.filter((item) => item.type === activeTab);

  const showResults = activeTab !== "winners";
  const showWinners = activeTab === "all" || activeTab === "winners";

  return (
    <AppShell>
      <header className="flex items-center justify-between">
        <Link href="/" className="text-sm font-bold text-amber-300">
          ← Lobby
        </Link>

        <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-bold text-emerald-200">
          Live
        </div>
      </header>

      <LiveHero todayResults={36} recentWinners={18} />

      <LiveTabs activeTab={activeTab} onChangeTab={setActiveTab} />

      {showResults && <LiveRecentResults results={visibleResults} />}

      {showWinners && <LiveRecentWinners winners={recentWinners} />}

      <LiveResultNote />
    </AppShell>
  );
}