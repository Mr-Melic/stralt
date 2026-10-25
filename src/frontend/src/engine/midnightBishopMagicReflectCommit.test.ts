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
  MAGIC_REFLECT_ABILITY,
  MAGIC_REFLECT_FACTOR,
  MERGE_BISHOPS_ABILITY,
  MERGE_BISHOPS_LOG_NEEDLE,
  MIDNIGHT_BISHOP_ID,
  MIDNIGHT_BISHOP_PHASE1_KIT_FIRST_ID,
  MIDNIGHT_BISHOP_PHASE2_KIT_FIRST_ID,
  playerHpAfterMagicReflect,
  resolveBossMagicReflect,
  resolveMidnightBishopPhase2Decide,
  wxBossMagicReflectCommitWithoutFlag,
  wxBossMagicReflectDroppedHit,
  wxMidnightBishopKitBlocksMerge,
  wxMidnightBishopPhase2Decide,
} from "./midnightBishopMagicReflectCommit.ts";

const LEVEL_1_MAX_HP = 100;
const VOID_MIRROR_PRE_CRIT = 20;
const REFLECT_SHIELD_FINAL = 20;

const frostBolt = starterSpells.find((s) => s.id === "starter-frost");
const strike = starterSpells.find((s) => s.id === "physical_attack");
const kitMirror = starterSpells.find((s) => s.id === "spell-mirror");
const cursedWound = starterSpells.find((s) => s.id === "spell-cursed-wound");

assert.ok(frostBolt, "starter-frost");
assert.ok(strike, "physical_attack");
assert.ok(kitMirror, "spell-mirror");
assert.ok(cursedWound, "spell-cursed-wound");

const FROST_BOLT_DAMAGE = Number(frostBolt.damage);
const STRIKE_DAMAGE = Number(strike.damage);

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

function phase2UnmergedKit() {
  return {
    currentPhase: 2 as const,
    bishopsMerged: false,
    kitSpellId: MIDNIGHT_BISHOP_PHASE2_KIT_FIRST_ID,
  };
}

describe("wxMidnightBishopKitBlocksMerge (live leftover A)", () => {
  it("phase-2 first-id Mirror is decided instead of MERGE_BISHOPS", () => {
    const opts = phase2UnmergedKit();
    const live = wxMidnightBishopPhase2Decide(opts);
    assert.equal(live.type, "spell");
    assert.equal(live.spellId, MIDNIGHT_BISHOP_PHASE2_KIT_FIRST_ID);
    assert.equal(live.ability, undefined);
    assert.equal(wxMidnightBishopKitBlocksMerge(opts), true);
  });

  it("empty kit still reaches MERGE — the leftover is first-id, not an empty pool", () => {
    const opts = {
      currentPhase: 2 as const,
      bishopsMerged: false,
      kitSpellId: null,
    };
    const live = wxMidnightBishopPhase2Decide(opts);
    assert.equal(live.type, "merge");
    assert.equal(live.ability, MERGE_BISHOPS_ABILITY);
    assert.equal(wxMidnightBishopKitBlocksMerge(opts), false);
  });

  it("phase 1 Cursed Wound still blocks TWIN_FLANK — do not steal that class", () => {
    const live = wxMidnightBishopPhase2Decide({
      currentPhase: 1,
      bishopsMerged: false,
      kitSpellId: MIDNIGHT_BISHOP_PHASE1_KIT_FIRST_ID,
    });
    const next = resolveMidnightBishopPhase2Decide({
      currentPhase: 1,
      bishopsMerged: false,
      kitSpellId: MIDNIGHT_BISHOP_PHASE1_KIT_FIRST_ID,
    });
    assert.equal(live.type, "spell");
    assert.equal(live.spellId, MIDNIGHT_BISHOP_PHASE1_KIT_FIRST_ID);
    assert.equal(next.type, "spell");
    assert.equal(next.spellId, MIDNIGHT_BISHOP_PHASE1_KIT_FIRST_ID);
  });
});

describe("resolveMidnightBishopPhase2Decide", () => {
  it("unmerged phase 2 prefers MERGE_BISHOPS over kit Mirror", () => {
    const opts = phase2UnmergedKit();
    const next = resolveMidnightBishopPhase2Decide(opts);
    assert.equal(next.type, "merge");
    assert.equal(next.ability, MERGE_BISHOPS_ABILITY);
    assert.equal(next.spellId, undefined);
  });

  it("after merge, kit Mirror still wins — #852 leftover", () => {
    const next = resolveMidnightBishopPhase2Decide({
      currentPhase: 2,
      bishopsMerged: true,
      kitSpellId: MIDNIGHT_BISHOP_PHASE2_KIT_FIRST_ID,
    });
    assert.equal(next.type, "spell");
    assert.equal(next.spellId, MIDNIGHT_BISHOP_PHASE2_KIT_FIRST_ID);
    assert.equal(
      wxMidnightBishopKitBlocksMerge({
        currentPhase: 2,
        bishopsMerged: true,
        kitSpellId: MIDNIGHT_BISHOP_PHASE2_KIT_FIRST_ID,
      }),
      false,
    );
  });

  it("catalog phase-2 first id is Mirror, not Frost Nova", () => {
    const kits = readFileSync(
      join(dirname(fileURLToPath(import.meta.url)), "../data/bossKits.ts"),
      "utf8",
    );
    const bishop = kits.slice(
      kits.indexOf("midnight_bishop: {"),
      kits.indexOf("broodmother_rook: {"),
    );
    assert.ok(bishop.includes(`"${MIDNIGHT_BISHOP_PHASE2_KIT_FIRST_ID}"`));
    assert.ok(
      bishop.includes(
        `phase1SpellIds: ["${MIDNIGHT_BISHOP_PHASE1_KIT_FIRST_ID}"`,
      ),
    );
    const p2 = bishop.slice(bishop.indexOf("phase2SpellIds:"));
    assert.ok(p2.startsWith("phase2SpellIds:"));
    assert.equal(p2.includes(`"${MIDNIGHT_BISHOP_PHASE2_KIT_FIRST_ID}"`), true);
    assert.ok(
      p2.indexOf(`"${MIDNIGHT_BISHOP_PHASE2_KIT_FIRST_ID}"`) <
        p2.indexOf("spell-frost-nova"),
    );
    assert.equal(kitMirror.isMirror, true);
    assert.equal(Number(kitMirror.damage), 0);
  });
});

describe("wxBossMagicReflectCommitWithoutFlag (live leftover B)", () => {
  it("Frost Bolt 20 reflects 0 while the merge flag is on", () => {
    const hit = {
      magicReflectActive: true,
      isPhysical: false,
      incomingDamage: FROST_BOLT_DAMAGE,
    };
    assert.equal(wxBossMagicReflectCommitWithoutFlag(hit), 0);
    assert.equal(wxBossMagicReflectDroppedHit(hit), true);
    assert.equal(
      playerHpAfterMagicReflect({
        hp: LEVEL_1_MAX_HP,
        reflected: wxBossMagicReflectCommitWithoutFlag(hit),
      }),
      LEVEL_1_MAX_HP,
    );
  });

  it("does not steal Void Mirror 25% of preCrit", () => {
    const hit = {
      magicReflectActive: false,
      isPhysical: false,
      incomingDamage: VOID_MIRROR_PRE_CRIT,
      family: "void_mirror",
    };
    assert.equal(wxBossMagicReflectCommitWithoutFlag(hit), 0);
    assert.equal(resolveBossMagicReflect(hit), 0);
    assert.equal(Math.floor(VOID_MIRROR_PRE_CRIT * 0.25), 5);
  });

  it("does not steal Countess Reflect Shield 30% of finalDmg", () => {
    const hit = {
      magicReflectActive: false,
      isPhysical: false,
      incomingDamage: REFLECT_SHIELD_FINAL,
      reflectShieldActive: true,
    };
    assert.equal(resolveBossMagicReflect(hit), 0);
    assert.equal(Math.floor(REFLECT_SHIELD_FINAL * 0.3), 6);
  });
});

describe("resolveBossMagicReflect", () => {
  it("honours 100% of Frost Bolt 20 so the player drops to 80", () => {
    const reflected = resolveBossMagicReflect({
      magicReflectActive: true,
      isPhysical: frostBolt.isPhysical === true,
      incomingDamage: FROST_BOLT_DAMAGE,
    });
    assert.equal(FROST_BOLT_DAMAGE, 20);
    assert.equal(frostBolt.isPhysical, undefined);
    assert.equal(reflected, 20);
    assert.equal(MAGIC_REFLECT_FACTOR, 1.0);
    assert.equal(
      playerHpAfterMagicReflect({ hp: LEVEL_1_MAX_HP, reflected }),
      80,
    );
  });

  it("Strike stays the advertised counterplay — 0 reflect", () => {
    assert.equal(strike.isPhysical, true);
    assert.equal(STRIKE_DAMAGE, 10);
    assert.equal(
      resolveBossMagicReflect({
        magicReflectActive: true,
        isPhysical: true,
        incomingDamage: STRIKE_DAMAGE,
      }),
      0,
    );
    assert.equal(
      wxBossMagicReflectDroppedHit({
        magicReflectActive: true,
        isPhysical: true,
        incomingDamage: STRIKE_DAMAGE,
      }),
      false,
    );
  });

  it("flag off / empty / non-finite incoming fail-closed", () => {
    assert.equal(
      resolveBossMagicReflect({
        magicReflectActive: false,
        isPhysical: false,
        incomingDamage: FROST_BOLT_DAMAGE,
      }),
      0,
    );
    assert.equal(
      resolveBossMagicReflect({
        magicReflectActive: true,
        isPhysical: false,
        incomingDamage: 0,
      }),
      0,
    );
    assert.equal(
      resolveBossMagicReflect({
        magicReflectActive: true,
        isPhysical: false,
        incomingDamage: Number.NaN,
      }),
      0,
    );
  });

  it("floors the production applyMagicReflect formula", () => {
    assert.equal(
      resolveBossMagicReflect({
        magicReflectActive: true,
        isPhysical: false,
        incomingDamage: 20.9,
      }),
      20,
    );
  });

  it("Inferno DoT is not this applyDamageToEnemy path", () => {
    const inferno = starterSpells.find((s) => s.id === "spell-inferno");
    assert.ok(inferno);
    assert.equal(inferno.effectType, "dot");
    assert.equal(Number(inferno.damage), 0);
    assert.equal(
      resolveBossMagicReflect({
        magicReflectActive: true,
        isPhysical: false,
        incomingDamage: Number(inferno.damage),
      }),
      0,
    );
  });
});

describe("challenge prices stay on the Untouchable miss", () => {
  it("live 0 reflect keeps Untouchable; 20 reflect fails it", () => {
    assert.equal(UNTOUCHABLE.rewards.doka, 500);
    assert.equal(
      isChallengeCompleted(UNTOUCHABLE, challengeProgress({ totalDamage: 0 })),
      true,
    );
    assert.equal(
      isChallengeCompleted(
        UNTOUCHABLE,
        challengeProgress({ totalDamage: FROST_BOLT_DAMAGE }),
      ),
      false,
    );
  });
});

describe("production still decides kit first and never reads the flag", () => {
  it("decideMidnightBishopAction still returns kit before MERGE_BISHOPS", () => {
    const src = readFileSync(
      join(dirname(fileURLToPath(import.meta.url)), "../hooks/useBossAI.ts"),
      "utf8",
    );
    const start = src.indexOf("// ── 9. Midnight Bishop");
    const end = src.indexOf("// ── 10. Broodmother Rook");
    assert.ok(start >= 0 && end > start, "Midnight Bishop decide is present");
    const body = src.slice(start, end);
    const kitIdx = body.indexOf("pickBossKitSpell");
    const mergeIdx = body.indexOf("BossAbility.MERGE_BISHOPS");
    assert.ok(kitIdx >= 0, "kit pick is present");
    assert.ok(mergeIdx >= 0, "MERGE_BISHOPS is present");
    assert.ok(kitIdx < mergeIdx, "kit still wins the merge turn");
    assert.equal(body.includes("BossAbility.MAGIC_REFLECT"), false);
    assert.ok(body.includes('type: "spell"'));
  });

  it("applyMergeBishops still writes magicReflectActive and the merge log", () => {
    const src = readFileSync(
      join(
        dirname(fileURLToPath(import.meta.url)),
        "../hooks/useBossSystem.ts",
      ),
      "utf8",
    );
    const merge = src.slice(
      src.indexOf("function applyMergeBishops"),
      src.indexOf("function applyMagicReflect"),
    );
    assert.ok(merge.includes("bishopsMerged: true"));
    assert.ok(merge.includes("magicReflectActive: true"));
    assert.ok(merge.includes(MERGE_BISHOPS_LOG_NEEDLE));
    const reflect = src.slice(
      src.indexOf("function applyMagicReflect"),
      src.indexOf("function applyLarvaeSpawn"),
    );
    assert.ok(reflect.includes("incomingMagicDamage * 1.0"));
    assert.ok(reflect.includes("reflectedDamage"));
    assert.ok(src.includes(`case BossAbility.${MAGIC_REFLECT_ABILITY}`));
  });

  it("applyDamageToEnemy BossStateLike still omits magicReflectActive", () => {
    const src = readFileSync(
      join(dirname(fileURLToPath(import.meta.url)), "./castHelpers.ts"),
      "utf8",
    );
    const shape = src.slice(
      src.indexOf("interface BossStateLike"),
      src.indexOf("type HitTarget"),
    );
    assert.ok(shape.includes("reflectShieldActive"));
    assert.ok(shape.includes("shellArmorActive"));
    assert.equal(shape.includes("magicReflectActive"), false);
    assert.equal(src.includes("magicReflectActive"), false);
    assert.ok(src.includes('family === "void_mirror"'));
    assert.ok(src.includes("reflectShieldActive === true"));
  });

  it("WorldExploration still copies newBossState without a magic-reflect hit arm", () => {
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
    assert.ok(body.includes("...res.newBossState"));
    assert.equal(wx.includes("resolveBossMagicReflect"), false);
    assert.equal(wx.includes("magicReflectActive"), false);
  });

  it("midnight_bishop still advertises MERGE_BISHOPS and MAGIC_REFLECT in phase 2", () => {
    const src = readFileSync(
      join(dirname(fileURLToPath(import.meta.url)), "../types/bossDefaults.ts"),
      "utf8",
    );
    const bishop = src.slice(
      src.indexOf('id: "midnight_bishop"'),
      src.indexOf('id: "broodmother_rook"'),
    );
    assert.ok(bishop.includes("BossAbility.MERGE_BISHOPS"));
    assert.ok(bishop.includes("BossAbility.MAGIC_REFLECT"));
    assert.ok(bishop.includes("BossAbility.TWIN_FLANK"));
  });
});
