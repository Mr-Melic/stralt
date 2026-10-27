/**
 * Doka Fever vs advertised enemy +25% HP.
 *
 * Registry (`mapModifiers.ts` `doka_fever`) announces
 *   "Doka Fever: enemies +25% HP, Doka rewards doubled."
 * `MAP_MODIFIER_DOKA_FEVER_ENEMY_HP_BONUS` is 0.25.
 * `onBattleStart` does `bonus = floor((maxHp ?? hp) * 0.25)` then
 * `maxHp += bonus`, `hp += bonus` — but only when
 * `c.isEnemy ?? c.side === "enemy"`. Reward doubling is already
 * wired (`applyRewardMultiplier` on the victory recap) — this
 * sidecar does not add `doka`.
 *
 * Live WorldExploration never stamps enemy battle HP:
 * - Overworld / dungeon `generateEnemies` does not write `side` or
 *   `isEnemy`. Absent both, the live gate is false, so
 *   `applyBattleStart` is a no-op on the roster the player actually
 *   fights.
 * - Battle-start `hpMap` is filled from `calcEnemyMaxHp(e.level)`
 *   *before* `applyBattleStart`, then `setEnemyHpMap(hpMap)` runs
 *   *after* the hook. HUD / AI leftover reads
 *   `enemyHpMap[id] ?? e.hp`, so even a tagged `side: "enemy"`
 *   unit would keep the unstamped HUD pool.
 * - WX has `isPlagueZone` / `isVoidRift` and no `isDokaFever`.
 *   `WorldExploration.tsx` never mentions `doka_fever`.
 *
 * Sequence: Doka Fever map → encounter a level-1 overworld rat
 * (spawn HP 28, battle HUD `calcEnemyMaxHp` 50) → Strike for 50.
 *
 * | | Expected | Actual (live WX) |
 * |---|---|---|
 * | Battle-start enemy HP / maxHp | 62 / 62 | HUD 50, store 28 |
 * | Strike 50 after RES 0 | HP 12, fight continues | HUD 0 / store already 0, kill |
 *
 * Unique vs **#1203** (Titan's Vigor player +1000 — same
 * `applyBattleStart` skip of the *player*; this stamps *enemy*
 * vitals and returns no player `characterStats`), **#1200**
 * (Iron Curse player RES ×1.3), **#1199** (Mending Mist store HP),
 * **#1202** (Swift Winds store currentMp), **#1160** (Glass Realm
 * Strike / incoming ×2), **#1148** (Vampiric Ground attacker HP),
 * **#1182** (Void Rift player turn-start). Do not refile Doka
 * Fever *reward* ×2 — `applyRewardMultiplier` already runs on
 * `rawDoka`. Do not put the player into `combatantsRef`.
 *
 * Do not restack WorldExploration / mapModifiers / spawnPolicy.
 * Restack the battle-start `flushSync` onto
 * `executeDokaFeverEnemyHp` after older combat PRs land, then
 * `updateCombatant` *and* write `enemyHpMap` from the returned
 * `hp` / `maxHp` (the precomputed `hpMap` must not win). Leave
 * `applyRewardMultiplier` alone.
 */

import { MAP_MODIFIER_DOKA_FEVER_ENEMY_HP_BONUS } from "../data/gameConstants.ts";
import { countsTowardKillRewards } from "./battleSetup.ts";

export const DOKA_FEVER_MODIFIER_ID = "doka_fever";

export type DokaFeverEnemyHpExecute = {
  hp: number;
  maxHp: number;
};

function toNat(n: number): number {
  const value = Math.floor(Number(n));
  return Number.isFinite(value) ? Math.max(0, value) : 0;
}

export function isDokaFeverModifier(
  modifierId: string | null | undefined,
): boolean {
  return modifierId === DOKA_FEVER_MODIFIER_ID;
}

/** Advertised +25%. Non-finite / ≤0 catalog values yield 0. */
export function dokaFeverBonusFraction(): number {
  const bonus = Number(MAP_MODIFIER_DOKA_FEVER_ENEMY_HP_BONUS);
  if (!Number.isFinite(bonus) || bonus <= 0) return 0;
  return bonus;
}

/**
 * Registry `onBattleStart` bonus: `floor((maxHp ?? hp) * 0.25)`.
 * Battle-start enemies are at full pool, so this is +25% of the
 * pool WX should stamp onto both store and `enemyHpMap`.
 */
export function dokaFeverBonusHp(baseMaxHp: number, baseHp: number): number {
  const max = Number(baseMaxHp);
  const hp = Number(baseHp);
  const pool =
    Number.isFinite(max) && max > 0 ? max : Number.isFinite(hp) ? hp : 0;
  const fraction = dokaFeverBonusFraction();
  if (pool <= 0 || fraction <= 0) return 0;
  return Math.floor(pool * fraction);
}

/** Registry `hp += bonus` / `maxHp += bonus` on a full pool. */
export function dokaFeverStampedHp(
  baseHp: number,
  baseMaxHp: number,
): { hp: number; maxHp: number } {
  const hp = toNat(baseHp);
  const max = toNat(baseMaxHp);
  const bonus = dokaFeverBonusHp(max, hp);
  const stampedMax = (max > 0 ? max : hp) + bonus;
  return { hp: hp + bonus, maxHp: stampedMax };
}

/**
 * Live `doka_fever` `onBattleStart` gate. `??` only falls through
 * on null/undefined, so an overworld rat with neither `isEnemy`
 * nor `side` is skipped. Advertised enemies use
 * `countsTowardKillRewards` (absent side defaults to enemy).
 */
export function liveRegistryDokaFeverHpGate(c: {
  isEnemy?: boolean;
  side?: "player" | "enemy";
  isSummon?: boolean;
}): boolean {
  return c.isEnemy ?? c.side === "enemy";
}

/** Advertised filter: overworld rats and enemy summons, not player wolves. */
export function advertisedDokaFeverHpTarget(c: {
  isSummon?: boolean;
  side?: "player" | "enemy";
}): boolean {
  return countsTowardKillRewards(c);
}

/** Live applyBattleStart is handed Enemy[] from generateEnemies — no side. */
export function wxGenerateEnemiesWritesSide(): boolean {
  return false;
}

/** Live applyBattleStart never writes enemyHpMap from the hook result. */
export function wxBattleStartHpMapUsesCalcEnemyMaxHp(): boolean {
  return true;
}

/** Live WX never derives an isDokaFever flag from the active-id set. */
export function wxHasDokaFeverFlag(): boolean {
  return false;
}

/** Live WX never mentions doka_fever, so no dedicated enemy-HP arm. */
export function wxMentionsDokaFever(): boolean {
  return false;
}

/** Live WX never stamps +25% onto store + HUD for untagged overworld rats. */
export function liveWxDokaFeverStampsEnemyHp(): boolean {
  return false;
}

export function canExecuteDokaFeverEnemyHp(args: {
  modifierActive: boolean;
  isSummon?: boolean;
  side?: "player" | "enemy";
}): boolean {
  return (
    args.modifierActive === true &&
    dokaFeverBonusFraction() > 0 &&
    advertisedDokaFeverHpTarget(args)
  );
}

/** Alias so decide and the battle-start restack cannot fork. */
export function shouldDecideDokaFeverEnemyHp(
  args: Parameters<typeof canExecuteDokaFeverEnemyHp>[0],
): boolean {
  return canExecuteDokaFeverEnemyHp(args);
}

export function dokaFeverHighlightedHpIsExecutable(args: {
  decided: boolean;
  executable: boolean;
}): boolean {
  return args.decided === true && args.executable === true;
}

/**
 * Commit advertised +25% onto an enemy HP / maxHp pool.
 * Player-side summons and inactive modifier return null.
 * Reward ×2 / Titan +1000 / Iron Curse RES are not in this payload.
 */
export function executeDokaFeverEnemyHp(args: {
  modifierActive: boolean;
  baseHp: number;
  baseMaxHp: number;
  isSummon?: boolean;
  side?: "player" | "enemy";
}): DokaFeverEnemyHpExecute | null {
  if (!canExecuteDokaFeverEnemyHp(args)) return null;
  return dokaFeverStampedHp(args.baseHp, args.baseMaxHp);
}

/**
 * Live battle-start leftover: registry mutates store only when the
 * `isEnemy ?? side` gate passes; HUD is always the precomputed
 * `calcEnemyMaxHp` map. Untagged overworld rats keep both pools
 * unstamped.
 */
export function liveWxDokaFeverBattleHp(args: {
  spawnHp: number;
  calcEnemyMaxHp: number;
  isEnemy?: boolean;
  side?: "player" | "enemy";
  isSummon?: boolean;
}): { storeHp: number; hudHp: number } {
  const spawn = toNat(args.spawnHp);
  const hud = toNat(args.calcEnemyMaxHp);
  if (
    liveRegistryDokaFeverHpGate({
      isEnemy: args.isEnemy,
      side: args.side,
      isSummon: args.isSummon,
    })
  ) {
    return {
      storeHp: dokaFeverStampedHp(spawn, spawn).hp,
      hudHp: hud,
    };
  }
  return { storeHp: spawn, hudHp: hud };
}
