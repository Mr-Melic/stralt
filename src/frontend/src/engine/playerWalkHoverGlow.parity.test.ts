/**
 * Combat action parity: champion walk hover must not pulse dests outside
 * the painted MP ring. Live glow still paints any hovered floor tile
 * while Walk is selected.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { PLAYER_BASE_MP } from "../data/gameConstants.ts";
import { physicalAttackSpell, starterSpells } from "../data/spellData.ts";
import { canAffordBattleWalk } from "./battleWalkMp.ts";
import {
  LIVE_PLAYER_WALK_HOVER_GLOW_RGB,
  canExecutePlayerWalkHoverGlowDest,
  livePlayerWalkHoverGlowShows,
  playerWalkHoverGlowHighlightedIsExecutable,
  playerWalkHoverGlowManhattan,
  playerWalkHoverGlowShows,
  shouldApplyPlayerWalkHoverGlow,
} from "./playerWalkHoverGlow.ts";

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

function hoverLabelBlock(): string {
  const wx = wxSource();
  const start = wx.indexOf(
    "// Tile hover movement cost (player turn, walk mode, in battle)",
  );
  assert.ok(start >= 0, "live RAF still paints walk hover MP");
  const end = wx.indexOf("Leader death animation", start);
  assert.ok(end > start, "leader death still follows hover paint");
  return wx.slice(start, end);
}

function mpRingPaintBlock(): string {
  const wx = wxSource();
  const start = wx.indexOf("const mpTiles =");
  assert.ok(start >= 0, "live RAF still snapshots the MP ring");
  const end = wx.indexOf("const spellTiles =", start);
  assert.ok(end > start, "spell ring still follows the MP ring snapshot");
  return wx.slice(start, end);
}

function playerWalkMouseBlock(): string {
  const wx = wxSource();
  const start = wx.indexOf("FIX 1a (mouse walk-mode single-occupancy)");
  assert.ok(start >= 0, "live WX mouse walk still occupancy-gates");
  const end = wx.indexOf("SELECT_SPELL_COPY", start);
  assert.ok(end > start, "attack-no-spell still follows mouse walk");
  return wx.slice(start, end);
}

function playerWalkTouchBlock(): string {
  const wx = wxSource();
  const start = wx.indexOf("FIX 1b (touch walk-mode single-occupancy)");
  assert.ok(start >= 0, "live WX touch walk still occupancy-gates");
  const end = wx.indexOf("SELECT_SPELL_COPY", start);
  assert.ok(end > start, "attack-no-spell still follows touch walk");
  return wx.slice(start, end);
}

describe("champion walk hover glow vs execute dest", () => {
  const frost = mustSpell("starter-frost");
  const inferno = mustSpell("spell-inferno");
  const venom = mustSpell("spell-venom-strike");
  const poison = mustSpell("starter-poison");
  const slow = mustSpell("spell-slow");
  const wisp = mustSpell("summon-wisp");

  const playerPos = { x: 8, y: 8 };
  const destNeighbour = { x: 9, y: 8 };
  const destFour = { x: 12, y: 8 };
  const destSummonNeighbour = { x: 4, y: 3 };

  const uniqueFire = {
    inBattle: true,
    battleActionMode: "walk",
    isSummonControlled: false,
    destIsFloor: true,
    destInMpRing: false,
    origin: playerPos,
    dest: destFour,
    playerMp: 3,
    pathLength: 4,
    costPerTile: 1,
  };

  const inRingNeighbour = {
    ...uniqueFire,
    destInMpRing: true,
    dest: destNeighbour,
    pathLength: 1,
  };

  it("treats leftover 3 MP vs a 4-tile dest as the unique fire, not catalog MP 4", () => {
    assert.equal(PLAYER_BASE_MP, 4);
    assert.equal(wisp.summonUnitDef?.mp, 2);
    assert.equal(playerWalkHoverGlowManhattan(playerPos, destNeighbour), 1);
    assert.equal(playerWalkHoverGlowManhattan(playerPos, destFour), 4);
    assert.equal(
      playerWalkHoverGlowManhattan(playerPos, destSummonNeighbour),
      9,
    );
    assert.equal(canAffordBattleWalk(3, 4, 1), false);
    assert.equal(canAffordBattleWalk(3, 1, 1), true);
    assert.equal(canAffordBattleWalk(4, 4, 1), true);
    assert.equal(
      canAffordBattleWalk(PLAYER_BASE_MP, 4, 1),
      true,
      "catalog 4 MP can pay a 4-tile walk — unique fire is leftover 3",
    );
    assert.equal(LIVE_PLAYER_WALK_HOVER_GLOW_RGB.r, 0);
    assert.equal(LIVE_PLAYER_WALK_HOVER_GLOW_RGB.g, 255);
    assert.equal(LIVE_PLAYER_WALK_HOVER_GLOW_RGB.b, 100);
  });

  it("a dest outside the 3-MP ring still gets a live walk glow and cannot execute", () => {
    assert.equal(livePlayerWalkHoverGlowShows(uniqueFire), true);
    assert.equal(
      playerWalkHoverGlowShows(uniqueFire),
      false,
      "intended glow hides dests RAF did not paint in the MP ring",
    );
    const glowing = shouldApplyPlayerWalkHoverGlow(uniqueFire);
    const executable = canExecutePlayerWalkHoverGlowDest(uniqueFire);
    assert.equal(glowing, false);
    assert.equal(executable, false);
    assert.equal(
      playerWalkHoverGlowHighlightedIsExecutable({
        glowing,
        executable,
      }),
      false,
    );
  });

  it("a glowing empty neighbour in the ring keeps the pulse and executes", () => {
    assert.equal(livePlayerWalkHoverGlowShows(inRingNeighbour), true);
    assert.equal(playerWalkHoverGlowShows(inRingNeighbour), true);
    const glowing = shouldApplyPlayerWalkHoverGlow(inRingNeighbour);
    const executable = canExecutePlayerWalkHoverGlowDest(inRingNeighbour);
    assert.equal(glowing, true);
    assert.equal(executable, true);
    assert.equal(
      playerWalkHoverGlowHighlightedIsExecutable({
        glowing,
        executable,
      }),
      true,
    );
    assert.equal(canAffordBattleWalk(3, 1, 1), true);
  });

  it("summon-control / 0 leftover MP / catalog-4 dest-4 cannot steal this leftover", () => {
    const duringControl = {
      ...inRingNeighbour,
      isSummonControlled: true,
    };
    assert.equal(
      shouldApplyPlayerWalkHoverGlow(duringControl),
      false,
      "this leftover is champion Walk, not summon-control ring #1334",
    );
    assert.equal(canExecutePlayerWalkHoverGlowDest(duringControl), false);
    assert.equal(
      livePlayerWalkHoverGlowShows(duringControl),
      true,
      "live leftover still pulses dest-is-floor + walk mode during control",
    );

    const emptyMp = {
      ...inRingNeighbour,
      playerMp: 0,
      destInMpRing: false,
    };
    assert.equal(livePlayerWalkHoverGlowShows(emptyMp), true);
    assert.equal(playerWalkHoverGlowShows(emptyMp), false);
    assert.equal(canExecutePlayerWalkHoverGlowDest(emptyMp), false);
    assert.equal(shouldApplyPlayerWalkHoverGlow(emptyMp), false);

    const catalogFour = {
      ...uniqueFire,
      playerMp: PLAYER_BASE_MP,
      destInMpRing: true,
    };
    assert.equal(
      canExecutePlayerWalkHoverGlowDest(catalogFour),
      true,
      "catalog 4 MP in a 4-tile ring is legal — unique fire needs leftover 3",
    );
    assert.equal(canExecutePlayerWalkHoverGlowDest(uniqueFire), false);
  });

  it("own tile / wall / out of battle / attack mode cannot; leftover 3 cannot pay a 4-tile walk", () => {
    assert.equal(
      canExecutePlayerWalkHoverGlowDest({
        ...uniqueFire,
        inBattle: false,
      }),
      false,
    );
    assert.equal(
      livePlayerWalkHoverGlowShows({
        inBattle: true,
        battleActionMode: "walk",
        destIsFloor: false,
      }),
      false,
    );
    assert.equal(
      livePlayerWalkHoverGlowShows({
        inBattle: true,
        battleActionMode: "attack",
        destIsFloor: true,
      }),
      false,
      "spell-hover purple is not this leftover",
    );
    assert.equal(
      playerWalkHoverGlowShows({
        inBattle: true,
        battleActionMode: "walk",
        destIsFloor: true,
        destInMpRing: true,
      }),
      true,
    );
    assert.equal(
      playerWalkHoverGlowShows({
        inBattle: true,
        battleActionMode: "walk",
        destIsFloor: true,
        destInMpRing: false,
      }),
      false,
    );
    assert.equal(
      shouldApplyPlayerWalkHoverGlow({
        ...inRingNeighbour,
        dest: playerPos,
        pathLength: 0,
        destInMpRing: false,
      }),
      false,
      "origin is not in the painted MP ring",
    );
    assert.equal(
      canAffordBattleWalk(3, 4, 1),
      false,
      "leftover 3 MP cannot pay a 4-tile walk — do not rebalance PLAYER_BASE_MP",
    );
  });

  it("live glow still keys pulse off hovered floor; RAF ring / execute already gate membership", () => {
    const glow = hoverGlowBlock();
    assert.ok(glow.includes('isHovered && tileType === "floor"'));
    assert.ok(glow.includes("isMpHover"));
    assert.ok(glow.includes('battleActionModeRef.current === "walk"'));
    assert.ok(glow.includes("isSpellHover"));
    assert.equal(glow.includes("getMpReachableTiles"), false);
    assert.equal(glow.includes("mpTiles.has"), false);
    assert.equal(glow.includes("reachable.has"), false);
    assert.equal(glow.includes("destInMpRing"), false);
    assert.equal(glow.includes("getActiveCasterPos"), false);
    assert.equal(glow.includes("battleWalkMpBudget"), false);
    assert.equal(glow.includes("playerWalkHoverGlowShows"), false);
    assert.equal(glow.includes("playerWalkHoverRingShowsLabel"), false);
    assert.equal(glow.includes("summonControlWalkHoverRingShowsLabel"), false);

    const label = hoverLabelBlock();
    assert.ok(label.includes("playerPositionRef.current.x"));
    assert.ok(label.includes("dist > 0"));
    assert.ok(label.includes('=== "floor"'));
    assert.equal(label.includes("mpTiles.has"), false);
    assert.equal(label.includes("playerWalkHoverGlowShows"), false);
    assert.equal(
      label.includes("playerWalkHoverRingShowsLabel"),
      false,
      "#1344 label sidecar stays unwired — this leftover is glow only",
    );

    const ring = mpRingPaintBlock();
    assert.ok(ring.includes("getMpReachableTiles()"));
    assert.ok(ring.includes('battleActionModeRef.current === "walk"'));

    const mouse = playerWalkMouseBlock();
    assert.ok(mouse.includes("getMpReachableTiles()"));
    assert.ok(mouse.includes("reachable.has("));
    assert.ok(mouse.includes("classifyWalkReject("));
    assert.equal(mouse.includes("playerWalkHoverGlowShows"), false);

    const touch = playerWalkTouchBlock();
    assert.ok(touch.includes("getMpReachableTiles()"));
    assert.ok(touch.includes("reachable.has("));
    assert.ok(touch.includes("classifyWalkReject("));
    assert.equal(touch.includes("playerWalkHoverGlowShows"), false);

    const wx = wxSource();
    assert.equal(wx.includes("playerWalkHoverGlowShows"), false);
    assert.ok(
      wx.includes("const [currentBattleMp, setCurrentBattleMp] = useState(3);"),
    );
    assert.ok(wx.includes("isAttackNearestHotkey"));
    assert.ok(wx.includes("mpTiles.has(`${x},${y}`)"));
    assert.ok(wx.includes("isMpHover ? 0 : 255"));
    assert.ok(wx.includes("isMpHover ? 255 : 255"));
    assert.ok(wx.includes("isMpHover ? 100 : 200"));
  });

  it("cannot steal summon-control ring, Walk origin/wallet, hover BFS dest cost, reject float, or #1344 labels", () => {
    assert.equal(canExecutePlayerWalkHoverGlowDest(inRingNeighbour), true);
    assert.equal(canExecutePlayerWalkHoverGlowDest(uniqueFire), false);
    const wx = wxSource();
    assert.equal(wx.includes("summonControlWalkHoverRingShowsLabel"), false);
    assert.equal(wx.includes("summonControlWalkHoverOrigin"), false);
    assert.equal(wx.includes("summonControlWalkHoverBudget"), false);
    assert.equal(wx.includes("shouldEnableSummonControlWalkButton"), false);
    assert.equal(wx.includes("decideSummonControlWalkCancel"), false);
    assert.equal(wx.includes("battleWalkHoverMpPreview"), false);
    assert.equal(wx.includes("battleWalkDestHoverMp"), false);
    assert.equal(wx.includes("computeBattleWalkReachable"), false);
    assert.equal(wx.includes("intendedSummonControlWalkRejectFeedback"), false);
    assert.equal(wx.includes("playerWalkHoverRingShowsLabel"), false);
    assert.equal(wx.includes("summonControlCastRejectFloat"), false);
    assert.ok(wx.includes("attackNearestLiveCasterPos"));
    assert.ok(wx.includes("onSetWalk={() => {"));

    const panel = readSrc("../components/SummonControlPanel.tsx");
    assert.equal(panel.includes("Walk"), false);
    assert.equal(panel.includes("playerWalkHoverGlowShows"), false);
    assert.ok(panel.includes("disabled={currentAp < spell.apCost}"));

    const battle = readSrc("../components/BattleUIPanel.tsx");
    const walkBtn = battle.slice(
      battle.indexOf('data-ocid="battle_ui.walk_button"'),
      battle.indexOf('data-ocid="battle_ui.attack_button"'),
    );
    assert.ok(walkBtn.includes("currentBattleMp <= 0"));
    assert.equal(walkBtn.includes("isSummonControlled"), false);
    assert.equal(walkBtn.includes("playerWalkHoverGlowShows"), false);

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
  });
});
