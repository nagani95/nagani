// src/components/games/six-animal/SixAnimalBettingSheet.tsx

"use client";

import { useEffect, useState } from "react";

import { SIX_ANIMAL_OPTIONS } from "@/lib/gameRules";
import type { SixAnimalKey } from "@/types/games";

type ActiveBet = {
  animalKey: SixAnimalKey;
  animalNameMm: string;
  amount: number;
  roundNumber: number;
};

type SixAnimalBettingSheetProps = {
  isOpen: boolean;
  selectedAnimal: SixAnimalKey | null;
  activeBet: ActiveBet | null;
  canEditBet: boolean;
  numericBetAmount: number;
  animalAssets: Record<SixAnimalKey, string>;
  onSelectAnimal: (animal: SixAnimalKey) => void;
  onQuickAmountSelect: (amount: number) => void;
  onIncreaseAmount: () => void;
  onDecreaseAmount: () => void;
};
const QUICK_AMOUNTS = [1000, 2000, 5000, 10000, 15000, 20000] as const;

function formatMMK(amount: number) {
  return new Intl.NumberFormat("en-US").format(amount);
}

export default function SixAnimalBettingSheet({
  isOpen,
  selectedAnimal,
  activeBet,
  canEditBet,
  numericBetAmount,
  animalAssets,
  onSelectAnimal,
  onQuickAmountSelect,
  onIncreaseAmount,
  onDecreaseAmount,
}: SixAnimalBettingSheetProps) {
  const [hasEntered, setHasEntered] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setHasEntered(false);
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      setHasEntered(true);
    });

    return () => window.cancelAnimationFrame(frame);
  }, [isOpen]);

  if (!isOpen) return null;

const displayAmount = activeBet?.amount ?? numericBetAmount;

  return (
    <div
      className={`pointer-events-none absolute inset-x-0 top-2 z-50 flex justify-center px-2 transition-[opacity,transform] duration-500 ease-out sm:px-4 ${
        hasEntered ? "translate-y-0 opacity-100" : "-translate-y-3 opacity-0"
      }`}
    >
      <div
        className={`pointer-events-auto relative w-full max-w-[386px] overflow-hidden rounded-[1.55rem] border border-amber-300/22 bg-[linear-gradient(145deg,rgba(42,6,4,0.94),rgba(8,1,1,0.92),rgba(38,8,4,0.9))] shadow-2xl shadow-black/85 backdrop-blur-2xl transition-transform duration-500 ease-out ${
          hasEntered ? "scale-100" : "scale-[0.985]"
        }`}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(251,191,36,0.16),transparent_54%)]" />
        <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-amber-200/75 to-transparent" />

        <div className="relative z-10 max-h-[54vh] overflow-y-auto p-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
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
                  className={`relative min-h-[84px] overflow-hidden rounded-[1.05rem] border shadow-lg transition-all duration-200 active:scale-[0.965] ${
                    isHighlighted
                      ? "scale-[1.015] border-amber-100/90 bg-[linear-gradient(145deg,rgba(251,191,36,0.24),rgba(92,15,12,0.46),rgba(0,0,0,0.74))] shadow-[0_0_22px_rgba(251,191,36,0.2)]"
                      : "border-amber-300/13 bg-[linear-gradient(145deg,rgba(52,10,5,0.42),rgba(10,1,1,0.78),rgba(0,0,0,0.84))] hover:border-amber-300/34"
                  } ${
                    !canEditBet && !isHighlighted ? "opacity-45" : ""
                  } disabled:cursor-not-allowed disabled:opacity-100`}
                  aria-label={animal.name}
                >
                  <div
                    className={`pointer-events-none absolute inset-0 ${
                      isHighlighted
                        ? "bg-[radial-gradient(circle_at_50%_20%,rgba(251,191,36,0.32),transparent_68%)]"
                        : "bg-[radial-gradient(circle_at_50%_20%,rgba(251,191,36,0.09),transparent_66%)]"
                    }`}
                  />

                  <div className="pointer-events-none absolute inset-x-3 top-1 h-px bg-gradient-to-r from-transparent via-amber-100/35 to-transparent" />

                  {isHighlighted ? (
                    <>
                      <div className="pointer-events-none absolute inset-x-4 bottom-2 h-[3px] rounded-full bg-gradient-to-r from-transparent via-amber-200 to-transparent shadow-[0_0_12px_rgba(251,191,36,0.45)]" />
                      <div className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full border border-amber-100/80 bg-amber-300 shadow-[0_0_14px_rgba(251,191,36,0.5)]" />
                    </>
                  ) : null}

                  <div className="relative z-10 flex h-full items-center justify-center">
                    <img
                      src={animalAssets[animal.key]}
                      alt={animal.name}
                      className={`h-[62px] w-[62px] object-contain drop-shadow-[0_0_16px_rgba(251,191,36,0.45)] transition-transform duration-200 ${
                        isHighlighted ? "scale-110" : "scale-100"
                      }`}
                    />
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-2 rounded-[1.15rem] border border-amber-300/16 bg-[linear-gradient(135deg,rgba(8,1,1,0.74),rgba(45,7,4,0.46))] p-2.5 shadow-inner shadow-black/45">
            <div className="grid grid-cols-[52px_1fr_52px] items-center gap-2.5">
              <button
                type="button"
                disabled={!canEditBet}
                onClick={onDecreaseAmount}
                className="h-[52px] rounded-xl border border-amber-300/20 bg-black/45 text-2xl font-black text-amber-100 shadow-inner shadow-black/45 transition-all duration-150 active:scale-[0.93] active:bg-amber-300/18 disabled:opacity-35"
                aria-label="Decrease bet amount"
              >
                −
              </button>

              <div className="rounded-xl border border-amber-300/20 bg-black/58 px-3 py-2 text-center shadow-inner shadow-black/45">
                <p className="text-[8px] font-black uppercase tracking-[0.24em] text-amber-200/45">
                  MMK
                </p>
                <p className="mt-0.5 text-xl font-black text-amber-100">
                  {formatMMK(displayAmount)}
                </p>
              </div>

              <button
                type="button"
                disabled={!canEditBet}
                onClick={onIncreaseAmount}
                className="h-12 rounded-xl border border-amber-300/18 bg-black/42 text-2xl font-black text-amber-100 shadow-inner shadow-black/45 transition-all duration-150 active:scale-[0.94] active:bg-amber-300/15 disabled:opacity-35"
                aria-label="Increase bet amount"
              >
                +
              </button>
            </div>

            <div className="mt-2.5 grid grid-cols-3 gap-2">
              {QUICK_AMOUNTS.map((amount) => {
                const isCurrentAmount = displayAmount === amount;

                return (
                  <button
                    key={amount}
                    type="button"
                    disabled={!canEditBet}
                    onClick={() => onQuickAmountSelect(amount)}
                    className={`min-h-[44px] rounded-xl border px-2 py-2.5 text-[13px] font-black shadow-inner shadow-black/35 transition-all duration-150 active:scale-[0.94] ${
                      isCurrentAmount
                        ? "border-amber-100/70 bg-[linear-gradient(135deg,#facc15,#d6a937,#8a5b12)] text-black shadow-[0_0_14px_rgba(251,191,36,0.16)]"
                        : "border-amber-300/16 bg-[linear-gradient(145deg,rgba(251,191,36,0.08),rgba(0,0,0,0.42))] text-amber-100"
                    } disabled:opacity-35`}
                  >
                    {formatMMK(amount)}
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}