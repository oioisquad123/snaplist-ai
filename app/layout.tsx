import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SnapList AI — Turn Photos Into eBay Listings in 10 Seconds",
  description:
    "Upload 2-4 photos of any item and AI instantly generates a perfect eBay listing — title, description, price, category, and item specifics. Free for resellers.",
  keywords: "eBay listing generator, AI listing tool, reseller tool, Poshmark listing, photo to listing",
  openGraph: {
    title: "SnapList AI — Turn Photos Into eBay Listings in 10 Seconds",
    description: "Stop spending 20 minutes writing eBay listings. SnapList AI does it in 10 seconds.",
    url: "https://snaplistai.com",
    siteName: "SnapList AI",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SnapList AI",
    description: "Turn photos into perfect eBay listings in 10 seconds with AI.",
    creator: "@bhidaya1",
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
