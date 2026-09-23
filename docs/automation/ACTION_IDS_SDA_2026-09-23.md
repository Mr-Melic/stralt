# ACTION_IDs — 2026-09-23 Spell, Discovery & Achievement Admin Designer

Durable ledger for implementers and the Report Action Orchestrator.  
Source of every record: Spell, Discovery & Achievement Admin Designer.  
Design contract: [`SPELL_ADMIN_DESIGN_2026-09-23.md`](./SPELL_ADMIN_DESIGN_2026-09-23.md) (this delta) + [`SPELL_ADMIN_DESIGN_2026-08-31.md`](./SPELL_ADMIN_DESIGN_2026-08-31.md) (full studio).  
09-21 IDs live on unmerged [#353](https://github.com/Mr-Melic/stralt/pull/353). 09-22 IDs live on unmerged [#398](https://github.com/Mr-Melic/stralt/pull/398). Treat **09-23-00N as the same first-cut as 09-22-00N** — do not implement both. 021–028 are this run’s queue-union IDs. Prior IDs `SDA-2026-08-31-001` … `013`, `SDA-2026-09-01-001` … `014`, and `SDA-2026-09-02-001` … `015` remain OPEN, PARTIAL, or LANDED as tabulated in the 09-23 design §9 — do not close them from this file except 09-01-002 (bindgen) and the empty-AI half of 09-02-006, which **landed**.  
Do not implement gameplay from this file unless a later human or orchestrator explicitly picks an ID. This run ships **docs only**.

HEAD: `0f5363f`.

Older still-open PRs (union, do not overwrite): **#327** then **#331**, then #333–#471. SDA-relevant: **#334** / **#415** / **#457** (AdminDashboard copy), **#341** (`adminSafety.ts` / `useSpellQueries.ts` / AdminDashboard delete UX), **#353** / **#398** (prior SDA docs — do not rewrite those files), **#371** / **#342** / **#411** / **#463** (Wave-4/5/6 unique ids, docs only), **#384** / **#374** (`effectParams` JSON), **#388** (spell-level hydrate), **#400** (`spellCatalogEvolve.ts` 32-id allowlist), **#413** (retired chip on `usableByPlayer=false`), **#437** (freeze unclaimed Doka), **#449** (enemy/boss admin kits), **#460** (unique feat conditions), **#466** (`upgradeSpell` paid grant). Keep one `export function` per name.

---

ACTION_ID: SDA-2026-09-23-001  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Separate lifecycle from usableByPlayer  
CATEGORY: dependency-safety  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: `adminDeleteSpellConfig` (`src/backend/main.mo` 882–902) refuses to delete the six `isBuiltInSpellId` rows (`adminGuard.mo` 21–24) and otherwise writes `{ existing with usableByPlayer = false }` when `_spellReferencedByPlayers` is true. Error copy still says “set usableByPlayer=false to retire it” (887). `upgradeSpell` (1008–1014) treats `usableByPlayer=false` as “Spell is retired.” Client helpers `shouldRejectRetiredSpellUpgrade` / `shouldIncludeBackendSpellInLibrary` (`src/frontend/src/utils/adminSafety.ts` 217–223, 711–719) use the same flag. `usableByPlayer` is documented as a cast/equip gate (`src/backend/types/admin.mo` 117). Open #341 copies that Motoko string into `BUILT_IN_SPELL_DELETE_BLOCKED`. Open #413 paints `usableByPlayer===false` as a `"retired"` chip. Owned-but-never-upgraded ids are not in `spellLevelKeys`, so the current upgrade check would block the legacy upgrade 08-31 §8.2 requires.  
SYSTEMS_AFFECTED: `main.mo` `adminDeleteSpellConfig` / `upgradeSpell`; `adminGuard.mo` `isBuiltInSpellId`; `adminSafety.ts`; Admin retire control; future `lifecycle` on `SpellDefinition`  
RECOMMENDED_ACTION: Add `lifecycle: draft | active | inactive | retired`. Keep `usableByPlayer` / `usableByEnemy` as cast gates only. Retire writes `retired` + freezes `retiredRevision`. `upgradeSpell` allows owned retired ids (owned set ∪ `spellLevelKeys`), rejects unowned retired. Do not extend the `usableByPlayer=false` retire path. Validator rejects `PLAYER_LEARNABLE=true` on `ENEMY_ONLY` / `BOSS_ONLY`. New field needs 016. Union 017 / 021 if #341 / #413 have landed.  
AUTONOMY: HUMAN_APPROVE — persist shape + live actor upgrade.  
DEPENDENCIES: SDA-2026-08-31-005 (supersedes the field choice); SDA-2026-09-23-003 (owned set); SDA-2026-09-23-016; SDA-2026-09-23-017; SDA-2026-09-23-021  
REGRESSION_RISK: HIGH if existing `usableByPlayer=false` rows are migrated as retired when they were meant as enemy-only. Inventory those ids before flip.  
VALIDATION_REQUIRED: Retire a published id: already-owned still casts and upgrades; new character cannot learn; `usableByPlayer` can stay true for that owned cast. An `ENEMY_ONLY` active id with `usableByPlayer=false` is not treated as retired.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-09-23-002  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Persist complete combat SummonUnitDef; drop the hunter default  
CATEGORY: spell-contract  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Bindgen already includes Motoko summon fields (`src/frontend/src/backend.ts` 118–152) — 09-01-002 landed. Motoko now rejects empty `summonAI` when `isSummon` (`adminGuard.mo` 423–426). Motoko `SummonUnitDef` is still only `pieceType` / `level` / `hpScale` / `damageScale` (`admin.mo` 85–90). Combat `SummonUnitDef` also has `summonKit`, `ap`, `mp` (`summonSpawn.ts` 22–33). Spawn display name is `spell.name.replace("Summon ", "")` (`summonSpawn.ts` 165). Runtime still does `spell.summonAI || "hunter"` (`summonSpawn.ts` 139). `inferSummonArchetype` still falls back to `summon.name` (`enemyAI.ts` 218–224). Admin Spell Type `<select>` has no summon option (`AdminDashboard.tsx` 2684–2687) despite `newSpell()` seeding empty summon fields (131–134). Validators accept `spellType="summon"` that the editor cannot set.  
SYSTEMS_AFFECTED: `admin.mo` `SummonUnitDef`; bindgen; `adminContract.ts`; SpellEditor; `summonSpawn.ts`; `enemyAI.ts`  
RECOMMENDED_ACTION: Extend persist with `displayName: Text`, `summonKit: [Text]`, `ap` / `mp`. Require them on activate when `isSummon`. Never derive `displayName` or `summonAI` from `spell.name`. Remove `|| "hunter"` — missing AI is illegal, not hunter. Ship Motoko + bindgen + editor together. Do not redeploy `backend_extended/`. Do not re-open 09-01-002 or the empty-AI Motoko reject. New fields need 016.  
AUTONOMY: HUMAN_APPROVE — Candid shape.  
DEPENDENCIES: SDA-2026-09-01-002 (landed; do not redo); SDA-2026-09-23-005 (`targetType=ground`); SDA-2026-09-23-008; SDA-2026-09-23-016  
REGRESSION_RISK: HIGH — every `adminSetSpellConfig` / `getSpellConfigs` call. A lagging actor rejects new-field saves. Empty `summonKit` must not crash combat (fall back to no casts). Dropping the hunter default will fail-closed on catalog rows that never stamped `summonAI`.  
VALIDATION_REQUIRED: Save a row with `isSummon=true`, `summonAI="hunter"`, `displayName="Dire Wolf"`, `summonKit=["physical_attack"]`; refetch matches. Rename the spell; unit name stays Dire Wolf. Empty AI fails client, Motoko, and spawn. `pnpm typecheck` + `mops check`.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-09-23-003  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Stop treating shouldIncludeBackendSpellInLibrary as ownership  
CATEGORY: ownership-persist  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: `ownedSpells` is still `starterSpells` (all forced `isBaseSpell`) ∪ backend rows (`WorldExploration.tsx` 2395–2440). Comment at 2395 still says “ALL starter spells + physical attack”. `shouldIncludeBackendSpellInLibrary` (`adminSafety.ts` 711–719) returns true whenever `usableByPlayer !== false`. The `ownedIds` argument is `baseSpells ∪ spellLevelKeys ∪ spellBarOrder` — `baseSpells` is the entire frontend catalog (`spellData.ts`, 32 unique ids). Adding a spell in Admin with the default `usableByPlayer: true` (`AdminDashboard.tsx` 98, 2767) still grants it to every player on hydrate. `Character` (`main.mo` 122–145) has no `ownedSpellIds` / `observedSpellIds`. Leftover `activeSpells : ?[Nat]` is not the owned set. A second grant path is paid `upgradeSpell` (023 / #466).  
SYSTEMS_AFFECTED: `WorldExploration.tsx` ownedSpells; `adminSafety.ts`; `SpellbookModal.tsx`; `main.mo` character maps; create-character seed  
RECOMMENDED_ACTION: Implement SDA-2026-08-31-002. Catalog `getSpellConfigs` stays public and does not imply ownership. Seed create with `SYSTEM_ONLY` / innate four that exist in the canister (007): `physical_attack`, `starter-shield`, `starter-poison`, `starter-heal`. Migrate from `spellLevelKeys ∪ spellBarOrder` plus those base ids — **not** `getSpellConfigs()`, **not** the full `starterSpells` array, **not** #400 `OFFICIAL_STARTER_SPELL_IDS` (022), **not** Wave-4/5/6 unique ids (018 / 026). After that, the library helper reads `ownedSpellIds` only (plus retired-owned). `upgradeSpell` requires already-owned (023). Extract the helper; do not grow WX (19 213 lines). Union #327 / #331 / later WX PRs. New maps need 016. Honour 019 if #388 has landed.  
AUTONOMY: HUMAN_APPROVE — persist-lock and character-record shape.  
DEPENDENCIES: SDA-2026-08-31-002; SDA-2026-09-23-001; SDA-2026-09-23-007; SDA-2026-09-23-016; SDA-2026-09-23-018; SDA-2026-09-23-019; SDA-2026-09-23-022; SDA-2026-09-23-023  
REGRESSION_RISK: HIGH — under-seed drops the bar; over-seed reintroduces “everyone owns the catalog.”  
VALIDATION_REQUIRED: New character owns only innate/system ids. Admin adding a catalog spell does not change another account’s spellbook. Paying `upgradeSpell` on an unowned Admin id returns `#err`, not a grant. Reload: backend wins over localStorage.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-09-23-004  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Dependency report before retire; hard-delete only drafts  
CATEGORY: dependency-safety  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: `_spellReferencedByPlayers` (`main.mo` 273–284) only scans `spellLevelKeys` and `spellBarOrder`. `adminDeleteSpellConfig` (882–902) hard-`remove`s when that scan is false. Motoko boss seeds still list purged ids (`admin.mo` 350+ vs `main.mo` 689–697). Live boss kits live in `data/bossKits.ts`. Admin `EnemyConfig` has no kit field (`admin.mo` 15–26). Achievements have no `spellRewardIds`. Confirm copy (`AdminDashboard.tsx` 3791–3795) says the live spell is removed and dependents will break; toast is always `"Spell deleted"` (6166). `adminDeleteEnemyConfig` (798–805) is still unconditional `remove`. Achievement delete (2390–2409) hard-removes when no progress rows exist.  
SYSTEMS_AFFECTED: `main.mo` admin deletes; Admin confirm/toast; future graph inspector; boss/enemy/achievement stores  
RECOMMENDED_ACTION: Build a dependency report from ids (spell → enemies, achievements, challenges, bosses, AI/summon kits, acquisition). Retire if any live ref or any character own/level/bar. Hard delete only `lifecycle=draft` with zero published revisions and zero refs; else `#err` + report. Same rule for achievements and enemy configs. UI: Retire vs Delete; toast matches the canister result; list dependents. Union #341 hide-× for built-ins (017) and #413 chips (021) without treating those as the graph.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: SDA-2026-09-23-001; SDA-2026-08-31-005; SDA-2026-09-23-017; SDA-2026-09-23-021  
REGRESSION_RISK: HIGH if hard delete remains for “no player keys” while kits still list the id.  
VALIDATION_REQUIRED: Unreferenced draft deletes. Referenced active id retires and returns ok without `remove`. Boss-pool-only ref (Motoko **or** `bossKits.ts`) blocks delete. Confirm does not claim “removed” on retire.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-09-23-005  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Persist targetType (including chain) and combat mechanic flags  
CATEGORY: spell-contract  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Engine required fields include `targetType`, buff/debuff/DoT, `isSwap`/`isMirror`/`isTimestep`/`isSacrifice` (`src/frontend/src/engine/spellEngine.ts` 6–13; `types/gameTypes.ts` 215–223 includes `chain`). Motoko persist (`admin.mo` 92–127) and bindgen (`backend.ts` 118–152) omit them. `AdminDashboard.tsx` has **zero** `targetType` matches. `newSpell()` (85–135) sets cooldown and mechanic bools but not `targetType`. Starters in `spellData.ts` already stamp `targetType`. Editor can toggle `isTimestep` (3434) but Admin Save therefore cannot round-trip the metadata `targeting.ts` uses. CatalogNote (3641–3644) already admits Swap/Barrier/Trap/DoT/buff flags drop on reload. Editor “Heal (targets self)” (2685) is a targeting lie.  
SYSTEMS_AFFECTED: `admin.mo` SpellConfig; bindgen; `newSpell` / SpellEditor; `spellEngine.ts`; `targeting.ts`  
RECOMMENDED_ACTION: Add required `targetType` (including `chain`) and the mechanic/status/area fields from 08-31 §3 (or an ordered `effects` list plus a compatibility projection). Editor sections: Cost & targeting, Effects, Duration & statuses, Summon. Reject activate when `targetType` is missing. Never key targeting off `spell.name` or `spellType`. New fields need 016.  
AUTONOMY: HUMAN_APPROVE — Motoko + bindgen + actor together.  
DEPENDENCIES: SDA-2026-08-31-001 (remainder); SDA-2026-09-23-002; SDA-2026-09-23-016  
REGRESSION_RISK: HIGH — combat reads these fields; a default of `enemy` on self-heals would break Blood Mend / Shield.  
VALIDATION_REQUIRED: Save Shield (`targetType=ally`) and a summon (`ground` + complete unit def); refetch matches. Preview and live cast still use metadata only.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-09-23-006  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Replace remaining payload clamps with a shared activate-gate validator  
CATEGORY: lifecycle-tooling  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `AdminGuard.validateSpellConfig` (`adminGuard.mo` 377–449) and `adminSafety.validateSpellConfig` (`adminSafety.ts` 578–660) both reject `apCost < 1` (blocks Timestep / `allowZeroAp`). Empty-AI when `isSummon` now fails both sides (09-02-006 half landed). Client still omits Motoko caps on mp/cooldown/damage/heal/minLevel/hitTiles/`effectParams`. Neither requires `targetType`, acquisition, or a name-heuristic scan. Admin Save calls the client validator (`AdminDashboard.tsx` 3547–3565) and `useSpellQueries.ts` 64–81 repeats it. `newSpell()` still omits `targetType`. Open #384 / #374 close `effectParams` JSON well-formedness (020) — do not duplicate that work here.  
SYSTEMS_AFFECTED: `adminGuard.mo`; `adminSafety.ts`; activate endpoint; SpellEditor footer; `useSpellQueries.ts`  
RECOMMENDED_ACTION: Shared pure validate: required metadata (09-23 design §6), referential integrity of kit/reward ids, AP 0 only with an explicit flag (not a name), `isSummon` requires complete unit def on **both** sides, no name keys. Editor footer and `useSpellQueries` call the same function. Activate calls it; draft save may be looser. Keep numeric caps. Union 020 if #384 has landed.  
AUTONOMY: IMPLEMENT_AFTER_HUMAN — once 001/005 fields exist.  
DEPENDENCIES: SDA-2026-09-23-001; SDA-2026-09-23-002; SDA-2026-09-23-005; SDA-2026-08-31-011; SDA-2026-09-23-020  
REGRESSION_RISK: MEDIUM — tightening without the AP 0 exception bricks Timestep if it is ever persisted. Divergent client/Motoko strings hide canister rejects behind a generic toast.  
VALIDATION_REQUIRED: Activate rejected without `targetType`. `isTimestep` + AP 0 validates. Summon without `summonAI` fails on **both** client and Motoko with the same string.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-09-23-007  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Seed frontend starter ids; stop purging and tombstoning live physical_attack  
CATEGORY: catalog-sync  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Live combat/spellbook ids are in `spellData.ts` (32 unique ids including `physical_attack`, `starter-shield`, `summon-dire-wolf`, `spell-inferno`). Canister seed is `shadow_strike` … `void_collapse` (`admin.mo` 168–191). `upgradeSpell` requires `spellConfigs.get(spellId)` (`main.mo` 1008–1009), so Strike / summons return `#err("Spell not found")`. `physical_attack` is in `OLD_SPELL_IDS` (`main.mo` 689–697) and is removed on every start. The same id is in `OLD_SPELL_NAMES_SET` (`WorldExploration.tsx` 2356–2389) plus display name `Inferno` (live `spell-inferno`). Enemy kits request `physical_attack` (`enemyAI.ts` 165–168). `assignEnemySpells` resolves against `normalizedSpellPool` (WX 11915–11923, 2693), which **filters that set**, so zone-0 pawn/knight/rook kits are empty unless the summoner roll appends wolf/archer. `BUILT_IN_SPELL_IDS` (`adminSafety.ts` 9–16) is the six backend ids, not the starters. #400 / #466 both lock the boot-purge list including live Strike.  
SYSTEMS_AFFECTED: `AdminLib.defaultSpells`; `main.mo` purge; `upgradeSpell`; WX tombstone set; `buildEnemyKit` resolution  
RECOMMENDED_ACTION: Insert every player-facing starter/unique/summon id into `spellConfigs` with complete metadata (`targetType` included). Remove `physical_attack` from the purge list **and** from the id tombstone; keep purge for truly dead ids (`fireball`, `blood_nova`, …). Tombstones are **ids only**, never names (live Inferno landmine). Do not treat seed insertion as unlocking — ownership still follows 003. Extract the WX filter; do not grow WX.  
AUTONOMY: HUMAN_APPROVE — purge-list edit is irreversible on canister start.  
DEPENDENCIES: SDA-2026-08-31-007; SDA-2026-09-23-005; SDA-2026-09-23-008  
REGRESSION_RISK: HIGH if purge still drops `physical_attack` after seed; HIGH if the name-set still strips Strike from enemy kits or hides live `spell-inferno`.  
VALIDATION_REQUIRED: `upgradeSpell("physical_attack")` and `upgradeSpell("summon-dire-wolf")` return `#ok` for an already-owned id. Purge still removes `fireball`. Zone-0 pawn kit resolves Strike. Filter tests use ids only. `spell-inferno` remains visible.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-09-23-008  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Replace name heuristics with id tombstones and explicit summonAI  
CATEGORY: no-heuristics  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: `OLD_SPELL_NAMES_SET` filters by **name and id** (`WorldExploration.tsx` 2356–2389), including live `physical_attack` and retired display names (`Fireball`, `Blood Nova`, **`Inferno`** — live starter `spell-inferno`). `summonSpawn.ts` 165 sets unit name via `spell.name.replace("Summon ", "")`. `inferSummonArchetype` (`enemyAI.ts` 218–224) falls back to `summon.name` containing wolf/golem/wisp/archer/bomber after checking `summonAI`. Editor “Heal (targets self)” (2685) infers targeting from `spellType`. Architecture already states `spell.name` is UI/log only. #400 `shouldHidePurgedCatalogRow` already voids `spell.name` — honour that helper; do not grow WX.  
SYSTEMS_AFFECTED: WX catalog filter; `engine/summonSpawn.ts`; `engine/enemyAI.ts`; Admin summon editor  
RECOMMENDED_ACTION: Tombstone retired ids as an id list (no name keys; do not include live combat ids — see 007). Require `summonAI` and `displayName` on every summon def. Empty `summonAI` is a validation error, not a name fallback. Spell Type must not imply `targetType`. Do not add new `includes(spell.name)` branches. Extract helpers; do not grow WX.  
AUTONOMY: IMPLEMENT_AFTER_HUMAN — mechanical once defs have the fields.  
DEPENDENCIES: SDA-2026-08-31-006; SDA-2026-09-23-002; SDA-2026-09-23-007  
REGRESSION_RISK: MEDIUM — a summon missing `summonAI` currently becomes hunter; after this it must fail validate before activate.  
VALIDATION_REQUIRED: Filter tests use ids only. Live `spell-inferno` (name Inferno) is not hidden. Summon with `summonAI=healer` and name “Orb” still heals. Rename “Summon Dire Wolf” does not change `displayName`.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-09-23-009  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Persist acquisition flags and the observe → win → unlock default  
CATEGORY: discovery-pipeline  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: No `ENEMY_DISCOVERY` / `ACHIEVEMENT` / `CHALLENGE` / `BOSS` / `ELITE` / `SPECIAL_ENCOUNTER` / `MULTI_SOURCE` / `ENEMY_ONLY` / `BOSS_ONLY` / `SYSTEM_ONLY` field. No `OBSERVATION_REQUIRED` / `VICTORY_REQUIRED` / `PLAYER_LEARNABLE`. No `recordSpellObservation` / `commitSpellDiscoveries`. Recap is still XP/Doka/feats (`attachRecapUnlocks` in `recapUnlocks.ts` 16–20 writes `newlyUnlockedAchievements` only). Combat already has assigned kits and cast apply sites (`enemyAI.ts`; WX 11915–11923) so “enemy actually used the id” is observable without name matching.  
SYSTEMS_AFFECTED: SpellDefinition; persist lock; `main.mo`; PostBattleRecap; observe hook at enemy cast apply (helper, not WX growth)  
RECOMMENDED_ACTION: Persist the closed route enum and the three flags (08-31 §4 defaults). On successful hostile cast of an eligible id, enqueue `recordSpellObservation`. On victory persist, `commitSpellDiscoveries` grants observed eligible ids (same-encounter default). Show unlocks on the existing root recap. Do not call `updateCharacter` or `upgradeSpell` to grant. Hostile summons may observe; player-side summons must not. New maps need 016.  
AUTONOMY: HUMAN_APPROVE — touches victory persist.  
DEPENDENCIES: SDA-2026-08-31-003; SDA-2026-08-31-004; SDA-2026-09-23-003; SDA-2026-09-23-016  
REGRESSION_RISK: HIGH if granted off the persist lock or on preview/AI-consider.  
VALIDATION_REQUIRED: Assigned-but-not-cast does not observe; cast then flee keeps observation without unlock; cast then win unlocks once; `ENEMY_ONLY` never unlocks; recap shows the id.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-09-23-010  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Admin-authored CORE / ADVANCED / RARE / ELITE / SIGNATURE pools; one numeric-zone helper  
CATEGORY: enemy-pools  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `ENEMY_KITS` is a hardcoded `Record<ChessPieceType, …>` (`enemyAI.ts` 163–185). Admin `EnemyConfig` has no spell fields (`admin.mo` 15–26). Battle start comments “10 random spells” then `buildEnemyKit(enemy.pieceType, currentMap.levelZone)` (`WorldExploration.tsx` 11915–11923). `currentMap.levelZone` is `{ name, minLevel, maxLevel }` (4683–4687), so `Math.floor(levelZone)` is `NaN` and every kit stays zone 0. `longHorizonSim.ts` 51–58 documents the NaN and duplicates the kit. Summoner extras append wolf/archer by hardcoded id (WX 11932–11942).  
SYSTEMS_AFFECTED: new `enemyKits` store; Admin Kits tab; `buildEnemyKit` call site; summoner bonus; `longHorizonSim.ts`  
RECOMMENDED_ACTION: Persist `EnemyKit` (08-31 §6). `resolveEnemyKit(enemyId, numericZone, tags)` reads ids only. Pass `minLevel` or a numeric zone — never the LevelZone object. One helper shared with the sim. Chess piece may supply a template when cloning a new enemy. Summoner extras become `bonusSummonSpellIds`. Empty resolve falls back to `physical_attack`. Extract the WX call site; do not grow WX. New store needs 016. Coordinate kit identity with 011 / 028.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: SDA-2026-08-31-008; SDA-2026-09-23-007; SDA-2026-09-23-008; SDA-2026-09-23-016; SDA-2026-09-23-028  
REGRESSION_RISK: MEDIUM — empty kit must not leave enemies unarmed. Fixing zone NaN will suddenly enable ADVANCED ids (`spell-venom-strike`, `spell-inferno`) — confirm those ids exist in the catalog first (007).  
VALIDATION_REQUIRED: Zone 0 pawn kit matches today’s ids including Strike; zone ≥ 1 pawn also gets venom-strike; missing id skipped and logged; no `starterSpells.find(id === "summon-dire-wolf")`. Sim and live resolve the same numeric zone.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-09-23-011  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Unify boss kits; repair Motoko spellPoolIds; stop lying about delete  
CATEGORY: boss-kits  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Three sources: (1) `data/bossKits.ts` is the live combat table and already validates ids against `spellData.ts`; (2) `defaultBossConfigs()` (`admin.mo` 350+) still lists purged ids — Pale Archbishop `fireball`/`cursed_gust`/`entangle` (357–361), Crimson Countess mixes live `physical_attack` with purged `blood_nova` (375–379) — which `main.mo` 689–697 removes every start; (3) Admin Bosses tab chips `getSpellConfigs()` (`AdminDashboard.tsx` 7590–7730). Confirm dialog (3791–3795) claims immediate remove even when the canister only flips `usableByPlayer`. Toast is `"Spell deleted"` (6166).  
SYSTEMS_AFFECTED: `AdminLib.defaultBossConfigs`; `bossKits.ts`; Boss editor chips; Admin spell confirm/toast  
RECOMMENDED_ACTION: One id list is canonical. Retarget Motoko phase pools to live ids by **id** (or stop seeding Motoko kits and persist `bossKits.ts`). Validator marks unresolved chips crimson. Confirm/toast must distinguish retire / draft-delete / rejected. Do not “fix” by matching names. Union #449 (028) so a fourth source is not added.  
AUTONOMY: HUMAN_APPROVE — changes boss encounter identity.  
DEPENDENCIES: SDA-2026-08-31-009; SDA-2026-09-23-004; SDA-2026-09-23-007; SDA-2026-09-23-028  
REGRESSION_RISK: MEDIUM — empty resolved pool becomes melee-only. Divergent Motoko vs `bossKits.ts` after a canister re-seed surprises Admin vs live combat.  
VALIDATION_REQUIRED: Every seeded `spellPoolIds` entry exists in `spellConfigs` and is `usableByEnemy`. Admin chips match live `bossKits.ts`. Retire toast ≠ delete toast.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-09-23-012  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Let achievements and challenges grant spells via explicit ids on the existing whitelist  
CATEGORY: feat-challenge-rewards  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `AchievementConfig` has only `dokaReward` (`admin.mo` 249–256). `defaultAchievements()` (309–326) is Doka + string `condition`. `KNOWN_ACHIEVEMENT_CONDITIONS` is a 15-key whitelist (`adminSafety.ts` 306–322). `markAchievementUnlocked` / `claimAchievementReward` do not write spells; unlock rejects inactive (`shouldRejectInactiveAchievementUnlock` 225–229). Wallet/level feats correctly defer until `applyRewards` (`adminSafety.ts` 392–398) — still Doka. Challenges still `{ doka, xp, badge }` (`challengeCompletion.ts` 27). Open #460 unique-condition (024) and #437 freeze-unclaimed-Doka (025) are orthogonal.  
SYSTEMS_AFFECTED: `AchievementConfig`; AchievementEditor; `markAchievementUnlocked`; challenge persist helpers; recap  
RECOMMENDED_ACTION: Add `spellRewardIds: [Text]` to achievements and `rewards.spellIds` to challenges. Grant on unlock / challenge persist (same lock as XP/Doka). Skip retired ids (001 legacy). Do not infer the reward from the achievement name. Do not invent new condition strings to mean “grants this spell.” Keep `getPlayerAchievements(identity.getPrincipal())`. Keep the 15-key whitelist unless a new feat is explicitly added. New field needs 016. Union 024 / 025 if those PRs have landed.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: SDA-2026-08-31-010; SDA-2026-09-23-001; SDA-2026-09-23-003; SDA-2026-09-23-016; SDA-2026-09-23-024; SDA-2026-09-23-025  
REGRESSION_RISK: MEDIUM — remount double-grant must be idempotent.  
VALIDATION_REQUIRED: Feat with a spell id grows owned set once; claim still pays Doka. Failed challenge grants neither. Retired reward id: Doka paid, spell skipped. Duplicate active conditions still rejected after 024.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-09-23-013  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Draft / validate / activate / deactivate / rollback / compare / duplicate  
CATEGORY: lifecycle-tooling  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `adminSetSpellConfig` writes the live map immediately after `validateSpellConfig` (`main.mo` 869–880). No revision store. Admin Save is the only write (`AdminDashboard.tsx` 3547–3565, 6141–6148). Duplicate/compare do not exist. `adminRollbackLevelUpConfig` / `GameConfig` / `TierSpawnConfig` / `ColorPalette` / `BossRushConfig` exist; **spells have no rollback**. Combat would read a dirty draft if drafts shared the live map. `newSpell()` ids are `spell_${Date.now()}` (86).  
SYSTEMS_AFFECTED: `spellConfigs` + `spellRevisions`; Admin Versions tab; activate gate  
RECOMMENDED_ACTION: Combat reads `activeRevision` only. Editor writes `draftDefinition`. Validate is the shared function from 006. Activate bumps revision (cap 20). Rollback clones a prior revision into a new draft, then activate (never silent overwrite). Duplicate allocates a new id and does not copy ownership. Deactivate hides from new content without touching owned progress. Do not grow AdminDashboard (8 280 lines) until this API exists. New maps need 016.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: SDA-2026-08-31-011; SDA-2026-09-23-001; SDA-2026-09-23-006; SDA-2026-09-23-016  
REGRESSION_RISK: MEDIUM — a draft leaking into player `getSpellConfigs` shows unfinished spells.  
VALIDATION_REQUIRED: Player hydrate unchanged while a draft is dirty. Rollback restores prior AP/range. Duplicate does not copy ownership.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-09-23-014  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Persist spell-bar ids from ownership, not only from upgrade keys  
CATEGORY: bar-persist  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `setSpellBarOrder` still filters to `character.spellLevelKeys` (`main.mo` 1938–1947). Comments still say this is a workaround for unseeded catalogs. Levels are only written by `upgradeSpell`. Create writes empty keys, so the official first-bar save of starters is filtered to `[]`. After 003, the legal set is `ownedSpellIds ∪ spellLevelKeys`, including retired-but-owned ids. Open #400 `filterSpellBarForPersist` treats empty keys as owning **all 32** frontend ids (022) — honour empty-keys ≠ no-ownership (019) without adopting that allowlist.  
SYSTEMS_AFFECTED: `main.mo` `setSpellBarOrder`; WX bar save (call-site only)  
RECOMMENDED_ACTION: Accept ids that are owned or have a level row. Drop unknown ids with a debug line. Do not require `lifecycle=active` or `usableByPlayer=true`. Max 8 unchanged. Empty keys on an old row keep the SYSTEM_ONLY / innate four after 003, not the 32-id catalog. Union #400 helper if landed (022).  
AUTONOMY: IMPLEMENT_AFTER_HUMAN  
DEPENDENCIES: SDA-2026-08-31-013; SDA-2026-09-23-003; SDA-2026-09-23-001; SDA-2026-09-23-019; SDA-2026-09-23-022  
REGRESSION_RISK: MEDIUM — too loose re-allows unknown ids; too tight still strips starters; adopting #400’s 32-list re-grants uniques onto the bar.  
VALIDATION_REQUIRED: New character saves innate ids; reload matches. Unknown id dropped. Retired owned id kept. Unique Wave-4 id not on the bar unless owned.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-09-23-015  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Extract SpellEditor onto the useSpellQueries landing; do not grow WorldExploration  
CATEGORY: owner-ui  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Admin tabs (`AdminDashboard.tsx` 5610–5626) have Spells and Achievements but no Discovery, Kits, Graph, or Versions. SpellEditor covers AP, range, min range, LoS flags, buff/debuff/DoT, mechanic bools, cooldown, and the two usable checkboxes (2767). It has **zero** `targetType` matches, no summon controls (despite persist + bindgen + save-validator), and Spell Type is only damage/heal/drain (2684–2687). Save + mutation both clamp (`AdminDashboard.tsx` 3547–3565; `useSpellQueries.ts` 64–81). Dashboard is 8 280 lines; WX is 19 213. Live delete mutation (`useSpellQueries.ts` 94–108) has **no** built-in client block yet (#341 pending).  
SYSTEMS_AFFECTED: `AdminDashboard.tsx` SpellEditor (extract, do not append); `useSpellQueries.ts`; future studio tabs; not WX  
RECOMMENDED_ACTION: Extract SpellEditor. Add Target Type, Summon (including `displayName` + kit ids), Acquisition (route + three flags), and a validation strip. Delete on published ids is Retire with dependents. Stay on the existing `#admin` + lazy gate and carved-stone language. Do not grow `WorldExploration.tsx`. Do not add studio tabs until 013 activate exists on the canister. Union AdminDashboard siblings (027).  
AUTONOMY: IMPLEMENT_AFTER_HUMAN — UI after persist 001/002/005/009.  
DEPENDENCIES: SDA-2026-08-31-012; SDA-2026-09-23-001; SDA-2026-09-23-002; SDA-2026-09-23-005; SDA-2026-09-23-013; SDA-2026-09-23-027  
REGRESSION_RISK: MEDIUM — a second visual system or a player-facing studio leaks. Growing WX for editor wiring is forbidden. Concatenating SpellEditor copies from sibling PRs fails `vite build`.  
VALIDATION_REQUIRED: Dev-only `#admin`. Saving Shield keeps `targetType=ally`. Saving a summon without `displayName` is blocked. Retire confirm lists dependents. Player `#play` cannot open the studio.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-09-23-016  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: New later EOP file after 20260901 for any new spell persist maps  
CATEGORY: eop-migrations  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: `mops.toml` chain is `src/backend/migrations` with `check-limit = 5`. Frozen tail is `20260901_000000` (GameKey, `OldActor = {}`). `.old/src/backend/dist/backend.most` is Caffeine’s 2026-08-31 import (no GameKey). New `ownedSpellIds` / `observedSpellIds` / `lifecycle` / acquisition / `spellRewardIds` / `spellRevisions` / complete `SummonUnitDef` / `targetType` are new stables. AGENTS.md: never amend a shipped `NewActor`, never add a stable to a file at or before the deployed tail, never blank `.old`.  
SYSTEMS_AFFECTED: `src/backend/migrations/YYYYMMDD_HHMMSS.mo` after `20260901`; `mops.toml` `check-limit`; `check-eop-stables.py`; Caffeine import  
RECOMMENDED_ACTION: For **any** of 001–005 / 009–014 that adds a persistent `let`/`var`, add a **new later** chain file with `OldActor = {}` and empty-map / zero defaults. Bump `check-limit` to the chain length. Run `python3 scripts/check-eop-stables.py` and `bash scripts/caffeine-import-gate.sh backend`. Do not edit `20260831` / `20260901`. Do not `dfx deploy` `backend_extended/`.  
AUTONOMY: HUMAN_APPROVE — live actor upgrade class.  
DEPENDENCIES: every persist ID in this file  
REGRESSION_RISK: HIGH — wrong position → M0263 at Caffeine import or `Memory-incompatible program upgrade` (IC0503) at runtime.  
VALIDATION_REQUIRED: `mops check` vs `.old` and every `snapshots/deployed/*.most` passes; `unsupported/` still fails; PocketIC matrix when `pocket-ic` is installed.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-09-23-017  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Union #341 delete-block; do not freeze usableByPlayer as retire copy  
CATEGORY: stack-compat  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Open [#341](https://github.com/Mr-Melic/stralt/pull/341) adds `BUILT_IN_SPELL_DELETE_BLOCKED = "Cannot delete a built-in spell; set usableByPlayer=false to retire it"` and `adminSpellDeleteBlockedReason` on `adminSafety.ts`, and wires the client delete mutation. That string is the live Motoko error (`main.mo` 887). Hiding × for the six `BUILT_IN_SPELL_IDS` is correct. Copying the wrong-field retire instruction into the official client is not. Overlaps `adminSafety.ts` / `useSpellQueries.ts` / `AdminDashboard.tsx` with this studio and with #413 / #334 / #415 / #457.  
SYSTEMS_AFFECTED: `adminSafety.ts`; `useSpellQueries.ts`; Admin spell list  
RECOMMENDED_ACTION: If #341 has landed, keep the built-in delete block. Change the string to mention `lifecycle=retired` (or “Retire”) once 001 exists — do not ship “set usableByPlayer=false” as owner UX. One `export function adminSpellDeleteBlockedReason`. Do not concatenate a second copy.  
AUTONOMY: IMPLEMENT_AFTER_HUMAN — restack only.  
DEPENDENCIES: SDA-2026-09-23-001; PR #341  
REGRESSION_RISK: MEDIUM — dropping the block re-allows built-in hard delete; keeping the string freezes the wrong field.  
VALIDATION_REQUIRED: `adminDeleteSpellConfig("void_collapse")` still `#err`s. Custom draft still deletes. Duplicate-export scan clean.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-09-23-018  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Wave-4 unique ids stay unowned until their acquisition route  
CATEGORY: catalog-sync  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: `spellData.ts` unique ids (`spell-swap`, `spell-mirror`, `spell-timestep`, summons, …) are forced `isBaseSpell: true` and unioned into `ownedSpells` (WX 2395–2440). Open [#371](https://github.com/Mr-Melic/stralt/pull/371) / [#342](https://github.com/Mr-Melic/stralt/pull/342) add more Wave-4 unique ids as **docs**. If 003 seeds from the full `starterSpells` array, those ids become innate. 08-31 `SYSTEM_ONLY` is Strike plus a small innate set, not the unique catalog.  
SYSTEMS_AFFECTED: create-character seed; `ownedSpellIds` migration; Wave-4 catalog  
RECOMMENDED_ACTION: Innate seed is the four ids in 003. Unique / summon / mechanic ids wait for 009 routes (`ENEMY_DISCOVERY` default unless the Wave-4 doc names another). Do not pre-own them because they live in `spellData.ts`. Do not implement Wave-4 cards in this studio PR.  
AUTONOMY: HUMAN_APPROVE — with 003.  
DEPENDENCIES: SDA-2026-09-23-003; SDA-2026-09-23-009; PRs #371 / #342  
REGRESSION_RISK: HIGH if uniques are in the migrate-from-`starterSpells` set.  
VALIDATION_REQUIRED: New character does not own `spell-swap` / `summon-dire-wolf`. After observe→win (or the Wave-4 named route) the id is owned once.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-09-23-019  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Canister-array level hydrate is not the owned set  
CATEGORY: ownership-persist  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Open [#388](https://github.com/Mr-Melic/stralt/pull/388) hydrates spell levels from canister arrays only (closes localStorage mint). Create still writes **empty** `spellLevelKeys`. `_spellReferencedByPlayers` / `setSpellBarOrder` / `upgradeSpell`’s `found` flag all treat empty keys as “not owned.” That is correct for paid uniques and **incorrect** for never-upgraded innate ids. Appearance already cannot mint levels (`resolveAppearanceSpellLevels` `adminSafety.ts` 686–698).  
SYSTEMS_AFFECTED: `spellLevelHydrate.ts` (#388); `ownedSpellIds` migration; `setSpellBarOrder`; `upgradeSpell`  
RECOMMENDED_ACTION: If #388 has landed, keep array-only hydrate. Do not interpret empty keys as “this character owns nothing.” Seed/migrate per 003. `upgradeSpell` already-owned must include the innate set, not only keys. Honour 022’s empty-keys bar helper without adopting its 32-id allowlist.  
AUTONOMY: IMPLEMENT_AFTER_HUMAN — restack with 003 / 014.  
DEPENDENCIES: SDA-2026-09-23-003; SDA-2026-09-23-014; PR #388; SDA-2026-09-23-022  
REGRESSION_RISK: MEDIUM — treating empty keys as empty ownership strips the bar; treating them as full-catalog ownership re-grants uniques.  
VALIDATION_REQUIRED: New character with empty keys still casts Strike. Hydrate does not copy localStorage levels. Unique id absent from keys is not owned.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-09-23-020  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Do not re-implement #384 effectParams JSON; remaining clamp list  
CATEGORY: lifecycle-tooling  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Open [#384](https://github.com/Mr-Melic/stralt/pull/384) / [#374](https://github.com/Mr-Melic/stralt/pull/374) add JSON well-formedness for admin blobs including spell `effectParams`. Live client `validateSpellConfig` (`adminSafety.ts` 578–660) still omits Motoko caps on mp/cooldown/damage/heal/minLevel/hitTiles/`effectParams` length (`adminGuard.mo` 383–418). Activate-gate 006 still needs AP 0 + `targetType`. Overlap file is `adminSafety.ts`.  
SYSTEMS_AFFECTED: `adminSafety.ts`; `adminGuard.mo`; Spell Save  
RECOMMENDED_ACTION: If #384 has landed, do not add a second `effectParams` parser. 006 must still add the missing numeric caps, AP 0 exception, and `targetType`. One `export function validateSpellConfig`.  
AUTONOMY: IMPLEMENT_AFTER_HUMAN — restack only.  
DEPENDENCIES: SDA-2026-09-23-006; PRs #374 / #384  
REGRESSION_RISK: MEDIUM — duplicate validators diverge; skipping 006 leaves AP 0 illegal.  
VALIDATION_REQUIRED: Malformed `effectParams` rejected once. `isTimestep` + AP 0 accepted after 006. Duplicate-export scan clean.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-09-23-021  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Union #413 catalog chip; usableByPlayer=false is not Retired  
CATEGORY: stack-compat  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Open [#413](https://github.com/Mr-Melic/stralt/pull/413) adds `adminSpellCatalogStatus({ id, usableByPlayer })` that returns `"retired"` whenever `usableByPlayer === false`, and that label **wins** over `"built-in"`. Tests assert `void_collapse` + `usableByPlayer: false` → `"retired"` and a custom id with the same flag → `"retired"`. That freezes the 08-31-wrong-field retire into owner UX. `ENEMY_ONLY` / not-yet-player-castable rows would show Retired. Overlaps `adminSafety.ts` / `AdminDashboard.tsx` with #341 (017) and #334 / #415 / #457.  
SYSTEMS_AFFECTED: `adminSafety.ts` `adminSpellCatalogStatus`; Admin spell list chips  
RECOMMENDED_ACTION: If #413 has landed, keep a built-in / live chip. Drive `"retired"` off `lifecycle` (001), not the cast gate. One `export function adminSpellCatalogStatus`. Do not concatenate a second copy. Union 017’s delete-block string change.  
AUTONOMY: IMPLEMENT_AFTER_HUMAN — restack only.  
DEPENDENCIES: SDA-2026-09-23-001; SDA-2026-09-23-017; PR #413  
REGRESSION_RISK: HIGH if the chip stays on `usableByPlayer` after 001 lands — owners will retire enemy-only ids by accident.  
VALIDATION_REQUIRED: Built-in + `usableByPlayer=true` → built-in. `ENEMY_ONLY` active + `usableByPlayer=false` → not Retired. `lifecycle=retired` → Retired. Duplicate-export scan clean.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-09-23-022  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Union #400 bar-id helpers; do not seed ownership from all 32 frontend ids  
CATEGORY: stack-compat  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Open [#400](https://github.com/Mr-Melic/stralt/pull/400) adds `src/frontend/src/utils/spellCatalogEvolve.ts`. `OFFICIAL_STARTER_SPELL_IDS` is **every** `spellData.ts` id (Strike, six starters, uniques, summons — 32 ids). `filterSpellBarForPersist` with empty `spellLevelKeys` keeps that whole set (capped at 8). Comments correctly say empty keys ≠ “owns nothing” and that name-matching Inferno is a landmine. Using that 32-list as `ownedSpellIds` seed would re-grant Wave-4 uniques (018). Overlaps the 003 / 014 / 019 contracts.  
SYSTEMS_AFFECTED: `spellCatalogEvolve.ts` (#400); `setSpellBarOrder`; create-character seed  
RECOMMENDED_ACTION: If #400 has landed, keep `shouldHidePurgedCatalogRow` (id-only hide) and the empty-keys ≠ no-ownership rule. Do **not** call `officialStarterSpellIds()` as the 003 migrate/seed set. Innate four only. If `filterSpellBarForPersist` is wired, pass the innate four as `starterIds`, not the default 32. One implementation per helper name.  
AUTONOMY: IMPLEMENT_AFTER_HUMAN — restack with 003 / 014.  
DEPENDENCIES: SDA-2026-09-23-003; SDA-2026-09-23-014; SDA-2026-09-23-018; SDA-2026-09-23-019; PR #400  
REGRESSION_RISK: HIGH if the 32-list becomes the owned seed; MEDIUM if empty-keys bar persist is dropped and starters vanish again.  
VALIDATION_REQUIRED: New character bar may include Strike/Shield/Poison/Heal. `spell-swap` / `summon-dire-wolf` are absent until 009. `spell-inferno` is not hidden by the Inferno name. Duplicate-export scan clean.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-09-23-023  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: upgradeSpell must not grant unowned catalog ids; minLevel is not acquisition  
CATEGORY: ownership-persist  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: `upgradeSpell` (`main.mo` 1006–1014) looks up `spellConfigs`, rejects only `usableByPlayer=false` when `found=false`, then appends the id to `spellLevelKeys` on first paid upgrade. It never reads `minLevel` (`admin.mo` 119 documents that field as unlock). `void_collapse` is seeded at `minLevel = 30` (`admin.mo` 190) and is still grantable at level 1 by paying. Admin CatalogNote (3644) admits minLevel is not enforced at hydrate. Open [#466](https://github.com/Mr-Melic/stralt/pull/466) `spellDiscoveryEvolve.ts` locks `upgradeSpellWouldGrantUnownedCatalogId` and `upgradeSpellMinLevelRejected` as tests of this hole — those helpers are not wired to Motoko. Closing hydrate (003) without closing this path still lets any account buy any `usableByPlayer` catalog id.  
SYSTEMS_AFFECTED: `main.mo` `upgradeSpell`; `admin.mo` `minLevel` meaning; Spellbook upgrade CTA  
RECOMMENDED_ACTION: After 003, `upgradeSpell` requires the id already in `ownedSpellIds` (or the innate seed). First paid upgrade raises the level of an owned id; it does not append an unowned catalog id. `minLevel` stays a **cast/equip** gate after ownership (08-31 §4.3), grandfathering already-owned ids when an admin later raises it. Do not invent an `ACHIEVEMENT` / level-route from `minLevel`. Keep #466 tests as proof until Motoko matches; do not treat the helpers as the grant writer.  
AUTONOMY: HUMAN_APPROVE — changes who can obtain Admin spells.  
DEPENDENCIES: SDA-2026-09-23-003; SDA-2026-09-23-001; SDA-2026-09-23-009; PR #466  
REGRESSION_RISK: HIGH — if Motoko starts enforcing minLevel as unlock before 003, innate Strike at create (empty keys) could fail. If grant-on-pay remains after 003, catalog still leaks.  
VALIDATION_REQUIRED: Level-1 cannot `#ok` `upgradeSpell("void_collapse")` without ownership. Owned innate Strike still upgrades at level 1. Admin-added `usableByPlayer=true` id is not acquired by paying. Already-owned id still upgrades after minLevel is raised.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-09-23-024  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Union #460 unique feat conditions; uniqueness is not spellRewardIds  
CATEGORY: stack-compat  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Open [#460](https://github.com/Mr-Melic/stralt/pull/460) adds `achievementConditionTaken` so two **active** catalog rows cannot share a condition (`adminSafety.ts` + `adminGuard.mo` + `main.mo`). That closes a double-claim on combat-trusted feats. It does not add `spellRewardIds`, feat-graph edges, or `requiresAchievementIds`. Overlaps `adminSafety.ts` / `adminGuard.mo` / `main.mo` with 012 / 001 / #437.  
SYSTEMS_AFFECTED: `adminSafety.ts`; `adminGuard.mo`; Achievement Save  
RECOMMENDED_ACTION: If #460 has landed, keep unique active conditions. 012 still adds `spellRewardIds` on the 15-key whitelist. Inactive rows may keep a condition so a replacement feat can publish. One `export function achievementConditionTaken`. Do not infer a spell grant from a duplicate-condition error.  
AUTONOMY: IMPLEMENT_AFTER_HUMAN — restack with 012.  
DEPENDENCIES: SDA-2026-09-23-012; PR #460  
REGRESSION_RISK: MEDIUM — dropping uniqueness re-opens double-claim; treating uniqueness as “feats now grant spells” skips 012 persist.  
VALIDATION_REQUIRED: Second active row with `first_battle_win` rejected. Inactive copy may keep the condition. Feat with `spellRewardIds` still grants once after 012. Duplicate-export scan clean.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-09-23-025  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Union #437 freeze unclaimed Doka; freeze is not a spell grant  
CATEGORY: stack-compat  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Open [#437](https://github.com/Mr-Melic/stralt/pull/437) adds `achievementLiveRewardRejected` — cannot change `dokaReward` while unclaimed progress exists. That is the correct Doka freeze. It does not write spells. 012 grant must be similarly frozen: do not add/remove `spellRewardIds` on a feat with unclaimed progress (or make the grant idempotent on the owned set only). Overlaps `adminSafety.ts` / `adminGuard.mo` / `main.mo` with #460 / 012.  
SYSTEMS_AFFECTED: `adminSafety.ts`; Achievement Save; 012 spell grants  
RECOMMENDED_ACTION: If #437 has landed, keep the Doka freeze. When 012 lands, apply the same unclaimed-progress lock to `spellRewardIds` edits (or skip retired ids at claim time without mutating the catalog under a pending claim). One `export function achievementLiveRewardRejected`.  
AUTONOMY: IMPLEMENT_AFTER_HUMAN — restack with 012.  
DEPENDENCIES: SDA-2026-09-23-012; PR #437  
REGRESSION_RISK: MEDIUM — raising Doka under unclaimed progress re-opens the pay-new-amount hole; editing spell rewards under unclaimed progress could double-grant.  
VALIDATION_REQUIRED: Unclaimed feat rejects `dokaReward` change. After 012, unclaimed feat rejects `spellRewardIds` change (or claim stays idempotent). Duplicate-export scan clean.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-09-23-026  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Wave-5 / Wave-6 unique ids stay unowned until their acquisition route  
CATEGORY: catalog-sync  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Open [#411](https://github.com/Mr-Melic/stralt/pull/411) (Wave-5 tactical proposals) and [#463](https://github.com/Mr-Melic/stralt/pull/463) (Wave-6) are **docs only**, same class as #371 / #342 (018). If those ids are later copied into `spellData.ts` with `isBaseSpell: true`, hydrate (WX 2395–2440) and #400’s 32-list pattern will pre-own them.  
SYSTEMS_AFFECTED: create-character seed; `ownedSpellIds` migration; Wave-5/6 catalog  
RECOMMENDED_ACTION: Same rule as 018. Unique ids wait for 009 routes. Do not implement Wave-5/6 cards in this studio PR. When those docs name an explicit `ACHIEVEMENT` / `BOSS` / `ELITE` route, stamp it on the definition — never infer from the spell name.  
AUTONOMY: HUMAN_APPROVE — with 003 / 018.  
DEPENDENCIES: SDA-2026-09-23-003; SDA-2026-09-23-009; SDA-2026-09-23-018; PRs #411 / #463  
REGRESSION_RISK: HIGH if later seed/migrate copies every `spellData.ts` id.  
VALIDATION_REQUIRED: After a Wave-5/6 id exists in the catalog, a new character does not own it until the stamped route completes.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-09-23-027  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Restack-union AdminDashboard siblings; one SpellEditor extract  
CATEGORY: stack-compat  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: AdminDashboard (8 280 lines) is also edited by open [#334](https://github.com/Mr-Melic/stralt/pull/334) (tier default / catalog copy), [#341](https://github.com/Mr-Melic/stralt/pull/341) (built-in delete UX), [#413](https://github.com/Mr-Melic/stralt/pull/413) (retired labels / boss leave), [#415](https://github.com/Mr-Melic/stralt/pull/415) (Tiers leftover / feat copy), [#457](https://github.com/Mr-Melic/stralt/pull/457) (enemy names / ShopPackage leftover). 015 extracts SpellEditor. Concatenating two `export function` / two SpellEditor copies fails Caffeine `vite build` / esbuild. This docs PR must **not** touch the file.  
SYSTEMS_AFFECTED: `AdminDashboard.tsx`; `useSpellQueries.ts`; extracted SpellEditor  
RECOMMENDED_ACTION: When 015 is implemented, restack onto an oldest-first integration of those PRs. Union copy/chips/delete UX; keep **one** SpellEditor. Do not append another thousand lines. Do not grow WX. Run `bash scripts/open-pr-stack-compat.sh --self` and `python3 scripts/check-duplicate-exports.py src/frontend/src`.  
AUTONOMY: IMPLEMENT_AFTER_HUMAN — restack only.  
DEPENDENCIES: SDA-2026-09-23-015; PRs #334 / #341 / #413 / #415 / #457  
REGRESSION_RISK: HIGH — duplicate exports fail import; overwriting a sibling’s catalog copy re-lies about delete.  
VALIDATION_REQUIRED: Stack-compat clean vs `origin/main` and as next queue item. `pnpm check` + duplicate-export scan clean. Spell Save still goes through `useSpellQueries`.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-09-23-028  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: One boss-kit id list with #449; do not grow a fourth source  
CATEGORY: boss-kits  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Live combat already has three kit sources (011). Open [#449](https://github.com/Mr-Melic/stralt/pull/449) is the 2026-09-23 enemy/boss admin re-audit (docs: `ENEMY_BOSS_ADMIN_REAUDIT_2026-09-23.md`). A parallel owner surface that authors a fourth `spellPoolIds` list will drift from `bossKits.ts` the same way Motoko seeds already do (`admin.mo` 357–379).  
SYSTEMS_AFFECTED: `bossKits.ts`; Motoko `defaultBossConfigs`; Admin Bosses chips; enemy/boss admin studio  
RECOMMENDED_ACTION: When 011 lands, pick one canonical id list and point both studios at it. Do not implement kits twice. Ids only — no name matching. Coordinate with the enemy/boss admin designer’s 09-23 IDs rather than forking `ENEMY_KITS`.  
AUTONOMY: HUMAN_APPROVE — with 011.  
DEPENDENCIES: SDA-2026-09-23-011; SDA-2026-09-23-010; PR #449  
REGRESSION_RISK: MEDIUM — a fourth source makes Admin chips, Motoko seeds, and live combat three-way plus one.  
VALIDATION_REQUIRED: Admin chips, Motoko `spellPoolIds`, and `bossKits.ts` resolve the same live ids. Enemy/boss admin Save does not write a parallel kit map.  
STATUS: NEW  
