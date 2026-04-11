"use client";

import Link from "next/link";
import { useState, useEffect, useMemo } from "react";

type ShopWithStats = {
  id: string;
  name: string;
  address: string;
  zipCode: string;
  photoUrl?: string;
  createdAt?: string;
  visitCount: number;
  avg: number;
  latestVisitDate: string | null;
};

type SortMode = "best" | "recent" | "most-visited";

export default function ShopsPage() {
  const [shops, setShops] = useState<ShopWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [locationFilter, setLocationFilter] = useState("");
  const [sortMode, setSortMode] = useState<SortMode>("best");

  useEffect(() => {
    fetch("/api/shops")
      .then((r) => r.json())
      .then((data) => {
        setShops(data);
        setLoading(false);
      });
  }, []);

  const filtered = useMemo(() => {
    let result = [...shops];

    // Filter by location (city, zip, or address text)
    if (locationFilter.trim()) {
      const q = locationFilter.toLowerCase().trim();
      result = result.filter(
        (s) =>
          s.address.toLowerCase().includes(q) ||
          s.zipCode.includes(q)
      );
    }

    // Sort
    if (sortMode === "best") {
      result.sort((a, b) => b.avg - a.avg);
    } else if (sortMode === "recent") {
      result.sort((a, b) => {
        if (!a.latestVisitDate && !b.latestVisitDate) return 0;
        if (!a.latestVisitDate) return 1;
        if (!b.latestVisitDate) return -1;
        return b.latestVisitDate.localeCompare(a.latestVisitDate);
      });
    } else if (sortMode === "most-visited") {
      result.sort((a, b) => b.visitCount - a.visitCount);
    }

    return result;
  }, [shops, locationFilter, sortMode]);

  if (loading) {
    return <div className="text-center py-16 text-warm-muted">Loading shops...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Pizza Shops</h1>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Filter by city, zip, or address..."
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
          className="flex-1 border border-warm-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
        />
        <div className="flex gap-2">
          {([
            { key: "best", label: "Best Rated" },
            { key: "recent", label: "Most Recent" },
            { key: "most-visited", label: "Most Visited" },
          ] as const).map((opt) => (
            <button
              key={opt.key}
              onClick={() => setSortMode(opt.key)}
              className={`px-3 py-2 rounded-lg text-sm font-medium border transition-colors whitespace-nowrap ${
                sortMode === opt.key
                  ? "bg-accent text-white border-accent"
                  : "bg-white text-warm-muted border-warm-border hover:border-accent hover:text-accent"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-5xl mb-4">🏪</p>
          <p className="text-warm-muted">
            {shops.length === 0 ? (
              <>No shops yet. <Link href="/admin">Add your first shop!</Link></>
            ) : (
              "No shops match your filters."
            )}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((shop) => (
            <Link
              key={shop.id}
              href={`/shops/${shop.id}`}
              className="block bg-white border border-warm-border rounded-xl overflow-hidden hover:border-accent transition-colors no-underline shadow-sm"
            >
              {shop.photoUrl && (
                <img src={shop.photoUrl} alt={shop.name} className="w-full aspect-video object-cover" />
              )}
              <div className="p-4">
                <h3 className="font-bold text-gray-900">{shop.name}</h3>
                <p className="text-sm text-warm-muted mb-2">📍 {shop.address}</p>
                <p className="text-sm text-warm-muted">
                  <strong>Visits:</strong> {shop.visitCount}
                  {shop.avg > 0 && <> | <strong>Avg:</strong> {shop.avg.toFixed(1)}</>}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
