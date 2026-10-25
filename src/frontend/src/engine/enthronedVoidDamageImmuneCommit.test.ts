import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { starterSpells } from "../data/spellData.ts";
import {
  ANCHORS_TO_PHASE_2,
  ANCHOR_SPAWN_LOG_NEEDLE,
  ANCHOR_STEP_DAMAGE,
  ANCHOR_TILES_ABILITY,
  DAMAGE_IMMUNE_ABILITY,
  DAMAGE_IMMUNE_LOG_NEEDLE,
  ENTHRONED_VOID_ID,
  ENTHRONED_VOID_PHASE1_KIT_FIRST_ID,
  PHANTOM_SPAWN_ABILITY,
  bossHpAfterDirectHit,
  resolveEnthronedVoidAnchorStep,
  resolveEnthronedVoidDirectDamage,
  resolveEnthronedVoidEnemyTakesDamage,
  resolveEnthronedVoidPhase1Decide,
  wxEnemyTakesDamageFloor,
  wxEnthronedVoidAnchorStep,
  wxEnthronedVoidAnchorStepDropped,
  wxEnthronedVoidDirectDamage,
  wxEnthronedVoidDirectDamageDroppedHit,
  wxEnthronedVoidKitBlocksAnchor,
  wxEnthronedVoidPhase1Decide,
} from "./enthronedVoidDamageImmuneCommit.ts";

const ENTHRONED_VOID_HP = 280;
const VOID_MIRROR_PRE_CRIT = 20;
const REFLECT_SHIELD_FINAL = 20;
const GLYPH_TRAP_PLAYER_TAX = 15;

const frostBolt = starterSpells.find((s) => s.id === "starter-frost");
const strike = starterSpells.find((s) => s.id === "physical_attack");
const kitSwap = starterSpells.find((s) => s.id === "spell-swap");

assert.ok(frostBolt, "starter-frost");
assert.ok(strike, "physical_attack");
assert.ok(kitSwap, "spell-swap");

const FROST_BOLT_DAMAGE = Number(frostBolt.damage);
const STRIKE_DAMAGE = Number(strike.damage);

function phase1OddTurnKit() {
  return {
    currentPhase: 1 as const,
    currentTurn: 1,
    kitSpellId: ENTHRONED_VOID_PHASE1_KIT_FIRST_ID,
    anchorsDestroyed: 0,
  };
}

function liveAnchorGlyph() {
  return { x: 6, y: 8, turnsLeft: 2 };
}

describe("wxEnthronedVoidKitBlocksAnchor (live leftover A)", () => {
  it("phase-1 first-id Swap is decided instead of ANCHOR_TILES", () => {
    const opts = phase1OddTurnKit();
    const live = wxEnthronedVoidPhase1Decide(opts);
    assert.equal(live.type, "spell");
    assert.equal(live.spellId, ENTHRONED_VOID_PHASE1_KIT_FIRST_ID);
    assert.equal(live.ability, undefined);
    assert.equal(wxEnthronedVoidKitBlocksAnchor(opts), true);
  });

  it("empty kit still reaches ANCHOR — the leftover is first-id, not an empty pool", () => {
    const opts = {
      currentPhase: 1 as const,
      currentTurn: 1,
      kitSpellId: null,
      anchorsDestroyed: 0,
    };
    const live = wxEnthronedVoidPhase1Decide(opts);
    assert.equal(live.type, "ability");
    assert.equal(live.ability, ANCHOR_TILES_ABILITY);
    assert.equal(wxEnthronedVoidKitBlocksAnchor(opts), false);
  });

  it("even-turn PHANTOM_SPAWN stays kit-blocked — do not steal #711", () => {
    const opts = {
      currentPhase: 1 as const,
      currentTurn: 0,
      kitSpellId: ENTHRONED_VOID_PHASE1_KIT_FIRST_ID,
      anchorsDestroyed: 0,
    };
    const live = wxEnthronedVoidPhase1Decide(opts);
    const next = resolveEnthronedVoidPhase1Decide(opts);
    assert.equal(live.type, "spell");
    assert.equal(live.spellId, ENTHRONED_VOID_PHASE1_KIT_FIRST_ID);
    assert.equal(next.type, "spell");
    assert.equal(next.spellId, ENTHRONED_VOID_PHASE1_KIT_FIRST_ID);
    assert.equal(wxEnthronedVoidKitBlocksAnchor(opts), false);
  });
});

describe("resolveEnthronedVoidPhase1Decide", () => {
  it("odd-turn phase 1 prefers ANCHOR_TILES over kit Swap", () => {
    const opts = phase1OddTurnKit();
    const next = resolveEnthronedVoidPhase1Decide(opts);
    assert.equal(next.type, "ability");
    assert.equal(next.ability, ANCHOR_TILES_ABILITY);
    assert.equal(next.spellId, undefined);
  });

  it("after 8 anchors, kit Swap still wins — phase 2 leftover", () => {
    const next = resolveEnthronedVoidPhase1Decide({
      currentPhase: 2,
      currentTurn: 1,
      kitSpellId: ENTHRONED_VOID_PHASE1_KIT_FIRST_ID,
      anchorsDestroyed: ANCHORS_TO_PHASE_2,
    });
    assert.equal(next.type, "spell");
    assert.equal(next.spellId, ENTHRONED_VOID_PHASE1_KIT_FIRST_ID);
    assert.equal(
      wxEnthronedVoidKitBlocksAnchor({
        currentPhase: 2,
        currentTurn: 1,
        kitSpellId: ENTHRONED_VOID_PHASE1_KIT_FIRST_ID,
        anchorsDestroyed: ANCHORS_TO_PHASE_2,
      }),
      false,
    );
  });

  it("catalog phase-1 first id is Swap, not Frost Nova", () => {
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
    assert.equal(kitSwap.targetType, "enemy");
    assert.equal(Number(kitSwap.damage), 0);
  });
});

describe("wxEnthronedVoidDirectDamage (live leftover B)", () => {
  it("Frost Bolt 20 still debits boss HP while phase 1 immune is advertised", () => {
    const hit = {
      bossId: ENTHRONED_VOID_ID,
      currentPhase: 1 as const,
      incomingDamage: FROST_BOLT_DAMAGE,
      source: "direct" as const,
    };
    assert.equal(wxEnthronedVoidDirectDamage(hit), FROST_BOLT_DAMAGE);
    assert.equal(wxEnthronedVoidDirectDamageDroppedHit(hit), true);
    assert.equal(
      bossHpAfterDirectHit({
        hp: ENTHRONED_VOID_HP,
        damage: wxEnthronedVoidDirectDamage(hit),
      }),
      ENTHRONED_VOID_HP - FROST_BOLT_DAMAGE,
    );
  });

  it("Strike is also immune — do not steal #1058 physical counterplay", () => {
    assert.equal(strike.isPhysical, true);
    assert.equal(STRIKE_DAMAGE, 10);
    const hit = {
      bossId: ENTHRONED_VOID_ID,
      currentPhase: 1 as const,
      incomingDamage: STRIKE_DAMAGE,
      source: "direct" as const,
    };
    assert.equal(wxEnthronedVoidDirectDamage(hit), STRIKE_DAMAGE);
    assert.equal(resolveEnthronedVoidDirectDamage(hit), 0);
    assert.equal(wxEnthronedVoidDirectDamageDroppedHit(hit), true);
  });

  it("does not steal Void Mirror 25% of preCrit", () => {
    const hit = {
      bossId: "void_mirror_pack",
      currentPhase: 1 as const,
      incomingDamage: VOID_MIRROR_PRE_CRIT,
      family: "void_mirror",
    };
    assert.equal(wxEnthronedVoidDirectDamage(hit), VOID_MIRROR_PRE_CRIT);
    assert.equal(resolveEnthronedVoidDirectDamage(hit), VOID_MIRROR_PRE_CRIT);
    assert.equal(Math.floor(VOID_MIRROR_PRE_CRIT * 0.25), 5);
  });

  it("does not steal Countess Reflect Shield 30% of finalDmg or #1058 MAGIC_REFLECT", () => {
    const shield = {
      bossId: "pale_archbishop",
      incomingDamage: REFLECT_SHIELD_FINAL,
      reflectShieldActive: true,
    };
    assert.equal(
      resolveEnthronedVoidDirectDamage(shield),
      REFLECT_SHIELD_FINAL,
    );
    assert.equal(Math.floor(REFLECT_SHIELD_FINAL * 0.3), 6);
    const bishop = {
      bossId: "midnight_bishop",
      incomingDamage: FROST_BOLT_DAMAGE,
      magicReflectActive: true,
    };
    assert.equal(resolveEnthronedVoidDirectDamage(bishop), FROST_BOLT_DAMAGE);
  });
});

describe("resolveEnthronedVoidDirectDamage", () => {
  it("honours phase-1 immunity so Frost Bolt 20 leaves 280 HP", () => {
    const damage = resolveEnthronedVoidDirectDamage({
      bossId: ENTHRONED_VOID_ID,
      currentPhase: 1,
      incomingDamage: FROST_BOLT_DAMAGE,
      source: "direct",
    });
    assert.equal(FROST_BOLT_DAMAGE, 20);
    assert.equal(frostBolt.isPhysical, undefined);
    assert.equal(damage, 0);
    assert.equal(
      bossHpAfterDirectHit({ hp: ENTHRONED_VOID_HP, damage }),
      ENTHRONED_VOID_HP,
    );
  });

  it("phase 2 is vulnerable — Frost Bolt 20 drops 280 to 260", () => {
    const damage = resolveEnthronedVoidDirectDamage({
      bossId: ENTHRONED_VOID_ID,
      currentPhase: 2,
      incomingDamage: FROST_BOLT_DAMAGE,
      source: "direct",
    });
    assert.equal(damage, 20);
    assert.equal(bossHpAfterDirectHit({ hp: ENTHRONED_VOID_HP, damage }), 260);
  });

  it("flag / empty / non-finite incoming fail-closed", () => {
    assert.equal(
      resolveEnthronedVoidDirectDamage({
        bossId: ENTHRONED_VOID_ID,
        currentPhase: 1,
        incomingDamage: 0,
        source: "direct",
      }),
      0,
    );
    assert.equal(
      resolveEnthronedVoidDirectDamage({
        bossId: ENTHRONED_VOID_ID,
        currentPhase: 1,
        incomingDamage: Number.NaN,
        source: "direct",
      }),
      0,
    );
  });

  it("Inferno DoT is not the applyDamageToEnemy immune path", () => {
    const inferno = starterSpells.find((s) => s.id === "spell-inferno");
    assert.ok(inferno);
    assert.equal(inferno.effectType, "dot");
    assert.equal(Number(inferno.damage), 0);
    assert.equal(
      resolveEnthronedVoidDirectDamage({
        bossId: ENTHRONED_VOID_ID,
        currentPhase: 1,
        incomingDamage: Number(inferno.damage),
        source: "dot",
      }),
      0,
    );
  });

  it("enemyTakesDamage floor-1 still chips live; resolve skips the write", () => {
    const hit = {
      bossId: ENTHRONED_VOID_ID,
      currentPhase: 1 as const,
      incomingDamage: 0,
      source: "melee" as const,
    };
    assert.equal(wxEnemyTakesDamageFloor(0), 1);
    assert.equal(resolveEnthronedVoidEnemyTakesDamage(hit), 0);
    assert.equal(
      resolveEnthronedVoidEnemyTakesDamage({
        ...hit,
        incomingDamage: FROST_BOLT_DAMAGE,
        source: "direct",
      }),
      0,
    );
  });
});

describe("wxEnthronedVoidAnchorStep (live leftover C)", () => {
  it("stepping a live glyph commits 0 so immunity would freeze without this arm", () => {
    const opts = {
      bossId: ENTHRONED_VOID_ID,
      currentPhase: 1 as const,
      anchorsDestroyed: 0,
      glyphedTiles: [liveAnchorGlyph()],
      dest: { x: 6, y: 8 },
    };
    const live = wxEnthronedVoidAnchorStep(opts);
    assert.equal(live.damage, 0);
    assert.equal(live.matched, false);
    assert.equal(live.anchorsDestroyed, 0);
    assert.equal(wxEnthronedVoidAnchorStepDropped(opts), true);
  });

  it("does not steal Pale Archivist GLYPH_TRAP player tax", () => {
    const opts = {
      bossId: "pale_archivist",
      currentPhase: 1 as const,
      anchorsDestroyed: 0,
      glyphedTiles: [liveAnchorGlyph()],
      dest: { x: 6, y: 8 },
    };
    assert.equal(resolveEnthronedVoidAnchorStep(opts).damage, 0);
    assert.equal(
      resolveEnthronedVoidDirectDamage({
        bossId: "pale_archivist",
        source: "anchor-step",
        incomingDamage: ANCHOR_STEP_DAMAGE,
      }),
      0,
    );
    assert.equal(GLYPH_TRAP_PLAYER_TAX, 15);
  });
});

describe("resolveEnthronedVoidAnchorStep", () => {
  it("live glyph deals 20, removes the marker, and trips phase 2 at 8", () => {
    const first = resolveEnthronedVoidAnchorStep({
      bossId: ENTHRONED_VOID_ID,
      currentPhase: 1,
      anchorsDestroyed: 0,
      glyphedTiles: [liveAnchorGlyph()],
      dest: { x: 6, y: 8 },
    });
    assert.equal(first.damage, ANCHOR_STEP_DAMAGE);
    assert.equal(first.matched, true);
    assert.equal(first.anchorsDestroyed, 1);
    assert.equal(first.currentPhase, 1);
    assert.equal(first.glyphedTiles.length, 0);
    assert.equal(
      bossHpAfterDirectHit({
        hp: ENTHRONED_VOID_HP,
        damage: first.damage,
      }),
      260,
    );

    const eighth = resolveEnthronedVoidAnchorStep({
      bossId: ENTHRONED_VOID_ID,
      currentPhase: 1,
      anchorsDestroyed: 7,
      glyphedTiles: [{ x: 3, y: 3, turnsLeft: 1 }],
      dest: { x: 3, y: 3 },
    });
    assert.equal(eighth.anchorsDestroyed, ANCHORS_TO_PHASE_2);
    assert.equal(eighth.currentPhase, 2);
  });

  it("expired / empty / off-tile dests fail-closed and do not relocate crumbs", () => {
    assert.equal(
      resolveEnthronedVoidAnchorStep({
        bossId: ENTHRONED_VOID_ID,
        currentPhase: 1,
        anchorsDestroyed: 0,
        glyphedTiles: [{ x: 6, y: 8, turnsLeft: 0 }],
        dest: { x: 6, y: 8 },
      }).matched,
      false,
    );
    assert.equal(
      resolveEnthronedVoidAnchorStep({
        bossId: ENTHRONED_VOID_ID,
        currentPhase: 1,
        anchorsDestroyed: 0,
        glyphedTiles: [liveAnchorGlyph()],
        dest: { x: 0, y: 0 },
      }).matched,
      false,
    );
    const uniqueBridge = resolveEnthronedVoidAnchorStep({
      bossId: ENTHRONED_VOID_ID,
      currentPhase: 1,
      anchorsDestroyed: 0,
      glyphedTiles: [{ x: 4, y: 4, turnsLeft: 2 }],
      dest: { x: 4, y: 4 },
    });
    assert.equal(uniqueBridge.matched, true);
    assert.equal(uniqueBridge.glyphedTiles.length, 0);
  });
});

describe("production still decides kit first and never reads immunity", () => {
  it("decideEnthronedVoidAction still returns kit before ANCHOR_TILES", () => {
    const src = readFileSync(
      join(dirname(fileURLToPath(import.meta.url)), "../hooks/useBossAI.ts"),
      "utf8",
    );
    const start = src.indexOf("// ── 20. Enthroned Void");
    const end = src.indexOf("// ── Boss ID lookup map");
    assert.ok(start >= 0 && end > start, "Enthroned Void decide is present");
    const body = src.slice(start, end);
    const kitIdx = body.indexOf("pickBossKitSpell");
    const anchorIdx = body.indexOf("BossAbility.ANCHOR_TILES");
    assert.ok(kitIdx >= 0, "kit pick is present");
    assert.ok(anchorIdx >= 0, "ANCHOR_TILES is present");
    assert.ok(kitIdx < anchorIdx, "kit still wins the anchor turn");
    assert.equal(body.includes("BossAbility.DAMAGE_IMMUNE"), false);
    assert.ok(body.includes("BossAbility.PHANTOM_SPAWN"));
    assert.ok(body.includes('type: "spell"'));
  });

  it("applyDamageImmune still writes no flag and asks WX to check phase 1", () => {
    const src = readFileSync(
      join(
        dirname(fileURLToPath(import.meta.url)),
        "../hooks/useBossSystem.ts",
      ),
      "utf8",
    );
    const immune = src.slice(
      src.indexOf("function applyDamageImmune"),
      src.indexOf("// ── applyBossAbility (dispatcher)"),
    );
    assert.ok(immune.includes("newBossState: {}"));
    assert.ok(immune.includes(DAMAGE_IMMUNE_LOG_NEEDLE));
    assert.ok(immune.includes("bossState.phase === 1"));
    const anchors = src.slice(
      src.indexOf("function applyAnchorTiles"),
      src.indexOf("function applyPhantomSpawn"),
    );
    assert.ok(anchors.includes("turnsLeft: 2"));
    assert.ok(anchors.includes(ANCHOR_SPAWN_LOG_NEEDLE));
    assert.ok(src.includes(`case BossAbility.${DAMAGE_IMMUNE_ABILITY}`));
    assert.ok(src.includes(`case BossAbility.${ANCHOR_TILES_ABILITY}`));
    assert.ok(src.includes(`case BossAbility.${PHANTOM_SPAWN_ABILITY}`));
  });

  it("applyDamageToEnemy BossStateLike still omits phase / DAMAGE_IMMUNE", () => {
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
    assert.equal(shape.includes("DAMAGE_IMMUNE"), false);
    assert.equal(shape.includes("anchorsDestroyed"), false);
    assert.equal(shape.includes("currentPhase"), false);
    assert.ok(src.includes('family === "void_mirror"'));
    assert.ok(src.includes("reflectShieldActive === true"));
  });

  it("WorldExploration still copies newBossState without a DAMAGE_IMMUNE hit arm", () => {
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
    assert.equal(wx.includes("resolveEnthronedVoidDirectDamage"), false);
    assert.equal(wx.includes("DAMAGE_IMMUNE"), false);
    assert.equal(wx.includes("anchorsDestroyed"), false);
  });

  it("enthroned_void still advertises DAMAGE_IMMUNE and ANCHOR_TILES in phase 1", () => {
    const src = readFileSync(
      join(dirname(fileURLToPath(import.meta.url)), "../types/bossDefaults.ts"),
      "utf8",
    );
    const voidBoss = src.slice(
      src.indexOf('id: "enthroned_void"'),
      src.indexOf("];"),
    );
    assert.ok(voidBoss.includes("BossAbility.DAMAGE_IMMUNE"));
    assert.ok(voidBoss.includes("BossAbility.ANCHOR_TILES"));
    assert.ok(voidBoss.includes("BossAbility.PHANTOM_SPAWN"));
    assert.ok(voidBoss.includes("BossAbility.AP_DRAIN_PASSIVE"));
  });

  it("enemyTakesDamage still floors at 1 so Attack Nearest chips the immune boss", () => {
    const wx = readFileSync(
      join(
        dirname(fileURLToPath(import.meta.url)),
        "../components/WorldExploration.tsx",
      ),
      "utf8",
    );
    const start = wx.indexOf("const enemyTakesDamage = useCallback");
    assert.ok(start >= 0, "enemyTakesDamage is present");
    const body = wx.slice(start, start + 1600);
    assert.ok(body.includes("Math.max("));
    assert.ok(body.includes("1,"));
    assert.equal(body.includes("DAMAGE_IMMUNE"), false);
    assert.equal(body.includes("enthroned_void"), false);
  });
});
