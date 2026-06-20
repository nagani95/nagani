// src/components/cashier/CashierHero.tsx

type CashierHeroProps = {
  balanceLabel: string;
};

export default function CashierHero({ balanceLabel }: CashierHeroProps) {
  return (
    <section className="relative mt-2 overflow-hidden rounded-[1.25rem] border border-[#d6a84f]/35 bg-[linear-gradient(145deg,rgba(50,9,5,0.94),rgba(8,1,1,0.98),rgba(74,13,6,0.92))] px-4 py-3 shadow-xl shadow-black/55">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,215,122,0.16),transparent_40%)]" />
      <div className="pointer-events-none absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-[#ffd77a]/65 to-transparent" />

      <div className="relative flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-black tracking-[0.18em] text-[#d6a84f]/70">
            ပိုက်ဆံအိတ် လက်ကျန်
          </p>
          <p className="mt-1 truncate text-[1.75rem] font-black leading-none text-[#ffd77a] drop-shadow-[0_3px_12px_rgba(0,0,0,0.85)]">
            {balanceLabel}
          </p>
        </div>

        <div className="shrink-0 rounded-[1rem] border border-[#d6a84f]/28 bg-[linear-gradient(145deg,rgba(36,10,6,0.75),rgba(0,0,0,0.38))] px-3 py-2 text-right shadow-inner shadow-black/70">
          <p className="text-[11px] font-black text-[#ffd77a]">
            ငွေသွင်း / ထုတ်
          </p>
          <div className="my-1 h-px bg-[#d6a84f]/18" />
          <p className="text-[9px] font-bold text-[#d6a84f]/60">
            လုံခြုံစွာ စစ်ဆေးပေးမည်
          </p>
        </div>
      </div>
    </section>
  );
}