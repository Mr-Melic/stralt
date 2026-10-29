/**
 * Combat action parity: Crimson Countess phase 2 never arms at the
 * advertised 40% card because checkPhaseTransition reads
 * phase2.hpThreshold 0.0, so the ×1.5 HP commit never runs.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { starterSpells } from "../data/spellData.ts";
import { hpAfterBossPhase2 } from "./battleSetup.ts";
import {
  COUNTESS_PHASE_GATE_ABILITY,
  COUNTESS_PHASE_GATE_ADVERTISED_THRESHOLD,
  COUNTESS_PHASE_GATE_GUIDE_NEEDLE,
  COUNTESS_PHASE_GATE_HP,
  COUNTESS_PHASE_GATE_HP_AFTER,
  COUNTESS_PHASE_GATE_HP_AT_GUIDE,
  COUNTESS_PHASE_GATE_KIT_FIRST,
  COUNTESS_PHASE_GATE_LIVE_THRESHOLD,
  COUNTESS_PHASE_GATE_LORE_NEEDLE,
  COUNTESS_PHASE_GATE_MAX_HP_AFTER,
  COUNTESS_PHASE_GATE_STAT_MULT,
  CRIMSON_COUNTESS_PHASE_GATE_BOSS_ID,
  advertisedCountessPhaseThreshold,
  advertisedCountessPhaseTransitioned,
  canExecuteCountessPhaseGateHp,
  countessHpFraction,
  executeCountessPhaseGateHp,
  liveWxCountessPhaseThreshold,
  liveWxCountessPhaseTransitioned,
  liveWxCountessReadsPhase2Threshold,
  resolveCrimsonCountessPhaseGate,
  shouldCommitCountessPhaseGateHp,
  wxAppliesCountessPhaseHpOnceTransitioned,
} from "./bossCountessPhaseGateCommit.ts";

const inferno = starterSpells.find((s) => s.id === "spell-inferno");
assert.ok(inferno, "spell-inferno");

function here(): string {
  return dirname(fileURLToPath(import.meta.url));
}

function gateReady(overrides?: {
  hp?: number;
  alreadyPhase2?: boolean;
  bossId?: string;
}) {
  return {
    bossId: overrides?.bossId ?? CRIMSON_COUNTESS_PHASE_GATE_BOSS_ID,
    hp: overrides?.hp ?? COUNTESS_PHASE_GATE_HP_AT_GUIDE,
    maxHp: COUNTESS_PHASE_GATE_HP,
    alreadyPhase2: overrides?.alreadyPhase2 ?? false,
  };
}

describe("Crimson Countess advertised 40% phase gate vs live 0.0", () => {
  it("catalog 0.4 / 400 HP / ×1.5 stay distinct from live phase2 0.0 and kit Inferno", () => {
    const defaults = readFileSync(
      join(here(), "../types/bossDefaults.ts"),
      "utf8",
    );
    const countess = defaults.slice(
      defaults.indexOf('id: "crimson_countess"'),
      defaults.indexOf('id: "void_grandmaster"'),
    );
    assert.ok(
      countess.includes(`id: "${CRIMSON_COUNTESS_PHASE_GATE_BOSS_ID}"`),
    );
    assert.ok(countess.includes("hp: 400"));
    assert.ok(countess.includes("hpThreshold: 0.4"));
    assert.ok(countess.includes("hpThreshold: 0.0"));
    assert.ok(countess.includes("statMultiplier: 1.5"));
    assert.ok(countess.includes("BossAbility.LAVA_TRAIL"));
    assert.ok(countess.includes(COUNTESS_PHASE_GATE_LORE_NEEDLE));
    assert.equal(COUNTESS_PHASE_GATE_HP, 400);
    assert.equal(COUNTESS_PHASE_GATE_ADVERTISED_THRESHOLD, 0.4);
    assert.equal(COUNTESS_PHASE_GATE_LIVE_THRESHOLD, 0.0);
    assert.equal(COUNTESS_PHASE_GATE_HP_AT_GUIDE, 160);
    assert.equal(400 * 0.4, 160);
    assert.equal(COUNTESS_PHASE_GATE_STAT_MULT, 1.5);
    assert.equal(
      countessHpFraction(
        COUNTESS_PHASE_GATE_HP_AT_GUIDE,
        COUNTESS_PHASE_GATE_HP,
      ),
      0.4,
    );
    assert.equal(advertisedCountessPhaseThreshold(), 0.4);
    assert.equal(liveWxCountessPhaseThreshold(), 0.0);
    assert.notEqual(
      advertisedCountessPhaseThreshold(),
      liveWxCountessPhaseThreshold(),
    );
    assert.equal(inferno.id, COUNTESS_PHASE_GATE_KIT_FIRST);
    assert.equal(inferno.cooldown, 3);
    assert.deepEqual(hpAfterBossPhase2(160, 400, 1.5, false), {
      hp: 240,
      maxHp: 600,
    });
    assert.equal(COUNTESS_PHASE_GATE_HP_AFTER, 240);
    assert.equal(COUNTESS_PHASE_GATE_MAX_HP_AFTER, 600);

    const fetid = defaults.slice(
      defaults.indexOf('id: "fetid_rook"'),
      defaults.indexOf('id: "eternal_pawn_king"'),
    );
    assert.ok(
      fetid.includes("statMultiplier: 1.0"),
      "Fetid #1325 has no ×1.5 HP fire — this sidecar is Countess-only",
    );
  });

  it("live 160/400 does not transition; advertised 40% does", () => {
    const atGuide = {
      hp: COUNTESS_PHASE_GATE_HP_AT_GUIDE,
      maxHp: COUNTESS_PHASE_GATE_HP,
      alreadyPhase2: false,
    };
    assert.equal(liveWxCountessPhaseTransitioned(atGuide), false);
    assert.equal(advertisedCountessPhaseTransitioned(atGuide), true);
    assert.equal(resolveCrimsonCountessPhaseGate(atGuide), 2);
    assert.equal(liveWxCountessReadsPhase2Threshold(), true);
    assert.equal(wxAppliesCountessPhaseHpOnceTransitioned(), true);

    const above = {
      hp: COUNTESS_PHASE_GATE_HP_AT_GUIDE + 1,
      maxHp: COUNTESS_PHASE_GATE_HP,
      alreadyPhase2: false,
    };
    assert.equal(advertisedCountessPhaseTransitioned(above), false);
    assert.equal(liveWxCountessPhaseTransitioned(above), false);
    assert.equal(resolveCrimsonCountessPhaseGate(above), null);
    assert.equal(executeCountessPhaseGateHp(gateReady({ hp: 161 })), null);

    const dying = {
      hp: 1,
      maxHp: COUNTESS_PHASE_GATE_HP,
      alreadyPhase2: false,
    };
    assert.equal(
      liveWxCountessPhaseTransitioned(dying),
      false,
      "live 0.0 still refuses a 1 HP Countess — only hp 0 satisfies it",
    );
    assert.equal(advertisedCountessPhaseTransitioned(dying), true);
    assert.equal(
      liveWxCountessPhaseTransitioned({
        hp: 0,
        maxHp: COUNTESS_PHASE_GATE_HP,
        alreadyPhase2: false,
      }),
      true,
      "live only arms when the Countess is already dead",
    );
  });
});

describe("player-visible Countess HP after advertised 40% ×1.5", () => {
  it("commits 240/600; live 0.0 leaves 160/400", () => {
    const ready = gateReady();
    const decided = shouldCommitCountessPhaseGateHp(ready);
    const executable = canExecuteCountessPhaseGateHp(ready);
    assert.equal(decided, true);
    assert.equal(executable, true);

    const next = executeCountessPhaseGateHp(ready);
    assert.deepEqual(next, {
      phase: 2,
      hp: 240,
      maxHp: 600,
    });
    assert.equal(
      liveWxCountessPhaseTransitioned({
        hp: ready.hp,
        maxHp: ready.maxHp,
        alreadyPhase2: false,
      }),
      false,
    );
  });

  it("10 HP Countess: advertised 40% already armed so ×1.5 still commits", () => {
    const ready = gateReady({ hp: 10 });
    const next = executeCountessPhaseGateHp(ready);
    assert.deepEqual(next, {
      phase: 2,
      hp: 15,
      maxHp: 600,
    });
    assert.equal(
      liveWxCountessPhaseTransitioned({
        hp: 10,
        maxHp: COUNTESS_PHASE_GATE_HP,
        alreadyPhase2: false,
      }),
      false,
    );
    assert.deepEqual(hpAfterBossPhase2(10, 400, 1.5, false), {
      hp: 15,
      maxHp: 600,
    });
  });

  it("cannot stamp Fetid, Archbishop, already-phase-2, or sibling leftover payloads", () => {
    const ready = gateReady();
    assert.equal(
      executeCountessPhaseGateHp({
        ...ready,
        alreadyPhase2: true,
      }),
      null,
      "already-phase-2 does not re-apply ×1.5",
    );
    assert.equal(
      resolveCrimsonCountessPhaseGate({
        bossId: "fetid_rook",
        hp: COUNTESS_PHASE_GATE_HP_AT_GUIDE,
        maxHp: COUNTESS_PHASE_GATE_HP,
        alreadyPhase2: false,
      }),
      null,
      "Fetid Split 40% gate is owned #1325",
    );
    assert.equal(
      executeCountessPhaseGateHp({
        ...ready,
        bossId: "pale_archbishop",
      }),
      null,
      "Archbishop REFLECT+SPAWN 50% leftover is not this Countess gate",
    );
    assert.equal(
      executeCountessPhaseGateHp({
        ...ready,
        bossId: "void_grandmaster",
      }),
      null,
    );
    assert.equal(
      executeCountessPhaseGateHp({
        ...ready,
        bossId: "broodmother_rook",
      }),
      null,
      "Broodmother phase2.hpThreshold 0.0 leftover is not this Countess gate",
    );
    assert.equal(
      executeCountessPhaseGateHp({
        ...ready,
        bossId: "final_pawn",
      }),
      null,
      "Final Pawn HP≤10% GHOST leftover of #1247",
    );

    const crit = executeCountessPhaseGateHp(ready);
    assert.ok(crit);
    assert.equal("atk" in crit, false, "base atk 40 leftover stays unrestored");
    assert.equal("ap" in crit, false);
    assert.equal("res" in crit, false);
    assert.equal("chc" in crit, false, "#1104 owns boss kit CHC");
    assert.equal(
      "lava" in crit,
      false,
      "LAVA_TRAIL occupancy leftover of kit-first Inferno #1323",
    );
    assert.equal("inferno" in crit, false, "#1323 owns kit Inferno CD 3");
    assert.equal("trail" in crit, false);
    assert.equal("split" in crit, false, "#1325 owns Fetid Split");
    assert.equal("twins" in crit, false, "#1325 owns twin occupancy");
    assert.equal("venom" in crit, false, "#1261 owns kit-first Venom");
    assert.equal("ghost" in crit, false, "#1247 owns Final Pawn GHOST");
    assert.equal("roll" in crit, false, "#1208 owns Titan 1–5×");
    assert.equal(COUNTESS_PHASE_GATE_ABILITY, "LAVA_TRAIL");
    assert.equal(COUNTESS_PHASE_GATE_KIT_FIRST, "spell-inferno");
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
    assert.equal(body.includes("resolveCrimsonCountessPhaseGate"), false);
    assert.equal(body.includes("executeCountessPhaseGateHp"), false);

    const lava = src.slice(
      src.indexOf("function applyLavaTrail("),
      src.indexOf("function applyTeleportAdjacent("),
    );
    assert.ok(lava.includes('type: "lava"'));
    assert.ok(lava.includes("newHazardTiles"));
  });

  it("decideCrimsonCountessAction still requires currentPhase 2 after kit first-id", () => {
    const src = readFileSync(join(here(), "../hooks/useBossAI.ts"), "utf8");
    const start = src.indexOf("export const decideCrimsonCountessAction");
    const end = src.indexOf("export const decideVoidGrandmasterAction");
    assert.ok(start >= 0 && end > start, "Countess decide is present");
    const body = src.slice(start, end);
    const kitIdx = body.indexOf("pickBossKitSpell");
    const lavaIdx = body.indexOf("BossAbility.LAVA_TRAIL");
    assert.ok(kitIdx >= 0, "kit pick is present");
    assert.ok(lavaIdx >= 0, "LAVA_TRAIL is present");
    assert.ok(kitIdx < lavaIdx, "kit still wins the lava turn");
    assert.ok(body.includes("bossState.currentPhase === 2"));
    assert.ok(body.includes("new Map<string, number>()"));
    assert.equal(body.includes("resolveCrimsonCountessPhaseGate"), false);
    assert.equal(body.includes("executeCountessPhaseGateHp"), false);
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
    assert.equal(wx.includes("resolveCrimsonCountessPhaseGate"), false);
    assert.equal(wx.includes("executeCountessPhaseGateHp"), false);
    assert.equal(
      wx.includes("config.phase1.hpThreshold"),
      false,
      "WX still never substitutes the advertised 40% card",
    );
  });

  it("Boss Guide still advertises LAVA_TRAIL at phase1 40%", () => {
    const guide = readFileSync(
      join(here(), "../components/BossGuideModal.tsx"),
      "utf8",
    );
    assert.ok(guide.includes(COUNTESS_PHASE_GATE_GUIDE_NEEDLE));
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
    const countess = kits.slice(
      kits.indexOf("crimson_countess: {"),
      kits.indexOf("void_grandmaster: {"),
    );
    const p1 = countess.slice(countess.indexOf("phase1SpellIds:"));
    assert.ok(p1.includes(`"${COUNTESS_PHASE_GATE_KIT_FIRST}"`));
    const p2 = countess.slice(countess.indexOf("phase2SpellIds:"));
    assert.ok(p2.includes(`"${COUNTESS_PHASE_GATE_KIT_FIRST}"`));
    assert.equal(inferno.id, COUNTESS_PHASE_GATE_KIT_FIRST);

    const rush = readFileSync(join(here(), "../hooks/useBossRush.ts"), "utf8");
    assert.ok(rush.includes('boss1Id: "crimson_countess"'));
  });
});
