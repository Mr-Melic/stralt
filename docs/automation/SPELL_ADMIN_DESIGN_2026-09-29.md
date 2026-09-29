# Spell, Discovery & Achievement Admin Design — 2026-09-29 re-audit

**Author:** Spell, Discovery & Achievement Admin Designer  
**Automation:** `4efa22ec-a498-11f1-a7d1-d6b4613131ce`  
**Date:** 2026-09-29  
**HEAD audited:** `0f5363f` (`Merge pull request #332`) — unchanged since the 09-21 re-audit  
**Scope:** Owner tooling for the complete spell ecosystem. **No production code in this PR.**

This is a **delta** on [`SPELL_ADMIN_DESIGN_2026-08-31.md`](./SPELL_ADMIN_DESIGN_2026-08-31.md) (#116). Sections 2–11 of that document remain the studio contract (canonical `SpellDefinition`, acquisition routes, observe→win→unlock, CORE–SIGNATURE pools, dependency views, soft-retire + legacy owned, studio tabs, persist sketch). 09-01 / 09-02 deltas still stand (bindgen 09-01-002 LANDED; empty-AI half of 09-02-006 LANDED).

It records what is still the wrong field on `main`, and the ACTION_IDs in [`ACTION_IDS_SDA_2026-09-29.md`](./ACTION_IDS_SDA_2026-09-29.md) (**099–115** only).

**Do not overwrite** still-open sibling files:

| PR | Files | IDs |
| :--- | :--- | :--- |
| [#353](https://github.com/Mr-Melic/stralt/pull/353) | `SPELL_ADMIN_DESIGN_2026-09-21.md`, `ACTION_IDS_SDA_2026-09-21.md` | 09-21 001–016 |
| [#398](https://github.com/Mr-Melic/stralt/pull/398) | 09-22 pair | 09-22 |
| [#473](https://github.com/Mr-Melic/stralt/pull/473) | 09-23 pair | **First-cuts `SDA-2026-09-23-001` … `028`** |
| [#515](https://github.com/Mr-Melic/stralt/pull/515) | 09-24 pair | 029–040 |
| [#570](https://github.com/Mr-Melic/stralt/pull/570) | 09-25 pair | 041–055 (includes #568 linear⊕diagonal) |
| [#630](https://github.com/Mr-Melic/stralt/pull/630) | 09-26 pair | 056–069 |
| [#677](https://github.com/Mr-Melic/stralt/pull/677) | 09-27 pair | 070–083 |
| [#729](https://github.com/Mr-Melic/stralt/pull/729) | 09-28 pair | 084–098 |

Do not implement those IDs unless a human or orchestrator picks one. Do not grow `WorldExploration.tsx` (19 213 lines). Never introduce spell-name heuristics. Next implementer still starts at **09-23-001**, then **007**, then **003+023**. Do not land Wave-9 / 10 / 11 catalog rows before 003. Persist maps go through **09-23-016** (new later EOP file after `20260901`; `check-limit = 5` today). Do not extend the `usableByPlayer=false` retire path.

---

## 1. Why this run exists

09-28 closed the queue through #724 (owner-lifecycle **copy** helpers ≠ persist `lifecycle`). Same `HEAD`. The product hole is unchanged: catalog still grants, discovery still does not exist, retirement is still a cast flag.

What *is* new is the flock after #729: Wave-11 discovery (#747), Wave-11 tactical (#726), Wave-11 elite CORE (#752), Wave-12 boss sheets (#753), last-live achievement catalog (#733 / AFDA-034), another WX extract (#730), and several combat PRs that must persist as **metadata**, not names.

The 08-31 contract is still the destination. The 09-29 IDs are queue-union only. Do not mint a second 001–098.

---

## 2. Current state (re-verified against `origin/main` @ `0f5363f`)

### 2.1 Still true — do not rediscover as new

| Fact | Where (this HEAD) |
| :--- | :--- |
| Bindgen + `toBackendSpellConfig` include Motoko summon fields | `backend.ts`; `adminContract.ts`. 09-01-002 **closed**. Motoko `SummonUnitDef` is still `pieceType` / `level` / `hpScale` / `damageScale` (`admin.mo` 85–90). Combat also needs `summonKit` / `ap` / `mp` (`summonSpawn.ts` 22–32). |
| Motoko + client reject empty `summonAI` when `isSummon` | `adminGuard.mo` 423–426; `adminSafety.ts` 625–629. Runtime still does `spell.summonAI \|\| "hunter"` and `inferSummonArchetype` still falls back to `summon.name` (`enemyAI.ts` 217–224). |
| Validators accept `spellType="summon"` | `adminGuard.mo` 348–349; `adminSafety.ts` 18. Editor `<select>` is still damage / heal / drain (`AdminDashboard.tsx` 2684–2686). “Heal (targets self)” is a targeting lie — `targetType` has **zero** editor matches. |
| Lifecycle is still `usableByPlayer=false` | `adminDeleteSpellConfig` (`main.mo` 882–901) error copy still says “set usableByPlayer=false to retire it” (887). Soft-retire writes that flag when `_spellReferencedByPlayers` (273–284, **keys+bar only**). Else `remove`. |
| `upgradeSpell` treats the same flag as “Spell is retired” | `main.mo` 1011–1012. Owned-but-never-upgraded ids are not in `spellLevelKeys`, so the check blocks the legacy upgrade 08-31 §8.2 requires. Appearance cannot mint keys (`resolveAppearanceSpellLevels`, `adminSafety.ts` 686–698). |
| Library helper is still inverted | `shouldIncludeBackendSpellInLibrary` (`adminSafety.ts` 711–718) returns true when `usableByPlayer !== false`. Wired at `WorldExploration.tsx` 2412–2430. `ownedIds` is `starterSpells` ∪ `spellLevelKeys` ∪ `spellBarOrder`. All 32 frontend ids are forced `isBaseSpell: true` (2395–2408). |
| No observation / unlock persist | No `ownedSpellIds`, `observedSpellIds`, `recordSpellObservation`, `commitSpellDiscoveries`. Recap is still XP / Doka / feats. |
| No acquisition enum / three flags | Only `usableByPlayer` / `usableByEnemy` (`admin.mo` 117–118). No `ENEMY_DISCOVERY` … `SYSTEM_ONLY`. No `OBSERVATION_REQUIRED` / `VICTORY_REQUIRED` / `PLAYER_LEARNABLE`. |
| Enemy pools hardcoded; zone always 0 | `ENEMY_KITS` is `Record<ChessPieceType, …>` (`enemyAI.ts` 163–185). `buildEnemyKit(enemy.pieceType, currentMap.levelZone)` (`WorldExploration.tsx` 11920) passes `{ name, minLevel, maxLevel }` (4683–4687). `Math.floor` is `NaN`; every kit stays zone 0. Admin `EnemyConfig` has no spell list (`admin.mo` 15–26). |
| Achievement / challenge still Doka-only | `AchievementConfig` is `{ id, name, description, dokaReward, condition, active }` (`admin.mo` 249–256). `defaultAchievements()` 309–326 is 15 Doka rows. `DEFAULT_CHALLENGES` is `{ doka, xp, badge }`. Conditions are a 15-key whitelist. |
| Name heuristics still live | `OLD_SPELL_NAMES_SET` matches **name and id**, including live `physical_attack` (`WorldExploration.tsx` 2356–2389). Same id is in `OLD_SPELL_IDS` purge (`main.mo` 689–697). `summonSpawn.ts` 165: `spell.name.replace("Summon ", "")`. |
| Three boss kit sources | Live combat: `data/bossKits.ts`. Motoko `defaultBossConfigs()` still lists purged ids (`admin.mo` 358+ `fireball`, `blood_nova`, `poison_dart`, …). Admin chips: `getSpellConfigs()`. |
| Bar persist still upgrade-keys only | `setSpellBarOrder` filters to `spellLevelKeys` (`main.mo` 1945–1947). |
| Spell Save is a live overwrite | `adminSetSpellConfig` (`main.mo` 869–879). No `adminRollbackSpellConfig`. Other configs have rollback. |
| Enemy hard delete | `adminDeleteEnemyConfig` (`main.mo` 798–804) is unconditional `remove`. |
| Achievement delete | Progress present → `active=false`; else `remove` (`main.mo` 2389–2408). Unlock rejects retired (`markAchievementUnlocked` 2473). **No last-live catalog guard on `main`.** |
| Activate gate is still a payload clamp | Both validators reject `apCost < 1` (`adminGuard.mo` 380–382; `adminSafety.ts` 604–606) — live Timestep is `apCost: 0`. No `targetType`, no acquisition, no name-heuristic scan. Closed `knownSummonAI` / `knownPieceType` still omit `font` / `dummypost` / `pentaspan` / `septspan`. |
| Write landing | `useSpellQueries.ts` (293 lines) already calls `validateSpellConfig` (57–80). Extract `SpellEditor` here. Do not grow `AdminDashboard.tsx` (8 280 lines) until activate exists. |
| New stables | Later EOP file after `20260901`; bump `check-limit` (today **5**). Never amend a shipped `NewActor`. |

`newSpell()` (`AdminDashboard.tsx` 85–134) still seeds cooldown + mechanic bools + empty summon fields and **omits `targetType`**. Default `usableByPlayer: true` still hydrates every account.

Delete confirm (`AdminDashboard.tsx` 3791–3794) still says the live spell is **removed immediately** and dependents **will break**. Toast is always `"Spell deleted"` (6166). Backend may have only flipped a bool.

Live tabs (5611–5626): Enemies, Regions, Player Sprites, Spells, Map Modifiers, Enemy Tiers, Visuals, Settings, Purchases, Achievements, Enemy Names, Bosses, Ad Boxes, Shop, Boss Rush. Still no Library / Discovery / Kits / Feats-as-graph / Graph / Versions.

### 2.2 Required definition fields (activate gate — unchanged)

A definition cannot leave `draft` → `active` unless:

- id (`^[a-z][a-z0-9_-]{1,47}$`), name, description
- `targetType` (`self | ally | enemy | ground | area | line | all`)
- `minRange` ≤ `maxRange` ≤ 20
- `apCost` 0–12; `0` legal only with `isTimestep` or explicit `allowZeroAp` (not a name check)
- `cooldown` 0–10
- at least one explicit effect (typed variant or today’s metadata flags — never `spell.name`)
- if summon: complete `SummonUnitDef` including `summonAI` enum, `displayName`, `summonKit` (id list), `freeCells`, `targetType = ground`
- if enemy-usable: pool membership **or** an explicit `ENEMY_ONLY` / `BOSS_ONLY` route with a kit/boss ref
- acquisition block filled (`ENEMY_DISCOVERY` default + `OBSERVATION_REQUIRED` / `VICTORY_REQUIRED` / `PLAYER_LEARNABLE`)
- no name-heuristic fields
- Linear ⊕ Diagonal rejected (queued #568 / 09-25-055) as a **separate** axis-flag helper

`validateSpellConfig` today is a payload clamp, not this gate.

### 2.3 Acquisition, discovery, pools (contract pointer)

Unchanged from 08-31 §§4–6:

```
eligible unknown spell
  → enemy kit actually contains the id
  → enemy successfully casts it (WX-applied kind === "cast" that spent AP)
  → observed (persist)
  → player wins that encounter
  → ownedSpellIds + root recap
```

Routes: `ENEMY_DISCOVERY` | `ACHIEVEMENT` | `CHALLENGE` | `BOSS` | `ELITE` | `SPECIAL_ENCOUNTER` | `MULTI_SOURCE` | `ENEMY_ONLY` | `BOSS_ONLY` | `SYSTEM_ONLY`.

Flags on every definition: `OBSERVATION_REQUIRED`, `VICTORY_REQUIRED`, `PLAYER_LEARNABLE`.

Pools: `CORE` | `ADVANCED` | `RARE` | `ELITE` | `SIGNATURE`.

Possession is not observation. Player-side summons do not observe. Hostile summons may. `upgradeSpell` is never the grant writer. Innate seed is **four ids only:** `physical_attack`, `starter-shield`, `starter-poison`, `starter-heal`.

`resolveEnemyKit` must receive a **numeric** zone (or `minLevel`), not the LevelZone object.

### 2.4 Dependency safety + legacy owned (unchanged)

| Field | Meaning | Must not mean |
| :--- | :--- | :--- |
| `usableByPlayer` | Cast/equip gate **after** ownership (and `minLevel`) | Retired, ENEMY_ONLY, draft, hidden |
| `usableByEnemy` | Hostile AI may resolve this id | Learnable, in a pool, or published |
| `lifecycle` | `draft \| active \| inactive \| retired` | Anything about who can cast |
| `PLAYER_LEARNABLE` | May enter `ownedSpellIds` | `usableByPlayer` |
| `acquisition.route` | How a player learns it | Inferred from the two usable flags |

**Already-owned retired spells** (08-31 §8.2):

1. Do not strip `ownedSpellIds`, `spellLevelKeys` / `spellLevelValues`, or `spellBarOrder`.
2. `setSpellBarOrder` keeps the id if owned (not “must be in `spellLevelKeys`” and not “must be `usableByPlayer`”).
3. `upgradeSpell` stays legal for owned retired ids. New players cannot obtain the id.
4. Spellbook shows a Retired seal. Combat reads the frozen `retiredRevision`.
5. New achievement grants skip a retired reward id and still pay Doka.
6. Live kits ignore retired ids at resolve time (log once). Activate of a kit that still lists them is blocked.

Hard delete remains legal **only** for `draft` with zero published revisions and zero refs (players, kits, bosses, achievements). Otherwise `#err` + dependency report.

Required inspector (08-31 §7), computed from **ids**:

- Spell → enemies, achievements, challenges, bosses, AI modules, acquisition routes.
- Achievement → conditions, `spellRewardIds`, `requiresAchievementIds` / `requiresSpellIds`.

---

## 3. Queue since #729 (do not treat as landed)

Older still-open PRs merge first (`createdAt` ascending). Oldest still-open is **#368**, then **#327** / **#331**, then #333+. Union overlapping files; one `export function` per name.

SDA-relevant additions **after** 09-28-098:

| PR | What it is | Studio rule |
| :--- | :--- | :--- |
| [#747](https://github.com/Mr-Melic/stralt/pull/747) | Wave-11 SDE, `generationMin: 11`. Unique §11: `spell-diag-stride` … `spell-dry-mend`, plus `spell-pack-long` (`ENEMY_ONLY`) and `spell-adj-fold` (`BOSS_ONLY`). | Do not pre-own. Do not clone #726 / #695 / #646 holes. |
| [#726](https://github.com/Mr-Melic/stralt/pull/726) | Wave-11 tactical: `spell-heave-mend` … `spell-court-dual`. `spell-court-dual` is `NOT_PLAYER_LEARNABLE`. `spell-sept-span` is plus-7 occupy; live summon cap is still 2. Extra doors `heave_cantor` / `dual_bursar` / `span_sept` / `halve_precentor` / `court_dual_regent`. | Stamp, do not clone. Court Dual never owned. Do not activate Sept Span until occupy-weight / cap exists. `knownSummonAI` must not grow via a name parse. |
| [#752](https://github.com/Mr-Melic/stralt/pull/752) | Wave-11 elite CORE from #695 + leftover #646 unique CORE. Court Keep / Pack Stride / Knight Fold / Pack Close / Mid Fold / Court Dual stay closed. | Honour CORE–SIGNATURE **ids**. Zone NaN still hides ADVANCED. |
| [#753](https://github.com/Mr-Melic/stralt/pull/753) | Wave-12 boss sheets + Rush Table J. Arena verbs stay `BOSS_ONLY`. | Closed signatures never enter `ownedSpellIds`. Do not add a fourth kit source. |
| [#733](https://github.com/Mr-Melic/stralt/pull/733) | `achievementLastLiveRejected` — cannot empty the live achievement catalog. Prefer this over a second helper. AFDA-2026-09-28-034. | Same class as last-live map-modifier chance 0 (09-28-096) and spell hard-delete. Spells still have **no** last-live catalog guard. |
| [#741](https://github.com/Mr-Melic/stralt/pull/741) | Admin drift ledger. Last-live achievement finding points at #733. | Do not restack AdminDashboard honesty hunks. |
| [#730](https://github.com/Mr-Melic/stralt/pull/730) | Extract ambient occlusion from WX into `engine/ambientOcclusion.ts`. | Discovery helpers stay in `engine/*` / `utils/*`. Union #327 / #331 / #639 / #683 / #730. |
| [#754](https://github.com/Mr-Melic/stralt/pull/754) | Swap landings pay walk/hazard tax. | Persist as Swap metadata, not `if (spell.name === "Swap")`. Not a grant. |
| [#766](https://github.com/Mr-Melic/stralt/pull/766) | Chain Lightning bounce once from the clicked primary. | Persist as chain / `targetType` metadata. Not a name table. |
| [#757](https://github.com/Mr-Melic/stralt/pull/757) / [#762](https://github.com/Mr-Melic/stralt/pull/762) | Summon-control highlight + kit AP/range execute gates. | Persist kit range/AP on the unit def (09-23-002). Do not infer from summon display name. |
| [#749](https://github.com/Mr-Melic/stralt/pull/749) / [#758](https://github.com/Mr-Melic/stralt/pull/758) / [#763](https://github.com/Mr-Melic/stralt/pull/763) | Tests lock Pacifist kit offense, landing tax, boss-ability tax. | Metadata categories, not names. |
| [#731](https://github.com/Mr-Melic/stralt/pull/731) | Data-evolution leftover / AP contracts. | Leftover walk / AP is not a spell grant. |
| [#739](https://github.com/Mr-Melic/stralt/pull/739) / [#719](https://github.com/Mr-Melic/stralt/pull/719) / [#737](https://github.com/Mr-Melic/stralt/pull/737) | Encounter admin + Wave-11 world dynamics + Pace/Nail/Flush rooms. | Extra encounter doors are first-grant only. Do not restamp Wave-1…10 feat doors. |
| [#751](https://github.com/Mr-Melic/stralt/pull/751) | Expansion catalog. `unstoppable` / `level_10` stays a Doka milestone. | Leftover feat doors are not grants. |
| [#746](https://github.com/Mr-Melic/stralt/pull/746) | Enemy/boss admin re-audit; **no new EBA IDs**. | Consume EBA IDs; do not add a fourth kit source beside `bossKits.ts` / Motoko pools / Admin chips. |
| [#742](https://github.com/Mr-Melic/stralt/pull/742) / [#756](https://github.com/Mr-Melic/stralt/pull/756) / [#759](https://github.com/Mr-Melic/stralt/pull/759) / [#764](https://github.com/Mr-Melic/stralt/pull/764) / [#767](https://github.com/Mr-Melic/stralt/pull/767) | More `saveBattleStats` skip / leftover-XP honour paths. | Same class as 09-28-095. Not a grant writer. |
| [#769](https://github.com/Mr-Melic/stralt/pull/769) / [#771](https://github.com/Mr-Melic/stralt/pull/771) | Same-hour 09-29 encounter admin + Bash/Dry/Hood rooms. | First-grant only. Do not restamp Wave-1…11 feat doors. |
| [#775](https://github.com/Mr-Melic/stralt/pull/775) | Owner publish-gate / list-sort / editor-chrome **copy** helpers. | Same class as #724 / 09-28-098. AUX labels ≠ persist `lifecycle`. |
| [#778](https://github.com/Mr-Melic/stralt/pull/778) | Data-evolution AP/MP cap, `killCount`, profile replace. | Not a grant path. Honour with 108. |
| [#780](https://github.com/Mr-Melic/stralt/pull/780) | 09-29 drift ledger / name-pool replace. | Do not restack AdminDashboard honesty hunks. |

Still queued (do not re-issue): #564 `SpellSummonFields` (09-25), #568 linear⊕diagonal (09-25-055), #700 / #692 / #699 / #696 / #714 / #707 / #709 / #724 (09-28-088…098), #679 / #695 / #686 (09-28-084…086), #683 (09-28-087).

Same-hour 09-29 flock also opened telemetry / PX / balance / long-horizon docs (#768, #772–#774, #776–#777, #779, #781–#784). Those are not spell-studio work. #783 conflicts on `MASTER_ROADMAP.md` in the oldest-first prefix (pre-existing queue break) — this PR does not touch that file.

---

## 4. Owner UI (dev-gated — still the 08-31 studio)

Carved-stone / slate / crimson. Same `#admin` + lazy `AdminDashboard` gate.

Immediate UI honesty (can land with persist 001/004, not a restyle):

- Delete on published ids is **Retire**. Confirm lists dependents. Toast must say retired vs rejected vs draft-deleted.
- Cast-gate checkboxes stay labeled “player may cast” / “enemy may cast.” Lifecycle is a separate control.
- Validation strip: missing `targetType`, broken kit id, name-heuristic leftover = crimson.
- Spell Type includes `summon`. Summon section: `summonAI`, lifespan, piece, scales, **displayName**, kit ids.

Do not grow the 8 280-line dashboard until activate exists on the canister (08-31 SDA-012 / 09-23-013 / 09-23-015). Extract `SpellEditor` onto `useSpellQueries.ts`. Do not grow `WorldExploration.tsx`. Restack AdminDashboard siblings (#413, #415, #457, #470, #531, #539, #564, #585, #631) as **one** extract.

---

## 5. Prior ACTION_ID status @ `0f5363f`

Unchanged from 09-23 § / 09-28 §:

| Series | Status |
| :--- | :--- |
| 08-31 001 | **PARTIAL** — cooldown + Motoko/bindgen summon **block**. `targetType` / complete unit def / editor summons did not. |
| 08-31 002–004, 006–013 | **OPEN** |
| 08-31 005 | **PARTIAL / WRONG FIELD** — soft-retire is `usableByPlayer=false`. |
| 09-01-002 | **LANDED** — do not re-do bindgen summon fields. |
| 09-02-006 | **PARTIAL** — empty-AI reject landed both sides. Not an activate gate. AP 0 still illegal. Client/Motoko still omit `targetType`. |
| 09-23-001 … 028 | **OPEN** on #473 — **current first-cuts**. |
| 09-24 029–040 | **OPEN** on #515. |
| 09-25 041–055 | **OPEN** on #570. |
| 09-26 056–069 | **OPEN** on #630. |
| 09-27 070–083 | **OPEN** on #677. |
| 09-28 084–098 | **OPEN** on #729. |

---

## 6. Out of scope

- Production TypeScript / Motoko / Candid in this PR
- RAF, map generation, turn logic, damage math
- Growing `WorldExploration.tsx` or concatenating a second `export function` on restack
- Re-authoring Wave-1…11 spell cards or boss adaptations
- Treating `adminSafety.ts` helpers or #724 AUX copy as persist `lifecycle`
- Re-opening 09-01-002 bindgen work
- Re-issuing 09-21…09-28 IDs
- Editing Cursor dashboard prompts (no write API)
- Landing Wave-11 / Wave-12 catalog rows before 09-23-003

---

## 7. ACTION_ID index (this run)

All items: `STATUS: NEW`. Full records: [`ACTION_IDS_SDA_2026-09-29.md`](./ACTION_IDS_SDA_2026-09-29.md).

| ID | Title | Priority |
| :--- | :--- | :--- |
| SDA-2026-09-29-099 | Honour #747 Wave-11 SDE stamps; do not pre-own generationMin 11 ids | P1 |
| SDA-2026-09-29-100 | Stamp #726 Wave-11 tactical; Court Dual never owned | P1 |
| SDA-2026-09-29-101 | Honour #752 Wave-11 elite CORE; zone NaN still hides ADVANCED | P1 |
| SDA-2026-09-29-102 | Union #730 AO extract; do not grow WorldExploration | P1 |
| SDA-2026-09-29-103 | Last-live achievement catalog is the same class as spell hard-delete | P0 |
| SDA-2026-09-29-104 | Persist Swap landing tax as metadata; union #754 | P1 |
| SDA-2026-09-29-105 | Persist Chain Lightning bounce as chain metadata; union #766 | P1 |
| SDA-2026-09-29-106 | Persist summon-control kit AP+range; union #757 / #762 | P1 |
| SDA-2026-09-29-107 | Honour #753 Wave-12 boss / Rush Table J; closed signatures never owned | P1 |
| SDA-2026-09-29-108 | Data-evolution leftover/AP is not a grant path | P1 |
| SDA-2026-09-29-109 | Honour encounter / world-dynamics doors; do not restamp leftover feats | P1 |
| SDA-2026-09-29-110 | Tests lock metadata categories, not names | P1 |
| SDA-2026-09-29-111 | Expansion leftover feat doors stay unused as spell gates | P1 |
| SDA-2026-09-29-112 | Honour #746 enemy/boss admin; do not add a fourth kit source | P1 |
| SDA-2026-09-29-113 | Death-cut remount skips are not a grant path | P1 |
| SDA-2026-09-29-114 | Union #775 owner publish-gate copy; do not treat AUX labels as persist | P1 |
| SDA-2026-09-29-115 | Honour same-hour #769 / #771 encounter doors; first-grant only | P1 |
