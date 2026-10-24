/**
 * Combat action parity: pack-enemy `decideHealer` selects advertised
 * range-0 self-heals when the caster is wounded and no ally path fired.
 * A decided legal caster-tile Blood Mend is executable; an illegal dest
 * cannot execute; live ally-exclude still skips.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { ENEMY_HEAL_ALLY_THRESHOLD_PCT } from "../data/gameConstants.ts";
import { physicalAttackSpell, starterSpells } from "../data/spellData.ts";
import { buildEnemyKit } from "./enemyAI.ts";
import { enemyCastRangeOk, enemySpellRange } from "./targeting.ts";
import {
  canExecuteWxEnemyHealDecidePickerCast,
  isWxEnemyHealDecidePickerSpell,
  pickWxEnemyHealDecideSpell,
  shouldDecideWxEnemyHealPickerCast,
  wxEnemyHealCasterIsWounded,
  wxEnemyHealDecidePickerInRange,
  wxEnemyHealDecidePickerRange,
  wxEnemyHealDecideTargetId,
  wxEnemyHealLiveDecideHealerMovesToAlly,
  wxEnemyHealLiveDecideHealerSelectsAllyCast,
  wxEnemyHealLiveHealSpell,
  wxEnemyHealLiveHpFrac,
  wxEnemyHealLiveWoundedAlly,
  wxEnemyHealPickerHighlightedTargetIsExecutable,
} from "./wxEnemyHealDecidePicker.ts";

function mustSpell(id: string) {
  const spell = starterSpells.find((s) => s.id === id);
  assert.ok(spell, id);
  return spell;
}

function unit(
  id: string,
  x: number,
  y: number,
  hp: number,
  maxHp = 100,
  side: "player" | "enemy" = "enemy",
) {
  return { id, x, y, hp, maxHp, side };
}

describe("WX enemy decideHealer vs advertised range-0 self-heal", () => {
  const mend = mustSpell("starter-heal");
  const cry = mustSpell("spell-rallying-cry");
  const frost = mustSpell("starter-frost");
  const origin = { x: 4, y: 4 };
  const woundedQueen = unit("queen-1", 4, 4, 40);

  it("treats catalog Blood Mend and Rallying Cry as range-0 heal picker spells", () => {
    assert.equal(mend.spellType, "heal");
    assert.equal(Number(mend.healAmount), 12);
    assert.equal(Number(mend.range), 0);
    assert.equal(mend.targetType, "self");
    assert.equal(mend.buffStat, "chc");
    assert.equal(isWxEnemyHealDecidePickerSpell(mend), true);
    assert.equal(wxEnemyHealDecidePickerRange(mend), 0);
    assert.equal(wxEnemyHealDecidePickerRange(mend), enemySpellRange(mend));
    assert.equal(cry.spellType, "heal");
    assert.equal(Number(cry.healAmount), 20);
    assert.equal(cry.usableByEnemy, false);
    assert.equal(isWxEnemyHealDecidePickerSpell(cry), true);
  });

  it("queen z>=1 kit carries Blood Mend; king Rallying Cry is not usableByEnemy", () => {
    assert.deepEqual(buildEnemyKit("queen", 1), [
      "starter-frost",
      "starter-heal",
    ]);
    assert.deepEqual(buildEnemyKit("queen", 2), [
      "spell-inferno",
      "starter-heal",
    ]);
    assert.equal(buildEnemyKit("queen", 0).includes("starter-heal"), false);
    assert.deepEqual(buildEnemyKit("king", 1), [
      "starter-frost",
      "spell-rallying-cry",
    ]);
    assert.equal(buildEnemyKit("rook", 1).includes("starter-heal"), false);
  });

  it("keys off metadata, not the display name", () => {
    assert.equal(
      isWxEnemyHealDecidePickerSpell({
        spellType: "heal",
        healAmount: 9,
        range: 0,
        targetType: "self",
      }),
      true,
    );
    assert.equal(
      isWxEnemyHealDecidePickerSpell({
        spellType: "heal",
        healAmount: 12,
        range: 3,
        targetType: "ally",
      }),
      false,
      "ranged ally heal is live decideHealer, not this leftover",
    );
    assert.equal(
      isWxEnemyHealDecidePickerSpell({
        spellType: "heal",
        healAmount: 12,
        range: 0,
        targetType: "self",
      }),
      true,
      "heal-only without buffStat still feeds #757 HP decide",
    );
  });

  it("does not steal Strike, Slow, Iron Skin, Inferno, Drain, Frost, or Poison", () => {
    assert.equal(isWxEnemyHealDecidePickerSpell(physicalAttackSpell), false);
    assert.equal(
      isWxEnemyHealDecidePickerSpell(mustSpell("spell-slow")),
      false,
      "#528/#878 own 0-damage Slow",
    );
    assert.equal(
      isWxEnemyHealDecidePickerSpell(mustSpell("spell-iron-skin")),
      false,
      "#978/#974 own buff decide/execute",
    );
    assert.equal(
      isWxEnemyHealDecidePickerSpell(mustSpell("starter-shield")),
      false,
    );
    assert.equal(
      isWxEnemyHealDecidePickerSpell(mustSpell("spell-inferno")),
      false,
      "#967/#947 own Inferno decide/execute",
    );
    assert.equal(
      isWxEnemyHealDecidePickerSpell(mustSpell("starter-drain")),
      false,
      "#921 owns Life Drain SP; live healSpell can still pick drain",
    );
    assert.equal(isWxEnemyHealDecidePickerSpell(frost), false);
    assert.equal(
      isWxEnemyHealDecidePickerSpell(mustSpell("starter-poison")),
      false,
    );
    assert.equal(
      isWxEnemyHealDecidePickerSpell(mustSpell("spell-swap")),
      false,
    );
  });

  it("live decideHealer still excludes the caster and never reads enemy HP", () => {
    const ai = readFileSync(
      join(dirname(fileURLToPath(import.meta.url)), "enemyAI.ts"),
      "utf8",
    );
    const decideStart = ai.indexOf("export function decideEnemyAction");
    assert.ok(decideStart >= 0);
    const decideBody = ai.slice(decideStart, decideStart + 900);
    assert.ok(decideBody.includes('c.side === "enemy" && c.id !== enemy.id'));
    const healerStart = ai.indexOf("function decideHealer");
    assert.ok(healerStart >= 0);
    const healerBody = ai.slice(healerStart, healerStart + 900);
    assert.ok(healerBody.includes("hpFrac(a) < ENEMY_HEAL_ALLY_THRESHOLD_PCT"));
    assert.ok(healerBody.includes("dist <= enemySpellRange(healSpell)"));
    assert.equal(
      healerBody.includes("hpFrac(ctx.enemy)"),
      false,
      "live decideHealer never considers the caster as the heal target",
    );
    const wx = readFileSync(
      join(
        dirname(fileURLToPath(import.meta.url)),
        "../components/WorldExploration.tsx",
      ),
      "utf8",
    );
    assert.ok(wx.includes("if (e.id === enemyId) continue;"));
    assert.equal(ENEMY_HEAL_ALLY_THRESHOLD_PCT, 0.5);
  });

  it("live healSpell is first heal/healAmount; queen Blood Mend wins over Frost", () => {
    const available = [frost, mend];
    assert.equal(wxEnemyHealLiveHealSpell(available)?.id, "starter-heal");
    assert.equal(
      wxEnemyHealLiveHealSpell([frost, mustSpell("spell-inferno")]),
      undefined,
    );
    assert.equal(
      wxEnemyHealLiveHealSpell([mustSpell("starter-drain"), mend])?.id,
      "starter-drain",
      "live find() can pick drain via healAmount before Blood Mend",
    );
  });

  it("picks Blood Mend on a wounded queen when no ally path fired", () => {
    const available = [frost, mend];
    assert.equal(wxEnemyHealCasterIsWounded(woundedQueen), true);
    assert.equal(wxEnemyHealLiveHpFrac(woundedQueen), 0.4);
    assert.equal(
      wxEnemyHealLiveDecideHealerSelectsAllyCast({
        availableSpells: available,
        origin,
        allies: [],
      }),
      false,
    );
    assert.equal(
      wxEnemyHealLiveDecideHealerMovesToAlly({
        availableSpells: available,
        origin,
        allies: [],
      }),
      false,
    );
    assert.equal(
      pickWxEnemyHealDecideSpell({
        availableSpells: available,
        origin,
        allies: [],
        caster: woundedQueen,
      })?.id,
      "starter-heal",
    );
    const decided = shouldDecideWxEnemyHealPickerCast({
      spell: mend,
      origin,
      targetCell: origin,
      caster: woundedQueen,
    });
    const executable = canExecuteWxEnemyHealDecidePickerCast({
      spell: mend,
      origin,
      targetCell: origin,
      caster: woundedQueen,
    });
    assert.equal(decided, true);
    assert.equal(executable, true);
    assert.equal(
      wxEnemyHealPickerHighlightedTargetIsExecutable({ decided, executable }),
      true,
    );
    assert.equal(wxEnemyHealDecideTargetId("queen-1"), "queen-1");
    assert.equal(wxEnemyHealDecidePickerInRange(origin, origin, mend), true);
  });

  it("does not steal Frost when the queen is healthy", () => {
    const healthy = unit("queen-1", 4, 4, 80);
    assert.equal(wxEnemyHealCasterIsWounded(healthy), false);
    assert.equal(
      pickWxEnemyHealDecideSpell({
        availableSpells: [frost, mend],
        origin,
        allies: [],
        caster: healthy,
      }),
      null,
    );
  });

  it("does not steal live move-toward-wounded-ally on range-0 Blood Mend", () => {
    const ally = unit("pawn-2", 6, 4, 20);
    const available = [frost, mend];
    assert.equal(wxEnemyHealLiveWoundedAlly([ally])?.id, "pawn-2");
    assert.equal(wxEnemyHealDecidePickerInRange(origin, ally, mend), false);
    assert.equal(enemyCastRangeOk(origin, ally, mend), false);
    assert.equal(
      wxEnemyHealLiveDecideHealerSelectsAllyCast({
        availableSpells: available,
        origin,
        allies: [ally],
      }),
      false,
    );
    assert.equal(
      wxEnemyHealLiveDecideHealerMovesToAlly({
        availableSpells: available,
        origin,
        allies: [ally],
      }),
      true,
    );
    assert.equal(
      pickWxEnemyHealDecideSpell({
        availableSpells: available,
        origin,
        allies: [ally],
        caster: woundedQueen,
      }),
      null,
      "range-0 vs a wounded ally is live kind:move, not this leftover",
    );
  });

  it("does not steal an in-range ranged ally heal from live decideHealer", () => {
    const allyHeal = {
      id: "ally-mend",
      spellType: "heal" as const,
      healAmount: 12,
      range: 3,
      targetType: "ally" as const,
    };
    const ally = unit("pawn-2", 6, 4, 20);
    assert.equal(isWxEnemyHealDecidePickerSpell(allyHeal), false);
    assert.equal(
      wxEnemyHealLiveDecideHealerSelectsAllyCast({
        availableSpells: [allyHeal],
        origin,
        allies: [ally],
      }),
      true,
    );
    assert.equal(
      pickWxEnemyHealDecideSpell({
        availableSpells: [allyHeal],
        origin,
        allies: [ally],
        caster: woundedQueen,
      }),
      null,
    );
  });

  it("does not pick Blood Mend when live healSpell is drain", () => {
    const drain = mustSpell("starter-drain");
    assert.equal(
      pickWxEnemyHealDecideSpell({
        availableSpells: [drain, mend],
        origin,
        allies: [],
        caster: woundedQueen,
      }),
      null,
      "first live healSpell is drain — do not skip it to Blood Mend",
    );
  });

  it("does not invent king Rallying Cry when it is missing from availableSpells", () => {
    assert.equal(
      pickWxEnemyHealDecideSpell({
        availableSpells: [frost],
        origin,
        allies: [],
        caster: unit("king-1", 4, 4, 40),
      }),
      null,
    );
    assert.equal(
      pickWxEnemyHealDecideSpell({
        availableSpells: [frost, cry],
        origin,
        allies: [],
        caster: unit("king-1", 4, 4, 40),
      })?.id,
      "spell-rallying-cry",
      "only when an admin/catalog path actually lists Rallying Cry",
    );
  });

  it("cannot execute a distant ally dest, corpse caster, Strike, or Iron Skin", () => {
    const ally = { x: 6, y: 4 };
    assert.equal(wxEnemyHealDecidePickerInRange(origin, ally, mend), false);
    assert.equal(
      canExecuteWxEnemyHealDecidePickerCast({
        spell: mend,
        origin,
        targetCell: ally,
        caster: woundedQueen,
      }),
      false,
    );
    assert.equal(
      canExecuteWxEnemyHealDecidePickerCast({
        spell: mend,
        origin,
        targetCell: origin,
        caster: unit("queen-1", 4, 4, 0),
      }),
      false,
    );
    assert.equal(
      canExecuteWxEnemyHealDecidePickerCast({
        spell: physicalAttackSpell,
        origin,
        targetCell: origin,
        caster: woundedQueen,
      }),
      false,
    );
    assert.equal(
      canExecuteWxEnemyHealDecidePickerCast({
        spell: mustSpell("spell-iron-skin"),
        origin,
        targetCell: origin,
        caster: woundedQueen,
      }),
      false,
    );
    assert.equal(
      wxEnemyHealPickerHighlightedTargetIsExecutable({
        decided: false,
        executable: false,
      }),
      false,
    );
  });

  it("still decides a wall-blocked caster-tile Blood Mend (healer LoS is off)", () => {
    assert.equal(
      canExecuteWxEnemyHealDecidePickerCast({
        spell: mend,
        origin,
        targetCell: origin,
        caster: woundedQueen,
      }),
      true,
      "catalog Blood Mend has no lineOfSight; live decideHealer skips LoS",
    );
  });

  it("does not debit AP on pack-enemy heal decide (WX never spends enemy AP)", () => {
    assert.equal(Number(mend.apCost), 3);
    assert.equal(Number(cry.apCost), 4);
    assert.equal(
      canExecuteWxEnemyHealDecidePickerCast({
        spell: mend,
        origin,
        targetCell: origin,
        caster: woundedQueen,
      }),
      true,
      "do not merge summon applyCast AP (#862) onto pack WX decide",
    );
  });
});
