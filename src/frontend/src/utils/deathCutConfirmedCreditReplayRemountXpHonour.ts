/**
 * Seeded death-persist catch-commit plus a later confirmed Doka credit,
 * then **remount honour** after WorldExploration recreates the persist lock.
 *
 * #742 remount skip/flush/resolve fetch-first **Doka** from a session stamp
 * (`pbv_death_cut_credit_replay_remount_slotN`). Production
 * `persistAbsoluteProgress` still honours unpaid 20/40 against
 * `committed.xp` — and remount `createProgressPersist` seeds Play-entry
 * `character.experience` (never updated after `applyRewards`, so leftover
 * XP 100). That is *not* the canister leftover:
 *
 * Chronology (actor reconnect after death-fail catch-commit, a Doka
 * credit that #742 can seed, then a later XP grant):
 * 1. World hydrated. Lock doka=200 / XP 100 seeded. Canister 200/100.
 * 2. Lava death `saveBattleStats` rejects. Catch commits lock 120 / XP 80.
 *    Pending `preXp=100` `afterXp=80`. HUD Doka 120. Canister still 200/100.
 * 3. Ground Doka / feat / GameKey / victory `commit({ doka })` stamps #742
 *    Doka. A later white-portal `persistIncrementalRewards(0, 10)` invokes
 *    `applyRewards` then throws (canister XP 110). Portal commit never
 *    runs, so the remount stamp still has catch-cut `committedXp=80`.
 * 4. Actor reconnect remounts WorldExploration. New lock `{ doka: 120,
 *    xp: 100 }`. #742 remount resolve fetches Doka 250/300/1200/280 and
 *    seeds. Leftover honour uses Play-entry XP **100** → unpaid writes
 *    **80**. `saveBattleStats` incoming-below-stored is applied; portal
 *    +10 is gone.
 *
 * #742 XP skip only runs when `stamp.committedXp > afterXp`. A Doka-only
 * stamp (or a throw-after-add portal that never committed) leaves
 * `committedXp=80`, so remount resolve succeeds and honour still taxes
 * Play-entry leftover. Keep-only (#698) and death-fail without a later
 * credit must still honour 100 → 80. Victory leftover 24 must honour
 * from the replica (already dropped more than 20%), not Play-entry 100.
 *
 * Fetch live XP when remount leftover equals unpaid `preXp` (Play-entry)
 * and differs from `afterXp`. Honour that replica, not the remount lock.
 * `WorldExploration.tsx`, `progressPersist.ts`, `deathPenalty.ts`, and
 * `deathCutConfirmedCreditReplayRemountWriteSkip.ts` (#742) are occupied
 * / unmerged, so this PR does not restack them. Tests reproduce the
 * honour call site. Restack persistAbsoluteProgress honour XP onto
 * `xpForDeathCutCreditRemountHonour` /
 * `resolveCommittedXpAfterDeathCutCreditRemount` after those PRs land.
 */

import {
  type PendingDeathPenalty,
  experienceFromCharacterRecord,
} from "./deathPenalty.ts";
import { ABSOLUTE_WRITE_UNCONFIRMED_CREDIT } from "./progressPersist.ts";

function toNat(n: number | null | undefined): number {
  return Math.max(0, Math.floor(Number(n) || 0));
}

/**
 * Remount `createProgressPersist` seeds Play-entry leftover (`preXp`).
 * Session catch-cut leftover is `afterXp`. Honour must not tax 100 when
 * the replica already has portal +10 / victory leftover.
 */
export function shouldHonourDeathCutCreditRemountLiveXp(args: {
  remountXp: number;
  pendingPreXp?: number | null;
  pendingAfterXp?: number | null;
  cutConfirmed?: boolean;
}): boolean {
  if (args.cutConfirmed === true) return false;
  if (args.pendingPreXp == null || args.pendingAfterXp == null) return false;
  const remount = toNat(args.remountXp);
  const pre = toNat(args.pendingPreXp);
  const after = toNat(args.pendingAfterXp);
  return remount === pre && remount !== after;
}

/**
 * Honour unpaid 20/40 from the replica leftover, not Play-entry 100.
 * A missing live read must not fall back to remount XP (that is the wipe).
 */
export function xpForDeathCutCreditRemountHonour(args: {
  remountXp: number;
  liveXp: number | null;
  pendingPreXp?: number | null;
  pendingAfterXp?: number | null;
  cutConfirmed?: boolean;
}): number | null {
  if (
    !shouldHonourDeathCutCreditRemountLiveXp({
      remountXp: args.remountXp,
      pendingPreXp: args.pendingPreXp,
      pendingAfterXp: args.pendingAfterXp,
      cutConfirmed: args.cutConfirmed,
    })
  ) {
    return toNat(args.remountXp);
  }
  if (args.liveXp == null) return null;
  return toNat(args.liveXp);
}

function refuseStaleDeathCutCreditRemountXpHonour(): never {
  throw new Error(ABSOLUTE_WRITE_UNCONFIRMED_CREDIT);
}

export type DeathCutCreditRemountXpPersist = {
  snapshot: () => { xp: number };
};

/**
 * persistAbsoluteProgress leftover honour used remount Play-entry XP 100
 * after #742 already fetched a credited Doka snapshot. Fetch character
 * leftover when the remount lock still looks like unpaid `preXp`.
 */
export async function resolveCommittedXpAfterDeathCutCreditRemount(
  persist: DeathCutCreditRemountXpPersist,
  readCharacter: () => Promise<unknown>,
  pending: PendingDeathPenalty | null,
): Promise<number> {
  const remountXp = persist.snapshot().xp;
  if (
    !pending ||
    !shouldHonourDeathCutCreditRemountLiveXp({
      remountXp,
      pendingPreXp: pending.preXp,
      pendingAfterXp: pending.afterXp,
      cutConfirmed: pending.cutConfirmed,
    })
  ) {
    return toNat(remountXp);
  }
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
    refuseStaleDeathCutCreditRemountXpHonour();
  }
  const honoured = xpForDeathCutCreditRemountHonour({
    remountXp,
    liveXp,
    pendingPreXp: pending.preXp,
    pendingAfterXp: pending.afterXp,
    cutConfirmed: pending.cutConfirmed,
  });
  if (honoured == null) refuseStaleDeathCutCreditRemountXpHonour();
  return honoured;
}
