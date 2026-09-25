/**
 * Session-state persist contracts (blood / covenant / shrine / activeSpells Nat).
 *
 * Backend exposes updateSessionState / getSessionState / saveActiveSpells on
 * Character optionals. Official WorldExploration never calls those methods —
 * covenant maps remaining and shrine feat counts live only in localStorage
 * (`pbv_covenant_buff_*`, `pbv_shrine_count_*`). getSessionState defaults
 * missing bloodBalance to 50 (SDEG-2026-09-23-004). covenantBuff is a free
 * Text (display name), not a catalog id.
 *
 * saveActiveSpells still writes `activeSpells : ?[Nat]` with no ownership
 * check. Official UI removed that call and persists spell ids via
 * setSpellBarOrder (`spellBarOrder : ?[Text]`). The Nat field remains on
 * the Character record (#362 keep-store vehicle) and must not be deleted
 * (M0169).
 */

export function officialUiCallsUpdateSessionState(): boolean {
  return false;
}

export function officialUiCallsSaveActiveSpells(): boolean {
  return false;
}

export function getSessionStateDefaultBlood(): number {
  return 50;
}

export function covenantBuffStoredAs(): "name" | "id" {
  return "name";
}

export function activeSpellsFieldElementType(): "Nat" | "Text" {
  return "Nat";
}

export function spellBarOrderElementType(): "Nat" | "Text" {
  return "Text";
}

/** Raw clients can still overwrite all three session fields in one call. */
export function updateSessionStateOverwritesOptionals(): boolean {
  return true;
}

export function activeSpellsNatDivergesFromSpellBarOrder(): boolean {
  return (
    activeSpellsFieldElementType() !== spellBarOrderElementType() ||
    officialUiCallsSaveActiveSpells() === false
  );
}
