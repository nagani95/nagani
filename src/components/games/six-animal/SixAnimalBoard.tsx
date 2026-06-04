//src>components>games>six-animal>SixAnimalBoard.tsx

import { SIX_ANIMAL_OPTIONS } from "@/lib/gameRules";
import { naganiAssets } from "@/lib/naganiAssets";
import type { SixAnimalKey } from "@/types/games";

type SixAnimalBoardProps = {
  selectedAnimal: SixAnimalKey | null;
  onSelectAnimal: (animal: SixAnimalKey) => void;
};

export default function SixAnimalBoard({
  selectedAnimal,
  onSelectAnimal,
}: SixAnimalBoardProps) {
  return (
    <section className="mt-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-red-200/50">
            Betting Board
          </p>
          <h2 className="mt-1 text-sm font-black uppercase tracking-[0.25em] text-amber-200">
            Choose Animal
          </h2>
        </div>

        <p className="rounded-full border border-amber-400/15 bg-amber-400/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-amber-100/70">
          1 Pick
        </p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        {SIX_ANIMAL_OPTIONS.map((animal) => {
          const isSelected = selectedAnimal === animal.key;
          const animalAsset =
            animal.key === "tiger"
              ? naganiAssets.sixAnimal.animals.tiger
              : null;

          return (
            <button
              key={animal.key}
              type="button"
              onClick={() => onSelectAnimal(animal.key)}
              className={
                isSelected
                  ? "relative min-h-[10.25rem] overflow-hidden rounded-[1.5rem] border border-amber-200 bg-gradient-to-br from-amber-200 to-amber-400 p-4 text-left text-black shadow-xl shadow-amber-950/40"
                  : "relative min-h-[10.25rem] overflow-hidden rounded-[1.5rem] border border-amber-400/15 bg-black/35 p-4 text-left text-amber-50 transition hover:-translate-y-0.5 hover:border-amber-300/50 hover:bg-red-950/30"
              }
            >
              {isSelected && (
                <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/25 blur-2xl" />
              )}

              {animalAsset && (
                <>
                  <div className="pointer-events-none absolute bottom-3 right-4 h-20 w-20 rounded-full bg-amber-300/20 blur-2xl" />

                  <div className="pointer-events-none absolute bottom-1 right-0 h-32 w-36 opacity-100">
                    <img
                      src={animalAsset}
                      alt=""
                      className="h-full w-full object-contain drop-shadow-[0_18px_22px_rgba(251,191,36,0.22)]"
                    />
                  </div>
                </>
              )}

              <div className="relative z-10 max-w-[55%]">
                <p
                  className={
                    isSelected
                      ? "text-[11px] font-black uppercase tracking-[0.25em] text-black/50"
                      : "text-[11px] font-black uppercase tracking-[0.25em] text-red-200/50"
                  }
                >
                  {animal.name}
                </p>

                <p className="mt-2 text-2xl font-black leading-tight">
                  {animal.nameMm}
                </p>

                <p
                  className={
                    isSelected
                      ? "mt-2 text-xs font-black text-black/65"
                      : "mt-2 text-xs font-bold text-white/35"
                  }
                >
                  {isSelected ? "Selected for round" : "Tap to select"}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}