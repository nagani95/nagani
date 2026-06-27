//src/app/six-animal/layout.tsx

import type { Metadata } from "next";
import type { ReactNode } from "react";

const APP_URL = "https://naganishweohh.com";
const PAGE_URL = `${APP_URL}/six-animal`;

export const metadata: Metadata = {
  title:
    "မြန်မာရိုးရာ အံစာတုံးပွဲတော်ဂိမ်း | နဂါးနီရွှေအိုး | Nagani Shwe Ohh",
  description:
    "နဂါးနီရွှေအိုး အံစာတုံးပွဲတော်ဂိမ်းသည် ကျား၊ နဂါး၊ ကြက်၊ ငါး၊ ဂဏန်း၊ ဆင် တို့ပါဝင်သော မြန်မာရိုးရာဂိမ်း အငွေ့အသက်ဖြင့် ဖန်တီးထားသည်။ လူအများသိသော ၆ ကောင်ဂျင် / ခြောက်ကောင်ဂျင် စတိုင်ကို တော်ဝင်မြန်မာပုံစံဖြင့် ခံစားနိုင်ပါသည်။",
  keywords: [
    "မြန်မာရိုးရာ အံစာတုံးပွဲတော်ဂိမ်း",
    "မြန်မာ အံစာတုံးပွဲတော်",
    "မြန်မာ အံစာတုံး",
    "မြန်မာရိုးရာ အံစာတုံးဂိမ်း",
    "နဂါးနီရွှေအိုး",
    "နဂါးနီ",
    "ရွှေအိုး",
    "ကျား နဂါး ကြက် ငါး ဂဏန်း ဆင်",
    "၆ ကောင်ဂျင်",
    "ခြောက်ကောင်ဂျင်",
    "မြန်မာ ၆ ကောင်ဂျင်",
    "Nagani Shwe Ohh",
    "naganishweohh",
    "Myanmar traditional dice festival game",
    "Myanmar dice festival game",
    "Myanmar traditional dice game",
    "Myanmar Six Animal Dice Game",
    "Burmese 6 Animals",
    "Burmese six animal dice game",
    "six animal dice game",
    "Tiger Dragon Rooster Fish Crab Elephant dice game",
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title:
      "မြန်မာရိုးရာ အံစာတုံးပွဲတော်ဂိမ်း | နဂါးနီရွှေအိုး",
    description:
      "ကျား၊ နဂါး၊ ကြက်၊ ငါး၊ ဂဏန်း၊ ဆင် တို့ပါဝင်သော တော်ဝင်မြန်မာစတိုင် အံစာတုံးပွဲတော်ဂိမ်း။",
    url: PAGE_URL,
    siteName: "နဂါးနီရွှေအိုး",
    type: "website",
  },
};

export default function SixAnimalLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}