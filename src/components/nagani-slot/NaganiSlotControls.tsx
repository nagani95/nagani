// src/components/nagani-slot/NaganiSlotControls.tsx

import type { RefObject } from "react";
import type { NaganiSlotGameState } from "@/lib/naganiSlot/types";

type NaganiSlotControlsProps = {
  betAmount: number;
  balanceAmount: number;
  lastWinAmount?: number;
  balancePulse?: boolean;
  balanceTargetRef?: RefObject<HTMLDivElement | null>;
  gameState: NaganiSlotGameState;
  onDecrease: () => void;
  onIncrease: () => void;
  onSpin: () => void;
};

function formatMMK(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

function getSpinButtonText(gameState: NaganiSlotGameState) {
  if (gameState === "spinning") return "လှည့်နေသည်";
  if (gameState === "settling") return "ဆုစုနေသည်";
  if (gameState === "result") return "ထပ်လှည့်မည်";
  return "လှည့်မည်";
}

function getControlStatusLabel(gameState: NaganiSlotGameState) {
  if (gameState === "spinning") return "SPINNING";
  if (gameState === "settling") return "REWARD";
  if (gameState === "result") return "RESULT";
  return "READY";
}

export default function NaganiSlotControls({
  betAmount,
  balanceAmount,
  lastWinAmount = 0,
  balancePulse = false,
  balanceTargetRef,
  gameState,
  onDecrease,
  onIncrease,
  onSpin,
}: NaganiSlotControlsProps) {
  const controlsLocked = gameState === "spinning" || gameState === "settling";
  const readyToSpin = gameState === "ready" || gameState === "result";
  const activeMotion = gameState === "spinning" || gameState === "settling";
  const balanceGlow =
  balancePulse || gameState === "settling" || gameState === "result";

  return (
    <section className="relative z-30 mx-auto mt-2 w-[calc(100%-10px)] max-w-[420px] overflow-hidden rounded-[30px] border border-[#ffd979]/48 bg-[linear-gradient(180deg,#761d0e_0%,#3a0604_50%,#120000_100%)] px-3 pb-2.5 pt-2.5 shadow-[0_22px_58px_rgba(0,0,0,0.82),inset_0_1px_0_rgba(255,238,178,0.26),inset_0_-18px_36px_rgba(0,0,0,0.46)]">
      <style>{`
        @keyframes naganiSlotDockReadyGlow {
          0%, 100% {
            opacity: 0.26;
            transform: translateX(-50%) scaleX(0.82);
          }
          50% {
            opacity: 0.72;
            transform: translateX(-50%) scaleX(1);
          }
        }

        @keyframes naganiSlotSpinBreathV2 {
          0%, 100% {
            filter: brightness(1);
            box-shadow:
              0 16px 30px rgba(0,0,0,0.72),
              inset 0 2px 0 rgba(255,255,255,0.55),
              inset 0 -10px 18px rgba(87,0,0,0.42),
              0 0 18px rgba(255,218,121,0.16);
          }
          50% {
            filter: brightness(1.1);
            box-shadow:
              0 18px 34px rgba(0,0,0,0.76),
              inset 0 2px 0 rgba(255,255,255,0.62),
              inset 0 -10px 18px rgba(87,0,0,0.42),
              0 0 30px rgba(255,218,121,0.28);
          }
        }

        @keyframes naganiSlotSpinSweepV2 {
          0% {
            transform: translateX(-145%) skewX(-18deg);
            opacity: 0;
          }
          24% {
            opacity: 0.58;
          }
          100% {
            transform: translateX(145%) skewX(-18deg);
            opacity: 0;
          }
        }

        @keyframes naganiSlotStatusDotV2 {
          0%, 100% {
            opacity: 0.46;
            transform: scale(0.9);
          }
          50% {
            opacity: 1;
            transform: scale(1.08);
          }
        }

        @keyframes naganiSlotBalanceGlowV2 {
          0%, 100% {
            filter: brightness(1);
            box-shadow:
              inset 0 0 18px rgba(0,0,0,0.72),
              0 0 0 rgba(255,218,121,0);
          }
          50% {
            filter: brightness(1.12);
            box-shadow:
              inset 0 0 18px rgba(0,0,0,0.72),
              0 0 18px rgba(255,218,121,0.24);
          }
        }
                  @keyframes naganiSlotBalanceCatchV1 {
          0% {
            transform: scale(1);
            filter: brightness(1);
            box-shadow:
              inset 0 0 18px rgba(0,0,0,0.72),
              0 0 0 rgba(255,218,121,0);
          }
          34% {
            transform: scale(1.045);
            filter: brightness(1.32);
            box-shadow:
              inset 0 0 18px rgba(0,0,0,0.72),
              0 0 26px rgba(255,232,163,0.58),
              0 0 44px rgba(255,184,66,0.24);
          }
          100% {
            transform: scale(1);
            filter: brightness(1.08);
            box-shadow:
              inset 0 0 18px rgba(0,0,0,0.72),
              0 0 18px rgba(255,218,121,0.22);
          }
        }
      `}</style>

      <div className="pointer-events-none absolute inset-0 rounded-[30px] bg-[radial-gradient(circle_at_50%_0%,rgba(255,227,146,0.16),transparent_34%),radial-gradient(circle_at_50%_100%,rgba(255,190,74,0.08),transparent_38%)]" />
      <div className="pointer-events-none absolute inset-x-4 top-1 h-px bg-gradient-to-r from-transparent via-[#fff0b9]/72 to-transparent" />
      <div className="pointer-events-none absolute inset-x-8 bottom-0 h-px bg-gradient-to-r from-transparent via-[#b97823]/72 to-transparent" />

      <div
        className="pointer-events-none absolute left-1/2 top-0 h-12 w-[74%] rounded-full bg-[#ffd979]/14 blur-2xl"
        style={{
          animation: readyToSpin
            ? "naganiSlotDockReadyGlow 1900ms ease-in-out infinite"
            : undefined,
        }}
      />

      <div className="relative mb-1.5 flex items-center justify-between px-1">
        <div className="flex items-center gap-1.5">
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              activeMotion ? "bg-[#fff0b9]" : "bg-[#ffd979]/62"
            }`}
            style={{
              animation: activeMotion
                ? "naganiSlotStatusDotV2 620ms ease-in-out infinite"
                : undefined,
              boxShadow: activeMotion
                ? "0 0 10px rgba(255,232,163,0.86)"
                : "0 0 6px rgba(255,217,121,0.32)",
            }}
          />
          <p className="text-[8px] font-black tracking-[0.2em] text-[#ffd979]/58">
            {getControlStatusLabel(gameState)}
          </p>
        </div>

        <p className="text-[8px] font-black tracking-[0.16em] text-[#ffd979]/46">
          ROYAL CONTROL DOCK
        </p>
      </div>

      <div className="relative rounded-[21px] border border-[#a86a21]/70 bg-[linear-gradient(180deg,rgba(9,0,0,0.84),rgba(32,3,2,0.9))] p-1.5 shadow-[inset_0_0_18px_rgba(0,0,0,0.88),0_8px_16px_rgba(0,0,0,0.34)]">
        <div className="pointer-events-none absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-[#ffd979]/50 to-transparent" />

        <div className="grid grid-cols-2 gap-1.5">
          <div className="rounded-[16px] border border-[#7d4515]/72 bg-[radial-gradient(circle_at_50%_0%,rgba(255,217,121,0.12),rgba(61,7,3,0.62)_44%,rgba(0,0,0,0.5))] px-3 py-2 text-center">
            <p className="text-[8px] font-black tracking-[0.13em] text-[#ffd979]/55">
              လောင်းကြေး
            </p>
            <p className="mt-1 text-[18px] font-black leading-none text-[#fff1bd] drop-shadow-[0_2px_7px_rgba(0,0,0,0.78)]">
              {formatMMK(betAmount)}
            </p>
          </div>

<div
  ref={balanceTargetRef}
  className={`relative overflow-hidden rounded-[16px] border px-3 py-2 text-center ${
              balanceGlow
                ? "border-[#ffe5a0]/76 bg-[radial-gradient(circle_at_50%_0%,rgba(255,232,163,0.28),rgba(93,14,5,0.64)_48%,rgba(0,0,0,0.54))]"
                : "border-[#7d4515]/72 bg-[radial-gradient(circle_at_50%_0%,rgba(255,217,121,0.1),rgba(61,7,3,0.62)_44%,rgba(0,0,0,0.5))]"
            }`}
style={{
  animation: balancePulse
    ? "naganiSlotBalanceCatchV1 680ms ease-out both"
    : balanceGlow
      ? "naganiSlotBalanceGlowV2 1200ms ease-in-out infinite"
      : undefined,
}}
          >
            {balanceGlow ? (
              <span
                className="pointer-events-none absolute inset-y-0 left-0 w-[55%] bg-[linear-gradient(90deg,transparent,rgba(255,240,185,0.2),transparent)]"
                style={{
                  animation: "naganiSlotSpinSweepV2 1300ms ease-out infinite",
                }}
              />
            ) : null}

<p className="relative text-[8px] font-black tracking-[0.13em] text-[#ffd979]/55">
  {balancePulse && lastWinAmount > 0
    ? `အနိုင် + ${formatMMK(lastWinAmount)}`
    : "လက်ကျန်ငွေ"}
</p>
            <p className="relative mt-1 text-[17px] font-black leading-none text-[#fff1bd] drop-shadow-[0_2px_7px_rgba(0,0,0,0.78)]">
              {formatMMK(balanceAmount)}
            </p>
          </div>
        </div>
      </div>

      <div className="relative mt-2 grid grid-cols-[54px_1fr_54px] items-center gap-2">
        <button
          type="button"
          onClick={onDecrease}
          disabled={controlsLocked}
          className="h-[58px] rounded-[19px] border border-[#ffd979]/42 bg-[radial-gradient(circle_at_50%_18%,#4a170d,#120000_72%)] text-[24px] font-black text-[#ffe8a3] shadow-[0_10px_18px_rgba(0,0,0,0.48),inset_0_1px_0_rgba(255,232,163,0.22),inset_0_0_15px_rgba(0,0,0,0.78)] transition-transform active:translate-y-0.5 active:scale-[0.96] disabled:opacity-50"
          aria-label="Decrease bet"
        >
          −
        </button>

        <button
          type="button"
          onClick={onSpin}
          disabled={controlsLocked}
          className="relative h-[72px] overflow-hidden rounded-[28px] border border-[#fff0b9]/82 bg-[linear-gradient(180deg,#fff3b0_0%,#efbd4b_14%,#d62a18_47%,#980c07_74%,#5b0202_100%)] text-[24px] font-black text-white shadow-[0_16px_30px_rgba(0,0,0,0.72),inset_0_2px_0_rgba(255,255,255,0.55),inset_0_-10px_18px_rgba(87,0,0,0.42)] transition-transform active:translate-y-1 active:scale-[0.985] disabled:opacity-70"
          style={{
            animation: readyToSpin
              ? "naganiSlotSpinBreathV2 1600ms ease-in-out infinite"
              : undefined,
          }}
          aria-label="Spin"
        >
          <span className="pointer-events-none absolute inset-x-7 top-1.5 h-5 rounded-full bg-white/36 blur-[2px]" />
          <span className="pointer-events-none absolute inset-x-10 bottom-1.5 h-px bg-gradient-to-r from-transparent via-[#fff0b9]/72 to-transparent" />
          <span className="pointer-events-none absolute left-1/2 top-1/2 h-[86%] w-[94%] -translate-x-1/2 -translate-y-1/2 rounded-[26px] border border-[#ffd979]/22" />

          {readyToSpin ? (
            <span
              className="pointer-events-none absolute inset-y-0 left-0 w-[48%] bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.25),transparent)]"
              style={{
                animation: "naganiSlotSpinSweepV2 1900ms ease-out infinite",
              }}
            />
          ) : null}

          <span className="relative drop-shadow-[0_3px_6px_rgba(0,0,0,0.84)]">
            {getSpinButtonText(gameState)}
          </span>
        </button>

        <button
          type="button"
          onClick={onIncrease}
          disabled={controlsLocked}
          className="h-[58px] rounded-[19px] border border-[#ffd979]/42 bg-[radial-gradient(circle_at_50%_18%,#5b1c0e,#120000_72%)] text-[23px] font-black text-[#ffe8a3] shadow-[0_10px_18px_rgba(0,0,0,0.48),inset_0_1px_0_rgba(255,232,163,0.22),inset_0_0_15px_rgba(0,0,0,0.78)] transition-transform active:translate-y-0.5 active:scale-[0.96] disabled:opacity-50"
          aria-label="Increase bet"
        >
          +
        </button>
      </div>

      <div className="relative mt-2 grid grid-cols-3 gap-2">
        <button
          type="button"
          disabled={controlsLocked}
          className="h-[42px] rounded-[17px] border border-[#9e641d]/58 bg-[linear-gradient(180deg,rgba(58,9,4,0.72),rgba(7,0,0,0.82))] text-[11px] font-black text-[#ffe8a3]/78 shadow-[inset_0_0_14px_rgba(0,0,0,0.76),0_8px_14px_rgba(0,0,0,0.28)] transition-transform active:scale-[0.97] disabled:opacity-50"
        >
          Auto
        </button>

        <button
          type="button"
          disabled={controlsLocked}
          className="h-[42px] rounded-[17px] border border-[#c9882f]/66 bg-[linear-gradient(180deg,rgba(82,18,8,0.78),rgba(9,0,0,0.84))] text-[11px] font-black text-[#fff0b9]/88 shadow-[inset_0_0_14px_rgba(0,0,0,0.76),0_8px_14px_rgba(0,0,0,0.28)] transition-transform active:scale-[0.97] disabled:opacity-50"
        >
          Quick Bet
        </button>

        <button
          type="button"
          disabled={controlsLocked}
          className="h-[42px] rounded-[17px] border border-[#9e641d]/58 bg-[linear-gradient(180deg,rgba(58,9,4,0.72),rgba(7,0,0,0.82))] text-[11px] font-black text-[#ffe8a3]/78 shadow-[inset_0_0_14px_rgba(0,0,0,0.76),0_8px_14px_rgba(0,0,0,0.28)] transition-transform active:scale-[0.97] disabled:opacity-50"
        >
          Replay
        </button>
      </div>
    </section>
  );
}