import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  HEAD_UPDATE_SESSION_BLOOD_CAP,
  HEAD_UPDATE_SESSION_SHRINE_CAP,
  headRejectsShrineCountAboveCap,
  localShrineCounterIsUnbounded,
  officialUiCallsUpdateSessionState,
  shouldRejectOfficialShrineCountWrite,
  silentShrineCapWouldFreezeOldSaves,
} from "./sessionStateShrineCap.ts";

describe("sessionStateShrineCap", () => {
  it("HEAD updateSessionState silently assumes a shrine/blood maximum of 100", () => {
    assert.equal(HEAD_UPDATE_SESSION_SHRINE_CAP, 100);
    assert.equal(HEAD_UPDATE_SESSION_BLOOD_CAP, 100);
    assert.equal(officialUiCallsUpdateSessionState(), false);
    assert.equal(localShrineCounterIsUnbounded(), true);
    assert.equal(headRejectsShrineCountAboveCap(100), false);
    assert.equal(headRejectsShrineCountAboveCap(101), true);
  });

  it("must not freeze a six-month shrine farmer if the API becomes the persist SoT", () => {
    assert.equal(silentShrineCapWouldFreezeOldSaves(), true);
    assert.equal(shouldRejectOfficialShrineCountWrite(101), false);
    assert.equal(shouldRejectOfficialShrineCountWrite(0), false);
  });
});
