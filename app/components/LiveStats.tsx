"use client";

import { useState, useEffect } from "react";

interface Stats {
  totalUsers: number;
  totalGenerations: number;
}

export default function LiveStats() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then((data) => {
        if (data.totalUsers && data.totalGenerations) {
          setStats(data);
        }
      })
      .catch(() => {});
  }, []);

  if (!stats || (stats.totalUsers < 5 && stats.totalGenerations < 10)) {
    return null; // Don't show until we have meaningful numbers
  }

  return (
    <div className="mt-6 inline-flex items-center gap-3 bg-white border border-gray-200 rounded-full px-5 py-2.5 text-sm shadow-sm">
      <span className="flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
        <span className="text-gray-600 font-medium">{stats.totalUsers.toLocaleString()} sellers using SnapList</span>
      </span>
      <span className="text-gray-300">·</span>
      <span className="text-gray-500">{stats.totalGenerations.toLocaleString()} listings generated</span>
    </div>
  );
}
