//src/components/nagani-v2/NaganiButtonClickSound.tsx

"use client";

import { useEffect, useRef } from "react";

const DEFAULT_BUTTON_SOUND =
  "/assets/nagani/sounds/lobby/button/defaultbutton.mp3";

type NaganiButtonClickSoundProps = {
  rootSelector?: string;
};

export default function NaganiButtonClickSound({
  rootSelector = "[data-nagani-button-sound-root]",
}: NaganiButtonClickSoundProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio(DEFAULT_BUTTON_SOUND);
    audioRef.current.preload = "auto";
    audioRef.current.volume = 0.72;

    function playButtonSound(event: PointerEvent) {
      const target = event.target as HTMLElement | null;
      if (!target) return;

      const root = target.closest(rootSelector);
      if (!root) return;

      const clickable = target.closest(
        "button, a, [data-nagani-button-sound]"
      );

      if (!clickable) return;

      const audio = audioRef.current;
      if (!audio) return;

      audio.currentTime = 0;
      void audio.play().catch(() => {
        // Browser may block until first user gesture. Safe to ignore.
      });
    }

    document.addEventListener("pointerdown", playButtonSound, {
      capture: true,
    });

    return () => {
      document.removeEventListener("pointerdown", playButtonSound, {
        capture: true,
      });
    };
  }, [rootSelector]);

  return null;
}