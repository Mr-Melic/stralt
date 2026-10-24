import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  attackNearestDisabledTitle,
  resolveAttackNearestGate,
} from "./attackNearestDisabledCopy.ts";

describe("attackNearestDisabledCopy", () => {
  it("names each mid-battle gate", () => {
    assert.match(attackNearestDisabledTitle("wrong_mode"), /Attack mode/);
    assert.match(attackNearestDisabledTitle("no_spell"), /Select a spell/);
    assert.match(attackNearestDisabledTitle("ap"), /Not enough AP/);
    assert.match(attackNearestDisabledTitle("no_target"), /line of sight/i);
  });

  it("adds [S] shortcut only when ready on desktop", () => {
    assert.equal(
      attackNearestDisabledTitle("ready", { isMobile: false }),
      "Attack the nearest valid target [S]",
    );
    assert.equal(
      attackNearestDisabledTitle("ready", { isMobile: true }),
      "Attack the nearest valid target",
    );
  });

  it("resolves the first blocking flag in intent order", () => {
    assert.equal(
      resolveAttackNearestGate({
        inBattle: true,
        isPlayerTurn: true,
        attackMode: false,
        hasSpell: false,
        onCooldown: false,
        enoughAp: false,
        hasTarget: false,
      }),
      "wrong_mode",
    );
    assert.equal(
      resolveAttackNearestGate({
        inBattle: true,
        isPlayerTurn: true,
        attackMode: true,
        hasSpell: true,
        onCooldown: false,
        enoughAp: true,
        hasTarget: true,
      }),
      "ready",
    );
  });
});
