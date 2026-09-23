# Spell, Discovery & Achievement Admin Design — 2026-09-23 re-audit

**Author:** Spell, Discovery & Achievement Admin Designer  
**Automation:** `4efa22ec-a498-11f1-a7d1-d6b4613131ce`  
**Date:** 2026-09-23  
**HEAD audited:** `0f5363f` (`Merge pull request #332`)  
**Scope:** Owner tooling for the complete spell ecosystem. **No production code in this PR.**

This is a **delta** on [`SPELL_ADMIN_DESIGN_2026-08-31.md`](./SPELL_ADMIN_DESIGN_2026-08-31.md) (#116). Sections 2–11 of that document remain the contract (canonical `SpellDefinition`, acquisition routes, observe→win→unlock, CORE–SIGNATURE pools, dependency views, soft-retire + already-owned legacy, studio tabs, persist sketch). This run does **not** replace that contract.

09-21 lives on unmerged [#353](https://github.com/Mr-Melic/stralt/pull/353) (`SPELL_ADMIN_DESIGN_2026-09-21.md`). 09-22 lives on unmerged [#398](https://github.com/Mr-Melic/stralt/pull/398) (`SPELL_ADMIN_DESIGN_2026-09-22.md`). **Do not overwrite those files.** Treat **09-23-00N as the same first-cut as 09-22-00N** (and 09-21-00N) — do not implement both.

ACTION_IDs: [`ACTION_IDS_SDA_2026-09-23.md`](./ACTION_IDS_SDA_2026-09-23.md) (`SDA-2026-09-23-001` … `028`).

Do not implement those IDs unless a human or orchestrator picks one. Do not grow `WorldExploration.tsx` (19 213 lines). Do not grow `AdminDashboard.tsx` (8 280 lines) until activate exists on the canister. Never introduce spell-name heuristics.

---

## 1. Why this run exists

Live Motoko / client / catalog at `0f5363f` is **unchanged** since 09-21 / 09-22. Lifecycle is still `usableByPlayer=false`. Catalog hydrate still grants. Observation still does not persist.

What changed is the **oldest-first queue after #398**. Sibling PRs are about to freeze the wrong field into UI copy, freeze the 32-id frontend array as a “starter” allowlist, and freeze `upgradeSpell` as a paid grant writer. Those are new hazards on the same HEAD. This run records them so an implementer does not union them as the studio.

The 08-31 contract is still the destination. The 09-23 IDs are the current first cuts. Do not extend the `usableByPlayer=false` retire path. Do not treat `#400` `OFFICIAL_STARTER_SPELL_IDS` (all 32 frontend ids) as `ownedSpellIds`. Do not treat `#466` `upgradeSpellWouldGrantUnownedCatalogId` as a feature to keep.

---

## 2. Current state (verified against `origin/main` @ `0f5363f`)

### 2.1 Landed since 09-01 (do not rediscover)

| Change | Where | What it actually does |
| :--- | :--- | :--- |
| Bindgen `SpellConfig` includes summon + cooldown | `src/frontend/src/backend.ts` 118–152 | `isSummon`, `summonAI`, `summonLifespan`, `summonUnitDef`, `cooldown`. 09-01-002 **LANDED**. |
| Adapters send the summon block | `adminContract.ts` `toBackendSpellConfig` | Empty unit def matches the 20260831 migration. Still **no** `targetType`, `displayName`, `summonKit`, acquisition. |
| Client + Motoko reject empty `summonAI` when `isSummon` | `adminSafety.ts` `validateSpellConfig` 578–660; `adminGuard.mo` 423–426 | Empty-AI half of 09-02-006 **LANDED**. Runtime still does `spell.summonAI \|\| "hunter"` (`summonSpawn.ts` 139). |
| Validators accept `spellType="summon"` | `adminGuard.mo` 348–350; `adminSafety.ts` 18, 610–620 | Editor `<select>` is still damage/heal/drain (`AdminDashboard.tsx` 2684–2687). |
| Admin Save calls the client validator | `AdminDashboard.tsx` 3547–3565; `useSpellQueries.ts` 64–81 | Payload clamp. Not `targetType`, not acquisition, not lifecycle. |
| Appearance cannot mint spell levels | `resolveAppearanceSpellLevels` `adminSafety.ts` 686–698 | Does not create `ownedSpellIds`. |
| Wallet/level feats defer until `applyRewards` | `shouldDeferAchievementUnlockUntilRewardsPersist` `adminSafety.ts` 392–398 | Unlocks still grant **Doka only**. |
| Achievement conditions are a 15-key whitelist | `KNOWN_ACHIEVEMENT_CONDITIONS` `adminSafety.ts` 306–322 | Still Doka-only (`AchievementConfig` `admin.mo` 249–256). |
| Config rollback for some maps | `adminRollbackLevelUpConfig` / `GameConfig` / `TierSpawnConfig` / `ColorPalette` / `BossRushConfig` | **No** `adminRollbackSpellConfig`. Spell Save is a live overwrite (`main.mo` 869–880). |

### 2.2 Still missing (08-31 studio) — line numbers re-read this run

| Gap | Evidence @ `0f5363f` |
| :--- | :--- |
| Catalog ≠ ownership | `ownedSpells` = all `starterSpells` (forced `isBaseSpell`) ∪ every backend row with `usableByPlayer !== false` (`WorldExploration.tsx` 2395–2440). 32 frontend ids in `spellData.ts` are pre-owned. `Character` (`main.mo` 122–145) has `spellLevelKeys` / `spellBarOrder` only. Leftover `activeSpells : ?[Nat]` (140) is **not** the owned set. |
| Observation / unlock persist | No `ownedSpellIds`, `observedSpellIds`, `recordSpellObservation`, or `commitSpellDiscoveries`. Recap is XP/Doka/feats (`attachRecapUnlocks` in `recapUnlocks.ts` 16–20 is achievements only). |
| Acquisition routes + three flags | Only `usableByPlayer` / `usableByEnemy` (`admin.mo` 117–118). No `ENEMY_DISCOVERY` / `ACHIEVEMENT` / `CHALLENGE` / `BOSS` / `ELITE` / `SPECIAL_ENCOUNTER` / `MULTI_SOURCE` / `ENEMY_ONLY` / `BOSS_ONLY` / `SYSTEM_ONLY`. No `OBSERVATION_REQUIRED` / `VICTORY_REQUIRED` / `PLAYER_LEARNABLE`. |
| `minLevel` is a fake unlock | Documented as “minimum player level required to unlock” (`admin.mo` 119). CatalogNote admits it is **not** enforced at hydrate (`AdminDashboard.tsx` 3644). `upgradeSpell` (`main.mo` 1008–1014) never reads it. Paid first upgrade of any `usableByPlayer` catalog id appends `spellLevelKeys` (the third grant path; #466 locks this). |
| Enemy pools | `ENEMY_KITS` is `Record<ChessPieceType, …>` (`enemyAI.ts` 163–185). Battle start comments “10 random spells” then `buildEnemyKit(enemy.pieceType, currentMap.levelZone)` (`WorldExploration.tsx` 11915–11923). Admin `EnemyConfig` has no spell list (`admin.mo` 15–26). |
| Zone always 0 | `currentMap.levelZone` is `{ name, minLevel, maxLevel }` (4683–4687, also 5439, 5517, 13514, 13646). `Math.floor(levelZone)` is `NaN`; every kit stays zone 0. `longHorizonSim.ts` 51–58 **documents** the NaN and still `Math.floor`s a second copy. |
| Achievement / challenge spell grants | Doka-only feats (`defaultAchievements()` `admin.mo` 309–326). Challenges `{ doka, xp, badge }` (`challengeCompletion.ts` 27). |
| Name heuristics | `OLD_SPELL_NAMES_SET` matches **name and id** (WX 2356–2389), including live `physical_attack` **and** display name `Inferno` (live starter `spell-inferno`). `summonSpawn.ts` 165: `spell.name.replace("Summon ", "")`. `inferSummonArchetype` (`enemyAI.ts` 218–224) falls back to `summon.name`. Editor “Heal (targets self)” (2685) infers targeting from `spellType`. |
| Starter catalog vs canister | Combat: 32 ids in `spellData.ts`. Canister seed: six other ids (`admin.mo` 168–191). `physical_attack` is in `OLD_SPELL_IDS` (`main.mo` 689–697) **and** the name tombstone. |
| Live id in the tombstone | Zone-0 pawn/knight/rook kits request Strike; `normalizedSpellPool` strips it. Empty unless summoner roll appends wolf/archer (WX 11932–11942) via `starterSpells.find(id === "summon-dire-wolf")`. |
| Bar persist | `setSpellBarOrder` keeps only `spellLevelKeys` (`main.mo` 1938–1947). Create writes empty keys, so the official first-bar save of starters is filtered to `[]`. |
| Draft / version / rollback | No revision store. `newSpell()` ids are `spell_${Date.now()}` (86). |
| Enemy hard delete | `adminDeleteEnemyConfig` is `remove` (`main.mo` 798–805). |
| Three boss kit sources | Live `data/bossKits.ts`; Motoko `defaultBossConfigs()` still lists purged ids (`admin.mo` 350+; Pale Archbishop `fireball`/`cursed_gust`/`entangle` at 357–361; Crimson Countess mixes live `physical_attack` with purged `blood_nova` at 375–379); Admin chips `getSpellConfigs()` (`AdminDashboard.tsx` 7590–7730). |
| Summon editor | Persist + bindgen + save-validator exist. No `isSummon` / `summonAI` / `displayName` / kit controls. `newSpell()` seeds empty summon fields (131–134). Motoko `SummonUnitDef` is still `pieceType` / `level` / `hpScale` / `damageScale` (`admin.mo` 85–90). Combat also needs `summonKit`, `ap`, `mp` (`summonSpawn.ts` 22–33). |
| EOP later file | New stables (`ownedSpellIds`, `observedSpellIds`, `lifecycle`, acquisition, `spellRewardIds`, revisions) need a **later** `YYYYMMDD_*.mo` after `20260901_000000` (`mops.toml` `check-limit = 5`). Never edit a shipped `NewActor`. |

### 2.3 Three SpellConfig shapes (unchanged hole)

| Layer | Path | Now stores | Still missing vs combat |
| :--- | :--- | :--- | :--- |
| Motoko persist | `admin.mo` 85–127 | Identity, AP/MP, damage/heal, effect strings, range/LoS flags, usable flags, cooldown, thin summon block | `targetType` (combat includes `chain`), area, buff/debuff/DoT, mechanic flags, `displayName`, `summonKit`, summon AP/MP, acquisition, lifecycle, effects list |
| Bindgen | `backend.ts` 118–152 | Matches Motoko | Everything Motoko still omits |
| Engine / UI | `gameTypes.ts` 160–241 + `summonSpawn.ts` 22–33 | `targetType` `self \| ally \| enemy \| ground \| area \| line \| chain \| all`, mechanic flags, `summonKit` | Those fields never survive a canister round-trip |

`spellEngine.ts` 6–13 still documents that combat reads the **frontend** fields, including `targetType`. Never key targeting or effects off `spell.name`.

---

## 3. Queue hazards new since 09-22 (do not treat as landed)

Oldest-first merge order starts at **#327**, then **#331**, then **#333–#471**. This PR must stay merge-clean vs `origin/main` **and** as the next item after older still-open PRs. Union overlapping files; one `export function` per name.

| PR | What it will freeze if merged as-is | Honour without adopting the wrong field |
| :--- | :--- | :--- |
| [#353](https://github.com/Mr-Melic/stralt/pull/353) | 09-21 SDA docs (`SPELL_ADMIN_DESIGN_2026-09-21.md` + edits to 08-31/09-01/09-02) | Do not rewrite those five files. |
| [#398](https://github.com/Mr-Melic/stralt/pull/398) | 09-22 SDA docs | Do not rewrite those two files. 09-23-00N ≡ 09-22-00N. |
| [#341](https://github.com/Mr-Melic/stralt/pull/341) | `BUILT_IN_SPELL_DELETE_BLOCKED` copies Motoko “set usableByPlayer=false to retire it” | Hide × for the six built-ins. Do not ship that string as lifecycle copy (017). |
| [#413](https://github.com/Mr-Melic/stralt/pull/413) | `adminSpellCatalogStatus`: `usableByPlayer === false` → `"retired"` chip (retired wins over built-in) | Label built-ins. Do not treat the cast-gate false as Retired (021). |
| [#400](https://github.com/Mr-Melic/stralt/pull/400) | `spellCatalogEvolve.ts` `OFFICIAL_STARTER_SPELL_IDS` = **all 32** `spellData.ts` ids; empty `spellLevelKeys` keeps that whole set on bar persist | Extracted helper is restack-safe. **Do not** seed `ownedSpellIds` from that 32-list (022, 018). Empty keys ≠ no ownership (019). |
| [#466](https://github.com/Mr-Melic/stralt/pull/466) | `spellDiscoveryEvolve.ts` locks `upgradeSpellWouldGrantUnownedCatalogId` and unused `minLevel` | Keep the tests as proof of the hole. Close the hole in 003 + 023: `upgradeSpell` is never the grant writer; `minLevel` is a post-own cast gate (08-31 §4.3). |
| [#374](https://github.com/Mr-Melic/stralt/pull/374) / [#384](https://github.com/Mr-Melic/stralt/pull/384) | `effectParams` JSON well-formedness | Do not re-implement (020). Remaining clamp drift is mp/cooldown/damage/heal/minLevel/hitTiles + AP 0 + `targetType`. |
| [#388](https://github.com/Mr-Melic/stralt/pull/388) | Hydrate levels from canister arrays only | Empty keys ≠ no ownership (019). |
| [#371](https://github.com/Mr-Melic/stralt/pull/371) / [#342](https://github.com/Mr-Melic/stralt/pull/342) | Wave-4 unique ids (docs) | Must not be catalog-granted (018). |
| [#411](https://github.com/Mr-Melic/stralt/pull/411) / [#463](https://github.com/Mr-Melic/stralt/pull/463) | Wave-5 / Wave-6 unique ids (docs) | Same rule (026). |
| [#437](https://github.com/Mr-Melic/stralt/pull/437) | Freeze `dokaReward` while unclaimed progress exists | Honour on feat Save. Freeze is **not** `spellRewardIds` (025). |
| [#460](https://github.com/Mr-Melic/stralt/pull/460) | Reject duplicate **active** achievement conditions | Honour on feat Save. Uniqueness is **not** spell grants or feat-graph edges (024). |
| [#334](https://github.com/Mr-Melic/stralt/pull/334) / [#415](https://github.com/Mr-Melic/stralt/pull/415) / [#457](https://github.com/Mr-Melic/stralt/pull/457) | AdminDashboard copy / leftover ShopPackage / enemy-name labels | Union; one SpellEditor extract (027). |
| [#449](https://github.com/Mr-Melic/stralt/pull/449) | Enemy/boss admin re-audit 09-23 | One boss-kit id list with 011 (028). |

WX / AdminDashboard / `adminSafety.ts` / `adminGuard.mo` / `main.mo` / `useSpellQueries.ts` are the overlap set. Concatenating two copies of the same helper fails `vite build`.

---

## 4. Superseding rule: lifecycle ≠ `usableByPlayer`

Unchanged from 08-31 §4 / §8 and 09-01 §3. Restated because #341 copies the Motoko error string and #413 paints `usableByPlayer=false` as a Retired chip.

| Field | Meaning | Must not mean |
| :--- | :--- | :--- |
| `usableByPlayer` | Cast/equip gate **after** ownership (and `minLevel`) | Retired, ENEMY_ONLY, draft, hidden |
| `usableByEnemy` | Hostile AI may resolve this id | Learnable, in a pool, or published |
| `lifecycle` | `draft \| active \| inactive \| retired` | Anything about who can cast |
| `PLAYER_LEARNABLE` | May enter `ownedSpellIds` | `usableByPlayer` |
| `acquisition.route` | How a player learns it | Inferred from the two usable flags or from `minLevel` |
| `minLevel` | Cast/equip after ownership | Unlock, grant, or discovery |

`ENEMY_ONLY` / `BOSS_ONLY`: `PLAYER_LEARNABLE = false`, `usableByEnemy = true`, `lifecycle = active`. Players never own them. Setting `usableByPlayer = false` on those ids is **correct as a cast gate** and **wrong as the only retire signal**.

Live retire (`main.mo` 882–902): built-in six cannot be deleted (`adminGuard.mo` 21–24); if `_spellReferencedByPlayers` then `{ existing with usableByPlayer = false }`; else `spellConfigs.remove`. Error copy still says “set usableByPlayer=false to retire it” (887). Confirm dialog still claims immediate remove (3791–3795). Toast is always `"Spell deleted"` (6166).

`upgradeSpell` (1008–1014) rejects `usableByPlayer=false` unless the id is already in `spellLevelKeys`. Owned-but-never-upgraded retired ids are **not** in `spellLevelKeys`, so the check would reject the legacy upgrade 08-31 §8.2 requires. The same method **grants** any other `usableByPlayer=true` catalog id on first paid upgrade — including Admin-added rows and `void_collapse` (minLevel 30) at player level 1.

**Already-owned retired spells** (08-31 §8.2, unchanged):

1. Do not strip `ownedSpellIds`, `spellLevelKeys` / `spellLevelValues`, or `spellBarOrder`.
2. `setSpellBarOrder` keeps the id if owned (not “must be in `spellLevelKeys`” and not “must be `usableByPlayer`”).
3. `upgradeSpell` stays legal for owned retired ids. New players cannot obtain the id.
4. Spellbook shows a Retired seal. Combat reads the frozen `retiredRevision`.
5. New achievement grants skip a retired reward id and still pay Doka.
6. Live kits ignore retired ids at resolve time (log once). Activate of a kit that still lists them is blocked.

Hard delete remains legal **only** for `draft` with zero published revisions and zero refs (players, kits, bosses, achievements). `adminDeleteSpellConfig` must return `#err` plus a dependency report otherwise.

---

## 5. Three grant paths that are not ownership

`shouldIncludeBackendSpellInLibrary` (`adminSafety.ts` 711–719):

```
if (usableByPlayer !== false) return true;
return ownedSpellIds.has(spellId);
```

Wired at `WorldExploration.tsx` 2428–2436. The `ownedIds` set is `baseSpells ∪ spellLevelKeys ∪ spellBarOrder`. `baseSpells` is **every** `starterSpells` row with `isBaseSpell: true` (2395–2408) — 32 unique ids.

So today a player “owns” a spell by any of:

1. **Hydrate union** — frontend catalog + every backend row with `usableByPlayer !== false`.
2. **Paid `upgradeSpell`** — first debit of a usable catalog id appends `spellLevelKeys` (`main.mo` 1006–1014). `minLevel` is not read. #466 names this `upgradeSpellWouldGrantUnownedCatalogId`.
3. **Bar / keys leftover** — `_spellReferencedByPlayers` / `setSpellBarOrder` treat keys+bar as the owned set. Empty keys on create mean “starters are owned”, not “owns nothing” (#388 / #400 / 019).

08-31 SDA-002 remains the persist work. After it lands, all three paths must read `ownedSpellIds` only (plus retired-owned). `upgradeSpell` requires the id already owned. Catalog `getSpellConfigs` stays public. `minLevel` stays a cast gate.

**Seed (unchanged, restated against #400):** `SYSTEM_ONLY` / innate four that exist in the canister after 007: `physical_attack`, `starter-shield`, `starter-poison`, `starter-heal`. Migrate from `spellLevelKeys ∪ spellBarOrder` plus those base ids — **not** `getSpellConfigs()`, **not** the full `starterSpells` array, **not** `#400` `OFFICIAL_STARTER_SPELL_IDS`, **not** Wave-4/5/6 unique ids.

Extract helpers; do not grow WX.

---

## 6. Required definition fields (activate gate)

A definition cannot leave `draft` → `active` unless:

- id (`^[a-z][a-z0-9_-]{1,47}$`), name, description
- `targetType` (`self | ally | enemy | ground | area | line | chain | all`)
- `minRange` ≤ `maxRange` ≤ 20
- `apCost` 0–12; `0` legal only with `isTimestep` or explicit `allowZeroAp` (not a name check). Editor already exposes `isTimestep` (`AdminDashboard.tsx` 3434) but Save rejects AP `< 1` (client 604–606; Motoko 380–382).
- `cooldown` 0–10 (editor field exists at 2653–2657; keep it)
- at least one explicit effect (typed variant or today’s metadata flags — never `spell.name`)
- if summon: complete `SummonUnitDef` including `summonAI` enum, `displayName`, `summonKit` (id list), `freeCells`, `targetType = ground`. Remove `\|\| "hunter"`.
- if enemy-usable: pool membership **or** an explicit `ENEMY_ONLY` / `BOSS_ONLY` route with a kit/boss ref
- acquisition block filled (`ENEMY_DISCOVERY` default + `OBSERVATION_REQUIRED` / `VICTORY_REQUIRED` / `PLAYER_LEARNABLE`)
- no name-heuristic fields

`validateSpellConfig` today is a payload clamp, not this gate. Client still omits Motoko caps on mp/cooldown/damage/heal/minLevel/hitTiles/`effectParams`.

---

## 7. Acquisition, discovery, pools (contract pointer)

Unchanged from 08-31 §§4–6 and [`SPELL_DISCOVERY_ECOSYSTEM_2026-08-31.md`](./SPELL_DISCOVERY_ECOSYSTEM_2026-08-31.md):

```
eligible unknown spell
  → enemy kit actually contains the id
  → enemy successfully casts it
  → observed (persist)
  → player wins that encounter
  → ownedSpellIds + root recap
```

Routes: `ENEMY_DISCOVERY` | `ACHIEVEMENT` | `CHALLENGE` | `BOSS` | `ELITE` | `SPECIAL_ENCOUNTER` | `MULTI_SOURCE` | `ENEMY_ONLY` | `BOSS_ONLY` | `SYSTEM_ONLY`.

Flags on every definition: `OBSERVATION_REQUIRED`, `VICTORY_REQUIRED`, `PLAYER_LEARNABLE`.

Pools: `CORE` | `ADVANCED` | `RARE` | `ELITE` | `SIGNATURE`.

Possession is not observation. Player-side summons do not observe. Hostile summons may. `upgradeSpell` is never the grant writer.

Summoner extras (`WorldExploration.tsx` 11932–11942) stay a kit field `bonusSummonSpellIds` with weights. No hardcoded `starterSpells.find(id === "summon-dire-wolf")`.

`resolveEnemyKit` must receive a **numeric** zone (or `minLevel`), not the LevelZone object.

---

## 8. Owner UI (dev-gated — still the 08-31 studio)

Live tabs (`AdminDashboard.tsx` 5610–5626): Enemies, Regions, Player Sprites, Spells, Map Modifiers, Enemy Tiers, Visuals, Settings, Purchases, Achievements, Enemy Names, Bosses, Ad Boxes, Shop, Boss Rush.

Missing studio tabs: Library (lifecycle/route filters), Discovery, Kits, Feats-as-graph, Graph, Versions.

Carved-stone / slate / crimson. Same `#admin` + lazy `AdminDashboard` gate.

Immediate UI honesty (can land with persist 001/004, not a restyle):

- Delete on published ids is **Retire**. Confirm lists dependents. Toast must say retired vs rejected vs draft-deleted.
- Cast-gate checkboxes stay labeled “player may cast” / “enemy may cast.” Lifecycle is a separate control. Do not ship #413’s `"retired"` chip on `usableByPlayer=false`.
- Validation strip: missing `targetType`, broken kit id, name-heuristic leftover = crimson.
- Spell Type includes `summon`. Summon section: `summonAI`, lifespan, piece, scales, **displayName**, kit ids. Drop “Heal (targets self)”.
- CatalogNote already admits summon controls are missing and mechanic flags drop on reload (3641–3644). Keep that honesty until 005 round-trips.

Do not grow the 8 280-line dashboard until activate exists on the canister (08-31 SDA-012 / 09-23-013). Extract `SpellEditor` rather than appending. Landing is `useSpellQueries.ts`. Union AdminDashboard siblings (027). Do not grow `WorldExploration.tsx`.

---

## 9. Prior ACTION_ID status @ `0f5363f`

### 08-31 / 09-01 / 09-02

Unchanged from 09-22 §9. 09-01-002 **LANDED**. Empty-AI half of 09-02-006 **LANDED**. 08-31-005 / 09-01-001 remain **PARTIAL / WRONG FIELD** (`usableByPlayer=false`). Everything else **OPEN**.

### 09-21 / 09-22

Unmerged docs only (#353 / #398). Treat 09-23-001 … 020 as the same first-cuts. 021–028 are this run’s queue-union IDs.

**Next implementer:** **09-23-001** so 005 is not extended on `usableByPlayer`, then **09-23-007** (live Strike is missing from enemy kits), then **09-23-003** ownership (close hydrate **and** `upgradeSpell` grant). Persist `targetType` + complete summon def before player-facing unlock UX. Honour 016 for any new stable. Honour 017–028 when those siblings have landed — union, do not concatenate.

---

## 10. Out of scope

- Production TypeScript / Motoko / Candid in this PR
- RAF, map generation, turn logic, damage math
- Growing `WorldExploration.tsx` or `AdminDashboard.tsx`
- Re-authoring Wave-N spell cards or boss adaptations
- Treating `adminSafety.ts` / `#400` / `#466` helpers as the finished lifecycle
- Re-opening 09-01-002 bindgen work or the empty-AI Motoko reject
- Overwriting #353 / #398 files
- Editing Cursor dashboard prompts (no write API)

---

## 11. ACTION_ID index (this run)

All items: `STATUS: NEW`. Full records: [`ACTION_IDS_SDA_2026-09-23.md`](./ACTION_IDS_SDA_2026-09-23.md).

| ID | Title | Priority |
| :--- | :--- | :--- |
| SDA-2026-09-23-001 | Separate lifecycle from `usableByPlayer` | P0 |
| SDA-2026-09-23-002 | Persist complete combat `SummonUnitDef`; drop the hunter default | P0 |
| SDA-2026-09-23-003 | Stop treating the library helper as ownership | P0 |
| SDA-2026-09-23-004 | Real dependency report; hard-delete only drafts | P0 |
| SDA-2026-09-23-005 | Persist `targetType` (including `chain`) and combat mechanic flags | P0 |
| SDA-2026-09-23-006 | Shared activate-gate validator (remaining clamp drift) | P1 |
| SDA-2026-09-23-007 | Seed starters; stop purging and tombstoning live `physical_attack` | P0 |
| SDA-2026-09-23-008 | Replace remaining name heuristics | P0 |
| SDA-2026-09-23-009 | Acquisition flags + observe→win→unlock | P0 |
| SDA-2026-09-23-010 | Admin-authored CORE–SIGNATURE pools; numeric zone; kit summon extras | P1 |
| SDA-2026-09-23-011 | One boss-kit source; repair Motoko pools; honest retire UI | P1 |
| SDA-2026-09-23-012 | Achievement / challenge `spellRewardIds` on the existing whitelist | P1 |
| SDA-2026-09-23-013 | Draft / validate / activate / rollback / compare / duplicate | P1 |
| SDA-2026-09-23-014 | Persist bar from ownership, not only upgrade keys | P1 |
| SDA-2026-09-23-015 | SpellEditor summon + targeting + acquisition; do not grow WX | P1 |
| SDA-2026-09-23-016 | New later EOP file after `20260901` for any new spell persist maps | P0 |
| SDA-2026-09-23-017 | Union #341 delete-block; do not freeze `usableByPlayer` as retire copy | P0 |
| SDA-2026-09-23-018 | Wave-4 unique ids stay unowned until their acquisition route | P0 |
| SDA-2026-09-23-019 | Canister-array level hydrate is not the owned set | P0 |
| SDA-2026-09-23-020 | Do not re-implement #384 `effectParams` JSON; remaining clamp list | P1 |
| SDA-2026-09-23-021 | Union #413 catalog chip; `usableByPlayer=false` is not Retired | P0 |
| SDA-2026-09-23-022 | Union #400 bar-id helpers; do not seed ownership from all 32 frontend ids | P0 |
| SDA-2026-09-23-023 | `upgradeSpell` must not grant unowned catalog ids; `minLevel` is not acquisition | P0 |
| SDA-2026-09-23-024 | Union #460 unique feat conditions; uniqueness is not `spellRewardIds` | P1 |
| SDA-2026-09-23-025 | Union #437 freeze unclaimed Doka; freeze is not a spell grant | P1 |
| SDA-2026-09-23-026 | Wave-5 / Wave-6 unique ids stay unowned until their acquisition route | P1 |
| SDA-2026-09-23-027 | Restack-union AdminDashboard siblings; one SpellEditor extract | P1 |
| SDA-2026-09-23-028 | One boss-kit id list with #449; do not grow a fourth source | P1 |
