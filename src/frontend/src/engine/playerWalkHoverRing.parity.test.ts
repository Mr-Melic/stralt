/**
 * Combat action parity: champion walk hover must not label dests outside
 * the painted MP ring. Live hover still shows any floor tile with
 * Manhattan > 0 from the player.
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
  canExecutePlayerWalkHoverRingDest,
  livePlayerWalkHoverRingPaint,
  livePlayerWalkHoverRingShowsLabel,
  playerWalkHoverRingHighlightedIsExecutable,
  playerWalkHoverRingManhattan,
  playerWalkHoverRingPaint,
  playerWalkHoverRingShowsLabel,
  shouldHighlightPlayerWalkHoverRingDest,
} from "./playerWalkHoverRing.ts";

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

function hoverPaintBlock(): string {
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

describe("champion walk hover ring vs execute dest", () => {
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
    assert.equal(playerWalkHoverRingManhattan(playerPos, destNeighbour), 1);
    assert.equal(playerWalkHoverRingManhattan(playerPos, destFour), 4);
    assert.equal(
      playerWalkHoverRingManhattan(playerPos, destSummonNeighbour),
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
  });

  it("a dest outside the 3-MP ring still gets a live label and cannot execute", () => {
    assert.equal(livePlayerWalkHoverRingShowsLabel(uniqueFire), true);
    assert.equal(
      playerWalkHoverRingShowsLabel(uniqueFire),
      false,
      "intended hover hides dests RAF did not paint in the MP ring",
    );
    const livePaint = livePlayerWalkHoverRingPaint(uniqueFire);
    assert.equal(livePaint.show, true);
    assert.equal(livePaint.mpCost, 4);
    const intended = playerWalkHoverRingPaint(uniqueFire);
    assert.equal(intended.show, false);
    assert.equal(intended.mpCost, 4);

    const highlighted = shouldHighlightPlayerWalkHoverRingDest(uniqueFire);
    const executable = canExecutePlayerWalkHoverRingDest(uniqueFire);
    assert.equal(highlighted, false);
    assert.equal(executable, false);
    assert.equal(
      playerWalkHoverRingHighlightedIsExecutable({
        highlighted,
        executable,
      }),
      false,
    );
  });

  it("a highlighted empty neighbour in the ring keeps the label and executes", () => {
    assert.equal(livePlayerWalkHoverRingShowsLabel(inRingNeighbour), true);
    assert.equal(playerWalkHoverRingShowsLabel(inRingNeighbour), true);
    const intended = playerWalkHoverRingPaint(inRingNeighbour);
    assert.equal(intended.show, true);
    assert.equal(intended.mpCost, 1);

    const highlighted = shouldHighlightPlayerWalkHoverRingDest(inRingNeighbour);
    const executable = canExecutePlayerWalkHoverRingDest(inRingNeighbour);
    assert.equal(highlighted, true);
    assert.equal(executable, true);
    assert.equal(
      playerWalkHoverRingHighlightedIsExecutable({
        highlighted,
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
      shouldHighlightPlayerWalkHoverRingDest(duringControl),
      false,
      "this leftover is champion Walk, not summon-control ring #1334",
    );
    assert.equal(canExecutePlayerWalkHoverRingDest(duringControl), false);
    assert.equal(
      livePlayerWalkHoverRingShowsLabel(duringControl),
      true,
      "live leftover still labels dest-is-floor + Manhattan > 0 during control",
    );

    const emptyMp = {
      ...inRingNeighbour,
      playerMp: 0,
      destInMpRing: false,
    };
    assert.equal(livePlayerWalkHoverRingShowsLabel(emptyMp), true);
    assert.equal(playerWalkHoverRingShowsLabel(emptyMp), false);
    assert.equal(canExecutePlayerWalkHoverRingDest(emptyMp), false);
    assert.equal(shouldHighlightPlayerWalkHoverRingDest(emptyMp), false);

    const catalogFour = {
      ...uniqueFire,
      playerMp: PLAYER_BASE_MP,
      destInMpRing: true,
    };
    assert.equal(
      canExecutePlayerWalkHoverRingDest(catalogFour),
      true,
      "catalog 4 MP in a 4-tile ring is legal — unique fire needs leftover 3",
    );
    assert.equal(canExecutePlayerWalkHoverRingDest(uniqueFire), false);
  });

  it("own tile / wall / out of battle cannot; leftover 3 cannot pay a 4-tile walk", () => {
    assert.equal(
      canExecutePlayerWalkHoverRingDest({
        ...uniqueFire,
        inBattle: false,
      }),
      false,
    );
    assert.equal(
      livePlayerWalkHoverRingShowsLabel({
        destIsFloor: false,
        origin: playerPos,
        dest: destFour,
      }),
      false,
    );
    assert.equal(
      livePlayerWalkHoverRingShowsLabel({
        destIsFloor: true,
        origin: playerPos,
        dest: playerPos,
      }),
      false,
    );
    assert.equal(
      playerWalkHoverRingShowsLabel({
        destIsFloor: true,
        destInMpRing: true,
        origin: playerPos,
        dest: playerPos,
      }),
      false,
    );
    assert.equal(
      canAffordBattleWalk(3, 4, 1),
      false,
      "leftover 3 MP cannot pay a 4-tile walk — do not rebalance PLAYER_BASE_MP",
    );
  });

  it("live hover still keys show off floor + dist; RAF ring / execute already gate membership", () => {
    const hover = hoverPaintBlock();
    assert.ok(hover.includes("playerPositionRef.current.x"));
    assert.ok(hover.includes("playerPositionRef.current.y"));
    assert.ok(hover.includes("currentBattleMpRef.current"));
    assert.ok(hover.includes("dist > 0"));
    assert.ok(hover.includes('=== "floor"'));
    assert.equal(hover.includes("getMpReachableTiles"), false);
    assert.equal(hover.includes("mpTiles.has"), false);
    assert.equal(hover.includes("reachable.has"), false);
    assert.equal(hover.includes("destInMpRing"), false);
    assert.equal(hover.includes("getActiveCasterPos"), false);
    assert.equal(hover.includes("battleWalkMpBudget"), false);
    assert.equal(hover.includes("playerWalkHoverRingShowsLabel"), false);
    assert.equal(hover.includes("summonControlWalkHoverRingShowsLabel"), false);
    assert.equal(hover.includes("summonControlWalkHoverOrigin"), false);
    assert.equal(hover.includes("shouldEnableSummonControlWalkButton"), false);
    assert.equal(hover.includes("decideSummonControlWalkCancel"), false);
    assert.equal(hover.includes("battleWalkHoverMpPreview"), false);
    assert.equal(
      hover.includes("intendedSummonControlWalkRejectFeedback"),
      false,
    );

    const ring = mpRingPaintBlock();
    assert.ok(ring.includes("getMpReachableTiles()"));
    assert.ok(ring.includes('battleActionModeRef.current === "walk"'));

    const mouse = playerWalkMouseBlock();
    assert.ok(mouse.includes("getMpReachableTiles()"));
    assert.ok(mouse.includes("reachable.has("));
    assert.ok(mouse.includes("classifyWalkReject("));
    assert.equal(mouse.includes("canAffordBattleWalk"), false);
    assert.ok(mouse.includes("battleWalkMpCost("));
    assert.equal(mouse.includes("playerWalkHoverRingShowsLabel"), false);

    const touch = playerWalkTouchBlock();
    assert.ok(touch.includes("getMpReachableTiles()"));
    assert.ok(touch.includes("reachable.has("));
    assert.ok(touch.includes("classifyWalkReject("));
    assert.equal(touch.includes("playerWalkHoverRingShowsLabel"), false);

    const wx = wxSource();
    assert.equal(wx.includes("playerWalkHoverRingShowsLabel"), false);
    assert.ok(
      wx.includes("const [currentBattleMp, setCurrentBattleMp] = useState(3);"),
    );
    assert.ok(wx.includes("isAttackNearestHotkey"));
    assert.ok(wx.includes("mpTiles.has(`${x},${y}`)"));
  });

  it("cannot steal summon-control ring, Walk origin/wallet, hover BFS dest cost, or reject float", () => {
    assert.equal(canExecutePlayerWalkHoverRingDest(inRingNeighbour), true);
    assert.equal(canExecutePlayerWalkHoverRingDest(uniqueFire), false);
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
    assert.ok(wx.includes("attackNearestLiveCasterPos"));
    assert.ok(wx.includes("onSetWalk={() => {"));

    const panel = readSrc("../components/SummonControlPanel.tsx");
    assert.equal(panel.includes("Walk"), false);
    assert.equal(panel.includes("playerWalkHoverRingShowsLabel"), false);
    assert.ok(panel.includes("disabled={currentAp < spell.apCost}"));

    const battle = readSrc("../components/BattleUIPanel.tsx");
    const walkBtn = battle.slice(
      battle.indexOf('data-ocid="battle_ui.walk_button"'),
      battle.indexOf('data-ocid="battle_ui.attack_button"'),
    );
    assert.ok(walkBtn.includes("currentBattleMp <= 0"));
    assert.equal(walkBtn.includes("isSummonControlled"), false);
    assert.equal(walkBtn.includes("playerWalkHoverRingShowsLabel"), false);

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
