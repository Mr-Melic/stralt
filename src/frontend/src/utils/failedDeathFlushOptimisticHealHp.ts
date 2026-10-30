/**
 * Failed death persist flush overlapping an optimistic overworld Heal.
 *
 * `persistDeathPenalty` and the reload replay both write
 * `respawnHpAfterDeath`. The persist-lock `beforeEach` flush does not:
 * `WorldExploration.tsx` 1464–1482 passes `hp: characterStatsRef.current.hp`.
 * Heal applies optimistic HP onto that ref before `persistAbsoluteProgress`
 * enqueues, so the flush stamps the unpaid bar, then a failed heal job
 * leaves it on the canister.
 *
 * Distinct from **#1326** (shop during heal in-flight stamps HP via
 * `persistAbsoluteProgress`) and **#1335** (rename/feat/GameKey Doka move
 * skips AND rollback; later shop stamps). Those Doka movers never write HP
 * in the death flush. Distinct from **#1339** (unconfirmed one-shot pending
 * wipe — player-loss, not an HP mint). Death persist itself still writes
 * respawn HP; this leftover is only the `beforeEach` retry.
 *
 * Production (`WorldExploration.tsx`):
 *   - Death persist / replay: `hp: respawnHp` / `respawnHpAfterDeath` (13015,
 *     13220).
 *   - `setBeforeEach` flush `writePenalty`: `hp: stats.hp ?? 0` (1470).
 *   - Heal click writes the ref then enqueues (18423–18459).
 *
 * Chronology:
 * 1. World hydrated. Level 1. Canister HP 10 (combat leftover), Doka 200,
 *    XP 100. Player dies. Optimistic UI HP 50 / Doka 120. Pending written.
 *    `saveBattleStats` rejects after retries. Lock commits 120; canister
 *    still 10 / 200. Pending remains.
 * 2. Respawn (Game Over blocks the HUD until then). Heal. Optimistic HP 200
 *    / Doka 70. `persistAbsoluteProgress` enqueues.
 * 3. `beforeEach` `flushPendingDeathPenalty` writes live HP 200 + penalty
 *    Doka 120 / XP 80.
 * 4. Heal job returns false (unseeded skip / replica reject / transport).
 *    AND rollback may restore the UI; the canister already has HP 200.
 * 5. Reload hydrates HP 200. Start after death should be HP 50 Doka 120.
 *    Unpaid +150 HP. Survives reload; backend HP; repeatable on the next
 *    failed death persist.
 *
 * Sidecar only so WX / deathPenalty / #387 / #595 / #1326 / #1335 / #1339
 * stay merge-clean. Restack after those PRs:
 *   `writePenalty` HP → `hpForPendingDeathPenaltyFlush(committed.level)`
 *   (never `characterStatsRef.current.hp`).
 *
 * Intended 20/40 rates and 1 Doka : 3 HP unchanged.
 */

import { respawnHpAfterDeath } from "./deathPenalty.ts";
import { resolveAbsoluteWriteHp } from "./itemShop.ts";
import { applySpendToCommitted } from "./progressPersist.ts";

/** Live WX `beforeEach` flush reads the live stats ref, not respawn HP. */
export function liveWxPendingDeathFlushWritesLiveHp(): boolean {
  return true;
}

/** Reload replay / persistDeathPenalty write respawn HP, not live HP. */
export function deathPersistAndReplayWriteRespawnHp(): boolean {
  return true;
}

/**
 * Absolute HP for a pending-death flush / replay. Must match
 * `persistDeathPenalty` so an optimistic heal cannot ride the 20/40 write.
 */
export function hpForPendingDeathPenaltyFlush(level: number): number {
  return respawnHpAfterDeath(level);
}

/** Leftover WX 1470: `hp: stats.hp ?? 0`. */
export function liveWxPendingDeathFlushHp(liveHp: number): number {
  return Math.max(0, Math.floor(Number(liveHp) || 0));
}

export function hpWrittenByPendingDeathFlush(args: {
  liveHp: number;
  level: number;
  useRespawnHp: boolean;
}): number {
  if (args.useRespawnHp) {
    return hpForPendingDeathPenaltyFlush(args.level);
  }
  return liveWxPendingDeathFlushHp(args.liveHp);
}

export type FailedDeathFlushHealWrite = {
  canisterHp: number;
  canisterDoka: number;
  canisterXp: number;
  liveHp: number;
  liveDoka: number;
  flushWrote: boolean;
  healPersistWrote: boolean;
};

/**
 * Reproduce a failed death persist, then Respawn → Heal whose `beforeEach`
 * flush stamps HP. `useRespawnHpOnFlush` is the restack; live WX passes
 * false.
 */
export function simulateFailedDeathFlushOptimisticHeal(args: {
  level: number;
  startXp: number;
  startDoka: number;
  canisterHpBeforeFlush: number;
  liveHpAtFlush: number;
  healCost: number;
  healPersistOk: boolean;
  useRespawnHpOnFlush: boolean;
}): FailedDeathFlushHealWrite {
  const level = Math.max(1, Math.floor(Number(args.level) || 1));
  const startXp = Math.max(0, Math.floor(Number(args.startXp) || 0));
  const startDoka = Math.max(0, Math.floor(Number(args.startDoka) || 0));
  const canisterHpBeforeFlush = Math.max(
    0,
    Math.floor(Number(args.canisterHpBeforeFlush) || 0),
  );
  const liveHpAtFlush = Math.max(
    0,
    Math.floor(Number(args.liveHpAtFlush) || 0),
  );
  const healCost = Math.max(0, Math.floor(Number(args.healCost) || 0));

  const xpLost = Math.floor(startXp * 0.2);
  const dokaLost = Math.floor(startDoka * 0.4);
  const afterXp = Math.max(0, startXp - xpLost);
  const afterDoka = Math.max(0, startDoka - dokaLost);

  // Death persist rejected. Canister still uncut. UI already at respawn /
  // penalty, then Heal optimistic.
  let canisterHp = canisterHpBeforeFlush;
  let canisterDoka = startDoka;
  let canisterXp = startXp;
  const liveHp = liveHpAtFlush;
  let liveDoka = Math.max(0, afterDoka - healCost);

  const flushHp = hpWrittenByPendingDeathFlush({
    liveHp: liveHpAtFlush,
    level,
    useRespawnHp: args.useRespawnHpOnFlush,
  });
  canisterHp = flushHp;
  canisterDoka = afterDoka;
  canisterXp = afterXp;
  const flushWrote = true;

  let healPersistWrote = false;
  if (args.healPersistOk && healCost > 0) {
    healPersistWrote = true;
    canisterHp = resolveAbsoluteWriteHp(liveHp, liveHpAtFlush);
    canisterDoka = applySpendToCommitted(canisterDoka, healCost);
    liveDoka = canisterDoka;
  }

  return {
    canisterHp,
    canisterDoka,
    canisterXp,
    liveHp,
    liveDoka,
    flushWrote,
    healPersistWrote,
  };
}

/** Unpaid HP the death flush stamped when the heal job never paid. */
export function leftoverUnpaidHealHpAfterDeathFlush(args: {
  respawnHp: number;
  wroteHp: number;
  healPersistWrote: boolean;
}): number {
  if (args.healPersistWrote) return 0;
  const respawnHp = Math.max(0, Math.floor(Number(args.respawnHp) || 0));
  const wroteHp = Math.max(0, Math.floor(Number(args.wroteHp) || 0));
  return Math.max(0, wroteHp - respawnHp);
}
