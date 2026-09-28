import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  ownerAssetDependencyRail,
  ownerDependencyBadge,
  ownerEnemyDependencyRail,
  ownerSpellDependencyRail,
} from "./adminOwnerUx.deps.ts";

describe("ownerDependencyBadge", () => {
  it("treats zero relations as valid, not an error", () => {
    const badge = ownerDependencyBadge("spell", "enemyPools", 0);
    assert.equal(badge.count, 0);
    assert.equal(badge.countLabel, "Enemy pools — none");
    assert.equal(badge.emptyIsValid, true);
    assert.equal(badge.isError, false);
  });

  it("shows a count without implying a write", () => {
    const badge = ownerDependencyBadge("enemy", "dungeonUsage", 4);
    assert.equal(badge.countLabel, "Dungeon usage — 4");
    assert.equal(badge.isError, false);
  });
});

describe("owner dependency rails", () => {
  it("lists the spell relationship set with empty defaults", () => {
    const rail = ownerSpellDependencyRail({ bosses: 2 });
    assert.equal(rail.length, 6);
    assert.equal(rail[0]?.relation, "enemyPools");
    assert.equal(rail[0]?.countLabel, "Enemy pools — none");
    assert.equal(
      rail.find((b) => b.relation === "bosses")?.countLabel,
      "Bosses — 2",
    );
    assert.equal(
      rail.every((b) => b.isError === false && b.emptyIsValid === true),
      true,
    );
  });

  it("lists enemy and asset rails without treating missing domains as errors", () => {
    const enemy = ownerEnemyDependencyRail({ spells: 3, visualPool: 0 });
    assert.equal(enemy.length, 5);
    assert.equal(
      enemy.find((b) => b.relation === "formations")?.countLabel,
      "Formations — none",
    );
    const asset = ownerAssetDependencyRail({});
    assert.equal(asset[0]?.countLabel, "Enemy / boss usage — none");
    assert.equal(asset[0]?.isError, false);
  });
});
