/**
 * Death-replay saveBattleStats can accept the 20/40 cut, then the replay
 * effect tears down (`cancelled = true`) before confirmAndClear. The marker
 * still looks unpaid. Portal +10 / ground Doka then recut XP via
 * applyUnpaidDeathPenaltyToWrite.
 *
 * Confirm inside the persist job. Effect cancellation may skip UI hydrate
 * only. File name sorts after `deathReplayHp` so #445 still auto-merges.
 */

import {
  type DeathPenaltyStorage,
  type PendingDeathPenalty,
  confirmAndClearPendingDeathPenaltyAnywhere,
  defaultDeathPenaltyStorage,
} from "./deathPenalty.ts";

/**
 * Leftover WorldExploration replay: confirm ran after `if (cancelled) return`.
 * Actor reconnect / remount sets cancelled before that line.
 */
export function leftoverConfirmDeathReplayAfterEnqueue(
  cancelled: boolean,
): boolean {
  return cancelled !== true;
}

/** Confirm is independent of effect teardown. Hydrate UI only when mounted. */
export function shouldHydrateDeathReplayUi(cancelled: boolean): boolean {
  return cancelled !== true;
}

/** Death-replay write already landed. Confirm even if the effect unmounted. */
export function confirmDeathReplayInsidePersistJob(
  slot: number,
  pending: PendingDeathPenalty,
  primary: DeathPenaltyStorage = defaultDeathPenaltyStorage(),
  fallback?: DeathPenaltyStorage,
): void {
  confirmAndClearPendingDeathPenaltyAnywhere(slot, pending, primary, fallback);
}

export function afterDeathReplayPersistSuccess(args: {
  cancelled: boolean;
  confirm: () => void;
  hydrateUi: () => void;
}): void {
  args.confirm();
  if (shouldHydrateDeathReplayUi(args.cancelled)) {
    args.hydrateUi();
  }
}
