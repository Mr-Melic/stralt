import assert from "node:assert/strict";
import { shouldAwardVictory } from "./battleSetup.ts";

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

console.log("battleSetup.victory.test: ok");
