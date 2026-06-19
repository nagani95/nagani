//src/components/nagani-v2/NaganiLobbyBgm.tsx

"use client";

import { useEffect, useRef } from "react";

const LOBBY_BGM_SRC = "/assets/nagani/sounds/lobby-palace-bgm-v1.mp3";

export default function NaganiLobbyBgm() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.22;

    const tryPlay = () => {
      void audio.play().catch(() => {});
    };

    tryPlay();

    window.addEventListener("pointerdown", tryPlay, { once: true });
    window.addEventListener("keydown", tryPlay, { once: true });

    return () => {
      window.removeEventListener("pointerdown", tryPlay);
      window.removeEventListener("keydown", tryPlay);
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);

  return (
    <audio
      ref={audioRef}
      src={LOBBY_BGM_SRC}
      loop
      preload="auto"
      playsInline
    />
  );
}