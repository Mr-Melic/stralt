import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { ActiveEffect } from "../types/gameTypes.ts";
import {
  nextBattleResourceAfterDelta,
  playerBattleResourceDelta,
} from "./playerBattleResource.ts";
import { getStatModifier, tickNonDotEffects } from "./statusEffects.ts";

describe("playerBattleResourceDelta", () => {
  it("grants Haste MP on the player pool this turn", () => {
    assert.deepEqual(
      playerBattleResourceDelta({
        targetId: "player",
        type: "buff",
        stat: "mp",
        modifier: 2,
      }),
      { ap: 0, mp: 2 },
    );
    assert.equal(nextBattleResourceAfterDelta(4, 2), 6);
  });

  it("applies Drain Courage AP on the player pool this turn", () => {
    assert.deepEqual(
      playerBattleResourceDelta({
        targetId: "player",
        type: "debuff",
        stat: "ap",
        modifier: -1,
      }),
      { ap: -1, mp: 0 },
    );
    assert.equal(nextBattleResourceAfterDelta(1, -1), 0);
    assert.equal(nextBattleResourceAfterDelta(0, -1), 0);
  });

  it("duration-1 Haste is gone after the turn-start tick so restore cannot grant MP", () => {
    const haste: ActiveEffect = {
      id: "haste-1",
      effectName: "Haste Shield",
      type: "buff",
      targetId: "player",
      stat: "mp",
      modifier: 2,
      duration: 1,
      iconEmoji: "",
      description: "",
    };
    const { remaining } = tickNonDotEffects([haste], "player");
    assert.equal(remaining.length, 0);
    assert.equal(getStatModifier("player", "mp", remaining), 0);
    assert.equal(playerBattleResourceDelta(haste).mp, 2);
  });

  it("ignores RES/DoT and non-player targets so Shield cannot mint MP", () => {
    assert.deepEqual(
      playerBattleResourceDelta({
        targetId: "player",
        type: "buff",
        stat: "res",
        modifier: 1.3,
      }),
      { ap: 0, mp: 0 },
    );
    assert.deepEqual(
      playerBattleResourceDelta({
        targetId: "player",
        type: "dot",
        stat: "mp",
        modifier: 2,
      }),
      { ap: 0, mp: 0 },
    );
    assert.deepEqual(
      playerBattleResourceDelta({
        targetId: "wolf-1",
        type: "buff",
        stat: "mp",
        modifier: 2,
      }),
      { ap: 0, mp: 0 },
    );
  });
});
