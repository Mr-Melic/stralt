/**
 * Chain Lightning bounce chrome. Display only — not wired into
 * castHelpers.ts (forbidden while older open PRs own that file).
 *
 * UX-CHAIN-BOUNCE-ID: applyDamageToEnemy logs
 * `${spell.name} bounced to ${bounceEnemy.id} for ${bounceDmg} damage!`
 * so the battle log reads `Chain Lightning bounced to e-3 for 8 damage!`.
 * Distinct from UX-HIT-LOG-PIECETYPE (primary hit uses pieceType) and
 * UX-EFFECT-APPLY-TARGETID (buff/DoT apply lines).
 */

function looksInternId(raw: string): boolean {
  return /^(e-\d+|summon-\d+|__player__)$/i.test(String(raw ?? "").trim());
}

function displayName(raw: string, fallback: string): string {
  const name = String(raw ?? "").trim();
  if (!name || looksInternId(name)) return fallback;
  return name;
}

function floorNat(n: number): number {
  return Math.max(0, Math.floor(Number(n) || 0));
}

export function chainBounceTargetLabel(unit: {
  id?: string;
  name?: string;
  assignedName?: string;
}): string {
  const named = String(unit.name ?? "").trim();
  if (named && !looksInternId(named)) return named;
  const assigned = String(unit.assignedName ?? "").trim();
  if (assigned && !looksInternId(assigned)) return assigned;
  return "an enemy";
}

export function chainBounceLog(
  spellName: string,
  targetName: string,
  damage: number,
): string {
  const spell = displayName(spellName, "The spell");
  const who = displayName(targetName, "an enemy");
  const dmg = floorNat(damage);
  return `${spell} bounced to ${who} for ${dmg} damage!`;
}
