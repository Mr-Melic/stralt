import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  isPlayerTurnEntry,
  shouldAllowPlayerCastDuringBattleWalk,
  shouldAllowPlayerCastEntry,
} from "./playerCastGate.ts";

describe("isPlayerTurnEntry", () => {
  it("accepts only the player turn-order row", () => {
    assert.equal(isPlayerTurnEntry({ type: "player" }), true);
    assert.equal(isPlayerTurnEntry({ type: "enemy" }), false);
    assert.equal(isPlayerTurnEntry({ type: "summon" }), false);
    assert.equal(isPlayerTurnEntry(null), false);
    assert.equal(isPlayerTurnEntry(undefined), false);
    assert.equal(isPlayerTurnEntry({}), false);
  });
});

describe("shouldAllowPlayerCastEntry", () => {
  const player = { type: "player" };
  const enemy = { type: "enemy" };

  it("allows a live player turn", () => {
    assert.equal(
      shouldAllowPlayerCastEntry({
        inBattle: true,
        turnEntry: player,
        deathTriggered: false,
        hp: 40,
      }),
      true,
    );
  });

  it("blocks sprite-first / Attack Nearest on overworld wanderers", () => {
    assert.equal(
      shouldAllowPlayerCastEntry({
        inBattle: false,
        turnEntry: player,
        hp: 40,
      }),
      false,
    );
  });

  it("blocks leftover selected-spell casts during an enemy turn", () => {
    assert.equal(
      shouldAllowPlayerCastEntry({
        inBattle: true,
        turnEntry: enemy,
        hp: 40,
      }),
      false,
    );
  });

  it("blocks casts after death even if the turn row still says player", () => {
    assert.equal(
      shouldAllowPlayerCastEntry({
        inBattle: true,
        turnEntry: player,
        deathTriggered: true,
        hp: 0,
      }),
      false,
    );
    assert.equal(
      shouldAllowPlayerCastEntry({
        inBattle: true,
        turnEntry: player,
        hp: 0,
      }),
      false,
    );
  });

  it("treats a missing turn row as not the player's turn", () => {
    assert.equal(
      shouldAllowPlayerCastEntry({
        inBattle: true,
        turnEntry: undefined,
        hp: 40,
      }),
      false,
    );
  });

  it("allows a live player turn when leftover walk has finished", () => {
    assert.equal(
      shouldAllowPlayerCastEntry({
        inBattle: true,
        turnEntry: player,
        deathTriggered: false,
        hp: 40,
        isMoving: false,
      }),
      true,
    );
  });

  it("blocks Swap / Strike / Attack Nearest while leftover battle walk is stepping", () => {
    // Sequence: click a 3-tile walk (isMoving true, rAF owns movementPath)
    // then hotkey S or sprite-cast Swap before the stepper reaches the dest.
    // Expected: no AP spend, leftover path keeps exclusive position writes.
    // Actual (pre-fix): executeCastAttempt ran; Swap teleported then rAF
    // snapped the player back onto the original path and taxed leftover
    // lava / ground loot.
    assert.equal(
      shouldAllowPlayerCastEntry({
        inBattle: true,
        turnEntry: player,
        deathTriggered: false,
        hp: 40,
        isMoving: true,
      }),
      false,
    );
  });

  it("does not treat omitted isMoving as a leftover walk", () => {
    assert.equal(
      shouldAllowPlayerCastEntry({
        inBattle: true,
        turnEntry: player,
        hp: 40,
      }),
      true,
    );
  });
});

describe("shouldAllowPlayerCastDuringBattleWalk", () => {
  it("rejects only an in-flight leftover walk flag", () => {
    assert.equal(shouldAllowPlayerCastDuringBattleWalk(true), false);
    assert.equal(shouldAllowPlayerCastDuringBattleWalk(false), true);
    assert.equal(shouldAllowPlayerCastDuringBattleWalk(undefined), true);
  });
});
