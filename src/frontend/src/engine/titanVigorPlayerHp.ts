/**
 * Titan's Vigor vs advertised player +1000 HP.
 *
 * Registry (`mapModifiers.ts` `titans_vigor`) announces
 *   "Titan's Vigor: +1000 HP, damage rolls 1-5x."
 * `MAP_MODIFIER_TITANS_VIGOR_HP_BONUS` is 1000. `onBattleStart` does
 * `c.maxHp = (c.maxHp ?? c.hp) + 1000` then `c.hp += 1000` on every
 * combatant it is handed. The 1–5× roll is **#1160** leftover
 * (`applyDamageDealt` on Strike / incoming) — this sidecar does not
 * add `roll`.
 *
 * Live WorldExploration never stamps the player:
 * - `applyBattleStart` has one caller: battle-start `flushSync`. It
 *   passes `combatantsRef.current` (`Enemy[]`). Player lives outside
 *   that list (`playerTurnStartModifierTarget` must not fall back to
 *   `[0]` — that valid plague/void fix is **keep**).
 * - Player `maxHp` is the level formula
 *   `100 * (1 + (level-1) * growth)` — it never reads the hook.
 * - `playerTakesDamage` writes `prev.hp` with no +1000, so a
 *   post-RES 100 packet is lethal on the live 100 pool and would
 *   leave 1000 on the advertised 1100 pool (`persistDeathPenalty`
 *   instead of the rest of the fight).
 * - WX has `isPlagueZone` / `isVoidRift` and no `isTitansVigor`.
 *
 * Sequence: Titan's Vigor map → starting champion HP 100 → incoming
 * 100 after RES (raw ~111 at RES 10) through `playerTakesDamage`.
 *
 * | | Expected | Actual (live WX) |
 * |---|---|---|
 * | Battle-start HP / maxHp | 1100 / 1100 | 100 / 100 |
 * | Incoming 100 after RES | HP 1000, fight continues | HP 0, death persist |
 *
 * Unique vs **#1200** (Iron Curse player RES ×1.3 — same
 * `applyBattleStart` skip; that execute returns `res` and no `hp`
 * stamp), **#1155** (Iron Curse heal ×0.5), **#1160** (Glass Realm
 * Strike / incoming ×2; Titan 1–5× leftover — do not add `roll`),
 * **#446** (Mirror/betrayal writing *enemy* pre-Titan store HP),
 * **#1148** (Vampiric Ground attacker HP), **#1199** (Mending Mist
 * store HP on turn-start copies). Do not put the player back into
 * `combatantsRef`.
 *
 * Do not restack WorldExploration / mapModifiers / battleSetup.
 * Restack the battle-start `flushSync` onto
 * `executeTitanVigorPlayerHp` after older combat PRs land, then
 * `setCharacterStats` the returned `hp` and raise the battle-local
 * maxHp (the level-formula `maxHp` useMemo is a restack detail —
 * do not fork potions onto this sidecar). Leave enemy in-place
 * `combatantsRef` mutation alone.
 */

import { MAP_MODIFIER_TITANS_VIGOR_HP_BONUS } from "../data/gameConstants.ts";
import { hpAfterIncomingDamage } from "./battleSetup.ts";

export const TITANS_VIGOR_MODIFIER_ID = "titans_vigor";

export type TitanVigorPlayerHpExecute = {
  hp: number;
  maxHp: number;
  damage: number;
  hpAfter: number;
};

export function isTitansVigorModifier(
  modifierId: string | null | undefined,
): boolean {
  return modifierId === TITANS_VIGOR_MODIFIER_ID;
}

/** Advertised flat +1000. Non-finite / ≤0 catalog values yield 0. */
export function titanVigorBonusHp(): number {
  const bonus = Number(MAP_MODIFIER_TITANS_VIGOR_HP_BONUS);
  if (!Number.isFinite(bonus) || bonus <= 0) return 0;
  return bonus;
}

/** Registry `onBattleStart`: `hp + 1000`. */
export function titanVigorStampedHp(baseHp: number): number {
  const hp = Number(baseHp);
  const live = Number.isFinite(hp) ? hp : 0;
  return live + titanVigorBonusHp();
}

/** Registry `onBattleStart`: `(maxHp ?? hp) + 1000`. */
export function titanVigorStampedMaxHp(
  baseMaxHp: number,
  baseHp: number,
): number {
  const max = Number(baseMaxHp);
  const hp = Number(baseHp);
  const pool =
    Number.isFinite(max) && max > 0 ? max : Number.isFinite(hp) ? hp : 0;
  return pool + titanVigorBonusHp();
}

/** Live applyBattleStart is handed Enemy[] — player is not in the list. */
export function wxApplyBattleStartReceivesPlayer(): boolean {
  return false;
}

/** Live battle-start flushSync never writes characterStats.hp +1000. */
export function wxBattleStartWritesCharacterStatsHp(): boolean {
  return false;
}

/**
 * Live player maxHp is the level-growth formula. It never reads
 * Titan's Vigor or characterStats.maxHp.
 */
export function wxPlayerMaxHpIsLevelFormula(): boolean {
  return true;
}

/** Live WX never derives an isTitansVigor flag from the active-id set. */
export function wxHasTitansVigorFlag(): boolean {
  return false;
}

/** Live WX never writes +1000 onto the player HP / maxHp pool. */
export function liveWxTitansVigorStampsPlayerHp(): boolean {
  return false;
}

export function canExecuteTitanVigorPlayerHp(args: {
  modifierActive: boolean;
}): boolean {
  return args.modifierActive === true && titanVigorBonusHp() > 0;
}

/** Alias so decide and the battle-start restack cannot fork. */
export function shouldDecideTitanVigorPlayerHp(
  args: Parameters<typeof canExecuteTitanVigorPlayerHp>[0],
): boolean {
  return canExecuteTitanVigorPlayerHp(args);
}

export function titanVigorHighlightedHpIsExecutable(args: {
  decided: boolean;
  executable: boolean;
}): boolean {
  return args.decided === true && args.executable === true;
}

/**
 * Commit advertised +1000 onto the player HP / maxHp pool, then apply
 * an optional post-RES incoming packet. Incoming ≤ 0 is the
 * battle-start stamp only. Iron Curse RES / heal / Titan 1–5× / Glass
 * ×2 are not in this payload.
 */
export function executeTitanVigorPlayerHp(args: {
  modifierActive: boolean;
  baseHp: number;
  baseMaxHp: number;
  incomingDamage?: number;
}): TitanVigorPlayerHpExecute | null {
  if (!canExecuteTitanVigorPlayerHp(args)) return null;
  const hp = titanVigorStampedHp(args.baseHp);
  const maxHp = titanVigorStampedMaxHp(args.baseMaxHp, args.baseHp);
  const packet = Number(args.incomingDamage);
  const damage = Number.isFinite(packet) && packet > 0 ? packet : 0;
  const { newHp } = hpAfterIncomingDamage(hp, damage);
  return { hp, maxHp, damage, hpAfter: newHp };
}
