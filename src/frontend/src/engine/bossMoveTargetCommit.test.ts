import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  type BossMoveActionLike,
  type BossMoveTile,
  bossMoveTargetFromAction,
  resolveBossMoveCommit,
  sameBossMoveTile,
  wxBossMoveCommitWithoutTarget,
  wxBossMoveDroppedTarget,
} from "./bossMoveTargetCommit.ts";

const ORIGIN: BossMoveTile = { x: 6, y: 4 };
const WEST: BossMoveTile = { x: 5, y: 4 };
const SOUTH: BossMoveTile = { x: 6, y: 5 };
const PLAYER: BossMoveTile = { x: 8, y: 4 };
const PORTAL: BossMoveTile = { x: 5, y: 4 };
const TELEPORT_DEST: BossMoveTile = { x: 7, y: 4 };

function lavaTrailMove(dest: BossMoveTile): BossMoveActionLike {
  return {
    type: "move",
    targetX: dest.x,
    targetY: dest.y,
    abilityResult: {
      newBossPosition: undefined,
    },
  };
}

function shockTilesMove(dest: BossMoveTile): BossMoveActionLike {
  return {
    type: "move",
    targetX: dest.x,
    targetY: dest.y,
    abilityResult: {},
  };
}

function bareMoveToward(dest: BossMoveTile): BossMoveActionLike {
  return { type: "move", targetX: dest.x, targetY: dest.y };
}

describe("wxBossMoveCommitWithoutTarget (live leftover)", () => {
  it("Countess LAVA_TRAIL plants at origin and never rushes west", () => {
    const action = lavaTrailMove(WEST);
    const live = wxBossMoveCommitWithoutTarget({ origin: ORIGIN, action });
    assert.deepEqual(live, ORIGIN);
    assert.equal(
      wxBossMoveDroppedTarget({ origin: ORIGIN, action }),
      true,
      "live WX drops the advertised walk dest",
    );
  });

  it("Static SHOCK_TILES plants at origin and never hops south", () => {
    const action = shockTilesMove(SOUTH);
    assert.deepEqual(
      wxBossMoveCommitWithoutTarget({ origin: ORIGIN, action }),
      ORIGIN,
    );
    assert.equal(wxBossMoveDroppedTarget({ origin: ORIGIN, action }), true);
  });

  it("bare moveToward with no abilityResult stays on the origin", () => {
    const action = bareMoveToward(WEST);
    assert.deepEqual(
      wxBossMoveCommitWithoutTarget({ origin: ORIGIN, action }),
      ORIGIN,
    );
  });
});

describe("resolveBossMoveCommit", () => {
  it("Countess LAVA_TRAIL walks to targetX/Y when newBossPosition is missing", () => {
    const action = lavaTrailMove(WEST);
    const dest = resolveBossMoveCommit({ origin: ORIGIN, action });
    assert.deepEqual(dest, WEST);
    assert.equal(sameBossMoveTile(dest, ORIGIN), false);
  });

  it("Static SHOCK_TILES walks to targetX/Y", () => {
    const action = shockTilesMove(SOUTH);
    assert.deepEqual(resolveBossMoveCommit({ origin: ORIGIN, action }), SOUTH);
  });

  it("bare Pale Archbishop / Fetid Rook moveToward closes one orthogonal step", () => {
    const action = bareMoveToward(WEST);
    assert.deepEqual(resolveBossMoveCommit({ origin: ORIGIN, action }), WEST);
    assert.equal(wxBossMoveDroppedTarget({ origin: ORIGIN, action }), true);
  });

  it("TELEPORT_ADJACENT newBossPosition still wins (does not steal #763 dest)", () => {
    const action: BossMoveActionLike = {
      type: "move",
      targetX: TELEPORT_DEST.x,
      targetY: TELEPORT_DEST.y,
      abilityResult: { newBossPosition: TELEPORT_DEST },
    };
    const live = wxBossMoveCommitWithoutTarget({ origin: ORIGIN, action });
    const dest = resolveBossMoveCommit({ origin: ORIGIN, action });
    assert.deepEqual(live, TELEPORT_DEST);
    assert.deepEqual(dest, TELEPORT_DEST);
    assert.equal(wxBossMoveDroppedTarget({ origin: ORIGIN, action }), false);
  });

  it("ADVANCE newBossPosition wins over a stale targetX aimed at the player", () => {
    const action: BossMoveActionLike = {
      type: "move",
      targetX: PLAYER.x,
      targetY: PLAYER.y,
      abilityResult: { newBossPosition: WEST },
    };
    assert.deepEqual(resolveBossMoveCommit({ origin: ORIGIN, action }), WEST);
    assert.deepEqual(
      wxBossMoveCommitWithoutTarget({ origin: ORIGIN, action }),
      WEST,
    );
  });

  it("kit type:spell aim at the player stays put (unique vs #498 walk)", () => {
    const action: BossMoveActionLike = {
      type: "spell",
      targetX: PLAYER.x,
      targetY: PLAYER.y,
    };
    assert.equal(bossMoveTargetFromAction(action), null);
    assert.deepEqual(resolveBossMoveCommit({ origin: ORIGIN, action }), ORIGIN);
    assert.deepEqual(
      wxBossMoveCommitWithoutTarget({ origin: ORIGIN, action }),
      ORIGIN,
    );
    assert.equal(wxBossMoveDroppedTarget({ origin: ORIGIN, action }), false);
  });

  it("type:attack aimed at the player does not stack the boss on the player", () => {
    const action: BossMoveActionLike = {
      type: "attack",
      targetX: PLAYER.x,
      targetY: PLAYER.y,
    };
    assert.equal(bossMoveTargetFromAction(action), null);
    assert.deepEqual(resolveBossMoveCommit({ origin: ORIGIN, action }), ORIGIN);
  });

  it("type:ability COMPOUNDING_ROT with no dest stays put", () => {
    const action: BossMoveActionLike = {
      type: "ability",
      abilityResult: {},
    };
    assert.deepEqual(resolveBossMoveCommit({ origin: ORIGIN, action }), ORIGIN);
  });

  it("type:move missing targetY stays on the origin", () => {
    const action: BossMoveActionLike = { type: "move", targetX: WEST.x };
    assert.equal(bossMoveTargetFromAction(action), null);
    assert.deepEqual(resolveBossMoveCommit({ origin: ORIGIN, action }), ORIGIN);
  });

  it("type:move dest equal to origin is not a dropped leftover", () => {
    const action = bareMoveToward(ORIGIN);
    assert.deepEqual(resolveBossMoveCommit({ origin: ORIGIN, action }), ORIGIN);
    assert.equal(wxBossMoveDroppedTarget({ origin: ORIGIN, action }), false);
  });

  it("target (0,0) is a legal walk — Number(0) must not be treated as missing", () => {
    const origin = { x: 1, y: 1 };
    const action = bareMoveToward({ x: 0, y: 0 });
    assert.deepEqual(wxBossMoveCommitWithoutTarget({ origin, action }), origin);
    assert.deepEqual(resolveBossMoveCommit({ origin, action }), { x: 0, y: 0 });
    assert.equal(wxBossMoveDroppedTarget({ origin, action }), true);
  });

  it("NaN newBossPosition falls through to type:move targetX/Y", () => {
    const action: BossMoveActionLike = {
      type: "move",
      targetX: WEST.x,
      targetY: WEST.y,
      abilityResult: { newBossPosition: { x: Number.NaN, y: 4 } },
    };
    assert.deepEqual(
      wxBossMoveCommitWithoutTarget({ origin: ORIGIN, action }),
      ORIGIN,
    );
    assert.deepEqual(resolveBossMoveCommit({ origin: ORIGIN, action }), WEST);
  });

  it("does not snap a portal dest — that leftover stays #859", () => {
    const action = bareMoveToward(PORTAL);
    const dest = resolveBossMoveCommit({ origin: ORIGIN, action });
    assert.deepEqual(
      dest,
      PORTAL,
      "this helper commits the advertised dest; occupancyMoveTowardUnseal snaps it",
    );
  });
});
