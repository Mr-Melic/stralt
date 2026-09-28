/**
 * Seeded portal `persistIncrementalRewards(0, 10)` can land leftover XP on
 * the canister then throw before `commit`. Same-session keep is owned by
 * #356 / #599 (`noteUnconfirmedXpCredit` / `noteUnconfirmedCredit`) — those
 * flags live on the persist lock and die when WorldExploration remounts.
 *
 * Remount keep with unpaid death pending is owned by #759 / #764 (death-cut
 * XP-keep stamp). Those helpers refuse to note when `pending` is null.
 *
 * Remount after portal XP keep **without** unpaid death is still a wipe:
 *
 * Chronology:
 * 1. World hydrated. Lock doka=200 / XP 100 seeded. Canister 200/100.
 *    GameFlow `character.experience` stays at Play-entry 100 forever
 *    (`deathPenalty.ts` documents this).
 * 2. White portal `persistIncrementalRewards(0, 10)` invokes then throws
 *    (canister XP 110). Catch only `console.warn`s. Lock stays XP 100.
 *    No unpaid death marker.
 * 3. Actor reconnect remounts WorldExploration. New lock seeds
 *    `{ xp: character.experience }` = Play-entry **100**. Session
 *    unconfirmed flags are gone. #759 does not stamp (no pending).
 * 4. Heal / shop `persistAbsoluteProgress` writes `committed.xp` 100.
 *    `saveBattleStats` applies incoming-below-stored; portal +10 is gone.
 *
 * Fresh lava death after the same remount cuts 20% of Play-entry 100 → 80
 * over canister 110 — same wipe class.
 *
 * This sidecar stamps portal XP transport-keep in sessionStorage without
 * requiring unpaid death. Remount absolute XP resolve re-fetches
 * `getCharacter` leftover; stale Play-entry equal to the stamped pre-keep
 * leftover fail-closes. Fresh 110 commits and clears the stamp.
 *
 * Explicit `applyRewards failed` must not stamp (canister did not add).
 * Victory leftover that already dropped below the stamp (level-up) must
 * still honour the replica, not fail-close.
 *
 * `WorldExploration.tsx`, `progressPersist.ts`, `applyRewardsResult.ts`,
 * and the #356 / #599 / #759 remount files are occupied / unmerged, so
 * this PR does not restack them. Tests reproduce remount heal / death
 * vs the gated skip. Restack portal enqueue onto
 * `persistPortalXpThroughPortalXpKeepRemount` and absolute XP onto
 * `resolveCommittedXpAfterPortalXpKeepRemount` after those PRs land.
 */

import { PORTAL_TRANSITION_XP } from "./applyRewardsResult.ts";
import {
  type DeathPenaltyStorage,
  experienceFromCharacterRecord,
} from "./deathPenalty.ts";
import { ABSOLUTE_WRITE_UNCONFIRMED_CREDIT } from "./progressPersist.ts";

function toNat(n: number | null | undefined): number {
  return Math.max(0, Math.floor(Number(n) || 0));
}

function toMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

export function portalXpKeepRemountKey(slot: number): string {
  return `pbv_portal_xp_keep_remount_slot${Math.max(1, toNat(slot))}`;
}

export type PortalXpKeepRemountStamp = {
  /** Lock leftover XP before the throw-after-add grant. */
  preXp: number;
};

/**
 * Parsed `#err` / `applyRewards failed` means the canister did not add.
 * Any other throw is after-or-during invoke — the replica may have the grant.
 */
export function shouldNotePortalXpKeepRemount(args: {
  xpDelta: number;
  error: unknown;
}): boolean {
  if (toNat(args.xpDelta) <= 0) return false;
  const msg = toMessage(args.error);
  if (!msg) return false;
  if (msg.includes("applyRewards failed")) return false;
  return true;
}

export function readPortalXpKeepRemount(
  storage: DeathPenaltyStorage,
  slot: number,
): PortalXpKeepRemountStamp | null {
  try {
    const raw = storage.getItem(portalXpKeepRemountKey(slot));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<PortalXpKeepRemountStamp>;
    if (parsed.preXp == null) return null;
    return { preXp: toNat(parsed.preXp) };
  } catch {
    return null;
  }
}

export function writePortalXpKeepRemount(
  storage: DeathPenaltyStorage,
  slot: number,
  stamp: PortalXpKeepRemountStamp,
): void {
  try {
    storage.setItem(
      portalXpKeepRemountKey(slot),
      JSON.stringify({ preXp: toNat(stamp.preXp) }),
    );
  } catch {
    // private mode
  }
}

export function clearPortalXpKeepRemount(
  storage: DeathPenaltyStorage,
  slot: number,
): void {
  try {
    storage.removeItem(portalXpKeepRemountKey(slot));
  } catch {
    // ignore
  }
}

export function hasPortalXpKeepRemount(
  storage: DeathPenaltyStorage,
  slot: number,
): boolean {
  return readPortalXpKeepRemount(storage, slot) != null;
}

/**
 * Note remount-durable portal XP keep. Does **not** require unpaid death
 * pending (that is #759). `preXp` is the lock leftover before the grant.
 */
export function notePortalXpKeepRemount(
  storage: DeathPenaltyStorage,
  slot: number,
  args: { xpDelta: number; error: unknown; preXp: number },
): void {
  if (
    !shouldNotePortalXpKeepRemount({
      xpDelta: args.xpDelta,
      error: args.error,
    })
  ) {
    return;
  }
  writePortalXpKeepRemount(storage, slot, { preXp: args.preXp });
}

/**
 * Stale Play-entry leftover still equals the pre-keep lock. A fresh portal
 * leftover (pre+10) or a victory leftover already below pre must honour.
 * Missing live is fail-closed only when a keep stamp exists.
 */
export function shouldRefusePortalXpKeepRemountStaleXp(args: {
  keep: boolean;
  liveXp: number | null;
  stampedPreXp: number;
}): boolean {
  if (args.keep !== true) return false;
  if (args.liveXp == null) return true;
  return toNat(args.liveXp) === toNat(args.stampedPreXp);
}

/**
 * Honour remount absolute XP from replica leftover when the keep stamp
 * says a portal/victory grant may already be on the canister. Stale
 * Play-entry equal to stamped `preXp` must not fall back to remount
 * leftover (that is the wipe).
 */
export function xpForPortalXpKeepRemountHonour(args: {
  remountXp: number;
  liveXp: number | null;
  keep: boolean;
  stampedPreXp: number;
}): number | null {
  if (
    shouldRefusePortalXpKeepRemountStaleXp({
      keep: args.keep,
      liveXp: args.liveXp,
      stampedPreXp: args.stampedPreXp,
    })
  ) {
    return null;
  }
  if (args.keep === true) {
    return args.liveXp == null ? null : toNat(args.liveXp);
  }
  return toNat(args.remountXp);
}

function refuseStalePortalXpKeepRemount(): never {
  throw new Error(ABSOLUTE_WRITE_UNCONFIRMED_CREDIT);
}

export type PortalXpKeepRemountPersist = {
  snapshot: () => { xp: number };
  commit?: (next: { xp?: number }) => void;
  enqueue: <T>(fn: () => Promise<T>) => Promise<T>;
};

/**
 * persistAbsoluteProgress / persistDeathPenalty remount leftover used
 * Play-entry XP 100 after a portal throw-after-add. Fetch character
 * leftover when the remount keep stamp exists. Stale live equal to
 * stamped `preXp` throws.
 */
export async function resolveCommittedXpAfterPortalXpKeepRemount(
  persist: Pick<PortalXpKeepRemountPersist, "snapshot" | "commit">,
  readCharacter: () => Promise<unknown>,
  storage: DeathPenaltyStorage,
  slot: number,
): Promise<number> {
  const remountXp = toNat(persist.snapshot().xp);
  const stamp = readPortalXpKeepRemount(storage, slot);
  if (!stamp) return remountXp;

  let liveXp: number | null = null;
  try {
    liveXp = experienceFromCharacterRecord(await readCharacter());
  } catch (err) {
    if (
      err instanceof Error &&
      err.message === ABSOLUTE_WRITE_UNCONFIRMED_CREDIT
    ) {
      throw err;
    }
    refuseStalePortalXpKeepRemount();
  }

  const honoured = xpForPortalXpKeepRemountHonour({
    remountXp,
    liveXp,
    keep: true,
    stampedPreXp: stamp.preXp,
  });
  if (honoured == null) refuseStalePortalXpKeepRemount();
  persist.commit?.({ xp: honoured });
  clearPortalXpKeepRemount(storage, slot);
  return honoured;
}

/**
 * Portal enqueue `persistIncrementalRewards` then `commit`. A
 * throw-after-add never commits. Note sidecar keep before remount heal
 * can honour Play-entry leftover. Call this instead of bare `enqueue`
 * when restacking WorldExploration.
 */
export async function persistPortalXpThroughPortalXpKeepRemount<T>(args: {
  persist: Pick<PortalXpKeepRemountPersist, "enqueue" | "snapshot">;
  storage: DeathPenaltyStorage;
  slot: number;
  xpDelta?: number;
  applyAndCommit: () => Promise<T>;
}): Promise<T> {
  const xpDelta = args.xpDelta ?? PORTAL_TRANSITION_XP;
  return args.persist.enqueue(async () => {
    const preXp = toNat(args.persist.snapshot().xp);
    try {
      return await args.applyAndCommit();
    } catch (err) {
      notePortalXpKeepRemount(args.storage, args.slot, {
        xpDelta,
        error: err,
        preXp,
      });
      throw err;
    }
  });
}
