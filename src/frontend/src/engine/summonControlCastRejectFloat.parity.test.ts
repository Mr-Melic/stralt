/**
 * Combat action parity: summon-control kit-cast rejects must float the
 * same copy the battle log already prints. Live leftover still
 * logBattleEntry only. Distinct from walk-reject `#1330`.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { starterSpells } from "../data/spellData.ts";
import {
  chebyshevDistance,
  planSummonControlCast,
  summonControlCastFailMessage,
} from "../utils/summonControlCast.ts";
import {
  playerFacingCastResult,
  playerFacingRejectReason,
} from "./rejectCopy.ts";
import {
  type SummonControlCastRejectArgs,
  classifySummonControlCastReject,
  intendedSummonControlCastRejectFeedback,
  liveSummonControlCastRejectFeedback,
  liveSummonControlCastRejectIsCanvasSilent,
  shouldSpawnSummonControlCastRejectFloat,
  spawnSummonControlCastRejectFloat,
} from "./summonControlCastRejectFloat.ts";

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

function summonControlCastFailBlock(): string {
  const wx = wxSource();
  const start = wx.indexOf(
    "      if (!plan.ok) {\n        logBattleEntry(summonControlCastFailMessage(plan.reason)",
  );
  assert.ok(start >= 0, "live WX kit-cast still logs plan.reason");
  const end = wx.indexOf("      summonCastCommittedRef.current = true;", start);
  assert.ok(end > start, "legal kit-cast still follows the plan.ok log");
  return wx.slice(start, end);
}

function summonControlMouseKitBlock(): string {
  const wx = wxSource();
  const start = wx.indexOf("      // ── SUMMON CONTROL ROUTING ─");
  assert.ok(start >= 0, "live WX mouse still has a summon-control router");
  const end = wx.indexOf("      // ── SPRITE-FIRST HIT TESTING (mouse)", start);
  assert.ok(end > start, "sprite-first mouse still follows summon routing");
  return wx.slice(start, end);
}

function summonControlTouchKitBlock(): string {
  const wx = wxSource();
  const start = wx.indexOf("      // ── SUMMON CONTROL ROUTING (touch)");
  assert.ok(start >= 0, "live WX touch still has a summon-control router");
  const end = wx.indexOf("      // ── SPRITE-FIRST HIT TESTING (touch)", start);
  assert.ok(end > start, "sprite-first touch still follows summon routing");
  return wx.slice(start, end);
}

function playerSpriteRejectBlock(): string {
  const wx = wxSource();
  const start = wx.indexOf(
    '            if (_spriteDecision.action === "reject_live") {',
  );
  assert.ok(start >= 0, "live player sprite-first still floats reject_live");
  const end = wx.indexOf(
    '            if (_spriteDecision.action === "inspect") {',
    start,
  );
  assert.ok(end > start, "inspect still follows reject_live");
  return wx.slice(start, end);
}

describe("player-controlled summon kit-cast reject canvas float vs log", () => {
  const archer = mustSpell("summon-archer");
  const poison = mustSpell("starter-poison");
  const slow = mustSpell("spell-slow");
  const wisp = mustSpell("summon-wisp");

  const caster = { x: 8, y: 8 };
  const destFar = { x: 13, y: 8 };
  const destInRange = { x: 10, y: 8 };

  const uniqueFire: SummonControlCastRejectArgs = {
    inBattle: true,
    isSummonControlled: true,
    kitSpellSelected: true,
    hasResolvedTarget: true,
    failReason: "out_of_range",
  };

  it("treats catalog archer Poison Arrow Chebyshev 5 as the unique fire, not walk MP", () => {
    assert.equal(archer.summonUnitDef?.ap, 2);
    assert.equal(archer.summonUnitDef?.mp, 3);
    assert.deepEqual(archer.summonUnitDef?.summonKit, [
      "starter-poison",
      "spell-slow",
    ]);
    assert.equal(Number(poison.apCost), 2);
    assert.equal(Number(poison.range), 4);
    assert.equal(Number(slow.apCost), 2);
    assert.equal(Number(slow.range), 3);
    assert.equal(chebyshevDistance(caster, destFar), 5);
    assert.equal(chebyshevDistance(caster, destInRange), 2);
    const tooFar = planSummonControlCast({
      pieceType: "archer",
      spellId: "starter-poison",
      catalog: starterSpells,
      fallbackSpells: [],
      currentAp: 2,
      caster,
      target: destFar,
    });
    assert.deepEqual(tooFar, { ok: false, reason: "out_of_range" });
    assert.equal(wisp.summonUnitDef?.mp, 2);
    assert.equal(
      archer.summonUnitDef?.summonKit?.includes("spell-inferno"),
      false,
    );
  });

  it("a hostile beyond Poison range 4 logs live and should float Out of range", () => {
    const live = liveSummonControlCastRejectFeedback(uniqueFire);
    assert.deepEqual(live, { channel: "log", text: "Out of range" });
    assert.equal(liveSummonControlCastRejectIsCanvasSilent(uniqueFire), true);
    assert.equal(classifySummonControlCastReject(uniqueFire), "out_of_range");
    assert.deepEqual(intendedSummonControlCastRejectFeedback(uniqueFire), {
      channel: "float",
      text: summonControlCastFailMessage("out_of_range"),
    });
    assert.equal(
      summonControlCastFailMessage("out_of_range"),
      playerFacingRejectReason("out_of_range"),
    );
    assert.equal(shouldSpawnSummonControlCastRejectFloat(uniqueFire), true);
    const calls: Array<{ x: number; y: number; text: string }> = [];
    spawnSummonControlCastRejectFloat(
      {
        spawnFloatText: (x, y, text) => {
          calls.push({ x, y, text });
        },
      },
      { x: 40, y: 80 },
      uniqueFire,
    );
    assert.deepEqual(calls, [{ x: 40, y: 80, text: "Out of range" }]);
  });

  it("an in-range dest that cannot pay catalog 2 AP floats Not enough AP", () => {
    const shortAp: SummonControlCastRejectArgs = {
      ...uniqueFire,
      failReason: "no_ap",
    };
    const planned = planSummonControlCast({
      pieceType: "archer",
      spellId: "starter-poison",
      catalog: starterSpells,
      fallbackSpells: [],
      currentAp: 1,
      caster,
      target: destInRange,
    });
    assert.deepEqual(planned, { ok: false, reason: "no_ap" });
    assert.deepEqual(liveSummonControlCastRejectFeedback(shortAp), {
      channel: "log",
      text: "Not enough AP",
    });
    assert.equal(liveSummonControlCastRejectIsCanvasSilent(shortAp), true);
    assert.equal(classifySummonControlCastReject(shortAp), "no_ap");
    assert.deepEqual(intendedSummonControlCastRejectFeedback(shortAp), {
      channel: "float",
      text: summonControlCastFailMessage("no_ap"),
    });
    assert.equal(
      summonControlCastFailMessage("no_ap"),
      playerFacingCastResult("no_ap"),
    );
    assert.equal(shouldSpawnSummonControlCastRejectFloat(shortAp), true);
  });

  it("empty dest miss stays live-silent; legal in-range execute stays quiet", () => {
    const miss: SummonControlCastRejectArgs = {
      ...uniqueFire,
      hasResolvedTarget: false,
      failReason: null,
    };
    assert.deepEqual(liveSummonControlCastRejectFeedback(miss), {
      channel: "none",
    });
    assert.equal(classifySummonControlCastReject(miss), null);
    assert.equal(shouldSpawnSummonControlCastRejectFloat(miss), false);

    const legal: SummonControlCastRejectArgs = {
      ...uniqueFire,
      failReason: null,
    };
    const planned = planSummonControlCast({
      pieceType: "archer",
      spellId: "starter-poison",
      catalog: starterSpells,
      fallbackSpells: [],
      currentAp: 2,
      caster,
      target: destInRange,
    });
    assert.equal(planned.ok, true);
    assert.deepEqual(liveSummonControlCastRejectFeedback(legal), {
      channel: "none",
    });
    assert.equal(classifySummonControlCastReject(legal), null);
    assert.equal(shouldSpawnSummonControlCastRejectFloat(legal), false);
  });

  it("player turn / walk dest / out of battle are not this leftover", () => {
    assert.deepEqual(
      liveSummonControlCastRejectFeedback({
        ...uniqueFire,
        isSummonControlled: false,
      }),
      { channel: "none" },
    );
    assert.equal(
      shouldSpawnSummonControlCastRejectFloat({
        ...uniqueFire,
        isSummonControlled: false,
      }),
      false,
    );
    assert.equal(
      shouldSpawnSummonControlCastRejectFloat({
        ...uniqueFire,
        kitSpellSelected: false,
      }),
      false,
    );
    assert.equal(
      shouldSpawnSummonControlCastRejectFloat({
        ...uniqueFire,
        inBattle: false,
      }),
      false,
    );
    assert.doesNotThrow(() =>
      spawnSummonControlCastRejectFloat(null, { x: 1, y: 1 }, uniqueFire),
    );
  });

  it("live kit-cast still logs only; champion sprite-first already floats", () => {
    const fail = summonControlCastFailBlock();
    assert.ok(
      fail.includes(
        'logBattleEntry(summonControlCastFailMessage(plan.reason), "#ef4444")',
      ),
    );
    assert.equal(fail.includes("spawnFloatText"), false);
    assert.equal(fail.includes("playerFacingRejectReason"), false);
    assert.equal(fail.includes("playerFacingCastResult"), false);
    assert.equal(
      fail.includes("intendedSummonControlCastRejectFeedback"),
      false,
    );

    const mouse = summonControlMouseKitBlock();
    assert.ok(mouse.includes("if (selectedSummonSpellId)"));
    assert.ok(mouse.includes("castControlledSummonSpell("));
    assert.ok(mouse.includes("pickSummonControlClickTarget("));
    assert.equal(mouse.includes("spawnFloatText"), false);
    assert.equal(mouse.includes("playerFacingRejectReason"), false);
    assert.equal(mouse.includes("spawnSummonControlCastRejectFloat"), false);

    const touch = summonControlTouchKitBlock();
    assert.ok(touch.includes("if (selectedSummonSpellId)"));
    assert.ok(touch.includes("castControlledSummonSpell("));
    assert.equal(touch.includes("spawnFloatText"), false);
    assert.equal(touch.includes("playerFacingRejectReason"), false);
    assert.equal(touch.includes("spawnSummonControlCastRejectFloat"), false);

    const player = playerSpriteRejectBlock();
    assert.ok(player.includes("spawnFloatText"));
    assert.ok(player.includes("playerFacingRejectReason(_live.reason)"));
    assert.equal(player.includes("summonControlCastFailMessage"), false);
    assert.equal(player.includes("castControlledSummonSpell"), false);

    const wx = wxSource();
    assert.equal(wx.includes("intendedSummonControlCastRejectFeedback"), false);
    assert.equal(wx.includes("spawnSummonControlCastRejectFloat"), false);
    assert.equal(wx.includes("liveSummonControlCastRejectFeedback"), false);
  });

  it("cannot steal walk-reject, hover-ring, dest-occupancy, or Inferno leftovers", () => {
    assert.equal(shouldSpawnSummonControlCastRejectFloat(uniqueFire), true);
    const wx = wxSource();
    assert.equal(wx.includes("spawnSummonControlWalkRejectFloat"), false);
    assert.equal(wx.includes("intendedSummonControlWalkRejectFeedback"), false);
    assert.equal(wx.includes("summonControlWalkHoverOrigin"), false);
    assert.equal(wx.includes("summonControlWalkHoverRingShowsLabel"), false);
    assert.equal(wx.includes("shouldEnableSummonControlWalkButton"), false);
    assert.equal(wx.includes("decideSummonControlWalkCancel"), false);
    assert.ok(wx.includes('logBattleEntry("Can\'t reach", "#ef4444")'));
    assert.ok(wx.includes("attackNearestLiveCasterPos"));
    const panel = readSrc("../components/SummonControlPanel.tsx");
    assert.equal(panel.includes("spawnFloatText"), false);
    assert.ok(panel.includes("disabled={currentAp < spell.apCost}"));
    assert.equal(panel.includes("Walk"), false);
    assert.equal(
      uniqueFire.failReason === "out_of_range" &&
        archer.summonUnitDef?.summonKit?.includes("spell-inferno"),
      false,
    );
  });
});
