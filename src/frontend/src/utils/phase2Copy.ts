/**
 * Boss phase-2 announce chrome. Display only — not wired into
 * WorldExploration.tsx (forbidden while older open PRs own that file).
 *
 * UX-PHASE2-STATS-X (reported 2026-10-29, helper locked this run):
 * non-Weeping-Pawn phase 2 logs
 * `⚡ ${name} PHASE 2! Stats boosted ×${mult}!`. “Stats” never names
 * HP / AP / damage. Distinct from UX-BOSS-BANNER-FLASH (1.5s purple SaaS)
 * and UX-WEEPING-PROMOTE-SHOUT (Weeping Pawn ALL-CAPS line).
 */

function displayName(raw: string): string {
  const name = String(raw ?? "").trim();
  return name || "The boss";
}

/** Ignore the intern multiplier. Do not print ×N. */
export function phase2Log(bossName: string, _mult?: number): string {
  return `${displayName(bossName)} enters phase 2 — stronger now.`;
}
