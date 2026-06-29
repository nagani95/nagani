// src/components/nagani-v2/NaganiLobbyBgm.tsx

"use client";

import { useEffect, useRef } from "react";
import { getNaganiMixedVolume } from "@/lib/nagani-sound/soundMixerSettings";

const LOBBY_BGM_SRC =
  "/assets/nagani/sounds/lobby/bgm/lobby-palace-bgm-v1.mp3";

const BGM_MUTED_KEY = "nagani-lobby-bgm-muted-v1";
const NORMAL_VOLUME = 0.22;
const DUCKED_VOLUME = 0.08;

export default function NaganiLobbyBgm() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const isMuted = localStorage.getItem(BGM_MUTED_KEY) === "1";

    audio.loop = true;
    audio.muted = isMuted;
    audio.volume = isMuted
      ? 0
      : getNaganiMixedVolume("lobbyBgm", NORMAL_VOLUME);

    const startBgm = () => {
      if (localStorage.getItem(BGM_MUTED_KEY) === "1") return;

      audio.volume = getNaganiMixedVolume("lobbyBgm", NORMAL_VOLUME);
      void audio.play().catch(() => {});
    };

    const duckBgm = () => {
      if (localStorage.getItem(BGM_MUTED_KEY) === "1") return;

      audio.volume = getNaganiMixedVolume("lobbyBgm", DUCKED_VOLUME);
    };

    const restoreBgm = () => {
      if (localStorage.getItem(BGM_MUTED_KEY) === "1") return;

      audio.volume = getNaganiMixedVolume("lobbyBgm", NORMAL_VOLUME);
    };

    const toggleBgm = () => {
      const nextMuted = localStorage.getItem(BGM_MUTED_KEY) !== "1";

      localStorage.setItem(BGM_MUTED_KEY, nextMuted ? "1" : "0");

      audio.muted = nextMuted;
      audio.volume = nextMuted
        ? 0
        : getNaganiMixedVolume("lobbyBgm", NORMAL_VOLUME);

      if (nextMuted) {
        audio.pause();
      } else {
        void audio.play().catch(() => {});
      }

      window.dispatchEvent(
        new CustomEvent("nagani:lobby-bgm-muted-change", {
          detail: { muted: nextMuted },
        })
      );
    };

    const syncMixerVolume = () => {
      if (localStorage.getItem(BGM_MUTED_KEY) === "1") return;

      audio.volume = getNaganiMixedVolume("lobbyBgm", NORMAL_VOLUME);
    };

    window.addEventListener("pointerdown", startBgm);
    window.addEventListener("touchend", startBgm);
    window.addEventListener("click", startBgm);
    window.addEventListener("keydown", startBgm);

    window.addEventListener("nagani:lobby-bgm-duck", duckBgm);
    window.addEventListener("nagani:lobby-bgm-restore", restoreBgm);
    window.addEventListener("nagani:lobby-bgm-toggle", toggleBgm);
    window.addEventListener("nagani:sound-mixer-change", syncMixerVolume);

    void audio.play().catch(() => {});

    return () => {
      window.removeEventListener("pointerdown", startBgm);
      window.removeEventListener("touchend", startBgm);
      window.removeEventListener("click", startBgm);
      window.removeEventListener("keydown", startBgm);

      window.removeEventListener("nagani:lobby-bgm-duck", duckBgm);
      window.removeEventListener("nagani:lobby-bgm-restore", restoreBgm);
      window.removeEventListener("nagani:lobby-bgm-toggle", toggleBgm);
      window.removeEventListener("nagani:sound-mixer-change", syncMixerVolume);

      audio.pause();
      audio.currentTime = 0;
    };
  }, []);

  return <audio ref={audioRef} src={LOBBY_BGM_SRC} preload="auto" playsInline />;
}