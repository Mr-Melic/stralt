/**
 * Buff item IDs and costs must survive a future hydrate from
 * `${principal}_inventory` onto canister `buffInventories`.
 *
 * Official BuffShop today writes localStorage only. The Motoko catalog
 * (`BUFF_CATALOG` in main.mo) is unused by that UI, but SDEG-005 will
 * call `purchaseBuff` / `useBuffItem`. A renamed id or a cost mismatch
 * would drop stacks or debit a different amount than the player paid.
 *
 * This module is the alias + cost-drift contract. It does not change
 * live BuffShop prices (economy) and does not call canister APIs.
 */

export const FRONTEND_BUFF_ITEM_IDS = [
  "health_potion",
  "greater_health_potion",
  "battle_elixir",
  "swift_boots",
  "shield_charm",
  "fury_potion",
] as const;

export const CANISTER_BUFF_ITEM_IDS = [
  "health_potion",
  "greater_potion",
  "battle_elixir",
  "swift_boots",
  "shield_charm",
  "fury_potion",
] as const;

/** Frontend localStorage id → Motoko `BUFF_CATALOG` id. */
export const BUFF_ITEM_ID_ALIASES: Readonly<Record<string, string>> = {
  greater_health_potion: "greater_potion",
};

/** Motoko catalog id → official BuffShop id (reverse of BUFF_ITEM_ID_ALIASES). */
export const BUFF_ITEM_ID_FROM_CANISTER: Readonly<Record<string, string>> = {
  greater_potion: "greater_health_potion",
};

export const FRONTEND_BUFF_SHOP_COSTS: Readonly<Record<string, number>> = {
  health_potion: 50,
  greater_health_potion: 120,
  battle_elixir: 80,
  swift_boots: 90,
  shield_charm: 100,
  fury_potion: 150,
};

/** Mirrors `BUFF_CATALOG` in `src/backend/main.mo`. */
export const CANISTER_BUFF_CATALOG_COSTS: Readonly<Record<string, number>> = {
  health_potion: 50,
  greater_potion: 120,
  battle_elixir: 200,
  swift_boots: 80,
  shield_charm: 150,
  fury_potion: 100,
};

function toNat(n: unknown): number {
  const value = Math.floor(Number(n));
  return Number.isFinite(value) && value > 0 ? value : 0;
}

export function canonicalBuffItemId(id: string): string {
  if (typeof id !== "string" || id.length === 0) return "";
  return BUFF_ITEM_ID_ALIASES[id] ?? id;
}

export function frontendBuffItemId(id: string): string {
  if (typeof id !== "string" || id.length === 0) return "";
  return BUFF_ITEM_ID_FROM_CANISTER[id] ?? id;
}

/**
 * Owned stacks for a BuffShop row. Alias pairs must not double-count
 * after a hydrate copies `greater_potion` next to `greater_health_potion`.
 */
export function ownedBuffStacks(
  inventory: Readonly<Record<string, unknown>>,
  frontendId: string,
): number {
  const a = toNat(inventory[frontendId]);
  const canonical = canonicalBuffItemId(frontendId);
  if (canonical === frontendId) return a;
  return Math.max(a, toNat(inventory[canonical]));
}

/**
 * Non-destructive, idempotent copy of alias keys. Live BuffShop still
 * reads `greater_health_potion`; a later canister write can read
 * `greater_potion`. Never sums the pair (that would mint stacks).
 */
export function mergeBuffInventoryAliases(
  inventory: Readonly<Record<string, unknown>>,
): Record<string, number> {
  const next: Record<string, number> = {};
  for (const [rawId, rawQty] of Object.entries(inventory)) {
    const qty = toNat(rawQty);
    if (qty <= 0) continue;
    const frontendId = frontendBuffItemId(rawId);
    const canonical = canonicalBuffItemId(frontendId);
    const owned = Math.max(
      qty,
      toNat(next[frontendId]),
      canonical !== frontendId ? toNat(next[canonical]) : 0,
    );
    next[frontendId] = owned;
    if (canonical !== frontendId) next[canonical] = owned;
  }
  return next;
}

export function buffCostDrift(frontendId: string): {
  frontend: number;
  canister: number;
  drifted: boolean;
} | null {
  const frontend = FRONTEND_BUFF_SHOP_COSTS[frontendId];
  if (frontend == null) return null;
  const canister = CANISTER_BUFF_CATALOG_COSTS[canonicalBuffItemId(frontendId)];
  if (canister == null) return null;
  return { frontend, canister, drifted: frontend !== canister };
}
