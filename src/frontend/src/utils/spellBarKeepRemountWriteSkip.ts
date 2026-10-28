/**
 * Spell-bar 1000ms debounce is flushed on battle start
 * (`WorldExploration.tsx` 12055–12065) but **cleared without flush on
 * unmount** (3081–3090). `beforeunload` writes the `pbv_active_spells`
 * cache only. Actor-reconnect remount keeps the optimistic bar (module
 * `_spellbarLoadedForCharKey` skips load; initializer reads
 * localStorage). Full page reload re-runs load from stale
 * `getCharacter.spellBarOrder` and overwrites the cache.
 *
 * `setSpellBarOrder` is not a wallet/XP writer (off the persist lock).
 * `saveBattleStats` ignores spell-level arrays and does not write the
 * bar. GameFlow `character.spellBarOrder` stays Play-entry forever
 * (`handlePlayCharacter` is the only writer).
 *
 * Chronology:
 * 1. World hydrated. Play-entry / replica bar `[strike, heal]`.
 * 2. Player rearranges to `[inferno, strike]`. Optimistic HUD +
 *    localStorage cache. dirty=true. 1000ms debounce starts.
 * 3. Unmount / full reload inside that window. Debounce timeout is
 *    cleared; `setSpellBarOrder` never runs. beforeunload wrote the
 *    Inferno cache.
 * 4. Remount. Initializer briefly reads Inferno from localStorage.
 *    Load effect `getCharacter` still returns `[strike, heal]`, then
 *    overwrites `activeSpellIds` **and** the cache. Arrangement lost.
 * 5. Same class: `#err` / transport throw keeps dirty and schedules a
 *    2000ms retry `setTimeout` that is **not** stored on
 *    `setSpellBarOrderDebounceRef`, so unmount cannot clear it. The
 *    leaked retry fires `setSpellBarOrder` on the unmounted instance
 *    after the new load already hydrated the stale bar.
 *
 * Unique vs **#1215** / **#1239** (spell *level* keep; `upgradeSpell`
 * `currentLevel + 1` is not idempotent — this stamp is bar *order*),
 * leftover-XP/Doka remount matrix through **#1157** / **#1099**,
 * **#926** (heal/shop Doka), **#653** (potion HP), and **#803** WX
 * restack. Do not stamp wallet/XP. Do not reuse #1215's single-spell
 * key or #1239's map key.
 *
 * This sidecar stamps `pbv_spell_bar_keep_remount_slotN` as
 * `{ order: string[] }` at the optimistic / debounce-schedule tick
 * (before invoke). Remount hydrate honours the stamp over stale
 * Play-entry / `getCharacter`. Remount flush retries `setSpellBarOrder`
 * when replica still differs; skip when replica already matches.
 * Fetch miss fail-closes (keeps the stamp, honours it locally).
 * Hydrate must not clear the stamp — flush still needs it if the
 * load effect races the write.
 *
 * Do not restack WX / progressPersist / deathPenalty /
 * applyRewardsResult / rewardResolver / achievementReward /
 * shopPurchase / renameCharacter / spellUpgrade / dokaPersist /
 * itemShop / BuffShop / #926 / #1215 / #1239 files. Restack
 * `handleSetActiveSpells` / unmount / spell-bar load `getCharacter`
 * onto `noteSpellBarKeepRemount`,
 * `shouldFlushSpellBarKeepRemountOnUnmount`,
 * `clearSpellBarKeepRemountTimers`,
 * `honourSpellBarKeepRemountHydrate`, and
 * `persistSpellBarThroughSpellBarKeepRemount` after #926 / #1215 /
 * #1239 land. No Motoko.
 */

import type { DeathPenaltyStorage } from "./deathPenalty.ts";

export const SPELL_BAR_KEEP_UNCONFIRMED =
  "spell bar skipped: unconfirmed spell-bar keep";

function toNat(n: number | null | undefined): number {
  return Math.max(0, Math.floor(Number(n) || 0));
}

function toMessage(error: unknown): string {
  if (error == null) return "";
  if (error instanceof Error) return error.message;
  return String(error);
}

/**
 * New stamp origin. Must not reuse #1215 / #1239 spell-level keys,
 * spend-keep Doka keys, leftover XP keys, or leftover-Doka credit keys.
 */
export function spellBarKeepRemountKey(slot: number): string {
  return `pbv_spell_bar_keep_remount_slot${Math.max(1, toNat(slot))}`;
}

export type SpellBarKeepRemountStamp = {
  order: string[];
};

/** Cap and drop empty / duplicate ids the same way WX flush does (max 8). */
export function normalizeSpellBarOrder(ids: readonly unknown[]): string[] {
  const seen = new Set<string>();
  const order: string[] = [];
  for (const raw of ids) {
    if (typeof raw !== "string") continue;
    const id = raw.trim();
    if (!id || seen.has(id)) continue;
    seen.add(id);
    order.push(id);
    if (order.length >= 8) break;
  }
  return order;
}

export function spellBarOrdersEqual(
  left: readonly string[] | null | undefined,
  right: readonly string[] | null | undefined,
): boolean {
  const a = normalizeSpellBarOrder(left ?? []);
  const b = normalizeSpellBarOrder(right ?? []);
  if (a.length !== b.length) return false;
  return a.every((id, i) => id === b[i]);
}

function isOrderRecord(raw: unknown): raw is { order?: unknown } {
  return raw != null && typeof raw === "object" && !Array.isArray(raw);
}

export function readSpellBarKeepRemount(
  storage: DeathPenaltyStorage,
  slot: number,
): SpellBarKeepRemountStamp | null {
  try {
    const raw = storage.getItem(spellBarKeepRemountKey(slot));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    if (!isOrderRecord(parsed)) return null;
    const order = normalizeSpellBarOrder(
      Array.isArray(parsed.order) ? parsed.order : [],
    );
    if (order.length === 0) return null;
    return { order };
  } catch {
    return null;
  }
}

export function writeSpellBarKeepRemount(
  storage: DeathPenaltyStorage,
  slot: number,
  stamp: SpellBarKeepRemountStamp,
): void {
  const order = normalizeSpellBarOrder(stamp.order);
  if (order.length === 0) {
    clearSpellBarKeepRemount(storage, slot);
    return;
  }
  try {
    storage.setItem(spellBarKeepRemountKey(slot), JSON.stringify({ order }));
  } catch {
    // private mode
  }
}

export function clearSpellBarKeepRemount(
  storage: DeathPenaltyStorage,
  slot: number,
): void {
  try {
    storage.removeItem(spellBarKeepRemountKey(slot));
  } catch {
    // ignore
  }
}

export function hasSpellBarKeepRemount(
  storage: DeathPenaltyStorage,
  slot: number,
): boolean {
  return readSpellBarKeepRemount(storage, slot) != null;
}

/**
 * Stamp at the optimistic / debounce-schedule tick, before
 * `setSpellBarOrder` is invoked. Unmount inside the 1000ms window is
 * the leftover — waiting for `#ok` is too late.
 *
 * Explicit `setSpellBarOrder failed` / Motoko `#err` still stamps:
 * dirty stays set in WX and the intended bar is what remount must
 * honour. Transport throw after invoke also stamps.
 */
export function shouldNoteSpellBarKeepRemount(args: {
  order: readonly string[];
  error?: unknown;
}): boolean {
  if (normalizeSpellBarOrder(args.order).length === 0) return false;
  if (args.error != null) {
    const msg = toMessage(args.error);
    if (!msg) return false;
    return true;
  }
  return true;
}

export function noteSpellBarKeepRemount(
  storage: DeathPenaltyStorage,
  slot: number,
  args: {
    order: readonly string[];
    error?: unknown;
  },
): void {
  if (!shouldNoteSpellBarKeepRemount(args)) return;
  writeSpellBarKeepRemount(storage, slot, {
    order: normalizeSpellBarOrder(args.order),
  });
}

/**
 * `getCharacter` record. Unwrap `{ ok }` bindgen Results, then read
 * `spellBarOrder` the same way WX load hydrates.
 */
export function spellBarOrderFromCharacterRecord(
  raw: unknown,
): string[] | null {
  if (raw == null || typeof raw !== "object") return null;
  if ("ok" in raw) {
    return spellBarOrderFromCharacterRecord((raw as { ok: unknown }).ok);
  }
  if ("_ok" in raw) {
    return spellBarOrderFromCharacterRecord((raw as { _ok: unknown })._ok);
  }
  const rec = raw as { spellBarOrder?: unknown };
  if (!("spellBarOrder" in rec)) return null;
  if (rec.spellBarOrder == null) return [];
  if (!Array.isArray(rec.spellBarOrder)) return null;
  return normalizeSpellBarOrder(rec.spellBarOrder);
}

export function playEntrySpellBarFromCharacter(raw: unknown): string[] {
  return spellBarOrderFromCharacterRecord(raw) ?? [];
}

export function readSetSpellBarOrderResult(
  result: unknown,
): { ok: true } | { err: string } {
  if (result == null || typeof result !== "object") {
    return { err: "setSpellBarOrder returned an empty result" };
  }
  const r = result as Record<string, unknown>;
  if (
    r.__kind__ === "err" ||
    (r.err != null && r.ok == null && r._ok == null) ||
    (typeof r._err === "string" && r._ok == null)
  ) {
    return {
      err: String(r.err ?? r._err ?? "setSpellBarOrder failed"),
    };
  }
  return { ok: true };
}

/**
 * Load effect must not apply stale Play-entry / `getCharacter` over the
 * optimistic bar while a keep stamp exists and replica still differs.
 */
export function shouldSkipSpellBarKeepRemountHydrateOverwrite(args: {
  keep: boolean;
  stampedOrder: readonly string[] | null;
  replicaOrder: readonly string[] | null;
}): boolean {
  if (args.keep !== true) return false;
  const stamp = normalizeSpellBarOrder(args.stampedOrder ?? []);
  if (stamp.length === 0) return false;
  if (args.replicaOrder == null) return true;
  return !spellBarOrdersEqual(stamp, args.replicaOrder);
}

/**
 * Missing replica after a keep stamp must not fall through to applying
 * Play-entry (that is the leftover overwrite).
 */
export function shouldRefuseSpellBarKeepRemountStaleReplica(args: {
  keep: boolean;
  stampedOrder: readonly string[] | null;
  replicaOrder: readonly string[] | null;
}): boolean {
  if (args.keep !== true) return false;
  if (normalizeSpellBarOrder(args.stampedOrder ?? []).length === 0) {
    return false;
  }
  return args.replicaOrder == null;
}

/**
 * Skip the remount `setSpellBarOrder` retry when replica already matches
 * the stamp. Same-session rearrange (stamp updated, replica stale)
 * still writes.
 */
export function shouldSkipSpellBarKeepRemountFlush(args: {
  keep: boolean;
  stampedOrder: readonly string[] | null;
  replicaOrder: readonly string[] | null;
}): boolean {
  if (args.keep !== true) return false;
  const stamp = normalizeSpellBarOrder(args.stampedOrder ?? []);
  if (stamp.length === 0) return false;
  if (args.replicaOrder == null) return false;
  return spellBarOrdersEqual(stamp, args.replicaOrder);
}

export function shouldHonourSpellBarKeepRemountHydrate(args: {
  keep: boolean;
  playEntryOrder: readonly string[];
  stampedOrder: readonly string[] | null;
}): boolean {
  if (args.keep !== true) return false;
  const stamp = normalizeSpellBarOrder(args.stampedOrder ?? []);
  if (stamp.length === 0) return false;
  return !spellBarOrdersEqual(stamp, args.playEntryOrder);
}

export function mergeSpellBarKeepRemountHydrate(
  playEntry: readonly string[],
  stamp: SpellBarKeepRemountStamp | null,
): string[] {
  if (
    shouldHonourSpellBarKeepRemountHydrate({
      keep: stamp != null,
      playEntryOrder: playEntry,
      stampedOrder: stamp?.order ?? null,
    })
  ) {
    return normalizeSpellBarOrder(stamp?.order ?? []);
  }
  return normalizeSpellBarOrder(playEntry);
}

export function leftoverHydratedSpellBarAfterKeepRemount(args: {
  keep: boolean;
  playEntryOrder: readonly string[];
  stampedOrder: readonly string[] | null;
}): string[] {
  return mergeSpellBarKeepRemountHydrate(
    args.playEntryOrder,
    args.keep && args.stampedOrder ? { order: [...args.stampedOrder] } : null,
  );
}

/**
 * Remount flush must write the stamp, not Play-entry. Passing the
 * stale GameFlow bar as `requestedOrder` used to note-overwrite Inferno
 * with Strike and persist the leftover.
 */
export function resolveSpellBarKeepRemountFlushOrder(args: {
  stampedOrder: readonly string[] | null;
  requestedOrder: readonly string[];
}): string[] {
  const stamp = normalizeSpellBarOrder(args.stampedOrder ?? []);
  if (stamp.length > 0) return stamp;
  return normalizeSpellBarOrder(args.requestedOrder);
}

export function leftoverSpellBarFlushCallsAfterKeepRemount(args: {
  keep: boolean;
  stampedOrder: readonly string[] | null;
  replicaOrder: readonly string[] | null;
  ungatedCalls: number;
}): number {
  if (
    shouldSkipSpellBarKeepRemountFlush({
      keep: args.keep,
      stampedOrder: args.stampedOrder,
      replicaOrder: args.replicaOrder,
    })
  ) {
    return 0;
  }
  return Math.max(0, toNat(args.ungatedCalls));
}

/**
 * WX unmount (3081–3090) clears the debounce timeout and does not
 * flush. Battle start does flush. Remount leftover is this gap.
 */
export function shouldFlushSpellBarKeepRemountOnUnmount(args: {
  dirty: boolean;
  debouncePending: boolean;
}): boolean {
  return args.dirty === true || args.debouncePending === true;
}

/**
 * WX `#err` / throw retry is a raw `setTimeout` (2989 / 3031) not
 * stored on `setSpellBarOrderDebounceRef`. Unmount must clear it.
 */
export function shouldClearSpellBarKeepRemountRetryOnUnmount(
  retryPending: boolean,
): boolean {
  return retryPending === true;
}

export type SpellBarKeepRemountTimerRegistry = {
  debounce: ReturnType<typeof setTimeout> | null;
  retries: Set<ReturnType<typeof setTimeout>>;
};

export function createSpellBarKeepRemountTimerRegistry(): SpellBarKeepRemountTimerRegistry {
  return { debounce: null, retries: new Set() };
}

export function clearSpellBarKeepRemountTimers(
  timers: SpellBarKeepRemountTimerRegistry,
  clearTimeoutFn: (id: ReturnType<typeof setTimeout>) => void = clearTimeout,
): void {
  if (timers.debounce != null) {
    clearTimeoutFn(timers.debounce);
    timers.debounce = null;
  }
  for (const id of timers.retries) {
    clearTimeoutFn(id);
  }
  timers.retries.clear();
}

function refuseStaleSpellBarKeepRemount(): never {
  throw new Error(SPELL_BAR_KEEP_UNCONFIRMED);
}

export type SpellBarKeepRemountActor = {
  setSpellBarOrder?: (slot: bigint, spellIds: string[]) => Promise<unknown>;
  getCharacter?: (slot: bigint) => Promise<unknown>;
};

export type SpellBarKeepRemountFlushOk = {
  order: string[];
  skipped?: boolean;
};

/**
 * Remount HUD honour. Does not throw — world mount must not block.
 * Fetch miss fail-closes to the stamp (not Play-entry) and **keeps**
 * the map so flush can still retry.
 */
export async function honourSpellBarKeepRemountHydrate(args: {
  storage: DeathPenaltyStorage;
  slot: number;
  playEntryOrder: readonly string[];
  fetchCharacter: () => Promise<unknown>;
}): Promise<string[]> {
  const stamp = readSpellBarKeepRemount(args.storage, args.slot);
  if (!stamp) return normalizeSpellBarOrder(args.playEntryOrder);
  try {
    const replica = spellBarOrderFromCharacterRecord(
      await args.fetchCharacter(),
    );
    if (
      shouldSkipSpellBarKeepRemountHydrateOverwrite({
        keep: true,
        stampedOrder: stamp.order,
        replicaOrder: replica,
      })
    ) {
      return normalizeSpellBarOrder(stamp.order);
    }
    if (replica == null) return normalizeSpellBarOrder(stamp.order);
    return normalizeSpellBarOrder(replica);
  } catch {
    return normalizeSpellBarOrder(stamp.order);
  }
}

/**
 * Inside remount load / unmount restack. Fetch replica when this slot
 * has a keep stamp. Skip `setSpellBarOrder` when replica already
 * matches. Fetch miss fail-closes and keeps the stamp.
 */
export async function honourSpellBarKeepRemountBeforeFlush(args: {
  storage: DeathPenaltyStorage;
  slot: number;
  fetchCharacter: () => Promise<unknown>;
}): Promise<
  { skip: true; order: string[] } | { skip: false; order: string[] }
> {
  const stamp = readSpellBarKeepRemount(args.storage, args.slot);
  if (!stamp) return { skip: false, order: [] };

  let replicaOrder: string[] | null = null;
  try {
    replicaOrder = spellBarOrderFromCharacterRecord(
      await args.fetchCharacter(),
    );
  } catch (err) {
    if (err instanceof Error && err.message === SPELL_BAR_KEEP_UNCONFIRMED) {
      throw err;
    }
    refuseStaleSpellBarKeepRemount();
  }

  if (
    shouldRefuseSpellBarKeepRemountStaleReplica({
      keep: true,
      stampedOrder: stamp.order,
      replicaOrder,
    })
  ) {
    refuseStaleSpellBarKeepRemount();
  }

  if (
    shouldSkipSpellBarKeepRemountFlush({
      keep: true,
      stampedOrder: stamp.order,
      replicaOrder,
    })
  ) {
    clearSpellBarKeepRemount(args.storage, args.slot);
    return { skip: true, order: stamp.order };
  }

  return { skip: false, order: stamp.order };
}

/**
 * Tests / restack replacement for `flushSpellBarSave` / unmount flush.
 * Off-lock — do not enqueue on `createProgressPersist`.
 */
export async function persistSpellBarThroughSpellBarKeepRemount(args: {
  storage: DeathPenaltyStorage;
  slot: number;
  order: readonly string[];
  actor: SpellBarKeepRemountActor;
}): Promise<SpellBarKeepRemountFlushOk> {
  const intended = resolveSpellBarKeepRemountFlushOrder({
    stampedOrder:
      readSpellBarKeepRemount(args.storage, args.slot)?.order ?? null,
    requestedOrder: args.order,
  });
  if (intended.length === 0) {
    return { order: [], skipped: true };
  }
  noteSpellBarKeepRemount(args.storage, args.slot, { order: intended });

  const fetchCharacter = () =>
    args.actor.getCharacter
      ? args.actor.getCharacter(BigInt(args.slot))
      : Promise.resolve(null);

  const honoured = await honourSpellBarKeepRemountBeforeFlush({
    storage: args.storage,
    slot: args.slot,
    fetchCharacter,
  });
  if (honoured.skip) {
    return { order: honoured.order, skipped: true };
  }
  const flushOrder = honoured.order.length > 0 ? honoured.order : intended;

  if (typeof args.actor.setSpellBarOrder !== "function") {
    const err = new Error("setSpellBarOrder is required to persist the bar");
    noteSpellBarKeepRemount(args.storage, args.slot, {
      order: flushOrder,
      error: err,
    });
    throw err;
  }

  try {
    const parsed = readSetSpellBarOrderResult(
      await args.actor.setSpellBarOrder(BigInt(args.slot), flushOrder),
    );
    if ("err" in parsed) {
      const err = new Error(`setSpellBarOrder failed: ${parsed.err}`);
      noteSpellBarKeepRemount(args.storage, args.slot, {
        order: flushOrder,
        error: err,
      });
      throw err;
    }
    noteSpellBarKeepRemount(args.storage, args.slot, { order: flushOrder });
    return { order: flushOrder };
  } catch (err) {
    noteSpellBarKeepRemount(args.storage, args.slot, {
      order: flushOrder,
      error: err,
    });
    throw err;
  }
}
