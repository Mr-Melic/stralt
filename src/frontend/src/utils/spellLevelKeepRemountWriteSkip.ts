/**
 * #926 stamps remount Doka spend keep after `renameCharacter` /
 * `upgradeSpell` throw-after-debit (`pbv_spend_keep_remount_slotN`) and
 * honours replica wallet on remount **heal / shop**
 * `persistAbsoluteProgress`. #938 honours that stamp as the remount
 * **death-cut** base. #1002 honours replica as the remount **rename /
 * upgrade debit** base (still calls `upgradeSpell`). #1024 honours it
 * **before feat / GameKey**. #1153 honours it **before portal persist**.
 * Those helpers never skip a remount `upgradeSpell` retry.
 *
 * Motoko `upgradeSpell` (`main.mo` 1034) is `newLevel = currentLevel + 1`
 * and charges `spellLevelingBaseCost * 2^currentLevel`. It is not
 * idempotent — unlike rename (`#err` already renamed) or feat claim
 * (`Reward already claimed`). `saveBattleStats` ignores spell-level
 * arrays (`upgradeSpell` is the sole writer).
 *
 * GameFlow `character.spellLevelKeys` / `spellLevelValues` stay
 * Play-entry forever (`handlePlayCharacter` is the only writer).
 * WorldExploration hydrates spell levels from those keys when
 * `spellLevelKeys.length > 0` (`WorldExploration.tsx` 3105–3118) and
 * **ignores** the localStorage map written after a parsed success.
 *
 * Chronology (success):
 * 1. World hydrated. Fireball 1. Doka 200. Canister same. Play-entry
 *    `spellLevelKeys=['fireball']` values `[1]`.
 * 2. `upgradeSpell` `#ok(2)` deducts 10 (canister fireball 2 / Doka 190).
 *    HUD + localStorage become 2. GameFlow keys stay `[1]`. Catch is
 *    not taken, so #926 does not stamp. `getCallerDokaBalance` throw
 *    after `#ok` already returns `{ newLevel }` (same-session query
 *    miss) — this leftover is remount Play-entry keys, not that path.
 * 3. Actor reconnect remounts WorldExploration. Spell levels re-init
 *    from Play-entry **1**. Lock Doka seeds GameFlow (may already be
 *    190 after `onDokaCredited`). Session inFlight is gone.
 * 4. Leftover #926 / #1002: Doka honour only. Unique leftover: Upgrade
 *    click calls `upgradeSpell` again. Canister currentLevel 2 → 3 and
 *    charges **20**. UI advertised the level-1 cost (10). Double
 *    upgrade. Same class: transport throw after the replica already
 *    wrote level 2 (`replica went away`); HUD stays 1; remount retry
 *    is the same second charge.
 *
 * Unique vs **#926** (heal/shop Doka honour of spend-keep), **#938**
 * (death honour), **#1002** (rename/upgrade **Doka** debit — still
 * invokes `upgradeSpell`), **#1024** (feat / GameKey additive),
 * **#1153** (spend-keep × portal Doka), leftover-XP × rename/upgrade
 * (#1041 / #1045 / #1070 — those commit `{ doka }` leftover **XP**,
 * not spell arrays), **#387** (session WeakMap spend skip — not
 * remount, not spell levels), and **#653** (potion HP).
 *
 * This sidecar stamps `pbv_spell_level_keep_remount_slotN` after a
 * parsed `#ok` **or** a throw that is not explicit `upgradeSpell
 * failed`. Remount `persistSpellUpgrade` re-fetches `getCharacter`
 * keys; replica level > Play-entry local level skips the canister
 * call so leftover retry cannot double-charge. Same-session second
 * upgrade (local already 2, replica 2) still proceeds. A different
 * spellId is not skipped. Fetch miss fail-closes (keeps the stamp).
 *
 * Do not restack WX / progressPersist / deathPenalty /
 * applyRewardsResult / rewardResolver / achievementReward /
 * shopPurchase / renameCharacter / spellUpgrade / dokaPersist /
 * itemShop / BuffShop / #926 / #938 / #1002 / #1024 / #1153 files.
 *
 * Tests reproduce remount retry vs the gated skip. Restack
 * `handleUpgradeSpell` onto
 * `persistSpellUpgradeThroughSpellLevelKeepRemount` after #926
 * lands. No Motoko.
 */

import type { DeathPenaltyStorage } from "./deathPenalty.ts";
import {
  type SpellUpgradeActor,
  type SpellUpgradeOk,
  persistSpellUpgrade,
} from "./spellUpgrade.ts";

export const SPELL_LEVEL_KEEP_UNCONFIRMED =
  "spell upgrade skipped: unconfirmed spell-level keep";

function toNat(n: number | null | undefined): number {
  return Math.max(0, Math.floor(Number(n) || 0));
}

function toMessage(error: unknown): string {
  if (error == null) return "";
  if (error instanceof Error) return error.message;
  return String(error);
}

/**
 * New stamp origin. Must not reuse spend-keep Doka keys (#926), leftover
 * XP keys (#767 / #807 / #813), or leftover-Doka credit keys.
 */
export function spellLevelKeepRemountKey(slot: number): string {
  return `pbv_spell_level_keep_remount_slot${Math.max(1, toNat(slot))}`;
}

export type SpellLevelKeepRemountStamp = {
  spellId: string;
  /** Play-entry / HUD level before the upgrade that already landed. */
  preLevel: number;
};

export function readSpellLevelKeepRemount(
  storage: DeathPenaltyStorage,
  slot: number,
): SpellLevelKeepRemountStamp | null {
  try {
    const raw = storage.getItem(spellLevelKeepRemountKey(slot));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<SpellLevelKeepRemountStamp>;
    if (!parsed.spellId || typeof parsed.spellId !== "string") return null;
    if (parsed.preLevel == null) return null;
    return { spellId: parsed.spellId, preLevel: toNat(parsed.preLevel) };
  } catch {
    return null;
  }
}

export function writeSpellLevelKeepRemount(
  storage: DeathPenaltyStorage,
  slot: number,
  stamp: SpellLevelKeepRemountStamp,
): void {
  try {
    storage.setItem(
      spellLevelKeepRemountKey(slot),
      JSON.stringify({
        spellId: stamp.spellId,
        preLevel: toNat(stamp.preLevel),
      }),
    );
  } catch {
    // private mode
  }
}

export function clearSpellLevelKeepRemount(
  storage: DeathPenaltyStorage,
  slot: number,
): void {
  try {
    storage.removeItem(spellLevelKeepRemountKey(slot));
  } catch {
    // ignore
  }
}

export function hasSpellLevelKeepRemount(
  storage: DeathPenaltyStorage,
  slot: number,
): boolean {
  return readSpellLevelKeepRemount(storage, slot) != null;
}

/**
 * Parsed `#ok` with a risen level, or a transport throw after the
 * replica may already have incremented. Explicit `upgradeSpell failed`
 * means the canister rejected (not enough Doka / retired / banned) and
 * must not stamp.
 */
export function shouldNoteSpellLevelKeepRemount(args: {
  spellId: string;
  preLevel: number;
  newLevel?: number;
  error?: unknown;
}): boolean {
  if (!args.spellId) return false;
  if (args.error != null) {
    const msg = toMessage(args.error);
    if (!msg) return false;
    if (msg.includes("upgradeSpell failed")) return false;
    return true;
  }
  if (args.newLevel == null) return false;
  return toNat(args.newLevel) > toNat(args.preLevel);
}

export function noteSpellLevelKeepRemount(
  storage: DeathPenaltyStorage,
  slot: number,
  args: {
    spellId: string;
    preLevel: number;
    newLevel?: number;
    error?: unknown;
  },
): void {
  if (!shouldNoteSpellLevelKeepRemount(args)) return;
  writeSpellLevelKeepRemount(storage, slot, {
    spellId: args.spellId,
    preLevel: toNat(args.preLevel),
  });
}

/**
 * `getCharacter` record. Unwrap `{ ok }` bindgen Results, then read
 * `spellLevelKeys` / `spellLevelValues` the same way WX hydrates.
 */
export function spellLevelsFromCharacterRecord(
  raw: unknown,
): Record<string, number> | null {
  if (raw == null || typeof raw !== "object") return null;
  if ("ok" in raw) {
    return spellLevelsFromCharacterRecord((raw as { ok: unknown }).ok);
  }
  if ("_ok" in raw) {
    return spellLevelsFromCharacterRecord((raw as { _ok: unknown })._ok);
  }
  const rec = raw as {
    spellLevelKeys?: unknown;
    spellLevelValues?: unknown;
  };
  if (
    !Array.isArray(rec.spellLevelKeys) ||
    !Array.isArray(rec.spellLevelValues)
  ) {
    return null;
  }
  const levels: Record<string, number> = {};
  rec.spellLevelKeys.forEach((key, i) => {
    if (typeof key !== "string" || !key) return;
    levels[key] = toNat(Number(rec.spellLevelValues?.[i] ?? 0));
  });
  return levels;
}

export function replicaSpellLevelFromRecord(
  raw: unknown,
  spellId: string,
): number | null {
  const levels = spellLevelsFromCharacterRecord(raw);
  if (levels == null) return null;
  if (!spellId) return null;
  return toNat(levels[spellId] ?? 0);
}

/**
 * Missing replica after a keep stamp must not fall through to
 * `upgradeSpell` (that is the double-charge leftover).
 */
export function shouldRefuseSpellLevelKeepRemountStaleReplica(args: {
  keep: boolean;
  spellId: string;
  stampedSpellId: string;
  replicaLevel: number | null;
}): boolean {
  if (args.keep !== true) return false;
  if (args.stampedSpellId !== args.spellId) return false;
  return args.replicaLevel == null;
}

/**
 * Skip the remount retry when replica already rose past the Play-entry
 * HUD. Same-session second upgrade (local already matches replica) must
 * still call `upgradeSpell`. A different spellId is not this stamp.
 */
export function shouldSkipSpellLevelKeepRemountUpgrade(args: {
  keep: boolean;
  spellId: string;
  stampedSpellId: string;
  localLevel: number;
  replicaLevel: number | null;
}): boolean {
  if (args.keep !== true) return false;
  if (args.stampedSpellId !== args.spellId) return false;
  if (args.replicaLevel == null) return false;
  return toNat(args.replicaLevel) > toNat(args.localLevel);
}

/**
 * Production `committedDokaAfterSpellUpgrade` subtracts advertised cost
 * when `newDoka` is missing or stale-high. A skipped retry must not
 * debit the lock — that incoming-below leftover shop would cut the
 * canister for a charge that never happened.
 */
export function shouldDebitSpellUpgradeAfterSpellLevelKeep(args: {
  skipped: boolean;
}): boolean {
  return args.skipped !== true;
}

export function leftoverUpgradeCallsAfterSpellLevelKeepRemount(args: {
  keep: boolean;
  spellId: string;
  stampedSpellId: string;
  localLevel: number;
  replicaLevel: number | null;
  ungatedCalls: number;
}): number {
  if (
    shouldSkipSpellLevelKeepRemountUpgrade({
      keep: args.keep,
      spellId: args.spellId,
      stampedSpellId: args.stampedSpellId,
      localLevel: args.localLevel,
      replicaLevel: args.replicaLevel,
    })
  ) {
    return 0;
  }
  return Math.max(0, toNat(args.ungatedCalls));
}

function refuseStaleSpellLevelKeepRemount(): never {
  throw new Error(SPELL_LEVEL_KEEP_UNCONFIRMED);
}

export type SpellLevelKeepRemountPersist = {
  snapshot: () => { doka: number; xp: number; level: number };
  commit?: (next: { doka?: number; xp?: number; level?: number }) => void;
  enqueue: <T>(
    fn: () => Promise<T>,
    opts?: { skipBeforeEach?: boolean },
  ) => Promise<T>;
};

export type SpellLevelKeepRemountActor = SpellUpgradeActor & {
  getCharacter?: (slot: bigint) => Promise<unknown>;
};

export type SpellLevelKeepRemountUpgradeOk = SpellUpgradeOk & {
  skipped?: boolean;
};

/**
 * Inside the existing persist-lock enqueue. Fetch replica keys when this
 * slot has a keep stamp for `spellId`. Skip `upgradeSpell` when replica
 * already rose. Fetch miss fail-closes and keeps the stamp.
 */
export async function honourSpellLevelKeepRemountBeforeUpgrade(args: {
  storage: DeathPenaltyStorage;
  slot: number;
  spellId: string;
  localLevel: number;
  fetchCharacter: () => Promise<unknown>;
}): Promise<{ skip: true; replicaLevel: number } | { skip: false }> {
  const stamp = readSpellLevelKeepRemount(args.storage, args.slot);
  if (!stamp || stamp.spellId !== args.spellId) return { skip: false };

  let replicaLevel: number | null = null;
  try {
    replicaLevel = replicaSpellLevelFromRecord(
      await args.fetchCharacter(),
      args.spellId,
    );
  } catch (err) {
    if (err instanceof Error && err.message === SPELL_LEVEL_KEEP_UNCONFIRMED) {
      throw err;
    }
    refuseStaleSpellLevelKeepRemount();
  }

  if (
    shouldRefuseSpellLevelKeepRemountStaleReplica({
      keep: true,
      spellId: args.spellId,
      stampedSpellId: stamp.spellId,
      replicaLevel,
    })
  ) {
    refuseStaleSpellLevelKeepRemount();
  }

  if (
    !shouldSkipSpellLevelKeepRemountUpgrade({
      keep: true,
      spellId: args.spellId,
      stampedSpellId: stamp.spellId,
      localLevel: args.localLevel,
      replicaLevel,
    })
  ) {
    return { skip: false };
  }

  clearSpellLevelKeepRemount(args.storage, args.slot);
  return { skip: true, replicaLevel: toNat(replicaLevel) };
}

/**
 * Tests / restack replacement for `handleUpgradeSpell`'s enqueue body.
 * Do not nest inside a second `enqueue` — the persist lock is serial.
 */
export async function persistSpellUpgradeThroughSpellLevelKeepRemount(args: {
  persist: SpellLevelKeepRemountPersist;
  storage: DeathPenaltyStorage;
  slot: number;
  spellId: string;
  localLevel: number;
  actor: SpellLevelKeepRemountActor;
}): Promise<SpellLevelKeepRemountUpgradeOk> {
  return args.persist.enqueue(async () => {
    const fetchCharacter = () =>
      args.actor.getCharacter
        ? args.actor.getCharacter(BigInt(args.slot))
        : Promise.resolve(null);

    const honoured = await honourSpellLevelKeepRemountBeforeUpgrade({
      storage: args.storage,
      slot: args.slot,
      spellId: args.spellId,
      localLevel: args.localLevel,
      fetchCharacter,
    });
    if (honoured.skip) {
      return { newLevel: honoured.replicaLevel, skipped: true };
    }

    try {
      const result = await persistSpellUpgrade(
        args.actor,
        args.slot,
        args.spellId,
      );
      noteSpellLevelKeepRemount(args.storage, args.slot, {
        spellId: args.spellId,
        preLevel: args.localLevel,
        newLevel: result.newLevel,
      });
      return result;
    } catch (err) {
      noteSpellLevelKeepRemount(args.storage, args.slot, {
        spellId: args.spellId,
        preLevel: args.localLevel,
        error: err,
      });
      throw err;
    }
  });
}
