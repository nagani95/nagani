//src/components/nagani-v2/NaganiHomeWelcomeAnnouncement.tsx

"use client";

import { useEffect, useRef } from "react";

const WELCOME_SRC = "/sounds/welcome.mp3";
const WELCOME_SESSION_KEY = "nagani-home-welcome-played-v1";

export default function NaganiHomeWelcomeAnnouncement() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const startedRef = useRef(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.9;

    const restoreBgm = () => {
      window.dispatchEvent(new Event("nagani:lobby-bgm-restore"));
    };

    const playWelcome = () => {
      if (startedRef.current) return;
      if (sessionStorage.getItem(WELCOME_SESSION_KEY) === "1") return;

      startedRef.current = true;

      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }

      timerRef.current = window.setTimeout(() => {
        audio.currentTime = 0;

        window.dispatchEvent(new Event("nagani:lobby-bgm-duck"));

        void audio
          .play()
          .then(() => {
            sessionStorage.setItem(WELCOME_SESSION_KEY, "1");
          })
          .catch(() => {
            startedRef.current = false;
            restoreBgm();
          });
      }, 650);
    };

    audio.addEventListener("ended", restoreBgm);
    audio.addEventListener("pause", restoreBgm);

    window.addEventListener("pointerdown", playWelcome);
    window.addEventListener("touchend", playWelcome);
    window.addEventListener("click", playWelcome);
    window.addEventListener("keydown", playWelcome);

    playWelcome();

    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }

      audio.removeEventListener("ended", restoreBgm);
      audio.removeEventListener("pause", restoreBgm);

      window.removeEventListener("pointerdown", playWelcome);
      window.removeEventListener("touchend", playWelcome);
      window.removeEventListener("click", playWelcome);
      window.removeEventListener("keydown", playWelcome);

      audio.pause();
      audio.currentTime = 0;
      restoreBgm();
    };
  }, []);

  return <audio ref={audioRef} src={WELCOME_SRC} preload="auto" playsInline />;
}