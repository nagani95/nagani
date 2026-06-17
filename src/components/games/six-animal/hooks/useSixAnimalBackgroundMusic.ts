//src/components/games/six-animal/hooks/useSixAnimalBackgroundMusic.ts

"use client";

import type { MutableRefObject } from "react";
import { useEffect, useRef, useState } from "react";

import {
  ROOM_BACKGROUND_MUSIC_FADE_MS,
  ROOM_BACKGROUND_MUSIC_FADE_STEP_MS,
  ROOM_BACKGROUND_MUSIC_MUTED_STORAGE_KEY,
  ROOM_BACKGROUND_MUSIC_SRC,
  ROOM_BACKGROUND_MUSIC_VOLUME,
  ROOM_SOUND_ENABLED,
} from "@/components/games/six-animal/sixAnimalRoomHelpers";

type UseSixAnimalBackgroundMusicProps = {
  isRoomAudioUnlockedRef: MutableRefObject<boolean>;
};

export function useSixAnimalBackgroundMusic({
  isRoomAudioUnlockedRef,
}: UseSixAnimalBackgroundMusicProps) {
  const [isBackgroundMusicMuted, setIsBackgroundMusicMuted] = useState(false);

  const backgroundMusicAudioRef = useRef<HTMLAudioElement | null>(null);
  const backgroundMusicFadeTimerRef = useRef<number | null>(null);

  function getBackgroundMusicAudio() {
    if (backgroundMusicAudioRef.current) {
      return backgroundMusicAudioRef.current;
    }

    const audio = new Audio(ROOM_BACKGROUND_MUSIC_SRC);
    audio.preload = "auto";
    audio.loop = true;
    audio.volume = ROOM_BACKGROUND_MUSIC_VOLUME;

    backgroundMusicAudioRef.current = audio;

    return audio;
  }

  function clearBackgroundMusicFadeTimer() {
    if (!backgroundMusicFadeTimerRef.current) return;

    window.clearInterval(backgroundMusicFadeTimerRef.current);
    backgroundMusicFadeTimerRef.current = null;
  }

  function fadeBackgroundMusicTo(targetVolume: number, pauseWhenDone = false) {
    const audio = getBackgroundMusicAudio();

    clearBackgroundMusicFadeTimer();

    const startVolume = audio.volume;
    const startedAt = Date.now();

    backgroundMusicFadeTimerRef.current = window.setInterval(() => {
      const progress = Math.min(
        1,
        (Date.now() - startedAt) / ROOM_BACKGROUND_MUSIC_FADE_MS
      );

      audio.volume = startVolume + (targetVolume - startVolume) * progress;

      if (progress < 1) return;

      clearBackgroundMusicFadeTimer();
      audio.volume = targetVolume;

      if (pauseWhenDone) {
        audio.pause();
      }
    }, ROOM_BACKGROUND_MUSIC_FADE_STEP_MS);
  }

  function syncBackgroundMusic() {
    if (!ROOM_SOUND_ENABLED) return;

    const audio = getBackgroundMusicAudio();

    if (!isRoomAudioUnlockedRef.current || isBackgroundMusicMuted) {
      fadeBackgroundMusicTo(0, true);
      return;
    }

    try {
      if (audio.paused) {
        audio.volume = 0;

        void audio
          .play()
          .then(() => {
            fadeBackgroundMusicTo(ROOM_BACKGROUND_MUSIC_VOLUME);
          })
          .catch(() => {
            // Browser may still block if user has not interacted.
          });

        return;
      }

      fadeBackgroundMusicTo(ROOM_BACKGROUND_MUSIC_VOLUME);
    } catch {
      // Background music must never affect game flow.
    }
  }

  function handleBackgroundMusicToggle() {
    setIsBackgroundMusicMuted((currentValue) => {
      const nextValue = !currentValue;

      try {
        window.localStorage.setItem(
          ROOM_BACKGROUND_MUSIC_MUTED_STORAGE_KEY,
          String(nextValue)
        );
      } catch {
        // Keep preference saving non-blocking.
      }

      return nextValue;
    });
  }

  useEffect(() => {
    syncBackgroundMusic();
  }, [isBackgroundMusicMuted]);

  useEffect(() => {
    try {
      const storedValue = window.localStorage.getItem(
        ROOM_BACKGROUND_MUSIC_MUTED_STORAGE_KEY
      );

      if (storedValue === "true") {
        setIsBackgroundMusicMuted(true);
      }
    } catch {
      // Keep preference loading non-blocking.
    }
  }, []);

  useEffect(() => {
    return () => {
      clearBackgroundMusicFadeTimer();

      if (backgroundMusicAudioRef.current) {
        backgroundMusicAudioRef.current.pause();
        backgroundMusicAudioRef.current = null;
      }
    };
  }, []);

  return {
    isBackgroundMusicMuted,
    handleBackgroundMusicToggle,
    syncBackgroundMusic,
  };
}