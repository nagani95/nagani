// src/components/nagani-slot/NaganiSlotLoadingLayer.tsx

import { naganiAssets } from "@/lib/naganiAssets";

const SLOT_ROOM_BG_IMAGE = "/assets/nagani/slot/ui/room-bg-v1.png";

export default function NaganiSlotLoadingLayer() {
  return (
    <div className="absolute inset-0 z-[100] flex items-center justify-center overflow-hidden bg-[#050000]">
      <style>{`
        @keyframes naganiSlotLoadingShimmer {
          0% {
            transform: translateX(-120%);
          }
          100% {
            transform: translateX(160%);
          }
        }

        @keyframes naganiSlotLoadingLogoBreath {
          0%, 100% {
            transform: translateY(0) scale(1);
            filter: brightness(1);
          }
          50% {
            transform: translateY(-2px) scale(1.018);
            filter: brightness(1.08);
          }
        }
      `}</style>

      <img
        src={SLOT_ROOM_BG_IMAGE}
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-center"
        draggable={false}
      />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(255,215,122,0.12),transparent_38%),linear-gradient(180deg,rgba(0,0,0,0.36),rgba(0,0,0,0.66)_56%,rgba(0,0,0,0.9))]" />

      <div className="absolute inset-x-0 top-0 h-[28%] bg-[linear-gradient(180deg,rgba(0,0,0,0.72),transparent)]" />
      <div className="absolute inset-x-0 bottom-0 h-[36%] bg-[linear-gradient(0deg,rgba(0,0,0,0.9),transparent)]" />

      <div className="relative w-[min(82%,330px)] overflow-hidden rounded-[34px] border border-[#8f5f25]/70 bg-[linear-gradient(180deg,rgba(72,24,13,0.96),rgba(37,8,5,0.97)_56%,rgba(9,1,1,0.99))] px-6 pb-7 pt-7 text-center shadow-[0_28px_78px_rgba(0,0,0,0.86),inset_0_1px_0_rgba(255,232,163,0.18)]">
        <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#fff0b9]/70 to-transparent" />
        <div className="pointer-events-none absolute inset-x-10 bottom-0 h-px bg-gradient-to-r from-transparent via-[#b97823]/60 to-transparent" />

        <div
          className="mx-auto h-[9.4rem] w-[9.4rem] bg-contain bg-center bg-no-repeat drop-shadow-[0_14px_28px_rgba(0,0,0,0.84)]"
          style={{
            backgroundImage: `url(${naganiAssets.shared.logo.conceptV1})`,
            animation: "naganiSlotLoadingLogoBreath 1700ms ease-in-out infinite",
          }}
          aria-label="နဂါးနီရွှေအိုး"
        />

        <div className="mx-auto -mt-2 h-px w-[62%] bg-gradient-to-r from-transparent via-[#ffd77a]/46 to-transparent" />

        <p className="mt-4 text-[1.02rem] font-black leading-6 text-[#fff3d0] drop-shadow-[0_3px_8px_rgba(0,0,0,0.92)]">
          ရွှေအိုးဂိမ်းခန်း ဝင်နေသည်
        </p>

        <p className="mt-1 text-[0.62rem] font-bold leading-4 text-[#f7dfaa]/62">
          ခဏစောင့်ပါ · ဂိမ်းခန်းပြင်ဆင်နေပါသည်
        </p>

        <div className="relative mt-6 h-[0.58rem] overflow-hidden rounded-full border border-[#ffd77a]/30 bg-black/62 shadow-[inset_0_1px_3px_rgba(0,0,0,0.82)]">
          <div className="h-full w-full rounded-full bg-[linear-gradient(90deg,#2e0704,#9b5d1d,#ffd77a,#fff3d0,#9b5d1d,#2e0704)] opacity-85" />
          <div
            className="absolute inset-y-0 left-0 w-1/2 bg-white/42 blur-[2px]"
            style={{
              animation: "naganiSlotLoadingShimmer 1050ms ease-in-out infinite",
            }}
          />
        </div>
      </div>
    </div>
  );
}