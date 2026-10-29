/**
 * Boss kit Inferno ignores advertised cooldown 3.
 *
 * Catalog Inferno (`spell-inferno`): `cooldown: 3`, `damage: 0`, burn DoT
 * 8/turn for 3 turns. Crimson Countess phase-1 first-id is Inferno
 * (`bossKits` `phase1SpellIds[0]`).
 *
 * `pickBossKitSpell` is documented to honour a cooldown map, but every
 * `useBossAI` decide call passes `new Map()` so Inferno is always the
 * first "off-cooldown" pick. The comment claims cast-time enforcement
 * lives in WorldExploration; the kit apply arm (~15974) only WRITES
 * `enemyCooldownsRef` after the cast — it never gates before applying
 * the DoT. Pack enemies correctly filter `availableSpells` by the live
 * map (~16266). Cooldowns are decremented at every enemy turn start
 * (~15501) including bosses, so the written Inferno CD ticks down unused.
 *
 * Sequence: Crimson Countess kit Inferno three consecutive boss turns →
 * advertised one stack then Drain fill while CD ticks; live three stacked
 * 8-tick burns (24 dmg/turn) because decide never reads the armed CD.
 *
 * Unique vs:
 * - **#1150 / #1166 / #1211 / #1206 / #1214** summon-control / bomber
 *   Inferno CD (player-side summon kit, not boss kit decide)
 * - **#972** pack Inferno CD arm outside `damage > 0` (pack CAST path)
 * - **#947 / #967** pack DoT execute / decide
 * - **#1269** Broodmother Archer cap (summon cap, not Inferno CD)
 * - **#1280** kit caster dest occupancy
 * - **#1272** Paper Windstorm kit miss (damage arm, not CD)
 *
 * Do not restack WorldExploration / useBossAI / spellEngine / enemyAI.
 * Restack decide onto `pickBossKitSpellHonoringCooldown(pool, liveMap)`
 * and gate the kit apply arm with `canCastBossKitSpellWithCooldown`
 * after older combat PRs land. Do not change Inferno's advertised
 * cooldown value (balance).
 */

export const CRIMSON_COUNTESS_ID = "crimson_countess";

/** Phase-1 first kit id (`bossKits` `phase1SpellIds[0]`). */
export const CRIMSON_COUNTESS_KIT_FIRST_ID = "spell-inferno";

/** Catalog Inferno — only starter spell that declares `cooldown`. */
export const BOSS_KIT_INFERNO_SPELL_ID = "spell-inferno";

export const BOSS_KIT_INFERNO_ADVERTISED_COOLDOWN = 3;

export const BOSS_KIT_INFERNO_DOT_PER_TURN = 8;

export const BOSS_KIT_INFERNO_DOT_DURATION = 3;

/**
 * Live leftover — every `useBossAI` decide call passes `new Map()` into
 * `pickBossKitSpell`, so the live enemy cooldown map is never consulted.
 */
export function liveWxBossKitDecidePassesEmptyCooldownMap(): boolean {
  return true;
}

/**
 * Live leftover — kit apply writes Inferno into `enemyCooldownsRef` after
 * the cast but never refuses the cast when remaining turns > 0.
 */
export function liveWxBossKitApplyGatesOnCooldown(): boolean {
  return false;
}

/**
 * Pack CAST leftover contrast: regular enemies filter `availableSpells`
 * with `(enemyCooldownMap.get(s.id) ?? 0) <= 0` before decide.
 */
export function liveWxPackEnemyFiltersAvailableSpellsByCooldown(): boolean {
  return true;
}

export function remainingBossKitSpellCooldown(
  cooldownMap: ReadonlyMap<string, number> | null | undefined,
  spellId: string,
): number {
  if (!cooldownMap) return 0;
  const remaining = cooldownMap.get(spellId);
  if (remaining === undefined) return 0;
  const n = Number(remaining);
  if (!Number.isFinite(n) || n <= 0) return 0;
  return Math.floor(n);
}

export function canCastBossKitSpellWithCooldown(
  cooldownMap: ReadonlyMap<string, number> | null | undefined,
  spellId: string,
): boolean {
  return remainingBossKitSpellCooldown(cooldownMap, spellId) <= 0;
}

/**
 * Advertised decide: first pool id whose remaining cooldown is <= 0.
 * Mirrors `pickBossKitSpell` once it receives the live map.
 */
export function pickBossKitSpellHonoringCooldown(
  pool: readonly string[],
  cooldownMap: ReadonlyMap<string, number> | null | undefined,
): string | null {
  for (const spellId of pool) {
    if (canCastBossKitSpellWithCooldown(cooldownMap, spellId)) {
      return spellId;
    }
  }
  return null;
}

/**
 * Live decide leftover: empty Map → first pool id always (Inferno for
 * Crimson Countess phase 1), even when the live map still holds CD 3/2/1.
 */
export function liveWxPickBossKitSpellWithEmptyMap(
  pool: readonly string[],
): string | null {
  return pickBossKitSpellHonoringCooldown(pool, new Map());
}

export function armBossKitSpellCooldown(
  cooldownMap: Map<string, number>,
  spellId: string,
  turns: number,
): Map<string, number> {
  const n = Number(turns);
  if (!Number.isFinite(n) || n <= 0) return cooldownMap;
  cooldownMap.set(spellId, Math.floor(n));
  return cooldownMap;
}

/**
 * Tick one enemy-turn of remaining CD (WX ~15501–15505). Returns the
 * remaining turns for `spellId` after the tick (0 when cleared).
 */
export function tickBossKitSpellCooldown(
  cooldownMap: Map<string, number>,
  spellId: string,
): number {
  const remaining = remainingBossKitSpellCooldown(cooldownMap, spellId);
  if (remaining <= 0) {
    cooldownMap.delete(spellId);
    return 0;
  }
  const next = remaining - 1;
  if (next <= 0) {
    cooldownMap.delete(spellId);
    return 0;
  }
  cooldownMap.set(spellId, next);
  return next;
}

export type BossKitInfernoCooldownSequence = {
  /** Spell id decided each boss turn under the live empty-Map leftover. */
  liveDecides: string[];
  /** Spell id decided each boss turn when the live map is honoured. */
  advertisedDecides: Array<string | null>;
  /** Stacked Inferno DoT applications under the live leftover. */
  liveInfernoCasts: number;
  /** Inferno casts when CD 3 is honoured across the same turns. */
  advertisedInfernoCasts: number;
};

/**
 * Crimson Countess phase-1 pool over `turns` boss turns.
 * Live: Inferno every turn. Advertised: Inferno, then CD 3 ticks at each
 * following turn start before decide (WX ~15501) so Drain fills the gap
 * until remaining hits 0 — Inferno again on the 4th turn after a cast.
 */
export function simulateCrimsonCountessInfernoCooldown(
  turns: number,
  pool: readonly string[] = [BOSS_KIT_INFERNO_SPELL_ID, "starter-drain"],
): BossKitInfernoCooldownSequence {
  const liveDecides: string[] = [];
  const advertisedDecides: Array<string | null> = [];
  let liveInfernoCasts = 0;
  let advertisedInfernoCasts = 0;
  const liveMap = new Map<string, number>();
  const advertisedMap = new Map<string, number>();

  for (let i = 0; i < turns; i++) {
    // Turn-start tick (WX ~15501) before decide — matches pack / boss apply.
    tickBossKitSpellCooldown(liveMap, BOSS_KIT_INFERNO_SPELL_ID);
    tickBossKitSpellCooldown(advertisedMap, BOSS_KIT_INFERNO_SPELL_ID);

    const livePick = liveWxPickBossKitSpellWithEmptyMap(pool);
    liveDecides.push(livePick ?? "");
    if (livePick === BOSS_KIT_INFERNO_SPELL_ID) {
      liveInfernoCasts += 1;
      // Live still writes CD after cast — unused by the next empty-Map decide.
      armBossKitSpellCooldown(
        liveMap,
        BOSS_KIT_INFERNO_SPELL_ID,
        BOSS_KIT_INFERNO_ADVERTISED_COOLDOWN,
      );
    }

    const advertisedPick = pickBossKitSpellHonoringCooldown(
      pool,
      advertisedMap,
    );
    advertisedDecides.push(advertisedPick);
    if (advertisedPick === BOSS_KIT_INFERNO_SPELL_ID) {
      advertisedInfernoCasts += 1;
      armBossKitSpellCooldown(
        advertisedMap,
        BOSS_KIT_INFERNO_SPELL_ID,
        BOSS_KIT_INFERNO_ADVERTISED_COOLDOWN,
      );
    }
  }

  return {
    liveDecides,
    advertisedDecides,
    liveInfernoCasts,
    advertisedInfernoCasts,
  };
}
