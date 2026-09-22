import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { completeRun, dungeonDokaMultiplierFor } from "./portalRules.ts";

describe("completeRun", () => {
  it("clears the dungeon multiplier on success so overworld kills cannot stay 1.5×–4×", () => {
    // Death → Death Realm already uses resetRunState. Boss Rush / dungeon
    // success used to skip that path (only abort the rush HUD), so
    // dungeonChainActive + depth 4 kept dungeonDokaMultiplierRef at 3 until
    // remount. The next overworld kill then persisted 3× Doka.
    let aborted = 0;
    let active = true;
    let depth = 4;
    let maxDepth = 4;
    const multiplier = { current: 3 };

    completeRun({
      bossRushActiveRef: { current: false },
      dungeonChainActiveRef: { current: true },
      dungeonChainDepthRef: { current: 4 },
      dungeonChainMaxDepthRef: { current: 4 },
      abortBossRush: async () => {
        aborted += 1;
      },
      setDungeonChainActive: (next) => {
        active = next;
      },
      setDungeonChainDepth: (next) => {
        depth = next;
      },
      setDungeonChainMaxDepth: (next) => {
        maxDepth = next;
      },
      dungeonDokaMultiplierRef: multiplier,
    });

    assert.equal(active, false);
    assert.equal(depth, 0);
    assert.equal(maxDepth, 0);
    assert.equal(multiplier.current, 1);
    assert.equal(aborted, 0, "dungeon-only complete must not abort a rush");
    assert.equal(dungeonDokaMultiplierFor(active, depth), 1);
  });

  it("aborts an active Boss Rush so the next map is free exploration", () => {
    let aborted = 0;
    const multiplier = { current: 4 };
    const refs = {
      bossRushActiveRef: { current: true },
      dungeonChainActiveRef: { current: false },
      dungeonChainDepthRef: { current: 0 },
      dungeonChainMaxDepthRef: { current: 0 },
      abortBossRush: async () => {
        aborted += 1;
      },
      dungeonDokaMultiplierRef: multiplier,
    };

    completeRun(refs);

    assert.equal(refs.bossRushActiveRef.current, false);
    assert.equal(multiplier.current, 1);
    assert.equal(aborted, 1, "final-room complete must abort the rush actor");
  });
});
