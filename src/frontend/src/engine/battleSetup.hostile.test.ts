import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  activeHostilesRemaining,
  despawnSummons,
  isActiveHostile,
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
