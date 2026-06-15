// src/components/games/six-animal/SixAnimalBettingSheet.tsx

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
  onInvalidBetClick?: () => void;
};

const QUICK_AMOUNTS = [1000, 2000, 5000, 10000, 15000, 20000] as const;
const BETTING_BOARD_FRAME = naganiAssets.sixAnimal.ui.bettingBoardFrame;

function formatMMK(amount: number) {
  return new Intl.NumberFormat("en-US").format(amount);
}

function getBetCommandLabel(betMode: BetMode) {
  return betMode === "pair" ? "ကြိုး ထိုးပါ" : "မောင်း ထိုးပါ";
}

function getBetCommandHint(
  betMode: BetMode,
  selectedAnimal: SixAnimalKey | null,
  selectedPairAnimals: SixAnimalKey[]
) {
  if (betMode === "pair") {
    if (selectedPairAnimals.length === 0) return "အကောင် ၂ ကောင် ရွေးပါ";
    if (selectedPairAnimals.length === 1) return "နောက် ၁ ကောင် ရွေးပါ";
    return "ရွေးထားသော ကြိုး";
  }

  if (!selectedAnimal) return "အကောင် ၁ ကောင် ရွေးပါ";

  return "ရွေးထားသော မောင်း";
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
  onInvalidBetClick,
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
        className={`pointer-events-auto relative w-full max-w-[342px] overflow-hidden rounded-[1.65rem] border border-amber-300/18 bg-[linear-gradient(145deg,rgba(31,6,3,0.98),rgba(8,1,1,0.99),rgba(43,9,4,0.97))] shadow-2xl shadow-black/85 backdrop-blur-2xl transition-transform duration-500 ease-out ${
          hasEntered ? "scale-100" : "scale-[0.985]"
        }`}
      >
        <img
          src={BETTING_BOARD_FRAME}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-[50%] z-0 h-[128%] w-[154%] max-w-none -translate-x-1/2 -translate-y-1/2 object-fill opacity-[0.98] brightness-[1.06] saturate-[1.12]"
        />

        <div className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(180deg,rgba(8,1,1,0.04),rgba(8,1,1,0.28))]" />
        <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_50%_0%,rgba(251,191,36,0.18),transparent_55%)]" />
        <div className="pointer-events-none absolute inset-x-10 top-0 z-0 h-px bg-gradient-to-r from-transparent via-amber-200/80 to-transparent" />

        <div className="relative z-10 px-3 pb-3 pt-3">
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
                  className={`relative min-h-[68px] overflow-hidden rounded-[0.95rem] border shadow-lg transition-all duration-200 active:scale-[0.965] ${
                    isHighlighted
                      ? "scale-[1.015] border-amber-100/90 bg-[linear-gradient(145deg,rgba(129,37,10,0.98),rgba(59,10,6,0.99),rgba(16,2,2,0.99))] shadow-[0_0_24px_rgba(251,191,36,0.22)]"
                      : "border-amber-300/16 bg-[linear-gradient(145deg,rgba(37,7,4,0.99),rgba(18,2,2,0.99),rgba(10,1,1,0.99))] hover:border-amber-300/34"
                  } ${
                    !canEditBet && !isHighlighted ? "opacity-45" : ""
                  } disabled:cursor-not-allowed disabled:opacity-100`}
                  aria-label={`${animal.name} ${animal.nameMm}`}
                >
                  <div
                    className={`pointer-events-none absolute inset-0 ${
                      isHighlighted
                        ? "bg-[radial-gradient(circle_at_50%_18%,rgba(251,191,36,0.28),rgba(74,15,7,0.3)_52%,transparent_74%)]"
                        : "bg-[radial-gradient(circle_at_50%_18%,rgba(251,191,36,0.1),rgba(18,2,2,0.3)_58%,transparent_76%)]"
                    }`}
                  />

                  <div className="pointer-events-none absolute inset-x-3 top-1 h-px bg-gradient-to-r from-transparent via-amber-100/40 to-transparent" />

                  {isHighlighted ? (
                    <>
                      <div className="pointer-events-none absolute inset-x-4 bottom-2 h-[3px] rounded-full bg-gradient-to-r from-transparent via-amber-200 to-transparent shadow-[0_0_12px_rgba(251,191,36,0.46)]" />
                      <div className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full border border-amber-100/85 bg-amber-300 shadow-[0_0_14px_rgba(251,191,36,0.55)]" />
                    </>
                  ) : null}

                  {activeAnimalBet || isPairBetAnimal ? (
                    <div className="absolute left-1.5 top-1.5 rounded-full border border-amber-100/35 bg-black/60 px-1.5 py-0.5 text-[8px] font-black text-amber-100 shadow-lg shadow-black/40">
                      {activeAnimalBet ? formatMMK(activeAnimalBet.amount) : "ကြိုး"}
                    </div>
                  ) : null}

                  <div className="relative z-10 flex min-h-[68px] flex-col items-center justify-center pb-1 pt-1.5">
                    <img
                      src={animalAssets[animal.key]}
                      alt={animal.name}
                      className={`h-[42px] w-[42px] object-contain drop-shadow-[0_0_14px_rgba(251,191,36,0.44)] transition-transform duration-200 ${
                        isHighlighted ? "scale-110" : "scale-100"
                      }`}
                    />

                    <p className="mt-0.5 text-[10px] font-black leading-none text-amber-50 drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]">
                      {animal.nameMm}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="my-2 flex items-center gap-2 px-1">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-300/55 to-amber-100/10" />
            <div className="h-1.5 w-1.5 rotate-45 border border-amber-200/55 bg-amber-300/25" />
            <div className="h-px flex-1 bg-gradient-to-l from-transparent via-amber-300/55 to-amber-100/10" />
          </div>

<div className="rounded-[1.15rem] border border-amber-300/20 bg-[linear-gradient(135deg,rgba(18,2,2,0.98),rgba(44,8,4,0.97))] p-2 shadow-inner shadow-black/50">
  <div className="grid grid-cols-2 gap-2">
    <button
      type="button"
      disabled={!canEditBet}
      onClick={() => onBetModeChange("single")}
      className={`min-h-[42px] rounded-xl border px-2 py-2 text-center transition active:scale-[0.96] ${
        betMode === "single"
          ? "border-amber-100/70 bg-[linear-gradient(135deg,#facc15,#d6a937,#8a5b12)] text-black shadow-[0_0_14px_rgba(251,191,36,0.18)]"
          : "border-amber-300/18 bg-black/38 text-amber-100"
      } disabled:opacity-35`}
    >
      <p className="text-[12px] font-black leading-none">မောင်း</p>
      <p className="mt-1 text-[8px] font-black leading-none opacity-65">
        ၁ ဆ မှ ၃ ဆ
      </p>
    </button>

    <button
      type="button"
      disabled={!canEditBet}
      onClick={() => onBetModeChange("pair")}
      className={`min-h-[42px] rounded-xl border px-2 py-2 text-center transition active:scale-[0.96] ${
        betMode === "pair"
          ? "border-amber-100/70 bg-[linear-gradient(135deg,#facc15,#d6a937,#8a5b12)] text-black shadow-[0_0_14px_rgba(251,191,36,0.18)]"
          : "border-amber-300/18 bg-black/38 text-amber-100"
      } disabled:opacity-35`}
    >
      <p className="text-[12px] font-black leading-none">ကြိုး</p>
      <p className="mt-1 text-[8px] font-black leading-none opacity-65">
        ၅ ဆ
      </p>
    </button>
  </div>

  <div className="mt-2 rounded-xl border border-amber-300/16 bg-black/38 px-3 py-2 text-center shadow-inner shadow-black/40">
    <p className="text-[8px] font-black uppercase tracking-[0.2em] text-amber-200/45">
      လောင်းကြေး
    </p>
    <p className="mt-1 text-[20px] font-black leading-none text-amber-100">
      {formatMMK(numericBetAmount)}
    </p>
    <p className="mt-1 text-[8px] font-black uppercase tracking-[0.16em] text-white/42">
      {betMode === "pair" ? "ကြိုး" : "မောင်း"} ·{" "}
      {getBetCommandHint(betMode, selectedAnimal, selectedPairAnimals)}
    </p>
  </div>

  <div className="mt-2 grid grid-cols-[52px_1fr_52px] items-stretch gap-2">
    <button
      type="button"
      disabled={!canEditBet}
      onClick={onDecreaseAmount}
      className="flex min-h-[50px] flex-col items-center justify-center rounded-xl border border-amber-300/20 bg-black/45 text-amber-100 shadow-inner shadow-black/45 transition-all duration-150 active:scale-[0.93] active:bg-amber-300/18 disabled:opacity-35"
      aria-label="Decrease bet amount"
    >
      <span className="text-2xl font-black leading-none">−</span>
      <span className="mt-1 text-[8px] font-black leading-none text-amber-100/65">
        လျှော့
      </span>
    </button>

    <button
      type="button"
      disabled={!canEditBet}
      onClick={() => {
        if (canPlaceBet) {
          onPlaceBet();
          return;
        }

        const hasSelectedBetTarget =
          betMode === "pair"
            ? selectedPairAnimals.length === 2
            : Boolean(selectedAnimal);

        if (!hasSelectedBetTarget) {
          onInvalidBetClick?.();
        }
      }}
      className={`min-h-[50px] rounded-xl border px-2 py-2 text-center shadow-inner shadow-black/50 transition-all duration-150 active:scale-[0.95] ${
        canPlaceBet
          ? "border-amber-100/75 bg-[linear-gradient(135deg,#facc15,#d6a937,#8a5b12)] text-black shadow-[0_0_18px_rgba(251,191,36,0.24)]"
          : "border-amber-300/20 bg-[linear-gradient(145deg,rgba(18,2,2,0.99),rgba(34,6,4,0.97))] text-amber-100/48"
      } disabled:cursor-not-allowed disabled:opacity-35`}
      aria-label="Place bet"
    >
      <p className="text-[16px] font-black leading-none">ထိုးပါ</p>
    </button>

    <button
      type="button"
      disabled={!canEditBet}
      onClick={onIncreaseAmount}
      className="flex min-h-[50px] flex-col items-center justify-center rounded-xl border border-amber-300/20 bg-black/45 text-amber-100 shadow-inner shadow-black/45 transition-all duration-150 active:scale-[0.93] active:bg-amber-300/18 disabled:opacity-35"
      aria-label="Increase bet amount"
    >
      <span className="text-2xl font-black leading-none">+</span>
      <span className="mt-1 text-[8px] font-black leading-none text-amber-100/65">
        တိုး
      </span>
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
          className={`min-h-[34px] rounded-lg border px-2 py-1.5 text-[11px] font-black shadow-inner shadow-black/35 transition-all duration-150 active:scale-[0.94] ${
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

  <ActiveBetsSummaryPanel activeBets={activeBets} className="mt-2" />
</div>
        </div>
      </div>
    </div>
  );
}