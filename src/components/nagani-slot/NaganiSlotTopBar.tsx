// src/components/nagani-slot/NaganiSlotTopBar.tsx

"use client";

import { useRouter } from "next/navigation";

import type { NaganiSlotGameState } from "@/lib/naganiSlot/types";

type NaganiSlotTopBarProps = {
  gameState: NaganiSlotGameState;
};

const SLOT_TOP_BAR_SKIN =
  "/assets/nagani/slot/ui/top-bar-skin-v1.png";

const ROYAL_EXIT_DOOR_BUTTON =
  "/assets/nagani/six-animal/ui/six-animal-royal-exit-door-button-v1.png";

const NAGANI_LOGO =
  "/assets/nagani/shared/logo/nagani-logo-concept-v1.png";

function getRoomStateLabel(gameState: NaganiSlotGameState) {
  if (gameState === "spinning") return "လှည့်နေသည်";
  if (gameState === "settling") return "ဆုစုနေသည်";
  if (gameState === "result") return "ရလဒ်";
  return "အသင့်";
}

export default function NaganiSlotTopBar({ gameState }: NaganiSlotTopBarProps) {
  const router = useRouter();

  return (
    <header className="relative z-40 mx-auto mt-1 h-[74px] w-[calc(100%-8px)] max-w-[424px] shrink-0 overflow-hidden rounded-[22px] bg-[#160403] shadow-[0_12px_26px_rgba(0,0,0,0.52)]">
      <style>{`
        @keyframes naganiSlotTopLiveDot {
          0%, 100% {
            opacity: 0.58;
            transform: scale(0.92);
          }
          50% {
            opacity: 1;
            transform: scale(1.12);
          }
        }

        @keyframes naganiSlotTopLogoGlow {
          0%, 100% {
            opacity: 0.18;
            transform: translateX(-50%) scaleX(0.9);
          }
          50% {
            opacity: 0.38;
            transform: translateX(-50%) scaleX(1);
          }
        }
      `}</style>

<img
  src={SLOT_TOP_BAR_SKIN}
  alt=""
  aria-hidden="true"
  className="pointer-events-none absolute inset-0 h-full w-full object-fill opacity-100 drop-shadow-[0_10px_24px_rgba(0,0,0,0.58)]"
  draggable={false}
/>

      <div className="pointer-events-none absolute inset-x-3 top-1.5 h-[66px] rounded-[20px] bg-[linear-gradient(180deg,rgba(255,232,163,0.035),rgba(0,0,0,0.10))]" />

      <div className="relative z-10 flex min-h-[74px] items-center justify-between px-3 py-1">
        <button
          type="button"
          onClick={() => router.push("/")}
          aria-label="ထွက်ရန်"
          className="group flex h-[48px] w-[76px] items-center justify-start gap-1 pl-1"
        >
          <span className="sr-only">ထွက်ရန်</span>

          <span className="relative h-[50px] w-[40px] overflow-visible">
            <img
              src={ROYAL_EXIT_DOOR_BUTTON}
              alt=""
              className="absolute left-1/2 top-1/2 h-[52px] w-[52px] -translate-x-1/2 -translate-y-1/2 object-contain drop-shadow-[0_0_10px_rgba(251,191,36,0.42)] transition-transform duration-200 group-active:scale-[0.92]"
              draggable={false}
            />
          </span>

          <span className="relative z-10 text-xs font-black text-[#ffd77a] drop-shadow-[0_1px_4px_rgba(0,0,0,0.85)] transition-colors group-active:text-[#fff3d0]">
            ထွက်
          </span>
        </button>

        <div className="pointer-events-none flex min-w-0 flex-1 justify-center px-2">
          <div className="relative flex h-[50px] w-[104px] items-center justify-center overflow-visible">
            <div
              className="absolute left-1/2 bottom-0 h-5 w-[86px] -translate-x-1/2 rounded-full bg-[#ffd979]/22 blur-xl"
              style={{
                animation: "naganiSlotTopLogoGlow 2400ms ease-in-out infinite",
              }}
            />

            <img
              src={NAGANI_LOGO}
              alt="နဂါးနီ"
              className="relative h-[58px] w-[98px] scale-[1.01] object-contain brightness-110 drop-shadow-[0_0_12px_rgba(251,191,36,0.30)]"
              draggable={false}
            />
          </div>
        </div>

        <div className="flex w-[92px] flex-col items-end gap-1.5 pr-1">
          <div className="flex items-center gap-1.5 rounded-full border border-[#ffd979]/30 bg-black/30 px-2.5 py-1 shadow-[inset_0_1px_0_rgba(255,232,163,0.1)]">
            <span
              className="h-1.5 w-1.5 rounded-full bg-[#fff0b9] shadow-[0_0_8px_rgba(255,232,163,0.9)]"
              style={{
                animation: "naganiSlotTopLiveDot 1100ms ease-in-out infinite",
              }}
            />
            <span className="text-[8px] font-black leading-none tracking-[0.08em] text-[#fff0b9] drop-shadow-[0_1px_3px_rgba(0,0,0,0.82)]">
              Live
            </span>
          </div>

          <div className="min-w-[50px] rounded-full border border-[#ffd979]/24 bg-[linear-gradient(180deg,rgba(66,10,5,0.72),rgba(5,0,0,0.72))] px-2.5 py-1 text-center shadow-[inset_0_1px_0_rgba(255,232,163,0.1)]">
            <p className="text-[8px] font-black leading-none text-[#ffd979]/82 drop-shadow-[0_1px_3px_rgba(0,0,0,0.82)]">
              {getRoomStateLabel(gameState)}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}