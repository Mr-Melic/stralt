import assert from "node:assert/strict";
import {
  activeHostilesRemaining,
  despawnSummons,
  shouldAwardVictory,
} from "./battleSetup.ts";

assert.equal(
  shouldAwardVictory({
    inBattle: true,
    deathTriggered: false,
    battleStartIdsSize: 2,
    hostilesRemaining: 0,
  }),
  true,
  "live fight with no hostiles left awards victory",
);

assert.equal(
  shouldAwardVictory({
    inBattle: true,
    deathTriggered: true,
    battleStartIdsSize: 2,
    hostilesRemaining: 0,
  }),
  false,
  "player death must not award victory when the last hostile also dies",
);

assert.equal(
  shouldAwardVictory({
    inBattle: false,
    deathTriggered: false,
    battleStartIdsSize: 2,
    hostilesRemaining: 0,
  }),
  false,
  "out-of-battle leftover empty roster must not award victory",
);

assert.equal(
  shouldAwardVictory({
    inBattle: true,
    deathTriggered: false,
    battleStartIdsSize: 0,
    hostilesRemaining: 0,
  }),
  false,
  "pre-battle empty roster must not award victory",
);

assert.equal(
  shouldAwardVictory({
    inBattle: true,
    deathTriggered: false,
    battleStartIdsSize: 2,
    hostilesRemaining: 1,
  }),
  false,
  "living hostiles must not award victory",
);

const leftoverPlayerSummon = [
  { hp: 0, isSummon: false, side: "enemy" as const },
  { hp: 12, isSummon: true, side: "player" as const },
];
assert.equal(
  activeHostilesRemaining(leftoverPlayerSummon),
  0,
  "living player-side summons must not block the victory gate",
);
assert.equal(
  shouldAwardVictory({
    inBattle: true,
    deathTriggered: false,
    battleStartIdsSize: 2,
    hostilesRemaining: activeHostilesRemaining(leftoverPlayerSummon),
  }),
  true,
  "cleared hostiles with leftover player summons still award victory",
);

const livingEnemySummon = [
  { hp: 0, isSummon: false, side: "enemy" as const },
  { hp: 8, isSummon: true, side: "enemy" as const },
];
assert.equal(
  activeHostilesRemaining(livingEnemySummon),
  1,
  "enemy-side summons remain hostile and must be defeated",
);
assert.equal(
  shouldAwardVictory({
    inBattle: true,
    deathTriggered: false,
    battleStartIdsSize: 2,
    hostilesRemaining: activeHostilesRemaining(livingEnemySummon),
  }),
  false,
  "an alive enemy summon must not award victory",
);

const afterVictory = despawnSummons([
  { hp: 0, isSummon: false, id: "rat" },
  { hp: 12, isSummon: true, id: "wolf", side: "player" as const },
]);
assert.deepEqual(
  afterVictory.map((e) => e.id),
  ["rat"],
  "victory cleanup must drop summons so the board is not left occupied",
);

console.log("battleSetup.victory.test: ok");
