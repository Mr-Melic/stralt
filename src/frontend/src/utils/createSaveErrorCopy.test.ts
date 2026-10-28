import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { FORGE_SAVE_FAIL_TOAST } from "./createSaveErrorCopy.ts";

const createSource = readFileSync(
  fileURLToPath(
    new URL("../components/CharacterCreation.tsx", import.meta.url),
  ),
  "utf8",
);

describe("createSaveErrorCopy", () => {
  it("never surfaces agent or Candid text", () => {
    assert.equal(
      FORGE_SAVE_FAIL_TOAST,
      "Could not save this champion. Try again.",
    );
    assert.equal(/\$\{/.test(FORGE_SAVE_FAIL_TOAST), false);
    assert.equal(/Error\.message/.test(FORGE_SAVE_FAIL_TOAST), false);
  });

  it("is not wired — CharacterCreation still interpolates errMsg", () => {
    assert.match(createSource, /Failed to save character: \$\{errMsg\}/);
    assert.equal(createSource.includes("createSaveErrorCopy"), false);
  });
});
