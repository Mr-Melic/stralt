# Bug-hunt memory

Open or rejected only. Delete an entry when its PR merges or the bug is gone.

- WorldExploration `attributeKillReward` / `selectDefeatedEnemiesForRewards`: player-summon deaths (bomber, enemy melee, DoT) were appended to the victory roster, so `applyRewards` credited extra XP/Doka. Same PR also: `battleDefeatedRef` not cleared on overworld `checkBattleTrigger` (fight-2 credits fight-1 kills); Void Rift turn-start only mutated the turn-order entry so last-hostile ticks skipped victory; `persistDeathPenalty` wrote `(50+level)*10*0.5` HP (255 at L1) instead of 50% max HP. PR: pending. Status: open. Recorded: 2026-08-30.

- `advanceTurn` last-hostile summon lifespan fade still dispatched the player inside the same `flushSync` (player DoT set `deathTriggered`, `shouldAwardVictory` refused, `persistDeathPenalty` instead of `applyRewards`). PR: https://github.com/Mr-Melic/stralt/pull/89. Status: open (stale duplicate of merged #88; dirty vs `main`). Recorded: 2026-08-30.
