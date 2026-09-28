import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { battleWalkHazardDamages } from "./battleSetup.ts";
import {
  applyBossAbilityLandingAfterCommit,
  bossAbilityHazardKindAt,
  hpAfterBossAbilityLanding,
  isSelfPlantedBossAbilityHazard,
  planBossAbilityLanding,
  rollBossAbilityLavaDamage,
  rollBossAbilitySpikeDamage,
  shouldApplyBossAbilityLandingHazard,
  wxBossAbilityCommitWithoutLanding,
} from "./bossAbilityLandingHazard.ts";

function tiles(entries: Array<[string, string]> = []): Map<string, string> {
  return new Map(entries);
}

describe("boss-ability landing rolls match enemy apply", () => {
  it("lava is 8–15 inclusive", () => {
    assert.equal(
      rollBossAbilityLavaDamage(() => 0),
      8,
    );
    assert.equal(
      rollBossAbilityLavaDamage(() => 0.999),
      15,
    );
  });

  it("spikes are 5–10 inclusive", () => {
    assert.equal(
      rollBossAbilitySpikeDamage(() => 0),
      5,
    );
    assert.equal(
      rollBossAbilitySpikeDamage(() => 0.999),
      10,
    );
  });
});

describe("planBossAbilityLanding (enemy apply contract)", () => {
  it("charges lava HP + Burning so a last-hostile boss can die in the store", () => {
    const landing = planBossAbilityLanding({
      origin: { x: 0, y: 0 },
      dest: { x: 5, y: 4 },
      hazardTiles: tiles([["5,4", "lava"]]),
      lavaDmg: 12,
    });
    assert.equal(landing.lavaDmg, 12);
    assert.equal(landing.burning, true);
    assert.equal(landing.hpLoss, 12);
    const hp = hpAfterBossAbilityLanding(10, landing);
    assert.equal(hp.newHp, 0);
    assert.equal(hp.lethal, true);
  });

  it("charges spikes without Burning", () => {
    const landing = planBossAbilityLanding({
      origin: { x: 3, y: 5 },
      dest: { x: 4, y: 5 },
      hazardTiles: tiles([["4,5", "spikes"]]),
      spikeDmg: 7,
    });
    assert.equal(landing.spikeDmg, 7);
    assert.equal(landing.burning, false);
    assert.equal(landing.frozen, false);
    assert.equal(hpAfterBossAbilityLanding(20, landing).newHp, 13);
  });

  it("applies Frozen on ice with 0 HP (status only)", () => {
    const landing = planBossAbilityLanding({
      origin: { x: 5, y: 5 },
      dest: { x: 7, y: 6 },
      hazardTiles: tiles([["7,6", "ice"]]),
    });
    assert.equal(landing.frozen, true);
    assert.equal(landing.hpLoss, 0);
    assert.equal(hpAfterBossAbilityLanding(8, landing).lethal, false);
  });

  it("does not charge Void Rift or Thorned Ground (enemy landing never did)", () => {
    const dest = { x: 5, y: 4 };
    const landing = planBossAbilityLanding({
      origin: { x: 0, y: 0 },
      dest,
      hazardTiles: tiles([["5,4", "void"]]),
    });
    assert.equal(landing.hpLoss, 0);
    assert.equal(
      battleWalkHazardDamages({
        thornedActive: true,
        pathLength: 3,
        voidRiftActive: true,
        dest,
        riftTile: dest,
      }).riftDmg,
      3,
      "player walk / Swap player dest would charge rift — boss ability must not",
    );
    assert.equal(
      bossAbilityHazardKindAt(tiles([["5,4", "void"]]), dest),
      undefined,
    );
  });

  it("skips a same-tile no-op so standing on lava is not re-taxed", () => {
    const standing = { x: 3, y: 3 };
    assert.equal(
      shouldApplyBossAbilityLandingHazard({
        origin: standing,
        dest: standing,
      }),
      false,
    );
    const landing = planBossAbilityLanding({
      origin: standing,
      dest: standing,
      hazardTiles: tiles([["3,3", "lava"]]),
      lavaDmg: 15,
    });
    assert.equal(landing.hpLoss, 0);
    assert.equal(landing.burning, false);
  });
});

describe("TELEPORT_ADJACENT dest vs WX return-before-hazard", () => {
  it("drops store HP after teleport onto lava (WX currently does not)", () => {
    // applyTeleportAdjacent dest: a tile adjacent to the player.
    const origin = { x: 0, y: 0 };
    const dest = { x: 5, y: 4 };
    const naive = wxBossAbilityCommitWithoutLanding({
      origin,
      newBossPosition: dest,
      hp: 10,
    });
    assert.equal(
      naive.hp,
      10,
      "WX writes dest and returns (~16230) — HP stays, last boss stays hostile",
    );
    const applied = applyBossAbilityLandingAfterCommit({
      origin,
      dest: naive.dest,
      hp: naive.hp,
      hazardTiles: tiles([["5,4", "lava"]]),
      lavaDmg: 12,
    });
    assert.equal(applied.newHp, 0);
    assert.equal(applied.lethal, true);
    assert.equal(applied.landing.burning, true);
  });

  it("does not tax a blocked teleport that stays on origin lava", () => {
    const origin = { x: 8, y: 8 };
    const naive = wxBossAbilityCommitWithoutLanding({
      origin,
      newBossPosition: undefined,
      hp: 9,
    });
    assert.deepEqual(naive.dest, origin);
    const applied = applyBossAbilityLandingAfterCommit({
      origin,
      dest: naive.dest,
      hp: naive.hp,
      hazardTiles: tiles([["8,8", "lava"]]),
      lavaDmg: 15,
    });
    assert.equal(applied.newHp, 9);
    assert.equal(applied.landing.hpLoss, 0);
  });
});

describe("ADVANCE_PER_TURN dest vs WX return-before-hazard", () => {
  it("taxes a one-tile Eternal Pawn step onto spikes", () => {
    // applyAdvancePerTurn: (3,5) → player (5,5) prefers horizontal (4,5).
    const origin = { x: 3, y: 5 };
    const dest = { x: 4, y: 5 };
    const naive = wxBossAbilityCommitWithoutLanding({
      origin,
      newBossPosition: dest,
      hp: 20,
    });
    assert.equal(naive.hp, 20);
    const applied = applyBossAbilityLandingAfterCommit({
      origin,
      dest: naive.dest,
      hp: naive.hp,
      hazardTiles: tiles([["4,5", "spikes"]]),
      spikeDmg: 8,
    });
    assert.equal(applied.newHp, 12);
    assert.equal(applied.landing.burning, false);
    assert.equal(applied.lethal, false);
  });
});

describe("KNIGHT_JUMP_IGNORE_WALLS dest vs WX return-before-hazard", () => {
  it("taxes an L-jump onto ice that walk never reaches through a wall", () => {
    // Closest knight dest from (5,5) to player (8,6) is (7,6). ignoreWalls
    // can land there even when (6,5)/(5,6) are walls.
    const origin = { x: 5, y: 5 };
    const dest = { x: 7, y: 6 };
    const naive = wxBossAbilityCommitWithoutLanding({
      origin,
      newBossPosition: dest,
      hp: 8,
    });
    const applied = applyBossAbilityLandingAfterCommit({
      origin,
      dest: naive.dest,
      hp: naive.hp,
      hazardTiles: tiles([["7,6", "ice"]]),
    });
    assert.equal(naive.hp, 8, "WX miss: jump dest written, HP unchanged");
    assert.equal(applied.landing.frozen, true);
    assert.equal(applied.landing.hpLoss, 0);
    assert.equal(applied.newHp, 8);
  });
});

describe("SPIKE_ON_LAND self-plant must not tax the jump dest", () => {
  it("skips spikes the ability just planted on an empty dest", () => {
    const origin = { x: 5, y: 5 };
    const dest = { x: 7, y: 6 };
    const planted = [{ x: 7, y: 6, type: "spikes" }];
    assert.equal(isSelfPlantedBossAbilityHazard(dest, planted), true);
    const afterPlant = planBossAbilityLanding({
      origin,
      dest,
      hazardTiles: tiles([["7,6", "spikes"]]),
      spikeDmg: 10,
    });
    assert.equal(
      afterPlant.hpLoss,
      10,
      "merging newHazardTiles before plan is the self-tax miss",
    );
    const preMap = applyBossAbilityLandingAfterCommit({
      origin,
      dest,
      hp: 16,
      hazardTiles: tiles(),
      plantedThisAbility: planted,
      spikeDmg: 10,
    });
    assert.equal(preMap.landing.hpLoss, 0);
    assert.equal(preMap.newHp, 16);
  });

  it("still taxes pre-existing lava when SPIKE_ON_LAND plants on that dest", () => {
    const origin = { x: 5, y: 5 };
    const dest = { x: 7, y: 6 };
    const planted = [{ x: 7, y: 6, type: "spikes" }];
    const applied = applyBossAbilityLandingAfterCommit({
      origin,
      dest,
      hp: 12,
      hazardTiles: tiles([["7,6", "lava"]]),
      plantedThisAbility: planted,
      lavaDmg: 12,
    });
    assert.equal(applied.landing.lavaDmg, 12);
    assert.equal(applied.landing.spikeDmg, 0);
    assert.equal(applied.lethal, true);
  });
});
