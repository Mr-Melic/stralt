/**
 * #807 stamps remount leftover XP keep after victory / Boss Rush
 * `resolveBattleRewards` → `applyRewards` throw-after-add
 * (`pbv_victory_xp_keep_remount_slotN`) and honours replica leftover on
 * remount **heal / shop** `persistAbsoluteProgress`. Those flags / honour
 * helpers never enter `persistDeathPenalty`.
 *
 * Production death persist reads `progressPersist.snapshot().xp` (not
 * `getCharacter`). Remount `createProgressPersist` seeds GameFlow
 * `character.experience` — that prop is never updated after `applyRewards`
 * (`handlePlayCharacter` is the only writer), so after a victory keep that
 * is still Play-entry leftover 100. HUD XP waits for parsed commit then
 * `setCharacterStats`. Session `noteUnconfirmedXpCredit` dies on remount.
 *
 * Remount after victory leftover XP keep **without** unpaid death is still
 * a wipe when the next write is lava death, not heal:
 *
 * Chronology:
 * 1. World hydrated. Lock doka=200 / XP 100 seeded. Canister 200/100.
 *    GameFlow `character.experience` stays 100.
 * 2. Victory `resolveBattleRewards` → `applyRewards(slot, doka, 80)`
 *    invokes then throws (`replica went away`). Canister leftover 180.
 *    Commit never runs. Catch only `logDebugInfo`s. Lock stays XP 100.
 *    No unpaid death marker. #356 / #532 / #580 / #599 session flags die
 *    on remount. #759 / #764 refuse to stamp when pending is null. #807
 *    stamps keep for remount heal. Boss Rush room-clear uses the same
 *    `resolveBattleRewards` then log-only catch.
 * 3. Actor reconnect remounts WorldExploration. New lock seeds
 *    `{ xp: character.experience }` = **100**. Session unconfirmed flags
 *    are gone.
 * 4. Leftover #807: heal `resolveCommittedXpAfterVictoryXpKeepRemount`
 *    fetches 180. Unique leftover: lava death `persistDeathPenalty` uses
 *    remount committed 100, `computeDeathPenalty` → XP **80**.
 *    `saveBattleStats` applies incoming-below-stored; victory leftover
 *    is gone.
 *
 * Unique vs **#807** (heal/shop honour of this stamp), **#912** (portal
 * XP remount death of a different stamp), **#813** (successful leftover
 * XP remount heal), **#869** (victory Doka remount death), and **#759** /
 * **#764** (unpaid-death remount XP keep).
 *
 * This sidecar reads the same #807 stamp and honours replica leftover as
 * the death-cut **base** so 20/40 taxes 180 → 144, not Play-entry
 * 100 → 80. Stale live equal to stamped `preXp` fail-closes. Fresh 180
 * commits onto the lock then the death write runs. Leftover already
 * below the stamp (level-up) still honours the replica. Pickup-only (no
 * stamp) still cuts 100 → 80.
 *
 * Do not stamp here — #807 notes keep after victory throw-after-add.
 * Explicit `applyRewards failed` never stamps. Do not restack WX /
 * progressPersist / deathPenalty / rewardResolver / #807 file.
 *
 * Tests reproduce remount death vs the gated skip. Restack death persist
 * onto `persistDeathPenaltyThroughVictoryXpKeepRemount` after #807 lands.
 * No Motoko.
 */

import {
  type DeathPenaltyAmounts,
  type DeathPenaltyStorage,
  computeDeathPenalty,
  experienceFromCharacterRecord,
} from "./deathPenalty.ts";
import { ABSOLUTE_WRITE_UNCONFIRMED_CREDIT } from "./progressPersist.ts";

function toNat(n: number | null | undefined): number {
  return Math.max(0, Math.floor(Number(n) || 0));
}

/**
 * Same key as #807 `victoryXpKeepRemountKey`. Remount death honour
 * must read the victory throw-after-add stamp, not a second key.
 */
export function victoryXpKeepRemountDeathCutKey(slot: number): string {
  return `pbv_victory_xp_keep_remount_slot${Math.max(1, toNat(slot))}`;
}

export type VictoryXpKeepRemountDeathCutStamp = {
  /** Lock leftover XP before the throw-after-add grant. */
  preXp: number;
};

export function readVictoryXpKeepRemountDeathCut(
  storage: DeathPenaltyStorage,
  slot: number,
): VictoryXpKeepRemountDeathCutStamp | null {
  try {
    const raw = storage.getItem(victoryXpKeepRemountDeathCutKey(slot));
    if (!raw) return null;
    const parsed = JSON.parse(
      raw,
    ) as Partial<VictoryXpKeepRemountDeathCutStamp>;
    if (parsed.preXp == null) return null;
    return { preXp: toNat(parsed.preXp) };
  } catch {
    return null;
  }
}

export function writeVictoryXpKeepRemountDeathCut(
  storage: DeathPenaltyStorage,
  slot: number,
  stamp: VictoryXpKeepRemountDeathCutStamp,
): void {
  try {
    storage.setItem(
      victoryXpKeepRemountDeathCutKey(slot),
      JSON.stringify({ preXp: toNat(stamp.preXp) }),
    );
  } catch {
    // private mode
  }
}

export function clearVictoryXpKeepRemountDeathCut(
  storage: DeathPenaltyStorage,
  slot: number,
): void {
  try {
    storage.removeItem(victoryXpKeepRemountDeathCutKey(slot));
  } catch {
    // ignore
  }
}

export function hasVictoryXpKeepRemountDeathCut(
  storage: DeathPenaltyStorage,
  slot: number,
): boolean {
  return readVictoryXpKeepRemountDeathCut(storage, slot) != null;
}

/**
 * Tests / restack fixtures. Production stamping stays on #807
 * `noteVictoryXpKeepRemount` after victory / room-clear throw-after-add.
 */
export function noteVictoryXpKeepRemountDeathCut(
  storage: DeathPenaltyStorage,
  slot: number,
  preXp: number,
): void {
  writeVictoryXpKeepRemountDeathCut(storage, slot, {
    preXp: toNat(preXp),
  });
}

export function xpFromVictoryDeathCutCharacter(raw: unknown): number | null {
  return experienceFromCharacterRecord(raw);
}

/**
 * Stale Play-entry leftover still equals the pre-keep lock. A fresh victory
 * leftover (pre+kills) or leftover already below pre must honour.
 * Missing live is fail-closed only when a keep stamp exists. Match #807
 * (`===`, not `<=`) so a post-level leftover of 24 is not treated as stale.
 */
export function shouldRefuseVictoryXpKeepRemountDeathCutStaleXp(args: {
  keep: boolean;
  liveXp: number | null;
  stampedPreXp: number;
}): boolean {
  if (args.keep !== true) return false;
  if (args.liveXp == null) return true;
  return toNat(args.liveXp) === toNat(args.stampedPreXp);
}

/**
 * Honour remount death-cut **base** XP from replica leftover when the
 * #807 keep stamp says a victory / room-clear grant may already be on
 * the canister. Stale Play-entry equal to stamped `preXp` must not fall
 * back to remount leftover (that is the wipe: 20% of 100 → 80 over 180).
 */
export function xpForVictoryXpKeepRemountDeathCut(args: {
  remountXp: number;
  liveXp: number | null;
  keep: boolean;
  stampedPreXp: number;
}): number | null {
  if (
    shouldRefuseVictoryXpKeepRemountDeathCutStaleXp({
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

/**
 * 20/40 on the honoured leftover. Ungated remount uses Play-entry 100 →
 * 80. Gated fresh 180 → 144. Victory Doka keep is a different stamp
 * (#869), so Doka still taxes the remount wallet here.
 */
export function deathPenaltyAfterVictoryXpKeepRemount(args: {
  remountXp: number;
  remountDoka: number;
  liveXp: number | null;
  keep: boolean;
  stampedPreXp: number;
}): DeathPenaltyAmounts | null {
  const base = xpForVictoryXpKeepRemountDeathCut({
    remountXp: args.remountXp,
    liveXp: args.liveXp,
    keep: args.keep,
    stampedPreXp: args.stampedPreXp,
  });
  if (base == null) return null;
  return computeDeathPenalty(base, args.remountDoka);
}

function refuseStaleVictoryXpKeepRemountDeathCut(): never {
  throw new Error(ABSOLUTE_WRITE_UNCONFIRMED_CREDIT);
}

export type VictoryXpKeepRemountDeathCutPersist = {
  snapshot: () => { doka: number; xp: number; level: number };
  commit?: (next: { doka?: number; xp?: number; level?: number }) => void;
  enqueue: <T>(
    fn: () => Promise<T>,
    opts?: { skipBeforeEach?: boolean },
  ) => Promise<T>;
};

/**
 * persistDeathPenalty remount leftover used Play-entry XP 100 after a
 * victory throw-after-add. Fetch `getCharacter` leftover when the #807
 * remount keep stamp exists. Stale live equal to stamped `preXp` throws.
 *
 * Success adopts replica onto the lock and clears the stamp so a later
 * leftover heal cannot tax Play-entry again. Fail-close keeps the stamp.
 */
export async function resolveCommittedXpAfterVictoryXpKeepRemountDeathCut(
  persist: Pick<VictoryXpKeepRemountDeathCutPersist, "snapshot" | "commit">,
  readCharacter: () => Promise<unknown>,
  storage: DeathPenaltyStorage,
  slot: number,
): Promise<number> {
  const remountXp = toNat(persist.snapshot().xp);
  const stamp = readVictoryXpKeepRemountDeathCut(storage, slot);
  if (!stamp) return remountXp;

  let liveXp: number | null = null;
  try {
    liveXp = xpFromVictoryDeathCutCharacter(await readCharacter());
  } catch (err) {
    if (
      err instanceof Error &&
      err.message === ABSOLUTE_WRITE_UNCONFIRMED_CREDIT
    ) {
      throw err;
    }
    refuseStaleVictoryXpKeepRemountDeathCut();
  }

  const honoured = xpForVictoryXpKeepRemountDeathCut({
    remountXp,
    liveXp,
    keep: true,
    stampedPreXp: stamp.preXp,
  });
  if (honoured == null) refuseStaleVictoryXpKeepRemountDeathCut();
  persist.commit?.({ xp: honoured });
  clearVictoryXpKeepRemountDeathCut(storage, slot);
  return honoured;
}

/**
 * Death persist enqueue: honour replica leftover from the #807 stamp, then
 * `computeDeathPenalty` on that base. Production uses `skipBeforeEach`
 * so unpaid flush cannot recut. Call this instead of bare death enqueue
 * when restacking WorldExploration `persistDeathPenalty`.
 */
export async function persistDeathPenaltyThroughVictoryXpKeepRemount<T>(args: {
  persist: VictoryXpKeepRemountDeathCutPersist;
  storage: DeathPenaltyStorage;
  slot: number;
  readCharacter: () => Promise<unknown>;
  applyAndCommit: (after: DeathPenaltyAmounts) => Promise<T>;
}): Promise<T> {
  return args.persist.enqueue(
    async () => {
      const committed = args.persist.snapshot();
      const xpBase = await resolveCommittedXpAfterVictoryXpKeepRemountDeathCut(
        args.persist,
        args.readCharacter,
        args.storage,
        args.slot,
      );
      const after = computeDeathPenalty(xpBase, committed.doka);
      return args.applyAndCommit(after);
    },
    { skipBeforeEach: true },
  );
}
