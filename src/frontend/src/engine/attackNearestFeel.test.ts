import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  NO_TARGET_COPY,
  SWITCH_TO_ATTACK_COPY,
  attackNearestModeRejectCopy,
  shouldFloatAttackNearestNoTarget,
} from "./attackNearestFeel.ts";
import { SELECT_SPELL_COPY } from "./rejectCopy.ts";

describe("attackNearestModeRejectCopy", () => {
  it("stays quiet on the overworld", () => {
    assert.equal(
      attackNearestModeRejectCopy({
        inBattle: false,
        battleActionMode: "walk",
        hasSelectedSpell: false,
      }),
      null,
    );
  });

  it("asks to switch mode when Walk is selected", () => {
    assert.equal(
      attackNearestModeRejectCopy({
        inBattle: true,
        battleActionMode: "walk",
        hasSelectedSpell: true,
      }),
      SWITCH_TO_ATTACK_COPY,
    );
    assert.equal(SWITCH_TO_ATTACK_COPY, "Switch to Attack");
  });

  it("reuses Select a spell when Attack mode has no spell", () => {
    assert.equal(
      attackNearestModeRejectCopy({
        inBattle: true,
        battleActionMode: "attack",
        hasSelectedSpell: false,
      }),
      SELECT_SPELL_COPY,
    );
  });

  it("returns null once Attack mode has a spell (later gates own AP / turn)", () => {
    assert.equal(
      attackNearestModeRejectCopy({
        inBattle: true,
        battleActionMode: "attack",
        hasSelectedSpell: true,
      }),
      null,
    );
  });
});

describe("shouldFloatAttackNearestNoTarget", () => {
  it("floats only when the live probe found nothing", () => {
    assert.equal(shouldFloatAttackNearestNoTarget(false), true);
    assert.equal(shouldFloatAttackNearestNoTarget(true), false);
    assert.equal(NO_TARGET_COPY, "No target");
  });
});
