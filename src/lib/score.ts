// Shared styling for overall scores, so every page shows them the same way.
// (Score-based color-coding was tried and dropped — all scores use the site's red accent.)

/** Text color for big standalone numbers. */
export function scoreTextClass(_score: number): string {
  return "text-accent";
}

/** Background + text color for pill/badge-style scores. */
export function scoreBadgeClass(_score: number): string {
  return "bg-accent-light text-accent";
}
