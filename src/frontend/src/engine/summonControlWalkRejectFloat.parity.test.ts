/**
 * Combat action parity: summon-control walk rejects must float the same
 * champion-walk copy. Live leftover still logBattleEntry only.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { starterSpells } from "../data/spellData.ts";
import { canAffordBattleWalk } from "./battleWalkMp.ts";
import {
  type SummonControlWalkRejectArgs,
  classifySummonControlWalkReject,
  intendedSummonControlWalkRejectFeedback,
  liveSummonControlWalkRejectFeedback,
  liveSummonControlWalkRejectIsCanvasSilent,
  shouldSpawnSummonControlWalkRejectFloat,
  spawnSummonControlWalkRejectFloat,
} from "./summonControlWalkRejectFloat.ts";
import { playerFacingWalkReject } from "./walkRejectCopy.ts";

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

function summonControlMouseWalkBlock(): string {
  const wx = wxSource();
  const start = wx.indexOf(
    "          if (selectedSummonSpellId) {\n            const liveCombatants = getLiveCombatants(combatantStoreCtx);",
  );
  assert.ok(start >= 0, "live WX mouse summon-control still gates on kit id");
  const end = wx.indexOf("          return;\n        }\n      }", start);
  assert.ok(end > start, "live WX mouse summon-control still returns early");
  return wx.slice(start, end);
}

function summonControlTouchWalkBlock(): string {
  const wx = wxSource();
  const start = wx.indexOf("  // ── SUMMON CONTROL ROUTING (touch)");
  assert.ok(start >= 0, "live WX touch still has a summon-control router");
  const end = wx.indexOf("      // ── SPRITE-FIRST HIT TESTING (touch)", start);
  assert.ok(end > start, "sprite-first touch still follows summon routing");
  return wx.slice(start, end);
}

function playerWalkRejectBlock(): string {
  const wx = wxSource();
  const start = wx.indexOf("          const walkReject = classifyWalkReject({");
  assert.ok(start >= 0, "live player battle-walk still classifies rejects");
  const end = wx.indexOf(
    "          const cost = battleWalkMpCost(path.length, costPerTile);",
    start,
  );
  assert.ok(end > start, "legal player walk still follows the reject float");
  return wx.slice(start, end);
}

describe("player-controlled summon walk reject canvas float vs log", () => {
  const wisp = mustSpell("summon-wisp");
  const mend = mustSpell("starter-heal");
  const cry = mustSpell("spell-rallying-cry");
  const bomber = mustSpell("summon-bomber");

  const summonPos = { x: 3, y: 3 };
  const destFar = { x: 8, y: 3 };
  const destThree = { x: 6, y: 3 };
  const destNeighbour = { x: 4, y: 3 };

  const uniqueFire: SummonControlWalkRejectArgs = {
    inBattle: true,
    isSummonControlled: true,
    kitSpellSelected: false,
    summonMp: 2,
    destInMpRing: false,
    pathLength: 5,
    from: summonPos,
    dest: destFar,
    costPerTile: 1,
  };

  it("treats catalog wisp MP 2 vs a far path as the unique fire, not kit AP", () => {
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
    assert.equal(canAffordBattleWalk(2, 5, 1), false);
    assert.equal(canAffordBattleWalk(2, 1, 1), true);
  });

  it("a far path outside the MP ring logs live and should float Can't reach", () => {
    const live = liveSummonControlWalkRejectFeedback(uniqueFire);
    assert.deepEqual(live, { channel: "log", text: "Can't reach" });
    assert.equal(liveSummonControlWalkRejectIsCanvasSilent(uniqueFire), true);
    assert.equal(classifySummonControlWalkReject(uniqueFire), "unreachable");
    assert.deepEqual(intendedSummonControlWalkRejectFeedback(uniqueFire), {
      channel: "float",
      text: playerFacingWalkReject("unreachable"),
    });
    assert.equal(shouldSpawnSummonControlWalkRejectFloat(uniqueFire), true);
    const calls: Array<{ x: number; y: number; text: string }> = [];
    spawnSummonControlWalkRejectFloat(
      {
        spawnFloatText: (x, y, text) => {
          calls.push({ x, y, text });
        },
      },
      { x: 40, y: 80 },
      uniqueFire,
    );
    assert.deepEqual(calls, [{ x: 40, y: 80, text: "Can't reach" }]);
  });

  it("an in-ring dest whose A* length 3 cannot pay catalog 2 MP floats Not enough MP", () => {
    const overBudget: SummonControlWalkRejectArgs = {
      ...uniqueFire,
      destInMpRing: true,
      pathLength: 3,
      dest: destThree,
    };
    assert.equal(canAffordBattleWalk(2, 3, 1), false);
    assert.deepEqual(liveSummonControlWalkRejectFeedback(overBudget), {
      channel: "log",
      text: "Not enough MP",
    });
    assert.equal(liveSummonControlWalkRejectIsCanvasSilent(overBudget), true);
    assert.equal(classifySummonControlWalkReject(overBudget), "not_enough_mp");
    assert.deepEqual(intendedSummonControlWalkRejectFeedback(overBudget), {
      channel: "float",
      text: playerFacingWalkReject("not_enough_mp"),
    });
    assert.equal(shouldSpawnSummonControlWalkRejectFloat(overBudget), true);
  });

  it("empty far path is live-silent and intended floats; neighbour execute stays quiet", () => {
    const emptyFar: SummonControlWalkRejectArgs = {
      ...uniqueFire,
      pathLength: 0,
      destInMpRing: false,
    };
    assert.deepEqual(liveSummonControlWalkRejectFeedback(emptyFar), {
      channel: "none",
    });
    assert.equal(classifySummonControlWalkReject(emptyFar), "unreachable");
    assert.equal(shouldSpawnSummonControlWalkRejectFloat(emptyFar), true);

    const emptySelf: SummonControlWalkRejectArgs = {
      ...uniqueFire,
      pathLength: 0,
      dest: summonPos,
      destInMpRing: false,
    };
    assert.deepEqual(liveSummonControlWalkRejectFeedback(emptySelf), {
      channel: "none",
    });
    assert.equal(classifySummonControlWalkReject(emptySelf), null);
    assert.equal(shouldSpawnSummonControlWalkRejectFloat(emptySelf), false);

    const legal: SummonControlWalkRejectArgs = {
      ...uniqueFire,
      destInMpRing: true,
      pathLength: 1,
      dest: destNeighbour,
    };
    assert.deepEqual(liveSummonControlWalkRejectFeedback(legal), {
      channel: "none",
    });
    assert.equal(classifySummonControlWalkReject(legal), null);
    assert.equal(shouldSpawnSummonControlWalkRejectFloat(legal), false);
    assert.equal(canAffordBattleWalk(2, 1, 1), true);
  });

  it("player turn / kit select / out of battle are not this leftover", () => {
    assert.deepEqual(
      liveSummonControlWalkRejectFeedback({
        ...uniqueFire,
        isSummonControlled: false,
      }),
      { channel: "none" },
    );
    assert.equal(
      shouldSpawnSummonControlWalkRejectFloat({
        ...uniqueFire,
        isSummonControlled: false,
      }),
      false,
    );
    assert.equal(
      shouldSpawnSummonControlWalkRejectFloat({
        ...uniqueFire,
        kitSpellSelected: true,
      }),
      false,
    );
    assert.equal(
      shouldSpawnSummonControlWalkRejectFloat({
        ...uniqueFire,
        inBattle: false,
      }),
      false,
    );
    assert.doesNotThrow(() =>
      spawnSummonControlWalkRejectFloat(null, { x: 1, y: 1 }, uniqueFire),
    );
  });

  it("live mouse/touch still log only; champion walk already floats", () => {
    const mouse = summonControlMouseWalkBlock();
    assert.ok(mouse.includes('logBattleEntry("Can\'t reach", "#ef4444")'));
    assert.ok(mouse.includes('logBattleEntry("Not enough MP", "#ef4444")'));
    assert.ok(mouse.includes("canAffordBattleWalk("));
    assert.ok(mouse.includes("summon.currentMp ?? 0"));
    assert.ok(mouse.includes("applyControlledSummonWalk"));
    assert.equal(mouse.includes("spawnFloatText"), false);
    assert.equal(mouse.includes("playerFacingWalkReject"), false);
    assert.equal(mouse.includes("spawnWalkRejectFloat"), false);
    assert.equal(mouse.includes("classifyWalkReject"), false);
    assert.equal(
      mouse.includes("intendedSummonControlWalkRejectFeedback"),
      false,
    );
    assert.equal(mouse.includes("currentBattleMp"), false);

    const touch = summonControlTouchWalkBlock();
    assert.ok(touch.includes('logBattleEntry("Can\'t reach", "#ef4444")'));
    assert.ok(touch.includes('logBattleEntry("Not enough MP", "#ef4444")'));
    assert.ok(touch.includes("applyControlledSummonWalk"));
    assert.equal(touch.includes("spawnFloatText"), false);
    assert.equal(touch.includes("playerFacingWalkReject"), false);
    assert.equal(touch.includes("spawnWalkRejectFloat"), false);
    assert.equal(
      touch.includes("intendedSummonControlWalkRejectFeedback"),
      false,
    );

    const player = playerWalkRejectBlock();
    assert.ok(player.includes("classifyWalkReject"));
    assert.ok(player.includes("playerFacingWalkReject"));
    assert.ok(player.includes("spawnFloatText"));
    assert.ok(player.includes("currentMp: currentBattleMp"));
    assert.equal(player.includes("summon.currentMp"), false);

    const wx = wxSource();
    assert.equal(wx.includes("intendedSummonControlWalkRejectFeedback"), false);
    assert.equal(wx.includes("spawnSummonControlWalkRejectFloat"), false);
    assert.equal(wx.includes("liveSummonControlWalkRejectFeedback"), false);
  });

  it("cannot steal Walk hover, Walk enable, Walk cancel, or dest-cost leftovers", () => {
    assert.equal(shouldSpawnSummonControlWalkRejectFloat(uniqueFire), true);
    const wx = wxSource();
    assert.equal(wx.includes("summonControlWalkHoverOrigin"), false);
    assert.equal(wx.includes("shouldEnableSummonControlWalkButton"), false);
    assert.equal(wx.includes("decideSummonControlWalkCancel"), false);
    assert.equal(wx.includes("battleWalkHoverMpPreview"), false);
    assert.equal(wx.includes("computeBattleWalkReachable"), false);
    assert.ok(wx.includes("attackNearestLiveCasterPos"));
    assert.ok(wx.includes("onSetWalk={() => {"));
    const panel = readSrc("../components/SummonControlPanel.tsx");
    assert.equal(panel.includes("Walk"), false);
    assert.equal(panel.includes("spawnFloatText"), false);
    assert.ok(panel.includes("disabled={currentAp < spell.apCost}"));
  });
});
