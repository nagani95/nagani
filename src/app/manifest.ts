//src>app>manifest.ts

import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Nagani Traditional",
    short_name: "Nagani",
    description: "Myanmar traditional game room",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#050101",
    theme_color: "#2d0703",
    orientation: "portrait",
    categories: ["games", "entertainment"],
    icons: [
      {
        src: "/assets/nagani/shared/logo/nagani-logo-concept-v1.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}