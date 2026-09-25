import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { overworldHealButtonCopy } from "./healHudCopy.ts";

describe("overworldHealButtonCopy", () => {
  it("uses the affordable partial heal on both the label and the hover title", () => {
    const copy = overworldHealButtonCopy({
      canAfford: true,
      healHp: 30,
      dokaCost: 10,
    });
    assert.match(copy.label, /30 HP/);
    assert.match(copy.label, /10 Doka/);
    assert.match(copy.title, /30 HP/);
    assert.match(copy.title, /10 Doka/);
    assert.equal(/Heal 90 HP/.test(copy.title), false);
  });

  it("explains a broke wallet without quoting a full-heal price", () => {
    const copy = overworldHealButtonCopy({
      canAfford: false,
      healHp: 0,
      dokaCost: 0,
    });
    assert.match(copy.label, /Need Doka/);
    assert.match(copy.title, /Not enough Doka/);
  });
});
