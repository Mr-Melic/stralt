/**
 * #964 stamps remount Doka keep after shop / heal `saveBattleStats`
 * throw-after-accept (`pbv_absolute_doka_throw_keep_remount_slotN`) and
 * honours replica wallet on remount **heal / shop**
 * `persistAbsoluteProgress`. Those helpers never enter
 * `persistDeathPenalty`.
 *
 * Production death persist reads `progressPersist.snapshot().doka` (or
 * `resolveCommittedDokaForAbsoluteWrite`, which on a seeded remount lock
 * returns committed immediately). Remount `createProgressPersist` seeds
 * GameFlow `dokaBalance` — heal / shop catch returns false and
 * `shouldRollbackFailedHeal` / `shouldRollbackFailedShopSpend` snap HUD
 * Doka back to Play-entry, so after a throw-after-accept that is still
 * 200. `shouldApplyCallerDokaHydrate` ignores later wallet refetches
 * while the world session stays mounted.
 *
 * Remount after shop / heal saveBattleStats throw-after-accept **without**
 * unpaid death is still a wipe when the next write is lava death, not
 * heal:
 *
 * Chronology:
 * 1. World hydrated. Lock doka=200 seeded. Canister 200. GameFlow
 *    `dokaBalance` stays 200.
 * 2. Doka-heal `saveBattleStats` accepts HP 70 / Doka 190 then throws
 *    (`replica went away`). Commit never runs. Catch returns false.
 *    Heal rollback HUD 40 / 200. Same class: Items Buy accepts Doka 150
 *    then throws; HUD + inventory roll back. No unpaid death. #860
 *    stamps HP keep (heal only). #964 stamps Doka keep for remount
 *    heal / shop.
 * 3. Actor reconnect remounts WorldExploration. New lock seeds
 *    `{ doka: dokaBalance }` = **200**. Session unconfirmed flags are
 *    gone.
 * 4. Leftover #964: heal `resolveCommittedDokaAfterAbsoluteDokaThrowKeepRemount`
 *    fetches 190 / 150. Unique leftover: lava death `persistDeathPenalty`
 *    uses remount committed 200, `computeDeathPenalty` → Doka **120**.
 *    Incoming-below-stored writes 120 over heal canister 190 or shop
 *    canister 150 (over-cuts remaining after the fee).
 *
 * Unique vs **#964** (heal/shop honour of this stamp), **#938** (rename /
 * upgrade spend remount death — different stamp key), **#860** (HP throw
 * remount shop), **#927** (successful heal remount shop double-charge),
 * and credit remount deaths (**#909** / **#900** / **#869** / **#866** /
 * **#877** — skip live ≤ pre).
 *
 * This sidecar reads the same #964 stamp and honours replica wallet as
 * the death-cut **base** so 20/40 taxes 190 → 114 or 150 → 90, not
 * Play-entry 200 → 120. Stale live ≥ stamped `preDoka` fail-closes (a
 * live wallet that did not drop is stale or the rollback cache).
 * Credit-style `live <= committed` would stuck-skip a real fee forever.
 * Fresh 190 / 150 commits onto the lock then the death write runs.
 * Pickup-only (no stamp) still cuts 200 → 120.
 *
 * Do not stamp here — #964 notes keep after shop / heal
 * throw-after-accept. Explicit `saveBattleStats failed` never stamps.
 * Do not restack WX / progressPersist / deathPenalty / itemShop /
 * BuffShop / #964 file.
 *
 * Tests reproduce remount death vs the gated skip. Restack death persist
 * onto `persistDeathPenaltyThroughAbsoluteDokaThrowKeepRemount` after
 * #964 lands. No Motoko.
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
 * Same key as #964 `absoluteDokaThrowKeepRemountKey`. Remount death
 * honour must read the shop / heal throw-after-accept stamp, not a
 * second key.
 */
export function absoluteDokaThrowKeepRemountDeathCutKey(slot: number): string {
  return `pbv_absolute_doka_throw_keep_remount_slot${Math.max(1, toNat(slot))}`;
}

export type AbsoluteDokaThrowKeepRemountDeathCutStamp = {
  /** Lock wallet before the shop / heal saveBattleStats throw. */
  preDoka: number;
};

export function readAbsoluteDokaThrowKeepRemountDeathCut(
  storage: DeathPenaltyStorage,
  slot: number,
): AbsoluteDokaThrowKeepRemountDeathCutStamp | null {
  try {
    const raw = storage.getItem(absoluteDokaThrowKeepRemountDeathCutKey(slot));
    if (!raw) return null;
    const parsed = JSON.parse(
      raw,
    ) as Partial<AbsoluteDokaThrowKeepRemountDeathCutStamp>;
    if (parsed.preDoka == null) return null;
    return { preDoka: toNat(parsed.preDoka) };
  } catch {
    return null;
  }
}

export function writeAbsoluteDokaThrowKeepRemountDeathCut(
  storage: DeathPenaltyStorage,
  slot: number,
  stamp: AbsoluteDokaThrowKeepRemountDeathCutStamp,
): void {
  try {
    storage.setItem(
      absoluteDokaThrowKeepRemountDeathCutKey(slot),
      JSON.stringify({ preDoka: toNat(stamp.preDoka) }),
    );
  } catch {
    // private mode
  }
}

export function clearAbsoluteDokaThrowKeepRemountDeathCut(
  storage: DeathPenaltyStorage,
  slot: number,
): void {
  try {
    storage.removeItem(absoluteDokaThrowKeepRemountDeathCutKey(slot));
  } catch {
    // ignore
  }
}

export function hasAbsoluteDokaThrowKeepRemountDeathCut(
  storage: DeathPenaltyStorage,
  slot: number,
): boolean {
  return readAbsoluteDokaThrowKeepRemountDeathCut(storage, slot) != null;
}

/**
 * Tests / restack fixtures. Production stamping stays on #964
 * `noteAbsoluteDokaThrowKeepRemount` after shop / heal throw-after-accept.
 */
export function noteAbsoluteDokaThrowKeepRemountDeathCut(
  storage: DeathPenaltyStorage,
  slot: number,
  preDoka: number,
): void {
  writeAbsoluteDokaThrowKeepRemountDeathCut(storage, slot, {
    preDoka: toNat(preDoka),
  });
}

export function dokaFromAbsoluteDokaThrowDeathCutWallet(
  raw: unknown,
): number | null {
  if (raw == null) return null;
  if (typeof raw === "object" && raw !== null && "ok" in raw) {
    return dokaFromAbsoluteDokaThrowDeathCutWallet(
      (raw as { ok: unknown }).ok,
    );
  }
  const n = Number(raw);
  if (!Number.isFinite(n)) return null;
  return toNat(n);
}

/**
 * Stale Play-entry / rollback HUD still equals or sits above the
 * pre-spend lock. Shop / heal only debit, so a live wallet that did not
 * drop is stale (or the rollback cache). Missing live is fail-closed
 * only when a keep stamp exists.
 */
export function shouldRefuseAbsoluteDokaThrowKeepRemountDeathCutStaleDoka(args: {
  keep: boolean;
  liveDoka: number | null;
  stampedPreDoka: number;
}): boolean {
  if (args.keep !== true) return false;
  if (args.liveDoka == null) return true;
  return toNat(args.liveDoka) >= toNat(args.stampedPreDoka);
}

/**
 * Honour remount death-cut **base** Doka from replica wallet when the
 * #964 keep stamp says shop / heal already invoked. Stale Play-entry
 * equal to stamped `preDoka` must not fall back to remount wallet (that
 * is the wipe: 40% of 200 → 120 over 190 / 150).
 */
export function dokaForAbsoluteDokaThrowKeepRemountDeathCut(args: {
  remountDoka: number;
  liveDoka: number | null;
  keep: boolean;
  stampedPreDoka: number;
}): number | null {
  if (
    shouldRefuseAbsoluteDokaThrowKeepRemountDeathCutStaleDoka({
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
 * 120. Gated fresh heal 190 → 114; shop 150 → 90.
 */
export function deathPenaltyAfterAbsoluteDokaThrowKeepRemount(args: {
  xp: number;
  remountDoka: number;
  liveDoka: number | null;
  keep: boolean;
  stampedPreDoka: number;
}): DeathPenaltyAmounts | null {
  const base = dokaForAbsoluteDokaThrowKeepRemountDeathCut({
    remountDoka: args.remountDoka,
    liveDoka: args.liveDoka,
    keep: args.keep,
    stampedPreDoka: args.stampedPreDoka,
  });
  if (base == null) return null;
  return computeDeathPenalty(args.xp, base);
}

function refuseStaleAbsoluteDokaThrowKeepRemountDeathCut(): never {
  throw new Error(ABSOLUTE_WRITE_UNCONFIRMED_CREDIT);
}

export type AbsoluteDokaThrowKeepRemountDeathCutPersist = {
  snapshot: () => { doka: number; xp: number; level: number };
  commit?: (next: { doka?: number; xp?: number; level?: number }) => void;
  enqueue: <T>(
    fn: () => Promise<T>,
    opts?: { skipBeforeEach?: boolean },
  ) => Promise<T>;
};

/**
 * persistDeathPenalty remount wallet used Play-entry Doka 200 after a
 * shop / heal saveBattleStats throw-after-accept. Fetch
 * `getCallerDokaBalance` when the #964 remount keep stamp exists. Stale
 * live ≥ stamped `preDoka` throws.
 *
 * Success adopts replica onto the lock and clears the stamp so a later
 * leftover heal cannot tax Play-entry again. Fail-close keeps the stamp.
 */
export async function resolveCommittedDokaAfterAbsoluteDokaThrowKeepRemountDeathCut(
  persist: Pick<
    AbsoluteDokaThrowKeepRemountDeathCutPersist,
    "snapshot" | "commit"
  >,
  readWallet: () => Promise<unknown>,
  storage: DeathPenaltyStorage,
  slot: number,
): Promise<number> {
  const remountDoka = toNat(persist.snapshot().doka);
  const stamp = readAbsoluteDokaThrowKeepRemountDeathCut(storage, slot);
  if (!stamp) return remountDoka;

  let liveDoka: number | null = null;
  try {
    liveDoka = dokaFromAbsoluteDokaThrowDeathCutWallet(await readWallet());
  } catch (err) {
    if (
      err instanceof Error &&
      err.message === ABSOLUTE_WRITE_UNCONFIRMED_CREDIT
    ) {
      throw err;
    }
    refuseStaleAbsoluteDokaThrowKeepRemountDeathCut();
  }

  const honoured = dokaForAbsoluteDokaThrowKeepRemountDeathCut({
    remountDoka,
    liveDoka,
    keep: true,
    stampedPreDoka: stamp.preDoka,
  });
  if (honoured == null) refuseStaleAbsoluteDokaThrowKeepRemountDeathCut();
  persist.commit?.({ doka: honoured });
  clearAbsoluteDokaThrowKeepRemountDeathCut(storage, slot);
  return honoured;
}

/**
 * Death persist enqueue: honour replica Doka from the #964 stamp, then
 * `computeDeathPenalty` on that base. Production uses `skipBeforeEach`
 * so unpaid flush cannot recut. Call this instead of bare death enqueue
 * when restacking WorldExploration `persistDeathPenalty`.
 */
export async function persistDeathPenaltyThroughAbsoluteDokaThrowKeepRemount<
  T,
>(args: {
  persist: AbsoluteDokaThrowKeepRemountDeathCutPersist;
  storage: DeathPenaltyStorage;
  slot: number;
  readWallet: () => Promise<unknown>;
  applyAndCommit: (after: DeathPenaltyAmounts) => Promise<T>;
}): Promise<T> {
  return args.persist.enqueue(
    async () => {
      const committed = args.persist.snapshot();
      const dokaBase =
        await resolveCommittedDokaAfterAbsoluteDokaThrowKeepRemountDeathCut(
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
