// src/components/games/six-animal/RoomIntroOverlay.tsx

"use client";

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
  phase = "loading",
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

  const statusText = isWaitingForNextRound
    ? "နောက်ပွဲစဉ် စောင့်ဆိုင်းနေပါသည်"
    : phase === "betting"
      ? "လောင်းကြေးဖွင့်နေပါသည်"
      : phase === "closed"
        ? "လောင်းကြေးပိတ်နေပါသည်"
        : phase === "rolling"
          ? "အန်စာလှိမ့်နေပါသည်"
          : phase === "result"
            ? "ရလဒ်ပြသနေပါသည်"
            : "တော်ဝင်ပွဲခန်းမ ပြင်ဆင်နေပါသည်";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-[#090202] px-6">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${roomBackground})` }}
      />

      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(9,2,2,0.38),rgba(9,2,2,0.64),rgba(0,0,0,0.9))]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_34%,rgba(255,215,122,0.13)_0%,transparent_36%,rgba(0,0,0,0.68)_100%)]" />

      <button
        type="button"
        onClick={onExitClick}
        className="absolute left-3 top-[calc(0.75rem+env(safe-area-inset-top))] z-20 flex h-12 w-12 items-center justify-center rounded-full border border-[#d6a84f]/30 bg-black/35 shadow-lg shadow-black/50 backdrop-blur-md active:scale-[0.96]"
        aria-label="ထွက်ရန်"
      >
        <img
          src={exitDoorAsset}
          alt=""
          aria-hidden="true"
          className="h-8 w-8 object-contain"
          draggable={false}
        />
      </button>

      {showRoomControls ? (
        <div className="absolute right-3 top-[calc(0.75rem+env(safe-area-inset-top))] z-20 flex items-center gap-2">
          <button
            type="button"
            onClick={onBackgroundMusicToggle}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#d6a84f]/30 bg-black/35 text-sm font-black text-[#ffd77a] shadow-lg shadow-black/50 backdrop-blur-md active:scale-[0.96]"
            aria-label="နောက်ခံတေးသံ"
          >
            {isBackgroundMusicMuted ? "♪̸" : "♪"}
          </button>

          {canUseFullscreen ? (
            <button
              type="button"
              onClick={onFullscreenToggle}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#d6a84f]/30 bg-black/35 text-sm font-black text-[#ffd77a] shadow-lg shadow-black/50 backdrop-blur-md active:scale-[0.96]"
              aria-label="မျက်နှာပြင်အပြည့်"
            >
              {isFullscreenMode ? "×" : "⛶"}
            </button>
          ) : null}
        </div>
      ) : null}

      <div className="relative w-full max-w-[300px] overflow-hidden rounded-[1.7rem] border border-[#d6a84f]/24 bg-[#090202]/62 px-6 py-7 text-center shadow-2xl shadow-black/80 backdrop-blur-[7px]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,215,122,0.16),transparent_68%)]" />
        <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-[#ffd77a]/75 to-transparent" />

        <div className="relative z-10">
          <img
            src={logoAsset}
            alt="နဂါးနီ"
            className="mx-auto h-20 w-20 object-contain drop-shadow-[0_0_22px_rgba(255,215,122,0.28)]"
            draggable={false}
          />

          <h2 className="mt-4 text-lg font-black text-[#ffd77a]">နဂါးနီ</h2>

          <p className="mt-2 text-sm font-semibold leading-6 text-[#fff3d0]/68">
            {statusText}
          </p>

          {safeCountdown > 0 ? (
            <p className="mt-2 text-xs font-black text-[#ffd77a]/80">
              {safeCountdown} စက္ကန့်
            </p>
          ) : null}

          <div className="mt-5 overflow-hidden rounded-full border border-[#d6a84f]/16 bg-black/45 p-[2px] shadow-inner shadow-black/60">
            <div className="relative h-2.5 overflow-hidden rounded-full bg-[#fff3d0]/10">
              <div className="absolute inset-y-0 left-0 w-[42%] animate-[naganiBootLoading_1.35s_ease-in-out_infinite] rounded-full bg-[linear-gradient(90deg,transparent,#8f6422,#d6a84f,#ffd77a,#fff3d0,#d6a84f,transparent)] shadow-[0_0_16px_rgba(255,215,122,0.34)]" />
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes naganiBootLoading {
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