/**
 * #813 stamps remount leftover XP keep after a **parsed** portal / victory /
 * Boss Rush `applyRewards` commit (`pbv_xp_credit_keep_remount_slotN`) and
 * honours replica leftover on remount **heal / shop** `persistAbsoluteProgress`.
 * Those flags / honour helpers never enter `persistDeathPenalty`.
 *
 * Production death persist reads `progressPersist.snapshot().xp` (not
 * `getCharacter`). Remount `createProgressPersist` seeds GameFlow
 * `character.experience` — that prop is never updated after `applyRewards`
 * (`handlePlayCharacter` is the only writer), so after a successful leftover
 * keep that is still Play-entry leftover 100. HUD XP waits for parsed commit
 * then `setCharacterStats`. Session `noteUnconfirmedXpCredit` dies on remount.
 *
 * Remount after a successful leftover XP keep **without** unpaid death is
 * still a wipe when the next write is lava death, not heal:
 *
 * Chronology:
 * 1. World hydrated. Lock doka=200 / XP 100 seeded. Canister 200/100.
 *    GameFlow `character.experience` stays 100.
 * 2. Portal `persistIncrementalRewards(0, 10)` or victory / Boss Rush
 *    `resolveBattleRewards` commits leftover 110 / 180. Catch is not taken.
 *    HUD updates. GameFlow Play-entry does not. No unpaid death marker.
 *    #767 / #807 / #912 / #918 do not stamp (no throw). #813 stamps keep
 *    for remount heal.
 * 3. Actor reconnect remounts WorldExploration. New lock seeds
 *    `{ xp: character.experience }` = **100**. Session unconfirmed flags
 *    are gone.
 * 4. Leftover #813: heal `resolveCommittedXpAfterXpCreditKeepRemount`
 *    fetches 110 / 180. Unique leftover: lava death `persistDeathPenalty`
 *    uses remount committed 100, `computeDeathPenalty` → XP **80**.
 *    `saveBattleStats` applies incoming-below-stored; leftover is gone.
 *
 * Unique vs **#813** (heal/shop honour of this stamp), **#912** (portal
 * throw remount death of a different stamp), **#918** (victory throw
 * remount death of a different stamp), **#767** / **#807** (throw remount
 * heal), and **#759** / **#764** (unpaid-death remount XP keep).
 *
 * This sidecar reads the same #813 stamp and honours replica leftover as
 * the death-cut **base** so 20/40 taxes 110 → 88 (portal) or 180 → 144
 * (victory), not Play-entry 100 → 80. Stale live equal to stamped `preXp`
 * fail-closes. Fresh leftover commits onto the lock then the death write
 * runs. Leftover already below the stamp (level-up) still honours the
 * replica. Pickup-only (no stamp) still cuts 100 → 80.
 *
 * Do not stamp here — #813 notes keep after a parsed leftover commit.
 * Throw-after-add is #767 / #807. Explicit `applyRewards failed` never
 * stamps. Do not restack WX / progressPersist / deathPenalty /
 * applyRewardsResult / rewardResolver / #813 file.
 *
 * Tests reproduce remount death vs the gated skip. Restack death persist
 * onto `persistDeathPenaltyThroughXpCreditKeepRemount` after #813 lands.
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
 * Same key as #813 `xpCreditKeepRemountKey`. Remount death honour
 * must read the successful leftover stamp, not a second key.
 */
export function xpCreditKeepRemountDeathCutKey(slot: number): string {
  return `pbv_xp_credit_keep_remount_slot${Math.max(1, toNat(slot))}`;
}

export type XpCreditKeepRemountDeathCutStamp = {
  /** Lock leftover XP before the successful grant. */
  preXp: number;
};

export function readXpCreditKeepRemountDeathCut(
  storage: DeathPenaltyStorage,
  slot: number,
): XpCreditKeepRemountDeathCutStamp | null {
  try {
    const raw = storage.getItem(xpCreditKeepRemountDeathCutKey(slot));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<XpCreditKeepRemountDeathCutStamp>;
    if (parsed.preXp == null) return null;
    return { preXp: toNat(parsed.preXp) };
  } catch {
    return null;
  }
}

export function writeXpCreditKeepRemountDeathCut(
  storage: DeathPenaltyStorage,
  slot: number,
  stamp: XpCreditKeepRemountDeathCutStamp,
): void {
  try {
    storage.setItem(
      xpCreditKeepRemountDeathCutKey(slot),
      JSON.stringify({ preXp: toNat(stamp.preXp) }),
    );
  } catch {
    // private mode
  }
}

export function clearXpCreditKeepRemountDeathCut(
  storage: DeathPenaltyStorage,
  slot: number,
): void {
  try {
    storage.removeItem(xpCreditKeepRemountDeathCutKey(slot));
  } catch {
    // ignore
  }
}

export function hasXpCreditKeepRemountDeathCut(
  storage: DeathPenaltyStorage,
  slot: number,
): boolean {
  return readXpCreditKeepRemountDeathCut(storage, slot) != null;
}

/**
 * Tests / restack fixtures. Production stamping stays on #813
 * `noteXpCreditKeepRemount` after a parsed leftover commit.
 */
export function noteXpCreditKeepRemountDeathCut(
  storage: DeathPenaltyStorage,
  slot: number,
  preXp: number,
): void {
  writeXpCreditKeepRemountDeathCut(storage, slot, {
    preXp: toNat(preXp),
  });
}

export function xpFromXpCreditDeathCutCharacter(raw: unknown): number | null {
  return experienceFromCharacterRecord(raw);
}

/**
 * Stale Play-entry leftover still equals the pre-keep lock. A fresh portal
 * leftover (pre+10), a victory leftover (pre+kills), or leftover already
 * below pre must honour. Missing live is fail-closed only when a keep stamp
 * exists. Match #813 (`===`, not `<=`) so a post-level leftover of 24 is
 * not treated as stale.
 */
export function shouldRefuseXpCreditKeepRemountDeathCutStaleXp(args: {
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
 * #813 keep stamp says a leftover grant is already on the canister.
 * Stale Play-entry equal to stamped `preXp` must not fall back to
 * remount leftover (that is the wipe: 20% of 100 → 80 over 110 / 180).
 */
export function xpForXpCreditKeepRemountDeathCut(args: {
  remountXp: number;
  liveXp: number | null;
  keep: boolean;
  stampedPreXp: number;
}): number | null {
  if (
    shouldRefuseXpCreditKeepRemountDeathCutStaleXp({
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
 * 80. Gated portal 110 → 88. Gated victory 180 → 144. Successful leftover
 * Doka (if any) is a different stamp, so Doka still taxes the remount
 * wallet here.
 */
export function deathPenaltyAfterXpCreditKeepRemount(args: {
  remountXp: number;
  remountDoka: number;
  liveXp: number | null;
  keep: boolean;
  stampedPreXp: number;
}): DeathPenaltyAmounts | null {
  const base = xpForXpCreditKeepRemountDeathCut({
    remountXp: args.remountXp,
    liveXp: args.liveXp,
    keep: args.keep,
    stampedPreXp: args.stampedPreXp,
  });
  if (base == null) return null;
  return computeDeathPenalty(base, args.remountDoka);
}

function refuseStaleXpCreditKeepRemountDeathCut(): never {
  throw new Error(ABSOLUTE_WRITE_UNCONFIRMED_CREDIT);
}

export type XpCreditKeepRemountDeathCutPersist = {
  snapshot: () => { doka: number; xp: number; level: number };
  commit?: (next: { doka?: number; xp?: number; level?: number }) => void;
  enqueue: <T>(
    fn: () => Promise<T>,
    opts?: { skipBeforeEach?: boolean },
  ) => Promise<T>;
};

/**
 * persistDeathPenalty remount leftover used Play-entry XP 100 after a
 * successful portal / victory leftover commit. Fetch `getCharacter`
 * leftover when the #813 remount keep stamp exists. Stale live equal to
 * stamped `preXp` throws.
 *
 * Success adopts replica onto the lock and clears the stamp so a later
 * leftover heal cannot tax Play-entry again. Fail-close keeps the stamp.
 */
export async function resolveCommittedXpAfterXpCreditKeepRemountDeathCut(
  persist: Pick<XpCreditKeepRemountDeathCutPersist, "snapshot" | "commit">,
  readCharacter: () => Promise<unknown>,
  storage: DeathPenaltyStorage,
  slot: number,
): Promise<number> {
  const remountXp = toNat(persist.snapshot().xp);
  const stamp = readXpCreditKeepRemountDeathCut(storage, slot);
  if (!stamp) return remountXp;

  let liveXp: number | null = null;
  try {
    liveXp = xpFromXpCreditDeathCutCharacter(await readCharacter());
  } catch (err) {
    if (
      err instanceof Error &&
      err.message === ABSOLUTE_WRITE_UNCONFIRMED_CREDIT
    ) {
      throw err;
    }
    refuseStaleXpCreditKeepRemountDeathCut();
  }

  const honoured = xpForXpCreditKeepRemountDeathCut({
    remountXp,
    liveXp,
    keep: true,
    stampedPreXp: stamp.preXp,
  });
  if (honoured == null) refuseStaleXpCreditKeepRemountDeathCut();
  persist.commit?.({ xp: honoured });
  clearXpCreditKeepRemountDeathCut(storage, slot);
  return honoured;
}

/**
 * Death persist enqueue: honour replica leftover from the #813 stamp, then
 * `computeDeathPenalty` on that base. Production uses `skipBeforeEach`
 * so unpaid flush cannot recut. Call this instead of bare death enqueue
 * when restacking WorldExploration `persistDeathPenalty`.
 */
export async function persistDeathPenaltyThroughXpCreditKeepRemount<T>(args: {
  persist: XpCreditKeepRemountDeathCutPersist;
  storage: DeathPenaltyStorage;
  slot: number;
  readCharacter: () => Promise<unknown>;
  applyAndCommit: (after: DeathPenaltyAmounts) => Promise<T>;
}): Promise<T> {
  return args.persist.enqueue(
    async () => {
      const committed = args.persist.snapshot();
      const xpBase = await resolveCommittedXpAfterXpCreditKeepRemountDeathCut(
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
