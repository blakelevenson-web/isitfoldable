/** Parse a photoUrl field that may be a single URL string or a JSON array of URLs */
export function parsePhotos(photoUrl: string | null | undefined): string[] {
  if (!photoUrl) return [];
  try {
    const parsed = JSON.parse(photoUrl);
    if (Array.isArray(parsed)) return parsed;
  } catch {
    // not JSON, treat as single URL
  }
  return [photoUrl];
}

/** Get the first photo URL (for thumbnails) */
export function firstPhoto(photoUrl: string | null | undefined): string | null {
  const photos = parsePhotos(photoUrl);
  return photos.length > 0 ? photos[0] : null;
}
