import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { starterSpells } from "../data/spellData.ts";
import { startingChampionStats } from "../utils/startingChampionStats.ts";
import { shouldAwardVictory } from "./battleSetup.ts";
import {
  ADVANCE_PER_TURN_ABILITY,
  AP_DRAIN_ABILITY,
  COMPOUNDING_ROT_ABILITY,
  ENTHRONED_VOID_PHASE1_KIT_FIRST_ID,
  ETERNAL_PAWN_PHASE1_KIT_FIRST_ID,
  FETID_ROOK_HP,
  FETID_ROOK_PHASE2_KIT_FIRST_ID,
  FETID_ROOK_SPLIT_DECIDE_ID,
  FINAL_PAWN_KIT_FIRST_ID,
  GHOST_SUMMON_ABILITY,
  PHANTOM_SPAWN_ABILITY,
  SPLIT_ROOKS_ADVERTISED_HP,
  SPLIT_ROOKS_DECIDE_ABILITY,
  SPLIT_ROOKS_GUIDE_NEEDLE,
  SPLIT_ROOKS_LOG_NEEDLE,
  SPLIT_ROOKS_TWIN_COUNT,
  fetidRookHostilesAfterDecide,
  isFetidRookSplitTurn,
  liveWxCommitsFetidRookSplit,
  resolveFetidRookSplitDecide,
  twinCountAfterFetidRookDecide,
  wxAppliesFetidRookSplitSpawns,
  wxFetidRookKitBlocksSplit,
  wxFetidRookSplitDecide,
} from "./bossSplitRooksDecideCommit.ts";

const strike = starterSpells.find((s) => s.id === "physical_attack");
const kitVenom = starterSpells.find((s) => s.id === "spell-venom-strike");
const kitSwap = starterSpells.find((s) => s.id === "spell-swap");
const kitSlow = starterSpells.find((s) => s.id === "spell-slow");

assert.ok(strike, "physical_attack");
assert.ok(kitVenom, "spell-venom-strike");
assert.ok(kitSwap, "spell-swap");
assert.ok(kitSlow, "spell-slow");

const PLAYER_HP = Number(startingChampionStats().hp);
const STRIKE_DAMAGE = Number(strike.damage);

function phase2SplitKit() {
  return {
    bossId: FETID_ROOK_SPLIT_DECIDE_ID,
    currentPhase: 2 as const,
    kitSpellId: FETID_ROOK_PHASE2_KIT_FIRST_ID,
    splitRooksSpawned: false,
  };
}

describe("wxFetidRookKitBlocksSplit (live leftover)", () => {
  it("phase-2 first-id Venom is decided instead of SPLIT_ROOKS", () => {
    const opts = phase2SplitKit();
    const live = wxFetidRookSplitDecide(opts);
    assert.equal(live.type, "spell");
    assert.equal(live.spellId, FETID_ROOK_PHASE2_KIT_FIRST_ID);
    assert.equal(live.ability, undefined);
    assert.equal(wxFetidRookKitBlocksSplit(opts), true);
    assert.equal(isFetidRookSplitTurn(opts), true);
    assert.equal(liveWxCommitsFetidRookSplit(), false);
    assert.equal(wxAppliesFetidRookSplitSpawns(), true);
  });

  it("empty kit still reaches Split — the leftover is first-id, not an empty pool", () => {
    const opts = {
      ...phase2SplitKit(),
      kitSpellId: null,
    };
    const live = wxFetidRookSplitDecide(opts);
    assert.equal(live.type, "split");
    assert.equal(live.ability, SPLIT_ROOKS_DECIDE_ABILITY);
    assert.equal(wxFetidRookKitBlocksSplit(opts), false);
  });

  it("phase 1 still lets kit Venom win — COMPOUNDING_ROT leftover", () => {
    const opts = {
      ...phase2SplitKit(),
      currentPhase: 1 as const,
    };
    const live = wxFetidRookSplitDecide(opts);
    const next = resolveFetidRookSplitDecide(opts);
    assert.equal(isFetidRookSplitTurn(opts), false);
    assert.equal(live.type, "spell");
    assert.equal(next.type, "spell");
    assert.equal(next.spellId, FETID_ROOK_PHASE2_KIT_FIRST_ID);
    assert.equal(wxFetidRookKitBlocksSplit(opts), false);
    assert.notEqual(next.ability, SPLIT_ROOKS_DECIDE_ABILITY);
    assert.notEqual(next.ability, COMPOUNDING_ROT_ABILITY);
  });

  it("Final Pawn still lets kit Strike win — GHOST leftover of #1247", () => {
    const opts = {
      bossId: "final_pawn",
      currentPhase: 2 as const,
      kitSpellId: FINAL_PAWN_KIT_FIRST_ID,
      splitRooksSpawned: false,
    };
    const live = wxFetidRookSplitDecide(opts);
    const next = resolveFetidRookSplitDecide(opts);
    assert.equal(isFetidRookSplitTurn(opts), false);
    assert.equal(live.type, "spell");
    assert.equal(next.type, "spell");
    assert.equal(next.spellId, FINAL_PAWN_KIT_FIRST_ID);
    assert.equal(wxFetidRookKitBlocksSplit(opts), false);
    assert.notEqual(next.ability, GHOST_SUMMON_ABILITY);
    assert.notEqual(next.ability, SPLIT_ROOKS_DECIDE_ABILITY);
  });
});

describe("resolveFetidRookSplitDecide", () => {
  it("phase 2 prefers SPLIT_ROOKS over kit Venom", () => {
    const opts = phase2SplitKit();
    const next = resolveFetidRookSplitDecide(opts);
    assert.equal(next.type, "split");
    assert.equal(next.ability, SPLIT_ROOKS_DECIDE_ABILITY);
    assert.equal(next.spellId, undefined);
  });

  it("catalog phase-2 first id is Venom, not Strike, Swap, or Slow", () => {
    const kits = readFileSync(
      join(dirname(fileURLToPath(import.meta.url)), "../data/bossKits.ts"),
      "utf8",
    );
    const rookKit = kits.slice(
      kits.indexOf("fetid_rook: {"),
      kits.indexOf("eternal_pawn_king: {"),
    );
    assert.ok(rookKit.includes(`"${FETID_ROOK_PHASE2_KIT_FIRST_ID}"`));
    const p2 = rookKit.slice(rookKit.indexOf("phase2SpellIds:"));
    assert.ok(p2.includes(`"${FETID_ROOK_PHASE2_KIT_FIRST_ID}"`));
    assert.equal(kitVenom.id, FETID_ROOK_PHASE2_KIT_FIRST_ID);
    assert.equal(Number(kitVenom.damage), 0);
    assert.equal(kitVenom.isDotSpell, true);
    assert.equal(Number(kitVenom.dotDamagePerTurn ?? kitVenom.dotDamage), 4);
    assert.equal(Number(kitVenom.dotDuration), 3);
    assert.equal(strike.id, FINAL_PAWN_KIT_FIRST_ID);
    assert.equal(kitSwap.id, ENTHRONED_VOID_PHASE1_KIT_FIRST_ID);
    assert.equal(kitSlow.id, ETERNAL_PAWN_PHASE1_KIT_FIRST_ID);
  });

  it("does not steal Final Pawn GHOST leftover of #1247 or Eternal Pawn ADVANCE of #1212", () => {
    const next = resolveFetidRookSplitDecide(phase2SplitKit());
    assert.equal(next.ability, SPLIT_ROOKS_DECIDE_ABILITY);
    assert.notEqual(next.ability, GHOST_SUMMON_ABILITY);
    assert.notEqual(next.ability, ADVANCE_PER_TURN_ABILITY);
    assert.notEqual(next.ability, AP_DRAIN_ABILITY);
    assert.notEqual(next.ability, PHANTOM_SPAWN_ABILITY);
  });

  it("does not steal adjacent COMPOUNDING_ROT", () => {
    const next = resolveFetidRookSplitDecide(phase2SplitKit());
    assert.equal(next.ability, SPLIT_ROOKS_DECIDE_ABILITY);
    assert.notEqual(next.ability, COMPOUNDING_ROT_ABILITY);
  });

  it("already-split and non-Fetid-Rook bossId fail-closed", () => {
    const spawned = resolveFetidRookSplitDecide({
      ...phase2SplitKit(),
      splitRooksSpawned: true,
    });
    assert.equal(
      isFetidRookSplitTurn({ ...phase2SplitKit(), splitRooksSpawned: true }),
      false,
    );
    assert.equal(spawned.type, "spell");
    assert.equal(spawned.spellId, FETID_ROOK_PHASE2_KIT_FIRST_ID);
    assert.equal(spawned.ability, undefined);

    const pawn = resolveFetidRookSplitDecide({
      bossId: "eternal_pawn_king",
      currentPhase: 2,
      kitSpellId: FETID_ROOK_PHASE2_KIT_FIRST_ID,
      splitRooksSpawned: false,
    });
    assert.equal(pawn.type, "spell");
    assert.equal(pawn.spellId, FETID_ROOK_PHASE2_KIT_FIRST_ID);
  });
});

describe("player-visible leftover twins never occupy", () => {
  it("live kit Venom keeps zero twins so the dead rook awards immediately", () => {
    const live = wxFetidRookSplitDecide(phase2SplitKit());
    assert.equal(live.type, "spell");
    assert.equal(Number(kitVenom.damage), 0);
    assert.equal(kitVenom.isDotSpell, true);
    assert.equal(
      twinCountAfterFetidRookDecide({ decidedAbility: live.ability }),
      0,
    );
    const leftoverHostiles = fetidRookHostilesAfterDecide({
      bossHp: 0,
      decidedAbility: live.ability,
    });
    assert.equal(leftoverHostiles, 0);
    assert.equal(
      shouldAwardVictory({
        inBattle: true,
        deathTriggered: false,
        battleStartIdsSize: 1,
        hostilesRemaining: leftoverHostiles,
      }),
      true,
      "live leftover has a dead rook and zero twins",
    );
  });

  it("advertised twins occupy the graph after the 420 HP rook dies", () => {
    const next = resolveFetidRookSplitDecide(phase2SplitKit());
    assert.equal(next.ability, SPLIT_ROOKS_DECIDE_ABILITY);
    assert.equal(
      twinCountAfterFetidRookDecide({ decidedAbility: next.ability }),
      SPLIT_ROOKS_TWIN_COUNT,
    );
    const advertisedHostiles = fetidRookHostilesAfterDecide({
      bossHp: 0,
      decidedAbility: next.ability,
    });
    assert.equal(advertisedHostiles, SPLIT_ROOKS_TWIN_COUNT);
    assert.equal(
      shouldAwardVictory({
        inBattle: true,
        deathTriggered: false,
        battleStartIdsSize: 1 + SPLIT_ROOKS_TWIN_COUNT,
        hostilesRemaining: advertisedHostiles,
      }),
      false,
      "advertised two rooks still occupy the fight",
    );
    assert.equal(SPLIT_ROOKS_ADVERTISED_HP, 210);
    assert.equal(FETID_ROOK_HP, 420);
    assert.equal(PLAYER_HP, 100);
    assert.equal(STRIKE_DAMAGE, 10);
  });

  it("kit Venom is 0-damage DoT — it cannot substitute for occupying twins", () => {
    assert.equal(Number(kitVenom.damage), 0);
    assert.equal(kitVenom.isDotSpell, true);
    assert.equal(Number(kitVenom.dotDamagePerTurn ?? kitVenom.dotDamage), 4);
    assert.equal(Number(kitVenom.dotDuration), 3);
    assert.equal(PLAYER_HP, 100);
    const playerAfterLiveDot = PLAYER_HP - 4 * 3;
    assert.equal(playerAfterLiveDot, 88);
    assert.equal(
      twinCountAfterFetidRookDecide({
        decidedAbility: wxFetidRookSplitDecide(phase2SplitKit()).ability,
      }),
      0,
      "player HP tax leaves zero twins on the board",
    );
  });
});

describe("production still decides kit first and still writes rook twins", () => {
  it("decideFetidRookAction still returns kit before Split before Rot", () => {
    const src = readFileSync(
      join(dirname(fileURLToPath(import.meta.url)), "../hooks/useBossAI.ts"),
      "utf8",
    );
    const start = src.indexOf("// ── 7. Fetid Rook");
    const end = src.indexOf("// ── 8. Eternal Pawn King");
    assert.ok(start >= 0 && end > start, "Fetid Rook decide is present");
    const body = src.slice(start, end);
    const kitIdx = body.indexOf("pickBossKitSpell");
    const splitIdx = body.indexOf("BossAbility.SPLIT_ROOKS");
    const rotIdx = body.indexOf("BossAbility.COMPOUNDING_ROT");
    assert.ok(kitIdx >= 0, "kit pick is present");
    assert.ok(splitIdx >= 0, "SPLIT_ROOKS is present");
    assert.ok(rotIdx >= 0, "COMPOUNDING_ROT is present");
    assert.ok(kitIdx < splitIdx, "kit still wins the phase-2 Split turn");
    assert.ok(splitIdx < rotIdx, "Split still sits before adjacent Rot");
    assert.ok(body.includes('type: "spell"'));
    assert.ok(body.includes('type: "split"'));
    assert.ok(body.includes("bossState.currentPhase === 2"));
    assert.ok(body.includes("!bossState.splitRooksSpawned"));
    assert.equal(body.includes("resolveFetidRookSplitDecide"), false);
    assert.equal(body.includes("wxFetidRookKitBlocksSplit"), false);
    assert.equal(body.includes("resolveFetidSplitRookCommittedHp"), false);
  });

  it("applySplitRooks still writes advertised ceil(hp/2) rook twins", () => {
    const src = readFileSync(
      join(
        dirname(fileURLToPath(import.meta.url)),
        "../hooks/useBossSystem.ts",
      ),
      "utf8",
    );
    const body = src.slice(
      src.indexOf("function applySplitRooks"),
      src.indexOf("function applyAdvancePerTurn"),
    );
    assert.ok(body.includes("Math.ceil(params.bossEntry.hp / 2)"));
    assert.ok(body.includes('pieceType: "rook"'));
    assert.ok(body.includes("isBossMinion: true"));
    assert.ok(body.includes("getAdjacentTiles"));
    assert.ok(body.includes(SPLIT_ROOKS_LOG_NEEDLE));
    assert.ok(body.includes("split_rook_"));
    assert.equal(body.includes("resolveFetidRookSplitDecide"), false);
    assert.equal(body.includes("resolveFetidSplitRookCommittedHp"), false);
    assert.ok(src.includes("case BossAbility.SPLIT_ROOKS:"));
  });

  it("WorldExploration still commits spawns but never decides Fetid Rook Split", () => {
    const wx = readFileSync(
      join(
        dirname(fileURLToPath(import.meta.url)),
        "../components/WorldExploration.tsx",
      ),
      "utf8",
    );
    const start = wx.indexOf("if (res?.spawns && res.spawns.length > 0)");
    assert.ok(start >= 0, "live spawn commit is present");
    const body = wx.slice(start, start + 160);
    assert.ok(body.includes("res.spawns.map"));
    assert.equal(wx.includes("resolveFetidRookSplitDecide"), false);
    assert.equal(wx.includes("wxFetidRookKitBlocksSplit"), false);
    assert.ok(wx.includes("n[m.id] = 20"), "HP stamp leftover of #1231 stays");
    assert.ok(
      wx.includes("PROMOTE_QUEEN, SPLIT_ROOKS, MERGE_BISHOPS"),
      "endsTurn still names SPLIT_ROOKS",
    );
  });

  it("fetid_rook still advertises SPLIT_ROOKS in phase 2", () => {
    const src = readFileSync(
      join(dirname(fileURLToPath(import.meta.url)), "../types/bossDefaults.ts"),
      "utf8",
    );
    const fetid = src.slice(
      src.indexOf('id: "fetid_rook"'),
      src.indexOf('id: "eternal_pawn_king"'),
    );
    const p1 = fetid.slice(fetid.indexOf("phase1:"), fetid.indexOf("phase2:"));
    const p2 = fetid.slice(fetid.indexOf("phase2:"));
    assert.equal(p1.includes("BossAbility.SPLIT_ROOKS"), false);
    assert.ok(p2.includes("BossAbility.SPLIT_ROOKS"));
    assert.ok(p2.includes("BossAbility.COMPOUNDING_ROT"));
    assert.ok(p2.includes("summonCount: 2"));
    assert.ok(fetid.includes("hp: 420"));
    assert.equal(FETID_ROOK_SPLIT_DECIDE_ID, "fetid_rook");
    assert.ok(
      p2.includes("hpThreshold: 0.0"),
      "phase-gate leftover of #1231 stays unrestored",
    );
  });

  it("Boss Guide still advertises two independent rooks, not kit Venom", () => {
    const src = readFileSync(
      join(
        dirname(fileURLToPath(import.meta.url)),
        "../components/BossGuideModal.tsx",
      ),
      "utf8",
    );
    const start = src.indexOf(SPLIT_ROOKS_GUIDE_NEEDLE);
    assert.ok(start >= 0, "SPLIT_ROOKS guide copy is present");
    const lineEnd = src.indexOf("\n", start);
    const body = src.slice(start, lineEnd >= 0 ? lineEnd : start + 160);
    assert.ok(body.includes("two independent rooks"));
    assert.equal(body.includes("spell-venom-strike"), false);
  });
});
