/**
 * hitsAllies `__player__` sentinel is processed in `applyDamageToEnemy`
 * with the enemy-hit tally. `battleHitsRef` / `battleCritHitsRef` increment
 * before the identity branch, so a self-AoE crit counts toward
 * `critical_5_in_battle` (150 Doka) and inflates recap `hitsDealt`.
 *
 * The same loop lists enemies first, then `__player__`. Last-hostile
 * `processCombatantDeath` therefore runs before self-HP is written.
 * Victory persist is a later `[inBattle, enemies]` effect and currently
 * races the HP-watch effect for deathTriggered — hook order, not a
 * synchronous death linchpin like plague / melee.
 *
 * Wire in `applyDamageToEnemy` (not done here: castHelpers / WX conflict
 * with the oldest-first open-PR queue):
 *   const tally = hitsAlliesBattleHitDelta({
 *     hitTargetId: hitTarget.id,
 *     isCrit,
 *   });
 *   battleHitsRef.current += tally.hits;
 *   battleCritHitsRef.current += tally.crits;
 *   // on the `__player__` branch, after setCharacterStats:
 *   if (shouldRunHitsAlliesPlayerDeath(lethal)) onHitsAlliesPlayerDeath();
 *
 * Does not change damage math, RES, or shield.
 */

import {
  hpAfterIncomingDamage,
  shouldAwardVictory,
} from "../engine/battleSetup.ts";

/** Same sentinel `getAoETargets` / `applyDamageToEnemy` emit. */
export const HITS_ALLIES_PLAYER_SENTINEL_ID = "__player__";

export function isHitsAlliesPlayerSentinel(
  hitTargetId: string | undefined | null,
): boolean {
  return hitTargetId === HITS_ALLIES_PLAYER_SENTINEL_ID;
}

export type HitsAlliesBattleHitDelta = {
  hits: number;
  crits: number;
};

/**
 * Enemy-only tally. Self-AoE must not farm `critical_5_in_battle` or
 * inflate recap hitsDealt.
 */
export function hitsAlliesBattleHitDelta(opts: {
  hitTargetId: string | undefined | null;
  isCrit: boolean;
}): HitsAlliesBattleHitDelta {
  if (isHitsAlliesPlayerSentinel(opts.hitTargetId)) {
    return { hits: 0, crits: 0 };
  }
  return { hits: 1, crits: opts.isCrit === true ? 1 : 0 };
}

/**
 * HP after the `__player__` `setCharacterStats` line. Matches
 * `Math.max(0, prev.hp - finalDmg)` / `hpAfterIncomingDamage`.
 */
export function hitsAlliesPlayerHpAfterSelfHit(
  hpBefore: number,
  finalDmg: number,
): { newHp: number; lethal: boolean } {
  const dmg = Math.max(0, Math.floor(Number(finalDmg) || 0));
  return hpAfterIncomingDamage(hpBefore, dmg);
}

export function shouldRunHitsAlliesPlayerDeath(lethal: boolean): boolean {
  return lethal === true;
}

/**
 * Same-cast last-hostile + lethal self-AoE must not persist applyRewards.
 * Treat the self-hit as deathTriggered even if the HP-watch effect has
 * not run yet.
 */
export function shouldAwardVictoryAfterHitsAlliesAoE(opts: {
  inBattle: boolean;
  deathTriggered: boolean;
  selfHitLethal: boolean;
  battleStartIdsSize: number;
  hostilesRemaining: number;
}): boolean {
  return shouldAwardVictory({
    inBattle: opts.inBattle,
    deathTriggered: opts.deathTriggered || opts.selfHitLethal,
    battleStartIdsSize: opts.battleStartIdsSize,
    hostilesRemaining: opts.hostilesRemaining,
  });
}
