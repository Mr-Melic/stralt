/**
 * Player spell-bar select stays live while a summon is controlled.
 *
 * BattleUIPanel SECTION 2e says the player's own spell-slot row is dimmed
 * when `isSummonControlled` (same gate as END TURN). Live END TURN is
 * disabled for that flag; the eight champion slots are not. Slot `onClick`
 * only checks `inBattle` / cooldown, and WorldExploration `onSelectSpell`
 * writes `selectedSpellIdRef` whenever `!inBattle || currentBattleAp > 0`.
 * A click during a wisp turn therefore arms a champion spell (and Attack
 * mode) that `#1238` / `shouldAllowPlayerCastEntry` already refuse to fire
 * until the player row returns.
 *
 * `#1263` named Digit/Numpad as this leftover. Main has no Digit / Numpad
 * / `e.key === "1"` listeners on BattleUIPanel or WorldExploration — the
 * live analog is pointer select on `battle_ui.spell.*`.
 *
 * Distinct from kit Attack Nearest dest (`#1238`), enemy-sprite dest
 * (`#1260`), self/ally sprite dest (`#1263`), kit remaining (`#1205` /
 * `#1206` / `#1211` / `#1214`), and SummonControlPanel kit clicks.
 *
 * Unique fire: controlling wisp, champion Inferno in slot 1, pointer on
 * that slot. Live select writes `spell-inferno`. Helper returns null so
 * the bar cannot re-arm the champion kit. Player turn / empty id / kit
 * panel `onSpellSelect` cannot as this leftover.
 *
 * Do not restack WorldExploration / BattleUIPanel / SummonControlPanel /
 * summonControlCast / playerCastGate. Restack slot `disabled` / `onClick`
 * and `onSelectSpell` onto `shouldAllowPlayerSpellBarSelect` after older
 * combat PRs land.
 */

export type PlayerSpellBarSelectArgs = {
  isSummonControlled: boolean;
  spellId?: string | null;
};

/**
 * Champion bar may change `selectedSpellIdRef` only when a summon is not
 * acting. END TURN already uses this flag; the slot row does not.
 */
export function shouldAllowPlayerSpellBarSelect(opts: {
  isSummonControlled: boolean;
}): boolean {
  return opts.isSummonControlled !== true;
}

/**
 * Spell-slot opacity while a summon is controlled. Live slots stay fully
 * opaque (`isOnCooldown || !inBattle` only). END TURN uses `opacity-40`.
 */
export function playerSpellBarSelectOpacity(opts: {
  isSummonControlled: boolean;
  isOnCooldown: boolean;
  inBattle: boolean;
}): number {
  if (!shouldAllowPlayerSpellBarSelect(opts)) return 0.4;
  if (opts.isOnCooldown || opts.inBattle !== true) return 0.5;
  return 1;
}

/**
 * Spell id the champion bar should write. Null keeps the previous
 * selection (and the summon kit) instead of arming a player spell.
 */
export function resolvePlayerSpellBarSelect(
  opts: PlayerSpellBarSelectArgs,
): string | null {
  if (!shouldAllowPlayerSpellBarSelect(opts)) return null;
  const id = opts.spellId;
  if (typeof id !== "string" || id.length === 0) return null;
  return id;
}
