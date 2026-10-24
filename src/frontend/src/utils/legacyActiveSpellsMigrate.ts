/**
 * WorldExploration hydrates the spell bar from canister `spellBarOrder`
 * after mount, but the useState initializer still reads localStorage.
 *
 * Namespaced key: `${userId}_slot${slot}_pbv_active_spells`.
 * Legacy global: `pbv_active_spells` (pre-namespace, or empty-userId writes).
 *
 * HEAD copies the global onto the namespaced key whenever the global exists,
 * then deletes the global (`WorldExploration.tsx` 2718–2722). That overwrites
 * a newer namespaced bar with a stale six-month-old global blob — a
 * destructive migration that is not “copy only if missing”.
 *
 * Distinct from SDEG-2026-10-22-003 (empty canister *spell levels*) and
 * SDEG-2026-10-23-004 (Nat `activeSpells` vs Text `spellBarOrder`).
 * No schema. Do not edit WorldExploration while combat PRs queue.
 */

export const LEGACY_ACTIVE_SPELLS_KEY = "pbv_active_spells";

export function namespacedActiveSpellsKey(
  userId: string,
  slot: number,
): string {
  return `${userId}_slot${slot}_${LEGACY_ACTIVE_SPELLS_KEY}`;
}

/** HEAD always writes legacy → namespaced when the global key exists. */
export function headCopiesLegacyOverNamespacedWheneverPresent(): boolean {
  return true;
}

/**
 * Safe one-shot: copy the global bar only when this slot has no namespaced
 * cache. Replay after the global is gone is a no-op.
 */
export function shouldCopyLegacyActiveSpells(args: {
  namespacedExisting: string | null | undefined;
  legacyGlobal: string | null | undefined;
}): boolean {
  const legacy =
    typeof args.legacyGlobal === "string" && args.legacyGlobal.length > 0;
  const namespaced =
    typeof args.namespacedExisting === "string" &&
    args.namespacedExisting.length > 0;
  return legacy && !namespaced;
}

/** True when HEAD would clobber a populated namespaced bar. */
export function legacyActiveSpellsWouldOverwriteNamespaced(args: {
  namespacedExisting: string | null | undefined;
  legacyGlobal: string | null | undefined;
}): boolean {
  const legacy =
    typeof args.legacyGlobal === "string" && args.legacyGlobal.length > 0;
  const namespaced =
    typeof args.namespacedExisting === "string" &&
    args.namespacedExisting.length > 0;
  return (
    headCopiesLegacyOverNamespacedWheneverPresent() && legacy && namespaced
  );
}

/**
 * Normalize a stored bar (id strings or legacy full SpellConfig objects)
 * to spell ids. Unknown shapes are dropped, not treated as ownership.
 */
export function activeSpellsCacheToIds(
  raw: string | null | undefined,
): string[] {
  if (typeof raw !== "string" || raw.length === 0) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    const ids: string[] = [];
    for (const entry of parsed.slice(0, 8)) {
      if (typeof entry === "string" && entry.length > 0) {
        ids.push(entry);
        continue;
      }
      if (
        entry != null &&
        typeof entry === "object" &&
        "id" in entry &&
        typeof (entry as { id: unknown }).id === "string"
      ) {
        const id = (entry as { id: string }).id;
        if (id.length > 0) ids.push(id);
      }
    }
    return ids;
  } catch {
    return [];
  }
}
