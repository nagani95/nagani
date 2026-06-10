//src>components>games>six-animal>FloatingResultBoard.tsx

"use client";

import { SIX_ANIMAL_OPTIONS, SIX_ANIMAL_RULES } from "@/lib/gameRules";
import type { SixAnimalKey } from "@/types/games";

type FloatingResultBoardActiveBet = {
  betType: "single" | "pair";
  animalNameMm: string;
  animalNameMm2?: string | null;
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

function formatBetLabel(bet: FloatingResultBoardActiveBet) {
  if (bet.betType === "pair" && bet.animalNameMm2) {
    return `${bet.animalNameMm} + ${bet.animalNameMm2}`;
  }

  return bet.animalNameMm;
}

function getCompactBetLabel(activeBets: FloatingResultBoardActiveBet[]) {
  if (activeBets.length === 0) return "";

  const visibleBets = activeBets.slice(0, 2).map(formatBetLabel);
  const hiddenCount = activeBets.length - visibleBets.length;

  return hiddenCount > 0
    ? `${visibleBets.join(" · ")} +${hiddenCount}`
    : visibleBets.join(" · ");
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
  const betLabel = getCompactBetLabel(activeBets);
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
                  ? "border-emerald-200/65 bg-[linear-gradient(145deg,rgba(139,18,22,0.98),rgba(85,8,10,0.98),rgba(33,2,4,0.98))]"
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
                <img
                  src={animalAssets[animal.key]}
                  alt=""
                  className="relative z-10 h-[46px] w-[46px] object-contain drop-shadow-[0_0_13px_rgba(251,191,36,0.48)]"
                />
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

      {betLabel ? (
        <div className="mx-auto mt-2 max-w-[270px] truncate rounded-full border border-amber-300/18 bg-black/36 px-3 py-1 text-center text-[10px] font-black text-amber-100/86 shadow-md shadow-black/40 backdrop-blur-sm">
          {betLabel}
        </div>
      ) : null}
    </div>
  );
}