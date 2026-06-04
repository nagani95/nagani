//src>components>history>HistoryHero.tsx

type HistoryHeroProps = {
  totalBets: number;
  totalWins: number;
};

export default function HistoryHero({ totalBets, totalWins }: HistoryHeroProps) {
  return (
    <section className="relative mt-6 overflow-hidden rounded-[2rem] border border-red-500/30 bg-gradient-to-br from-red-950 via-[#160303] to-black p-5 shadow-2xl shadow-red-950/30">
      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-amber-300/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 left-1/2 h-44 w-44 -translate-x-1/2 rounded-full bg-red-600/20 blur-3xl" />

      <div className="relative">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-red-200/60">
            Member Activity
          </p>

          <div className="rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-amber-100">
            Ledger
          </div>
        </div>

        <h1 className="mt-3 text-4xl font-black text-amber-100">History</h1>

        <p className="mt-3 text-sm leading-6 text-amber-50/65">
          Review your game records, draw tickets, wallet requests, and payout
          activity in one trusted member ledger.
        </p>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-amber-400/20 bg-amber-400/10 p-3">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-amber-200/60">
              Total Bets
            </p>
            <p className="mt-1 text-2xl font-black text-amber-100">
              {totalBets}
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-3">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-200/60">
              Wins
            </p>
            <p className="mt-1 text-2xl font-black text-emerald-100">
              {totalWins}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}