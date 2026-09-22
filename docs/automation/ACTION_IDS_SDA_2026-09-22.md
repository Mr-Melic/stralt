# ACTION_IDs — 2026-09-22 Spell, Discovery & Achievement Admin Designer

Durable ledger for implementers and the Report Action Orchestrator.  
Source of every record: Spell, Discovery & Achievement Admin Designer.  
Design contract: [`SPELL_ADMIN_DESIGN_2026-09-22.md`](./SPELL_ADMIN_DESIGN_2026-09-22.md) (this delta) + [`SPELL_ADMIN_DESIGN_2026-08-31.md`](./SPELL_ADMIN_DESIGN_2026-08-31.md) (full studio).  
09-21 IDs live on unmerged [#353](https://github.com/Mr-Melic/stralt/pull/353). Treat **09-22-00N as the same first-cut as 09-21-00N** — do not implement both. Prior IDs `SDA-2026-08-31-001` … `013`, `SDA-2026-09-01-001` … `014`, and `SDA-2026-09-02-001` … `015` remain OPEN, PARTIAL, or LANDED as tabulated in the 09-22 design §9 — do not close them from this file except 09-01-002 (bindgen) and the empty-AI half of 09-02-006, which **landed**.  
Do not implement gameplay from this file unless a later human or orchestrator explicitly picks an ID. This run ships **docs only**.

HEAD: `0f5363f`.

Older still-open PRs (union, do not overwrite): **#327** then **#331**, then #333–#391. SDA-relevant: **#334** (AdminDashboard copy), **#341** (`adminSafety.ts` / `useSpellQueries.ts` / AdminDashboard delete UX), **#353** (09-21 SDA docs — do not rewrite those five files), **#371** / **#342** (Wave-4 ids, docs only), **#384** / **#374** (`effectParams` JSON), **#388** (spell-level hydrate). Keep one `export function` per name.

---

ACTION_ID: SDA-2026-09-22-001  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Separate lifecycle from usableByPlayer  
CATEGORY: dependency-safety  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: `adminDeleteSpellConfig` (`src/backend/main.mo` 882–902) refuses to delete the six `isBuiltInSpellId` rows (`adminGuard.mo` 21–24) and otherwise writes `{ existing with usableByPlayer = false }` when `_spellReferencedByPlayers` is true. Error copy still says “set usableByPlayer=false to retire it” (887). `upgradeSpell` (1008–1014) treats `usableByPlayer=false` as “Spell is retired.” Client helpers `shouldRejectRetiredSpellUpgrade` / `shouldIncludeBackendSpellInLibrary` (`src/frontend/src/utils/adminSafety.ts` 217–223, 711–719) use the same flag. `usableByPlayer` is documented as a cast/equip gate (`src/backend/types/admin.mo` 117). Open #341 copies that Motoko string into `BUILT_IN_SPELL_DELETE_BLOCKED`. Owned-but-never-upgraded ids are not in `spellLevelKeys`, so the current upgrade check would block the legacy upgrade 08-31 §8.2 requires.  
SYSTEMS_AFFECTED: `main.mo` `adminDeleteSpellConfig` / `upgradeSpell`; `adminGuard.mo` `isBuiltInSpellId`; `adminSafety.ts`; Admin retire control; future `lifecycle` on `SpellDefinition`  
RECOMMENDED_ACTION: Add `lifecycle: draft | active | inactive | retired`. Keep `usableByPlayer` / `usableByEnemy` as cast gates only. Retire writes `retired` + freezes `retiredRevision`. `upgradeSpell` allows owned retired ids (owned set ∪ `spellLevelKeys`), rejects unowned retired. Do not extend the `usableByPlayer=false` retire path. Validator rejects `PLAYER_LEARNABLE=true` on `ENEMY_ONLY` / `BOSS_ONLY`. New field needs 016. Union 017 if #341 has landed.  
AUTONOMY: HUMAN_APPROVE — persist shape + live actor upgrade.  
DEPENDENCIES: SDA-2026-08-31-005 (supersedes the field choice); SDA-2026-09-22-003 (owned set); SDA-2026-09-22-016; SDA-2026-09-22-017  
REGRESSION_RISK: HIGH if existing `usableByPlayer=false` rows are migrated as retired when they were meant as enemy-only. Inventory those ids before flip.  
VALIDATION_REQUIRED: Retire a published id: already-owned still casts and upgrades; new character cannot learn; `usableByPlayer` can stay true for that owned cast. An `ENEMY_ONLY` active id with `usableByPlayer=false` is not treated as retired.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-09-22-002  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Persist complete combat SummonUnitDef; drop the hunter default  
CATEGORY: spell-contract  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Bindgen already includes Motoko summon fields (`src/frontend/src/backend.ts` 118–152) — 09-01-002 landed. Motoko now rejects empty `summonAI` when `isSummon` (`adminGuard.mo` 423–426). Motoko `SummonUnitDef` is still only `pieceType` / `level` / `hpScale` / `damageScale` (`admin.mo` 85–90). Combat `SummonUnitDef` also has `summonKit`, `ap`, `mp` (`summonSpawn.ts` 22–33). Spawn display name is `spell.name.replace("Summon ", "")` (`summonSpawn.ts` 165). Runtime still does `spell.summonAI || "hunter"` (`summonSpawn.ts` 139). `inferSummonArchetype` still falls back to `summon.name` (`enemyAI.ts` 218–224). Admin Spell Type `<select>` has no summon option (`AdminDashboard.tsx` 2684–2687) despite `newSpell()` seeding empty summon fields (131–134). Validators accept `spellType="summon"` that the editor cannot set.  
SYSTEMS_AFFECTED: `admin.mo` `SummonUnitDef`; bindgen; `adminContract.ts`; SpellEditor; `summonSpawn.ts`; `enemyAI.ts`  
RECOMMENDED_ACTION: Extend persist with `displayName: Text`, `summonKit: [Text]`, `ap` / `mp`. Require them on activate when `isSummon`. Never derive `displayName` or `summonAI` from `spell.name`. Remove `|| "hunter"` — missing AI is illegal, not hunter. Ship Motoko + bindgen + editor together. Do not redeploy `backend_extended/`. Do not re-open 09-01-002 or the empty-AI Motoko reject.  
AUTONOMY: HUMAN_APPROVE — Candid shape.  
DEPENDENCIES: SDA-2026-09-01-002 (landed; do not redo); SDA-2026-09-22-005 (`targetType=ground`); SDA-2026-09-22-008; SDA-2026-09-22-016  
REGRESSION_RISK: HIGH — every `adminSetSpellConfig` / `getSpellConfigs` call. A lagging actor rejects new-field saves. Empty `summonKit` must not crash combat (fall back to no casts). Dropping the hunter default will fail-closed on catalog rows that never stamped `summonAI`.  
VALIDATION_REQUIRED: Save a row with `isSummon=true`, `summonAI="hunter"`, `displayName="Dire Wolf"`, `summonKit=["physical_attack"]`; refetch matches. Rename the spell; unit name stays Dire Wolf. Empty AI fails client, Motoko, and spawn. `pnpm typecheck` + `mops check`.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-09-22-003  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Stop treating shouldIncludeBackendSpellInLibrary as ownership  
CATEGORY: ownership-persist  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: `ownedSpells` is still `starterSpells` (all forced `isBaseSpell`) ∪ backend rows (`WorldExploration.tsx` 2395–2440). Comment at 2395 still says “ALL starter spells + physical attack”. `shouldIncludeBackendSpellInLibrary` (`adminSafety.ts` 711–719) returns true whenever `usableByPlayer !== false`. The `ownedIds` argument is `baseSpells ∪ spellLevelKeys ∪ spellBarOrder` — `baseSpells` is the entire frontend catalog (`spellData.ts`, 32 unique ids). Adding a spell in Admin with the default `usableByPlayer: true` (`AdminDashboard.tsx` 98) still grants it to every player on hydrate. `Character` (`main.mo` 122–145) has no `ownedSpellIds` / `observedSpellIds`. Leftover `activeSpells : ?[Nat]` is not the owned set.  
SYSTEMS_AFFECTED: `WorldExploration.tsx` ownedSpells; `adminSafety.ts`; `SpellbookModal.tsx`; `main.mo` character maps; create-character seed  
RECOMMENDED_ACTION: Implement SDA-2026-08-31-002. Catalog `getSpellConfigs` stays public and does not imply ownership. Seed create with `SYSTEM_ONLY` / innate four that exist in the canister (007): `physical_attack`, `starter-shield`, `starter-poison`, `starter-heal`. Migrate from `spellLevelKeys ∪ spellBarOrder` plus those base ids — **not** `getSpellConfigs()`, **not** the full `starterSpells` array, **not** Wave-4 unique ids (018). After that, the library helper reads `ownedSpellIds` only (plus retired-owned). Extract the helper; do not grow WX (19 213 lines). Union #327 / #331 / later WX PRs. New maps need 016. Honour 019 if #388 has landed.  
AUTONOMY: HUMAN_APPROVE — persist-lock and character-record shape.  
DEPENDENCIES: SDA-2026-08-31-002; SDA-2026-09-22-001; SDA-2026-09-22-007; SDA-2026-09-22-016; SDA-2026-09-22-018; SDA-2026-09-22-019  
REGRESSION_RISK: HIGH — under-seed drops the bar; over-seed reintroduces “everyone owns the catalog.”  
VALIDATION_REQUIRED: New character owns only innate/system ids. Admin adding a catalog spell does not change another account’s spellbook. Reload: backend wins over localStorage.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-09-22-004  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Dependency report before retire; hard-delete only drafts  
CATEGORY: dependency-safety  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: `_spellReferencedByPlayers` (`main.mo` 273–284) only scans `spellLevelKeys` and `spellBarOrder`. `adminDeleteSpellConfig` (882–902) hard-`remove`s when that scan is false. Motoko boss seeds still list purged ids (`admin.mo` 350+ vs `main.mo` 689–697). Live boss kits live in `data/bossKits.ts`. Admin `EnemyConfig` has no kit field (`admin.mo` 15–26). Achievements have no `spellRewardIds`. Confirm copy (`AdminDashboard.tsx` 3791–3795) says the live spell is removed and dependents will break; toast is always `"Spell deleted"` (6166). `adminDeleteEnemyConfig` (798–805) is still unconditional `remove`.  
SYSTEMS_AFFECTED: `main.mo` admin deletes; Admin confirm/toast; future graph inspector; boss/enemy/achievement stores  
RECOMMENDED_ACTION: Build a dependency report from ids (spell → enemies, achievements, challenges, bosses, AI/summon kits, acquisition). Retire if any live ref or any character own/level/bar. Hard delete only `lifecycle=draft` with zero published revisions and zero refs; else `#err` + report. Same rule for achievements and enemy configs. UI: Retire vs Delete; toast matches the canister result; list dependents. Union #341 hide-× for built-ins (017) without treating that as the graph.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: SDA-2026-09-22-001; SDA-2026-08-31-005; SDA-2026-09-22-017  
REGRESSION_RISK: HIGH if hard delete remains for “no player keys” while kits still list the id.  
VALIDATION_REQUIRED: Unreferenced draft deletes. Referenced active id retires and returns ok without `remove`. Boss-pool-only ref (Motoko **or** `bossKits.ts`) blocks delete. Confirm does not claim “removed” on retire.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-09-22-005  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Persist targetType (including chain) and combat mechanic flags  
CATEGORY: spell-contract  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Engine required fields include `targetType`, buff/debuff/DoT, `isSwap`/`isMirror`/`isTimestep`/`isSacrifice` (`src/frontend/src/engine/spellEngine.ts` 6–13; `types/gameTypes.ts` 196–237). Combat `targetType` union is `self | ally | enemy | ground | area | line | chain | all` (`gameTypes.ts` 215–223). Motoko persist (`admin.mo` 92–127) and bindgen (`backend.ts` 118–152) omit them. `AdminDashboard.tsx` has **zero** `targetType` matches. `newSpell()` (85–135) sets cooldown and mechanic bools but not `targetType`. Heal option text is “Heal (targets self)” (2685). Editor can toggle `isTimestep` (3434) but Admin Save cannot round-trip the metadata `targeting.ts` uses. Wave-4 cards (#342) are un-authorable in Admin until this lands.  
SYSTEMS_AFFECTED: `admin.mo` SpellConfig; bindgen; `newSpell` / SpellEditor; `spellEngine.ts`; `targeting.ts`  
RECOMMENDED_ACTION: Add required `targetType` (closed set including `chain`) and the mechanic/status/area fields from 08-31 §3 (or an ordered `effects` list plus a compatibility projection). Editor sections: Cost & targeting, Effects, Duration & statuses, Summon. Reject activate when `targetType` is missing. Never key targeting off `spell.name` or `spellType` labels. New fields need 016.  
AUTONOMY: HUMAN_APPROVE — Motoko + bindgen + actor together.  
DEPENDENCIES: SDA-2026-08-31-001 (remainder); SDA-2026-09-22-002; SDA-2026-09-22-016  
REGRESSION_RISK: HIGH — combat reads these fields; a default of `enemy` on self-heals would break Blood Mend / Shield.  
VALIDATION_REQUIRED: Save Shield (`targetType=ally`) and a summon (`ground` + complete unit def); refetch matches. Preview and live cast still use metadata only.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-09-22-006  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Replace remaining payload clamps with a shared activate-gate validator  
CATEGORY: lifecycle-tooling  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Empty-AI drift is **closed**: Motoko (`adminGuard.mo` 423–426) and client (`adminSafety.ts` 626–629) both require a known `summonAI` when `isSummon`. Remaining live drift: Motoko also checks `mpCost`, `cooldown`, `damage`, `healAmount`, `minLevel`, `hitTiles` size, `effectParams` length (383–418); client `validateSpellConfig` (578–660) does not. Both still reject `apCost < 1` (Motoko 380–382; client 604–606). Neither requires `targetType`, acquisition, or a name-heuristic scan. Open #384 will require well-formed `effectParams` JSON on both sides — that slice is 020, not this ID. Admin Save (`AdminDashboard.tsx` 3547–3565) and `useSpellQueries.ts` 64–81 both call the client clamp. `newSpell()` still omits `targetType`.  
SYSTEMS_AFFECTED: `adminGuard.mo`; `adminSafety.ts`; `useSpellQueries.ts`; activate endpoint; SpellEditor footer  
RECOMMENDED_ACTION: Shared pure validate: required metadata (09-22 design §5), referential integrity of kit/reward ids, AP 0 only with an explicit flag (not a name), `isSummon` requires complete unit def on **both** sides, same error strings, no name keys. Mirror Motoko numeric caps on the client. Editor footer and `useAdminSetSpellConfig` use the same function. Activate calls it; draft save may be looser. Do not re-do empty-AI. Do not re-do #384 JSON (020). Union `adminSafety.ts` with #341 / #384.  
AUTONOMY: IMPLEMENT_AFTER_HUMAN — once 001/005 fields exist.  
DEPENDENCIES: SDA-2026-09-22-001; SDA-2026-09-22-002; SDA-2026-09-22-005; SDA-2026-08-31-011; SDA-2026-09-22-020  
REGRESSION_RISK: MEDIUM — tightening without the AP 0 exception bricks Timestep if it is ever persisted. Divergent client/Motoko strings hide canister rejects behind a generic toast. Concatenating a second `validateSpellConfig` on restack fails `vite build`.  
VALIDATION_REQUIRED: Activate rejected without `targetType`. `isTimestep` + AP 0 validates. Summon without `summonAI` fails on **both** client and Motoko with the same string. Client rejects `cooldown > 10` the same way Motoko does.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-09-22-007  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Seed frontend starter ids; stop purging and tombstoning live physical_attack  
CATEGORY: catalog-sync  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Live combat/spellbook ids are in `spellData.ts` (`physical_attack`, `starter-shield`, `spell-swap`, `summon-dire-wolf`, … — 32 unique ids). Canister seed is `shadow_strike` … `void_collapse` (`admin.mo` 168–191). `upgradeSpell` requires `spellConfigs.get(spellId)` (`main.mo` 1008–1009), so Strike / summons return `#err("Spell not found")`. `physical_attack` is in `OLD_SPELL_IDS` (`main.mo` 689–697) and is removed on every start. The same id is in `OLD_SPELL_NAMES_SET` (`WorldExploration.tsx` 2356–2389). Enemy kits request `physical_attack` (`enemyAI.ts` 165–174). `assignEnemySpells` resolves against `normalizedSpellPool` (WX 11920–11923), which **filters that set**, so zone-0 pawn/knight/rook kits are empty unless the summoner roll appends wolf/archer (11932–11942). `BUILT_IN_SPELL_IDS` (`adminSafety.ts` 9–16) is the six backend ids, not the starters.  
SYSTEMS_AFFECTED: `AdminLib.defaultSpells`; `main.mo` purge; `upgradeSpell`; WX tombstone set; `buildEnemyKit` resolution  
RECOMMENDED_ACTION: Insert every **currently live** player-facing starter/unique/summon id into `spellConfigs` with complete metadata (`targetType` included). Remove `physical_attack` from the purge list **and** from the id tombstone; keep purge for truly dead ids (`fireball`, `blood_nova`, …). Tombstones are **ids only**, never names. Do not treat seed insertion as unlocking — ownership still follows 003. Do **not** seed Wave-4 paper ids from #371/#342 as owned (018). Extract the WX filter; union WX siblings.  
AUTONOMY: HUMAN_APPROVE — purge-list edit is irreversible on canister start.  
DEPENDENCIES: SDA-2026-08-31-007; SDA-2026-09-22-005; SDA-2026-09-22-008; SDA-2026-09-22-018  
REGRESSION_RISK: HIGH if purge still drops `physical_attack` after seed; HIGH if the name-set still strips Strike from enemy kits; HIGH if Wave-4 uniques are inserted as `usableByPlayer=true` and the catalog helper grants them.  
VALIDATION_REQUIRED: `upgradeSpell("physical_attack")` and `upgradeSpell("summon-dire-wolf")` return `#ok`. Purge still removes `fireball`. Zone-0 pawn kit resolves Strike. Filter tests use ids only. New character still does not own Wave-4 uniques.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-09-22-008  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Replace name heuristics with id tombstones and explicit summonAI  
CATEGORY: no-heuristics  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: `OLD_SPELL_NAMES_SET` filters by **name and id** (`WorldExploration.tsx` 2356–2389), including live `physical_attack` and retired display names (`Fireball`, `Blood Nova`). `summonSpawn.ts` 165 sets unit name via `spell.name.replace("Summon ", "")`. `inferSummonArchetype` (`enemyAI.ts` 218–224) falls back to `summon.name` containing wolf/golem/wisp/archer/bomber after checking `summonAI`. Editor option “Heal (targets self)” (`AdminDashboard.tsx` 2685) teaches targeting from `spellType` because `targetType` is missing. Architecture already states `spell.name` is UI/log only.  
SYSTEMS_AFFECTED: WX catalog filter; `engine/summonSpawn.ts`; `engine/enemyAI.ts`; Admin summon / targeting editor  
RECOMMENDED_ACTION: Tombstone retired ids as an id list (no name keys; do not include live combat ids — see 007). Require `summonAI` and `displayName` on every summon def. Empty `summonAI` is a validation error, not a name fallback and not hunter. Targeting is `targetType`, never the Heal option label. Do not add new `includes(spell.name)` branches. Extract helpers; do not grow WX. Union #327 if `enemyAI.ts` is touched.  
AUTONOMY: IMPLEMENT_AFTER_HUMAN — mechanical once defs have the fields.  
DEPENDENCIES: SDA-2026-08-31-006; SDA-2026-09-22-002; SDA-2026-09-22-005; SDA-2026-09-22-007  
REGRESSION_RISK: MEDIUM — a summon missing `summonAI` currently becomes hunter; after this it must fail validate before activate.  
VALIDATION_REQUIRED: Filter tests use ids only. Summon with `summonAI=healer` and name “Orb” still heals. Rename “Summon Dire Wolf” does not change `displayName`. Heal + `targetType=ally` is legal; the option text does not imply self.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-09-22-009  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Persist acquisition flags and the observe → win → unlock default  
CATEGORY: discovery-pipeline  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: No `ENEMY_DISCOVERY` / `ACHIEVEMENT` / `CHALLENGE` / `BOSS` / `ELITE` / `SPECIAL_ENCOUNTER` / `MULTI_SOURCE` / `ENEMY_ONLY` / `BOSS_ONLY` / `SYSTEM_ONLY` field. No `OBSERVATION_REQUIRED` / `VICTORY_REQUIRED` / `PLAYER_LEARNABLE`. No `recordSpellObservation` / `commitSpellDiscoveries`. Recap is still XP/Doka/feats (`PostBattleRecap.tsx` `BattleRecapData`; `newlyUnlockedAchievements` only). Combat already has assigned kits and cast apply sites (`enemyAI.ts`; WX 11915–11930) so “enemy actually used the id” is observable without name matching. Quality audit already marked discovery pacing `NO_MEASURABLE_EFFECT`.  
SYSTEMS_AFFECTED: SpellDefinition; persist lock; `main.mo`; PostBattleRecap; observe hook at enemy cast apply (helper, not WX growth)  
RECOMMENDED_ACTION: Persist the closed route enum and the three flags (08-31 §4 defaults). Default route `ENEMY_DISCOVERY`: eligible unknown → enemy kit contains id → hostile cast spends AP → observed → same-encounter win → `ownedSpellIds` + root recap. On successful hostile cast of an eligible id, enqueue `recordSpellObservation`. On victory persist, `commitSpellDiscoveries` grants observed eligible ids. Do not call `updateCharacter` or `upgradeSpell` to grant. Hostile summons may observe; player-side summons must not. Wave-4 uniques (018) use this path or ELITE / `triune_gallery`, never catalog grant. New maps need 016.  
AUTONOMY: HUMAN_APPROVE — touches victory persist.  
DEPENDENCIES: SDA-2026-08-31-003; SDA-2026-08-31-004; SDA-2026-09-22-003; SDA-2026-09-22-016; SDA-2026-09-22-018  
REGRESSION_RISK: HIGH if granted off the persist lock or on preview/AI-consider.  
VALIDATION_REQUIRED: Assigned-but-not-cast does not observe; cast then flee keeps observation without unlock; cast then win unlocks once; `ENEMY_ONLY` never unlocks; recap shows the id.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-09-22-010  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Admin-authored CORE / ADVANCED / RARE / ELITE / SIGNATURE pools; one numeric-zone helper  
CATEGORY: enemy-pools  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `ENEMY_KITS` is a hardcoded `Record<ChessPieceType, …>` (`enemyAI.ts` 163–185). Admin `EnemyConfig` has no spell fields (`admin.mo` 15–26). Battle start comments “10 random spells” then `buildEnemyKit(enemy.pieceType, currentMap.levelZone)` (`WorldExploration.tsx` 11915–11923). `currentMap.levelZone` is `{ name, minLevel, maxLevel }` (4683, 5234, 5439, 5517, 13514, 13646), so `Math.floor(levelZone)` is `NaN` and every kit stays zone 0. `longHorizonSim.ts` 51–78 already documents that NaN and still `Math.floor`s the value as a number — a second kit that will drift. Summoner extras append wolf/archer by hardcoded id (WX 11932–11942).  
SYSTEMS_AFFECTED: new `enemyKits` store; Admin Kits tab; `buildEnemyKit` call site; `longHorizonSim.ts`; summoner bonus  
RECOMMENDED_ACTION: Persist `EnemyKit` (08-31 §6) with pools CORE / ADVANCED / RARE / ELITE / SIGNATURE. One `resolveEnemyKit(enemyId, numericZone, tags)` used by combat **and** `longHorizonSim`. Pass `minLevel` or a numeric zone — never the LevelZone object. Chess piece may supply a template when cloning a new enemy. Summoner extras become `bonusSummonSpellIds`. Empty resolve falls back to `physical_attack`. Extract the WX call site; union #327 if `enemyAI.ts` is touched.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: SDA-2026-08-31-008; SDA-2026-09-22-007; SDA-2026-09-22-008  
REGRESSION_RISK: MEDIUM — empty kit must not leave enemies unarmed. Fixing zone NaN will suddenly enable ADVANCED ids (`spell-venom-strike`, `spell-inferno`) — confirm those ids exist in the catalog first (007). Two kit copies must not diverge.  
VALIDATION_REQUIRED: Zone 0 pawn kit matches today’s ids including Strike; zone ≥ 1 pawn also gets venom-strike; missing id skipped and logged; no `starterSpells.find(id === "summon-dire-wolf")`; sim and combat share the helper.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-09-22-011  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Unify boss kits; repair Motoko spellPoolIds; stop lying about delete  
CATEGORY: boss-kits  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Three sources: (1) `data/bossKits.ts` is the live combat table and already validates ids against `spellData.ts`; (2) `defaultBossConfigs()` (`admin.mo` 350+) still lists `fireball`, `cursed_gust`, `entangle`, `mist_form`, `blood_nova`, `obliterate`, `poison_dart`, `ice_shard`, `meteor_strike`, `plague_wave`, `inferno`, `frost_nova` which `main.mo` 689–697 removes every start — Crimson Countess seed also lists live `physical_attack` next to purged `blood_nova` (376–379); (3) Admin Bosses tab chips `getSpellConfigs()` (`AdminDashboard.tsx` 7750). Confirm dialog (3791–3795) claims immediate remove even when the canister only flips `usableByPlayer`. Toast is `"Spell deleted"` (6166).  
SYSTEMS_AFFECTED: `AdminLib.defaultBossConfigs`; `bossKits.ts`; Boss editor chips; Admin spell confirm/toast  
RECOMMENDED_ACTION: One id list is canonical. Retarget Motoko phase pools to live ids by **id** (or stop seeding Motoko kits and persist `bossKits.ts`). Validator marks unresolved chips crimson. Confirm/toast must distinguish retire / draft-delete / rejected. Do not “fix” by matching names. Union #341 hide-× (017) without keeping the `usableByPlayer` retire copy.  
AUTONOMY: HUMAN_APPROVE — changes boss encounter identity.  
DEPENDENCIES: SDA-2026-08-31-009; SDA-2026-09-22-004; SDA-2026-09-22-007; SDA-2026-09-22-017  
REGRESSION_RISK: MEDIUM — empty resolved pool becomes melee-only. Divergent Motoko vs `bossKits.ts` after a canister re-seed surprises Admin vs live combat.  
VALIDATION_REQUIRED: Every seeded `spellPoolIds` entry exists in `spellConfigs` and is `usableByEnemy`. Admin chips match live `bossKits.ts`. Retire toast ≠ delete toast.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-09-22-012  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Let achievements and challenges grant spells via explicit ids on the existing whitelist  
CATEGORY: feat-challenge-rewards  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `AchievementConfig` has only `dokaReward` (`admin.mo` 249–256). `defaultAchievements()` (309–326) is Doka + string `condition`. `knownAchievementCondition` (`adminGuard.mo` 515–531) now **whitelists** the 15 live keys — that is the door, not a reward. `validateAchievementConfig` (533–546) still only caps Doka/description. `markAchievementUnlocked` / `claimAchievementReward` do not write spells; unlock rejects inactive. Wallet/level feats correctly defer until `applyRewards` (`adminSafety.ts` 392) — still Doka. Challenges still `{ doka, xp, badge }` (`challengeCompletion.ts` 27). Do not invent a new condition string to hang a spell on. Do not restamp `unstoppable` / `level_10` as a spell door.  
SYSTEMS_AFFECTED: `AchievementConfig`; AchievementEditor; `markAchievementUnlocked`; challenge persist helpers; recap  
RECOMMENDED_ACTION: Add `spellRewardIds: [Text]` to achievements and `rewards.spellIds` to challenges. Grant on unlock / challenge persist (same lock as XP/Doka) via `unlockOwnedSpell`, never `upgradeSpell`. Skip retired ids (001 legacy). Do not infer the reward from the achievement name. Keep `getPlayerAchievements(identity.getPrincipal())`. Attach only to existing whitelist keys. New field needs 016.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: SDA-2026-08-31-010; SDA-2026-09-22-001; SDA-2026-09-22-003; SDA-2026-09-22-016  
REGRESSION_RISK: MEDIUM — remount double-grant must be idempotent. A free-text condition would bypass the whitelist.  
VALIDATION_REQUIRED: Feat with a spell id grows owned set once; claim still pays Doka. Failed challenge grants neither. Retired reward id: Doka paid, spell skipped. Unknown condition still rejected. `level_10` still Doka-only.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-09-22-013  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Draft / validate / activate / deactivate / rollback / compare / duplicate  
CATEGORY: lifecycle-tooling  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `adminSetSpellConfig` writes the live map immediately after `validateSpellConfig` (`main.mo` 869–880). No revision store. Admin Save is the only write (`AdminDashboard.tsx` 3547–3565; `useSpellQueries.ts` 57–91). Duplicate/compare do not exist. `newSpell()` ids are `spell_${Date.now()}` (86) — not a stable catalog id. `adminRollbackLevelUpConfig` / `GameConfig` / `TierSpawnConfig` / `ColorPalette` / `BossRushConfig` exist; **spells have no rollback**. Combat would read a dirty draft if drafts shared the live map. Dashboard is 8 280 lines.  
SYSTEMS_AFFECTED: `spellConfigs` + `spellRevisions`; Admin Versions tab; activate gate; `useSpellQueries.ts`  
RECOMMENDED_ACTION: Combat reads `activeRevision` only. Editor writes `draftDefinition`. Validate is the shared function from 006. Activate bumps revision (cap 20) and requires a stable id (`^[a-z][a-z0-9_-]{1,47}$`), not `Date.now()`. Rollback clones a prior revision into a new draft, then activate (never silent overwrite). Duplicate allocates a new id and does not copy ownership. Deactivate hides from new content without touching owned progress. Do not grow AdminDashboard until this API exists. New revision store needs 016.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: SDA-2026-08-31-011; SDA-2026-09-22-001; SDA-2026-09-22-006; SDA-2026-09-22-016  
REGRESSION_RISK: MEDIUM — a draft leaking into player `getSpellConfigs` shows unfinished spells.  
VALIDATION_REQUIRED: Player hydrate unchanged while a draft is dirty. Rollback restores prior AP/range. Duplicate does not copy ownership. Activate rejects `spell_1758…` Date ids.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-09-22-014  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Persist spell-bar ids from ownership, not only from upgrade keys  
CATEGORY: bar-persist  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `setSpellBarOrder` still filters to `character.spellLevelKeys` (`main.mo` 1945–1947). Comments still say this is a workaround for unseeded catalogs (1938–1944). Levels are only written by `upgradeSpell`. Every never-upgraded starter (the entire live bar for a new character) is dropped on save. After 003, the legal set is `ownedSpellIds ∪ spellLevelKeys`, including retired-but-owned ids. #388 (pending) hydrates combat **levels** from those arrays only — empty keys must still allow an owned bar (019).  
SYSTEMS_AFFECTED: `main.mo` `setSpellBarOrder`; WX bar save (call-site only)  
RECOMMENDED_ACTION: Accept ids that are owned or have a level row. Drop unknown ids with a debug line. Do not require `lifecycle=active` or `usableByPlayer=true`. Max 8 unchanged.  
AUTONOMY: IMPLEMENT_AFTER_HUMAN  
DEPENDENCIES: SDA-2026-08-31-013; SDA-2026-09-22-003; SDA-2026-09-22-001; SDA-2026-09-22-019  
REGRESSION_RISK: MEDIUM — too loose re-allows unknown ids; too tight still strips starters.  
VALIDATION_REQUIRED: New character saves eight never-upgraded innate ids; reload matches. Unknown id dropped. Retired owned id kept. Empty `spellLevelKeys` after #388 still keeps owned bar ids.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-09-22-015  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Extract SpellEditor onto the useSpellQueries landing; do not grow WorldExploration  
CATEGORY: owner-ui  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Admin tabs (`AdminDashboard.tsx` 5611–5626) have Spells and Achievements but no Discovery, Kits, Graph, or Versions. SpellEditor covers AP, range, min range, LoS flags, buff/debuff/DoT, mechanic bools, cooldown (2652–2656), and the two usable checkboxes. It has **zero** `targetType` matches, no summon controls (despite persist + bindgen + save-validator + `spellType` enum `"summon"`), and Spell Type is only damage/heal/drain (2684–2687) with “Heal (targets self)”. Dashboard is 8 280 lines; WX is 19 213. `useSpellQueries.ts` (57–91) is already the mutation path. Live delete mutation (94–108) has no client built-in block; #341 adds it. 08-31 studio tabs are unspecified in the live shell. Older open PRs already edit WX and AdminDashboard.  
SYSTEMS_AFFECTED: extracted `SpellEditor`; `useSpellQueries.ts`; future studio tabs; not WX; not a 9k-line dashboard  
RECOMMENDED_ACTION: Extract SpellEditor. Add Target Type, Summon (including `displayName` + kit ids), Acquisition (route + three flags), and a validation strip. Delete on published ids is Retire with dependents. Stay on the existing `#admin` + lazy gate and carved-stone language. Keep writes in `useSpellQueries`. Do not grow `WorldExploration.tsx`. Do not add studio tabs until 013 activate exists on the canister. Union #327 / #331 / #334 / #341 if any shared file is touched; one `export function` per name.  
AUTONOMY: IMPLEMENT_AFTER_HUMAN — UI after persist 001/002/005/009.  
DEPENDENCIES: SDA-2026-08-31-012; SDA-2026-09-22-001; SDA-2026-09-22-002; SDA-2026-09-22-005; SDA-2026-09-22-013; SDA-2026-09-22-017  
REGRESSION_RISK: MEDIUM — a second visual system or a player-facing studio leaks. Growing WX for editor wiring is forbidden. Concatenating a second `export function` on a restack fails `vite build`.  
VALIDATION_REQUIRED: Dev-only `#admin`. Saving Shield keeps `targetType=ally`. Saving a summon without `displayName` is blocked. Retire confirm lists dependents. Player `#play` cannot open the studio. `pnpm check` clean.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-09-22-016  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: New later EOP file after 20260901 for any new spell persist maps  
CATEGORY: eop-migrations  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Ownership, observation, lifecycle, acquisition, `spellRewardIds`, and revision stores are new persistent `let`/`var`s. Live chain is five files (`mops.toml` `check-limit = 5`): genesis `20260801_000000`, name-only `20260803_185500`, drop-transients `20260827_000000`, frozen Aug-31 shape `20260831_000000` (42 stables, **no GameKey**), frozen GameKey `20260901_000000`. Caffeine deploys exactly `mops build` / `mops check` against its own `.old` (Aug-31 import, no GameKey). Adding a stable onto `20260831` or `20260901` is M0263 at Caffeine or a runtime `not found in persisted state` false-negative. Blanking or hand-writing `.old` is forbidden.  
SYSTEMS_AFFECTED: `src/backend/migrations/`; `mops.toml` `check-limit`; `.old/src/backend/dist/backend.most`; `snapshots/deployed/`; 001 / 003 / 005 / 009 / 012 / 013 persist PRs  
RECOMMENDED_ACTION: For any new stable, add a **new later** `src/backend/migrations/YYYYMMDD_HHMMSS.mo` after `20260901_000000` with `OldActor = {}` and `NewActor` = the new fields (empty maps / zero defaults). Never edit a shipped `NewActor`. Never rename/delete a recorded name. Bump `check-limit` to the new chain length. Run `python3 scripts/check-eop-stables.py` and `bash scripts/caffeine-import-gate.sh backend`. Do not put GameKey-class fields on `20260831`. Do not implement gameplay in the migration-only slice.  
AUTONOMY: HUMAN_APPROVE — Caffeine import + live actor upgrade.  
DEPENDENCIES: Blocks 001 / 003 / 005 / 009 / 012 / 013 persist. Independent of UI-only slices.  
REGRESSION_RISK: HIGH — wrong position → `RTS error: Memory-incompatible program upgrade` (IC0503) or M0263 on Caffeine import. False-negative if previous version is already at the new head.  
VALIDATION_REQUIRED: `check-eop-stables.py` pass; `mops check` vs `.old` (Aug-31, no GameKey) pass; `snapshots/deployed/*.most` pass; `snapshots/unsupported/` still fail; empty-canister genesis still sorts first. PocketIC `eop-upgrade-matrix.mjs` when `pocket-ic` is installed.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-09-22-017  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Union #341 delete-block; do not freeze usableByPlayer as retire copy  
CATEGORY: stack-compat  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Live `useAdminDeleteSpellConfig` (`useSpellQueries.ts` 94–108) has no client built-in guard. Live confirm (AdminDashboard 3791–3795) and toast `"Spell deleted"` (6166) already lie when Motoko only flips `usableByPlayer`. Open [#341](https://github.com/Mr-Melic/stralt/pull/341) (created before this PR) adds `adminSpellDeleteBlockedReason` and `BUILT_IN_SPELL_DELETE_BLOCKED = "Cannot delete a built-in spell; set usableByPlayer=false to retire it"` on `adminSafety.ts`, hides × on built-in ids, and unions AdminDashboard with #334. That is correct **delete UX** on the **wrong field**. Oldest-first merge lands #341 before any 001 persist PR.  
SYSTEMS_AFFECTED: `adminSafety.ts`; `useSpellQueries.ts`; AdminDashboard spell list; 001 / 004 / 011 / 015 implementer PRs  
RECOMMENDED_ACTION: Keep the built-in × hide and the client preflight after #341 lands. Rewrite the constant/copy to name `lifecycle=retired` (or “retire, do not delete”) — never teach `usableByPlayer=false` as retire. Union one `adminSpellDeleteBlockedReason`; do not concatenate a second copy (esbuild `noRedeclare` / duplicate export). Do not treat #341 as 001 done.  
AUTONOMY: IMPLEMENT_AFTER_HUMAN — mechanical union + copy rewrite once 001 exists; copy-only rewrite is legal earlier.  
DEPENDENCIES: SDA-2026-09-22-001; SDA-2026-09-22-004; SDA-2026-09-22-015; open PR #341  
REGRESSION_RISK: MEDIUM — dropping the hide-× re-exposes built-in delete clicks; keeping the Motoko string after 001 ships two retire models.  
VALIDATION_REQUIRED: Built-in × stays hidden. Custom draft still deletes. After 001, the blocked-reason string does not mention `usableByPlayer`. `pnpm check` / duplicate-export scan clean.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-09-22-018  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Wave-4 unique ids stay unowned until their acquisition route  
CATEGORY: discovery-pipeline  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Open [#371](https://github.com/Mr-Melic/stralt/pull/371) / [#342](https://github.com/Mr-Melic/stralt/pull/342) add Wave-4 unique/tactical ids (design only) that fill leftover doors via observe+win / ELITE / `triune_gallery`. Live `ownedSpells` grants every `starterSpells` row (`WorldExploration.tsx` 2395–2408) plus every `usableByPlayer !== false` backend row. If 007 seeds those paper ids into `spellConfigs` with the default `usableByPlayer: true` (`newSpell()` 98), the inverted helper (`adminSafety.ts` 711–719) grants them to every account. #371 already states unique rows must not be pre-owned.  
SYSTEMS_AFFECTED: catalog seed (007); ownership hydrate (003); acquisition (009); Admin acquisition controls (015)  
RECOMMENDED_ACTION: Wave-4 unique ids, when persisted, stamp `PLAYER_LEARNABLE` + route (`ENEMY_DISCOVERY` / `ELITE` / `SPECIAL_ENCOUNTER`) and `usableByPlayer=false` until owned. Seed 007 inserts **live** `spellData.ts` combat ids only, or inserts uniques with the learnable flag false. Never force `isBaseSpell: true` on them. Do not restamp `unstoppable` / `level_10` as a spell door.  
AUTONOMY: HUMAN_APPROVE — acquisition identity for a generation of cards.  
DEPENDENCIES: SDA-2026-09-22-003; SDA-2026-09-22-007; SDA-2026-09-22-009  
REGRESSION_RISK: HIGH if seed+helper grants 19 uniques on next hydrate.  
VALIDATION_REQUIRED: After catalog seed, a new character’s owned set does not include Wave-4 unique ids. Observe→win (or the stamped ELITE / gallery route) is the only grant.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-09-22-019  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Canister-array level hydrate is not the owned set  
CATEGORY: ownership-persist  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Open [#388](https://github.com/Mr-Melic/stralt/pull/388) hydrates combat spell levels from canister `spellLevelKeys` / `spellLevelValues` only, so leftover localStorage cannot mint unpaid `1.03^N`. That is the correct **level** rule (`saveBattleStats` already ignores those arrays; `upgradeSpell` is the sole writer). Live ownership still pretends `spellLevelKeys ∪ spellBarOrder ∪ starterSpells` is owned (`WorldExploration.tsx` 2419–2433). After 003, innate never-upgraded ids have **empty** keys and must remain owned. `setSpellBarOrder` (1945–1947) already drops those ids.  
SYSTEMS_AFFECTED: spell-level hydrate helper (#388 `spellLevelHydrate.ts`); `ownedSpellIds`; `setSpellBarOrder`; WX hydrate  
RECOMMENDED_ACTION: Keep #388’s “empty keys → `{}` levels” behavior. Ownership reads `ownedSpellIds` (003), not the level map. Bar persist (014) accepts owned ids without a level row. Do not merge the two maps. Union the hydrate helper; do not concatenate a second `export function`.  
AUTONOMY: IMPLEMENT_AFTER_HUMAN  
DEPENDENCIES: SDA-2026-09-22-003; SDA-2026-09-22-014; open PR #388  
REGRESSION_RISK: MEDIUM — treating empty keys as “strip the bar” after 003 silently disarms new characters.  
VALIDATION_REQUIRED: Delete+recreate same slot: no ghost levels from localStorage. New character: innate ids owned, levels `{}`, bar of eight never-upgraded ids still saves (014).  
STATUS: NEW  

---

ACTION_ID: SDA-2026-09-22-020  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Do not re-implement #384 effectParams JSON; remaining clamp list  
CATEGORY: lifecycle-tooling  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Live Motoko `effectParams` check is length ≤ 2_048 only (`adminGuard.mo` 412–418). Client `validateSpellConfig` (`adminSafety.ts` 578–660) omits `effectParams` entirely. Open [#384](https://github.com/Mr-Melic/stralt/pull/384) (and #374) add `jsonBlobLooksWellFormed` / `validateJsonBlob("effectParams")` on both sides and pass `effectParams` through `useSpellQueries.ts`. 09-22-006 remaining live drift is therefore **only** `mpCost`, `cooldown`, `damage`, `healAmount`, `minLevel`, `hitTiles` size, AP 0 exception, `targetType` / acquisition / name-heuristic scan — not JSON well-formedness.  
SYSTEMS_AFFECTED: `adminGuard.mo`; `adminSafety.ts`; `useSpellQueries.ts`; 006 activate gate  
RECOMMENDED_ACTION: After #384 lands, treat `effectParams` JSON as **LANDED**. Implement 006 against the remaining list. Union one `jsonBlobLooksWellFormed` / `validateSpellConfig`; do not concatenate. `{oops` must keep failing.  
AUTONOMY: IMPLEMENT_AFTER_HUMAN  
DEPENDENCIES: SDA-2026-09-22-006; open PR #384  
REGRESSION_RISK: LOW if followed; MEDIUM if a restack drops #384’s well-formed check while adding `targetType`.  
VALIDATION_REQUIRED: `effectParams: "{oops"` still rejected after 006. Valid `void_collapse` attract JSON still saves. Client and Motoko share the JSON error. Duplicate-export scan clean.  
STATUS: NEW  
