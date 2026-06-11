//src>components>games>six-animal>RoomIntroOverlay.tsx

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
};

export default function RoomIntroOverlay({
  roomBackground,
  isWaitingForNextRound,
  countdown = 0,
  exitDoorAsset,
  logoAsset,
  onExitClick,
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

      <div className="absolute left-1/2 top-3 z-20 w-[calc(100%-24px)] max-w-[380px] -translate-x-1/2 rounded-2xl border border-amber-300/24 bg-[linear-gradient(135deg,rgba(45,7,3,0.9),rgba(12,2,2,0.78),rgba(70,22,5,0.62))] px-3 py-2 shadow-[0_0_24px_rgba(127,29,29,0.28),inset_0_1px_0_rgba(251,191,36,0.12)] backdrop-blur-md">
        <div className="flex items-center justify-between">
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
    Exit
  </span>
</button>

<div className="flex min-w-0 flex-1 justify-center px-2">
  <img
    src={logoAsset}
    alt="နဂါးနီ"
    className="h-[54px] w-[92px] object-contain drop-shadow-[0_0_14px_rgba(251,191,36,0.32)]"
  />
</div>

<div className="flex w-[82px] justify-center rounded-full border border-amber-300/24 bg-[linear-gradient(135deg,rgba(251,191,36,0.18),rgba(120,53,15,0.22))] px-3 py-1 text-[10px] font-black text-amber-100 shadow-inner shadow-black/30">
  Live
</div>
        </div>
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