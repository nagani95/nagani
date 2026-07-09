"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import type { NaganiSlotGameState } from "@/lib/naganiSlot/types";

type NaganiSlotTopBarProps = {
  gameState: NaganiSlotGameState;
  isBackgroundMusicMuted?: boolean;
  onBackgroundMusicToggle?: () => void;
};

const ROYAL_TOP_BAR_BOARD =
  "/assets/nagani/six-animal/ui/royal-top-bar-board-v1.png";

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

function SpeakerOnIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="relative z-10 h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 9v6h4l5 4V5l-5 4H5z" />
      <path d="M16 9.5a4.5 4.5 0 0 1 0 5" />
      <path d="M18.5 7a8 8 0 0 1 0 10" />
    </svg>
  );
}

function SpeakerMutedIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="relative z-10 h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 9v6h4l5 4V5l-5 4H5z" />
      <path d="M4 4l16 16" />
    </svg>
  );
}

function EnterFullscreenIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="relative z-10 h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 9V3h6" />
      <path d="M21 9V3h-6" />
      <path d="M3 15v6h6" />
      <path d="M21 15v6h-6" />
    </svg>
  );
}

function ExitFullscreenIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="relative z-10 h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M8 3v5H3" />
      <path d="M16 3v5h5" />
      <path d="M8 21v-5H3" />
      <path d="M16 21v-5h5" />
    </svg>
  );
}

function SlotGameStatePill({
  gameState,
}: {
  gameState: NaganiSlotGameState;
}) {
  const label = getRoomStateLabel(gameState);
  const isActive =
    gameState === "spinning" ||
    gameState === "settling" ||
    gameState === "result";

  return (
    <div
      className={`relative min-w-[68px] overflow-hidden rounded-full border px-2.5 py-1 text-center shadow-[0_6px_14px_rgba(0,0,0,0.42),inset_0_1px_0_rgba(255,232,163,0.12)] ${
        isActive
          ? "border-[#ffe1a3]/45 bg-[linear-gradient(180deg,rgba(123,54,13,0.86),rgba(44,10,4,0.88))] text-[#fff3d0]"
          : "border-[#ffd77a]/34 bg-[#090202]/48 text-[#ffd77a]"
      }`}
      style={{
        animation: isActive
          ? "naganiSlotStateBreathe 1.75s ease-in-out infinite"
          : undefined,
      }}
    >
      <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,215,122,0.24),transparent_62%)]" />

      {isActive ? (
        <span className="pointer-events-none absolute inset-y-0 -left-8 w-7 rotate-12 animate-[naganiSlotStateShine_2.4s_ease-in-out_infinite] bg-white/20 blur-[1px]" />
      ) : null}

      <span className="relative block text-[8px] font-black leading-none tracking-[0.01em] drop-shadow-[0_1px_3px_rgba(0,0,0,0.82)]">
        {label}
      </span>
    </div>
  );
}

export default function NaganiSlotTopBar({
  gameState,
  isBackgroundMusicMuted = false,
  onBackgroundMusicToggle,
}: NaganiSlotTopBarProps) {
  const router = useRouter();

  const [isFullscreenMode, setIsFullscreenMode] = useState(false);
  const [canUseFullscreen, setCanUseFullscreen] = useState(false);

  useEffect(() => {
    setCanUseFullscreen(Boolean(document.fullscreenEnabled));

    function syncFullscreenState() {
      setIsFullscreenMode(Boolean(document.fullscreenElement));
    }

    syncFullscreenState();

    document.addEventListener("fullscreenchange", syncFullscreenState);

    return () => {
      document.removeEventListener("fullscreenchange", syncFullscreenState);
    };
  }, []);

  async function handleFullscreenToggle() {
    if (!canUseFullscreen) return;

    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        return;
      }

      await document.exitFullscreen();
    } catch {
      setIsFullscreenMode(false);
    }
  }

  return (
    <header className="relative z-40 mx-auto mt-1 h-[74px] w-[calc(100%-8px)] max-w-[424px] shrink-0 overflow-hidden rounded-[22px] border border-[#d6a84f]/24 bg-[linear-gradient(180deg,rgba(84,28,10,0.98),rgba(51,12,6,0.98),rgba(18,3,2,0.98))] shadow-[0_12px_26px_rgba(0,0,0,0.52),inset_0_1px_0_rgba(255,215,122,0.18)]">
      <img
        src={ROYAL_TOP_BAR_BOARD}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[74px] w-full object-fill opacity-100 drop-shadow-[0_10px_24px_rgba(0,0,0,0.55)]"
        draggable={false}
      />

      <div className="pointer-events-none absolute inset-x-2 top-1 h-[68px] rounded-[20px] bg-[linear-gradient(180deg,rgba(255,215,122,0.06),rgba(0,0,0,0.16))]" />

      <div className="relative z-10 flex min-h-[74px] items-center justify-between px-3 py-1">
<button
  type="button"
  onClick={() => router.push("/games")}
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
            <img
              src={NAGANI_LOGO}
              alt="နဂါးနီ"
              className="h-[58px] w-[98px] scale-[1.01] object-contain brightness-110 drop-shadow-[0_0_12px_rgba(251,191,36,0.30)]"
              draggable={false}
            />
          </div>
        </div>

        <div
          className="flex w-[102px] flex-col items-end gap-1.5 pr-2"
          title={getRoomStateLabel(gameState)}
        >
         <SlotGameStatePill gameState={gameState} />

          <div className="mr-1 flex items-center gap-1.5">
            <button
              type="button"
              onClick={onBackgroundMusicToggle}
              disabled={!onBackgroundMusicToggle}
              aria-label={
                isBackgroundMusicMuted
                  ? "နောက်ခံတေးသံ ဖွင့်ရန်"
                  : "နောက်ခံတေးသံ ပိတ်ရန်"
              }
              title={
                isBackgroundMusicMuted
                  ? "တေးသံ ပိတ်ထားသည်"
                  : "တေးသံ ဖွင့်ထားသည်"
              }
              className={`group relative flex h-[38px] w-[38px] items-center justify-center rounded-full border shadow-[0_0_14px_rgba(0,0,0,0.30),inset_0_1px_0_rgba(255,255,255,0.08)] transition duration-200 active:scale-[0.94] disabled:opacity-40 ${
                isBackgroundMusicMuted
                  ? "border-[#d6a84f]/26 bg-[linear-gradient(135deg,rgba(58,22,8,0.96),rgba(92,40,14,0.90),rgba(42,15,6,0.98))] text-[#eecb82]"
                  : "border-[#ffe1a3]/34 bg-[linear-gradient(135deg,rgba(120,70,18,0.96),rgba(214,168,79,0.92),rgba(94,54,15,0.98))] text-[#fff7e3]"
              }`}
            >
              <span className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_50%_18%,rgba(255,243,208,0.22),transparent_62%)]" />
              {isBackgroundMusicMuted ? <SpeakerMutedIcon /> : <SpeakerOnIcon />}
            </button>

            <button
              type="button"
              onClick={handleFullscreenToggle}
              disabled={!canUseFullscreen}
              aria-label={
                isFullscreenMode
                  ? "မျက်နှာပြင်အပြည့်မှ ထွက်ရန်"
                  : "မျက်နှာပြင်အပြည့် ဖွင့်ရန်"
              }
              title={
                isFullscreenMode
                  ? "မျက်နှာပြင်အပြည့်မှ ထွက်ရန်"
                  : "မျက်နှာပြင်အပြည့်"
              }
              style={{
                animation:
                  canUseFullscreen && !isFullscreenMode
                    ? "naganiSlotFullscreenHint 1.65s ease-in-out infinite"
                    : undefined,
              }}
              className={`group relative flex h-[38px] w-[38px] items-center justify-center rounded-full border shadow-[0_0_14px_rgba(0,0,0,0.30),inset_0_1px_0_rgba(255,255,255,0.08)] transition duration-200 active:scale-[0.94] disabled:opacity-35 ${
                isFullscreenMode
                  ? "border-[#ffe1a3]/34 bg-[linear-gradient(135deg,rgba(120,70,18,0.96),rgba(214,168,79,0.92),rgba(94,54,15,0.98))] text-[#fff7e3]"
                  : "border-[#ffe1a3]/48 bg-[linear-gradient(135deg,rgba(92,40,14,0.98),rgba(204,138,38,0.96),rgba(74,26,8,0.98))] text-[#fff7e3]"
              }`}
            >
              <span className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_50%_18%,rgba(255,243,208,0.28),transparent_62%)]" />
              {isFullscreenMode ? <ExitFullscreenIcon /> : <EnterFullscreenIcon />}
            </button>
          </div>
        </div>
      </div>

      <style>{`
@keyframes naganiSlotStateBreathe {
  0%,
  100% {
    transform: scale(1);
    box-shadow:
      0 6px 14px rgba(0, 0, 0, 0.42),
      inset 0 1px 0 rgba(255, 232, 163, 0.12),
      0 0 0 rgba(255, 215, 122, 0);
  }

  50% {
    transform: scale(1.045);
    box-shadow:
      0 6px 14px rgba(0, 0, 0, 0.42),
      inset 0 1px 0 rgba(255, 232, 163, 0.14),
      0 0 15px rgba(255, 215, 122, 0.24);
  }
}

@keyframes naganiSlotStateShine {
  0%,
  45% {
    transform: translateX(-130%) rotate(12deg);
    opacity: 0;
  }

  62% {
    opacity: 0.75;
  }

  100% {
    transform: translateX(520%) rotate(12deg);
    opacity: 0;
  }
}

        @keyframes naganiSlotFullscreenHint {
          0%,
          100% {
            transform: rotateY(0deg) scale(1);
            box-shadow:
              0 0 14px rgba(0, 0, 0, 0.3),
              0 0 0 rgba(255, 215, 122, 0);
          }

          38% {
            transform: rotateY(180deg) scale(1.08);
            box-shadow:
              0 0 18px rgba(255, 215, 122, 0.42),
              0 0 26px rgba(255, 215, 122, 0.26);
          }

          62% {
            transform: rotateY(360deg) scale(1.03);
          }
        }
      `}</style>
    </header>
  );
}