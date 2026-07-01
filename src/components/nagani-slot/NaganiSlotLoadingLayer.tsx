// src/components/nagani-slot/NaganiSlotLoadingLayer.tsx

export default function NaganiSlotLoadingLayer() {
  return (
    <div className="absolute inset-0 z-[100] flex items-center justify-center overflow-hidden bg-[#050000]">
      <style>{`
        @keyframes naganiSlotLoadingShimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(160%);
          }
        }

        @keyframes naganiSlotLoadingOrb {
          0%, 100% {
            transform: scale(1);
            filter: brightness(1);
          }
          50% {
            transform: scale(1.08);
            filter: brightness(1.28);
          }
        }
      `}</style>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_34%,rgba(255,218,121,0.22),transparent_34%),linear-gradient(180deg,#3d0804,#100101_52%,#020000)]" />
      <div className="absolute left-1/2 top-[16%] h-[300px] w-[300px] -translate-x-1/2 rounded-full bg-[#ffd979]/10 blur-3xl" />

      <div className="relative w-[min(82%,330px)] rounded-[34px] border border-[#ffd979]/48 bg-[linear-gradient(180deg,#651309,#280202_62%,#070000)] px-6 py-7 text-center shadow-[0_26px_76px_rgba(0,0,0,0.84),inset_0_1px_0_rgba(255,232,163,0.24)]">
        <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#fff0b9]/82 to-transparent" />

        <p className="text-[10px] font-black tracking-[0.34em] text-[#ffd979]/64">
          NAGANI SLOT
        </p>

        <h1 className="mt-2 text-3xl font-black leading-none text-[#fff0b9] drop-shadow-[0_3px_10px_rgba(0,0,0,0.85)]">
          ရွှေအိုး
        </h1>

        <div
          className="mx-auto mt-5 h-16 w-16 rounded-full border border-[#ffd979]/55 bg-[radial-gradient(circle_at_50%_25%,#fff0b9,#c87722_48%,#250101)] shadow-[0_0_30px_rgba(255,218,121,0.32)]"
          style={{
            animation: "naganiSlotLoadingOrb 980ms ease-in-out infinite",
          }}
        />

        <p className="mt-5 text-[13px] font-black text-[#ffe7a3]/88">
          ဂိမ်းခန်း ပြင်ဆင်နေပါသည်...
        </p>

        <div className="relative mt-4 h-2 overflow-hidden rounded-full border border-[#ffd979]/28 bg-black/50">
          <div className="h-full w-full rounded-full bg-[linear-gradient(90deg,#5d0b06,#d99b36,#fff0b9,#d99b36,#5d0b06)] opacity-80" />
          <div
            className="absolute inset-y-0 left-0 w-1/2 bg-white/45 blur-[2px]"
            style={{
              animation: "naganiSlotLoadingShimmer 920ms ease-in-out infinite",
            }}
          />
        </div>

        <p className="mt-4 text-[10px] font-bold text-[#ffd979]/42">
          Visual demo room · no wallet connected
        </p>
      </div>
    </div>
  );
}