import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { starterSpells } from "../data/spellData.ts";
import type { Enemy, SpellConfig } from "../types/gameTypes.ts";
import { isActiveHostile } from "./battleSetup.ts";
import {
  planPlayerCastAttempt,
  playerCastAttemptResult,
} from "./playerCastPlan.ts";
import {
  playerOccupantLiveHostileAt,
  playerOccupantRequiredLiveRejectReason,
  playerOccupantRequiredOnClick,
  playerOccupantRequiredTargetType,
} from "./playerOccupantRequiredLive.ts";
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

describe("playerOccupantRequiredLive predicates", () => {
  it("requires a living hostile for Weaken, Slow, DoT, and Swap only", () => {
    assert.equal(playerOccupantRequiredOnClick(byId("spell-weaken")), true);
    assert.equal(playerOccupantRequiredOnClick(byId("spell-slow")), true);
    assert.equal(playerOccupantRequiredOnClick(byId("starter-poison")), true);
    assert.equal(
      playerOccupantRequiredOnClick(byId("spell-venom-strike")),
      true,
    );
    assert.equal(playerOccupantRequiredOnClick(byId("spell-inferno")), true);
    assert.equal(playerOccupantRequiredOnClick(byId("spell-swap")), true);

    assert.equal(playerOccupantRequiredOnClick(byId("physical_attack")), false);
    assert.equal(playerOccupantRequiredOnClick(byId("spell-mark")), false);
    assert.equal(playerOccupantRequiredOnClick(byId("starter-frost")), false);
    assert.equal(playerOccupantRequiredOnClick(byId("starter-drain")), false);
    assert.equal(
      playerOccupantRequiredOnClick(byId("spell-frost-nova")),
      false,
    );
    assert.equal(playerOccupantRequiredOnClick(byId("starter-shield")), false);
    assert.equal(playerOccupantRequiredTargetType("enemy"), true);
    assert.equal(playerOccupantRequiredTargetType("chain"), true);
    assert.equal(playerOccupantRequiredTargetType("self"), false);
    assert.equal(playerOccupantRequiredTargetType("ground"), false);
  });

  it("does not steal Strike / Mark / Frost Bolt empty rings", () => {
    const empty = { x: 5, y: 5 };
    assert.equal(
      playerOccupantRequiredLiveRejectReason({
        spell: byId("physical_attack"),
        targetType: "enemy",
        tile: empty,
        combatants: [],
      }),
      null,
    );
    assert.equal(
      playerOccupantRequiredLiveRejectReason({
        spell: byId("spell-mark"),
        targetType: "enemy",
        tile: empty,
        combatants: [],
      }),
      null,
    );
    assert.equal(
      playerOccupantRequiredLiveRejectReason({
        spell: byId("starter-frost"),
        targetType: "enemy",
        tile: empty,
        combatants: [],
      }),
      null,
    );
    assert.equal(
      playerOccupantRequiredLiveRejectReason({
        spell: byId("spell-weaken"),
        targetType: "enemy",
        tile: empty,
        combatants: [],
      }),
      "occupant_required",
    );
  });
});

describe("Weaken / Slow / DoT / Swap highlight vs execute", () => {
  const tiles = floorGrid(11);
  const caster = { x: 4, y: 4 };
  const rat = unit("rat", 5, 4);
  const far = unit("far", 10, 10);
  const corpse = unit("corpse", 4, 5, { hp: 0 });
  const ally = unit("wolf", 5, 5, { isSummon: true, side: "player" });
  const enemies = [rat, far, corpse, ally];
  const barriers = new Map<string, number>();

  const kits: Array<{ id: string; range: number }> = [
    { id: "spell-weaken", range: Number(byId("spell-weaken").range) },
    { id: "spell-slow", range: Number(byId("spell-slow").range) },
    { id: "starter-poison", range: Number(byId("starter-poison").range) },
    { id: "spell-swap", range: Number(byId("spell-swap").range) },
  ];

  for (const { id, range } of kits) {
    it(`${id}: a highlighted hostile is executable; empty / corpse / ally / far cannot`, () => {
      const spell = byId(id);
      const grid = {
        tiles,
        enemies,
        worldGridSize: 11,
        effectiveRange: range,
        barrierTiles: barriers,
      };
      assert.deepEqual(collectHighlightLiveMismatches(spell, caster, grid), {
        highlightOnly: [],
        liveOnly: [],
      });
      const highlighted = computeTargetableTiles(spell, caster, grid);
      assert.equal(highlighted.has("5,4"), true, "living hostile");
      assert.equal(highlighted.has("4,5"), false, "corpse");
      assert.equal(highlighted.has("5,5"), false, "ally summon / empty");
      assert.equal(highlighted.has("6,4"), false, "empty in-range");
      assert.equal(highlighted.has("10,10"), false, "far");
      assert.equal(highlighted.has("4,4"), false, "caster tile");

      assert.equal(playerOccupantLiveHostileAt({ x: 5, y: 4 }, enemies), true);
      assert.equal(playerOccupantLiveHostileAt({ x: 4, y: 5 }, enemies), false);
      assert.equal(playerOccupantLiveHostileAt({ x: 5, y: 5 }, enemies), false);
      assert.equal(isActiveHostile(corpse), false);
      assert.equal(isActiveHostile(ally), false);

      const legalLive = isTileCastableLive(
        spell,
        caster,
        { x: 5, y: 4 },
        enemies,
        tiles,
        range,
        barriers,
      );
      const emptyLive = isTileCastableLive(
        spell,
        caster,
        { x: 6, y: 4 },
        enemies,
        tiles,
        range,
        barriers,
      );
      const corpseLive = isTileCastableLive(
        spell,
        caster,
        { x: 4, y: 5 },
        enemies,
        tiles,
        range,
        barriers,
      );
      assert.equal(shouldExecuteLiveCast(legalLive), true);
      assert.equal(shouldExecuteLiveCast(emptyLive), false);
      assert.equal(emptyLive.reason, "occupant_required");
      assert.equal(shouldExecuteLiveCast(corpseLive), false);

      const legalPlan = planPlayerCastAttempt({
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
      assert.equal(legalPlan.ok, true);
      assert.equal(playerCastAttemptResult(legalPlan), "ok");

      const emptyPlan = planPlayerCastAttempt({
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
      assert.equal(emptyPlan.ok, false);
      assert.equal(playerCastAttemptResult(emptyPlan), "abort");
      assert.equal(emptyPlan.apCost, 0);

      const tileClickLegal = decideTileCastClick({
        live: legalLive,
        tileHighlighted: highlighted.has("5,4"),
        occupantIsLiveHostile: true,
      });
      assert.equal(tileClickLegal.action, "execute");
      const tileClickEmpty = decideTileCastClick({
        live: emptyLive,
        tileHighlighted: highlighted.has("6,4"),
        occupantIsLiveHostile: false,
      });
      assert.equal(tileClickEmpty.action, "reject");

      const spriteLegal = decideSpriteCastClick({
        selectedSpellId: spell.id,
        hasSelectedSpell: true,
        hitKind: "enemy",
        playerCastOk: true,
        inBattle: true,
        liveOk: shouldExecuteLiveCast(legalLive),
        selfOrAllySpell: false,
        hasBasicAttack: true,
      });
      assert.equal(spriteLegal.action, "execute");
      const spriteEmpty = decideSpriteCastClick({
        selectedSpellId: spell.id,
        hasSelectedSpell: true,
        hitKind: "enemy",
        playerCastOk: true,
        inBattle: true,
        liveOk: shouldExecuteLiveCast(emptyLive),
        selfOrAllySpell: false,
        hasBasicAttack: true,
      });
      assert.equal(spriteEmpty.action, "reject_live");

      const nearest = pickAttackNearestTile(
        spell,
        caster,
        enemies,
        tiles,
        range,
        barriers,
      );
      assert.deepEqual(nearest, { x: 5, y: 4 });
    });
  }

  it("Strike and Mark empty in-range tiles stay highlighted and executable", () => {
    const cases: Array<{ spell: SpellConfig; tile: { x: number; y: number } }> =
      [
        { spell: byId("physical_attack"), tile: { x: 3, y: 4 } },
        { spell: byId("spell-mark"), tile: { x: 6, y: 4 } },
      ];
    for (const { spell, tile } of cases) {
      const range = Number(spell.maxRange ?? spell.range);
      const grid = {
        tiles,
        enemies,
        worldGridSize: 11,
        effectiveRange: range,
        barrierTiles: barriers,
      };
      const highlighted = computeTargetableTiles(spell, caster, grid);
      const key = `${tile.x},${tile.y}`;
      assert.equal(highlighted.has(key), true, `${spell.id} empty ring`);
      const emptyLive = isTileCastableLive(
        spell,
        caster,
        tile,
        enemies,
        tiles,
        range,
        barriers,
      );
      assert.equal(shouldExecuteLiveCast(emptyLive), true);
      const plan = planPlayerCastAttempt({
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
      assert.equal(plan.ok, true, spell.id);
    }
  });

  it("Attack Nearest cannot execute Weaken when only a corpse remains", () => {
    const spell = byId("spell-weaken");
    const onlyCorpse = [corpse];
    const nearest = pickAttackNearestTile(
      spell,
      caster,
      onlyCorpse,
      tiles,
      Number(spell.range),
      barriers,
    );
    assert.equal(nearest, null);
    const live = isTileCastableLive(
      spell,
      caster,
      { x: 4, y: 5 },
      onlyCorpse,
      tiles,
      Number(spell.range),
      barriers,
    );
    assert.equal(shouldExecuteLiveCast(live), false);
  });
});
