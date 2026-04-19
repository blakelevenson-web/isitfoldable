"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PhotoCapture } from "@/components/PhotoCapture";

export default function AddShopPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [photoUrl, setPhotoUrl] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const data = {
      name: form.get("name") as string,
      address: form.get("address") as string,
      zipCode: form.get("zipCode") as string,
      photoUrl: photoUrl || undefined,
    };

    const res = await fetch("/api/shops", {
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

    const shop = await res.json();
    router.push(`/shops/${shop.id}`);
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-accent mb-2">Add a Shop</h1>
      <p className="text-warm-muted text-sm mb-8">
        <Link href="/admin/visits/new">Or add a visit instead →</Link>
      </p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 mb-4 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Shop Name *</label>
          <input
            name="name"
            required
            className="w-full border border-warm-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
            placeholder="Joe's Pizza"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Address *</label>
          <input
            name="address"
            required
            className="w-full border border-warm-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
            placeholder="7 Carmine St, New York, NY"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Zip Code *</label>
          <input
            name="zipCode"
            required
            className="w-full border border-warm-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
            placeholder="10014"
          />
        </div>

        <PhotoCapture onPhotoUrl={setPhotoUrl} currentUrl={photoUrl} />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-accent text-white rounded-full py-3 font-medium hover:bg-accent/90 disabled:opacity-50"
        >
          {loading ? "Adding..." : "Add Shop"}
        </button>
      </form>
    </div>
  );
}
