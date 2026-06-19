// src/components/cashier/CashierHero.tsx

type CashierHeroProps = {
  balanceLabel: string;
};

export default function CashierHero({ balanceLabel }: CashierHeroProps) {
  return (
    <section className="relative mt-4 overflow-hidden rounded-[2rem] border border-[#d6a84f]/35 bg-[linear-gradient(145deg,rgba(58,10,5,0.94),rgba(9,2,2,0.96),rgba(85,17,8,0.9))] p-5 shadow-2xl shadow-black/60">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,215,122,0.18),transparent_36%)]" />
      <div className="pointer-events-none absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-[#ffd77a]/70 to-transparent" />

      <div className="relative">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-black tracking-[0.14em] text-[#f7dfaa]/60">
              ပိုက်ဆံအိတ်
            </p>
            <h1 className="mt-2 text-[1.8rem] font-black leading-tight text-[#ffd77a] drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
              ငွေသွင်း / ငွေထုတ်
            </h1>
          </div>

          <div className="rounded-full border border-[#d6a84f]/35 bg-[#2a0805]/80 px-3 py-1.5 text-xs font-black text-[#ffd77a] shadow-lg shadow-black/40">
            လုံခြုံသည်
          </div>
        </div>

<p className="mt-3 text-xs font-semibold leading-6 text-[#fff3d0]/58">
  ငွေသွင်း၊ ငွေထုတ် တောင်းဆိုမှုများကို စစ်ဆေးပေးပါမည်။
</p>

        <div className="mt-5 rounded-[1.7rem] border border-[#ffd77a]/25 bg-[linear-gradient(180deg,rgba(0,0,0,0.42),rgba(45,7,3,0.58))] p-5 shadow-inner shadow-black/50">
          <p className="text-sm font-bold text-[#f7dfaa]/65">လက်ကျန်ငွေ</p>
          <p className="mt-2 text-[2rem] font-black leading-none text-[#ffd77a] drop-shadow-[0_3px_12px_rgba(0,0,0,0.85)]">
            {balanceLabel}
          </p>
        </div>
      </div>
    </section>
  );
}