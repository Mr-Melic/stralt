/**
 * Combat action parity: Enthroned Void AP_DRAIN_PASSIVE must stamp
 * last-turn damage-spell AP. Live `apDrainLastTurn` stays 0 forever.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { physicalAttackSpell, starterSpells } from "../data/spellData.ts";
import {
  advertisedApDrainPassiveFromLastTurn,
  apCostTowardApDrainLastTurn,
  canExecuteApDrainLastTurnTrack,
  executeApDrainLastTurnTrack,
  isApDrainLastTurnDamageSpell,
  liveFreshBossStateApDrainLastTurn,
  liveWxWritesApDrainLastTurn,
  shouldStampApDrainLastTurn,
  sumApDrainLastTurnDamageSpellAp,
} from "./bossApDrainLastTurnTrack.ts";

function here(): string {
  return dirname(fileURLToPath(import.meta.url));
}

function mustSpell(id: string) {
  const spell = starterSpells.find((s) => s.id === id);
  assert.ok(spell, id);
  return spell;
}

function wxSource(): string {
  return readFileSync(
    join(here(), "../components/WorldExploration.tsx"),
    "utf8",
  );
}

function bossSystemSource(): string {
  return readFileSync(join(here(), "../hooks/useBossSystem.ts"), "utf8");
}

function bossAiSource(): string {
  return readFileSync(join(here(), "../hooks/useBossAI.ts"), "utf8");
}

function bossTypesSource(): string {
  return readFileSync(join(here(), "../types/bossTypes.ts"), "utf8");
}

function bossKitsSource(): string {
  return readFileSync(join(here(), "../data/bossKits.ts"), "utf8");
}

function applyApDrainPassiveBlock(): string {
  const src = bossSystemSource();
  const start = src.indexOf("function applyApDrainPassive(");
  assert.ok(start >= 0, "live applyApDrainPassive is present");
  const end = src.indexOf("function applyDamageImmune(", start);
  assert.ok(end > start, "DAMAGE_IMMUNE still follows AP_DRAIN_PASSIVE");
  return src.slice(start, end);
}

function decideEnthronedVoidBlock(): string {
  const src = bossAiSource();
  const start = src.indexOf(
    "export const decideEnthronedVoidAction: BossDecisionFn",
  );
  assert.ok(start >= 0, "live decideEnthronedVoidAction is present");
  const end = src.indexOf("const DECISION_MAP:", start);
  assert.ok(end > start, "DECISION_MAP still follows Enthroned Void decide");
  return src.slice(start, end);
}

describe("Enthroned Void AP_DRAIN_PASSIVE last-turn damage-spell AP stamp", () => {
  const frost = mustSpell("starter-frost");
  const poison = mustSpell("starter-poison");
  const inferno = mustSpell("spell-inferno");
  const blast = mustSpell("starter-blast");
  const drain = mustSpell("starter-drain");
  const mend = mustSpell("starter-heal");
  const slow = mustSpell("spell-slow");
  const swap = mustSpell("spell-swap");
  const shield = mustSpell("starter-shield");

  const ready = {
    bossId: "enthroned_void",
    playerTurnEnded: true,
    spellsCastThisTurn: [frost],
  };

  it("treats catalog Frost / Inferno / Poison / Drain as last-turn damage-spell AP", () => {
    assert.equal(frost.spellType, "damage");
    assert.equal(Number(frost.damage), 20);
    assert.equal(Number(frost.apCost), 3);
    assert.equal(isApDrainLastTurnDamageSpell(frost), true);
    assert.equal(apCostTowardApDrainLastTurn(frost), 3);

    assert.equal(inferno.spellType, "damage");
    assert.equal(inferno.isDotSpell, true);
    assert.equal(Number(inferno.damage), 0);
    assert.equal(Number(inferno.apCost), 5);
    assert.equal(isApDrainLastTurnDamageSpell(inferno), true);
    assert.equal(apCostTowardApDrainLastTurn(inferno), 5);

    assert.equal(poison.isDotSpell, true);
    assert.equal(Number(poison.apCost), 2);
    assert.equal(isApDrainLastTurnDamageSpell(poison), true);

    assert.equal(drain.spellType, "drain");
    assert.equal(Number(drain.damage), 10);
    assert.equal(isApDrainLastTurnDamageSpell(drain), true);

    assert.equal(Number(blast.apCost), 4);
    assert.equal(isApDrainLastTurnDamageSpell(blast), true);
  });

  it("keys off damage / DoT / AP metadata, not the display name", () => {
    assert.equal(
      isApDrainLastTurnDamageSpell({
        spellType: "damage",
        effectType: "damage",
        damage: 20,
        apCost: 3,
      }),
      true,
    );
    assert.equal(
      isApDrainLastTurnDamageSpell({
        spellType: "damage",
        effectType: "dot",
        isDotSpell: true,
        damage: 0,
        dotDamagePerTurn: 8,
        dotDuration: 3,
        apCost: 5,
      }),
      true,
    );
    assert.equal(
      isApDrainLastTurnDamageSpell({
        spellType: "damage",
        effectType: "damage",
        damage: 10,
        apCost: 2,
        isPhysical: true,
      }),
      false,
      "Strike is isPhysical — drain consequence, not the spend input",
    );
    assert.equal(isApDrainLastTurnDamageSpell({}), false);
    assert.equal(isApDrainLastTurnDamageSpell(physicalAttackSpell), false);
    assert.equal(isApDrainLastTurnDamageSpell(mend), false);
    assert.equal(isApDrainLastTurnDamageSpell(slow), false);
    assert.equal(isApDrainLastTurnDamageSpell(swap), false);
    assert.equal(isApDrainLastTurnDamageSpell(shield), false);
  });

  it("mirrors applyApDrainPassive thresholds: 0 / 1 / 2", () => {
    assert.equal(advertisedApDrainPassiveFromLastTurn(0), 0);
    assert.equal(advertisedApDrainPassiveFromLastTurn(2), 0);
    assert.equal(advertisedApDrainPassiveFromLastTurn(3), 1);
    assert.equal(advertisedApDrainPassiveFromLastTurn(4), 1);
    assert.equal(advertisedApDrainPassiveFromLastTurn(5), 2);
    assert.equal(advertisedApDrainPassiveFromLastTurn(9), 2);
    assert.equal(advertisedApDrainPassiveFromLastTurn(undefined), 0);
    assert.equal(advertisedApDrainPassiveFromLastTurn(Number.NaN), 0);
    assert.equal(advertisedApDrainPassiveFromLastTurn(-4), 0);

    const passive = applyApDrainPassiveBlock();
    assert.ok(passive.includes("apDrainLastTurn"));
    assert.ok(passive.includes("lastTurnDmgAP >= 5"));
    assert.ok(passive.includes("apDrain = 2"));
    assert.ok(passive.includes("lastTurnDmgAP >= 3"));
    assert.ok(passive.includes("apDrain = 1"));
    assert.ok(passive.includes("playerApModifier: -apDrain"));
    assert.equal(passive.includes("apDrainLastTurn:"), false);
    assert.equal(passive.includes("apDrainLastTurn ="), false);
  });

  it("stamps Frost 3 as drain 1 and Inferno 5 as drain 2; live stays 0", () => {
    assert.equal(
      shouldStampApDrainLastTurn({ bossId: "enthroned_void" }),
      true,
    );
    assert.equal(canExecuteApDrainLastTurnTrack(ready), true);
    assert.deepEqual(executeApDrainLastTurnTrack(ready), {
      apDrainLastTurn: 3,
      advertisedDrain: 1,
    });
    assert.deepEqual(
      executeApDrainLastTurnTrack({
        ...ready,
        spellsCastThisTurn: [inferno],
      }),
      { apDrainLastTurn: 5, advertisedDrain: 2 },
    );
    assert.deepEqual(
      executeApDrainLastTurnTrack({
        ...ready,
        spellsCastThisTurn: [poison, poison],
      }),
      { apDrainLastTurn: 4, advertisedDrain: 1 },
    );
    assert.equal(liveWxWritesApDrainLastTurn(), false);
    assert.equal(liveFreshBossStateApDrainLastTurn(), 0);
    const types = bossTypesSource();
    assert.ok(types.includes("apDrainLastTurn?: number"));
    assert.ok(types.includes("apDrainLastTurn: 0"));
    assert.equal((types.match(/apDrainLastTurn\s*=/g) ?? []).length, 0);
  });

  it("live WX never writes apDrainLastTurn; playerApModifier writer is a different arm", () => {
    const wx = wxSource();
    assert.equal(wx.includes("apDrainLastTurn"), false);
    assert.equal(wx.includes("executeApDrainLastTurnTrack"), false);

    const apMod = wx.indexOf(
      "if (res?.playerApModifier && res.playerApModifier !== 0)",
    );
    assert.ok(apMod >= 0, "live playerApModifier HUD write is present");
    const apModBlock = wx.slice(apMod, apMod + 280);
    assert.ok(apModBlock.includes("setCurrentBattleApSynced"));
    assert.equal(apModBlock.includes("apDrainLastTurn"), false);

    const decide = decideEnthronedVoidBlock();
    assert.ok(decide.includes("pickBossKitSpell"));
    assert.ok(decide.includes("new Map<string, number>()"));
    assert.ok(decide.includes("BossAbility.AP_DRAIN_PASSIVE"));
    assert.equal(decide.includes("apDrainLastTurn"), false);
    const kits = bossKitsSource();
    const voidKit = kits.indexOf('bossId: "enthroned_void"');
    assert.ok(voidKit >= 0, "Enthroned Void kit is present");
    const phase2 = kits.indexOf("phase2SpellIds:", voidKit);
    assert.ok(phase2 > voidKit, "phase-2 pool follows the Void kit");
    const firstId = kits.slice(phase2).match(/"([^"]+)"/);
    assert.equal(
      firstId?.[1],
      "spell-swap",
      "kit-first phase-2 id is Swap — decide leftover is #1164",
    );
  });

  it("cannot stamp other bosses, a turn that has not ended, or utility spend", () => {
    assert.equal(
      executeApDrainLastTurnTrack({
        ...ready,
        bossId: "eternal_pawn_king",
      }),
      null,
      "Eternal Pawn AP_DRAIN always -1 is a different writer",
    );
    assert.equal(
      executeApDrainLastTurnTrack({
        ...ready,
        bossId: "chessboard_lich",
      }),
      null,
      "BOARD_CLAIM zone -2 is a different writer",
    );
    assert.equal(
      executeApDrainLastTurnTrack({
        ...ready,
        bossId: "twin_monarchs",
      }),
      null,
      "Dawn playerApModifier buffs are a different writer",
    );
    assert.equal(
      executeApDrainLastTurnTrack({
        ...ready,
        playerTurnEnded: false,
      }),
      null,
    );
    assert.deepEqual(
      executeApDrainLastTurnTrack({
        ...ready,
        spellsCastThisTurn: [mend, slow, swap, shield, physicalAttackSpell],
      }),
      { apDrainLastTurn: 0, advertisedDrain: 0 },
      "heal / Slow / Swap / Shield / Strike must not mint a drain stamp",
    );
    assert.equal(sumApDrainLastTurnDamageSpellAp([mend, slow, swap]), 0);
  });

  it("does not restore kit-first Swap decide or other leftover stamps", () => {
    const crit = executeApDrainLastTurnTrack(ready);
    assert.ok(crit);
    assert.equal(crit.apDrainLastTurn, 3);
    assert.equal(
      "ability" in crit,
      false,
      "#1164 owns AP_DRAIN_PASSIVE decide",
    );
    assert.equal("hp" in crit, false, "#1152 owns phantom spawn HP");
    assert.equal("glyphedTiles" in crit, false, "#1216 owns Glyph Trap");
    assert.equal("larvae" in crit, false, "#1217 owns larva explode");
    assert.equal(
      executeApDrainLastTurnTrack({
        ...ready,
        spellsCastThisTurn: [frost],
      })?.advertisedDrain,
      1,
    );
    assert.equal(
      advertisedApDrainPassiveFromLastTurn(liveFreshBossStateApDrainLastTurn()),
      0,
      "live fresh state still drains 0 until this stamp is wired",
    );
  });
});
