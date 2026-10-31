/**
 * Combat action parity: Mirror Sovereign phase 2 never arms at the
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
  MIRROR_SOVEREIGN_PHASE_GATE_ABILITY,
  MIRROR_SOVEREIGN_PHASE_GATE_ADVERTISED_THRESHOLD,
  MIRROR_SOVEREIGN_PHASE_GATE_BOSS_ID,
  MIRROR_SOVEREIGN_PHASE_GATE_FULL_HEAL,
  MIRROR_SOVEREIGN_PHASE_GATE_GUIDE_NEEDLE,
  MIRROR_SOVEREIGN_PHASE_GATE_HP,
  MIRROR_SOVEREIGN_PHASE_GATE_HP_AFTER,
  MIRROR_SOVEREIGN_PHASE_GATE_HP_AT_GUIDE,
  MIRROR_SOVEREIGN_PHASE_GATE_KIT_FIRST,
  MIRROR_SOVEREIGN_PHASE_GATE_KIT_PHASE2,
  MIRROR_SOVEREIGN_PHASE_GATE_LIVE_THRESHOLD,
  MIRROR_SOVEREIGN_PHASE_GATE_LORE_NEEDLE,
  MIRROR_SOVEREIGN_PHASE_GATE_MAX_HP_AFTER,
  MIRROR_SOVEREIGN_PHASE_GATE_MIRROR_LEFTOVER,
  MIRROR_SOVEREIGN_PHASE_GATE_STAT_MULT,
  advertisedMirrorSovereignPhaseThreshold,
  advertisedMirrorSovereignPhaseTransitioned,
  canExecuteMirrorSovereignPhaseGateHp,
  executeMirrorSovereignPhaseGateHp,
  executeSovereignPhaseGateHp,
  liveWxMirrorSovereignPhaseThreshold,
  liveWxMirrorSovereignPhaseTransitioned,
  liveWxMirrorSovereignReadsPhase2Threshold,
  mirrorSovereignHpFraction,
  resolveMirrorSovereignPhaseGate,
  shouldCommitMirrorSovereignPhaseGateHp,
  wxAppliesMirrorSovereignPhaseHpOnceTransitioned,
} from "./bossMirrorSovereignPhaseGateCommit.ts";

const strike = starterSpells.find((s) => s.id === "physical_attack");
assert.ok(strike, "physical_attack");
const blast = starterSpells.find((s) => s.id === "starter-blast");
assert.ok(blast, "starter-blast");
const mirror = starterSpells.find((s) => s.id === "spell-mirror");
assert.ok(mirror, "spell-mirror");

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
    bossId: overrides?.bossId ?? MIRROR_SOVEREIGN_PHASE_GATE_BOSS_ID,
    hp: overrides?.hp ?? MIRROR_SOVEREIGN_PHASE_GATE_HP_AT_GUIDE,
    maxHp: MIRROR_SOVEREIGN_PHASE_GATE_HP,
    alreadyPhase2: overrides?.alreadyPhase2 ?? false,
  };
}

describe("Mirror Sovereign advertised 50% phase gate vs live 0.0", () => {
  it("catalog 0.5 / 250 HP / ×1.5 / COMBO_REPLAY", () => {
    const defaults = readFileSync(
      join(here(), "../types/bossDefaults.ts"),
      "utf8",
    );
    const sovereign = defaults.slice(
      defaults.indexOf('id: "mirror_sovereign"'),
      defaults.indexOf('id: "starved_vampire_pawn"'),
    );
    assert.ok(
      sovereign.includes(`id: "${MIRROR_SOVEREIGN_PHASE_GATE_BOSS_ID}"`),
    );
    assert.ok(sovereign.includes("hp: 250"));
    assert.ok(sovereign.includes("hpThreshold: 0.5"));
    assert.ok(sovereign.includes("hpThreshold: 0.0"));
    assert.ok(sovereign.includes("statMultiplier: 1.5"));
    assert.ok(sovereign.includes("BossAbility.COMBO_REPLAY"));
    assert.ok(sovereign.includes("BossAbility.SPELL_MIRROR"));
    assert.ok(sovereign.includes(MIRROR_SOVEREIGN_PHASE_GATE_LORE_NEEDLE));
    assert.equal(MIRROR_SOVEREIGN_PHASE_GATE_HP, 250);
    assert.equal(MIRROR_SOVEREIGN_PHASE_GATE_ADVERTISED_THRESHOLD, 0.5);
    assert.equal(MIRROR_SOVEREIGN_PHASE_GATE_LIVE_THRESHOLD, 0.0);
    assert.equal(MIRROR_SOVEREIGN_PHASE_GATE_HP_AT_GUIDE, 125);
    assert.equal(250 * 0.5, 125);
    assert.equal(MIRROR_SOVEREIGN_PHASE_GATE_STAT_MULT, 1.5);
    assert.equal(MIRROR_SOVEREIGN_PHASE_GATE_FULL_HEAL, false);
    assert.equal(
      mirrorSovereignHpFraction(
        MIRROR_SOVEREIGN_PHASE_GATE_HP_AT_GUIDE,
        MIRROR_SOVEREIGN_PHASE_GATE_HP,
      ),
      0.5,
    );
    assert.equal(advertisedMirrorSovereignPhaseThreshold(), 0.5);
    assert.equal(liveWxMirrorSovereignPhaseThreshold(), 0.0);
    assert.notEqual(
      advertisedMirrorSovereignPhaseThreshold(),
      liveWxMirrorSovereignPhaseThreshold(),
    );
    assert.equal(blast.id, MIRROR_SOVEREIGN_PHASE_GATE_KIT_FIRST);
    assert.equal(mirror.id, MIRROR_SOVEREIGN_PHASE_GATE_KIT_PHASE2);
    assert.equal(Number(mirror.damage), 0);
    assert.equal(STRIKE_DAMAGE, 10);
    assert.deepEqual(hpAfterBossPhase2(125, 250, 1.5, false), {
      hp: 188,
      maxHp: 375,
    });
    assert.deepEqual(
      hpAfterBossPhase2(125, 250, 1.5, true),
      { hp: 375, maxHp: 375 },
      "full-heal ×1.5 is 375/375 — Weeping ISSUE 5, not this scaled fire",
    );
    assert.equal(MIRROR_SOVEREIGN_PHASE_GATE_HP_AFTER, 188);
    assert.equal(MIRROR_SOVEREIGN_PHASE_GATE_MAX_HP_AFTER, 375);

    const queen = defaults.slice(
      defaults.indexOf('id: "starborn_queen"'),
      defaults.indexOf('id: "fetid_rook"'),
    );
    assert.ok(
      queen.includes("hp: 380"),
      "Queen #1347 is ×1.5 at 50% of 380 — this sidecar is Sovereign 250",
    );
    const lich = defaults.slice(
      defaults.indexOf('id: "chessboard_lich"'),
      defaults.indexOf('id: "mirror_sovereign"'),
    );
    assert.ok(
      lich.includes("hp: 200"),
      "Lich #1353 is ×1.3 at 50% of 200 — this sidecar is Sovereign 250",
    );
    const fortress = defaults.slice(
      defaults.indexOf('id: "alabaster_fortress"'),
      defaults.indexOf('id: "chessboard_lich"'),
    );
    assert.ok(
      fortress.includes("hp: 400"),
      "Fortress #1352 is ×1.2 at 30% of 400 — this sidecar is Sovereign 250",
    );
    const king = defaults.slice(
      defaults.indexOf('id: "eternal_pawn_king"'),
      defaults.indexOf('id: "midnight_bishop"'),
    );
    assert.ok(
      king.includes("hp: 450"),
      "Eternal #1349 is ×1.3 at 50% of 450 — this sidecar is Sovereign 250",
    );
    const bishop = defaults.slice(
      defaults.indexOf('id: "midnight_bishop"'),
      defaults.indexOf('id: "broodmother_rook"'),
    );
    assert.ok(
      bishop.includes("hp: 360"),
      "Midnight Bishop #1345 is ×2.0 at 25% of 360 — this sidecar is Sovereign 250",
    );
    const weeping = defaults.slice(
      defaults.indexOf('id: "weeping_pawn"'),
      defaults.indexOf('id: "starborn_queen"'),
    );
    assert.ok(
      weeping.includes("hp: 500"),
      "Weeping #1343 is ×2.0 at 30% of 500 — this sidecar is Sovereign 250",
    );
    const staticBoss = defaults.slice(
      defaults.indexOf('id: "lord_of_static"'),
      defaults.indexOf('id: "final_pawn"'),
    );
    assert.ok(
      staticBoss.includes("hp: 340"),
      "Static #1342 is ×1.5 at 40% of 340 — this sidecar is Sovereign 250",
    );
    const cavalier = defaults.slice(
      defaults.indexOf('id: "bone_cavalier"'),
      defaults.indexOf('id: "weeping_pawn"'),
    );
    assert.ok(
      cavalier.includes("hp: 320"),
      "Cavalier #1337/#1338 is ×1.6 at 50% of 320 — this sidecar is Sovereign 250",
    );
    const grandmaster = defaults.slice(
      defaults.indexOf('id: "void_grandmaster"'),
      defaults.indexOf('id: "bone_cavalier"'),
    );
    assert.ok(
      grandmaster.includes("hp: 300"),
      "Grandmaster #1336 is ×1.3 at 60% of 300 — this sidecar is Sovereign 250",
    );
    const broodmother = defaults.slice(
      defaults.indexOf('id: "broodmother_rook"'),
      defaults.indexOf('id: "lord_of_static"'),
    );
    assert.ok(
      broodmother.includes("hp: 480"),
      "Broodmother #1333 is ×1.4 at 50% of 480 — this sidecar is Sovereign 250",
    );
    const archbishop = defaults.slice(
      defaults.indexOf('id: "pale_archbishop"'),
      defaults.indexOf('id: "crimson_countess"'),
    );
    assert.ok(
      archbishop.includes("hp: 350"),
      "Archbishop #1332 is ×1.4 at 50% of 350 — this sidecar is Sovereign 250",
    );
    const countess = defaults.slice(
      defaults.indexOf('id: "crimson_countess"'),
      defaults.indexOf('id: "void_grandmaster"'),
    );
    assert.ok(
      countess.includes("hp: 400"),
      "Countess #1329 is ×1.5 at 40% of 400 — this sidecar is Sovereign 250",
    );
    const fetid = defaults.slice(
      defaults.indexOf('id: "fetid_rook"'),
      defaults.indexOf('id: "eternal_pawn_king"'),
    );
    assert.ok(
      fetid.includes("statMultiplier: 1.0"),
      "Fetid #1325 has no ×1.5 HP fire — this sidecar is Sovereign-only",
    );
    const archivist = defaults.slice(
      defaults.indexOf('id: "pale_archivist"'),
      defaults.indexOf('id: "twin_monarchs"'),
    );
    assert.ok(
      archivist.includes("hp: 350"),
      "Pale Archivist PAGES 40% ×1.2 of 350 is a sibling leftover",
    );
    const twin = defaults.slice(
      defaults.indexOf('id: "twin_monarchs"'),
      defaults.indexOf('id: "enthroned_void"'),
    );
    assert.ok(
      twin.includes("hp: 300"),
      "Twin Monarchs MONARCH_ABSORB 1% ×1.4 of 300 is a sibling leftover",
    );
  });

  it("live 125/250 does not transition; advertised 50% does", () => {
    const atGuide = {
      hp: MIRROR_SOVEREIGN_PHASE_GATE_HP_AT_GUIDE,
      maxHp: MIRROR_SOVEREIGN_PHASE_GATE_HP,
      alreadyPhase2: false,
    };
    assert.equal(liveWxMirrorSovereignPhaseTransitioned(atGuide), false);
    assert.equal(advertisedMirrorSovereignPhaseTransitioned(atGuide), true);
    assert.equal(resolveMirrorSovereignPhaseGate(atGuide), 2);
    assert.equal(liveWxMirrorSovereignReadsPhase2Threshold(), true);
    assert.equal(wxAppliesMirrorSovereignPhaseHpOnceTransitioned(), true);

    const above = {
      hp: MIRROR_SOVEREIGN_PHASE_GATE_HP_AT_GUIDE + 1,
      maxHp: MIRROR_SOVEREIGN_PHASE_GATE_HP,
      alreadyPhase2: false,
    };
    assert.equal(advertisedMirrorSovereignPhaseTransitioned(above), false);
    assert.equal(liveWxMirrorSovereignPhaseTransitioned(above), false);
    assert.equal(resolveMirrorSovereignPhaseGate(above), null);
    assert.equal(
      executeMirrorSovereignPhaseGateHp(gateReady({ hp: 126 })),
      null,
    );

    const dying = {
      hp: 1,
      maxHp: MIRROR_SOVEREIGN_PHASE_GATE_HP,
      alreadyPhase2: false,
    };
    assert.equal(
      liveWxMirrorSovereignPhaseTransitioned(dying),
      false,
      "live 0.0 still refuses a 1 HP Sovereign — only hp 0 satisfies it",
    );
    assert.equal(advertisedMirrorSovereignPhaseTransitioned(dying), true);
    assert.equal(
      liveWxMirrorSovereignPhaseTransitioned({
        hp: 0,
        maxHp: MIRROR_SOVEREIGN_PHASE_GATE_HP,
        alreadyPhase2: false,
      }),
      true,
      "live only arms when the Sovereign is already dead",
    );
  });
});

describe("player-visible Mirror Sovereign HP after advertised 50% ×1.5", () => {
  it("commits 188/375; live 0.0 leaves 125/250", () => {
    const ready = gateReady();
    const decided = shouldCommitMirrorSovereignPhaseGateHp(ready);
    const executable = canExecuteMirrorSovereignPhaseGateHp(ready);
    assert.equal(decided, true);
    assert.equal(executable, true);

    const next = executeMirrorSovereignPhaseGateHp(ready);
    assert.deepEqual(next, {
      phase: 2,
      hp: 188,
      maxHp: 375,
    });
    assert.deepEqual(executeSovereignPhaseGateHp(ready), next);
    assert.equal(
      liveWxMirrorSovereignPhaseTransitioned({
        hp: ready.hp,
        maxHp: ready.maxHp,
        alreadyPhase2: false,
      }),
      false,
    );
  });

  it("10 HP Sovereign: advertised 50% already armed so ×1.5 still commits 15/375", () => {
    const ready = gateReady({ hp: 10 });
    const next = executeMirrorSovereignPhaseGateHp(ready);
    assert.deepEqual(next, {
      phase: 2,
      hp: 15,
      maxHp: 375,
    });
    assert.equal(
      liveWxMirrorSovereignPhaseTransitioned({
        hp: 10,
        maxHp: MIRROR_SOVEREIGN_PHASE_GATE_HP,
        alreadyPhase2: false,
      }),
      false,
    );
    assert.deepEqual(hpAfterBossPhase2(10, 250, 1.5, false), {
      hp: 15,
      maxHp: 375,
    });
    assert.deepEqual(
      hpAfterBossPhase2(10, 380, 1.5, false),
      { hp: 15, maxHp: 570 },
      "Queen #1347 10 HP ×1.5 of 380 is 15/570 — not this Sovereign 15/375",
    );
    assert.deepEqual(
      hpAfterBossPhase2(10, 340, 1.5, false),
      { hp: 15, maxHp: 510 },
      "Static #1342 10 HP ×1.5 of 340 is 15/510 — not this Sovereign 15/375",
    );
    assert.deepEqual(
      hpAfterBossPhase2(10, 400, 1.5, false),
      { hp: 15, maxHp: 600 },
      "Countess #1329 10 HP ×1.5 of 400 is 15/600 — not this Sovereign 15/375",
    );
    assert.deepEqual(
      hpAfterBossPhase2(10, 200, 1.3, false),
      { hp: 13, maxHp: 260 },
      "Lich #1353 10 HP ×1.3 of 200 is 13/260 — not this ×1.5",
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
      "advertised 15 HP Sovereign survives Strike 10",
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
      "live 10 HP Sovereign dies to Strike 10 because phase 2 never armed",
    );
  });

  it("refuses already-phase-2, other bosses, and does not stamp leftovers", () => {
    const ready = gateReady();
    assert.equal(
      executeMirrorSovereignPhaseGateHp({
        ...ready,
        alreadyPhase2: true,
      }),
      null,
      "already-phase-2 does not re-apply ×1.5",
    );
    assert.equal(
      resolveMirrorSovereignPhaseGate({
        bossId: "starborn_queen",
        hp: MIRROR_SOVEREIGN_PHASE_GATE_HP_AT_GUIDE,
        maxHp: MIRROR_SOVEREIGN_PHASE_GATE_HP,
        alreadyPhase2: false,
      }),
      null,
      "Queen ×1.5 50% of 380 is owned #1347",
    );
    assert.equal(
      executeMirrorSovereignPhaseGateHp({
        ...ready,
        bossId: "chessboard_lich",
      }),
      null,
      "Lich ×1.3 50% of 200 is owned #1353",
    );
    assert.equal(
      executeMirrorSovereignPhaseGateHp({
        ...ready,
        bossId: "alabaster_fortress",
      }),
      null,
      "Fortress ×1.2 30% of 400 is owned #1352",
    );
    assert.equal(
      executeMirrorSovereignPhaseGateHp({
        ...ready,
        bossId: "eternal_pawn_king",
      }),
      null,
      "Eternal ×1.3 50% of 450 is owned #1349",
    );
    assert.equal(
      executeMirrorSovereignPhaseGateHp({
        ...ready,
        bossId: "midnight_bishop",
      }),
      null,
      "Midnight Bishop ×2.0 25% of 360 is owned #1345",
    );
    assert.equal(
      executeMirrorSovereignPhaseGateHp({
        ...ready,
        bossId: "weeping_pawn",
      }),
      null,
      "Weeping ×2.0 30% of 500 full-heal is owned #1343",
    );
    assert.equal(
      executeMirrorSovereignPhaseGateHp({
        ...ready,
        bossId: "lord_of_static",
      }),
      null,
      "Static ×1.5 40% of 340 is owned #1342",
    );
    assert.equal(
      executeMirrorSovereignPhaseGateHp({
        ...ready,
        bossId: "bone_cavalier",
      }),
      null,
      "Cavalier ×1.6 50% of 320 is owned #1337/#1338",
    );
    assert.equal(
      executeMirrorSovereignPhaseGateHp({
        ...ready,
        bossId: "void_grandmaster",
      }),
      null,
      "Grandmaster ×1.3 60% of 300 is owned #1336",
    );
    assert.equal(
      executeMirrorSovereignPhaseGateHp({
        ...ready,
        bossId: "broodmother_rook",
      }),
      null,
      "Broodmother ×1.4 50% of 480 is owned #1333",
    );
    assert.equal(
      executeMirrorSovereignPhaseGateHp({
        ...ready,
        bossId: "pale_archbishop",
      }),
      null,
      "Archbishop ×1.4 50% of 350 is owned #1332",
    );
    assert.equal(
      executeMirrorSovereignPhaseGateHp({
        ...ready,
        bossId: "crimson_countess",
      }),
      null,
      "Countess ×1.5 40% of 400 is owned #1329",
    );
    assert.equal(
      executeMirrorSovereignPhaseGateHp({
        ...ready,
        bossId: "fetid_rook",
      }),
      null,
      "Fetid Split 40% gate is owned #1325",
    );
    assert.equal(
      executeMirrorSovereignPhaseGateHp({
        ...ready,
        bossId: "pale_archivist",
      }),
      null,
      "Pale Archivist PAGES 40% ×1.2 leftover is not this Sovereign gate",
    );
    assert.equal(
      executeMirrorSovereignPhaseGateHp({
        ...ready,
        bossId: "twin_monarchs",
      }),
      null,
      "Twin Monarchs MONARCH_ABSORB leftover is not this Sovereign gate",
    );
    assert.equal(
      executeMirrorSovereignPhaseGateHp({
        ...ready,
        bossId: "enthroned_void",
      }),
      null,
      "Enthroned Void AP_DRAIN_PASSIVE leftover is not this Sovereign gate",
    );
    assert.equal(
      executeMirrorSovereignPhaseGateHp({
        ...ready,
        bossId: "final_pawn",
      }),
      null,
      "Final Pawn HP≤10% GHOST leftover of #1247",
    );

    const crit = executeMirrorSovereignPhaseGateHp(ready);
    assert.ok(crit);
    assert.equal("atk" in crit, false, "base atk 20 leftover stays unrestored");
    assert.equal("ap" in crit, false);
    assert.equal("res" in crit, false);
    assert.equal("chc" in crit, false, "#1104 owns boss kit CHC");
    assert.equal("combo" in crit, false, "COMBO_REPLAY leftover");
    assert.equal("replay" in crit, false);
    assert.equal(
      "mirror" in crit,
      false,
      "SPELL_MIRROR already lives on phase 1",
    );
    assert.equal("blast" in crit, false, "kit-first starter-blast leftover");
    assert.equal("mark" in crit, false);
    assert.equal("veil" in crit, false);
    assert.equal("swap" in crit, false, "#1339 owns kit Swap execute");
    assert.equal("void" in crit, false, "#1347 owns Queen VOID");
    assert.equal("lines" in crit, false);
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
    assert.equal("drain" in crit, false, "#1349 owns Eternal AP_DRAIN");
    assert.equal(
      "advance" in crit,
      false,
      "#1349 owns Eternal ADVANCE leftover",
    );
    assert.equal("slow" in crit, false, "#1204 owns kit-first Slow");
    assert.equal("iron" in crit, false, "#1339 owns kit Iron Skin");
    assert.equal("heal" in crit, false, "#1343 owns Weeping fullHeal");
    assert.equal("shrink" in crit, false, "#1352 owns Fortress BOARD_SHRINK");
    assert.equal("board" in crit, false);
    assert.equal("rotate" in crit, false, "#1161 owns MAP_ROTATE crumbs");
    assert.equal("invert" in crit, false, "#1353 owns Lich MIRROR_INVERT");
    assert.equal("claim" in crit, false, "#1353 owns Lich BOARD_CLAIM");
    assert.equal("pages" in crit, false, "Archivist PAGES leftover");
    assert.equal("rally" in crit, false);
    assert.equal(MIRROR_SOVEREIGN_PHASE_GATE_ABILITY, "COMBO_REPLAY");
    assert.equal(MIRROR_SOVEREIGN_PHASE_GATE_MIRROR_LEFTOVER, "SPELL_MIRROR");
    assert.equal(MIRROR_SOVEREIGN_PHASE_GATE_KIT_FIRST, "starter-blast");
    assert.equal(MIRROR_SOVEREIGN_PHASE_GATE_KIT_PHASE2, "spell-mirror");
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
    assert.equal(body.includes("resolveMirrorSovereignPhaseGate"), false);
    assert.equal(body.includes("executeMirrorSovereignPhaseGateHp"), false);

    const combo = src.slice(
      src.indexOf("function applyComboReplay("),
      src.indexOf("function applyLifeDrain("),
    );
    assert.ok(
      combo.includes(
        "The Mirror Sovereign replays your last 3 turns as a devastating combo!",
      ),
    );
    assert.ok(combo.includes("lastThreeTurnsMirror"));
  });

  it("decideMirrorSovereignAction still kit-first then currentPhase 2 COMBO_REPLAY", () => {
    const src = readFileSync(join(here(), "../hooks/useBossAI.ts"), "utf8");
    const start = src.indexOf("export const decideMirrorSovereignAction");
    const end = src.indexOf("export const decideStarvedVampirePawnAction");
    assert.ok(start >= 0 && end > start, "Sovereign decide is present");
    const body = src.slice(start, end);
    const kitIdx = body.indexOf("pickBossKitSpell");
    const comboIdx = body.indexOf("BossAbility.COMBO_REPLAY");
    const mirrorIdx = body.indexOf("BossAbility.SPELL_MIRROR");
    assert.ok(kitIdx >= 0, "kit pick is present");
    assert.ok(comboIdx >= 0, "COMBO_REPLAY is present");
    assert.ok(mirrorIdx >= 0, "SPELL_MIRROR is present");
    assert.ok(kitIdx < comboIdx, "kit still wins the combo turn");
    assert.ok(comboIdx < mirrorIdx, "combo still precedes SPELL_MIRROR");
    assert.ok(body.includes("bossState.currentPhase === 2"));
    assert.ok(body.includes("new Map<string, number>()"));
    assert.equal(body.includes("resolveMirrorSovereignPhaseGate"), false);
    assert.equal(body.includes("executeMirrorSovereignPhaseGateHp"), false);
    assert.equal(body.includes("phase1.hpThreshold"), false);
  });

  it("WorldExploration still scales Sovereign only after checkPhaseTransition", () => {
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
      "WX still special-cases Weeping fullHeal — Sovereign stays false",
    );
    assert.ok(wx.includes("isWeepingPawn"));
    assert.equal(wx.includes("resolveMirrorSovereignPhaseGate"), false);
    assert.equal(wx.includes("executeMirrorSovereignPhaseGateHp"), false);
    assert.equal(
      wx.includes("config.phase1.hpThreshold"),
      false,
      "WX still never substitutes the advertised 50% card",
    );
  });

  it("Boss Guide still advertises COMBO_REPLAY at phase1 50%", () => {
    const guide = readFileSync(
      join(here(), "../components/BossGuideModal.tsx"),
      "utf8",
    );
    assert.ok(guide.includes(MIRROR_SOVEREIGN_PHASE_GATE_GUIDE_NEEDLE));
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
    const sovereignKit = kits.slice(
      kits.indexOf("mirror_sovereign: {"),
      kits.indexOf("starved_vampire_pawn: {"),
    );
    const p1 = sovereignKit.slice(
      sovereignKit.indexOf("phase1SpellIds:"),
      sovereignKit.indexOf("phase2SpellIds:"),
    );
    assert.ok(p1.includes(`"${MIRROR_SOVEREIGN_PHASE_GATE_KIT_FIRST}"`));
    const p2 = sovereignKit.slice(sovereignKit.indexOf("phase2SpellIds:"));
    assert.ok(p2.includes(`"${MIRROR_SOVEREIGN_PHASE_GATE_KIT_PHASE2}"`));
    assert.equal(
      p2.includes(`"${MIRROR_SOVEREIGN_PHASE_GATE_KIT_FIRST}"`),
      false,
      "starter-blast is phase-1 first-id, not the phase-2 COMBO shadow",
    );
    assert.equal(blast.id, MIRROR_SOVEREIGN_PHASE_GATE_KIT_FIRST);
    assert.equal(mirror.id, MIRROR_SOVEREIGN_PHASE_GATE_KIT_PHASE2);

    const rush = readFileSync(join(here(), "../hooks/useBossRush.ts"), "utf8");
    assert.ok(rush.includes('boss2Id: "mirror_sovereign"'));
  });
});
