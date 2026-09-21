import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getPlayerSideTargets, resolveEnemyApMp } from "./summonHud.ts";

describe("resolveEnemyApMp", () => {
  it("shows a player-side summon's own leftover AP/MP on the initiative strip", () => {
    // spawnSummonUnit seeds currentAp/currentMp. The enemy-level formula
    // (level / floor(level/2)) made a 2-AP Archer look like it still had
    // 5 AP after Poison Arrow, so the strip disagreed with the control
    // panel and leftover 0-AP turns never auto-ended.
    const wolf = {
      isSummon: true,
      currentAp: 0,
      currentMp: 1,
      level: 5,
    };
    assert.deepEqual(resolveEnemyApMp(wolf, 5), { ap: 0, mp: 1 });
    assert.notDeepEqual(
      resolveEnemyApMp(wolf, 5),
      { ap: 5, mp: 2 },
      "must not substitute the enemy-level AP/MP formula for a summon",
    );
  });

  it("still derives regular enemy AP/MP from level when the record is missing fields", () => {
    assert.deepEqual(resolveEnemyApMp({ level: 6 }, 3), { ap: 6, mp: 3 });
    assert.deepEqual(resolveEnemyApMp(undefined, 4), { ap: 4, mp: 1 });
  });
});

describe("getPlayerSideTargets", () => {
  it("keeps living player-side summons for boss AI, not enemy hostiles", () => {
    const wolf = {
      id: "wolf-1",
      side: "player",
      isSummon: true,
      hp: 20,
    };
    const rat = { id: "rat-1", side: "enemy", hp: 12 };
    const hero = { id: "player", isPlayer: true, hp: 80 };
    assert.deepEqual(
      getPlayerSideTargets([wolf, rat, hero]).map((c) => c.id),
      ["wolf-1", "player"],
    );
  });
});
