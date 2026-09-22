# Spell, Discovery & Achievement Admin Design — 2026-09-22 re-audit

**Author:** Spell, Discovery & Achievement Admin Designer  
**Automation:** `4efa22ec-a498-11f1-a7d1-d6b4613131ce`  
**Date:** 2026-09-22  
**HEAD audited:** `0f5363f` (`Merge pull request #332`)  
**Scope:** Owner tooling for the complete spell ecosystem. **No production code in this PR.**

This is a **delta** on [`SPELL_ADMIN_DESIGN_2026-08-31.md`](./SPELL_ADMIN_DESIGN_2026-08-31.md) (#116) and the 09-01 / 09-02 re-audits. The 09-21 re-audit is still **open, unmerged** as [#353](https://github.com/Mr-Melic/stralt/pull/353) (`SPELL_ADMIN_DESIGN_2026-09-21.md`, `ACTION_IDS_SDA_2026-09-21.md`). Sections 2–11 of the 08-31 document remain the contract (canonical `SpellDefinition`, acquisition routes, observe→win→unlock, CORE–SIGNATURE pools, dependency views, soft-retire + already-owned legacy, studio tabs, persist sketch). This run does **not** replace that contract and does **not** overwrite #353’s files.

It records that live code at `0f5363f` is unchanged since 09-21, what the oldest-first queue will change when it lands, and the ACTION_IDs in [`ACTION_IDS_SDA_2026-09-22.md`](./ACTION_IDS_SDA_2026-09-22.md).

Do not implement those IDs unless a human or orchestrator picks one. Do not grow `WorldExploration.tsx` (19 213 lines). Do not grow `AdminDashboard.tsx` (8 280 lines). Never introduce spell-name heuristics.

---

## 1. Why this run exists

`origin/main` is still `0f5363f`. Nineteen days of 09-02 findings plus the 09-21 empty-AI close are still true. What changed overnight is the **queue**: oldest-first merge is no longer “#327 then #331.” It is **#327 through #391** (and growing). Four siblings will mutate the spell-admin surface without shipping the studio:

| Sibling | What it actually does | How it must not be misread |
| :--- | :--- | :--- |
| [#353](https://github.com/Mr-Melic/stralt/pull/353) (older SDA docs) | Adds 09-21 design + ledger; pointer edits on 08-31 / 09-01 / 09-02 | Union: this PR **adds** 09-22 files only. Do not rewrite 09-21. |
| [#341](https://github.com/Mr-Melic/stralt/pull/341) | Hide × on built-in ids; `adminSpellDeleteBlockedReason` copies Motoko’s “set `usableByPlayer=false` to retire it” | Confirm/delete UX on the **wrong field**. Not lifecycle (001). Union `adminSafety.ts` / `useSpellQueries.ts` / `AdminDashboard.tsx`. |
| [#384](https://github.com/Mr-Melic/stralt/pull/384) (and #374) | `effectParams` must be well-formed JSON; last-good JSON `*Prev` | Closes **one** remaining clamp-drift cell. Not the activate gate (006). |
| [#388](https://github.com/Mr-Melic/stralt/pull/388) | Hydrate combat spell levels from canister `spellLevelKeys`/`Values` only | Honest **levels**, not ownership. Empty keys must not wipe `ownedSpellIds` after 003. |
| [#371](https://github.com/Mr-Melic/stralt/pull/371) / [#342](https://github.com/Mr-Melic/stralt/pull/342) | Wave-4 unique/tactical ids (design only) | Those ids must stay **unowned** until observe→win / ELITE / `triune_gallery`. Seed 007 must not grant them. |
| [#334](https://github.com/Mr-Melic/stralt/pull/334) | Honest tier leftover copy | Explicitly **did not** add a summon editor. |
| [#327](https://github.com/Mr-Melic/stralt/pull/327) / [#331](https://github.com/Mr-Melic/stralt/pull/331) | Striker range; portal destack | Both touch `WorldExploration.tsx`; #327 also `enemyAI.ts`. Union, one `export function` per name. |

`usableByPlayer = false` is still the live retire path. Extending it is still forbidden. #341 will **freeze the wrong copy into the client** if 001 is not sequenced after it.

---

## 2. Current state (verified against `origin/main` @ `0f5363f`)

Same live facts as 09-21. Re-read; do not rediscover.

### 2.1 Landed (do not redo)

| Change | Where | What it actually does |
| :--- | :--- | :--- |
| Bindgen summon block | `backend.ts` 118–152; `adminContract.ts` | 09-01-002 **LANDED**. |
| Motoko + client reject empty `summonAI` when `isSummon` | `adminGuard.mo` 423–426; `adminSafety.ts` 626–629 | 09-02-006 empty-AI half **LANDED**. Combat still does `spell.summonAI \|\| "hunter"` (`summonSpawn.ts` 139). |
| `spellType` / `effectType` accept `"summon"` | `adminGuard.mo` 348–355; `adminSafety.ts` 611–624 | Validator enum grew. **Editor `<select>` did not** (damage / heal / drain only at `AdminDashboard.tsx` 2684–2687). |
| Achievement conditions whitelist | `adminGuard.mo` 515–531 | 15 string keys. Still **Doka-only** (`AchievementConfig` 249–256). |
| Save + mutation both clamp | `AdminDashboard.tsx` 3547–3565; `useSpellQueries.ts` 64–81 | Payload clamp. Not `targetType`, not acquisition, not lifecycle. Live delete mutation (`useSpellQueries.ts` 94–108) has **no** built-in client block yet (#341 pending). |
| Appearance cannot mint levels | `resolveAppearanceSpellLevels` `adminSafety.ts` 686–698 | Does not create `ownedSpellIds`. |
| Wallet/level feats defer until `applyRewards` | `adminSafety.ts` 392 | Still Doka. |
| Config rollback for some maps | `adminRollbackLevelUpConfig` / `GameConfig` / `TierSpawnConfig` / `ColorPalette` / `BossRushConfig` | **No** `adminRollbackSpellConfig`. Spell Save is a live overwrite (`main.mo` 869–880). |

### 2.2 Still missing (08-31 studio)

| Gap | Evidence @ `0f5363f` |
| :--- | :--- |
| Catalog ≠ ownership | `ownedSpells` = all `starterSpells` (forced `isBaseSpell`) ∪ every backend row with `usableByPlayer !== false` (`WorldExploration.tsx` 2395–2440). 32 frontend ids in `spellData.ts` are pre-owned. `Character` (`main.mo` 122–145) has `spellLevelKeys` / `spellBarOrder` only. Leftover `activeSpells : ?[Nat]` is **not** the owned set. |
| Observation / unlock persist | No `ownedSpellIds`, `observedSpellIds`, `recordSpellObservation`, or `commitSpellDiscoveries`. Recap is XP/Doka/feats (`newlyUnlockedAchievements` only). |
| Acquisition routes + three flags | Only `usableByPlayer` / `usableByEnemy` (`admin.mo` 117–118). No `ENEMY_DISCOVERY` / `ACHIEVEMENT` / `CHALLENGE` / `BOSS` / `ELITE` / `SPECIAL_ENCOUNTER` / `MULTI_SOURCE` / `ENEMY_ONLY` / `BOSS_ONLY` / `SYSTEM_ONLY`. No `OBSERVATION_REQUIRED` / `VICTORY_REQUIRED` / `PLAYER_LEARNABLE`. |
| Enemy pools | `ENEMY_KITS` is `Record<ChessPieceType, …>` (`enemyAI.ts` 163–185). Battle start comments “10 random spells” then `buildEnemyKit(enemy.pieceType, currentMap.levelZone)` (`WorldExploration.tsx` 11915–11923). Admin `EnemyConfig` has no spell list (`admin.mo` 15–26). |
| Zone always 0 | `currentMap.levelZone` is `{ name, minLevel, maxLevel }` (4683, 5234, 5439, 5517, 13514, 13646). `Math.floor(levelZone)` is `NaN`; every kit stays zone 0. `longHorizonSim.ts` 51–78 **documents** the NaN and still `Math.floor`s a second copy. |
| Achievement / challenge spell grants | Doka-only feats. Challenges `{ doka, xp, badge }` (`challengeCompletion.ts` 27). |
| Name heuristics | `OLD_SPELL_NAMES_SET` matches **name and id** (WX 2356–2389), including live `physical_attack`. `summonSpawn.ts` 165: `spell.name.replace("Summon ", "")`. `inferSummonArchetype` (`enemyAI.ts` 218–224) falls back to `summon.name`. Editor “Heal (targets self)” (2685) infers targeting from `spellType`. |
| Starter catalog vs canister | Combat: 32 ids in `spellData.ts`. Canister seed: six other ids (`admin.mo` 168–191). `physical_attack` is in `OLD_SPELL_IDS` (`main.mo` 689–697) **and** the name tombstone. |
| Live id in the tombstone | Zone-0 pawn/knight/rook kits request Strike; `normalizedSpellPool` strips it. Empty unless summoner roll appends wolf/archer (WX 11932–11942) via `starterSpells.find(id === "summon-dire-wolf")`. |
| Bar persist | `setSpellBarOrder` keeps only `spellLevelKeys` (`main.mo` 1945–1947). Never-upgraded starters drop off the persisted bar. |
| Draft / version / rollback | No revision store. `newSpell()` ids are `spell_${Date.now()}` (86). |
| Enemy hard delete | `adminDeleteEnemyConfig` is `remove` (`main.mo` 798–805). |
| Three boss kit sources | Live `data/bossKits.ts`; Motoko `defaultBossConfigs()` still lists purged ids (`admin.mo` 350+; Crimson Countess mixes live `physical_attack` with purged `blood_nova` at 376–379); Admin chips `getSpellConfigs()` (`AdminDashboard.tsx` 7750). |
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

## 3. Superseding rule: lifecycle ≠ `usableByPlayer`

Unchanged from 08-31 §4 / §8 and 09-01 §3. Restated because #341 will copy the Motoko error string into a client constant.

| Field | Meaning | Must not mean |
| :--- | :--- | :--- |
| `usableByPlayer` | Cast/equip gate **after** ownership (and `minLevel`) | Retired, ENEMY_ONLY, draft, hidden |
| `usableByEnemy` | Hostile AI may resolve this id | Learnable, in a pool, or published |
| `lifecycle` | `draft \| active \| inactive \| retired` | Anything about who can cast |
| `PLAYER_LEARNABLE` | May enter `ownedSpellIds` | `usableByPlayer` |
| `acquisition.route` | How a player learns it | Inferred from the two usable flags |

`ENEMY_ONLY` / `BOSS_ONLY`: `PLAYER_LEARNABLE = false`, `usableByEnemy = true`, `lifecycle = active`. Players never own them. Setting `usableByPlayer = false` on those ids is **correct as a cast gate** and **wrong as the only retire signal**.

Live retire (`main.mo` 882–902): built-in six cannot be deleted (`adminGuard.mo` 21–24); if `_spellReferencedByPlayers` then `{ existing with usableByPlayer = false }`; else `spellConfigs.remove`. Error copy still says “set usableByPlayer=false to retire it” (887). Confirm dialog still claims immediate remove (3791–3795). Toast is always `"Spell deleted"` (6166).

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

A new Admin spell with default `usableByPlayer: true` (`newSpell()` 98) is still granted to every account on next hydrate. `usableByPlayer: false` hides the id unless it already appears on keys/bar — a **retire carve-out**, not an ownership split.

Migration when ownership is implemented: seed `ownedSpellIds` from `SYSTEM_ONLY` / innate four ∪ `spellLevelKeys` ∪ resolving `spellBarOrder` ids. Innate four: `physical_attack`, `starter-shield`, `starter-poison`, `starter-heal`. **Do not** grant `getSpellConfigs()`. **Do not** grant the full `starterSpells` array. **Do not** grant Wave-4 unique ids from #371/#342.

#388 (pending) makes empty `spellLevelKeys` mean “no paid levels.” After 003 that must **not** mean “no owned spells.”

Any of those maps is a **new later** EOP file after `20260901` (016).

---

## 5. Required definition fields (activate gate)

A definition cannot leave `draft` → `active` unless:

- id (`^[a-z][a-z0-9_-]{1,47}$`), name, description — **not** `spell_${Date.now()}` as a published id
- `targetType` (`self | ally | enemy | ground | area | line | chain | all`)
- `minRange` ≤ `maxRange` ≤ 20
- `apCost` 0–12; `0` legal only with `isTimestep` or explicit `allowZeroAp` (not a name check)
- `cooldown` 0–10 (editor field exists at 2652–2656; keep it)
- at least one explicit effect (typed variant or today’s metadata flags — never `spell.name`)
- if summon: complete `SummonUnitDef` including `summonAI` enum, `displayName`, `summonKit` (id list), `freeCells`, `targetType = ground`
- if enemy-usable: pool membership **or** an explicit `ENEMY_ONLY` / `BOSS_ONLY` route with a kit/boss ref
- acquisition block filled (`ENEMY_DISCOVERY` default + `OBSERVATION_REQUIRED` / `VICTORY_REQUIRED` / `PLAYER_LEARNABLE`)
- no name-heuristic fields

`validateSpellConfig` today is a payload clamp, not this gate. Remaining client/Motoko drift after the empty-AI close:

- Motoko also checks `mpCost`, `cooldown`, `damage`, `healAmount`, `minLevel`, `hitTiles` size, `effectParams` **length** (`adminGuard.mo` 383–418). Client (578–660) does **not**.
- Live Motoko `effectParams` is length-only. #384 will require well-formed JSON — **do not duplicate** that slice in 006.
- AP `< 1` is still illegal on both sides (blocks Timestep). Editor already exposes `isTimestep` (3434).

Client and Motoko must return the **same** error strings.

---

## 6. Acquisition, discovery, pools (contract pointer)

Unchanged from 08-31 §§4–6. Wave-4 SDE (#371) stamps generations and unused doors; it does **not** replace this admin contract.

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

Summoner extras stay a kit field `bonusSummonSpellIds`. No hardcoded `starterSpells.find`.

`resolveEnemyKit` must receive a **numeric** zone (or `minLevel`), not the LevelZone object. Combat **and** `longHorizonSim.ts` must share one helper.

Achievement spell grants attach to the **existing** 15 `knownAchievementCondition` keys. Do not invent a free-text condition. Do not restamp `unstoppable` / `level_10` as a spell door.

---

## 7. Dependency scan that cannot see the graph

`_spellReferencedByPlayers` (`main.mo` 273–284) only walks character level keys and bar slots. It cannot see Motoko `spellPoolIds`, `data/bossKits.ts`, `ENEMY_KITS`, achievement/challenge reward ids, summon kits, or catalog-union “owned” ids.

Required inspector (08-31 §7), computed from **ids**:

- Spell → enemies, achievements, challenges, bosses, AI/summon kits, acquisition routes.
- Achievement → conditions (whitelist only), `spellRewardIds`, `requiresAchievementIds` / `requiresSpellIds`.

Same retire-vs-delete rule for achievements and enemy configs.

---

## 8. Owner UI (dev-gated — still the 08-31 studio)

Live tabs (`AdminDashboard.tsx` 5611–5626): Enemies, Regions, Player Sprites, Spells, Map Modifiers, Enemy Tiers, Visuals, Settings, Purchases, Achievements, Enemy Names, Bosses, Ad Boxes, Shop, Boss Rush.

Missing studio tabs: Library (lifecycle/route filters), Discovery, Kits, Feats-as-graph, Graph, Versions.

Carved-stone / slate / crimson. Same `#admin` + lazy `AdminDashboard` gate.

Immediate UI honesty (can land with persist 001/004, not a restyle):

- Delete on published ids is **Retire**. Confirm lists dependents. Toast must say retired vs rejected vs draft-deleted.
- Cast-gate checkboxes stay labeled “player may cast” / “enemy may cast.” Lifecycle is a separate control.
- Validation strip: missing `targetType`, broken kit id, name-heuristic leftover = crimson.
- Spell Type includes `summon`. Summon section: `summonAI`, lifespan, piece, scales, **displayName**, kit ids.
- Heal is `targetType`, not the option text “Heal (targets self)”.
- If #341 has landed: keep the built-in × hide; **rewrite** `BUILT_IN_SPELL_DELETE_BLOCKED` so it does not teach `usableByPlayer=false` as retire.

Do not grow the 8 280-line dashboard until activate exists on the canister. Extract `SpellEditor`. Keep admin writes in `useSpellQueries.ts`. Do not grow `WorldExploration.tsx`. Union overlapping siblings; keep one `export function` per name.

---

## 9. Prior ACTION_ID status @ `0f5363f`

### 08-31 / 09-01 / 09-02 / 09-21

Unchanged from 09-21 §10 except: 09-21 IDs are **OPEN on unmerged #353**. Treat 09-22 IDs as the current first cuts once this file exists; do not implement both 09-21-00N and 09-22-00N as separate work.

| ID class | Status | Note |
| :--- | :--- | :--- |
| 08-31-001 | **PARTIAL** | Cooldown + summon **block**. No `targetType` / complete unit def / editor. |
| 08-31-002 … 004, 006 … 013 | **OPEN** | Ownership, discovery, pools, bar, versions. |
| 08-31-005 | **PARTIAL / WRONG FIELD** | Soft-retire = `usableByPlayer=false`. #341 will harden the copy. |
| 09-01-002 | **LANDED** | Bindgen summon fields. Do not re-do. |
| 09-02-006 empty-AI | **LANDED** | Motoko + client. Remaining clamp drift + AP 0 + activate gate OPEN. #384 pending for `effectParams` JSON. |
| 09-21-001 … 016 | **OPEN (#353)** | Same substance as 09-22-001 … 016. |

Next implementer: **09-22-001**, then **007**, then **003**. Any persist map is **016**. Union **017** when touching delete UX. Do not pre-own Wave-4 uniques (**018**). Do not treat #388 empty keys as no ownership (**019**). Do not re-implement #384 JSON (**020**).

---

## 10. Out of scope

- Production TypeScript / Motoko / Candid in this PR
- RAF, map generation, turn logic, damage math
- Growing `WorldExploration.tsx` or `AdminDashboard.tsx`
- Re-authoring Wave-1–4 spell cards (`SPELL_DISCOVERY_ECOSYSTEM_*`, #371, #342) or boss adaptations
- Treating `adminSafety.ts` helpers or #341 delete-block as the finished lifecycle
- Re-opening 09-01-002 bindgen work or the empty-AI Motoko reject
- Editing Cursor dashboard prompts (no write API)
- Overwriting #353’s 09-21 files or 08-31 / 09-01 / 09-02 pointer hunks

---

## 11. ACTION_ID index (this run)

All items: `STATUS: NEW`. Full records: [`ACTION_IDS_SDA_2026-09-22.md`](./ACTION_IDS_SDA_2026-09-22.md).

| ID | Title | Priority |
| :--- | :--- | :--- |
| SDA-2026-09-22-001 | Separate lifecycle from `usableByPlayer` | P0 |
| SDA-2026-09-22-002 | Persist complete combat `SummonUnitDef`; drop hunter default | P0 |
| SDA-2026-09-22-003 | Stop treating the library helper as ownership | P0 |
| SDA-2026-09-22-004 | Real dependency report; hard-delete only drafts | P0 |
| SDA-2026-09-22-005 | Persist `targetType` (including `chain`) and combat mechanic flags | P0 |
| SDA-2026-09-22-006 | Shared activate-gate validator (close remaining clamp drift) | P1 |
| SDA-2026-09-22-007 | Seed starters; stop purging and tombstoning live `physical_attack` | P0 |
| SDA-2026-09-22-008 | Replace remaining name heuristics (including “Heal targets self”) | P0 |
| SDA-2026-09-22-009 | Acquisition flags + observe→win→unlock | P0 |
| SDA-2026-09-22-010 | Admin-authored CORE–SIGNATURE pools; numeric zone; one kit helper | P1 |
| SDA-2026-09-22-011 | One boss-kit source; repair Motoko pools; honest retire UI | P1 |
| SDA-2026-09-22-012 | Achievement / challenge `spellRewardIds` on the existing whitelist | P1 |
| SDA-2026-09-22-013 | Draft / validate / activate / rollback / compare / duplicate | P1 |
| SDA-2026-09-22-014 | Persist bar from ownership, not only upgrade keys | P1 |
| SDA-2026-09-22-015 | Extract SpellEditor into `useSpellQueries` landing; do not grow WX | P1 |
| SDA-2026-09-22-016 | New later EOP file after `20260901` for any new spell persist maps | P0 |
| SDA-2026-09-22-017 | Union #341 delete-block; do not freeze `usableByPlayer` as retire copy | P0 |
| SDA-2026-09-22-018 | Wave-4 unique ids stay unowned until their acquisition route | P0 |
| SDA-2026-09-22-019 | Canister-array level hydrate (#388) is not the owned set | P1 |
| SDA-2026-09-22-020 | Do not re-implement #384 `effectParams` JSON; remaining clamp list | P1 |
