# ACTION_IDs — 2026-08-31 Spell, Discovery & Achievement Admin Designer

Durable ledger for implementers and the Report Action Orchestrator.  
Source of every record: Spell, Discovery & Achievement Admin Designer.  
Design contract: [`SPELL_ADMIN_DESIGN_2026-08-31.md`](./SPELL_ADMIN_DESIGN_2026-08-31.md).  
Do not implement gameplay from this file unless a later human or orchestrator explicitly picks an ID. This run ships **docs only**.

---

ACTION_ID: SDA-2026-08-31-001  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Unify SpellDefinition so Admin save round-trips combat metadata  
CATEGORY: spell-contract  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Motoko `SpellConfig` (`src/backend/types/admin.mo` 79–110) and bindgen (`src/frontend/src/backend.ts` 115–145, `to_candid_record_n16` 4050–4141) omit `targetType`, summon block, buff/debuff/DoT, and mechanic flags. Engine reads those fields (`src/frontend/src/engine/spellEngine.ts` 6–13; `types/gameTypes.ts` 160–231). `adminSetSpellConfig` therefore strips them. `defaultSpells()` (`src/backend/lib/admin.mo` 168–191) already literals `isSummon` / `summonUnitDef` that are not on the persist type. Admin `SpellEditor` (`AdminDashboard.tsx` 2146–3178) has **zero** `cooldown` and `targetType` fields; `newSpell()` (57–99) omits both.  
SYSTEMS_AFFECTED: `src/backend/types/admin.mo`; `src/backend/lib/admin.mo`; `src/backend/main.mo` `adminSetSpellConfig`; bindgen `src/frontend/src/backend.ts`; `types/gameTypes.ts`; `AdminDashboard.tsx` SpellEditor; `engine/spellEngine.ts`; `engine/targeting.ts`  
RECOMMENDED_ACTION: Extend the persisted record to the SpellDefinition in the design doc (identity, cost, targeting including required `targetType`, effects list, duration, scaling, statuses, summons, acquisition). Keep a compatibility projection so current engine readers still work. Add the missing editor fields. Reject activate when required metadata is absent. Never key effects off `spell.name`.  
AUTONOMY: HUMAN_APPROVE — Motoko type change needs a canister upgrade; a live actor that lags source will reject new-field saves (same class as the 15-field vs 12-field CharacterStats lesson).  
DEPENDENCIES: None  
REGRESSION_RISK: HIGH — every `adminSetSpellConfig` / `getSpellConfigs` call and every combat read of SpellConfig. Must ship frontend + actor together.  
VALIDATION_REQUIRED: Save a summon + a LoS/minRange spell from Admin, refetch, and confirm `targetType`, `cooldown`, and `summonUnitDef` survive. `pnpm typecheck` + `caffeine check`. Cast preview still uses metadata only.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-08-31-002  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Split catalog from ownership; persist owned and observed spell ids  
CATEGORY: ownership-persist  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: `ownedSpells` is `starterSpells ∪ filteredBackendSpells` (`WorldExploration.tsx` 2242–2272). Any id that survives `OLD_SPELL_NAMES_SET` is treated as owned. There is no `ownedSpellIds` / `observedSpellIds` store. Character persist has `spellLevelKeys` / `spellLevelValues` (written only by `upgradeSpell`) and `spellBarOrder`. `ARCHITECTURE.md` lists config maps as catalog, not ownership. Adding a spell in Admin therefore grants it to every player on next hydrate.  
SYSTEMS_AFFECTED: `src/backend/main.mo` character / new maps; `WorldExploration.tsx` ownedSpells; `SpellbookModal.tsx`; `setSpellBarOrder`; create-character seed  
RECOMMENDED_ACTION: Add caller-scoped `ownedSpellIds` and `observedSpellIds`. Catalog `getSpellConfigs` stays public and does **not** imply ownership. Seed create with `SYSTEM_ONLY` / `isBaseSpell` ids that exist in the catalog. Migrate existing characters from `spellLevelKeys ∪ spellBarOrder` plus base ids — **not** from the full catalog. Spellbook `allSpells` reads owned ids only.  
AUTONOMY: HUMAN_APPROVE — persist-lock and character-record shape.  
DEPENDENCIES: SDA-2026-08-31-001 (need stable ids); SDA-2026-08-31-007 (starters must exist on canister or upgrade/own will fail)  
REGRESSION_RISK: HIGH — players could lose the bar if migrate under-seeds; over-seed reintroduces “everyone owns everything”.  
VALIDATION_REQUIRED: New character owns only base ids. Admin adding a catalog spell does not change another account’s spellbook until a grant writer runs. Reload keeps owned set (backend wins over localStorage).  
STATUS: NEW  

---

ACTION_ID: SDA-2026-08-31-003  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Add acquisition routes and OBSERVATION / VICTORY / LEARNABLE flags  
CATEGORY: acquisition-model  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: `usableByPlayer` / `usableByEnemy` are the only gates (`admin.mo` 104–105; Admin checkboxes 2389–2441). They are cast flags, not learn routes. Achievements reward Doka only (`AchievementConfig` `admin.mo` 206–213). Challenges reward Doka/XP/badge (`challengeCompletion.ts` 38–103). Boss `spellPoolIds` are AI kits, not player grants. No `ENEMY_DISCOVERY` / `ACHIEVEMENT` / `CHALLENGE` / `BOSS` / `ELITE` / `SPECIAL_ENCOUNTER` / `MULTI_SOURCE` / `ENEMY_ONLY` / `BOSS_ONLY` / `SYSTEM_ONLY` field exists.  
SYSTEMS_AFFECTED: SpellDefinition; Admin editor Acquisition section; future grant writers  
RECOMMENDED_ACTION: Persist the closed route enum and the three flags (`OBSERVATION_REQUIRED`, `VICTORY_REQUIRED`, `PLAYER_LEARNABLE`) with the defaults in the design doc. `usableBy*` stay cast-only. Admin must show both “who can cast” and “how a player learns”. Validator rejects `PLAYER_LEARNABLE = true` on `ENEMY_ONLY` / `BOSS_ONLY`.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: SDA-2026-08-31-001  
REGRESSION_RISK: MEDIUM — flags default wrong would either lock starters or leak boss signatures.  
VALIDATION_REQUIRED: Fixture matrix: each route × flag combo; SYSTEM_ONLY base still owned at create; ENEMY_ONLY never enters ownedSpellIds.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-08-31-004  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Implement enemy-discovery default (cast → observe → win → unlock)  
CATEGORY: discovery-pipeline  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: No `recordSpellObservation` / `commitSpellDiscoveries` API. Quality audit already marked spell-discovery pacing `NO_MEASURABLE_EFFECT` (`QUALITY_AUDIT_2026-08-30.md` outcome table). Combat already has `assignedSpells` and cast logs (`enemyAI.ts` 941, 1527) so “enemy actually used the spell” is observable at the engine boundary without name matching. Victory already funnels through `applyRewards` + root recap.  
SYSTEMS_AFFECTED: `engine/enemyAI.ts` / `spellEngine.ts` (observe hook only); persist lock; `main.mo`; `PostBattleRecap`; `WorldExploration.tsx` victory path (call-site only)  
RECOMMENDED_ACTION: On successful enemy cast of an eligible id, enqueue `recordSpellObservation(slot, spellId, encounterId)`. On victory persist, `commitSpellDiscoveries` grants observed eligible ids. Same-encounter victory is the default; `allowLaterVictory` is opt-in. Show unlocks on the existing recap. Do not call `updateCharacter` or per-kill grant. Hostile summons may generate observations; player-side summons must not.  
AUTONOMY: HUMAN_APPROVE — touches victory persist; extract helpers, do not grow WorldExploration.  
DEPENDENCIES: SDA-2026-08-31-002; SDA-2026-08-31-003  
REGRESSION_RISK: HIGH if granted off the persist lock or twice (observe + victory). MEDIUM if observation fires on preview/AI-consider rather than a real cast.  
VALIDATION_REQUIRED: Tests: assigned-but-not-cast does not observe; cast then flee keeps observation without unlock; cast then win unlocks once; already-owned is idempotent; ENEMY_ONLY never unlocks. Recap shows the id.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-08-31-005  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Soft-retire with dependency-safe delete and legacy owned behaviour  
CATEGORY: dependency-safety  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: `adminDeleteSpellConfig` is `spellConfigs.remove(id)` (`main.mo` 622–627). Admin UI is a single red `×` with no confirm (`AdminDashboard.tsx` 3338–3345, 5217–5221). Same pattern for enemies and achievements (`adminDeleteEnemyConfig`, `adminDeleteAchievementConfig`). `upgradeSpell` then returns `#err("Spell not found")` (684–688). `setSpellBarOrder` drops ids missing from `spellLevelKeys` (1233–1242). Boss seeds still reference purged ids (`admin.mo` 358–451 vs `main.mo` 477–487).  
SYSTEMS_AFFECTED: `main.mo` admin delete/set; Admin lists; `upgradeSpell`; `setSpellBarOrder`; achievement/enemy delete; Spellbook retired seal  
RECOMMENDED_ACTION: Lifecycle `draft | active | inactive | retired`. Hard delete only drafts with zero published revisions and zero character refs; otherwise return `#err` plus a dependency report. Retire must not strip `ownedSpellIds`, levels, or bar slots. Owned retired spells remain castable and upgradeable; new unlocks stop. Achievements already granted stay; new grants skip a retired spell id and still pay Doka. Live kits ignore retired ids at resolve time.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: SDA-2026-08-31-002; SDA-2026-08-31-013 (bar filter)  
REGRESSION_RISK: HIGH if retire wipes levels or if delete stays hard.  
VALIDATION_REQUIRED: Retire a spell that is on a bar and in a boss pool: owner still casts/upgrades; new character cannot learn; boss resolve skips the id; delete returns err.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-08-31-006  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Replace name heuristics with id tombstones and explicit summonAI  
CATEGORY: no-heuristics  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: `OLD_SPELL_NAMES_SET` filters catalog by **name and id** (`WorldExploration.tsx` 2203–2239). `summonSpawn.ts` 149 sets unit name via `spell.name.replace("Summon ", "")`. `inferSummonArchetype` (`enemyAI.ts` 196–217) falls back to `summon.name` containing wolf/golem/wisp/archer/bomber. Architecture already states `spell.name` is UI/log only (`docs/ARCHITECTURE.md` 356).  
SYSTEMS_AFFECTED: `WorldExploration.tsx` catalog filter; `engine/summonSpawn.ts`; `engine/enemyAI.ts` inferSummonArchetype; Admin summon editor  
RECOMMENDED_ACTION: Tombstone retired ids as an id list (data), not a name set. Require `summonAI` and `displayName` on every summon def. Remove the name fallback; empty `summonAI` is a validation error. Do not add new `includes(spell.name)` branches.  
AUTONOMY: IMPLEMENT_AFTER_HUMAN — mechanical once defs have the fields (depends on 001).  
DEPENDENCIES: SDA-2026-08-31-001  
REGRESSION_RISK: MEDIUM — a summon missing `summonAI` would fall through to hunter today; after this it must fail validation before activate.  
VALIDATION_REQUIRED: Filter tests use ids only. Summon with `summonAI = healer` and name “Orb” still heals. Rename “Summon Dire Wolf” does not change the unit displayName.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-08-31-007  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Seed frontend starter ids into the canister catalog  
CATEGORY: catalog-sync  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Live combat/spellbook ids live in `spellData.ts` (`physical_attack`, `starter-shield`, `starter-poison`, `spell-swap`, `summon-dire-wolf`, …). Canister seed is a different six (`shadow_strike` … `void_collapse`, `admin.mo` 168–191). `upgradeSpell` requires `spellConfigs.get(spellId)` (`main.mo` 684–688), so upgrading Strike or a summon fails “Spell not found”. `physical_attack` is also in the **purge** list (`main.mo` 478–483), so even a later seed would be deleted on start.  
SYSTEMS_AFFECTED: `AdminLib.defaultSpells`; `main.mo` OLD_SPELL_IDS purge; `upgradeSpell`; Spellbook costs  
RECOMMENDED_ACTION: Insert every player-facing starter/unique/summon id into `spellConfigs` with complete metadata. Remove `physical_attack` from the purge list (purge remains for truly dead ids: `fireball`, `blood_nova`, …). Do not treat seed insertion as unlocking for existing players — ownership still follows 002.  
AUTONOMY: HUMAN_APPROVE — purge-list edit is irreversible on canister start.  
DEPENDENCIES: SDA-2026-08-31-001  
REGRESSION_RISK: HIGH if purge still drops `physical_attack` after seed. MEDIUM if seed is copied without `targetType`.  
VALIDATION_REQUIRED: `upgradeSpell("physical_attack")` and `upgradeSpell("summon-dire-wolf")` return `#ok`. Purge still removes `fireball`.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-08-31-008  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Admin-authored enemy pools CORE / ADVANCED / RARE / ELITE / SIGNATURE  
CATEGORY: enemy-pools  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `ENEMY_KITS` is a hardcoded `Record<ChessPieceType, …>` (`enemyAI.ts` 156–193). Admin `EnemyConfig` has no spell fields (`admin.mo` 15–26). Battle start comments “10 random spells” then calls `buildEnemyKit` and may append wolf/archer by hardcoded id (`WorldExploration.tsx` 12181–12208).  
SYSTEMS_AFFECTED: new `enemyKits` store; Admin Kits tab; `buildEnemyKit` / WX assign call site; summoner bonus  
RECOMMENDED_ACTION: Persist `EnemyKit` as in the design doc. `resolveEnemyKit(enemyId, levelZone, tags)` replaces piece-type hardcoding. Chess piece may supply a **template** when creating a new enemy. Summoner extras become `bonusSummonSpellIds`. Pools are id lists only.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: SDA-2026-08-31-001; SDA-2026-08-31-006  
REGRESSION_RISK: MEDIUM — kit empty-resolve must fall back to `physical_attack` (or kit-defined melee id) so enemies are never unarmed.  
VALIDATION_REQUIRED: Zone 0 pawn kit matches today’s ids; zone ≥1 adds the advanced id; rare/signature only when tagged; missing id is skipped and logged, not a crash.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-08-31-009  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Repair boss spellPoolIds that still point at purged spells  
CATEGORY: boss-kits  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `defaultBossConfigs()` (`admin.mo` 350+) lists `fireball`, `cursed_gust`, `entangle`, `mist_form`, `blood_nova`, `obliterate`, `poison_dart`, `ice_shard`, `meteor_strike`, `plague_wave`, `inferno` (old id), `frost_nova` (old id). `main.mo` 477–487 removes those ids from `spellConfigs` on every start. Boss editor chips (`AdminDashboard.tsx` 6810–1833) cannot show unresolved.  
SYSTEMS_AFFECTED: `AdminLib.defaultBossConfigs`; Boss editor; boss AI resolve  
RECOMMENDED_ACTION: Retarget each phase pool to live ids (or newly seeded starters from 007) by **id**. Validator marks unresolved chips crimson. Do not “fix” by matching names.  
AUTONOMY: HUMAN_APPROVE — changes boss encounter identity.  
DEPENDENCIES: SDA-2026-08-31-007  
REGRESSION_RISK: MEDIUM — a boss with an empty resolved pool becomes melee-only.  
VALIDATION_REQUIRED: Every seeded `spellPoolIds` entry exists in `spellConfigs` and is `usableByEnemy`. Admin chip list shows broken vs live.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-08-31-010  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Let achievements and challenges grant spells via explicit ids  
CATEGORY: feat-challenge-rewards  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `AchievementConfig` has only `dokaReward` (`admin.mo` 206–213). `markAchievementUnlocked` / `claimAchievementReward` (`main.mo` 1616–1674) do not write spells. `DEFAULT_CHALLENGES` rewards are `{ doka, xp, badge }` (`challengeCompletion.ts` 38–103); `challengeRewards.ts` persists numbers only. Conditions are client string keys (`WorldExploration.tsx` 2071–2074).  
SYSTEMS_AFFECTED: `AchievementConfig`; Admin AchievementEditor; `markAchievementUnlocked`; challenge persist helpers; recap  
RECOMMENDED_ACTION: Add `spellRewardIds: [Text]` to achievements and `rewards.spellIds` to challenges. Grant on unlock (achievement) or on challenge persist (same lock as XP/Doka). Skip retired ids (legacy rule in 005). Do not infer the reward spell from the achievement name. Keep `getPlayerAchievements(identity.getPrincipal())`.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: SDA-2026-08-31-002; SDA-2026-08-31-003; SDA-2026-08-31-005  
REGRESSION_RISK: MEDIUM — double-grant on remount must be idempotent; Doka claim stays on the persist lock.  
VALIDATION_REQUIRED: Unlock feat with a spell id → owned set grows once; claim still pays Doka. Failed challenge grants neither XP nor spell. Retired reward id: Doka paid, spell skipped.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-08-31-011  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Draft / validate / activate / deactivate / rollback / compare / duplicate  
CATEGORY: lifecycle-tooling  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `adminSetSpellConfig` writes the live map immediately after a few numeric clamps (`main.mo` 600–618). No revision store. No validate endpoint. Admin Save is the only write (`AdminDashboard.tsx` 5194–5200). Duplicate/compare do not exist.  
SYSTEMS_AFFECTED: `spellConfigs` + new `spellRevisions`; Admin Versions tab; activate gate  
RECOMMENDED_ACTION: Combat reads `activeRevision` only. Editor writes `draftDefinition`. Validate is a pure, shared function (required metadata + referential integrity + no name fields used as keys). Activate bumps revision (cap 20). Rollback clones a prior revision into a new draft, then activate. Duplicate allocates a new id. Deactivate hides from new content without touching owned progress.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: SDA-2026-08-31-001; SDA-2026-08-31-005  
REGRESSION_RISK: MEDIUM — a draft leaking into `getSpellConfigs` for players would show unfinished spells.  
VALIDATION_REQUIRED: Activate rejected without `targetType`. Player hydrate unchanged while a draft is dirty. Rollback restores prior AP/range. Duplicate does not copy ownership.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-08-31-012  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Spell Studio UI — complete editor and dependency drawer  
CATEGORY: admin-ui  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Spells / Achievements / Bosses are separate tabs with no graph (`AdminDashboard.tsx` 4834, 5183–5224, 5922+). Spell cards show effectType/AP/DMG/RNG only (3300–3320). Delete is unlabeled `×`. No acquisition, pool, version, or dependent list. UI already uses the carved-stone gold/crimson language — extend it, do not restyle. Admin is lazy-loaded and `#admin`-gated (`ARCHITECTURE.md` 206–208).  
SYSTEMS_AFFECTED: `AdminDashboard.tsx` (new tab cluster only); admin hooks  
RECOMMENDED_ACTION: Add Library / Editor / Discovery / Kits / Feats / Graph / Versions as specified in the design doc. Footer validation strip. Retire modal lists dependents; no Delete on published ids. Keep `isAdmin && onOpenAdmin`. Do not ship on the player HUD.  
AUTONOMY: IMPLEMENT_AFTER_HUMAN — UI can follow 001/003/005 APIs; do not invent client-only persistence.  
DEPENDENCIES: SDA-2026-08-31-001; SDA-2026-08-31-003; SDA-2026-08-31-005; SDA-2026-08-31-008; SDA-2026-08-31-011  
REGRESSION_RISK: LOW for players if still gated. MEDIUM if editor save bypasses activate.  
VALIDATION_REQUIRED: Non-admin build has no studio routes. Admin can open a spell and see enemy/achievement/boss/AI edges. Desktop + the existing ≥768px gate.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-08-31-013  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Persist spell-bar ids from ownership, not only from upgrade keys  
CATEGORY: bar-persist  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `setSpellBarOrder` filters to `character.spellLevelKeys` (`main.mo` 1233–1242). Levels are written only by `upgradeSpell`. A never-upgraded owned spell (every starter at create) is dropped on save. Comments admit this was a workaround for unseeded catalogs. After 002, the legal set is `ownedSpellIds ∪ spellLevelKeys`, including retired-but-owned ids.  
SYSTEMS_AFFECTED: `main.mo` `setSpellBarOrder`; WX bar save (`WorldExploration.tsx` ~2458, 2759)  
RECOMMENDED_ACTION: Accept ids that are owned or have a level row. Reject (or drop with a debug line) ids that are neither. Do not require `lifecycle = active`. Max 8 unchanged.  
AUTONOMY: IMPLEMENT_AFTER_HUMAN  
DEPENDENCIES: SDA-2026-08-31-002; SDA-2026-08-31-005  
REGRESSION_RISK: MEDIUM — too loose re-allows unknown ids; too tight still strips starters.  
VALIDATION_REQUIRED: New character saves a bar of eight never-upgraded starters; reload matches. Unknown id dropped. Retired owned id kept.  
STATUS: NEW  

---
