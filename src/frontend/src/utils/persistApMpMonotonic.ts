/**
 * saveBattleStats writes AP/MP as min(incoming, persistAp/MpWriteCap)
 * (main.mo 2054–2055). Unlike XP/Doka (min incoming vs stored) this can
 * raise pools up to the formula cap and can cut a grown stored pool when a
 * stale heal/death snapshot sends the pre-level-up max.
 *
 * applyRewards does not write AP/MP. Official create seeds AP=10 / MP=5
 * (startingChampionStats) above PLAYER_BASE 8/4; persist*WriteCap
 * grandfathers that stored value as the cap, not as a keep-store vs incoming.
 *
 * Distinct from SDEG-006 (generation for XP/Doka), 09-21-003 (hard cap 20),
 * and HP (incoming lower is intended for damage/death). No schema.
 */

import { persistApWriteCap, persistMpWriteCap } from "./adminSafety.ts";

/** Mirrors saveBattleStats AP/MP: incoming, then cap. Not min(incoming, stored). */
export function saveBattleStatsApWrite(
  stored: number,
  incoming: number,
  level: number,
  threshold: number,
): number {
  const raw = Math.max(0, Math.floor(Number(incoming) || 0));
  return Math.min(raw, persistApWriteCap(stored, level, threshold));
}

export function saveBattleStatsMpWrite(
  stored: number,
  incoming: number,
  level: number,
  threshold: number,
): number {
  const raw = Math.max(0, Math.floor(Number(incoming) || 0));
  return Math.min(raw, persistMpWriteCap(stored, level, threshold));
}

export function staleSaveBattleStatsWouldCutGrownAp(args: {
  storedGrown: number;
  staleIncoming: number;
  level: number;
  threshold: number;
}): boolean {
  return (
    saveBattleStatsApWrite(
      args.storedGrown,
      args.staleIncoming,
      args.level,
      args.threshold,
    ) < args.storedGrown
  );
}

export function saveBattleStatsCanRaiseApTowardCap(args: {
  stored: number;
  incoming: number;
  level: number;
  threshold: number;
}): boolean {
  return (
    saveBattleStatsApWrite(
      args.stored,
      args.incoming,
      args.level,
      args.threshold,
    ) > args.stored
  );
}
