//src>components>live>LiveRecentWinners.tsx

type LiveWinner = {
  id: string;
  name: string;
  game: string;
  amount: number;
  time: string;
};

type LiveRecentWinnersProps = {
  winners: LiveWinner[];
};

function formatMMK(amount: number) {
  return new Intl.NumberFormat("en-US").format(amount);
}

export default function LiveRecentWinners({
  winners,
}: LiveRecentWinnersProps) {
  return (
    <section className="mt-6 rounded-[1.75rem] border border-red-400/15 bg-red-950/10 p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-red-200/60">
            Recent Winners
          </p>
          <h3 className="mt-2 text-lg font-black text-amber-100">
            Winner Activity
          </h3>
        </div>

        <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-emerald-100">
          Live
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {winners.map((winner) => (
          <div
            key={winner.id}
            className="rounded-2xl border border-white/10 bg-black/30 p-4 shadow-lg shadow-black/20"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="truncate text-xs font-bold text-white/35">
                  {winner.name}
                </p>
                <p className="mt-1 text-lg font-black text-amber-100">
                  {winner.game}
                </p>
              </div>

              <div className="shrink-0 text-right">
                <p className="text-lg font-black text-emerald-100">
                  {formatMMK(winner.amount)} MMK
                </p>
                <p className="mt-1 text-xs font-bold text-white/35">
                  {winner.time}
                </p>
              </div>
            </div>

            <div className="mt-3 rounded-full border border-amber-400/15 bg-amber-400/10 px-3 py-2 text-center text-xs font-black text-amber-100">
              Winning settlement recorded
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}