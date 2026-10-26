/**
 * AFDA-2026-10-26-044 lock.
 *
 * Admin Settings persist LevelUpConfig.spellDmgGrowthPercent (default 3).
 * Live scaled damage is hardcoded +3% per spell-upgrade level and never
 * reads that field or caster level. Changing the admin input does not
 * change combat. Do not "fix" this by wiring combat here.
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { calcScaledDamage } from "../engine/combatMath.ts";

describe("AFDA-2026-10-26-044 spellDmgGrowthPercent is unused by combat", () => {
  it("hardcodes 1.03 per upgrade and ignores caster level", () => {
    assert.equal(calcScaledDamage(100, 1, 0), 100);
    assert.equal(calcScaledDamage(100, 1, 1), Math.floor(100 * 1.03));
    assert.equal(calcScaledDamage(100, 99, 1), Math.floor(100 * 1.03));
    assert.equal(calcScaledDamage(100, 1, 2), Math.floor(100 * 1.03 ** 2));
  });
});
