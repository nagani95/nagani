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
      className="relative grid content-start gap-1.5 overflow-hidden rounded-[1.05rem] border border-[#c89b3c]/55 bg-[linear-gradient(180deg,#f7edd3,#ead8ac_58%,#d8bd79)] p-2 shadow-[0_10px_24px_rgba(0,0,0,0.5),inset_0_1px_2px_rgba(255,255,255,0.72)]"
    >
      <div className="pointer-events-none absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent" />

      <input type="hidden" name="requestType" value={activeTab} />

      <div className="relative grid grid-cols-2 gap-1 rounded-[0.85rem] border border-[#8a5a16]/25 bg-[#4a2412]/12 p-1 shadow-inner shadow-[#4a2412]/25">
        <button
          type="button"
          onClick={() => onTabChange("deposit")}
          className={
            isDeposit
              ? "h-9 rounded-[0.65rem] border border-[#7a3d0b]/28 bg-[linear-gradient(180deg,#fff1ba,#d59a32_58%,#8b4a0d)] px-3 text-sm font-black text-[#2a1208] shadow-[0_3px_10px_rgba(86,45,12,0.35),inset_0_1px_1px_rgba(255,255,255,0.55)]"
              : "h-9 rounded-[0.65rem] px-3 text-sm font-black text-[#6b3a0d]/62 active:scale-[0.99]"
          }
        >
          ငွေသွင်း
        </button>

        <button
          type="button"
          onClick={() => onTabChange("withdraw")}
          className={
            !isDeposit
              ? "h-9 rounded-[0.65rem] border border-[#7a3d0b]/28 bg-[linear-gradient(180deg,#fff1ba,#d59a32_58%,#8b4a0d)] px-3 text-sm font-black text-[#2a1208] shadow-[0_3px_10px_rgba(86,45,12,0.35),inset_0_1px_1px_rgba(255,255,255,0.55)]"
              : "h-9 rounded-[0.65rem] px-3 text-sm font-black text-[#6b3a0d]/62 active:scale-[0.99]"
          }
        >
          ငွေထုတ်
        </button>
      </div>

      <div className="rounded-[0.95rem] border border-[#9c6a21]/22 bg-[#fff7df]/64 px-3 py-2 shadow-inner shadow-[#7a4a12]/16">
        <p className="text-[10px] font-black tracking-[0.12em] text-[#7a4a12]/82">
          {isDeposit ? "ငွေသွင်းပမာဏ" : "ငွေထုတ်ပမာဏ"}
        </p>

        <div className="mt-1 flex items-end gap-2 border-b border-[#9c6a21]/34 pb-1">
          <span className="pb-0.5 text-xs font-black text-[#7a4a12]/58">
            Ks
          </span>

          <input
            name="amount"
            value={amount}
            onChange={(event) => onAmountChange(event.target.value)}
            inputMode="numeric"
            className="min-w-0 flex-1 bg-transparent text-[1.35rem] font-black leading-none text-[#4a2412] outline-none placeholder:text-[#7a4a12]/25"
            placeholder="10000"
          />

          <p className="shrink-0 pb-0.5 text-[10px] font-bold text-[#7a4a12]/60">
            {amountLabel} ကျပ်
          </p>
        </div>

        <div className="mt-2 grid grid-cols-3 gap-1.5">
          {[10000, 50000, 100000].map((quickAmount) => (
            <button
              key={quickAmount}
              type="button"
              onClick={() => onAmountChange(String(quickAmount))}
              className="h-7 rounded-[0.65rem] border border-[#9c6a21]/35 bg-[linear-gradient(180deg,#fff7df,#ead39a)] px-2 text-[11px] font-black text-[#4a2412] shadow-[inset_0_1px_1px_rgba(255,255,255,0.7),0_2px_5px_rgba(74,36,18,0.16)] active:scale-[0.98]"
            >
              {formatMMK(quickAmount)}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-[0.95rem] border border-[#9c6a21]/22 bg-[#fff7df]/64 px-3 py-2 shadow-inner shadow-[#7a4a12]/16">
        <p className="text-[10px] font-black tracking-[0.12em] text-[#7a4a12]/82">
          {isDeposit ? "လွှဲပြေစာ မှတ်ချက်" : "ငွေလက်ခံမည့် အချက်အလက်"}
        </p>

        <textarea
          name="note"
          value={note}
          onChange={(event) => onNoteChange(event.target.value)}
          rows={2}
          className="mt-1 h-[2.65rem] w-full resize-none rounded-[0.7rem] border border-[#9c6a21]/24 bg-[#fffaf0]/75 px-3 py-1.5 text-sm font-bold leading-5 text-[#4a2412] outline-none placeholder:text-[#7a4a12]/36 focus:border-[#9c6a21]/58 focus:ring-2 focus:ring-[#c89b3c]/22"
          placeholder={
            isDeposit
              ? "နောက်ဆုံးနံပါတ် 6လုံး"
              : "အကောင့်အမည် / ဖုန်းနံပါတ်"
          }
        />

        <p className="mt-1 text-[9.5px] font-semibold leading-3 text-[#7a4a12]/58">
          {isDeposit
            ? "စစ်ဆေးပြီးပါက လက်ကျန်ငွေ ဖြည့်ပေးပါမည်။"
            : "အတည်ပြုပြီးပါက ငွေထုတ်မှု ဆောင်ရွက်ပေးပါမည်။"}
        </p>
      </div>

      <button
        type="submit"
        disabled={!isValidAmount}
        className={
          isValidAmount
            ? "h-10 w-full rounded-[0.85rem] border border-[#ffd77a]/60 bg-[linear-gradient(180deg,#b51b22,#7b0f14_56%,#430407)] px-5 text-sm font-black text-[#ffe6a3] shadow-[0_8px_18px_rgba(74,10,10,0.42),inset_0_1px_2px_rgba(255,215,122,0.45)] active:scale-[0.98]"
            : "h-10 w-full rounded-[0.85rem] border border-[#9c6a21]/24 bg-[#4a2412]/14 px-5 text-sm font-black text-[#7a4a12]/42"
        }
      >
        {actionLabel}
      </button>

      {!isValidAmount ? (
        <p className="text-center text-[10px] font-bold text-[#8f1d12]/72">
          အနည်းဆုံးသတ်မှတ်ထားသော ပမာဏ လိုအပ်ပါသည်
        </p>
      ) : null}
    </form>
  );
}