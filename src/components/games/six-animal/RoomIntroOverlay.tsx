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
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-[#090202] px-6 text-center text-[#fff3d0]">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${roomBackground})` }}
      />

      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.18),rgba(9,2,2,0.42)_48%,rgba(0,0,0,0.86)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_36%,rgba(255,215,122,0.08)_0%,transparent_42%,rgba(0,0,0,0.52)_100%)]" />

      <button
        type="button"
        onClick={onExitClick}
        className="absolute left-3 top-[calc(0.75rem+env(safe-area-inset-top))] z-20 flex h-12 w-12 items-center justify-center rounded-full border border-[#d6a84f]/30 bg-black/38 shadow-lg shadow-black/60 backdrop-blur-md active:scale-[0.96]"
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
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#d6a84f]/30 bg-black/38 text-sm font-black text-[#ffd77a] shadow-lg shadow-black/60 backdrop-blur-md active:scale-[0.96]"
            aria-label="နောက်ခံတေးသံ"
          >
            {isBackgroundMusicMuted ? "♪̸" : "♪"}
          </button>

          {canUseFullscreen ? (
<button
  type="button"
  onClick={onFullscreenToggle}
  style={{
    animation: !isFullscreenMode
      ? "naganiFullscreenHint 1.65s ease-in-out infinite"
      : undefined,
  }}
  className={`flex h-10 w-10 items-center justify-center rounded-full border text-sm font-black shadow-lg shadow-black/60 backdrop-blur-md active:scale-[0.96] ${
    isFullscreenMode
      ? "border-[#d6a84f]/30 bg-black/38 text-[#ffd77a]"
      : "border-[#ffe1a3]/48 bg-[#9b651d]/70 text-[#fff7e3]"
  }`}
  aria-label="မျက်နှာပြင်အပြည့်"
>
              {isFullscreenMode ? "×" : "⛶"}
            </button>
          ) : null}
        </div>
      ) : null}

      <div className="relative z-10 w-full max-w-[340px] overflow-hidden rounded-[2rem] border border-[#c8922f]/38 bg-[linear-gradient(180deg,rgba(38,12,7,0.9),rgba(13,4,3,0.96))] px-7 py-8 shadow-[0_30px_90px_rgba(0,0,0,0.88)] backdrop-blur-[8px]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,215,122,0.18),transparent_58%)]" />
        <div className="pointer-events-none absolute inset-[1px] rounded-[calc(2rem-1px)] border border-[#fff3d0]/8" />
        <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-[#fff3d0]/75 to-transparent" />
        <div className="pointer-events-none absolute inset-x-12 bottom-0 h-px bg-gradient-to-r from-transparent via-[#c8922f]/48 to-transparent" />

        <div className="relative z-10 flex flex-col items-center">
          <img
            src={logoAsset}
            alt="ရွှေအိုး"
            className="h-auto w-[10.6rem] object-contain drop-shadow-[0_10px_22px_rgba(0,0,0,0.72)]"
            draggable={false}
          />

          <p className="mt-4 text-[1.18rem] font-black leading-8 text-[#ffd77a] drop-shadow-[0_2px_8px_rgba(0,0,0,0.86)]">
            {statusText}
          </p>

          {safeCountdown > 0 ? (
            <p className="mt-1 text-[0.85rem] font-black text-[#fff3d0]/72">
              {safeCountdown} စက္ကန့်
            </p>
          ) : null}

          <div className="mt-6 w-full overflow-hidden rounded-full border border-[#a66d20]/55 bg-[rgba(0,0,0,0.68)] p-[3px] shadow-[inset_0_1px_4px_rgba(255,215,122,0.06)]">
            <div className="relative h-[0.7rem] overflow-hidden rounded-full bg-[linear-gradient(180deg,rgba(255,243,208,0.04),rgba(0,0,0,0.24))]">
              <div className="absolute inset-y-[1px] left-0 w-[38%] animate-[naganiBootLoading_1.5s_ease-in-out_infinite] rounded-full bg-[linear-gradient(90deg,#6f4712_0%,#b67a20_24%,#f0c35d_52%,#fff0b8_72%,#d9a33d_100%)] shadow-[0_0_14px_rgba(255,215,122,0.42)]" />
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes naganiBootLoading {
          0% {
            transform: translateX(-125%);
          }

          100% {
            transform: translateX(260%);
          }
        }
                  @keyframes naganiFullscreenHint {
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
    </div>
  );
}