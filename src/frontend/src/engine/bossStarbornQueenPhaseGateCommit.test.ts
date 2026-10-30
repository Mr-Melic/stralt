/**
 * Combat action parity: Starborn Queen phase 2 never arms at the
 * advertised 50% card because checkPhaseTransition reads
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
  QUEEN_PHASE_GATE_ABILITY,
  QUEEN_PHASE_GATE_ADVERTISED_THRESHOLD,
  QUEEN_PHASE_GATE_GUIDE_NEEDLE,
  QUEEN_PHASE_GATE_HP,
  QUEEN_PHASE_GATE_HP_AFTER,
  QUEEN_PHASE_GATE_HP_AT_GUIDE,
  QUEEN_PHASE_GATE_KIT_FIRST,
  QUEEN_PHASE_GATE_KIT_PHASE2,
  QUEEN_PHASE_GATE_LINES_LEFTOVER,
  QUEEN_PHASE_GATE_LIVE_THRESHOLD,
  QUEEN_PHASE_GATE_LORE_NEEDLE,
  QUEEN_PHASE_GATE_MAX_HP_AFTER,
  QUEEN_PHASE_GATE_STAT_MULT,
  STARBORN_QUEEN_PHASE_GATE_BOSS_ID,
  advertisedQueenPhaseThreshold,
  advertisedQueenPhaseTransitioned,
  canExecuteQueenPhaseGateHp,
  executeQueenPhaseGateHp,
  liveWxQueenPhaseThreshold,
  liveWxQueenPhaseTransitioned,
  liveWxQueenReadsPhase2Threshold,
  queenHpFraction,
  resolveStarbornQueenPhaseGate,
  shouldCommitQueenPhaseGateHp,
  wxAppliesQueenPhaseHpOnceTransitioned,
} from "./bossStarbornQueenPhaseGateCommit.ts";

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
    bossId: overrides?.bossId ?? STARBORN_QUEEN_PHASE_GATE_BOSS_ID,
    hp: overrides?.hp ?? QUEEN_PHASE_GATE_HP_AT_GUIDE,
    maxHp: QUEEN_PHASE_GATE_HP,
    alreadyPhase2: overrides?.alreadyPhase2 ?? false,
  };
}

describe("Starborn Queen advertised 50% phase gate vs live 0.0", () => {
  it("catalog 0.5 / 380 HP / ×1.5 stay distinct from live phase2 0.0 and kit blast", () => {
    const defaults = readFileSync(
      join(here(), "../types/bossDefaults.ts"),
      "utf8",
    );
    const queen = defaults.slice(
      defaults.indexOf('id: "starborn_queen"'),
      defaults.indexOf('id: "fetid_rook"'),
    );
    assert.ok(queen.includes(`id: "${STARBORN_QUEEN_PHASE_GATE_BOSS_ID}"`));
    assert.ok(queen.includes("hp: 380"));
    assert.ok(queen.includes("hpThreshold: 0.5"));
    assert.ok(queen.includes("hpThreshold: 0.0"));
    assert.ok(queen.includes("statMultiplier: 1.5"));
    assert.ok(queen.includes("BossAbility.VOID_TILES"));
    assert.ok(queen.includes("BossAbility.ATTACK_ALL_LINES"));
    assert.ok(queen.includes(QUEEN_PHASE_GATE_LORE_NEEDLE));
    assert.equal(QUEEN_PHASE_GATE_HP, 380);
    assert.equal(QUEEN_PHASE_GATE_ADVERTISED_THRESHOLD, 0.5);
    assert.equal(QUEEN_PHASE_GATE_LIVE_THRESHOLD, 0.0);
    assert.equal(QUEEN_PHASE_GATE_HP_AT_GUIDE, 190);
    assert.equal(380 * 0.5, 190);
    assert.equal(QUEEN_PHASE_GATE_STAT_MULT, 1.5);
    assert.equal(
      queenHpFraction(QUEEN_PHASE_GATE_HP_AT_GUIDE, QUEEN_PHASE_GATE_HP),
      0.5,
    );
    assert.equal(advertisedQueenPhaseThreshold(), 0.5);
    assert.equal(liveWxQueenPhaseThreshold(), 0.0);
    assert.notEqual(
      advertisedQueenPhaseThreshold(),
      liveWxQueenPhaseThreshold(),
    );
    assert.equal(blast.id, QUEEN_PHASE_GATE_KIT_FIRST);
    assert.equal(frost.id, QUEEN_PHASE_GATE_KIT_PHASE2);
    assert.equal(STRIKE_DAMAGE, 10);
    assert.deepEqual(hpAfterBossPhase2(190, 380, 1.5, false), {
      hp: 285,
      maxHp: 570,
    });
    assert.deepEqual(
      hpAfterBossPhase2(190, 380, 1.5, true),
      { hp: 570, maxHp: 570 },
      "Weeping #1343 fullHeal would restore 570/570 — Queen advertised is leftover 285/570",
    );
    assert.equal(QUEEN_PHASE_GATE_HP_AFTER, 285);
    assert.equal(QUEEN_PHASE_GATE_MAX_HP_AFTER, 570);

    const bishop = defaults.slice(
      defaults.indexOf('id: "midnight_bishop"'),
      defaults.indexOf('id: "broodmother_rook"'),
    );
    assert.ok(
      bishop.includes("hp: 360"),
      "Bishop #1345 is ×2.0 at 25% of 360 — this sidecar is Queen 380",
    );
    const weeping = defaults.slice(
      defaults.indexOf('id: "weeping_pawn"'),
      defaults.indexOf('id: "starborn_queen"'),
    );
    assert.ok(
      weeping.includes("hp: 500"),
      "Weeping #1343 is ×2.0 at 30% of 500 with fullHeal — this sidecar is Queen 380",
    );
    const staticBoss = defaults.slice(
      defaults.indexOf('id: "lord_of_static"'),
      defaults.indexOf('id: "final_pawn"'),
    );
    assert.ok(
      staticBoss.includes("hp: 340"),
      "Static #1342 is ×1.5 at 40% of 340 — this sidecar is Queen 380",
    );
    const cavalier = defaults.slice(
      defaults.indexOf('id: "bone_cavalier"'),
      defaults.indexOf('id: "weeping_pawn"'),
    );
    assert.ok(
      cavalier.includes("hp: 320"),
      "Cavalier #1337/#1338 is ×1.6 at 50% of 320 — this sidecar is Queen 380",
    );
    const grandmaster = defaults.slice(
      defaults.indexOf('id: "void_grandmaster"'),
      defaults.indexOf('id: "bone_cavalier"'),
    );
    assert.ok(
      grandmaster.includes("hp: 300"),
      "Grandmaster #1336 is ×1.3 at 60% of 300 — this sidecar is Queen 380",
    );
    const broodmother = defaults.slice(
      defaults.indexOf('id: "broodmother_rook"'),
      defaults.indexOf('id: "lord_of_static"'),
    );
    assert.ok(
      broodmother.includes("hp: 480"),
      "Broodmother #1333 is ×1.4 at 50% of 480 — this sidecar is Queen 380",
    );
    const archbishop = defaults.slice(
      defaults.indexOf('id: "pale_archbishop"'),
      defaults.indexOf('id: "crimson_countess"'),
    );
    assert.ok(
      archbishop.includes("hp: 350"),
      "Archbishop #1332 is ×1.4 at 50% of 350 — this sidecar is Queen 380",
    );
    const countess = defaults.slice(
      defaults.indexOf('id: "crimson_countess"'),
      defaults.indexOf('id: "void_grandmaster"'),
    );
    assert.ok(
      countess.includes("hp: 400"),
      "Countess #1329 is ×1.5 at 40% of 400 — this sidecar is Queen 380",
    );
    assert.ok(
      countess.includes("statMultiplier: 1.5"),
      "Countess shares ×1.5 but not Queen HP 380 / VOID",
    );
    const fetid = defaults.slice(
      defaults.indexOf('id: "fetid_rook"'),
      defaults.indexOf('id: "eternal_pawn_king"'),
    );
    assert.ok(
      fetid.includes("statMultiplier: 1.0"),
      "Fetid #1325 has no ×1.5 HP fire — this sidecar is Queen-only",
    );
  });

  it("live 190/380 does not transition; advertised 50% does", () => {
    const atGuide = {
      hp: QUEEN_PHASE_GATE_HP_AT_GUIDE,
      maxHp: QUEEN_PHASE_GATE_HP,
      alreadyPhase2: false,
    };
    assert.equal(liveWxQueenPhaseTransitioned(atGuide), false);
    assert.equal(advertisedQueenPhaseTransitioned(atGuide), true);
    assert.equal(resolveStarbornQueenPhaseGate(atGuide), 2);
    assert.equal(liveWxQueenReadsPhase2Threshold(), true);
    assert.equal(wxAppliesQueenPhaseHpOnceTransitioned(), true);

    const above = {
      hp: QUEEN_PHASE_GATE_HP_AT_GUIDE + 1,
      maxHp: QUEEN_PHASE_GATE_HP,
      alreadyPhase2: false,
    };
    assert.equal(advertisedQueenPhaseTransitioned(above), false);
    assert.equal(liveWxQueenPhaseTransitioned(above), false);
    assert.equal(resolveStarbornQueenPhaseGate(above), null);
    assert.equal(executeQueenPhaseGateHp(gateReady({ hp: 191 })), null);

    const dying = {
      hp: 1,
      maxHp: QUEEN_PHASE_GATE_HP,
      alreadyPhase2: false,
    };
    assert.equal(
      liveWxQueenPhaseTransitioned(dying),
      false,
      "live 0.0 still refuses a 1 HP Queen — only hp 0 satisfies it",
    );
    assert.equal(advertisedQueenPhaseTransitioned(dying), true);
    assert.equal(
      liveWxQueenPhaseTransitioned({
        hp: 0,
        maxHp: QUEEN_PHASE_GATE_HP,
        alreadyPhase2: false,
      }),
      true,
      "live only arms when the Queen is already dead",
    );
  });
});

describe("player-visible Starborn Queen HP after advertised 50% ×1.5", () => {
  it("commits 285/570; live 0.0 leaves 190/380", () => {
    const ready = gateReady();
    const decided = shouldCommitQueenPhaseGateHp(ready);
    const executable = canExecuteQueenPhaseGateHp(ready);
    assert.equal(decided, true);
    assert.equal(executable, true);

    const next = executeQueenPhaseGateHp(ready);
    assert.deepEqual(next, {
      phase: 2,
      hp: 285,
      maxHp: 570,
    });
    assert.equal(
      liveWxQueenPhaseTransitioned({
        hp: ready.hp,
        maxHp: ready.maxHp,
        alreadyPhase2: false,
      }),
      false,
    );
  });

  it("10 HP Queen: advertised 50% already armed so ×1.5 still commits", () => {
    const ready = gateReady({ hp: 10 });
    const next = executeQueenPhaseGateHp(ready);
    assert.deepEqual(next, {
      phase: 2,
      hp: 15,
      maxHp: 570,
    });
    assert.equal(
      liveWxQueenPhaseTransitioned({
        hp: 10,
        maxHp: QUEEN_PHASE_GATE_HP,
        alreadyPhase2: false,
      }),
      false,
    );
    assert.deepEqual(hpAfterBossPhase2(10, 380, 1.5, false), {
      hp: 15,
      maxHp: 570,
    });
    assert.deepEqual(
      hpAfterBossPhase2(10, 340, 1.5, false),
      { hp: 15, maxHp: 510 },
      "Static #1342 10 HP ×1.5 is 15/510 — not this Queen 15/570",
    );

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
      "live 0.0 never arms, so Strike 10 kills the 10 HP queen",
    );
  });

  it("cannot stamp Bishop, Weeping, Static, Cavalier, Grandmaster, Broodmother, Archbishop, Countess, Fetid, already-phase-2, or sibling leftover payloads", () => {
    const ready = gateReady();
    assert.equal(
      executeQueenPhaseGateHp({
        ...ready,
        alreadyPhase2: true,
      }),
      null,
      "already-phase-2 does not re-apply ×1.5",
    );
    assert.equal(
      resolveStarbornQueenPhaseGate({
        bossId: "midnight_bishop",
        hp: QUEEN_PHASE_GATE_HP_AT_GUIDE,
        maxHp: QUEEN_PHASE_GATE_HP,
        alreadyPhase2: false,
      }),
      null,
      "Bishop ×2.0 25% of 360 is owned #1345",
    );
    assert.equal(
      executeQueenPhaseGateHp({
        ...ready,
        bossId: "weeping_pawn",
      }),
      null,
      "Weeping ×2.0 30% fullHeal of 500 is owned #1343",
    );
    assert.equal(
      executeQueenPhaseGateHp({
        ...ready,
        bossId: "lord_of_static",
      }),
      null,
      "Static ×1.5 40% of 340 is owned #1342",
    );
    assert.equal(
      executeQueenPhaseGateHp({
        ...ready,
        bossId: "bone_cavalier",
      }),
      null,
      "Cavalier ×1.6 50% of 320 is owned #1337/#1338",
    );
    assert.equal(
      executeQueenPhaseGateHp({
        ...ready,
        bossId: "void_grandmaster",
      }),
      null,
      "Grandmaster ×1.3 60% of 300 is owned #1336",
    );
    assert.equal(
      executeQueenPhaseGateHp({
        ...ready,
        bossId: "broodmother_rook",
      }),
      null,
      "Broodmother ×1.4 50% of 480 is owned #1333",
    );
    assert.equal(
      executeQueenPhaseGateHp({
        ...ready,
        bossId: "pale_archbishop",
      }),
      null,
      "Archbishop ×1.4 50% of 350 is owned #1332",
    );
    assert.equal(
      executeQueenPhaseGateHp({
        ...ready,
        bossId: "crimson_countess",
      }),
      null,
      "Countess ×1.5 40% of 400 is owned #1329 — not Queen 380 / VOID",
    );
    assert.equal(
      executeQueenPhaseGateHp({
        ...ready,
        bossId: "fetid_rook",
      }),
      null,
      "Fetid Split 40% gate is owned #1325",
    );
    assert.equal(
      executeQueenPhaseGateHp({
        ...ready,
        bossId: "eternal_pawn_king",
      }),
      null,
      "Eternal Pawn King AP_DRAIN leftover is not this Queen gate",
    );
    assert.equal(
      executeQueenPhaseGateHp({
        ...ready,
        bossId: "alabaster_fortress",
      }),
      null,
      "Alabaster Fortress BOARD_SHRINK leftover is not this Queen gate",
    );
    assert.equal(
      executeQueenPhaseGateHp({
        ...ready,
        bossId: "mirror_sovereign",
      }),
      null,
      "Mirror Sovereign COMBO 50% ×1.5 of 250 leftover is not this Queen 380",
    );
    assert.equal(
      executeQueenPhaseGateHp({
        ...ready,
        bossId: "final_pawn",
      }),
      null,
      "Final Pawn HP≤10% GHOST leftover of #1247",
    );

    const crit = executeQueenPhaseGateHp(ready);
    assert.ok(crit);
    assert.equal("atk" in crit, false, "base atk 38 leftover stays unrestored");
    assert.equal("ap" in crit, false);
    assert.equal("res" in crit, false);
    assert.equal("chc" in crit, false, "#1104 owns boss kit CHC");
    assert.equal(
      "void" in crit,
      false,
      "VOID_TILES occupancy leftover stays unrestored",
    );
    assert.equal(
      "lines" in crit,
      false,
      "ATTACK_ALL_LINES leftover already kit-latent in phase 1",
    );
    assert.equal("blast" in crit, false, "kit-first starter-blast leftover");
    assert.equal("frost" in crit, false, "phase-2 kit extra leftover");
    assert.equal("mark" in crit, false);
    assert.equal("veil" in crit, false);
    assert.equal("chain" in crit, false, "#1342 owns Static CHAIN");
    assert.equal("shock" in crit, false, "#1342 owns Static SHOCK leftover");
    assert.equal("spike" in crit, false, "#1337 owns Cavalier SPIKE");
    assert.equal("jump" in crit, false, "#1337 owns Cavalier jump leftover");
    assert.equal("illusion" in crit, false, "#1336 owns Grandmaster ILLUSION");
    assert.equal("copies" in crit, false, "#914 owns illusion occupancy");
    assert.equal("swap" in crit, false, "#1339 / #850 own kit Swap");
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
    assert.equal("promote" in crit, false, "#1343 owns Weeping PROMOTE");
    assert.equal("merge" in crit, false, "#1345 owns Bishop MERGE");
    assert.equal("drain" in crit, false, "Eternal AP_DRAIN leftover");
    assert.equal("heal" in crit, false, "#1343 owns Weeping fullHeal");
    assert.equal("iron" in crit, false, "#1339 owns kit Iron Skin");
    assert.equal("rally" in crit, false);
    assert.equal(QUEEN_PHASE_GATE_ABILITY, "VOID_TILES");
    assert.equal(QUEEN_PHASE_GATE_LINES_LEFTOVER, "ATTACK_ALL_LINES");
    assert.equal(QUEEN_PHASE_GATE_KIT_FIRST, "starter-blast");
    assert.equal(QUEEN_PHASE_GATE_KIT_PHASE2, "spell-frost-nova");
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
    assert.equal(body.includes("resolveStarbornQueenPhaseGate"), false);
    assert.equal(body.includes("executeQueenPhaseGateHp"), false);

    const voidTiles = src.slice(
      src.indexOf("function applyVoidTiles("),
      src.indexOf("function applyCompoundingRot("),
    );
    assert.ok(voidTiles.includes('type: "void" as const'));
    assert.ok(voidTiles.includes("Place 4 void tiles"));
  });

  it("decideStarbornQueenAction still requires currentPhase 2 after kit first-id", () => {
    const src = readFileSync(join(here(), "../hooks/useBossAI.ts"), "utf8");
    const start = src.indexOf("export const decideStarbornQueenAction");
    const end = src.indexOf("export const decideFetidRookAction");
    assert.ok(start >= 0 && end > start, "Queen decide is present");
    const body = src.slice(start, end);
    const kitIdx = body.indexOf("pickBossKitSpell");
    const voidIdx = body.indexOf("BossAbility.VOID_TILES");
    assert.ok(kitIdx >= 0, "kit pick is present");
    assert.ok(voidIdx >= 0, "VOID_TILES is present");
    assert.ok(kitIdx < voidIdx, "kit still wins the void turn");
    assert.ok(body.includes("bossState.currentPhase === 2"));
    assert.ok(body.includes("new Map<string, number>()"));
    assert.equal(body.includes("resolveStarbornQueenPhaseGate"), false);
    assert.equal(body.includes("executeQueenPhaseGateHp"), false);
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
    assert.ok(
      wx.includes('currentBossConfig.id === "weeping_pawn"'),
      "WX still special-cases Weeping fullHeal — Queen stays false",
    );
    assert.ok(wx.includes("isWeepingPawn"));
    assert.equal(wx.includes("resolveStarbornQueenPhaseGate"), false);
    assert.equal(wx.includes("executeQueenPhaseGateHp"), false);
    assert.equal(
      wx.includes("config.phase1.hpThreshold"),
      false,
      "WX still never substitutes the advertised 50% card",
    );
  });

  it("Boss Guide still advertises VOID_TILES at phase1 50%", () => {
    const guide = readFileSync(
      join(here(), "../components/BossGuideModal.tsx"),
      "utf8",
    );
    assert.ok(guide.includes(QUEEN_PHASE_GATE_GUIDE_NEEDLE));
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
    const queenKit = kits.slice(
      kits.indexOf("starborn_queen: {"),
      kits.indexOf("fetid_rook: {"),
    );
    const p1 = queenKit.slice(queenKit.indexOf("phase1SpellIds:"));
    assert.ok(p1.includes(`"${QUEEN_PHASE_GATE_KIT_FIRST}"`));
    const p2 = queenKit.slice(queenKit.indexOf("phase2SpellIds:"));
    assert.ok(p2.includes(`"${QUEEN_PHASE_GATE_KIT_FIRST}"`));
    assert.ok(p2.includes(`"${QUEEN_PHASE_GATE_KIT_PHASE2}"`));
    assert.equal(blast.id, QUEEN_PHASE_GATE_KIT_FIRST);
    assert.equal(frost.id, QUEEN_PHASE_GATE_KIT_PHASE2);

    const rush = readFileSync(join(here(), "../hooks/useBossRush.ts"), "utf8");
    assert.ok(rush.includes('boss1Id: "starborn_queen"'));
  });
});
