/**
 * Player drain-cast occupant vs AoE list.
 *
 * Highlight (`isTileCastableLive`) paints empty area-expansion tiles for
 * Lifesteal Nova (`targetType: "area"` + `hitsMultiple`). Execute used a
 * single-target drain abort (`!targetEnemy` → `"abort"`) that was written
 * when Life Drain was the only drain kit — `getAoETargets` cannot build a
 * list without an occupant for that spell. Hits-multiple drain *does* build
 * the list from the clicked tile, so a highlighted empty anchor with a
 * living hostile in range never reached the damage loop.
 *
 * Single-target Life Drain still aborts on empty / corpse (no AP). Damage
 * numbers and drainPercent are unchanged.
 */

export type PlayerDrainSpell = {
  effectType?: string;
  hitsMultiple?: boolean;
};

export function playerDrainIsSingleTarget(spell: PlayerDrainSpell): boolean {
  if (spell.effectType !== "drain") return false;
  return spell.hitsMultiple !== true;
}

export function playerDrainBuildsAoEList(spell: PlayerDrainSpell): boolean {
  return spell.effectType === "drain" && spell.hitsMultiple === true;
}

/**
 * True when execute must abort before the damage loop. Must never be true
 * for a tile `isTileCastableLive` would accept on a hitsMultiple drain —
 * those tiles resolve through `getAoETargets` from the click.
 */
export function shouldAbortPlayerDrainForMissingHostile(
  spell: PlayerDrainSpell,
  targetEnemy: { id: string } | null | undefined,
): boolean {
  if (!playerDrainIsSingleTarget(spell)) return false;
  return !targetEnemy;
}
