import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { combatantTurnEntryType } from "../engine/combatantStore.ts";
import {
  buffItemUseAllowedByBattlePhase,
  isSummonControlTurnEntry,
  playerTurnStartBattleAp,
  playerTurnStartBattleMp,
  shouldAllowBuffItemUse,
} from "./buffItemUseGate.ts";

describe("shouldAllowBuffItemUse", () => {
  const player = { type: "player" as const };
  const summon = { type: "summon" as const, isSummon: true, side: "player" };
  const enemy = { type: "enemy" as const };

  it("allows Use only on a live player turn-order row", () => {
    assert.equal(
      shouldAllowBuffItemUse({
        inBattle: true,
        turnEntry: player,
        deathTriggered: false,
        hp: 40,
      }),
      true,
    );
  });

  it("blocks Use during player-summon control even though battlePhase stays player", () => {
    // WorldExploration never setBattlePhase("enemy") for a player-side
    // summon — control mode would otherwise hand the turn to the AI.
    assert.equal(
      combatantTurnEntryType({ isSummon: true, side: "player" }),
      "summon",
    );
    assert.equal(isSummonControlTurnEntry(summon), true);
    assert.equal(
      buffItemUseAllowedByBattlePhase({
        inBattle: true,
        battlePhase: "player",
      }),
      true,
      "old BuffShop prop stayed true for the whole Summon's Turn banner",
    );
    assert.equal(
      shouldAllowBuffItemUse({
        inBattle: true,
        turnEntry: summon,
        hp: 40,
      }),
      false,
      "Use must follow BattleUIPanel / executeCastAttempt, not battlePhase",
    );
  });

  it("blocks Use on an enemy row and on the overworld", () => {
    assert.equal(
      shouldAllowBuffItemUse({ inBattle: true, turnEntry: enemy, hp: 40 }),
      false,
    );
    assert.equal(
      shouldAllowBuffItemUse({ inBattle: false, turnEntry: player, hp: 40 }),
      false,
    );
  });

  it("blocks Use after death so a potion cannot race persistDeathPenalty", () => {
    assert.equal(
      shouldAllowBuffItemUse({
        inBattle: true,
        turnEntry: player,
        deathTriggered: true,
        hp: 0,
      }),
      false,
    );
  });
});

describe("summon-turn elixir / boots cannot ride the next player restore", () => {
  it("player-turn start replaces leftover elixir AP", () => {
    const leftoverAfterSummonTurnElixir = 4 + 3;
    const restored = playerTurnStartBattleAp(8, 0);
    assert.equal(restored, 8);
    assert.notEqual(restored, leftoverAfterSummonTurnElixir);
  });

  it("player-turn start replaces leftover Swift Boots MP", () => {
    const leftoverAfterSummonTurnBoots = 3 + 2;
    const restored = playerTurnStartBattleMp(4, 0);
    assert.equal(restored, 4);
    assert.notEqual(restored, leftoverAfterSummonTurnBoots);
  });
});
