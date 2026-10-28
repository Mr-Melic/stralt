/**
 * Combat action parity: a highlighted legal summon-control self/ally
 * sprite dest is executable, and an illegal dest cannot execute. Live
 * WX summon-control still returns before sprite-first hit testing, and
 * `#1260` still prefers enemy sprites only.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { physicalAttackSpell, starterSpells } from "../data/spellData.ts";
import type { Enemy, SpellConfig } from "../types/gameTypes.ts";
import {
  pickSummonControlClickTarget,
  planSummonControlCast,
} from "../utils/summonControlCast.ts";
import {
  SUMMON_CONTROL_SELF_SPRITE_KIND,
  executeSummonControlSelfSpriteClick,
  isSummonControlSelfSpriteKind,
  pickSummonControlSelfSpriteClickTile,
  shouldPreferSummonControlSelfSpriteLogicalTile,
  summonControlSelfSpriteClickHighlightedIsExecutable,
} from "./summonControlSpriteSelfClick.ts";
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

describe("player-controlled summon kit self/ally sprite dest vs execute", () => {
  const mend = mustSpell("starter-heal");
  const cry = mustSpell("spell-rallying-cry");
  const shield = mustSpell("starter-shield");
  const iron = mustSpell("spell-iron-skin");
  const inferno = mustSpell("spell-inferno");
  const poison = mustSpell("starter-poison");
  const venom = mustSpell("spell-venom-strike");
  const frost = mustSpell("starter-frost");
  const slow = mustSpell("spell-slow");
  const wispSpell = mustSpell("summon-wisp");
  const sentinelSpell = mustSpell("summon-sentinel");
  const bomberSpell = mustSpell("summon-bomber");
  const tiles = floorGrid(12);
  const summon = unit("wisp", 5, 5, {
    side: "player",
    isSummon: true,
    pieceType: "wisp",
  });
  const missedGrid = { x: 5, y: 4 };
  const selfHit = {
    kind: SUMMON_CONTROL_SELF_SPRITE_KIND,
    logicalX: 5,
    logicalY: 5,
    isAlive: true,
  };

  const readyArgs = {
    routedToSummonControl: true,
    selectedKitSpellId: "starter-heal",
    spriteHit: selfHit,
    gridTile: missedGrid,
  };

  const readyWorld = {
    caster: summon,
    combatants: [summon],
    tiles,
  };

  it("treats catalog Blood Mend as the unique-fire kit spell", () => {
    assert.equal(mend.spellType, "heal");
    assert.equal(mend.targetType, "self");
    assert.equal(Number(mend.range), 0);
    assert.equal(Number(mend.healAmount), 12);
    assert.equal(Number(mend.apCost), 3);
    assert.equal(cry.targetType, "self");
    assert.equal(Number(cry.apCost), 4);
    assert.deepEqual(wispSpell.summonUnitDef?.summonKit, [
      "starter-heal",
      "spell-rallying-cry",
    ]);
    assert.equal(wispSpell.summonUnitDef?.ap, 2);
    assert.deepEqual(sentinelSpell.summonUnitDef?.summonKit, [
      "starter-shield",
      "spell-iron-skin",
    ]);
    assert.equal(shield.targetType, "ally");
    assert.equal(iron.targetType, "ally");
    assert.equal(isSummonControlSelfSpriteKind("summon"), true);
    assert.equal(isSummonControlSelfSpriteKind("enemy"), false);
    assert.equal(isSummonControlSelfSpriteKind("player"), false);
  });

  it("sprite logical caster tile wins when clientToGrid missed onto an empty neighbour", () => {
    assert.equal(
      shouldPreferSummonControlSelfSpriteLogicalTile(readyArgs),
      true,
    );
    assert.deepEqual(pickSummonControlSelfSpriteClickTile(readyArgs), {
      x: 5,
      y: 5,
    });
    assert.equal(
      pickSummonControlClickTarget({
        spell: mend,
        caster: summon,
        tile: missedGrid,
        combatants: readyWorld.combatants,
        tiles,
      }),
      null,
      "live clientToGrid neighbour is not the caster tile",
    );
    const target = executeSummonControlSelfSpriteClick({
      ...readyArgs,
      spell: mend,
      world: readyWorld,
    });
    assert.equal(target?.id, "wisp");
    const highlightedTiles = computeTargetableTiles(mend, summon, {
      tiles,
      enemies: [summon],
      worldGridSize: 12,
      effectiveRange: 1,
    });
    assert.equal(highlightedTiles.has("5,5"), true);
    assert.equal(highlightedTiles.has("5,4"), false);
    assert.equal(
      summonControlSelfSpriteClickHighlightedIsExecutable({
        highlighted: highlightedTiles.has("5,5"),
        executable: target != null,
      }),
      true,
    );
    assert.equal(
      planSummonControlCast({
        pieceType: "wisp",
        spellId: "starter-heal",
        catalog: starterSpells,
        currentAp: 3,
        caster: summon,
        target: { x: 5, y: 5 },
        liveGate: { tiles, combatants: [summon] },
      }).ok,
      true,
    );
    assert.equal(
      planSummonControlCast({
        pieceType: "wisp",
        spellId: "starter-heal",
        catalog: starterSpells,
        currentAp: 2,
        caster: summon,
        target: { x: 5, y: 5 },
        liveGate: { tiles, combatants: [summon] },
      }).ok,
      false,
      "catalog wisp AP 2 cannot pay Blood Mend 3 — do not rebalance",
    );
  });

  it("keys off summon kind / kit id / routing, not the display name", () => {
    assert.equal(
      shouldPreferSummonControlSelfSpriteLogicalTile({
        routedToSummonControl: true,
        selectedKitSpellId: "starter-heal",
        spriteHit: {
          kind: "summon",
          logicalX: 5,
          logicalY: 5,
          isAlive: true,
        },
      }),
      true,
    );
    assert.equal(
      shouldPreferSummonControlSelfSpriteLogicalTile({
        routedToSummonControl: true,
        selectedKitSpellId: "starter-heal",
        spriteHit: {
          kind: "enemy",
          logicalX: 8,
          logicalY: 5,
          isAlive: true,
        },
      }),
      false,
      "enemy-sprite Inferno dest is #1260, not this leftover",
    );
    assert.equal(
      shouldPreferSummonControlSelfSpriteLogicalTile({
        routedToSummonControl: true,
        selectedKitSpellId: "starter-heal",
        spriteHit: {
          kind: "player",
          logicalX: 2,
          logicalY: 2,
          isAlive: true,
        },
      }),
      false,
      "champion Blood Mend is decideSpriteCastClick sprite-player",
    );
    assert.equal(
      pickSummonControlSelfSpriteClickTile({
        ...readyArgs,
        selectedKitSpellId: null,
      }),
      missedGrid,
      "no kit selected stays on the walk diamond tile",
    );
    assert.equal(
      pickSummonControlSelfSpriteClickTile({
        ...readyArgs,
        spriteHit: null,
      }),
      missedGrid,
      "no sprite hit stays on clientToGrid",
    );
    assert.equal(
      pickSummonControlSelfSpriteClickTile({
        ...readyArgs,
        routedToSummonControl: false,
      }),
      missedGrid,
      "player-turn sprite-first is targeting.decideSpriteCastClick",
    );
  });

  it("cannot execute enemy sprite, corpse, other-summon Blood Mend, or empty", () => {
    const rat = unit("rat", 8, 5, { side: "enemy" });
    assert.equal(
      executeSummonControlSelfSpriteClick({
        routedToSummonControl: true,
        selectedKitSpellId: "starter-heal",
        spriteHit: {
          kind: "enemy",
          logicalX: 8,
          logicalY: 5,
          isAlive: true,
        },
        gridTile: missedGrid,
        spell: mend,
        world: { caster: summon, combatants: [summon, rat], tiles },
      }),
      null,
      "enemy dest stays #1260; Blood Mend cannot land there",
    );
    assert.equal(
      executeSummonControlSelfSpriteClick({
        ...readyArgs,
        spriteHit: {
          kind: "summon",
          logicalX: 5,
          logicalY: 5,
          isAlive: false,
        },
        spell: mend,
        world: {
          caster: unit("wisp", 5, 5, {
            side: "player",
            isSummon: true,
            pieceType: "wisp",
            hp: 0,
          }),
          combatants: [
            unit("wisp", 5, 5, {
              side: "player",
              isSummon: true,
              pieceType: "wisp",
              hp: 0,
            }),
          ],
          tiles,
        },
      }),
      null,
    );
    const wolf = unit("wolf", 8, 5, {
      side: "player",
      isSummon: true,
      pieceType: "wolf",
    });
    assert.equal(
      executeSummonControlSelfSpriteClick({
        routedToSummonControl: true,
        selectedKitSpellId: "starter-heal",
        spriteHit: {
          kind: "summon",
          logicalX: 8,
          logicalY: 5,
          isAlive: true,
        },
        gridTile: { x: 8, y: 4 },
        spell: mend,
        world: { caster: summon, combatants: [summon, wolf], tiles },
      }),
      null,
      "Blood Mend is self — a different summon sprite cannot execute",
    );
    assert.equal(
      executeSummonControlSelfSpriteClick({
        ...readyArgs,
        spriteHit: null,
        spell: mend,
        world: readyWorld,
      }),
      null,
      "empty neighbour grid with no sprite hit cannot execute",
    );
  });

  it("cannot execute player-turn or no kit; sibling kits keep their own leftovers", () => {
    assert.equal(
      executeSummonControlSelfSpriteClick({
        ...readyArgs,
        routedToSummonControl: false,
        spell: mend,
        world: readyWorld,
      }),
      null,
      "player-turn sprite-first is #340, not this leftover",
    );
    assert.equal(
      executeSummonControlSelfSpriteClick({
        ...readyArgs,
        selectedKitSpellId: null,
        spell: mend,
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
      inferno,
      mend,
      cry,
    ]) {
      const target = executeSummonControlSelfSpriteClick({
        ...readyArgs,
        selectedKitSpellId: spell.id,
        spell,
        world: readyWorld,
      });
      if (spell.id === "starter-heal" || spell.id === "spell-rallying-cry") {
        assert.equal(target?.id, "wisp", `${spell.id} is range-0 self`);
      } else {
        assert.equal(
          target,
          null,
          `${spell.id} wants a living hostile, not the wisp sprite`,
        );
      }
    }
    assert.equal(bomberSpell.summonUnitDef?.ap, 1);
  });

  it("executes a painted Sentinel Shield on an allied summon sprite", () => {
    const golem = unit("golem", 5, 5, {
      side: "player",
      isSummon: true,
      pieceType: "golem",
    });
    const wolf = unit("wolf", 8, 5, {
      side: "player",
      isSummon: true,
      pieceType: "wolf",
    });
    const allyHit = {
      kind: SUMMON_CONTROL_SELF_SPRITE_KIND,
      logicalX: 8,
      logicalY: 5,
      isAlive: true,
    };
    const allyMissed = { x: 8, y: 4 };
    assert.equal(
      pickSummonControlClickTarget({
        spell: shield,
        caster: golem,
        tile: allyMissed,
        combatants: [golem, wolf],
        tiles,
      }),
      null,
    );
    const target = executeSummonControlSelfSpriteClick({
      routedToSummonControl: true,
      selectedKitSpellId: "starter-shield",
      spriteHit: allyHit,
      gridTile: allyMissed,
      spell: shield,
      world: { caster: golem, combatants: [golem, wolf], tiles },
    });
    assert.equal(target?.id, "wolf");
    const highlightedTiles = computeTargetableTiles(shield, golem, {
      tiles,
      enemies: [golem, wolf],
      worldGridSize: 12,
      effectiveRange: 3,
    });
    assert.equal(highlightedTiles.has("8,5"), true);
    assert.equal(
      summonControlSelfSpriteClickHighlightedIsExecutable({
        highlighted: true,
        executable: target != null,
      }),
      true,
    );
    assert.equal(
      executeSummonControlSelfSpriteClick({
        routedToSummonControl: true,
        selectedKitSpellId: "starter-shield",
        spriteHit: {
          kind: "summon",
          logicalX: 9,
          logicalY: 5,
          isAlive: true,
        },
        gridTile: { x: 9, y: 4 },
        spell: shield,
        world: {
          caster: golem,
          combatants: [
            golem,
            unit("far", 9, 5, {
              side: "player",
              isSummon: true,
              pieceType: "wolf",
            }),
          ],
          tiles,
        },
      }),
      null,
      "Chebyshev 4 is outside Shield range 3",
    );
  });

  it("live summon-control returns before sprite-first; player-side kind stays summon", () => {
    const mouse = summonControlBlock("mouse");
    assert.ok(mouse.includes("shouldRouteCanvasToSummonControl"));
    assert.ok(mouse.includes("clientToGrid"));
    assert.ok(mouse.includes("selectedSummonSpellId"));
    assert.ok(mouse.includes("pickSummonControlClickTarget"));
    assert.ok(mouse.includes("return;"));
    assert.equal(mouse.includes("hitTestSprite"), false);
    assert.equal(mouse.includes("pickSummonControlSelfSpriteClickTile"), false);
    assert.equal(mouse.includes("CHARACTER_Y_OFFSET"), false);

    const touch = summonControlBlock("touch");
    assert.ok(touch.includes("shouldRouteCanvasToSummonControl"));
    assert.ok(touch.includes("clientToGrid"));
    assert.ok(touch.includes("pickSummonControlClickTarget"));
    assert.ok(touch.includes("return;"));
    assert.equal(touch.includes("hitTestSprite"), false);

    const wx = wxSource();
    assert.ok(
      wx.includes('kind: enemy.side === "player" ? "summon" : "enemy"'),
    );
    assert.ok(wx.includes("CHARACTER_Y_OFFSET"));
    assert.equal(wx.includes("pickSummonControlSelfSpriteClickTile"), false);
    assert.ok(wx.includes("decideSpriteCastClick"));
    const mouseRoute = wx.indexOf("SUMMON CONTROL ROUTING ─");
    const mouseSpriteAt = wx.indexOf("SPRITE-FIRST HIT TESTING (mouse)");
    const touchRoute = wx.indexOf("SUMMON CONTROL ROUTING (touch)");
    const touchSpriteAt = wx.indexOf("SPRITE-FIRST HIT TESTING (touch)");
    assert.ok(mouseRoute >= 0 && mouseSpriteAt > mouseRoute);
    assert.ok(touchRoute >= 0 && touchSpriteAt > touchRoute);
  });

  it("does not restore enemy-sprite dest, Attack Nearest dest, or pack leftovers", () => {
    const target = executeSummonControlSelfSpriteClick({
      ...readyArgs,
      spell: mend,
      world: readyWorld,
    });
    assert.ok(target);
    assert.equal(target.id, "wisp");
    assert.equal(
      "dest" in target,
      false,
      "#1238 owns Attack Nearest dest pick",
    );
    assert.equal(
      summonControlSelfSpriteClickHighlightedIsExecutable({
        highlighted: false,
        executable: false,
      }),
      false,
    );
  });
});
