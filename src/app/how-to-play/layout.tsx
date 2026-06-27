//src/app/how-to-play/layout.tsx

import type { Metadata } from "next";
import type { ReactNode } from "react";

const APP_URL = "https://naganishweohh.com";
const PAGE_URL = `${APP_URL}/how-to-play`;

export const metadata: Metadata = {
  title:
    "နဂါးနီရွှေအိုး | မြန်မာရိုးရာ အံစာတုံးပွဲတော်ဂိမ်း | How to Play",
  description:
    "နဂါးနီရွှေအိုး မြန်မာရိုးရာ အံစာတုံးပွဲတော်ဂိမ်း အကြောင်း။ ကျား၊ နဂါး၊ ကြက်၊ ငါး၊ ဂဏန်း၊ ဆင် တို့ပါဝင်သော Myanmar Traditional Dice Festival Game.",
  keywords: [
    "နဂါးနီရွှေအိုး",
    "မြန်မာရိုးရာ အံစာတုံးပွဲတော်ဂိမ်း",
    "မြန်မာ အံစာတုံးပွဲတော်",
    "မြန်မာ အံစာတုံး",
    "၆ ကောင်ဂျင်",
    "ခြောက်ကောင်ဂျင်",
    "ကျား နဂါး ကြက် ငါး ဂဏန်း ဆင်",
    "Nagani Shwe Ohh",
    "naganishweohh",
    "Myanmar Traditional Dice Festival Game",
    "Myanmar dice game",
    "Myanmar Six Animal Dice Game",
    "Burmese 6 Animals",
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title:
      "နဂါးနီရွှေအိုး | မြန်မာရိုးရာ အံစာတုံးပွဲတော်ဂိမ်း",
    description:
      "တော်ဝင်မြန်မာစတိုင်ဖြင့် ဖန်တီးထားသော Myanmar Traditional Dice Festival Game.",
    url: PAGE_URL,
    siteName: "နဂါးနီရွှေအိုး",
    type: "website",
  },
};

export default function HowToPlayLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}