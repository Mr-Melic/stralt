/**
 * #767 stamps remount XP keep after portal `persistIncrementalRewards(0, 10)`
 * throw-after-add (`pbv_portal_xp_keep_remount_slotN`) and honours replica
 * leftover on remount **heal / shop** `persistAbsoluteProgress`. Those flags
 * / honour helpers never enter `persistDeathPenalty`.
 *
 * Production death persist reads `progressPersist.snapshot().xp` (not
 * `getCharacter`). Remount `createProgressPersist` seeds GameFlow
 * `character.experience` — that prop is never updated after `applyRewards`
 * (`handlePlayCharacter` is the only writer), so after a portal keep that is
 * still Play-entry leftover 100. HUD XP waits for parsed commit then
 * `setCharacterStats`. Session `noteUnconfirmedXpCredit` dies on remount.
 *
 * Remount after portal XP keep **without** unpaid death is still a wipe
 * when the next write is lava death, not heal:
 *
 * Chronology:
 * 1. World hydrated. Lock doka=200 / XP 100 seeded. Canister 200/100.
 *    GameFlow `character.experience` stays 100.
 * 2. White portal `persistIncrementalRewards(0, 10)` invokes then throws
 *    (`replica went away`). Canister leftover 110. Commit never runs.
 *    Catch only `console.warn`s. Lock stays XP 100. No unpaid death
 *    marker. #356 / #599 session flags die on remount. #759 / #764
 *    refuse to stamp when pending is null. #767 stamps keep for remount
 *    heal.
 * 3. Actor reconnect remounts WorldExploration. New lock seeds
 *    `{ xp: character.experience }` = **100**. Session unconfirmed flags
 *    are gone.
 * 4. Leftover #767: heal `resolveCommittedXpAfterPortalXpKeepRemount`
 *    fetches 110. Unique leftover: lava death `persistDeathPenalty` uses
 *    remount committed 100, `computeDeathPenalty` → XP **80**.
 *    `saveBattleStats` applies incoming-below-stored; portal +10 is gone.
 *
 * Unique vs **#767** (heal/shop honour of this stamp), **#807** (victory
 * XP remount heal of a different stamp), **#813** (successful leftover
 * XP remount heal), **#909** (feat Doka remount death), **#900**
 * (GameKey remount death), and **#759** / **#764** (unpaid-death remount
 * XP keep).
 *
 * This sidecar reads the same #767 stamp and honours replica leftover as
 * the death-cut **base** so 20/40 taxes 110 → 88, not Play-entry
 * 100 → 80. Stale live equal to stamped `preXp` fail-closes. Fresh 110
 * commits onto the lock then the death write runs. Leftover already
 * below the stamp (level-up) still honours the replica. Pickup-only (no
 * stamp) still cuts 100 → 80.
 *
 * Do not stamp here — #767 notes keep after portal throw-after-add.
 * Explicit `applyRewards failed` never stamps. Do not restack WX /
 * progressPersist / deathPenalty / applyRewardsResult / #767 file.
 *
 * Tests reproduce remount death vs the gated skip. Restack death persist
 * onto `persistDeathPenaltyThroughPortalXpKeepRemount` after #767 lands.
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
 * Same key as #767 `portalXpKeepRemountKey`. Remount death honour
 * must read the portal throw-after-add stamp, not a second key.
 */
export function portalXpKeepRemountDeathCutKey(slot: number): string {
  return `pbv_portal_xp_keep_remount_slot${Math.max(1, toNat(slot))}`;
}

export type PortalXpKeepRemountDeathCutStamp = {
  /** Lock leftover XP before the throw-after-add grant. */
  preXp: number;
};

export function readPortalXpKeepRemountDeathCut(
  storage: DeathPenaltyStorage,
  slot: number,
): PortalXpKeepRemountDeathCutStamp | null {
  try {
    const raw = storage.getItem(portalXpKeepRemountDeathCutKey(slot));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<PortalXpKeepRemountDeathCutStamp>;
    if (parsed.preXp == null) return null;
    return { preXp: toNat(parsed.preXp) };
  } catch {
    return null;
  }
}

export function writePortalXpKeepRemountDeathCut(
  storage: DeathPenaltyStorage,
  slot: number,
  stamp: PortalXpKeepRemountDeathCutStamp,
): void {
  try {
    storage.setItem(
      portalXpKeepRemountDeathCutKey(slot),
      JSON.stringify({ preXp: toNat(stamp.preXp) }),
    );
  } catch {
    // private mode
  }
}

export function clearPortalXpKeepRemountDeathCut(
  storage: DeathPenaltyStorage,
  slot: number,
): void {
  try {
    storage.removeItem(portalXpKeepRemountDeathCutKey(slot));
  } catch {
    // ignore
  }
}

export function hasPortalXpKeepRemountDeathCut(
  storage: DeathPenaltyStorage,
  slot: number,
): boolean {
  return readPortalXpKeepRemountDeathCut(storage, slot) != null;
}

/**
 * Tests / restack fixtures. Production stamping stays on #767
 * `notePortalXpKeepRemount` after portal throw-after-add.
 */
export function notePortalXpKeepRemountDeathCut(
  storage: DeathPenaltyStorage,
  slot: number,
  preXp: number,
): void {
  writePortalXpKeepRemountDeathCut(storage, slot, {
    preXp: toNat(preXp),
  });
}

export function xpFromPortalDeathCutCharacter(raw: unknown): number | null {
  return experienceFromCharacterRecord(raw);
}

/**
 * Stale Play-entry leftover still equals the pre-keep lock. A fresh portal
 * leftover (pre+10) or a victory leftover already below pre must honour.
 * Missing live is fail-closed only when a keep stamp exists. Match #767
 * (`===`, not `<=`) so a post-level leftover of 24 is not treated as stale.
 */
export function shouldRefusePortalXpKeepRemountDeathCutStaleXp(args: {
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
 * #767 keep stamp says a portal grant may already be on the canister.
 * Stale Play-entry equal to stamped `preXp` must not fall back to
 * remount leftover (that is the wipe: 20% of 100 → 80 over 110).
 */
export function xpForPortalXpKeepRemountDeathCut(args: {
  remountXp: number;
  liveXp: number | null;
  keep: boolean;
  stampedPreXp: number;
}): number | null {
  if (
    shouldRefusePortalXpKeepRemountDeathCutStaleXp({
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
 * 80. Gated fresh 110 → 88. Portal `dokaDelta` is 0 so Doka still taxes
 * remount wallet.
 */
export function deathPenaltyAfterPortalXpKeepRemount(args: {
  remountXp: number;
  remountDoka: number;
  liveXp: number | null;
  keep: boolean;
  stampedPreXp: number;
}): DeathPenaltyAmounts | null {
  const base = xpForPortalXpKeepRemountDeathCut({
    remountXp: args.remountXp,
    liveXp: args.liveXp,
    keep: args.keep,
    stampedPreXp: args.stampedPreXp,
  });
  if (base == null) return null;
  return computeDeathPenalty(base, args.remountDoka);
}

function refuseStalePortalXpKeepRemountDeathCut(): never {
  throw new Error(ABSOLUTE_WRITE_UNCONFIRMED_CREDIT);
}

export type PortalXpKeepRemountDeathCutPersist = {
  snapshot: () => { doka: number; xp: number; level: number };
  commit?: (next: { doka?: number; xp?: number; level?: number }) => void;
  enqueue: <T>(
    fn: () => Promise<T>,
    opts?: { skipBeforeEach?: boolean },
  ) => Promise<T>;
};

/**
 * persistDeathPenalty remount leftover used Play-entry XP 100 after a
 * portal throw-after-add. Fetch `getCharacter` leftover when the #767
 * remount keep stamp exists. Stale live equal to stamped `preXp` throws.
 *
 * Success adopts replica onto the lock and clears the stamp so a later
 * leftover heal cannot tax Play-entry again. Fail-close keeps the stamp.
 */
export async function resolveCommittedXpAfterPortalXpKeepRemountDeathCut(
  persist: Pick<PortalXpKeepRemountDeathCutPersist, "snapshot" | "commit">,
  readCharacter: () => Promise<unknown>,
  storage: DeathPenaltyStorage,
  slot: number,
): Promise<number> {
  const remountXp = toNat(persist.snapshot().xp);
  const stamp = readPortalXpKeepRemountDeathCut(storage, slot);
  if (!stamp) return remountXp;

  let liveXp: number | null = null;
  try {
    liveXp = xpFromPortalDeathCutCharacter(await readCharacter());
  } catch (err) {
    if (
      err instanceof Error &&
      err.message === ABSOLUTE_WRITE_UNCONFIRMED_CREDIT
    ) {
      throw err;
    }
    refuseStalePortalXpKeepRemountDeathCut();
  }

  const honoured = xpForPortalXpKeepRemountDeathCut({
    remountXp,
    liveXp,
    keep: true,
    stampedPreXp: stamp.preXp,
  });
  if (honoured == null) refuseStalePortalXpKeepRemountDeathCut();
  persist.commit?.({ xp: honoured });
  clearPortalXpKeepRemountDeathCut(storage, slot);
  return honoured;
}

/**
 * Death persist enqueue: honour replica leftover from the #767 stamp, then
 * `computeDeathPenalty` on that base. Production uses `skipBeforeEach`
 * so unpaid flush cannot recut. Call this instead of bare death enqueue
 * when restacking WorldExploration `persistDeathPenalty`.
 */
export async function persistDeathPenaltyThroughPortalXpKeepRemount<T>(args: {
  persist: PortalXpKeepRemountDeathCutPersist;
  storage: DeathPenaltyStorage;
  slot: number;
  readCharacter: () => Promise<unknown>;
  applyAndCommit: (after: DeathPenaltyAmounts) => Promise<T>;
}): Promise<T> {
  return args.persist.enqueue(
    async () => {
      const committed = args.persist.snapshot();
      const xpBase = await resolveCommittedXpAfterPortalXpKeepRemountDeathCut(
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
