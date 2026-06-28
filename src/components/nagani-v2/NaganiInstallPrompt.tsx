//src/components/nagani-v2/NaganiInstallPrompt.tsx

// src/components/nagani-v2/NaganiInstallPrompt.tsx

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
};

const DISMISS_KEY = "nagani-install-prompt-dismissed-at";
const INSTALLED_KEY = "nagani-installed-pwa";
const DISMISS_HOURS = 12;

function isStandaloneMode() {
  if (typeof window === "undefined") return false;

  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    // iOS Safari standalone check
    ("standalone" in window.navigator &&
      Boolean((window.navigator as Navigator & { standalone?: boolean }).standalone))
  );
}

function recentlyDismissed() {
  if (typeof window === "undefined") return true;

  const value = window.localStorage.getItem(DISMISS_KEY);
  if (!value) return false;

  const dismissedAt = Number(value);
  if (!Number.isFinite(dismissedAt)) return false;

  const ageMs = Date.now() - dismissedAt;
  return ageMs < DISMISS_HOURS * 60 * 60 * 1000;
}

export default function NaganiInstallPrompt() {
  const [installEvent, setInstallEvent] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isStandaloneMode()) {
      window.localStorage.setItem(INSTALLED_KEY, "1");
      return;
    }

    if (window.localStorage.getItem(INSTALLED_KEY) === "1") return;
    if (recentlyDismissed()) return;

    function handleBeforeInstallPrompt(event: Event) {
      event.preventDefault();

      const nextInstallEvent = event as BeforeInstallPromptEvent;
      setInstallEvent(nextInstallEvent);
      setVisible(true);
    }

    function handleAppInstalled() {
      window.localStorage.setItem(INSTALLED_KEY, "1");
      setInstallEvent(null);
      setVisible(false);
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  if (!visible || !installEvent) return null;

  async function installNagani() {
    if (!installEvent) return;

    await installEvent.prompt();

    const choice = await installEvent.userChoice;

    if (choice.outcome === "accepted") {
      window.localStorage.setItem(INSTALLED_KEY, "1");
    } else {
      window.localStorage.setItem(DISMISS_KEY, String(Date.now()));
    }

    setInstallEvent(null);
    setVisible(false);
  }

  function dismiss() {
    window.localStorage.setItem(DISMISS_KEY, String(Date.now()));
    setVisible(false);
  }

  return (
    <div className="fixed inset-x-3 top-3 z-[80] mx-auto max-w-[430px] rounded-3xl border border-[#ffd77a]/45 bg-[#120302]/95 p-3 text-[#fff3d0] shadow-[0_18px_42px_rgba(0,0,0,0.65)] backdrop-blur-md">
      <div className="flex items-start gap-3">
        <div className="h-12 w-12 shrink-0 rounded-2xl bg-[url('/assets/nagani/shared/logo/nagani-logo-concept-v1.png')] bg-cover bg-center ring-1 ring-[#ffd77a]/40" />

        <div className="min-w-0 flex-1">
          <p className="text-sm font-black leading-5 text-[#ffd77a]">
            နဂါးနီရွှေအိုးကို ဖုန်းထဲသိမ်းထားပါ
          </p>

          <p className="mt-1 text-[0.72rem] font-semibold leading-5 text-[#fff3d0]/76">
            နောက်တစ်ကြိမ် App လို အလွယ်တကူ ဝင်နိုင်သည်။
          </p>

          <div className="mt-3 flex items-center gap-2">
            <button
              type="button"
              onClick={installNagani}
              className="rounded-full border border-[#ffd77a]/60 bg-[#8f1515] px-4 py-2 text-xs font-black text-[#fff3d0] active:scale-[0.98]"
            >
              ဖုန်းထဲသိမ်းမယ်
            </button>

            <Link
              href="/install"
              className="rounded-full border border-[#ffd77a]/28 px-3 py-2 text-xs font-black text-[#ffd77a]"
            >
              နည်းလမ်း
            </Link>
          </div>
        </div>

        <button
          type="button"
          onClick={dismiss}
          aria-label="ပိတ်ရန်"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#ffd77a]/25 text-sm font-black text-[#ffd77a]/80"
        >
          ×
        </button>
      </div>
    </div>
  );
}