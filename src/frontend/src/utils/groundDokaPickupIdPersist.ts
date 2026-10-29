/**
 * Ground Doka / shrine / dungeon-complete one-shot ids (SDEG-2026-10-29-003).
 *
 * Live ground coins are `doka-${Date.now()}-${x}-${y}` (`WorldExploration.tsx`
 * 6779 — cite only). `claimedGroundLootIdsRef` is an in-memory Set cleared
 * on map apply (6790 / 6799). Reload mint a new timestamp, so a six-month
 * player has no durable "which coins" history — `loot_10_doka` is a counter
 * (10-24-003 / 10-25-001), not an id set.
 *
 * Shrine and dungeon-complete credits on HEAD are constants
 * (`SHRINE_ALTAR_CREDIT_ID` / `DUNGEON_CHAIN_COMPLETE_CREDIT_ID` in
 * `dokaPersist.ts`), not visit/run scoped. `oneShotCredit.ts` already
 * has `shrineCreditId(visitId)` / `dungeonCompleteCreditId(runId)` and
 * is unused by WX.
 *
 * Distinct from 10-26-001 (explore_25 portal counter vs unique map ids)
 * and from 10-25-001 (feat counter before settle). Do not persist a
 * required Character pickup-id set until a later chain file after
 * 20260901 with empty-set default. Do not persist a map seed without
 * stable pickup ids. Do not edit WX / dokaPersist this stack.
 */

import {
  DUNGEON_CHAIN_COMPLETE_CREDIT_ID,
  SHRINE_ALTAR_CREDIT_ID,
} from "./dokaPersist.ts";
import { dungeonCompleteCreditId, shrineCreditId } from "./oneShotCredit.ts";

export const HEAD_GROUND_DOKA_ID_PREFIX = "doka-";

export function headGroundDokaPickupId(
  nowMs: number,
  tileX: number,
  tileY: number,
): string {
  return `${HEAD_GROUND_DOKA_ID_PREFIX}${nowMs}-${tileX}-${tileY}`;
}

export function recommendedGroundDokaPickupId(
  mapSeed: string,
  tileX: number,
  tileY: number,
): string {
  if (!mapSeed) return "";
  return `doka:${mapSeed}:${tileX}:${tileY}`;
}

export function headGroundDokaPickupIdSurvivesReload(args: {
  spawnedAtMs: number;
  reloadedAtMs: number;
  tileX: number;
  tileY: number;
}): boolean {
  return (
    headGroundDokaPickupId(args.spawnedAtMs, args.tileX, args.tileY) ===
    headGroundDokaPickupId(args.reloadedAtMs, args.tileX, args.tileY)
  );
}

export function headShrineAltarCreditId(): string {
  return SHRINE_ALTAR_CREDIT_ID;
}

export function headDungeonCompleteCreditId(): string {
  return DUNGEON_CHAIN_COMPLETE_CREDIT_ID;
}

/** HEAD uses the constant `shrine-altar`, not `shrine:${visitId}`. */
export function headShrineAltarCreditIsVisitScoped(): boolean {
  return false;
}

/** HEAD uses the constant `dungeon-chain-complete`, not `dungeon:${runId}`. */
export function headDungeonCompleteCreditIsRunScoped(): boolean {
  return false;
}

export function recommendedShrineCreditId(visitId: string): string {
  return shrineCreditId(visitId);
}

export function recommendedDungeonCompleteCreditId(runId: string): string {
  return dungeonCompleteCreditId(runId);
}

export function claimedPickupSetSurvivesReload(): boolean {
  return false;
}

export function shouldAddRequiredCharacterPickupIdSet(): boolean {
  return false;
}

export function stablePickupIdRequiredBeforePersistingMapLoot(): boolean {
  return true;
}
