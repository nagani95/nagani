// src/app/profile/page.tsx

import Link from "next/link";
import { redirect } from "next/navigation";

import AppShell from "@/components/layout/AppShell";
import { logout } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";

const TEMP_PALACE_BACKGROUND =
  "/assets/nagani/six-animal/room/six-animal-palace-room-bg-v1.jpg";

function toSafeAmount(value: number | string | null | undefined) {
  const amount = Number(value ?? 0);

  return Number.isFinite(amount) ? amount : 0;
}

function formatMMK(amount: number) {
  return new Intl.NumberFormat("en-US").format(amount);
}

function getAccountLabel(email: string | null | undefined) {
  if (!email) return "ဖုန်းနံပါတ် မရှိသေးပါ";

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
    redirect("/login?next=/profile");
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
  const memberName = profile?.username || "နဂါးနီရွှေအိုး";
  const accountLabel = getAccountLabel(user.email);
  const memberCode = profile?.member_code || user.id.slice(0, 6).toUpperCase();

  return (
    <AppShell>
      <div className="pointer-events-none fixed inset-0 z-0 mx-auto w-full max-w-md overflow-hidden bg-[#080101]">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${TEMP_PALACE_BACKGROUND})` }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.64)_0%,rgba(0,0,0,0.3)_36%,rgba(0,0,0,0.88)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_7%,rgba(255,215,122,0.12),transparent_31%),radial-gradient(circle_at_50%_100%,rgba(86,13,6,0.72),transparent_50%)]" />
      </div>

      <div className="fixed inset-0 z-10 mx-auto flex h-[100svh] w-full max-w-md flex-col overflow-y-auto overflow-x-hidden overscroll-none px-5 pb-[calc(env(safe-area-inset-bottom)+5.75rem)] pt-[calc(env(safe-area-inset-top)+0.75rem)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <header className="flex h-8 shrink-0 items-center justify-between">
          <Link href="/" className="text-sm font-bold text-[#ffd77a]">
            မူလသို့
          </Link>

          <div className="rounded-full border border-[#d6a84f]/32 bg-[linear-gradient(145deg,rgba(42,12,7,0.8),rgba(0,0,0,0.38))] px-3 py-1.5 text-xs font-black text-[#ffd77a] shadow-lg shadow-black/40">
            အကောင့်
          </div>
        </header>

        <section className="relative mt-2 shrink-0 overflow-hidden rounded-[1.45rem] border border-[#d6a84f]/38 bg-[linear-gradient(145deg,rgba(58,10,5,0.96),rgba(8,1,1,0.99),rgba(70,13,6,0.94))] p-4 shadow-[0_22px_65px_rgba(0,0,0,0.78),inset_0_1px_0_rgba(255,215,122,0.16)]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,215,122,0.15),transparent_38%)]" />
          <div className="pointer-events-none absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-[#ffd77a]/65 to-transparent" />

          <div className="relative flex items-center gap-3">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-[#ffd77a]/55 bg-[radial-gradient(circle_at_50%_30%,#d8a642,#9a5217_52%,#3a0704)] shadow-[0_0_24px_rgba(214,168,79,0.32)]">
              <span className="rounded-full border border-[#3a0704]/30 bg-[#2a0804]/50 px-2 py-1 text-[10px] font-black tracking-[0.16em] text-[#fff3d0]">
                ID
              </span>
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-black tracking-[0.16em] text-[#d6a84f]/68">
                အကောင့်အမည်
              </p>
              <h1 className="mt-1 truncate text-2xl font-black leading-tight text-[#fff3d0] drop-shadow-md">
                {memberName}
              </h1>
              <p className="mt-0.5 text-xs font-black tracking-[0.16em] text-[#ffd77a]/84">
                ID {memberCode}
              </p>
            </div>
          </div>

          <div className="relative mt-4 min-h-[6.15rem] shrink-0 rounded-[1.05rem] border border-[#ffd77a]/24 bg-[linear-gradient(180deg,rgba(0,0,0,0.5),rgba(45,7,3,0.62))] px-4 py-3 shadow-inner shadow-black/60">
            <p className="text-xs font-bold text-[#f7dfaa]/62">လက်ကျန်ငွေ</p>
            <div className="mt-1 flex items-end gap-2">
              <span className="text-[2.15rem] font-black leading-none text-[#ffd77a] drop-shadow-[0_3px_12px_rgba(0,0,0,0.9)]">
                {formatMMK(balance)}
              </span>
              <span className="pb-1 text-base font-black text-[#ffd77a]/78">
                ကျပ်
              </span>
            </div>
          </div>
        </section>

        <section className="mt-3 shrink-0 overflow-hidden rounded-[1.3rem] border border-[#d6a84f]/34 bg-[linear-gradient(180deg,rgba(16,3,2,0.94),rgba(40,8,4,0.94))] shadow-xl shadow-black/55">
          <div className="border-b border-[#d6a84f]/14 px-4 py-3">
            <h2 className="text-sm font-black text-[#ffd77a]">
              အကောင့် မှတ်တမ်း
            </h2>
          </div>

          <div className="divide-y divide-[#d6a84f]/12">
            <div className="flex items-center justify-between gap-4 px-4 py-3">
              <span className="shrink-0 text-sm font-bold text-[#f7dfaa]/58">
                ဖုန်းနံပါတ်
              </span>
              <span className="min-w-0 truncate text-right text-sm font-black text-[#fff3d0]">
                {accountLabel}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4 px-4 py-3">
              <span className="shrink-0 text-sm font-bold text-[#f7dfaa]/58">
                အဖွဲ့ဝင်နံပါတ်
              </span>
              <span className="rounded-[0.65rem] border border-[#d6a84f]/30 bg-black/38 px-3 py-1 text-sm font-black tracking-[0.12em] text-[#ffd77a] shadow-inner shadow-black/35">
                {memberCode}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4 px-4 py-3">
              <span className="shrink-0 text-sm font-bold text-[#f7dfaa]/58">
                အခြေအနေ
              </span>
              <span className="rounded-[0.65rem] border border-[#d6a84f]/30 bg-[#d6a84f]/10 px-3 py-1 text-xs font-black text-[#ffd77a] shadow-inner shadow-black/30">
                အသုံးပြုနိုင်သည်
              </span>
            </div>
          </div>
        </section>

        <section className="mt-3 shrink-0 rounded-[1.3rem] border border-[#d6a84f]/34 bg-[linear-gradient(180deg,rgba(54,9,5,0.96),rgba(10,1,1,0.98))] p-3 shadow-xl shadow-black/55">
          <h2 className="px-1 text-sm font-black text-[#ffd77a]">
            အကောင့် လုပ်ဆောင်ချက်များ
          </h2>

          <div className="mt-3 grid gap-2">
            <Link
              href="/cashier"
              className="flex h-12 items-center justify-between rounded-[0.9rem] border border-[#ffd77a]/42 bg-[linear-gradient(180deg,#f5cd72,#b97a22_60%,#6b3a0d)] px-4 text-sm font-black text-[#1b0702] shadow-[0_6px_16px_rgba(0,0,0,0.35),inset_0_1px_1px_rgba(255,255,255,0.4)] active:scale-[0.99]"
            >
              <span>ပိုက်ဆံအိတ်သို့</span>
              <span className="text-lg leading-none">›</span>
            </Link>

            <Link
              href="/support"
              className="flex h-12 items-center justify-between rounded-[0.9rem] border border-[#ffd77a]/42 bg-[linear-gradient(180deg,#f5cd72,#b97a22_60%,#6b3a0d)] px-4 text-sm font-black text-[#1b0702] shadow-[0_6px_16px_rgba(0,0,0,0.35),inset_0_1px_1px_rgba(255,255,255,0.4)] active:scale-[0.99]"
            >
              <span>အကူအညီ</span>
              <span className="text-lg leading-none">›</span>
            </Link>

            <form action={logout}>
              <button
                type="submit"
                className="flex h-11 w-full items-center justify-center rounded-[0.9rem] border border-[#ffd77a]/28 bg-[linear-gradient(180deg,#9b111e,#6f0d12_54%,#3b0406)] px-5 text-sm font-black text-[#ffe6a3] shadow-[0_8px_18px_rgba(74,10,10,0.42),inset_0_1px_2px_rgba(255,215,122,0.32)] active:scale-[0.98]"
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