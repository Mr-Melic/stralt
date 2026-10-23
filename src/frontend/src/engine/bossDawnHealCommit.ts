/**
 * Twin Monarchs Dawn `damageToPlayer: -10` heal (`WorldExploration` ~16025).
 *
 * `applyDawnBuff` roll 1 (`useBossSystem.ts` ~1290) returns
 * `{ damageToPlayer: -10, logMessages: ["Dawn briefly blesses you with a
 * +10 HP heal!"] }`. `useBossAI` fires that ability every 3rd phase-1
 * turn (`type: "ability"`, `BossAbility.DAWN_BUFF`). Live WorldExploration
 * then:
 *   `if (res?.damageToPlayer && res.damageToPlayer > 0) { apply damage }`
 * so the log fires and HP never moves. `challengeHealUsedRef` stays false
 * (`recordChallengeHealFromHpRestore` is never called). A 90/100 player
 * stays 90; easy_1 50 Doka / hard_1 200 Doka + 500 XP still persist; a
 * 10 HP player is not topped before Glyph Trap 15 / Dusk 5.
 *
 * #376 `dawnBlessingForRoll` owns the AP/MP copy and explicitly leaves
 * this heal unused. #916 `resolveBossAttackDamage` treats `-10` as 0 so
 * it cannot become Twin Monarchs melee 22. WX potion / Life Drain /
 * Doka-to-HP already flip `healUsed` through
 * `recordChallengeHealFromHpRestore` — Dawn never enters that helper.
 *
 * Unique extra vs:
 * - #376 `dawnBlessing.ts`: log honesty for `playerApModifier`. Roll 1
 *   still returns `damageToPlayer: -10`. This sidecar consumes that
 *   negative as `Math.min(maxHp, hp + 10)` and records no-heal failure
 *   when HP actually rose.
 * - #916 `bossAttackDamageCommit`: melee when `damageToPlayer` is
 *   missing. Negative must **not** become `enemy.damage` 22.
 * - #869 / #918 remount death (persist). This is in-battle HP +
 *   `healUsed`, not a wallet stamp.
 * - #550 / #692 Blood Mend / Rallying Cry CHC (player heal arm). Dawn
 *   is a boss ability result, not `resolvePlayerCast`.
 *
 * Does not restack WorldExploration, useBossAI, useBossSystem,
 * dawnBlessing.ts, bossAttackDamageCommit.ts, or challengeCompletion.ts.
 * Restack the WX ability apply onto `resolveBossDawnHpCommit` after
 * those PRs land.
 */

import { recordChallengeHealFromHpRestore } from "../utils/challengeCompletion.ts";

export const DAWN_HEAL_LOG = "Dawn briefly blesses you with a +10 HP heal!";

/** `applyDawnBuff` roll 1 — negative damage is the advertised heal. */
export const DAWN_NEGATIVE_DAMAGE_TO_PLAYER = -10;

/** Absolute HP restored when the negative-damage sentinel is applied. */
export const DAWN_HEAL_AMOUNT = 10;

export type BossDawnHealActionLike = {
  type?: string | null;
  abilityResult?: {
    damageToPlayer?: number | null;
    playerApModifier?: number | null;
  } | null;
};

export type BossDawnHealCommit = {
  hp: number;
  healUsed: boolean;
  restored: number;
};

function finiteNumber(n: unknown): number | null {
  const v = Number(n);
  if (!Number.isFinite(v)) return null;
  return v;
}

function clampHp(hp: number, maxHp: number): number {
  const max = finiteNumber(maxHp);
  const cap = max != null && max > 0 ? max : 0;
  const n = finiteNumber(hp);
  const current = n == null ? 0 : n;
  return Math.max(0, Math.min(cap, current));
}

/**
 * Advertised heal from negative `damageToPlayer`. Positive / missing /
 * non-finite values are not heals — queen rays, Glyph Trap 15, and
 * Countess melee stay on the damage helpers.
 */
export function bossDawnHealFromAction(
  action: BossDawnHealActionLike,
): number | null {
  const dmg = finiteNumber(action.abilityResult?.damageToPlayer);
  if (dmg == null || dmg >= 0) return null;
  return -dmg;
}

function commitDawnHp(opts: {
  hp: number;
  maxHp: number;
  action: BossDawnHealActionLike;
  applyHeal: boolean;
  inBattle?: boolean;
  healUsed?: boolean;
}): BossDawnHealCommit {
  const before = clampHp(opts.hp, opts.maxHp);
  const maxHp = clampHp(opts.maxHp, opts.maxHp);
  let next = before;
  if (opts.applyHeal) {
    const heal = bossDawnHealFromAction(opts.action);
    if (heal != null) next = clampHp(before + heal, maxHp);
  }
  const restored = next - before;
  return {
    hp: next,
    restored,
    healUsed: recordChallengeHealFromHpRestore(
      opts.inBattle !== false,
      opts.healUsed === true,
      restored,
    ),
  };
}

/**
 * Production WX (~16025): only `damageToPlayer > 0` as HP loss. Negative
 * Dawn heal is skipped; `healUsed` stays put; easy_1 still credits.
 */
export function wxBossDawnCommitWithoutHeal(opts: {
  hp: number;
  maxHp: number;
  action: BossDawnHealActionLike;
  inBattle?: boolean;
  healUsed?: boolean;
}): BossDawnHealCommit {
  return commitDawnHp({ ...opts, applyHeal: false });
}

/**
 * Apply advertised Dawn heal. Caps at `maxHp`. Records `healUsed` only
 * when HP actually rose (full-HP cap restores 0, so easy_1 still holds).
 * Positive `damageToPlayer` is not applied here — queen-ray / Glyph Trap
 * HP stays #916 / the live `> 0` branch.
 */
export function resolveBossDawnHpCommit(opts: {
  hp: number;
  maxHp: number;
  action: BossDawnHealActionLike;
  inBattle?: boolean;
  healUsed?: boolean;
}): BossDawnHealCommit {
  return commitDawnHp({ ...opts, applyHeal: true });
}

/** True when live WX would leave the advertised Dawn heal on the floor. */
export function wxBossDawnDroppedHeal(opts: {
  hp: number;
  maxHp: number;
  action: BossDawnHealActionLike;
  inBattle?: boolean;
  healUsed?: boolean;
}): boolean {
  const live = wxBossDawnCommitWithoutHeal(opts);
  const fixed = resolveBossDawnHpCommit(opts);
  return fixed.hp > live.hp || (fixed.healUsed && !live.healUsed);
}
