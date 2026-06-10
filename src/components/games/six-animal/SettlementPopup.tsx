//src>components>games>six-animal>SettlementPopup.tsx

"use client";

import type { SixAnimalKey } from "@/types/games";

type SettlementPopupProps = {
  activeBetAnimal: {
    key: SixAnimalKey;
    name: string;
  } | null;
  activeBetDisplayName: string;
  activeBetAmount: number;
  matchCount: number;
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
  activeBetAnimal,
  activeBetDisplayName,
  activeBetAmount,
  matchCount,
  displayPayoutAmount,
  netResultLabel,
  resultStatusLabel,
  isResultWin,
  animalAssets,
}: SettlementPopupProps) {
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
          <div className="flex min-w-0 items-center gap-2">
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border shadow-inner shadow-black/35 ${
                isResultWin
                  ? "border-emerald-300/25 bg-emerald-400/10"
                  : "border-red-300/20 bg-red-500/10"
              }`}
            >
              {activeBetAnimal ? (
                <img
                  src={animalAssets[activeBetAnimal.key]}
                  alt={activeBetAnimal.name}
                  className="h-8 w-8 object-contain drop-shadow-[0_0_12px_rgba(251,191,36,0.45)]"
                />
              ) : (
                <span className="text-xs font-black text-amber-100">
                  {activeBetDisplayName}
                </span>
              )}
            </div>

            <div className="min-w-0">
              <p className="text-[8px] font-black uppercase tracking-[0.22em] text-amber-200/55">
                Settlement
              </p>
              <p className="truncate text-sm font-black text-white">
                {activeBetDisplayName} · Match {matchCount}/3
              </p>
            </div>
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

        <div className="mt-2 grid grid-cols-3 gap-1.5">
          <div className="rounded-xl border border-amber-300/12 bg-black/28 p-2 text-center shadow-inner shadow-black/30">
            <p className="text-[7px] font-black uppercase tracking-[0.15em] text-white/45">
              Bet
            </p>
            <p className="mt-1 text-[11px] font-black text-white">
              {formatMMK(activeBetAmount)} MMK
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