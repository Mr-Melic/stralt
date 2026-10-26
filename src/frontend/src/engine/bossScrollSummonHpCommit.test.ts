import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { starterSpells } from "../data/spellData.ts";
import { shouldAwardVictory } from "./battleSetup.ts";
import {
  GLYPH_TRAP_ABILITY,
  INK_VEIL_ABILITY,
  PAGES_OF_DOOM_ABILITY,
  PALE_ARCHIVIST_ID,
  PALE_ARCHIVIST_INIT,
  PHANTOM_SPAWN_ABILITY,
  SCROLL_SUMMON_ABILITY,
  SCROLL_SUMMON_AP,
  SCROLL_SUMMON_ATK,
  SCROLL_SUMMON_HP,
  SCROLL_SUMMON_LOG_NEEDLE,
  SCROLL_SUMMON_PIECE,
  WX_MINION_HP_ADD,
  WX_MINION_HP_MULT,
  WX_MINION_HP_STAMP,
  WX_MINION_INIT_OFFSET,
  isScrollSummonSpawn,
  leftoverScrollBlocksVictory,
  paleArchivistHostilesRemaining,
  resolveScrollSummonCommittedHp,
  scrollHpAfterStrike,
  wxBossMinionFormulaDamage,
  wxBossMinionFormulaHp,
  wxScrollSummonHpOverwritesAdvertised,
  wxScrollSummonLiveCommittedHp,
} from "./bossScrollSummonHpCommit.ts";

const strike = starterSpells.find((s) => s.id === "physical_attack");
assert.ok(strike, "physical_attack");
const STRIKE_DAMAGE = Number(strike.damage);
const PALE_ARCHIVIST_HP = 350;

function scrollSpawn() {
  return {
    id: "scroll_pale_archivist_1",
    pieceType: SCROLL_SUMMON_PIECE,
    hp: SCROLL_SUMMON_HP,
    maxHp: SCROLL_SUMMON_HP,
    atk: SCROLL_SUMMON_ATK,
    ap: SCROLL_SUMMON_AP,
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

function splitRookSpawn() {
  return {
    id: "split_rook_0",
    pieceType: "rook" as const,
    hp: 100,
    maxHp: 100,
    atk: 16,
    ap: 4,
    isBossMinion: true,
  };
}

describe("wxScrollSummonLiveCommittedHp (live leftover)", () => {
  it("stamps advertised 30 HP Ancient Scrolls to 20 on the combat map", () => {
    const spawn = scrollSpawn();
    assert.equal(isScrollSummonSpawn(spawn), true);
    assert.equal(wxScrollSummonLiveCommittedHp(spawn), WX_MINION_HP_STAMP);
    assert.equal(wxScrollSummonLiveCommittedHp(spawn), 20);
    assert.notEqual(wxScrollSummonLiveCommittedHp(spawn), SCROLL_SUMMON_HP);
    assert.equal(wxScrollSummonHpOverwritesAdvertised(spawn), true);
  });

  it("computes the init formula 84 then discards it — combat reads the stamp", () => {
    assert.equal(PALE_ARCHIVIST_INIT, 10);
    assert.equal(WX_MINION_INIT_OFFSET, 2);
    assert.equal(WX_MINION_HP_MULT, 8);
    assert.equal(WX_MINION_HP_ADD, 20);
    assert.equal(wxBossMinionFormulaHp(PALE_ARCHIVIST_INIT), 84);
    assert.notEqual(
      wxBossMinionFormulaHp(PALE_ARCHIVIST_INIT),
      SCROLL_SUMMON_HP,
    );
    assert.notEqual(
      wxBossMinionFormulaHp(PALE_ARCHIVIST_INIT),
      WX_MINION_HP_STAMP,
    );
    assert.equal(wxScrollSummonLiveCommittedHp(scrollSpawn()), 20);
  });

  it("does not treat skeleton 20 / phantom 1 as this leftover", () => {
    assert.equal(isScrollSummonSpawn(skeletonSpawn()), false);
    assert.equal(isScrollSummonSpawn(phantomSpawn()), false);
    assert.equal(isScrollSummonSpawn(ghostSpawn()), false);
    assert.equal(isScrollSummonSpawn(splitRookSpawn()), false);
    assert.equal(wxScrollSummonHpOverwritesAdvertised(skeletonSpawn()), false);
    assert.equal(wxScrollSummonHpOverwritesAdvertised(phantomSpawn()), false);
  });
});

describe("resolveScrollSummonCommittedHp", () => {
  it("keeps advertised 30 HP on a Pale Archivist scroll spawn", () => {
    const spawn = scrollSpawn();
    assert.equal(resolveScrollSummonCommittedHp(spawn), SCROLL_SUMMON_HP);
    assert.equal(resolveScrollSummonCommittedHp(spawn), 30);
    assert.notEqual(
      resolveScrollSummonCommittedHp(spawn),
      wxScrollSummonLiveCommittedHp(spawn),
    );
  });

  it("still stamps phantom / ghost / split-rook / skeleton — not this leftover", () => {
    assert.equal(resolveScrollSummonCommittedHp(phantomSpawn()), 20);
    assert.equal(resolveScrollSummonCommittedHp(ghostSpawn()), 20);
    assert.equal(resolveScrollSummonCommittedHp(splitRookSpawn()), 20);
    assert.equal(resolveScrollSummonCommittedHp(skeletonSpawn()), 20);
    assert.notEqual(PHANTOM_SPAWN_ABILITY, SCROLL_SUMMON_ABILITY);
  });

  it("does not restore advertised atk 8 or ap 3", () => {
    assert.equal(SCROLL_SUMMON_ATK, 8);
    assert.equal(SCROLL_SUMMON_AP, 3);
    assert.equal(wxBossMinionFormulaDamage(PALE_ARCHIVIST_INIT), 19);
    assert.notEqual(
      wxBossMinionFormulaDamage(PALE_ARCHIVIST_INIT),
      SCROLL_SUMMON_ATK,
    );
    assert.equal(resolveScrollSummonCommittedHp(scrollSpawn()), 30);
  });

  it("non-finite advertised HP fail-closed to the stamp", () => {
    assert.equal(
      resolveScrollSummonCommittedHp({
        pieceType: SCROLL_SUMMON_PIECE,
        hp: Number.NaN,
        isBossMinion: true,
      }),
      WX_MINION_HP_STAMP,
    );
    assert.equal(wxBossMinionFormulaHp(Number.NaN), WX_MINION_HP_STAMP);
    assert.equal(
      isScrollSummonSpawn({
        pieceType: SCROLL_SUMMON_PIECE,
        hp: 30,
        isBossMinion: false,
      }),
      false,
    );
  });
});

describe("player-visible two-Strike fork", () => {
  it("live stamp 20 dies to two Strike 10 and awards victory", () => {
    const live = wxScrollSummonLiveCommittedHp(scrollSpawn());
    assert.equal(STRIKE_DAMAGE, 10);
    const afterOne = scrollHpAfterStrike({
      scrollHp: live,
      strikeDamage: STRIKE_DAMAGE,
    });
    assert.equal(afterOne, 10);
    assert.equal(
      leftoverScrollBlocksVictory({
        inBattle: true,
        deathTriggered: false,
        battleStartIdsSize: 2,
        bossHp: 0,
        scrollHp: afterOne,
      }),
      true,
    );
    const afterTwo = scrollHpAfterStrike({
      scrollHp: afterOne,
      strikeDamage: STRIKE_DAMAGE,
    });
    assert.equal(afterTwo, 0);
    assert.equal(
      leftoverScrollBlocksVictory({
        inBattle: true,
        deathTriggered: false,
        battleStartIdsSize: 2,
        bossHp: 0,
        scrollHp: afterTwo,
      }),
      false,
    );
    assert.equal(
      shouldAwardVictory({
        inBattle: true,
        deathTriggered: false,
        battleStartIdsSize: 2,
        hostilesRemaining: paleArchivistHostilesRemaining({
          bossHp: 0,
          scrollHp: afterTwo,
        }),
      }),
      true,
      "live 20 HP scroll is gone after two Strikes",
    );
  });

  it("advertised 30 HP survives two Strike 10 and still blocks shouldAwardVictory", () => {
    const next = resolveScrollSummonCommittedHp(scrollSpawn());
    assert.equal(next, 30);
    const afterOne = scrollHpAfterStrike({
      scrollHp: next,
      strikeDamage: STRIKE_DAMAGE,
    });
    assert.equal(afterOne, 20);
    const afterTwo = scrollHpAfterStrike({
      scrollHp: afterOne,
      strikeDamage: STRIKE_DAMAGE,
    });
    assert.equal(afterTwo, 10);
    assert.equal(
      leftoverScrollBlocksVictory({
        inBattle: true,
        deathTriggered: false,
        battleStartIdsSize: 2,
        bossHp: 0,
        scrollHp: afterTwo,
      }),
      true,
      "advertised Ancient Scroll still occupies the fight graph after two Strikes",
    );
    assert.equal(
      shouldAwardVictory({
        inBattle: true,
        deathTriggered: false,
        battleStartIdsSize: 2,
        hostilesRemaining: paleArchivistHostilesRemaining({
          bossHp: 0,
          scrollHp: afterTwo,
        }),
      }),
      false,
    );
    assert.equal(PALE_ARCHIVIST_HP, 350);
  });

  it("does not steal #1102 decide — kit-first still shadows spawn", () => {
    assert.equal(SCROLL_SUMMON_ABILITY, "SCROLL_SUMMON");
    assert.notEqual(PAGES_OF_DOOM_ABILITY, SCROLL_SUMMON_ABILITY);
    assert.notEqual(INK_VEIL_ABILITY, SCROLL_SUMMON_ABILITY);
    assert.notEqual(GLYPH_TRAP_ABILITY, SCROLL_SUMMON_ABILITY);
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
    assert.equal(wx.includes("resolveScrollSummonCommittedHp"), false);
    assert.equal(wx.includes("wxScrollSummonLiveCommittedHp"), false);
    assert.equal(wx.includes("wxScrollSummonHpOverwritesAdvertised"), false);
  });

  it("applyScrollSummon still writes advertised 30 HP / atk 8 adjacent guardians", () => {
    const src = readFileSync(
      join(
        dirname(fileURLToPath(import.meta.url)),
        "../hooks/useBossSystem.ts",
      ),
      "utf8",
    );
    const body = src.slice(
      src.indexOf("function applyScrollSummon"),
      src.indexOf("function applyGlyphTrap"),
    );
    assert.ok(body.includes("hp: 30"));
    assert.ok(body.includes("maxHp: 30"));
    assert.ok(body.includes("atk: 8"));
    assert.ok(body.includes("ap: 3"));
    assert.ok(body.includes('pieceType: "bishop"'));
    assert.ok(body.includes("isBossMinion: true"));
    assert.ok(body.includes("getAdjacentTiles"));
    assert.ok(body.includes(SCROLL_SUMMON_LOG_NEEDLE));
    assert.equal(body.includes("resolveScrollSummonCommittedHp"), false);
    const phantom = src.slice(
      src.indexOf("function applyPhantomSpawn"),
      src.indexOf("function applyApDrainPassive"),
    );
    assert.ok(phantom.includes("hp: 1"));
    assert.ok(phantom.includes("maxHp: 1"));
  });

  it("decidePaleArchivistAction still returns kit before Scroll — decide leftover of #1102", () => {
    const src = readFileSync(
      join(dirname(fileURLToPath(import.meta.url)), "../hooks/useBossAI.ts"),
      "utf8",
    );
    const start = src.indexOf("// ── 18. Pale Archivist");
    const end = src.indexOf("// ── 19. Twin Monarchs");
    assert.ok(start >= 0 && end > start, "Pale Archivist decide is present");
    const body = src.slice(start, end);
    const kitIdx = body.indexOf("pickBossKitSpell");
    const scrollIdx = body.indexOf("BossAbility.SCROLL_SUMMON");
    assert.ok(kitIdx >= 0, "kit pick is present");
    assert.ok(scrollIdx >= 0, "SCROLL_SUMMON is present");
    assert.ok(kitIdx < scrollIdx, "kit still wins the odd Scroll turn");
    assert.equal(body.includes("resolveScrollSummonCommittedHp"), false);
    assert.equal(body.includes("resolvePaleArchivistOddTurnDecide"), false);
  });

  it("pale_archivist still advertises SCROLL_SUMMON HP via apply, init 10", () => {
    const src = readFileSync(
      join(dirname(fileURLToPath(import.meta.url)), "../types/bossDefaults.ts"),
      "utf8",
    );
    const archivist = src.slice(
      src.indexOf('id: "pale_archivist"'),
      src.indexOf('id: "twin_monarchs"'),
    );
    assert.ok(archivist.includes("BossAbility.SCROLL_SUMMON"));
    assert.ok(archivist.includes("init: 10"));
    assert.equal(PALE_ARCHIVIST_ID, "pale_archivist");
    const p2 = archivist.slice(archivist.indexOf("phase2:"));
    assert.equal(p2.includes("BossAbility.SCROLL_SUMMON"), false);
  });
});
