import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  battleWalkCostPerTile,
  battleWalkHoverMpPreview,
  battleWalkMpBudget,
  battleWalkMpCost,
  canAffordBattleWalk,
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

describe("battleWalkHoverMpPreview vs execute debit", () => {
  it("shows the BFS/execute cost on a highlighted tile, not Manhattan", () => {
    const destKey = "5,3";
    const reachable = new Set([destKey, "4,4"]);
    // Wall detour: Manhattan from (4,4) to (5,3) is 2; cardinal path is 4.
    const executeCost = battleWalkMpCost(4, 1);
    assert.equal(executeCost, 4);
    const preview = battleWalkHoverMpPreview({
      destKey,
      reachable,
      mpCost: executeCost,
      currentMp: 6,
    });
    assert.deepEqual(preview, { mpCost: 4, affordable: true });
    assert.notEqual(
      preview?.mpCost,
      2,
      "Manhattan hover must not under-charge a detour the click pays in full",
    );
    assert.equal(canAffordBattleWalk(6, 4, 1), true);
  });

  it("keeps Frozen hover on the 2× debit execute will take", () => {
    const destKey = "7,4";
    const reachable = new Set([destKey]);
    const executeCost = battleWalkMpCost(3, 2);
    assert.equal(executeCost, 6);
    const preview = battleWalkHoverMpPreview({
      destKey,
      reachable,
      mpCost: executeCost,
      currentMp: 6,
    });
    assert.deepEqual(preview, { mpCost: 6, affordable: true });
    const tooPoor = battleWalkHoverMpPreview({
      destKey,
      reachable,
      mpCost: executeCost,
      currentMp: 4,
    });
    assert.deepEqual(tooPoor, { mpCost: 6, affordable: false });
    assert.equal(canAffordBattleWalk(4, 3, 2), false);
  });

  it("hides cost on an illegal tile so hover cannot imply the walk is executable", () => {
    const reachable = new Set(["2,2"]);
    assert.equal(
      battleWalkHoverMpPreview({
        destKey: "8,8",
        reachable,
        mpCost: 6,
        currentMp: 6,
      }),
      null,
    );
    assert.equal(
      battleWalkHoverMpPreview({
        destKey: "2,2",
        reachable,
        mpCost: 0,
        currentMp: 6,
      }),
      null,
      "origin is highlighted as occupied-by-self, not a walk spend",
    );
  });
});
