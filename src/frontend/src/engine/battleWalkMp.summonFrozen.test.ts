import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  battleWalkCostPerTile,
  battleWalkMpBudget,
  battleWalkMpCost,
  canAffordBattleWalk,
} from "./battleWalkMp.ts";
import { enemyWalkCostPerTile } from "./enemyWalkMp.ts";
import { mapModifierRegistry } from "./mapModifiers.ts";

const silentCtx = { log: () => {}, rng: () => 0 };

function frozenPerTile(): number {
  return battleWalkCostPerTile((base) =>
    mapModifierRegistry.applyMpCost(
      base,
      new Set(["frozen_terrain"]),
      silentCtx,
    ),
  );
}

describe("controlled-summon Frozen leftover MP", () => {
  it("cannot spend leftover player MP or a 1-MP Frozen slice on another wolf tile", () => {
    // #313 execute charged path.length after highlight already used 2×.
    // #318 Frozen doubled AI/summon cost. Player-control walks share
    // battleWalkMpBudget (wolf MP, not leftover player MP) and the same
    // 2× tile cost as enemyWalkCostPerTile. A leftover 1-MP wolf stride
    // used to walk one more Frozen tile — or spend the player's 6 MP.
    const per = frozenPerTile();
    assert.equal(per, 2);
    assert.equal(per, enemyWalkCostPerTile({ frozenTerrain: true }));
    assert.equal(per, enemyWalkCostPerTile({ slimeFlood: true }));

    const playerMp = 6;
    let summonMp = 3;
    assert.equal(
      battleWalkMpBudget({
        playerMp,
        controllingSummon: true,
        summonMp,
      }),
      3,
      "green ring must use wolf MP, not leftover player 6",
    );

    assert.equal(canAffordBattleWalk(summonMp, 1, per), true);
    summonMp -= battleWalkMpCost(1, per);
    assert.equal(summonMp, 1);

    const leftover = battleWalkMpBudget({
      playerMp,
      controllingSummon: true,
      summonMp,
    });
    assert.equal(leftover, 1);
    assert.equal(
      canAffordBattleWalk(leftover, 1, per),
      false,
      "leftover 1 MP must not pay a 2-MP Frozen tile",
    );
    assert.equal(
      canAffordBattleWalk(playerMp, 1, per),
      true,
      "player leftover would still fund the step if the wallets mixed",
    );
  });
});
