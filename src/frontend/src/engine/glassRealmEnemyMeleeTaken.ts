/**
 * Glass Realm advertised damage ×2 never commits on pack fallback melee
 * against the player.
 *
 * Registry (`mapModifiers.ts` `glass_realm`) announces
 *   "Glass Realm: all damage doubled, dealt and taken."
 * `MAP_MODIFIER_GLASS_REALM_DAMAGE_MULTIPLIER` is 2. `onDamageDealt`
 * returns `damage * 2`. The registry comment claims that hook runs on
 * every damage event.
 *
 * Live WorldExploration has one `applyDamageDealt` caller:
 * `enemyTakesDamage` (~3499). Pack fallback melee against the player
 * (`action.kind === "melee"` / `!didAct`, WX ~16704) writes
 * `setCharacterStats` `hp: max(0, prev.hp - meleeDmg)` with no hook
 * and no `playerTakesDamage`. Crush (`e-crush`, 12) at Chebyshev ≤ 1
 * never Paper-Windstorm misses (range 1).
 *
 * **#1160** `glassRealmDamageExecute` owns Strike / incoming kit
 * `playerTakesDamage` and explicitly left this melee skip ("same skip
 * class, not this execute"). Summon-target melee already routes
 * through `enemyTakesDamage` (that leftover doubles — restacking here
 * would ×4).
 *
 * Sequence: Glass Realm map → pack Crush 12 vs player 20 HP, 0 RES,
 * no shield / enrage → expected 0 (lethal, `_handlePlayerDeath` can
 * fire), actual 8.
 *
 * Unique vs **#1160** (Strike 10 vs 15 HP / incoming kit
 * `playerTakesDamage`), **#1107** (Crush/Fire Bolt advertised CHC),
 * **#659** (Shield RES on fallback melee), **#495** (End Turn leftover
 * walk tile), **#1042** (Paper Windstorm Fire Bolt miss — range 3),
 * **#1208** (Titan 1–5×), **#1148** (Vampiric Ground attacker HP),
 * **#1234** (Enthroned Void last-turn AP stamp). Do not add `heal` /
 * `res` / `chc` / `roll` / `apDrainLastTurn`.
 *
 * Do not restack WorldExploration / castHelpers / mapModifiers /
 * glassRealmDamageExecute / enemyAI. Restack the player-target melee
 * HP write onto `executeGlassRealmEnemyMeleeTaken` after older combat
 * PRs land, then write the returned `hpAfter`. Leave
 * `enemyTakesDamage`'s `_dmgAfterMods` write alone.
 */

import { MAP_MODIFIER_GLASS_REALM_DAMAGE_MULTIPLIER } from "../data/gameConstants.ts";

export const GLASS_REALM_MELEE_TAKEN_MODIFIER_ID = "glass_realm";

/** Pack fallback Crush — range 1, never Paper Windstorm miss. */
export const PACK_FALLBACK_CRUSH_ID = "e-crush";

export const PACK_FALLBACK_CRUSH_DAMAGE = 12;

export const PACK_FALLBACK_CRUSH_RANGE = 1;

/** Pack fallback Fire Bolt — range 3. Miss leftover of #1042, not this. */
export const PACK_FALLBACK_FIREBOLT_ID = "e-firebolt";

export const PACK_FALLBACK_FIREBOLT_DAMAGE = 8;

export const PACK_FALLBACK_FIREBOLT_RANGE = 3;

export const GLASS_REALM_MELEE_ANNOUNCE_NEEDLE =
  "Glass Realm: all damage doubled, dealt and taken.";

export type GlassRealmEnemyMeleeTakenExecute = {
  damage: number;
  hpAfter: number;
  playerDied: boolean;
};

export type GlassRealmEnemyMeleeTakenArgs = {
  modifierActive: boolean;
  /** Post-RES / post-shield melee packet (`dmgFB` / `meleeDmg`). */
  meleePacket: number;
  currentHp: number;
  /** Summon-target melee already doubles via `enemyTakesDamage`. */
  targetIsPlayer: boolean;
};

function finiteNonNeg(value: unknown): number {
  const n = Number(value);
  if (!Number.isFinite(n) || n <= 0) return 0;
  return n;
}

export function isGlassRealmMeleeTakenModifier(
  modifierId: string | null | undefined,
): boolean {
  return modifierId === GLASS_REALM_MELEE_TAKEN_MODIFIER_ID;
}

/** Advertised ×2 of the post-RES melee packet. */
export function glassRealmEnemyMeleeTakenAmount(meleePacket: number): number {
  const packet = finiteNonNeg(meleePacket);
  if (packet <= 0) return 0;
  return packet * MAP_MODIFIER_GLASS_REALM_DAMAGE_MULTIPLIER;
}

/**
 * Live pack fallback melee against the player never calls
 * `applyDamageDealt`. Proven by the source scan in the test file.
 */
export function liveWxPackFallbackMeleeAppliesGlassRealm(): boolean {
  return false;
}

/**
 * Live summon-target melee already writes `_dmgAfterMods`. Restacking
 * this sidecar there would ×4.
 */
export function liveWxSummonTargetMeleeAppliesGlassRealm(): boolean {
  return true;
}

export function canExecuteGlassRealmEnemyMeleeTaken(
  args: GlassRealmEnemyMeleeTakenArgs,
): boolean {
  if (args.modifierActive !== true) return false;
  if (args.targetIsPlayer !== true) return false;
  return glassRealmEnemyMeleeTakenAmount(args.meleePacket) > 0;
}

/** Alias so decide and the melee restack cannot fork. */
export function shouldDecideGlassRealmEnemyMeleeTaken(
  args: GlassRealmEnemyMeleeTakenArgs,
): boolean {
  return canExecuteGlassRealmEnemyMeleeTaken(args);
}

export function glassRealmEnemyMeleeHighlightedIsExecutable(args: {
  decided: boolean;
  executable: boolean;
}): boolean {
  return args.decided === true && args.executable === true;
}

/**
 * Commit advertised damage ×2 onto player HP from pack fallback melee.
 * Summon-target, inactive modifier, and missing packets return null so
 * a restack cannot mint 1 HP from Math.max(1, …) or ×4 the summon path.
 */
export function executeGlassRealmEnemyMeleeTaken(
  args: GlassRealmEnemyMeleeTakenArgs,
): GlassRealmEnemyMeleeTakenExecute | null {
  if (!canExecuteGlassRealmEnemyMeleeTaken(args)) return null;
  const damage = glassRealmEnemyMeleeTakenAmount(args.meleePacket);
  const hp = Math.max(0, Number(args.currentHp) || 0);
  const hpAfter = Math.max(0, hp - damage);
  return { damage, hpAfter, playerDied: hpAfter <= 0 };
}
