# ACTION_IDs — 2026-10-23 Save / Data Evolution Guardian

Durable ledger for implementers and the Report Action Orchestrator.  
Source of every record: Save/Data Evolution Guardian.  
Audit: [`DATA_EVOLUTION_AUDIT_2026-10-23.md`](./DATA_EVOLUTION_AUDIT_2026-10-23.md).  
Prior open-PR ledgers: `ACTION_IDS_SDEG_2026-10-22.md` (#893), `ACTION_IDS_SDEG_2026-10-21.md` (#828).  
HEAD: `0f5363f`. Do not clone #362 / #385 / #386 / #388 / #400 / #408 / #437 / #466 / #490 / #508 / #577 / #622 / #667 / #731 / #778 / #803 / #828 / #893.

---

## Closed / landed since 2026-10-22 (source)

No persist-schema landings on `origin/main` (HEAD unchanged). This run adds lock helpers only.

---

## Carry-forward (still OPEN)

Full records live in `ACTION_IDS_SDEG_2026-10-22.md` (#893) and older dated ledgers. Still true on HEAD `0f5363f`:

SDEG-2026-08-31-001, 002, 003, 004, 005, 006, 007, 008, 011  
SDEG-2026-09-01-004  
SDEG-2026-09-02-001, 004, 005, 006  
SDEG-2026-09-25-001  
SDEG-2026-09-26-001, 002  
SDEG-2026-09-27-001, 002, 003  
SDEG-2026-09-28-001, 002  
SDEG-2026-09-29-001, 002, 003  
SDEG-2026-10-21-001, 002, 003, 004  
SDEG-2026-10-22-001, 002, 003, 004, 005, 006, 007, 008, 009, 010  

Do not re-implement. Union after the listed vehicles.

---

## New this run

ACTION_ID: SDEG-2026-10-23-001  
SOURCE_AUTOMATION: Save/Data Evolution Guardian  
TITLE: WorldExploration must hydrate LevelUpConfig from the canister, not a kept localStorage blob  
CATEGORY: stale-client  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: WX `levelUpConfig` `useMemo([])` (`WorldExploration.tsx` 2307–2314) only reads `pbv_levelup_config`. Mount sync (899–955) fetches tier spawn / palette / boss rush — not `getLevelUpConfig`. `shouldPreserveVersionGateKey` keeps that blob (`versionGate.ts` 9–10). HUD max HP (3400–3405), fail chance (3646–3649), and range use it. `saveBattleStats` persist caps use canister `levelUpConfig` (`main.mo` 2035–2053). AdminDashboard itself says WX does not call `getLevelUpConfig` (4454–4456). Helper: `levelUpConfigWxHydrate.ts`.  
SYSTEMS_AFFECTED: WX; `pbv_levelup_config`; `persistHpWriteCap`; spell fail/range  
RECOMMENDED_ACTION: Call `getLevelUpConfig` on WX mount (same effect as tier spawn). Prefer canister over the kept blob. Do not edit WX while combat PRs queue. A player created yesterday with DEFAULT 5% and an admin who later sets 10% currently sees HUD 5% while persist allows 10%.  
AUTONOMY: HUMAN  
DEPENDENCIES: None to land the fetch; do not touch WorldExploration until older WX PRs merge  
MIGRATION_REQUIREMENT: None (query + cache). Optional `schemaVersion` on the blob.  
REGRESSION_RISK: MEDIUM if a missing fetch falls back to zeros instead of DEFAULT  
VALIDATION_REQUIRED: Admin sets statGrowthPercent 10; a yesterday character’s HUD max HP and persistHpWriteCap both use 10 after reload without opening Admin.  
STATUS: NEW  

---

ACTION_ID: SDEG-2026-10-23-002  
SOURCE_AUTOMATION: Save/Data Evolution Guardian  
TITLE: Alias apMpGrowthEveryNLevels onto apMpLevelThreshold; never persist compounding HP  
CATEGORY: unbounded-progression  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Frontend `LevelUpConfig` uses `apMpGrowthEveryNLevels` (`gameTypes.ts` 410, 419). Canister / bindgen use `apMpLevelThreshold` (`admin.mo` types; `backend.ts` 182). Admin write aliases (`adminContract.ts` 367–370). WX `{ ...DEFAULT, ...JSON.parse(raw) }` keeps DEFAULT 25 when the blob only has the canister name. Battle AP/MP init calls `getPlayerBaseStats(level, levelUpConfig)` (WX 9361, 12105, 14342). Persist AP cap uses canister threshold and `MAX_PERSISTED_AP=20`. `getPlayerBaseStats` HP is compounding `100*(1.05)^(level-1)` (`progression.ts` 74–79); persist is linear `100+(level-1)*growth` (`adminGuard.mo` 631–635). Compounding exceeds linear from L20 at 5% (`compoundingHpWouldClipOnPersist`). Helper: `levelUpConfigWxHydrate.ts`.  
SYSTEMS_AFFECTED: WX battle AP/MP; `saveBattleStats` HP/AP; `getPlayerBaseStats`  
RECOMMENDED_ACTION: Read AP cadence from `apMpLevelThreshold ?? apMpGrowthEveryNLevels`. Document persist HP as linear. Do not write `getPlayerBaseStats().hp` through `saveBattleStats`. Do not raise the AP/MP persist cap here (09-29-001).  
AUTONOMY: HUMAN  
DEPENDENCIES: SDEG-2026-10-23-001; SDEG-2026-09-29-001  
MIGRATION_REQUIREMENT: None if read-path alias only. YES if stored HP must be rewritten to compounding.  
REGRESSION_RISK: HIGH if compounding becomes the persist writer (L20+ HP clips or inflates)  
VALIDATION_REQUIRED: Admin threshold 1 → battle AP uses 1 (until persist cap 20); L20 persist HP stays 195 at 5%, not round(100*1.05^19).  
STATUS: NEW  

---

ACTION_ID: SDEG-2026-10-23-003  
SOURCE_AUTOMATION: Save/Data Evolution Guardian  
TITLE: Serialize getTierSpawnConfig without bigint before writing pbv_tier_spawn_config  
CATEGORY: stale-client  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Bindgen `TierSpawnConfig.tierSize` is `bigint` (`backend.ts` 111–116). WX `JSON.stringify(tierCfg)` (`WorldExploration.tsx` 908–910) throws `TypeError` on bigint; catch uses localStorage fallback (932–933). `versionGate` keeps `pbv_tier_spawn_config`. `combatMath.loadTierConfig` (23–31) then drives `pickEnemyLevelFromTiers`. Helper: `tierSpawnConfigLocalCache.ts` (`serializeTierSpawnConfigForLocalCache`).  
SYSTEMS_AFFECTED: WX config sync; `combatMath.ts`; encounter levels  
RECOMMENDED_ACTION: Write `serializeTierSpawnConfigForLocalCache(tierCfg)` (numbers + `schemaVersion`). Ignore blobs without a known version or merge onto DEFAULT. Do not edit WX/combatMath while #780 and WX PRs queue.  
AUTONOMY: AGENT (helper landed); HUMAN to wire WX  
DEPENDENCIES: #780 (combatMath overlap); WX queue  
MIGRATION_REQUIREMENT: One-shot: Number() the kept blob; do not drop it (spawn formula)  
REGRESSION_RISK: MEDIUM if a failed parse falls back to a harder spawn table  
VALIDATION_REQUIRED: `JSON.stringify(rawBindgen)` throws; serializer round-trips; after APP_VERSION bump, loadTierConfig matches canister percents.  
STATUS: NEW  

---

ACTION_ID: SDEG-2026-10-23-004  
SOURCE_AUTOMATION: Save/Data Evolution Guardian  
TITLE: Do not wire saveActiveSpells Nat indexes; empty spellLevelKeys must not drop Text bar ids  
CATEGORY: spell-discovery  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `Character.activeSpells : ?[Nat]` (`main.mo` 140) vs `spellBarOrder : ?[Text]` (142). `saveActiveSpells` (3172–3206) stores `[Nat]` with no catalog lookup. WX comments that official saveActiveSpells was removed because the load effect never reads it (2824–2834). `setSpellBarOrder` filters to `spellLevelKeys` (1945–1947). Create clears keys (`_starterCharacter` 225–226). Empty keys → persisted bar `[]`; other device re-derives from the **current** usable catalog, not the player’s last arrangement. Catalog reorder would remap a Nat loadout. Helper: `activeSpellsNatLoadout.ts`. Distinct from SDEG-004 (owned vs catalog-all) and 10-22-003 (localStorage spell **levels**).  
SYSTEMS_AFFECTED: `saveActiveSpells`; `setSpellBarOrder`; spell discovery  
RECOMMENDED_ACTION: Leave `saveActiveSpells` unwired. Treat `spellBarOrder` Text ids as the only loadout. When keys are empty, persist the starter Text ids (or skip the filter for known starters) so a six-month-old empty-keys character keeps the same bar across devices. Do not add required `ownedSpellIds` until SDEG-001.  
AUTONOMY: HUMAN  
DEPENDENCIES: SDEG-2026-08-31-004; do not edit main.mo / WX while persist/combat PRs queue  
MIGRATION_REQUIREMENT: None if unwind remains; YES (optional Text field already exists) if empty-keys persist starters  
REGRESSION_RISK: HIGH if Nat indexes are wired; MEDIUM if the filter is removed without an ownership set (bar can store unowned ids)  
VALIDATION_REQUIRED: Official play never calls saveActiveSpells; empty-keys setSpellBarOrder of starters either stores those ids or documents the catalog re-derive; fixture Nat [0,1] is not treated as spell ids.  
STATUS: NEW  

---

ACTION_ID: SDEG-2026-10-23-005  
SOURCE_AUTOMATION: Save/Data Evolution Guardian  
TITLE: pickEnemyLevelFromTiers must not silently assume player level ≤ 999  
CATEGORY: unbounded-progression  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `pickEnemyLevelFromTiers` `maxTier = Math.floor(999 / ts)` (`combatMath.ts` 58, 66–68, 94–96). Player level is Motoko Nat with no stored max (`applyRewards` 2126–2138). Admin enemy/region drafts default `levelMax` 9999 (`AdminDashboard.tsx` 138). A player at 1000+ (leftover curve, six months of play) gets encounters as if they were 999. Helper: `unboundedEncounterLevelCap.ts`. Do not edit combatMath (#780).  
SYSTEMS_AFFECTED: encounter scaling; long-horizon characters  
RECOMMENDED_ACTION: Derive maxTier from the player’s actual tier (`floor((level-1)/ts)` plus the existing ±6 spread), or document 999 as a content cap and surface it. Do not add a persisted max player level.  
AUTONOMY: HUMAN  
DEPENDENCIES: #780 (combatMath)  
MIGRATION_REQUIREMENT: None  
REGRESSION_RISK: MEDIUM if uncapping spawn instantly places L50k enemies using Float HP (`getEnemyHPForLevel`)  
VALIDATION_REQUIRED: L1000 pickEnemyLevelFromTiers can return > 999; L1 still cannot roll 999.  
STATUS: NEW  

---

ACTION_ID: SDEG-2026-10-23-006  
SOURCE_AUTOMATION: Save/Data Evolution Guardian  
TITLE: Region eligibility must not drop battleEffects for players above every levelMax  
CATEGORY: unbounded-progression  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: WX `_currentRegionEffects` (`WorldExploration.tsx` 3699–3706) takes the first region with `level >= Number(levelMin) && level <= Number(levelMax)`. No match → `[]`. Admin default max is 9999; encounter math caps at 999. A player created before a region table that tops out at 100 loses region effects at 101 without corrupting the Character. Helper: `unboundedEncounterLevelCap.ts`.  
SYSTEMS_AFFECTED: region battleEffects; high-level overworld  
RECOMMENDED_ACTION: Fall back to the highest `levelMax` band (or an explicit overflow region id). Do not Number() bigint maxes on the persist path. Keep region ids stable; do not rename.  
AUTONOMY: HUMAN  
DEPENDENCIES: Do not edit WorldExploration while combat PRs queue  
MIGRATION_REQUIREMENT: None if fallback is read-path; YES (optional) for an overflow region row  
REGRESSION_RISK: LOW (effects-only); MEDIUM if overflow uses a harsher table than intended  
VALIDATION_REQUIRED: Fixture regions 1–30 and 31–100; L101 still resolves a band; Character record unchanged.  
STATUS: NEW  
