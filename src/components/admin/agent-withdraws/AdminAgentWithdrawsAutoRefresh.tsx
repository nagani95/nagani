//src/components/admin/agent-withdraws/AdminAgentWithdrawsAutoRefresh.tsx

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const REFRESH_MS = 5000;

export default function AdminAgentWithdrawsAutoRefresh() {
  const router = useRouter();

  useEffect(() => {
    const timer = window.setInterval(() => {
      if (document.visibilityState !== "visible") return;

      const activeElement = document.activeElement;
      const activeTag =
        activeElement instanceof HTMLElement
          ? activeElement.tagName.toLowerCase()
          : "";

      if (
        activeTag === "input" ||
        activeTag === "textarea" ||
        activeTag === "select"
      ) {
        return;
      }

      if (document.querySelector("details[open]")) return;

      router.refresh();
    }, REFRESH_MS);

    return () => window.clearInterval(timer);
  }, [router]);

  return null;
}