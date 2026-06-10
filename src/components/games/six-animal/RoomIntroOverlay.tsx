//src>components>games>six-animal>FloatingResultBoard.tsx

"use client";

type RoomIntroOverlayProps = {
  roomBackground: string;
  isWaitingForNextRound: boolean;
};

export default function RoomIntroOverlay({
  roomBackground,
  isWaitingForNextRound,
}: RoomIntroOverlayProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-100"
        style={{ backgroundImage: `url(${roomBackground})` }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.18),rgba(20,3,3,0.24),rgba(0,0,0,0.38))]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,transparent_0%,rgba(0,0,0,0.18)_48%,rgba(0,0,0,0.55)_100%)]" />

      <div className="relative mx-5 w-full max-w-sm rounded-[2rem] border border-amber-300/25 bg-black/70 p-6 text-center shadow-2xl shadow-red-950/50 backdrop-blur-xl">
        <p className="text-[10px] font-black uppercase tracking-[0.38em] text-amber-200/70">
          {isWaitingForNextRound ? "Round In Progress" : "Entering Live Room"}
        </p>

        <h1 className="mt-3 text-3xl font-black text-amber-50">
          Six Animal
        </h1>

        <p className="mt-3 text-sm font-bold leading-relaxed text-white/65">
          {isWaitingForNextRound
            ? "Please wait for the current round to finish. You will be joined when betting opens."
            : "Preparing table, dice, and live round timer."}
        </p>

        <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
          <div className="h-full w-2/3 animate-pulse rounded-full bg-amber-300" />
        </div>
      </div>
    </div>
  );
}