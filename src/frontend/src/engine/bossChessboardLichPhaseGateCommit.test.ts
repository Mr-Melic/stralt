/**
 * Combat action parity: Chessboard Lich phase 2 never arms at the
 * advertised 50% card because checkPhaseTransition reads
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
  CHESSBOARD_LICH_PHASE_GATE_ABILITY,
  CHESSBOARD_LICH_PHASE_GATE_ADVERTISED_THRESHOLD,
  CHESSBOARD_LICH_PHASE_GATE_BOSS_ID,
  CHESSBOARD_LICH_PHASE_GATE_CLAIM_LEFTOVER,
  CHESSBOARD_LICH_PHASE_GATE_FULL_HEAL,
  CHESSBOARD_LICH_PHASE_GATE_GUIDE_NEEDLE,
  CHESSBOARD_LICH_PHASE_GATE_HP,
  CHESSBOARD_LICH_PHASE_GATE_HP_AFTER,
  CHESSBOARD_LICH_PHASE_GATE_HP_AT_GUIDE,
  CHESSBOARD_LICH_PHASE_GATE_KIT_FIRST,
  CHESSBOARD_LICH_PHASE_GATE_KIT_PHASE2,
  CHESSBOARD_LICH_PHASE_GATE_LIVE_THRESHOLD,
  CHESSBOARD_LICH_PHASE_GATE_LORE_NEEDLE,
  CHESSBOARD_LICH_PHASE_GATE_MAX_HP_AFTER,
  CHESSBOARD_LICH_PHASE_GATE_ROTATE_LEFTOVER,
  CHESSBOARD_LICH_PHASE_GATE_STAT_MULT,
  advertisedChessboardLichPhaseThreshold,
  advertisedChessboardLichPhaseTransitioned,
  canExecuteChessboardLichPhaseGateHp,
  chessboardLichHpFraction,
  executeChessboardLichPhaseGateHp,
  executeLichPhaseGateHp,
  liveWxChessboardLichPhaseThreshold,
  liveWxChessboardLichPhaseTransitioned,
  liveWxChessboardLichReadsPhase2Threshold,
  resolveChessboardLichPhaseGate,
  shouldCommitChessboardLichPhaseGateHp,
  wxAppliesChessboardLichPhaseHpOnceTransitioned,
} from "./bossChessboardLichPhaseGateCommit.ts";

const strike = starterSpells.find((s) => s.id === "physical_attack");
assert.ok(strike, "physical_attack");
const wound = starterSpells.find((s) => s.id === "spell-cursed-wound");
assert.ok(wound, "spell-cursed-wound");
const wisp = starterSpells.find((s) => s.id === "summon-wisp");
assert.ok(wisp, "summon-wisp");

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
    bossId: overrides?.bossId ?? CHESSBOARD_LICH_PHASE_GATE_BOSS_ID,
    hp: overrides?.hp ?? CHESSBOARD_LICH_PHASE_GATE_HP_AT_GUIDE,
    maxHp: CHESSBOARD_LICH_PHASE_GATE_HP,
    alreadyPhase2: overrides?.alreadyPhase2 ?? false,
  };
}

describe("Chessboard Lich advertised 50% phase gate vs live 0.0", () => {
  it("catalog 0.5 / 200 HP / ×1.3 / MIRROR_INVERT", () => {
    const defaults = readFileSync(
      join(here(), "../types/bossDefaults.ts"),
      "utf8",
    );
    const lich = defaults.slice(
      defaults.indexOf('id: "chessboard_lich"'),
      defaults.indexOf('id: "mirror_sovereign"'),
    );
    assert.ok(lich.includes(`id: "${CHESSBOARD_LICH_PHASE_GATE_BOSS_ID}"`));
    assert.ok(lich.includes("hp: 200"));
    assert.ok(lich.includes("hpThreshold: 0.5"));
    assert.ok(lich.includes("hpThreshold: 0.0"));
    assert.ok(lich.includes("statMultiplier: 1.3"));
    assert.ok(lich.includes("BossAbility.MIRROR_INVERT"));
    assert.ok(lich.includes("BossAbility.BOARD_CLAIM"));
    assert.ok(lich.includes("BossAbility.MAP_ROTATE"));
    assert.ok(lich.includes(CHESSBOARD_LICH_PHASE_GATE_LORE_NEEDLE));
    assert.equal(CHESSBOARD_LICH_PHASE_GATE_HP, 200);
    assert.equal(CHESSBOARD_LICH_PHASE_GATE_ADVERTISED_THRESHOLD, 0.5);
    assert.equal(CHESSBOARD_LICH_PHASE_GATE_LIVE_THRESHOLD, 0.0);
    assert.equal(CHESSBOARD_LICH_PHASE_GATE_HP_AT_GUIDE, 100);
    assert.equal(200 * 0.5, 100);
    assert.equal(CHESSBOARD_LICH_PHASE_GATE_STAT_MULT, 1.3);
    assert.equal(CHESSBOARD_LICH_PHASE_GATE_FULL_HEAL, false);
    assert.equal(
      chessboardLichHpFraction(
        CHESSBOARD_LICH_PHASE_GATE_HP_AT_GUIDE,
        CHESSBOARD_LICH_PHASE_GATE_HP,
      ),
      0.5,
    );
    assert.equal(advertisedChessboardLichPhaseThreshold(), 0.5);
    assert.equal(liveWxChessboardLichPhaseThreshold(), 0.0);
    assert.notEqual(
      advertisedChessboardLichPhaseThreshold(),
      liveWxChessboardLichPhaseThreshold(),
    );
    assert.equal(wound.id, CHESSBOARD_LICH_PHASE_GATE_KIT_FIRST);
    assert.equal(wisp.id, CHESSBOARD_LICH_PHASE_GATE_KIT_PHASE2);
    assert.equal(STRIKE_DAMAGE, 10);
    assert.deepEqual(hpAfterBossPhase2(100, 200, 1.3, false), {
      hp: 130,
      maxHp: 260,
    });
    assert.deepEqual(
      hpAfterBossPhase2(100, 200, 1.3, true),
      { hp: 260, maxHp: 260 },
      "full-heal ×1.3 is 260/260 — Weeping ISSUE 5, not this scaled fire",
    );
    assert.equal(CHESSBOARD_LICH_PHASE_GATE_HP_AFTER, 130);
    assert.equal(CHESSBOARD_LICH_PHASE_GATE_MAX_HP_AFTER, 260);

    const king = defaults.slice(
      defaults.indexOf('id: "eternal_pawn_king"'),
      defaults.indexOf('id: "midnight_bishop"'),
    );
    assert.ok(
      king.includes("hp: 450"),
      "Eternal #1349 is ×1.3 at 50% of 450 — this sidecar is Lich 200",
    );
    const grandmaster = defaults.slice(
      defaults.indexOf('id: "void_grandmaster"'),
      defaults.indexOf('id: "bone_cavalier"'),
    );
    assert.ok(
      grandmaster.includes("hp: 300"),
      "Grandmaster #1336 is ×1.3 at 60% of 300 — this sidecar is Lich 200",
    );
    const fortress = defaults.slice(
      defaults.indexOf('id: "alabaster_fortress"'),
      defaults.indexOf('id: "chessboard_lich"'),
    );
    assert.ok(
      fortress.includes("hp: 400"),
      "Fortress #1352 is ×1.2 at 30% of 400 — this sidecar is Lich 200",
    );
    const queen = defaults.slice(
      defaults.indexOf('id: "starborn_queen"'),
      defaults.indexOf('id: "fetid_rook"'),
    );
    assert.ok(
      queen.includes("hp: 380"),
      "Queen #1347 is ×1.5 at 50% of 380 — this sidecar is Lich 200",
    );
    const bishop = defaults.slice(
      defaults.indexOf('id: "midnight_bishop"'),
      defaults.indexOf('id: "broodmother_rook"'),
    );
    assert.ok(
      bishop.includes("hp: 360"),
      "Midnight Bishop #1345 is ×2.0 at 25% of 360 — this sidecar is Lich 200",
    );
    const weeping = defaults.slice(
      defaults.indexOf('id: "weeping_pawn"'),
      defaults.indexOf('id: "starborn_queen"'),
    );
    assert.ok(
      weeping.includes("hp: 500"),
      "Weeping #1343 is ×2.0 at 30% of 500 — this sidecar is Lich 200",
    );
    const staticBoss = defaults.slice(
      defaults.indexOf('id: "lord_of_static"'),
      defaults.indexOf('id: "final_pawn"'),
    );
    assert.ok(
      staticBoss.includes("hp: 340"),
      "Static #1342 is ×1.5 at 40% of 340 — this sidecar is Lich 200",
    );
    const cavalier = defaults.slice(
      defaults.indexOf('id: "bone_cavalier"'),
      defaults.indexOf('id: "weeping_pawn"'),
    );
    assert.ok(
      cavalier.includes("hp: 320"),
      "Cavalier #1337/#1338 is ×1.6 at 50% of 320 — this sidecar is Lich 200",
    );
    const broodmother = defaults.slice(
      defaults.indexOf('id: "broodmother_rook"'),
      defaults.indexOf('id: "lord_of_static"'),
    );
    assert.ok(
      broodmother.includes("hp: 480"),
      "Broodmother #1333 is ×1.4 at 50% of 480 — this sidecar is Lich 200",
    );
    const archbishop = defaults.slice(
      defaults.indexOf('id: "pale_archbishop"'),
      defaults.indexOf('id: "crimson_countess"'),
    );
    assert.ok(
      archbishop.includes("hp: 350"),
      "Archbishop #1332 is ×1.4 at 50% of 350 — this sidecar is Lich 200",
    );
    const countess = defaults.slice(
      defaults.indexOf('id: "crimson_countess"'),
      defaults.indexOf('id: "void_grandmaster"'),
    );
    assert.ok(
      countess.includes("hp: 400"),
      "Countess #1329 is ×1.5 at 40% of 400 — this sidecar is Lich 200",
    );
    const fetid = defaults.slice(
      defaults.indexOf('id: "fetid_rook"'),
      defaults.indexOf('id: "eternal_pawn_king"'),
    );
    assert.ok(
      fetid.includes("statMultiplier: 1.0"),
      "Fetid #1325 has no ×1.3 HP fire — this sidecar is Lich-only",
    );
    const sovereign = defaults.slice(
      defaults.indexOf('id: "mirror_sovereign"'),
      defaults.indexOf('id: "starved_vampire_pawn"'),
    );
    assert.ok(
      sovereign.includes("hp: 250"),
      "Mirror Sovereign SPELL_MIRROR 50% ×1.5 of 250 is a sibling leftover",
    );
    const archivist = defaults.slice(
      defaults.indexOf('id: "pale_archivist"'),
      defaults.indexOf('id: "twin_monarchs"'),
    );
    assert.ok(
      archivist.includes("hp: 350"),
      "Pale Archivist PAGES 40% ×1.2 of 350 is a sibling leftover",
    );
  });

  it("live 100/200 does not transition; advertised 50% does", () => {
    const atGuide = {
      hp: CHESSBOARD_LICH_PHASE_GATE_HP_AT_GUIDE,
      maxHp: CHESSBOARD_LICH_PHASE_GATE_HP,
      alreadyPhase2: false,
    };
    assert.equal(liveWxChessboardLichPhaseTransitioned(atGuide), false);
    assert.equal(advertisedChessboardLichPhaseTransitioned(atGuide), true);
    assert.equal(resolveChessboardLichPhaseGate(atGuide), 2);
    assert.equal(liveWxChessboardLichReadsPhase2Threshold(), true);
    assert.equal(wxAppliesChessboardLichPhaseHpOnceTransitioned(), true);

    const above = {
      hp: CHESSBOARD_LICH_PHASE_GATE_HP_AT_GUIDE + 1,
      maxHp: CHESSBOARD_LICH_PHASE_GATE_HP,
      alreadyPhase2: false,
    };
    assert.equal(advertisedChessboardLichPhaseTransitioned(above), false);
    assert.equal(liveWxChessboardLichPhaseTransitioned(above), false);
    assert.equal(resolveChessboardLichPhaseGate(above), null);
    assert.equal(
      executeChessboardLichPhaseGateHp(gateReady({ hp: 101 })),
      null,
    );

    const dying = {
      hp: 1,
      maxHp: CHESSBOARD_LICH_PHASE_GATE_HP,
      alreadyPhase2: false,
    };
    assert.equal(
      liveWxChessboardLichPhaseTransitioned(dying),
      false,
      "live 0.0 still refuses a 1 HP Lich — only hp 0 satisfies it",
    );
    assert.equal(advertisedChessboardLichPhaseTransitioned(dying), true);
    assert.equal(
      liveWxChessboardLichPhaseTransitioned({
        hp: 0,
        maxHp: CHESSBOARD_LICH_PHASE_GATE_HP,
        alreadyPhase2: false,
      }),
      true,
      "live only arms when the Lich is already dead",
    );
  });
});

describe("player-visible Chessboard Lich HP after advertised 50% ×1.3", () => {
  it("commits 130/260; live 0.0 leaves 100/200", () => {
    const ready = gateReady();
    const decided = shouldCommitChessboardLichPhaseGateHp(ready);
    const executable = canExecuteChessboardLichPhaseGateHp(ready);
    assert.equal(decided, true);
    assert.equal(executable, true);

    const next = executeChessboardLichPhaseGateHp(ready);
    assert.deepEqual(next, {
      phase: 2,
      hp: 130,
      maxHp: 260,
    });
    assert.deepEqual(executeLichPhaseGateHp(ready), next);
    assert.equal(
      liveWxChessboardLichPhaseTransitioned({
        hp: ready.hp,
        maxHp: ready.maxHp,
        alreadyPhase2: false,
      }),
      false,
    );
  });

  it("10 HP Lich: advertised 50% already armed so ×1.3 still commits 13/260", () => {
    const ready = gateReady({ hp: 10 });
    const next = executeChessboardLichPhaseGateHp(ready);
    assert.deepEqual(next, {
      phase: 2,
      hp: 13,
      maxHp: 260,
    });
    assert.equal(
      liveWxChessboardLichPhaseTransitioned({
        hp: 10,
        maxHp: CHESSBOARD_LICH_PHASE_GATE_HP,
        alreadyPhase2: false,
      }),
      false,
    );
    assert.deepEqual(hpAfterBossPhase2(10, 200, 1.3, false), {
      hp: 13,
      maxHp: 260,
    });
    assert.deepEqual(
      hpAfterBossPhase2(10, 450, 1.3, false),
      { hp: 13, maxHp: 585 },
      "Eternal #1349 10 HP ×1.3 of 450 is 13/585 — not this Lich 13/260",
    );
    assert.deepEqual(
      hpAfterBossPhase2(10, 300, 1.3, false),
      { hp: 13, maxHp: 390 },
      "Grandmaster #1336 10 HP ×1.3 of 300 is 13/390 — not this Lich 13/260",
    );
    assert.deepEqual(
      hpAfterBossPhase2(10, 400, 1.2, false),
      { hp: 12, maxHp: 480 },
      "Fortress #1352 10 HP ×1.2 of 400 is 12/480 — not this ×1.3",
    );

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
      "advertised 13 HP Lich survives Strike 10",
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
      "live 10 HP Lich dies to Strike 10 because phase 2 never armed",
    );
  });

  it("refuses already-phase-2, other bosses, and does not stamp leftovers", () => {
    const ready = gateReady();
    assert.equal(
      executeChessboardLichPhaseGateHp({
        ...ready,
        alreadyPhase2: true,
      }),
      null,
      "already-phase-2 does not re-apply ×1.3",
    );
    assert.equal(
      resolveChessboardLichPhaseGate({
        bossId: "eternal_pawn_king",
        hp: CHESSBOARD_LICH_PHASE_GATE_HP_AT_GUIDE,
        maxHp: CHESSBOARD_LICH_PHASE_GATE_HP,
        alreadyPhase2: false,
      }),
      null,
      "Eternal ×1.3 50% of 450 is owned #1349",
    );
    assert.equal(
      executeChessboardLichPhaseGateHp({
        ...ready,
        bossId: "alabaster_fortress",
      }),
      null,
      "Fortress ×1.2 30% of 400 is owned #1352",
    );
    assert.equal(
      executeChessboardLichPhaseGateHp({
        ...ready,
        bossId: "starborn_queen",
      }),
      null,
      "Starborn Queen ×1.5 50% of 380 is owned #1347",
    );
    assert.equal(
      executeChessboardLichPhaseGateHp({
        ...ready,
        bossId: "void_grandmaster",
      }),
      null,
      "Grandmaster ×1.3 60% of 300 is owned #1336",
    );
    assert.equal(
      executeChessboardLichPhaseGateHp({
        ...ready,
        bossId: "midnight_bishop",
      }),
      null,
      "Midnight Bishop ×2.0 25% of 360 is owned #1345",
    );
    assert.equal(
      executeChessboardLichPhaseGateHp({
        ...ready,
        bossId: "weeping_pawn",
      }),
      null,
      "Weeping ×2.0 30% of 500 full-heal is owned #1343",
    );
    assert.equal(
      executeChessboardLichPhaseGateHp({
        ...ready,
        bossId: "lord_of_static",
      }),
      null,
      "Static ×1.5 40% of 340 is owned #1342",
    );
    assert.equal(
      executeChessboardLichPhaseGateHp({
        ...ready,
        bossId: "bone_cavalier",
      }),
      null,
      "Cavalier ×1.6 50% of 320 is owned #1337/#1338",
    );
    assert.equal(
      executeChessboardLichPhaseGateHp({
        ...ready,
        bossId: "broodmother_rook",
      }),
      null,
      "Broodmother ×1.4 50% of 480 is owned #1333",
    );
    assert.equal(
      executeChessboardLichPhaseGateHp({
        ...ready,
        bossId: "pale_archbishop",
      }),
      null,
      "Archbishop ×1.4 50% of 350 is owned #1332",
    );
    assert.equal(
      executeChessboardLichPhaseGateHp({
        ...ready,
        bossId: "crimson_countess",
      }),
      null,
      "Countess ×1.5 40% of 400 is owned #1329",
    );
    assert.equal(
      executeChessboardLichPhaseGateHp({
        ...ready,
        bossId: "fetid_rook",
      }),
      null,
      "Fetid Split 40% gate is owned #1325",
    );
    assert.equal(
      executeChessboardLichPhaseGateHp({
        ...ready,
        bossId: "mirror_sovereign",
      }),
      null,
      "Mirror Sovereign SPELL_MIRROR leftover is not this Lich gate",
    );
    assert.equal(
      executeChessboardLichPhaseGateHp({
        ...ready,
        bossId: "pale_archivist",
      }),
      null,
      "Pale Archivist PAGES 40% ×1.2 leftover is not this Lich gate",
    );
    assert.equal(
      executeChessboardLichPhaseGateHp({
        ...ready,
        bossId: "final_pawn",
      }),
      null,
      "Final Pawn HP≤10% GHOST leftover of #1247",
    );

    const crit = executeChessboardLichPhaseGateHp(ready);
    assert.ok(crit);
    assert.equal("atk" in crit, false, "base atk 25 leftover stays unrestored");
    assert.equal("ap" in crit, false);
    assert.equal("res" in crit, false);
    assert.equal("chc" in crit, false, "#1104 owns boss kit CHC");
    assert.equal("invert" in crit, false, "MIRROR_INVERT occupancy leftover");
    assert.equal("claim" in crit, false, "BOARD_CLAIM leftover");
    assert.equal("rotate" in crit, false, "#1161 owns MAP_ROTATE crumbs");
    assert.equal("swap" in crit, false, "#1339 owns kit Swap execute");
    assert.equal("mark" in crit, false);
    assert.equal("veil" in crit, false);
    assert.equal("wound" in crit, false, "kit-first cursed-wound leftover");
    assert.equal("wisp" in crit, false, "phase-2 kit summon-wisp leftover");
    assert.equal("drain" in crit, false, "#1349 owns Eternal AP_DRAIN");
    assert.equal(
      "advance" in crit,
      false,
      "#1349 owns Eternal ADVANCE leftover",
    );
    assert.equal("slow" in crit, false, "#1204 owns kit-first Slow");
    assert.equal("iron" in crit, false, "#1339 owns kit Iron Skin");
    assert.equal("void" in crit, false, "#1347 owns Queen VOID");
    assert.equal("lines" in crit, false);
    assert.equal("blast" in crit, false);
    assert.equal("frost" in crit, false);
    assert.equal("chain" in crit, false, "#1342 owns Static CHAIN");
    assert.equal("shock" in crit, false, "#1342 owns Static SHOCK leftover");
    assert.equal("spike" in crit, false, "#1337 owns Cavalier SPIKE");
    assert.equal("jump" in crit, false, "#1337 owns Cavalier jump leftover");
    assert.equal("illusion" in crit, false, "#1336 owns Grandmaster ILLUSION");
    assert.equal("copies" in crit, false, "#914 owns illusion occupancy");
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
    assert.equal("heal" in crit, false, "#1343 owns Weeping fullHeal");
    assert.equal("shrink" in crit, false, "#1352 owns Fortress BOARD_SHRINK");
    assert.equal("board" in crit, false);
    assert.equal("pages" in crit, false, "Archivist PAGES leftover");
    assert.equal("mirror" in crit, false, "Sovereign SPELL_MIRROR leftover");
    assert.equal("rally" in crit, false);
    assert.equal(CHESSBOARD_LICH_PHASE_GATE_ABILITY, "MIRROR_INVERT");
    assert.equal(CHESSBOARD_LICH_PHASE_GATE_ROTATE_LEFTOVER, "MAP_ROTATE");
    assert.equal(CHESSBOARD_LICH_PHASE_GATE_CLAIM_LEFTOVER, "BOARD_CLAIM");
    assert.equal(CHESSBOARD_LICH_PHASE_GATE_KIT_FIRST, "spell-cursed-wound");
    assert.equal(CHESSBOARD_LICH_PHASE_GATE_KIT_PHASE2, "summon-wisp");
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
    assert.equal(body.includes("resolveChessboardLichPhaseGate"), false);
    assert.equal(body.includes("executeChessboardLichPhaseGateHp"), false);

    const invert = src.slice(
      src.indexOf("function applyMirrorInvert("),
      src.indexOf("function applyBoardClaim("),
    );
    assert.ok(invert.includes("The Chessboard Lich inverts the board!"));
    assert.ok(invert.includes("newX = N-1-x"));
  });

  it("decideChessboardLichAction still kit-first then currentPhase 2 MIRROR_INVERT", () => {
    const src = readFileSync(join(here(), "../hooks/useBossAI.ts"), "utf8");
    const start = src.indexOf("export const decideChessboardLichAction");
    const end = src.indexOf("export const decideMirrorSovereignAction");
    assert.ok(start >= 0 && end > start, "Lich decide is present");
    const body = src.slice(start, end);
    const kitIdx = body.indexOf("pickBossKitSpell");
    const invertIdx = body.indexOf("BossAbility.MIRROR_INVERT");
    const claimIdx = body.indexOf("BossAbility.BOARD_CLAIM");
    assert.ok(kitIdx >= 0, "kit pick is present");
    assert.ok(invertIdx >= 0, "MIRROR_INVERT is present");
    assert.ok(claimIdx >= 0, "BOARD_CLAIM is present");
    assert.ok(kitIdx < invertIdx, "kit still wins the invert turn");
    assert.ok(invertIdx < claimIdx, "invert still precedes claim");
    assert.ok(body.includes("bossState.currentPhase === 2"));
    assert.ok(body.includes("new Map<string, number>()"));
    assert.ok(body.includes("BossAbility.MAP_ROTATE"));
    assert.equal(body.includes("resolveChessboardLichPhaseGate"), false);
    assert.equal(body.includes("executeChessboardLichPhaseGateHp"), false);
    assert.equal(body.includes("phase1.hpThreshold"), false);
  });

  it("WorldExploration still scales Lich only after checkPhaseTransition", () => {
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
    assert.equal(wx.includes("resolveChessboardLichPhaseGate"), false);
    assert.equal(wx.includes("executeChessboardLichPhaseGateHp"), false);
    assert.equal(
      wx.includes("config.phase1.hpThreshold"),
      false,
      "WX still never substitutes the advertised 50% card",
    );
  });

  it("Boss Guide still advertises MIRROR_INVERT at phase1 50%", () => {
    const guide = readFileSync(
      join(here(), "../components/BossGuideModal.tsx"),
      "utf8",
    );
    assert.ok(guide.includes(CHESSBOARD_LICH_PHASE_GATE_GUIDE_NEEDLE));
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
    const lichKit = kits.slice(
      kits.indexOf("chessboard_lich: {"),
      kits.indexOf("mirror_sovereign: {"),
    );
    const p1 = lichKit.slice(lichKit.indexOf("phase1SpellIds:"));
    assert.ok(p1.includes(`"${CHESSBOARD_LICH_PHASE_GATE_KIT_FIRST}"`));
    const p2 = lichKit.slice(lichKit.indexOf("phase2SpellIds:"));
    assert.ok(p2.includes(`"${CHESSBOARD_LICH_PHASE_GATE_KIT_PHASE2}"`));
    assert.ok(
      p2.includes(`"${CHESSBOARD_LICH_PHASE_GATE_KIT_FIRST}"`),
      "phase-2 pool still leads with cursed-wound — kit-first leftover, not restored",
    );
    assert.equal(wound.id, CHESSBOARD_LICH_PHASE_GATE_KIT_FIRST);
    assert.equal(wisp.id, CHESSBOARD_LICH_PHASE_GATE_KIT_PHASE2);

    const rush = readFileSync(join(here(), "../hooks/useBossRush.ts"), "utf8");
    assert.ok(rush.includes('boss1Id: "chessboard_lich"'));
  });
});
