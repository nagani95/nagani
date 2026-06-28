// src/app/manifest.ts

import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "နဂါးနီရွှေအိုး",
    short_name: "Nagani",
    description:
      "မြန်မာရိုးရာ အန်စာတုံးပွဲ အတွေ့အကြုံကို ဖုန်း browser မှ အလွယ်တကူ ဝင်ကြည့်နိုင်သည်။",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#090202",
    theme_color: "#2d0703",
    orientation: "portrait",
    lang: "my",
    categories: ["games", "entertainment"],
    icons: [
      {
        src: "/assets/nagani/shared/logo/nagani-logo-concept-v1.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}