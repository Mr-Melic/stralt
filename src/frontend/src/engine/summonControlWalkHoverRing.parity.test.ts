/**
 * Combat action parity: summon-control walk hover must not label dests
 * outside the painted MP ring. Live hover still shows any floor tile
 * with Manhattan > 0 from origin.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { physicalAttackSpell, starterSpells } from "../data/spellData.ts";
import { canAffordBattleWalk } from "./battleWalkMp.ts";
import {
  canExecuteSummonControlWalkHoverRingDest,
  liveWalkHoverRingPaint,
  liveWalkHoverRingShowsLabel,
  shouldHighlightSummonControlWalkHoverRingDest,
  summonControlWalkHoverRingHighlightedIsExecutable,
  summonControlWalkHoverRingPaint,
  summonControlWalkHoverRingShowsLabel,
  walkHoverRingManhattan,
} from "./summonControlWalkHoverRing.ts";

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

function summonControlMouseBlock(): string {
  const wx = wxSource();
  const marker =
    "          if (selectedSummonSpellId) {\n            const liveCombatants = getLiveCombatants(combatantStoreCtx);";
  const start = wx.indexOf(marker);
  assert.ok(start >= 0, "live WX mouse summon-control still gates on kit id");
  const end = wx.indexOf("          return;\n        }\n      }", start);
  assert.ok(end > start, "live WX mouse summon-control still returns early");
  return wx.slice(start, end);
}

describe("player-controlled summon walk hover ring vs execute dest", () => {
  const wisp = mustSpell("summon-wisp");
  const mend = mustSpell("starter-heal");
  const cry = mustSpell("spell-rallying-cry");
  const bomber = mustSpell("summon-bomber");
  const frost = mustSpell("starter-frost");
  const inferno = mustSpell("spell-inferno");
  const venom = mustSpell("spell-venom-strike");
  const poison = mustSpell("starter-poison");
  const slow = mustSpell("spell-slow");

  const playerPos = { x: 8, y: 8 };
  const summonPos = { x: 3, y: 3 };
  const destNeighbour = { x: 4, y: 3 };
  const destPlayerNeighbour = { x: 9, y: 8 };
  const destThree = { x: 6, y: 3 };

  const uniqueFire = {
    inBattle: true,
    isSummonControlled: true,
    destIsFloor: true,
    destInMpRing: false,
    origin: summonPos,
    dest: destThree,
    summonMp: 2,
    pathLength: 3,
    costPerTile: 1,
  };

  const inRingNeighbour = {
    ...uniqueFire,
    destInMpRing: true,
    dest: destNeighbour,
    pathLength: 1,
  };

  it("treats catalog wisp MP 2 vs a 3-tile dest as the unique fire, not kit AP", () => {
    assert.equal(wisp.summonUnitDef?.mp, 2);
    assert.equal(wisp.summonUnitDef?.ap, 2);
    assert.deepEqual(wisp.summonUnitDef?.summonKit, [
      "starter-heal",
      "spell-rallying-cry",
    ]);
    assert.equal(Number(mend.apCost), 3);
    assert.equal(Number(cry.apCost), 4);
    assert.equal(
      wisp.summonUnitDef?.summonKit?.includes("spell-inferno"),
      false,
    );
    assert.equal(bomber.summonUnitDef?.mp, 4);
    assert.equal(walkHoverRingManhattan(summonPos, destNeighbour), 1);
    assert.equal(walkHoverRingManhattan(summonPos, destThree), 3);
    assert.equal(walkHoverRingManhattan(playerPos, destThree), 7);
    assert.equal(walkHoverRingManhattan(playerPos, destPlayerNeighbour), 1);
    assert.equal(canAffordBattleWalk(2, 3, 1), false);
    assert.equal(canAffordBattleWalk(2, 1, 1), true);
  });

  it("a dest outside the 2-MP ring still gets a live label and cannot execute", () => {
    assert.equal(liveWalkHoverRingShowsLabel(uniqueFire), true);
    assert.equal(
      summonControlWalkHoverRingShowsLabel(uniqueFire),
      false,
      "intended hover hides dests RAF did not paint in the MP ring",
    );
    const livePaint = liveWalkHoverRingPaint(uniqueFire);
    assert.equal(livePaint.show, true);
    assert.equal(livePaint.mpCost, 3);
    const intended = summonControlWalkHoverRingPaint(uniqueFire);
    assert.equal(intended.show, false);
    assert.equal(intended.mpCost, 3);

    const fromPlayer = liveWalkHoverRingPaint({
      destIsFloor: true,
      origin: playerPos,
      dest: destThree,
    });
    assert.equal(
      fromPlayer.show,
      true,
      "live leftover still labels from the player tile too",
    );
    assert.equal(fromPlayer.mpCost, 7);

    const highlighted =
      shouldHighlightSummonControlWalkHoverRingDest(uniqueFire);
    const executable = canExecuteSummonControlWalkHoverRingDest(uniqueFire);
    assert.equal(highlighted, false);
    assert.equal(executable, false);
    assert.equal(
      summonControlWalkHoverRingHighlightedIsExecutable({
        highlighted,
        executable,
      }),
      false,
    );
  });

  it("a highlighted empty neighbour in the ring keeps the label and executes", () => {
    assert.equal(liveWalkHoverRingShowsLabel(inRingNeighbour), true);
    assert.equal(summonControlWalkHoverRingShowsLabel(inRingNeighbour), true);
    const intended = summonControlWalkHoverRingPaint(inRingNeighbour);
    assert.equal(intended.show, true);
    assert.equal(intended.mpCost, 1);

    const highlighted =
      shouldHighlightSummonControlWalkHoverRingDest(inRingNeighbour);
    const executable =
      canExecuteSummonControlWalkHoverRingDest(inRingNeighbour);
    assert.equal(highlighted, true);
    assert.equal(executable, true);
    assert.equal(
      summonControlWalkHoverRingHighlightedIsExecutable({
        highlighted,
        executable,
      }),
      true,
    );
    assert.equal(canAffordBattleWalk(2, 1, 1), true);
  });

  it("player-adjacent floor / 0 summon MP / player turn cannot execute as a summon walk", () => {
    const nearPlayer = {
      ...uniqueFire,
      dest: destPlayerNeighbour,
      destInMpRing: false,
      pathLength: 11,
    };
    assert.equal(liveWalkHoverRingShowsLabel(nearPlayer), true);
    assert.equal(summonControlWalkHoverRingShowsLabel(nearPlayer), false);
    assert.equal(
      shouldHighlightSummonControlWalkHoverRingDest(nearPlayer),
      false,
    );
    assert.equal(canExecuteSummonControlWalkHoverRingDest(nearPlayer), false);

    const summonEmpty = {
      ...inRingNeighbour,
      summonMp: 0,
      destInMpRing: false,
    };
    assert.equal(liveWalkHoverRingShowsLabel(summonEmpty), true);
    assert.equal(summonControlWalkHoverRingShowsLabel(summonEmpty), false);
    assert.equal(canExecuteSummonControlWalkHoverRingDest(summonEmpty), false);
    assert.equal(
      shouldHighlightSummonControlWalkHoverRingDest(summonEmpty),
      false,
    );

    const playerTurn = {
      ...inRingNeighbour,
      isSummonControlled: false,
    };
    assert.equal(
      shouldHighlightSummonControlWalkHoverRingDest(playerTurn),
      false,
      "this leftover is summon-control hover ring, not champion Walk",
    );
    assert.equal(canExecuteSummonControlWalkHoverRingDest(playerTurn), false);
    assert.equal(
      liveWalkHoverRingShowsLabel(playerTurn),
      true,
      "player-turn leftover still labels dest-is-floor + Manhattan > 0",
    );
  });

  it("own tile / wall / out of battle cannot; catalog 2 MP cannot pay a 3-tile walk", () => {
    assert.equal(
      canExecuteSummonControlWalkHoverRingDest({
        ...uniqueFire,
        inBattle: false,
      }),
      false,
    );
    assert.equal(
      liveWalkHoverRingShowsLabel({
        destIsFloor: false,
        origin: summonPos,
        dest: destThree,
      }),
      false,
    );
    assert.equal(
      liveWalkHoverRingShowsLabel({
        destIsFloor: true,
        origin: summonPos,
        dest: summonPos,
      }),
      false,
    );
    assert.equal(
      summonControlWalkHoverRingShowsLabel({
        destIsFloor: true,
        destInMpRing: true,
        origin: summonPos,
        dest: summonPos,
      }),
      false,
    );
    assert.equal(
      canAffordBattleWalk(2, 3, 1),
      false,
      "catalog wisp MP 2 cannot pay a 3-tile walk — do not rebalance",
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

    const mouse = summonControlMouseBlock();
    assert.ok(mouse.includes("getMpReachableTiles()"));
    assert.ok(mouse.includes("reachable.has("));
    assert.ok(mouse.includes("canAffordBattleWalk("));
    assert.ok(mouse.includes("summon.currentMp ?? 0"));
    assert.ok(mouse.includes("applyControlledSummonWalk"));
    assert.ok(mouse.includes("findPath("));
    assert.equal(mouse.includes("summonControlWalkHoverRingShowsLabel"), false);

    const wx = wxSource();
    assert.equal(wx.includes("summonControlWalkHoverRingShowsLabel"), false);
    assert.ok(wx.includes("isAttackNearestHotkey"));
    assert.ok(wx.includes("mpTiles.has(`${x},${y}`)"));
  });

  it("cannot steal Walk origin/wallet, Walk enable, hover BFS dest cost, or reject float", () => {
    assert.equal(
      canExecuteSummonControlWalkHoverRingDest(inRingNeighbour),
      true,
    );
    assert.equal(canExecuteSummonControlWalkHoverRingDest(uniqueFire), false);
    const wx = wxSource();
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
    assert.equal(panel.includes("summonControlWalkHoverRingShowsLabel"), false);
    assert.ok(panel.includes("disabled={currentAp < spell.apCost}"));

    const battle = readSrc("../components/BattleUIPanel.tsx");
    const walkBtn = battle.slice(
      battle.indexOf('data-ocid="battle_ui.walk_button"'),
      battle.indexOf('data-ocid="battle_ui.attack_button"'),
    );
    assert.ok(walkBtn.includes("currentBattleMp <= 0"));
    assert.equal(walkBtn.includes("isSummonControlled"), false);
    assert.equal(
      walkBtn.includes("summonControlWalkHoverRingShowsLabel"),
      false,
    );

    for (const spell of [
      physicalAttackSpell,
      frost,
      inferno,
      venom,
      poison,
      slow,
    ]) {
      assert.ok(spell);
      assert.equal(spell.id === "summon-wisp", false);
    }
  });
});
