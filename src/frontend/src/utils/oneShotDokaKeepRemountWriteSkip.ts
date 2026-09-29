/**
 * Seeded shrine / ground Doka / dungeon-complete `persistDokaCreditResult`
 * can land Doka on the canister then `keep` when confirm is stale
 * (`settleOneShotAfterCredit` + `settleOneShotPersistLock`). Same-session
 * keep is owned by #330 (`noteUnconfirmedCredit` on the persist lock) —
 * that flag dies when WorldExploration remounts.
 *
 * Remount Doka stamps that require a death-cut are owned by #742.
 * Victory `applyRewards` throw-after-add remount keep without unpaid
 * death is owned by #774 (`pbv_victory_doka_keep_remount_slotN`).
 * Portal XP remount keep (dokaDelta 0) is owned by #767.
 *
 * Remount after one-shot Doka keep **without** unpaid death is still a wipe:
 *
 * Chronology:
 * 1. World hydrated. Lock doka=200 seeded. Canister 200. GameFlow
 *    `dokaBalance` stays 200: HUD credit waits for settle `commit`, and
 *    `shouldApplyCallerDokaHydrate` ignores later wallet refetches while
 *    the world session is mounted.
 * 2. Ground / shrine / dungeon-complete `applyRewards(slot, doka, 0)`
 *    invokes then throws transport (canister 250). Confirm still reads
 *    200. `settle` is `keep`. `settleOneShotPersistLock` notes
 *    unconfirmed on the session lock. No unpaid death marker.
 *    #742 / #767 / #774 do not stamp this wallet.
 * 3. Actor reconnect remounts WorldExploration. New lock seeds
 *    `{ doka: dokaBalance }` = **200**. Session unconfirmed flags are gone.
 * 4. Heal / shop `persistAbsoluteProgress` calls
 *    `resolveCommittedDokaForAbsoluteWrite`. Seeded && !unconfirmed
 *    returns committed 200 without fetching. `saveBattleStats` applies
 *    incoming-below-stored; the pickup grant is gone.
 *
 * This sidecar stamps one-shot Doka transport-keep in sessionStorage
 * without requiring unpaid death. Remount absolute Doka resolve
 * re-fetches `getCallerDokaBalance`; live ≤ stamped `preDoka` fail-closes
 * (`applyRewards` only adds). Fresh 250 commits and clears the stamp.
 *
 * Explicit `applyRewards failed` is settle `release` and must not stamp.
 * Unseeded keep is #493 (absolute writes already fetch).
 *
 * `WorldExploration.tsx`, `progressPersist.ts`, `dokaPersist.ts`,
 * `deathPenalty.ts`, and the #330 / #742 / #767 / #774 remount files are
 * occupied / unmerged, so this PR does not restack them. Tests reproduce
 * remount heal vs the gated skip. Restack the three one-shot enqueues onto
 * `persistOneShotDokaThroughOneShotDokaKeepRemount` and absolute Doka onto
 * `resolveCommittedDokaAfterOneShotDokaKeepRemount` after those PRs land.
 */

import type { DeathPenaltyStorage } from "./deathPenalty.ts";
import {
  type DokaCreditActor,
  type OneShotCreditSettle,
  type OneShotPersistLock,
  persistDokaCreditResult,
  resolveOneShotCreditSettle,
  settleOneShotPersistLock,
} from "./dokaPersist.ts";
import { ABSOLUTE_WRITE_UNCONFIRMED_CREDIT } from "./progressPersist.ts";

function toNat(n: number | null | undefined): number {
  return Math.max(0, Math.floor(Number(n) || 0));
}

export function oneShotDokaKeepRemountKey(slot: number): string {
  return `pbv_oneshot_doka_keep_remount_slot${Math.max(1, toNat(slot))}`;
}

export type OneShotDokaKeepRemountStamp = {
  /** Lock wallet before the transport-keep grant. */
  preDoka: number;
};

export type OneShotDokaKeepSettleKind = OneShotCreditSettle["kind"];

/**
 * Stamp only a seeded one-shot `keep`. `commit` already raised the lock.
 * `release` is explicit `applyRewards failed` (canister did not add).
 * Unseeded keep leaves absolute writes on the live fetch (#493).
 */
export function shouldNoteOneShotDokaKeepRemount(args: {
  settleKind: OneShotDokaKeepSettleKind;
  walletSeeded: boolean;
}): boolean {
  return args.settleKind === "keep" && args.walletSeeded === true;
}

export function readOneShotDokaKeepRemount(
  storage: DeathPenaltyStorage,
  slot: number,
): OneShotDokaKeepRemountStamp | null {
  try {
    const raw = storage.getItem(oneShotDokaKeepRemountKey(slot));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<OneShotDokaKeepRemountStamp>;
    if (parsed.preDoka == null) return null;
    return { preDoka: toNat(parsed.preDoka) };
  } catch {
    return null;
  }
}

export function writeOneShotDokaKeepRemount(
  storage: DeathPenaltyStorage,
  slot: number,
  stamp: OneShotDokaKeepRemountStamp,
): void {
  try {
    storage.setItem(
      oneShotDokaKeepRemountKey(slot),
      JSON.stringify({ preDoka: toNat(stamp.preDoka) }),
    );
  } catch {
    // private mode
  }
}

export function clearOneShotDokaKeepRemount(
  storage: DeathPenaltyStorage,
  slot: number,
): void {
  try {
    storage.removeItem(oneShotDokaKeepRemountKey(slot));
  } catch {
    // ignore
  }
}

export function hasOneShotDokaKeepRemount(
  storage: DeathPenaltyStorage,
  slot: number,
): boolean {
  return readOneShotDokaKeepRemount(storage, slot) != null;
}

/**
 * Note remount-durable one-shot Doka keep. Does **not** require unpaid death
 * pending (that is #742 / #759). `preDoka` is the lock wallet before the grant.
 */
export function noteOneShotDokaKeepRemount(
  storage: DeathPenaltyStorage,
  slot: number,
  args: {
    settleKind: OneShotDokaKeepSettleKind;
    walletSeeded: boolean;
    preDoka: number;
  },
): void {
  if (
    !shouldNoteOneShotDokaKeepRemount({
      settleKind: args.settleKind,
      walletSeeded: args.walletSeeded,
    })
  ) {
    return;
  }
  writeOneShotDokaKeepRemount(storage, slot, { preDoka: args.preDoka });
}

export function dokaFromOneShotKeepRemountWallet(raw: unknown): number | null {
  if (raw == null) return null;
  if (typeof raw === "object" && raw !== null && "ok" in raw) {
    return dokaFromOneShotKeepRemountWallet((raw as { ok: unknown }).ok);
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
export function shouldRefuseOneShotDokaKeepRemountStaleDoka(args: {
  keep: boolean;
  liveDoka: number | null;
  stampedPreDoka: number;
}): boolean {
  if (args.keep !== true) return false;
  if (args.liveDoka == null) return true;
  return toNat(args.liveDoka) <= toNat(args.stampedPreDoka);
}

/**
 * Honour remount absolute Doka from replica wallet when the keep stamp
 * says a one-shot grant may already be on the canister. Stale Play-entry
 * equal to stamped `preDoka` must not fall back to remount wallet
 * (that is the wipe).
 */
export function dokaForOneShotDokaKeepRemountHonour(args: {
  remountDoka: number;
  liveDoka: number | null;
  keep: boolean;
  stampedPreDoka: number;
}): number | null {
  if (
    shouldRefuseOneShotDokaKeepRemountStaleDoka({
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

function refuseStaleOneShotDokaKeepRemount(): never {
  throw new Error(ABSOLUTE_WRITE_UNCONFIRMED_CREDIT);
}

export type OneShotDokaKeepRemountPersist = OneShotPersistLock & {
  snapshot: () => { doka: number };
  enqueue: <T>(fn: () => Promise<T>) => Promise<T>;
  isWalletSeeded: () => boolean;
};

/**
 * persistAbsoluteProgress remount wallet used Play-entry Doka 200 after a
 * one-shot transport-keep. Fetch `getCallerDokaBalance` when the remount
 * keep stamp exists. Stale live ≤ stamped `preDoka` throws.
 */
export async function resolveCommittedDokaAfterOneShotDokaKeepRemount(
  persist: Pick<OneShotDokaKeepRemountPersist, "snapshot" | "commit">,
  readWallet: () => Promise<unknown>,
  storage: DeathPenaltyStorage,
  slot: number,
): Promise<number> {
  const remountDoka = toNat(persist.snapshot().doka);
  const stamp = readOneShotDokaKeepRemount(storage, slot);
  if (!stamp) return remountDoka;

  let liveDoka: number | null = null;
  try {
    liveDoka = dokaFromOneShotKeepRemountWallet(await readWallet());
  } catch (err) {
    if (
      err instanceof Error &&
      err.message === ABSOLUTE_WRITE_UNCONFIRMED_CREDIT
    ) {
      throw err;
    }
    refuseStaleOneShotDokaKeepRemount();
  }

  const honoured = dokaForOneShotDokaKeepRemountHonour({
    remountDoka,
    liveDoka,
    keep: true,
    stampedPreDoka: stamp.preDoka,
  });
  if (honoured == null) refuseStaleOneShotDokaKeepRemount();
  persist.commit({ doka: honoured });
  clearOneShotDokaKeepRemount(storage, slot);
  return honoured;
}

/**
 * One-shot enqueue: `persistDokaCreditResult` then confirm then
 * `settleOneShotPersistLock`. A transport `keep` never commits Doka.
 * Note sidecar keep before remount heal can honour Play-entry wallet.
 * Call this instead of bare `enqueue` when restacking the shrine /
 * ground / dungeon-complete sites in WorldExploration.
 */
export async function persistOneShotDokaThroughOneShotDokaKeepRemount(args: {
  persist: Pick<
    OneShotDokaKeepRemountPersist,
    | "enqueue"
    | "snapshot"
    | "commit"
    | "noteUnconfirmedCredit"
    | "isWalletSeeded"
  >;
  storage: DeathPenaltyStorage;
  slot: number;
  actor: DokaCreditActor;
  doka: number;
  readWallet: () => Promise<unknown>;
}): Promise<OneShotCreditSettle> {
  return args.persist.enqueue(async () => {
    const preDoka = toNat(args.persist.snapshot().doka);
    const walletSeeded = args.persist.isWalletSeeded();
    const credited = await persistDokaCreditResult(
      args.actor,
      args.slot,
      args.doka,
    );
    const settle = await resolveOneShotCreditSettle(credited, {
      committedDoka: preDoka,
      walletSeeded,
      readWallet: args.readWallet,
    });
    settleOneShotPersistLock(args.persist, settle);
    if (settle.kind === "commit") {
      clearOneShotDokaKeepRemount(args.storage, args.slot);
    } else {
      noteOneShotDokaKeepRemount(args.storage, args.slot, {
        settleKind: settle.kind,
        walletSeeded,
        preDoka,
      });
    }
    return settle;
  });
}
