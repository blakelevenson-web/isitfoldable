export function ScoreBadge({ score, size = "md" }: { score: number; size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "w-8 h-8 text-sm",
    md: "w-10 h-10 text-base",
    lg: "w-14 h-14 text-xl",
  };

  const colorClasses =
    score >= 4
      ? "bg-green-100 text-green-800 border-green-300"
      : score >= 3
      ? "bg-yellow-100 text-yellow-800 border-yellow-300"
      : "bg-red-100 text-red-800 border-red-300";

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full border font-bold ${sizeClasses[size]} ${colorClasses}`}
    >
      {score}
    </span>
  );
}
