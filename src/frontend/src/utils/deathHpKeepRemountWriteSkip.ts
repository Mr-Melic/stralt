/**
 * Successful lava/spike `persistDeathPenalty` writes respawn HP through
 * `saveBattleStats`, confirms the unpaid marker, and snaps the HUD to
 * `respawnHpAfterDeath`. GameFlow `character.stats.hp` stays Play-entry
 * forever (`handlePlayCharacter` is the only writer).
 *
 * Unpaid remount HP is owned by #445 (`deathReplayHp`): that path still
 * has `pbv_pending_death_penalty_slotN`, so remount replay can sync the
 * live ref. Successful death **clears** the marker, so remount replay
 * never runs.
 *
 * Successful leftover XP remount keep is owned by #813
 * (`pbv_xp_credit_keep_remount_slotN`). `saveBattleStats` never raises
 * XP (incoming-above-stored is ignored), so remount Play-entry leftover
 * 100 over death-cut 80 is not a wipe. HP is absolute and **can rise**.
 *
 * Remount after a **successful** death persist is still a wipe:
 *
 * Chronology:
 * 1. World hydrated. Play-entry HP 100 / XP 100 / Doka 200. Lock seeded
 *    the same. Canister 100/100/200. Level 4 respawn is 57
 *    (`floor(100 * (1 + 0.15) * 0.5)`).
 * 2. Lava death. `persistDeathPenalty` `saveBattleStats` accepts HP 57,
 *    XP 80, Doka 120. Marker confirmed and cleared. HUD HP 57. GameFlow
 *    `character.stats.hp` stays 100. Catch is not taken, so #445 does
 *    not run.
 * 3. Actor reconnect remounts WorldExploration. `characterStats.hp`
 *    re-inits from Play-entry `character.stats.hp` = **100**. `maxHp`
 *    is the same field, so Doka-heal is blocked (hp < max is false).
 *    Lock Doka seeds GameFlow 120 (updated). Session unconfirmed flags
 *    are gone. Unpaid pending is gone.
 * 4. Items Buy `persistAbsoluteProgress(characterStatsRef.hp, nextDoka)`
 *    uses `resolveAbsoluteWriteHp(100, 100)` = 100. `saveBattleStats`
 *    applies incoming HP; respawn 57 is gone.
 *
 * This sidecar stamps `{ preHp, postHp }` **after a parsed death
 * persist success** in `pbv_death_hp_keep_remount_slotN` without
 * requiring unpaid death or a throw. Remount absolute HP resolve
 * re-fetches `getCharacter` HP; stale Play-entry equal to stamped
 * `preHp` (or equal to remount live while that live is not respawn)
 * fail-closes. Fresh respawn commits the honour. Catch / unpaid must
 * not stamp (that is #445).
 *
 * HP is not on `createProgressPersist`, so honour must **not** clear
 * the stamp (a later shop would leftover-write Play-entry 100 again).
 *
 * `WorldExploration.tsx`, `progressPersist.ts`, `deathPenalty.ts`,
 * `itemShop.ts`, and `deathReplayHp.ts` (#445) are occupied / unmerged,
 * so this PR does not restack them. Tests reproduce remount shop vs
 * the gated skip. Restack death persist onto
 * `persistDeathPenaltyThroughDeathHpKeepRemount` and absolute HP onto
 * `resolveAbsoluteWriteHpAfterDeathHpKeepRemount` after those PRs land.
 */

import {
  type DeathPenaltyStorage,
  respawnHpAfterDeath,
} from "./deathPenalty.ts";
import { resolveAbsoluteWriteHp } from "./itemShop.ts";
import { ABSOLUTE_WRITE_UNCONFIRMED_CREDIT } from "./progressPersist.ts";

function toNat(n: number | null | undefined): number {
  return Math.max(0, Math.floor(Number(n) || 0));
}

export function deathHpKeepRemountKey(slot: number): string {
  return `pbv_death_hp_keep_remount_slot${Math.max(1, toNat(slot))}`;
}

export type DeathHpKeepRemountStamp = {
  /** Live HP at successful death persist, before the respawn snap. */
  preHp: number;
  /** `respawnHpAfterDeath` written by saveBattleStats. */
  postHp: number;
};

/**
 * Successful death persist wrote respawn HP. Catch / unpaid (#445)
 * must not note. `postHp` is always ≥ 1 (`respawnHpAfterDeath`).
 */
export function shouldNoteDeathHpKeepRemount(args: {
  persisted: boolean;
  postHp: number;
}): boolean {
  return args.persisted === true && toNat(args.postHp) >= 1;
}

export function readDeathHpKeepRemount(
  storage: DeathPenaltyStorage,
  slot: number,
): DeathHpKeepRemountStamp | null {
  try {
    const raw = storage.getItem(deathHpKeepRemountKey(slot));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<DeathHpKeepRemountStamp>;
    if (parsed.preHp == null || parsed.postHp == null) return null;
    return { preHp: toNat(parsed.preHp), postHp: toNat(parsed.postHp) };
  } catch {
    return null;
  }
}

export function writeDeathHpKeepRemount(
  storage: DeathPenaltyStorage,
  slot: number,
  stamp: DeathHpKeepRemountStamp,
): void {
  try {
    storage.setItem(
      deathHpKeepRemountKey(slot),
      JSON.stringify({
        preHp: toNat(stamp.preHp),
        postHp: toNat(stamp.postHp),
      }),
    );
  } catch {
    // private mode
  }
}

export function clearDeathHpKeepRemount(
  storage: DeathPenaltyStorage,
  slot: number,
): void {
  try {
    storage.removeItem(deathHpKeepRemountKey(slot));
  } catch {
    // ignore
  }
}

export function hasDeathHpKeepRemount(
  storage: DeathPenaltyStorage,
  slot: number,
): boolean {
  return readDeathHpKeepRemount(storage, slot) != null;
}

/**
 * Note remount-durable respawn HP after a parsed death persist.
 * Does **not** require unpaid death pending (that is #445) and does
 * **not** require a throw.
 */
export function noteDeathHpKeepRemount(
  storage: DeathPenaltyStorage,
  slot: number,
  args: { persisted: boolean; preHp: number; postHp: number },
): void {
  if (
    !shouldNoteDeathHpKeepRemount({
      persisted: args.persisted,
      postHp: args.postHp,
    })
  ) {
    return;
  }
  writeDeathHpKeepRemount(storage, slot, {
    preHp: args.preHp,
    postHp: args.postHp,
  });
}

/**
 * Character HP from `getCharacter`. Play-entry TanStack can stay at the
 * select-screen snapshot after death persist.
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
 * Stale Play-entry / pre-death HP still equals stamped `preHp`, or the
 * replica still matches remount live while that live is not respawn.
 * Fresh `postHp` (or a later paid heal already on the canister) must
 * honour. Missing live is fail-closed only when a keep stamp exists.
 */
export function shouldRefuseDeathHpKeepRemountStaleHp(args: {
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
 * Honour remount absolute HP from replica respawn when the keep stamp
 * says death persist already wrote it. Stale Play-entry equal to
 * stamped `preHp` must not fall back to `resolveAbsoluteWriteHp`
 * (that is the wipe).
 */
export function hpForDeathHpKeepRemountHonour(args: {
  remountLiveHp: number;
  clickHp: number;
  liveHp: number | null;
  keep: boolean;
  stampedPreHp: number;
  stampedPostHp: number;
}): number | null {
  if (
    shouldRefuseDeathHpKeepRemountStaleHp({
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

function refuseStaleDeathHpKeepRemount(): never {
  throw new Error(ABSOLUTE_WRITE_UNCONFIRMED_CREDIT);
}

export type DeathHpKeepRemountPersist = {
  enqueue: <T>(
    fn: () => Promise<T>,
    opts?: { skipBeforeEach?: boolean },
  ) => Promise<T>;
};

/**
 * persistAbsoluteProgress remount HP used Play-entry 100 after a
 * successful death persist. Fetch character HP when the remount keep
 * stamp exists. Stale live equal to stamped `preHp` throws.
 *
 * Do not clear the stamp: HP is not on the persist lock, so a later
 * shop would leftover-write Play-entry HP again.
 */
export async function resolveAbsoluteWriteHpAfterDeathHpKeepRemount(args: {
  liveHp: number;
  clickHp: number;
  readCharacter: () => Promise<unknown>;
  storage: DeathPenaltyStorage;
  slot: number;
}): Promise<number> {
  const remountLiveHp = toNat(args.liveHp);
  const clickHp = toNat(args.clickHp);
  const stamp = readDeathHpKeepRemount(args.storage, args.slot);
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
    refuseStaleDeathHpKeepRemount();
  }

  const honoured = hpForDeathHpKeepRemountHonour({
    remountLiveHp,
    clickHp,
    liveHp,
    keep: true,
    stampedPreHp: stamp.preHp,
    stampedPostHp: stamp.postHp,
  });
  if (honoured == null) refuseStaleDeathHpKeepRemount();
  return honoured;
}

/**
 * Death persist enqueue `saveBattleStats` then confirm-and-clear. Stamp
 * sidecar keep after the parsed success so remount shop cannot honour
 * Play-entry HP. Throws / unpaid catch are #445 — do not stamp here.
 * Call this instead of bare `enqueue` when restacking WorldExploration.
 */
export async function persistDeathPenaltyThroughDeathHpKeepRemount<T>(args: {
  persist: DeathHpKeepRemountPersist;
  storage: DeathPenaltyStorage;
  slot: number;
  preHp: number;
  postHp: number;
  skipBeforeEach?: boolean;
  applyAndCommit: () => Promise<T>;
}): Promise<T> {
  const postHp =
    toNat(args.postHp) >= 1 ? toNat(args.postHp) : respawnHpAfterDeath(1);
  return args.persist.enqueue(
    async () => {
      const result = await args.applyAndCommit();
      noteDeathHpKeepRemount(args.storage, args.slot, {
        persisted: true,
        preHp: args.preHp,
        postHp,
      });
      return result;
    },
    { skipBeforeEach: args.skipBeforeEach !== false },
  );
}
