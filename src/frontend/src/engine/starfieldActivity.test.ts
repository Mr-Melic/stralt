import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  isStarfieldPaused,
  planStarfieldLoop,
  setStarfieldPaused,
  shouldAssignStarfieldBacking,
  shouldRebuildStarfieldStars,
  starfieldPositionScale,
  subscribeStarfieldPaused,
} from "./starfieldActivity.ts";

describe("starfieldActivity", () => {
  it("notifies subscribers only when the pause flag actually flips", () => {
    setStarfieldPaused(false);
    assert.equal(isStarfieldPaused(), false);

    let flips = 0;
    const unsub = subscribeStarfieldPaused(() => {
      flips += 1;
    });

    setStarfieldPaused(true);
    setStarfieldPaused(true);
    assert.equal(isStarfieldPaused(), true);
    assert.equal(flips, 1);

    setStarfieldPaused(false);
    assert.equal(isStarfieldPaused(), false);
    assert.equal(flips, 2);

    unsub();
    setStarfieldPaused(true);
    assert.equal(flips, 2);
    setStarfieldPaused(false);
  });

  it("releases GPU while the world canvas is covering the starfield", () => {
    assert.equal(
      planStarfieldLoop({ worldPaused: true, documentHidden: false }),
      "pause_release_gpu",
    );
    assert.equal(
      planStarfieldLoop({ worldPaused: true, documentHidden: true }),
      "pause_release_gpu",
    );
  });

  it("keeps the star buffer when only the tab is hidden", () => {
    assert.equal(
      planStarfieldLoop({ worldPaused: false, documentHidden: true }),
      "pause_keep_buffer",
    );
  });

  it("runs the loop when visible and not covered by the world canvas", () => {
    assert.equal(
      planStarfieldLoop({ worldPaused: false, documentHidden: false }),
      "run",
    );
  });
});

describe("shouldAssignStarfieldBacking", () => {
  it("skips when the integer backing store already matches", () => {
    assert.equal(shouldAssignStarfieldBacking(390, 844, 390, 844), false);
    assert.equal(shouldAssignStarfieldBacking(390, 844, 390.4, 844.2), false);
  });

  it("assigns when CSS size actually changed", () => {
    assert.equal(shouldAssignStarfieldBacking(390, 844, 390, 744), true);
    assert.equal(shouldAssignStarfieldBacking(390, 844, 844, 390), true);
  });
});

describe("shouldRebuildStarfieldStars", () => {
  it("rebuilds after GPU release or an empty star list", () => {
    assert.equal(
      shouldRebuildStarfieldStars({
        prevWidth: 1,
        prevHeight: 1,
        nextWidth: 800,
        nextHeight: 600,
        starCount: 0,
      }),
      true,
    );
    assert.equal(
      shouldRebuildStarfieldStars({
        prevWidth: 800,
        prevHeight: 600,
        nextWidth: 800,
        nextHeight: 600,
        starCount: 0,
      }),
      true,
    );
  });

  it("does not rebuild on a mobile URL-bar height change", () => {
    assert.equal(
      shouldRebuildStarfieldStars({
        prevWidth: 390,
        prevHeight: 844,
        nextWidth: 390,
        nextHeight: 744,
        starCount: 280,
      }),
      false,
    );
  });

  it("does not rebuild on a same-size duplicate resize event", () => {
    assert.equal(
      shouldRebuildStarfieldStars({
        prevWidth: 1920,
        prevHeight: 1080,
        nextWidth: 1920,
        nextHeight: 1080,
        starCount: 250,
      }),
      false,
    );
  });
});

describe("starfieldPositionScale", () => {
  it("is identity when the backing store did not change", () => {
    assert.deepEqual(starfieldPositionScale(800, 600, 800, 600), {
      sx: 1,
      sy: 1,
    });
  });

  it("scales Y only for a height-only URL-bar resize", () => {
    const { sx, sy } = starfieldPositionScale(390, 844, 390, 744);
    assert.equal(sx, 1);
    assert.ok(Math.abs(sy - 744 / 844) < 1e-9);
  });
});
