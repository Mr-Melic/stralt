/**
 * Seeded death-persist catch-commit plus a later XP grant that invoked
 * `applyRewards` then threw, then **remount honour / flush** after
 * WorldExploration recreates the persist lock.
 *
 * #756 remount honour fetches replica leftover when Play-entry
 * `character.experience` still equals unpaid `preXp`. Production
 * `getCharacter` is a TanStack snapshot: a Doka-only credit invalidates
 * the wallet query, but a portal throw-after-add never commits, so the
 * character cache can stay at Play-entry 100 while the canister is 110.
 * #756 treats live 100 as pickup-only and leftover honour writes **80**.
 * `saveBattleStats` incoming-below-stored is applied; portal +10 is gone.
 *
 * Heal `beforeEach` flush is the same wipe when the wallet query is
 * fresh (250) and the character query is stale (100): #742 remount skip
 * requires live Doka ≤ `preDoka` or stamped `committedXp > afterXp`.
 * Throw-after-add never committed XP, so flush writes 80/170.
 *
 * Chronology:
 * 1. World hydrated. Lock doka=200 / XP 100 seeded. Canister 200/100.
 * 2. Lava death `saveBattleStats` rejects. Catch commits lock 120 / XP 80.
 *    Pending `preXp=100` `afterXp=80`. HUD Doka 120. Canister still 200/100.
 * 3. Ground Doka / feat / GameKey `commit({ doka })` stamps #742 Doka.
 *    White portal `persistIncrementalRewards(0, 10)` invokes then throws
 *    (canister XP 110). Portal commit never runs. #742 `committedXp` stays
 *    catch-cut 80. Session `noteUnconfirmedCredit` dies with the remount.
 * 4. Actor reconnect remounts WorldExploration. New lock `{ doka: 120,
 *    xp: 100 }`. #742 remount resolve seeds Doka 250. #756 honour fetches
 *    stale getCharacter **100** → unpaid writes **80**. Flush with mixed
 *    250/100 writes 80/170.
 *
 * Pickup-only replica 100 (no XP grant) must still honour 100 → 80.
 * Victory leftover 24 is already below `preXp` and must not fail-close.
 * Explicit `applyRewards failed` must not stamp (canister did not add).
 *
 * `WorldExploration.tsx`, `progressPersist.ts`, `deathPenalty.ts`,
 * `applyRewardsResult.ts`, and the #742 / #756 remount files are occupied
 * / unmerged, so this PR does not restack them. Tests reproduce honour,
 * flush, and the portal persist job. Restack portal enqueue onto
 * `persistIncrementalXpThroughDeathCutCreditRemountXpKeep`, honour XP onto
 * `resolveCommittedXpAfterDeathCutCreditRemountXpKeep`, and heal/shop
 * `beforeEach` onto
 * `flushPendingDeathPenaltyThroughDeathCutCreditRemountXpKeep` after
 * those PRs land.
 */

import { persistIncrementalRewards } from "./applyRewardsResult.ts";
import {
  type DeathPenaltyStorage,
  type FlushPendingDeathArgs,
  type PendingDeathPenalty,
  experienceFromCharacterRecord,
  flushPendingDeathPenalty,
  readPendingDeathPenalty,
} from "./deathPenalty.ts";
import { ABSOLUTE_WRITE_UNCONFIRMED_CREDIT } from "./progressPersist.ts";

function toNat(n: number | null | undefined): number {
  return Math.max(0, Math.floor(Number(n) || 0));
}

function toMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

export function deathCutCreditRemountXpKeepKey(slot: number): string {
  return `pbv_death_cut_credit_replay_remount_xp_keep_slot${Math.max(1, toNat(slot))}`;
}

export type DeathCutCreditRemountXpKeep = {
  preXp: number;
  afterXp: number;
};

/**
 * Parsed `#err` / `applyRewards failed` means the canister did not add.
 * Any other throw is after-or-during invoke — the replica may have the grant.
 */
export function shouldNoteDeathCutCreditRemountXpKeep(args: {
  xpDelta: number;
  error: unknown;
  pending: PendingDeathPenalty | null;
}): boolean {
  if (!args.pending || args.pending.cutConfirmed === true) return false;
  if (toNat(args.xpDelta) <= 0) return false;
  const msg = toMessage(args.error);
  if (!msg) return false;
  if (msg.includes("applyRewards failed")) return false;
  return true;
}

export function readDeathCutCreditRemountXpKeep(
  storage: DeathPenaltyStorage,
  slot: number,
): DeathCutCreditRemountXpKeep | null {
  try {
    const raw = storage.getItem(deathCutCreditRemountXpKeepKey(slot));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<DeathCutCreditRemountXpKeep>;
    if (parsed.preXp == null || parsed.afterXp == null) return null;
    return {
      preXp: toNat(parsed.preXp),
      afterXp: toNat(parsed.afterXp),
    };
  } catch {
    return null;
  }
}

export function writeDeathCutCreditRemountXpKeep(
  storage: DeathPenaltyStorage,
  slot: number,
  stamp: DeathCutCreditRemountXpKeep,
): void {
  try {
    storage.setItem(
      deathCutCreditRemountXpKeepKey(slot),
      JSON.stringify({
        preXp: toNat(stamp.preXp),
        afterXp: toNat(stamp.afterXp),
      }),
    );
  } catch {
    // private mode
  }
}

export function clearDeathCutCreditRemountXpKeep(
  storage: DeathPenaltyStorage,
  slot: number,
): void {
  try {
    storage.removeItem(deathCutCreditRemountXpKeepKey(slot));
  } catch {
    // ignore
  }
}

export function noteDeathCutCreditRemountXpKeep(
  storage: DeathPenaltyStorage,
  slot: number,
  args: { xpDelta: number; error: unknown },
): void {
  const pending = readPendingDeathPenalty(storage, slot);
  if (
    !shouldNoteDeathCutCreditRemountXpKeep({
      xpDelta: args.xpDelta,
      error: args.error,
      pending,
    })
  ) {
    return;
  }
  if (!pending) return;
  writeDeathCutCreditRemountXpKeep(storage, pending.slot, {
    preXp: pending.preXp,
    afterXp: pending.afterXp,
  });
}

export function hasDeathCutCreditRemountXpKeep(
  storage: DeathPenaltyStorage,
  slot: number,
  pending?: PendingDeathPenalty | null,
): boolean {
  const keep = readDeathCutCreditRemountXpKeep(storage, slot);
  if (!keep) return false;
  if (!pending) return true;
  return (
    toNat(keep.preXp) === toNat(pending.preXp) &&
    toNat(keep.afterXp) === toNat(pending.afterXp)
  );
}

/**
 * Stale Play-entry leftover equals unpaid `preXp`. Victory leftover 24 is
 * already below `preXp` and must still honour. Missing live is fail-closed
 * only when a keep stamp exists.
 */
export function shouldRefuseDeathCutCreditRemountStaleXp(args: {
  keep: boolean;
  liveXp: number | null;
  pendingPreXp: number;
  cutConfirmed?: boolean;
}): boolean {
  if (args.cutConfirmed === true) return false;
  if (args.keep !== true) return false;
  if (args.liveXp == null) return true;
  return toNat(args.liveXp) === toNat(args.pendingPreXp);
}

/**
 * Honour unpaid 20/40 from replica leftover when the keep stamp says an
 * XP grant may already be on the canister. Stale Play-entry 100 must not
 * fall back to remount leftover (that is the wipe).
 */
export function xpForDeathCutCreditRemountXpKeepHonour(args: {
  remountXp: number;
  liveXp: number | null;
  keep: boolean;
  pendingPreXp: number;
  cutConfirmed?: boolean;
}): number | null {
  if (
    shouldRefuseDeathCutCreditRemountStaleXp({
      keep: args.keep,
      liveXp: args.liveXp,
      pendingPreXp: args.pendingPreXp,
      cutConfirmed: args.cutConfirmed,
    })
  ) {
    return null;
  }
  if (args.keep === true && args.cutConfirmed !== true) {
    return args.liveXp == null ? null : toNat(args.liveXp);
  }
  return toNat(args.remountXp);
}

function refuseStaleDeathCutCreditRemountXpKeep(): never {
  throw new Error(ABSOLUTE_WRITE_UNCONFIRMED_CREDIT);
}

export type DeathCutCreditRemountXpKeepPersist = {
  snapshot: () => { xp: number };
  enqueue: <T>(fn: () => Promise<T>) => Promise<T>;
};

/**
 * persistAbsoluteProgress leftover honour used remount Play-entry XP 100
 * (or #756's stale getCharacter 100) after a portal throw-after-add.
 * Fetch character leftover when the remount keep stamp exists. Stale live
 * equal to unpaid `preXp` throws.
 */
export async function resolveCommittedXpAfterDeathCutCreditRemountXpKeep(
  persist: Pick<DeathCutCreditRemountXpKeepPersist, "snapshot">,
  readCharacter: () => Promise<unknown>,
  pending: PendingDeathPenalty | null,
  storage: DeathPenaltyStorage,
  slot: number,
): Promise<number> {
  const remountXp = toNat(persist.snapshot().xp);
  if (
    !pending ||
    pending.cutConfirmed === true ||
    !hasDeathCutCreditRemountXpKeep(storage, slot, pending)
  ) {
    return remountXp;
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
    refuseStaleDeathCutCreditRemountXpKeep();
  }
  const honoured = xpForDeathCutCreditRemountXpKeepHonour({
    remountXp,
    liveXp,
    keep: true,
    pendingPreXp: pending.preXp,
    cutConfirmed: pending.cutConfirmed,
  });
  if (honoured == null) refuseStaleDeathCutCreditRemountXpKeep();
  return honoured;
}

/**
 * Heal/shop `beforeEach` leftover flush after remount used a fresh wallet
 * query with a stale character cache (250 / 100) and wrote 80 over 110.
 * Skip while the XP-keep stamp exists and live leftover still looks like
 * unpaid Play-entry `preXp`. Leave the marker so a later fresh snapshot
 * still honours 20/40 on top of the grant.
 */
export async function flushPendingDeathPenaltyThroughDeathCutCreditRemountXpKeep(
  args: FlushPendingDeathArgs,
): Promise<boolean> {
  const pending = readPendingDeathPenalty(args.storage, args.slot);
  if (!pending) return false;
  if (hasDeathCutCreditRemountXpKeep(args.storage, pending.slot, pending)) {
    const snap = await args.fetchSnapshot();
    if (
      !snap ||
      shouldRefuseDeathCutCreditRemountStaleXp({
        keep: true,
        liveXp: snap.xp,
        pendingPreXp: pending.preXp,
        cutConfirmed: pending.cutConfirmed,
      })
    ) {
      return false;
    }
  }
  const wrote = await flushPendingDeathPenalty(args);
  if (wrote) clearDeathCutCreditRemountXpKeep(args.storage, args.slot);
  return wrote;
}

/**
 * Portal / victory enqueue `applyRewards` then `commit`. A throw-after-add
 * never commits, so the remount stamp stays catch-cut XP. Note sidecar keep
 * before recap heal can honour Play-entry leftover. Call this instead of
 * bare `enqueue` when restacking WorldExploration.
 */
export async function persistIncrementalXpThroughDeathCutCreditRemountXpKeep<
  T,
>(args: {
  persist: Pick<DeathCutCreditRemountXpKeepPersist, "enqueue">;
  storage: DeathPenaltyStorage;
  slot: number;
  xpDelta: number;
  applyAndCommit: () => Promise<T>;
}): Promise<T> {
  return args.persist.enqueue(async () => {
    try {
      return await args.applyAndCommit();
    } catch (err) {
      noteDeathCutCreditRemountXpKeep(args.storage, args.slot, {
        xpDelta: args.xpDelta,
        error: err,
      });
      throw err;
    }
  });
}

/** Production portal job: `persistIncrementalRewards` then commit lives in WX. */
export async function persistPortalXpThroughDeathCutCreditRemountXpKeep(
  // Same loose actor type as persistIncrementalRewards — Caffeine bindings vary.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  actor: any,
  selectedSlot: number,
  persist: Pick<DeathCutCreditRemountXpKeepPersist, "enqueue">,
  storage: DeathPenaltyStorage,
  xpDelta: number,
): Promise<Awaited<ReturnType<typeof persistIncrementalRewards>>> {
  return persistIncrementalXpThroughDeathCutCreditRemountXpKeep({
    persist,
    storage,
    slot: selectedSlot,
    xpDelta,
    applyAndCommit: () =>
      persistIncrementalRewards(actor, selectedSlot, 0, xpDelta),
  });
}
