/**
 * Glass Realm vs advertised damage ×2 on Strike and incoming hits.
 *
 * Registry (`mapModifiers.ts` `glass_realm`) announces
 *   "Glass Realm: all damage doubled, dealt and taken."
 * `MAP_MODIFIER_GLASS_REALM_DAMAGE_MULTIPLIER` is 2. `onDamageDealt`
 * returns `damage * 2`. The registry comment claims that hook runs on
 * every damage event.
 *
 * Live WorldExploration never does for the primary packets:
 * - `applyDamageDealt` has one caller: `enemyTakesDamage`. That leftover
 *   already writes `_dmgAfterMods` onto enemy HP (Sacrifice / DoT-on-enemy
 *   / Chain Lightning bounce / kit-vs-summon). Do not restack it or the
 *   packet becomes ×4.
 * - Primary Strike / Shadow Strike / Attack Nearest (mouse and touch)
 *   go through `applyDamageToEnemy` and write `enemyPrevHp - finalDmg`
 *   with no hook. A 10-damage Strike vs 15 HP leaves 5 live; advertised
 *   20 is lethal.
 * - Incoming kit hits go through `playerTakesDamage` (RES, then
 *   `hpAfterIncomingDamage`) with no hook. Enemy melee skips
 *   `playerTakesDamage` entirely (raw `setCharacterStats`) — same skip
 *   class, not this execute.
 *
 * Sequence: Glass Realm map → Strike (`physical_attack` 10) vs enemy
 * 15 HP, 0 RES, no crit/mark → expected 0 (lethal), actual 5.
 *
 * Unique vs **#1148** (Vampiric Ground attacker stub on this same hook;
 * that sidecar does not rewrite the damage packet), **#1104** (boss kit
 * CHC), **#1155** (Iron Curse heal ×0.5), player Iron Curse RES ×1.3
 * (`applyBattleStart` only mutates `combatantsRef`), Titan 1–5× (sibling
 * skip of Strike / incoming — do not add a roll), **#674** (docs-only
 * announce/live drift), **#1079** / **#1084** (Mirror Field / Void Mirror
 * soak). Do not add `heal` / `res` / `chc` / `healUsed`.
 *
 * Do not restack WorldExploration / castHelpers / mapModifiers.
 * Restack `applyDamageToEnemy` and `playerTakesDamage` onto
 * `executeGlassRealmDamage` after older combat PRs land, then write the
 * returned `hpAfter`. Leave `enemyTakesDamage`'s `_dmgAfterMods` write
 * alone.
 */

import { MAP_MODIFIER_GLASS_REALM_DAMAGE_MULTIPLIER } from "../data/gameConstants.ts";

export const GLASS_REALM_MODIFIER_ID = "glass_realm";

export type GlassRealmDamageExecute = {
  damage: number;
  hpAfter: number;
};

export function isGlassRealmModifier(
  modifierId: string | null | undefined,
): boolean {
  return modifierId === GLASS_REALM_MODIFIER_ID;
}

export function glassRealmDamageAmount(baseDamage: number): number {
  const packet = Number(baseDamage);
  if (!Number.isFinite(packet) || packet <= 0) return 0;
  return packet * MAP_MODIFIER_GLASS_REALM_DAMAGE_MULTIPLIER;
}

/** Live primary Strike / applyDamageToEnemy never calls applyDamageDealt. */
export function wxPrimaryStrikeAppliesGlassRealm(): boolean {
  return false;
}

/** Live playerTakesDamage never calls applyDamageDealt. */
export function wxIncomingHitAppliesGlassRealm(): boolean {
  return false;
}

/** Live enemy melee writes HP without playerTakesDamage or the hook. */
export function wxEnemyMeleeAppliesGlassRealm(): boolean {
  return false;
}

/**
 * Live enemyTakesDamage already writes `_dmgAfterMods` (Sacrifice / DoT
 * / bounce). Restacking this sidecar there would ×4.
 */
export function wxEnemyTakesDamageAppliesGlassRealm(): boolean {
  return true;
}

/** Live WX never writes advertised ×2 onto Strike HP. */
export function liveWxGlassRealmDoublesStrike(): boolean {
  return false;
}

/** Live WX never writes advertised ×2 onto playerTakesDamage HP. */
export function liveWxGlassRealmDoublesIncoming(): boolean {
  return false;
}

export function canExecuteGlassRealmDamage(args: {
  modifierActive: boolean;
  damage: number;
}): boolean {
  if (args.modifierActive !== true) return false;
  return glassRealmDamageAmount(args.damage) > 0;
}

/** Alias so decide and the Strike / incoming restack cannot fork. */
export function shouldDecideGlassRealmDamage(
  args: Parameters<typeof canExecuteGlassRealmDamage>[0],
): boolean {
  return canExecuteGlassRealmDamage(args);
}

export function glassRealmHighlightedDamageIsExecutable(args: {
  decided: boolean;
  executable: boolean;
}): boolean {
  return args.decided === true && args.executable === true;
}

/**
 * Commit advertised damage ×2 onto the target HP. Incoming ≤ 0 is a
 * no-op so a missing packet cannot mint 1 HP from Math.max(1, …).
 * Titan 1–5× / Vampiric heal / RES / CHC are not in this payload.
 */
export function executeGlassRealmDamage(args: {
  modifierActive: boolean;
  damage: number;
  currentHp: number;
}): GlassRealmDamageExecute | null {
  if (!canExecuteGlassRealmDamage(args)) return null;
  const damage = glassRealmDamageAmount(args.damage);
  const hp = Math.max(0, Number(args.currentHp) || 0);
  return { damage, hpAfter: Math.max(0, hp - damage) };
}
