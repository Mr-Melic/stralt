import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { turnIndexLabel } from "./turnIndexCopy.ts";

const panelSource = readFileSync(
  fileURLToPath(new URL("../components/BattleUIPanel.tsx", import.meta.url)),
  "utf8",
);

describe("turnIndexCopy", () => {
  it("says Turn N, not T{n}", () => {
    assert.equal(turnIndexLabel(1), "Turn 1");
    assert.equal(turnIndexLabel(12), "Turn 12");
    assert.equal(/^T\d+$/.test(turnIndexLabel(3)), false);
    assert.match(turnIndexLabel(3), /^Turn 3$/);
  });

  it("floors garbage to Turn 1", () => {
    assert.equal(turnIndexLabel(0), "Turn 1");
    assert.equal(turnIndexLabel(-4), "Turn 1");
    assert.equal(turnIndexLabel(2.9), "Turn 2");
  });

  it("is not wired — BattleUIPanel still prints T{battleTurn}", () => {
    assert.match(panelSource, /T\{battleTurn\}/);
    assert.equal(panelSource.includes("turnIndexCopy"), false);
  });
});
