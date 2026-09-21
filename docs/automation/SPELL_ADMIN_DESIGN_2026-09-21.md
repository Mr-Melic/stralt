# Spell, Discovery & Achievement Admin Design — 2026-09-21 re-audit

**Author:** Spell, Discovery & Achievement Admin Designer  
**Automation:** `4efa22ec-a498-11f1-a7d1-d6b4613131ce`  
**Date:** 2026-09-21  
**HEAD audited:** `0f5363f` (`Merge pull request #332`)  
**Scope:** Owner tooling for the complete spell ecosystem. **No production code in this PR.**

This is a **delta** on [`SPELL_ADMIN_DESIGN_2026-08-31.md`](./SPELL_ADMIN_DESIGN_2026-08-31.md) (#116) and the 09-01 / 09-02 re-audits. Sections 2–11 of the 08-31 document remain the contract (canonical `SpellDefinition`, acquisition routes, observe→win→unlock, CORE–SIGNATURE pools, dependency views, soft-retire + already-owned legacy, studio tabs, persist sketch). This run does **not** replace that contract.

It records what landed after `58302bc`, what is still the wrong field, and the ACTION_IDs in [`ACTION_IDS_SDA_2026-09-21.md`](./ACTION_IDS_SDA_2026-09-21.md).

Do not implement those IDs unless a human or orchestrator picks one. Do not grow `WorldExploration.tsx` (19 213 lines). Do not grow `AdminDashboard.tsx` (8 280 lines). Never introduce spell-name heuristics.

Open PRs older than this docs change (oldest-first merge order at audit time): **#327** (`enemyAI.ts`, `WorldExploration.tsx`) then **#331** (`WorldExploration.tsx`). Same-day siblings that touch admin chrome but **not** these SDA docs: **#334** (tier copy), **#341** (built-in spell delete / owner UX — `AdminDashboard.tsx`, `useSpellQueries.ts`, `adminSafety.ts`). This PR is docs only and does not touch those files. Implementers who later land persist/UI must **union** those siblings, not overwrite, and must keep one `export function` per name. Do not treat #341 as lifecycle (001); it is confirm/delete UX on the existing `usableByPlayer` path.

---

## 1. Why this run exists

Nineteen days after the 09-02 re-audit the studio still does not exist. Admin safety work **did** land: Motoko now rejects empty `summonAI` when `isSummon=true` (the 09-02 client/server empty-AI drift is **closed**), `spellType`/`effectType` accept `"summon"`, achievement **conditions** are a closed whitelist, and `useSpellQueries` is the save/delete landing. None of that is ownership, discovery, lifecycle, or a complete combat record.

`usableByPlayer = false` is still the live retire path. That flag is a **cast gate**. Extending it is still forbidden.

The 08-31 contract is still the destination. The 09-21 IDs are the current first cuts.

---

## 2. Current state (verified against `origin/main` @ `0f5363f`)

### 2.1 What landed since 09-02 (do not rediscover)

| Change | Where | What it actually does |
| :--- | :--- | :--- |
| Motoko requires known `summonAI` when `isSummon` | `adminGuard.mo` 423–426 | Empty-AI summons no longer save. 09-02-006 **empty-AI half closed**. Still not an activate gate. |
| `spellType` / `effectType` accept `"summon"` | `adminGuard.mo` 348–355; `adminSafety.ts` 18, 41–50 | Validator enum grew. **Editor `<select>` did not** (damage / heal / drain only). |
| Achievement conditions are a closed list | `adminGuard.mo` `knownAchievementCondition` 515–531; `validateAchievementConfig` 533–546 | 15 string keys only. Still **Doka-only** (`AchievementConfig` 249–256). |
| Admin Save + mutation both call the client clamp | `AdminDashboard.tsx` 3547–3565; `useSpellQueries.ts` 64–81 | Double payload clamp. Not `targetType`, not acquisition, not lifecycle. |
| Appearance still cannot mint spell levels | `adminSafety.ts` `resolveAppearanceSpellLevels` 686–698 | Cosmetic writes keep stored keys. Does not create `ownedSpellIds`. |
| Wallet/level feats still defer until `applyRewards` | `shouldDeferAchievementUnlockUntilRewardsPersist` `adminSafety.ts` 392 | Unlocks still grant **Doka only**. |
| Config rollback still exists for some maps | `adminRollbackLevelUpConfig` / `GameConfig` / `TierSpawnConfig` / `ColorPalette` / `BossRushConfig` | **No** `adminRollbackSpellConfig`. Spell Save is still a live overwrite (`main.mo` 869–880). |
| Bindgen summon block (09-01-002) | `backend.ts` 118–152; `adminContract.ts` 283–314 | Still landed. Motoko `SummonUnitDef` is still thin. |

`defaultSpells()` literals still include the summon block (all empty). The 08-31 type-drift on those literals stays closed.

### 2.2 What did not land (still the 08-31 / 09-01 / 09-02 gaps)

| Gap | Evidence @ `0f5363f` |
| :--- | :--- |
| Catalog ≠ ownership | `ownedSpells` = all `starterSpells` (forced `isBaseSpell`) ∪ every backend row with `usableByPlayer !== false` (`WorldExploration.tsx` 2395–2440). 32 frontend ids in `spellData.ts` are pre-owned. `Character` (`main.mo` 122–145) still has only `spellLevelKeys` / `spellBarOrder`. |
| Observation / unlock persist | No `ownedSpellIds`, `observedSpellIds`, `recordSpellObservation`, or `commitSpellDiscoveries`. Recap still XP/Doka/feats (`PostBattleRecap.tsx` `BattleRecapData`; `newlyUnlockedAchievements` only). |
| Acquisition routes + three flags | Still only `usableByPlayer` / `usableByEnemy` (`admin.mo` 117–118). No `ENEMY_DISCOVERY` / `ACHIEVEMENT` / `CHALLENGE` / `BOSS` / `ELITE` / `SPECIAL_ENCOUNTER` / `MULTI_SOURCE` / `ENEMY_ONLY` / `BOSS_ONLY` / `SYSTEM_ONLY`. No `OBSERVATION_REQUIRED` / `VICTORY_REQUIRED` / `PLAYER_LEARNABLE`. |
| Enemy pools | `ENEMY_KITS` is still `Record<ChessPieceType, …>` (`enemyAI.ts` 163–185). Battle start still comments “10 random spells” then `buildEnemyKit` (`WorldExploration.tsx` 11915–11923). Admin `EnemyConfig` still has no spell list (`admin.mo` 15–26). `longHorizonSim.ts` 51–58 **documents** the LevelZone NaN bug and still `Math.floor`s the value as a number. |
| Zone always 0 | `buildEnemyKit(enemy.pieceType, currentMap.levelZone)` (`WorldExploration.tsx` 11920). `levelZone` is `{ name, minLevel, maxLevel }` (4683, 5234, 5439, 5517). `Math.floor(levelZone)` is `NaN`; `z >= 1` is false; every kit stays zone 0. |
| Achievement / challenge spell grants | `AchievementConfig` is `{ id, name, description, dokaReward, condition, active }`. The new whitelist is the right **door**, not a reward. `DEFAULT_CHALLENGES` still `{ doka, xp, badge }` (`challengeCompletion.ts` 27, 92+). |
| Name heuristics | `OLD_SPELL_NAMES_SET` matches **name and id** (WX 2356–2389), including live `physical_attack`. `summonSpawn.ts` 165: `spell.name.replace("Summon ", "")`. `inferSummonArchetype` (`enemyAI.ts` 218–224) falls back to `summon.name` (`wolf` / `golem` / `wisp` / …). Editor label “Heal (targets self)” (`AdminDashboard.tsx` 2685) implies targeting from `spellType` because `targetType` is still absent. |
| Starter catalog vs canister | Combat ids live in `spellData.ts` (32 ids). Canister seed is six other ids (`admin.mo` 168–191). `physical_attack` is still in the start-up **purge** list (`main.mo` 689–697). |
| Live id in the tombstone | `OLD_SPELL_NAMES_SET` includes `physical_attack` (WX 2386). Enemy kit resolution looks that id up in `normalizedSpellPool` (WX 11920–11923, 2688–2701), which **strips** it. Zone-0 pawn/knight/rook kits resolve empty unless the summoner roll appends wolf/archer (11932–11942). |
| Runtime hunter rewrite | Motoko now blocks empty AI on **admin save**. Combat still does `spell.summonAI \|\| "hunter"` (`summonSpawn.ts` 139). Frontend catalog rows with empty AI still become hunters at spawn. |
| Bar persist | `setSpellBarOrder` still keeps only `spellLevelKeys` (`main.mo` 1945–1947). Never-upgraded starters drop off the persisted bar. |
| Draft / version / rollback | `adminSetSpellConfig` writes the live map after `validateSpellConfig` (`main.mo` 869–880). No revision store. |
| Enemy hard delete | `adminDeleteEnemyConfig` is still `remove` (`main.mo` 798–805). |
| Boss seed ids | `defaultBossConfigs()` still lists purged ids (`fireball`, `cursed_gust`, `entangle`, `mist_form`, `blood_nova`, … — `admin.mo` 350+). Crimson Countess seed lists `physical_attack` **and** `blood_nova`. Live combat bosses use `data/bossKits.ts`. Admin Bosses tab chips `getSpellConfigs()` (`AdminDashboard.tsx` 7750). **Three kit sources.** |
| Summon editor | Persist + bindgen + save-validator exist. Spell Type `<select>` is only damage/heal/drain (2684–2687). No `isSummon` / `summonAI` / `summonLifespan` / `summonUnitDef` / `displayName` controls. `newSpell()` seeds empty summon fields (131–134) and id `spell_${Date.now()}` (86). |
| EOP later file | `ownedSpellIds` / `observedSpellIds` / `lifecycle` / `spellRewardIds` are new stables. Chain tail is `20260901_000000` (GameKey). `mops.toml` `check-limit = 5`. A persist PR **must** add a later `YYYYMMDD_*.mo` after `20260901` with `OldActor = {}`. Do not edit a shipped `NewActor`. |

### 2.3 Three SpellConfig shapes (unchanged hole)

| Layer | Path | Now stores | Still missing vs combat |
| :--- | :--- | :--- | :--- |
| Motoko persist | `admin.mo` 85–127 | Identity, AP/MP, damage/heal, effect strings, range/LoS flags, usable flags, cooldown, thin summon block (`pieceType`/`level`/`hpScale`/`damageScale`) | `targetType` (combat also has `chain`), area, buff/debuff/DoT, mechanic flags, `displayName`, `summonKit`, summon AP/MP, acquisition, lifecycle, effects list |
| Bindgen | `backend.ts` 118–152 | Matches Motoko, including summon block | Everything Motoko still omits |
| Engine / UI | `gameTypes.ts` 160–241 + `summonSpawn.ts` `SummonUnitDef` 22–33 | `targetType` (includes `chain`), area, buffs, DoT, `isSwap`/`isMirror`/`isTimestep`/`isSacrifice`/`isBarrier`/`isTrap`/`isMark`, `summonKit`, summon AP/MP | Those fields never survive a canister round-trip |

`spellEngine.ts` 6–13 still documents that combat reads the **frontend** fields, including `targetType` and mechanic flags.

Saving a summon from Admin today: editor cannot set summon fields; Motoko unit def cannot store `summonKit` / `displayName`; bindgen cannot invent them. A Candid client that writes `spellType="summon"` + `isSummon` + known AI will persist a unit that combat cannot fully reconstruct.

---

## 3. Superseding rule: lifecycle ≠ `usableByPlayer`

Unchanged from 09-01 §3 / 08-31 §4 and §8. Restated so the partial implementation cannot be extended.

| Field | Meaning | Must not mean |
| :--- | :--- | :--- |
| `usableByPlayer` | Cast/equip gate **after** ownership (and `minLevel`) | Retired, ENEMY_ONLY, draft, hidden |
| `usableByEnemy` | Hostile AI may resolve this id | Learnable, in a pool, or published |
| `lifecycle` | `draft \| active \| inactive \| retired` | Anything about who can cast |
| `PLAYER_LEARNABLE` | May enter `ownedSpellIds` | `usableByPlayer` |
| `acquisition.route` | How a player learns it | Inferred from the two usable flags |

`ENEMY_ONLY` / `BOSS_ONLY`: `PLAYER_LEARNABLE = false`, `usableByEnemy = true`, `lifecycle = active`. Players never own them. Setting `usableByPlayer = false` on those ids is **correct as a cast gate** and **wrong as the only retire signal**.

Live retire (`main.mo` 882–902): built-in six cannot be deleted (`adminGuard.mo` 21–24); if `_spellReferencedByPlayers` then `{ existing with usableByPlayer = false }`; else `spellConfigs.remove`. Error copy still says “set usableByPlayer=false to retire it” (887).

`upgradeSpell` (1008–1014) rejects `usableByPlayer=false` unless the id is already in `spellLevelKeys`. Owned-but-never-upgraded retired ids are **not** in `spellLevelKeys`, so the check would reject the legacy upgrade 08-31 §8.2 requires.

**Already-owned retired spells** (08-31 §8.2, unchanged):

1. Do not strip `ownedSpellIds`, `spellLevelKeys` / `spellLevelValues`, or `spellBarOrder`.
2. `setSpellBarOrder` keeps the id if owned (not “must be in `spellLevelKeys`” and not “must be `usableByPlayer`”).
3. `upgradeSpell` stays legal for owned retired ids. New players cannot obtain the id.
4. Spellbook shows a Retired seal. Combat reads the frozen `retiredRevision`.
5. New achievement grants skip a retired reward id and still pay Doka.
6. Live kits ignore retired ids at resolve time (log once). Activate of a kit that still lists them is blocked.

Hard delete remains legal **only** for `draft` with zero published revisions and zero refs (players, kits, bosses, achievements). `adminDeleteSpellConfig` must return `#err` plus a dependency report otherwise.

---

## 4. Ownership helper is still inverted

`shouldIncludeBackendSpellInLibrary` (`adminSafety.ts` 711–719):

```
if (usableByPlayer !== false) return true;
return ownedSpellIds.has(spellId);
```

Wired at `WorldExploration.tsx` 2429–2433. The `ownedIds` set is `baseSpells ∪ spellLevelKeys ∪ spellBarOrder`. `baseSpells` is **every** `starterSpells` row with `isBaseSpell: true` (2397–2408), including Strike. Comment at 2395 still says “ALL starter spells + physical attack”.

So:

- A new Admin spell with default `usableByPlayer: true` (`newSpell()` 98; no lifecycle control) is still granted to every account on next hydrate.
- `usableByPlayer: false` hides the id unless it already appears on keys/bar — that is a **retire carve-out**, not an ownership split.
- There is still no observation log and no grant writer.

08-31 SDA-002 remains the persist work. 09-21-003 is “do not treat the helper as that work.”

Migration when ownership is implemented (unchanged): seed `ownedSpellIds` from `SYSTEM_ONLY` / innate four ∪ `spellLevelKeys` ∪ resolving `spellBarOrder` ids. **Do not** grant `getSpellConfigs()`. **Do not** grant the full `starterSpells` array. Innate four: `physical_attack`, `starter-shield`, `starter-poison`, `starter-heal`.

Any of those maps is a **new later** EOP file after `20260901` (09-21-016).

---

## 5. Bindgen lag stays closed; summon persist is still thin; hunter default is live

09-01-002 is **done**. Empty-AI admin save is **done**. The remaining summon hole is the Motoko `SummonUnitDef` (`admin.mo` 85–90):

```
pieceType, level, hpScale, damageScale
```

Combat `SummonUnitDef` (`summonSpawn.ts` 22–33) also needs `summonKit`, `ap`, `mp`. Display name is not on the def at all; spawn still does `spell.name.replace("Summon ", "")` (`summonSpawn.ts` 165). Empty `summonAI` still becomes `"hunter"` at 139.

Ship Motoko + bindgen + editor + migration together for any **new** fields. Do not `dfx deploy` `backend_extended/`.

`targetType` is still frontend-only. Combat’s union now includes `chain` (`gameTypes.ts` 215–223). Persist that closed set. That is the remaining half of SDA-2026-08-31-001.

---

## 6. Dependency scan that cannot see the graph

`_spellReferencedByPlayers` (`main.mo` 273–284) only walks character level keys and bar slots. It cannot see:

- `BossPhaseConfig.spellPoolIds` (Motoko seed still lists purged ids)
- `data/bossKits.ts` (live combat kits)
- `ENEMY_KITS` / future `EnemyKit` lists
- Achievement / challenge reward ids (none exist yet)
- Summon kits
- Characters who “own” the id only because the catalog was unioned into `ownedSpells`

Therefore a custom spell that was never upgraded can still be **hard-deleted** while every player’s spellbook still shows it from the catalog union. The confirm dialog (`AdminDashboard.tsx` 3794) says the live spell is **removed immediately** and dependents **will break**. Backend may have only flipped a bool. Toast is always `"Spell deleted"` (6166).

Achievement delete is the same pattern: progress present → `active=false`; else hard `remove`. Unlock rejects inactive. Still Doka-only.

Enemy delete is unconditional `remove` (798–805).

Required inspector (08-31 §7), computed from **ids**:

Spell → enemies, achievements, challenges, bosses, AI/summon kits, acquisition routes.  
Achievement → conditions (whitelist only), `spellRewardIds`, `requiresAchievementIds` / `requiresSpellIds`.

---

## 7. Required definition fields (activate gate)

A definition cannot leave `draft` → `active` unless:

- id (`^[a-z][a-z0-9_-]{1,47}$`), name, description — **not** `spell_${Date.now()}` as a published id
- `targetType` (`self | ally | enemy | ground | area | line | chain | all`)
- `minRange` ≤ `maxRange` ≤ 20
- `apCost` 0–12; `0` legal only with `isTimestep` or explicit `allowZeroAp` (not a name check)
- `cooldown` 0–10 (editor field exists at 2654–2656; keep it)
- at least one explicit effect (typed variant or today’s metadata flags — never `spell.name`)
- if summon: complete `SummonUnitDef` including `summonAI` enum, `displayName`, `summonKit` (id list), `freeCells`, `targetType = ground`
- if enemy-usable: pool membership **or** an explicit `ENEMY_ONLY` / `BOSS_ONLY` route with a kit/boss ref
- acquisition block filled (`ENEMY_DISCOVERY` default + `OBSERVATION_REQUIRED` / `VICTORY_REQUIRED` / `PLAYER_LEARNABLE`)
- no name-heuristic fields

`validateSpellConfig` today is a payload clamp, not this gate.

**Remaining client/Motoko drift after the empty-AI close:** Motoko also checks `mpCost`, `cooldown`, `damage`, `healAmount`, `minLevel`, `hitTiles` size, `effectParams` length (`adminGuard.mo` 383–418). Client `validateSpellConfig` (`adminSafety.ts` 578–660) does **not**. AP `< 1` is still illegal on both sides (blocks Timestep). Editor already exposes `isTimestep` (3434) but cannot save AP 0.

Client and Motoko must return the **same** error strings.

---

## 8. Acquisition, discovery, pools (contract pointer)

Unchanged from 08-31 §§4–6 and [`SPELL_DISCOVERY_ECOSYSTEM_2026-08-31.md`](./SPELL_DISCOVERY_ECOSYSTEM_2026-08-31.md). Wave 2/3 SDE docs stamp generations and unused doors; they do **not** replace this admin contract.

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

`resolveEnemyKit` must receive a **numeric** zone (or `minLevel`), not the LevelZone object. `longHorizonSim.ts` must use the same helper.

Achievement spell grants attach to the **existing** 15 `knownAchievementCondition` keys. Do not invent a free-text condition to hang a spell on. Do not restamp `unstoppable` / `level_10` as a spell door (SDE leftover-door rule).

---

## 9. Owner UI (dev-gated — still the 08-31 studio)

Live tabs (`AdminDashboard.tsx` 5611–5626): Enemies, Regions, Player Sprites, Spells, Map Modifiers, Enemy Tiers, Visuals, Settings, Purchases, Achievements, Enemy Names, Bosses, Ad Boxes, Shop, Boss Rush.

Missing studio tabs: Library (lifecycle/route filters), Discovery, Kits, Feats-as-graph, Graph, Versions.

Carved-stone / slate / crimson. Same `#admin` + lazy `AdminDashboard` gate.

Immediate UI honesty (can land with persist 001/004, not a restyle):

- Delete on published ids is **Retire**. Confirm lists dependents. Toast must say retired vs rejected vs draft-deleted.
- Cast-gate checkboxes stay labeled “player may cast” / “enemy may cast.” Lifecycle is a separate control.
- Validation strip: missing `targetType`, broken kit id, name-heuristic leftover = crimson.
- Spell Type includes `summon`. Summon section: `summonAI`, lifespan, piece, scales, **displayName**, kit ids.
- Heal is `targetType`, not the option text “Heal (targets self)”.

Do not grow the 8 280-line dashboard until activate exists on the canister (08-31 SDA-012 / 09-21-013). Extract `SpellEditor`. Keep admin writes in `useSpellQueries.ts`. Do not grow `WorldExploration.tsx`. If an implementer PR overlaps #327 / #331, **union** those files.

---

## 10. Prior ACTION_ID status @ `0f5363f`

### 08-31

| ID | Status | Note |
| :--- | :--- | :--- |
| SDA-2026-08-31-001 | **PARTIAL** | Cooldown + Motoko/bindgen summon **block** landed. `targetType` / mechanics / complete unit def / editor summons did not. |
| SDA-2026-08-31-002 | **OPEN** | Helper is not ownership. Catalog still grants. |
| SDA-2026-08-31-003 | **OPEN** | No route enum; flags still the two usable bools. |
| SDA-2026-08-31-004 | **OPEN** | No observe/commit APIs. |
| SDA-2026-08-31-005 | **PARTIAL / WRONG FIELD** | Soft-retire exists as `usableByPlayer=false`. Hard delete still exists. No graph. |
| SDA-2026-08-31-006 | **OPEN** | Name set, summon displayName, `inferSummonArchetype` unchanged. |
| SDA-2026-08-31-007 | **OPEN** | Starters not seeded; `physical_attack` still purged **and** tombstoned. |
| SDA-2026-08-31-008 | **OPEN** | `ENEMY_KITS` + hardcoded wolf/archer + zone NaN. Second kit in `longHorizonSim.ts`. |
| SDA-2026-08-31-009 | **OPEN** | Motoko boss seeds still purged ids; live kits live in `bossKits.ts`. |
| SDA-2026-08-31-010 | **OPEN** | Feats/challenges still Doka/XP/badge. Condition whitelist landed (door only). |
| SDA-2026-08-31-011 | **OPEN** | No revisions. Save = live write. Other configs have rollback; spells do not. |
| SDA-2026-08-31-012 | **OPEN** | Confirm dialog only; copy still lies. |
| SDA-2026-08-31-013 | **OPEN** | Bar filter still `spellLevelKeys`. |

### 09-01

| ID | Status | Note |
| :--- | :--- | :--- |
| SDA-2026-09-01-001 | **OPEN** | Lifecycle still the cast flag. |
| SDA-2026-09-01-002 | **LANDED** | Bindgen + `toBackendSpellConfig` summon fields. Do not re-do. |
| SDA-2026-09-01-003 | **OPEN** | Helper still inverted. |
| SDA-2026-09-01-004 | **OPEN** | Player-key scan only. |
| SDA-2026-09-01-005 | **OPEN** | `targetType` still frontend-only; editor has zero matches. Combat union now includes `chain`. |
| SDA-2026-09-01-006 | **PARTIAL** | Empty-AI drift **closed** (Motoko + client). Save calls client validator. Not an activate gate. AP 0 still illegal. Client still omits Motoko numeric caps. |
| SDA-2026-09-01-007 … 014 | **OPEN** | Evidence line numbers moved; substance unchanged. |

### 09-02

| ID | Status | Note |
| :--- | :--- | :--- |
| SDA-2026-09-02-001 … 005, 007 … 015 | **OPEN** | Line numbers moved (WX 19 213; Admin 8 280). Substance unchanged. |
| SDA-2026-09-02-002 | **OPEN** | Bindgen still landed; unit def still thin; hunter default still live. |
| SDA-2026-09-02-006 | **PARTIAL** | Empty-AI half **landed**. Activate gate + remaining clamp drift + AP 0 exception did not. |

Next implementer starts at **09-21-001** so 005 is not extended on `usableByPlayer`, then **09-21-007** (live Strike is missing from enemy kits), then **09-21-003** ownership. Any persist map is **09-21-016** (later EOP file after `20260901`). Persist `targetType` + complete summon def before player-facing unlock UX.

---

## 11. Out of scope

- Production TypeScript / Motoko / Candid in this PR
- RAF, map generation, turn logic, damage math
- Growing `WorldExploration.tsx` or `AdminDashboard.tsx`
- Re-authoring Wave-1/2/3 spell cards (`SPELL_DISCOVERY_ECOSYSTEM_*`) or boss adaptations (`BOSS_AND_SPELL_DISCOVERY.md`)
- Treating `adminSafety.ts` helpers as the finished lifecycle
- Re-opening 09-01-002 bindgen work
- Re-opening the empty-AI Motoko reject (already landed)
- Editing Cursor dashboard prompts (no write API)
- Implementing #327 / #331 combat/map work

---

## 12. ACTION_ID index (this run)

All items: `STATUS: NEW`. Full records: [`ACTION_IDS_SDA_2026-09-21.md`](./ACTION_IDS_SDA_2026-09-21.md).

| ID | Title | Priority |
| :--- | :--- | :--- |
| SDA-2026-09-21-001 | Separate lifecycle from `usableByPlayer` | P0 |
| SDA-2026-09-21-002 | Persist complete combat `SummonUnitDef`; drop hunter default | P0 |
| SDA-2026-09-21-003 | Stop treating the library helper as ownership | P0 |
| SDA-2026-09-21-004 | Real dependency report; hard-delete only drafts | P0 |
| SDA-2026-09-21-005 | Persist `targetType` (including `chain`) and combat mechanic flags | P0 |
| SDA-2026-09-21-006 | Shared activate-gate validator (close remaining clamp drift) | P1 |
| SDA-2026-09-21-007 | Seed starters; stop purging and tombstoning live `physical_attack` | P0 |
| SDA-2026-09-21-008 | Replace remaining name heuristics (including “Heal targets self”) | P0 |
| SDA-2026-09-21-009 | Acquisition flags + observe→win→unlock | P0 |
| SDA-2026-09-21-010 | Admin-authored CORE–SIGNATURE pools; numeric zone; one kit helper | P1 |
| SDA-2026-09-21-011 | One boss-kit source; repair Motoko pools; honest retire UI | P1 |
| SDA-2026-09-21-012 | Achievement / challenge `spellRewardIds` on the existing whitelist | P1 |
| SDA-2026-09-21-013 | Draft / validate / activate / rollback / compare / duplicate | P1 |
| SDA-2026-09-21-014 | Persist bar from ownership, not only upgrade keys | P1 |
| SDA-2026-09-21-015 | Extract SpellEditor into `useSpellQueries` landing; do not grow WX | P1 |
| SDA-2026-09-21-016 | New later EOP file after `20260901` for any new spell persist maps | P0 |
