"use client";

import { useState, useCallback } from "react";
import Link from "next/link";

interface ListingResult {
  title: string;
  category: string;
  condition: string;
  description: string;
  suggestedPrice: number;
  itemSpecifics: Record<string, string>;
  platform?: string;
  usage?: { used: number; limit: number | null; isPro: boolean };
}

interface QueueItem {
  id: string;
  images: string[];
  files: File[];
  platform: "ebay" | "poshmark";
  status: "pending" | "generating" | "done" | "error";
  result?: ListingResult;
  error?: string;
}

const CONDITIONS = ["New", "Like New", "Good", "Fair", "Poor"];

export default function BulkPage() {
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [running, setRunning] = useState(false);
  const [globalPlatform, setGlobalPlatform] = useState<"ebay" | "poshmark">("ebay");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const addItems = useCallback(
    (files: FileList | File[]) => {
      const arr = Array.from(files);
      // Each file becomes its own queue item (one photo per item)
      // Or group by 4 if user wants (we'll do 1 per file for bulk mode)
      const newItems: QueueItem[] = arr.map((file) => ({
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        images: [],
        files: [file],
        platform: globalPlatform,
        status: "pending",
      }));
      // Read files to base64
      newItems.forEach((item, idx) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const base64 = e.target?.result as string;
          setQueue((prev) =>
            prev.map((q) =>
              q.id === item.id ? { ...q, images: [base64] } : q
            )
          );
        };
        reader.readAsDataURL(arr[idx]);
      });
      setQueue((prev) => [...prev, ...newItems]);
    },
    [globalPlatform]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const files = e.dataTransfer.files;
      if (files.length > 0) addItems(files);
    },
    [addItems]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addItems(e.target.files);
      e.target.value = "";
    }
  };

  const removeItem = (id: string) => {
    setQueue((prev) => prev.filter((q) => q.id !== id));
  };

  const runAll = async () => {
    const pendingItems = queue.filter((q) => q.status === "pending" && q.images.length > 0);
    if (pendingItems.length === 0) return;
    setRunning(true);

    for (const item of pendingItems) {
      // Mark as generating
      setQueue((prev) =>
        prev.map((q) => (q.id === item.id ? { ...q, status: "generating" } : q))
      );

      try {
        const res = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ images: item.images, platform: item.platform }),
        });
        const data = await res.json();

        if (!res.ok) {
          const errMsg = data.error || `HTTP ${res.status}`;
          setQueue((prev) =>
            prev.map((q) => (q.id === item.id ? { ...q, status: "error", error: errMsg } : q))
          );
          // Stop if daily limit hit
          if (res.status === 429) break;
        } else {
          setQueue((prev) =>
            prev.map((q) => (q.id === item.id ? { ...q, status: "done", result: data } : q))
          );
        }
      } catch (err) {
        setQueue((prev) =>
          prev.map((q) =>
            q.id === item.id
              ? { ...q, status: "error", error: err instanceof Error ? err.message : "Unknown error" }
              : q
          )
        );
      }

      // Small delay between requests to avoid rate limiting
      await new Promise((r) => setTimeout(r, 500));
    }

    setRunning(false);
  };

  const copyItem = (result: ListingResult) => {
    const text = [
      `TITLE: ${result.title}`,
      `CATEGORY: ${result.category}`,
      `CONDITION: ${result.condition}`,
      `PRICE: $${result.suggestedPrice}`,
      ``,
      `DESCRIPTION:`,
      result.description.replace(/<[^>]*>/g, ""),
      ``,
      `ITEM SPECIFICS:`,
      ...Object.entries(result.itemSpecifics).map(([k, v]) => `${k}: ${v}`),
    ].join("\n");
    navigator.clipboard.writeText(text);
  };

  const doneCount = queue.filter((q) => q.status === "done").length;
  const pendingCount = queue.filter((q) => q.status === "pending").length;
  const errorCount = queue.filter((q) => q.status === "error").length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100 max-w-5xl mx-auto">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">📸</span>
            <span className="font-bold text-xl text-gray-900">SnapList AI</span>
          </Link>
          <span className="text-gray-300 mx-2">|</span>
          <span className="text-sm font-medium text-purple-600">⚡ Bulk Mode</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/generate" className="text-sm text-gray-600 hover:text-gray-900">
            Single listing
          </Link>
          <Link
            href="/checkout?plan=monthly"
            className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors"
          >
            Pro — Unlimited
          </Link>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Bulk Listing Generator</h1>
          <p className="text-gray-600">
            Upload multiple photos at once. AI processes each item automatically.{" "}
            <span className="text-purple-600 font-medium">Pro users: unlimited items.</span>
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            {/* Platform toggle */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Platform
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setGlobalPlatform("ebay")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    globalPlatform === "ebay"
                      ? "bg-blue-600 text-white"
                      : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  🛒 eBay
                </button>
                <button
                  onClick={() => setGlobalPlatform("poshmark")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    globalPlatform === "poshmark"
                      ? "bg-pink-500 text-white"
                      : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  👗 Poshmark
                </button>
              </div>
            </div>

            {/* Upload area */}
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className="flex-1 border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-purple-400 transition-colors cursor-pointer"
              onClick={() => document.getElementById("bulk-file-input")?.click()}
            >
              <input
                id="bulk-file-input"
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="text-gray-500 text-sm">
                <span className="text-2xl block mb-1">📁</span>
                Drop photos here or click to select multiple
              </div>
            </div>
          </div>
        </div>

        {/* Queue stats */}
        {queue.length > 0 && (
          <div className="flex items-center gap-4 mb-4">
            <div className="flex gap-3 text-sm">
              <span className="text-gray-600">{queue.length} total</span>
              {doneCount > 0 && <span className="text-green-600">✓ {doneCount} done</span>}
              {pendingCount > 0 && <span className="text-blue-600">⏳ {pendingCount} pending</span>}
              {errorCount > 0 && <span className="text-red-600">✗ {errorCount} errors</span>}
            </div>
            <div className="ml-auto flex gap-2">
              <button
                onClick={() => setQueue([])}
                className="text-sm text-gray-500 hover:text-red-600 transition-colors"
              >
                Clear all
              </button>
              <button
                onClick={runAll}
                disabled={running || pendingCount === 0}
                className={`px-6 py-2 rounded-lg font-semibold text-sm transition-all ${
                  running || pendingCount === 0
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-purple-600 text-white hover:bg-purple-700 shadow"
                }`}
              >
                {running ? "⚡ Generating..." : `⚡ Generate ${pendingCount} Listing${pendingCount !== 1 ? "s" : ""}`}
              </button>
            </div>
          </div>
        )}

        {/* Queue items */}
        <div className="space-y-3">
          {queue.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <div className="text-5xl mb-4">📦</div>
              <p className="text-lg font-medium mb-2">No items yet</p>
              <p className="text-sm">Drop photos above to get started. Each photo = one listing.</p>
            </div>
          )}

          {queue.map((item, index) => (
            <div
              key={item.id}
              className={`bg-white rounded-xl border transition-all ${
                item.status === "done"
                  ? "border-green-200"
                  : item.status === "error"
                  ? "border-red-200"
                  : item.status === "generating"
                  ? "border-purple-300"
                  : "border-gray-200"
              }`}
            >
              <div className="flex items-center gap-4 p-4">
                {/* Thumbnail */}
                {item.images[0] ? (
                  <img
                    src={item.images[0]}
                    alt={`Item ${index + 1}`}
                    className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-xs flex-shrink-0">
                    Loading...
                  </div>
                )}

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {item.result?.title || item.files[0]?.name || `Item ${index + 1}`}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        item.status === "done"
                          ? "bg-green-100 text-green-700"
                          : item.status === "error"
                          ? "bg-red-100 text-red-700"
                          : item.status === "generating"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {item.status === "done"
                        ? "✓ Done"
                        : item.status === "error"
                        ? "✗ Error"
                        : item.status === "generating"
                        ? "⚡ Generating..."
                        : "Pending"}
                    </span>
                    {item.result && (
                      <span className="text-xs text-gray-500">
                        ${item.result.suggestedPrice} · {item.result.condition}
                      </span>
                    )}
                    {item.error && (
                      <span className="text-xs text-red-600 truncate">{item.error}</span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  {item.status === "done" && item.result && (
                    <>
                      <button
                        onClick={() => copyItem(item.result!)}
                        className="text-xs bg-gray-900 text-white px-3 py-1.5 rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        Copy
                      </button>
                      <button
                        onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                        className="text-xs border border-gray-200 text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        {expandedId === item.id ? "Hide" : "View"}
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors ml-1"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Expanded result */}
              {expandedId === item.id && item.result && (
                <div className="border-t border-gray-100 p-4 space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Title</label>
                    <p className="text-sm text-gray-900 mt-0.5">{item.result.title}</p>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-sm">
                    <div>
                      <span className="text-xs text-gray-400 uppercase">Category</span>
                      <p className="text-gray-900">{item.result.category}</p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-400 uppercase">Condition</span>
                      <p className="text-gray-900">{item.result.condition}</p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-400 uppercase">Price</span>
                      <p className="text-gray-900 font-semibold">${item.result.suggestedPrice}</p>
                    </div>
                  </div>
                  <div>
                    <span className="text-xs text-gray-400 uppercase">Description</span>
                    <p className="text-sm text-gray-700 mt-0.5 whitespace-pre-wrap">
                      {item.result.description.replace(/<[^>]*>/g, "").substring(0, 300)}...
                    </p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-400 uppercase">Item Specifics</span>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {Object.entries(item.result.itemSpecifics)
                        .filter(([, v]) => v && v !== "N/A")
                        .map(([k, v]) => (
                          <span key={k} className="text-xs bg-gray-100 px-2 py-1 rounded">
                            {k}: {v}
                          </span>
                        ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Pro upsell */}
        {queue.length >= 3 && (
          <div className="mt-6 bg-purple-50 border border-purple-200 rounded-xl p-5 text-center">
            <p className="font-semibold text-purple-900 mb-1">
              🚀 Want unlimited bulk listings?
            </p>
            <p className="text-purple-700 text-sm mb-3">
              Free plan: 3 listings/day. Pro: unlimited. Perfect for daily flippers.
            </p>
            <Link
              href="/checkout?plan=monthly"
              className="inline-block bg-purple-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-purple-700 transition-colors text-sm"
            >
              Upgrade to Pro — $9.99/mo →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
