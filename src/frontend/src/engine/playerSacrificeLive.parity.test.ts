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
  playerSacrificeLiveHostileAt,
  playerSacrificeLiveRejectReason,
  playerSacrificeRequiresOccupant,
} from "./playerSacrificeLive.ts";
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

function sacrifice(): SpellConfig {
  const row = starterSpells.find((s) => s.id === "spell-sacrifice");
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

describe("playerSacrificeRequiresOccupant", () => {
  it("is Sacrifice-only so #601 Weaken/Slow/DoT/Swap and Strike/Mark stay unique", () => {
    assert.equal(playerSacrificeRequiresOccupant(sacrifice()), true);
    assert.equal(playerSacrificeRequiresOccupant(strike()), false);
    assert.equal(playerSacrificeRequiresOccupant(mark()), false);
    assert.equal(
      playerSacrificeRequiresOccupant({
        isSacrifice: false,
      }),
      false,
    );
  });
});

describe("Sacrifice highlight vs execute occupant", () => {
  const caster = { x: 4, y: 4 };
  const tiles = floorGrid(9);
  const rat = unit("rat", 5, 4, { side: "enemy" });
  const corpse = unit("corpse", 4, 5, { side: "enemy", hp: 0 });
  const wolf = unit("wolf", 3, 4, { isSummon: true, side: "player" });
  const far = unit("far", 7, 4, { side: "enemy" });
  const spell = sacrifice();
  const range = Number(spell.range);

  it("lets a highlighted living hostile execute and refuses empty / corpse / ally / far", () => {
    const enemies = [rat, corpse, wolf, far];
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
    assert.equal(highlighted.has("5,4"), true);
    assert.equal(highlighted.has("4,5"), false, "corpse is not a live hostile");
    assert.equal(highlighted.has("3,4"), false, "player summon is not hostile");
    assert.equal(highlighted.has("4,3"), false, "empty adjacent");
    assert.equal(highlighted.has("7,4"), false, "range 1");

    const legal = planPlayerCastAttempt({
      spell,
      caster,
      tile: { x: 5, y: 4 },
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
    assert.equal(playerSacrificeLiveHostileAt({ x: 5, y: 4 }, enemies), true);
    assert.equal(
      playerSacrificeLiveRejectReason({
        spell,
        tile: { x: 5, y: 4 },
        combatants: enemies,
      }),
      null,
    );

    for (const tile of [
      { x: 4, y: 3 },
      { x: 4, y: 5 },
      { x: 3, y: 4 },
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

    const emptyLive = isTileCastableLive(
      spell,
      caster,
      { x: 4, y: 3 },
      enemies,
      tiles,
      range,
    );
    assert.equal(emptyLive.reason, "sacrifice_no_enemy");
    assert.deepEqual(
      decideTileCastClick({
        live: emptyLive,
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
        liveOk: shouldExecuteLiveCast(emptyLive),
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
            { x: 5, y: 4 },
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

  it("Attack Nearest / keyboard S pick the living hostile, not a corpse or empty", () => {
    const enemies = [corpse, wolf, rat];
    const picked = pickAttackNearestTile(spell, caster, enemies, tiles, range);
    assert.deepEqual(picked, { x: 5, y: 4 });
    assert.equal(isActiveHostile(rat), true);
    assert.equal(isActiveHostile(corpse), false);
    const live = isTileCastableLive(
      spell,
      caster,
      picked!,
      enemies,
      tiles,
      range,
    );
    assert.equal(shouldExecuteLiveCast(live), true);
    assert.equal(
      pickAttackNearestTile(spell, caster, [corpse, wolf], tiles, range),
      null,
    );
  });

  it("does not fold Strike / Mark empty rings into the Sacrifice occupant gate", () => {
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
    const strikeEmpty = planPlayerCastAttempt({
      spell: strikeSpell,
      caster,
      tile: { x: 4, y: 3 },
      liveCombatants: enemies,
      mapTiles: tiles,
      effectiveRange: 1,
      currentAp: 6,
      baseApCost: 2,
      cooldownTurnsRemaining: 0,
    });
    assert.equal(strikeEmpty.ok, true);
    assert.equal(
      playerSacrificeLiveRejectReason({
        spell: strikeSpell,
        tile: { x: 4, y: 3 },
        combatants: enemies,
      }),
      null,
    );
  });
});
