/**
 * Combat action parity: boss kit Iron Skin / Enrage / Haste ignore
 * advertised buffStat because kit self-buff requires spellType !== damage.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { starterSpells } from "../data/spellData.ts";
import {
  ALABASTER_FORTRESS_ID,
  ALABASTER_FORTRESS_PHASE2_KIT_FIRST_ID,
  CRIMSON_COUNTESS_ID,
  CRIMSON_COUNTESS_PHASE2_ENRAGE_ID,
  ENRAGE_BUFF_DURATION,
  ENRAGE_BUFF_MODIFIER,
  ENRAGE_BUFF_STAT,
  HASTE_BUFF_DURATION,
  HASTE_BUFF_MODIFIER,
  HASTE_BUFF_STAT,
  IRON_SKIN_BUFF_DURATION,
  IRON_SKIN_BUFF_MODIFIER,
  IRON_SKIN_BUFF_STAT,
  SHIELD_BUFF_DURATION,
  SHIELD_BUFF_MODIFIER,
  SHIELD_BUFF_STAT,
  SPELL_ENRAGE_ID,
  SPELL_HASTE_ID,
  SPELL_IRON_SKIN_ID,
  SPELL_SHIELD_ID,
  advertisedKitSelfBuffEffect,
  kitSelfBuffAsActiveEffect,
  liveWxKitSelfBuffEffect,
  liveWxKitSelfBuffReadsBuffStat,
  liveWxKitSelfBuffRequiresNonDamageSpellType,
} from "./bossKitSelfBuff.ts";
import { getStatModifier } from "./statusEffects.ts";

function here(): string {
  return dirname(fileURLToPath(import.meta.url));
}

function wxSource(): string {
  return readFileSync(
    join(here(), "../components/WorldExploration.tsx"),
    "utf8",
  );
}

function bossKitsSource(): string {
  return readFileSync(join(here(), "../data/bossKits.ts"), "utf8");
}

function wxBossKitApplyBlock(): string {
  const wx = wxSource();
  const start = wx.indexOf(
    "// ── Boss kit spell cast branch ─────────────────────────────────",
  );
  assert.ok(start >= 0, "live boss kit apply arm is present");
  const end = wx.indexOf(
    "// Spell lookup failed — fall through to abilityResult handling.",
    start,
  );
  assert.ok(end > start, "abilityResult fallthrough still follows kit apply");
  return wx.slice(start, end);
}

function phaseFirstIdLine(kits: string, bossId: string, key: string): string {
  const heading = kits.indexOf(`${bossId}: {`);
  assert.ok(heading >= 0, `${bossId} kit is present`);
  const phase = kits.indexOf(`${key}:`, heading);
  assert.ok(phase > heading, `${bossId} has ${key}`);
  return kits.slice(phase, phase + 220);
}

describe("boss kit self-buff advertised buffStat", () => {
  it("catalog Iron Skin / Enrage / Haste / Shield keep advertised modifiers", () => {
    const iron = starterSpells.find((s) => s.id === SPELL_IRON_SKIN_ID);
    assert.ok(iron);
    assert.equal(iron?.spellType, "damage");
    assert.equal(Number(iron?.damage), 0);
    assert.equal(iron?.buffStat, IRON_SKIN_BUFF_STAT);
    assert.equal(iron?.buffModifier, IRON_SKIN_BUFF_MODIFIER);
    assert.equal(iron?.buffDuration, IRON_SKIN_BUFF_DURATION);
    assert.equal(iron?.targetType, "ally");

    const enrage = starterSpells.find((s) => s.id === SPELL_ENRAGE_ID);
    assert.ok(enrage);
    assert.equal(enrage?.spellType, "damage");
    assert.equal(Number(enrage?.damage), 0);
    assert.equal(enrage?.buffStat, ENRAGE_BUFF_STAT);
    assert.equal(enrage?.buffModifier, ENRAGE_BUFF_MODIFIER);
    assert.equal(enrage?.buffDuration, ENRAGE_BUFF_DURATION);

    const haste = starterSpells.find((s) => s.id === SPELL_HASTE_ID);
    assert.ok(haste);
    assert.equal(haste?.spellType, "damage");
    assert.equal(haste?.buffStat, HASTE_BUFF_STAT);
    assert.equal(haste?.buffModifier, HASTE_BUFF_MODIFIER);
    assert.equal(haste?.buffDuration, HASTE_BUFF_DURATION);

    const shield = starterSpells.find((s) => s.id === SPELL_SHIELD_ID);
    assert.ok(shield);
    assert.equal(shield?.spellType, "damage");
    assert.equal(shield?.buffStat, SHIELD_BUFF_STAT);
    assert.equal(shield?.buffModifier, SHIELD_BUFF_MODIFIER);
    assert.equal(shield?.buffDuration, SHIELD_BUFF_DURATION);

    assert.equal(ALABASTER_FORTRESS_PHASE2_KIT_FIRST_ID, SPELL_IRON_SKIN_ID);
    const kits = bossKitsSource();
    const albP2 = phaseFirstIdLine(
      kits,
      ALABASTER_FORTRESS_ID,
      "phase2SpellIds",
    );
    assert.ok(
      albP2.includes(`"${SPELL_IRON_SKIN_ID}"`),
      "alabaster_fortress phase 2 first-id is Iron Skin",
    );

    const countessP2 = phaseFirstIdLine(
      kits,
      CRIMSON_COUNTESS_ID,
      "phase2SpellIds",
    );
    assert.ok(
      countessP2.includes(`"${CRIMSON_COUNTESS_PHASE2_ENRAGE_ID}"`),
      "crimson_countess phase 2 still lists Enrage after Inferno",
    );
  });

  it("live kit self-buff requires non-damage spellType and reads debuffStat", () => {
    assert.equal(liveWxKitSelfBuffRequiresNonDamageSpellType(), true);
    assert.equal(liveWxKitSelfBuffReadsBuffStat(), false);

    const kit = wxBossKitApplyBlock();
    assert.ok(
      kit.includes('bossSpellType !== "damage"'),
      "kit self-buff still gates on spellType !== damage",
    );
    assert.ok(
      kit.includes('stat: bossSpell.debuffStat ?? "atk"'),
      "kit self-buff still writes debuffStat ?? atk",
    );
    assert.equal(
      kit.includes("bossSpell.buffStat"),
      false,
      "kit apply still never reads bossSpell.buffStat",
    );
    assert.equal(kit.includes("spell.buffStat"), false);
    assert.equal(kit.includes("advertisedKitSelfBuffEffect"), false);
    assert.equal(wxSource().includes("executeBossKitSelfBuff"), false);
  });

  it("Alabaster Iron Skin: live leftover 0 RES; advertised 1.3 for 3 turns", () => {
    const iron = starterSpells.find((s) => s.id === SPELL_IRON_SKIN_ID);
    assert.ok(iron);
    const bossId = "alabaster-1";

    const live = liveWxKitSelfBuffEffect(iron, bossId);
    assert.equal(live, null);

    const advertised = advertisedKitSelfBuffEffect(iron, bossId);
    assert.deepEqual(advertised, {
      stat: IRON_SKIN_BUFF_STAT,
      modifier: IRON_SKIN_BUFF_MODIFIER,
      duration: IRON_SKIN_BUFF_DURATION,
      targetId: bossId,
    });

    const effect = kitSelfBuffAsActiveEffect(advertised!, "Iron Skin");
    assert.equal(getStatModifier(bossId, "res", []), 1);
    assert.equal(getStatModifier(bossId, "res", [effect]), 1.3);
    assert.equal(getStatModifier("player", "res", [effect]), 1);
  });

  it("Countess Enrage after Inferno CD: live leftover 0 DMG; advertised 1.4 for 2", () => {
    const enrage = starterSpells.find((s) => s.id === SPELL_ENRAGE_ID);
    assert.ok(enrage);
    const bossId = "countess-1";
    assert.equal(liveWxKitSelfBuffEffect(enrage, bossId), null);

    const advertised = advertisedKitSelfBuffEffect(enrage, bossId);
    assert.deepEqual(advertised, {
      stat: ENRAGE_BUFF_STAT,
      modifier: ENRAGE_BUFF_MODIFIER,
      duration: ENRAGE_BUFF_DURATION,
      targetId: bossId,
    });
    const effect = kitSelfBuffAsActiveEffect(advertised!, "Enrage");
    assert.equal(getStatModifier(bossId, "dmg", [effect]), 1.4);
  });

  it("Haste advertised +2 MP additive; live leftover still 0", () => {
    const haste = starterSpells.find((s) => s.id === SPELL_HASTE_ID);
    assert.ok(haste);
    const bossId = "cavalier-1";
    assert.equal(liveWxKitSelfBuffEffect(haste, bossId), null);

    const advertised = advertisedKitSelfBuffEffect(haste, bossId);
    assert.deepEqual(advertised, {
      stat: HASTE_BUFF_STAT,
      modifier: HASTE_BUFF_MODIFIER,
      duration: HASTE_BUFF_DURATION,
      targetId: bossId,
    });
    const effect = kitSelfBuffAsActiveEffect(advertised!, "Haste");
    assert.equal(getStatModifier(bossId, "mp", []), 0);
    assert.equal(getStatModifier(bossId, "mp", [effect]), 2);
  });
});
