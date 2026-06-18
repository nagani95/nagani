// src/components/games/six-animal/SettlementPopup.tsx

"use client";

import type { SixAnimalKey } from "@/types/games";

type SettlementBet = {
  betType: "single" | "pair";
  animalKey: SixAnimalKey;
  animalKey2?: SixAnimalKey | null;
  amount: number;
  matchCount: number;
  payout: number;
};

type SettlementPopupProps = {
  settlementBets: SettlementBet[];
  totalBetAmount: number;
  displayPayoutAmount: number;
  netResultLabel: string;
  resultStatusLabel: string;
  isResultWin: boolean;
  animalAssets: Record<SixAnimalKey, string>;
};

function formatMMK(amount: number) {
  return new Intl.NumberFormat("en-US").format(amount);
}

export default function SettlementPopup({
  settlementBets,
  totalBetAmount,
  displayPayoutAmount,
  isResultWin,
}: SettlementPopupProps) {
  const matchedBetCount = settlementBets.filter((bet) =>
    bet.betType === "pair" ? bet.matchCount === 2 : bet.matchCount > 0
  ).length;

  const totalTicketCount = settlementBets.length;

  const statusTitle = isResultWin
    ? "အောင်မြင်ပါသည်"
    : "ယခုပွဲစဉ် ပြီးဆုံးပါပြီ";

  const statusSubTitle = isResultWin
    ? "ကိုက်သော လက်မှတ် တွေ့ရှိပါသည်"
    : "နောက်ပွဲစဉ်အတွက် ပြင်ဆင်နေသည်";

  return (
    <div className="nagani-settlement-board-shell pointer-events-none absolute inset-x-4 top-1/2 z-50 mx-auto max-w-[360px] -translate-y-1/2">
      <div className="nagani-settlement-board-bg relative overflow-hidden rounded-[1.55rem] border border-[#f7d277]/45 bg-[linear-gradient(145deg,#7a3515_0%,#3b1609_34%,#120403_58%,#8a3c18_100%)] p-[5px] shadow-[0_28px_76px_rgba(0,0,0,0.88),inset_0_1px_0_rgba(255,230,170,0.28)]">
        <div className="pointer-events-none absolute inset-0 opacity-45 bg-[linear-gradient(90deg,rgba(255,225,145,0.10)_0%,transparent_13%,rgba(0,0,0,0.20)_31%,transparent_54%,rgba(255,210,120,0.08)_73%,transparent_100%)]" />
        <div className="pointer-events-none absolute inset-[5px] rounded-[1.28rem] border border-[#6b3f16]/70 shadow-[inset_0_0_22px_rgba(0,0,0,0.72)]" />

        <div className="pointer-events-none absolute left-3 top-3 h-7 w-7 rounded-tl-[1rem] border-l-2 border-t-2 border-[#f7d277]/70" />
        <div className="pointer-events-none absolute right-3 top-3 h-7 w-7 rounded-tr-[1rem] border-r-2 border-t-2 border-[#f7d277]/70" />
        <div className="pointer-events-none absolute bottom-3 left-3 h-7 w-7 rounded-bl-[1rem] border-b-2 border-l-2 border-[#d6a84f]/60" />
        <div className="pointer-events-none absolute bottom-3 right-3 h-7 w-7 rounded-br-[1rem] border-b-2 border-r-2 border-[#d6a84f]/60" />

        <div className="nagani-settlement-lacquer-panel relative overflow-hidden rounded-[1.28rem] border border-[#f7d277]/28 bg-[radial-gradient(circle_at_50%_0%,rgba(255,215,122,0.16),transparent_42%),linear-gradient(160deg,rgba(82,18,9,0.98),rgba(22,5,4,0.98)_48%,rgba(92,20,10,0.96))] p-4 shadow-[inset_0_1px_0_rgba(255,230,170,0.16),inset_0_-18px_34px_rgba(0,0,0,0.36)]">
          <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#fff3d0]/75 to-transparent" />
          <div className="pointer-events-none absolute inset-x-10 bottom-0 h-px bg-gradient-to-r from-transparent via-[#d6a84f]/45 to-transparent" />

          <div className="nagani-settlement-board-content relative z-10">
            <div className="text-center">
              <p className="text-[8px] font-black uppercase tracking-[0.28em] text-[#f7d277]/62">
                Nagani Round Result
              </p>

              <h2 className="mt-2 text-[18px] font-black leading-tight text-[#fff3d0] drop-shadow-[0_2px_10px_rgba(0,0,0,0.55)]">
                {statusTitle}
              </h2>

              <p className="mt-1 text-[11px] font-bold text-[#fff3d0]/58">
                {statusSubTitle}
              </p>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2">
              <div className="rounded-2xl border border-[#d6a84f]/26 bg-[linear-gradient(160deg,rgba(26,7,4,0.82),rgba(68,20,9,0.52))] p-3 text-center shadow-[inset_0_1px_0_rgba(255,215,122,0.09),inset_0_-10px_18px_rgba(0,0,0,0.38)]">
                <p className="text-[8px] font-black tracking-[0.12em] text-[#fff3d0]/48">
                  လောင်းကြေး
                </p>
                <p className="mt-1 text-[13px] font-black text-white">
                  {formatMMK(totalBetAmount)}
                </p>
                <p className="mt-0.5 text-[7px] font-black uppercase tracking-[0.12em] text-[#fff3d0]/34">
                  MMK
                </p>
              </div>

              <div
                className={`rounded-2xl border p-3 text-center shadow-[inset_0_1px_0_rgba(255,215,122,0.1),inset_0_-10px_18px_rgba(0,0,0,0.38)] ${
                  isResultWin
                    ? "border-[#ffe3a1]/42 bg-[radial-gradient(circle_at_50%_0%,rgba(255,215,122,0.24),rgba(74,24,8,0.6)_52%,rgba(22,5,4,0.84))]"
                    : "border-[#d6a84f]/26 bg-[linear-gradient(160deg,rgba(26,7,4,0.82),rgba(68,20,9,0.52))]"
                }`}
              >
                <p className="text-[8px] font-black tracking-[0.12em] text-[#fff3d0]/48">
                  ရရှိငွေ
                </p>
                <p className="mt-1 text-[13px] font-black text-[#fff3d0]">
                  {formatMMK(displayPayoutAmount)}
                </p>
                <p className="mt-0.5 text-[7px] font-black uppercase tracking-[0.12em] text-[#fff3d0]/34">
                  MMK
                </p>
              </div>

              <div className="rounded-2xl border border-[#d6a84f]/26 bg-[linear-gradient(160deg,rgba(26,7,4,0.82),rgba(68,20,9,0.52))] p-3 text-center shadow-[inset_0_1px_0_rgba(255,215,122,0.09),inset_0_-10px_18px_rgba(0,0,0,0.38)]">
                <p className="text-[8px] font-black tracking-[0.12em] text-[#fff3d0]/48">
                  လက်မှတ်
                </p>
                <p className="mt-1 text-[13px] font-black text-white">
                  {matchedBetCount}/{totalTicketCount}
                </p>
                <p className="mt-0.5 text-[7px] font-black uppercase tracking-[0.12em] text-[#fff3d0]/34">
                  MATCH
                </p>
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-[#d6a84f]/24 bg-[linear-gradient(160deg,rgba(48,13,6,0.68),rgba(15,3,2,0.72))] px-4 py-2.5 text-center shadow-[inset_0_1px_0_rgba(255,215,122,0.08),inset_0_-8px_16px_rgba(0,0,0,0.3)]">
              <p className="text-[10px] font-bold text-[#fff3d0]/78">
                နောက်ပွဲစဉ်သို့ ဆက်လက်ပြင်ဆင်နေပါသည်
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}