import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { challengeBadgeRewardLine } from "./challengeBadgeCopy.ts";

const panelSource = readFileSync(
  fileURLToPath(new URL("../components/ChallengePanel.tsx", import.meta.url)),
  "utf8",
);

describe("challengeBadgeCopy", () => {
  it("names the title as chrome, not an inventory item", () => {
    assert.equal(
      challengeBadgeRewardLine("Untouchable"),
      "Title: Untouchable — a name only, not an item",
    );
    assert.equal(challengeBadgeRewardLine("  "), "");
    assert.match(challengeBadgeRewardLine("Striker"), /not an item/i);
    assert.equal(/^Badge:/.test(challengeBadgeRewardLine("Blitz")), false);
  });

  it("is not wired — ChallengePanel still prints Badge: {name}", () => {
    assert.match(panelSource, /Badge: \{currentChallenge\.rewards\.badge\}/);
    assert.equal(panelSource.includes("challengeBadgeCopy"), false);
  });
});
