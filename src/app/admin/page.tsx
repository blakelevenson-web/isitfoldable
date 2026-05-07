"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

type Shop = { id: string; name: string; address: string; zipCode: string; photoUrl?: string };
type Visit = {
  id: string; shopId: string; date: string; sliceType: string;
  scoreOverall: number; scoreDough: number; scoreSauce: number;
  scoreCheese: number; scoreFoldability: number; comments?: string;
  photoUrl?: string; shopName?: string;
};

const STYLES = ["New York", "Margherita", "Neapolitan", "Grandma"];

export default function AdminPage() {
  const router = useRouter();
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [tab, setTab] = useState<"ratings" | "shops">("ratings");
  const [shops, setShops] = useState<Shop[]>([]);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Edit state
  const [editingVisit, setEditingVisit] = useState<Visit | null>(null);
  const [editingShop, setEditingShop] = useState<Shop | null>(null);

  // Photo upload state
  const [shopPhoto, setShopPhoto] = useState<string>("");
  const [shopPhotoPreview, setShopPhotoPreview] = useState<string>("");
  const [visitPhotos, setVisitPhotos] = useState<string[]>([]);
  const [visitPhotoPreviews, setVisitPhotoPreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const shopFileRef = useRef<HTMLInputElement>(null);
  const visitFileRef = useRef<HTMLInputElement>(null);

  async function handlePhotoUpload(file: File, target: "shop" | "visit") {
    setUploading(true);
    const preview = URL.createObjectURL(file);
    if (target === "shop") {
      setShopPhotoPreview(preview);
    } else {
      setVisitPhotoPreviews((prev) => [...prev, preview]);
    }

    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const data = await res.json();
    if (res.ok) {
      if (target === "shop") {
        setShopPhoto(data.url);
        setShopPhotoPreview(data.url);
      } else {
        setVisitPhotos((prev) => [...prev, data.url]);
        setVisitPhotoPreviews((prev) => prev.map((p) => p === preview ? data.url : p));
      }
    }
    setUploading(false);
  }

  function removeVisitPhoto(index: number) {
    setVisitPhotos((prev) => prev.filter((_, i) => i !== index));
    setVisitPhotoPreviews((prev) => prev.filter((_, i) => i !== index));
  }

  useEffect(() => {
    fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "check" }),
    })
      .then((r) => r.json())
      .then((d) => {
        if (!d.authenticated) router.push("/admin/login");
        else setAuthed(true);
        setChecking(false);
      });
  }, [router]);

  useEffect(() => {
    if (authed) loadData();
  }, [authed]);

  function loadData() {
    fetch("/api/shops").then((r) => r.json()).then(setShops);
    Promise.all(
      STYLES.map((s) => fetch(`/api/search?q=${encodeURIComponent(s)}`).then((r) => r.json()))
    ).then((results) => {
      const all = results.flat();
      const unique = Array.from(new Map(all.map((v: Visit) => [v.id, v])).values());
      setVisits(unique as Visit[]);
    });
  }

  async function handleLogout() {
    await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "logout" }),
    });
    router.push("/");
  }

  async function handleSubmitVisit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSuccess("");
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
      photoUrl: visitPhotos.length > 0 ? JSON.stringify(visitPhotos) : undefined,
    };

    const url = editingVisit ? `/api/visits/${editingVisit.id}` : "/api/visits";
    const method = editingVisit ? "PUT" : "POST";

    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    if (res.ok) {
      setSuccess(editingVisit ? "Updated!" : "Added!");
      setEditingVisit(null);
      setVisitPhotos([]);
      setVisitPhotoPreviews([]);
      loadData();
      (e.target as HTMLFormElement).reset();
    } else {
      const d = await res.json();
      setError(d.error || "Error");
    }
  }

  async function handleDeleteVisit(id: string) {
    await fetch(`/api/visits/${id}`, { method: "DELETE" });
    loadData();
  }

  async function handleSubmitShop(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSuccess("");
    const form = new FormData(e.currentTarget);
    const data = {
      name: form.get("name") as string,
      address: form.get("address") as string,
      zipCode: form.get("zipCode") as string,
      photoUrl: shopPhoto || undefined,
    };

    const url = editingShop ? `/api/shops/${editingShop.id}` : "/api/shops";
    const method = editingShop ? "PUT" : "POST";

    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    if (res.ok) {
      setSuccess(editingShop ? "Shop Updated!" : "Shop Created!");
      setEditingShop(null);
      setShopPhoto("");
      setShopPhotoPreview("");
      loadData();
      (e.target as HTMLFormElement).reset();
    } else {
      const d = await res.json();
      setError(d.error || "Error");
    }
  }

  async function handleDeleteShop(id: string) {
    await fetch(`/api/shops/${id}`, { method: "DELETE" });
    loadData();
  }

  if (checking) return <div className="text-center py-16 text-warm-muted">Loading...</div>;
  if (!authed) return null;

  const inputClass = "w-full border border-warm-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent";

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 border border-warm-border rounded-lg text-sm font-medium text-warm-muted hover:text-accent hover:border-accent"
        >
          Log Out
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-warm-border mb-6">
        {(["ratings", "shops"] as const).map((t) => (
          <button
            key={t}
            onClick={() => { setTab(t); setError(""); setSuccess(""); setEditingVisit(null); setEditingShop(null); }}
            className={`flex-1 py-3 text-sm font-semibold text-center border-b-2 transition-colors capitalize ${
              tab === t ? "border-accent text-accent" : "border-transparent text-warm-muted"
            }`}
          >
            {t === "ratings" ? "New/Edit Rating" : "Manage Shops"}
          </button>
        ))}
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 mb-4 text-sm">{error}</div>}
      {success && <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg p-3 mb-4 text-sm">{success}</div>}

      {/* RATINGS TAB */}
      {tab === "ratings" && (
        <div>
          {editingVisit && (
            <div className="mb-4 flex items-center gap-2">
              <span className="text-sm bg-blue-50 text-blue-700 px-3 py-1 rounded">Editing existing review</span>
              <button onClick={() => setEditingVisit(null)} className="text-sm text-accent font-medium">Cancel Edit</button>
            </div>
          )}

          <form onSubmit={handleSubmitVisit} className="space-y-4 mb-8">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Shop *</label>
                <select name="shopId" required defaultValue={editingVisit?.shopId || ""} className={inputClass}>
                  <option value="" disabled>Select shop</option>
                  {shops.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Date *</label>
                <input name="date" type="date" required defaultValue={editingVisit?.date || new Date().toISOString().split("T")[0]} className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Style *</label>
                <select name="sliceType" required defaultValue={editingVisit?.sliceType || ""} className={inputClass}>
                  <option value="" disabled>Select style</option>
                  {STYLES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            {/* Visit Photo Upload - Multiple */}
            <div>
              <label className="block text-sm font-medium mb-1">Slice Photos</label>
              {visitPhotoPreviews.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mb-2">
                  {visitPhotoPreviews.map((preview, i) => (
                    <div key={i} className="relative">
                      <img src={preview} alt={`Photo ${i + 1}`} className="w-full h-28 object-contain bg-gray-50 rounded-lg border border-warm-border" />
                      <button type="button" onClick={() => removeVisitPhoto(i)} className="absolute top-1 right-1 bg-white/90 text-red-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow">×</button>
                    </div>
                  ))}
                </div>
              )}
              <button
                type="button"
                onClick={() => visitFileRef.current?.click()}
                className="w-full flex items-center justify-center gap-2 border border-warm-border rounded-lg py-3 text-sm font-medium hover:border-accent hover:text-accent bg-white"
              >
                📸 {visitPhotoPreviews.length > 0 ? "Add Another Photo" : "Take Photo"}
              </button>
              <input ref={visitFileRef} type="file" accept="image/*"className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handlePhotoUpload(f, "visit"); e.target.value = ""; }} />
              {uploading && <p className="text-xs text-warm-muted mt-1">Uploading...</p>}
            </div>

            <p className="font-bold text-sm">Ratings (0-10)</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {["scoreOverall", "scoreDough", "scoreSauce", "scoreCheese", "scoreFoldability"].map((key) => (
                <div key={key}>
                  <label className="block text-xs font-medium mb-1 capitalize">{key.replace("score", "")}</label>
                  <input
                    name={key}
                    type="text"
                    inputMode="decimal"
                    required
                    defaultValue={editingVisit ? (editingVisit as any)[key] : ""}
                    placeholder="e.g. 7.5"
                    className={inputClass}
                  />
                </div>
              ))}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Comments</label>
              <textarea name="comments" rows={3} defaultValue={editingVisit?.comments || ""} className={inputClass} />
            </div>

            <button type="submit" className="w-full bg-accent text-white rounded-lg py-3 font-bold hover:bg-accent-dark">
              {editingVisit ? "Update Review" : "Submit Review"}
            </button>
          </form>

          <hr className="border-warm-border mb-6" />
          <h3 className="font-bold mb-4">Recent Reviews (Edit/Delete)</h3>
          <div className="space-y-2">
            {visits.map((v) => (
              <div key={v.id} className="flex items-center gap-3 bg-white border border-warm-border rounded-lg p-3">
                <div className="flex-1 text-sm">
                  <span className="font-medium">{v.shopName || "Unknown"}</span> ({v.sliceType}) — {v.scoreOverall}
                </div>
                <button
                  onClick={() => {
                    setEditingVisit(v);
                    if (v.photoUrl) {
                      try {
                        const parsed = JSON.parse(v.photoUrl);
                        if (Array.isArray(parsed)) { setVisitPhotos(parsed); setVisitPhotoPreviews(parsed); }
                        else { setVisitPhotos([v.photoUrl]); setVisitPhotoPreviews([v.photoUrl]); }
                      } catch { setVisitPhotos([v.photoUrl]); setVisitPhotoPreviews([v.photoUrl]); }
                    } else { setVisitPhotos([]); setVisitPhotoPreviews([]); }
                  }}
                  className="text-sm px-3 py-1 border border-warm-border rounded hover:border-accent hover:text-accent"
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleDeleteVisit(v.id)}
                  className="text-sm px-3 py-1 border border-warm-border rounded hover:border-red-500 hover:text-red-500"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SHOPS TAB */}
      {tab === "shops" && (
        <div>
          {editingShop && (
            <div className="mb-4 flex items-center gap-2">
              <span className="text-sm bg-blue-50 text-blue-700 px-3 py-1 rounded">Editing existing shop</span>
              <button onClick={() => setEditingShop(null)} className="text-sm text-accent font-medium">Cancel Edit</button>
            </div>
          )}

          <form onSubmit={handleSubmitShop} className="space-y-4 mb-8">
            <div>
              <label className="block text-sm font-medium mb-1">Name *</label>
              <input name="name" required defaultValue={editingShop?.name || ""} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Address *</label>
              <input name="address" required defaultValue={editingShop?.address || ""} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Zip *</label>
              <input name="zipCode" required defaultValue={editingShop?.zipCode || ""} className={inputClass} />
            </div>
            {/* Shop Photo Upload */}
            <div>
              <label className="block text-sm font-medium mb-1">Shop Photo</label>
              {shopPhotoPreview && (
                <div className="relative mb-2">
                  <img src={shopPhotoPreview} alt="Preview" className="w-full h-48 object-contain bg-gray-50 rounded-xl border border-warm-border" />
                  <button type="button" onClick={() => { setShopPhoto(""); setShopPhotoPreview(""); }} className="absolute top-2 right-2 bg-white/90 text-red-600 rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold shadow">×</button>
                </div>
              )}
              <button
                type="button"
                onClick={() => shopFileRef.current?.click()}
                className="w-full flex items-center justify-center gap-2 border border-warm-border rounded-lg py-3 text-sm font-medium hover:border-accent hover:text-accent bg-white"
              >
                📸 {shopPhotoPreview ? "Retake Photo" : "Take Photo"}
              </button>
              <input ref={shopFileRef} type="file" accept="image/*"className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handlePhotoUpload(f, "shop"); }} />
              {uploading && <p className="text-xs text-warm-muted mt-1">Uploading...</p>}
            </div>
            <button type="submit" className="w-full bg-accent text-white rounded-lg py-3 font-bold hover:bg-accent-dark">
              {editingShop ? "Update Shop" : "Create Shop"}
            </button>
          </form>

          <hr className="border-warm-border mb-6" />
          <h3 className="font-bold mb-4">Existing Shops</h3>
          <div className="space-y-2">
            {shops.map((s) => (
              <div key={s.id} className="flex items-center gap-3 bg-white border border-warm-border rounded-lg p-3">
                <div className="flex-1 text-sm font-medium">{s.name}</div>
                <button
                  onClick={() => setEditingShop(s)}
                  className="text-sm px-3 py-1 border border-warm-border rounded hover:border-accent hover:text-accent"
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleDeleteShop(s.id)}
                  className="text-sm px-3 py-1 border border-warm-border rounded hover:border-red-500 hover:text-red-500"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
