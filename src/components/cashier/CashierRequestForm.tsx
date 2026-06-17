// src/components/cashier/CashierRequestForm.tsx

import { submitWalletRequest } from "@/lib/supabase/walletRequests";

type CashierTab = "deposit" | "withdraw";

type CashierRequestFormProps = {
  activeTab: CashierTab;
  amount: string;
  note: string;
  amountLabel: string;
  actionLabel: string;
  isValidAmount: boolean;
  onTabChange: (tab: CashierTab) => void;
  onAmountChange: (value: string) => void;
  onNoteChange: (value: string) => void;
  onSubmitRequest: () => void;
};

function formatMMK(amount: number) {
  return new Intl.NumberFormat("en-US").format(amount);
}

export default function CashierRequestForm({
  activeTab,
  amount,
  note,
  amountLabel,
  isValidAmount,
  onTabChange,
  onAmountChange,
  onNoteChange,
}: CashierRequestFormProps) {
  const isDeposit = activeTab === "deposit";

  return (
    <form
      action={submitWalletRequest}
      className="mt-6 rounded-[2rem] border border-[#d6a84f]/25 bg-[#090202]/58 p-4 shadow-2xl shadow-black/45 backdrop-blur-md"
    >
      <input type="hidden" name="requestType" value={activeTab} />

      <div className="grid grid-cols-2 gap-2 rounded-full border border-[#d6a84f]/20 bg-black/30 p-1">
        <button
          type="button"
          onClick={() => onTabChange("deposit")}
          className={
            isDeposit
              ? "min-h-11 rounded-full bg-gradient-to-b from-[#ffd77a] via-[#d6a84f] to-[#8f6422] px-4 py-3 text-sm font-black text-[#210807] shadow-lg shadow-black/30"
              : "min-h-11 rounded-full px-4 py-3 text-sm font-bold text-[#fff3d0]/55 transition hover:bg-[#d6a84f]/10 hover:text-[#fff3d0]"
          }
        >
          ငွေသွင်း
        </button>

        <button
          type="button"
          onClick={() => onTabChange("withdraw")}
          className={
            !isDeposit
              ? "min-h-11 rounded-full bg-gradient-to-b from-[#ffd77a] via-[#d6a84f] to-[#8f6422] px-4 py-3 text-sm font-black text-[#210807] shadow-lg shadow-black/30"
              : "min-h-11 rounded-full px-4 py-3 text-sm font-bold text-[#fff3d0]/55 transition hover:bg-[#d6a84f]/10 hover:text-[#fff3d0]"
          }
        >
          ငွေထုတ်
        </button>
      </div>

      <div className="mt-5 rounded-[1.5rem] border border-[#d6a84f]/18 bg-black/25 p-4">
        <p className="text-xs font-semibold text-[#f7dfaa]/70">
          {isDeposit ? "ငွေသွင်းပမာဏ" : "ငွေထုတ်ပမာဏ"}
        </p>

        <input
          name="amount"
          value={amount}
          onChange={(event) => onAmountChange(event.target.value)}
          inputMode="numeric"
          className="mt-3 w-full bg-transparent text-3xl font-black text-[#ffd77a] outline-none placeholder:text-[#fff3d0]/20"
          placeholder="10000"
        />

        <p className="mt-1 text-xs font-semibold text-[#fff3d0]/40">
          {amountLabel} ကျပ်
        </p>

        <div className="mt-4 grid grid-cols-3 gap-2">
          {[10000, 50000, 100000].map((quickAmount) => (
            <button
              key={quickAmount}
              type="button"
              onClick={() => onAmountChange(String(quickAmount))}
              className="min-h-10 rounded-full border border-[#d6a84f]/25 bg-[#d6a84f]/10 px-3 py-2 text-xs font-black text-[#fff3d0] transition active:scale-[0.98]"
            >
              {formatMMK(quickAmount)}
            </button>
          ))}
        </div>
      </div>

      {isDeposit ? (
        <div className="mt-5 rounded-[1.5rem] border border-[#d6a84f]/18 bg-black/25 p-4">
          <p className="text-xs font-semibold text-[#f7dfaa]/70">
            ငွေလွှဲအချက်အလက်
          </p>

          <div className="mt-3 space-y-2 text-sm font-semibold text-[#fff3d0]/70">
            <div className="flex items-center justify-between gap-3">
              <span>အကောင့်အမည်</span>
              <span className="text-[#ffd77a]">နဂါးနီ</span>
            </div>

            <div className="flex items-center justify-between gap-3">
              <span>အကောင့်နံပါတ်</span>
              <span className="text-[#ffd77a]">Admin မှ ဖြည့်ရန်</span>
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-dashed border-[#d6a84f]/25 bg-black/25 p-4 text-center text-xs font-semibold leading-5 text-[#f7dfaa]/55">
            QR ပုံနှင့် Screenshot တင်ခြင်းကို Admin Wallet Config အဆင့်တွင်
            ဆက်ထည့်မည်
          </div>
        </div>
      ) : null}

      <div className="mt-5">
        <p className="pl-2 text-xs font-semibold text-[#f7dfaa]/70">
          မှတ်ချက်
        </p>

        <textarea
          name="note"
          value={note}
          onChange={(event) => onNoteChange(event.target.value)}
          rows={3}
          className="mt-2 w-full resize-none rounded-2xl border border-[#d6a84f]/25 bg-black/35 px-4 py-3 text-sm text-[#fff3d0] outline-none placeholder:text-[#f7dfaa]/35 focus:border-[#ffd77a]/60 focus:ring-2 focus:ring-[#d6a84f]/20"
          placeholder={
            isDeposit
              ? "ငွေလွှဲအမည်၊ ဖုန်းနံပါတ် သို့မဟုတ် မှတ်ချက်ရေးပါ"
              : "ငွေလက်ခံမည့် အကောင့်အချက်အလက်ရေးပါ"
          }
        />
      </div>

      <div className="mt-5 rounded-2xl border border-[#d6a84f]/15 bg-black/25 p-4">
        <div className="flex items-center justify-between">
          <p className="text-xs text-[#fff3d0]/45">အမျိုးအစား</p>
          <p className="text-sm font-black text-[#ffd77a]">
            {isDeposit ? "ငွေသွင်း" : "ငွေထုတ်"}
          </p>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <p className="text-xs text-[#fff3d0]/45">ပမာဏ</p>
          <p className="text-sm font-black text-[#ffd77a]">
            {amountLabel} ကျပ်
          </p>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <p className="text-xs text-[#fff3d0]/45">အခြေအနေ</p>
          <p className="text-sm font-black text-[#fff3d0]">
            စောင့်ဆိုင်းနေသည်
          </p>
        </div>
      </div>

      <button
        type="submit"
        disabled={!isValidAmount}
        className={
          isValidAmount
            ? "mt-5 min-h-12 w-full rounded-full border border-[#ffd77a]/45 bg-gradient-to-b from-[#b21b16] via-[#7f1111] to-[#3a0707] px-5 py-4 text-sm font-black text-[#fff3d0] shadow-xl shadow-black/45 transition active:scale-[0.98]"
            : "mt-5 min-h-12 w-full rounded-full border border-[#d6a84f]/15 bg-white/10 px-5 py-4 text-sm font-black text-[#fff3d0]/35"
        }
      >
        {isDeposit ? "ငွေသွင်း တင်မည်" : "ငွေထုတ် တင်မည်"}
      </button>

      {!isValidAmount ? (
        <p className="mt-3 text-center text-xs font-bold text-red-200/70">
          အနည်းဆုံး ၁,၀၀၀ ကျပ် လိုအပ်ပါသည်
        </p>
      ) : null}
    </form>
  );
}