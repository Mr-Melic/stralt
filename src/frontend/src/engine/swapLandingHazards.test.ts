import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { VOID_RIFT_TICK } from "./battleSetup.ts";
import {
  hazardKindAt,
  planSwapLandings,
  rollLavaLandingDamage,
  rollSpikeLandingDamage,
  swapLandingChallengeHp,
  swapLandingFailsUntouchable,
} from "./swapLandingHazards.ts";

function tiles(entries: Array<[string, string]>): Map<string, string> {
  return new Map(entries);
}

describe("roll ranges match walk / enemy landing", () => {
  it("lava is 8–15 inclusive", () => {
    assert.equal(
      rollLavaLandingDamage(() => 0),
      8,
    );
    assert.equal(
      rollLavaLandingDamage(() => 0.999),
      15,
    );
  });

  it("spikes are 5–10 inclusive", () => {
    assert.equal(
      rollSpikeLandingDamage(() => 0),
      5,
    );
    assert.equal(
      rollSpikeLandingDamage(() => 0.999),
      10,
    );
  });
});

describe("planSwapLandings player dest (walk contract)", () => {
  it("charges lava HP + Burning so Untouchable cannot persist", () => {
    const plan = planSwapLandings({
      playerDest: { x: 6, y: 4 },
      enemyDest: { x: 3, y: 4 },
      hazardTiles: tiles([["6,4", "lava"]]),
      playerLavaDmg: 12,
    });
    assert.equal(plan.player.lavaDmg, 12);
    assert.equal(plan.player.burning, true);
    assert.equal(plan.player.hpLoss, 12);
    assert.equal(plan.enemy.hpLoss, 0);
    assert.equal(swapLandingFailsUntouchable(plan.player), true);
    assert.deepEqual(swapLandingChallengeHp(plan.player), {
      lavaAndSpike: 12,
      riftDmg: 0,
    });
  });

  it("charges spikes without Burning", () => {
    const plan = planSwapLandings({
      playerDest: { x: 2, y: 2 },
      enemyDest: { x: 0, y: 0 },
      hazardTiles: tiles([["2,2", "spikes"]]),
      playerSpikeDmg: 7,
    });
    assert.equal(plan.player.spikeDmg, 7);
    assert.equal(plan.player.burning, false);
    assert.equal(plan.player.frozen, false);
    assert.equal(swapLandingFailsUntouchable(plan.player), true);
  });

  it("applies Frozen on ice with 0 HP (status only)", () => {
    const plan = planSwapLandings({
      playerDest: { x: 1, y: 1 },
      enemyDest: { x: 0, y: 1 },
      hazardTiles: tiles([["1,1", "ice"]]),
    });
    assert.equal(plan.player.frozen, true);
    assert.equal(plan.player.hpLoss, 0);
    assert.equal(swapLandingFailsUntouchable(plan.player), false);
  });

  it("charges Void Rift on the player dest only", () => {
    const plan = planSwapLandings({
      playerDest: { x: 8, y: 3 },
      enemyDest: { x: 4, y: 3 },
      voidRiftActive: true,
      riftTile: { x: 8, y: 3 },
    });
    assert.equal(plan.player.riftDmg, VOID_RIFT_TICK);
    assert.equal(plan.player.hpLoss, VOID_RIFT_TICK);
    assert.equal(plan.enemy.riftDmg, 0);
    assert.equal(swapLandingFailsUntouchable(plan.player), true);
    assert.deepEqual(swapLandingChallengeHp(plan.player), {
      lavaAndSpike: 0,
      riftDmg: VOID_RIFT_TICK,
    });
  });

  it("does not charge Thorned Ground (teleport is not a walk path)", () => {
    const plan = planSwapLandings({
      playerDest: { x: 5, y: 5 },
      enemyDest: { x: 1, y: 5 },
    });
    assert.equal(plan.player.hpLoss, 0);
    assert.equal(plan.enemy.hpLoss, 0);
  });
});

describe("planSwapLandings enemy dest (AI landing contract)", () => {
  it("taxes the enemy who lands on lava, not the player on a safe tile", () => {
    const plan = planSwapLandings({
      playerDest: { x: 0, y: 0 },
      enemyDest: { x: 9, y: 9 },
      hazardTiles: tiles([["9,9", "lava"]]),
      enemyLavaDmg: 10,
    });
    assert.equal(plan.enemy.lavaDmg, 10);
    assert.equal(plan.enemy.burning, true);
    assert.equal(plan.player.hpLoss, 0);
    assert.equal(swapLandingFailsUntouchable(plan.player), false);
  });

  it("does not apply Void Rift to the enemy dest (AI landing never did)", () => {
    const plan = planSwapLandings({
      playerDest: { x: 1, y: 1 },
      enemyDest: { x: 2, y: 2 },
      voidRiftActive: true,
      riftTile: { x: 2, y: 2 },
    });
    assert.equal(plan.enemy.riftDmg, 0);
    assert.equal(plan.player.riftDmg, 0);
  });
});

describe("planSwapLandings guards", () => {
  it("skips both landings when the teleport is a same-tile no-op", () => {
    const plan = planSwapLandings({
      playerDest: { x: 4, y: 4 },
      enemyDest: { x: 4, y: 4 },
      hazardTiles: tiles([["4,4", "lava"]]),
      playerLavaDmg: 15,
      voidRiftActive: true,
      riftTile: { x: 4, y: 4 },
    });
    assert.equal(plan.player.hpLoss, 0);
    assert.equal(plan.enemy.hpLoss, 0);
  });

  it("reads only lava/ice/spikes keys from the hazard map", () => {
    assert.equal(
      hazardKindAt(tiles([["1,1", "void"]]), { x: 1, y: 1 }),
      undefined,
    );
    assert.equal(
      hazardKindAt(tiles([["1,1", "lava"]]), { x: 1, y: 1 }),
      "lava",
    );
  });
});
