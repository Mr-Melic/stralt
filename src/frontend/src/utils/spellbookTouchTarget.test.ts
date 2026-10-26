import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  SPELLBOOK_MOBILE_TOUCH_CLASS,
  SPELLBOOK_MOBILE_TOUCH_OCID_MARKERS,
  spellbookControlUsesMobileTouchFloor,
  spellbookOcidBlocks,
  spellbookPrimaryActionsHaveMobileTouchFloor,
} from "./spellbookTouchTarget.ts";

const modalSource = readFileSync(
  join(
    dirname(fileURLToPath(import.meta.url)),
    "../components/SpellbookModal.tsx",
  ),
  "utf8",
);

describe("spellbookControlUsesMobileTouchFloor", () => {
  it("accepts the live CSS mobile floor class", () => {
    assert.equal(SPELLBOOK_MOBILE_TOUCH_CLASS, "stone-touch-target");
    assert.equal(
      spellbookControlUsesMobileTouchFloor(
        "className={SPELLBOOK_MOBILE_TOUCH_CLASS}",
      ),
      true,
    );
    assert.equal(
      spellbookControlUsesMobileTouchFloor('className="stone-touch-target"'),
      true,
    );
  });

  it("accepts an explicit 44px minHeight and rejects an unfloored control", () => {
    assert.equal(spellbookControlUsesMobileTouchFloor("minHeight: 44,"), true);
    assert.equal(
      spellbookControlUsesMobileTouchFloor('style={{ padding: "8px 18px" }}'),
      false,
    );
  });
});

describe("spellbookPrimaryActionsHaveMobileTouchFloor", () => {
  it("locks Save, Cancel, swap confirm, and upgrade spend on the 44px class", () => {
    assert.equal(
      spellbookPrimaryActionsHaveMobileTouchFloor(modalSource),
      true,
    );
    const blocks = spellbookOcidBlocks(modalSource);
    for (const marker of SPELLBOOK_MOBILE_TOUCH_OCID_MARKERS) {
      const hits = blocks.filter((b) =>
        marker.endsWith(".") ? b.ocid.startsWith(marker) : b.ocid === marker,
      );
      assert.ok(hits.length > 0, `missing ocid marker ${marker}`);
      for (const hit of hits) {
        assert.equal(
          spellbookControlUsesMobileTouchFloor(hit.block),
          true,
          hit.ocid,
        );
      }
    }
  });

  it("does not retag catalog cards or 54px slots (PERF-186 / already ≥44)", () => {
    assert.equal(modalSource.includes("data-ocid={`spellbook.slot."), true);
    const slot = spellbookOcidBlocks(modalSource).find((b) =>
      b.ocid.startsWith("spellbook.slot."),
    );
    assert.ok(slot);
    assert.equal(spellbookControlUsesMobileTouchFloor(slot.block), false);
    assert.equal(slot.block.includes("width: 54"), true);
  });
});
