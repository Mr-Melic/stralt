import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { starterSpells } from "../data/spellData.ts";
import type { Enemy, SpellConfig } from "../types/gameTypes.ts";
import { getAoETargets } from "./castHelpers.ts";
import {
  planPlayerCastAttempt,
  playerCastAttemptResult,
} from "./playerCastPlan.ts";
import {
  playerDrainBuildsAoEList,
  playerDrainIsSingleTarget,
  shouldAbortPlayerDrainForMissingHostile,
} from "./playerDrainCast.ts";
import {
  type PlayerCastEnemy,
  type PlayerSpellContext,
  resolvePlayerCast,
} from "./spellEngine.ts";
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
    res: 0,
    sp: 0,
    chc: 0,
    level: 1,
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
    enemies?: PlayerCastEnemy[];
    playerPosition?: { x: number; y: number };
    hits?: string[];
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
    enemies,
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
    placeMark: () => {},
    getAoETargets: (spell, gridPos, targetEnemy) =>
      getAoETargets({
        spell,
        gridPos,
        targetEnemy,
        enemies: enemies as Enemy[],
        playerPosition,
        characterName: "Hero",
        characterStats: {
          level: 1,
          res: 0,
          sp: 0,
          chc: 0,
          hp: 80,
          maxHp: 100,
        },
        getEffectiveSpellRange: (n) => n,
        logBattleEntry: () => {},
      }),
    calculatePlayerDamage: (_base, _id, _enemy) => ({
      finalDamage: 10,
      breakdown: "",
    }),
    applyDamageToEnemy: (target) => {
      extras.hits?.push(target.id);
    },
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

describe("player drain occupant predicates", () => {
  it("keeps Life Drain single-target and Lifesteal Nova on the AoE list path", () => {
    const drain = byId("starter-drain");
    const nova = byId("spell-lifesteal-nova");
    const frost = byId("starter-frost");
    assert.equal(playerDrainIsSingleTarget(drain), true);
    assert.equal(playerDrainBuildsAoEList(drain), false);
    assert.equal(playerDrainIsSingleTarget(nova), false);
    assert.equal(playerDrainBuildsAoEList(nova), true);
    assert.equal(playerDrainIsSingleTarget(frost), false);
    assert.equal(
      shouldAbortPlayerDrainForMissingHostile(drain, undefined),
      true,
    );
    assert.equal(
      shouldAbortPlayerDrainForMissingHostile(drain, { id: "rat" }),
      false,
    );
    assert.equal(
      shouldAbortPlayerDrainForMissingHostile(nova, undefined),
      false,
      "empty highlighted Nova anchors must not abort before getAoETargets",
    );
    assert.equal(
      shouldAbortPlayerDrainForMissingHostile(frost, undefined),
      false,
    );
  });
});

describe("Lifesteal Nova highlight vs execute", () => {
  const tiles = floorGrid(9);
  const caster = { x: 4, y: 4 };
  const rat = unit("rat", 4, 5);
  const far = unit("far", 8, 8);
  const enemies = [rat, far];
  const nova = byId("spell-lifesteal-nova");
  const range = Number(nova.range);
  const barriers = new Map<string, number>();

  it("a highlighted empty anchor with a hostile in range is executable", () => {
    const grid = {
      tiles,
      enemies,
      worldGridSize: 9,
      effectiveRange: range,
      barrierTiles: barriers,
    };
    assert.deepEqual(collectHighlightLiveMismatches(nova, caster, grid), {
      highlightOnly: [],
      liveOnly: [],
    });
    const highlighted = computeTargetableTiles(nova, caster, grid);
    assert.equal(highlighted.has("5,4"), true, "empty adjacent area anchor");
    assert.equal(highlighted.has("4,5"), true, "hostile tile");
    assert.equal(highlighted.has("8,8"), false);

    const emptyLive = isTileCastableLive(
      nova,
      caster,
      { x: 5, y: 4 },
      enemies,
      tiles,
      range,
      barriers,
    );
    const farLive = isTileCastableLive(
      nova,
      caster,
      { x: 8, y: 8 },
      enemies,
      tiles,
      range,
      barriers,
    );
    assert.equal(shouldExecuteLiveCast(emptyLive), true);
    assert.equal(shouldExecuteLiveCast(farLive), false);

    const legalPlan = planPlayerCastAttempt({
      spell: nova,
      caster,
      tile: { x: 5, y: 4 },
      liveCombatants: enemies,
      mapTiles: tiles,
      effectiveRange: range,
      barrierTiles: barriers,
      currentAp: 6,
      baseApCost: Number(nova.apCost),
      cooldownTurnsRemaining: 0,
    });
    const illegalPlan = planPlayerCastAttempt({
      spell: nova,
      caster,
      tile: { x: 8, y: 8 },
      liveCombatants: enemies,
      mapTiles: tiles,
      effectiveRange: range,
      barrierTiles: barriers,
      currentAp: 6,
      baseApCost: Number(nova.apCost),
      cooldownTurnsRemaining: 0,
    });
    assert.equal(playerCastAttemptResult(legalPlan), "ok");
    assert.equal(playerCastAttemptResult(illegalPlan), "abort");

    const hits: string[] = [];
    const ctx = stubCtx({
      enemies: enemies as unknown as PlayerCastEnemy[],
      hits,
    });
    assert.equal(resolvePlayerCast(nova, { x: 5, y: 4 }, ctx), "cast");
    assert.equal(hits.includes("rat"), true);

    const missHits: string[] = [];
    const missCtx = stubCtx({
      enemies: enemies as unknown as PlayerCastEnemy[],
      hits: missHits,
    });
    // resolvePlayerCast does not re-check range; an occupied far tile would
    // still enter the damage loop. Empty (0,0) is outside highlight and
    // outside hitsMultiple radius of both hostiles.
    assert.equal(resolvePlayerCast(nova, { x: 0, y: 0 }, missCtx), "abort");
    assert.deepEqual(missHits, []);

    assert.deepEqual(
      pickAttackNearestTile(nova, caster, enemies, tiles, range, barriers),
      { x: 4, y: 5 },
    );
  });

  it("an empty Nova tile with nobody in hitsMultiple radius cannot resolve", () => {
    const lone = [far];
    const hits: string[] = [];
    const ctx = stubCtx({
      enemies: lone as unknown as PlayerCastEnemy[],
      hits,
    });
    assert.equal(resolvePlayerCast(nova, { x: 5, y: 4 }, ctx), "abort");
    assert.deepEqual(hits, []);
  });
});

describe("Life Drain highlight vs execute", () => {
  const tiles = floorGrid(9);
  const caster = { x: 4, y: 4 };
  const rat = unit("rat", 5, 4);
  const far = unit("far", 8, 8);
  const enemies = [rat, far];
  const drain = byId("starter-drain");
  const range = Number(drain.range);
  const barriers = new Map<string, number>();

  it("a highlighted hostile is executable; empty and far tiles cannot drain", () => {
    const grid = {
      tiles,
      enemies,
      worldGridSize: 9,
      effectiveRange: range,
      barrierTiles: barriers,
    };
    assert.deepEqual(collectHighlightLiveMismatches(drain, caster, grid), {
      highlightOnly: [],
      liveOnly: [],
    });
    const highlighted = computeTargetableTiles(drain, caster, grid);
    assert.equal(highlighted.has("5,4"), true);
    assert.equal(highlighted.has("8,8"), false);

    const legalPlan = planPlayerCastAttempt({
      spell: drain,
      caster,
      tile: { x: 5, y: 4 },
      liveCombatants: enemies,
      mapTiles: tiles,
      effectiveRange: range,
      barrierTiles: barriers,
      currentAp: 6,
      baseApCost: Number(drain.apCost),
      cooldownTurnsRemaining: 0,
    });
    const farPlan = planPlayerCastAttempt({
      spell: drain,
      caster,
      tile: { x: 8, y: 8 },
      liveCombatants: enemies,
      mapTiles: tiles,
      effectiveRange: range,
      barrierTiles: barriers,
      currentAp: 6,
      baseApCost: Number(drain.apCost),
      cooldownTurnsRemaining: 0,
    });
    assert.equal(playerCastAttemptResult(legalPlan), "ok");
    assert.equal(playerCastAttemptResult(farPlan), "abort");

    const hits: string[] = [];
    const ctx = stubCtx({
      enemies: enemies as unknown as PlayerCastEnemy[],
      hits,
    });
    assert.equal(resolvePlayerCast(drain, { x: 5, y: 4 }, ctx), "cast");
    assert.equal(hits.includes("rat"), true);

    const emptyHits: string[] = [];
    const emptyCtx = stubCtx({
      enemies: enemies as unknown as PlayerCastEnemy[],
      hits: emptyHits,
    });
    assert.equal(resolvePlayerCast(drain, { x: 4, y: 5 }, emptyCtx), "abort");
    assert.deepEqual(emptyHits, []);
  });
});
