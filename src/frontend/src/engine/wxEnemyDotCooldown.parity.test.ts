/**
 * Combat action parity: WX pack-enemy 0-damage DoT arms advertised cooldown.
 * Inferno `cooldown: 3` never starts because `enemyCooldownsRef.set` lives
 * inside the `spellDmg > 0` arm. Poison / Venom have no catalog CD today.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { physicalAttackSpell, starterSpells } from "../data/spellData.ts";
import { buildEnemyKit } from "./enemyAI.ts";
import { enemyCastRangeOk } from "./targeting.ts";
import {
  armWxEnemyDotCooldown,
  canArmWxEnemyDotCooldown,
  isWxEnemyDotCooldownSpell,
  nextWxEnemyDotCooldownMap,
  shouldArmWxEnemyDotCooldown,
  wxEnemyDotAdvertisedCooldownTurns,
  wxEnemyDotAdvertisedWouldArmCooldown,
  wxEnemyDotCooldownInRange,
  wxEnemyDotLiveCooldownArm,
  wxEnemyDotLiveCooldownEntry,
  wxEnemyDotLiveWouldArmCooldown,
  wxEnemyDotNeedsCooldownArm,
} from "./wxEnemyDotCooldown.ts";

function mustSpell(id: string) {
  const spell = starterSpells.find((s) => s.id === id);
  assert.ok(spell, id);
  return spell;
}

function playerAt(id: string, x: number, y: number, hp = 40) {
  return { id, x, y, hp, side: "player" as const };
}

describe("WX enemy advertised 0-damage DoT vs nested-under-damage cooldown", () => {
  const poison = mustSpell("starter-poison");
  const venom = mustSpell("spell-venom-strike");
  const inferno = mustSpell("spell-inferno");
  const origin = { x: 4, y: 4 };

  it("treats catalog Inferno as a 0-damage DoT with cooldown 3", () => {
    assert.equal(inferno.spellType, "damage");
    assert.equal(Number(inferno.damage), 0);
    assert.equal(inferno.isDotSpell, true);
    assert.equal(Number(inferno.dotDamagePerTurn), 8);
    assert.equal(Number(inferno.dotDuration), 3);
    assert.equal(Number(inferno.range), 3);
    assert.equal(Number(inferno.cooldown), 3);
    assert.equal(isWxEnemyDotCooldownSpell(inferno), true);
    assert.equal(wxEnemyDotAdvertisedCooldownTurns(inferno), 3);
    assert.equal(wxEnemyDotNeedsCooldownArm(inferno), true);
    assert.equal(wxEnemyDotAdvertisedWouldArmCooldown(inferno), true);
  });

  it("treats Poison / Venom as 0-damage DoTs with no catalog cooldown", () => {
    assert.equal(isWxEnemyDotCooldownSpell(poison), true);
    assert.equal(isWxEnemyDotCooldownSpell(venom), true);
    assert.equal(Number(poison.cooldown ?? 0), 0);
    assert.equal(Number(venom.cooldown ?? 0), 0);
    assert.equal(wxEnemyDotAdvertisedCooldownTurns(poison), 0);
    assert.equal(wxEnemyDotAdvertisedCooldownTurns(venom), 0);
    assert.equal(wxEnemyDotNeedsCooldownArm(poison), false);
    assert.equal(wxEnemyDotNeedsCooldownArm(venom), false);
  });

  it("queen / king zone-2 kits carry Inferno", () => {
    assert.deepEqual(buildEnemyKit("queen", 2), [
      "spell-inferno",
      "starter-heal",
    ]);
    assert.deepEqual(buildEnemyKit("king", 2), [
      "spell-inferno",
      "spell-rallying-cry",
    ]);
    assert.equal(buildEnemyKit("queen", 1).includes("spell-inferno"), false);
  });

  it("keys off metadata, not the display name", () => {
    assert.equal(
      isWxEnemyDotCooldownSpell({
        id: "custom-burn",
        spellType: "damage",
        damage: 0,
        isDotSpell: true,
        effectType: "dot",
        dotDamagePerTurn: 5,
        dotDuration: 2,
        range: 3,
        cooldown: 4,
      }),
      true,
    );
    assert.equal(
      wxEnemyDotNeedsCooldownArm({
        id: "custom-burn",
        spellType: "damage",
        damage: 0,
        isDotSpell: true,
        effectType: "dot",
        dotDamagePerTurn: 5,
        dotDuration: 2,
        range: 3,
        cooldown: 4,
      }),
      true,
    );
    assert.equal(
      isWxEnemyDotCooldownSpell({
        id: "dot-no-dpt",
        spellType: "damage",
        damage: 0,
        effectType: "dot",
        dotDuration: 3,
        range: 3,
        cooldown: 3,
      }),
      false,
      "DoT flag without advertised dpt is not this gate",
    );
  });

  it("does not steal Strike, Slow, Blood Mend, Drain, Frost, or heal cooldown", () => {
    assert.equal(isWxEnemyDotCooldownSpell(physicalAttackSpell), false);
    assert.equal(isWxEnemyDotCooldownSpell(mustSpell("spell-slow")), false);
    assert.equal(isWxEnemyDotCooldownSpell(mustSpell("starter-heal")), false);
    assert.equal(
      isWxEnemyDotCooldownSpell(mustSpell("spell-rallying-cry")),
      false,
    );
    assert.equal(isWxEnemyDotCooldownSpell(mustSpell("starter-drain")), false);
    assert.equal(isWxEnemyDotCooldownSpell(mustSpell("starter-frost")), false);
    assert.equal(
      isWxEnemyDotCooldownSpell(mustSpell("spell-frost-nova")),
      false,
    );
    assert.equal(wxEnemyDotLiveCooldownArm(physicalAttackSpell), "damage");
    assert.equal(wxEnemyDotLiveCooldownArm(mustSpell("starter-heal")), "heal");
    assert.equal(wxEnemyDotLiveCooldownArm(mustSpell("spell-slow")), "debuff");
  });

  it("live WX cooldown write is nested under spellDmg > 0 with no DoT arm after", () => {
    assert.equal(wxEnemyDotLiveCooldownArm(inferno), null);
    assert.equal(wxEnemyDotLiveWouldArmCooldown(inferno), false);
    assert.equal(wxEnemyDotLiveCooldownEntry(inferno), null);
    assert.equal(wxEnemyDotLiveWouldArmCooldown(poison), false);
    const wx = readFileSync(
      join(
        dirname(fileURLToPath(import.meta.url)),
        "../components/WorldExploration.tsx",
      ),
      "utf8",
    );
    const healStart = wx.indexOf(
      '} else if (inRange && spellType === "heal" && spellRange === 0)',
    );
    assert.ok(healStart > 0, "WX enemy heal arm is present");
    const dmgGate = wx.lastIndexOf("spellDmg > 0", healStart);
    assert.ok(dmgGate > 0, "WX enemy damage arm is present");
    const damageArm = wx.slice(dmgGate, healStart);
    assert.ok(
      damageArm.includes("enemyCooldownsRef.current.set"),
      "damage>0 arm writes enemy cooldown",
    );
    const meleeStart = wx.indexOf(
      'if (action.kind === "melee" || !didAct)',
      healStart,
    );
    assert.ok(meleeStart > healStart);
    const afterDamage = wx.slice(healStart, meleeStart);
    assert.equal(
      afterDamage.includes("dotDamagePerTurn"),
      false,
      "live WX has no standalone 0-damage DoT arm after the damage gate",
    );
  });

  it("arms Inferno cooldown 3 on a legal in-range dest; live nested write does not", () => {
    const dest = { x: 7, y: 4 };
    const occupant = playerAt("player", 7, 4);
    const args = {
      spell: inferno,
      origin,
      targetCell: dest,
      occupant,
      casterSide: "enemy" as const,
    };
    assert.equal(wxEnemyDotCooldownInRange(origin, dest, inferno), true);
    assert.equal(canArmWxEnemyDotCooldown(args), true);
    assert.equal(shouldArmWxEnemyDotCooldown(args), true);
    assert.deepEqual(armWxEnemyDotCooldown(args), {
      spellId: "spell-inferno",
      turns: 3,
    });
    assert.equal(wxEnemyDotLiveCooldownEntry(inferno), null);
    const next = nextWxEnemyDotCooldownMap(
      new Map(),
      armWxEnemyDotCooldown(args),
    );
    assert.equal(next.get("spell-inferno"), 3);
  });

  it("does not arm Poison / Venom until they gain a catalog cooldown", () => {
    const dest = { x: 6, y: 4 };
    const occupant = playerAt("player", 6, 4);
    assert.equal(
      armWxEnemyDotCooldown({
        spell: poison,
        origin,
        targetCell: dest,
        occupant,
        casterSide: "enemy",
      }),
      null,
    );
    assert.equal(
      armWxEnemyDotCooldown({
        spell: venom,
        origin,
        targetCell: dest,
        occupant,
        casterSide: "enemy",
      }),
      null,
    );
    assert.deepEqual(
      armWxEnemyDotCooldown({
        spell: { ...poison, cooldown: 2 },
        origin,
        targetCell: dest,
        occupant,
        casterSide: "enemy",
      }),
      { spellId: "starter-poison", turns: 2 },
    );
  });

  it("cannot arm Inferno beyond Chebyshev 3, on a corpse, ally, or empty tile", () => {
    const tooFar = { x: 8, y: 4 };
    assert.equal(enemyCastRangeOk(origin, tooFar, inferno), false);
    assert.equal(wxEnemyDotCooldownInRange(origin, tooFar, inferno), false);
    assert.equal(
      canArmWxEnemyDotCooldown({
        spell: inferno,
        origin,
        targetCell: tooFar,
        occupant: playerAt("player", 8, 4),
        casterSide: "enemy",
      }),
      false,
    );
    const dest = { x: 7, y: 4 };
    const base = {
      spell: inferno,
      origin,
      targetCell: dest,
      casterSide: "enemy" as const,
    };
    assert.equal(
      canArmWxEnemyDotCooldown({
        ...base,
        occupant: playerAt("player", 7, 4, 0),
      }),
      false,
    );
    assert.equal(
      canArmWxEnemyDotCooldown({
        ...base,
        occupant: { id: "queen-2", x: 7, y: 4, hp: 12, side: "enemy" },
      }),
      false,
    );
    assert.equal(
      canArmWxEnemyDotCooldown({
        ...base,
        occupant: null,
      }),
      false,
    );
  });

  it("cannot arm Strike, Slow, Blood Mend, or Drain as a 0-damage DoT cooldown", () => {
    const dest = { x: 5, y: 4 };
    const occupant = playerAt("player", 5, 4);
    const base = {
      origin,
      targetCell: dest,
      occupant,
      casterSide: "enemy" as const,
    };
    assert.equal(
      canArmWxEnemyDotCooldown({ ...base, spell: physicalAttackSpell }),
      false,
    );
    assert.equal(
      armWxEnemyDotCooldown({
        ...base,
        spell: mustSpell("spell-slow"),
      }),
      null,
    );
    assert.equal(
      armWxEnemyDotCooldown({
        ...base,
        spell: mustSpell("starter-heal"),
      }),
      null,
    );
    assert.equal(
      armWxEnemyDotCooldown({
        ...base,
        spell: mustSpell("starter-drain"),
      }),
      null,
    );
  });

  it("still arms a wall-blocked in-range Inferno (WX skips LoS)", () => {
    const throughWall = { x: 7, y: 4 };
    assert.equal(
      canArmWxEnemyDotCooldown({
        spell: inferno,
        origin,
        targetCell: throughWall,
        occupant: playerAt("player", 7, 4),
        casterSide: "enemy",
      }),
      true,
      "catalog Inferno has no lineOfSight; WX inRange is Chebyshev only",
    );
  });

  it("does not debit AP on pack-enemy DoT cooldown (WX never spends enemy AP)", () => {
    const dest = { x: 6, y: 5 };
    assert.equal(Number(inferno.apCost), 5);
    assert.equal(
      canArmWxEnemyDotCooldown({
        spell: inferno,
        origin,
        targetCell: dest,
        occupant: playerAt("player", 6, 5),
        casterSide: "enemy",
      }),
      true,
      "do not merge summon applyCast AP (#856) onto pack WX cooldown",
    );
  });
});
