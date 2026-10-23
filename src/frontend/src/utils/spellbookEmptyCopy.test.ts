import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  SPELLBOOK_EMPTY_BODY,
  SPELLBOOK_EMPTY_TITLE,
} from "./spellbookEmptyCopy.ts";

const bookSource = readFileSync(
  fileURLToPath(new URL("../components/SpellbookModal.tsx", import.meta.url)),
  "utf8",
);

describe("spellbookEmptyCopy", () => {
  it("does not mention admin and names the catalog", () => {
    assert.equal(SPELLBOOK_EMPTY_TITLE, "No spells available");
    assert.match(SPELLBOOK_EMPTY_BODY, /catalog/i);
    assert.equal(/admin/i.test(SPELLBOOK_EMPTY_TITLE), false);
    assert.equal(/admin/i.test(SPELLBOOK_EMPTY_BODY), false);
    assert.equal(/dashboard|saas|tooltip/i.test(SPELLBOOK_EMPTY_BODY), false);
  });

  it("is not wired into SpellbookModal", () => {
    assert.match(bookSource, /The admin has not added any spells yet/);
    assert.equal(bookSource.includes("spellbookEmptyCopy"), false);
    assert.equal(bookSource.includes("SPELLBOOK_EMPTY_BODY"), false);
    assert.equal(bookSource.includes("No spells in the catalog yet."), false);
  });
});
