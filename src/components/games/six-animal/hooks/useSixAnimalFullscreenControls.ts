//src/components/games/six-animal/hooks/useSixAnimalFullscreenControls.ts

"use client";

import { useEffect, useState } from "react";

export function useSixAnimalFullscreenControls() {
  const [isFullscreenMode, setIsFullscreenMode] = useState(false);
  const [canUseFullscreen, setCanUseFullscreen] = useState(false);

  function syncFullscreenState() {
    setIsFullscreenMode(Boolean(document.fullscreenElement));
  }

  async function handleFullscreenToggle() {
    if (!canUseFullscreen) return;

    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
        return;
      }

      await document.documentElement.requestFullscreen();
    } catch {
      // Some mobile browsers block fullscreen.
      // Keep this non-blocking.
    }
  }

  async function exitFullscreenIfNeeded() {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      }
    } catch {
      // Keep navigation non-blocking.
    }
  }

  useEffect(() => {
    setCanUseFullscreen(Boolean(document.fullscreenEnabled));
    syncFullscreenState();

    document.addEventListener("fullscreenchange", syncFullscreenState);

    return () => {
      document.removeEventListener("fullscreenchange", syncFullscreenState);
    };
  }, []);

  return {
    isFullscreenMode,
    canUseFullscreen,
    handleFullscreenToggle,
    exitFullscreenIfNeeded,
  };
}