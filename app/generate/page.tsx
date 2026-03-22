"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

interface ListingResult {
  title: string;
  category: string;
  condition: string;
  description: string;
  suggestedPrice: number;
  itemSpecifics: Record<string, string>;
  usage?: {
    used: number;
    limit: number | null;
    isPro: boolean;
  };
}

interface UsageInfo {
  used: number;
  limit: number | null;
  remaining: number | null;
  isPro: boolean;
}

const FUN_MESSAGES = [
  "AI is studying your photos... 🧐",
  "Finding the best keywords for eBay search... 🔍",
  "Estimating fair market value... 💰",
  "Writing a killer description... ✍️",
  "Almost done — just polishing! ✨",
];

const CONDITIONS = ["New", "Like New", "Good", "Fair", "Poor"];

function GeneratePageInner() {
  const searchParams = useSearchParams();
  const justUpgraded = searchParams.get("upgraded") === "true";

  const [images, setImages] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [funMessage, setFunMessage] = useState(FUN_MESSAGES[0]);
  const [result, setResult] = useState<ListingResult | null>(null);
  const [error, setError] = useState("");
  const [usage, setUsage] = useState<UsageInfo | null>(null);
  const [copied, setCopied] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Load usage on mount
  useEffect(() => {
    fetch("/api/usage")
      .then((r) => r.json())
      .then(setUsage)
      .catch(() => {});
  }, []);

  // Rotate fun messages while loading
  useEffect(() => {
    if (!loading) return;
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % FUN_MESSAGES.length;
      setFunMessage(FUN_MESSAGES[i]);
    }, 2000);
    return () => clearInterval(interval);
  }, [loading]);

  const handleFiles = useCallback((files: FileList | File[]) => {
    const arr = Array.from(files).slice(0, 4);
    const readers = arr.map(
      (file) =>
        new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.readAsDataURL(file);
        })
    );
    Promise.all(readers).then((base64s) => {
      setImages((prev) => [...prev, ...base64s].slice(0, 4));
      setImageFiles((prev) => [...prev, ...arr].slice(0, 4));
      setResult(null);
      setError("");
    });
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const generate = async () => {
    if (images.length === 0) {
      setError("Please upload at least 1 photo first.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);
    setFunMessage(FUN_MESSAGES[0]);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ images }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 429) {
          setError(
            `You've used all ${data.limit} free listings today. Upgrade to Pro for unlimited!`
          );
        } else {
          setError(data.error || "Something went wrong. Please try again.");
        }
        return;
      }

      setResult(data);
      if (data.usage) {
        setUsage({
          used: data.usage.used,
          limit: data.usage.limit,
          remaining: data.usage.limit ? Math.max(0, data.usage.limit - data.usage.used) : null,
          isPro: data.usage.isPro,
        });
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyAll = () => {
    if (!result) return;
    const specifics = Object.entries(result.itemSpecifics || {})
      .filter(([, v]) => v && v !== "N/A" && v !== "Unknown")
      .map(([k, v]) => `${k}: ${v}`)
      .join("\n");

    const text = `TITLE: ${result.title}

CATEGORY: ${result.category}
CONDITION: ${result.condition}
PRICE: $${result.suggestedPrice}

DESCRIPTION:
${result.description.replace(/<[^>]*>/g, "")}

ITEM SPECIFICS:
${specifics}`;

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const openEbayForm = () => {
    if (!result) return;
    const title = encodeURIComponent(result.title);
    window.open(
      `https://www.ebay.com/sell/list?title=${title}`,
      "_blank"
    );
  };

  const updateResult = (field: string, value: string | number) => {
    if (!result) return;
    setResult({ ...result, [field]: value });
  };

  const updateSpecific = (key: string, value: string) => {
    if (!result) return;
    setResult({
      ...result,
      itemSpecifics: { ...result.itemSpecifics, [key]: value },
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Nav */}
      <nav className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl">📸</span>
            <span className="font-bold text-gray-900">SnapList AI</span>
          </Link>
          <div className="flex items-center gap-3">
            {usage && !usage.isPro && (
              <span className="text-sm text-gray-500">
                {usage.used}/{usage.limit ?? 3} free today
              </span>
            )}
            {usage?.isPro && (
              <span className="text-sm text-blue-600 font-medium">⚡ Pro</span>
            )}
            {!usage?.isPro && (
              <Link
                href="/checkout?plan=monthly"
                className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Upgrade Pro
              </Link>
            )}
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {justUpgraded && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
            <span className="text-2xl">🎉</span>
            <div>
              <p className="font-semibold text-green-800">Welcome to Pro!</p>
              <p className="text-green-700 text-sm">You now have unlimited listing generation.</p>
            </div>
          </div>
        )}

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Generate eBay Listing</h1>
          <p className="text-gray-600">Upload 1-4 photos → AI writes your listing in seconds</p>
        </div>

        {/* Upload area */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-4">
          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${
              isDragging
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
            }`}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => document.getElementById("file-input")?.click()}
          >
            <input
              id="file-input"
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => e.target.files && handleFiles(e.target.files)}
            />
            {images.length === 0 ? (
              <>
                <div className="text-5xl mb-3">📷</div>
                <p className="text-gray-700 font-medium mb-1">
                  Drop photos here or tap to upload
                </p>
                <p className="text-gray-500 text-sm">
                  Up to 4 images • JPG, PNG, HEIC • Multiple angles = better results
                </p>
              </>
            ) : (
              <p className="text-gray-600 text-sm">
                + Add more photos ({images.length}/4)
              </p>
            )}
          </div>

          {/* Image previews */}
          {images.length > 0 && (
            <div className="flex gap-3 mt-4 flex-wrap">
              {images.map((img, i) => (
                <div key={i} className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img}
                    alt={`Photo ${i + 1}`}
                    className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                  />
                  <button
                    onClick={(e) => { e.stopPropagation(); removeImage(i); }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Generate button */}
        <button
          onClick={generate}
          disabled={loading || images.length === 0}
          className={`w-full py-4 rounded-xl font-semibold text-lg transition-all mb-6 ${
            loading || images.length === 0
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl active:scale-[0.99]"
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-3">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              {funMessage}
            </span>
          ) : images.length === 0 ? (
            "Upload a photo first"
          ) : (
            "⚡ Generate Listing"
          )}
        </button>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <p className="text-red-700 text-sm">{error}</p>
            {error.includes("free listings") && (
              <Link
                href="/checkout?plan=monthly"
                className="inline-block mt-2 bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Upgrade to Pro — $9.99/mo →
              </Link>
            )}
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="p-4 bg-green-50 border-b border-green-100 flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span className="font-medium text-green-800">Listing generated!</span>
              <span className="text-green-600 text-sm ml-auto">Edit any field below</span>
            </div>

            <div className="p-6 space-y-5">
              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  Title ({result.title?.length || 0}/80 chars)
                </label>
                <input
                  type="text"
                  value={result.title}
                  maxLength={80}
                  onChange={(e) => updateResult("title", e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Row: Category + Condition */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Category</label>
                  <input
                    type="text"
                    value={result.category}
                    onChange={(e) => updateResult("category", e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Condition</label>
                  <select
                    value={result.condition}
                    onChange={(e) => updateResult("condition", e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    {CONDITIONS.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Price */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Suggested Price (USD)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={result.suggestedPrice}
                    min={0}
                    step={0.01}
                    onChange={(e) => updateResult("suggestedPrice", parseFloat(e.target.value))}
                    className="w-full border border-gray-200 rounded-lg pl-7 pr-3 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Description</label>
                <textarea
                  value={result.description?.replace(/<[^>]*>/g, "")}
                  rows={6}
                  onChange={(e) => updateResult("description", e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
                />
              </div>

              {/* Item Specifics */}
              {result.itemSpecifics && Object.keys(result.itemSpecifics).length > 0 && (
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Item Specifics</label>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(result.itemSpecifics).map(([key, value]) => (
                      <div key={key} className="flex gap-2 items-center">
                        <span className="text-xs text-gray-500 w-20 flex-shrink-0">{key}</span>
                        <input
                          type="text"
                          value={value}
                          onChange={(e) => updateSpecific(key, e.target.value)}
                          className="flex-1 border border-gray-200 rounded px-2 py-1.5 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500 min-w-0"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={copyAll}
                  className="flex-1 bg-gray-900 text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition-colors"
                >
                  {copied ? "✓ Copied!" : "📋 Copy All"}
                </button>
                <button
                  onClick={openEbayForm}
                  className="flex-1 border-2 border-blue-600 text-blue-600 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-colors"
                >
                  🛍️ Open eBay
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Generate another */}
        {result && (
          <button
            onClick={() => {
              setResult(null);
              setImages([]);
              setImageFiles([]);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="w-full mt-4 text-center text-blue-600 hover:text-blue-700 font-medium py-2"
          >
            ← Generate another listing
          </button>
        )}

        {/* Upgrade nudge */}
        {usage && !usage.isPro && usage.remaining !== null && usage.remaining <= 1 && (
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
            <p className="text-blue-800 font-medium mb-1">
              {usage.remaining === 0 ? "🚫 You're out of free listings for today" : "⚠️ Only 1 free listing left today"}
            </p>
            <p className="text-blue-600 text-sm mb-3">Upgrade to Pro for unlimited listings — $9.99/month</p>
            <Link
              href="/checkout?plan=monthly"
              className="inline-block bg-blue-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Upgrade to Pro →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function GeneratePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="text-gray-500">Loading...</div></div>}>
      <GeneratePageInner />
    </Suspense>
  );
}
