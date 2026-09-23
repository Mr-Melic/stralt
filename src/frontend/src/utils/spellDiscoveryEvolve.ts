/**
 * Spell discovery / ownership contracts for long-lived player records.
 *
 * Do not add required Character fields here. Motoko `upgradeSpell` still
 * appends any `usableByPlayer` catalog id and does not read `minLevel`.
 * Starter ids live only on the frontend until a later `20260902+` chain
 * file can store an ownership set.
 */

/**
 * Boot `OLD_SPELL_IDS` in `main.mo`. Includes live starter `physical_attack`.
 * A remap table must exist before this list is applied as a destructive
 * ownership rewrite. Never match display names (live `spell-inferno` is
 * named Inferno).
 */
export const BOOT_PURGED_SPELL_IDS = [
  "blood_nova",
  "crimson_heal",
  "cursed_gust",
  "drain_life",
  "entangle",
  "fireball",
  "frost_nova",
  "heal",
  "ice_shard",
  "inferno",
  "meteor_strike",
  "mist_form",
  "obliterate",
  "physical_attack",
  "plague_wave",
  "poison_dart",
] as const;

export const LIVE_STARTER_SPELL_ID_PURGED_AT_BOOT = "physical_attack";

function toNatLevel(n: unknown, fallback: number): number {
  const value = Math.floor(Number(n));
  return Number.isFinite(value) ? Math.max(fallback, value) : fallback;
}

/**
 * `upgradeSpell` does not check SpellConfig.minLevel. A level-1 player can
 * pay to own `void_collapse` (minLevel 30). Already-owned ids must still
 * upgrade if an admin later raises minLevel (player created before the gate).
 */
export function upgradeSpellMinLevelRejected(args: {
  playerLevel: number;
  minLevel: number;
  alreadyOwned: boolean;
}): string | null {
  if (args.alreadyOwned) return null;
  const playerLevel = toNatLevel(args.playerLevel, 1);
  const minLevel = toNatLevel(args.minLevel, 0);
  if (minLevel > 0 && playerLevel < minLevel) {
    return "Character level too low for this spell";
  }
  return null;
}

/**
 * First paid upgrade of a usable catalog id appends it to spellLevelKeys.
 * That is how admin-added spells appear in another account's book.
 */
export function upgradeSpellWouldGrantUnownedCatalogId(args: {
  alreadyOwned: boolean;
  usableByPlayer: boolean;
}): boolean {
  return args.usableByPlayer === true && args.alreadyOwned !== true;
}
