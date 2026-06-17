//src/components/nagani-v2/NaganiHomeTopControls.tsx

"use client";

import { useState } from "react";

export default function NaganiHomeTopControls() {
  const [soundOn, setSoundOn] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  async function handleFullscreenClick() {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
        return;
      }

      await document.exitFullscreen();
      setIsFullscreen(false);
    } catch {
      setIsFullscreen(false);
    }
  }

  return (
    <div className="absolute right-[6.5%] top-[3.2%] z-30 flex flex-col items-end gap-2">
      <div className="rounded-full border border-[#ffd77a]/40 bg-[#090202]/48 px-4 py-1.5 text-[0.7rem] font-black text-[#fff3d0] shadow-lg shadow-black/45 backdrop-blur-md">
        Live
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setSoundOn((value) => !value)}
          className={`flex h-10 w-10 items-center justify-center rounded-full border text-base font-black shadow-lg shadow-black/45 backdrop-blur-md active:scale-[0.96] ${
            soundOn
              ? "border-emerald-200/40 bg-emerald-500/28 text-emerald-50"
              : "border-[#ffd77a]/35 bg-[#090202]/48 text-[#ffd77a]"
          }`}
          aria-label="အသံ"
        >
          {soundOn ? "🔊" : "🔇"}
        </button>

        <button
          type="button"
          onClick={handleFullscreenClick}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-[#ffd77a]/35 bg-[#090202]/48 text-lg font-black text-[#ffd77a] shadow-lg shadow-black/45 backdrop-blur-md active:scale-[0.96]"
          aria-label="မျက်နှာပြင်အပြည့်"
        >
          {isFullscreen ? "×" : "⛶"}
        </button>
      </div>
    </div>
  );
}