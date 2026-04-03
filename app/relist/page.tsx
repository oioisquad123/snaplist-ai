"use client";

import { useState } from "react";
import Link from "next/link";

interface ScrapedListing {
  title: string;
  price: number | null;
  images: string[];
  description: string;
  platform: string;
  originalUrl: string;
}

interface GeneratedListing {
  title: string;
  category: string;
  condition: string;
  description: string;
  suggestedPrice: number;
  itemSpecifics: Record<string, string>;
}

const PLATFORM_EXAMPLES = {
  ebay: "https://www.ebay.com/itm/...",
  poshmark: "https://poshmark.com/listing/...",
  amazon: "https://www.amazon.com/dp/...",
};

export default function RelistPage() {
  const [url, setUrl] = useState("");
  const [scraping, setScraping] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [scraped, setScraped] = useState<ScrapedListing | null>(null);
  const [result, setResult] = useState<GeneratedListing | null>(null);
  const [error, setError] = useState("");
  const [targetPlatform, setTargetPlatform] = useState<"ebay" | "poshmark">("ebay");
  const [copied, setCopied] = useState(false);

  const scrapeAndGenerate = async () => {
    if (!url.trim()) return;
    setScraping(true);
    setError("");
    setScraped(null);
    setResult(null);

    try {
      // Step 1: Scrape the listing
      const scrapeRes = await fetch("/api/relist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });
      const scrapeData = await scrapeRes.json();

      if (!scrapeRes.ok || !scrapeData.success) {
        setError(scrapeData.error || "Failed to fetch the listing. Check the URL and try again.");
        setScraping(false);
        return;
      }

      setScraped(scrapeData);
      setScraping(false);

      // Step 2: Generate AI listing from description + title context
      // If no images, generate from text context
      setGenerating(true);

      let generateBody: Record<string, unknown>;

      if (scrapeData.images && scrapeData.images.length > 0) {
        // We have images — fetch and convert to base64
        const imageDataUrls: string[] = [];
        for (const imgUrl of scrapeData.images.slice(0, 3)) {
          try {
            const imgRes = await fetch(`/api/proxy-image?url=${encodeURIComponent(imgUrl)}`);
            if (imgRes.ok) {
              const blob = await imgRes.blob();
              const reader = new FileReader();
              const dataUrl = await new Promise<string>((resolve) => {
                reader.onload = (e) => resolve(e.target?.result as string);
                reader.readAsDataURL(blob);
              });
              imageDataUrls.push(dataUrl);
            }
          } catch {
            // Skip failed image
          }
        }

        if (imageDataUrls.length > 0) {
          generateBody = {
            images: imageDataUrls,
            platform: targetPlatform,
            context: {
              originalTitle: scrapeData.title,
              originalPrice: scrapeData.price,
              originalDescription: scrapeData.description,
            },
          };
        } else {
          // Fall back to text-only
          generateBody = {
            images: [],
            platform: targetPlatform,
            textContext: `Product: ${scrapeData.title}\nOriginal price: $${scrapeData.price || "unknown"}\nDescription: ${scrapeData.description}`,
          };
        }
      } else {
        generateBody = {
          images: [],
          platform: targetPlatform,
          textContext: `Product: ${scrapeData.title}\nOriginal price: $${scrapeData.price || "unknown"}\nDescription: ${scrapeData.description}`,
        };
      }

      const genRes = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(generateBody),
      });
      const genData = await genRes.json();

      if (!genRes.ok) {
        setError(genData.error || "AI generation failed. Please try again.");
        setGenerating(false);
        return;
      }

      setResult(genData);
      setGenerating(false);
    } catch {
      setError("Something went wrong. Please try again.");
      setScraping(false);
      setGenerating(false);
    }
  };

  const copyAll = () => {
    if (!result) return;
    const text = [
      `TITLE: ${result.title}`,
      `CATEGORY: ${result.category}`,
      `CONDITION: ${result.condition}`,
      `PRICE: $${result.suggestedPrice}`,
      ``,
      `DESCRIPTION:`,
      result.description.replace(/<[^>]+>/g, ""),
      ``,
      `ITEM SPECIFICS:`,
      ...Object.entries(result.itemSpecifics)
        .filter(([, v]) => v && v !== "N/A")
        .map(([k, v]) => `${k}: ${v}`),
    ].join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Nav */}
      <nav className="border-b border-gray-200 bg-white px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl">📸</span>
            <span className="font-bold text-gray-900">SnapList AI</span>
          </Link>
          <div className="flex items-center gap-4 text-sm">
            <Link href="/generate" className="text-gray-600 hover:text-gray-900">↑ Upload Photos</Link>
            <Link href="/bulk" className="text-gray-600 hover:text-gray-900">⚡ Bulk</Link>
            <Link href="/checkout?plan=monthly" className="bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 font-medium">
              Go Pro $9.99/mo
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 text-sm px-3 py-1 rounded-full mb-4 font-medium">
            🔄 Relist Optimizer
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Optimize Any Listing with AI
          </h1>
          <p className="text-gray-600 max-w-xl mx-auto">
            Paste an eBay, Poshmark, or Amazon listing URL → AI rewrites it with better
            title, keywords, and description for faster sales.
          </p>
        </div>

        {/* URL Input */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Paste listing URL
          </label>
          <div className="flex gap-3">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && scrapeAndGenerate()}
              placeholder="https://www.ebay.com/itm/..."
              className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
            />
            <button
              onClick={scrapeAndGenerate}
              disabled={!url.trim() || scraping || generating}
              className="bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap text-sm"
            >
              {scraping ? "Fetching..." : generating ? "Writing..." : "✨ Optimize"}
            </button>
          </div>

          {/* Platform hint */}
          <div className="flex gap-2 mt-3 flex-wrap">
            {Object.entries(PLATFORM_EXAMPLES).map(([p, ex]) => (
              <span key={p} className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded">
                {p}: {ex}
              </span>
            ))}
          </div>

          {/* Target platform */}
          <div className="mt-4 flex items-center gap-3">
            <span className="text-sm text-gray-600 font-medium">Optimize for:</span>
            <button
              onClick={() => setTargetPlatform("ebay")}
              className={`text-sm px-3 py-1.5 rounded-lg font-medium transition-all ${
                targetPlatform === "ebay"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              eBay
            </button>
            <button
              onClick={() => setTargetPlatform("poshmark")}
              className={`text-sm px-3 py-1.5 rounded-lg font-medium transition-all ${
                targetPlatform === "poshmark"
                  ? "bg-red-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Poshmark
            </button>
          </div>
        </div>

        {/* Loading state */}
        {(scraping || generating) && (
          <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center mb-6">
            <div className="text-4xl mb-3 animate-bounce">
              {scraping ? "🔍" : "✍️"}
            </div>
            <p className="text-gray-700 font-medium">
              {scraping ? "Fetching listing data..." : "AI is rewriting your listing..."}
            </p>
            <p className="text-gray-400 text-sm mt-1">
              {scraping ? "Pulling title, price, images" : "Optimizing for search + conversions"}
            </p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Scraped data preview */}
        {scraped && !result && !generating && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <p className="text-sm font-semibold text-blue-800 mb-1">✅ Found listing:</p>
            <p className="text-sm text-blue-700">{scraped.title || "Title not found"}</p>
            {scraped.price && (
              <p className="text-sm text-blue-600 mt-1">Original price: ${scraped.price}</p>
            )}
            {scraped.images.length > 0 && (
              <p className="text-xs text-blue-500 mt-1">{scraped.images.length} image(s) found</p>
            )}
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900">✨ AI-Optimized Listing</h2>
              <button
                onClick={copyAll}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  copied
                    ? "bg-green-500 text-white"
                    : "bg-gray-900 text-white hover:bg-gray-700"
                }`}
              >
                {copied ? "✓ Copied!" : "Copy All"}
              </button>
            </div>

            <div className="space-y-5">
              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  Title ({result.title.length}/80 chars)
                </label>
                <input
                  type="text"
                  defaultValue={result.title}
                  maxLength={80}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Row: Category + Condition + Price */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Category</label>
                  <input
                    type="text"
                    defaultValue={result.category}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Condition</label>
                  <select
                    defaultValue={result.condition}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {["New", "Like New", "Good", "Fair", "Poor"].map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Suggested Price</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
                    <input
                      type="number"
                      defaultValue={result.suggestedPrice}
                      step="0.01"
                      className="w-full border border-gray-200 rounded-xl pl-7 pr-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Description</label>
                <textarea
                  defaultValue={result.description.replace(/<[^>]+>/g, "\n").trim()}
                  rows={6}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                />
              </div>

              {/* Item Specifics */}
              {Object.keys(result.itemSpecifics).length > 0 && (
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Item Specifics</label>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(result.itemSpecifics)
                      .filter(([, v]) => v && v !== "N/A")
                      .map(([key, value]) => (
                        <div key={key} className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                          <span className="text-xs font-medium text-gray-500 w-20 shrink-0">{key}</span>
                          <input
                            type="text"
                            defaultValue={value}
                            className="flex-1 bg-transparent text-sm text-gray-900 focus:outline-none min-w-0"
                          />
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={copyAll}
                  className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-all ${
                    copied ? "bg-green-500 text-white" : "bg-gray-900 text-white hover:bg-gray-700"
                  }`}
                >
                  {copied ? "✓ Copied to clipboard!" : "📋 Copy All"}
                </button>
                {targetPlatform === "ebay" && (
                  <a
                    href={`https://www.ebay.com/sell/list?title=${encodeURIComponent(result.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-yellow-400 text-gray-900 py-3 rounded-xl font-semibold text-sm text-center hover:bg-yellow-300 transition-colors"
                  >
                    Open eBay →
                  </a>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Use cases */}
        {!result && !scraping && !generating && (
          <div className="grid grid-cols-3 gap-4 mt-8">
            {[
              {
                icon: "♻️",
                title: "Relist old items",
                desc: "Refresh stale listings with AI-optimized titles and keywords",
              },
              {
                icon: "📋",
                title: "Cross-list instantly",
                desc: "Take an eBay listing and optimize it for Poshmark (or vice versa)",
              },
              {
                icon: "🏪",
                title: "Spy on competitors",
                desc: "Find hot items and create better listings than the competition",
              },
            ].map((card) => (
              <div key={card.title} className="bg-white rounded-xl border border-gray-200 p-4 text-center">
                <div className="text-2xl mb-2">{card.icon}</div>
                <div className="font-semibold text-gray-900 text-sm mb-1">{card.title}</div>
                <div className="text-xs text-gray-500">{card.desc}</div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
