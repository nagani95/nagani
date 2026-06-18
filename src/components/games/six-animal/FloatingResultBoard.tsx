//src>components>games>six-animal>FloatingResultBoard.tsx

"use client";

import { SIX_ANIMAL_OPTIONS, SIX_ANIMAL_RULES } from "@/lib/gameRules";
import ActiveBetsSummaryPanel from "./ActiveBetsSummaryPanel";
import type { SixAnimalKey } from "@/types/games";
const WOODEN_RESULT_BOX_ASSET =
  "/assets/nagani/six-animal/ui/wooden-result-box.png";

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
  isSettlementStage?: boolean;
  animalAssets: Record<SixAnimalKey, string>;
};

function getAnimalByNameMm(nameMm: string) {
  return SIX_ANIMAL_OPTIONS.find((animal) => animal.nameMm === nameMm);
}

function isResultNameMatchedByBet(
  nameMm: string,
  activeBets: FloatingResultBoardActiveBet[],
  diceResult: string[],
  showFinalResultPanel: boolean,
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
  isSettlementStage = false,
  animalAssets,
}: FloatingResultBoardProps) {
  const isRevealing = isRollingPhase || isResultPhaseVisualGuard;

  return (
    <div className="pointer-events-none absolute left-1/2 top-[-8px] z-50 w-[min(94vw,370px)] -translate-x-1/2">
      <div className="relative mx-auto flex items-center justify-center gap-2">
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
                showFinalResultPanel,
              ),
          );

return (
  <div
    key={`royal-result-box-${index}`}
    className={`relative flex h-[78px] w-[78px] shrink-0 items-center justify-center overflow-visible rounded-[1.25rem] bg-[#1a0503] ${
      isMatched
        ? "drop-shadow-[0_0_18px_rgba(16,185,129,0.42)]"
        : animal
          ? "drop-shadow-[0_0_16px_rgba(255,215,122,0.30)]"
          : "drop-shadow-[0_12px_18px_rgba(0,0,0,0.58)]"
    }`}
  >
    <img
      src={WOODEN_RESULT_BOX_ASSET}
      alt=""
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full object-contain"
    />

    <div className="pointer-events-none absolute inset-[15px] rounded-[0.72rem] bg-[radial-gradient(circle_at_50%_32%,#4a1a0d_0%,#2a0905_48%,#0b0101_100%)] shadow-[inset_0_2px_7px_rgba(0,0,0,0.72),inset_0_0_0_1px_rgba(255,215,122,0.18)]" />

    {animal ? (
      <div className="relative z-10 flex h-full w-full items-center justify-center overflow-visible">
        <div className="pointer-events-none absolute inset-[13px] animate-[resultSpotlightPulse_1.8s_ease-in-out_infinite] rounded-[0.82rem] bg-[radial-gradient(circle_at_50%_40%,rgba(255,243,208,0.22),rgba(255,215,122,0.08)_34%,transparent_72%)]" />

        <div className="pointer-events-none absolute inset-y-[-20%] left-[-48%] w-[42%] rotate-12 animate-[resultLightSweep_1.45s_ease-out_1] bg-gradient-to-r from-transparent via-[#fff3d0]/34 to-transparent" />

        <img
          src={animalAssets[animal.key]}
          alt=""
          className="relative z-10 h-[54px] w-[54px] scale-[1.04] animate-[resultAnimalPop_520ms_cubic-bezier(0.2,1.2,0.25,1)_1] object-contain brightness-125 contrast-115 drop-shadow-[0_0_12px_rgba(255,215,122,0.72)]"
        />

        <div className="pointer-events-none absolute bottom-[14px] h-[4px] w-9 animate-[resultSpotlightPulse_1.8s_ease-in-out_infinite] rounded-full bg-[#fff3d0]/55 blur-[4px]" />
      </div>
    ) : (
      <span
        className={`relative z-10 text-[31px] font-black leading-none ${
          isCurrent
            ? "text-[#fff3d0] drop-shadow-[0_0_12px_rgba(255,243,208,0.38)]"
            : "text-[#ffd77a] drop-shadow-[0_0_10px_rgba(255,215,122,0.42)]"
        }`}
      >
        ?
      </span>
    )}

    {isCurrent && !animal ? (
      <div className="pointer-events-none absolute inset-[12px] animate-pulse rounded-[0.9rem] bg-[#ffd77a]/[0.035]" />
    ) : null}

    {showFinalResultPanel && isResultWin && isMatched ? (
      <div className="pointer-events-none absolute inset-x-[18px] bottom-[12px] z-20 h-[3px] rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.58)]" />
    ) : null}
  </div>
);
        })}
      </div>

<ActiveBetsSummaryPanel
  activeBets={activeBets}
  compact
  settlementExpanded={isSettlementStage}
  className={
    isSettlementStage
      ? "pointer-events-auto mx-auto mt-2 w-full max-w-[292px]"
      : "pointer-events-auto mx-auto mt-2 w-full max-w-[170px]"
  }
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