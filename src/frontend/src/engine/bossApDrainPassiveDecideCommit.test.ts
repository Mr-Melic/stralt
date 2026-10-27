import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { starterSpells } from "../data/spellData.ts";
import { startingChampionStats } from "../utils/startingChampionStats.ts";
import {
  ANCHOR_TILES_ABILITY,
  AP_DRAIN_ABILITY,
  AP_DRAIN_PASSIVE_ABILITY,
  AP_DRAIN_PASSIVE_GUIDE_NEEDLE,
  AP_DRAIN_PASSIVE_LOG_NEEDLE,
  AP_DRAIN_PASSIVE_TIER1_AMOUNT,
  AP_DRAIN_PASSIVE_TIER1_SPEND,
  AP_DRAIN_PASSIVE_TIER2_AMOUNT,
  AP_DRAIN_PASSIVE_TIER2_SPEND,
  AP_DRAIN_PASSIVE_WATCH_NEEDLE,
  BOARD_CLAIM_ABILITY,
  BOARD_CLAIM_IN_ZONE_DRAIN,
  DAMAGE_IMMUNE_ABILITY,
  DAWN_BUFF_ABILITY,
  DAWN_BUFF_AP_BLESS,
  ENTHRONED_VOID_ID,
  ENTHRONED_VOID_PHASE1_KIT_FIRST_ID,
  ENTHRONED_VOID_PHASE2_KIT_FIRST_ID,
  ETERNAL_PAWN_AP_DRAIN_AMOUNT,
  ETERNAL_PAWN_PHASE2_KIT_FIRST_ID,
  PHANTOM_SPAWN_ABILITY,
  advertisedApDrainAmount,
  isEnthronedVoidApDrainTurn,
  liveWxCommitsApDrainPassive,
  playerApAfterDecide,
  playerApAfterDrain,
  resolveEnthronedVoidPhase2Decide,
  strikeCountAffordable,
  wxAppliesPlayerApModifier,
  wxEnthronedVoidKitBlocksApDrain,
  wxEnthronedVoidPhase2Decide,
} from "./bossApDrainPassiveDecideCommit.ts";

const strike = starterSpells.find((s) => s.id === "physical_attack");
const kitSwap = starterSpells.find((s) => s.id === "spell-swap");
const kitSlow = starterSpells.find((s) => s.id === "spell-slow");
const chain = starterSpells.find((s) => s.id === "starter-blast");
const shield = starterSpells.find((s) => s.id === "starter-shield");
const poison = starterSpells.find((s) => s.id === "starter-poison");
const drainCourage = starterSpells.find((s) => s.id === "spell-drain-courage");

assert.ok(strike, "physical_attack");
assert.ok(kitSwap, "spell-swap");
assert.ok(kitSlow, "spell-slow");
assert.ok(chain, "starter-blast");
assert.ok(shield, "starter-shield");
assert.ok(poison, "starter-poison");
assert.ok(drainCourage, "spell-drain-courage");

const STRIKE_AP = Number(strike.apCost);
const PLAYER_AP = Number(startingChampionStats().ap);

function phase2DrainKit() {
  return {
    currentPhase: 2 as const,
    currentTurn: 2,
    kitSpellId: ENTHRONED_VOID_PHASE2_KIT_FIRST_ID,
    lastTurnDmgAP: AP_DRAIN_PASSIVE_TIER2_SPEND,
  };
}

function phase1EvenKit() {
  return {
    currentPhase: 1 as const,
    currentTurn: 2,
    kitSpellId: ENTHRONED_VOID_PHASE1_KIT_FIRST_ID,
    lastTurnDmgAP: AP_DRAIN_PASSIVE_TIER2_SPEND,
  };
}

function phase1OddKit() {
  return {
    currentPhase: 1 as const,
    currentTurn: 1,
    kitSpellId: ENTHRONED_VOID_PHASE1_KIT_FIRST_ID,
    lastTurnDmgAP: AP_DRAIN_PASSIVE_TIER2_SPEND,
  };
}

describe("wxEnthronedVoidKitBlocksApDrain (live leftover)", () => {
  it("phase-2 first-id Swap is decided instead of AP_DRAIN_PASSIVE", () => {
    const opts = phase2DrainKit();
    const live = wxEnthronedVoidPhase2Decide(opts);
    assert.equal(live.type, "spell");
    assert.equal(live.spellId, ENTHRONED_VOID_PHASE2_KIT_FIRST_ID);
    assert.equal(live.ability, undefined);
    assert.equal(wxEnthronedVoidKitBlocksApDrain(opts), true);
    assert.equal(isEnthronedVoidApDrainTurn(opts), true);
    assert.equal(liveWxCommitsApDrainPassive(), false);
    assert.equal(wxAppliesPlayerApModifier(), true);
  });

  it("empty kit still reaches drain — the leftover is first-id, not an empty pool", () => {
    const opts = {
      currentPhase: 2 as const,
      currentTurn: 2,
      kitSpellId: null,
      lastTurnDmgAP: AP_DRAIN_PASSIVE_TIER2_SPEND,
    };
    const live = wxEnthronedVoidPhase2Decide(opts);
    assert.equal(live.type, "ability");
    assert.equal(live.ability, AP_DRAIN_PASSIVE_ABILITY);
    assert.equal(wxEnthronedVoidKitBlocksApDrain(opts), false);
  });

  it("even phase 1 still lets kit Swap win — PHANTOM leftover of #1159", () => {
    const opts = phase1EvenKit();
    const live = wxEnthronedVoidPhase2Decide(opts);
    const next = resolveEnthronedVoidPhase2Decide(opts);
    assert.equal(isEnthronedVoidApDrainTurn(opts), false);
    assert.equal(live.type, "spell");
    assert.equal(next.type, "spell");
    assert.equal(next.spellId, ENTHRONED_VOID_PHASE1_KIT_FIRST_ID);
    assert.equal(wxEnthronedVoidKitBlocksApDrain(opts), false);
    assert.notEqual(next.ability, PHANTOM_SPAWN_ABILITY);
    assert.notEqual(next.ability, AP_DRAIN_PASSIVE_ABILITY);
  });

  it("odd phase 1 still lets kit Swap win — ANCHOR leftover of #1094", () => {
    const opts = phase1OddKit();
    const live = wxEnthronedVoidPhase2Decide(opts);
    const next = resolveEnthronedVoidPhase2Decide(opts);
    assert.equal(live.type, "spell");
    assert.equal(next.type, "spell");
    assert.equal(next.spellId, ENTHRONED_VOID_PHASE1_KIT_FIRST_ID);
    assert.equal(wxEnthronedVoidKitBlocksApDrain(opts), false);
    assert.notEqual(next.ability, ANCHOR_TILES_ABILITY);
    assert.notEqual(next.ability, DAMAGE_IMMUNE_ABILITY);
    assert.notEqual(next.ability, AP_DRAIN_PASSIVE_ABILITY);
  });

  it("phase 2 with last-turn damage AP 0 still lets kit win — tracking leftover", () => {
    const opts = {
      currentPhase: 2 as const,
      currentTurn: 2,
      kitSpellId: ENTHRONED_VOID_PHASE2_KIT_FIRST_ID,
      lastTurnDmgAP: 0,
    };
    const live = wxEnthronedVoidPhase2Decide(opts);
    const next = resolveEnthronedVoidPhase2Decide(opts);
    assert.equal(advertisedApDrainAmount(0), 0);
    assert.equal(live.type, "spell");
    assert.equal(next.type, "spell");
    assert.equal(wxEnthronedVoidKitBlocksApDrain(opts), false);
  });
});

describe("resolveEnthronedVoidPhase2Decide", () => {
  it("phase 2 prefers AP_DRAIN_PASSIVE over kit Swap when last-turn damage AP is 5", () => {
    const opts = phase2DrainKit();
    const next = resolveEnthronedVoidPhase2Decide(opts);
    assert.equal(next.type, "ability");
    assert.equal(next.ability, AP_DRAIN_PASSIVE_ABILITY);
    assert.equal(next.spellId, undefined);
    assert.equal(advertisedApDrainAmount(opts.lastTurnDmgAP), 2);
  });

  it("phase 2 prefers drain 1 when last-turn damage AP is 3", () => {
    const opts = {
      currentPhase: 2 as const,
      currentTurn: 4,
      kitSpellId: ENTHRONED_VOID_PHASE2_KIT_FIRST_ID,
      lastTurnDmgAP: AP_DRAIN_PASSIVE_TIER1_SPEND,
    };
    const next = resolveEnthronedVoidPhase2Decide(opts);
    assert.equal(next.ability, AP_DRAIN_PASSIVE_ABILITY);
    assert.equal(advertisedApDrainAmount(opts.lastTurnDmgAP), 1);
    assert.equal(AP_DRAIN_PASSIVE_TIER1_AMOUNT, 1);
    assert.equal(AP_DRAIN_PASSIVE_TIER2_AMOUNT, 2);
  });

  it("catalog phase-2 first id is Swap, not Slow, Drain Courage, or Strike", () => {
    const kits = readFileSync(
      join(dirname(fileURLToPath(import.meta.url)), "../data/bossKits.ts"),
      "utf8",
    );
    const voidKit = kits.slice(
      kits.indexOf("enthroned_void: {"),
      kits.indexOf("// ── Runtime validation"),
    );
    assert.ok(voidKit.includes(`"${ENTHRONED_VOID_PHASE2_KIT_FIRST_ID}"`));
    const p2 = voidKit.slice(voidKit.indexOf("phase2SpellIds:"));
    assert.ok(
      p2.indexOf(`"${ENTHRONED_VOID_PHASE2_KIT_FIRST_ID}"`) <
        p2.indexOf("spell-slow"),
    );
    assert.ok(p2.includes("spell-shadow-veil"));
    assert.equal(kitSwap.isSwap, true);
    assert.equal(Number(kitSwap.damage), 0);
    assert.equal(kitSwap.id, ENTHRONED_VOID_PHASE2_KIT_FIRST_ID);
    assert.equal(kitSlow.id, ETERNAL_PAWN_PHASE2_KIT_FIRST_ID);
    assert.equal(drainCourage.id, "spell-drain-courage");
  });

  it("does not steal Eternal Pawn AP_DRAIN always -1", () => {
    const pawn = {
      currentPhase: 2 as const,
      currentTurn: 2,
      kitSpellId: ETERNAL_PAWN_PHASE2_KIT_FIRST_ID,
      lastTurnDmgAP: AP_DRAIN_PASSIVE_TIER2_SPEND,
    };
    const live = wxEnthronedVoidPhase2Decide(pawn);
    const next = resolveEnthronedVoidPhase2Decide(pawn);
    assert.equal(live.spellId, ETERNAL_PAWN_PHASE2_KIT_FIRST_ID);
    assert.equal(next.ability, AP_DRAIN_PASSIVE_ABILITY);
    assert.notEqual(next.ability, AP_DRAIN_ABILITY);
    assert.equal(ETERNAL_PAWN_AP_DRAIN_AMOUNT, 1);
    assert.notEqual(
      advertisedApDrainAmount(AP_DRAIN_PASSIVE_TIER2_SPEND),
      ETERNAL_PAWN_AP_DRAIN_AMOUNT,
    );
  });

  it("does not steal BOARD_CLAIM -2 or Dawn +2", () => {
    const next = resolveEnthronedVoidPhase2Decide(phase2DrainKit());
    assert.equal(next.ability, AP_DRAIN_PASSIVE_ABILITY);
    assert.notEqual(next.ability, BOARD_CLAIM_ABILITY);
    assert.notEqual(next.ability, DAWN_BUFF_ABILITY);
    assert.equal(BOARD_CLAIM_IN_ZONE_DRAIN, 2);
    assert.equal(DAWN_BUFF_AP_BLESS, 2);
  });

  it("non-finite last-turn damage AP fail-closed and does not mint a drain", () => {
    assert.equal(advertisedApDrainAmount(Number.NaN), 0);
    assert.equal(advertisedApDrainAmount(Number.POSITIVE_INFINITY), 0);
    const next = resolveEnthronedVoidPhase2Decide({
      currentPhase: 2,
      currentTurn: 2,
      kitSpellId: ENTHRONED_VOID_PHASE2_KIT_FIRST_ID,
      lastTurnDmgAP: Number.NaN,
    });
    assert.equal(next.type, "spell");
    assert.equal(next.spellId, ENTHRONED_VOID_PHASE2_KIT_FIRST_ID);
  });
});

describe("player-visible leftover AP never drops", () => {
  it("live kit Swap keeps 10 AP so five Strikes still fit", () => {
    const live = wxEnthronedVoidPhase2Decide(phase2DrainKit());
    assert.equal(live.type, "spell");
    assert.equal(STRIKE_AP, 2);
    assert.equal(PLAYER_AP, 10);
    assert.equal(Number(kitSwap.damage), 0);
    const leftover = playerApAfterDecide({
      currentAp: PLAYER_AP,
      lastTurnDmgAP: AP_DRAIN_PASSIVE_TIER2_SPEND,
      decidedAbility: live.ability,
    });
    assert.equal(leftover, PLAYER_AP);
    assert.equal(
      strikeCountAffordable({ currentAp: leftover, strikeApCost: STRIKE_AP }),
      5,
      "no advertised drain decided — starter 10 AP still funds five Strikes",
    );
  });

  it("advertised drain of 2 cuts 10 AP to 8 so only four Strikes fit", () => {
    const next = resolveEnthronedVoidPhase2Decide(phase2DrainKit());
    assert.equal(next.ability, AP_DRAIN_PASSIVE_ABILITY);
    assert.equal(
      playerApAfterDrain({
        currentAp: PLAYER_AP,
        lastTurnDmgAP: AP_DRAIN_PASSIVE_TIER2_SPEND,
      }),
      8,
    );
    const leftover = playerApAfterDecide({
      currentAp: PLAYER_AP,
      lastTurnDmgAP: AP_DRAIN_PASSIVE_TIER2_SPEND,
      decidedAbility: next.ability,
    });
    assert.equal(leftover, 8);
    assert.equal(
      strikeCountAffordable({ currentAp: leftover, strikeApCost: STRIKE_AP }),
      4,
      "advertised drain of 2 leaves four Strikes, not five",
    );
    const combo =
      Number(strike.apCost) +
      Number(chain.apCost) +
      Number(shield.apCost) +
      Number(poison.apCost);
    assert.equal(combo, 10);
    assert.equal(combo <= leftover, false);
    assert.equal(combo <= PLAYER_AP, true);
  });

  it("kit Swap is 0-damage — Untouchable is not the unique price of this leftover", () => {
    assert.equal(Number(kitSwap.damage), 0);
    assert.equal(kitSwap.isSwap, true);
    assert.equal(strike.isPhysical, true);
    assert.equal(Number(strike.damage), 10);
  });
});

describe("production still decides kit first and never tracks last-turn damage AP", () => {
  it("decideEnthronedVoidAction still returns kit before Phantom before drain", () => {
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
    const drainIdx = body.indexOf("BossAbility.AP_DRAIN_PASSIVE");
    assert.ok(kitIdx >= 0, "kit pick is present");
    assert.ok(phantomIdx >= 0, "PHANTOM_SPAWN is present");
    assert.ok(drainIdx >= 0, "AP_DRAIN_PASSIVE is present");
    assert.ok(kitIdx < phantomIdx, "kit still wins the even Phantom turn");
    assert.ok(
      phantomIdx < drainIdx,
      "phase-2 AP_DRAIN leftover still after Phantom",
    );
    assert.ok(body.includes('type: "spell"'));
    assert.ok(body.includes("playerApModifier < 0"));
    assert.equal(body.includes("resolveEnthronedVoidPhase2Decide"), false);
    assert.equal(body.includes("wxEnthronedVoidKitBlocksApDrain"), false);
    assert.equal(body.includes("resolveEnthronedVoidEvenTurnDecide"), false);
  });

  it("applyApDrainPassive still writes advertised -1 / -2 from last-turn damage AP", () => {
    const src = readFileSync(
      join(
        dirname(fileURLToPath(import.meta.url)),
        "../hooks/useBossSystem.ts",
      ),
      "utf8",
    );
    const body = src.slice(
      src.indexOf("function applyApDrainPassive"),
      src.indexOf("function applyDamageImmune"),
    );
    assert.ok(body.includes("apDrainLastTurn"));
    assert.ok(body.includes("lastTurnDmgAP >= 5"));
    assert.ok(body.includes("apDrain = 2"));
    assert.ok(body.includes("lastTurnDmgAP >= 3"));
    assert.ok(body.includes("apDrain = 1"));
    assert.ok(body.includes("playerApModifier: -apDrain"));
    assert.ok(body.includes(AP_DRAIN_PASSIVE_LOG_NEEDLE));
    assert.ok(body.includes(AP_DRAIN_PASSIVE_WATCH_NEEDLE));
    assert.equal(body.includes("apDrainLastTurn:"), false);
    assert.equal(body.includes("resolveEnthronedVoidPhase2Decide"), false);
    const eternal = src.slice(
      src.indexOf("function applyApDrain("),
      src.indexOf("function applyTwinFlank"),
    );
    assert.ok(eternal.includes("playerApModifier: -1"));
    assert.notEqual(AP_DRAIN_ABILITY, AP_DRAIN_PASSIVE_ABILITY);
  });

  it("WorldExploration still applies playerApModifier but never writes apDrainLastTurn", () => {
    const wx = readFileSync(
      join(
        dirname(fileURLToPath(import.meta.url)),
        "../components/WorldExploration.tsx",
      ),
      "utf8",
    );
    const start = wx.indexOf("// Apply player AP drain");
    assert.ok(start >= 0, "live playerApModifier commit is present");
    const body = wx.slice(start, start + 280);
    assert.ok(body.includes("res?.playerApModifier"));
    assert.ok(body.includes("setCurrentBattleApSynced"));
    assert.equal(wx.includes("apDrainLastTurn"), false);
    assert.equal(wx.includes("resolveEnthronedVoidPhase2Decide"), false);
    assert.equal(wx.includes("wxEnthronedVoidKitBlocksApDrain"), false);
    assert.equal(wx.includes("AP_DRAIN_PASSIVE_TIER2_SPEND"), false);
  });

  it("enthroned_void still advertises AP_DRAIN_PASSIVE in phase 2, not phase 1", () => {
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
    assert.equal(p1.includes("BossAbility.AP_DRAIN_PASSIVE"), false);
    assert.ok(p2.includes("BossAbility.AP_DRAIN_PASSIVE"));
    assert.equal(p2.includes("BossAbility.AP_DRAIN,"), false);
    assert.equal(ENTHRONED_VOID_ID, "enthroned_void");
  });

  it("Boss Guide still advertises passive AP drain, not Eternal Pawn AP_DRAIN", () => {
    const src = readFileSync(
      join(
        dirname(fileURLToPath(import.meta.url)),
        "../components/BossGuideModal.tsx",
      ),
      "utf8",
    );
    const start = src.indexOf(AP_DRAIN_PASSIVE_GUIDE_NEEDLE);
    assert.ok(start >= 0, "AP_DRAIN_PASSIVE guide copy is present");
    const lineEnd = src.indexOf("\n", start);
    const body = src.slice(start, lineEnd >= 0 ? lineEnd : start + 80);
    assert.ok(body.includes(AP_DRAIN_PASSIVE_GUIDE_NEEDLE));
    assert.equal(body.includes("AP_DRAIN]"), false);
  });
});
