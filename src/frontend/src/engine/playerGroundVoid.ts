/**
 * Map-gen void holes for ground placement (Summon / Barrier / Trap).
 *
 * Unique vs queued #619 portal (`tileType === "portal"` on `tiles`).
 * Void is a separate Set on the map, so the live gate painted those
 * cells as floor while walk / `isCellFree` / `spawnSummonUnit` refused
 * them and slid off the highlighted hole.
 *
 * Strike / Mark empty rings stay unique — they are not ground placement
 * and still treat void as floor.
 */

export type PlayerGroundVoidSpell = {
  targetType?: string;
  isBarrier?: boolean;
};

export type VoidTileKeySet = { has(key: string): boolean };

let implicitVoidTiles: VoidTileKeySet | null | undefined;

export function bindPlayerCastVoidTiles(voids?: VoidTileKeySet | null): void {
  implicitVoidTiles = voids ?? null;
}

export function boundPlayerCastVoidTiles(
  explicit?: VoidTileKeySet | null,
): VoidTileKeySet | null | undefined {
  return explicit !== undefined ? explicit : implicitVoidTiles;
}

/**
 * Same predicate as the live `ground` / `isBarrier` branch. Do not fold
 * #619's wider isSummon/isTrap Attack Nearest empty-pick into this.
 */
export function playerGroundVoidApplies(spell: PlayerGroundVoidSpell): boolean {
  const t = (spell.targetType ?? "enemy") as string;
  return t === "ground" || spell.isBarrier === true;
}

export function playerGroundVoidLiveRejectReason(args: {
  spell: PlayerGroundVoidSpell;
  destKey: string;
  voidTiles?: VoidTileKeySet | null;
}): string | null {
  if (!playerGroundVoidApplies(args.spell)) return null;
  const voids = boundPlayerCastVoidTiles(args.voidTiles);
  if (voids?.has(args.destKey) === true) return "ground_void";
  return null;
}
