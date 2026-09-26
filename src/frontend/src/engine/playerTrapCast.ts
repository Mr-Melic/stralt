/**
 * Player Trap (`isTrap`) preview vs execute.
 *
 * Enemy / summon-AI `resolveSpellCast` already places a 3-turn barrier on
 * the target cell. Player `resolvePlayerCast` had no trap branch, so a
 * highlighted legal tile (empty ground, or an enemy-kit cell) returned
 * `"cast"`, spent AP, and either applied nothing or — when a hostile sat
 * on the cell — fell into the damage loop (`calcScaledDamageInline(0)`
 * floors to 1). Strike / Mark / Barrier empty rings are unchanged.
 *
 * The live gate stays in `isTileCastableLive`. This module is the single
 * extra execute check so a highlighted trap tile actually places.
 */

export type PlayerTrapSpell = {
  isTrap?: boolean;
  isBarrier?: boolean;
  isMark?: boolean;
  isSummon?: boolean;
  isSacrifice?: boolean;
};

/** Same duration `resolveSpellCast` already uses for `isTrap`. */
export function playerTrapPlacementTurns(): number {
  return 3;
}

export function playerTrapResolvesOnTile(
  spell: PlayerTrapSpell,
  isPlayerTile: boolean,
): boolean {
  return spell.isTrap === true && isPlayerTile !== true;
}

export function playerTrapAbortsOnCasterTile(
  spell: PlayerTrapSpell,
  isPlayerTile: boolean,
): boolean {
  return spell.isTrap === true && isPlayerTile === true;
}

/**
 * Trap is not Barrier / Mark / Summon / Sacrifice. Those kits keep their
 * own hoist. Tests use this so a sibling PR cannot silently steal Trap.
 */
export function playerTrapIsPlacementKit(spell: PlayerTrapSpell): boolean {
  if (spell.isTrap !== true) return false;
  if (spell.isBarrier === true) return false;
  if (spell.isMark === true) return false;
  if (spell.isSummon === true) return false;
  if (spell.isSacrifice === true) return false;
  return true;
}

export type PlayerTrapCastResult = "cast" | "abort";

/**
 * Player execute body for Trap. `null` means this is not a trap kit —
 * `resolvePlayerCast` continues (Strike / Mark / Barrier / damage loop).
 * Highlighted legal tiles return `"cast"` after placing; the caster tile
 * returns `"abort"` so AP is not spent.
 */
export function applyPlayerTrapCast(args: {
  spell: PlayerTrapSpell & { name?: string; effectType?: string };
  isPlayerTile: boolean;
  gridPos: { x: number; y: number };
  placeBarrierTile: (cell: { x: number; y: number }, turns: number) => void;
  log: (msg: string, color?: string) => void;
  recordSpellType: (effectType: string) => void;
}): PlayerTrapCastResult | null {
  if (args.spell.isTrap !== true) return null;
  if (!playerTrapResolvesOnTile(args.spell, args.isPlayerTile)) {
    return "abort";
  }
  args.placeBarrierTile(args.gridPos, playerTrapPlacementTurns());
  const name = args.spell.name ?? "Trap";
  args.log(
    `${name} placed a trap at (${args.gridPos.x},${args.gridPos.y})!`,
    "#f59e0b",
  );
  args.recordSpellType(args.spell.effectType ?? "damage");
  return "cast";
}
