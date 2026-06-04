//src>components>games>thirty-six>ThirtySixPreviousResults.tsx

type ThirtySixPreviousResult = {
  draw: string;
  number: number;
  animal: string;
};

type ThirtySixPreviousResultsProps = {
  results: ThirtySixPreviousResult[];
};

export default function ThirtySixPreviousResults({
  results,
}: ThirtySixPreviousResultsProps) {
  return (
    <section className="mt-6 rounded-[1.75rem] border border-red-400/15 bg-red-950/10 p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-red-200/60">
            Previous Results
          </p>
          <h3 className="mt-2 text-lg font-black text-amber-100">
            Draw History
          </h3>
        </div>

        <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-emerald-100">
          Published
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {results.map((result) => (
          <div
            key={`${result.draw}-${result.number}`}
            className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/30 px-4 py-3"
          >
            <div>
              <p className="text-xs font-bold text-white/35">{result.draw}</p>
              <p className="mt-1 text-sm font-bold text-white/65">
                {result.animal}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-full border border-amber-400/20 bg-amber-400/10 text-sm font-black text-amber-100 shadow-lg shadow-black/30">
              #{result.number}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}