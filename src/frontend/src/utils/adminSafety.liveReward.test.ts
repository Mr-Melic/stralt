import assert from "node:assert/strict";
import { achievementLiveRewardRejected, adBoxAt } from "./adminSafety.ts";

// Failure: raising dokaReward on a live row with unclaimed progress paid the
// new amount at claim instead of the advertised unlock reward.
assert.equal(
  achievementLiveRewardRejected({
    previousReward: 50,
    nextReward: 1_000_000,
    hasUnclaimed: true,
  }),
  "Cannot change dokaReward while unclaimed progress exists",
);
assert.equal(
  achievementLiveRewardRejected({
    previousReward: 50,
    nextReward: 50,
    hasUnclaimed: true,
  }),
  null,
);
assert.equal(
  achievementLiveRewardRejected({
    previousReward: 50,
    nextReward: 1_000_000,
    hasUnclaimed: false,
  }),
  null,
);

// Failure: genesis adBoxes is `[]`; indexing slot 0/1/2 trapped adminSetAdBox.
assert.deepEqual(adBoxAt([], 0), ["", "", false]);
assert.deepEqual(adBoxAt([], 2), ["", "", false]);
assert.deepEqual(
  adBoxAt([["https://cdn.example/a.png", "https://ok.example", true]], 0),
  ["https://cdn.example/a.png", "https://ok.example", true],
);
assert.deepEqual(
  adBoxAt([["https://cdn.example/a.png", "https://ok.example", true]], 1),
  ["", "", false],
);
