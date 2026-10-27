# ACTION_IDs — 2026-10-27 Save / Data Evolution Guardian

Durable ledger for implementers and the Report Action Orchestrator.  
Source of every record: Save/Data Evolution Guardian.  
Audit: [`DATA_EVOLUTION_AUDIT_2026-10-27.md`](./DATA_EVOLUTION_AUDIT_2026-10-27.md).  
HEAD: `0f5363f`.  
Do not clone #362 / #388 / #400 / #408 / #466 / #490 / #508 / #577 / #828 / #893 / #1014 / #1083 / #1126.  
Do not edit WorldExploration / main.mo / BuffShop / versionGate / deathPenalty / App / AchievementsPanel / combatMath / DraggablePanel / ChallengePanel / SpellbookModal / victoryAchievements this stack.

---

ACTION_ID: SDEG-2026-10-27-001  
SOURCE_AUTOMATION: Save/Data Evolution Guardian  
TITLE: spell_master_8 unlocks from empty-bar placeholder length and catalog-padded hydrate  
CATEGORY: achievements / spell-discovery  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Idle check `WorldExploration.tsx` 3635–3636 is `activeSpells.length >= 8`. `activeSpells` 2746–2763: empty `activeSpellIds` returns `Array(8).fill(null)` (length 8, no ids). Load effect 2554–2563 keeps saved ids then **appends** every other `ownedSpells` id (catalog ∪ starters via `shouldIncludeBackendSpellInLibrary`) and `slice(0, 8)`. Empty `spellBarOrder` path 2615 derives `ownedSpells.slice(0, 8)`. Victory snapshot 12487 / 12906 passes that length into `clientTrustedVictoryAchievementConditions` (`victoryAchievements.ts` 34). Feat copy is “Have 8 spells equipped at once.” (`admin.mo` 322). Distinct from SDEG-004 (library membership) and 10-23-004 (empty keys dropping Text bar on `setSpellBarOrder`).  
SYSTEMS_AFFECTED: spell-bar hydrate; `spell_master` / `spell_master_8`; `markAchievementUnlocked`; `claimAchievementReward` 100 Doka  
RECOMMENDED_ACTION: Helper `equippedSpellBarCount` + `resolveHydratedSpellBarIds` (no catalog pad). Wire WX idle/victory to count non-empty ids only. Do not add a required Character equipped-count field until a later chain file after 20260901.  
AUTONOMY: HELPER  
DEPENDENCIES: None for helper; WX / victoryAchievements vehicles for lock; do not clone #1126 / #1014  
MIGRATION_REQUIREMENT: None (client occupancy). YES only if equipped ids become a required Character field (later file after 20260901, empty-array default, idempotent).  
REGRESSION_RISK: LOW for helper; HIGH if hydrate padding still mints Spell Master Doka  
VALIDATION_REQUIRED: Eight nulls → count 0, feat false; saved 2 ids → stay 2, feat false; 8 real ids → feat true.  
STATUS: NEW  

---

ACTION_ID: SDEG-2026-10-27-002  
SOURCE_AUTOMATION: Save/Data Evolution Guardian  
TITLE: Empty-only catalog seeds never backfill new default ids on a live canister  
CATEGORY: configuration references / entity IDs  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `main.mo` seeds only when vacant: `spellConfigs` 677–681, `mapModifierConfigs` 705–709, `shopPackages` 1075–1079, `achievementConfigs` 1126–1127, `bossConfigs` 2963–2967, `changelogs` 2198. `initDefaultNames` 2708–2718 already upserts missing enemy names (“Does NOT use the flag guard so new names are always seeded on upgraded canisters”). A 16th `defaultAchievements()` row therefore exists for a fresh import and is absent for every already-seeded Caffeine canister. Distinct from hard-delete of a live id (10-24-014 / 10-25-005) and from OLD_SPELL_IDS purge (SDEG-003).  
SYSTEMS_AFFECTED: `defaultAchievements` / `defaultSpells` / `defaultShopPackages` / `defaultBossConfigs` / `defaultMapModifiers`; admin catalogs; Feats / shop / spell library on old canisters  
RECOMMENDED_ACTION: Helper `missingDefaultCatalogIds` + `upsertMissingDefaultCatalogRecords` (insert-missing only, never overwrite admin edits). Wire `main.mo` later as the enemyNames upsert. Do not restuff shipped NewActor. Do not wipe player maps.  
AUTONOMY: HELPER  
DEPENDENCIES: None for helper; main.mo vehicle for lock; SDEG-001/002 if a new required catalog map is added  
MIGRATION_REQUIREMENT: None for helper. When wired: insert-missing only, idempotent, must not replay as a destructive catalog replace. New required maps still need a later chain file after 20260901.  
REGRESSION_RISK: LOW for helper; HIGH if a later wire overwrites admin-edited rows or re-adds purged OLD_SPELL_IDS  
VALIDATION_REQUIRED: Populated map + new default id → one insert; second pass no-op; existing row with a different reward stays.  
STATUS: NEW  

---

ACTION_ID: SDEG-2026-10-27-003  
SOURCE_AUTOMATION: Save/Data Evolution Guardian  
TITLE: Zone lock is a browser-global localStorage flag dropped by APP_VERSION wipe  
CATEGORY: configuration references / stale-client  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: WX 1140 and 17683 read/write `aestralto_zone_locked` with no principal or slot. Official Zone Tier button is player-facing (17600–17624). HEAD `shouldPreserveVersionGateKey` (`versionGate.ts` 8–12) keeps only spawn/level-up/`*_inventory`; `App.tsx` 297–317 `localStorage.clear()` then restores that keep-list. Distinct from 10-26-002 (boss / rush blobs) and 09-25-001 (unpaid-death / feat / shrine / covenant).  
SYSTEMS_AFFECTED: version-gate wipe; zone-tier lock; next-map tier  
RECOMMENDED_ACTION: Helper landed. Key by principal+slot; OR the HEAD key (and the namespaced key) into `shouldPreserveVersionGateKey` on the #508 vehicle (union; do not overwrite). Do not make zone lock a required Character field.  
AUTONOMY: HELPER  
DEPENDENCIES: #508 (union versionGate.ts; do not clone; do not edit versionGate this stack)  
MIGRATION_REQUIREMENT: None (browser cache policy; idempotent keep). YES if lock becomes a required Character / session field — later file after 20260901, default false.  
REGRESSION_RISK: LOW for helper; MEDIUM if keep restores another principal’s lock on a shared browser without namespacing  
VALIDATION_REQUIRED: HEAD keep-list drops `aestralto_zone_locked`; intended keep predicate true; slot reuse must not inherit.  
STATUS: NEW  

---

## Carry-forward (do not restack)

| ID | Notes |
| :--- | :--- |
| SDEG-001/002 | live `actor {`; GameKey on 20260901; new fields → later file only |
| #490 | BuffShop + maps/ground **keying** by principal |
| SDEG-2026-10-24-003 | mapsVisited / ground-doka wipe/inherit (keying half ⊂ #490) |
| SDEG-2026-10-26-001 | explore_25_maps portal counter — not Spell Master occupancy |
| SDEG-2026-10-26-002 | boss / rush version-wipe half — union 003 into #508, do not clone |
| SDEG-2026-10-23-004 | empty keys drop Text bar — not idle length / catalog pad |
| SDEG-004 | no ownedSpellIds; catalog ∪ starters library |
| #508 | unpaid-death version-gate keep; union 003 into that file |
