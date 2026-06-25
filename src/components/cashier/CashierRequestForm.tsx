//src/components/cashier/CashierRequestForm.tsx

type CashierTab = "deposit" | "withdraw";

type CashierRequestFormProps = {
  activeTab: CashierTab;
  amount: string;
  note: string;
  amountLabel: string;
  actionLabel: string;
  isValidAmount: boolean;
  withdrawPassword: string;
  onTabChange: (tab: CashierTab) => void;
  onAmountChange: (value: string) => void;
  onNoteChange: (value: string) => void;
  onWithdrawPasswordChange: (value: string) => void;
  onSubmitRequest: () => void | Promise<void>;
};

type WithdrawFieldKey = "paymentType" | "accountPhone" | "holderName";

type WithdrawFields = Record<WithdrawFieldKey, string>;

const WITHDRAW_PAYMENT_TYPES = ["KBZPay", "WavePay", "AyaPay"];

function formatMMK(amount: number) {
  return new Intl.NumberFormat("en-US").format(amount);
}

function readWithdrawFields(note: string): WithdrawFields {
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

function buildWithdrawNote(fields: WithdrawFields) {
  return [
    `ငွေလက်ခံမည့်အမျိုးအစား: ${fields.paymentType}`,
    `အကောင့်/ဖုန်းနံပါတ်: ${fields.accountPhone}`,
    `အကောင့်ပိုင်ရှင်အမည်: ${fields.holderName}`,
  ].join("\n");
}

export default function CashierRequestForm({
  activeTab,
  amount,
  note,
  amountLabel,
  withdrawPassword,
  onTabChange,
  onAmountChange,
  onNoteChange,
  onWithdrawPasswordChange,
  onSubmitRequest,
}: CashierRequestFormProps) {
  const isDeposit = activeTab === "deposit";
  const withdrawFields = readWithdrawFields(note);

  function updateWithdrawField(key: WithdrawFieldKey, value: string) {
    onNoteChange(
      buildWithdrawNote({
        ...withdrawFields,
        [key]: value,
      }),
    );
  }

  return (
    <form
      id="cashier-request-form"
      onSubmit={(event) => {
        event.preventDefault();
        void onSubmitRequest();
      }}
      className="relative mt-3 w-full min-w-0 overflow-hidden rounded-[1.35rem] border border-[#d6a84f]/38 bg-[linear-gradient(145deg,rgba(56,10,5,0.97),rgba(12,2,1,0.99),rgba(72,14,7,0.95))] p-3 shadow-[0_16px_40px_rgba(0,0,0,0.62),inset_0_1px_0_rgba(255,215,122,0.15)]"
    >
      <div className="pointer-events-none absolute inset-x-7 top-0 h-px bg-gradient-to-r from-transparent via-[#ffd77a]/72 to-transparent" />

      <input type="hidden" name="requestType" value={activeTab} />
      <input type="hidden" name="note" value={note} readOnly />

      <div className="relative grid w-full min-w-0 grid-cols-[repeat(2,minmax(0,1fr))] gap-1 rounded-[0.9rem] border border-[#d6a84f]/22 bg-black/24 p-1 shadow-inner shadow-black/55">
        <button
          type="button"
          onClick={() => onTabChange("deposit")}
          className={
            isDeposit
              ? "h-9 min-w-0 truncate rounded-[0.7rem] border border-[#ffd77a]/38 bg-[linear-gradient(180deg,#ffe6a3,#d59a32_58%,#7f3f08)] px-2 text-sm font-black text-[#2a1208] shadow-[0_4px_12px_rgba(86,45,12,0.42),inset_0_1px_1px_rgba(255,255,255,0.58)]"
              : "h-9 min-w-0 truncate rounded-[0.7rem] px-2 text-sm font-black text-[#f7dfaa]/44 active:scale-[0.99]"
          }
        >
          ငွေသွင်း
        </button>

        <button
          type="button"
          onClick={() => onTabChange("withdraw")}
          className={
            !isDeposit
              ? "h-9 min-w-0 truncate rounded-[0.7rem] border border-[#ffd77a]/38 bg-[linear-gradient(180deg,#ffe6a3,#d59a32_58%,#7f3f08)] px-2 text-sm font-black text-[#2a1208] shadow-[0_4px_12px_rgba(86,45,12,0.42),inset_0_1px_1px_rgba(255,255,255,0.58)]"
              : "h-9 min-w-0 truncate rounded-[0.7rem] px-2 text-sm font-black text-[#f7dfaa]/44 active:scale-[0.99]"
          }
        >
          ငွေထုတ်
        </button>
      </div>

      <div className="mt-3 rounded-[1rem] border border-[#d6a84f]/22 bg-[linear-gradient(145deg,rgba(18,4,2,0.78),rgba(0,0,0,0.34))] px-3 py-2.5 shadow-inner shadow-black/50">
        <p className="text-[10px] font-black tracking-[0.12em] text-[#d6a84f]/76">
          {isDeposit ? "ငွေသွင်းပမာဏ" : "ငွေထုတ်ပမာဏ"}
        </p>

        <div className="mt-1.5 flex items-end gap-2 border-b border-[#d6a84f]/24 pb-1.5">
          <span className="pb-0.5 text-xs font-black text-[#f7dfaa]/54">
            Ks
          </span>

          <input
            name="amount"
            value={amount}
            onChange={(event) => onAmountChange(event.target.value)}
            inputMode="numeric"
            className="min-w-0 flex-1 bg-transparent text-[1.3rem] font-black leading-none text-[#ffe6a3] outline-none placeholder:text-[#f7dfaa]/22"
            placeholder="10000"
          />

          <p className="max-w-[4.55rem] shrink-0 truncate pb-0.5 text-right text-[9px] font-bold text-[#f7dfaa]/48">
            {amountLabel} ကျပ်
          </p>
        </div>

        <div className="mt-2.5 grid grid-cols-[repeat(3,minmax(0,1fr))] gap-1">
          {[10000, 50000, 100000].map((quickAmount) => (
            <button
              key={quickAmount}
              type="button"
              onClick={() => onAmountChange(String(quickAmount))}
              className="h-8 min-w-0 truncate rounded-[0.65rem] border border-[#d6a84f]/28 bg-[linear-gradient(180deg,rgba(255,230,163,0.95),rgba(202,148,48,0.86))] px-0.5 text-[10px] font-black text-[#2a1208] shadow-[inset_0_1px_1px_rgba(255,255,255,0.55),0_2px_6px_rgba(0,0,0,0.28)] active:scale-[0.98]"
            >
              {formatMMK(quickAmount)}
            </button>
          ))}
        </div>
      </div>

      {isDeposit ? (
        <div className="mt-2.5 rounded-[1rem] border border-[#d6a84f]/22 bg-[linear-gradient(145deg,rgba(18,4,2,0.78),rgba(0,0,0,0.34))] px-3 py-2.5 shadow-inner shadow-black/50">
          <p className="text-[10px] font-black tracking-[0.12em] text-[#d6a84f]/76">
            လွှဲပြေစာ မှတ်ချက်
          </p>

          <textarea
            name="depositNote"
            value={note}
            onChange={(event) => onNoteChange(event.target.value)}
            rows={2}
            className="mt-1.5 h-[2.55rem] w-full resize-none rounded-[0.75rem] border border-[#d6a84f]/26 bg-black/24 px-3 py-1.5 text-sm font-bold leading-5 text-[#ffe6a3] outline-none placeholder:text-[#f7dfaa]/28 focus:border-[#ffd77a]/52 focus:ring-2 focus:ring-[#d6a84f]/18"
            placeholder="နောက်ဆုံးနံပါတ် 6လုံး"
          />
        </div>
      ) : (
        <div className="mt-2.5 rounded-[1rem] border border-[#d6a84f]/22 bg-[linear-gradient(145deg,rgba(18,4,2,0.78),rgba(0,0,0,0.34))] px-3 py-2.5 shadow-inner shadow-black/50">
          <p className="text-[10px] font-black tracking-[0.12em] text-[#d6a84f]/76">
            ငွေလက်ခံမည့် အချက်အလက်
          </p>

          <div className="mt-2 grid gap-2">
            <label className="block">
              <span className="text-[10px] font-black text-[#f7dfaa]/58">
                ငွေလက်ခံမည့် အမျိုးအစား
              </span>

              <select
                value={withdrawFields.paymentType}
                onChange={(event) =>
                  updateWithdrawField("paymentType", event.target.value)
                }
                className="mt-1 h-10 w-full rounded-[0.75rem] border border-[#d6a84f]/26 bg-black/38 px-3 text-sm font-black text-[#ffe6a3] outline-none focus:border-[#ffd77a]/52 focus:ring-2 focus:ring-[#d6a84f]/18"
              >
                <option value="">ရွေးပါ</option>
                {WITHDRAW_PAYMENT_TYPES.map((paymentType) => (
                  <option key={paymentType} value={paymentType}>
                    {paymentType}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-[10px] font-black text-[#f7dfaa]/58">
                အကောင့် / ဖုန်းနံပါတ်
              </span>

              <input
                value={withdrawFields.accountPhone}
                onChange={(event) =>
                  updateWithdrawField("accountPhone", event.target.value)
                }
                inputMode="tel"
                className="mt-1 h-10 w-full rounded-[0.75rem] border border-[#d6a84f]/26 bg-black/24 px-3 text-sm font-bold text-[#ffe6a3] outline-none placeholder:text-[#f7dfaa]/28 focus:border-[#ffd77a]/52 focus:ring-2 focus:ring-[#d6a84f]/18"
                placeholder="09xxxxxxxxx"
              />
            </label>

            <label className="block">
              <span className="text-[10px] font-black text-[#f7dfaa]/58">
                အကောင့်ပိုင်ရှင် အမည်
              </span>

              <input
                value={withdrawFields.holderName}
                onChange={(event) =>
                  updateWithdrawField("holderName", event.target.value)
                }
                className="mt-1 h-10 w-full rounded-[0.75rem] border border-[#d6a84f]/26 bg-black/24 px-3 text-sm font-bold text-[#ffe6a3] outline-none placeholder:text-[#f7dfaa]/28 focus:border-[#ffd77a]/52 focus:ring-2 focus:ring-[#d6a84f]/18"
                placeholder="ဥပမာ - Mg Mg"
              />
            </label>

            <label className="block">
              <span className="text-[10px] font-black text-[#f7dfaa]/58">
                အကောင့်စကားဝှက်
              </span>

              <input
                value={withdrawPassword}
                onChange={(event) =>
                  onWithdrawPasswordChange(event.target.value)
                }
                type="password"
                autoComplete="current-password"
                className="mt-1 h-10 w-full rounded-[0.75rem] border border-[#d6a84f]/26 bg-black/24 px-3 text-sm font-bold text-[#ffe6a3] outline-none placeholder:text-[#f7dfaa]/28 focus:border-[#ffd77a]/52 focus:ring-2 focus:ring-[#d6a84f]/18"
                placeholder="ငွေထုတ်ရန် စကားဝှက်ထည့်ပါ"
              />
            </label>
          </div>
        </div>
      )}
    </form>
  );
}