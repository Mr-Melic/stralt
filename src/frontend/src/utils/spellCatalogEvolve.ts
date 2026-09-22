/**
 * Persist-evolution contracts for player spell ids and bar saves.
 *
 * Motoko `OLD_SPELL_IDS` still deletes these catalog rows on every start.
 * WorldExploration also hides by display name (`OLD_SPELL_NAMES_SET`) — that
 * name match is the Inferno landmine (live starter `spell-inferno`). Future
 * catalog filters must use ids only. Do not edit WorldExploration while
 * #327 / #331 are queued; this module is the restack-safe contract.
 *
 * `setSpellBarOrder` currently keeps ids that are already in
 * `spellLevelKeys`. Create writes empty keys, so the official first-bar save
 * of starters is filtered to []. Empty keys on an old row mean starters are
 * owned, not "owns nothing".
 */

/**
 * Ids of `starterSpells` in `data/spellData.ts` (including Strike /
 * `physical_attack`). Locked by spellCatalogEvolve.test.ts against that array.
 */
export const OFFICIAL_STARTER_SPELL_IDS: readonly string[] = [
  "physical_attack",
  "starter-shield",
  "starter-poison",
  "starter-blast",
  "starter-heal",
  "starter-drain",
  "starter-frost",
  "spell-swap",
  "spell-mark",
  "spell-barrier",
  "spell-mirror",
  "spell-timestep",
  "spell-sacrifice",
  "spell-lifesteal-nova",
  "spell-enrage",
  "spell-iron-skin",
  "spell-haste",
  "spell-weaken",
  "spell-slow",
  "spell-expose",
  "spell-venom-strike",
  "spell-rallying-cry",
  "spell-drain-courage",
  "spell-cursed-wound",
  "spell-shadow-veil",
  "spell-inferno",
  "spell-frost-nova",
  "summon-dire-wolf",
  "summon-sentinel",
  "summon-archer",
  "summon-bomber",
  "summon-wisp",
];

/** Same ids as `OLD_SPELL_IDS` in `src/backend/main.mo` (boot purge). */
export const PURGED_CATALOG_SPELL_IDS: readonly string[] = [
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
];

const PURGED_CATALOG_SPELL_ID_SET = new Set(PURGED_CATALOG_SPELL_IDS);

/**
 * Live frontend starter that is still in the Motoko purge list. Removing the
 * catalog row does not delete `spellLevelKeys` entries; `upgradeSpell` then
 * returns "Spell not found".
 */
export const LIVE_STARTER_IDS_IN_BOOT_PURGE: readonly string[] = [
  "physical_attack",
];

export function officialStarterSpellIds(): string[] {
  return [...OFFICIAL_STARTER_SPELL_IDS];
}

export function isPurgedCatalogSpellId(id: string): boolean {
  return PURGED_CATALOG_SPELL_ID_SET.has(id);
}

/**
 * Hide a backend catalog row only when its **id** is purged.
 * Display names must not participate — live `spell-inferno` is named Inferno.
 */
export function shouldHidePurgedCatalogRow(spell: {
  id: string;
  name?: string;
}): boolean {
  void spell.name;
  return isPurgedCatalogSpellId(spell.id);
}

/**
 * Bar persist filter for old rows. Empty `spellLevelKeys` (create default)
 * keeps official starters. Once any paid id exists, only keys (plus those
 * starters still listed in keys) survive — matching today's Motoko contains()
 * once keys are populated.
 */
export function filterSpellBarForPersist(
  requestedIds: readonly string[],
  spellLevelKeys: readonly string[],
  starterIds: readonly string[] = officialStarterSpellIds(),
): string[] {
  const keys = spellLevelKeys.filter(
    (id) => typeof id === "string" && id.length > 0,
  );
  const owned = new Set(keys);
  const starters = new Set(
    starterIds.filter((id) => typeof id === "string" && id.length > 0),
  );
  const allowStarters = keys.length === 0;
  const out: string[] = [];
  const seen = new Set<string>();
  for (const raw of requestedIds) {
    if (typeof raw !== "string" || raw.length === 0) continue;
    if (seen.has(raw)) continue;
    const keep = owned.has(raw) || (allowStarters && starters.has(raw));
    if (!keep) continue;
    seen.add(raw);
    out.push(raw);
    if (out.length >= 8) break;
  }
  return out;
}

/** Motoko `setSpellBarOrder` today: keep only ids already in keys. */
export function filterSpellBarKeysOnly(
  requestedIds: readonly string[],
  spellLevelKeys: readonly string[],
): string[] {
  const owned = new Set(
    spellLevelKeys.filter((id) => typeof id === "string" && id.length > 0),
  );
  const out: string[] = [];
  const seen = new Set<string>();
  for (const raw of requestedIds) {
    if (typeof raw !== "string" || raw.length === 0) continue;
    if (seen.has(raw) || !owned.has(raw)) continue;
    seen.add(raw);
    out.push(raw);
    if (out.length >= 8) break;
  }
  return out;
}

/**
 * Battle-init HP in `getPlayerBaseStats` (compounding). Persist
 * `maxPersistedHp` is linear `100 + (level-1) * growthPercent`.
 */
export function compoundingPlayerMaxHp(
  level: number,
  growthPercent: number,
): number {
  const lvl = Math.max(1, Math.floor(Number(level) || 1));
  const growth = Number(growthPercent);
  if (!Number.isFinite(growth) || growth <= 0) return 100;
  return Math.round(100 * (1 + growth / 100) ** (lvl - 1));
}

/** Linear persist cap. Same arithmetic as `adminSafety.maxPersistedHp`. */
export function linearPersistMaxHp(
  level: number,
  growthPercent: number,
): number {
  const lvl = Math.max(1, Math.floor(Number(level) || 1));
  const growth = Math.max(1, Math.floor(Number(growthPercent) || 0));
  return 100 + (lvl - 1) * growth;
}

export function compoundingHpExceedsPersistCap(
  level: number,
  growthPercent: number,
): boolean {
  return (
    compoundingPlayerMaxHp(level, growthPercent) >
    linearPersistMaxHp(level, growthPercent)
  );
}

/**
 * Canonical curve minimum step is `100 * 2^0 = 100`. Skipping Motoko `pow2`
 * when leftover XP is below that is curve-preserving.
 */
export function leftoverXpCannotAffordNextLevel(leftoverXp: number): boolean {
  return Math.max(0, Math.floor(Number(leftoverXp) || 0)) < 100;
}
