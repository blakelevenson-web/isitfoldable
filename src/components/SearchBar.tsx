"use client";

import { useState } from "react";
import Link from "next/link";

type Result = {
  id: string;
  shopName: string;
  sliceType: string;
  scoreOverall: number;
};

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [searched, setSearched] = useState(false);

  async function handleSearch(q: string) {
    setQuery(q);
    if (!q.trim()) {
      setResults([]);
      setSearched(false);
      return;
    }
    setSearched(true);
    const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
    const data = await res.json();
    setResults(data);
  }

  return (
    <div className="mb-8">
      <input
        type="text"
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="🔍 Search by Name, Zip Code, or Style"
        className="w-full border border-warm-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent bg-white"
      />
      {searched && (
        <div className="mt-2">
          <p className="text-sm text-warm-muted mb-2">Found {results.length} reviews</p>
          {results.map((r) => (
            <Link
              key={r.id}
              href={`/visits/${r.id}`}
              className="flex items-center justify-between bg-white border border-warm-border rounded-lg p-3 mb-2 hover:border-accent transition-colors no-underline"
            >
              <span className="font-medium text-sm text-gray-900">
                {r.shopName} - {r.sliceType}
              </span>
              <span className="font-bold text-accent">{Number(r.scoreOverall).toFixed(1)}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
