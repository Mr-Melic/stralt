import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  LEFTOVER_XP_CURVE_ID,
  leftoverExperienceIsRemainderInCurrentLevel,
  leftoverWouldExtraLevelUnderNewThreshold,
  leftoverXpCurveMatchesApplyRewards,
} from "./leftoverXpCurvePersist.ts";
import { xpThresholdBigInt } from "./xpCurve.ts";

describe("leftoverXpCurvePersist", () => {
  it("locks leftover XP as remainder under 100 * 2^(N-1)", () => {
    assert.equal(LEFTOVER_XP_CURVE_ID, "100 * 2^(N-1)");
    assert.equal(leftoverExperienceIsRemainderInCurrentLevel(), true);
    assert.equal(leftoverXpCurveMatchesApplyRewards(), true);
    assert.equal(xpThresholdBigInt(1), 100n);
  });

  it("flags a cheaper threshold that would consume stored leftover", () => {
    assert.equal(leftoverWouldExtraLevelUnderNewThreshold(150n, 100n), true);
    assert.equal(
      leftoverWouldExtraLevelUnderNewThreshold(150n, xpThresholdBigInt(10)),
      false,
    );
    assert.equal(leftoverWouldExtraLevelUnderNewThreshold(99n, 100n), false);
  });
});
