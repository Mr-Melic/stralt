import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { starterSpells } from "../data/spellData.ts";
import type { Enemy, SpellConfig } from "../types/gameTypes.ts";
import { planPlayerCastAttempt, playerCastAttemptResult } from "./playerCastPlan.ts";
import {
  playerMirrorResolvesOnTile,
  playerShieldBuffResolves,
  playerTimestepResolvesOnTile,
} from "./playerSpecialCast.ts";
import {
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
    timestepUsed?: boolean;
    restoreCalls?: number[];
    mirrorCalls?: number[];
    effects?: Array<{ stat?: string; targetId?: string }>;
  } = {},
): PlayerSpellContext {
  let timestepUsed = extras.timestepUsed === true;
  return {
    rng: () => 0.99,
    getEffectiveStat: () => 1,
    dealDamage: () => 0,
    heal: () => {},
    applyEffect: (effect) => {
      extras.effects?.push({ stat: effect.stat, targetId: effect.targetId });
    },
    placeBarrier: () => {},
    spawnUnit: () => {},
    log: () => {},
    isCellFree: () => true,
    getCombatantAt: () => null,
    spellFailChance: 0,
    chc: 0,
    isBloodMoon: false,
    isFuryActive: false,
    isMirrorField: false,
    isPaperWindstorm: false,
    playerPosition: { x: 4, y: 4 },
    enemies: [],
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
    consumeTimestep: () => {
      if (timestepUsed) return true;
      timestepUsed = true;
      return false;
    },
    restoreApMp: () => {
      extras.restoreCalls?.push(1);
    },
    loseSelfHp: () => 0,
    swapPositions: () => {},
    placeMark: () => {},
    getAoETargets: () => [],
    calculatePlayerDamage: () => ({ finalDamage: 0, breakdown: "" }),
    applyDamageToEnemy: () => {},
    processCombatantDeath: () => false,
    applyDamageToPlayer: () => {},
    mirrorRedirect: () => false,
    mirrorFieldReflect: () => false,
    paperWindstormMiss: () => false,
    activateMirror: () => {
      extras.mirrorCalls?.push(1);
    },
    placeBarrierTile: () => {},
    spawnPlayerSummon: () => {},
    getEffectiveSpellRange: (n) => n,
    recordSpellType: () => {},
  };
}

describe("player special-cast predicates", () => {
  const timestep = byId("spell-timestep");
  const mirror = byId("spell-mirror");
  const shield = byId("starter-shield");

  it("does not treat Timestep as a Shield buff", () => {
    assert.equal(playerShieldBuffResolves(timestep), false);
    assert.equal(playerShieldBuffResolves(shield), true);
    assert.equal(playerTimestepResolvesOnTile(timestep, true), true);
    assert.equal(playerTimestepResolvesOnTile(timestep, false), false);
    assert.equal(playerMirrorResolvesOnTile(mirror, true), true);
    assert.equal(playerMirrorResolvesOnTile(mirror, false), false);
    assert.equal(playerMirrorResolvesOnTile(timestep, true), false);
  });
});

describe("Timestep highlight vs restore effect", () => {
  const tiles = floorGrid(9);
  const caster = { x: 4, y: 4 };
  const timestep = byId("spell-timestep");
  const rat = unit("rat", 6, 4);

  it("a highlighted caster tile restores AP/MP; an off-self tile cannot execute", () => {
    const highlighted = computeTargetableTiles(timestep, caster, {
      tiles,
      enemies: [rat],
      worldGridSize: 9,
      effectiveRange: 1,
      barrierTiles: new Map(),
    });
    assert.equal(highlighted.has("4,4"), true);
    assert.equal(highlighted.has("6,4"), false);
    const { highlightOnly, liveOnly } = collectHighlightLiveMismatches(
      timestep,
      caster,
      [rat],
      tiles,
      1,
    );
    assert.deepEqual(highlightOnly, []);
    assert.deepEqual(liveOnly, []);

    const legalLive = isTileCastableLive(
      timestep,
      caster,
      caster,
      [rat],
      tiles,
      1,
    );
    const illegalLive = isTileCastableLive(
      timestep,
      caster,
      { x: 6, y: 4 },
      [rat],
      tiles,
      1,
    );
    assert.equal(shouldExecuteLiveCast(legalLive), true);
    assert.equal(shouldExecuteLiveCast(illegalLive), false);

    const legalPlan = planPlayerCastAttempt({
      spell: timestep,
      caster,
      tile: caster,
      liveCombatants: [rat],
      mapTiles: tiles,
      effectiveRange: 1,
      currentAp: 0,
      baseApCost: 0,
      cooldownTurnsRemaining: 0,
    });
    const illegalPlan = planPlayerCastAttempt({
      spell: timestep,
      caster,
      tile: { x: 6, y: 4 },
      liveCombatants: [rat],
      mapTiles: tiles,
      effectiveRange: 1,
      currentAp: 0,
      baseApCost: 0,
      cooldownTurnsRemaining: 0,
    });
    assert.equal(playerCastAttemptResult(legalPlan), "ok");
    assert.equal(playerCastAttemptResult(illegalPlan), "abort");
    assert.deepEqual(pickAttackNearestTile(timestep, caster, [rat], tiles, 1), {
      x: 4,
      y: 4,
    });

    const restoreCalls: number[] = [];
    const ctx = stubCtx({ restoreCalls });
    assert.equal(resolvePlayerCast(timestep, caster, ctx), "no_ap");
    assert.equal(restoreCalls.length, 1);

    const offRestore: number[] = [];
    const offCtx = stubCtx({ restoreCalls: offRestore });
    assert.equal(
      resolvePlayerCast(timestep, { x: 6, y: 4 }, offCtx),
      "abort",
    );
    assert.equal(offRestore.length, 0);
  });

  it("does not restore after Timestep is already spent", () => {
    const restoreCalls: number[] = [];
    const ctx = stubCtx({ timestepUsed: true, restoreCalls });
    assert.equal(resolvePlayerCast(timestep, caster, ctx), "abort");
    assert.equal(restoreCalls.length, 0);
  });
});

describe("Mirror highlight vs activate effect", () => {
  const tiles = floorGrid(9);
  const caster = { x: 4, y: 4 };
  const mirror = byId("spell-mirror");
  const rat = unit("rat", 6, 4);

  it("a highlighted caster tile activates Mirror; an off-self tile cannot", () => {
    const highlighted = computeTargetableTiles(mirror, caster, {
      tiles,
      enemies: [rat],
      worldGridSize: 9,
      effectiveRange: 1,
      barrierTiles: new Map(),
    });
    assert.equal(highlighted.has("4,4"), true);
    assert.equal(highlighted.has("6,4"), false);
    assert.equal(shouldExecuteLiveCast(
      isTileCastableLive(mirror, caster, caster, [rat], tiles, 1),
    ), true);
    assert.equal(shouldExecuteLiveCast(
      isTileCastableLive(mirror, caster, { x: 6, y: 4 }, [rat], tiles, 1),
    ), false);

    const mirrorCalls: number[] = [];
    const ctx = stubCtx({ mirrorCalls });
    assert.equal(resolvePlayerCast(mirror, caster, ctx), "cast");
    assert.equal(mirrorCalls.length, 1);

    const missed: number[] = [];
    const missCtx = stubCtx({ mirrorCalls: missed });
    assert.equal(resolvePlayerCast(mirror, { x: 6, y: 4 }, missCtx), "abort");
    assert.equal(missed.length, 0);
  });
});

describe("Shield buff still resolves on a highlighted caster tile", () => {
  const tiles = floorGrid(9);
  const caster = { x: 4, y: 4 };
  const shield = byId("starter-shield");

  it("applies the RES buff and does not take the Timestep path", () => {
    const highlighted = computeTargetableTiles(shield, caster, {
      tiles,
      enemies: [],
      worldGridSize: 9,
      effectiveRange: 3,
      barrierTiles: new Map(),
    });
    assert.equal(highlighted.has("4,4"), true);
    const effects: Array<{ stat?: string; targetId?: string }> = [];
    const restoreCalls: number[] = [];
    const ctx = stubCtx({ effects, restoreCalls });
    assert.equal(resolvePlayerCast(shield, caster, ctx), "cast");
    assert.equal(effects[0]?.stat, "res");
    assert.equal(effects[0]?.targetId, "player");
    assert.equal(restoreCalls.length, 0);
  });
});
