import assert from "node:assert/strict";
import { achievementLastLiveRejected } from "./adminSafety.achievementLastLive.ts";

const firstBlood = { id: "first_blood", active: true };
const survivor = { id: "survivor", active: true };

// Failure: adminSetAchievementConfig(active=false) on the last live row.
assert.equal(
  achievementLastLiveRejected({
    id: "first_blood",
    nextActive: false,
    existing: [firstBlood],
  }),
  "Cannot empty the live achievement catalog",
);
assert.equal(
  achievementLastLiveRejected({
    id: "survivor",
    nextActive: false,
    existing: [{ ...firstBlood, active: false }, survivor],
  }),
  "Cannot empty the live achievement catalog",
);

// Failure: adminDeleteAchievementConfig of the last live row (nextActive=false).
assert.equal(
  achievementLastLiveRejected({
    id: "first_blood",
    nextActive: false,
    existing: [firstBlood, { ...survivor, active: false }],
  }),
  "Cannot empty the live achievement catalog",
);

// One live row may be retired while another stays live.
assert.equal(
  achievementLastLiveRejected({
    id: "first_blood",
    nextActive: false,
    existing: [firstBlood, survivor],
  }),
  null,
);

// Already-inactive rows may still be edited / hard-deleted.
assert.equal(
  achievementLastLiveRejected({
    id: "first_blood",
    nextActive: false,
    existing: [
      { ...firstBlood, active: false },
      { ...survivor, active: false },
    ],
  }),
  null,
);

// Inactive drafts may be created while a live row exists (or when empty).
assert.equal(
  achievementLastLiveRejected({
    id: "first_blood_v2",
    nextActive: false,
    existing: [firstBlood],
  }),
  null,
);
assert.equal(
  achievementLastLiveRejected({
    id: "first_blood_v2",
    nextActive: false,
    existing: [],
  }),
  null,
);

// Activating / keeping a row live is always allowed here.
assert.equal(
  achievementLastLiveRejected({
    id: "first_blood",
    nextActive: true,
    existing: [firstBlood],
  }),
  null,
);

assert.equal(
  achievementLastLiveRejected({
    id: "",
    nextActive: false,
    existing: [firstBlood],
  }),
  "Achievement id cannot be empty",
);
assert.ok(
  achievementLastLiveRejected({
    id: "x".repeat(65),
    nextActive: false,
    existing: [],
  }),
);
