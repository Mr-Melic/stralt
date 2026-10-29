/**
 * Combat action parity: a highlighted legal summon-control Walk dest is
 * executable under summon MP even when leftover player MP greys the Walk
 * button, and an illegal dest cannot execute when player leftover would
 * enable the live button.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { physicalAttackSpell, starterSpells } from "../data/spellData.ts";
import { canAffordBattleWalk } from "./battleWalkMp.ts";
import {
  canExecuteSummonControlWalkButtonDest,
  executeSummonControlWalkButtonDest,
  liveWalkButtonLooksEnabled,
  liveWalkExecuteMp,
  shouldEnableSummonControlWalkButton,
  shouldHighlightSummonControlWalkButtonDest,
  summonControlWalkButtonBudget,
  summonControlWalkButtonHighlightedIsExecutable,
  summonControlWalkButtonTitle,
} from "./summonControlWalkButton.ts";

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

function onSetWalkBlock(): string {
  const wx = wxSource();
  const start = wx.indexOf("onSetWalk={() => {");
  assert.ok(start >= 0, "live WX onSetWalk is present");
  const end = wx.indexOf("onSetAttack={() => {", start);
  assert.ok(end > start, "Attack toggle still follows Walk");
  return wx.slice(start, end);
}

function walkButtonBlock(): string {
  const battle = readSrc("../components/BattleUIPanel.tsx");
  const start = battle.indexOf('data-ocid="battle_ui.walk_button"');
  assert.ok(start >= 0, "live Walk button is present");
  const end = battle.indexOf('data-ocid="battle_ui.attack_button"', start);
  assert.ok(end > start, "Attack button still follows Walk");
  return battle.slice(start, end);
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

describe("player-controlled summon champion Walk button vs MP dest", () => {
  const wisp = mustSpell("summon-wisp");
  const mend = mustSpell("starter-heal");
  const cry = mustSpell("spell-rallying-cry");
  const inferno = mustSpell("spell-inferno");
  const poison = mustSpell("starter-poison");
  const venom = mustSpell("spell-venom-strike");
  const frost = mustSpell("starter-frost");
  const slow = mustSpell("spell-slow");
  const bomber = mustSpell("summon-bomber");

  const uniqueFire = {
    inBattle: true,
    isSummonControlled: true,
    destInMpRing: true,
    playerMp: 0,
    summonMp: 2,
    pathLength: 1,
  };

  it("treats catalog wisp leftover player MP 0 as the unique fire, not kit AP", () => {
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
  });

  it("enables Walk from summon MP 2 so a highlighted empty neighbour executes", () => {
    assert.equal(liveWalkButtonLooksEnabled(uniqueFire.playerMp), false);
    assert.equal(
      shouldEnableSummonControlWalkButton(uniqueFire),
      true,
      "intended: catalog wisp MP 2 still has a 1-tile walk",
    );
    assert.equal(summonControlWalkButtonBudget(uniqueFire), 2);
    assert.equal(
      liveWalkExecuteMp(uniqueFire),
      2,
      "live canvas already charges summon MP",
    );
    assert.equal(
      summonControlWalkButtonTitle(
        shouldEnableSummonControlWalkButton(uniqueFire),
      ),
      "Walk — spend MP to move onto a highlighted tile",
    );
    assert.equal(
      summonControlWalkButtonTitle(
        liveWalkButtonLooksEnabled(uniqueFire.playerMp),
      ),
      "No Movement Points left this turn",
      "live leftover still advertises no MP from player leftover 0",
    );

    const highlighted = shouldHighlightSummonControlWalkButtonDest(uniqueFire);
    assert.equal(highlighted, true);
    assert.equal(canExecuteSummonControlWalkButtonDest(uniqueFire), true);
    assert.deepEqual(executeSummonControlWalkButtonDest(uniqueFire), {
      dest: "walk",
    });
    assert.equal(
      summonControlWalkButtonHighlightedIsExecutable({
        highlighted,
        executable: true,
      }),
      true,
    );
    assert.equal(canAffordBattleWalk(2, 1, 1), true);
  });

  it("player leftover MP 3 with summon MP 0 cannot execute; player turn still uses player MP", () => {
    const playerLeftover = {
      ...uniqueFire,
      playerMp: 3,
      summonMp: 0,
    };
    assert.equal(liveWalkButtonLooksEnabled(playerLeftover.playerMp), true);
    assert.equal(shouldEnableSummonControlWalkButton(playerLeftover), false);
    assert.equal(summonControlWalkButtonBudget(playerLeftover), 0);
    assert.equal(
      shouldHighlightSummonControlWalkButtonDest(playerLeftover),
      false,
    );
    assert.equal(canExecuteSummonControlWalkButtonDest(playerLeftover), false);
    assert.equal(executeSummonControlWalkButtonDest(playerLeftover), null);
    assert.equal(
      summonControlWalkButtonHighlightedIsExecutable({
        highlighted: false,
        executable: false,
      }),
      false,
    );

    const playerReady = {
      ...uniqueFire,
      isSummonControlled: false,
      playerMp: 2,
      summonMp: 0,
    };
    assert.equal(shouldEnableSummonControlWalkButton(playerReady), true);
    assert.equal(liveWalkButtonLooksEnabled(playerReady.playerMp), true);
    assert.deepEqual(executeSummonControlWalkButtonDest(playerReady), {
      dest: "walk",
    });
    assert.equal(
      shouldEnableSummonControlWalkButton({
        ...playerReady,
        playerMp: 0,
      }),
      false,
    );
    assert.equal(
      executeSummonControlWalkButtonDest({
        ...playerReady,
        playerMp: 0,
      }),
      null,
    );
    assert.equal(
      shouldEnableSummonControlWalkButton({
        ...uniqueFire,
        inBattle: false,
      }),
      false,
    );
    assert.equal(
      executeSummonControlWalkButtonDest({
        ...uniqueFire,
        inBattle: false,
      }),
      null,
    );
  });

  it("cannot execute 0 summon MP, dest outside the ring, or Chebyshev 3 on 2 MP", () => {
    assert.equal(
      shouldHighlightSummonControlWalkButtonDest({
        ...uniqueFire,
        summonMp: 0,
      }),
      false,
    );
    assert.equal(
      executeSummonControlWalkButtonDest({
        ...uniqueFire,
        summonMp: 0,
      }),
      null,
    );
    assert.equal(
      shouldHighlightSummonControlWalkButtonDest({
        ...uniqueFire,
        destInMpRing: false,
      }),
      false,
    );
    assert.equal(
      executeSummonControlWalkButtonDest({
        ...uniqueFire,
        destInMpRing: false,
      }),
      null,
    );
    assert.equal(
      canAffordBattleWalk(2, 3, 1),
      false,
      "catalog wisp MP 2 cannot pay a 3-tile walk — do not rebalance",
    );
    assert.equal(
      executeSummonControlWalkButtonDest({
        ...uniqueFire,
        pathLength: 3,
      }),
      null,
    );
  });

  it("live Walk greys on currentBattleMp; RAF / execute already use summon MP", () => {
    const walkBtn = walkButtonBlock();
    assert.ok(walkBtn.includes("onClick={onSetWalk}"));
    assert.ok(walkBtn.includes("currentBattleMp <= 0"));
    assert.equal(walkBtn.includes("isSummonControlled"), false);
    assert.equal(walkBtn.includes("battleWalkMpBudget"), false);
    assert.equal(
      walkBtn.includes("shouldEnableSummonControlWalkButton"),
      false,
    );
    assert.equal(walkBtn.includes("summon.currentMp"), false);
    assert.equal(walkBtn.includes("disabled="), false);
    assert.ok(walkBtn.includes("No Movement Points left this turn"));

    const walk = onSetWalkBlock();
    assert.ok(walk.includes('setBattleActionMode("walk")'));
    assert.ok(walk.includes("selectedSpellIdRef.current = null"));
    assert.equal(walk.includes("currentBattleMp"), false);
    assert.equal(walk.includes("battleWalkMpBudget"), false);
    assert.equal(walk.includes("isSummonControlled"), false);
    assert.equal(walk.includes("setSelectedSummonSpellId"), false);
    assert.equal(walk.includes("shouldEnableSummonControlWalkButton"), false);
    assert.equal(walk.includes("decideSummonControlWalkCancel"), false);
    assert.equal(walk.includes("decideSummonControlAttackToggle"), false);

    const budget = mpBudgetBlock();
    assert.ok(budget.includes("playerMp: currentBattleMp"));
    assert.ok(budget.includes("controllingSummon: Boolean(controlledSummon)"));
    assert.ok(budget.includes("summonMp:"));

    const mouse = summonControlMouseBlock();
    assert.ok(mouse.includes("canAffordBattleWalk("));
    assert.ok(mouse.includes("summon.currentMp ?? 0"));
    assert.ok(mouse.includes("applyControlledSummonWalk"));
    assert.equal(mouse.includes("currentBattleMp"), false);
    assert.equal(mouse.includes("shouldEnableSummonControlWalkButton"), false);

    const wx = wxSource();
    assert.equal(wx.includes("shouldEnableSummonControlWalkButton"), false);
    assert.equal(wx.includes("summonControlWalkButtonBudget"), false);
    assert.ok(wx.includes("isAttackNearestHotkey"));
  });

  it("live kit panel has no Walk analog; Attack / Escape / Digit / S stay other leftovers", () => {
    const panel = readSrc("../components/SummonControlPanel.tsx");
    assert.equal(panel.includes("Walk"), false);
    assert.equal(panel.includes("onSetWalk"), false);
    assert.equal(panel.includes("battleWalkMpBudget"), false);
    assert.ok(panel.includes("disabled={currentAp < spell.apCost}"));
    assert.ok(panel.includes("onSelect={onSpellSelect}"));
    assert.equal(panel.includes("addEventListener"), false);

    const battle = readSrc("../components/BattleUIPanel.tsx");
    const attackBtn = battle.slice(
      battle.indexOf('data-ocid="battle_ui.attack_button"'),
      battle.indexOf('data-ocid="battle_ui.end_battle_button"'),
    );
    assert.ok(attackBtn.includes("currentBattleAp <= 0"));
    assert.equal(attackBtn.includes("isSummonControlled"), false);
    const endTurnStart = battle.indexOf(
      'data-ocid="battle_ui.end_turn_button"',
    );
    assert.ok(endTurnStart >= 0);
    const endTurnBtn = battle.slice(
      endTurnStart,
      battle.indexOf("summon_turn_label", endTurnStart),
    );
    assert.ok(endTurnBtn.includes("isSummonControlled"));

    const wx = wxSource();
    const keydownNeedle = "if (!isAttackNearestHotkey(e)) return;";
    const keyStart = wx.indexOf(keydownNeedle);
    assert.ok(keyStart >= 0);
    const keyEnd = wx.indexOf("}, [attackNearestEnemy]);", keyStart);
    const keydown = wx.slice(keyStart, keyEnd);
    assert.ok(keydown.includes("attackNearestEnemy"));
    assert.equal(keydown.includes("onSetWalk"), false);
    assert.equal(
      keydown.includes("shouldEnableSummonControlWalkButton"),
      false,
    );
    assert.equal(keydown.includes("decideSummonControlWalkCancel"), false);
    assert.equal(keydown.includes("decideSummonControlAttackToggle"), false);
    assert.equal(keydown.includes("decideSummonControlHotkeyCancel"), false);
    assert.equal(keydown.includes("decideSummonControlKitHotkey"), false);
  });

  it("cannot steal Walk cancel, Attack toggle, or kit dest leftovers", () => {
    assert.equal(executeSummonControlWalkButtonDest(uniqueFire)?.dest, "walk");
    assert.equal(
      executeSummonControlWalkButtonDest({
        ...uniqueFire,
        destInMpRing: false,
      }),
      null,
      "kit dest leftovers stay #1205 / #1238 / #1260 / #1263",
    );
    const wx = wxSource();
    assert.equal(wx.includes("decideSummonControlWalkCancel"), false);
    assert.equal(wx.includes("decideSummonControlAttackToggle"), false);
    assert.equal(wx.includes("setSelectedSummonSpellId"), true);
    assert.ok(wx.includes("attackNearestLiveCasterPos"));
    assert.ok(wx.includes("onSetAttack={() => {"));
  });

  it("cannot execute Strike / Frost / Inferno / Venom / Poison / Slow / bomber as this leftover", () => {
    for (const spell of [
      physicalAttackSpell,
      frost,
      inferno,
      venom,
      poison,
      slow,
    ]) {
      assert.ok(spell);
      assert.equal(
        spell.id === "starter-heal",
        false,
        `${spell.id} is not Digit 1 of the wisp kit`,
      );
    }
    assert.equal(
      bomber.summonUnitDef?.summonKit?.includes("spell-inferno"),
      true,
    );
    assert.equal(
      executeSummonControlWalkButtonDest({
        ...uniqueFire,
        destInMpRing: false,
        pathLength: 1,
      }),
      null,
    );
  });
});
