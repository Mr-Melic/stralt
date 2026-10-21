import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  type Challenge,
  type ChallengePanelProgress,
  DEFAULT_CHALLENGES,
  isChallengeCompleted,
  recordChallengeWalkHazardDamage,
  recordInBattleChallengeDamage,
} from "../utils/challengeCompletion.ts";
import { VOID_RIFT_TICK, shouldAwardVictory } from "./battleSetup.ts";
import {
  BOARD_TRANSFORM_BOSS_CENTER,
  type BoardOccupant,
  applyBoardTransformLandingsAfterCommit,
  boardHazardKindAt,
  boardTransformPlayerChallengeHp,
  boardTransformPlayerFailsUntouchable,
  buildBoardTransformPositions,
  destForBoardOccupant,
  hostilesRemainingAfterBoardTransform,
  mirrorBoardTileHorizontal,
  rollBoardTransformLavaDamage,
  rollBoardTransformSpikeDamage,
  rotateBoardTileClockwise,
  wxBoardTransformCommitWithoutOccupants,
} from "./boardTransformLandingHazard.ts";

function tiles(entries: Array<[string, string]>): Map<string, string> {
  return new Map(entries);
}

function occupant(overrides: BoardOccupant): BoardOccupant {
  return overrides;
}

function progress(
  overrides: Partial<ChallengePanelProgress> = {},
): ChallengePanelProgress {
  return {
    turnCount: 1,
    totalDamage: 0,
    healUsed: false,
    directHit: true,
    maxApUsedInTurn: 4,
    directHitAttempts: 0,
    ...overrides,
  };
}

function byId(id: string): Challenge {
  const found = DEFAULT_CHALLENGES.find((c) => c.id === id);
  assert.ok(found, `missing catalog challenge ${id}`);
  return found;
}

const player = occupant({
  id: "player",
  origin: { x: 8, y: 2 },
  hp: 10,
  role: "player",
});
const lich = occupant({
  id: "boss-lich",
  origin: { x: 4, y: 4 },
  hp: 80,
  role: "boss",
});
const pawn = occupant({
  id: "pawn-1",
  origin: { x: 2, y: 2 },
  hp: 10,
  role: "enemy",
});

describe("Chessboard Lich transform formulas", () => {
  it("rotates clockwise the same way as applyMapRotate", () => {
    assert.deepEqual(rotateBoardTileClockwise({ x: 0, y: 0 }), { x: 15, y: 0 });
    assert.deepEqual(rotateBoardTileClockwise({ x: 0, y: 1 }), { x: 14, y: 0 });
    assert.deepEqual(rotateBoardTileClockwise({ x: 8, y: 2 }), { x: 13, y: 8 });
    assert.deepEqual(rotateBoardTileClockwise({ x: 2, y: 2 }), { x: 13, y: 2 });
  });

  it("mirrors horizontally the same way as applyMirrorInvert", () => {
    assert.deepEqual(mirrorBoardTileHorizontal({ x: 0, y: 1 }), {
      x: 15,
      y: 1,
    });
    assert.deepEqual(mirrorBoardTileHorizontal({ x: 3, y: 8 }), {
      x: 12,
      y: 8,
    });
  });

  it("omits the boss from newPositions and sends them to center", () => {
    const positions = buildBoardTransformPositions({
      kind: "MAP_ROTATE",
      player: { id: player.id, origin: player.origin },
      others: [{ id: pawn.id, origin: pawn.origin }],
    });
    assert.equal(positions[lich.id], undefined);
    assert.deepEqual(positions[player.id], { x: 13, y: 8 });
    assert.deepEqual(positions[pawn.id], { x: 13, y: 2 });
    assert.deepEqual(BOARD_TRANSFORM_BOSS_CENTER, { x: 7, y: 7 });
  });
});

describe("roll ranges match walk / enemy landing", () => {
  it("lava is 8–15 inclusive", () => {
    assert.equal(
      rollBoardTransformLavaDamage(() => 0),
      8,
    );
    assert.equal(
      rollBoardTransformLavaDamage(() => 0.999),
      15,
    );
  });

  it("spikes are 5–10 inclusive", () => {
    assert.equal(
      rollBoardTransformSpikeDamage(() => 0),
      5,
    );
    assert.equal(
      rollBoardTransformSpikeDamage(() => 0.999),
      10,
    );
  });
});

describe("WX miss: only newBossPosition is committed", () => {
  it("leaves the player and last-hostile pawn on origin", () => {
    const positions = buildBoardTransformPositions({
      kind: "MAP_ROTATE",
      player: { id: player.id, origin: player.origin },
      others: [{ id: pawn.id, origin: pawn.origin }],
    });
    const miss = wxBoardTransformCommitWithoutOccupants({
      occupants: [player, lich, pawn],
      newBossPosition: BOARD_TRANSFORM_BOSS_CENTER,
    });
    const playerMiss = miss.find((c) => c.id === "player");
    const pawnMiss = miss.find((c) => c.id === "pawn-1");
    const bossMiss = miss.find((c) => c.id === "boss-lich");
    assert.deepEqual(playerMiss?.dest, player.origin);
    assert.deepEqual(pawnMiss?.dest, pawn.origin);
    assert.deepEqual(bossMiss?.dest, { x: 7, y: 7 });
    assert.equal(playerMiss?.hp, 10);
    assert.equal(pawnMiss?.hp, 10);
    assert.equal(playerMiss?.landing.hpLoss, 0);
    assert.notEqual(playerMiss?.dest, positions.player);
    assert.equal(
      destForBoardOccupant({
        occupant: player,
        newPositions: positions,
      }).x,
      13,
    );
  });
});

describe("MAP_ROTATE occupant landings", () => {
  it("taxes a 10 HP player who rotates onto lava 12 and fails Untouchable", () => {
    const positions = buildBoardTransformPositions({
      kind: "MAP_ROTATE",
      player: { id: player.id, origin: player.origin },
    });
    const dest = positions.player;
    const miss = wxBoardTransformCommitWithoutOccupants({
      occupants: [player, lich],
      newBossPosition: BOARD_TRANSFORM_BOSS_CENTER,
    });
    const fixed = applyBoardTransformLandingsAfterCommit({
      occupants: [player, lich],
      newBossPosition: BOARD_TRANSFORM_BOSS_CENTER,
      newPositions: positions,
      hazardTiles: tiles([[`${dest.x},${dest.y}`, "lava"]]),
      lavaDmg: 12,
    });
    const playerMiss = miss.find((c) => c.id === "player");
    const playerFix = fixed.find((c) => c.id === "player");
    assert.deepEqual(playerMiss?.dest, { x: 8, y: 2 });
    assert.equal(playerMiss?.hp, 10);
    assert.deepEqual(playerFix?.dest, { x: 13, y: 8 });
    assert.equal(playerFix?.hp, 0);
    assert.equal(playerFix?.lethal, true);
    assert.equal(playerFix?.landing.burning, true);
    assert.equal(
      boardTransformPlayerFailsUntouchable(playerFix!.landing),
      true,
    );
    const untouchable = byId("legendary_1");
    const challengeHp = boardTransformPlayerChallengeHp(playerFix!.landing);
    const total = recordInBattleChallengeDamage(
      true,
      0,
      challengeHp.lavaAndSpike,
    );
    assert.equal(total, 12);
    assert.equal(
      isChallengeCompleted(untouchable, progress({ totalDamage: total })),
      false,
    );
    assert.equal(
      isChallengeCompleted(untouchable, progress({ totalDamage: 0 })),
      true,
      "WX miss keeps Untouchable because the player never moved",
    );
  });

  it("kills the last-hostile pawn on rotated lava so victory can fire", () => {
    const positions = buildBoardTransformPositions({
      kind: "MAP_ROTATE",
      player: { id: player.id, origin: player.origin },
      others: [{ id: pawn.id, origin: pawn.origin }],
    });
    const pawnDest = positions[pawn.id];
    const miss = wxBoardTransformCommitWithoutOccupants({
      occupants: [player, pawn],
      newBossPosition: BOARD_TRANSFORM_BOSS_CENTER,
    });
    const fixed = applyBoardTransformLandingsAfterCommit({
      occupants: [player, pawn],
      newBossPosition: BOARD_TRANSFORM_BOSS_CENTER,
      newPositions: positions,
      hazardTiles: tiles([[`${pawnDest.x},${pawnDest.y}`, "lava"]]),
      lavaDmg: 12,
    });
    const pawnMiss = miss.find((c) => c.id === "pawn-1");
    const pawnFix = fixed.find((c) => c.id === "pawn-1");
    assert.deepEqual(pawnMiss?.dest, { x: 2, y: 2 });
    assert.equal(pawnMiss?.lethal, false);
    assert.deepEqual(pawnFix?.dest, { x: 13, y: 2 });
    assert.equal(pawnFix?.hp, 0);
    assert.equal(pawnFix?.lethal, true);
    assert.equal(hostilesRemainingAfterBoardTransform(miss, 1), 1);
    assert.equal(hostilesRemainingAfterBoardTransform(fixed, 1), 0);
    assert.equal(
      shouldAwardVictory({
        inBattle: true,
        deathTriggered: false,
        battleStartIdsSize: 2,
        hostilesRemaining: hostilesRemainingAfterBoardTransform(miss, 1),
      }),
      false,
      "WX miss leaves the pawn off lava so applyRewards waits",
    );
    assert.equal(
      shouldAwardVictory({
        inBattle: true,
        deathTriggered: false,
        battleStartIdsSize: 2,
        hostilesRemaining: hostilesRemainingAfterBoardTransform(fixed, 1),
      }),
      true,
    );
  });

  it("does not award victory when the player also dies on rotated lava", () => {
    const positions = buildBoardTransformPositions({
      kind: "MAP_ROTATE",
      player: { id: player.id, origin: player.origin },
      others: [{ id: pawn.id, origin: pawn.origin }],
    });
    const playerDest = positions.player;
    const pawnDest = positions[pawn.id];
    const fixed = applyBoardTransformLandingsAfterCommit({
      occupants: [player, pawn],
      newBossPosition: BOARD_TRANSFORM_BOSS_CENTER,
      newPositions: positions,
      hazardTiles: tiles([
        [`${playerDest.x},${playerDest.y}`, "lava"],
        [`${pawnDest.x},${pawnDest.y}`, "lava"],
      ]),
      lavaDmg: 12,
    });
    const playerFix = fixed.find((c) => c.id === "player");
    assert.equal(playerFix?.lethal, true);
    assert.equal(hostilesRemainingAfterBoardTransform(fixed, 1), 0);
    assert.equal(
      shouldAwardVictory({
        inBattle: true,
        deathTriggered: playerFix?.lethal === true,
        battleStartIdsSize: 2,
        hostilesRemaining: 0,
      }),
      false,
    );
  });
});

describe("MIRROR_INVERT occupant landings", () => {
  it("applies Frozen when the player mirrors onto ice", () => {
    const mirrored = occupant({
      ...player,
      origin: { x: 3, y: 8 },
    });
    const positions = buildBoardTransformPositions({
      kind: "MIRROR_INVERT",
      player: { id: mirrored.id, origin: mirrored.origin },
    });
    const dest = positions.player;
    const miss = wxBoardTransformCommitWithoutOccupants({
      occupants: [mirrored],
      newBossPosition: BOARD_TRANSFORM_BOSS_CENTER,
    });
    const fixed = applyBoardTransformLandingsAfterCommit({
      occupants: [mirrored],
      newBossPosition: BOARD_TRANSFORM_BOSS_CENTER,
      newPositions: positions,
      hazardTiles: tiles([[`${dest.x},${dest.y}`, "ice"]]),
    });
    const playerMiss = miss.find((c) => c.id === "player");
    const playerFix = fixed.find((c) => c.id === "player");
    assert.deepEqual(playerMiss?.dest, { x: 3, y: 8 });
    assert.equal(playerMiss?.landing.frozen, false);
    assert.deepEqual(playerFix?.dest, { x: 12, y: 8 });
    assert.equal(playerFix?.landing.frozen, true);
    assert.equal(playerFix?.hp, 10);
    assert.equal(
      boardTransformPlayerFailsUntouchable(playerFix!.landing),
      false,
    );
  });

  it("charges spikes on a mirrored pawn without Burning", () => {
    const positions = buildBoardTransformPositions({
      kind: "MIRROR_INVERT",
      player: { id: player.id, origin: player.origin },
      others: [{ id: pawn.id, origin: pawn.origin }],
    });
    const pawnDest = positions[pawn.id];
    const fixed = applyBoardTransformLandingsAfterCommit({
      occupants: [pawn],
      newBossPosition: BOARD_TRANSFORM_BOSS_CENTER,
      newPositions: positions,
      hazardTiles: tiles([[`${pawnDest.x},${pawnDest.y}`, "spikes"]]),
      spikeDmg: 7,
    });
    const pawnFix = fixed.find((c) => c.id === "pawn-1");
    assert.deepEqual(pawnFix?.dest, { x: 13, y: 2 });
    assert.equal(pawnFix?.landing.spikeDmg, 7);
    assert.equal(pawnFix?.landing.burning, false);
    assert.equal(pawnFix?.hp, 3);
  });
});

describe("player dest extras vs #763 boss-only landing", () => {
  it("charges Void Rift on the player dest only", () => {
    const positions = buildBoardTransformPositions({
      kind: "MAP_ROTATE",
      player: { id: player.id, origin: player.origin },
      others: [{ id: pawn.id, origin: pawn.origin }],
    });
    const playerDest = positions.player;
    const pawnDest = positions[pawn.id];
    const fixed = applyBoardTransformLandingsAfterCommit({
      occupants: [player, pawn],
      newBossPosition: BOARD_TRANSFORM_BOSS_CENTER,
      newPositions: positions,
      voidRiftActive: true,
      riftTile: playerDest,
    });
    const playerFix = fixed.find((c) => c.id === "player");
    const pawnFix = fixed.find((c) => c.id === "pawn-1");
    assert.equal(playerFix?.landing.riftDmg, VOID_RIFT_TICK);
    assert.equal(playerFix?.hp, 7);
    assert.equal(pawnFix?.landing.riftDmg, 0);
    assert.deepEqual(boardTransformPlayerChallengeHp(playerFix!.landing), {
      lavaAndSpike: 0,
      riftDmg: VOID_RIFT_TICK,
    });
    const total = recordChallengeWalkHazardDamage(0, {
      thornDmg: 0,
      riftDmg: playerFix!.landing.riftDmg,
    });
    assert.equal(total, VOID_RIFT_TICK);
    assert.equal(
      isChallengeCompleted(
        byId("legendary_1"),
        progress({ totalDamage: total }),
      ),
      false,
    );
    const pawnOnRift = applyBoardTransformLandingsAfterCommit({
      occupants: [pawn],
      newPositions: positions,
      voidRiftActive: true,
      riftTile: pawnDest,
    });
    assert.equal(pawnOnRift[0]?.landing.riftDmg, 0);
    assert.equal(pawnOnRift[0]?.hp, 10);
  });

  it("does not charge Thorned Ground (transform is not a walk path)", () => {
    const positions = buildBoardTransformPositions({
      kind: "MAP_ROTATE",
      player: { id: player.id, origin: player.origin },
    });
    const fixed = applyBoardTransformLandingsAfterCommit({
      occupants: [player],
      newPositions: positions,
    });
    assert.equal(fixed[0]?.landing.hpLoss, 0);
    assert.equal(fixed[0]?.hp, 10);
  });
});

describe("board transform guards", () => {
  it("does not re-tax a boss already standing on center lava", () => {
    const parked = occupant({
      ...lich,
      origin: { x: 7, y: 7 },
    });
    const fixed = applyBoardTransformLandingsAfterCommit({
      occupants: [parked],
      newBossPosition: BOARD_TRANSFORM_BOSS_CENTER,
      hazardTiles: tiles([["7,7", "lava"]]),
      lavaDmg: 15,
    });
    assert.equal(fixed[0]?.moved, false);
    assert.equal(fixed[0]?.hp, 80);
    assert.equal(fixed[0]?.landing.hpLoss, 0);
  });

  it("reads only lava/ice/spikes keys from the hazard map", () => {
    assert.equal(
      boardHazardKindAt(tiles([["1,1", "void"]]), { x: 1, y: 1 }),
      undefined,
    );
    assert.equal(
      boardHazardKindAt(tiles([["1,1", "lava"]]), { x: 1, y: 1 }),
      "lava",
    );
  });
});
