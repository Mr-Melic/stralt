/**
 * Items Buy `persistAbsoluteProgress` awaits `saveBattleStats` then
 * `commit`. BuffShop grants inventory only after that promise resolves
 * true (`BuffShop.tsx` 244–247). Catch returns false (`WorldExploration.tsx`
 * 13177–13180); `shouldRollbackFailedShopSpend` snaps HUD Doka back and
 * rolls `inventoryRef` to `nextOwned - 1`. `setInventory` never ran, so
 * `${principal}_inventory` stays 0.
 *
 * #964 stamps remount **Doka** after the same shop / heal throw
 * (`pbv_absolute_doka_throw_keep_remount_slotN`) and honours replica
 * wallet on leftover shop. #860 stamps **HP** and skips full-HP shop
 * (`preHp === postHp`). #408 is same-session consume-restore (Buy is
 * overworld-only; Use is battle-only). #653 is potion HP. Those helpers
 * never write inventory.
 *
 * Chronology:
 * 1. World hydrated. Play-entry Doka 200. Inventory health_potion 0.
 *    Lock seeded 200. Canister 200. localStorage 0.
 * 2. Items Buy. Optimistic owned 1. `saveBattleStats` accepts Doka 150
 *    then throws (`replica went away`). Commit never runs. Catch returns
 *    false. HUD Doka rolls back to 200. inventoryRef rolls back to 0.
 *    setInventory skipped. localStorage 0. No unpaid death. #964 stamps
 *    Doka keep. #860 does **not** stamp (full HP).
 * 3. Actor reconnect remounts WorldExploration / BuffShop.
 *    `loadInventory` reads 0. Lock seeds Play-entry **200**.
 * 4. Leftover #964: leftover shop honours replica 150. Unique leftover:
 *    inventory is still 0 — paid 50 Doka for no potion.
 *
 * This sidecar stamps `{ items: { [itemId]: { preOwned, cost, preDoka } } }`
 * after a transport-keep **shop** throw in
 * `pbv_inventory_keep_remount_slotN`. Heal (no itemId) must not stamp.
 * Explicit `#err` (`saveBattleStats failed`, Unauthorized, banned, empty
 * slot, unseeded wallet) must not stamp. Remount hydrate re-fetches
 * `getCallerDokaBalance`; replica ≥ stamped `preDoka` fail-closes (no
 * mint, keep stamp). Fresh replica 150 grants `max(local, preOwned+1)`
 * capped at stack 5 and clears the honoured item so a later consume is
 * not re-granted. Fetch miss fail-closes. Merge multiple item throws
 * like #1239 so a later fury stamp cannot clobber a potion keep.
 *
 * `WorldExploration.tsx`, `progressPersist.ts`, `deathPenalty.ts`,
 * `itemShop.ts`, `BuffShop.tsx`, and #408 / #653 / #860 / #964 / #1239 /
 * #1268 files are occupied / unmerged, so this PR does not restack them.
 * Tests reproduce remount inventory vs the gated grant. Restack Items
 * Buy throw onto `persistShopInventoryThroughInventoryKeepRemount` and
 * BuffShop `loadInventory` onto `honourInventoryKeepRemountHydrate`
 * after those PRs land. No Motoko.
 */

import type { DeathPenaltyStorage } from "./deathPenalty.ts";

/** BuffShop `maxStack` for every catalog item. */
export const SHOP_INVENTORY_KEEP_REMOUNT_MAX_STACK = 5;

function toNat(n: number | null | undefined): number {
  return Math.max(0, Math.floor(Number(n) || 0));
}

function toMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

/**
 * New stamp origin. Must not reuse #964's Doka-throw key, #860 HP-throw,
 * #1239 spell-level map, or #1268 spell-bar keep.
 */
export function inventoryKeepRemountKey(slot: number): string {
  return `pbv_inventory_keep_remount_slot${Math.max(1, toNat(slot))}`;
}

export type InventoryKeepRemountItemStamp = {
  preOwned: number;
  cost: number;
  preDoka: number;
};

export type InventoryKeepRemountStamp = {
  items: Record<string, InventoryKeepRemountItemStamp>;
};

export type InventoryKeepRemountOwned = Record<string, number>;

function isItemsRecord(
  raw: unknown,
): raw is Record<string, Partial<InventoryKeepRemountItemStamp>> {
  return raw != null && typeof raw === "object" && !Array.isArray(raw);
}

function sanitizeItemStamp(
  raw: Partial<InventoryKeepRemountItemStamp> | undefined,
): InventoryKeepRemountItemStamp | null {
  if (raw == null || typeof raw !== "object") return null;
  if (raw.preOwned == null || raw.cost == null || raw.preDoka == null) {
    return null;
  }
  const cost = toNat(raw.cost);
  if (cost <= 0) return null;
  return {
    preOwned: toNat(raw.preOwned),
    cost,
    preDoka: toNat(raw.preDoka),
  };
}

/**
 * Parsed `#err` / skipped enqueue means the canister did not accept the
 * spend. Any other throw is after-or-during invoke — the replica may have
 * the debit. Do not export `isExplicitSaveBattleStatsReject` (#860).
 */
export function isExplicitInventoryKeepRemountReject(error: unknown): boolean {
  const msg = toMessage(error);
  if (!msg) return true;
  if (msg.includes("saveBattleStats failed")) return true;
  if (msg.includes("Unauthorized")) return true;
  if (msg.includes("Account banned")) return true;
  if (msg.includes("Invalid slot")) return true;
  if (msg.includes("No characters found")) return true;
  if (msg.includes("is empty")) return true;
  if (msg.includes("wallet not seeded")) return true;
  return false;
}

/**
 * Transport-keep throw after Items Buy persist spent Doka. Heal has no
 * itemId — #860 / #964 cover that spend. Parsed success grants via
 * setInventory. Explicit `#err` must not note.
 */
export function shouldNoteInventoryKeepRemount(args: {
  itemId: string;
  cost: number;
  error: unknown;
}): boolean {
  if (!args.itemId) return false;
  if (toNat(args.cost) <= 0) return false;
  if (args.error == null) return false;
  if (isExplicitInventoryKeepRemountReject(args.error)) return false;
  return true;
}

export function readInventoryKeepRemount(
  storage: DeathPenaltyStorage,
  slot: number,
): InventoryKeepRemountStamp | null {
  try {
    const raw = storage.getItem(inventoryKeepRemountKey(slot));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<InventoryKeepRemountStamp>;
    if (!isItemsRecord(parsed.items)) return null;
    const items: Record<string, InventoryKeepRemountItemStamp> = {};
    for (const [itemId, stamp] of Object.entries(parsed.items)) {
      if (!itemId) continue;
      const next = sanitizeItemStamp(stamp);
      if (!next) continue;
      items[itemId] = next;
    }
    if (Object.keys(items).length === 0) return null;
    return { items };
  } catch {
    return null;
  }
}

export function writeInventoryKeepRemount(
  storage: DeathPenaltyStorage,
  slot: number,
  stamp: InventoryKeepRemountStamp,
): void {
  const items: Record<string, InventoryKeepRemountItemStamp> = {};
  for (const [itemId, item] of Object.entries(stamp.items)) {
    if (!itemId) continue;
    const next = sanitizeItemStamp(item);
    if (!next) continue;
    items[itemId] = next;
  }
  if (Object.keys(items).length === 0) {
    clearInventoryKeepRemount(storage, slot);
    return;
  }
  try {
    storage.setItem(inventoryKeepRemountKey(slot), JSON.stringify({ items }));
  } catch {
    // private mode
  }
}

export function clearInventoryKeepRemount(
  storage: DeathPenaltyStorage,
  slot: number,
): void {
  try {
    storage.removeItem(inventoryKeepRemountKey(slot));
  } catch {
    // ignore
  }
}

export function clearInventoryKeepRemountItem(
  storage: DeathPenaltyStorage,
  slot: number,
  itemId: string,
): void {
  const stamp = readInventoryKeepRemount(storage, slot);
  if (!stamp || !itemId) return;
  const rest = { ...stamp.items };
  delete rest[itemId];
  writeInventoryKeepRemount(storage, slot, { items: rest });
}

export function hasInventoryKeepRemount(
  storage: DeathPenaltyStorage,
  slot: number,
): boolean {
  return readInventoryKeepRemount(storage, slot) != null;
}

/**
 * Merge `itemId` into the map. Must not replace the whole stamp the way
 * a single-item key would (later fury Buy would drop the potion keep).
 */
export function noteInventoryKeepRemount(
  storage: DeathPenaltyStorage,
  slot: number,
  args: {
    itemId: string;
    cost: number;
    preOwned: number;
    preDoka: number;
    error: unknown;
  },
): void {
  if (
    !shouldNoteInventoryKeepRemount({
      itemId: args.itemId,
      cost: args.cost,
      error: args.error,
    })
  ) {
    return;
  }
  const prev = readInventoryKeepRemount(storage, slot);
  writeInventoryKeepRemount(storage, slot, {
    items: {
      ...(prev?.items ?? {}),
      [args.itemId]: {
        preOwned: toNat(args.preOwned),
        cost: toNat(args.cost),
        preDoka: toNat(args.preDoka),
      },
    },
  });
}

export function dokaFromInventoryKeepRemountWalletRecord(
  raw: unknown,
): number | null {
  if (raw == null) return null;
  if (typeof raw === "object" && raw !== null && "ok" in raw) {
    return dokaFromInventoryKeepRemountWalletRecord(
      (raw as { ok: unknown }).ok,
    );
  }
  const n = Number(raw);
  if (!Number.isFinite(n)) return null;
  return toNat(n);
}

/**
 * Stale Play-entry / rollback HUD still equals or sits above the pre-spend
 * lock. Shop only debit, so a live wallet that did not drop is stale (or
 * the rollback cache). Missing live is fail-closed only when a keep stamp
 * exists.
 */
export function shouldRefuseInventoryKeepRemountStaleDoka(args: {
  keep: boolean;
  liveDoka: number | null;
  stampedPreDoka: number;
}): boolean {
  if (args.keep !== true) return false;
  if (args.liveDoka == null) return true;
  return toNat(args.liveDoka) >= toNat(args.stampedPreDoka);
}

/**
 * Grant the paid stack when replica Doka dropped below stamped `preDoka`
 * and remount localStorage still sits at or below `preOwned`. Already
 * granted (`local >= preOwned+1`) must not add another. Buy is overworld
 * only and Use is battle only, so #408 consume-during-buy cannot land.
 */
export function shouldHonourInventoryKeepRemountGrant(args: {
  keep: boolean;
  itemId: string;
  localOwned: number;
  preOwned: number;
  liveDoka: number | null;
  stampedPreDoka: number;
}): boolean {
  if (args.keep !== true) return false;
  if (!args.itemId) return false;
  if (
    shouldRefuseInventoryKeepRemountStaleDoka({
      keep: true,
      liveDoka: args.liveDoka,
      stampedPreDoka: args.stampedPreDoka,
    })
  ) {
    return false;
  }
  return toNat(args.localOwned) < toNat(args.preOwned) + 1;
}

export function grantedOwnedAfterInventoryKeepRemount(args: {
  localOwned: number;
  preOwned: number;
  maxStack?: number;
}): number {
  const paid = toNat(args.preOwned) + 1;
  const local = toNat(args.localOwned);
  const requested = toNat(args.maxStack);
  const cap = Math.max(
    1,
    requested > 0 ? requested : SHOP_INVENTORY_KEEP_REMOUNT_MAX_STACK,
  );
  return Math.min(cap, Math.max(local, paid));
}

export function mergeInventoryKeepRemountHydrate(
  remount: InventoryKeepRemountOwned,
  stamp: InventoryKeepRemountStamp | null,
  liveDoka: number | null,
  maxStack: number = SHOP_INVENTORY_KEEP_REMOUNT_MAX_STACK,
): InventoryKeepRemountOwned {
  const next: InventoryKeepRemountOwned = { ...remount };
  if (!stamp) return next;
  for (const [itemId, item] of Object.entries(stamp.items)) {
    if (
      !shouldHonourInventoryKeepRemountGrant({
        keep: true,
        itemId,
        localOwned: toNat(remount[itemId] ?? 0),
        preOwned: item.preOwned,
        liveDoka,
        stampedPreDoka: item.preDoka,
      })
    ) {
      continue;
    }
    next[itemId] = grantedOwnedAfterInventoryKeepRemount({
      localOwned: toNat(remount[itemId] ?? 0),
      preOwned: item.preOwned,
      maxStack,
    });
  }
  return next;
}

export type InventoryKeepRemountPersist = {
  snapshot: () => { doka: number };
  commit?: (next: { doka?: number }) => void;
  enqueue: <T>(
    fn: () => Promise<T>,
    opts?: { skipBeforeEach?: boolean },
  ) => Promise<T>;
};

/**
 * Remount BuffShop `loadInventory` used Play-entry 0 after a shop
 * saveBattleStats accept-then-throw. Fetch `getCallerDokaBalance` when
 * the keep stamp exists. Stale live ≥ stamped `preDoka` / fetch miss
 * return remount owned and **keep** the stamp. Successful grant clears
 * each honoured item so consume is not re-granted.
 */
export async function honourInventoryKeepRemountHydrate(args: {
  storage: DeathPenaltyStorage;
  slot: number;
  remountInventory: InventoryKeepRemountOwned;
  readWallet: () => Promise<unknown>;
  maxStack?: number;
}): Promise<InventoryKeepRemountOwned> {
  const stamp = readInventoryKeepRemount(args.storage, args.slot);
  if (!stamp) return { ...args.remountInventory };

  let liveDoka: number | null = null;
  try {
    liveDoka = dokaFromInventoryKeepRemountWalletRecord(
      await args.readWallet(),
    );
  } catch {
    return { ...args.remountInventory };
  }

  const next = mergeInventoryKeepRemountHydrate(
    args.remountInventory,
    stamp,
    liveDoka,
    args.maxStack,
  );

  for (const [itemId, item] of Object.entries(stamp.items)) {
    if (
      !shouldHonourInventoryKeepRemountGrant({
        keep: true,
        itemId,
        localOwned: toNat(args.remountInventory[itemId] ?? 0),
        preOwned: item.preOwned,
        liveDoka,
        stampedPreDoka: item.preDoka,
      })
    ) {
      continue;
    }
    clearInventoryKeepRemountItem(args.storage, args.slot, itemId);
  }
  return next;
}

/**
 * persistAbsoluteProgress enqueue `saveBattleStats` then commit. A
 * transport-keep throw never returns and never hits BuffShop
 * setInventory. Note sidecar keep before remount loadInventory can
 * honour Play-entry 0. Parsed success is BuffShop setInventory — do
 * not stamp it here. Explicit `#err` is a reject (canister unchanged).
 * Heal must not call this (no itemId). Call this instead of bare
 * `enqueue` when restacking WorldExploration Items Buy.
 */
export async function persistShopInventoryThroughInventoryKeepRemount<T>(args: {
  persist: InventoryKeepRemountPersist;
  storage: DeathPenaltyStorage;
  slot: number;
  itemId: string;
  cost: number;
  preOwned: number;
  skipBeforeEach?: boolean;
  applyAndCommit: () => Promise<T>;
}): Promise<T> {
  return args.persist.enqueue(
    async () => {
      const preDoka = toNat(args.persist.snapshot().doka);
      try {
        return await args.applyAndCommit();
      } catch (err) {
        noteInventoryKeepRemount(args.storage, args.slot, {
          itemId: args.itemId,
          cost: args.cost,
          preOwned: args.preOwned,
          preDoka,
          error: err,
        });
        throw err;
      }
    },
    args.skipBeforeEach === true ? { skipBeforeEach: true } : undefined,
  );
}
