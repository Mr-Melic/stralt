/**
 * Champion-forge save failure toast. Display only — not wired into
 * CharacterCreation.tsx (forbidden while older open PRs own that file).
 *
 * UX-CREATE-SAVE-RAW-ERR (reported 2026-10-27, helper locked this run):
 * after retries the toast is `Failed to save character: ${errMsg}` from
 * Error.message (Candid / agent / network). Distinct from
 * UX-PROFILE-ERROR-ALERT / UX-SELECTION-ERROR-ALERT.
 */

export const FORGE_SAVE_FAIL_TOAST = "Could not save this champion. Try again.";
