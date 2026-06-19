// src/components/nagani-v2/NaganiTopLogo.tsx

import { naganiAssets } from "@/lib/naganiAssets";

type NaganiTopLogoProps = {
  subtitle?: string;
};

export default function NaganiTopLogo({ subtitle }: NaganiTopLogoProps) {
  return (
    <div className="flex flex-col items-center text-center">
      <div
        className="h-28 w-28 bg-contain bg-center bg-no-repeat drop-shadow-[0_12px_28px_rgba(0,0,0,0.82)]"
        style={{
          backgroundImage: `url(${naganiAssets.shared.logo.conceptV1})`,
        }}
        aria-label="နဂါးနီ"
      />

      <div className="-mt-2 rounded-full border border-[#ffd77a]/30 bg-[#090202]/42 px-4 py-1 text-sm font-black tracking-[0.12em] text-[#ffd77a] shadow-lg shadow-black/50 backdrop-blur-[2px]">
        နဂါးနီ
      </div>

      {subtitle ? (
        <div className="mt-2 text-xs font-medium text-[#fff3d0]/80">
          {subtitle}
        </div>
      ) : null}
    </div>
  );
}