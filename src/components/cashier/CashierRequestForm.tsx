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
  actionLabel,
  isValidAmount,
  onTabChange,
  onAmountChange,
  onNoteChange,
}: CashierRequestFormProps) {
  return (
    <form
      action={submitWalletRequest}
      className="mt-6 rounded-[1.75rem] border border-amber-400/20 bg-black/45 p-4 shadow-xl shadow-black/40"
    >
      <input type="hidden" name="requestType" value={activeTab} />

      <div className="grid grid-cols-2 gap-2 rounded-full border border-white/10 bg-white/[0.04] p-1">
        <button
          type="button"
          onClick={() => onTabChange("deposit")}
          className={
            activeTab === "deposit"
              ? "rounded-full bg-gradient-to-b from-amber-200 to-amber-400 px-4 py-3 text-sm font-black text-black shadow-lg shadow-amber-950/30"
              : "rounded-full px-4 py-3 text-sm font-bold text-white/55 transition hover:bg-white/5 hover:text-white"
          }
        >
          Deposit
        </button>

        <button
          type="button"
          onClick={() => onTabChange("withdraw")}
          className={
            activeTab === "withdraw"
              ? "rounded-full bg-gradient-to-b from-amber-200 to-amber-400 px-4 py-3 text-sm font-black text-black shadow-lg shadow-amber-950/30"
              : "rounded-full px-4 py-3 text-sm font-bold text-white/55 transition hover:bg-white/5 hover:text-white"
          }
        >
          Withdraw
        </button>
      </div>

      <div className="mt-5">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-200/60">
          {activeTab === "deposit" ? "Deposit Amount" : "Withdraw Amount"}
        </p>

        <div className="mt-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
          <input
            name="amount"
            value={amount}
            onChange={(event) => onAmountChange(event.target.value)}
            inputMode="numeric"
            className="w-full bg-transparent text-2xl font-black text-amber-100 outline-none placeholder:text-white/20"
            placeholder="10000"
          />
          <p className="mt-1 text-xs font-bold uppercase tracking-[0.18em] text-white/35">
            MMK Request Amount
          </p>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2">
          {[10000, 50000, 100000].map((quickAmount) => (
            <button
              key={quickAmount}
              type="button"
              onClick={() => onAmountChange(String(quickAmount))}
              className="rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-2 text-xs font-black text-amber-100 transition hover:bg-amber-300 hover:text-black"
            >
              {formatMMK(quickAmount)}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-200/60">
          Request Note
        </p>

        <textarea
          name="note"
          value={note}
          onChange={(event) => onNoteChange(event.target.value)}
          rows={3}
          className="mt-3 w-full resize-none rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none placeholder:text-white/25"
          placeholder={
            activeTab === "deposit"
              ? "Add transfer note, account name, or reference..."
              : "Add wallet/account details for settlement..."
          }
        />
      </div>

      <div className="mt-5 rounded-2xl border border-white/10 bg-black/30 p-4">
        <div className="flex items-center justify-between">
          <p className="text-xs text-white/40">Request Type</p>
          <p className="text-sm font-black text-amber-100">
            {activeTab === "deposit" ? "Deposit" : "Withdraw"}
          </p>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <p className="text-xs text-white/40">Amount</p>
          <p className="text-sm font-black text-amber-100">{amountLabel} MMK</p>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <p className="text-xs text-white/40">Status After Submit</p>
          <p className="text-sm font-black text-emerald-100">Pending review</p>
        </div>
      </div>

      <button
        type="submit"
        disabled={!isValidAmount}
        className={
          isValidAmount
            ? "mt-5 w-full rounded-full bg-gradient-to-b from-amber-200 to-amber-400 px-5 py-4 text-sm font-black text-black shadow-xl shadow-amber-950/40 transition active:scale-[0.98]"
            : "mt-5 w-full rounded-full bg-white/10 px-5 py-4 text-sm font-black text-white/35"
        }
      >
        {actionLabel}
      </button>

      {!isValidAmount && (
        <p className="mt-3 text-center text-xs font-bold text-red-200/60">
          Minimum request amount is 1,000 MMK.
        </p>
      )}
    </form>
  );
}