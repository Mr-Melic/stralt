/**
 * Achievement condition ids that victory / persist must keep stable.
 *
 * Victory emits `boss_defeated_${bossId}` (`victoryAchievements.ts`). Live
 * `knownAchievementCondition` is an exact 15-string allowlist with no prefix,
 * so those conditions never match a seedable config (SDEG-2026-10-22-001).
 * Do not rename a boss id without an alias: the condition string is the key.
 */

export const BOSS_DEFEAT_CONDITION_PREFIX = "boss_defeated_";

export function bossDefeatAchievementCondition(bossId: string): string {
  const id = bossId.trim();
  if (id.length === 0) return "";
  return `${BOSS_DEFEAT_CONDITION_PREFIX}${id}`;
}

export function isBossDefeatAchievementCondition(condition: string): boolean {
  return (
    condition.startsWith(BOSS_DEFEAT_CONDITION_PREFIX) &&
    condition.length > BOSS_DEFEAT_CONDITION_PREFIX.length
  );
}

/**
 * Intended admin/canister allowlist. Exact catalog ids stay required so a
 * free-form `instant_win` cannot be seeded. Boss-defeat uses a stable prefix
 * because the suffix is a content id that must survive catalog growth.
 */
export function achievementConditionShouldBeConfigurable(
  condition: string,
  exactKnown: readonly string[],
): boolean {
  return (
    exactKnown.includes(condition) ||
    isBossDefeatAchievementCondition(condition)
  );
}
