/**
 * Character.name uniqueness vs free appearance save (SDEG-2026-10-29-002).
 *
 * `renameCharacter` (`main.mo` 1860–1873) is the paid path: 100 Doka
 * (`RENAME_DOKA_COST`) and rejects when **any** slot already has that
 * exact name, including the slot being renamed. `createCharacter`
 * (309–310) and `updateCharacter` (389–391) only check length 1–20.
 * Official Edit Champion (`CharacterCreation.tsx` 267 / 290–294) sends
 * `name` through `updateCharacter` with no fee and no duplicate check.
 *
 * `getLeaderboard` (`main.mo` 3400–3403) uses `Character.name`.
 * `UserProfile.name` (`main.mo` 48–54) is a separate identity column
 * (chat / HUD `userId`). A six-month player who forges a second "Hero"
 * keeps two leaderboard-visible rows that the paid rename API cannot
 * collapse onto "Hero" (self-collision). Yesterday’s appearance save
 * can change the leaderboard name without the 100 Doka debit.
 *
 * Distinct from 09-29-003 (profile `uiLayout:""` full-replace),
 * 10-24-013 (display-name spell-level keys), and 10-25-003 (HUD
 * display-name poison). Do not add a required Character.displayName
 * field. Do not edit CharacterCreation / main.mo this stack.
 */

import { RENAME_DOKA_COST } from "./renameCharacter.ts";

export const HEAD_RENAME_DOKA_COST = RENAME_DOKA_COST;
export const HEAD_CHARACTER_NAME_MAX = 20;

export type CharacterSlotNames = [string | null, string | null, string | null];

export function headCreateCharacterEnforcesUniqueName(): boolean {
  return false;
}

export function headUpdateCharacterEnforcesUniqueName(): boolean {
  return false;
}

export function headRenameCharacterEnforcesUniqueName(): boolean {
  return true;
}

export function officialAppearanceEditorCanRenameWithoutFee(): boolean {
  return true;
}

export function leaderboardIdentityIsCharacterName(): boolean {
  return true;
}

export function userProfileNameIsSeparateIdentity(): boolean {
  return true;
}

/**
 * HEAD `renameCharacter` collision: every occupied slot, including the
 * one being renamed. Same-name no-op therefore `#err`s.
 */
export function headRenameCharacterRejectsName(args: {
  newName: string;
  slotNames: CharacterSlotNames;
}): boolean {
  const want = args.newName;
  if (!want) return true;
  return args.slotNames.some((name) => name === want);
}

/**
 * Recommended write policy for create / update / rename: collide only
 * against **other** slots so a same-name no-op and a uniqueness fix both
 * work. Empty names stay a length error, not a uniqueness error.
 */
export function shouldRejectDuplicateCharacterNameWithinAccount(args: {
  newName: string;
  slotNames: CharacterSlotNames;
  writingSlot: 1 | 2 | 3;
}): boolean {
  const want = args.newName;
  if (!want) return false;
  return args.slotNames.some(
    (name, index) => name === want && index !== args.writingSlot - 1,
  );
}

export function shouldChargeAppearanceEditorRename(): boolean {
  return false;
}
