//src/components/nagani-v2/NaganiHomeWelcomeAnnouncement.tsx

"use client";

import { useEffect, useRef } from "react";

const WELCOME_SRC = "/assets/nagani/sounds/welcome.mp3";
const WELCOME_SESSION_KEY = "nagani-home-welcome-played-v4";

export default function NaganiHomeWelcomeAnnouncement() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.95;

    const restoreBgm = () => {
      window.dispatchEvent(new Event("nagani:lobby-bgm-restore"));
    };

    const playWelcome = () => {
      if (startedRef.current) return;
      if (sessionStorage.getItem(WELCOME_SESSION_KEY) === "1") return;

      startedRef.current = true;
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
    };

    audio.addEventListener("ended", restoreBgm);
    audio.addEventListener("pause", restoreBgm);

    window.addEventListener("pointerdown", playWelcome, {
      once: true,
      capture: true,
    });
    window.addEventListener("touchend", playWelcome, {
      once: true,
      capture: true,
    });
    window.addEventListener("click", playWelcome, {
      once: true,
      capture: true,
    });
    window.addEventListener("keydown", playWelcome, {
      once: true,
      capture: true,
    });

    return () => {
      audio.removeEventListener("ended", restoreBgm);
      audio.removeEventListener("pause", restoreBgm);

      window.removeEventListener("pointerdown", playWelcome, true);
      window.removeEventListener("touchend", playWelcome, true);
      window.removeEventListener("click", playWelcome, true);
      window.removeEventListener("keydown", playWelcome, true);

      audio.pause();
      audio.currentTime = 0;
      restoreBgm();
    };
  }, []);

  return <audio ref={audioRef} src={WELCOME_SRC} preload="auto" playsInline />;
}