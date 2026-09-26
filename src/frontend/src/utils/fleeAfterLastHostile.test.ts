import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { shouldAwardVictory } from "../engine/battleSetup.ts";
import { shouldIgnoreFleeAfterLastHostile } from "./fleeAfterLastHostile.ts";

describe("shouldIgnoreFleeAfterLastHostile", () => {
  it("blocks Flee after the last hostile dies, before recap", () => {
    // Kill last hostile. Recap and victoryPersistPending are still false
    // until the [inBattle, enemies] victory useEffect. BattleUIPanel Flee
    // is still shown because inBattle is true. window.confirm() blocks
    // that effect; confirming used to call _handlePlayerDeath.
    assert.equal(
      shouldIgnoreFleeAfterLastHostile({
        inBattle: true,
        hostilesRemaining: 0,
        battleStartIdsSize: 2,
      }),
      true,
    );
  });

  it("lets the player flee while a hostile is still alive", () => {
    assert.equal(
      shouldIgnoreFleeAfterLastHostile({
        inBattle: true,
        hostilesRemaining: 1,
        battleStartIdsSize: 2,
      }),
      false,
    );
  });

  it("lets Flee abort a 0-hostile fight that cannot award victory", () => {
    assert.equal(
      shouldIgnoreFleeAfterLastHostile({
        inBattle: true,
        hostilesRemaining: 0,
        battleStartIdsSize: 0,
      }),
      false,
      "pre-battle empty roster must not trap the player — shouldAwardVictory is also false",
    );
  });

  it("does not lock overworld once inBattle is false", () => {
    assert.equal(
      shouldIgnoreFleeAfterLastHostile({
        inBattle: false,
        hostilesRemaining: 0,
        battleStartIdsSize: 2,
      }),
      false,
    );
  });

  it("blocks Flee after handleBattleEnd armed battleEnded, even if inBattle is still true for a frame", () => {
    assert.equal(
      shouldIgnoreFleeAfterLastHostile({
        inBattle: true,
        hostilesRemaining: 0,
        battleStartIdsSize: 2,
        battleEnded: true,
      }),
      true,
    );
    assert.equal(
      shouldIgnoreFleeAfterLastHostile({
        inBattle: false,
        hostilesRemaining: 0,
        battleStartIdsSize: 2,
        battleEnded: true,
      }),
      true,
      "Flee after setInBattle(false) must not stack persistDeathPenalty on applyRewards",
    );
  });
});

describe("last-hostile Flee must not rewrite a won fight into a death penalty", () => {
  it("proves deathTriggered from Flee would skip applyRewards", () => {
    const won = {
      inBattle: true,
      deathTriggered: false,
      battleStartIdsSize: 2,
      hostilesRemaining: 0,
    };
    assert.equal(shouldAwardVictory(won), true);
    assert.equal(
      shouldIgnoreFleeAfterLastHostile({
        inBattle: won.inBattle,
        hostilesRemaining: won.hostilesRemaining,
        battleStartIdsSize: won.battleStartIdsSize,
      }),
      true,
      "Flee must no-op so deathTriggered stays false",
    );

    // Actual pre-patch: confirm() → _handlePlayerDeath sets deathTriggered.
    const afterFlee = { ...won, deathTriggered: true };
    assert.equal(
      shouldAwardVictory(afterFlee),
      false,
      "Flee after the last kill used to refuse applyRewards and persist 20/40",
    );
  });
});
