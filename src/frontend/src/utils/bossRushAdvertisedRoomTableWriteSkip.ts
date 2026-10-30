/**
 * Boss Rush room-clear persist ignores `BOSS_RUSH_ROOMS[i].dokaReward` /
 * `xpReward`. Production (`WorldExploration.tsx`):
 *   - `handleBossRushRoomClear` assigns `_currentRoom =
 *     BOSS_RUSH_ROOMS[currentRoomIndex]` (12693) then never reads it.
 *   - Doka uses the kill formula `max(5, floor(level * 1.5)) * defeated`
 *     (12749–12753) with `roomMultiplier = 1` ("per-room multipliers
 *     removed", 12755–12757).
 *   - XP uses `computeVictoryExp` only (12743–12746).
 *   - `buildBossRushPersistInput({ baseDoka: totalDoka })` (12820–12825)
 *     never sets `RewardInput.bossRushRoomReward`, even though
 *     `computeRewardDeltas` already **adds** that field (rewardResolver
 *     164–166).
 *
 * `hooks/useBossRush.ts` advertises Room 0 = 500 Doka / 200 XP and Room 9
 * (jackpot) = 5000 Doka / 2000 XP. ARCHITECTURE.md: "Room 9 is the
 * jackpot (5000 Doka / 2000 XP)." `applyRewards` persists the unboosted
 * kill formula instead (level-1 pair = 10 Doka / 40 XP).
 *
 * Contrast:
 *   - **#1341** is overworld `cleanupBattle` nulling catalog
 *     `rewardDokaMultiplier` / `rewardXpMultiplier` before
 *     `handleBattleEnd` reads them. Room-clear snapshots the boss config
 *     before cleanup (12901) — not this leftover. Catalog multipliers
 *     on room-clear remain a different leftover (room-clear still does
 *     not read `rewardDokaMultiplier`).
 *   - **#904** is wallet/level feat recap after persist, not table
 *     amounts.
 *
 * Chronology:
 * 1. World hydrated. Lock seeded. Player enters Boss Rush room 0
 *    (Pale Archbishop + Weeping Pawn). Table advertises 500 Doka / 200 XP.
 * 2. Both hostiles die. Victory gate calls `handleBossRushRoomClear`
 *    (not `handleBattleEnd`). Challenge refs snapshotted. `_currentRoom`
 *    assigned from the table.
 * 3. Persist uses kill formula only (`dokaPerEnemy` × 2, multiplier 1).
 *    `applyRewards` commits 10 Doka / 40 XP for a level-1 pair. Recap
 *    shows the same under-count. Table 500 / 200 never reaches the
 *    canister. Room 9 jackpot is the same class (10 / 40 vs 5000 / 2000).
 *
 * `WorldExploration.tsx`, `rewardResolver.ts`, `hooks/useBossRush.ts`,
 * `hooks/bossRushProgress.ts`, `progressPersist.ts`, and occupied
 * persist/feat sidecars stay merge-clean. Restack room-clear onto
 * `persistBossRushThroughAdvertisedRoomTable` for `baseDoka` / `baseXp`
 * (fold the table into those bases — do **not** also set
 * `bossRushRoomReward` or the additive path would double-count). No Motoko.
 */

import { clampApplyRewardsDeltas } from "./applyRewardsResult.ts";

/** Room 0 table — Pale Archbishop + Weeping Pawn. */
export const BOSS_RUSH_ROOM0_ADVERTISED_DOKA = 500;

export const BOSS_RUSH_ROOM0_ADVERTISED_XP = 200;

/** Room 9 table — jackpot (ARCHITECTURE.md). */
export const BOSS_RUSH_ROOM9_ADVERTISED_DOKA = 5000;

export const BOSS_RUSH_ROOM9_ADVERTISED_XP = 2000;

export const BOSS_RUSH_JACKPOT_ROOM_INDEX = 9;

/**
 * Live leftover: room-clear assigns `_currentRoom` from the table then
 * never reads `dokaReward` / `xpReward`.
 */
export function liveWxRoomClearAssignsCurrentRoomFromTable(): boolean {
  return true;
}

export function liveWxRoomClearReadsTableDokaReward(): boolean {
  return false;
}

export function liveWxRoomClearSetsBossRushRoomReward(): boolean {
  return false;
}

export function liveWxRoomClearHardcodesRoomMultiplierOne(): boolean {
  return true;
}

function finiteNonNeg(raw: unknown): number {
  const n = Math.floor(Number(raw) || 0);
  if (!Number.isFinite(n) || n < 0) return 0;
  return n;
}

function finitePositiveInt(raw: unknown, fallback: number): number {
  const n = Math.floor(Number(raw));
  if (!Number.isFinite(n) || n < 1) return fallback;
  return n;
}

/**
 * Live WX kill Doka: `Math.max(5, Math.floor(level * 1.5)) * defeatedCount`
 * with `roomMultiplier = 1`.
 */
export function leftoverBossRushKillFormulaDoka(args: {
  characterLevel: unknown;
  defeatedCount: unknown;
}): number {
  const level = finitePositiveInt(args.characterLevel, 1);
  const count = finiteNonNeg(args.defeatedCount);
  const dokaPerEnemy = Math.max(5, Math.floor(level * 1.5));
  return count * dokaPerEnemy;
}

export type BossRushAdvertisedRoomTable = {
  doka: number;
  xp: number;
};

/** Capture advertised table amounts. Null when both grants are 0 / missing. */
export function advertisedBossRushRoomTable(
  room:
    | {
        dokaReward?: unknown;
        xpReward?: unknown;
      }
    | null
    | undefined,
): BossRushAdvertisedRoomTable | null {
  if (room == null) return null;
  const doka = finiteNonNeg(room.dokaReward);
  const xp = finiteNonNeg(room.xpReward);
  if (doka <= 0 && xp <= 0) return null;
  return { doka, xp };
}

export function advertisedBossRushRoomTableAtIndex(
  rooms: ReadonlyArray<{ dokaReward?: unknown; xpReward?: unknown }>,
  roomIndex: unknown,
): BossRushAdvertisedRoomTable | null {
  const i = Math.floor(Number(roomIndex));
  if (!Number.isFinite(i) || i < 0 || i >= rooms.length) return null;
  return advertisedBossRushRoomTable(rooms[i]);
}

export type BossRushRoomClearPersistGrant = {
  dokaDelta: number;
  xpDelta: number;
};

/**
 * Fold advertised table grants onto the kill formula, then clamp to
 * canister maxima. Matches `computeRewardDeltas` additive
 * `bossRushRoomReward` semantics without restacking that helper.
 *
 * Missing / empty table fail-closes to the kill formula (do not drop
 * minion-kill Doka/XP the room-clear comment still requires).
 */
export function persistBossRushThroughAdvertisedRoomTable(args: {
  advertised: BossRushAdvertisedRoomTable | null;
  killDoka: unknown;
  killXp: unknown;
}): BossRushRoomClearPersistGrant {
  const killDoka = finiteNonNeg(args.killDoka);
  const killXp = finiteNonNeg(args.killXp);
  const advertisedDoka = args.advertised
    ? finiteNonNeg(args.advertised.doka)
    : 0;
  const advertisedXp = args.advertised ? finiteNonNeg(args.advertised.xp) : 0;
  return clampApplyRewardsDeltas(
    killDoka + advertisedDoka,
    killXp + advertisedXp,
  );
}

/**
 * Live WX path: table is never read, so persist is kill formula only.
 */
export function leftoverBossRushRoomClearAfterUnusedTable(args: {
  killDoka: unknown;
  killXp: unknown;
}): BossRushRoomClearPersistGrant {
  return persistBossRushThroughAdvertisedRoomTable({
    advertised: null,
    killDoka: args.killDoka,
    killXp: args.killXp,
  });
}

export function leftoverUnpaidBossRushTableDoka(args: {
  advertisedDoka: unknown;
}): number {
  return finiteNonNeg(args.advertisedDoka);
}

export function leftoverUnpaidBossRushTableXp(args: {
  advertisedXp: unknown;
}): number {
  return finiteNonNeg(args.advertisedXp);
}
