/**
 * Combat action parity: Broodmother Rook phase 2 never arms at the
 * advertised 50% card because checkPhaseTransition reads
 * phase2.hpThreshold 0.0, so the ×1.4 HP commit never runs.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { starterSpells } from "../data/spellData.ts";
import { hpAfterBossPhase2, shouldAwardVictory } from "./battleSetup.ts";
import {
  BROODMOTHER_PHASE_GATE_ABILITY,
  BROODMOTHER_PHASE_GATE_ADVERTISED_THRESHOLD,
  BROODMOTHER_PHASE_GATE_EXPLODE_LEFTOVER,
  BROODMOTHER_PHASE_GATE_GUIDE_NEEDLE,
  BROODMOTHER_PHASE_GATE_HP,
  BROODMOTHER_PHASE_GATE_HP_AFTER,
  BROODMOTHER_PHASE_GATE_HP_AT_GUIDE,
  BROODMOTHER_PHASE_GATE_IRON_LEFTOVER,
  BROODMOTHER_PHASE_GATE_KIT_FIRST,
  BROODMOTHER_PHASE_GATE_LIVE_THRESHOLD,
  BROODMOTHER_PHASE_GATE_LORE_NEEDLE,
  BROODMOTHER_PHASE_GATE_MAX_HP_AFTER,
  BROODMOTHER_PHASE_GATE_STAT_MULT,
  BROODMOTHER_ROOK_PHASE_GATE_BOSS_ID,
  advertisedBroodmotherPhaseThreshold,
  advertisedBroodmotherPhaseTransitioned,
  broodmotherHpFraction,
  canExecuteBroodmotherPhaseGateHp,
  executeBroodmotherPhaseGateHp,
  liveWxBroodmotherPhaseThreshold,
  liveWxBroodmotherPhaseTransitioned,
  liveWxBroodmotherReadsPhase2Threshold,
  resolveBroodmotherRookPhaseGate,
  shouldCommitBroodmotherPhaseGateHp,
  wxAppliesBroodmotherPhaseHpOnceTransitioned,
} from "./bossBroodmotherPhaseGateCommit.ts";

const archer = starterSpells.find((s) => s.id === "summon-archer");
assert.ok(archer, "summon-archer");
const strike = starterSpells.find((s) => s.id === "physical_attack");
assert.ok(strike, "physical_attack");
const iron = starterSpells.find((s) => s.id === "spell-iron-skin");
assert.ok(iron, "spell-iron-skin");

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
    bossId: overrides?.bossId ?? BROODMOTHER_ROOK_PHASE_GATE_BOSS_ID,
    hp: overrides?.hp ?? BROODMOTHER_PHASE_GATE_HP_AT_GUIDE,
    maxHp: BROODMOTHER_PHASE_GATE_HP,
    alreadyPhase2: overrides?.alreadyPhase2 ?? false,
  };
}

describe("Broodmother advertised 50% phase gate vs live 0.0", () => {
  it("catalog 0.5 / 480 HP / ×1.4 stay distinct from live phase2 0.0 and kit Archer", () => {
    const defaults = readFileSync(
      join(here(), "../types/bossDefaults.ts"),
      "utf8",
    );
    const broodmother = defaults.slice(
      defaults.indexOf('id: "broodmother_rook"'),
      defaults.indexOf('id: "lord_of_static"'),
    );
    assert.ok(
      broodmother.includes(`id: "${BROODMOTHER_ROOK_PHASE_GATE_BOSS_ID}"`),
    );
    assert.ok(broodmother.includes("hp: 480"));
    assert.ok(broodmother.includes("hpThreshold: 0.5"));
    assert.ok(broodmother.includes("hpThreshold: 0.0"));
    assert.ok(broodmother.includes("statMultiplier: 1.4"));
    assert.ok(broodmother.includes("BossAbility.LARVAE_SPAWN"));
    assert.ok(broodmother.includes("BossAbility.SHELL_ARMOR"));
    assert.ok(broodmother.includes("BossAbility.LARVAE_EXPLODE"));
    assert.ok(broodmother.includes(BROODMOTHER_PHASE_GATE_LORE_NEEDLE));
    assert.equal(BROODMOTHER_PHASE_GATE_HP, 480);
    assert.equal(BROODMOTHER_PHASE_GATE_ADVERTISED_THRESHOLD, 0.5);
    assert.equal(BROODMOTHER_PHASE_GATE_LIVE_THRESHOLD, 0.0);
    assert.equal(BROODMOTHER_PHASE_GATE_HP_AT_GUIDE, 240);
    assert.equal(480 * 0.5, 240);
    assert.equal(BROODMOTHER_PHASE_GATE_STAT_MULT, 1.4);
    assert.equal(
      broodmotherHpFraction(
        BROODMOTHER_PHASE_GATE_HP_AT_GUIDE,
        BROODMOTHER_PHASE_GATE_HP,
      ),
      0.5,
    );
    assert.equal(advertisedBroodmotherPhaseThreshold(), 0.5);
    assert.equal(liveWxBroodmotherPhaseThreshold(), 0.0);
    assert.notEqual(
      advertisedBroodmotherPhaseThreshold(),
      liveWxBroodmotherPhaseThreshold(),
    );
    assert.equal(archer.id, BROODMOTHER_PHASE_GATE_KIT_FIRST);
    assert.equal(archer.isSummon, true);
    assert.equal(Number(archer.damage), 0);
    assert.equal(STRIKE_DAMAGE, 10);
    assert.equal(iron.id, BROODMOTHER_PHASE_GATE_IRON_LEFTOVER);
    assert.equal(iron.buffStat, "res");
    assert.equal(iron.buffModifier, 1.3);
    assert.deepEqual(hpAfterBossPhase2(240, 480, 1.4, false), {
      hp: 336,
      maxHp: 672,
    });
    assert.equal(BROODMOTHER_PHASE_GATE_HP_AFTER, 336);
    assert.equal(BROODMOTHER_PHASE_GATE_MAX_HP_AFTER, 672);

    const archbishop = defaults.slice(
      defaults.indexOf('id: "pale_archbishop"'),
      defaults.indexOf('id: "crimson_countess"'),
    );
    assert.ok(
      archbishop.includes("hp: 350"),
      "Archbishop #1332 is ×1.4 at 50% of 350 — this sidecar is Broodmother 480",
    );
    const countess = defaults.slice(
      defaults.indexOf('id: "crimson_countess"'),
      defaults.indexOf('id: "void_grandmaster"'),
    );
    assert.ok(
      countess.includes("statMultiplier: 1.5"),
      "Countess #1329 is ×1.5 at 40% — this sidecar is Broodmother-only",
    );
    const fetid = defaults.slice(
      defaults.indexOf('id: "fetid_rook"'),
      defaults.indexOf('id: "eternal_pawn_king"'),
    );
    assert.ok(
      fetid.includes("statMultiplier: 1.0"),
      "Fetid #1325 has no ×1.4 HP fire — this sidecar is Broodmother-only",
    );
  });

  it("live 240/480 does not transition; advertised 50% does", () => {
    const atGuide = {
      hp: BROODMOTHER_PHASE_GATE_HP_AT_GUIDE,
      maxHp: BROODMOTHER_PHASE_GATE_HP,
      alreadyPhase2: false,
    };
    assert.equal(liveWxBroodmotherPhaseTransitioned(atGuide), false);
    assert.equal(advertisedBroodmotherPhaseTransitioned(atGuide), true);
    assert.equal(resolveBroodmotherRookPhaseGate(atGuide), 2);
    assert.equal(liveWxBroodmotherReadsPhase2Threshold(), true);
    assert.equal(wxAppliesBroodmotherPhaseHpOnceTransitioned(), true);

    const above = {
      hp: BROODMOTHER_PHASE_GATE_HP_AT_GUIDE + 1,
      maxHp: BROODMOTHER_PHASE_GATE_HP,
      alreadyPhase2: false,
    };
    assert.equal(advertisedBroodmotherPhaseTransitioned(above), false);
    assert.equal(liveWxBroodmotherPhaseTransitioned(above), false);
    assert.equal(resolveBroodmotherRookPhaseGate(above), null);
    assert.equal(executeBroodmotherPhaseGateHp(gateReady({ hp: 241 })), null);

    const dying = {
      hp: 1,
      maxHp: BROODMOTHER_PHASE_GATE_HP,
      alreadyPhase2: false,
    };
    assert.equal(
      liveWxBroodmotherPhaseTransitioned(dying),
      false,
      "live 0.0 still refuses a 1 HP Broodmother — only hp 0 satisfies it",
    );
    assert.equal(advertisedBroodmotherPhaseTransitioned(dying), true);
    assert.equal(
      liveWxBroodmotherPhaseTransitioned({
        hp: 0,
        maxHp: BROODMOTHER_PHASE_GATE_HP,
        alreadyPhase2: false,
      }),
      true,
      "live only arms when the Broodmother is already dead",
    );
  });
});

describe("player-visible Broodmother HP after advertised 50% ×1.4", () => {
  it("commits 336/672; live 0.0 leaves 240/480", () => {
    const ready = gateReady();
    const decided = shouldCommitBroodmotherPhaseGateHp(ready);
    const executable = canExecuteBroodmotherPhaseGateHp(ready);
    assert.equal(decided, true);
    assert.equal(executable, true);

    const next = executeBroodmotherPhaseGateHp(ready);
    assert.deepEqual(next, {
      phase: 2,
      hp: 336,
      maxHp: 672,
    });
    assert.equal(
      liveWxBroodmotherPhaseTransitioned({
        hp: ready.hp,
        maxHp: ready.maxHp,
        alreadyPhase2: false,
      }),
      false,
    );
  });

  it("10 HP Broodmother: advertised 50% already armed so ×1.4 still commits", () => {
    const ready = gateReady({ hp: 10 });
    const next = executeBroodmotherPhaseGateHp(ready);
    assert.deepEqual(next, {
      phase: 2,
      hp: 14,
      maxHp: 672,
    });
    assert.equal(
      liveWxBroodmotherPhaseTransitioned({
        hp: 10,
        maxHp: BROODMOTHER_PHASE_GATE_HP,
        alreadyPhase2: false,
      }),
      false,
    );
    assert.deepEqual(hpAfterBossPhase2(10, 480, 1.4, false), {
      hp: 14,
      maxHp: 672,
    });

    const advertisedAfterStrike = (next?.hp ?? 0) - STRIKE_DAMAGE;
    assert.equal(advertisedAfterStrike, 4);
    assert.equal(
      shouldAwardVictory({
        inBattle: true,
        deathTriggered: false,
        battleStartIdsSize: 1,
        hostilesRemaining: advertisedAfterStrike > 0 ? 1 : 0,
      }),
      false,
      "advertised ×1.4 leaves 4 HP after Strike 10",
    );
    assert.equal(
      shouldAwardVictory({
        inBattle: true,
        deathTriggered: false,
        battleStartIdsSize: 1,
        hostilesRemaining: Math.max(0, 10 - STRIKE_DAMAGE) > 0 ? 1 : 0,
      }),
      true,
      "live 0.0 never arms, so Strike 10 kills the 10 HP rook",
    );
  });

  it("cannot stamp Archbishop, Countess, Fetid, already-phase-2, or sibling leftover payloads", () => {
    const ready = gateReady();
    assert.equal(
      executeBroodmotherPhaseGateHp({
        ...ready,
        alreadyPhase2: true,
      }),
      null,
      "already-phase-2 does not re-apply ×1.4",
    );
    assert.equal(
      resolveBroodmotherRookPhaseGate({
        bossId: "pale_archbishop",
        hp: BROODMOTHER_PHASE_GATE_HP_AT_GUIDE,
        maxHp: BROODMOTHER_PHASE_GATE_HP,
        alreadyPhase2: false,
      }),
      null,
      "Archbishop ×1.4 50% of 350 is owned #1332",
    );
    assert.equal(
      executeBroodmotherPhaseGateHp({
        ...ready,
        bossId: "crimson_countess",
      }),
      null,
      "Countess ×1.5 40% gate is owned #1329",
    );
    assert.equal(
      executeBroodmotherPhaseGateHp({
        ...ready,
        bossId: "fetid_rook",
      }),
      null,
      "Fetid Split 40% gate is owned #1325",
    );
    assert.equal(
      executeBroodmotherPhaseGateHp({
        ...ready,
        bossId: "void_grandmaster",
      }),
      null,
      "Grandmaster ILLUSION_SPLIT 60% leftover is not this Broodmother gate",
    );
    assert.equal(
      executeBroodmotherPhaseGateHp({
        ...ready,
        bossId: "lord_of_static",
      }),
      null,
      "Lord of Static CHAIN 40% leftover is not this Broodmother gate",
    );
    assert.equal(
      executeBroodmotherPhaseGateHp({
        ...ready,
        bossId: "midnight_bishop",
      }),
      null,
    );
    assert.equal(
      executeBroodmotherPhaseGateHp({
        ...ready,
        bossId: "final_pawn",
      }),
      null,
      "Final Pawn HP≤10% GHOST leftover of #1247",
    );

    const crit = executeBroodmotherPhaseGateHp(ready);
    assert.ok(crit);
    assert.equal("atk" in crit, false, "base atk 28 leftover stays unrestored");
    assert.equal("ap" in crit, false);
    assert.equal("res" in crit, false, "kit Iron Skin RES ×1.3 leftover");
    assert.equal("chc" in crit, false, "#1104 owns boss kit CHC");
    assert.equal(
      "larvae" in crit,
      false,
      "LARVAE_SPAWN occupancy leftover of kit-first Archer #1288",
    );
    assert.equal(
      "shell" in crit,
      false,
      "first-spawn shellArmorActive flag leftover stays unrestored",
    );
    assert.equal("explode" in crit, false, "#1217 owns larva explode DoT");
    assert.equal("archer" in crit, false, "#1269 owns kit Archer cap");
    assert.equal("iron" in crit, false, "kit Iron Skin RES ×1.3 leftover");
    assert.equal("venom" in crit, false, "#1261 owns kit-first Venom");
    assert.equal(
      "decide" in crit,
      false,
      "#1288 owns kit-first Archer vs LARVAE_SPAWN",
    );
    assert.equal("split" in crit, false, "#1325 owns Fetid Split");
    assert.equal("twins" in crit, false, "#1325 owns twin occupancy");
    assert.equal("lava" in crit, false, "#1329 owns Countess LAVA_TRAIL");
    assert.equal("inferno" in crit, false, "#1323 owns kit Inferno CD 3");
    assert.equal("reflect" in crit, false, "#1332 owns Archbishop REFLECT");
    assert.equal("spawn" in crit, false, "#1102 owns SPAWN_MINIONS decide");
    assert.equal("minion" in crit, false, "#1278 / #1331 own skeleton stamps");
    assert.equal("ghost" in crit, false, "#1247 owns Final Pawn GHOST");
    assert.equal("roll" in crit, false, "#1208 owns Titan 1–5×");
    assert.equal(BROODMOTHER_PHASE_GATE_ABILITY, "LARVAE_SPAWN");
    assert.equal(BROODMOTHER_PHASE_GATE_EXPLODE_LEFTOVER, "LARVAE_EXPLODE");
    assert.equal(BROODMOTHER_PHASE_GATE_KIT_FIRST, "summon-archer");
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
    assert.equal(body.includes("resolveBroodmotherRookPhaseGate"), false);
    assert.equal(body.includes("executeBroodmotherPhaseGateHp"), false);

    const spawn = src.slice(
      src.indexOf("function applyLarvaeSpawn("),
      src.indexOf("function applyShellArmor("),
    );
    assert.ok(spawn.includes("newLarvae: [larva]"));
    assert.ok(spawn.includes("hp: 1"));
  });

  it("decideBroodmotherRookAction still requires currentPhase 2 after kit first-id", () => {
    const src = readFileSync(join(here(), "../hooks/useBossAI.ts"), "utf8");
    const start = src.indexOf("export const decideBroodmotherRookAction");
    const end = src.indexOf("export const decideLordOfStaticAction");
    assert.ok(start >= 0 && end > start, "Broodmother decide is present");
    const body = src.slice(start, end);
    const kitIdx = body.indexOf("pickBossKitSpell");
    const spawnIdx = body.indexOf("BossAbility.LARVAE_SPAWN");
    const evenIdx = body.indexOf("currentTurn % 2 === 0");
    assert.ok(kitIdx >= 0, "kit pick is present");
    assert.ok(spawnIdx >= 0, "LARVAE_SPAWN is present");
    assert.ok(evenIdx >= 0, "phase-2 even extra spawn is present");
    assert.ok(kitIdx < spawnIdx, "kit still wins the spawn turn");
    assert.ok(body.includes("bossState.currentPhase === 2"));
    assert.ok(body.includes("new Map<string, number>()"));
    assert.equal(body.includes("resolveBroodmotherRookPhaseGate"), false);
    assert.equal(body.includes("executeBroodmotherPhaseGateHp"), false);
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
    assert.equal(wx.includes("resolveBroodmotherRookPhaseGate"), false);
    assert.equal(wx.includes("executeBroodmotherPhaseGateHp"), false);
    assert.equal(
      wx.includes("config.phase1.hpThreshold"),
      false,
      "WX still never substitutes the advertised 50% card",
    );
  });

  it("Boss Guide still advertises LARVAE_SPAWN at phase1 50%", () => {
    const guide = readFileSync(
      join(here(), "../components/BossGuideModal.tsx"),
      "utf8",
    );
    assert.ok(guide.includes(BROODMOTHER_PHASE_GATE_GUIDE_NEEDLE));
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
    const broodmother = kits.slice(
      kits.indexOf("broodmother_rook: {"),
      kits.indexOf("lord_of_static: {"),
    );
    const p1 = broodmother.slice(broodmother.indexOf("phase1SpellIds:"));
    assert.ok(p1.includes(`"${BROODMOTHER_PHASE_GATE_KIT_FIRST}"`));
    const p2 = broodmother.slice(broodmother.indexOf("phase2SpellIds:"));
    assert.ok(p2.includes(`"${BROODMOTHER_PHASE_GATE_KIT_FIRST}"`));
    assert.ok(p2.includes(`"${BROODMOTHER_PHASE_GATE_IRON_LEFTOVER}"`));
    assert.equal(archer.id, BROODMOTHER_PHASE_GATE_KIT_FIRST);

    const rush = readFileSync(join(here(), "../hooks/useBossRush.ts"), "utf8");
    assert.ok(rush.includes('boss2Id: "broodmother_rook"'));
  });
});
