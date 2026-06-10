//src>components/games/six-animal/SettlementPopup.tsx

"use client";

import type { SixAnimalKey } from "@/types/games";

type SettlementBet = {
  betType: "single" | "pair";
  animalKey: SixAnimalKey;
  animalKey2?: SixAnimalKey | null;
  amount: number;
  matchCount: number;
  payout: number;
};

type SettlementPopupProps = {
  settlementBets: SettlementBet[];
  totalBetAmount: number;
  displayPayoutAmount: number;
  netResultLabel: string;
  resultStatusLabel: string;
  isResultWin: boolean;
  animalAssets: Record<SixAnimalKey, string>;
};

function formatMMK(amount: number) {
  return new Intl.NumberFormat("en-US").format(amount);
}

export default function SettlementPopup({
  settlementBets,
  totalBetAmount,
  displayPayoutAmount,
  netResultLabel,
  resultStatusLabel,
  isResultWin,
  animalAssets,
}: SettlementPopupProps) {
const matchedBetCount = settlementBets.filter((bet) =>
  bet.betType === "pair" ? bet.matchCount === 2 : bet.matchCount > 0
).length;

  return (
    <div
      className={`pointer-events-none absolute inset-x-3 top-[60%] z-50 mx-auto max-w-[390px] -translate-y-1/2 overflow-hidden rounded-[1.45rem] border p-2.5 shadow-[0_22px_54px_rgba(0,0,0,0.82),inset_0_1px_0_rgba(251,191,36,0.16),inset_0_-18px_32px_rgba(0,0,0,0.34)] backdrop-blur-xl ${
        isResultWin
          ? "border-emerald-300/28 bg-[linear-gradient(145deg,rgba(6,78,59,0.34),rgba(5,1,1,0.82),rgba(45,7,3,0.66))]"
          : "border-red-300/22 bg-[linear-gradient(145deg,rgba(92,15,12,0.48),rgba(5,1,1,0.84),rgba(45,7,3,0.62))]"
      }`}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(251,191,36,0.12),transparent_64%)]" />
      <div className="pointer-events-none absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-amber-200/55 to-transparent" />
      <div className="pointer-events-none absolute inset-x-6 bottom-0 h-px bg-gradient-to-r from-transparent via-amber-300/25 to-transparent" />
      <div className="pointer-events-none absolute inset-y-4 left-0 w-px bg-gradient-to-b from-transparent via-amber-200/20 to-transparent" />
      <div className="pointer-events-none absolute inset-y-4 right-0 w-px bg-gradient-to-b from-transparent via-amber-200/20 to-transparent" />

      <div className="relative z-10">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[8px] font-black uppercase tracking-[0.22em] text-amber-200/55">
              Settlement
            </p>
            <p className="mt-0.5 truncate text-sm font-black text-white">
              {matchedBetCount > 0
                ? `${matchedBetCount}/${settlementBets.length} animals matched`
                : "No animals matched"}
            </p>
          </div>

          <div
            className={`shrink-0 rounded-full border px-3 py-1 text-[8px] font-black uppercase tracking-[0.14em] ${
              isResultWin
                ? "border-emerald-200/35 bg-emerald-300/18 text-emerald-100"
                : "border-red-200/25 bg-red-500/12 text-red-100"
            }`}
          >
            {resultStatusLabel}
          </div>
        </div>

        <div className="mt-2 grid grid-cols-2 gap-1.5">
          {settlementBets.map((bet) => {
            const isMatched =
  bet.betType === "pair" ? bet.matchCount === 2 : bet.matchCount > 0;

            return (
              <div
                key={
  bet.betType === "pair" && bet.animalKey2
    ? `pair-${bet.animalKey}-${bet.animalKey2}`
    : `single-${bet.animalKey}`
}
                className={`grid grid-cols-[34px_1fr_auto] items-center gap-1.5 rounded-xl border px-2 py-1.5 shadow-inner shadow-black/35 ${
                  isMatched
                    ? "border-emerald-300/24 bg-emerald-400/10"
                    : "border-amber-300/12 bg-black/28"
                }`}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-amber-300/14 bg-black/24">
{bet.betType === "pair" && bet.animalKey2 ? (
  <div className="flex items-center -space-x-2">
    <img
      src={animalAssets[bet.animalKey]}
      alt=""
      className="h-6 w-6 object-contain drop-shadow-[0_0_10px_rgba(251,191,36,0.38)]"
    />
    <img
      src={animalAssets[bet.animalKey2]}
      alt=""
      className="h-6 w-6 object-contain drop-shadow-[0_0_10px_rgba(251,191,36,0.38)]"
    />
  </div>
) : (
  <img
    src={animalAssets[bet.animalKey]}
    alt=""
    className="h-7 w-7 object-contain drop-shadow-[0_0_10px_rgba(251,191,36,0.38)]"
  />
)}
                </div>

                <div className="min-w-0">
                  <p className="truncate text-[10px] font-black text-white">
                    {formatMMK(bet.amount)}
                  </p>
                  <p className="text-[7px] font-black uppercase tracking-[0.12em] text-white/42">
                    Bet
                  </p>
                </div>

                <div
                  className={`rounded-full px-1.5 py-0.5 text-[8px] font-black ${
                    isMatched
                      ? "bg-emerald-300 text-black"
                      : "bg-white/8 text-white/45"
                  }`}
                >
                  {bet.betType === "pair" ? `${bet.matchCount}/2` : `${bet.matchCount}/3`}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-2 grid grid-cols-3 gap-1.5">
          <div className="rounded-xl border border-amber-300/12 bg-black/28 p-2 text-center shadow-inner shadow-black/30">
            <p className="text-[7px] font-black uppercase tracking-[0.15em] text-white/45">
              Total Bet
            </p>
            <p className="mt-1 text-[11px] font-black text-white">
              {formatMMK(totalBetAmount)} MMK
            </p>
          </div>

          <div className="rounded-xl border border-amber-300/12 bg-black/28 p-2 text-center shadow-inner shadow-black/30">
            <p className="text-[7px] font-black uppercase tracking-[0.15em] text-white/45">
              Return
            </p>
            <p className="mt-1 text-[11px] font-black text-amber-100">
              {formatMMK(displayPayoutAmount)} MMK
            </p>
          </div>

          <div
            className={`rounded-xl border p-2 text-center ${
              isResultWin
                ? "border-emerald-300/25 bg-emerald-400/10"
                : "border-red-300/20 bg-red-500/10"
            }`}
          >
            <p className="text-[7px] font-black uppercase tracking-[0.15em] text-white/45">
              Net
            </p>
            <p
              className={`mt-1 text-[11px] font-black ${
                isResultWin ? "text-emerald-100" : "text-red-100"
              }`}
            >
              {netResultLabel}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}