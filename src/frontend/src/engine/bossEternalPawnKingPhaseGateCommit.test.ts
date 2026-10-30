/**
 * Combat action parity: Eternal Pawn King phase 2 never arms at the
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
  ETERNAL_PAWN_KING_PHASE_GATE_ABILITY,
  ETERNAL_PAWN_KING_PHASE_GATE_ADVANCE_LEFTOVER,
  ETERNAL_PAWN_KING_PHASE_GATE_ADVERTISED_THRESHOLD,
  ETERNAL_PAWN_KING_PHASE_GATE_BOSS_ID,
  ETERNAL_PAWN_KING_PHASE_GATE_GUIDE_NEEDLE,
  ETERNAL_PAWN_KING_PHASE_GATE_HP,
  ETERNAL_PAWN_KING_PHASE_GATE_HP_AFTER,
  ETERNAL_PAWN_KING_PHASE_GATE_HP_AT_GUIDE,
  ETERNAL_PAWN_KING_PHASE_GATE_KIT_FIRST,
  ETERNAL_PAWN_KING_PHASE_GATE_KIT_PHASE2,
  ETERNAL_PAWN_KING_PHASE_GATE_LIVE_THRESHOLD,
  ETERNAL_PAWN_KING_PHASE_GATE_LORE_NEEDLE,
  ETERNAL_PAWN_KING_PHASE_GATE_MAX_HP_AFTER,
  ETERNAL_PAWN_KING_PHASE_GATE_STAT_MULT,
  advertisedEternalPawnKingPhaseThreshold,
  advertisedEternalPawnKingPhaseTransitioned,
  canExecuteEternalPawnKingPhaseGateHp,
  eternalPawnKingHpFraction,
  executeEternalPawnKingPhaseGateHp,
  liveWxEternalPawnKingPhaseThreshold,
  liveWxEternalPawnKingPhaseTransitioned,
  liveWxEternalPawnKingReadsPhase2Threshold,
  resolveEternalPawnKingPhaseGate,
  shouldCommitEternalPawnKingPhaseGateHp,
  wxAppliesEternalPawnKingPhaseHpOnceTransitioned,
} from "./bossEternalPawnKingPhaseGateCommit.ts";

const strike = starterSpells.find((s) => s.id === "physical_attack");
assert.ok(strike, "physical_attack");
const slow = starterSpells.find((s) => s.id === "spell-slow");
assert.ok(slow, "spell-slow");
const ironSkin = starterSpells.find((s) => s.id === "spell-iron-skin");
assert.ok(ironSkin, "spell-iron-skin");

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
    bossId: overrides?.bossId ?? ETERNAL_PAWN_KING_PHASE_GATE_BOSS_ID,
    hp: overrides?.hp ?? ETERNAL_PAWN_KING_PHASE_GATE_HP_AT_GUIDE,
    maxHp: ETERNAL_PAWN_KING_PHASE_GATE_HP,
    alreadyPhase2: overrides?.alreadyPhase2 ?? false,
  };
}

describe("Eternal Pawn King advertised 50% phase gate vs live 0.0", () => {
  it("catalog 0.5 / 450 HP / ×1.3 stay distinct from live phase2 0.0 and kit Slow", () => {
    const defaults = readFileSync(
      join(here(), "../types/bossDefaults.ts"),
      "utf8",
    );
    const king = defaults.slice(
      defaults.indexOf('id: "eternal_pawn_king"'),
      defaults.indexOf('id: "midnight_bishop"'),
    );
    assert.ok(king.includes(`id: "${ETERNAL_PAWN_KING_PHASE_GATE_BOSS_ID}"`));
    assert.ok(king.includes("hp: 450"));
    assert.ok(king.includes("hpThreshold: 0.5"));
    assert.ok(king.includes("hpThreshold: 0.0"));
    assert.ok(king.includes("statMultiplier: 1.3"));
    assert.ok(king.includes("BossAbility.AP_DRAIN"));
    assert.ok(king.includes("BossAbility.ADVANCE_PER_TURN"));
    assert.ok(king.includes(ETERNAL_PAWN_KING_PHASE_GATE_LORE_NEEDLE));
    assert.equal(ETERNAL_PAWN_KING_PHASE_GATE_HP, 450);
    assert.equal(ETERNAL_PAWN_KING_PHASE_GATE_ADVERTISED_THRESHOLD, 0.5);
    assert.equal(ETERNAL_PAWN_KING_PHASE_GATE_LIVE_THRESHOLD, 0.0);
    assert.equal(ETERNAL_PAWN_KING_PHASE_GATE_HP_AT_GUIDE, 225);
    assert.equal(450 * 0.5, 225);
    assert.equal(ETERNAL_PAWN_KING_PHASE_GATE_STAT_MULT, 1.3);
    assert.equal(
      eternalPawnKingHpFraction(
        ETERNAL_PAWN_KING_PHASE_GATE_HP_AT_GUIDE,
        ETERNAL_PAWN_KING_PHASE_GATE_HP,
      ),
      0.5,
    );
    assert.equal(advertisedEternalPawnKingPhaseThreshold(), 0.5);
    assert.equal(liveWxEternalPawnKingPhaseThreshold(), 0.0);
    assert.notEqual(
      advertisedEternalPawnKingPhaseThreshold(),
      liveWxEternalPawnKingPhaseThreshold(),
    );
    assert.equal(slow.id, ETERNAL_PAWN_KING_PHASE_GATE_KIT_FIRST);
    assert.equal(ironSkin.id, ETERNAL_PAWN_KING_PHASE_GATE_KIT_PHASE2);
    assert.equal(STRIKE_DAMAGE, 10);
    assert.deepEqual(hpAfterBossPhase2(225, 450, 1.3, false), {
      hp: 293,
      maxHp: 585,
    });
    assert.equal(ETERNAL_PAWN_KING_PHASE_GATE_HP_AFTER, 293);
    assert.equal(ETERNAL_PAWN_KING_PHASE_GATE_MAX_HP_AFTER, 585);

    const grandmaster = defaults.slice(
      defaults.indexOf('id: "void_grandmaster"'),
      defaults.indexOf('id: "bone_cavalier"'),
    );
    assert.ok(
      grandmaster.includes("hp: 300"),
      "Grandmaster #1336 is ×1.3 at 60% of 300 — this sidecar is King 450",
    );
    const queen = defaults.slice(
      defaults.indexOf('id: "starborn_queen"'),
      defaults.indexOf('id: "fetid_rook"'),
    );
    assert.ok(
      queen.includes("hp: 380"),
      "Queen #1347/#1349 is ×1.5 at 50% of 380 — this sidecar is King 450",
    );
    const cavalier = defaults.slice(
      defaults.indexOf('id: "bone_cavalier"'),
      defaults.indexOf('id: "weeping_pawn"'),
    );
    assert.ok(
      cavalier.includes("hp: 320"),
      "Cavalier #1338 is ×1.6 at 50% of 320 — this sidecar is King 450",
    );
    const bishop = defaults.slice(
      defaults.indexOf('id: "midnight_bishop"'),
      defaults.indexOf('id: "broodmother_rook"'),
    );
    assert.ok(
      bishop.includes("hp: 360"),
      "Midnight Bishop #1345 is ×2.0 at 25% of 360 — this sidecar is King 450",
    );
    const weeping = defaults.slice(
      defaults.indexOf('id: "weeping_pawn"'),
      defaults.indexOf('id: "starborn_queen"'),
    );
    assert.ok(
      weeping.includes("hp: 500"),
      "Weeping #1343 is ×2.0 at 30% of 500 — this sidecar is King 450",
    );
    const staticBoss = defaults.slice(
      defaults.indexOf('id: "lord_of_static"'),
      defaults.indexOf('id: "final_pawn"'),
    );
    assert.ok(
      staticBoss.includes("hp: 340"),
      "Static #1342 is ×1.5 at 40% of 340 — this sidecar is King 450",
    );
    const fetid = defaults.slice(
      defaults.indexOf('id: "fetid_rook"'),
      defaults.indexOf('id: "eternal_pawn_king"'),
    );
    assert.ok(
      fetid.includes("statMultiplier: 1.0"),
      "Fetid #1325 has no ×1.3 HP fire — this sidecar is King-only",
    );
  });

  it("live 225/450 does not transition; advertised 50% does", () => {
    const atGuide = {
      hp: ETERNAL_PAWN_KING_PHASE_GATE_HP_AT_GUIDE,
      maxHp: ETERNAL_PAWN_KING_PHASE_GATE_HP,
      alreadyPhase2: false,
    };
    assert.equal(liveWxEternalPawnKingPhaseTransitioned(atGuide), false);
    assert.equal(advertisedEternalPawnKingPhaseTransitioned(atGuide), true);
    assert.equal(resolveEternalPawnKingPhaseGate(atGuide), 2);
    assert.equal(liveWxEternalPawnKingReadsPhase2Threshold(), true);
    assert.equal(wxAppliesEternalPawnKingPhaseHpOnceTransitioned(), true);

    const above = {
      hp: ETERNAL_PAWN_KING_PHASE_GATE_HP_AT_GUIDE + 1,
      maxHp: ETERNAL_PAWN_KING_PHASE_GATE_HP,
      alreadyPhase2: false,
    };
    assert.equal(advertisedEternalPawnKingPhaseTransitioned(above), false);
    assert.equal(liveWxEternalPawnKingPhaseTransitioned(above), false);
    assert.equal(resolveEternalPawnKingPhaseGate(above), null);
    assert.equal(
      executeEternalPawnKingPhaseGateHp(gateReady({ hp: 226 })),
      null,
    );

    const dying = {
      hp: 1,
      maxHp: ETERNAL_PAWN_KING_PHASE_GATE_HP,
      alreadyPhase2: false,
    };
    assert.equal(
      liveWxEternalPawnKingPhaseTransitioned(dying),
      false,
      "live 0.0 still refuses a 1 HP King — only hp 0 satisfies it",
    );
    assert.equal(advertisedEternalPawnKingPhaseTransitioned(dying), true);
    assert.equal(
      liveWxEternalPawnKingPhaseTransitioned({
        hp: 0,
        maxHp: ETERNAL_PAWN_KING_PHASE_GATE_HP,
        alreadyPhase2: false,
      }),
      true,
      "live only arms when the King is already dead",
    );
  });
});

describe("player-visible Eternal Pawn King HP after advertised 50% ×1.3", () => {
  it("commits 293/585; live 0.0 leaves 225/450", () => {
    const ready = gateReady();
    const decided = shouldCommitEternalPawnKingPhaseGateHp(ready);
    const executable = canExecuteEternalPawnKingPhaseGateHp(ready);
    assert.equal(decided, true);
    assert.equal(executable, true);

    const next = executeEternalPawnKingPhaseGateHp(ready);
    assert.deepEqual(next, {
      phase: 2,
      hp: 293,
      maxHp: 585,
    });
    assert.equal(
      liveWxEternalPawnKingPhaseTransitioned({
        hp: ready.hp,
        maxHp: ready.maxHp,
        alreadyPhase2: false,
      }),
      false,
    );
  });

  it("10 HP King: advertised 50% already armed so ×1.3 still commits", () => {
    const ready = gateReady({ hp: 10 });
    const next = executeEternalPawnKingPhaseGateHp(ready);
    assert.deepEqual(next, {
      phase: 2,
      hp: 13,
      maxHp: 585,
    });
    assert.equal(
      liveWxEternalPawnKingPhaseTransitioned({
        hp: 10,
        maxHp: ETERNAL_PAWN_KING_PHASE_GATE_HP,
        alreadyPhase2: false,
      }),
      false,
    );
    assert.deepEqual(hpAfterBossPhase2(10, 450, 1.3, false), {
      hp: 13,
      maxHp: 585,
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

  it("cannot stamp sibling leftovers, already-phase-2, or extra payloads", () => {
    const ready = gateReady();
    assert.equal(
      executeEternalPawnKingPhaseGateHp({
        ...ready,
        alreadyPhase2: true,
      }),
      null,
      "already-phase-2 does not re-apply ×1.3",
    );
    assert.equal(
      resolveEternalPawnKingPhaseGate({
        bossId: "starborn_queen",
        hp: ETERNAL_PAWN_KING_PHASE_GATE_HP_AT_GUIDE,
        maxHp: ETERNAL_PAWN_KING_PHASE_GATE_HP,
        alreadyPhase2: false,
      }),
      null,
      "Queen ×1.5 50% of 380 is owned #1347/#1349",
    );
    assert.equal(
      executeEternalPawnKingPhaseGateHp({
        ...ready,
        bossId: "midnight_bishop",
      }),
      null,
      "Midnight Bishop ×2.0 25% of 360 is owned #1345",
    );
    assert.equal(
      executeEternalPawnKingPhaseGateHp({
        ...ready,
        bossId: "weeping_pawn",
      }),
      null,
      "Weeping PROMOTE 30% ×2.0 fullHeal is owned #1343",
    );
    assert.equal(
      executeEternalPawnKingPhaseGateHp({
        ...ready,
        bossId: "lord_of_static",
      }),
      null,
      "Static ×1.5 40% of 340 is owned #1342",
    );
    assert.equal(
      executeEternalPawnKingPhaseGateHp({
        ...ready,
        bossId: "bone_cavalier",
      }),
      null,
      "Cavalier ×1.6 50% of 320 is owned #1338",
    );
    assert.equal(
      resolveEternalPawnKingPhaseGate({
        bossId: "void_grandmaster",
        hp: ETERNAL_PAWN_KING_PHASE_GATE_HP_AT_GUIDE,
        maxHp: ETERNAL_PAWN_KING_PHASE_GATE_HP,
        alreadyPhase2: false,
      }),
      null,
      "Grandmaster ×1.3 60% of 300 is owned #1336",
    );
    assert.equal(
      executeEternalPawnKingPhaseGateHp({
        ...ready,
        bossId: "broodmother_rook",
      }),
      null,
      "Broodmother ×1.4 50% of 480 is owned #1333",
    );
    assert.equal(
      executeEternalPawnKingPhaseGateHp({
        ...ready,
        bossId: "pale_archbishop",
      }),
      null,
      "Archbishop ×1.4 50% of 350 is owned #1332",
    );
    assert.equal(
      executeEternalPawnKingPhaseGateHp({
        ...ready,
        bossId: "crimson_countess",
      }),
      null,
      "Countess ×1.5 40% of 400 is owned #1329",
    );
    assert.equal(
      executeEternalPawnKingPhaseGateHp({
        ...ready,
        bossId: "fetid_rook",
      }),
      null,
      "Fetid Split 40% gate is owned #1325",
    );
    assert.equal(
      executeEternalPawnKingPhaseGateHp({
        ...ready,
        bossId: "alabaster_fortress",
      }),
      null,
      "Alabaster BOARD_SHRINK leftover is not this King gate",
    );
    assert.equal(
      executeEternalPawnKingPhaseGateHp({
        ...ready,
        bossId: "chessboard_lich",
      }),
      null,
    );
    assert.equal(
      executeEternalPawnKingPhaseGateHp({
        ...ready,
        bossId: "mirror_sovereign",
      }),
      null,
    );
    assert.equal(
      executeEternalPawnKingPhaseGateHp({
        ...ready,
        bossId: "pale_archivist",
      }),
      null,
    );
    assert.equal(
      executeEternalPawnKingPhaseGateHp({
        ...ready,
        bossId: "final_pawn",
      }),
      null,
      "Final Pawn HP≤10% GHOST leftover of #1247",
    );

    const crit = executeEternalPawnKingPhaseGateHp(ready);
    assert.ok(crit);
    assert.equal("atk" in crit, false, "base atk 30 leftover stays unrestored");
    assert.equal("ap" in crit, false);
    assert.equal("res" in crit, false);
    assert.equal("chc" in crit, false, "#1104 owns boss kit CHC");
    assert.equal(
      "drain" in crit,
      false,
      "#1204 owns kit-first Slow vs AP Drain",
    );
    assert.equal("advance" in crit, false, "ADVANCE already lives on phase 1");
    assert.equal("slow" in crit, false, "#1204 / #1212 own kit-first Slow");
    assert.equal("iron" in crit, false, "kit spell-iron-skin leftover");
    assert.equal("wound" in crit, false, "kit spell-cursed-wound leftover");
    assert.equal("courage" in crit, false, "kit spell-drain-courage leftover");
    assert.equal("void" in crit, false, "#1347 owns Queen VOID");
    assert.equal("lines" in crit, false, "#1022 owns queen-ray minion HP");
    assert.equal("blast" in crit, false);
    assert.equal("frost" in crit, false);
    assert.equal("chain" in crit, false, "#1342 owns Static CHAIN");
    assert.equal("shock" in crit, false, "#896 owns SHOCK occupancy");
    assert.equal("spike" in crit, false, "#846 owns SPIKE occupancy");
    assert.equal("jump" in crit, false, "#763 owns knight-jump landing tax");
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
    assert.equal("heal" in crit, false);
    assert.equal("shrink" in crit, false, "Alabaster BOARD_SHRINK leftover");
    assert.equal("rotate" in crit, false, "#1161 owns MAP_ROTATE crumbs");
    assert.equal("mirror" in crit, false, "Mirror Sovereign leftover");
    assert.equal(ETERNAL_PAWN_KING_PHASE_GATE_ABILITY, "AP_DRAIN");
    assert.equal(
      ETERNAL_PAWN_KING_PHASE_GATE_ADVANCE_LEFTOVER,
      "ADVANCE_PER_TURN",
    );
    assert.equal(ETERNAL_PAWN_KING_PHASE_GATE_KIT_FIRST, "spell-slow");
    assert.equal(ETERNAL_PAWN_KING_PHASE_GATE_KIT_PHASE2, "spell-iron-skin");
    assert.equal(slow.id, "spell-slow");
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
    assert.equal(body.includes("resolveEternalPawnKingPhaseGate"), false);
    assert.equal(body.includes("executeEternalPawnKingPhaseGateHp"), false);

    const drain = src.slice(
      src.indexOf("function applyApDrain("),
      src.indexOf("function applyTwinFlank("),
    );
    assert.ok(drain.includes("playerApModifier: -1"));
    assert.ok(drain.includes("drains 1 AP"));
  });

  it("decideEternalPawnKingAction still requires currentPhase 2 after kit first-id", () => {
    const src = readFileSync(join(here(), "../hooks/useBossAI.ts"), "utf8");
    const start = src.indexOf("export const decideEternalPawnKingAction");
    const end = src.indexOf("export const decideMidnightBishopAction");
    assert.ok(start >= 0 && end > start, "King decide is present");
    const body = src.slice(start, end);
    const kitIdx = body.indexOf("pickBossKitSpell");
    const drainIdx = body.indexOf("BossAbility.AP_DRAIN");
    assert.ok(kitIdx >= 0, "kit pick is present");
    assert.ok(drainIdx >= 0, "AP_DRAIN is present");
    assert.ok(kitIdx < drainIdx, "kit still wins the AP-drain turn");
    assert.ok(body.includes("bossState.currentPhase === 2"));
    assert.ok(body.includes("new Map<string, number>()"));
    assert.equal(body.includes("resolveEternalPawnKingPhaseGate"), false);
    assert.equal(body.includes("executeEternalPawnKingPhaseGateHp"), false);
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
    assert.equal(wx.includes("resolveEternalPawnKingPhaseGate"), false);
    assert.equal(wx.includes("executeEternalPawnKingPhaseGateHp"), false);
    assert.equal(
      wx.includes("config.phase1.hpThreshold"),
      false,
      "WX still never substitutes the advertised 50% card",
    );
  });

  it("Boss Guide still advertises AP_DRAIN at phase1 50%", () => {
    const guide = readFileSync(
      join(here(), "../components/BossGuideModal.tsx"),
      "utf8",
    );
    assert.ok(guide.includes(ETERNAL_PAWN_KING_PHASE_GATE_GUIDE_NEEDLE));
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
    const king = kits.slice(
      kits.indexOf("eternal_pawn_king: {"),
      kits.indexOf("midnight_bishop: {"),
    );
    const p1 = king.slice(king.indexOf("phase1SpellIds:"));
    assert.ok(p1.includes(`"${ETERNAL_PAWN_KING_PHASE_GATE_KIT_FIRST}"`));
    const p2 = king.slice(king.indexOf("phase2SpellIds:"));
    assert.ok(p2.includes(`"${ETERNAL_PAWN_KING_PHASE_GATE_KIT_PHASE2}"`));
    assert.ok(
      p2.includes(`"${ETERNAL_PAWN_KING_PHASE_GATE_KIT_FIRST}"`),
      "phase-2 pool still leads with spell-slow — kit-first leftover, not restored",
    );
    assert.equal(slow.id, ETERNAL_PAWN_KING_PHASE_GATE_KIT_FIRST);

    const rush = readFileSync(join(here(), "../hooks/useBossRush.ts"), "utf8");
    assert.ok(rush.includes('boss1Id: "eternal_pawn_king"'));
  });
});
