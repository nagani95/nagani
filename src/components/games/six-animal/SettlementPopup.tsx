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

function getSettlementBetKey(bet: SettlementBet) {
  return bet.betType === "pair" && bet.animalKey2
    ? `pair-${[bet.animalKey, bet.animalKey2].sort().join("-")}`
    : `single-${bet.animalKey}`;
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

  const resultLine =
    matchedBetCount > 0
      ? `${matchedBetCount}/${settlementBets.length} tickets matched`
      : "No tickets matched";

  return (
    <div
      className={`pointer-events-none absolute inset-x-3 top-[58%] z-50 mx-auto max-w-[380px] -translate-y-1/2 overflow-hidden rounded-[1.35rem] border p-3 shadow-[0_24px_58px_rgba(0,0,0,0.84),inset_0_1px_0_rgba(251,191,36,0.14)] backdrop-blur-xl ${
        isResultWin
          ? "border-emerald-300/28 bg-[linear-gradient(145deg,rgba(6,78,59,0.38),rgba(5,1,1,0.86),rgba(45,7,3,0.68))]"
          : "border-red-300/22 bg-[linear-gradient(145deg,rgba(92,15,12,0.5),rgba(5,1,1,0.88),rgba(45,7,3,0.64))]"
      }`}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(251,191,36,0.12),transparent_62%)]" />
      <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-amber-200/55 to-transparent" />

      <div className="relative z-10">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[8px] font-black uppercase tracking-[0.24em] text-amber-200/55">
              Settlement Receipt
            </p>
            <p className="mt-1 truncate text-sm font-black text-white">
              {resultLine}
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

        <div className="mt-3 max-h-[150px] space-y-1.5 overflow-y-auto pr-1">
          {settlementBets.map((bet) => {
            const isMatched =
              bet.betType === "pair" ? bet.matchCount === 2 : bet.matchCount > 0;

            const matchLabel =
              bet.betType === "pair"
                ? `${bet.matchCount}/2`
                : `${bet.matchCount}/3`;

            return (
              <div
                key={getSettlementBetKey(bet)}
                className={`grid min-h-[44px] grid-cols-[58px_1fr_auto] items-center gap-2 rounded-xl border px-2 py-1.5 shadow-inner shadow-black/35 ${
                  isMatched
                    ? "border-emerald-300/26 bg-emerald-400/10"
                    : "border-amber-300/12 bg-black/30"
                }`}
              >
<div className="flex h-9 w-[58px] items-center justify-center">
  {bet.betType === "pair" && bet.animalKey2 ? (
    <div className="grid grid-cols-2 gap-1">
      <div className="flex h-8 w-7 items-center justify-center rounded-lg border border-amber-300/14 bg-black/28">
        <img
          src={animalAssets[bet.animalKey]}
          alt=""
          className="h-6 w-6 object-contain drop-shadow-[0_0_10px_rgba(251,191,36,0.38)]"
        />
      </div>

      <div className="flex h-8 w-7 items-center justify-center rounded-lg border border-amber-300/14 bg-black/28">
        <img
          src={animalAssets[bet.animalKey2]}
          alt=""
          className="h-6 w-6 object-contain drop-shadow-[0_0_10px_rgba(251,191,36,0.38)]"
        />
      </div>
    </div>
  ) : (
    <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-amber-300/14 bg-black/28">
      <img
        src={animalAssets[bet.animalKey]}
        alt=""
        className="h-7 w-7 object-contain drop-shadow-[0_0_10px_rgba(251,191,36,0.38)]"
      />
    </div>
  )}
</div>

                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-[11px] font-black text-white">
                      {formatMMK(bet.amount)} MMK
                    </p>

                    <span className="rounded-full border border-white/10 bg-white/[0.06] px-1.5 py-0.5 text-[7px] font-black uppercase tracking-[0.1em] text-white/45">
                      {bet.betType === "pair" ? "Pair" : "Single"}
                    </span>
                  </div>

                  <p className="mt-0.5 text-[8px] font-black uppercase tracking-[0.14em] text-white/42">
                    Return {formatMMK(bet.payout)} MMK
                  </p>
                </div>

                <div
                  className={`rounded-full px-2 py-1 text-[8px] font-black tabular-nums ${
                    isMatched
                      ? "bg-emerald-300 text-black"
                      : "bg-white/8 text-white/45"
                  }`}
                >
                  {matchLabel}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-3 grid grid-cols-3 gap-1.5">
          <div className="rounded-xl border border-amber-300/12 bg-black/30 p-2 text-center shadow-inner shadow-black/30">
            <p className="text-[7px] font-black uppercase tracking-[0.15em] text-white/45">
              Total Bet
            </p>
            <p className="mt-1 text-[11px] font-black text-white">
              {formatMMK(totalBetAmount)} MMK
            </p>
          </div>

          <div className="rounded-xl border border-amber-300/12 bg-black/30 p-2 text-center shadow-inner shadow-black/30">
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