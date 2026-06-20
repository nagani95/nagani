//src/components/nagani-v2/NaganiLobbyBootGate.tsx

"use client";

import { useEffect, useState, type ReactNode } from "react";

type NaganiLobbyBootGateProps = {
  children: ReactNode;
};

const LOADING_BACKGROUND_SRC = "/assets/nagani/shared/backgrounds/loading.jpg";

const MIN_LOADING_MS = 1100;
const MAX_WAIT_MS = 5200;

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

function waitForImage(src: string) {
  return new Promise<void>((resolve) => {
    const image = new Image();

    image.onload = () => resolve();
    image.onerror = () => resolve();
    image.src = src;

    if (image.complete) {
      resolve();
    }
  });
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
    wait(3400),
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
          waitForImage(LOADING_BACKGROUND_SRC),
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
          "min-h-svh transition-opacity duration-700",
          ready ? "opacity-100" : "pointer-events-none opacity-0",
        ].join(" ")}
        aria-hidden={!ready}
      >
        {children}
      </div>

      {!ready ? (
        <div className="fixed inset-0 z-[9999] flex min-h-svh items-center justify-center overflow-hidden bg-[#070101] px-6 text-center text-[#fff3d0]">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${LOADING_BACKGROUND_SRC})` }}
          />

          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.12),rgba(9,2,2,0.24)_42%,rgba(0,0,0,0.72)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,rgba(255,215,122,0.06)_0%,transparent_42%,rgba(0,0,0,0.36)_100%)]" />

          <div className="pointer-events-none absolute inset-x-8 top-[calc(1.05rem+env(safe-area-inset-top))] h-px bg-gradient-to-r from-transparent via-[#ffd77a]/55 to-transparent" />
          <div className="pointer-events-none absolute inset-x-10 bottom-[calc(1.1rem+env(safe-area-inset-bottom))] h-px bg-gradient-to-r from-transparent via-[#d6a84f]/40 to-transparent" />

          <div className="relative z-10 mt-[18vh] w-full max-w-[292px] overflow-hidden rounded-[1.65rem] border border-[#d6a84f]/28 bg-[#090202]/38 px-6 py-6 shadow-[0_22px_70px_rgba(0,0,0,0.82)] backdrop-blur-[4px]">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,215,122,0.14),transparent_62%)]" />
            <div className="pointer-events-none absolute inset-x-9 top-0 h-px bg-gradient-to-r from-transparent via-[#fff3d0]/75 to-transparent" />

            <div className="relative z-10">
              <div className="mx-auto flex size-16 items-center justify-center rounded-full border border-[#ffd77a]/34 bg-[#120303]/56 shadow-[0_0_34px_rgba(255,215,122,0.2)]">
                <div className="size-8 rounded-full border border-[#fff3d0]/55 bg-[radial-gradient(circle,rgba(255,243,208,0.92),rgba(214,168,79,0.72)_48%,rgba(72,10,5,0.92)_100%)] shadow-[0_0_18px_rgba(255,215,122,0.34)] animate-pulse" />
              </div>

              <p className="mt-4 text-[1.02rem] font-black tracking-[0.08em] text-[#ffd77a] drop-shadow-[0_2px_7px_rgba(0,0,0,0.85)]">
                ရွှေအိုး ဖွင့်နေသည်
              </p>

              <p className="mt-2 text-xs font-semibold tracking-[0.14em] text-[#fff3d0]/68">
                ခေတ္တစောင့်ပါ
              </p>

              <div className="mt-5 overflow-hidden rounded-full border border-[#d6a84f]/18 bg-black/48 p-[2px] shadow-inner shadow-black/70">
                <div className="relative h-2 overflow-hidden rounded-full bg-[#fff3d0]/10">
                  <div className="absolute inset-y-0 left-0 w-[44%] animate-[naganiLobbyBootLoading_1.35s_ease-in-out_infinite] rounded-full bg-[linear-gradient(90deg,transparent,#8f6422,#d6a84f,#ffd77a,#fff3d0,#d6a84f,transparent)] shadow-[0_0_16px_rgba(255,215,122,0.36)]" />
                </div>
              </div>
            </div>
          </div>

          <style jsx>{`
            @keyframes naganiLobbyBootLoading {
              0% {
                transform: translateX(-125%);
              }

              100% {
                transform: translateX(260%);
              }
            }
          `}</style>
        </div>
      ) : null}
    </div>
  );
}