import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  shouldCloseOwnerEditorAfterSave,
  shouldKeepOwnerEditorOpen,
  spriteEditorClosedBeforeSaveSettled,
} from "./adminOwnerUx.spriteSaveClose.ts";

describe("owner sprite save close", () => {
  it("closes the editor only after a successful write", () => {
    assert.equal(shouldCloseOwnerEditorAfterSave("ok"), true);
    assert.equal(shouldKeepOwnerEditorOpen("ok"), false);
  });

  it("keeps the editor open on validation failure, pending, or #err", () => {
    for (const outcome of [
      "idle",
      "validation_failed",
      "pending",
      "err",
    ] as const) {
      assert.equal(shouldCloseOwnerEditorAfterSave(outcome), false);
      assert.equal(shouldKeepOwnerEditorOpen(outcome), true);
    }
  });

  it("flags SpriteList closing synchronously before the write settles", () => {
    assert.equal(
      spriteEditorClosedBeforeSaveSettled({
        editorClosed: true,
        outcome: "pending",
      }),
      true,
    );
    assert.equal(
      spriteEditorClosedBeforeSaveSettled({
        editorClosed: true,
        outcome: "validation_failed",
      }),
      true,
    );
    assert.equal(
      spriteEditorClosedBeforeSaveSettled({
        editorClosed: true,
        outcome: "ok",
      }),
      false,
    );
    assert.equal(
      spriteEditorClosedBeforeSaveSettled({
        editorClosed: false,
        outcome: "err",
      }),
      false,
    );
  });
});
