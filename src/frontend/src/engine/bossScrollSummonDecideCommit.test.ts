import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { starterSpells } from "../data/spellData.ts";
import { shouldAwardVictory } from "./battleSetup.ts";
import {
  ANCHOR_TILES_ABILITY,
  INK_VEIL_ABILITY,
  MERGE_BISHOPS_ABILITY,
  MIDNIGHT_BISHOP_PHASE2_KIT_FIRST_ID,
  PAGES_OF_DOOM_ABILITY,
  PALE_ARCHIVIST_ID,
  PALE_ARCHIVIST_KIT_SUMMON_ARCHER_ID,
  PALE_ARCHIVIST_PHASE1_KIT_FIRST_ID,
  PALE_ARCHIVIST_PHASE2_KIT_FIRST_ID,
  SCROLL_SUMMON_ABILITY,
  SCROLL_SUMMON_AP,
  SCROLL_SUMMON_ATK,
  SCROLL_SUMMON_DEFAULT_COUNT,
  SCROLL_SUMMON_FULL_LOG_NEEDLE,
  SCROLL_SUMMON_HP,
  SCROLL_SUMMON_LOG_NEEDLE,
  SCROLL_SUMMON_PHASE1_COUNT,
  SCROLL_SUMMON_PHASE2_COUNT,
  isPaleArchivistScrollSummonTurn,
  leftoverScrollBlocksVictory,
  paleArchivistHostilesRemaining,
  resolvePaleArchivistOddTurnDecide,
  scrollHpAfterStrike,
  wxPaleArchivistKitBlocksScroll,
  wxPaleArchivistOddTurnDecide,
} from "./bossScrollSummonDecideCommit.ts";

const strike = starterSpells.find((s) => s.id === "physical_attack");
const kitMark = starterSpells.find((s) => s.id === "spell-mark");
const cursedWound = starterSpells.find((s) => s.id === "spell-cursed-wound");
const kitMirror = starterSpells.find((s) => s.id === "spell-mirror");
const summonArcher = starterSpells.find((s) => s.id === "summon-archer");
const kitSwap = starterSpells.find((s) => s.id === "spell-swap");

assert.ok(strike, "physical_attack");
assert.ok(kitMark, "spell-mark");
assert.ok(cursedWound, "spell-cursed-wound");
assert.ok(kitMirror, "spell-mirror");
assert.ok(summonArcher, "summon-archer");
assert.ok(kitSwap, "spell-swap");

const STRIKE_DAMAGE = Number(strike.damage);
const PALE_ARCHIVIST_HP = 350;

function phase2OddKit() {
  return {
    currentPhase: 2 as const,
    currentTurn: 3,
    kitSpellId: PALE_ARCHIVIST_PHASE2_KIT_FIRST_ID,
  };
}

function phase1OddKit() {
  return {
    currentPhase: 1 as const,
    currentTurn: 1,
    kitSpellId: PALE_ARCHIVIST_PHASE1_KIT_FIRST_ID,
  };
}

describe("wxPaleArchivistKitBlocksScroll (live leftover)", () => {
  it("phase-2 odd-turn first-id Mark is decided instead of SCROLL_SUMMON", () => {
    const opts = phase2OddKit();
    const live = wxPaleArchivistOddTurnDecide(opts);
    assert.equal(live.type, "spell");
    assert.equal(live.spellId, PALE_ARCHIVIST_PHASE2_KIT_FIRST_ID);
    assert.equal(live.ability, undefined);
    assert.equal(wxPaleArchivistKitBlocksScroll(opts), true);
    assert.equal(isPaleArchivistScrollSummonTurn(opts.currentTurn), true);
  });

  it("phase-1 odd-turn first-id Cursed Wound is decided instead of SCROLL_SUMMON", () => {
    const opts = phase1OddKit();
    const live = wxPaleArchivistOddTurnDecide(opts);
    assert.equal(live.type, "spell");
    assert.equal(live.spellId, PALE_ARCHIVIST_PHASE1_KIT_FIRST_ID);
    assert.equal(wxPaleArchivistKitBlocksScroll(opts), true);
  });

  it("empty kit still reaches Scroll — the leftover is first-id, not an empty pool", () => {
    const opts = {
      currentPhase: 2 as const,
      currentTurn: 3,
      kitSpellId: null,
    };
    const live = wxPaleArchivistOddTurnDecide(opts);
    assert.equal(live.type, "summon");
    assert.equal(live.ability, SCROLL_SUMMON_ABILITY);
    assert.equal(wxPaleArchivistKitBlocksScroll(opts), false);
  });

  it("even phase 2 still lets kit Mark win — PAGES_OF_DOOM leftover of #1089", () => {
    const opts = {
      currentPhase: 2 as const,
      currentTurn: 2,
      kitSpellId: PALE_ARCHIVIST_PHASE2_KIT_FIRST_ID,
    };
    const live = wxPaleArchivistOddTurnDecide(opts);
    const next = resolvePaleArchivistOddTurnDecide(opts);
    assert.equal(isPaleArchivistScrollSummonTurn(2), false);
    assert.equal(live.type, "spell");
    assert.equal(next.type, "spell");
    assert.equal(next.spellId, PALE_ARCHIVIST_PHASE2_KIT_FIRST_ID);
    assert.equal(wxPaleArchivistKitBlocksScroll(opts), false);
    assert.notEqual(next.ability, PAGES_OF_DOOM_ABILITY);
    assert.notEqual(next.ability, SCROLL_SUMMON_ABILITY);
  });

  it("even phase 1 still lets kit Cursed Wound win — INK_VEIL leftover", () => {
    const opts = {
      currentPhase: 1 as const,
      currentTurn: 2,
      kitSpellId: PALE_ARCHIVIST_PHASE1_KIT_FIRST_ID,
    };
    const live = wxPaleArchivistOddTurnDecide(opts);
    const next = resolvePaleArchivistOddTurnDecide(opts);
    assert.equal(live.type, "spell");
    assert.equal(next.type, "spell");
    assert.equal(next.spellId, PALE_ARCHIVIST_PHASE1_KIT_FIRST_ID);
    assert.equal(wxPaleArchivistKitBlocksScroll(opts), false);
    assert.notEqual(next.ability, INK_VEIL_ABILITY);
  });
});

describe("resolvePaleArchivistOddTurnDecide", () => {
  it("odd phase 2 prefers SCROLL_SUMMON over kit Mark", () => {
    const opts = phase2OddKit();
    const next = resolvePaleArchivistOddTurnDecide(opts);
    assert.equal(next.type, "summon");
    assert.equal(next.ability, SCROLL_SUMMON_ABILITY);
    assert.equal(next.spellId, undefined);
  });

  it("odd phase 1 prefers SCROLL_SUMMON over kit Cursed Wound", () => {
    const opts = phase1OddKit();
    const next = resolvePaleArchivistOddTurnDecide(opts);
    assert.equal(next.type, "summon");
    assert.equal(next.ability, SCROLL_SUMMON_ABILITY);
  });

  it("catalog phase-2 first id is Mark, not Mirror, Swap, or summon-archer", () => {
    const kits = readFileSync(
      join(dirname(fileURLToPath(import.meta.url)), "../data/bossKits.ts"),
      "utf8",
    );
    const archivist = kits.slice(
      kits.indexOf("pale_archivist: {"),
      kits.indexOf("twin_monarchs: {"),
    );
    assert.ok(archivist.includes(`"${PALE_ARCHIVIST_PHASE2_KIT_FIRST_ID}"`));
    assert.ok(
      archivist.includes(
        `phase1SpellIds: [\n      "${PALE_ARCHIVIST_PHASE1_KIT_FIRST_ID}"`,
      ),
    );
    const p2 = archivist.slice(archivist.indexOf("phase2SpellIds:"));
    assert.ok(
      p2.indexOf(`"${PALE_ARCHIVIST_PHASE2_KIT_FIRST_ID}"`) <
        p2.indexOf("spell-barrier"),
    );
    assert.ok(p2.includes(`"${PALE_ARCHIVIST_KIT_SUMMON_ARCHER_ID}"`));
    assert.ok(
      p2.indexOf(`"${PALE_ARCHIVIST_PHASE2_KIT_FIRST_ID}"`) <
        p2.indexOf(`"${PALE_ARCHIVIST_KIT_SUMMON_ARCHER_ID}"`),
      "summon-archer is fourth-id — #910 leftover, not this decide",
    );
    assert.equal(kitMark.isMark, true);
    assert.equal(Number(kitMark.damage), 0);
    assert.equal(cursedWound.id, PALE_ARCHIVIST_PHASE1_KIT_FIRST_ID);
    assert.equal(kitMirror.id, MIDNIGHT_BISHOP_PHASE2_KIT_FIRST_ID);
    assert.equal(kitSwap.id, "spell-swap");
    assert.equal(summonArcher.isSummon, true);
  });

  it("does not steal Midnight Bishop MERGE blocked by kit Mirror (#1058)", () => {
    const bishop = {
      currentPhase: 2 as const,
      currentTurn: 3,
      kitSpellId: MIDNIGHT_BISHOP_PHASE2_KIT_FIRST_ID,
    };
    const live = wxPaleArchivistOddTurnDecide(bishop);
    const next = resolvePaleArchivistOddTurnDecide(bishop);
    assert.equal(live.spellId, MIDNIGHT_BISHOP_PHASE2_KIT_FIRST_ID);
    assert.equal(next.ability, SCROLL_SUMMON_ABILITY);
    assert.notEqual(next.ability, MERGE_BISHOPS_ABILITY);
    assert.equal(kitMirror.isMirror, true);
  });

  it("does not steal Enthroned Void ANCHOR_TILES (#1094)", () => {
    const voidBoss = {
      currentPhase: 1 as const,
      currentTurn: 1,
      kitSpellId: "spell-swap",
    };
    const next = resolvePaleArchivistOddTurnDecide(voidBoss);
    assert.equal(next.ability, SCROLL_SUMMON_ABILITY);
    assert.notEqual(next.ability, ANCHOR_TILES_ABILITY);
  });

  it("non-finite turns fail-closed and do not mint a Scroll plant", () => {
    assert.equal(isPaleArchivistScrollSummonTurn(Number.NaN), false);
    assert.equal(
      isPaleArchivistScrollSummonTurn(Number.POSITIVE_INFINITY),
      false,
    );
    const next = resolvePaleArchivistOddTurnDecide({
      currentPhase: 2,
      currentTurn: Number.NaN,
      kitSpellId: PALE_ARCHIVIST_PHASE2_KIT_FIRST_ID,
    });
    assert.equal(next.type, "spell");
    assert.equal(next.spellId, PALE_ARCHIVIST_PHASE2_KIT_FIRST_ID);
  });
});

describe("player-visible leftover scroll blocks victory", () => {
  it("live kit Mark never spawns, so killing the boss awards victory immediately", () => {
    const live = wxPaleArchivistOddTurnDecide(phase2OddKit());
    assert.equal(live.type, "spell");
    assert.equal(STRIKE_DAMAGE, 10);
    assert.equal(Number(kitMark.damage), 0);
    assert.equal(paleArchivistHostilesRemaining({ bossHp: 0, scrollHp: 0 }), 0);
    assert.equal(
      shouldAwardVictory({
        inBattle: true,
        deathTriggered: false,
        battleStartIdsSize: 1,
        hostilesRemaining: 0,
      }),
      true,
      "no advertised scroll spawned — last hostile is the dead boss",
    );
    assert.equal(
      leftoverScrollBlocksVictory({
        inBattle: true,
        deathTriggered: false,
        battleStartIdsSize: 1,
        bossHp: 0,
        scrollHp: 0,
      }),
      false,
    );
  });

  it("advertised 30 HP scroll survives Strike 10 and blocks shouldAwardVictory", () => {
    const next = resolvePaleArchivistOddTurnDecide(phase2OddKit());
    assert.equal(next.ability, SCROLL_SUMMON_ABILITY);
    assert.equal(SCROLL_SUMMON_HP, 30);
    assert.equal(SCROLL_SUMMON_ATK, 8);
    assert.equal(SCROLL_SUMMON_AP, 3);
    const afterStrike = scrollHpAfterStrike({
      scrollHp: SCROLL_SUMMON_HP,
      strikeDamage: STRIKE_DAMAGE,
    });
    assert.equal(afterStrike, 20);
    assert.equal(
      paleArchivistHostilesRemaining({
        bossHp: 0,
        scrollHp: afterStrike,
      }),
      1,
    );
    assert.equal(
      leftoverScrollBlocksVictory({
        inBattle: true,
        deathTriggered: false,
        battleStartIdsSize: 2,
        bossHp: 0,
        scrollHp: afterStrike,
      }),
      true,
      "advertised Ancient Scroll still occupies the fight graph",
    );
    assert.equal(
      shouldAwardVictory({
        inBattle: true,
        deathTriggered: false,
        battleStartIdsSize: 2,
        hostilesRemaining: 1,
      }),
      false,
    );
    assert.equal(PALE_ARCHIVIST_HP, 350);
    assert.equal(
      leftoverScrollBlocksVictory({
        inBattle: true,
        deathTriggered: false,
        battleStartIdsSize: 2,
        bossHp: PALE_ARCHIVIST_HP,
        scrollHp: afterStrike,
      }),
      false,
      "boss still alive is not this leftover's unique victory price",
    );
  });

  it("kit Mark is 0-damage — Untouchable is not the unique price of this leftover", () => {
    assert.equal(Number(kitMark.damage), 0);
    assert.equal(strike.isPhysical, true);
    assert.equal(STRIKE_DAMAGE, 10);
  });
});

describe("production still decides kit first and never relocates spawn dests", () => {
  it("decidePaleArchivistAction still returns kit before PAGES_OF_DOOM before SCROLL_SUMMON", () => {
    const src = readFileSync(
      join(dirname(fileURLToPath(import.meta.url)), "../hooks/useBossAI.ts"),
      "utf8",
    );
    const start = src.indexOf("// ── 18. Pale Archivist");
    const end = src.indexOf("// ── 19. Twin Monarchs");
    assert.ok(start >= 0 && end > start, "Pale Archivist decide is present");
    const body = src.slice(start, end);
    const kitIdx = body.indexOf("pickBossKitSpell");
    const pagesIdx = body.indexOf("BossAbility.PAGES_OF_DOOM");
    const scrollIdx = body.indexOf("BossAbility.SCROLL_SUMMON");
    const inkIdx = body.indexOf("BossAbility.INK_VEIL");
    assert.ok(kitIdx >= 0, "kit pick is present");
    assert.ok(pagesIdx >= 0, "PAGES_OF_DOOM is present");
    assert.ok(scrollIdx >= 0, "SCROLL_SUMMON is present");
    assert.ok(kitIdx < pagesIdx, "kit still wins the even Pages turn");
    assert.ok(pagesIdx < scrollIdx, "odd-turn SCROLL_SUMMON still after Pages");
    assert.ok(scrollIdx < inkIdx, "INK_VEIL leftover still after Scroll");
    assert.ok(body.includes('type: "spell"'));
    assert.ok(body.includes("currentTurn % 2 === 1"));
    assert.ok(body.includes('type: "summon"'));
    assert.equal(body.includes("resolvePaleArchivistOddTurnDecide"), false);
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
    assert.ok(body.includes(SCROLL_SUMMON_FULL_LOG_NEEDLE));
    assert.ok(src.includes("extra.summonCount ?? 3"));
    assert.equal(SCROLL_SUMMON_DEFAULT_COUNT, 3);
    assert.equal(SCROLL_SUMMON_PHASE1_COUNT, 3);
    assert.equal(SCROLL_SUMMON_PHASE2_COUNT, 2);
  });

  it("WorldExploration still overwrites spawn HP and stamps enemyHpMap 20 — execute leftover", () => {
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
    assert.equal(wx.includes("resolvePaleArchivistOddTurnDecide"), false);
    assert.equal(wx.includes("wxPaleArchivistKitBlocksScroll"), false);
    assert.equal(wx.includes("SCROLL_SUMMON_HP"), false);
  });

  it("pale_archivist still advertises SCROLL_SUMMON in phase 1, not phase 2", () => {
    const src = readFileSync(
      join(dirname(fileURLToPath(import.meta.url)), "../types/bossDefaults.ts"),
      "utf8",
    );
    const archivist = src.slice(
      src.indexOf('id: "pale_archivist"'),
      src.indexOf('id: "twin_monarchs"'),
    );
    const p1 = archivist.slice(
      archivist.indexOf("phase1:"),
      archivist.indexOf("phase2:"),
    );
    const p2 = archivist.slice(archivist.indexOf("phase2:"));
    assert.ok(p1.includes("BossAbility.SCROLL_SUMMON"));
    assert.ok(p1.includes("BossAbility.INK_VEIL"));
    assert.ok(p1.includes("BossAbility.GLYPH_TRAP"));
    assert.equal(p2.includes("BossAbility.SCROLL_SUMMON"), false);
    assert.ok(p2.includes("BossAbility.PAGES_OF_DOOM"));
    assert.equal(PALE_ARCHIVIST_ID, "pale_archivist");
  });
});
