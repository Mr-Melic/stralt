/**
 * RAF champion spell hover still pulses dests outside the painted spell
 * ring.
 *
 * Live WorldExploration glow (~7616–7657):
 *   if (isHovered && tileType === "floor") {
 *     isSpellHover = inBattle && attack && selectedSpellId
 *     // blue spell-range pulse — no `getSpellRangeTiles`, no `spellTiles.has`
 *   }
 *
 * RAF already paints the blue ring from `getSpellRangeTiles` (origin =
 * `getActiveCasterPos`, which is the player tile when no summon is
 * controlled; membership = `computeTargetableTiles` / live-ok). Canvas
 * execute already refuses dests that fail `decideTileCastClick` after
 * `spellTiles.has` (living hostiles still re-check the live gate).
 * `#1350` is the champion walk **glow** on the same pulse
 * (`isMpHover && mpTiles.has`). This leftover is the attack-mode
 * **spell-hover color** on dests the blue ring did not paint.
 *
 * `#1344` is champion walk labels. `#1334` is summon-control label
 * membership. `#1340` is kit-cast reject float. `#1280` is kit caster
 * dest. `#1350` is walk-MP glow. Attack Nearest origin stays the player
 * tile (`attackNearestLiveCasterPos`).
 *
 * Unique fire: player at (8,8), Attack + starter-frost (catalog Chebyshev
 * 4), dest (13,8) Chebyshev 5 with a live hostile. Live leftover still
 * pulses the spell-hover glow (hovered floor + attack + selected spell).
 * Dest is not in the frost ring and cannot execute. Inverse: hostile
 * neighbour (9,8) is in the ring, keeps the glow, and executes.
 *
 * `starter-frost.range` is 4. Unique fire uses dest Chebyshev 5 (catalog
 * 4 would steal dest Chebyshev 4). Do not rebalance frost range. Leftover
 * AP `useState(4)` still pays frost's 3 AP — this leftover is ring
 * membership, not wallet.
 *
 * Do not restack WorldExploration / BattleUIPanel / SummonControlPanel /
 * summonControlCast / targeting / spellEngine / `#1280` / `#1340` /
 * `#1344` / `#1350`. Restack glow onto `playerSpellHoverGlowShows` after
 * older combat PRs land (`isSpellHover && spellTiles.has`).
 */

import { decideTileCastClick, spellRangeBase } from "./targeting.ts";

export type PlayerSpellHoverGlowCell = { x: number; y: number };

/** Chebyshev the live frost ring still measures from the player. */
export function playerSpellHoverGlowChebyshev(
  origin: PlayerSpellHoverGlowCell,
  dest: PlayerSpellHoverGlowCell,
): number {
  return Math.max(Math.abs(dest.x - origin.x), Math.abs(dest.y - origin.y));
}

/**
 * Live leftover: dest-is-floor while Attack is selected with a spell in
 * battle. Ignores whether RAF painted the dest in the spell ring. Own
 * tile still pulses. Walk-mode green stays `#1350`.
 */
export function livePlayerSpellHoverGlowShows(args: {
  inBattle: boolean;
  battleActionMode: string;
  selectedSpellId: string | null | undefined;
  destIsFloor: boolean;
}): boolean {
  if (args.inBattle !== true) return false;
  if (args.battleActionMode !== "attack") return false;
  if (!args.selectedSpellId) return false;
  return args.destIsFloor === true;
}

/**
 * Intended: dest must also be in the painted spell ring. Origin stays
 * the player leftover (`#1280` is kit caster dest). Walk-MP green stays
 * `#1350`. Overworld generic gold stays another leftover.
 */
export function playerSpellHoverGlowShows(args: {
  inBattle: boolean;
  battleActionMode: string;
  selectedSpellId: string | null | undefined;
  destIsFloor: boolean;
  destInSpellRing: boolean;
}): boolean {
  if (args.destInSpellRing !== true) return false;
  return livePlayerSpellHoverGlowShows(args);
}

export type PlayerSpellHoverGlowDestArgs = {
  inBattle: boolean;
  battleActionMode: string;
  selectedSpellId: string | null | undefined;
  isSummonControlled: boolean;
  destIsFloor: boolean;
  destInSpellRing: boolean;
  occupantIsLiveHostile: boolean;
  origin: PlayerSpellHoverGlowCell;
  dest: PlayerSpellHoverGlowCell;
  spellRange: number;
};

/**
 * Champion spell-hover glow membership for this leftover. Dest is in the
 * player spell ring RAF already live-ok scans. Occupancy stays
 * `decideTileCastClick`. Summon-control dest stays `#1280`. Walk glow
 * stays `#1350`.
 */
export function shouldApplyPlayerSpellHoverGlow(
  args: Pick<
    PlayerSpellHoverGlowDestArgs,
    | "inBattle"
    | "battleActionMode"
    | "selectedSpellId"
    | "isSummonControlled"
    | "destIsFloor"
    | "destInSpellRing"
  >,
): boolean {
  if (args.isSummonControlled === true) return false;
  return playerSpellHoverGlowShows(args);
}

/**
 * Execute the glowing spell dest as a champion cast. Dest outside the
 * ring / no spell / summon-control cannot. Same `decideTileCastClick`
 * gate as canvas (hostiles re-check live range).
 */
export function canExecutePlayerSpellHoverGlowDest(
  args: PlayerSpellHoverGlowDestArgs,
): boolean {
  if (!shouldApplyPlayerSpellHoverGlow(args)) return false;
  const range = Math.max(0, Math.floor(Number(args.spellRange) || 0));
  const inRange =
    playerSpellHoverGlowChebyshev(args.origin, args.dest) <= range;
  return (
    decideTileCastClick({
      live: { ok: inRange, reason: inRange ? "enemy" : "out_of_range" },
      tileHighlighted: args.destInSpellRing,
      occupantIsLiveHostile: args.occupantIsLiveHostile,
    }).action === "execute"
  );
}

export function playerSpellHoverGlowHighlightedIsExecutable(args: {
  glowing: boolean;
  executable: boolean;
}): boolean {
  return args.glowing === true && args.executable === true;
}

/** Catalog Chebyshev the frost ring still advertises. Do not rebalance. */
export function playerSpellHoverGlowCatalogRange(
  spell: Parameters<typeof spellRangeBase>[0],
): number {
  return spellRangeBase(spell);
}

/** Live leftover spell-hover pulse RGB (WX `isSpellHover` branch). */
export const LIVE_PLAYER_SPELL_HOVER_GLOW_RGB = {
  r: 100,
  g: 150,
  b: 255,
} as const;
