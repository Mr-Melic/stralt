import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  HEAD_CHARACTER_NAME_MAX,
  HEAD_RENAME_DOKA_COST,
  headCreateCharacterEnforcesUniqueName,
  headRenameCharacterEnforcesUniqueName,
  headRenameCharacterRejectsName,
  headUpdateCharacterEnforcesUniqueName,
  leaderboardIdentityIsCharacterName,
  officialAppearanceEditorCanRenameWithoutFee,
  shouldChargeAppearanceEditorRename,
  shouldRejectDuplicateCharacterNameWithinAccount,
  userProfileNameIsSeparateIdentity,
} from "./characterNameUniquenessPersist.ts";
import { RENAME_DOKA_COST } from "./renameCharacter.ts";

describe("characterNameUniquenessPersist", () => {
  it("HEAD uniqueness lives only on the paid renameCharacter path", () => {
    assert.equal(HEAD_RENAME_DOKA_COST, RENAME_DOKA_COST);
    assert.equal(HEAD_RENAME_DOKA_COST, 100);
    assert.equal(HEAD_CHARACTER_NAME_MAX, 20);
    assert.equal(headCreateCharacterEnforcesUniqueName(), false);
    assert.equal(headUpdateCharacterEnforcesUniqueName(), false);
    assert.equal(headRenameCharacterEnforcesUniqueName(), true);
    assert.equal(officialAppearanceEditorCanRenameWithoutFee(), true);
    assert.equal(leaderboardIdentityIsCharacterName(), true);
    assert.equal(userProfileNameIsSeparateIdentity(), true);
  });

  it("HEAD rename rejects the current slot's own name; recommended policy allows a same-slot no-op", () => {
    const slots: [string | null, string | null, string | null] = [
      "Hero",
      "Hero",
      null,
    ];
    assert.equal(
      headRenameCharacterRejectsName({ newName: "Hero", slotNames: slots }),
      true,
    );
    assert.equal(
      shouldRejectDuplicateCharacterNameWithinAccount({
        newName: "Hero",
        slotNames: slots,
        writingSlot: 1,
      }),
      true,
    );
    assert.equal(
      shouldRejectDuplicateCharacterNameWithinAccount({
        newName: "Hero",
        slotNames: ["Hero", "Sidekick", null],
        writingSlot: 1,
      }),
      false,
    );
    assert.equal(
      shouldRejectDuplicateCharacterNameWithinAccount({
        newName: "Sidekick",
        slotNames: ["Hero", "Sidekick", null],
        writingSlot: 2,
      }),
      false,
    );
    assert.equal(shouldChargeAppearanceEditorRename(), false);
  });
});
