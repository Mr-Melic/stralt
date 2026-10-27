import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { starterSpells } from "../data/spellData.ts";
import { startingChampionStats } from "../utils/startingChampionStats.ts";
import {
  ADVANCE_GUIDE_NEEDLE,
  ADVANCE_LOG_NEEDLE,
  ADVANCE_PER_TURN_ABILITY,
  AP_DRAIN_ABILITY,
  AP_DRAIN_PASSIVE_ABILITY,
  BOARD_CLAIM_ABILITY,
  ENTHRONED_VOID_PHASE2_KIT_FIRST_ID,
  ETERNAL_PAWN_ADVANCE_BOARD,
  ETERNAL_PAWN_ATK,
  ETERNAL_PAWN_ID,
  ETERNAL_PAWN_PHASE1_KIT_FIRST_ID,
  ETERNAL_PAWN_PHASE2_KIT_FIRST_ID,
  SPLIT_ROOKS_ABILITY,
  bossPosAfterEternalPawnAdvance,
  bossPosAfterEternalPawnDecide,
  isEternalPawnAdjacent,
  isEternalPawnAdvanceTurn,
  liveWxCommitsEternalPawnAdvance,
  manhattanGap,
  rawEternalPawnAdvanceDest,
  resolveEternalPawnPhase1Decide,
  wxAppliesEternalPawnNewBossPosition,
  wxEternalPawnKitBlocksAdvance,
  wxEternalPawnPhase1Decide,
} from "./bossEternalPawnAdvanceDecideCommit.ts";

const strike = starterSpells.find((s) => s.id === "physical_attack");
const kitSlow = starterSpells.find((s) => s.id === "spell-slow");
const kitSwap = starterSpells.find((s) => s.id === "spell-swap");
const drainCourage = starterSpells.find((s) => s.id === "spell-drain-courage");

assert.ok(strike, "physical_attack");
assert.ok(kitSlow, "spell-slow");
assert.ok(kitSwap, "spell-swap");
assert.ok(drainCourage, "spell-drain-courage");

const PLAYER_HP = Number(startingChampionStats().hp);
const PLAYER_MP = Number(startingChampionStats().mp);

function openBoard(): boolean[][] {
  return Array.from({ length: ETERNAL_PAWN_ADVANCE_BOARD }, () =>
    Array.from({ length: ETERNAL_PAWN_ADVANCE_BOARD }, () => true),
  );
}

function phase1AdvanceKit() {
  return {
    bossId: ETERNAL_PAWN_ID,
    currentPhase: 1 as const,
    kitSpellId: ETERNAL_PAWN_PHASE1_KIT_FIRST_ID,
  };
}

function phase2DrainKit() {
  return {
    bossId: ETERNAL_PAWN_ID,
    currentPhase: 2 as const,
    kitSpellId: ETERNAL_PAWN_PHASE2_KIT_FIRST_ID,
  };
}

/** Four tiles west of the player — advertised three steps to adjacent. */
const GAP4_BOSS = { x: 4, y: 8 };
const GAP4_PLAYER = { x: 8, y: 8 };

describe("wxEternalPawnKitBlocksAdvance (live leftover)", () => {
  it("phase-1 first-id Slow is decided instead of ADVANCE_PER_TURN", () => {
    const opts = phase1AdvanceKit();
    const live = wxEternalPawnPhase1Decide(opts);
    assert.equal(live.type, "spell");
    assert.equal(live.spellId, ETERNAL_PAWN_PHASE1_KIT_FIRST_ID);
    assert.equal(live.ability, undefined);
    assert.equal(wxEternalPawnKitBlocksAdvance(opts), true);
    assert.equal(isEternalPawnAdvanceTurn(opts), true);
    assert.equal(liveWxCommitsEternalPawnAdvance(), false);
    assert.equal(wxAppliesEternalPawnNewBossPosition(), true);
  });

  it("empty kit still reaches advance — the leftover is first-id, not an empty pool", () => {
    const opts = {
      bossId: ETERNAL_PAWN_ID,
      currentPhase: 1 as const,
      kitSpellId: null,
    };
    const live = wxEternalPawnPhase1Decide(opts);
    assert.equal(live.type, "ability");
    assert.equal(live.ability, ADVANCE_PER_TURN_ABILITY);
    assert.equal(wxEternalPawnKitBlocksAdvance(opts), false);
  });

  it("phase 2 still lets kit Slow win — AP_DRAIN leftover of #1204", () => {
    const opts = phase2DrainKit();
    const live = wxEternalPawnPhase1Decide(opts);
    const next = resolveEternalPawnPhase1Decide(opts);
    assert.equal(isEternalPawnAdvanceTurn(opts), false);
    assert.equal(live.type, "spell");
    assert.equal(next.type, "spell");
    assert.equal(next.spellId, ETERNAL_PAWN_PHASE2_KIT_FIRST_ID);
    assert.equal(wxEternalPawnKitBlocksAdvance(opts), false);
    assert.notEqual(next.ability, AP_DRAIN_ABILITY);
    assert.notEqual(next.ability, ADVANCE_PER_TURN_ABILITY);
  });

  it("Enthroned Void still lets kit Swap win — AP_DRAIN_PASSIVE leftover of #1164", () => {
    const opts = {
      bossId: "enthroned_void",
      currentPhase: 2 as const,
      kitSpellId: ENTHRONED_VOID_PHASE2_KIT_FIRST_ID,
    };
    const live = wxEternalPawnPhase1Decide(opts);
    const next = resolveEternalPawnPhase1Decide(opts);
    assert.equal(isEternalPawnAdvanceTurn(opts), false);
    assert.equal(live.type, "spell");
    assert.equal(next.type, "spell");
    assert.equal(next.spellId, ENTHRONED_VOID_PHASE2_KIT_FIRST_ID);
    assert.equal(wxEternalPawnKitBlocksAdvance(opts), false);
    assert.notEqual(next.ability, AP_DRAIN_PASSIVE_ABILITY);
    assert.notEqual(next.ability, ADVANCE_PER_TURN_ABILITY);
    assert.notEqual(next.ability, AP_DRAIN_ABILITY);
  });
});

describe("resolveEternalPawnPhase1Decide", () => {
  it("phase 1 prefers ADVANCE_PER_TURN over kit Slow", () => {
    const opts = phase1AdvanceKit();
    const next = resolveEternalPawnPhase1Decide(opts);
    assert.equal(next.type, "ability");
    assert.equal(next.ability, ADVANCE_PER_TURN_ABILITY);
    assert.equal(next.spellId, undefined);
  });

  it("catalog phase-1 first id is Slow, not Swap, Drain Courage, or Strike", () => {
    const kits = readFileSync(
      join(dirname(fileURLToPath(import.meta.url)), "../data/bossKits.ts"),
      "utf8",
    );
    const pawnKit = kits.slice(
      kits.indexOf("eternal_pawn_king: {"),
      kits.indexOf("midnight_bishop: {"),
    );
    assert.ok(pawnKit.includes(`"${ETERNAL_PAWN_PHASE1_KIT_FIRST_ID}"`));
    const p1 = pawnKit.slice(
      pawnKit.indexOf("phase1SpellIds:"),
      pawnKit.indexOf("phase2SpellIds:"),
    );
    assert.ok(
      p1.indexOf(`"${ETERNAL_PAWN_PHASE1_KIT_FIRST_ID}"`) <
        p1.indexOf(`"${drainCourage.id}"`),
    );
    assert.equal(kitSlow.id, ETERNAL_PAWN_PHASE1_KIT_FIRST_ID);
    assert.equal(kitSlow.debuffStat, "mp");
    assert.equal(Number(kitSlow.debuffModifier), -2);
    assert.equal(Number(kitSlow.damage), 0);
    assert.equal(kitSwap.id, ENTHRONED_VOID_PHASE2_KIT_FIRST_ID);
    assert.equal(drainCourage.id, "spell-drain-courage");
  });

  it("does not steal Eternal Pawn phase-2 AP_DRAIN leftover of #1204", () => {
    const next = resolveEternalPawnPhase1Decide(phase1AdvanceKit());
    assert.equal(next.ability, ADVANCE_PER_TURN_ABILITY);
    assert.notEqual(next.ability, AP_DRAIN_ABILITY);
    assert.notEqual(next.ability, AP_DRAIN_PASSIVE_ABILITY);
  });

  it("does not steal Fetid Rook SPLIT_ROOKS or BOARD_CLAIM", () => {
    const next = resolveEternalPawnPhase1Decide(phase1AdvanceKit());
    assert.equal(next.ability, ADVANCE_PER_TURN_ABILITY);
    assert.notEqual(next.ability, SPLIT_ROOKS_ABILITY);
    assert.notEqual(next.ability, BOARD_CLAIM_ABILITY);
  });

  it("non-Eternal-Pawn bossId fail-closed and does not mint a walk", () => {
    const next = resolveEternalPawnPhase1Decide({
      bossId: "fetid_rook",
      currentPhase: 1,
      kitSpellId: ETERNAL_PAWN_PHASE1_KIT_FIRST_ID,
    });
    assert.equal(isEternalPawnAdvanceTurn({ currentPhase: 2 }), false);
    assert.equal(next.type, "spell");
    assert.equal(next.spellId, ETERNAL_PAWN_PHASE1_KIT_FIRST_ID);
    assert.equal(next.ability, undefined);
  });
});

describe("player-visible leftover gap never shrinks", () => {
  it("live kit Slow keeps Manhattan 4 so the pawn never becomes adjacent", () => {
    const live = wxEternalPawnPhase1Decide(phase1AdvanceKit());
    assert.equal(live.type, "spell");
    assert.equal(Number(kitSlow.damage), 0);
    assert.equal(kitSlow.debuffStat, "mp");
    assert.equal(manhattanGap(GAP4_BOSS, GAP4_PLAYER), 4);
    const leftover = bossPosAfterEternalPawnDecide({
      boss: GAP4_BOSS,
      player: GAP4_PLAYER,
      allTiles: openBoard(),
      bossId: ETERNAL_PAWN_ID,
      currentPhase: 1,
      decidedAbility: live.ability,
    });
    assert.deepEqual(leftover, GAP4_BOSS);
    assert.equal(manhattanGap(leftover, GAP4_PLAYER), 4);
    assert.equal(isEternalPawnAdjacent(leftover, GAP4_PLAYER), false);
    let parked = GAP4_BOSS;
    for (let i = 0; i < 3; i++) {
      parked = bossPosAfterEternalPawnDecide({
        boss: parked,
        player: GAP4_PLAYER,
        allTiles: openBoard(),
        bossId: ETERNAL_PAWN_ID,
        currentPhase: 1,
        decidedAbility: live.ability,
      });
    }
    assert.deepEqual(parked, GAP4_BOSS);
    assert.equal(
      isEternalPawnAdjacent(parked, GAP4_PLAYER),
      false,
      "no advertised walk decided — four-tile kite still holds after three Slow turns",
    );
  });

  it("advertised one-step close cuts Manhattan 4 to 3; three steps become adjacent", () => {
    const next = resolveEternalPawnPhase1Decide(phase1AdvanceKit());
    assert.equal(next.ability, ADVANCE_PER_TURN_ABILITY);
    const tiles = openBoard();
    assert.deepEqual(
      bossPosAfterEternalPawnAdvance({
        boss: GAP4_BOSS,
        player: GAP4_PLAYER,
        allTiles: tiles,
        bossId: ETERNAL_PAWN_ID,
        currentPhase: 1,
      }),
      { x: 5, y: 8 },
    );
    const leftover = bossPosAfterEternalPawnDecide({
      boss: GAP4_BOSS,
      player: GAP4_PLAYER,
      allTiles: tiles,
      bossId: ETERNAL_PAWN_ID,
      currentPhase: 1,
      decidedAbility: next.ability,
    });
    assert.deepEqual(leftover, { x: 5, y: 8 });
    assert.equal(manhattanGap(leftover, GAP4_PLAYER), 3);
    assert.notDeepEqual(
      leftover,
      GAP4_PLAYER,
      "first advertised step is not the kit dest onto the player tile",
    );
    let walked = GAP4_BOSS;
    for (let i = 0; i < 3; i++) {
      walked = bossPosAfterEternalPawnAdvance({
        boss: walked,
        player: GAP4_PLAYER,
        allTiles: tiles,
        bossId: ETERNAL_PAWN_ID,
        currentPhase: 1,
      });
    }
    assert.deepEqual(walked, { x: 7, y: 8 });
    assert.equal(
      isEternalPawnAdjacent(walked, GAP4_PLAYER),
      true,
      "advertised three orthogonal steps close the four-tile kite",
    );
    assert.equal(Number(strike.range), 1);
    assert.equal(Number(strike.range) < 4, true);
    assert.equal(Number(strike.range) >= 1, true);
  });

  it("kit Slow is 0-damage MP tax — it cannot substitute for the advertised close", () => {
    assert.equal(Number(kitSlow.damage), 0);
    assert.equal(kitSlow.debuffStat, "mp");
    assert.equal(Number(kitSlow.debuffModifier), -2);
    assert.equal(PLAYER_MP, 5);
    assert.equal(PLAYER_HP, 100);
    assert.equal(ETERNAL_PAWN_ATK, 30);
    assert.equal(strike.isPhysical, true);
    assert.equal(Number(strike.damage), 10);
    const mpAfterSlow = PLAYER_MP + Number(kitSlow.debuffModifier);
    assert.equal(mpAfterSlow, 3);
    assert.equal(
      manhattanGap(GAP4_BOSS, GAP4_PLAYER),
      4,
      "MP tax leaves the pawn on the origin tile",
    );
  });

  it("prefers horizontal then vertical, and stays put when both steps are blocked", () => {
    const tiles = openBoard();
    const diagonalBoss = { x: 4, y: 4 };
    const diagonalPlayer = { x: 8, y: 8 };
    assert.deepEqual(
      rawEternalPawnAdvanceDest(diagonalBoss, diagonalPlayer, tiles),
      { x: 5, y: 4 },
      "open diagonal must take the horizontal step first",
    );
    tiles[4][5] = false;
    assert.deepEqual(
      rawEternalPawnAdvanceDest(diagonalBoss, diagonalPlayer, tiles),
      { x: 4, y: 5 },
      "blocked horizontal falls through to vertical",
    );
    tiles[5][4] = false;
    assert.equal(
      rawEternalPawnAdvanceDest(diagonalBoss, diagonalPlayer, tiles),
      null,
    );
    assert.deepEqual(
      bossPosAfterEternalPawnAdvance({
        boss: diagonalBoss,
        player: diagonalPlayer,
        allTiles: tiles,
        bossId: ETERNAL_PAWN_ID,
        currentPhase: 1,
      }),
      diagonalBoss,
    );
    const verticalBoss = { x: 8, y: 4 };
    assert.deepEqual(
      rawEternalPawnAdvanceDest(verticalBoss, GAP4_PLAYER, openBoard()),
      { x: 8, y: 5 },
    );
  });

  it("non-finite coordinates fail-closed and do not mint a walk", () => {
    assert.equal(
      rawEternalPawnAdvanceDest(
        { x: Number.NaN, y: 8 },
        GAP4_PLAYER,
        openBoard(),
      ),
      null,
    );
    assert.deepEqual(
      bossPosAfterEternalPawnDecide({
        boss: { x: Number.POSITIVE_INFINITY, y: 8 },
        player: GAP4_PLAYER,
        allTiles: openBoard(),
        bossId: ETERNAL_PAWN_ID,
        currentPhase: 1,
        decidedAbility: ADVANCE_PER_TURN_ABILITY,
      }),
      { x: Number.POSITIVE_INFINITY, y: 8 },
    );
    assert.equal(manhattanGap({ x: Number.NaN, y: 0 }, GAP4_PLAYER), 0);
    assert.equal(
      isEternalPawnAdjacent({ x: Number.NaN, y: 0 }, GAP4_PLAYER),
      false,
    );
  });
});

describe("production still decides kit first and still writes one-step dest", () => {
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
    assert.ok(kitIdx < drainIdx, "kit still wins the phase-1 advance turn");
    assert.ok(
      drainIdx < advanceIdx,
      "phase-2 AP_DRAIN leftover of #1204 still after kit",
    );
    assert.ok(body.includes('type: "spell"'));
    assert.equal(body.includes("AP_DRAIN_PASSIVE"), false);
    assert.equal(body.includes("resolveEternalPawnPhase1Decide"), false);
    assert.equal(body.includes("wxEternalPawnKitBlocksAdvance"), false);
    assert.equal(body.includes("resolveEternalPawnPhase2Decide"), false);
  });

  it("applyAdvancePerTurn still writes advertised one-step newBossPosition", () => {
    const src = readFileSync(
      join(
        dirname(fileURLToPath(import.meta.url)),
        "../hooks/useBossSystem.ts",
      ),
      "utf8",
    );
    const body = src.slice(
      src.indexOf("function applyAdvancePerTurn("),
      src.indexOf("function applyApDrain("),
    );
    assert.ok(body.includes("newBossPosition: dest"));
    assert.ok(body.includes(ADVANCE_LOG_NEEDLE));
    assert.ok(body.includes("Prefer horizontal then vertical"));
    assert.equal(body.includes("findNearestFreeCell"), false);
    assert.equal(body.includes("legalizeAdvanceLanding"), false);
    assert.equal(body.includes("resolveEternalPawnPhase1Decide"), false);
    assert.equal(body.includes("playerApModifier"), false);
  });

  it("WorldExploration still commits newBossPosition but never decides Eternal Pawn advance", () => {
    const wx = readFileSync(
      join(
        dirname(fileURLToPath(import.meta.url)),
        "../components/WorldExploration.tsx",
      ),
      "utf8",
    );
    const start = wx.indexOf(
      "const newBossX = res?.newBossPosition?.x ?? enemy.x;",
    );
    assert.ok(start >= 0, "live newBossPosition commit is present");
    const body = wx.slice(start, start + 160);
    assert.ok(body.includes("res?.newBossPosition?.y ?? enemy.y"));
    assert.equal(wx.includes("resolveEternalPawnPhase1Decide"), false);
    assert.equal(wx.includes("wxEternalPawnKitBlocksAdvance"), false);
    assert.equal(wx.includes("rawEternalPawnAdvanceDest"), false);
    const kitDest = wx.indexOf("const bossSpellDest = {");
    assert.ok(kitDest >= 0, "kit dest leftover still writes targetX/Y");
    const kitBody = wx.slice(kitDest, kitDest + 180);
    assert.ok(kitBody.includes("bossAIAction.targetX ?? enemy.x"));
    assert.ok(kitBody.includes("bossAIAction.targetY ?? enemy.y"));
  });

  it("eternal_pawn_king still advertises ADVANCE_PER_TURN in phase 1", () => {
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

  it("Boss Guide still advertises ADVANCE_PER_TURN kite, not AP Drain", () => {
    const src = readFileSync(
      join(
        dirname(fileURLToPath(import.meta.url)),
        "../components/BossGuideModal.tsx",
      ),
      "utf8",
    );
    const start = src.indexOf(ADVANCE_GUIDE_NEEDLE);
    assert.ok(start >= 0, "ADVANCE_PER_TURN guide copy is present");
    const lineEnd = src.indexOf("\n", start);
    const body = src.slice(start, lineEnd >= 0 ? lineEnd : start + 120);
    assert.ok(body.includes(ADVANCE_GUIDE_NEEDLE));
    assert.equal(body.includes("AP_DRAIN"), false);
    assert.ok(body.includes("Kite"));
  });
});
