/**
 * Drain detection for player and enemy casts.
 *
 * Motoko `SpellConfig` stores the drain kind on `spellType` ("drain") and
 * the heal/DoT kind on `effectType`. The seeded Vampire Bite is
 * `spellType: "drain"` + `effectType: "heal"` so it appears in the live
 * library (`shouldIncludeBackendSpellInLibrary` keeps usable catalog
 * rows). `resolveSpellCast` (enemy / kit) already treated `spellType ===
 * "drain"` as a drain. `resolvePlayerCast` and the WorldExploration
 * `applyDamageToEnemy` wrapper only looked at `effectType === "drain"`,
 * so a player who equipped Vampire Bite spent AP, dealt the 20 damage,
 * and never entered the lifesteal block.
 *
 * Keep this helper in its own file so restack does not concatenate into
 * `targeting.ts` / `spellEngine.ts` sibling hunks.
 */

export function spellIsDrain(
  spell:
    | {
        spellType?: string | null;
        effectType?: string | null;
      }
    | null
    | undefined,
): boolean {
  if (!spell) return false;
  if (spell.spellType === "drain") return true;
  const effect = spell.effectType;
  return typeof effect === "string" && effect.toLowerCase().includes("drain");
}
