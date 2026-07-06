// src/components/nagani-slot/NaganiSlotBoard.tsx

import { getReelSpinStrip } from "@/lib/naganiSlot/symbols";
import type {
  NaganiSlotPosition,
  NaganiSlotSymbol,
  NaganiSlotWinEvaluation,
  NaganiSlotWinTier,
} from "@/lib/naganiSlot/types";
const REEL_BLACKWOOD_IMAGE = "/assets/nagani/slot/ui/reel-blackwood-v1.png";
const BOARD_CABINET_SKIN_IMAGE = "/assets/nagani/slot/ui/board-cabinet-skin-v2.png";

type NaganiSlotBoardProps = {
  columns: NaganiSlotSymbol[][];
  spinning: boolean;
  stoppedReelCount: number;
  winEvaluation: NaganiSlotWinEvaluation | null;
};

function shouldShowSymbolLabel(_symbol: NaganiSlotSymbol) {
  return false;
}

function getSymbolGlow(symbol: NaganiSlotSymbol) {
  if (symbol.key === "crown") {
    return "drop-shadow-[0_0_22px_rgba(255,240,185,0.76)] drop-shadow-[0_0_14px_rgba(255,184,66,0.32)]";
  }

  if (symbol.key === "star") {
    return "drop-shadow-[0_0_20px_rgba(255,218,121,0.72)] drop-shadow-[0_0_14px_rgba(255,42,42,0.28)]";
  }

  if (symbol.tier === "high") {
    return "drop-shadow-[0_0_16px_rgba(255,202,96,0.55)]";
  }

  if (symbol.tier === "mid") {
    return "drop-shadow-[0_0_14px_rgba(226,154,72,0.42)]";
  }

  return "drop-shadow-[0_0_12px_rgba(184,104,44,0.34)]";
}

function getSymbolBoxClass(symbol: NaganiSlotSymbol) {
  if (symbol.key === "crown") {
    return "h-[91%] w-[112%]";
  }

  if (symbol.key === "star") {
    return "h-[88%] w-[112%]";
  }

  if (symbol.key === "dragon") {
    return "h-[91%] w-[118%]";
  }

  if (symbol.key === "buffalo") {
    return "h-[86%] w-[116%]";
  }

  if (symbol.key === "harp") {
    return "h-[86%] w-[112%]";
  }

  if (symbol.key === "bell") {
    return "h-[88%] w-[112%]";
  }

if (symbol.key === "bagan") {
  return "h-[90%] w-[112%]";
}

  return "h-[86%] w-[114%]";
}

function getWinningSymbolScale(symbol: NaganiSlotSymbol) {
  if (symbol.key === "crown") return 1.1;
  if (symbol.key === "star") return 1.1;
  return 1.08;
}

function getSpecialSymbolAuraClass(symbol: NaganiSlotSymbol) {
  if (symbol.key === "crown") {
    return "h-[76%] w-[92%] bg-[radial-gradient(circle,rgba(255,240,185,0.24),rgba(255,184,66,0.12)_42%,transparent_72%)]";
  }

  if (symbol.key === "star") {
    return "h-[74%] w-[92%] bg-[radial-gradient(circle,rgba(255,232,163,0.24),rgba(255,35,35,0.12)_42%,transparent_72%)]";
  }

  return "";
}

function getSymbolFootShadowStyle(symbol: NaganiSlotSymbol) {
  const isPremium =
    symbol.key === "crown" ||
    symbol.key === "star" ||
    symbol.key === "dragon" ||
    symbol.tier === "high";

  return {
    width: isPremium ? "78%" : "68%",
    height: isPremium ? "13%" : "10%",
    opacity: isPremium ? 0.46 : 0.34,
    background:
      "radial-gradient(ellipse, rgba(0,0,0,0.82), rgba(0,0,0,0.38) 46%, transparent 72%)",
    filter: "blur(5px)",
  };
}

function getSymbolImageStyle(symbol: NaganiSlotSymbol) {
  const baseScale = symbol.imageScale ?? 1;

  const fitScale =
    symbol.key === "dragon"
      ? 0.94
      : symbol.key === "star"
        ? 0.96
        : symbol.key === "crown"
          ? 0.96
          : symbol.key === "buffalo"
            ? 0.95
            : 1;

  const yOffset =
    symbol.key === "dragon"
      ? "1.5%"
: symbol.key === "bagan"
  ? "-1%"
        : symbol.key === "crown"
          ? "-1%"
          : "0%";

  const brightness =
    symbol.key === "star" || symbol.key === "crown"
      ? "brightness(1.08) contrast(1.05) saturate(1.08)"
      : symbol.tier === "high"
        ? "brightness(1.05) contrast(1.04) saturate(1.04)"
        : "brightness(1.02) contrast(1.03) saturate(1.02)";

  return {
    transform: `translateY(${yOffset}) scale(${baseScale * fitScale})`,
    filter: `${brightness} drop-shadow(0 10px 10px rgba(0,0,0,0.52))`,
  };
}

function getSymbolBackplateStyle(symbol: NaganiSlotSymbol) {
  const isPremium =
    symbol.key === "crown" ||
    symbol.key === "star" ||
    symbol.key === "dragon" ||
    symbol.tier === "high";

  return {
    opacity: isPremium ? 0.2 : 0.12,
    background: isPremium
      ? "radial-gradient(circle, rgba(255,230,151,0.3), rgba(255,170,58,0.08) 42%, transparent 70%)"
      : "radial-gradient(circle, rgba(255,214,122,0.18), rgba(255,170,58,0.05) 42%, transparent 72%)",
  };
}

function getWinningSymbolSparkCount(tier?: NaganiSlotWinTier) {
  if (tier === "big") return 5;
  if (tier === "medium") return 4;
  return 3;
}

function getWinningSymbolHalo(tier?: NaganiSlotWinTier) {
  if (tier === "big") {
    return {
      border: "1px solid rgba(255,240,185,0.58)",
      boxShadow:
        "0 0 22px rgba(255,232,163,0.74), 0 0 46px rgba(255,184,66,0.34), inset 0 0 20px rgba(255,218,121,0.2)",
      background:
        "radial-gradient(circle at 50% 50%, rgba(255,244,194,0.28), rgba(255,184,66,0.12) 42%, transparent 70%)",
    };
  }

  if (tier === "medium") {
    return {
      border: "1px solid rgba(255,224,138,0.46)",
      boxShadow:
        "0 0 18px rgba(255,224,138,0.62), 0 0 34px rgba(255,184,66,0.24), inset 0 0 18px rgba(255,218,121,0.16)",
      background:
        "radial-gradient(circle at 50% 50%, rgba(255,232,163,0.22), rgba(255,184,66,0.1) 42%, transparent 70%)",
    };
  }

  return {
    border: "1px solid rgba(255,217,121,0.36)",
    boxShadow:
      "0 0 14px rgba(255,217,121,0.48), 0 0 26px rgba(255,184,66,0.18), inset 0 0 15px rgba(255,218,121,0.12)",
    background:
      "radial-gradient(circle at 50% 50%, rgba(255,232,163,0.18), rgba(255,184,66,0.08) 42%, transparent 70%)",
  };
}

function isWinningPosition({
  position,
  winningPositions,
}: {
  position: NaganiSlotPosition;
  winningPositions: NaganiSlotPosition[];
}) {
  return winningPositions.some(
    (winningPosition) =>
      winningPosition.columnIndex === position.columnIndex &&
      winningPosition.rowIndex === position.rowIndex
  );
}

function getWinTierLabel(tier: NaganiSlotWinTier) {
  if (tier === "big") return "BIG WIN";
  if (tier === "medium") return "GOOD WIN";
  if (tier === "small") return "WIN";
  return "READY";
}

function getWinTierBoardBorder(tier?: NaganiSlotWinTier) {
  if (tier === "big") return "border-[#fff0b9]/95";
  if (tier === "medium") return "border-[#ffe08a]/85";
  if (tier === "small") return "border-[#ffd979]/75";
  return "border-[#ffdf8a]/55";
}

function getWinTierLineStyle(tier: NaganiSlotWinTier) {
  if (tier === "big") {
    return {
      height: 7,
      boxShadow:
        "0 0 18px rgba(255, 232, 163, 0.88), 0 0 44px rgba(255, 190, 74, 0.48)",
      background:
        "linear-gradient(90deg, transparent, rgba(255,255,255,0.96), rgba(255,214,112,0.98), rgba(255,117,34,0.78), transparent)",
    };
  }

  if (tier === "medium") {
    return {
      height: 6,
      boxShadow:
        "0 0 15px rgba(255, 224, 138, 0.76), 0 0 32px rgba(255, 190, 74, 0.36)",
      background:
        "linear-gradient(90deg, transparent, rgba(255,244,190,0.9), rgba(255,211,101,0.94), transparent)",
    };
  }

  return {
    height: 5,
    boxShadow:
      "0 0 12px rgba(255, 218, 121, 0.68), 0 0 24px rgba(255, 190, 74, 0.26)",
    background:
      "linear-gradient(90deg, transparent, rgba(255,232,163,0.82), rgba(255,206,93,0.9), transparent)",
  };
}

function getReelSpinDuration(columnIndex: number, anticipating: boolean) {
  if (anticipating) return 760;
  return 980 + columnIndex * 92;
}

function getReelSpinFilter(anticipating: boolean) {
  if (anticipating) {
    return "blur(0.48px) brightness(1.2) saturate(1.14)";
  }

  return "blur(0.34px) brightness(1.08) saturate(1.08)";
}

function getReelSpinOpacity(anticipating: boolean) {
  return anticipating ? 0.96 : 0.92;
}

function getReelStopAnimation(isLastReel: boolean) {
  if (isLastReel) {
    return "naganiSlotFinalReelStopBounce 520ms cubic-bezier(.13,.94,.24,1.18)";
  }

  return "naganiSlotReelStopBounce 390ms cubic-bezier(.16,.92,.32,1.18)";
}

function ReelSymbol({
  symbol,
  spinning = false,
  winning = false,
  dimmed = false,
  winTier,
}: {
  symbol: NaganiSlotSymbol;
  spinning?: boolean;
  winning?: boolean;
  dimmed?: boolean;
  winTier?: NaganiSlotWinTier;
}) {
  const sparkCount = getWinningSymbolSparkCount(winTier);
  const symbolBoxClass = getSymbolBoxClass(symbol);
  const winningScale = getWinningSymbolScale(symbol);
  const specialAuraClass = getSpecialSymbolAuraClass(symbol);
  const symbolImageStyle = getSymbolImageStyle(symbol);

  return (
    <div
      className="relative flex h-full items-center justify-center transition duration-300"
      style={{
        ...(winning
          ? {
              animation:
                "naganiSlotWinningSymbolFocusIn 240ms ease-out both, naganiSlotWinningSymbolBreath 900ms ease-in-out 260ms infinite",
            }
          : {}),
        ...(dimmed
          ? {
              opacity: 0.42,
              filter: "saturate(0.56) brightness(0.58)",
            }
          : {}),
      }}
    >
      {winning ? (
        <>
          <div
            className="pointer-events-none absolute rounded-[26px]"
            style={{
              inset: "-5px",
              animation: "naganiSlotWinningHaloBreath 980ms ease-in-out infinite",
              ...getWinningSymbolHalo(winTier),
            }}
          />

          <div
            className="pointer-events-none absolute inset-x-[-8px] top-1/2 h-[58%] -translate-y-1/2 rounded-full bg-[#ffd979]/18 blur-xl"
            style={{
              animation:
                "naganiSlotWinningSpotlight 860ms ease-in-out infinite",
            }}
          />

          <div
            className="pointer-events-none absolute inset-x-1 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-[#fff0b9]/62 to-transparent"
            style={{
              animation: "naganiSlotWinningLightLine 760ms ease-out infinite",
            }}
          />

          {Array.from({ length: sparkCount }).map((_, index) => (
            <span
              key={`symbol-win-spark-${symbol.key}-${index}`}
              className="pointer-events-none absolute z-30 h-1 w-1 rounded-full bg-[#fff0b9]"
              style={{
                left: `${24 + ((index * 19) % 52)}%`,
                top: `${24 + ((index * 31) % 48)}%`,
                animation: `naganiSlotSymbolSparkSoft ${
                  720 + (index % 3) * 80
                }ms ease-out ${index * 110}ms infinite`,
                boxShadow:
                  "0 0 8px rgba(255, 232, 163, 0.86), 0 0 14px rgba(255, 184, 66, 0.34)",
              }}
            />
          ))}
        </>
      ) : null}

      <div className="pointer-events-none absolute inset-x-2 top-0 h-px bg-gradient-to-r from-transparent via-[#ffd979]/14 to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,214,122,0.075),transparent_54%)]" />

<div
  className="pointer-events-none absolute left-1/2 top-1/2 z-[9] h-[76%] w-[86%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-md"
  style={getSymbolBackplateStyle(symbol)}
/>

<div
  className="pointer-events-none absolute left-1/2 bottom-[13%] z-[11] -translate-x-1/2 rounded-full"
  style={getSymbolFootShadowStyle(symbol)}
/>

{specialAuraClass ? (
  <div
    className={`pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 rounded-full blur-md ${specialAuraClass}`}
    style={{
      animation: "naganiSlotSpecialSymbolAuraBreath 1900ms ease-in-out infinite",
    }}
  />
) : null}

<div
  className={`relative z-20 grid ${symbolBoxClass} place-items-center overflow-visible ${getSymbolGlow(
    symbol
  )} ${spinning ? "opacity-95" : ""} transition-transform duration-300`}
  style={{
    transform: winning ? `scale(${winningScale})` : undefined,
  }}
>
        {symbol.imageSrc ? (
          <>
            <img
              src={symbol.imageSrc}
              alt=""
              className="h-full w-full max-w-none object-contain"
style={symbolImageStyle}
              draggable={false}
              onError={(event) => {
                event.currentTarget.style.display = "none";

                const fallback = event.currentTarget
                  .nextElementSibling as HTMLElement | null;

                if (fallback) {
                  fallback.style.display = "inline";
                }
              }}
            />

            <span
              className="hidden text-[clamp(44px,12vw,64px)] leading-none"
style={symbolImageStyle}
            >
              {symbol.emoji}
            </span>
          </>
        ) : (
          <span
            className="text-[clamp(44px,12vw,64px)] leading-none"
style={symbolImageStyle}
          >
            {symbol.emoji}
          </span>
        )}
      </div>

      {shouldShowSymbolLabel(symbol) ? (
        <p className="absolute bottom-[13%] left-1 right-1 truncate text-center text-[7px] font-black leading-none text-[#ffe7a0]/85 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
          {symbol.shortLabel}
        </p>
      ) : null}
    </div>
  );
}

function StoppedReel({
  column,
  columnIndex,
  reelJustStopped,
  winningPositions,
  dimNonWinning,
isLastReel,
winTier,
}: {
  column: NaganiSlotSymbol[];
  columnIndex: number;
  reelJustStopped: boolean;
  winningPositions: NaganiSlotPosition[];
  dimNonWinning: boolean;
  isLastReel: boolean;
  winTier: NaganiSlotWinTier;
}) {
  return (
    <div
      className="relative h-full overflow-hidden"
style={
  reelJustStopped
    ? {
        animation: getReelStopAnimation(isLastReel),
        transformOrigin: "50% 50%",
        willChange: "transform, filter",
      }
    : undefined
}
    >
      {reelJustStopped ? (
        <>
          <div
            className="pointer-events-none absolute inset-0 z-40 bg-[linear-gradient(180deg,transparent,rgba(255,232,163,0.22),transparent)]"
            style={{
              animation: "naganiSlotReelStopGoldFlash 420ms ease-out both",
            }}
          />

          <div
            className="pointer-events-none absolute left-1/2 top-1/2 z-40 h-[72%] w-[120%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ffd979]/12 blur-xl"
            style={{
              animation: "naganiSlotReelStopCoreGlow 420ms ease-out both",
            }}
          />

          {isLastReel ? (
            <div
              className="pointer-events-none absolute inset-y-0 left-0 z-40 w-[56%] bg-[linear-gradient(90deg,transparent,rgba(255,247,206,0.26),transparent)]"
              style={{
                animation: "naganiSlotFinalReelSweep 520ms ease-out both",
              }}
            />
          ) : null}
        </>
      ) : null}

      {column.map((symbol, rowIndex) => {
        const winning = isWinningPosition({
          position: { columnIndex, rowIndex },
          winningPositions,
        });

        return (
          <div
            key={`${symbol.key}-stopped-${columnIndex}-${rowIndex}`}
            className="absolute left-0 right-0"
            style={{
              top: `${rowIndex * 33.3333}%`,
              height: "33.3333%",
            }}
          >
<ReelSymbol
  symbol={symbol}
  winning={winning}
  dimmed={dimNonWinning && !winning}
  winTier={winTier}
/>
          </div>
        );
      })}
    </div>
  );
}

function SpinningReel({
  columnIndex,
  spinStrip,
  anticipating,
}: {
  columnIndex: number;
  spinStrip: NaganiSlotSymbol[];
  anticipating: boolean;
}) {
  const spinDuration = getReelSpinDuration(columnIndex, anticipating);

  return (
    <>
      <div
        className="absolute inset-x-0 top-0 will-change-transform"
style={{
  height: `${(spinStrip.length / 3) * 100}%`,
  animation: `naganiSlotReelScroll ${spinDuration}ms linear -${
    columnIndex * 115
  }ms infinite`,
  filter: getReelSpinFilter(anticipating),
  opacity: getReelSpinOpacity(anticipating),
}}
      >
        {spinStrip.map((symbol, stripIndex) => (
          <div
            key={`${symbol.key}-${columnIndex}-spin-${stripIndex}`}
            style={{
              height: `${100 / spinStrip.length}%`,
            }}
          >
            <ReelSymbol symbol={symbol} spinning />
          </div>
        ))}
      </div>

      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-30 h-[32%] bg-[linear-gradient(180deg,rgba(255,232,163,0.12),transparent)]"
        style={{
          animation: "naganiSlotReelMotionVeil 520ms ease-in-out infinite",
        }}
      />

      <div
        className="pointer-events-none absolute inset-y-0 left-1/2 z-30 w-[34%] -translate-x-1/2 bg-[linear-gradient(180deg,transparent,rgba(255,240,185,0.085),transparent)]"
        style={{
          animation: `naganiSlotReelSpeedLines ${
            anticipating ? 420 : 560
          }ms linear infinite`,
        }}
      />

      {anticipating ? (
        <>
          <div
            className="pointer-events-none absolute inset-0 z-40 bg-[radial-gradient(circle_at_50%_50%,rgba(255,232,163,0.2),transparent_62%)]"
            style={{
              animation:
                "naganiSlotFinalReelAnticipationGlow 620ms ease-in-out infinite",
            }}
          />

          <div
            className="pointer-events-none absolute inset-x-1 top-1/2 z-40 h-px bg-gradient-to-r from-transparent via-[#fff0b9]/70 to-transparent"
            style={{
              animation:
                "naganiSlotFinalReelAnticipationLine 520ms ease-in-out infinite",
            }}
          />

          {Array.from({ length: 5 }).map((_, index) => (
            <span
              key={`nagani-slot-anticipation-spark-${columnIndex}-${index}`}
              className="pointer-events-none absolute z-40 h-1 w-1 rounded-full bg-[#fff0b9]"
              style={{
                left: `${22 + index * 13}%`,
                top: `${20 + ((index * 19) % 58)}%`,
                animation: `naganiSlotFinalReelSpark ${
                  520 + index * 70
                }ms ease-out ${index * 60}ms infinite`,
                boxShadow: "0 0 8px rgba(255,232,163,0.9)",
              }}
            />
          ))}
        </>
      ) : null}
    </>
  );
}

export default function NaganiSlotBoard({
  columns,
  spinning,
  stoppedReelCount,
  winEvaluation,
}: NaganiSlotBoardProps) {
  const hasResult = Boolean(winEvaluation);
  const hasWin = Boolean(winEvaluation && winEvaluation.tier !== "none");
  const hasNoWin = winEvaluation?.tier === "none";
const isMediumWin = winEvaluation?.tier === "medium";
const isBigWin = winEvaluation?.tier === "big";
const showMajorCelebration = Boolean(isMediumWin || isBigWin);
const showBoardCelebrationAura = hasWin && !spinning;
const isIdleReady = !spinning && !winEvaluation;
  const winningPositions = winEvaluation?.winningPositions ?? [];
  const dimNonWinning = hasWin && !spinning;
  const boardGoldDustCount = isBigWin ? 18 : isMediumWin ? 12 : hasWin ? 6 : 0;

  return (
     <section className="relative z-20 mx-auto mt-0 flex h-full min-h-0 w-full max-w-[426px] shrink-0 px-1">
      <style>{`
        @keyframes naganiSlotReelScroll {
          0% {
            transform: translate3d(0, -50%, 0);
          }
          100% {
            transform: translate3d(0, 0%, 0);
          }
        }
          
        @keyframes naganiSlotReelMotionVeil {
  0%, 100% {
    opacity: 0.12;
    transform: translateY(-8%);
  }
  50% {
    opacity: 0.32;
    transform: translateY(8%);
  }
}

@keyframes naganiSlotReelSpeedLines {
  0% {
    opacity: 0.1;
    transform: translate(-50%, -22%);
  }
  42% {
    opacity: 0.28;
  }
  100% {
    opacity: 0.08;
    transform: translate(-50%, 22%);
  }
}

@keyframes naganiSlotSpinVignetteBreath {
  0%, 100% {
    opacity: 0.34;
  }
  50% {
    opacity: 0.58;
  }
}

@keyframes naganiSlotSpinPressureRing {
  0%, 100% {
    opacity: 0.16;
    transform: translate(-50%, -50%) scale(0.96);
  }
  50% {
    opacity: 0.38;
    transform: translate(-50%, -50%) scale(1.04);
  }
}

        @keyframes naganiSlotSpecialSymbolAuraBreath {
          0%, 100% {
            opacity: 0.52;
            transform: translate(-50%, -50%) scale(0.94);
            filter: brightness(1);
          }
          50% {
            opacity: 0.92;
            transform: translate(-50%, -50%) scale(1.04);
            filter: brightness(1.16);
          }
        }

@keyframes naganiSlotReelStopBounce {
  0% {
    transform: translateY(-22px) scaleY(1.04);
    filter: blur(0.6px) brightness(1.26);
  }
  48% {
    transform: translateY(8px) scaleY(0.984);
    filter: blur(0.2px) brightness(1.1);
  }
  74% {
    transform: translateY(-2px) scaleY(1.006);
    filter: brightness(1.05);
  }
  100% {
    transform: translateY(0) scaleY(1);
    filter: brightness(1);
  }
}

@keyframes naganiSlotFinalReelStopBounce {
  0% {
    transform: translateY(-30px) scaleY(1.06);
    filter: blur(0.7px) brightness(1.42);
  }
  42% {
    transform: translateY(11px) scaleY(0.972);
    filter: blur(0.25px) brightness(1.18);
  }
  68% {
    transform: translateY(-4px) scaleY(1.014);
    filter: brightness(1.1);
  }
  100% {
    transform: translateY(0) scaleY(1);
    filter: brightness(1);
  }
}

        @keyframes naganiSlotReelStopGoldFlash {
          0% {
            opacity: 0;
            transform: scaleY(0.28);
          }
          28% {
            opacity: 0.95;
            transform: scaleY(1);
          }
          100% {
            opacity: 0;
            transform: scaleY(1.18);
          }
        }

        @keyframes naganiSlotReelStopCoreGlow {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.72);
          }
          35% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1.02);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(1.18);
          }
        }

        @keyframes naganiSlotFinalReelSweep {
          0% {
            opacity: 0;
            transform: translateX(-120%) skewX(-16deg);
          }
          32% {
            opacity: 0.78;
          }
          100% {
            opacity: 0;
            transform: translateX(150%) skewX(-16deg);
          }
        }

        @keyframes naganiSlotFinalReelAnticipationGlow {
          0%, 100% {
            opacity: 0.16;
            filter: brightness(1);
          }
          50% {
            opacity: 0.42;
            filter: brightness(1.26);
          }
        }

        @keyframes naganiSlotFinalReelAnticipationLine {
          0%, 100% {
            opacity: 0.22;
            transform: scaleX(0.68);
          }
          50% {
            opacity: 0.86;
            transform: scaleX(1);
          }
        }

        @keyframes naganiSlotFinalReelSpark {
          0% {
            opacity: 0;
            transform: translateY(10px) scale(0.5);
          }
          30% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translateY(-22px) scale(1);
          }
        }

        @keyframes naganiSlotBoardSpinGlow {
          0%, 100% {
            opacity: 0.18;
          }
          50% {
            opacity: 0.42;
          }
        }

                @keyframes naganiSlotIdleBoardBreath {
          0%, 100% {
            filter: brightness(1);
            box-shadow:
              0 24px 66px rgba(0,0,0,0.88),
              inset 0 0 44px rgba(0,0,0,0.94),
              0 0 0 rgba(255,218,121,0);
          }
          50% {
            filter: brightness(1.035);
            box-shadow:
              0 24px 66px rgba(0,0,0,0.88),
              inset 0 0 44px rgba(0,0,0,0.94),
              0 0 18px rgba(255,218,121,0.1);
          }
        }

                @keyframes naganiSlotRoyalFrameBreath {
          0%, 100% {
            opacity: 0.42;
            filter: brightness(1);
          }
          50% {
            opacity: 0.72;
            filter: brightness(1.18);
          }
        }

        @keyframes naganiSlotRoyalCornerGlow {
          0%, 100% {
            opacity: 0.46;
            transform: scale(0.96);
            filter: brightness(1);
          }
          50% {
            opacity: 0.9;
            transform: scale(1.04);
            filter: brightness(1.22);
          }
        }

        @keyframes naganiSlotBoardBaseHeat {
          0%, 100% {
            opacity: 0.18;
            transform: translateX(-50%) scaleX(0.9);
          }
          50% {
            opacity: 0.42;
            transform: translateX(-50%) scaleX(1);
          }
        }

        @keyframes naganiSlotIdleBoardSheen {
          0% {
            opacity: 0;
            transform: translateX(-135%) skewX(-16deg);
          }
          18% {
            opacity: 0.2;
          }
          44%, 100% {
            opacity: 0;
            transform: translateX(135%) skewX(-16deg);
          }
        }

        @keyframes naganiSlotIdleReelSheen {
          0% {
            opacity: 0;
            transform: translateY(-110%);
          }
          22% {
            opacity: 0.22;
          }
          58%, 100% {
            opacity: 0;
            transform: translateY(110%);
          }
        }

        @keyframes naganiSlotWinningSymbolPulse {
          0%, 100% {
            filter: brightness(1);
          }
          50% {
            filter: brightness(1.34);
          }
        }

                @keyframes naganiSlotWinningSymbolFocusIn {
          0% {
            transform: scale(0.92);
            filter: brightness(1);
          }
          62% {
            transform: scale(1.08);
            filter: brightness(1.28);
          }
          100% {
            transform: scale(1);
            filter: brightness(1.1);
          }
        }

        @keyframes naganiSlotWinningSymbolBreath {
          0%, 100% {
            filter: brightness(1.08);
          }
          50% {
            filter: brightness(1.3);
          }
        }

        @keyframes naganiSlotWinningHaloBreath {
          0%, 100% {
            opacity: 0.62;
            transform: scale(0.96);
          }
          50% {
            opacity: 1;
            transform: scale(1.04);
          }
        }

        @keyframes naganiSlotWinningSpotlight {
          0%, 100% {
            opacity: 0.42;
            transform: translateY(-50%) scaleX(0.82);
          }
          50% {
            opacity: 0.78;
            transform: translateY(-50%) scaleX(1);
          }
        }

        @keyframes naganiSlotWinningLightLine {
          0% {
            opacity: 0;
            transform: translateY(-50%) scaleX(0.42);
          }
          28% {
            opacity: 0.82;
          }
          100% {
            opacity: 0;
            transform: translateY(-50%) scaleX(1.08);
          }
        }

        @keyframes naganiSlotSymbolSparkSoft {
          0% {
            transform: translateY(8px) scale(0.42);
            opacity: 0;
          }
          34% {
            opacity: 0.9;
          }
          100% {
            transform: translateY(-18px) scale(0.92);
            opacity: 0;
          }
        }

        @keyframes naganiSlotWinningRing {
          0% {
            transform: scale(0.82);
            opacity: 0;
          }
          28% {
            opacity: 0.78;
          }
          100% {
            transform: scale(1.18);
            opacity: 0;
          }
        }

        @keyframes naganiSlotSymbolSpark {
          0% {
            transform: translateY(8px) scale(0.45);
            opacity: 0;
          }
          32% {
            opacity: 1;
          }
          100% {
            transform: translateY(-20px) scale(1);
            opacity: 0;
          }
        }

        @keyframes naganiSlotBoardWinFlashSweep {
          0% {
            transform: translateX(-135%) skewX(-16deg);
            opacity: 0;
          }
          22% {
            opacity: 0.86;
          }
          100% {
            transform: translateX(135%) skewX(-16deg);
            opacity: 0;
          }
        }

        @keyframes naganiSlotBoardWinAuraPulse {
          0%, 100% {
            opacity: 0.18;
            filter: brightness(1);
          }
          50% {
            opacity: 0.38;
            filter: brightness(1.32);
          }
        }

        @keyframes naganiSlotBoardGoldDust {
          0% {
            transform: translateY(18px) scale(0.55);
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          100% {
            transform: translateY(-54px) scale(1.05);
            opacity: 0;
          }
        }

        @keyframes naganiSlotResultBadgePulse {
          0%, 100% {
            transform: translate(-50%, 0) scale(1);
            filter: brightness(1);
          }
          50% {
            transform: translate(-50%, -1px) scale(1.035);
            filter: brightness(1.18);
          }
        }

        @keyframes naganiSlotResultBadgeIn {
          0% {
            transform: translate(-50%, 16px) scale(0.92);
            opacity: 0;
          }
          100% {
            transform: translate(-50%, 0) scale(1);
            opacity: 1;
          }
        }

        @keyframes naganiSlotWinLineIn {
          0% {
            transform: scaleX(0.12);
            opacity: 0;
          }
          100% {
            transform: scaleX(1);
            opacity: 1;
          }
        }

        @keyframes naganiSlotWinLinePulse {
          0%, 100% {
            opacity: 0.78;
            filter: brightness(1);
          }
          50% {
            opacity: 1;
            filter: brightness(1.35);
          }
        }

        @keyframes naganiSlotSparkPop {
          0%, 100% {
            transform: scale(0.78);
            opacity: 0.45;
          }
          50% {
            transform: scale(1.12);
            opacity: 1;
          }
        }

        @keyframes naganiSlotMajorBoardShake {
          0%, 100% {
            transform: translate3d(0, 0, 0);
          }
          18% {
            transform: translate3d(-2px, 1px, 0);
          }
          36% {
            transform: translate3d(2px, -1px, 0);
          }
          54% {
            transform: translate3d(-1px, -1px, 0);
          }
          72% {
            transform: translate3d(1px, 1px, 0);
          }
        }

        @keyframes naganiSlotGoldFlash {
          0% {
            opacity: 0;
            transform: scale(0.86);
          }
          28% {
            opacity: 0.9;
            transform: scale(1.05);
          }
          100% {
            opacity: 0.18;
            transform: scale(1.18);
          }
        }

        @keyframes naganiSlotCelebrationTitleIn {
          0% {
            opacity: 0;
            transform: translate(-50%, -8px) scale(0.84);
            letter-spacing: 0.04em;
          }
          60% {
            opacity: 1;
            transform: translate(-50%, 0) scale(1.08);
          }
          100% {
            opacity: 1;
            transform: translate(-50%, 0) scale(1);
            letter-spacing: 0.01em;
          }
        }

        @keyframes naganiSlotRaySpin {
          0% {
            transform: rotate(0deg) scale(0.85);
            opacity: 0.08;
          }
          50% {
            opacity: 0.34;
          }
          100% {
            transform: rotate(16deg) scale(1.08);
            opacity: 0.12;
          }
        }

        @keyframes naganiSlotSparkFloat {
          0% {
            transform: translateY(10px) scale(0.6);
            opacity: 0;
          }
          25% {
            opacity: 1;
          }
          100% {
            transform: translateY(-34px) scale(1.05);
            opacity: 0;
          }
        }
      `}</style>
      
      <div className="pointer-events-none absolute -inset-x-4 top-12 z-[1] h-[74%] rounded-[34px] bg-[#ffd979]/16 blur-2xl" />
      <div
        className="pointer-events-none absolute left-1/2 -bottom-6 z-[1] h-16 w-[78%] -translate-x-1/2 rounded-full bg-[#ffd979]/14 blur-2xl"
        style={{
          animation: "naganiSlotBoardBaseHeat 2600ms ease-in-out infinite",
        }}
      />

<img
  src={BOARD_CABINET_SKIN_IMAGE}
  alt=""
  className="pointer-events-none absolute inset-0 z-[8] h-full w-full object-fill"
  style={{
    transform: "scale(1.01)",
    transformOrigin: "center center",
    filter:
      "drop-shadow(0 10px 22px rgba(0,0,0,0.74)) drop-shadow(0 0 10px rgba(255,190,74,0.14))",
  }}
  draggable={false}
/>

<div
    className={`relative z-10 h-full min-h-0 w-full overflow-hidden rounded-[24px] border bg-[#050000] shadow-[0_24px_66px_rgba(0,0,0,0.88),0_0_30px_rgba(255,190,74,0.075),inset_0_0_44px_rgba(0,0,0,0.94)] ${
          spinning
            ? "border-[#ffe8a3]/75"
            : hasWin && winEvaluation
              ? getWinTierBoardBorder(winEvaluation.tier)
              : getWinTierBoardBorder()
        }`}
style={
  isBigWin
    ? {
        animation:
          "naganiSlotMajorBoardShake 520ms ease-in-out 1 both",
      }
    : isIdleReady
      ? {
          animation:
            "naganiSlotIdleBoardBreath 3200ms ease-in-out infinite",
        }
      : undefined
}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,225,142,0.18),transparent_21%),linear-gradient(180deg,rgba(116,22,11,0.42),rgba(8,0,0,0.96)_30%,#030000_100%)]" />
                <div className="pointer-events-none absolute inset-x-8 top-0 z-[4] h-px bg-gradient-to-r from-transparent via-[#fff0b9]/76 to-transparent" />
        <div className="pointer-events-none absolute inset-x-10 bottom-0 z-[4] h-px bg-gradient-to-r from-transparent via-[#c9872f]/62 to-transparent" />
        <div className="pointer-events-none absolute left-1/2 top-1 z-[5] h-5 w-[62%] -translate-x-1/2 rounded-full bg-[#ffd979]/10 blur-lg" />
                <div
          className="pointer-events-none absolute inset-x-3 top-2 z-[6] h-[18px] rounded-t-[18px] border-t border-[#fff0b9]/22 bg-[linear-gradient(180deg,rgba(255,232,163,0.12),rgba(139,34,12,0.08),transparent)]"
          style={{
            animation: "naganiSlotRoyalFrameBreath 2800ms ease-in-out infinite",
          }}
        />

        <div className="pointer-events-none absolute left-3 top-3 z-[7] h-7 w-7 rounded-br-[18px] border-b border-r border-[#ffd979]/26 bg-[radial-gradient(circle_at_0%_0%,rgba(255,232,163,0.28),rgba(120,26,9,0.14)_42%,transparent_72%)]" />
        <div className="pointer-events-none absolute right-3 top-3 z-[7] h-7 w-7 rounded-bl-[18px] border-b border-l border-[#ffd979]/26 bg-[radial-gradient(circle_at_100%_0%,rgba(255,232,163,0.28),rgba(120,26,9,0.14)_42%,transparent_72%)]" />
        <div className="pointer-events-none absolute bottom-3 left-3 z-[7] h-7 w-7 rounded-tr-[18px] border-r border-t border-[#ffd979]/20 bg-[radial-gradient(circle_at_0%_100%,rgba(255,218,121,0.18),rgba(88,18,7,0.12)_42%,transparent_72%)]" />
        <div className="pointer-events-none absolute bottom-3 right-3 z-[7] h-7 w-7 rounded-tl-[18px] border-l border-t border-[#ffd979]/20 bg-[radial-gradient(circle_at_100%_100%,rgba(255,218,121,0.18),rgba(88,18,7,0.12)_42%,transparent_72%)]" />

        <div
          className="pointer-events-none absolute left-1/2 top-2.5 z-[8] h-2 w-[34%] -translate-x-1/2 rounded-full bg-[#fff0b9]/20 blur-md"
          style={{
            animation: "naganiSlotRoyalCornerGlow 2400ms ease-in-out infinite",
          }}
        />

        <div className="pointer-events-none absolute inset-x-2 top-[34px] z-[6] h-px bg-gradient-to-r from-transparent via-[#d69a37]/38 to-transparent" />
        <div className="pointer-events-none absolute inset-x-2 bottom-[34px] z-[6] h-px bg-gradient-to-r from-transparent via-[#b97823]/34 to-transparent" />
        {isIdleReady ? (
  <div
    className="pointer-events-none absolute inset-y-0 left-0 z-[18] w-[46%] bg-[linear-gradient(90deg,transparent,rgba(255,240,185,0.09),transparent)]"
    style={{
      animation: "naganiSlotIdleBoardSheen 4200ms ease-in-out infinite",
    }}
  />
) : null}

{spinning ? (
  <>
    <div
      className="pointer-events-none absolute inset-0 z-[18] bg-[radial-gradient(circle_at_50%_42%,rgba(255,218,121,0.22),transparent_52%)]"
      style={{
        animation: "naganiSlotBoardSpinGlow 620ms ease-in-out infinite",
      }}
    />

    <div
      className="pointer-events-none absolute inset-0 z-[19] bg-[linear-gradient(180deg,rgba(0,0,0,0.28),transparent_24%,transparent_76%,rgba(0,0,0,0.36))]"
      style={{
        animation: "naganiSlotSpinVignetteBreath 840ms ease-in-out infinite",
      }}
    />

    <div
      className="pointer-events-none absolute left-1/2 top-1/2 z-[19] h-[82%] w-[72%] -translate-x-1/2 -translate-y-1/2 rounded-[999px] border border-[#ffd979]/16"
      style={{
        animation: "naganiSlotSpinPressureRing 760ms ease-in-out infinite",
      }}
    />
  </>
) : null}

        {hasWin ? (
          <>
            <div
              className="pointer-events-none absolute inset-0 z-20 bg-[radial-gradient(circle_at_50%_48%,rgba(255,232,163,0.22),rgba(255,184,66,0.08)_42%,transparent_66%)]"
              style={{
                animation:
                  "naganiSlotBoardWinAuraPulse 980ms ease-in-out infinite",
              }}
            />

            <div className="pointer-events-none absolute inset-0 z-[35] overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 w-[54%] bg-[linear-gradient(90deg,transparent,rgba(255,248,210,0.28),rgba(255,190,74,0.16),transparent)]"
                style={{
                  animation:
                    "naganiSlotBoardWinFlashSweep 760ms ease-out 1 both",
                }}
              />

              {Array.from({ length: boardGoldDustCount }).map((_, index) => (
                <span
                  key={`nagani-slot-board-dust-${index}`}
                  className="absolute h-1.5 w-1.5 rounded-full bg-[#fff0b9]"
                  style={{
                    left: `${8 + ((index * 19) % 84)}%`,
                    top: `${42 + ((index * 13) % 42)}%`,
                    animation: `naganiSlotBoardGoldDust ${
                      720 + (index % 5) * 110
                    }ms ease-out ${index * 38}ms infinite`,
                    boxShadow:
                      "0 0 9px rgba(255, 232, 163, 0.9), 0 0 18px rgba(255, 184, 66, 0.42)",
                  }}
                />
              ))}
            </div>
          </>
        ) : null}

{showBoardCelebrationAura && winEvaluation ? (
  <div className="pointer-events-none absolute inset-0 z-[38] overflow-hidden">
    {showMajorCelebration ? (
      <>
        <div
          className="absolute left-1/2 top-[42%] h-[230px] w-[230px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,241,184,0.28),rgba(255,184,66,0.15)_38%,transparent_70%)]"
          style={{
            animation: "naganiSlotGoldFlash 760ms ease-out both",
          }}
        />

        <div
          className="absolute left-1/2 top-[42%] h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 bg-[conic-gradient(from_0deg,transparent,rgba(255,232,163,0.16),transparent,rgba(255,184,66,0.13),transparent)]"
          style={{
            animation:
              "naganiSlotRaySpin 1180ms ease-in-out infinite alternate",
          }}
        />
      </>
    ) : null}

    {Array.from({ length: isBigWin ? 18 : isMediumWin ? 10 : 4 }).map(
      (_, index) => (
        <span
          key={`nagani-slot-spark-${index}`}
          className="absolute h-1.5 w-1.5 rounded-full bg-[#fff0b9]"
          style={{
            left: `${12 + ((index * 17) % 76)}%`,
            top: `${34 + ((index * 23) % 36)}%`,
            animation: `naganiSlotSparkFloat ${
              700 + (index % 5) * 90
            }ms ease-out ${index * 45}ms infinite`,
            boxShadow: "0 0 10px rgba(255, 232, 163, 0.86)",
          }}
        />
      )
    )}
  </div>
) : null}

        <div className="pointer-events-none absolute left-0 top-0 h-full w-[8px] bg-[linear-gradient(90deg,#e2b95e,rgba(101,42,12,0.72),transparent)]" />
        <div className="pointer-events-none absolute right-0 top-0 h-full w-[8px] bg-[linear-gradient(270deg,#e2b95e,rgba(101,42,12,0.72),transparent)]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[36px] bg-[linear-gradient(180deg,rgba(255,218,121,0.22),rgba(83,12,7,0.34),transparent)]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[34px] bg-[linear-gradient(0deg,rgba(255,218,121,0.12),rgba(45,4,3,0.48),transparent)]" />

                <div className="absolute inset-x-2.5 bottom-2.5 top-[13px] z-10 overflow-hidden rounded-[17px] border border-[#d6a84e]/68 bg-[#020000] shadow-[0_8px_18px_rgba(0,0,0,0.42),inset_0_0_46px_rgba(0,0,0,0.98),inset_0_1px_0_rgba(255,232,163,0.08)]">
          <div className="grid h-full grid-cols-5 gap-1 p-1.5">
            {columns.map((column, columnIndex) => {
const reelIsStopped = !spinning || columnIndex < stoppedReelCount;
const reelJustStopped =
  spinning && stoppedReelCount === columnIndex + 1;
const reelIsFinal = columnIndex === columns.length - 1;
const reelIsAnticipating =
  spinning && !reelIsStopped && reelIsFinal && stoppedReelCount >= 4;
const spinStrip = getReelSpinStrip(columnIndex);
const reelIsIdle = isIdleReady;

              return (
<div
  key={`nagani-slot-reel-${columnIndex}`}
  className={`relative min-w-0 overflow-hidden rounded-[14px] border bg-[#030000] shadow-[inset_0_0_20px_rgba(0,0,0,0.86),0_7px_15px_rgba(0,0,0,0.44)] ${
    reelIsAnticipating
      ? "border-[#fff0b9]/72"
      : reelJustStopped
        ? "border-[#ffe08a]/66"
        : "border-[#8e5a1d]/48"
  }`}
  style={{
    backgroundImage: `linear-gradient(180deg,rgba(255,217,121,0.055),transparent 14%,transparent 86%,rgba(255,217,121,0.045)), url(${REEL_BLACKWOOD_IMAGE})`,
    backgroundPosition: "center, center",
    backgroundRepeat: "no-repeat, no-repeat",
    backgroundSize: "100% 100%, 100% 100%",
  }}
>
                  <div className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(180deg,rgba(255,217,121,0.07),transparent_14%,transparent_86%,rgba(255,217,121,0.055))]" />
                  {reelIsIdle ? (
  <div
    className="pointer-events-none absolute inset-x-0 top-0 z-20 h-[34%] bg-[linear-gradient(180deg,transparent,rgba(255,232,163,0.11),transparent)]"
style={{
  animation: `naganiSlotIdleReelSheen 3600ms ease-in-out ${
    columnIndex * 260
  }ms infinite`,
}}
  />
) : null}

<div className="pointer-events-none absolute left-0 right-0 top-[33.333%] z-20 h-px bg-gradient-to-r from-transparent via-[#ffd979]/13 to-transparent" />
<div className="pointer-events-none absolute left-0 right-0 top-[66.666%] z-20 h-px bg-gradient-to-r from-transparent via-[#ffd979]/13 to-transparent" />

<div className="pointer-events-none absolute inset-x-0 top-0 z-30 h-[15%] bg-gradient-to-b from-black/68 via-black/28 to-transparent" />
<div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 h-[15%] bg-gradient-to-t from-black/70 via-black/28 to-transparent" />

                  <div className="pointer-events-none absolute inset-y-0 right-0 z-30 w-px bg-gradient-to-b from-transparent via-[#ffd979]/18 to-transparent" />
                  <div className="pointer-events-none absolute inset-y-0 left-0 z-30 w-px bg-gradient-to-b from-transparent via-black/75 to-transparent" />

                  {reelIsStopped ? (
<StoppedReel
  column={column}
  columnIndex={columnIndex}
  reelJustStopped={reelJustStopped}
  winningPositions={winningPositions}
  dimNonWinning={dimNonWinning}
  isLastReel={reelIsFinal}
  winTier={winEvaluation?.tier ?? "none"}
/>
                  ) : (
<SpinningReel
  columnIndex={columnIndex}
  spinStrip={spinStrip}
  anticipating={reelIsAnticipating}
/>
                  )}
                </div>
              );
            })}
          </div>

          {hasNoWin && hasResult && winEvaluation ? (
            <div
              className="pointer-events-none absolute bottom-[10%] left-1/2 z-50 min-w-[188px] rounded-full border border-[#ffd979]/38 bg-black/68 px-4 py-2 text-center shadow-[0_10px_24px_rgba(0,0,0,0.72),0_0_18px_rgba(255,217,121,0.08)]"
              style={{
                animation: "naganiSlotResultBadgeIn 260ms ease-out both",
              }}
            >
              <p className="text-[11px] font-black text-[#ffd979]/78">
                {winEvaluation.message}
              </p>
            </div>
          ) : null}

          <div className="pointer-events-none absolute inset-x-2 top-1.5 z-40 h-16 rounded-t-[14px] bg-gradient-to-b from-white/14 to-transparent" />
          <div className="pointer-events-none absolute inset-x-2 bottom-1.5 z-40 h-16 rounded-b-[14px] bg-gradient-to-t from-black/54 to-transparent" />
          <div className="pointer-events-none absolute left-0 right-0 top-1/2 z-40 h-px bg-gradient-to-r from-transparent via-[#ffd979]/22 to-transparent" />
          <div className="pointer-events-none absolute inset-0 z-40 rounded-[16px] shadow-[inset_0_0_30px_rgba(255,210,105,0.08)]" />
        </div>

      </div>
    </section>
  );
}