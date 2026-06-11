//src>components>games>six-animal>RoyalRoomTopBar.tsx

// src/components/games/six-animal/RoyalRoomTopBar.tsx

"use client";

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
      className={`z-20 flex min-h-[82px] shrink-0 items-center justify-between overflow-visible rounded-2xl border border-amber-300/24 bg-[linear-gradient(135deg,rgba(45,7,3,0.9),rgba(12,2,2,0.78),rgba(70,22,5,0.62))] px-3 py-2 shadow-[0_0_24px_rgba(127,29,29,0.28),inset_0_1px_0_rgba(251,191,36,0.12)] backdrop-blur-md ${className}`}
    >
      <button
        type="button"
        onClick={onExitClick}
        aria-label="Exit to lobby"
        className="group flex h-[52px] w-[82px] items-center justify-start gap-1"
      >
        <span className="sr-only">Exit to lobby</span>

        <span className="relative h-[52px] w-[42px] overflow-visible">
          <img
            src={exitDoorAsset}
            alt=""
            className="absolute left-1/2 top-1/2 h-[54px] w-[54px] -translate-x-1/2 -translate-y-1/2 object-contain drop-shadow-[0_0_10px_rgba(251,191,36,0.42)] transition-transform duration-200 group-active:scale-[0.92]"
          />
        </span>

        <span className="relative z-10 text-xs font-black text-amber-300 drop-shadow-[0_0_8px_rgba(251,191,36,0.25)] transition-colors group-active:text-amber-100">
          ထွက်
        </span>
      </button>

<div className="pointer-events-none flex min-w-0 flex-1 justify-center px-1">
  <div className="relative flex h-[58px] w-[112px] items-center justify-center overflow-visible">
    <img
      src={logoAsset}
      alt="နဂါးနီ"
      className="h-[66px] w-[108px] scale-[1.03] object-contain brightness-110 drop-shadow-[0_0_14px_rgba(251,191,36,0.42)]"
    />
  </div>
</div>

      <div className="flex w-[96px] flex-col items-end gap-1.5">
        <div className="flex w-[82px] justify-center rounded-full border border-amber-300/24 bg-[linear-gradient(135deg,rgba(251,191,36,0.18),rgba(120,53,15,0.22))] px-3 py-1 text-[10px] font-black text-amber-100 shadow-inner shadow-black/30">
          Live
        </div>

        {showRoomControls ? (
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={onBackgroundMusicToggle}
              aria-label={
                isBackgroundMusicMuted
                  ? "Turn background music on"
                  : "Turn background music off"
              }
              title={isBackgroundMusicMuted ? "Music Off" : "Music On"}
              className={`group relative flex h-10 w-10 items-center justify-center rounded-full border shadow-[0_0_14px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.08)] transition duration-200 active:scale-[0.94] ${
                isBackgroundMusicMuted
                  ? "border-red-300/30 bg-[linear-gradient(135deg,rgba(127,29,29,0.9),rgba(69,10,10,0.85))] text-red-100"
                  : "border-emerald-300/30 bg-[linear-gradient(135deg,rgba(6,78,59,0.92),rgba(6,95,70,0.84))] text-emerald-100"
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
                  <path className="animate-pulse" d="M16 9.5a4.5 4.5 0 0 1 0 5" />
                  <path className="animate-pulse" d="M18.5 7a8 8 0 0 1 0 10" />
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
              className={`group relative flex h-10 w-10 items-center justify-center rounded-full border shadow-[0_0_14px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.08)] transition duration-200 active:scale-[0.94] disabled:opacity-35 ${
                isFullscreenMode
                  ? "border-amber-200/45 bg-[linear-gradient(135deg,rgba(146,64,14,0.92),rgba(120,53,15,0.84))] text-amber-100"
                  : "border-amber-300/30 bg-[linear-gradient(135deg,rgba(45,7,3,0.92),rgba(92,26,8,0.84))] text-amber-100"
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
    </header>
  );
}