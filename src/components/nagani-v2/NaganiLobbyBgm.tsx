//src/components/nagani-v2/NaganiLobbyBgm.tsx

"use client";

import { useEffect, useRef, useState } from "react";

const LOBBY_BGM_SRC = "/assets/nagani/sounds/lobby-palace-bgm-v1.mp3";
const BGM_MUTED_KEY = "nagani-lobby-bgm-muted-v1";
const NORMAL_VOLUME = 0.22;
const DUCKED_VOLUME = 0.08;

export default function NaganiLobbyBgm() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    setIsMuted(localStorage.getItem(BGM_MUTED_KEY) === "1");
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.loop = true;
    audio.volume = isMuted ? 0 : NORMAL_VOLUME;
    audio.muted = isMuted;

    const startBgm = () => {
      if (localStorage.getItem(BGM_MUTED_KEY) === "1") return;
      void audio.play().catch(() => {});
    };

    const duckBgm = () => {
      if (localStorage.getItem(BGM_MUTED_KEY) === "1") return;
      audio.volume = DUCKED_VOLUME;
    };

    const restoreBgm = () => {
      if (localStorage.getItem(BGM_MUTED_KEY) === "1") return;
      audio.volume = NORMAL_VOLUME;
    };

    window.addEventListener("pointerdown", startBgm);
    window.addEventListener("touchend", startBgm);
    window.addEventListener("click", startBgm);
    window.addEventListener("keydown", startBgm);

    window.addEventListener("nagani:lobby-bgm-duck", duckBgm);
    window.addEventListener("nagani:lobby-bgm-restore", restoreBgm);

    void audio.play().catch(() => {});

    return () => {
      window.removeEventListener("pointerdown", startBgm);
      window.removeEventListener("touchend", startBgm);
      window.removeEventListener("click", startBgm);
      window.removeEventListener("keydown", startBgm);

      window.removeEventListener("nagani:lobby-bgm-duck", duckBgm);
      window.removeEventListener("nagani:lobby-bgm-restore", restoreBgm);

      audio.pause();
      audio.currentTime = 0;
    };
  }, [isMuted]);

  function handleToggleBgm() {
    const audio = audioRef.current;
    const nextMuted = !isMuted;

    setIsMuted(nextMuted);
    localStorage.setItem(BGM_MUTED_KEY, nextMuted ? "1" : "0");

    if (!audio) return;

    audio.muted = nextMuted;
    audio.volume = nextMuted ? 0 : NORMAL_VOLUME;

    if (nextMuted) {
      audio.pause();
      return;
    }

    void audio.play().catch(() => {});
  }

  return (
    <>
      <audio ref={audioRef} src={LOBBY_BGM_SRC} preload="auto" playsInline />

      <button
        type="button"
        onClick={handleToggleBgm}
        aria-label={isMuted ? "နောက်ခံတေးဂီတ ဖွင့်ရန်" : "နောက်ခံတေးဂီတ ပိတ်ရန်"}
        className="fixed right-5 top-[10.9rem] z-50 flex h-12 w-12 items-center justify-center rounded-full border border-[#ffd77a]/45 bg-[#120706]/72 text-[1.15rem] font-black text-[#ffd77a] shadow-[0_10px_24px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,243,208,0.18)] backdrop-blur-[3px] active:scale-[0.96]"
      >
        {isMuted ? "🔇" : "🔊"}
      </button>
    </>
  );
}