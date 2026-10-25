import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { starterSpells } from "../data/spellData.ts";
import {
  type ChallengePanelProgress,
  DEFAULT_CHALLENGES,
  isChallengeCompleted,
} from "../utils/challengeCompletion.ts";
import {
  INK_VEIL_ABILITY,
  MERGE_BISHOPS_ABILITY,
  MIDNIGHT_BISHOP_PHASE2_KIT_FIRST_ID,
  PAGES_OF_DOOM_ABILITY,
  PAGES_OF_DOOM_CADENCE,
  PAGES_OF_DOOM_LOG_NEEDLE,
  PAGES_OF_DOOM_MODIFIER,
  PALE_ARCHIVIST_ID,
  PALE_ARCHIVIST_PHASE1_KIT_FIRST_ID,
  PALE_ARCHIVIST_PHASE2_KIT_FIRST_ID,
  SCROLL_SUMMON_ABILITY,
  isPaleArchivistPagesOfDoomTurn,
  playerOutgoingAfterDmgMod,
  resolvePaleArchivistPhase2Decide,
  wxPaleArchivistKitBlocksPages,
  wxPaleArchivistPhase2Decide,
} from "./bossPagesOfDoomDecideCommit.ts";

const strike = starterSpells.find((s) => s.id === "physical_attack");
const kitMark = starterSpells.find((s) => s.id === "spell-mark");
const cursedWound = starterSpells.find((s) => s.id === "spell-cursed-wound");
const kitMirror = starterSpells.find((s) => s.id === "spell-mirror");
const frostBolt = starterSpells.find((s) => s.id === "starter-frost");

assert.ok(strike, "physical_attack");
assert.ok(kitMark, "spell-mark");
assert.ok(cursedWound, "spell-cursed-wound");
assert.ok(kitMirror, "spell-mirror");
assert.ok(frostBolt, "starter-frost");

const STRIKE_DAMAGE = Number(strike.damage);
const FROST_DAMAGE = Number(frostBolt.damage);

const UNTOUCHABLE = DEFAULT_CHALLENGES.find((c) => c.id === "legendary_1");
assert.ok(UNTOUCHABLE);

function challengeProgress(
  overrides: Partial<ChallengePanelProgress> = {},
): ChallengePanelProgress {
  return {
    turnCount: 3,
    totalDamage: 0,
    healUsed: false,
    directHit: true,
    maxApUsedInTurn: 4,
    directHitAttempts: 0,
    ...overrides,
  };
}

function phase2EvenKit() {
  return {
    currentPhase: 2 as const,
    currentTurn: 2,
    kitSpellId: PALE_ARCHIVIST_PHASE2_KIT_FIRST_ID,
  };
}

describe("wxPaleArchivistKitBlocksPages (live leftover)", () => {
  it("phase-2 even-turn first-id Mark is decided instead of PAGES_OF_DOOM", () => {
    const opts = phase2EvenKit();
    const live = wxPaleArchivistPhase2Decide(opts);
    assert.equal(live.type, "spell");
    assert.equal(live.spellId, PALE_ARCHIVIST_PHASE2_KIT_FIRST_ID);
    assert.equal(live.ability, undefined);
    assert.equal(wxPaleArchivistKitBlocksPages(opts), true);
    assert.equal(isPaleArchivistPagesOfDoomTurn(opts.currentTurn), true);
  });

  it("empty kit still reaches Pages — the leftover is first-id, not an empty pool", () => {
    const opts = {
      currentPhase: 2 as const,
      currentTurn: 2,
      kitSpellId: null,
    };
    const live = wxPaleArchivistPhase2Decide(opts);
    assert.equal(live.type, "ability");
    assert.equal(live.ability, PAGES_OF_DOOM_ABILITY);
    assert.equal(wxPaleArchivistKitBlocksPages(opts), false);
  });

  it("phase 1 Cursed Wound still blocks INK_VEIL — do not steal that class", () => {
    const opts = {
      currentPhase: 1 as const,
      currentTurn: 2,
      kitSpellId: PALE_ARCHIVIST_PHASE1_KIT_FIRST_ID,
    };
    const live = wxPaleArchivistPhase2Decide(opts);
    const next = resolvePaleArchivistPhase2Decide(opts);
    assert.equal(live.type, "spell");
    assert.equal(live.spellId, PALE_ARCHIVIST_PHASE1_KIT_FIRST_ID);
    assert.equal(next.type, "spell");
    assert.equal(next.spellId, PALE_ARCHIVIST_PHASE1_KIT_FIRST_ID);
    assert.equal(wxPaleArchivistKitBlocksPages(opts), false);
    assert.notEqual(next.ability, INK_VEIL_ABILITY);
  });
});

describe("resolvePaleArchivistPhase2Decide", () => {
  it("even phase 2 prefers PAGES_OF_DOOM over kit Mark", () => {
    const opts = phase2EvenKit();
    const next = resolvePaleArchivistPhase2Decide(opts);
    assert.equal(next.type, "ability");
    assert.equal(next.ability, PAGES_OF_DOOM_ABILITY);
    assert.equal(next.spellId, undefined);
  });

  it("odd phase 2 still lets kit Mark win — SCROLL_SUMMON leftover", () => {
    const opts = {
      currentPhase: 2 as const,
      currentTurn: 3,
      kitSpellId: PALE_ARCHIVIST_PHASE2_KIT_FIRST_ID,
    };
    const next = resolvePaleArchivistPhase2Decide(opts);
    assert.equal(isPaleArchivistPagesOfDoomTurn(3), false);
    assert.equal(next.type, "spell");
    assert.equal(next.spellId, PALE_ARCHIVIST_PHASE2_KIT_FIRST_ID);
    assert.equal(wxPaleArchivistKitBlocksPages(opts), false);
    assert.notEqual(next.ability, SCROLL_SUMMON_ABILITY);
  });

  it("catalog phase-2 first id is Mark, not Mirror or Cursed Wound", () => {
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
    assert.ok(p2.startsWith("phase2SpellIds:"));
    assert.equal(p2.includes(`"${PALE_ARCHIVIST_PHASE2_KIT_FIRST_ID}"`), true);
    assert.ok(
      p2.indexOf(`"${PALE_ARCHIVIST_PHASE2_KIT_FIRST_ID}"`) <
        p2.indexOf("spell-barrier"),
    );
    assert.equal(kitMark.isMark, true);
    assert.equal(Number(kitMark.damage), 0);
    assert.equal(cursedWound.id, PALE_ARCHIVIST_PHASE1_KIT_FIRST_ID);
    assert.equal(kitMirror.id, MIDNIGHT_BISHOP_PHASE2_KIT_FIRST_ID);
  });

  it("does not steal Midnight Bishop MERGE blocked by kit Mirror (#1058)", () => {
    const bishop = {
      currentPhase: 2 as const,
      currentTurn: 2,
      kitSpellId: MIDNIGHT_BISHOP_PHASE2_KIT_FIRST_ID,
    };
    const live = wxPaleArchivistPhase2Decide(bishop);
    const next = resolvePaleArchivistPhase2Decide(bishop);
    assert.equal(live.spellId, MIDNIGHT_BISHOP_PHASE2_KIT_FIRST_ID);
    assert.equal(next.ability, PAGES_OF_DOOM_ABILITY);
    assert.notEqual(next.ability, MERGE_BISHOPS_ABILITY);
    assert.equal(kitMirror.isMirror, true);
  });
});

describe("player-visible Strike tax never starts while kit Mark wins", () => {
  it("live kit Mark leaves advertised Strike 10; Pages cadence would be floor(10 * 0.8) = 8", () => {
    assert.equal(strike.isPhysical, true);
    assert.equal(STRIKE_DAMAGE, 10);
    assert.equal(frostBolt.isPhysical, undefined);
    assert.equal(FROST_DAMAGE, 20);
    assert.equal(PAGES_OF_DOOM_MODIFIER, 0.8);
    assert.equal(PAGES_OF_DOOM_CADENCE, 2);

    const live = wxPaleArchivistPhase2Decide(phase2EvenKit());
    assert.equal(live.type, "spell");
    assert.equal(
      playerOutgoingAfterDmgMod(STRIKE_DAMAGE, 1),
      10,
      "Pages never fired — computeDamage still queries unmodified dmg",
    );
    assert.equal(
      playerOutgoingAfterDmgMod(STRIKE_DAMAGE, PAGES_OF_DOOM_MODIFIER),
      8,
      "advertised -20% once Pages actually decides",
    );
    assert.equal(
      playerOutgoingAfterDmgMod(FROST_DAMAGE, 1),
      20,
      "Frost Bolt has no school metadata — unschooled stays 20",
    );
  });

  it("kit Mark is 0-damage — Untouchable is not the unique price of this leftover", () => {
    assert.equal(UNTOUCHABLE.rewards.doka, 500);
    assert.equal(Number(kitMark.damage), 0);
    assert.equal(
      isChallengeCompleted(UNTOUCHABLE, challengeProgress({ totalDamage: 0 })),
      true,
    );
    assert.equal(
      isChallengeCompleted(
        UNTOUCHABLE,
        challengeProgress({ totalDamage: STRIKE_DAMAGE }),
      ),
      false,
    );
  });
});

describe("production still decides kit first and never remaps spell_physical here", () => {
  it("decidePaleArchivistAction still returns kit before PAGES_OF_DOOM", () => {
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
    assert.ok(kitIdx >= 0, "kit pick is present");
    assert.ok(pagesIdx >= 0, "PAGES_OF_DOOM is present");
    assert.ok(kitIdx < pagesIdx, "kit still wins the even Pages turn");
    assert.ok(pagesIdx < scrollIdx, "odd-turn SCROLL_SUMMON stays after Pages");
    assert.ok(body.includes('type: "spell"'));
    assert.ok(body.includes("currentTurn % 2 === 0"));
  });

  it("applyPagesOfDoom still writes spell_${mostUsed} — #1065 leftover, not remapped here", () => {
    const src = readFileSync(
      join(
        dirname(fileURLToPath(import.meta.url)),
        "../hooks/useBossSystem.ts",
      ),
      "utf8",
    );
    const body = src.slice(
      src.indexOf("function applyPagesOfDoom"),
      src.indexOf("function applyDawnBuff"),
    );
    assert.ok(body.includes('let mostUsed = "physical"'));
    assert.ok(body.includes("stat: `spell_${mostUsed}`"));
    assert.ok(body.includes("modifier: 0.8"));
    assert.ok(body.includes(PAGES_OF_DOOM_LOG_NEEDLE));
    assert.equal(body.includes('stat: "dmg"'), false);
  });

  it("WorldExploration still copies d.stat without a Pages decide arm", () => {
    const wx = readFileSync(
      join(
        dirname(fileURLToPath(import.meta.url)),
        "../components/WorldExploration.tsx",
      ),
      "utf8",
    );
    const start = wx.indexOf("if (res?.debuffsApplied)");
    assert.ok(start >= 0, "live debuffsApplied copy is present");
    const body = wx.slice(start, start + 700);
    assert.ok(body.includes("stat: d.stat"));
    assert.equal(wx.includes("resolvePaleArchivistPhase2Decide"), false);
    assert.equal(wx.includes("wxPaleArchivistKitBlocksPages"), false);
  });

  it("pale_archivist still advertises PAGES_OF_DOOM in phase 2", () => {
    const src = readFileSync(
      join(dirname(fileURLToPath(import.meta.url)), "../types/bossDefaults.ts"),
      "utf8",
    );
    const archivist = src.slice(
      src.indexOf('id: "pale_archivist"'),
      src.indexOf('id: "twin_monarchs"'),
    );
    assert.ok(archivist.includes("BossAbility.PAGES_OF_DOOM"));
    assert.ok(archivist.includes("BossAbility.INK_VEIL"));
    assert.ok(archivist.includes("BossAbility.GLYPH_TRAP"));
    assert.equal(PALE_ARCHIVIST_ID, "pale_archivist");
  });
});
