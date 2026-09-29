/**
 * Mirror of src/backend/lib/adminGuard.mo `retiredSpellUpgradeRejected`.
 * Do not recopy into adminSafety.ts — that file is owned by older open PRs.
 */

const BUILT_IN_SPELL_IDS = [
  "shadow_strike",
  "soul_rend",
  "vampire_bite",
  "reflect_barrier",
  "thunder_clap",
  "void_collapse",
] as const;

export function isInnateSpellId(id: string): boolean {
  return (BUILT_IN_SPELL_IDS as readonly string[]).includes(id);
}

/**
 * Failure: adminSetSpellConfig(usableByPlayer=false) on a built-in, then
 * upgradeSpell, treats innate starters as unowned. createCharacter persists
 * empty spellLevelKeys. Catalog extras the player never owned stay retired.
 */
export function retiredSpellUpgradeRejected(args: {
  usableByPlayer: boolean;
  alreadyOwned: boolean;
  spellId: string;
}): string | null {
  if (args.usableByPlayer) return null;
  if (args.alreadyOwned) return null;
  if (isInnateSpellId(args.spellId)) return null;
  return "Spell is retired";
}
