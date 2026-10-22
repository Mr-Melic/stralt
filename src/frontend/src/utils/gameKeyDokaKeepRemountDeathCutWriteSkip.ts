/**
 * #811 stamps remount Doka keep after GameKey `redeemGameKey` throw-after-add
 * (`pbv_gamekey_doka_keep_remount_slotN`) and honours replica wallet on
 * remount **heal / shop** `persistAbsoluteProgress`. Those flags / honour
 * helpers never enter `persistDeathPenalty`.
 *
 * Production death persist reads `progressPersist.snapshot().doka` (or
 * `resolveCommittedDokaForAbsoluteWrite`, which on a seeded remount lock
 * returns committed immediately). Remount `createProgressPersist` seeds
 * GameFlow `dokaBalance` — HUD credit waits for parsed `#ok` then
 * `onDokaCredited`, so after a throw-after-add that is still Play-entry
 * 200. `shouldApplyCallerDokaHydrate` ignores later wallet refetches
 * while the world session stays mounted.
 *
 * Remount after GameKey Doka keep **without** unpaid death is still a
 * wipe when the next write is lava death, not heal:
 *
 * Chronology:
 * 1. World hydrated. Lock doka=200 seeded. Canister 200. GameFlow
 *    `dokaBalance` stays 200.
 * 2. Shop `redeemGameKey` adds 1000 (canister 1200) then the replica
 *    rejects. `#ok` is never parsed. Commit never runs. Shop catch only
 *    toasts "Redeem failed". Lock stays 200. No unpaid death marker.
 *    #545 / #552 session flags die on remount. #811 stamps keep.
 * 3. Actor reconnect remounts WorldExploration. New lock seeds
 *    `{ doka: dokaBalance }` = **200**. Session unconfirmed flags are gone.
 * 4. Leftover #811: heal `resolveCommittedDokaAfterGameKeyDokaKeepRemount`
 *    fetches 1200. Unique leftover: lava death `persistDeathPenalty` uses
 *    remount committed 200, `computeDeathPenalty` → Doka **120**.
 *    `saveBattleStats` applies incoming-below-stored; the paid grant is
 *    gone. Retry hits "GameKey already used".
 *
 * Unique vs **#811** (heal/shop honour of this stamp), **#869** (victory
 * death), **#866** (Boss Rush death), and **#877** (one-shot death).
 *
 * This sidecar reads the same #811 stamp and honours replica wallet as
 * the death-cut **base** so 20/40 taxes 1200 → 720, not Play-entry
 * 200 → 120. Stale live ≤ stamped `preDoka` fail-closes. Fresh 1200
 * commits onto the lock then the death write runs. Pickup-only (no
 * stamp) still cuts 200 → 120.
 *
 * Do not stamp here — #811 notes keep after GameKey throw-after-add.
 * Explicit `#err` (`already used`, `Invalid GameKey`, `not yet approved`,
 * `redeemGameKey failed`) never stamps. Do not restack WX /
 * progressPersist / deathPenalty / shopPurchase / DokaGameKeyShop /
 * #811 file.
 *
 * Tests reproduce remount death vs the gated skip. Restack death persist
 * onto `persistDeathPenaltyThroughGameKeyDokaKeepRemount` after #811
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
 * Same key as #811 `gameKeyDokaKeepRemountKey`. Remount death honour
 * must read the GameKey throw-after-add stamp, not a second key.
 */
export function gameKeyDokaKeepRemountDeathCutKey(slot: number): string {
  return `pbv_gamekey_doka_keep_remount_slot${Math.max(1, toNat(slot))}`;
}

export type GameKeyDokaKeepRemountDeathCutStamp = {
  /** Lock wallet before the throw-after-add grant. */
  preDoka: number;
};

export function readGameKeyDokaKeepRemountDeathCut(
  storage: DeathPenaltyStorage,
  slot: number,
): GameKeyDokaKeepRemountDeathCutStamp | null {
  try {
    const raw = storage.getItem(gameKeyDokaKeepRemountDeathCutKey(slot));
    if (!raw) return null;
    const parsed = JSON.parse(
      raw,
    ) as Partial<GameKeyDokaKeepRemountDeathCutStamp>;
    if (parsed.preDoka == null) return null;
    return { preDoka: toNat(parsed.preDoka) };
  } catch {
    return null;
  }
}

export function writeGameKeyDokaKeepRemountDeathCut(
  storage: DeathPenaltyStorage,
  slot: number,
  stamp: GameKeyDokaKeepRemountDeathCutStamp,
): void {
  try {
    storage.setItem(
      gameKeyDokaKeepRemountDeathCutKey(slot),
      JSON.stringify({ preDoka: toNat(stamp.preDoka) }),
    );
  } catch {
    // private mode
  }
}

export function clearGameKeyDokaKeepRemountDeathCut(
  storage: DeathPenaltyStorage,
  slot: number,
): void {
  try {
    storage.removeItem(gameKeyDokaKeepRemountDeathCutKey(slot));
  } catch {
    // ignore
  }
}

export function hasGameKeyDokaKeepRemountDeathCut(
  storage: DeathPenaltyStorage,
  slot: number,
): boolean {
  return readGameKeyDokaKeepRemountDeathCut(storage, slot) != null;
}

/**
 * Tests / restack fixtures. Production stamping stays on #811
 * `noteGameKeyDokaKeepRemount` after GameKey throw-after-add.
 */
export function noteGameKeyDokaKeepRemountDeathCut(
  storage: DeathPenaltyStorage,
  slot: number,
  preDoka: number,
): void {
  writeGameKeyDokaKeepRemountDeathCut(storage, slot, {
    preDoka: toNat(preDoka),
  });
}

export function dokaFromGameKeyDeathCutWallet(raw: unknown): number | null {
  if (raw == null) return null;
  if (typeof raw === "object" && raw !== null && "ok" in raw) {
    return dokaFromGameKeyDeathCutWallet((raw as { ok: unknown }).ok);
  }
  const n = Number(raw);
  if (!Number.isFinite(n)) return null;
  return toNat(n);
}

/**
 * Stale Play-entry / session cache still equals or sits below the pre-keep
 * lock. `redeemGameKey` only adds, so a live wallet that did not rise is
 * stale (or placeholder 0). Missing live is fail-closed only when a keep
 * stamp exists.
 */
export function shouldRefuseGameKeyDokaKeepRemountDeathCutStaleDoka(args: {
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
 * #811 keep stamp says a GameKey grant may already be on the canister.
 * Stale Play-entry equal to stamped `preDoka` must not fall back to
 * remount wallet (that is the wipe: 40% of 200 → 120 over 1200).
 */
export function dokaForGameKeyDokaKeepRemountDeathCut(args: {
  remountDoka: number;
  liveDoka: number | null;
  keep: boolean;
  stampedPreDoka: number;
}): number | null {
  if (
    shouldRefuseGameKeyDokaKeepRemountDeathCutStaleDoka({
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
 * 120. Gated fresh 1200 → 720.
 */
export function deathPenaltyAfterGameKeyDokaKeepRemount(args: {
  xp: number;
  remountDoka: number;
  liveDoka: number | null;
  keep: boolean;
  stampedPreDoka: number;
}): DeathPenaltyAmounts | null {
  const base = dokaForGameKeyDokaKeepRemountDeathCut({
    remountDoka: args.remountDoka,
    liveDoka: args.liveDoka,
    keep: args.keep,
    stampedPreDoka: args.stampedPreDoka,
  });
  if (base == null) return null;
  return computeDeathPenalty(args.xp, base);
}

function refuseStaleGameKeyDokaKeepRemountDeathCut(): never {
  throw new Error(ABSOLUTE_WRITE_UNCONFIRMED_CREDIT);
}

export type GameKeyDokaKeepRemountDeathCutPersist = {
  snapshot: () => { doka: number; xp: number; level: number };
  commit?: (next: { doka?: number; xp?: number; level?: number }) => void;
  enqueue: <T>(
    fn: () => Promise<T>,
    opts?: { skipBeforeEach?: boolean },
  ) => Promise<T>;
};

/**
 * persistDeathPenalty remount wallet used Play-entry Doka 200 after a
 * GameKey throw-after-add. Fetch `getCallerDokaBalance` when the #811
 * remount keep stamp exists. Stale live ≤ stamped `preDoka` throws.
 *
 * Success adopts replica onto the lock and clears the stamp so a later
 * leftover heal cannot tax Play-entry again. Fail-close keeps the stamp.
 */
export async function resolveCommittedDokaAfterGameKeyDokaKeepRemountDeathCut(
  persist: Pick<GameKeyDokaKeepRemountDeathCutPersist, "snapshot" | "commit">,
  readWallet: () => Promise<unknown>,
  storage: DeathPenaltyStorage,
  slot: number,
): Promise<number> {
  const remountDoka = toNat(persist.snapshot().doka);
  const stamp = readGameKeyDokaKeepRemountDeathCut(storage, slot);
  if (!stamp) return remountDoka;

  let liveDoka: number | null = null;
  try {
    liveDoka = dokaFromGameKeyDeathCutWallet(await readWallet());
  } catch (err) {
    if (
      err instanceof Error &&
      err.message === ABSOLUTE_WRITE_UNCONFIRMED_CREDIT
    ) {
      throw err;
    }
    refuseStaleGameKeyDokaKeepRemountDeathCut();
  }

  const honoured = dokaForGameKeyDokaKeepRemountDeathCut({
    remountDoka,
    liveDoka,
    keep: true,
    stampedPreDoka: stamp.preDoka,
  });
  if (honoured == null) refuseStaleGameKeyDokaKeepRemountDeathCut();
  persist.commit?.({ doka: honoured });
  clearGameKeyDokaKeepRemountDeathCut(storage, slot);
  return honoured;
}

/**
 * Death persist enqueue: honour replica Doka from the #811 stamp, then
 * `computeDeathPenalty` on that base. Production uses `skipBeforeEach`
 * so unpaid flush cannot recut. Call this instead of bare death enqueue
 * when restacking WorldExploration `persistDeathPenalty`.
 */
export async function persistDeathPenaltyThroughGameKeyDokaKeepRemount<
  T,
>(args: {
  persist: GameKeyDokaKeepRemountDeathCutPersist;
  storage: DeathPenaltyStorage;
  slot: number;
  readWallet: () => Promise<unknown>;
  applyAndCommit: (after: DeathPenaltyAmounts) => Promise<T>;
}): Promise<T> {
  return args.persist.enqueue(
    async () => {
      const committed = args.persist.snapshot();
      const dokaBase =
        await resolveCommittedDokaAfterGameKeyDokaKeepRemountDeathCut(
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
