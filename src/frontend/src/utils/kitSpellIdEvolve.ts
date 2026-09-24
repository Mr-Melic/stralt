/**
 * Content-id contract between the every-upgrade spellConfigs purge
 * (main.mo OLD_SPELL_IDS) and Motoko defaultBossConfigs seed pools
 * (admin.mo). Empty-only seeds persist those kit ids. After purge,
 * spellConfigs.get(id) is null for the overlapping ids, so a canister
 * kit row from a fresh import cannot resolve those spells.
 *
 * Frontend bossKits.ts already uses live catalog ids (spell-inferno, …)
 * plus starter physical_attack — which is still in the boot purge list.
 * Do not remap kit ids here. Do not add persist fields.
 */

/** Mirrors main.mo boot OLD_SPELL_IDS. Includes live starter physical_attack. */
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

/**
 * Unique spellPoolIds from AdminLib.defaultBossConfigs (12 bosses).
 * Frozen snapshot of the seed; empty-only so a live admin edit is not
 * rewritten on upgrade.
 */
export const MOTOKO_SEEDED_BOSS_KIT_SPELL_IDS = [
  "blood_nova",
  "cursed_gust",
  "drain_life",
  "entangle",
  "fireball",
  "frost_nova",
  "ice_shard",
  "inferno",
  "meteor_strike",
  "mist_form",
  "obliterate",
  "physical_attack",
  "plague_wave",
  "poison_dart",
  "reflect_barrier",
  "shadow_strike",
  "soul_rend",
  "thunder_clap",
  "void_collapse",
] as const;

const PURGED = new Set<string>(BOOT_PURGED_SPELL_IDS);

export function motokoBossKitIdsPurgedFromSpellConfigs(): string[] {
  return MOTOKO_SEEDED_BOSS_KIT_SPELL_IDS.filter((id) => PURGED.has(id)).sort();
}

export function motokoBossKitIdsStillInSpellConfigs(): string[] {
  return MOTOKO_SEEDED_BOSS_KIT_SPELL_IDS.filter(
    (id) => !PURGED.has(id),
  ).sort();
}

/** Live starter that enemy/boss kits and the player book still use. */
export const LIVE_STARTER_ID_PURGED_FROM_CANISTER_CATALOG = "physical_attack";
