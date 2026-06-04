//src>components>live>LiveRecentResults.tsx

type LiveResult = {
  id: string;
  type: string;
  title: string;
  result: string;
  label: string;
  time: string;
};

type LiveRecentResultsProps = {
  results: LiveResult[];
};

export default function LiveRecentResults({ results }: LiveRecentResultsProps) {
  return (
    <section className="mt-5 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-red-200/50">
            Result Feed
          </p>
          <h2 className="mt-1 text-sm font-black uppercase tracking-[0.25em] text-amber-200">
            Recent Results
          </h2>
        </div>

        <p className="rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-amber-100">
          {results.length} Records
        </p>
      </div>

      {results.map((item) => (
        <article
          key={item.id}
          className="rounded-[1.5rem] border border-amber-400/15 bg-black/45 p-4 shadow-xl shadow-black/30"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="truncate text-xs font-bold text-white/35">
                {item.id}
              </p>
              <h3 className="mt-1 text-lg font-black text-amber-100">
                {item.title}
              </h3>
            </div>

            <div className="shrink-0 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-emerald-100">
              {item.time}
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-red-200/45">
              {item.label}
            </p>
            <p className="mt-2 text-2xl font-black text-amber-100">
              {item.result}
            </p>
          </div>
        </article>
      ))}
    </section>
  );
}