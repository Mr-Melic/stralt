/**
 * saveBattleStats writes an absolute wallet/XP snapshot. Credits belong on
 * applyRewards. This clamp is the backend contract: never mint Doka/XP and
 * never adopt a client level (applyRewards is the only level writer).
 */

function toNat(n: number, fallback: number): number {
  const value = Math.floor(Number(n));
  return Number.isFinite(value) ? value : fallback;
}

export type AbsoluteStatsSnapshot = {
  doka: number;
  xp: number;
  level: number;
};

export function clampSaveBattleStatsWrite(
  stored: AbsoluteStatsSnapshot,
  incoming: AbsoluteStatsSnapshot,
): AbsoluteStatsSnapshot {
  const storedDoka = Math.max(0, toNat(stored.doka, 0));
  const storedXp = Math.max(0, toNat(stored.xp, 0));
  const storedLevel = Math.max(1, toNat(stored.level, 1));
  const writeDoka = Math.max(0, toNat(incoming.doka, storedDoka));
  const writeXp = Math.max(0, toNat(incoming.xp, storedXp));
  return {
    doka: Math.min(storedDoka, writeDoka),
    xp: Math.min(storedXp, writeXp),
    level: storedLevel,
  };
}

export type OffensiveStatsSnapshot = {
  atk: number;
  res: number;
  init: number;
};

/**
 * Mirrors saveBattleStats atk/res/init: min(incoming, stored). Official
 * heals send the current store. There is no persist grow writer for these
 * fields (or sp/sr/chc/evasion/resilience).
 */
export function clampSaveBattleStatsOffensiveStats(
  stored: OffensiveStatsSnapshot,
  incoming: OffensiveStatsSnapshot,
): OffensiveStatsSnapshot {
  const storedAtk = Math.max(0, toNat(stored.atk, 0));
  const storedRes = Math.max(0, toNat(stored.res, 0));
  const storedInit = Math.max(0, toNat(stored.init, 0));
  return {
    atk: Math.min(storedAtk, Math.max(0, toNat(incoming.atk, storedAtk))),
    res: Math.min(storedRes, Math.max(0, toNat(incoming.res, storedRes))),
    init: Math.min(storedInit, Math.max(0, toNat(incoming.init, storedInit))),
  };
}
