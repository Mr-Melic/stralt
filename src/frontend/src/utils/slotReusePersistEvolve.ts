/**
 * Slot reuse after deleteCharacter / createCharacter in the same slot.
 *
 * Boss Rush is already keyed by principal#slot and is removed on create/delete
 * (`_clearBossRushForSlot`, main.mo 3257–3260 / 367–370 / 490–491). Dungeon
 * progress is Principal-keyed (`dungeonRecords`, 2894–2924) and canister buff
 * stacks are principal#slot (`_buffKey`, 2791–2803). Neither is cleared.
 * Official `useDeleteCharacter` now drops the unpaid-death browser marker
 * after a successful canister delete. Maps-visited / covenant keys still
 * need a userId to clear. Dungeon and canister buffs are Motoko leftovers.
 *
 * Unpaid death 20/40 lives in `pbv_pending_death_penalty_slotN` (slot only on
 * this HEAD; #385 adds an II principal). Replay compares canister XP/Doka and
 * then `applyUnpaidDeathPenaltyToWrite`. A fresh L1 occupant (xp=0) with an
 * unchanged principal wallet still matching `preDoka` takes the deleted
 * occupant's 40% Doka cut. Distinct from #385 (cross-user key), #508 (version
 * wipe keep), and SDEG-007 (idempotent dungeon increment).
 *
 * Do not add required persist fields. Motoko dungeon/buff clear is HUMAN after
 * older persist PRs release `main.mo`.
 */

import {
  type DeathPenaltyStorage,
  type PendingDeathPenalty,
  clearPendingDeathPenaltyAnywhere,
  resolvePendingDeathReplay,
} from "./deathPenalty.ts";

export function deleteCharacterClearsBossRushForSlot(): boolean {
  return true;
}

export function deleteCharacterClearsDungeonRecords(): boolean {
  return false;
}

export function deleteCharacterClearsBuffInventories(): boolean {
  return false;
}

export function deleteCharacterClearsAchievementProgress(): boolean {
  return false;
}

export function deleteCharacterClearsPrincipalDoka(): boolean {
  return false;
}

export function unpaidDeathPendingKeyIncludesCharacterIdentity(): boolean {
  return false;
}

/** Official useDeleteCharacter now drops the slot marker after a successful canister delete. */
export function officialDeleteClearsPendingDeathBrowserMarker(): boolean {
  return true;
}

export function mapsVisitedLocalStorageKey(
  userId: string,
  slot: number,
): string {
  return `${userId}_slot${Math.max(1, Math.floor(Number(slot) || 1))}_pbv_maps_visited_count`;
}

export function groundDokaPickupLocalStorageKey(
  userId: string,
  slot: number,
): string {
  return `${userId}_slot${Math.max(1, Math.floor(Number(slot) || 1))}_pbv_ground_doka_pickups`;
}

export function covenantBuffLocalStorageKey(
  userId: string,
  slot: number,
): string {
  return `pbv_covenant_buff_${userId}_slot${Math.max(1, Math.floor(Number(slot) || 1))}`;
}

/** True when a leftover unpaid-death marker would write against a new occupant. */
export function unpaidDeathWouldCutFreshOccupantWallet(args: {
  freshXp: number;
  freshDoka: number;
  pending: PendingDeathPenalty;
}): boolean {
  return (
    resolvePendingDeathReplay(args.freshXp, args.freshDoka, args.pending)
      .action === "write"
  );
}

/**
 * Drop slot-scoped browser leftovers that are not character identity.
 * Death pending is slot-only on this HEAD. Map/feat counters need userId.
 */
export function clearSlotReuseBrowserCaches(
  slot: number,
  opts?: {
    userId?: string;
    primary?: DeathPenaltyStorage;
    fallback?: DeathPenaltyStorage;
    extraStorage?: Pick<Storage, "removeItem">;
  },
): void {
  const n = Math.max(1, Math.floor(Number(slot) || 1));
  if (opts?.primary) {
    clearPendingDeathPenaltyAnywhere(n, opts.primary, opts.fallback);
  } else if (typeof window !== "undefined") {
    try {
      clearPendingDeathPenaltyAnywhere(n, localStorage, sessionStorage);
    } catch {
      // private mode
    }
  }
  const extra = opts?.extraStorage;
  const userId = opts?.userId;
  if (!extra || !userId) return;
  try {
    extra.removeItem(mapsVisitedLocalStorageKey(userId, n));
    extra.removeItem(groundDokaPickupLocalStorageKey(userId, n));
    extra.removeItem(covenantBuffLocalStorageKey(userId, n));
  } catch {
    // ignore
  }
}
