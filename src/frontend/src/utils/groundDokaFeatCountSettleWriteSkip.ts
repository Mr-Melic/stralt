/**
 * Ground Doka feat counter (`pbv_ground_doka_pickups`) increments in
 * `WorldExploration.tsx` 11397–11407 as soon as `tryClaimPickupId`
 * succeeds — **before** `persistDokaCreditResult` settles. `applyRewards`
 * `#err` then `releasePickupId` so the next RAF step can collect the same
 * coin again. `loot_10_doka` (`Loot Hunter`, 75 Doka) reads that counter
 * on victory (`victoryAchievements.ts`) and on the next map-visit effect
 * (`WorldExploration.tsx` 2277–2278).
 *
 * #800 / #1029 / #1145 stamp remount **wallet** Doka after a one-shot
 * throw (`pbv_oneshot_doka_keep_remount_slotN`) and honour replica Doka
 * on leftover heal / feat / portal. Those helpers never write the feat
 * counter. #577 keeps feat caches across a version wipe. #490 re-keys
 * them by II principal. #1156 keeps the shrine **room** open until altar
 * settle (different one-shot). #1276 is shop inventory.
 *
 * Chronology:
 * 1. World hydrated. Feat count 9. Coin `doka-1-2` on the map. Canister
 *    Doka 200. Lock seeded 200.
 * 2. Step the coin. `tryClaimPickupId` true. Ungated count 9→10 and
 *    localStorage 10 **before** persist. `applyRewards` `#err` (banned /
 *    cap). Settle `release`. `releasePickupId`. Coin still uncollected.
 *    `loot_10_doka` can already fire (maps-visit effect / next victory).
 *    No unpaid death. #800 does **not** stamp (explicit `#err`, not a
 *    throw-after-add).
 * 3. Same-session retry (or remount that keeps the map): claim again.
 *    Persist `#ok`. Count 10→11. Canister +coin once. Unique leftover:
 *    feat counter is 11 after one paid pickup, or 10 after a failed
 *    persist that never credited — `Loot Hunter` unlocks and the 75
 *    Doka claim is mintable.
 * 4. Actor reconnect remount loads localStorage 10 even when the in-flight
 *    settle later released. Ghost count toward the feat.
 *
 * This sidecar counts only after settle `kind === "commit"`. `release`
 * must not count (safe retry). `keep` (transport miss after invoke) is
 * unconfirmed — do not count (delayed `loot_10_doka` is safer than
 * minting the 75 Doka grant). Writes the **existing** feat key
 * `${userId}_slotN_pbv_ground_doka_pickups`, not a new remount stamp
 * (#800's one-shot Doka key stays wallet-only).
 *
 * `WorldExploration.tsx`, `dokaPersist.ts`, `progressPersist.ts`,
 * `victoryAchievements.ts`, and #800 / #577 / #490 / #1156 / #1276 files
 * are occupied / unmerged, so this PR does not restack them. Tests
 * reproduce ungated claim-count vs the gated settle. Restack the ground
 * loot enqueue onto `persistGroundDokaFeatThroughSettle` after those PRs
 * land. No Motoko.
 */

import type { DeathPenaltyStorage } from "./deathPenalty.ts";

/** `Loot Hunter` threshold. Must match `victoryAchievements.ts`. */
export const LOOT_10_DOKA_FEAT_THRESHOLD = 10;

/** Claim reward on `loot_10_doka` (`admin.mo` catalog). */
export const LOOT_10_DOKA_FEAT_DOKA_REWARD = 75;

function toNat(n: number | null | undefined): number {
  return Math.max(0, Math.floor(Number(n) || 0));
}

/**
 * Production WX key. Guest / missing userId falls back to the legacy
 * un-namespaced counter (`WorldExploration.tsx` 11401–11403).
 */
export function groundDokaFeatCountKey(
  userId: string | undefined,
  slot: number,
): string {
  if (userId) {
    return `${userId}_slot${Math.max(1, toNat(slot))}_pbv_ground_doka_pickups`;
  }
  return "pbv_ground_doka_pickups";
}

export type GroundDokaFeatSettleKind = "commit" | "release" | "keep";

/**
 * Confirmed one-shot credit only. `release` is an explicit `#err` (canister
 * did not add) — the next RAF step retries the same coin. `keep` is a
 * transport miss after invoke; #800 honours replica **Doka**, not this
 * feat counter. Counting `keep` would mint `loot_10_doka` from an
 * unconfirmed pickup.
 */
export function shouldCountGroundDokaFeatAfterSettle(
  kind: GroundDokaFeatSettleKind,
): boolean {
  return kind === "commit";
}

/** Live WX increments on `tryClaimPickupId` (before persist). Must not. */
export function shouldCountGroundDokaFeatOnClaim(): boolean {
  return false;
}

export function readGroundDokaFeatCount(
  storage: DeathPenaltyStorage,
  userId: string | undefined,
  slot: number,
): number {
  try {
    const raw = storage.getItem(groundDokaFeatCountKey(userId, slot));
    if (!raw) return 0;
    return toNat(Number.parseInt(raw, 10));
  } catch {
    return 0;
  }
}

export function writeGroundDokaFeatCount(
  storage: DeathPenaltyStorage,
  userId: string | undefined,
  slot: number,
  count: number,
): void {
  try {
    storage.setItem(groundDokaFeatCountKey(userId, slot), String(toNat(count)));
  } catch {
    // private mode
  }
}

export function incrementGroundDokaFeatCount(
  storage: DeathPenaltyStorage,
  userId: string | undefined,
  slot: number,
): number {
  const next = readGroundDokaFeatCount(storage, userId, slot) + 1;
  writeGroundDokaFeatCount(storage, userId, slot, next);
  return next;
}

export function nextGroundDokaFeatCountAfterSettle(args: {
  kind: GroundDokaFeatSettleKind;
  current: number;
}): number {
  const current = toNat(args.current);
  if (!shouldCountGroundDokaFeatAfterSettle(args.kind)) return current;
  return current + 1;
}

export function shouldUnlockLoot10DokaFeat(count: number): boolean {
  return toNat(count) >= LOOT_10_DOKA_FEAT_THRESHOLD;
}

/**
 * Remount hydrate. Ungated claim-count already wrote localStorage; a later
 * `release` cannot roll that back after WorldExploration unmounted. Gated
 * settle never wrote, so remount stays at the pre-claim count.
 */
export function honourGroundDokaFeatCountHydrate(args: {
  remountCount: number;
  settleKind: GroundDokaFeatSettleKind | null;
}): number {
  const remount = toNat(args.remountCount);
  if (args.settleKind == null) return remount;
  return nextGroundDokaFeatCountAfterSettle({
    kind: args.settleKind,
    current: remount,
  });
}

export type GroundDokaFeatPersist = {
  enqueue: <T>(fn: () => Promise<T>) => Promise<T>;
};

/**
 * Ground loot enqueue `applyRewards` then settle. Count the feat only
 * when settle is `commit`. Call this instead of incrementing on
 * `tryClaimPickupId` when restacking WorldExploration.
 */
export async function persistGroundDokaFeatThroughSettle<
  T extends { kind: GroundDokaFeatSettleKind },
>(args: {
  persist: GroundDokaFeatPersist;
  storage: DeathPenaltyStorage;
  userId: string | undefined;
  slot: number;
  applyAndSettle: () => Promise<T>;
}): Promise<T> {
  return args.persist.enqueue(async () => {
    const settle = await args.applyAndSettle();
    if (shouldCountGroundDokaFeatAfterSettle(settle.kind)) {
      incrementGroundDokaFeatCount(args.storage, args.userId, args.slot);
    }
    return settle;
  });
}
