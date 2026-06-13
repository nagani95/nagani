// src/app/profile/page.tsx

import Link from "next/link";
import { redirect } from "next/navigation";

import AppShell from "@/components/layout/AppShell";
import ProfileAccountStatus from "@/components/profile/ProfileAccountStatus";
import ProfileMemberCard from "@/components/profile/ProfileMemberCard";
import ProfileQuickActions from "@/components/profile/ProfileQuickActions";
import ProfileSupportSecurity from "@/components/profile/ProfileSupportSecurity";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/lib/supabase/auth";

function formatMMK(amount: number) {
  return new Intl.NumberFormat("en-US").format(amount);
}

function formatMemberId(userId: string) {
  return `NG-${userId.slice(0, 8).toUpperCase()}`;
}

export default async function ProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", user.id)
    .maybeSingle<{ username: string | null }>();

  const { data: wallet } = await supabase
    .from("wallets")
    .select("balance")
    .eq("profile_id", user.id)
    .maybeSingle<{ balance: number | string | null }>();

  const balance = Number(wallet?.balance ?? 0);

  const memberName = profile?.username || user.email || "Nagani Member";

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
        memberName={memberName}
        memberId={formatMemberId(user.id)}
        balanceLabel={`${formatMMK(balance)} MMK`}
      />

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