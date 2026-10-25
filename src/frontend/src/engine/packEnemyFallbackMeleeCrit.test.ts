/**
 * Combat action parity: pack-enemy Crush / Fire Bolt fallback matches
 * advertised CHC. A decided adjacent melee can crit; live WX apply
 * never rolls `enemy.chc`.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { buildEnemyKit } from "./enemyAI.ts";
import {
  PACK_FALLBACK_CRUSH,
  PACK_FALLBACK_DEFAULT_CHC,
  PACK_FALLBACK_ENRAGE_CHC_BONUS,
  PACK_FALLBACK_FIRE_BOLT,
  canExecutePackEnemyFallbackMeleeCrit,
  executePackEnemyFallbackMeleeCrit,
  isPackFallbackMeleeHit,
  liveWxPackFallbackPreSoak,
  packFallbackHighlightedMeleeCritIsExecutable,
  packFallbackMeleeCritChance,
  packFallbackMeleeCritRolls,
  shouldDecidePackEnemyFallbackMeleeCrit,
  wxPackFallbackLiveRaw,
  wxPackFallbackLiveRollsCrit,
} from "./packEnemyFallbackMeleeCrit.ts";
import { getEnemyBaseStats } from "./progression.ts";

function wxSource(): string {
  return readFileSync(
    join(
      dirname(fileURLToPath(import.meta.url)),
      "../components/WorldExploration.tsx",
    ),
    "utf8",
  );
}

function wxPackFallbackApplyBlock(): string {
  const wx = wxSource();
  const start = wx.indexOf("// ── Fallback melee or skip");
  assert.ok(start >= 0, "live pack fallback melee arm is present");
  const end = wx.indexOf(
    "// ── DoT death check (any enemy) + leader flag",
    start,
  );
  assert.ok(end > start, "DoT death check still follows fallback melee");
  return wx.slice(start, end);
}

function wxPackEnemySpellDamageApplyBlock(): string {
  const wx = wxSource();
  const start = wx.indexOf("const isCrit =");
  assert.ok(start >= 0, "live pack-enemy spell crit roll is present");
  const fallback = wx.indexOf("// ── Fallback melee or skip", start);
  assert.ok(fallback > start, "fallback melee still follows spell apply");
  return wx.slice(start, fallback);
}

function motokoDefaultSpellIds(): string[] {
  const src = readFileSync(
    join(
      dirname(fileURLToPath(import.meta.url)),
      "../../../backend/lib/admin.mo",
    ),
    "utf8",
  );
  const start = src.indexOf("public func defaultSpells()");
  const end = src.indexOf("public func defaultGameConfig()", start);
  assert.ok(start >= 0 && end > start, "defaultSpells block is present");
  return [...src.slice(start, end).matchAll(/\bid\s+=\s+"([^"]+)"/g)].map(
    (m) => m[1],
  );
}

describe("pack-enemy Crush / Fire Bolt advertised CHC vs WX fallback", () => {
  it("treats catalog Crush 12 and Fire Bolt 8 as fallback melee hits", () => {
    assert.equal(PACK_FALLBACK_CRUSH.damage, 12);
    assert.equal(PACK_FALLBACK_CRUSH.range, 1);
    assert.equal(PACK_FALLBACK_FIRE_BOLT.damage, 8);
    assert.equal(PACK_FALLBACK_FIRE_BOLT.range, 3);
    assert.equal(isPackFallbackMeleeHit(PACK_FALLBACK_CRUSH), true);
    assert.equal(isPackFallbackMeleeHit(PACK_FALLBACK_FIRE_BOLT), true);
    assert.equal(
      wxPackFallbackLiveRaw({ catalogDamage: 12, enemyLevel: 1 }),
      12,
    );
    assert.equal(
      wxPackFallbackLiveRaw({ catalogDamage: 12, enemyLevel: 5 }),
      12,
    );
    assert.equal(
      wxPackFallbackLiveRaw({ catalogDamage: 12, enemyLevel: 10 }),
      24,
    );
    assert.equal(wxPackFallbackLiveRaw({ catalogDamage: 8, enemyLevel: 1 }), 8);
    assert.equal(
      wxPackFallbackLiveRaw({ catalogDamage: 8, enemyLevel: 10 }),
      16,
    );
  });

  it("Motoko defaultSpells miss every ENEMY_KITS id so Crush is the live attack", () => {
    const motokoIds = new Set(motokoDefaultSpellIds());
    assert.ok(motokoIds.has("shadow_strike"));
    assert.equal(motokoIds.has("physical_attack"), false);
    assert.equal(motokoIds.has("starter-frost"), false);
    const kitIds = new Set(
      (["pawn", "knight", "bishop", "rook", "queen", "king"] as const).flatMap(
        (piece) => [...buildEnemyKit(piece, 0), ...buildEnemyKit(piece, 2)],
      ),
    );
    for (const id of kitIds) {
      assert.equal(
        motokoIds.has(id),
        false,
        `${id} must not be in Motoko defaultSpells (empty kit → Crush)`,
      );
    }
    const wx = wxSource();
    assert.ok(wx.includes('"physical_attack"'));
    assert.ok(
      wx.includes("OLD_SPELL_NAMES_SET"),
      "starter fallback also strips physical_attack",
    );
  });

  it("live WX fallback never rolls CHC; pack spell arm does", () => {
    assert.equal(wxPackFallbackLiveRollsCrit(), false);
    const fallback = wxPackFallbackApplyBlock();
    assert.ok(fallback.includes('id: "e-crush"'));
    assert.ok(fallback.includes('id: "e-firebolt"'));
    assert.ok(fallback.includes("fb.damage * Math.max(1, enemy.level / 5)"));
    assert.equal(
      fallback.includes("isCrit"),
      false,
      "Crush/Fire Bolt still skips the pack-spell crit roll",
    );
    assert.equal(fallback.includes("enemy.chc"), false);
    assert.ok(
      fallback.includes("Melee does NOT use playerTakesDamage"),
      "fallback still writes HP directly; #659 owns Crush RES soak",
    );
    assert.equal(
      fallback.includes("playerTakesDamage("),
      false,
      "#659 owns Crush RES soak, not this crit roll",
    );
    const spell = wxPackEnemySpellDamageApplyBlock();
    assert.ok(spell.includes("enemy.chc ?? 2"));
    assert.ok(spell.includes("isCrit ? rawDmg * 2 : rawDmg"));
    assert.equal(PACK_FALLBACK_DEFAULT_CHC, 2);
    assert.equal(PACK_FALLBACK_ENRAGE_CHC_BONUS, 10);
  });

  it("executes L1 pawn Crush 12→24 and L10 queen Crush 24→48 on advertised CHC", () => {
    const pawnChc = getEnemyBaseStats(1, "pawn").chc;
    const queenChc = getEnemyBaseStats(10, "queen").chc;
    assert.equal(pawnChc, 2);
    assert.equal(queenChc, 6);
    assert.equal(
      liveWxPackFallbackPreSoak({ catalogDamage: 12, enemyLevel: 1 }),
      12,
    );
    assert.equal(
      liveWxPackFallbackPreSoak({ catalogDamage: 12, enemyLevel: 10 }),
      24,
    );
    const decided = shouldDecidePackEnemyFallbackMeleeCrit({
      hit: PACK_FALLBACK_CRUSH,
    });
    const executable = canExecutePackEnemyFallbackMeleeCrit({
      hit: PACK_FALLBACK_CRUSH,
    });
    assert.equal(decided, true);
    assert.equal(executable, true);
    assert.equal(
      packFallbackHighlightedMeleeCritIsExecutable({ decided, executable }),
      true,
    );
    assert.deepEqual(
      executePackEnemyFallbackMeleeCrit({
        hit: PACK_FALLBACK_CRUSH,
        enemyLevel: 1,
        chc: pawnChc,
        rng: () => 0,
      }),
      { raw: 12, isCrit: true, preSoak: 24 },
    );
    assert.deepEqual(
      executePackEnemyFallbackMeleeCrit({
        hit: PACK_FALLBACK_CRUSH,
        enemyLevel: 1,
        chc: pawnChc,
        rng: () => 0.99,
      }),
      { raw: 12, isCrit: false, preSoak: 12 },
      "rng 0.99 * 100 is not < 2",
    );
    assert.deepEqual(
      executePackEnemyFallbackMeleeCrit({
        hit: PACK_FALLBACK_CRUSH,
        enemyLevel: 10,
        chc: queenChc,
        rng: () => 0,
      }),
      { raw: 24, isCrit: true, preSoak: 48 },
    );
    const knightChc = getEnemyBaseStats(5, "knight").chc;
    assert.equal(knightChc, 4);
    assert.deepEqual(
      executePackEnemyFallbackMeleeCrit({
        hit: PACK_FALLBACK_CRUSH,
        enemyLevel: 5,
        chc: knightChc,
        rng: () => 0,
      }),
      { raw: 12, isCrit: true, preSoak: 24 },
    );
  });

  it("executes Fire Bolt 8→16 on a crit and keeps range 3 for Windstorm", () => {
    assert.equal(PACK_FALLBACK_FIRE_BOLT.range, 3);
    assert.deepEqual(
      executePackEnemyFallbackMeleeCrit({
        hit: PACK_FALLBACK_FIRE_BOLT,
        enemyLevel: 1,
        chc: 2,
        rng: () => 0,
      }),
      { raw: 8, isCrit: true, preSoak: 16 },
    );
    assert.deepEqual(
      executePackEnemyFallbackMeleeCrit({
        hit: PACK_FALLBACK_FIRE_BOLT,
        enemyLevel: 10,
        chc: 6,
        rng: () => 0,
      }),
      { raw: 16, isCrit: true, preSoak: 32 },
    );
    const crit = executePackEnemyFallbackMeleeCrit({
      hit: PACK_FALLBACK_FIRE_BOLT,
      enemyLevel: 1,
      chc: 2,
      rng: () => 0,
    });
    assert.equal(
      crit != null && "range" in crit,
      false,
      "#1042 owns Paper Windstorm miss on range > 1",
    );
  });

  it("matches pack-spell Enrage +10 CHC and ×6 damage without stealing RES", () => {
    assert.equal(packFallbackMeleeCritChance({ chc: 2, enraged: false }), 2);
    assert.equal(packFallbackMeleeCritChance({ chc: 2, enraged: true }), 12);
    assert.equal(
      packFallbackMeleeCritRolls({
        chc: 2,
        enraged: false,
        rng: () => 0.11,
      }),
      false,
      "11 is not < 2",
    );
    assert.equal(
      packFallbackMeleeCritRolls({
        chc: 2,
        enraged: true,
        rng: () => 0.11,
      }),
      true,
      "11 is < 12 with Enrage +10",
    );
    assert.deepEqual(
      executePackEnemyFallbackMeleeCrit({
        hit: PACK_FALLBACK_CRUSH,
        enemyLevel: 1,
        enrageMultiplier: 6,
        chc: 2,
        enraged: true,
        rng: () => 0,
      }),
      { raw: 72, isCrit: true, preSoak: 144 },
    );
    const crit = executePackEnemyFallbackMeleeCrit({
      hit: PACK_FALLBACK_CRUSH,
      enemyLevel: 1,
      chc: 50,
      rng: () => 0,
    });
    assert.equal(crit?.preSoak, 24);
    assert.equal(
      crit != null && "res" in crit,
      false,
      "#659 owns Crush RES soak",
    );
  });

  it("cannot execute a kit spell as Crush fallback", () => {
    assert.equal(
      canExecutePackEnemyFallbackMeleeCrit({
        hit: { id: "physical_attack", name: "Strike", range: 1, damage: 10 },
      }),
      false,
    );
    assert.equal(
      executePackEnemyFallbackMeleeCrit({
        hit: { id: "starter-frost", name: "Frost", range: 3, damage: 8 },
        enemyLevel: 1,
        chc: 8,
        rng: () => 0,
      }),
      null,
    );
    assert.equal(
      packFallbackHighlightedMeleeCritIsExecutable({
        decided: false,
        executable: false,
      }),
      false,
    );
  });

  it("keys off fallback id metadata, not the display name, and uses chc ?? 2", () => {
    assert.equal(
      isPackFallbackMeleeHit({
        id: "e-crush",
        name: "Anything",
        range: 1,
        damage: 12,
      }),
      true,
    );
    assert.equal(
      isPackFallbackMeleeHit({
        id: "physical_attack",
        name: "Crush",
        range: 1,
        damage: 12,
      }),
      false,
    );
    assert.equal(packFallbackMeleeCritChance({ chc: undefined }), 2);
    assert.equal(packFallbackMeleeCritChance({ chc: Number.NaN }), 2);
    assert.equal(packFallbackMeleeCritChance({ chc: 5 }), 5);
    assert.equal(packFallbackMeleeCritRolls({ chc: 0, rng: () => 0 }), false);
    assert.equal(
      packFallbackMeleeCritRolls({ chc: 100, rng: () => 0.99 }),
      true,
    );
  });
});
