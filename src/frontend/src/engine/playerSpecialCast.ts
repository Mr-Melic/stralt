/**
 * Shared predicates for player special casts (Timestep, Mirror, Shield).
 *
 * Highlight already paints the caster tile for `self` / `ally`. Execute
 * used a different branch order: any self+buff returned `"cast"` before
 * Timestep ran, and Mirror sat inside the enemy-target loop so a
 * highlighted self tile never called `activateMirror`. These helpers are
 * the single “does this special resolve on this tile?” check so preview
 * and effect resolution cannot fork. Numbers are unchanged.
 */

export function playerShieldBuffResolves(spell: {
  targetType?: string;
  effectType?: string;
  buffStat?: string;
  buffModifier?: number;
  isTimestep?: boolean;
}): boolean {
  if (spell.isTimestep === true) return false;
  const t = (spell.targetType ?? "enemy") as string;
  if (t !== "self" && t !== "ally") return false;
  if (spell.effectType !== "buff") return false;
  if (!spell.buffStat) return false;
  return spell.buffModifier != null && Number.isFinite(Number(spell.buffModifier));
}

export function playerTimestepResolvesOnTile(
  spell: { isTimestep?: boolean },
  isPlayerTile: boolean,
): boolean {
  return spell.isTimestep === true && isPlayerTile;
}

export function playerMirrorResolvesOnTile(
  spell: { isMirror?: boolean },
  isPlayerTile: boolean,
): boolean {
  return spell.isMirror === true && isPlayerTile;
}
