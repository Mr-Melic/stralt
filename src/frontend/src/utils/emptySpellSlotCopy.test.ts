import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { emptyBattleSlotTitle } from "./emptySpellSlotCopy.ts";

const panelSource = readFileSync(
  fileURLToPath(new URL("../components/BattleUIPanel.tsx", import.meta.url)),
  "utf8",
);

describe("emptySpellSlotCopy", () => {
  it("points empty battle slots at Book", () => {
    assert.equal(emptyBattleSlotTitle(0), "Empty slot 1 — open Book to equip");
    assert.equal(emptyBattleSlotTitle(7), "Empty slot 8 — open Book to equip");
    assert.match(emptyBattleSlotTitle(3), /Book/);
    assert.equal(/spellbook/i.test(emptyBattleSlotTitle(0)), false);
  });

  it("is not wired into BattleUIPanel (hosts still omit Book)", () => {
    assert.match(panelSource, /Empty slot \$\{slotIndex \+ 1\}/);
    assert.equal(panelSource.includes("emptyBattleSlotTitle"), false);
    assert.equal(panelSource.includes("open Book to equip"), false);
  });
});
