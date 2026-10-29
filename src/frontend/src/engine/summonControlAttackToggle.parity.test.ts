/**
 * Combat action parity: champion Attack during summon control must not
 * enter player attack mode. Live onSetAttack still gates on player AP.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { starterSpells } from "../data/spellData.ts";
import {
  decideSummonControlAttackToggle,
  liveOnSetAttackWouldEnterAttack,
  nextBattleActionModeAfterAttackToggle,
  shouldEnterPlayerAttackMode,
  shouldPaintSummonControlWalkRing,
  summonControlAttackHidesWalkRing,
} from "./summonControlAttackToggle.ts";

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

function onSetAttackBlock(): string {
  const wx = wxSource();
  const start = wx.indexOf("onSetAttack={() => {");
  assert.ok(start >= 0, "live WX onSetAttack is present");
  const end = wx.indexOf("currentBattleAp={currentBattleAp}", start);
  assert.ok(end > start, "player AP prop still follows Attack");
  return wx.slice(start, end);
}

describe("player-controlled summon champion Attack toggle vs walk ring", () => {
  const wisp = mustSpell("summon-wisp");
  const mend = mustSpell("starter-heal");

  const uniqueFire = {
    inBattle: true,
    isSummonControlled: true,
    playerAp: 2,
  };

  it("treats catalog wisp leftover player AP 2 as the unique fire, not kit AP", () => {
    assert.equal(wisp.summonUnitDef?.ap, 2);
    assert.equal(wisp.summonUnitDef?.mp, 2);
    assert.deepEqual(wisp.summonUnitDef?.summonKit, [
      "starter-heal",
      "spell-rallying-cry",
    ]);
    assert.equal(Number(mend.apCost), 3);
    assert.equal(
      wisp.summonUnitDef?.summonKit?.includes("spell-inferno"),
      false,
    );
  });

  it("refuses Attack during summon control so a leftover player AP 2 walk ring stays", () => {
    const decision = decideSummonControlAttackToggle(uniqueFire);
    assert.deepEqual(decision, {
      action: "none",
      reason: "summon_controlled",
    });
    assert.equal(shouldEnterPlayerAttackMode(decision), false);
    assert.equal(
      nextBattleActionModeAfterAttackToggle(decision, "walk"),
      "walk",
    );
    assert.equal(
      liveOnSetAttackWouldEnterAttack(uniqueFire.playerAp),
      true,
      "live leftover: player AP 2 still enters attack",
    );
    assert.equal(
      summonControlAttackHidesWalkRing({
        isSummonControlled: true,
        battleActionMode: "attack",
      }),
      true,
      "live leftover attack mode drops the summon MP ring",
    );
    assert.equal(
      shouldPaintSummonControlWalkRing({
        inBattle: true,
        isSummonControlled: true,
        battleActionMode: nextBattleActionModeAfterAttackToggle(
          decision,
          "walk",
        ),
      }),
      true,
    );
    assert.equal(
      decideSummonControlAttackToggle({
        ...uniqueFire,
        playerAp: 0,
      }).reason,
      "summon_controlled",
      "summon AP 0 / player AP 0 is still summon-control, not no_player_ap",
    );
    assert.equal(
      liveOnSetAttackWouldEnterAttack(0),
      false,
      "live leftover also ignores summon AP when player AP is 0",
    );
  });

  it("player turn with leftover AP still enters attack; 0 AP and overworld cannot", () => {
    const playerReady = decideSummonControlAttackToggle({
      inBattle: true,
      isSummonControlled: false,
      playerAp: 2,
    });
    assert.deepEqual(playerReady, { action: "set-attack" });
    assert.equal(shouldEnterPlayerAttackMode(playerReady), true);
    assert.equal(
      nextBattleActionModeAfterAttackToggle(playerReady, "walk"),
      "attack",
    );
    assert.equal(
      decideSummonControlAttackToggle({
        inBattle: true,
        isSummonControlled: false,
        playerAp: 0,
      }).reason,
      "no_player_ap",
    );
    assert.equal(
      decideSummonControlAttackToggle({
        inBattle: false,
        isSummonControlled: true,
        playerAp: 2,
      }).reason,
      "out_of_battle",
    );
    assert.equal(
      nextBattleActionModeAfterAttackToggle(
        { action: "none", reason: "player_turn" },
        "walk",
      ),
      "walk",
    );
    assert.equal(
      shouldPaintSummonControlWalkRing({
        inBattle: true,
        isSummonControlled: false,
        battleActionMode: "walk",
      }),
      false,
      "player-turn walk ring is the champion MP path, not this leftover",
    );
  });

  it("live Attack only gates currentBattleAp; kit / Walk / Escape / Digit / S stay other leftovers", () => {
    const attack = onSetAttackBlock();
    assert.ok(attack.includes("currentBattleAp > 0"));
    assert.ok(attack.includes('setBattleActionMode("attack")'));
    assert.equal(attack.includes("isSummonControlled"), false);
    assert.equal(attack.includes("activeControlledSummonId"), false);
    assert.equal(attack.includes("decideSummonControlAttackToggle"), false);
    assert.equal(attack.includes("summon.currentAp"), false);

    const wx = wxSource();
    assert.equal(wx.includes("decideSummonControlAttackToggle"), false);
    assert.equal(wx.includes("nextBattleActionModeAfterAttackToggle"), false);
    assert.ok(wx.includes("isAttackNearestHotkey"));
    const keydownNeedle = "if (!isAttackNearestHotkey(e)) return;";
    const keyStart = wx.indexOf(keydownNeedle);
    assert.ok(keyStart >= 0);
    const keyEnd = wx.indexOf("}, [attackNearestEnemy]);", keyStart);
    const keydown = wx.slice(keyStart, keyEnd);
    assert.ok(keydown.includes("attackNearestEnemy"));
    assert.equal(keydown.includes("onSetAttack"), false);
    assert.equal(keydown.includes("decideSummonControlAttackToggle"), false);
    assert.equal(keydown.includes("decideSummonControlWalkCancel"), false);
    assert.equal(keydown.includes("decideSummonControlHotkeyCancel"), false);
    assert.equal(keydown.includes("decideSummonControlKitHotkey"), false);

    const paintStart = wx.indexOf("const mpTiles =");
    assert.ok(paintStart >= 0);
    const spellStart = wx.indexOf("const spellTiles =", paintStart);
    const mpPaint = wx.slice(paintStart, spellStart);
    assert.ok(mpPaint.includes('battleActionModeRef.current === "walk"'));
    assert.ok(mpPaint.includes("getMpReachableTiles()"));
    const spellEnd = wx.indexOf("const barrierTileSnapshot", spellStart);
    const spellPaint = wx.slice(spellStart, spellEnd);
    assert.ok(spellPaint.includes('battleActionModeRef.current === "attack"'));
    assert.ok(spellPaint.includes("getSpellRangeTiles()"));
    assert.ok(wx.includes("const casterPos = getActiveCasterPos();"));

    const battle = readSrc("../components/BattleUIPanel.tsx");
    const attackBtn = battle.slice(
      battle.indexOf('data-ocid="battle_ui.attack_button"'),
      battle.indexOf('data-ocid="battle_ui.end_battle_button"'),
    );
    assert.ok(attackBtn.includes("onClick={onSetAttack}"));
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

    const panel = readSrc("../components/SummonControlPanel.tsx");
    assert.equal(panel.includes("onSetAttack"), false);
    assert.equal(panel.includes("battleActionMode"), false);
    assert.ok(panel.includes("disabled={currentAp < spell.apCost}"));
    assert.ok(panel.includes("onSelect={onSpellSelect}"));
    assert.equal(panel.includes("addEventListener"), false);
  });

  it("cannot steal Walk cancel, Attack Nearest dest, or kit Digit as this leftover", () => {
    assert.equal(
      decideSummonControlAttackToggle(uniqueFire).reason,
      "summon_controlled",
    );
    assert.equal(
      summonControlAttackHidesWalkRing({
        isSummonControlled: true,
        battleActionMode: "walk",
      }),
      false,
    );
    const wx = wxSource();
    assert.ok(wx.includes("attackNearestLiveCasterPos"));
    assert.ok(wx.includes("onSetWalk={() => {"));
    assert.equal(wx.includes("decideSummonControlWalkCancel"), false);
    assert.equal(wx.includes("setSelectedSummonSpellId"), true);
  });
});
