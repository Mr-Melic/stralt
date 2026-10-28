import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { starterSpells } from "../data/spellData.ts";
import { startingChampionStats } from "../utils/startingChampionStats.ts";
import { shouldAwardVictory } from "./battleSetup.ts";
import {
  ADVANCE_PER_TURN_ABILITY,
  AP_DRAIN_ABILITY,
  ENTHRONED_VOID_PHASE1_KIT_FIRST_ID,
  ETERNAL_PAWN_PHASE1_KIT_FIRST_ID,
  FINAL_PAWN_HP,
  FINAL_PAWN_ID,
  FINAL_PAWN_KIT_FIRST_ID,
  GHOST_SUMMON_ABILITY,
  GHOST_SUMMON_COUNT,
  GHOST_SUMMON_GUIDE_NEEDLE,
  GHOST_SUMMON_HP,
  GHOST_SUMMON_HP_RATIO,
  GHOST_SUMMON_LOG_NEEDLE,
  GHOST_SUMMON_TRIGGER_HP,
  INVINCIBLE_LOG_NEEDLE,
  INVINCIBLE_PHASE_ABILITY,
  INVINCIBLE_PHASE_TURNS,
  PHANTOM_SPAWN_ABILITY,
  SPLIT_ROOKS_ABILITY,
  bossHpAfterFinalPawnDecide,
  ghostCountAfterFinalPawnDecide,
  invincibleTurnsAfterFinalPawnDecide,
  isFinalPawnGhostTurn,
  liveWxCommitsFinalPawnGhosts,
  resolveFinalPawnGhostDecide,
  wxAppliesFinalPawnGhostSpawns,
  wxFinalPawnGhostDecide,
  wxFinalPawnKitBlocksGhost,
} from "./bossGhostSummonDecideCommit.ts";

const strike = starterSpells.find((s) => s.id === "physical_attack");
const kitSwap = starterSpells.find((s) => s.id === "spell-swap");
const kitSlow = starterSpells.find((s) => s.id === "spell-slow");

assert.ok(strike, "physical_attack");
assert.ok(kitSwap, "spell-swap");
assert.ok(kitSlow, "spell-slow");

const PLAYER_HP = Number(startingChampionStats().hp);
const STRIKE_DAMAGE = Number(strike.damage);

function triggerKit() {
  return {
    bossId: FINAL_PAWN_ID,
    currentPhase: 1 as const,
    kitSpellId: FINAL_PAWN_KIT_FIRST_ID,
    phase2Triggered: false,
    bossHp: GHOST_SUMMON_TRIGGER_HP,
    bossMaxHp: FINAL_PAWN_HP,
  };
}

describe("wxFinalPawnKitBlocksGhost (live leftover)", () => {
  it("first-id Strike is decided instead of GHOST_SUMMON at 60/600", () => {
    const opts = triggerKit();
    const live = wxFinalPawnGhostDecide(opts);
    assert.equal(live.type, "spell");
    assert.equal(live.spellId, FINAL_PAWN_KIT_FIRST_ID);
    assert.equal(live.ability, undefined);
    assert.equal(wxFinalPawnKitBlocksGhost(opts), true);
    assert.equal(isFinalPawnGhostTurn(opts), true);
    assert.equal(liveWxCommitsFinalPawnGhosts(), false);
    assert.equal(wxAppliesFinalPawnGhostSpawns(), true);
  });

  it("empty kit still reaches ghost — the leftover is first-id, not an empty pool", () => {
    const opts = {
      ...triggerKit(),
      kitSpellId: null,
    };
    const live = wxFinalPawnGhostDecide(opts);
    assert.equal(live.type, "summon");
    assert.equal(live.ability, GHOST_SUMMON_ABILITY);
    assert.equal(wxFinalPawnKitBlocksGhost(opts), false);
  });

  it("full-HP Final Pawn still lets kit Strike win — not the 10% trigger", () => {
    const opts = {
      ...triggerKit(),
      bossHp: FINAL_PAWN_HP,
    };
    const live = wxFinalPawnGhostDecide(opts);
    const next = resolveFinalPawnGhostDecide(opts);
    assert.equal(isFinalPawnGhostTurn(opts), false);
    assert.equal(live.type, "spell");
    assert.equal(next.type, "spell");
    assert.equal(next.spellId, FINAL_PAWN_KIT_FIRST_ID);
    assert.equal(wxFinalPawnKitBlocksGhost(opts), false);
    assert.notEqual(next.ability, GHOST_SUMMON_ABILITY);
  });

  it("Enthroned Void still lets kit Swap win — PHANTOM leftover of #1159", () => {
    const opts = {
      bossId: "enthroned_void",
      currentPhase: 1 as const,
      kitSpellId: ENTHRONED_VOID_PHASE1_KIT_FIRST_ID,
      phase2Triggered: false,
      bossHp: 1,
      bossMaxHp: 280,
    };
    const live = wxFinalPawnGhostDecide(opts);
    const next = resolveFinalPawnGhostDecide(opts);
    assert.equal(isFinalPawnGhostTurn(opts), false);
    assert.equal(live.type, "spell");
    assert.equal(next.type, "spell");
    assert.equal(next.spellId, ENTHRONED_VOID_PHASE1_KIT_FIRST_ID);
    assert.equal(wxFinalPawnKitBlocksGhost(opts), false);
    assert.notEqual(next.ability, PHANTOM_SPAWN_ABILITY);
    assert.notEqual(next.ability, GHOST_SUMMON_ABILITY);
  });
});

describe("resolveFinalPawnGhostDecide", () => {
  it("≤10% HP prefers GHOST_SUMMON over kit Strike", () => {
    const opts = triggerKit();
    const next = resolveFinalPawnGhostDecide(opts);
    assert.equal(next.type, "summon");
    assert.equal(next.ability, GHOST_SUMMON_ABILITY);
    assert.equal(next.spellId, undefined);
  });

  it("catalog first id is Strike, not Swap or Slow", () => {
    const kits = readFileSync(
      join(dirname(fileURLToPath(import.meta.url)), "../data/bossKits.ts"),
      "utf8",
    );
    const pawnKit = kits.slice(
      kits.indexOf("final_pawn: {"),
      kits.indexOf("alabaster_fortress: {"),
    );
    assert.ok(pawnKit.includes(`"${FINAL_PAWN_KIT_FIRST_ID}"`));
    const p1 = pawnKit.slice(
      pawnKit.indexOf("phase1SpellIds:"),
      pawnKit.indexOf("phase2SpellIds:"),
    );
    assert.ok(p1.includes(`"${FINAL_PAWN_KIT_FIRST_ID}"`));
    assert.equal(strike.id, FINAL_PAWN_KIT_FIRST_ID);
    assert.equal(strike.isPhysical, true);
    assert.equal(Number(strike.damage), 10);
    assert.equal(kitSwap.id, ENTHRONED_VOID_PHASE1_KIT_FIRST_ID);
    assert.equal(kitSlow.id, ETERNAL_PAWN_PHASE1_KIT_FIRST_ID);
  });

  it("does not steal Eternal Pawn ADVANCE leftover of #1212 or AP_DRAIN of #1204", () => {
    const next = resolveFinalPawnGhostDecide(triggerKit());
    assert.equal(next.ability, GHOST_SUMMON_ABILITY);
    assert.notEqual(next.ability, ADVANCE_PER_TURN_ABILITY);
    assert.notEqual(next.ability, AP_DRAIN_ABILITY);
  });

  it("does not steal Fetid Rook SPLIT_ROOKS leftover of #1231", () => {
    const next = resolveFinalPawnGhostDecide(triggerKit());
    assert.equal(next.ability, GHOST_SUMMON_ABILITY);
    assert.notEqual(next.ability, SPLIT_ROOKS_ABILITY);
  });

  it("already-triggered phase 2 and non-Final-Pawn bossId fail-closed", () => {
    const triggered = resolveFinalPawnGhostDecide({
      ...triggerKit(),
      phase2Triggered: true,
    });
    assert.equal(
      isFinalPawnGhostTurn({ ...triggerKit(), phase2Triggered: true }),
      false,
    );
    assert.equal(triggered.type, "spell");
    assert.equal(triggered.spellId, FINAL_PAWN_KIT_FIRST_ID);
    assert.equal(triggered.ability, undefined);

    const rook = resolveFinalPawnGhostDecide({
      bossId: "fetid_rook",
      currentPhase: 2,
      kitSpellId: FINAL_PAWN_KIT_FIRST_ID,
      phase2Triggered: false,
      bossHp: 1,
      bossMaxHp: 420,
    });
    assert.equal(rook.type, "spell");
    assert.equal(rook.spellId, FINAL_PAWN_KIT_FIRST_ID);
  });
});

describe("player-visible leftover gauntlet never starts", () => {
  it("live kit Strike keeps zero ghosts so the pawn stays damageable", () => {
    const live = wxFinalPawnGhostDecide(triggerKit());
    assert.equal(live.type, "spell");
    assert.equal(Number(strike.damage), 10);
    assert.equal(strike.isPhysical, true);
    assert.equal(
      ghostCountAfterFinalPawnDecide({ decidedAbility: live.ability }),
      0,
    );
    assert.equal(
      invincibleTurnsAfterFinalPawnDecide({ decidedAbility: live.ability }),
      0,
    );
    const leftoverHp = bossHpAfterFinalPawnDecide({
      bossHp: GHOST_SUMMON_TRIGGER_HP,
      decidedAbility: live.ability,
      kitStrikeDamage: STRIKE_DAMAGE,
    });
    assert.equal(leftoverHp, 50);
    assert.equal(
      shouldAwardVictory({
        inBattle: true,
        deathTriggered: false,
        battleStartIdsSize: 1,
        hostilesRemaining: leftoverHp > 0 ? 1 : 0,
      }),
      false,
      "live leftover still has a damageable pawn and zero ghosts",
    );
  });

  it("advertised ghosts occupy the graph and five-turn invincibility holds 60 HP", () => {
    const next = resolveFinalPawnGhostDecide(triggerKit());
    assert.equal(next.ability, GHOST_SUMMON_ABILITY);
    assert.equal(
      ghostCountAfterFinalPawnDecide({ decidedAbility: next.ability }),
      GHOST_SUMMON_COUNT,
    );
    assert.equal(
      invincibleTurnsAfterFinalPawnDecide({ decidedAbility: next.ability }),
      INVINCIBLE_PHASE_TURNS,
    );
    const advertisedHp = bossHpAfterFinalPawnDecide({
      bossHp: GHOST_SUMMON_TRIGGER_HP,
      decidedAbility: next.ability,
      kitStrikeDamage: STRIKE_DAMAGE,
    });
    assert.equal(advertisedHp, GHOST_SUMMON_TRIGGER_HP);
    assert.equal(
      shouldAwardVictory({
        inBattle: true,
        deathTriggered: false,
        battleStartIdsSize: 12,
        hostilesRemaining: 1 + GHOST_SUMMON_COUNT,
      }),
      false,
      "advertised eleven kings plus invincible pawn still occupy the fight",
    );
    assert.equal(GHOST_SUMMON_HP, 1);
    assert.equal(GHOST_SUMMON_HP_RATIO, 0.1);
    assert.equal(PLAYER_HP, 100);
    assert.equal(Number(strike.range) < 4, true);
  });

  it("kit Strike is 10-damage physical — it cannot substitute for the gauntlet", () => {
    assert.equal(Number(strike.damage), 10);
    assert.equal(strike.isPhysical, true);
    assert.equal(PLAYER_HP, 100);
    const playerAfterLiveStrike = PLAYER_HP - STRIKE_DAMAGE;
    assert.equal(playerAfterLiveStrike, 90);
    assert.equal(
      ghostCountAfterFinalPawnDecide({
        decidedAbility: wxFinalPawnGhostDecide(triggerKit()).ability,
      }),
      0,
      "player HP tax leaves zero ghosts on the board",
    );
  });

  it("non-finite HP fail-closed and does not mint ghosts", () => {
    assert.equal(
      isFinalPawnGhostTurn({
        bossId: FINAL_PAWN_ID,
        bossHp: Number.NaN,
        bossMaxHp: FINAL_PAWN_HP,
      }),
      false,
    );
    const next = resolveFinalPawnGhostDecide({
      ...triggerKit(),
      bossHp: Number.POSITIVE_INFINITY,
    });
    assert.equal(next.ability, undefined);
    assert.equal(
      ghostCountAfterFinalPawnDecide({ decidedAbility: next.ability }),
      0,
    );
  });
});

describe("production still decides kit first and still writes king spawns", () => {
  it("decideFinalPawnAction still returns kit before invincible before Ghost", () => {
    const src = readFileSync(
      join(dirname(fileURLToPath(import.meta.url)), "../hooks/useBossAI.ts"),
      "utf8",
    );
    const start = src.indexOf("// ── 12. Final Pawn");
    const end = src.indexOf("// ── 13. Alabaster Fortress");
    assert.ok(start >= 0 && end > start, "Final Pawn decide is present");
    const body = src.slice(start, end);
    const kitIdx = body.indexOf("pickBossKitSpell");
    const invincIdx = body.indexOf("BossAbility.INVINCIBLE_PHASE");
    const ghostIdx = body.indexOf("BossAbility.GHOST_SUMMON");
    assert.ok(kitIdx >= 0, "kit pick is present");
    assert.ok(invincIdx >= 0, "INVINCIBLE_PHASE is present");
    assert.ok(ghostIdx >= 0, "GHOST_SUMMON is present");
    assert.ok(kitIdx < invincIdx, "kit still wins the 10% ghost turn");
    assert.ok(
      invincIdx < ghostIdx || body.includes("INVINCIBLE_PHASE"),
      "invincible still bundles with ghost",
    );
    assert.ok(body.includes('type: "spell"'));
    assert.ok(body.includes("boss.hp / boss.maxHp <= 0.1"));
    assert.equal(body.includes("resolveFinalPawnGhostDecide"), false);
    assert.equal(body.includes("wxFinalPawnKitBlocksGhost"), false);
    assert.equal(body.includes("resolveGhostSummonCommittedHp"), false);
  });

  it("applyGhostSummon still writes advertised 1 HP kings", () => {
    const src = readFileSync(
      join(
        dirname(fileURLToPath(import.meta.url)),
        "../hooks/useBossSystem.ts",
      ),
      "utf8",
    );
    const body = src.slice(
      src.indexOf("function applyGhostSummon"),
      src.indexOf("// ── New ability handlers for bosses 13–20"),
    );
    assert.ok(body.includes("hp: 1"));
    assert.ok(body.includes("maxHp: 1"));
    assert.ok(body.includes('pieceType: "king"'));
    assert.ok(body.includes(GHOST_SUMMON_LOG_NEEDLE));
    assert.equal(body.includes("resolveFinalPawnGhostDecide"), false);
    const invinc = src.slice(
      src.indexOf("function applyInvinciblePhase"),
      src.indexOf("function applyGhostSummon"),
    );
    assert.ok(invinc.includes(INVINCIBLE_LOG_NEEDLE));
    assert.ok(invinc.includes("invincibleTurnsLeft: 5"));
  });

  it("WorldExploration still commits spawns but never decides Final Pawn ghost", () => {
    const wx = readFileSync(
      join(
        dirname(fileURLToPath(import.meta.url)),
        "../components/WorldExploration.tsx",
      ),
      "utf8",
    );
    const start = wx.indexOf("if (res?.spawns && res.spawns.length > 0)");
    assert.ok(start >= 0, "live spawn commit is present");
    const body = wx.slice(start, start + 160);
    assert.ok(body.includes("res.spawns.map"));
    assert.equal(wx.includes("resolveFinalPawnGhostDecide"), false);
    assert.equal(wx.includes("wxFinalPawnKitBlocksGhost"), false);
    assert.ok(wx.includes("n[m.id] = 20"), "HP stamp leftover of #1220 stays");
  });

  it("final_pawn still advertises GHOST_SUMMON + INVINCIBLE in phase 2", () => {
    const src = readFileSync(
      join(dirname(fileURLToPath(import.meta.url)), "../types/bossDefaults.ts"),
      "utf8",
    );
    const pawn = src.slice(src.indexOf('id: "final_pawn"'));
    const nextBoss = pawn.indexOf('id: "alabaster_fortress"');
    const body = nextBoss >= 0 ? pawn.slice(0, nextBoss) : pawn;
    const p1 = body.slice(body.indexOf("phase1:"), body.indexOf("phase2:"));
    const p2 = body.slice(body.indexOf("phase2:"));
    assert.equal(p1.includes("BossAbility.GHOST_SUMMON"), false);
    assert.ok(p2.includes("BossAbility.GHOST_SUMMON"));
    assert.ok(p2.includes("BossAbility.INVINCIBLE_PHASE"));
    assert.ok(body.includes("summonCount: 11"));
    assert.ok(body.includes("hp: 600"));
    assert.equal(FINAL_PAWN_ID, "final_pawn");
    assert.equal(INVINCIBLE_PHASE_ABILITY, "INVINCIBLE_PHASE");
  });

  it("Boss Guide still advertises temporary ghost kings, not kit Strike", () => {
    const src = readFileSync(
      join(
        dirname(fileURLToPath(import.meta.url)),
        "../components/BossGuideModal.tsx",
      ),
      "utf8",
    );
    const start = src.indexOf(GHOST_SUMMON_GUIDE_NEEDLE);
    assert.ok(start >= 0, "GHOST_SUMMON guide copy is present");
    const lineEnd = src.indexOf("\n", start);
    const body = src.slice(start, lineEnd >= 0 ? lineEnd : start + 160);
    assert.ok(body.includes("ghosts are temporary"));
    assert.equal(body.includes("physical_attack"), false);
  });
});
