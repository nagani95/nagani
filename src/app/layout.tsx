//src>app>layout.tsx

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const APP_URL = "https://naganishweohh.com";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title:
    "နဂါးနီရွှေအိုး | မြန်မာရိုးရာ အံစာတုံးပွဲတော်ဂိမ်း | Nagani Shwe Ohh",
  description:
    "နဂါးနီရွှေအိုး သည် ကျား၊ နဂါး၊ ကြက်၊ ငါး၊ ဂဏန်း၊ ဆင် တို့ပါဝင်သော မြန်မာရိုးရာ အံစာတုံးပွဲတော်ဂိမ်း ဖြစ်ပါသည်။ လူအများသိသော ၆ ကောင်ဂျင် အငွေ့အသက်ကို တော်ဝင်မြန်မာစတိုင်ဖြင့် ဖန်တီးထားသည်။ Nagani Shwe Ohh, naganishweohh, Myanmar Traditional Dice Festival Game.",
  keywords: [
    "နဂါးနီရွှေအိုး",
    "နဂါးနီ",
    "ရွှေအိုး",
    "မြန်မာရိုးရာ အံစာတုံးပွဲတော်ဂိမ်း",
    "မြန်မာ အံစာတုံးပွဲတော်",
    "မြန်မာ အံစာတုံး",
    "မြန်မာရိုးရာ အံစာတုံးဂိမ်း",
    "မြန်မာရိုးရာ ဂိမ်း",
    "ကျား နဂါး ကြက် ငါး ဂဏန်း ဆင်",
    "၆ ကောင်ဂျင်",
    "ခြောက်ကောင်ဂျင်",
    "မြန်မာ ၆ ကောင်ဂျင်",
    "Nagani Shwe Ohh",
    "Nagani",
    "Shwe Ohh",
    "naganishweohh",
    "nagani shweohh",
    "nagani shwe ohh",
    "Myanmar dice festival game",
    "Myanmar traditional dice festival game",
    "Myanmar traditional dice game",
    "Myanmar six animal dice game",
    "Burmese 6 Animals",
    "Burmese six animal dice game",
    "six animal dice game",
  ],
  alternates: {
    canonical: APP_URL,
  },
  openGraph: {
    title:
      "နဂါးနီရွှေအိုး | မြန်မာရိုးရာ အံစာတုံးပွဲတော်ဂိမ်း | Nagani Shwe Ohh",
    description:
      "ကျား၊ နဂါး၊ ကြက်၊ ငါး၊ ဂဏန်း၊ ဆင် တို့ပါဝင်သော မြန်မာရိုးရာ အံစာတုံးပွဲတော်ဂိမ်း။ Nagani Shwe Ohh.",
    url: APP_URL,
    siteName: "နဂါးနီရွှေအိုး",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
<html
  lang="my"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[#090202] text-white">{children}</body>
    </html>
  );
}