/**
 * Iron Curse vs advertised player RES ×1.3.
 *
 * Registry (`mapModifiers.ts` `iron_curse`) announces
 *   "Iron Curse: +30% RES, healing halved."
 * `MAP_MODIFIER_IRON_CURSE_RES_BONUS` is 0.3. `onBattleStart` does
 * `c.res = Math.floor((c.res ?? 0) * 1.3)` on every combatant it is
 * handed. Healing ×0.5 is **#1155** (`executeIronCurseHealScale`) —
 * this sidecar does not touch heal sites.
 *
 * Live WorldExploration never stamps the player:
 * - `applyBattleStart` has one caller: battle-start `flushSync`. It
 *   passes `combatantsRef.current` (`Enemy[]`). Player lives outside
 *   that list (`playerTurnStartModifierTarget` must not fall back to
 *   `[0]` — that valid plague/void fix is **keep**).
 * - `playerTakesDamage` (boss kit / DoT) soaks
 *   `characterStatsRef.current.res` with no 1.3.
 * - Pack-enemy melee / spell preview soak `characterStats.res` the
 *   same way. Writing the stamped RES at battle start is the shared
 *   fix; do not restack melee onto `playerTakesDamage`.
 * - WX has `isPlagueZone` / `isVoidRift` and no `isIronCurse`.
 *
 * Sequence: Iron Curse map → starting champion RES 10 → boss kit
 * Frost Bolt (`starter-frost` 20) through `playerTakesDamage` (no
 * pack-enemy pre-soak) at 100 HP 0 shield → expected 83, actual 82.
 *
 * Unique vs **#1155** (heal ×0.5; that execute returns no `res`),
 * **#1160** (Glass Realm Strike / incoming ×2), **#1148** (Vampiric
 * Ground attacker HP), Titan +1000 HP / 1–5× (sibling of this same
 * `applyBattleStart` / Strike skip — do not add `hp` / `roll`),
 * **#1104** (boss kit CHC). Do not put the player back into
 * `combatantsRef`.
 *
 * Do not restack WorldExploration / mapModifiers / battleSetup.
 * Restack the battle-start `flushSync` onto
 * `executeIronCursePlayerRes` after older combat PRs land, then
 * `setCharacterStats` the returned `res`. Leave enemy in-place
 * `combatantsRef` mutation alone.
 */

import { MAP_MODIFIER_IRON_CURSE_RES_BONUS } from "../data/gameConstants.ts";

export const IRON_CURSE_RES_MODIFIER_ID = "iron_curse";

export type IronCursePlayerResExecute = {
  res: number;
  damage: number;
  hpAfter: number;
};

export function isIronCurseResModifier(
  modifierId: string | null | undefined,
): boolean {
  return modifierId === IRON_CURSE_RES_MODIFIER_ID;
}

/** Registry `onBattleStart`: `Math.floor(res * 1.3)`. */
export function ironCurseScaledRes(baseRes: number): number {
  const res = Number(baseRes);
  if (!Number.isFinite(res)) return 0;
  return Math.floor(res * (1 + MAP_MODIFIER_IRON_CURSE_RES_BONUS));
}

/**
 * Same soak as live `playerTakesDamage`:
 * `Math.max(1, Math.round(incoming * max(0, 1 - res / 100)))`.
 */
export function incomingAfterPlayerRes(
  incomingDamage: number,
  res: number,
): number {
  const packet = Number(incomingDamage);
  if (!Number.isFinite(packet) || packet <= 0) return 0;
  const effRes = Number(res);
  const factor = Math.max(0, 1 - (Number.isFinite(effRes) ? effRes : 0) / 100);
  return Math.max(1, Math.round(packet * factor));
}

/** Live applyBattleStart is handed Enemy[] — player is not in the list. */
export function wxApplyBattleStartReceivesPlayer(): boolean {
  return false;
}

/** Live battle-start flushSync never writes characterStats.res. */
export function wxBattleStartWritesCharacterStatsRes(): boolean {
  return false;
}

/**
 * Live playerTakesDamage soaks characterStatsRef.current.res.
 * After the battle-start stamp, that read is the advertised RES.
 */
export function wxPlayerTakesDamageSoaksCharacterStatsRes(): boolean {
  return true;
}

/** Live WX never derives an isIronCurse flag from the active-id set. */
export function wxHasIronCurseResFlag(): boolean {
  return false;
}

/** Live WX never writes floor(res * 1.3) onto the player. */
export function liveWxIronCurseScalesPlayerRes(): boolean {
  return false;
}

export function canExecuteIronCursePlayerRes(args: {
  modifierActive: boolean;
  incomingDamage: number;
}): boolean {
  if (args.modifierActive !== true) return false;
  const packet = Number(args.incomingDamage);
  return Number.isFinite(packet) && packet > 0;
}

/** Alias so decide and the battle-start restack cannot fork. */
export function shouldDecideIronCursePlayerRes(
  args: Parameters<typeof canExecuteIronCursePlayerRes>[0],
): boolean {
  return canExecuteIronCursePlayerRes(args);
}

export function ironCurseHighlightedResIsExecutable(args: {
  decided: boolean;
  executable: boolean;
}): boolean {
  return args.decided === true && args.executable === true;
}

/**
 * Commit advertised RES ×1.3 onto the incoming soak. Incoming ≤ 0 is
 * a no-op so a missing packet cannot mint 1 HP from Math.max(1, …).
 * Heal / Titan HP / Glass ×2 / CHC are not in this payload.
 */
export function executeIronCursePlayerRes(args: {
  modifierActive: boolean;
  baseRes: number;
  incomingDamage: number;
  currentHp: number;
}): IronCursePlayerResExecute | null {
  if (!canExecuteIronCursePlayerRes(args)) return null;
  const res = ironCurseScaledRes(args.baseRes);
  const damage = incomingAfterPlayerRes(args.incomingDamage, res);
  const hp = Math.max(0, Number(args.currentHp) || 0);
  return { res, damage, hpAfter: Math.max(0, hp - damage) };
}
