import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  saveBattleStatsApWrite,
  saveBattleStatsCanRaiseApTowardCap,
  saveBattleStatsMpWrite,
  staleSaveBattleStatsWouldCutGrownAp,
} from "./persistApMpMonotonic.ts";

describe("persistApMpMonotonic", () => {
  it("writes incoming AP/MP up to the persist cap, not min(incoming, stored)", () => {
    assert.equal(saveBattleStatsApWrite(10, 8, 1, 25), 8);
    assert.equal(saveBattleStatsMpWrite(5, 4, 1, 25), 4);
    assert.equal(
      staleSaveBattleStatsWouldCutGrownAp({
        storedGrown: 10,
        staleIncoming: 8,
        level: 1,
        threshold: 25,
      }),
      true,
    );
    assert.equal(
      saveBattleStatsCanRaiseApTowardCap({
        stored: 8,
        incoming: 9,
        level: 25,
        threshold: 25,
      }),
      true,
    );
    assert.equal(saveBattleStatsApWrite(8, 20, 1, 25), 8);
    assert.equal(saveBattleStatsApWrite(10, 20, 1, 25), 10);
  });
});
