import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  SPELLBOOK_CANCEL_LABEL,
  SPELLBOOK_CANCEL_TITLE,
  SPELLBOOK_SAVE_HINT,
} from "./spellbookCancelCopy.ts";

const bookSource = readFileSync(
  fileURLToPath(new URL("../components/SpellbookModal.tsx", import.meta.url)),
  "utf8",
);

describe("spellbookCancelCopy", () => {
  it("says Close does not undo spent upgrades", () => {
    assert.equal(SPELLBOOK_CANCEL_LABEL, "Close");
    assert.match(SPELLBOOK_CANCEL_TITLE, /slots/i);
    assert.match(SPELLBOOK_CANCEL_TITLE, /upgrades already spent/i);
    assert.match(SPELLBOOK_SAVE_HINT, /Doka immediately/i);
    assert.equal(/refund|undo upgrade/i.test(SPELLBOOK_CANCEL_TITLE), false);
    assert.equal(/dashboard|saas|tooltip/i.test(SPELLBOOK_CANCEL_TITLE), false);
  });

  it("is not wired into SpellbookModal", () => {
    assert.match(bookSource, /data-ocid="spellbook.cancel_button"/);
    assert.match(bookSource, />\s*Cancel\s*</);
    assert.equal(bookSource.includes("spellbookCancelCopy"), false);
    assert.equal(bookSource.includes("SPELLBOOK_CANCEL_TITLE"), false);
    assert.equal(
      bookSource.includes("upgrades already spent stay spent"),
      false,
    );
  });
});
