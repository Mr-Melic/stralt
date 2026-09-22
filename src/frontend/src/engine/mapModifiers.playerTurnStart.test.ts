import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  PLAYER_TURN_START_SKIP_IDS,
  resolvePlayerTurnStartModifierVitals,
} from "./mapModifiers.ts";

const full = { hp: 100, maxHp: 100, mp: 4 };

describe("resolvePlayerTurnStartModifierVitals", () => {
  it("skips plague_zone so WX's PLAGUE_ZONE_TICK=2 stays the only player tick", () => {
    assert.equal(PLAYER_TURN_START_SKIP_IDS.has("plague_zone"), true);
    assert.deepEqual(
      resolvePlayerTurnStartModifierVitals(full, ["plague_zone"]),
      {
        ...full,
        hpDelta: 0,
        mpDelta: 0,
        healUsed: false,
      },
    );
  });

  it("leaves vitals unchanged when no turn-start modifiers are active", () => {
    assert.deepEqual(
      resolvePlayerTurnStartModifierVitals(full, [
        "slime_flood",
        "paper_windstorm",
      ]),
      {
        ...full,
        hpDelta: 0,
        mpDelta: 0,
        healUsed: false,
      },
    );
  });

  it("debits Void Rift's 3 HP turn tick onto the player row", () => {
    const next = resolvePlayerTurnStartModifierVitals(full, ["void_rift"]);
    assert.equal(next.hp, 97);
    assert.equal(next.hpDelta, -3);
    assert.equal(next.mp, 4);
    assert.equal(next.healUsed, false);
  });

  it("floors Void Rift at 0 instead of going negative", () => {
    const next = resolvePlayerTurnStartModifierVitals(
      { hp: 2, maxHp: 100, mp: 4 },
      ["void_rift"],
    );
    assert.equal(next.hp, 0);
    assert.equal(next.hpDelta, -2);
  });

  it("applies Mending Mist 5% max HP and marks healUsed", () => {
    const next = resolvePlayerTurnStartModifierVitals(full, ["mending_mist"]);
    assert.equal(next.hp, 105);
    assert.equal(next.hpDelta, 5);
    assert.equal(next.healUsed, true);
    assert.equal(next.mpDelta, 0);
  });

  it("adds Swift Winds +2 MP on top of the restored pool", () => {
    const next = resolvePlayerTurnStartModifierVitals(full, ["swift_winds"]);
    assert.equal(next.mp, 6);
    assert.equal(next.mpDelta, 2);
    assert.equal(next.hp, 100);
    assert.equal(next.healUsed, false);
  });

  it("runs Void Rift then Mending Mist in registry order", () => {
    const next = resolvePlayerTurnStartModifierVitals(full, [
      "mending_mist",
      "void_rift",
    ]);
    // void_rift (migrated) ticks −3, then mist heals floor(100 * 0.05) = 5.
    assert.equal(next.hp, 102);
    assert.equal(next.hpDelta, 2);
    assert.equal(next.healUsed, true);
  });
});
