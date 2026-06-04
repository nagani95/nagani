//src>components>live>LiveResultNote.tsx

export default function LiveResultNote() {
  return (
    <section className="mt-6 rounded-[1.75rem] border border-emerald-400/15 bg-emerald-400/5 p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-emerald-200/60">
            Result Note
          </p>
          <h3 className="mt-2 text-lg font-black text-amber-100">
            Public Result Feed
          </h3>
        </div>

        <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-emerald-100">
          Safe
        </div>
      </div>

      <div className="mt-4 space-y-3 text-sm leading-6 text-white/65">
        <p>
          <span className="font-black text-amber-100">1.</span> Results shown
          here are public activity previews.
        </p>
        <p>
          <span className="font-black text-amber-100">2.</span> Personal bet
          records stay inside the History page.
        </p>
        <p>
          <span className="font-black text-amber-100">3.</span> Backend
          integration will later load trusted live result data.
        </p>
      </div>

      <p className="mt-4 rounded-2xl border border-white/10 bg-black/25 p-3 text-xs leading-5 text-white/40">
        Frontend preview only. Real live results, winner feed, and settlement
        records must come from backend-approved data.
      </p>
    </section>
  );
}