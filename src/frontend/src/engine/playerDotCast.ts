/**
 * Player-bar DoT early-return.
 *
 * `resolvePlayerCast` applies a DoT and returns before the damage loop.
 * Seeded Soul Rend (`soul_rend`) is `effectType: "dot"` with `damage: 25`
 * and no `dotDamage` / `dotDamagePerTurn`, so that return spent AP on a
 * 0 dmg/turn stack. Poison Arrow / Inferno still have a positive tick
 * and must keep the early return.
 *
 * Own file so sibling combat PRs that also touch `spellEngine.ts` are
 * not concatenated. `resolvePlayerCast` inlines `dotPpt > 0` (no new
 * import) to stay off the restacked import cluster.
 */

export function playerDotDamagePerTurn(spell: {
  dotDamagePerTurn?: unknown;
  dotDamage?: unknown;
}): number {
  const ppt = Number(spell.dotDamagePerTurn ?? spell.dotDamage ?? 0);
  return Number.isFinite(ppt) && ppt > 0 ? ppt : 0;
}

export function playerDotIsTagged(spell: {
  isDotSpell?: boolean;
  effectType?: string;
}): boolean {
  return spell.isDotSpell === true || spell.effectType === "dot";
}

/** True only when the DoT branch would apply a real tick. */
export function playerDotEarlyReturnApplies(spell: {
  isDotSpell?: boolean;
  effectType?: string;
  dotDamagePerTurn?: unknown;
  dotDamage?: unknown;
}): boolean {
  return playerDotIsTagged(spell) && playerDotDamagePerTurn(spell) > 0;
}

/** `resolvePlayerCast` DoT early-return — needs a live enemy and a real tick. */
export function playerDotShouldEarlyReturn(
  spell: {
    isDotSpell?: boolean;
    effectType?: string;
    dotDamagePerTurn?: unknown;
    dotDamage?: unknown;
  },
  hasEnemyTarget: boolean,
): boolean {
  return hasEnemyTarget === true && playerDotEarlyReturnApplies(spell);
}
