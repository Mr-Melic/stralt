# ACTION_IDs — 2026-10-28 Save / Data Evolution Guardian

Durable ledger for implementers and the Report Action Orchestrator.  
Source of every record: Save/Data Evolution Guardian.  
Audit: [`DATA_EVOLUTION_AUDIT_2026-10-28.md`](./DATA_EVOLUTION_AUDIT_2026-10-28.md).  
HEAD: `0f5363f`.  
Do not clone #362 / #388 / #400 / #408 / #429 / #466 / #490 / #508 / #577 / #828 / #893 / #1014 / #1083 / #1126 / #1171.  
Do not edit WorldExploration / main.mo / BuffShop / versionGate / deathPenalty / App / AchievementsPanel / combatMath / DraggablePanel / ChallengePanel / SpellbookModal / victoryAchievements this stack.

---

ACTION_ID: SDEG-2026-10-28-001  
SOURCE_AUTOMATION: Save/Data Evolution Guardian  
TITLE: APP_VERSION wipe drops HUD cache; first fold/drag can saveUserUiLayout a one-panel blob over a newer full layout  
CATEGORY: stale-client / HUD persist  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Canister SoT is `userProfiles.uiLayout` (`saveUserUiLayout` `main.mo` 91–109). Live cache is `pbv_panel_layout_${userId}` (`DraggablePanel.tsx` 23, 45–68, 80–86). HEAD `shouldPreserveVersionGateKey` (`versionGate.ts` 8–12) keeps only spawn/level-up/`*_inventory`; `App.tsx` 297–317 `localStorage.clear()` drops the HUD key. After wipe, mount keeps `defaultPosition` and does not save; `handleFoldToggle` / drag-end `scheduleSave` (779–783 / 707) writes one panel into `{}` then `saveLayoutToBackend` JSON.stringifies that cache (full replace, no schemaVersion, no merge with getUserUiLayout). A six-month layout on the principal is replaced by `{stats:{…}}`. Distinct from 10-25-003 (display-name poison while a cache exists) and 09-29-003 (ProfileSetup `uiLayout:""`). Sound (`pbv_sound_volume` / `pbv_sound_muted`) and chat (`aestralto-chat-width` / `aestralto-chat-channels`) are the same keep-list gap without a canister blob.  
SYSTEMS_AFFECTED: `userProfiles.uiLayout`; DraggablePanel; version-gate wipe; ChallengePanel local-only key  
RECOMMENDED_ACTION: Helper `shouldSaveLocalUiLayoutToBackend` + `mergeUiLayoutForBackendSave` (union unknown panel ids). OR HUD keys (and sound/chat) into `shouldPreserveVersionGateKey` on the #508 vehicle. Do not save until getUserUiLayout has hydrated. Do not add a required Character HUD field.  
AUTONOMY: HELPER  
DEPENDENCIES: #429 (union DraggablePanel; do not clone); #508 (union versionGate; do not edit this stack)  
MIGRATION_REQUIREMENT: None (client cache / keep-list; merge is idempotent). YES only if HUD schemaVersion becomes a required Character / profile field — later file after 20260901, default `""` / v1 empty panels.  
REGRESSION_RISK: LOW for helper; HIGH if a post-wipe fold still full-replaces the blob  
VALIDATION_REQUIRED: Backend blob with 3 panels + empty local + one fold → save skipped or merged to 3 panels; HEAD keep-list drops `pbv_panel_layout_alice`; intended keep predicate true.  
STATUS: NEW  

---

ACTION_ID: SDEG-2026-10-28-002  
SOURCE_AUTOMATION: Save/Data Evolution Guardian  
TITLE: Battle-challenge ids live only in DEFAULT_CHALLENGES; no ownership, discovery, or alias table  
CATEGORY: challenges / content-id-stability  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: `DEFAULT_CHALLENGES` (`challengeCompletion.ts` 44–109) is `easy_1`…`legendary_3`. No Motoko challenge map; Character stores no challenge ids (`main.mo` 122–145). Victory persist is anonymous `"Battle Challenge"` Doka/XP (`challengeRewards.ts`). Distinct from 10-24-012 (legendary **badges** never enter persist) and from SDEG-004 (spells at least have `spellLevelKeys`). Yesterday / six-month / pre-feature / pre-rename / retired-id cohorts all have nothing stored — rename cannot preserve ownership; retire cannot corrupt Character.  
SYSTEMS_AFFECTED: challenge catalog; recap rewards; future Character schema  
RECOMMENDED_ACTION: Helper landed. Do not add required `Character.challengeIds` until a later chain file after 20260901 with empty-array default, alias table, and idempotent replay. Keep rewards on applyRewards without requiring an id.  
AUTONOMY: HELPER  
DEPENDENCIES: None for helper; do not edit WX / ChallengePanel / main.mo this stack  
MIGRATION_REQUIREMENT: None for helper. YES before any required Character challenge-id field (later file + alias map).  
REGRESSION_RISK: LOW today (ids not on Character); HIGH if a required field ships without aliases  
VALIDATION_REQUIRED: Live DEFAULT_CHALLENGES ids match the locked list; Character stores no challenge id; rename/retire policy helpers false/false.  
STATUS: NEW  

---

ACTION_ID: SDEG-2026-10-28-003  
SOURCE_AUTOMATION: Save/Data Evolution Guardian  
TITLE: updateSessionState shrineCount > 100 is a silent max; local shrine counter is unbounded  
CATEGORY: unbounded-progression  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: `updateSessionState` (`main.mo` 3135–3143) `#err`s `shrineCount > 100` and `bloodBalance > 100`. Official UI never calls it (10-22-009: query default blood=50 for null). Live altar contact increments unbounded `pbv_shrine_count_${userId}_slotN` (WX 11347 — cite only). Distinct from 10-22-009 (blood **query** default) and 10-25-004 (write-only inherit / version-gate). Wiring that API as a shrine-feat SoT would freeze session writes for a six-month farmer at 101+ and would not load the local counter for a pre-feature null `shrineCount`.  
SYSTEMS_AFFECTED: `Character.shrineCount`; unused session API; future shrine feat  
RECOMMENDED_ACTION: Helper landed. If the method is ever wired: grandfather stored / local counts; do not reject official totals. Do not add a required shrine field until a later chain file after 20260901. Do not persist compounding combat HP.  
AUTONOMY: HELPER  
DEPENDENCIES: Do not edit main.mo / WX this stack; 10-25-004 shrine feat still needs delete-clear  
MIGRATION_REQUIREMENT: None for helper. YES if shrineCount becomes a required Character field or a feat SoT (later file, default 0, idempotent).  
REGRESSION_RISK: LOW while unused; HIGH if wired with the 100 reject still on  
VALIDATION_REQUIRED: HEAD reject 101; recommended policy accepts 101; official UI still does not call updateSessionState.  
STATUS: NEW  

---

## Carry-forward (do not restack)

| ID | Notes |
| :--- | :--- |
| SDEG-001/002 | live `actor {`; GameKey on 20260901; new fields → later file only |
| #490 | BuffShop + maps/ground **keying** by principal |
| SDEG-2026-10-24-003 | mapsVisited / ground-doka wipe/inherit (keying half ⊂ #490) |
| SDEG-2026-10-25-003 | display-name HUD poison — not the post-wipe one-panel replace |
| SDEG-2026-10-25-004 | shrine/covenant write-only inherit — not the 100 write cap |
| SDEG-2026-10-22-009 | getSessionState blood=50 — not shrineCount > 100 |
| SDEG-2026-10-24-012 | challenge **badges** — not catalog ids |
| SDEG-2026-10-26-002 / 10-27-003 | boss / rush / zone-lock version-wipe halves — union 001 keep-list into #508, do not clone |
| SDEG-004 | no ownedSpellIds; catalog ∪ starters library |
| #508 | unpaid-death version-gate keep; union 001 into that file |
| #429 | DraggablePanel getUserUiLayout share; union 001 save gate |
| #1171 | 10-27 helpers; do not clone |
