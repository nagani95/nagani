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

function WinCelebrationStickerEffect() {
  const sparkles = [
    ["left-[7%] top-[18%]", "0ms", "10px"],
    ["left-[18%] top-[6%]", "120ms", "7px"],
    ["right-[10%] top-[14%]", "80ms", "11px"],
    ["right-[22%] top-[3%]", "210ms", "8px"],
    ["left-[9%] bottom-[16%]", "260ms", "8px"],
    ["right-[8%] bottom-[20%]", "180ms", "9px"],
    ["left-[46%] -top-3", "40ms", "12px"],
    ["right-[44%] -bottom-2", "300ms", "7px"],
  ];

  return (
    <>
      <div className="pointer-events-none absolute -inset-x-8 -inset-y-10 z-20">
        <div className="nagani-win-aura absolute inset-0 rounded-[2rem]" />

        <div className="nagani-win-sticker absolute left-1/2 top-[-18px] -translate-x-1/2 rounded-full border border-[#fff3d0]/70 bg-[radial-gradient(circle_at_50%_18%,#fff3d0_0%,#f7d277_32%,#b66b20_72%,#5a1808_100%)] px-5 py-2 text-[13px] font-black tracking-[0.16em] text-[#4b1607] shadow-[0_14px_34px_rgba(0,0,0,0.62),0_0_28px_rgba(247,210,119,0.55)]">
          နိုင်ပြီ
        </div>

        {sparkles.map(([positionClass, delay, size], index) => (
          <span
            key={`${positionClass}-${index}`}
            className={`nagani-win-spark absolute ${positionClass}`}
            style={{
              animationDelay: delay,
              height: size,
              width: size,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes naganiWinAura {
          0% {
            opacity: 0;
            transform: scale(0.82);
            box-shadow: 0 0 0 rgba(247, 210, 119, 0);
          }
          22% {
            opacity: 1;
            transform: scale(1.04);
            box-shadow: 0 0 46px rgba(247, 210, 119, 0.42);
          }
          100% {
            opacity: 0.38;
            transform: scale(1);
            box-shadow: 0 0 24px rgba(247, 210, 119, 0.22);
          }
        }

        @keyframes naganiWinSticker {
          0% {
            opacity: 0;
            transform: translateX(-50%) translateY(12px) scale(0.72) rotate(-8deg);
          }
          48% {
            opacity: 1;
            transform: translateX(-50%) translateY(0) scale(1.12) rotate(4deg);
          }
          72% {
            transform: translateX(-50%) translateY(0) scale(0.96) rotate(-2deg);
          }
          100% {
            opacity: 1;
            transform: translateX(-50%) translateY(0) scale(1) rotate(0deg);
          }
        }

        @keyframes naganiWinSpark {
          0% {
            opacity: 0;
            transform: translateY(10px) scale(0.25) rotate(0deg);
          }
          38% {
            opacity: 1;
            transform: translateY(-8px) scale(1.2) rotate(120deg);
          }
          100% {
            opacity: 0;
            transform: translateY(-28px) scale(0.35) rotate(220deg);
          }
        }

        .nagani-win-aura {
          animation: naganiWinAura 1.7s ease-out both;
          background:
            radial-gradient(circle at 50% 42%, rgba(255, 243, 208, 0.16), transparent 38%),
            radial-gradient(circle at 50% 50%, rgba(247, 210, 119, 0.20), transparent 58%);
        }

        .nagani-win-sticker {
          animation: naganiWinSticker 1.15s cubic-bezier(0.2, 0.9, 0.22, 1.15) both;
        }

        .nagani-win-spark {
          animation: naganiWinSpark 1.35s ease-out both;
          background: radial-gradient(circle, #fff8d8 0%, #f7d277 38%, #b66b20 72%, transparent 74%);
          border-radius: 9999px;
          box-shadow: 0 0 16px rgba(247, 210, 119, 0.82);
        }
      `}</style>
    </>
  );
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
      {isResultWin ? <WinCelebrationStickerEffect /> : null}
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
<p className="text-[8px] font-black tracking-[0.24em] text-[#f7d277]/62">
  နဂါးနီ ပွဲရလဒ်
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
                  ကျပ်
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
                  ကိုက်ညီ
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