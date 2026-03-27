import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SnapList AI — Turn Photos Into eBay Listings in 10 Seconds",
  description:
    "Upload 1-4 photos of any item. AI instantly generates title, description, price, category, and item specifics for eBay and Poshmark. Free to try — no signup.",
  keywords: "eBay listing generator, AI listing tool, reseller tool, Poshmark listing, photo to listing, eBay seller tools, AI photo listing",
  metadataBase: new URL("https://snaplist-ai-beta.vercel.app"),
  openGraph: {
    title: "SnapList AI — Write Your eBay Listing in 10 Seconds",
    description:
      "Stop spending 20 minutes writing listings. Upload photos → AI writes title, description, price, category, item specifics instantly. eBay + Poshmark. Free to try.",
    url: "https://snaplist-ai-beta.vercel.app",
    siteName: "SnapList AI",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "SnapList AI — Turn Photos Into eBay Listings",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SnapList AI — Write Your eBay Listing in 10 Seconds",
    description:
      "Upload photos → AI generates title, description, price, category. eBay + Poshmark. Free: 3/day. Pro: $9.99/mo.",
    creator: "@bhidaya1",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
