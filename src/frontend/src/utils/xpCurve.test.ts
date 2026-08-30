import assert from "node:assert/strict";
import { applyXpDelta, xpForNextLevel } from "./xpCurve.ts";

assert.equal(xpForNextLevel(1), 100);
assert.equal(xpForNextLevel(2), 200);
assert.equal(xpForNextLevel(3), 400);
assert.equal(xpForNextLevel(4), 800);
assert.equal(xpForNextLevel(0), 100, "level 0 clamps to the level-1 threshold");

// The buggy backend used 100 * 2^level (200 at level 1). A level-1
// character with 90 leftover + 10 portal XP must level up, not stay at
// level 1 with 100 XP.
assert.deepEqual(applyXpDelta(90, 1, 10), { newXp: 0, newLevel: 2 });

// 199 leftover at level 1 + 1 XP still levels (threshold is 100, not 200).
assert.deepEqual(applyXpDelta(0, 1, 100), { newXp: 0, newLevel: 2 });
assert.deepEqual(applyXpDelta(0, 1, 99), { newXp: 99, newLevel: 1 });

// Multi-level: 100 + 200 = 300 XP from a fresh level 1 reaches level 3
// with 0 leftover (100 to reach 2, 200 to reach 3).
assert.deepEqual(applyXpDelta(0, 1, 300), { newXp: 0, newLevel: 3 });

// Level 2 leftover 150 + 60 = 210; threshold 200 → level 3 with 10 leftover.
assert.deepEqual(applyXpDelta(150, 2, 60), { newXp: 10, newLevel: 3 });

// Boss-rush room-clear used to write leftover+kill XP unwrapped (480 at
// level 1). applyXpDelta must wrap before setCharacterStats or a lava
// death raiseUi + idle hydrate persists the inflated leftover.
// 80 + 400 = 480 → consume 100 then 200 → level 3 with 180 leftover.
assert.deepEqual(applyXpDelta(80, 1, 400), { newXp: 180, newLevel: 3 });

console.log("xpCurve.test: ok");
