// src/app/profile/page.tsx

import Link from "next/link";
import { redirect } from "next/navigation";

import AppShell from "@/components/layout/AppShell";
import { logout } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";

function toSafeAmount(value: number | string | null | undefined) {
  const amount = Number(value ?? 0);

  return Number.isFinite(amount) ? amount : 0;
}

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

  const balance = toSafeAmount(wallet?.balance);
  const memberName = profile?.username || "နဂါးနီ မိတ်ဆွေ";
  const accountLabel = user.email || "ဖုန်းနံပါတ် မရှိသေးပါ";

  return (
    <AppShell>
      <header className="flex items-center justify-between">
        <Link href="/" className="text-sm font-bold text-[#ffd77a]">
          မူလသို့
        </Link>

        <div className="rounded-full border border-[#d6a84f]/20 bg-[#d6a84f]/10 px-3 py-1 text-xs font-bold text-[#ffd77a]">
          ပရိုဖိုင်
        </div>
      </header>

      <section className="mt-6 overflow-hidden rounded-[2rem] border border-[#d6a84f]/25 bg-[#090202]/58 p-5 shadow-2xl shadow-black/45 backdrop-blur-md">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-[#f7dfaa]/60">
              အကောင့်အချက်အလက်
            </p>
            <h1 className="mt-2 text-3xl font-black text-[#ffd77a]">
              {memberName}
            </h1>
          </div>

          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-[#ffd77a]/35 bg-gradient-to-b from-[#b21b16] via-[#7f1111] to-[#3a0707] text-xl font-black text-[#ffd77a] shadow-lg shadow-black/40">
            န
          </div>
        </div>

        <div className="mt-5 rounded-[1.5rem] border border-[#d6a84f]/18 bg-black/25 p-4">
          <p className="text-xs font-semibold text-[#f7dfaa]/60">
            လက်ကျန်ငွေ
          </p>
          <p className="mt-1 text-3xl font-black text-[#ffd77a]">
            {formatMMK(balance)} ကျပ်
          </p>
        </div>

        <div className="mt-5 divide-y divide-[#d6a84f]/10 rounded-[1.5rem] border border-[#d6a84f]/15 bg-black/20">
          <div className="flex items-center justify-between gap-3 px-4 py-3">
            <span className="text-sm text-[#f7dfaa]/60">အကောင့်</span>
            <span className="min-w-0 truncate text-right text-sm font-bold text-[#fff3d0]">
              {accountLabel}
            </span>
          </div>

          <div className="flex items-center justify-between gap-3 px-4 py-3">
            <span className="text-sm text-[#f7dfaa]/60">အဖွဲ့ဝင်နံပါတ်</span>
            <span className="text-sm font-bold text-[#ffd77a]">
              {formatMemberId(user.id)}
            </span>
          </div>

          <div className="flex items-center justify-between gap-3 px-4 py-3">
            <span className="text-sm text-[#f7dfaa]/60">အခြေအနေ</span>
            <span className="rounded-full border border-emerald-300/25 bg-emerald-400/10 px-3 py-1 text-xs font-bold text-emerald-100">
              အသုံးပြုနိုင်သည်
            </span>
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-[2rem] border border-[#d6a84f]/20 bg-black/25 p-4">
        <h2 className="text-lg font-black text-[#ffd77a]">လုပ်ဆောင်ချက်များ</h2>

        <div className="mt-4 grid gap-3">
          <Link
            href="/cashier"
            className="flex min-h-12 items-center justify-between rounded-2xl border border-[#d6a84f]/18 bg-[#d6a84f]/10 px-4 py-3 text-sm font-bold text-[#fff3d0] active:scale-[0.99]"
          >
            <span>ပိုက်ဆံအိတ်သို့</span>
            <span className="text-[#ffd77a]">›</span>
          </Link>

          <Link
            href="/profile"
            className="flex min-h-12 items-center justify-between rounded-2xl border border-[#d6a84f]/18 bg-black/20 px-4 py-3 text-sm font-bold text-[#fff3d0] active:scale-[0.99]"
          >
            <span>စကားဝှက်ပြောင်းရန်</span>
            <span className="text-[#f7dfaa]/50">မကြာမီ</span>
          </Link>

          <Link
            href="/profile"
            className="flex min-h-12 items-center justify-between rounded-2xl border border-[#d6a84f]/18 bg-black/20 px-4 py-3 text-sm font-bold text-[#fff3d0] active:scale-[0.99]"
          >
            <span>ကူညီရေး ဆက်သွယ်ရန်</span>
            <span className="text-[#f7dfaa]/50">ကူညီရေး</span>
          </Link>
        </div>
      </section>

      <form action={logout}>
        <button
          type="submit"
          className="mt-6 min-h-12 w-full rounded-full border border-red-300/25 bg-red-500/10 px-5 py-4 text-sm font-black text-red-100 active:scale-[0.98]"
        >
          ထွက်မည်
        </button>
      </form>
    </AppShell>
  );
}