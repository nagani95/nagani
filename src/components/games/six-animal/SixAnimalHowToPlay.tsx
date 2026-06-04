//src>components>games>six-animal>SixAnimalHowToPlay.tsx

export default function SixAnimalHowToPlay() {
  return (
    <section className="mt-6 rounded-[1.75rem] border border-emerald-400/15 bg-emerald-400/5 p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-emerald-200/60">
            How To Play
          </p>
          <h3 className="mt-2 text-lg font-black text-amber-100">
            ၆ ကောင်ဂျင် Rule Guide
          </h3>
        </div>

        <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-emerald-100">
          Simple
        </div>
      </div>

      <div className="mt-4 space-y-3 text-sm leading-6 text-white/65">
        <p>
          <span className="font-black text-amber-100">1.</span> Choose one
          animal from the betting board.
        </p>
        <p>
          <span className="font-black text-amber-100">2.</span> Enter your bet
          amount and confirm the round.
        </p>
        <p>
          <span className="font-black text-amber-100">3.</span> Three dice are
          revealed for the round result.
        </p>
        <p>
          <span className="font-black text-amber-100">4.</span> If your animal
          appears on the dice, the payout depends on the match count.
        </p>
      </div>

      <p className="mt-4 rounded-2xl border border-white/10 bg-black/25 p-3 text-xs leading-5 text-white/40">
        Frontend preview only. Final wallet deduction, result, and payout must
        come from the backend.
      </p>
    </section>
  );
}