/**
 * Unpaid death 20/40 lives in localStorage until saveBattleStats lands.
 * Remount replay used to persist respawn HP and leftover XP/Doka, then leave
 * the Play-entry HP in the live ref. The next shop/heal saveBattleStats
 * captured that snapshot and wiped the death respawn
 * (`saveBattleStats` never mints; incoming HP is applied).
 *
 * File name sorts after `deathPenalty` so WorldExploration's import stays
 * merge-clean vs #385 (deathPenalty.ts) and #426 (queuedDeathPenaltyCut).
 */

import { respawnHpAfterDeath } from "./deathPenalty.ts";
import { resolveAbsoluteWriteHp } from "./itemShop.ts";

/** Death-penalty persist HP. Never the Play-entry / pre-death snapshot. */
export function hpForUnpaidDeathPersist(level: number): number {
  return respawnHpAfterDeath(level);
}

/**
 * After a remount replay write, snap live HP/XP to what saveBattleStats
 * actually persisted so a later shop click cannot reconstruct pre-death HP.
 */
export function liveStatsAfterDeathReplay<
  T extends { hp: number; exp: number },
>(prev: T, args: { xp: number; hp: number }): T {
  const xp = Math.max(0, Math.floor(Number(args.xp) || 0));
  const hp = Math.max(1, Math.floor(Number(args.hp) || 0));
  return { ...prev, exp: xp, hp };
}

/**
 * Shop/heal enqueue captures click-time HP, then beforeEach may flush the
 * unpaid death write (respawn HP). min(live, click) keeps the respawn when
 * the live ref was synced; leftover used live === click === Play-entry.
 */
export function absoluteWriteHpAfterDeathReplay(
  liveHp: number,
  clickHp: number,
): number {
  return resolveAbsoluteWriteHp(liveHp, clickHp);
}
