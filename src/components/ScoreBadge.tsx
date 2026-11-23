import { scoreBadgeClass } from "@/lib/score";

export function ScoreBadge({ score, size = "md" }: { score: number; size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "w-8 h-8 text-sm",
    md: "w-10 h-10 text-base",
    lg: "w-14 h-14 text-xl",
  };

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full font-bold ${sizeClasses[size]} ${scoreBadgeClass(score)}`}
    >
      {Number(score).toFixed(1)}
    </span>
  );
}
