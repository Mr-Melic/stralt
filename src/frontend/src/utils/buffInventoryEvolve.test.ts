import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  CANISTER_BUFF_CATALOG_COSTS,
  FRONTEND_BUFF_SHOP_COSTS,
  buffCostDrift,
  canonicalBuffItemId,
  frontendBuffItemId,
  mergeBuffInventoryAliases,
  ownedBuffStacks,
} from "./buffInventoryEvolve.ts";

describe("buff inventory id aliases (pre-rename stacks)", () => {
  it("maps greater_health_potion onto canister greater_potion without dropping the frontend key", () => {
    assert.equal(
      canonicalBuffItemId("greater_health_potion"),
      "greater_potion",
    );
    assert.equal(frontendBuffItemId("greater_potion"), "greater_health_potion");
    assert.equal(canonicalBuffItemId("health_potion"), "health_potion");
  });

  it("does not double-count after a hydrate copies the alias pair", () => {
    const localOnly = mergeBuffInventoryAliases({
      greater_health_potion: 2,
      health_potion: 1,
    });
    assert.equal(localOnly.greater_health_potion, 2);
    assert.equal(localOnly.greater_potion, 2);
    assert.equal(ownedBuffStacks(localOnly, "greater_health_potion"), 2);

    const bothKeys = mergeBuffInventoryAliases({
      greater_health_potion: 2,
      greater_potion: 2,
    });
    assert.equal(ownedBuffStacks(bothKeys, "greater_health_potion"), 2);
    assert.deepEqual(mergeBuffInventoryAliases(bothKeys), bothKeys);
  });

  it("keeps the larger stack when the pair drifted instead of summing", () => {
    const merged = mergeBuffInventoryAliases({
      greater_health_potion: 1,
      greater_potion: 3,
    });
    assert.equal(ownedBuffStacks(merged, "greater_health_potion"), 3);
    assert.equal(merged.greater_health_potion, 3);
    assert.equal(merged.greater_potion, 3);
  });
});

describe("buff cost drift (do not silently change live prices)", () => {
  it("records health_potion as the only matching paid id", () => {
    assert.deepEqual(buffCostDrift("health_potion"), {
      frontend: 50,
      canister: 50,
      drifted: false,
    });
    assert.equal(FRONTEND_BUFF_SHOP_COSTS.health_potion, 50);
    assert.equal(CANISTER_BUFF_CATALOG_COSTS.health_potion, 50);
  });

  it("greater potion shares cost 120 across the renamed id", () => {
    assert.deepEqual(buffCostDrift("greater_health_potion"), {
      frontend: 120,
      canister: 120,
      drifted: false,
    });
  });

  it("battle_elixir / swift_boots / shield_charm / fury_potion still disagree", () => {
    assert.equal(buffCostDrift("battle_elixir")?.drifted, true);
    assert.equal(buffCostDrift("swift_boots")?.drifted, true);
    assert.equal(buffCostDrift("shield_charm")?.drifted, true);
    assert.equal(buffCostDrift("fury_potion")?.drifted, true);
    assert.equal(FRONTEND_BUFF_SHOP_COSTS.battle_elixir, 80);
    assert.equal(CANISTER_BUFF_CATALOG_COSTS.battle_elixir, 200);
  });
});
