/**
 * Pack-enemy Crush / Fire Bolt fallback vs advertised CHC.
 *
 * Motoko `defaultSpells` ids miss every `ENEMY_KITS` id (`physical_attack`,
 * `starter-frost`, …). WorldExploration also strips `physical_attack` via
 * `OLD_SPELL_NAMES_SET`, so `assignEnemySpells` returns `[]`. Adjacent
 * `decideGeneric` then returns `kind: "melee"` (spell null). Enemy hunter
 * summons return the same melee kind for a physical bite.
 *
 * Live WorldExploration fallback then:
 *   rawFB = max(1, round(catalog * max(1, level/5) * enrageMultiplier))
 *   dmgFB = max(1, round(rawFB * (1 - meleeRes / 100)))
 * It never reads `enemy.chc` and never doubles. InitiativeStrip still
 * shows the rolled CHC (L1 pawn 2, L5 knight 4, L10 queen 6).
 *
 * The pack SPELL arm ~230 lines earlier rolls
 *   rng() * 100 < (enemy.chc ?? 2) + (enraged ? 10 : 0)
 *   dmgAC = isCrit ? raw * 2 : raw
 * but that arm is dead under empty kits (open **#911**).
 *
 * Unique vs **#1104** (boss kit catalog raw, no Crush scale), **#924**
 * (WX enemy heal CHC), **#659** (Crush RES soak / playerTakesDamage),
 * **#911** (kit assign — does not add a fallback crit), **#1042**
 * (Windstorm miss on Fire Bolt range 3).
 *
 * Do not add RES / Shield Charm / playerTakesDamage (would steal
 * **#659**). Do not replace Crush 12 / Fire Bolt 8 or the `level/5`
 * scale (would rebalance). WorldExploration left unwired so older
 * WX / **#911** / **#659** / **#1097** PRs stay merge-clean. Restack
 * the fallback melee arm onto `executePackEnemyFallbackMeleeCrit`
 * after those land.
 */

export const PACK_FALLBACK_DEFAULT_CHC = 2;
export const PACK_FALLBACK_ENRAGE_CHC_BONUS = 10;

export const PACK_FALLBACK_CRUSH = {
  id: "e-crush",
  name: "Crush",
  range: 1,
  damage: 12,
} as const;

export const PACK_FALLBACK_FIRE_BOLT = {
  id: "e-firebolt",
  name: "Fire Bolt",
  range: 3,
  damage: 8,
} as const;

export type PackFallbackMeleeHit = {
  id: string;
  name: string;
  range: number;
  damage: number;
};

export type PackFallbackMeleeCritExecute = {
  raw: number;
  isCrit: boolean;
  preSoak: number;
};

export function isPackFallbackMeleeHit(
  hit: PackFallbackMeleeHit | null | undefined,
): boolean {
  if (!hit) return false;
  if (
    hit.id !== PACK_FALLBACK_CRUSH.id &&
    hit.id !== PACK_FALLBACK_FIRE_BOLT.id
  ) {
    return false;
  }
  return Number(hit.damage) > 0;
}

/** Live WX `rawFB` — catalog × max(1, level/5) × enrage. No crit. */
export function wxPackFallbackLiveRaw(args: {
  catalogDamage: number;
  enemyLevel: number;
  enrageMultiplier?: number;
}): number {
  const enrage = args.enrageMultiplier ?? 1;
  return Math.max(
    1,
    Math.round(args.catalogDamage * Math.max(1, args.enemyLevel / 5) * enrage),
  );
}

/** Live WX fallback never rolls CHC. Pack spell arm does. */
export function wxPackFallbackLiveRollsCrit(): boolean {
  return false;
}

/** Same `chc ?? 2` + optional Enrage +10 the pack spell arm uses. */
export function packFallbackMeleeCritChance(args: {
  chc: number | null | undefined;
  enraged?: boolean;
}): number {
  const base =
    args.chc == null || !Number.isFinite(Number(args.chc))
      ? PACK_FALLBACK_DEFAULT_CHC
      : Number(args.chc);
  return base + (args.enraged ? PACK_FALLBACK_ENRAGE_CHC_BONUS : 0);
}

/** Byte-for-byte pack-spell-arm roll: `rng() * 100 < chc`. */
export function packFallbackMeleeCritRolls(args: {
  chc: number | null | undefined;
  enraged?: boolean;
  rng: () => number;
}): boolean {
  return args.rng() * 100 < packFallbackMeleeCritChance(args);
}

/** Live WX pre-soak packet — always the scaled raw, never doubled. */
export function liveWxPackFallbackPreSoak(args: {
  catalogDamage: number;
  enemyLevel: number;
  enrageMultiplier?: number;
}): number {
  return wxPackFallbackLiveRaw(args);
}

export function canExecutePackEnemyFallbackMeleeCrit(args: {
  hit: PackFallbackMeleeHit;
}): boolean {
  return isPackFallbackMeleeHit(args.hit);
}

/** Alias so decide melee and the WX fallback branch cannot fork. */
export function shouldDecidePackEnemyFallbackMeleeCrit(
  args: Parameters<typeof canExecutePackEnemyFallbackMeleeCrit>[0],
): boolean {
  return canExecutePackEnemyFallbackMeleeCrit(args);
}

export function packFallbackHighlightedMeleeCritIsExecutable(args: {
  decided: boolean;
  executable: boolean;
}): boolean {
  return args.decided === true && args.executable === true;
}

/**
 * Execute a decided Crush / Fire Bolt packet with advertised CHC.
 * Unknown ids return null so restack cannot treat a kit spell as this
 * fallback. RES / Shield stay on **#659**. Windstorm miss stays on
 * **#1042** (Fire Bolt range 3).
 */
export function executePackEnemyFallbackMeleeCrit(args: {
  hit: PackFallbackMeleeHit;
  enemyLevel: number;
  enrageMultiplier?: number;
  chc?: number | null;
  enraged?: boolean;
  rng: () => number;
}): PackFallbackMeleeCritExecute | null {
  if (!canExecutePackEnemyFallbackMeleeCrit({ hit: args.hit })) return null;
  const raw = wxPackFallbackLiveRaw({
    catalogDamage: args.hit.damage,
    enemyLevel: args.enemyLevel,
    enrageMultiplier: args.enrageMultiplier,
  });
  const isCrit = packFallbackMeleeCritRolls({
    chc: args.chc,
    enraged: args.enraged,
    rng: args.rng,
  });
  return { raw, isCrit, preSoak: isCrit ? raw * 2 : raw };
}
