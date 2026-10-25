/**
 * Boss kit damage vs advertised CHC.
 *
 * `pickBossKitSpell` is always called with an empty cooldown Map, so the
 * first pool id wins every turn. Pale Archbishop / Midnight Bishop /
 * Pale Archivist phase 1 start with Cursed Wound (damage 22). Bone
 * Cavalier / Weeping Pawn / Final Pawn / Alabaster Fortress start with
 * Strike. Void Grandmaster / Starborn Queen / Lord of Static / Mirror
 * Sovereign start with Chain Lightning. Starved Vampire starts with
 * Life Drain.
 *
 * WorldExploration boss apply then:
 *   `bRawDmg = Math.max(1, Math.round(Number(damage)))`
 *   `playerTakesDamage(bRawDmg)`
 * It never reads `currentBossConfig.baseStats.chc` / `enemy.chc` and
 * never doubles. The pack-enemy apply ~600 lines later rolls
 *   `Math.random() * 100 < (enemy.chc ?? 2) + enrage`
 * and sets `dmgAC = isCrit ? raw * 2 : raw` before soak.
 *
 * Bosses are spawned with `chc: currentBossConfig.baseStats.chc` (2–8)
 * and the Boss Guide advertises that sheet. The only live boss damage
 * path (kit spells) ignores it, so a 5% Pale Archbishop Cursed Wound
 * is always 22, never 44.
 *
 * Unique vs **#857** (heal+buff applying `buffStat: "chc"`, not a
 * damage roll), **#862** summon heal+buff CHC, **#924** WX enemy heal
 * CHC, **#692** player self-heal CHC, **#868** bounce, **#888** range,
 * **#843** buff-only, **#850** Swap, **#851** Mark, **#852** Mirror,
 * **#921** Life Drain SP, **#1094** DAMAGE_IMMUNE.
 *
 * Do not add `calcScaledDamage` / SP / double-RES (would rebalance or
 * steal pack leftovers). Do not add the pack Enrage +10 CHC (#843).
 * Drain `healAmount` stays the catalog value. Bounce is not in this
 * payload (#868). WorldExploration / useBossAI / targeting /
 * spellEngine left untouched so older open PRs stay merge-clean.
 * Restack the boss kit damage arm onto `executeBossKitDamageCritCast`
 * after those PRs land.
 */

import type { SpellConfig } from "../types/gameTypes.ts";

export type BossKitDamageCritSpell =
  | Pick<
      SpellConfig,
      | "damage"
      | "spellType"
      | "healAmount"
      | "buffStat"
      | "buffDuration"
      | "debuffStat"
      | "debuffDuration"
      | "dotDamage"
      | "dotDamagePerTurn"
      | "dotDuration"
      | "hitsMultiple"
      | "bounces"
      | "isSummon"
      | "isSwap"
      | "isMark"
      | "isMirror"
      | "isBarrier"
    >
  | {
      damage?: unknown;
      spellType?: string | null;
      healAmount?: unknown;
      buffStat?: string | null;
      buffDuration?: unknown;
      debuffStat?: string | null;
      debuffDuration?: unknown;
      dotDamage?: unknown;
      dotDamagePerTurn?: unknown;
      dotDuration?: unknown;
      hitsMultiple?: boolean | null;
      bounces?: unknown;
      isSummon?: boolean | null;
      isSwap?: boolean | null;
      isMark?: boolean | null;
      isMirror?: boolean | null;
      isBarrier?: boolean | null;
    };

export type BossKitDamageCritExecute = {
  raw: number;
  isCrit: boolean;
  preSoak: number;
};

/** Pack-enemy fallback when `enemy.chc` is missing. */
export const PACK_ENEMY_DEFAULT_CHC = 2;

/**
 * Catalog damage/drain with `damage > 0`. Heal+buff stays on #857.
 * 0-damage Slow / Inferno / Poison / Iron Skin stay on their execute
 * leftovers. Swap / Mark / Mirror / Barrier / summon stay on #850 /
 * #851 / #852 / #910.
 */
export function isBossKitDamageCritSpell(
  spell: BossKitDamageCritSpell,
): boolean {
  const spellType = spell.spellType ?? "damage";
  if (spellType !== "damage" && spellType !== "drain") return false;
  if (Number(spell.damage ?? 0) <= 0) return false;
  if (spell.isSummon || spell.isSwap || spell.isMark || spell.isMirror) {
    return false;
  }
  if (spell.isBarrier) return false;
  return true;
}

/** Live WX `bRawDmg` — no crit, no level scale. */
export function wxBossKitLiveDamageRaw(spell: BossKitDamageCritSpell): number {
  return Math.max(1, Math.round(Number(spell.damage)));
}

/**
 * Live boss-kit apply never rolls CHC. Pack-enemy apply does
 * (`enemy.chc ?? 2`).
 */
export function wxBossKitDamageLiveRollsCrit(): boolean {
  return false;
}

/** Same `chc ?? 2` the pack-enemy apply uses. Enrage +10 stays #843. */
export function bossKitDamageCritChance(
  chc: number | null | undefined,
): number {
  if (chc == null || !Number.isFinite(Number(chc))) {
    return PACK_ENEMY_DEFAULT_CHC;
  }
  return Number(chc);
}

/** Byte-for-byte pack-enemy roll: `rng() * 100 < chc`. */
export function bossKitDamageCritRolls(args: {
  chc: number | null | undefined;
  rng: () => number;
}): boolean {
  return args.rng() * 100 < bossKitDamageCritChance(args.chc);
}

/** Live WX pre-soak packet — always the catalog raw, never doubled. */
export function liveWxBossKitDamagePreSoak(
  spell: BossKitDamageCritSpell,
): number | null {
  if (!isBossKitDamageCritSpell(spell)) return null;
  return wxBossKitLiveDamageRaw(spell);
}

export function canExecuteBossKitDamageCritCast(args: {
  spell: BossKitDamageCritSpell;
}): boolean {
  return isBossKitDamageCritSpell(args.spell);
}

/** Alias so decide and the WX damage branch cannot fork. */
export function shouldDecideBossKitDamageCritCast(
  args: Parameters<typeof canExecuteBossKitDamageCritCast>[0],
): boolean {
  return canExecuteBossKitDamageCritCast(args);
}

export function bossKitHighlightedDamageCritIsExecutable(args: {
  decided: boolean;
  executable: boolean;
}): boolean {
  return args.decided === true && args.executable === true;
}

/**
 * Execute a decided kit damage packet with advertised CHC. Non-damage
 * returns null so restack cannot treat Rallying Cry / Iron Skin as a
 * crit hit. Drain `healAmount` is not in this payload (#921 / #857).
 * Bounce count is not in this payload (#868).
 */
export function executeBossKitDamageCritCast(args: {
  spell: BossKitDamageCritSpell;
  chc?: number | null;
  rng: () => number;
}): BossKitDamageCritExecute | null {
  if (!canExecuteBossKitDamageCritCast({ spell: args.spell })) return null;
  const raw = wxBossKitLiveDamageRaw(args.spell);
  const isCrit = bossKitDamageCritRolls({ chc: args.chc, rng: args.rng });
  return { raw, isCrit, preSoak: isCrit ? raw * 2 : raw };
}
