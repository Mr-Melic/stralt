# ACTION_IDs — 2026-09-26 Mechanic Interaction Matrix Auditor

Durable ledger for the Report Action Orchestrator.  
SOURCE_AUTOMATION: Mechanic Interaction Matrix Auditor  
HEAD inspected: `0f5363f` (`Merge pull request #332`)  
Gameplay code: not modified.

Do not re-file still-OPEN prior items (`MIMA-2026-08-31-001/002/005/008`, `MIMA-2026-09-01-002/006`, `MIMA-2026-09-02-002/003/004/005/006`, `MIMA-2026-09-21-001/002/003/004`, `MIMA-2026-09-22-001/002/003/004`, `MIMA-2026-09-23-001/002/003/004`, `MIMA-2026-09-24-001/002/003/004`, `MIMA-2026-09-25-001/002/003/004`). Frozen AI / execute, Wisp / Drain `healUsed`, Challenge HUD, Boss Rush feats, and Attack Nearest **origin** stay closed. Do not clone **#327** / **#331** / **#336** / **#370** / **#376** / **#379** / **#380** / **#382** / **#386** / **#389** / **#391** / **#410** / **#443** / **#467** / **#476** / **#487** / **#489** / **#491** / **#495** / **#496** / **#498** / **#508** / **#524** / **#541** / **#543** / **#546** / **#547** / **#550** / **#551** / **#553** / **#554** / **#555** / **#566** / **#596** / **#597** / **#598** / **#599** / **#601** / **#602** / **#604** / **#606** / **#607** / **#608**.

HEAD is unchanged since the 09-21…09-25 matrices. These IDs are consume joins that were never filed: Chaos Initiative × `turnOrderRef` authority, world one-shot credits × unpaid death, ice Frozen × summon/enemy MP, and victory/portal `applyRewards` × unpaid death.

---

ACTION_ID: MIMA-2026-09-26-001  
SOURCE_AUTOMATION: Mechanic Interaction Matrix Auditor  
TITLE: Chaos Initiative reshuffles React turnOrder but turnOrderRef / liveTurnOrder discard it — strip and dispatch diverge  
CATEGORY: statuses + summons + player feedback  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `chaos_initiative` announces “turn order reshuffles each round” and implements Fisher-Yates in `onTurnOrderSort` (`mapModifiers.ts` 435–467), keeping summons after their `ownerId`. WX calls `mapModifierRegistry.applyTurnOrderSort(prevOrder, activeMapModifierTypes)` when the index wraps to 0 (`WorldExploration.tsx` 14717–14721) and returns that array from `setTurnOrder`. `liveTurnOrder` prefers the live ref whenever it is non-empty (`turnQueue.ts` 135–137). `advanceTurn` always seeds from `liveTurnOrder(reactPrevOrder, turnOrderRef.current)` (WX 14099). The Chaos return path never assigns `turnOrderRef.current` — the only WX writes are battle start (12083), cleanup empties (11639 / 13421 / 13598), and boss phase (15783); store helpers update the ref only on add/remove/update/sync. AI / End Turn / `isPlayerTurn` read `turnOrderRef` (e.g. 14897, 18833–18834); the initiative strip reads React `turnOrder` via `battleTurnOrderForUi` (17387–17412). After a wrap, the strip can show the shuffled order at `currentTurnIndex` while the next dispatch still walks the pre-shuffle ref. The hook uses `Math.random()` and `applyTurnOrderSort` does not take `ctx.rng`, so even a synced shuffle would be unseedable. No test covers `applyTurnOrderSort` + ref sync. Distinct from MIMA-2026-09-24-001 (Mist/Winds mutate a turn-order **HP/MP copy**, not order identity). Distinct from 09-21-001 (player excluded from turn-start HP hooks). Time Warp **is** wired (15s at 14036–14038 / 14778–14806) — do not fold.  
EXPECTED_INTERACTION: When Chaos Initiative is active, each new round’s turn order (strip + AI dispatch + End Turn gate) is the same shuffled sequence, with summons still immediately after their owner.  
ACTUAL_INTERACTION: The hook runs and React state may briefly show a shuffle; gameplay turn advance keeps the initiative-sorted (or last store-synced) ref order forever.  
SYSTEMS_AFFECTED: Chaos Initiative, turn queue, initiative strip, enemy AI dispatch, summon control hand-off, player feedback  
RECOMMENDED_ACTION: After `applyTurnOrderSort`, assign `turnOrderRef.current = shuffled` (same assign-ref-then-set pattern as `addCombatant`) before returning from the `setTurnOrder` updater — or shuffle into the ref first and `setTurnOrder(() => turnOrderRef.current)`. Keep summon-after-owner. Prefer a seeded `ctx.rng` later; do not change Time Warp’s 15s timer. Tests: with `chaos_initiative` active, after wrap to index 0, `turnOrderRef.current.map(c => c.id)` equals the React order and differs from the pre-wrap order (seeded RNG). Do not change `liveTurnOrder`’s removeCombatant preference without covering kill-during-turn.  
AUTONOMY: IMPLEMENT_ONE_REF_SYNC_AT_SORT_SITE  
DEPENDENCIES: None. Do not fold Mist/Winds store commit (09-24-001) or player turn-start (09-21-001 / #443).  
REGRESSION_RISK: MEDIUM — a real shuffle changes who acts after the player; summons must stay glued to owners; do not desync `currentTurnIndexRef` from the entry that already dispatched at wrap.  
VALIDATION_REQUIRED: Unit test on advanceTurn wrap with Chaos; playtest strip highlight matches who can act after round 1.  
STATUS: NEW  

---

ACTION_ID: MIMA-2026-09-26-002  
SOURCE_AUTOMATION: Mechanic Interaction Matrix Auditor  
TITLE: Shrine / ground Doka / dungeon-complete one-shots commit applyRewards Doka without honouring unpaid death 20/40  
CATEGORY: rewards + death + persistence + dungeons  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Ground loot (`WorldExploration.tsx` 11366–11385), shrine altar (`11303–11320`), and dungeon-chain complete (`6340–6357`) all enqueue `persistDokaCreditResult` → `applyRewards(slot, doka, 0)` (`dokaPersist.ts` 250–261), then `settleOneShotPersistLock` + `creditLiveDoka` of the raw grant. None call `readPendingDeathPenaltyAnywhere` / `applyUnpaidDeathPenaltyToWrite`. The only production honour site is absolute spends (`persistAbsoluteProgress` 13134–13147). GameKey is `redeemGameKeyThroughPersist` (MIMA-2026-09-02-003 / **#391**). Feat claim is `creditAchievementRewardThroughPersist` (MIMA-2026-09-25-004). These three are the world one-shot `applyRewards` surfaces #256 restacked for remint — remint settle does **not** subtract unpaid 20/40 from the lock or HUD. `resolvePendingDeathReplay` can still cut later, but lock+HUD sit on the uncut+credited wallet until the next absolute write. Tests (`dokaPersist.test.ts`, `oneShotCredit.test.ts`) cover remint/settle, not pending death. Distinct from 09-24-004 (Fever × non-kill Doka). Distinct from 004 (victory / portal funnel). Do not clone **#604** (Death Realm pending **gates** on claim/GameKey — different predicate).  
EXPECTED_INTERACTION: Any persist-lock Doka credit (one-shot pickup, shrine, dungeon-complete, GameKey, feat claim) either applies unpaid 20/40 to the committed snapshot or leaves the pending marker and does not raise UI above an honoured wallet.  
ACTUAL_INTERACTION: Absolute heal/shop writes honour; shrine / ground / dungeon-complete raise lock+HUD by the raw credit on an uncut canister wallet.  
SYSTEMS_AFFECTED: shrine altar, ground Doka, dungeon-complete bonus, death penalty, persist lock, HUD wallet  
RECOMMENDED_ACTION: Shared `commitCreditHonouringUnpaidDeath(pending, xp, creditedDoka)` used by one-shot settle commit, GameKey (#391), feat claim (09-25-004), and victory/portal (004). On shrine/ground/dungeon commit, if pending is set, commit `applyUnpaidDeathPenaltyToWrite(pending, xp, settle.doka).doka` (or credit-then-honour) and clamp HUD the same way. Do not recut `cutConfirmed`. Tests: pending 80 loss + ground 30 ⇒ lock honours −80 on post-credit total; remint keep/release unchanged. Do not change `applyRewards` canister math.  
AUTONOMY: IMPLEMENT_HELPER_THEN_THREE_ONESHOT_SITES  
DEPENDENCIES: Reuse `applyUnpaidDeathPenaltyToWrite`. Prefer sharing the helper with **#391** / 09-25-004 / 004 if those land first — do not concatenate duplicate helpers. Do not clone **#604**.  
REGRESSION_RISK: MEDIUM — must not tax a pickup after the death cut already landed; must not remint.  
VALIDATION_REQUIRED: Unit test on settle+pending; playtest ground coin after a failed death persist.  
STATUS: NEW  

---

ACTION_ID: MIMA-2026-09-26-003  
SOURCE_AUTOMATION: Mechanic Interaction Matrix Auditor  
TITLE: Ice Frozen −2 MP only reduces player turn restore; summonTurnBudget and enemy/summon walk ignore the status  
CATEGORY: statuses + MP + summons + hazards  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Ice landing applies `effectName: "Frozen"`, `stat: "mp"`, `modifier: -2`, duration 2 for the **player** (`WorldExploration.tsx` 11454–11467; log says “Slowed!” while the comment still says “−50% MP”) and for **enemy** walk landing (`16913–16928`). Player turn restore adds `getStatModifier("player", "mp", …)` (`14357–14364`, also battle-start 12112–12114), so Frozen actually cuts the player’s MP pool. Controlled-summon turn restore uses `summonTurnBudget` (`summonControlCast.ts` 356–363) which returns raw `maxMp` with **no** `getStatModifier` — WX writes that budget at 14524–14529. Player-side summon AI reset is the same raw `maxMp` (`14987–14988`). Enemy / enemy-summon walks use `computeReachable` + `enemyWalkCostPerTile` (tile budget), never `currentMp` + Frozen. Enemy ice landing therefore stamps a Frozen icon whose −2 MP never shrinks reach. Distinct from MIMA-2026-08-31-002 / 09-01-006 (controlled / summon-AI **landing** never applies ice — do not re-file landing). Distinct from Frozen Terrain 2× walk cost (closed via `battleWalkMpCost` / `enemyWalkCostPerTile`). Distinct from Null Field × ice Frozen apply veto (09-24-002). Distinct from Haste/Slow/Sentinel-on-summons open PRs (**#596/#597/#598** — spell buffs, not ice Frozen). No test asserts Frozen on a summon/enemy id reduces `summonTurnBudget` / AI MP.  
EXPECTED_INTERACTION: Frozen −2 MP reduces the next turn’s MP budget for whoever holds the status (player restore and summon `currentMp` restore), the same way player restore already does.  
ACTUAL_INTERACTION: Only the player’s `setCurrentBattleMp` path consumes Frozen. Summon budgets ignore it; enemy tile budgets never read it.  
SYSTEMS_AFFECTED: ice hazard Frozen, summons (control + AI), enemy MP/reach, statuses, player feedback  
RECOMMENDED_ACTION: `summonTurnBudget(summon, mpMod)` → `max(0, maxMp + mpMod)` with `getStatModifier(summon.id, "mp", effects)` at both WX restore sites. Optionally teach enemy reach a Frozen MP gate if product wants ice to slow non-players the same way — or drop enemy Frozen apply and keep the log honest. Tests: Frozen on wolf id ⇒ control restore MP is maxMp−2; player Frozen still −2. Do not change ice duration/numbers. Do not fold hazard **landing** (08-31-002 / 09-01-006) into this PR unless extracting one helper.  
AUTONOMY: IMPLEMENT_HELPER_THEN_SUMMON_RESTORE  
DEPENDENCIES: None for the consume gap. Landing remains 08-31-002 / 09-01-006. Do not clone **#596/#597/#598**.  
REGRESSION_RISK: LOW for summon restore; MEDIUM if enemy reach is also gated (AI pacing).  
VALIDATION_REQUIRED: `summonTurnBudget` unit test with mpMod −2; playtest enemy steps on ice then confirm status icon vs actual MP/reach.  
STATUS: NEW  

---

ACTION_ID: MIMA-2026-09-26-004  
SOURCE_AUTOMATION: Mechanic Interaction Matrix Auditor  
TITLE: Victory resolveBattleRewards and portal persistIncrementalRewards commit applyRewards without honouring unpaid death 20/40  
CATEGORY: rewards + death + persistence + portals + challenges + achievements  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: After a failed death persist, the 20/40 marker stays in `localStorage` until an absolute `saveBattleStats` honour (`deathPenalty.ts` `applyUnpaidDeathPenaltyToWrite`; only WX consumer is `persistAbsoluteProgress` 13134–13147). The next **won** fight still calls `resolveBattleRewards` (`rewardResolver.ts` 180–201) which `applyRewards`s the full clamped Doka/XP (kill roll + `completedChallenges` via `addChallengeRewardDeltas` 155–161) and commits `recap.newDoka` / `newXp` onto the persist lock (WX 12528–12545). Boss Rush room-clear is the same funnel (12817–12835). Portal +10 XP uses `persistIncrementalRewards` (`applyRewardsResult.ts` 65–79; WX 6809–6818) — HUD is correctly gated until commit, but the commit is raw leftover XP on an uncut canister. `rewardResolver.ts` / `applyRewardsResult.ts` have **zero** `readPendingDeathPenalty` imports. Distinct from 002 (world one-shot `persistDokaCreditResult` surfaces). Distinct from 09-02-003 GameKey and 09-25-004 feat claim. Distinct from 09-24-004 (Fever 2× on kill Doka only). Do not clone **#604** (Death Realm **pending gate**, not unpaid 20/40). Tests cover clamp / remint / leftover HUD, not pending-death + victory/portal.  
EXPECTED_INTERACTION: Any `applyRewards` credit after an unpaid death either honours 20/40 on the committed snapshot (and HUD) or leaves the marker and does not raise UI above an honoured wallet. Portal +10 XP and challenge Doka/XP ride the same rule.  
ACTUAL_INTERACTION: Victory / challenge / Boss Rush / portal credits land at full value on the uncut wallet; HUD and lock sit high until a later absolute write recuts.  
SYSTEMS_AFFECTED: victory persist, Boss Rush room-clear, portal +10 XP, challenge rewards, death penalty, persist lock, HUD  
RECOMMENDED_ACTION: After a successful `readApplyRewardsOk`, if `readPendingDeathPenaltyAnywhere` is set, commit `applyUnpaidDeathPenaltyToWrite(pending, newXp, newDoka)` (do not recut `cutConfirmed`). Reuse the helper from 002 / #391 / 09-25-004. Tests: pending 80 Doka / 20 XP loss + victory 100/50 ⇒ lock 20 Doka / 30 leftover-or-equivalent; portal +10 with pending XP loss honours the cut; `cutConfirmed` victory does not subtract again. Do not change `applyRewards` canister math or Fever clamp.  
AUTONOMY: IMPLEMENT_HELPER_THEN_VICTORY_AND_PORTAL_COMMIT  
DEPENDENCIES: Share `commitCreditHonouringUnpaidDeath` with 002 / #391 / 09-25-004. Do not clone **#604**.  
REGRESSION_RISK: MEDIUM — must not tax a victory after the death cut already landed; must not hide recap numbers that the canister already granted without also updating copy.  
VALIDATION_REQUIRED: Unit test on resolveBattleRewards commit + pending; playtest win-after-failed-death-persist and one portal step.  
STATUS: NEW  

---

## Focus non-findings / CLOSED (this run — do not invent)

- **Summons × portals — CLOSED for occupy/path/cleanup.** `isCellFree` / `isBattleWalkTileBlocked` reject portals (`occupancy.ts` 94; `walkRejectCopy.ts` 32; summon `occupancyCtx.portals` WX 15207). Portal transition replaces roster via `syncCombatants(..., { resetBattle: true })` (6611). Victory / Boss Rush room-clear `despawnSummons` (12347–12349, 12941). Mid-battle portal check bails on `inBattleRef` (5972). Do not clone destack/portal integrity **#331/#553/#603/#608**.
- **DoT / plague × last-hostile victory — CLOSED.** `shouldAdvanceAfterEnemyTurn` / `shouldContinuePlayerTurnAfterHazard` / `shouldAwardVictory` (`battleSetup.ts` 103–116, 352–385) plus WX victory gate (13875–13880). Covered by `battleSetup.hostile.test.ts` / `battleSetup.turnStart.test.ts`.
- **Player death × leftover summons completing victory — CLOSED.** `_handlePlayerDeath` sets `deathTriggered` then `cleanupBattle` + `battleEndedRef` (13274–13308); `handleBattleEnd` / `shouldAwardVictory` refuse. Do not invent a new leftover-summon victory path.
- **Death × challenge completion — CLOSED.** `handleBattleEnd` returns before `evaluateChallenges` / `isChallengeCompleted` when `deathTriggeredRef.current` (12274–12276).
- **Spell discovery / observation × battle failure — no live observe path.** `ownedSpells` = base ∪ persisted keys/bar ∪ catalog (`2410–2439`). Do not invent watch-enemy-cast unlock.
- **Boss phase × summon death — CLOSED.** `checkPhaseTransition` reads only `bossEntry.hp / maxHp` (`hooks/useBossSystem.ts` 170–181); WX passes the boss combatant (15397–15400), not a minion.
- **Time Warp — wired.** `isTimeWarp` selects 15s vs 30s (WX 14036–14038, 14778–14806). Do not file.
- **Vampiric Ground × healUsed / no_healing** — already **MIMA-2026-09-21-001** (throwaway player attacker stub inside `enemyTakesDamage`; live HP and `challengeHealUsedRef` untouched). Do not re-file. 09-23-001 explicitly defers Vampiric stub to 09-21-001.
- **Portal +10 XP HUD-before-persist** — CLOSED. WX 6802–6818 enqueues `persistIncrementalRewards` and only hydrates after commit. The remaining hole is unpaid-death honour (004), not optimistic HUD.
- **Blood Moon 1.25× / Mirror Field 20% reflect** — wired in `resolvePlayerCast` (`spellEngine.ts` 895–907). Announce is flavour, not “all damage.” Do not invent a summon-kit skip.
- **Gravity Well / Fog of War** — unused `_is*` placeholders. Do not re-file.
- **Push / pull × hazards** — still unwired (08-31-005 REPORT_ONLY).
