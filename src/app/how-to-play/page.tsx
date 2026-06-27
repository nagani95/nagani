//src/app/how-to-play/page.tsx

import Link from "next/link";

export default function HowToPlayPage() {
  return (
    <main className="min-h-screen bg-[#090202] px-5 py-10 text-[#fff3d0]">
      <section className="mx-auto max-w-2xl rounded-[2rem] border border-[#c8922f]/35 bg-[#170706] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.55)]">
        <p className="text-sm font-bold tracking-[0.16em] text-[#f7dfaa]/65">
          NAGANI SHWE OHH
        </p>

        <h1 className="mt-3 text-2xl font-black leading-10 text-[#ffd77a]">
          နဂါးနီရွှေအိုး မြန်မာရိုးရာ အံစာတုံးပွဲတော်ဂိမ်း
        </h1>

        <p className="mt-4 text-base font-semibold leading-8 text-[#fff3d0]/82">
          နဂါးနီရွှေအိုး သည် ကျား၊ နဂါး၊ ကြက်၊ ငါး၊ ဂဏန်း၊ ဆင်
          တို့ပါဝင်သော မြန်မာရိုးရာ အံစာတုံးပွဲတော်ဂိမ်း အငွေ့အသက်ဖြင့်
          ဖန်တီးထားသော မိုဘိုင်းဂိမ်း ဖြစ်ပါသည်။
        </p>

        <p className="mt-4 text-sm leading-7 text-[#f7dfaa]/68">
          လူအများသိသော ၆ ကောင်ဂျင် / ခြောက်ကောင်ဂျင် စတိုင်ကို
          တော်ဝင်မြန်မာအလှ၊ အနီရောင်ကော်ဇော၊ ရွှေရောင်ကနုတ်၊
          အံစာတုံးသုံးလုံး နှင့် ရိုးရာပွဲတော်ခံစားမှုများဖြင့်
          ပြန်လည်ဖန်တီးထားပါသည်။
        </p>

        <div className="mt-6 rounded-2xl border border-[#d6a84f]/25 bg-black/30 p-4">
          <h2 className="text-lg font-black text-[#ffd77a]">
            ပါဝင်သော သင်္ကေတများ
          </h2>

          <p className="mt-3 text-sm font-semibold leading-7 text-[#fff3d0]/78">
            ကျား၊ နဂါး၊ ကြက်၊ ငါး၊ ဂဏန်း၊ ဆင် — animal symbols used in a
            Myanmar traditional dice festival game style.
          </p>
        </div>

        <div className="mt-6 rounded-2xl border border-[#d6a84f]/25 bg-black/30 p-4">
          <h2 className="text-lg font-black text-[#ffd77a]">
            English Search Keywords
          </h2>

          <p className="mt-3 text-sm leading-7 text-[#f7dfaa]/70">
            Nagani Shwe Ohh, naganishweohh, Myanmar Traditional Dice Festival
            Game, Myanmar dice game, Myanmar Six Animal Dice Game, Burmese 6
            Animals.
          </p>
        </div>

        <Link
          href="/"
          className="mt-7 block rounded-full border border-[#ffd77a]/55 bg-gradient-to-b from-[#d93a2b] via-[#941313] to-[#3a0707] px-6 py-4 text-center font-black text-[#fff3d0] shadow-lg"
        >
          မူလစာမျက်နှာသို့
        </Link>
      </section>
    </main>
  );
}