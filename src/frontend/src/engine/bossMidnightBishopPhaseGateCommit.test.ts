/**
 * Combat action parity: Midnight Bishop phase 2 never arms at the
 * advertised 25% card because checkPhaseTransition reads
 * phase2.hpThreshold 0.0, so the ×2.0 HP commit never runs.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { starterSpells } from "../data/spellData.ts";
import { hpAfterBossPhase2, shouldAwardVictory } from "./battleSetup.ts";
import {
  BISHOP_PHASE_GATE_ABILITY,
  BISHOP_PHASE_GATE_ADVERTISED_THRESHOLD,
  BISHOP_PHASE_GATE_GUIDE_NEEDLE,
  BISHOP_PHASE_GATE_HP,
  BISHOP_PHASE_GATE_HP_AFTER,
  BISHOP_PHASE_GATE_HP_AT_GUIDE,
  BISHOP_PHASE_GATE_KIT_FIRST,
  BISHOP_PHASE_GATE_KIT_PHASE2,
  BISHOP_PHASE_GATE_LIVE_THRESHOLD,
  BISHOP_PHASE_GATE_LORE_NEEDLE,
  BISHOP_PHASE_GATE_MAX_HP_AFTER,
  BISHOP_PHASE_GATE_REFLECT_LEFTOVER,
  BISHOP_PHASE_GATE_STAT_MULT,
  BISHOP_PHASE_GATE_TWIN_LEFTOVER,
  MIDNIGHT_BISHOP_PHASE_GATE_BOSS_ID,
  advertisedBishopPhaseThreshold,
  advertisedBishopPhaseTransitioned,
  bishopHpFraction,
  canExecuteBishopPhaseGateHp,
  executeBishopPhaseGateHp,
  liveWxBishopPhaseThreshold,
  liveWxBishopPhaseTransitioned,
  liveWxBishopReadsPhase2Threshold,
  resolveMidnightBishopPhaseGate,
  shouldCommitBishopPhaseGateHp,
  wxAppliesBishopPhaseHpOnceTransitioned,
} from "./bossMidnightBishopPhaseGateCommit.ts";

const strike = starterSpells.find((s) => s.id === "physical_attack");
assert.ok(strike, "physical_attack");
const wound = starterSpells.find((s) => s.id === "spell-cursed-wound");
assert.ok(wound, "spell-cursed-wound");
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
    bossId: overrides?.bossId ?? MIDNIGHT_BISHOP_PHASE_GATE_BOSS_ID,
    hp: overrides?.hp ?? BISHOP_PHASE_GATE_HP_AT_GUIDE,
    maxHp: BISHOP_PHASE_GATE_HP,
    alreadyPhase2: overrides?.alreadyPhase2 ?? false,
  };
}

describe("Midnight Bishop advertised 25% phase gate vs live 0.0", () => {
  it("catalog 0.25 / 360 HP / ×2.0 stay distinct from live phase2 0.0 and kit Mirror", () => {
    const defaults = readFileSync(
      join(here(), "../types/bossDefaults.ts"),
      "utf8",
    );
    const bishop = defaults.slice(
      defaults.indexOf('id: "midnight_bishop"'),
      defaults.indexOf('id: "broodmother_rook"'),
    );
    assert.ok(bishop.includes(`id: "${MIDNIGHT_BISHOP_PHASE_GATE_BOSS_ID}"`));
    assert.ok(bishop.includes("hp: 360"));
    assert.ok(bishop.includes("hpThreshold: 0.25"));
    assert.ok(bishop.includes("hpThreshold: 0.0"));
    assert.ok(bishop.includes("statMultiplier: 2.0"));
    assert.ok(bishop.includes("BossAbility.MERGE_BISHOPS"));
    assert.ok(bishop.includes("BossAbility.MAGIC_REFLECT"));
    assert.ok(bishop.includes("BossAbility.TWIN_FLANK"));
    assert.ok(bishop.includes(BISHOP_PHASE_GATE_LORE_NEEDLE));
    assert.equal(BISHOP_PHASE_GATE_HP, 360);
    assert.equal(BISHOP_PHASE_GATE_ADVERTISED_THRESHOLD, 0.25);
    assert.equal(BISHOP_PHASE_GATE_LIVE_THRESHOLD, 0.0);
    assert.equal(BISHOP_PHASE_GATE_HP_AT_GUIDE, 90);
    assert.equal(360 * 0.25, 90);
    assert.equal(BISHOP_PHASE_GATE_STAT_MULT, 2.0);
    assert.equal(
      bishopHpFraction(BISHOP_PHASE_GATE_HP_AT_GUIDE, BISHOP_PHASE_GATE_HP),
      0.25,
    );
    assert.equal(advertisedBishopPhaseThreshold(), 0.25);
    assert.equal(liveWxBishopPhaseThreshold(), 0.0);
    assert.notEqual(
      advertisedBishopPhaseThreshold(),
      liveWxBishopPhaseThreshold(),
    );
    assert.equal(wound.id, BISHOP_PHASE_GATE_KIT_FIRST);
    assert.equal(Number(wound.damage), 22);
    assert.equal(mirror.id, BISHOP_PHASE_GATE_KIT_PHASE2);
    assert.equal(mirror.isMirror, true);
    assert.equal(Number(mirror.damage), 0);
    assert.equal(STRIKE_DAMAGE, 10);
    assert.deepEqual(hpAfterBossPhase2(90, 360, 2.0, false), {
      hp: 180,
      maxHp: 720,
    });
    assert.deepEqual(
      hpAfterBossPhase2(90, 360, 2.0, true),
      { hp: 720, maxHp: 720 },
      "Weeping #1343 fullHeal would restore 720/720 — Bishop advertised is leftover 180/720",
    );
    assert.equal(BISHOP_PHASE_GATE_HP_AFTER, 180);
    assert.equal(BISHOP_PHASE_GATE_MAX_HP_AFTER, 720);

    const staticBoss = defaults.slice(
      defaults.indexOf('id: "lord_of_static"'),
      defaults.indexOf('id: "final_pawn"'),
    );
    assert.ok(
      staticBoss.includes("hp: 340"),
      "Static #1342 is ×1.5 at 40% of 340 — this sidecar is Bishop 360",
    );
    const cavalier = defaults.slice(
      defaults.indexOf('id: "bone_cavalier"'),
      defaults.indexOf('id: "weeping_pawn"'),
    );
    assert.ok(
      cavalier.includes("hp: 320"),
      "Cavalier #1337/#1338 is ×1.6 at 50% of 320 — this sidecar is Bishop 360",
    );
    const grandmaster = defaults.slice(
      defaults.indexOf('id: "void_grandmaster"'),
      defaults.indexOf('id: "bone_cavalier"'),
    );
    assert.ok(
      grandmaster.includes("hp: 300"),
      "Grandmaster #1336 is ×1.3 at 60% of 300 — this sidecar is Bishop 360",
    );
    const broodmother = defaults.slice(
      defaults.indexOf('id: "broodmother_rook"'),
      defaults.indexOf('id: "lord_of_static"'),
    );
    assert.ok(
      broodmother.includes("hp: 480"),
      "Broodmother #1333 is ×1.4 at 50% of 480 — this sidecar is Bishop 360",
    );
    const archbishop = defaults.slice(
      defaults.indexOf('id: "pale_archbishop"'),
      defaults.indexOf('id: "crimson_countess"'),
    );
    assert.ok(
      archbishop.includes("hp: 350"),
      "Archbishop #1332 is ×1.4 at 50% of 350 — this sidecar is Bishop 360",
    );
    const countess = defaults.slice(
      defaults.indexOf('id: "crimson_countess"'),
      defaults.indexOf('id: "void_grandmaster"'),
    );
    assert.ok(
      countess.includes("hp: 400"),
      "Countess #1329 is ×1.5 at 40% of 400 — this sidecar is Bishop 360",
    );
    const fetid = defaults.slice(
      defaults.indexOf('id: "fetid_rook"'),
      defaults.indexOf('id: "eternal_pawn_king"'),
    );
    assert.ok(
      fetid.includes("statMultiplier: 1.0"),
      "Fetid #1325 has no ×2.0 HP fire — this sidecar is Bishop-only",
    );
    const weeping = defaults.slice(
      defaults.indexOf('id: "weeping_pawn"'),
      defaults.indexOf('id: "starborn_queen"'),
    );
    assert.ok(
      weeping.includes("hp: 500"),
      "Weeping #1343 is ×2.0 at 30% of 500 with fullHeal — this sidecar is Bishop 25% of 360",
    );
    assert.ok(weeping.includes("hpThreshold: 0.3"));
    assert.ok(weeping.includes("statMultiplier: 2.0"));
    assert.deepEqual(hpAfterBossPhase2(150, 500, 2.0, true), {
      hp: 1000,
      maxHp: 1000,
    });
  });

  it("live 90/360 does not transition; advertised 25% does", () => {
    const atGuide = {
      hp: BISHOP_PHASE_GATE_HP_AT_GUIDE,
      maxHp: BISHOP_PHASE_GATE_HP,
      alreadyPhase2: false,
    };
    assert.equal(liveWxBishopPhaseTransitioned(atGuide), false);
    assert.equal(advertisedBishopPhaseTransitioned(atGuide), true);
    assert.equal(resolveMidnightBishopPhaseGate(atGuide), 2);
    assert.equal(liveWxBishopReadsPhase2Threshold(), true);
    assert.equal(wxAppliesBishopPhaseHpOnceTransitioned(), true);

    const above = {
      hp: BISHOP_PHASE_GATE_HP_AT_GUIDE + 1,
      maxHp: BISHOP_PHASE_GATE_HP,
      alreadyPhase2: false,
    };
    assert.equal(advertisedBishopPhaseTransitioned(above), false);
    assert.equal(liveWxBishopPhaseTransitioned(above), false);
    assert.equal(resolveMidnightBishopPhaseGate(above), null);
    assert.equal(executeBishopPhaseGateHp(gateReady({ hp: 91 })), null);

    const dying = {
      hp: 1,
      maxHp: BISHOP_PHASE_GATE_HP,
      alreadyPhase2: false,
    };
    assert.equal(
      liveWxBishopPhaseTransitioned(dying),
      false,
      "live 0.0 still refuses a 1 HP Bishop — only hp 0 satisfies it",
    );
    assert.equal(advertisedBishopPhaseTransitioned(dying), true);
    assert.equal(
      liveWxBishopPhaseTransitioned({
        hp: 0,
        maxHp: BISHOP_PHASE_GATE_HP,
        alreadyPhase2: false,
      }),
      true,
      "live only arms when the Bishop is already dead",
    );
  });
});

describe("player-visible Midnight Bishop HP after advertised 25% ×2.0", () => {
  it("commits 180/720; live 0.0 leaves 90/360", () => {
    const ready = gateReady();
    const decided = shouldCommitBishopPhaseGateHp(ready);
    const executable = canExecuteBishopPhaseGateHp(ready);
    assert.equal(decided, true);
    assert.equal(executable, true);

    const next = executeBishopPhaseGateHp(ready);
    assert.deepEqual(next, {
      phase: 2,
      hp: 180,
      maxHp: 720,
    });
    assert.equal(
      liveWxBishopPhaseTransitioned({
        hp: ready.hp,
        maxHp: ready.maxHp,
        alreadyPhase2: false,
      }),
      false,
    );
  });

  it("10 HP Bishop: advertised 25% already armed so ×2.0 still commits", () => {
    const ready = gateReady({ hp: 10 });
    const next = executeBishopPhaseGateHp(ready);
    assert.deepEqual(next, {
      phase: 2,
      hp: 20,
      maxHp: 720,
    });
    assert.equal(
      liveWxBishopPhaseTransitioned({
        hp: 10,
        maxHp: BISHOP_PHASE_GATE_HP,
        alreadyPhase2: false,
      }),
      false,
    );
    assert.deepEqual(hpAfterBossPhase2(10, 360, 2.0, false), {
      hp: 20,
      maxHp: 720,
    });

    const advertisedAfterStrike = (next?.hp ?? 0) - STRIKE_DAMAGE;
    assert.equal(advertisedAfterStrike, 10);
    assert.equal(
      shouldAwardVictory({
        inBattle: true,
        deathTriggered: false,
        battleStartIdsSize: 1,
        hostilesRemaining: advertisedAfterStrike > 0 ? 1 : 0,
      }),
      false,
      "advertised ×2.0 leaves 10 HP after Strike 10",
    );
    assert.equal(
      shouldAwardVictory({
        inBattle: true,
        deathTriggered: false,
        battleStartIdsSize: 1,
        hostilesRemaining: Math.max(0, 10 - STRIKE_DAMAGE) > 0 ? 1 : 0,
      }),
      true,
      "live 0.0 never arms, so Strike 10 kills the 10 HP bishop",
    );
  });

  it("cannot stamp Static, Cavalier, Grandmaster, Broodmother, Archbishop, Countess, Fetid, Weeping, already-phase-2, or sibling leftover payloads", () => {
    const ready = gateReady();
    assert.equal(
      executeBishopPhaseGateHp({
        ...ready,
        alreadyPhase2: true,
      }),
      null,
      "already-phase-2 does not re-apply ×2.0",
    );
    assert.equal(
      resolveMidnightBishopPhaseGate({
        bossId: "lord_of_static",
        hp: BISHOP_PHASE_GATE_HP_AT_GUIDE,
        maxHp: BISHOP_PHASE_GATE_HP,
        alreadyPhase2: false,
      }),
      null,
      "Static ×1.5 40% of 340 is owned #1342",
    );
    assert.equal(
      executeBishopPhaseGateHp({
        ...ready,
        bossId: "bone_cavalier",
      }),
      null,
      "Cavalier ×1.6 50% of 320 is owned #1337/#1338",
    );
    assert.equal(
      executeBishopPhaseGateHp({
        ...ready,
        bossId: "void_grandmaster",
      }),
      null,
      "Grandmaster ×1.3 60% of 300 is owned #1336",
    );
    assert.equal(
      executeBishopPhaseGateHp({
        ...ready,
        bossId: "broodmother_rook",
      }),
      null,
      "Broodmother ×1.4 50% of 480 is owned #1333",
    );
    assert.equal(
      executeBishopPhaseGateHp({
        ...ready,
        bossId: "pale_archbishop",
      }),
      null,
      "Archbishop ×1.4 50% of 350 is owned #1332",
    );
    assert.equal(
      executeBishopPhaseGateHp({
        ...ready,
        bossId: "crimson_countess",
      }),
      null,
      "Countess ×1.5 40% of 400 is owned #1329",
    );
    assert.equal(
      executeBishopPhaseGateHp({
        ...ready,
        bossId: "fetid_rook",
      }),
      null,
      "Fetid Split 40% gate is owned #1325",
    );
    assert.equal(
      executeBishopPhaseGateHp({
        ...ready,
        bossId: "weeping_pawn",
      }),
      null,
      "Weeping Pawn ×2.0 30% fullHeal of 500 is owned #1343",
    );
    assert.equal(
      executeBishopPhaseGateHp({
        ...ready,
        bossId: "starborn_queen",
      }),
      null,
      "Starborn Queen VOID 50% leftover is not this Bishop gate",
    );
    assert.equal(
      executeBishopPhaseGateHp({
        ...ready,
        bossId: "final_pawn",
      }),
      null,
      "Final Pawn HP≤10% GHOST leftover of #1247",
    );

    const crit = executeBishopPhaseGateHp(ready);
    assert.ok(crit);
    assert.equal("atk" in crit, false, "base atk 28 leftover stays unrestored");
    assert.equal("ap" in crit, false);
    assert.equal("res" in crit, false, "kit Iron Skin RES ×1.3 is #1339");
    assert.equal("chc" in crit, false, "#1104 owns boss kit CHC");
    assert.equal(
      "merge" in crit,
      false,
      "MERGE occupancy leftover of kit-first Mirror #1058",
    );
    assert.equal(
      "reflect" in crit,
      false,
      "MAGIC_REFLECT unread flag leftover of #1058",
    );
    assert.equal(
      "twin" in crit,
      false,
      "TWIN_FLANK leftover of kit-first Cursed Wound",
    );
    assert.equal("wound" in crit, false, "kit-first Cursed Wound leftover");
    assert.equal("mirror" in crit, false, "#1058 / #852 own kit Mirror");
    assert.equal("frost" in crit, false, "phase-2 kit extra leftover");
    assert.equal("swap" in crit, false, "#1339 / #850 own kit Swap");
    assert.equal("veil" in crit, false);
    assert.equal("promote" in crit, false, "#1343 owns Weeping PROMOTE");
    assert.equal("void" in crit, false, "Queen VOID leftover");
    assert.equal("chain" in crit, false, "#1342 owns Static CHAIN");
    assert.equal("shock" in crit, false, "#1342 owns Static shock leftover");
    assert.equal("spike" in crit, false, "#1337 owns Cavalier SPIKE");
    assert.equal("jump" in crit, false, "#1337 owns Cavalier jump leftover");
    assert.equal("illusion" in crit, false, "#1336 owns Grandmaster ILLUSION");
    assert.equal("copies" in crit, false, "#914 owns illusion occupancy");
    assert.equal("split" in crit, false, "#1325 owns Fetid Split");
    assert.equal("twins" in crit, false, "#1325 owns twin occupancy");
    assert.equal("lava" in crit, false, "#1329 owns Countess LAVA_TRAIL");
    assert.equal("inferno" in crit, false, "#1323 owns kit Inferno CD 3");
    assert.equal("spawn" in crit, false, "#1102 owns SPAWN_MINIONS decide");
    assert.equal("minion" in crit, false, "#1278 / #1331 own skeleton stamps");
    assert.equal("larvae" in crit, false, "#1333 owns Broodmother larvae");
    assert.equal("ghost" in crit, false, "#1247 owns Final Pawn GHOST");
    assert.equal("roll" in crit, false, "#1208 owns Titan 1–5×");
    assert.equal("drain" in crit, false, "Eternal AP_DRAIN leftover");
    assert.equal("heal" in crit, false, "#1343 owns Weeping fullHeal");
    assert.equal(BISHOP_PHASE_GATE_ABILITY, "MERGE_BISHOPS");
    assert.equal(BISHOP_PHASE_GATE_TWIN_LEFTOVER, "TWIN_FLANK");
    assert.equal(BISHOP_PHASE_GATE_REFLECT_LEFTOVER, "MAGIC_REFLECT");
    assert.equal(BISHOP_PHASE_GATE_KIT_FIRST, "spell-cursed-wound");
    assert.equal(BISHOP_PHASE_GATE_KIT_PHASE2, "spell-mirror");
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
    assert.equal(body.includes("resolveMidnightBishopPhaseGate"), false);
    assert.equal(body.includes("executeBishopPhaseGateHp"), false);

    const merge = src.slice(
      src.indexOf("function applyMergeBishops"),
      src.indexOf("function applyMagicReflect"),
    );
    assert.ok(merge.includes("bishopsMerged: true"));
    assert.ok(merge.includes("magicReflectActive: true"));
    assert.ok(
      merge.includes(
        "The two bishops MERGE into one unstoppable form! Magic damage reflects!",
      ),
    );
  });

  it("decideMidnightBishopAction still requires currentPhase 2 after kit first-id", () => {
    const src = readFileSync(join(here(), "../hooks/useBossAI.ts"), "utf8");
    const start = src.indexOf("export const decideMidnightBishopAction");
    const end = src.indexOf("export const decideBroodmotherRookAction");
    assert.ok(start >= 0 && end > start, "Midnight Bishop decide is present");
    const body = src.slice(start, end);
    const kitIdx = body.indexOf("pickBossKitSpell");
    const mergeIdx = body.indexOf("BossAbility.MERGE_BISHOPS");
    assert.ok(kitIdx >= 0, "kit pick is present");
    assert.ok(mergeIdx >= 0, "MERGE_BISHOPS is present");
    assert.ok(kitIdx < mergeIdx, "kit still wins the merge turn");
    assert.ok(body.includes("bossState.currentPhase === 2"));
    assert.ok(body.includes("new Map<string, number>()"));
    assert.equal(body.includes("resolveMidnightBishopPhaseGate"), false);
    assert.equal(body.includes("executeBishopPhaseGateHp"), false);
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
      "WX still special-cases Weeping fullHeal — Bishop stays false",
    );
    assert.ok(wx.includes("isWeepingPawn"));
    assert.equal(wx.includes("resolveMidnightBishopPhaseGate"), false);
    assert.equal(wx.includes("executeBishopPhaseGateHp"), false);
    assert.equal(
      wx.includes("config.phase1.hpThreshold"),
      false,
      "WX still never substitutes the advertised 25% card",
    );
  });

  it("Boss Guide still advertises MERGE_BISHOPS at phase1 25%", () => {
    const guide = readFileSync(
      join(here(), "../components/BossGuideModal.tsx"),
      "utf8",
    );
    assert.ok(guide.includes(BISHOP_PHASE_GATE_GUIDE_NEEDLE));
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
    const bishopKit = kits.slice(
      kits.indexOf("midnight_bishop: {"),
      kits.indexOf("broodmother_rook: {"),
    );
    const p1 = bishopKit.slice(
      bishopKit.indexOf("phase1SpellIds:"),
      bishopKit.indexOf("phase2SpellIds:"),
    );
    assert.ok(p1.includes(`"${BISHOP_PHASE_GATE_KIT_FIRST}"`));
    const p2 = bishopKit.slice(bishopKit.indexOf("phase2SpellIds:"));
    assert.ok(p2.includes(`"${BISHOP_PHASE_GATE_KIT_PHASE2}"`));
    assert.equal(
      p2.includes(`"${BISHOP_PHASE_GATE_KIT_FIRST}"`),
      false,
      "Cursed Wound is phase-1 first-id, not the phase-2 MERGE shadow",
    );
    assert.equal(wound.id, BISHOP_PHASE_GATE_KIT_FIRST);
    assert.equal(mirror.id, BISHOP_PHASE_GATE_KIT_PHASE2);

    const rush = readFileSync(join(here(), "../hooks/useBossRush.ts"), "utf8");
    assert.ok(rush.includes('boss1Id: "midnight_bishop"'));
  });
});
