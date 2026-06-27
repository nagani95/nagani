//src/app/robots.ts

import type { MetadataRoute } from "next";

const APP_URL = "https://naganishweohh.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/agent"],
    },
    sitemap: `${APP_URL}/sitemap.xml`,
  };
}