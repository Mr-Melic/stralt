# ACTION_IDs — 2026-10-25 Save / Data Evolution Guardian

Durable ledger for implementers and the Report Action Orchestrator.  
Source of every record: Save/Data Evolution Guardian.  
Audit: [`DATA_EVOLUTION_AUDIT_2026-10-25.md`](./DATA_EVOLUTION_AUDIT_2026-10-25.md).  
HEAD: `0f5363f`.  
Do not clone #362 / #388 / #400 / #408 / #466 / #490 / #508 / #577 / #828 / #893 / #1014.  
Do not edit WorldExploration / main.mo / BuffShop / versionGate / deathPenalty / App / AchievementsPanel / combatMath this stack.

---

ACTION_ID: SDEG-2026-10-25-001  
SOURCE_AUTOMATION: Save/Data Evolution Guardian  
TITLE: Ground-Doka feat counter increments before credit settle (release retries re-count)  
CATEGORY: achievements / stale-overwrite  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `WorldExploration.tsx` 11366–11410 increments `groundDokaPickupCountRef` and writes `*_pbv_ground_doka_pickups` immediately after `tryClaimPickupId`, outside `resolveOneShotCreditSettle`. On `release` (11391–11392) the pickup id is freed for wallet safety but the counter is not rolled back — each failed credit + retry adds toward `loot_10_doka` → `markAchievementUnlocked`. Victory/idle gates read that counter (2277–2278, 12486). Distinct from known mapsVisited/ground-doka **keying** (10-24-003 / #490).  
SYSTEMS_AFFECTED: WorldExploration pickup site; `loot_10_doka`; achievementProgress  
RECOMMENDED_ACTION: Helper `shouldCountGroundDokaPickupForFeat(settle)` + bump/persist only on `commit`. Do not change applyRewards amounts. Wire WX when that file is editable.  
AUTONOMY: HELPER  
DEPENDENCIES: None for helper; WX vehicle for lock  
MIGRATION_REQUIREMENT: None (client counter). YES only if moving counts to canister (later file after 20260901).  
REGRESSION_RISK: LOW for helper; HIGH if WX keeps counting on claim  
VALIDATION_REQUIRED: Fixture `release` then retry → counter +1 not +2; `commit` → +1; `keep` does not count.  
STATUS: NEW  

---

ACTION_ID: SDEG-2026-10-25-002  
SOURCE_AUTOMATION: Save/Data Evolution Guardian  
TITLE: Overworld loot_10_doka recheck is gated on mapsVisited delta only  
CATEGORY: achievements  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: `WorldExploration.tsx` 2260–2284 runs `groundDokaPickupCountRef >= 10` only inside `if (mapsVisited !== prev.mapsVisited)`. Pickup commits change `dokaBalance` but that branch never evaluates loot_10. Battle victory still passes `groundDokaPickups` (`victoryAchievements.ts` 32–33; WX 12483–12496). Pure overworld 10th coin waits for next portal or a win.  
SYSTEMS_AFFECTED: WorldExploration idle achievement effect  
RECOMMENDED_ACTION: Also evaluate loot_10 when the pickup counter changes after commit. Helper `shouldRecheckLoot10DokaFeat` owns the predicate; WX must call it.  
AUTONOMY: HELPER  
DEPENDENCIES: SDEG-2026-10-25-001  
MIGRATION_REQUIREMENT: None  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: 10th overworld commit with mapsVisited unchanged → predicate true; count 9 → false.  
STATUS: NEW  

---

ACTION_ID: SDEG-2026-10-25-003  
SOURCE_AUTOMATION: Save/Data Evolution Guardian  
TITLE: Display-name HUD localStorage can poison principal saveUserUiLayout  
CATEGORY: stale-client / identity  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: GameFlow `userId = userProfile.id ?? name` (`GameFlow.tsx` 256 / 278); Candid UserProfile has no id. Pre-fix `DraggablePanel` cached `pbv_panel_layout_${name}`; empty/failed `getUserUiLayout` kept the cache; drag uploaded it via `saveUserUiLayout` to the caller principal. Two IIs with the same display name on one browser could copy HUD blobs. Distinct from spell-key 10-24-013 and from `uiLayout:""` full-replace (09-29-003). Hyphenated display names (`dark-lord`) must not be treated as principals.  
SYSTEMS_AFFECTED: DraggablePanel; ChallengePanel; userProfiles.uiLayout  
RECOMMENDED_ACTION: Helper `resolveUiLayoutStorageUserId` / `readUiLayoutCache` (copy-if-missing) / `shouldSaveLocalUiLayoutToBackend` (reconciled + live identity principal text, not a hyphen regex). Wire DraggablePanel / ChallengePanel on a later vehicle — those files overlap #429+ (getUserUiLayout share) so this stack stays helper-only.  
AUTONOMY: HELPER  
DEPENDENCIES: #429 (union DraggablePanel; do not overwrite)  
MIGRATION_REQUIREMENT: None (client migrate must be idempotent: copy-if-missing, then delete name key)  
REGRESSION_RISK: LOW for helper; HIGH if a hyphenated display name is treated as a principal  
VALIDATION_REQUIRED: Same display name, two principals → shouldSave false without hasIdentityPrincipal; hyphenated `dark-lord` alone cannot satisfy the save gate; copy-if-missing does not overwrite an existing principal cache.  
STATUS: NEW  

---

ACTION_ID: SDEG-2026-10-25-004  
SOURCE_AUTOMATION: Save/Data Evolution Guardian  
TITLE: Shrine count and covenant buff localStorage are write-only, name-keyed, and inherited on slot reuse  
CATEGORY: achievements / slot reuse / session  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: WX 11329–11354 writes `pbv_covenant_buff_${userId}_slotN` = `"3"` and increments `pbv_shrine_count_${userId}_slotN` on altar contact, outside Doka settle (11303–11327). Hydrate at 1373–1403. `covenantBuffMapsRef` has no combat readers. `shrineAchievementRef` is never passed to `checkAndFireAchievement`; defaultAchievements has no shrine condition (`admin.mo` 309–326). `deleteCharacter` / `useDeleteCharacter` do not clear these keys (main.mo 450–492; useCharacterQueries.ts 169–189). Keys use display-name `userId`. Distinct from version-gate keep-list (09-25-001) and from mapsVisited inherit (10-24-003). Character.covenantBuff / shrineCount stay optional unused (official never calls updateSessionState).  
SYSTEMS_AFFECTED: shrine/covenant localStorage; future shrine feat; slot reuse  
RECOMMENDED_ACTION: Helper landed. Clear keys on character delete (union with 10-24-003 helper — do not clone #1014). Do not add required Character shrine/covenant fields until a later chain file after 20260901. Do not wire shrineAchievementRef to a feat without that clear.  
AUTONOMY: HELPER  
DEPENDENCIES: #667 / #508 for delete-side union; do not edit WX this stack  
MIGRATION_REQUIREMENT: None for helper. YES if promoting optional Character session fields to required or to a feat SoT.  
REGRESSION_RISK: MEDIUM if a later feat reads the inherited counter  
VALIDATION_REQUIRED: Keys match `pbv_*_${userId}_slotN`; shrineCountIsWiredToAFeat false; delete+recreate must not keep 3 shrine visits once wired.  
STATUS: NEW  

---

ACTION_ID: SDEG-2026-10-25-005  
SOURCE_AUTOMATION: Save/Data Evolution Guardian  
TITLE: adminDeleteShopPackage hard-deletes; purchaseRecords keep packageId  
CATEGORY: rename / retired IDs / inventory  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: `adminDeleteShopPackage` is `shopPackages.remove` after a last-row floor (`main.mo` 1097–1110). No alias table, no purchaseRecords rewrite. `PurchaseRecord.packageId` is Text (`types/admin.mo` 206). `initiatePurchase` always `#err` (1154); official Buy Doka is GameKey. Character stores no package ids (`main.mo` 122–145). Distinct from enemy (10-24-014) and region/modifier (10-24-018) hard-delete. Yesterday's pending KYC row (09-02-004) can point at a deleted SKU.  
SYSTEMS_AFFECTED: shopPackages; purchaseRecords; future Character schema  
RECOMMENDED_ACTION: Helper landed. Retire-or-remap before hard-delete if packageId ever persists on a player record. Do not add required Character.packageId until a later chain file after 20260901. Do not re-enable 60s auto-complete.  
AUTONOMY: HELPER  
DEPENDENCIES: SDEG-2026-09-02-004 operational KYC backfill; do not edit main.mo this stack  
MIGRATION_REQUIREMENT: YES before any required Character catalog-id field (later file + alias map). No schema for this helper.  
REGRESSION_RISK: LOW today (ids not on Character); HIGH if a required field ships without aliases  
VALIDATION_REQUIRED: hard-delete true; Character stores no packageId; last package protected.  
STATUS: NEW  

---

ACTION_ID: SDEG-2026-10-25-006  
SOURCE_AUTOMATION: Save/Data Evolution Guardian  
TITLE: saveUserUiLayout on a missing profile creates an empty-name stub that ProfileSetup can wipe  
CATEGORY: persist-schema / stale-overwrite  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: `saveUserUiLayout` (`main.mo` 101–104) writes `{ name = ""; uiLayout = layout }` when `userProfiles` has no row. Official App mounts ProfileSetup before GameFlow, so HUD cannot hit this race today. A raw client (or a future HUD-before-setup) creates a nameless profile; `sendMessage` binds that stored name. ProfileSetup then `saveCallerUserProfile({ name, uiLayout: "" })` (`ProfileSetup.tsx` 45–52) full-replaces and wipes the stub layout (known 09-29-003). Distinct from 003 (display-name cache poison after a real profile exists).  
SYSTEMS_AFFECTED: userProfiles; saveUserUiLayout; ProfileSetup; chat playerName  
RECOMMENDED_ACTION: Helper `shouldMergeUiLayoutWhenCreatingProfile` keeps existing blob when incoming uiLayout is empty. Motoko merge needs main.mo later (forbidden this run). Keep official HUD after ProfileSetup.  
AUTONOMY: HELPER  
DEPENDENCIES: SDEG-2026-09-29-003; do not edit main.mo / App / ProfileSetup this stack  
MIGRATION_REQUIREMENT: None for helper. YES only if Candid/profile defaults change (later file after 20260901; empty name must remain valid for pre-feature).  
REGRESSION_RISK: LOW official order; MEDIUM if HUD mounts before setup  
VALIDATION_REQUIRED: Merge helper keeps stub layout on `uiLayout:""`; official ProfileSetup still precedes GameFlow.  
STATUS: NEW  

---

## Carry-forward (do not restack)

| ID | Notes |
| :--- | :--- |
| SDEG-001/002 | live `actor {`; GameKey on 20260901; new fields → later file only |
| #490 | BuffShop + maps/ground **keying** by principal |
| SDEG-2026-10-24-003 | mapsVisited / ground-doka wipe/inherit (keying half ⊂ #490) |
| SDEG-2026-10-24-013 / #1014 | display-name spell level/bar keys |
| SDEG-2026-10-24-017 / #1014 | legacy `pbv_active_spells` overwrite |
| SDEG-2026-09-29-003 | `saveCallerUserProfile` full-replace wipes uiLayout |
| SDEG-2026-09-25-001 / #508/#577 | feat/covenant/shrine version-gate keep-list |
