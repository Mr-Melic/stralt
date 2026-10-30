/**
 * Combat action parity: Weeping Pawn phase 2 never arms at the
 * advertised 30% card because checkPhaseTransition reads
 * phase2.hpThreshold 0.0, so the ×2.0 full-heal HP commit never runs.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { starterSpells } from "../data/spellData.ts";
import { hpAfterBossPhase2, shouldAwardVictory } from "./battleSetup.ts";
import {
  WEEPING_PAWN_PHASE_GATE_ABILITY,
  WEEPING_PAWN_PHASE_GATE_ADVERTISED_THRESHOLD,
  WEEPING_PAWN_PHASE_GATE_BOSS_ID,
  WEEPING_PAWN_PHASE_GATE_FULL_HEAL,
  WEEPING_PAWN_PHASE_GATE_GUIDE_NEEDLE,
  WEEPING_PAWN_PHASE_GATE_HP,
  WEEPING_PAWN_PHASE_GATE_HP_AFTER,
  WEEPING_PAWN_PHASE_GATE_HP_AT_GUIDE,
  WEEPING_PAWN_PHASE_GATE_KIT_FIRST,
  WEEPING_PAWN_PHASE_GATE_KIT_PHASE2,
  WEEPING_PAWN_PHASE_GATE_LINES_LEFTOVER,
  WEEPING_PAWN_PHASE_GATE_LIVE_THRESHOLD,
  WEEPING_PAWN_PHASE_GATE_LORE_NEEDLE,
  WEEPING_PAWN_PHASE_GATE_MAX_HP_AFTER,
  WEEPING_PAWN_PHASE_GATE_STAT_MULT,
  advertisedWeepingPawnPhaseThreshold,
  advertisedWeepingPawnPhaseTransitioned,
  canExecuteWeepingPawnPhaseGateHp,
  executeWeepingPawnPhaseGateHp,
  liveWxWeepingPawnPhaseThreshold,
  liveWxWeepingPawnPhaseTransitioned,
  liveWxWeepingPawnReadsPhase2Threshold,
  resolveWeepingPawnPhaseGate,
  shouldCommitWeepingPawnPhaseGateHp,
  weepingPawnHpFraction,
  wxAppliesWeepingPawnPhaseHpOnceTransitioned,
  wxWeepingPawnPhaseHpFullHealOnceTransitioned,
} from "./bossWeepingPawnPhaseGateCommit.ts";

const strike = starterSpells.find((s) => s.id === "physical_attack");
assert.ok(strike, "physical_attack");
const slow = starterSpells.find((s) => s.id === "spell-slow");
assert.ok(slow, "spell-slow");

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
    bossId: overrides?.bossId ?? WEEPING_PAWN_PHASE_GATE_BOSS_ID,
    hp: overrides?.hp ?? WEEPING_PAWN_PHASE_GATE_HP_AT_GUIDE,
    maxHp: WEEPING_PAWN_PHASE_GATE_HP,
    alreadyPhase2: overrides?.alreadyPhase2 ?? false,
  };
}

describe("Weeping Pawn advertised 30% phase gate vs live 0.0", () => {
  it("catalog 0.3 / 500 HP / ×2.0 full-heal / PROMOTE_QUEEN", () => {
    const defaults = readFileSync(
      join(here(), "../types/bossDefaults.ts"),
      "utf8",
    );
    const weeping = defaults.slice(
      defaults.indexOf('id: "weeping_pawn"'),
      defaults.indexOf('id: "starborn_queen"'),
    );
    assert.ok(weeping.includes(`id: "${WEEPING_PAWN_PHASE_GATE_BOSS_ID}"`));
    assert.ok(weeping.includes("hp: 500"));
    assert.ok(weeping.includes("hpThreshold: 0.3"));
    assert.ok(weeping.includes("hpThreshold: 0.0"));
    assert.ok(weeping.includes("statMultiplier: 2.0"));
    assert.ok(weeping.includes("BossAbility.PROMOTE_QUEEN"));
    assert.ok(weeping.includes("BossAbility.ATTACK_ALL_LINES"));
    assert.ok(weeping.includes(WEEPING_PAWN_PHASE_GATE_LORE_NEEDLE));
    assert.equal(WEEPING_PAWN_PHASE_GATE_HP, 500);
    assert.equal(WEEPING_PAWN_PHASE_GATE_ADVERTISED_THRESHOLD, 0.3);
    assert.equal(WEEPING_PAWN_PHASE_GATE_LIVE_THRESHOLD, 0.0);
    assert.equal(WEEPING_PAWN_PHASE_GATE_HP_AT_GUIDE, 150);
    assert.equal(500 * 0.3, 150);
    assert.equal(WEEPING_PAWN_PHASE_GATE_STAT_MULT, 2.0);
    assert.equal(WEEPING_PAWN_PHASE_GATE_FULL_HEAL, true);
    assert.equal(
      weepingPawnHpFraction(
        WEEPING_PAWN_PHASE_GATE_HP_AT_GUIDE,
        WEEPING_PAWN_PHASE_GATE_HP,
      ),
      0.3,
    );
    assert.equal(advertisedWeepingPawnPhaseThreshold(), 0.3);
    assert.equal(liveWxWeepingPawnPhaseThreshold(), 0.0);
    assert.notEqual(
      advertisedWeepingPawnPhaseThreshold(),
      liveWxWeepingPawnPhaseThreshold(),
    );
    assert.equal(strike.id, WEEPING_PAWN_PHASE_GATE_KIT_FIRST);
    assert.equal(slow.id, WEEPING_PAWN_PHASE_GATE_KIT_PHASE2);
    assert.equal(STRIKE_DAMAGE, 10);
    assert.deepEqual(hpAfterBossPhase2(150, 500, 2.0, true), {
      hp: 1000,
      maxHp: 1000,
    });
    assert.deepEqual(
      hpAfterBossPhase2(150, 500, 2.0, false),
      { hp: 300, maxHp: 1000 },
      "scaled ×2.0 without ISSUE 5 full-heal is 300/1000 — not this fire",
    );
    assert.equal(WEEPING_PAWN_PHASE_GATE_HP_AFTER, 1000);
    assert.equal(WEEPING_PAWN_PHASE_GATE_MAX_HP_AFTER, 1000);

    const staticBoss = defaults.slice(
      defaults.indexOf('id: "lord_of_static"'),
      defaults.indexOf('id: "final_pawn"'),
    );
    assert.ok(
      staticBoss.includes("hp: 340"),
      "Static #1342 is ×1.5 at 40% of 340 — this sidecar is Weeping 500",
    );
    const cavalier = defaults.slice(
      defaults.indexOf('id: "bone_cavalier"'),
      defaults.indexOf('id: "weeping_pawn"'),
    );
    assert.ok(
      cavalier.includes("hp: 320"),
      "Cavalier #1337/#1338 is ×1.6 at 50% of 320 — this sidecar is Weeping 500",
    );
    const grandmaster = defaults.slice(
      defaults.indexOf('id: "void_grandmaster"'),
      defaults.indexOf('id: "bone_cavalier"'),
    );
    assert.ok(
      grandmaster.includes("hp: 300"),
      "Grandmaster #1336 is ×1.3 at 60% of 300 — this sidecar is Weeping 500",
    );
    const broodmother = defaults.slice(
      defaults.indexOf('id: "broodmother_rook"'),
      defaults.indexOf('id: "lord_of_static"'),
    );
    assert.ok(
      broodmother.includes("hp: 480"),
      "Broodmother #1333 is ×1.4 at 50% of 480 — this sidecar is Weeping 500",
    );
    const archbishop = defaults.slice(
      defaults.indexOf('id: "pale_archbishop"'),
      defaults.indexOf('id: "crimson_countess"'),
    );
    assert.ok(
      archbishop.includes("hp: 350"),
      "Archbishop #1332 is ×1.4 at 50% of 350 — this sidecar is Weeping 500",
    );
    const countess = defaults.slice(
      defaults.indexOf('id: "crimson_countess"'),
      defaults.indexOf('id: "void_grandmaster"'),
    );
    assert.ok(
      countess.includes("hp: 400"),
      "Countess #1329 is ×1.5 at 40% of 400 — this sidecar is Weeping 500",
    );
    const fetid = defaults.slice(
      defaults.indexOf('id: "fetid_rook"'),
      defaults.indexOf('id: "eternal_pawn_king"'),
    );
    assert.ok(
      fetid.includes("statMultiplier: 1.0"),
      "Fetid #1325 has no ×2.0 HP fire — this sidecar is Weeping-only",
    );
    const bishop = defaults.slice(
      defaults.indexOf('id: "midnight_bishop"'),
      defaults.indexOf('id: "broodmother_rook"'),
    );
    assert.ok(
      bishop.includes("hp: 360"),
      "Midnight Bishop MERGE 25% of 360 is a sibling leftover",
    );
    assert.ok(bishop.includes("statMultiplier: 2.0"));
  });

  it("live 150/500 does not transition; advertised 30% does", () => {
    const atGuide = {
      hp: WEEPING_PAWN_PHASE_GATE_HP_AT_GUIDE,
      maxHp: WEEPING_PAWN_PHASE_GATE_HP,
      alreadyPhase2: false,
    };
    assert.equal(liveWxWeepingPawnPhaseTransitioned(atGuide), false);
    assert.equal(advertisedWeepingPawnPhaseTransitioned(atGuide), true);
    assert.equal(resolveWeepingPawnPhaseGate(atGuide), 2);
    assert.equal(liveWxWeepingPawnReadsPhase2Threshold(), true);
    assert.equal(wxAppliesWeepingPawnPhaseHpOnceTransitioned(), true);
    assert.equal(wxWeepingPawnPhaseHpFullHealOnceTransitioned(), true);

    const above = {
      hp: WEEPING_PAWN_PHASE_GATE_HP_AT_GUIDE + 1,
      maxHp: WEEPING_PAWN_PHASE_GATE_HP,
      alreadyPhase2: false,
    };
    assert.equal(advertisedWeepingPawnPhaseTransitioned(above), false);
    assert.equal(liveWxWeepingPawnPhaseTransitioned(above), false);
    assert.equal(resolveWeepingPawnPhaseGate(above), null);
    assert.equal(executeWeepingPawnPhaseGateHp(gateReady({ hp: 151 })), null);

    const dying = {
      hp: 1,
      maxHp: WEEPING_PAWN_PHASE_GATE_HP,
      alreadyPhase2: false,
    };
    assert.equal(
      liveWxWeepingPawnPhaseTransitioned(dying),
      false,
      "live 0.0 still refuses a 1 HP Weeping Pawn — only hp 0 satisfies it",
    );
    assert.equal(advertisedWeepingPawnPhaseTransitioned(dying), true);
    assert.equal(
      liveWxWeepingPawnPhaseTransitioned({
        hp: 0,
        maxHp: WEEPING_PAWN_PHASE_GATE_HP,
        alreadyPhase2: false,
      }),
      true,
      "live only arms when Weeping Pawn is already dead",
    );
  });
});

describe("player-visible Weeping Pawn HP after advertised 30% ×2.0 full-heal", () => {
  it("commits 1000/1000; live 0.0 leaves 150/500", () => {
    const ready = gateReady();
    const decided = shouldCommitWeepingPawnPhaseGateHp(ready);
    const executable = canExecuteWeepingPawnPhaseGateHp(ready);
    assert.equal(decided, true);
    assert.equal(executable, true);

    const next = executeWeepingPawnPhaseGateHp(ready);
    assert.deepEqual(next, {
      phase: 2,
      hp: 1000,
      maxHp: 1000,
    });
    assert.equal(
      liveWxWeepingPawnPhaseTransitioned({
        hp: ready.hp,
        maxHp: ready.maxHp,
        alreadyPhase2: false,
      }),
      false,
    );
  });

  it("10 HP Weeping: advertised 30% already armed so full-heal still commits", () => {
    const ready = gateReady({ hp: 10 });
    const next = executeWeepingPawnPhaseGateHp(ready);
    assert.deepEqual(next, {
      phase: 2,
      hp: 1000,
      maxHp: 1000,
    });
    assert.equal(
      liveWxWeepingPawnPhaseTransitioned({
        hp: 10,
        maxHp: WEEPING_PAWN_PHASE_GATE_HP,
        alreadyPhase2: false,
      }),
      false,
    );
    assert.deepEqual(hpAfterBossPhase2(10, 500, 2.0, true), {
      hp: 1000,
      maxHp: 1000,
    });
    assert.deepEqual(
      hpAfterBossPhase2(10, 340, 1.5, false),
      { hp: 15, maxHp: 510 },
      "Static #1342 10 HP ×1.5 is 15/510 — not this full-heal 1000",
    );

    const advertisedAfterStrike = (next?.hp ?? 0) - STRIKE_DAMAGE;
    assert.equal(advertisedAfterStrike, 990);
    assert.equal(
      shouldAwardVictory({
        inBattle: true,
        deathTriggered: false,
        battleStartIdsSize: 1,
        hostilesRemaining: advertisedAfterStrike > 0 ? 1 : 0,
      }),
      false,
      "advertised full-heal leaves 990 HP after Strike 10",
    );
    assert.equal(
      shouldAwardVictory({
        inBattle: true,
        deathTriggered: false,
        battleStartIdsSize: 1,
        hostilesRemaining: Math.max(0, 10 - STRIKE_DAMAGE) > 0 ? 1 : 0,
      }),
      true,
      "live 0.0 never arms, so Strike 10 kills the 10 HP pawn",
    );
  });

  it("cannot stamp Static, Cavalier, Grandmaster, Broodmother, Archbishop, Countess, Fetid, already-phase-2, or sibling leftover payloads", () => {
    const ready = gateReady();
    assert.equal(
      executeWeepingPawnPhaseGateHp({
        ...ready,
        alreadyPhase2: true,
      }),
      null,
      "already-phase-2 does not re-apply ×2.0 full-heal",
    );
    assert.equal(
      resolveWeepingPawnPhaseGate({
        bossId: "lord_of_static",
        hp: WEEPING_PAWN_PHASE_GATE_HP_AT_GUIDE,
        maxHp: WEEPING_PAWN_PHASE_GATE_HP,
        alreadyPhase2: false,
      }),
      null,
      "Static ×1.5 40% of 340 is owned #1342",
    );
    assert.equal(
      executeWeepingPawnPhaseGateHp({
        ...ready,
        bossId: "bone_cavalier",
      }),
      null,
      "Cavalier ×1.6 50% of 320 is owned #1337/#1338",
    );
    assert.equal(
      executeWeepingPawnPhaseGateHp({
        ...ready,
        bossId: "void_grandmaster",
      }),
      null,
      "Grandmaster ×1.3 60% of 300 is owned #1336",
    );
    assert.equal(
      executeWeepingPawnPhaseGateHp({
        ...ready,
        bossId: "broodmother_rook",
      }),
      null,
      "Broodmother ×1.4 50% of 480 is owned #1333",
    );
    assert.equal(
      executeWeepingPawnPhaseGateHp({
        ...ready,
        bossId: "pale_archbishop",
      }),
      null,
      "Archbishop ×1.4 50% of 350 is owned #1332",
    );
    assert.equal(
      executeWeepingPawnPhaseGateHp({
        ...ready,
        bossId: "crimson_countess",
      }),
      null,
      "Countess ×1.5 40% of 400 is owned #1329",
    );
    assert.equal(
      executeWeepingPawnPhaseGateHp({
        ...ready,
        bossId: "fetid_rook",
      }),
      null,
      "Fetid Split 40% gate is owned #1325",
    );
    assert.equal(
      executeWeepingPawnPhaseGateHp({
        ...ready,
        bossId: "midnight_bishop",
      }),
      null,
      "Midnight Bishop MERGE 25% leftover is not this Weeping gate",
    );
    assert.equal(
      executeWeepingPawnPhaseGateHp({
        ...ready,
        bossId: "starborn_queen",
      }),
      null,
      "Starborn Queen VOID 50% leftover is not this Weeping gate",
    );
    assert.equal(
      executeWeepingPawnPhaseGateHp({
        ...ready,
        bossId: "eternal_pawn_king",
      }),
      null,
      "Eternal Pawn King AP_DRAIN leftover is not this Weeping gate",
    );
    assert.equal(
      executeWeepingPawnPhaseGateHp({
        ...ready,
        bossId: "alabaster_fortress",
      }),
      null,
      "Alabaster Fortress BOARD_SHRINK leftover is not this Weeping gate",
    );
    assert.equal(
      executeWeepingPawnPhaseGateHp({
        ...ready,
        bossId: "final_pawn",
      }),
      null,
      "Final Pawn HP≤10% GHOST leftover of #1247",
    );

    const crit = executeWeepingPawnPhaseGateHp(ready);
    assert.ok(crit);
    assert.equal("atk" in crit, false, "base atk 25 leftover stays unrestored");
    assert.equal("ap" in crit, false);
    assert.equal("res" in crit, false);
    assert.equal("chc" in crit, false, "#1104 owns boss kit CHC");
    assert.equal("chain" in crit, false, "#1342 owns Static CHAIN");
    assert.equal("shock" in crit, false, "#1342 owns Static SHOCK leftover");
    assert.equal("blast" in crit, false);
    assert.equal("haste" in crit, false);
    assert.equal("frost" in crit, false);
    assert.equal("expose" in crit, false);
    assert.equal("spike" in crit, false, "#1337 owns Cavalier SPIKE");
    assert.equal("jump" in crit, false, "#1337 owns Cavalier jump leftover");
    assert.equal("strike" in crit, false, "kit-first physical_attack leftover");
    assert.equal("illusion" in crit, false, "#1336 owns Grandmaster ILLUSION");
    assert.equal("copies" in crit, false, "#914 owns illusion occupancy");
    assert.equal("swap" in crit, false, "#1339 owns kit Swap execute");
    assert.equal("teleport" in crit, false, "#1336 owns Grandmaster teleport");
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
    assert.equal(
      "promote" in crit,
      false,
      "PROMOTE_QUEEN occupancy leftover stays unrestored",
    );
    assert.equal("merge" in crit, false, "Bishop MERGE leftover");
    assert.equal("void" in crit, false, "Queen VOID leftover");
    assert.equal("drain" in crit, false, "Eternal AP_DRAIN leftover");
    assert.equal("lines" in crit, false, "ATTACK_ALL_LINES leftover");
    assert.equal("slow" in crit, false, "phase-2 kit first-id leftover");
    assert.equal("iron" in crit, false, "#1339 owns kit Iron Skin");
    assert.equal("rally" in crit, false);
    assert.equal(WEEPING_PAWN_PHASE_GATE_ABILITY, "PROMOTE_QUEEN");
    assert.equal(WEEPING_PAWN_PHASE_GATE_LINES_LEFTOVER, "ATTACK_ALL_LINES");
    assert.equal(WEEPING_PAWN_PHASE_GATE_KIT_FIRST, "physical_attack");
    assert.equal(WEEPING_PAWN_PHASE_GATE_KIT_PHASE2, "spell-slow");
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
    assert.equal(body.includes("resolveWeepingPawnPhaseGate"), false);
    assert.equal(body.includes("executeWeepingPawnPhaseGateHp"), false);

    const promote = src.slice(
      src.indexOf("function applyPromoteQueen("),
      src.indexOf("function applyAttackAllLines("),
    );
    assert.ok(promote.includes("currentPhase: 2"));
    assert.ok(promote.includes("phase2Triggered: true"));
    assert.ok(promote.includes("Weeping Queen"));
  });

  it("decideWeepingPawnAction still kit-first then 0.3 PROMOTE", () => {
    const src = readFileSync(join(here(), "../hooks/useBossAI.ts"), "utf8");
    const start = src.indexOf("export const decideWeepingPawnAction");
    const end = src.indexOf("export const decideStarbornQueenAction");
    assert.ok(start >= 0 && end > start, "Weeping decide is present");
    const body = src.slice(start, end);
    const kitIdx = body.indexOf("pickBossKitSpell");
    const promoteIdx = body.indexOf("BossAbility.PROMOTE_QUEEN");
    assert.ok(kitIdx >= 0, "kit pick is present");
    assert.ok(promoteIdx >= 0, "PROMOTE_QUEEN is present");
    assert.ok(kitIdx < promoteIdx, "kit still wins the promote turn");
    assert.ok(body.includes("boss.hp / boss.maxHp <= 0.3"));
    assert.ok(body.includes("new Map<string, number>()"));
    assert.equal(
      body.includes("bossState.currentPhase === 2"),
      false,
      "Weeping promote is the 0.3 hp frac, not currentPhase 2",
    );
    assert.equal(body.includes("resolveWeepingPawnPhaseGate"), false);
    assert.equal(body.includes("executeWeepingPawnPhaseGateHp"), false);
    assert.equal(body.includes("phase1.hpThreshold"), false);
  });

  it("WorldExploration still full-heals Weeping only after checkPhaseTransition", () => {
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
    assert.ok(wx.includes('currentBossConfig.id === "weeping_pawn"'));
    assert.ok(
      wx.includes(
        "The Weeping Pawn PROMOTES to the Weeping Queen — FULL HP RESTORED!",
      ),
    );
    assert.equal(wx.includes("resolveWeepingPawnPhaseGate"), false);
    assert.equal(wx.includes("executeWeepingPawnPhaseGateHp"), false);
    assert.equal(
      wx.includes("config.phase1.hpThreshold"),
      false,
      "WX still never substitutes the advertised 30% card",
    );
  });

  it("Boss Guide still advertises PROMOTE_QUEEN at phase1 30%", () => {
    const guide = readFileSync(
      join(here(), "../components/BossGuideModal.tsx"),
      "utf8",
    );
    assert.ok(guide.includes(WEEPING_PAWN_PHASE_GATE_GUIDE_NEEDLE));
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
    const weepingKit = kits.slice(
      kits.indexOf("weeping_pawn: {"),
      kits.indexOf("starborn_queen: {"),
    );
    const p1 = weepingKit.slice(weepingKit.indexOf("phase1SpellIds:"));
    assert.ok(p1.includes(`"${WEEPING_PAWN_PHASE_GATE_KIT_FIRST}"`));
    const p2 = weepingKit.slice(weepingKit.indexOf("phase2SpellIds:"));
    assert.ok(p2.includes(`"${WEEPING_PAWN_PHASE_GATE_KIT_PHASE2}"`));
    assert.equal(strike.id, WEEPING_PAWN_PHASE_GATE_KIT_FIRST);
    assert.equal(slow.id, WEEPING_PAWN_PHASE_GATE_KIT_PHASE2);

    const rush = readFileSync(join(here(), "../hooks/useBossRush.ts"), "utf8");
    assert.ok(rush.includes('boss2Id: "weeping_pawn"'));
  });
});
