//src>components>games>six-animal>FloatingResultBoard.tsx

"use client";

import { SIX_ANIMAL_OPTIONS, SIX_ANIMAL_RULES } from "@/lib/gameRules";
import type { SixAnimalKey } from "@/types/games";

type FloatingResultBoardActiveBet = {
  animalNameMm: string;
  amount: number;
};

type FloatingResultBoardProps = {
  diceResult: string[];
  activeBet: FloatingResultBoardActiveBet | null;
  activeBetAnimal: {
    key: SixAnimalKey;
    name: string;
  } | null;
  activeBetDisplayName: string;
  showFinalResultPanel: boolean;
  isResultPhaseVisualGuard: boolean;
  isRollingReconnectView: boolean;
  isRollingPhase: boolean;
  isResultWin: boolean;
  resultStatusLabel: string;
  animalAssets: Record<SixAnimalKey, string>;
};

function formatMMK(amount: number) {
  return new Intl.NumberFormat("en-US").format(amount);
}

function getAnimalByNameMm(nameMm: string) {
  return SIX_ANIMAL_OPTIONS.find((animal) => animal.nameMm === nameMm);
}

export default function FloatingResultBoard({
  diceResult,
  activeBet,
  activeBetAnimal,
  activeBetDisplayName,
  showFinalResultPanel,
  isResultPhaseVisualGuard,
  isRollingReconnectView,
  isRollingPhase,
  isResultWin,
  resultStatusLabel,
  animalAssets,
}: FloatingResultBoardProps) {
  return (
    <div className="pointer-events-none absolute inset-x-4 top-2 z-40 overflow-hidden rounded-[1.15rem] border border-amber-300/32 bg-[linear-gradient(145deg,rgba(60,10,4,0.86),rgba(5,1,1,0.8),rgba(72,18,6,0.64))] p-1.5 shadow-[0_18px_42px_rgba(0,0,0,0.78),inset_0_1px_0_rgba(251,191,36,0.16),inset_0_-18px_28px_rgba(0,0,0,0.28)] backdrop-blur-md">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(251,191,36,0.16),transparent_62%)]" />
      <div className="pointer-events-none absolute inset-x-3 bottom-0 h-px bg-gradient-to-r from-transparent via-amber-300/35 to-transparent" />
      <div className="pointer-events-none absolute inset-y-2 left-0 w-px bg-gradient-to-b from-transparent via-amber-200/22 to-transparent" />
      <div className="pointer-events-none absolute inset-y-2 right-0 w-px bg-gradient-to-b from-transparent via-amber-200/22 to-transparent" />
      <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-amber-200/60 to-transparent" />

      <div className="relative z-10">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[7px] font-black uppercase tracking-[0.24em] text-amber-200/60">
              Royal Result Board
            </p>
            <p className="truncate text-xs font-black text-white drop-shadow-[0_0_8px_rgba(251,191,36,0.16)]">
              {showFinalResultPanel
                ? "Visible Dice Result"
                : isResultPhaseVisualGuard
                  ? "Finalizing Table Result"
                  : isRollingReconnectView
                    ? "Live Table Sync"
                    : "Dice Revealing"}
            </p>
          </div>

          <div
            className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[8px] font-black uppercase tracking-[0.12em] ${
              showFinalResultPanel && isResultWin
                ? "border-emerald-200/35 bg-emerald-300/18 text-emerald-100"
                : showFinalResultPanel
                  ? "border-red-200/25 bg-red-500/12 text-red-100"
                  : "border-amber-200/25 bg-amber-300/10 text-amber-100"
            }`}
          >
            {showFinalResultPanel
              ? resultStatusLabel
              : isResultPhaseVisualGuard
                ? `${diceResult.length}/3`
                : isRollingReconnectView
                  ? "SYNCED TABLE"
                  : `${diceResult.length}/3`}
          </div>
        </div>

        {activeBet ? (
          <div className="mt-1.5 flex items-center justify-between gap-2 rounded-xl border border-amber-300/16 bg-black/24 px-2 py-1 shadow-inner shadow-black/35">
            <div className="flex min-w-0 items-center gap-1.5">
              {activeBetAnimal ? (
                <img
                  src={animalAssets[activeBetAnimal.key]}
                  alt={activeBetAnimal.name}
                  className="h-5 w-5 shrink-0 object-contain drop-shadow-[0_0_8px_rgba(251,191,36,0.38)]"
                />
              ) : null}

              <p className="min-w-0 truncate text-[9px] font-black text-white/82">
                Your Bet · {activeBetDisplayName}
              </p>
            </div>

            <p className="shrink-0 text-[9px] font-black text-amber-100">
              {formatMMK(activeBet.amount)} MMK
            </p>
          </div>
        ) : null}

        <div className="mt-1.5 grid grid-cols-3 gap-1">
          {[0, 1, 2].map((index) => {
            const nameMm = diceResult[index];
            const animal = nameMm ? getAnimalByNameMm(nameMm) : null;
            const isMatched = Boolean(
              showFinalResultPanel &&
                activeBet &&
                nameMm &&
                activeBet.animalNameMm === nameMm
            );
            const isCurrent =
              (isRollingPhase || isResultPhaseVisualGuard) &&
              index === diceResult.length &&
              diceResult.length < SIX_ANIMAL_RULES.diceCount;

            return (
              <div
                key={`floating-result-slot-${index}`}
                className={`relative flex min-h-[38px] items-center justify-center overflow-hidden rounded-xl border shadow-inner shadow-black/35 ${
                  isMatched
                    ? "border-emerald-200/50 bg-[linear-gradient(145deg,rgba(16,185,129,0.18),rgba(0,0,0,0.42))] shadow-[0_0_18px_rgba(16,185,129,0.14)]"
                    : animal
                      ? "border-amber-200/28 bg-[linear-gradient(145deg,rgba(251,191,36,0.12),rgba(0,0,0,0.42))]"
                      : isCurrent
                        ? "border-emerald-300/38 bg-[linear-gradient(145deg,rgba(16,185,129,0.14),rgba(0,0,0,0.42))]"
                        : "border-white/10 bg-black/30"
                }`}
              >
                {isMatched ? (
                  <div className="absolute right-0.5 top-0.5 rounded-full border border-emerald-100/60 bg-emerald-300 px-1 py-0.5 text-[5px] font-black uppercase tracking-[0.08em] text-black shadow-[0_0_10px_rgba(16,185,129,0.28)]">
                    Match
                  </div>
                ) : null}

                {animal ? (
                  <div className="text-center">
                    <img
                      src={animalAssets[animal.key]}
                      alt={animal.name}
                      className="mx-auto h-6 w-6 object-contain drop-shadow-[0_0_10px_rgba(251,191,36,0.42)]"
                    />
                    <p className="text-[8px] font-black text-white">
                      {animal.name}
                    </p>
                  </div>
                ) : (
                  <div
                    className={`h-6 w-6 rounded-lg border shadow-inner shadow-black/50 ${
                      isCurrent
                        ? "animate-pulse border-emerald-200/50 bg-emerald-300/25 shadow-emerald-500/20"
                        : "border-amber-200/10 bg-black/35"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}