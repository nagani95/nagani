// src/components/games/six-animal/SixAnimalExitConfirm.tsx

type SixAnimalExitConfirmProps = {
  exitDoorAsset: string;
  onStayClick: () => void;
  onLeaveClick: () => void;
};

export default function SixAnimalExitConfirm({
  exitDoorAsset,
  onStayClick,
  onLeaveClick,
}: SixAnimalExitConfirmProps) {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[radial-gradient(circle_at_50%_22%,rgba(120,39,8,0.42),rgba(0,0,0,0.82)_58%,rgba(0,0,0,0.92))] px-5 backdrop-blur-[5px]">
      <div className="relative w-full max-w-[342px] overflow-hidden rounded-[2rem] border border-[#ffd77a]/30 bg-[linear-gradient(145deg,rgba(83,24,7,0.94),rgba(24,5,2,0.98)_44%,rgba(8,1,1,0.96))] p-[1px] shadow-[0_24px_60px_rgba(0,0,0,0.82),0_0_28px_rgba(214,168,79,0.12)]">
        <div className="relative overflow-hidden rounded-[1.95rem] border border-black/45 bg-[linear-gradient(180deg,rgba(255,215,122,0.08),rgba(43,9,3,0.68)_18%,rgba(7,1,1,0.92)_100%)] px-5 pb-5 pt-4 text-center">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,215,122,0.22),transparent_54%)]" />
          <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#fff3d0]/90 to-transparent" />
          <div className="pointer-events-none absolute inset-x-12 bottom-0 h-px bg-gradient-to-r from-transparent via-[#d6a84f]/55 to-transparent" />

          <div className="pointer-events-none absolute left-4 top-4 h-7 w-7 rounded-full border-l border-t border-[#ffd77a]/22" />
          <div className="pointer-events-none absolute right-4 top-4 h-7 w-7 rounded-full border-r border-t border-[#ffd77a]/22" />
          <div className="pointer-events-none absolute bottom-4 left-4 h-7 w-7 rounded-full border-b border-l border-[#ffd77a]/18" />
          <div className="pointer-events-none absolute bottom-4 right-4 h-7 w-7 rounded-full border-b border-r border-[#ffd77a]/18" />

          <div className="relative z-10">
            <div className="mx-auto flex h-[94px] w-[112px] items-center justify-center overflow-visible rounded-full bg-[radial-gradient(circle,rgba(255,215,122,0.18),transparent_66%)]">
              <img
                src={exitDoorAsset}
                alt=""
                className="h-[98px] w-[98px] max-w-none object-contain drop-shadow-[0_0_20px_rgba(255,215,122,0.42)]"
              />
            </div>

            <div className="mx-auto mt-1 h-px w-28 bg-gradient-to-r from-transparent via-[#d6a84f]/70 to-transparent" />

<p className="mt-4 text-[9px] font-black tracking-[0.24em] text-[#ffd77a]/62">
  နဂါးနီ ကစားခန်း
</p>

            <p className="mt-2 text-[20px] font-black leading-7 text-[#fff3d0] drop-shadow-[0_2px_8px_rgba(0,0,0,0.72)]">
              ကစားခန်းမှ ထွက်မလား?
            </p>

            <p className="mx-auto mt-2 max-w-[250px] text-[12px] font-bold leading-5 text-[#f7dfaa]/62">
              လောင်းထားသော ကြေးများ ဆက်ရှိနေပါမည်။ ပင်မစာမျက်နှာသို့ ပြန်နိုင်သည်။
            </p>

            <div className="mt-5 grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={onStayClick}
                className="min-h-[46px] rounded-2xl border border-[#ffd77a]/22 bg-[linear-gradient(180deg,rgba(255,215,122,0.08),rgba(0,0,0,0.38))] px-4 py-3 text-[13px] font-black text-[#fff3d0] shadow-[inset_0_1px_0_rgba(255,215,122,0.08)] transition active:scale-[0.96]"
              >
                ဆက်နေမည်
              </button>

              <button
                type="button"
                onClick={onLeaveClick}
                className="min-h-[46px] rounded-2xl border border-[#fff3d0]/55 bg-[linear-gradient(135deg,#fff3d0,#ffd77a_32%,#d6a84f_62%,#8f6422)] px-4 py-3 text-[13px] font-black text-[#170701] shadow-[0_0_18px_rgba(255,215,122,0.18),inset_0_1px_0_rgba(255,255,255,0.38)] transition active:scale-[0.96]"
              >
                ထွက်မည်
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}