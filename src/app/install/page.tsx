//src/app/install/page.tsx

// src/app/install/page.tsx

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "ဖုန်းထဲသိမ်းနည်း | နဂါးနီရွှေအိုး",
  description:
    "နဂါးနီရွှေအိုးကို Android နှင့် iPhone home screen ပေါ်တွင် သိမ်းထားနည်း။",
};

const androidSteps = [
  "Chrome browser ဖြင့် naganishweohh.com ကို ဖွင့်ပါ",
  "ညာဘက်အပေါ်ထောင့် ⋮ menu ကို နှိပ်ပါ",
  "Add to Home screen ကို နှိပ်ပါ",
  "Add / Install ကို အတည်ပြုပါ",
];

const iphoneSteps = [
  "Safari browser ဖြင့် naganishweohh.com ကို ဖွင့်ပါ",
  "အောက်ဘက် Share ခလုတ်ကို နှိပ်ပါ",
  "Add to Home Screen ကို ရွေးပါ",
  "Add ကို နှိပ်ပြီး သိမ်းပါ",
];

function StepList({
  title,
  steps,
}: {
  title: string;
  steps: string[];
}) {
  return (
    <div className="rounded-3xl border border-[#ffd77a]/24 bg-[#190303] p-4 shadow-[0_14px_34px_rgba(0,0,0,0.42)]">
      <h2 className="text-lg font-black text-[#ffd77a]">{title}</h2>

      <div className="mt-4 space-y-3">
        {steps.map((step, index) => (
          <div
            key={step}
            className="flex gap-3 rounded-2xl border border-[#ffd77a]/14 bg-black/28 p-3"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#ffd77a]/45 bg-[#7a1111] text-sm font-black text-[#ffd77a]">
              {index + 1}
            </div>

            <p className="pt-1 text-sm font-bold leading-6 text-[#fff3d0]/82">
              {step}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function InstallPage() {
  return (
    <main className="min-h-screen bg-[#090202] px-4 py-5 text-[#fff3d0]">
      <div className="mx-auto max-w-[430px] pb-16">
        <header className="flex items-center justify-between">
          <Link
            href="/start"
            className="rounded-full border border-[#ffd77a]/32 bg-black/36 px-4 py-2 text-xs font-black text-[#ffd77a]"
          >
            ← ပြန်သွားမယ်
          </Link>

          <div className="rounded-full border border-[#ffd77a]/32 bg-[#260606] px-3 py-2 text-[0.65rem] font-black tracking-[0.12em] text-[#ffd77a]">
            OFFICIAL
          </div>
        </header>

        <section className="mt-8 text-center">
          <div className="mx-auto h-24 w-24 rounded-[1.6rem] bg-[url('/assets/nagani/shared/logo/nagani-logo-concept-v1.png')] bg-cover bg-center shadow-[0_18px_34px_rgba(0,0,0,0.6)] ring-1 ring-[#ffd77a]/36" />

          <h1 className="mt-5 text-2xl font-black leading-[1.35] text-[#ffd77a]">
            ဖုန်းထဲသိမ်းထားပြီး
            <br />
            နောက်တစ်ကြိမ် အလွယ်တကူ ဝင်ပါ
          </h1>

          <p className="mx-auto mt-4 max-w-[21rem] text-sm font-semibold leading-7 text-[#fff3d0]/76">
            App Store / Play Store မလိုပါ။ Website ကို phone home screen ပေါ်တွင်
            icon အဖြစ် သိမ်းထားနိုင်သည်။
          </p>
        </section>

        <section className="mt-7 space-y-4">
          <StepList title="Android သိမ်းနည်း" steps={androidSteps} />
          <StepList title="iPhone သိမ်းနည်း" steps={iphoneSteps} />
        </section>

        <section className="mt-5 rounded-3xl border border-[#ffd77a]/24 bg-black/34 p-4 text-center">
          <p className="text-[0.72rem] font-black tracking-[0.08em] text-[#ffd77a]">
            တရားဝင် Website
          </p>

          <p className="mt-1 text-base font-black text-[#fff3d0]">
            naganishweohh.com
          </p>

          <p className="mt-2 text-xs font-semibold leading-5 text-[#f7dfaa]/62">
            အခြား link များကို သတိပြုပါ။ Nagani ကို တရားဝင် domain မှသာ
            ဝင်ရောက်ပါ။
          </p>
        </section>

        <Link
          href="/login"
          className="mt-6 block rounded-full border border-[#ffd77a]/65 bg-gradient-to-b from-[#d93a2b] via-[#941313] to-[#3a0707] px-6 py-4 text-center text-base font-black text-[#fff3d0] shadow-[0_18px_38px_rgba(0,0,0,0.58)] active:scale-[0.98]"
        >
          ယခုပဲ စတင်မယ်
        </Link>
      </div>
    </main>
  );
}