import assert from "node:assert/strict";
import { achievementConditionTaken } from "./adminSafety.ts";

// Failure: official checkAndFireAchievement `.find()`s the first active row
// with a given condition. A second live first_battle_win at 1_000_000 Doka
// becomes a duplicate reward for every first win (and a raw-client faucet).
assert.equal(
  achievementConditionTaken({
    nextId: "first_blood_2",
    nextCondition: "first_battle_win",
    nextActive: true,
    existingId: "first_blood",
    existingCondition: "first_battle_win",
    existingActive: true,
  }),
  "condition is already used by another achievement",
);

// Same row may keep its condition (name / reward / active edits).
assert.equal(
  achievementConditionTaken({
    nextId: "first_blood",
    nextCondition: "first_battle_win",
    nextActive: true,
    existingId: "first_blood",
    existingCondition: "first_battle_win",
    existingActive: true,
  }),
  null,
);

// Distinct conditions may coexist.
assert.equal(
  achievementConditionTaken({
    nextId: "survivor",
    nextCondition: "survive_1hp",
    nextActive: true,
    existingId: "first_blood",
    existingCondition: "first_battle_win",
    existingActive: true,
  }),
  null,
);

// Retired rows keep claim rights but do not occupy the condition, so a
// replacement feat can be published after adminDeleteAchievementConfig.
assert.equal(
  achievementConditionTaken({
    nextId: "first_blood_v2",
    nextCondition: "first_battle_win",
    nextActive: true,
    existingId: "first_blood",
    existingCondition: "first_battle_win",
    existingActive: false,
  }),
  null,
);

// Inactive drafts may reuse a live condition (DRAFT → VALIDATE → ACTIVATE).
assert.equal(
  achievementConditionTaken({
    nextId: "first_blood_draft",
    nextCondition: "first_battle_win",
    nextActive: false,
    existingId: "first_blood",
    existingCondition: "first_battle_win",
    existingActive: true,
  }),
  null,
);
