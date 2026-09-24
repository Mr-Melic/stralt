import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { hpAfterHeal, kitHealAfterBuff } from "./battleSetup.ts";

describe("kitHealAfterBuff", () => {
  it("returns Blood Mend / Rallying Cry restore that buffStat used to skip", () => {
    assert.equal(kitHealAfterBuff({ healAmount: 12 }, 0), 12);
    assert.equal(kitHealAfterBuff({ healAmount: 20 }, 0), 20);
    assert.equal(
      kitHealAfterBuff({ healAmount: 12 }, 8),
      Math.round(12 * 1.08),
    );
  });

  it("writes Wisp Blood Mend through combatant HP, not a no-op", () => {
    const amount = kitHealAfterBuff({ healAmount: 12 }, 0);
    assert.equal(hpAfterHeal(20, 42, amount), 32);
    assert.equal(hpAfterHeal(40, 42, amount), 42);
    assert.equal(kitHealAfterBuff({ healAmount: 0 }, 0), 0);
    assert.equal(kitHealAfterBuff({ healAmount: Number.NaN }, 0), 0);
  });
});
