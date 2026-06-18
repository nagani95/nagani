// src/components/games/six-animal/LiveStatusPill.tsx

"use client";

type LiveStatusPillProps = {
  label?: string;
  className?: string;
};

export default function LiveStatusPill({
  label = "Live",
  className = "",
}: LiveStatusPillProps) {
  return (
    <div
      className={`relative flex min-w-[68px] items-center justify-center overflow-hidden rounded-full border border-[#ffd77a]/34 bg-[linear-gradient(135deg,rgba(42,18,9,0.92),rgba(120,70,18,0.72),rgba(42,18,9,0.94))] px-3 py-1 text-[10px] font-black text-[#fff3d0] shadow-[0_0_12px_rgba(255,215,122,0.12),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-[1px] ${className}`}
    >
      <span className="pointer-events-none absolute inset-0 animate-[naganiLiveBreath_3.8s_ease-in-out_infinite] rounded-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,215,122,0.20),transparent_68%)]" />

      <span className="pointer-events-none absolute inset-y-0 -left-8 w-8 animate-[naganiLiveShine_4.8s_ease-in-out_infinite] bg-[linear-gradient(90deg,transparent,rgba(255,243,208,0.28),transparent)]" />

      <span className="relative z-10 mr-1.5 h-1.5 w-1.5 rounded-full border border-[#fff3d0]/55 bg-[#ffcf5a] shadow-[0_0_9px_rgba(255,207,90,0.75)]">
        <span className="absolute inset-0 animate-[naganiLiveDot_2.8s_ease-in-out_infinite] rounded-full bg-[#ffcf5a]" />
      </span>

      <span className="relative z-10 tracking-[0.02em] drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
        {label}
      </span>

      <style jsx>{`
        @keyframes naganiLiveBreath {
          0%,
          100% {
            opacity: 0.35;
            transform: scale(0.96);
          }

          50% {
            opacity: 1;
            transform: scale(1.05);
          }
        }

        @keyframes naganiLiveShine {
          0%,
          42% {
            transform: translateX(-120%);
            opacity: 0;
          }

          52% {
            opacity: 1;
          }

          72% {
            transform: translateX(420%);
            opacity: 0;
          }

          100% {
            transform: translateX(420%);
            opacity: 0;
          }
        }

        @keyframes naganiLiveDot {
          0%,
          100% {
            opacity: 0.45;
            transform: scale(1);
          }

          50% {
            opacity: 0;
            transform: scale(2.8);
          }
        }
      `}</style>
    </div>
  );
}