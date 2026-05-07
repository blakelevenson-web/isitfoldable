"use client";

import { useState, useRef } from "react";

type Props = {
  onPhotoUrl: (url: string) => void;
  currentUrl?: string;
};

export function PhotoCapture({ onPhotoUrl, currentUrl }: Props) {
  const [preview, setPreview] = useState<string | null>(currentUrl || null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setUploading(true);
    setError("");
    // Show local preview immediately
    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);

    try {
      // Upload to server
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();

      if (res.ok) {
        setPreview(data.url);
        onPhotoUrl(data.url);
      } else {
        setError(data.error || "Upload failed. Please try again.");
        setPreview(null);
      }
    } catch {
      setError("Upload failed. Please check your connection and try again.");
      setPreview(null);
    }
    setUploading(false);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  return (
    <div>
      <label className="block text-sm font-medium mb-1">Photo</label>

      {error && (
        <p className="text-xs text-red-600 mb-2">{error}</p>
      )}

      {preview && (
        <div className="mb-3 relative">
          <img src={preview} alt="Preview" className="w-full max-h-64 object-contain bg-gray-50 rounded-xl border border-warm-border" />
          <button
            type="button"
            onClick={() => { setPreview(null); onPhotoUrl(""); setError(""); }}
            className="absolute top-2 right-2 bg-white/90 text-red-600 rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold shadow"
          >
            ×
          </button>
        </div>
      )}

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex-1 flex items-center justify-center gap-2 border border-warm-border rounded-lg py-3 px-4 text-sm font-medium hover:border-accent hover:text-accent transition-colors bg-white"
        >
          📸 {preview ? "Change Photo" : "Add Photo"}
        </button>

        {/* Hidden file input - no capture attr so user can choose camera or gallery */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="hidden"
        />
      </div>

      {uploading && (
        <p className="text-xs text-warm-muted mt-2">Uploading...</p>
      )}
    </div>
  );
}
