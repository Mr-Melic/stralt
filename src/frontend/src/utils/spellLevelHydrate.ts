export type PersistedSpellLevelRecord = {
  spellLevelKeys?: readonly string[] | null;
  spellLevelValues?: readonly (bigint | number | string)[] | null;
} | null;

/**
 * Combat levels are `Character.spellLevelKeys` / `spellLevelValues`.
 * `{userId}_slotN_pbv_spell_levels` is a write-through cache only.
 *
 * Hydrating from that cache when the canister arrays were empty (new
 * character, delete+recreate on the same slot, or a never-upgraded slot
 * falling through to leftover `pbv_spell_levels`) let `calcScaledDamage`
 * use paid levels the new record does not own. `saveBattleStats` ignores
 * the arrays, so the ghost never landed on the canister.
 */
export function spellLevelsFromCharacterRecord(
  character: PersistedSpellLevelRecord | undefined,
): Record<string, number> {
  const keys = character?.spellLevelKeys;
  const vals = character?.spellLevelValues;
  const result: Record<string, number> = {};
  if (!Array.isArray(keys) || keys.length === 0) return result;
  const values = Array.isArray(vals) ? vals : [];
  for (let i = 0; i < keys.length; i++) {
    const id = keys[i];
    if (typeof id !== "string" || id.length === 0) continue;
    const raw = Number(values[i] ?? 0);
    result[id] = Number.isFinite(raw) ? Math.max(0, Math.floor(raw)) : 0;
  }
  return result;
}
