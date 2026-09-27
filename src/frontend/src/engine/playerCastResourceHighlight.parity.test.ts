/**
 * Combat action parity: a highlighted legal target is executable and an
 * illegal target cannot execute — resource cost (AP / cooldown) vs the
 * painted ring, tile/sprite/touch, Attack Nearest / keyboard S, and plan.
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { Enemy, SpellConfig } from "../types/gameTypes.ts";
import { castResultSpendsAp } from "../utils/challengeCompletion.ts";
import {
  planPlayerCastAttempt,
  playerCastAttemptResult,
} from "./playerCastPlan.ts";
import {
  attackNearestMarksFirstAction,
  decideTileCastClickWithResources,
  filterExecutableHighlightKeys,
  highlightedCastIsExecutable,
  planHighlightResources,
  shouldPaintSpellRangeHighlight,
} from "./playerCastResourceHighlight.ts";
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

function strike(overrides: Partial<SpellConfig> = {}): SpellConfig {
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
    ...overrides,
  } as SpellConfig;
}

describe("resource-aware highlight vs execute", () => {
  it("paints and executes a live-ok hostile when AP and cooldown agree", () => {
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
    const geometry = computeTargetableTiles(spell, caster, grid);
    const resources = planHighlightResources({
      currentAp: 4,
      baseApCost: 2,
      cooldownTurnsRemaining: 0,
    });
    assert.equal(shouldPaintSpellRangeHighlight(resources), true);
    const highlighted = filterExecutableHighlightKeys(geometry, resources);
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
    assert.equal(
      highlightedCastIsExecutable({
        highlighted: highlighted.has("5,8"),
        live: legalLive,
        resources,
      }),
      true,
    );
    assert.equal(
      highlightedCastIsExecutable({
        highlighted: highlighted.has("8,5"),
        live: illegalLive,
        resources,
      }),
      false,
    );
    assert.equal(shouldExecuteLiveCast(legalLive), true);
    assert.equal(shouldExecuteLiveCast(illegalLive), false);

    const legalClick = decideTileCastClickWithResources({
      click: decideTileCastClick({
        live: legalLive,
        tileHighlighted: highlighted.has("5,8"),
        occupantIsLiveHostile: true,
      }),
      resources,
    });
    const illegalClick = decideTileCastClickWithResources({
      click: decideTileCastClick({
        live: illegalLive,
        tileHighlighted: highlighted.has("8,5"),
        occupantIsLiveHostile: true,
      }),
      resources,
    });
    assert.deepEqual(legalClick, {
      action: "execute",
      bypassHighlight: true,
    });
    assert.deepEqual(illegalClick, {
      action: "reject",
      reason: illegalLive.reason,
    });

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

  it("does not paint or execute when the spell is on cooldown", () => {
    const tiles = floorGrid(6);
    const caster = { x: 1, y: 1 };
    const rat = unit("rat", 2, 1, { side: "enemy" });
    const spell = strike({ cooldown: 3 });
    const geometry = computeTargetableTiles(spell, caster, {
      tiles,
      enemies: [rat],
      worldGridSize: 6,
      effectiveRange: 1,
      barrierTiles: new Map(),
    });
    assert.equal(geometry.has("2,1"), true, "geometry still sees the rat");
    const resources = planHighlightResources({
      currentAp: 4,
      baseApCost: 2,
      cooldownTurnsRemaining: 1,
    });
    assert.equal(shouldPaintSpellRangeHighlight(resources), false);
    const highlighted = filterExecutableHighlightKeys(geometry, resources);
    assert.equal(highlighted.has("2,1"), false);
    const live = probeLiveCast(spell, caster, rat, [rat], tiles, 1);
    assert.equal(shouldExecuteLiveCast(live), true);
    assert.equal(
      highlightedCastIsExecutable({
        highlighted: geometry.has("2,1"),
        live,
        resources,
      }),
      false,
    );
    const click = decideTileCastClickWithResources({
      click: decideTileCastClick({
        live,
        tileHighlighted: geometry.has("2,1"),
        occupantIsLiveHostile: true,
      }),
      resources,
    });
    assert.deepEqual(click, { action: "reject", reason: "on_cooldown" });
    const plan = planPlayerCastAttempt({
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
    assert.equal(playerCastAttemptResult(plan), "on_cooldown");
  });

  it("does not paint or execute a positive-cost spell with missing AP", () => {
    const tiles = floorGrid(6);
    const caster = { x: 1, y: 1 };
    const rat = unit("rat", 2, 1, { side: "enemy" });
    const spell = strike();
    const geometry = computeTargetableTiles(spell, caster, {
      tiles,
      enemies: [rat],
      worldGridSize: 6,
      effectiveRange: 1,
      barrierTiles: new Map(),
    });
    const resources = planHighlightResources({
      currentAp: 1,
      baseApCost: 2,
      cooldownTurnsRemaining: 0,
    });
    assert.equal(shouldPaintSpellRangeHighlight(resources), false);
    assert.equal(
      filterExecutableHighlightKeys(geometry, resources).has("2,1"),
      false,
    );
    const live = probeLiveCast(spell, caster, rat, [rat], tiles, 1);
    const click = decideTileCastClickWithResources({
      click: decideTileCastClick({
        live,
        tileHighlighted: true,
        occupantIsLiveHostile: true,
      }),
      resources,
    });
    assert.deepEqual(click, { action: "reject", reason: "no_ap" });
    const plan = planPlayerCastAttempt({
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
    assert.equal(playerCastAttemptResult(plan), "no_ap");
  });

  it("still paints a 0-AP Timestep when the wallet is empty", () => {
    const tiles = floorGrid(6);
    const caster = { x: 2, y: 2 };
    const spell = strike({
      id: "spell-timestep",
      apCost: 0n,
      damage: 0n,
      range: 0n,
      maxRange: 0,
      minRange: 0,
      effectType: "buff",
      targetType: "self",
      isTimestep: true,
      isPhysical: false,
    });
    const geometry = computeTargetableTiles(spell, caster, {
      tiles,
      enemies: [],
      worldGridSize: 6,
      effectiveRange: 0,
      barrierTiles: new Map(),
    });
    const resources = planHighlightResources({
      currentAp: 0,
      baseApCost: 0,
      cooldownTurnsRemaining: 0,
    });
    assert.equal(shouldPaintSpellRangeHighlight(resources), true);
    const highlighted = filterExecutableHighlightKeys(geometry, resources);
    assert.equal(highlighted.has("2,2"), true);
    const live = probeLiveCast(spell, caster, caster, [], tiles, 0);
    assert.equal(
      highlightedCastIsExecutable({
        highlighted: highlighted.has("2,2"),
        live,
        resources,
      }),
      true,
    );
    const plan = planPlayerCastAttempt({
      spell,
      caster,
      tile: caster,
      liveCombatants: [],
      mapTiles: tiles,
      effectiveRange: 0,
      currentAp: 0,
      baseApCost: 0,
      cooldownTurnsRemaining: 0,
    });
    assert.equal(playerCastAttemptResult(plan), "ok");
  });
});

describe("Attack Nearest / keyboard S first-action vs execute spend", () => {
  it("does not mark first action on cooldown or missing target", () => {
    assert.equal(
      attackNearestMarksFirstAction({
        resourceOk: false,
        hasTarget: true,
        spentAp: false,
      }),
      false,
      "CD / no-AP click must not dismiss an unaccepted challenge",
    );
    assert.equal(
      attackNearestMarksFirstAction({
        resourceOk: true,
        hasTarget: false,
        spentAp: false,
      }),
      false,
      "no-target flash must not mark",
    );
    assert.equal(
      attackNearestMarksFirstAction({
        resourceOk: true,
        hasTarget: true,
        spentAp: false,
      }),
      false,
      "abort / fizzle-before-spend stays unmarked",
    );
  });

  it("marks first action only after a spent highlighted cast, matching executeCastAttempt", () => {
    assert.equal(castResultSpendsAp("cast"), true);
    assert.equal(castResultSpendsAp("abort"), false);
    assert.equal(
      attackNearestMarksFirstAction({
        resourceOk: true,
        hasTarget: true,
        spentAp: castResultSpendsAp("cast"),
      }),
      true,
    );
    assert.equal(
      attackNearestMarksFirstAction({
        resourceOk: true,
        hasTarget: true,
        spentAp: castResultSpendsAp("abort"),
      }),
      false,
    );
  });
});
