//src>components>games>six-animal>RoyalRoomAtmosphere.tsx

export function RoyalRoomAtmosphere() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* warm royal ceiling lantern glow */}
      <div className="nagani-royal-lantern-glow absolute inset-x-0 top-0 h-56 bg-[radial-gradient(circle_at_50%_0%,rgba(251,191,36,0.16),rgba(127,29,29,0.09)_34%,transparent_72%)]" />

      {/* soft side darkness keeps player focused on table */}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.44),transparent_24%,transparent_76%,rgba(0,0,0,0.44))]" />

      {/* subtle palace smoke / incense atmosphere */}
      <div className="nagani-royal-smoke absolute -left-12 top-20 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(251,191,36,0.055),rgba(127,29,29,0.035)_36%,transparent_70%)] blur-3xl" />
      <div className="nagani-royal-smoke nagani-royal-smoke-delay absolute -right-16 top-28 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(251,191,36,0.05),rgba(127,29,29,0.03)_38%,transparent_72%)] blur-3xl" />

      {/* low red chamber warmth */}
      <div className="nagani-royal-floor-breathe absolute inset-x-8 bottom-0 h-64 bg-[radial-gradient(circle_at_50%_100%,rgba(127,29,29,0.2),transparent_68%)]" />

      {/* final vignette */}
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.12),transparent_32%,rgba(0,0,0,0.36))]" />

      <style jsx>{`
        .nagani-royal-lantern-glow {
          animation: naganiRoyalLanternGlow 4.8s ease-in-out infinite;
        }

        .nagani-royal-floor-breathe {
          animation: naganiRoyalFloorBreathe 6.4s ease-in-out infinite;
        }

        .nagani-royal-smoke {
          animation: naganiRoyalSmokeDrift 9.6s ease-in-out infinite;
        }

        .nagani-royal-smoke-delay {
          animation-delay: -4.8s;
        }

        @keyframes naganiRoyalLanternGlow {
          0%,
          100% {
            opacity: 0.78;
            transform: scale(1);
          }

          50% {
            opacity: 1;
            transform: scale(1.035);
          }
        }

        @keyframes naganiRoyalFloorBreathe {
          0%,
          100% {
            opacity: 0.72;
          }

          50% {
            opacity: 0.94;
          }
        }

        @keyframes naganiRoyalSmokeDrift {
          0%,
          100% {
            opacity: 0.36;
            transform: translate3d(0, 0, 0) scale(1);
          }

          50% {
            opacity: 0.58;
            transform: translate3d(12px, -10px, 0) scale(1.08);
          }
        }
      `}</style>
    </div>
  );
}