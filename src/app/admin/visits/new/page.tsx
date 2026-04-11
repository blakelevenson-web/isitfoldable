"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Shop = { id: string; name: string; address: string };

export default function AddVisitPage() {
  const router = useRouter();
  const [shops, setShops] = useState<Shop[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [shopSearch, setShopSearch] = useState("");

  useEffect(() => {
    fetch("/api/shops")
      .then((r) => r.json())
      .then(setShops);
  }, []);

  const filteredShops = shops.filter(
    (s) =>
      s.name.toLowerCase().includes(shopSearch.toLowerCase()) ||
      s.address.toLowerCase().includes(shopSearch.toLowerCase())
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const data = {
      shopId: form.get("shopId") as string,
      date: form.get("date") as string,
      sliceType: form.get("sliceType") as string,
      scoreOverall: Number(form.get("scoreOverall")),
      scoreDough: Number(form.get("scoreDough")),
      scoreSauce: Number(form.get("scoreSauce")),
      scoreCheese: Number(form.get("scoreCheese")),
      scoreFoldability: Number(form.get("scoreFoldability")),
      comments: (form.get("comments") as string) || undefined,
      photoUrl: (form.get("photoUrl") as string) || undefined,
    };

    if (!data.shopId) {
      setError("Please select a shop.");
      setLoading(false);
      return;
    }

    const res = await fetch("/api/visits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const body = await res.json();
      setError(body.error || "Something went wrong.");
      setLoading(false);
      return;
    }

    const visit = await res.json();
    router.push(`/visits/${visit.id}`);
  }

  const scoreField = (name: string, label: string) => (
    <div>
      <label className="block text-sm font-medium mb-1">{label} *</label>
      <select
        name={name}
        required
        defaultValue=""
        className="w-full border border-warm-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
      >
        <option value="" disabled>Score</option>
        {[1, 2, 3, 4, 5].map((n) => (
          <option key={n} value={n}>{n}</option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-accent mb-2">Add a Visit</h1>
      <p className="text-warm-muted text-sm mb-8">
        <Link href="/admin/shops/new">Need to add a new shop first? →</Link>
      </p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 mb-4 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Shop selector */}
        <div>
          <label className="block text-sm font-medium mb-1">Shop *</label>
          <input
            type="text"
            placeholder="Search shops..."
            value={shopSearch}
            onChange={(e) => setShopSearch(e.target.value)}
            className="w-full border border-warm-border rounded-lg px-3 py-2 text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
          />
          <select
            name="shopId"
            required
            defaultValue=""
            className="w-full border border-warm-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
          >
            <option value="" disabled>Select a shop</option>
            {filteredShops.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} — {s.address}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Date *</label>
          <input
            name="date"
            type="date"
            required
            defaultValue={new Date().toISOString().split("T")[0]}
            className="w-full border border-warm-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Slice Type *</label>
          <input
            name="sliceType"
            required
            className="w-full border border-warm-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
            placeholder="cheese, pepperoni, grandma..."
          />
        </div>

        {/* Scores */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {scoreField("scoreOverall", "Overall")}
          {scoreField("scoreDough", "Dough/Crust")}
          {scoreField("scoreSauce", "Sauce")}
          {scoreField("scoreCheese", "Cheese")}
          {scoreField("scoreFoldability", "Foldability")}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Comments (optional)</label>
          <textarea
            name="comments"
            rows={3}
            className="w-full border border-warm-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
            placeholder="Great char, perfect fold..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Photo URL (optional)</label>
          <input
            name="photoUrl"
            className="w-full border border-warm-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
            placeholder="https://..."
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-accent text-white rounded-full py-3 font-medium hover:bg-accent/90 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Add Visit"}
        </button>
      </form>
    </div>
  );
}
