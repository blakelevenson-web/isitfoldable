"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { PhotoCapture } from "@/components/PhotoCapture";

type Shop = {
  id: string;
  name: string;
  address: string;
  zipCode: string;
  photoUrl?: string;
};

export default function EditShopPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [shop, setShop] = useState<Shop | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [photoUrl, setPhotoUrl] = useState("");

  useEffect(() => {
    fetch(`/api/shops/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setShop(data);
        setPhotoUrl(data.photoUrl || "");
      });
  }, [id]);

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

    const res = await fetch(`/api/shops/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const body = await res.json();
      setError(body.error || "Something went wrong.");
      setLoading(false);
      return;
    }

    router.push(`/shops/${id}`);
  }

  if (!shop) {
    return <div className="text-center py-16 text-warm-muted">Loading...</div>;
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-accent mb-2">Edit Shop</h1>
      <p className="text-warm-muted text-sm mb-8">
        <Link href={`/shops/${id}`}>← Back to {shop.name}</Link>
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
            defaultValue={shop.name}
            className="w-full border border-warm-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Address *</label>
          <input
            name="address"
            required
            defaultValue={shop.address}
            className="w-full border border-warm-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Zip Code *</label>
          <input
            name="zipCode"
            required
            defaultValue={shop.zipCode}
            className="w-full border border-warm-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
          />
        </div>

        <PhotoCapture onPhotoUrl={setPhotoUrl} currentUrl={photoUrl} />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-accent text-white rounded-full py-3 font-medium hover:bg-accent/90 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
