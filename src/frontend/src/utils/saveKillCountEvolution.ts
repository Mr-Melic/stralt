/**
 * CharacterStats.killCount is a required persist field. Official play never
 * writes it: useSaveKillCount has no component caller. Every cohort — yesterday,
 * six months, before the leaderboard existed — stores 0. That 0 is valid
 * historical data, not a hole to backfill.
 *
 * saveKillCount adds incoming kills (max 64 per call) with no write generation.
 * Wiring the existing hook without idempotency would mint on retry. getLeaderboard
 * copies killCount from the highest-level slot only (strict `>`), so a wired
 * writer on a lower-level slot would not show.
 *
 * Distinct from MTD-005 / docs "wire or drop". SDEG: do not treat 0 as
 * incomplete; do not add an additive writer without SDEG-006. No schema.
 */

export const SAVE_KILL_COUNT_MAX_PER_CALL = 64;

export function officialClientWritesKillCount(): boolean {
  return false;
}

export function saveKillCountAddsIncomingKills(): boolean {
  return true;
}

export function zeroKillCountIsValidHistoricalData(): boolean {
  return true;
}

export function leaderboardKillCountFollowsHighestLevelSlot(): boolean {
  return true;
}

/** getLeaderboard updates bestKills only when c.level > bestLevel, not >=. */
export function leaderboardPicksFirstSlotOnTiedLevel(): boolean {
  return true;
}

export function saveKillCountRetryWouldMint(
  alreadyPersisted: number,
  incomingBattleKills: number,
): boolean {
  const add = Math.max(0, Math.floor(incomingBattleKills));
  const cap = Math.min(add, SAVE_KILL_COUNT_MAX_PER_CALL);
  return alreadyPersisted + cap > alreadyPersisted && cap > 0;
}
