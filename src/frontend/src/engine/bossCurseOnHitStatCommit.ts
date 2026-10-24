/**
 * Pale Archbishop / Weeping Pawn / Final Pawn `CURSE_ON_HIT` writes
 * `stat: "all"` (`useBossSystem` `applyCurseOnHit`). Live WorldExploration
 * copies `d.stat` as-is (~16048). `getStatModifier` requires
 * `eff.stat === stat`, so `"all"` never matches the keys combat actually
 * reads (`dmg` outgoing, `res` incoming, `sp`, `healRecv`).
 *
 * Adjacent Pale Archbishop / Weeping Pawn then return `type: "ability"`
 * instead of `attackPlayer`, so a 25% proc spends the melee turn on a
 * log line ("All your stats halved for 2 turns!") whose badge does
 * nothing. Final Pawn is the same at 20%. Player outgoing 20 stays 20;
 * Blood Mend 12 still restores 12; RES 12 is not halved.
 *
 * Unique extra vs:
 * - #1035 Exsanguinated `healing` → `healRecv` (Blood Mend only). That
 *   sidecar's tests **leave** `CURSE_ON_HIT` `stat: "all"` unmapped.
 *   Do **not** alias `"healing"` here, and do **not** remap `"all"`
 *   onto `healRecv` alone (that would drop outgoing `dmg` / incoming
 *   `res`).
 * - #658 catalog `res_sp` matcher. Do **not** alias `"all"` inside
 *   `getStatModifier` from this file; restack that one function onto
 *   `effectStatMatchesBossCurseAll` after older combat PRs land.
 * - Pages of Doom `spell_physical` (Pale Archivist). Different key,
 *   different boss, not this leftover.
 * - #692 Blood Mend advertised CHC (heal arm still returns without
 *   `buffStat`). This sidecar only makes the existing `dmg` / `res` /
 *   `healRecv` multiplies fire.
 *
 * AP / MP are additive (`isAdditiveResourceStat`). Applying modifier
 * `0.5` there would **add** 0.5 AP, not halve the pool — skip them.
 *
 * Does not restack WorldExploration, useBossAI, useBossSystem,
 * statusEffects.ts, spellEngine.ts, or challengeCompletion.ts.
 * Does not restore the skipped `attackPlayer` damage (turn logic).
 * Restack `getStatModifier` / the WX `debuffsApplied` copy onto
 * `getStatModifierHonoringBossCurseAll` after those PRs land.
 */

import { hpAfterHeal, hpAfterIncomingDamage } from "./battleSetup.ts";
import {
  type StatModifiableEffect,
  getStatModifier,
  isAdditiveResourceStat,
} from "./statusEffects.ts";

export const CURSE_ON_HIT_ABILITY = "CURSE_ON_HIT";

/** Production `applyCurseOnHit` stat key. */
export const CURSE_ON_HIT_STAT_LIVE = "all";

/** Production multiplier — "All your stats halved". */
export const CURSE_ON_HIT_MODIFIER = 0.5;

export const CURSE_ON_HIT_DURATION = 2;

export const CURSE_ON_HIT_EFFECT_NAME = "Archbishop's Curse";

export const CURSE_ON_HIT_LOG_NEEDLE = "All your stats halved";

/**
 * Multiplicative combat keys live WX actually queries on the player.
 * `ap` / `mp` stay out — they are additive.
 */
export const CURSE_ON_HIT_COMBAT_STATS = [
  "dmg",
  "res",
  "sr",
  "sp",
  "healRecv",
] as const;

export type CurseOnHitCombatStat = (typeof CURSE_ON_HIT_COMBAT_STATS)[number];

export type BossCurseOnHitDebuffLike = {
  stat?: string | null;
  modifier?: number | null;
  duration?: number | null;
  effectName?: string | null;
  iconEmoji?: string | null;
};

export type BossCurseOnHitActionLike = {
  type?: string | null;
  ability?: string | null;
  abilityResult?: {
    damageToPlayer?: number | null;
    debuffsApplied?: BossCurseOnHitDebuffLike[] | null;
    logMessages?: string[] | null;
    playerApModifier?: number | null;
  } | null;
};

export type CommittedCurseOnHitEffect = {
  targetId: string;
  type: "debuff";
  stat: string;
  modifier: number;
  duration: number;
  effectName: string;
};

export type BossCurseOnHitStatCommit = {
  effects: CommittedCurseOnHitEffect[];
  dmg: number;
  res: number;
  sr: number;
  sp: number;
  healRecv: number;
  ap: number;
  mp: number;
};

function finiteNumber(n: unknown): number | null {
  const v = Number(n);
  if (!Number.isFinite(v)) return null;
  return v;
}

/**
 * Live leftover identity: boss wrote `stat: "all"` with the advertised
 * 0.5 / 2 curse payload. Exsanguinated `healing`, Pages of Doom
 * `spell_*`, and catalog `res_sp` stay off this matcher.
 */
export function isBossCurseOnHitAllStatRow(
  row: BossCurseOnHitDebuffLike,
): boolean {
  if (row.stat !== CURSE_ON_HIT_STAT_LIVE) return false;
  const modifier = finiteNumber(row.modifier);
  if (modifier == null || modifier !== CURSE_ON_HIT_MODIFIER) return false;
  const duration = finiteNumber(row.duration);
  if (duration == null || duration < 1) return false;
  if (row.effectName && row.effectName !== CURSE_ON_HIT_EFFECT_NAME) {
    return false;
  }
  return true;
}

function isCurseOnHitAbilityAction(action: BossCurseOnHitActionLike): boolean {
  if (
    action.type === "attack" ||
    action.type === "spell" ||
    action.type === "move"
  ) {
    return false;
  }
  if (action.ability === CURSE_ON_HIT_ABILITY) return true;
  const logs = action.abilityResult?.logMessages ?? [];
  return logs.some((line) => line.includes(CURSE_ON_HIT_LOG_NEEDLE));
}

/**
 * Advertised curse rows that still carry `stat: "all"`. Kit Cursed Wound
 * (`type: "spell"`) and Exsanguinated (`healing`) return null.
 */
export function bossCurseOnHitAllRowsFromAction(
  action: BossCurseOnHitActionLike,
): BossCurseOnHitDebuffLike[] | null {
  if (!isCurseOnHitAbilityAction(action)) return null;
  const rows = action.abilityResult?.debuffsApplied ?? [];
  const hits = rows.filter(isBossCurseOnHitAllStatRow);
  return hits.length > 0 ? hits : null;
}

/**
 * `"all"` matches every multiplicative query. Additive AP/MP must not
 * pick it up or modifier 0.5 would add half a point.
 */
export function effectStatMatchesBossCurseAll(
  effectStat: string,
  queryStat: string,
): boolean {
  if (effectStat === queryStat) return true;
  if (effectStat !== CURSE_ON_HIT_STAT_LIVE) return false;
  return !isAdditiveResourceStat(queryStat);
}

/**
 * Same product/sum as `getStatModifier`, plus `stat: "all"` on
 * multiplicative queries. One effect row (WX `applyOrRefreshNonDotEffect`
 * replaces by `effectName`) still shreds `dmg` and `res`.
 */
export function getStatModifierHonoringBossCurseAll(
  targetId: string,
  stat: string,
  effects: readonly StatModifiableEffect[],
): number {
  let value = getStatModifier(targetId, stat, effects);
  if (isAdditiveResourceStat(stat)) return value;
  for (const eff of effects) {
    if (eff.targetId !== targetId || eff.stat !== CURSE_ON_HIT_STAT_LIVE) {
      continue;
    }
    if (eff.type === "buff" || eff.type === "debuff") {
      value *= eff.modifier ?? 1;
    }
  }
  return value;
}

function commitCurseRows(
  action: BossCurseOnHitActionLike,
): CommittedCurseOnHitEffect[] {
  const rows = action.abilityResult?.debuffsApplied ?? [];
  const out: CommittedCurseOnHitEffect[] = [];
  for (const row of rows) {
    const stat = row.stat;
    if (!stat) continue;
    const modifier = finiteNumber(row.modifier);
    const duration = finiteNumber(row.duration);
    if (modifier == null || duration == null || duration < 1) continue;
    out.push({
      targetId: "player",
      type: "debuff",
      stat,
      modifier,
      duration: Math.max(1, Math.floor(duration)),
      effectName: row.effectName ?? CURSE_ON_HIT_EFFECT_NAME,
    });
  }
  return out;
}

function modsFromEffects(
  effects: readonly CommittedCurseOnHitEffect[],
  honorAll: boolean,
): Omit<BossCurseOnHitStatCommit, "effects"> {
  const read = honorAll ? getStatModifierHonoringBossCurseAll : getStatModifier;
  return {
    dmg: read("player", "dmg", effects),
    res: read("player", "res", effects),
    sr: read("player", "sr", effects),
    sp: read("player", "sp", effects),
    healRecv: read("player", "healRecv", effects),
    ap: read("player", "ap", effects),
    mp: read("player", "mp", effects),
  };
}

/**
 * Production WX (~16048): copy `d.stat` as-is through stock
 * `getStatModifier`. Outgoing `dmg` and incoming `res` stay 1.
 */
export function wxBossCurseOnHitCommitWithoutAllStats(opts: {
  action: BossCurseOnHitActionLike;
}): BossCurseOnHitStatCommit {
  const effects = commitCurseRows(opts.action);
  return { effects, ...modsFromEffects(effects, false) };
}

/**
 * Honour `stat: "all"` onto the multiplicative combat keys live WX
 * already queries. Does **not** mint `damageToPlayer` for the skipped
 * melee, and does **not** rewrite AP/MP.
 */
export function resolveBossCurseOnHitStatCommit(opts: {
  action: BossCurseOnHitActionLike;
}): BossCurseOnHitStatCommit {
  const effects = commitCurseRows(opts.action);
  return { effects, ...modsFromEffects(effects, true) };
}

/** True when live WX would leave advertised dmg/res shred on the floor. */
export function wxBossCurseOnHitDroppedCombatStats(opts: {
  action: BossCurseOnHitActionLike;
}): boolean {
  const live = wxBossCurseOnHitCommitWithoutAllStats(opts);
  const fixed = resolveBossCurseOnHitStatCommit(opts);
  return live.dmg !== fixed.dmg || live.res !== fixed.res;
}

/**
 * `computeDamage` outgoing arm: multiply only when the modifier is not 1.
 */
export function playerOutgoingAfterDmgMod(
  baseDamage: number,
  dmgMod: number,
): number {
  const base = finiteNumber(baseDamage) ?? 0;
  const mod = finiteNumber(dmgMod);
  if (mod == null || mod === 1) return base;
  return Math.floor(base * mod);
}

/**
 * `playerTakesDamage`: `final = round(incoming * (1 - (res * resMod)/100))`,
 * floored at 1.
 */
export function playerIncomingAfterResMod(
  incomingDamage: number,
  baseRes: number,
  resMod: number,
): number {
  const incoming = Math.max(0, finiteNumber(incomingDamage) ?? 0);
  const res = Math.max(0, finiteNumber(baseRes) ?? 0);
  const mod = finiteNumber(resMod) ?? 1;
  const effRes = res * mod;
  return Math.max(1, Math.round(incoming * Math.max(0, 1 - effRes / 100)));
}

export function playerHealAmountAfterHealRecv(
  baseHeal: number,
  healRecvMod: number,
): number {
  const base = finiteNumber(baseHeal) ?? 0;
  const mod = finiteNumber(healRecvMod);
  if (mod == null || mod === 1) return base;
  return Math.round(base * mod);
}

export function playerHpAfterBloodMend(opts: {
  hp: number;
  maxHp: number;
  baseHeal: number;
  healRecv: number;
}): number {
  const restored = playerHealAmountAfterHealRecv(opts.baseHeal, opts.healRecv);
  return hpAfterHeal(opts.hp, opts.maxHp, restored);
}

export function playerHpAfterIncoming(opts: {
  hp: number;
  incomingDamage: number;
  baseRes: number;
  resMod: number;
}): number {
  const taken = playerIncomingAfterResMod(
    opts.incomingDamage,
    opts.baseRes,
    opts.resMod,
  );
  return hpAfterIncomingDamage(opts.hp, taken).newHp;
}
