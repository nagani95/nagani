// src/app/cashier/page.tsx

"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useMemo, useState } from "react";

import CashierHero from "@/components/cashier/CashierHero";
import CashierRequestForm from "@/components/cashier/CashierRequestForm";
import { NaganiBottomNav, NaganiPageShell } from "@/components/nagani-v2";
import { createClient } from "@/lib/supabase/client";

type CashierTab = "deposit" | "withdraw";

type WalletAddressRow = {
  id: string;
  provider_key: string | null;
  provider_name: string;
  account_name: string;
  account_number: string;
  qr_asset_path: string;
  minimum_deposit: number | string;
  minimum_withdraw: number | string;
  admin_note: string;
  sort_order: number | null;
  is_active: boolean;
};

const DEFAULT_MINIMUM_AMOUNT = 3000;

function toSafeAmount(value: number | string | null | undefined) {
  const amount = Number(value ?? 0);
  return Number.isFinite(amount) ? amount : 0;
}

function formatMMK(amount: number) {
  return new Intl.NumberFormat("en-US").format(amount);
}

function readWithdrawNoteFields(note: string) {
  const lines = note.split("\n");

  const readLine = (label: string) => {
    const prefix = `${label}:`;
    return (
      lines
        .find((line) => line.trim().startsWith(prefix))
        ?.replace(prefix, "")
        .trim() ?? ""
    );
  };

  return {
    paymentType: readLine("ငွေလက်ခံမည့်အမျိုးအစား"),
    accountPhone: readLine("အကောင့်/ဖုန်းနံပါတ်"),
    holderName: readLine("အကောင့်ပိုင်ရှင်အမည်"),
  };
}

function CashierPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const successMessage = searchParams.get("message");
  const errorMessage = searchParams.get("error");

  const [supabase] = useState(() => createClient());
  const [walletBalance, setWalletBalance] = useState(0);
const [isRefreshingWallet, setIsRefreshingWallet] = useState(false);
const [withdrawalUnlocked, setWithdrawalUnlocked] = useState(false);
  const [walletAddresses, setWalletAddresses] = useState<WalletAddressRow[]>(
    []
  );
  const [selectedWalletAddressId, setSelectedWalletAddressId] = useState("");
  const [copyStatus, setCopyStatus] = useState("");

  const [activeTab, setActiveTab] = useState<CashierTab>("deposit");
  const [amount, setAmount] = useState("10000");
  const [note, setNote] = useState("");
  const [withdrawPassword, setWithdrawPassword] = useState("");
  const [formErrorMessage, setFormErrorMessage] = useState("");

  const walletAddress =
    walletAddresses.find((item) => item.id === selectedWalletAddressId) ??
    walletAddresses[0] ??
    null;

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

const canSubmitWalletRequest =
  isValidAmount && (activeTab === "deposit" || withdrawalUnlocked);

  const displayErrorMessage = formErrorMessage || errorMessage;

  const actionLabel = useMemo(() => {
    return activeTab === "deposit" ? "ငွေသွင်း တင်မည်" : "ငွေထုတ် တင်မည်";
  }, [activeTab]);

const fetchCashierData = useCallback(async () => {
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

  const { data: profile } = await supabase
    .from("profiles")
    .select("withdrawal_unlocked")
    .eq("id", user.id)
    .maybeSingle<{ withdrawal_unlocked: boolean | null }>();

  const { data: addresses } = await supabase
    .from("wallet_addresses")
    .select(
      "id, provider_key, provider_name, account_name, account_number, qr_asset_path, minimum_deposit, minimum_withdraw, admin_note, sort_order, is_active"
    )
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  const activeAddresses = (addresses ?? []) as WalletAddressRow[];

  setWalletBalance(toSafeAmount(wallet?.balance));
  setWithdrawalUnlocked(Boolean(profile?.withdrawal_unlocked));
  setWalletAddresses(activeAddresses);

  setSelectedWalletAddressId((currentId) => {
    if (activeAddresses.some((item) => item.id === currentId)) {
      return currentId;
    }

    return activeAddresses[0]?.id ?? "";
  });
}, [router, supabase]);

useEffect(() => {
  void fetchCashierData();
}, [fetchCashierData, successMessage]);

async function handleRefreshWallet() {
  setIsRefreshingWallet(true);

  try {
    await fetchCashierData();
  } finally {
    setIsRefreshingWallet(false);
  }
}

  function handleTabChange(tab: CashierTab) {
    setActiveTab(tab);
    setCopyStatus("");
    setNote("");
    setWithdrawPassword("");
    setFormErrorMessage("");
  }

  function handleAmountChange(value: string) {
    setAmount(value);
  }

  function handleNoteChange(value: string) {
    setNote(value);
  }

  function handleWalletAddressChange(walletAddressId: string) {
    setSelectedWalletAddressId(walletAddressId);
    setCopyStatus("");
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
    if (!canSubmitWalletRequest) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.replace("/login");
      return;
    }

    const cleanNote = note.trim();
    const isDeposit = activeTab === "deposit";

    if (!isDeposit) {
      const withdrawFields = readWithdrawNoteFields(cleanNote);

      if (
        !withdrawFields.paymentType ||
        !withdrawFields.accountPhone ||
        !withdrawFields.holderName
      ) {
        setFormErrorMessage("ငွေလက်ခံမည့်အချက်အလက် ပြည့်စုံစွာထည့်ပါ");
        return;
      }

      if (!withdrawPassword.trim()) {
        setFormErrorMessage("ငွေထုတ်ရန် အကောင့်စကားဝှက် ထည့်ပါ");
        return;
      }

      if (!user.email) {
        setFormErrorMessage("အကောင့်ပြန်ဝင်ရန် လိုအပ်ပါသည်");
        return;
      }

      const { error: passwordError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: withdrawPassword,
      });

      if (passwordError) {
        setFormErrorMessage("စကားဝှက် မှားနေပါသည်");
        return;
      }
    }

    setFormErrorMessage("");

    const { error } = await supabase.from("wallet_requests").insert({
      profile_id: user.id,
      request_type: activeTab,
      amount: numericAmount,
      note: cleanNote || null,
      status: "pending",
      wallet_address_id: isDeposit ? walletAddress?.id ?? null : null,
      payment_provider_key: isDeposit
        ? walletAddress?.provider_key ?? walletAddress?.id ?? null
        : null,
      payment_provider_name: isDeposit
        ? walletAddress?.provider_name ?? null
        : null,
      payment_account_name: isDeposit
        ? walletAddress?.account_name ?? null
        : null,
      payment_account_number: isDeposit
        ? walletAddress?.account_number ?? null
        : null,
    });

    if (error) {
      console.error("Wallet request submit error:", error.message);
      router.replace("/cashier?error=1");
      return;
    }

    setAmount("10000");
    setNote("");
    setWithdrawPassword("");
    setFormErrorMessage("");
    router.replace("/cashier?message=1");
  }

  return (
    <NaganiPageShell
      bottomNav={<NaganiBottomNav />}
      contentClassName="relative z-10 min-h-screen"
    >
      <main className="mx-auto flex min-h-[100dvh] w-full max-w-md flex-col px-5 pb-[calc(env(safe-area-inset-bottom)+7.45rem)] pt-[calc(env(safe-area-inset-top)+0.85rem)]">
<CashierHero
  balanceLabel={`${formatMMK(walletBalance)} ကျပ်`}
  historyHref="/cashier/history"
  onRefresh={handleRefreshWallet}
  isRefreshing={isRefreshingWallet}
/>

        {(successMessage || displayErrorMessage) && (
          <div className="pointer-events-none fixed inset-x-5 top-[calc(env(safe-area-inset-top)+3.25rem)] z-30 mx-auto max-w-md">
            {successMessage ? (
              <div className="rounded-full border border-[#d6a84f]/32 bg-[linear-gradient(145deg,rgba(40,24,8,0.92),rgba(10,5,2,0.94))] px-4 py-2 text-center text-xs font-bold text-[#ffd77a] shadow-xl shadow-black/45 backdrop-blur">
                တင်သွင်းမှု အောင်မြင်ပါသည်။
              </div>
            ) : null}

            {displayErrorMessage ? (
              <div className="rounded-full border border-red-300/25 bg-[linear-gradient(145deg,rgba(70,10,10,0.9),rgba(18,3,3,0.94))] px-4 py-2 text-center text-xs font-bold text-red-100 shadow-xl shadow-black/45 backdrop-blur">
                {formErrorMessage || "တင်သွင်းမှု မအောင်မြင်ပါ။ ပြန်စစ်ပါ။"}
              </div>
            ) : null}
          </div>
        )}

        <CashierRequestForm
          activeTab={activeTab}
          amount={amount}
          note={note}
          amountLabel={formatMMK(numericAmount)}
          actionLabel={actionLabel}
          isValidAmount={canSubmitWalletRequest}
          withdrawPassword={withdrawPassword}
          onTabChange={handleTabChange}
          onAmountChange={handleAmountChange}
          onNoteChange={handleNoteChange}
          onWithdrawPasswordChange={setWithdrawPassword}
          onSubmitRequest={handleSubmitRequest}
        />

                {activeTab === "deposit" ? (
          <>
<section className="relative mt-3 overflow-hidden rounded-[1.05rem] border border-[#d6a84f]/34 bg-[linear-gradient(145deg,rgba(52,12,5,0.94),rgba(16,4,2,0.97),rgba(68,16,7,0.9))] px-3.5 py-3 shadow-[0_10px_22px_rgba(0,0,0,0.46),inset_0_1px_0_rgba(255,215,122,0.14)]">
  <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-[#ffd77a]/58 to-transparent" />

  <p className="relative text-[12px] font-black leading-5 text-[#ffe6a3]">
    အနည်းဆုံး {formatMMK(minimumDeposit)} ကျပ်မှ စတင်နိုင်ပါသည်
  </p>

  {walletAddress?.admin_note ? (
    <p className="relative mt-1.5 text-[11px] font-bold leading-5 text-[#fff1c2]/82">
      {walletAddress.admin_note}
    </p>
  ) : null}
</section>

            <button
              type="submit"
              form="cashier-request-form"
              disabled={!canSubmitWalletRequest}
              className={
                canSubmitWalletRequest
                  ? "mt-3 h-12 w-full rounded-[1rem] border border-[#ffd77a]/60 bg-[linear-gradient(180deg,#b51b22,#7b0f14_56%,#430407)] px-5 text-base font-black text-[#ffe6a3] shadow-[0_10px_22px_rgba(74,10,10,0.44),inset_0_1px_2px_rgba(255,215,122,0.45)] active:scale-[0.98]"
                  : "mt-3 h-12 w-full rounded-[1rem] border border-[#9c6a21]/24 bg-[#4a2412]/20 px-5 text-base font-black text-[#d6a84f]/42"
              }
            >
              {actionLabel}
            </button>

            {!canSubmitWalletRequest ? (
              <p className="mt-2 text-center text-[10px] font-bold text-[#ffd0b6]/68">
                အနည်းဆုံးသတ်မှတ်ထားသော ပမာဏ လိုအပ်ပါသည်
              </p>
            ) : null}
          </>
        ) : null}

        {activeTab === "deposit" ? (
          walletAddress ? (
            <section className="relative mt-3 overflow-hidden rounded-[1.35rem] border border-[#d6a84f]/38 bg-[linear-gradient(145deg,rgba(54,10,5,0.97),rgba(12,2,1,0.99),rgba(72,14,7,0.94))] p-3 text-[#ffe6a3] shadow-[0_16px_40px_rgba(0,0,0,0.62),inset_0_1px_0_rgba(255,215,122,0.15)]">
              <div className="pointer-events-none absolute inset-x-7 top-0 h-px bg-gradient-to-r from-transparent via-[#ffd77a]/72 to-transparent" />

              <div className="relative">
                {walletAddresses.length > 1 ? (
                  <div className="mb-3 grid grid-cols-3 gap-1 rounded-[0.85rem] border border-[#d6a84f]/22 bg-black/24 p-1 shadow-inner shadow-black/55">
                    {walletAddresses.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleWalletAddressChange(item.id)}
                        className={
                          item.id === walletAddress.id
                            ? "h-8 min-w-0 truncate rounded-[0.65rem] border border-[#ffd77a]/38 bg-[linear-gradient(180deg,#ffe6a3,#d59a32_58%,#7f3f08)] px-1 text-[10px] font-black text-[#2a1208] shadow-[inset_0_1px_1px_rgba(255,255,255,0.58)]"
                            : "h-8 min-w-0 truncate rounded-[0.65rem] px-1 text-[10px] font-black text-[#f7dfaa]/48 active:scale-[0.99]"
                        }
                      >
                        {item.provider_name}
                      </button>
                    ))}
                  </div>
                ) : null}

                <div className="flex flex-col items-center">
                  <p className="text-[10px] font-black tracking-[0.22em] text-[#d6a84f]/62">
                    PAYMENT RECEIVER
                  </p>

                  <p className="mt-1 text-[1.25rem] font-black leading-tight text-[#ffd77a]">
                    {walletAddress.provider_name}
                  </p>

                  <div className="relative mt-3 size-[11.2rem] overflow-hidden rounded-[1.05rem] border border-[#8a5a16]/30 bg-[#fffaf0] p-2 shadow-[0_8px_18px_rgba(74,36,18,0.24),inset_0_1px_1px_rgba(255,255,255,0.82)]">
                    <img
                      src={walletAddress.qr_asset_path}
                      alt="ငွေသွင်းရန် QR"
                      className="h-full w-full rounded-[0.7rem] object-contain"
                    />
                  </div>

                  <p className="mt-3 w-full truncate text-center text-lg font-black text-[#ffe6a3]">
                    {walletAddress.account_name}
                  </p>

                  <div className="mt-2 grid w-full grid-cols-[minmax(0,1fr)_2.75rem] items-center gap-1.5 rounded-[0.85rem] border border-[#d6a84f]/24 bg-black/24 px-3 py-2 shadow-inner shadow-black/45">
                    <p className="min-w-0 whitespace-nowrap text-center text-[1rem] font-black tracking-[0.01em] text-[#ffe6a3]">
                      {walletAddress.account_number}
                    </p>

                    <button
                      type="button"
                      onClick={handleCopyAccountNumber}
                      className="h-8 shrink-0 rounded-[0.5rem] border border-[#7a3d0b]/30 bg-[linear-gradient(180deg,#fff1ba,#d59a32_58%,#8b4a0d)] px-1 text-[8.5px] font-black text-[#2a1208] shadow-[0_2px_6px_rgba(74,36,18,0.25),inset_0_1px_1px_rgba(255,255,255,0.55)] active:scale-[0.98]"
                    >
                      {copyStatus === "ကူးယူပြီးပါပြီ"
                        ? "ပြီး"
                        : copyStatus
                          ? "မရ"
                          : "ကူး"}
                    </button>
                  </div>
                </div>
              </div>
            </section>
          ) : (
            <section className="mt-3 rounded-[1.25rem] border border-red-300/18 bg-red-500/10 p-3">
              <p className="text-sm font-black text-red-100">
                ငွေသွင်းအကောင့် မရရှိသေးပါ
              </p>
            </section>
          )
        ) : (
<section className="relative mt-3 overflow-hidden rounded-[1.25rem] border border-[#d6a84f]/34 bg-[linear-gradient(145deg,rgba(52,12,5,0.94),rgba(16,4,2,0.97),rgba(68,16,7,0.9))] p-3.5 shadow-[0_10px_22px_rgba(0,0,0,0.46),inset_0_1px_0_rgba(255,215,122,0.14)]">
  <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-[#ffd77a]/58 to-transparent" />

  <p className="relative text-sm font-black text-[#ffd77a]">
    ငွေထုတ်ရန် အချက်အလက်
  </p>
<p className="relative mt-1.5 text-xs font-bold leading-5 text-[#fff1c2]/82">
{withdrawalUnlocked
  ? "ငွေလက်ခံမည့်အမျိုးအစား၊ ဖုန်းနံပါတ်၊ အမည်နှင့် စကားဝှက်ကို ဖြည့်ပါ။"
  : "၃,၀၀၀ ကျပ်မှစ၍ ငွေဖြည့်ပြီး ၁ ပွဲကစားပြီးမှ ငွေထုတ်နိုင်ပါသည်။"}
</p>
</section>
        )}

        {activeTab === "withdraw" ? (
          <>
<section className="relative mt-3 overflow-hidden rounded-[1.05rem] border border-[#d6a84f]/34 bg-[linear-gradient(145deg,rgba(52,12,5,0.94),rgba(16,4,2,0.97),rgba(68,16,7,0.9))] px-3.5 py-3 shadow-[0_10px_22px_rgba(0,0,0,0.46),inset_0_1px_0_rgba(255,215,122,0.14)]">
  <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-[#ffd77a]/58 to-transparent" />

  <p className="relative text-[12px] font-black leading-5 text-[#ffe6a3]">
    အနည်းဆုံး {formatMMK(minimumWithdraw)} ကျပ်မှ စတင်နိုင်ပါသည်
  </p>
</section>

            <button
              type="submit"
              form="cashier-request-form"
              disabled={!canSubmitWalletRequest}
              className={
                canSubmitWalletRequest
                  ? "mt-3 h-12 w-full rounded-[1rem] border border-[#ffd77a]/60 bg-[linear-gradient(180deg,#b51b22,#7b0f14_56%,#430407)] px-5 text-base font-black text-[#ffe6a3] shadow-[0_10px_22px_rgba(74,10,10,0.44),inset_0_1px_2px_rgba(255,215,122,0.45)] active:scale-[0.98]"
                  : "mt-3 h-12 w-full rounded-[1rem] border border-[#9c6a21]/24 bg-[#4a2412]/20 px-5 text-base font-black text-[#d6a84f]/42"
              }
            >
              {actionLabel}
            </button>

{!canSubmitWalletRequest ? (
  <p className="mt-2 text-center text-[10px] font-bold text-[#ffd0b6]/68">
    {withdrawalUnlocked
      ? "အနည်းဆုံးသတ်မှတ်ထားသော ပမာဏ လိုအပ်ပါသည်"
      : "၃,၀၀၀ ကျပ် ငွေဖြည့်ပြီး ၁ ပွဲကစားရန် လိုအပ်ပါသည်"}
  </p>
) : null}
          </>
        ) : null}
      </main>
    </NaganiPageShell>
  );
}

export default function CashierPage() {
  return (
    <Suspense
      fallback={
        <NaganiPageShell
          bottomNav={<NaganiBottomNav />}
          contentClassName="relative z-10 min-h-screen"
        >
          <div className="mx-auto w-full max-w-md px-5 pt-6">
            <div className="rounded-[1.5rem] border border-[#d6a84f]/20 bg-black/40 p-5 text-sm font-bold text-[#fff3d0]">
              ပိုက်ဆံအိတ် ပြင်ဆင်နေပါသည်
            </div>
          </div>
        </NaganiPageShell>
      }
    >
      <CashierPageContent />
    </Suspense>
  );
}