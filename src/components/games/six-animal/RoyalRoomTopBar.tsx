//src/components/games/six-animal/RoyalRoomTopBar.tsx

"use client";

import LiveStatusPill from "./LiveStatusPill";

type RoyalRoomTopBarProps = {
  exitDoorAsset: string;
  logoAsset: string;
  onExitClick: () => void;
  showRoomControls?: boolean;
  isBackgroundMusicMuted?: boolean;
  isFullscreenMode?: boolean;
  canUseFullscreen?: boolean;
  onBackgroundMusicToggle?: () => void;
  onFullscreenToggle?: () => void;
  className?: string;
};

const ROYAL_TOP_BAR_BOARD =
  "/assets/nagani/six-animal/ui/royal-top-bar-board-v1.png";

export default function RoyalRoomTopBar({
  exitDoorAsset,
  logoAsset,
  onExitClick,
  showRoomControls = false,
  isBackgroundMusicMuted = false,
  isFullscreenMode = false,
  canUseFullscreen = false,
  onBackgroundMusicToggle,
  onFullscreenToggle,
  className = "",
}: RoyalRoomTopBarProps) {
  return (
    <header
      className={`relative z-20 min-h-[74px] shrink-0 overflow-hidden rounded-[22px] border border-[#d6a84f]/24 bg-[linear-gradient(180deg,rgba(84,28,10,0.98),rgba(51,12,6,0.98),rgba(18,3,2,0.98))] shadow-[0_12px_26px_rgba(0,0,0,0.52),inset_0_1px_0_rgba(255,215,122,0.18)] ${className}`}
    >
      <img
        src={ROYAL_TOP_BAR_BOARD}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[74px] w-full object-fill opacity-100 drop-shadow-[0_10px_24px_rgba(0,0,0,0.55)]"
      />

      <div className="pointer-events-none absolute inset-x-2 top-1 h-[68px] rounded-[20px] bg-[linear-gradient(180deg,rgba(255,215,122,0.06),rgba(0,0,0,0.16))]" />

      <div className="relative z-10 flex min-h-[74px] items-center justify-between px-3 py-1">
        <button
          type="button"
          onClick={onExitClick}
          aria-label="Exit to lobby"
          className="group flex h-[48px] w-[76px] items-center justify-start gap-1 pl-1"
        >
          <span className="sr-only">Exit to lobby</span>

          <span className="relative h-[50px] w-[40px] overflow-visible">
            <img
              src={exitDoorAsset}
              alt=""
              className="absolute left-1/2 top-1/2 h-[52px] w-[52px] -translate-x-1/2 -translate-y-1/2 object-contain drop-shadow-[0_0_10px_rgba(251,191,36,0.42)] transition-transform duration-200 group-active:scale-[0.92]"
            />
          </span>

          <span className="relative z-10 text-xs font-black text-[#ffd77a] drop-shadow-[0_1px_4px_rgba(0,0,0,0.85)] transition-colors group-active:text-[#fff3d0]">
            ထွက်
          </span>
        </button>

        <div className="pointer-events-none flex min-w-0 flex-1 justify-center px-2">
          <div className="relative flex h-[50px] w-[104px] items-center justify-center overflow-visible">
            <img
              src={logoAsset}
              alt="နဂါးနီ"
              className="h-[58px] w-[98px] scale-[1.01] object-contain brightness-110 drop-shadow-[0_0_12px_rgba(251,191,36,0.30)]"
            />
          </div>
        </div>

        <div className="flex w-[102px] flex-col items-end gap-1.5 pr-2">
          <LiveStatusPill />

          {showRoomControls ? (
            <div className="mr-1 flex items-center gap-1.5">
              <button
                type="button"
                onClick={onBackgroundMusicToggle}
                aria-label={
                  isBackgroundMusicMuted
                    ? "Turn background music on"
                    : "Turn background music off"
                }
                title={isBackgroundMusicMuted ? "Music Off" : "Music On"}
                className={`group relative flex h-[38px] w-[38px] items-center justify-center rounded-full border shadow-[0_0_14px_rgba(0,0,0,0.30),inset_0_1px_0_rgba(255,255,255,0.08)] transition duration-200 active:scale-[0.94] ${
                  isBackgroundMusicMuted
                    ? "border-[#d6a84f]/26 bg-[linear-gradient(135deg,rgba(58,22,8,0.96),rgba(92,40,14,0.90),rgba(42,15,6,0.98))] text-[#eecb82]"
                    : "border-[#ffe1a3]/34 bg-[linear-gradient(135deg,rgba(120,70,18,0.96),rgba(214,168,79,0.92),rgba(94,54,15,0.98))] text-[#fff7e3]"
                }`}
              >
                {!isBackgroundMusicMuted ? (
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
                ) : (
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
                )}
              </button>

              <button
                type="button"
                onClick={onFullscreenToggle}
                disabled={!canUseFullscreen}
                aria-label={isFullscreenMode ? "Exit fullscreen" : "Enter fullscreen"}
                title={isFullscreenMode ? "Exit Fullscreen" : "Fullscreen"}
                className={`group relative flex h-[38px] w-[38px] items-center justify-center rounded-full border shadow-[0_0_14px_rgba(0,0,0,0.30),inset_0_1px_0_rgba(255,255,255,0.08)] transition duration-200 active:scale-[0.94] disabled:opacity-35 ${
                  isFullscreenMode
                    ? "border-[#ffe1a3]/34 bg-[linear-gradient(135deg,rgba(120,70,18,0.96),rgba(214,168,79,0.92),rgba(94,54,15,0.98))] text-[#fff7e3]"
                    : "border-[#d6a84f]/26 bg-[linear-gradient(135deg,rgba(58,22,8,0.96),rgba(92,40,14,0.90),rgba(42,15,6,0.98))] text-[#f1d89b]"
                }`}
              >
                {isFullscreenMode ? (
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
                ) : (
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
                )}
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}