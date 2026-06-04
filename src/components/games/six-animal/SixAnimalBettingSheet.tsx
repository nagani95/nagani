// src/components/games/six-animal/SixAnimalBettingSheet.tsx

"use client";

import { SIX_ANIMAL_OPTIONS } from "@/lib/gameRules";
import type { SixAnimalKey, SixAnimalOption } from "@/types/games";

type ActiveBet = {
  animalKey: SixAnimalKey;
  animalNameMm: string;
  amount: number;
  roundNumber: number;
};

type SixAnimalBettingSheetProps = {
  isOpen: boolean;
  betAmount: string;
  selectedAnimal: SixAnimalKey | null;
  selectedOption: SixAnimalOption | undefined;
  activeBet: ActiveBet | null;
  canEditBet: boolean;
  isBetValid: boolean;
  numericBetAmount: number;
  animalAssets: Record<SixAnimalKey, string>;
  onBetAmountChange: (value: string) => void;
  onQuickAmountSelect: (value: string) => void;
  onSelectAnimal: (animal: SixAnimalKey) => void;
  onPlaceBet: () => void;
};

const QUICK_AMOUNTS = ["1000", "5000", "10000", "50000"];

function formatMMK(amount: number) {
  return new Intl.NumberFormat("en-US").format(amount);
}

export default function SixAnimalBettingSheet({
  isOpen,
  betAmount,
  selectedAnimal,
  selectedOption,
  activeBet,
  canEditBet,
  isBetValid,
  numericBetAmount,
  animalAssets,
  onBetAmountChange,
  onQuickAmountSelect,
  onSelectAnimal,
  onPlaceBet,
}: SixAnimalBettingSheetProps) {
  if (!isOpen) return null;

  const displayAnimal =
    activeBet?.animalNameMm ?? selectedOption?.nameMm ?? "Choose";
  const displayAnimalKey = activeBet?.animalKey ?? selectedOption?.key ?? null;
  const displayAmount = activeBet?.amount ?? numericBetAmount;
  const hasSelection = Boolean(activeBet || selectedOption);

  return (
    <div className="pointer-events-none absolute inset-x-0 top-2 z-50 flex justify-center px-2 sm:px-4">
<div className="pointer-events-auto relative w-full max-w-[400px] overflow-hidden rounded-[1.55rem] border border-amber-300/26 bg-[linear-gradient(145deg,rgba(48,7,4,0.95),rgba(8,1,1,0.92),rgba(54,12,5,0.9))] shadow-2xl shadow-black/85 backdrop-blur-2xl">
  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(251,191,36,0.2),transparent_54%)]" />
  <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-amber-200/80 to-transparent" />
  <div className="pointer-events-none absolute inset-x-5 bottom-0 h-px bg-gradient-to-r from-transparent via-red-300/20 to-transparent" />
  <div className="pointer-events-none absolute left-0 top-6 bottom-6 w-px bg-gradient-to-b from-transparent via-amber-200/18 to-transparent" />
  <div className="pointer-events-none absolute right-0 top-6 bottom-6 w-px bg-gradient-to-b from-transparent via-amber-200/18 to-transparent" />

        <div className="relative z-10 max-h-[60vh] overflow-y-auto p-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="grid grid-cols-3 gap-1.5">
            {SIX_ANIMAL_OPTIONS.map((animal) => {
              const isSelected = selectedAnimal === animal.key;
              const isActiveBet = activeBet?.animalKey === animal.key;
              const isHighlighted = isSelected || isActiveBet;

              return (
                <button
                  key={animal.key}
                  type="button"
                  disabled={!canEditBet}
                  onClick={() => onSelectAnimal(animal.key)}
className={`relative min-h-[78px] overflow-hidden rounded-[1.05rem] border p-1.5 text-left shadow-lg transition active:scale-[0.98] ${
  isHighlighted
    ? "scale-[1.02] border-amber-200/95 bg-[linear-gradient(145deg,rgba(251,191,36,0.26),rgba(92,15,12,0.52),rgba(0,0,0,0.72))] shadow-[0_0_18px_rgba(251,191,36,0.16)]"
    : "border-amber-300/14 bg-[linear-gradient(145deg,rgba(70,13,6,0.48),rgba(12,2,2,0.78),rgba(0,0,0,0.84))] hover:border-amber-300/35"
} ${!canEditBet && !isHighlighted ? "opacity-45" : ""} disabled:cursor-not-allowed disabled:opacity-100`}
                >
<div
  className={`pointer-events-none absolute inset-0 ${
    isHighlighted
      ? "bg-[radial-gradient(circle_at_top,rgba(251,191,36,0.34),transparent_66%)]"
      : "bg-[radial-gradient(circle_at_top,rgba(251,191,36,0.12),transparent_65%)]"
  }`}
/>

{isHighlighted ? (
  <div className="pointer-events-none absolute inset-x-3 bottom-1 h-px bg-gradient-to-r from-transparent via-amber-200/55 to-transparent" />
) : null}

{isHighlighted && (
  <div className="absolute right-2 top-2 rounded-full border border-amber-100/50 bg-amber-300 px-2 py-0.5 text-[8px] font-black uppercase tracking-[0.18em] text-black shadow-[0_0_14px_rgba(251,191,36,0.28)]">
    {isActiveBet ? "Locked" : "Pick"}
  </div>
)}

                  <div className="relative z-10 flex h-full flex-col justify-between">
                    <div>
<p
  className={`text-lg font-black leading-none ${
    isHighlighted
      ? "text-white drop-shadow-[0_0_10px_rgba(251,191,36,0.22)]"
      : "text-white/88"
  }`}
>
  {animal.nameMm}
</p>
<p
  className={`mt-1 text-[9px] font-black uppercase tracking-[0.16em] ${
    isHighlighted ? "text-amber-100/75" : "text-amber-200/50"
  }`}
>
  {animal.name}
</p>
                    </div>

                    <img
                      src={animalAssets[animal.key]}
                      alt={animal.name}
                      className="ml-auto h-[46px] w-[46px] object-contain drop-shadow-[0_0_13px_rgba(251,191,36,0.42)]"
                    />
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-2 rounded-[1.2rem] border border-amber-300/18 bg-[linear-gradient(135deg,rgba(8,1,1,0.72),rgba(48,7,4,0.48))] p-2 shadow-inner shadow-black/40">
            <div className="flex items-center justify-between gap-3">
              <label className="min-w-0 flex-1">
                <span className="text-[9px] font-black uppercase tracking-[0.24em] text-amber-200/60">
                  Bet Amount
                </span>

<div className="relative mt-1.5">
  <input
    value={betAmount}
    onChange={(event) => onBetAmountChange(event.target.value)}
    disabled={!canEditBet}
    inputMode="numeric"
    className="w-full rounded-xl border border-amber-300/24 bg-black/70 px-3.5 py-2.5 pr-14 text-base font-black text-amber-100 outline-none transition placeholder:text-white/25 focus:border-amber-200/70 focus:shadow-[0_0_18px_rgba(251,191,36,0.12)] disabled:opacity-50"
    placeholder="1000"
  />
  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-black uppercase tracking-[0.14em] text-amber-200/50">
    MMK
  </span>
</div>
              </label>

<div className="grid w-[112px] grid-cols-[auto_1fr] items-center gap-2 rounded-xl border border-amber-300/20 bg-[linear-gradient(145deg,rgba(251,191,36,0.1),rgba(0,0,0,0.48))] px-2.5 py-2 shadow-inner shadow-black/35">
  <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-amber-300/14 bg-black/35">
    {displayAnimalKey ? (
      <img
        src={animalAssets[displayAnimalKey]}
        alt={displayAnimal}
        className="h-8 w-8 object-contain drop-shadow-[0_0_10px_rgba(251,191,36,0.38)]"
      />
    ) : (
      <span className="text-[10px] font-black text-amber-100/45">?</span>
    )}
  </div>

  <div className="min-w-0">
    <p className="text-[7px] font-black uppercase tracking-[0.16em] text-amber-100/55">
      Selected
    </p>
    <p className="mt-0.5 truncate text-base font-black text-white">
      {displayAnimal}
    </p>
  </div>
</div>
            </div>

            <div className="mt-2 grid grid-cols-4 gap-1.5">
              {QUICK_AMOUNTS.map((amount) => {
                const isCurrentAmount = betAmount === amount;

                return (
                  <button
                    key={amount}
                    type="button"
                    disabled={!canEditBet}
                    onClick={() => onQuickAmountSelect(amount)}
                    className={`rounded-xl border px-1.5 py-2 text-[11px] font-black shadow-inner shadow-black/35 transition active:scale-[0.98] ${
  isCurrentAmount
    ? "border-amber-100/70 bg-[linear-gradient(135deg,#facc15,#d6a937,#8a5b12)] text-black shadow-[0_0_14px_rgba(251,191,36,0.14)]"
    : "border-amber-300/16 bg-[linear-gradient(145deg,rgba(251,191,36,0.08),rgba(0,0,0,0.42))] text-amber-100"
} disabled:opacity-40`}
                  >
                    {formatMMK(Number(amount))}
                  </button>
                );
              })}
            </div>
          </div>

          <div
  className={`mt-2 rounded-[1.15rem] border px-2.5 py-2 shadow-xl shadow-black/40 ${
    activeBet
      ? "border-emerald-300/24 bg-[linear-gradient(135deg,rgba(6,78,59,0.28),rgba(8,1,1,0.82),rgba(76,5,8,0.46))]"
      : isBetValid
        ? "border-amber-200/30 bg-[linear-gradient(135deg,rgba(92,15,12,0.64),rgba(8,1,1,0.78),rgba(76,5,8,0.5))]"
        : "border-amber-300/18 bg-[linear-gradient(135deg,rgba(76,5,8,0.5),rgba(8,1,1,0.82),rgba(76,5,8,0.42))]"
  }`}
>
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[9px] font-black uppercase tracking-[0.24em] text-amber-200/60">
                  {activeBet ? "Active Bet Locked" : "Bet Slip"}
                </p>

                <p className="mt-1 truncate text-lg font-black text-white">
                  {hasSelection ? displayAnimal : "Select animal"}
                  <span className="text-amber-200/70">
                    {" "}
                    ·{" "}
                    {displayAmount > 0
                      ? `${formatMMK(displayAmount)} MMK`
                      : "Amount"}
                  </span>
                </p>

                <p className="mt-0.5 text-[9px] font-bold leading-relaxed text-amber-100/55">
                  {activeBet
                    ? `Round ${activeBet.roundNumber} confirmed. Wait for the dice result.`
                    : isBetValid
                      ? "Ready. Confirm before betting closes."
                      : "Choose one animal and enter a valid amount."}
                </p>
              </div>

              {activeBet && (
                <div className="shrink-0 rounded-full border border-emerald-300/25 bg-emerald-400/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-emerald-100">
                  Locked
                </div>
              )}
            </div>

            <button
              type="button"
              disabled={!isBetValid || Boolean(activeBet)}
              onClick={onPlaceBet}
              className="mt-2 w-full rounded-xl border border-amber-100/50 bg-[linear-gradient(135deg,#facc15,#d6a937,#8a5b12)] px-4 py-2.5 text-sm font-black uppercase tracking-[0.14em] text-black shadow-xl shadow-amber-950/40 transition active:scale-[0.99] disabled:cursor-not-allowed disabled:border-white/10 disabled:bg-white/10 disabled:text-white/35 disabled:shadow-none"
            >
              {activeBet ? "Bet Locked" : "Place Bet"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}