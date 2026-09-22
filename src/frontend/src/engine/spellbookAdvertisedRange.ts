/**
 * Spellbook catalog row range chip.
 *
 * The 9×9 pattern grid already paints {@link spellHighlightRangeBase}
 * (`maxRange` when set). The list row used `Number(spell.range)` alone, so a
 * grown spell advertised a shorter reach than the highlighted / live-ok set.
 * Catalog, preview, Attack Nearest, and execute must start from the same base.
 */

import type { SpellConfig } from "../types/gameTypes.ts";
import { spellHighlightRangeBase } from "./targeting.ts";

export function spellbookCatalogRange(
  spell: Pick<SpellConfig, "maxRange" | "range">,
): number {
  return spellHighlightRangeBase(spell);
}
