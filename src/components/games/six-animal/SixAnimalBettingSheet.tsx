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
  isUrgentCountdown?: boolean;
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

export default function SixAnimalBettingSheet({
    isOpen,
  isUrgentCountdown = false,
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
        .map((bet) => [bet.animalKey, bet]),
    );
  }, [activeBets]);

  const pairBetMap = useMemo(() => {
    const nextPairBetMap = new Map<SixAnimalKey, ActiveBet>();

    activeBets.forEach((bet) => {
      if (bet.betType !== "pair" || !bet.animalKey2) return;

      nextPairBetMap.set(bet.animalKey, bet);
      nextPairBetMap.set(bet.animalKey2, bet);
    });

    return nextPairBetMap;
  }, [activeBets]);

  if (!isOpen) return null;

  return (
    <div
      className={`pointer-events-none absolute inset-x-0 top-2 z-50 flex justify-center px-2 transition-[opacity,transform] duration-500 ease-out sm:px-4 ${
        hasEntered ? "translate-y-0 opacity-100" : "-translate-y-3 opacity-0"
      }`}
    >
      <div
        className={`pointer-events-auto relative w-full max-w-[348px] overflow-hidden rounded-[1.75rem] border border-[#d6a84f]/24 bg-[linear-gradient(145deg,rgba(75,8,8,0.96),rgba(9,2,2,0.99),rgba(42,18,9,0.96))] shadow-2xl shadow-black/85 backdrop-blur-2xl transition-transform duration-500 ease-out ${
          hasEntered ? "scale-100" : "scale-[0.985]"
        }`}
      >
        <img
          src={BETTING_BOARD_FRAME}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-[50%] z-0 h-[130%] w-[156%] max-w-none -translate-x-1/2 -translate-y-1/2 object-fill opacity-[0.92] brightness-[1.04] saturate-[1.08]"
        />

        <div className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(180deg,rgba(9,2,2,0.05),rgba(9,2,2,0.34))]" />
        <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,215,122,0.18),transparent_55%)]" />
        <div className="pointer-events-none absolute inset-x-10 top-0 z-0 h-px bg-gradient-to-r from-transparent via-[#ffd77a]/80 to-transparent" />

        <div className="relative z-10 px-3 pb-3 pt-3">
          <div className="grid grid-cols-3 gap-1.5">
            {SIX_ANIMAL_OPTIONS.map((animal) => {
              const activeAnimalBet = singleBetMap.get(animal.key);
              const activePairBet = pairBetMap.get(animal.key);
              const activeCardBet = activeAnimalBet ?? activePairBet;

              const isSelected =
                betMode === "single"
                  ? selectedAnimal === animal.key
                  : selectedPairAnimals.includes(animal.key);

              const isActiveBet = Boolean(activeCardBet);
              const isHighlighted = isSelected || isActiveBet;
              const activeCardBetTypeLabel = activeAnimalBet
                ? "မောင်း"
                : activePairBet
                  ? "ကြိုး"
                  : "";

              return (
                <button
                  key={animal.key}
                  type="button"
                  disabled={!canEditBet}
                  onClick={() => onSelectAnimal(animal.key)}
                  className={`relative min-h-[72px] overflow-hidden rounded-[1rem] border shadow-lg transition-all duration-200 active:scale-[0.965] ${
                    isHighlighted
                      ? "scale-[1.015] border-[#ffd77a]/90 bg-[linear-gradient(145deg,rgba(127,17,17,0.98),rgba(75,8,8,0.99),rgba(16,2,2,0.99))] shadow-[0_0_24px_rgba(255,215,122,0.22)]"
                      : "border-[#d6a84f]/16 bg-[linear-gradient(145deg,rgba(42,18,9,0.98),rgba(18,2,2,0.99),rgba(10,1,1,0.99))] hover:border-[#d6a84f]/34"
                  } ${
                    isUrgentCountdown
                      ? isHighlighted
                        ? "animate-[naganiUrgentAnimalStrong_0.92s_ease-in-out_infinite]"
                        : "animate-[naganiUrgentAnimalSoft_1.08s_ease-in-out_infinite]"
                      : ""
                  } ${
                    !canEditBet && !isHighlighted ? "opacity-45" : ""
                  } disabled:cursor-not-allowed disabled:opacity-100`}
                  aria-label={animal.nameMm}
                >
                  <div
                    className={`pointer-events-none absolute inset-0 ${
                      isHighlighted
                        ? "bg-[radial-gradient(circle_at_50%_18%,rgba(255,215,122,0.3),rgba(75,8,8,0.3)_52%,transparent_74%)]"
                        : "bg-[radial-gradient(circle_at_50%_18%,rgba(214,168,79,0.1),rgba(18,2,2,0.3)_58%,transparent_76%)]"
                    }`}
                  />

                  <div className="pointer-events-none absolute inset-x-3 top-1 h-px bg-gradient-to-r from-transparent via-[#fff3d0]/40 to-transparent" />
                  {isUrgentCountdown ? (
                    <div className="pointer-events-none absolute inset-0 animate-[naganiUrgentSpotlight_0.92s_ease-in-out_infinite] bg-[radial-gradient(circle_at_50%_30%,rgba(255,215,122,0.22),transparent_62%)]" />
                  ) : null}

                  {isHighlighted ? (
                    <>
                      <div className="pointer-events-none absolute inset-x-4 bottom-2 h-[3px] rounded-full bg-gradient-to-r from-transparent via-[#ffd77a] to-transparent shadow-[0_0_12px_rgba(255,215,122,0.46)]" />

                      {!activeCardBet ? (
                        <div className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full border border-[#fff3d0]/85 bg-[#ffd77a] shadow-[0_0_14px_rgba(255,215,122,0.55)]" />
                      ) : null}
                    </>
                  ) : null}

                  {activeCardBet ? (
                     <div className={`absolute right-1 top-1 z-20 flex min-w-[50px] -rotate-3 flex-col items-center justify-center rounded-full border border-[#fff3d0]/70 bg-[linear-gradient(135deg,#fff3d0,#ffd77a,#d6a84f,#8f6422)] px-2 py-1 text-black shadow-[0_5px_14px_rgba(0,0,0,0.58),0_0_16px_rgba(255,215,122,0.34)] ${
                      isUrgentCountdown
                        ? "animate-[naganiUrgentCoin_0.82s_ease-in-out_infinite]"
                        : ""
                    }`}>
                      <span className="text-[7px] font-black leading-none opacity-70">
                        {activeCardBetTypeLabel}
                      </span>
                      <span className="mt-0.5 text-[9px] font-black leading-none tabular-nums">
                        {formatMMK(activeCardBet.amount)}
                      </span>
                    </div>
                  ) : null}

                  <div className="relative z-10 flex min-h-[72px] flex-col items-center justify-center pb-1 pt-1.5">
                    <img
                      src={animalAssets[animal.key]}
                      alt={animal.nameMm}
                      className={`h-[44px] w-[44px] object-contain drop-shadow-[0_0_14px_rgba(255,215,122,0.42)] transition-transform duration-200 ${
                        isHighlighted ? "scale-110" : "scale-100"
                      }`}
                    />

                    <p className="mt-0.5 text-[10px] font-black leading-none text-[#fff3d0] drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]">
                      {animal.nameMm}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="my-2.5 flex items-center gap-2 px-1">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#d6a84f]/55 to-[#fff3d0]/10" />
            <div className="h-1.5 w-1.5 rotate-45 border border-[#ffd77a]/55 bg-[#d6a84f]/25" />
            <div className="h-px flex-1 bg-gradient-to-l from-transparent via-[#d6a84f]/55 to-[#fff3d0]/10" />
          </div>

          <div className="rounded-[1.2rem] border border-[#d6a84f]/20 bg-[linear-gradient(135deg,rgba(18,2,2,0.98),rgba(75,8,8,0.82))] p-2.5 shadow-inner shadow-black/50">
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                disabled={!canEditBet}
                onClick={() => onBetModeChange("single")}
                className={`min-h-[44px] rounded-xl border px-2 py-2 text-center transition active:scale-[0.96] ${
                  betMode === "single"
                    ? "border-[#fff3d0]/70 bg-[linear-gradient(135deg,#ffd77a,#d6a84f,#8f6422)] text-black shadow-[0_0_14px_rgba(255,215,122,0.18)]"
                    : "border-[#d6a84f]/18 bg-black/38 text-[#fff3d0]"
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
                className={`min-h-[44px] rounded-xl border px-2 py-2 text-center transition active:scale-[0.96] ${
                  betMode === "pair"
                    ? "border-[#fff3d0]/70 bg-[linear-gradient(135deg,#ffd77a,#d6a84f,#8f6422)] text-black shadow-[0_0_14px_rgba(255,215,122,0.18)]"
                    : "border-[#d6a84f]/18 bg-black/38 text-[#fff3d0]"
                } disabled:opacity-35`}
              >
                <p className="text-[12px] font-black leading-none">ကြိုး</p>
                <p className="mt-1 text-[8px] font-black leading-none opacity-65">
                  ၅ ဆ
                </p>
              </button>
            </div>

            <div className="mt-3 rounded-xl border border-[#d6a84f]/16 bg-black/38 px-3 py-3 text-center shadow-inner shadow-black/40">
              <p className="text-[9px] font-black tracking-[0.18em] text-[#f7dfaa]/50">
                လောင်းကြေး
              </p>
              <p className="mt-1 text-[23px] font-black leading-none text-[#ffd77a]">
                {formatMMK(numericBetAmount)}
              </p>
            </div>

            <div className="mt-3 grid grid-cols-[54px_1fr_54px] items-stretch gap-2">
              <button
                type="button"
                disabled={!canEditBet}
                onClick={onDecreaseAmount}
                className="flex min-h-[52px] flex-col items-center justify-center rounded-xl border border-[#d6a84f]/20 bg-black/45 text-[#fff3d0] shadow-inner shadow-black/45 transition-all duration-150 active:scale-[0.93] active:bg-[#d6a84f]/18 disabled:opacity-35"
                aria-label="လောင်းကြေးလျှော့"
              >
                <span className="text-2xl font-black leading-none">−</span>
                <span className="mt-1 text-[8px] font-black leading-none text-[#fff3d0]/65">
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
                className={`min-h-[52px] rounded-xl border px-2 py-2 text-center shadow-inner shadow-black/50 transition-all duration-150 active:scale-[0.95] ${
                  canPlaceBet
                    ? "border-[#fff3d0]/75 bg-[linear-gradient(135deg,#ffd77a,#d6a84f,#8f6422)] text-black shadow-[0_0_18px_rgba(255,215,122,0.24)]"
                    : "border-[#d6a84f]/20 bg-[linear-gradient(145deg,rgba(18,2,2,0.99),rgba(75,8,8,0.64))] text-[#fff3d0]/48"
                } ${
                  isUrgentCountdown && canPlaceBet
                    ? "animate-[naganiUrgentBetButton_0.82s_ease-in-out_infinite]"
                    : ""
                } disabled:cursor-not-allowed disabled:opacity-35`}
                aria-label="လောင်းကြေးထိုး"
              >
                <p className="text-[16px] font-black leading-none">ထိုးပါ</p>
              </button>

              <button
                type="button"
                disabled={!canEditBet}
                onClick={onIncreaseAmount}
                className="flex min-h-[52px] flex-col items-center justify-center rounded-xl border border-[#d6a84f]/20 bg-black/45 text-[#fff3d0] shadow-inner shadow-black/45 transition-all duration-150 active:scale-[0.93] active:bg-[#d6a84f]/18 disabled:opacity-35"
                aria-label="လောင်းကြေးတိုး"
              >
                <span className="text-2xl font-black leading-none">+</span>
                <span className="mt-1 text-[8px] font-black leading-none text-[#fff3d0]/65">
                  တိုး
                </span>
              </button>
            </div>

            <div className="mt-3 grid grid-cols-3 gap-1.5">
              {QUICK_AMOUNTS.map((amount) => {
                const isCurrentAmount = numericBetAmount === amount;

                return (
                  <button
                    key={amount}
                    type="button"
                    disabled={!canEditBet}
                    onClick={() => onQuickAmountSelect(amount)}
                    className={`min-h-[36px] rounded-full border px-2 py-1.5 text-[11px] font-black shadow-inner shadow-black/35 transition-all duration-150 active:scale-[0.94] ${
                      isCurrentAmount
                        ? "border-[#fff3d0]/75 bg-[linear-gradient(135deg,#fff3d0,#ffd77a,#d6a84f,#8f6422)] text-black shadow-[0_0_16px_rgba(255,215,122,0.22)]"
                        : "border-[#d6a84f]/24 bg-[linear-gradient(145deg,rgba(90,47,24,0.9),rgba(42,18,9,0.98),rgba(75,8,8,0.62))] text-[#fff3d0] hover:border-[#ffd77a]/38"
                    } disabled:opacity-35`}
                  >
                    {formatMMK(amount)}
                  </button>
                );
              })}
            </div>

            <ActiveBetsSummaryPanel activeBets={activeBets} className="mt-3" />
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes naganiUrgentAnimalSoft {
          0%,
          100% {
            box-shadow: 0 10px 18px rgba(0, 0, 0, 0.34);
            transform: scale(1);
          }

          50% {
            box-shadow:
              0 10px 18px rgba(0, 0, 0, 0.34),
              0 0 18px rgba(255, 215, 122, 0.18);
            transform: scale(1.012);
          }
        }

        @keyframes naganiUrgentAnimalStrong {
          0%,
          100% {
            transform: scale(1.015);
            filter: brightness(1);
          }

          50% {
            transform: scale(1.045);
            filter: brightness(1.14);
          }
        }

        @keyframes naganiUrgentSpotlight {
          0%,
          100% {
            opacity: 0.18;
          }

          50% {
            opacity: 0.68;
          }
        }

        @keyframes naganiUrgentCoin {
          0%,
          100% {
            transform: rotate(-3deg) scale(1);
            filter: brightness(1);
          }

          50% {
            transform: rotate(-3deg) scale(1.1);
            filter: brightness(1.15);
          }
        }

        @keyframes naganiUrgentBetButton {
          0%,
          100% {
            transform: scale(1);
            filter: brightness(1);
          }

          50% {
            transform: scale(1.035);
            filter: brightness(1.14);
          }
        }
      `}</style>
    </div>
  );
}