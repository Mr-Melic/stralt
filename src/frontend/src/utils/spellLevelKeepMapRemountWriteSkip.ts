/**
 * #1215 stamps remount leftover spell level after `upgradeSpell` `#ok` /
 * transport throw (`pbv_spell_level_keep_remount_slotN`) as a **single**
 * `{ spellId, preLevel }` and skips the remount `upgradeSpell` retry when
 * replica[spellId] > Play-entry HUD. #926 / #1002 honour Doka only and
 * still call `upgradeSpell`. `saveBattleStats` ignores spell-level arrays.
 *
 * GameFlow `character.spellLevelKeys` stay Play-entry forever
 * (`handlePlayCharacter` is the only writer). WorldExploration hydrates
 * from those keys when `length > 0` (`WorldExploration.tsx` 3105–3118)
 * and ignores the localStorage map written after a parsed success.
 *
 * #1215 `writeSpellLevelKeepRemount` overwrites the whole stamp. A later
 * upgrade of a **different** spell clobbers the first keep.
 *
 * Chronology:
 * 1. World hydrated. Fireball 1, Heal 0. Doka 200. Play-entry keys
 *    `['fireball']` values `[1]`.
 * 2. `upgradeSpell` fireball `#ok(2)` deducts 10 (canister fireball 2).
 *    #1215 stamps `{ spellId: 'fireball', preLevel: 1 }`. HUD fireball 2.
 * 3. `upgradeSpell` heal `#ok(1)` deducts 10 (canister heal 1). #1215
 *    stamps `{ spellId: 'heal', preLevel: 0 }` and **drops fireball**.
 *    HUD heal 1. GameFlow keys stay `[fireball]=1`.
 * 4. Actor reconnect remounts. Spell levels re-init from Play-entry
 *    fireball **1**, heal **0**. Session inFlight is gone.
 * 5. Leftover #1215: heal click skipped. Unique leftover: fireball click
 *    calls `upgradeSpell` again. Canister currentLevel 2 → 3 and charges
 *    **20**. UI advertised the level-1 cost (10). Double upgrade of the
 *    first paid spell. Same class: transport throw after both replicas
 *    already wrote.
 *
 * Unique vs **#1215** (single-spell skip / last stamp wins), **#926**
 * (heal/shop Doka honour), **#938** (death honour), **#1002**
 * (rename/upgrade Doka debit — still invokes `upgradeSpell`), **#1024**
 * (feat / GameKey additive), **#1153** (spend-keep × portal Doka),
 * leftover-XP × rename/upgrade (#1041 / #1045 / #1070), **#387**
 * (session WeakMap), and **#653** (potion HP).
 *
 * This sidecar stamps `pbv_spell_level_keep_map_remount_slotN` as
 * `{ levels: { [spellId]: preLevel } }` so a later spell merge cannot
 * clobber an earlier keep. Remount `persistSpellUpgrade` re-fetches
 * `getCharacter` keys; replica level > Play-entry local level skips
 * that spellId. Hydrate honour merges every stamped replica level onto
 * Play-entry HUD so combat / `spell_level_5` / advertised cost match
 * the canister before a click. Same-session second upgrade (local
 * already matches replica) still proceeds. Fetch miss fail-closes
 * (keeps the map). Skipped retry must not debit the persist lock.
 * Hydrate must not clear the map — skip still needs it if the click
 * wins the race before HUD applies.
 *
 * Do not stamp spend-keep Doka here — #926 notes keep after rename /
 * upgrade throw-after-debit. Do not stamp or clear #1215's single-key
 * origin. Do not restack WX / progressPersist / deathPenalty /
 * applyRewardsResult / rewardResolver / achievementReward /
 * shopPurchase / renameCharacter / spellUpgrade / dokaPersist /
 * itemShop / BuffShop / #926 / #938 / #1002 / #1024 / #1153 / #1215
 * files. Restack `handleUpgradeSpell` onto
 * `persistSpellUpgradeThroughSpellLevelKeepMapRemount` and the
 * spellLevels initializer / spell-bar `getCharacter` onto
 * `honourSpellLevelKeepMapRemountHydrate` after #926 / #1215 land.
 * No Motoko.
 */

import type { DeathPenaltyStorage } from "./deathPenalty.ts";
import {
  type SpellUpgradeActor,
  type SpellUpgradeOk,
  persistSpellUpgrade,
} from "./spellUpgrade.ts";

export const SPELL_LEVEL_KEEP_MAP_UNCONFIRMED =
  "spell upgrade skipped: unconfirmed spell-level keep map";

function toNat(n: number | null | undefined): number {
  return Math.max(0, Math.floor(Number(n) || 0));
}

function toMessage(error: unknown): string {
  if (error == null) return "";
  if (error instanceof Error) return error.message;
  return String(error);
}

/**
 * New stamp origin. Must not reuse #1215's single-spell key, spend-keep
 * Doka keys (#926), leftover XP keys, or leftover-Doka credit keys.
 */
export function spellLevelKeepMapRemountKey(slot: number): string {
  return `pbv_spell_level_keep_map_remount_slot${Math.max(1, toNat(slot))}`;
}

export type SpellLevelKeepMapRemountStamp = {
  levels: Record<string, number>;
};

function isLevelsRecord(raw: unknown): raw is Record<string, number> {
  if (raw == null || typeof raw !== "object" || Array.isArray(raw)) {
    return false;
  }
  return true;
}

export function readSpellLevelKeepMapRemount(
  storage: DeathPenaltyStorage,
  slot: number,
): SpellLevelKeepMapRemountStamp | null {
  try {
    const raw = storage.getItem(spellLevelKeepMapRemountKey(slot));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<SpellLevelKeepMapRemountStamp>;
    if (!isLevelsRecord(parsed.levels)) return null;
    const levels: Record<string, number> = {};
    for (const [spellId, preLevel] of Object.entries(parsed.levels)) {
      if (!spellId) continue;
      levels[spellId] = toNat(preLevel);
    }
    if (Object.keys(levels).length === 0) return null;
    return { levels };
  } catch {
    return null;
  }
}

export function writeSpellLevelKeepMapRemount(
  storage: DeathPenaltyStorage,
  slot: number,
  stamp: SpellLevelKeepMapRemountStamp,
): void {
  const levels: Record<string, number> = {};
  for (const [spellId, preLevel] of Object.entries(stamp.levels)) {
    if (!spellId) continue;
    levels[spellId] = toNat(preLevel);
  }
  if (Object.keys(levels).length === 0) {
    clearSpellLevelKeepMapRemount(storage, slot);
    return;
  }
  try {
    storage.setItem(
      spellLevelKeepMapRemountKey(slot),
      JSON.stringify({ levels }),
    );
  } catch {
    // private mode
  }
}

export function clearSpellLevelKeepMapRemount(
  storage: DeathPenaltyStorage,
  slot: number,
): void {
  try {
    storage.removeItem(spellLevelKeepMapRemountKey(slot));
  } catch {
    // ignore
  }
}

export function clearSpellLevelKeepMapRemountSpell(
  storage: DeathPenaltyStorage,
  slot: number,
  spellId: string,
): void {
  const stamp = readSpellLevelKeepMapRemount(storage, slot);
  if (!stamp || !spellId) return;
  const rest = { ...stamp.levels };
  delete rest[spellId];
  writeSpellLevelKeepMapRemount(storage, slot, { levels: rest });
}

export function hasSpellLevelKeepMapRemount(
  storage: DeathPenaltyStorage,
  slot: number,
): boolean {
  return readSpellLevelKeepMapRemount(storage, slot) != null;
}

/**
 * Parsed `#ok` with a risen level, or a transport throw after the
 * replica may already have incremented. Explicit `upgradeSpell failed`
 * means the canister rejected (not enough Doka / retired / banned) and
 * must not stamp.
 */
export function shouldNoteSpellLevelKeepMapRemount(args: {
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

/**
 * Merge `spellId` into the map. Must not replace the whole stamp the
 * way #1215's single `{ spellId, preLevel }` does.
 */
export function noteSpellLevelKeepMapRemount(
  storage: DeathPenaltyStorage,
  slot: number,
  args: {
    spellId: string;
    preLevel: number;
    newLevel?: number;
    error?: unknown;
  },
): void {
  if (!shouldNoteSpellLevelKeepMapRemount(args)) return;
  const prev = readSpellLevelKeepMapRemount(storage, slot);
  writeSpellLevelKeepMapRemount(storage, slot, {
    levels: {
      ...(prev?.levels ?? {}),
      [args.spellId]: toNat(args.preLevel),
    },
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
 * Play-entry keys win when `length > 0` (`WorldExploration.tsx`
 * 3105–3118). localStorage is ignored — that is the remount leftover.
 */
export function playEntrySpellLevelsFromCharacter(
  raw: unknown,
): Record<string, number> {
  return spellLevelsFromCharacterRecord(raw) ?? {};
}

/**
 * Missing replica after a keep-map stamp must not fall through to
 * `upgradeSpell` (that is the double-charge leftover).
 */
export function shouldRefuseSpellLevelKeepMapRemountStaleReplica(args: {
  keep: boolean;
  spellId: string;
  stampedPreLevel: number | null;
  replicaLevel: number | null;
}): boolean {
  if (args.keep !== true) return false;
  if (args.stampedPreLevel == null) return false;
  if (!args.spellId) return false;
  return args.replicaLevel == null;
}

/**
 * Skip the remount retry when this spellId is in the map and replica
 * already rose past the Play-entry HUD. Same-session second upgrade
 * (local already matches replica) must still call `upgradeSpell`. A
 * spellId absent from the map is not this stamp — first upgrade of an
 * unstamped spell still proceeds.
 */
export function shouldSkipSpellLevelKeepMapRemountUpgrade(args: {
  keep: boolean;
  spellId: string;
  stampedPreLevel: number | null;
  localLevel: number;
  replicaLevel: number | null;
}): boolean {
  if (args.keep !== true) return false;
  if (args.stampedPreLevel == null) return false;
  if (!args.spellId) return false;
  if (args.replicaLevel == null) return false;
  return toNat(args.replicaLevel) > toNat(args.localLevel);
}

/**
 * Production `committedDokaAfterSpellUpgrade` subtracts advertised cost
 * when `newDoka` is missing or stale-high. A skipped retry must not
 * debit the lock — that incoming-below leftover shop would cut the
 * canister for a charge that never happened.
 */
export function shouldDebitSpellUpgradeAfterSpellLevelKeepMap(args: {
  skipped: boolean;
}): boolean {
  return args.skipped !== true;
}

export function leftoverUpgradeCallsAfterSpellLevelKeepMapRemount(args: {
  keep: boolean;
  spellId: string;
  stampedPreLevel: number | null;
  localLevel: number;
  replicaLevel: number | null;
  ungatedCalls: number;
}): number {
  if (
    shouldSkipSpellLevelKeepMapRemountUpgrade({
      keep: args.keep,
      spellId: args.spellId,
      stampedPreLevel: args.stampedPreLevel,
      localLevel: args.localLevel,
      replicaLevel: args.replicaLevel,
    })
  ) {
    return 0;
  }
  return Math.max(0, toNat(args.ungatedCalls));
}

/**
 * Merge every stamped spell whose replica rose past Play-entry. Do not
 * apply unstamped replica levels (that would be a hydrate redesign).
 * Do not clear the map — remount click still needs skip if it races
 * the HUD apply.
 */
export function shouldHonourSpellLevelKeepMapRemountHydrate(args: {
  keep: boolean;
  spellId: string;
  playEntryLevel: number;
  replicaLevel: number | null;
}): boolean {
  if (args.keep !== true) return false;
  if (!args.spellId) return false;
  if (args.replicaLevel == null) return false;
  return toNat(args.replicaLevel) > toNat(args.playEntryLevel);
}

export function mergeSpellLevelKeepMapRemountHydrate(
  playEntry: Record<string, number>,
  stamp: SpellLevelKeepMapRemountStamp | null,
  replica: Record<string, number> | null,
): Record<string, number> {
  const next: Record<string, number> = { ...playEntry };
  if (!stamp || replica == null) return next;
  for (const spellId of Object.keys(stamp.levels)) {
    if (
      !shouldHonourSpellLevelKeepMapRemountHydrate({
        keep: true,
        spellId,
        playEntryLevel: toNat(playEntry[spellId] ?? 0),
        replicaLevel: toNat(replica[spellId] ?? 0),
      })
    ) {
      continue;
    }
    next[spellId] = toNat(replica[spellId] ?? 0);
  }
  return next;
}

export function leftoverHydratedSpellLevelAfterSpellLevelKeepMapRemount(args: {
  keep: boolean;
  spellId: string;
  playEntryLevel: number;
  replicaLevel: number | null;
}): number {
  if (
    shouldHonourSpellLevelKeepMapRemountHydrate({
      keep: args.keep,
      spellId: args.spellId,
      playEntryLevel: args.playEntryLevel,
      replicaLevel: args.replicaLevel,
    })
  ) {
    return toNat(args.replicaLevel);
  }
  return toNat(args.playEntryLevel);
}

function refuseStaleSpellLevelKeepMapRemount(): never {
  throw new Error(SPELL_LEVEL_KEEP_MAP_UNCONFIRMED);
}

export type SpellLevelKeepMapRemountPersist = {
  snapshot: () => { doka: number; xp: number; level: number };
  commit?: (next: { doka?: number; xp?: number; level?: number }) => void;
  enqueue: <T>(
    fn: () => Promise<T>,
    opts?: { skipBeforeEach?: boolean },
  ) => Promise<T>;
};

export type SpellLevelKeepMapRemountActor = SpellUpgradeActor & {
  getCharacter?: (slot: bigint) => Promise<unknown>;
};

export type SpellLevelKeepMapRemountUpgradeOk = SpellUpgradeOk & {
  skipped?: boolean;
};

/**
 * Inside the existing persist-lock enqueue. Fetch replica keys when this
 * slot has a keep-map stamp for `spellId`. Skip `upgradeSpell` when
 * replica already rose. Fetch miss fail-closes and keeps the map.
 * Clears only the honoured spellId so a sibling keep stays.
 */
export async function honourSpellLevelKeepMapRemountBeforeUpgrade(args: {
  storage: DeathPenaltyStorage;
  slot: number;
  spellId: string;
  localLevel: number;
  fetchCharacter: () => Promise<unknown>;
}): Promise<{ skip: true; replicaLevel: number } | { skip: false }> {
  const stamp = readSpellLevelKeepMapRemount(args.storage, args.slot);
  const stampedPreLevel =
    stamp && args.spellId in stamp.levels
      ? toNat(stamp.levels[args.spellId])
      : null;
  if (stampedPreLevel == null) return { skip: false };

  let replicaLevel: number | null = null;
  try {
    replicaLevel = replicaSpellLevelFromRecord(
      await args.fetchCharacter(),
      args.spellId,
    );
  } catch (err) {
    if (
      err instanceof Error &&
      err.message === SPELL_LEVEL_KEEP_MAP_UNCONFIRMED
    ) {
      throw err;
    }
    refuseStaleSpellLevelKeepMapRemount();
  }

  if (
    shouldRefuseSpellLevelKeepMapRemountStaleReplica({
      keep: true,
      spellId: args.spellId,
      stampedPreLevel,
      replicaLevel,
    })
  ) {
    refuseStaleSpellLevelKeepMapRemount();
  }

  if (
    !shouldSkipSpellLevelKeepMapRemountUpgrade({
      keep: true,
      spellId: args.spellId,
      stampedPreLevel,
      localLevel: args.localLevel,
      replicaLevel,
    })
  ) {
    return { skip: false };
  }

  clearSpellLevelKeepMapRemountSpell(args.storage, args.slot, args.spellId);
  return { skip: true, replicaLevel: toNat(replicaLevel) };
}

/**
 * Remount HUD / combat / `spell_level_5` honour. Fetch replica keys and
 * merge every stamped spell that rose past Play-entry. Fetch miss
 * fail-closes to Play-entry and **keeps** the map (upgrade skip still
 * needs it). Does not throw — world mount must not block.
 */
export async function honourSpellLevelKeepMapRemountHydrate(args: {
  storage: DeathPenaltyStorage;
  slot: number;
  playEntryLevels: Record<string, number>;
  fetchCharacter: () => Promise<unknown>;
}): Promise<Record<string, number>> {
  const stamp = readSpellLevelKeepMapRemount(args.storage, args.slot);
  if (!stamp) return { ...args.playEntryLevels };
  try {
    const replica = spellLevelsFromCharacterRecord(await args.fetchCharacter());
    return mergeSpellLevelKeepMapRemountHydrate(
      args.playEntryLevels,
      stamp,
      replica,
    );
  } catch {
    return { ...args.playEntryLevels };
  }
}

/**
 * Tests / restack replacement for `handleUpgradeSpell`'s enqueue body.
 * Do not nest inside a second `enqueue` — the persist lock is serial.
 */
export async function persistSpellUpgradeThroughSpellLevelKeepMapRemount(args: {
  persist: SpellLevelKeepMapRemountPersist;
  storage: DeathPenaltyStorage;
  slot: number;
  spellId: string;
  localLevel: number;
  actor: SpellLevelKeepMapRemountActor;
}): Promise<SpellLevelKeepMapRemountUpgradeOk> {
  return args.persist.enqueue(async () => {
    const fetchCharacter = () =>
      args.actor.getCharacter
        ? args.actor.getCharacter(BigInt(args.slot))
        : Promise.resolve(null);

    const honoured = await honourSpellLevelKeepMapRemountBeforeUpgrade({
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
      noteSpellLevelKeepMapRemount(args.storage, args.slot, {
        spellId: args.spellId,
        preLevel: args.localLevel,
        newLevel: result.newLevel,
      });
      return result;
    } catch (err) {
      noteSpellLevelKeepMapRemount(args.storage, args.slot, {
        spellId: args.spellId,
        preLevel: args.localLevel,
        error: err,
      });
      throw err;
    }
  });
}
