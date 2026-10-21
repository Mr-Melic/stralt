import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

describe("alert-dialog action targets", () => {
  it("keeps shadcn AlertDialog Action and Cancel at the DESIGN.md 44px floor", () => {
    const src = readFileSync(
      fileURLToPath(
        new URL("../components/ui/alert-dialog.tsx", import.meta.url),
      ),
      "utf8",
    );
    assert.match(src, /function AlertDialogAction/);
    assert.match(src, /function AlertDialogCancel/);
    assert.match(src, /min-h-\[44px\]/);
    assert.match(src, /min-w-\[44px\]/);
    const actionBlock = src.slice(
      src.indexOf("function AlertDialogAction"),
      src.indexOf("function AlertDialogCancel"),
    );
    const cancelBlock = src.slice(src.indexOf("function AlertDialogCancel"));
    assert.match(actionBlock, /min-h-\[44px\]/);
    assert.match(actionBlock, /min-w-\[44px\]/);
    assert.match(cancelBlock, /min-h-\[44px\]/);
    assert.match(cancelBlock, /min-w-\[44px\]/);
  });
});
