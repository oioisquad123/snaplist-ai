"use client";

import { useState, useEffect } from "react";

export interface SavedListing {
  id: string;
  title: string;
  suggestedPrice: number;
  condition: string;
  platform: string;
  savedAt: string;
}

const STORAGE_KEY = "snaplist_history";
const MAX_HISTORY = 20;

export function saveListingToHistory(listing: Omit<SavedListing, "id" | "savedAt">) {
  try {
    const existing = getHistory();
    const newEntry: SavedListing = {
      ...listing,
      id: Date.now().toString(),
      savedAt: new Date().toISOString(),
    };
    const updated = [newEntry, ...existing].slice(0, MAX_HISTORY);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // localStorage may not be available (SSR, private mode)
  }
}

export function getHistory(): SavedListing[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function clearHistory() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

export default function ListingHistory() {
  const [history, setHistory] = useState<SavedListing[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setHistory(getHistory());
  }, [isOpen]);

  if (history.length === 0) return null;

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
  };

  return (
    <div className="mt-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
      >
        <span>🕒</span>
        <span>{history.length} recent listing{history.length !== 1 ? "s" : ""}</span>
        <span className="text-xs">{isOpen ? "▲" : "▼"}</span>
      </button>

      {isOpen && (
        <div className="mt-3 border border-gray-200 rounded-xl overflow-hidden">
          <div className="bg-gray-50 px-4 py-2 flex items-center justify-between border-b border-gray-200">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Recent Listings</span>
            <button
              onClick={() => { clearHistory(); setHistory([]); }}
              className="text-xs text-gray-400 hover:text-red-500 transition-colors"
            >
              Clear all
            </button>
          </div>
          <div className="divide-y divide-gray-100 max-h-64 overflow-y-auto">
            {history.map((item) => (
              <div key={item.id} className="px-4 py-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{item.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {item.platform === "poshmark" ? "👗 Poshmark" : "🛒 eBay"} · ${item.suggestedPrice} · {item.condition} · {formatDate(item.savedAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
