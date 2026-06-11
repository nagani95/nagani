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
  ? "border-emerald-200/70 bg-[linear-gradient(135deg,#064e3b,#3a0a06,#120101)] shadow-[0_0_24px_rgba(16,185,129,0.26),0_18px_30px_rgba(0,0,0,0.62)]"
  : animal
    ? "border-amber-100/75 bg-[linear-gradient(135deg,#5b120b,#370505,#140101)] shadow-[0_0_24px_rgba(251,191,36,0.22),0_18px_30px_rgba(0,0,0,0.62)]"
    : "border-amber-200/42 bg-[linear-gradient(145deg,#8e1216,#5c090c,#240204)]"
              }`}
            >
              <div className="pointer-events-none absolute inset-[5px] rounded-[0.88rem] border border-amber-100/18" />
              <div className="pointer-events-none absolute inset-[9px] rounded-[0.62rem] border border-black/24" />
              <div className="pointer-events-none absolute inset-[10px] rounded-[0.58rem] bg-[linear-gradient(145deg,#4a190d_0%,#2a0e09_42%,#140707_100%)] shadow-[inset_0_1px_0_rgba(255,223,154,0.16),inset_0_-10px_18px_rgba(0,0,0,0.55)]" />
<div className="pointer-events-none absolute inset-[10px] rounded-[0.58rem] opacity-[0.18] bg-[repeating-linear-gradient(90deg,rgba(255,240,200,0.08)_0px,rgba(255,240,200,0.08)_1px,transparent_1px,transparent_8px)]" />
              {animal ? (
  <div className="pointer-events-none absolute inset-[10px] rounded-[0.58rem] bg-[linear-gradient(145deg,#1a0303,#2b0504,#090101)] shadow-[inset_0_1px_0_rgba(251,191,36,0.16),inset_0_-10px_16px_rgba(0,0,0,0.62)]" />
) : null}
              <div className="pointer-events-none absolute inset-[10px] rounded-[0.58rem] bg-[linear-gradient(145deg,rgba(18,3,3,0.92),rgba(45,7,5,0.84),rgba(8,1,1,0.96))] shadow-[inset_0_1px_0_rgba(251,191,36,0.12),inset_0_-10px_16px_rgba(0,0,0,0.44)]" />

              <div className="pointer-events-none absolute inset-x-2 top-1.5 h-px bg-gradient-to-r from-transparent via-amber-100/55 to-transparent" />
              <div className="pointer-events-none absolute inset-x-2 bottom-1.5 h-px bg-gradient-to-r from-transparent via-black/50 to-transparent" />

{animal ? (
  <div className="relative z-10 flex h-full w-full items-center justify-center overflow-hidden">
    <div className="pointer-events-none absolute inset-0 animate-[resultSpotlightPulse_1.8s_ease-in-out_infinite] bg-[radial-gradient(circle_at_50%_38%,rgba(255,244,190,0.34),rgba(251,191,36,0.2)_26%,rgba(120,53,15,0.09)_48%,transparent_74%)]" />

    <div className="pointer-events-none absolute left-1/2 top-[9px] h-[18px] w-[40px] -translate-x-1/2 rounded-full bg-amber-50/18 blur-[8px]" />

    <div className="pointer-events-none absolute inset-y-[-25%] left-[-48%] w-[42%] rotate-12 animate-[resultLightSweep_1.45s_ease-out_1] bg-gradient-to-r from-transparent via-amber-50/40 to-transparent" />

    <img
      src={animalAssets[animal.key]}
      alt=""
      className="relative z-10 h-[64px] w-[64px] scale-[1.08] animate-[resultAnimalPop_520ms_cubic-bezier(0.2,1.2,0.25,1)_1] object-contain brightness-125 contrast-115 drop-shadow-[0_0_18px_rgba(251,191,36,0.72)]"
    />

    <div className="pointer-events-none absolute bottom-[7px] h-[5px] w-11 animate-[resultSpotlightPulse_1.8s_ease-in-out_infinite] rounded-full bg-amber-100/70 blur-[4px]" />
  </div>
) : (
<span
  className={`relative z-10 text-[34px] font-black leading-none ${
    isCurrent
      ? "text-amber-50 drop-shadow-[0_0_12px_rgba(255,248,220,0.32)]"
      : "text-amber-100 drop-shadow-[0_0_10px_rgba(251,191,36,0.34)]"
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