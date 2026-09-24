/**
 * createCharacter / deleteCharacter occupancy contracts.
 *
 * Boss Rush is keyed principal#slot and is cleared on create and delete
 * (main.mo _clearBossRushForSlot). Dungeon progress is Principal-only.
 * Canister buffInventories are principal#slot and are not cleared.
 * A new occupant of a slot must not resume another character's mid-run
 * rush (already true) but still inherits dungeon chain + leftover buff
 * stacks unless those maps are cleared too.
 *
 * Official BuffShop ignores the canister map and uses
 * `${principal}_inventory` (all slots share potions). SDEG-005 hydrate
 * must pick a slot policy without summing stacks.
 */

export const DELETE_CHARACTER_CLEARS_BOSS_RUSH = true;
export const DELETE_CHARACTER_CLEARS_DUNGEON_RECORD = false;
export const DELETE_CHARACTER_CLEARS_BUFF_INVENTORY = false;
export const DELETE_CHARACTER_CLEARS_ACHIEVEMENTS = false;
export const DELETE_CHARACTER_CLEARS_DOKA = false;

export function dungeonRecordKey(
  _principalText: string,
  _slot: number,
): string {
  return "principal";
}

export function buffInventoryKey(principalText: string, slot: number): string {
  const safeSlot = Math.max(1, Math.min(3, Math.floor(Number(slot) || 1)));
  return `${principalText}#${safeSlot}`;
}

export function bossRushKey(principalText: string, slot: number): string {
  const safeSlot = Math.max(1, Math.min(3, Math.floor(Number(slot) || 1)));
  return `${principalText}#${safeSlot}`;
}

export type SlotOccupancyLeftover = {
  dungeonRecord: boolean;
  buffInventory: boolean;
  bossRush: boolean;
};

/** What a brand-new character in this slot still reads from the previous occupant. */
export function leftoversAfterDeleteCharacter(): SlotOccupancyLeftover {
  return {
    dungeonRecord: !DELETE_CHARACTER_CLEARS_DUNGEON_RECORD,
    buffInventory: !DELETE_CHARACTER_CLEARS_BUFF_INVENTORY,
    bossRush: !DELETE_CHARACTER_CLEARS_BOSS_RUSH,
  };
}

/**
 * SDEG-005 hydrate: official localStorage is principal-scoped; canister
 * buffInventories are slot-scoped. Copy into empty slot maps only. Never
 * sum a stack that already exists (that would mint potions).
 */
export function hydrateBuffStacksIntoSlot(args: {
  slotExisting: number;
  principalExisting: number;
}): number {
  const slot = Math.max(0, Math.floor(Number(args.slotExisting) || 0));
  const principal = Math.max(
    0,
    Math.floor(Number(args.principalExisting) || 0),
  );
  if (slot > 0) return slot;
  return principal;
}
