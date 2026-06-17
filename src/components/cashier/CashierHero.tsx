// src/components/cashier/CashierHero.tsx

type CashierHeroProps = {
  balanceLabel: string;
};

export default function CashierHero({ balanceLabel }: CashierHeroProps) {
  return (
    <section className="relative mt-4 overflow-hidden rounded-[1.75rem] border border-[#d6a84f]/25 bg-[#090202]/58 p-4 shadow-2xl shadow-black/45 backdrop-blur-md">
      <div className="pointer-events-none absolute -right-16 -top-16 h-36 w-36 rounded-full bg-[#d6a84f]/12 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-14 left-1/2 h-36 w-36 -translate-x-1/2 rounded-full bg-[#7f1111]/25 blur-3xl" />

      <div className="relative">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-semibold text-[#f7dfaa]/65">
            ပိုက်ဆံအိတ်
          </p>

          <div className="rounded-full border border-[#d6a84f]/25 bg-[#d6a84f]/10 px-3 py-1 text-[0.68rem] font-bold text-[#ffd77a]">
            လုံခြုံသည်
          </div>
        </div>

        <h1 className="mt-3 text-[1.65rem] font-black leading-tight text-[#ffd77a]">
          ငွေသွင်း / ငွေထုတ်
        </h1>

        <p className="mt-2 text-xs leading-5 text-[#fff3d0]/65">
          ငွေသွင်း၊ ငွေထုတ် တင်ပြီး အခြေအနေကို စောင့်ကြည့်နိုင်ပါသည်။
        </p>

        <div className="mt-4 rounded-[1.35rem] border border-[#d6a84f]/20 bg-black/25 px-4 py-3">
          <p className="text-xs font-semibold text-[#f7dfaa]/60">
            လက်ကျန်ငွေ
          </p>

          <p className="mt-1 text-[1.7rem] font-black leading-tight text-[#ffd77a]">
            {balanceLabel.replace("MMK", "ကျပ်")}
          </p>
        </div>
      </div>
    </section>
  );
}