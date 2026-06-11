// src/components/games/six-animal/RoomIntroOverlay.tsx

"use client";

import RoyalRoomTopBar from "./RoyalRoomTopBar";

type RoomIntroPhase = "loading" | "betting" | "closed" | "rolling" | "result";

type RoomIntroOverlayProps = {
  roomBackground: string;
  isWaitingForNextRound: boolean;
  countdown?: number;
  phase?: RoomIntroPhase;
  exitDoorAsset: string;
  logoAsset: string;
  onExitClick: () => void;

  showRoomControls?: boolean;
  isBackgroundMusicMuted?: boolean;
  isFullscreenMode?: boolean;
  canUseFullscreen?: boolean;
  onBackgroundMusicToggle?: () => void;
  onFullscreenToggle?: () => void;
};

export default function RoomIntroOverlay({
  roomBackground,
  isWaitingForNextRound,
  countdown = 0,
  exitDoorAsset,
  logoAsset,
  onExitClick,
  showRoomControls = false,
  isBackgroundMusicMuted = false,
  isFullscreenMode = false,
  canUseFullscreen = false,
  onBackgroundMusicToggle,
  onFullscreenToggle,
}: RoomIntroOverlayProps) {
  const safeCountdown = Math.max(0, countdown);
  const showCountdown = isWaitingForNextRound && safeCountdown > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center overflow-hidden bg-black px-5 pb-[15vh]">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${roomBackground})` }}
      />

      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.02),rgba(0,0,0,0.08)_42%,rgba(0,0,0,0.68)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_25%,transparent_0%,rgba(0,0,0,0.04)_42%,rgba(0,0,0,0.55)_100%)]" />

      <div className="absolute left-1/2 top-3 z-20 w-[calc(100%-24px)] max-w-[380px] -translate-x-1/2">
        <RoyalRoomTopBar
          exitDoorAsset={exitDoorAsset}
          logoAsset={logoAsset}
          onExitClick={onExitClick}
          showRoomControls={showRoomControls}
          isBackgroundMusicMuted={isBackgroundMusicMuted}
          isFullscreenMode={isFullscreenMode}
          canUseFullscreen={canUseFullscreen}
          onBackgroundMusicToggle={onBackgroundMusicToggle}
          onFullscreenToggle={onFullscreenToggle}
        />
      </div>

      <div className="relative w-full max-w-sm overflow-hidden rounded-[1.65rem] border border-amber-300/22 bg-black/38 p-5 shadow-2xl shadow-black/70 backdrop-blur-[6px]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(251,191,36,0.12),transparent_68%)]" />
        <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-amber-200/65 to-transparent" />

        <div className="relative z-10">
          {showCountdown ? (
            <div className="mb-3 flex justify-center">
              <div className="min-w-[72px] rounded-full border border-amber-300/20 bg-black/42 px-4 py-1 text-center text-lg font-black tabular-nums text-amber-50 shadow-inner shadow-black/50">
                {safeCountdown}s
              </div>
            </div>
          ) : null}

          <div className="overflow-hidden rounded-full border border-amber-300/12 bg-black/42 p-[2px] shadow-inner shadow-black/60">
            <div className="relative h-2.5 overflow-hidden rounded-full bg-white/10">
              <div className="absolute inset-y-0 left-0 w-[42%] animate-[naganiLoadingRun_1.25s_ease-in-out_infinite] rounded-full bg-[linear-gradient(90deg,transparent,#d6a937,#facc15,#fff3a3,#facc15,transparent)] shadow-[0_0_16px_rgba(251,191,36,0.35)]" />
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes naganiLoadingRun {
          0% {
            transform: translateX(-120%);
          }

          100% {
            transform: translateX(260%);
          }
        }
      `}</style>
    </div>
  );
}