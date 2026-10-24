import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  PLAYER_PAPER_WINDSTORM_MISS_CHANCE,
  paperWindstormPlayerCastMisses,
  paperWindstormSpellRange,
  paperWindstormSpellRangeCanMiss,
} from "./paperWindstormRangeMiss.ts";

describe("paperWindstormSpellRange", () => {
  it("floors number and bigint catalog ranges", () => {
    assert.equal(paperWindstormSpellRange(1), 1);
    assert.equal(paperWindstormSpellRange(4), 4);
    assert.equal(paperWindstormSpellRange(1n), 1);
    assert.equal(paperWindstormSpellRange(4n), 4);
    assert.equal(paperWindstormSpellRange(2.9), 2);
  });

  it("fail-closes missing or non-finite range as 0 (no miss band)", () => {
    assert.equal(paperWindstormSpellRange(undefined), 0);
    assert.equal(paperWindstormSpellRange(null), 0);
    assert.equal(paperWindstormSpellRange(Number.NaN), 0);
    assert.equal(paperWindstormSpellRange(Number.POSITIVE_INFINITY), 0);
    assert.equal(paperWindstormSpellRange("nope"), 0);
  });
});

describe("paperWindstormSpellRangeCanMiss", () => {
  it("does not tax Strike / melee range 1 (Motoko + enemy apply band)", () => {
    assert.equal(paperWindstormSpellRangeCanMiss(1), false);
    assert.equal(paperWindstormSpellRangeCanMiss(1n), false);
    assert.equal(paperWindstormSpellRangeCanMiss(0), false);
    assert.equal(paperWindstormSpellRangeCanMiss(0n), false);
  });

  it("allows Frost Bolt / Chain Lightning catalog range 4", () => {
    assert.equal(paperWindstormSpellRangeCanMiss(4), true);
    assert.equal(paperWindstormSpellRangeCanMiss(4n), true);
    assert.equal(paperWindstormSpellRangeCanMiss(2), true);
  });

  it("matches the live enemy `spellRange > 1` gate", () => {
    const enemyGate = (spellRange: number) => spellRange > 1;
    for (const range of [0, 1, 2, 3, 4]) {
      assert.equal(
        paperWindstormSpellRangeCanMiss(range),
        enemyGate(range),
        `range ${range}`,
      );
    }
  });
});

describe("paperWindstormPlayerCastMisses", () => {
  it("never misses Strike even when the 30% roll is guaranteed", () => {
    assert.equal(
      paperWindstormPlayerCastMisses({ spellRange: 1, roll01: 0 }),
      false,
    );
    assert.equal(
      paperWindstormPlayerCastMisses({ spellRange: 1n, roll01: 0 }),
      false,
    );
  });

  it("keeps the existing 30% player ranged roll (not enemy 50%)", () => {
    assert.equal(PLAYER_PAPER_WINDSTORM_MISS_CHANCE, 0.3);
    assert.equal(
      paperWindstormPlayerCastMisses({ spellRange: 4, roll01: 0 }),
      true,
    );
    assert.equal(
      paperWindstormPlayerCastMisses({ spellRange: 4n, roll01: 0.299 }),
      true,
    );
    assert.equal(
      paperWindstormPlayerCastMisses({ spellRange: 4, roll01: 0.3 }),
      false,
    );
    assert.equal(
      paperWindstormPlayerCastMisses({ spellRange: 4, roll01: 0.49 }),
      false,
      "must not adopt the enemy 50% band",
    );
  });

  it("does not miss when range is missing", () => {
    assert.equal(
      paperWindstormPlayerCastMisses({ spellRange: undefined, roll01: 0 }),
      false,
    );
  });
});
