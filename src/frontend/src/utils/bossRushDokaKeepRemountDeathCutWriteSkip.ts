/**
 * #864 stamps remount Doka keep after Boss Rush room-clear `applyRewards`
 * throw-after-add (`pbv_boss_rush_doka_keep_remount_slotN`) and honours
 * replica wallet on remount **heal / shop** `persistAbsoluteProgress`.
 * Those flags / honour helpers never enter `persistDeathPenalty`.
 *
 * Production death persist reads `progressPersist.snapshot().doka` (or
 * `resolveCommittedDokaForAbsoluteWrite`, which on a seeded remount lock
 * returns committed immediately). Remount `createProgressPersist` seeds
 * GameFlow `dokaBalance` — HUD credit waits for parsed commit, so after a
 * throw-after-add that is still Play-entry 200.
 *
 * Remount after Boss Rush Doka keep **without** unpaid death is still a
 * wipe when the next write is lava death, not heal:
 *
 * Chronology:
 * 1. World hydrated. Lock doka=200 seeded. Canister 200. GameFlow
 *    `dokaBalance` stays 200.
 * 2. Room 0 clear writes `currentRoom` first, then
 *    `applyRewards(slot, 500, xp)` invokes then throws (canister 700).
 *    Catch only `logDebugError`s. Lock stays 200. No unpaid death
 *    marker. #864 stamps keep. Room already advanced, so the grant
 *    cannot be re-farmed.
 * 3. Actor reconnect remounts WorldExploration. New lock seeds
 *    `{ doka: dokaBalance }` = **200**. Session unconfirmed flags are gone.
 * 4. Leftover #864: heal `resolveCommittedDokaAfterBossRushDokaKeepRemount`
 *    fetches 700. Unique leftover: lava death `persistDeathPenalty` uses
 *    remount committed 200, `computeDeathPenalty` → Doka **120**.
 *    `saveBattleStats` applies incoming-below-stored; the room-clear
 *    grant is gone.
 *
 * This sidecar reads the same #864 stamp and honours replica wallet as
 * the death-cut **base** so 20/40 taxes 700 → 420, not Play-entry 200 →
 * 120. Stale live ≤ stamped `preDoka` fail-closes. Fresh 700 commits
 * onto the lock then the death write runs. Pickup-only (no stamp) still
 * cuts 200 → 120.
 *
 * Do not stamp here — #864 notes keep after room-clear throw-after-add.
 * Explicit `applyRewards failed` never stamps. Do not restack WX /
 * progressPersist / deathPenalty / bossRushProgress / #864 file.
 *
 * Tests reproduce remount death vs the gated skip. Restack death persist
 * onto `persistDeathPenaltyThroughBossRushDokaKeepRemount` after #864
 * lands. No Motoko.
 */

import {
  type DeathPenaltyAmounts,
  type DeathPenaltyStorage,
  computeDeathPenalty,
} from "./deathPenalty.ts";
import { ABSOLUTE_WRITE_UNCONFIRMED_CREDIT } from "./progressPersist.ts";

function toNat(n: number | null | undefined): number {
  return Math.max(0, Math.floor(Number(n) || 0));
}

/**
 * Same key as #864 `bossRushDokaKeepRemountKey`. Remount death honour
 * must read the room-clear throw-after-add stamp, not a second key.
 */
export function bossRushDokaKeepRemountDeathCutKey(slot: number): string {
  return `pbv_boss_rush_doka_keep_remount_slot${Math.max(1, toNat(slot))}`;
}

export type BossRushDokaKeepRemountDeathCutStamp = {
  /** Lock wallet before the throw-after-add grant. */
  preDoka: number;
};

export function readBossRushDokaKeepRemountDeathCut(
  storage: DeathPenaltyStorage,
  slot: number,
): BossRushDokaKeepRemountDeathCutStamp | null {
  try {
    const raw = storage.getItem(bossRushDokaKeepRemountDeathCutKey(slot));
    if (!raw) return null;
    const parsed = JSON.parse(
      raw,
    ) as Partial<BossRushDokaKeepRemountDeathCutStamp>;
    if (parsed.preDoka == null) return null;
    return { preDoka: toNat(parsed.preDoka) };
  } catch {
    return null;
  }
}

export function writeBossRushDokaKeepRemountDeathCut(
  storage: DeathPenaltyStorage,
  slot: number,
  stamp: BossRushDokaKeepRemountDeathCutStamp,
): void {
  try {
    storage.setItem(
      bossRushDokaKeepRemountDeathCutKey(slot),
      JSON.stringify({ preDoka: toNat(stamp.preDoka) }),
    );
  } catch {
    // private mode
  }
}

export function clearBossRushDokaKeepRemountDeathCut(
  storage: DeathPenaltyStorage,
  slot: number,
): void {
  try {
    storage.removeItem(bossRushDokaKeepRemountDeathCutKey(slot));
  } catch {
    // ignore
  }
}

export function hasBossRushDokaKeepRemountDeathCut(
  storage: DeathPenaltyStorage,
  slot: number,
): boolean {
  return readBossRushDokaKeepRemountDeathCut(storage, slot) != null;
}

/**
 * Tests / restack fixtures. Production stamping stays on #864
 * `noteBossRushDokaKeepRemount` after room-clear throw-after-add.
 */
export function noteBossRushDokaKeepRemountDeathCut(
  storage: DeathPenaltyStorage,
  slot: number,
  preDoka: number,
): void {
  writeBossRushDokaKeepRemountDeathCut(storage, slot, {
    preDoka: toNat(preDoka),
  });
}

export function dokaFromBossRushDeathCutWallet(raw: unknown): number | null {
  if (raw == null) return null;
  if (typeof raw === "object" && raw !== null && "ok" in raw) {
    return dokaFromBossRushDeathCutWallet((raw as { ok: unknown }).ok);
  }
  const n = Number(raw);
  if (!Number.isFinite(n)) return null;
  return toNat(n);
}

/**
 * Stale Play-entry / session cache still equals or sits below the pre-keep
 * lock. `applyRewards` only adds, so a live wallet that did not rise is
 * stale (or placeholder 0). Missing live is fail-closed only when a keep
 * stamp exists.
 */
export function shouldRefuseBossRushDokaKeepRemountDeathCutStaleDoka(args: {
  keep: boolean;
  liveDoka: number | null;
  stampedPreDoka: number;
}): boolean {
  if (args.keep !== true) return false;
  if (args.liveDoka == null) return true;
  return toNat(args.liveDoka) <= toNat(args.stampedPreDoka);
}

/**
 * Honour remount death-cut **base** Doka from replica wallet when the
 * #864 keep stamp says a room-clear grant may already be on the canister.
 * Stale Play-entry equal to stamped `preDoka` must not fall back to
 * remount wallet (that is the wipe: 40% of 200 → 120 over 700).
 */
export function dokaForBossRushDokaKeepRemountDeathCut(args: {
  remountDoka: number;
  liveDoka: number | null;
  keep: boolean;
  stampedPreDoka: number;
}): number | null {
  if (
    shouldRefuseBossRushDokaKeepRemountDeathCutStaleDoka({
      keep: args.keep,
      liveDoka: args.liveDoka,
      stampedPreDoka: args.stampedPreDoka,
    })
  ) {
    return null;
  }
  if (args.keep === true) {
    return args.liveDoka == null ? null : toNat(args.liveDoka);
  }
  return toNat(args.remountDoka);
}

/**
 * 20/40 on the honoured wallet. Ungated remount uses Play-entry 200 →
 * 120. Gated fresh 700 → 420.
 */
export function deathPenaltyAfterBossRushDokaKeepRemount(args: {
  xp: number;
  remountDoka: number;
  liveDoka: number | null;
  keep: boolean;
  stampedPreDoka: number;
}): DeathPenaltyAmounts | null {
  const base = dokaForBossRushDokaKeepRemountDeathCut({
    remountDoka: args.remountDoka,
    liveDoka: args.liveDoka,
    keep: args.keep,
    stampedPreDoka: args.stampedPreDoka,
  });
  if (base == null) return null;
  return computeDeathPenalty(args.xp, base);
}

function refuseStaleBossRushDokaKeepRemountDeathCut(): never {
  throw new Error(ABSOLUTE_WRITE_UNCONFIRMED_CREDIT);
}

export type BossRushDokaKeepRemountDeathCutPersist = {
  snapshot: () => { doka: number; xp: number; level: number };
  commit?: (next: { doka?: number; xp?: number; level?: number }) => void;
  enqueue: <T>(
    fn: () => Promise<T>,
    opts?: { skipBeforeEach?: boolean },
  ) => Promise<T>;
};

/**
 * persistDeathPenalty remount wallet used Play-entry Doka 200 after a
 * Boss Rush throw-after-add. Fetch `getCallerDokaBalance` when the #864
 * remount keep stamp exists. Stale live ≤ stamped `preDoka` throws.
 *
 * Success adopts replica onto the lock and clears the stamp so a later
 * leftover heal cannot tax Play-entry again. Fail-close keeps the stamp.
 */
export async function resolveCommittedDokaAfterBossRushDokaKeepRemountDeathCut(
  persist: Pick<BossRushDokaKeepRemountDeathCutPersist, "snapshot" | "commit">,
  readWallet: () => Promise<unknown>,
  storage: DeathPenaltyStorage,
  slot: number,
): Promise<number> {
  const remountDoka = toNat(persist.snapshot().doka);
  const stamp = readBossRushDokaKeepRemountDeathCut(storage, slot);
  if (!stamp) return remountDoka;

  let liveDoka: number | null = null;
  try {
    liveDoka = dokaFromBossRushDeathCutWallet(await readWallet());
  } catch (err) {
    if (
      err instanceof Error &&
      err.message === ABSOLUTE_WRITE_UNCONFIRMED_CREDIT
    ) {
      throw err;
    }
    refuseStaleBossRushDokaKeepRemountDeathCut();
  }

  const honoured = dokaForBossRushDokaKeepRemountDeathCut({
    remountDoka,
    liveDoka,
    keep: true,
    stampedPreDoka: stamp.preDoka,
  });
  if (honoured == null) refuseStaleBossRushDokaKeepRemountDeathCut();
  persist.commit?.({ doka: honoured });
  clearBossRushDokaKeepRemountDeathCut(storage, slot);
  return honoured;
}

/**
 * Death persist enqueue: honour replica Doka from the #864 stamp, then
 * `computeDeathPenalty` on that base. Production uses `skipBeforeEach`
 * so unpaid flush cannot recut. Call this instead of bare death enqueue
 * when restacking WorldExploration `persistDeathPenalty`.
 */
export async function persistDeathPenaltyThroughBossRushDokaKeepRemount<
  T,
>(args: {
  persist: BossRushDokaKeepRemountDeathCutPersist;
  storage: DeathPenaltyStorage;
  slot: number;
  readWallet: () => Promise<unknown>;
  applyAndCommit: (after: DeathPenaltyAmounts) => Promise<T>;
}): Promise<T> {
  return args.persist.enqueue(
    async () => {
      const committed = args.persist.snapshot();
      const dokaBase =
        await resolveCommittedDokaAfterBossRushDokaKeepRemountDeathCut(
          args.persist,
          args.readWallet,
          args.storage,
          args.slot,
        );
      const after = computeDeathPenalty(committed.xp, dokaBase);
      return args.applyAndCommit(after);
    },
    { skipBeforeEach: true },
  );
}
