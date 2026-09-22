import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

describe("game-over penalty copy", () => {
  it("always explains the 20% leftover XP / 40% Doka rule", () => {
    const src = readFileSync(
      fileURLToPath(
        new URL("../components/GameOverModal.tsx", import.meta.url),
      ),
      "utf8",
    );
    assert.match(src, /data-ocid="game_over\.penalty_rule"/);
    assert.match(src, /20% leftover XP and 40% Doka/);
    assert.match(src, /leftover XP/);
  });
});
