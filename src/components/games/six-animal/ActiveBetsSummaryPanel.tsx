// src/components/games/six-animal/ActiveBetsSummaryPanel.tsx

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

function getBetModeLabel(bet: ActiveBet) {
  return bet.betType === "pair" ? "ကြိုး" : "မောင်း";
}

export default function ActiveBetsSummaryPanel({
  activeBets,
  compact = false,
  className = "",
}: ActiveBetsSummaryPanelProps) {
  if (activeBets.length === 0) return null;

  const totalBetAmount = activeBets.reduce(
    (sum, bet) => sum + Number(bet.amount || 0),
    0
  );

  if (compact) {
    return (
      <div
        className={`rounded-xl border border-[#d6a84f]/18 bg-black/54 p-1.5 shadow-inner shadow-black/55 backdrop-blur-sm ${className}`}
      >
        <div className="max-h-[34px] overflow-y-auto overflow-x-hidden pr-1">
          {activeBets.map((bet) => {
            const betLabel = getBetLabel(bet);

            return (
              <div
                key={getBetSlipKey(bet)}
                className="flex min-h-[30px] w-full items-center justify-between gap-2 rounded-lg border border-[#d6a84f]/14 bg-[linear-gradient(135deg,rgba(42,18,9,0.78),rgba(9,2,2,0.86))] px-2 py-1"
              >
                <div className="flex min-w-0 items-center gap-1.5">
                  <span className="shrink-0 rounded-full border border-[#ffd77a]/28 bg-[#d6a84f]/12 px-1.5 py-0.5 text-[7px] font-black text-[#ffd77a]">
                    {getBetModeLabel(bet)}
                  </span>

                  <span className="min-w-0 truncate text-[9px] font-black text-[#fff3d0]">
                    {betLabel}
                  </span>
                </div>

                <span className="shrink-0 rounded-full border border-[#fff3d0]/40 bg-[linear-gradient(135deg,#ffd77a,#d6a84f,#8f6422)] px-2 py-0.5 text-[9px] font-black tabular-nums text-black shadow-[0_0_10px_rgba(255,215,122,0.16)]">
                  {formatMMK(bet.amount)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`rounded-xl border border-[#d6a84f]/20 bg-[linear-gradient(145deg,rgba(9,2,2,0.58),rgba(42,18,9,0.52),rgba(75,8,8,0.34))] p-2 shadow-inner shadow-black/55 ${className}`}
    >
      <div className="mb-1.5 flex items-center justify-between gap-2 px-1">
        <span className="text-[8px] font-black tracking-[0.16em] text-[#f7dfaa]/48">
          လောင်းထားသော ပမာဏ
        </span>

        <span className="rounded-full border border-[#ffd77a]/24 bg-black/36 px-2 py-0.5 text-[8px] font-black tabular-nums text-[#ffd77a]">
          စုစုပေါင်း {formatMMK(totalBetAmount)}
        </span>
      </div>

      <div className="max-h-[72px] space-y-1 overflow-y-auto pr-1">
        {activeBets.map((bet) => {
          const betLabel = getBetLabel(bet);

          return (
            <div
              key={getBetSlipKey(bet)}
              className="flex min-h-[32px] w-full items-center justify-between gap-2 rounded-lg border border-[#d6a84f]/14 bg-[linear-gradient(135deg,rgba(42,18,9,0.72),rgba(9,2,2,0.88))] px-2 py-1 shadow-[inset_0_1px_0_rgba(255,215,122,0.05)]"
            >
              <div className="flex min-w-0 items-center gap-1.5">
                <span className="shrink-0 rounded-full border border-[#ffd77a]/28 bg-[#d6a84f]/12 px-1.5 py-0.5 text-[7px] font-black text-[#ffd77a]">
                  {getBetModeLabel(bet)}
                </span>

                <span className="min-w-0 max-w-[150px] truncate text-[10px] font-black text-[#fff3d0]">
                  {betLabel}
                </span>
              </div>

              <span className="shrink-0 rounded-full border border-[#fff3d0]/42 bg-[linear-gradient(135deg,#fff3d0,#ffd77a,#d6a84f,#8f6422)] px-2 py-0.5 text-[10px] font-black tabular-nums text-black shadow-[0_0_10px_rgba(255,215,122,0.16)]">
                {formatMMK(bet.amount)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}