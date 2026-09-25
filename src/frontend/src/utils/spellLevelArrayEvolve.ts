/**
 * Parallel spellLevelKeys / spellLevelValues length contract.
 *
 * upgradeSpell walks keys and indexes values with
 * `character.spellLevelValues[idx]` (`main.mo` ~998–1000) with no bounds
 * check. When `keys.size > values.size`, Motoko traps on the first orphan
 * key. createCharacter clears both to `[]`; updateCharacter keep-stores;
 * upgradeSpell appends to both when granting. A corrupted or raw-client
 * row with unequal lengths bricks paid upgrades for that slot.
 */

export function spellLevelArraysAligned(
  keys: readonly string[],
  values: readonly unknown[],
): boolean {
  return keys.length === values.length;
}

/**
 * Safe current level lookup. Returns null when the arrays are misaligned
 * or the id is absent — callers must not call upgradeSpell until aligned.
 */
export function spellLevelForId(
  keys: readonly string[],
  values: readonly number[],
  spellId: string,
): number | null {
  if (!spellLevelArraysAligned(keys, values)) return null;
  const idx = keys.indexOf(spellId);
  if (idx < 0) return 0;
  const raw = values[idx];
  if (!Number.isFinite(raw) || raw < 0) return null;
  return Math.floor(raw);
}

export function shouldRejectUpgradeForMisalignedArrays(
  keys: readonly string[],
  values: readonly unknown[],
): boolean {
  return !spellLevelArraysAligned(keys, values);
}
