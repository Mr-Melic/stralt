/**
 * Paper Windstorm player miss range gate.
 *
 * Motoko `defaultMapModifiers` paper_windstorm: "Ranged spells further than
 * 1 tile away have a 50% chance to miss." Live enemy apply already gates
 * `spellRange > 1` before the 50% roll (`WorldExploration.tsx` ~16491 /
 * fallback Fire Bolt ~16729).
 *
 * Player `resolvePlayerCast` called `paperWindstormMiss` for every damage-loop
 * spell whenever the modifier was active. That callback ignores range and
 * rolls 30%, so Strike (`physical_attack`, range 1, 2 AP) and other melee
 * returned `"cast"` (AP spent) on a no-op. Announce text and
 * `MAP_MODIFIER_PAPER_WINDSTORM_RANGE_REDUCTION` also describe ranged-only.
 *
 * This helper matches the enemy range band. The existing player 30% roll
 * stays in WX `paperWindstormMiss` (do not change to enemy 50% — balance).
 * Swap / DoT / Sacrifice / summon / barrier return before the damage loop
 * and are unchanged. #363 only floats `Missed!` on the same WX roll.
 *
 * Restack `resolvePlayerCast` onto
 * `if (ctx.isPaperWindstorm && paperWindstormSpellRangeCanMiss(spell.range))`
 * in front of `paperWindstormMiss` after older combat PRs that touch
 * `spellEngine.ts` land. Do not double-apply the 30% roll.
 */

/** Existing player damage-loop miss rate. Enemy apply uses 0.5. */
export const PLAYER_PAPER_WINDSTORM_MISS_CHANCE = 0.3;

/**
 * Catalog `spell.range` as a tile count. BigInt bindgen values and missing
 * range fail closed (melee / no miss).
 */
export function paperWindstormSpellRange(range: unknown): number {
  if (typeof range === "bigint") {
    const n = Number(range);
    return Number.isFinite(n) ? Math.floor(n) : 0;
  }
  const n = Number(range);
  if (!Number.isFinite(n)) return 0;
  return Math.floor(n);
}

/**
 * True when Paper Windstorm's miss roll is allowed. Same `> 1` band as
 * enemy apply (`Number(chosenSpell.range) > 1`).
 */
export function paperWindstormSpellRangeCanMiss(range: unknown): boolean {
  return paperWindstormSpellRange(range) > 1;
}

/**
 * Full player miss predicate for tests / restack. Range gate then the
 * existing 30% roll. `roll01` is `[0, 1)` from `Math.random` / `ctx.rng`.
 */
export function paperWindstormPlayerCastMisses(args: {
  spellRange: unknown;
  roll01: number;
}): boolean {
  if (!paperWindstormSpellRangeCanMiss(args.spellRange)) return false;
  return args.roll01 < PLAYER_PAPER_WINDSTORM_MISS_CHANCE;
}
