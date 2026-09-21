import { confirmKeptIncrementalXp } from "./progressPersist.ts";

export interface ApplyRewardsOk {
  newDoka: number;
  newXp: number;
  newLevel: number;
}

/**
 * Normalize applyRewards variant payloads from the Candid / Caffeine bindings.
 * Accepts `{ ok }`, `{ _ok }`, `{ __kind__: "ok", ok }`, and the matching err
 * shapes. Throws when the canister rejected the write.
 */
export function readApplyRewardsOk(result: unknown): ApplyRewardsOk {
  if (result == null || typeof result !== "object") {
    throw new Error("applyRewards returned an empty result");
  }
  const r = result as Record<string, unknown>;
  const errMsg = r.__kind__ === "err" ? r.err : (r.err ?? r._err ?? r.Err);
  if (errMsg != null && r.ok == null && r._ok == null) {
    throw new Error(`applyRewards failed: ${String(errMsg)}`);
  }
  const ok = (r.ok ?? r._ok) as
    | { newDoka?: unknown; newXp?: unknown; newLevel?: unknown }
    | undefined;
  if (!ok) {
    throw new Error("applyRewards missing ok payload");
  }
  return {
    newDoka: Number(ok.newDoka),
    newXp: Number(ok.newXp),
    newLevel: Number(ok.newLevel),
  };
}

/** Portal step XP. Must not land in the HUD until applyRewards commits. */
export const PORTAL_TRANSITION_XP = 10;

/**
 * Must match `src/backend/main.mo` `applyRewards` per-call ceilings
 * (`dokaDelta > 100_000` / `xpDelta > 500_000` → `#err`).
 *
 * Official victory Doka rolls a 0.01% band of `level * [1, 1e9]`. That
 * product (and a 0.5% band under dungeon 4× + Doka Fever 2×) exceeds the
 * cap. The recap already advertised the grant; the canister then rejected
 * the whole call, so XP and challenge rewards were also dropped.
 */
export const APPLY_REWARDS_MAX_DOKA_DELTA = 100_000;
export const APPLY_REWARDS_MAX_XP_DELTA = 500_000;

function toNatDelta(n: number): number {
  return Math.max(0, Math.floor(Number(n) || 0));
}

/** Clamp official-client deltas to the canister maxima so persist cannot #err. */
export function clampApplyRewardsDeltas(
  dokaDelta: number,
  xpDelta: number,
): { dokaDelta: number; xpDelta: number } {
  return {
    dokaDelta: Math.min(APPLY_REWARDS_MAX_DOKA_DELTA, toNatDelta(dokaDelta)),
    xpDelta: Math.min(APPLY_REWARDS_MAX_XP_DELTA, toNatDelta(xpDelta)),
  };
}

/** Persist a non-battle XP/Doka delta through the single applyRewards funnel. */
export async function persistIncrementalRewards(
  // Same loose actor type as resolveBattleRewards — Caffeine bindings vary.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  actor: any,
  selectedSlot: number,
  dokaDelta: number,
  xpDelta: number,
): Promise<ApplyRewardsOk> {
  const clamped = clampApplyRewardsDeltas(dokaDelta, xpDelta);
  const result = await actor.applyRewards(
    BigInt(selectedSlot),
    BigInt(clamped.dokaDelta),
    BigInt(clamped.xpDelta),
  );
  return readApplyRewardsOk(result);
}

export type PersistIncrementalRewardsResult =
  | { ok: ApplyRewardsOk }
  | { err: "rejected" | "transport" };

/**
 * `#err` / `applyRewards failed` means the canister did not add.
 * Any other throw is after-or-during invoke — the replica may have the
 * grant. Callers must not retry the same delta and must not
 * saveBattleStats the pre-credit leftover.
 */
export function classifyApplyRewardsError(
  error: unknown,
): "rejected" | "transport" {
  const msg = error instanceof Error ? error.message : String(error);
  return msg.includes("applyRewards failed") ? "rejected" : "transport";
}

export async function persistIncrementalRewardsResult(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  actor: any,
  selectedSlot: number,
  dokaDelta: number,
  xpDelta: number,
): Promise<PersistIncrementalRewardsResult> {
  try {
    return {
      ok: await persistIncrementalRewards(
        actor,
        selectedSlot,
        dokaDelta,
        xpDelta,
      ),
    };
  } catch (error) {
    return { err: classifyApplyRewardsError(error) };
  }
}

export type IncrementalRewardsPersistLock = {
  commit: (next: { doka?: number; xp?: number; level?: number }) => void;
  snapshot: () => { doka: number; xp: number; level: number };
  isWalletSeeded: () => boolean;
  noteUnconfirmedXpCredit: () => void;
  noteUnconfirmedCredit?: () => void;
};

export type IncrementalXpConfirm = {
  readCharacter: () => Promise<unknown>;
};

/**
 * Portal +10 used persistIncrementalRewards which throws after invoke.
 * The persist lock never committed leftover XP, so a recap heal
 * saveBattleStats-wrote the pre-portal leftover and wiped the grant.
 *
 * Transport-keep notes unconfirmed XP (do not remint; do not write the
 * stale leftover). Confirm via getCharacter when the replica has caught up.
 */
export async function persistIncrementalXpThroughLock(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  actor: any,
  selectedSlot: number,
  xpDelta: number,
  persist: IncrementalRewardsPersistLock,
  confirm: IncrementalXpConfirm,
): Promise<ApplyRewardsOk | null> {
  const result = await persistIncrementalRewardsResult(
    actor,
    selectedSlot,
    0,
    xpDelta,
  );
  if ("ok" in result) {
    persist.commit({ xp: result.ok.newXp, level: result.ok.newLevel });
    return result.ok;
  }
  if (result.err === "rejected") {
    throw new Error("applyRewards failed");
  }
  persist.noteUnconfirmedXpCredit();
  const confirmed = await confirmKeptIncrementalXp(
    persist.snapshot(),
    confirm.readCharacter,
  );
  if (confirmed) {
    persist.commit({ xp: confirmed.xp, level: confirmed.level });
    return {
      newDoka: persist.snapshot().doka,
      newXp: confirmed.xp,
      newLevel: confirmed.level,
    };
  }
  return null;
}
