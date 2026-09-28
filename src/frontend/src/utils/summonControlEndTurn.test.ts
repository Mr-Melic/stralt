import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { shouldAllowSummonControlEndTurn } from "./summonControlEndTurn.ts";

describe("shouldAllowSummonControlEndTurn", () => {
  const wolf = {
    id: "summon-wolf-1",
    type: "enemy",
    isSummon: true,
    side: "player",
  };

  it("allows End Turn only while the live row is the controlled summon", () => {
    assert.equal(
      shouldAllowSummonControlEndTurn({
        inBattle: true,
        controlledSummonId: "summon-wolf-1",
        turnEntry: wolf,
      }),
      true,
    );
  });

  it("rejects a synthetic second click after the first advance committed", () => {
    assert.equal(
      shouldAllowSummonControlEndTurn({
        inBattle: true,
        controlledSummonId: "summon-wolf-1",
        turnEntry: wolf,
        alreadyCommitted: true,
      }),
      false,
    );
  });

  it("rejects after advanceTurn moved the live row to an enemy", () => {
    assert.equal(
      shouldAllowSummonControlEndTurn({
        inBattle: true,
        controlledSummonId: "summon-wolf-1",
        turnEntry: {
          id: "enemy-orc-1",
          type: "enemy",
          isSummon: false,
          side: "enemy",
        },
      }),
      false,
    );
  });

  it("rejects enemy-side summons and player rows", () => {
    assert.equal(
      shouldAllowSummonControlEndTurn({
        inBattle: true,
        controlledSummonId: "minion-1",
        turnEntry: {
          id: "minion-1",
          type: "enemy",
          isSummon: true,
          side: "enemy",
        },
      }),
      false,
    );
    assert.equal(
      shouldAllowSummonControlEndTurn({
        inBattle: true,
        controlledSummonId: "player",
        turnEntry: { id: "player", type: "player" },
      }),
      false,
    );
  });

  it("rejects out-of-battle or cleared control id", () => {
    assert.equal(
      shouldAllowSummonControlEndTurn({
        inBattle: false,
        controlledSummonId: "summon-wolf-1",
        turnEntry: wolf,
      }),
      false,
    );
    assert.equal(
      shouldAllowSummonControlEndTurn({
        inBattle: true,
        controlledSummonId: null,
        turnEntry: wolf,
      }),
      false,
    );
  });
});
