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
  settlementExpanded?: boolean;
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
  settlementExpanded = false,
  className = "",
}: ActiveBetsSummaryPanelProps) {
  if (activeBets.length === 0) return null;

  const totalBetAmount = activeBets.reduce(
    (sum, bet) => sum + Number(bet.amount || 0),
    0
  );

  if (compact && settlementExpanded) {
    return (
      <div
        className={`mx-auto w-[292px] max-w-[calc(100vw-64px)] rounded-2xl border border-[#ffd77a]/24 bg-[linear-gradient(135deg,rgba(68,27,9,0.7),rgba(15,5,2,0.82),rgba(85,9,8,0.48))] p-2 shadow-[0_14px_34px_rgba(0,0,0,0.52),inset_0_1px_0_rgba(255,215,122,0.12)] backdrop-blur-md ${className}`}
      >
        <div className="mb-1.5 flex items-center justify-between gap-2 px-1">
          <span className="text-[8px] font-black tracking-[0.16em] text-[#f7dfaa]/52">
            လောင်းထားသော ပမာဏ
          </span>

          <span className="rounded-full border border-[#ffd77a]/26 bg-black/38 px-2 py-0.5 text-[8px] font-black tabular-nums text-[#ffd77a]">
            စုစုပေါင်း {formatMMK(totalBetAmount)}
          </span>
        </div>

        <div className="max-h-[116px] space-y-1 overflow-y-auto overflow-x-hidden pr-1">
          {activeBets.map((bet) => {
            const betLabel = getBetLabel(bet);

            return (
              <div
                key={getBetSlipKey(bet)}
                className="flex min-h-[34px] w-full items-center justify-between gap-2 rounded-xl border border-[#d6a84f]/16 bg-[linear-gradient(135deg,rgba(42,18,9,0.76),rgba(9,2,2,0.9))] px-2.5 py-1 shadow-[inset_0_1px_0_rgba(255,215,122,0.06)]"
              >
                <div className="flex min-w-0 flex-1 items-center gap-1.5">
                  <span className="shrink-0 rounded-full border border-[#ffd77a]/28 bg-[#d6a84f]/12 px-1.5 py-0.5 text-[7px] font-black text-[#ffd77a]">
                    {getBetModeLabel(bet)}
                  </span>

                  <span className="min-w-0 flex-1 truncate text-[10px] font-black text-[#fff3d0]">
                    {betLabel}
                  </span>
                </div>

                <span className="shrink-0 rounded-full border border-[#fff3d0]/45 bg-[linear-gradient(135deg,#fff3d0,#ffd77a,#d6a84f,#8f6422)] px-2.5 py-0.5 text-[10px] font-black tabular-nums text-black shadow-[0_0_12px_rgba(255,215,122,0.18)]">
                  {formatMMK(bet.amount)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (compact) {
    return (
      <div
        className={`mx-auto w-[236px] max-w-[calc(100vw-92px)] rounded-2xl border border-[#ffd77a]/24 bg-[linear-gradient(135deg,rgba(68,27,9,0.62),rgba(15,5,2,0.78),rgba(85,9,8,0.42))] p-1.5 shadow-[0_10px_26px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,215,122,0.12)] backdrop-blur-md ${className}`}
      >
        <div className="max-h-[34px] overflow-y-auto overflow-x-hidden pr-1">
          {activeBets.map((bet) => {
            const betLabel = getBetLabel(bet);

            return (
              <div
                key={getBetSlipKey(bet)}
                className="flex min-h-[32px] w-full items-center justify-between gap-2 rounded-xl border border-[#ffd77a]/18 bg-[linear-gradient(135deg,rgba(42,18,9,0.68),rgba(9,2,2,0.84))] px-3 py-1 shadow-[inset_0_1px_0_rgba(255,215,122,0.08)]"
              >
                <div className="flex min-w-0 flex-1 items-center gap-1.5">
                  <span className="shrink-0 rounded-full border border-[#ffd77a]/28 bg-[#d6a84f]/12 px-1.5 py-0.5 text-[7px] font-black text-[#ffd77a]">
                    {getBetModeLabel(bet)}
                  </span>

                  <span className="min-w-0 flex-1 truncate text-[9px] font-black text-[#fff3d0]">
                    {betLabel}
                  </span>
                </div>

                <span className="shrink-0 rounded-full border border-[#fff3d0]/45 bg-[linear-gradient(135deg,#fff3d0,#ffd77a,#d6a84f,#8f6422)] px-2.5 py-0.5 text-[9px] font-black tabular-nums text-black shadow-[0_0_12px_rgba(255,215,122,0.18)]">
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