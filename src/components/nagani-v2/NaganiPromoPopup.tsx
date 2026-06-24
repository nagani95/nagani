//src/components/nagani-v2/NaganiPromoPopup.tsx

"use client";

import { useEffect, useState, useTransition } from "react";

const GUEST_PROMO_SEEN_KEY = "nagani_promo_welcome_recharge_seen_v1";

type NaganiPromoPopupProps = {
  isLoggedIn: boolean;
  showForLoggedInUser: boolean;
  markSeenAction: () => Promise<void>;
};

export default function NaganiPromoPopup({
  isLoggedIn,
  showForLoggedInUser,
  markSeenAction,
}: NaganiPromoPopupProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (isLoggedIn) {
      setOpen(showForLoggedInUser);
      return;
    }

    setOpen(localStorage.getItem(GUEST_PROMO_SEEN_KEY) !== "1");
  }, [isLoggedIn, showForLoggedInUser]);

  function handleOk() {
    if (!isLoggedIn) {
      localStorage.setItem(GUEST_PROMO_SEEN_KEY, "1");
      setOpen(false);
      return;
    }

    startTransition(() => {
      void (async () => {
        await markSeenAction();
        setOpen(false);
      })();
    });
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/76 px-4">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,rgba(255,215,122,0.18)_0%,rgba(80,12,8,0.18)_34%,transparent_68%)]" />

      <div className="relative w-full max-w-[23rem] rounded-[2.1rem] border border-[#f6d27a]/70 bg-gradient-to-b from-[#8b1710] via-[#3b0505] to-[#120101] p-[0.42rem] shadow-[0_28px_90px_rgba(0,0,0,0.86),0_0_36px_rgba(255,215,122,0.18)]">
        <div className="pointer-events-none absolute -top-5 left-1/2 h-10 w-28 -translate-x-1/2 rounded-t-full border border-[#ffd77a]/70 bg-gradient-to-b from-[#ffe09a] via-[#b87920] to-[#5a2507] shadow-[0_8px_20px_rgba(0,0,0,0.48)]" />

        <div className="pointer-events-none absolute -top-3 left-1/2 h-7 w-7 -translate-x-1/2 rotate-45 border border-[#fff0b8]/70 bg-gradient-to-br from-[#fff0b8] via-[#d89d2d] to-[#6a2809] shadow-[0_0_18px_rgba(255,215,122,0.42)]" />

        <div className="relative overflow-hidden rounded-[1.75rem] border border-[#ffd77a]/80 bg-[#210303] p-2">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,215,122,0.18)_0%,transparent_42%),linear-gradient(90deg,rgba(255,215,122,0.08),transparent_18%,transparent_82%,rgba(255,215,122,0.08))]" />

          <div className="relative rounded-[1.35rem] border border-[#8f5b1d]/55 bg-gradient-to-b from-[#fff0c6] via-[#f6dfa8] to-[#e8c982] px-5 pb-5 pt-4 text-center shadow-[inset_0_0_34px_rgba(94,39,8,0.34)]">
            <div className="mx-auto mb-3 flex w-fit items-center gap-2 rounded-full border border-[#b8892f]/45 bg-[#7b120b]/95 px-5 py-2 shadow-[0_10px_20px_rgba(0,0,0,0.28)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#ffd77a]" />
              <p className="text-lg font-black tracking-[0.02em] text-[#ffe6a3] drop-shadow-[0_2px_4px_rgba(0,0,0,0.7)]">
                အထူးပရိုမိုးရှင်း
              </p>
              <span className="h-1.5 w-1.5 rounded-full bg-[#ffd77a]" />
            </div>

            <div className="space-y-3.5 text-[#54120b]">
              <div className="rounded-2xl border border-[#c99b45]/45 bg-[#fff7dc]/52 px-3 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.55)]">
                <p className="text-sm font-black">အသစ်ဝင်သူတိုင်း</p>
                <p className="mt-1 text-[2rem] font-black leading-none text-[#b31313] drop-shadow-[0_2px_0_rgba(255,241,188,0.95)]">
                  2,000 ကျပ်
                </p>
                <p className="mt-1 text-sm font-bold">လက်ဆောင် ရရှိမည်</p>
              </div>

              <div className="relative py-0.5">
                <div className="mx-auto h-px w-[86%] bg-gradient-to-r from-transparent via-[#ad751d]/75 to-transparent" />
                <div className="absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-[#b8892f]" />
              </div>

              <div className="rounded-2xl border border-[#c99b45]/45 bg-[#fff7dc]/52 px-3 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.55)]">
                <p className="text-sm font-black">ပထမဆုံး ငွေဖြည့်</p>
                <p className="mt-1 text-[0.94rem] font-black leading-6">
                  10,000 ကျပ်မှ 50,000 ကျပ်အထိ
                </p>
                <p className="mt-1 text-[2.15rem] font-black leading-none text-[#b31313] drop-shadow-[0_2px_0_rgba(255,241,188,0.95)]">
                  20% အပိုဆု
                </p>
              </div>

              <div className="relative py-0.5">
                <div className="mx-auto h-px w-[86%] bg-gradient-to-r from-transparent via-[#ad751d]/75 to-transparent" />
                <div className="absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-[#b8892f]" />
              </div>

              <p className="rounded-2xl border border-[#c99b45]/40 bg-[#7b120b]/8 px-3 py-3 text-sm font-black leading-6">
                တစ်ဦးလျှင် တစ်ကြိမ်သာ ရရှိမည်
              </p>
            </div>

            <p className="mt-4 text-[0.72rem] font-bold leading-5 text-[#704017]">
              ပရိုမိုးရှင်းအကြောင်းအရာကို သိရှိပြီးဖြစ်ပါသည်
            </p>

            <button
              type="button"
              onClick={handleOk}
              disabled={isPending}
              className="mt-3 w-full rounded-full border border-[#ffd77a]/90 bg-gradient-to-b from-[#ef4a36] via-[#a51616] to-[#500707] px-8 py-3 text-lg font-black text-[#fff3d0] shadow-[0_14px_26px_rgba(0,0,0,0.48),0_0_18px_rgba(255,215,122,0.28),inset_0_1px_0_rgba(255,243,208,0.42),inset_0_-8px_14px_rgba(0,0,0,0.26)] transition active:scale-[0.98] disabled:opacity-70"
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}