"use client";

import { useState, useRef } from "react";

type Props = {
  onPhotoUrl: (url: string) => void;
  currentUrl?: string;
};

export function PhotoCapture({ onPhotoUrl, currentUrl }: Props) {
  const [preview, setPreview] = useState<string | null>(currentUrl || null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setUploading(true);
    // Show local preview immediately
    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);

    // Upload to server
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const data = await res.json();

    if (res.ok) {
      setPreview(data.url);
      onPhotoUrl(data.url);
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

      {preview && (
        <div className="mb-3 relative">
          <img src={preview} alt="Preview" className="w-full h-48 object-cover rounded-xl border border-warm-border" />
          <button
            type="button"
            onClick={() => { setPreview(null); onPhotoUrl(""); }}
            className="absolute top-2 right-2 bg-white/90 text-red-600 rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold shadow"
          >
            ×
          </button>
        </div>
      )}

      <div className="flex gap-2">
        {/* Camera capture - opens camera on mobile */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex-1 flex items-center justify-center gap-2 border border-warm-border rounded-lg py-3 px-4 text-sm font-medium hover:border-accent hover:text-accent transition-colors bg-white"
        >
          📸 {preview ? "Retake Photo" : "Take Photo"}
        </button>

        {/* Hidden file input with camera capture */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
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
