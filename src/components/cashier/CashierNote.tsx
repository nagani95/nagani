// src/components/cashier/CashierNote.tsx

export default function CashierNote() {
  return (
    <section className="mt-6 rounded-[2rem] border border-[#d6a84f]/18 bg-black/25 p-4">
      <div>
        <p className="text-xs font-semibold text-[#f7dfaa]/60">
          မှတ်ချက်
        </p>
        <h3 className="mt-2 text-lg font-black text-[#ffd77a]">
          ငွေကြေးတင်သွင်းမှု လမ်းညွှန်
        </h3>
      </div>

      <div className="mt-4 space-y-3 text-sm leading-6 text-[#fff3d0]/65">
        <p>၁။ ငွေသွင်း သို့မဟုတ် ငွေထုတ် ပမာဏကို ရေးပါ။</p>
        <p>၂။ လိုအပ်သော မှတ်ချက်ကို ထည့်ပါ။</p>
        <p>၃။ တင်ပြီးပါက စောင့်ဆိုင်းနေသည် အခြေအနေဖြင့် ပြပါမည်။</p>
        <p>၄။ အတည်ပြုပြီးပါက လက်ကျန်ငွေ ပြောင်းလဲပါမည်။</p>
      </div>

      <p className="mt-4 rounded-2xl border border-[#d6a84f]/12 bg-black/25 p-3 text-xs leading-5 text-[#f7dfaa]/45">
        တင်သွင်းမီ ပမာဏနှင့် မှတ်ချက်ကို ပြန်စစ်ပါ။
      </p>
    </section>
  );
}