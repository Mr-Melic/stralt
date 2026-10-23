/**
 * Shop / Doka-heal `persistAbsoluteProgress` awaits `saveBattleStats` then
 * `commit`. #860 stamps remount **HP** after a transport-keep throw
 * (`pbv_absolute_hp_throw_keep_remount_slotN`) and honours replica HP on
 * remount leftover shop. Those helpers never fetch `getCallerDokaBalance`.
 *
 * Heal / shop catch returns `false`; `shouldRollbackFailedHeal` /
 * `shouldRollbackFailedShopSpend` snap HUD Doka back to the click
 * `dokaBefore`. GameFlow `dokaBalance` is that rollback. Inventory rolls
 * back too. `createProgressPersist` on remount seeds that 200.
 *
 * #860 leftover shop writes HP 70 after honour, but Doka still spends from
 * Play-entry 200. #854 stamps parsed success HP only. #926 stamps rename /
 * upgrade throw-after-debit, not `saveBattleStats`. #387 session WeakMap
 * dies on remount and never notes shop / heal.
 *
 * Chronology:
 * 1. World hydrated. Play-entry HP 100 / Doka 200. Lock seeded the same.
 *    Canister 100/200.
 * 2. Lava 100→40 local. Doka-heal `saveBattleStats` accepts HP 70 / Doka
 *    190 then throws (`replica went away`). Commit never runs. Catch
 *    returns false. Heal rollback HUD 40 / 200. No unpaid death. #860
 *    stamps HP keep. Same class: Items Buy at full HP accepts Doka 150
 *    then throws; HUD + inventory roll back; #860 does **not** stamp
 *    (preHp === postHp).
 * 3. Actor reconnect remounts WorldExploration. New lock seeds
 *    `{ doka: dokaBalance }` = **200**. Session unconfirmed flags are gone.
 * 4. Leftover #860: shop `resolveAbsoluteWriteHp` honours 70. Unique
 *    leftover: `resolveCommittedDokaForAbsoluteWrite` is seeded &&
 *    !unconfirmed so it returns remount 200. Shop spend 50 writes 150
 *    over canister 190 (over-cut). Shop-throw then remount heal writes
 *    incoming 190 over stored 150 (`saveBattleStats` never mints) while
 *    HP still applies — a free heal.
 *
 * This sidecar stamps `{ preDoka }` after a transport-keep throw in
 * `pbv_absolute_doka_throw_keep_remount_slotN` when spend > 0. Explicit
 * `#err` (`saveBattleStats failed`, Unauthorized, banned, empty slot,
 * unseeded wallet) must not stamp. Remount absolute Doka resolve
 * re-fetches `getCallerDokaBalance`; live ≥ stamped `preDoka` fail-closes.
 * Fresh 190 / 150 commits and clears the stamp.
 *
 * `WorldExploration.tsx`, `progressPersist.ts`, `deathPenalty.ts`,
 * `itemShop.ts`, `BuffShop.tsx`, and #387 / #854 / #860 / #926 files are
 * occupied / unmerged, so this PR does not restack them. Tests reproduce
 * remount shop / heal vs the gated skip. Restack persistAbsoluteProgress
 * throw onto `persistAbsoluteDokaThroughAbsoluteDokaThrowKeepRemount` and
 * absolute Doka onto `resolveCommittedDokaAfterAbsoluteDokaThrowKeepRemount`
 * after those PRs land.
 */

import type { DeathPenaltyStorage } from "./deathPenalty.ts";
import { ABSOLUTE_WRITE_UNCONFIRMED_CREDIT } from "./progressPersist.ts";

function toNat(n: number | null | undefined): number {
  return Math.max(0, Math.floor(Number(n) || 0));
}

function toMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

export function absoluteDokaThrowKeepRemountKey(slot: number): string {
  return `pbv_absolute_doka_throw_keep_remount_slot${Math.max(1, toNat(slot))}`;
}

export type AbsoluteDokaThrowKeepRemountStamp = {
  /** Lock wallet before the shop / heal saveBattleStats throw. */
  preDoka: number;
};

/**
 * Parsed `#err` / skipped enqueue means the canister did not accept the
 * spend. Any other throw is after-or-during invoke — the replica may have
 * the debit. Do not export `isExplicitSaveBattleStatsReject` (#860).
 */
export function isExplicitAbsoluteDokaThrowReject(error: unknown): boolean {
  const msg = toMessage(error);
  if (!msg) return true;
  if (msg.includes("saveBattleStats failed")) return true;
  if (msg.includes("Unauthorized")) return true;
  if (msg.includes("Account banned")) return true;
  if (msg.includes("Invalid slot")) return true;
  if (msg.includes("No characters found")) return true;
  if (msg.includes("is empty")) return true;
  if (msg.includes("wallet not seeded")) return true;
  return false;
}

/**
 * Transport-keep throw after shop / heal persist spent Doka. Parsed
 * success is #854. HP-only throw stamp is #860. Rename / upgrade debit
 * is #926. Explicit `#err` must not note.
 */
export function shouldNoteAbsoluteDokaThrowKeepRemount(args: {
  spend: number;
  error: unknown;
}): boolean {
  if (toNat(args.spend) <= 0) return false;
  if (args.error == null) return false;
  if (isExplicitAbsoluteDokaThrowReject(args.error)) return false;
  return true;
}

export function readAbsoluteDokaThrowKeepRemount(
  storage: DeathPenaltyStorage,
  slot: number,
): AbsoluteDokaThrowKeepRemountStamp | null {
  try {
    const raw = storage.getItem(absoluteDokaThrowKeepRemountKey(slot));
    if (!raw) return null;
    const parsed = JSON.parse(
      raw,
    ) as Partial<AbsoluteDokaThrowKeepRemountStamp>;
    if (parsed.preDoka == null) return null;
    return { preDoka: toNat(parsed.preDoka) };
  } catch {
    return null;
  }
}

export function writeAbsoluteDokaThrowKeepRemount(
  storage: DeathPenaltyStorage,
  slot: number,
  stamp: AbsoluteDokaThrowKeepRemountStamp,
): void {
  try {
    storage.setItem(
      absoluteDokaThrowKeepRemountKey(slot),
      JSON.stringify({ preDoka: toNat(stamp.preDoka) }),
    );
  } catch {
    // private mode
  }
}

export function clearAbsoluteDokaThrowKeepRemount(
  storage: DeathPenaltyStorage,
  slot: number,
): void {
  try {
    storage.removeItem(absoluteDokaThrowKeepRemountKey(slot));
  } catch {
    // ignore
  }
}

export function hasAbsoluteDokaThrowKeepRemount(
  storage: DeathPenaltyStorage,
  slot: number,
): boolean {
  return readAbsoluteDokaThrowKeepRemount(storage, slot) != null;
}

/**
 * Note remount-durable shop / heal Doka spend after a transport-keep
 * throw. Does **not** require death pending and does **not** require an
 * HP delta (#860 skips full-HP shop).
 */
export function noteAbsoluteDokaThrowKeepRemount(
  storage: DeathPenaltyStorage,
  slot: number,
  args: { spend: number; error: unknown; preDoka: number },
): void {
  if (
    !shouldNoteAbsoluteDokaThrowKeepRemount({
      spend: args.spend,
      error: args.error,
    })
  ) {
    return;
  }
  writeAbsoluteDokaThrowKeepRemount(storage, slot, { preDoka: args.preDoka });
}

export function dokaFromAbsoluteDokaThrowKeepRemountWalletRecord(
  raw: unknown,
): number | null {
  if (raw == null) return null;
  if (typeof raw === "object" && raw !== null && "ok" in raw) {
    return dokaFromAbsoluteDokaThrowKeepRemountWalletRecord(
      (raw as { ok: unknown }).ok,
    );
  }
  const n = Number(raw);
  if (!Number.isFinite(n)) return null;
  return toNat(n);
}

/**
 * Stale Play-entry / rollback HUD still equals or sits above the pre-spend
 * lock. Shop / heal only debit, so a live wallet that did not drop is
 * stale (or the rollback cache). Missing live is fail-closed only when a
 * keep stamp exists.
 */
export function shouldRefuseAbsoluteDokaThrowKeepRemountStaleDoka(args: {
  keep: boolean;
  liveDoka: number | null;
  stampedPreDoka: number;
}): boolean {
  if (args.keep !== true) return false;
  if (args.liveDoka == null) return true;
  return toNat(args.liveDoka) >= toNat(args.stampedPreDoka);
}

/**
 * Honour remount absolute Doka from replica wallet when the keep stamp
 * says shop / heal already invoked. Stale Play-entry equal to stamped
 * `preDoka` must not fall back to remount wallet (that is the wipe).
 */
export function dokaForAbsoluteDokaThrowKeepRemountHonour(args: {
  remountDoka: number;
  liveDoka: number | null;
  keep: boolean;
  stampedPreDoka: number;
}): number | null {
  if (
    shouldRefuseAbsoluteDokaThrowKeepRemountStaleDoka({
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

function refuseStaleAbsoluteDokaThrowKeepRemount(): never {
  throw new Error(ABSOLUTE_WRITE_UNCONFIRMED_CREDIT);
}

export type AbsoluteDokaThrowKeepRemountPersist = {
  snapshot: () => { doka: number };
  commit?: (next: { doka?: number }) => void;
  enqueue: <T>(
    fn: () => Promise<T>,
    opts?: { skipBeforeEach?: boolean },
  ) => Promise<T>;
};

/**
 * persistAbsoluteProgress remount wallet used Play-entry Doka 200 after a
 * shop / heal saveBattleStats accept-then-throw. Fetch `getCallerDokaBalance`
 * when the remount keep stamp exists. Stale live ≥ stamped `preDoka` throws.
 */
export async function resolveCommittedDokaAfterAbsoluteDokaThrowKeepRemount(
  persist: Pick<AbsoluteDokaThrowKeepRemountPersist, "snapshot" | "commit">,
  readWallet: () => Promise<unknown>,
  storage: DeathPenaltyStorage,
  slot: number,
): Promise<number> {
  const remountDoka = toNat(persist.snapshot().doka);
  const stamp = readAbsoluteDokaThrowKeepRemount(storage, slot);
  if (!stamp) return remountDoka;

  let liveDoka: number | null = null;
  try {
    liveDoka = dokaFromAbsoluteDokaThrowKeepRemountWalletRecord(
      await readWallet(),
    );
  } catch (err) {
    if (
      err instanceof Error &&
      err.message === ABSOLUTE_WRITE_UNCONFIRMED_CREDIT
    ) {
      throw err;
    }
    refuseStaleAbsoluteDokaThrowKeepRemount();
  }

  const honoured = dokaForAbsoluteDokaThrowKeepRemountHonour({
    remountDoka,
    liveDoka,
    keep: true,
    stampedPreDoka: stamp.preDoka,
  });
  if (honoured == null) refuseStaleAbsoluteDokaThrowKeepRemount();
  persist.commit?.({ doka: honoured });
  clearAbsoluteDokaThrowKeepRemount(storage, slot);
  return honoured;
}

/**
 * persistAbsoluteProgress enqueue `saveBattleStats` then commit. A
 * transport-keep throw never returns and never hits #854's success stamp.
 * Note sidecar keep before remount shop can honour Play-entry Doka. Parsed
 * success is #854 — do not stamp it here. Explicit `#err` is a reject
 * (canister unchanged). Call this instead of bare `enqueue` when
 * restacking WorldExploration persistAbsoluteProgress.
 */
export async function persistAbsoluteDokaThroughAbsoluteDokaThrowKeepRemount<
  T,
>(args: {
  persist: AbsoluteDokaThrowKeepRemountPersist;
  storage: DeathPenaltyStorage;
  slot: number;
  spend: number;
  skipBeforeEach?: boolean;
  applyAndCommit: () => Promise<T>;
}): Promise<T> {
  return args.persist.enqueue(
    async () => {
      const preDoka = toNat(args.persist.snapshot().doka);
      try {
        return await args.applyAndCommit();
      } catch (err) {
        noteAbsoluteDokaThrowKeepRemount(args.storage, args.slot, {
          spend: args.spend,
          error: err,
          preDoka,
        });
        throw err;
      }
    },
    args.skipBeforeEach === true ? { skipBeforeEach: true } : undefined,
  );
}
