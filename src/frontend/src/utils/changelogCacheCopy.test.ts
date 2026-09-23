import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

describe("changelog cache copy", () => {
  it("says canister champions stay after a version-gate cache refresh", () => {
    const src = readFileSync(
      fileURLToPath(new URL("../App.tsx", import.meta.url)),
      "utf8",
    );
    assert.match(src, /data-ocid="changelog\.cache_note"/);
    assert.match(src, /Champions on the canister stay/);
    assert.match(src, /local cache/);
    assert.equal(/please review before playing/.test(src), false);
  });
});
