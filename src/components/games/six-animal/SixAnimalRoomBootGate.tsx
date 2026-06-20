//src/components/games/six-animal/SixAnimalRoomBootGate.tsx

"use client";

import { useEffect, useState, type ReactNode } from "react";

type SixAnimalRoomBootGateProps = {
  children: ReactNode;
  backgroundSrc: string;
  logoSrc: string;
};

const MIN_LOADING_MS = 950;
const MAX_WAIT_MS = 5200;

function wait(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function waitForFonts() {
  if (!document.fonts) return Promise.resolve();

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

function waitForRoomVideo() {
  return new Promise<void>((resolve) => {
    requestAnimationFrame(() => {
      const video = document.querySelector<HTMLVideoElement>(
        "[data-nagani-room-video='true']"
      );

      if (!video) {
        resolve();
        return;
      }

      if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
        resolve();
        return;
      }

      let finished = false;

      function finish() {
        if (finished) return;
        finished = true;
        cleanup();
        resolve();
      }

      function cleanup() {
        video?.removeEventListener("loadeddata", finish);
        video?.removeEventListener("canplay", finish);
        video?.removeEventListener("error", finish);
      }

      video.addEventListener("loadeddata", finish, { once: true });
      video.addEventListener("canplay", finish, { once: true });
      video.addEventListener("error", finish, { once: true });

      video.load();
    });
  });
}

export default function SixAnimalRoomBootGate({
  children,
  backgroundSrc,
  logoSrc,
}: SixAnimalRoomBootGateProps) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function bootRoom() {
      const startedAt = performance.now();

      await Promise.race([
        Promise.all([
          waitForFonts(),
          waitForImage(backgroundSrc),
          waitForImage(logoSrc),
          waitForRoomVideo(),
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

    bootRoom();

    return () => {
      cancelled = true;
    };
  }, [backgroundSrc, logoSrc]);

  return (
    <div className="relative min-h-[100dvh] bg-[#090202]">
      <div
        className={[
          "min-h-[100dvh] transition-opacity duration-500",
          ready ? "opacity-100" : "pointer-events-none opacity-0",
        ].join(" ")}
        aria-hidden={!ready}
      >
        {children}
      </div>

      {!ready ? (
        <div className="fixed inset-0 z-[9999] flex min-h-[100dvh] items-center justify-center overflow-hidden bg-[#090202] px-6 text-center text-[#fff3d0]">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${backgroundSrc})` }}
          />

          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(9,2,2,0.52),rgba(9,2,2,0.72),rgba(0,0,0,0.96))]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_32%,rgba(255,215,122,0.18)_0%,transparent_38%,rgba(0,0,0,0.72)_100%)]" />

          <div className="relative z-10 w-full max-w-[300px] overflow-hidden rounded-[1.7rem] border border-[#d6a84f]/24 bg-[#090202]/68 px-6 py-7 shadow-2xl shadow-black/80 backdrop-blur-[8px]">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,215,122,0.17),transparent_68%)]" />
            <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-[#ffd77a]/75 to-transparent" />

            <div className="relative z-10">
              <img
                src={logoSrc}
                alt=""
                aria-hidden="true"
                className="mx-auto h-20 w-20 object-contain drop-shadow-[0_0_22px_rgba(255,215,122,0.28)]"
                draggable={false}
              />

              <h2 className="mt-4 text-lg font-black text-[#ffd77a]">
                ပွဲခန်းမ ဖွင့်နေသည်
              </h2>

              <p className="mt-2 text-sm font-semibold leading-6 text-[#fff3d0]/68">
                တော်ဝင်အန်စာခန်း ပြင်ဆင်နေပါသည်
              </p>

              <div className="mt-5 overflow-hidden rounded-full border border-[#d6a84f]/16 bg-black/45 p-[2px] shadow-inner shadow-black/60">
                <div className="relative h-2.5 overflow-hidden rounded-full bg-[#fff3d0]/10">
                  <div className="absolute inset-y-0 left-0 w-[42%] animate-[naganiRoomBootLoading_1.35s_ease-in-out_infinite] rounded-full bg-[linear-gradient(90deg,transparent,#8f6422,#d6a84f,#ffd77a,#fff3d0,#d6a84f,transparent)] shadow-[0_0_16px_rgba(255,215,122,0.34)]" />
                </div>
              </div>
            </div>
          </div>

          <style jsx>{`
            @keyframes naganiRoomBootLoading {
              0% {
                transform: translateX(-120%);
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