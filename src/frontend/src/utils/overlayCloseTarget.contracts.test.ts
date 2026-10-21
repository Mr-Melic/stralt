import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

describe("overlay close targets", () => {
  it("keeps shadcn Dialog Close at the DESIGN.md 44px floor", () => {
    const src = readFileSync(
      fileURLToPath(new URL("../components/ui/dialog.tsx", import.meta.url)),
      "utf8",
    );
    assert.match(src, /data-slot="dialog-close"/);
    assert.match(src, /min-h-\[44px\]/);
    assert.match(src, /min-w-\[44px\]/);
    assert.match(src, /sr-only">Close/);
  });

  it("keeps shadcn Sheet Close at the DESIGN.md 44px floor", () => {
    const src = readFileSync(
      fileURLToPath(new URL("../components/ui/sheet.tsx", import.meta.url)),
      "utf8",
    );
    assert.match(src, /SheetPrimitive\.Close/);
    assert.match(src, /min-h-\[44px\]/);
    assert.match(src, /min-w-\[44px\]/);
    assert.match(src, /sr-only">Close/);
  });
});
