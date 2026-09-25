/**
 * Preview vs effect-resolution for Sacrifice.
 *
 * Implementation lives after `isCasterTile` in `targeting.ts` so the live
 * gate can call it without a second import next to #562 `playerCastVictimLive`
 * / #601 occupant-required (those extra imports conflicted oldest-first).
 * This module re-exports the same helpers for unique parity tests.
 *
 * Empty / corpse / ally tiles used to highlight, then `resolvePlayerCast`
 * still returned `"cast"` (AP + 20% HP, no 3× damage). Strike / Mark empty
 * rings are unchanged.
 */

export type {
  PlayerSacrificeLiveOccupant,
  PlayerSacrificeLiveSpell,
} from "./targeting.ts";
export {
  playerSacrificeLiveHostileAt,
  playerSacrificeLiveRejectReason,
  playerSacrificeRequiresOccupant,
} from "./targeting.ts";
