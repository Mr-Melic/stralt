import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  shouldAbortBattleWalkOnTurnAdvance,
  shouldAllowEndTurnDuringBattleWalk,
} from "./endTurnWalkGate.ts";

describe("shouldAllowEndTurnDuringBattleWalk", () => {
  it("blocks End Turn while an in-battle MP walk is still animating", () => {
    assert.equal(
      shouldAllowEndTurnDuringBattleWalk({
        inBattle: true,
        isMoving: true,
      }),
      false,
    );
  });

  it("allows End Turn when the battle walk has finished", () => {
    assert.equal(
      shouldAllowEndTurnDuringBattleWalk({
        inBattle: true,
        isMoving: false,
      }),
      true,
    );
  });

  it("does not gate overworld walks (Flee / exploration End Turn N/A)", () => {
    assert.equal(
      shouldAllowEndTurnDuringBattleWalk({
        inBattle: false,
        isMoving: true,
      }),
      true,
    );
  });
});

describe("shouldAbortBattleWalkOnTurnAdvance", () => {
  it("marks leftover battle walks for movementGen abort on advanceTurn", () => {
    assert.equal(
      shouldAbortBattleWalkOnTurnAdvance({
        inBattle: true,
        isMoving: true,
      }),
      true,
    );
    assert.equal(
      shouldAbortBattleWalkOnTurnAdvance({
        inBattle: true,
        isMoving: false,
      }),
      false,
    );
    assert.equal(
      shouldAbortBattleWalkOnTurnAdvance({
        inBattle: false,
        isMoving: true,
      }),
      false,
    );
  });
});
