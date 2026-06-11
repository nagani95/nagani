//src>components>games>six-animal>FloatingResultBoard.tsx

"use client";

import { SIX_ANIMAL_OPTIONS, SIX_ANIMAL_RULES } from "@/lib/gameRules";
import ActiveBetsSummaryPanel from "./ActiveBetsSummaryPanel";
import type { SixAnimalKey } from "@/types/games";

type FloatingResultBoardActiveBet = {
  betType: "single" | "pair";
  animalKey: SixAnimalKey;
  animalKey2?: SixAnimalKey | null;
  animalNameMm: string;
  animalNameMm2?: string | null;
  amount: number;
  roundNumber: number;
};

type FloatingResultBoardProps = {
  diceResult: string[];
  activeBets: FloatingResultBoardActiveBet[];
  showFinalResultPanel: boolean;
  isResultPhaseVisualGuard: boolean;
  isRollingPhase: boolean;
  isResultWin: boolean;
  animalAssets: Record<SixAnimalKey, string>;
};

function getAnimalByNameMm(nameMm: string) {
  return SIX_ANIMAL_OPTIONS.find((animal) => animal.nameMm === nameMm);
}

function isResultNameMatchedByBet(
  nameMm: string,
  activeBets: FloatingResultBoardActiveBet[],
  diceResult: string[],
  showFinalResultPanel: boolean
) {
  if (!showFinalResultPanel) return false;

  return activeBets.some((bet) => {
    if (bet.betType === "pair" && bet.animalNameMm2) {
      const hasFirstAnimal = diceResult.includes(bet.animalNameMm);
      const hasSecondAnimal = diceResult.includes(bet.animalNameMm2);
      const isWinningPair = hasFirstAnimal && hasSecondAnimal;

      return (
        isWinningPair &&
        (nameMm === bet.animalNameMm || nameMm === bet.animalNameMm2)
      );
    }

    return nameMm === bet.animalNameMm;
  });
}

export default function FloatingResultBoard({
  diceResult,
  activeBets,
  showFinalResultPanel,
  isResultPhaseVisualGuard,
  isRollingPhase,
  isResultWin,
  animalAssets,
}: FloatingResultBoardProps) {
  const isRevealing = isRollingPhase || isResultPhaseVisualGuard;

  return (
    <div className="pointer-events-none absolute left-1/2 top-[-8px] z-50 w-[min(94vw,370px)] -translate-x-1/2">
      <div className="relative mx-auto flex items-center justify-center gap-3">
        {Array.from({ length: SIX_ANIMAL_RULES.diceCount }).map((_, index) => {
          const nameMm = diceResult[index];
          const animal = nameMm ? getAnimalByNameMm(nameMm) : null;

          const isCurrent =
            isRevealing &&
            index === diceResult.length &&
            diceResult.length < SIX_ANIMAL_RULES.diceCount;

          const isMatched = Boolean(
            nameMm &&
              isResultNameMatchedByBet(
                nameMm,
                activeBets,
                diceResult,
                showFinalResultPanel
              )
          );

          return (
            <div
              key={`royal-mystery-result-box-${index}`}
              className={`relative flex h-[70px] w-[70px] shrink-0 items-center justify-center overflow-hidden rounded-[1.15rem] border shadow-[0_18px_30px_rgba(0,0,0,0.62),inset_0_2px_0_rgba(255,224,150,0.2),inset_0_-16px_22px_rgba(0,0,0,0.42)] ${
                isMatched
                  ? "border-emerald-200/70 bg-[linear-gradient(135deg,rgba(16,185,129,0.24),rgba(120,53,15,0.52),rgba(45,7,3,0.96))] shadow-[0_0_24px_rgba(16,185,129,0.26),0_18px_30px_rgba(0,0,0,0.62)]"
                  : animal
                    ? "border-amber-100/75 bg-[linear-gradient(135deg,rgba(250,204,21,0.42),rgba(180,83,9,0.5),rgba(69,10,10,0.98))] shadow-[0_0_24px_rgba(251,191,36,0.26),0_18px_30px_rgba(0,0,0,0.62)]"
                    : "border-amber-200/42 bg-[linear-gradient(145deg,rgba(142,18,22,0.98),rgba(92,9,12,0.98),rgba(36,2,4,0.98))]"
              }`}
            >
              <div className="pointer-events-none absolute inset-[5px] rounded-[0.88rem] border border-amber-100/18" />
              <div className="pointer-events-none absolute inset-[9px] rounded-[0.62rem] border border-black/24" />

              <div className="pointer-events-none absolute inset-x-2 top-1.5 h-px bg-gradient-to-r from-transparent via-amber-100/55 to-transparent" />
              <div className="pointer-events-none absolute inset-x-2 bottom-1.5 h-px bg-gradient-to-r from-transparent via-black/50 to-transparent" />

              <div className="pointer-events-none absolute left-2 top-2 h-1.5 w-1.5 rounded-full bg-amber-100/36" />
              <div className="pointer-events-none absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-amber-100/36" />
              <div className="pointer-events-none absolute bottom-2 left-2 h-1.5 w-1.5 rounded-full bg-black/32" />
              <div className="pointer-events-none absolute bottom-2 right-2 h-1.5 w-1.5 rounded-full bg-black/32" />

              {animal ? (
                <div className="pointer-events-none absolute right-2.5 top-2.5 z-20 h-2 w-2 rounded-full bg-amber-200 shadow-[0_0_10px_rgba(251,191,36,0.9)]" />
              ) : null}

              {animal ? (
                <div className="relative z-10 flex h-full w-full items-center justify-center overflow-hidden">
                  <div className="pointer-events-none absolute inset-0 animate-[resultSpotlightPulse_1.8s_ease-in-out_infinite] bg-[radial-gradient(circle_at_50%_44%,rgba(255,246,196,0.34),rgba(251,191,36,0.2)_34%,transparent_68%)]" />

                  <div className="pointer-events-none absolute inset-[8px] rounded-xl border border-amber-100/28 bg-[linear-gradient(135deg,rgba(255,255,255,0.1),transparent_42%,rgba(0,0,0,0.18))]" />

                  <div className="pointer-events-none absolute h-[60px] w-[60px] animate-[resultRevealRing_900ms_ease-out_1] rounded-full border border-amber-100/34 shadow-[0_0_22px_rgba(251,191,36,0.36)]" />

                  <div className="pointer-events-none absolute inset-y-[-25%] left-[-48%] w-[42%] rotate-12 animate-[resultLightSweep_1.45s_ease-out_1] bg-gradient-to-r from-transparent via-amber-50/50 to-transparent" />

                  <img
                    src={animalAssets[animal.key]}
                    alt=""
                    className="relative z-10 h-[50px] w-[50px] animate-[resultAnimalPop_520ms_cubic-bezier(0.2,1.2,0.25,1)_1] object-contain brightness-110 drop-shadow-[0_0_18px_rgba(251,191,36,0.76)]"
                  />

                  <div className="pointer-events-none absolute bottom-2 h-[4px] w-10 animate-[resultSpotlightPulse_1.8s_ease-in-out_infinite] rounded-full bg-amber-100/70 blur-[3px]" />
                </div>
              ) : (
                <span
                  className={`relative z-10 text-[34px] font-black leading-none ${
                    isCurrent
                      ? "text-amber-50 drop-shadow-[0_0_12px_rgba(255,255,255,0.26)]"
                      : "text-amber-100 drop-shadow-[0_0_12px_rgba(251,191,36,0.48)]"
                  }`}
                >
                  ?
                </span>
              )}

              {isCurrent && !animal ? (
                <div className="pointer-events-none absolute inset-0 animate-pulse bg-white/[0.035]" />
              ) : null}

              {showFinalResultPanel && isResultWin && isMatched ? (
                <div className="pointer-events-none absolute inset-x-4 bottom-2 h-[3px] rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.58)]" />
              ) : null}
            </div>
          );
        })}
      </div>

      <ActiveBetsSummaryPanel
        activeBets={activeBets}
        compact
        className="pointer-events-auto mx-auto mt-2 w-full max-w-[170px]"
      />

      <style jsx>{`
        @keyframes resultAnimalPop {
          0% {
            opacity: 0;
            transform: scale(0.62) translateY(5px);
            filter: brightness(1.8);
          }

          58% {
            opacity: 1;
            transform: scale(1.14) translateY(-1px);
            filter: brightness(1.35);
          }

          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
            filter: brightness(1);
          }
        }

        @keyframes resultRevealRing {
          0% {
            opacity: 0.9;
            transform: scale(0.58);
          }

          100% {
            opacity: 0;
            transform: scale(1.28);
          }
        }

        @keyframes resultLightSweep {
          0% {
            transform: translateX(0%) rotate(12deg);
            opacity: 0;
          }

          22% {
            opacity: 1;
          }

          100% {
            transform: translateX(390%) rotate(12deg);
            opacity: 0;
          }
        }

        @keyframes resultSpotlightPulse {
          0%,
          100% {
            opacity: 0.55;
          }

          50% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}