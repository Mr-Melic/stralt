import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buffItemHealAmount, buffItemResourceFloat } from "./itemUseFeel.ts";

describe("buffItemHealAmount", () => {
  it("matches handleUseItem 30% / 70% floors", () => {
    assert.equal(buffItemHealAmount("health_potion", 100), 30);
    assert.equal(buffItemHealAmount("greater_health_potion", 100), 70);
    assert.equal(buffItemHealAmount("health_potion", 99), 29);
    assert.equal(buffItemHealAmount("greater_health_potion", 99), 69);
  });

  it("returns null for non-heal items and floors bad maxHp", () => {
    assert.equal(buffItemHealAmount("battle_elixir", 100), null);
    assert.equal(buffItemHealAmount("swift_boots", 100), null);
    assert.equal(buffItemHealAmount("health_potion", -8), 0);
  });
});

describe("buffItemResourceFloat", () => {
  it("labels elixir, boots, shield, and fury without changing amounts", () => {
    assert.deepEqual(buffItemResourceFloat("battle_elixir"), {
      text: "+3 AP",
      color: "#60a5fa",
    });
    assert.deepEqual(buffItemResourceFloat("swift_boots"), {
      text: "+2 MP",
      color: "#34d399",
    });
    assert.deepEqual(buffItemResourceFloat("shield_charm"), {
      text: "+20 Shield",
      color: "#818cf8",
    });
    assert.deepEqual(buffItemResourceFloat("fury_potion"), {
      text: "+25% Dmg",
      color: "#f97316",
    });
    assert.equal(buffItemResourceFloat("health_potion"), null);
  });
});
