/**
 * Shop / Doka-heal `persistAbsoluteProgress` awaits `saveBattleStats` then
 * `commit`. #854 stamps remount HP only after that job **returns**
 * (`pbv_absolute_hp_keep_remount_slotN`). Its persist helper's catch test
 * is "do not stamp when applyAndCommit throws (that is #445 / #847)".
 *
 * Those catch paths are **death** persist. Shop / heal throw-after-accept
 * is a different class: `persistDeathPenalty` (imported in WorldExploration
 * as `persistAbsoluteStats`) already invoked; a lost replica response
 * rejects the persist-lock job; `persistAbsoluteProgress.catch` returns
 * `false`; `shouldRollbackFailedHeal` snaps the HUD back to the click
 * `hpBefore`. GameFlow `character.stats.hp` stays Play-entry forever
 * (`handlePlayCharacter` is the only writer).
 *
 * Remount after a **shop / heal saveBattleStats accept-then-throw
 * without death** is still a wipe:
 *
 * Chronology:
 * 1. World hydrated. Play-entry HP 100 / Doka 200. Lock seeded the same.
 *    Canister 100/200.
 * 2. Lava tick drops HUD HP to 40 (local). Doka-heal enqueue invokes
 *    `saveBattleStats` (HP 70 / Doka 190) then throws (`replica went
 *    away`). Commit never runs. Catch returns false. Heal rollback
 *    restores HUD 40 / 200. No unpaid death marker. #445 / #847 do not
 *    run (no death persist). #854 does not stamp (throw, not parsed
 *    success). Same class: Items Buy after damage invokes with live 85
 *    then throws; shop Doka rollback leaves HUD wallet at the pre-spend
 *    snapshot while canister HP is 85.
 * 3. Actor reconnect remounts WorldExploration. `characterStats.hp` /
 *    `maxHp` re-init from Play-entry `character.stats.hp` = **100**.
 *    `shouldStartDokaHeal` is false (`hp < max` is false). Lock Doka
 *    seeds GameFlow 200 (rollback). Session unconfirmed flags are gone.
 * 4. Items Buy `persistAbsoluteProgress(characterStatsRef.hp, nextDoka)`
 *    leftover `resolveAbsoluteWriteHp(100, 100)` = 100. `saveBattleStats`
 *    applies incoming HP; paid heal 70 (or persisted damage 85) is gone.
 *
 * This sidecar stamps `{ preHp, postHp }` **after a transport-keep throw**
 * in `pbv_absolute_hp_throw_keep_remount_slotN` without requiring death
 * or a parsed success. `preHp` is GameFlow Play-entry HP (the remount
 * init). `postHp` is the HP passed into `saveBattleStats`. Equal pre/post
 * (full-HP shop spend) must not stamp. Explicit `#err` (`saveBattleStats
 * failed`, Unauthorized, banned, empty slot, unseeded wallet) must not
 * stamp — the canister did not accept. Remount absolute HP resolve
 * re-fetches `getCharacter` HP; stale Play-entry equal to stamped `preHp`
 * fail-closes. Fresh replica honours.
 *
 * HP is not on `createProgressPersist`, so honour must **not** clear the
 * stamp (a later shop would leftover-write Play-entry 100 again).
 *
 * `WorldExploration.tsx`, `progressPersist.ts`, `deathPenalty.ts`,
 * `itemShop.ts`, `potionHpPersist.ts` (#653), `deathHpKeepRemountWriteSkip.ts`
 * (#847), and `absoluteHpKeepRemountWriteSkip.ts` (#854) are occupied /
 * unmerged, so this PR does not restack them. Tests reproduce remount
 * shop vs the gated skip. Restack persistAbsoluteProgress throw onto
 * `persistAbsoluteHpThroughAbsoluteHpThrowKeepRemount` and absolute HP
 * onto `resolveAbsoluteWriteHpAfterAbsoluteHpThrowKeepRemount` after
 * those PRs land.
 */

import type { DeathPenaltyStorage } from "./deathPenalty.ts";
import { resolveAbsoluteWriteHp } from "./itemShop.ts";
import { ABSOLUTE_WRITE_UNCONFIRMED_CREDIT } from "./progressPersist.ts";

function toNat(n: number | null | undefined): number {
  return Math.max(0, Math.floor(Number(n) || 0));
}

function toMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

export function absoluteHpThrowKeepRemountKey(slot: number): string {
  return `pbv_absolute_hp_throw_keep_remount_slot${Math.max(1, toNat(slot))}`;
}

export type AbsoluteHpThrowKeepRemountStamp = {
  /** GameFlow Play-entry HP that remount will re-init from. */
  preHp: number;
  /** HP passed into saveBattleStats before the transport-keep throw. */
  postHp: number;
};

/**
 * Parsed `#err` / skipped enqueue means the canister did not accept.
 * Any other throw is after-or-during invoke — the replica may have the HP.
 */
export function isExplicitSaveBattleStatsReject(error: unknown): boolean {
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
 * Transport-keep throw after shop / heal persist wrote HP different from
 * Play-entry. Parsed success is #854. Catch / unpaid / death persist are
 * #445 / #847. Explicit `#err` must not note.
 */
export function shouldNoteAbsoluteHpThrowKeepRemount(args: {
  error: unknown;
  preHp: number;
  postHp: number;
}): boolean {
  if (args.error == null) return false;
  if (isExplicitSaveBattleStatsReject(args.error)) return false;
  return toNat(args.postHp) !== toNat(args.preHp);
}

export function readAbsoluteHpThrowKeepRemount(
  storage: DeathPenaltyStorage,
  slot: number,
): AbsoluteHpThrowKeepRemountStamp | null {
  try {
    const raw = storage.getItem(absoluteHpThrowKeepRemountKey(slot));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<AbsoluteHpThrowKeepRemountStamp>;
    if (parsed.preHp == null || parsed.postHp == null) return null;
    return { preHp: toNat(parsed.preHp), postHp: toNat(parsed.postHp) };
  } catch {
    return null;
  }
}

export function writeAbsoluteHpThrowKeepRemount(
  storage: DeathPenaltyStorage,
  slot: number,
  stamp: AbsoluteHpThrowKeepRemountStamp,
): void {
  try {
    storage.setItem(
      absoluteHpThrowKeepRemountKey(slot),
      JSON.stringify({
        preHp: toNat(stamp.preHp),
        postHp: toNat(stamp.postHp),
      }),
    );
  } catch {
    // private mode
  }
}

export function clearAbsoluteHpThrowKeepRemount(
  storage: DeathPenaltyStorage,
  slot: number,
): void {
  try {
    storage.removeItem(absoluteHpThrowKeepRemountKey(slot));
  } catch {
    // ignore
  }
}

export function hasAbsoluteHpThrowKeepRemount(
  storage: DeathPenaltyStorage,
  slot: number,
): boolean {
  return readAbsoluteHpThrowKeepRemount(storage, slot) != null;
}

/**
 * Note remount-durable shop / heal HP after a transport-keep throw.
 * Does **not** require death pending (that is #445 / #847) and does
 * **not** require a parsed success (that is #854).
 */
export function noteAbsoluteHpThrowKeepRemount(
  storage: DeathPenaltyStorage,
  slot: number,
  args: { error: unknown; preHp: number; postHp: number },
): void {
  if (
    !shouldNoteAbsoluteHpThrowKeepRemount({
      error: args.error,
      preHp: args.preHp,
      postHp: args.postHp,
    })
  ) {
    return;
  }
  writeAbsoluteHpThrowKeepRemount(storage, slot, {
    preHp: args.preHp,
    postHp: args.postHp,
  });
}

/**
 * Character HP from `getCharacter`. Play-entry TanStack can stay at the
 * select-screen snapshot after a shop / heal persist invoke.
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
export function shouldRefuseAbsoluteHpThrowKeepRemountStaleHp(args: {
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
 * says shop / heal already invoked. Stale Play-entry equal to stamped
 * `preHp` must not fall back to `resolveAbsoluteWriteHp` (that is the wipe).
 */
export function hpForAbsoluteHpThrowKeepRemountHonour(args: {
  remountLiveHp: number;
  clickHp: number;
  liveHp: number | null;
  keep: boolean;
  stampedPreHp: number;
  stampedPostHp: number;
}): number | null {
  if (
    shouldRefuseAbsoluteHpThrowKeepRemountStaleHp({
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

function refuseStaleAbsoluteHpThrowKeepRemount(): never {
  throw new Error(ABSOLUTE_WRITE_UNCONFIRMED_CREDIT);
}

export type AbsoluteHpThrowKeepRemountPersist = {
  enqueue: <T>(
    fn: () => Promise<T>,
    opts?: { skipBeforeEach?: boolean },
  ) => Promise<T>;
};

/**
 * persistAbsoluteProgress remount HP used Play-entry 100 after a shop /
 * heal saveBattleStats accept-then-throw. Fetch character HP when the
 * remount keep stamp exists. Stale live equal to stamped `preHp` throws.
 *
 * Do not clear the stamp: HP is not on the persist lock, so a later shop
 * would leftover-write Play-entry HP again.
 */
export async function resolveAbsoluteWriteHpAfterAbsoluteHpThrowKeepRemount(args: {
  liveHp: number;
  clickHp: number;
  readCharacter: () => Promise<unknown>;
  storage: DeathPenaltyStorage;
  slot: number;
}): Promise<number> {
  const remountLiveHp = toNat(args.liveHp);
  const clickHp = toNat(args.clickHp);
  const stamp = readAbsoluteHpThrowKeepRemount(args.storage, args.slot);
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
    refuseStaleAbsoluteHpThrowKeepRemount();
  }

  const honoured = hpForAbsoluteHpThrowKeepRemountHonour({
    remountLiveHp,
    clickHp,
    liveHp,
    keep: true,
    stampedPreHp: stamp.preHp,
    stampedPostHp: stamp.postHp,
  });
  if (honoured == null) refuseStaleAbsoluteHpThrowKeepRemount();
  return honoured;
}

/**
 * persistAbsoluteProgress enqueue `saveBattleStats` then commit. A
 * transport-keep throw never returns and never hits #854's success stamp.
 * Note sidecar keep before remount shop can honour Play-entry HP. Parsed
 * success is #854 — do not stamp it here. Explicit `#err` is a reject
 * (canister unchanged). Call this instead of bare `enqueue` when
 * restacking WorldExploration persistAbsoluteProgress.
 */
export async function persistAbsoluteHpThroughAbsoluteHpThrowKeepRemount<
  T,
>(args: {
  persist: AbsoluteHpThrowKeepRemountPersist;
  storage: DeathPenaltyStorage;
  slot: number;
  preHp: number;
  postHp: number;
  skipBeforeEach?: boolean;
  applyAndCommit: () => Promise<T>;
}): Promise<T> {
  return args.persist.enqueue(
    async () => {
      try {
        return await args.applyAndCommit();
      } catch (err) {
        noteAbsoluteHpThrowKeepRemount(args.storage, args.slot, {
          error: err,
          preHp: args.preHp,
          postHp: args.postHp,
        });
        throw err;
      }
    },
    args.skipBeforeEach === true ? { skipBeforeEach: true } : undefined,
  );
}
