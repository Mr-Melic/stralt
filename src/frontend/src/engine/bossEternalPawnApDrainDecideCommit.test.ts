import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { starterSpells } from "../data/spellData.ts";
import { startingChampionStats } from "../utils/startingChampionStats.ts";
import {
  ADVANCE_PER_TURN_ABILITY,
  ANCHOR_TILES_ABILITY,
  AP_DRAIN_ABILITY,
  AP_DRAIN_GUIDE_NEEDLE,
  AP_DRAIN_LOG_NEEDLE,
  AP_DRAIN_PASSIVE_ABILITY,
  AP_DRAIN_PASSIVE_TIER2_AMOUNT,
  BOARD_CLAIM_ABILITY,
  BOARD_CLAIM_IN_ZONE_DRAIN,
  DAWN_BUFF_ABILITY,
  DAWN_BUFF_AP_BLESS,
  ENTHRONED_VOID_PHASE2_KIT_FIRST_ID,
  ETERNAL_PAWN_AP_DRAIN_AMOUNT,
  ETERNAL_PAWN_ID,
  ETERNAL_PAWN_PHASE1_KIT_FIRST_ID,
  ETERNAL_PAWN_PHASE2_KIT_FIRST_ID,
  ETERNAL_PAWN_PHASE2_KIT_SECOND_ID,
  PHANTOM_SPAWN_ABILITY,
  advertisedEternalPawnApDrainAmount,
  eternalPawnStrikeCountAffordable,
  isEternalPawnApDrainTurn,
  liveWxCommitsEternalPawnApDrain,
  playerApAfterEternalPawnDecide,
  playerApAfterEternalPawnDrain,
  resolveEternalPawnPhase2Decide,
  wxAppliesEternalPawnPlayerApModifier,
  wxEternalPawnKitBlocksApDrain,
  wxEternalPawnPhase2Decide,
} from "./bossEternalPawnApDrainDecideCommit.ts";

const strike = starterSpells.find((s) => s.id === "physical_attack");
const kitSlow = starterSpells.find((s) => s.id === "spell-slow");
const kitSwap = starterSpells.find((s) => s.id === "spell-swap");
const drainCourage = starterSpells.find((s) => s.id === "spell-drain-courage");
const chain = starterSpells.find((s) => s.id === "starter-blast");
const shield = starterSpells.find((s) => s.id === "starter-shield");
const poison = starterSpells.find((s) => s.id === "starter-poison");

assert.ok(strike, "physical_attack");
assert.ok(kitSlow, "spell-slow");
assert.ok(kitSwap, "spell-swap");
assert.ok(drainCourage, "spell-drain-courage");
assert.ok(chain, "starter-blast");
assert.ok(shield, "starter-shield");
assert.ok(poison, "starter-poison");

const STRIKE_AP = Number(strike.apCost);
const PLAYER_AP = Number(startingChampionStats().ap);

function phase2DrainKit() {
  return {
    bossId: ETERNAL_PAWN_ID,
    currentPhase: 2 as const,
    kitSpellId: ETERNAL_PAWN_PHASE2_KIT_FIRST_ID,
  };
}

function phase1AdvanceKit() {
  return {
    bossId: ETERNAL_PAWN_ID,
    currentPhase: 1 as const,
    kitSpellId: ETERNAL_PAWN_PHASE1_KIT_FIRST_ID,
  };
}

describe("wxEternalPawnKitBlocksApDrain (live leftover)", () => {
  it("phase-2 first-id Slow is decided instead of AP_DRAIN", () => {
    const opts = phase2DrainKit();
    const live = wxEternalPawnPhase2Decide(opts);
    assert.equal(live.type, "spell");
    assert.equal(live.spellId, ETERNAL_PAWN_PHASE2_KIT_FIRST_ID);
    assert.equal(live.ability, undefined);
    assert.equal(wxEternalPawnKitBlocksApDrain(opts), true);
    assert.equal(isEternalPawnApDrainTurn(opts), true);
    assert.equal(liveWxCommitsEternalPawnApDrain(), false);
    assert.equal(wxAppliesEternalPawnPlayerApModifier(), true);
  });

  it("empty kit still reaches drain — the leftover is first-id, not an empty pool", () => {
    const opts = {
      bossId: ETERNAL_PAWN_ID,
      currentPhase: 2 as const,
      kitSpellId: null,
    };
    const live = wxEternalPawnPhase2Decide(opts);
    assert.equal(live.type, "ability");
    assert.equal(live.ability, AP_DRAIN_ABILITY);
    assert.equal(wxEternalPawnKitBlocksApDrain(opts), false);
  });

  it("phase 1 still lets kit Slow win — ADVANCE leftover", () => {
    const opts = phase1AdvanceKit();
    const live = wxEternalPawnPhase2Decide(opts);
    const next = resolveEternalPawnPhase2Decide(opts);
    assert.equal(isEternalPawnApDrainTurn(opts), false);
    assert.equal(live.type, "spell");
    assert.equal(next.type, "spell");
    assert.equal(next.spellId, ETERNAL_PAWN_PHASE1_KIT_FIRST_ID);
    assert.equal(wxEternalPawnKitBlocksApDrain(opts), false);
    assert.notEqual(next.ability, ADVANCE_PER_TURN_ABILITY);
    assert.notEqual(next.ability, AP_DRAIN_ABILITY);
  });

  it("Enthroned Void still lets kit Swap win — AP_DRAIN_PASSIVE leftover of #1164", () => {
    const opts = {
      bossId: "enthroned_void",
      currentPhase: 2 as const,
      kitSpellId: ENTHRONED_VOID_PHASE2_KIT_FIRST_ID,
    };
    const live = wxEternalPawnPhase2Decide(opts);
    const next = resolveEternalPawnPhase2Decide(opts);
    assert.equal(isEternalPawnApDrainTurn(opts), false);
    assert.equal(live.type, "spell");
    assert.equal(next.type, "spell");
    assert.equal(next.spellId, ENTHRONED_VOID_PHASE2_KIT_FIRST_ID);
    assert.equal(wxEternalPawnKitBlocksApDrain(opts), false);
    assert.notEqual(next.ability, AP_DRAIN_PASSIVE_ABILITY);
    assert.notEqual(next.ability, AP_DRAIN_ABILITY);
    assert.notEqual(next.ability, PHANTOM_SPAWN_ABILITY);
    assert.notEqual(next.ability, ANCHOR_TILES_ABILITY);
  });
});

describe("resolveEternalPawnPhase2Decide", () => {
  it("phase 2 prefers AP_DRAIN over kit Slow", () => {
    const opts = phase2DrainKit();
    const next = resolveEternalPawnPhase2Decide(opts);
    assert.equal(next.type, "ability");
    assert.equal(next.ability, AP_DRAIN_ABILITY);
    assert.equal(next.spellId, undefined);
    assert.equal(advertisedEternalPawnApDrainAmount(opts), 1);
    assert.equal(ETERNAL_PAWN_AP_DRAIN_AMOUNT, 1);
  });

  it("catalog phase-2 first id is Slow, not Swap, Drain Courage, or Strike", () => {
    const kits = readFileSync(
      join(dirname(fileURLToPath(import.meta.url)), "../data/bossKits.ts"),
      "utf8",
    );
    const pawnKit = kits.slice(
      kits.indexOf("eternal_pawn_king: {"),
      kits.indexOf("midnight_bishop: {"),
    );
    assert.ok(pawnKit.includes(`"${ETERNAL_PAWN_PHASE2_KIT_FIRST_ID}"`));
    const p2 = pawnKit.slice(pawnKit.indexOf("phase2SpellIds:"));
    assert.ok(
      p2.indexOf(`"${ETERNAL_PAWN_PHASE2_KIT_FIRST_ID}"`) <
        p2.indexOf(`"${ETERNAL_PAWN_PHASE2_KIT_SECOND_ID}"`),
    );
    assert.equal(kitSlow.id, ETERNAL_PAWN_PHASE2_KIT_FIRST_ID);
    assert.equal(kitSlow.debuffStat, "mp");
    assert.equal(Number(kitSlow.debuffModifier), -2);
    assert.equal(Number(kitSlow.damage), 0);
    assert.equal(kitSwap.id, ENTHRONED_VOID_PHASE2_KIT_FIRST_ID);
    assert.equal(drainCourage.id, ETERNAL_PAWN_PHASE2_KIT_SECOND_ID);
    assert.equal(drainCourage.debuffStat, "ap");
  });

  it("does not steal Enthroned Void AP_DRAIN_PASSIVE last-turn −2", () => {
    const next = resolveEternalPawnPhase2Decide(phase2DrainKit());
    assert.equal(next.ability, AP_DRAIN_ABILITY);
    assert.notEqual(next.ability, AP_DRAIN_PASSIVE_ABILITY);
    assert.equal(ETERNAL_PAWN_AP_DRAIN_AMOUNT, 1);
    assert.notEqual(
      ETERNAL_PAWN_AP_DRAIN_AMOUNT,
      AP_DRAIN_PASSIVE_TIER2_AMOUNT,
    );
  });

  it("does not steal BOARD_CLAIM −2, Dawn +2, or kit Drain Courage", () => {
    const next = resolveEternalPawnPhase2Decide(phase2DrainKit());
    assert.equal(next.ability, AP_DRAIN_ABILITY);
    assert.notEqual(next.ability, BOARD_CLAIM_ABILITY);
    assert.notEqual(next.ability, DAWN_BUFF_ABILITY);
    assert.notEqual(next.spellId, ETERNAL_PAWN_PHASE2_KIT_SECOND_ID);
    assert.equal(BOARD_CLAIM_IN_ZONE_DRAIN, 2);
    assert.equal(DAWN_BUFF_AP_BLESS, 2);
    assert.equal(Number(drainCourage.damage), 18);
  });

  it("non-Eternal-Pawn bossId fail-closed and does not mint a drain", () => {
    const next = resolveEternalPawnPhase2Decide({
      bossId: "fetid_rook",
      currentPhase: 2,
      kitSpellId: ETERNAL_PAWN_PHASE2_KIT_FIRST_ID,
    });
    assert.equal(advertisedEternalPawnApDrainAmount({ currentPhase: 1 }), 0);
    assert.equal(next.type, "spell");
    assert.equal(next.spellId, ETERNAL_PAWN_PHASE2_KIT_FIRST_ID);
    assert.equal(next.ability, undefined);
  });
});

describe("player-visible leftover AP never drops", () => {
  it("live kit Slow keeps 10 AP so five Strikes still fit", () => {
    const live = wxEternalPawnPhase2Decide(phase2DrainKit());
    assert.equal(live.type, "spell");
    assert.equal(STRIKE_AP, 2);
    assert.equal(PLAYER_AP, 10);
    assert.equal(Number(kitSlow.damage), 0);
    assert.equal(kitSlow.debuffStat, "mp");
    const leftover = playerApAfterEternalPawnDecide({
      currentAp: PLAYER_AP,
      bossId: ETERNAL_PAWN_ID,
      currentPhase: 2,
      decidedAbility: live.ability,
    });
    assert.equal(leftover, PLAYER_AP);
    assert.equal(
      eternalPawnStrikeCountAffordable({
        currentAp: leftover,
        strikeApCost: STRIKE_AP,
      }),
      5,
      "no advertised drain decided — starter 10 AP still funds five Strikes",
    );
  });

  it("advertised drain of 1 cuts 10 AP to 9 so only four Strikes fit", () => {
    const next = resolveEternalPawnPhase2Decide(phase2DrainKit());
    assert.equal(next.ability, AP_DRAIN_ABILITY);
    assert.equal(
      playerApAfterEternalPawnDrain({
        currentAp: PLAYER_AP,
        bossId: ETERNAL_PAWN_ID,
        currentPhase: 2,
      }),
      9,
    );
    const leftover = playerApAfterEternalPawnDecide({
      currentAp: PLAYER_AP,
      bossId: ETERNAL_PAWN_ID,
      currentPhase: 2,
      decidedAbility: next.ability,
    });
    assert.equal(leftover, 9);
    assert.equal(
      eternalPawnStrikeCountAffordable({
        currentAp: leftover,
        strikeApCost: STRIKE_AP,
      }),
      4,
      "advertised drain of 1 leaves four Strikes, not five",
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

  it("kit Slow is 0-damage MP tax — Untouchable is not the unique price of this leftover", () => {
    assert.equal(Number(kitSlow.damage), 0);
    assert.equal(kitSlow.debuffStat, "mp");
    assert.equal(strike.isPhysical, true);
    assert.equal(Number(strike.damage), 10);
  });

  it("non-finite current AP fail-closed and does not mint a drain", () => {
    assert.equal(
      playerApAfterEternalPawnDrain({
        currentAp: Number.NaN,
        bossId: ETERNAL_PAWN_ID,
        currentPhase: 2,
      }),
      0,
    );
    assert.equal(
      playerApAfterEternalPawnDecide({
        currentAp: Number.POSITIVE_INFINITY,
        bossId: ETERNAL_PAWN_ID,
        currentPhase: 2,
        decidedAbility: AP_DRAIN_ABILITY,
      }),
      0,
    );
    assert.equal(
      eternalPawnStrikeCountAffordable({
        currentAp: PLAYER_AP,
        strikeApCost: 0,
      }),
      0,
    );
  });
});

describe("production still decides kit first and always writes drain −1", () => {
  it("decideEternalPawnKingAction still returns kit before drain before Advance", () => {
    const src = readFileSync(
      join(dirname(fileURLToPath(import.meta.url)), "../hooks/useBossAI.ts"),
      "utf8",
    );
    const start = src.indexOf("// ── 8. Eternal Pawn King");
    const end = src.indexOf("// ── 9. Midnight Bishop");
    assert.ok(start >= 0 && end > start, "Eternal Pawn decide is present");
    const body = src.slice(start, end);
    const kitIdx = body.indexOf("pickBossKitSpell");
    const drainIdx = body.indexOf("BossAbility.AP_DRAIN");
    const advanceIdx = body.indexOf("BossAbility.ADVANCE_PER_TURN");
    assert.ok(kitIdx >= 0, "kit pick is present");
    assert.ok(drainIdx >= 0, "AP_DRAIN is present");
    assert.ok(advanceIdx >= 0, "ADVANCE_PER_TURN is present");
    assert.ok(kitIdx < drainIdx, "kit still wins the phase-2 drain turn");
    assert.ok(
      drainIdx < advanceIdx,
      "phase-1 ADVANCE leftover still after drain",
    );
    assert.ok(body.includes('type: "spell"'));
    assert.equal(body.includes("AP_DRAIN_PASSIVE"), false);
    assert.equal(body.includes("resolveEternalPawnPhase2Decide"), false);
    assert.equal(body.includes("wxEternalPawnKitBlocksApDrain"), false);
    assert.equal(body.includes("resolveEnthronedVoidPhase2Decide"), false);
  });

  it("applyApDrain still writes advertised −1 with no last-turn threshold", () => {
    const src = readFileSync(
      join(
        dirname(fileURLToPath(import.meta.url)),
        "../hooks/useBossSystem.ts",
      ),
      "utf8",
    );
    const body = src.slice(
      src.indexOf("function applyApDrain("),
      src.indexOf("function applyTwinFlank"),
    );
    assert.ok(body.includes("playerApModifier: -1"));
    assert.ok(body.includes(AP_DRAIN_LOG_NEEDLE));
    assert.equal(body.includes("apDrainLastTurn"), false);
    assert.equal(body.includes("lastTurnDmgAP"), false);
    assert.equal(body.includes("resolveEternalPawnPhase2Decide"), false);
    const passive = src.slice(
      src.indexOf("function applyApDrainPassive"),
      src.indexOf("function applyDamageImmune"),
    );
    assert.ok(passive.includes("lastTurnDmgAP >= 5"));
    assert.ok(passive.includes("playerApModifier: -apDrain"));
    assert.notEqual(AP_DRAIN_ABILITY, AP_DRAIN_PASSIVE_ABILITY);
  });

  it("WorldExploration still applies playerApModifier but never decides Eternal Pawn drain", () => {
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
    assert.equal(wx.includes("resolveEternalPawnPhase2Decide"), false);
    assert.equal(wx.includes("wxEternalPawnKitBlocksApDrain"), false);
    assert.equal(wx.includes("ETERNAL_PAWN_AP_DRAIN_AMOUNT"), false);
  });

  it("eternal_pawn_king still advertises AP_DRAIN in phase 2, not phase 1", () => {
    const src = readFileSync(
      join(dirname(fileURLToPath(import.meta.url)), "../types/bossDefaults.ts"),
      "utf8",
    );
    const pawn = src.slice(src.indexOf('id: "eternal_pawn_king"'));
    const p1 = pawn.slice(pawn.indexOf("phase1:"), pawn.indexOf("phase2:"));
    const p2 = pawn.slice(
      pawn.indexOf("phase2:"),
      pawn.indexOf("midnight_bishop"),
    );
    assert.ok(p1.includes("BossAbility.ADVANCE_PER_TURN"));
    assert.equal(p1.includes("BossAbility.AP_DRAIN"), false);
    assert.ok(p2.includes("BossAbility.AP_DRAIN"));
    assert.ok(p2.includes("BossAbility.ADVANCE_PER_TURN"));
    assert.equal(p2.includes("BossAbility.AP_DRAIN_PASSIVE"), false);
    assert.equal(ETERNAL_PAWN_ID, "eternal_pawn_king");
  });

  it("Boss Guide still advertises AP_DRAIN, not Enthroned Void passive drain", () => {
    const src = readFileSync(
      join(
        dirname(fileURLToPath(import.meta.url)),
        "../components/BossGuideModal.tsx",
      ),
      "utf8",
    );
    const start = src.indexOf(AP_DRAIN_GUIDE_NEEDLE);
    assert.ok(start >= 0, "AP_DRAIN guide copy is present");
    const lineEnd = src.indexOf("\n", start);
    const body = src.slice(start, lineEnd >= 0 ? lineEnd : start + 80);
    assert.ok(body.includes(AP_DRAIN_GUIDE_NEEDLE));
    assert.equal(body.includes("AP_DRAIN_PASSIVE"), false);
  });
});
