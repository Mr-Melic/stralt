import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  applySpellTypeChange,
  applySummonEnabled,
  patchSummonField,
} from "./adminOwnerUx.summon.ts";

const base = {
  spellType: "damage" as const,
  effectType: "damage",
  isSummon: false,
  summonAI: "",
  summonLifespan: 0,
  summonUnitDef: { pieceType: "", level: 0, hpScale: 0, damageScale: 0 },
};

describe("applySpellTypeChange", () => {
  it("enabling summon fills known AI / piece defaults so validateSpellConfig can pass", () => {
    const next = applySpellTypeChange(base, "summon");
    assert.equal(next.spellType, "summon");
    assert.equal(next.effectType, "summon");
    assert.equal(next.isSummon, true);
    assert.equal(next.summonAI, "hunter");
    assert.equal(next.summonLifespan, 3);
    assert.equal(next.summonUnitDef.pieceType, "pawn");
    assert.equal(next.summonUnitDef.level, 1);
    assert.equal(next.summonUnitDef.hpScale, 1);
    assert.equal(next.summonUnitDef.damageScale, 1);
  });

  it("leaving summon clears AI so isSummon false does not fail empty-AI validation", () => {
    const summoned = applySpellTypeChange(base, "summon");
    const next = applySpellTypeChange(summoned, "heal");
    assert.equal(next.spellType, "heal");
    assert.equal(next.isSummon, false);
    assert.equal(next.summonAI, "");
    assert.equal(next.summonLifespan, 0);
    assert.equal(next.summonUnitDef.pieceType, "");
  });

  it("damage → heal does not clobber a non-summon row", () => {
    const next = applySpellTypeChange(base, "heal");
    assert.equal(next.spellType, "heal");
    assert.equal(next.isSummon, false);
    assert.equal(next.summonAI, "");
    assert.equal(next.effectType, "damage");
  });
});

describe("applySummonEnabled", () => {
  it("unchecking summon after Spell Type summon restores a non-summon type", () => {
    const summoned = applySpellTypeChange(
      { ...base, spellType: "heal", effectType: "heal" },
      "summon",
    );
    const next = applySummonEnabled(summoned, false);
    assert.equal(next.spellType, "damage");
    assert.equal(next.isSummon, false);
    assert.equal(next.summonAI, "");
  });

  it("noop when already not a summon", () => {
    const next = applySummonEnabled(base, false);
    assert.equal(next, base);
  });
});

describe("patchSummonField", () => {
  it("caps lifespan at 20 and ignores unknown AI", () => {
    const summoned = applySpellTypeChange(base, "summon");
    const long = patchSummonField(summoned, "summonLifespan", 99);
    assert.equal(long.summonLifespan, 20);
    const badAi = patchSummonField(summoned, "summonAI", "dragon");
    assert.equal(badAi.summonAI, "hunter");
    const okAi = patchSummonField(summoned, "summonAI", "kiter");
    assert.equal(okAi.summonAI, "kiter");
  });

  it("does not patch a non-summon row", () => {
    const next = patchSummonField(base, "summonAI", "hunter");
    assert.equal(next.summonAI, "");
  });
});
