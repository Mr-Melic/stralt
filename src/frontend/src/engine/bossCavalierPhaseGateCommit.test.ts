/**
 * Combat action parity: Bone Cavalier phase 2 never arms at the
 * advertised 50% card because checkPhaseTransition reads
 * phase2.hpThreshold 0.0, so the ×1.6 HP commit never runs.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { starterSpells } from "../data/spellData.ts";
import { hpAfterBossPhase2, shouldAwardVictory } from "./battleSetup.ts";
import {
  BONE_CAVALIER_PHASE_GATE_BOSS_ID,
  CAVALIER_PHASE_GATE_ABILITY,
  CAVALIER_PHASE_GATE_ADVERTISED_THRESHOLD,
  CAVALIER_PHASE_GATE_GUIDE_NEEDLE,
  CAVALIER_PHASE_GATE_HP,
  CAVALIER_PHASE_GATE_HP_AFTER,
  CAVALIER_PHASE_GATE_HP_AT_GUIDE,
  CAVALIER_PHASE_GATE_JUMP_LEFTOVER,
  CAVALIER_PHASE_GATE_KIT_FIRST,
  CAVALIER_PHASE_GATE_KIT_PHASE2,
  CAVALIER_PHASE_GATE_LIVE_THRESHOLD,
  CAVALIER_PHASE_GATE_LORE_NEEDLE,
  CAVALIER_PHASE_GATE_MAX_HP_AFTER,
  CAVALIER_PHASE_GATE_STAT_MULT,
  advertisedCavalierPhaseThreshold,
  advertisedCavalierPhaseTransitioned,
  canExecuteCavalierPhaseGateHp,
  cavalierHpFraction,
  executeCavalierPhaseGateHp,
  liveWxCavalierPhaseThreshold,
  liveWxCavalierPhaseTransitioned,
  liveWxCavalierReadsPhase2Threshold,
  resolveBoneCavalierPhaseGate,
  shouldCommitCavalierPhaseGateHp,
  wxAppliesCavalierPhaseHpOnceTransitioned,
} from "./bossCavalierPhaseGateCommit.ts";

const strike = starterSpells.find((s) => s.id === "physical_attack");
assert.ok(strike, "physical_attack");
const haste = starterSpells.find((s) => s.id === "spell-haste");
assert.ok(haste, "spell-haste");
const enrage = starterSpells.find((s) => s.id === "spell-enrage");
assert.ok(enrage, "spell-enrage");

const STRIKE_DAMAGE = Number(strike.damage);

function here(): string {
  return dirname(fileURLToPath(import.meta.url));
}

function gateReady(overrides?: {
  hp?: number;
  alreadyPhase2?: boolean;
  bossId?: string;
}) {
  return {
    bossId: overrides?.bossId ?? BONE_CAVALIER_PHASE_GATE_BOSS_ID,
    hp: overrides?.hp ?? CAVALIER_PHASE_GATE_HP_AT_GUIDE,
    maxHp: CAVALIER_PHASE_GATE_HP,
    alreadyPhase2: overrides?.alreadyPhase2 ?? false,
  };
}

describe("Bone Cavalier advertised 50% phase gate vs live 0.0", () => {
  it("catalog 0.5 / 320 HP / ×1.6 stay distinct from live phase2 0.0 and kit Strike", () => {
    const defaults = readFileSync(
      join(here(), "../types/bossDefaults.ts"),
      "utf8",
    );
    const cavalier = defaults.slice(
      defaults.indexOf('id: "bone_cavalier"'),
      defaults.indexOf('id: "weeping_pawn"'),
    );
    assert.ok(cavalier.includes(`id: "${BONE_CAVALIER_PHASE_GATE_BOSS_ID}"`));
    assert.ok(cavalier.includes("hp: 320"));
    assert.ok(cavalier.includes("hpThreshold: 0.5"));
    assert.ok(cavalier.includes("hpThreshold: 0.0"));
    assert.ok(cavalier.includes("statMultiplier: 1.6"));
    assert.ok(cavalier.includes("BossAbility.SPIKE_ON_LAND"));
    assert.ok(cavalier.includes("BossAbility.KNIGHT_JUMP_IGNORE_WALLS"));
    assert.ok(cavalier.includes(CAVALIER_PHASE_GATE_LORE_NEEDLE));
    assert.equal(CAVALIER_PHASE_GATE_HP, 320);
    assert.equal(CAVALIER_PHASE_GATE_ADVERTISED_THRESHOLD, 0.5);
    assert.equal(CAVALIER_PHASE_GATE_LIVE_THRESHOLD, 0.0);
    assert.equal(CAVALIER_PHASE_GATE_HP_AT_GUIDE, 160);
    assert.equal(320 * 0.5, 160);
    assert.equal(CAVALIER_PHASE_GATE_STAT_MULT, 1.6);
    assert.equal(
      cavalierHpFraction(
        CAVALIER_PHASE_GATE_HP_AT_GUIDE,
        CAVALIER_PHASE_GATE_HP,
      ),
      0.5,
    );
    assert.equal(advertisedCavalierPhaseThreshold(), 0.5);
    assert.equal(liveWxCavalierPhaseThreshold(), 0.0);
    assert.notEqual(
      advertisedCavalierPhaseThreshold(),
      liveWxCavalierPhaseThreshold(),
    );
    assert.equal(strike.id, CAVALIER_PHASE_GATE_KIT_FIRST);
    assert.equal(enrage.id, CAVALIER_PHASE_GATE_KIT_PHASE2);
    assert.equal(STRIKE_DAMAGE, 10);
    assert.deepEqual(hpAfterBossPhase2(160, 320, 1.6, false), {
      hp: 256,
      maxHp: 512,
    });
    assert.equal(CAVALIER_PHASE_GATE_HP_AFTER, 256);
    assert.equal(CAVALIER_PHASE_GATE_MAX_HP_AFTER, 512);

    const grandmaster = defaults.slice(
      defaults.indexOf('id: "void_grandmaster"'),
      defaults.indexOf('id: "bone_cavalier"'),
    );
    assert.ok(
      grandmaster.includes("hp: 300"),
      "Grandmaster #1336 is ×1.3 at 60% of 300 — this sidecar is Cavalier 320",
    );
    const broodmother = defaults.slice(
      defaults.indexOf('id: "broodmother_rook"'),
      defaults.indexOf('id: "lord_of_static"'),
    );
    assert.ok(
      broodmother.includes("hp: 480"),
      "Broodmother #1333 is ×1.4 at 50% of 480 — this sidecar is Cavalier 320",
    );
    const archbishop = defaults.slice(
      defaults.indexOf('id: "pale_archbishop"'),
      defaults.indexOf('id: "crimson_countess"'),
    );
    assert.ok(
      archbishop.includes("hp: 350"),
      "Archbishop #1332 is ×1.4 at 50% of 350 — this sidecar is Cavalier 320",
    );
    const countess = defaults.slice(
      defaults.indexOf('id: "crimson_countess"'),
      defaults.indexOf('id: "void_grandmaster"'),
    );
    assert.ok(
      countess.includes("statMultiplier: 1.5"),
      "Countess #1329 is ×1.5 at 40% — this sidecar is Cavalier-only",
    );
    const fetid = defaults.slice(
      defaults.indexOf('id: "fetid_rook"'),
      defaults.indexOf('id: "eternal_pawn_king"'),
    );
    assert.ok(
      fetid.includes("statMultiplier: 1.0"),
      "Fetid #1325 has no ×1.6 HP fire — this sidecar is Cavalier-only",
    );
  });

  it("live 160/320 does not transition; advertised 50% does", () => {
    const atGuide = {
      hp: CAVALIER_PHASE_GATE_HP_AT_GUIDE,
      maxHp: CAVALIER_PHASE_GATE_HP,
      alreadyPhase2: false,
    };
    assert.equal(liveWxCavalierPhaseTransitioned(atGuide), false);
    assert.equal(advertisedCavalierPhaseTransitioned(atGuide), true);
    assert.equal(resolveBoneCavalierPhaseGate(atGuide), 2);
    assert.equal(liveWxCavalierReadsPhase2Threshold(), true);
    assert.equal(wxAppliesCavalierPhaseHpOnceTransitioned(), true);

    const above = {
      hp: CAVALIER_PHASE_GATE_HP_AT_GUIDE + 1,
      maxHp: CAVALIER_PHASE_GATE_HP,
      alreadyPhase2: false,
    };
    assert.equal(advertisedCavalierPhaseTransitioned(above), false);
    assert.equal(liveWxCavalierPhaseTransitioned(above), false);
    assert.equal(resolveBoneCavalierPhaseGate(above), null);
    assert.equal(executeCavalierPhaseGateHp(gateReady({ hp: 161 })), null);

    const dying = {
      hp: 1,
      maxHp: CAVALIER_PHASE_GATE_HP,
      alreadyPhase2: false,
    };
    assert.equal(
      liveWxCavalierPhaseTransitioned(dying),
      false,
      "live 0.0 still refuses a 1 HP Cavalier — only hp 0 satisfies it",
    );
    assert.equal(advertisedCavalierPhaseTransitioned(dying), true);
    assert.equal(
      liveWxCavalierPhaseTransitioned({
        hp: 0,
        maxHp: CAVALIER_PHASE_GATE_HP,
        alreadyPhase2: false,
      }),
      true,
      "live only arms when the Cavalier is already dead",
    );
  });
});

describe("player-visible Cavalier HP after advertised 50% ×1.6", () => {
  it("commits 256/512; live 0.0 leaves 160/320", () => {
    const ready = gateReady();
    const decided = shouldCommitCavalierPhaseGateHp(ready);
    const executable = canExecuteCavalierPhaseGateHp(ready);
    assert.equal(decided, true);
    assert.equal(executable, true);

    const next = executeCavalierPhaseGateHp(ready);
    assert.deepEqual(next, {
      phase: 2,
      hp: 256,
      maxHp: 512,
    });
    assert.equal(
      liveWxCavalierPhaseTransitioned({
        hp: ready.hp,
        maxHp: ready.maxHp,
        alreadyPhase2: false,
      }),
      false,
    );
  });

  it("10 HP Cavalier: advertised 50% already armed so ×1.6 still commits", () => {
    const ready = gateReady({ hp: 10 });
    const next = executeCavalierPhaseGateHp(ready);
    assert.deepEqual(next, {
      phase: 2,
      hp: 16,
      maxHp: 512,
    });
    assert.equal(
      liveWxCavalierPhaseTransitioned({
        hp: 10,
        maxHp: CAVALIER_PHASE_GATE_HP,
        alreadyPhase2: false,
      }),
      false,
    );
    assert.deepEqual(hpAfterBossPhase2(10, 320, 1.6, false), {
      hp: 16,
      maxHp: 512,
    });

    const advertisedAfterStrike = (next?.hp ?? 0) - STRIKE_DAMAGE;
    assert.equal(advertisedAfterStrike, 6);
    assert.equal(
      shouldAwardVictory({
        inBattle: true,
        deathTriggered: false,
        battleStartIdsSize: 1,
        hostilesRemaining: advertisedAfterStrike > 0 ? 1 : 0,
      }),
      false,
      "advertised ×1.6 leaves 6 HP after Strike 10",
    );
    assert.equal(
      shouldAwardVictory({
        inBattle: true,
        deathTriggered: false,
        battleStartIdsSize: 1,
        hostilesRemaining: Math.max(0, 10 - STRIKE_DAMAGE) > 0 ? 1 : 0,
      }),
      true,
      "live 0.0 never arms, so Strike 10 kills the 10 HP knight",
    );
  });

  it("cannot stamp Grandmaster, Broodmother, Archbishop, Countess, Fetid, already-phase-2, or sibling leftover payloads", () => {
    const ready = gateReady();
    assert.equal(
      executeCavalierPhaseGateHp({
        ...ready,
        alreadyPhase2: true,
      }),
      null,
      "already-phase-2 does not re-apply ×1.6",
    );
    assert.equal(
      resolveBoneCavalierPhaseGate({
        bossId: "void_grandmaster",
        hp: CAVALIER_PHASE_GATE_HP_AT_GUIDE,
        maxHp: CAVALIER_PHASE_GATE_HP,
        alreadyPhase2: false,
      }),
      null,
      "Grandmaster ×1.3 60% of 300 is owned #1336",
    );
    assert.equal(
      executeCavalierPhaseGateHp({
        ...ready,
        bossId: "broodmother_rook",
      }),
      null,
      "Broodmother ×1.4 50% of 480 is owned #1333",
    );
    assert.equal(
      executeCavalierPhaseGateHp({
        ...ready,
        bossId: "pale_archbishop",
      }),
      null,
      "Archbishop ×1.4 50% of 350 is owned #1332",
    );
    assert.equal(
      executeCavalierPhaseGateHp({
        ...ready,
        bossId: "crimson_countess",
      }),
      null,
      "Countess ×1.5 40% gate is owned #1329",
    );
    assert.equal(
      executeCavalierPhaseGateHp({
        ...ready,
        bossId: "fetid_rook",
      }),
      null,
      "Fetid Split 40% gate is owned #1325",
    );
    assert.equal(
      executeCavalierPhaseGateHp({
        ...ready,
        bossId: "lord_of_static",
      }),
      null,
      "Lord of Static CHAIN 40% leftover is not this Cavalier gate",
    );
    assert.equal(
      executeCavalierPhaseGateHp({
        ...ready,
        bossId: "midnight_bishop",
      }),
      null,
    );
    assert.equal(
      executeCavalierPhaseGateHp({
        ...ready,
        bossId: "weeping_pawn",
      }),
      null,
      "Weeping Pawn PROMOTE 30% leftover is not this Cavalier gate",
    );
    assert.equal(
      executeCavalierPhaseGateHp({
        ...ready,
        bossId: "final_pawn",
      }),
      null,
      "Final Pawn HP≤10% GHOST leftover of #1247",
    );

    const crit = executeCavalierPhaseGateHp(ready);
    assert.ok(crit);
    assert.equal("atk" in crit, false, "base atk 45 leftover stays unrestored");
    assert.equal("ap" in crit, false);
    assert.equal("res" in crit, false);
    assert.equal("chc" in crit, false, "#1104 owns boss kit CHC");
    assert.equal(
      "spike" in crit,
      false,
      "SPIKE_ON_LAND occupancy leftover stays unrestored",
    );
    assert.equal(
      "jump" in crit,
      false,
      "KNIGHT_JUMP leftover already runs in phase 1",
    );
    assert.equal("strike" in crit, false, "kit-first physical_attack leftover");
    assert.equal("haste" in crit, false);
    assert.equal("enrage" in crit, false, "phase-2 kit extra leftover");
    assert.equal("expose" in crit, false);
    assert.equal("illusion" in crit, false, "#1336 owns Grandmaster ILLUSION");
    assert.equal("copies" in crit, false, "#914 owns illusion occupancy");
    assert.equal("swap" in crit, false, "#850 owns kit Swap execute");
    assert.equal("teleport" in crit, false, "#1336 owns Grandmaster teleport");
    assert.equal("blast" in crit, false, "#1336 owns kit-first starter-blast");
    assert.equal("split" in crit, false, "#1325 owns Fetid Split");
    assert.equal("twins" in crit, false, "#1325 owns twin occupancy");
    assert.equal("lava" in crit, false, "#1329 owns Countess LAVA_TRAIL");
    assert.equal("inferno" in crit, false, "#1323 owns kit Inferno CD 3");
    assert.equal("reflect" in crit, false, "#1332 owns Archbishop REFLECT");
    assert.equal("spawn" in crit, false, "#1102 owns SPAWN_MINIONS decide");
    assert.equal("minion" in crit, false, "#1278 / #1331 own skeleton stamps");
    assert.equal("larvae" in crit, false, "#1333 owns Broodmother larvae");
    assert.equal("ghost" in crit, false, "#1247 owns Final Pawn GHOST");
    assert.equal("roll" in crit, false, "#1208 owns Titan 1–5×");
    assert.equal(CAVALIER_PHASE_GATE_ABILITY, "SPIKE_ON_LAND");
    assert.equal(CAVALIER_PHASE_GATE_JUMP_LEFTOVER, "KNIGHT_JUMP_IGNORE_WALLS");
    assert.equal(CAVALIER_PHASE_GATE_KIT_FIRST, "physical_attack");
    assert.equal(CAVALIER_PHASE_GATE_KIT_PHASE2, "spell-enrage");
  });
});

describe("production still reads phase2.hpThreshold 0.0", () => {
  it("checkPhaseTransition still keys off phase2.hpThreshold", () => {
    const src = readFileSync(join(here(), "../hooks/useBossSystem.ts"), "utf8");
    const start = src.indexOf("export function checkPhaseTransition(");
    assert.ok(start >= 0, "checkPhaseTransition is present");
    const end = src.indexOf("function applyReflectShield(", start);
    assert.ok(end > start, "Reflect still follows the phase gate");
    const body = src.slice(start, end);
    assert.ok(body.includes("hpFraction <= config.phase2.hpThreshold"));
    assert.equal(
      body.includes("config.phase1.hpThreshold"),
      false,
      "live gate still ignores the advertised phase-1 card",
    );
    assert.equal(body.includes("resolveBoneCavalierPhaseGate"), false);
    assert.equal(body.includes("executeCavalierPhaseGateHp"), false);

    const spike = src.slice(
      src.indexOf("function applySpikeOnLand("),
      src.indexOf("function applyCurseOnHit("),
    );
    assert.ok(spike.includes('type: "spikes"'));
    assert.ok(spike.includes("plants spikes at the landing tile"));
  });

  it("decideBoneCavalierAction still requires currentPhase 2 after kit first-id", () => {
    const src = readFileSync(join(here(), "../hooks/useBossAI.ts"), "utf8");
    const start = src.indexOf("export const decideBoneCavalierAction");
    const end = src.indexOf("export const decideWeepingPawnAction");
    assert.ok(start >= 0 && end > start, "Cavalier decide is present");
    const body = src.slice(start, end);
    const kitIdx = body.indexOf("pickBossKitSpell");
    const spikeIdx = body.indexOf("BossAbility.SPIKE_ON_LAND");
    assert.ok(kitIdx >= 0, "kit pick is present");
    assert.ok(spikeIdx >= 0, "SPIKE_ON_LAND is present");
    assert.ok(kitIdx < spikeIdx, "kit still wins the spike turn");
    assert.ok(body.includes("bossState.currentPhase === 2"));
    assert.ok(body.includes("new Map<string, number>()"));
    assert.equal(body.includes("resolveBoneCavalierPhaseGate"), false);
    assert.equal(body.includes("executeCavalierPhaseGateHp"), false);
    assert.equal(body.includes("phase1.hpThreshold"), false);
  });

  it("WorldExploration still calls checkPhaseTransition and hpAfterBossPhase2", () => {
    const wx = readFileSync(
      join(here(), "../components/WorldExploration.tsx"),
      "utf8",
    );
    const start = wx.indexOf(
      "const { transitioned, newState } = checkPhaseTransition(",
    );
    assert.ok(start >= 0, "live phase call is present");
    const call = wx.slice(start, start + 180);
    assert.ok(call.includes("currentBossConfig"));
    assert.ok(wx.includes("hpAfterBossPhase2("));
    assert.ok(wx.includes("PHASE 2! Stats boosted"));
    assert.equal(wx.includes("resolveBoneCavalierPhaseGate"), false);
    assert.equal(wx.includes("executeCavalierPhaseGateHp"), false);
    assert.equal(
      wx.includes("config.phase1.hpThreshold"),
      false,
      "WX still never substitutes the advertised 50% card",
    );
  });

  it("Boss Guide still advertises SPIKE_ON_LAND at phase1 50%", () => {
    const guide = readFileSync(
      join(here(), "../components/BossGuideModal.tsx"),
      "utf8",
    );
    assert.ok(guide.includes(CAVALIER_PHASE_GATE_GUIDE_NEEDLE));
    assert.ok(
      guide.includes(
        "Phase 2 — HP &le; {Math.round(boss.phase1.hpThreshold * 100)}%",
      ),
    );
    assert.equal(
      guide.includes("boss.phase2.hpThreshold"),
      false,
      "guide still paints the phase-1 card, not live phase2 0.0",
    );

    const kits = readFileSync(join(here(), "../data/bossKits.ts"), "utf8");
    const cavalier = kits.slice(
      kits.indexOf("bone_cavalier: {"),
      kits.indexOf("weeping_pawn: {"),
    );
    const p1 = cavalier.slice(cavalier.indexOf("phase1SpellIds:"));
    assert.ok(p1.includes(`"${CAVALIER_PHASE_GATE_KIT_FIRST}"`));
    const p2 = cavalier.slice(cavalier.indexOf("phase2SpellIds:"));
    assert.ok(p2.includes(`"${CAVALIER_PHASE_GATE_KIT_FIRST}"`));
    assert.ok(p2.includes(`"${CAVALIER_PHASE_GATE_KIT_PHASE2}"`));
    assert.equal(strike.id, CAVALIER_PHASE_GATE_KIT_FIRST);
    assert.equal(enrage.id, CAVALIER_PHASE_GATE_KIT_PHASE2);
    assert.equal(
      haste.id,
      "spell-haste",
      "haste stays in both pools — kit leftover, not restored",
    );

    const rush = readFileSync(join(here(), "../hooks/useBossRush.ts"), "utf8");
    assert.ok(rush.includes('boss1Id: "bone_cavalier"'));
  });
});
