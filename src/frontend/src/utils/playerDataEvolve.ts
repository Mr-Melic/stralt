/**
 * Long-lived player-record contracts that must not silently assume a
 * maximum level, a closed combat-stat set, or a one-shot session default.
 *
 * Behavior mirrors live Motoko. Do not add required persist fields here.
 */

export const SAVE_KILL_COUNT_PER_CALL_MAX = 64;

/** `getSessionState` uses 50 when `bloodBalance` is still null. */
export const LEGACY_BLOOD_BALANCE_DEFAULT = 50;

function toNat(n: unknown, fallback: number): number {
  const value = Math.floor(Number(n));
  return Number.isFinite(value) ? value : fallback;
}

/**
 * `saveKillCount` **adds** `kills` (capped at 64 per call). Official UI
 * never calls it. A retry of the same battle mints a second +N. Motoko
 * `#err`s above 64 rather than clamping.
 */
export function saveKillCountDeltaRejected(kills: number): string | null {
  const delta = toNat(kills, 0);
  if (delta > SAVE_KILL_COUNT_PER_CALL_MAX) {
    return "kills exceed single-battle bound";
  }
  return null;
}

export function nextKillCountAfterSave(
  stored: number,
  incomingDelta: number,
): { next: number } | { err: string } {
  const rejected = saveKillCountDeltaRejected(incomingDelta);
  if (rejected) return { err: rejected };
  const storedNat = Math.max(0, toNat(stored, 0));
  const delta = Math.max(0, toNat(incomingDelta, 0));
  return { next: storedNat + delta };
}

/**
 * Pre-feature characters have `bloodBalance = null`. The query default is
 * 50, not 0 — a six-month-old row first calling getSessionState jumps to
 * mid-scale blood, not empty.
 */
export function hydrateBloodBalance(stored: number | null | undefined): number {
  if (stored == null) return LEGACY_BLOOD_BALANCE_DEFAULT;
  const value = toNat(stored, LEGACY_BLOOD_BALANCE_DEFAULT);
  if (value < 0) return 0;
  if (value > 100) return 100;
  return value;
}

/**
 * Battle-init HP is compounding (`100 * (1+g)^ (L-1)`). Persist cap is
 * linear (`100 + (L-1)*g`). First 1 HP clip at L4 at 5%; 10 HP at L10.
 */
export function compoundingBattleInitHp(
  level: number,
  growthPercent: number,
): number {
  const lvl = Math.max(1, toNat(level, 1));
  const growth = Math.max(0, toNat(growthPercent, 0));
  if (growth <= 0) return 100;
  return Math.round(100 * (1 + growth / 100) ** (lvl - 1));
}

export function linearPersistedHp(
  level: number,
  growthPercent: number,
): number {
  const lvl = Math.max(1, toNat(level, 1));
  const growth = Math.max(1, toNat(growthPercent, 1));
  return 100 + (lvl - 1) * growth;
}

export function battleInitHpExceedsPersistCap(
  level: number,
  growthPercent: number,
): boolean {
  return (
    compoundingBattleInitHp(level, growthPercent) >
    linearPersistedHp(level, growthPercent)
  );
}
