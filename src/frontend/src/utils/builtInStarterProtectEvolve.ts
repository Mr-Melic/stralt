/**
 * Motoko `isBuiltInSpellId` / frontend `BUILT_IN_SPELL_IDS` vs live innates.
 *
 * `adminDeleteSpellConfig` hard-deletes a catalog row unless the id is
 * built-in (then it must retire) or `_spellReferencedByPlayers` (then it
 * soft-retires). The built-in list is only the six Motoko seed ids
 * (`adminGuard.mo` 21–24). Live frontend innates
 * (`physical_attack`, `starter-*` in `spellData.ts`) are omitted.
 *
 * Combined with the every-upgrade `OLD_SPELL_IDS` purge (`main.mo` 686–697),
 * `physical_attack` cannot remain in `spellConfigs` even if an admin seeds
 * it. Distinct from SDEG-003 (ownership remap) and SDEG-2026-09-24-004
 * (boss-kit seed overlap).
 *
 * Do not add required persist fields. Motoko list expansion is HUMAN after
 * older persist PRs release `main.mo`.
 */

import { starterSpells } from "../data/spellData.ts";
import { BUILT_IN_SPELL_IDS } from "./adminSafety.ts";

export function liveInnateSpellIds(
  catalog: readonly { id: string }[] = starterSpells,
): string[] {
  const ids: string[] = [];
  for (const spell of catalog) {
    if (spell.id === "physical_attack" || spell.id.startsWith("starter-")) {
      ids.push(spell.id);
    }
  }
  return ids;
}

export function builtInSpellIdsProtectLiveInnates(
  builtIn: readonly string[] = BUILT_IN_SPELL_IDS,
  innates: readonly string[] = liveInnateSpellIds(),
): boolean {
  return innates.every((id) => (builtIn as readonly string[]).includes(id));
}

/** Boot purge still deletes this live starter every upgrade. */
export function physicalAttackIsBootPurged(): boolean {
  return true;
}

export function physicalAttackIsBuiltIn(
  builtIn: readonly string[] = BUILT_IN_SPELL_IDS,
): boolean {
  return (builtIn as readonly string[]).includes("physical_attack");
}
