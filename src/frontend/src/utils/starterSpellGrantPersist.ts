/**
 * Frontend innate spell grant (SDEG-2026-10-29-001).
 *
 * `starterSpells` (`spellData.ts`) is treated as always-owned:
 * WX 2395–2416 unions every row into `ownedSpells` and calls them
 * "never removable." Motoko `defaultSpells()` (`admin.mo` 168–191) is a
 * different six ids (`BUILT_IN_SPELL_IDS`). Intersection on HEAD is empty.
 * `upgradeSpell` (`main.mo` 974–977) requires `spellConfigs.get(spellId)`,
 * so a paid level for `starter-shield` / `summon-dire-wolf` / `spell-swap`
 * cannot land. `physical_attack` is both a frontend innate and an
 * `OLD_SPELL_IDS` boot purge (`main.mo` 689–697).
 *
 * A player created yesterday, six months ago, or before a newly appended
 * starter id exists has nothing stored for that id. Shipping a 33rd
 * `starterSpells` row grants it to every cohort on the next frontend
 * deploy. Removing a row revokes it from every cohort because it never
 * entered `Character.spellLevelKeys`. Renaming `starter-heal` →
 * `starter-mend` cannot preserve ownership — there is no alias table.
 *
 * Distinct from SDEG-004 (Motoko catalog ∪ starters as the *rule*),
 * 09-26-001 (`isBuiltInSpellId` omit list), 10-22-003 (localStorage
 * level fallback), and 10-27-002 (empty-only Motoko catalog seed).
 *
 * Do not add required `ownedSpellIds` until a later chain file after
 * 20260901. Do not edit WorldExploration / main.mo / spellData this stack.
 */

import { starterSpells } from "../data/spellData.ts";
import { BUILT_IN_SPELL_IDS } from "./adminSafety.ts";

/** Motoko `defaultSpells()` / `isBuiltInSpellId` on HEAD. */
export const HEAD_MOTOKO_DEFAULT_SPELL_IDS: readonly string[] =
  BUILT_IN_SPELL_IDS;

/**
 * Locked `starterSpells` ids on HEAD. Appending a row is a silent grant
 * to every existing player; update this list only with a persist plan.
 */
export const HEAD_FRONTEND_INNATE_SPELL_IDS = [
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
] as const;

export function liveFrontendInnateSpellIds(): string[] {
  return starterSpells.map((row) => row.id);
}

export function frontendInnateOverlapsMotokoDefaultCatalog(
  innateIds: readonly string[] = liveFrontendInnateSpellIds(),
  catalogIds: readonly string[] = HEAD_MOTOKO_DEFAULT_SPELL_IDS,
): string[] {
  const catalog = new Set(catalogIds);
  return innateIds.filter((id) => catalog.has(id));
}

/** HEAD `upgradeSpell` looks up `spellConfigs`; innates are not seeded there. */
export function upgradeSpellCanPersistLevelForInnateId(
  spellId: string,
): boolean {
  if (!spellId) return false;
  return (HEAD_MOTOKO_DEFAULT_SPELL_IDS as readonly string[]).includes(spellId);
}

export function appendingStarterSpellGrantsEveryExistingPlayer(): boolean {
  return true;
}

export function removingStarterSpellRevokesEveryCohortWithoutKeys(): boolean {
  return true;
}

export function renamingStarterSpellPreservesOwnership(): boolean {
  return false;
}

/** Required Character.ownedSpellIds would unload pre-feature / empty-keys cohorts. */
export function shouldAddRequiredCharacterOwnedSpellIds(): boolean {
  return false;
}

export function aliasTableRequiredBeforePersistingInnateIds(): boolean {
  return true;
}
