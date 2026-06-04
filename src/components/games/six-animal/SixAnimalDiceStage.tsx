// src/components/games/six-animal/SixAnimalDiceStage.tsx

"use client";

import type { CSSProperties } from "react";
import { useEffect, useState } from "react";

import { SIX_ANIMAL_OPTIONS } from "@/lib/gameRules";
import type { SixAnimalKey } from "@/types/games";

const DICE_ASSET =
  "/assets/nagani/six-animal/dice/six-animal-dice-sample-02.png";

const TABLE_ASSET =
  "/assets/nagani/six-animal/table/six-animal-table-reference-01.png";

const ANIMAL_ASSETS: Record<SixAnimalKey, string> = {
  tiger: "/assets/nagani/six-animal/animals/six-animal-tiger-sample-01.png",
  dragon: "/assets/nagani/six-animal/animals/six-animal-dragon-sample-01.png",
  rooster: "/assets/nagani/six-animal/animals/six-animal-rooster-sample-01.png",
  fish: "/assets/nagani/six-animal/animals/six-animal-fish-sample-01.png",
  crab: "/assets/nagani/six-animal/animals/six-animal-crab-sample-01.png",
  elephant:
    "/assets/nagani/six-animal/animals/six-animal-elephant-sample-01.png",
};

const TRAY_STOP_POSITIONS = [
  {
    left: "31%",
    bottom: "12px",
    rotate: "-13deg",
  },
  {
    left: "66%",
    bottom: "18px",
    rotate: "11deg",
  },
  {
    left: "48%",
    bottom: "8px",
    rotate: "-5deg",
  },
];

type DiceStagePhase = "loading" | "betting" | "closed" | "rolling" | "result";

type SixAnimalDiceStageProps = {
  phase: DiceStagePhase;
  diceResult: string[];
  activeBetAnimalNameMm?: string | null;
  onRevealCountChange?: (count: number) => void;
};

function getAnimalByNameMm(nameMm: string) {
  return SIX_ANIMAL_OPTIONS.find((animal) => animal.nameMm === nameMm);
}

function QueuedDie({
  index,
  released,
  active,
}: {
  index: number;
  released: boolean;
  active: boolean;
}) {
  return (
    <div
      className={`relative flex h-[46px] w-[46px] items-center justify-center rounded-xl border shadow-2xl transition-all duration-500 md:h-[54px] md:w-[54px] ${
        released
          ? "border-amber-200/10 bg-black/28 opacity-45 shadow-inner shadow-black/70"
          : active
            ? "scale-105 border-amber-100 bg-amber-300/25 shadow-[0_0_34px_rgba(251,191,36,0.55)]"
            : "border-amber-300/35 bg-gradient-to-b from-amber-900/80 via-red-950/60 to-black"
      }`}
    >
      <div className="absolute inset-0 rounded-xl bg-[radial-gradient(circle_at_top,rgba(255,244,204,0.24),transparent_62%)]" />

      {released ? (
        <div className="relative z-10 h-8 w-8 rounded-lg border border-dashed border-amber-200/12 bg-black/35 shadow-inner shadow-black/70" />
      ) : (
        <img
          src={DICE_ASSET}
          alt={`Queued die ${index + 1}`}
          className="relative z-10 h-9 w-9 object-contain drop-shadow-[0_10px_12px_rgba(0,0,0,0.72)] md:h-11 md:w-11"
        />
      )}
    </div>
  );
}

function FallingDie({ index }: { index: number }) {
  const motionProfiles = [
    {
      startX: -62,
      impactX: -46,
      bounceX: 30,
      wallX: -68,
      settleX: -34,
      finalX: -46,
      impactRotate: "246deg",
      bounceRotate: "-332deg",
      wallRotate: "468deg",
      settleRotate: "612deg",
      finalRotate: "704deg",
    },
    {
      startX: 0,
      impactX: 20,
      bounceX: -44,
      wallX: 62,
      settleX: 24,
      finalX: 38,
      impactRotate: "-238deg",
      bounceRotate: "326deg",
      wallRotate: "-492deg",
      settleRotate: "-628deg",
      finalRotate: "-718deg",
    },
    {
      startX: 62,
      impactX: 44,
      bounceX: -18,
      wallX: 18,
      settleX: -10,
      finalX: 4,
      impactRotate: "286deg",
      bounceRotate: "-354deg",
      wallRotate: "518deg",
      settleRotate: "664deg",
      finalRotate: "752deg",
    },
  ];

  const profile = motionProfiles[index] ?? motionProfiles[1];

  return (
    <div
      className="nagani-physical-die-drop absolute left-1/2 top-[86px] z-[90] flex h-[70px] w-[70px] -translate-x-1/2 items-center justify-center rounded-[1.35rem] border border-amber-100 bg-gradient-to-b from-amber-50 via-yellow-300 to-amber-700 shadow-[0_0_65px_rgba(251,191,36,0.85)] md:h-[78px] md:w-[78px]"
      style={
        {
          "--drop-start-x": `${profile.startX}px`,
          "--drop-impact-x": `${profile.impactX}px`,
          "--drop-bounce-x": `${profile.bounceX}px`,
          "--drop-wall-x": `${profile.wallX}px`,
          "--drop-settle-x": `${profile.settleX}px`,
          "--drop-final-x": `${profile.finalX}px`,
          "--drop-impact-rotate": profile.impactRotate,
          "--drop-bounce-rotate": profile.bounceRotate,
          "--drop-wall-rotate": profile.wallRotate,
          "--drop-settle-rotate": profile.settleRotate,
          "--drop-final-rotate": profile.finalRotate,
          animationDelay: `${index * 70}ms`,
        } as CSSProperties
      }
    >
      <div className="absolute inset-0 rounded-[1.35rem] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.95),rgba(251,191,36,0.35),rgba(69,10,10,0.24))]" />

      <img
        src={DICE_ASSET}
        alt={`Dropping die ${index + 1}`}
        className="relative z-10 h-[54px] w-[54px] object-contain drop-shadow-[0_16px_18px_rgba(0,0,0,0.75)] md:h-[62px] md:w-[62px]"
      />
    </div>
  );
}

function LandedDie({
  animalNameMm,
  index,
  isMatch,
  isLatest = false,
}: {
  animalNameMm: string;
  index: number;
  isMatch: boolean;
  isLatest?: boolean;
}) {
  const animal = getAnimalByNameMm(animalNameMm);
  const asset = animal ? ANIMAL_ASSETS[animal.key as SixAnimalKey] : null;

  return (
    <div
      className={`nagani-landed-physical-die relative flex h-[64px] w-[64px] items-center justify-center overflow-visible rounded-2xl transition-all duration-500 md:h-[74px] md:w-[74px] ${
        isMatch
          ? "scale-105 drop-shadow-[0_0_34px_rgba(16,185,129,0.55)]"
          : "drop-shadow-[0_14px_24px_rgba(0,0,0,0.65)]"
      }`}
    >
      <div className="absolute bottom-[-8px] left-1/2 h-5 w-[82%] -translate-x-1/2 rounded-full bg-black/65 blur-md" />

      {isLatest ? (
        <div className="nagani-die-impact pointer-events-none absolute inset-[-14px] rounded-[2rem] border border-amber-100/70 bg-amber-200/20" />
      ) : null}

      <div
        className={`relative flex h-full w-full items-center justify-center overflow-hidden rounded-2xl border shadow-2xl ${
          isMatch
            ? "border-emerald-300 bg-emerald-200/15"
            : "border-amber-100/80 bg-amber-100/10"
        }`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_28%_18%,rgba(255,255,255,0.9),rgba(251,191,36,0.2),rgba(69,10,10,0.18))]" />

        <img
          src={DICE_ASSET}
          alt={`Landed die ${index + 1}`}
          className="absolute inset-0 z-0 h-full w-full object-contain opacity-95 drop-shadow-[0_10px_14px_rgba(0,0,0,0.62)]"
        />

        <div className="absolute inset-[10px] z-10 rounded-xl bg-amber-50/72 shadow-inner shadow-amber-950/35" />

        {asset ? (
          <img
            src={asset}
            alt={animal?.name ?? animalNameMm}
            className="relative z-20 h-8 w-8 object-contain drop-shadow-[0_7px_9px_rgba(0,0,0,0.45)] md:h-9 md:w-9"
          />
        ) : (
          <span className="relative z-20 text-base font-black text-red-950">
            {animalNameMm}
          </span>
        )}
      </div>
    </div>
  );
}

export default function SixAnimalDiceStage({
  phase,
  diceResult,
  activeBetAnimalNameMm,
  onRevealCountChange,
}: SixAnimalDiceStageProps) {
  const [revealedDiceCount, setRevealedDiceCount] = useState(0);
  const [activeDroppingDieIndex, setActiveDroppingDieIndex] = useState<
    number | null
  >(null);

  useEffect(() => {
    if (phase === "result" && diceResult.length > 0) {
      setRevealedDiceCount(3);
      setActiveDroppingDieIndex(null);
      return;
    }

    if (phase !== "rolling" || diceResult.length === 0) {
      setRevealedDiceCount(0);
      setActiveDroppingDieIndex(null);
      return;
    }

    setRevealedDiceCount(0);
    setActiveDroppingDieIndex(null);

    const timers = [
  window.setTimeout(() => {
    setActiveDroppingDieIndex(0);
  }, 350),

  window.setTimeout(() => {
    setRevealedDiceCount(1);
    setActiveDroppingDieIndex(null);
  }, 2850),

  window.setTimeout(() => {
    setActiveDroppingDieIndex(1);
  }, 4200),

  window.setTimeout(() => {
    setRevealedDiceCount(2);
    setActiveDroppingDieIndex(null);
  }, 6700),

  window.setTimeout(() => {
    setActiveDroppingDieIndex(2);
  }, 8050),

  window.setTimeout(() => {
    setRevealedDiceCount(3);
    setActiveDroppingDieIndex(null);
  }, 10550),
];

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [phase, diceResult]);

  useEffect(() => {
  onRevealCountChange?.(revealedDiceCount);
}, [onRevealCountChange, revealedDiceCount]);

  const isResultMode = phase === "result" && diceResult.length > 0;
  const hasDiceReveal =
    (phase === "rolling" || phase === "result") && diceResult.length > 0;
  const isActionMode = phase === "rolling" || isResultMode;
  const latestLandedIndex =
  revealedDiceCount > 0 ? revealedDiceCount - 1 : null;

const activeTrayResultIndex =
  phase === "rolling" &&
  latestLandedIndex !== null &&
  activeDroppingDieIndex === null
    ? latestLandedIndex
    : null;

const shouldShowLandingImpact =
  phase === "rolling" && activeTrayResultIndex !== null;

  return (
    <>
      <style>{`
        @keyframes naganiPhysicalDieDrop {
  0% {
    opacity: 0;
    transform: translate3d(calc(-50% + var(--drop-start-x)), -36px, 0) rotate(-24deg) scale(0.68);
    filter: blur(1.8px);
  }

  8% {
    opacity: 1;
    transform: translate3d(calc(-50% + var(--drop-start-x)), -8px, 0) rotate(40deg) scale(0.86);
    filter: blur(1.2px);
  }

  23% {
    opacity: 1;
    transform: translate3d(calc(-50% + var(--drop-impact-x)), 158px, 0) rotate(var(--drop-impact-rotate)) scale(1.14);
    filter: blur(0.7px);
  }

  34% {
    opacity: 1;
    transform: translate3d(calc(-50% + var(--drop-bounce-x)), 112px, 0) rotate(var(--drop-bounce-rotate)) scale(0.98);
    filter: blur(0.35px);
  }

  49% {
    opacity: 1;
    transform: translate3d(calc(-50% + var(--drop-wall-x)), 186px, 0) rotate(var(--drop-wall-rotate)) scale(1.04);
    filter: blur(0.22px);
  }

  65% {
    opacity: 1;
    transform: translate3d(calc(-50% + var(--drop-settle-x)), 208px, 0) rotate(var(--drop-settle-rotate)) scale(0.98);
    filter: blur(0px);
  }

  82% {
    opacity: 1;
    transform: translate3d(calc(-50% + var(--drop-final-x) - 8px), 220px, 0) rotate(var(--drop-final-rotate)) scale(0.94);
    filter: blur(0px);
  }

  94% {
    opacity: 1;
    transform: translate3d(calc(-50% + var(--drop-final-x) + 4px), 224px, 0) rotate(var(--drop-final-rotate)) scale(0.91);
    filter: blur(0px);
  }

  100% {
    opacity: 0;
    transform: translate3d(calc(-50% + var(--drop-final-x)), 224px, 0) rotate(var(--drop-final-rotate)) scale(0.9);
    filter: blur(0px);
  }
}

        @keyframes naganiTableBreath {
          0%, 100% {
            opacity: 0.45;
            transform: scaleX(1);
          }

          50% {
            opacity: 0.9;
            transform: scaleX(1.04);
          }
        }

        @keyframes naganiLandedPhysicalDie {
          0% {
            opacity: 0;
            transform: translateY(-22px) scale(0.78) rotate(-8deg);
            filter: blur(2px);
          }

          62% {
            opacity: 1;
            transform: translateY(6px) scale(1.08) rotate(3deg);
            filter: blur(0px);
          }

          100% {
            opacity: 1;
            transform: translateY(0) scale(1) rotate(0deg);
            filter: blur(0px);
          }
        }

        @keyframes naganiTrayImpact {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.45);
            filter: blur(0px);
          }

          28% {
            opacity: 0.95;
            transform: translate(-50%, -50%) scale(1.04);
            filter: blur(0px);
          }

          100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(1.36);
            filter: blur(10px);
          }
        }

        @keyframes naganiDieImpact {
          0% {
            opacity: 0;
            transform: scale(0.72);
          }

          34% {
            opacity: 0.95;
            transform: scale(1.06);
          }

          100% {
            opacity: 0;
            transform: scale(1.34);
          }
        }

        .nagani-physical-die-drop {
  animation: naganiPhysicalDieDrop 2400ms cubic-bezier(0.14, 0.82, 0.2, 1) both;
}

        .nagani-table-breath {
          animation: naganiTableBreath 1.15s ease-in-out infinite;
        }

        .nagani-landed-physical-die {
          animation: naganiLandedPhysicalDie 480ms ease-out both;
        }

        .nagani-tray-impact {
          animation: naganiTrayImpact 760ms ease-out both;
        }

        .nagani-die-impact {
          animation: naganiDieImpact 720ms ease-out both;
        }
      `}</style>

      <div className="relative z-40 h-[430px] w-full max-w-[1040px] overflow-visible md:h-[450px]">
        <div className="absolute left-1/2 top-[63%] h-28 w-[58%] -translate-x-1/2 rounded-[50%] bg-black/80 blur-3xl" />

        <div className="absolute left-1/2 top-0 z-40 h-[420px] w-[96%] max-w-[860px] -translate-x-1/2 md:h-[440px] md:w-[88%]">
          <img
            src={TABLE_ASSET}
            alt="Six Animal physical dice table"
            className="pointer-events-none absolute left-1/2 top-[-10px] z-10 h-[430px] w-[62%] -translate-x-1/2 object-fill drop-shadow-[0_34px_70px_rgba(0,0,0,0.9)] md:h-[450px] md:w-[58%]"
          />

          <div className="pointer-events-none absolute left-1/2 top-[26px] z-20 h-[210px] w-[52%] -translate-x-1/2 rounded-t-[2rem] bg-[radial-gradient(circle_at_center,rgba(127,29,29,0.12),transparent_64%)]" />

          <div className="absolute left-1/2 top-[38px] z-50 flex -translate-x-1/2 items-center gap-3 md:gap-4">
            {[0, 1, 2].map((index) => {
              const released =
                hasDiceReveal &&
                (index < revealedDiceCount ||
                  activeDroppingDieIndex === index);

              return (
                <QueuedDie
                  key={`queue-${index}`}
                  index={index}
                  released={released}
                  active={activeDroppingDieIndex === index}
                />
              );
            })}
          </div>

          <div className="pointer-events-none absolute left-1/2 top-[108px] z-40 h-[215px] w-[118px] -translate-x-1/2 rounded-b-[2rem] border-x border-amber-200/12 bg-gradient-to-b from-amber-100/10 via-amber-200/5 to-transparent">
            <div className="absolute left-1/2 top-0 h-full w-[34px] -translate-x-1/2 rounded-full bg-amber-100/12 blur-xl" />
            <div className="absolute left-[22px] top-0 h-full w-px bg-gradient-to-b from-amber-100/24 via-amber-100/10 to-transparent" />
            <div className="absolute right-[22px] top-0 h-full w-px bg-gradient-to-b from-amber-100/24 via-amber-100/10 to-transparent" />
          </div>

          {activeDroppingDieIndex !== null ? (
            <FallingDie index={activeDroppingDieIndex} />
          ) : null}

          <div className="absolute left-1/2 top-[286px] z-[80] h-[108px] w-[48%] -translate-x-1/2 overflow-visible">
            {isActionMode ? (
              <div className="nagani-table-breath pointer-events-none absolute left-1/2 top-[58%] z-10 h-24 w-[82%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-300/16 blur-2xl" />
            ) : null}

            {shouldShowLandingImpact ? (
              <div
                key={`tray-impact-${latestLandedIndex}`}
                className="nagani-tray-impact pointer-events-none absolute left-1/2 top-[58%] z-10 h-24 w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-amber-200/25 bg-amber-300/20"
              />
            ) : null}

{!hasDiceReveal ? (
  <div className="pointer-events-none absolute inset-x-0 bottom-2 z-30 h-[86px]">
    <div className="absolute left-1/2 bottom-2 h-12 w-[76%] -translate-x-1/2 rounded-full bg-black/22 blur-2xl" />
    <div className="absolute left-1/2 bottom-8 h-px w-[68%] -translate-x-1/2 bg-gradient-to-r from-transparent via-amber-200/12 to-transparent" />
  </div>
) : null}

{activeTrayResultIndex !== null && diceResult[activeTrayResultIndex] ? (
  <div
    key={`active-tray-result-${activeTrayResultIndex}-${diceResult[activeTrayResultIndex]}`}
    className="absolute z-50"
    style={{
      left: TRAY_STOP_POSITIONS[activeTrayResultIndex]?.left ?? "50%",
      bottom: TRAY_STOP_POSITIONS[activeTrayResultIndex]?.bottom ?? "10px",
      transform: `translateX(-50%) rotate(${
        TRAY_STOP_POSITIONS[activeTrayResultIndex]?.rotate ?? "0deg"
      })`,
    }}
  >
    <LandedDie
      animalNameMm={diceResult[activeTrayResultIndex]}
      index={activeTrayResultIndex}
      isMatch={Boolean(
        activeBetAnimalNameMm &&
          diceResult[activeTrayResultIndex] === activeBetAnimalNameMm
      )}
      isLatest={shouldShowLandingImpact}
    />
  </div>
) : null}
          </div>
        </div>

        <div className="absolute bottom-0 left-1/2 z-10 h-[44px] w-[64%] -translate-x-1/2 rounded-t-[3rem] border-t border-amber-300/14 bg-gradient-to-b from-amber-950/18 via-black/22 to-transparent">
          <div className="absolute left-1/2 top-0 h-12 w-[70%] -translate-x-1/2 rounded-full bg-amber-300/10 blur-2xl" />
          <div className="absolute left-1/2 top-5 h-px w-[72%] -translate-x-1/2 bg-gradient-to-r from-transparent via-amber-200/28 to-transparent" />
        </div>
      </div>
    </>
  );
}