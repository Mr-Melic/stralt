/**
 * SpellList chips (`AdminDashboard.tsx` ~3741–3760) are effectType / AP /
 * DMG / RNG only. `adminDeleteSpellConfig` retires built-ins
 * (`usableByPlayer=false`) and deletes custom rows, but the list never
 * shows ACTIVE vs RETIRED / INACTIVE. A retired built-in still looks live.
 *
 * Unique 2026-10-31 file — do not merge into adminOwnerUx.spellDeleteCopy.ts
 * (#1223) or SpellSummonFields.tsx (#564). Not wired (stack).
 */

export type OwnerSpellLifecycleKind = "active" | "retired" | "inactive";

export function ownerSpellListLifecycleChip(args: {
  usableByPlayer: boolean;
  isBuiltIn: boolean;
}): { chip: string; kind: OwnerSpellLifecycleKind } {
  if (!args.usableByPlayer) {
    if (args.isBuiltIn) {
      return {
        chip: "RETIRED — players cannot use",
        kind: "retired",
      };
    }
    return {
      chip: "INACTIVE — players cannot use",
      kind: "inactive",
    };
  }
  return {
    chip: "ACTIVE — player usable",
    kind: "active",
  };
}

export function ownerSpellListMissingLifecycleChipOnMain(): true {
  return true;
}
