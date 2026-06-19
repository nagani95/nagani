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
      className="mt-4 rounded-[2rem] border border-[#d6a84f]/28 bg-[linear-gradient(180deg,rgba(35,5,3,0.88),rgba(7,1,1,0.94))] p-4 shadow-2xl shadow-black/55"
    >
      <input type="hidden" name="requestType" value={activeTab} />

      <div className="grid grid-cols-2 gap-2 rounded-full border border-[#d6a84f]/25 bg-black/35 p-1">
        <button
          type="button"
          onClick={() => onTabChange("deposit")}
          className={
            isDeposit
              ? "min-h-11 rounded-full border border-[#ffd77a]/45 bg-[linear-gradient(180deg,#f5cd72,#b97a22_62%,#6b3a0d)] px-4 py-2 text-sm font-black text-[#1b0702] shadow-lg shadow-black/35"
              : "min-h-11 rounded-full px-4 py-2 text-sm font-black text-[#fff3d0]/55 active:scale-[0.99]"
          }
        >
          ငွေသွင်း
        </button>

        <button
          type="button"
          onClick={() => onTabChange("withdraw")}
          className={
            !isDeposit
              ? "min-h-11 rounded-full border border-[#ffd77a]/45 bg-[linear-gradient(180deg,#f5cd72,#b97a22_62%,#6b3a0d)] px-4 py-2 text-sm font-black text-[#1b0702] shadow-lg shadow-black/35"
              : "min-h-11 rounded-full px-4 py-2 text-sm font-black text-[#fff3d0]/55 active:scale-[0.99]"
          }
        >
          ငွေထုတ်
        </button>
      </div>

      <div className="mt-4 rounded-[1.6rem] border border-[#d6a84f]/20 bg-black/28 p-4">
        <p className="text-xs font-black text-[#f7dfaa]/65">
          {isDeposit ? "ငွေသွင်းပမာဏ" : "ငွေထုတ်ပမာဏ"}
        </p>

        <input
          name="amount"
          value={amount}
          onChange={(event) => onAmountChange(event.target.value)}
          inputMode="numeric"
          className="mt-2 w-full bg-transparent text-[2rem] font-black leading-tight text-[#ffd77a] outline-none placeholder:text-[#fff3d0]/20"
          placeholder="10000"
        />

        <p className="mt-1 text-xs font-bold text-[#fff3d0]/45">
          {amountLabel} ကျပ်
        </p>

        <div className="mt-4 grid grid-cols-3 gap-2">
          {[10000, 50000, 100000].map((quickAmount) => (
            <button
              key={quickAmount}
              type="button"
              onClick={() => onAmountChange(String(quickAmount))}
              className="min-h-10 rounded-full border border-[#d6a84f]/25 bg-[#d6a84f]/10 px-2 py-2 text-xs font-black text-[#fff3d0] active:scale-[0.98]"
            >
              {formatMMK(quickAmount)}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 rounded-[1.6rem] border border-[#d6a84f]/20 bg-black/28 p-4">
        <p className="text-xs font-black text-[#f7dfaa]/65">
          {isDeposit ? "ငွေလွှဲပြီး မှတ်ချက်ရေးပါ" : "ငွေလက်ခံမည့် အချက်အလက်"}
        </p>

        <textarea
          name="note"
          value={note}
          onChange={(event) => onNoteChange(event.target.value)}
          rows={3}
          className="mt-3 w-full resize-none rounded-2xl border border-[#d6a84f]/25 bg-black/38 px-4 py-3 text-sm font-bold leading-6 text-[#fff3d0] outline-none placeholder:text-[#f7dfaa]/35 focus:border-[#ffd77a]/60 focus:ring-2 focus:ring-[#d6a84f]/20"
          placeholder={
            isDeposit
              ? "ငွေလွှဲအမည်၊ ဖုန်းနံပါတ် သို့မဟုတ် မှတ်ချက်ရေးပါ"
              : "ငွေလက်ခံမည့် အကောင့်အမည် / နံပါတ်ရေးပါ"
          }
        />

        <p className="mt-3 text-[0.68rem] font-semibold leading-5 text-[#f7dfaa]/45">
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
            ? "mt-4 min-h-12 w-full rounded-full border border-red-300/25 bg-[linear-gradient(180deg,rgba(185,28,22,0.96),rgba(114,13,11,0.96),rgba(45,4,4,0.98))] px-5 py-3 text-sm font-black text-[#fff3d0] shadow-xl shadow-black/45 active:scale-[0.98]"
            : "mt-4 min-h-12 w-full rounded-full border border-[#d6a84f]/15 bg-white/10 px-5 py-3 text-sm font-black text-[#fff3d0]/35"
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