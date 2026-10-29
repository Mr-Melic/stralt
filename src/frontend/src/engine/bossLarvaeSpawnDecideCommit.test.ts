import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { starterSpells } from "../data/spellData.ts";
import { startingChampionStats } from "../utils/startingChampionStats.ts";
import { shouldAwardVictory } from "./battleSetup.ts";
import {
  BROODMOTHER_HP,
  BROODMOTHER_KIT_FIRST_ID,
  BROODMOTHER_LARVAE_DECIDE_ID,
  BROODMOTHER_STRIKE_DAMAGE,
  BROODMOTHER_STRIKE_SHELL_DAMAGE,
  ENTHRONED_VOID_PHASE1_KIT_FIRST_ID,
  FETID_ROOK_KIT_FIRST_ID,
  FINAL_PAWN_KIT_FIRST_ID,
  GHOST_SUMMON_ABILITY,
  LARVAE_EXPLODE_DECIDE_ABILITY,
  LARVAE_SPAWN_ADVERTISED_COUNT,
  LARVAE_SPAWN_ADVERTISED_HP,
  LARVAE_SPAWN_DECIDE_ABILITY,
  LARVAE_SPAWN_GUIDE_NEEDLE,
  LARVAE_SPAWN_LOG_NEEDLE,
  LARVAE_SPAWN_REGISTER_NEEDLE,
  PALE_ARCHIVIST_PHASE2_KIT_FIRST_ID,
  PHANTOM_SPAWN_ABILITY,
  SCROLL_SUMMON_ABILITY,
  SHELL_ARMOR_DECIDE_ABILITY,
  SPLIT_ROOKS_DECIDE_ABILITY,
  broodmotherAdvertisedShellStrike,
  isBroodmotherLarvaeSpawnTurn,
  larvaCountAfterBroodmotherDecide,
  liveWxCommitsBroodmotherLarvaeSpawn,
  resolveBroodmotherLarvaeDecide,
  wxAppliesBroodmotherLarvaeNewBossState,
  wxAppliesBroodmotherNewLarvaeAsCombatants,
  wxBroodmotherKitBlocksLarvaeSpawn,
  wxBroodmotherLarvaeDecide,
} from "./bossLarvaeSpawnDecideCommit.ts";

const strike = starterSpells.find((s) => s.id === "physical_attack");
const kitArcher = starterSpells.find((s) => s.id === "summon-archer");
const kitVenom = starterSpells.find((s) => s.id === "spell-venom-strike");
const kitSwap = starterSpells.find((s) => s.id === "spell-swap");
const kitMark = starterSpells.find((s) => s.id === "spell-mark");

assert.ok(strike, "physical_attack");
assert.ok(kitArcher, "summon-archer");
assert.ok(kitVenom, "spell-venom-strike");
assert.ok(kitSwap, "spell-swap");
assert.ok(kitMark, "spell-mark");

const PLAYER_HP = Number(startingChampionStats().hp);
const STRIKE_DAMAGE = Number(strike.damage);

function here(): string {
  return dirname(fileURLToPath(import.meta.url));
}

function oddPhase2Kit() {
  return {
    bossId: BROODMOTHER_LARVAE_DECIDE_ID,
    currentPhase: 2 as const,
    currentTurn: 3,
    kitSpellId: BROODMOTHER_KIT_FIRST_ID,
  };
}

function evenPhase2Kit() {
  return {
    ...oddPhase2Kit(),
    currentTurn: 4,
  };
}

describe("wxBroodmotherKitBlocksLarvaeSpawn (live leftover)", () => {
  it("phase-2 odd first-id Archer is decided instead of LARVAE_SPAWN", () => {
    const opts = oddPhase2Kit();
    const live = wxBroodmotherLarvaeDecide(opts);
    assert.equal(live.type, "spell");
    assert.equal(live.spellId, BROODMOTHER_KIT_FIRST_ID);
    assert.equal(live.ability, undefined);
    assert.equal(wxBroodmotherKitBlocksLarvaeSpawn(opts), true);
    assert.equal(isBroodmotherLarvaeSpawnTurn(opts), true);
    assert.equal(liveWxCommitsBroodmotherLarvaeSpawn(), false);
    assert.equal(wxAppliesBroodmotherLarvaeNewBossState(), true);
    assert.equal(wxAppliesBroodmotherNewLarvaeAsCombatants(), false);
  });

  it("phase-2 even extra spawn is also kit-blocked", () => {
    const opts = evenPhase2Kit();
    const live = wxBroodmotherLarvaeDecide(opts);
    assert.equal(live.type, "spell");
    assert.equal(live.spellId, BROODMOTHER_KIT_FIRST_ID);
    assert.equal(wxBroodmotherKitBlocksLarvaeSpawn(opts), true);
    assert.equal(isBroodmotherLarvaeSpawnTurn(opts), true);
  });

  it("empty kit still reaches Spawn — the leftover is first-id, not an empty pool", () => {
    const opts = {
      ...oddPhase2Kit(),
      kitSpellId: null,
    };
    const live = wxBroodmotherLarvaeDecide(opts);
    assert.equal(live.type, "ability");
    assert.equal(live.ability, LARVAE_SPAWN_DECIDE_ABILITY);
    assert.equal(wxBroodmotherKitBlocksLarvaeSpawn(opts), false);
  });

  it("phase-1 even still lets kit Archer win — not a spawn turn", () => {
    const opts = {
      ...oddPhase2Kit(),
      currentPhase: 1 as const,
      currentTurn: 2,
    };
    const live = wxBroodmotherLarvaeDecide(opts);
    const next = resolveBroodmotherLarvaeDecide(opts);
    assert.equal(isBroodmotherLarvaeSpawnTurn(opts), false);
    assert.equal(live.type, "spell");
    assert.equal(next.type, "spell");
    assert.equal(next.spellId, BROODMOTHER_KIT_FIRST_ID);
    assert.equal(wxBroodmotherKitBlocksLarvaeSpawn(opts), false);
    assert.notEqual(next.ability, LARVAE_SPAWN_DECIDE_ABILITY);
    assert.notEqual(next.ability, SHELL_ARMOR_DECIDE_ABILITY);
  });

  it("Fetid Rook still lets kit Venom win — SPLIT leftover of #1261", () => {
    const opts = {
      bossId: "fetid_rook",
      currentPhase: 2 as const,
      currentTurn: 3,
      kitSpellId: FETID_ROOK_KIT_FIRST_ID,
    };
    const live = wxBroodmotherLarvaeDecide(opts);
    const next = resolveBroodmotherLarvaeDecide(opts);
    assert.equal(isBroodmotherLarvaeSpawnTurn(opts), false);
    assert.equal(live.type, "spell");
    assert.equal(next.type, "spell");
    assert.equal(next.spellId, FETID_ROOK_KIT_FIRST_ID);
    assert.equal(wxBroodmotherKitBlocksLarvaeSpawn(opts), false);
    assert.notEqual(next.ability, SPLIT_ROOKS_DECIDE_ABILITY);
    assert.notEqual(next.ability, LARVAE_SPAWN_DECIDE_ABILITY);
  });
});

describe("resolveBroodmotherLarvaeDecide", () => {
  it("odd and phase-2 even prefer LARVAE_SPAWN over kit Archer", () => {
    const odd = resolveBroodmotherLarvaeDecide(oddPhase2Kit());
    assert.equal(odd.type, "ability");
    assert.equal(odd.ability, LARVAE_SPAWN_DECIDE_ABILITY);
    assert.equal(odd.spellId, undefined);

    const even = resolveBroodmotherLarvaeDecide(evenPhase2Kit());
    assert.equal(even.type, "ability");
    assert.equal(even.ability, LARVAE_SPAWN_DECIDE_ABILITY);
  });

  it("catalog first id is Archer, not Venom, Strike, Swap, or Mark", () => {
    const kits = readFileSync(join(here(), "../data/bossKits.ts"), "utf8");
    const brood = kits.slice(
      kits.indexOf("broodmother_rook: {"),
      kits.indexOf("lord_of_static: {"),
    );
    assert.ok(brood.includes(`"${BROODMOTHER_KIT_FIRST_ID}"`));
    const p1 = brood.slice(brood.indexOf("phase1SpellIds:"));
    assert.ok(p1.includes(`"${BROODMOTHER_KIT_FIRST_ID}"`));
    assert.equal(kitArcher.id, BROODMOTHER_KIT_FIRST_ID);
    assert.equal(Number(kitArcher.damage), 0);
    assert.equal(kitArcher.isSummon, true);
    assert.equal(kitArcher.summonUnitDef?.hpScale, 0.7);
    assert.equal(kitArcher.summonLifespan, 4);
    assert.equal(strike.id, FINAL_PAWN_KIT_FIRST_ID);
    assert.equal(kitVenom.id, FETID_ROOK_KIT_FIRST_ID);
    assert.equal(kitSwap.id, ENTHRONED_VOID_PHASE1_KIT_FIRST_ID);
    assert.equal(kitMark.id, PALE_ARCHIVIST_PHASE2_KIT_FIRST_ID);
  });

  it("does not steal Fetid Split, Ghost, Phantom, Scroll, or explode", () => {
    const next = resolveBroodmotherLarvaeDecide(oddPhase2Kit());
    assert.equal(next.ability, LARVAE_SPAWN_DECIDE_ABILITY);
    assert.notEqual(next.ability, SPLIT_ROOKS_DECIDE_ABILITY);
    assert.notEqual(next.ability, GHOST_SUMMON_ABILITY);
    assert.notEqual(next.ability, PHANTOM_SPAWN_ABILITY);
    assert.notEqual(next.ability, SCROLL_SUMMON_ABILITY);
    assert.notEqual(next.ability, LARVAE_EXPLODE_DECIDE_ABILITY);
    assert.notEqual(next.ability, SHELL_ARMOR_DECIDE_ABILITY);
  });

  it("non-Broodmother bossId fail-closed", () => {
    const pawn = resolveBroodmotherLarvaeDecide({
      bossId: "final_pawn",
      currentPhase: 2,
      currentTurn: 3,
      kitSpellId: BROODMOTHER_KIT_FIRST_ID,
    });
    assert.equal(pawn.type, "spell");
    assert.equal(pawn.spellId, BROODMOTHER_KIT_FIRST_ID);
    assert.equal(
      isBroodmotherLarvaeSpawnTurn({
        bossId: "final_pawn",
        currentPhase: 2,
        currentTurn: 3,
      }),
      false,
    );
  });
});

describe("player-visible leftover larvae never start Shell Armor", () => {
  it("live kit Archer keeps zero larvae so Strike 10 never halves", () => {
    const live = wxBroodmotherLarvaeDecide(oddPhase2Kit());
    assert.equal(live.type, "spell");
    assert.equal(Number(kitArcher.damage), 0);
    assert.equal(kitArcher.isSummon, true);
    assert.equal(
      larvaCountAfterBroodmotherDecide({ decidedAbility: live.ability }),
      0,
    );
    assert.equal(
      broodmotherAdvertisedShellStrike({
        strikeDamage: BROODMOTHER_STRIKE_DAMAGE,
        larvaeCount: 0,
        shellArmorActive: false,
      }),
      BROODMOTHER_STRIKE_DAMAGE,
    );
    assert.equal(
      shouldAwardVictory({
        inBattle: true,
        deathTriggered: false,
        battleStartIdsSize: 1,
        hostilesRemaining: 0,
      }),
      true,
      "live leftover has a dead rook and zero larva combatants",
    );
  });

  it("advertised spawn writes a 1 HP marker; shell halves Strike 10 to 5", () => {
    const next = resolveBroodmotherLarvaeDecide(oddPhase2Kit());
    assert.equal(next.ability, LARVAE_SPAWN_DECIDE_ABILITY);
    assert.equal(
      larvaCountAfterBroodmotherDecide({ decidedAbility: next.ability }),
      LARVAE_SPAWN_ADVERTISED_COUNT,
    );
    assert.equal(LARVAE_SPAWN_ADVERTISED_HP, 1);
    assert.equal(BROODMOTHER_HP, 480);
    assert.equal(PLAYER_HP, 100);
    assert.equal(STRIKE_DAMAGE, BROODMOTHER_STRIKE_DAMAGE);
    assert.equal(
      broodmotherAdvertisedShellStrike({
        strikeDamage: STRIKE_DAMAGE,
        larvaeCount: LARVAE_SPAWN_ADVERTISED_COUNT,
        shellArmorActive: true,
      }),
      BROODMOTHER_STRIKE_SHELL_DAMAGE,
    );
    assert.equal(
      broodmotherAdvertisedShellStrike({
        strikeDamage: STRIKE_DAMAGE,
        larvaeCount: LARVAE_SPAWN_ADVERTISED_COUNT,
        shellArmorActive: false,
      }),
      BROODMOTHER_STRIKE_DAMAGE,
      "first-spawn shellArmorActive leftover stays unrestored",
    );
  });

  it("kit Archer is 0-damage summon — it cannot substitute for a larva marker", () => {
    assert.equal(Number(kitArcher.damage), 0);
    assert.equal(kitArcher.isSummon, true);
    assert.equal(kitArcher.effectType, "summon");
    assert.equal(PLAYER_HP, 100);
    assert.equal(
      larvaCountAfterBroodmotherDecide({
        decidedAbility: wxBroodmotherLarvaeDecide(oddPhase2Kit()).ability,
      }),
      0,
      "Archer flood leftover of #1269 is not a 1 HP larva marker",
    );
    assert.notEqual(kitArcher.summonLifespan, LARVAE_SPAWN_ADVERTISED_HP);
  });
});

describe("production still decides kit first and still writes larva markers", () => {
  it("decideBroodmotherRookAction still returns kit before Spawn before Shell", () => {
    const src = readFileSync(join(here(), "../hooks/useBossAI.ts"), "utf8");
    const start = src.indexOf("// ── 10. Broodmother Rook");
    const end = src.indexOf("// ── 11. Lord of Static");
    assert.ok(start >= 0 && end > start, "Broodmother decide is present");
    const body = src.slice(start, end);
    const kitIdx = body.indexOf("pickBossKitSpell");
    const spawnIdx = body.indexOf("BossAbility.LARVAE_SPAWN");
    const shellIdx = body.indexOf("BossAbility.SHELL_ARMOR");
    assert.ok(kitIdx >= 0, "kit pick is present");
    assert.ok(spawnIdx >= 0, "LARVAE_SPAWN is present");
    assert.ok(shellIdx >= 0, "SHELL_ARMOR is present");
    assert.ok(kitIdx < spawnIdx, "kit still wins the spawn turn");
    assert.ok(body.includes("new Map<string, number>()"));
    assert.ok(body.includes('type: "spell"'));
    assert.ok(body.includes("bossState.currentPhase === 2"));
    assert.ok(body.includes("currentTurn % 2 === 0"));
    assert.ok(body.includes("currentTurn % 2 === 1"));
    assert.ok(body.includes("handled on player movement side"));
    assert.equal(body.includes("resolveBroodmotherLarvaeDecide"), false);
    assert.equal(body.includes("wxBroodmotherKitBlocksLarvaeSpawn"), false);
    assert.equal(body.includes("BossAbility.LARVAE_EXPLODE"), false);
  });

  it("applyLarvaeSpawn still writes advertised 1 HP markers", () => {
    const src = readFileSync(join(here(), "../hooks/useBossSystem.ts"), "utf8");
    const body = src.slice(
      src.indexOf("function applyLarvaeSpawn"),
      src.indexOf("function applyShellArmor"),
    );
    assert.ok(body.includes("larva_"));
    assert.ok(body.includes("hp: 1"));
    assert.ok(body.includes("newLarvae: [larva]"));
    assert.ok(body.includes("larvae: [...params.bossState.larvae, larva]"));
    assert.ok(body.includes(LARVAE_SPAWN_LOG_NEEDLE));
    assert.ok(body.includes("getAdjacentTiles"));
    assert.equal(body.includes("resolveBroodmotherLarvaeDecide"), false);
    assert.ok(src.includes("case BossAbility.LARVAE_SPAWN:"));
  });

  it("WorldExploration still merges newBossState but never newLarvae combatants", () => {
    const wx = readFileSync(
      join(here(), "../components/WorldExploration.tsx"),
      "utf8",
    );
    const start = wx.indexOf("if (res?.newBossState)");
    assert.ok(start >= 0, "live newBossState merge is present");
    assert.ok(wx.includes("...res.newBossState"));
    assert.equal(wx.includes("res.newLarvae"), false);
    assert.equal(wx.includes("resolveBroodmotherLarvaeDecide"), false);
    assert.equal(wx.includes("wxBroodmotherKitBlocksLarvaeSpawn"), false);
    assert.equal(
      wx.includes("larvae"),
      false,
      "WX still never reads bossState.larvae — explode leftover of #1217",
    );
  });

  it("broodmother_rook still advertises LARVAE_SPAWN in both phases", () => {
    const src = readFileSync(join(here(), "../types/bossDefaults.ts"), "utf8");
    const brood = src.slice(
      src.indexOf('id: "broodmother_rook"'),
      src.indexOf('id: "lord_of_static"'),
    );
    const p1 = brood.slice(brood.indexOf("phase1:"), brood.indexOf("phase2:"));
    const p2 = brood.slice(brood.indexOf("phase2:"));
    assert.ok(p1.includes("BossAbility.LARVAE_SPAWN"));
    assert.ok(p1.includes("BossAbility.SHELL_ARMOR"));
    assert.ok(p2.includes("BossAbility.LARVAE_SPAWN"));
    assert.ok(p2.includes("BossAbility.LARVAE_EXPLODE"));
    assert.ok(brood.includes("hp: 480"));
    assert.equal(BROODMOTHER_LARVAE_DECIDE_ID, "broodmother_rook");
    assert.ok(
      p2.includes("hpThreshold: 0.0"),
      "phase-gate leftover stays unrestored",
    );
  });

  it("Boss Guide and Enemy Register still advertise larva cadence, not kit Archer", () => {
    const guide = readFileSync(
      join(here(), "../components/BossGuideModal.tsx"),
      "utf8",
    );
    const gStart = guide.indexOf(LARVAE_SPAWN_GUIDE_NEEDLE);
    assert.ok(gStart >= 0, "LARVAE_SPAWN guide copy is present");
    const gLine = guide.slice(gStart, gStart + 160);
    assert.ok(gLine.includes("explode on contact"));
    assert.equal(gLine.includes("summon-archer"), false);

    const register = readFileSync(
      join(here(), "../components/EnemyRegister.tsx"),
      "utf8",
    );
    assert.ok(register.includes(LARVAE_SPAWN_REGISTER_NEEDLE));
    const rSlice = register.slice(
      register.indexOf("Broodmother Rook"),
      register.indexOf("Lord of Static"),
    );
    assert.ok(rSlice.includes("prevent Broodmother being shielded"));
    assert.equal(rSlice.includes("summon-archer"), false);
  });

  it("castHelpers Shell Armor still requires larvae.length AND the flag", () => {
    const cast = readFileSync(join(here(), "./castHelpers.ts"), "utf8");
    assert.ok(cast.includes("shellArmorActive === true"));
    assert.ok(cast.includes("larvae?.length ?? 0) > 0"));
    assert.ok(cast.includes("Math.max(1, Math.floor(finalDmg / 2))"));
    assert.equal(cast.includes("resolveBroodmotherLarvaeDecide"), false);
    assert.equal(cast.includes("Larva Venom"), false);
  });
});
