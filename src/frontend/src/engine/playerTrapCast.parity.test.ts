import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { starterSpells } from "../data/spellData.ts";
import type { Enemy, SpellConfig } from "../types/gameTypes.ts";
import {
  planPlayerCastAttempt,
  playerCastAttemptResult,
} from "./playerCastPlan.ts";
import {
  applyPlayerTrapCast,
  playerTrapAbortsOnCasterTile,
  playerTrapIsPlacementKit,
  playerTrapPlacementTurns,
  playerTrapResolvesOnTile,
} from "./playerTrapCast.ts";
import {
  collectHighlightLiveMismatches,
  computeTargetableTiles,
  decideSpriteCastClick,
  decideTileCastClick,
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

function groundTrap(): SpellConfig {
  return {
    id: "spell-trap",
    name: "Trap",
    description: "Places a trap on a free tile",
    iconEmoji: "⚠️",
    apCost: 3n,
    mpCost: 0n,
    damage: 0n,
    range: 2n,
    effectType: "defense",
    spellType: "damage",
    isTrap: true,
    usableByPlayer: true,
    usableByEnemy: true,
    targetType: "ground",
    areaShape: "single",
    areaRadius: 0,
    maxRange: 2,
    minRange: 1,
  } as SpellConfig;
}

function enemyTrap(): SpellConfig {
  return {
    ...groundTrap(),
    id: "spell-trap-enemy",
    targetType: "enemy",
    maxRange: 3,
    range: 3n,
  } as SpellConfig;
}

function runTrap(
  spell: SpellConfig,
  tile: { x: number; y: number },
  playerPosition: { x: number; y: number } = { x: 4, y: 4 },
): {
  result: ReturnType<typeof applyPlayerTrapCast>;
  traps: Array<{ x: number; y: number; turns: number }>;
} {
  const traps: Array<{ x: number; y: number; turns: number }> = [];
  const result = applyPlayerTrapCast({
    spell,
    isPlayerTile: tile.x === playerPosition.x && tile.y === playerPosition.y,
    gridPos: tile,
    placeBarrierTile: (cell, turns) => {
      traps.push({ x: cell.x, y: cell.y, turns });
    },
    log: () => {},
    recordSpellType: () => {},
  });
  return { result, traps };
}

describe("playerTrap predicates", () => {
  it("is trap-only so Strike / Mark / Barrier / Sacrifice stay unique", () => {
    const trap = groundTrap();
    assert.equal(playerTrapIsPlacementKit(trap), true);
    assert.equal(playerTrapPlacementTurns(), 3);
    assert.equal(playerTrapResolvesOnTile(trap, false), true);
    assert.equal(playerTrapResolvesOnTile(trap, true), false);
    assert.equal(playerTrapAbortsOnCasterTile(trap, true), true);
    assert.equal(playerTrapAbortsOnCasterTile(trap, false), false);

    assert.equal(playerTrapIsPlacementKit(byId("physical_attack")), false);
    assert.equal(playerTrapIsPlacementKit(byId("spell-mark")), false);
    assert.equal(playerTrapIsPlacementKit(byId("spell-barrier")), false);
    assert.equal(playerTrapIsPlacementKit(byId("spell-sacrifice")), false);
    assert.equal(
      playerTrapResolvesOnTile(byId("physical_attack"), false),
      false,
    );
    assert.equal(playerTrapResolvesOnTile(byId("spell-barrier"), false), false);
  });
});

describe("ground Trap highlight vs execute", () => {
  const tiles = floorGrid(9);
  const caster = { x: 4, y: 4 };
  const rat = unit("rat", 4, 6);
  const far = unit("far", 8, 8);
  const corpse = unit("corpse", 5, 4, { hp: 0 });
  const enemies = [rat, far, corpse];
  const spell = groundTrap();
  const range = Number(spell.range);
  const barriers = new Map<string, number>();

  it("lets a highlighted empty floor execute and refuses occupied / far / self", () => {
    const grid = {
      tiles,
      enemies,
      worldGridSize: 9,
      effectiveRange: range,
      barrierTiles: barriers,
    };
    assert.deepEqual(collectHighlightLiveMismatches(spell, caster, grid), {
      highlightOnly: [],
      liveOnly: [],
    });
    const highlighted = computeTargetableTiles(spell, caster, grid);
    assert.equal(highlighted.has("4,3"), true, "empty adjacent floor");
    assert.equal(highlighted.has("4,6"), false, "occupied by a hostile");
    assert.equal(highlighted.has("5,4"), false, "corpse occupies the cell");
    assert.equal(highlighted.has("4,4"), false, "caster tile");
    assert.equal(highlighted.has("8,8"), false, "out of Manhattan range");

    const legalLive = isTileCastableLive(
      spell,
      caster,
      { x: 4, y: 3 },
      enemies,
      tiles,
      range,
      barriers,
    );
    const occupiedLive = isTileCastableLive(
      spell,
      caster,
      { x: 4, y: 6 },
      enemies,
      tiles,
      range,
      barriers,
    );
    const farLive = isTileCastableLive(
      spell,
      caster,
      { x: 8, y: 8 },
      enemies,
      tiles,
      range,
      barriers,
    );
    assert.equal(shouldExecuteLiveCast(legalLive), true);
    assert.equal(shouldExecuteLiveCast(occupiedLive), false);
    assert.equal(shouldExecuteLiveCast(farLive), false);

    const legalPlan = planPlayerCastAttempt({
      spell,
      caster,
      tile: { x: 4, y: 3 },
      liveCombatants: enemies,
      mapTiles: tiles,
      effectiveRange: range,
      barrierTiles: barriers,
      currentAp: 6,
      baseApCost: Number(spell.apCost),
      cooldownTurnsRemaining: 0,
    });
    assert.equal(legalPlan.ok, true);
    assert.equal(playerCastAttemptResult(legalPlan), "ok");

    for (const tile of [{ x: 4, y: 6 }, { x: 8, y: 8 }, caster]) {
      const attempt = planPlayerCastAttempt({
        spell,
        caster,
        tile,
        liveCombatants: enemies,
        mapTiles: tiles,
        effectiveRange: range,
        barrierTiles: barriers,
        currentAp: 6,
        baseApCost: Number(spell.apCost),
        cooldownTurnsRemaining: 0,
      });
      assert.equal(attempt.ok, false, `${tile.x},${tile.y} must not spend AP`);
      assert.equal(playerCastAttemptResult(attempt), "abort");
      assert.equal(attempt.apCost, 0);
    }

    const placed = runTrap(spell, { x: 4, y: 3 });
    assert.equal(placed.result, "cast");
    assert.deepEqual(placed.traps, [{ x: 4, y: 3, turns: 3 }]);

    const self = runTrap(spell, caster);
    assert.equal(self.result, "abort");
    assert.deepEqual(self.traps, []);

    assert.deepEqual(
      decideTileCastClick({
        live: legalLive,
        tileHighlighted: highlighted.has("4,3"),
        occupantIsLiveHostile: false,
      }),
      { action: "execute", bypassHighlight: false },
    );
    assert.deepEqual(
      decideTileCastClick({
        live: occupiedLive,
        tileHighlighted: false,
        occupantIsLiveHostile: true,
      }),
      { action: "reject", reason: occupiedLive.reason },
    );
    assert.deepEqual(
      decideSpriteCastClick({
        selectedSpellId: spell.id,
        hasSelectedSpell: true,
        hitKind: "enemy",
        playerCastOk: true,
        inBattle: true,
        liveOk: shouldExecuteLiveCast(legalLive),
        selfOrAllySpell: false,
        hasBasicAttack: false,
      }),
      { action: "execute", source: "sprite-enemy" },
    );
  });
});

describe("enemy-kit Trap occupied cell vs min-1 damage", () => {
  const tiles = floorGrid(9);
  const caster = { x: 4, y: 4 };
  const rat = unit("rat", 6, 4);
  const enemies = [rat];
  const spell = enemyTrap();
  const range = Number(spell.range);
  const barriers = new Map<string, number>();

  it("a highlighted hostile places the trap and does not deal leftover min-1", () => {
    const grid = {
      tiles,
      enemies,
      worldGridSize: 9,
      effectiveRange: range,
      barrierTiles: barriers,
    };
    assert.deepEqual(collectHighlightLiveMismatches(spell, caster, grid), {
      highlightOnly: [],
      liveOnly: [],
    });
    const highlighted = computeTargetableTiles(spell, caster, grid);
    assert.equal(highlighted.has("6,4"), true, "living hostile");
    assert.equal(highlighted.has("5,4"), true, "empty in-range still legal");
    assert.equal(highlighted.has("4,4"), false, "caster tile");

    const hostileLive = isTileCastableLive(
      spell,
      caster,
      { x: 6, y: 4 },
      enemies,
      tiles,
      range,
      barriers,
    );
    const emptyLive = isTileCastableLive(
      spell,
      caster,
      { x: 5, y: 4 },
      enemies,
      tiles,
      range,
      barriers,
    );
    assert.equal(shouldExecuteLiveCast(hostileLive), true);
    assert.equal(shouldExecuteLiveCast(emptyLive), true);

    const hostilePlan = planPlayerCastAttempt({
      spell,
      caster,
      tile: { x: 6, y: 4 },
      liveCombatants: enemies,
      mapTiles: tiles,
      effectiveRange: range,
      barrierTiles: barriers,
      currentAp: 6,
      baseApCost: Number(spell.apCost),
      cooldownTurnsRemaining: 0,
    });
    const emptyPlan = planPlayerCastAttempt({
      spell,
      caster,
      tile: { x: 5, y: 4 },
      liveCombatants: enemies,
      mapTiles: tiles,
      effectiveRange: range,
      barrierTiles: barriers,
      currentAp: 6,
      baseApCost: Number(spell.apCost),
      cooldownTurnsRemaining: 0,
    });
    const farPlan = planPlayerCastAttempt({
      spell,
      caster,
      tile: { x: 0, y: 0 },
      liveCombatants: enemies,
      mapTiles: tiles,
      effectiveRange: range,
      barrierTiles: barriers,
      currentAp: 6,
      baseApCost: Number(spell.apCost),
      cooldownTurnsRemaining: 0,
    });
    assert.equal(playerCastAttemptResult(hostilePlan), "ok");
    assert.equal(playerCastAttemptResult(emptyPlan), "ok");
    assert.equal(playerCastAttemptResult(farPlan), "abort");
    assert.equal(farPlan.apCost, 0);

    const hostile = runTrap(spell, { x: 6, y: 4 });
    assert.equal(hostile.result, "cast");
    assert.deepEqual(hostile.traps, [{ x: 6, y: 4, turns: 3 }]);

    const empty = runTrap(spell, { x: 5, y: 4 });
    assert.equal(empty.result, "cast");
    assert.deepEqual(empty.traps, [{ x: 5, y: 4, turns: 3 }]);

    assert.deepEqual(
      pickAttackNearestTile(spell, caster, enemies, tiles, range, barriers),
      { x: 6, y: 4 },
    );
  });

  it("does not steal Strike / Mark / Barrier onto the Trap branch", () => {
    const strike = runTrap(byId("physical_attack"), { x: 6, y: 4 });
    assert.equal(strike.result, null);
    assert.deepEqual(strike.traps, []);
    const mark = runTrap(byId("spell-mark"), { x: 5, y: 4 });
    assert.equal(mark.result, null);
    assert.deepEqual(mark.traps, []);
    const barrier = runTrap(byId("spell-barrier"), { x: 5, y: 5 });
    assert.equal(barrier.result, null);
    assert.deepEqual(barrier.traps, []);
  });
});
