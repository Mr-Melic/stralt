/**
 * Combat action parity: Fetid Rook phase 2 never arms at the advertised
 * 40% card because checkPhaseTransition reads phase2.hpThreshold 0.0.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { starterSpells } from "../data/spellData.ts";
import { startingChampionStats } from "../utils/startingChampionStats.ts";
import { shouldAwardVictory } from "./battleSetup.ts";
import {
  COMPOUNDING_ROT_PHASE_GATE_LEFTOVER,
  FETID_ROOK_PHASE_GATE_ADVERTISED_THRESHOLD,
  FETID_ROOK_PHASE_GATE_AP_LEFTOVER,
  FETID_ROOK_PHASE_GATE_BOSS_ID,
  FETID_ROOK_PHASE_GATE_HP,
  FETID_ROOK_PHASE_GATE_HP_AT_GUIDE,
  FETID_ROOK_PHASE_GATE_KIT_FIRST,
  FETID_ROOK_PHASE_GATE_LIVE_THRESHOLD,
  FETID_ROOK_PHASE_GATE_TWIN_COUNT,
  SPLIT_ROOKS_PHASE_GATE_ABILITY,
  SPLIT_ROOKS_PHASE_GATE_GUIDE_NEEDLE,
  SPLIT_ROOKS_PHASE_GATE_LORE_NEEDLE,
  advertisedFetidRookPhaseThreshold,
  advertisedFetidRookPhaseTransitioned,
  canExecuteFetidRookPhaseGateSplit,
  executeFetidRookPhaseGateSplit,
  fetidRookHpFraction,
  fetidRookPhaseGateHighlightedIsExecutable,
  fetidRookPhaseGateHostiles,
  liveWxFetidRookPhaseThreshold,
  liveWxFetidRookPhaseTransitioned,
  liveWxFetidRookReadsPhase2Threshold,
  resolveFetidRookPhaseGate,
  shouldDecideFetidRookPhaseGateSplit,
  wxAppliesFetidRookSplitSpawnsOncePhase2,
} from "./bossSplitRooksPhaseGateCommit.ts";

const strike = starterSpells.find((s) => s.id === "physical_attack");
const venom = starterSpells.find((s) => s.id === "spell-venom-strike");
assert.ok(strike, "physical_attack");
assert.ok(venom, "spell-venom-strike");

const PLAYER_HP = Number(startingChampionStats().hp);

function here(): string {
  return dirname(fileURLToPath(import.meta.url));
}

function gateReady(overrides?: {
  hp?: number;
  alreadyPhase2?: boolean;
  splitRooksSpawned?: boolean;
  kitSpellId?: string | null;
  bossId?: string;
}) {
  return {
    bossId: overrides?.bossId ?? FETID_ROOK_PHASE_GATE_BOSS_ID,
    hp: overrides?.hp ?? FETID_ROOK_PHASE_GATE_HP_AT_GUIDE,
    maxHp: FETID_ROOK_PHASE_GATE_HP,
    alreadyPhase2: overrides?.alreadyPhase2 ?? false,
    splitRooksSpawned: overrides?.splitRooksSpawned ?? false,
    kitSpellId: overrides?.kitSpellId ?? null,
  };
}

describe("Fetid Rook advertised 40% phase gate vs live 0.0", () => {
  it("catalog 0.4 / 420 HP stay distinct from live phase2 0.0 and kit Venom", () => {
    const defaults = readFileSync(
      join(here(), "../types/bossDefaults.ts"),
      "utf8",
    );
    const fetid = defaults.slice(
      defaults.indexOf('id: "fetid_rook"'),
      defaults.indexOf('id: "eternal_pawn_king"'),
    );
    assert.ok(fetid.includes(`id: "${FETID_ROOK_PHASE_GATE_BOSS_ID}"`));
    assert.ok(fetid.includes("hp: 420"));
    assert.ok(fetid.includes("hpThreshold: 0.4"));
    assert.ok(fetid.includes("hpThreshold: 0.0"));
    assert.ok(fetid.includes("BossAbility.SPLIT_ROOKS"));
    assert.ok(fetid.includes(SPLIT_ROOKS_PHASE_GATE_LORE_NEEDLE));
    assert.equal(FETID_ROOK_PHASE_GATE_HP, 420);
    assert.equal(FETID_ROOK_PHASE_GATE_ADVERTISED_THRESHOLD, 0.4);
    assert.equal(FETID_ROOK_PHASE_GATE_LIVE_THRESHOLD, 0.0);
    assert.equal(FETID_ROOK_PHASE_GATE_HP_AT_GUIDE, 168);
    assert.equal(420 * 0.4, 168);
    assert.equal(
      fetidRookHpFraction(
        FETID_ROOK_PHASE_GATE_HP_AT_GUIDE,
        FETID_ROOK_PHASE_GATE_HP,
      ),
      0.4,
    );
    assert.equal(advertisedFetidRookPhaseThreshold(), 0.4);
    assert.equal(liveWxFetidRookPhaseThreshold(), 0.0);
    assert.notEqual(
      advertisedFetidRookPhaseThreshold(),
      liveWxFetidRookPhaseThreshold(),
    );
    assert.equal(venom.id, FETID_ROOK_PHASE_GATE_KIT_FIRST);
    assert.equal(Number(venom.damage), 0);
    assert.equal(venom.isDotSpell, true);
    assert.equal(Number(strike.damage), 10);
    assert.equal(PLAYER_HP, 100);
    assert.equal(FETID_ROOK_PHASE_GATE_AP_LEFTOVER, 5);
    assert.equal(FETID_ROOK_PHASE_GATE_TWIN_COUNT, 2);
  });

  it("live 168/420 does not transition; advertised 40% does", () => {
    const atGuide = {
      hp: FETID_ROOK_PHASE_GATE_HP_AT_GUIDE,
      maxHp: FETID_ROOK_PHASE_GATE_HP,
      alreadyPhase2: false,
    };
    assert.equal(liveWxFetidRookPhaseTransitioned(atGuide), false);
    assert.equal(advertisedFetidRookPhaseTransitioned(atGuide), true);
    assert.equal(resolveFetidRookPhaseGate(atGuide), 2);
    assert.equal(liveWxFetidRookReadsPhase2Threshold(), true);
    assert.equal(wxAppliesFetidRookSplitSpawnsOncePhase2(), true);

    const above = {
      hp: FETID_ROOK_PHASE_GATE_HP_AT_GUIDE + 1,
      maxHp: FETID_ROOK_PHASE_GATE_HP,
      alreadyPhase2: false,
    };
    assert.equal(advertisedFetidRookPhaseTransitioned(above), false);
    assert.equal(liveWxFetidRookPhaseTransitioned(above), false);
    assert.equal(resolveFetidRookPhaseGate(above), null);
    assert.equal(executeFetidRookPhaseGateSplit(gateReady({ hp: 169 })), null);

    const dying = {
      hp: 1,
      maxHp: FETID_ROOK_PHASE_GATE_HP,
      alreadyPhase2: false,
    };
    assert.equal(
      liveWxFetidRookPhaseTransitioned(dying),
      false,
      "live 0.0 still refuses a 1 HP rook — only hp 0 satisfies it",
    );
    assert.equal(advertisedFetidRookPhaseTransitioned(dying), true);
    assert.equal(
      liveWxFetidRookPhaseTransitioned({
        hp: 0,
        maxHp: FETID_ROOK_PHASE_GATE_HP,
        alreadyPhase2: false,
      }),
      true,
      "live only arms when the rook is already dead",
    );
  });
});

describe("player-visible twins occupying after the 40% split", () => {
  it("executes advertised twins after rook death; live 0.0 awards victory", () => {
    const ready = gateReady();
    const decided = shouldDecideFetidRookPhaseGateSplit(ready);
    const executable = canExecuteFetidRookPhaseGateSplit(ready);
    assert.equal(decided, true);
    assert.equal(executable, true);
    assert.equal(
      fetidRookPhaseGateHighlightedIsExecutable({ decided, executable }),
      true,
    );

    const next = executeFetidRookPhaseGateSplit(ready);
    assert.deepEqual(next, {
      phase: 2,
      twinCount: 2,
      hostilesAfterRookDeath: 2,
      awardsVictory: false,
    });
    assert.equal(
      fetidRookPhaseGateHostiles({
        rookAlive: false,
        twinCount: next?.twinCount ?? 0,
      }),
      2,
    );
    assert.equal(
      shouldAwardVictory({
        inBattle: true,
        deathTriggered: false,
        battleStartIdsSize: 3,
        hostilesRemaining: next?.hostilesAfterRookDeath ?? 0,
      }),
      false,
      "advertised twins still occupy after the original rook dies",
    );

    assert.equal(
      liveWxFetidRookPhaseTransitioned({
        hp: ready.hp,
        maxHp: ready.maxHp,
        alreadyPhase2: false,
      }),
      false,
    );
    assert.equal(
      shouldAwardVictory({
        inBattle: true,
        deathTriggered: false,
        battleStartIdsSize: 1,
        hostilesRemaining: fetidRookPhaseGateHostiles({
          rookAlive: false,
          twinCount: 0,
        }),
      }),
      true,
      "live leftover never arms phase 2, so killing the rook awards",
    );
  });

  it("10 HP rook: advertised 40% already armed so twins block victory", () => {
    const ready = gateReady({ hp: 10 });
    const next = executeFetidRookPhaseGateSplit(ready);
    assert.deepEqual(next, {
      phase: 2,
      twinCount: 2,
      hostilesAfterRookDeath: 2,
      awardsVictory: false,
    });
    assert.equal(
      liveWxFetidRookPhaseTransitioned({
        hp: 10,
        maxHp: FETID_ROOK_PHASE_GATE_HP,
        alreadyPhase2: false,
      }),
      false,
    );
    assert.equal(
      shouldAwardVictory({
        inBattle: true,
        deathTriggered: false,
        battleStartIdsSize: 1,
        hostilesRemaining: 0,
      }),
      true,
    );
  });

  it("cannot stamp kit-first, already-phase-2, broodmother, or sibling leftover payloads", () => {
    const ready = gateReady();
    assert.equal(
      executeFetidRookPhaseGateSplit({
        ...ready,
        kitSpellId: FETID_ROOK_PHASE_GATE_KIT_FIRST,
      }),
      null,
      "kit-first Venom leftover of #1261 still shadows Split once phase 2",
    );
    assert.equal(
      executeFetidRookPhaseGateSplit({
        ...ready,
        alreadyPhase2: true,
      }),
      null,
      "#1261 owns the currentPhase: 2 decide fork",
    );
    assert.equal(
      executeFetidRookPhaseGateSplit({
        ...ready,
        splitRooksSpawned: true,
      }),
      null,
      "already-split does not re-split",
    );
    assert.equal(
      resolveFetidRookPhaseGate({
        bossId: "broodmother_rook",
        hp: FETID_ROOK_PHASE_GATE_HP_AT_GUIDE,
        maxHp: FETID_ROOK_PHASE_GATE_HP,
        alreadyPhase2: false,
      }),
      null,
      "Broodmother phase2.hpThreshold 0.0 leftover is not this Fetid gate",
    );
    assert.equal(
      executeFetidRookPhaseGateSplit({
        ...ready,
        bossId: "final_pawn",
      }),
      null,
      "Final Pawn HP≤10% GHOST leftover of #1247",
    );
    assert.equal(
      executeFetidRookPhaseGateSplit({
        ...ready,
        bossId: "eternal_pawn_king",
      }),
      null,
    );

    const crit = executeFetidRookPhaseGateSplit(ready);
    assert.ok(crit);
    assert.equal("hp" in crit, false, "#1231 owns split HP stamp");
    assert.equal("atk" in crit, false, "#1271 owns split atk 25");
    assert.equal("ap" in crit, false, "split ap 5 leftover stays unrestored");
    assert.equal("res" in crit, false, "#1316 owns split RES 18");
    assert.equal("chc" in crit, false, "#1107 / #1104 own CHC rolls");
    assert.equal("heal" in crit, false, "#1148 owns Vampiric Ground heal");
    assert.equal("roll" in crit, false, "#1208 owns Titan 1–5×");
    assert.equal("glass" in crit, false, "#1160 / #1252 own Glass Realm");
    assert.equal("glyph" in crit, false, "#1216 owns Glyph Trap 15");
    assert.equal("venom" in crit, false, "#1217 owns larva explode DoT");
    assert.equal(
      "decide" in crit,
      false,
      "#1261 owns kit-first Venom vs Split",
    );
    assert.equal(
      "rot" in crit,
      false,
      "adjacent COMPOUNDING_ROT leftover stays unrestored",
    );
    assert.equal(
      "revive" in crit,
      false,
      "Split revive log with no writer stays unrestored",
    );
    assert.equal(
      fetidRookPhaseGateHighlightedIsExecutable({
        decided: false,
        executable: false,
      }),
      false,
    );
    assert.notEqual(
      SPLIT_ROOKS_PHASE_GATE_ABILITY,
      COMPOUNDING_ROT_PHASE_GATE_LEFTOVER,
    );
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
    assert.equal(body.includes("resolveFetidRookPhaseGate"), false);
    assert.equal(body.includes("executeFetidRookPhaseGateSplit"), false);

    const split = src.slice(
      src.indexOf("function applySplitRooks("),
      src.indexOf("function applyAdvancePerTurn("),
    );
    assert.ok(split.includes("`split_rook_${i}_"));
    assert.ok(split.includes('pieceType: "rook"'));
    assert.ok(split.includes("Math.ceil(params.bossEntry.hp / 2)"));
    assert.ok(split.includes("ap: params.bossEntry.ap"));
  });

  it("decideFetidRookAction still requires currentPhase 2 after kit first-id", () => {
    const src = readFileSync(join(here(), "../hooks/useBossAI.ts"), "utf8");
    const start = src.indexOf("export const decideFetidRookAction");
    const end = src.indexOf("export const decideEternalPawnKingAction");
    assert.ok(start >= 0 && end > start, "Fetid Rook decide is present");
    const body = src.slice(start, end);
    const kitIdx = body.indexOf("pickBossKitSpell");
    const splitIdx = body.indexOf("BossAbility.SPLIT_ROOKS");
    const rotIdx = body.indexOf("BossAbility.COMPOUNDING_ROT");
    assert.ok(kitIdx >= 0, "kit pick is present");
    assert.ok(splitIdx >= 0, "SPLIT_ROOKS is present");
    assert.ok(rotIdx >= 0, "COMPOUNDING_ROT is present");
    assert.ok(kitIdx < splitIdx, "kit still wins the split turn");
    assert.ok(splitIdx < rotIdx, "rot still sits after split");
    assert.ok(body.includes("bossState.currentPhase === 2"));
    assert.ok(body.includes("!bossState.splitRooksSpawned"));
    assert.ok(body.includes("new Map<string, number>()"));
    assert.equal(body.includes("resolveFetidRookPhaseGate"), false);
    assert.equal(body.includes("executeFetidRookPhaseGateSplit"), false);
    assert.equal(body.includes("phase1.hpThreshold"), false);
  });

  it("WorldExploration still calls checkPhaseTransition with catalog config", () => {
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
    assert.equal(wx.includes("resolveFetidRookPhaseGate"), false);
    assert.equal(wx.includes("executeFetidRookPhaseGateSplit"), false);
    assert.equal(
      wx.includes("config.phase1.hpThreshold"),
      false,
      "WX still never substitutes the advertised 40% card",
    );
  });

  it("Boss Guide still advertises Split at phase1 40%", () => {
    const guide = readFileSync(
      join(here(), "../components/BossGuideModal.tsx"),
      "utf8",
    );
    assert.ok(guide.includes(SPLIT_ROOKS_PHASE_GATE_GUIDE_NEEDLE));
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
    const fetid = kits.slice(
      kits.indexOf("fetid_rook: {"),
      kits.indexOf("eternal_pawn_king: {"),
    );
    const p2 = fetid.slice(fetid.indexOf("phase2SpellIds:"));
    assert.ok(p2.includes(`"${FETID_ROOK_PHASE_GATE_KIT_FIRST}"`));
    assert.equal(venom.id, FETID_ROOK_PHASE_GATE_KIT_FIRST);
  });
});
