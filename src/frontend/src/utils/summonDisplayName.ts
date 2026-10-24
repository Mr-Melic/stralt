/** Title-case a pieceType / raw summon name ("knight" → "Knight"). */
export function formatSummonDisplayName(raw: string): string {
  const s = String(raw ?? "").trim();
  if (!s) return "Summon";
  return s
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}
