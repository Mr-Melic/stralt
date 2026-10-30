/**
 * Combat action parity: Lord of Static phase 2 never arms at the
 * advertised 40% card because checkPhaseTransition reads
 * phase2.hpThreshold 0.0, so the ×1.5 HP commit never runs.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { starterSpells } from "../data/spellData.ts";
import { hpAfterBossPhase2, shouldAwardVictory } from "./battleSetup.ts";
import {
  LORD_OF_STATIC_PHASE_GATE_BOSS_ID,
  STATIC_PHASE_GATE_ABILITY,
  STATIC_PHASE_GATE_ADVERTISED_THRESHOLD,
  STATIC_PHASE_GATE_GUIDE_NEEDLE,
  STATIC_PHASE_GATE_HP,
  STATIC_PHASE_GATE_HP_AFTER,
  STATIC_PHASE_GATE_HP_AT_GUIDE,
  STATIC_PHASE_GATE_KIT_FIRST,
  STATIC_PHASE_GATE_KIT_PHASE2,
  STATIC_PHASE_GATE_LIVE_THRESHOLD,
  STATIC_PHASE_GATE_LORE_NEEDLE,
  STATIC_PHASE_GATE_MAX_HP_AFTER,
  STATIC_PHASE_GATE_SHOCK_LEFTOVER,
  STATIC_PHASE_GATE_STAT_MULT,
  advertisedStaticPhaseThreshold,
  advertisedStaticPhaseTransitioned,
  canExecuteStaticPhaseGateHp,
  executeStaticPhaseGateHp,
  liveWxStaticPhaseThreshold,
  liveWxStaticPhaseTransitioned,
  liveWxStaticReadsPhase2Threshold,
  resolveLordOfStaticPhaseGate,
  shouldCommitStaticPhaseGateHp,
  staticHpFraction,
  wxAppliesStaticPhaseHpOnceTransitioned,
} from "./bossStaticPhaseGateCommit.ts";

const strike = starterSpells.find((s) => s.id === "physical_attack");
assert.ok(strike, "physical_attack");
const blast = starterSpells.find((s) => s.id === "starter-blast");
assert.ok(blast, "starter-blast");
const frost = starterSpells.find((s) => s.id === "spell-frost-nova");
assert.ok(frost, "spell-frost-nova");

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
    bossId: overrides?.bossId ?? LORD_OF_STATIC_PHASE_GATE_BOSS_ID,
    hp: overrides?.hp ?? STATIC_PHASE_GATE_HP_AT_GUIDE,
    maxHp: STATIC_PHASE_GATE_HP,
    alreadyPhase2: overrides?.alreadyPhase2 ?? false,
  };
}

describe("Lord of Static advertised 40% phase gate vs live 0.0", () => {
  it("catalog 0.4 / 340 HP / ×1.5 stay distinct from live phase2 0.0 and kit blast", () => {
    const defaults = readFileSync(
      join(here(), "../types/bossDefaults.ts"),
      "utf8",
    );
    const staticBoss = defaults.slice(
      defaults.indexOf('id: "lord_of_static"'),
      defaults.indexOf('id: "final_pawn"'),
    );
    assert.ok(
      staticBoss.includes(`id: "${LORD_OF_STATIC_PHASE_GATE_BOSS_ID}"`),
    );
    assert.ok(staticBoss.includes("hp: 340"));
    assert.ok(staticBoss.includes("hpThreshold: 0.4"));
    assert.ok(staticBoss.includes("hpThreshold: 0.0"));
    assert.ok(staticBoss.includes("statMultiplier: 1.5"));
    assert.ok(staticBoss.includes("BossAbility.CHAIN_LIGHTNING"));
    assert.ok(staticBoss.includes("BossAbility.SHOCK_TILES"));
    assert.ok(staticBoss.includes(STATIC_PHASE_GATE_LORE_NEEDLE));
    assert.equal(STATIC_PHASE_GATE_HP, 340);
    assert.equal(STATIC_PHASE_GATE_ADVERTISED_THRESHOLD, 0.4);
    assert.equal(STATIC_PHASE_GATE_LIVE_THRESHOLD, 0.0);
    assert.equal(STATIC_PHASE_GATE_HP_AT_GUIDE, 136);
    assert.equal(340 * 0.4, 136);
    assert.equal(STATIC_PHASE_GATE_STAT_MULT, 1.5);
    assert.equal(
      staticHpFraction(STATIC_PHASE_GATE_HP_AT_GUIDE, STATIC_PHASE_GATE_HP),
      0.4,
    );
    assert.equal(advertisedStaticPhaseThreshold(), 0.4);
    assert.equal(liveWxStaticPhaseThreshold(), 0.0);
    assert.notEqual(
      advertisedStaticPhaseThreshold(),
      liveWxStaticPhaseThreshold(),
    );
    assert.equal(blast.id, STATIC_PHASE_GATE_KIT_FIRST);
    assert.equal(frost.id, STATIC_PHASE_GATE_KIT_PHASE2);
    assert.equal(STRIKE_DAMAGE, 10);
    assert.deepEqual(hpAfterBossPhase2(136, 340, 1.5, false), {
      hp: 204,
      maxHp: 510,
    });
    assert.equal(STATIC_PHASE_GATE_HP_AFTER, 204);
    assert.equal(STATIC_PHASE_GATE_MAX_HP_AFTER, 510);

    const cavalier = defaults.slice(
      defaults.indexOf('id: "bone_cavalier"'),
      defaults.indexOf('id: "weeping_pawn"'),
    );
    assert.ok(
      cavalier.includes("hp: 320"),
      "Cavalier #1337/#1338 is ×1.6 at 50% of 320 — this sidecar is Static 340",
    );
    const grandmaster = defaults.slice(
      defaults.indexOf('id: "void_grandmaster"'),
      defaults.indexOf('id: "bone_cavalier"'),
    );
    assert.ok(
      grandmaster.includes("hp: 300"),
      "Grandmaster #1336 is ×1.3 at 60% of 300 — this sidecar is Static 340",
    );
    const broodmother = defaults.slice(
      defaults.indexOf('id: "broodmother_rook"'),
      defaults.indexOf('id: "lord_of_static"'),
    );
    assert.ok(
      broodmother.includes("hp: 480"),
      "Broodmother #1333 is ×1.4 at 50% of 480 — this sidecar is Static 340",
    );
    const archbishop = defaults.slice(
      defaults.indexOf('id: "pale_archbishop"'),
      defaults.indexOf('id: "crimson_countess"'),
    );
    assert.ok(
      archbishop.includes("hp: 350"),
      "Archbishop #1332 is ×1.4 at 50% of 350 — this sidecar is Static 340",
    );
    const countess = defaults.slice(
      defaults.indexOf('id: "crimson_countess"'),
      defaults.indexOf('id: "void_grandmaster"'),
    );
    assert.ok(
      countess.includes("hp: 400"),
      "Countess #1329 is ×1.5 at 40% of 400 — this sidecar is Static 340",
    );
    assert.ok(
      countess.includes("statMultiplier: 1.5"),
      "Countess shares ×1.5 / 40% but not Static HP 340 / CHAIN",
    );
    const fetid = defaults.slice(
      defaults.indexOf('id: "fetid_rook"'),
      defaults.indexOf('id: "eternal_pawn_king"'),
    );
    assert.ok(
      fetid.includes("statMultiplier: 1.0"),
      "Fetid #1325 has no ×1.5 HP fire — this sidecar is Static-only",
    );
  });

  it("live 136/340 does not transition; advertised 40% does", () => {
    const atGuide = {
      hp: STATIC_PHASE_GATE_HP_AT_GUIDE,
      maxHp: STATIC_PHASE_GATE_HP,
      alreadyPhase2: false,
    };
    assert.equal(liveWxStaticPhaseTransitioned(atGuide), false);
    assert.equal(advertisedStaticPhaseTransitioned(atGuide), true);
    assert.equal(resolveLordOfStaticPhaseGate(atGuide), 2);
    assert.equal(liveWxStaticReadsPhase2Threshold(), true);
    assert.equal(wxAppliesStaticPhaseHpOnceTransitioned(), true);

    const above = {
      hp: STATIC_PHASE_GATE_HP_AT_GUIDE + 1,
      maxHp: STATIC_PHASE_GATE_HP,
      alreadyPhase2: false,
    };
    assert.equal(advertisedStaticPhaseTransitioned(above), false);
    assert.equal(liveWxStaticPhaseTransitioned(above), false);
    assert.equal(resolveLordOfStaticPhaseGate(above), null);
    assert.equal(executeStaticPhaseGateHp(gateReady({ hp: 137 })), null);

    const dying = {
      hp: 1,
      maxHp: STATIC_PHASE_GATE_HP,
      alreadyPhase2: false,
    };
    assert.equal(
      liveWxStaticPhaseTransitioned(dying),
      false,
      "live 0.0 still refuses a 1 HP Static — only hp 0 satisfies it",
    );
    assert.equal(advertisedStaticPhaseTransitioned(dying), true);
    assert.equal(
      liveWxStaticPhaseTransitioned({
        hp: 0,
        maxHp: STATIC_PHASE_GATE_HP,
        alreadyPhase2: false,
      }),
      true,
      "live only arms when Static is already dead",
    );
  });
});

describe("player-visible Static HP after advertised 40% ×1.5", () => {
  it("commits 204/510; live 0.0 leaves 136/340", () => {
    const ready = gateReady();
    const decided = shouldCommitStaticPhaseGateHp(ready);
    const executable = canExecuteStaticPhaseGateHp(ready);
    assert.equal(decided, true);
    assert.equal(executable, true);

    const next = executeStaticPhaseGateHp(ready);
    assert.deepEqual(next, {
      phase: 2,
      hp: 204,
      maxHp: 510,
    });
    assert.equal(
      liveWxStaticPhaseTransitioned({
        hp: ready.hp,
        maxHp: ready.maxHp,
        alreadyPhase2: false,
      }),
      false,
    );
  });

  it("10 HP Static: advertised 40% already armed so ×1.5 still commits", () => {
    const ready = gateReady({ hp: 10 });
    const next = executeStaticPhaseGateHp(ready);
    assert.deepEqual(next, {
      phase: 2,
      hp: 15,
      maxHp: 510,
    });
    assert.equal(
      liveWxStaticPhaseTransitioned({
        hp: 10,
        maxHp: STATIC_PHASE_GATE_HP,
        alreadyPhase2: false,
      }),
      false,
    );
    assert.deepEqual(hpAfterBossPhase2(10, 340, 1.5, false), {
      hp: 15,
      maxHp: 510,
    });

    const advertisedAfterStrike = (next?.hp ?? 0) - STRIKE_DAMAGE;
    assert.equal(advertisedAfterStrike, 5);
    assert.equal(
      shouldAwardVictory({
        inBattle: true,
        deathTriggered: false,
        battleStartIdsSize: 1,
        hostilesRemaining: advertisedAfterStrike > 0 ? 1 : 0,
      }),
      false,
      "advertised ×1.5 leaves 5 HP after Strike 10",
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

  it("cannot stamp Cavalier, Grandmaster, Broodmother, Archbishop, Countess, Fetid, already-phase-2, or sibling leftover payloads", () => {
    const ready = gateReady();
    assert.equal(
      executeStaticPhaseGateHp({
        ...ready,
        alreadyPhase2: true,
      }),
      null,
      "already-phase-2 does not re-apply ×1.5",
    );
    assert.equal(
      resolveLordOfStaticPhaseGate({
        bossId: "bone_cavalier",
        hp: STATIC_PHASE_GATE_HP_AT_GUIDE,
        maxHp: STATIC_PHASE_GATE_HP,
        alreadyPhase2: false,
      }),
      null,
      "Cavalier ×1.6 50% of 320 is owned #1337/#1338",
    );
    assert.equal(
      executeStaticPhaseGateHp({
        ...ready,
        bossId: "void_grandmaster",
      }),
      null,
      "Grandmaster ×1.3 60% of 300 is owned #1336",
    );
    assert.equal(
      executeStaticPhaseGateHp({
        ...ready,
        bossId: "broodmother_rook",
      }),
      null,
      "Broodmother ×1.4 50% of 480 is owned #1333",
    );
    assert.equal(
      executeStaticPhaseGateHp({
        ...ready,
        bossId: "pale_archbishop",
      }),
      null,
      "Archbishop ×1.4 50% of 350 is owned #1332",
    );
    assert.equal(
      executeStaticPhaseGateHp({
        ...ready,
        bossId: "crimson_countess",
      }),
      null,
      "Countess ×1.5 40% of 400 is owned #1329 — not Static 340 / CHAIN",
    );
    assert.equal(
      executeStaticPhaseGateHp({
        ...ready,
        bossId: "fetid_rook",
      }),
      null,
      "Fetid Split 40% gate is owned #1325",
    );
    assert.equal(
      executeStaticPhaseGateHp({
        ...ready,
        bossId: "weeping_pawn",
      }),
      null,
      "Weeping Pawn PROMOTE 30% leftover is not this Static gate",
    );
    assert.equal(
      executeStaticPhaseGateHp({
        ...ready,
        bossId: "midnight_bishop",
      }),
      null,
      "Midnight Bishop MERGE 25% leftover is not this Static gate",
    );
    assert.equal(
      executeStaticPhaseGateHp({
        ...ready,
        bossId: "starborn_queen",
      }),
      null,
      "Starborn Queen VOID 50% leftover is not this Static gate",
    );
    assert.equal(
      executeStaticPhaseGateHp({
        ...ready,
        bossId: "final_pawn",
      }),
      null,
      "Final Pawn HP≤10% GHOST leftover of #1247",
    );

    const crit = executeStaticPhaseGateHp(ready);
    assert.ok(crit);
    assert.equal("atk" in crit, false, "base atk 35 leftover stays unrestored");
    assert.equal("ap" in crit, false);
    assert.equal("res" in crit, false);
    assert.equal("chc" in crit, false, "#1104 owns boss kit CHC");
    assert.equal(
      "chain" in crit,
      false,
      "CHAIN_LIGHTNING occupancy leftover stays unrestored",
    );
    assert.equal(
      "shock" in crit,
      false,
      "SHOCK_TILES leftover already runs in phase 1",
    );
    assert.equal("blast" in crit, false, "kit-first starter-blast leftover");
    assert.equal("haste" in crit, false);
    assert.equal("frost" in crit, false, "phase-2 kit extra leftover");
    assert.equal("expose" in crit, false);
    assert.equal("spike" in crit, false, "#1337 owns Cavalier SPIKE");
    assert.equal("jump" in crit, false, "#1337 owns Cavalier jump leftover");
    assert.equal("strike" in crit, false);
    assert.equal("illusion" in crit, false, "#1336 owns Grandmaster ILLUSION");
    assert.equal("copies" in crit, false, "#914 owns illusion occupancy");
    assert.equal("swap" in crit, false, "#850 owns kit Swap execute");
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
    assert.equal("promote" in crit, false, "Weeping PROMOTE leftover");
    assert.equal("merge" in crit, false, "Bishop MERGE leftover");
    assert.equal("void" in crit, false, "Queen VOID leftover");
    assert.equal("drain" in crit, false, "Eternal AP_DRAIN leftover");
    assert.equal(STATIC_PHASE_GATE_ABILITY, "CHAIN_LIGHTNING");
    assert.equal(STATIC_PHASE_GATE_SHOCK_LEFTOVER, "SHOCK_TILES");
    assert.equal(STATIC_PHASE_GATE_KIT_FIRST, "starter-blast");
    assert.equal(STATIC_PHASE_GATE_KIT_PHASE2, "spell-frost-nova");
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
    assert.equal(body.includes("resolveLordOfStaticPhaseGate"), false);
    assert.equal(body.includes("executeStaticPhaseGateHp"), false);

    const chain = src.slice(
      src.indexOf("function applyChainLightning("),
      src.indexOf("function applyInvinciblePhase("),
    );
    assert.ok(chain.includes("chainLightningActive: true"));
    assert.ok(chain.includes("const dmg = 8"));
  });

  it("decideLordOfStaticAction still requires currentPhase 2 after kit first-id", () => {
    const src = readFileSync(join(here(), "../hooks/useBossAI.ts"), "utf8");
    const start = src.indexOf("export const decideLordOfStaticAction");
    const end = src.indexOf("export const decideFinalPawnAction");
    assert.ok(start >= 0 && end > start, "Static decide is present");
    const body = src.slice(start, end);
    const kitIdx = body.indexOf("pickBossKitSpell");
    const chainIdx = body.indexOf("BossAbility.CHAIN_LIGHTNING");
    assert.ok(kitIdx >= 0, "kit pick is present");
    assert.ok(chainIdx >= 0, "CHAIN_LIGHTNING is present");
    assert.ok(kitIdx < chainIdx, "kit still wins the chain turn");
    assert.ok(body.includes("bossState.currentPhase === 2"));
    assert.ok(body.includes("new Map<string, number>()"));
    assert.equal(body.includes("resolveLordOfStaticPhaseGate"), false);
    assert.equal(body.includes("executeStaticPhaseGateHp"), false);
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
    assert.equal(wx.includes("resolveLordOfStaticPhaseGate"), false);
    assert.equal(wx.includes("executeStaticPhaseGateHp"), false);
    assert.equal(
      wx.includes("config.phase1.hpThreshold"),
      false,
      "WX still never substitutes the advertised 40% card",
    );
  });

  it("Boss Guide still advertises CHAIN_LIGHTNING at phase1 40%", () => {
    const guide = readFileSync(
      join(here(), "../components/BossGuideModal.tsx"),
      "utf8",
    );
    assert.ok(guide.includes(STATIC_PHASE_GATE_GUIDE_NEEDLE));
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
    const staticKit = kits.slice(
      kits.indexOf("lord_of_static: {"),
      kits.indexOf("final_pawn: {"),
    );
    const p1 = staticKit.slice(staticKit.indexOf("phase1SpellIds:"));
    assert.ok(p1.includes(`"${STATIC_PHASE_GATE_KIT_FIRST}"`));
    const p2 = staticKit.slice(staticKit.indexOf("phase2SpellIds:"));
    assert.ok(p2.includes(`"${STATIC_PHASE_GATE_KIT_FIRST}"`));
    assert.ok(p2.includes(`"${STATIC_PHASE_GATE_KIT_PHASE2}"`));
    assert.equal(blast.id, STATIC_PHASE_GATE_KIT_FIRST);
    assert.equal(frost.id, STATIC_PHASE_GATE_KIT_PHASE2);

    const rush = readFileSync(join(here(), "../hooks/useBossRush.ts"), "utf8");
    assert.ok(rush.includes('boss2Id: "lord_of_static"'));
  });
});
