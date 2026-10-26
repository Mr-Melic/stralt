import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { starterSpells } from "../data/spellData.ts";
import { shouldAwardVictory } from "./battleSetup.ts";
import {
  ANCHOR_TILES_ABILITY,
  DAMAGE_IMMUNE_ABILITY,
  ENTHRONED_VOID_ID,
  ENTHRONED_VOID_INIT,
  GHOST_SUMMON_ABILITY,
  PHANTOM_SPAWN_ABILITY,
  PHANTOM_SPAWN_AP,
  PHANTOM_SPAWN_ATK,
  PHANTOM_SPAWN_HP,
  PHANTOM_SPAWN_LOG_NEEDLE,
  PHANTOM_SPAWN_PIECE,
  SCROLL_SUMMON_ABILITY,
  SPLIT_ROOKS_ABILITY,
  WX_MINION_HP_ADD,
  WX_MINION_HP_MULT,
  WX_MINION_HP_STAMP,
  WX_MINION_INIT_OFFSET,
  enthronedVoidHostilesRemaining,
  isPhantomSpawn,
  leftoverPhantomBlocksVictory,
  phantomHpAfterStrike,
  resolvePhantomSpawnCommittedHp,
  wxBossMinionFormulaDamage,
  wxBossMinionFormulaHp,
  wxPhantomSpawnHpOverwritesAdvertised,
  wxPhantomSpawnLiveCommittedHp,
} from "./bossPhantomSpawnHpCommit.ts";

const strike = starterSpells.find((s) => s.id === "physical_attack");
assert.ok(strike, "physical_attack");
const STRIKE_DAMAGE = Number(strike.damage);
const ENTHRONED_VOID_HP = 280;

function phantomSpawn() {
  return {
    id: "void_phantom_1",
    pieceType: PHANTOM_SPAWN_PIECE,
    hp: PHANTOM_SPAWN_HP,
    maxHp: PHANTOM_SPAWN_HP,
    atk: PHANTOM_SPAWN_ATK,
    ap: PHANTOM_SPAWN_AP,
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

function splitRookSpawn() {
  return {
    id: "split_rook_0",
    pieceType: "rook" as const,
    hp: 210,
    maxHp: 210,
    atk: 25,
    ap: 5,
    isBossMinion: true,
  };
}

describe("wxPhantomSpawnLiveCommittedHp (live leftover)", () => {
  it("stamps advertised 1 HP phantoms to 20 on the combat map", () => {
    const spawn = phantomSpawn();
    assert.equal(isPhantomSpawn(spawn), true);
    assert.equal(wxPhantomSpawnLiveCommittedHp(spawn), WX_MINION_HP_STAMP);
    assert.equal(wxPhantomSpawnLiveCommittedHp(spawn), 20);
    assert.notEqual(wxPhantomSpawnLiveCommittedHp(spawn), PHANTOM_SPAWN_HP);
    assert.equal(wxPhantomSpawnHpOverwritesAdvertised(spawn), true);
  });

  it("computes the init formula 148 then discards it — combat reads the stamp", () => {
    assert.equal(ENTHRONED_VOID_INIT, 18);
    assert.equal(WX_MINION_INIT_OFFSET, 2);
    assert.equal(WX_MINION_HP_MULT, 8);
    assert.equal(WX_MINION_HP_ADD, 20);
    assert.equal(wxBossMinionFormulaHp(ENTHRONED_VOID_INIT), 148);
    assert.notEqual(
      wxBossMinionFormulaHp(ENTHRONED_VOID_INIT),
      PHANTOM_SPAWN_HP,
    );
    assert.notEqual(
      wxBossMinionFormulaHp(ENTHRONED_VOID_INIT),
      WX_MINION_HP_STAMP,
    );
    assert.equal(wxPhantomSpawnLiveCommittedHp(phantomSpawn()), 20);
  });

  it("does not treat skeleton 20 / scroll 30 / ghost 1 / split-rook as this leftover", () => {
    assert.equal(isPhantomSpawn(skeletonSpawn()), false);
    assert.equal(isPhantomSpawn(scrollSpawn()), false);
    assert.equal(isPhantomSpawn(ghostSpawn()), false);
    assert.equal(isPhantomSpawn(splitRookSpawn()), false);
    assert.equal(wxPhantomSpawnHpOverwritesAdvertised(skeletonSpawn()), false);
    assert.equal(wxPhantomSpawnHpOverwritesAdvertised(scrollSpawn()), false);
    assert.equal(wxPhantomSpawnHpOverwritesAdvertised(ghostSpawn()), false);
  });
});

describe("resolvePhantomSpawnCommittedHp", () => {
  it("keeps advertised 1 HP on an Enthroned Void phantom spawn", () => {
    const spawn = phantomSpawn();
    assert.equal(resolvePhantomSpawnCommittedHp(spawn), PHANTOM_SPAWN_HP);
    assert.equal(resolvePhantomSpawnCommittedHp(spawn), 1);
    assert.notEqual(
      resolvePhantomSpawnCommittedHp(spawn),
      wxPhantomSpawnLiveCommittedHp(spawn),
    );
  });

  it("still stamps scroll / ghost / split-rook / skeleton — not this leftover", () => {
    assert.equal(resolvePhantomSpawnCommittedHp(scrollSpawn()), 20);
    assert.equal(resolvePhantomSpawnCommittedHp(ghostSpawn()), 20);
    assert.equal(resolvePhantomSpawnCommittedHp(splitRookSpawn()), 20);
    assert.equal(resolvePhantomSpawnCommittedHp(skeletonSpawn()), 20);
    assert.notEqual(SCROLL_SUMMON_ABILITY, PHANTOM_SPAWN_ABILITY);
    assert.notEqual(GHOST_SUMMON_ABILITY, PHANTOM_SPAWN_ABILITY);
    assert.notEqual(SPLIT_ROOKS_ABILITY, PHANTOM_SPAWN_ABILITY);
  });

  it("does not restore advertised atk 5 or ap 2", () => {
    assert.equal(PHANTOM_SPAWN_ATK, 5);
    assert.equal(PHANTOM_SPAWN_AP, 2);
    assert.equal(wxBossMinionFormulaDamage(ENTHRONED_VOID_INIT), 35);
    assert.notEqual(
      wxBossMinionFormulaDamage(ENTHRONED_VOID_INIT),
      PHANTOM_SPAWN_ATK,
    );
    assert.equal(resolvePhantomSpawnCommittedHp(phantomSpawn()), 1);
  });

  it("non-finite advertised HP fail-closed to the stamp", () => {
    assert.equal(
      resolvePhantomSpawnCommittedHp({
        pieceType: PHANTOM_SPAWN_PIECE,
        hp: Number.NaN,
        isBossMinion: true,
      }),
      WX_MINION_HP_STAMP,
    );
    assert.equal(wxBossMinionFormulaHp(Number.NaN), WX_MINION_HP_STAMP);
    assert.equal(
      isPhantomSpawn({
        pieceType: PHANTOM_SPAWN_PIECE,
        hp: 1,
        isBossMinion: false,
      }),
      false,
    );
  });
});

describe("player-visible one-Strike fork", () => {
  it("live stamp 20 survives one Strike 10 and still blocks shouldAwardVictory", () => {
    const live = wxPhantomSpawnLiveCommittedHp(phantomSpawn());
    assert.equal(STRIKE_DAMAGE, 10);
    const afterOne = phantomHpAfterStrike({
      phantomHp: live,
      strikeDamage: STRIKE_DAMAGE,
    });
    assert.equal(afterOne, 10);
    assert.equal(
      leftoverPhantomBlocksVictory({
        inBattle: true,
        deathTriggered: false,
        battleStartIdsSize: 2,
        bossHp: 0,
        phantomHp: afterOne,
      }),
      true,
      "live 20 HP phantom still occupies the fight graph after one Strike",
    );
    assert.equal(
      shouldAwardVictory({
        inBattle: true,
        deathTriggered: false,
        battleStartIdsSize: 2,
        hostilesRemaining: enthronedVoidHostilesRemaining({
          bossHp: 0,
          phantomHp: afterOne,
        }),
      }),
      false,
    );
    const afterTwo = phantomHpAfterStrike({
      phantomHp: afterOne,
      strikeDamage: STRIKE_DAMAGE,
    });
    assert.equal(afterTwo, 0);
    assert.equal(
      leftoverPhantomBlocksVictory({
        inBattle: true,
        deathTriggered: false,
        battleStartIdsSize: 2,
        bossHp: 0,
        phantomHp: afterTwo,
      }),
      false,
    );
  });

  it("advertised 1 HP dies to one Strike 10 and awards victory", () => {
    const next = resolvePhantomSpawnCommittedHp(phantomSpawn());
    assert.equal(next, 1);
    const afterOne = phantomHpAfterStrike({
      phantomHp: next,
      strikeDamage: STRIKE_DAMAGE,
    });
    assert.equal(afterOne, 0);
    assert.equal(
      leftoverPhantomBlocksVictory({
        inBattle: true,
        deathTriggered: false,
        battleStartIdsSize: 2,
        bossHp: 0,
        phantomHp: afterOne,
      }),
      false,
    );
    assert.equal(
      shouldAwardVictory({
        inBattle: true,
        deathTriggered: false,
        battleStartIdsSize: 2,
        hostilesRemaining: enthronedVoidHostilesRemaining({
          bossHp: 0,
          phantomHp: afterOne,
        }),
      }),
      true,
      "advertised 1 HP phantom is gone after one Strike",
    );
    assert.equal(ENTHRONED_VOID_HP, 280);
  });

  it("does not steal #1113 scroll HP or #1094 immunity / anchors", () => {
    assert.equal(PHANTOM_SPAWN_ABILITY, "PHANTOM_SPAWN");
    assert.notEqual(SCROLL_SUMMON_ABILITY, PHANTOM_SPAWN_ABILITY);
    assert.notEqual(ANCHOR_TILES_ABILITY, PHANTOM_SPAWN_ABILITY);
    assert.notEqual(DAMAGE_IMMUNE_ABILITY, PHANTOM_SPAWN_ABILITY);
  });
});

describe("production still stamps 20 and never relocates spawn dests", () => {
  it("WorldExploration still overwrites spawn HP and stamps enemyHpMap 20", () => {
    const wx = readFileSync(
      join(
        dirname(fileURLToPath(import.meta.url)),
        "../components/WorldExploration.tsx",
      ),
      "utf8",
    );
    const start = wx.indexOf("if (res?.spawns && res.spawns.length > 0)");
    assert.ok(start >= 0, "live spawn commit is present");
    const body = wx.slice(start, start + 4500);
    assert.ok(body.includes("baseStats.init - 2) * 8 + 20"));
    assert.ok(body.includes("n[m.id] = 20"));
    assert.ok(body.includes("addCombatant("));
    assert.equal(wx.includes("resolvePhantomSpawnCommittedHp"), false);
    assert.equal(wx.includes("wxPhantomSpawnLiveCommittedHp"), false);
    assert.equal(wx.includes("wxPhantomSpawnHpOverwritesAdvertised"), false);
  });

  it("applyPhantomSpawn still writes advertised 1 HP / atk 5 adjacent pawns", () => {
    const src = readFileSync(
      join(
        dirname(fileURLToPath(import.meta.url)),
        "../hooks/useBossSystem.ts",
      ),
      "utf8",
    );
    const body = src.slice(
      src.indexOf("function applyPhantomSpawn"),
      src.indexOf("function applyApDrainPassive"),
    );
    assert.ok(body.includes("hp: 1"));
    assert.ok(body.includes("maxHp: 1"));
    assert.ok(body.includes("atk: 5"));
    assert.ok(body.includes("ap: 2"));
    assert.ok(body.includes('pieceType: "pawn"'));
    assert.ok(body.includes("isBossMinion: true"));
    assert.ok(body.includes("getAdjacentTiles"));
    assert.ok(body.includes(PHANTOM_SPAWN_LOG_NEEDLE));
    assert.equal(body.includes("resolvePhantomSpawnCommittedHp"), false);
    const ghost = src.slice(
      src.indexOf("function applyGhostSummon"),
      src.indexOf("// ── New ability handlers for bosses 13–20"),
    );
    assert.ok(ghost.includes("hp: 1"));
    assert.ok(ghost.includes('pieceType: "king"'));
    const scroll = src.slice(
      src.indexOf("function applyScrollSummon"),
      src.indexOf("function applyGlyphTrap"),
    );
    assert.ok(scroll.includes("hp: 30"));
  });

  it("decideEnthronedVoidAction still returns kit before Phantom — decide leftover", () => {
    const src = readFileSync(
      join(dirname(fileURLToPath(import.meta.url)), "../hooks/useBossAI.ts"),
      "utf8",
    );
    const start = src.indexOf("// ── 20. Enthroned Void");
    const end = src.indexOf("// ── Boss ID lookup map");
    assert.ok(start >= 0 && end > start, "Enthroned Void decide is present");
    const body = src.slice(start, end);
    const kitIdx = body.indexOf("pickBossKitSpell");
    const phantomIdx = body.indexOf("BossAbility.PHANTOM_SPAWN");
    assert.ok(kitIdx >= 0, "kit pick is present");
    assert.ok(phantomIdx >= 0, "PHANTOM_SPAWN is present");
    assert.ok(kitIdx < phantomIdx, "kit still wins the even Phantom turn");
    assert.equal(body.includes("resolvePhantomSpawnCommittedHp"), false);
    assert.equal(body.includes("resolveEnthronedVoidEvenTurnDecide"), false);
  });

  it("enthroned_void still advertises PHANTOM_SPAWN HP via apply, init 18", () => {
    const src = readFileSync(
      join(dirname(fileURLToPath(import.meta.url)), "../types/bossDefaults.ts"),
      "utf8",
    );
    const voidBoss = src.slice(src.indexOf('id: "enthroned_void"'));
    assert.ok(voidBoss.includes("BossAbility.PHANTOM_SPAWN"));
    assert.ok(voidBoss.includes("init: 18"));
    assert.equal(ENTHRONED_VOID_ID, "enthroned_void");
    const p2 = voidBoss.slice(voidBoss.indexOf("phase2:"));
    assert.equal(p2.includes("BossAbility.PHANTOM_SPAWN"), false);
  });
});
