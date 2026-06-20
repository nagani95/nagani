// src/components/cashier/CashierHero.tsx

type CashierHeroProps = {
  balanceLabel: string;
};

export default function CashierHero({ balanceLabel }: CashierHeroProps) {
  return (
    <section className="relative mt-2 overflow-hidden rounded-[1.4rem] border border-[#d6a84f]/38 bg-[linear-gradient(145deg,rgba(62,12,6,0.96),rgba(10,2,1,0.99),rgba(84,16,8,0.94))] px-5 py-4 shadow-[0_16px_38px_rgba(0,0,0,0.62),inset_0_1px_0_rgba(255,215,122,0.16)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,215,122,0.18),transparent_45%)]" />
      <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-[#ffd77a]/70 to-transparent" />

      <div className="relative">
        <p className="text-[10px] font-black tracking-[0.16em] text-[#d6a84f]/74">
          ပိုက်ဆံအိတ် လက်ကျန်
        </p>

        <p className="mt-2 whitespace-nowrap text-[2.35rem] font-black leading-none text-[#ffd77a] drop-shadow-[0_4px_14px_rgba(0,0,0,0.88)]">
          {balanceLabel}
        </p>

        <div className="mt-3 h-px w-full bg-gradient-to-r from-transparent via-[#d6a84f]/24 to-transparent" />

        <p className="mt-2 text-[10px] font-bold leading-4 text-[#f7dfaa]/54">
          ငွေသွင်း / ငွေထုတ် လုပ်ဆောင်ချက်များကို အောက်တွင် ဆက်လုပ်နိုင်ပါသည်
        </p>
      </div>
    </section>
  );
}