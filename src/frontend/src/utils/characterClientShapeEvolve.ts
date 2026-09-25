/**
 * Frontend Character shape vs Motoko / bindgen Character.
 *
 * `types/gameTypes.ts` still carries `dokaBalance?`, optional `pixelPattern`
 * / `stats`, and an index signature. Motoko `Character` requires
 * `pixelPattern : Text`, `stats : CharacterStats`, parallel spell arrays,
 * and has no dokaBalance field (wallet is `dokaBalances[Principal]`).
 * CharacterCreation builds a gameTypes payload (including dokaBalance) and
 * passes it through ActorAny create/update — Candid encode drops unknown
 * fields, but the loose client type hides missing required optionals and
 * invites stale-client overwrites of fields Motoko now keep-stores.
 */

export type ClientCharacterShapeSnapshot = {
  hasDokaBalanceField: boolean;
  pixelPatternOptional: boolean;
  statsOptional: boolean;
};

export type MotokoCharacterShapeSnapshot = {
  hasDokaBalanceField: boolean;
  pixelPatternRequired: boolean;
  statsRequired: boolean;
};

export function clientCharacterShapeSnapshot(): ClientCharacterShapeSnapshot {
  return {
    hasDokaBalanceField: true,
    pixelPatternOptional: true,
    statsOptional: true,
  };
}

export function motokoCharacterShapeSnapshot(): MotokoCharacterShapeSnapshot {
  return {
    hasDokaBalanceField: false,
    pixelPatternRequired: true,
    statsRequired: true,
  };
}

export function clientCharacterShapeDriftsFromMotoko(
  client: ClientCharacterShapeSnapshot = clientCharacterShapeSnapshot(),
  motoko: MotokoCharacterShapeSnapshot = motokoCharacterShapeSnapshot(),
): boolean {
  return (
    client.hasDokaBalanceField !== motoko.hasDokaBalanceField ||
    client.pixelPatternOptional === motoko.pixelPatternRequired ||
    client.statsOptional === motoko.statsRequired
  );
}
