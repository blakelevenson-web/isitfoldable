import Link from "next/link";
import { ScoreBadge } from "./ScoreBadge";

type VisitCardProps = {
  id: string;
  shopName: string;
  scoreOverall: number;
  date: string;
  sliceType: string;
  photoUrl?: string | null;
};

export function VisitCard({ id, shopName, scoreOverall, date, sliceType, photoUrl }: VisitCardProps) {
  return (
    <Link
      href={`/visits/${id}`}
      className="block bg-white border border-warm-border rounded-xl p-4 hover:shadow-md transition-shadow no-underline"
    >
      {photoUrl && (
        <img src={photoUrl} alt={sliceType} className="w-full aspect-video object-cover rounded-lg mb-3" />
      )}
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-semibold text-sm text-gray-900">{shopName}</p>
          <p className="text-xs text-warm-muted">{sliceType} &middot; {date}</p>
        </div>
        <ScoreBadge score={scoreOverall} />
      </div>
    </Link>
  );
}
