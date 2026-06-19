//src/components/nagani-v2/NaganiFloatingSupport.tsx

"use client";

import Link from "next/link";

type NaganiFloatingSupportProps = {
  href?: string;
};

export default function NaganiFloatingSupport({
  href = "/cashier",
}: NaganiFloatingSupportProps) {
  return (
    <Link
      href={href}
      aria-label="ကူညီရေး"
      className="fixed bottom-[calc(6.6rem+env(safe-area-inset-bottom))] right-4 z-30 flex min-h-11 min-w-11 items-center justify-center rounded-full border border-[#ffd77a]/35 bg-gradient-to-b from-[#4b0808]/92 via-[#2a0707]/92 to-[#090202]/96 px-3 text-[#ffd77a] shadow-[0_12px_28px_rgba(0,0,0,0.5)] backdrop-blur-md transition active:scale-95"
    >
      <span className="mr-1 text-base leading-none">☎</span>
      <span className="text-[0.68rem] font-semibold leading-none">
        ကူညီရေး
      </span>
    </Link>
  );
}