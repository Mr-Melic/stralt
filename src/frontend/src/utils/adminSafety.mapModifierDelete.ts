/**
 * Client mirror of AdminGuard.mapModifierHardDeleteRejected.
 * Do not add this to adminSafety.ts — queued PRs already own that file.
 * Backend enforcement is authoritative.
 */

const BUILT_IN_MAP_MODIFIER_IDS = ["slime_flood", "paper_windstorm"] as const;

export function isBuiltInMapModifierId(id: string): boolean {
  return (BUILT_IN_MAP_MODIFIER_IDS as readonly string[]).includes(id);
}

/**
 * Failure: official Admin × on Slime Flood hard-deletes the seeded row.
 * Seed only runs when the map is empty, so slime_flood never returns while
 * paper_windstorm remains. rollActiveModifiers keys hooks by id ∩ registry.
 */
export function mapModifierHardDeleteRejected(id: string): string | null {
  if (!id) return "Map modifier id cannot be empty";
  if (id.length > 64) return "Map modifier id exceeds maximum length";
  if (isBuiltInMapModifierId(id)) {
    return "Cannot delete a built-in map modifier; set active=false to retire it";
  }
  return null;
}
