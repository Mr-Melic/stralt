# Spell, Discovery & Achievement Admin Design — 2026-10-21 re-audit

**Author:** Spell, Discovery & Achievement Admin Designer  
**Automation:** `4efa22ec-a498-11f1-a7d1-d6b4613131ce`  
**Date:** 2026-10-21  
**HEAD audited:** `0f5363f` (`Merge pull request #332`) — unchanged since the 09-21 re-audit  
**Scope:** Owner tooling for the complete spell ecosystem. **No production code in this PR.**

This is a **delta** on [`SPELL_ADMIN_DESIGN_2026-08-31.md`](./SPELL_ADMIN_DESIGN_2026-08-31.md) (#116). Sections 2–11 of that document remain the studio contract (canonical `SpellDefinition`, acquisition routes, observe→win→unlock, CORE–SIGNATURE pools, dependency views, soft-retire + legacy owned, studio tabs, persist sketch). 09-01 / 09-02 deltas still stand (bindgen 09-01-002 LANDED; empty-AI half of 09-02-006 LANDED).

It records what is still the wrong field on `main`, and the ACTION_IDs in [`ACTION_IDS_SDA_2026-10-21.md`](./ACTION_IDS_SDA_2026-10-21.md) (**116–129** only).

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
| [#791](https://github.com/Mr-Melic/stralt/pull/791) | 09-29 pair | 099–115 |

Do not implement those IDs unless a human or orchestrator picks one. Do not grow `WorldExploration.tsx` (19 213 lines). Never introduce spell-name heuristics. Next implementer still starts at **09-23-001**, then **007**, then **003+023**. Do not land Wave-9 / 10 / 11 / 12 catalog rows before 003. Persist maps go through **09-23-016** (new later EOP file after `20260901`; `check-limit = 5` today). Do not extend the `usableByPlayer=false` retire path.

---

## 1. Why this run exists

The 09-29 run closed the queue through #791 (Wave-11 SDE, Wave-11 tactical, last-live feats, Swap/Chain/summon metadata, remount skips). Same `HEAD`. Calendar is **2026-10-21**. `origin/main` has not moved since 2026-09-03 (`0f5363f`). No new pull request has opened since **#813** (2026-09-29 21:24 UTC). Open queue is **482** drafts.

The product hole is unchanged: catalog still grants, discovery still does not exist, retirement is still a cast flag.

What *is* new for this studio is the same-hour flock **after** #791 that 099–115 did not stamp: Wave-12 discovery (#802), Wave-12 tactical (#787, opened minutes before #791), Wave-12 elite CORE (#796), Wave-13 bosses (#808), EBA 09-29 (#792), WX camera extract (#798), bomber/Inferno kamikaze (#799), spell-level / buff-stack rails (#810), more remount skips, Expansion Ember slayer rungs (#793), Wave-11 formations (#794), AI increment (#804), challenge first-action (#809), leftover-walk item use (#805), and Boss Rush complete(9) (#803).

The 08-31 contract is still the destination. The 10-21 IDs are queue-union only. Do not mint a second 001–115.

---

## 2. Current state (re-verified against `origin/main` @ `0f5363f`)

### 2.1 Still true — do not rediscover as new

| Fact | Where (this HEAD) |
| :--- | :--- |
| Bindgen + `toBackendSpellConfig` include Motoko summon fields | `backend.ts` 130–151; `adminContract.ts`. 09-01-002 **closed**. Motoko `SummonUnitDef` is still `pieceType` / `level` / `hpScale` / `damageScale` (`admin.mo` 85–90). Combat also needs `summonKit` / `ap` / `mp` (`summonSpawn.ts` 22–32). |
| Motoko + client reject empty `summonAI` when `isSummon` | `adminGuard.mo` 423–425; `adminSafety.ts` 625–628. Runtime still does `spell.summonAI \|\| "hunter"` (`summonSpawn.ts` 139) and `inferSummonArchetype` still falls back to `summon.name` (`enemyAI.ts` 217–224). |
| Validators accept `spellType="summon"` | `adminGuard.mo` 348–349; `adminSafety.ts` 611. Editor `<select>` is still damage / heal / drain (`AdminDashboard.tsx` 2684–2686). “Heal (targets self)” is a targeting lie — `targetType` has **zero** editor matches. |
| Lifecycle is still `usableByPlayer=false` | `adminDeleteSpellConfig` (`main.mo` 882–901) error copy still says “set usableByPlayer=false to retire it” (887). Soft-retire writes that flag when `_spellReferencedByPlayers` (253–267, **keys+bar only**). Else `remove`. |
| `upgradeSpell` treats the same flag as “Spell is retired” | `main.mo` 1011–1012. Owned-but-never-upgraded ids are not in `spellLevelKeys`, so the check blocks the legacy upgrade 08-31 §8.2 requires. No live max-level rail on this write (queued #810 adds `MAX_SPELL_LEVEL = 99`). Appearance cannot mint keys (`resolveAppearanceSpellLevels`). |
| Library helper is still inverted | `shouldIncludeBackendSpellInLibrary` (`adminSafety.ts` 711–718) returns true when `usableByPlayer !== false`. Wired at `WorldExploration.tsx` 2412–2430. `ownedIds` is `starterSpells` ∪ `spellLevelKeys` ∪ `spellBarOrder`. All 32 frontend ids are forced `isBaseSpell: true` (2395–2408). |
| No observation / unlock persist | No `ownedSpellIds`, `observedSpellIds`, `recordSpellObservation`, `commitSpellDiscoveries` under `src/`. Recap is still XP / Doka / feats. |
| No acquisition enum / three flags | Only `usableByPlayer` / `usableByEnemy` (`admin.mo` 117–118). No `ENEMY_DISCOVERY` … `SYSTEM_ONLY` in live types. No `OBSERVATION_REQUIRED` / `VICTORY_REQUIRED` / `PLAYER_LEARNABLE`. |
| Enemy pools hardcoded; zone always 0 | `ENEMY_KITS` is `Record<ChessPieceType, …>` (`enemyAI.ts` 163–185). `buildEnemyKit(enemy.pieceType, currentMap.levelZone)` (`WorldExploration.tsx` 11920) passes `{ name, minLevel, maxLevel }` (4683–4687). `Math.floor` is `NaN`; every kit stays zone 0. Admin `EnemyConfig` has no spell list (`admin.mo` 15–26). |
| Achievement / challenge still Doka-only | `AchievementConfig` is `{ id, name, description, dokaReward, condition, active }` (`admin.mo` 249–256). `defaultAchievements()` 309–326 is 15 Doka rows. `KNOWN_ACHIEVEMENT_CONDITIONS` is 15 keys (`adminSafety.ts` 306–322). `DEFAULT_CHALLENGES` is `{ doka, xp, badge }`. |
| Name heuristics still live | `OLD_SPELL_NAMES_SET` matches **name and id**, including live `physical_attack` (`WorldExploration.tsx` 2356–2389). Same id is in `OLD_SPELL_IDS` purge (`main.mo` 689–697). `summonSpawn.ts` 165: `spell.name.replace("Summon ", "")`. |
| Three boss kit sources | Live combat: `data/bossKits.ts`. Motoko `defaultBossConfigs()` still lists purged ids (`admin.mo` 358+ `fireball`, `blood_nova`, `poison_dart`, …). Admin chips: `getSpellConfigs()`. |
| Bar persist still upgrade-keys only | `setSpellBarOrder` filters to `spellLevelKeys` (`main.mo` 1945–1947). |
| Spell Save is a live overwrite | `adminSetSpellConfig` (`main.mo` 869–879). No `adminRollbackSpellConfig`. Rollback exists for GameConfig / TierSpawn / ColorPalette / BossRush / LevelUp only. |
| Enemy hard delete | `adminDeleteEnemyConfig` (`main.mo` 798–804) is unconditional `remove`. |
| Achievement delete | Progress present → `active=false`; else `remove` (`main.mo` 2389–2408). Unlock rejects retired (`markAchievementUnlocked` 2473). Last-live catalog guard is still queued (#733) — **not on `main`**. |
| Activate gate is still a payload clamp | Both validators reject `apCost < 1` (`adminGuard.mo` 380–382; `adminSafety.ts` 604–606) — live Timestep is `apCost: 0` (`spellData.ts` 216–220). No `targetType`, no acquisition, no name-heuristic scan. Closed `knownSummonAI` / `knownPieceType` still omit `font` / `dummypost` / `pentaspan` / `septspan` (`adminGuard.mo` 363–373). |
| Write landing | `useSpellQueries.ts` (293 lines) already calls `validateSpellConfig`. Extract `SpellEditor` here. Do not grow `AdminDashboard.tsx` (8 280 lines) until activate exists. |
| New stables | Later EOP file after `20260901`; bump `check-limit` (today **5**). Never amend a shipped `NewActor`. |

`newSpell()` (`AdminDashboard.tsx` 85–134) still seeds cooldown + mechanic bools + empty summon fields and **omits `targetType`**. Default `usableByPlayer: true` still hydrates every account.

Delete confirm (`AdminDashboard.tsx` 3791–3794) still says the live spell is **removed immediately** and dependents **will break**. Toast is always `"Spell deleted"` (6166). Backend may have only flipped a bool.

Live tabs (5611–5626): Enemies, Regions, Player Sprites, Spells, Map Modifiers, Enemy Tiers, Visuals, Settings, Purchases, Achievements, Enemy Names, Bosses, Ad Boxes, Shop, Boss Rush. Still no Library / Discovery / Kits / Feats-as-graph / Graph / Versions.

Duplicate / compare versions / draft / validate-as-activate / deactivate / dependency inspection / spell rollback remain **absent**. `validateSpellConfig` is a payload clamp, not the 08-31 activate gate.

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

## 3. Queue after #791 (do not treat as landed)

Older still-open PRs merge first (`createdAt` ascending). Oldest still-open is **#327**, then **#331**, then #333+. Union overlapping files; one `export function` per name. Open count at this audit: **482**. Highest observed PR: **#813**. Silence since 2026-09-29 21:24 UTC is **not** a merge.

SDA-relevant additions **after** 09-29-115 / PR #791:

| PR | What it is | Studio rule |
| :--- | :--- | :--- |
| [#802](https://github.com/Mr-Melic/stralt/pull/802) | Wave-12 SDE, `generationMin: 12`. Unique §11: `spell-orth-stride` … `spell-dry-gait`, plus `spell-pack-cap` (`ENEMY_ONLY`) and `spell-reach-fold` (`BOSS_ONLY`). Dry Gait **wins** leftover-MP=0 heal vs #787 Parched Mend. | Do not pre-own. Do not clone #726 / #747 / #787 holes. |
| [#787](https://github.com/Mr-Melic/stralt/pull/787) | Wave-12 tactical (opened 00:18, before #791): `spell-parched-mend` … `spell-court-imprint`. Extra doors `parched_cantor` / `imprint_precentor` / `span_six` / `court_imprint_regent`. Six Span is occupy-6; live summon cap is still 2. `spell-court-imprint` is `NOT_PLAYER_LEARNABLE`. Wave **13** family CORE consumes #787 — **except** Parched Mend. | Stamp, do not clone. Court Imprint never owned. Do not ship Parched Mend. Do not activate Six Span until occupy-weight / cap exists. |
| [#796](https://github.com/Mr-Melic/stralt/pull/796) | Wave-12 elite CORE from #726 + leftover #679 unique CORE. Court Dual / Pack Close / Mid Fold stay closed. Wave-11 unique CORE waits for Wave 13. | Honour CORE–SIGNATURE **ids**. Zone NaN still hides ADVANCED. |
| [#808](https://github.com/Mr-Melic/stralt/pull/808) | Wave-13 boss sheets + Rush Table K. `flush_psalmist` / `lone_lector` / `plate_bursar` / `lend_proctor`. Extra doors on leftover #563: Cadence Flush / Lone Sting / Morrow Plate / Leftover Lend. Spectacular `CHOIR_FLUSH` / `CHOIR_LONE` / `NAVE_PLATE` / `CHOIR_LEND` stay `BOSS_ONLY`. Court Hinge stays `NOT_PLAYER_LEARNABLE`. | Closed signatures never enter `ownedSpellIds`. Do not add a fourth kit source. Do not restamp Wave-1…12 feat doors or #726 / #787 extra doors. |
| [#792](https://github.com/Mr-Melic/stralt/pull/792) | Enemy/boss admin re-audit; **no new EBA IDs**. | Consume EBA / 09-23-011. Do not add a fourth kit table. |
| [#798](https://github.com/Mr-Melic/stralt/pull/798) | Extract camera-follow from WX into `engine/cameraFollow.ts`. | Discovery helpers stay in `engine/*` / `utils/*`. Union #327 / #331 / #639 / #683 / #730 / #798. |
| [#799](https://github.com/Mr-Melic/stralt/pull/799) | Bomber kamikaze blast shared with Inferno execute. Inferno is ST DoT (`damage` 0, `areaRadius` 0). Blast radius is `AI_KAMIKAZE_BLAST_RADIUS`, **not** Inferno metadata and **not** the name. | Persist as `summonAI=bomber` (or `kamikaze` alias) metadata. Do not write `areaRadius: 2` onto Inferno. Not a grant. |
| [#810](https://github.com/Mr-Melic/stralt/pull/810) | Chat/name control reject + `MAX_SPELL_LEVEL` / `MAX_BUFF_STACK` = 99. Sidecar `adminSafety.securityAudit.ts` so older PRs keep `adminSafety.ts`. Live `upgradeSpell` (`main.mo` 964–1065) has **no** max-level rail today. | Caps are rails, not grants, not a character level cap. Do not raise 99 → 999. Union the sidecar; do not recopy into `adminSafety.ts`. |
| [#800](https://github.com/Mr-Melic/stralt/pull/800) / [#807](https://github.com/Mr-Melic/stralt/pull/807) / [#811](https://github.com/Mr-Melic/stralt/pull/811) / [#812](https://github.com/Mr-Melic/stralt/pull/812) / [#813](https://github.com/Mr-Melic/stralt/pull/813) | More `saveBattleStats` remount skips (one-shot Doka, victory XP, GameKey, feat claim, leftover XP). | Same class as 09-29-113. Feat-claim skip is still Doka via `claimAchievementReward`, never a spell grant. |
| [#793](https://github.com/Mr-Melic/stralt/pull/793) | Expansion 035: repeating Ember Knight slayer rungs `ember_slayer_5` / `15` / `40`. Doka on claim. New condition keys must join the 15-key whitelist. `unstoppable` / `level_10` stays a capped milestone. | Leftover feat doors unused as spell gates. 035 is not a `spellRewardIds` slice. |
| [#794](https://github.com/Mr-Melic/stralt/pull/794) | Wave-11 synergy formations consuming #752 families. Live `EnemyFamily` remains the original seven. | Consume CORE ids. Formations are not grants. |
| [#804](https://github.com/Mr-Melic/stralt/pull/804) | 09-29 enemy AI evolution increment. | AI modules belong on the spell→AI dependency view. Do not infer modules from `spell.name`. |
| [#809](https://github.com/Mr-Melic/stralt/pull/809) | Challenge offer survives no-op Attack Nearest. | First-action metadata, not a grant. |
| [#805](https://github.com/Mr-Melic/stralt/pull/805) | Leftover-walk BuffShop Use + potion `healUsed`. | Item use is not observation and is not ownership. |
| [#803](https://github.com/Mr-Melic/stralt/pull/803) | Keep `completeBossRushRoom(9)` ahead of `resetBossRush`. Client `dokaReward`/`xpReward` already ignored. | Room-clear `applyRewards` is not a spell grant. |

Still queued (do not re-issue): #564 `SpellSummonFields` (09-25), #568 linear⊕diagonal (09-25-055), 09-28-084…098, 09-29-099…115, #747 / #726 / #752 / #753 / #733 / #730 / #754 / #766 / #757 / #762.

Same-hour 09-29 flock also opened telemetry / PX / balance / long-horizon / Health skip (#801, #806, …). Those are not spell-studio work. Do not touch `MASTER_ROADMAP.md` (queued #783).

---

## 4. Owner UI (dev-gated — still the 08-31 studio)

Carved-stone / slate / crimson. Same `#admin` + lazy `AdminDashboard` gate.

Immediate UI honesty (can land with persist 001/004, not a restyle):

- Delete on published ids is **Retire**. Confirm lists dependents. Toast must say retired vs rejected vs draft-deleted.
- Cast-gate checkboxes stay labeled “player may cast” / “enemy may cast.” Lifecycle is a separate control.
- Validation strip: missing `targetType`, broken kit id, name-heuristic leftover = crimson.
- Spell Type includes `summon`. Summon section: `summonAI`, lifespan, piece, scales, **displayName**, kit ids.

Do not grow the 8 280-line dashboard until activate exists on the canister (08-31 SDA-012 / 09-23-013 / 09-23-015). Extract `SpellEditor` onto `useSpellQueries.ts`. Do not grow `WorldExploration.tsx`. Restack AdminDashboard siblings as **one** extract.

Support still required and still missing: duplicate, compare versions, draft, validate (activate gate), activate, deactivate, dependency inspection, rollback.

---

## 5. Prior ACTION_ID status @ `0f5363f`

Unchanged from 09-23 § / 09-29 §:

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
| 09-29 099–115 | **OPEN** on #791. |

---

## 6. Out of scope

- Production TypeScript / Motoko / Candid in this PR
- RAF, map generation, turn logic, damage math
- Growing `WorldExploration.tsx` or concatenating a second `export function` on restack
- Re-authoring Wave-1…13 spell cards or boss adaptations
- Treating `adminSafety.ts` helpers, #775 AUX copy, or #810 stack rails as persist `lifecycle`
- Re-opening 09-01-002 bindgen work
- Re-issuing 09-21…09-29 IDs
- Editing Cursor dashboard prompts (no write API)
- Landing Wave-11 / Wave-12 / Wave-13 catalog rows before 09-23-003
- Treating the 22-day PR freeze as “those drafts landed”

---

## 7. ACTION_ID index (this run)

All items: `STATUS: NEW`. Full records: [`ACTION_IDS_SDA_2026-10-21.md`](./ACTION_IDS_SDA_2026-10-21.md).

| ID | Title | Priority |
| :--- | :--- | :--- |
| SDA-2026-10-21-116 | Honour #802 Wave-12 SDE stamps; do not pre-own generationMin 12 ids | P1 |
| SDA-2026-10-21-117 | Stamp #787 Wave-12 tactical as Wave-13 CORE; Court Imprint never owned | P1 |
| SDA-2026-10-21-118 | Honour #796 Wave-12 elite CORE; zone NaN still hides ADVANCED | P1 |
| SDA-2026-10-21-119 | Honour #808 Wave-13 boss / Rush Table K; closed signatures never owned | P1 |
| SDA-2026-10-21-120 | Honour #792 enemy/boss admin; do not add a fourth kit source | P1 |
| SDA-2026-10-21-121 | Union #798 camera-follow extract; do not grow WorldExploration | P1 |
| SDA-2026-10-21-122 | Persist bomber kamikaze as summonAI metadata; union #799 | P1 |
| SDA-2026-10-21-123 | Union #810 spell/buff stack caps; rails are not grants | P1 |
| SDA-2026-10-21-124 | Remount skips continue after #791; not a grant path | P1 |
| SDA-2026-10-21-125 | Honour #793 Ember slayer rungs; leftover feats unused as spell gates | P1 |
| SDA-2026-10-21-126 | Honour #794 Wave-11 formations; consume CORE ids, do not grant | P1 |
| SDA-2026-10-21-127 | Honour #804 AI increment; AI modules in the dependency view | P1 |
| SDA-2026-10-21-128 | Challenge first-action / leftover-walk item use are not grants | P1 |
| SDA-2026-10-21-129 | Boss Rush complete(9) is not a spell grant | P1 |
