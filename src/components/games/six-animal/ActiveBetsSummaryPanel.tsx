//src>components>games>six-animal>ActiveBetsSummaryPanel.tsx

"use client";

import type { SixAnimalKey } from "@/types/games";

type BetMode = "single" | "pair";

type ActiveBet = {
  betType: BetMode;
  animalKey: SixAnimalKey;
  animalKey2?: SixAnimalKey | null;
  animalNameMm: string;
  animalNameMm2?: string | null;
  amount: number;
  roundNumber: number;
};

type ActiveBetsSummaryPanelProps = {
  activeBets: ActiveBet[];
  compact?: boolean;
  className?: string;
};

function formatMMK(amount: number) {
  return new Intl.NumberFormat("en-US").format(amount);
}

function getBetSlipKey(bet: ActiveBet) {
  return bet.betType === "pair" && bet.animalKey2
    ? `pair-${[bet.animalKey, bet.animalKey2].sort().join("-")}`
    : `single-${bet.animalKey}`;
}

function getBetLabel(bet: ActiveBet) {
  return bet.betType === "pair" && bet.animalNameMm2
    ? `${bet.animalNameMm} + ${bet.animalNameMm2}`
    : bet.animalNameMm;
}

export default function ActiveBetsSummaryPanel({
  activeBets,
  compact = false,
  className = "",
}: ActiveBetsSummaryPanelProps) {
  if (activeBets.length === 0) return null;

if (compact) {
  return (
    <div
      className={`rounded-xl border border-amber-300/16 bg-black/50 p-1.5 shadow-inner shadow-black/55 backdrop-blur-sm ${className}`}
    >
      <div className="max-h-[30px] overflow-y-auto overflow-x-hidden pr-1">
        {activeBets.map((bet) => {
          const betLabel = getBetLabel(bet);

          return (
            <div
              key={getBetSlipKey(bet)}
              className="flex min-h-[28px] w-full items-center justify-center rounded-lg border border-amber-300/12 bg-black/38 px-2 py-1"
            >
              <div className="flex max-w-full items-center justify-center gap-2.5">
                <span className="min-w-0 truncate text-center text-[9px] font-black text-amber-100">
                  {betLabel}
                </span>

                <span className="shrink-0 text-[9px] font-black tabular-nums text-amber-200">
                  {formatMMK(bet.amount)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

return (
  <div
    className={`rounded-xl border border-amber-300/18 bg-black/42 p-2 shadow-inner shadow-black/55 ${className}`}
  >
    <div className="max-h-[68px] space-y-1 overflow-y-auto pr-1">
      {activeBets.map((bet) => {
        const betLabel = getBetLabel(bet);

        return (
          <div
            key={getBetSlipKey(bet)}
            className="flex min-h-[30px] w-full items-center justify-center rounded-lg border border-amber-300/12 bg-black/36 px-2 py-1"
          >
            <div className="flex max-w-full items-center justify-center gap-2.5">
              <span className="min-w-0 max-w-[155px] truncate text-center text-[10px] font-black text-amber-100">
                {betLabel}
              </span>

              <span className="shrink-0 text-[10px] font-black tabular-nums text-amber-200">
                {formatMMK(bet.amount)}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  </div>
);
}