/**
 * Slot-scoped localStorage key builders for spell levels / bar / maps.
 *
 * Live WX `nsKey` and BuffShop `principalId={userId}` use GameFlow's userId,
 * which is UserProfile.name (Candid has no profile id). Display-name keys
 * collide across accounts on one browser and orphan on rename; delete does
 * not clear them, so empty canister spellLevelKeys can resurrect prior
 * occupant levels (known empty-keys fallback).
 */

import { isPrincipalText } from "../hooks/bossRushProgress.ts";

export function slotLocalProgressKey(
  ownerKey: string,
  slot: number,
  base: string,
): string {
  return `${ownerKey}_slot${slot}_${base}`;
}

export function spellLevelsLocalKey(ownerKey: string, slot: number): string {
  return slotLocalProgressKey(ownerKey, slot, "pbv_spell_levels");
}

export function activeSpellsLocalKey(ownerKey: string, slot: number): string {
  return slotLocalProgressKey(ownerKey, slot, "pbv_active_spells");
}

export function mapsVisitedLocalKey(ownerKey: string, slot: number): string {
  return slotLocalProgressKey(ownerKey, slot, "pbv_maps_visited_count");
}

export function groundDokaPickupsLocalKey(
  ownerKey: string,
  slot: number,
): string {
  return slotLocalProgressKey(ownerKey, slot, "pbv_ground_doka_pickups");
}

/** Prefer II principal text; reject display names / guest. */
export function resolveSlotLocalOwnerKey(
  identityPrincipalText: string | null | undefined,
  fallbackDisplayName: string | null | undefined,
): { key: string; isPrincipal: boolean } {
  if (identityPrincipalText && isPrincipalText(identityPrincipalText)) {
    return { key: identityPrincipalText, isPrincipal: true };
  }
  const name = (fallbackDisplayName ?? "").trim() || "guest";
  return { key: name, isPrincipal: false };
}

export function displayNameOwnerKeyIsUnsafeForPersist(
  ownerKey: string,
): boolean {
  return !isPrincipalText(ownerKey);
}
