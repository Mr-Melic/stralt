/**
 * Browser leftovers after deleteCharacter / createCharacter into a vacant slot.
 *
 * Canister deleteCharacter clears the slot and Boss Rush (`main.mo`
 * `_clearBossRushForSlot`) but never touches localStorage. Official
 * CharacterSelection only calls the canister delete mutation — so a new
 * champion in the same slot inherits feat counters, shrine/covenant caches,
 * and spell-bar/level caches written under `${owner}_slotN_*`.
 *
 * Canister dungeon / buff leftovers are documented separately
 * (SDEG-2026-09-24-003 / slotOccupancyEvolve). This file is the browser half.
 */

export const SLOT_BROWSER_LEFTOVER_BASES = [
  "pbv_maps_visited_count",
  "pbv_ground_doka_pickups",
  "pbv_active_spells",
  "pbv_spell_levels",
] as const;

export const SLOT_BROWSER_LEFTOVER_PREFIXES = [
  "pbv_covenant_buff_",
  "pbv_shrine_count_",
  "pbv_pending_death_penalty",
] as const;

export function characterSlotProgressKey(
  owner: string,
  slot: number,
  base: string,
): string {
  const safeSlot = Math.max(1, Math.min(3, Math.floor(Number(slot) || 1)));
  return `${owner}_slot${safeSlot}_${base}`;
}

export function covenantBuffStorageKey(owner: string, slot: number): string {
  const safeSlot = Math.max(1, Math.min(3, Math.floor(Number(slot) || 1)));
  return `pbv_covenant_buff_${owner}_slot${safeSlot}`;
}

export function shrineCountStorageKey(owner: string, slot: number): string {
  const safeSlot = Math.max(1, Math.min(3, Math.floor(Number(slot) || 1)));
  return `pbv_shrine_count_${owner}_slot${safeSlot}`;
}

/** Keys a brand-new occupant of `slot` still reads from the previous champion. */
export function browserLeftoverKeysAfterDeleteCharacter(
  owner: string,
  slot: number,
): string[] {
  const keys = SLOT_BROWSER_LEFTOVER_BASES.map((base) =>
    characterSlotProgressKey(owner, slot, base),
  );
  keys.push(covenantBuffStorageKey(owner, slot));
  keys.push(shrineCountStorageKey(owner, slot));
  // Slot-only unpaid death on main (II-scoped form lands with #385).
  keys.push(
    `pbv_pending_death_penalty_slot${Math.max(1, Math.floor(Number(slot) || 1))}`,
  );
  return keys;
}

export function deleteCharacterClearsBrowserSlotKeys(): boolean {
  return false;
}
