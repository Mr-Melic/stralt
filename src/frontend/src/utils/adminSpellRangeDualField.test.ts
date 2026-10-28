/**
 * AFDA-2026-10-28-046 lock.
 *
 * Admin Spells persist both legacy `range` (StatRow "Range") and Candid
 * `maxRange` (Min/Max Range inputs). Player highlight / Attack Nearest use
 * `spellRangeBase` (`maxRange` wins). Enemy / summon AI use
 * `enemySpellRange` (`Number(spell.range)` only).
 *
 * Motoko `defaultSpells` already ship splits (shadow_strike range=3
 * maxRange=4). Changing one admin input does not update the other.
 * Do not restack AdminDashboard / targeting / enemyAI here.
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { enemySpellRange, spellRangeBase } from "../engine/targeting.ts";

describe("AFDA-2026-10-28-046 admin Range vs Max Range dual field", () => {
  it("player gates prefer maxRange; AI keeps Number(range)", () => {
    const motokoShadowStrike = { range: 3n, maxRange: 4 };
    assert.equal(spellRangeBase(motokoShadowStrike), 4);
    assert.equal(enemySpellRange(motokoShadowStrike), 3);
  });

  it("admin Range StatRow change is ignored by player gates when maxRange is set", () => {
    const afterRangeStatRow = { range: 6n, maxRange: 3 };
    assert.equal(spellRangeBase(afterRangeStatRow), 3);
    assert.equal(enemySpellRange(afterRangeStatRow), 6);
  });

  it("admin Max Range change is ignored by AI when range is unchanged", () => {
    const afterMaxRangeInput = { range: 3n, maxRange: 8 };
    assert.equal(spellRangeBase(afterMaxRangeInput), 8);
    assert.equal(enemySpellRange(afterMaxRangeInput), 3);
  });

  it("newSpell-like equal defaults keep player and AI on 3", () => {
    const newDraft = { range: 3n, maxRange: 3 };
    assert.equal(spellRangeBase(newDraft), 3);
    assert.equal(enemySpellRange(newDraft), 3);
  });
});
