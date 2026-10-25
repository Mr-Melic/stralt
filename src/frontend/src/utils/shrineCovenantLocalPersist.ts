/**
 * Shrine visit count + covenant-buff localStorage (SDEG-2026-10-25-004).
 *
 * WorldExploration writes `pbv_shrine_count_${userId}_slotN` and
 * `pbv_covenant_buff_${userId}_slotN` on altar contact (display-name userId).
 * Neither key is in the version-gate keep-list. deleteCharacter does not clear
 * them. There is no shrine feat in defaultAchievements, and covenantBuffMapsRef
 * is never read for combat. Slot reuse therefore inherits a dead counter / a
 * 3-map string that a later wiring would treat as live progress.
 *
 * Do not add required Character.shrineCount / covenantBuff (already optional
 * unused session fields) without a later chain file after 20260901.
 * Wire WX when that file is editable; this helper only locks the contract.
 */

export const SHRINE_COUNT_KEY_KIND = "shrine_count" as const;
export const COVENANT_BUFF_KEY_KIND = "covenant_buff" as const;

export type ShrineCovenantKeyKind =
  | typeof SHRINE_COUNT_KEY_KIND
  | typeof COVENANT_BUFF_KEY_KIND;

export function shrineCovenantStorageKey(
  kind: ShrineCovenantKeyKind,
  userId: string,
  slot: number,
): string {
  const owner = (userId ?? "").trim() || "guest";
  const n = Number.isFinite(slot) ? Math.floor(slot) : 0;
  return `pbv_${kind}_${owner}_slot${n}`;
}

/** Official deleteCharacter / useDeleteCharacter never remove these keys. */
export function shrineCovenantKeysSurviveSlotReuse(): boolean {
  return true;
}

/** defaultAchievements has no shrine_* condition; shrineAchievementRef is write-only. */
export function shrineCountIsWiredToAFeat(): boolean {
  return false;
}

/** covenantBuffMapsRef is written and hydrated, never consumed by combat. */
export function covenantBuffMapsRefIsConsumedInCombat(): boolean {
  return false;
}

/**
 * Altar Doka uses tryClaimFlag + settle; shrine count / covenant writes sit
 * outside that callback. A visit-count feat may count on contact; a loot feat
 * must not. Keep the two semantics separate.
 */
export function shouldCountShrineVisitIndependentOfDokaSettle(): boolean {
  return true;
}

export function shouldClearShrineCovenantKeysOnCharacterDelete(): boolean {
  return true;
}
