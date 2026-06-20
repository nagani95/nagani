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
  title: "ရွှေအိုး | Nagani",
  description:
    "Premium Myanmar traditional games platform",
  alternates: {
    canonical: APP_URL,
  },
  openGraph: {
    title: "ရွှေအိုး | Nagani",
    description:
      "Premium Myanmar traditional games platform",
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
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[#090202] text-white">{children}</body>
    </html>
  );
}