// src/components/cashier/CashierHero.tsx

import Link from "next/link";

type CashierHeroProps = {
  balanceLabel: string;
  historyHref?: string;
};

export default function CashierHero({
  balanceLabel,
  historyHref = "/cashier/history",
}: CashierHeroProps) {
  return (
    <section className="relative mt-1 overflow-hidden rounded-[1.45rem] border border-[#d6a84f]/42 bg-[linear-gradient(145deg,rgba(72,13,6,0.98),rgba(13,2,1,0.99),rgba(92,18,8,0.94))] px-5 py-4 shadow-[0_18px_42px_rgba(0,0,0,0.68),inset_0_1px_0_rgba(255,215,122,0.18)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,215,122,0.2),transparent_43%)]" />
      <div className="pointer-events-none absolute inset-x-7 top-0 h-px bg-gradient-to-r from-transparent via-[#ffd77a]/78 to-transparent" />
      <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#ffd77a]/10 blur-3xl" />

      <div className="relative">
        <div className="flex items-center justify-between gap-3">
          <p className="text-[10px] font-black tracking-[0.18em] text-[#d6a84f]/78">
            ပိုက်ဆံအိတ်
          </p>

          <Link
            href={historyHref}
            className="shrink-0 rounded-full border border-[#d6a84f]/34 bg-[linear-gradient(145deg,rgba(34,8,4,0.84),rgba(0,0,0,0.38))] px-3 py-1 text-[10px] font-black text-[#ffd77a] shadow-inner shadow-black/45 active:scale-[0.98]"
          >
            မှတ်တမ်း
          </Link>
        </div>

        <p className="mt-2 whitespace-nowrap text-[2.4rem] font-black leading-none text-[#ffd77a] drop-shadow-[0_5px_16px_rgba(0,0,0,0.9)]">
          {balanceLabel}
        </p>

        <div className="mt-3 h-px w-full bg-gradient-to-r from-transparent via-[#d6a84f]/24 to-transparent" />

        <p className="mt-2 text-[10px] font-bold leading-4 text-[#f7dfaa]/56">
          ချက်ချင်း ငွေသွင်း/ငွေထုတ် မြန်ဆန်ရန် note(မုန့်ဝယ်/shopping) ဟုရေးပါ။
        </p>
      </div>
    </section>
  );
}