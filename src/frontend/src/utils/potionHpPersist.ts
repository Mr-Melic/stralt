/**
 * Potion consume spends inventory, not Doka. persistAbsoluteProgress skips
 * saveBattleStats when spend is 0 (stale-prop double-click guard). Without
 * an HP-only path, a reload hydrates pre-potion canister HP and the stack
 * is gone.
 *
 * File is a sidecar so itemShop.ts / WorldExploration.tsx stay merge-clean
 * vs older persist PRs. persistAbsoluteProgress should honor
 * `allowZeroSpendHp` when this returns true.
 */

import { shouldWriteAbsoluteSpend } from "./itemShop.ts";

export function shouldPersistAbsoluteHpOnly(args: {
  spend: number;
  hpBefore: number;
  hpAfter: number;
}): boolean {
  if (shouldWriteAbsoluteSpend(args.spend)) return false;
  const before = Math.max(0, Math.floor(Number(args.hpBefore) || 0));
  const after = Math.max(0, Math.floor(Number(args.hpAfter) || 0));
  return after > before;
}

export function nextHpAfterPotionHeal(
  currentHp: number,
  maxHp: number,
  fraction: number,
): number {
  const hp = Math.max(0, Math.floor(Number(currentHp) || 0));
  const max = Math.max(1, Math.floor(Number(maxHp) || 0));
  const frac = Math.max(0, Number(fraction) || 0);
  const add = Math.floor(max * frac);
  return Math.min(max, hp + add);
}

export function shouldEnqueueAbsoluteProgressWrite(args: {
  spend: number;
  hpBefore: number;
  hpAfter: number;
  allowZeroSpendHp?: boolean;
}): boolean {
  if (shouldWriteAbsoluteSpend(args.spend)) return true;
  return args.allowZeroSpendHp === true && shouldPersistAbsoluteHpOnly(args);
}
