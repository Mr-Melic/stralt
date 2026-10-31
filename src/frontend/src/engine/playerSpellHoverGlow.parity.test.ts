/**
 * Combat action parity: champion spell hover must not pulse dests outside
 * the painted range ring. Live glow still paints any hovered floor tile
 * while Attack is selected with a spell id.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { PLAYER_BASE_AP, WORLD_GRID_SIZE } from "../data/gameConstants.ts";
import { physicalAttackSpell, starterSpells } from "../data/spellData.ts";
import type { Enemy, SpellConfig } from "../types/gameTypes.ts";
import {
  planPlayerCastAttempt,
  playerCastAttemptResult,
} from "./playerCastPlan.ts";
import {
  LIVE_PLAYER_SPELL_HOVER_GLOW_RGB,
  canExecutePlayerSpellHoverGlowDest,
  livePlayerSpellHoverGlowShows,
  playerSpellHoverGlowChebyshev,
  playerSpellHoverGlowHighlightedIsExecutable,
  playerSpellHoverGlowShows,
  shouldApplyPlayerSpellHoverGlow,
} from "./playerSpellHoverGlow.ts";
import {
  canAffordCastAp,
  computeTargetableTiles,
  decideTileCastClick,
  isTileCastableLive,
  spellRangeBase,
} from "./targeting.ts";

function mustSpell(id: string) {
  const spell = starterSpells.find((s) => s.id === id);
  assert.ok(spell, id);
  return spell;
}

function here(): string {
  return dirname(fileURLToPath(import.meta.url));
}

function readSrc(rel: string): string {
  return readFileSync(join(here(), rel), "utf8");
}

function wxSource(): string {
  return readSrc("../components/WorldExploration.tsx");
}

function hoverGlowBlock(): string {
  const wx = wxSource();
  const start = wx.indexOf("// ── D. Tile hover glow (animated pulse)");
  assert.ok(start >= 0, "live RAF still paints tile hover glow");
  const end = wx.indexOf("Green MP highlight", start);
  assert.ok(end > start, "green MP ring still follows hover glow");
  return wx.slice(start, end);
}

function spellRingPaintBlock(): string {
  const wx = wxSource();
  const start = wx.indexOf("const spellTiles =");
  assert.ok(start >= 0, "live RAF still snapshots the spell ring");
  const end = wx.indexOf("const barrierTileSnapshot", start);
  assert.ok(end > start, "barrier snapshot still follows the spell ring");
  return wx.slice(start, end);
}

function playerCastMouseBlock(): string {
  const wx = wxSource();
  const start = wx.indexOf("if (selectedSpellIdRef.current) {");
  assert.ok(start >= 0, "live WX mouse still prefers a selected spell");
  const end = wx.indexOf('else if (battleActionMode === "walk")', start);
  assert.ok(end > start, "walk branch still follows selected-spell mouse");
  return wx.slice(start, end);
}

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

function destInRing(
  spell: SpellConfig,
  caster: { x: number; y: number },
  dest: { x: number; y: number },
  enemies: Enemy[],
  tiles: Array<Array<"floor" | "wall" | "portal">>,
): boolean {
  return computeTargetableTiles(spell, caster, {
    tiles,
    enemies,
    worldGridSize: tiles.length,
    effectiveRange: spellRangeBase(spell),
  }).has(`${dest.x},${dest.y}`);
}

describe("champion spell hover glow vs execute dest", () => {
  const frost = mustSpell("starter-frost");
  const inferno = mustSpell("spell-inferno");
  const venom = mustSpell("spell-venom-strike");
  const poison = mustSpell("starter-poison");
  const slow = mustSpell("spell-slow");
  const wisp = mustSpell("summon-wisp");
  const strike = physicalAttackSpell;

  const playerPos = { x: 8, y: 8 };
  const destNeighbour = { x: 9, y: 8 };
  const destFour = { x: 12, y: 8 };
  const destSummonNeighbour = { x: 4, y: 3 };
  const tiles = floorGrid(WORLD_GRID_SIZE);
  const strikeCost = Number(strike.apCost);

  const hostileFour = unit("hostile-four", destFour.x, destFour.y);
  const hostileNeighbour = unit(
    "hostile-near",
    destNeighbour.x,
    destNeighbour.y,
  );

  const uniqueFire = {
    inBattle: true,
    battleActionMode: "attack",
    selectedSpellId: strike.id,
    isSummonControlled: false,
    destIsFloor: true,
    destInSpellRing: destInRing(
      strike,
      playerPos,
      destFour,
      [hostileFour],
      tiles,
    ),
    origin: playerPos,
    dest: destFour,
    currentAp: 4,
    apCost: strikeCost,
  };

  const inRingNeighbour = {
    ...uniqueFire,
    destInSpellRing: destInRing(
      strike,
      playerPos,
      destNeighbour,
      [hostileNeighbour],
      tiles,
    ),
    dest: destNeighbour,
  };

  it("treats Strike range 1 vs a Chebyshev-4 dest as the unique fire, not leftover AP", () => {
    assert.equal(PLAYER_BASE_AP, 8);
    assert.equal(Number(strike.range), 1);
    assert.equal(spellRangeBase(strike), 1);
    assert.equal(strikeCost, 2);
    assert.equal(playerSpellHoverGlowChebyshev(playerPos, destNeighbour), 1);
    assert.equal(playerSpellHoverGlowChebyshev(playerPos, destFour), 4);
    assert.equal(
      playerSpellHoverGlowChebyshev(playerPos, destSummonNeighbour),
      5,
    );
    assert.equal(uniqueFire.destInSpellRing, false);
    assert.equal(inRingNeighbour.destInSpellRing, true);
    assert.equal(canAffordCastAp(4, strikeCost), true);
    assert.equal(canAffordCastAp(1, strikeCost), false);
    assert.equal(
      canAffordCastAp(PLAYER_BASE_AP, strikeCost),
      true,
      "catalog 8 AP can pay Strike 2 — unique fire is leftover range 1 vs dest 4",
    );
    assert.equal(Number(frost.range), 4);
    assert.equal(
      destInRing(frost, playerPos, destFour, [hostileFour], tiles),
      true,
      "Frost range 4 would include dest (12,8) — unique fire is Strike",
    );
    assert.equal(LIVE_PLAYER_SPELL_HOVER_GLOW_RGB.r, 100);
    assert.equal(LIVE_PLAYER_SPELL_HOVER_GLOW_RGB.g, 150);
    assert.equal(LIVE_PLAYER_SPELL_HOVER_GLOW_RGB.b, 255);
  });

  it("a dest outside the range-1 ring still gets a live spell glow and cannot execute", () => {
    assert.equal(livePlayerSpellHoverGlowShows(uniqueFire), true);
    assert.equal(
      playerSpellHoverGlowShows(uniqueFire),
      false,
      "intended glow hides dests RAF did not paint in the spell ring",
    );
    const glowing = shouldApplyPlayerSpellHoverGlow(uniqueFire);
    const executable = canExecutePlayerSpellHoverGlowDest(uniqueFire);
    assert.equal(glowing, false);
    assert.equal(executable, false);
    assert.equal(
      playerSpellHoverGlowHighlightedIsExecutable({
        glowing,
        executable,
      }),
      false,
    );

    const live = isTileCastableLive(
      strike,
      playerPos,
      destFour,
      [hostileFour],
      tiles,
      spellRangeBase(strike),
    );
    assert.equal(live.ok, false);
    assert.deepEqual(
      decideTileCastClick({
        live,
        tileHighlighted: uniqueFire.destInSpellRing,
        occupantIsLiveHostile: true,
      }),
      { action: "reject", reason: live.reason },
    );
    const plan = planPlayerCastAttempt({
      spell: strike,
      caster: playerPos,
      tile: destFour,
      liveCombatants: [hostileFour],
      mapTiles: tiles,
      effectiveRange: spellRangeBase(strike),
      currentAp: 4,
      baseApCost: strikeCost,
      cooldownTurnsRemaining: 0,
    });
    assert.equal(plan.ok, false);
    assert.equal(playerCastAttemptResult(plan), "abort");
  });

  it("a glowing in-range living hostile keeps the pulse and executes", () => {
    assert.equal(livePlayerSpellHoverGlowShows(inRingNeighbour), true);
    assert.equal(playerSpellHoverGlowShows(inRingNeighbour), true);
    const glowing = shouldApplyPlayerSpellHoverGlow(inRingNeighbour);
    const executable = canExecutePlayerSpellHoverGlowDest(inRingNeighbour);
    assert.equal(glowing, true);
    assert.equal(executable, true);
    assert.equal(
      playerSpellHoverGlowHighlightedIsExecutable({
        glowing,
        executable,
      }),
      true,
    );
    assert.equal(canAffordCastAp(4, strikeCost), true);

    const live = isTileCastableLive(
      strike,
      playerPos,
      destNeighbour,
      [hostileNeighbour],
      tiles,
      spellRangeBase(strike),
    );
    assert.equal(live.ok, true);
    assert.deepEqual(
      decideTileCastClick({
        live,
        tileHighlighted: inRingNeighbour.destInSpellRing,
        occupantIsLiveHostile: true,
      }),
      { action: "execute", bypassHighlight: true },
    );
    const plan = planPlayerCastAttempt({
      spell: strike,
      caster: playerPos,
      tile: destNeighbour,
      liveCombatants: [hostileNeighbour],
      mapTiles: tiles,
      effectiveRange: spellRangeBase(strike),
      currentAp: 4,
      baseApCost: strikeCost,
      cooldownTurnsRemaining: 0,
    });
    assert.equal(plan.ok, true);
    assert.equal(playerCastAttemptResult(plan), "ok");
  });

  it("summon-control / Walk / 1 AP / Frost dest-4 cannot steal this leftover", () => {
    const duringControl = {
      ...inRingNeighbour,
      isSummonControlled: true,
    };
    assert.equal(
      shouldApplyPlayerSpellHoverGlow(duringControl),
      false,
      "this leftover is champion Strike, not summon-control kit #757",
    );
    assert.equal(canExecutePlayerSpellHoverGlowDest(duringControl), false);
    assert.equal(
      livePlayerSpellHoverGlowShows(duringControl),
      true,
      "live leftover still pulses dest-is-floor + attack + spell id during control",
    );

    const walkMode = {
      ...inRingNeighbour,
      battleActionMode: "walk",
    };
    assert.equal(
      livePlayerSpellHoverGlowShows(walkMode),
      false,
      "walk-MP glow is #1350, not this leftover",
    );
    assert.equal(canExecutePlayerSpellHoverGlowDest(walkMode), false);

    const lowAp = {
      ...inRingNeighbour,
      currentAp: 1,
    };
    assert.equal(
      playerSpellHoverGlowShows(lowAp),
      true,
      "AP emptying the ring stays #708 — this leftover is range membership",
    );
    assert.equal(canExecutePlayerSpellHoverGlowDest(lowAp), false);

    const frostFour = {
      ...uniqueFire,
      selectedSpellId: frost.id,
      destInSpellRing: destInRing(
        frost,
        playerPos,
        destFour,
        [hostileFour],
        tiles,
      ),
      apCost: Number(frost.apCost),
    };
    assert.equal(
      frostFour.destInSpellRing,
      true,
      "Frost range 4 includes dest (12,8) — unique fire needs Strike range 1",
    );
    assert.equal(canExecutePlayerSpellHoverGlowDest(frostFour), true);
    assert.equal(canExecutePlayerSpellHoverGlowDest(uniqueFire), false);
  });

  it("own tile / wall / out of battle / no spell cannot; Strike range 1 cannot pay Chebyshev 4", () => {
    assert.equal(
      canExecutePlayerSpellHoverGlowDest({
        ...uniqueFire,
        inBattle: false,
      }),
      false,
    );
    assert.equal(
      livePlayerSpellHoverGlowShows({
        inBattle: true,
        battleActionMode: "attack",
        selectedSpellId: strike.id,
        destIsFloor: false,
      }),
      false,
    );
    assert.equal(
      livePlayerSpellHoverGlowShows({
        inBattle: true,
        battleActionMode: "attack",
        selectedSpellId: null,
        destIsFloor: true,
      }),
      false,
      "attack with no spell is cream generic glow, not this leftover",
    );
    assert.equal(
      playerSpellHoverGlowShows({
        inBattle: true,
        battleActionMode: "attack",
        selectedSpellId: strike.id,
        destIsFloor: true,
        destInSpellRing: true,
      }),
      true,
    );
    assert.equal(
      playerSpellHoverGlowShows({
        inBattle: true,
        battleActionMode: "attack",
        selectedSpellId: strike.id,
        destIsFloor: true,
        destInSpellRing: false,
      }),
      false,
    );
    assert.equal(
      shouldApplyPlayerSpellHoverGlow({
        ...inRingNeighbour,
        dest: playerPos,
        destInSpellRing: destInRing(
          strike,
          playerPos,
          playerPos,
          [hostileNeighbour],
          tiles,
        ),
      }),
      false,
      "Strike caster tile is not in the painted range ring",
    );
    assert.equal(
      playerSpellHoverGlowChebyshev(playerPos, destFour) >
        spellRangeBase(strike),
      true,
      "Strike range 1 cannot pay Chebyshev 4 — do not rebalance Strike",
    );
  });

  it("live glow still keys pulse off hovered floor; RAF ring / execute already gate membership", () => {
    const glow = hoverGlowBlock();
    assert.ok(glow.includes('isHovered && tileType === "floor"'));
    assert.ok(glow.includes("isSpellHover"));
    assert.ok(glow.includes('battleActionModeRef.current === "attack"'));
    assert.ok(glow.includes("selectedSpellIdRef.current"));
    assert.ok(glow.includes("isMpHover"));
    assert.equal(glow.includes("getSpellRangeTiles"), false);
    assert.equal(glow.includes("spellTiles.has"), false);
    assert.equal(glow.includes("destInSpellRing"), false);
    assert.equal(glow.includes("computeTargetableTiles"), false);
    assert.equal(glow.includes("isTileCastableLive"), false);
    assert.equal(glow.includes("playerSpellHoverGlowShows"), false);
    assert.equal(glow.includes("playerWalkHoverGlowShows"), false);
    assert.equal(glow.includes("playerWalkHoverRingShowsLabel"), false);

    const ring = spellRingPaintBlock();
    assert.ok(ring.includes("getSpellRangeTiles()"));
    assert.ok(ring.includes('battleActionModeRef.current === "attack"'));
    assert.ok(ring.includes("selectedSpellIdRef.current"));

    const mouse = playerCastMouseBlock();
    assert.ok(mouse.includes("getSpellRangeTiles()"));
    assert.ok(mouse.includes("decideTileCastClick({"));
    assert.ok(mouse.includes("spellTiles.has("));
    assert.ok(mouse.includes("probeLiveCast("));
    assert.equal(mouse.includes("playerSpellHoverGlowShows"), false);

    const wx = wxSource();
    assert.equal(wx.includes("playerSpellHoverGlowShows"), false);
    assert.ok(
      wx.includes("const [currentBattleAp, setCurrentBattleAp] = useState(4);"),
    );
    assert.ok(wx.includes("spellTiles.has(`${x},${y}`)"));
    assert.ok(wx.includes("isSpellHover ? 100 : isMpHover ? 0 : 255"));
    assert.ok(wx.includes("isSpellHover ? 150 : isMpHover ? 255 : 255"));
    assert.ok(wx.includes("isSpellHover ? 255 : isMpHover ? 100 : 200"));
    assert.ok(wx.includes("isAttackNearestHotkey"));
  });

  it("cannot steal walk glow/labels, summon-control kit, AP bar, or Attack Nearest origin", () => {
    assert.equal(canExecutePlayerSpellHoverGlowDest(inRingNeighbour), true);
    assert.equal(canExecutePlayerSpellHoverGlowDest(uniqueFire), false);
    const wx = wxSource();
    assert.equal(wx.includes("playerWalkHoverGlowShows"), false);
    assert.equal(wx.includes("playerWalkHoverRingShowsLabel"), false);
    assert.equal(wx.includes("summonControlWalkHoverRingShowsLabel"), false);
    assert.equal(wx.includes("summonControlWalkHoverOrigin"), false);
    assert.equal(wx.includes("shouldEnableSummonControlWalkButton"), false);
    assert.equal(wx.includes("battleWalkHoverMpPreview"), false);
    assert.equal(wx.includes("playerCastResourceHighlight"), false);
    assert.ok(wx.includes("attackNearestLiveCasterPos"));
    assert.ok(wx.includes("onSetWalk={() => {"));

    const panel = readSrc("../components/SummonControlPanel.tsx");
    assert.equal(panel.includes("playerSpellHoverGlowShows"), false);
    assert.ok(panel.includes("disabled={currentAp < spell.apCost}"));

    const battle = readSrc("../components/BattleUIPanel.tsx");
    assert.equal(battle.includes("playerSpellHoverGlowShows"), false);
    assert.ok(battle.includes('data-ocid="battle_ui.attack_button"'));

    for (const spell of [
      physicalAttackSpell,
      frost,
      inferno,
      venom,
      poison,
      slow,
      wisp,
    ]) {
      assert.ok(spell);
      assert.equal(spell.id === "player-spell-hover-glow", false);
    }
  });
});
