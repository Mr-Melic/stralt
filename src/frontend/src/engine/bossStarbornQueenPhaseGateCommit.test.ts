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
  STARBORN_QUEEN_PHASE_GATE_ABILITY,
  STARBORN_QUEEN_PHASE_GATE_ADVERTISED_THRESHOLD,
  STARBORN_QUEEN_PHASE_GATE_BOSS_ID,
  STARBORN_QUEEN_PHASE_GATE_GUIDE_NEEDLE,
  STARBORN_QUEEN_PHASE_GATE_HP,
  STARBORN_QUEEN_PHASE_GATE_HP_AFTER,
  STARBORN_QUEEN_PHASE_GATE_HP_AT_GUIDE,
  STARBORN_QUEEN_PHASE_GATE_KIT_FIRST,
  STARBORN_QUEEN_PHASE_GATE_KIT_PHASE2,
  STARBORN_QUEEN_PHASE_GATE_LINES_LEFTOVER,
  STARBORN_QUEEN_PHASE_GATE_LIVE_THRESHOLD,
  STARBORN_QUEEN_PHASE_GATE_LORE_NEEDLE,
  STARBORN_QUEEN_PHASE_GATE_MAX_HP_AFTER,
  STARBORN_QUEEN_PHASE_GATE_STAT_MULT,
  advertisedStarbornQueenPhaseThreshold,
  advertisedStarbornQueenPhaseTransitioned,
  canExecuteStarbornQueenPhaseGateHp,
  executeStarbornQueenPhaseGateHp,
  liveWxStarbornQueenPhaseThreshold,
  liveWxStarbornQueenPhaseTransitioned,
  liveWxStarbornQueenReadsPhase2Threshold,
  resolveStarbornQueenPhaseGate,
  shouldCommitStarbornQueenPhaseGateHp,
  starbornQueenHpFraction,
  wxAppliesStarbornQueenPhaseHpOnceTransitioned,
} from "./bossStarbornQueenPhaseGateCommit.ts";

const strike = starterSpells.find((s) => s.id === "physical_attack");
assert.ok(strike, "physical_attack");
const blast = starterSpells.find((s) => s.id === "starter-blast");
assert.ok(blast, "starter-blast");
const frostNova = starterSpells.find((s) => s.id === "spell-frost-nova");
assert.ok(frostNova, "spell-frost-nova");

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
    hp: overrides?.hp ?? STARBORN_QUEEN_PHASE_GATE_HP_AT_GUIDE,
    maxHp: STARBORN_QUEEN_PHASE_GATE_HP,
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
    assert.ok(queen.includes(STARBORN_QUEEN_PHASE_GATE_LORE_NEEDLE));
    assert.equal(STARBORN_QUEEN_PHASE_GATE_HP, 380);
    assert.equal(STARBORN_QUEEN_PHASE_GATE_ADVERTISED_THRESHOLD, 0.5);
    assert.equal(STARBORN_QUEEN_PHASE_GATE_LIVE_THRESHOLD, 0.0);
    assert.equal(STARBORN_QUEEN_PHASE_GATE_HP_AT_GUIDE, 190);
    assert.equal(380 * 0.5, 190);
    assert.equal(STARBORN_QUEEN_PHASE_GATE_STAT_MULT, 1.5);
    assert.equal(
      starbornQueenHpFraction(
        STARBORN_QUEEN_PHASE_GATE_HP_AT_GUIDE,
        STARBORN_QUEEN_PHASE_GATE_HP,
      ),
      0.5,
    );
    assert.equal(advertisedStarbornQueenPhaseThreshold(), 0.5);
    assert.equal(liveWxStarbornQueenPhaseThreshold(), 0.0);
    assert.notEqual(
      advertisedStarbornQueenPhaseThreshold(),
      liveWxStarbornQueenPhaseThreshold(),
    );
    assert.equal(blast.id, STARBORN_QUEEN_PHASE_GATE_KIT_FIRST);
    assert.equal(frostNova.id, STARBORN_QUEEN_PHASE_GATE_KIT_PHASE2);
    assert.equal(STRIKE_DAMAGE, 10);
    assert.deepEqual(hpAfterBossPhase2(190, 380, 1.5, false), {
      hp: 285,
      maxHp: 570,
    });
    assert.equal(STARBORN_QUEEN_PHASE_GATE_HP_AFTER, 285);
    assert.equal(STARBORN_QUEEN_PHASE_GATE_MAX_HP_AFTER, 570);

    const cavalier = defaults.slice(
      defaults.indexOf('id: "bone_cavalier"'),
      defaults.indexOf('id: "weeping_pawn"'),
    );
    assert.ok(
      cavalier.includes("hp: 320"),
      "Cavalier #1338 is ×1.6 at 50% of 320 — this sidecar is Queen 380",
    );
    const staticBoss = defaults.slice(
      defaults.indexOf('id: "lord_of_static"'),
      defaults.indexOf('id: "final_pawn"'),
    );
    assert.ok(
      staticBoss.includes("hp: 340"),
      "Static #1342 is ×1.5 at 40% of 340 — this sidecar is Queen 380",
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
      countess.includes("statMultiplier: 1.5"),
      "Countess #1329 is ×1.5 at 40% of 400 — this sidecar is Queen-only",
    );
    const weeping = defaults.slice(
      defaults.indexOf('id: "weeping_pawn"'),
      defaults.indexOf('id: "starborn_queen"'),
    );
    assert.ok(
      weeping.includes("hp: 500"),
      "Weeping #1343 is ×2.0 at 30% of 500 — this sidecar is Queen 380",
    );
    const bishop = defaults.slice(
      defaults.indexOf('id: "midnight_bishop"'),
      defaults.indexOf('id: "broodmother_rook"'),
    );
    assert.ok(
      bishop.includes("hp: 360"),
      "Midnight Bishop #1345 is ×2.0 at 25% of 360 — this sidecar is Queen 380",
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
      hp: STARBORN_QUEEN_PHASE_GATE_HP_AT_GUIDE,
      maxHp: STARBORN_QUEEN_PHASE_GATE_HP,
      alreadyPhase2: false,
    };
    assert.equal(liveWxStarbornQueenPhaseTransitioned(atGuide), false);
    assert.equal(advertisedStarbornQueenPhaseTransitioned(atGuide), true);
    assert.equal(resolveStarbornQueenPhaseGate(atGuide), 2);
    assert.equal(liveWxStarbornQueenReadsPhase2Threshold(), true);
    assert.equal(wxAppliesStarbornQueenPhaseHpOnceTransitioned(), true);

    const above = {
      hp: STARBORN_QUEEN_PHASE_GATE_HP_AT_GUIDE + 1,
      maxHp: STARBORN_QUEEN_PHASE_GATE_HP,
      alreadyPhase2: false,
    };
    assert.equal(advertisedStarbornQueenPhaseTransitioned(above), false);
    assert.equal(liveWxStarbornQueenPhaseTransitioned(above), false);
    assert.equal(resolveStarbornQueenPhaseGate(above), null);
    assert.equal(executeStarbornQueenPhaseGateHp(gateReady({ hp: 191 })), null);

    const dying = {
      hp: 1,
      maxHp: STARBORN_QUEEN_PHASE_GATE_HP,
      alreadyPhase2: false,
    };
    assert.equal(
      liveWxStarbornQueenPhaseTransitioned(dying),
      false,
      "live 0.0 still refuses a 1 HP Queen — only hp 0 satisfies it",
    );
    assert.equal(advertisedStarbornQueenPhaseTransitioned(dying), true);
    assert.equal(
      liveWxStarbornQueenPhaseTransitioned({
        hp: 0,
        maxHp: STARBORN_QUEEN_PHASE_GATE_HP,
        alreadyPhase2: false,
      }),
      true,
      "live only arms when the Queen is already dead",
    );
  });
});

describe("player-visible Queen HP after advertised 50% ×1.5", () => {
  it("commits 285/570; live 0.0 leaves 190/380", () => {
    const ready = gateReady();
    const decided = shouldCommitStarbornQueenPhaseGateHp(ready);
    const executable = canExecuteStarbornQueenPhaseGateHp(ready);
    assert.equal(decided, true);
    assert.equal(executable, true);

    const next = executeStarbornQueenPhaseGateHp(ready);
    assert.deepEqual(next, {
      phase: 2,
      hp: 285,
      maxHp: 570,
    });
    assert.equal(
      liveWxStarbornQueenPhaseTransitioned({
        hp: ready.hp,
        maxHp: ready.maxHp,
        alreadyPhase2: false,
      }),
      false,
    );
  });

  it("10 HP Queen: advertised 50% already armed so ×1.5 still commits", () => {
    const ready = gateReady({ hp: 10 });
    const next = executeStarbornQueenPhaseGateHp(ready);
    assert.deepEqual(next, {
      phase: 2,
      hp: 15,
      maxHp: 570,
    });
    assert.equal(
      liveWxStarbornQueenPhaseTransitioned({
        hp: 10,
        maxHp: STARBORN_QUEEN_PHASE_GATE_HP,
        alreadyPhase2: false,
      }),
      false,
    );
    assert.deepEqual(hpAfterBossPhase2(10, 380, 1.5, false), {
      hp: 15,
      maxHp: 570,
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
      "live 0.0 never arms, so Strike 10 kills the 10 HP queen",
    );
  });

  it("cannot stamp sibling leftovers, already-phase-2, or extra payloads", () => {
    const ready = gateReady();
    assert.equal(
      executeStarbornQueenPhaseGateHp({
        ...ready,
        alreadyPhase2: true,
      }),
      null,
      "already-phase-2 does not re-apply ×1.5",
    );
    assert.equal(
      resolveStarbornQueenPhaseGate({
        bossId: "midnight_bishop",
        hp: STARBORN_QUEEN_PHASE_GATE_HP_AT_GUIDE,
        maxHp: STARBORN_QUEEN_PHASE_GATE_HP,
        alreadyPhase2: false,
      }),
      null,
      "Midnight Bishop ×2.0 25% of 360 is owned #1345",
    );
    assert.equal(
      executeStarbornQueenPhaseGateHp({
        ...ready,
        bossId: "weeping_pawn",
      }),
      null,
      "Weeping PROMOTE 30% ×2.0 fullHeal is owned #1343",
    );
    assert.equal(
      executeStarbornQueenPhaseGateHp({
        ...ready,
        bossId: "lord_of_static",
      }),
      null,
      "Static ×1.5 40% of 340 is owned #1342",
    );
    assert.equal(
      executeStarbornQueenPhaseGateHp({
        ...ready,
        bossId: "bone_cavalier",
      }),
      null,
      "Cavalier ×1.6 50% of 320 is owned #1338",
    );
    assert.equal(
      resolveStarbornQueenPhaseGate({
        bossId: "void_grandmaster",
        hp: STARBORN_QUEEN_PHASE_GATE_HP_AT_GUIDE,
        maxHp: STARBORN_QUEEN_PHASE_GATE_HP,
        alreadyPhase2: false,
      }),
      null,
      "Grandmaster ×1.3 60% of 300 is owned #1336",
    );
    assert.equal(
      executeStarbornQueenPhaseGateHp({
        ...ready,
        bossId: "broodmother_rook",
      }),
      null,
      "Broodmother ×1.4 50% of 480 is owned #1333",
    );
    assert.equal(
      executeStarbornQueenPhaseGateHp({
        ...ready,
        bossId: "pale_archbishop",
      }),
      null,
      "Archbishop ×1.4 50% of 350 is owned #1332",
    );
    assert.equal(
      executeStarbornQueenPhaseGateHp({
        ...ready,
        bossId: "crimson_countess",
      }),
      null,
      "Countess ×1.5 40% of 400 is owned #1329",
    );
    assert.equal(
      executeStarbornQueenPhaseGateHp({
        ...ready,
        bossId: "fetid_rook",
      }),
      null,
      "Fetid Split 40% gate is owned #1325",
    );
    assert.equal(
      executeStarbornQueenPhaseGateHp({
        ...ready,
        bossId: "eternal_pawn_king",
      }),
      null,
      "Eternal Pawn King AP_DRAIN leftover is not this Queen gate",
    );
    assert.equal(
      executeStarbornQueenPhaseGateHp({
        ...ready,
        bossId: "alabaster_fortress",
      }),
      null,
      "Alabaster BOARD_SHRINK leftover is not this Queen gate",
    );
    assert.equal(
      executeStarbornQueenPhaseGateHp({
        ...ready,
        bossId: "chessboard_lich",
      }),
      null,
    );
    assert.equal(
      executeStarbornQueenPhaseGateHp({
        ...ready,
        bossId: "mirror_sovereign",
      }),
      null,
    );
    assert.equal(
      executeStarbornQueenPhaseGateHp({
        ...ready,
        bossId: "pale_archivist",
      }),
      null,
    );
    assert.equal(
      executeStarbornQueenPhaseGateHp({
        ...ready,
        bossId: "final_pawn",
      }),
      null,
      "Final Pawn HP≤10% GHOST leftover of #1247",
    );

    const crit = executeStarbornQueenPhaseGateHp(ready);
    assert.ok(crit);
    assert.equal("atk" in crit, false, "base atk 38 leftover stays unrestored");
    assert.equal("ap" in crit, false);
    assert.equal("res" in crit, false);
    assert.equal("chc" in crit, false, "#1104 owns boss kit CHC");
    assert.equal("void" in crit, false, "VOID occupancy leftover of #765");
    assert.equal("lines" in crit, false, "#1022 owns queen-ray minion HP");
    assert.equal("blast" in crit, false, "kit-first starter-blast leftover");
    assert.equal("frost" in crit, false, "kit spell-frost-nova leftover");
    assert.equal("mark" in crit, false, "kit spell-mark leftover");
    assert.equal("veil" in crit, false, "kit spell-shadow-veil leftover");
    assert.equal("chain" in crit, false, "#1342 owns Static CHAIN");
    assert.equal("shock" in crit, false, "#896 owns SHOCK occupancy");
    assert.equal("spike" in crit, false, "#846 owns SPIKE occupancy");
    assert.equal("jump" in crit, false, "#763 owns knight-jump landing tax");
    assert.equal("strike" in crit, false);
    assert.equal("illusion" in crit, false, "#914 owns ILLUSION occupancy");
    assert.equal("copies" in crit, false, "#1336 owns Grandmaster copies");
    assert.equal("swap" in crit, false, "#850 owns kit Swap execute");
    assert.equal("teleport" in crit, false, "#1336 owns TELEPORT leftover");
    assert.equal("split" in crit, false, "#1325 owns Fetid Split");
    assert.equal("twins" in crit, false, "#1325 owns twin occupancy");
    assert.equal("lava" in crit, false, "#1329 owns Countess LAVA_TRAIL");
    assert.equal("inferno" in crit, false, "#1323 owns kit Inferno CD 3");
    assert.equal("reflect" in crit, false, "#1058 owns MAGIC_REFLECT");
    assert.equal("spawn" in crit, false, "#1102 owns SPAWN_MINIONS decide");
    assert.equal("minion" in crit, false, "#1278 / #1331 own skeleton stamps");
    assert.equal("larvae" in crit, false, "#1333 owns Broodmother larvae");
    assert.equal("ghost" in crit, false, "#1247 owns Final Pawn GHOST");
    assert.equal("roll" in crit, false, "#1208 owns Titan 1–5×");
    assert.equal("promote" in crit, false, "#1343 owns Weeping PROMOTE");
    assert.equal("merge" in crit, false, "#1345 owns Midnight MERGE");
    assert.equal("drain" in crit, false, "Eternal Pawn AP_DRAIN leftover");
    assert.equal("heal" in crit, false);
    assert.equal("shrink" in crit, false, "Alabaster BOARD_SHRINK leftover");
    assert.equal("rotate" in crit, false, "#1161 owns MAP_ROTATE crumbs");
    assert.equal("mirror" in crit, false, "Mirror Sovereign leftover");
    assert.equal(STARBORN_QUEEN_PHASE_GATE_ABILITY, "VOID_TILES");
    assert.equal(STARBORN_QUEEN_PHASE_GATE_LINES_LEFTOVER, "ATTACK_ALL_LINES");
    assert.equal(STARBORN_QUEEN_PHASE_GATE_KIT_FIRST, "starter-blast");
    assert.equal(STARBORN_QUEEN_PHASE_GATE_KIT_PHASE2, "spell-frost-nova");
    assert.equal(blast.id, "starter-blast");
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
    assert.equal(body.includes("executeStarbornQueenPhaseGateHp"), false);

    const voids = src.slice(
      src.indexOf("function applyVoidTiles("),
      src.indexOf("function applyCompoundingRot("),
    );
    assert.ok(voids.includes("newVoidTiles: voidTiles"));
    assert.ok(voids.includes("creates"));
    assert.ok(voids.includes("void tiles"));
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
    assert.ok(kitIdx < voidIdx, "kit still wins the void-tile turn");
    assert.ok(body.includes("bossState.currentPhase === 2"));
    assert.ok(body.includes("new Map<string, number>()"));
    assert.equal(body.includes("resolveStarbornQueenPhaseGate"), false);
    assert.equal(body.includes("executeStarbornQueenPhaseGateHp"), false);
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
    assert.equal(wx.includes("resolveStarbornQueenPhaseGate"), false);
    assert.equal(wx.includes("executeStarbornQueenPhaseGateHp"), false);
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
    assert.ok(guide.includes(STARBORN_QUEEN_PHASE_GATE_GUIDE_NEEDLE));
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
    const queen = kits.slice(
      kits.indexOf("starborn_queen: {"),
      kits.indexOf("fetid_rook: {"),
    );
    const p1 = queen.slice(queen.indexOf("phase1SpellIds:"));
    assert.ok(p1.includes(`"${STARBORN_QUEEN_PHASE_GATE_KIT_FIRST}"`));
    const p2 = queen.slice(queen.indexOf("phase2SpellIds:"));
    assert.ok(p2.includes(`"${STARBORN_QUEEN_PHASE_GATE_KIT_PHASE2}"`));
    assert.ok(
      p2.includes(`"${STARBORN_QUEEN_PHASE_GATE_KIT_FIRST}"`),
      "phase-2 pool still leads with starter-blast — kit-first leftover, not restored",
    );
    assert.equal(blast.id, STARBORN_QUEEN_PHASE_GATE_KIT_FIRST);

    const rush = readFileSync(join(here(), "../hooks/useBossRush.ts"), "utf8");
    assert.ok(rush.includes('boss1Id: "starborn_queen"'));
  });
});
