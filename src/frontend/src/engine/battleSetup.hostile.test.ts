import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  activeHostilesRemaining,
  despawnSummons,
  enemyHpAfterHazardDamage,
  isActiveHostile,
  shouldAdvanceAfterEnemyTurn,
  shouldAwardVictory,
} from "./battleSetup.ts";

describe("isActiveHostile", () => {
  it("treats enemy-side summons as hostiles that still block victory", () => {
    const leftovers = [
      { id: "wolf", hp: 40, isSummon: true, side: "player" as const },
      { id: "larva", hp: 20, isSummon: true, side: "enemy" as const },
    ];
    assert.equal(isActiveHostile(leftovers[0]), false);
    assert.equal(isActiveHostile(leftovers[1]), true);
    assert.equal(activeHostilesRemaining(leftovers), 1);
    assert.equal(
      shouldAwardVictory({
        inBattle: true,
        deathTriggered: false,
        battleStartIdsSize: 2,
        hostilesRemaining: activeHostilesRemaining(leftovers),
      }),
      false,
    );
  });

  it("does not let a living player summon block victory", () => {
    const leftovers = [
      { id: "wolf", hp: 40, isSummon: true, side: "player" as const },
    ];
    assert.equal(activeHostilesRemaining(leftovers), 0);
    assert.equal(
      shouldAwardVictory({
        inBattle: true,
        deathTriggered: false,
        battleStartIdsSize: 2,
        hostilesRemaining: 0,
      }),
      true,
    );
  });

  it("drops summons on victory cleanup so leftovers cannot re-enter the roster", () => {
    const after = despawnSummons([
      { id: "rat", hp: 0, isSummon: false },
      { id: "wolf", hp: 40, isSummon: true, side: "player" as const },
    ]);
    assert.deepEqual(
      after.map((e) => e.id),
      ["rat"],
    );
  });
});

describe("enemyHpAfterHazardDamage", () => {
  it("marks lava/spike as lethal so callers must processCombatantDeath", () => {
    assert.deepEqual(enemyHpAfterHazardDamage(10, 12), {
      newHp: 0,
      lethal: true,
    });
    assert.deepEqual(enemyHpAfterHazardDamage(20, 8), {
      newHp: 12,
      lethal: false,
    });
    assert.deepEqual(enemyHpAfterHazardDamage(0, 8), {
      newHp: 0,
      lethal: true,
    });
  });
});

describe("shouldAdvanceAfterEnemyTurn", () => {
  it("skips the next dispatch after the last hostile dies so player DoT cannot block victory", () => {
    assert.equal(
      shouldAdvanceAfterEnemyTurn({
        deathTriggered: false,
        hostilesRemaining: 0,
      }),
      false,
    );
    assert.equal(
      shouldAwardVictory({
        inBattle: true,
        deathTriggered: true,
        battleStartIdsSize: 1,
        hostilesRemaining: 0,
      }),
      false,
      "player DoT death during flushSync advanceTurn would refuse applyRewards",
    );
  });

  it("still advances when other hostiles remain and the player is alive", () => {
    assert.equal(
      shouldAdvanceAfterEnemyTurn({
        deathTriggered: false,
        hostilesRemaining: 1,
      }),
      true,
    );
  });

  it("does not dispatch after the player already died this turn", () => {
    assert.equal(
      shouldAdvanceAfterEnemyTurn({
        deathTriggered: true,
        hostilesRemaining: 1,
      }),
      false,
    );
  });
});
