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

ACTION_ID: MTD-2026-08-31-001  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Halt same-hour P2/P3 implementer flock after the 2026-08-30 merge burst  
CATEGORY: automation-coherence  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: 25+ automations launched 00:00–00:02 UTC 2026-08-31, including first runs of expansion (`3f31b18f`), enemy AI (`67b03c2f`), spell mechanics (`1330956a`), game feel (`078e61d4`), balance (`3c083a4a`), content diversity (`5acab6fe`), admin visuals (`3089f18d`), spell-discovery admin (`4efa22ec`), telemetry dashboard (`4b026695`), economy hunter (`1e548d83`), invariants (`72eb90fe`), and orchestrator (`68f2958f`). AQA-2026-08-30-001/004/009 already warned that same-hour implementers duplicate persist/combat themes. P0 leftovers (#114, unbounded canister writes, no ADR) are still open.  
SYSTEMS_AFFECTED: all implementer automations; merge queue  
RECOMMENDED_ACTION: First-run and expansion specialists emit ACTION_IDs only. Do not open gameplay PRs this cycle unless the item is unique, display-only, and not already drafted. Pause or stagger crons so they do not share a 2-minute window after a merge burst.  
AUTONOMY: HUMAN_CONFIG — automation schedules / prompts  
DEPENDENCIES: AQA-2026-08-30-001; AQA-2026-08-30-009  
REGRESSION_RISK: LOW — slowing first-run implementers does not remove #114. Residual risk is delayed P2 ideas.  
VALIDATION_REQUIRED: Next director run sees ≤3 new gameplay PRs from this wave, and those PRs do not retouch persist / targeting / mapGen / WX.  
STATUS: NEW  

---

ACTION_ID: AQA-2026-08-30-001  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Throttle the critical / high-severity bug hunter  
CATEGORY: automation-ops  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Reused. Hunter `996df6df` still accounted for 61 of the first 100 listed runs on 2026-08-30. GetAutomation is not visible to this principal. WX still 19,619 lines / 96 recent commits.  
SYSTEMS_AFFECTED: `996df6df-9d7a-11f1-a7d1-d6b4613131ce`; `WorldExploration.tsx`  
RECOMMENDED_ACTION: REDUCE_FREQUENCY to at most once per 12–24 hours; pause 6 hours after a `main` merge that touches `WorldExploration.tsx` or `progressPersist.ts`. Uniqueness check vs last 24h PR titles. Extract helpers instead of WX branches.  
AUTONOMY: HUMAN_CONFIG  
DEPENDENCIES: AQA-2026-08-30-002  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: ≤14 hunter runs/week; falling no-PR rate, not zero PRs.  
STATUS: OPEN  

---

ACTION_ID: AQA-2026-08-30-002  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Keep a single critical-bug automation  
CATEGORY: automation-ops  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Reused. `1aa41c6c` remains enabled and correctly opened unique #114 after the evening merges. A second high-frequency hunter is still the volume problem.  
SYSTEMS_AFFECTED: `1aa41c6c-a483-11f1-a7d1-d6b4613131ce`; `996df6df-9d7a-11f1-a7d1-d6b4613131ce`  
RECOMMENDED_ACTION: MERGE. Keep one hunter at AQA-001 cadence. Fold #114 into the human merge queue as the surviving critical PR.  
AUTONOMY: HUMAN_CONFIG  
DEPENDENCIES: AQA-2026-08-30-001  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Only one critical-bug automation ID fires per day.  
STATUS: OPEN  

---

ACTION_ID: MTD-2026-08-31-002  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Human merge queue — #114 then #107 clamp-only rebase  
CATEGORY: merge-hygiene  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: #114 is unique post-merge P0/P1 (plague death vs victory; barrier LoS), +242/−9, 5 files, clean on `22503b5`, 234 engine tests claimed. #107 is still based on `e4abb4c` (pre-#103/#104/#109/#111/#110) and overlaps official-client races already merged in #111. Its unique remaining value is the backend upper clamp on `saveBattleStats` (`main.mo` 1285–1353 still writes unbounded client Doka/XP/level).  
SYSTEMS_AFFECTED: `WorldExploration.tsx`; `targeting.ts`; `battleSetup.ts`; `main.mo`; persist callers  
RECOMMENDED_ACTION: Review/merge #114. Rebase #107 on current `main`; keep clamp + tests; drop shop/heal/jackpot/portal hunks already on `main`; treat `sessionStorage` death replay as optional/high-risk. Close #105. Hold #100/#101/#106.  
AUTONOMY: HUMAN_REVIEW  
DEPENDENCIES: AQA-2026-08-30-004 (superseded merge advice); AQA-2026-08-30-008  
REGRESSION_RISK: HIGH if #107 merges un-rebased; MEDIUM for #114 WX plague wiring (tests cover the helper).  
VALIDATION_REQUIRED: After merge, `pnpm typecheck` / targeted engine tests; plague 1 HP + last hostile does not pay; Attack Nearest cannot snipe through a barrier; `saveBattleStats` cannot raise Doka/XP/level above current store.  
STATUS: NEW  

---

ACTION_ID: AQA-2026-08-30-008  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Convert the security 9-finding set into an architecture decision  
CATEGORY: security-architecture  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Reused and escalated P1→P0 for the unbounded-write subset. `applyRewards` (`main.mo` 1356–1389) and `saveBattleStats` Doka write (`main.mo` 1352) remain unbounded. Finding 3 (“must not write Doka from saveBattleStats”) still contradicts `docs/ARCHITECTURE.md` persist table (heals/spends/death must use that write). `calculateAndAwardDoka` has no official frontend caller. `markAchievementUnlocked` is still client-asserted. `completeBossRushRoom` now ignores client reward amounts. No human ADR. Security automation was not in the 00:00 wave (GetAutomation not visible).  
SYSTEMS_AFFECTED: `src/backend/main.mo`; official persist funnel  
RECOMMENDED_ACTION: Write the ADR in `docs/ARCHITECTURE.md`: (a) official-client trust + store-relative clamps, or (b) canister proofs. Rewrite finding 3 to “absolute Doka/XP/level must be bounded by current store.” Do not reconfirm finding 3 as “Doka write is a bug.” Land clamp via MTD-2026-08-31-002.  
AUTONOMY: HUMAN_DECISION + reviewed PR  
DEPENDENCIES: MTD-2026-08-31-002  
REGRESSION_RISK: HIGH if APIs tighten without a frontend roll.  
VALIDATION_REQUIRED: ADR merged; security findings marked decided; clamp on `main` or explicitly deferred.  
STATUS: OPEN  

---

ACTION_ID: AQA-2026-08-30-004  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: 2026-08-30 overlapping draft stack — post-merge residual  
CATEGORY: merge-hygiene  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Reused. Against AQA advice, #103 #109 #112 #113 #104 #111 #110 merged 20:16–20:48 UTC. Residual open drafts: #100 #101 #105 #106 #107 #108 #114.  
SYSTEMS_AFFECTED: merge queue  
RECOMMENDED_ACTION: Follow MTD-2026-08-31-002. Do not re-open merged themes (portal XP, jackpot, white portal, Attack Nearest live hostiles, mapGen solvability).  
AUTONOMY: HUMAN_REVIEW  
DEPENDENCIES: MTD-2026-08-31-002  
REGRESSION_RISK: HIGH if leftovers merge in parallel on stale bases.  
VALIDATION_REQUIRED: At most one open PR per theme.  
STATUS: SUPERSEDED  

---

ACTION_ID: AQA-2026-08-30-006  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Freeze mapGen after #110 merged against AGENTS.md  
CATEGORY: sensitive-code  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Reused. #110 (`22503b5`) legalizes spawn, relocates exits, punches isolated hostiles, adds seed fixtures. `AGENTS.md` line 5 still forbids map generation edits. Further punches will fight CA/void aesthetics and dungeon-chain portals.  
SYSTEMS_AFFECTED: `src/frontend/src/engine/mapGen.ts`; Solvability Guardian `9dcfd122`  
RECOMMENDED_ACTION: UPDATE_PROMPT to report-only (ACTION_IDs + failing seed fixtures) unless a human authorizes a playtested mapGen change. No new mapGen PRs this week.  
AUTONOMY: HUMAN_CONFIG  
DEPENDENCIES: None  
REGRESSION_RISK: LOW if frozen. HIGH if another punch lands without playtest.  
VALIDATION_REQUIRED: Next solvability run opens 0 mapGen PRs.  
STATUS: BROKEN  

---

ACTION_ID: AQA-2026-08-30-007  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Freeze drive-by WorldExploration edits after #114  
CATEGORY: sensitive-code  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Reused. File is 19,619 lines; 96 commits since 2026-08-24. Persist helper had 8. #114 is the last justified WX combat patch in the plague/barrier cluster. Tonight’s feel / AI / expansion / invariant agents are set up to add more WX branches.  
SYSTEMS_AFFECTED: `WorldExploration.tsx`; every implementer  
RECOMMENDED_ACTION: New behavior goes in `engine/*` or `utils/*` with tests; WX-only one-line wiring. Reject PRs whose primary hunk is another WX branch.  
AUTONOMY: HUMAN_CONFIG + review  
DEPENDENCIES: MTD-2026-08-31-002 (#114)  
REGRESSION_RISK: MEDIUM — some remaining defects are still WX closures.  
VALIDATION_REQUIRED: Next week WX commit count under 20.  
STATUS: OPEN  

---

ACTION_ID: MTD-2026-08-31-003  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Controlled extraction of HP and death authority out of WorldExploration  
CATEGORY: architecture  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Recurring cluster: #78 last-kill set, #81/#83/#84/#86 store HP, #87/#88/#89 skip-advance, #98 live DoT, #103 heal/phase HP, #114 plague death. Root cause is dual authority (React maps / `characterStats` / post-paint HP-watch vs `combatantsRef`). Local patches keep leaking the next lethal source.  
SYSTEMS_AFFECTED: `combatantStore.ts`; `deathPipeline.ts`; `battleSetup.ts`; `WorldExploration.tsx`  
RECOMMENDED_ACTION: Controlled intervention — not a big-bang rewrite. One PR: every lethal path calls the same helper (store HP + `deathTriggered` + refuse victory) already sketched by `shouldContinuePlayerTurnAfterHazard` / `hpAfterIncomingDamage`. No RAF, mapGen, turn-order, or damage-formula changes.  
AUTONOMY: IMPLEMENT_AFTER_#114 — single scoped PR  
DEPENDENCIES: MTD-2026-08-31-002; AQA-2026-08-30-007  
REGRESSION_RISK: HIGH if bundled with targeting or persist. MEDIUM if extracted with tests only.  
VALIDATION_REQUIRED: Engine tests for plague / DoT / lava / reflect / phase-2; last-hostile + player-lethal same tick never pays.  
STATUS: NEW  

---

ACTION_ID: MTD-2026-08-31-004  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Freeze content / AI / feel / admin implementation until P0/P1 settle  
CATEGORY: expansion-gating  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Core rules require observed-spell discovery, dynamic enemy pools, and Draft→Validate→Activate. None are implemented. First-run specialists for those themes launched tonight. `enemyAI.ts` is already 2,582 lines; AdminDashboard 7,322; 32 static spells; `buildEnemyKit` is piece+zone, not observation. Implementing expansion on a dual-HP / unbounded-reward base repeats the persist-patch mill.  
SYSTEMS_AFFECTED: spell discovery; enemy AI; admin dashboard; game feel; balance numbers  
RECOMMENDED_ACTION: Those automations write ACTION_IDs and reports only. No new spells, AI behaviors, admin chrome, or VFX that touch WX / `main.mo` / `enemyAI.ts` this cycle.  
AUTONOMY: HUMAN_CONFIG  
DEPENDENCIES: MTD-2026-08-31-001; MTD-2026-08-31-003; AQA-2026-08-30-008  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Next director run: 0 merged expansion PRs that touch combat persist or WX.  
STATUS: NEW  

---

ACTION_ID: AQA-2026-08-30-005  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Stop the test-coverage clone mill  
CATEGORY: automation-ops  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Reused. #100 #101 #106 still open. Coverage automation `81c2e934` running again at 00:00 UTC.  
SYSTEMS_AFFECTED: `4a5a5880`; `81c2e934`  
RECOMMENDED_ACTION: Close or hold #100/#101/#106. Only add cases for *merged* fixes that still lack a helper test. REDUCE_FREQUENCY to 2–3×/week after merge bursts.  
AUTONOMY: HUMAN_CONFIG  
DEPENDENCIES: MTD-2026-08-31-002  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Next week ≤3 coverage PRs; no occupancy/loss-path reopen.  
STATUS: OPEN  

---

ACTION_ID: AQA-2026-08-30-003  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Adopt an in-repo ACTION_ID ledger all producers write to  
CATEGORY: process  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Reused. Ledger now exists (`docs/automation/ACTION_IDS_*.md`) via #112 and this run. GitHub issues still 0. Most implementers still do not write IDs. Orchestrator is running again and previously implemented leftover XP (#108) instead of a ledger.  
SYSTEMS_AFFECTED: orchestrator `68f2958f`; all hunters  
RECOMMENDED_ACTION: UPDATE_PROMPT: append to `docs/automation/ACTION_IDS_*.md`. Refuse a second PR for an ID that is OPEN or matches an open PR theme. Digest also writes `docs/automation/digests/YYYY-MM-DD.md`.  
AUTONOMY: HUMAN_CONFIG  
DEPENDENCIES: None  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Next week’s `docs/automation/` contains IDs from orchestrator, security, and at least one hunter.  
STATUS: PARTIAL  

---

ACTION_ID: AQA-2026-08-30-009  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Stop the orchestrator from implementing gameplay  
CATEGORY: automation-ops  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Reused. Orchestrator `68f2958f` is running again (`bc-027328c5`). Yesterday it opened #108 (unique HUD, acceptable) but wrote zero IDs and waited on specialists that “did not exist.” Those specialists exist now and are implementing in parallel.  
SYSTEMS_AFFECTED: `68f2958f-a489-11f1-a7d1-d6b4613131ce`  
RECOMMENDED_ACTION: Primary output = ACTION_ID ledger + merge-order note. Implement only unique display-only items. Point at this roadmap instead of inventing missing reports.  
AUTONOMY: HUMAN_CONFIG  
DEPENDENCIES: AQA-2026-08-30-003; MTD-2026-08-31-001  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: This cycle’s orchestrator run produces a ledger file and 0 combat/persist PRs.  
STATUS: OPEN  

---

ACTION_ID: AQA-2026-08-30-010  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Dedup persist-race and economy specialists  
CATEGORY: automation-ops  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Reused. #111 merged. Economy hunter `1e548d83` launched again at 00:02 (`bc-1d1fb1c5`) while #107 is still an un-rebased draft.  
SYSTEMS_AFFECTED: `607e0304`; `1e548d83`; `72eb90fe`  
RECOMMENDED_ACTION: If an open PR already names the race, emit ACTION_ID only. Do not open a second clamp or portal-XP PR.  
AUTONOMY: HUMAN_CONFIG  
DEPENDENCIES: MTD-2026-08-31-002  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: No new PR that mentions portal XP, jackpot, or saveBattleStats clamp besides the #107 rebase.  
STATUS: OPEN  

---

ACTION_ID: AQA-2026-08-30-011  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Point implementer prompts at live architecture  
CATEGORY: prompt-architecture  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Reused. Live truth: 12-field `CharacterStats`; canonical `src/backend/main.mo`; `saveBattleStats` Doka writes are required; `backend_extended` is stale; targeting gate is on `main` (#95/#102/#104) and #114 extends it.  
SYSTEMS_AFFECTED: combat parity; invariants; security; solvability  
RECOMMENDED_ACTION: Cite `docs/ARCHITECTURE.md` + `AGENTS.md` + this roadmap. Do not rediscover `backend_extended` as a live bug. Do not fork the live-cast gate.  
AUTONOMY: HUMAN_CONFIG  
DEPENDENCIES: AQA-2026-08-30-008  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Next combat/invariant run no-ops or rebases on #114 without a second Attack Nearest stack.  
STATUS: OPEN  

---

ACTION_ID: AQA-2026-08-30-012  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Smallest outcome-telemetry hooks — counters before any dashboard  
CATEGORY: telemetry  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Reused. Still no series. Telemetry *admin dashboard* automation `4b026695` launched 00:01 UTC (`bc-67c06778`) with nothing to plot.  
SYSTEMS_AFFECTED: persist funnel; future admin telemetry UI  
RECOMMENDED_ACTION: Human-designed, backend-authoritative counters only: persist-fail vs persist-ok, death-penalty applied, victory paid, recap opened/dismissed, shop credit committed. Query-only or enqueued on `createProgressPersist`. Dashboard UI waits. Automations must not claim CLEAR_POSITIVE_SIGNAL until then.  
AUTONOMY: DESIGN_THEN_TINY_PR  
DEPENDENCIES: AQA-2026-08-30-008 (do not invent a second wallet path)  
REGRESSION_RISK: MEDIUM if counters write off the persist lock.  
VALIDATION_REQUIRED: Next Quality Auditor can cite persist-ok/fail and victory-paid, or repeat “still no telemetry.” Zero telemetry-dashboard merges before counters.  
STATUS: OPEN  

---

ACTION_ID: MTD-2026-08-31-005  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Wire saveKillCount or drop kill totals from the leaderboard  
CATEGORY: neglected-system  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: `useSaveKillCount` (`useLeaderboardQueries.ts` 43–50) has no UI caller. `TROUBLESHOOTING.md` already records this. `CharacterStats.killCount` is required on every Candid payload and cannot decrease, but world saves only preserve the current value.  
SYSTEMS_AFFECTED: leaderboard; `saveKillCount`; battle victory  
RECOMMENDED_ACTION: After persist freeze, one isolated caller on attributed enemy kills through the existing hook — or remove killCount from the public leaderboard until then. Do not piggyback on a WX combat PR.  
AUTONOMY: IMPLEMENT_LATER  
DEPENDENCIES: MTD-2026-08-31-003; AQA-2026-08-30-007  
REGRESSION_RISK: LOW if isolated; MEDIUM if stuffed into victory persist.  
VALIDATION_REQUIRED: Leaderboard kill totals move after a real victory, once, and survive reload.  
STATUS: NEW  

---

ACTION_ID: MTD-2026-08-31-006  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Do not grow AdminDashboard until Draft → Validate → Activate exists  
CATEGORY: content-pipeline  
PRIORITY: P2  
CONFIDENCE: MEDIUM  
EVIDENCE: `AdminDashboard.tsx` is 7,322 lines. Boss editor uses local React `drafts` state only. No canister Draft → Validate → Activate. Admin visual + feature-drift + spell-discovery-admin automations launched tonight. Core rule requires that pipeline “where appropriate.”  
SYSTEMS_AFFECTED: `AdminDashboard.tsx`; admin mixins; config maps in `main.mo`  
RECOMMENDED_ACTION: Report-only on admin chrome. Design the publish pipeline as ACTION_IDs. Do not add more visual managers on the 7.3k-line file first.  
AUTONOMY: DESIGN_ONLY this cycle  
DEPENDENCIES: MTD-2026-08-31-004; AQA-2026-08-30-008  
REGRESSION_RISK: LOW if frozen. HIGH if live config writes ship without validate.  
VALIDATION_REQUIRED: Next admin PR is either zero or a documented pipeline, not another panel.  
STATUS: NEW  

---

ACTION_ID: MTD-2026-08-31-007  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Spell discovery and unlocks wait on persist + metadata infrastructure  
CATEGORY: expansion-gating  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: DESIGN/core rules require enemy-observed discovery and achievement/challenge/boss spell unlocks. ENGINEERING: 32 static `spellData.ts` ids; `buildEnemyKit(pieceType, levelZone)`; no observe/unlock persist; `markAchievementUnlocked` is client-trusted; challenges pay Doka/XP only.  
SYSTEMS_AFFECTED: spell catalog; achievements; challenges; bosses; enemy kits  
RECOMMENDED_ACTION: Design unlock records (explicit spell ids, not name heuristics) and a backend-authoritative grant on the persist lock. Do not add spells or discovery UI this cycle.  
AUTONOMY: DESIGN_ONLY this cycle  
DEPENDENCIES: MTD-2026-08-31-004; AQA-2026-08-30-008; AQA-2026-08-30-012  
REGRESSION_RISK: HIGH if discovery writes spell levels through `saveBattleStats` (`upgradeSpell` is the sole writer today).  
VALIDATION_REQUIRED: A written persist shape before any discovery PR.  
STATUS: NEW  

---

ACTION_ID: MTD-2026-08-31-008  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: AI-tier 30% random roll contradicts progressive sophistication  
CATEGORY: design-contradiction  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: `computeAITier` (`combatMath.ts` 36–51) uses level bands then a 30% chance to return `random(1..10)`. Core rule: progressively sophisticated, player-relative enemies. This is DESIGN vs ENGINEERING, not measured play.  
SYSTEMS_AFFECTED: `combatMath.ts`; enemy generation; `enemyAI.ts`  
RECOMMENDED_ACTION: Human design decision. Until then, do not rewrite `enemyAI.ts`. A later one-line variance change is enough if the decision is “remove the flat random.”  
AUTONOMY: HUMAN_DECISION  
DEPENDENCIES: MTD-2026-08-31-004  
REGRESSION_RISK: MEDIUM if variance is removed without a playtest of high-level maps.  
VALIDATION_REQUIRED: Written decision in DESIGN or ARCHITECTURE; no first-run AI PR.  
STATUS: NEW  

---

ACTION_ID: MTD-2026-08-31-009  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Leftover XP HUD (#108) is the only safe display merge after #114  
CATEGORY: player-experience  
PRIORITY: P3  
CONFIDENCE: HIGH  
EVIDENCE: #108 leftover XP on selection / top bar / recap is unique among open PRs and does not retouch persist writers. Orchestrator already drafted it.  
SYSTEMS_AFFECTED: character selection; top bar; `PostBattleRecap`  
RECOMMENDED_ACTION: Rebase on post-#114 `main` if needed and merge as display-only. Do not expand into persist.  
AUTONOMY: HUMAN_REVIEW  
DEPENDENCIES: MTD-2026-08-31-002  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Leftover XP matches `xpCurve` after a level-up; numbers agree on the three surfaces.  
STATUS: NEW

ACTION_ID: TADD-2026-08-31-001  
SOURCE_AUTOMATION: Telemetry Admin Dashboard Designer  
TITLE: Ship AQA-012 backend-authoritative outcome counters  
CATEGORY: telemetry  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Quality audit 2026-08-30 found no player telemetry (one WX comment). Official client logs persist failures with `logDebugInfo` only (`WorldExploration.tsx` ~12797–12802, ~13097). Debug ring buffer is local (`debug/debugLogger.ts` 105–124). No canister battle/death/recap/persist counters exist. AQA-2026-08-30-012 already approved: persist-ok/fail, death-penalty applied, victory paid, recap opened/dismissed, shop credit committed.  
SYSTEMS_AFFECTED: `utils/progressPersist.ts`; `utils/applyRewardsResult.ts`; `utils/deathPenalty.ts`; `utils/shopPurchase.ts`; `components/PostBattleRecap.tsx`; `src/backend/main.mo` (query-only Nat map or increment on existing writers).  
RECOMMENDED_ACTION: Implement those seven counters only. Backend-authoritative. No gameplay math. Enqueue increments on `createProgressPersist` or store as canister Nats incremented inside the same successful/failed write path. Prefer UTC-day buckets (90-day ring) with no principal. Admin query returns aggregates. Do not add battle-start, flee, turn, or Doka-amount ledgers in this ID.  
AUTONOMY: HUMAN_THEN_IMPLEMENT — AQA-012 already approved the set; persist-lock placement still needs a careful implementer.  
DEPENDENCIES: AQA-2026-08-30-012 (same work; do not open a second counter design).  
REGRESSION_RISK: MEDIUM if counters write off the persist lock or invent a second wallet path.  
VALIDATION_REQUIRED: Admin can read persist-ok, persist-fail, death-penalty applied, victory paid, recap opened, recap dismissed, shop credit committed. Next Quality Auditor can cite weekly persist-ok/fail and victory-paid, or still say “not shipped.”  
STATUS: NEW  

---

ACTION_ID: TADD-2026-08-31-002  
SOURCE_AUTOMATION: Telemetry Admin Dashboard Designer  
TITLE: Add owner-only Health tab for snapshot views H1–H11 and H13  
CATEGORY: admin-ui  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: `AdminDashboardState.tab` (`gameTypes.ts` 473–488) is config CRUD only. `getAllCharacters` (`main.mo` 369–374) is admin-gated and unused by the dashboard. OQL already exposes `characterSlots`, `dokaBalances`, `dungeonRecords`, `achievementProgress`, `purchaseRecords`, `bossRushStates`, `changelogShownVersions`. Purchases tab already lists IAP rows (with PII). No Health surface.  
SYSTEMS_AFFECTED: `components/AdminDashboard.tsx`; `types/gameTypes.ts` (add `tab: "health"`); read-only hooks.  
RECOMMENDED_ACTION: New Health tab, same admin gate and carved-stone tokens. Implement only views classified LIVE_SNAPSHOT in `TELEMETRY_DASHBOARD_2026-08-31.md` (H1–H11, H13). H12 widgets stay “not shipped” until TADD-001. Every card states data class, n, and the owner decision. Grey out date filters on snapshots. No production gameplay changes.  
AUTONOMY: IMPLEMENT_AFTER_DESIGN — read-only UI; follow the support matrix.  
DEPENDENCIES: TADD-2026-08-31-003 for spell/Boss Rush master fields; TADD-2026-08-31-005 for PII rules.  
REGRESSION_RISK: LOW if read-only and admin-gated. MEDIUM if `getAllCharacters` payloads are stored in React state and rendered as rows (PII leak).  
VALIDATION_REQUIRED: `pnpm typecheck` / `pnpm fix` / `pnpm build` clean. Health hidden when not admin. No principal/email/name on Health. Empty states say “not measured,” not “0 battles.”  
STATUS: NEW  

---

ACTION_ID: TADD-2026-08-31-003  
SOURCE_AUTOMATION: Telemetry Admin Dashboard Designer  
TITLE: Expose spell loadout and Boss Rush master on owner aggregates without PII  
CATEGORY: telemetry  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: OQL `characterSlots` (`main.mo` 2632–2678) payloads stop at name, pieceType, level, experience, hp, killCount. Spell upgrade keys, `spellBarOrder`, `activeSpells`, and `bossRushMasterComplete` exist on `Character` (`main.mo` 98–121) and on `getAllCharacters` but not on OQL. H3/H4/H9 master-complete cannot be built from OQL today.  
SYSTEMS_AFFECTED: `src/backend/main.mo` OQL entity and/or a new admin aggregate query; Health tab consumers.  
RECOMMENDED_ACTION: Prefer a new `#admin` query that returns **aggregates only** (level histogram, per-spell upgrade counts, bar pair counts, master-complete count). Alternative: extend OQL payloads then aggregate in the client **before** setState, dropping owner/name. Do not add a player-row table to Health.  
AUTONOMY: HUMAN_THEN_IMPLEMENT — schema/OQL change.  
DEPENDENCIES: TADD-2026-08-31-002.  
REGRESSION_RISK: LOW if additive payloads / new query. Do not change `Character` persist shape.  
VALIDATION_REQUIRED: Health H3/H9 can show upgrade coverage and master-complete count with n, and the network/response inspector shows no principal list in the Health render path.  
STATUS: NEW  

---

ACTION_ID: TADD-2026-08-31-004  
SOURCE_AUTOMATION: Telemetry Admin Dashboard Designer  
TITLE: Treat requested combat/economy/enemy series as out of scope until new approval  
CATEGORY: process  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: No encounter, turn, flee, duration, elite, AI-archetype, or enemy-spell persist. `saveKillCount` has no UI caller (`useSaveKillCount` unused). Wallet is a current Nat (`dokaBalances`); `applyRewards` / `saveBattleStats` are not a ledger. WorldExploration does not read `spriteUrl`. Pattern fallback is local (`pieceArt.ts` 809–811).  
SYSTEMS_AFFECTED: Future hunters / dashboard implementers; do not touch RAF, map gen, turn logic, or damage math to “add telemetry.”  
RECOMMENDED_ACTION: Refuse charts for battle count, victory/defeat/flee, average turns, encounter frequency, relative enemy level, win/loss, battle duration, elite frequency, advanced AI usage, enemy spell usage, spell cast usage, discovery, acquisition source, combat combinations, Doka earned/spent totals, boss attempts/average attempts/flee, invalid-config events, failed asset loads, and custom-fallback events. Do not wire `saveKillCount` as a battle proxy. Any expansion beyond AQA-012 needs a new human-approved ACTION_ID.  
AUTONOMY: POLICY — no code.  
DEPENDENCIES: None.  
REGRESSION_RISK: LOW. Residual risk is continued blindness on those questions (already true).  
VALIDATION_REQUIRED: Next dashboard PR does not add those series. Next Quality Auditor still marks them INCONCLUSIVE unless TADD-001 shipped.  
STATUS: NEW  

---

ACTION_ID: TADD-2026-08-31-005  
SOURCE_AUTOMATION: Telemetry Admin Dashboard Designer  
TITLE: Keep identifiable data off Health; do not reuse the public leaderboard  
CATEGORY: privacy  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `getLeaderboard` (`main.mo` 2527–2571) is public and returns `principalId` + `playerName`. Purchases tab advertises “customer data & proof-of-address” (`AdminDashboard.tsx` 5271–5272) with Email/Address columns (5338–5346). OQL `purchaseRecords` and `achievementProgress` include principal and customer fields. Health must answer owner questions from aggregates.  
SYSTEMS_AFFECTED: Health tab; optional later redaction of exports. Purchases fulfillment tab may keep PII.  
RECOMMENDED_ACTION: Health queries aggregate then render. Forbidden on Health: principal, character name, email, address, proof URL. Do not call `getLeaderboard` for Health. `n < 5` hides rates. Purchases fulfillment stays a separate tab.  
AUTONOMY: IMPLEMENT_WITH_TADD-002.  
DEPENDENCIES: TADD-2026-08-31-002.  
REGRESSION_RISK: LOW.  
VALIDATION_REQUIRED: Code review + DOM/ocid pass: no principal/email/name nodes under `data-ocid` health.*.  
STATUS: NEW  

---

ACTION_ID: TADD-2026-08-31-006  
SOURCE_AUTOMATION: Telemetry Admin Dashboard Designer  
TITLE: Distinguish NORMAL_DEFAULT pixel use from CUSTOM_FALLBACK; do not chart either as errors today  
CATEGORY: visuals-telemetry  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Enemy `spriteUrl` and player `*Url` are admin config (OQL + AdminDashboard). `WorldExploration.tsx` has no `spriteUrl` load path; combatants draw via `pieceArt.ts` patterns. Missing pieceType/palette logs `pattern lookup failed` locally and draws `king.front` (`pieceArt.ts` 809–811). Admin preview `onError` only hides the `<img>`. Empty URL means intentional default, not failure.  
SYSTEMS_AFFECTED: Future custom-URL loader only; Health H10 captions.  
RECOMMENDED_ACTION: H10 may count configs with empty vs non-empty custom URLs. Label empty as NORMAL_DEFAULT. Do not increment an error for empty URL or for pattern-lookup-failed. If a custom URL loader is ever added, emit CUSTOM_FALLBACK only when a non-empty URL fails load/decode and pixels are used instead. That event is **not** approved yet (would need a human ID).  
AUTONOMY: POLICY for now; implement captions with TADD-002.  
DEPENDENCIES: TADD-2026-08-31-002; TADD-2026-08-31-004.  
REGRESSION_RISK: LOW.  
VALIDATION_REQUIRED: Health has no “pixel fallback errors” series. H10 caption states world does not load custom URLs.  
STATUS: NEW  

---

ACTION_ID: TADD-2026-08-31-007  
SOURCE_AUTOMATION: Telemetry Admin Dashboard Designer  
TITLE: Do not design a level-cap or endgame dashboard  
CATEGORY: progression  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: There is no level cap. XP threshold is `100 * 2^(N-1)` with an unbounded while-loop (`docs/ARCHITECTURE.md` Rewards). `Character.level` is Nat. Leaderboard sorts by level with no max.  
SYSTEMS_AFFECTED: Health H1.  
RECOMMENDED_ACTION: Open-ended level histogram. Bands 1–4, 5–9, 10–19, 20–39, 40–79, 80+ with the last edge raised when `max(level)` exceeds 80. Show leftover XP vs next threshold. No “max level reached,” prestige, or endgame completion panel.  
AUTONOMY: IMPLEMENT_WITH_TADD-002.  
DEPENDENCIES: TADD-2026-08-31-002.  
REGRESSION_RISK: LOW.  
VALIDATION_REQUIRED: H1 has no cap chrome; leftover XP uses `xpForNextLevel`, not `level * 100`.  
STATUS: NEW

ACTION_ID: VAL-2026-08-31-001  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Empty-library fallback — custom visuals never required  
CATEGORY: invariant  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Combatants paint via `drawPixelPattern` (`WorldExploration.tsx` 3658–3701, `pixelSize = 3`) and `drawCombatant` (`pieceArt.ts` 825–1011). Zero `ctx.drawImage` in the world renderer. `EnemyConfig.spriteUrl` and `PlayerSpriteConfig` URLs are stored but never consumed by `WorldExploration`. New bosses already fall back to `P.boss_12` (`WorldExploration.tsx` 4146).  
SYSTEMS_AFFECTED: `engine/visualAssets.ts` (new), `data/pieceArt.ts` `drawCombatant`, spawn sites  
RECOMMENDED_ACTION: Implement `resolveRuntimeVisual` so a missing, inactive, invalid, or empty library returns `{ kind: "builtin" }` and the existing pixel path runs unchanged. New enemies/bosses/summons must work with no uploads. Never make artwork upload mandatory.  
AUTONOMY: IMPLEMENT_WITH_TESTS — helper + unit tests only; no RAF / mapGen / combat math.  
DEPENDENCIES: None  
REGRESSION_RISK: LOW if the helper is identity on empty input. HIGH if anyone wires raw `spriteUrl` into draw.  
VALIDATION_REQUIRED: Tests: library `[]`, inactive id, corrupt id → builtin. Manual: new boss portal with empty library matches current pixels.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-08-31-002  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Owner-only library metadata on the canonical canister  
CATEGORY: backend-admin  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Admin writes already require `#admin` (`main.mo` 567–579). UI deny at `AdminDashboard.tsx` 4760–4761. `App.tsx` 224 `isAdmin = userRole === "admin"`. `AGENTS.md` forbids shipping admin to players. Canonical actor is `src/backend/main.mo`, not `backend_extended/`.  
SYSTEMS_AFFECTED: `src/backend/main.mo`, bindgen `src/frontend/src/backend.ts`, `AdminDashboard.tsx`  
RECOMMENDED_ACTION: Add a `VisualAsset` / assignment / pool store with the metadata fields in the design doc (`ASSET_ID` … `VALIDATION_STATUS`, plus blob ref and direction refs). CRUD is `#admin` only. Public gameplay must not depend on the store being populated. Do not deploy `backend_extended`.  
AUTONOMY: HUMAN_REVIEW — Candid / migration.  
DEPENDENCIES: VAL-2026-08-31-001  
REGRESSION_RISK: MEDIUM — new persistent maps need a migration module if the live actor cannot add fields silently.  
VALIDATION_REQUIRED: Non-admin caller gets `#err("Unauthorized")`. Empty store does not change `getCharacter` / combat.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-08-31-003  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Show derived upload specs before file selection and never silently distort  
CATEGORY: admin-ui  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Recommended 24×24 is 8×8 cells × `pixelSize = 3` (`WorldExploration.tsx` 3672–3674; `pieceArt.ts` 749–751). Boss recommended 34×50 is 8×12 × 3 × spawn scale 1.4 (`getBossPixelPattern` 3728–3740; spawn 6988–6989). Max 80×60 is `TILE_WIDTH` × sprite `drawSize.h` (8479–8497). JPEG/SVG unused; pixel path skips `cell === 0` (transparency).  
SYSTEMS_AFFECTED: `AdminDashboard.tsx` (new library panel), `engine/visualAssets.ts` validation  
RECOMMENDED_ACTION: Before `<input type="file">`, display per-category `RECOMMENDED_*`, `MAX_*`, formats, transparency, anchor, default scale, max safe footprint, animation (4 stills). Validate MIME, decode, width/height, aspect, pixel count, file size, alpha, category, render-safe bounds. Reject corrupt/undecodable. Warn aspect/padding; never auto-stretch/crop.  
AUTONOMY: IMPLEMENT_AFTER 002  
DEPENDENCIES: VAL-2026-08-31-002, VAL-2026-08-31-004  
REGRESSION_RISK: LOW — admin-only.  
VALIDATION_REQUIRED: PNG 24×24 player accepts; JPEG rejects; 200×200 rejects or warns without being drawn stretched; 0-alpha-all-opaque warns.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-08-31-004  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Freeze entity-aware render profiles from the live renderer  
CATEGORY: render-contract  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: See design §3. `TILE_WIDTH/HEIGHT` 80×40 (`gameConstants.ts` 6–7). `CHARACTER_Y_OFFSET = -9` (line 17). Draw point = tile top + 9 (`pieceArt.ts` 838–840). Pattern centered (`WorldExploration.tsx` 3677–3678). Mobile zoom 1.75 scales **tiles only** (818–821), not pixel cells. Phones &lt;768 blocked (`App.tsx` 26–28).  
SYSTEMS_AFFECTED: `engine/visualAssets.ts` profile constants, admin spec UI, preview  
RECOMMENDED_ACTION: Check in a typed `RENDER_PROFILES` map (`player_standard`, `enemy_standard`, `enemy_elite`, `boss_large`, `summon_standard`) using only measured numbers from the design doc. Custom default scale = 1. Do not apply `MOBILE_ZOOM` to bitmaps unless a later profile opts in. Do not invent 64×64 / 128×128 as the recommended size.  
AUTONOMY: IMPLEMENT_WITH_TESTS  
DEPENDENCIES: None  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Unit test: each profile’s recommended box equals the derived cell math (8×3, 12×3×1.4).  
STATUS: NEW  

---

ACTION_ID: VAL-2026-08-31-005  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Bind artwork at spawn — never during React render or rAF  
CATEGORY: assignment-stability  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: No encounter seed exists. Enemy ids are `enemy-${n}-${Date.now()}` (`WorldExploration.tsx` 6183). Boss ids `boss_${id}_${Date.now()}` (6977). Summon ids `summon-${Math.random()…}` (`summonSpawn.ts` 137). Stats already use `seededRng` (`combatMath.ts` 122–128). Instance `scaleX/Y` is stored at spawn (6194–6195) and is the existing “stable random” pattern.  
SYSTEMS_AFFECTED: enemy generate / boss portal / `spawnSummonUnit`, `Enemy` type, `drawCombatant`  
RECOMMENDED_ACTION: Add `visualAssetId` (optional) on the instance. Introduce presentation-only `encounterVisualSeed` on the map ref when the map is committed — do **not** edit `mapGen.ts`. Pick with `seededRng(hash(seed, instanceId, poolId))` once. rAF only reads the stored id. Empty/invalid id → builtin.  
AUTONOMY: IMPLEMENT_AFTER 001 — WX call-site must stay one-line; logic in `engine/`.  
DEPENDENCIES: VAL-2026-08-31-001, VAL-2026-08-31-006  
REGRESSION_RISK: MEDIUM if seed is accidentally used for AI/stats. Keep visual seed isolated.  
VALIDATION_REQUIRED: 100 simulated renders + one React state update keep the same `visualAssetId`. Changing pool after spawn does not reshuffle live instances.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-08-31-006  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Weighted pools — active eligible only, else builtin  
CATEGORY: assignment  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Family already rolls 30% at spawn and stores `en.family` (`WorldExploration.tsx` 6236–6326) — that is the template for “pick once, store, never in render.” No pool type exists.  
SYSTEMS_AFFECTED: new pool store, spawn resolver  
RECOMMENDED_ACTION: Pools list `{ assetId, weight }`. Eligible = ACTIVE ∧ VALIDATION_STATUS ok ∧ category ∧ family/tags ∧ elite/boss flags. Weight 0 = direct-assign only. Zero eligible → unset id → pixel default. Do not re-roll when an asset is later deactivated; fall back to builtin for that instance.  
AUTONOMY: IMPLEMENT_WITH_TESTS  
DEPENDENCIES: VAL-2026-08-31-001, VAL-2026-08-31-002  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Tests: empty pool; all inactive; weights 1/3/6 deterministic under fixed seed; deactivated winner → builtin not a new roll.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-08-31-007  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Boss render profile is not a stretched enemy  
CATEGORY: boss-visual  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Bosses use dedicated 8×12 patterns (`getBossPixelPattern`, e.g. `boss_1` 3728–3740) and a **fixed** `scaleX/Y = 1.4` (6988–6989), not `generateEnemyScaleFactors`. `drawCombatant` branch 1 is `isBoss && bossId` (`pieceArt.ts` 843–882). Battle flags `isBoss` only when `id.startsWith("boss_")` (12224–12250).  
SYSTEMS_AFFECTED: `boss_large` profile, boss spawn bind, `drawCombatant`  
RECOMMENDED_ACTION: Assign only `BOSS_ONLY` / `#boss` assets to bosses. Draw at `boss_large` recommended 34×50 with scale 1 (or 24×36 × 1.4 if the owner uploaded a pixel-match sheet). Never take an `enemy_standard` bitmap and scale it to fill the boss box.  
AUTONOMY: IMPLEMENT_AFTER 004  
DEPENDENCIES: VAL-2026-08-31-004, VAL-2026-08-31-005  
REGRESSION_RISK: MEDIUM — double-applying 1.4 on a 34×50 upload.  
VALIDATION_REQUIRED: Preview: enemy 24×24 assigned to a boss is rejected or shown as ineligible. Boss 34×50 does not also multiply by 1.4.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-08-31-008  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Visual size must not drive occupancy, movement, range, or hitbox  
CATEGORY: invariant  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: `occupancy.ts` 6–15 and 78–89: one combatant per logical tile; no pixel size. Targeting is tile Chebyshev/Manhattan. Sprite rects are a **fixed** `effectiveTileW × effectiveTileH*1.5` box (8479–8498), already decoupled from pattern 24×24.  
SYSTEMS_AFFECTED: `occupancy.ts`, `targeting.ts`, sprite rect registration  
RECOMMENDED_ACTION: Forbid reading image width/height in occupancy, pathing, spell range, or combat hitboxes. Keep sprite-hit rects tile-derived (or document a later change as hit-test-only). Preview should warn when art exceeds the 80×60 rect (missed clicks), not expand the tile.  
AUTONOMY: GUARDRAIL — add a comment + a test that resolver output is unused by occupancy.  
DEPENDENCIES: VAL-2026-08-31-001  
REGRESSION_RISK: HIGH if a later hunter “fixes” click-miss by growing occupancy.  
VALIDATION_REQUIRED: 64×72 boss image still occupies one cell; neighbors remain legal targets.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-08-31-009  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Admin preview on a real iso tile at intended scale  
CATEGORY: admin-ui  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Anchor is pattern center at tile top + 9, not tile center (`tileCenter` is top + th/2, 3622–3628). Labels at `screenPos.y − 34` (8516). Current admin sprite preview is a 72×72 `<img object-fit:contain>` (`AdminDashboard.tsx` 1223–1246) — wrong space, wrong anchor, no player/enemy comparison.  
SYSTEMS_AFFECTED: new `engine/visualPreview.ts`, AdminDashboard library panel  
RECOMMENDED_ACTION: Preview canvas: 80×40 diamond, draw point, player pixel dummy, enemy dummy, optional boss dummy, nearest-neighbor. Warn clip (y−34 / summon y−48), padding, scale mismatch, neighbor overlap, tablet 140×70 relative shrink, hit-rect overflow. Do not use the live RAF loop.  
AUTONOMY: IMPLEMENT_AFTER 003  
DEPENDENCIES: VAL-2026-08-31-003, VAL-2026-08-31-004  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: A 24×24 PNG sits visually comparable to the chess dummy; a 80×80 PNG triggers overlap/clip warnings.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-08-31-010  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Admin library CRUD — upload, activate, assign, revert, inspect  
CATEGORY: admin-ui  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Sprite panel already lists/edits URL configs but cannot activate, pool, version, or inspect dependents. Enemy form is a single optional URL (`AdminDashboard.tsx` 602–616). Access already gated (4760).  
SYSTEMS_AFFECTED: `AdminDashboard.tsx`, admin queries/mutations  
RECOMMENDED_ACTION: New carved-stone / crimson admin panel (existing Ankama/Dofus styling) for the operations in design §5. Revert-to-default clears binds. Dependency inspect lists assignments, pools, and best-effort live instance ids. Safe remove = inspect → deactivate → delete when zero dependents.  
AUTONOMY: HUMAN_REVIEW for UX; implement after 002–003.  
DEPENDENCIES: VAL-2026-08-31-002, VAL-2026-08-31-003, VAL-2026-08-31-015  
REGRESSION_RISK: LOW if kept admin-only.  
VALIDATION_REQUIRED: Non-admin cannot open. Activate/deactivate changes resolver without reload. Delete blocked while assigned.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-08-31-011  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Optional drawImage branch in drawCombatant with instant builtin fallback  
CATEGORY: renderer  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `drawCombatant` already injects resolvers and falls back to `king.front` on any miss (`pieceArt.ts` 809–811, 852–877). Player is still a separate `drawPixelPattern` call (8709–8720), not `drawCombatant`.  
SYSTEMS_AFFECTED: `data/pieceArt.ts`, player draw call site, image bitmap cache  
RECOMMENDED_ACTION: Add optional `getCustomVisual`. If it returns a decoded bitmap + profile, `drawImage` centered on the same draw point with `imageSmoothingEnabled = false`. On any failure, run existing branches. Cache bitmaps by assetId+version. Do not put decode or pool RNG in the rAF callback. Do not edit RAF loop structure.  
AUTONOMY: IMPLEMENT_AFTER 001+005; WX/player site is wiring only.  
DEPENDENCIES: VAL-2026-08-31-001, VAL-2026-08-31-005, VAL-2026-08-31-004  
REGRESSION_RISK: MEDIUM — wrong anchor or smoothing would shift hit-test perception. Sprite rects stay tile-sized (008).  
VALIDATION_REQUIRED: Custom on, then blob revoked → next frame builtin. Player + enemy + boss + summon each fallback independently.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-08-31-012  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Do not treat spriteUrl / PlayerSpriteConfig as the library  
CATEGORY: migration  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `getPlayerSpriteConfigs` / `frontUrl` have **zero** references in `WorldExploration.tsx`. `spriteUrl` is admin text only. `Character.pixelPattern` is saved (`CharacterCreation.tsx` 283) but the world player uses `chessPiecePatterns[pieceType]` (8683). Caffeine `ExternalBlob` is bindgen plumbing, not a sprite pipeline.  
SYSTEMS_AFFECTED: `EnemyConfig`, `PlayerSpriteConfig`, future import  
RECOMMENDED_ACTION: Leave stubs unused for combat. Optionally import existing URL rows as **inactive** library records. Do not `drawImage(spriteUrl)` as a shortcut. Decide later whether to deprecate the old types.  
AUTONOMY: DOCUMENT_THEN_HUMAN — no silent runtime bind.  
DEPENDENCIES: VAL-2026-08-31-002  
REGRESSION_RISK: HIGH if a hunter “completes” the unused URL fields.  
VALIDATION_REQUIRED: Filling `spriteUrl` in today’s admin still does not change world pixels (current behavior preserved until an explicit import).  
STATUS: NEW  

---

ACTION_ID: VAL-2026-08-31-013  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Family pixel patterns are ghost/minion-only — do not assume they are on-screen  
CATEGORY: renderer-gap  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: `drawCombatant` branch 3 runs only when `assignedName === "Ghost" || isBossMinion` (`pieceArt.ts` 920–946). Regular enemies with `family: "iron_golem"` still hit branch 4 chess art (977–1010). Family grids exist at `WorldExploration.tsx` 4148–4214 but are unused for those units.  
SYSTEMS_AFFECTED: `drawCombatant` branch 3 vs 4, family assignment  
RECOMMENDED_ACTION: Custom family assignment is a **new** presentation bind, not a repair of this gap. If a later change also paints family pixels for standard enemies, do it as its own ID — do not fold it into custom-upload work. Document this in the admin family-assign UI so owners are not surprised.  
AUTONOMY: DOCUMENT_ONLY unless a human wants family pixels on standard enemies.  
DEPENDENCIES: None  
REGRESSION_RISK: MEDIUM if someone “fixes” family draw as part of the library PR — changes default look for 30% of spawns.  
VALIDATION_REQUIRED: Empty library + family iron_golem still looks like a chess piece (today).  
STATUS: NEW  

---

ACTION_ID: VAL-2026-08-31-014  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Store bytes in object storage, not Motoko Text  
CATEGORY: storage  
PRIORITY: P1  
CONFIDENCE: MEDIUM  
EVIDENCE: Ad boxes and sprite configs store **URL strings** (`main.mo` 2585–2598, `PlayerSpriteConfig` 408–419). `ExternalBlob` is imported in `backend.ts` 54–55 but no visual blob API exists. No in-repo file-size cap. IC ingress / Caffeine limits were not measured in this run.  
SYSTEMS_AFFECTED: canister, Caffeine object storage, admin upload  
RECOMMENDED_ACTION: Metadata on canister; bytes via `ExternalBlob` (or measured equivalent). Record `SOURCE_METADATA.hash`. Starting reject **256 KiB/still** until ingress is measured, then replace the constant. Do not base64-dump into Motoko `Text`. URL-only v1 is acceptable if admin-only and validated at load.  
AUTONOMY: HUMAN_REVIEW — infra.  
DEPENDENCIES: VAL-2026-08-31-002  
REGRESSION_RISK: HIGH if large blobs land in actor stable memory.  
VALIDATION_REQUIRED: Over-cap upload rejected. Hash mismatch → `#invalid` → builtin.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-08-31-015  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Versioned replace and safe removal with dependency inspection  
CATEGORY: lifecycle  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: `adminDeletePlayerSpriteConfig` is a hard `remove` (`main.mo` 575–579) with no dependency check. Live combatants hold only `pieceType` / `family` / `id`, not an asset id (today).  
SYSTEMS_AFFECTED: admin delete/replace, resolver  
RECOMMENDED_ACTION: Replace increments `VERSION`, keeps `ASSET_ID`, retains previous bytes until prune. Delete is blocked while assignments or known live binds exist; owner can deactivate instead. Deactivated / deleted ids resolve to builtin the next frame (001), no pool re-roll (006).  
AUTONOMY: IMPLEMENT_AFTER 002+010  
DEPENDENCIES: VAL-2026-08-31-002, VAL-2026-08-31-006, VAL-2026-08-31-010  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Delete assigned asset fails; deactivate → builtin; replace keeps binds, new bytes show after reload.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-08-31-016  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Future categories stay ineligible until they have a measured profile  
CATEGORY: extensibility  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Portals are procedural whirlpools (`drawPortalWhirlpool` 4234+). Walls use `wallHeight = 28` (4430). Loot/hazards are separate passes. `AGENTS.md` requires explicit metadata, never name heuristics.  
SYSTEMS_AFFECTED: category enum, resolver  
RECOMMENDED_ACTION: `#future(Text)` may be stored. Resolver treats unknown categories as ineligible → current art. Adding a category requires a new render profile derived from that renderer (same method as §3). No matching on display names.  
AUTONOMY: DOCUMENT_THEN_IMPLEMENT when a category is actually needed.  
DEPENDENCIES: VAL-2026-08-31-004  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Asset tagged `#future("portal")` never replaces the whirlpool.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-08-31-017  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Extract visual logic to engine/ — do not grow WorldExploration  
CATEGORY: sensitive-code  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: AQA-2026-08-30-007 / `AGENTS.md`: no drive-by WX / RAF / mapGen / turn / damage edits. `WorldExploration.tsx` already hosts `drawPixelPattern`, boss patterns, family patterns, and spawn. Quality audit: 19k+ lines, heavy automation churn.  
SYSTEMS_AFFECTED: `engine/visualAssets.ts`, `engine/visualPreview.ts`, WX call sites  
RECOMMENDED_ACTION: New behavior lives in `src/frontend/src/engine/*` with tests. WX/admin get wiring only. Reject implementer PRs whose primary hunk is another WX branch for this feature.  
AUTONOMY: PROCESS — apply to every VAL implementer PR.  
DEPENDENCIES: AQA-2026-08-30-007  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Implementer diff: WX line delta small; tests sit beside the helper.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-08-31-018  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Defer walk-frame animation — four stills only in v1  
CATEGORY: scope  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: `PlayerSpriteConfig` walk-frame arrays (`admin.mo` 47–50, `AdminDashboard.tsx` 1311–1345) are never drawn. Facing is four stills via `currentView` / `playerView` (11690–11697).  
SYSTEMS_AFFECTED: upload UI, `DIRECTION_REFS`  
RECOMMENDED_ACTION: v1 accepts front/right/left/back stills. Missing side → front → builtin. Do not implement walk cycles, sprite sheets, or RAF frame indexes.  
AUTONOMY: SCOPE_GUARD  
DEPENDENCIES: VAL-2026-08-31-003  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Upload UI does not require walk frames. One-still player works.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-08-31-019  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Elite/large is metadata-only until a real elite type exists  
CATEGORY: category-model  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: No `isElite` field. `generateEnemyScaleFactors` (4928–4954) is random visual squash stored on the instance. `iron_golem` is a family HP multiplier (6265–6271), not elite. Occupancy is always one tile.  
SYSTEMS_AFFECTED: `ELITE_ONLY`, `enemy_elite` profile  
RECOMMENDED_ACTION: Keep `ELITE_ONLY` on the record. Until an explicit elite flag exists, elite-only assets are ineligible for random pools (builtin). Do not infer elite from `scaleY` or HP. Do not grow collision for “large” art.  
AUTONOMY: DOCUMENT_THEN_IMPLEMENT  
DEPENDENCIES: VAL-2026-08-31-004, VAL-2026-08-31-006, VAL-2026-08-31-008  
REGRESSION_RISK: MEDIUM if scale 1.4 is treated as elite gameplay.  
VALIDATION_REQUIRED: `ELITE_ONLY` asset never appears on a default-family pawn while no elite flag exists.  
STATUS: NEW

ACTION_ID: TBC-2026-08-31-001  
SOURCE_AUTOMATION: Telemetry-Driven Balance & Content Analyst  
TITLE: Keep balance/content analysis gated until real telemetry exists  
CATEGORY: telemetry  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: 2026-08-31 cron run (`bc-9825c839`) found no telemetry files, no analytics SDK, no event export, and 0 rows in every analysis domain. Quality Auditor 2026-08-30 already recorded “Player telemetry: None.” Inventing win rates or inferring difficulty from combat source would violate this analyst’s activation guard.  
SYSTEMS_AFFECTED: Telemetry-Driven Balance & Content Analyst (`2786666f-a4a0-11f1-a7d1-d6b4613131ce`); Master Technical Director; any Game Balance specialist  
RECOMMENDED_ACTION: Next TBC cron must re-check collectors first. If still empty, emit WAITING_FOR_TELEMETRY only. Master Technical Director must not open balance PRs from a WAITING_FOR_TELEMETRY packet.  
AUTONOMY: REPORT_ONLY  
DEPENDENCIES: None  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Next TBC report is either still WAITING_FOR_TELEMETRY with a fresh search, or cites real event counts with sample sizes.  
STATUS: NEW  

---

ACTION_ID: TBC-2026-08-31-002  
SOURCE_AUTOMATION: Telemetry-Driven Balance & Content Analyst  
TITLE: Human-design backend-authoritative gameplay events for balance analysis  
CATEGORY: telemetry  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Required domains (enemy win/loss, relative difficulty, battle duration, death causes, spell usage/discovery/sources/combinations, boss and challenge completion, Doka earned/spent, dungeon performance, content usage) all have collector=no and rows=0. Wallet Nat, killCount, leaderboard, spell-bar snapshots, and achievement flags are progress state, not an event series. `AQA-2026-08-30-012` covers persist/victory/recap/shop counters only.  
SYSTEMS_AFFECTED: `src/backend/main.mo` (new query-only or persist-lock-safe counters); optional export; this analyst as consumer  
RECOMMENDED_ACTION: Human-designed event schema matching `docs/automation/TELEMETRY_BALANCE_2026-08-31.md` “Required measurements.” Include playerLevel and content id on every row (no level cap — relative bands only). Do not change damage math, RAF, map gen, or turn logic. Do not start from client-only logs. Extend `AQA-2026-08-30-012`; do not open a second persist-counter PR.  
AUTONOMY: HUMAN_APPROVAL_REQUIRED  
DEPENDENCIES: AQA-2026-08-30-012  
REGRESSION_RISK: MEDIUM if events write Doka/XP off `createProgressPersist` or invent a second wallet path. LOW if query-only increment counters that never call `saveBattleStats` / `applyRewards`.  
VALIDATION_REQUIRED: A later TBC run can query ≥1 UTC day of `battle_end` and `spell_cast` (and state sample size). Until then this analyst stays WAITING_FOR_TELEMETRY.  
STATUS: NEW

ACTION_ID: WDEAD-2026-08-31-001  
SOURCE_AUTOMATION: World, Dungeon & Encounter Admin Designer  
TITLE: Remove hard level ceilings from spawn, regions, dungeons, and AI  
CATEGORY: indefinite-progression  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: `src/frontend/src/engine/combatMath.ts` lines 54–58 set `maxTier = Math.floor(999 / ts)` so `pickEnemyLevelFromTiers` cannot emit levels above ~999. `computeAITier` (lines 36–51) buckets stop at 900 then hard-tier 10; 30% of rolls are uniform `1..10`. Admin `newEnemy` / `newRegion` default `levelMax: 5` (`AdminDashboard.tsx` 108–118). Region effects apply only when `level <= Number(r.levelMax)` (`WorldExploration.tsx` 3517–3524). Map `levelZone.maxLevel` is the current tier top (WX 5057–5068). Dungeon extra-enemy / tier-boost / Doka tables all `Math.min(depth, 5)` (WX 6082–6083, 1201–1203; `useDungeonState.ts` 10–21; `portalRules.ts` 148–161). Chain length is `3 + floor(random*3)` (WX 6693, 6785). Death Realm rebuilds still stamp `maxLevel: 5` (WX 13567, 13699).  
SYSTEMS_AFFECTED: `combatMath.ts` spawn picker; region matching; dungeon depth curves; admin Enemy/Region forms; Death Realm zone stamps. Not RAF, not damage math.  
RECOMMENDED_ACTION: Replace every required `levelMax` / `999` / `min(depth, 5)` / AI-tier-10 stop with relative offsets and open tails. Regions use `levelMin` + optional preferred band with overflow fade, never reject. Dungeon curves stay defined for depth 6+. AI sophistication becomes a probability, not a 10-bucket ceiling. Keep player XP curve `100 * 2^(N-1)` unchanged.  
AUTONOMY: HUMAN_APPROVE — extract pickers to `engine/spawnPolicy.ts`; do not patch formulas inside WX generate.  
DEPENDENCIES: None  
REGRESSION_RISK: HIGH if the 999 cap is deleted without a relative tail — early maps could spawn absurd offsets. Mitigate by porting current 60/20/10/5 weights to equal/adjacent/tail first, then removing the cap.  
VALIDATION_REQUIRED: Unit tests at player levels 1, 100, 1_000, 10_000, 50_000: enemy level is defined, finite, and can exceed 999. Region effects still apply at level 10_000. Dungeon depth 8 still has a multiplier. `pnpm typecheck` clean.  
STATUS: NEW  

---

ACTION_ID: WDEAD-2026-08-31-002  
SOURCE_AUTOMATION: World, Dungeon & Encounter Admin Designer  
TITLE: Relative spawn owner surface — equal-level, above-level, open tail, no max  
CATEGORY: spawn-admin  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Tiers tab (`AdminDashboard.tsx` 3353–3703) exposes `sameTierPercent` / `adjacentTierPercent` / `twoAwayPercent` / `threeOrMorePercent` and requires sum 100. Adjacent and ±2 are split evenly above/below (`combatMath.ts` 82–89). There is no equal-level or above-level knob. `levelVarianceChance` exists on the engine type (`combatMath.ts` 11, 60–69) but not on frontend `TierSpawnConfig` (`gameTypes.ts` 418–424) and is not on the tab. Preview samples only `[1, 10, 25, 50, 100, 200, 500]` (3407). Tier-size input is `max={100}` (3488–3489). Save writes `localStorage` then backend (3393–3398).  
SYSTEMS_AFFECTED: Admin Tiers/Spawn tab; `TierSpawnConfig` Candid; `loadTierConfig` / `pickEnemyLevelFromTiers`.  
RECOMMENDED_ACTION: Owner fields: `equalLevelProbability`, `aboveLevelProbability`, `belowLevelProbability` (or remainder), `aboveOffsetWeights`, `belowOffsetWeights`, `openTail`. Forbid a max-level field on the form. Preview accepts an arbitrary hypothetical level including 50_000. Keep backend-authoritative; localStorage cache only.  
AUTONOMY: HUMAN_APPROVE then implementer. Draft-only until WDEAD-2026-08-31-004 exists.  
DEPENDENCIES: WDEAD-2026-08-31-001 (cap removal); WDEAD-2026-08-31-004 (do not live-save)  
REGRESSION_RISK: MEDIUM — mis-normalized percents can flood above-level packs. Validate-gate must normalize and show the histogram before activate.  
VALIDATION_REQUIRED: Admin preview at level 50_000 shows a defined distribution. Sim (003) reports below/equal/above within 2pp of configured weights at N=5000. No `levelMax` in the spawn payload.  
STATUS: NEW  

---

ACTION_ID: WDEAD-2026-08-31-003  
SOURCE_AUTOMATION: World, Dungeon & Encounter Admin Designer  
TITLE: Non-persistent Simulation Laboratory for hypothetical levels and many encounters  
CATEGORY: simulation-lab  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: `engine/mapGen.simulate.ts` is a seeded solvability replica (file header lines 1–5) and does not report families, elites, AI, rare spells, or difficulty. Tiers tab preview is a static percentage table, not a Monte Carlo. No admin tab exists for N-encounter rolls. Live `generateEnemies` (`WorldExploration.tsx` 6073–6330) is a React callback closed over `characterStats` — running it “for science” would use the real character and can be followed by real battles / `applyRewards`. Quality audit AQA-2026-08-30-012 already notes zero encounter telemetry.  
SYSTEMS_AFFECTED: new `engine/encounterSim.ts` (proposed); Admin Simulation tab (dev-only). Must not touch persist lock, `rewardResolver.ts`, `saveBattleStats`, character queries.  
RECOMMENDED_ACTION: Dev-only lab: inputs = hypothetical player level (unbounded), draft pack, N, seed, mode filter. Reports = relative-level histogram, below/equal/above, families, variants, elites, AI bands, rare spells, discovery opportunities, formations, estimated difficulty (display only). Isolation: zero actor updates, zero persist enqueue, zero player `localStorage` writes, zero real map install. Support level 50_000 without clamping to 999.  
AUTONOMY: HUMAN_APPROVE. Lab may be implemented before live spawn cutover if it calls extracted pure pickers only.  
DEPENDENCIES: WDEAD-2026-08-31-001 and 002 for meaningful extreme-level reports; 004 to bind results to a draft.  
REGRESSION_RISK: HIGH if the lab reuses WX `generateEnemies` / portal entry — a single missed branch writes economy. Require an allow-list test that spies actor methods and fails on any `applyRewards` / `saveBattleStats`.  
VALIDATION_REQUIRED: 10_000 simulated encounters at levels 1 and 50_000; wallet, XP, spell levels, dungeonRecords, boss-rush state unchanged. `pnpm typecheck`. Dev-only gate: normal `user` role cannot open the pane.  
STATUS: NEW  

---

ACTION_ID: WDEAD-2026-08-31-004  
SOURCE_AUTOMATION: World, Dungeon & Encounter Admin Designer  
TITLE: Install DRAFT → SIMULATE → VALIDATE → ACTIVATE for world-content packs  
CATEGORY: admin-lifecycle  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Tiers save writes live immediately (`AdminDashboard.tsx` 3387–3403). Boss Rush save writes `localStorage` then `adminSetBossRushConfig(JSON.stringify)` (6383–6393). Enemy/region/spell/modifier CRUD is `adminSet*` with no draft. Architecture (`docs/ARCHITECTURE.md` 206–214) documents live `adminSet*` as the operator path. There is no validate step beyond “percents sum to 100” (Tiers 3375–3380).  
SYSTEMS_AFFECTED: new pack record (backend `#admin`); Admin Drafts tab; hydrate path that currently reads `pbv_tier_spawn_config` / `bossRushConfig`.  
RECOMMENDED_ACTION: Store packs with `status: draft | simulating | validated | active | archived`. Edits land on draft. Simulate attaches a report. Validate runs the gate list in the 2026-08-31 brief §6 (no hard max, normalized probabilities, open tail, id integrity, relative reward curves, no `min(depth,5)`, sim isolation, single reward funnel, `#admin` activate). Activate swaps the pointer; players hydrate **active** only.  
AUTONOMY: HUMAN_APPROVE — canister schema change; do not deploy `backend_extended`.  
DEPENDENCIES: WDEAD-2026-08-31-003 for the simulate stage  
REGRESSION_RISK: MEDIUM — a botched activate could wipe live tier weights. Keep the current `TierSpawnConfig` as the v0 active pack during migrate.  
VALIDATION_REQUIRED: Saving a draft does not change overworld spawn. Activate after failed validate is rejected. After activate, a new session hydrates the new pack from backend (localStorage is cache).  
STATUS: NEW  

---

ACTION_ID: WDEAD-2026-08-31-005  
SOURCE_AUTOMATION: World, Dungeon & Encounter Admin Designer  
TITLE: Encounter catalog — pools, formations, rarity, objectives, rewards, hazards, rules  
CATEGORY: encounters  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `generateEnemies` (WX 6084–6330) rolls size `1 + rand*8` (+ dungeon table), random chess piece, quadrant scatter, Chebyshev ≥ 4, then 30% family. No formation catalog. No encounter rarity. Objectives are a separate hardcoded `DEFAULT_CHALLENGES` list (`challengeCompletion.ts` 38–103), not bound to a pack. Hazards are map tiles (`HazardTileType` lava/ice/spikes) plus modifiers, not encounter-scoped. No encounter rule metadata (flee, leader-last, timer).  
SYSTEMS_AFFECTED: new `EncounterTemplate` catalog; `engine/encounterFormations.ts` (proposed); challenge bind; hazard/rule ids. WX should only consume a built roster.  
RECOMMENDED_ACTION: Owner CRUD for encounter templates with explicit ids: `enemyPoolIds`, `formationId` (cell dx/dy + role), `rarity` weight, `relativeDifficulty`, `objectiveIds`, `rewardCurve`, `hazardIds`, `ruleIds`. Formations are metadata, never name heuristics. Do not add this as a WX branch.  
AUTONOMY: HUMAN_APPROVE after 001–004. Extract helpers; one-line WX wiring.  
DEPENDENCIES: WDEAD-2026-08-31-006 (pools must be live archetypes); 010 (relative rewards); 004 (draft lifecycle)  
REGRESSION_RISK: MEDIUM — a formation that cannot place on CA maps softlocks a fight. Validate must fall back to current quadrant scatter when a formation is infeasible, and sim must report infeasible rate.  
VALIDATION_REQUIRED: Sim reports formation histogram and infeasible %. Existing challenge predicates still compile. No mapGen edits.  
STATUS: NEW  

---

ACTION_ID: WDEAD-2026-08-31-006  
SOURCE_AUTOMATION: World, Dungeon & Encounter Admin Designer  
TITLE: Replace dead EnemyConfig spawn CRUD with archetypes the roster actually samples  
CATEGORY: encounters  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Backend `EnemyConfig` (`src/backend/types/admin.mo` 15–26) and admin Enemies tab persist `hp/ap/mp/initStat/levelMin/levelMax/regions`. `WorldExploration.tsx` has **zero** `enemyConfigs` / `useGetEnemyConfigs` reads. Roster stats come from `pickEnemyLevelFromTiers` + `computeEnemyStats` / `getEnemyBaseStats` (`progression.ts`). Architecture already warns of two EnemyConfig types (`docs/ARCHITECTURE.md` 29). Admin absolute HP fights the level formula.  
SYSTEMS_AFFECTED: `admin.mo` EnemyConfig; Admin Enemies tab; future spawn sampler.  
RECOMMENDED_ACTION: Stop presenting EnemyConfig as a combat-stat source. Introduce `EnemyArchetype { id, familyId, pieceWeights, statMults, spellPoolIds, eliteCapable }` that `generateEnemies` / sim actually sample. Keep sprite/name fields. Reject absolute combat stats on the owner form (formulas stay in `progression.ts`).  
AUTONOMY: HUMAN_APPROVE — Candid change; carry killCount/12-field stats discipline on any character payload left untouched.  
DEPENDENCIES: WDEAD-2026-08-31-001 (no levelMax on the replacement type); 005  
REGRESSION_RISK: LOW for live play (config is already unused). MEDIUM if a migrate writes absolute HP onto combatants and bypasses `getEnemyBaseStats`.  
VALIDATION_REQUIRED: After cutover, toggling an archetype weight changes sim family histogram. Live spawn no longer ignores the admin pool. Existing 12-field `CharacterStats` path unchanged.  
STATUS: NEW  

---

ACTION_ID: WDEAD-2026-08-31-007  
SOURCE_AUTOMATION: World, Dungeon & Encounter Admin Designer  
TITLE: Dungeon owner policy — room pools, sequencing, rest, branching, bosses, unbounded rewards  
CATEGORY: dungeons  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Dungeon entry is a hardcoded 20% world portal (WX 5229–5257). Chain length is 3–5 (WX 6785). Floors reuse `generateRandomMap` + extra enemies / tier boost clamped at 5 (WX 6080–6085). Rest is a 10% **world** portal (WX 5295–5316), not a dungeon room; rest-exit may arm a chain (WX 6688–6695). Bosses are a separate 15% world portal (WX 5261–5292), not dungeon bosses. No branch graph. Completion bonus is `maxDepth * 50` (`portalRules.ts` 195–197). `dungeonRecords` is Principal-keyed progress only (`ARCHITECTURE.md` 122, 314), not content.  
SYSTEMS_AFFECTED: dungeon entry/length/reward policy; rest-room policy; portalRules snapshot/decide (must keep `snapshotDungeonChain` before `cleanupMap`).  
RECOMMENDED_ACTION: Owner `DungeonPolicy`: entry chance, length or continue-weights (no hidden 5), room-pool ids (archetypes the existing generator may draw — **do not fork mapGen**), sequence / branch graph, special-room weights, rest-room policy, boss-from-depth + relative scale, dungeon-scoped modifiers, unbounded reward + completion curves. Unify multiplier tables first (013).  
AUTONOMY: HUMAN_APPROVE. AGENTS.md forbids map-generation implementation; this ID is policy + call-site wiring only.  
DEPENDENCIES: WDEAD-2026-08-31-013; 001; 004; 010  
REGRESSION_RISK: HIGH if portal snapshot/cleanup order is revisited. Do not touch `cleanupMap` zeroing semantics.  
VALIDATION_REQUIRED: `portalRules.test.ts` still passes. Depth 8 has a defined multiplier. Rest rooms inside a chain do not spawn overworld colored portals (`filterRunPortals`). No `mapGen.ts` hunk.  
STATUS: NEW  

---

ACTION_ID: WDEAD-2026-08-31-008  
SOURCE_AUTOMATION: World, Dungeon & Encounter Admin Designer  
TITLE: Boss Rush — configurable pools, relative scaling, progression, multipliers, sequencing  
CATEGORY: boss-rush  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Runtime rooms are a 10-element const (`useBossRush.ts` 23–134) with flat 500–5000 Doka / 200–2000 XP and hardcoded pairs. Admin tab (WX dashboard 6310–6412) only toggles `room_N_enabled` and a multiplier; pairs are labels, not editors. Entry chance is magic 0.08 (WX 5318–5323). Boss combat HP is absolute (`defaultBossConfigs` in `admin.mo`; battle start uses `bossConf.baseStats.hp` at WX 12235–12240). Config JSON is a string blob (`adminSetBossRushConfig`). Security audit still flags `completeBossRushRoom` as a client-trusted reward write.  
SYSTEMS_AFFECTED: `useBossRush.ts`; Admin Boss Rush tab; boss stat init; persist via `bossRushProgress.ts` / `rewardResolver.ts`.  
RECOMMENDED_ACTION: Owner policy: `bossPoolIds`, pairing, draftable `roomSequence`, `relativeScale = f(playerLevel) * roomCurve`, progression as policy (not a hardcoded 10), `rewardMultiplierCurve`. Pay still goes through the existing persist lock + `applyRewards`. Do not add a second wallet write. Relative scale bosses so a level-5000 player does not one-shot 800 HP.  
AUTONOMY: HUMAN_APPROVE. Do not “fix” canister trust in the same PR.  
DEPENDENCIES: WDEAD-2026-08-31-014 (backend bosses); 004; 010; 001  
REGRESSION_RISK: HIGH on room-0 farm / jackpot resume (`bossRushProgress.ts` already resets after the final room). Sequence edits must keep that guard.  
VALIDATION_REQUIRED: Existing `bossRushProgress.test.ts` stays green. Sim can roll rush rooms at hypothetical level 10_000 without writing `getBossRushState`. Enabled-room disable still shortens a run without leaving a resumable jackpot.  
STATUS: NEW  

---

ACTION_ID: WDEAD-2026-08-31-009  
SOURCE_AUTOMATION: World, Dungeon & Encounter Admin Designer  
TITLE: World-event catalog — eligibility, rarity, hazards, elites, rare-spell-bearers, rewards, modifiers  
CATEGORY: world-events  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: No event type exists. Closest scraps: map-modifier two-roll (`gameConstants.ts` 306–308; admin Modifiers tab); jackpot heal banner (WX 930–931, 17928+); betrayal gated at AI tier 10 (`gameConstants.ts` 204, `ENEMY_AI_TIER_GATES.betrayal`); leader boost (`AdminGameConfig.leaderBoostPercent`); family 30% including `void_mirror`. Elites are not a flag. Rare spell-bearers are not a flag. Eligibility cannot be expressed without `levelMax` today.  
SYSTEMS_AFFECTED: new `WorldEvent` catalog; modifier roll; elite/rare-spell spawn flags; eligibility vs region/runMode.  
RECOMMENDED_ACTION: Owner events with open-ended eligibility (runMode, region ids, relative band — overflow allowed), rarity weight, hazard ids, `elitePolicy`, `rareSpellBearerPolicy` (explicit `spellPoolIds`, never name heuristics), `rewardCurve`, `modifierIds`. Elite ≠ leader. Jackpot / betrayal can later become event ids; do not reimplement them inside WX while designing the catalog.  
AUTONOMY: HUMAN_APPROVE. Catalog + sim first; live wiring after 004.  
DEPENDENCIES: WDEAD-2026-08-31-011; 012; 010; 004  
REGRESSION_RISK: MEDIUM if jackpot is moved off the persist-safe spend path (AQA jackpot cluster). Keep jackpot on the existing wallet lock until a dedicated migrate.  
VALIDATION_REQUIRED: Sim at level 50_000 still emits elites/rare-spells at configured rates. Event eligibility never uses `levelMax` reject. Modifier roll remains behind `#admin` draft until activate.  
STATUS: NEW  

---

ACTION_ID: WDEAD-2026-08-31-010  
SOURCE_AUTOMATION: World, Dungeon & Encounter Admin Designer  
TITLE: Relative reward curves for challenges, dungeons, rush rooms, and events  
CATEGORY: economy  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `DEFAULT_CHALLENGES` pays flat 50–500 Doka and 400–1000 XP (`challengeCompletion.ts` 38–103). Dungeon Doka is a 6-slot table that freezes at 4.0× (`useDungeonState.ts` 10–21). Completion bonus is `maxDepth * 50` (`portalRules.ts` 195–197). Boss Rush rooms pay flat 500–5000 / 200–2000 (`useBossRush.ts`). `applyRewards` is Nat-only and cannot subtract (death penalty stays on `saveBattleStats`). Architecture requires a single atomic funnel + root recap.  
SYSTEMS_AFFECTED: `challengeCompletion.ts` advertised rewards; dungeon multiplier module; rush room rewards; future event rewards; `rewardResolver.ts` (read-only consumer).  
RECOMMENDED_ACTION: Owner `RewardCurve` `{ base, perPlayerLevel, perRelativeDifficulty, perRarity }` (exact shape negotiable) for challenges / dungeon floors / rush rooms / events. Advertise the evaluated amount; persist only through `applyRewards` (credits) or `saveBattleStats` (absolute heals/spends/death). Never call the resolver per kill. Never invent a second wallet write.  
AUTONOMY: HUMAN_APPROVE — economy. Implementer must enqueue on `createProgressPersist`.  
DEPENDENCIES: WDEAD-2026-08-31-004; 007; 008; 005  
REGRESSION_RISK: HIGH if curves are evaluated on the canister from client-supplied level (security findings 2/5/6). Evaluate on the official client from authoritative character level, then persist the delta through the lock; or clamp like the open economy PR. Do not silently raise shop auto-complete.  
VALIDATION_REQUIRED: Recap popup still shows one atomic reward. Death penalty 20% XP / 40% Doka unchanged. Challenge helper tests still pass with curve-evaluated numbers. Sim must not credit.  
STATUS: NEW  

---

ACTION_ID: WDEAD-2026-08-31-011  
SOURCE_AUTOMATION: World, Dungeon & Encounter Admin Designer  
TITLE: Owner knobs for elite, variant, encounter size, family weights, AI sophistication  
CATEGORY: spawn-admin  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Family variant is `if (Math.random() < 0.3)` over seven equal families (WX 6236–6326). Encounter size is `Math.floor(Math.random() * 8) + 1` plus `[0,2,3,4,4,5][min(depth,5)]` (WX 6082–6085). `MAX_ENEMIES = 20` (`gameConstants.ts` 10). No elite flag on `Enemy` (`gameTypes.ts` 259–331 has `isLeader` but not `isElite`). AI uses `computeAITier` 10-bucket + 30% chaos (`combatMath.ts` 34–51) and gates in `ENEMY_AI_TIER_GATES` (`gameConstants.ts` 200–209).  
SYSTEMS_AFFECTED: `generateEnemies` extract; `Enemy` metadata (`isElite`, `isVariant` as explicit flags); admin Spawn tab.  
RECOMMENDED_ACTION: First-class probabilities: elite, variant, family weights, encounter `{min,max,depthCurve}`, AI-sophistication probability (gates stay named constants; the *chance* an enemy is allowed to roll high gates is owner-owned). Size curve must work at dungeon depth 8+. Do not use family name substrings (`family.includes("berserk")` in `enemyAI.ts` 441–442) for new content — add `aiStrategy` metadata.  
AUTONOMY: HUMAN_APPROVE. Extract from WX; do not add another inline roll block.  
DEPENDENCIES: WDEAD-2026-08-31-002; 001; 006  
REGRESSION_RISK: MEDIUM — raising `MAX_ENEMIES` without occupancy tests can break initiative / victory leftover-roster. Cap is a *board* limit, not a player-level cap; keep a safety board cap but do not encode it as a progression ceiling.  
VALIDATION_REQUIRED: Sim family histogram matches weights ±2pp. Elite rate matches. Existing summon hostility / leftover-roster tests still pass at size 8.  
STATUS: NEW  

---

ACTION_ID: WDEAD-2026-08-31-012  
SOURCE_AUTOMATION: World, Dungeon & Encounter Admin Designer  
TITLE: Asymptotic summoner chance and explicit advanced-spell pool (fix NaN levelZone)  
CATEGORY: spawn-admin  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Battle start assigns kits via `buildEnemyKit(enemy.pieceType, currentMap.levelZone)` (WX 12186). `buildEnemyKit` types `levelZone: number` (`enemyAI.ts` 187–192) and `ENEMY_KITS` only branch `z >= 1` / `z >= 2` (156–178). `currentMap.levelZone` is a `LevelZone` object (`{ name, minLevel, maxLevel }`, WX 465–470, 5064–5068). `Math.floor(object)` is `NaN`, so kits stay on the early branch — “advanced” spells barely appear. Separately, `ENEMY_SUMMONER_CHANCE = 0.12 + characterStats.level * 0.02` (WX 12198–12200, constants 298–299) is linear and unclamped: by level ~44 every non-summon is a summoner, which is a variety ceiling.  
SYSTEMS_AFFECTED: WX battle-start spell assign; `ENEMY_KITS`; summoner roll; future advanced-spell probability.  
RECOMMENDED_ACTION: Pass an explicit numeric band or, better, an `advancedSpellProbability` + `advancedSpellPoolIds` (usableByEnemy, metadata — no name heuristics). Summoner chance becomes an asymptotic curve `base + (1-base)*(1-exp(-k*level))` or owner-defined, never a linear climb to 100%. Do not expand kit bands as a hidden level cap.  
AUTONOMY: HUMAN_APPROVE. One-line WX fix for the object/number mismatch is in scope for an implementer; do not retune damage.  
DEPENDENCIES: WDEAD-2026-08-31-011; 009 (rare-spell-bearers use the same pool)  
REGRESSION_RISK: MEDIUM — suddenly passing `minLevel` as the number would jump many kits from band 0 to band 2. Ship behind draft/sim so owners see the advanced-spell rate before activate.  
VALIDATION_REQUIRED: Unit test: `buildEnemyKit("queen", { name: "Tier 1", minLevel: 1, maxLevel: 10 })` must not silently NaN (implementer decides the adapter). Sim advanced-spell rate at level 50_000 is not 100% unless the owner set it there. Summoner rate at level 10_000 is < 1.0 for default curve.  
STATUS: NEW  

---

ACTION_ID: WDEAD-2026-08-31-013  
SOURCE_AUTOMATION: World, Dungeon & Encounter Admin Designer  
TITLE: Unify the triplicated dungeon Doka multiplier tables before owner editing  
CATEGORY: dungeons  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Identical clamp-5 tables live in `WorldExploration.tsx` 1201–1203, `useDungeonState.ts` 10–21 (`DUNGEON_DOKA_MULTIPLIERS` + `getDungeonMultiplier`), and `portalRules.ts` 148–161 (`dungeonDokaMultiplierFor`). Comments in `portalRules.ts` 151–154 already warn React state can inflate overworld kills after reset. Owner curves cannot be added three times.  
SYSTEMS_AFFECTED: those three files; reward-time multiplier reads.  
RECOMMENDED_ACTION: One module, one function, depth-unbounded curve (after 001). WX and portalRules call it. Owner later edits that module’s config via the pack (007), not a fourth copy.  
AUTONOMY: IMPLEMENT_WHEN_PICKED — mechanical extract, no gameplay intent change until 007.  
DEPENDENCIES: None to extract; 001/007 to unclamp  
REGRESSION_RISK: MEDIUM if the extract reads stale React depth instead of refs (the bug `dungeonDokaMultiplierFor` was written to prevent). Tests must drive refs, not state.  
VALIDATION_REQUIRED: `portalRules.test.ts` + a helper test that resetRunState returns multiplier 1. `pnpm typecheck`.  
STATUS: NEW  

---

ACTION_ID: WDEAD-2026-08-31-014  
SOURCE_AUTOMATION: World, Dungeon & Encounter Admin Designer  
TITLE: Backend-authoritative boss configs — stop writing `pbv_boss_configs` as source of truth  
CATEGORY: bosses  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: `useAdminQueries.ts` 462–517 documents “localStorage-backed until backend endpoints land” and reads/writes `pbv_boss_configs`. Architecture (`docs/ARCHITECTURE.md` 59) lists that key as a known exception. Backend already has `BossConfig` / `defaultBossConfigs` (`admin.mo` 349+) and architecture CRUD table includes boss (`ARCHITECTURE.md` 214). Admin Bosses tab uses `useSetBossConfig` / `useDeleteBossConfig` / `useGetAllBossConfigs` — the set/delete hooks shown are the localStorage pair.  
SYSTEMS_AFFECTED: `useAdminQueries.ts` boss hooks; Admin Bosses tab; rush pool (008).  
RECOMMENDED_ACTION: Point set/get/delete at backend `adminSet*` / `getAllBossConfigs`. `localStorage` becomes cache only, matching AGENTS.md. Required for a trustworthy rush pool and relative scale.  
AUTONOMY: HUMAN_APPROVE — confirm live canister actually exposes the boss admin methods before cutover (deployed canister can lag source).  
DEPENDENCIES: None  
REGRESSION_RISK: MEDIUM if the live actor lacks the methods — saves would fail closed. Feature-detect and keep cache fallback until upgrade, but mark cache stale.  
VALIDATION_REQUIRED: Admin save + reload (cleared localStorage) still shows the boss. No 15-field stats payload. Canonical actor remains `src/backend/main.mo`.  
STATUS: NEW  

---

ACTION_ID: WDEAD-2026-08-31-015  
SOURCE_AUTOMATION: World, Dungeon & Encounter Admin Designer  
TITLE: Keep admin, drafts, and the simulation lab dev-gated — never a normal-player surface  
CATEGORY: gating  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: AGENTS.md: “All admin and debug features must be dev-only/gated and never ship to normal players.” Architecture (`docs/ARCHITECTURE.md` 206–219): UI lazy-loads when `isAdmin && onOpenAdmin`; first non-anonymous `getUserRole` caller becomes `#admin`. `App.tsx` 361–372 mounts `AdminDashboard` from a LandingPage hidden login as well as the in-game button (427–428). Simulation lab (003) would be a new mint-adjacent surface if visible to that first player in production.  
SYSTEMS_AFFECTED: `App.tsx` admin entry; Admin dashboard; proposed Simulation / Drafts tabs.  
RECOMMENDED_ACTION: Gate Simulation, Drafts, Activate, and spawn inspection behind dev/admin AND a build flag (or equivalent) so a production first-login admin cannot casually activate a draft or run 10_000 sims on a player build. Backend already requires `#admin` on writes — keep that. Do not add player-facing “create encounter” UI.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: WDEAD-2026-08-31-003; 004  
REGRESSION_RISK: LOW for combat. MEDIUM for operators if the flag hides the only admin entry — keep existing CRUD reachable for the true operator, hide lab/activate on player builds.  
VALIDATION_REQUIRED: A `user` role session cannot open Simulation or Activate. Player recap / reward funnel unchanged. Debug overlay remains reachable during load/crash (existing rule).  
STATUS: NEW

ACTION_ID: EED-2026-08-31-001  
SOURCE_AUTOMATION: Dungeon and Encounter Evolution Designer (`73740435-a493-11f1-a7d1-d6b4613131ce`)  
TITLE: Progression-proof encounter catalog (design only)  
CATEGORY: design  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Cron run 2026-08-31. No prior `ENCOUNTER_ID` catalog in-repo. Live systems already have archetypes, kits-by-zone, hazards, rest exits, dungeon-chain depth, 19 bosses, 10-room Boss Rush, and optional challenges — but overworld fights still scale mostly by pack level.  
RECOMMENDED_ACTION: Human or orchestrator picks IDs from `docs/encounters/ENCOUNTER_EVOLUTION_2026-08-31.md`. Do not implement production code from this ACTION_ID. First implementer slice if approved: ENC-TEACH-01, ENC-HAZ-01, ENC-WAVE-01.  
DEPENDENCIES: None  
REGRESSION_RISK: NONE — docs only  
VALIDATION_REQUIRED: Catalog contains all requested types (waves, survival, elite, ambush, reinforcements, protection, priority, movement, hazard, rare elite, treasure/risk, rest, branch, mini-boss, rush variants, spell-discovery) and every entry is STATUS: PROPOSED.  
STATUS: OPEN

ACTION_ID: PXA-2026-08-31-001  
SOURCE_AUTOMATION: Player Experience Coherence Auditor  
TITLE: Restore spell discovery — stop granting the full catalog as innate  
CATEGORY: spell-discovery  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: `WorldExploration.tsx` 2242–2243 marks every `starterSpells` entry `isBaseSpell` (“always shown, never removable”). `data/spellData.ts` 27–691 is 32 identities (Strike through five summons). The 8-slot bar (`SpellbookModal` / `setSpellBarOrder` max 8) therefore filters a gifted library; it does not unlock one. Backend spells not in `OLD_SPELL_NAMES_SET` (2203–2236) merge into the same owned pool (2257–2271), including `admin.mo` `defaultSpells()` 168–191 (`vampire_bite`, `void_collapse` at minLevel 30, `reflect_barrier`, …). No `discoverSpell` / loot / unlock path exists in `src/frontend`. This is the opposite of the protected “spell-discovery excitement.” A no-cap game can drip tools forever; a gifted 32-spell book cannot.  
SYSTEMS_AFFECTED: spells, spell discovery, spellbook, admin spells, progression  
RECOMMENDED_ACTION: REWORK. Innate set = Strike + at most 2–3 starters (one defend, one reach, one sustain). All other current starters become findable (portal, named enemy, dungeon depth, boss, admin-authored drop) with explicit `SpellConfig` ids. Backend `defaultSpells()` must enter the same unlock table, not the create-time union. Keep the 8-slot bar as the loadout commitment.  
AUTONOMY: HUMAN_DESIGN_REQUIRED  
DEPENDENCIES: PXA-2026-08-31-002 (merge clones before locking the unlock table); PXA-2026-08-31-005; PXA-2026-08-31-015  
REGRESSION_RISK: HIGH — existing characters already own the full innate set via `spellBarOrder`. Need a one-time migrate: preserve equipped 8, mark the rest as unlocked-in-book so veterans are not stripped.  
VALIDATION_REQUIRED: New profile owns ≤4 spells. A distinct find event adds exactly one id to owned, not to innate. `pnpm typecheck`. Play: first three maps do not open a 30-row book.  
STATUS: NEW  

---

ACTION_ID: PXA-2026-08-31-002  
SOURCE_AUTOMATION: Player Experience Coherence Auditor  
TITLE: Merge overlapping spell identities into one tool each  
CATEGORY: spells  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Near-duplicates in `spellData.ts`: Shield (`starter-shield` 30–47) and Iron Skin (`spell-iron-skin` 293–312) are both +30% RES / 3 turns. Poison Arrow (48–67) and Venom Strike (394–415) are both 4 DoT × 3, no upfront. Blood Mend (84–102) and Rallying Cry (416–436) are both self-heal +15% CHC / 2 turns. Expose (373–393) and Shadow Veil (480–500) are both damage + RES+SP shred. Life Drain (103–122), Drain Courage (437–458), and canister `vampire_bite` (`admin.mo` 178–179) are three drains. Mirror (198–214) and `reflect_barrier` (`admin.mo` 181–182) are two reflects. Enrage (273–292) vs Fury Potion (`BuffShop.tsx` 63–71); Haste (313–332) vs Swift Boots (48–55). Summon guardian kit even lists both Shield and Iron Skin (`spellData.ts` 593; `enemyAI.ts` 136).  
SYSTEMS_AFFECTED: spells, summons, enemy kits, boss kits, buff shop  
RECOMMENDED_ACTION: MERGE. One RES shield, one poison DoT, one mend+crit, one expose, one drain family, one reflect. Keep Swap, Mark, Barrier, Mirror, Timestep, Sacrifice, Inferno, Frost Nova, Lifesteal Nova, Cursed Wound, Weaken, Chain Lightning, and the five summons. Retarget `BOSS_KITS` / `ENEMY_KITS` / summon kits onto the survivors. Shop items must not clone the survivors (see PXA-011).  
AUTONOMY: HUMAN_DESIGN_REQUIRED  
DEPENDENCIES: PXA-2026-08-31-001 (unlock table should list survivors only)  
REGRESSION_RISK: MEDIUM — boss kits and summon kits reference the clone ids. `validateBossKits()` will fail until kits are rewritten.  
VALIDATION_REQUIRED: Each remaining spell answers a distinct question (range, timing, positioning, or resource). No two book spells share effect+duration+stat within 10%. Boss rush kits still resolve.  
STATUS: NEW  

---

ACTION_ID: PXA-2026-08-31-003  
SOURCE_AUTOMATION: Player Experience Coherence Auditor  
TITLE: Honor or delete Boss Rush combined-mechanic copy  
CATEGORY: bosses  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: `BOSS_RUSH_ROOMS` (`hooks/useBossRush.ts` 23–134) attaches a unique `combinedMechanic` to each of 10 rooms (“Archbishop heals Pawn every 2 turns…”, “Final Pawn death reveals it was the real Pawn King…”, “Starved Pawn feeds on HP that Weeping Pawn regenerates…”). Repository search: the field is declared on `BossRushRoom` (18) and populated in that table only — no combat, AI, or `useBossSystem` reader. Pair fights therefore run as two independent `BossAbility` scripts. This violates “comprehensible encounter rules”: the UI (if shown) or the table (as design intent) teaches a rule the engine does not run. Solo boss kits remain honest (`bossKits.ts` + `BossAbility` in `bossTypes.ts` 10–58).  
SYSTEMS_AFFECTED: bosses, boss rush, encounter rules, visual feedback  
RECOMMENDED_ACTION: REWORK. Either (a) implement each advertised pair rule as explicit metadata on the room (not name heuristics) and surface it in the pre-fight banner, or (b) delete `combinedMechanic` and describe only abilities the engine already runs. Do not leave flavor that reads as a rule. Room 9 jackpot (5000/2000) stays a reward row, not a fake feed loop, until (a) exists.  
AUTONOMY: HUMAN_DESIGN_REQUIRED  
DEPENDENCIES: PXA-2026-08-31-005 if pair spells must exist in the live catalog  
REGRESSION_RISK: HIGH if (a) is bolted into `WorldExploration.tsx` instead of `engine/` + `useBossSystem`. LOW if (b) is copy-only.  
VALIDATION_REQUIRED: For each room, a designer can point at the code path that implements the sentence on screen. Spectate room 0: heal-every-2 either happens or is not claimed.  
STATUS: NEW  

---

ACTION_ID: PXA-2026-08-31-004  
SOURCE_AUTOMATION: Player Experience Coherence Auditor  
TITLE: Scale challenge, rush, dungeon, and feat grants with encounter threat  
CATEGORY: rewards  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: No level cap. Level N→N+1 is `100 * 2^(N-1)` (`utils/xpCurve.ts` 10–12). Victory XP is `sum(enemy.level * 20)` (`rewardResolver.ts` 82–94). Challenges pay fixed 50–500 Doka and 0–1000 XP (`challengeCompletion.ts` 38–103). Feats pay fixed 50–1000 Doka (`admin.mo` 311–325). Rush rooms pay a fixed table (`useBossRush.ts` 32–132). Dungeon complete is `maxDepth * 50` Doka (ARCHITECTURE dungeon table). Boss *stat* scaling `1.08^diff` (`progression.ts` 290–324) already stays relevant at any level. Flat grants do not: they are a tutorial jackpot, then a rounding error. This is not an endgame-content complaint; the funnels stop answering “what progression fantasy does this support?”  
SYSTEMS_AFFECTED: challenges, achievements, bosses, dungeons, rewards, progression  
RECOMMENDED_ACTION: EXPAND. Express secondary grants as a function of the same threat the combatants already use (enemy/boss level, pack size, dungeon depth, modifier). Example shape: `round(baseTier * threatFactor)` with `threatFactor` from live encounter level, not player vanity level alone. Keep percentage death (`deathPenalty.ts` 9–10) and `2^n` spell upgrades as the unbounded sinks. Do not add a new currency.  
AUTONOMY: HUMAN_DESIGN_REQUIRED  
DEPENDENCIES: PXA-2026-08-31-009 (which faucets remain)  
REGRESSION_RISK: MEDIUM — persist path stays `applyRewards`; only the numbers fed in change. Recap copy must show the scaled figure that was advertised.  
VALIDATION_REQUIRED: At player/enemy level 3 and level 30, a completed legendary-tier challenge is still a noticeable leftover-XP slice, not 1000 vs a 2^29 threshold. Death 40% Doka still dwarfs a single feat claim.  
STATUS: NEW  

---

ACTION_ID: PXA-2026-08-31-005  
SOURCE_AUTOMATION: Player Experience Coherence Auditor  
TITLE: One live catalog for admin spells and bosses  
CATEGORY: admin-content  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Three truths: (1) live player/enemy book = `data/spellData.ts` + `SPELL_ID_CATALOG` (`bossKits.ts` 29–62); (2) client strips retired names `fireball` / `blood_nova` / `obliterate` / … (`WorldExploration.tsx` 2203–2236); (3) canister `defaultBossConfigs()` (`admin.mo` 350–368+) still seeds `spellPoolIds` like `fireball`, `cursed_gust`, `blood_nova`, and `defaultSpells()` is a different six-id set (`admin.mo` 168–191). Frontend `DEFAULT_BOSS_CONFIGS` (`bossDefaults.ts`) uses `getBossPhase1SpellIds`. Admin CRUD can publish a spell the engine will filter or cast without `targetType`. This is how identity dies without a code review.  
SYSTEMS_AFFECTED: admin-enabled content, spells, bosses, enemies  
RECOMMENDED_ACTION: REWORK. Canister seed + admin forms must offer only ids in the live catalog (or require the full targeting metadata before save). Boss phase pools must be the `bossKits.ts` ids. Delete or migrate retired names in `defaultBossConfigs`. Admin preview should use the same `targeting.ts` gate as a live cast.  
AUTONOMY: HUMAN_DESIGN_REQUIRED  
DEPENDENCIES: PXA-2026-08-31-002; PXA-2026-08-31-015  
REGRESSION_RISK: HIGH on a live canister that already stored old boss rows — need a seed repair, not a silent filter.  
VALIDATION_REQUIRED: `getSpellConfigs` ∩ `SPELL_ID_CATALOG` is the combat set. An admin-only id cannot appear in a player book unless it passed the metadata schema.  
STATUS: NEW  

---

ACTION_ID: PXA-2026-08-31-006  
SOURCE_AUTOMATION: Player Experience Coherence Auditor  
TITLE: Remove Blood from the player HUD until it spends  
CATEGORY: resources  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Top bar always renders BLOOD (`GameFlow.tsx` 307–321) from `selectedCharacterProp?.blood` / `maxBlood` (defaults 0/100). `WorldExploration.tsx` 1118–1130 holds `bloodBalance` / `_bloodBalanceRef` and an unused `_setBloodBalance`. `updateSessionState` persists `bloodBalance` 0–100 (`main.mo` 2290–2305) with `covenantBuff` and `shrineCount`. No combat, shop, or death path spends Blood. DESIGN.md orbs are AP/MP/HP — Blood is a fourth bar with no decision. Unnecessary currency / information overload.  
SYSTEMS_AFFECTED: visual feedback, progression, death (session fields)  
RECOMMENDED_ACTION: DEPRECATE the HUD and the create-time Blood story. Keep the canister fields inert until a designed sink exists (do not invent one in this ID). Hide the bar for normal players.  
AUTONOMY: ORCHESTRATOR_MAY_DRAFT (display-only hide)  
DEPENDENCIES: None for hide; PXA-014 if shrine is later wired to Blood  
REGRESSION_RISK: LOW if only the bar is hidden. MEDIUM if session writes are removed without a migrate.  
VALIDATION_REQUIRED: World top bar shows XP + Doka + HP/AP/MP orbs only. No “BLOOD” label in player chrome. Typecheck clean.  
STATUS: NEW  

---

ACTION_ID: PXA-2026-08-31-007  
SOURCE_AUTOMATION: Player Experience Coherence Auditor  
TITLE: One enemy poster — piece kit or family, not both  
CATEGORY: enemies  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Kits key on `ChessPieceType` (`enemyAI.ts` 156–178). Spawn also rolls `EnemyFamily` at 30% (`WorldExploration.tsx` 6236–6298): `wraith_bishop`, `iron_golem`, `plague_rat`, `ember_knight`, `tide_shade`, `bone_scribe`, `void_mirror` — HP/dmg/RES mults and pixels (`4150–4222`, `6257+`). Families do not change `buildEnemyKit`. `aiTier` is a fourth number (`gameConstants.ts` 200–208). Player must read chess role, monster name, and erratic/betrayal tier for one unit. Progressive sophistication should be “this bishop now poisons” (`levelZone`), not three taxonomies.  
SYSTEMS_AFFECTED: enemies, AI, visual feedback  
RECOMMENDED_ACTION: SIMPLIFY. Pick piece+kit as the public identity (families become palette aliases of the same kit) *or* replace pieces with families that own kits. Keep `aiTier` as a hidden gate, not a player-facing type. Extend kits past `levelZone` 2 (knight is melee-only forever — line 161).  
AUTONOMY: HUMAN_DESIGN_REQUIRED  
DEPENDENCIES: PXA-2026-08-31-013  
REGRESSION_RISK: MEDIUM — pixel helpers and `EnemyRegister.tsx` copy mention families.  
VALIDATION_REQUIRED: A new player can name what a unit does from one word + one kit. Zone 0 vs zone 2+ kits differ for every piece including knight.  
STATUS: NEW  

---

ACTION_ID: PXA-2026-08-31-008  
SOURCE_AUTOMATION: Player Experience Coherence Auditor  
TITLE: Slim world-event modifiers to a learnable set  
CATEGORY: world-events  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: 22 modifiers (`engine/mapModifiers.ts` 4, 152+). Slime Flood (154–162) and Frozen Terrain (164–172) are the same `onMpCost * 2`. Gravity Well (280–286) and Fog of War (288–296) are empty (“Mechanism not located. Placeholder.”) but still announce. Titan’s Vigor (299–316) adds **1000** HP and multiplies damage by a 1–5 roll — arbitrary, unscaled, no counterplay. Glass Realm ×2 and Doka Fever ×2 rewards are stat/reward inflation. Thorned Ground, Void Rift, Mirror Field, Arcane Overflow, Time Warp *do* add decisions. Two-roll trigger (20% then 50%) can stack two languages on one map.  
SYSTEMS_AFFECTED: world events, challenges, visual feedback, rewards  
RECOMMENDED_ACTION: MERGE Slime+Frozen into one “heavy ground.” DEPRECATE or implement Gravity Well / Fog of War (no announce until a hook exists). REWORK Titan’s Vigor into a rule (e.g. first strike each turn is amplified) with numbers that scale, not +1000. Cap simultaneous player-facing modifiers at one unless the second is a named dungeon rule.  
AUTONOMY: HUMAN_DESIGN_REQUIRED  
DEPENDENCIES: PXA-2026-08-31-010 if dungeon uses a reserved modifier table  
REGRESSION_RISK: MEDIUM — WX still branches on some ids (`isTimeWarp`, `isVoidRift` at 2183–2184). Empty ids can be removed from the roll table first.  
VALIDATION_REQUIRED: Announce text always matches a live hook. No two active names mean the same MP rule. Titan no longer adds a flat 1000 HP at level 1 or level 50.  
STATUS: NEW  

---

ACTION_ID: PXA-2026-08-31-009  
SOURCE_AUTOMATION: Player Experience Coherence Auditor  
TITLE: Separate feat stamps from in-battle challenges  
CATEGORY: challenges  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Every fight randomly assigns one of 9 challenges, including legendary Untouchable 1000 XP (`WorldExploration.tsx` 12474–12482; `challengeCompletion.ts` 81–86). `easy_1` / `hard_1` and feat `pacifist_run` (`admin.mo` 324) all tax healing. Feat `critical_striker` and challenge `direct_hit` both ask for a combat style. Jackpot/betrayal feats fire from world RNG (`WorldExploration.tsx` 2139–2142, 12848–12854), not a choice. Two UIs (ChallengePanel + Feats) pay the same wallet.  
SYSTEMS_AFFECTED: challenges, achievements, rewards, visual feedback  
RECOMMENDED_ACTION: SIMPLIFY. Challenges = optional, encounter-shaped contracts offered when the room can actually fail them (not Untouchable on a lava-modifier map). Feats = durable stamps, not a second random Doka faucet. Drop or hide spectator feats (betrayal, jackpot) as player-facing mastery. One panel language: “Challenge” in battle, “Feats” in the menu — never both words for the same row.  
AUTONOMY: HUMAN_DESIGN_REQUIRED  
DEPENDENCIES: PXA-2026-08-31-004  
REGRESSION_RISK: MEDIUM — persist of challenge deltas is finally correct (`liveBattleChallengePersistEntries`); changing offer rules must not drop that path.  
VALIDATION_REQUIRED: A lava+thorns map does not offer Untouchable. Pacifist exists in one system, not two. Recap still pays only completed, accepted challenges.  
STATUS: NEW  

---

ACTION_ID: PXA-2026-08-31-010  
SOURCE_AUTOMATION: Player Experience Coherence Auditor  
TITLE: Give the dungeon chain a rule the overworld does not have  
CATEGORY: dungeons  
PRIORITY: P1  
CONFIDENCE: MEDIUM  
EVIDENCE: Chain is depth 3–5, `1.0 + depth * 0.25` Doka, completion `maxDepth * 50` (`docs/ARCHITECTURE.md` 312–334). `filterRunPortals` keeps only `"progression"` when cleared. After `cleanupMap` the flags zero — snapshot is mandatory. Tactically the maps are the same generator + same AI + same modifiers as free roam. A second “dungeon” is the admin room editor (`types/dungeon.ts`, `DungeonCreator.tsx`). Players cannot tell a chain from a lucky overworld path except the HUD depth and a white portal.  
SYSTEMS_AFFECTED: dungeons, world events, bosses, rewards  
RECOMMENDED_ACTION: EXPAND. Reserve a small modifier table and/or a guaranteed boss at final depth. Keep flee/death abort (already true). Rename the editor so “dungeon” means the run. Completion grant must follow PXA-004 (not `* 50`).  
AUTONOMY: HUMAN_DESIGN_REQUIRED  
DEPENDENCIES: PXA-2026-08-31-004; PXA-2026-08-31-008  
REGRESSION_RISK: HIGH if `mapGen.ts` is rewritten (AGENTS.md forbids casual mapGen). Prefer portal + encounter rules, not a new generator.  
VALIDATION_REQUIRED: A player who enters an entry portal can state the extra rule before the first fight. White portal still appears only on successful final depth.  
STATUS: NEW  

---

ACTION_ID: PXA-2026-08-31-011  
SOURCE_AUTOMATION: Player Experience Coherence Auditor  
TITLE: One shop authority — align buff catalog and stop cloning spells  
CATEGORY: shops  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Player shop is `BUFF_ITEMS` in `BuffShop.tsx` 23–71 with `localStorage` `${principal}_inventory` (77–91). Canister `BUFF_CATALOG` (`main.mo` 1867–1874) uses `greater_potion` not `greater_health_potion`, elixir 200 vs 80, shield 150 vs 100, fury 100 vs 150. `purchaseBuff` / `useBuffItem` have no callers under `src/frontend/src/components`. IAP list is 15 euro SKUs to 1.6M Doka (`admin.mo` 265–282). Fury/Swift/Shield clone Enrage/Haste/Shield. AGENTS.md: backend-authoritative, localStorage cache only.  
SYSTEMS_AFFECTED: shops, spells, rewards, progression  
RECOMMENDED_ACTION: SIMPLIFY. Either wire the modal to `getBuffCatalog` / `purchaseBuff` / `useBuffItem` on the persist lock, or drop the canister catalog. Items that exist as spells should be consumable *timing* (this turn) not permanent clones — or be removed. Treat the 1.6M SKU as an explicit economy decision, not an unnoticed default.  
AUTONOMY: HUMAN_DESIGN_REQUIRED  
DEPENDENCIES: PXA-2026-08-31-002  
REGRESSION_RISK: HIGH if inventories exist only in localStorage — a cutover can wipe bought stacks. Migrate or grant a one-time refund.  
VALIDATION_REQUIRED: Buy + use + reload + other device: stack matches canister. UI cost equals `getBuffCatalog`. No item restates a book buff for the rest of the fight without a shorter duration.  
STATUS: NEW  

---

ACTION_ID: PXA-2026-08-31-012  
SOURCE_AUTOMATION: Player Experience Coherence Auditor  
TITLE: One word per concept (Feats, resists, spell roles)  
CATEGORY: terminology  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Menu title “Feats” (`AchievementsPanel.tsx` 231) vs `aria-label="Achievements"` (214) vs admin tab `achievements` vs canister `achievementConfigs`. Boss Guide splits SR and RES from one `res` field (`progression.ts` 281–288). `spellType: "damage"` on Shield, Swap, Timestep, Enrage (`spellData.ts` 40, 152, 225, 283). Blood vs Doka vs XP on one top bar. Challenge vs Feat for the same Doka.  
SYSTEMS_AFFECTED: achievements, spells, visual feedback, admin  
RECOMMENDED_ACTION: SIMPLIFY. Player-facing: Feats, Doka, XP, HP, AP, MP, RES (one resist unless combat actually splits). Admin may keep internal ids. `spellType` should match `effectType` for book/admin.  
AUTONOMY: ORCHESTRATOR_MAY_DRAFT (copy-only)  
DEPENDENCIES: PXA-2026-08-31-006 (Blood label); PXA-2026-08-31-009  
REGRESSION_RISK: LOW for UI copy. Do not rename Candid fields in the same change.  
VALIDATION_REQUIRED: A new player glossary of ≤12 terms covers the HUD. No screen says Achievement and Feat for the same row.  
STATUS: NEW  

---

ACTION_ID: PXA-2026-08-31-013  
SOURCE_AUTOMATION: Player Experience Coherence Auditor  
TITLE: Keep teaching new enemy reads after level-zone 2  
CATEGORY: AI  
PRIORITY: P2  
CONFIDENCE: MEDIUM  
EVIDENCE: `ENEMY_KITS` (`enemyAI.ts` 156–178): pawn adds venom at zone≥1; knight is `["physical_attack"]` forever; bishop frost then +poison; rook +iron-skin; queen/king swap frost→inferno at zone≥2 and add a heal/rally. `levelZone` is a coarse 0/1/2 band, not character level. The AI *engine* can already sacrifice, summon, camp, betray (`ENEMY_AI_TIER_GATES` 200–208). Kits do not unlock those verbs. With no cap, zone 2 is “the rest of the game.”  
SYSTEMS_AFFECTED: enemies, AI, progression  
RECOMMENDED_ACTION: EXPAND kits along the existing engine verbs (summoner flag, healer, flanker, kamikaze) as named piece upgrades at further bands — still explicit ids, not name heuristics. Knight must gain at least one non-Strike tool. Do not add new AI toggles.  
AUTONOMY: HUMAN_DESIGN_REQUIRED  
DEPENDENCIES: PXA-2026-08-31-007  
REGRESSION_RISK: MEDIUM — kit size vs AP budgets can stall turns if every pawn gets Inferno.  
VALIDATION_REQUIRED: At three documented bands, a player can name a new thing the enemy might do. Knight is not Strike-only at the highest band.  
STATUS: NEW  

---

ACTION_ID: PXA-2026-08-31-014  
SOURCE_AUTOMATION: Player Experience Coherence Auditor  
TITLE: Shrine is a Doka tile, not a covenant  
CATEGORY: world-events  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Stepping the altar credits 300 Doka through the persist lock (`WorldExploration.tsx` 11530–11543). If the path was “pure,” `covenantBuffMapsRef.current = 3` is written (11544–11557) and mirrored to `localStorage` `pbv_covenant_buff_*`. Grep of that ref: **init + that write only** — never decremented, never read for damage, AP, or resist. `covenantBuff` on the character (`main.mo` 114, 2295) is unused by the client shop/combat. Feature bloat: a named fantasy with no effect.  
SYSTEMS_AFFECTED: world events, shops, progression, death (session)  
RECOMMENDED_ACTION: SIMPLIFY now — treat shrine as a 300 Doka pickup (or scale via PXA-004) and stop storing a fake 3-map buff. EXPAND later only with a real, announced combat hook and a backend write, not localStorage.  
AUTONOMY: ORCHESTRATOR_MAY_DRAFT (remove write-only buff; keep Doka credit)  
DEPENDENCIES: PXA-2026-08-31-004 if 300 stays as a grant  
REGRESSION_RISK: LOW — nothing reads the buff.  
VALIDATION_REQUIRED: Altar still pays Doka once. No covenant string in battle log or HUD.  
STATUS: NEW  

---

ACTION_ID: PXA-2026-08-31-015  
SOURCE_AUTOMATION: Player Experience Coherence Auditor  
TITLE: Admin spells must carry targeting metadata or they do not save  
CATEGORY: admin-content  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Live cast/preview require `SpellConfig.targetType`, min/max range, LoS, linear/diagonal, `freeCells`, `areaRadius`, `isBarrier` (`docs/ARCHITECTURE.md` 356; `engine/targeting.ts`). Admin `newSpell()` (`AdminDashboard.tsx` 57+) and Motoko `SpellConfig` (`admin.mo` default rows) can omit or mismatch those fields. `effectType` / `spellType` / `effectCategory` already disagree on seeded rows (`vampire_bite` is `effectType = "heal"` and `spellType = "drain"`). A published admin spell is public (`getSpellConfigs`) and merges into `ownedSpells` if not in `OLD_SPELL_NAMES_SET`.  
SYSTEMS_AFFECTED: admin-enabled content, spells, spell discovery  
RECOMMENDED_ACTION: REWORK the admin save path: reject spells missing the live targeting schema; preview with the same gate as the canvas. Do not allow name-based fallbacks. Pair with PXA-005 so the dropdown is the live catalog.  
AUTONOMY: HUMAN_DESIGN_REQUIRED  
DEPENDENCIES: PXA-2026-08-31-005  
REGRESSION_RISK: MEDIUM — existing admin rows may fail the new validator; quarantine rather than crash combat.  
VALIDATION_REQUIRED: Saving a spell without `targetType` returns an error. A valid admin spell previews and casts like a `spellData` row.  
STATUS: NEW

ACTION_ID: GTAD-2026-08-31-001  
SOURCE_AUTOMATION: Gameplay Telemetry Architecture Director  
TITLE: Privacy fence — aggregates only; never chat, purchase PII, or principals on Intelligence  
CATEGORY: privacy  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Mandate forbids individual surveillance. `getLeaderboard` already returns `principalId` (`main.mo` ~2527). OQL `characterSlots` / `userProfiles` are `ownedBy("owner")` (`main.mo` ~2626–2702). `PurchaseRecord` stores email/address (`types/admin.mo` ~185). `chatMessages` is in-memory and must stay out of analytics. Quality audit found zero telemetry and warned against claiming CLEAR_POSITIVE_SIGNAL.  
SYSTEMS_AFFECTED: future telemetry maps; Admin Intelligence tab; OQL (do not add owner-keyed event entities)  
RECOMMENDED_ACTION: Any implementation must allow-list counter key prefixes; strip principals in snapshot queries; never persist chat text, `uiLayout`, pixel patterns, click traces, or purchase customer fields; never reuse `getLeaderboard` as an analytics API.  
AUTONOMY: human-gated (policy)  
DEPENDENCIES: None  
REGRESSION_RISK: LOW if followed; HIGH if someone “just charts OQL rows.”  
VALIDATION_REQUIRED: Intelligence responses contain no principal, display name, email, or message body.  
STATUS: NEW  

---

ACTION_ID: GTAD-2026-08-31-002  
SOURCE_AUTOMATION: Gameplay Telemetry Architecture Director  
TITLE: Fail-open sidecar — never on the persist lock, never authoritative  
CATEGORY: architecture  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: `createProgressPersist` serializes `applyRewards` and `saveBattleStats`. AQA-2026-08-30-012 already warned: counters on that lock or a second wallet path are a regression. `handleBattleEnd` already shows recap then persist in a separate `try/catch` (~12736–12802) that logs “non-blocking.” AGENTS.md: telemetry must not block combat, persistence, map load, or rewards.  
SYSTEMS_AFFECTED: `utils/progressPersist.ts`; future `recordTelemetryIncrements`; WorldExploration outcome paths  
RECOMMENDED_ACTION: Implement increments as fire-and-forget after persist functions return. Swallow all sidecar errors. Do not enqueue telemetry on `progressPersistRef`. Do not write HP/XP/Doka/spell levels from telemetry. Missing method on the mock actor = no-op.  
AUTONOMY: implementer (when picked)  
DEPENDENCIES: GTAD-2026-08-31-001  
REGRESSION_RISK: HIGH if ignored (wallet races, unpaid victories).  
VALIDATION_REQUIRED: Existing persist unit tests still pass with a throwing/missing increment API; a sidecar throw does not skip `applyRewards`.  
STATUS: NEW  

---

ACTION_ID: GTAD-2026-08-31-003  
SOURCE_AUTOMATION: Gameplay Telemetry Architecture Director  
TITLE: Phase 0 — admin-only snapshot aggregates from existing stores  
CATEGORY: telemetry  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `characterSlots`, `dokaBalances`, `achievementProgress`, `dungeonRecords`, `bossRushStates` already persist population signals. No combat write required. Admin dashboard sidebar only shows catalog counts (enemies/regions/sprites/spells). Quality Auditor could not estimate player population.  
SYSTEMS_AFFECTED: `src/backend/main.mo` (new `#admin` query); `AdminDashboard.tsx` (Intelligence tab, read-only)  
RECOMMENDED_ACTION: Add `adminGetProgressionSnapshot` (name flexible) that returns **buckets only**: level histogram, pieceType mix, Doka-size histogram, achievement unlock/claim counts by id, dungeon depth/maps histograms, boss-rush `bestRoom` histogram. Scan maps server-side; never return a principal. Do not use OQL execute from the player client for this.  
AUTONOMY: implementer (when picked)  
DEPENDENCIES: GTAD-2026-08-31-001  
REGRESSION_RISK: LOW (query-only). Residual: expensive scan on a large principal map — keep admin-gated and not on the game loop.  
VALIDATION_REQUIRED: Response JSON has no principal-shaped strings; `#user` callers are rejected; `pnpm typecheck` clean after bindgen.  
STATUS: NEW  

---

ACTION_ID: GTAD-2026-08-31-004  
SOURCE_AUTOMATION: Gameplay Telemetry Architecture Director  
TITLE: Phase 1 — smallest outcome + quality increment hooks  
CATEGORY: telemetry  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Directly implements the architecture for `AQA-2026-08-30-012`. Existing fail-open sites: reward persist `catch` ~12797; `persistDeathPenalty`; `onShowBattleSummary` ~12731; `creditPendingPurchasesThroughPersist`; battle start ~12363; `_handlePlayerDeath` ~13321.  
SYSTEMS_AFFECTED: new sidecar module; `main.mo` increment map + `recordTelemetryIncrements`; outcome helpers (`rewardResolver`, `deathPenalty`, `shopPurchase`) after they return  
RECOMMENDED_ACTION: Ship lifetime+28-day counters only for: persist ok/fail (`applyRewards`, `saveBattleStats`), victory paid, death-penalty ok/fail, recap opened, shop credit committed, battles started, victories. Fire-and-forget batches of `(Text, Nat)`. Allow-list prefixes. No WorldExploration RAF / damage / mapGen edits.  
AUTONOMY: implementer (when picked)  
DEPENDENCIES: GTAD-2026-08-31-001; GTAD-2026-08-31-002  
REGRESSION_RISK: MEDIUM if increments are placed inside persist `enqueue`. LOW if after-return only.  
VALIDATION_REQUIRED: Next Quality Auditor can cite persist-ok/fail and victory-paid counts, or still say “Phase 1 not merged.”  
STATUS: NEW  

---

ACTION_ID: GTAD-2026-08-31-005  
SOURCE_AUTOMATION: Gameplay Telemetry Architecture Director  
TITLE: Tag flee vs combat death vs lava/spike without changing the penalty  
CATEGORY: telemetry  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Flee (`onEndBattle` ~18871) calls `_handlePlayerDeath` — persist and Death Realm are identical to combat death. Lava/spike use the HP-watch path (~13380) and explicitly do **not** call `_handlePlayerDeath`. Death-cause intelligence is impossible until the entry point is tagged. Mandate: do not change death math.  
SYSTEMS_AFFECTED: `_handlePlayerDeath` call sites; HP-watch; future C-003/C-004/C-007 increments  
RECOMMENDED_ACTION: Thread a closed `DeathCause` enum (`combat_melee|combat_spell|dot|lava|spikes|flee|other`) into the two entry points for telemetry only. Keep `persistDeathPenalty` / `resetRunState` / Death Realm timer unchanged.  
AUTONOMY: implementer (when picked)  
DEPENDENCIES: GTAD-2026-08-31-002; GTAD-2026-08-31-004 (or same PR)  
REGRESSION_RISK: MEDIUM if someone forks persist or skips the flee→death penalty.  
VALIDATION_REQUIRED: Existing `deathGuards` / `deathPenalty` tests still pass; flee in a dungeon still aborts the run.  
STATUS: NEW  

---

ACTION_ID: GTAD-2026-08-31-006  
SOURCE_AUTOMATION: Gameplay Telemetry Architecture Director  
TITLE: Phase 2 — combat / spell / content aggregate dimensions  
CATEGORY: telemetry  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Battle length (`challengeTurnCountRef`), remain HP, roster `pieceType`, `TierSpawnConfig` level gap, `decideDungeonChainPortal`, Boss Rush rooms 0–9, challenge ids, map modifiers, rare refs (jackpot/betrayal/leader) already exist as gameplay signals. Spell usage should flush a **per-battle unique-set** of `SpellConfig.id`, not a cast stream.  
SYSTEMS_AFFECTED: sidecar flush at battle end / portal; Admin Intelligence sections  
RECOMMENDED_ACTION: After Phase 1 is proven fail-open, add bucket increments for turns, remain-HP, death cause, family W/L, level-delta, dungeon/rush/challenge/modifier/rare, spell unique-set + fizzle + enemy unique-set + upgrade. Cap key cardinality to catalog ids and enums.  
AUTONOMY: implementer (when picked)  
DEPENDENCIES: GTAD-2026-08-31-004; GTAD-2026-08-31-005  
REGRESSION_RISK: MEDIUM if unique-set flush is done per RAF frame or per targeting preview.  
VALIDATION_REQUIRED: One battle produces a bounded batch (≤32 keys); no increment from `mapGen` / `combatMath` / RAF.  
STATUS: NEW  

---

ACTION_ID: GTAD-2026-08-31-007  
SOURCE_AUTOMATION: Gameplay Telemetry Architecture Director  
TITLE: Admin Intelligence tab — aggregates, carved-stone, `#admin` only  
CATEGORY: admin-ui  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: `AdminDashboard.tsx` tabs (~4825) are config CRUD only. Sidebar counts are catalog sizes. Admin is lazy-loaded and must stay gated (`isAdmin && onOpenAdmin`; canister `#admin`). DESIGN.md / AGENTS.md UI language.  
SYSTEMS_AFFECTED: `AdminDashboard.tsx`; `useAdminQueries.ts`  
RECOMMENDED_ACTION: Add an Intelligence tab that charts Phase 0 snapshots and Phase 1+ counters. Empty state if maps are empty. No principal search. Dev raw-key dump only under `import.meta.env.DEV`. Match existing stone/slate/crimson chrome.  
AUTONOMY: implementer (when picked)  
DEPENDENCIES: GTAD-2026-08-31-003 (minimum); GTAD-2026-08-31-004 for live counters  
REGRESSION_RISK: LOW. Do not ship the tab to normal players.  
VALIDATION_REQUIRED: Non-admin build path unchanged; `#user` query rejected; browser check of the tab on an admin session when implemented.  
STATUS: NEW  

---

ACTION_ID: GTAD-2026-08-31-008  
SOURCE_AUTOMATION: Gameplay Telemetry Architecture Director  
TITLE: Do not invent a spell-discovery persist path for analytics  
CATEGORY: content-scope  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: `ownedSpells` is starters ∪ all backend configs minus retired names (`WorldExploration.tsx` ~2257–2271). There is no drop / first-seen canister field. `minLevel` is catalog metadata only. Building a discovery system “so we can measure discovery” would be new gameplay.  
SYSTEMS_AFFECTED: spell catalog; Intelligence “reach” panel  
RECOMMENDED_ACTION: Measure reach via Phase 0 (characters with `level >= minLevel`) and Phase 2 first-equip / unique-set use. Do not add a discovery inventory to `Character` for telemetry.  
AUTONOMY: human-gated (product)  
DEPENDENCIES: GTAD-2026-08-31-003; GTAD-2026-08-31-006  
REGRESSION_RISK: HIGH if a fake unlock store desyncs the spell bar.  
VALIDATION_REQUIRED: No new `Character` fields in the Phase 1/2 telemetry PR.  
STATUS: NEW  

---

ACTION_ID: GTAD-2026-08-31-009  
SOURCE_AUTOMATION: Gameplay Telemetry Architecture Director  
TITLE: Defer spell sequences, AI intent text, and visual URL logging  
CATEGORY: privacy  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Pairwise unique-set co-occurrence is enough for combo balance (S-006) and is Phase 3 with a key cap. `decideEnemyAction.intent` is free text for the battle log. Sprite `onerror` URLs may be private. `logPatternLookupFailed` is already throttled — increment on that throttle only (Q-010).  
SYSTEMS_AFFECTED: enemy AI logging; pieceArt; Intelligence  
RECOMMENDED_ACTION: Refuse PRs that upload debug buffers, ordered n-grams, intent strings, or raw image URLs. Allow throttled `pattern_fallback` counters and `quality.visual.load_fail.{kind}` without URLs.  
AUTONOMY: human-gated (review bar)  
DEPENDENCIES: GTAD-2026-08-31-001  
REGRESSION_RISK: LOW (deferral).  
VALIDATION_REQUIRED: Phase 3 design re-read before any pair-key implementation.  
STATUS: NEW  

---

ACTION_ID: GTAD-2026-08-31-010  
SOURCE_AUTOMATION: Gameplay Telemetry Architecture Director  
TITLE: Point the Quality Auditor at Phase 0/1 counters instead of inventing outcomes  
CATEGORY: prompt-architecture  
PRIORITY: P2  
CONFIDENCE: MEDIUM  
EVIDENCE: `QUALITY_AUDIT_2026-08-30.md` classified every gameplay outcome INCONCLUSIVE because no series existed. `AQA-2026-08-30-012` asked for the smallest hooks. This director catalog is the producer spec.  
SYSTEMS_AFFECTED: Automation Quality Auditor prompt (`976261d8-a49f-11f1-a7d1-d6b4613131ce`)  
RECOMMENDED_ACTION: UPDATE_PROMPT: read `docs/automation/TELEMETRY_ARCHITECTURE_2026-08-31.md`; if increment/snapshot APIs are absent, repeat INCONCLUSIVE; if present, cite persist-ok/fail, victory-paid, death-penalty, recap-opened, and snapshot level histogram. Never treat a missing increment as a player regression.  
AUTONOMY: human (prompt edit)  
DEPENDENCIES: GTAD-2026-08-31-003 or GTAD-2026-08-31-004 merged before the next Sunday audit to have numbers  
REGRESSION_RISK: LOW.  
VALIDATION_REQUIRED: Next auditor report either cites real counters or explicitly says “still no telemetry.”  
STATUS: NEW  

---

ACTION_ID: GTAD-2026-08-31-011  
SOURCE_AUTOMATION: Gameplay Telemetry Architecture Director  
TITLE: Keep increment maps off OQL owner-scoped entities  
CATEGORY: architecture  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: OQL `Expose` at end of `main.mo` is `controllerOrScoped` for player collections. A `telemetryEvents` entity with `owner` would create a per-player log the controller can dump — the surveillance shape this design forbids. Config entities are controller-only and are the wrong place for runtime counters.  
SYSTEMS_AFFECTED: `main.mo` OQL block  
RECOMMENDED_ACTION: Store counters in dedicated `Map<Text, Nat>` queried only via `adminGetTelemetrySnapshot`. Do not `include Expose` those maps as owned entities.  
AUTONOMY: implementer (when picked)  
DEPENDENCIES: GTAD-2026-08-31-001; GTAD-2026-08-31-004  
REGRESSION_RISK: LOW.  
VALIDATION_REQUIRED: `schema()` / `execute` do not list a player-owned telemetry event collection.  
STATUS: NEW
