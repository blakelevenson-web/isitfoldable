import Link from "next/link";
import { notFound } from "next/navigation";
import { getShopById, getVisitsForShop, getSliceTypesForShop } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function ShopDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const shop = await getShopById(id);
  if (!shop) notFound();

  const visits = await getVisitsForShop(id);
  const sliceTypes = await getSliceTypesForShop(id);
  const avg = visits.length > 0
    ? (visits.reduce((sum, v) => sum + v.scoreOverall, 0) / visits.length).toFixed(1)
    : null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Link href="/shops" className="text-sm text-accent font-medium mb-4 inline-block">
        ← Back to Shops
      </Link>

      {shop.photoUrl && (
        <img src={shop.photoUrl} alt={shop.name} className="w-full h-56 object-cover rounded-xl mb-6" />
      )}

      <h1 className="text-3xl font-bold mb-1">{shop.name}</h1>
      <p className="text-warm-muted mb-4">📍 {shop.address}</p>

      {avg && (
        <div className="inline-block bg-accent-light border border-accent/20 rounded-lg px-4 py-2 mb-6">
          <p className="text-sm text-warm-muted">Average Score</p>
          <p className="text-2xl font-black text-accent">{avg}</p>
        </div>
      )}

      {/* Slice Style Ratings */}
      {sliceTypes.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-bold mb-3">Slice Style Ratings</h2>
          <div className="space-y-2">
            {sliceTypes.map((st) => (
              <div key={st.sliceType} className="flex items-center justify-between bg-white border border-warm-border rounded-lg p-3">
                <span className="text-sm font-medium">{st.sliceType}</span>
                <span className="bg-accent-light text-accent font-bold px-3 py-1 rounded text-sm">{st.avgScore}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Visit History */}
      <section>
        <h2 className="text-lg font-bold mb-3">Visit History</h2>
        {visits.length === 0 ? (
          <p className="text-warm-muted italic">No visits recorded yet.</p>
        ) : (
          <div className="space-y-2">
            {visits.map((v) => (
              <div key={v.id} className="flex items-center justify-between bg-white border border-warm-border rounded-lg p-4">
                <div className="flex-1">
                  <p className="font-medium text-sm">{v.sliceType} — {v.date}</p>
                  {v.comments && (
                    <p className="text-xs text-warm-muted italic">&ldquo;{v.comments}&rdquo;</p>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xl font-black text-accent">{v.scoreOverall}.0</span>
                  <Link
                    href={`/visits/${v.id}`}
                    className="text-sm px-3 py-1 bg-accent text-white rounded-lg font-medium no-underline hover:bg-accent-dark"
                  >
                    Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
