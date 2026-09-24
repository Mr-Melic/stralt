import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { starterSpells } from "../data/spellData.ts";
import type { Enemy, SpellConfig } from "../types/gameTypes.ts";
import {
  planPlayerCastAttempt,
  playerCastAttemptResult,
} from "./playerCastPlan.ts";
import {
  playerMarkAbortsOnCasterTile,
  playerMarkResolvesOnTile,
} from "./playerMarkCast.ts";
import { type PlayerSpellContext, resolvePlayerCast } from "./spellEngine.ts";
import {
  collectHighlightLiveMismatches,
  computeTargetableTiles,
  isTileCastableLive,
  pickAttackNearestTile,
  shouldExecuteLiveCast,
} from "./targeting.ts";

function floorGrid(size: number): Array<Array<"floor" | "wall" | "portal">> {
  return Array.from({ length: size }, () =>
    Array.from({ length: size }, () => "floor" as const),
  );
}

function unit(
  id: string,
  x: number,
  y: number,
  extras: Partial<Enemy> = {},
): Enemy {
  return {
    id,
    x,
    y,
    hp: 20,
    maxHp: 20,
    name: id,
    pieceType: "pawn",
    side: "enemy",
    ...extras,
  } as Enemy;
}

function byId(id: string): SpellConfig {
  const spell = starterSpells.find((s) => s.id === id);
  assert.ok(spell, id);
  return spell;
}

function stubCtx(
  extras: {
    enemies?: Enemy[];
    playerPosition?: { x: number; y: number };
    marks?: string[];
    logs?: string[];
  } = {},
): PlayerSpellContext {
  const playerPosition = extras.playerPosition ?? { x: 4, y: 4 };
  const enemies = extras.enemies ?? [];
  return {
    rng: () => 0.99,
    getEffectiveStat: () => 1,
    dealDamage: () => 0,
    heal: () => {},
    applyEffect: () => {},
    placeBarrier: () => {},
    spawnUnit: () => {},
    log: (msg) => {
      extras.logs?.push(msg);
    },
    isCellFree: () => true,
    getCombatantAt: () => null,
    spellFailChance: 0,
    chc: 0,
    isBloodMoon: false,
    isFuryActive: false,
    isMirrorField: false,
    isPaperWindstorm: false,
    playerPosition,
    enemies: enemies as PlayerSpellContext["enemies"],
    characterName: "Hero",
    characterStats: {
      level: 1,
      hp: 80,
      maxHp: 100,
      res: 0,
      sp: 0,
      chc: 0,
      ap: 6,
      mp: 4,
    },
    spellLevels: {},
    onHit: () => {},
    onCritHit: () => {},
    triggerVfx: () => {},
    playSound: () => {},
    consumeTimestep: () => false,
    restoreApMp: () => {},
    loseSelfHp: () => 0,
    swapPositions: () => {},
    placeMark: (cell) => {
      extras.marks?.push(`${cell.x},${cell.y}`);
    },
    getAoETargets: () => [],
    calculatePlayerDamage: () => ({ finalDamage: 0, breakdown: "" }),
    applyDamageToEnemy: () => {},
    processCombatantDeath: () => false,
    applyDamageToPlayer: () => {},
    mirrorRedirect: () => false,
    mirrorFieldReflect: () => false,
    paperWindstormMiss: () => false,
    activateMirror: () => {},
    placeBarrierTile: () => {},
    spawnPlayerSummon: () => {},
    getEffectiveSpellRange: (n) => n,
    recordSpellType: () => {},
  };
}

describe("player Mark predicates", () => {
  it("resolves off the caster tile and aborts the highlighted-illegal self tile", () => {
    const mark = byId("spell-mark");
    const strike = byId("physical_attack");
    assert.equal(playerMarkResolvesOnTile(mark, false), true);
    assert.equal(playerMarkResolvesOnTile(mark, true), false);
    assert.equal(playerMarkAbortsOnCasterTile(mark, true), true);
    assert.equal(playerMarkAbortsOnCasterTile(mark, false), false);
    assert.equal(playerMarkResolvesOnTile(strike, false), false);
    assert.equal(playerMarkAbortsOnCasterTile(strike, true), false);
  });
});

describe("Mark highlight vs execute", () => {
  const tiles = floorGrid(13);
  const caster = { x: 4, y: 4 };
  const rat = unit("rat", 4, 5);
  const far = unit("far", 12, 12);
  const corpse = unit("corpse", 5, 4, { hp: 0 });
  const enemies = [rat, far, corpse];
  const mark = byId("spell-mark");
  const range = Number(mark.range);
  const barriers = new Map<string, number>();

  it("a highlighted empty tile is executable and an illegal tile cannot execute", () => {
    const grid = {
      tiles,
      enemies,
      worldGridSize: 13,
      effectiveRange: range,
      barrierTiles: barriers,
    };
    assert.deepEqual(collectHighlightLiveMismatches(mark, caster, grid), {
      highlightOnly: [],
      liveOnly: [],
    });
    const highlighted = computeTargetableTiles(mark, caster, grid);
    assert.equal(highlighted.has("5,5"), true, "empty in-range anchor");
    assert.equal(highlighted.has("4,5"), true, "living hostile");
    assert.equal(highlighted.has("5,4"), true, "corpse tile still in range");
    assert.equal(highlighted.has("4,4"), false, "caster tile");
    assert.equal(highlighted.has("12,12"), false, "out of range");

    const emptyLive = isTileCastableLive(
      mark,
      caster,
      { x: 5, y: 5 },
      enemies,
      tiles,
      range,
      barriers,
    );
    const farLive = isTileCastableLive(
      mark,
      caster,
      { x: 12, y: 12 },
      enemies,
      tiles,
      range,
      barriers,
    );
    const selfLive = isTileCastableLive(
      mark,
      caster,
      caster,
      enemies,
      tiles,
      range,
      barriers,
    );
    assert.equal(shouldExecuteLiveCast(emptyLive), true);
    assert.equal(shouldExecuteLiveCast(farLive), false);
    assert.equal(shouldExecuteLiveCast(selfLive), false);

    const emptyPlan = planPlayerCastAttempt({
      spell: mark,
      caster,
      tile: { x: 5, y: 5 },
      liveCombatants: enemies,
      mapTiles: tiles,
      effectiveRange: range,
      barrierTiles: barriers,
      currentAp: 6,
      baseApCost: Number(mark.apCost),
      cooldownTurnsRemaining: 0,
    });
    const farPlan = planPlayerCastAttempt({
      spell: mark,
      caster,
      tile: { x: 12, y: 12 },
      liveCombatants: enemies,
      mapTiles: tiles,
      effectiveRange: range,
      barrierTiles: barriers,
      currentAp: 6,
      baseApCost: Number(mark.apCost),
      cooldownTurnsRemaining: 0,
    });
    const selfPlan = planPlayerCastAttempt({
      spell: mark,
      caster,
      tile: caster,
      liveCombatants: enemies,
      mapTiles: tiles,
      effectiveRange: range,
      barrierTiles: barriers,
      currentAp: 6,
      baseApCost: Number(mark.apCost),
      cooldownTurnsRemaining: 0,
    });
    assert.equal(playerCastAttemptResult(emptyPlan), "ok");
    assert.equal(playerCastAttemptResult(farPlan), "abort");
    assert.equal(playerCastAttemptResult(selfPlan), "abort");

    const emptyMarks: string[] = [];
    const emptyCtx = stubCtx({ enemies, marks: emptyMarks });
    assert.equal(resolvePlayerCast(mark, { x: 5, y: 5 }, emptyCtx), "cast");
    assert.deepEqual(emptyMarks, ["5,5"]);

    const corpseMarks: string[] = [];
    const corpseCtx = stubCtx({ enemies, marks: corpseMarks });
    assert.equal(resolvePlayerCast(mark, { x: 5, y: 4 }, corpseCtx), "cast");
    assert.deepEqual(corpseMarks, ["5,4"]);

    const hostileMarks: string[] = [];
    const hostileCtx = stubCtx({ enemies, marks: hostileMarks });
    assert.equal(resolvePlayerCast(mark, { x: 4, y: 5 }, hostileCtx), "cast");
    assert.deepEqual(hostileMarks, ["4,5"]);

    const selfMarks: string[] = [];
    const selfCtx = stubCtx({ enemies, marks: selfMarks });
    assert.equal(resolvePlayerCast(mark, caster, selfCtx), "abort");
    assert.deepEqual(selfMarks, []);

    assert.deepEqual(
      pickAttackNearestTile(mark, caster, enemies, tiles, range, barriers),
      { x: 4, y: 5 },
    );
  });

  it("does not steal Strike / Barrier / Drain onto the Mark branch", () => {
    const marks: string[] = [];
    const ctx = stubCtx({ enemies: [rat], marks });
    resolvePlayerCast(byId("physical_attack"), { x: 4, y: 5 }, ctx);
    assert.deepEqual(marks, []);
    assert.equal(
      resolvePlayerCast(byId("spell-barrier"), { x: 5, y: 5 }, ctx),
      "cast",
    );
    assert.deepEqual(marks, []);
    assert.equal(
      resolvePlayerCast(byId("starter-drain"), { x: 5, y: 5 }, ctx),
      "abort",
    );
    assert.deepEqual(marks, []);
  });
});
