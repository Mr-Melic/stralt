/**
 * Combat action parity: Fetid Rook SPLIT_ROOKS advertised half-HP twins
 * never commit — WX stamps enemyHpMap 20.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { starterSpells } from "../data/spellData.ts";
import { shouldAwardVictory } from "./battleSetup.ts";
import {
  FETID_ROOK_AP,
  FETID_ROOK_ATK,
  FETID_ROOK_HP,
  FETID_ROOK_ID,
  FETID_ROOK_INIT,
  FETID_SPLIT_KIT_FIRST_SPELL,
  FETID_SPLIT_ROOKS_ABILITY,
  FETID_SPLIT_ROOKS_LOG_NEEDLE,
  FETID_SPLIT_ROOK_ATK_SCALE,
  FETID_SPLIT_ROOK_PIECE,
  FETID_SPLIT_WX_HP_ADD,
  FETID_SPLIT_WX_HP_MULT,
  FETID_SPLIT_WX_HP_STAMP,
  FETID_SPLIT_WX_INIT_OFFSET,
  advertisedFetidSplitRookAtk,
  advertisedFetidSplitRookHp,
  fetidRookHostilesRemaining,
  fetidSplitRookHpAfterStrike,
  isFetidSplitRookSpawn,
  leftoverFetidSplitRookBlocksVictory,
  resolveFetidSplitRookCommittedHp,
  wxFetidSplitMinionFormulaDamage,
  wxFetidSplitMinionFormulaHp,
  wxFetidSplitRookHpOverwritesAdvertised,
  wxFetidSplitRookLiveCommittedHp,
} from "./bossSplitRooksHpCommit.ts";

const strike = starterSpells.find((s) => s.id === "physical_attack");
assert.ok(strike, "physical_attack");
const STRIKE_DAMAGE = Number(strike.damage);

function splitRookSpawn() {
  return {
    id: "split_rook_0_1",
    pieceType: FETID_SPLIT_ROOK_PIECE,
    hp: advertisedFetidSplitRookHp(FETID_ROOK_HP),
    maxHp: advertisedFetidSplitRookHp(FETID_ROOK_HP),
    atk: advertisedFetidSplitRookAtk(FETID_ROOK_ATK),
    ap: FETID_ROOK_AP,
    isBossMinion: true,
  };
}

function skeletonSpawn() {
  return {
    id: "minion_countess_0",
    pieceType: "pawn" as const,
    hp: 20,
    maxHp: 20,
    atk: 8,
    ap: 3,
    isBossMinion: true,
  };
}

function phantomSpawn() {
  return {
    id: "void_phantom_1",
    pieceType: "pawn" as const,
    hp: 1,
    maxHp: 1,
    atk: 5,
    ap: 2,
    isBossMinion: true,
  };
}

function ghostSpawn() {
  return {
    id: "ghost_final_pawn_1",
    pieceType: "king" as const,
    hp: 1,
    maxHp: 1,
    atk: 5,
    ap: 2,
    isBossMinion: true,
  };
}

function scrollSpawn() {
  return {
    id: "scroll_pale_archivist_1",
    pieceType: "bishop" as const,
    hp: 30,
    maxHp: 30,
    atk: 8,
    ap: 3,
    isBossMinion: true,
  };
}

function wxSource(): string {
  return readFileSync(
    join(
      dirname(fileURLToPath(import.meta.url)),
      "../components/WorldExploration.tsx",
    ),
    "utf8",
  );
}

function bossAiSource(): string {
  return readFileSync(
    join(dirname(fileURLToPath(import.meta.url)), "../hooks/useBossAI.ts"),
    "utf8",
  );
}

function bossSystemSource(): string {
  return readFileSync(
    join(dirname(fileURLToPath(import.meta.url)), "../hooks/useBossSystem.ts"),
    "utf8",
  );
}

describe("SPLIT_ROOKS catalog / ability identity", () => {
  it("advertises half of Fetid Rook 420 and is distinct from stamp 20 / phantom 1 / scroll 30", () => {
    assert.equal(FETID_ROOK_HP, 420);
    assert.equal(advertisedFetidSplitRookHp(FETID_ROOK_HP), 210);
    assert.equal(advertisedFetidSplitRookAtk(FETID_ROOK_ATK), 25);
    assert.equal(FETID_SPLIT_ROOK_ATK_SCALE, 0.8);
    assert.equal(FETID_SPLIT_WX_HP_STAMP, 20);
    assert.notEqual(
      advertisedFetidSplitRookHp(FETID_ROOK_HP),
      FETID_SPLIT_WX_HP_STAMP,
    );
    assert.notEqual(advertisedFetidSplitRookHp(FETID_ROOK_HP), 1);
    assert.notEqual(advertisedFetidSplitRookHp(FETID_ROOK_HP), 30);
    assert.equal(isFetidSplitRookSpawn(splitRookSpawn()), true);
    assert.equal(isFetidSplitRookSpawn(skeletonSpawn()), false);
    assert.equal(isFetidSplitRookSpawn(phantomSpawn()), false);
    assert.equal(isFetidSplitRookSpawn(ghostSpawn()), false);
    assert.equal(isFetidSplitRookSpawn(scrollSpawn()), false);
    assert.equal(FETID_SPLIT_ROOKS_ABILITY, "SPLIT_ROOKS");
    assert.equal(FETID_ROOK_ID, "fetid_rook");
    assert.ok(FETID_SPLIT_ROOKS_LOG_NEEDLE.includes("splits into two rooks"));
  });
});

describe("wxFetidSplitRookLiveCommittedHp (live leftover)", () => {
  it("stamps advertised 210 HP twins to 20 on the combat map", () => {
    const spawn = splitRookSpawn();
    assert.equal(
      wxFetidSplitRookLiveCommittedHp(spawn),
      FETID_SPLIT_WX_HP_STAMP,
    );
    assert.equal(wxFetidSplitRookLiveCommittedHp(spawn), 20);
    assert.notEqual(
      wxFetidSplitRookLiveCommittedHp(spawn),
      advertisedFetidSplitRookHp(FETID_ROOK_HP),
    );
    assert.equal(wxFetidSplitRookHpOverwritesAdvertised(spawn), true);
  });

  it("computes the init formula 60 then discards it — combat reads the stamp", () => {
    assert.equal(FETID_ROOK_INIT, 7);
    assert.equal(FETID_SPLIT_WX_INIT_OFFSET, 2);
    assert.equal(FETID_SPLIT_WX_HP_MULT, 8);
    assert.equal(FETID_SPLIT_WX_HP_ADD, 20);
    assert.equal(wxFetidSplitMinionFormulaHp(FETID_ROOK_INIT), 60);
    assert.notEqual(
      wxFetidSplitMinionFormulaHp(FETID_ROOK_INIT),
      advertisedFetidSplitRookHp(FETID_ROOK_HP),
    );
    assert.notEqual(
      wxFetidSplitMinionFormulaHp(FETID_ROOK_INIT),
      FETID_SPLIT_WX_HP_STAMP,
    );
    assert.equal(wxFetidSplitRookLiveCommittedHp(splitRookSpawn()), 20);
  });

  it("does not treat skeleton 20 / phantom 1 / scroll 30 / ghost 1 as this leftover", () => {
    assert.equal(
      wxFetidSplitRookHpOverwritesAdvertised(skeletonSpawn()),
      false,
    );
    assert.equal(wxFetidSplitRookHpOverwritesAdvertised(phantomSpawn()), false);
    assert.equal(wxFetidSplitRookHpOverwritesAdvertised(scrollSpawn()), false);
    assert.equal(wxFetidSplitRookHpOverwritesAdvertised(ghostSpawn()), false);
  });
});

describe("resolveFetidSplitRookCommittedHp", () => {
  it("keeps advertised 210 HP on a Fetid Rook split-rook spawn", () => {
    const spawn = splitRookSpawn();
    assert.equal(resolveFetidSplitRookCommittedHp(spawn), 210);
    assert.equal(
      resolveFetidSplitRookCommittedHp(spawn),
      advertisedFetidSplitRookHp(FETID_ROOK_HP),
    );
    assert.notEqual(
      resolveFetidSplitRookCommittedHp(spawn),
      wxFetidSplitRookLiveCommittedHp(spawn),
    );
  });

  it("still stamps scroll / ghost / phantom / skeleton — not this leftover", () => {
    assert.equal(resolveFetidSplitRookCommittedHp(scrollSpawn()), 20);
    assert.equal(resolveFetidSplitRookCommittedHp(ghostSpawn()), 20);
    assert.equal(resolveFetidSplitRookCommittedHp(phantomSpawn()), 20);
    assert.equal(resolveFetidSplitRookCommittedHp(skeletonSpawn()), 20);
  });

  it("does not restore advertised atk 25 or ap 5", () => {
    assert.equal(advertisedFetidSplitRookAtk(FETID_ROOK_ATK), 25);
    assert.equal(FETID_ROOK_AP, 5);
    assert.equal(wxFetidSplitMinionFormulaDamage(FETID_ROOK_INIT), 13);
    assert.notEqual(
      wxFetidSplitMinionFormulaDamage(FETID_ROOK_INIT),
      advertisedFetidSplitRookAtk(FETID_ROOK_ATK),
    );
    assert.equal(resolveFetidSplitRookCommittedHp(splitRookSpawn()), 210);
  });

  it("non-finite advertised HP fail-closed to the stamp", () => {
    assert.equal(
      resolveFetidSplitRookCommittedHp({
        id: "split_rook_bad",
        pieceType: FETID_SPLIT_ROOK_PIECE,
        hp: Number.NaN,
        isBossMinion: true,
      }),
      FETID_SPLIT_WX_HP_STAMP,
    );
    assert.equal(
      wxFetidSplitMinionFormulaHp(Number.NaN),
      FETID_SPLIT_WX_HP_STAMP,
    );
    assert.equal(
      isFetidSplitRookSpawn({
        id: "split_rook_0_1",
        pieceType: FETID_SPLIT_ROOK_PIECE,
        hp: 210,
        isBossMinion: false,
      }),
      false,
    );
    assert.equal(
      advertisedFetidSplitRookHp(Number.NaN),
      FETID_SPLIT_WX_HP_STAMP,
    );
  });
});

describe("player-visible two-Strike fork", () => {
  it("live stamp 20 dies to two Strike 10 and awards victory", () => {
    const live = wxFetidSplitRookLiveCommittedHp(splitRookSpawn());
    assert.equal(STRIKE_DAMAGE, 10);
    const afterOne = fetidSplitRookHpAfterStrike({
      splitRookHp: live,
      strikeDamage: STRIKE_DAMAGE,
    });
    assert.equal(afterOne, 10);
    assert.equal(
      leftoverFetidSplitRookBlocksVictory({
        inBattle: true,
        deathTriggered: false,
        battleStartIdsSize: 2,
        bossHp: 0,
        splitRookHp: afterOne,
      }),
      true,
      "live 20 HP twin still occupies the fight graph after one Strike",
    );
    const afterTwo = fetidSplitRookHpAfterStrike({
      splitRookHp: afterOne,
      strikeDamage: STRIKE_DAMAGE,
    });
    assert.equal(afterTwo, 0);
    assert.equal(
      leftoverFetidSplitRookBlocksVictory({
        inBattle: true,
        deathTriggered: false,
        battleStartIdsSize: 2,
        bossHp: 0,
        splitRookHp: afterTwo,
      }),
      false,
    );
    assert.equal(
      shouldAwardVictory({
        inBattle: true,
        deathTriggered: false,
        battleStartIdsSize: 2,
        hostilesRemaining: fetidRookHostilesRemaining({
          bossHp: 0,
          splitRookHp: afterTwo,
        }),
      }),
      true,
      "live 20 HP twin is gone after two Strikes",
    );
  });

  it("advertised 210 HP survives two Strike 10 and still blocks shouldAwardVictory", () => {
    const next = resolveFetidSplitRookCommittedHp(splitRookSpawn());
    assert.equal(next, 210);
    const afterOne = fetidSplitRookHpAfterStrike({
      splitRookHp: next,
      strikeDamage: STRIKE_DAMAGE,
    });
    assert.equal(afterOne, 200);
    const afterTwo = fetidSplitRookHpAfterStrike({
      splitRookHp: afterOne,
      strikeDamage: STRIKE_DAMAGE,
    });
    assert.equal(afterTwo, 190);
    assert.equal(
      leftoverFetidSplitRookBlocksVictory({
        inBattle: true,
        deathTriggered: false,
        battleStartIdsSize: 2,
        bossHp: 0,
        splitRookHp: afterTwo,
      }),
      true,
      "advertised half-HP twin still occupies the fight graph after two Strikes",
    );
    assert.equal(
      shouldAwardVictory({
        inBattle: true,
        deathTriggered: false,
        battleStartIdsSize: 2,
        hostilesRemaining: fetidRookHostilesRemaining({
          bossHp: 0,
          splitRookHp: afterTwo,
        }),
      }),
      false,
    );
  });

  it("does not steal kit-first Venom or the 0.0 phase-2 gate", () => {
    assert.equal(FETID_SPLIT_KIT_FIRST_SPELL, "spell-venom-strike");
    assert.notEqual(FETID_SPLIT_KIT_FIRST_SPELL, FETID_SPLIT_ROOKS_ABILITY);
  });
});

describe("production still stamps 20 and never relocates spawn dests", () => {
  it("WorldExploration still overwrites spawn HP and stamps enemyHpMap 20", () => {
    const wx = wxSource();
    const start = wx.indexOf("if (res?.spawns && res.spawns.length > 0)");
    assert.ok(start >= 0, "live spawn commit is present");
    const body = wx.slice(start, start + 4500);
    assert.ok(body.includes("baseStats.init - 2) * 8 + 20"));
    assert.ok(body.includes("n[m.id] = 20"));
    assert.ok(body.includes("addCombatant("));
    assert.equal(wx.includes("resolveFetidSplitRookCommittedHp"), false);
    assert.equal(wx.includes("wxFetidSplitRookLiveCommittedHp"), false);
    assert.equal(wx.includes("wxFetidSplitRookHpOverwritesAdvertised"), false);
  });

  it("applySplitRooks still writes advertised ceil(hp/2) rook twins", () => {
    const src = bossSystemSource();
    const body = src.slice(
      src.indexOf("function applySplitRooks"),
      src.indexOf("function applyAdvancePerTurn"),
    );
    assert.ok(body.includes("Math.ceil(params.bossEntry.hp / 2)"));
    assert.ok(body.includes('pieceType: "rook"'));
    assert.ok(body.includes("isBossMinion: true"));
    assert.ok(body.includes("getAdjacentTiles"));
    assert.ok(body.includes(FETID_SPLIT_ROOKS_LOG_NEEDLE));
    assert.ok(body.includes("split_rook_"));
    assert.equal(body.includes("resolveFetidSplitRookCommittedHp"), false);
    assert.ok(src.includes("case BossAbility.SPLIT_ROOKS:"));
  });

  it("decideFetidRookAction still returns kit before Split — decide leftover", () => {
    const src = bossAiSource();
    const start = src.indexOf("// ── 7. Fetid Rook");
    const end = src.indexOf("// ── 8. Eternal Pawn King");
    assert.ok(start >= 0 && end > start, "Fetid Rook decide is present");
    const body = src.slice(start, end);
    const kitIdx = body.indexOf("pickBossKitSpell");
    const splitIdx = body.indexOf("BossAbility.SPLIT_ROOKS");
    assert.ok(kitIdx >= 0, "kit pick is present");
    assert.ok(splitIdx >= 0, "SPLIT_ROOKS is present");
    assert.ok(kitIdx < splitIdx, "kit still wins the phase-2 Split turn");
    assert.equal(body.includes("resolveFetidSplitRookCommittedHp"), false);
    assert.equal(body.includes(FETID_SPLIT_KIT_FIRST_SPELL), false);
  });

  it("fetid_rook still advertises SPLIT_ROOKS HP via apply, init 7, hp 420", () => {
    const src = readFileSync(
      join(dirname(fileURLToPath(import.meta.url)), "../types/bossDefaults.ts"),
      "utf8",
    );
    const fetid = src.slice(
      src.indexOf('id: "fetid_rook"'),
      src.indexOf('id: "eternal_pawn_king"'),
    );
    assert.ok(fetid.includes("BossAbility.SPLIT_ROOKS"));
    assert.ok(fetid.includes("init: 7"));
    assert.ok(fetid.includes("hp: 420"));
    assert.equal(FETID_ROOK_ID, "fetid_rook");
    const p1 = fetid.slice(fetid.indexOf("phase1:"), fetid.indexOf("phase2:"));
    assert.equal(p1.includes("BossAbility.SPLIT_ROOKS"), false);
    const p2 = fetid.slice(fetid.indexOf("phase2:"));
    assert.ok(p2.includes("BossAbility.SPLIT_ROOKS"));
  });
});
