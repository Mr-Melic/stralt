/**
 * Persist a spell upgrade through the backend-authoritative upgradeSpell
 * funnel. updateCharacter cannot deduct from the per-principal dokaBalances
 * map (Character no longer carries dokaBalance), so a local-only spend is
 * restored the next time callerDokaBalance refetches.
 */

export interface SpellUpgradeOk {
  newLevel: number;
  newDoka?: number;
}

/**
 * Apply an upgradeSpell result to the local level map.
 * Must run inside the persist lock, before any queued saveBattleStats
 * snapshot, or a heal/death write will persist the pre-upgrade map.
 */
export function applySpellLevel(
  levels: Record<string, number>,
  spellId: string,
  newLevel: number,
): Record<string, number> {
  return { ...levels, [spellId]: newLevel };
}

export interface SpellUpgradeActor {
  upgradeSpell: (
    slot: bigint,
    spellId: string,
  ) => Promise<
    | { ok: bigint | number }
    | { _ok: bigint | number }
    | { __kind__: "ok"; ok: bigint | number }
    | { err: string }
    | { _err: string }
    | { __kind__: "err"; err: string }
  >;
  getCallerDokaBalance?: () => Promise<bigint | number | null | undefined>;
}

/**
 * Normalize upgradeSpell variant payloads from the Candid / Caffeine bindings.
 * Throws when the canister rejected the write so callers do not apply a local
 * upgrade that never landed.
 */
export function readUpgradeSpellOk(result: unknown): number {
  if (result == null || typeof result !== "object") {
    throw new Error("upgradeSpell returned an empty result");
  }
  const r = result as Record<string, unknown>;
  const errMsg = r.__kind__ === "err" ? r.err : (r.err ?? r._err ?? r.Err);
  if (errMsg != null && r.ok == null && r._ok == null) {
    throw new Error(`upgradeSpell failed: ${String(errMsg)}`);
  }
  const ok = r.ok ?? r._ok;
  if (ok == null) {
    throw new Error("upgradeSpell missing ok payload");
  }
  const newLevel = Number(ok);
  if (!Number.isFinite(newLevel) || newLevel < 1) {
    throw new Error(`upgradeSpell returned invalid level: ${String(ok)}`);
  }
  return newLevel;
}

/**
 * Upgrade a spell on the canister (deducts Doka + writes spellLevelKeys) and
 * optionally read back the new per-principal Doka balance.
 */
export async function persistSpellUpgrade(
  actor: SpellUpgradeActor,
  slot: number,
  spellId: string,
): Promise<SpellUpgradeOk> {
  const result = await actor.upgradeSpell(BigInt(slot), spellId);
  const newLevel = readUpgradeSpellOk(result);
  if (!actor.getCallerDokaBalance) {
    return { newLevel };
  }
  const raw = await actor.getCallerDokaBalance();
  if (raw == null) {
    return { newLevel };
  }
  const newDoka = Number(raw);
  return {
    newLevel,
    newDoka: Number.isFinite(newDoka) ? newDoka : undefined,
  };
}
