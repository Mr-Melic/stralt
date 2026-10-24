/**
 * Boss Rush slot-clear contract.
 *
 * Canister createCharacter / deleteCharacter call `_clearBossRushForSlot`
 * which removes the principal#slot map entry (highest + runs + current).
 * Frontend `clearBossRushForSlot` only calls `resetBossRush`, which zeros
 * currentRoom and keeps highestRoomCompleted / totalBossRushRuns.
 */

export type BossRushProgressTuple = {
  currentRoom: number;
  highestRoomCompleted: number;
  totalBossRushRuns: number;
};

/** Expected hydrate after create/delete on a canister that removes the entry. */
export function bossRushStateAfterFullSlotClear(): BossRushProgressTuple {
  return {
    currentRoom: 0,
    highestRoomCompleted: 0,
    totalBossRushRuns: 0,
  };
}

/** What resetBossRush alone leaves when prior progress existed. */
export function bossRushStateAfterResetOnly(
  prior: BossRushProgressTuple,
): BossRushProgressTuple {
  return {
    currentRoom: 0,
    highestRoomCompleted: prior.highestRoomCompleted,
    totalBossRushRuns: prior.totalBossRushRuns,
  };
}

export function resetBossRushClearsHighestAndRuns(): boolean {
  return false;
}

/**
 * Raw clients can walk setBossRushProgress by +1 without combat, then
 * complete(9) while occupying room 9 for master-complete.
 */
export function rawClientCanWalkBossRushToMasterWithoutCombat(): boolean {
  return true;
}

export function nextRoomAfterSetBossRushProgress(
  currentRoom: number,
  requested: number,
): { ok: true; currentRoom: number } | { ok: false; reason: string } {
  if (requested > 9) return { ok: false, reason: "currentRoom must be 0-9" };
  if (requested > currentRoom + 1) {
    return { ok: false, reason: "currentRoom can only advance by 1" };
  }
  if (requested < currentRoom) {
    return {
      ok: false,
      reason: "currentRoom cannot decrease; use resetBossRush",
    };
  }
  return { ok: true, currentRoom: requested };
}
