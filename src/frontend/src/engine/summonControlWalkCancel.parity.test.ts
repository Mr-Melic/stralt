/**
 * Combat action parity: a highlighted legal summon-control Walk dest is
 * executable after Walk cancels the kit, and an illegal dest cannot
 * execute. Live onSetWalk still only clears selectedSpellIdRef.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { physicalAttackSpell, starterSpells } from "../data/spellData.ts";
import type { Enemy, SpellConfig } from "../types/gameTypes.ts";
import { planSummonControlCast } from "../utils/summonControlCast.ts";
import { canAffordBattleWalk } from "./battleWalkMp.ts";
import {
  canExecuteSummonControlWalkDest,
  decideSummonControlWalkCancel,
  executeSummonControlWalkDest,
  nextSummonSpellIdAfterWalk,
  shouldHighlightSummonControlWalkDest,
  summonControlWalkClickUsesKitCast,
  summonControlWalkHighlightedIsExecutable,
} from "./summonControlWalkCancel.ts";
import { computeTargetableTiles } from "./targeting.ts";

function mustSpell(id: string): SpellConfig {
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

function walkPaintBlock(): string {
  const wx = wxSource();
  const start = wx.indexOf("const mpTiles =");
  assert.ok(start >= 0, "live RAF still paints MP tiles");
  const end = wx.indexOf("const spellTiles =", start);
  assert.ok(end > start, "spellTiles still follows mpTiles");
  return wx.slice(start, end);
}

function floorGrid(size: number): Array<Array<"floor">> {
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

describe("player-controlled summon kit Walk cancel vs execute dest", () => {
  const mend = mustSpell("starter-heal");
  const cry = mustSpell("spell-rallying-cry");
  const inferno = mustSpell("spell-inferno");
  const poison = mustSpell("starter-poison");
  const venom = mustSpell("spell-venom-strike");
  const frost = mustSpell("starter-frost");
  const slow = mustSpell("spell-slow");
  const wisp = mustSpell("summon-wisp");
  const bomber = mustSpell("summon-bomber");
  const tiles = floorGrid(12);
  const summon = unit("wisp", 5, 5, {
    side: "player",
    isSummon: true,
    pieceType: "wisp",
  });

  const readyWalk = {
    inBattle: true,
    isSummonControlled: true,
    selectedSummonSpellId: "starter-heal",
    destInMpRing: true,
    currentMp: 2,
    pathLength: 1,
  };

  it("treats catalog Blood Mend as a selected wisp kit id, not champion Inferno", () => {
    assert.equal(mend.id, "starter-heal");
    assert.equal(mend.spellType, "heal");
    assert.equal(mend.targetType, "self");
    assert.equal(Number(mend.range), 0);
    assert.equal(Number(mend.apCost), 3);
    assert.equal(Number(cry.apCost), 4);
    assert.deepEqual(wisp.summonUnitDef?.summonKit, [
      "starter-heal",
      "spell-rallying-cry",
    ]);
    assert.equal(wisp.summonUnitDef?.ap, 2);
    assert.equal(wisp.summonUnitDef?.mp, 2);
    assert.equal(
      wisp.summonUnitDef?.summonKit?.includes("spell-inferno"),
      false,
    );
    assert.deepEqual(bomber.summonUnitDef?.summonKit, ["spell-inferno"]);
  });

  it("Walk cancels kit select so a highlighted empty neighbour executes", () => {
    const decision = decideSummonControlWalkCancel({
      inBattle: true,
      isSummonControlled: true,
      selectedSummonSpellId: "starter-heal",
    });
    assert.deepEqual(decision, {
      action: "cancel-kit",
      previousSpellId: "starter-heal",
    });
    assert.equal(nextSummonSpellIdAfterWalk(decision, "starter-heal"), null);
    assert.equal(summonControlWalkClickUsesKitCast("starter-heal"), true);
    assert.equal(
      summonControlWalkClickUsesKitCast(
        nextSummonSpellIdAfterWalk(decision, "starter-heal"),
      ),
      false,
      "after Walk cancel the next canvas click walks",
    );

    const highlighted = shouldHighlightSummonControlWalkDest(readyWalk);
    assert.equal(highlighted, true);
    assert.equal(
      canExecuteSummonControlWalkDest(readyWalk),
      false,
      "kit still armed — empty neighbour is not Blood Mend dest",
    );
    assert.equal(
      planSummonControlCast({
        pieceType: "wisp",
        spellId: "starter-heal",
        catalog: starterSpells,
        currentAp: 3,
        caster: summon,
        target: { x: 5, y: 4 },
        liveGate: { tiles, combatants: [summon] },
      }).ok,
      false,
      "Blood Mend is self — empty neighbour cannot execute as kit",
    );
    const kitTiles = computeTargetableTiles(mend, summon, {
      tiles,
      enemies: [summon],
      worldGridSize: 12,
      effectiveRange: 1,
    });
    assert.equal(kitTiles.has("5,5"), true);
    assert.equal(kitTiles.has("5,4"), false);

    const after = executeSummonControlWalkDest(readyWalk);
    assert.deepEqual(after, { dest: "walk" });
    assert.equal(
      summonControlWalkHighlightedIsExecutable({
        highlighted,
        executable: after != null,
      }),
      true,
    );
    assert.equal(canAffordBattleWalk(2, 1, 1), true);
  });

  it("Rallying Cry Walk cancel also returns to walk; empty kit stays walk", () => {
    const cryCancel = decideSummonControlWalkCancel({
      inBattle: true,
      isSummonControlled: true,
      selectedSummonSpellId: "spell-rallying-cry",
    });
    assert.deepEqual(cryCancel, {
      action: "cancel-kit",
      previousSpellId: "spell-rallying-cry",
    });
    assert.equal(
      nextSummonSpellIdAfterWalk(cryCancel, "spell-rallying-cry"),
      null,
    );
    assert.deepEqual(
      executeSummonControlWalkDest({
        ...readyWalk,
        selectedSummonSpellId: "spell-rallying-cry",
      }),
      { dest: "walk" },
    );
    assert.equal(
      decideSummonControlWalkCancel({
        inBattle: true,
        isSummonControlled: true,
        selectedSummonSpellId: null,
      }).reason,
      "no_kit",
    );
    assert.equal(
      canExecuteSummonControlWalkDest({
        ...readyWalk,
        selectedSummonSpellId: null,
      }),
      true,
      "already-walk kit id is executable without a cancel",
    );
  });

  it("cannot cancel on player turn, out of battle, or empty id", () => {
    assert.equal(
      decideSummonControlWalkCancel({
        inBattle: true,
        isSummonControlled: false,
        selectedSummonSpellId: "starter-heal",
      }).reason,
      "player_turn",
    );
    assert.equal(
      executeSummonControlWalkDest({
        ...readyWalk,
        isSummonControlled: false,
      }),
      null,
      "player Walk is the champion selectedSpellIdRef clear, not this leftover",
    );
    assert.equal(
      decideSummonControlWalkCancel({
        inBattle: false,
        isSummonControlled: true,
        selectedSummonSpellId: "starter-heal",
      }).reason,
      "out_of_battle",
    );
    assert.equal(
      decideSummonControlWalkCancel({
        inBattle: true,
        isSummonControlled: true,
        selectedSummonSpellId: "",
      }).reason,
      "no_kit",
    );
    assert.equal(
      nextSummonSpellIdAfterWalk(
        { action: "none", reason: "player_turn" },
        "starter-heal",
      ),
      "starter-heal",
    );
  });

  it("cannot execute 0 MP, dest outside the ring, or Chebyshev 3 on 2 MP", () => {
    assert.equal(
      shouldHighlightSummonControlWalkDest({
        ...readyWalk,
        currentMp: 0,
      }),
      false,
    );
    assert.equal(
      canExecuteSummonControlWalkDest({
        ...readyWalk,
        selectedSummonSpellId: null,
        currentMp: 0,
      }),
      false,
    );
    assert.equal(
      executeSummonControlWalkDest({
        ...readyWalk,
        currentMp: 0,
      }),
      null,
    );
    assert.equal(
      shouldHighlightSummonControlWalkDest({
        ...readyWalk,
        destInMpRing: false,
      }),
      false,
    );
    assert.equal(
      canExecuteSummonControlWalkDest({
        ...readyWalk,
        selectedSummonSpellId: null,
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
      executeSummonControlWalkDest({
        ...readyWalk,
        pathLength: 3,
      }),
      null,
    );
  });

  it("live Walk only clears selectedSpellIdRef; kit id still intercepts clicks", () => {
    const walk = onSetWalkBlock();
    assert.ok(walk.includes('setBattleActionMode("walk")'));
    assert.ok(walk.includes("selectedSpellIdRef.current = null"));
    assert.equal(walk.includes("setSelectedSummonSpellId"), false);
    assert.equal(walk.includes("selectedSummonSpellId"), false);
    assert.equal(walk.includes("decideSummonControlWalkCancel"), false);
    assert.equal(walk.includes("isSummonControlled"), false);

    const mouse = summonControlMouseBlock();
    assert.ok(mouse.includes("if (selectedSummonSpellId) {"));
    assert.ok(mouse.includes("castControlledSummonSpell"));
    assert.ok(mouse.includes("applyControlledSummonWalk"));
    assert.equal(mouse.includes("decideSummonControlWalkCancel"), false);

    const paint = walkPaintBlock();
    assert.ok(paint.includes('battleActionModeRef.current === "walk"'));
    assert.ok(paint.includes("getMpReachableTiles()"));
    assert.equal(paint.includes("selectedSummonSpellId"), false);

    const wx = wxSource();
    assert.equal(wx.includes("decideSummonControlWalkCancel"), false);
    assert.equal(wx.includes("nextSummonSpellIdAfterWalk"), false);
    assert.ok(wx.includes("isAttackNearestHotkey"));

    const battle = readSrc("../components/BattleUIPanel.tsx");
    assert.ok(battle.includes('data-ocid="battle_ui.walk_button"'));
    assert.ok(battle.includes("onClick={onSetWalk}"));
    assert.equal(battle.includes("setSelectedSummonSpellId"), false);
    assert.equal(battle.includes("decideSummonControlWalkCancel"), false);
    const walkBtn = battle.slice(
      battle.indexOf('data-ocid="battle_ui.walk_button"'),
      battle.indexOf('data-ocid="battle_ui.attack_button"'),
    );
    assert.equal(walkBtn.includes("isSummonControlled"), false);
  });

  it("live kit panel has no Walk analog; Escape / Digit / S stay other leftovers", () => {
    const panel = readSrc("../components/SummonControlPanel.tsx");
    assert.equal(panel.includes("Walk"), false);
    assert.equal(panel.includes("onSetWalk"), false);
    assert.equal(panel.includes("selectedSpellId"), false);
    assert.ok(panel.includes("disabled={currentAp < spell.apCost}"));
    assert.ok(panel.includes("onSelect={onSpellSelect}"));
    assert.equal(panel.includes("addEventListener"), false);
    assert.equal(panel.includes("Escape"), false);

    const wx = wxSource();
    const keydownNeedle = "if (!isAttackNearestHotkey(e)) return;";
    const keyStart = wx.indexOf(keydownNeedle);
    assert.ok(keyStart >= 0);
    const keyEnd = wx.indexOf("}, [attackNearestEnemy]);", keyStart);
    const keydown = wx.slice(keyStart, keyEnd);
    assert.ok(keydown.includes("attackNearestEnemy"));
    assert.equal(keydown.includes("Escape"), false);
    assert.equal(keydown.includes("onSetWalk"), false);
    assert.equal(keydown.includes("decideSummonControlWalkCancel"), false);
    assert.equal(keydown.includes("decideSummonControlHotkeyCancel"), false);
    assert.equal(keydown.includes("decideSummonControlKitHotkey"), false);
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
      decideSummonControlWalkCancel({
        inBattle: true,
        isSummonControlled: true,
        selectedSummonSpellId: "spell-inferno",
      }).action,
      "cancel-kit",
      "a selected kit id still cancels; champion Inferno select is #1267",
    );
    assert.equal(
      executeSummonControlWalkDest({
        ...readyWalk,
        selectedSummonSpellId: "spell-inferno",
        currentMp: 4,
      })?.dest,
      "walk",
    );
    assert.equal(
      summonControlWalkHighlightedIsExecutable({
        highlighted: false,
        executable: false,
      }),
      false,
    );
    assert.equal(
      executeSummonControlWalkDest({
        ...readyWalk,
        destInMpRing: false,
      }),
      null,
      "kit dest leftovers stay #1205 / #1238 / #1260 / #1263",
    );
  });
});
