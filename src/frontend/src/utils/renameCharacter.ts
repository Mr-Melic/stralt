/**
 * renameCharacter returns a Motoko Result. The Caffeine/Candid bindings
 * resolve that as a value (`{ __kind__: "err" }` / `{ err }`) instead of
 * throwing. Callers that debit the live wallet on await-without-check will
 * treat a rejected rename as a successful 100 Doka spend.
 *
 * On #ok the handler must debit the *live* wallet (dokaBalanceRef), not the
 * click-time closure. Recap is pointer-events: none, so a player can rename
 * while applyRewards is still in flight. A stale `dokaBalance - 100` then
 * overwrites the credited UI; hydrateWhenIdle copies that short wallet into
 * committed and the next heal/shop saveBattleStats writes it on-chain.
 */

import {
  clearUnconfirmedWalletSpend,
  noteUnconfirmedSpend,
} from "./progressPersistSpend.ts";

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

/** Double-click must not enqueue a second 100 Doka rename. */
export function shouldStartRename(
  isRenaming: boolean,
  liveDoka: number,
): boolean {
  return !isRenaming && liveDoka >= RENAME_DOKA_COST;
}

/**
 * Confirm Rename used `isRenaming` React state. Both clicks of a double-click
 * see `false` before the re-render, enqueue two renameCharacter calls, and
 * debit 100 Doka twice. Mark the ref in the same tick as the first click.
 */
export function beginRename(
  inFlight: { current: boolean },
  liveDoka: number,
): boolean {
  if (!shouldStartRename(inFlight.current, liveDoka)) return false;
  inFlight.current = true;
  return true;
}

/** Only debit the live wallet after the canister accepted the rename. */
export function shouldDebitRenameDoka(
  parsed: { ok: true } | { err: string },
): boolean {
  return "ok" in parsed;
}

/** Subtract the rename fee from the live UI wallet after #ok. */
export function liveDokaAfterRename(liveDoka: number): number {
  return Math.max(0, Math.floor(Number(liveDoka) || 0) - RENAME_DOKA_COST);
}

/**
 * Subtract the rename fee from the persist-lock snapshot so a later
 * saveBattleStats spend cannot reconstruct from a pre-rename committed value.
 */
export function committedDokaAfterRename(committedDoka: number): number {
  return Math.max(0, Math.floor(Number(committedDoka) || 0) - RENAME_DOKA_COST);
}

/**
 * renameCharacter already deducted on the canister. Reconstructing the
 * spend from an unseeded placeholder 0 commits 0 and marks the lock
 * seeded, so the next death/heal persist wipes the live wallet.
 */
export function shouldCommitRenameDokaSpend(walletSeeded: boolean): boolean {
  return walletSeeded;
}

export type RenamePersistLock = {
  enqueue<T>(fn: () => Promise<T>): Promise<T>;
  commit(next: { doka?: number }): void;
  snapshot(): { doka: number };
  isWalletSeeded(): boolean;
  noteUnseededCredit?: () => void;
};

export type RenameActor = {
  renameCharacter?: (slot: bigint, newName: string) => Promise<unknown>;
};

/**
 * renameCharacter deducts 100 Doka then returns `#ok`. A replica reject
 * after that write used to leave the persist lock at the pre-rename
 * wallet. Retry hits "Name already in use" (own name matches), so the
 * player cannot pay again — but recap shop saveBattleStats wrote the
 * ghost-high lock. Incoming-above-stored is ignored, so the item landed
 * while canister Doka stayed put.
 *
 * Catch the throw, note an unconfirmed spend, and let the next absolute
 * write re-fetch. A live drop is the fee; a stale-equal snapshot skips.
 */
export async function persistRenameThroughLock(
  actor: RenameActor,
  persist: RenamePersistLock,
  slot: number,
  newName: string,
): Promise<{ ok: true } | { err: string }> {
  return persist.enqueue(async () => {
    if (!actor.renameCharacter) {
      return { err: "Actor not available" };
    }
    let parsed: { ok: true } | { err: string };
    try {
      parsed = readRenameCharacterResult(
        await actor.renameCharacter(BigInt(slot), newName),
      );
    } catch {
      noteUnconfirmedSpend(persist);
      persist.noteUnseededCredit?.();
      return { err: "renameCharacter transport error" };
    }
    if (
      shouldDebitRenameDoka(parsed) &&
      shouldCommitRenameDokaSpend(persist.isWalletSeeded())
    ) {
      persist.commit({
        doka: committedDokaAfterRename(persist.snapshot().doka),
      });
      clearUnconfirmedWalletSpend(persist);
    }
    return parsed;
  });
}
