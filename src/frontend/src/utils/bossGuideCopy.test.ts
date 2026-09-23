import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

describe("boss-guide next-step copy", () => {
  it("tells the player purple whirlpools start a boss fight", () => {
    const src = readFileSync(
      fileURLToPath(
        new URL("../components/BossGuideModal.tsx", import.meta.url),
      ),
      "utf8",
    );
    assert.match(src, /data-ocid="boss_guide\.next_step"/);
    assert.match(src, /purple whirlpool/);
    assert.match(src, /Boss[\s\n]+Rush is a separate ten-room chain/);
  });
});
