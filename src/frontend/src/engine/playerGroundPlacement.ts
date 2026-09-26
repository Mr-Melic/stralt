/**
 * Preview vs execute for ground placement (Summon / Barrier / Trap).
 *
 * Implementation lives after `groundTileInRange` in `targeting.ts` so the
 * live gate can call it without a second import next to #562
 * `playerCastVictimLive` / #601 occupant-required / #607 Sacrifice
 * (those extra imports conflicted oldest-first). This module re-exports
 * the same helpers for unique parity tests.
 *
 * Portal tiles used to highlight, then `spawnSummonUnit` slid off them
 * via `isCellFree`. Attack Nearest / keyboard S searched hostiles only,
 * so a highlighted empty floor could not execute. Strike / Mark empty
 * rings and portal-as-floor for enemy kits are unchanged.
 */

export type { PlayerGroundPlacementSpell } from "./targeting.ts";
export {
  attackNearestResolvesOnEmptyGround,
  pickNearestLiveOkTile,
  playerGroundPlacementLiveRejectReason,
  playerGroundPlacementRequiresWalkableTile,
} from "./targeting.ts";
