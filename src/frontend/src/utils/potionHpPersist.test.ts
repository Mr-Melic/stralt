import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  nextHpAfterPotionHeal,
  shouldEnqueueAbsoluteProgressWrite,
  shouldPersistAbsoluteHpOnly,
} from "./potionHpPersist.ts";

describe("potionHpPersist", () => {
  it("persists potion HP when Doka spend is 0", () => {
    // Chronology:
    // 1. Player drinks a paid health potion (inventory −1). HP 40→70.
    // 2. persistAbsoluteProgress saw spendFromUiBalance(live, live)=0 and
    //    skipped saveBattleStats (double-click guard).
    // 3. Reload hydrates canister HP 40. The stack is already gone.
    assert.equal(
      shouldPersistAbsoluteHpOnly({ spend: 0, hpBefore: 40, hpAfter: 70 }),
      true,
    );
    assert.equal(
      shouldPersistAbsoluteHpOnly({ spend: 10, hpBefore: 40, hpAfter: 70 }),
      false,
      "Doka heals already persist through the spend path",
    );
    assert.equal(
      shouldPersistAbsoluteHpOnly({ spend: 0, hpBefore: 70, hpAfter: 70 }),
      false,
    );
    assert.equal(nextHpAfterPotionHeal(40, 100, 0.3), 70);
    assert.equal(nextHpAfterPotionHeal(90, 100, 0.3), 100);
    assert.equal(nextHpAfterPotionHeal(10, 100, 0.7), 80);

    assert.equal(
      shouldEnqueueAbsoluteProgressWrite({
        spend: 0,
        hpBefore: 40,
        hpAfter: 70,
        allowZeroSpendHp: true,
      }),
      true,
    );
    assert.equal(
      shouldEnqueueAbsoluteProgressWrite({
        spend: 0,
        hpBefore: 40,
        hpAfter: 70,
      }),
      false,
      "without allowZeroSpendHp the double-click guard still skips",
    );
    assert.equal(
      shouldEnqueueAbsoluteProgressWrite({
        spend: 10,
        hpBefore: 40,
        hpAfter: 70,
      }),
      true,
    );
  });
});
