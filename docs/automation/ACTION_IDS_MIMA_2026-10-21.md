# ACTION_IDs — 2026-10-21 Mechanic Interaction Matrix Auditor

Durable ledger for the Report Action Orchestrator.  
SOURCE_AUTOMATION: Mechanic Interaction Matrix Auditor  
HEAD inspected: `0f5363f` (`Merge pull request #332`)  
Gameplay code: not modified.

Do not re-file OPEN / closed 08-31 / 09-01 / 09-02 / 09-21…09-29 items or in-flight
**#443** / **#728** / **#754** / **#763** / **#765**. Push/pull remain REPORT_ONLY (08-31-005).
Gravity Well / Fog of War / `applyRangeModification` unused — do not re-file.

---

ACTION_ID: MIMA-2026-10-21-001  
SOURCE_AUTOMATION: Mechanic Interaction Matrix Auditor  
TITLE: Summon-control kit select leaves walk greens on; no kit cast range ring  
CATEGORY: summons + range + preview/execute  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: SummonControlPanel `onSpellSelect` only sets `selectedSummonSpellId` (`WorldExploration.tsx` kit panel wiring; panel itself has no range paint). RAF highlight builds `spellTiles` only when `battleActionModeRef === "attack"` **and** `selectedSpellIdRef.current` is set (`7345–7350`). Kit selection never flips `battleActionMode` to `"attack"` and never writes `selectedSpellIdRef` — summon turn start forces `"walk"` (`14366–14367`). `getSpellRangeTiles` (`7111–7127`) reads only the player spell-bar id. Execute still gates via `planSummonControlCast` + `isTileCastableLive` (`summonControlCast.ts` 221–273; WX `castControlledSummonSpell` 9825–9842). With a kit armed, green MP tiles from `getMpReachableTiles` stay painted (`7341–7344`); empty green clicks no-op (selected kit branch requires a resolved target, `10050–10077`); hostile clicks cast. Distinct from 09-21-004 (Attack Nearest origin/preview) and from 09-22-002 (boss kit range/LoS). No test asserts kit-select ⇒ cast-range set non-empty.  
EXPECTED_INTERACTION: Selecting a kit spell paints the same castable set `planSummonControlCast` / `isTileCastableLive` would accept, and clears walk greens (or walk mode) until the kit is cancelled.  
ACTUAL_INTERACTION: Walk preview stays; cast has no blue ring; legal kit tiles are invisible.  
SYSTEMS_AFFECTED: summons (control), range, LoS (live gate only), player feedback  
RECOMMENDED_ACTION: When `selectedSummonSpellId` is set, compute spell tiles from the kit spell + summon caster (`computeTargetableTiles` / `isTileCastableLive`) and suppress MP greens. Do not change kit AP debit. Tests: kit select ⇒ occupied hostile in range is highlighted; empty walk tile is not.  
AUTONOMY: IMPLEMENT_HELPER_THEN_RAF_BRANCH  
DEPENDENCIES: None. Do not fold into 09-21-004.  
REGRESSION_RISK: LOW — walk mode after End Turn / clear selection must restore greens.  
VALIDATION_REQUIRED: Helper or RAF fixture; playtest Archer Poison Arrow select then click.  
STATUS: NEW  

---

ACTION_ID: MIMA-2026-10-21-002  
SOURCE_AUTOMATION: Mechanic Interaction Matrix Auditor  
TITLE: Summon-control hover MP label still uses player tile and player wallet  
CATEGORY: summons + MP + preview/execute  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Green BFS budget was fixed with `battleWalkMpBudget` + `getActiveCasterPos` (`battleWalkMp.ts` 43–52; WX `7024–7040`). Hover float still runs only in walk mode (`8515–8553`) and computes `dist` from `playerPositionRef` (`8521–8523`), colors affordance with `currentBattleMpRef` (`8545–8546`), and never reads `activeControlledSummonIdRef` / summon `currentMp`. During Wolf control the green ring is summon-origin / summon-MP, but the hover string is player-Manhattan × `applyMpCost` against the player wallet — a 3-MP wolf tile can show red “not enough” from a spent player, or green “affordable” from a full player while the wolf cannot pay. Execute debits summon MP via `battleWalkMpCost` (`10088–10097`). Residual of 09-01-001 after execute/`battleWalkMpBudget` closed; not Frozen/Slime 2×. No hover test under `controllingSummon`.  
EXPECTED_INTERACTION: Hover cost origin, path/budget metric, and affordance color match the active walker (summon when controlled).  
ACTUAL_INTERACTION: Ring/execute are summon-correct; hover stays player-anchored.  
SYSTEMS_AFFECTED: summons (control), MP, player feedback  
RECOMMENDED_ACTION: Hover from `getActiveCasterPos()`; affordance vs `battleWalkMpBudget(...)`; prefer `battleWalkMpCost(pathLength, costPerTile)` (or Manhattan only when equal to path). Tests: controlling summon, player MP 0 / summon MP 3 ⇒ hover green on a 1-tile step.  
AUTONOMY: IMPLEMENT_ONE_HOVER_BRANCH  
DEPENDENCIES: Reuse `battleWalkMpBudget` / `walkMpCostPerTile`. Do not re-open Frozen execute.  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Unit test on a pure hover-cost helper; playtest Wolf control hover.  
STATUS: NEW  

---

ACTION_ID: MIMA-2026-10-21-003  
SOURCE_AUTOMATION: Mechanic Interaction Matrix Auditor  
TITLE: Controlled-summon unseal slides off the green click tile but still charges that path  
CATEGORY: summons + portals + occupancy + preview/execute  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `getMpReachableTiles` BFS blocks portal keys / barriers / void (`7075–7083`) but not progression-reserved bridge cells. Click passes when `reachable.has(dest)` then `applyControlledSummonWalk(summon, gridPos, moveCost)` (`10084–10097`) with `moveCost = battleWalkMpCost(path.length, …)` for the path **to the click**. `resolveControlledSummonMoveDest` (`occupancy.ts` 373–403) may `relocateOffMandatoryCells` / `unsealProgressionOccupants` so `landed ≠ dest`; WX still writes `landed` and subtracts the click `pathLength` (`9994–9998`). Preview shows the bridge cell green; execute parks the wolf elsewhere and spends the bridge path’s MP. Distinct from closed summon×portal occupy/cleanup, from 08-31-002 / #728 (hazard landing), and from 09-02-002 (unseal onto lava). No test asserts click cell === landed or MP = path-to-landed.  
EXPECTED_INTERACTION: Highlight only commits that will stick, **or** preview the post-unseal cell and charge MP for the path actually taken.  
ACTUAL_INTERACTION: Green click dest can disagree with store position; MP follows the abandoned click path.  
SYSTEMS_AFFECTED: summons (control), portals / progression occupancy, MP  
RECOMMENDED_ACTION: Exclude `progressionReserved` from summon (and optionally player) MP BFS, **or** after resolve, recompute cost from origin→landed and reject if unaffordable / if landed not in highlight. Tests: unique-bridge dest ⇒ either not green or land+debit match. Do not remove unseal.  
AUTONOMY: IMPLEMENT_HELPER_THEN_WX_CALL  
DEPENDENCIES: None. Do not clone #728 / 09-02-002 lava strand.  
REGRESSION_RISK: MEDIUM — over-excluding reserved cells can strand summons in corridors; keep unseal fallback.  
VALIDATION_REQUIRED: Occupancy fixture with dual-path cut; playtest Wolf onto unique exit bridge.  
STATUS: NEW  

---

ACTION_ID: MIMA-2026-10-21-004  
SOURCE_AUTOMATION: Mechanic Interaction Matrix Auditor  
TITLE: Boss Rush room-clear applyRewards never fires thresholdAchievementConditionsFromPersist  
CATEGORY: rewards + achievements + Boss Rush + death  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `handleBattleEnd` unlocks `doka_1000` / `doka_10000` / `level_10` inside the persist enqueue from `applyRewards` return values (`WorldExploration.tsx` 12546–12558) via `thresholdAchievementConditionsFromPersist` (`adminSafety.ts` 403–414), then may re-show the recap (12563–12575). Comment notes a queued death cut can land as soon as the enqueue returns — unlocks must use the post-credit snapshot, not live hydrate. `handleBossRushRoomClear` `applyAndCommit` only `resolveBattleRewards` + `progressPersist.commit` (12817–12835); no threshold loop. Live doka/level hydrate is gated by `shouldApplyVictoryLiveHydrate` (12838–12861). Outside-battle doka/level effects (2260–2284, 3630–3643) only see UI after that hydrate. Lava/spike death during room-clear persist ⇒ feats stay locked this session despite canister credit. Distinct from “wallet/level feats wait until applyRewards commits” (deferral rule), 09-26-004 (unpaid death honour on applyRewards), 09-29-004 (Fever), #803/#536 (complete(9) vs reset).  
EXPECTED_INTERACTION: After Boss Rush room-clear `applyRewards` commits, fire the same threshold unlocks as victory (and attach to recap), even if death then skips live hydrate.  
ACTUAL_INTERACTION: Boss Rush path never calls `thresholdAchievementConditionsFromPersist`; death-during-persist skips the only UI path into the outside effects.  
SYSTEMS_AFFECTED: Boss Rush, applyRewards, achievements (doka_1000/doka_10000/level_10), death  
RECOMMENDED_ACTION: Inside Boss Rush `applyAndCommit` after commit, mirror victory’s threshold loop + optional recap re-show. Tests: room-clear crossing 1000 Doka fires unlock; deathEpoch bump during persist still unlocks from `persisted.newDoka`/`currentLevel`.  
AUTONOMY: IMPLEMENT_WX_BRANCH  
DEPENDENCIES: None. Do not fold into #803.  
REGRESSION_RISK: LOW — same helper as victory; avoid double-fire via `achievementsShownRef`.  
VALIDATION_REQUIRED: Unit on persist callback; playtest jackpot room clear past doka_1000 with leftover lava.  
STATUS: NEW  

---

ACTION_ID: MIMA-2026-10-21-005  
SOURCE_AUTOMATION: Mechanic Interaction Matrix Auditor  
TITLE: explore_25_maps world check never schedules on portal mapsVisited++  
CATEGORY: achievements + portals  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Portal path increments `mapsVisitedCountRef` and writes localStorage (`WorldExploration.tsx` 6470–6477). Outside-battle achievement effect reads that ref for `explore_25_maps` (2275–2276) but deps are only `[dokaBalance, inBattle, checkAndFireAchievement]` (2284) — a ref bump does not re-run the effect. Unlock waits for a later victory (`clientTrustedVictoryAchievementConditions` includes explore_25 at 12483–12496 / 12902–12915) or an incidental dokaBalance/inBattle edge. Distinct from loot_10 09-27-004 (pickup counter ticks before persist; world check nested under mapsVisited branch).  
EXPECTED_INTERACTION: Crossing 25 maps via portal unlocks explore_25 (toast) without requiring a later battle win or Doka credit.  
ACTUAL_INTERACTION: Portal mapsVisited++ alone never schedules the world check.  
SYSTEMS_AFFECTED: achievements (explore_25_maps), portals, localStorage feat counter  
RECOMMENDED_ACTION: Drive the mapsVisited check from a state/counter the effect depends on, or call `checkAndFireAchievement("explore_25_maps", false)` at the portal increment site when `>= 25`. Tests: portal-only bump 24→25 with stable dokaBalance unlocks once.  
AUTONOMY: IMPLEMENT_ONE_CALL_SITE  
DEPENDENCIES: None. Do not re-file 09-27-004.  
REGRESSION_RISK: LOW — `achievementsShownRef` / alreadyUnlocked guard double-fire.  
VALIDATION_REQUIRED: Effect or portal-site unit test.  
STATUS: NEW  

---

## Verified closed / non-findings (this hunt)

| Pair | Verdict |
| :--- | :--- |
| Blink/teleport player spells | Only catalog teleport is Swap (`spellData.ts` 142–158). Landing×hazards = 08-31-001 / #754. No separate Blink. |
| Swap LoS / occupancy | Dest is the hostile tile; LoS opt-in policy unchanged (`playerSpellRequiresLos`). |
| Timestep × DoT/lava/status ticks | Restore is mid-turn AP/MP only (`spellEngine.ts` 721–733; WX `9355–9372`); turn-start ticks unchanged. Surge floor = 09-25-001. |
| Enemy summon × portals/hazards/victory | Enemy summons are `type: "enemy"` with filled `aiOccupied` + enemy hazard landing; victory/room-clear `despawnSummons`. |
| Rest-exit × summons | Portals blocked while `inBattleRef` (`5972`); rest-exit `syncCombatants` new roster. |
| Boss phase × live summon HP | `hpAfterBossPhase2` only patches boss; illusions scaled in `checkPhaseTransition`. No new hole. |
| LoS through allied summons | `hasBresenhamLoS` walls+barriers only (`targeting.ts` 248–343). Same for all casters — not a player/summon asymmetry. Stale “block LoS” wording in `battleSetup.ts` 15/82 is docs drift, not a consume split. |
| Challenge AP from summon-control | Skipped per product note (minion AP ≠ player AP). |
| Push/pull | Unwired — do not re-file (08-31-005). |
