import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  characterSlotHydrateUsesJsNumber,
  jsNumberLosesIntegerPrecision,
  leftoverXpThresholdExceedsSafeIntegerAtLevel,
  lossyHydrateWouldCutSaveBattleStatsNat,
} from "./persistNatHydrateEvolve.ts";
import { xpThresholdBigInt } from "./xpCurve.ts";

describe("persistNatHydrateEvolve", () => {
  it("documents Number hydrate of Character Nats and a saveBattleStats cut", () => {
    assert.equal(characterSlotHydrateUsesJsNumber(), true);
    assert.equal(leftoverXpThresholdExceedsSafeIntegerAtLevel(), 48);
    assert.ok(xpThresholdBigInt(48) > BigInt(Number.MAX_SAFE_INTEGER));
    assert.equal(jsNumberLosesIntegerPrecision(10n), false);
    const stored = BigInt(Number.MAX_SAFE_INTEGER) + 2n;
    assert.equal(jsNumberLosesIntegerPrecision(stored), true);
    const hydrated = Number(stored);
    assert.equal(
      lossyHydrateWouldCutSaveBattleStatsNat(stored, hydrated),
      true,
    );
    assert.equal(lossyHydrateWouldCutSaveBattleStatsNat(80n, 80), false);
    assert.equal(lossyHydrateWouldCutSaveBattleStatsNat(80n, 64), true);
  });
});
