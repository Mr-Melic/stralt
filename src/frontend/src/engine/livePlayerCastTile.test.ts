import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  isPlayerCastTile,
  playerCastContextPosition,
  selfHealResolvesOnLiveTile,
} from "./livePlayerCastTile.ts";

describe("playerCastContextPosition", () => {
  it("copies the live leftover-walk tile, not the walk-start React snapshot", () => {
    const live = { x: 5, y: 8 };
    const react = { x: 8, y: 8 };
    assert.deepEqual(playerCastContextPosition(live), { x: 5, y: 8 });
    assert.notDeepEqual(playerCastContextPosition(live), react);
  });
});

describe("isPlayerCastTile", () => {
  it("matches resolvePlayerCast isPlayerTile equality", () => {
    assert.equal(isPlayerCastTile({ x: 5, y: 8 }, { x: 5, y: 8 }), true);
    assert.equal(isPlayerCastTile({ x: 5, y: 8 }, { x: 8, y: 8 }), false);
  });
});

describe("selfHealResolvesOnLiveTile", () => {
  it("leftover first RAF step: Attack Nearest heal vs walk-start context spends AP with no heal", () => {
    const leftoverFirstStep = {
      livePlayerPos: { x: 5, y: 8 },
      reactPlayerPos: { x: 8, y: 8 },
    };
    assert.equal(
      selfHealResolvesOnLiveTile({
        ...leftoverFirstStep,
        useLiveContext: false,
      }),
      false,
      "React snapshot as ctx.playerPosition must not heal the live tile",
    );
    assert.equal(
      selfHealResolvesOnLiveTile({
        ...leftoverFirstStep,
        useLiveContext: true,
      }),
      true,
      "live ref as ctx.playerPosition must heal the Attack Nearest tile",
    );
  });

  it("does not treat a Shield/self-buff click on the live tile as the stale origin", () => {
    assert.equal(
      selfHealResolvesOnLiveTile({
        livePlayerPos: { x: 4, y: 7 },
        reactPlayerPos: { x: 4, y: 6 },
        useLiveContext: true,
      }),
      true,
    );
  });
});
