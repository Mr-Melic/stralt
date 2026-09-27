/**
 * Combat action parity: a highlighted legal target is executable and an
 * illegal target cannot execute — walk dests and spell clicks.
 *
 * Cast geometry already lives in targeting.ts. Walk dest occupancy and
 * hover MP used to drift; those rules live in battleWalkReachable.ts so
 * older WX / battleWalkMp / walkRejectCopy PRs stay merge-clean.
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { Enemy, SpellConfig } from "../types/gameTypes.ts";
import { battleWalkMpCost } from "./battleWalkMp.ts";
import {
  battleWalkDestHoverMp,
  battleWalkDestOccupiedByLiving,
  canExecuteBattleWalkDest,
  computeBattleWalkReachable,
} from "./battleWalkReachable.ts";
import {
  planPlayerCastAttempt,
  playerCastAttemptResult,
} from "./playerCastPlan.ts";
import {
  collectHighlightLiveMismatches,
  computeTargetableTiles,
  decideSpriteCastClick,
  decideTileCastClick,
  pickAttackNearestTile,
  probeLiveCast,
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
    ...extras,
  } as Enemy;
}

function strike(): SpellConfig {
  return {
    id: "physical_attack",
    name: "Strike",
    description: "",
    iconEmoji: "",
    apCost: 2n,
    mpCost: 0n,
    damage: 10n,
    range: 1n,
    effectType: "damage",
    targetType: "enemy",
    isPhysical: true,
    maxRange: 1,
    minRange: 1,
  } as SpellConfig;
}

describe("walk highlight vs execute dest occupancy", () => {
  it("a living occupant is not highlighted and cannot execute", () => {
    const origin = { x: 1, y: 1 };
    const rat = { x: 2, y: 1, hp: 10 };
    const occupied = battleWalkDestOccupiedByLiving({
      dest: rat,
      walker: origin,
      livingOccupants: [rat],
    });
    const walk = computeBattleWalkReachable({
      origin,
      mpBudget: 4,
      costPerTile: 1,
      worldGridSize: 6,
      isBlocked: () => false,
      isOccupiedDest: (x, y) =>
        battleWalkDestOccupiedByLiving({
          dest: { x, y },
          walker: origin,
          livingOccupants: [rat],
        }),
    });
    assert.equal(occupied, true);
    assert.equal(canExecuteBattleWalkDest(walk, rat), false);
    assert.equal(battleWalkDestHoverMp(walk.costByKey, rat), null);
  });

  it("a corpse dest is highlighted and executable", () => {
    const origin = { x: 1, y: 1 };
    const corpse = { x: 2, y: 1, hp: 0 };
    const walk = computeBattleWalkReachable({
      origin,
      mpBudget: 4,
      costPerTile: 1,
      worldGridSize: 6,
      isBlocked: () => false,
      isOccupiedDest: (x, y) =>
        battleWalkDestOccupiedByLiving({
          dest: { x, y },
          walker: origin,
          livingOccupants: [corpse],
        }),
    });
    assert.equal(canExecuteBattleWalkDest(walk, corpse), true);
    assert.equal(battleWalkDestHoverMp(walk.costByKey, corpse), 1);
  });

  it("a highlighted empty dest is executable at the hover MP cost", () => {
    const origin = { x: 1, y: 1 };
    const dest = { x: 3, y: 1 };
    const walk = computeBattleWalkReachable({
      origin,
      mpBudget: 4,
      costPerTile: 1,
      worldGridSize: 6,
      isBlocked: () => false,
      isOccupiedDest: () => false,
    });
    assert.equal(canExecuteBattleWalkDest(walk, dest), true);
    const hover = battleWalkDestHoverMp(walk.costByKey, dest);
    assert.equal(hover, 2);
    assert.equal(battleWalkMpCost(2, 1), hover);
  });

  it("still highlights a tile behind an occupant (walk-through unchanged)", () => {
    const origin = { x: 2, y: 2 };
    const walk = computeBattleWalkReachable({
      origin,
      mpBudget: 6,
      costPerTile: 1,
      worldGridSize: 8,
      isBlocked: () => false,
      isOccupiedDest: (x, y) => x === 3 && y === 2,
    });
    assert.equal(canExecuteBattleWalkDest(walk, { x: 3, y: 2 }), false);
    assert.equal(canExecuteBattleWalkDest(walk, { x: 4, y: 2 }), true);
    assert.equal(battleWalkDestHoverMp(walk.costByKey, { x: 4, y: 2 }), 2);
  });

  it("hover MP equals execute debit on Frozen (2 MP/tile)", () => {
    const origin = { x: 2, y: 2 };
    const result = computeBattleWalkReachable({
      origin,
      mpBudget: 6,
      costPerTile: 2,
      worldGridSize: 8,
      isBlocked: () => false,
    });
    assert.equal(
      canExecuteBattleWalkDest(result, { x: 6, y: 2 }),
      false,
      "4 tiles at 2 MP = 8 > 6",
    );
    assert.equal(
      canExecuteBattleWalkDest(result, { x: 5, y: 2 }),
      true,
      "3 tiles at 2 MP = 6",
    );
    const hover = battleWalkDestHoverMp(result.costByKey, { x: 5, y: 2 });
    assert.equal(hover, 6);
    assert.equal(battleWalkMpCost(3, 2), hover);
  });

  it("does not highlight a wall dest the execute path would reject", () => {
    const origin = { x: 2, y: 2 };
    const result = computeBattleWalkReachable({
      origin,
      mpBudget: 4,
      costPerTile: 1,
      worldGridSize: 8,
      isBlocked: (x, y) => x === 3 && y === 2,
    });
    assert.equal(canExecuteBattleWalkDest(result, { x: 3, y: 2 }), false);
    assert.equal(battleWalkDestHoverMp(result.costByKey, { x: 3, y: 2 }), null);
  });
});

describe("cast highlight vs tile/sprite/Attack Nearest/plan execute", () => {
  it("executes a highlighted legal hostile and refuses a LoS-blocked tile", () => {
    const tiles = floorGrid(11);
    tiles[5][6] = "wall";
    const caster = { x: 5, y: 5 };
    const open = unit("open", 5, 8, { side: "enemy" });
    const blocked = unit("blocked", 8, 5, { side: "enemy" });
    const enemies = [open, blocked];
    const spell: SpellConfig = {
      ...strike(),
      id: "starter-poison",
      isPhysical: false,
      range: 4n,
      maxRange: 4,
      lineOfSight: true,
    };
    const grid = {
      tiles,
      enemies,
      worldGridSize: 11,
      effectiveRange: 4,
      barrierTiles: new Map<string, number>(),
    };
    assert.deepEqual(collectHighlightLiveMismatches(spell, caster, grid), {
      highlightOnly: [],
      liveOnly: [],
    });
    const highlighted = computeTargetableTiles(spell, caster, grid);
    assert.equal(highlighted.has("5,8"), true);
    assert.equal(highlighted.has("8,5"), false);

    const legalLive = probeLiveCast(
      spell,
      caster,
      { x: 5, y: 8 },
      enemies,
      tiles,
      4,
    );
    const illegalLive = probeLiveCast(
      spell,
      caster,
      { x: 8, y: 5 },
      enemies,
      tiles,
      4,
    );
    assert.equal(shouldExecuteLiveCast(legalLive), true);
    assert.equal(shouldExecuteLiveCast(illegalLive), false);

    assert.deepEqual(
      decideTileCastClick({
        live: legalLive,
        tileHighlighted: highlighted.has("5,8"),
        occupantIsLiveHostile: true,
      }),
      { action: "execute", bypassHighlight: true },
    );
    assert.deepEqual(
      decideTileCastClick({
        live: illegalLive,
        tileHighlighted: highlighted.has("8,5"),
        occupantIsLiveHostile: true,
      }),
      { action: "reject", reason: illegalLive.reason },
    );

    assert.deepEqual(
      decideSpriteCastClick({
        selectedSpellId: spell.id,
        hasSelectedSpell: true,
        hitKind: "enemy",
        playerCastOk: true,
        inBattle: true,
        liveOk: true,
        selfOrAllySpell: false,
        hasBasicAttack: false,
      }),
      { action: "execute", source: "sprite-enemy" },
    );
    assert.deepEqual(
      decideSpriteCastClick({
        selectedSpellId: spell.id,
        hasSelectedSpell: true,
        hitKind: "enemy",
        playerCastOk: true,
        inBattle: true,
        liveOk: false,
        selfOrAllySpell: false,
        hasBasicAttack: false,
      }),
      { action: "reject_live" },
    );

    const picked = pickAttackNearestTile(spell, caster, enemies, tiles, 4);
    assert.deepEqual(picked, { x: 5, y: 8 });
    assert.equal(highlighted.has(`${picked!.x},${picked!.y}`), true);

    const legalPlan = planPlayerCastAttempt({
      spell,
      caster,
      tile: { x: 5, y: 8 },
      liveCombatants: enemies,
      mapTiles: tiles,
      effectiveRange: 4,
      currentAp: 4,
      baseApCost: 2,
      cooldownTurnsRemaining: 0,
    });
    const illegalPlan = planPlayerCastAttempt({
      spell,
      caster,
      tile: { x: 8, y: 5 },
      liveCombatants: enemies,
      mapTiles: tiles,
      effectiveRange: 4,
      currentAp: 4,
      baseApCost: 2,
      cooldownTurnsRemaining: 0,
    });
    assert.equal(playerCastAttemptResult(legalPlan), "ok");
    assert.equal(playerCastAttemptResult(illegalPlan), "abort");
  });

  it("refuses cooldown and missing AP even when the tile is live-ok", () => {
    const tiles = floorGrid(6);
    const caster = { x: 1, y: 1 };
    const rat = unit("rat", 2, 1, { side: "enemy" });
    const spell = strike();
    const live = probeLiveCast(spell, caster, rat, [rat], tiles, 1);
    assert.equal(shouldExecuteLiveCast(live), true);
    const onCd = planPlayerCastAttempt({
      spell,
      caster,
      tile: rat,
      liveCombatants: [rat],
      mapTiles: tiles,
      effectiveRange: 1,
      currentAp: 4,
      baseApCost: 2,
      cooldownTurnsRemaining: 1,
    });
    const noAp = planPlayerCastAttempt({
      spell,
      caster,
      tile: rat,
      liveCombatants: [rat],
      mapTiles: tiles,
      effectiveRange: 1,
      currentAp: 1,
      baseApCost: 2,
      cooldownTurnsRemaining: 0,
    });
    assert.equal(playerCastAttemptResult(onCd), "on_cooldown");
    assert.equal(playerCastAttemptResult(noAp), "no_ap");
  });

  it("keeps an area expansion tile executable and the caster tile illegal", () => {
    const tiles = floorGrid(10);
    const origin = { x: 4, y: 4 };
    const spell: SpellConfig = {
      ...strike(),
      id: "spell-frost-nova",
      isPhysical: false,
      targetType: "area",
      areaRadius: 2,
      maxRange: 1,
      range: 1n,
    };
    const enemies = [unit("n", 4, 5, { side: "enemy" })];
    const grid = {
      tiles,
      enemies,
      worldGridSize: 10,
      effectiveRange: 1,
      barrierTiles: new Map<string, number>(),
    };
    assert.deepEqual(collectHighlightLiveMismatches(spell, origin, grid), {
      highlightOnly: [],
      liveOnly: [],
    });
    const highlighted = computeTargetableTiles(spell, origin, grid);
    assert.equal(highlighted.has("4,6"), true);
    assert.equal(highlighted.has("4,4"), false);
    const legal = planPlayerCastAttempt({
      spell,
      caster: origin,
      tile: { x: 4, y: 6 },
      liveCombatants: enemies,
      mapTiles: tiles,
      effectiveRange: 1,
      currentAp: 4,
      baseApCost: 2,
      cooldownTurnsRemaining: 0,
    });
    const illegal = planPlayerCastAttempt({
      spell,
      caster: origin,
      tile: origin,
      liveCombatants: enemies,
      mapTiles: tiles,
      effectiveRange: 1,
      currentAp: 4,
      baseApCost: 2,
      cooldownTurnsRemaining: 0,
    });
    assert.equal(playerCastAttemptResult(legal), "ok");
    assert.equal(playerCastAttemptResult(illegal), "abort");
  });
});
