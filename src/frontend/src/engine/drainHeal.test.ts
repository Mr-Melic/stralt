import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { cappedDrainHeal, livePlayerHpForDrainCap } from "./drainHeal.ts";

describe("livePlayerHpForDrainCap", () => {
  it("forwards the live ref HP so a stale full snapshot is not used", () => {
    const staleClosureHp = 100;
    const liveRefHp = 70;
    assert.equal(livePlayerHpForDrainCap(staleClosureHp), 100);
    assert.equal(livePlayerHpForDrainCap(liveRefHp), 70);
    assert.equal(
      cappedDrainHeal({
        maxHp: 100,
        currentHp: livePlayerHpForDrainCap(staleClosureHp),
        finalDmg: 10,
      }),
      0,
    );
    assert.equal(
      cappedDrainHeal({
        maxHp: 100,
        currentHp: livePlayerHpForDrainCap(liveRefHp),
        finalDmg: 10,
      }),
      5,
    );
  });

  it("floors non-finite HP to 0", () => {
    assert.equal(livePlayerHpForDrainCap(Number.NaN), 0);
    assert.equal(livePlayerHpForDrainCap(-3), 0);
  });
});

describe("cappedDrainHeal", () => {
  it("restores half damage against missing HP (starter Life Drain 10→5)", () => {
    assert.equal(
      cappedDrainHeal({ maxHp: 100, currentHp: 80, finalDmg: 10 }),
      5,
    );
  });

  it("caps at missing HP so a near-full player is not overhealed", () => {
    assert.equal(
      cappedDrainHeal({
        maxHp: 100,
        currentHp: 98,
        finalDmg: 10,
        drainPercent: 0.5,
      }),
      2,
    );
  });

  it("returns 0 at full HP so a damage-only drain can still complete no-heal", () => {
    assert.equal(
      cappedDrainHeal({ maxHp: 100, currentHp: 100, finalDmg: 10 }),
      0,
    );
  });
});
