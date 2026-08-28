/**
 * renameCharacter returns a Motoko Result. The Caffeine/Candid bindings
 * resolve that as a value (`{ __kind__: "err" }` / `{ err }`) instead of
 * throwing. Callers that debit the live wallet on await-without-check will
 * treat a rejected rename as a successful 100 Doka spend.
 */

export function readRenameCharacterResult(
  result: unknown,
): { ok: true } | { err: string } {
  if (result == null || typeof result !== "object") {
    return { err: "renameCharacter returned an empty result" };
  }
  const r = result as Record<string, unknown>;
  if (
    r.__kind__ === "err" ||
    (r.err != null && r.ok == null && r._ok == null)
  ) {
    return { err: String(r.err ?? r._err ?? "Rename failed") };
  }
  if (r.__kind__ === "ok" || "ok" in r || "_ok" in r) {
    return { ok: true };
  }
  return { err: "renameCharacter missing ok payload" };
}

export const RENAME_DOKA_COST = 100;

/** Only debit the live wallet after the canister accepted the rename. */
export function shouldDebitRenameDoka(
  parsed: { ok: true } | { err: string },
): boolean {
  return "ok" in parsed;
}
