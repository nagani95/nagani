// src/components/nagani-v2/NaganiHomeTopControls.tsx

"use client";

import { useEffect, useState } from "react";

const BGM_MUTED_KEY = "nagani-lobby-bgm-muted-v1";

export default function NaganiHomeTopControls() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [canUseFullscreen, setCanUseFullscreen] = useState(false);
  const [isBgmMuted, setIsBgmMuted] = useState(false);

  useEffect(() => {
    setCanUseFullscreen(Boolean(document.fullscreenEnabled));
    setIsBgmMuted(localStorage.getItem(BGM_MUTED_KEY) === "1");

    function syncFullscreenState() {
      setIsFullscreen(Boolean(document.fullscreenElement));
    }

    function syncBgmMutedState(event: Event) {
      const customEvent = event as CustomEvent<{ muted: boolean }>;

      if (typeof customEvent.detail?.muted === "boolean") {
        setIsBgmMuted(customEvent.detail.muted);
        return;
      }

      setIsBgmMuted(localStorage.getItem(BGM_MUTED_KEY) === "1");
    }

    syncFullscreenState();

    document.addEventListener("fullscreenchange", syncFullscreenState);
    window.addEventListener("nagani:lobby-bgm-muted-change", syncBgmMutedState);

    return () => {
      document.removeEventListener("fullscreenchange", syncFullscreenState);
      window.removeEventListener(
        "nagani:lobby-bgm-muted-change",
        syncBgmMutedState
      );
    };
  }, []);

  function handleBgmClick() {
    window.dispatchEvent(new Event("nagani:lobby-bgm-toggle"));
  }

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

      <button
        type="button"
        onClick={handleBgmClick}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-[#ffd77a]/35 bg-[#090202]/48 text-lg font-black text-[#ffd77a] shadow-lg shadow-black/45 backdrop-blur-md active:scale-[0.96]"
        aria-label={
          isBgmMuted ? "နောက်ခံတေးဂီတ ဖွင့်ရန်" : "နောက်ခံတေးဂီတ ပိတ်ရန်"
        }
      >
        {isBgmMuted ? "🔇" : "🔊"}
      </button>

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