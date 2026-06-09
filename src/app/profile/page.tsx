//src>app>profile>page.tsx

"use client";

import Link from "next/link";

import ProfileAccountStatus from "@/components/profile/ProfileAccountStatus";
import ProfileMemberCard from "@/components/profile/ProfileMemberCard";
import ProfileQuickActions from "@/components/profile/ProfileQuickActions";
import ProfileStatsGrid from "@/components/profile/ProfileStatsGrid";
import ProfileSupportSecurity from "@/components/profile/ProfileSupportSecurity";
import AppShell from "@/components/layout/AppShell";
import { logout } from "@/lib/supabase/auth";

const memberStats = [
  {
    label: "Total Bets",
    value: "24",
  },
  {
    label: "Wins",
    value: "8",
  },
  {
    label: "Wallet Tickets",
    value: "3",
  },
  {
    label: "Member Level",
    value: "Bronze",
  },
];

function formatMMK(amount: number) {
  return new Intl.NumberFormat("en-US").format(amount);
}

export default function ProfilePage() {
  return (
    <AppShell>
      <header className="flex items-center justify-between">
        <Link href="/" className="text-sm font-bold text-amber-300">
          ← Lobby
        </Link>

        <div className="rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-xs font-bold text-amber-100">
          Member
        </div>
      </header>

      <ProfileMemberCard
        memberName="Member 4821"
        memberId="NG-4821"
        balanceLabel={`${formatMMK(0)} MMK`}
      />

      <ProfileStatsGrid stats={memberStats} />

      <ProfileAccountStatus />

      <ProfileQuickActions />

      <ProfileSupportSecurity />

<form action={logout}>
  <button
    type="submit"
    className="mt-6 w-full rounded-full border border-red-400/20 bg-red-400/10 px-5 py-4 text-sm font-black text-red-100"
  >
    Logout
  </button>
</form>
    </AppShell>
  );
}