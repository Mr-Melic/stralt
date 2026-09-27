import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  battleWalkCostPerTile,
  battleWalkMpBudget,
  battleWalkMpCost,
  canAffordBattleWalk,
  computeBattleWalkReachable,
  hoverBattleWalkMpCost,
} from "./battleWalkMp.ts";
import { mapModifierRegistry } from "./mapModifiers.ts";

const silentCtx = { log: () => {}, rng: () => 0 };

function costPerTileFor(ids: string[]): number {
  return battleWalkCostPerTile((base) =>
    mapModifierRegistry.applyMpCost(base, new Set(ids), silentCtx),
  );
}

describe("battleWalkCostPerTile", () => {
  it("is 1 with no MP modifiers and 2 under Frozen or Slime", () => {
    assert.equal(costPerTileFor([]), 1);
    assert.equal(costPerTileFor(["frozen_terrain"]), 2);
    assert.equal(costPerTileFor(["slime_flood"]), 2);
  });

  it("does not rewrite the 2× formula when both modifiers are active", () => {
    assert.equal(costPerTileFor(["slime_flood", "frozen_terrain"]), 4);
  });
});

describe("battleWalkMpCost / canAffordBattleWalk", () => {
  it("charges 1 MP/tile with no modifier", () => {
    assert.equal(battleWalkMpCost(3, 1), 3);
    assert.equal(canAffordBattleWalk(3, 3, 1), true);
    assert.equal(canAffordBattleWalk(2, 3, 1), false);
  });

  it("a 3-tile Frozen walk on 6 MP costs 6 and leaves 0", () => {
    const per = 2;
    const cost = battleWalkMpCost(3, per);
    assert.equal(cost, 6);
    assert.equal(canAffordBattleWalk(6, 3, per), true);
    assert.equal(6 - cost, 0);
  });

  it("two 2-tile Frozen walks cannot exceed a 3-tile ring on 6 MP", () => {
    const per = 2;
    const first = battleWalkMpCost(2, per);
    assert.equal(first, 4);
    const leftover = 6 - first;
    assert.equal(leftover, 2);
    assert.equal(canAffordBattleWalk(leftover, 2, per), false);
    assert.equal(canAffordBattleWalk(leftover, 1, per), true);
    assert.equal(leftover + first, 6);
  });

  it("a leftover 1-MP slice cannot walk 1 Frozen/Slime tile", () => {
    // Execute used to debit path.length. Highlight already charged 2×, so a
    // 1-MP remainder walked one more tile past the green ring.
    assert.equal(battleWalkMpCost(1, 2), 2);
    assert.equal(canAffordBattleWalk(1, 1, 2), false);
    assert.equal(canAffordBattleWalk(2, 1, 2), true);
  });
});

describe("battleWalkMpBudget", () => {
  it("uses summon MP while controlling a summon", () => {
    assert.equal(
      battleWalkMpBudget({
        playerMp: 2,
        controllingSummon: true,
        summonMp: 3,
      }),
      3,
    );
  });

  it("uses player MP when the player is walking", () => {
    assert.equal(
      battleWalkMpBudget({
        playerMp: 6,
        controllingSummon: false,
        summonMp: 3,
      }),
      6,
    );
  });

  it("does not treat missing summon MP as the player leftover", () => {
    assert.equal(
      battleWalkMpBudget({
        playerMp: 6,
        controllingSummon: true,
        summonMp: undefined,
      }),
      0,
    );
  });
});

describe("computeBattleWalkReachable highlight vs execute", () => {
  const size = 8;
  const origin = { x: 2, y: 2 };
  const blocked = new Set<string>();

  function reachable(opts: {
    mpBudget: number;
    costPerTile: number;
    occupied?: Set<string>;
    extraBlocked?: Set<string>;
  }) {
    const walls = opts.extraBlocked ?? blocked;
    return computeBattleWalkReachable({
      origin,
      mpBudget: opts.mpBudget,
      costPerTile: opts.costPerTile,
      worldGridSize: size,
      isBlocked: (x, y) => walls.has(`${x},${y}`),
      isOccupiedDest: (x, y) => opts.occupied?.has(`${x},${y}`) === true,
    });
  }

  it("omits an occupied dest from the highlight so it cannot execute", () => {
    const occupied = new Set(["4,2"]);
    const open = reachable({ mpBudget: 6, costPerTile: 1 });
    const withRat = reachable({ mpBudget: 6, costPerTile: 1, occupied });
    assert.equal(open.tiles.has("4,2"), true);
    assert.equal(withRat.tiles.has("4,2"), false);
    assert.equal(
      hoverBattleWalkMpCost(withRat.costByKey, { x: 4, y: 2 }),
      null,
    );
    assert.equal(open.costByKey.get("4,2"), 2);
    assert.equal(hoverBattleWalkMpCost(open.costByKey, { x: 4, y: 2 }), 2);
    assert.equal(battleWalkMpCost(2, 1), 2);
  });

  it("still highlights a tile behind an occupant (walk-through unchanged)", () => {
    const occupied = new Set(["3,2"]);
    const withRat = reachable({ mpBudget: 6, costPerTile: 1, occupied });
    assert.equal(withRat.tiles.has("3,2"), false);
    assert.equal(withRat.tiles.has("4,2"), true);
    assert.equal(withRat.costByKey.get("4,2"), 2);
  });

  it("hover MP equals execute debit on Frozen (2 MP/tile)", () => {
    const result = reachable({ mpBudget: 6, costPerTile: 2 });
    assert.equal(result.tiles.has("6,2"), false, "4 tiles at 2 MP = 8 > 6");
    assert.equal(result.tiles.has("5,2"), true, "3 tiles at 2 MP = 6");
    const hover = hoverBattleWalkMpCost(result.costByKey, { x: 5, y: 2 });
    assert.equal(hover, 6);
    assert.equal(battleWalkMpCost(3, 2), hover);
    assert.equal(canAffordBattleWalk(6, 3, 2), true);
    assert.equal(canAffordBattleWalk(5, 3, 2), false);
  });

  it("does not highlight a wall dest the execute path would reject", () => {
    const walls = new Set(["3,2"]);
    const result = reachable({
      mpBudget: 4,
      costPerTile: 1,
      extraBlocked: walls,
    });
    assert.equal(result.tiles.has("3,2"), false);
    assert.equal(hoverBattleWalkMpCost(result.costByKey, { x: 3, y: 2 }), null);
  });
});
