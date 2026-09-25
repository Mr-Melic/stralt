/**
 * Client mirror of AdminGuard.mapModifierIdentityRejected.
 * Backend enforcement is authoritative; this proves the failure path.
 *
 * Failure: official Add uses id=mod_<timestamp> and type=slime_flood.
 * rollActiveModifiers keys the engine hook by config.id ∩ MODIFIER_BY_ID;
 * visibleMapModifiers filters the HUD by modifierType. A mismatch
 * replaces an aligned live row with a silent hook or a dead catalog
 * row. Map modifiers have no last-good rollback.
 */

const LIVE_MAP_MODIFIER_IDS = new Set([
  "slime_flood",
  "frozen_terrain",
  "thorned_ground",
  "void_rift",
  "arcane_surge",
  "time_warp",
  "plague_zone",
  "paper_windstorm",
  "blood_moon",
  "mirror_field",
  "gravity_well",
  "fog_of_war",
  "titans_vigor",
  "arcane_overflow",
  "glass_realm",
  "mending_mist",
  "swift_winds",
  "iron_curse",
  "vampiric_ground",
  "null_field",
  "chaos_initiative",
  "doka_fever",
]);

export function knownMapModifierId(id: string): boolean {
  return LIVE_MAP_MODIFIER_IDS.has(id);
}

export function mapModifierIdentityRejected(args: {
  id: string;
  modifierType: string;
}): string | null {
  if (args.id !== args.modifierType) {
    return "modifierType must match id so the live roll and HUD stay aligned";
  }
  if (!knownMapModifierId(args.id)) {
    return "modifierType is not a recognized live modifier";
  }
  return null;
}
