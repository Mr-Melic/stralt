# ACTION_IDs — 2026-09-27 Save / Data Evolution Guardian

Durable ledger for implementers and the Report Action Orchestrator.  
Source of every record: Save/Data Evolution Guardian.  
Audit: [`DATA_EVOLUTION_AUDIT_2026-09-27.md`](./DATA_EVOLUTION_AUDIT_2026-09-27.md).  
Prior: `ACTION_IDS_SDEG_2026-09-26.md` (#622).  
Do not edit shipped `20260831` / `20260901` NewActor. Do not edit `WorldExploration.tsx` / `main.mo` / `BuffShop.tsx` / `deathPenalty.ts` / `versionGate.ts` while older persist PRs are queued. Do not clone #362 / #385 / #386 / #388 / #400 / #408 / #437 / #466 / #490 / #508 / #577 / #622 helpers.

---

## Carry-forward (still OPEN — do not re-mint)

All SDEG-2026-08-31 through SDEG-2026-09-26 items remain as previously ledgered. Vehicles: #362, #385, #386, #388, #400, #408, #437, #466, #490, #508, #577, #622.

HEAD is still `0f5363f`. No persist schema landed on main since 2026-09-21. This run does **not** approve any new required persist field.

---

## New (2026-09-27)

ACTION_ID: SDEG-2026-09-27-001  
SOURCE_AUTOMATION: Save/Data Evolution Guardian  
TITLE: Clear unpaid-death browser markers on character delete so a new occupant cannot inherit the 20/40 cut  
CATEGORY: stale-client  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Pending key is `pbv_pending_death_penalty_slotN` (`deathPenalty.ts` **309–311**) with no character identity. Official delete (`CharacterSelection` **871–880**) only called `deleteCharacter`. Replay `resolvePendingDeathReplay(0, 200, {preXp:100, preDoka:200, afterXp:80, afterDoka:120})` is `{action:"write", newDoka:120}` — a fresh L1 with the unchanged principal wallet takes the deleted occupant's 40% Doka cut. Shared `dokaBalances` means slot 2's money is taxed. Distinct from #385 (II principal on the key), #508 (keep across version wipe), #497 (honour on every slot).  
SYSTEMS_AFFECTED: `useDeleteCharacter`; unpaid death localStorage; principal Doka  
RECOMMENDED_ACTION: Official delete now calls `clearSlotReuseBrowserCaches` after a successful canister delete (`useCharacterQueries.ts`). #385 must keep a delete-time clear when the key gains a principal. Bind the marker to character identity or a writeGeneration (SDEG-006) so a leftover replay cannot target a new occupant.  
AUTONOMY: IMPLEMENT (this run: official delete clear + contract tests); HUMAN (#385 union; Motoko has no death-pending stable)  
DEPENDENCIES: Do not edit `deathPenalty.ts` while #385 / #508 own that file  
MIGRATION_REQUIREMENT: None (browser cache). Do not add a canister death-pending field without a later chain file after `20260901`.  
REGRESSION_RISK: LOW for clearing on successful delete; MEDIUM if a mid-delete crash leaves the canister row and the marker is already gone (reload then has no replay — same as today's lost-marker case)  
VALIDATION_REQUIRED: Delete slot 1 with a pending 20/40, create a new champion in slot 1, principal Doka unchanged. `node --test src/frontend/src/utils/slotReusePersistEvolve.test.ts`  
STATUS: NEW  

---

ACTION_ID: SDEG-2026-09-27-002  
SOURCE_AUTOMATION: Save/Data Evolution Guardian  
TITLE: Slot reuse must not inherit dungeonRecords, canister buff stacks, or feat counters  
CATEGORY: progress-idempotency  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `createCharacter` / `deleteCharacter` already `_clearBossRushForSlot` (`main.mo` **367–370**, **490–491**, **3257–3260**) because rush is principal#slot. `dungeonRecords` is Principal-only (**2894–2924**) and `updateDungeonProgress` still `totalMapsCompleted + 1`. `buffInventories` is principal#slot (**2791–2803**) and is unused by BuffShop UI (SDEG-005) but a future hydrate would hand potions to the new occupant. Maps/feat counters `${userId}_slotN_pbv_maps_visited_count` / `_pbv_ground_doka_pickups` / `pbv_covenant_buff_*` are not cleared on delete (WX **2191–2198**, **6474–6476**). `clearSlotReuseBrowserCaches` can drop those keys when `userId` is passed; official delete does not have userId yet. Complements SDEG-007 (slot-scope dungeon + idempotent increment) — does not replace it.  
SYSTEMS_AFFECTED: `dungeonRecords`; `buffInventories`; explore_25 / loot_10 localStorage; covenant cache  
RECOMMENDED_ACTION: Motoko: on delete (and create into a cleared slot) drop `_buffKey(caller, slot)`; reset dungeon only when no remaining slot is in a chain, or slot-scope the map (SDEG-007). Frontend: pass II principal into `clearSlotReuseBrowserCaches` from delete. Do not wipe principal Doka or achievementProgress (account-level).  
AUTONOMY: HUMAN (Motoko after `main.mo` queue); IMPLEMENT (helper + optional userId clear this run)  
DEPENDENCIES: SDEG-2026-08-31-007; do not edit `main.mo` / WX / BuffShop while older persist PRs queue  
MIGRATION_REQUIREMENT: YES if dungeon is rekeyed to principal#slot (copy Principal-only onto slot 1). Buff map delete is behavior-only.  
REGRESSION_RISK: MEDIUM if dungeon reset while another live slot is mid-chain (principal-scoped today)  
VALIDATION_REQUIRED: Two slots: delete slot 1, slot 2 dungeon depth unchanged. Last slot deleted then recreated: chainDepth 0, no leftover canister potions, maps-visited 0. `node --test src/frontend/src/utils/slotReusePersistEvolve.test.ts`  
STATUS: NEW  

---

ACTION_ID: SDEG-2026-09-27-003  
SOURCE_AUTOMATION: Save/Data Evolution Guardian  
TITLE: Do not Number() Character Nats before saveBattleStats absolute writes  
CATEGORY: unbounded-progression  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `deepNormalizeBigInts` (`normalizeBigInts.ts` **6–8**) converts every BigInt to Number in `useGetCharacterSlots` / `useGetCharacter` (**75**, **99**). `saveBattleStats` writes `writeXp = min(incoming, stored)` and the same for Doka (`main.mo` **2087–2088**). `Number(MAX_SAFE_INTEGER+2n)` is not the stored Nat — the min then **cuts** leftover XP. `xpThresholdBigInt(48)` already exceeds `MAX_SAFE_INTEGER` (`xpCurve.ts`). HUD saturates on purpose; hydrate+absolute-write does not. Distinct from SDEG-2026-09-26-002 (leaderboard display) and SDEG-006 (generation).  
SYSTEMS_AFFECTED: character hydrate; `saveBattleStats`; leftover XP; principal Doka; HP grandfather  
RECOMMENDED_ACTION: Keep bigint (or a `{n:number, exact:bigint}` pair) for experience / Doka / level / HP on the persist path. Skip the XP/Doka absolute write when `jsNumberLosesIntegerPrecision(stored)`. Do not change Motoko Nat. Do not treat HUD saturate as persist saturate.  
AUTONOMY: IMPLEMENT (contract helper this run); HUMAN (hydrate types — `useCharacterQueries` / GameFlow / WX queue)  
DEPENDENCIES: SDEG-2026-08-31-006 complementary; do not edit WX  
MIGRATION_REQUIREMENT: None  
REGRESSION_RISK: HIGH if components mix bigint with `+` after hydrate stops Number()ing; LOW for documenting the cut  
VALIDATION_REQUIRED: Fixture leftover XP `MAX_SAFE_INTEGER+2`; hydrate then heal `saveBattleStats` does not lower canister XP. `node --test src/frontend/src/utils/persistNatHydrateEvolve.test.ts`  
STATUS: NEW  
