/**
 * Owner-tool confirm copy for live system-config publishes (2026-09-24).
 * Kept in a sibling of adminOwnerUx.ts so #470's helper file stays one
 * implementation and this branch 3-way-merges onto the oldest-first prefix.
 */

/** Save Palette writes the canister-live paper-vertex fallback immediately. */
export function adminPaletteSaveConfirmBody(): string {
  return "This publishes the paper-vertex palette to the canister immediately. Maps that read the live palette pick it up on the next hydrate. This is not a browser draft.";
}

/** Enemy Tiers Save writes the live spawn mix immediately. */
export function adminTierSaveConfirmBody(): string {
  return "This publishes the live enemy-tier spawn mix immediately. Encounter rolls use the stored percents plus the leftover ±3+ band. This is not a browser draft.";
}

/** Ground Doka / leader boost Save writes live economy fields. */
export function adminGameConfigSaveConfirmBody(): string {
  return "This publishes ground Doka spawn chance, base value, and leader boost immediately. There is no staged draft.";
}

/** Level-up Save writes all nine LevelUpConfig fields live. */
export function adminLevelUpSaveConfirmBody(): string {
  return "This publishes all nine LevelUpConfig fields to the canister immediately. Live combat may still hydrate fail/range from local cache until WorldExploration calls getLevelUpConfig. This is not a browser draft.";
}
