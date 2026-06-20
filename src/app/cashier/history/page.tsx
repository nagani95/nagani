//src/app/cashier/history/page.tsx

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import CashierRecentTickets from "@/components/cashier/CashierRecentTickets";
import AppShell from "@/components/layout/AppShell";
import { createClient } from "@/lib/supabase/client";

type WalletRequestRow = {
  id: string;
  request_type: "deposit" | "withdraw";
  amount: number | string;
  status: "pending" | "approved" | "rejected" | "cancelled";
  created_at: string;
};

type CashierTicket = {
  id: string;
  type: string;
  amount: number;
  status: string;
  time: string;
};

const TEMP_PALACE_BACKGROUND =
  "/assets/nagani/six-animal/room/six-animal-palace-room-bg-v1.jpg";

function toSafeAmount(value: number | string | null | undefined) {
  const amount = Number(value ?? 0);

  return Number.isFinite(amount) ? amount : 0;
}

function formatTicketTime(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Yangon",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function formatRequestType(type: WalletRequestRow["request_type"]) {
  return type === "deposit" ? "ငွေသွင်း" : "ငွေထုတ်";
}

function formatRequestStatus(status: WalletRequestRow["status"]) {
  if (status === "pending") return "စောင့်ဆိုင်းနေသည်";
  if (status === "approved") return "အတည်ပြုပြီး";
  if (status === "rejected") return "ငြင်းပယ်ပြီး";
  if (status === "cancelled") return "ပယ်ဖျက်ပြီး";

  return status;
}

export default function CashierHistoryPage() {
  const router = useRouter();
  const [supabase] = useState(() => createClient());
  const [tickets, setTickets] = useState<CashierTicket[]>([]);

  useEffect(() => {
    let isMounted = true;

    async function fetchHistory() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      const { data: requests } = await supabase
        .from("wallet_requests")
        .select("id, request_type, amount, status, created_at")
        .eq("profile_id", user.id)
        .order("created_at", { ascending: false })
        .limit(50)
        .returns<WalletRequestRow[]>();

      if (!isMounted) return;

      setTickets(
        (requests ?? []).map((request) => ({
          id: `NG-WALLET-${request.id.slice(0, 8).toUpperCase()}`,
          type: formatRequestType(request.request_type),
          amount: toSafeAmount(request.amount),
          status: formatRequestStatus(request.status),
          time: formatTicketTime(request.created_at),
        }))
      );
    }

    void fetchHistory();

    return () => {
      isMounted = false;
    };
  }, [router, supabase]);

  return (
    <AppShell>
      <div className="pointer-events-none fixed inset-0 z-0 mx-auto w-full max-w-md overflow-hidden bg-[#090202]">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${TEMP_PALACE_BACKGROUND})` }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.62)_0%,rgba(0,0,0,0.34)_34%,rgba(0,0,0,0.88)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_8%,rgba(255,215,122,0.13),transparent_32%),radial-gradient(circle_at_50%_100%,rgba(86,13,6,0.7),transparent_50%)]" />
      </div>

      <div className="relative z-10 px-1 pb-32">
        <header className="flex items-center justify-between">
          <Link href="/cashier" className="text-sm font-bold text-[#ffd77a]">
            ပြန်သွားရန်
          </Link>

          <div className="rounded-full border border-[#d6a84f]/24 bg-[#d6a84f]/12 px-3 py-1.5 text-xs font-black text-[#ffd77a] shadow-lg shadow-black/35">
            ငွေလွှဲမှတ်တမ်း
          </div>
        </header>

        <section className="relative mt-3 overflow-hidden rounded-[1.6rem] border border-[#d6a84f]/34 bg-[linear-gradient(145deg,rgba(55,8,4,0.94),rgba(8,1,1,0.97),rgba(78,14,6,0.9))] p-4 shadow-xl shadow-black/55">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,215,122,0.16),transparent_38%)]" />

          <div className="relative">
            <p className="text-[11px] font-black tracking-[0.18em] text-[#f7dfaa]/52">
              WALLET HISTORY
            </p>
            <h1 className="mt-1 text-2xl font-black text-[#ffd77a]">
              ငွေသွင်း / ငွေထုတ် မှတ်တမ်း
            </h1>
            <p className="mt-1 text-xs font-semibold leading-5 text-[#fff3d0]/52">
              တင်ထားသော ငွေလွှဲတောင်းဆိုမှုများ၏ အခြေအနေကို ဤနေရာတွင်
              ကြည့်နိုင်ပါသည်။
            </p>
          </div>
        </section>

        <CashierRecentTickets tickets={tickets} />
      </div>
    </AppShell>
  );
}