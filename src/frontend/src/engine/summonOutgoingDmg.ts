/**
 * Outgoing `dmg` for player-side summons.
 *
 * `enemyTakesDamage` already multiplies by `getStatModifier(casterId, "dmg")`.
 * Kit casts and auto-summon melee used to pass `"player"`, so starter Enrage
 * (`spell-enrage`, `targetType: "ally"`, +40% DMG) wrote the buff on the wolf
 * and never changed the hit. Self-cast Enrage still uses the player path
 * (`getStatModifier("player", "dmg")` in computeDamage).
 */

import { type StatModifiableEffect, getStatModifier } from "./statusEffects.ts";

/** Catalog `buffModifier` on starter `spell-enrage`. */
export const ENRAGE_DMG_MODIFIER = 1.4;

/**
 * Caster id for `enemyTakesDamage` when a player-side summon hits.
 * Must be the summon's combatant id — `"player"` ignores an ally Enrage.
 */
export function summonOutgoingCasterId(summonId: string): string {
  return summonId;
}

/**
 * Scale a raw hit by the caster's outgoing `dmg` buff/debuff.
 * Same multiply as `enemyTakesDamage` (`incoming * modifier`).
 */
export function scaleSummonOutgoingDamage(
  incomingDamage: number,
  casterId: string,
  effects: readonly StatModifiableEffect[],
): number {
  return incomingDamage * getStatModifier(casterId, "dmg", effects);
}
