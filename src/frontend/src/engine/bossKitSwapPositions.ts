/**
 * Boss kit Swap advertised position-exchange is unused.
 *
 * Catalog Swap (`spell-swap`): `isSwap: true`, `damage: 0`,
 * "Teleport caster and target to each other's cells". Player CAST runs
 * `ctx.swapPositions` (`spellEngine` resolvePlayerCast). Enthroned Void
 * phase-1 first-id is Swap; Void Grandmaster phase-2 first-id is Swap.
 * Every `useBossAI` decide therefore returns `{ type: "spell", spellId:
 * "spell-swap", targetX/Y: player }` on those turns.
 *
 * Kit apply (`WorldExploration` ~15813) has no `isSwap` branch. Damage is
 * 0 so the hit arm no-ops; dest occupancy then writes the boss onto the
 * player tile (`updateCombatant(..., { x: bossSpellDest.x, y: bossSpellDest.y })`)
 * without moving the player. Both bodies share the player cell.
 *
 * #1280 (`bossKitCasterDestOccupancy`) keeps the caster off that dest, so
 * a later restack turns Swap into a complete no-op instead of an exchange.
 * This sidecar is the missing exchange, not dest occupancy.
 *
 * Sequence: Enthroned Void kit Swap with player at (8,8) and Void at
 * (8,10) → advertised exchange; live leftover both occupy (8,8); #1280
 * restack both stay put.
 *
 * Unique vs:
 * - **#1280** kit caster dest occupancy (stay put, not exchange)
 * - **#1159** Enthroned Void kit-first Swap vs Phantom (pick-path
 *   shadowing of phantom spawn, not Swap apply)
 * - **#1164** Swap vs AP Drain (kit-first pick)
 * - **#541 / #754** player Swap leftover-walk abort / landing tax
 *
 * Do not restack WorldExploration / useBossAI / spellEngine. Restack kit
 * apply onto `advertisedKitSwapPositions` after older combat PRs land.
 * Do not change Swap range / AP (balance).
 */

export const SPELL_SWAP_ID = "spell-swap";

export const ENTHRONED_VOID_ID = "enthroned_void";

/** Phase-1 first kit id (`bossKits` `phase1SpellIds[0]`). */
export const ENTHRONED_VOID_KIT_FIRST_ID = SPELL_SWAP_ID;

export const VOID_GRANDMASTER_ID = "void_grandmaster";

/** Phase-2 first kit id (`bossKits` `phase2SpellIds[0]`). */
export const VOID_GRANDMASTER_PHASE2_KIT_FIRST_ID = SPELL_SWAP_ID;

export type KitSwapCell = { x: number; y: number };

export type KitSwapOccupancy = {
  caster: KitSwapCell;
  player: KitSwapCell;
};

function cell(pos: KitSwapCell): KitSwapCell {
  return { x: pos.x, y: pos.y };
}

function sameCell(a: KitSwapCell, b: KitSwapCell): boolean {
  return a.x === b.x && a.y === b.y;
}

/**
 * Live leftover — kit apply never calls `swapPositions` / `isSwap`.
 */
export function liveWxKitApplySwapsPositions(): boolean {
  return false;
}

/**
 * Live leftover — kit apply always writes the caster onto `bossSpellDest`
 * (the player tile from decide).
 */
export function liveWxKitApplyMovesCasterOntoDest(): boolean {
  return true;
}

/**
 * Live leftover occupancy: caster occupies the player dest; player stays.
 * Both bodies share the player cell.
 */
export function liveWxKitSwapOccupancy(
  _caster: KitSwapCell,
  player: KitSwapCell,
): KitSwapOccupancy {
  return { caster: cell(player), player: cell(player) };
}

/**
 * #1280 restack: keep the kit caster off the player dest. Swap then
 * becomes a no-op (neither body moves) because kit apply still has no
 * exchange branch.
 */
export function occupancy1280KitSwapRestack(
  caster: KitSwapCell,
  player: KitSwapCell,
): KitSwapOccupancy {
  return { caster: cell(caster), player: cell(player) };
}

/**
 * Advertised Swap: exchange caster and player cells, matching player
 * `swapPositions` (copy player pos, write caster onto the vacated player
 * cell, write player onto the vacated caster cell).
 */
export function advertisedKitSwapPositions(
  caster: KitSwapCell,
  player: KitSwapCell,
): KitSwapOccupancy {
  return { caster: cell(player), player: cell(caster) };
}

export function kitSwapSharesPlayerCell(occupancy: KitSwapOccupancy): boolean {
  return sameCell(occupancy.caster, occupancy.player);
}

export function kitSwapExchanged(
  beforeCaster: KitSwapCell,
  beforePlayer: KitSwapCell,
  after: KitSwapOccupancy,
): boolean {
  return (
    sameCell(after.caster, beforePlayer) && sameCell(after.player, beforeCaster)
  );
}

export type KitSwapTurnTrace = {
  live: KitSwapOccupancy[];
  occupancy1280: KitSwapOccupancy[];
  advertised: KitSwapOccupancy[];
};

/**
 * Two consecutive Void Swap turns. Advertised ping-pongs back to start.
 * Live leftover stays stacked on the player cell. #1280 restack never
 * moves either body.
 */
export function simulateEnthronedVoidKitSwapTurns(
  caster: KitSwapCell,
  player: KitSwapCell,
  turns: number,
): KitSwapTurnTrace {
  const n = Math.max(0, Math.floor(Number(turns) || 0));
  let liveCaster = cell(caster);
  let livePlayer = cell(player);
  let stayCaster = cell(caster);
  let stayPlayer = cell(player);
  let advertisedCaster = cell(caster);
  let advertisedPlayer = cell(player);
  const live: KitSwapOccupancy[] = [];
  const occupancy1280: KitSwapOccupancy[] = [];
  const advertised: KitSwapOccupancy[] = [];
  for (let i = 0; i < n; i++) {
    const liveAfter = liveWxKitSwapOccupancy(liveCaster, livePlayer);
    liveCaster = liveAfter.caster;
    livePlayer = liveAfter.player;
    live.push(liveAfter);

    const stayAfter = occupancy1280KitSwapRestack(stayCaster, stayPlayer);
    stayCaster = stayAfter.caster;
    stayPlayer = stayAfter.player;
    occupancy1280.push(stayAfter);

    const advertisedAfter = advertisedKitSwapPositions(
      advertisedCaster,
      advertisedPlayer,
    );
    advertisedCaster = advertisedAfter.caster;
    advertisedPlayer = advertisedAfter.player;
    advertised.push(advertisedAfter);
  }
  return { live, occupancy1280, advertised };
}
