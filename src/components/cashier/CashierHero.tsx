//src>components>cashier>CashierHero.tsx

type CashierHeroProps = {
  balanceLabel: string;
};

export default function CashierHero({ balanceLabel }: CashierHeroProps) {
  return (
    <section className="relative mt-6 overflow-hidden rounded-[2rem] border border-red-500/30 bg-gradient-to-br from-red-950 via-[#160303] to-black p-5 shadow-2xl shadow-red-950/30">
      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-amber-300/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 left-1/2 h-44 w-44 -translate-x-1/2 rounded-full bg-red-600/20 blur-3xl" />

      <div className="relative">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-red-200/60">
            Nagani Cashier
          </p>

          <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-emerald-100">
            Secure
          </div>
        </div>

        <h1 className="mt-3 text-4xl font-black text-amber-100">Cashier</h1>

        <p className="mt-3 text-sm leading-6 text-amber-50/65">
          Submit deposit or withdraw requests and track every wallet ticket from
          pending review to confirmed settlement.
        </p>

        <div className="mt-5 rounded-[1.5rem] border border-amber-400/20 bg-amber-400/10 p-4">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-200/60">
            Current Balance
          </p>
          <p className="mt-1 text-3xl font-black text-amber-100">
            {balanceLabel}
          </p>
        </div>
      </div>
    </section>
  );
}