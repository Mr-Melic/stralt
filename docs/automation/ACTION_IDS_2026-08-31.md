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
