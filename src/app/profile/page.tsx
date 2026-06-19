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

function getAccountLabel(email: string | null | undefined) {
  if (!email) {
    return "ဖုန်းနံပါတ် မရှိသေးပါ";
  }

  if (email.endsWith("@nagani.local")) {
    return email.replace("@nagani.local", "");
  }

  return email;
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
    .select("username, member_code")
    .eq("id", user.id)
    .maybeSingle<{ username: string | null; member_code: string | null }>();

  const { data: wallet } = await supabase
    .from("wallets")
    .select("balance")
    .eq("profile_id", user.id)
    .maybeSingle<{ balance: number | string | null }>();

  const balance = toSafeAmount(wallet?.balance);
  const memberName = profile?.username || "နဂါးနီ မိတ်ဆွေ";
  const accountLabel = getAccountLabel(user.email);
  const memberCode = profile?.member_code || user.id.slice(0, 6).toUpperCase();

  return (
    <AppShell>
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#090202]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(214,168,79,0.24),transparent_34%),linear-gradient(180deg,rgba(44,8,4,0.95),rgba(8,1,1,0.98)_55%,rgba(24,3,2,1))]" />
        <div className="absolute inset-x-[-20%] top-[-10%] h-[44%] rounded-full bg-[#7b1711]/30 blur-3xl" />
        <div className="absolute inset-x-0 bottom-0 h-[42%] bg-[radial-gradient(circle_at_50%_100%,rgba(214,168,79,0.18),transparent_58%)]" />
      </div>

      <div className="relative z-10 px-1 pb-44">
        <header className="flex items-start justify-between pt-1">
          <div>
            <p className="text-xs font-bold tracking-[0.18em] text-[#f7dfaa]/60">
              နဂါးနီ အကောင့်
            </p>
            <h1 className="mt-1 text-2xl font-black text-[#ffd77a] drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
              ပရိုဖိုင်
            </h1>
          </div>

          <div className="rounded-full border border-[#d6a84f]/35 bg-[#2a0805]/80 px-3 py-1.5 text-xs font-black text-[#ffd77a] shadow-lg shadow-black/40">
            အကောင့်
          </div>
        </header>

        <section className="relative mt-5 overflow-hidden rounded-[2rem] border border-[#d6a84f]/35 bg-[linear-gradient(145deg,rgba(58,10,5,0.94),rgba(9,2,2,0.96),rgba(85,17,8,0.9))] p-5 shadow-2xl shadow-black/60">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,215,122,0.18),transparent_36%)]" />
          <div className="pointer-events-none absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-[#ffd77a]/70 to-transparent" />

          <div className="relative flex items-center gap-4">
<div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-[#ffd77a]/50 bg-[radial-gradient(circle_at_50%_30%,#d8a642,#9a5217_52%,#3a0704)] shadow-[0_0_24px_rgba(214,168,79,0.28)]">
  <span className="rounded-full border border-[#3a0704]/30 bg-[#2a0804]/35 px-2.5 py-1 text-[11px] font-black tracking-[0.18em] text-[#fff3d0]">
    ID
  </span>
</div>

            <div className="min-w-0">
              <p className="text-xs font-bold text-[#f7dfaa]/60">
                အကောင့်အမည်
              </p>
              <h2 className="mt-1 truncate text-2xl font-black text-[#fff3d0] drop-shadow-md">
                {memberName}
              </h2>
              <p className="mt-1 text-xs font-bold tracking-[0.18em] text-[#ffd77a]/70">
                ID {memberCode}
              </p>
            </div>
          </div>

          <div className="relative mt-6 rounded-[1.7rem] border border-[#ffd77a]/25 bg-[linear-gradient(180deg,rgba(0,0,0,0.42),rgba(45,7,3,0.58))] p-5 shadow-inner shadow-black/50">
            <p className="text-sm font-bold text-[#f7dfaa]/65">လက်ကျန်ငွေ</p>
            <div className="mt-2 flex items-end gap-2">
              <span className="text-[2.45rem] font-black leading-none text-[#ffd77a] drop-shadow-[0_3px_12px_rgba(0,0,0,0.85)]">
                {formatMMK(balance)}
              </span>
              <span className="pb-1 text-lg font-black text-[#ffd77a]/75">
                ကျပ်
              </span>
            </div>
          </div>
        </section>

        <section className="mt-5 overflow-hidden rounded-[1.75rem] border border-[#d6a84f]/25 bg-[#0b0202]/78 shadow-xl shadow-black/40">
          <div className="border-b border-[#d6a84f]/15 bg-[#d6a84f]/8 px-4 py-3">
            <h2 className="text-sm font-black text-[#ffd77a]">
              အကောင့် မှတ်တမ်း
            </h2>
          </div>

          <div className="divide-y divide-[#d6a84f]/12">
            <div className="flex items-center justify-between gap-4 px-4 py-4">
              <span className="shrink-0 text-sm font-bold text-[#f7dfaa]/55">
                ဖုန်းနံပါတ်
              </span>
              <span className="min-w-0 truncate text-right text-sm font-black text-[#fff3d0]">
                {accountLabel}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4 px-4 py-4">
              <span className="shrink-0 text-sm font-bold text-[#f7dfaa]/55">
                အဖွဲ့ဝင်နံပါတ်
              </span>
              <span className="rounded-full border border-[#d6a84f]/25 bg-black/35 px-3 py-1 text-sm font-black tracking-[0.12em] text-[#ffd77a]">
                {memberCode}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4 px-4 py-4">
              <span className="shrink-0 text-sm font-bold text-[#f7dfaa]/55">
                အခြေအနေ
              </span>
              <span className="rounded-full border border-emerald-300/25 bg-emerald-400/10 px-3 py-1 text-xs font-black text-emerald-100">
                အသုံးပြုနိုင်သည်
              </span>
            </div>
          </div>
        </section>

        <section className="mt-5 rounded-[1.75rem] border border-[#d6a84f]/22 bg-[linear-gradient(180deg,rgba(52,8,4,0.78),rgba(9,1,1,0.88))] p-4 shadow-xl shadow-black/40">
          <h2 className="text-base font-black text-[#ffd77a]">
            အကောင့် လုပ်ဆောင်ချက်များ
          </h2>

          <div className="mt-4 grid gap-3">
            <Link
              href="/cashier"
              className="flex min-h-14 items-center justify-between rounded-2xl border border-[#ffd77a]/45 bg-[linear-gradient(180deg,#f5cd72,#b97a22_62%,#6b3a0d)] px-5 py-3 text-sm font-black text-[#1b0702] shadow-[0_8px_20px_rgba(0,0,0,0.38)] active:scale-[0.99]"
            >
              <span>ပိုက်ဆံအိတ်သို့</span>
              <span className="text-lg leading-none">›</span>
            </Link>

<Link
  href="/support"
  className="flex min-h-14 items-center justify-between rounded-2xl border border-[#ffd77a]/45 bg-[linear-gradient(180deg,#f5cd72,#b97a22_62%,#6b3a0d)] px-5 py-3 text-sm font-black text-[#1b0702] shadow-[0_8px_20px_rgba(0,0,0,0.38)] active:scale-[0.99]"
>
  <span>အကူအညီ</span>
  <span className="text-lg leading-none">›</span>
</Link>

<form action={logout}>
  <button
    type="submit"
    className="flex min-h-13 w-full items-center justify-center rounded-2xl border border-red-300/25 bg-[linear-gradient(180deg,rgba(103,16,13,0.86),rgba(44,4,4,0.94))] px-5 py-3 text-sm font-black text-red-100 shadow-lg shadow-black/35 active:scale-[0.98]"
  >
    အကောင့်ထွက်မည်
  </button>
</form>
          </div>
        </section>


      </div>
    </AppShell>
  );
}