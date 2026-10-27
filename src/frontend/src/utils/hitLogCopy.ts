/**
 * Combat-log unit names. Display only — not wired into castHelpers.ts /
 * WorldExploration.tsx (forbidden while older open PRs own those files).
 *
 * UX-HIT-LOG-PIECETYPE: damage and enemy-cast lines print chess `pieceType`
 * (`pawn takes 12 damage`, `bishop casts Strike on you`) instead of the
 * assigned unit name. Distinct from UX-SUMMON-NAME-PIECETYPE (summon bar)
 * and UX-INSPECT-SUMMON-AS-ENEMY (inspect side label).
 */

function displayName(raw: string): string {
  const name = String(raw ?? "").trim();
  return name || "Enemy";
}

function floorNat(n: number): number {
  return Math.max(0, Math.floor(Number(n) || 0));
}

/** Prefer assigned name over chess pieceType. */
export function combatantLogName(unit: {
  name?: string;
  assignedName?: string;
  pieceType?: string;
}): string {
  const named = String(unit.name ?? "").trim();
  if (named) return named;
  const assigned = String(unit.assignedName ?? "").trim();
  if (assigned) return assigned;
  return displayName(unit.pieceType ?? "");
}

export function takesDamageLog(
  unitName: string,
  damage: number,
  hpLeft: number,
): string {
  const who = displayName(unitName);
  const dmg = floorNat(damage);
  const hp = floorNat(hpLeft);
  return `${who} takes ${dmg} damage (${hp} HP left)`;
}

export function enemyCastsOnYouLog(
  casterName: string,
  spellName: string,
  damage: number,
): string {
  const who = displayName(casterName);
  const spell = displayName(spellName);
  const dmg = floorNat(damage);
  return `${who} casts ${spell} on you for ${dmg} dmg`;
}
