// src/app/cashier/page.tsx

"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";

import CashierHero from "@/components/cashier/CashierHero";
import CashierRequestForm from "@/components/cashier/CashierRequestForm";
import AppShell from "@/components/layout/AppShell";
import { createClient } from "@/lib/supabase/client";

type CashierTab = "deposit" | "withdraw";

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

      if (!isMounted) return;

      setWalletBalance(toSafeAmount(wallet?.balance));
      setWalletAddress(address ?? null);
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
      window.setTimeout(() => setCopyStatus(""), 2200);
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
      <div className="pointer-events-none fixed inset-0 z-0 mx-auto w-full max-w-md overflow-hidden bg-[#080101]">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${TEMP_PALACE_BACKGROUND})` }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.62)_0%,rgba(0,0,0,0.28)_35%,rgba(0,0,0,0.88)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_7%,rgba(255,215,122,0.12),transparent_31%),radial-gradient(circle_at_50%_100%,rgba(86,13,6,0.72),transparent_50%)]" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[100dvh] w-full max-w-md flex-col px-5 pb-[calc(env(safe-area-inset-bottom)+9.5rem)] pt-[calc(env(safe-area-inset-top)+0.75rem)]">
        <header className="flex h-8 shrink-0 items-center justify-between">
          <Link href="/" className="text-sm font-bold text-[#ffd77a]">
            မူလသို့
          </Link>

          <Link
            href="/cashier/history"
            className="rounded-full border border-[#d6a84f]/32 bg-[linear-gradient(145deg,rgba(42,12,7,0.8),rgba(0,0,0,0.38))] px-3 py-1.5 text-xs font-black text-[#ffd77a] shadow-lg shadow-black/40"
          >
            မှတ်တမ်း
          </Link>
        </header>

        <CashierHero balanceLabel={`${formatMMK(walletBalance)} ကျပ်`} />

        {(successMessage || errorMessage) && (
          <div className="pointer-events-none fixed inset-x-5 top-[calc(env(safe-area-inset-top)+3.25rem)] z-30 mx-auto max-w-md">
            {successMessage ? (
              <div className="rounded-full border border-[#d6a84f]/32 bg-[linear-gradient(145deg,rgba(40,24,8,0.92),rgba(10,5,2,0.94))] px-4 py-2 text-center text-xs font-bold text-[#ffd77a] shadow-xl shadow-black/45 backdrop-blur">
                တင်သွင်းမှု အောင်မြင်ပါသည်။
              </div>
            ) : null}

            {errorMessage ? (
              <div className="rounded-full border border-red-300/25 bg-[linear-gradient(145deg,rgba(70,10,10,0.9),rgba(18,3,3,0.94))] px-4 py-2 text-center text-xs font-bold text-red-100 shadow-xl shadow-black/45 backdrop-blur">
                တင်သွင်းမှု မအောင်မြင်ပါ။ ပြန်စစ်ပါ။
              </div>
            ) : null}
          </div>
        )}

        <section className="mt-2 flex flex-none flex-col overflow-visible rounded-[1.45rem] border border-[#d6a84f]/36 bg-[linear-gradient(145deg,rgba(48,12,7,0.96),rgba(8,1,1,0.99),rgba(58,10,5,0.95))] shadow-[0_24px_70px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,215,122,0.16)]">
          {activeTab === "deposit" ? (
            walletAddress ? (
<div className="shrink-0 rounded-t-[1.45rem] border-b border-[#d6a84f]/14 px-3 py-2">
  <div className="relative overflow-hidden rounded-[1.1rem] border border-[#c89b3c]/55 bg-[linear-gradient(180deg,#f7edd3,#ead8ac_58%,#d8bd79)] p-2 shadow-[0_10px_24px_rgba(0,0,0,0.42),inset_0_1px_2px_rgba(255,255,255,0.72)]">
    <div className="pointer-events-none absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-white/85 to-transparent" />

    <div className="grid grid-cols-[92px_1fr] gap-2.5">
      <div className="relative">
        <div className="relative aspect-square overflow-hidden rounded-[0.9rem] border border-[#8a5a16]/35 bg-[#fffaf0] p-1.5 shadow-[0_6px_14px_rgba(74,36,18,0.28),inset_0_1px_1px_rgba(255,255,255,0.8)]">
          <Image
            src={walletAddress.qr_asset_path}
            alt="ငွေသွင်းရန် QR"
            fill
            sizes="92px"
            className="rounded-[0.55rem] object-contain"
            priority
          />
        </div>

        <div className="mt-1 rounded-[0.6rem] border border-[#9c6a21]/20 bg-[#fff7df]/58 px-2 py-0.5 text-center shadow-inner shadow-[#7a4a12]/10">
          <p className="truncate text-[8.5px] font-black text-[#7a4a12]/70">
            QR ဖြင့် ငွေလွှဲရန်
          </p>
        </div>
      </div>

      <div className="min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[9px] font-black tracking-[0.16em] text-[#7a4a12]/62">
              PAYMENT
            </p>
            <p className="truncate text-base font-black leading-tight text-[#4a2412]">
              {walletAddress.provider_name}
            </p>
          </div>

          <div className="rounded-[0.55rem] border border-[#9c6a21]/24 bg-[#fff7df]/58 px-2 py-1 shadow-inner shadow-[#7a4a12]/10">
            <p className="text-[9px] font-black text-[#7a4a12]/68">
              ငွေသွင်း
            </p>
          </div>
        </div>

        <div className="mt-2 rounded-[0.85rem] border border-[#9c6a21]/24 bg-[#fff7df]/64 px-3 py-2 shadow-inner shadow-[#7a4a12]/14">
          <p className="truncate text-base font-black text-[#4a2412]">
            {walletAddress.account_name}
          </p>
        </div>

<div className="mt-2 grid grid-cols-[minmax(0,1fr)_2.65rem] items-center gap-1.5 rounded-[0.85rem] border border-[#9c6a21]/30 bg-[#fff7df]/64 px-2.5 py-2 shadow-inner shadow-[#7a4a12]/14">
  <p className="min-w-0 whitespace-nowrap text-[0.95rem] font-black tracking-[0.01em] text-[#4a2412]">
    {walletAddress.account_number}
  </p>

  <button
    type="button"
    onClick={handleCopyAccountNumber}
    className="h-8 shrink-0 rounded-[0.48rem] border border-[#7a3d0b]/30 bg-[linear-gradient(180deg,#fff1ba,#d59a32_58%,#8b4a0d)] px-1 text-[8.5px] font-black text-[#2a1208] shadow-[0_2px_6px_rgba(74,36,18,0.25),inset_0_1px_1px_rgba(255,255,255,0.55)] active:scale-[0.98]"
  >
    {copyStatus === "ကူးယူပြီးပါပြီ" ? "ပြီး" : copyStatus ? "မရ" : "ကူး"}
  </button>
</div>
      </div>
    </div>
  </div>
</div>
            ) : (
              <div className="shrink-0 border-b border-red-300/14 p-3">
                <div className="rounded-[1rem] border border-red-300/18 bg-red-500/10 p-3">
                  <p className="text-sm font-black text-red-100">
                    ငွေသွင်းအကောင့် မရရှိသေးပါ
                  </p>
                </div>
              </div>
            )
          ) : (
            <div className="shrink-0 border-b border-[#d6a84f]/14 p-3">
              <div className="rounded-[1rem] border border-[#d6a84f]/18 bg-black/35 px-3 py-2.5 shadow-inner shadow-black/45">
                <p className="text-sm font-black text-[#ffd77a]">
                  ငွေထုတ်ရန် အချက်အလက် ထည့်ပါ
                </p>
                <p className="mt-1 text-xs font-semibold leading-5 text-[#fff1c2]/50">
                  ဖုန်းနံပါတ် / အကောင့်အမည်ကို မှတ်ချက်ထဲတွင် ထည့်ပါ။
                </p>
              </div>
            </div>
          )}

<div className="shrink-0 px-3 pt-1.5">
  <div className="rounded-[0.85rem] border-l-2 border-[#d6a84f]/68 bg-[linear-gradient(90deg,rgba(214,168,79,0.1),rgba(0,0,0,0.16))] px-3 py-1.5">
    <p className="text-[10.5px] font-bold leading-4 text-[#fff1c2]/62">
      {activeTab === "deposit"
        ? `အနည်းဆုံး ${formatMMK(minimumDeposit)} ကျပ်မှ စတင်နိုင်ပါသည်`
        : `အနည်းဆုံး ${formatMMK(minimumWithdraw)} ကျပ်မှ စတင်နိုင်ပါသည်`}
    </p>

    {activeTab === "deposit" && walletAddress?.admin_note ? (
      <p className="mt-0.5 max-h-6 overflow-hidden text-[9.5px] font-semibold leading-3 text-[#d6a84f]/56">
        {walletAddress.admin_note}
      </p>
    ) : null}
  </div>
</div>

          <div className="shrink-0 px-3 pb-4 pt-2">
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
        </section>
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