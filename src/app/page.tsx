import Link from "next/link";
import { getRecentVisits, getElite8, getStats } from "@/lib/queries";
import { SearchBar } from "@/components/SearchBar";
import { firstPhoto } from "@/lib/photos";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const recent = await getRecentVisits(3);
  const elite8 = await getElite8();
  const stats = await getStats();

  return (
    <div>
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Search Bar */}
        <SearchBar />

        {/* Stats Card */}
        <div className="bg-gradient-to-r from-red-500 to-red-800 text-white rounded-2xl p-6 text-center shadow-lg mb-8">
          <h2 className="text-2xl font-bold" style={{ color: '#FFD700' }}>
            {stats.totalShops} Shops Rated &nbsp;|&nbsp; {stats.totalSlices} Slices Rated
          </h2>
        </div>

        {/* Recent Slices */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            🍕 Recent Slices
          </h2>
          {recent.length === 0 ? (
            <p className="text-warm-muted italic">No reviews yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {recent.map((v) => {
                const photo = firstPhoto(v.photoUrl) || v.shopPhotoUrl;
                return (
                <Link
                  key={v.id}
                  href={`/visits/${v.id}`}
                  className="block bg-white border border-warm-border rounded-xl overflow-hidden hover:border-accent transition-colors no-underline shadow-sm"
                >
                  {photo && (
                    <img src={photo} alt={v.sliceType} className="w-full aspect-video object-cover" />
                  )}
                  <div className="p-4">
                    <p className="font-bold text-gray-900">{v.shopName}</p>
                    <p className="text-sm text-warm-muted">{v.sliceType} &middot; {v.date}</p>
                    {v.comments && (
                      <p className="text-sm text-warm-muted italic mt-2">&ldquo;{v.comments}&rdquo;</p>
                    )}
                    <div className="text-right mt-2">
                      <span className="inline-block bg-accent-light text-accent font-bold px-3 py-1 rounded text-sm">
                        {v.scoreOverall}.0
                      </span>
                    </div>
                  </div>
                </Link>
                );
              })}
            </div>
          )}
        </section>

        {/* Elite 8 */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            🏆 The Elite 8
          </h2>
          {elite8.length === 0 ? (
            <p className="text-warm-muted italic">Not enough data yet.</p>
          ) : (
            <div className="space-y-3">
              {elite8.map((v, i) => {
                const photo = firstPhoto(v.photoUrl) || v.shopPhotoUrl;
                return (
                <Link
                  key={v.id}
                  href={`/visits/${v.id}`}
                  className="flex items-center gap-4 bg-white border border-warm-border rounded-xl p-4 hover:border-accent transition-colors no-underline shadow-sm"
                >
                  <span className="text-2xl font-black text-accent w-8 text-center">#{i + 1}</span>
                  {photo && (
                    <img src={photo} alt={v.sliceType} className="w-14 h-14 rounded-lg object-cover" />
                  )}
                  <div className="flex-1">
                    <p className="font-bold text-gray-900">{v.shopName} ({v.sliceType})</p>
                  </div>
                  <span className="text-2xl font-black text-accent">{v.scoreOverall}.0</span>
                </Link>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
