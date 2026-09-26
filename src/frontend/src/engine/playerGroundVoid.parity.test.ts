import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { starterSpells } from "../data/spellData.ts";
import type { Enemy, SpellConfig } from "../types/gameTypes.ts";
import {
  planPlayerCastAttempt,
  playerCastAttemptResult,
} from "./playerCastPlan.ts";
import {
  bindPlayerCastVoidTiles,
  playerGroundVoidApplies,
  playerGroundVoidLiveRejectReason,
} from "./playerGroundVoid.ts";
import { playerFacingRejectReason } from "./rejectCopy.ts";
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
  return {
    ...spell,
    maxRange: Number(spell.range),
    minRange: 1,
  } as SpellConfig;
}

describe("playerGroundVoidApplies", () => {
  it("is ground-placement only so Strike / Mark empty rings stay unique", () => {
    assert.equal(playerGroundVoidApplies(byId("summon-dire-wolf")), true);
    assert.equal(playerGroundVoidApplies(byId("spell-barrier")), true);
    assert.equal(playerGroundVoidApplies({ targetType: "ground" }), true);
    assert.equal(playerGroundVoidApplies(byId("physical_attack")), false);
    assert.equal(playerGroundVoidApplies(byId("spell-mark")), false);
    assert.equal(playerGroundVoidApplies({ targetType: "enemy" }), false);
    assert.equal(
      playerGroundVoidLiveRejectReason({
        spell: byId("physical_attack"),
        destKey: "5,4",
        voidTiles: new Set(["5,4"]),
      }),
      null,
    );
    assert.equal(
      playerGroundVoidLiveRejectReason({
        spell: byId("summon-dire-wolf"),
        destKey: "5,4",
        voidTiles: new Set(["5,4"]),
      }),
      "ground_void",
    );
  });
});

describe("ground placement highlight vs execute void holes", () => {
  const caster = { x: 4, y: 4 };
  const tiles = floorGrid(9);
  const rat = unit("rat", 4, 6);
  const spell = byId("summon-dire-wolf");
  const range = Number(spell.range);
  const voidTiles = new Set(["5,4"]);

  it("lets a highlighted empty floor execute and refuses void / occupied / far", () => {
    bindPlayerCastVoidTiles(voidTiles);
    const enemies = [rat];
    const grid = {
      tiles,
      enemies,
      worldGridSize: 9,
      effectiveRange: range,
      barrierTiles: new Map<string, number>(),
      voidTiles,
    };
    assert.deepEqual(collectHighlightLiveMismatches(spell, caster, grid), {
      highlightOnly: [],
      liveOnly: [],
    });
    const highlighted = computeTargetableTiles(spell, caster, grid);
    assert.equal(highlighted.has("4,3"), true, "empty adjacent floor");
    assert.equal(
      highlighted.has("5,4"),
      false,
      "void hole is not walkable spawn",
    );
    assert.equal(highlighted.has("4,6"), false, "occupied by a hostile");
    assert.equal(highlighted.has("4,4"), false, "caster tile");
    assert.equal(highlighted.has("7,4"), false, "Manhattan 3 > range 2");

    const legal = planPlayerCastAttempt({
      spell,
      caster,
      tile: { x: 4, y: 3 },
      liveCombatants: enemies,
      mapTiles: tiles,
      effectiveRange: range,
      currentAp: 6,
      baseApCost: Number(spell.apCost),
      cooldownTurnsRemaining: 0,
      voidTiles,
    });
    assert.equal(legal.ok, true);
    assert.equal(playerCastAttemptResult(legal), "ok");
    assert.equal(shouldExecuteLiveCast(legal.live), true);

    for (const tile of [
      { x: 5, y: 4 },
      { x: 4, y: 6 },
      { x: 7, y: 4 },
    ]) {
      const attempt = planPlayerCastAttempt({
        spell,
        caster,
        tile,
        liveCombatants: enemies,
        mapTiles: tiles,
        effectiveRange: range,
        currentAp: 6,
        baseApCost: Number(spell.apCost),
        cooldownTurnsRemaining: 0,
        voidTiles,
      });
      assert.equal(attempt.ok, false, `${tile.x},${tile.y} must not spend AP`);
      assert.equal(playerCastAttemptResult(attempt), "abort");
      assert.equal(attempt.apCost, 0);
      assert.equal(shouldExecuteLiveCast(attempt.live), false);
    }

    const voidLive = isTileCastableLive(
      spell,
      caster,
      { x: 5, y: 4 },
      enemies,
      tiles,
      range,
    );
    assert.equal(voidLive.reason, "ground_void");
    assert.equal(playerFacingRejectReason("ground_void"), "Blocked");
    assert.deepEqual(
      decideTileCastClick({
        live: voidLive,
        tileHighlighted: false,
        occupantIsLiveHostile: false,
      }),
      { action: "reject", reason: "out_of_range" },
    );
    assert.deepEqual(
      decideSpriteCastClick({
        selectedSpellId: spell.id,
        hasSelectedSpell: true,
        hitKind: "enemy",
        playerCastOk: true,
        inBattle: true,
        liveOk: shouldExecuteLiveCast(voidLive),
        selfOrAllySpell: false,
        hasBasicAttack: false,
      }),
      { action: "reject_live" },
    );
    const legalLive = isTileCastableLive(
      spell,
      caster,
      { x: 4, y: 3 },
      enemies,
      tiles,
      range,
    );
    assert.deepEqual(
      decideTileCastClick({
        live: legalLive,
        tileHighlighted: highlighted.has("4,3"),
        occupantIsLiveHostile: false,
      }),
      { action: "execute", bypassHighlight: false },
    );
    bindPlayerCastVoidTiles(null);
  });

  it("does not fold Strike / Mark void-as-floor or empty rings into the gate", () => {
    bindPlayerCastVoidTiles(voidTiles);
    const enemies = [rat];
    const strikeSpell = byId("physical_attack");
    const markSpell = byId("spell-mark");
    const strikeHi = computeTargetableTiles(strikeSpell, caster, {
      tiles,
      enemies,
      worldGridSize: 9,
      effectiveRange: 1,
      barrierTiles: new Map(),
      voidTiles,
    });
    const markHi = computeTargetableTiles(markSpell, caster, {
      tiles,
      enemies,
      worldGridSize: 9,
      effectiveRange: 4,
      barrierTiles: new Map(),
      voidTiles,
    });
    assert.equal(
      strikeHi.has("4,3"),
      true,
      "Strike empty adjacent stays legal",
    );
    assert.equal(markHi.has("4,3"), true, "Mark empty stays legal");
    assert.equal(
      strikeHi.has("5,4"),
      true,
      "Strike still treats void as floor",
    );
    const strikeVoid = planPlayerCastAttempt({
      spell: strikeSpell,
      caster,
      tile: { x: 5, y: 4 },
      liveCombatants: enemies,
      mapTiles: tiles,
      effectiveRange: 1,
      currentAp: 6,
      baseApCost: 2,
      cooldownTurnsRemaining: 0,
      voidTiles,
    });
    assert.equal(strikeVoid.ok, true);
    assert.equal(
      playerGroundVoidLiveRejectReason({
        spell: strikeSpell,
        destKey: "5,4",
        voidTiles,
      }),
      null,
    );
    assert.equal(
      pickAttackNearestTile(strikeSpell, caster, enemies, tiles, 1),
      null,
      "Strike Attack Nearest still requires a live hostile in range",
    );
    bindPlayerCastVoidTiles(null);
  });

  it("rejects a void hole from planPlayerCastAttempt without leftover bind", () => {
    bindPlayerCastVoidTiles(null);
    const illegal = planPlayerCastAttempt({
      spell,
      caster,
      tile: { x: 5, y: 4 },
      liveCombatants: [rat],
      mapTiles: tiles,
      effectiveRange: range,
      currentAp: 6,
      baseApCost: Number(spell.apCost),
      cooldownTurnsRemaining: 0,
      voidTiles,
    });
    assert.equal(illegal.reason, "ground_void");
    assert.equal(playerCastAttemptResult(illegal), "abort");
    assert.equal(shouldExecuteLiveCast(illegal.live), false);
    const legal = planPlayerCastAttempt({
      spell,
      caster,
      tile: { x: 4, y: 3 },
      liveCombatants: [rat],
      mapTiles: tiles,
      effectiveRange: range,
      currentAp: 6,
      baseApCost: Number(spell.apCost),
      cooldownTurnsRemaining: 0,
      voidTiles,
    });
    assert.equal(legal.ok, true);
    bindPlayerCastVoidTiles(null);
  });

  it("Barrier shares the same void reject so a highlighted hole cannot execute", () => {
    const wallSpell = byId("spell-barrier");
    const wallRange = Number(wallSpell.range);
    const enemies = [rat];
    bindPlayerCastVoidTiles(voidTiles);
    const grid = {
      tiles,
      enemies,
      worldGridSize: 9,
      effectiveRange: wallRange,
      barrierTiles: new Map<string, number>(),
      voidTiles,
    };
    assert.deepEqual(collectHighlightLiveMismatches(wallSpell, caster, grid), {
      highlightOnly: [],
      liveOnly: [],
    });
    const highlighted = computeTargetableTiles(wallSpell, caster, grid);
    assert.equal(highlighted.has("5,4"), false);
    assert.equal(highlighted.has("4,3"), true);
    const voidLive = isTileCastableLive(
      wallSpell,
      caster,
      { x: 5, y: 4 },
      enemies,
      tiles,
      wallRange,
    );
    assert.equal(voidLive.reason, "ground_void");
    const planned = planPlayerCastAttempt({
      spell: wallSpell,
      caster,
      tile: { x: 4, y: 3 },
      liveCombatants: enemies,
      mapTiles: tiles,
      effectiveRange: wallRange,
      currentAp: 6,
      baseApCost: Number(wallSpell.apCost),
      cooldownTurnsRemaining: 0,
      voidTiles,
    });
    assert.equal(playerCastAttemptResult(planned), "ok");
    const illegal = planPlayerCastAttempt({
      spell: wallSpell,
      caster,
      tile: { x: 5, y: 4 },
      liveCombatants: enemies,
      mapTiles: tiles,
      effectiveRange: wallRange,
      currentAp: 6,
      baseApCost: Number(wallSpell.apCost),
      cooldownTurnsRemaining: 0,
      voidTiles,
    });
    assert.equal(playerCastAttemptResult(illegal), "abort");
    assert.equal(illegal.apCost, 0);
    bindPlayerCastVoidTiles(null);
  });
});
