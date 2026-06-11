//src>/components/games/six-animal/SixAnimalBettingSheet.tsx

"use client";

import { useEffect, useMemo, useState } from "react";
import ActiveBetsSummaryPanel from "./ActiveBetsSummaryPanel";

import { SIX_ANIMAL_OPTIONS } from "@/lib/gameRules";
import { naganiAssets } from "@/lib/naganiAssets";
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

type SixAnimalBettingSheetProps = {
  isOpen: boolean;
  betMode: BetMode;
  selectedAnimal: SixAnimalKey | null;
  selectedPairAnimals: SixAnimalKey[];
  activeBets: ActiveBet[];
  canEditBet: boolean;
  canPlaceBet: boolean;
  numericBetAmount: number;
  animalAssets: Record<SixAnimalKey, string>;
  onBetModeChange: (mode: BetMode) => void;
  onSelectAnimal: (animal: SixAnimalKey) => void;
  onQuickAmountSelect: (amount: number) => void;
  onIncreaseAmount: () => void;
  onDecreaseAmount: () => void;
  onPlaceBet: () => void;
};

const QUICK_AMOUNTS = [1000, 2000, 5000, 10000, 15000, 20000] as const;
const BETTING_BOARD_FRAME = naganiAssets.sixAnimal.ui.bettingBoardFrame;

function formatMMK(amount: number) {
  return new Intl.NumberFormat("en-US").format(amount);
}

export default function SixAnimalBettingSheet({
  isOpen,
  betMode,
  selectedAnimal,
  selectedPairAnimals,
  activeBets,
  canEditBet,
  canPlaceBet,
  numericBetAmount,
  animalAssets,
  onBetModeChange,
  onSelectAnimal,
  onQuickAmountSelect,
  onIncreaseAmount,
  onDecreaseAmount,
  onPlaceBet,
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

const singleBetMap = useMemo(() => {
  return new Map(
    activeBets
      .filter((bet) => bet.betType === "single")
      .map((bet) => [bet.animalKey, bet])
  );
}, [activeBets]);

const pairBetAnimals = useMemo(() => {
  return new Set(
    activeBets.flatMap((bet) =>
      bet.betType === "pair" && bet.animalKey2
        ? [bet.animalKey, bet.animalKey2]
        : []
    )
  );
}, [activeBets]);

  if (!isOpen) return null;

  return (
    <div
      className={`pointer-events-none absolute inset-x-0 top-2 z-50 flex justify-center px-2 transition-[opacity,transform] duration-500 ease-out sm:px-4 ${
        hasEntered ? "translate-y-0 opacity-100" : "-translate-y-3 opacity-0"
      }`}
    >
      <div
        className={`pointer-events-auto relative w-full max-w-[386px] overflow-hidden rounded-[1.55rem] border border-amber-300/12 bg-[linear-gradient(145deg,rgba(28,5,3,0.98),rgba(8,1,1,0.98),rgba(38,8,4,0.96))] shadow-2xl shadow-black/85 backdrop-blur-2xl transition-transform duration-500 ease-out ${
          hasEntered ? "scale-100" : "scale-[0.985]"
        }`}
      >
        <img
          src={BETTING_BOARD_FRAME}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-[50%] z-0 h-[134%] w-[156%] max-w-none -translate-x-1/2 -translate-y-1/2 object-fill opacity-[0.98] brightness-[1.04] saturate-[1.08]"
        />

        <div className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(180deg,rgba(8,1,1,0.10),rgba(8,1,1,0.20))]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(251,191,36,0.16),transparent_54%)]" />
        <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-amber-200/75 to-transparent" />

        <div className="relative z-10 px-4 pb-4 pt-3">
          <div className="grid grid-cols-3 gap-1.5">
            {SIX_ANIMAL_OPTIONS.map((animal) => {
const activeAnimalBet = singleBetMap.get(animal.key);
const isSelected =
  betMode === "single"
    ? selectedAnimal === animal.key
    : selectedPairAnimals.includes(animal.key);
const isPairBetAnimal = pairBetAnimals.has(animal.key);
const isActiveBet = Boolean(activeAnimalBet) || isPairBetAnimal;
const isHighlighted = isSelected || isActiveBet;

              return (
                <button
                  key={animal.key}
                  type="button"
                  disabled={!canEditBet}
                  onClick={() => onSelectAnimal(animal.key)}
                  className={`relative min-h-[70px] overflow-hidden rounded-[1rem] border shadow-lg transition-all duration-200 active:scale-[0.965] ${
                    isHighlighted
                      ? "scale-[1.015] border-amber-100/90 bg-[linear-gradient(145deg,rgba(118,33,10,0.98),rgba(58,10,6,0.98),rgba(16,2,2,0.98))] shadow-[0_0_22px_rgba(251,191,36,0.2)]"
                      : "border-amber-300/15 bg-[linear-gradient(145deg,rgba(34,6,4,0.98),rgba(18,2,2,0.98),rgba(10,1,1,0.98))] hover:border-amber-300/34"
                  } ${
                    !canEditBet && !isHighlighted ? "opacity-45" : ""
                  } disabled:cursor-not-allowed disabled:opacity-100`}
                  aria-label={animal.name}
                >
                  <div
                    className={`pointer-events-none absolute inset-0 ${
                      isHighlighted
                        ? "bg-[radial-gradient(circle_at_50%_20%,rgba(251,191,36,0.26),rgba(58,10,6,0.24)_52%,transparent_72%)]"
                        : "bg-[radial-gradient(circle_at_50%_20%,rgba(251,191,36,0.08),rgba(18,2,2,0.3)_58%,transparent_74%)]"
                    }`}
                  />

                  <div className="pointer-events-none absolute inset-x-3 top-1 h-px bg-gradient-to-r from-transparent via-amber-100/35 to-transparent" />

                  {isHighlighted ? (
                    <>
                      <div className="pointer-events-none absolute inset-x-4 bottom-2 h-[3px] rounded-full bg-gradient-to-r from-transparent via-amber-200 to-transparent shadow-[0_0_12px_rgba(251,191,36,0.45)]" />
                      <div className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full border border-amber-100/80 bg-amber-300 shadow-[0_0_14px_rgba(251,191,36,0.5)]" />
                    </>
                  ) : null}

{activeAnimalBet || isPairBetAnimal ? (
  <div className="absolute left-1.5 top-1.5 rounded-full border border-amber-100/35 bg-black/58 px-1.5 py-0.5 text-[8px] font-black text-amber-100 shadow-lg shadow-black/40">
    {activeAnimalBet ? formatMMK(activeAnimalBet.amount) : "PAIR"}
  </div>
) : null}

                  <div className="relative z-10 flex h-full items-center justify-center">
                    <img
                      src={animalAssets[animal.key]}
                      alt={animal.name}
                      className={`h-[56px] w-[56px] object-contain drop-shadow-[0_0_16px_rgba(251,191,36,0.45)] transition-transform duration-200 ${
                        isHighlighted ? "scale-110" : "scale-100"
                      }`}
                    />
                  </div>
                </button>
              );
            })}
          </div>

<div className="mt-1.5 rounded-[1.1rem] border border-amber-300/18 bg-[linear-gradient(135deg,rgba(18,2,2,0.98),rgba(40,7,4,0.96))] p-2 shadow-inner shadow-black/50">
  <div className="mb-2 grid grid-cols-2 gap-2">
    <button
      type="button"
      disabled={!canEditBet}
      onClick={() => onBetModeChange("single")}
      className={`rounded-xl border px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] transition active:scale-[0.96] ${
        betMode === "single"
          ? "border-amber-100/65 bg-[linear-gradient(135deg,#facc15,#d6a937,#8a5b12)] text-black"
          : "border-amber-300/18 bg-black/38 text-amber-100"
      } disabled:opacity-35`}
    >
      Single
    </button>

    <button
      type="button"
      disabled={!canEditBet}
      onClick={() => onBetModeChange("pair")}
      className={`rounded-xl border px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] transition active:scale-[0.96] ${
        betMode === "pair"
          ? "border-amber-100/65 bg-[linear-gradient(135deg,#facc15,#d6a937,#8a5b12)] text-black"
          : "border-amber-300/18 bg-black/38 text-amber-100"
      } disabled:opacity-35`}
    >
      Two Animals
    </button>
  </div>

  <div className="grid grid-cols-[52px_1fr_52px] items-center gap-2.5">
              <button
                type="button"
                disabled={!canEditBet}
                onClick={onDecreaseAmount}
                className="h-[46px] rounded-xl border border-amber-300/20 bg-black/45 text-2xl font-black text-amber-100 shadow-inner shadow-black/45 transition-all duration-150 active:scale-[0.93] active:bg-amber-300/18 disabled:opacity-35"
                aria-label="Decrease bet amount"
              >
                −
              </button>

              <button
                type="button"
                disabled={!canPlaceBet}
                onClick={onPlaceBet}
                className={`h-[46px] rounded-xl border px-3 py-1.5 text-center shadow-inner shadow-black/50 transition-all duration-150 active:scale-[0.95] ${
                  canPlaceBet
                    ? "border-amber-100/70 bg-[linear-gradient(135deg,#facc15,#d6a937,#8a5b12)] text-black shadow-[0_0_16px_rgba(251,191,36,0.2)]"
                    : "border-amber-300/20 bg-[linear-gradient(145deg,rgba(18,2,2,0.99),rgba(34,6,4,0.97))] text-amber-100/45"
                } disabled:cursor-not-allowed`}
                aria-label="Place bet"
              >
<p className="text-[8px] font-black uppercase tracking-[0.24em]">
  {betMode === "pair" ? "Bet Pair" : "Bet"}
</p>
                <p className="mt-0.5 text-lg font-black leading-none">
                  {formatMMK(numericBetAmount)}
                </p>
              </button>

              <button
                type="button"
                disabled={!canEditBet}
                onClick={onIncreaseAmount}
                className="h-[46px] rounded-xl border border-amber-300/20 bg-black/45 text-2xl font-black text-amber-100 shadow-inner shadow-black/45 transition-all duration-150 active:scale-[0.93] active:bg-amber-300/18 disabled:opacity-35"
                aria-label="Increase bet amount"
              >
                +
              </button>
            </div>

<div className="mt-2 grid grid-cols-3 gap-1.5">
  {QUICK_AMOUNTS.map((amount) => {
    const isCurrentAmount = numericBetAmount === amount;

    return (
      <button
        key={amount}
        type="button"
        disabled={!canEditBet}
        onClick={() => onQuickAmountSelect(amount)}
        className={`min-h-[38px] rounded-xl border px-2 py-2 text-[12px] font-black shadow-inner shadow-black/35 transition-all duration-150 active:scale-[0.94] ${
          isCurrentAmount
            ? "border-amber-100/70 bg-[linear-gradient(135deg,#facc15,#d6a937,#8a5b12)] text-black shadow-[0_0_14px_rgba(251,191,36,0.16)]"
            : "border-amber-300/18 bg-[linear-gradient(145deg,rgba(28,5,3,0.99),rgba(44,8,4,0.97))] text-amber-100"
        } disabled:opacity-35`}
      >
        {formatMMK(amount)}
      </button>
    );
  })}
</div>

<ActiveBetsSummaryPanel
  activeBets={activeBets}
  className="mt-3"
/>

          </div>
        </div>
      </div>
    </div>
  );
}