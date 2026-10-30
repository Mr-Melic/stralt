/**
 * Combat action parity: Alabaster Fortress phase 2 never arms at the
 * advertised 30% card because checkPhaseTransition reads
 * phase2.hpThreshold 0.0, so the ×1.2 HP commit never runs.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { starterSpells } from "../data/spellData.ts";
import { hpAfterBossPhase2, shouldAwardVictory } from "./battleSetup.ts";
import {
  ALABASTER_FORTRESS_PHASE_GATE_ABILITY,
  ALABASTER_FORTRESS_PHASE_GATE_ADVERTISED_THRESHOLD,
  ALABASTER_FORTRESS_PHASE_GATE_BOSS_ID,
  ALABASTER_FORTRESS_PHASE_GATE_FULL_HEAL,
  ALABASTER_FORTRESS_PHASE_GATE_GUIDE_NEEDLE,
  ALABASTER_FORTRESS_PHASE_GATE_HP,
  ALABASTER_FORTRESS_PHASE_GATE_HP_AFTER,
  ALABASTER_FORTRESS_PHASE_GATE_HP_AT_GUIDE,
  ALABASTER_FORTRESS_PHASE_GATE_KIT_FIRST,
  ALABASTER_FORTRESS_PHASE_GATE_KIT_PHASE2,
  ALABASTER_FORTRESS_PHASE_GATE_LIVE_THRESHOLD,
  ALABASTER_FORTRESS_PHASE_GATE_LORE_NEEDLE,
  ALABASTER_FORTRESS_PHASE_GATE_MAX_HP_AFTER,
  ALABASTER_FORTRESS_PHASE_GATE_RESONANCE_LEFTOVER,
  ALABASTER_FORTRESS_PHASE_GATE_STAT_MULT,
  advertisedAlabasterFortressPhaseThreshold,
  advertisedAlabasterFortressPhaseTransitioned,
  alabasterFortressHpFraction,
  canExecuteAlabasterFortressPhaseGateHp,
  executeAlabasterFortressPhaseGateHp,
  executeFortressPhaseGateHp,
  liveWxAlabasterFortressPhaseThreshold,
  liveWxAlabasterFortressPhaseTransitioned,
  liveWxAlabasterFortressReadsPhase2Threshold,
  resolveAlabasterFortressPhaseGate,
  shouldCommitAlabasterFortressPhaseGateHp,
  wxAppliesAlabasterFortressPhaseHpOnceTransitioned,
} from "./bossAlabasterFortressPhaseGateCommit.ts";

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
    bossId: overrides?.bossId ?? ALABASTER_FORTRESS_PHASE_GATE_BOSS_ID,
    hp: overrides?.hp ?? ALABASTER_FORTRESS_PHASE_GATE_HP_AT_GUIDE,
    maxHp: ALABASTER_FORTRESS_PHASE_GATE_HP,
    alreadyPhase2: overrides?.alreadyPhase2 ?? false,
  };
}

describe("Alabaster Fortress advertised 30% phase gate vs live 0.0", () => {
  it("catalog 0.3 / 400 HP / ×1.2 / BOARD_SHRINK", () => {
    const defaults = readFileSync(
      join(here(), "../types/bossDefaults.ts"),
      "utf8",
    );
    const fortress = defaults.slice(
      defaults.indexOf('id: "alabaster_fortress"'),
      defaults.indexOf('id: "chessboard_lich"'),
    );
    assert.ok(
      fortress.includes(`id: "${ALABASTER_FORTRESS_PHASE_GATE_BOSS_ID}"`),
    );
    assert.ok(fortress.includes("hp: 400"));
    assert.ok(fortress.includes("hpThreshold: 0.3"));
    assert.ok(fortress.includes("hpThreshold: 0.0"));
    assert.ok(fortress.includes("statMultiplier: 1.2"));
    assert.ok(fortress.includes("BossAbility.BOARD_SHRINK"));
    assert.ok(fortress.includes("BossAbility.RESONANCE_SHOCKWAVE"));
    assert.ok(fortress.includes(ALABASTER_FORTRESS_PHASE_GATE_LORE_NEEDLE));
    assert.equal(ALABASTER_FORTRESS_PHASE_GATE_HP, 400);
    assert.equal(ALABASTER_FORTRESS_PHASE_GATE_ADVERTISED_THRESHOLD, 0.3);
    assert.equal(ALABASTER_FORTRESS_PHASE_GATE_LIVE_THRESHOLD, 0.0);
    assert.equal(ALABASTER_FORTRESS_PHASE_GATE_HP_AT_GUIDE, 120);
    assert.equal(400 * 0.3, 120);
    assert.equal(ALABASTER_FORTRESS_PHASE_GATE_STAT_MULT, 1.2);
    assert.equal(ALABASTER_FORTRESS_PHASE_GATE_FULL_HEAL, false);
    assert.equal(
      alabasterFortressHpFraction(
        ALABASTER_FORTRESS_PHASE_GATE_HP_AT_GUIDE,
        ALABASTER_FORTRESS_PHASE_GATE_HP,
      ),
      0.3,
    );
    assert.equal(advertisedAlabasterFortressPhaseThreshold(), 0.3);
    assert.equal(liveWxAlabasterFortressPhaseThreshold(), 0.0);
    assert.notEqual(
      advertisedAlabasterFortressPhaseThreshold(),
      liveWxAlabasterFortressPhaseThreshold(),
    );
    assert.equal(strike.id, ALABASTER_FORTRESS_PHASE_GATE_KIT_FIRST);
    assert.equal(iron.id, ALABASTER_FORTRESS_PHASE_GATE_KIT_PHASE2);
    assert.equal(STRIKE_DAMAGE, 10);
    assert.deepEqual(hpAfterBossPhase2(120, 400, 1.2, false), {
      hp: 144,
      maxHp: 480,
    });
    assert.deepEqual(
      hpAfterBossPhase2(120, 400, 1.2, true),
      { hp: 480, maxHp: 480 },
      "full-heal ×1.2 is 480/480 — Weeping ISSUE 5, not this scaled fire",
    );
    assert.equal(ALABASTER_FORTRESS_PHASE_GATE_HP_AFTER, 144);
    assert.equal(ALABASTER_FORTRESS_PHASE_GATE_MAX_HP_AFTER, 480);

    const weeping = defaults.slice(
      defaults.indexOf('id: "weeping_pawn"'),
      defaults.indexOf('id: "starborn_queen"'),
    );
    assert.ok(
      weeping.includes("hp: 500"),
      "Weeping #1343 is ×2.0 at 30% of 500 full-heal — this sidecar is Fortress 400",
    );
    const queen = defaults.slice(
      defaults.indexOf('id: "starborn_queen"'),
      defaults.indexOf('id: "fetid_rook"'),
    );
    assert.ok(
      queen.includes("hp: 380"),
      "Queen #1347 is ×1.5 at 50% of 380 — this sidecar is Fortress 400",
    );
    const bishop = defaults.slice(
      defaults.indexOf('id: "midnight_bishop"'),
      defaults.indexOf('id: "broodmother_rook"'),
    );
    assert.ok(
      bishop.includes("hp: 360"),
      "Midnight Bishop #1345 is ×2.0 at 25% of 360 — this sidecar is Fortress 400",
    );
    const king = defaults.slice(
      defaults.indexOf('id: "eternal_pawn_king"'),
      defaults.indexOf('id: "midnight_bishop"'),
    );
    assert.ok(
      king.includes("hp: 450"),
      "Eternal Pawn King #1349 is ×1.3 at 50% of 450 — this sidecar is Fortress 400",
    );
    const staticBoss = defaults.slice(
      defaults.indexOf('id: "lord_of_static"'),
      defaults.indexOf('id: "final_pawn"'),
    );
    assert.ok(
      staticBoss.includes("hp: 340"),
      "Static #1342 is ×1.5 at 40% of 340 — this sidecar is Fortress 400",
    );
    const cavalier = defaults.slice(
      defaults.indexOf('id: "bone_cavalier"'),
      defaults.indexOf('id: "weeping_pawn"'),
    );
    assert.ok(
      cavalier.includes("hp: 320"),
      "Cavalier #1337/#1338 is ×1.6 at 50% of 320 — this sidecar is Fortress 400",
    );
    const grandmaster = defaults.slice(
      defaults.indexOf('id: "void_grandmaster"'),
      defaults.indexOf('id: "bone_cavalier"'),
    );
    assert.ok(
      grandmaster.includes("hp: 300"),
      "Grandmaster #1336 is ×1.3 at 60% of 300 — this sidecar is Fortress 400",
    );
    const broodmother = defaults.slice(
      defaults.indexOf('id: "broodmother_rook"'),
      defaults.indexOf('id: "lord_of_static"'),
    );
    assert.ok(
      broodmother.includes("hp: 480"),
      "Broodmother #1333 is ×1.4 at 50% of 480 — this sidecar is Fortress 400",
    );
    const archbishop = defaults.slice(
      defaults.indexOf('id: "pale_archbishop"'),
      defaults.indexOf('id: "crimson_countess"'),
    );
    assert.ok(
      archbishop.includes("hp: 350"),
      "Archbishop #1332 is ×1.4 at 50% of 350 — this sidecar is Fortress 400",
    );
    const countess = defaults.slice(
      defaults.indexOf('id: "crimson_countess"'),
      defaults.indexOf('id: "void_grandmaster"'),
    );
    assert.ok(
      countess.includes("hp: 400"),
      "Countess #1329 is ×1.5 at 40% of the same 400 HP — this sidecar is 30% ×1.2",
    );
    assert.ok(countess.includes("statMultiplier: 1.5"));
    const fetid = defaults.slice(
      defaults.indexOf('id: "fetid_rook"'),
      defaults.indexOf('id: "eternal_pawn_king"'),
    );
    assert.ok(
      fetid.includes("statMultiplier: 1.0"),
      "Fetid #1325 has no ×1.2 HP fire — this sidecar is Fortress-only",
    );
    const archivist = defaults.slice(
      defaults.indexOf('id: "pale_archivist"'),
      defaults.indexOf('id: "twin_monarchs"'),
    );
    assert.ok(
      archivist.includes("hp: 350"),
      "Pale Archivist PAGES 40% ×1.2 of 350 is a sibling leftover",
    );
    assert.ok(archivist.includes("statMultiplier: 1.2"));
  });

  it("live 120/400 does not transition; advertised 30% does", () => {
    const atGuide = {
      hp: ALABASTER_FORTRESS_PHASE_GATE_HP_AT_GUIDE,
      maxHp: ALABASTER_FORTRESS_PHASE_GATE_HP,
      alreadyPhase2: false,
    };
    assert.equal(liveWxAlabasterFortressPhaseTransitioned(atGuide), false);
    assert.equal(advertisedAlabasterFortressPhaseTransitioned(atGuide), true);
    assert.equal(resolveAlabasterFortressPhaseGate(atGuide), 2);
    assert.equal(liveWxAlabasterFortressReadsPhase2Threshold(), true);
    assert.equal(wxAppliesAlabasterFortressPhaseHpOnceTransitioned(), true);

    const above = {
      hp: ALABASTER_FORTRESS_PHASE_GATE_HP_AT_GUIDE + 1,
      maxHp: ALABASTER_FORTRESS_PHASE_GATE_HP,
      alreadyPhase2: false,
    };
    assert.equal(advertisedAlabasterFortressPhaseTransitioned(above), false);
    assert.equal(liveWxAlabasterFortressPhaseTransitioned(above), false);
    assert.equal(resolveAlabasterFortressPhaseGate(above), null);
    assert.equal(
      executeAlabasterFortressPhaseGateHp(gateReady({ hp: 121 })),
      null,
    );

    const dying = {
      hp: 1,
      maxHp: ALABASTER_FORTRESS_PHASE_GATE_HP,
      alreadyPhase2: false,
    };
    assert.equal(
      liveWxAlabasterFortressPhaseTransitioned(dying),
      false,
      "live 0.0 still refuses a 1 HP Fortress — only hp 0 satisfies it",
    );
    assert.equal(advertisedAlabasterFortressPhaseTransitioned(dying), true);
    assert.equal(
      liveWxAlabasterFortressPhaseTransitioned({
        hp: 0,
        maxHp: ALABASTER_FORTRESS_PHASE_GATE_HP,
        alreadyPhase2: false,
      }),
      true,
      "live only arms when Alabaster Fortress is already dead",
    );
  });
});

describe("player-visible Alabaster Fortress HP after advertised 30% ×1.2", () => {
  it("commits 144/480; live 0.0 leaves 120/400", () => {
    const ready = gateReady();
    const decided = shouldCommitAlabasterFortressPhaseGateHp(ready);
    const executable = canExecuteAlabasterFortressPhaseGateHp(ready);
    assert.equal(decided, true);
    assert.equal(executable, true);

    const next = executeAlabasterFortressPhaseGateHp(ready);
    assert.deepEqual(next, {
      phase: 2,
      hp: 144,
      maxHp: 480,
    });
    assert.deepEqual(executeFortressPhaseGateHp(ready), next);
    assert.equal(
      liveWxAlabasterFortressPhaseTransitioned({
        hp: ready.hp,
        maxHp: ready.maxHp,
        alreadyPhase2: false,
      }),
      false,
    );
  });

  it("10 HP Fortress: advertised 30% already armed so ×1.2 still commits 12/480", () => {
    const ready = gateReady({ hp: 10 });
    const next = executeAlabasterFortressPhaseGateHp(ready);
    assert.deepEqual(next, {
      phase: 2,
      hp: 12,
      maxHp: 480,
    });
    assert.equal(
      liveWxAlabasterFortressPhaseTransitioned({
        hp: 10,
        maxHp: ALABASTER_FORTRESS_PHASE_GATE_HP,
        alreadyPhase2: false,
      }),
      false,
    );
    assert.deepEqual(hpAfterBossPhase2(10, 400, 1.2, false), {
      hp: 12,
      maxHp: 480,
    });
    assert.deepEqual(
      hpAfterBossPhase2(10, 500, 2.0, true),
      { hp: 1000, maxHp: 1000 },
      "Weeping #1343 10 HP full-heal is 1000/1000 — not this scaled 12/480",
    );
    assert.deepEqual(
      hpAfterBossPhase2(10, 400, 1.5, false),
      { hp: 15, maxHp: 600 },
      "Countess #1329 10 HP ×1.5 of the same 400 is 15/600 — not this ×1.2",
    );

    const advertisedAfterStrike = (next?.hp ?? 0) - STRIKE_DAMAGE;
    assert.equal(advertisedAfterStrike, 2);
    assert.equal(
      shouldAwardVictory({
        inBattle: true,
        deathTriggered: false,
        battleStartIdsSize: 1,
        hostilesRemaining: advertisedAfterStrike > 0 ? 1 : 0,
      }),
      false,
      "advertised 12 HP Fortress survives Strike 10",
    );
    const liveAfterStrike = 10 - STRIKE_DAMAGE;
    assert.equal(liveAfterStrike, 0);
    assert.equal(
      shouldAwardVictory({
        inBattle: true,
        deathTriggered: false,
        battleStartIdsSize: 1,
        hostilesRemaining: liveAfterStrike > 0 ? 1 : 0,
      }),
      true,
      "live 10 HP Fortress dies to Strike 10 because phase 2 never armed",
    );
  });

  it("refuses already-phase-2, other bosses, and does not stamp leftovers", () => {
    const ready = gateReady();
    assert.equal(
      executeAlabasterFortressPhaseGateHp({
        ...ready,
        alreadyPhase2: true,
      }),
      null,
      "already-phase-2 does not re-apply ×1.2",
    );
    assert.equal(
      resolveAlabasterFortressPhaseGate({
        bossId: "weeping_pawn",
        hp: ALABASTER_FORTRESS_PHASE_GATE_HP_AT_GUIDE,
        maxHp: ALABASTER_FORTRESS_PHASE_GATE_HP,
        alreadyPhase2: false,
      }),
      null,
      "Weeping ×2.0 30% of 500 full-heal is owned #1343",
    );
    assert.equal(
      executeAlabasterFortressPhaseGateHp({
        ...ready,
        bossId: "eternal_pawn_king",
      }),
      null,
      "Eternal Pawn King ×1.3 50% of 450 is owned #1349",
    );
    assert.equal(
      executeAlabasterFortressPhaseGateHp({
        ...ready,
        bossId: "starborn_queen",
      }),
      null,
      "Starborn Queen ×1.5 50% of 380 is owned #1347",
    );
    assert.equal(
      executeAlabasterFortressPhaseGateHp({
        ...ready,
        bossId: "midnight_bishop",
      }),
      null,
      "Midnight Bishop ×2.0 25% of 360 is owned #1345",
    );
    assert.equal(
      executeAlabasterFortressPhaseGateHp({
        ...ready,
        bossId: "lord_of_static",
      }),
      null,
      "Static ×1.5 40% of 340 is owned #1342",
    );
    assert.equal(
      executeAlabasterFortressPhaseGateHp({
        ...ready,
        bossId: "bone_cavalier",
      }),
      null,
      "Cavalier ×1.6 50% of 320 is owned #1337/#1338",
    );
    assert.equal(
      executeAlabasterFortressPhaseGateHp({
        ...ready,
        bossId: "void_grandmaster",
      }),
      null,
      "Grandmaster ×1.3 60% of 300 is owned #1336",
    );
    assert.equal(
      executeAlabasterFortressPhaseGateHp({
        ...ready,
        bossId: "broodmother_rook",
      }),
      null,
      "Broodmother ×1.4 50% of 480 is owned #1333",
    );
    assert.equal(
      executeAlabasterFortressPhaseGateHp({
        ...ready,
        bossId: "pale_archbishop",
      }),
      null,
      "Archbishop ×1.4 50% of 350 is owned #1332",
    );
    assert.equal(
      executeAlabasterFortressPhaseGateHp({
        ...ready,
        bossId: "crimson_countess",
      }),
      null,
      "Countess ×1.5 40% of 400 is owned #1329",
    );
    assert.equal(
      executeAlabasterFortressPhaseGateHp({
        ...ready,
        bossId: "fetid_rook",
      }),
      null,
      "Fetid Split 40% gate is owned #1325",
    );
    assert.equal(
      executeAlabasterFortressPhaseGateHp({
        ...ready,
        bossId: "chessboard_lich",
      }),
      null,
      "Chessboard Lich MAP_ROTATE leftover is not this Fortress gate",
    );
    assert.equal(
      executeAlabasterFortressPhaseGateHp({
        ...ready,
        bossId: "mirror_sovereign",
      }),
      null,
      "Mirror Sovereign SPELL_MIRROR leftover is not this Fortress gate",
    );
    assert.equal(
      executeAlabasterFortressPhaseGateHp({
        ...ready,
        bossId: "pale_archivist",
      }),
      null,
      "Pale Archivist PAGES 40% ×1.2 leftover is not this Fortress gate",
    );
    assert.equal(
      executeAlabasterFortressPhaseGateHp({
        ...ready,
        bossId: "final_pawn",
      }),
      null,
      "Final Pawn HP≤10% GHOST leftover of #1247",
    );

    const crit = executeAlabasterFortressPhaseGateHp(ready);
    assert.ok(crit);
    assert.equal("atk" in crit, false, "base atk 10 leftover stays unrestored");
    assert.equal("ap" in crit, false);
    assert.equal("res" in crit, false, "base res 60 leftover stays unrestored");
    assert.equal("chc" in crit, false, "#1104 owns boss kit CHC");
    assert.equal("shrink" in crit, false, "BOARD_SHRINK occupancy leftover");
    assert.equal("board" in crit, false);
    assert.equal(
      "shockwave" in crit,
      false,
      "RESONANCE_SHOCKWAVE already lives on phase 1",
    );
    assert.equal("resonance" in crit, false);
    assert.equal("barrier" in crit, false, "phase-2 kit Barrier leftover");
    assert.equal("frost" in crit, false, "phase-2 kit Frost Nova leftover");
    assert.equal("iron" in crit, false, "#1339 owns kit Iron Skin");
    assert.equal("shield" in crit, false);
    assert.equal("strike" in crit, false, "kit-first physical_attack leftover");
    assert.equal("chain" in crit, false, "#1342 owns Static CHAIN");
    assert.equal("shock" in crit, false, "#1342 owns Static SHOCK leftover");
    assert.equal("blast" in crit, false);
    assert.equal("haste" in crit, false);
    assert.equal("expose" in crit, false);
    assert.equal("spike" in crit, false, "#1337 owns Cavalier SPIKE");
    assert.equal("jump" in crit, false, "#1337 owns Cavalier jump leftover");
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
    assert.equal("promote" in crit, false, "#1343 owns Weeping PROMOTE");
    assert.equal("merge" in crit, false, "#1345 owns Bishop MERGE");
    assert.equal("void" in crit, false, "#1347 owns Queen VOID");
    assert.equal("drain" in crit, false, "#1349 owns Eternal AP_DRAIN");
    assert.equal("lines" in crit, false);
    assert.equal("slow" in crit, false);
    assert.equal("rally" in crit, false);
    assert.equal("rotate" in crit, false, "Lich MAP_ROTATE leftover");
    assert.equal("mirror" in crit, false, "Sovereign SPELL_MIRROR leftover");
    assert.equal("pages" in crit, false, "Archivist PAGES leftover");
    assert.equal(ALABASTER_FORTRESS_PHASE_GATE_ABILITY, "BOARD_SHRINK");
    assert.equal(
      ALABASTER_FORTRESS_PHASE_GATE_RESONANCE_LEFTOVER,
      "RESONANCE_SHOCKWAVE",
    );
    assert.equal(ALABASTER_FORTRESS_PHASE_GATE_KIT_FIRST, "physical_attack");
    assert.equal(ALABASTER_FORTRESS_PHASE_GATE_KIT_PHASE2, "spell-iron-skin");
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
    assert.equal(body.includes("resolveAlabasterFortressPhaseGate"), false);
    assert.equal(body.includes("executeAlabasterFortressPhaseGateHp"), false);

    const shrink = src.slice(
      src.indexOf("function applyBoardShrink("),
      src.indexOf("function applyMapRotate("),
    );
    assert.ok(shrink.includes("damageToPlayer: 5"));
    assert.ok(shrink.includes("crushes the edges"));
  });

  it("decideAlabasterFortressAction still kit-first then currentPhase 2 BOARD_SHRINK", () => {
    const src = readFileSync(join(here(), "../hooks/useBossAI.ts"), "utf8");
    const start = src.indexOf("export const decideAlabasterFortressAction");
    const end = src.indexOf("export const decideChessboardLichAction");
    assert.ok(start >= 0 && end > start, "Alabaster decide is present");
    const body = src.slice(start, end);
    const kitIdx = body.indexOf("pickBossKitSpell");
    const shrinkIdx = body.indexOf("BossAbility.BOARD_SHRINK");
    assert.ok(kitIdx >= 0, "kit pick is present");
    assert.ok(shrinkIdx >= 0, "BOARD_SHRINK is present");
    assert.ok(kitIdx < shrinkIdx, "kit still wins the shrink turn");
    assert.ok(body.includes("bossState.currentPhase === 2"));
    assert.ok(body.includes("new Map<string, number>()"));
    assert.equal(body.includes("resolveAlabasterFortressPhaseGate"), false);
    assert.equal(body.includes("executeAlabasterFortressPhaseGateHp"), false);
    assert.equal(body.includes("phase1.hpThreshold"), false);
  });

  it("WorldExploration still scales Fortress only after checkPhaseTransition", () => {
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
    assert.equal(wx.includes("resolveAlabasterFortressPhaseGate"), false);
    assert.equal(wx.includes("executeAlabasterFortressPhaseGateHp"), false);
    assert.equal(
      wx.includes("config.phase1.hpThreshold"),
      false,
      "WX still never substitutes the advertised 30% card",
    );
  });

  it("Boss Guide still advertises BOARD_SHRINK at phase1 30%", () => {
    const guide = readFileSync(
      join(here(), "../components/BossGuideModal.tsx"),
      "utf8",
    );
    assert.ok(guide.includes(ALABASTER_FORTRESS_PHASE_GATE_GUIDE_NEEDLE));
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
    const fortressKit = kits.slice(
      kits.indexOf("alabaster_fortress: {"),
      kits.indexOf("chessboard_lich: {"),
    );
    const p1 = fortressKit.slice(fortressKit.indexOf("phase1SpellIds:"));
    assert.ok(p1.includes(`"${ALABASTER_FORTRESS_PHASE_GATE_KIT_FIRST}"`));
    const p2 = fortressKit.slice(fortressKit.indexOf("phase2SpellIds:"));
    assert.ok(p2.includes(`"${ALABASTER_FORTRESS_PHASE_GATE_KIT_PHASE2}"`));
    assert.equal(strike.id, ALABASTER_FORTRESS_PHASE_GATE_KIT_FIRST);
    assert.equal(iron.id, ALABASTER_FORTRESS_PHASE_GATE_KIT_PHASE2);

    const rush = readFileSync(join(here(), "../hooks/useBossRush.ts"), "utf8");
    assert.ok(rush.includes('boss1Id: "alabaster_fortress"'));
  });
});
