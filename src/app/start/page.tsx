//src/app/start/page.tsx

import type { Metadata } from "next";
import Link from "next/link";

import { naganiAssets } from "@/lib/naganiAssets";
import NaganiInstallPrompt from "@/components/nagani-v2/NaganiInstallPrompt";

export const metadata: Metadata = {
  title: "နဂါးနီရွှေအိုး | မြန်မာရိုးရာ အန်စာတုံးပွဲ အတွေ့အကြုံ",
description:
  "မြန်မာရိုးရာ အန်စာတုံးပွဲ အတွေ့အကြုံကို ဖုန်းပေါ်မှ ယခုပဲ ဝင်ကြည့်နိုင်သည်။",
};

const features = [
  {
    title: "ရိုးရာပွဲတော်ပုံစံ",
    body: "မြန်မာရိုးရာ ၆ ကောင် အန်စာတုံးပွဲ အတွေ့အကြုံကို ဖုန်းပေါ်တွင် ခံစားနိုင်သည်။",
  },
  {
    title: "ချက်ချင်းဝင်နိုင်",
    body: "စတင်ရန် ခလုတ်နှိပ်ကာ အလွယ်တကူ ဝင်နိုင်သည်။",
  },
  {
    title: "ဖုန်းထဲသိမ်းနိုင်",
    body: "နောက်တစ်ကြိမ် အလွယ်တကူ ဝင်ရန် home screen shortcut အဖြစ် သိမ်းထားနိုင်သည်။",
  },
];

const steps = [
  "Website ကို ဖွင့်ပါ",
  "ဖုန်းနံပါတ်ဖြင့် အကောင့်ဝင်ပါ",
  "ရိုးရာအန်စာတုံးပွဲခန်းကို ဝင်ကြည့်ပါ",
];

export default function StartPage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#120302] text-[#fff3d0]">
  <NaganiInstallPrompt />
      <section className="relative min-h-[100svh] overflow-hidden px-4 pb-8 pt-5">
        <video
          className="absolute inset-0 h-full w-full object-cover opacity-75"
          src="/assets/nagani/v2/home-palace-loop.mp4"
          poster="/assets/nagani/v2/home-palace-poster.png"
          autoPlay
          muted
          loop
          playsInline
        />

        <div className="absolute inset-0 bg-gradient-to-b from-black/62 via-[#210404]/44 to-[#070101]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_34%,rgba(255,215,122,0.24),transparent_42%)]" />

        <div className="relative z-10 mx-auto flex min-h-[calc(100svh-3.25rem)] w-full max-w-[430px] flex-col">
          <header className="flex items-center justify-between">
            <div className="rounded-full border border-[#ffd77a]/35 bg-black/42 px-3 py-1 text-[0.62rem] font-black tracking-[0.12em] text-[#ffd77a]">
              OFFICIAL
            </div>

<Link
  href="/login"
  className="rounded-full border border-[#ffd77a]/35 bg-[#260606]/68 px-3 py-1 text-[0.7rem] font-bold text-[#fff3d0]"
>
  ဝင်မယ်
</Link>
          </header>

          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <div
              className="h-36 w-36 bg-contain bg-center bg-no-repeat drop-shadow-[0_18px_34px_rgba(0,0,0,0.85)]"
              style={{
                backgroundImage: `url(${naganiAssets.shared.logo.conceptV1})`,
              }}
              aria-label="နဂါးနီရွှေအိုး"
            />

            <div className="-mt-3 rounded-full border border-[#ffd77a]/35 bg-black/48 px-5 py-1 text-sm font-black tracking-[0.14em] text-[#ffd77a] shadow-lg shadow-black/60">
              နဂါးနီရွှေအိုး
            </div>

            <h1 className="mt-8 text-2xl font-black leading-[1.35] tracking-[0.02em] text-[#ffd77a] drop-shadow-[0_4px_10px_rgba(0,0,0,0.9)]">
              မြန်မာရိုးရာ
              <br />
              အန်စာတုံးပွဲ အတွေ့အကြုံ
            </h1>

            <p className="mt-4 max-w-[20rem] text-sm font-bold leading-7 text-[#fff3d0]/86 drop-shadow-[0_3px_8px_rgba(0,0,0,0.9)]">
မြန်မာရိုးရာ အန်စာတုံးပွဲ အငွေ့အသက်ကို ဖုန်းပေါ်မှ ယခုပဲ ပါဝင်နိုင်သည်။
            </p>

            <div className="mt-7 flex w-full flex-col gap-3 px-3">
              <Link
                href="/login"
                className="rounded-full border border-[#ffd77a]/70 bg-gradient-to-b from-[#d93a2b] via-[#941313] to-[#3a0707] px-6 py-4 text-base font-black text-[#fff3d0] shadow-[0_18px_38px_rgba(0,0,0,0.66),0_0_26px_rgba(255,215,122,0.28)] active:scale-[0.98]"
              >
                ယခုပဲ စတင်မယ်
              </Link>

<Link
  href="#about"
  className="rounded-full border border-[#ffd77a]/38 bg-black/48 px-6 py-3 text-sm font-black text-[#ffd77a] active:scale-[0.98]"
>
  ပွဲအကြောင်း ကြည့်မယ်
</Link>
            </div>
          </div>

          <div className="rounded-3xl border border-[#ffd77a]/24 bg-black/44 p-4 text-center shadow-[0_18px_40px_rgba(0,0,0,0.52)]">
            <p className="text-[0.72rem] font-black tracking-[0.08em] text-[#ffd77a]">
              တရားဝင် Website
            </p>
            <p className="mt-1 text-sm font-black text-[#fff3d0]">
              naganishweohh.com
            </p>
            <p className="mt-1 text-[0.65rem] font-semibold leading-4 text-[#f7dfaa]/62">
              အခြား link များကို သတိပြုပါ
            </p>
          </div>
        </div>
      </section>

      <section id="about" className="mx-auto max-w-[430px] px-4 pb-24">
        <div className="space-y-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-3xl border border-[#ffd77a]/22 bg-[#220505] p-4 shadow-[0_12px_28px_rgba(0,0,0,0.36)]"
            >
              <h2 className="text-base font-black text-[#ffd77a]">
                {feature.title}
              </h2>
              <p className="mt-2 text-sm font-semibold leading-6 text-[#fff3d0]/76">
                {feature.body}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-5 rounded-3xl border border-[#ffd77a]/22 bg-[#190303] p-4">
          <h2 className="text-center text-lg font-black text-[#ffd77a]">
            စတင်ရန် အဆင့် ၃ ဆင့်
          </h2>

          <div className="mt-4 space-y-3">
            {steps.map((step, index) => (
              <div
                key={step}
                className="flex items-center gap-3 rounded-2xl border border-[#ffd77a]/16 bg-black/28 p-3"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#ffd77a]/45 bg-[#6f1111] text-sm font-black text-[#ffd77a]">
                  {index + 1}
                </div>
                <p className="text-sm font-bold text-[#fff3d0]/82">{step}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5 rounded-3xl border border-[#ffd77a]/24 bg-gradient-to-b from-[#2a0606] to-[#0d0101] p-4 text-center">
          <div
            className="mx-auto h-20 w-20 rounded-2xl bg-cover bg-center shadow-[0_0_24px_rgba(255,215,122,0.25)] ring-1 ring-[#ffd77a]/40"
            style={{
              backgroundImage: "url('/assets/nagani/v2/dice.jpg')",
            }}
            aria-hidden="true"
          />

          <h2 className="mt-4 text-lg font-black text-[#ffd77a]">
            ၆ ကောင် အန်စာတုံးပွဲခန်း
          </h2>

          <p className="mt-2 text-sm font-semibold leading-6 text-[#fff3d0]/76">
            မြန်မာရိုးရာ အလှတရား၊ နန်းတော်ပတ်ဝန်းကျင်နှင့် festival dice
            simulation ပုံစံဖြင့် ဖန်တီးထားသည်။
          </p>

          <Link
            href="/login"
            className="mt-5 block rounded-full border border-[#ffd77a]/60 bg-[#8f1515] px-6 py-3 text-sm font-black text-[#fff3d0] active:scale-[0.98]"
          >
            အကောင့်ဝင်ပြီး စတင်မယ်
          </Link>
        </div>

        <div className="mt-5 rounded-3xl border border-[#ffd77a]/22 bg-black/34 p-4 text-center">
          <h2 className="text-base font-black text-[#ffd77a]">
            နောက်တစ်ကြိမ် အလွယ်တကူ ဝင်ရန်
          </h2>

          <p className="mt-2 text-sm font-semibold leading-6 text-[#fff3d0]/74">
            Nagani ကို ဖုန်း home screen ပေါ်တွင် icon အဖြစ် သိမ်းထားနိုင်သည်။
          </p>

          <Link
            href="/install"
            className="mt-4 inline-flex rounded-full border border-[#ffd77a]/40 px-5 py-2 text-sm font-black text-[#ffd77a]"
          >
            သိမ်းနည်းကြည့်မယ်
          </Link>
        </div>

        <p className="mt-6 text-center text-[0.62rem] font-semibold leading-5 text-[#f7dfaa]/54">
          မြန်မာရိုးရာ အန်စာတုံးပွဲ အတွေ့အကြုံ · အသက် ၁၈ နှစ်အထက်များအတွက်သာ ·
          တာဝန်ရှိစွာ အသုံးပြုပါ
        </p>
      </section>
    </main>
  );
}