import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { starterSpells } from "../data/spellData.ts";
import { shouldAwardVictory } from "./battleSetup.ts";
import {
  ANCHOR_TILES_ABILITY,
  AP_DRAIN_PASSIVE_ABILITY,
  DAMAGE_IMMUNE_ABILITY,
  ENTHRONED_VOID_ID,
  ENTHRONED_VOID_KIT_SUMMON_DIRE_WOLF_ID,
  ENTHRONED_VOID_PHASE1_KIT_FIRST_ID,
  ENTHRONED_VOID_PHASE2_KIT_FIRST_ID,
  GHOST_SUMMON_ABILITY,
  INK_VEIL_ABILITY,
  MERGE_BISHOPS_ABILITY,
  MIDNIGHT_BISHOP_PHASE2_KIT_FIRST_ID,
  PAGES_OF_DOOM_ABILITY,
  PALE_ARCHIVIST_PHASE1_KIT_FIRST_ID,
  PALE_ARCHIVIST_PHASE2_KIT_FIRST_ID,
  PHANTOM_SPAWN_ABILITY,
  PHANTOM_SPAWN_AP,
  PHANTOM_SPAWN_ATK,
  PHANTOM_SPAWN_HP,
  PHANTOM_SPAWN_LOG_NEEDLE,
  PHANTOM_SPAWN_PIECE,
  SCROLL_SUMMON_ABILITY,
  SPLIT_ROOKS_ABILITY,
  enthronedVoidHostilesRemaining,
  isEnthronedVoidPhantomSpawnTurn,
  leftoverPhantomBlocksVictory,
  phantomHpAfterStrike,
  resolveEnthronedVoidEvenTurnDecide,
  wxEnthronedVoidEvenTurnDecide,
  wxEnthronedVoidKitBlocksPhantom,
} from "./bossPhantomSpawnDecideCommit.ts";

const strike = starterSpells.find((s) => s.id === "physical_attack");
const kitSwap = starterSpells.find((s) => s.id === "spell-swap");
const kitMark = starterSpells.find((s) => s.id === "spell-mark");
const cursedWound = starterSpells.find((s) => s.id === "spell-cursed-wound");
const kitMirror = starterSpells.find((s) => s.id === "spell-mirror");
const summonWolf = starterSpells.find((s) => s.id === "summon-dire-wolf");

assert.ok(strike, "physical_attack");
assert.ok(kitSwap, "spell-swap");
assert.ok(kitMark, "spell-mark");
assert.ok(cursedWound, "spell-cursed-wound");
assert.ok(kitMirror, "spell-mirror");
assert.ok(summonWolf, "summon-dire-wolf");

const STRIKE_DAMAGE = Number(strike.damage);
const ENTHRONED_VOID_HP = 280;

function phase1EvenKit() {
  return {
    currentPhase: 1 as const,
    currentTurn: 2,
    kitSpellId: ENTHRONED_VOID_PHASE1_KIT_FIRST_ID,
  };
}

function phase1OddKit() {
  return {
    currentPhase: 1 as const,
    currentTurn: 1,
    kitSpellId: ENTHRONED_VOID_PHASE1_KIT_FIRST_ID,
  };
}

describe("wxEnthronedVoidKitBlocksPhantom (live leftover)", () => {
  it("phase-1 even-turn first-id Swap is decided instead of PHANTOM_SPAWN", () => {
    const opts = phase1EvenKit();
    const live = wxEnthronedVoidEvenTurnDecide(opts);
    assert.equal(live.type, "spell");
    assert.equal(live.spellId, ENTHRONED_VOID_PHASE1_KIT_FIRST_ID);
    assert.equal(live.ability, undefined);
    assert.equal(wxEnthronedVoidKitBlocksPhantom(opts), true);
    assert.equal(isEnthronedVoidPhantomSpawnTurn(opts.currentTurn), true);
  });

  it("empty kit still reaches Phantom — the leftover is first-id, not an empty pool", () => {
    const opts = {
      currentPhase: 1 as const,
      currentTurn: 2,
      kitSpellId: null,
    };
    const live = wxEnthronedVoidEvenTurnDecide(opts);
    assert.equal(live.type, "summon");
    assert.equal(live.ability, PHANTOM_SPAWN_ABILITY);
    assert.equal(wxEnthronedVoidKitBlocksPhantom(opts), false);
  });

  it("odd phase 1 still lets kit Swap win — ANCHOR_TILES leftover of #1094", () => {
    const opts = phase1OddKit();
    const live = wxEnthronedVoidEvenTurnDecide(opts);
    const next = resolveEnthronedVoidEvenTurnDecide(opts);
    assert.equal(isEnthronedVoidPhantomSpawnTurn(1), false);
    assert.equal(live.type, "spell");
    assert.equal(next.type, "spell");
    assert.equal(next.spellId, ENTHRONED_VOID_PHASE1_KIT_FIRST_ID);
    assert.equal(wxEnthronedVoidKitBlocksPhantom(opts), false);
    assert.notEqual(next.ability, ANCHOR_TILES_ABILITY);
    assert.notEqual(next.ability, PHANTOM_SPAWN_ABILITY);
  });

  it("even phase 2 still lets kit Swap win — AP_DRAIN leftover", () => {
    const opts = {
      currentPhase: 2 as const,
      currentTurn: 2,
      kitSpellId: ENTHRONED_VOID_PHASE2_KIT_FIRST_ID,
    };
    const live = wxEnthronedVoidEvenTurnDecide(opts);
    const next = resolveEnthronedVoidEvenTurnDecide(opts);
    assert.equal(isEnthronedVoidPhantomSpawnTurn(2), true);
    assert.equal(live.type, "spell");
    assert.equal(next.type, "spell");
    assert.equal(next.spellId, ENTHRONED_VOID_PHASE2_KIT_FIRST_ID);
    assert.equal(wxEnthronedVoidKitBlocksPhantom(opts), false);
    assert.notEqual(next.ability, AP_DRAIN_PASSIVE_ABILITY);
    assert.notEqual(next.ability, PHANTOM_SPAWN_ABILITY);
  });
});

describe("resolveEnthronedVoidEvenTurnDecide", () => {
  it("even phase 1 prefers PHANTOM_SPAWN over kit Swap", () => {
    const opts = phase1EvenKit();
    const next = resolveEnthronedVoidEvenTurnDecide(opts);
    assert.equal(next.type, "summon");
    assert.equal(next.ability, PHANTOM_SPAWN_ABILITY);
    assert.equal(next.spellId, undefined);
  });

  it("catalog phase-1 first id is Swap, not Slow, Dire Wolf, Mark, or Mirror", () => {
    const kits = readFileSync(
      join(dirname(fileURLToPath(import.meta.url)), "../data/bossKits.ts"),
      "utf8",
    );
    const voidKit = kits.slice(
      kits.indexOf("enthroned_void: {"),
      kits.indexOf("// ── Runtime validation"),
    );
    assert.ok(voidKit.includes(`"${ENTHRONED_VOID_PHASE1_KIT_FIRST_ID}"`));
    const p1 = voidKit.slice(voidKit.indexOf("phase1SpellIds:"));
    assert.ok(
      p1.indexOf(`"${ENTHRONED_VOID_PHASE1_KIT_FIRST_ID}"`) <
        p1.indexOf("spell-slow"),
    );
    assert.ok(p1.includes(`"${ENTHRONED_VOID_KIT_SUMMON_DIRE_WOLF_ID}"`));
    assert.ok(
      p1.indexOf(`"${ENTHRONED_VOID_PHASE1_KIT_FIRST_ID}"`) <
        p1.indexOf(`"${ENTHRONED_VOID_KIT_SUMMON_DIRE_WOLF_ID}"`),
      "summon-dire-wolf is third-id — #910 leftover, not this decide",
    );
    assert.equal(kitSwap.isSwap, true);
    assert.equal(Number(kitSwap.damage), 0);
    assert.equal(kitSwap.id, ENTHRONED_VOID_PHASE1_KIT_FIRST_ID);
    assert.equal(kitMark.id, PALE_ARCHIVIST_PHASE2_KIT_FIRST_ID);
    assert.equal(cursedWound.id, PALE_ARCHIVIST_PHASE1_KIT_FIRST_ID);
    assert.equal(kitMirror.id, MIDNIGHT_BISHOP_PHASE2_KIT_FIRST_ID);
    assert.equal(summonWolf.isSummon, true);
  });

  it("does not steal Pale Archivist even Pages / odd Scroll / even Ink", () => {
    const evenKit = phase1EvenKit();
    const next = resolveEnthronedVoidEvenTurnDecide(evenKit);
    assert.equal(next.ability, PHANTOM_SPAWN_ABILITY);
    assert.notEqual(next.ability, PAGES_OF_DOOM_ABILITY);
    assert.notEqual(next.ability, SCROLL_SUMMON_ABILITY);
    assert.notEqual(next.ability, INK_VEIL_ABILITY);
    const oddArchivist = resolveEnthronedVoidEvenTurnDecide({
      currentPhase: 1,
      currentTurn: 3,
      kitSpellId: PALE_ARCHIVIST_PHASE2_KIT_FIRST_ID,
    });
    assert.equal(oddArchivist.type, "spell");
    assert.equal(oddArchivist.spellId, PALE_ARCHIVIST_PHASE2_KIT_FIRST_ID);
    assert.notEqual(oddArchivist.ability, SCROLL_SUMMON_ABILITY);
  });

  it("does not steal Midnight Bishop MERGE blocked by kit Mirror (#1058)", () => {
    const bishop = {
      currentPhase: 1 as const,
      currentTurn: 2,
      kitSpellId: MIDNIGHT_BISHOP_PHASE2_KIT_FIRST_ID,
    };
    const live = wxEnthronedVoidEvenTurnDecide(bishop);
    const next = resolveEnthronedVoidEvenTurnDecide(bishop);
    assert.equal(live.spellId, MIDNIGHT_BISHOP_PHASE2_KIT_FIRST_ID);
    assert.equal(next.ability, PHANTOM_SPAWN_ABILITY);
    assert.notEqual(next.ability, MERGE_BISHOPS_ABILITY);
    assert.equal(kitMirror.isMirror, true);
  });

  it("does not steal odd-turn ANCHOR_TILES or DAMAGE_IMMUNE (#1094)", () => {
    const next = resolveEnthronedVoidEvenTurnDecide(phase1OddKit());
    assert.equal(next.type, "spell");
    assert.equal(next.spellId, ENTHRONED_VOID_PHASE1_KIT_FIRST_ID);
    assert.notEqual(next.ability, ANCHOR_TILES_ABILITY);
    assert.notEqual(next.ability, DAMAGE_IMMUNE_ABILITY);
  });

  it("non-finite turns fail-closed and do not mint a Phantom plant", () => {
    assert.equal(isEnthronedVoidPhantomSpawnTurn(Number.NaN), false);
    assert.equal(
      isEnthronedVoidPhantomSpawnTurn(Number.POSITIVE_INFINITY),
      false,
    );
    const next = resolveEnthronedVoidEvenTurnDecide({
      currentPhase: 1,
      currentTurn: Number.NaN,
      kitSpellId: ENTHRONED_VOID_PHASE1_KIT_FIRST_ID,
    });
    assert.equal(next.type, "spell");
    assert.equal(next.spellId, ENTHRONED_VOID_PHASE1_KIT_FIRST_ID);
  });
});

describe("player-visible leftover phantom blocks victory", () => {
  it("live kit Swap never spawns, so killing the boss awards victory immediately", () => {
    const live = wxEnthronedVoidEvenTurnDecide(phase1EvenKit());
    assert.equal(live.type, "spell");
    assert.equal(STRIKE_DAMAGE, 10);
    assert.equal(Number(kitSwap.damage), 0);
    assert.equal(
      enthronedVoidHostilesRemaining({ bossHp: 0, phantomHp: 0 }),
      0,
    );
    assert.equal(
      shouldAwardVictory({
        inBattle: true,
        deathTriggered: false,
        battleStartIdsSize: 1,
        hostilesRemaining: 0,
      }),
      true,
      "no advertised phantom spawned — last hostile is the dead boss",
    );
    assert.equal(
      leftoverPhantomBlocksVictory({
        inBattle: true,
        deathTriggered: false,
        battleStartIdsSize: 1,
        bossHp: 0,
        phantomHp: 0,
      }),
      false,
    );
  });

  it("advertised 1 HP phantom occupies the fight graph and blocks shouldAwardVictory", () => {
    const next = resolveEnthronedVoidEvenTurnDecide(phase1EvenKit());
    assert.equal(next.ability, PHANTOM_SPAWN_ABILITY);
    assert.equal(PHANTOM_SPAWN_HP, 1);
    assert.equal(PHANTOM_SPAWN_ATK, 5);
    assert.equal(PHANTOM_SPAWN_AP, 2);
    assert.equal(
      leftoverPhantomBlocksVictory({
        inBattle: true,
        deathTriggered: false,
        battleStartIdsSize: 2,
        bossHp: 0,
        phantomHp: PHANTOM_SPAWN_HP,
      }),
      true,
      "advertised 1 HP phantom still occupies the fight graph",
    );
    assert.equal(
      shouldAwardVictory({
        inBattle: true,
        deathTriggered: false,
        battleStartIdsSize: 2,
        hostilesRemaining: enthronedVoidHostilesRemaining({
          bossHp: 0,
          phantomHp: PHANTOM_SPAWN_HP,
        }),
      }),
      false,
    );
    const afterStrike = phantomHpAfterStrike({
      phantomHp: PHANTOM_SPAWN_HP,
      strikeDamage: STRIKE_DAMAGE,
    });
    assert.equal(afterStrike, 0);
    assert.equal(
      leftoverPhantomBlocksVictory({
        inBattle: true,
        deathTriggered: false,
        battleStartIdsSize: 2,
        bossHp: 0,
        phantomHp: afterStrike,
      }),
      false,
      "advertised 1 dies to one Strike — stamp 20 leftover is #1152",
    );
    assert.equal(ENTHRONED_VOID_HP, 280);
    assert.equal(
      leftoverPhantomBlocksVictory({
        inBattle: true,
        deathTriggered: false,
        battleStartIdsSize: 2,
        bossHp: ENTHRONED_VOID_HP,
        phantomHp: PHANTOM_SPAWN_HP,
      }),
      false,
      "boss still alive is not this leftover's unique victory price",
    );
  });

  it("kit Swap is 0-damage — Untouchable is not the unique price of this leftover", () => {
    assert.equal(Number(kitSwap.damage), 0);
    assert.equal(kitSwap.isSwap, true);
    assert.equal(strike.isPhysical, true);
    assert.equal(STRIKE_DAMAGE, 10);
  });
});

describe("production still decides kit first and never relocates spawn dests", () => {
  it("decideEnthronedVoidAction still returns kit before Phantom before Anchor", () => {
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
    const anchorIdx = body.indexOf("BossAbility.ANCHOR_TILES");
    assert.ok(kitIdx >= 0, "kit pick is present");
    assert.ok(phantomIdx >= 0, "PHANTOM_SPAWN is present");
    assert.ok(anchorIdx >= 0, "ANCHOR_TILES is present");
    assert.ok(kitIdx < phantomIdx, "kit still wins the even Phantom turn");
    assert.ok(
      phantomIdx < anchorIdx,
      "odd-turn ANCHOR_TILES leftover still after Phantom",
    );
    assert.ok(body.includes('type: "spell"'));
    assert.ok(body.includes("currentTurn % 2 === 0"));
    assert.ok(body.includes('type: "summon"'));
    assert.equal(body.includes("resolveEnthronedVoidEvenTurnDecide"), false);
    assert.equal(body.includes("wxEnthronedVoidKitBlocksPhantom"), false);
    assert.equal(body.includes("resolveEnthronedVoidPhase1Decide"), false);
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
    assert.ok(body.includes(`pieceType: "${PHANTOM_SPAWN_PIECE}"`));
    assert.ok(body.includes("isBossMinion: true"));
    assert.ok(body.includes("getAdjacentTiles"));
    assert.ok(body.includes(PHANTOM_SPAWN_LOG_NEEDLE));
    assert.equal(body.includes("resolveEnthronedVoidEvenTurnDecide"), false);
    assert.equal(body.includes("resolvePhantomSpawnCommittedHp"), false);
    const ghost = src.slice(
      src.indexOf("function applyGhostSummon"),
      src.indexOf("// ── New ability handlers for bosses 13–20"),
    );
    assert.ok(ghost.includes("hp: 1"));
    assert.ok(ghost.includes('pieceType: "king"'));
    assert.notEqual(GHOST_SUMMON_ABILITY, PHANTOM_SPAWN_ABILITY);
    const split = src.slice(
      src.indexOf("function applySplitRooks"),
      src.indexOf("function applyAdvancePerTurn"),
    );
    assert.ok(split.includes("Math.ceil(params.bossEntry.hp / 2)"));
    assert.notEqual(SPLIT_ROOKS_ABILITY, PHANTOM_SPAWN_ABILITY);
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
    assert.equal(wx.includes("resolveEnthronedVoidEvenTurnDecide"), false);
    assert.equal(wx.includes("wxEnthronedVoidKitBlocksPhantom"), false);
    assert.equal(wx.includes("resolvePhantomSpawnCommittedHp"), false);
  });

  it("enthroned_void still advertises PHANTOM_SPAWN in phase 1, not phase 2", () => {
    const src = readFileSync(
      join(dirname(fileURLToPath(import.meta.url)), "../types/bossDefaults.ts"),
      "utf8",
    );
    const voidBoss = src.slice(src.indexOf('id: "enthroned_void"'));
    const p1 = voidBoss.slice(
      voidBoss.indexOf("phase1:"),
      voidBoss.indexOf("phase2:"),
    );
    const p2 = voidBoss.slice(voidBoss.indexOf("phase2:"));
    assert.ok(p1.includes("BossAbility.PHANTOM_SPAWN"));
    assert.ok(p1.includes("BossAbility.ANCHOR_TILES"));
    assert.ok(p1.includes("BossAbility.DAMAGE_IMMUNE"));
    assert.equal(p2.includes("BossAbility.PHANTOM_SPAWN"), false);
    assert.ok(p2.includes("BossAbility.AP_DRAIN_PASSIVE"));
    assert.equal(ENTHRONED_VOID_ID, "enthroned_void");
  });
});
