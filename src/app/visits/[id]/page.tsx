import Link from "next/link";
import { notFound } from "next/navigation";
import { getVisitById } from "@/lib/queries";
import { parsePhotos } from "@/lib/photos";

export const dynamic = "force-dynamic";

export default async function VisitDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const visit = await getVisitById(id);
  if (!visit) notFound();

  const breakdownScores = [
    { label: "Dough", value: visit.scoreDough },
    { label: "Sauce", value: visit.scoreSauce },
    { label: "Cheese", value: visit.scoreCheese },
    { label: "Foldability", value: visit.scoreFoldability },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Link href={`/shops/${visit.shopId}`} className="text-sm text-accent font-medium mb-4 inline-block">
        ← Back to {visit.shopName}
      </Link>

      {(() => {
        const photos = parsePhotos(visit.photoUrl);
        if (photos.length === 0) return null;
        if (photos.length === 1) return (
          <img src={photos[0]} alt={visit.sliceType} className="w-full max-h-96 object-contain bg-gray-50 rounded-xl mb-6" />
        );
        return (
          <div className="grid grid-cols-2 gap-2 mb-6">
            {photos.map((url, i) => (
              <img key={i} src={url} alt={`${visit.sliceType} photo ${i + 1}`} className="w-full max-h-80 object-contain bg-gray-50 rounded-xl" />
            ))}
          </div>
        );
      })()}

      <h1 className="text-3xl font-bold mb-1">{visit.sliceType} Style</h1>
      <p className="text-sm text-warm-muted mb-6">Rated on {visit.date}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Score Breakdown */}
        <div>
          <h2 className="text-lg font-bold mb-4">Score Breakdown</h2>
          <div className="space-y-4">
            {breakdownScores.map((s) => (
              <div key={s.label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">{s.label}</span>
                  <span className="text-sm text-warm-muted">{Number(s.value).toFixed(1)}/10.0</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-5 relative">
                  <div
                    className="bg-accent h-5 rounded-full transition-all flex items-center justify-end"
                    style={{ width: `${(s.value / 10) * 100}%` }}
                  >
                    <span className="text-sm leading-none -mr-3 w-6 h-6 flex items-center justify-center rounded-full bg-white border-2 border-yellow-400 shadow-sm">🍕</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Overall + Notes */}
        <div>
          <div className="bg-accent-light border border-accent/20 rounded-xl p-6 text-center mb-6">
            <p className="text-sm text-warm-muted mb-1">Overall Score</p>
            <p className="text-5xl font-black text-accent">{Number(visit.scoreOverall).toFixed(1)}</p>
          </div>

          <h2 className="text-lg font-bold mb-2">Reviewer&apos;s Notes</h2>
          {visit.comments ? (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800 italic">&ldquo;{visit.comments}&rdquo;</p>
            </div>
          ) : (
            <p className="text-warm-muted text-sm italic">No comments.</p>
          )}
        </div>
      </div>
    </div>
  );
}
