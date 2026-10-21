/**
 * SpellConfig.minLevel is catalog metadata. Official hydrate, library
 * inclusion, and upgradeSpell ignore it (AdminDashboard: "minLevel is not
 * enforced at hydrate"). void_collapse is seeded at minLevel 30 and still
 * appears for a level-1 book because shouldIncludeBackendSpellInLibrary
 * only consults usableByPlayer + owned ids.
 *
 * A future discovery gate that hides catalog rows where player.level <
 * minLevel, without a stored ownership set (SDEG-004), would strip spells
 * from yesterday / six-month / pre-minLevel cohorts who never paid
 * upgradeSpell (empty spellLevelKeys).
 *
 * Distinct from SDEG-004 (owned vs catalog-all) and SDEG-003 (id purge).
 * No schema. Do not add required ownedSpellIds until a later chain file
 * after 20260901.
 */

import { shouldIncludeBackendSpellInLibrary } from "./adminSafety.ts";

export function libraryIncludesIgnoringMinLevel(args: {
  usableByPlayer?: boolean;
  spellId: string;
  ownedSpellIds: ReadonlySet<string>;
  minLevel: number;
  playerLevel: number;
}): boolean {
  void args.minLevel;
  void args.playerLevel;
  return shouldIncludeBackendSpellInLibrary({
    usableByPlayer: args.usableByPlayer,
    spellId: args.spellId,
    ownedSpellIds: args.ownedSpellIds,
  });
}

export function upgradeSpellChecksMinLevel(): boolean {
  return false;
}

export function officialHydrateEnforcesSpellMinLevel(): boolean {
  return false;
}

/**
 * True when a later minLevel gate without ownership would hide a currently
 * visible catalog spell from a player who never upgraded it.
 */
export function minLevelGateWithoutOwnershipWouldHideCatalogSpell(args: {
  playerLevel: number;
  minLevel: number;
  usableByPlayer: boolean;
  alreadyOwned: boolean;
}): boolean {
  return (
    args.usableByPlayer &&
    !args.alreadyOwned &&
    args.playerLevel < args.minLevel &&
    officialHydrateEnforcesSpellMinLevel() === false
  );
}
