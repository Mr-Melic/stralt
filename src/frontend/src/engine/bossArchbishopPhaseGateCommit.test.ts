/**
 * Combat action parity: Pale Archbishop phase 2 never arms at the
 * advertised 50% card because checkPhaseTransition reads
 * phase2.hpThreshold 0.0, so the ×1.4 HP commit never runs.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { starterSpells } from "../data/spellData.ts";
import { hpAfterBossPhase2 } from "./battleSetup.ts";
import {
  ARCHBISHOP_PHASE_GATE_ABILITY,
  ARCHBISHOP_PHASE_GATE_ADVERTISED_THRESHOLD,
  ARCHBISHOP_PHASE_GATE_GUIDE_NEEDLE,
  ARCHBISHOP_PHASE_GATE_HP,
  ARCHBISHOP_PHASE_GATE_HP_AFTER,
  ARCHBISHOP_PHASE_GATE_HP_AT_GUIDE,
  ARCHBISHOP_PHASE_GATE_KIT_FIRST,
  ARCHBISHOP_PHASE_GATE_LIVE_THRESHOLD,
  ARCHBISHOP_PHASE_GATE_LORE_NEEDLE,
  ARCHBISHOP_PHASE_GATE_MAX_HP_AFTER,
  ARCHBISHOP_PHASE_GATE_SPAWN_LEFTOVER,
  ARCHBISHOP_PHASE_GATE_STAT_MULT,
  PALE_ARCHBISHOP_PHASE_GATE_BOSS_ID,
  advertisedArchbishopPhaseThreshold,
  advertisedArchbishopPhaseTransitioned,
  archbishopHpFraction,
  canExecuteArchbishopPhaseGateHp,
  executeArchbishopPhaseGateHp,
  liveWxArchbishopPhaseThreshold,
  liveWxArchbishopPhaseTransitioned,
  liveWxArchbishopReadsPhase2Threshold,
  resolvePaleArchbishopPhaseGate,
  shouldCommitArchbishopPhaseGateHp,
  wxAppliesArchbishopPhaseHpOnceTransitioned,
} from "./bossArchbishopPhaseGateCommit.ts";

const cursedWound = starterSpells.find((s) => s.id === "spell-cursed-wound");
assert.ok(cursedWound, "spell-cursed-wound");

function here(): string {
  return dirname(fileURLToPath(import.meta.url));
}

function gateReady(overrides?: {
  hp?: number;
  alreadyPhase2?: boolean;
  bossId?: string;
}) {
  return {
    bossId: overrides?.bossId ?? PALE_ARCHBISHOP_PHASE_GATE_BOSS_ID,
    hp: overrides?.hp ?? ARCHBISHOP_PHASE_GATE_HP_AT_GUIDE,
    maxHp: ARCHBISHOP_PHASE_GATE_HP,
    alreadyPhase2: overrides?.alreadyPhase2 ?? false,
  };
}

describe("Pale Archbishop advertised 50% phase gate vs live 0.0", () => {
  it("catalog 0.5 / 350 HP / ×1.4 stay distinct from live phase2 0.0 and kit Cursed Wound", () => {
    const defaults = readFileSync(
      join(here(), "../types/bossDefaults.ts"),
      "utf8",
    );
    const archbishop = defaults.slice(
      defaults.indexOf('id: "pale_archbishop"'),
      defaults.indexOf('id: "crimson_countess"'),
    );
    assert.ok(
      archbishop.includes(`id: "${PALE_ARCHBISHOP_PHASE_GATE_BOSS_ID}"`),
    );
    assert.ok(archbishop.includes("hp: 350"));
    assert.ok(archbishop.includes("hpThreshold: 0.5"));
    assert.ok(archbishop.includes("hpThreshold: 0.0"));
    assert.ok(archbishop.includes("statMultiplier: 1.4"));
    assert.ok(archbishop.includes("BossAbility.REFLECT_SHIELD"));
    assert.ok(archbishop.includes("BossAbility.SPAWN_MINIONS"));
    assert.ok(archbishop.includes(ARCHBISHOP_PHASE_GATE_LORE_NEEDLE));
    assert.equal(ARCHBISHOP_PHASE_GATE_HP, 350);
    assert.equal(ARCHBISHOP_PHASE_GATE_ADVERTISED_THRESHOLD, 0.5);
    assert.equal(ARCHBISHOP_PHASE_GATE_LIVE_THRESHOLD, 0.0);
    assert.equal(ARCHBISHOP_PHASE_GATE_HP_AT_GUIDE, 175);
    assert.equal(350 * 0.5, 175);
    assert.equal(ARCHBISHOP_PHASE_GATE_STAT_MULT, 1.4);
    assert.equal(
      archbishopHpFraction(
        ARCHBISHOP_PHASE_GATE_HP_AT_GUIDE,
        ARCHBISHOP_PHASE_GATE_HP,
      ),
      0.5,
    );
    assert.equal(advertisedArchbishopPhaseThreshold(), 0.5);
    assert.equal(liveWxArchbishopPhaseThreshold(), 0.0);
    assert.notEqual(
      advertisedArchbishopPhaseThreshold(),
      liveWxArchbishopPhaseThreshold(),
    );
    assert.equal(cursedWound.id, ARCHBISHOP_PHASE_GATE_KIT_FIRST);
    assert.deepEqual(hpAfterBossPhase2(175, 350, 1.4, false), {
      hp: 245,
      maxHp: 490,
    });
    assert.equal(ARCHBISHOP_PHASE_GATE_HP_AFTER, 245);
    assert.equal(ARCHBISHOP_PHASE_GATE_MAX_HP_AFTER, 490);

    const countess = defaults.slice(
      defaults.indexOf('id: "crimson_countess"'),
      defaults.indexOf('id: "void_grandmaster"'),
    );
    assert.ok(
      countess.includes("statMultiplier: 1.5"),
      "Countess #1329 is ×1.5 at 40% — this sidecar is Archbishop-only",
    );
    const fetid = defaults.slice(
      defaults.indexOf('id: "fetid_rook"'),
      defaults.indexOf('id: "eternal_pawn_king"'),
    );
    assert.ok(
      fetid.includes("statMultiplier: 1.0"),
      "Fetid #1325 has no ×1.4 HP fire — this sidecar is Archbishop-only",
    );
  });

  it("live 175/350 does not transition; advertised 50% does", () => {
    const atGuide = {
      hp: ARCHBISHOP_PHASE_GATE_HP_AT_GUIDE,
      maxHp: ARCHBISHOP_PHASE_GATE_HP,
      alreadyPhase2: false,
    };
    assert.equal(liveWxArchbishopPhaseTransitioned(atGuide), false);
    assert.equal(advertisedArchbishopPhaseTransitioned(atGuide), true);
    assert.equal(resolvePaleArchbishopPhaseGate(atGuide), 2);
    assert.equal(liveWxArchbishopReadsPhase2Threshold(), true);
    assert.equal(wxAppliesArchbishopPhaseHpOnceTransitioned(), true);

    const above = {
      hp: ARCHBISHOP_PHASE_GATE_HP_AT_GUIDE + 1,
      maxHp: ARCHBISHOP_PHASE_GATE_HP,
      alreadyPhase2: false,
    };
    assert.equal(advertisedArchbishopPhaseTransitioned(above), false);
    assert.equal(liveWxArchbishopPhaseTransitioned(above), false);
    assert.equal(resolvePaleArchbishopPhaseGate(above), null);
    assert.equal(executeArchbishopPhaseGateHp(gateReady({ hp: 176 })), null);

    const dying = {
      hp: 1,
      maxHp: ARCHBISHOP_PHASE_GATE_HP,
      alreadyPhase2: false,
    };
    assert.equal(
      liveWxArchbishopPhaseTransitioned(dying),
      false,
      "live 0.0 still refuses a 1 HP Archbishop — only hp 0 satisfies it",
    );
    assert.equal(advertisedArchbishopPhaseTransitioned(dying), true);
    assert.equal(
      liveWxArchbishopPhaseTransitioned({
        hp: 0,
        maxHp: ARCHBISHOP_PHASE_GATE_HP,
        alreadyPhase2: false,
      }),
      true,
      "live only arms when the Archbishop is already dead",
    );
  });
});

describe("player-visible Archbishop HP after advertised 50% ×1.4", () => {
  it("commits 245/490; live 0.0 leaves 175/350", () => {
    const ready = gateReady();
    const decided = shouldCommitArchbishopPhaseGateHp(ready);
    const executable = canExecuteArchbishopPhaseGateHp(ready);
    assert.equal(decided, true);
    assert.equal(executable, true);

    const next = executeArchbishopPhaseGateHp(ready);
    assert.deepEqual(next, {
      phase: 2,
      hp: 245,
      maxHp: 490,
    });
    assert.equal(
      liveWxArchbishopPhaseTransitioned({
        hp: ready.hp,
        maxHp: ready.maxHp,
        alreadyPhase2: false,
      }),
      false,
    );
  });

  it("10 HP Archbishop: advertised 50% already armed so ×1.4 still commits", () => {
    const ready = gateReady({ hp: 10 });
    const next = executeArchbishopPhaseGateHp(ready);
    assert.deepEqual(next, {
      phase: 2,
      hp: 14,
      maxHp: 490,
    });
    assert.equal(
      liveWxArchbishopPhaseTransitioned({
        hp: 10,
        maxHp: ARCHBISHOP_PHASE_GATE_HP,
        alreadyPhase2: false,
      }),
      false,
    );
    assert.deepEqual(hpAfterBossPhase2(10, 350, 1.4, false), {
      hp: 14,
      maxHp: 490,
    });
  });

  it("cannot stamp Countess, Fetid, already-phase-2, or sibling leftover payloads", () => {
    const ready = gateReady();
    assert.equal(
      executeArchbishopPhaseGateHp({
        ...ready,
        alreadyPhase2: true,
      }),
      null,
      "already-phase-2 does not re-apply ×1.4",
    );
    assert.equal(
      resolvePaleArchbishopPhaseGate({
        bossId: "crimson_countess",
        hp: ARCHBISHOP_PHASE_GATE_HP_AT_GUIDE,
        maxHp: ARCHBISHOP_PHASE_GATE_HP,
        alreadyPhase2: false,
      }),
      null,
      "Countess ×1.5 40% gate is owned #1329",
    );
    assert.equal(
      executeArchbishopPhaseGateHp({
        ...ready,
        bossId: "fetid_rook",
      }),
      null,
      "Fetid Split 40% gate is owned #1325",
    );
    assert.equal(
      executeArchbishopPhaseGateHp({
        ...ready,
        bossId: "void_grandmaster",
      }),
      null,
      "Grandmaster ILLUSION_SPLIT 60% leftover is not this Archbishop gate",
    );
    assert.equal(
      executeArchbishopPhaseGateHp({
        ...ready,
        bossId: "bone_cavalier",
      }),
      null,
    );
    assert.equal(
      executeArchbishopPhaseGateHp({
        ...ready,
        bossId: "broodmother_rook",
      }),
      null,
      "Broodmother phase2.hpThreshold 0.0 leftover is not this Archbishop gate",
    );
    assert.equal(
      executeArchbishopPhaseGateHp({
        ...ready,
        bossId: "final_pawn",
      }),
      null,
      "Final Pawn HP≤10% GHOST leftover of #1247",
    );

    const crit = executeArchbishopPhaseGateHp(ready);
    assert.ok(crit);
    assert.equal("atk" in crit, false, "base atk 35 leftover stays unrestored");
    assert.equal("ap" in crit, false);
    assert.equal("res" in crit, false, "#1331 owns skeleton RES 2");
    assert.equal("chc" in crit, false, "#1104 owns boss kit CHC");
    assert.equal(
      "reflect" in crit,
      false,
      "REFLECT_SHIELD occupancy leftover of kit-first Cursed Wound #1102",
    );
    assert.equal(
      "spawn" in crit,
      false,
      "SPAWN_MINIONS leftover of kit-first Cursed Wound #1102",
    );
    assert.equal("minion" in crit, false, "#1278 / #1331 own skeleton stamps");
    assert.equal("lava" in crit, false, "#1329 owns Countess LAVA_TRAIL");
    assert.equal("inferno" in crit, false, "#1323 owns kit Inferno CD 3");
    assert.equal("split" in crit, false, "#1325 owns Fetid Split");
    assert.equal("twins" in crit, false, "#1325 owns twin occupancy");
    assert.equal("venom" in crit, false, "#1261 owns kit-first Venom");
    assert.equal("ghost" in crit, false, "#1247 owns Final Pawn GHOST");
    assert.equal("roll" in crit, false, "#1208 owns Titan 1–5×");
    assert.equal(ARCHBISHOP_PHASE_GATE_ABILITY, "REFLECT_SHIELD");
    assert.equal(ARCHBISHOP_PHASE_GATE_SPAWN_LEFTOVER, "SPAWN_MINIONS");
    assert.equal(ARCHBISHOP_PHASE_GATE_KIT_FIRST, "spell-cursed-wound");
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
    assert.equal(body.includes("resolvePaleArchbishopPhaseGate"), false);
    assert.equal(body.includes("executeArchbishopPhaseGateHp"), false);

    const reflect = src.slice(
      src.indexOf("function applyReflectShield("),
      src.indexOf("function applySpawnMinions("),
    );
    assert.ok(reflect.includes("reflectShieldActive: true"));
    assert.ok(reflect.includes("reflectShieldTurnsLeft: 3"));
  });

  it("decidePaleArchbishopAction still requires currentPhase 2 after kit first-id", () => {
    const src = readFileSync(join(here(), "../hooks/useBossAI.ts"), "utf8");
    const start = src.indexOf("export const decidePaleArchbishopAction");
    const end = src.indexOf("export const decideCrimsonCountessAction");
    assert.ok(start >= 0 && end > start, "Archbishop decide is present");
    const body = src.slice(start, end);
    const kitIdx = body.indexOf("pickBossKitSpell");
    const reflectIdx = body.indexOf("BossAbility.REFLECT_SHIELD");
    const spawnIdx = body.indexOf("BossAbility.SPAWN_MINIONS");
    assert.ok(kitIdx >= 0, "kit pick is present");
    assert.ok(reflectIdx >= 0, "REFLECT_SHIELD is present");
    assert.ok(spawnIdx >= 0, "SPAWN_MINIONS is present");
    assert.ok(kitIdx < reflectIdx, "kit still wins the reflect turn");
    assert.ok(reflectIdx < spawnIdx, "spawn still sits after reflect");
    assert.ok(body.includes("bossState.currentPhase === 2"));
    assert.ok(body.includes("new Map<string, number>()"));
    assert.equal(body.includes("resolvePaleArchbishopPhaseGate"), false);
    assert.equal(body.includes("executeArchbishopPhaseGateHp"), false);
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
    assert.equal(wx.includes("resolvePaleArchbishopPhaseGate"), false);
    assert.equal(wx.includes("executeArchbishopPhaseGateHp"), false);
    assert.equal(
      wx.includes("config.phase1.hpThreshold"),
      false,
      "WX still never substitutes the advertised 50% card",
    );
  });

  it("Boss Guide still advertises REFLECT_SHIELD at phase1 50%", () => {
    const guide = readFileSync(
      join(here(), "../components/BossGuideModal.tsx"),
      "utf8",
    );
    assert.ok(guide.includes(ARCHBISHOP_PHASE_GATE_GUIDE_NEEDLE));
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
    const archbishop = kits.slice(
      kits.indexOf("pale_archbishop: {"),
      kits.indexOf("crimson_countess: {"),
    );
    const p1 = archbishop.slice(archbishop.indexOf("phase1SpellIds:"));
    assert.ok(p1.includes(`"${ARCHBISHOP_PHASE_GATE_KIT_FIRST}"`));
    const p2 = archbishop.slice(archbishop.indexOf("phase2SpellIds:"));
    assert.ok(p2.includes(`"${ARCHBISHOP_PHASE_GATE_KIT_FIRST}"`));
    assert.equal(cursedWound.id, ARCHBISHOP_PHASE_GATE_KIT_FIRST);

    const rush = readFileSync(join(here(), "../hooks/useBossRush.ts"), "utf8");
    assert.ok(rush.includes('boss1Id: "pale_archbishop"'));
  });
});
