/**
 * Preview vs effect-resolution for occupant-required player casts.
 *
 * Implementation lives at the end of `targeting.ts` so the live gate can
 * call it without a second import next to #562 `playerCastVictimLive`
 * (that extra import conflicted oldest-first merge-tree). This module
 * re-exports the same helpers for unique parity tests.
 */

export type {
  PlayerOccupantRequiredOccupant,
  PlayerOccupantRequiredSpell,
} from "./targeting.ts";
export {
  playerOccupantLiveHostileAt,
  playerOccupantRequiredLiveRejectReason,
  playerOccupantRequiredOnClick,
  playerOccupantRequiredTargetType,
} from "./targeting.ts";
