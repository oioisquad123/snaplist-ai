import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "SnapList AI — eBay Listing Generator",
    short_name: "SnapList AI",
    description: "Turn photos into perfect eBay listings in 10 seconds",
    start_url: "/generate",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#2563eb",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    categories: ["productivity", "shopping", "business"],
    screenshots: [],
  };
}
