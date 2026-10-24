import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  emptySpellSlotLabel,
  spellSlotBlockedByAp,
  spellSlotTitle,
} from "./spellSlotDisabledCopy.ts";

describe("spellSlotDisabledCopy", () => {
  it("names empty slots and overworld mute", () => {
    assert.match(emptySpellSlotLabel(3), /Empty slot 3/);
    assert.match(emptySpellSlotLabel(3), /open Book to equip/);
    assert.match(
      spellSlotTitle({ kind: "overworld", spellName: "Slash" }),
      /fight starts/,
    );
  });

  it("names cooldown and insufficient AP", () => {
    assert.equal(
      spellSlotTitle({
        kind: "cooldown",
        spellName: "Inferno",
        turns: 2,
      }),
      "Inferno — cooling down (2 turns left)",
    );
    assert.equal(
      spellSlotTitle({
        kind: "ap",
        spellName: "Slash",
        need: 4,
        have: 2,
      }),
      "Slash — need 4 AP (have 2)",
    );
  });

  it("blocks when need exceeds have", () => {
    assert.equal(spellSlotBlockedByAp(2, 4), true);
    assert.equal(spellSlotBlockedByAp(4, 4), false);
    assert.equal(spellSlotBlockedByAp(0, 0), false);
  });
});
