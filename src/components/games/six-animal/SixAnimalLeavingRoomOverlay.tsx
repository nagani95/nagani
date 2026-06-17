//src/components/games/six-animal/SixAnimalLeavingRoomOverlay.tsx

export default function SixAnimalLeavingRoomOverlay() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/85 backdrop-blur-sm">
      <div className="relative mx-5 w-full max-w-sm rounded-[2rem] border border-amber-300/25 bg-black/70 p-6 text-center shadow-2xl shadow-black/80 backdrop-blur-xl">
        <div className="mx-auto mb-5 h-10 w-10 animate-spin rounded-full border-4 border-amber-300/20 border-t-amber-300" />

        <p className="text-[10px] font-black uppercase tracking-[0.38em] text-amber-200/70">
          Leaving Room
        </p>

        <p className="mt-3 text-sm font-bold leading-relaxed text-white/65">
          Waiting for the current round to settle to safely return you to the
          lobby.
        </p>
      </div>
    </div>
  );
}