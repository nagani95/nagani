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

function getIntroTitle(
  phase: RoomIntroPhase | undefined,
  isWaitingForNextRound: boolean,
) {
  if (isWaitingForNextRound) return "နောက်ပွဲစဉ် ပြင်ဆင်နေပါသည်";
  if (phase === "closed") return "လောင်းကြေး ပိတ်ထားပါသည်";
  if (phase === "rolling") return "အန်စာတုံး လှိမ့်နေပါသည်";
  if (phase === "result") return "ရလဒ် ပြသနေပါသည်";

  return "ပွဲခန်းမ ပြင်ဆင်နေပါသည်";
}

function getIntroSubtitle(
  phase: RoomIntroPhase | undefined,
  isWaitingForNextRound: boolean,
) {
  if (isWaitingForNextRound) {
    return "ပွဲစဉ်အသစ် စတင်သည်အထိ ခဏစောင့်ပါ";
  }

  if (phase === "closed" || phase === "rolling" || phase === "result") {
    return "ယခုပွဲစဉ် ပြီးဆုံးသည်အထိ စောင့်ဆိုင်းပါ";
  }

  return "တော်ဝင်ပွဲခန်းမသို့ ဝင်ရောက်ရန် ပြင်ဆင်နေပါသည်";
}

export default function RoomIntroOverlay({
  roomBackground,
  isWaitingForNextRound,
  countdown = 0,
  phase,
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
    <div className="fixed inset-0 z-50 flex items-end justify-center overflow-hidden bg-[#090202] px-5 pb-[15vh]">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${roomBackground})` }}
      />

      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(9,2,2,0.05),rgba(9,2,2,0.16)_42%,rgba(0,0,0,0.74)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_22%,rgba(255,215,122,0.08)_0%,transparent_38%,rgba(0,0,0,0.58)_100%)]" />

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

      <div className="relative w-full max-w-sm overflow-hidden rounded-[1.85rem] border border-[#d6a84f]/25 bg-[#090202]/58 p-5 text-center shadow-2xl shadow-black/75 backdrop-blur-[7px]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,215,122,0.14),transparent_68%)]" />
        <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#ffd77a]/70 to-transparent" />

        <div className="relative z-10">
          {showCountdown ? (
            <div className="mb-4 flex justify-center">
              <div className="min-w-[86px] rounded-full border border-[#d6a84f]/25 bg-black/45 px-4 py-2 text-center text-xl font-black tabular-nums text-[#ffd77a] shadow-inner shadow-black/50">
                {safeCountdown}
              </div>
            </div>
          ) : null}

          <h2 className="text-lg font-black text-[#ffd77a]">
            {getIntroTitle(phase, isWaitingForNextRound)}
          </h2>

          <p className="mt-2 text-sm font-semibold leading-6 text-[#fff3d0]/70">
            {getIntroSubtitle(phase, isWaitingForNextRound)}
          </p>

          <div className="mt-5 overflow-hidden rounded-full border border-[#d6a84f]/16 bg-black/45 p-[2px] shadow-inner shadow-black/60">
            <div className="relative h-2.5 overflow-hidden rounded-full bg-[#fff3d0]/10">
              <div className="absolute inset-y-0 left-0 w-[42%] animate-[naganiLoadingRun_1.25s_ease-in-out_infinite] rounded-full bg-[linear-gradient(90deg,transparent,#8f6422,#d6a84f,#ffd77a,#fff3d0,#d6a84f,transparent)] shadow-[0_0_16px_rgba(255,215,122,0.36)]" />
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