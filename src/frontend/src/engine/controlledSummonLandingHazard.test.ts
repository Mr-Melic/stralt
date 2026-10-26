import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { battleWalkHazardDamages } from "./battleSetup.ts";
import {
  applyControlledSummonLandingAfterWalk,
  controlledSummonHazardKindAt,
  hpAfterControlledSummonLanding,
  planControlledSummonLanding,
  rollControlledSummonLavaDamage,
  rollControlledSummonSpikeDamage,
  shouldApplyControlledSummonLandingHazard,
} from "./controlledSummonLandingHazard.ts";
import {
  type OccupancyContext,
  collectMandatoryProgressionCells,
  occKey,
  resolveControlledSummonMoveDest,
} from "./occupancy.ts";

function tiles(entries: Array<[string, string]>): Map<string, string> {
  return new Map(entries);
}

describe("controlled-summon landing rolls match enemy apply", () => {
  it("lava is 8–15 inclusive", () => {
    assert.equal(
      rollControlledSummonLavaDamage(() => 0),
      8,
    );
    assert.equal(
      rollControlledSummonLavaDamage(() => 0.999),
      15,
    );
  });

  it("spikes are 5–10 inclusive", () => {
    assert.equal(
      rollControlledSummonSpikeDamage(() => 0),
      5,
    );
    assert.equal(
      rollControlledSummonSpikeDamage(() => 0.999),
      10,
    );
  });
});

describe("planControlledSummonLanding landed cell (enemy apply contract)", () => {
  it("charges lava HP + Burning so a last player-side summon can die in the store", () => {
    const landing = planControlledSummonLanding({
      origin: { x: 1, y: 0 },
      landed: { x: 2, y: 0 },
      hazardTiles: tiles([["2,0", "lava"]]),
      lavaDmg: 12,
    });
    assert.equal(landing.lavaDmg, 12);
    assert.equal(landing.burning, true);
    assert.equal(landing.hpLoss, 12);
    const hp = hpAfterControlledSummonLanding(10, landing);
    assert.equal(hp.newHp, 0);
    assert.equal(hp.lethal, true);
  });

  it("charges spikes without Burning", () => {
    const landing = planControlledSummonLanding({
      origin: { x: 0, y: 0 },
      landed: { x: 1, y: 0 },
      hazardTiles: tiles([["1,0", "spikes"]]),
      spikeDmg: 7,
    });
    assert.equal(landing.spikeDmg, 7);
    assert.equal(landing.burning, false);
    assert.equal(landing.frozen, false);
    assert.equal(hpAfterControlledSummonLanding(20, landing).newHp, 13);
  });

  it("applies Frozen on ice with 0 HP (status only, no MP debit here)", () => {
    const landing = planControlledSummonLanding({
      origin: { x: 0, y: 0 },
      landed: { x: 0, y: 1 },
      hazardTiles: tiles([["0,1", "ice"]]),
    });
    assert.equal(landing.frozen, true);
    assert.equal(landing.hpLoss, 0);
    assert.equal(hpAfterControlledSummonLanding(8, landing).lethal, false);
  });

  it("does not charge Void Rift or Thorned Ground (enemy landing never did)", () => {
    const landing = planControlledSummonLanding({
      origin: { x: 4, y: 4 },
      landed: { x: 5, y: 4 },
      hazardTiles: tiles([["5,4", "void"]]),
    });
    assert.equal(landing.hpLoss, 0);
    assert.equal(
      battleWalkHazardDamages({
        thornedActive: true,
        pathLength: 3,
        voidRiftActive: true,
        dest: { x: 5, y: 4 },
        riftTile: { x: 5, y: 4 },
      }).riftDmg,
      3,
      "player walk would charge rift — controlled summon must not",
    );
    assert.equal(
      controlledSummonHazardKindAt(tiles([["5,4", "void"]]), { x: 5, y: 4 }),
      undefined,
    );
  });

  it("skips a same-tile no-op so standing on lava is not re-taxed", () => {
    const standing = { x: 3, y: 3 };
    assert.equal(
      shouldApplyControlledSummonLandingHazard({
        origin: standing,
        landed: standing,
      }),
      false,
    );
    const landing = planControlledSummonLanding({
      origin: standing,
      landed: standing,
      hazardTiles: tiles([["3,3", "lava"]]),
      lavaDmg: 15,
    });
    assert.equal(landing.hpLoss, 0);
    assert.equal(landing.burning, false);
  });

  it("does not tax a rejected (occupied) click", () => {
    assert.equal(
      shouldApplyControlledSummonLandingHazard({
        origin: { x: 1, y: 0 },
        landed: null,
      }),
      false,
    );
    const landing = planControlledSummonLanding({
      origin: { x: 1, y: 0 },
      landed: null,
      hazardTiles: tiles([["2,0", "lava"]]),
      lavaDmg: 15,
    });
    assert.equal(landing.hpLoss, 0);
  });

  it("taxes the landed cell after a slide, not the clicked dest", () => {
    const requestedLava = { x: 2, y: 0 };
    const slidFloor = { x: 1, y: 1 };
    const hazards = tiles([
      ["2,0", "lava"],
      ["1,1", "ice"],
    ]);
    const destOnly = planControlledSummonLanding({
      origin: { x: 1, y: 0 },
      landed: requestedLava,
      hazardTiles: hazards,
      lavaDmg: 15,
    });
    const afterSlide = planControlledSummonLanding({
      origin: { x: 1, y: 0 },
      landed: slidFloor,
      hazardTiles: hazards,
      lavaDmg: 15,
    });
    assert.equal(
      destOnly.hpLoss,
      15,
      "taxing clicked dest is the production miss",
    );
    assert.equal(afterSlide.hpLoss, 0);
    assert.equal(afterSlide.frozen, true);
    assert.equal(afterSlide.burning, false);
  });
});

describe("applyControlledSummonLandingAfterWalk vs resolveControlledSummonMoveDest", () => {
  it("drops store HP after a control-walk wolf steps onto lava (live walk currently does not)", () => {
    const occupied = new Set<string>(["0,0"]);
    const occupancyCtx: OccupancyContext = {
      tiles: [
        [true, true, true, true],
        [true, true, true, true],
      ],
      barriers: new Set(),
      voidTiles: new Set(),
      portals: new Set(),
      isOccupied: (c) => occupied.has(`${c.x},${c.y}`),
    };
    const origin = { x: 1, y: 0 };
    const landed = resolveControlledSummonMoveDest(
      origin,
      { x: 2, y: 0 },
      occupancyCtx,
    );
    assert.deepEqual(landed, { x: 2, y: 0 });
    const naiveWxHp = 10;
    const applied = applyControlledSummonLandingAfterWalk({
      origin,
      landed,
      currentHp: naiveWxHp,
      hazardTiles: tiles([["2,0", "lava"]]),
      lavaDmg: 12,
    });
    assert.equal(
      naiveWxHp,
      10,
      "applyControlledSummonWalk still returns only a boolean — WX used to keep that HP",
    );
    assert.equal(applied.moved, true);
    assert.equal(applied.newHp, 0);
    assert.equal(applied.lethal, true);
    assert.equal(applied.landing.burning, true);
  });

  it("does not tax lava on the clicked dest when occupancy slides off it", () => {
    const walkTiles = [
      [true, true, true, true, true, true],
      [true, true, false, false, false, false],
    ];
    const voidTiles = new Set<string>();
    const portals = new Set(["5,0"]);
    const occupied = new Set<string>(["0,0", "1,1"]);
    const occupancyCtx: OccupancyContext = {
      tiles: walkTiles,
      barriers: new Set(),
      voidTiles,
      portals,
      progressStart: { x: 0, y: 0 },
      isOccupied: (c) => occupied.has(occKey(c.x, c.y)),
    };
    occupancyCtx.reserved = collectMandatoryProgressionCells(
      walkTiles,
      voidTiles,
      portals,
      { x: 0, y: 0 },
    );
    assert.equal(occupancyCtx.reserved.has("2,0"), true);
    const origin = { x: 1, y: 1 };
    const landed = resolveControlledSummonMoveDest(
      origin,
      { x: 2, y: 0 },
      occupancyCtx,
    );
    assert.ok(landed);
    assert.notEqual(
      `${landed.x},${landed.y}`,
      "2,0",
      "control walk must slide off the reserved lava dest",
    );
    const requested = applyControlledSummonLandingAfterWalk({
      origin,
      landed: { x: 2, y: 0 },
      currentHp: 10,
      hazardTiles: tiles([["2,0", "lava"]]),
      lavaDmg: 15,
    });
    const afterSlide = applyControlledSummonLandingAfterWalk({
      origin,
      landed,
      currentHp: 10,
      hazardTiles: tiles([["2,0", "lava"]]),
      lavaDmg: 15,
    });
    assert.equal(
      requested.lethal,
      true,
      "clicked dest lava is the dest-only miss",
    );
    assert.equal(afterSlide.landing.hpLoss, 0);
    assert.equal(afterSlide.newHp, 10);
    assert.equal(afterSlide.lethal, false);
  });

  it("does not tax a blocked click that stays on origin lava", () => {
    const occupied = new Set<string>(["2,0", "0,0"]);
    const occupancyCtx: OccupancyContext = {
      tiles: [
        [true, true, true],
        [true, true, true],
      ],
      barriers: new Set(),
      voidTiles: new Set(),
      portals: new Set(),
      isOccupied: (c) => occupied.has(`${c.x},${c.y}`),
    };
    const origin = { x: 1, y: 0 };
    const landed = resolveControlledSummonMoveDest(
      origin,
      { x: 2, y: 0 },
      occupancyCtx,
    );
    assert.equal(landed, null);
    const applied = applyControlledSummonLandingAfterWalk({
      origin,
      landed,
      currentHp: 9,
      hazardTiles: tiles([["1,0", "lava"]]),
      lavaDmg: 15,
    });
    assert.equal(applied.moved, false);
    assert.equal(applied.newHp, 9);
    assert.equal(applied.landing.hpLoss, 0);
  });

  it("shares the tax across mouse and touch because both call applyControlledSummonWalk", () => {
    const origin = { x: 4, y: 4 };
    const dest = { x: 5, y: 4 };
    const hazards = tiles([["5,4", "spikes"]]);
    const mouse = applyControlledSummonLandingAfterWalk({
      origin,
      landed: dest,
      currentHp: 12,
      hazardTiles: hazards,
      spikeDmg: 6,
    });
    const touch = applyControlledSummonLandingAfterWalk({
      origin,
      landed: dest,
      currentHp: 12,
      hazardTiles: hazards,
      spikeDmg: 6,
    });
    assert.deepEqual(mouse, touch);
    assert.equal(mouse.newHp, 6);
    assert.equal(mouse.landing.spikeDmg, 6);
  });
});
