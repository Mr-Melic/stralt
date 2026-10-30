/**
 * Combat action parity: Void Grandmaster phase 2 never arms at the
 * advertised 60% card because checkPhaseTransition reads
 * phase2.hpThreshold 0.0, so the ×1.3 HP commit never runs.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { starterSpells } from "../data/spellData.ts";
import { hpAfterBossPhase2, shouldAwardVictory } from "./battleSetup.ts";
import {
  GRANDMASTER_PHASE_GATE_ABILITY,
  GRANDMASTER_PHASE_GATE_ADVERTISED_THRESHOLD,
  GRANDMASTER_PHASE_GATE_GUIDE_NEEDLE,
  GRANDMASTER_PHASE_GATE_HP,
  GRANDMASTER_PHASE_GATE_HP_AFTER,
  GRANDMASTER_PHASE_GATE_HP_AT_GUIDE,
  GRANDMASTER_PHASE_GATE_KIT_FIRST,
  GRANDMASTER_PHASE_GATE_KIT_PHASE2,
  GRANDMASTER_PHASE_GATE_LIVE_THRESHOLD,
  GRANDMASTER_PHASE_GATE_LORE_NEEDLE,
  GRANDMASTER_PHASE_GATE_MAX_HP_AFTER,
  GRANDMASTER_PHASE_GATE_STAT_MULT,
  GRANDMASTER_PHASE_GATE_TELEPORT_LEFTOVER,
  VOID_GRANDMASTER_PHASE_GATE_BOSS_ID,
  advertisedGrandmasterPhaseThreshold,
  advertisedGrandmasterPhaseTransitioned,
  canExecuteGrandmasterPhaseGateHp,
  executeGrandmasterPhaseGateHp,
  grandmasterHpFraction,
  liveWxGrandmasterPhaseThreshold,
  liveWxGrandmasterPhaseTransitioned,
  liveWxGrandmasterReadsPhase2Threshold,
  resolveVoidGrandmasterPhaseGate,
  shouldCommitGrandmasterPhaseGateHp,
  wxAppliesGrandmasterPhaseHpOnceTransitioned,
} from "./bossGrandmasterPhaseGateCommit.ts";

const blast = starterSpells.find((s) => s.id === "starter-blast");
assert.ok(blast, "starter-blast");
const swap = starterSpells.find((s) => s.id === "spell-swap");
assert.ok(swap, "spell-swap");
const strike = starterSpells.find((s) => s.id === "physical_attack");
assert.ok(strike, "physical_attack");

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
    bossId: overrides?.bossId ?? VOID_GRANDMASTER_PHASE_GATE_BOSS_ID,
    hp: overrides?.hp ?? GRANDMASTER_PHASE_GATE_HP_AT_GUIDE,
    maxHp: GRANDMASTER_PHASE_GATE_HP,
    alreadyPhase2: overrides?.alreadyPhase2 ?? false,
  };
}

describe("Void Grandmaster advertised 60% phase gate vs live 0.0", () => {
  it("catalog 0.6 / 300 HP / ×1.3 stay distinct from live phase2 0.0 and kit Blast", () => {
    const defaults = readFileSync(
      join(here(), "../types/bossDefaults.ts"),
      "utf8",
    );
    const grandmaster = defaults.slice(
      defaults.indexOf('id: "void_grandmaster"'),
      defaults.indexOf('id: "bone_cavalier"'),
    );
    assert.ok(
      grandmaster.includes(`id: "${VOID_GRANDMASTER_PHASE_GATE_BOSS_ID}"`),
    );
    assert.ok(grandmaster.includes("hp: 300"));
    assert.ok(grandmaster.includes("hpThreshold: 0.6"));
    assert.ok(grandmaster.includes("hpThreshold: 0.0"));
    assert.ok(grandmaster.includes("statMultiplier: 1.3"));
    assert.ok(grandmaster.includes("BossAbility.ILLUSION_SPLIT"));
    assert.ok(grandmaster.includes("BossAbility.TELEPORT_ADJACENT"));
    assert.ok(grandmaster.includes(GRANDMASTER_PHASE_GATE_LORE_NEEDLE));
    assert.equal(GRANDMASTER_PHASE_GATE_HP, 300);
    assert.equal(GRANDMASTER_PHASE_GATE_ADVERTISED_THRESHOLD, 0.6);
    assert.equal(GRANDMASTER_PHASE_GATE_LIVE_THRESHOLD, 0.0);
    assert.equal(GRANDMASTER_PHASE_GATE_HP_AT_GUIDE, 180);
    assert.equal(300 * 0.6, 180);
    assert.equal(GRANDMASTER_PHASE_GATE_STAT_MULT, 1.3);
    assert.equal(
      grandmasterHpFraction(
        GRANDMASTER_PHASE_GATE_HP_AT_GUIDE,
        GRANDMASTER_PHASE_GATE_HP,
      ),
      0.6,
    );
    assert.equal(advertisedGrandmasterPhaseThreshold(), 0.6);
    assert.equal(liveWxGrandmasterPhaseThreshold(), 0.0);
    assert.notEqual(
      advertisedGrandmasterPhaseThreshold(),
      liveWxGrandmasterPhaseThreshold(),
    );
    assert.equal(blast.id, GRANDMASTER_PHASE_GATE_KIT_FIRST);
    assert.equal(swap.id, GRANDMASTER_PHASE_GATE_KIT_PHASE2);
    assert.equal(STRIKE_DAMAGE, 10);
    assert.deepEqual(hpAfterBossPhase2(180, 300, 1.3, false), {
      hp: 234,
      maxHp: 390,
    });
    assert.equal(GRANDMASTER_PHASE_GATE_HP_AFTER, 234);
    assert.equal(GRANDMASTER_PHASE_GATE_MAX_HP_AFTER, 390);

    const broodmother = defaults.slice(
      defaults.indexOf('id: "broodmother_rook"'),
      defaults.indexOf('id: "lord_of_static"'),
    );
    assert.ok(
      broodmother.includes("hp: 480"),
      "Broodmother #1333 is ×1.4 at 50% of 480 — this sidecar is Grandmaster 300",
    );
    const archbishop = defaults.slice(
      defaults.indexOf('id: "pale_archbishop"'),
      defaults.indexOf('id: "crimson_countess"'),
    );
    assert.ok(
      archbishop.includes("hp: 350"),
      "Archbishop #1332 is ×1.4 at 50% of 350 — this sidecar is Grandmaster 300",
    );
    const countess = defaults.slice(
      defaults.indexOf('id: "crimson_countess"'),
      defaults.indexOf('id: "void_grandmaster"'),
    );
    assert.ok(
      countess.includes("statMultiplier: 1.5"),
      "Countess #1329 is ×1.5 at 40% — this sidecar is Grandmaster-only",
    );
    const fetid = defaults.slice(
      defaults.indexOf('id: "fetid_rook"'),
      defaults.indexOf('id: "eternal_pawn_king"'),
    );
    assert.ok(
      fetid.includes("statMultiplier: 1.0"),
      "Fetid #1325 has no ×1.3 HP fire — this sidecar is Grandmaster-only",
    );
  });

  it("live 180/300 does not transition; advertised 60% does", () => {
    const atGuide = {
      hp: GRANDMASTER_PHASE_GATE_HP_AT_GUIDE,
      maxHp: GRANDMASTER_PHASE_GATE_HP,
      alreadyPhase2: false,
    };
    assert.equal(liveWxGrandmasterPhaseTransitioned(atGuide), false);
    assert.equal(advertisedGrandmasterPhaseTransitioned(atGuide), true);
    assert.equal(resolveVoidGrandmasterPhaseGate(atGuide), 2);
    assert.equal(liveWxGrandmasterReadsPhase2Threshold(), true);
    assert.equal(wxAppliesGrandmasterPhaseHpOnceTransitioned(), true);

    const above = {
      hp: GRANDMASTER_PHASE_GATE_HP_AT_GUIDE + 1,
      maxHp: GRANDMASTER_PHASE_GATE_HP,
      alreadyPhase2: false,
    };
    assert.equal(advertisedGrandmasterPhaseTransitioned(above), false);
    assert.equal(liveWxGrandmasterPhaseTransitioned(above), false);
    assert.equal(resolveVoidGrandmasterPhaseGate(above), null);
    assert.equal(executeGrandmasterPhaseGateHp(gateReady({ hp: 181 })), null);

    const dying = {
      hp: 1,
      maxHp: GRANDMASTER_PHASE_GATE_HP,
      alreadyPhase2: false,
    };
    assert.equal(
      liveWxGrandmasterPhaseTransitioned(dying),
      false,
      "live 0.0 still refuses a 1 HP Grandmaster — only hp 0 satisfies it",
    );
    assert.equal(advertisedGrandmasterPhaseTransitioned(dying), true);
    assert.equal(
      liveWxGrandmasterPhaseTransitioned({
        hp: 0,
        maxHp: GRANDMASTER_PHASE_GATE_HP,
        alreadyPhase2: false,
      }),
      true,
      "live only arms when the Grandmaster is already dead",
    );
  });
});

describe("player-visible Grandmaster HP after advertised 60% ×1.3", () => {
  it("commits 234/390; live 0.0 leaves 180/300", () => {
    const ready = gateReady();
    const decided = shouldCommitGrandmasterPhaseGateHp(ready);
    const executable = canExecuteGrandmasterPhaseGateHp(ready);
    assert.equal(decided, true);
    assert.equal(executable, true);

    const next = executeGrandmasterPhaseGateHp(ready);
    assert.deepEqual(next, {
      phase: 2,
      hp: 234,
      maxHp: 390,
    });
    assert.equal(
      liveWxGrandmasterPhaseTransitioned({
        hp: ready.hp,
        maxHp: ready.maxHp,
        alreadyPhase2: false,
      }),
      false,
    );
  });

  it("10 HP Grandmaster: advertised 60% already armed so ×1.3 still commits", () => {
    const ready = gateReady({ hp: 10 });
    const next = executeGrandmasterPhaseGateHp(ready);
    assert.deepEqual(next, {
      phase: 2,
      hp: 13,
      maxHp: 390,
    });
    assert.equal(
      liveWxGrandmasterPhaseTransitioned({
        hp: 10,
        maxHp: GRANDMASTER_PHASE_GATE_HP,
        alreadyPhase2: false,
      }),
      false,
    );
    assert.deepEqual(hpAfterBossPhase2(10, 300, 1.3, false), {
      hp: 13,
      maxHp: 390,
    });

    const advertisedAfterStrike = (next?.hp ?? 0) - STRIKE_DAMAGE;
    assert.equal(advertisedAfterStrike, 3);
    assert.equal(
      shouldAwardVictory({
        inBattle: true,
        deathTriggered: false,
        battleStartIdsSize: 1,
        hostilesRemaining: advertisedAfterStrike > 0 ? 1 : 0,
      }),
      false,
      "advertised ×1.3 leaves 3 HP after Strike 10",
    );
    assert.equal(
      shouldAwardVictory({
        inBattle: true,
        deathTriggered: false,
        battleStartIdsSize: 1,
        hostilesRemaining: Math.max(0, 10 - STRIKE_DAMAGE) > 0 ? 1 : 0,
      }),
      true,
      "live 0.0 never arms, so Strike 10 kills the 10 HP king",
    );
  });

  it("cannot stamp Broodmother, Archbishop, Countess, Fetid, already-phase-2, or sibling leftover payloads", () => {
    const ready = gateReady();
    assert.equal(
      executeGrandmasterPhaseGateHp({
        ...ready,
        alreadyPhase2: true,
      }),
      null,
      "already-phase-2 does not re-apply ×1.3",
    );
    assert.equal(
      resolveVoidGrandmasterPhaseGate({
        bossId: "broodmother_rook",
        hp: GRANDMASTER_PHASE_GATE_HP_AT_GUIDE,
        maxHp: GRANDMASTER_PHASE_GATE_HP,
        alreadyPhase2: false,
      }),
      null,
      "Broodmother ×1.4 50% of 480 is owned #1333",
    );
    assert.equal(
      executeGrandmasterPhaseGateHp({
        ...ready,
        bossId: "pale_archbishop",
      }),
      null,
      "Archbishop ×1.4 50% of 350 is owned #1332",
    );
    assert.equal(
      executeGrandmasterPhaseGateHp({
        ...ready,
        bossId: "crimson_countess",
      }),
      null,
      "Countess ×1.5 40% gate is owned #1329",
    );
    assert.equal(
      executeGrandmasterPhaseGateHp({
        ...ready,
        bossId: "fetid_rook",
      }),
      null,
      "Fetid Split 40% gate is owned #1325",
    );
    assert.equal(
      executeGrandmasterPhaseGateHp({
        ...ready,
        bossId: "bone_cavalier",
      }),
      null,
      "Cavalier SPIKE 50% leftover is not this Grandmaster gate",
    );
    assert.equal(
      executeGrandmasterPhaseGateHp({
        ...ready,
        bossId: "lord_of_static",
      }),
      null,
      "Lord of Static CHAIN 40% leftover is not this Grandmaster gate",
    );
    assert.equal(
      executeGrandmasterPhaseGateHp({
        ...ready,
        bossId: "midnight_bishop",
      }),
      null,
    );
    assert.equal(
      executeGrandmasterPhaseGateHp({
        ...ready,
        bossId: "final_pawn",
      }),
      null,
      "Final Pawn HP≤10% GHOST leftover of #1247",
    );

    const crit = executeGrandmasterPhaseGateHp(ready);
    assert.ok(crit);
    assert.equal("atk" in crit, false, "base atk 30 leftover stays unrestored");
    assert.equal("ap" in crit, false);
    assert.equal("res" in crit, false);
    assert.equal("chc" in crit, false, "#1104 owns boss kit CHC");
    assert.equal(
      "illusion" in crit,
      false,
      "ILLUSION_SPLIT occupancy leftover of #914",
    );
    assert.equal("copies" in crit, false, "#914 owns illusion occupancy");
    assert.equal("swap" in crit, false, "#850 owns kit Swap execute");
    assert.equal(
      "teleport" in crit,
      false,
      "TELEPORT_ADJACENT leftover stays unrestored",
    );
    assert.equal("blast" in crit, false, "kit-first starter-blast leftover");
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
    assert.equal(GRANDMASTER_PHASE_GATE_ABILITY, "ILLUSION_SPLIT");
    assert.equal(GRANDMASTER_PHASE_GATE_TELEPORT_LEFTOVER, "TELEPORT_ADJACENT");
    assert.equal(GRANDMASTER_PHASE_GATE_KIT_FIRST, "starter-blast");
    assert.equal(GRANDMASTER_PHASE_GATE_KIT_PHASE2, "spell-swap");
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
    assert.equal(body.includes("resolveVoidGrandmasterPhaseGate"), false);
    assert.equal(body.includes("executeGrandmasterPhaseGateHp"), false);

    const illusion = src.slice(
      src.indexOf("function applyIllusionSplit("),
      src.indexOf("function applyKnightJumpIgnoreWalls("),
    );
    assert.ok(illusion.includes("newIllusions: illusions"));
    assert.ok(illusion.includes("splits into"));
  });

  it("decideVoidGrandmasterAction still requires currentPhase 2 after kit first-id", () => {
    const src = readFileSync(join(here(), "../hooks/useBossAI.ts"), "utf8");
    const start = src.indexOf("export const decideVoidGrandmasterAction");
    const end = src.indexOf("export const decideBoneCavalierAction");
    assert.ok(start >= 0 && end > start, "Grandmaster decide is present");
    const body = src.slice(start, end);
    const kitIdx = body.indexOf("pickBossKitSpell");
    const illusionIdx = body.indexOf("BossAbility.ILLUSION_SPLIT");
    assert.ok(kitIdx >= 0, "kit pick is present");
    assert.ok(illusionIdx >= 0, "ILLUSION_SPLIT is present");
    assert.ok(kitIdx < illusionIdx, "kit still wins the illusion turn");
    assert.ok(body.includes("bossState.currentPhase === 2"));
    assert.ok(body.includes("new Map<string, number>()"));
    assert.equal(body.includes("resolveVoidGrandmasterPhaseGate"), false);
    assert.equal(body.includes("executeGrandmasterPhaseGateHp"), false);
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
    assert.equal(wx.includes("resolveVoidGrandmasterPhaseGate"), false);
    assert.equal(wx.includes("executeGrandmasterPhaseGateHp"), false);
    assert.equal(
      wx.includes("config.phase1.hpThreshold"),
      false,
      "WX still never substitutes the advertised 60% card",
    );
  });

  it("Boss Guide still advertises ILLUSION_SPLIT at phase1 60%", () => {
    const guide = readFileSync(
      join(here(), "../components/BossGuideModal.tsx"),
      "utf8",
    );
    assert.ok(guide.includes(GRANDMASTER_PHASE_GATE_GUIDE_NEEDLE));
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
    const grandmaster = kits.slice(
      kits.indexOf("void_grandmaster: {"),
      kits.indexOf("bone_cavalier: {"),
    );
    const p1 = grandmaster.slice(grandmaster.indexOf("phase1SpellIds:"));
    assert.ok(p1.includes(`"${GRANDMASTER_PHASE_GATE_KIT_FIRST}"`));
    const p2 = grandmaster.slice(grandmaster.indexOf("phase2SpellIds:"));
    assert.ok(p2.includes(`"${GRANDMASTER_PHASE_GATE_KIT_PHASE2}"`));
    assert.equal(
      p2.includes(`"${GRANDMASTER_PHASE_GATE_KIT_FIRST}"`),
      false,
      "phase-2 pool drops starter-blast — live never switches because phase never arms",
    );
    assert.equal(blast.id, GRANDMASTER_PHASE_GATE_KIT_FIRST);
    assert.equal(swap.id, GRANDMASTER_PHASE_GATE_KIT_PHASE2);

    const rush = readFileSync(join(here(), "../hooks/useBossRush.ts"), "utf8");
    assert.ok(rush.includes('boss1Id: "void_grandmaster"'));
  });
});
