/**
 * Champion spell-slot disabled / hover reasons.
 * Display only — SummonControlPanel already gates on AP; BattleUIPanel does not yet.
 * Not wired into BattleUIPanel.
 */

export type SpellSlotDisableReason =
  | { kind: "overworld"; spellName?: string }
  | { kind: "empty"; slotIndex: number }
  | { kind: "cooldown"; spellName: string; turns: number }
  | { kind: "ap"; spellName: string; need: number; have: number }
  | { kind: "ready"; spellName: string; detail: string };

/**
 * Empty battle-bar slot hover.
 * Open PR #830 already locked `emptyBattleSlotTitle` ("open Book to equip").
 * Keep this helper aligned so wiring does not mint a third empty-slot string.
 */
export function emptySpellSlotLabel(slotIndex: number): string {
  const n = Math.max(1, Math.floor(Number(slotIndex) || 1));
  return `Empty slot ${n} — open Book to equip`;
}

export function spellSlotTitle(reason: SpellSlotDisableReason): string {
  switch (reason.kind) {
    case "overworld":
      return reason.spellName
        ? `${reason.spellName} — usable once a fight starts`
        : "Empty slot — equip a spell in the Spellbook; usable once a fight starts";
    case "empty":
      return emptySpellSlotLabel(reason.slotIndex);
    case "cooldown":
      return `${reason.spellName} — cooling down (${reason.turns} turn${
        reason.turns === 1 ? "" : "s"
      } left)`;
    case "ap":
      return `${reason.spellName} — need ${reason.need} AP (have ${reason.have})`;
    case "ready":
      return `${reason.spellName} — ${reason.detail}`;
  }
}

/** True when the slot should refuse selection for AP (champion parity with summon kit). */
export function spellSlotBlockedByAp(have: number, need: number): boolean {
  return (
    Math.max(0, Math.floor(Number(need) || 0)) >
    Math.max(0, Math.floor(Number(have) || 0))
  );
}
