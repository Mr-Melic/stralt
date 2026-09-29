/**
 * Seeded handleBattleEnd / handleBossRushRoomClear `resolveBattleRewards`
 * / `applyRewards` can land leftover XP on the canister then throw before
 * `commit`. Same-session keep is owned by #532 / #580
 * (`noteUnconfirmedCredit` / `noteUnconfirmedXpCredit`) — those flags live
 * on the persist lock and die when WorldExploration remounts.
 *
 * Remount keep with unpaid death pending is owned by #759 / #764 (death-cut
 * XP-keep stamp). Those helpers refuse to note when `pending` is null.
 * Portal XP remount keep without unpaid death is owned by #767
 * (`pbv_portal_xp_keep_remount_slotN`). Portal enqueue is `dokaDelta` 0
 * and `xpDelta` 10. Victory Doka remount keep without unpaid death is
 * owned by #774 (`pbv_victory_doka_keep_remount_slotN`).
 *
 * Remount after victory / Boss Rush leftover XP keep **without** unpaid
 * death is still a wipe:
 *
 * Chronology:
 * 1. World hydrated. Lock doka=200 / XP 100 seeded. Canister 200/100.
 *    GameFlow `character.experience` stays at Play-entry 100 forever
 *    (`deathPenalty.ts` documents this; `GameFlow.handlePlayCharacter`
 *    is the only writer).
 * 2. Victory `resolveBattleRewards` → `applyRewards(slot, doka, 80)`
 *    invokes then throws (canister leftover 180). Catch only
 *    `logDebugInfo`s. Lock stays XP 100. No unpaid death marker.
 *    #759 / #767 / #774 do not stamp this leftover.
 * 3. Actor reconnect remounts WorldExploration. New lock seeds
 *    `{ xp: character.experience }` = Play-entry **100**. Session
 *    unconfirmed flags are gone. #759 does not stamp (no pending).
 * 4. Heal / shop `persistAbsoluteProgress` writes `committed.xp` 100.
 *    `saveBattleStats` applies incoming-below-stored; victory leftover
 *    is gone.
 *
 * Fresh lava death after the same remount cuts 20% of Play-entry 100 → 80
 * over canister 180 — same wipe class. Boss Rush room-clear uses the
 * same `resolveBattleRewards` then `commit` / log-only catch.
 *
 * This sidecar stamps victory / room-clear XP transport-keep in
 * sessionStorage without requiring unpaid death. Remount absolute XP
 * resolve re-fetches `getCharacter` leftover; stale Play-entry equal
 * to the stamped pre-keep leftover fail-closes. Fresh 180 commits and
 * clears the stamp.
 *
 * Explicit `applyRewards failed` must not stamp (canister did not add).
 * Victory leftover that already dropped below the stamp (level-up) must
 * still honour the replica, not fail-close.
 *
 * `WorldExploration.tsx`, `progressPersist.ts`, `rewardResolver.ts`,
 * `deathPenalty.ts`, and the #532 / #580 / #759 / #767 / #774 remount
 * files are occupied / unmerged, so this PR does not restack them.
 * Tests reproduce remount heal / death vs the gated skip. Restack
 * victory / BR enqueue onto
 * `persistVictoryXpThroughVictoryXpKeepRemount` and absolute XP onto
 * `resolveCommittedXpAfterVictoryXpKeepRemount` after those PRs land.
 */

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

export function victoryXpKeepRemountKey(slot: number): string {
  return `pbv_victory_xp_keep_remount_slot${Math.max(1, toNat(slot))}`;
}

export type VictoryXpKeepRemountStamp = {
  /** Lock leftover XP before the throw-after-add grant. */
  preXp: number;
};

/**
 * Parsed `#err` / `applyRewards failed` means the canister did not add.
 * Any other throw is after-or-during invoke — the replica may have the grant.
 */
export function shouldNoteVictoryXpKeepRemount(args: {
  xpDelta: number;
  error: unknown;
}): boolean {
  if (toNat(args.xpDelta) <= 0) return false;
  const msg = toMessage(args.error);
  if (!msg) return false;
  if (msg.includes("applyRewards failed")) return false;
  return true;
}

export function readVictoryXpKeepRemount(
  storage: DeathPenaltyStorage,
  slot: number,
): VictoryXpKeepRemountStamp | null {
  try {
    const raw = storage.getItem(victoryXpKeepRemountKey(slot));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<VictoryXpKeepRemountStamp>;
    if (parsed.preXp == null) return null;
    return { preXp: toNat(parsed.preXp) };
  } catch {
    return null;
  }
}

export function writeVictoryXpKeepRemount(
  storage: DeathPenaltyStorage,
  slot: number,
  stamp: VictoryXpKeepRemountStamp,
): void {
  try {
    storage.setItem(
      victoryXpKeepRemountKey(slot),
      JSON.stringify({ preXp: toNat(stamp.preXp) }),
    );
  } catch {
    // private mode
  }
}

export function clearVictoryXpKeepRemount(
  storage: DeathPenaltyStorage,
  slot: number,
): void {
  try {
    storage.removeItem(victoryXpKeepRemountKey(slot));
  } catch {
    // ignore
  }
}

export function hasVictoryXpKeepRemount(
  storage: DeathPenaltyStorage,
  slot: number,
): boolean {
  return readVictoryXpKeepRemount(storage, slot) != null;
}

/**
 * Note remount-durable victory / room-clear XP keep. Does **not** require
 * unpaid death pending (that is #759). `preXp` is the lock leftover
 * before the grant.
 */
export function noteVictoryXpKeepRemount(
  storage: DeathPenaltyStorage,
  slot: number,
  args: { xpDelta: number; error: unknown; preXp: number },
): void {
  if (
    !shouldNoteVictoryXpKeepRemount({
      xpDelta: args.xpDelta,
      error: args.error,
    })
  ) {
    return;
  }
  writeVictoryXpKeepRemount(storage, slot, { preXp: args.preXp });
}

/**
 * Stale Play-entry leftover still equals the pre-keep lock. A fresh
 * victory leftover (pre+grant) or a leftover already below pre (level-up)
 * must honour. Missing live is fail-closed only when a keep stamp exists.
 */
export function shouldRefuseVictoryXpKeepRemountStaleXp(args: {
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
 * says a victory / room-clear grant may already be on the canister. Stale
 * Play-entry equal to stamped `preXp` must not fall back to remount
 * leftover (that is the wipe).
 */
export function xpForVictoryXpKeepRemountHonour(args: {
  remountXp: number;
  liveXp: number | null;
  keep: boolean;
  stampedPreXp: number;
}): number | null {
  if (
    shouldRefuseVictoryXpKeepRemountStaleXp({
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

function refuseStaleVictoryXpKeepRemount(): never {
  throw new Error(ABSOLUTE_WRITE_UNCONFIRMED_CREDIT);
}

export type VictoryXpKeepRemountPersist = {
  snapshot: () => { xp: number };
  commit?: (next: { xp?: number }) => void;
  enqueue: <T>(fn: () => Promise<T>) => Promise<T>;
};

/**
 * persistAbsoluteProgress / persistDeathPenalty remount leftover used
 * Play-entry XP 100 after a victory throw-after-add. Fetch character
 * leftover when the remount keep stamp exists. Stale live equal to
 * stamped `preXp` throws.
 */
export async function resolveCommittedXpAfterVictoryXpKeepRemount(
  persist: Pick<VictoryXpKeepRemountPersist, "snapshot" | "commit">,
  readCharacter: () => Promise<unknown>,
  storage: DeathPenaltyStorage,
  slot: number,
): Promise<number> {
  const remountXp = toNat(persist.snapshot().xp);
  const stamp = readVictoryXpKeepRemount(storage, slot);
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
    refuseStaleVictoryXpKeepRemount();
  }

  const honoured = xpForVictoryXpKeepRemountHonour({
    remountXp,
    liveXp,
    keep: true,
    stampedPreXp: stamp.preXp,
  });
  if (honoured == null) refuseStaleVictoryXpKeepRemount();
  persist.commit?.({ xp: honoured });
  clearVictoryXpKeepRemount(storage, slot);
  return honoured;
}

/**
 * Victory / Boss Rush enqueue `resolveBattleRewards` then `commit`. A
 * throw-after-add never commits. Note sidecar keep before remount heal
 * can honour Play-entry leftover. Call this instead of bare `enqueue`
 * when restacking WorldExploration handleBattleEnd /
 * handleBossRushRoomClear.
 */
export async function persistVictoryXpThroughVictoryXpKeepRemount<T>(args: {
  persist: Pick<VictoryXpKeepRemountPersist, "enqueue" | "snapshot">;
  storage: DeathPenaltyStorage;
  slot: number;
  xpDelta: number;
  applyAndCommit: () => Promise<T>;
}): Promise<T> {
  return args.persist.enqueue(async () => {
    const preXp = toNat(args.persist.snapshot().xp);
    try {
      return await args.applyAndCommit();
    } catch (err) {
      noteVictoryXpKeepRemount(args.storage, args.slot, {
        xpDelta: args.xpDelta,
        error: err,
        preXp,
      });
      throw err;
    }
  });
}
