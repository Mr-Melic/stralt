/**
 * Starved Vampire Exsanguinated `stat: "healing"` vs heal path `healRecv`
 * (`WorldExploration` ~16048 / `spellEngine` ~657).
 *
 * `applyVampiricAoe` (Starved Vampire Pawn phase 2, even turns) and
 * `applyExsanguinatedDebuff` write
 *   `{ stat: "healing", modifier: 0.5, duration: 2,
 *      effectName: "Exsanguinated" }`
 * plus the log "You are Exsanguinated — healing reduced by 50% for 2
 * turns!". Live WorldExploration then copies `d.stat` as-is into
 * `applyActiveEffect`. Player Blood Mend (`starter-heal`, advertised 12)
 * queries `getEffectiveStat("player", "healRecv")`. `getStatModifier`
 * requires `eff.stat === stat`, so `"healing"` never matches `"healRecv"`
 * — the 12 HP restore stays 12. A 90/100 player Blood Mends to 100
 * instead of 96.
 *
 * Unique extra vs:
 * - #915 `playerCursedWoundCast`: player / kit Cursed Wound already
 *   writes `debuffStat: "healRecv"` on the clicked hostile. This is the
 *   **boss** row on the **player** with the wrong key.
 * - #658 catalog `res_sp` matcher: do **not** alias `healing` inside
 *   `getStatModifier`. Remap only this Exsanguinated commit.
 * - #975 `bossVampiricAoeHealCommit`: drained-HP **boss** heal. This
 *   file does **not** change boss HP.
 * - #984 `bossVampiricAoeTargetHpCommit`: minion `damageToTargets` 10.
 *   This file does **not** change minion HP.
 * - #968 LIFE_DRAIN 15 HP / +1 atk. No Exsanguinated row.
 * - #948 Dawn `damageToPlayer: -10` (does not go through `healRecv`).
 * - #692 / #550 Blood Mend advertised CHC (heal arm still returns
 *   without `buffStat`). This sidecar only remaps the incoming boss
 *   shred so the existing `healRecv` multiply fires.
 * - Potion / Doka-to-HP skip `healRecv` in live WX — do not expand
 *   that contract here.
 *
 * Does not restack WorldExploration, useBossAI, useBossSystem,
 * statusEffects.ts, spellEngine.ts, challengeCompletion.ts,
 * playerCursedWoundCast.ts, bossVampiricAoeHealCommit.ts,
 * bossVampiricAoeTargetHpCommit.ts, or bossDawnHealCommit.ts.
 * Restack the WX `debuffsApplied` copy onto
 * `resolveBossExsanguinatedHealRecvCommit` after those PRs land.
 */

import { hpAfterHeal } from "./battleSetup.ts";
import { getStatModifier } from "./statusEffects.ts";

export const EXSANGUINATED_ABILITY = "EXSANGUINATED_DEBUFF";

export const VAMPIRIC_AOE_ABILITY = "VAMPIRIC_AOE";

/** Production `applyExsanguinatedDebuff` / `applyVampiricAoe` stat key. */
export const EXSANGUINATED_STAT_LIVE = "healing";

/** `resolvePlayerCast` Blood Mend queries this key. */
export const EXSANGUINATED_STAT_HEAL_PATH = "healRecv";

/** Production multiplier — "healing reduced by 50%". */
export const EXSANGUINATED_MODIFIER = 0.5;

export const EXSANGUINATED_DURATION = 2;

export const EXSANGUINATED_EFFECT_NAME = "Exsanguinated";

export const EXSANGUINATED_LOG =
  "You are Exsanguinated — healing reduced by 50% for 2 turns!";

export type BossExsanguinatedDebuffLike = {
  stat?: string | null;
  modifier?: number | null;
  duration?: number | null;
  effectName?: string | null;
  iconEmoji?: string | null;
};

export type BossExsanguinatedActionLike = {
  type?: string | null;
  ability?: string | null;
  abilityResult?: {
    damageToPlayer?: number | null;
    damageToTargets?: Record<string, number> | null;
    debuffsApplied?: BossExsanguinatedDebuffLike[] | null;
    logMessages?: string[] | null;
    playerApModifier?: number | null;
  } | null;
};

export type CommittedExsanguinatedEffect = {
  targetId: string;
  type: "debuff";
  stat: string;
  modifier: number;
  duration: number;
  effectName: string;
};

export type BossExsanguinatedHealRecvCommit = {
  effects: CommittedExsanguinatedEffect[];
  healRecv: number;
};

function finiteNumber(n: unknown): number | null {
  const v = Number(n);
  if (!Number.isFinite(v)) return null;
  return v;
}

/**
 * Live leftover identity: boss wrote `stat: "healing"` with the
 * advertised 0.5 / 2 Exsanguinated payload. Cursed Wound `healRecv`,
 * CURSE_ON_HIT `all`, Pages of Doom `spell_*`, and catalog `res_sp`
 * stay off this remap.
 */
export function isBossExsanguinatedHealingStatRow(
  row: BossExsanguinatedDebuffLike,
): boolean {
  if (row.stat !== EXSANGUINATED_STAT_LIVE) return false;
  const modifier = finiteNumber(row.modifier);
  if (modifier == null || modifier !== EXSANGUINATED_MODIFIER) return false;
  const duration = finiteNumber(row.duration);
  if (duration == null || duration < 1) return false;
  if (row.effectName && row.effectName !== EXSANGUINATED_EFFECT_NAME) {
    return false;
  }
  return true;
}

function isExsanguinatedAbilityAction(
  action: BossExsanguinatedActionLike,
): boolean {
  if (
    action.type === "attack" ||
    action.type === "spell" ||
    action.type === "move"
  ) {
    return false;
  }
  if (
    action.ability === EXSANGUINATED_ABILITY ||
    action.ability === VAMPIRIC_AOE_ABILITY
  ) {
    return true;
  }
  const logs = action.abilityResult?.logMessages ?? [];
  return logs.some((line) => line.includes(EXSANGUINATED_LOG));
}

/**
 * Advertised Exsanguinated rows that still carry `stat: "healing"`.
 * Negative Dawn `damageToPlayer` is not this leftover. Kit Cursed
 * Wound (`type: "spell"`, `healRecv`) returns null.
 */
export function bossExsanguinatedHealRecvFromAction(
  action: BossExsanguinatedActionLike,
): BossExsanguinatedDebuffLike[] | null {
  if (!isExsanguinatedAbilityAction(action)) return null;
  const dmg = finiteNumber(action.abilityResult?.damageToPlayer);
  if (dmg != null && dmg < 0) return null;
  const rows = action.abilityResult?.debuffsApplied ?? [];
  const hits = rows.filter(isBossExsanguinatedHealingStatRow);
  return hits.length > 0 ? hits : null;
}

function commitExsanguinatedRows(opts: {
  action: BossExsanguinatedActionLike;
  remapHealingToHealRecv: boolean;
}): CommittedExsanguinatedEffect[] {
  const rows = opts.action.abilityResult?.debuffsApplied ?? [];
  const out: CommittedExsanguinatedEffect[] = [];
  for (const row of rows) {
    const stat = row.stat;
    if (!stat) continue;
    const modifier = finiteNumber(row.modifier);
    const duration = finiteNumber(row.duration);
    if (modifier == null || duration == null || duration < 1) continue;
    const remap =
      opts.remapHealingToHealRecv && isBossExsanguinatedHealingStatRow(row);
    out.push({
      targetId: "player",
      type: "debuff",
      stat: remap ? EXSANGUINATED_STAT_HEAL_PATH : stat,
      modifier,
      duration: Math.max(1, Math.floor(duration)),
      effectName: row.effectName ?? EXSANGUINATED_EFFECT_NAME,
    });
  }
  return out;
}

function healRecvFromEffects(
  effects: readonly CommittedExsanguinatedEffect[],
): number {
  return getStatModifier("player", EXSANGUINATED_STAT_HEAL_PATH, effects);
}

/**
 * Production WX (~16048): copy `d.stat` as-is. Blood Mend still sees
 * `healRecv === 1`.
 */
export function wxBossExsanguinatedCommitWithoutHealRecv(opts: {
  action: BossExsanguinatedActionLike;
}): BossExsanguinatedHealRecvCommit {
  const effects = commitExsanguinatedRows({
    action: opts.action,
    remapHealingToHealRecv: false,
  });
  return { effects, healRecv: healRecvFromEffects(effects) };
}

/**
 * Remap Exsanguinated `healing` → `healRecv` so Blood Mend's
 * `getEffectiveStat("player", "healRecv")` actually multiplies. Other
 * `debuffsApplied` rows stay verbatim. Does **not** apply VAMPIRIC
 * drain HP, minion `damageToTargets`, or Dawn heals.
 */
export function resolveBossExsanguinatedHealRecvCommit(opts: {
  action: BossExsanguinatedActionLike;
}): BossExsanguinatedHealRecvCommit {
  const effects = commitExsanguinatedRows({
    action: opts.action,
    remapHealingToHealRecv: true,
  });
  return { effects, healRecv: healRecvFromEffects(effects) };
}

/** True when live WX would leave advertised healRecv on the floor. */
export function wxBossExsanguinatedDroppedHealRecv(opts: {
  action: BossExsanguinatedActionLike;
}): boolean {
  const live = wxBossExsanguinatedCommitWithoutHealRecv(opts);
  const fixed = resolveBossExsanguinatedHealRecvCommit(opts);
  return live.healRecv !== fixed.healRecv;
}

/**
 * `resolvePlayerCast` heal arm (~657): multiply only when the modifier
 * is a number other than 1. Missing / unmatched `healRecv` therefore
 * keeps the advertised amount.
 */
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
  crit?: boolean;
}): number {
  const restored = playerHealAmountAfterHealRecv(opts.baseHeal, opts.healRecv);
  const finalHeal = opts.crit === true ? restored * 2 : restored;
  return hpAfterHeal(opts.hp, opts.maxHp, finalHeal);
}
