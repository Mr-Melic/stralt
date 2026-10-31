/**
 * Combat action parity: champion spell hover must not pulse dests outside
 * the painted spell ring. Live glow still paints any hovered floor tile
 * while Attack + a spell is selected.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { PLAYER_BASE_AP, PLAYER_BASE_MP } from "../data/gameConstants.ts";
import { physicalAttackSpell, starterSpells } from "../data/spellData.ts";
import {
  LIVE_PLAYER_SPELL_HOVER_GLOW_RGB,
  canExecutePlayerSpellHoverGlowDest,
  livePlayerSpellHoverGlowShows,
  playerSpellHoverGlowCatalogRange,
  playerSpellHoverGlowChebyshev,
  playerSpellHoverGlowHighlightedIsExecutable,
  playerSpellHoverGlowShows,
  shouldApplyPlayerSpellHoverGlow,
} from "./playerSpellHoverGlow.ts";

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

function spellRingFillBlock(): string {
  const wx = wxSource();
  const start = wx.indexOf("// Blue spell range highlight");
  assert.ok(start >= 0, "live RAF still paints the blue spell ring");
  const end = wx.indexOf("Pass 2b: wall blocks", start);
  assert.ok(end > start, "wall pass still follows the blue ring");
  return wx.slice(start, end);
}

function playerCastMouseBlock(): string {
  const wx = wxSource();
  const start = wx.indexOf("FIX 1 — SELECTION IS THE MODE.");
  assert.ok(start >= 0, "live WX mouse cast still selection-gates");
  const end = wx.indexOf("[CLICK] cast-branch debug", start);
  assert.ok(end > start, "cast debug still follows mouse cast");
  return wx.slice(start, end);
}

describe("champion spell hover glow vs execute dest", () => {
  const frost = mustSpell("starter-frost");
  const inferno = mustSpell("spell-inferno");
  const venom = mustSpell("spell-venom-strike");
  const poison = mustSpell("starter-poison");
  const slow = mustSpell("spell-slow");
  const wisp = mustSpell("summon-wisp");

  const playerPos = { x: 8, y: 8 };
  const destNeighbour = { x: 9, y: 8 };
  const destFour = { x: 12, y: 8 };
  const destFive = { x: 13, y: 8 };

  const uniqueFire = {
    inBattle: true,
    battleActionMode: "attack",
    selectedSpellId: frost.id,
    isSummonControlled: false,
    destIsFloor: true,
    destInSpellRing: false,
    occupantIsLiveHostile: true,
    origin: playerPos,
    dest: destFive,
    spellRange: playerSpellHoverGlowCatalogRange(frost),
  };

  const inRingNeighbour = {
    ...uniqueFire,
    destInSpellRing: true,
    dest: destNeighbour,
  };

  it("treats dest Chebyshev 5 vs frost range 4 as the unique fire, not leftover AP", () => {
    assert.equal(PLAYER_BASE_MP, 4);
    assert.equal(PLAYER_BASE_AP, 8);
    assert.equal(Number(frost.apCost), 3);
    assert.equal(Number(frost.range), 4);
    assert.equal(frost.targetType, "enemy");
    assert.equal(playerSpellHoverGlowCatalogRange(frost), 4);
    assert.equal(playerSpellHoverGlowChebyshev(playerPos, destNeighbour), 1);
    assert.equal(playerSpellHoverGlowChebyshev(playerPos, destFour), 4);
    assert.equal(playerSpellHoverGlowChebyshev(playerPos, destFive), 5);
    assert.equal(
      playerSpellHoverGlowChebyshev(playerPos, destFour) <=
        playerSpellHoverGlowCatalogRange(frost),
      true,
      "catalog frost 4 would steal dest Chebyshev 4 — unique fire is dest 5",
    );
    assert.equal(
      playerSpellHoverGlowChebyshev(playerPos, destFive) <=
        playerSpellHoverGlowCatalogRange(frost),
      false,
    );
    assert.equal(LIVE_PLAYER_SPELL_HOVER_GLOW_RGB.r, 100);
    assert.equal(LIVE_PLAYER_SPELL_HOVER_GLOW_RGB.g, 150);
    assert.equal(LIVE_PLAYER_SPELL_HOVER_GLOW_RGB.b, 255);
    assert.equal(
      wisp.summonUnitDef?.mp,
      2,
      "wisp MP stays 2 — this leftover is champion frost range",
    );
  });

  it("a dest outside the frost ring still gets a live spell glow and cannot execute", () => {
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
  });

  it("a glowing hostile neighbour in the ring keeps the pulse and executes", () => {
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
  });

  it("summon-control / no spell / dest Chebyshev 4 cannot steal this leftover", () => {
    const duringControl = {
      ...inRingNeighbour,
      isSummonControlled: true,
    };
    assert.equal(
      shouldApplyPlayerSpellHoverGlow(duringControl),
      false,
      "this leftover is champion Attack, not kit caster dest #1280",
    );
    assert.equal(canExecutePlayerSpellHoverGlowDest(duringControl), false);
    assert.equal(
      livePlayerSpellHoverGlowShows(duringControl),
      true,
      "live leftover still pulses dest-is-floor + attack + spell during control",
    );

    const noSpell = {
      ...inRingNeighbour,
      selectedSpellId: null,
    };
    assert.equal(livePlayerSpellHoverGlowShows(noSpell), false);
    assert.equal(playerSpellHoverGlowShows(noSpell), false);
    assert.equal(canExecutePlayerSpellHoverGlowDest(noSpell), false);
    assert.equal(shouldApplyPlayerSpellHoverGlow(noSpell), false);

    const catalogFour = {
      ...uniqueFire,
      dest: destFour,
      destInSpellRing: true,
      spellRange: playerSpellHoverGlowCatalogRange(frost),
    };
    assert.equal(
      canExecutePlayerSpellHoverGlowDest(catalogFour),
      true,
      "catalog frost 4 in a Chebyshev-4 ring is legal — unique fire needs dest 5",
    );
    assert.equal(canExecutePlayerSpellHoverGlowDest(uniqueFire), false);
  });

  it("own tile / wall / out of battle / walk mode cannot; frost 4 cannot pay dest 5", () => {
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
        selectedSpellId: frost.id,
        destIsFloor: false,
      }),
      false,
    );
    assert.equal(
      livePlayerSpellHoverGlowShows({
        inBattle: true,
        battleActionMode: "walk",
        selectedSpellId: frost.id,
        destIsFloor: true,
      }),
      false,
      "walk-MP green is #1350, not this leftover",
    );
    assert.equal(
      playerSpellHoverGlowShows({
        inBattle: true,
        battleActionMode: "attack",
        selectedSpellId: frost.id,
        destIsFloor: true,
        destInSpellRing: true,
      }),
      true,
    );
    assert.equal(
      playerSpellHoverGlowShows({
        inBattle: true,
        battleActionMode: "attack",
        selectedSpellId: frost.id,
        destIsFloor: true,
        destInSpellRing: false,
      }),
      false,
    );
    assert.equal(
      shouldApplyPlayerSpellHoverGlow({
        ...inRingNeighbour,
        dest: playerPos,
        destInSpellRing: false,
      }),
      false,
      "origin is not in the painted spell ring",
    );
    assert.equal(
      playerSpellHoverGlowChebyshev(playerPos, destFive) <=
        playerSpellHoverGlowCatalogRange(frost),
      false,
      "frost catalog 4 cannot cover dest Chebyshev 5 — do not rebalance range",
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
    assert.equal(glow.includes("getActiveCasterPos"), false);
    assert.equal(glow.includes("computeTargetableTiles"), false);
    assert.equal(glow.includes("playerSpellHoverGlowShows"), false);
    assert.equal(glow.includes("playerWalkHoverGlowShows"), false);
    assert.equal(glow.includes("playerWalkHoverRingShowsLabel"), false);

    const ring = spellRingPaintBlock();
    assert.ok(ring.includes("getSpellRangeTiles()"));
    assert.ok(ring.includes('battleActionModeRef.current === "attack"'));
    assert.ok(ring.includes("selectedSpellIdRef.current"));

    const fill = spellRingFillBlock();
    assert.ok(fill.includes("spellTiles.has(`${x},${y}`)"));
    assert.equal(fill.includes("playerSpellHoverGlowShows"), false);

    const mouse = playerCastMouseBlock();
    assert.ok(mouse.includes("getSpellRangeTiles()"));
    assert.ok(mouse.includes("spellTiles.has("));
    assert.ok(mouse.includes("decideTileCastClick("));
    assert.equal(mouse.includes("playerSpellHoverGlowShows"), false);

    const wx = wxSource();
    assert.equal(wx.includes("playerSpellHoverGlowShows"), false);
    assert.ok(
      wx.includes("const [currentBattleAp, setCurrentBattleAp] = useState(4);"),
    );
    assert.ok(wx.includes("attackNearestLiveCasterPos"));
    assert.ok(wx.includes("spellTiles.has(`${x},${y}`)"));
    assert.ok(wx.includes("isSpellHover ? 100 : isMpHover ? 0 : 255"));
    assert.ok(wx.includes("isSpellHover ? 150 : isMpHover ? 255 : 255"));
    assert.ok(wx.includes("isSpellHover ? 255 : isMpHover ? 100 : 200"));
  });

  it("cannot steal walk glow, kit dest, reject float, or Attack Nearest origin", () => {
    assert.equal(canExecutePlayerSpellHoverGlowDest(inRingNeighbour), true);
    assert.equal(canExecutePlayerSpellHoverGlowDest(uniqueFire), false);
    const wx = wxSource();
    assert.equal(wx.includes("playerWalkHoverGlowShows"), false);
    assert.equal(wx.includes("playerWalkHoverRingShowsLabel"), false);
    assert.equal(wx.includes("summonControlWalkHoverRingShowsLabel"), false);
    assert.equal(wx.includes("summonControlCastRejectFloat"), false);
    assert.equal(wx.includes("playerSpellHoverGlowShows"), false);
    assert.ok(wx.includes("attackNearestLiveCasterPos"));
    assert.ok(wx.includes("onSetWalk={() => {"));

    const panel = readSrc("../components/SummonControlPanel.tsx");
    assert.equal(panel.includes("Walk"), false);
    assert.equal(panel.includes("playerSpellHoverGlowShows"), false);
    assert.ok(panel.includes("disabled={currentAp < spell.apCost}"));

    const battle = readSrc("../components/BattleUIPanel.tsx");
    const walkBtn = battle.slice(
      battle.indexOf('data-ocid="battle_ui.walk_button"'),
      battle.indexOf('data-ocid="battle_ui.attack_button"'),
    );
    assert.ok(walkBtn.includes("currentBattleMp <= 0"));
    assert.equal(walkBtn.includes("isSummonControlled"), false);
    assert.equal(walkBtn.includes("playerSpellHoverGlowShows"), false);

    for (const spell of [
      physicalAttackSpell,
      frost,
      inferno,
      venom,
      poison,
      slow,
    ]) {
      assert.ok(spell);
      assert.equal(spell.id === "player-walk", false);
    }
    assert.equal(physicalAttackSpell.id, "physical_attack");
    assert.equal(Number(physicalAttackSpell.range), 1);
  });
});
