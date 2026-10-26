import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  spellCooldownOverlayLabel,
  spellCooldownTitleSuffix,
} from "./spellCooldownCopy.ts";

const panelSource = readFileSync(
  fileURLToPath(new URL("../components/BattleUIPanel.tsx", import.meta.url)),
  "utf8",
);

describe("spellCooldownCopy", () => {
  it("says turns remaining instead of CD: Nt", () => {
    assert.equal(spellCooldownTitleSuffix(2), " | 2 turns remaining");
    assert.equal(spellCooldownTitleSuffix(1), " | 1 turn remaining");
    assert.equal(spellCooldownTitleSuffix(0), "");
    assert.equal(/CD:/.test(spellCooldownTitleSuffix(3)), false);
    assert.equal(/\d+t/.test(spellCooldownTitleSuffix(3)), false);
  });

  it("keeps a compact overlay number for 2+ turns and names a 1-turn wait", () => {
    assert.equal(spellCooldownOverlayLabel(3), "3");
    assert.equal(spellCooldownOverlayLabel(1), "1 turn");
    assert.equal(spellCooldownOverlayLabel(0), "");
  });

  it("is not wired — BattleUIPanel still prints CD: Nt and a bare overlay", () => {
    assert.match(panelSource, /CD: \$\{cdTurns\}t/);
    assert.match(panelSource, /\{cdTurns\}/);
    assert.equal(panelSource.includes("spellCooldownCopy"), false);
  });
});
