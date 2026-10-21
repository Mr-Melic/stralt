import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  DUST_MOTE_CAP,
  type DustMote,
  clipDustMotesKeepFirst,
  clipDustMotesKeepLast,
  createSeedDustMote,
  dustMoteSeedCount,
  recycleDustMote,
  resolveDustMotesOnMapChange,
  seedDustMotes,
} from "./dustMotes.ts";

/**
 * Legacy WorldExploration seed loop copied here so the extraction cannot
 * silently change count, field order, or the random-life seed vs life=0
 * recycle split. Do not "improve" these.
 */
function legacySeed(
  mapPxW: number,
  mapPxH: number,
  rng: () => number,
): DustMote[] {
  const motes: DustMote[] = [];
  const count = Math.min(DUST_MOTE_CAP, 18 + Math.floor(rng() * 8));
  for (let i = 0; i < count; i++) {
    const maxLife = 180 + Math.floor(rng() * 120);
    motes.push({
      x: (rng() - 0.5) * mapPxW,
      y: (rng() - 0.5) * mapPxH,
      vx: (rng() - 0.5) * 0.3,
      vy: (rng() - 0.5) * 0.3,
      size: 1.5 + rng() * 1.5,
      alpha: 0,
      life: Math.floor(rng() * maxLife),
      maxLife,
    });
  }
  return motes;
}

function legacyRecycle(
  mote: DustMote,
  mapPxW: number,
  mapPxH: number,
  rng: () => number,
): void {
  mote.x = (rng() - 0.5) * mapPxW;
  mote.y = (rng() - 0.5) * mapPxH;
  mote.vx = (rng() - 0.5) * 0.3;
  mote.vy = (rng() - 0.5) * 0.3;
  mote.size = 1.5 + rng() * 1.5;
  mote.alpha = 0;
  mote.life = 0;
  mote.maxLife = 180 + Math.floor(rng() * 120);
}

function seqRng(values: number[]): () => number {
  let i = 0;
  return () => {
    const v = values[i];
    i += 1;
    if (v === undefined) throw new Error(`rng exhausted at call ${i}`);
    return v;
  };
}

function cycleRng(values: number[]): () => number {
  let i = 0;
  return () => {
    const v = values[i % values.length];
    i += 1;
    return v;
  };
}

function constantRng(value: number): () => number {
  return () => value;
}

function numberedMotes(count: number): DustMote[] {
  return Array.from({ length: count }, (_, i) => ({
    x: i,
    y: 0,
    vx: 0,
    vy: 0,
    size: 1,
    alpha: 1,
    life: i,
    maxLife: 100,
  }));
}

describe("dustMoteSeedCount", () => {
  it("is 18 when rng is 0", () => {
    assert.equal(dustMoteSeedCount(constantRng(0)), 18);
  });

  it("is 25 when rng is just below 1 (18 + floor(7.999…))", () => {
    assert.equal(dustMoteSeedCount(constantRng(0.999)), 25);
  });

  it("never exceeds DUST_MOTE_CAP even if the extra roll is huge", () => {
    // Defensive: live formula cannot produce this, but the min(cap, …) stays.
    assert.equal(
      dustMoteSeedCount(() => 100),
      DUST_MOTE_CAP,
    );
  });
});

describe("createSeedDustMote", () => {
  it("draws maxLife first, then x/y/vx/vy/size, then random life", () => {
    const mote = createSeedDustMote(
      200,
      100,
      seqRng([0.5, 1, 0, 1, 0, 0.5, 0.25]),
    );
    assert.equal(mote.maxLife, 180 + Math.floor(0.5 * 120));
    assert.equal(mote.x, (1 - 0.5) * 200);
    assert.equal(mote.y, (0 - 0.5) * 100);
    assert.equal(mote.vx, (1 - 0.5) * 0.3);
    assert.equal(mote.vy, (0 - 0.5) * 0.3);
    assert.equal(mote.size, 1.5 + 0.5 * 1.5);
    assert.equal(mote.alpha, 0);
    assert.equal(mote.life, Math.floor(0.25 * mote.maxLife));
  });
});

describe("recycleDustMote", () => {
  it("restarts life at 0 and draws maxLife last", () => {
    const mote: DustMote = {
      x: 9,
      y: 9,
      vx: 9,
      vy: 9,
      size: 9,
      alpha: 9,
      life: 9,
      maxLife: 9,
    };
    recycleDustMote(mote, 200, 100, seqRng([1, 0, 1, 0, 0.5, 0.25]));
    assert.equal(mote.x, (1 - 0.5) * 200);
    assert.equal(mote.y, (0 - 0.5) * 100);
    assert.equal(mote.vx, (1 - 0.5) * 0.3);
    assert.equal(mote.vy, (0 - 0.5) * 0.3);
    assert.equal(mote.size, 1.5 + 0.5 * 1.5);
    assert.equal(mote.alpha, 0);
    assert.equal(mote.life, 0);
    assert.equal(mote.maxLife, 180 + Math.floor(0.25 * 120));
  });

  it("matches the legacy RAF else-branch byte-for-byte on a scripted stream", () => {
    const extracted: DustMote = {
      x: 1,
      y: 2,
      vx: 3,
      vy: 4,
      size: 5,
      alpha: 6,
      life: 7,
      maxLife: 8,
    };
    const legacy: DustMote = { ...extracted };
    const draws = [0.11, 0.22, 0.33, 0.44, 0.55, 0.66];
    recycleDustMote(extracted, 80, 60, seqRng(draws));
    legacyRecycle(legacy, 80, 60, seqRng(draws));
    assert.deepEqual(extracted, legacy);
  });
});

describe("seedDustMotes", () => {
  it("matches the legacy WX loop for constant and mixed streams", () => {
    const cases: Array<() => number> = [
      constantRng(0),
      constantRng(0.5),
      constantRng(0.999),
    ];
    for (const rng of cases) {
      assert.deepEqual(seedDustMotes(160, 90, rng), legacySeed(160, 90, rng));
    }
    const mixed = [
      0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 0.05, 0.15, 0.25, 0.35, 0.45,
      0.55, 0.65, 0.75, 0.85, 0.95, 0.12, 0.23, 0.34, 0.46, 0.57, 0.68,
    ];
    assert.deepEqual(
      seedDustMotes(320, 180, cycleRng(mixed)),
      legacySeed(320, 180, cycleRng(mixed)),
    );
  });

  it("uses the count draw even when that is the only difference across motes", () => {
    // rng=0 → 18 motes. Do not skip the count draw when later fields are fixed.
    const motes = seedDustMotes(10, 10, constantRng(0));
    assert.equal(motes.length, 18);
    assert.ok(motes.every((m) => m.life === 0 && m.maxLife === 180));
  });
});

describe("cap policies", () => {
  it("keep-first (map-change) and keep-last (RAF) must stay different", () => {
    const motes = numberedMotes(42);
    const first = clipDustMotesKeepFirst(motes);
    const last = clipDustMotesKeepLast(motes);
    assert.equal(first.length, DUST_MOTE_CAP);
    assert.equal(last.length, DUST_MOTE_CAP);
    assert.equal(first[0]?.x, 0);
    assert.equal(first[39]?.x, 39);
    assert.equal(last[0]?.x, 2);
    assert.equal(last[39]?.x, 41);
    assert.notDeepEqual(first, last);
  });
});

describe("resolveDustMotesOnMapChange", () => {
  it("seeds only when the roster is empty", () => {
    const seeded = resolveDustMotesOnMapChange([], 40, 20, constantRng(0));
    assert.equal(seeded.length, 18);
    assert.deepEqual(seeded, legacySeed(40, 20, constantRng(0)));
  });

  it("does not re-seed or consume rng when motes already exist under cap", () => {
    const existing = numberedMotes(3);
    let calls = 0;
    const next = resolveDustMotesOnMapChange(existing, 40, 20, () => {
      calls += 1;
      return 0.5;
    });
    assert.equal(next, existing);
    assert.equal(calls, 0);
  });

  it("trims keep-first when already seeded over cap, and does not roll rng", () => {
    const existing = numberedMotes(45);
    let calls = 0;
    const next = resolveDustMotesOnMapChange(existing, 40, 20, () => {
      calls += 1;
      return 0.9;
    });
    assert.deepEqual(next, clipDustMotesKeepFirst(existing));
    assert.equal(next.length, DUST_MOTE_CAP);
    assert.equal(next[0]?.x, 0);
    assert.equal(calls, 0);
  });

  it("does not trim a roster that is exactly at the cap", () => {
    const existing = numberedMotes(DUST_MOTE_CAP);
    const next = resolveDustMotesOnMapChange(
      existing,
      40,
      20,
      constantRng(0.9),
    );
    assert.equal(next, existing);
  });
});
