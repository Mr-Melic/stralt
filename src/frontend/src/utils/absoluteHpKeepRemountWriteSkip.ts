/**
 * Successful shop / Doka-heal `persistAbsoluteProgress` writes the live HP
 * through `saveBattleStats`. GameFlow `character.stats.hp` stays Play-entry
 * forever (`handlePlayCharacter` is the only writer).
 *
 * Successful death respawn remount HP is owned by #847
 * (`pbv_death_hp_keep_remount_slotN`). Unpaid remount HP is owned by #445
 * (`deathReplayHp` / `pbv_pending_death_penalty_slotN`). Those paths require
 * a death persist. Leftover XP remount keep is owned by #813
 * (`pbv_xp_credit_keep_remount_slotN`). `saveBattleStats` never raises XP
 * (incoming-above-stored is ignored). HP is absolute and **can rise**.
 *
 * Remount after a **successful shop / heal HP write without death** is
 * still a wipe:
 *
 * Chronology:
 * 1. World hydrated. Play-entry HP 100 / Doka 200. Lock seeded the same.
 *    Canister 100/200.
 * 2. Lava tick drops HUD HP to 40 (local). Doka-heal
 *    `persistAbsoluteProgress` accepts HP 70 / Doka 190. No unpaid death
 *    marker. HUD HP 70. GameFlow `character.stats.hp` stays 100. Catch is
 *    not taken, so #445 / #847 do not run (no death persist).
 *    Same class: Items Buy after damage writes the live 85 as a side
 *    effect of the Doka spend.
 * 3. Actor reconnect remounts WorldExploration. `characterStats.hp` /
 *    `maxHp` re-init from Play-entry `character.stats.hp` = **100**.
 *    `shouldStartDokaHeal` is false (`hp < max` is false). Lock Doka
 *    seeds GameFlow 190. Session unconfirmed flags are gone. Unpaid
 *    pending is gone. Death HP-keep stamp is unset.
 * 4. Items Buy `persistAbsoluteProgress(characterStatsRef.hp, nextDoka)`
 *    leftover `resolveAbsoluteWriteHp(100, 100)` = 100. `saveBattleStats`
 *    applies incoming HP; paid heal 70 (or persisted damage 85) is gone.
 *
 * This sidecar stamps `{ preHp, postHp }` **after a parsed
 * persistAbsoluteProgress success** in `pbv_absolute_hp_keep_remount_slotN`
 * without requiring death or a throw. `preHp` is GameFlow Play-entry HP
 * (the remount init). `postHp` is the HP actually written. Equal pre/post
 * (full-HP shop spend) must not stamp. Remount absolute HP resolve
 * re-fetches `getCharacter` HP; stale Play-entry equal to stamped `preHp`
 * fail-closes. Fresh replica honours. Catch / unpaid / death persist must
 * not stamp (#445 / #847).
 *
 * HP is not on `createProgressPersist`, so honour must **not** clear the
 * stamp (a later shop would leftover-write Play-entry 100 again).
 *
 * `WorldExploration.tsx`, `progressPersist.ts`, `deathPenalty.ts`,
 * `itemShop.ts`, `potionHpPersist.ts` (#653), and
 * `deathHpKeepRemountWriteSkip.ts` (#847) are occupied / unmerged, so this
 * PR does not restack them. Tests reproduce remount shop vs the gated
 * skip. Restack persistAbsoluteProgress HP onto
 * `resolveAbsoluteWriteHpAfterAbsoluteHpKeepRemount` and the successful
 * write onto `persistAbsoluteHpThroughAbsoluteHpKeepRemount` after those
 * PRs land.
 */

import type { DeathPenaltyStorage } from "./deathPenalty.ts";
import { resolveAbsoluteWriteHp } from "./itemShop.ts";
import { ABSOLUTE_WRITE_UNCONFIRMED_CREDIT } from "./progressPersist.ts";

function toNat(n: number | null | undefined): number {
  return Math.max(0, Math.floor(Number(n) || 0));
}

export function absoluteHpKeepRemountKey(slot: number): string {
  return `pbv_absolute_hp_keep_remount_slot${Math.max(1, toNat(slot))}`;
}

export type AbsoluteHpKeepRemountStamp = {
  /** GameFlow Play-entry HP that remount will re-init from. */
  preHp: number;
  /** HP actually written by persistAbsoluteProgress. */
  postHp: number;
};

/**
 * Successful shop / heal persist wrote HP different from Play-entry.
 * Catch / unpaid (#445) and death persist (#847) must not note.
 */
export function shouldNoteAbsoluteHpKeepRemount(args: {
  persisted: boolean;
  preHp: number;
  postHp: number;
}): boolean {
  if (args.persisted !== true) return false;
  return toNat(args.postHp) !== toNat(args.preHp);
}

export function readAbsoluteHpKeepRemount(
  storage: DeathPenaltyStorage,
  slot: number,
): AbsoluteHpKeepRemountStamp | null {
  try {
    const raw = storage.getItem(absoluteHpKeepRemountKey(slot));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<AbsoluteHpKeepRemountStamp>;
    if (parsed.preHp == null || parsed.postHp == null) return null;
    return { preHp: toNat(parsed.preHp), postHp: toNat(parsed.postHp) };
  } catch {
    return null;
  }
}

export function writeAbsoluteHpKeepRemount(
  storage: DeathPenaltyStorage,
  slot: number,
  stamp: AbsoluteHpKeepRemountStamp,
): void {
  try {
    storage.setItem(
      absoluteHpKeepRemountKey(slot),
      JSON.stringify({
        preHp: toNat(stamp.preHp),
        postHp: toNat(stamp.postHp),
      }),
    );
  } catch {
    // private mode
  }
}

export function clearAbsoluteHpKeepRemount(
  storage: DeathPenaltyStorage,
  slot: number,
): void {
  try {
    storage.removeItem(absoluteHpKeepRemountKey(slot));
  } catch {
    // ignore
  }
}

export function hasAbsoluteHpKeepRemount(
  storage: DeathPenaltyStorage,
  slot: number,
): boolean {
  return readAbsoluteHpKeepRemount(storage, slot) != null;
}

/**
 * Note remount-durable shop / heal HP after a parsed persistAbsoluteProgress.
 * Does **not** require death pending (that is #445 / #847) and does **not**
 * require a throw.
 */
export function noteAbsoluteHpKeepRemount(
  storage: DeathPenaltyStorage,
  slot: number,
  args: { persisted: boolean; preHp: number; postHp: number },
): void {
  if (
    !shouldNoteAbsoluteHpKeepRemount({
      persisted: args.persisted,
      preHp: args.preHp,
      postHp: args.postHp,
    })
  ) {
    return;
  }
  writeAbsoluteHpKeepRemount(storage, slot, {
    preHp: args.preHp,
    postHp: args.postHp,
  });
}

/**
 * Character HP from `getCharacter`. Play-entry TanStack can stay at the
 * select-screen snapshot after a shop / heal persist.
 */
export function hpFromCharacterRecord(
  record: { stats?: { hp?: unknown } } | null | undefined | unknown,
): number | null {
  if (record == null || typeof record !== "object") return null;
  const stats = (record as { stats?: unknown }).stats;
  if (stats == null || typeof stats !== "object") return null;
  const hp = Number((stats as { hp?: unknown }).hp);
  if (!Number.isFinite(hp)) return null;
  return toNat(hp);
}

/**
 * Stale Play-entry HP still equals stamped `preHp`, or the replica still
 * matches remount live while that live is not the persisted postHp.
 * Fresh `postHp` (or a later paid heal already on the canister) must
 * honour. Missing live is fail-closed only when a keep stamp exists.
 */
export function shouldRefuseAbsoluteHpKeepRemountStaleHp(args: {
  keep: boolean;
  liveHp: number | null;
  remountLiveHp: number;
  stampedPreHp: number;
  stampedPostHp: number;
}): boolean {
  if (args.keep !== true) return false;
  if (args.liveHp == null) return true;
  const live = toNat(args.liveHp);
  const post = toNat(args.stampedPostHp);
  if (live === post) return false;
  if (live === toNat(args.stampedPreHp)) return true;
  const remount = toNat(args.remountLiveHp);
  return live === remount && remount !== post;
}

/**
 * Honour remount absolute HP from replica persisted HP when the keep stamp
 * says shop / heal already wrote it. Stale Play-entry equal to stamped
 * `preHp` must not fall back to `resolveAbsoluteWriteHp` (that is the wipe).
 */
export function hpForAbsoluteHpKeepRemountHonour(args: {
  remountLiveHp: number;
  clickHp: number;
  liveHp: number | null;
  keep: boolean;
  stampedPreHp: number;
  stampedPostHp: number;
}): number | null {
  if (
    shouldRefuseAbsoluteHpKeepRemountStaleHp({
      keep: args.keep,
      liveHp: args.liveHp,
      remountLiveHp: args.remountLiveHp,
      stampedPreHp: args.stampedPreHp,
      stampedPostHp: args.stampedPostHp,
    })
  ) {
    return null;
  }
  if (args.keep === true) {
    if (args.liveHp == null) return null;
    const healDelta = Math.max(
      0,
      toNat(args.clickHp) - toNat(args.remountLiveHp),
    );
    return toNat(args.liveHp) + healDelta;
  }
  return resolveAbsoluteWriteHp(args.remountLiveHp, args.clickHp);
}

function refuseStaleAbsoluteHpKeepRemount(): never {
  throw new Error(ABSOLUTE_WRITE_UNCONFIRMED_CREDIT);
}

export type AbsoluteHpKeepRemountPersist = {
  enqueue: <T>(
    fn: () => Promise<T>,
    opts?: { skipBeforeEach?: boolean },
  ) => Promise<T>;
};

/**
 * persistAbsoluteProgress remount HP used Play-entry 100 after a
 * successful shop / heal persist. Fetch character HP when the remount keep
 * stamp exists. Stale live equal to stamped `preHp` throws.
 *
 * Do not clear the stamp: HP is not on the persist lock, so a later shop
 * would leftover-write Play-entry HP again.
 */
export async function resolveAbsoluteWriteHpAfterAbsoluteHpKeepRemount(args: {
  liveHp: number;
  clickHp: number;
  readCharacter: () => Promise<unknown>;
  storage: DeathPenaltyStorage;
  slot: number;
}): Promise<number> {
  const remountLiveHp = toNat(args.liveHp);
  const clickHp = toNat(args.clickHp);
  const stamp = readAbsoluteHpKeepRemount(args.storage, args.slot);
  if (!stamp) return resolveAbsoluteWriteHp(remountLiveHp, clickHp);

  let liveHp: number | null = null;
  try {
    liveHp = hpFromCharacterRecord(await args.readCharacter());
  } catch (err) {
    if (
      err instanceof Error &&
      err.message === ABSOLUTE_WRITE_UNCONFIRMED_CREDIT
    ) {
      throw err;
    }
    refuseStaleAbsoluteHpKeepRemount();
  }

  const honoured = hpForAbsoluteHpKeepRemountHonour({
    remountLiveHp,
    clickHp,
    liveHp,
    keep: true,
    stampedPreHp: stamp.preHp,
    stampedPostHp: stamp.postHp,
  });
  if (honoured == null) refuseStaleAbsoluteHpKeepRemount();
  return honoured;
}

/**
 * persistAbsoluteProgress enqueue `saveBattleStats` then commit. Stamp
 * sidecar keep after the parsed success so remount shop cannot honour
 * Play-entry HP. Throws / unpaid / death persist are #445 / #847 — do not
 * stamp those here. Call this instead of bare `enqueue` when restacking
 * WorldExploration persistAbsoluteProgress.
 */
export async function persistAbsoluteHpThroughAbsoluteHpKeepRemount<T>(args: {
  persist: AbsoluteHpKeepRemountPersist;
  storage: DeathPenaltyStorage;
  slot: number;
  preHp: number;
  postHp: number;
  skipBeforeEach?: boolean;
  applyAndCommit: () => Promise<T>;
}): Promise<T> {
  return args.persist.enqueue(
    async () => {
      const result = await args.applyAndCommit();
      noteAbsoluteHpKeepRemount(args.storage, args.slot, {
        persisted: true,
        preHp: args.preHp,
        postHp: args.postHp,
      });
      return result;
    },
    args.skipBeforeEach === true ? { skipBeforeEach: true } : undefined,
  );
}
