// src/app/layout.tsx

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
const APP_OG_IMAGE = "/assets/nagani/v2/poster.png";
const APP_ICON = "/assets/nagani/shared/logo/nagani-logo-concept-v1.png";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: "နဂါးနီရွှေအိုး | Official Website",
  description:
    "နဂါးနီရွှေအိုး တရားဝင်ဝက်ဘ်ဆိုက်။ မြန်မာရိုးရာဂိမ်းအငွေ့အသက်ကို တော်ဝင်မြန်မာစတိုင်ဖြင့် ဖန်တီးထားပါသည်။ သတ်မှတ်အသက်ပြည့်သူများအတွက်သာ · တာဝန်ယူကစားပါ။",
  keywords: [
    "နဂါးနီရွှေအိုး",
    "နဂါးနီ",
    "ရွှေအိုး",
    "Nagani Shwe Ohh",
    "Nagani",
    "Shwe Ohh",
    "naganishweohh",
    "Myanmar traditional game",
    "Myanmar royal game",
  ],
  alternates: {
    canonical: APP_URL,
  },
  manifest: "/manifest.webmanifest",
  applicationName: "နဂါးနီရွှေအိုး",
  appleWebApp: {
    capable: true,
    title: "နဂါးနီရွှေအိုး",
    statusBarStyle: "black-translucent",
  },
  icons: {
    icon: APP_ICON,
    shortcut: APP_ICON,
    apple: APP_ICON,
  },
  openGraph: {
    title: "နဂါးနီရွှေအိုး | Official Website",
    description:
      "နဂါးနီရွှေအိုး တရားဝင်ဝက်ဘ်ဆိုက်။ မြန်မာရိုးရာဂိမ်းအငွေ့အသက်ကို တော်ဝင်မြန်မာစတိုင်ဖြင့် ဖန်တီးထားပါသည်။",
    url: APP_URL,
    siteName: "နဂါးနီရွှေအိုး",
    type: "website",
    images: [
      {
        url: APP_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "နဂါးနီရွှေအိုး Official Website",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "နဂါးနီရွှေအိုး | Official Website",
    description:
      "မြန်မာရိုးရာဂိမ်းအငွေ့အသက်ကို တော်ဝင်မြန်မာစတိုင်ဖြင့် ဖန်တီးထားသော တရားဝင်ဝက်ဘ်ဆိုက်။",
    images: [APP_OG_IMAGE],
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