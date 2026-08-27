/**
 * Achievement claim is a backend Doka delta. saveBattleStats writes an
 * absolute wallet from the persist lock's committed snapshot. If the claim
 * runs outside that lock, a recap heal/death reconstructs from the pre-claim
 * balance and wipes the reward.
 */

export type AchievementCreditPersistLock = {
  enqueue<T>(fn: () => Promise<T>): Promise<T>;
  commit(next: { doka?: number }): void;
  snapshot(): { doka: number };
};

export type AchievementCreditActor = {
  claimAchievementReward: (achievementId: string) => Promise<unknown>;
};

export function readClaimAchievementReward(
  result: unknown,
): { ok: number } | { err: string } {
  if (result == null || typeof result !== "object") {
    return { err: "claimAchievementReward returned an empty result" };
  }
  const r = result as Record<string, unknown>;
  if (
    r.__kind__ === "err" ||
    (r.err != null && r.ok == null && r._ok == null)
  ) {
    return { err: String(r.err ?? r._err ?? "claimAchievementReward failed") };
  }
  const ok = r.ok ?? r._ok;
  const granted = Number(ok);
  if (!Number.isFinite(granted) || granted < 0) {
    return { err: "claimAchievementReward missing granted amount" };
  }
  return { ok: granted };
}

export function committedDokaAfterAchievementCredit(
  committedDoka: number,
  granted: number,
): number {
  const base = Math.max(0, Math.floor(Number(committedDoka) || 0));
  const add = Math.max(0, Math.floor(Number(granted) || 0));
  return base + add;
}

/** Claim on the same persist lock as applyRewards / saveBattleStats. */
export async function creditAchievementRewardThroughPersist(
  actor: AchievementCreditActor,
  persist: AchievementCreditPersistLock,
  achievementId: string,
): Promise<{ ok: number } | { err: string }> {
  return persist.enqueue(async () => {
    const parsed = readClaimAchievementReward(
      await actor.claimAchievementReward(achievementId),
    );
    if ("ok" in parsed) {
      persist.commit({
        doka: committedDokaAfterAchievementCredit(
          persist.snapshot().doka,
          parsed.ok,
        ),
      });
    }
    return parsed;
  });
}
