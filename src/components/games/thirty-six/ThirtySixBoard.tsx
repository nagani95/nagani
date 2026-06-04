//src>components>games>thirty-sx>ThirtySixBoard.tsx

import { THIRTY_SIX_ANIMAL_OPTIONS } from "@/lib/gameRules";
import { naganiAssets } from "@/lib/naganiAssets";

type ThirtySixBoardProps = {
  selectedNumbers: number[];
  onToggleAnimal: (number: number) => void;
};

export default function ThirtySixBoard({
  selectedNumbers,
  onToggleAnimal,
}: ThirtySixBoardProps) {
  return (
    <section className="mt-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-red-200/45">
            Draw Board
          </p>
          <h2 className="mt-1 text-sm font-black uppercase tracking-[0.25em] text-amber-200">
            36 Animal Numbers
          </h2>
        </div>

        <p className="rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-xs font-black text-amber-100">
          {selectedNumbers.length} picked
        </p>
      </div>

      <div className="relative mt-4 overflow-hidden rounded-[2rem] border border-amber-400/15 bg-gradient-to-br from-[#190404] via-black to-[#120202] p-4 shadow-2xl shadow-black/40">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(251,191,36,0.12),transparent_35%)]" />

        <div className="relative mx-auto max-w-[25rem] overflow-hidden rounded-[2rem] px-7 py-12">
          <img
            src={naganiAssets.thirtySix.ui.boardFrame}
            alt=""
            className="pointer-events-none absolute inset-0 h-full w-full scale-[1.35] object-fill opacity-95"
          />

          <div className="relative z-10 rounded-[1.5rem] border border-amber-400/10 bg-black/65 p-3 shadow-2xl shadow-black/70 backdrop-blur-sm">
            <div className="pointer-events-none absolute inset-0 rounded-[1.5rem] bg-[radial-gradient(circle_at_center,rgba(69,10,10,0.35),rgba(0,0,0,0.72))]" />

            <div className="relative grid grid-cols-6 gap-1.5">
              {THIRTY_SIX_ANIMAL_OPTIONS.map((animal) => {
                const isSelected = selectedNumbers.includes(animal.number);

                return (
                  <button
                    key={animal.number}
                    type="button"
                    onClick={() => onToggleAnimal(animal.number)}
                    className={
                      isSelected
                        ? "relative flex aspect-square items-center justify-center overflow-hidden rounded-xl border border-amber-100 bg-gradient-to-br from-amber-200 via-amber-300 to-yellow-500 text-black shadow-lg shadow-amber-950/40"
                        : "relative flex aspect-square items-center justify-center overflow-hidden rounded-xl border border-amber-400/25 bg-gradient-to-br from-[#170404] to-black text-amber-50 shadow-lg shadow-black/40 transition hover:-translate-y-0.5 hover:border-amber-300/60 hover:bg-red-950/50"
                    }
                  >
                    <span className="relative z-10 text-sm font-black">
                      {animal.number}
                    </span>

                    {isSelected && (
                      <div className="pointer-events-none absolute inset-0 bg-white/20" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}