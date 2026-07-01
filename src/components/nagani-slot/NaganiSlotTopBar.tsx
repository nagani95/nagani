// src/components/nagani-slot/NaganiSlotTopBar.tsx

"use client";

import { useRouter } from "next/navigation";

import type { NaganiSlotGameState } from "@/lib/naganiSlot/types";

type NaganiSlotTopBarProps = {
  gameState: NaganiSlotGameState;
};

const ROYAL_EXIT_DOOR_BUTTON =
  "/assets/nagani/six-animal/ui/six-animal-royal-exit-door-button-v1.png";

const NAGANI_LOGO =
  "/assets/nagani/shared/logo/nagani-logo-concept-v1.png";

function getRoomStateLabel(gameState: NaganiSlotGameState) {
  if (gameState === "spinning") return "လှည့်နေသည်";
  if (gameState === "settling") return "ဆု";
  if (gameState === "result") return "ရလဒ်";
  return "အသင့်";
}

export default function NaganiSlotTopBar({ gameState }: NaganiSlotTopBarProps) {
  const router = useRouter();

  return (
    <div className="relative z-40 mx-auto mt-0 h-[62px] w-[calc(100%-8px)] max-w-[424px] px-0.5">
      <style>{`
        @keyframes naganiSlotTopShellWarmth {
          0%, 100% {
            opacity: 0.28;
            transform: scaleX(0.88);
          }
          50% {
            opacity: 0.58;
            transform: scaleX(1);
          }
        }
      `}</style>

      <div className="pointer-events-none absolute inset-x-8 bottom-[-10px] z-0 h-8 rounded-full bg-[#ffd979]/12 blur-2xl" />
      <div className="pointer-events-none absolute inset-x-12 bottom-0 z-0 h-px bg-gradient-to-r from-transparent via-[#fff0b9]/42 to-transparent" />

      <div className="relative z-10 h-[58px] overflow-hidden rounded-[19px] border border-[#ffd979]/42 bg-[linear-gradient(180deg,#6c1a0d_0%,#3a0704_48%,#120000_100%)] shadow-[0_14px_30px_rgba(0,0,0,0.66),0_0_24px_rgba(255,190,74,0.08),inset_0_1px_0_rgba(255,238,178,0.22),inset_0_-16px_28px_rgba(0,0,0,0.42)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,221,128,0.2),transparent_38%),linear-gradient(90deg,rgba(0,0,0,0.34),transparent_26%,transparent_74%,rgba(0,0,0,0.34))]" />

        <div
          className="pointer-events-none absolute left-1/2 top-0 h-px w-[72%] -translate-x-1/2 bg-gradient-to-r from-transparent via-[#fff0b9]/78 to-transparent"
          style={{
            animation: "naganiSlotTopShellWarmth 2400ms ease-in-out infinite",
          }}
        />

        <button
          type="button"
          onClick={() => router.push("/")}
          className="absolute left-2 top-1/2 z-20 grid h-[46px] w-[46px] -translate-y-1/2 place-items-center rounded-[14px] transition-transform active:scale-[0.94]"
          aria-label="Exit slot room"
        >
          <img
            src={ROYAL_EXIT_DOOR_BUTTON}
            alt=""
            className="h-full w-full object-contain drop-shadow-[0_4px_10px_rgba(0,0,0,0.72)]"
            draggable={false}
          />
        </button>

        <div className="pointer-events-none absolute left-[56px] top-1/2 z-20 -translate-y-1/2">
          <p className="text-[12px] font-black text-[#ffd979] drop-shadow-[0_2px_5px_rgba(0,0,0,0.9)]">
            ထွက်
          </p>
        </div>

        <div className="pointer-events-none absolute left-1/2 top-1/2 z-20 grid h-[56px] w-[92px] -translate-x-1/2 -translate-y-1/2 place-items-center">
          <div className="absolute inset-x-2 bottom-0 h-4 rounded-full bg-[#ffd979]/18 blur-lg" />
          <img
            src={NAGANI_LOGO}
            alt=""
            className="relative h-full w-full object-contain drop-shadow-[0_5px_12px_rgba(0,0,0,0.76)]"
            draggable={false}
          />
        </div>

        <div className="pointer-events-none absolute right-3 top-1/2 z-20 -translate-y-1/2 rounded-full border border-[#ffd979]/18 bg-black/24 px-2.5 py-1">
          <p className="text-[7px] font-black tracking-[0.14em] text-[#ffd979]/56">
            {getRoomStateLabel(gameState)}
          </p>
        </div>
      </div>
    </div>
  );
}