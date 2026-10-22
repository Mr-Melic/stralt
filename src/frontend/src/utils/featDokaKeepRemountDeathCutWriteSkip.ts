/**
 * #812 stamps remount Doka keep after feat `claimAchievementReward`
 * throw-after-add (`pbv_feat_doka_keep_remount_slotN`) and honours replica
 * wallet on remount **heal / shop** `persistAbsoluteProgress`. Those flags
 * / honour helpers never enter `persistDeathPenalty`.
 *
 * Production death persist reads `progressPersist.snapshot().doka` (or
 * `resolveCommittedDokaForAbsoluteWrite`, which on a seeded remount lock
 * returns committed immediately). Remount `createProgressPersist` seeds
 * GameFlow `dokaBalance` — HUD credit waits for parsed `#ok` then
 * `creditLiveDoka` in `persistAchievementClaim`, so after a throw-after-add
 * that is still Play-entry 200. `shouldApplyCallerDokaHydrate` ignores
 * later wallet refetches while the world session stays mounted.
 *
 * Remount after feat Doka keep **without** unpaid death is still a wipe
 * when the next write is lava death, not heal:
 *
 * Chronology:
 * 1. World hydrated. Lock doka=200 seeded. Canister 200. GameFlow
 *    `dokaBalance` stays 200.
 * 2. Trophy `claimAchievementReward` marks claimed, adds 500 (canister
 *    700) then the replica rejects. `#ok` is never parsed. Commit never
 *    runs. AchievementsPanel catch only toasts. Lock stays 200. No unpaid
 *    death marker. #545 / #552 session flags die on remount. #812 stamps
 *    keep for remount heal.
 * 3. Actor reconnect remounts WorldExploration. New lock seeds
 *    `{ doka: dokaBalance }` = **200**. Session unconfirmed flags are gone.
 * 4. Leftover #812: heal `resolveCommittedDokaAfterFeatDokaKeepRemount`
 *    fetches 700. Unique leftover: lava death `persistDeathPenalty` uses
 *    remount committed 200, `computeDeathPenalty` → Doka **120**.
 *    `saveBattleStats` applies incoming-below-stored; the paid grant is
 *    gone. Retry hits "Reward already claimed".
 *
 * Unique vs **#812** (heal/shop honour of this stamp), **#900** (GameKey
 * death), **#869** (victory death), **#866** (Boss Rush death), and **#877**
 * (one-shot death).
 *
 * This sidecar reads the same #812 stamp and honours replica wallet as
 * the death-cut **base** so 20/40 taxes 700 → 420, not Play-entry
 * 200 → 120. Stale live ≤ stamped `preDoka` fail-closes. Fresh 700
 * commits onto the lock then the death write runs. Pickup-only (no
 * stamp) still cuts 200 → 120.
 *
 * Do not stamp here — #812 notes keep after feat throw-after-add.
 * Explicit `#err` (`already claimed`, `not yet unlocked`, `Unknown
 * achievement`, `claimAchievementReward failed`) never stamps. Do not
 * restack WX / progressPersist / deathPenalty / achievementReward /
 * AchievementsPanel / #812 file.
 *
 * Tests reproduce remount death vs the gated skip. Restack death persist
 * onto `persistDeathPenaltyThroughFeatDokaKeepRemount` after #812 lands.
 * No Motoko.
 */

import {
  type DeathPenaltyAmounts,
  type DeathPenaltyStorage,
  computeDeathPenalty,
} from "./deathPenalty.ts";
import { ABSOLUTE_WRITE_UNCONFIRMED_CREDIT } from "./progressPersist.ts";

function toNat(n: number | null | undefined): number {
  return Math.max(0, Math.floor(Number(n) || 0));
}

/**
 * Same key as #812 `featDokaKeepRemountKey`. Remount death honour
 * must read the feat throw-after-add stamp, not a second key.
 */
export function featDokaKeepRemountDeathCutKey(slot: number): string {
  return `pbv_feat_doka_keep_remount_slot${Math.max(1, toNat(slot))}`;
}

export type FeatDokaKeepRemountDeathCutStamp = {
  /** Lock wallet before the throw-after-add grant. */
  preDoka: number;
};

export function readFeatDokaKeepRemountDeathCut(
  storage: DeathPenaltyStorage,
  slot: number,
): FeatDokaKeepRemountDeathCutStamp | null {
  try {
    const raw = storage.getItem(featDokaKeepRemountDeathCutKey(slot));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<FeatDokaKeepRemountDeathCutStamp>;
    if (parsed.preDoka == null) return null;
    return { preDoka: toNat(parsed.preDoka) };
  } catch {
    return null;
  }
}

export function writeFeatDokaKeepRemountDeathCut(
  storage: DeathPenaltyStorage,
  slot: number,
  stamp: FeatDokaKeepRemountDeathCutStamp,
): void {
  try {
    storage.setItem(
      featDokaKeepRemountDeathCutKey(slot),
      JSON.stringify({ preDoka: toNat(stamp.preDoka) }),
    );
  } catch {
    // private mode
  }
}

export function clearFeatDokaKeepRemountDeathCut(
  storage: DeathPenaltyStorage,
  slot: number,
): void {
  try {
    storage.removeItem(featDokaKeepRemountDeathCutKey(slot));
  } catch {
    // ignore
  }
}

export function hasFeatDokaKeepRemountDeathCut(
  storage: DeathPenaltyStorage,
  slot: number,
): boolean {
  return readFeatDokaKeepRemountDeathCut(storage, slot) != null;
}

/**
 * Tests / restack fixtures. Production stamping stays on #812
 * `noteFeatDokaKeepRemount` after feat throw-after-add.
 */
export function noteFeatDokaKeepRemountDeathCut(
  storage: DeathPenaltyStorage,
  slot: number,
  preDoka: number,
): void {
  writeFeatDokaKeepRemountDeathCut(storage, slot, {
    preDoka: toNat(preDoka),
  });
}

export function dokaFromFeatDeathCutWallet(raw: unknown): number | null {
  if (raw == null) return null;
  if (typeof raw === "object" && raw !== null && "ok" in raw) {
    return dokaFromFeatDeathCutWallet((raw as { ok: unknown }).ok);
  }
  const n = Number(raw);
  if (!Number.isFinite(n)) return null;
  return toNat(n);
}

/**
 * Stale Play-entry / session cache still equals or sits below the pre-keep
 * lock. `claimAchievementReward` only adds, so a live wallet that did not
 * rise is stale (or placeholder 0). Missing live is fail-closed only when a
 * keep stamp exists.
 */
export function shouldRefuseFeatDokaKeepRemountDeathCutStaleDoka(args: {
  keep: boolean;
  liveDoka: number | null;
  stampedPreDoka: number;
}): boolean {
  if (args.keep !== true) return false;
  if (args.liveDoka == null) return true;
  return toNat(args.liveDoka) <= toNat(args.stampedPreDoka);
}

/**
 * Honour remount death-cut **base** Doka from replica wallet when the
 * #812 keep stamp says a feat grant may already be on the canister.
 * Stale Play-entry equal to stamped `preDoka` must not fall back to
 * remount wallet (that is the wipe: 40% of 200 → 120 over 700).
 */
export function dokaForFeatDokaKeepRemountDeathCut(args: {
  remountDoka: number;
  liveDoka: number | null;
  keep: boolean;
  stampedPreDoka: number;
}): number | null {
  if (
    shouldRefuseFeatDokaKeepRemountDeathCutStaleDoka({
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

/**
 * 20/40 on the honoured wallet. Ungated remount uses Play-entry 200 →
 * 120. Gated fresh 700 → 420.
 */
export function deathPenaltyAfterFeatDokaKeepRemount(args: {
  xp: number;
  remountDoka: number;
  liveDoka: number | null;
  keep: boolean;
  stampedPreDoka: number;
}): DeathPenaltyAmounts | null {
  const base = dokaForFeatDokaKeepRemountDeathCut({
    remountDoka: args.remountDoka,
    liveDoka: args.liveDoka,
    keep: args.keep,
    stampedPreDoka: args.stampedPreDoka,
  });
  if (base == null) return null;
  return computeDeathPenalty(args.xp, base);
}

function refuseStaleFeatDokaKeepRemountDeathCut(): never {
  throw new Error(ABSOLUTE_WRITE_UNCONFIRMED_CREDIT);
}

export type FeatDokaKeepRemountDeathCutPersist = {
  snapshot: () => { doka: number; xp: number; level: number };
  commit?: (next: { doka?: number; xp?: number; level?: number }) => void;
  enqueue: <T>(
    fn: () => Promise<T>,
    opts?: { skipBeforeEach?: boolean },
  ) => Promise<T>;
};

/**
 * persistDeathPenalty remount wallet used Play-entry Doka 200 after a
 * feat throw-after-add. Fetch `getCallerDokaBalance` when the #812
 * remount keep stamp exists. Stale live ≤ stamped `preDoka` throws.
 *
 * Success adopts replica onto the lock and clears the stamp so a later
 * leftover heal cannot tax Play-entry again. Fail-close keeps the stamp.
 */
export async function resolveCommittedDokaAfterFeatDokaKeepRemountDeathCut(
  persist: Pick<FeatDokaKeepRemountDeathCutPersist, "snapshot" | "commit">,
  readWallet: () => Promise<unknown>,
  storage: DeathPenaltyStorage,
  slot: number,
): Promise<number> {
  const remountDoka = toNat(persist.snapshot().doka);
  const stamp = readFeatDokaKeepRemountDeathCut(storage, slot);
  if (!stamp) return remountDoka;

  let liveDoka: number | null = null;
  try {
    liveDoka = dokaFromFeatDeathCutWallet(await readWallet());
  } catch (err) {
    if (
      err instanceof Error &&
      err.message === ABSOLUTE_WRITE_UNCONFIRMED_CREDIT
    ) {
      throw err;
    }
    refuseStaleFeatDokaKeepRemountDeathCut();
  }

  const honoured = dokaForFeatDokaKeepRemountDeathCut({
    remountDoka,
    liveDoka,
    keep: true,
    stampedPreDoka: stamp.preDoka,
  });
  if (honoured == null) refuseStaleFeatDokaKeepRemountDeathCut();
  persist.commit?.({ doka: honoured });
  clearFeatDokaKeepRemountDeathCut(storage, slot);
  return honoured;
}

/**
 * Death persist enqueue: honour replica Doka from the #812 stamp, then
 * `computeDeathPenalty` on that base. Production uses `skipBeforeEach`
 * so unpaid flush cannot recut. Call this instead of bare death enqueue
 * when restacking WorldExploration `persistDeathPenalty`.
 */
export async function persistDeathPenaltyThroughFeatDokaKeepRemount<T>(args: {
  persist: FeatDokaKeepRemountDeathCutPersist;
  storage: DeathPenaltyStorage;
  slot: number;
  readWallet: () => Promise<unknown>;
  applyAndCommit: (after: DeathPenaltyAmounts) => Promise<T>;
}): Promise<T> {
  return args.persist.enqueue(
    async () => {
      const committed = args.persist.snapshot();
      const dokaBase =
        await resolveCommittedDokaAfterFeatDokaKeepRemountDeathCut(
          args.persist,
          args.readWallet,
          args.storage,
          args.slot,
        );
      const after = computeDeathPenalty(committed.xp, dokaBase);
      return args.applyAndCommit(after);
    },
    { skipBeforeEach: true },
  );
}
