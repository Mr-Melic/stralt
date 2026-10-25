/**
 * Combat action parity: boss kit damage decide matches advertised CHC.
 * A decided legal Cursed Wound / Strike / Chain Lightning / Life Drain
 * can crit; live WX apply never rolls `enemy.chc`.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { physicalAttackSpell, starterSpells } from "../data/spellData.ts";
import {
  PACK_ENEMY_DEFAULT_CHC,
  bossKitDamageCritChance,
  bossKitDamageCritRolls,
  bossKitHighlightedDamageCritIsExecutable,
  canExecuteBossKitDamageCritCast,
  executeBossKitDamageCritCast,
  isBossKitDamageCritSpell,
  liveWxBossKitDamagePreSoak,
  shouldDecideBossKitDamageCritCast,
  wxBossKitDamageLiveRollsCrit,
  wxBossKitLiveDamageRaw,
} from "./bossKitDamageCritExecute.ts";

function mustSpell(id: string) {
  const spell = starterSpells.find((s) => s.id === id);
  assert.ok(spell, id);
  return spell;
}

function bossChc(id: string): number {
  const src = readFileSync(
    join(dirname(fileURLToPath(import.meta.url)), "../types/bossDefaults.ts"),
    "utf8",
  );
  const match = src.match(new RegExp(`id:\\s*"${id}"[\\s\\S]*?chc:\\s*(\\d+)`));
  assert.ok(match?.[1], id);
  return Number(match[1]);
}

function firstPhaseId(
  src: string,
  bossId: string,
  phase: "phase1SpellIds" | "phase2SpellIds",
): string | undefined {
  return src.match(
    new RegExp(`${bossId}:[\\s\\S]*?${phase}:\\s*\\[\\s*"([^"]+)"`),
  )?.[1];
}

function wxBossKitDamageApplyBlock(): string {
  const wx = readFileSync(
    join(
      dirname(fileURLToPath(import.meta.url)),
      "../components/WorldExploration.tsx",
    ),
    "utf8",
  );
  const start = wx.indexOf(
    "// Damage / drain → playerTakesDamage (mirror WX 13520-13646).",
  );
  assert.ok(start >= 0, "live boss kit damage arm is present");
  const healStart = wx.indexOf(
    "// Heal → updateCombatant on boss (store + strip).",
    start,
  );
  assert.ok(healStart > start, "heal arm still follows kit damage");
  return wx.slice(start, healStart);
}

function wxPackEnemyDamageApplyBlock(): string {
  const wx = readFileSync(
    join(
      dirname(fileURLToPath(import.meta.url)),
      "../components/WorldExploration.tsx",
    ),
    "utf8",
  );
  const start = wx.indexOf("const isCrit =");
  assert.ok(start >= 0, "live pack-enemy crit roll is present");
  return wx.slice(start, start + 400);
}

describe("boss kit advertised CHC vs WX damage execute", () => {
  it("treats catalog Cursed Wound / Strike / Chain Lightning / Life Drain as damage-crit spells", () => {
    const wound = mustSpell("spell-cursed-wound");
    assert.equal(wound.spellType, "damage");
    assert.equal(Number(wound.damage), 22);
    assert.equal(isBossKitDamageCritSpell(wound), true);
    assert.equal(wxBossKitLiveDamageRaw(wound), 22);
    assert.equal(isBossKitDamageCritSpell(physicalAttackSpell), true);
    assert.equal(wxBossKitLiveDamageRaw(physicalAttackSpell), 10);
    assert.equal(isBossKitDamageCritSpell(mustSpell("starter-blast")), true);
    assert.equal(Number(mustSpell("starter-blast").bounces), 2);
    const drain = mustSpell("starter-drain");
    assert.equal(drain.spellType, "drain");
    assert.equal(Number(drain.damage), 10);
    assert.equal(Number(drain.healAmount), 5);
    assert.equal(isBossKitDamageCritSpell(drain), true);
  });

  it("Pale Archbishop / Final Pawn / Void Grandmaster / Starved Vampire first kit ids are damage", () => {
    const src = readFileSync(
      join(dirname(fileURLToPath(import.meta.url)), "../data/bossKits.ts"),
      "utf8",
    );
    assert.equal(
      firstPhaseId(src, "pale_archbishop", "phase1SpellIds"),
      "spell-cursed-wound",
    );
    assert.equal(
      firstPhaseId(src, "final_pawn", "phase1SpellIds"),
      "physical_attack",
    );
    assert.equal(
      firstPhaseId(src, "void_grandmaster", "phase1SpellIds"),
      "starter-blast",
    );
    assert.equal(
      firstPhaseId(src, "starved_vampire_pawn", "phase1SpellIds"),
      "starter-drain",
    );
    assert.equal(bossChc("pale_archbishop"), 5);
    assert.equal(bossChc("final_pawn"), 2);
    assert.equal(bossChc("void_grandmaster"), 6);
    assert.equal(bossChc("starved_vampire_pawn"), 5);
  });

  it("does not steal Rallying Cry CHC buff, Iron Skin, Slow, Inferno, Swap, Mark, or Mirror", () => {
    assert.equal(
      isBossKitDamageCritSpell(mustSpell("spell-rallying-cry")),
      false,
      "#857 owns heal+buff CHC apply, not a damage roll",
    );
    assert.equal(
      isBossKitDamageCritSpell(mustSpell("starter-heal")),
      false,
      "#857 / #692 own Blood Mend CHC buff",
    );
    assert.equal(
      isBossKitDamageCritSpell(mustSpell("spell-iron-skin")),
      false,
      "#843 owns buff-only Iron Skin",
    );
    assert.equal(isBossKitDamageCritSpell(mustSpell("spell-slow")), false);
    assert.equal(
      isBossKitDamageCritSpell(mustSpell("spell-inferno")),
      false,
      "#947 owns 0-damage Inferno DoT",
    );
    assert.equal(
      isBossKitDamageCritSpell(mustSpell("starter-poison")),
      false,
      "#967 owns 0-damage Poison DoT",
    );
    assert.equal(isBossKitDamageCritSpell(mustSpell("spell-swap")), false);
    assert.equal(isBossKitDamageCritSpell(mustSpell("spell-mark")), false);
    assert.equal(isBossKitDamageCritSpell(mustSpell("spell-mirror")), false);
    assert.equal(isBossKitDamageCritSpell(mustSpell("spell-barrier")), false);
    assert.equal(
      isBossKitDamageCritSpell(mustSpell("summon-dire-wolf")),
      false,
    );
  });

  it("live WX kit apply never rolls CHC; pack-enemy apply does", () => {
    assert.equal(wxBossKitDamageLiveRollsCrit(), false);
    const kit = wxBossKitDamageApplyBlock();
    assert.ok(kit.includes("Math.max(1, Math.round(bSpellDmg))"));
    assert.ok(kit.includes("playerTakesDamage("));
    assert.equal(
      kit.includes("isCrit"),
      false,
      "boss kit damage still skips the pack-enemy crit roll",
    );
    assert.equal(kit.includes("enemy.chc"), false);
    assert.equal(kit.includes("baseStats.chc"), false);
    const pack = wxPackEnemyDamageApplyBlock();
    assert.ok(pack.includes("enemy.chc ?? 2"));
    assert.ok(pack.includes("isCrit ? rawDmg * 2 : rawDmg"));
    assert.equal(PACK_ENEMY_DEFAULT_CHC, 2);
  });

  it("executes Pale Archbishop Cursed Wound 22→44 on a 5% roll and keeps drain healAmount", () => {
    const wound = mustSpell("spell-cursed-wound");
    assert.equal(liveWxBossKitDamagePreSoak(wound), 22);
    const decided = shouldDecideBossKitDamageCritCast({ spell: wound });
    const executable = canExecuteBossKitDamageCritCast({ spell: wound });
    assert.equal(decided, true);
    assert.equal(executable, true);
    assert.equal(
      bossKitHighlightedDamageCritIsExecutable({ decided, executable }),
      true,
    );
    assert.deepEqual(
      executeBossKitDamageCritCast({
        spell: wound,
        chc: bossChc("pale_archbishop"),
        rng: () => 0,
      }),
      { raw: 22, isCrit: true, preSoak: 44 },
    );
    assert.deepEqual(
      executeBossKitDamageCritCast({
        spell: wound,
        chc: 5,
        rng: () => 0.99,
      }),
      { raw: 22, isCrit: false, preSoak: 22 },
      "rng 0.99 * 100 is not < 5",
    );
    const drain = mustSpell("starter-drain");
    const critDrain = executeBossKitDamageCritCast({
      spell: drain,
      chc: 5,
      rng: () => 0,
    });
    assert.deepEqual(critDrain, { raw: 10, isCrit: true, preSoak: 20 });
    assert.equal(
      Number(drain.healAmount),
      5,
      "drain heal stays catalog 5 — do not steal #921",
    );
  });

  it("Final Pawn Strike and Void Grandmaster Chain Lightning primary can crit; bounce is not this payload", () => {
    const strike = executeBossKitDamageCritCast({
      spell: physicalAttackSpell,
      chc: bossChc("final_pawn"),
      rng: () => 0,
    });
    assert.deepEqual(strike, { raw: 10, isCrit: true, preSoak: 20 });
    const blast = mustSpell("starter-blast");
    const critBlast = executeBossKitDamageCritCast({
      spell: blast,
      chc: bossChc("void_grandmaster"),
      rng: () => 0,
    });
    assert.deepEqual(critBlast, { raw: 20, isCrit: true, preSoak: 40 });
    assert.equal(
      "bounces" in (critBlast ?? {}),
      false,
      "#868 owns advertised bounce execute",
    );
  });

  it("cannot execute Rallying Cry or Iron Skin as a kit damage crit", () => {
    assert.equal(
      canExecuteBossKitDamageCritCast({
        spell: mustSpell("spell-rallying-cry"),
      }),
      false,
    );
    assert.equal(
      executeBossKitDamageCritCast({
        spell: mustSpell("spell-iron-skin"),
        chc: 8,
        rng: () => 0,
      }),
      null,
    );
    assert.equal(liveWxBossKitDamagePreSoak(mustSpell("spell-slow")), null);
    assert.equal(
      bossKitHighlightedDamageCritIsExecutable({
        decided: false,
        executable: false,
      }),
      false,
    );
  });

  it("keys off metadata, not the display name, and uses pack-enemy chc ?? 2", () => {
    assert.equal(
      isBossKitDamageCritSpell({
        spellType: "damage",
        damage: 22,
      }),
      true,
    );
    assert.equal(
      isBossKitDamageCritSpell({
        spellType: "heal",
        damage: 22,
        healAmount: 20,
        buffStat: "chc",
      }),
      false,
    );
    assert.equal(bossKitDamageCritChance(undefined), 2);
    assert.equal(bossKitDamageCritChance(Number.NaN), 2);
    assert.equal(bossKitDamageCritChance(5), 5);
    assert.equal(bossKitDamageCritRolls({ chc: 0, rng: () => 0 }), false);
    assert.equal(bossKitDamageCritRolls({ chc: 100, rng: () => 0.99 }), true);
  });
});
