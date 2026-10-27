/**
 * Spell-hit battle-log chrome. Display only — not wired into
 * spellEngine.ts (combat-parity PRs own the damage pipeline).
 *
 * UX-DMG-BREAKDOWN-JARGON: resolveSpellCast appends
 * `base → scaled → sp +N% → sr N% × res N% → final`. Chat highlights
 * `|[...]|` tokens, but this path is a raw engineer pipeline.
 * Distinct from UX-INSPECT-STAT-WORDS (inspect chips) and
 * UX-HIT-LOG-PIECETYPE (unit name).
 */

function displayName(raw: string): string {
  const name = String(raw ?? "").trim();
  return name || "Spell";
}

function floorNat(n: number): number {
  return Math.max(0, Math.floor(Number(n) || 0));
}

/** Final damage only. No SP/SR/RES pipeline. */
export function spellDealtDamageLog(
  spellName: string,
  finalDamage: number,
): string {
  const name = displayName(spellName);
  const dmg = floorNat(finalDamage);
  return `${name} dealt ${dmg} damage.`;
}

/** Optional absorbed-amount whisper when resistance actually ate some of the hit. */
export function resistanceAbsorbedNote(absorbed: number): string {
  const n = floorNat(absorbed);
  if (n <= 0) return "";
  return ` Resistance absorbed ${n}.`;
}
