/**
 * Vampiric Ground vs advertised attacker lifesteal.
 *
 * The registry hook (`mapModifiers.ts` `vampiric_ground`) does:
 *   heal = floor(damage * 0.15)
 *   attacker.hp += heal
 *   return damage
 *
 * Live WorldExploration `enemyTakesDamage` is the only `applyDamageDealt`
 * caller. When the caster is the player it passes a throwaway
 *   `{ hp: characterStats.hp, maxHp: characterStats.hp, id: "player" }`
 * so the heal dies with the stub. `characterStats.hp` is never written.
 * Primary Strike / Shadow Strike / Chain Lightning go through
 * `applyDamageToEnemy` and never call the hook. Incoming hits go through
 * `playerTakesDamage` and never call the hook.
 *
 * Sacrifice / DoT-on-enemy / Chain Lightning bounce DO reach the hook,
 * then still discard the stub. Announce text is "attackers heal for 15%
 * of damage dealt." A 20-damage Sacrifice heals 0.
 *
 * Unique vs **#443** (player turn-start Void Rift / Mist / Swift Winds),
 * **#446** (Titan store HP), **#644** (catalog `spellType: drain`
 * lifesteal), **#921** (Life Drain SP), **#975** (Starved Vampire
 * VAMPIRIC_AOE boss heal), **#1142** (Plague soak). Glass Realm / Titan
 * 1–5× still apply through the *returned* damage on this same hook —
 * they are not this attacker-HP commit.
 *
 * Do not add drain `healAmount` / `healUsed` / RES (would steal #644 /
 * #380 / pack soak leftovers). Do not restack WorldExploration /
 * castHelpers / mapModifiers. Restack `enemyTakesDamage` onto
 * `executeVampiricGroundLifesteal` after older combat PRs land, then
 * write the returned `hpAfter` through `setCharacterStats`.
 */

import { MAP_MODIFIER_VAMPIRIC_GROUND_LIFESTEAL_PERCENT } from "../data/gameConstants.ts";

export const VAMPIRIC_GROUND_MODIFIER_ID = "vampiric_ground";

export type VampiricGroundLifestealExecute = {
  heal: number;
  hpAfter: number;
};

export function isVampiricGroundModifier(
  modifierId: string | null | undefined,
): boolean {
  return modifierId === VAMPIRIC_GROUND_MODIFIER_ID;
}

export function vampiricGroundHealAmount(damage: number): number {
  const packet = Number(damage);
  if (!Number.isFinite(packet) || packet <= 0) return 0;
  return Math.floor(packet * MAP_MODIFIER_VAMPIRIC_GROUND_LIFESTEAL_PERCENT);
}

/** Live WX `enemyTakesDamage` player-attacker object is a throwaway stub. */
export function wxVampiricPlayerAttackerIsThrowaway(): boolean {
  return true;
}

/** Live primary Strike / applyDamageToEnemy never calls applyDamageDealt. */
export function wxPrimaryStrikeAppliesDamageDealt(): boolean {
  return false;
}

/** Live playerTakesDamage never calls applyDamageDealt. */
export function wxIncomingHitAppliesDamageDealt(): boolean {
  return false;
}

/** Live WX never writes the hook's attacker.hp onto characterStats. */
export function liveWxVampiricHealCommits(): boolean {
  return false;
}

export function canExecuteVampiricGroundLifesteal(args: {
  modifierActive: boolean;
  damage: number;
}): boolean {
  if (args.modifierActive !== true) return false;
  return vampiricGroundHealAmount(args.damage) > 0;
}

/** Alias so decide and the enemyTakesDamage restack cannot fork. */
export function shouldDecideVampiricGroundLifesteal(
  args: Parameters<typeof canExecuteVampiricGroundLifesteal>[0],
): boolean {
  return canExecuteVampiricGroundLifesteal(args);
}

export function vampiricGroundHighlightedLifestealIsExecutable(args: {
  decided: boolean;
  executable: boolean;
}): boolean {
  return args.decided === true && args.executable === true;
}

/**
 * Commit advertised 15% lifesteal onto the attacker's HP. Incoming ≤ 0
 * is a no-op so a missing packet cannot mint 1 HP from Math.max(1, …).
 * Drain healAmount is not in this payload (#644 / #921).
 */
export function executeVampiricGroundLifesteal(args: {
  modifierActive: boolean;
  damage: number;
  attackerHp: number;
  maxHp: number;
}): VampiricGroundLifestealExecute | null {
  if (!canExecuteVampiricGroundLifesteal(args)) return null;
  const heal = vampiricGroundHealAmount(args.damage);
  const hp = Math.max(0, Number(args.attackerHp) || 0);
  const cap = Math.max(hp, Number(args.maxHp) || 0);
  return { heal, hpAfter: Math.min(cap, hp + heal) };
}
