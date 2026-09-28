/**
 * Combat action parity: summon-control kit highlight matches execute.
 * A painted legal target is executable; an illegal target cannot execute.
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { starterSpells } from "../data/spellData.ts";
import type { Enemy, SpellConfig } from "../types/gameTypes.ts";
import {
  canAffordSummonControlHighlight,
  computeSummonControlTargetableTiles,
  resolveSummonControlHighlightSpell,
  summonControlHighlightRange,
  summonControlHighlightedTileIsExecutable,
  summonControlPaintedSpellId,
} from "./summonControlHighlight.ts";
import { collectHighlightLiveMismatches } from "./targeting.ts";

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

function poisonCatalog(): typeof starterSpells {
  return starterSpells.map((s) =>
    s.id === "starter-poison" ? { ...s, lineOfSight: true } : s,
  );
}

describe("summon-control painted spell vs leftover player slot", () => {
  it("never paints a leftover Strike while a summon is controlled", () => {
    assert.equal(
      summonControlPaintedSpellId({
        controllingSummon: true,
        selectedSummonSpellId: "starter-poison",
        selectedPlayerSpellId: "physical_attack",
      }),
      "starter-poison",
    );
    assert.equal(
      summonControlPaintedSpellId({
        controllingSummon: true,
        selectedSummonSpellId: null,
        selectedPlayerSpellId: "physical_attack",
      }),
      null,
    );
    assert.equal(
      summonControlPaintedSpellId({
        controllingSummon: false,
        selectedSummonSpellId: "starter-poison",
        selectedPlayerSpellId: "physical_attack",
      }),
      "physical_attack",
    );
    const leftoverStrike = resolveSummonControlHighlightSpell({
      controllingSummon: true,
      selectedSummonSpellId: null,
      selectedPlayerSpellId: "physical_attack",
      pieceType: "archer",
      catalog: starterSpells,
    });
    assert.equal(leftoverStrike, undefined);
    const kit = resolveSummonControlHighlightSpell({
      controllingSummon: true,
      selectedSummonSpellId: "starter-poison",
      selectedPlayerSpellId: "physical_attack",
      pieceType: "archer",
      catalog: starterSpells,
    });
    assert.equal(kit?.id, "starter-poison");
  });
});

describe("summon-control highlight vs execute", () => {
  it("executes a painted LoS-legal hostile and refuses a wall-blocked one", () => {
    const tiles = floorGrid(11);
    tiles[5][6] = "wall";
    const caster = unit("archer-1", 5, 5, {
      pieceType: "archer",
      side: "player",
      isSummon: true,
      currentAp: 2,
    });
    const open = unit("open", 5, 8, { side: "enemy" });
    const blocked = unit("blocked", 8, 5, { side: "enemy" });
    const combatants = [caster, open, blocked];
    const catalog = poisonCatalog();
    const poison = catalog.find((s) => s.id === "starter-poison");
    assert.ok(poison);
    const range = summonControlHighlightRange(poison);
    assert.equal(range, 4);
    assert.deepEqual(
      collectHighlightLiveMismatches(
        poison as SpellConfig,
        caster,
        combatants,
        tiles,
        range,
      ),
      { highlightOnly: [], liveOnly: [] },
    );

    const highlighted = computeSummonControlTargetableTiles({
      pieceType: "archer",
      selectedSummonSpellId: "starter-poison",
      catalog,
      currentAp: 2,
      caster,
      combatants,
      tiles,
    });
    assert.equal(highlighted.has("5,8"), true);
    assert.equal(highlighted.has("8,5"), false);
    assert.equal(highlighted.has("5,6"), false);
    assert.equal(
      summonControlHighlightedTileIsExecutable({
        pieceType: "archer",
        selectedSummonSpellId: "starter-poison",
        catalog,
        currentAp: 2,
        caster,
        tile: open,
        combatants,
        tiles,
        highlighted: highlighted.has("5,8"),
      }),
      true,
    );
    assert.equal(
      summonControlHighlightedTileIsExecutable({
        pieceType: "archer",
        selectedSummonSpellId: "starter-poison",
        catalog,
        currentAp: 2,
        caster,
        tile: blocked,
        combatants,
        tiles,
        highlighted: highlighted.has("8,5"),
      }),
      false,
    );
    assert.equal(
      summonControlHighlightedTileIsExecutable({
        pieceType: "archer",
        selectedSummonSpellId: "starter-poison",
        catalog,
        currentAp: 2,
        caster,
        tile: { x: 5, y: 7 },
        combatants,
        tiles,
        highlighted: highlighted.has("5,7"),
      }),
      false,
      "empty in-range floor is not a kit occupant and cannot execute",
    );
  });

  it("empties the ring and cannot execute when AP is short", () => {
    const tiles = floorGrid(8);
    const caster = unit("archer-1", 2, 2, {
      pieceType: "archer",
      side: "player",
      isSummon: true,
      currentAp: 1,
    });
    const rat = unit("rat", 4, 2, { side: "enemy" });
    const catalog = poisonCatalog();
    const poison = catalog.find((s) => s.id === "starter-poison");
    assert.ok(poison);
    assert.equal(canAffordSummonControlHighlight(1, poison), false);
    assert.equal(canAffordSummonControlHighlight(2, poison), true);
    const highlighted = computeSummonControlTargetableTiles({
      pieceType: "archer",
      selectedSummonSpellId: "starter-poison",
      catalog,
      currentAp: 1,
      caster,
      combatants: [caster, rat],
      tiles,
    });
    assert.equal(highlighted.size, 0);
    assert.equal(
      summonControlHighlightedTileIsExecutable({
        pieceType: "archer",
        selectedSummonSpellId: "starter-poison",
        catalog,
        currentAp: 1,
        caster,
        tile: rat,
        combatants: [caster, rat],
        tiles,
        highlighted: highlighted.has("4,2"),
      }),
      false,
    );
  });

  it("executes a painted Wisp Blood Mend on the caster tile", () => {
    const tiles = floorGrid(8);
    const caster = unit("wisp-1", 3, 3, {
      pieceType: "wisp",
      side: "player",
      isSummon: true,
      currentAp: 3,
    });
    const highlighted = computeSummonControlTargetableTiles({
      pieceType: "wisp",
      selectedSummonSpellId: "starter-heal",
      catalog: starterSpells,
      currentAp: 3,
      caster,
      combatants: [caster],
      tiles,
    });
    assert.equal(highlighted.has("3,3"), true);
    assert.equal(highlighted.has("4,3"), false);
    assert.equal(
      summonControlHighlightedTileIsExecutable({
        pieceType: "wisp",
        selectedSummonSpellId: "starter-heal",
        catalog: starterSpells,
        currentAp: 3,
        caster,
        tile: caster,
        combatants: [caster],
        tiles,
        highlighted: highlighted.has("3,3"),
      }),
      true,
    );
    assert.equal(
      summonControlHighlightedTileIsExecutable({
        pieceType: "wisp",
        selectedSummonSpellId: "starter-heal",
        catalog: starterSpells,
        currentAp: 3,
        caster,
        tile: { x: 4, y: 3 },
        combatants: [caster],
        tiles,
        highlighted: highlighted.has("4,3"),
      }),
      false,
    );
  });

  it("does not paint or execute when no kit spell is selected", () => {
    const tiles = floorGrid(6);
    const caster = unit("archer-1", 1, 1, {
      pieceType: "archer",
      side: "player",
      isSummon: true,
    });
    const rat = unit("rat", 2, 1, { side: "enemy" });
    const highlighted = computeSummonControlTargetableTiles({
      pieceType: "archer",
      selectedSummonSpellId: null,
      catalog: poisonCatalog(),
      currentAp: 2,
      caster,
      combatants: [caster, rat],
      tiles,
    });
    assert.equal(highlighted.size, 0);
    assert.equal(
      summonControlHighlightedTileIsExecutable({
        pieceType: "archer",
        selectedSummonSpellId: null,
        catalog: poisonCatalog(),
        currentAp: 2,
        caster,
        tile: rat,
        combatants: [caster, rat],
        tiles,
        highlighted: false,
      }),
      false,
    );
  });
});
