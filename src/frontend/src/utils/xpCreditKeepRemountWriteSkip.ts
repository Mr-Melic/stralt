/**
 * Seeded portal / victory / Boss Rush `applyRewards` leftover XP can commit
 * on the persist lock, then WorldExploration remounts. GameFlow
 * `character.experience` stays Play-entry forever (`handlePlayCharacter`
 * is the only writer; `deathPenalty.ts` documents this).
 *
 * Throw-after-add remount keep is owned by #767 (portal) and #807
 * (victory / room-clear). Those stamp only when `applyAndCommit` throws
 * before `commit`. Same-session keep (#356 / #532 / #580 / #599) dies
 * with the remount. Unpaid-death remount honour is #759 / #764.
 *
 * Remount after a **successful** leftover XP credit **without** unpaid
 * death is still a wipe:
 *
 * Chronology:
 * 1. World hydrated. Lock doka=200 / XP 100 seeded. Canister 200/100.
 *    GameFlow `character.experience` stays Play-entry 100.
 * 2. Portal `persistIncrementalRewards(0, 10)` or victory / Boss Rush
 *    `resolveBattleRewards` commits leftover 110 (or 180). Catch is not
 *    taken. HUD `characterStats.exp` updates. GameFlow Play-entry does
 *    not. No unpaid death marker. #767 / #807 do not stamp (no error).
 * 3. Actor reconnect remounts WorldExploration. New lock seeds
 *    `{ xp: character.experience }` = **100**. `characterStats` reinits
 *    the same way. Session unconfirmed flags are gone.
 * 4. Heal / shop `persistAbsoluteProgress` writes `committed.xp` 100.
 *    `saveBattleStats` applies incoming-below-stored; the leftover is
 *    gone.
 *
 * Fresh lava death after the same remount cuts 20% of Play-entry 100 →
 * 80 over canister 110 / 180 — same wipe class.
 *
 * This sidecar stamps leftover XP **after a parsed commit** in
 * sessionStorage without requiring unpaid death or a throw. Remount
 * absolute XP resolve re-fetches `getCharacter` leftover; stale
 * Play-entry equal to stamped `preXp` fail-closes. Fresh leftover
 * commits and clears the stamp. Level-up leftover already below `preXp`
 * still honours the replica.
 *
 * `xpDelta <= 0` must not stamp (Doka-only shrine / ground / feat).
 * Explicit `applyRewards failed` is a throw path (#767 / #807).
 *
 * `WorldExploration.tsx`, `progressPersist.ts`, `applyRewardsResult.ts`,
 * `rewardResolver.ts`, and the #767 / #807 remount files are occupied /
 * unmerged, so this PR does not restack them. Tests reproduce remount
 * heal / death vs the gated skip. Restack portal / victory enqueue onto
 * `persistXpCreditThroughXpCreditKeepRemount` and absolute XP onto
 * `resolveCommittedXpAfterXpCreditKeepRemount` after those PRs land.
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

export function xpCreditKeepRemountKey(slot: number): string {
  return `pbv_xp_credit_keep_remount_slot${Math.max(1, toNat(slot))}`;
}

export type XpCreditKeepRemountStamp = {
  /** Lock leftover XP before the successful grant. */
  preXp: number;
};

/**
 * Successful leftover XP credit. Doka-only paths (xpDelta 0) are #774 /
 * #800 / #811 / #812. Throw-after-add is #767 / #807.
 */
export function shouldNoteXpCreditKeepRemount(xpDelta: number): boolean {
  return toNat(xpDelta) > 0;
}

export function readXpCreditKeepRemount(
  storage: DeathPenaltyStorage,
  slot: number,
): XpCreditKeepRemountStamp | null {
  try {
    const raw = storage.getItem(xpCreditKeepRemountKey(slot));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<XpCreditKeepRemountStamp>;
    if (parsed.preXp == null) return null;
    return { preXp: toNat(parsed.preXp) };
  } catch {
    return null;
  }
}

export function writeXpCreditKeepRemount(
  storage: DeathPenaltyStorage,
  slot: number,
  stamp: XpCreditKeepRemountStamp,
): void {
  try {
    storage.setItem(
      xpCreditKeepRemountKey(slot),
      JSON.stringify({ preXp: toNat(stamp.preXp) }),
    );
  } catch {
    // private mode
  }
}

export function clearXpCreditKeepRemount(
  storage: DeathPenaltyStorage,
  slot: number,
): void {
  try {
    storage.removeItem(xpCreditKeepRemountKey(slot));
  } catch {
    // ignore
  }
}

export function hasXpCreditKeepRemount(
  storage: DeathPenaltyStorage,
  slot: number,
): boolean {
  return readXpCreditKeepRemount(storage, slot) != null;
}

/**
 * Note remount-durable leftover XP keep after a parsed commit. Does
 * **not** require unpaid death pending (that is #759) and does **not**
 * require a throw (that is #767 / #807). `preXp` is the lock leftover
 * before the grant.
 */
export function noteXpCreditKeepRemount(
  storage: DeathPenaltyStorage,
  slot: number,
  args: { xpDelta: number; preXp: number },
): void {
  if (!shouldNoteXpCreditKeepRemount(args.xpDelta)) return;
  writeXpCreditKeepRemount(storage, slot, { preXp: args.preXp });
}

/**
 * Stale Play-entry leftover still equals the pre-keep lock. A fresh
 * portal leftover (pre+10), a victory leftover (pre+kills), or a
 * level-up leftover already below pre must honour. Missing live is
 * fail-closed only when a keep stamp exists.
 */
export function shouldRefuseXpCreditKeepRemountStaleXp(args: {
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
 * says a leftover grant is already on the canister. Stale Play-entry
 * equal to stamped `preXp` must not fall back to remount leftover
 * (that is the wipe).
 */
export function xpForXpCreditKeepRemountHonour(args: {
  remountXp: number;
  liveXp: number | null;
  keep: boolean;
  stampedPreXp: number;
}): number | null {
  if (
    shouldRefuseXpCreditKeepRemountStaleXp({
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

function refuseStaleXpCreditKeepRemount(): never {
  throw new Error(ABSOLUTE_WRITE_UNCONFIRMED_CREDIT);
}

export type XpCreditKeepRemountPersist = {
  snapshot: () => { xp: number };
  commit?: (next: { xp?: number }) => void;
  enqueue: <T>(fn: () => Promise<T>) => Promise<T>;
};

/**
 * persistAbsoluteProgress / persistDeathPenalty remount leftover used
 * Play-entry XP 100 after a successful portal / victory credit. Fetch
 * character leftover when the remount keep stamp exists. Stale live
 * equal to stamped `preXp` throws.
 */
export async function resolveCommittedXpAfterXpCreditKeepRemount(
  persist: Pick<XpCreditKeepRemountPersist, "snapshot" | "commit">,
  readCharacter: () => Promise<unknown>,
  storage: DeathPenaltyStorage,
  slot: number,
): Promise<number> {
  const remountXp = toNat(persist.snapshot().xp);
  const stamp = readXpCreditKeepRemount(storage, slot);
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
    refuseStaleXpCreditKeepRemount();
  }

  const honoured = xpForXpCreditKeepRemountHonour({
    remountXp,
    liveXp,
    keep: true,
    stampedPreXp: stamp.preXp,
  });
  if (honoured == null) refuseStaleXpCreditKeepRemount();
  persist.commit?.({ xp: honoured });
  clearXpCreditKeepRemount(storage, slot);
  return honoured;
}

/**
 * Portal / victory enqueue `applyRewards` then `commit`. Stamp sidecar
 * keep after the parsed commit so remount heal cannot honour Play-entry
 * leftover. Throws are #767 / #807 — do not stamp here. Call this
 * instead of bare `enqueue` when restacking WorldExploration.
 */
export async function persistXpCreditThroughXpCreditKeepRemount<T>(args: {
  persist: Pick<XpCreditKeepRemountPersist, "enqueue" | "snapshot">;
  storage: DeathPenaltyStorage;
  slot: number;
  xpDelta?: number;
  applyAndCommit: () => Promise<T>;
}): Promise<T> {
  const xpDelta = args.xpDelta ?? PORTAL_TRANSITION_XP;
  return args.persist.enqueue(async () => {
    const preXp = toNat(args.persist.snapshot().xp);
    const result = await args.applyAndCommit();
    noteXpCreditKeepRemount(args.storage, args.slot, { xpDelta, preXp });
    return result;
  });
}
