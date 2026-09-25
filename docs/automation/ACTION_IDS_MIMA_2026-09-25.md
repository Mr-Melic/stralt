# ACTION_IDs — 2026-09-25 Mechanic Interaction Matrix Auditor

Durable ledger for the Report Action Orchestrator.  
SOURCE_AUTOMATION: Mechanic Interaction Matrix Auditor  
HEAD inspected: `0f5363f` (`Merge pull request #332`)  
Gameplay code: not modified.

Do not re-file still-OPEN prior items (`MIMA-2026-08-31-001/002/005/008`, `MIMA-2026-09-01-002/006`, `MIMA-2026-09-02-002/003/004/005/006`, `MIMA-2026-09-21-001/002/003/004`, `MIMA-2026-09-22-001/002/003/004`, `MIMA-2026-09-23-001/002/003/004`, `MIMA-2026-09-24-001/002/003/004`). Frozen AI / execute, Wisp / Drain `healUsed`, Challenge HUD, Boss Rush feats, and Attack Nearest **origin** stay closed. Do not clone **#327** / **#370**, **#331** / **#373**, **#336**, **#376**, **#379**, **#380**, **#382**, **#386**, **#389**, **#391**, **#410**, **#443**, **#467**, **#476**, **#487**, **#489**, **#491**, **#495**, **#496**, **#498**, **#508**, **#524**, **#541**, **#543**, **#546**, **#547**, **#550**, **#551**, **#553**, **#554**, **#555**.

HEAD is unchanged since the 09-24 matrix. These IDs are consume joins that run never filed: AP-discount floor vs 0-cost Timestep, AP-discount vs summon kits, Thorned path-tax vs non-player walks, achievement claim vs unpaid death.

---

ACTION_ID: MIMA-2026-09-25-001  
SOURCE_AUTOMATION: Mechanic Interaction Matrix Auditor  
TITLE: Arcane Surge / Overflow min-1 floor turns 0-AP Timestep into a 1-AP gate  
CATEGORY: AP + map modifiers + challenges + player feedback  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Both modifiers announce cheaper AP with a floor (`mapModifiers.ts` 210–217, 319–324): `onApCost: (baseCost) => Math.max(1, baseCost - 1)`. Registry tests lock “never drops a cost below 1” for base 1 and 3 (`mapModifiers.cost.test.ts` 27–43) and never call `applyApCost(0, …)`. Timestep is the only catalog 0-AP player spell (`spellData.ts` 215–232). `resolveCastApCost` always runs `applyApCost` (`targeting.ts` 1096–1101). `planPlayerCastResources` / `shouldRejectCastForMissingAp` / `executeCastAttempt` / Attack Nearest preview all pass the registry (`playerCastPlan.ts` 32–47, 121–132; `WorldExploration.tsx` 17129–17133, 17245–17250, 18872–18880). `applyApCost(0)` is `Math.max(1, -1) === 1`, so an empty wallet floats “Not enough AP” and the Attack Nearest button stays dark. `playerCastPlan.test.ts` 96–138 exists specifically so Timestep still executes at 0 AP — **without** `applyApCost`. Execute then returns `"no_ap"` after restore (`spellEngine.ts` 721–733) so the debit and `recordChallengeApSpend` / hard_3 peak do not fire; the hole is the **gate**, not the peak. Distinct from MIMA-2026-09-23-003 (Overflow **fizzle** on status apply — do not re-file). Distinct from 09-22-003 (Dawn AP wiped by restore).  
EXPECTED_INTERACTION: A 0-cost spell stays 0 under a “−1, min 1” discount. Min 1 only applies when the base cost was ≥ 1. Empty-wallet Timestep remains legal on Surge/Overflow maps.  
ACTUAL_INTERACTION: The discount raises the only free spell to 1 AP. Preview, execute, and Attack Nearest agree on the wrong number.  
SYSTEMS_AFFECTED: Arcane Surge, Arcane Overflow, Timestep, AP, Attack Nearest, player feedback  
RECOMMENDED_ACTION: Change both `onApCost` hooks to `baseCost <= 0 ? 0 : Math.max(1, baseCost - 1)` (or skip the hook when `baseCost === 0` in `applyApCost`). Do not change the −1 / min-1 rule for positive costs. Tests: `applyApCost(0, surge) === 0`; `planPlayerCastResources({ currentAp: 0, baseApCost: 0, applyApCost: surge })` is `ok`; `applyApCost(2, surge) === 1` still. Do not change Timestep’s once-per-battle or `"no_ap"` restore.  
AUTONOMY: IMPLEMENT_ONE_FLOOR_GUARD  
DEPENDENCIES: None. Do not fold Overflow fizzle (09-23-003) into this PR. Distinct from 002 (summon kits never see the hook).  
REGRESSION_RISK: LOW — only the 0-base case changes.  
VALIDATION_REQUIRED: Helper test; playtest Timestep on an Arcane Surge map with 0 leftover AP.  
STATUS: NEW  

---

ACTION_ID: MIMA-2026-09-25-002  
SOURCE_AUTOMATION: Mechanic Interaction Matrix Auditor  
TITLE: Arcane Surge / Overflow never discount summon-control kit or summon-AI casts  
CATEGORY: AP + summons + map modifiers + player feedback  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Player execute is the only production `applyApCost` consumer (`WorldExploration.tsx` 10335–10338, 10972–10975, 17129–17133, 17245–17250, 18872–18880). `planSummonControlCast` charges `Math.max(0, Number(spell.apCost))` (`summonControlCast.ts` 244–246) from the summon’s own AP (`WorldExploration.tsx` 9825–9832). `executeSummonAction.applyCast` does the same raw `Number(spell.apCost ?? 0)` (`summonExecutor.ts` 153–160). Enemy AI has no `applyApCost` call. On Surge, player Strike 2 → 1 while a controlled / AI wolf’s 2-AP kit stays 2. Announce is map-wide (“AP costs reduced by 1”), not “player spells.” Distinct from 001 (0-AP floor on the **player** gate). Distinct from the 09-24 non-finding that summon-kit AP is not `recordChallengeApSpend` / hard_3 — this ID is the **discount**, not the challenge peak. Distinct from 09-21-003 (Striker range on AI kits).  
EXPECTED_INTERACTION: Every AP debit on a Surge/Overflow map uses `applyApCost`, **or** the announce says player spells only.  
ACTUAL_INTERACTION: Player preview/execute/Attack Nearest discount. Minion kits and enemy casts do not.  
SYSTEMS_AFFECTED: Arcane Surge, Arcane Overflow, summons (control + AI), AP, player feedback  
RECOMMENDED_ACTION: Pass `applyApCost` into `planSummonControlCast` and `summonExecutor.applyCast` (same helper as `planPlayerCastResources`). Leave melee AP on the existing `helpers.meleeApCost` unless product wants that discounted too. Tests: Surge + wolf 2-AP kit remainingAp is current−1; executor log spent 1. Do not change summon lifespan or kit range. Copy-only alternative: “Your spell AP −1 (min 1).”  
AUTONOMY: IMPLEMENT_HELPER_THEN_TWO_SUMMON_SITES  
DEPENDENCIES: Reuse 001’s 0-base floor so a future 0-AP kit is not raised to 1. Distinct from 09-21-003 Striker.  
REGRESSION_RISK: LOW if only kit `apCost` is wrapped; MEDIUM if melee AP is also changed without a test.  
VALIDATION_REQUIRED: `planSummonControlCast` fixture with Surge; playtest control-mode wolf kit on a Surge map.  
STATUS: NEW  

---

ACTION_ID: MIMA-2026-09-25-003  
SOURCE_AUTOMATION: Mechanic Interaction Matrix Auditor  
TITLE: Thorned Ground path-tax is player-walk-only; enemy and summon walks of the same length pay 0  
CATEGORY: hazards + summons + AI pathfinding + challenges + player feedback  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Announce is “moving far deals extra damage” (`mapModifiers.ts` 175–177). Live player tax is `thornedGroundWalkDamage` / `battleWalkHazardDamages` (`battleSetup.ts` 290–329): 5 HP per tile after the first, wired only through `applyBattleWalkHazards` on player mouse/touch (`WorldExploration.tsx` 9906–9933, 10553, 11137) and into `recordChallengeWalkHazardDamage`. Enemy walk landing still switches `lava` / `ice` / `spikes` only (16872–16948) with no `pathLength` / `isThornedGround` read. Controlled-summon walk updates x,y and MP (`applyControlledSummonWalk` 9945–9998) with occupancy but no Thorned. Summon AI `applyMovement` is `isCellFree` + MP (`summonExecutor.ts`). The registry `onDamageDealt` `pathLength` hook is still dead (09-24 non-finding — do not re-file the hook). Distinct from MIMA-2026-08-31-008 (Void Rift **tile** dest extra via `voidRiftWalkDamage` — same player-only helper, different mechanic). Distinct from 09-01-006 / 08-31-002 (lava/ice/spikes landing). Untouchable / under-N-damage only see the player tax, so a 4-tile enemy walk that would be 15 HP on the player is free.  
EXPECTED_INTERACTION: Any combatant walk of length > 1 on Thorned Ground pays `thornedGroundWalkDamage(pathLength)` (and challenge HP if the walker is the player). Copy that says “player walks” is also acceptable.  
ACTUAL_INTERACTION: Player mouse/touch pay. Enemies, controlled summons, and summon AI do not.  
SYSTEMS_AFFECTED: Thorned Ground, hazards, summons, AI pathfinding, challenges (Untouchable / under-50)  
RECOMMENDED_ACTION: After a legal enemy/summon walk commit, call `thornedGroundWalkDamage(path.length)` when `thorned_ground` is active and subtract from store HP (reuse `enemyHpAfterHazardDamage` / `updateCombatant`; player already has the helper). Do not also invoke the dead registry `pathLength` hook (its threshold `> 2` disagrees with the live `> 1` helper — keep one formula). Tests: enemy path length 4 ⇒ HP −15; wolf control path 3 ⇒ store HP −10; `isThornedGround: false` is 0. Do not change lava 8–15 numbers.  
AUTONOMY: IMPLEMENT_ONE_HELPER_CALL_ON_ENEMY_AND_SUMMON_WALK  
DEPENDENCIES: Distinct from 08-31-001/008 tile landing. Do not grow a third lava block. Do not clone **#489** (shared lava/spike **step** rolls).  
REGRESSION_RISK: MEDIUM — Thorned fights become deadlier for hunters/wolves; keep the 5-per-extra-tile formula.  
VALIDATION_REQUIRED: Walk-length fixture per side; playtest Thorned charger 4-step vs player 4-step.  
STATUS: NEW  

---

ACTION_ID: MIMA-2026-09-25-004  
SOURCE_AUTOMATION: Mechanic Interaction Matrix Auditor  
TITLE: Achievement claim commits canister Doka without honouring an unpaid death 20/40 cut  
CATEGORY: achievements + death + persistence + rewards  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `creditAchievementRewardThroughPersist` (`achievementReward.ts` 114–138) enqueues, parses `claimAchievementReward` `#ok`, and commits `committedDokaAfterAchievementCredit(snapshot.doka, granted)` with no `readPendingDeathPenaltyAnywhere` / `applyUnpaidDeathPenaltyToWrite`. WX `persistAchievementClaim` (1516–1528) then `creditLiveDoka` of the raw grant. Absolute spends **do** honour pending (`WorldExploration.tsx` 13134–13147). GameKey is the same class on a different helper (`redeemGameKeyThroughPersist` — MIMA-2026-09-02-003 / **#391**; do not clone). Feats panel stays reachable after a failed death persist (HUD `pointer-events` are not gated on the pending marker). `resolvePendingDeathReplay` can still subtract later, but the lock and HUD sit above the honoured wallet until the next absolute write — the race #256 closed for pickups. Tests (`achievementReward.test.ts`) cover grant/no-op/unseeded, not pending death. Distinct from 09-24-004 (Fever × non-kill Doka). Distinct from **#491** (challenge Doka on first recap — display).  
EXPECTED_INTERACTION: Any persist-lock Doka credit (feat claim, GameKey, pickup, portal) either applies the unpaid 20/40 to the committed snapshot or leaves the pending marker and does not raise UI above an honoured wallet.  
ACTUAL_INTERACTION: Pickup/portal/heal absolute writes honour or settle; feat claim is raw canister Doka.  
SYSTEMS_AFFECTED: achievement claim, death penalty, persist lock, HUD wallet  
RECOMMENDED_ACTION: In `creditAchievementRewardThroughPersist` (and the UI credit), if `readPendingDeathPenaltyAnywhere` is set, commit `applyUnpaidDeathPenaltyToWrite(pending, xp, committed+granted).doka` (or settle then credit). Do not recut a `cutConfirmed` wallet. Tests: pending 80 Doka loss + claim 500 ⇒ lock Doka honours −80 on the post-claim total; `cutConfirmed` claim does not subtract again. Do not change `claimAchievementReward` canister math. Do not fold into **#391** unless that PR already extracts a shared `commitCreditHonouringUnpaidDeath` helper — then call it here.  
AUTONOMY: IMPLEMENT_HELPER_THEN_ACHIEVEMENT_CREDIT  
DEPENDENCIES: Reuse `applyUnpaidDeathPenaltyToWrite` from #256. Do not clone **#391** GameKey call sites. Distinct from 09-24-004 Fever.  
REGRESSION_RISK: MEDIUM — must not tax a feat after the death cut already landed.  
VALIDATION_REQUIRED: Unit test on the persist helper; playtest claim after a failed death persist.  
STATUS: NEW  
