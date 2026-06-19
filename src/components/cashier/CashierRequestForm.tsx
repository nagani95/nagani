// src/components/cashier/CashierRequestForm.tsx

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
  onSubmitRequest: () => void | Promise<void>;
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
  onSubmitRequest,
}: CashierRequestFormProps) {
  const isDeposit = activeTab === "deposit";

  return (
<form
  onSubmit={(event) => {
    event.preventDefault();
    void onSubmitRequest();
  }}
  className="mt-4 rounded-[1.75rem] border border-[#d6a84f]/25 bg-[#090202]/58 p-3 shadow-2xl shadow-black/45 backdrop-blur-md"
>
      <input type="hidden" name="requestType" value={activeTab} />

      <div className="grid grid-cols-2 gap-2 rounded-full border border-[#d6a84f]/20 bg-black/30 p-1">
        <button
          type="button"
          onClick={() => onTabChange("deposit")}
          className={
            isDeposit
              ? "min-h-10 rounded-full bg-gradient-to-b from-[#ffd77a] via-[#d6a84f] to-[#8f6422] px-4 py-2 text-sm font-black text-[#210807] shadow-lg shadow-black/30"
              : "min-h-10 rounded-full px-4 py-2 text-sm font-bold text-[#fff3d0]/55 transition hover:bg-[#d6a84f]/10 hover:text-[#fff3d0]"
          }
        >
          ငွေသွင်း
        </button>

        <button
          type="button"
          onClick={() => onTabChange("withdraw")}
          className={
            !isDeposit
              ? "min-h-10 rounded-full bg-gradient-to-b from-[#ffd77a] via-[#d6a84f] to-[#8f6422] px-4 py-2 text-sm font-black text-[#210807] shadow-lg shadow-black/30"
              : "min-h-10 rounded-full px-4 py-2 text-sm font-bold text-[#fff3d0]/55 transition hover:bg-[#d6a84f]/10 hover:text-[#fff3d0]"
          }
        >
          ငွေထုတ်
        </button>
      </div>

      <div className="mt-4 rounded-[1.35rem] border border-[#d6a84f]/18 bg-black/25 p-3">
        <p className="text-xs font-semibold text-[#f7dfaa]/70">
          {isDeposit ? "ငွေသွင်းပမာဏ" : "ငွေထုတ်ပမာဏ"}
        </p>

        <input
          name="amount"
          value={amount}
          onChange={(event) => onAmountChange(event.target.value)}
          inputMode="numeric"
          className="mt-2 w-full bg-transparent text-[1.65rem] font-black leading-tight text-[#ffd77a] outline-none placeholder:text-[#fff3d0]/20"
          placeholder="10000"
        />

        <p className="mt-1 text-xs font-semibold text-[#fff3d0]/40">
          {amountLabel} ကျပ်
        </p>

        <div className="mt-3 grid grid-cols-3 gap-2">
          {[10000, 50000, 100000].map((quickAmount) => (
            <button
              key={quickAmount}
              type="button"
              onClick={() => onAmountChange(String(quickAmount))}
              className="min-h-9 rounded-full border border-[#d6a84f]/25 bg-[#d6a84f]/10 px-2 py-2 text-xs font-black text-[#fff3d0] transition active:scale-[0.98]"
            >
              {formatMMK(quickAmount)}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 rounded-[1.35rem] border border-[#d6a84f]/18 bg-black/25 p-3">
        <p className="text-xs font-semibold text-[#f7dfaa]/70">
          {isDeposit ? "ငွေလွှဲပြီး မှတ်ချက်ရေးပါ" : "ငွေလက်ခံမည့် အချက်အလက်"}
        </p>

        <textarea
          name="note"
          value={note}
          onChange={(event) => onNoteChange(event.target.value)}
          rows={2}
          className="mt-2 w-full resize-none rounded-2xl border border-[#d6a84f]/25 bg-black/35 px-4 py-3 text-sm text-[#fff3d0] outline-none placeholder:text-[#f7dfaa]/35 focus:border-[#ffd77a]/60 focus:ring-2 focus:ring-[#d6a84f]/20"
          placeholder={
            isDeposit
              ? "ငွေလွှဲအမည်၊ ဖုန်းနံပါတ် သို့မဟုတ် မှတ်ချက်ရေးပါ"
              : "ငွေလက်ခံမည့် အကောင့်အမည် / နံပါတ်ရေးပါ"
          }
        />

        <p className="mt-2 text-[0.68rem] font-semibold leading-5 text-[#f7dfaa]/45">
          {isDeposit
            ? "တင်ပြီးပါက ဝန်ဆောင်မှုအဖွဲ့မှ စစ်ဆေးပြီး လက်ကျန်ငွေ ဖြည့်ပေးပါမည်။"
            : "အတည်ပြုပြီးပါက ငွေထုတ်မှုကို ဆောင်ရွက်ပေးပါမည်။"}
        </p>
      </div>

      <button
        type="submit"
        disabled={!isValidAmount}
        className={
          isValidAmount
            ? "mt-4 min-h-11 w-full rounded-full border border-[#ffd77a]/45 bg-gradient-to-b from-[#b21b16] via-[#7f1111] to-[#3a0707] px-5 py-3 text-sm font-black text-[#fff3d0] shadow-xl shadow-black/45 transition active:scale-[0.98]"
            : "mt-4 min-h-11 w-full rounded-full border border-[#d6a84f]/15 bg-white/10 px-5 py-3 text-sm font-black text-[#fff3d0]/35"
        }
      >
        {actionLabel}
      </button>

      {!isValidAmount ? (
        <p className="mt-3 text-center text-xs font-bold text-red-200/70">
          အနည်းဆုံး ၁,၀၀၀ ကျပ် လိုအပ်ပါသည်
        </p>
      ) : null}
    </form>
  );
}