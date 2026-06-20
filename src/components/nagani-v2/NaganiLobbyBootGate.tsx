//src/components/nagani-v2/NaganiLobbyBootGate.tsx

"use client";

import { useEffect, useState, type ReactNode } from "react";

type NaganiLobbyBootGateProps = {
  children: ReactNode;
};

const MIN_LOADING_MS = 900;
const MAX_WAIT_MS = 5000;

function wait(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function waitForWindowLoad() {
  if (document.readyState === "complete") {
    return Promise.resolve();
  }

  return new Promise<void>((resolve) => {
    window.addEventListener("load", () => resolve(), { once: true });
  });
}

function waitForFonts() {
  if (!document.fonts) {
    return Promise.resolve();
  }

  return document.fonts.ready.then(() => undefined).catch(() => undefined);
}

function waitForVideo(video: HTMLVideoElement) {
  if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
    return Promise.resolve();
  }

  return new Promise<void>((resolve) => {
    let finished = false;

    function finish() {
      if (finished) return;
      finished = true;
      cleanup();
      resolve();
    }

    function cleanup() {
      video.removeEventListener("loadeddata", finish);
      video.removeEventListener("canplay", finish);
      video.removeEventListener("error", finish);
    }

    video.addEventListener("loadeddata", finish, { once: true });
    video.addEventListener("canplay", finish, { once: true });
    video.addEventListener("error", finish, { once: true });
  });
}

async function waitForLobbyVideos() {
  await new Promise<void>((resolve) => {
    requestAnimationFrame(() => resolve());
  });

  const videos = Array.from(document.querySelectorAll("video"));

  if (!videos.length) return;

  await Promise.race([
    Promise.all(videos.map(waitForVideo)).then(() => undefined),
    wait(3200),
  ]);
}

export default function NaganiLobbyBootGate({
  children,
}: NaganiLobbyBootGateProps) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function bootLobby() {
      const startedAt = performance.now();

      await Promise.race([
        Promise.all([
          waitForWindowLoad(),
          waitForFonts(),
          waitForLobbyVideos(),
        ]).then(() => undefined),
        wait(MAX_WAIT_MS),
      ]);

      const elapsed = performance.now() - startedAt;
      const remaining = Math.max(0, MIN_LOADING_MS - elapsed);

      if (remaining > 0) {
        await wait(remaining);
      }

      if (!cancelled) {
        setReady(true);
      }
    }

    bootLobby();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="relative min-h-svh bg-[#070101]">
      <div
        className={[
          "min-h-svh transition-opacity duration-500",
          ready ? "opacity-100" : "pointer-events-none opacity-0",
        ].join(" ")}
        aria-hidden={!ready}
      >
        {children}
      </div>

      {!ready ? (
        <div className="fixed inset-0 z-[9999] flex min-h-svh items-center justify-center overflow-hidden bg-[#070101] px-6 text-center text-amber-50">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_24%,rgba(245,190,86,0.22),transparent_34%),linear-gradient(180deg,rgba(52,5,4,0.98),rgba(8,1,1,1)_62%,rgba(0,0,0,1))]" />
          <div className="pointer-events-none absolute inset-x-8 top-10 h-px bg-gradient-to-r from-transparent via-amber-300/55 to-transparent" />
          <div className="pointer-events-none absolute inset-x-8 bottom-10 h-px bg-gradient-to-r from-transparent via-amber-300/35 to-transparent" />

          <div className="relative z-10 flex w-full max-w-[300px] flex-col items-center">
            <div className="mb-5 flex size-20 items-center justify-center rounded-full border border-amber-300/35 bg-[radial-gradient(circle,rgba(251,210,124,0.22),rgba(90,16,8,0.92)_62%,rgba(18,2,2,0.96))] shadow-[0_0_44px_rgba(245,178,62,0.22)]">
              <div className="size-10 rounded-full border border-amber-200/55 bg-[radial-gradient(circle,rgba(255,232,164,0.85),rgba(162,91,28,0.72)_54%,rgba(58,8,4,0.92))] animate-pulse" />
            </div>

            <p className="text-[1.05rem] font-semibold tracking-[0.08em] text-amber-100">
              မင်းခန်းတော် ဖွင့်နေသည်
            </p>

            <p className="mt-2 text-xs font-medium tracking-[0.12em] text-amber-200/65">
              ခေတ္တစောင့်ပါ
            </p>

            <div className="mt-6 h-1.5 w-40 overflow-hidden rounded-full border border-amber-300/20 bg-black/45">
              <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-transparent via-amber-200/80 to-transparent animate-pulse" />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}