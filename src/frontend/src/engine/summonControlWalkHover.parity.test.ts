/**
 * Combat action parity: summon-control walk hover must use the summon
 * tile and summon MP. Live hover still measures Manhattan from the
 * player tile and colors against leftover player MP.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { physicalAttackSpell, starterSpells } from "../data/spellData.ts";
import { canAffordBattleWalk } from "./battleWalkMp.ts";
import {
  WALK_HOVER_AFFORDABLE_FILL,
  WALK_HOVER_UNAFFORDABLE_FILL,
  canExecuteSummonControlWalkHoverDest,
  liveWalkHoverLooksAffordable,
  liveWalkHoverManhattan,
  liveWalkHoverMpCost,
  liveWalkHoverOrigin,
  liveWalkHoverPaint,
  liveWalkHoverShowsLabel,
  liveWalkHoverWallet,
  shouldHighlightSummonControlWalkHoverDest,
  summonControlWalkHoverBudget,
  summonControlWalkHoverHighlightedIsExecutable,
  summonControlWalkHoverLooksAffordable,
  summonControlWalkHoverMpCost,
  summonControlWalkHoverOrigin,
  summonControlWalkHoverPaint,
  summonControlWalkHoverShowsLabel,
  walkHoverFillStyle,
} from "./summonControlWalkHover.ts";

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

function mpBudgetBlock(): string {
  const wx = wxSource();
  const start = wx.indexOf("const mpBudget = battleWalkMpBudget({");
  assert.ok(start >= 0, "live RAF still budgets walk from battleWalkMpBudget");
  const end = wx.indexOf(
    "if (!currentMap || !inBattleRef.current || mpBudget <= 0)",
    start,
  );
  assert.ok(end > start, "empty budget still skips the MP ring");
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

describe("player-controlled summon walk hover origin vs execute dest", () => {
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
    destInMpRing: true,
    playerPos,
    summonPos,
    dest: destNeighbour,
    playerMp: 3,
    summonMp: 2,
    pathLength: 1,
    costPerTile: 1,
  };

  it("treats catalog wisp MP 2 vs a 1-tile neighbour as the unique fire, not kit AP", () => {
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
    assert.equal(liveWalkHoverManhattan(playerPos, destNeighbour), 9);
    assert.equal(liveWalkHoverManhattan(summonPos, destNeighbour), 1);
    assert.equal(liveWalkHoverManhattan(playerPos, destPlayerNeighbour), 1);
    assert.equal(liveWalkHoverManhattan(summonPos, destThree), 3);
  });

  it("a highlighted empty neighbour is hover-green from the summon and executes", () => {
    assert.deepEqual(liveWalkHoverOrigin(playerPos), playerPos);
    assert.equal(liveWalkHoverWallet(uniqueFire.playerMp), 3);
    assert.equal(liveWalkHoverMpCost(uniqueFire), 9);
    assert.equal(liveWalkHoverShowsLabel(uniqueFire), true);
    assert.equal(
      liveWalkHoverLooksAffordable(uniqueFire),
      false,
      "live leftover still colors 9 MP red against player leftover 3",
    );
    const livePaint = liveWalkHoverPaint(uniqueFire);
    assert.equal(livePaint.show, true);
    assert.equal(livePaint.mpCost, 9);
    assert.equal(livePaint.fill, WALK_HOVER_UNAFFORDABLE_FILL);

    const origin = summonControlWalkHoverOrigin(uniqueFire);
    assert.deepEqual(origin, summonPos);
    assert.equal(summonControlWalkHoverBudget(uniqueFire), 2);
    assert.equal(
      summonControlWalkHoverMpCost({
        origin,
        dest: destNeighbour,
        pathLength: 1,
      }),
      1,
    );
    assert.equal(
      summonControlWalkHoverShowsLabel({ ...uniqueFire, origin }),
      true,
    );
    assert.equal(summonControlWalkHoverLooksAffordable(uniqueFire), true);
    const intended = summonControlWalkHoverPaint(uniqueFire);
    assert.equal(intended.show, true);
    assert.equal(intended.mpCost, 1);
    assert.equal(intended.fill, WALK_HOVER_AFFORDABLE_FILL);
    assert.equal(walkHoverFillStyle(true), WALK_HOVER_AFFORDABLE_FILL);

    const highlighted = shouldHighlightSummonControlWalkHoverDest(uniqueFire);
    const executable = canExecuteSummonControlWalkHoverDest(uniqueFire);
    assert.equal(highlighted, true);
    assert.equal(executable, true);
    assert.equal(
      summonControlWalkHoverHighlightedIsExecutable({
        highlighted,
        executable,
      }),
      true,
    );
    assert.equal(canAffordBattleWalk(2, 1, 1), true);
  });

  it("player-adjacent floor looks green live and cannot execute as a summon walk", () => {
    const nearPlayer = {
      ...uniqueFire,
      dest: destPlayerNeighbour,
      destInMpRing: false,
      pathLength: 11,
    };
    assert.equal(liveWalkHoverLooksAffordable(nearPlayer), true);
    assert.equal(
      liveWalkHoverPaint(nearPlayer).fill,
      WALK_HOVER_AFFORDABLE_FILL,
    );
    assert.equal(summonControlWalkHoverLooksAffordable(nearPlayer), false);
    assert.equal(
      summonControlWalkHoverPaint(nearPlayer).fill,
      WALK_HOVER_UNAFFORDABLE_FILL,
    );
    assert.equal(shouldHighlightSummonControlWalkHoverDest(nearPlayer), false);
    assert.equal(canExecuteSummonControlWalkHoverDest(nearPlayer), false);
    assert.equal(
      summonControlWalkHoverHighlightedIsExecutable({
        highlighted: false,
        executable: false,
      }),
      false,
    );

    const summonEmpty = {
      ...uniqueFire,
      summonMp: 0,
      destInMpRing: false,
    };
    assert.equal(liveWalkHoverLooksAffordable(summonEmpty), false);
    assert.equal(liveWalkHoverWallet(3), 3);
    assert.equal(summonControlWalkHoverBudget(summonEmpty), 0);
    assert.equal(canExecuteSummonControlWalkHoverDest(summonEmpty), false);
    assert.equal(shouldHighlightSummonControlWalkHoverDest(summonEmpty), false);
  });

  it("player turn still hovers from the player tile; 0 MP / Chebyshev 3 / own tile cannot", () => {
    const playerTurn = {
      ...uniqueFire,
      isSummonControlled: false,
      dest: destPlayerNeighbour,
      destInMpRing: true,
      pathLength: 1,
    };
    assert.deepEqual(summonControlWalkHoverOrigin(playerTurn), playerPos);
    assert.equal(summonControlWalkHoverBudget(playerTurn), 3);
    assert.equal(summonControlWalkHoverLooksAffordable(playerTurn), true);
    assert.equal(
      liveWalkHoverLooksAffordable(playerTurn),
      true,
      "player-turn leftover matches intended Manhattan — BFS dest cost stays #417",
    );
    assert.equal(
      shouldHighlightSummonControlWalkHoverDest(playerTurn),
      false,
      "this leftover is summon-control hover, not champion Walk",
    );
    assert.equal(canExecuteSummonControlWalkHoverDest(playerTurn), false);

    assert.equal(
      canExecuteSummonControlWalkHoverDest({
        ...uniqueFire,
        inBattle: false,
      }),
      false,
    );
    assert.equal(
      canExecuteSummonControlWalkHoverDest({
        ...uniqueFire,
        destIsFloor: false,
        destInMpRing: false,
      }),
      false,
    );
    assert.equal(
      canAffordBattleWalk(2, 3, 1),
      false,
      "catalog wisp MP 2 cannot pay a 3-tile walk — do not rebalance",
    );
    assert.equal(
      canExecuteSummonControlWalkHoverDest({
        ...uniqueFire,
        dest: destThree,
        destInMpRing: false,
        pathLength: 3,
      }),
      false,
    );
    assert.equal(
      summonControlWalkHoverShowsLabel({
        destIsFloor: true,
        origin: summonPos,
        dest: summonPos,
      }),
      false,
    );
    assert.equal(
      liveWalkHoverShowsLabel({
        destIsFloor: true,
        playerPos,
        dest: summonPos,
      }),
      true,
      "live leftover still paints Manhattan-from-player on the summon tile",
    );
  });

  it("live hover still keys origin and wallet off the player; RAF / execute already use the summon", () => {
    const hover = hoverPaintBlock();
    assert.ok(hover.includes("playerPositionRef.current.x"));
    assert.ok(hover.includes("playerPositionRef.current.y"));
    assert.ok(hover.includes("currentBattleMpRef.current"));
    assert.ok(hover.includes('"#4ade80"'));
    assert.ok(hover.includes('"#f87171"'));
    assert.equal(hover.includes("getActiveCasterPos"), false);
    assert.equal(hover.includes("battleWalkMpBudget"), false);
    assert.equal(hover.includes("summon.currentMp"), false);
    assert.equal(hover.includes("summonControlWalkHoverOrigin"), false);
    assert.equal(hover.includes("summonControlWalkHoverBudget"), false);
    assert.equal(hover.includes("shouldEnableSummonControlWalkButton"), false);
    assert.equal(hover.includes("decideSummonControlWalkCancel"), false);
    assert.equal(hover.includes("battleWalkHoverMpPreview"), false);
    assert.equal(hover.includes("battleWalkDestHoverMp"), false);

    const budget = mpBudgetBlock();
    assert.ok(budget.includes("playerMp: currentBattleMp"));
    assert.ok(budget.includes("controllingSummon: Boolean(controlledSummon)"));
    assert.ok(budget.includes("summonMp:"));

    const originFn = wxSource();
    const casterStart = originFn.indexOf(
      "const getActiveCasterPos = useCallback((): PlayerPosition => {",
    );
    assert.ok(casterStart >= 0);
    const casterEnd = originFn.indexOf("}, [combatantStoreCtx]);", casterStart);
    const caster = originFn.slice(casterStart, casterEnd);
    assert.ok(caster.includes("activeControlledSummonIdRef.current"));
    assert.ok(caster.includes("return playerPositionRef.current"));

    const mouse = summonControlMouseBlock();
    assert.ok(mouse.includes("canAffordBattleWalk("));
    assert.ok(mouse.includes("summon.currentMp ?? 0"));
    assert.ok(mouse.includes("applyControlledSummonWalk"));
    assert.ok(mouse.includes("findPath("));
    assert.equal(mouse.includes("currentBattleMp"), false);
    assert.equal(mouse.includes("summonControlWalkHoverOrigin"), false);

    const wx = wxSource();
    assert.equal(wx.includes("summonControlWalkHoverOrigin"), false);
    assert.equal(wx.includes("summonControlWalkHoverBudget"), false);
    assert.ok(wx.includes("isAttackNearestHotkey"));
  });

  it("live kit panel has no hover analog; Walk button / cancel / Attack stay other leftovers", () => {
    const panel = readSrc("../components/SummonControlPanel.tsx");
    assert.equal(panel.includes("Walk"), false);
    assert.equal(panel.includes("summonControlWalkHoverOrigin"), false);
    assert.equal(panel.includes("currentBattleMpRef"), false);
    assert.equal(panel.includes("battleWalkMpBudget"), false);
    assert.ok(panel.includes("disabled={currentAp < spell.apCost}"));
    assert.ok(panel.includes("onSelect={onSpellSelect}"));

    const battle = readSrc("../components/BattleUIPanel.tsx");
    const walkBtn = battle.slice(
      battle.indexOf('data-ocid="battle_ui.walk_button"'),
      battle.indexOf('data-ocid="battle_ui.attack_button"'),
    );
    assert.ok(walkBtn.includes("currentBattleMp <= 0"));
    assert.equal(walkBtn.includes("isSummonControlled"), false);
    assert.equal(walkBtn.includes("summonControlWalkHoverOrigin"), false);
    assert.equal(
      walkBtn.includes("shouldEnableSummonControlWalkButton"),
      false,
    );

    const wx = wxSource();
    assert.ok(wx.includes("onSetWalk={() => {"));
    assert.ok(wx.includes("onSetAttack={() => {"));
    assert.equal(wx.includes("decideSummonControlWalkCancel"), false);
    assert.equal(wx.includes("decideSummonControlAttackToggle"), false);
    assert.equal(wx.includes("shouldEnableSummonControlWalkButton"), false);
  });

  it("cannot steal Walk cancel, Walk enable, hover BFS dest cost, or kit dest leftovers", () => {
    assert.equal(canExecuteSummonControlWalkHoverDest(uniqueFire), true);
    const wx = wxSource();
    assert.equal(wx.includes("battleWalkHoverMpPreview"), false);
    assert.equal(wx.includes("battleWalkDestHoverMp"), false);
    assert.equal(wx.includes("computeBattleWalkReachable"), false);
    assert.equal(wx.includes("decideSummonControlWalkCancel"), false);
    assert.equal(wx.includes("shouldEnableSummonControlWalkButton"), false);
    assert.ok(wx.includes("attackNearestLiveCasterPos"));
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
    assert.equal(
      canExecuteSummonControlWalkHoverDest({
        ...uniqueFire,
        destInMpRing: false,
      }),
      false,
      "kit dest leftovers stay #1205 / #1238 / #1260 / #1263",
    );
  });
});
