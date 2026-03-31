"use client";

import { useState } from "react";
import Link from "next/link";

export default function FeeCalculatorPage() {
  const [salePrice, setSalePrice] = useState("");
  const [shippingCharged, setShippingCharged] = useState("");
  const [platform, setPlatform] = useState<"ebay" | "poshmark">("ebay");
  const [ebayStore, setEbayStore] = useState<"none" | "basic" | "premium" | "anchor">("none");

  const sale = parseFloat(salePrice) || 0;
  const shipping = parseFloat(shippingCharged) || 0;
  const total = sale + shipping;

  // eBay fee rates (2026)
  const ebayFees = {
    none: 0.1325,
    basic: 0.1225,
    premium: 0.10,
    anchor: 0.0875,
  };
  const ebayFeeRate = ebayFees[ebayStore];
  const ebayFinalValueFee = total * ebayFeeRate;
  const ebayProcessingFee = total * 0.03 + 0.30; // Payment processing
  const ebayTotalFees = ebayFinalValueFee + ebayProcessingFee;
  const ebayProfit = sale - ebayTotalFees;
  const ebayNetPercent = sale > 0 ? ((ebayProfit / sale) * 100).toFixed(1) : "0";

  // Poshmark fee (flat 20% on sales over $15, $2.95 flat under $15)
  const poshmarkFee = sale <= 15 ? 2.95 : sale * 0.20;
  const poshmarkProfit = sale - poshmarkFee;
  const poshmarkNetPercent = sale > 0 ? ((poshmarkProfit / sale) * 100).toFixed(1) : "0";

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white max-w-4xl mx-auto">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">📸</span>
          <span className="font-bold text-xl text-gray-900">SnapList AI</span>
        </Link>
        <Link
          href="/generate"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          Try Free →
        </Link>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <div className="text-5xl mb-4">🧮</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            eBay & Poshmark Fee Calculator
          </h1>
          <p className="text-gray-600">
            See exactly what you&apos;ll keep after fees. Updated for 2026 fee rates.
          </p>
        </div>

        {/* Platform toggle */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setPlatform("ebay")}
            className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-all border-2 ${
              platform === "ebay"
                ? "border-blue-600 bg-blue-50 text-blue-700"
                : "border-gray-200 text-gray-600 hover:border-gray-300 bg-white"
            }`}
          >
            🛒 eBay
          </button>
          <button
            onClick={() => setPlatform("poshmark")}
            className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-all border-2 ${
              platform === "poshmark"
                ? "border-pink-500 bg-pink-50 text-pink-700"
                : "border-gray-200 text-gray-600 hover:border-gray-300 bg-white"
            }`}
          >
            👗 Poshmark
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6 shadow-sm">
          {/* Inputs */}
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Sale price (what buyer pays)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                <input
                  type="number"
                  value={salePrice}
                  onChange={(e) => setSalePrice(e.target.value)}
                  placeholder="29.99"
                  className="w-full border border-gray-200 rounded-xl pl-7 pr-3 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {platform === "ebay" && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Shipping charged to buyer
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                    <input
                      type="number"
                      value={shippingCharged}
                      onChange={(e) => setShippingCharged(e.target.value)}
                      placeholder="0 for free shipping"
                      className="w-full border border-gray-200 rounded-xl pl-7 pr-3 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">eBay charges final value fees on shipping too if buyer pays for it</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    eBay Store subscription
                  </label>
                  <select
                    value={ebayStore}
                    onChange={(e) => setEbayStore(e.target.value as typeof ebayStore)}
                    className="w-full border border-gray-200 rounded-xl px-3 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="none">No store (13.25% FVF)</option>
                    <option value="basic">Basic Store ($21.95/mo — 12.25%)</option>
                    <option value="premium">Premium Store ($59.95/mo — 10%)</option>
                    <option value="anchor">Anchor Store ($299.95/mo — 8.75%)</option>
                  </select>
                </div>
              </>
            )}
          </div>

          {/* Results */}
          {sale > 0 && (
            <div className="border-t border-gray-100 pt-5">
              {platform === "ebay" ? (
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Sale + shipping total</span>
                    <span className="font-medium">${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Final Value Fee ({(ebayFeeRate * 100).toFixed(2)}%)</span>
                    <span className="text-red-500">-${ebayFinalValueFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Payment processing (3% + $0.30)</span>
                    <span className="text-red-500">-${ebayProcessingFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-semibold border-t border-gray-100 pt-3">
                    <span className="text-gray-500">Total fees</span>
                    <span className="text-red-600">-${ebayTotalFees.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center bg-green-50 rounded-xl p-4">
                    <div>
                      <div className="text-sm text-gray-500">You keep</div>
                      <div className="text-3xl font-bold text-green-700">${ebayProfit.toFixed(2)}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Net margin</div>
                      <div className={`text-2xl font-bold ${parseFloat(ebayNetPercent) > 70 ? "text-green-600" : parseFloat(ebayNetPercent) > 50 ? "text-yellow-600" : "text-red-600"}`}>
                        {ebayNetPercent}%
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Sale price</span>
                    <span className="font-medium">${sale.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">
                      Poshmark fee {sale <= 15 ? "(flat $2.95)" : "(20%)"}
                    </span>
                    <span className="text-red-500">-${poshmarkFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center bg-green-50 rounded-xl p-4">
                    <div>
                      <div className="text-sm text-gray-500">You keep</div>
                      <div className="text-3xl font-bold text-green-700">${poshmarkProfit.toFixed(2)}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Net margin</div>
                      <div className={`text-2xl font-bold ${parseFloat(poshmarkNetPercent) > 75 ? "text-green-600" : parseFloat(poshmarkNetPercent) > 60 ? "text-yellow-600" : "text-red-600"}`}>
                        {poshmarkNetPercent}%
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Fee reference table */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-6">
          <h3 className="font-semibold text-gray-800 mb-3 text-sm">
            {platform === "ebay" ? "eBay 2026 fee reference" : "Poshmark 2026 fee reference"}
          </h3>
          {platform === "ebay" ? (
            <div className="text-sm text-gray-600 space-y-2">
              <p>• <strong>No store:</strong> 13.25% FVF + 3% + $0.30 payment processing</p>
              <p>• <strong>Basic Store ($21.95/mo):</strong> 12.25% + processing</p>
              <p>• <strong>Premium Store ($59.95/mo):</strong> 10% + processing</p>
              <p>• <strong>Anchor Store ($299.95/mo):</strong> 8.75% + processing</p>
              <p className="text-xs text-gray-400 mt-2">* FVF applies to sale price + shipping. Rates for most categories.</p>
            </div>
          ) : (
            <div className="text-sm text-gray-600 space-y-2">
              <p>• <strong>Sales under $15:</strong> Flat $2.95 fee (you keep the rest)</p>
              <p>• <strong>Sales $15+:</strong> 20% fee (you keep 80%)</p>
              <p>• <strong>Shipping:</strong> Buyer pays $7.97 (prepaid USPS label). No fee on shipping for seller.</p>
              <p className="text-xs text-gray-400 mt-2">* Poshmark handles all payment processing — no separate fee.</p>
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 text-center">
          <p className="text-blue-800 font-semibold mb-2">Know what it&apos;s worth. List it in 10 seconds. 📸</p>
          <p className="text-blue-600 text-sm mb-4">
            Upload your photos → AI writes the title, description, price estimate, and item specifics. Free (3/day).
          </p>
          <Link
            href="/generate"
            className="inline-block bg-blue-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            ⚡ Generate Free Listing →
          </Link>
        </div>
      </div>
    </div>
  );
}
