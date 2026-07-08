// src/components/nagani-slot/NaganiSlotControls.tsx

import { useEffect, useState, type CSSProperties, type RefObject } from "react";
import type { NaganiSlotGameState } from "@/lib/naganiSlot/types";
import { naganiSlotAudioEngine } from "./sound/NaganiSlotAudioEngine";

type NaganiSlotControlsProps = {
  betAmount: number;
  balance: number;
  gameState: NaganiSlotGameState;
  hasActiveFreeSpins?: boolean;
  activeFreeSpinsRemaining?: number;
  activeFreeSpinsAwarded?: number;
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
  { amount: 1000, label: "1,000" },
  { amount: 2000, label: "2,000" },
  { amount: 5000, label: "5,000" },
  { amount: 7000, label: "7,000" },
];

const MIN_BET = 1000;
const MAX_BET = 10000;
const BET_STEP = 1000;
const VALUE_CARD_SKIN_IMAGE = "/assets/nagani/slot/ui/value-card-skin-v1.png";
const CHIP_BUTTON_SKIN_IMAGE = "/assets/nagani/slot/ui/chip-button-skin-v1.png";
const AUTO_BUTTON_SKIN_IMAGE = "/assets/nagani/slot/ui/auto-v1.png";
const MAX_BUTTON_SKIN_IMAGE = "/assets/nagani/slot/ui/max-v1.png";
const SPIN_BUTTON_SKIN_IMAGE = "/assets/nagani/slot/ui/start-v1.png";
const REDUCE_BUTTON_SKIN_IMAGE = "/assets/nagani/slot/ui/reduce-v1.png";
const ADD_BUTTON_SKIN_IMAGE = "/assets/nagani/slot/ui/add-v1.png";
const BOTTOM_DOCK_SKIN_IMAGE = "/assets/nagani/slot/ui/bottom-dock-blackwood-v1.png";
const VALUE_LABEL_SKIN_IMAGE = "/assets/nagani/slot/ui/value-card-redwood-v1.png";
const BET_PICKER_BOARD_SKIN_IMAGE = "/assets/nagani/slot/ui/bet-picker-board-v1.png";
const BET_PICKER_BUTTON_SKIN_IMAGE = "/assets/nagani/slot/ui/chip-button-skin-v1.png";
const MILKY_VALUE_NUMBER_STYLE: CSSProperties = {
  textShadow:
    "0 1px 0 rgba(64,22,0,0.95), 0 0 9px rgba(255,253,238,0.42), 0 2px 8px rgba(0,0,0,0.94)",
};

const MILKY_CHIP_NUMBER_STYLE: CSSProperties = {
  textShadow:
    "0 1px 0 rgba(70,28,0,0.9), 0 0 7px rgba(255,250,228,0.34), 0 2px 7px rgba(0,0,0,0.9)",
};

const CUSTOM_BET_OPTIONS = [
  1000, 2000, 3000, 4000, 5000,
  6000, 7000, 8000, 9000, 10000,
];

function formatMMK(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

function getSpinButtonText({
  gameState,
  hasActiveFreeSpins,
}: {
  gameState: NaganiSlotGameState;
  hasActiveFreeSpins: boolean;
}) {
  if (gameState === "spinning") return "လှည့်နေသည်";
  if (gameState === "settling") return "ဆုစုနေသည်";
  if (hasActiveFreeSpins) return "အခမဲ့ လှည့်မည်";
  if (gameState === "result") return "ထပ်လှည့်မည်";
  return "လှည့်မည်";
}

export default function NaganiSlotControls({
  betAmount,
  balance,
  gameState,
  hasActiveFreeSpins = false,
  activeFreeSpinsRemaining = 0,
  activeFreeSpinsAwarded = 0,
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

const betControlsLocked = controlsLocked || hasActiveFreeSpins;

const canDecreaseBet = !betControlsLocked && betAmount > MIN_BET;
const canIncreaseBet =
  !betControlsLocked &&
  balance >= MIN_BET &&
  betAmount + BET_STEP <= playableMaxBet;
const canUseMaxBet = !betControlsLocked && balance >= MIN_BET;
const canSpin =
  readyToSpin &&
  !controlsLocked &&
  (hasActiveFreeSpins || (betAmount >= MIN_BET && balance >= betAmount));

  const quickPresetActive = QUICK_BETS.some(
    (chip) => chip.amount === betAmount
  );

    const freeSpinTotal = Math.max(
    activeFreeSpinsAwarded,
    activeFreeSpinsRemaining
  );

  const freeSpinValue = activeFreeSpinsRemaining * betAmount;

  const betPlaqueLabel = hasActiveFreeSpins
    ? "အခမဲ့လှည့်ခွင့်"
    : quickPresetActive
      ? "လောင်းကြေး"
      : "စိတ်ကြိုက်";

        function handleBetPickerOpen() {
    naganiSlotAudioEngine.playUiTap();
    setBetPickerOpen(true);
  }

  function handleBetPickerClose() {
    naganiSlotAudioEngine.playUiTap();
    setBetPickerOpen(false);
  }

  function handleQuickBetSelect(amount: number) {
    naganiSlotAudioEngine.playChipSelect();
    onSelectBetAmount(amount);
  }

  function handleCustomBetSelect(amount: number) {
    naganiSlotAudioEngine.playChipSelect();
    onSelectBetAmount(amount);
    setBetPickerOpen(false);
  }

  function handleAutoToggle() {
    naganiSlotAudioEngine.playAuto();
    setAutoMode((current) => !current);
  }

  function handleDecreaseClick() {
    naganiSlotAudioEngine.playBetDown();
    onDecrease();
  }

  function handleIncreaseClick() {
    naganiSlotAudioEngine.playBetUp();
    onIncrease();
  }

  function handleMaxClick() {
    naganiSlotAudioEngine.playMax();
    onMaxBet();
  }

  function handleSpinClick() {
  naganiSlotAudioEngine.playUiTap();
  onSpin();
}

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

        @keyframes naganiSlotFreeSpinCardAlive {
  0%, 100% {
    filter: brightness(1.06) saturate(1.06);
    transform: translateY(0) scale(1);
  }
  50% {
    filter: brightness(1.22) saturate(1.14);
    transform: translateY(-1px) scale(1.018);
  }
}

@keyframes naganiSlotFreeSpinCardSweep {
  0% {
    opacity: 0;
    transform: translateX(-135%) skewX(-18deg);
  }
  24% {
    opacity: 0.52;
  }
  100% {
    opacity: 0;
    transform: translateX(135%) skewX(-18deg);
  }
}

@keyframes naganiSlotFreeSpinCardSpark {
  0%, 100% {
    opacity: 0.22;
    transform: scale(0.72);
  }
  50% {
    opacity: 1;
    transform: scale(1.12);
  }
}
      `}</style>

      <div className="absolute inset-x-6 -top-[25px] z-40 grid grid-cols-2 gap-2">
<button
  type="button"
  disabled={betControlsLocked}
  onClick={handleBetPickerOpen}
  className={`relative h-[46px] overflow-visible bg-transparent px-3 text-center transition-transform active:scale-[0.97] ${
    hasActiveFreeSpins ? "opacity-100" : "disabled:opacity-[0.72]"
  }`}
  style={{
    animation: hasActiveFreeSpins
      ? "naganiSlotFreeSpinCardAlive 1500ms ease-in-out infinite"
      : undefined,
  }}
  aria-label="Choose bet amount"
>
<img
  src={VALUE_CARD_SKIN_IMAGE}
  alt=""
  className={`pointer-events-none absolute left-1/2 top-1/2 z-0 h-[56px] w-[calc(100%+12px)] -translate-x-1/2 -translate-y-1/2 object-fill drop-shadow-[0_10px_18px_rgba(0,0,0,0.58)] ${
    hasActiveFreeSpins ? "brightness-[1.18] saturate-[1.16]" : ""
  }`}
  draggable={false}
/>

{hasActiveFreeSpins ? (
  <>
    <span className="pointer-events-none absolute inset-[1px] z-10 rounded-[22px] border border-[#fff0b9]/42 shadow-[0_0_16px_rgba(255,218,121,0.26)]" />

    <span
      className="pointer-events-none absolute inset-y-0 left-0 z-10 w-[46%] rounded-[22px] bg-[linear-gradient(90deg,transparent,rgba(255,248,214,0.18),transparent)]"
      style={{
        animation: "naganiSlotFreeSpinCardSweep 1550ms ease-out infinite",
      }}
    />

    {Array.from({ length: 3 }).map((_, index) => (
      <span
        key={`active-free-spin-card-spark-${index}`}
        className="pointer-events-none absolute z-20 h-1 w-1 rounded-full bg-[#fff0b9]"
        style={{
          left: `${24 + index * 26}%`,
          top: `${18 + ((index * 19) % 32)}%`,
          animation: `naganiSlotFreeSpinCardSpark ${
            1200 + index * 220
          }ms ease-in-out ${index * 160}ms infinite`,
          boxShadow:
            "0 0 7px rgba(255,240,185,0.86), 0 0 12px rgba(255,184,66,0.34)",
        }}
      />
    ))}
  </>
) : null}

  <div className="relative z-10 flex h-full items-center justify-center">

<div className="pointer-events-none absolute left-1/2 top-[-14px] z-10 h-[24px] min-w-[92px] -translate-x-1/2 px-4 text-center">
  <img
    src={VALUE_LABEL_SKIN_IMAGE}
    alt=""
    className="absolute left-1/2 top-1/2 z-0 h-[30px] w-full -translate-x-1/2 -translate-y-1/2 object-fill drop-shadow-[0_5px_10px_rgba(0,0,0,0.58)]"
    draggable={false}
  />

  <p
    className={`relative z-10 whitespace-nowrap pt-[6px] text-[11px] font-black leading-none tracking-[0.02em] drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] ${
      quickPresetActive ? "text-[#ffd979]/92" : "text-[#fff0b9]"
    }`}
  >
    {betPlaqueLabel}
  </p>
</div>

<div className="relative flex h-full items-center justify-center">
  {hasActiveFreeSpins ? (
    <div className="text-center">
<p
  className="text-[18px] font-black leading-none text-[#fffdf2] drop-shadow-[0_2px_7px_rgba(0,0,0,0.9)]"
  style={MILKY_VALUE_NUMBER_STYLE}
>
  {formatMMK(freeSpinValue)}
</p>
<p className="mt-1 text-[9px] font-black leading-none text-[#fff0b9]/90 drop-shadow-[0_1px_4px_rgba(0,0,0,0.86)]">
        ကျန် {activeFreeSpinsRemaining}/
        {freeSpinTotal || activeFreeSpinsRemaining}
      </p>
    </div>
  ) : (
    <p
      className="text-[18px] font-black leading-none text-[#fffdf2] drop-shadow-[0_2px_7px_rgba(0,0,0,0.84)]"
      style={MILKY_VALUE_NUMBER_STYLE}
    >
      {formatMMK(betAmount)}
    </p>
  )}
</div>

{hasActiveFreeSpins ? (
  <span className="pointer-events-none absolute inset-x-5 bottom-1 h-px bg-gradient-to-r from-transparent via-[#fff0b9]/50 to-transparent" />
) : (
  <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-[#ffd979]/78 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
    ▼
  </span>
)}

  </div>
</button>

<div
  ref={balanceTargetRef}
  className="relative h-[46px] overflow-visible bg-transparent px-3 text-center"
  style={{
    animation: balancePulse
      ? "naganiSlotDockBalanceCatch 620ms ease-out both"
      : gameState === "settling" || gameState === "result"
        ? "naganiSlotDockBalanceGlow 1050ms ease-in-out infinite"
        : undefined,
  }}
>
  <img
    src={VALUE_CARD_SKIN_IMAGE}
    alt=""
    className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-[56px] w-[calc(100%+12px)] -translate-x-1/2 -translate-y-1/2 object-fill drop-shadow-[0_10px_18px_rgba(0,0,0,0.58)]"
    draggable={false}
  />

  <div className="relative z-10 flex h-full items-center justify-center">

<div className="absolute left-1/2 top-[-14px] z-10 h-[24px] min-w-[102px] -translate-x-1/2 px-4 text-center">
  <img
    src={VALUE_LABEL_SKIN_IMAGE}
    alt=""
    className="absolute left-1/2 top-1/2 z-0 h-[30px] w-full -translate-x-1/2 -translate-y-1/2 object-fill drop-shadow-[0_5px_10px_rgba(0,0,0,0.58)]"
    draggable={false}
  />

  <p
    className={`relative z-10 whitespace-nowrap pt-[6px] text-[11px] font-black leading-none tracking-[0.02em] drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] ${
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

<p
  className="text-[18px] font-black leading-none text-[#fffdf2] drop-shadow-[0_2px_7px_rgba(0,0,0,0.84)]"
  style={{
    ...MILKY_VALUE_NUMBER_STYLE,
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

      <div className="relative overflow-visible px-3 pb-3 pt-[30px]">
        <img
          src={BOTTOM_DOCK_SKIN_IMAGE}
          alt=""
          className="pointer-events-none absolute inset-0 z-0 h-full w-full object-fill drop-shadow-[0_22px_42px_rgba(0,0,0,0.78)]"
          draggable={false}
        />

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

        <div className="relative z-10 px-2 py-1.5">

          <div className="grid grid-cols-4 gap-1.5">
{QUICK_BETS.map((chip) => {
const selected = betAmount === chip.amount;
const chipDisabled = betControlsLocked || chip.amount > playableMaxBet;

              return (
<button
  key={chip.amount}
  type="button"
  disabled={chipDisabled}
  aria-pressed={selected}
  onClick={() => handleQuickBetSelect(chip.amount)}
className={`relative h-[38px] overflow-visible rounded-full bg-transparent font-extrabold tracking-[0.01em] transition-transform active:translate-y-0.5 active:scale-[0.94] disabled:opacity-[0.58] ${
  selected ? "text-[#fffdf2]" : "text-[#fff7df]/92"
}`}
  style={{
    animation: selected
      ? "naganiSlotSelectedCoinPulse 1350ms ease-in-out infinite"
      : undefined,
  }}
>
  <img
    src={CHIP_BUTTON_SKIN_IMAGE}
    alt=""
    className={`pointer-events-none absolute left-1/2 top-1/2 z-0 h-[46px] w-[calc(100%+12px)] -translate-x-1/2 -translate-y-1/2 object-fill drop-shadow-[0_7px_12px_rgba(0,0,0,0.56)] ${
      selected
        ? "brightness-[1.16] saturate-[1.18]"
        : "brightness-[0.82] saturate-[0.88]"
    }`}
    draggable={false}
  />

  {selected ? (
    <>
      <span className="pointer-events-none absolute inset-[-2px] z-10 rounded-full border border-[#fff0b9]/54 shadow-[0_0_14px_rgba(255,218,121,0.34)]" />
      <span
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-[54%] rounded-full bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.18),transparent)]"
        style={{
          animation: "naganiSlotCoinSheen 1350ms ease-out infinite",
        }}
      />
    </>
  ) : (
    <span className="pointer-events-none absolute inset-[2px] z-10 rounded-full border border-[#ffd979]/12" />
  )}

<span
  className="relative z-20 block text-[12px] leading-none drop-shadow-[0_2px_5px_rgba(0,0,0,0.9)]"
  style={MILKY_CHIP_NUMBER_STYLE}
>
  {chip.label}
</span>
</button>
              );
            })}
          </div>
        </div>

        <div className="relative z-10 mt-2.5 grid grid-cols-[68px_1fr_68px] items-center gap-2">
<button
  type="button"
  disabled={controlsLocked}
  aria-pressed={autoMode}
  aria-label="အော်တို"
  onClick={handleAutoToggle}
  className={`relative flex h-[58px] items-center justify-center overflow-visible rounded-[20px] bg-transparent text-[11px] font-black leading-none transition-transform active:scale-[0.96] disabled:opacity-[0.66] ${
    autoMode ? "text-[#fff0b9]" : "text-[#ffe8a3]/90"
  }`}
>
  <img
    src={AUTO_BUTTON_SKIN_IMAGE}
    alt=""
    className={`pointer-events-none absolute left-1/2 top-1/2 z-0 h-[72px] w-[86px] -translate-x-1/2 -translate-y-1/2 object-fill drop-shadow-[0_8px_14px_rgba(0,0,0,0.5)] ${
      autoMode ? "brightness-[1.12] saturate-[1.1]" : "brightness-[0.86] saturate-[0.82]"
    }`}
    draggable={false}
  />

  {autoMode ? (
    <span
      className="pointer-events-none absolute inset-0 z-10 rounded-[20px] bg-[#ffd979]/10"
      style={{
        animation: "naganiSlotAutoPulse 900ms ease-in-out infinite",
      }}
    />
  ) : null}
</button>

          <div className="relative grid h-[66px] grid-cols-[42px_1fr_42px] items-center gap-1.5 p-1">
<button
  type="button"
  onClick={handleDecreaseClick}
  disabled={!canDecreaseBet}
  aria-label="Decrease bet"
  className="relative h-[50px] overflow-visible rounded-[18px] bg-transparent transition-transform active:translate-y-0.5 active:scale-[0.94] disabled:opacity-[0.62]"
>
  <img
    src={REDUCE_BUTTON_SKIN_IMAGE}
    alt=""
    className={`pointer-events-none absolute left-1/2 top-1/2 z-0 h-[58px] w-[58px] -translate-x-1/2 -translate-y-1/2 object-fill drop-shadow-[0_7px_12px_rgba(0,0,0,0.46)] ${
      canDecreaseBet ? "brightness-[1] saturate-[1]" : "brightness-[0.78] saturate-[0.82]"
    }`}
    draggable={false}
  />
</button>

<button
  type="button"
  onClick={handleSpinClick}
  disabled={!canSpin}
  className="relative h-[54px] overflow-visible rounded-[22px] bg-transparent text-[19px] font-black text-white transition-transform active:translate-y-1 active:scale-[0.95] disabled:opacity-[0.78]"
  style={{
    animation: readyToSpin
      ? "naganiSlotSpinBreathV8 1500ms ease-in-out infinite"
      : undefined,
  }}
  aria-label="Spin"
>
  <img
    src={SPIN_BUTTON_SKIN_IMAGE}
    alt=""
    className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-[74px] w-[calc(100%+34px)] -translate-x-1/2 -translate-y-1/2 object-fill drop-shadow-[0_13px_24px_rgba(0,0,0,0.7)]"
    draggable={false}
  />

  {readyToSpin ? (
    <span
      className="pointer-events-none absolute inset-y-0 left-0 z-10 w-[48%] rounded-[22px] bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.18),transparent)]"
      style={{
        animation: "naganiSlotSpinSweepV8 1800ms ease-out infinite",
      }}
    />
  ) : null}
</button>

<button
  type="button"
  onClick={handleIncreaseClick}
  disabled={!canIncreaseBet}
  aria-label="Increase bet"
  className="relative h-[50px] overflow-visible rounded-[18px] bg-transparent transition-transform active:translate-y-0.5 active:scale-[0.94] disabled:opacity-[0.62]"
>
  <img
    src={ADD_BUTTON_SKIN_IMAGE}
    alt=""
    className={`pointer-events-none absolute left-1/2 top-1/2 z-0 h-[58px] w-[58px] -translate-x-1/2 -translate-y-1/2 object-fill drop-shadow-[0_7px_12px_rgba(0,0,0,0.46)] ${
      canIncreaseBet ? "brightness-[1] saturate-[1]" : "brightness-[0.78] saturate-[0.82]"
    }`}
    draggable={false}
  />
</button>
          </div>

<button
  type="button"
  disabled={!canUseMaxBet}
  onClick={handleMaxClick}
  aria-label="အားလုံး"
  className="relative flex h-[58px] items-center justify-center overflow-visible rounded-[20px] bg-transparent text-[11px] font-black leading-none text-[#fff0b9]/92 transition-transform active:scale-[0.96] disabled:opacity-[0.66]"
>
  <img
    src={MAX_BUTTON_SKIN_IMAGE}
    alt=""
    className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-[72px] w-[86px] -translate-x-1/2 -translate-y-1/2 object-fill brightness-[0.88] saturate-[0.88] drop-shadow-[0_8px_14px_rgba(0,0,0,0.5)]"
    draggable={false}
  />
</button>
        </div>
      </div>

      {betPickerOpen ? (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/72 px-5 backdrop-blur-[2px]">
          <button
            type="button"
            className="absolute inset-0 cursor-default"
            onClick={handleBetPickerClose}
            aria-label="Close bet picker"
          />

<div className="relative w-full max-w-[360px] overflow-visible px-5 pb-5 pt-5">
  <img
    src={BET_PICKER_BOARD_SKIN_IMAGE}
    alt=""
    className="pointer-events-none absolute inset-0 z-0 h-full w-full object-fill drop-shadow-[0_26px_70px_rgba(0,0,0,0.92)]"
    draggable={false}
  />

            <div className="relative z-10 mb-3 flex items-center justify-between">
              <div>
<p
  className="text-[17px] font-extrabold leading-none tracking-[0.01em] text-[#fff1bd] drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]"
  style={{
    textShadow:
      "0 1px 0 rgba(92,36,0,0.9), 0 2px 8px rgba(0,0,0,0.86)",
  }}
>
  လောင်းကြေး ရွေးရန်
</p>
<p className="mt-1.5 text-[11px] font-semibold leading-snug tracking-[0.01em] text-[#d9aa5a]/90 drop-shadow-[0_1px_4px_rgba(0,0,0,0.78)]">
  ကစားမည့် ပမာဏကို ရွေးပါ
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

            <div className="relative z-10 grid grid-cols-2 gap-2">
              {CUSTOM_BET_OPTIONS.map((option) => {
                const disabled = betControlsLocked || option > playableMaxBet;
                const selected = betAmount === option;

                return (
<button
  key={option}
  type="button"
  disabled={disabled}
  onClick={() => handleCustomBetSelect(option)}
className={`relative h-[46px] overflow-visible rounded-[16px] bg-transparent text-[14px] font-extrabold tracking-[0.01em] transition-transform active:scale-[0.96] disabled:opacity-[0.38] ${
  selected ? "text-[#fffdf2]" : "text-[#fff7df]/92"
}`}
>
  <img
    src={BET_PICKER_BUTTON_SKIN_IMAGE}
    alt=""
    className={`pointer-events-none absolute left-1/2 top-1/2 z-0 h-[52px] w-[calc(100%+10px)] -translate-x-1/2 -translate-y-1/2 object-fill drop-shadow-[0_7px_13px_rgba(0,0,0,0.58)] ${
      selected
        ? "brightness-[1.24] saturate-[1.18]"
        : "brightness-[0.74] saturate-[0.86]"
    }`}
    draggable={false}
  />

  {selected ? (
    <>
      <span className="pointer-events-none absolute inset-[-1px] z-10 rounded-[16px] border border-[#fff0b9]/70 shadow-[0_0_16px_rgba(255,218,121,0.34)]" />
      <span className="pointer-events-none absolute inset-x-4 top-[5px] z-10 h-px bg-gradient-to-r from-transparent via-white/48 to-transparent" />
    </>
  ) : (
    <span className="pointer-events-none absolute inset-[2px] z-10 rounded-[15px] border border-[#ffd979]/14" />
  )}

<span
  className="relative z-20 block translate-y-[1px]"
  style={MILKY_CHIP_NUMBER_STYLE}
>
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