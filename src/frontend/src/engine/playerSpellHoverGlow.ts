/**
 * RAF champion spell hover still pulses dests outside the painted range
 * ring.
 *
 * Live WorldExploration glow (~7616–7657):
 *   if (isHovered && tileType === "floor") {
 *     isSpellHover = inBattle && battleActionMode === "attack"
 *                   && selectedSpellIdRef.current
 *     // purple spell pulse — no `getSpellRangeTiles`, no `spellTiles.has`
 *   }
 *
 * RAF already paints the blue ring from `getSpellRangeTiles` /
 * `computeTargetableTiles` (origin = `getActiveCasterPos`, which is the
 * player tile when no summon is controlled). Canvas execute already
 * `probeLiveCast`s then `decideTileCastClick` (`spellTiles.has` for empty
 * dests; living hostiles use the live gate). `#1350` is the champion walk
 * **glow** on dests outside the MP ring. `#1344` is the champion walk
 * **label**. This leftover is the attack-mode **purple glow** on dests
 * the blue ring never offered.
 *
 * `#1334` is summon-control walk label membership. `#1324` is hover
 * origin + wallet during control. `#757` is summon-control LoS/AP
 * highlight. `#708` is player bar AP/CD emptying the executable set.
 * `#417` is walk hover BFS dest cost. Overworld cream glow
 * (`isHovered && floor` with neither spell nor walk) stays the next
 * leftover.
 *
 * Unique fire: player at (8,8), Strike selected (Chebyshev range 1),
 * leftover AP 4, living hostile dest (12,8) path/Chebyshev 4. Live
 * leftover still pulses the spell glow (100, 150, 255). Dest is not in
 * the range-1 ring and cannot execute. Inverse: living hostile neighbour
 * (9,8) is in the ring, keeps the glow, and executes at 2 AP.
 *
 * `PLAYER_BASE_AP` is 8. Unique fire uses leftover 4 (WX `useState(4)`)
 * which can pay Strike 2 — the leftover is range, not AP. Strike range
 * 1 cannot pay Chebyshev 4. Do not rebalance Strike or `PLAYER_BASE_AP`.
 *
 * Do not restack WorldExploration / BattleUIPanel / SummonControlPanel /
 * summonControlCast / targeting / spellEngine / playerCastPlan /
 * `#417` / `#701` / `#708` / `#743` / `#757` / `#1322` / `#1324` /
 * `#1330` / `#1334` / `#1344` / `#1350`. Restack glow onto
 * `playerSpellHoverGlowShows` after older combat PRs land
 * (`isSpellHover && spellTiles.has`).
 */

import { canAffordCastAp } from "./targeting.ts";

export type PlayerSpellHoverGlowCell = { x: number; y: number };

/** Chebyshev the blue ring and live gate already share. */
export function playerSpellHoverGlowChebyshev(
  origin: PlayerSpellHoverGlowCell,
  dest: PlayerSpellHoverGlowCell,
): number {
  return Math.max(Math.abs(dest.x - origin.x), Math.abs(dest.y - origin.y));
}

/**
 * Live leftover: dest-is-floor while Attack is selected with a spell id
 * in battle. Ignores whether RAF painted the dest in the range ring.
 * Own tile still pulses.
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
 * Intended: dest must also be in the painted spell range ring.
 * Walk-MP glow stays `#1350`. Cream overworld/generic glow stays the
 * next leftover. AP emptying the ring stays `#708`.
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
  origin: PlayerSpellHoverGlowCell;
  dest: PlayerSpellHoverGlowCell;
  currentAp: number;
  apCost: number;
};

/**
 * Champion spell-hover glow membership for this leftover. Dest is in the
 * player range ring RAF already scans. Walk glow stays `#1350`.
 * Summon-control kit highlight stays `#757`.
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
 * Execute the glowing range dest as a champion cast. Dest outside the
 * ring / 0 leftover AP / summon-control / Walk cannot. Same
 * `spellTiles.has` + live-gate pair as canvas (`decideTileCastClick`).
 */
export function canExecutePlayerSpellHoverGlowDest(
  args: PlayerSpellHoverGlowDestArgs,
): boolean {
  if (!shouldApplyPlayerSpellHoverGlow(args)) return false;
  return canAffordCastAp(args.currentAp, args.apCost);
}

export function playerSpellHoverGlowHighlightedIsExecutable(args: {
  glowing: boolean;
  executable: boolean;
}): boolean {
  return args.glowing === true && args.executable === true;
}

/** Live leftover spell-hover pulse RGB (WX `isSpellHover` branch). */
export const LIVE_PLAYER_SPELL_HOVER_GLOW_RGB = {
  r: 100,
  g: 150,
  b: 255,
} as const;
