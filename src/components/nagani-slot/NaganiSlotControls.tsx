// src/components/nagani-slot/NaganiSlotControls.tsx

import { useEffect, useState, type RefObject } from "react";
import type { NaganiSlotGameState } from "@/lib/naganiSlot/types";

type NaganiSlotControlsProps = {
  betAmount: number;
  balance: number;
  gameState: NaganiSlotGameState;
  balancePulse?: boolean;
  lastWinAmount?: number;
  balanceTargetRef?: RefObject<HTMLDivElement | null>;
  onDecrease: () => void;
  onIncrease: () => void;
  onSelectBetAmount: (amount: number) => void;
  onMaxBet: () => void;
  onSpin: () => void;
};

const QUICK_BETS = [
  { amount: 1000, label: "1K" },
  { amount: 3000, label: "3K" },
  { amount: 5000, label: "5K" },
  { amount: 10000, label: "10K" },
];

const MIN_BET = 1000;
const MAX_BET = 50000;
const BET_STEP = 1000;

const CUSTOM_BET_OPTIONS = [
  1000, 2000, 3000, 4000, 5000,
  6000, 7000, 8000, 9000, 10000,
  15000, 20000, 30000, 40000, 50000,
];

function formatMMK(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

function getSpinButtonText(gameState: NaganiSlotGameState) {
  if (gameState === "spinning") return "လှည့်နေသည်";
  if (gameState === "settling") return "ဆုစုနေသည်";
  if (gameState === "result") return "ထပ်လှည့်မည်";
  return "လှည့်မည်";
}

export default function NaganiSlotControls({
  betAmount,
  balance,
  gameState,
  balancePulse = false,
  lastWinAmount = 0,
  balanceTargetRef,
  onDecrease,
  onIncrease,
  onSelectBetAmount,
  onMaxBet,
  onSpin,
}: NaganiSlotControlsProps) {
  const [autoMode, setAutoMode] = useState(false);
const [betPickerOpen, setBetPickerOpen] = useState(false);

  const controlsLocked = gameState === "spinning" || gameState === "settling";
  const readyToSpin = gameState === "ready" || gameState === "result";

  useEffect(() => {
    if (controlsLocked) {
      setBetPickerOpen(false);
    }
  }, [controlsLocked]);
  const showWinCatch = balancePulse && lastWinAmount > 0;

  const playableMaxBet =
    balance >= MIN_BET
      ? Math.floor(Math.min(balance, MAX_BET) / BET_STEP) * BET_STEP
      : MIN_BET;

  const canDecreaseBet = !controlsLocked && betAmount > MIN_BET;
  const canIncreaseBet =
    !controlsLocked &&
    balance >= MIN_BET &&
    betAmount + BET_STEP <= playableMaxBet;
  const canUseMaxBet = !controlsLocked && balance >= MIN_BET;
  const canSpin =
    readyToSpin &&
    !controlsLocked &&
    betAmount >= MIN_BET &&
    balance >= betAmount;

  const quickPresetActive = QUICK_BETS.some(
    (chip) => chip.amount === betAmount
  );
  const betPlaqueLabel = quickPresetActive ? "လောင်းကြေး" : "စိတ်ကြိုက်";

  return (
    <section className="relative z-30 mx-auto mt-5 w-[calc(100%-10px)] max-w-[420px]">
      <style>{`
        @keyframes naganiSlotDockReadyGlow {
          0%, 100% {
            opacity: 0.18;
            transform: translateX(-50%) scaleX(0.82);
          }
          50% {
            opacity: 0.5;
            transform: translateX(-50%) scaleX(1);
          }
        }

        @keyframes naganiSlotDockTopBreath {
          0%, 100% {
            opacity: 0.32;
            transform: scaleX(0.9);
          }
          50% {
            opacity: 0.72;
            transform: scaleX(1);
          }
        }

        @keyframes naganiSlotCoinSheen {
          0% {
            opacity: 0;
            transform: translateX(-130%) skewX(-15deg);
          }
          24% {
            opacity: 0.34;
          }
          100% {
            opacity: 0;
            transform: translateX(130%) skewX(-15deg);
          }
        }

        @keyframes naganiSlotSelectedCoinPulse {
          0%, 100% {
            filter: brightness(1.04);
            box-shadow:
              0 7px 12px rgba(0,0,0,0.44),
              inset 0 1px 0 rgba(255,255,255,0.24),
              inset 0 -8px 12px rgba(70,0,0,0.4),
              0 0 10px rgba(255,218,121,0.18);
          }
          50% {
            filter: brightness(1.14);
            box-shadow:
              0 7px 12px rgba(0,0,0,0.44),
              inset 0 1px 0 rgba(255,255,255,0.3),
              inset 0 -8px 12px rgba(70,0,0,0.4),
              0 0 18px rgba(255,232,163,0.34);
          }
        }

        @keyframes naganiSlotSpinBreathV8 {
          0%, 100% {
            filter: brightness(1);
            transform: translateY(0) scale(1);
            box-shadow:
              0 13px 24px rgba(0,0,0,0.7),
              inset 0 2px 0 rgba(255,255,255,0.58),
              inset 0 -10px 16px rgba(87,0,0,0.5),
              0 0 18px rgba(255,218,121,0.16);
          }
          50% {
            filter: brightness(1.12);
            transform: translateY(-1px) scale(1.006);
            box-shadow:
              0 15px 28px rgba(0,0,0,0.76),
              inset 0 2px 0 rgba(255,255,255,0.66),
              inset 0 -10px 16px rgba(87,0,0,0.5),
              0 0 30px rgba(255,218,121,0.3);
          }
        }

        @keyframes naganiSlotSpinSweepV8 {
          0% {
            transform: translateX(-145%) skewX(-18deg);
            opacity: 0;
          }
          24% {
            opacity: 0.48;
          }
          100% {
            transform: translateX(145%) skewX(-18deg);
            opacity: 0;
          }
        }

        @keyframes naganiSlotAutoPulse {
          0%, 100% {
            opacity: 0.24;
          }
          50% {
            opacity: 0.5;
          }
        }

@keyframes naganiSlotDockBalanceCatch {
  0% {
    transform: scale(1);
    filter: brightness(1);
    box-shadow:
      0 10px 20px rgba(0,0,0,0.6),
      0 0 20px rgba(255,190,74,0.15),
      inset 0 1px 0 rgba(255,240,185,0.25);
  }
  22% {
    transform: scale(1.075);
    filter: brightness(1.42);
    box-shadow:
      0 13px 25px rgba(0,0,0,0.66),
      0 0 32px rgba(255,232,163,0.46),
      0 0 18px rgba(255,180,54,0.34),
      inset 0 1px 0 rgba(255,255,255,0.38),
      inset 0 -10px 18px rgba(95,0,0,0.34);
  }
  58% {
    transform: scale(1.035);
    filter: brightness(1.24);
    box-shadow:
      0 12px 23px rgba(0,0,0,0.64),
      0 0 26px rgba(255,218,121,0.34),
      inset 0 1px 0 rgba(255,240,185,0.3);
  }
  100% {
    transform: scale(1);
    filter: brightness(1.08);
    box-shadow:
      0 10px 20px rgba(0,0,0,0.6),
      0 0 20px rgba(255,190,74,0.15),
      inset 0 1px 0 rgba(255,240,185,0.25);
  }
}

@keyframes naganiSlotDockBalanceLandRing {
  0% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.62);
  }
  24% {
    opacity: 0.82;
  }
  100% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(1.34);
  }
}

@keyframes naganiSlotDockBalanceNumberPop {
  0% {
    transform: scale(1);
    filter: brightness(1);
  }
  30% {
    transform: scale(1.085);
    filter: brightness(1.34);
  }
  100% {
    transform: scale(1);
    filter: brightness(1.06);
  }
}

        @keyframes naganiSlotDockBalanceGlow {
          0%, 100% {
            filter: brightness(1);
          }
          50% {
            filter: brightness(1.14);
          }
        }

        @keyframes naganiSlotDockBalanceSweep {
          0% {
            transform: translateX(-135%) skewX(-18deg);
            opacity: 0;
          }
          26% {
            opacity: 0.5;
          }
          100% {
            transform: translateX(135%) skewX(-18deg);
            opacity: 0;
          }
        }
      `}</style>

      <div className="absolute inset-x-6 -top-[25px] z-40 grid grid-cols-2 gap-2">
        <button
          type="button"
          disabled={controlsLocked}
          onClick={() => setBetPickerOpen(true)}
          className="relative h-[46px] overflow-visible rounded-[19px] border border-[#ffd979]/60 bg-[radial-gradient(circle_at_50%_0%,rgba(255,232,163,0.25),rgba(70,10,5,0.98)_48%,rgba(9,0,0,0.98))] px-3 text-center shadow-[0_10px_20px_rgba(0,0,0,0.6),0_0_20px_rgba(255,190,74,0.13),inset_0_1px_0_rgba(255,240,185,0.25)] transition-transform active:scale-[0.97] disabled:opacity-[0.72]"
          aria-label="Choose bet amount"
        >
          <div className="pointer-events-none absolute inset-x-3 top-0 h-px bg-gradient-to-r from-transparent via-[#fff0b9]/76 to-transparent" />
          <div className="pointer-events-none absolute inset-x-5 bottom-0 h-px bg-gradient-to-r from-transparent via-[#b97823]/48 to-transparent" />

<div className="pointer-events-none absolute left-1/2 top-[-13px] z-10 min-w-[88px] -translate-x-1/2 rounded-full border border-[#ffd979]/54 bg-[linear-gradient(180deg,#84200f,#2b0201)] px-3.5 py-[4px] text-center shadow-[0_5px_10px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,232,163,0.2)]">
  <p
    className={`whitespace-nowrap text-[11px] font-black leading-none tracking-[0.02em] drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] ${
      quickPresetActive ? "text-[#ffd979]/92" : "text-[#fff0b9]"
    }`}
  >
    {betPlaqueLabel}
  </p>
</div>

          <div className="relative flex h-full items-center justify-center">
            <p className="text-[18px] font-black leading-none text-[#fff1bd] drop-shadow-[0_2px_7px_rgba(0,0,0,0.84)]">
              {formatMMK(betAmount)}
            </p>
          </div>

<span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-[#ffd979]/78 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
  ▼
</span>
        </button>

        <div
          ref={balanceTargetRef}
          className="relative h-[46px] overflow-visible rounded-[19px] border border-[#ffd979]/64 bg-[radial-gradient(circle_at_50%_0%,rgba(255,232,163,0.27),rgba(58,8,4,0.98)_48%,rgba(7,0,0,0.98))] px-3 text-center shadow-[0_10px_20px_rgba(0,0,0,0.6),0_0_20px_rgba(255,190,74,0.15),inset_0_1px_0_rgba(255,240,185,0.25)]"
          style={{
            animation: balancePulse
              ? "naganiSlotDockBalanceCatch 620ms ease-out both"
              : gameState === "settling" || gameState === "result"
                ? "naganiSlotDockBalanceGlow 1050ms ease-in-out infinite"
                : undefined,
          }}
        >
          <div className="pointer-events-none absolute inset-x-3 top-0 h-px bg-gradient-to-r from-transparent via-[#fff0b9]/76 to-transparent" />
          <div className="pointer-events-none absolute inset-x-5 bottom-0 h-px bg-gradient-to-r from-transparent via-[#b97823]/48 to-transparent" />

<div className="absolute left-1/2 top-[-13px] z-10 min-w-[96px] -translate-x-1/2 rounded-full border border-[#ffd979]/54 bg-[linear-gradient(180deg,#84200f,#2b0201)] px-3.5 py-[4px] text-center shadow-[0_5px_10px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,232,163,0.2)]">
  <p
    className={`whitespace-nowrap text-[11px] font-black leading-none tracking-[0.02em] drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] ${
      showWinCatch ? "text-[#fff0b9]" : "text-[#ffd979]/92"
    }`}
  >
    {showWinCatch ? `+${formatMMK(lastWinAmount)}` : "လက်ကျန်ငွေ"}
  </p>
</div>

          {gameState === "settling" || gameState === "result" ? (
            <span
              className="pointer-events-none absolute inset-y-0 left-0 w-[52%] overflow-hidden rounded-[19px] bg-[linear-gradient(90deg,transparent,rgba(255,240,185,0.18),transparent)]"
              style={{
                animation: "naganiSlotDockBalanceSweep 1100ms ease-out infinite",
              }}
            />
          ) : null}

{showWinCatch ? (
  <span
    className="pointer-events-none absolute left-1/2 top-1/2 h-[62px] w-[150px] rounded-full border border-[#fff0b9]/48"
    style={{
      animation: "naganiSlotDockBalanceLandRing 620ms ease-out both",
      boxShadow:
        "0 0 22px rgba(255,232,163,0.42), inset 0 0 18px rgba(255,218,121,0.2)",
    }}
  />
) : null}

<div className="relative flex h-full items-center justify-center">
  <p
    className="text-[18px] font-black leading-none text-[#fff1bd] drop-shadow-[0_2px_7px_rgba(0,0,0,0.84)]"
    style={{
      animation: showWinCatch
        ? "naganiSlotDockBalanceNumberPop 620ms ease-out both"
        : undefined,
    }}
  >
    {formatMMK(balance)}
  </p>
</div>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-[28px] border border-[#ffd979]/52 bg-[linear-gradient(180deg,#74190c_0%,#390604_48%,#100000_100%)] px-3 pb-3 pt-[30px] shadow-[0_22px_54px_rgba(0,0,0,0.84),inset_0_1px_0_rgba(255,238,178,0.28),inset_0_-20px_34px_rgba(0,0,0,0.52)]">
        <div className="pointer-events-none absolute inset-0 rounded-[28px] bg-[radial-gradient(circle_at_50%_0%,rgba(255,227,146,0.16),transparent_34%),radial-gradient(circle_at_50%_100%,rgba(255,190,74,0.07),transparent_38%)]" />
        <div className="pointer-events-none absolute inset-x-4 top-1 h-px bg-gradient-to-r from-transparent via-[#fff0b9]/72 to-transparent" />
        <div className="pointer-events-none absolute inset-x-8 bottom-0 h-px bg-gradient-to-r from-transparent via-[#b97823]/72 to-transparent" />

        <div
          className="pointer-events-none absolute left-1/2 top-0 h-11 w-[74%] rounded-full bg-[#ffd979]/12 blur-2xl"
          style={{
            animation: readyToSpin
              ? "naganiSlotDockReadyGlow 1900ms ease-in-out infinite"
              : undefined,
          }}
        />

        <div
          className="pointer-events-none absolute left-1/2 top-[3px] h-px w-[70%] -translate-x-1/2 bg-gradient-to-r from-transparent via-[#fff0b9]/76 to-transparent"
          style={{
            animation: "naganiSlotDockTopBreath 1900ms ease-in-out infinite",
          }}
        />

        <div className="relative rounded-[22px] border border-[#b67322]/66 bg-[linear-gradient(180deg,rgba(8,0,0,0.72),rgba(38,4,2,0.76),rgba(5,0,0,0.8))] px-2 py-2 shadow-[inset_0_0_20px_rgba(0,0,0,0.88),0_7px_14px_rgba(0,0,0,0.3)]">
          <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-[#ffd979]/52 to-transparent" />
          <div className="pointer-events-none absolute inset-x-8 bottom-0 h-px bg-gradient-to-r from-transparent via-[#8f551a]/52 to-transparent" />

          <div className="grid grid-cols-4 gap-1.5">
{QUICK_BETS.map((chip) => {
const selected = betAmount === chip.amount;
const chipDisabled = controlsLocked || chip.amount > playableMaxBet;

              return (
                <button
                  key={chip.amount}
                  type="button"
                  disabled={chipDisabled}
                  aria-pressed={selected}
                  onClick={() => onSelectBetAmount(chip.amount)}
                  className={`relative h-[38px] overflow-hidden rounded-full border font-black transition-transform active:translate-y-0.5 active:scale-[0.94] disabled:opacity-[0.62] ${
                    selected
                      ? "border-[#ffe08a]/78 bg-[radial-gradient(circle_at_50%_18%,#ffe08a_0%,#ce8a2e_22%,#a72812_56%,#570403_100%)] text-[#fff7d4]"
                      : "border-[#a66a20]/52 bg-[radial-gradient(circle_at_50%_18%,#64180b_0%,#280302_66%,#060000_100%)] text-[#ffe8a3]/78"
                  }`}
                  style={{
                    animation: selected
                      ? "naganiSlotSelectedCoinPulse 1350ms ease-in-out infinite"
                      : undefined,
                  }}
                >
                  <span className="pointer-events-none absolute inset-[3px] rounded-full border border-[#ffd979]/18" />
                  <span className="pointer-events-none absolute inset-x-3 top-1 h-2 rounded-full bg-white/12 blur-[2px]" />

                  {selected ? (
                    <span
                      className="pointer-events-none absolute inset-y-0 left-0 w-[54%] bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.18),transparent)]"
                      style={{
                        animation: "naganiSlotCoinSheen 1350ms ease-out infinite",
                      }}
                    />
                  ) : null}

                  <span className="relative block text-[13px] leading-none drop-shadow-[0_2px_5px_rgba(0,0,0,0.78)]">
                    {chip.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="relative mt-2.5 grid grid-cols-[68px_1fr_68px] items-center gap-2">
          <button
            type="button"
disabled={controlsLocked}
aria-pressed={autoMode}
onClick={() => setAutoMode((current) => !current)}
            className={`relative flex h-[58px] items-center justify-center overflow-hidden rounded-[20px] border text-[11px] font-black leading-none shadow-[inset_0_0_13px_rgba(0,0,0,0.76),0_8px_14px_rgba(0,0,0,0.34)] transition-transform active:scale-[0.96] disabled:opacity-[0.66] ${
              autoMode
                ? "border-[#fff0b9]/70 bg-[linear-gradient(180deg,rgba(137,33,13,0.96),rgba(16,0,0,0.92))] text-[#fff0b9]"
                : "border-[#9e641d]/58 bg-[linear-gradient(180deg,rgba(50,8,4,0.76),rgba(7,0,0,0.86))] text-[#ffe8a3]/82"
            }`}
          >
            <span className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-[#ffd979]/36 to-transparent" />
            {autoMode ? (
              <span
                className="pointer-events-none absolute inset-0 bg-[#ffd979]/10"
                style={{
                  animation: "naganiSlotAutoPulse 900ms ease-in-out infinite",
                }}
              />
            ) : null}
            <span className="relative whitespace-nowrap text-[13px]">အော်တို</span>
          </button>

          <div className="relative grid h-[66px] grid-cols-[42px_1fr_42px] items-center gap-1.5 rounded-[24px] border border-[#ffd979]/42 bg-[linear-gradient(180deg,rgba(22,0,0,0.7),rgba(83,9,4,0.42),rgba(8,0,0,0.78))] p-1 shadow-[inset_0_0_18px_rgba(0,0,0,0.82),0_10px_18px_rgba(0,0,0,0.42)]">
            <button
              type="button"
onClick={onDecrease}
disabled={!canDecreaseBet}
              className="relative h-[50px] rounded-[18px] border border-[#ffd979]/46 bg-[linear-gradient(180deg,#f3d27a_0%,#bd7a2b_24%,#5c1508_66%,#120000_100%)] text-[23px] font-black text-[#5b0903] shadow-[0_7px_12px_rgba(0,0,0,0.46),inset_0_2px_0_rgba(255,244,195,0.46),inset_0_-10px_16px_rgba(55,0,0,0.42)] transition-transform active:translate-y-0.5 active:scale-[0.94] disabled:opacity-[0.62]"
              aria-label="Decrease bet"
            >
              −
            </button>

            <button
              type="button"
onClick={onSpin}
disabled={!canSpin}
              className="relative h-[54px] overflow-hidden rounded-[22px] border border-[#fff0b9]/82 bg-[linear-gradient(180deg,#fff3b0_0%,#f0bd4c_13%,#e43a1f_45%,#a90d08_74%,#5b0202_100%)] text-[19px] font-black text-white shadow-[0_13px_24px_rgba(0,0,0,0.7),inset_0_2px_0_rgba(255,255,255,0.58),inset_0_-10px_16px_rgba(87,0,0,0.5)] transition-transform active:translate-y-1 active:scale-[0.95] disabled:opacity-[0.78]"
              style={{
                animation: readyToSpin
                  ? "naganiSlotSpinBreathV8 1500ms ease-in-out infinite"
                  : undefined,
              }}
              aria-label="Spin"
            >
              <span className="pointer-events-none absolute inset-x-5 top-1.5 h-4 rounded-full bg-white/34 blur-[2px]" />
              <span className="pointer-events-none absolute inset-x-7 bottom-1.5 h-px bg-gradient-to-r from-transparent via-[#fff0b9]/66 to-transparent" />

              {readyToSpin ? (
                <span
                  className="pointer-events-none absolute inset-y-0 left-0 w-[48%] bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.22),transparent)]"
                  style={{
                    animation: "naganiSlotSpinSweepV8 1800ms ease-out infinite",
                  }}
                />
              ) : null}

              <span className="relative z-20 drop-shadow-[0_3px_6px_rgba(0,0,0,0.92)]">
                {getSpinButtonText(gameState)}
              </span>
            </button>

            <button
              type="button"
onClick={onIncrease}
disabled={!canIncreaseBet}
              className="relative h-[50px] rounded-[18px] border border-[#ffd979]/46 bg-[linear-gradient(180deg,#f3d27a_0%,#bd7a2b_24%,#6f1b0a_66%,#120000_100%)] text-[22px] font-black text-[#5b0903] shadow-[0_7px_12px_rgba(0,0,0,0.46),inset_0_2px_0_rgba(255,244,195,0.46),inset_0_-10px_16px_rgba(55,0,0,0.42)] transition-transform active:translate-y-0.5 active:scale-[0.94] disabled:opacity-[0.62]"
              aria-label="Increase bet"
            >
              +
            </button>
          </div>

          <button
            type="button"
disabled={!canUseMaxBet}
onClick={onMaxBet}
            className="relative flex h-[58px] items-center justify-center overflow-hidden rounded-[20px] border border-[#c9882f]/64 bg-[linear-gradient(180deg,rgba(73,15,7,0.86),rgba(8,0,0,0.88))] text-[11px] font-black leading-none text-[#fff0b9]/88 shadow-[inset_0_0_13px_rgba(0,0,0,0.76),0_8px_14px_rgba(0,0,0,0.34)] transition-transform active:scale-[0.96] disabled:opacity-[0.66]"
          >
            <span className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-[#ffd979]/38 to-transparent" />
            <span className="relative whitespace-nowrap text-[13px]">အားလုံး</span>
          </button>
        </div>
      </div>

      {betPickerOpen ? (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/72 px-5 backdrop-blur-[2px]">
          <button
            type="button"
            className="absolute inset-0 cursor-default"
            onClick={() => setBetPickerOpen(false)}
            aria-label="Close bet picker"
          />

          <div className="relative w-full max-w-[360px] overflow-hidden rounded-[28px] border border-[#ffd979]/62 bg-[radial-gradient(circle_at_50%_0%,rgba(255,232,163,0.22),rgba(65,7,4,0.98)_42%,rgba(8,0,0,0.98))] p-4 shadow-[0_26px_70px_rgba(0,0,0,0.92),0_0_36px_rgba(255,190,74,0.16),inset_0_1px_0_rgba(255,240,185,0.22)]">
            <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#fff0b9]/78 to-transparent" />
            <div className="pointer-events-none absolute inset-x-10 bottom-0 h-px bg-gradient-to-r from-transparent via-[#b97823]/58 to-transparent" />

            <div className="mb-3 flex items-center justify-between">
              <div>
<p className="text-[18px] font-black leading-none text-[#fff0b9] drop-shadow-[0_2px_5px_rgba(0,0,0,0.86)]">
  လောင်းကြေးရွေးပါ
</p>
<p className="mt-1.5 text-[12px] font-bold leading-snug text-[#ffd979]/78">
  စိတ်ကြိုက်ပမာဏကို နိပ်ပါ
</p>
              </div>

              <button
                type="button"
                onClick={() => setBetPickerOpen(false)}
                className="grid h-8 w-8 place-items-center rounded-full border border-[#ffd979]/42 bg-black/38 text-[13px] font-black text-[#ffd979] active:scale-95"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {CUSTOM_BET_OPTIONS.map((option) => {
                const disabled = controlsLocked || option > playableMaxBet;
                const selected = betAmount === option;

                return (
                  <button
                    key={option}
                    type="button"
                    disabled={disabled}
onClick={() => {
  onSelectBetAmount(option);
  setBetPickerOpen(false);
}}
                    className={`relative h-[46px] overflow-hidden rounded-[16px] border text-[15px] font-black transition-transform active:scale-[0.96] disabled:opacity-[0.38] ${
                      selected
                        ? "border-[#fff0b9]/86 bg-[linear-gradient(180deg,#ffe08a_0%,#d78b2d_22%,#bd2012_58%,#590302_100%)] text-white shadow-[0_0_18px_rgba(255,218,121,0.32),inset_0_1px_0_rgba(255,255,255,0.34)]"
                        : "border-[#a66a20]/56 bg-[linear-gradient(180deg,rgba(70,14,7,0.92),rgba(13,0,0,0.95))] text-[#ffe8a3]/86"
                    }`}
                  >
                    <span className="relative z-10">
                      {formatMMK(option)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}