import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { starterSpells } from "../data/spellData.ts";
import type { Enemy, SpellConfig } from "../types/gameTypes.ts";
import {
  planPlayerCastAttempt,
  playerCastAttemptResult,
} from "./playerCastPlan.ts";
import {
  attackNearestResolvesOnEmptyGround,
  pickNearestLiveOkTile,
  playerGroundPlacementLiveRejectReason,
  playerGroundPlacementRequiresWalkableTile,
} from "./playerGroundPlacement.ts";
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
    ...extras,
  } as Enemy;
}

function summonWolf(): SpellConfig {
  const row = starterSpells.find((s) => s.id === "summon-dire-wolf");
  assert.ok(row);
  return { ...row, maxRange: Number(row.range), minRange: 1 } as SpellConfig;
}

function barrier(): SpellConfig {
  const row = starterSpells.find((s) => s.id === "spell-barrier");
  assert.ok(row);
  return { ...row, maxRange: Number(row.range), minRange: 1 } as SpellConfig;
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

function mark(): SpellConfig {
  return {
    id: "spell-mark",
    name: "Mark",
    description: "",
    iconEmoji: "",
    apCost: 2n,
    mpCost: 0n,
    damage: 0n,
    range: 4n,
    effectType: "debuff",
    targetType: "enemy",
    isMark: true,
    maxRange: 4,
    minRange: 1,
  } as SpellConfig;
}

describe("playerGroundPlacementRequiresWalkableTile", () => {
  it("is ground-placement only so Strike / Mark / Sacrifice stay unique", () => {
    assert.equal(playerGroundPlacementRequiresWalkableTile(summonWolf()), true);
    assert.equal(playerGroundPlacementRequiresWalkableTile(barrier()), true);
    assert.equal(
      playerGroundPlacementRequiresWalkableTile({ isTrap: true }),
      true,
    );
    assert.equal(playerGroundPlacementRequiresWalkableTile(strike()), false);
    assert.equal(playerGroundPlacementRequiresWalkableTile(mark()), false);
    assert.equal(
      playerGroundPlacementRequiresWalkableTile({ isSacrifice: true } as {
        targetType?: string;
      }),
      false,
    );
    assert.equal(attackNearestResolvesOnEmptyGround(summonWolf()), true);
    assert.equal(attackNearestResolvesOnEmptyGround(strike()), false);
  });
});

describe("ground placement highlight vs execute walkability", () => {
  const caster = { x: 4, y: 4 };
  const tiles = floorGrid(9);
  tiles[4][5] = "portal";
  const rat = unit("rat", 4, 6, { side: "enemy" });
  const spell = summonWolf();
  const range = Number(spell.range);

  it("lets a highlighted empty floor execute and refuses portal / occupied / far", () => {
    const enemies = [rat];
    const grid = {
      tiles,
      enemies,
      worldGridSize: 9,
      effectiveRange: range,
      barrierTiles: new Map<string, number>(),
    };
    assert.deepEqual(collectHighlightLiveMismatches(spell, caster, grid), {
      highlightOnly: [],
      liveOnly: [],
    });
    const highlighted = computeTargetableTiles(spell, caster, grid);
    assert.equal(highlighted.has("4,3"), true, "empty adjacent floor");
    assert.equal(highlighted.has("5,4"), false, "portal is not walkable spawn");
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
      });
      assert.equal(attempt.ok, false, `${tile.x},${tile.y} must not spend AP`);
      assert.equal(playerCastAttemptResult(attempt), "abort");
      assert.equal(attempt.apCost, 0);
      assert.equal(shouldExecuteLiveCast(attempt.live), false);
    }

    const portalLive = isTileCastableLive(
      spell,
      caster,
      { x: 5, y: 4 },
      enemies,
      tiles,
      range,
    );
    assert.equal(portalLive.reason, "ground_portal");
    assert.equal(playerFacingRejectReason("ground_portal"), "Blocked");
    assert.equal(
      playerGroundPlacementLiveRejectReason({
        spell,
        tileType: "portal",
      }),
      "ground_portal",
    );
    assert.deepEqual(
      decideTileCastClick({
        live: portalLive,
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
        liveOk: shouldExecuteLiveCast(portalLive),
        selfOrAllySpell: false,
        hasBasicAttack: false,
      }),
      { action: "reject_live" },
    );
    assert.deepEqual(
      decideSpriteCastClick({
        selectedSpellId: spell.id,
        hasSelectedSpell: true,
        hitKind: "enemy",
        playerCastOk: true,
        inBattle: true,
        liveOk: shouldExecuteLiveCast(
          isTileCastableLive(
            spell,
            caster,
            { x: 4, y: 3 },
            enemies,
            tiles,
            range,
          ),
        ),
        selfOrAllySpell: false,
        hasBasicAttack: false,
      }),
      { action: "execute", source: "sprite-enemy" },
    );
  });

  it("Attack Nearest / keyboard S pick the nearest highlighted floor, not a portal", () => {
    const enemies = [rat];
    const picked = pickAttackNearestTile(spell, caster, enemies, tiles, range);
    assert.ok(picked);
    assert.notDeepEqual(picked, { x: 5, y: 4 }, "must not pick the portal");
    assert.notDeepEqual(picked, { x: 4, y: 6 }, "must not pick occupied");
    const highlighted = computeTargetableTiles(spell, caster, {
      tiles,
      enemies,
      worldGridSize: 9,
      effectiveRange: range,
      barrierTiles: new Map(),
    });
    assert.equal(highlighted.has(`${picked.x},${picked.y}`), true);
    const live = isTileCastableLive(
      spell,
      caster,
      picked,
      enemies,
      tiles,
      range,
    );
    assert.equal(shouldExecuteLiveCast(live), true);
    assert.deepEqual(
      pickNearestLiveOkTile(spell, caster, enemies, tiles, range),
      picked,
    );
    const planned = planPlayerCastAttempt({
      spell,
      caster,
      tile: picked,
      liveCombatants: enemies,
      mapTiles: tiles,
      effectiveRange: range,
      currentAp: 6,
      baseApCost: Number(spell.apCost),
      cooldownTurnsRemaining: 0,
    });
    assert.equal(playerCastAttemptResult(planned), "ok");
  });

  it("does not fold Strike / Mark portal-as-floor or empty rings into the gate", () => {
    const enemies = [rat];
    const strikeSpell = strike();
    const markSpell = mark();
    const strikeHi = computeTargetableTiles(strikeSpell, caster, {
      tiles,
      enemies,
      worldGridSize: 9,
      effectiveRange: 1,
      barrierTiles: new Map(),
    });
    const markHi = computeTargetableTiles(markSpell, caster, {
      tiles,
      enemies,
      worldGridSize: 9,
      effectiveRange: 4,
      barrierTiles: new Map(),
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
      "Strike still treats portal as floor",
    );
    const strikePortal = planPlayerCastAttempt({
      spell: strikeSpell,
      caster,
      tile: { x: 5, y: 4 },
      liveCombatants: enemies,
      mapTiles: tiles,
      effectiveRange: 1,
      currentAp: 6,
      baseApCost: 2,
      cooldownTurnsRemaining: 0,
    });
    assert.equal(strikePortal.ok, true);
    assert.equal(
      playerGroundPlacementLiveRejectReason({
        spell: strikeSpell,
        tileType: "portal",
      }),
      null,
    );
    assert.equal(
      pickAttackNearestTile(strikeSpell, caster, enemies, tiles, 1),
      null,
      "Strike Attack Nearest still requires a live hostile in range",
    );
  });

  it("Barrier shares the same portal reject and Attack Nearest empty pick", () => {
    const wallSpell = barrier();
    const wallRange = Number(wallSpell.range);
    const enemies = [rat];
    const grid = {
      tiles,
      enemies,
      worldGridSize: 9,
      effectiveRange: wallRange,
      barrierTiles: new Map<string, number>(),
    };
    assert.deepEqual(collectHighlightLiveMismatches(wallSpell, caster, grid), {
      highlightOnly: [],
      liveOnly: [],
    });
    const highlighted = computeTargetableTiles(wallSpell, caster, grid);
    assert.equal(highlighted.has("5,4"), false);
    assert.equal(highlighted.has("4,3"), true);
    const portalLive = isTileCastableLive(
      wallSpell,
      caster,
      { x: 5, y: 4 },
      enemies,
      tiles,
      wallRange,
    );
    assert.equal(portalLive.reason, "ground_portal");
    const picked = pickAttackNearestTile(
      wallSpell,
      caster,
      enemies,
      tiles,
      wallRange,
    );
    assert.ok(picked);
    assert.equal(highlighted.has(`${picked.x},${picked.y}`), true);
    const planned = planPlayerCastAttempt({
      spell: wallSpell,
      caster,
      tile: picked,
      liveCombatants: enemies,
      mapTiles: tiles,
      effectiveRange: wallRange,
      currentAp: 6,
      baseApCost: Number(wallSpell.apCost),
      cooldownTurnsRemaining: 0,
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
    });
    assert.equal(playerCastAttemptResult(illegal), "abort");
    assert.equal(illegal.apCost, 0);
  });
});
