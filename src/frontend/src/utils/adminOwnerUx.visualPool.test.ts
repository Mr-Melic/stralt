import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  customVisualPoolCopy,
  visualAssetStatusLines,
  visualUploadRequirementsBeforeSelect,
} from "./adminOwnerUx.visualPool.ts";
import {
  DEFAULT_PIXEL_VISUAL_STATUS,
  STORED_URL_NOT_RENDERED_STATUS,
} from "./adminVisualStatus.ts";

describe("customVisualPoolCopy", () => {
  it("treats zero variants as a valid empty pool", () => {
    assert.equal(
      customVisualPoolCopy(0),
      "Custom Visual Pool — 0 active variants",
    );
    assert.equal(
      customVisualPoolCopy(Number.NaN),
      "Custom Visual Pool — 0 active variants",
    );
  });

  it("singularizes one active variant", () => {
    assert.equal(
      customVisualPoolCopy(1),
      "Custom Visual Pool — 1 active variant",
    );
    assert.equal(
      customVisualPoolCopy(3),
      "Custom Visual Pool — 3 active variants",
    );
  });
});

describe("visualAssetStatusLines", () => {
  it("never marks an empty custom visual as an error", () => {
    const empty = visualAssetStatusLines({
      storedCustomUrl: false,
      activeVariantCount: 0,
    });
    assert.equal(empty.isError, false);
    assert.equal(empty.emptyCustomIsValid, true);
    assert.deepEqual(empty.lines, [
      DEFAULT_PIXEL_VISUAL_STATUS,
      "Custom Visual Pool — 0 active variants",
    ]);
  });

  it("keeps a stored catalog URL from reading as a live override", () => {
    const stored = visualAssetStatusLines({
      storedCustomUrl: true,
      activeVariantCount: 0,
    });
    assert.equal(stored.isError, false);
    assert.equal(stored.lines[0], STORED_URL_NOT_RENDERED_STATUS);
    assert.equal(/error/i.test(stored.lines.join(" ")), false);
  });

  it("pairs an active fallback with a non-empty pool", () => {
    const pooled = visualAssetStatusLines({
      storedCustomUrl: false,
      activeVariantCount: 3,
    });
    assert.deepEqual(pooled.lines, [
      DEFAULT_PIXEL_VISUAL_STATUS,
      "Custom Visual Pool — 3 active variants",
    ]);
    assert.equal(pooled.isError, false);
  });
});

describe("visualUploadRequirementsBeforeSelect", () => {
  it("states entity requirements before a file is chosen", () => {
    assert.match(visualUploadRequirementsBeforeSelect("enemy"), /Leave blank/i);
    assert.match(
      visualUploadRequirementsBeforeSelect("sprite"),
      /Four facing/i,
    );
    assert.match(visualUploadRequirementsBeforeSelect("ad"), /both empty/i);
  });
});
