/**
 * Combat action parity: boss kit Inferno ignores advertised cooldown 3.
 * Live decide always passes an empty Map; kit apply writes CD but never gates.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { starterSpells } from "../data/spellData.ts";
import type { ActiveEffect } from "../types/gameTypes.ts";
import {
  BOSS_KIT_INFERNO_ADVERTISED_COOLDOWN,
  BOSS_KIT_INFERNO_DOT_DURATION,
  BOSS_KIT_INFERNO_DOT_PER_TURN,
  BOSS_KIT_INFERNO_SPELL_ID,
  CRIMSON_COUNTESS_ID,
  CRIMSON_COUNTESS_KIT_FIRST_ID,
  armBossKitSpellCooldown,
  canCastBossKitSpellWithCooldown,
  liveWxBossKitApplyGatesOnCooldown,
  liveWxBossKitDecidePassesEmptyCooldownMap,
  liveWxPackEnemyFiltersAvailableSpellsByCooldown,
  liveWxPickBossKitSpellWithEmptyMap,
  pickBossKitSpellHonoringCooldown,
  remainingBossKitSpellCooldown,
  simulateCrimsonCountessInfernoCooldown,
  tickBossKitSpellCooldown,
} from "./bossKitInfernoCooldown.ts";
import { appendDotStack, sumDotTicks } from "./dotStacks.ts";

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

function wxPackAvailableSpellsBlock(): string {
  const wx = wxSource();
  const start = wx.indexOf(
    "const enemyCooldownMap =\n          enemyCooldownsRef.current.get(enemyId) ?? new Map<string, number>();",
  );
  assert.ok(start >= 0, "live pack enemyCooldownMap read is present");
  const end = wx.indexOf("// Build AICombatant[] from prevEnemies", start);
  assert.ok(end > start, "AICombatant build still follows availableSpells");
  return wx.slice(start, end);
}

describe("boss kit Inferno advertised cooldown 3", () => {
  it("catalog Inferno keeps CD 3 / 8 burn and Countess phase-1 first-id", () => {
    const inferno = starterSpells.find(
      (s) => s.id === BOSS_KIT_INFERNO_SPELL_ID,
    );
    assert.ok(inferno);
    assert.equal(Number(inferno?.damage), 0);
    assert.equal(inferno?.cooldown, BOSS_KIT_INFERNO_ADVERTISED_COOLDOWN);
    assert.equal(inferno?.dotDamagePerTurn, BOSS_KIT_INFERNO_DOT_PER_TURN);
    assert.equal(inferno?.dotDuration, BOSS_KIT_INFERNO_DOT_DURATION);
    assert.equal(inferno?.isDotSpell, true);

    const onlyCooldown = starterSpells.filter(
      (s) => typeof s.cooldown === "number" && s.cooldown > 0,
    );
    assert.deepEqual(
      onlyCooldown.map((s) => s.id),
      [BOSS_KIT_INFERNO_SPELL_ID],
      "Inferno is the only catalog spell with a positive cooldown today",
    );

    assert.equal(CRIMSON_COUNTESS_KIT_FIRST_ID, BOSS_KIT_INFERNO_SPELL_ID);
    const kits = bossKitsSource();
    const heading = kits.indexOf(`${CRIMSON_COUNTESS_ID}: {`);
    assert.ok(heading >= 0, "crimson_countess kit is present");
    const phase1 = kits.indexOf("phase1SpellIds:", heading);
    assert.ok(phase1 > heading, "crimson_countess has phase1SpellIds");
    const firstIdLine = kits.slice(phase1, phase1 + 120);
    assert.ok(
      firstIdLine.includes(`"${BOSS_KIT_INFERNO_SPELL_ID}"`),
      "crimson_countess phase 1 first-id is Inferno",
    );
    assert.ok(
      firstIdLine.includes('"starter-drain"'),
      "crimson_countess phase 1 still lists starter-drain as fallback",
    );
  });

  it("live decide always empty-Map; kit apply writes CD without gating; pack filters", () => {
    assert.equal(liveWxBossKitDecidePassesEmptyCooldownMap(), true);
    assert.equal(liveWxBossKitApplyGatesOnCooldown(), false);
    assert.equal(liveWxPackEnemyFiltersAvailableSpellsByCooldown(), true);

    const ai = useBossAiSource();
    assert.ok(
      ai.includes("function pickBossKitSpell("),
      "pickBossKitSpell helper is present",
    );
    assert.ok(
      ai.includes(
        "Cooldown enforcement happens at cast time in WorldExploration.tsx",
      ),
      "decide still claims cast-time CD enforcement",
    );
    const emptyMapHits = ai.split("new Map<string, number>()").length - 1;
    assert.ok(
      emptyMapHits >= 19,
      `every boss decide still passes an empty Map (found ${emptyMapHits})`,
    );
    assert.equal(
      ai.includes("enemyCooldownsRef"),
      false,
      "useBossAI still never reads enemyCooldownsRef",
    );

    const kit = wxBossKitApplyBlock();
    assert.ok(
      kit.includes("bcdm.set(bossSpell.id, bossSpell.cooldown)"),
      "kit apply still arms enemyCooldownsRef after cast",
    );
    assert.equal(
      kit.includes("enemyCooldownMap.get"),
      false,
      "kit apply still never reads remaining CD before casting",
    );
    assert.equal(kit.includes("(enemyCooldownMap.get(s.id) ?? 0) <= 0"), false);
    assert.equal(kit.includes("pickBossKitSpellHonoringCooldown"), false);
    assert.equal(kit.includes("canCastBossKitSpellWithCooldown"), false);
    assert.equal(wxSource().includes("executeBossKitInferno"), false);

    const pack = wxPackAvailableSpellsBlock();
    assert.ok(pack.includes("availableSpells"));
    assert.ok(
      pack.includes("(enemyCooldownMap.get(s.id) ?? 0) <= 0"),
      "pack enemies still filter availableSpells by live CD",
    );

    const wx = wxSource();
    assert.ok(
      wx.includes("if (turns > 0) myMap.set(sid, turns - 1)"),
      "enemy turn-start still ticks enemyCooldownsRef",
    );
  });

  it("honours CD 3: Inferno then Drain; live empty-Map re-casts Inferno every turn", () => {
    const pool = [BOSS_KIT_INFERNO_SPELL_ID, "starter-drain"] as const;
    const armed = new Map<string, number>([
      [BOSS_KIT_INFERNO_SPELL_ID, BOSS_KIT_INFERNO_ADVERTISED_COOLDOWN],
    ]);

    assert.equal(
      canCastBossKitSpellWithCooldown(armed, BOSS_KIT_INFERNO_SPELL_ID),
      false,
    );
    assert.equal(
      pickBossKitSpellHonoringCooldown(pool, armed),
      "starter-drain",
      "advertised decide falls through to Drain while Inferno CD remains",
    );
    assert.equal(
      liveWxPickBossKitSpellWithEmptyMap(pool),
      BOSS_KIT_INFERNO_SPELL_ID,
      "live empty-Map decide still returns Inferno while the live map holds CD 3",
    );

    assert.equal(tickBossKitSpellCooldown(armed, BOSS_KIT_INFERNO_SPELL_ID), 2);
    assert.equal(tickBossKitSpellCooldown(armed, BOSS_KIT_INFERNO_SPELL_ID), 1);
    assert.equal(tickBossKitSpellCooldown(armed, BOSS_KIT_INFERNO_SPELL_ID), 0);
    assert.equal(
      remainingBossKitSpellCooldown(armed, BOSS_KIT_INFERNO_SPELL_ID),
      0,
    );
    assert.equal(
      pickBossKitSpellHonoringCooldown(pool, armed),
      BOSS_KIT_INFERNO_SPELL_ID,
    );

    const fresh = new Map<string, number>();
    armBossKitSpellCooldown(
      fresh,
      BOSS_KIT_INFERNO_SPELL_ID,
      BOSS_KIT_INFERNO_ADVERTISED_COOLDOWN,
    );
    assert.equal(
      remainingBossKitSpellCooldown(fresh, BOSS_KIT_INFERNO_SPELL_ID),
      3,
    );
  });

  it("four Countess turns: live 4 Inferno stacks vs advertised Inferno/Drain/Drain/Inferno", () => {
    const seq = simulateCrimsonCountessInfernoCooldown(4);
    assert.deepEqual(seq.liveDecides, [
      BOSS_KIT_INFERNO_SPELL_ID,
      BOSS_KIT_INFERNO_SPELL_ID,
      BOSS_KIT_INFERNO_SPELL_ID,
      BOSS_KIT_INFERNO_SPELL_ID,
    ]);
    assert.equal(seq.liveInfernoCasts, 4);
    assert.deepEqual(seq.advertisedDecides, [
      BOSS_KIT_INFERNO_SPELL_ID,
      "starter-drain",
      "starter-drain",
      BOSS_KIT_INFERNO_SPELL_ID,
    ]);
    assert.equal(seq.advertisedInfernoCasts, 2);

    const three = simulateCrimsonCountessInfernoCooldown(3);
    assert.equal(three.liveInfernoCasts, 3);
    assert.equal(three.advertisedInfernoCasts, 1);
    assert.equal(three.liveInfernoCasts * BOSS_KIT_INFERNO_DOT_PER_TURN, 24);
    assert.equal(
      three.advertisedInfernoCasts * BOSS_KIT_INFERNO_DOT_PER_TURN,
      8,
    );

    let stacked: ActiveEffect[] = [];
    for (let i = 0; i < three.liveInfernoCasts; i++) {
      stacked = appendDotStack(stacked, {
        id: `boss-dot-${i}`,
        effectName: "Inferno DoT",
        type: "dot",
        targetId: "player",
        duration: BOSS_KIT_INFERNO_DOT_DURATION,
        iconEmoji: "\u2620\uFE0F",
        description: `${BOSS_KIT_INFERNO_DOT_PER_TURN} dmg/turn`,
        dotDamagePerTurn: BOSS_KIT_INFERNO_DOT_PER_TURN,
      });
    }
    assert.equal(sumDotTicks(stacked, "player"), 24);
    assert.equal(sumDotTicks(stacked.slice(0, 1), "player"), 8);
  });
});
