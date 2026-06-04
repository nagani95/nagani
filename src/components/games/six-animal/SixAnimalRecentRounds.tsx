//src>components>games>six-animal>SixAnimalRecentRounds.tsx

type SixAnimalRecentRoundsProps = {
  rounds: string[][];
};

export default function SixAnimalRecentRounds({
  rounds,
}: SixAnimalRecentRoundsProps) {
  return (
    <section className="mt-6 rounded-[1.75rem] border border-red-400/15 bg-red-950/10 p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-red-200/60">
            Recent Rounds
          </p>
          <h3 className="mt-2 text-lg font-black text-amber-100">
            Table History
          </h3>
        </div>

        <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-emerald-100">
          Live
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {rounds.map((round, index) => (
          <div
            key={index}
            className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3"
          >
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs font-bold text-white/35">
                Round {index + 1}
              </p>

              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-amber-200/50">
                Result
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {round.map((item, itemIndex) => (
                <span
                  key={`${item}-${itemIndex}`}
                  className="rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-sm font-black text-amber-100"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}