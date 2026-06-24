//src/components/admin/wallet-requests/AdminWalletRequestsAutoRefresh.tsx

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const REFRESH_MS = 6000;

export default function AdminWalletRequestsAutoRefresh() {
  const router = useRouter();

  useEffect(() => {
    const timer = window.setInterval(() => {
      if (document.visibilityState !== "visible") return;

      router.refresh();
    }, REFRESH_MS);

    return () => window.clearInterval(timer);
  }, [router]);

  return null;
}