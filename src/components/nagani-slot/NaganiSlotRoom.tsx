// src/components/nagani-slot/NaganiSlotRoom.tsx

"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

import NaganiSlotBoard from "./NaganiSlotBoard";
import NaganiSlotControls from "./NaganiSlotControls";
import NaganiSlotLoadingLayer from "./NaganiSlotLoadingLayer";
import NaganiSlotTopBar from "./NaganiSlotTopBar";
import {
  createDemoSpinResultColumns,
  evaluateNaganiSlotResult,
  getInitialSlotColumns,
} from "@/lib/naganiSlot/symbols";
import type {
  NaganiSlotGameState,
  NaganiSlotSymbol,
  NaganiSlotWinEvaluation,
} from "@/lib/naganiSlot/types";

const MIN_BET = 1000;
const MAX_BET = 50000;
const BET_STEP = 1000;

const REEL_STOP_TIMINGS = [1200, 1450, 1700, 1950, 2250];
const RESULT_REVEAL_DELAY = 2550;
const RESULT_HOLD_BEFORE_COUNT_MS = 120;
const WIN_COUNT_DURATION = 620;
const READY_AGAIN_DELAY = 850;
const ROOM_BOOT_MS = 1150;
const REWARD_AMOUNT_READ_MS = 700;
const REWARD_FLY_MS = 520;
const GOLD_POT_IMAGE = "/assets/nagani/slot/symbols/gold-pot.png";
type RewardTransferPhase = "idle" | "counting" | "holding" | "flying" | "landed";

function formatMMK(amount: number) {
  return `${amount.toLocaleString("en-US")} MMK`;
}

function getRewardOverlayTitle(
  winEvaluation: NaganiSlotWinEvaluation | null
) {
  if (!winEvaluation) return "";
  if (winEvaluation.tier === "big") return "ရွှေအိုးအောင်ပွဲကြီး";
  if (winEvaluation.tier === "medium") return "အောင်ပွဲခံပြီ";
  if (winEvaluation.tier === "small") return "အောင်ပြီ";
  return "";
}

function getRewardOverlayTone(
  winEvaluation: NaganiSlotWinEvaluation | null
) {
  if (!winEvaluation) return "small";
  if (winEvaluation.tier === "big") return "big";
  if (winEvaluation.tier === "medium") return "medium";
  return "small";
}

export default function NaganiSlotRoom() {
  const [roomReady, setRoomReady] = useState(false);
  const [balance, setBalance] = useState(500000);
  const [betAmount, setBetAmount] = useState(MIN_BET);
  const [lastWin, setLastWin] = useState(0);
  const [slotColumns, setSlotColumns] = useState<NaganiSlotSymbol[][]>(() =>
    getInitialSlotColumns()
  );
  const [gameState, setGameState] = useState<NaganiSlotGameState>("ready");
  const [stoppedReelCount, setStoppedReelCount] = useState(5);
  const [winEvaluation, setWinEvaluation] =
    useState<NaganiSlotWinEvaluation | null>(null);
const [rewardTransferPhase, setRewardTransferPhase] =
  useState<RewardTransferPhase>("idle");
const [rewardFlightVector, setRewardFlightVector] = useState({
  x: 96,
  y: 290,
});

  const spinTimersRef = useRef<number[]>([]);
  const roomShellRef = useRef<HTMLDivElement | null>(null);
const balanceTargetRef = useRef<HTMLDivElement | null>(null);

  const spinning = gameState === "spinning";
  const controlsLocked = gameState === "spinning" || gameState === "settling";

const hasRewardWin = Boolean(winEvaluation && winEvaluation.tier !== "none");

const showRewardOverlay =
  roomReady &&
  hasRewardWin &&
  gameState !== "spinning" &&
  rewardTransferPhase !== "idle" &&
  rewardTransferPhase !== "landed";

const showFlyingRewardPot =
  roomReady && hasRewardWin && rewardTransferPhase === "flying";

const rewardTone = getRewardOverlayTone(winEvaluation);
const flyingPotStyle = {
  "--nagani-reward-fly-x": `${rewardFlightVector.x}px`,
  "--nagani-reward-fly-y": `${rewardFlightVector.y}px`,
  animation: `naganiSlotRewardPotFlyToBalance ${REWARD_FLY_MS}ms cubic-bezier(.22,.9,.26,1) forwards`,
} as CSSProperties;

  function clearSpinTimers() {
    spinTimersRef.current.forEach((timer) => {
      window.clearTimeout(timer);
      window.clearInterval(timer);
    });

    spinTimersRef.current = [];
  }

  function scheduleReadyAgain() {
    const readyTimer = window.setTimeout(() => {
      setGameState((current) => {
        if (current !== "result") return current;
        return "ready";
      });

      setWinEvaluation(null);
setRewardTransferPhase("idle");
    }, READY_AGAIN_DELAY);

    spinTimersRef.current.push(readyTimer);
  }

  useEffect(() => {
    const bootTimer = window.setTimeout(() => {
      setRoomReady(true);
    }, ROOM_BOOT_MS);

    return () => {
      window.clearTimeout(bootTimer);
      clearSpinTimers();
    };
  }, []);

function getPlayableMaxBet() {
  if (balance < MIN_BET) return MIN_BET;

  const rawPlayableMaxBet = Math.min(balance, MAX_BET);
  return Math.floor(rawPlayableMaxBet / BET_STEP) * BET_STEP;
}

function normalizeBetAmount(amount: number) {
  const playableMaxBet = getPlayableMaxBet();
  const steppedAmount = Math.round(amount / BET_STEP) * BET_STEP;

  return Math.min(playableMaxBet, Math.max(MIN_BET, steppedAmount));
}

function increaseBet() {
  if (controlsLocked) return;

  setBetAmount((current) => normalizeBetAmount(current + BET_STEP));
}

function decreaseBet() {
  if (controlsLocked) return;

  setBetAmount((current) => normalizeBetAmount(current - BET_STEP));
}

function selectBetAmount(amount: number) {
  if (controlsLocked) return;

  setBetAmount(normalizeBetAmount(amount));
}

function setMaxBetAmount() {
  if (controlsLocked) return;

  setBetAmount(getPlayableMaxBet());
}

  function prepareRewardFlightPath() {
  const roomRect = roomShellRef.current?.getBoundingClientRect();
  const balanceRect = balanceTargetRef.current?.getBoundingClientRect();

  if (!roomRect || !balanceRect) {
    setRewardFlightVector({ x: 96, y: 290 });
    return;
  }

  const startX = roomRect.width * 0.5;
  const startY = roomRect.height * 0.46;

  const targetX = balanceRect.left - roomRect.left + balanceRect.width / 2;
  const targetY = balanceRect.top - roomRect.top + balanceRect.height / 2;

  setRewardFlightVector({
    x: targetX - startX,
    y: targetY - startY,
  });
}

function countWinAmount(targetAmount: number) {
  if (targetAmount <= 0) {
    setLastWin(0);
    setRewardTransferPhase("idle");
    setGameState("result");
    scheduleReadyAgain();
    return;
  }

  const displayStartAmount = Math.min(targetAmount, 1000);

  setGameState("settling");
  setLastWin(displayStartAmount);
  setRewardTransferPhase("counting");

  const startedAt = Date.now();

  const counterTimer = window.setInterval(() => {
    const elapsed = Date.now() - startedAt;
    const progress = Math.min(1, elapsed / WIN_COUNT_DURATION);
    const easedProgress = 1 - Math.pow(1 - progress, 3);

    const nextAmount = Math.floor(
      displayStartAmount + (targetAmount - displayStartAmount) * easedProgress
    );

    setLastWin(Math.min(targetAmount, nextAmount));

    if (progress >= 1) {
      window.clearInterval(counterTimer);
      setLastWin(targetAmount);
      setRewardTransferPhase("holding");

      const holdTimer = window.setTimeout(() => {
        prepareRewardFlightPath();
        setRewardTransferPhase("flying");

        const flyTimer = window.setTimeout(() => {
          setBalance((current) => current + targetAmount);
          setRewardTransferPhase("landed");
          setGameState("result");
          scheduleReadyAgain();
        }, REWARD_FLY_MS);

        spinTimersRef.current.push(flyTimer);
      }, REWARD_AMOUNT_READ_MS);

      spinTimersRef.current.push(holdTimer);
    }
  }, 28);

  spinTimersRef.current.push(counterTimer);
}

  function handleSpin() {
    if (gameState !== "ready" && gameState !== "result") return;
    if (balance < betAmount || betAmount < MIN_BET) return;

    clearSpinTimers();

    const nextColumns = createDemoSpinResultColumns();

    setBalance((current) => current - betAmount);
    setLastWin(0);
    setWinEvaluation(null);
    setRewardTransferPhase("idle");
    setGameState("spinning");
    setStoppedReelCount(0);
    setSlotColumns(nextColumns);

    REEL_STOP_TIMINGS.forEach((delayMs, index) => {
      const timer = window.setTimeout(() => {
        setStoppedReelCount(index + 1);
      }, delayMs);

      spinTimersRef.current.push(timer);
    });

    const resultTimer = window.setTimeout(() => {
      const evaluation = evaluateNaganiSlotResult({
        columns: nextColumns,
        betAmount,
      });

      setWinEvaluation(evaluation);
      setStoppedReelCount(5);
      setGameState("settling");

      const countStartTimer = window.setTimeout(() => {
        countWinAmount(evaluation.amount);
      }, RESULT_HOLD_BEFORE_COUNT_MS);

      spinTimersRef.current.push(countStartTimer);
    }, RESULT_REVEAL_DELAY);

    spinTimersRef.current.push(resultTimer);
  }

  return (
    <main className="h-dvh overflow-hidden overscroll-none bg-[#050000] text-white">
      <style>{`
        @keyframes naganiSlotSettlementIn {
          0% {
            opacity: 0;
            transform: translateY(16px) scale(0.94);
          }
          62% {
            opacity: 1;
            transform: translateY(-2px) scale(1.025);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes naganiSlotSettlementGoldSweep {
          0% {
            transform: translateX(-135%) skewX(-18deg);
            opacity: 0;
          }
          22% {
            opacity: 0.72;
          }
          100% {
            transform: translateX(135%) skewX(-18deg);
            opacity: 0;
          }
        }

        @keyframes naganiSlotSettlementPulse {
          0%, 100% {
            filter: brightness(1);
          }
          50% {
            filter: brightness(1.28);
          }
        }

        @keyframes naganiSlotReadyFade {
          0%, 100% {
            opacity: 0.42;
          }
          50% {
            opacity: 0.82;
          }
        }
                  @keyframes naganiSlotIdlePalaceWarmth {
          0%, 100% {
            opacity: 0.22;
            transform: scale(0.96);
          }
          50% {
            opacity: 0.42;
            transform: scale(1.04);
          }
        }

        @keyframes naganiSlotIdleGoldMist {
          0%, 100% {
            opacity: 0.16;
            transform: translateY(0) scaleX(0.92);
          }
          50% {
            opacity: 0.34;
            transform: translateY(-6px) scaleX(1);
          }
        }

        @keyframes naganiSlotIdleDustFloat {
          0% {
            opacity: 0;
            transform: translateY(12px) scale(0.6);
          }
          28% {
            opacity: 0.56;
          }
          100% {
            opacity: 0;
            transform: translateY(-34px) scale(1);
          }
        }
        
                @keyframes naganiSlotRoomBridgeBreath {
          0%, 100% {
            opacity: 0.2;
            transform: translateX(-50%) scaleX(0.92);
          }
          50% {
            opacity: 0.42;
            transform: translateX(-50%) scaleX(1);
          }
        }

        @keyframes naganiSlotRoomGoldVein {
          0%, 100% {
            opacity: 0.24;
            filter: brightness(1);
          }
          50% {
            opacity: 0.48;
            filter: brightness(1.22);
          }
        }

        @keyframes naganiSlotRoomFineDust {
          0% {
            opacity: 0;
            transform: translateY(16px) scale(0.52);
          }
          24% {
            opacity: 0.48;
          }
          100% {
            opacity: 0;
            transform: translateY(-42px) scale(1);
          }
        }

                @keyframes naganiSlotBottomFloorGlow {
          0%, 100% {
            opacity: 0.26;
            transform: translateX(-50%) scaleX(0.88);
          }
          50% {
            opacity: 0.52;
            transform: translateX(-50%) scaleX(1);
          }
        }

        @keyframes naganiSlotBottomGoldDust {
          0% {
            opacity: 0;
            transform: translateY(12px) scale(0.5);
          }
          28% {
            opacity: 0.48;
          }
          100% {
            opacity: 0;
            transform: translateY(-26px) scale(1);
          }
        }

        @keyframes naganiSlotBottomCarpetBreath {
          0%, 100% {
            opacity: 0.18;
            filter: brightness(1);
          }
          50% {
            opacity: 0.34;
            filter: brightness(1.12);
          }
        }

         @keyframes naganiSlotRewardOverlayIn {
          0% {
            opacity: 0;
            transform: translateY(24px) scale(0.84);
            filter: blur(2px) brightness(1.3);
          }
          58% {
            opacity: 1;
            transform: translateY(-4px) scale(1.06);
            filter: blur(0) brightness(1.14);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0) brightness(1);
          }
        }

        @keyframes naganiSlotRewardOverlayAura {
          0%, 100% {
            opacity: 0.24;
            transform: scale(0.9);
          }
          50% {
            opacity: 0.54;
            transform: scale(1.08);
          }
        }

        @keyframes naganiSlotRewardCoinFloat {
          0% {
            opacity: 0;
            transform: translateY(16px) scale(0.56);
          }
          28% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translateY(-46px) scale(1.05);
          }
        }

        @keyframes naganiSlotRewardAmountPulse {
          0%, 100% {
            filter: brightness(1);
            text-shadow:
              0 2px 8px rgba(0,0,0,0.9),
              0 0 12px rgba(255,218,121,0.22);
          }
          50% {
            filter: brightness(1.2);
            text-shadow:
              0 2px 8px rgba(0,0,0,0.9),
              0 0 28px rgba(255,232,163,0.66);
          }
        }
                  @keyframes naganiSlotRewardPotFloat {
          0%, 100% {
            transform: translateY(0) scale(1);
            filter: brightness(1);
          }
          50% {
            transform: translateY(-4px) scale(1.04);
            filter: brightness(1.14);
          }
        }

        @keyframes naganiSlotRewardMedallionSweep {
          0% {
            transform: translateX(-145%) skewX(-18deg);
            opacity: 0;
          }
          24% {
            opacity: 0.68;
          }
          100% {
            transform: translateX(145%) skewX(-18deg);
            opacity: 0;
          }
        }
        
                @keyframes naganiSlotRewardMedallionTransferOut {
          0% {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: brightness(1);
          }
          100% {
            opacity: 0;
            transform: translateY(-10px) scale(0.82);
            filter: brightness(1.25);
          }
        }

@keyframes naganiSlotRewardPotFlyToBalance {
  0% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.78);
    filter: brightness(1.2);
  }
  12% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
    filter: brightness(1.34);
  }
  74% {
    opacity: 1;
    transform: translate(
      calc(-50% + var(--nagani-reward-fly-x)),
      calc(-50% + var(--nagani-reward-fly-y))
    ) scale(0.34);
    filter: brightness(1.5);
  }
  100% {
    opacity: 0;
    transform: translate(
      calc(-50% + var(--nagani-reward-fly-x)),
      calc(-50% + var(--nagani-reward-fly-y))
    ) scale(0.18);
    filter: brightness(1.8);
  }
}
      `}</style>

      <div className="mx-auto h-dvh w-full max-w-[430px] overflow-hidden bg-[#080101]">
        <div ref={roomShellRef} className="relative h-full overflow-hidden">
          {!roomReady ? <NaganiSlotLoadingLayer /> : null}

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_8%,rgba(255,218,121,0.24),transparent_23%),radial-gradient(circle_at_50%_42%,rgba(145,18,12,0.42),transparent_44%),linear-gradient(180deg,#2b0604_0%,#0c0101_46%,#020000_100%)]" />

          <div className="absolute inset-x-4 top-[82px] h-[260px] rounded-b-[48%] border border-[#ffda7a]/10 bg-[radial-gradient(circle_at_50%_0%,rgba(255,226,151,0.16),rgba(85,11,7,0.22)_44%,transparent_78%)]" />

          <div className="absolute left-1/2 top-[250px] h-[58%] w-[76%] -translate-x-1/2 bg-[linear-gradient(180deg,rgba(255,210,105,0.08),rgba(150,16,18,0.48)_46%,rgba(24,1,1,0.86))]" />

          <div className="absolute left-0 top-[96px] h-[78%] w-[58px] bg-[linear-gradient(90deg,rgba(0,0,0,0.84),rgba(91,11,7,0.38),transparent)]" />
          <div className="absolute right-0 top-[96px] h-[78%] w-[58px] bg-[linear-gradient(270deg,rgba(0,0,0,0.84),rgba(91,11,7,0.38),transparent)]" />

          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,transparent_0%,rgba(0,0,0,0.04)_42%,rgba(0,0,0,0.76)_100%)]" />
                    <div
            className="pointer-events-none absolute left-1/2 top-[70px] z-[4] h-[190px] w-[82%] -translate-x-1/2 rounded-b-[46px] border-x border-[#ffd979]/10 bg-[radial-gradient(circle_at_50%_0%,rgba(255,232,163,0.14),rgba(122,18,9,0.16)_38%,transparent_74%)]"
            style={{
              animation: "naganiSlotRoomBridgeBreath 3600ms ease-in-out infinite",
            }}
          />

          <div
            className="pointer-events-none absolute left-1/2 top-[118px] z-[4] h-[58%] w-[2px] -translate-x-1/2 bg-gradient-to-b from-[#fff0b9]/28 via-[#ffd979]/12 to-transparent"
            style={{
              animation: "naganiSlotRoomGoldVein 2600ms ease-in-out infinite",
            }}
          />

          {roomReady ? (
            <>
              {Array.from({ length: 9 }).map((_, index) => (
                <span
                  key={`nagani-slot-room-fine-dust-${index}`}
                  className="pointer-events-none absolute z-[5] h-1 w-1 rounded-full bg-[#fff0b9]"
                  style={{
                    left: `${14 + ((index * 19) % 72)}%`,
                    top: `${22 + ((index * 17) % 52)}%`,
                    animation: `naganiSlotRoomFineDust ${
                      1800 + (index % 4) * 220
                    }ms ease-out ${index * 310}ms infinite`,
                    boxShadow: "0 0 8px rgba(255,232,163,0.5)",
                  }}
                />
              ))}
            </>
          ) : null}

{gameState === "ready" && !winEvaluation ? (
  <>
    <div
      className="pointer-events-none absolute inset-x-10 top-[38%] z-10 h-[230px] rounded-full bg-[#ffd979]/10 blur-3xl"
      style={{
        animation: "naganiSlotReadyFade 2400ms ease-in-out infinite",
      }}
    />

    <div
      className="pointer-events-none absolute left-1/2 top-[28%] z-10 h-[260px] w-[72%] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,218,121,0.13),rgba(116,22,11,0.12)_42%,transparent_72%)] blur-2xl"
      style={{
        animation: "naganiSlotIdlePalaceWarmth 3600ms ease-in-out infinite",
      }}
    />

    <div
      className="pointer-events-none absolute left-1/2 top-[68%] z-10 h-[90px] w-[62%] -translate-x-1/2 rounded-full bg-[#ffd979]/10 blur-2xl"
      style={{
        animation: "naganiSlotIdleGoldMist 3100ms ease-in-out infinite",
      }}
    />

    {Array.from({ length: 6 }).map((_, index) => (
      <span
        key={`nagani-slot-idle-dust-${index}`}
        className="pointer-events-none absolute z-10 h-1 w-1 rounded-full bg-[#fff0b9]"
        style={{
          left: `${18 + ((index * 17) % 64)}%`,
          top: `${42 + ((index * 19) % 30)}%`,
          animation: `naganiSlotIdleDustFloat ${
            1500 + (index % 3) * 180
          }ms ease-out ${index * 260}ms infinite`,
          boxShadow: "0 0 8px rgba(255,232,163,0.58)",
        }}
      />
    ))}
  </>
) : null}

{showRewardOverlay && winEvaluation ? (
  <div className="pointer-events-none absolute inset-x-0 bottom-[188px] top-[76px] z-[55] flex items-center justify-center px-6">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_48%,rgba(0,0,0,0.16),transparent_58%)]" />

    <div
      className="absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,232,163,0.28),rgba(255,184,66,0.12)_36%,transparent_70%)]"
      style={{
        animation: "naganiSlotRewardOverlayAura 1180ms ease-in-out infinite",
      }}
    />

    {Array.from({
      length: rewardTone === "big" ? 20 : rewardTone === "medium" ? 13 : 8,
    }).map((_, index) => (
      <span
        key={`nagani-slot-floating-reward-coin-${index}`}
        className="absolute h-1.5 w-1.5 rounded-full bg-[#fff0b9]"
        style={{
          left: `${16 + ((index * 17) % 68)}%`,
          top: `${40 + ((index * 23) % 30)}%`,
          animation: `naganiSlotRewardCoinFloat ${
            760 + (index % 5) * 90
          }ms ease-out ${index * 48}ms infinite`,
          boxShadow:
            "0 0 10px rgba(255,232,163,0.88), 0 0 18px rgba(255,184,66,0.42)",
        }}
      />
    ))}

    <div
      className={`relative min-w-[248px] max-w-[88%] overflow-hidden rounded-[44px] border px-6 pb-4 pt-5 text-center shadow-[0_26px_62px_rgba(0,0,0,0.86),0_0_48px_rgba(255,218,121,0.3),inset_0_1px_0_rgba(255,240,185,0.42),inset_0_-22px_34px_rgba(54,0,0,0.48)] ${
        rewardTone === "big"
          ? "border-[#fff0b9]/90 bg-[radial-gradient(circle_at_50%_0%,rgba(255,246,208,0.48),rgba(174,42,10,0.97)_36%,rgba(55,3,2,0.99))]"
          : rewardTone === "medium"
            ? "border-[#ffe08a]/78 bg-[radial-gradient(circle_at_50%_0%,rgba(255,232,163,0.36),rgba(126,24,7,0.97)_42%,rgba(42,3,2,0.99))]"
            : "border-[#ffd979]/66 bg-[radial-gradient(circle_at_50%_0%,rgba(255,218,121,0.26),rgba(92,16,6,0.97)_42%,rgba(31,2,2,0.99))]"
      }`}
      style={{
        animation:
          rewardTransferPhase === "flying"
            ? "naganiSlotRewardMedallionTransferOut 520ms ease-in forwards"
            : "naganiSlotRewardOverlayIn 420ms ease-out both",
      }}
    >
      <div className="pointer-events-none absolute inset-1 rounded-[40px] border border-[#ffd979]/20" />
      <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#fff0b9]/80 to-transparent" />
      <div className="pointer-events-none absolute inset-x-10 bottom-0 h-px bg-gradient-to-r from-transparent via-[#d69a37]/72 to-transparent" />
      <div className="pointer-events-none absolute inset-x-7 top-2 h-9 rounded-full bg-white/17 blur-md" />

      <div
        className="relative mx-auto -mt-2 mb-1 grid h-[54px] w-[72px] place-items-center"
        style={{
          animation: "naganiSlotRewardPotFloat 1300ms ease-in-out infinite",
        }}
      >
        <div className="absolute inset-x-1 bottom-0 h-5 rounded-full bg-[#ffd979]/24 blur-lg" />
        <img
          src={GOLD_POT_IMAGE}
          alt=""
          className="relative h-full w-full object-contain drop-shadow-[0_0_18px_rgba(255,232,163,0.48)]"
          draggable={false}
        />
      </div>

      <p className="relative text-[15px] font-black leading-none text-[#fff4c7] drop-shadow-[0_2px_8px_rgba(0,0,0,0.86)]">
        {getRewardOverlayTitle(winEvaluation)}
      </p>

      <div className="relative mx-auto mt-2 h-px w-[70%] bg-gradient-to-r from-transparent via-[#ffd979]/54 to-transparent" />

<p
  className="relative mt-2 text-[30px] font-black leading-none text-[#fff4c7] drop-shadow-[0_3px_9px_rgba(0,0,0,0.9)]"
  style={{
    animation:
      gameState === "settling"
        ? "naganiSlotRewardAmountPulse 520ms ease-in-out infinite"
        : undefined,
  }}
>
  + {formatMMK(lastWin)}
</p>

      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-[48%] bg-[linear-gradient(90deg,transparent,rgba(255,240,185,0.18),transparent)]"
        style={{
          animation: "naganiSlotRewardMedallionSweep 1280ms ease-out infinite",
        }}
      />
    </div>
  </div>
) : null}

{showFlyingRewardPot ? (
  <div
    className="pointer-events-none absolute left-1/2 top-[46%] z-[75] h-[64px] w-[84px]"
    style={flyingPotStyle}
  >
    <div className="absolute inset-x-1 bottom-0 h-5 rounded-full bg-[#ffd979]/28 blur-lg" />
    <img
      src={GOLD_POT_IMAGE}
      alt=""
      className="relative h-full w-full object-contain drop-shadow-[0_0_22px_rgba(255,232,163,0.68)]"
      draggable={false}
    />
  </div>
) : null}

<div className="relative flex h-full flex-col overflow-hidden pb-[calc(env(safe-area-inset-bottom)+16px)] pt-[env(safe-area-inset-top)]">
            <div className="pointer-events-none absolute inset-x-2 top-[58px] z-[12] h-[146px] rounded-b-[38px] border-x border-[#ffd979]/12 bg-[linear-gradient(180deg,rgba(255,218,121,0.08),rgba(108,18,8,0.12),transparent)] shadow-[inset_0_1px_0_rgba(255,240,185,0.08)]" />
            <div className="pointer-events-none absolute left-1/2 top-[66px] z-[13] h-[84px] w-[76%] -translate-x-1/2 rounded-full bg-[#ffd979]/10 blur-2xl" />

<NaganiSlotTopBar gameState={gameState} />

            <div className="relative z-20 flex min-h-0 flex-1 flex-col pt-1">
              <div className="relative mx-auto h-[clamp(390px,60dvh,510px)] w-full max-w-[430px] shrink-0">
                <NaganiSlotBoard
                  columns={slotColumns}
                  spinning={spinning}
                  stoppedReelCount={stoppedReelCount}
                  winEvaluation={winEvaluation}
                />
              </div>

              <div className="pointer-events-none relative z-[21] -mt-2 h-2 shrink-0">
                <div className="absolute inset-x-12 top-0 h-5 rounded-full bg-[#ffd979]/10 blur-xl" />
                <div className="absolute inset-x-14 top-1 h-px bg-gradient-to-r from-transparent via-[#fff0b9]/42 to-transparent" />
              </div>

              <div className="relative z-[22] shrink-0">
<NaganiSlotControls
  betAmount={betAmount}
  balance={balance}
  gameState={gameState}
  balancePulse={rewardTransferPhase === "landed"}
  lastWinAmount={lastWin}
  balanceTargetRef={balanceTargetRef}
  onDecrease={decreaseBet}
  onIncrease={increaseBet}
  onSelectBetAmount={selectBetAmount}
  onMaxBet={setMaxBetAmount}
  onSpin={handleSpin}
/>
              </div>

              <div className="pointer-events-none relative z-[18] mt-[-2px] min-h-[54px] flex-1 overflow-hidden">
                <div className="absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-[#ffd979]/34 to-transparent" />

                <div
                  className="absolute left-1/2 top-2 h-16 w-[82%] -translate-x-1/2 rounded-full bg-[#ffd979]/10 blur-2xl"
                  style={{
                    animation:
                      "naganiSlotBottomFloorGlow 3000ms ease-in-out infinite",
                  }}
                />

                <div
                  className="absolute left-1/2 top-0 h-[92px] w-[54%] -translate-x-1/2 rounded-b-[44px] bg-[linear-gradient(180deg,rgba(145,18,12,0.2),rgba(79,7,4,0.12),transparent)]"
                  style={{
                    animation:
                      "naganiSlotBottomCarpetBreath 3600ms ease-in-out infinite",
                  }}
                />

                <div className="absolute inset-x-10 top-5 h-px bg-gradient-to-r from-transparent via-[#b97823]/34 to-transparent" />
                <div className="absolute inset-x-16 top-11 h-px bg-gradient-to-r from-transparent via-[#7f4614]/22 to-transparent" />

                {roomReady ? (
                  <>
                    {Array.from({ length: 7 }).map((_, index) => (
                      <span
                        key={`nagani-slot-bottom-floor-dust-${index}`}
                        className="absolute h-1 w-1 rounded-full bg-[#fff0b9]"
                        style={{
                          left: `${18 + ((index * 13) % 62)}%`,
                          top: `${18 + ((index * 11) % 46)}%`,
                          animation: `naganiSlotBottomGoldDust ${
                            1800 + (index % 4) * 220
                          }ms ease-out ${index * 360}ms infinite`,
                          boxShadow: "0 0 8px rgba(255,232,163,0.42)",
                        }}
                      />
                    ))}
                  </>
                ) : null}
              </div>
            </div>

            <div className="relative z-20 h-1 shrink-0" />
          </div>
        </div>
      </div>
    </main>
  );
}