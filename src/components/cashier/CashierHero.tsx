// src/components/cashier/CashierHero.tsx

type CashierHeroProps = {
  balanceLabel: string;
};

export default function CashierHero({ balanceLabel }: CashierHeroProps) {
  return (
    <section className="relative mt-2 overflow-hidden rounded-[1.35rem] border border-[#d6a84f]/38 bg-[linear-gradient(145deg,rgba(62,12,6,0.95),rgba(12,2,1,0.98),rgba(86,17,8,0.92))] px-4 py-3 shadow-[0_14px_34px_rgba(0,0,0,0.58),inset_0_1px_0_rgba(255,215,122,0.16)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_45%_0%,rgba(255,215,122,0.18),transparent_45%)]" />
      <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-[#ffd77a]/70 to-transparent" />

      <div className="relative grid grid-cols-[minmax(0,1fr)_6.6rem] items-center gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-black tracking-[0.16em] text-[#d6a84f]/72">
            ပိုက်ဆံအိတ် လက်ကျန်
          </p>

          <p className="mt-1 whitespace-nowrap text-[2rem] font-black leading-none text-[#ffd77a] drop-shadow-[0_3px_12px_rgba(0,0,0,0.85)]">
            {balanceLabel}
          </p>
        </div>

        <div className="rounded-[1rem] border border-[#d6a84f]/26 bg-[linear-gradient(145deg,rgba(31,9,5,0.82),rgba(0,0,0,0.42))] px-2.5 py-2 text-center shadow-inner shadow-black/70">
          <p className="text-[12px] font-black leading-5 text-[#ffd77a]">
            ငွေသွင်း / ထုတ်
          </p>
          <div className="my-1 h-px bg-[#d6a84f]/18" />
          <p className="text-[9px] font-bold leading-4 text-[#d6a84f]/60">
            လုံခြုံစွာ စစ်ဆေးမည်
          </p>
        </div>
      </div>
    </section>
  );
}