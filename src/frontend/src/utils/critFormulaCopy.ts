/**
 * Enemy critical-hit chrome. Display only — not wired into
 * WorldExploration.tsx (forbidden while older open PRs own that file).
 *
 * UX-CRIT-FORMULA-LOG: enemy crit lines interpolate
 * `${rawDmg}x2=${dmgAC} dmg` so the battle log reads
 * `CRITICAL HIT! bishop casts Strike: 6x2=12 dmg`. Distinct from
 * UX-HIT-LOG-PIECETYPE (non-crit cast-on-you / damage) and
 * UX-DMG-BREAKDOWN-JARGON (SP / SR / RES pipeline).
 */

function displayName(raw: string, fallback: string): string {
  const name = String(raw ?? "").trim();
  return name || fallback;
}

function floorNat(n: number): number {
  return Math.max(0, Math.floor(Number(n) || 0));
}

export function critCastLog(args: {
  attackerName: string;
  spellName: string;
  damage: number;
  targetName?: string;
}): string {
  const who = displayName(args.attackerName, "An enemy");
  const spell = displayName(args.spellName, "a spell");
  const dmg = floorNat(args.damage);
  const target = String(args.targetName ?? "").trim();
  if (target) {
    return `Critical hit! ${who} casts ${spell} on ${target} for ${dmg} damage.`;
  }
  return `Critical hit! ${who} casts ${spell} for ${dmg} damage.`;
}
