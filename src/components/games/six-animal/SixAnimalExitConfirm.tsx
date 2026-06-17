//src/components/games/six-animal/SixAnimalExitConfirm.tsx

type SixAnimalExitConfirmProps = {
  exitDoorAsset: string;
  onStayClick: () => void;
  onLeaveClick: () => void;
};

export default function SixAnimalExitConfirm({
  exitDoorAsset,
  onStayClick,
  onLeaveClick,
}: SixAnimalExitConfirmProps) {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/72 px-5 backdrop-blur-sm">
      <div className="relative w-full max-w-[340px] overflow-hidden rounded-[1.75rem] border border-amber-300/28 bg-[linear-gradient(145deg,rgba(45,7,3,0.96),rgba(8,1,1,0.94),rgba(54,12,5,0.9))] p-5 text-center shadow-2xl shadow-black/80">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(251,191,36,0.18),transparent_62%)]" />
        <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-amber-200/80 to-transparent" />

        <div className="relative z-10">
          <div className="mx-auto -mb-1 -mt-2 flex h-[86px] w-[104px] items-center justify-center overflow-visible">
            <img
              src={exitDoorAsset}
              alt=""
              className="h-[92px] w-[92px] max-w-none object-contain drop-shadow-[0_0_18px_rgba(251,191,36,0.45)]"
            />
          </div>

          <p className="mt-3 text-[10px] font-black uppercase tracking-[0.3em] text-amber-200/65">
            Leave Room
          </p>

          <p className="mt-2 text-lg font-black text-white">
            Return to Lobby?
          </p>

          <p className="mt-2 text-xs font-bold leading-5 text-white/55">
            Your placed bets stay active. You can return to the lobby now.
          </p>

          <div className="mt-5 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={onStayClick}
              className="rounded-xl border border-amber-300/18 bg-black/35 px-4 py-3 text-sm font-black text-amber-100 transition active:scale-[0.96]"
            >
              Stay
            </button>

            <button
              type="button"
              onClick={onLeaveClick}
              className="rounded-xl border border-amber-100/55 bg-[linear-gradient(135deg,#facc15,#d6a937,#8a5b12)] px-4 py-3 text-sm font-black text-black shadow-[0_0_16px_rgba(251,191,36,0.16)] transition active:scale-[0.96]"
            >
              Leave
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}