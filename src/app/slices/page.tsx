import Link from "next/link";
import { getAllVisits } from "@/lib/queries";
import { firstPhoto } from "@/lib/photos";

export const dynamic = "force-dynamic";

export default async function SlicesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sort = (await searchParams).sort === "best" ? "best" : "recent";
  const slices = await getAllVisits(sort);

  const tabClass = (active: boolean) =>
    `flex-1 text-center py-2 rounded-full text-sm font-semibold no-underline hover:no-underline transition-colors ${
      active ? "bg-accent" : ""
    }`;
  // Inline color: the global `a { color }` rule overrides Tailwind text utilities
  const tabStyle = (active: boolean) => ({ color: active ? "#ffffff" : "#6b7280" });

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-1">🍕 Slices</h1>
      <p className="text-sm text-warm-muted mb-6">
        Every slice I&apos;ve rated ({slices.length} total)
      </p>

      {/* Sort toggle */}
      <div className="flex gap-1 bg-white border border-warm-border rounded-full p-1 mb-6 shadow-sm">
        <Link href="/slices?sort=recent" className={tabClass(sort === "recent")} style={tabStyle(sort === "recent")}>
          Most Recent
        </Link>
        <Link href="/slices?sort=best" className={tabClass(sort === "best")} style={tabStyle(sort === "best")}>
          Best Rated
        </Link>
      </div>

      {slices.length === 0 ? (
        <p className="text-warm-muted italic">No slices rated yet.</p>
      ) : (
        <div className="space-y-3">
          {slices.map((v, i) => {
            const photo = firstPhoto(v.photoUrl) || v.shopPhotoUrl;
            return (
              <Link
                key={v.id}
                href={`/visits/${v.id}`}
                className="flex items-center gap-4 bg-white border border-warm-border rounded-xl p-4 hover:border-accent transition-colors no-underline shadow-sm"
              >
                {sort === "best" && (
                  <span className="text-xl font-black text-accent w-8 text-center">#{i + 1}</span>
                )}
                {photo ? (
                  <img src={photo} alt={v.sliceType} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
                ) : (
                  <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center text-2xl flex-shrink-0">🍕</div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 truncate">{v.shopName}</p>
                  <p className="text-sm text-warm-muted">
                    {v.sliceType} &middot; {v.date}
                  </p>
                </div>
                <span className="text-2xl font-black text-accent">
                  {Number(v.scoreOverall).toFixed(1)}
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
