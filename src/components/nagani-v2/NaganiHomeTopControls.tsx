// src/components/nagani-v2/NaganiHomeTopControls.tsx

"use client";

import { useEffect, useState } from "react";

export default function NaganiHomeTopControls() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [canUseFullscreen, setCanUseFullscreen] = useState(false);

  useEffect(() => {
    setCanUseFullscreen(Boolean(document.fullscreenEnabled));

    function syncFullscreenState() {
      setIsFullscreen(Boolean(document.fullscreenElement));
    }

    syncFullscreenState();

    document.addEventListener("fullscreenchange", syncFullscreenState);

    return () => {
      document.removeEventListener("fullscreenchange", syncFullscreenState);
    };
  }, []);

  async function handleFullscreenClick() {
    if (!canUseFullscreen) return;

    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        return;
      }

      await document.exitFullscreen();
    } catch {
      setIsFullscreen(false);
    }
  }

  return (
    <div className="absolute right-[6.5%] top-[3.2%] z-30 flex flex-col items-end gap-2">
      <div className="rounded-full border border-[#ffd77a]/40 bg-[#090202]/48 px-4 py-1.5 text-[0.7rem] font-black text-[#fff3d0] shadow-lg shadow-black/45 backdrop-blur-md">
        Live
      </div>

      {canUseFullscreen ? (
        <button
          type="button"
          onClick={handleFullscreenClick}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-[#ffd77a]/35 bg-[#090202]/48 text-lg font-black text-[#ffd77a] shadow-lg shadow-black/45 backdrop-blur-md active:scale-[0.96]"
          aria-label="မျက်နှာပြင်အပြည့်"
        >
          {isFullscreen ? "×" : "⛶"}
        </button>
      ) : null}
    </div>
  );
}