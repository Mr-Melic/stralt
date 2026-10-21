/**
 * Combat action parity: boss kit heal+buff decide matches execute.
 * A decided legal advertised Rallying Cry is executable; live WX apply
 * kinds stay heal-only so the advertised CHC cannot be skipped.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { physicalAttackSpell, starterSpells } from "../data/spellData.ts";
import {
  bossKitHealBuffApplyCell,
  bossKitHealBuffEffectFields,
  bossKitHealBuffInRange,
  bossKitHighlightedHealBuffIsExecutable,
  canExecuteBossKitHealBuffCast,
  executeBossKitHealBuffCast,
  isBossKitHealBuffExecuteSpell,
  shouldDecideBossKitHealBuffCast,
  wxBossKitApplyKinds,
} from "./bossKitHealBuffExecute.ts";
import { enemyCastRangeOk } from "./targeting.ts";

function mustSpell(id: string) {
  const spell = starterSpells.find((s) => s.id === id);
  assert.ok(spell, id);
  return spell;
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

describe("boss kit advertised heal+buff vs WX execute", () => {
  it("treats catalog Rallying Cry and Blood Mend as heal+buff execute spells", () => {
    const cry = mustSpell("spell-rallying-cry");
    assert.equal(cry.spellType, "heal");
    assert.equal(Number(cry.healAmount), 20);
    assert.equal(cry.buffStat, "chc");
    assert.equal(Number(cry.buffModifier), 0.15);
    assert.equal(Number(cry.buffDuration), 2);
    assert.equal(Number(cry.range), 0);
    assert.equal(cry.targetType, "self");
    assert.equal(isBossKitHealBuffExecuteSpell(cry), true);
    assert.equal(
      isBossKitHealBuffExecuteSpell(mustSpell("starter-heal")),
      true,
    );
  });

  it("Twin Monarchs phase 1 and phase 2 first kit id is Rallying Cry", () => {
    const src = readFileSync(
      join(dirname(fileURLToPath(import.meta.url)), "../data/bossKits.ts"),
      "utf8",
    );
    assert.equal(
      firstPhaseId(src, "twin_monarchs", "phase1SpellIds"),
      "spell-rallying-cry",
    );
    assert.equal(
      firstPhaseId(src, "twin_monarchs", "phase2SpellIds"),
      "spell-rallying-cry",
    );
  });

  it("does not steal Strike, Slow, Iron Skin, Inferno, Swap, Mark, or Mirror", () => {
    assert.equal(isBossKitHealBuffExecuteSpell(physicalAttackSpell), false);
    assert.equal(isBossKitHealBuffExecuteSpell(mustSpell("spell-slow")), false);
    assert.equal(
      isBossKitHealBuffExecuteSpell(mustSpell("spell-iron-skin")),
      false,
      "#843 owns buff-only Iron Skin",
    );
    assert.equal(
      isBossKitHealBuffExecuteSpell(mustSpell("spell-enrage")),
      false,
    );
    assert.equal(
      isBossKitHealBuffExecuteSpell(mustSpell("spell-haste")),
      false,
    );
    assert.equal(
      isBossKitHealBuffExecuteSpell(mustSpell("spell-inferno")),
      false,
    );
    assert.equal(isBossKitHealBuffExecuteSpell(mustSpell("spell-swap")), false);
    assert.equal(isBossKitHealBuffExecuteSpell(mustSpell("spell-mark")), false);
    assert.equal(
      isBossKitHealBuffExecuteSpell(mustSpell("spell-mirror")),
      false,
    );
    assert.equal(
      isBossKitHealBuffExecuteSpell(mustSpell("spell-barrier")),
      false,
    );
  });

  it("live WX apply kinds heal Rallying Cry but miss advertised CHC", () => {
    const cry = mustSpell("spell-rallying-cry");
    assert.deepEqual(wxBossKitApplyKinds(cry), ["heal"]);
    assert.equal(
      wxBossKitApplyKinds(cry).includes("buff"),
      false,
      "heal else-if never reaches the buff arm",
    );
    assert.deepEqual(wxBossKitApplyKinds(mustSpell("spell-iron-skin")), []);
    assert.notDeepEqual(wxBossKitApplyKinds(physicalAttackSpell), []);
    assert.ok(wxBossKitApplyKinds(mustSpell("spell-slow")).includes("debuff"));
  });

  it("executes self Rallying Cry on the boss tile even when decide aimed at the player", () => {
    const cry = mustSpell("spell-rallying-cry");
    const boss = { x: 4, y: 4 };
    const player = { x: 8, y: 8 };
    assert.equal(
      enemyCastRangeOk(boss, player, cry),
      false,
      "raw player dest vs range 0 must not be the execute gate",
    );
    assert.deepEqual(bossKitHealBuffApplyCell(cry, boss, player), boss);
    const decided = shouldDecideBossKitHealBuffCast({
      spell: cry,
      origin: boss,
      targetCell: player,
    });
    const executable = canExecuteBossKitHealBuffCast({
      spell: cry,
      origin: boss,
      targetCell: player,
    });
    assert.equal(bossKitHealBuffInRange(boss, player, cry), true);
    assert.equal(decided, true);
    assert.equal(executable, true);
    assert.equal(
      bossKitHighlightedHealBuffIsExecutable({ decided, executable }),
      true,
    );
    assert.deepEqual(
      executeBossKitHealBuffCast({
        spell: cry,
        origin: boss,
        targetCell: player,
      }),
      {
        tile: { x: 4, y: 4 },
        heal: 20,
        buff: { stat: "chc", modifier: 0.15, duration: 2 },
      },
    );
    assert.deepEqual(bossKitHealBuffEffectFields(cry)?.buff, {
      stat: "chc",
      modifier: 0.15,
      duration: 2,
    });
  });

  it("executes Blood Mend advertised heal 12 + CHC without stealing Iron Skin", () => {
    const mend = mustSpell("starter-heal");
    const origin = { x: 3, y: 5 };
    const player = { x: 9, y: 1 };
    assert.deepEqual(
      executeBossKitHealBuffCast({
        spell: mend,
        origin,
        targetCell: player,
      }),
      {
        tile: { x: 3, y: 5 },
        heal: 12,
        buff: { stat: "chc", modifier: 0.15, duration: 2 },
      },
    );
    assert.equal(
      executeBossKitHealBuffCast({
        spell: mustSpell("spell-iron-skin"),
        origin,
        targetCell: player,
      }),
      null,
    );
  });

  it("cannot execute Strike or Iron Skin as a kit heal+buff even when in range", () => {
    const origin = { x: 4, y: 4 };
    const dest = { x: 4, y: 4 };
    assert.equal(
      canExecuteBossKitHealBuffCast({
        spell: physicalAttackSpell,
        origin,
        targetCell: dest,
      }),
      false,
    );
    assert.equal(
      canExecuteBossKitHealBuffCast({
        spell: mustSpell("spell-iron-skin"),
        origin,
        targetCell: dest,
      }),
      false,
    );
    assert.equal(
      executeBossKitHealBuffCast({
        spell: mustSpell("spell-mirror"),
        origin,
        targetCell: dest,
      }),
      null,
    );
  });
});
