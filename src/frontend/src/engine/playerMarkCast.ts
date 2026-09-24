/**
 * Player Mark (`spell-mark`, `isMark`).
 *
 * Advertised effect is a **tile** mark: the next hit on that cell deals x2.
 * Highlight (`isTileCastableLive`) paints empty in-range tiles for
 * `targetType: "enemy"` the same way it paints a living hostile. Execute
 * kept `placeMark` inside the `targetEnemy || hitsMultiple` loop, so a
 * highlighted empty (or corpse) tile returned `"cast"` without marking —
 * AP spent, no x2 later.
 *
 * Occupied-tile Mark already placed and returned before damage. Hoisting
 * to the same empty-tile family as Barrier / Summon keeps that path and
 * lets a highlighted empty anchor execute. The caster tile stays illegal
 * (`caster_tile_hostile` in the live gate). Damage numbers and the x2
 * consume in `calculatePlayerDamage` are unchanged.
 */

export type PlayerMarkSpell = {
  isMark?: boolean;
};

export function playerMarkResolvesOnTile(
  spell: PlayerMarkSpell,
  isPlayerTile: boolean,
): boolean {
  return spell.isMark === true && isPlayerTile !== true;
}

export function playerMarkAbortsOnCasterTile(
  spell: PlayerMarkSpell,
  isPlayerTile: boolean,
): boolean {
  return spell.isMark === true && isPlayerTile === true;
}
