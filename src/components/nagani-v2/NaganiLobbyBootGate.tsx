//src/components/nagani-v2/NaganiLobbyBootGate.tsx

"use client";

import { useEffect, useState, type ReactNode } from "react";

type NaganiLobbyBootGateProps = {
  children: ReactNode;
};

const LOADING_BACKGROUND_SRC = "/assets/nagani/shared/backgrounds/loading.jpg";
const LOADING_LOGO_SRC = "/assets/nagani/shared/logo/nagani-logo-concept-v1.png";

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

<div className="relative z-10 mt-[16vh] w-full max-w-[350px] overflow-hidden rounded-[2rem] border border-[#c8922f]/38 bg-[linear-gradient(180deg,rgba(38,12,7,0.9),rgba(13,4,3,0.96))] px-7 py-8 shadow-[0_30px_90px_rgba(0,0,0,0.88)] backdrop-blur-[8px]">
  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,215,122,0.18),transparent_58%)]" />
  <div className="pointer-events-none absolute inset-[1px] rounded-[calc(2rem-1px)] border border-[#fff3d0]/8" />
  <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-[#fff3d0]/75 to-transparent" />
  <div className="pointer-events-none absolute inset-x-12 bottom-0 h-px bg-gradient-to-r from-transparent via-[#c8922f]/48 to-transparent" />

  <div className="relative z-10 flex flex-col items-center">
    <img
      src={LOADING_LOGO_SRC}
      alt=""
      aria-hidden="true"
      className="h-auto w-[11.4rem] object-contain drop-shadow-[0_10px_22px_rgba(0,0,0,0.72)]"
      draggable={false}
    />

    <p className="mt-4 text-[1.42rem] font-black leading-none tracking-[0.01em] text-[#ffd77a] drop-shadow-[0_2px_8px_rgba(0,0,0,0.86)]">
      နဂါးနီရွှေအိုး ဖွင့်နေသည်
    </p>

    <p className="mt-3 text-[0.95rem] font-semibold leading-6 text-[#fff3d0]/78">
      ခေတ္တစောင့်ပါ။ တော်ဝင်ခန်းမကို ပြင်ဆင်နေပါသည်
    </p>

    <div className="mt-6 w-full overflow-hidden rounded-full border border-[#a66d20]/55 bg-[rgba(0,0,0,0.68)] p-[3px] shadow-[inset_0_1px_4px_rgba(255,215,122,0.06)]">
      <div className="relative h-[0.7rem] overflow-hidden rounded-full bg-[linear-gradient(180deg,rgba(255,243,208,0.04),rgba(0,0,0,0.24))]">
        <div className="absolute inset-y-[1px] left-0 w-[38%] animate-[naganiLobbyBootLoading_1.5s_ease-in-out_infinite] rounded-full bg-[linear-gradient(90deg,#6f4712_0%,#b67a20_24%,#f0c35d_52%,#fff0b8_72%,#d9a33d_100%)] shadow-[0_0_14px_rgba(255,215,122,0.42)]" />
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