/**
 * Dungeon-chain HUD / nearby-portal chrome. Display only — not wired into
 * WorldExploration.tsx (forbidden while older open PRs own that file).
 *
 * UX-DUNGEON-CHAIN-MULTIPLIER: the live chip and nearby label print
 * `Dungeon d/max` / `Continue Chain (d/max)` with no Doka ×N. Recap is
 * the first surface that says “multiplier”. Distinct from UX-PORTAL-LEGEND
 * (unlabeled portal kinds) and UX-REST-AREA-NEXT-CHIP.
 */

import { dungeonDokaMultiplierFor } from "../engine/portalRules.ts";

function floorNat(n: number): number {
  return Math.max(0, Math.floor(Number(n) || 0));
}

/** `×1.5` / `×2` — matches dungeonDokaMultiplierFor. */
export function formatDungeonDokaTimes(mult: number): string {
  const n = Number(mult);
  if (!Number.isFinite(n) || n <= 0) return "×1";
  const shown = Number.isInteger(n)
    ? String(n)
    : n.toFixed(1).replace(/\.0$/, "");
  return `×${shown}`;
}

export const DUNGEON_CHAIN_ENTER_LABEL =
  "⚔️ Enter Dungeon Chain — Doka grows with depth";

/** Nearby label while already in a chain. */
export function dungeonChainContinueLabel(
  depth: number,
  maxDepth: number,
): string {
  const d = floorNat(depth);
  const max = Math.max(1, floorNat(maxDepth) || 1);
  const times = formatDungeonDokaTimes(dungeonDokaMultiplierFor(true, d));
  return `⚔️ Continue Chain (${d}/${max}) — Doka ${times}`;
}

/** Live HUD chip. */
export function dungeonChainHudLabel(depth: number, maxDepth: number): string {
  const d = floorNat(depth);
  const max = Math.max(1, floorNat(maxDepth) || 1);
  const times = formatDungeonDokaTimes(dungeonDokaMultiplierFor(true, d));
  return `⚔️ Dungeon ${d}/${max} — Doka ${times}`;
}
