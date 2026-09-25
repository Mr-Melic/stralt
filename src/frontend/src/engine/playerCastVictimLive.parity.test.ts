import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { starterSpells } from "../data/spellData.ts";
import type { Enemy, SpellConfig } from "../types/gameTypes.ts";
import { isActiveHostile } from "./battleSetup.ts";
import { getAoETargets } from "./castHelpers.ts";
import {
  planPlayerCastAttempt,
  playerCastAttemptResult,
} from "./playerCastPlan.ts";
import {
  playerCastEffectLiveRejectReason,
  playerCastEffectLiveResult,
  playerDrainLiveHostileAt,
  playerHitsMultipleHasVictim,
  playerSingleTargetDrainRequiresOccupant,
  playerVictimChebyshev,
} from "./playerCastVictimLive.ts";
import {
  collectHighlightLiveMismatches,
  computeTargetableTiles,
  hitsMultipleIncludesOccupant,
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

function aoeArgs(
  spell: SpellConfig,
  gridPos: { x: number; y: number },
  enemies: Enemy[],
  targetEnemy: Enemy | undefined,
  playerPosition: { x: number; y: number },
) {
  return {
    spell,
    gridPos,
    targetEnemy,
    enemies,
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
    getEffectiveSpellRange: (n: number) => n,
    logBattleEntry: () => {},
  };
}

describe("playerCastVictimLive predicates", () => {
  it("keeps Life Drain occupant-required and Lifesteal Nova on the AoE list", () => {
    const drain = byId("starter-drain");
    const courage = byId("spell-drain-courage");
    const nova = byId("spell-lifesteal-nova");
    const frost = byId("starter-frost");
    const strike = byId("physical_attack");
    const mark = byId("spell-mark");
    assert.equal(playerSingleTargetDrainRequiresOccupant(drain), true);
    assert.equal(playerSingleTargetDrainRequiresOccupant(courage), true);
    assert.equal(playerSingleTargetDrainRequiresOccupant(nova), false);
    assert.equal(playerSingleTargetDrainRequiresOccupant(frost), false);
    assert.equal(playerSingleTargetDrainRequiresOccupant(strike), false);
    assert.equal(playerSingleTargetDrainRequiresOccupant(mark), false);
  });

  it("matches getAoETargets Chebyshev + isActiveHostile for hitsMultiple victims", () => {
    const click = { x: 5, y: 4 };
    const rat = unit("rat", 4, 5);
    const corpse = unit("corpse", 5, 5, { hp: 0 });
    const wolf = unit("wolf", 5, 4, { isSummon: true, side: "player" });
    const far = unit("far", 8, 8);
    assert.equal(playerVictimChebyshev(rat, click), 1);
    assert.equal(hitsMultipleIncludesOccupant(rat, click, 1), true);
    assert.equal(
      playerHitsMultipleHasVictim({
        spell: { hitsMultiple: true },
        click,
        caster: { x: 4, y: 4 },
        combatants: [rat, corpse, wolf, far],
        radius: 1,
      }),
      true,
    );
    assert.equal(
      playerHitsMultipleHasVictim({
        spell: { hitsMultiple: true },
        click,
        caster: { x: 4, y: 4 },
        combatants: [corpse, wolf, far],
        radius: 1,
      }),
      false,
    );
    assert.equal(isActiveHostile(corpse), false);
    assert.equal(isActiveHostile(wolf), false);
  });

  it("does not steal Strike / Mark empty rings onto the drain occupant rule", () => {
    const empty = { x: 5, y: 5 };
    const caster = { x: 4, y: 4 };
    assert.equal(
      playerCastEffectLiveRejectReason({
        spell: byId("physical_attack"),
        tile: empty,
        caster,
        combatants: [],
        radius: 1,
      }),
      null,
    );
    assert.equal(
      playerCastEffectLiveRejectReason({
        spell: byId("spell-mark"),
        tile: empty,
        caster,
        combatants: [],
        radius: 4,
      }),
      null,
    );
    assert.equal(
      playerCastEffectLiveResult({
        geometryReason: "enemy",
        spell: byId("starter-drain"),
        tile: empty,
        caster,
        combatants: [],
        radius: 2,
      }).ok,
      false,
    );
  });
});

describe("Life Drain highlight vs execute", () => {
  const tiles = floorGrid(9);
  const caster = { x: 4, y: 4 };
  const rat = unit("rat", 5, 4);
  const far = unit("far", 8, 8);
  const corpse = unit("corpse", 4, 5, { hp: 0 });
  const enemies = [rat, far, corpse];
  const drain = byId("starter-drain");
  const range = Number(drain.range);
  const barriers = new Map<string, number>();

  it("a highlighted hostile is executable; empty, corpse, and far tiles cannot", () => {
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
    assert.equal(highlighted.has("5,4"), true, "living hostile");
    assert.equal(highlighted.has("4,5"), false, "corpse is not drainable");
    assert.equal(highlighted.has("5,5"), false, "empty in-range");
    assert.equal(highlighted.has("8,8"), false);
    assert.equal(highlighted.has("4,4"), false, "caster tile");

    assert.equal(playerDrainLiveHostileAt({ x: 5, y: 4 }, enemies), true);
    assert.equal(playerDrainLiveHostileAt({ x: 4, y: 5 }, enemies), false);
    assert.equal(playerDrainLiveHostileAt({ x: 5, y: 5 }, enemies), false);

    const legalLive = isTileCastableLive(
      drain,
      caster,
      { x: 5, y: 4 },
      enemies,
      tiles,
      range,
      barriers,
    );
    const emptyLive = isTileCastableLive(
      drain,
      caster,
      { x: 5, y: 5 },
      enemies,
      tiles,
      range,
      barriers,
    );
    const corpseLive = isTileCastableLive(
      drain,
      caster,
      { x: 4, y: 5 },
      enemies,
      tiles,
      range,
      barriers,
    );
    const farLive = isTileCastableLive(
      drain,
      caster,
      { x: 8, y: 8 },
      enemies,
      tiles,
      range,
      barriers,
    );
    assert.equal(shouldExecuteLiveCast(legalLive), true);
    assert.equal(shouldExecuteLiveCast(emptyLive), false);
    assert.equal(emptyLive.reason, "drain_no_enemy");
    assert.equal(shouldExecuteLiveCast(corpseLive), false);
    assert.equal(corpseLive.reason, "drain_no_enemy");
    assert.equal(shouldExecuteLiveCast(farLive), false);

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
    const emptyPlan = planPlayerCastAttempt({
      spell: drain,
      caster,
      tile: { x: 5, y: 5 },
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
    assert.equal(playerCastAttemptResult(emptyPlan), "abort");
    assert.equal(playerCastAttemptResult(farPlan), "abort");

    const drainTargets = getAoETargets(
      aoeArgs(drain, { x: 5, y: 4 }, enemies, rat, caster),
    );
    assert.equal(
      drainTargets.some((t) => t.id === "rat"),
      true,
    );
    const emptyTargets = getAoETargets(
      aoeArgs(drain, { x: 5, y: 5 }, enemies, undefined, caster),
    );
    assert.deepEqual(emptyTargets, []);

    assert.deepEqual(
      pickAttackNearestTile(drain, caster, enemies, tiles, range, barriers),
      { x: 5, y: 4 },
    );
  });

  it("Drain Courage shares the occupant live gate with Life Drain", () => {
    const courage = byId("spell-drain-courage");
    const r = Number(courage.range);
    const live = isTileCastableLive(
      courage,
      caster,
      { x: 5, y: 5 },
      enemies,
      tiles,
      r,
      barriers,
    );
    assert.equal(shouldExecuteLiveCast(live), false);
    assert.equal(live.reason, "drain_no_enemy");
    const occupied = isTileCastableLive(
      courage,
      caster,
      { x: 5, y: 4 },
      enemies,
      tiles,
      r,
      barriers,
    );
    assert.equal(shouldExecuteLiveCast(occupied), true);
  });
});

describe("hitsMultiple highlight vs getAoETargets victims", () => {
  const tiles = floorGrid(9);
  const caster = { x: 4, y: 4 };
  const barriers = new Map<string, number>();

  it("Lifesteal Nova: empty anchor with a nearby hostile is executable; empty with nobody is not", () => {
    const nova = byId("spell-lifesteal-nova");
    const range = Number(nova.range);
    const rat = unit("rat", 4, 5);
    const far = unit("far", 8, 8);
    const withRat = [rat, far];
    const grid = {
      tiles,
      enemies: withRat,
      worldGridSize: 9,
      effectiveRange: range,
      barrierTiles: barriers,
    };
    assert.deepEqual(collectHighlightLiveMismatches(nova, caster, grid), {
      highlightOnly: [],
      liveOnly: [],
    });
    const highlighted = computeTargetableTiles(nova, caster, grid);
    assert.equal(highlighted.has("5,4"), true, "empty adjacent with victim");
    assert.equal(highlighted.has("4,5"), true, "hostile tile");
    assert.equal(highlighted.has("8,8"), false);

    const emptyLive = isTileCastableLive(
      nova,
      caster,
      { x: 5, y: 4 },
      withRat,
      tiles,
      range,
      barriers,
    );
    assert.equal(shouldExecuteLiveCast(emptyLive), true);
    const legalPlan = planPlayerCastAttempt({
      spell: nova,
      caster,
      tile: { x: 5, y: 4 },
      liveCombatants: withRat,
      mapTiles: tiles,
      effectiveRange: range,
      barrierTiles: barriers,
      currentAp: 6,
      baseApCost: Number(nova.apCost),
      cooldownTurnsRemaining: 0,
    });
    assert.equal(playerCastAttemptResult(legalPlan), "ok");

    const novaHits = getAoETargets(
      aoeArgs(nova, { x: 5, y: 4 }, withRat, undefined, caster),
    );
    assert.equal(
      novaHits.some((t) => t.id === "rat"),
      true,
    );

    const lone = [far];
    const loneGrid = {
      tiles,
      enemies: lone,
      worldGridSize: 9,
      effectiveRange: range,
      barrierTiles: barriers,
    };
    assert.deepEqual(collectHighlightLiveMismatches(nova, caster, loneGrid), {
      highlightOnly: [],
      liveOnly: [],
    });
    const loneHighlight = computeTargetableTiles(nova, caster, loneGrid);
    assert.equal(
      loneHighlight.has("5,4"),
      false,
      "empty Nova with nobody in hitsMultiple radius",
    );
    const loneLive = isTileCastableLive(
      nova,
      caster,
      { x: 5, y: 4 },
      lone,
      tiles,
      range,
      barriers,
    );
    assert.equal(shouldExecuteLiveCast(loneLive), false);
    assert.equal(loneLive.reason, "hits_multiple_no_victim");
    const lonePlan = planPlayerCastAttempt({
      spell: nova,
      caster,
      tile: { x: 5, y: 4 },
      liveCombatants: lone,
      mapTiles: tiles,
      effectiveRange: range,
      barrierTiles: barriers,
      currentAp: 6,
      baseApCost: Number(nova.apCost),
      cooldownTurnsRemaining: 0,
    });
    assert.equal(playerCastAttemptResult(lonePlan), "abort");
    const missHits = getAoETargets(
      aoeArgs(nova, { x: 5, y: 4 }, lone, undefined, caster),
    );
    assert.deepEqual(missHits, []);
  });

  it("Frost Nova and Chain Lightning refuse empty tiles that getAoETargets would miss", () => {
    const frost = byId("spell-frost-nova");
    const chain = byId("starter-blast");
    for (const spell of [frost, chain]) {
      const range = Number(spell.range);
      const live = isTileCastableLive(
        spell,
        caster,
        { x: 5, y: 4 },
        [],
        tiles,
        range,
        barriers,
      );
      assert.equal(
        shouldExecuteLiveCast(live),
        false,
        `${spell.id} empty with nobody in radius`,
      );
      assert.equal(live.reason, "hits_multiple_no_victim");
    }
    const rat = unit("rat", 4, 5);
    const frostOk = isTileCastableLive(
      frost,
      caster,
      { x: 5, y: 4 },
      [rat],
      tiles,
      Number(frost.range),
      barriers,
    );
    assert.equal(shouldExecuteLiveCast(frostOk), true);
    const chainOnRat = isTileCastableLive(
      chain,
      caster,
      { x: 4, y: 5 },
      [rat],
      tiles,
      Number(chain.range),
      barriers,
    );
    assert.equal(shouldExecuteLiveCast(chainOnRat), true);
  });

  it("Strike and Mark still highlight empty in-range tiles (not this predicate)", () => {
    const strike = byId("physical_attack");
    const mark = byId("spell-mark");
    const strikeLive = isTileCastableLive(
      strike,
      caster,
      { x: 4, y: 5 },
      [],
      tiles,
      Number(strike.range),
      barriers,
    );
    const markLive = isTileCastableLive(
      mark,
      caster,
      { x: 5, y: 5 },
      [],
      tiles,
      Number(mark.range),
      barriers,
    );
    assert.equal(shouldExecuteLiveCast(strikeLive), true);
    assert.equal(shouldExecuteLiveCast(markLive), true);
    const strikePlan = planPlayerCastAttempt({
      spell: strike,
      caster,
      tile: { x: 4, y: 5 },
      liveCombatants: [],
      mapTiles: tiles,
      effectiveRange: Number(strike.range),
      barrierTiles: barriers,
      currentAp: 6,
      baseApCost: Number(strike.apCost),
      cooldownTurnsRemaining: 0,
    });
    const markPlan = planPlayerCastAttempt({
      spell: mark,
      caster,
      tile: { x: 5, y: 5 },
      liveCombatants: [],
      mapTiles: tiles,
      effectiveRange: Number(mark.range),
      barrierTiles: barriers,
      currentAp: 6,
      baseApCost: Number(mark.apCost),
      cooldownTurnsRemaining: 0,
    });
    assert.equal(playerCastAttemptResult(strikePlan), "ok");
    assert.equal(playerCastAttemptResult(markPlan), "ok");
  });
});
