/**
 * GameKey redeem vs unpaid death 20/40 (MIMA-2026-09-02-003).
 *
 * `redeemGameKeyThroughPersist` commits `#ok` onto the persist lock with
 * `committedDokaAfterGameKeyRedeem` (lock + grant). Absolute spends honour
 * `applyUnpaidDeathPenaltyToWrite`; GameKey does not. Applying that helper
 * to *lock + grant* recuts when the lock is already at `afterDoka`
 * (`dokaDrop` from `pre` shrinks by the grant, so the unpaid loss is
 * subtracted again).
 *
 * Cut the lock snapshot first, then add the grant. `cutConfirmed` means
 * saveBattleStats already accepted the 20/40 — do not tax the GameKey.
 * Unseeded placeholder 0 must not look like an honoured cut.
 *
 * Do not wire this into `shopPurchase.ts` while older persist PRs own that
 * file. Import from the redeem commit once those land.
 */

import {
  type PendingDeathPenalty,
  applyUnpaidDeathPenaltyToWrite,
} from "./deathPenalty.ts";
import { committedDokaAfterGameKeyRedeem } from "./shopPurchase.ts";

function floorDoka(n: number): number {
  return Math.max(0, Math.floor(Number(n) || 0));
}

/**
 * Persist lock already absorbed the unpaid Doka loss (or the cut was
 * confirmed on-canister). Adding a GameKey on top must not subtract again.
 */
export function unpaidDeathDokaAlreadyHonouredOnLock(
  pending: PendingDeathPenalty,
  lockDoka: number,
): boolean {
  if (pending.cutConfirmed === true) return true;
  const lock = floorDoka(lockDoka);
  const dokaLost = Math.max(0, pending.preDoka - pending.afterDoka);
  const dokaDrop = pending.preDoka - lock;
  return dokaDrop >= dokaLost;
}

/**
 * Doka the persist lock should hold after a GameKey `#ok` when an unpaid
 * death marker may still be sitting in localStorage.
 *
 * Uncut lock 200, loss 80, grant 1000 → 1120 (after 120 + grant).
 * Lock already at afterDoka 120, grant 1000 → 1120, not 1040.
 */
export function committedDokaAfterGameKeyUnpaidDeath(args: {
  pending: PendingDeathPenalty | null | undefined;
  lockDoka: number;
  gained: number;
  walletSeeded: boolean;
}): number {
  const credited = committedDokaAfterGameKeyRedeem(args.lockDoka, args.gained);
  const pending = args.pending;
  if (!pending || args.walletSeeded !== true) return credited;
  const gained = floorDoka(args.gained);
  if (gained <= 0) return credited;
  if (unpaidDeathDokaAlreadyHonouredOnLock(pending, args.lockDoka)) {
    return credited;
  }
  const honouredLock = applyUnpaidDeathPenaltyToWrite(
    pending,
    pending.afterXp,
    args.lockDoka,
  ).doka;
  return committedDokaAfterGameKeyRedeem(honouredLock, gained);
}
