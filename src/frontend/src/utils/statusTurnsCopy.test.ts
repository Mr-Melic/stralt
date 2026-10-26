import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { statusTurnsLabel } from "./statusTurnsCopy.ts";

const badgeSource = readFileSync(
  fileURLToPath(
    new URL("../components/StatusEffectBadge.tsx", import.meta.url),
  ),
  "utf8",
);

describe("statusTurnsCopy", () => {
  it("says turns, not Nt", () => {
    assert.equal(statusTurnsLabel(1), "1 turn");
    assert.equal(statusTurnsLabel(4), "4 turns");
    assert.equal(statusTurnsLabel(0), "0 turns");
    assert.equal(/\d+t$/.test(statusTurnsLabel(4)), false);
  });

  it("is not wired — StatusEffectBadge still prints {turns}t", () => {
    assert.match(badgeSource, /\{turns\}t/);
    assert.equal(badgeSource.includes("statusTurnsCopy"), false);
  });
});
