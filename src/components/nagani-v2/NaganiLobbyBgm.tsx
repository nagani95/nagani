//src/components/nagani-v2/NaganiLobbyBgm.tsx

"use client";

import { useEffect, useRef } from "react";

const LOBBY_BGM_SRC = "/assets/nagani/sounds/lobby-palace-bgm-v1.mp3";
const WELCOME_SRC = "/sounds/welcome.mp3";
const WELCOME_SESSION_KEY = "nagani-home-welcome-played-v1";

export default function NaganiLobbyBgm() {
  const bgmRef = useRef<HTMLAudioElement | null>(null);
  const welcomeRef = useRef<HTMLAudioElement | null>(null);
  const welcomeStartedRef = useRef(false);

  useEffect(() => {
    const bgm = bgmRef.current;
    const welcome = welcomeRef.current;

    if (!bgm || !welcome) return;

    bgm.volume = 0.22;
    welcome.volume = 0.86;

    const restoreBgm = () => {
      bgm.volume = 0.22;
      sessionStorage.setItem(WELCOME_SESSION_KEY, "1");
    };

    const startSound = async () => {
      try {
        await bgm.play();
      } catch {
        return;
      }

      if (welcomeStartedRef.current) return;
      if (sessionStorage.getItem(WELCOME_SESSION_KEY) === "1") return;

      welcomeStartedRef.current = true;

      window.setTimeout(() => {
        bgm.volume = 0.1;
        welcome.currentTime = 0;

        void welcome.play().catch(() => {
          welcomeStartedRef.current = false;
          bgm.volume = 0.22;
        });
      }, 450);
    };

    welcome.addEventListener("ended", restoreBgm);

    window.addEventListener("pointerdown", startSound);
    window.addEventListener("touchend", startSound);
    window.addEventListener("click", startSound);
    window.addEventListener("keydown", startSound);

    void startSound();

    return () => {
      welcome.removeEventListener("ended", restoreBgm);

      window.removeEventListener("pointerdown", startSound);
      window.removeEventListener("touchend", startSound);
      window.removeEventListener("click", startSound);
      window.removeEventListener("keydown", startSound);

      bgm.pause();
      welcome.pause();

      bgm.currentTime = 0;
      welcome.currentTime = 0;
    };
  }, []);

  return (
    <>
      <audio ref={bgmRef} src={LOBBY_BGM_SRC} loop preload="auto" playsInline />
      <audio ref={welcomeRef} src={WELCOME_SRC} preload="auto" playsInline />
    </>
  );
}