/**
 * Enemy lava / ice / spikes landing chrome. Display only — not wired
 * into WorldExploration.tsx (forbidden while older open PRs own that file).
 *
 * UX-ENEMY-HAZARD-PIECETYPE (reported 2026-10-29, helper locked this run):
 * `${enemy.pieceType} walked on lava!`, `stepped on ice! Slowed!`,
 * `hit spikes!`. Ice still says Slowed (UX-ICE-SLOW-MISLABEL). Distinct
 * from UX-ENEMY-TURN-PIECETYPE (heal / skip / uses) and UX-HIT-LOG-PIECETYPE
 * (damage / cast-on-you). Do not restack iceHazardCopy.ts (#1178).
 */

export type EnemyHazardKind = "lava" | "ice" | "spikes";

function displayName(raw: string): string {
  const name = String(raw ?? "").trim();
  return name || "An enemy";
}

function floorNat(n: number): number {
  return Math.max(0, Math.floor(Number(n) || 0));
}

export function enemyHazardLog(
  unitName: string,
  kind: EnemyHazardKind,
  damage?: number,
): string {
  const who = displayName(unitName);
  if (kind === "lava") {
    return `${who} walked on lava! -${floorNat(damage ?? 0)} HP`;
  }
  if (kind === "ice") {
    return `${who} stepped on ice! Frozen!`;
  }
  return `${who} hit spikes! -${floorNat(damage ?? 0)} HP`;
}
