/**
 * Boss kit-spell apply must not treat `targetX`/`targetY` as a walk dest.
 *
 * `useBossAI` kit returns `{ type: "spell", targetX: player.x, targetY: player.y }`.
 * The apply layer used to `updateCombatant` that aim after damage, stacking
 * the boss on the player every time `pickBossKitSpell` wins (empty cooldown
 * map → first pool id every turn on a non-empty kit). Ability moves still
 * commit via `abilityResult.newBossPosition`.
 */
export function bossKitSpellPositionToCommit(_args: {
  origin: { x: number; y: number };
  aim: { x: number; y: number } | null | undefined;
}): { x: number; y: number } | null {
  return null;
}
