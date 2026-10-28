/**
 * Combat action parity: a highlighted legal summon-control sprite dest
 * is executable, and an illegal dest cannot execute. Live WX summon-
 * control still returns before sprite-first hit testing.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { physicalAttackSpell, starterSpells } from "../data/spellData.ts";
import type { Enemy, SpellConfig } from "../types/gameTypes.ts";
import { pickSummonControlClickTarget } from "../utils/summonControlCast.ts";
import {
  SUMMON_CONTROL_SPRITE_PAD_MOUSE,
  SUMMON_CONTROL_SPRITE_PAD_TOUCH,
  executeSummonControlSpriteClick,
  isSummonControlSpriteClickPad,
  liveWxSummonControlRunsSpriteFirst,
  liveWxSummonControlSpritePadMouse,
  liveWxSummonControlSpritePadTouch,
  pickSummonControlSpriteClickTile,
  shouldPreferSummonControlSpriteLogicalTile,
  summonControlSpriteClickHighlightedIsExecutable,
} from "./summonControlSpriteClick.ts";
import { type TileType, computeTargetableTiles } from "./targeting.ts";

function here(): string {
  return dirname(fileURLToPath(import.meta.url));
}

function mustSpell(id: string): SpellConfig {
  const spell = starterSpells.find((s) => s.id === id);
  assert.ok(spell, id);
  return spell;
}

function wxSource(): string {
  return readFileSync(
    join(here(), "../components/WorldExploration.tsx"),
    "utf8",
  );
}

function summonControlBlock(label: "mouse" | "touch"): string {
  const wx = wxSource();
  const heading =
    label === "mouse"
      ? "SUMMON CONTROL ROUTING ─"
      : "SUMMON CONTROL ROUTING (touch)";
  const start = wx.indexOf(heading);
  assert.ok(start >= 0, `live ${label} summon-control heading is present`);
  const spriteHeading =
    label === "mouse"
      ? "SPRITE-FIRST HIT TESTING (mouse)"
      : "SPRITE-FIRST HIT TESTING (touch)";
  const end = wx.indexOf(spriteHeading, start);
  assert.ok(end > start, `${label} sprite-first still follows summon-control`);
  return wx.slice(start, end);
}

function spriteFirstBlock(label: "mouse" | "touch"): string {
  const wx = wxSource();
  const heading =
    label === "mouse"
      ? "SPRITE-FIRST HIT TESTING (mouse)"
      : "SPRITE-FIRST HIT TESTING (touch)";
  const start = wx.indexOf(heading);
  assert.ok(start >= 0, `live ${label} sprite-first heading is present`);
  const end =
    label === "mouse"
      ? wx.indexOf("const handleCanvasTouch = useCallback(", start)
      : start + 2400;
  assert.ok(end > start, `${label} sprite-first block is bounded`);
  return wx.slice(start, end);
}

function floorGrid(size: number): TileType[][] {
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

describe("player-controlled summon kit sprite-first dest vs execute", () => {
  const inferno = mustSpell("spell-inferno");
  const poison = mustSpell("starter-poison");
  const venom = mustSpell("spell-venom-strike");
  const frost = mustSpell("starter-frost");
  const slow = mustSpell("spell-slow");
  const mend = mustSpell("starter-heal");
  const bomberSpell = mustSpell("summon-bomber");
  const wolf = mustSpell("summon-dire-wolf");
  const archerSpell = mustSpell("summon-archer");
  const tiles = floorGrid(12);
  const summon = unit("bomber", 5, 5, {
    side: "player",
    isSummon: true,
    pieceType: "pawn",
  });
  const inRange = unit("rat", 8, 5, { side: "enemy" });
  const missedGrid = { x: 8, y: 4 };
  const spriteHit = {
    kind: "enemy",
    logicalX: 8,
    logicalY: 5,
    isAlive: true,
  };

  const readyArgs = {
    routedToSummonControl: true,
    selectedKitSpellId: "spell-inferno",
    spriteHit,
    gridTile: missedGrid,
  };

  const readyWorld = {
    caster: summon,
    combatants: [summon, inRange],
    tiles,
  };

  it("treats catalog Inferno as the unique-fire kit spell", () => {
    assert.equal(inferno.spellType, "damage");
    assert.equal(Number(inferno.damage), 0);
    assert.equal(inferno.isDotSpell, true);
    assert.equal(Number(inferno.range), 3);
    assert.equal(Number(inferno.apCost), 5);
    assert.deepEqual(bomberSpell.summonUnitDef?.summonKit, ["spell-inferno"]);
    assert.equal(bomberSpell.summonUnitDef?.ap, 1);
    assert.deepEqual(wolf.summonUnitDef?.summonKit, [
      "physical_attack",
      "spell-venom-strike",
    ]);
    assert.deepEqual(archerSpell.summonUnitDef?.summonKit, [
      "starter-poison",
      "spell-slow",
    ]);
  });

  it("locks mouse pad 10 and touch pad 14; do not merge them", () => {
    assert.equal(SUMMON_CONTROL_SPRITE_PAD_MOUSE, 10);
    assert.equal(SUMMON_CONTROL_SPRITE_PAD_TOUCH, 14);
    assert.equal(liveWxSummonControlSpritePadMouse(), 10);
    assert.equal(liveWxSummonControlSpritePadTouch(), 14);
    assert.equal(isSummonControlSpriteClickPad(10, "mouse"), true);
    assert.equal(isSummonControlSpriteClickPad(14, "touch"), true);
    assert.equal(isSummonControlSpriteClickPad(14, "mouse"), false);
    assert.equal(isSummonControlSpriteClickPad(10, "touch"), false);
  });

  it("sprite logical tile wins when clientToGrid missed onto an empty neighbour", () => {
    assert.equal(shouldPreferSummonControlSpriteLogicalTile(readyArgs), true);
    assert.deepEqual(pickSummonControlSpriteClickTile(readyArgs), {
      x: 8,
      y: 5,
    });
    assert.equal(
      pickSummonControlClickTarget({
        spell: inferno,
        caster: summon,
        tile: missedGrid,
        combatants: readyWorld.combatants,
        tiles,
      }),
      null,
      "live clientToGrid neighbour has no occupant",
    );
    const target = executeSummonControlSpriteClick({
      ...readyArgs,
      spell: inferno,
      world: readyWorld,
    });
    assert.equal(target?.id, "rat");
    const highlightedTiles = computeTargetableTiles(inferno, summon, {
      tiles,
      enemies: [inRange],
      worldGridSize: 12,
      effectiveRange: 3,
    });
    assert.equal(highlightedTiles.has("8,5"), true);
    assert.equal(
      summonControlSpriteClickHighlightedIsExecutable({
        highlighted: true,
        executable: target != null,
      }),
      true,
    );
  });

  it("keys off sprite kind / kit id / routing, not the display name", () => {
    assert.equal(
      shouldPreferSummonControlSpriteLogicalTile({
        routedToSummonControl: true,
        selectedKitSpellId: "spell-inferno",
        spriteHit: {
          kind: "enemy",
          logicalX: 8,
          logicalY: 5,
          isAlive: true,
        },
      }),
      true,
    );
    assert.equal(
      shouldPreferSummonControlSpriteLogicalTile({
        routedToSummonControl: true,
        selectedKitSpellId: "spell-inferno",
        spriteHit: {
          kind: "summon",
          logicalX: 5,
          logicalY: 5,
          isAlive: true,
        },
      }),
      false,
      "summon-sprite Blood Mend is not this leftover",
    );
    assert.equal(
      pickSummonControlSpriteClickTile({
        ...readyArgs,
        selectedKitSpellId: null,
      }),
      missedGrid,
      "no kit selected stays on the walk diamond tile",
    );
    assert.equal(
      pickSummonControlSpriteClickTile({
        ...readyArgs,
        spriteHit: null,
      }),
      missedGrid,
      "no sprite hit stays on clientToGrid",
    );
    assert.equal(
      pickSummonControlSpriteClickTile({
        ...readyArgs,
        routedToSummonControl: false,
      }),
      missedGrid,
      "player-turn sprite-first is targeting.decideSpriteCastClick",
    );
  });

  it("cannot execute Chebyshev 4, corpse, ally, or empty", () => {
    const out = unit("out", 9, 5, { side: "enemy" });
    assert.equal(
      executeSummonControlSpriteClick({
        routedToSummonControl: true,
        selectedKitSpellId: "spell-inferno",
        spriteHit: {
          kind: "enemy",
          logicalX: 9,
          logicalY: 5,
          isAlive: true,
        },
        gridTile: missedGrid,
        spell: inferno,
        world: { caster: summon, combatants: [summon, out], tiles },
      }),
      null,
    );
    assert.equal(
      executeSummonControlSpriteClick({
        ...readyArgs,
        spriteHit: {
          kind: "enemy",
          logicalX: 8,
          logicalY: 5,
          isAlive: false,
        },
        spell: inferno,
        world: {
          caster: summon,
          combatants: [summon, unit("dead", 8, 5, { side: "enemy", hp: 0 })],
          tiles,
        },
      }),
      null,
    );
    assert.equal(
      executeSummonControlSpriteClick({
        routedToSummonControl: true,
        selectedKitSpellId: "spell-inferno",
        spriteHit: {
          kind: "summon",
          logicalX: 8,
          logicalY: 5,
          isAlive: true,
        },
        gridTile: { x: 8, y: 5 },
        spell: inferno,
        world: {
          caster: summon,
          combatants: [
            summon,
            unit("wolf", 8, 5, { side: "player", isSummon: true }),
          ],
          tiles,
        },
      }),
      null,
    );
    assert.equal(
      executeSummonControlSpriteClick({
        ...readyArgs,
        spriteHit: null,
        spell: inferno,
        world: readyWorld,
      }),
      null,
      "empty neighbour grid with no sprite hit cannot execute",
    );
  });

  it("cannot execute player-turn or no kit; sibling kits keep their own leftovers", () => {
    assert.equal(
      executeSummonControlSpriteClick({
        ...readyArgs,
        routedToSummonControl: false,
        spell: inferno,
        world: readyWorld,
      }),
      null,
      "player-turn sprite-first is #340, not this leftover",
    );
    assert.equal(
      executeSummonControlSpriteClick({
        ...readyArgs,
        selectedKitSpellId: null,
        spell: inferno,
        world: readyWorld,
      }),
      null,
    );
    for (const spell of [
      physicalAttackSpell,
      poison,
      frost,
      slow,
      venom,
      mend,
    ]) {
      const target = executeSummonControlSpriteClick({
        ...readyArgs,
        selectedKitSpellId: spell.id,
        spell,
        world: readyWorld,
      });
      if (spell.id === "starter-heal") {
        assert.equal(target, null, "Blood Mend wants self/ally, not the rat");
      } else if (spell.id === "starter-poison") {
        assert.equal(
          target?.id,
          "rat",
          "Poison dest pick still uses sprite logical tile; LoS leftover is #1095/#1096",
        );
      } else if (spell.id === "spell-venom-strike") {
        assert.equal(
          target,
          null,
          "Venom range 2 cannot reach Chebyshev 3; leftover is #1123",
        );
      } else if (spell.id === "physical_attack") {
        assert.equal(target, null, "Strike range cannot reach Chebyshev 3");
      } else if (spell.id === "starter-frost") {
        assert.equal(
          target?.id,
          "rat",
          "Frost dest pick is generic routing, not queen pack leftover",
        );
      } else if (spell.id === "spell-slow") {
        assert.equal(target?.id, "rat");
      }
    }
  });

  it("live summon-control returns before sprite-first; pads stay 10 / 14", () => {
    assert.equal(liveWxSummonControlRunsSpriteFirst(), false);

    const mouse = summonControlBlock("mouse");
    assert.ok(mouse.includes("shouldRouteCanvasToSummonControl"));
    assert.ok(mouse.includes("clientToGrid"));
    assert.ok(mouse.includes("selectedSummonSpellId"));
    assert.ok(mouse.includes("pickSummonControlClickTarget"));
    assert.ok(mouse.includes("return;"));
    assert.equal(mouse.includes("hitTestSprite"), false);
    assert.equal(mouse.includes("pickSummonControlSpriteClickTile"), false);
    assert.equal(mouse.includes("CHARACTER_Y_OFFSET"), false);

    const touch = summonControlBlock("touch");
    assert.ok(touch.includes("shouldRouteCanvasToSummonControl"));
    assert.ok(touch.includes("clientToGrid"));
    assert.ok(touch.includes("selectedSummonSpellId"));
    assert.ok(touch.includes("pickSummonControlClickTarget"));
    assert.ok(touch.includes("return;"));
    assert.equal(touch.includes("hitTestSprite"), false);

    const mouseSprite = spriteFirstBlock("mouse");
    assert.ok(mouseSprite.includes("hitTestSprite(_canvasX, _canvasY, 10)"));
    assert.ok(mouseSprite.includes("decideSpriteCastClick"));
    assert.equal(mouseSprite.includes("selectedSummonSpellId"), false);

    const touchSprite = spriteFirstBlock("touch");
    assert.ok(touchSprite.includes("hitTestSprite(_canvasX, _canvasY, 14)"));
    assert.ok(touchSprite.includes("decideSpriteCastClick"));
    assert.equal(touchSprite.includes("selectedSummonSpellId"), false);

    const wx = wxSource();
    const mouseRoute = wx.indexOf("SUMMON CONTROL ROUTING ─");
    const mouseSpriteAt = wx.indexOf("SPRITE-FIRST HIT TESTING (mouse)");
    const touchRoute = wx.indexOf("SUMMON CONTROL ROUTING (touch)");
    const touchSpriteAt = wx.indexOf("SPRITE-FIRST HIT TESTING (touch)");
    assert.ok(mouseRoute >= 0 && mouseSpriteAt > mouseRoute);
    assert.ok(touchRoute >= 0 && touchSpriteAt > touchRoute);
    assert.ok(wx.includes("CHARACTER_Y_OFFSET"));
  });

  it("does not restore Attack Nearest dest, tile remaining, or pack leftovers", () => {
    const target = executeSummonControlSpriteClick({
      ...readyArgs,
      spell: inferno,
      world: readyWorld,
    });
    assert.ok(target);
    assert.equal(target.id, "rat");
    assert.equal(
      "dest" in target,
      false,
      "#1238 owns Attack Nearest dest pick",
    );
    assert.equal(
      summonControlSpriteClickHighlightedIsExecutable({
        highlighted: false,
        executable: false,
      }),
      false,
    );
  });
});
