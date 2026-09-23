/**
 * Unseeded GameKey / feat `#ok` leaves the persist lock at placeholder 0
 * (`shouldCommitGameKeyRedeem` / `shouldCommitAchievementCredit` are false
 * so grant-only cannot seed). The next heal/shop/death still calls
 * `resolveCommittedDokaForAbsoluteWrite`, which re-fetches and *seeds*
 * whatever the replica returns.
 *
 * A stale in-flight `getCallerDokaBalance` is the pre-credit wallet.
 * Seeding that snapshot lets `saveBattleStats` write it
 * (incoming-below-stored is applied; the method never mints).
 *
 * Chronology:
 * 1. World mounts before the wallet query. Lock doka=0, unseeded. HUD 0.
 *    Canister wallet is 200.
 * 2. Redeem / claim `#ok(1000)`. Canister 200→1200. Lock stays 0.
 *    `noteUnseededCredit` only blocks idle hydrate, not this fetch.
 * 3. Recap heal spends 10. Absolute write fetches 200 (replica lag).
 * 4. Leftover: seedWallet(200), spend 10, saveBattleStats writes 190.
 *    Paid 1000 is gone.
 *
 * #377 notes unconfirmed credit on throw-after-add, but that flag is
 * only set when the lock is already seeded. #435 keeps GameFlow's first
 * hydrate off the HUD. Neither stops this seed-from-stale-fetch wipe.
 *
 * WorldExploration wraps `seedWallet` at persist construction and notes the
 * floor after unseeded `#ok`. It does not rename the
 * `resolveCommittedDokaForAbsoluteWrite` import or the death/heal call
 * sites — #356 inserts `resolveCommittedXpForAbsoluteWrite` next to both.
 *
 * File name sorts after `shopPurchase` / `spellUpgrade` so older persist
 * PRs still auto-merge those modules. Do not edit `progressPersist.ts`.
 */

import {
  type AbsoluteWritePersist,
  resolveCommittedDokaForAbsoluteWrite,
} from "./progressPersist.ts";

export const ABSOLUTE_WRITE_STALE_UNSEEDED_CREDIT =
  "absolute write skipped: stale unseeded credit";

const unseededCreditFloor = new WeakMap<object, number>();

function toNat(n: number): number {
  return Math.max(0, Math.floor(Number(n) || 0));
}

function readWalletNumber(raw: unknown): number | null {
  if (raw === null || raw === undefined) return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

export function getUnseededCreditFloor(persist: object): number {
  return unseededCreditFloor.get(persist) ?? 0;
}

/**
 * After an unseeded `#ok`, remember the granted delta so a later absolute
 * write cannot seed below it. Seeded locks already committed lock+grant.
 * Sum repeated unseeded credits (feat then GameKey) so a stale mid-pair
 * snapshot cannot sneak under the first floor.
 */
export function noteUnseededCreditFloorIfNeeded(
  persist: { isWalletSeeded: () => boolean },
  gained: number,
): void {
  if (persist.isWalletSeeded()) return;
  const add = toNat(gained);
  if (add <= 0) return;
  unseededCreditFloor.set(persist, getUnseededCreditFloor(persist) + add);
}

export function clearUnseededCreditFloor(persist: object): void {
  unseededCreditFloor.delete(persist);
}

/**
 * Skip seeding when the live read is still below the granted delta.
 * Missing reads must not use placeholder 0. Once the lock is seeded the
 * existing resolveCommittedDoka path owns confirm / unconfirmed-credit.
 */
export function shouldRefuseStaleUnseededCreditSeed(args: {
  walletSeeded: boolean;
  creditFloor: number;
  liveDoka: number | null;
}): boolean {
  if (args.walletSeeded === true) return false;
  const floor = toNat(args.creditFloor);
  if (floor <= 0) return false;
  if (args.liveDoka == null) return true;
  return toNat(args.liveDoka) < floor;
}

/**
 * Intercept seedWallet so WorldExploration can keep calling
 * resolveCommittedDokaForAbsoluteWrite (older persist PRs insert
 * resolveCommittedXpForAbsoluteWrite next to that import and both
 * death/heal call sites). resolveCommittedDoka swallows unknown
 * seed errors as null; the caller then skips the unseeded write.
 */
export function wrapPersistSeedWallet<
  T extends {
    seedWallet: (doka: number) => void;
    isWalletSeeded: () => boolean;
  },
>(persist: T): T {
  const inner = persist.seedWallet.bind(persist);
  persist.seedWallet = (doka: number) => {
    const floor = getUnseededCreditFloor(persist);
    if (
      shouldRefuseStaleUnseededCreditSeed({
        walletSeeded: persist.isWalletSeeded(),
        creditFloor: floor,
        liveDoka: doka,
      })
    ) {
      throw new Error(ABSOLUTE_WRITE_STALE_UNSEEDED_CREDIT);
    }
    inner(doka);
    if (floor > 0 && toNat(doka) >= floor) {
      clearUnseededCreditFloor(persist);
    }
  };
  return persist;
}

/**
 * Drop-in in front of resolveCommittedDokaForAbsoluteWrite. Intercepts
 * the unseeded fetch so a stale pre-credit snapshot cannot seed.
 */
export async function resolveCommittedDokaForAbsoluteWriteGuardingUnseededCredit(
  persist: AbsoluteWritePersist,
  readWallet: () => Promise<unknown>,
): Promise<number | null> {
  const floor = getUnseededCreditFloor(persist);
  if (floor > 0 && persist.isWalletSeeded() !== true) {
    const refuse = (): never => {
      throw new Error(ABSOLUTE_WRITE_STALE_UNSEEDED_CREDIT);
    };
    try {
      const live = readWalletNumber(await readWallet());
      if (
        shouldRefuseStaleUnseededCreditSeed({
          walletSeeded: false,
          creditFloor: floor,
          liveDoka: live,
        })
      ) {
        return refuse();
      }
      if (live == null) return refuse();
      persist.seedWallet(live);
      clearUnseededCreditFloor(persist);
      return live;
    } catch (err) {
      if (
        err instanceof Error &&
        err.message === ABSOLUTE_WRITE_STALE_UNSEEDED_CREDIT
      ) {
        throw err;
      }
      return refuse();
    }
  }
  const resolved = await resolveCommittedDokaForAbsoluteWrite(
    persist,
    readWallet,
  );
  if (resolved != null && floor > 0 && resolved >= floor) {
    clearUnseededCreditFloor(persist);
  }
  return resolved;
}
