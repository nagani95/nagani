// src/app/cashier/page.tsx

"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";

import CashierHero from "@/components/cashier/CashierHero";
import CashierRecentTickets from "@/components/cashier/CashierRecentTickets";
import CashierRequestForm from "@/components/cashier/CashierRequestForm";
import AppShell from "@/components/layout/AppShell";
import { createClient } from "@/lib/supabase/client";

type CashierTab = "deposit" | "withdraw";

type WalletRequestRow = {
  id: string;
  request_type: "deposit" | "withdraw";
  amount: number | string;
  status: "pending" | "approved" | "rejected" | "cancelled";
  created_at: string;
};

type WalletAddressRow = {
  provider_name: string;
  account_name: string;
  account_number: string;
  qr_asset_path: string;
  minimum_deposit: number | string;
  minimum_withdraw: number | string;
  admin_note: string;
  is_active: boolean;
};

type CashierTicket = {
  id: string;
  type: string;
  amount: number;
  status: string;
  time: string;
};

const DEFAULT_MINIMUM_AMOUNT = 3000;
const TEMP_PALACE_BACKGROUND =
  "/assets/nagani/six-animal/room/six-animal-palace-room-bg-v1.jpg";

function toSafeAmount(value: number | string | null | undefined) {
  const amount = Number(value ?? 0);

  return Number.isFinite(amount) ? amount : 0;
}

function formatMMK(amount: number) {
  return new Intl.NumberFormat("en-US").format(amount);
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

function CashierPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const successMessage = searchParams.get("message");
  const errorMessage = searchParams.get("error");

  const [supabase] = useState(() => createClient());
  const [walletBalance, setWalletBalance] = useState(0);
  const [walletAddress, setWalletAddress] = useState<WalletAddressRow | null>(
    null
  );
  const [recentTickets, setRecentTickets] = useState<CashierTicket[]>([]);
  const [copyStatus, setCopyStatus] = useState("");

  const [activeTab, setActiveTab] = useState<CashierTab>("deposit");
  const [amount, setAmount] = useState("10000");
  const [note, setNote] = useState("");

  const minimumDeposit = walletAddress
    ? toSafeAmount(walletAddress.minimum_deposit)
    : DEFAULT_MINIMUM_AMOUNT;
  const minimumWithdraw = walletAddress
    ? toSafeAmount(walletAddress.minimum_withdraw)
    : DEFAULT_MINIMUM_AMOUNT;

  const minimumAmount =
    activeTab === "deposit" ? minimumDeposit : minimumWithdraw;

  const numericAmount = toSafeAmount(amount);
  const isDepositAvailable = Boolean(walletAddress?.is_active);
  const isValidAmount =
    numericAmount >= minimumAmount &&
    (activeTab === "withdraw" || isDepositAvailable);

  const actionLabel = useMemo(() => {
    return activeTab === "deposit" ? "ငွေသွင်း တင်မည်" : "ငွေထုတ် တင်မည်";
  }, [activeTab]);

  const notePlaceholder =
    activeTab === "deposit"
      ? "လွှဲပြေစာနောက်ဆုံးနံပါတ် 6လုံး ထည့်ပါ"
      : "ငွေထုတ်မည့် ဖုန်းနံပါတ် / အကောင့်အမည် ထည့်ပါ";

  useEffect(() => {
    let isMounted = true;

    async function fetchCashierData() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      const { data: wallet } = await supabase
        .from("wallets")
        .select("balance")
        .eq("profile_id", user.id)
        .maybeSingle<{ balance: number | string | null }>();

      const { data: address } = await supabase
        .from("wallet_addresses")
        .select(
          "provider_name, account_name, account_number, qr_asset_path, minimum_deposit, minimum_withdraw, admin_note, is_active"
        )
        .eq("id", "main")
        .eq("is_active", true)
        .maybeSingle<WalletAddressRow>();

      const { data: requests } = await supabase
        .from("wallet_requests")
        .select("id, request_type, amount, status, created_at")
        .eq("profile_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10)
        .returns<WalletRequestRow[]>();

      if (!isMounted) return;

      setWalletBalance(toSafeAmount(wallet?.balance));
      setWalletAddress(address ?? null);

      setRecentTickets(
        (requests ?? []).map((request) => ({
          id: `NG-WALLET-${request.id.slice(0, 8).toUpperCase()}`,
          type: formatRequestType(request.request_type),
          amount: toSafeAmount(request.amount),
          status: formatRequestStatus(request.status),
          time: formatTicketTime(request.created_at),
        }))
      );
    }

    void fetchCashierData();

    return () => {
      isMounted = false;
    };
  }, [router, supabase, successMessage]);

  function handleTabChange(tab: CashierTab) {
    setActiveTab(tab);
    setCopyStatus("");
    setNote("");
  }

  function handleAmountChange(value: string) {
    setAmount(value);
  }

  function handleNoteChange(value: string) {
    setNote(value);
  }

  async function handleCopyAccountNumber() {
    if (!walletAddress?.account_number) return;

    try {
      await navigator.clipboard.writeText(walletAddress.account_number);
      setCopyStatus("ကူးယူပြီးပါပြီ");
    } catch {
      setCopyStatus("ကူးယူ၍ မရပါ");
    }
  }

  async function handleSubmitRequest() {
    if (!isValidAmount) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.replace("/login");
      return;
    }

    const cleanNote = note.trim();

    const { error } = await supabase.from("wallet_requests").insert({
      profile_id: user.id,
      request_type: activeTab,
      amount: numericAmount,
      note: cleanNote || null,
      status: "pending",
    });

    if (error) {
      console.error("Wallet request submit error:", error.message);
      router.replace("/cashier?error=1");
      return;
    }

    setAmount("10000");
    setNote("");
    router.replace("/cashier?message=1");
  }

  return (
    <AppShell>
<div className="pointer-events-none fixed inset-0 z-0 mx-auto w-full max-w-md overflow-hidden bg-[#090202]">
  <div
    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
    style={{ backgroundImage: `url(${TEMP_PALACE_BACKGROUND})` }}
  />
  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.54)_0%,rgba(0,0,0,0.22)_34%,rgba(0,0,0,0.78)_100%)]" />
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_8%,rgba(255,215,122,0.13),transparent_32%),radial-gradient(circle_at_50%_100%,rgba(86,13,6,0.64),transparent_50%)]" />
</div>

      <div className="relative z-10 px-1 pb-44">
        <header className="flex items-center justify-between">
          <Link href="/" className="text-sm font-bold text-[#ffd77a]">
            မူလသို့
          </Link>

          <div className="rounded-full border border-[#d6a84f]/20 bg-[#d6a84f]/10 px-3 py-1 text-xs font-bold text-[#ffd77a]">
            ပိုက်ဆံအိတ်
          </div>
        </header>

        <CashierHero balanceLabel={`${formatMMK(walletBalance)} ကျပ်`} />

        {successMessage ? (
          <div className="mt-4 rounded-[1.25rem] border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm font-bold text-emerald-100">
            တင်သွင်းမှု အောင်မြင်ပါသည်။
          </div>
        ) : null}

        {errorMessage ? (
          <div className="mt-4 rounded-[1.25rem] border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm font-bold text-red-100">
            တင်သွင်းမှု မအောင်မြင်ပါ။ ပြန်စစ်ပါ။
          </div>
        ) : null}

        <section className="mt-4 overflow-hidden rounded-[1.85rem] border border-[#d6a84f]/42 bg-[linear-gradient(145deg,rgba(58,10,5,0.97),rgba(10,2,2,0.99),rgba(70,13,6,0.96))] shadow-[0_26px_80px_rgba(0,0,0,0.82),inset_0_1px_0_rgba(255,215,122,0.16)]">
          <div className="border-b border-[#d6a84f]/18 bg-[#d6a84f]/8 px-5 py-4">
            <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[#ffd77a]/50">
              ငွေသွင်းရန်
            </p>
            <h2 className="mt-1 text-xl font-black text-[#fff1c2]">
              ငွေလွှဲရန် အကောင့်
            </h2>
            <p className="mt-1 text-xs font-semibold leading-5 text-[#fff1c2]/48">
              ငွေလွှဲပြီးပါက အောက်ပါဖောင်တွင် လွှဲပြေစာနောက်ဆုံးနံပါတ် 6လုံး
              ထည့်ပြီး တင်ပါ။
            </p>
          </div>

          {walletAddress ? (
            <div className="grid gap-4 p-5">
              <div className="mx-auto w-full max-w-[260px] rounded-[1.5rem] border border-[#d6a84f]/20 bg-white p-3 shadow-xl shadow-black/30">
                <Image
                  src={walletAddress.qr_asset_path}
                  alt="ငွေသွင်းရန် QR"
                  width={260}
                  height={260}
                  className="h-auto w-full rounded-[1rem]"
                  priority
                />
              </div>

              <div className="grid gap-3">
                <div className="rounded-[1.25rem] border border-[#d6a84f]/20 bg-black/55 p-4">
                  <p className="text-xs font-bold text-[#fff1c2]/38">
                    ဝန်ဆောင်မှု
                  </p>
                  <p className="mt-1 text-lg font-black text-[#ffd77a]">
                    {walletAddress.provider_name}
                  </p>
                </div>

                <div className="rounded-[1.25rem] border border-[#d6a84f]/20 bg-black/55 p-4">
                  <p className="text-xs font-bold text-[#fff1c2]/38">
                    အကောင့်အမည်
                  </p>
                  <p className="mt-1 text-lg font-black text-[#fff1c2]">
                    {walletAddress.account_name}
                  </p>
                </div>

                <div className="rounded-[1.25rem] border border-emerald-300/22 bg-emerald-400/14 p-4 shadow-inner shadow-black/35">
                  <p className="text-xs font-bold text-emerald-100/55">
                    ဖုန်း / အကောင့်နံပါတ်
                  </p>

                  <div className="mt-2 flex items-center justify-between gap-3">
                    <p className="text-xl font-black text-emerald-100">
                      {walletAddress.account_number}
                    </p>

                    <button
                      type="button"
                      onClick={handleCopyAccountNumber}
                      className="shrink-0 rounded-full border border-emerald-300/25 bg-emerald-300/15 px-4 py-2 text-xs font-black text-emerald-100 active:scale-[0.98]"
                    >
                      ကူးရန်
                    </button>
                  </div>

                  {copyStatus ? (
                    <p className="mt-2 text-xs font-bold text-emerald-100/70">
                      {copyStatus}
                    </p>
                  ) : null}
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[1.25rem] border border-[#d6a84f]/12 bg-black/30 p-4">
                    <p className="text-xs font-bold text-[#fff1c2]/38">
                      အနည်းဆုံး ငွေသွင်း
                    </p>
                    <p className="mt-1 text-lg font-black text-[#ffd77a]">
                      {formatMMK(minimumDeposit)} ကျပ်
                    </p>
                  </div>

                  <div className="rounded-[1.25rem] border border-[#d6a84f]/12 bg-black/30 p-4">
                    <p className="text-xs font-bold text-[#fff1c2]/38">
                      အနည်းဆုံး ငွေထုတ်
                    </p>
                    <p className="mt-1 text-lg font-black text-[#ffd77a]">
                      {formatMMK(minimumWithdraw)} ကျပ်
                    </p>
                  </div>
                </div>

                <div className="rounded-[1.25rem] border border-[#d6a84f]/24 bg-[#d6a84f]/12 p-4 shadow-inner shadow-black/30">
                  <p className="text-xs font-bold text-[#ffd77a]/60">
                    မှတ်ချက်
                  </p>
                  <p className="mt-1 text-sm font-bold leading-6 text-[#fff1c2]/72">
                    {walletAddress.admin_note}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-5">
              <div className="rounded-[1.25rem] border border-red-300/20 bg-red-500/10 p-4">
                <p className="text-sm font-black text-red-100">
                  ငွေသွင်းအကောင့် မရရှိသေးပါ
                </p>
                <p className="mt-1 text-xs font-semibold leading-5 text-red-100/65">
                  ခဏစောင့်ပြီး ပြန်လည်စစ်ဆေးပါ သို့မဟုတ် Support ကို
                  ဆက်သွယ်ပါ။
                </p>
              </div>
            </div>
          )}
        </section>

        <div className="mt-4 rounded-[1.75rem] border border-[#d6a84f]/35 bg-[linear-gradient(180deg,rgba(14,3,2,0.97),rgba(34,6,3,0.96))] p-3 shadow-xl shadow-black/60">
          <div className="mb-3 rounded-[1.25rem] border border-[#d6a84f]/18 bg-[#d6a84f]/10 px-4 py-3">
            <p className="text-xs font-bold text-[#fff1c2]/45">
              {activeTab === "deposit"
                ? `အနည်းဆုံး ${formatMMK(minimumDeposit)} ကျပ်မှ စတင်နိုင်ပါသည်`
                : `အနည်းဆုံး ${formatMMK(minimumWithdraw)} ကျပ်မှ စတင်နိုင်ပါသည်`}
            </p>
            <p className="mt-1 text-xs font-semibold text-[#fff1c2]/38">
              {notePlaceholder}
            </p>
          </div>

          <CashierRequestForm
            activeTab={activeTab}
            amount={amount}
            note={note}
            amountLabel={formatMMK(numericAmount)}
            actionLabel={actionLabel}
            isValidAmount={isValidAmount}
            onTabChange={handleTabChange}
            onAmountChange={handleAmountChange}
            onNoteChange={handleNoteChange}
            onSubmitRequest={handleSubmitRequest}
          />
        </div>

        <CashierRecentTickets tickets={recentTickets} />
      </div>
    </AppShell>
  );
}

export default function CashierPage() {
  return (
    <Suspense
      fallback={
        <AppShell>
          <div className="rounded-[1.5rem] border border-[#d6a84f]/20 bg-black/40 p-5 text-sm font-bold text-[#fff3d0]">
            ပိုက်ဆံအိတ် ပြင်ဆင်နေပါသည်
          </div>
        </AppShell>
      }
    >
      <CashierPageContent />
    </Suspense>
  );
}