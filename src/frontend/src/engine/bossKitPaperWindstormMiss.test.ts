/**
 * Combat action parity: boss kit damage/drain skip advertised Paper Windstorm miss.
 * Live WX kit apply uses playerTakesDamage (RES only) and never reads
 * `isPaperWindstorm`.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { starterSpells } from "../data/spellData.ts";
import {
  BOSS_KIT_PAPER_WINDSTORM_FIRE_DAMAGE,
  BOSS_KIT_PAPER_WINDSTORM_FIRE_RANGE,
  BOSS_KIT_PAPER_WINDSTORM_FIRE_SPELL_ID,
  BOSS_KIT_PAPER_WINDSTORM_MISS_CHANCE,
  PAPER_WINDSTORM_MODIFIER_ID,
  bossKitPaperWindstormHighlightedIsExecutable,
  bossKitPaperWindstormSpellRange,
  bossKitPaperWindstormSpellRangeCanMiss,
  canExecuteBossKitPaperWindstormMiss,
  executeBossKitPaperWindstormMiss,
  isPaperWindstormModifier,
  liveWxBossKitPaperWindstormHit,
  liveWxBossKitSpellRollsPaperWindstormMiss,
  shouldDecideBossKitPaperWindstormMiss,
} from "./bossKitPaperWindstormMiss.ts";

function here(): string {
  return dirname(fileURLToPath(import.meta.url));
}

function wxSource(): string {
  return readFileSync(
    join(here(), "../components/WorldExploration.tsx"),
    "utf8",
  );
}

function useBossAiSource(): string {
  return readFileSync(join(here(), "../hooks/useBossAI.ts"), "utf8");
}

function bossKitsSource(): string {
  return readFileSync(join(here(), "../data/bossKits.ts"), "utf8");
}

function adminMoSource(): string {
  return readFileSync(join(here(), "../../../backend/lib/admin.mo"), "utf8");
}

function wxBossKitDamageBlock(): string {
  const wx = wxSource();
  const start = wx.indexOf(
    "// Damage / drain → playerTakesDamage (mirror WX 13520-13646).",
  );
  assert.ok(start >= 0, "live boss kit damage arm is present");
  const end = wx.indexOf(
    "// Heal → updateCombatant on boss (store + strip).",
    start,
  );
  assert.ok(end > start, "heal arm still follows boss kit damage");
  return wx.slice(start, end);
}

function wxPackCastMissBlock(): string {
  const wx = wxSource();
  const start = wx.indexOf("const spellRange = Number(chosenSpell.range);");
  assert.ok(start >= 0, "live pack cast arm is present");
  const miss = wx.indexOf("isPaperWindstorm && spellRange > 1", start);
  assert.ok(miss > start, "live pack CAST still rolls Paper Windstorm miss");
  const playerHit = wx.indexOf("actualDmg = playerTakesDamage(", miss);
  assert.ok(playerHit > miss, "player hit still follows the miss gate");
  return wx.slice(miss, playerHit);
}

function cursedWoundReady(
  overrides: Partial<
    Parameters<typeof executeBossKitPaperWindstormMiss>[0]
  > = {},
) {
  return {
    modifierActive: true,
    rawDamage: BOSS_KIT_PAPER_WINDSTORM_FIRE_DAMAGE,
    playerHp: 100,
    isSpell: true,
    chebyshev: 2,
    range: BOSS_KIT_PAPER_WINDSTORM_FIRE_RANGE,
    roll01: 0,
    ...overrides,
  };
}

describe("boss kit Paper Windstorm miss", () => {
  it("catalog Cursed Wound 22 is a ranged spell and kit first-id", () => {
    const wound = starterSpells.find(
      (s) => s.id === BOSS_KIT_PAPER_WINDSTORM_FIRE_SPELL_ID,
    );
    assert.ok(wound);
    assert.equal(Number(wound?.damage), BOSS_KIT_PAPER_WINDSTORM_FIRE_DAMAGE);
    assert.equal(Number(wound?.range), BOSS_KIT_PAPER_WINDSTORM_FIRE_RANGE);
    assert.equal(wound?.spellType, "damage");
    assert.equal(wound?.isPhysical, undefined);
    assert.equal(bossKitPaperWindstormSpellRangeCanMiss(wound?.range), true);
    assert.equal(BOSS_KIT_PAPER_WINDSTORM_MISS_CHANCE, 0.5);
    assert.equal(isPaperWindstormModifier(PAPER_WINDSTORM_MODIFIER_ID), true);
    assert.equal(isPaperWindstormModifier("glass_realm"), false);

    const admin = adminMoSource();
    assert.ok(
      admin.includes(
        "Ranged spells further than 1 tile away have a 50% chance to miss.",
      ),
      "Motoko still advertises the 50% ranged miss",
    );

    assert.equal(liveWxBossKitPaperWindstormHit(22, 0), 22);
    assert.equal(liveWxBossKitSpellRollsPaperWindstormMiss(), false);

    const kits = bossKitsSource();
    for (const bossId of [
      "pale_archbishop",
      "midnight_bishop",
      "chessboard_lich",
      "pale_archivist",
    ]) {
      const heading = kits.indexOf(`${bossId}: {`);
      assert.ok(heading >= 0, `${bossId} kit is present`);
      const phase1 = kits.indexOf("phase1SpellIds:", heading);
      assert.ok(phase1 > heading, `${bossId} has phase1SpellIds`);
      const firstIdLine = kits.slice(phase1, phase1 + 80);
      assert.ok(
        firstIdLine.includes(`"${BOSS_KIT_PAPER_WINDSTORM_FIRE_SPELL_ID}"`),
        `${bossId} phase 1 first-id is Cursed Wound`,
      );
    }
  });

  it("live kit damage never rolls miss; pack CAST still does", () => {
    const kit = wxBossKitDamageBlock();
    assert.ok(kit.includes("playerTakesDamage("));
    assert.ok(
      kit.includes("const bRawDmg = Math.max(1, Math.round(bSpellDmg))"),
    );
    assert.ok(
      kit.includes("playerTakesDamage(\n                      bRawDmg,"),
    );
    assert.equal(
      kit.includes("isPaperWindstorm"),
      false,
      "kit damage arm still never reads isPaperWindstorm",
    );
    assert.equal(kit.includes("paper_windstorm"), false);
    assert.equal(kit.includes("Paper Windstorm"), false);
    assert.equal(kit.includes("Math.random()"), false);

    const pack = wxPackCastMissBlock();
    assert.ok(pack.includes("isPaperWindstorm && spellRange > 1"));
    assert.ok(pack.includes("Math.random() < 0.5"));

    const wx = wxSource();
    assert.equal(wx.includes("executeBossKitPaperWindstormMiss"), false);
    assert.equal(wx.includes("bossKitPaperWindstormSpellRangeCanMiss"), false);
    assert.equal(
      wx.includes("liveWxBossKitSpellRollsPaperWindstormMiss"),
      false,
    );

    const ai = useBossAiSource();
    assert.ok(ai.includes("new Map<string, number>()"));
    assert.equal(
      ai.includes("enemyCooldownsRef"),
      false,
      "pickBossKitSpell still receives an empty cooldown Map",
    );
  });

  it("executes Cursed Wound 22 as a miss; live RES-only hits the player", () => {
    const ready = cursedWoundReady();
    const decided = shouldDecideBossKitPaperWindstormMiss(ready);
    const executable = canExecuteBossKitPaperWindstormMiss(ready);
    assert.equal(decided, true);
    assert.equal(executable, true);
    assert.equal(
      bossKitPaperWindstormHighlightedIsExecutable({ decided, executable }),
      true,
    );

    const next = executeBossKitPaperWindstormMiss(ready);
    assert.deepEqual(next, {
      missed: true,
      playerHpAfter: 100,
      playerDied: false,
    });
    assert.equal(
      liveWxBossKitPaperWindstormHit(ready.rawDamage, 0),
      22,
      "live RES 0 kit hit still lands 22 on the player",
    );
    assert.notEqual(next?.playerHpAfter, 78);

    assert.equal(
      executeBossKitPaperWindstormMiss({
        ...cursedWoundReady(),
        roll01: 0.499,
      })?.missed,
      true,
    );
    assert.equal(
      executeBossKitPaperWindstormMiss({
        ...cursedWoundReady(),
        roll01: 0.5,
      }),
      null,
      "pack CAST hits when the 50% roll fails — not this leftover",
    );
  });

  it("cannot stamp melee, out-of-range, 0-damage, or sibling leftover payloads", () => {
    const ready = cursedWoundReady();
    assert.equal(
      executeBossKitPaperWindstormMiss({
        ...ready,
        chebyshev: 5,
      }),
      null,
      "Chebyshev 5 is #888 kit range skip, not this miss roll",
    );
    assert.equal(
      executeBossKitPaperWindstormMiss({
        ...cursedWoundReady(),
        isSpell: false,
      }),
      null,
      "physical_attack first-id is not advertised as a spell — leave",
    );
    assert.equal(
      executeBossKitPaperWindstormMiss({
        ...cursedWoundReady(),
        range: 1,
      }),
      null,
      "Strike / melee range 1 is outside the Motoko miss band",
    );
    assert.equal(
      executeBossKitPaperWindstormMiss({
        ...cursedWoundReady(),
        rawDamage: 0,
      }),
      null,
      "Inferno damage 0 never enters the kit damage arm",
    );
    assert.equal(
      executeBossKitPaperWindstormMiss({
        ...cursedWoundReady(),
        modifierActive: false,
      }),
      null,
    );
    assert.equal(
      executeBossKitPaperWindstormMiss({
        ...cursedWoundReady(),
        roll01: 0.3,
      })?.missed,
      true,
      "player 30% band still misses on the pack 50% roll — do not adopt #1042",
    );

    const crit = executeBossKitPaperWindstormMiss(cursedWoundReady());
    assert.ok(crit);
    assert.equal("chc" in crit, false, "#1104 owns kit CHC");
    assert.equal("sr" in crit, false, "#1262 owns kit SR soak");
    assert.equal("heal" in crit, false, "#1148 owns Vampiric Ground heal");
    assert.equal("roll" in crit, false, "#1208 owns Titan 1–5×");
    assert.equal(
      "glass" in crit,
      false,
      "#1160 / #1252 own Glass Realm packets",
    );
    assert.equal("bounces" in crit, false, "#868 owns kit bounce");
    assert.equal(
      "mirrorConsumed" in crit,
      false,
      "#1266 owns kit player Mirror reflect",
    );
    assert.equal(
      bossKitPaperWindstormHighlightedIsExecutable({
        decided: false,
        executable: false,
      }),
      false,
    );
  });

  it("keys off modifier id and catalog range, not announce copy or Chain Lightning bounce", () => {
    assert.equal(isPaperWindstormModifier("Paper Windstorm"), false);
    assert.equal(bossKitPaperWindstormSpellRange(3), 3);
    assert.equal(bossKitPaperWindstormSpellRange(3n), 3);
    assert.equal(bossKitPaperWindstormSpellRangeCanMiss(1), false);
    assert.equal(bossKitPaperWindstormSpellRangeCanMiss(4), true);
    assert.equal(
      shouldDecideBossKitPaperWindstormMiss(cursedWoundReady()),
      canExecuteBossKitPaperWindstormMiss(cursedWoundReady()),
    );
    const blast = starterSpells.find((s) => s.id === "starter-blast");
    assert.equal(blast?.hitsMultiple, true);
    assert.equal(Number(blast?.range), 4);
    assert.equal(
      canExecuteBossKitPaperWindstormMiss({
        ...cursedWoundReady(),
        rawDamage: 20,
        range: 4,
        chebyshev: 3,
      }),
      true,
      "Void Grandmaster Chain Lightning still misses on the pack 50% band; bounce is #868",
    );
  });
});
