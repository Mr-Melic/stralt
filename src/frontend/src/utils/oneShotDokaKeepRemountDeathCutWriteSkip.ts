/**
 * #800 stamps remount Doka keep after shrine / ground / dungeon-complete
 * `persistDokaCreditResult` transport-keep (`pbv_oneshot_doka_keep_remount_slotN`)
 * and honours replica wallet on remount **heal / shop**
 * `persistAbsoluteProgress`. Those flags / honour helpers never enter
 * `persistDeathPenalty`.
 *
 * Production death persist reads `progressPersist.snapshot().doka` (or
 * `resolveCommittedDokaForAbsoluteWrite`, which on a seeded remount lock
 * returns committed immediately). Remount `createProgressPersist` seeds
 * GameFlow `dokaBalance` — HUD credit waits for settle `commit`, so after
 * a one-shot keep that is still Play-entry 200.
 *
 * Remount after one-shot Doka keep **without** unpaid death is still a
 * wipe when the next write is lava death, not heal:
 *
 * Chronology:
 * 1. World hydrated. Lock doka=200 seeded. Canister 200. GameFlow
 *    `dokaBalance` stays 200.
 * 2. Ground / shrine / dungeon-complete `applyRewards(slot, doka, 0)`
 *    invokes then throws (canister 250 for a 50 pickup; shrine is 500).
 *    Confirm still reads 200. `settle` is `keep`. Lock stays 200. No
 *    unpaid death marker. #800 stamps keep.
 * 3. Actor reconnect remounts WorldExploration. New lock seeds
 *    `{ doka: dokaBalance }` = **200**. Session unconfirmed flags are gone.
 * 4. Leftover #800: heal `resolveCommittedDokaAfterOneShotDokaKeepRemount`
 *    fetches 250. Unique leftover: lava death `persistDeathPenalty` uses
 *    remount committed 200, `computeDeathPenalty` → Doka **120**.
 *    `saveBattleStats` applies incoming-below-stored; the pickup grant
 *    is gone.
 *
 * Unique vs **#800** (heal/shop honour of this stamp), **#869** (victory
 * death honour of `pbv_victory_doka_keep_remount_slotN`), and **#866**
 * (Boss Rush death honour of a different stamp).
 *
 * This sidecar reads the same #800 stamp and honours replica wallet as
 * the death-cut **base** so 20/40 taxes 250 → 150 (or shrine 500 → 300),
 * not Play-entry 200 → 120. Stale live ≤ stamped `preDoka` fail-closes.
 * Fresh replica commits onto the lock then the death write runs.
 * Pickup-only (no stamp) still cuts 200 → 120.
 *
 * Do not stamp here — #800 notes keep after one-shot settle `keep`.
 * Explicit `applyRewards failed` is settle `release` and never stamps.
 * Do not restack WX / progressPersist / deathPenalty / dokaPersist /
 * #800 file.
 *
 * Tests reproduce remount death vs the gated skip. Restack death persist
 * onto `persistDeathPenaltyThroughOneShotDokaKeepRemount` after #800
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
 * Same key as #800 `oneShotDokaKeepRemountKey`. Remount death honour
 * must read the one-shot transport-keep stamp, not a second key.
 */
export function oneShotDokaKeepRemountDeathCutKey(slot: number): string {
  return `pbv_oneshot_doka_keep_remount_slot${Math.max(1, toNat(slot))}`;
}

export type OneShotDokaKeepRemountDeathCutStamp = {
  /** Lock wallet before the transport-keep grant. */
  preDoka: number;
};

export function readOneShotDokaKeepRemountDeathCut(
  storage: DeathPenaltyStorage,
  slot: number,
): OneShotDokaKeepRemountDeathCutStamp | null {
  try {
    const raw = storage.getItem(oneShotDokaKeepRemountDeathCutKey(slot));
    if (!raw) return null;
    const parsed = JSON.parse(
      raw,
    ) as Partial<OneShotDokaKeepRemountDeathCutStamp>;
    if (parsed.preDoka == null) return null;
    return { preDoka: toNat(parsed.preDoka) };
  } catch {
    return null;
  }
}

export function writeOneShotDokaKeepRemountDeathCut(
  storage: DeathPenaltyStorage,
  slot: number,
  stamp: OneShotDokaKeepRemountDeathCutStamp,
): void {
  try {
    storage.setItem(
      oneShotDokaKeepRemountDeathCutKey(slot),
      JSON.stringify({ preDoka: toNat(stamp.preDoka) }),
    );
  } catch {
    // private mode
  }
}

export function clearOneShotDokaKeepRemountDeathCut(
  storage: DeathPenaltyStorage,
  slot: number,
): void {
  try {
    storage.removeItem(oneShotDokaKeepRemountDeathCutKey(slot));
  } catch {
    // ignore
  }
}

export function hasOneShotDokaKeepRemountDeathCut(
  storage: DeathPenaltyStorage,
  slot: number,
): boolean {
  return readOneShotDokaKeepRemountDeathCut(storage, slot) != null;
}

/**
 * Tests / restack fixtures. Production stamping stays on #800
 * `noteOneShotDokaKeepRemount` after one-shot settle `keep`.
 */
export function noteOneShotDokaKeepRemountDeathCut(
  storage: DeathPenaltyStorage,
  slot: number,
  preDoka: number,
): void {
  writeOneShotDokaKeepRemountDeathCut(storage, slot, {
    preDoka: toNat(preDoka),
  });
}

export function dokaFromOneShotDeathCutWallet(raw: unknown): number | null {
  if (raw == null) return null;
  if (typeof raw === "object" && raw !== null && "ok" in raw) {
    return dokaFromOneShotDeathCutWallet((raw as { ok: unknown }).ok);
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
export function shouldRefuseOneShotDokaKeepRemountDeathCutStaleDoka(args: {
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
 * #800 keep stamp says a one-shot grant may already be on the canister.
 * Stale Play-entry equal to stamped `preDoka` must not fall back to
 * remount wallet (that is the wipe: 40% of 200 → 120 over 250).
 */
export function dokaForOneShotDokaKeepRemountDeathCut(args: {
  remountDoka: number;
  liveDoka: number | null;
  keep: boolean;
  stampedPreDoka: number;
}): number | null {
  if (
    shouldRefuseOneShotDokaKeepRemountDeathCutStaleDoka({
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
 * 120. Gated fresh 250 → 150. Shrine altar 500 → 300.
 */
export function deathPenaltyAfterOneShotDokaKeepRemount(args: {
  xp: number;
  remountDoka: number;
  liveDoka: number | null;
  keep: boolean;
  stampedPreDoka: number;
}): DeathPenaltyAmounts | null {
  const base = dokaForOneShotDokaKeepRemountDeathCut({
    remountDoka: args.remountDoka,
    liveDoka: args.liveDoka,
    keep: args.keep,
    stampedPreDoka: args.stampedPreDoka,
  });
  if (base == null) return null;
  return computeDeathPenalty(args.xp, base);
}

function refuseStaleOneShotDokaKeepRemountDeathCut(): never {
  throw new Error(ABSOLUTE_WRITE_UNCONFIRMED_CREDIT);
}

export type OneShotDokaKeepRemountDeathCutPersist = {
  snapshot: () => { doka: number; xp: number; level: number };
  commit?: (next: { doka?: number; xp?: number; level?: number }) => void;
  enqueue: <T>(
    fn: () => Promise<T>,
    opts?: { skipBeforeEach?: boolean },
  ) => Promise<T>;
};

/**
 * persistDeathPenalty remount wallet used Play-entry Doka 200 after a
 * one-shot transport-keep. Fetch `getCallerDokaBalance` when the #800
 * remount keep stamp exists. Stale live ≤ stamped `preDoka` throws.
 *
 * Success adopts replica onto the lock and clears the stamp so a later
 * leftover heal cannot tax Play-entry again. Fail-close keeps the stamp.
 */
export async function resolveCommittedDokaAfterOneShotDokaKeepRemountDeathCut(
  persist: Pick<OneShotDokaKeepRemountDeathCutPersist, "snapshot" | "commit">,
  readWallet: () => Promise<unknown>,
  storage: DeathPenaltyStorage,
  slot: number,
): Promise<number> {
  const remountDoka = toNat(persist.snapshot().doka);
  const stamp = readOneShotDokaKeepRemountDeathCut(storage, slot);
  if (!stamp) return remountDoka;

  let liveDoka: number | null = null;
  try {
    liveDoka = dokaFromOneShotDeathCutWallet(await readWallet());
  } catch (err) {
    if (
      err instanceof Error &&
      err.message === ABSOLUTE_WRITE_UNCONFIRMED_CREDIT
    ) {
      throw err;
    }
    refuseStaleOneShotDokaKeepRemountDeathCut();
  }

  const honoured = dokaForOneShotDokaKeepRemountDeathCut({
    remountDoka,
    liveDoka,
    keep: true,
    stampedPreDoka: stamp.preDoka,
  });
  if (honoured == null) refuseStaleOneShotDokaKeepRemountDeathCut();
  persist.commit?.({ doka: honoured });
  clearOneShotDokaKeepRemountDeathCut(storage, slot);
  return honoured;
}

/**
 * Death persist enqueue: honour replica Doka from the #800 stamp, then
 * `computeDeathPenalty` on that base. Production uses `skipBeforeEach`
 * so unpaid flush cannot recut. Call this instead of bare death enqueue
 * when restacking WorldExploration `persistDeathPenalty`.
 */
export async function persistDeathPenaltyThroughOneShotDokaKeepRemount<
  T,
>(args: {
  persist: OneShotDokaKeepRemountDeathCutPersist;
  storage: DeathPenaltyStorage;
  slot: number;
  readWallet: () => Promise<unknown>;
  applyAndCommit: (after: DeathPenaltyAmounts) => Promise<T>;
}): Promise<T> {
  return args.persist.enqueue(
    async () => {
      const committed = args.persist.snapshot();
      const dokaBase =
        await resolveCommittedDokaAfterOneShotDokaKeepRemountDeathCut(
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
