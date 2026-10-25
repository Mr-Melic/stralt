import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { starterSpells } from "../data/spellData.ts";
import {
  ANCHOR_TILES_ABILITY,
  ANCHOR_TILES_PLANT_COUNT,
  GLYPH_TRAP_ABILITY,
  GLYPH_TRAP_DAMAGE,
  GLYPH_TRAP_LOG_NEEDLE,
  INK_VEIL_ABILITY,
  INK_VEIL_EVEN_MOD,
  INK_VEIL_GLYPH_MAX,
  INK_VEIL_GLYPH_MIN,
  INK_VEIL_GUIDE_NEEDLE,
  INK_VEIL_LOG_NEEDLE,
  INK_VEIL_TURNS_LEFT,
  MERGE_BISHOPS_ABILITY,
  MIDNIGHT_BISHOP_PHASE2_KIT_FIRST_ID,
  PAGES_OF_DOOM_ABILITY,
  PALE_ARCHIVIST_ID,
  PALE_ARCHIVIST_KIT_SUMMON_ARCHER_ID,
  PALE_ARCHIVIST_PHASE1_KIT_FIRST_ID,
  PALE_ARCHIVIST_PHASE2_KIT_FIRST_ID,
  SCROLL_SUMMON_ABILITY,
  inkVeilGlyphCountInRange,
  isPaleArchivistEvenTurn,
  isPaleArchivistInkVeilTurn,
  playerHpAfterGlyphTrap,
  resolvePaleArchivistPhase1EvenDecide,
  wxPaleArchivistKitBlocksInk,
  wxPaleArchivistPhase1EvenDecide,
} from "./bossInkVeilDecideCommit.ts";

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
const CURSED_WOUND_DAMAGE = Number(cursedWound.damage);
const PLAYER_HP = 100;

function phase1EvenKit() {
  return {
    currentPhase: 1 as const,
    currentTurn: 2,
    kitSpellId: PALE_ARCHIVIST_PHASE1_KIT_FIRST_ID,
  };
}

function phase2EvenKit() {
  return {
    currentPhase: 2 as const,
    currentTurn: 2,
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

describe("wxPaleArchivistKitBlocksInk (live leftover)", () => {
  it("phase-1 even-turn first-id Cursed Wound is decided instead of INK_VEIL", () => {
    const opts = phase1EvenKit();
    const live = wxPaleArchivistPhase1EvenDecide(opts);
    assert.equal(live.type, "spell");
    assert.equal(live.spellId, PALE_ARCHIVIST_PHASE1_KIT_FIRST_ID);
    assert.equal(live.ability, undefined);
    assert.equal(wxPaleArchivistKitBlocksInk(opts), true);
    assert.equal(
      isPaleArchivistInkVeilTurn(opts.currentPhase, opts.currentTurn),
      true,
    );
    assert.equal(isPaleArchivistEvenTurn(opts.currentTurn), true);
  });

  it("empty kit still reaches Ink — the leftover is first-id, not an empty pool", () => {
    const opts = {
      currentPhase: 1 as const,
      currentTurn: 2,
      kitSpellId: null,
    };
    const live = wxPaleArchivistPhase1EvenDecide(opts);
    assert.equal(live.type, "ability");
    assert.equal(live.ability, INK_VEIL_ABILITY);
    assert.equal(wxPaleArchivistKitBlocksInk(opts), false);
  });

  it("even phase 2 still lets kit Mark win — PAGES_OF_DOOM leftover of #1089", () => {
    const opts = phase2EvenKit();
    const live = wxPaleArchivistPhase1EvenDecide(opts);
    const next = resolvePaleArchivistPhase1EvenDecide(opts);
    assert.equal(isPaleArchivistInkVeilTurn(2, 2), false);
    assert.equal(live.type, "spell");
    assert.equal(next.type, "spell");
    assert.equal(next.spellId, PALE_ARCHIVIST_PHASE2_KIT_FIRST_ID);
    assert.equal(wxPaleArchivistKitBlocksInk(opts), false);
    assert.notEqual(next.ability, PAGES_OF_DOOM_ABILITY);
    assert.notEqual(next.ability, INK_VEIL_ABILITY);
  });

  it("odd phase 1 still lets kit Cursed Wound win — SCROLL_SUMMON leftover of #1102", () => {
    const opts = phase1OddKit();
    const live = wxPaleArchivistPhase1EvenDecide(opts);
    const next = resolvePaleArchivistPhase1EvenDecide(opts);
    assert.equal(isPaleArchivistInkVeilTurn(1, 1), false);
    assert.equal(live.type, "spell");
    assert.equal(next.type, "spell");
    assert.equal(next.spellId, PALE_ARCHIVIST_PHASE1_KIT_FIRST_ID);
    assert.equal(wxPaleArchivistKitBlocksInk(opts), false);
    assert.notEqual(next.ability, SCROLL_SUMMON_ABILITY);
    assert.notEqual(next.ability, INK_VEIL_ABILITY);
  });
});

describe("resolvePaleArchivistPhase1EvenDecide", () => {
  it("phase-1 even prefers INK_VEIL over kit Cursed Wound", () => {
    const opts = phase1EvenKit();
    const next = resolvePaleArchivistPhase1EvenDecide(opts);
    assert.equal(next.type, "ability");
    assert.equal(next.ability, INK_VEIL_ABILITY);
    assert.equal(next.spellId, undefined);
  });

  it("catalog phase-1 first id is Cursed Wound, not Mark, Mirror, Swap, or summon-archer", () => {
    const kits = readFileSync(
      join(dirname(fileURLToPath(import.meta.url)), "../data/bossKits.ts"),
      "utf8",
    );
    const archivist = kits.slice(
      kits.indexOf("pale_archivist: {"),
      kits.indexOf("twin_monarchs: {"),
    );
    assert.ok(archivist.includes(`"${PALE_ARCHIVIST_PHASE1_KIT_FIRST_ID}"`));
    assert.ok(
      archivist.includes(
        `phase1SpellIds: [\n      "${PALE_ARCHIVIST_PHASE1_KIT_FIRST_ID}"`,
      ),
    );
    const p1 = archivist.slice(
      archivist.indexOf("phase1SpellIds:"),
      archivist.indexOf("phase2SpellIds:"),
    );
    assert.ok(
      p1.indexOf(`"${PALE_ARCHIVIST_PHASE1_KIT_FIRST_ID}"`) <
        p1.indexOf("spell-mark"),
    );
    assert.ok(p1.includes(`"${PALE_ARCHIVIST_KIT_SUMMON_ARCHER_ID}"`));
    assert.equal(cursedWound.id, PALE_ARCHIVIST_PHASE1_KIT_FIRST_ID);
    assert.equal(Number(cursedWound.damage), 22);
    assert.equal(cursedWound.debuffStat, "healRecv");
    assert.equal(kitMark.isMark, true);
    assert.equal(Number(kitMark.damage), 0);
    assert.equal(kitMirror.id, MIDNIGHT_BISHOP_PHASE2_KIT_FIRST_ID);
    assert.equal(kitSwap.id, "spell-swap");
    assert.equal(summonArcher.isSummon, true);
  });

  it("does not steal Midnight Bishop MERGE blocked by kit Mirror (#1058)", () => {
    const bishop = {
      currentPhase: 1 as const,
      currentTurn: 2,
      kitSpellId: MIDNIGHT_BISHOP_PHASE2_KIT_FIRST_ID,
    };
    const live = wxPaleArchivistPhase1EvenDecide(bishop);
    const next = resolvePaleArchivistPhase1EvenDecide(bishop);
    assert.equal(live.spellId, MIDNIGHT_BISHOP_PHASE2_KIT_FIRST_ID);
    assert.equal(next.ability, INK_VEIL_ABILITY);
    assert.notEqual(next.ability, MERGE_BISHOPS_ABILITY);
    assert.equal(kitMirror.isMirror, true);
  });

  it("does not steal Enthroned Void ANCHOR_TILES (#1094)", () => {
    const voidBoss = {
      currentPhase: 1 as const,
      currentTurn: 2,
      kitSpellId: "spell-swap",
    };
    const next = resolvePaleArchivistPhase1EvenDecide(voidBoss);
    assert.equal(next.ability, INK_VEIL_ABILITY);
    assert.notEqual(next.ability, ANCHOR_TILES_ABILITY);
    assert.equal(inkVeilGlyphCountInRange(ANCHOR_TILES_PLANT_COUNT), false);
    assert.equal(inkVeilGlyphCountInRange(INK_VEIL_GLYPH_MIN), true);
    assert.equal(inkVeilGlyphCountInRange(INK_VEIL_GLYPH_MAX), true);
  });

  it("non-finite turns fail-closed and do not mint an Ink plant", () => {
    assert.equal(isPaleArchivistEvenTurn(Number.NaN), false);
    assert.equal(isPaleArchivistEvenTurn(Number.POSITIVE_INFINITY), false);
    assert.equal(isPaleArchivistInkVeilTurn(1, Number.NaN), false);
    const next = resolvePaleArchivistPhase1EvenDecide({
      currentPhase: 1,
      currentTurn: Number.NaN,
      kitSpellId: PALE_ARCHIVIST_PHASE1_KIT_FIRST_ID,
    });
    assert.equal(next.type, "spell");
    assert.equal(next.spellId, PALE_ARCHIVIST_PHASE1_KIT_FIRST_ID);
  });
});

describe("player-visible leftover glyphs never plant", () => {
  it("live kit Cursed Wound never plants 3–4 glyphed tiles", () => {
    const live = wxPaleArchivistPhase1EvenDecide(phase1EvenKit());
    assert.equal(live.type, "spell");
    assert.equal(CURSED_WOUND_DAMAGE, 22);
    assert.equal(STRIKE_DAMAGE, 10);
    assert.equal(inkVeilGlyphCountInRange(0), false);
    assert.equal(
      playerHpAfterGlyphTrap({ currentHp: PLAYER_HP, trapArmed: false }),
      PLAYER_HP,
      "no advertised glyphs planted — Glyph Trap never matches",
    );
  });

  it("advertised Ink plant would arm 3–4 glyphs; trap 15 is a later leftover", () => {
    const next = resolvePaleArchivistPhase1EvenDecide(phase1EvenKit());
    assert.equal(next.ability, INK_VEIL_ABILITY);
    assert.equal(INK_VEIL_GLYPH_MIN, 3);
    assert.equal(INK_VEIL_GLYPH_MAX, 4);
    assert.equal(INK_VEIL_TURNS_LEFT, 2);
    assert.equal(INK_VEIL_EVEN_MOD, 2);
    assert.equal(
      playerHpAfterGlyphTrap({ currentHp: PLAYER_HP, trapArmed: true }),
      85,
    );
    assert.equal(GLYPH_TRAP_DAMAGE, 15);
    assert.notEqual(next.ability, GLYPH_TRAP_ABILITY);
    assert.equal(GLYPH_TRAP_ABILITY, "GLYPH_TRAP");
  });

  it("kit Cursed Wound is 22-damage — Untouchable is not the unique price of this leftover", () => {
    assert.equal(Number(cursedWound.damage), 22);
    assert.equal(strike.isPhysical, true);
    assert.equal(STRIKE_DAMAGE, 10);
    assert.equal(Number(kitMark.damage), 0);
  });
});

describe("production still decides kit first and never relocates glyph dests", () => {
  it("decidePaleArchivistAction still returns kit before Pages before Scroll before Ink", () => {
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
    assert.ok(inkIdx >= 0, "INK_VEIL is present");
    assert.ok(kitIdx < pagesIdx, "kit still wins the even Pages turn");
    assert.ok(pagesIdx < scrollIdx, "odd-turn SCROLL_SUMMON still after Pages");
    assert.ok(scrollIdx < inkIdx, "INK_VEIL leftover still after Scroll");
    assert.ok(body.includes('type: "spell"'));
    assert.ok(body.includes("currentTurn % 2 === 0"));
    assert.ok(body.includes("currentTurn % 2 === 1"));
    assert.ok(body.includes("inkResult.newBossState"));
    assert.equal(body.includes("resolvePaleArchivistPhase1EvenDecide"), false);
    assert.equal(body.includes("BossAbility.GLYPH_TRAP"), false);
  });

  it("applyInkVeil still writes advertised 3–4 glyphs with turnsLeft 2", () => {
    const src = readFileSync(
      join(
        dirname(fileURLToPath(import.meta.url)),
        "../hooks/useBossSystem.ts",
      ),
      "utf8",
    );
    const body = src.slice(
      src.indexOf("function applyInkVeil"),
      src.indexOf("function applyScrollSummon"),
    );
    assert.ok(body.includes("3 + Math.floor(Math.random() * 2)"));
    assert.ok(body.includes("turnsLeft: 2"));
    assert.ok(body.includes("glyphedTiles"));
    assert.ok(body.includes(INK_VEIL_LOG_NEEDLE));
    assert.equal(body.includes("resolvePaleArchivistPhase1EvenDecide"), false);
    const trap = src.slice(
      src.indexOf("function applyGlyphTrap"),
      src.indexOf("function applyPagesOfDoom"),
    );
    assert.ok(trap.includes("damageToPlayer: 15"));
    assert.ok(trap.includes(GLYPH_TRAP_LOG_NEEDLE));
    const anchor = src.slice(
      src.indexOf("function applyAnchorTiles"),
      src.indexOf("function applyPhantomSpawn"),
    );
    assert.ok(anchor.includes("The Enthroned Void spawns"));
    assert.ok(anchor.includes(".slice(0, 2)"));
    assert.equal(src.includes("extra.summonCount ?? 3"), true);
  });

  it("WorldExploration still copies abilityResult newBossState without an Ink decide arm", () => {
    const wx = readFileSync(
      join(
        dirname(fileURLToPath(import.meta.url)),
        "../components/WorldExploration.tsx",
      ),
      "utf8",
    );
    const start = wx.indexOf("if (res?.newBossState)");
    assert.ok(start >= 0, "live newBossState merge is present");
    const body = wx.slice(start, start + 400);
    assert.ok(body.includes("setActiveBossState(merged)"));
    assert.equal(wx.includes("resolvePaleArchivistPhase1EvenDecide"), false);
    assert.equal(wx.includes("wxPaleArchivistKitBlocksInk"), false);
    assert.equal(wx.includes("INK_VEIL_GLYPH_MIN"), false);
  });

  it("pale_archivist still advertises INK_VEIL in both phases; Scroll stays phase 1", () => {
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
    assert.ok(p1.includes("BossAbility.INK_VEIL"));
    assert.ok(p1.includes("BossAbility.SCROLL_SUMMON"));
    assert.ok(p1.includes("BossAbility.GLYPH_TRAP"));
    assert.ok(p2.includes("BossAbility.INK_VEIL"));
    assert.ok(p2.includes("BossAbility.PAGES_OF_DOOM"));
    assert.equal(p2.includes("BossAbility.SCROLL_SUMMON"), false);
    assert.equal(PALE_ARCHIVIST_ID, "pale_archivist");
  });

  it("Boss Guide still advertises ink vision, not a Pages or Scroll twin", () => {
    const src = readFileSync(
      join(
        dirname(fileURLToPath(import.meta.url)),
        "../components/BossGuideModal.tsx",
      ),
      "utf8",
    );
    const start = src.indexOf(INK_VEIL_GUIDE_NEEDLE);
    assert.ok(start >= 0, "INK_VEIL guide copy is present");
    const lineEnd = src.indexOf("\n", start);
    const body = src.slice(start, lineEnd >= 0 ? lineEnd : start + 80);
    assert.ok(body.includes(INK_VEIL_GUIDE_NEEDLE));
    assert.equal(body.includes("PAGES_OF_DOOM"), false);
    assert.equal(body.includes("SCROLL_SUMMON"), false);
  });
});
