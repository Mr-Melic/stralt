/**
 * Pure Boss Rush progress helpers.
 *
 * Backend getBossRushState returns
 * (currentRoom, highestRoomCompleted, totalBossRushRuns) — not Doka/XP totals.
 * Room-clear rewards persist through applyRewards immediately, so currentRoom
 * must advance on clear (not on the later progression-portal step) or a reload
 * re-enters room 0 and farms the same wallet credit.
 */

export const BOSS_RUSH_ROOM_COUNT = 10;

export interface ParsedBossRushState {
  currentRoom: number;
  highestRoomCompleted: number;
  totalBossRushRuns: number;
}

export function parseBossRushStateTuple(
  result: unknown,
): ParsedBossRushState | null {
  if (!Array.isArray(result) || result.length < 3) return null;
  const currentRoom = Number(result[0]);
  const highestRoomCompleted = Number(result[1]);
  const totalBossRushRuns = Number(result[2]);
  if (!Number.isFinite(currentRoom)) return null;
  return {
    currentRoom,
    highestRoomCompleted: Number.isFinite(highestRoomCompleted)
      ? highestRoomCompleted
      : 0,
    totalBossRushRuns: Number.isFinite(totalBossRushRuns)
      ? totalBossRushRuns
      : 0,
  };
}

/** Room to spawn when entering / resuming a run. 0 if no mid-run progress. */
export function resumeRoomFromPersisted(
  currentRoom: number,
  roomCount = BOSS_RUSH_ROOM_COUNT,
): number {
  if (!Number.isFinite(currentRoom) || currentRoom <= 0) return 0;
  return Math.min(Math.floor(currentRoom), roomCount - 1);
}

/**
 * Hydrate currentRoom from the canister only when no run is in progress.
 * After a room clear, persist writes nextCurrentRoom while local currentRoom
 * still names the room just cleared (the portal uses local+1). Adopting the
 * persisted value mid-run would make that portal skip a room.
 */
export function adoptPersistedResumeRoom(
  runActive: boolean,
  persistedCurrentRoom: number,
  roomCount = BOSS_RUSH_ROOM_COUNT,
): number | null {
  if (runActive) return null;
  const room = resumeRoomFromPersisted(persistedCurrentRoom, roomCount);
  return room > 0 ? room : null;
}

/** Drop slot-scoped progress so a new occupant cannot resume a prior run. */
export async function clearBossRushForSlot(
  actor: BossRushProgressActor,
  slot: number | bigint,
): Promise<void> {
  const slotId = typeof slot === "bigint" ? slot : BigInt(slot);
  await actor.resetBossRush?.(slotId);
}

export function progressAfterRoomClear(
  clearedRoomIndex: number,
  roomCount = BOSS_RUSH_ROOM_COUNT,
): { nextCurrentRoom: number; runComplete: boolean } {
  const runComplete = clearedRoomIndex >= roomCount - 1;
  return {
    nextCurrentRoom: runComplete ? 0 : clearedRoomIndex + 1,
    runComplete,
  };
}

export interface BossRushProgressActor {
  setBossRushProgress?: (slot: bigint, currentRoom: bigint) => Promise<unknown>;
  resetBossRush?: (slot: bigint) => Promise<unknown>;
  completeBossRushRoom?: (
    slot: bigint,
    roomIndex: bigint,
    dokaReward: bigint,
    xpReward: bigint,
  ) => Promise<unknown>;
}

export interface PersistBossRushRoomClearOptions {
  /**
   * When true after the progress write, the run was aborted (death/flee)
   * while this persist was in flight. Re-reset currentRoom so the late
   * write cannot resume the next occupant mid-tree.
   */
  wasSuperseded?: () => boolean;
}

/**
 * Writes currentRoom before the room-clear applyRewards so a reload cannot
 * re-enter the room that just paid out. Final-room clear resets currentRoom
 * so the jackpot room is not resumable.
 */
export async function persistBossRushRoomClear(
  actor: BossRushProgressActor,
  slot: number,
  clearedRoomIndex: number,
  options?: PersistBossRushRoomClearOptions,
): Promise<void> {
  const { nextCurrentRoom, runComplete } =
    progressAfterRoomClear(clearedRoomIndex);
  const slotId = BigInt(slot);
  if (runComplete) {
    await actor.resetBossRush?.(slotId);
  } else {
    await actor.setBossRushProgress?.(slotId, BigInt(nextCurrentRoom));
  }
  await actor.completeBossRushRoom?.(
    slotId,
    BigInt(clearedRoomIndex),
    BigInt(0),
    BigInt(0),
  );
  if (options?.wasSuperseded?.()) {
    await actor.resetBossRush?.(slotId);
  }
}
