/**
 * Unbounded player level vs content/encounter caps.
 *
 * applyRewards level is Motoko Nat with no stored max. combatMath
 * pickEnemyLevelFromTiers uses maxTier = floor(999 / tierSize), so a
 * player above 999 fights as if they were 999. Admin region/enemy
 * drafts default levelMax 9999. WX picks the first region where
 * Number(levelMin) <= level <= Number(levelMax); above every region the
 * player gets no battleEffects (content hole, not a character wipe).
 *
 * Do not silently assume a maximum player level in persist. Do not edit
 * combatMath / WorldExploration while older PRs queue.
 */

export const PICK_ENEMY_LEVEL_PLAYER_CAP = 999;
export const ADMIN_DEFAULT_ELIGIBILITY_LEVEL_MAX = 9999;

export function encounterLevelCapSilencesPlayerLevel(
  playerLevel: number,
  cap: number = PICK_ENEMY_LEVEL_PLAYER_CAP,
): boolean {
  return playerLevel > cap;
}

export type RegionLevelBand = {
  levelMin: number | bigint;
  levelMax: number | bigint;
};

export function matchingRegionIds(
  playerLevel: number,
  regions: readonly (RegionLevelBand & { id?: string })[],
): string[] {
  return regions
    .filter((region) => {
      const min = Number(region.levelMin);
      const max = Number(region.levelMax);
      return playerLevel >= min && playerLevel <= max;
    })
    .map((region, index) => region.id ?? `region-${index}`);
}

export function regionEligibilityMissesPlayer(
  playerLevel: number,
  regions: readonly RegionLevelBand[],
): boolean {
  return matchingRegionIds(playerLevel, regions).length === 0;
}
