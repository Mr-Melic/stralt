/**
 * Persist AP/MP hard caps (MAX_PERSISTED_AP/MP = 20) are a silent
 * action-economy ceiling. Motoko Nat level is unbounded; the persist
 * writer still stops growing pools at 20.
 *
 * Official formula: PLAYER_BASE + floor(level / apMpLevelThreshold).
 * Admin may set the threshold to 1 (validateLevelUpConfig 1–100), which
 * applies the cap from level 12 (AP) / 16 (MP) without converting stored
 * pools. Default threshold 25 hits the AP cap at level 300.
 *
 * Distinct from 09-21-003 (do not mint 20 AP at L1) and 09-28-003
 * (incoming AP/MP is not keep-stored vs stored). No schema. Do not edit
 * main.mo / adminGuard.mo while older persist PRs queue.
 */

import {
  MAX_PERSISTED_AP,
  MAX_PERSISTED_MP,
  PLAYER_BASE_AP,
  PLAYER_BASE_MP,
  maxPersistedAp,
  maxPersistedMp,
} from "./adminSafety.ts";

export const AP_MP_THRESHOLD_ADMIN_MIN = 1;
export const AP_MP_THRESHOLD_ADMIN_MAX = 100;
export const DEFAULT_AP_MP_THRESHOLD = 25;

export function uncappedPersistedAp(level: number, threshold: number): number {
  const lvl = Math.max(1, Math.floor(level));
  const every = Math.max(1, Math.floor(threshold));
  return PLAYER_BASE_AP + Math.floor(lvl / every);
}

export function uncappedPersistedMp(level: number, threshold: number): number {
  const lvl = Math.max(1, Math.floor(level));
  const every = Math.max(1, Math.floor(threshold));
  return PLAYER_BASE_MP + Math.floor(lvl / every);
}

/** True when the persist writer would return 20 while the uncapped formula is higher. */
export function persistApHardCapIsSilentMax(
  level: number,
  threshold: number,
): boolean {
  return (
    uncappedPersistedAp(level, threshold) > MAX_PERSISTED_AP &&
    maxPersistedAp(level, threshold) === MAX_PERSISTED_AP
  );
}

export function persistMpHardCapIsSilentMax(
  level: number,
  threshold: number,
): boolean {
  return (
    uncappedPersistedMp(level, threshold) > MAX_PERSISTED_MP &&
    maxPersistedMp(level, threshold) === MAX_PERSISTED_MP
  );
}

/**
 * First level at which persist AP equals the hard cap for this threshold.
 * floor(level / threshold) >= (20 - 8) → level >= 12 * threshold.
 */
export function firstLevelWherePersistApHitsHardCap(threshold: number): number {
  const every = Math.max(1, Math.floor(threshold));
  return (MAX_PERSISTED_AP - PLAYER_BASE_AP) * every;
}

export function adminMaySetApMpThreshold(threshold: number): boolean {
  const n = Math.floor(threshold);
  return n >= AP_MP_THRESHOLD_ADMIN_MIN && n <= AP_MP_THRESHOLD_ADMIN_MAX;
}
