/**
 * Spell Master feat persist (SDEG-2026-10-27-001).
 *
 * `spell_master_8` copy is "Have 8 spells equipped at once." HEAD counts
 * `activeSpells.length` after two hydrate paths that invent occupancy:
 *
 * 1. Empty `activeSpellIds` → `Array(8).fill(null)` (length 8, no ids).
 * 2. Saved bar of N < 8 → append live `ownedSpells` (catalog ∪ starters)
 *    into empty slots, then slice(0, 8).
 *
 * A player created yesterday, six months ago, or before the bar field
 * existed can unlock + claim 100 Doka without arranging 8 spells.
 * Distinct from SDEG-004 (library membership) and 10-23-004 (empty keys
 * dropping Text bar ids on setSpellBarOrder).
 *
 * Wire WX / victoryAchievements when those files are editable. Do not
 * add required ownedSpellIds until a later chain file after 20260901.
 */

export const SPELL_MASTER_8_CONDITION = "spell_master_8";
export const SPELL_MASTER_8_THRESHOLD = 8;

export type SpellBarEntry = { id?: string | null } | string | null | undefined;

function entryId(entry: SpellBarEntry): string {
  if (entry == null) return "";
  if (typeof entry === "string") return entry.trim();
  if (typeof entry.id === "string") return entry.id.trim();
  return "";
}

/** Count only equipped slots — null / empty placeholders are not spells. */
export function equippedSpellBarCount(bar: readonly SpellBarEntry[]): number {
  let n = 0;
  for (const entry of bar) {
    if (entryId(entry).length > 0) n += 1;
  }
  return n;
}

/**
 * HEAD empty-ids fallback is eight nulls. Length 8 must not unlock
 * Spell Master; equipped count of that bar is 0.
 */
export function emptyBarPlaceholderLengthIsNotEquipped(): boolean {
  return equippedSpellBarCount(Array(8).fill(null)) === 0;
}

/** Empty bar slots must stay empty across catalog growth. */
export function shouldAppendCatalogToEmptyBarSlots(): boolean {
  return false;
}

/**
 * Hydrate occupancy from the persisted order only. Keep ids still in the
 * library (starters ∪ keys ∪ bar ∪ catalog). Do not pad remaining slots
 * with current catalog / starter ids — that is not a learn/upgrade event.
 */
export function resolveHydratedSpellBarIds(args: {
  savedOrder: readonly string[] | null | undefined;
  libraryIds: readonly string[];
}): string[] {
  const library = new Set(args.libraryIds);
  const saved = (args.savedOrder ?? [])
    .map((id) => (typeof id === "string" ? id.trim() : ""))
    .filter((id) => id.length > 0 && library.has(id));
  return saved.slice(0, SPELL_MASTER_8_THRESHOLD);
}

export function shouldUnlockSpellMaster8(equippedCount: number): boolean {
  return equippedCount >= SPELL_MASTER_8_THRESHOLD;
}
