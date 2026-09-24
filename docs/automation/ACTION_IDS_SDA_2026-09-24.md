# ACTION_IDs — 2026-09-24 Spell, Discovery & Achievement Admin Designer

Durable ledger for implementers and the Report Action Orchestrator.  
Source of every record: Spell, Discovery & Achievement Admin Designer.  
Design contract: [`SPELL_ADMIN_DESIGN_2026-09-24.md`](./SPELL_ADMIN_DESIGN_2026-09-24.md) (this delta) + [`SPELL_ADMIN_DESIGN_2026-08-31.md`](./SPELL_ADMIN_DESIGN_2026-08-31.md) (full studio).

**First-cuts live on unmerged [#473](https://github.com/Mr-Melic/stralt/pull/473):** `SDA-2026-09-23-001` … `028`. Treat those as the current 001–028. **Do not implement a second 09-24 copy.** 09-21 IDs live on [#353](https://github.com/Mr-Melic/stralt/pull/353); 09-22 IDs live on [#398](https://github.com/Mr-Melic/stralt/pull/398). Prior IDs `SDA-2026-08-31-001` … `013`, `SDA-2026-09-01-001` … `014`, and `SDA-2026-09-02-001` … `015` remain OPEN, PARTIAL, or LANDED as tabulated in the 09-23 design §9 — do not close them from this file except 09-01-002 (bindgen) and the empty-AI half of 09-02-006, which **landed**.

This run only adds **029–040** (queue after #473, plus the WDD attune hole 09-23 missed on the same HEAD). Do not implement gameplay from this file unless a later human or orchestrator explicitly picks an ID. This run ships **docs only**.

HEAD: `0f5363f` (unchanged since 09-23).

Older still-open PRs (union, do not overwrite): **#327** then **#331**, then #333+. SDA-relevant additions since #473: **#470** (`adminOwnerUx.ts` / AdminDashboard — missed by 09-23-027), **#474** (Wave-7 boss sheets), **#480** (Wave-6 SDE), **#485** (feat toast copy), **#486** (`summonSpawn.ts`), **#488** / **#493** / **#499** (`saveBattleStats` skip), **#490** (II-principal feat counters), **#491** (challenge Doka recap), **#496** (`playerSpecialCast.ts`), **#498** (`bossKitSpell.ts`), **#503** (WDD wave-7), **#506** (AI evolution docs), **#507** (enemy/boss admin re-audit 09-24), **#512** (range/`hitTiles` caps). Keep one `export function` per name.

---

ACTION_ID: SDA-2026-09-24-029  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Fence WDD attune/loan from ownedSpellIds; pool is PLAYER_LEARNABLE  
CATEGORY: ownership-persist  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Already on `origin/main` @ `0f5363f`, 09-23 did not record them: `WF-SPL-RUNE_BEARER` (`src/frontend/src/engine/worldFeatures.ts` 511–539) attunes one extra spell from `SpellConfig` rows with `usableByEnemy === true` for the rest of the map; `WF-SPL-GRIMOIRE_STALKER` (1071–1089) grants a single remaining cast; `WF-SPL-LOANER_MAGE` (1550–1568) loans the same one-cast for 1 AP. Catalog text correctly forbids `upgradeSpell` and `spellLevel` writes. It still keys the pool off `usableByEnemy` only (`spellSource: "enemyUsableCatalog"` at 538). That set includes `ENEMY_ONLY` / `BOSS_ONLY` / unpublished Admin drafts / every `usableByPlayer=true` backend row that hydrate already grants (`WorldExploration.tsx` 2395–2440). Open [#503](https://github.com/Mr-Melic/stralt/pull/503) unions wave-7 onto the same file (steal-and-disarm page thief, no-paid-AP-spell event). Open [#400](https://github.com/Mr-Melic/stralt/pull/400) `OFFICIAL_STARTER_SPELL_IDS` is the 32-id frontend catalog. If attune is later written into `ownedSpellIds` or `spellLevelKeys`, every Rune Bearer kill becomes a permanent grant.  
SYSTEMS_AFFECTED: `worldFeatures.ts` spell-bearing overlays; future attune runtime; `ownedSpellIds` / observe writers; Admin acquisition flags  
RECOMMENDED_ACTION: When WDD overlays are wired, keep map-scoped attune/loan/one-cast as a combat buff that dies on portal/reload/death. Never call `recordSpellObservation`, `commitSpellDiscoveries`, `unlockOwnedSpell`, `upgradeSpell`, or `updateCharacter`. Pool = `PLAYER_LEARNABLE && usableByEnemy && lifecycle=active` (ids only) once 09-23-001/003/009 exist; until then, hard-id allowlists — not `usableByEnemy === true` and not the 32-id starter list. Do not mint a catalog id from the feature name. Extract helpers; do not grow WX. Coordinate with WDD-2026-09-24-001; do not fork `WORLD_FEATURES`.  
AUTONOMY: HUMAN_APPROVE — touches grant identity if wired wrong.  
DEPENDENCIES: SDA-2026-09-23-003; SDA-2026-09-23-009; SDA-2026-09-23-001; SDA-2026-09-23-022; PRs #454 / #503 / #400  
REGRESSION_RISK: HIGH if attune appends `spellLevelKeys` or if the pool includes `ENEMY_ONLY` / `void_collapse`. LOW while overlays stay unwired.  
VALIDATION_REQUIRED: Killing a Rune Bearer does not change `ownedSpellIds` after reload. `ENEMY_ONLY` id never appears in the attune picker. Observe→win on a later encounter can still unlock the same learnable id once. Feature name “Rune Bearer” is not a spell id. Duplicate-export scan clean.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-09-24-030  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Wave-7 boss unique ids stay unowned; do not grow a fifth kit source  
CATEGORY: catalog-sync  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Open [#474](https://github.com/Mr-Melic/stralt/pull/474) appends Wave-7 boss sheets to `docs/design/BOSS_AND_SPELL_DISCOVERY.md` (doors `mill_seneschal` … `levy_rector`). Live combat already has three kit sources (09-23-011): `data/bossKits.ts`, Motoko `defaultBossConfigs()` still listing purged ids (`admin.mo` 357–379), Admin chips `getSpellConfigs()` (`AdminDashboard.tsx` 7590–7730). 09-23-028 already forbids a fourth list with #449. A Wave-7 sheet that authors another `spellPoolIds` array, or that copies unique ids into `starterSpells` with `isBaseSpell: true`, pre-owns them via WX 2395–2440.  
SYSTEMS_AFFECTED: `bossKits.ts`; Motoko `defaultBossConfigs`; Admin Bosses chips; Wave-7 boss unique ids  
RECOMMENDED_ACTION: Unique ids on #474 wait for the named `BOSS` / `BOSS_ONLY` route (09-23-009). `BOSS_ONLY` never enters `ownedSpellIds`. When 09-23-011 lands, point the Wave-7 sheets at the same canonical id list as `bossKits.ts`. Ids only — no name matching. Do not implement boss cards in this studio PR.  
AUTONOMY: HUMAN_APPROVE — with 09-23-011 / 028.  
DEPENDENCIES: SDA-2026-09-23-011; SDA-2026-09-23-028; SDA-2026-09-23-009; SDA-2026-09-23-018; SDA-2026-09-24-039; PR #474  
REGRESSION_RISK: HIGH if Wave-7 ids are seeded into `spellData.ts` as `isBaseSpell`. MEDIUM if a fifth kit list drifts from live combat.  
VALIDATION_REQUIRED: After a Wave-7 unique id exists in the catalog, a new character does not own it until the stamped boss victory (or never, if `BOSS_ONLY`). Admin chips, Motoko pools, and `bossKits.ts` still resolve one live id set.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-09-24-031  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Honour #480 Wave-6 SDE stamps; do not pre-own generationMin 6 ids  
CATEGORY: catalog-sync  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Open [#480](https://github.com/Mr-Melic/stralt/pull/480) is Wave-6 discovery (`SPELL_DISCOVERY_ECOSYSTEM_2026-09-23.md`, `generationMin: 6`). It stamps #411 / #463 tactical ids onto families and unused doors; unique Wave-6 SDE ids are new. 09-23-026 already said Wave-5/6 uniques stay unowned; #480 is the actual stamp table. Wave-1 P0 (`ownedSpellIds`, observe, commit) is still NEW. Copying Wave-6 ids into `starterSpells` or #400’s 32-list would make discovery worse.  
SYSTEMS_AFFECTED: create-character seed; `ownedSpellIds` migration; Wave-6 catalog; family pools  
RECOMMENDED_ACTION: Same rule as 09-23-018 / 026. Honour #480 stamps (`ENEMY_DISCOVERY` default, named `ACHIEVEMENT` / `BOSS` / `MULTI_SOURCE` children). Do not restamp Wave-1…5 doors. Do not implement Wave-6 cards in this studio PR. Innate seed remains the four ids in 09-23-003.  
AUTONOMY: HUMAN_APPROVE — with 09-23-003 / 009.  
DEPENDENCIES: SDA-2026-09-23-003; SDA-2026-09-23-009; SDA-2026-09-23-026; PR #480  
REGRESSION_RISK: HIGH if migrate-from-`starterSpells` includes Wave-6 ids.  
VALIDATION_REQUIRED: After a Wave-6 unique id exists in the catalog, a new character does not own it until the stamped route completes. Duplicate door stamps do not grant twice.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-09-24-032  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Union #498 bossKitSpell; aim helper is not a kit catalog  
CATEGORY: stack-compat  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Open [#498](https://github.com/Mr-Melic/stralt/pull/498) adds `src/frontend/src/engine/bossKitSpell.ts` (+ test) and a 9-line WX call so boss kit-spell aim stays off the boss tile. That is an extracted targeting helper over the **existing** live kit (`data/bossKits.ts`). 09-23-011 / 028 already forbid a fourth `spellPoolIds` source. A later studio that stores kits on `bossKitSpell.ts` would fork combat from Admin chips and Motoko seeds. Overlaps WX with #327 / #331 / later combat PRs.  
SYSTEMS_AFFECTED: `bossKitSpell.ts`; `WorldExploration.tsx` call site; `bossKits.ts`  
RECOMMENDED_ACTION: If #498 has landed, keep one aim helper. Do not add a spell-id table there. 09-23-011 still picks one canonical id list. Extract further WX kit resolve into a helper next to this file rather than growing WX. One `export function` per name.  
AUTONOMY: IMPLEMENT_AFTER_HUMAN — restack only.  
DEPENDENCIES: SDA-2026-09-23-011; SDA-2026-09-23-028; PR #498  
REGRESSION_RISK: MEDIUM — treating the new file as a kit catalog recreates the Motoko vs `bossKits.ts` split.  
VALIDATION_REQUIRED: Boss kit aim still refuses the boss’s own tile. Admin chips still resolve `bossKits.ts` ids. Duplicate-export scan clean.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-09-24-033  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Union #496 Timestep/Mirror self-tile; persist mechanic flags  
CATEGORY: spell-contract  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Open [#496](https://github.com/Mr-Melic/stralt/pull/496) extracts `playerSpecialCast.ts` so Timestep and Mirror resolve on the highlighted self tile (`spellEngine.ts` + parity tests). Live combat therefore **requires** `isTimestep` / `isMirror` metadata. Motoko `SpellConfig` (`admin.mo` 92–127) and bindgen still omit those flags. `newSpell()` sets them (`AdminDashboard.tsx` 124–126) and the editor exposes `isTimestep` (3434) but CatalogNote admits they drop on reload (3641–3644). Save rejects AP `< 1` (`adminSafety.ts` 604–606; `adminGuard.mo` 380–382), so a persisted Timestep cannot be AP 0. 09-23-005 already asked to persist `targetType` (including `chain`) and mechanic flags; #496 makes that a live combat dependency, not a studio nice-to-have.  
SYSTEMS_AFFECTED: `admin.mo` SpellConfig; bindgen; SpellEditor; `playerSpecialCast.ts`; `spellEngine.ts`  
RECOMMENDED_ACTION: Persist 09-23-005 (`targetType`, `isSwap` / `isMirror` / `isTimestep` / `isSacrifice` / `isBarrier` / `isTrap` / `isMark`, statuses, area) in the same Motoko + bindgen + editor slice. AP 0 legal only with `isTimestep` or explicit `allowZeroAp` (09-23-006). If #496 has landed, keep one `playerSpecialCast` extract. Never key Timestep/Mirror off `spell.name`. New fields need 09-23-016.  
AUTONOMY: HUMAN_APPROVE — Candid shape.  
DEPENDENCIES: SDA-2026-09-23-005; SDA-2026-09-23-006; SDA-2026-09-23-016; PR #496  
REGRESSION_RISK: HIGH — default `targetType=enemy` on Mirror/Timestep would break self resolve. A lagging actor rejects new-field saves.  
VALIDATION_REQUIRED: Save Timestep with `targetType=self`, `isTimestep=true`, AP 0; refetch matches; highlighted-self cast still resolves. Save Mirror the same way. Rename the spell; combat still uses flags. `pnpm typecheck` + `mops check`.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-09-24-034  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Union #486 summon dump occupancy; one spawnSummonUnit  
CATEGORY: stack-compat  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Open [#486](https://github.com/Mr-Melic/stralt/pull/486) edits `src/frontend/src/engine/summonSpawn.ts` so corpse/summon dumps stay on the fight graph. That is the same function that still does `spell.summonAI || "hunter"` (139) and `spell.name.replace("Summon ", "")` (165). 09-23-002 requires dropping both. Concatenating a second `spawnSummonUnit` or a second name fallback fails esbuild.  
SYSTEMS_AFFECTED: `summonSpawn.ts`; `enemyAI.ts` `inferSummonArchetype`; SpellEditor summon `displayName`  
RECOMMENDED_ACTION: If #486 has landed, keep the occupancy fix. 09-23-002 still adds persist `displayName` / `summonKit` / AP/MP and removes the hunter default. One `export function spawnSummonUnit`. Do not add `includes(spell.name)` branches while touching the file.  
AUTONOMY: IMPLEMENT_AFTER_HUMAN — restack with 09-23-002.  
DEPENDENCIES: SDA-2026-09-23-002; SDA-2026-09-23-008; PR #486  
REGRESSION_RISK: MEDIUM — dropping occupancy while adding `displayName` reseals corridors; keeping hunter after 002 silently rewrites empty AI.  
VALIDATION_REQUIRED: Dump cell still on the fight graph. Summon with `summonAI=healer` and name “Orb” still heals. Empty AI fails activate. Duplicate-export scan clean.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-09-24-035  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Single recap; honour feat toast and challenge Doka without a second unlock surface  
CATEGORY: discovery-pipeline  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: `BattleRecapData` (`PostBattleRecap.tsx` 6–34) still has XP/Doka/feats only; `attachRecapUnlocks` is achievements. Open [#485](https://github.com/Mr-Melic/stralt/pull/485) changes world toast copy to “Feat Unlocked” (`AchievementToast.tsx`). Open [#491](https://github.com/Mr-Melic/stralt/pull/491) puts challenge Doka on the immediate victory recap (`WorldExploration.tsx` / `rewardResolver.ts`). Wave-1 SDE requires `TECHNIQUE OBSERVED` (existing toast family) and `NEW SPELL DISCOVERED` on the **same** root recap. A second recap or a feat-styled spell toast would fork the atomic funnel (`AGENTS.md` recap rule).  
SYSTEMS_AFFECTED: `PostBattleRecap.tsx` `BattleRecapData`; observe toast; `rewardResolver` types only  
RECOMMENDED_ACTION: When 09-23-009 lands, extend the existing recap object with `discoveredSpells` (name, role, AP, range, target type, key effect, source enemy). Keep #485 feat copy on feats. Keep #491 challenge Doka on the same recap. Do not open a second popup. `ENEMY_ONLY` / `BOSS_ONLY` optional dim log only. Extract helpers; do not grow WX.  
AUTONOMY: HUMAN_APPROVE — with 09-23-009.  
DEPENDENCIES: SDA-2026-09-23-009; SDA-2026-09-23-003; PRs #485 / #491  
REGRESSION_RISK: MEDIUM — a Feat Unlocked-styled spell toast double-signals; a second recap drops challenge Doka or spell cards.  
VALIDATION_REQUIRED: Victory with a new feat, challenge Doka, and a discovered spell shows one recap containing all three. Observe toast is not “Feat Unlocked”. Defeat observes without unlocking. Duplicate victory empty grant.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-09-24-036  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Observation persist is II principal plus slot on the persist lock  
CATEGORY: ownership-persist  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Open [#490](https://github.com/Mr-Melic/stralt/pull/490) keys BuffShop and feat counters by II principal (WX). `getPlayerAchievements` already requires `identity.getPrincipal()` (`main.mo` 2418–2425). Wave-1 writers are `recordSpellObservation` / `commitSpellDiscoveries` / `unlockOwnedSpell` on `createProgressPersist`. Open [#488](https://github.com/Mr-Melic/stralt/pull/488) / [#493](https://github.com/Mr-Melic/stralt/pull/493) / [#499](https://github.com/Mr-Melic/stralt/pull/499) skip `saveBattleStats` after unseeded feat / one-shot / victory keep so an absolute write cannot wipe a credit. Discovery grants must not ride those skip paths and must not use `saveBattleStats` (never mints; ignores spell-level arrays). Display name is not a persist key.  
SYSTEMS_AFFECTED: future observation maps; persist lock; character slot 1–3; `saveBattleStats` callers  
RECOMMENDED_ACTION: Key observed/owned maps `(principal, slot, spellId)` like achievement progress. Enqueue on `createProgressPersist`; `commit` after the canister write. Do not call `updateCharacter`, `upgradeSpell`, or `saveBattleStats` to grant. Death 20/40 does not strip owned/observed. `localStorage` is cache only. Honour #488/#493/#499 skip helpers for wallet writes; do not add a parallel skip for spell grants.  
AUTONOMY: HUMAN_APPROVE — persist-lock and character-record shape.  
DEPENDENCIES: SDA-2026-09-23-003; SDA-2026-09-23-009; SDA-2026-09-23-016; PRs #490 / #488 / #493 / #499  
REGRESSION_RISK: HIGH if observation is keyed by display name or a single principal-wide set that leaks across slots. HIGH if a grant is folded into `saveBattleStats`.  
VALIDATION_REQUIRED: Slot 2 observe does not unlock slot 1. Same principal, other account does not see the id. Unseeded victory keep still does not wipe a committed discovery. Duplicate victory empty grant.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-09-24-037  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Union #470 adminOwnerUx; one SpellEditor extract  
CATEGORY: stack-compat  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Open [#470](https://github.com/Mr-Melic/stralt/pull/470) (`createdAt` 2026-09-23T00:20:08Z, four minutes before #473) adds `src/frontend/src/utils/adminOwnerUx.ts` and edits `AdminDashboard.tsx` / `adminSafety.ts` / `useSpellQueries.ts` to confirm live name-pool and Boss Rush publishes. 09-23-027 listed #334 / #341 / #413 / #415 / #457 and **missed #470**. Concatenating two SpellEditor copies or two `export function` owner-UX helpers fails Caffeine `vite build`. This docs PR must **not** touch those files.  
SYSTEMS_AFFECTED: `AdminDashboard.tsx`; `adminOwnerUx.ts`; `adminSafety.ts`; `useSpellQueries.ts`; extracted SpellEditor  
RECOMMENDED_ACTION: When 09-23-015 is implemented, restack onto an oldest-first integration that **includes #470**. Keep one `adminOwnerUx` helper module. Keep **one** SpellEditor. Do not treat owner-UX confirm copy as lifecycle (09-23-001 still owns Retire vs Delete). Run `bash scripts/open-pr-stack-compat.sh --self` and `python3 scripts/check-duplicate-exports.py src/frontend/src`.  
AUTONOMY: IMPLEMENT_AFTER_HUMAN — restack only.  
DEPENDENCIES: SDA-2026-09-23-015; SDA-2026-09-23-027; PR #470  
REGRESSION_RISK: HIGH — duplicate exports fail import; overwriting #470’s confirm copy re-lies about live publishes.  
VALIDATION_REQUIRED: Stack-compat clean vs `origin/main` and as next queue item. Name-pool / Boss Rush confirms still fire. Spell Save still goes through `useSpellQueries`. Duplicate-export scan clean.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-09-24-038  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Wave-7 WDD overlays are not SYSTEM_ONLY grants  
CATEGORY: catalog-sync  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Open [#503](https://github.com/Mr-Melic/stralt/pull/503) wave-7 catalog (WDD-2026-09-24-001) adds 16 feature ids on `worldFeatures.ts` / `WORLD_DYNAMICS.md`, including steal-and-disarm page thief, standing non-linear +1 range, and a no-paid-AP-spell event. Those are overlays, not `SpellConfig` rows. If an implementer adds `spell-page-thief` / `spell-ash-gate` inferred from the feature **name**, that violates the no-heuristics rule and 09-23-003 ownership. Wave-7 “no-paid-AP-spell” is also not Timestep and must not set `isTimestep` by name.  
SYSTEMS_AFFECTED: `worldFeatures.ts` wave-7 ids; future overlay runtime; spell catalog  
RECOMMENDED_ACTION: Do not add catalog spell ids for WDD feature names. Range / AP-tax overlays read explicit feature metadata, never `spell.name`. If a wave-7 overlay needs a learnable spell, stamp an existing id with 09-23-009 flags in a data PR — do not invent a `SYSTEM_ONLY` grant. Coordinate with 029 for any new spell-bearing enemy.  
AUTONOMY: HUMAN_APPROVE — with WDD implementers.  
DEPENDENCIES: SDA-2026-09-24-029; SDA-2026-09-23-008; SDA-2026-09-23-009; PR #503  
REGRESSION_RISK: MEDIUM — a name-derived spell id collides with SDE / tactical tombstones; treating no-paid-AP as Timestep breaks AP 0 activate.  
VALIDATION_REQUIRED: Wave-7 feature ids exist only in `WORLD_FEATURES`. No `spell-*` id equals a `WF-*` slug. Overlay does not write `ownedSpellIds`.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-09-24-039  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: One boss-kit id list with #507; do not grow a fifth source  
CATEGORY: boss-kits  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Open [#507](https://github.com/Mr-Melic/stralt/pull/507) is the 2026-09-24 enemy/boss admin re-audit (`ENEMY_BOSS_ADMIN_REAUDIT_2026-09-24.md`). 09-23-028 already forbade a fourth kit list with #449. #498 extracts aim into `bossKitSpell.ts` (032). #474 adds Wave-7 boss unique ids (030). A parallel owner surface that authors another `spellPoolIds` map will drift from `bossKits.ts` the same way Motoko seeds already do (`admin.mo` 357–379).  
SYSTEMS_AFFECTED: `bossKits.ts`; Motoko `defaultBossConfigs`; Admin Bosses chips; enemy/boss admin studio  
RECOMMENDED_ACTION: When 09-23-011 lands, pick one canonical id list and point the 09-23 and 09-24 enemy/boss admin studios at it. Do not implement kits twice. Ids only — no name matching. Coordinate with 030 / 032 rather than forking `ENEMY_KITS`.  
AUTONOMY: HUMAN_APPROVE — with 09-23-011.  
DEPENDENCIES: SDA-2026-09-23-011; SDA-2026-09-23-028; SDA-2026-09-24-030; SDA-2026-09-24-032; PR #507  
REGRESSION_RISK: MEDIUM — a fifth source makes Admin chips, Motoko seeds, live `bossKits.ts`, `bossKitSpell.ts`, and enemy-admin Save five-way.  
VALIDATION_REQUIRED: Admin chips, Motoko `spellPoolIds`, and `bossKits.ts` resolve the same live ids. Enemy/boss admin Save does not write a parallel kit map.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-09-24-040  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Union #512 range/hitTiles caps; remaining activate-gate is AP 0 plus targetType  
CATEGORY: lifecycle-tooling  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Open [#512](https://github.com/Mr-Melic/stralt/pull/512) adds `src/frontend/src/utils/adminSafety.spellTargeting.ts` (+ test) and Motoko caps so spell range and `hitTiles` offsets cannot be unbounded (`adminGuard.mo` / `main.mo`). Live client `validateSpellConfig` (`adminSafety.ts` 578–660) still omits AP 0 (`604–606`) and has no `targetType`. 09-23-006 / 020 already asked for the remaining clamp list after #384 `effectParams` JSON. Overlap files: `adminSafety.ts` / `adminGuard.mo`. Concatenating a second targeting validator fails esbuild.  
SYSTEMS_AFFECTED: `adminSafety.spellTargeting.ts`; `adminSafety.ts` `validateSpellConfig`; `adminGuard.mo`; Spell Save  
RECOMMENDED_ACTION: If #512 has landed, keep one spell-targeting helper. Do not add a second range/`hitTiles` parser. 09-23-006 must still add AP 0 (`isTimestep` / `allowZeroAp`), required `targetType`, and the remaining Motoko caps not covered by #512. One `export function validateSpellConfig` (or a single composed helper).  
AUTONOMY: IMPLEMENT_AFTER_HUMAN — restack only.  
DEPENDENCIES: SDA-2026-09-23-006; SDA-2026-09-23-020; SDA-2026-09-24-033; PR #512  
REGRESSION_RISK: MEDIUM — duplicate validators diverge; skipping 006 leaves Timestep AP 0 illegal after #496.  
VALIDATION_REQUIRED: Out-of-range `hitTiles` rejected once. `isTimestep` + AP 0 accepted after 006. Duplicate-export scan clean.  
STATUS: NEW  
