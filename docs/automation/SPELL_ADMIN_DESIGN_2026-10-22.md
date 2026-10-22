# Spell, Discovery & Achievement Admin Design — 2026-10-22 re-audit

**Author:** Spell, Discovery & Achievement Admin Designer  
**Automation:** `4efa22ec-a498-11f1-a7d1-d6b4613131ce`  
**Date:** 2026-10-22  
**HEAD audited:** `0f5363f` (`Merge pull request #332`) — unchanged since the 09-21 re-audit  
**Scope:** Owner tooling for the complete spell ecosystem. **No production code in this PR.**

This is a **delta** on [`SPELL_ADMIN_DESIGN_2026-08-31.md`](./SPELL_ADMIN_DESIGN_2026-08-31.md) (#116). Sections 2–11 of that document remain the studio contract (canonical `SpellDefinition`, acquisition routes, observe→win→unlock, CORE–SIGNATURE pools, dependency views, soft-retire + legacy owned, studio tabs, persist sketch). 09-01 / 09-02 deltas still stand (bindgen 09-01-002 LANDED; empty-AI half of 09-02-006 LANDED).

It records what is still the wrong field on `main`, and the ACTION_IDs in [`ACTION_IDS_SDA_2026-10-22.md`](./ACTION_IDS_SDA_2026-10-22.md) (**130–144** only).

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
| [#815](https://github.com/Mr-Melic/stralt/pull/815) | 10-21 pair | 116–129 |

Do not implement those IDs unless a human or orchestrator picks one. Do not grow `WorldExploration.tsx` (19 213 lines). Never introduce spell-name heuristics. Next implementer still starts at **09-23-001**, then **007**, then **003+023**. Do not land Wave-9 / 10 / 11 / 12 / 13 catalog rows before 003. Persist maps go through **09-23-016** (new later EOP file after `20260901`; `check-limit = 5` today). Do not extend the `usableByPlayer=false` retire path.

---

## 1. Why this run exists

The 10-21 run closed the queue through #815 (Wave-12 SDE/tactical/elite, Wave-13 bosses, bomber kamikaze metadata, spell-level rails, remount skips). Same `HEAD`. Calendar is **2026-10-22**. `origin/main` has not moved since 2026-09-03 (`0f5363f`). The 10-21 audit’s “newest #813 / 482 open” snapshot is stale: the 10-21 same-hour flock plus later combat sidecars opened **#814–#869**, then the 10-22 same-hour flock **#870–#886**. Open queue at this audit: **555** drafts. Newest sibling before this work: **#886** (Emergent Build & Meta, 2026-10-22 00:14 UTC). Do not touch `MASTER_ROADMAP.md` (#870 is a pre-existing queue break on that file).

The product hole is unchanged: catalog still grants, discovery still does not exist, retirement is still a cast flag.

What *is* new for this studio is the flock **after** #815 that 116–129 did not stamp: Wave-13 discovery (#837), Wave-13 tactical (#849, Wave-**14** family CORE), Wave-13 elite CORE (#840), Wave-12 formations (#825), Wave-14 bosses / Rush Table L (#836), EBA/AFDA/owner-UX honesty (#817 / #818 / #838), WX dust-mote extract (#831), hostile vs player summon-kit sidecars (#842 / #861), kit-execute metadata sidecars (Swap / Mark / Mirror / buff / DoT / bounce), more remount skips, Expansion 037/038 (#823), AI increment (#821), data-evolution minLevel / retired-feat sidecars (#828), and encounter rooms (#826).

The 08-31 contract is still the destination. The 10-22 IDs are queue-union only. Do not mint a second 001–129.

---

## 2. Current state (re-verified against `origin/main` @ `0f5363f`)

### 2.1 Still true — do not rediscover as new

| Fact | Where (this HEAD) |
| :--- | :--- |
| Bindgen + `toBackendSpellConfig` include Motoko summon fields | `backend.ts` 130–151; `adminContract.ts`. 09-01-002 **closed**. Motoko `SummonUnitDef` is still `pieceType` / `level` / `hpScale` / `damageScale` (`admin.mo` 85–90). Combat also needs `summonKit` / `ap` / `mp` (`summonSpawn.ts` 22–32). |
| Motoko + client reject empty `summonAI` when `isSummon` | `adminGuard.mo` 423–425; `adminSafety.ts` 625–628. Runtime still does `spell.summonAI \|\| "hunter"` (`summonSpawn.ts` 139) and `inferSummonArchetype` still falls back to `summon.name` (`enemyAI.ts` 217–224). |
| Validators accept `spellType="summon"` | `adminGuard.mo` 348–349; `adminSafety.ts` 611. Editor `<select>` is still damage / heal / drain (`AdminDashboard.tsx` 2675–2687). “Heal (targets self)” is a targeting lie — `targetType` has **zero** editor matches. |
| Lifecycle is still `usableByPlayer=false` | `adminDeleteSpellConfig` (`main.mo` 882–901) error copy still says “set usableByPlayer=false to retire it” (887). Soft-retire writes that flag when `_spellReferencedByPlayers` (273–284, **keys+bar only**). Else `remove`. |
| `upgradeSpell` treats the same flag as “Spell is retired” | `main.mo` 1011. Owned-but-never-upgraded ids are not in `spellLevelKeys`, so the check blocks the legacy upgrade 08-31 §8.2 requires. No live max-level rail on this write (queued #810 adds `MAX_SPELL_LEVEL = 99`). Appearance cannot mint keys (`resolveAppearanceSpellLevels`). |
| Library helper is still inverted | `shouldIncludeBackendSpellInLibrary` (`adminSafety.ts` 711–718) returns true when `usableByPlayer !== false`. Wired at `WorldExploration.tsx` 2412–2438. `ownedIds` is `starterSpells` ∪ `spellLevelKeys` ∪ `spellBarOrder`. All 32 frontend ids are forced `isBaseSpell: true` (2395–2408). |
| No observation / unlock persist | No `ownedSpellIds`, `observedSpellIds`, `recordSpellObservation`, `commitSpellDiscoveries` under `src/` except the **argument name** `ownedSpellIds` on the inverted helper. Recap is still XP / Doka / feats. |
| No acquisition enum / three flags | Only `usableByPlayer` / `usableByEnemy` (`admin.mo` 117–118). No `ENEMY_DISCOVERY` … `SYSTEM_ONLY` in live types. No `OBSERVATION_REQUIRED` / `VICTORY_REQUIRED` / `PLAYER_LEARNABLE`. |
| Enemy pools hardcoded; zone always 0 | `ENEMY_KITS` is `Record<ChessPieceType, …>` (`enemyAI.ts` 163–185). `buildEnemyKit(enemy.pieceType, currentMap.levelZone)` (`WorldExploration.tsx` 11920) passes `{ name, minLevel, maxLevel }` (4683–4687). `Math.floor` is `NaN`; every kit stays zone 0. Admin `EnemyConfig` has no spell list (`admin.mo` 15–26). Summoner extras still `starterSpells.find(id === "summon-dire-wolf")` (11935–11941). |
| Achievement / challenge still Doka-only | `AchievementConfig` is `{ id, name, description, dokaReward, condition, active }` (`admin.mo` 249–256). `KNOWN_ACHIEVEMENT_CONDITIONS` is 15 keys (`adminSafety.ts` 306–322). Challenges stay `{ doka, xp, badge }`. |
| Name heuristics still live | `OLD_SPELL_NAMES_SET` matches **name and id**, including live `physical_attack` (`WorldExploration.tsx` 2356–2389). Same id is in `OLD_SPELL_IDS` purge (`main.mo` 689–697). `summonSpawn.ts` 165: `spell.name.replace("Summon ", "")`. |
| Three boss kit sources | Live combat: `data/bossKits.ts`. Motoko `defaultBossConfigs()` still lists purged ids (`admin.mo` 358+ `fireball`, `cursed_gust`, `entangle`, `mist_form`, …). Admin chips: `getSpellConfigs()`. Queued #818 only **names** that split in `useBossQueries.ts` — it is not a fourth kit table. |
| Bar persist still upgrade-keys only | `setSpellBarOrder` filters to `spellLevelKeys` (`main.mo` 1945–1947). |
| Spell Save is a live overwrite | `adminSetSpellConfig` (`main.mo` 869–879). No `adminRollbackSpellConfig`. Queued #838 types rollback for the **five** last-good writers (LevelUp / GameConfig / TierSpawn / ColorPalette / BossRush) — **not** spells. |
| Enemy hard delete | `adminDeleteEnemyConfig` (`main.mo` 798–804) is unconditional `remove`. |
| Achievement delete | Progress present → `active=false`; else `remove`. Unlock rejects inactive. Official Claim UI hides `active=false` while `claimAchievementReward` still pays Doka (queued #828 sidecar). Last-live catalog guard is still queued (#733) — **not on `main`**. |
| Activate gate is still a payload clamp | Both validators reject `apCost < 1` (`adminGuard.mo` 380–382; `adminSafety.ts` 604–606) — live Timestep is `apCost: 0` (`spellData.ts` 216–220). No `targetType`, no acquisition, no name-heuristic scan. Closed `knownSummonAI` / `knownPieceType` still omit `font` / `dummypost` / `pentaspan` / `septspan` (`adminGuard.mo` 363–373) and now also queued `octspan` / `gauntpost` / `sixspan`. |
| `minLevel` is catalog copy, not a gate | `void_collapse` seeds `minLevel: 30` (`admin.mo` 190) and still hydrates a level-1 book because the library helper ignores it. Queued #828 `spellMinLevelHydrate.ts` locks that fact. Do **not** start enforcing `minLevel` until `ownedSpellIds` exists (09-23-003). |
| Write landing | `useSpellQueries.ts` (293 lines) already calls `validateSpellConfig`. Extract `SpellEditor` here. Do not grow `AdminDashboard.tsx` (8 280 lines) until activate exists. |
| New stables | Later EOP file after `20260901`; bump `check-limit` (today **5**). Never amend a shipped `NewActor`. |

`newSpell()` (`AdminDashboard.tsx` 85–135) still seeds cooldown + mechanic bools + empty summon fields and **omits `targetType`**. Default `usableByPlayer: true` still hydrates every account.

Delete confirm (`AdminDashboard.tsx` 3793–3794) still says the live spell is **removed immediately** and dependents **will break**. Toast is always `"Spell deleted"` (6166). Backend may have only flipped a bool.

Live tabs (5611–5626): Enemies, Regions, Player Sprites, Spells, Map Modifiers, Enemy Tiers, Visuals, Settings, Purchases, Achievements, Enemy Names, Bosses, Ad Boxes, Shop, Boss Rush. Still no Library / Discovery / Kits / Feats-as-graph / Graph / Versions. Queued #838 `⌘K` indexes those **15** tabs and forbids empty Challenges / AI / Formations / Dungeons / Telemetry tabs until the canister APIs exist.

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

Mechanic flags the 10-21 kit-execute flock now **proves** must round-trip (still frontend-only on this HEAD): `isSwap`, `isMark`, `isMirror`, `buffStat` / `buffModifier` / `buffDuration`, `dotDamage` / `dotDuration`, `bounces` / `hitsMultiple`. Saving from Admin today drops them.

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

Hostile minion casts of catalog kit ids (queued #842) are observation-eligible. Player auto-summon decide that merely **resolves** an empty `spells` array from `summonKit` (queued #861) is not.

### 2.4 Dependency safety + legacy owned (unchanged)

| Field | Meaning | Must not mean |
| :--- | :--- | :--- |
| `usableByPlayer` | Cast/equip gate **after** ownership (and `minLevel`) | Retired, ENEMY_ONLY, draft, hidden |
| `usableByEnemy` | Hostile AI may resolve this id | Learnable, in a pool, or published |
| `lifecycle` | `draft \| active \| inactive \| retired` | Anything about who can cast |
| `PLAYER_LEARNABLE` | May enter `ownedSpellIds` | `usableByPlayer` |
| `acquisition.route` | How a player learns it | Inferred from the two usable flags |
| `minLevel` | Catalog metadata / future post-ownership gate | Hydrate filter, ownership, or a career cap |

**Already-owned retired spells** (08-31 §8.2):

1. Do not strip `ownedSpellIds`, `spellLevelKeys` / `spellLevelValues`, or `spellBarOrder`.
2. `setSpellBarOrder` keeps the id if owned (not “must be in `spellLevelKeys`” and not “must be `usableByPlayer`”).
3. `upgradeSpell` stays legal for owned retired ids. New players cannot obtain the id.
4. Spellbook shows a Retired seal. Combat reads the frozen `retiredRevision`.
5. New achievement grants skip a retired reward id and still pay Doka. Unclaimed retired feats stay claimable for that frozen Doka (queued #828 / #437) — they do not become a second spell grant.
6. Live kits ignore retired ids at resolve time (log once). Activate of a kit that still lists them is blocked.

Hard delete remains legal **only** for `draft` with zero published revisions and zero refs (players, kits, bosses, achievements). Otherwise `#err` + dependency report.

Required inspector (08-31 §7), computed from **ids**:

- Spell → enemies, achievements, challenges, bosses, AI modules, acquisition routes.
- Achievement → conditions, `spellRewardIds`, `requiresAchievementIds` / `requiresSpellIds`.

---

## 3. Queue after #815 (do not treat as landed)

Older still-open PRs merge first (`createdAt` ascending). Oldest still-open is **#327**, then **#331**, then #333+. Union overlapping files; one `export function` per name. Open count at this audit: **555**. Highest observed PR before this work: **#886**. Silence on `origin/main` since 2026-09-03 is **not** a merge. #870 `MASTER_ROADMAP.md` is a pre-existing oldest-first conflict (skipped by stack-compat); this PR does not touch that file.

SDA-relevant additions **after** 10-21-129 / PR #815:

| PR | What it is | Studio rule |
| :--- | :--- | :--- |
| [#837](https://github.com/Mr-Melic/stralt/pull/837) | Wave-13 SDE, `generationMin: 13`. Unique §11: `spell-knight-stride` … `spell-diag-fold`. `spell-pack-file` is `ENEMY_ONLY`. `spell-diag-fold` is `BOSS_ONLY`. Hollow Gift / Cadence Swap **win** vs same-day tactical clones. Wave-13 family CORE stamps #747 + #787 (except Parched Mend). Wave-12 unique ids stay extras until Wave 14. | Do not pre-own. Do not clone #747 / #802 / #849 holes. |
| [#849](https://github.com/Mr-Melic/stralt/pull/849) | Wave-13 tactical: `spell-gaunt-mend` … `spell-court-lag`. Extra doors `gaunt_cantor` / `lag_precentor` / `span_oct` / `court_lag_regent`. Oct Span is occupy-8; live summon cap is still 2. `spell-court-lag` is `NOT_PLAYER_LEARNABLE`. New `summonAI`: `"octspan"` / `"gauntpost"`. Wave **14** family CORE consumes #849. | Stamp, do not clone. Court Lag never owned. Do not ship Hollow Gift / Cadence Swap clones. Do not activate Oct Span until occupy-weight / cap exists. |
| [#840](https://github.com/Mr-Melic/stralt/pull/840) | Wave-13 elite CORE from #787 (except Parched Mend) + leftover #747 unique CORE. Court Imprint / Pack Long / Adj Fold / Pack Cap / Reach Fold stay closed. Six Span still illegal while cap is 2. | Honour CORE–SIGNATURE **ids**. Zone NaN still hides ADVANCED. |
| [#825](https://github.com/Mr-Melic/stralt/pull/825) | Wave-12 synergy formations consuming #796 families. Live `EnemyFamily` remains the original seven. | Consume CORE ids. Formations are not grants. |
| [#836](https://github.com/Mr-Melic/stralt/pull/836) | Wave-14 boss sheets + Rush Table L. `effigy_clerk` / `enter_deacon` / `split_acolyte` / `quiet_chorister`. Extra doors on leftover #563 Dummy Post / Enter Mend / Split Mend **and** leftover #636 Quiet Sill. Spectacular `CHOIR_EFFIGY` / `NAVE_THRESHOLD` / `CHOIR_SPLIT` / `NAVE_QUIET` stay `BOSS_ONLY`. Court Hinge stays `NOT_PLAYER_LEARNABLE`. No new #137 spell ids. | Closed signatures never enter `ownedSpellIds`. Do not add a fourth kit source. Do not restamp Wave-1…13 feat doors or #787 / #849 extra doors. |
| [#817](https://github.com/Mr-Melic/stralt/pull/817) / [#876](https://github.com/Mr-Melic/stralt/pull/876) | Enemy/boss admin re-audits (10-21 and 10-22); **no new EBA IDs**. | Consume EBA / 09-23-011. Do not add a fourth kit table. |
| [#818](https://github.com/Mr-Melic/stralt/pull/818) | Admin drift: three buff catalogs; `useBossQueries.ts` names live `bossKits.ts` vs unused Motoko seed. | Buff catalogs are not spell grants. Naming the split is not a fourth kit. Prefer #466 for buff id-alias. |
| [#838](https://github.com/Mr-Melic/stralt/pull/838) / [#883](https://github.com/Mr-Melic/stralt/pull/883) | Owner UX helpers: audit-log empty `#ok`, typed rollback for the **five** last-good writers, PII redact, dirty snapshot, `⌘K` over the 15 live tabs, changelog publish gate, plus 10-22 sprite-close / save-feedback / catalog-confirm / config-busy sidecars. Does **not** restack `AdminDashboard.tsx`. | Spell rollback still does not exist. Do not add empty studio tabs. Extract `SpellEditor` onto `useSpellQueries.ts`. Union helpers; one `export function` per name. |
| [#831](https://github.com/Mr-Melic/stralt/pull/831) | Extract dust-mote seed/recycle from WX into `engine/dustMotes.ts`. Oldest-first already WARN-conflicts WX with #327 / #331 / #730 / #798. | Discovery helpers stay in `engine/*` / `utils/*`. Union WX call sites. Do not grow WX. |
| [#842](https://github.com/Mr-Melic/stralt/pull/842) | Hostile summons attach catalog `summonKit` and keep catalog `summonAI` (`enemySummonKit.ts`). | Hostile kit casts may observe. Do not infer `summonAI` from the unit name. Union; do not restack WX / `summonSpawn.ts` from this studio. |
| [#861](https://github.com/Mr-Melic/stralt/pull/861) | Player auto-summon decide resolves catalog `summonKit` when spawn left `spells` empty (`autoSummonKitSpells.ts`). | Player-side summons must **not** observe. Resolving a kit is not a grant. |
| [#843](https://github.com/Mr-Melic/stralt/pull/843) / [#850](https://github.com/Mr-Melic/stralt/pull/850) / [#851](https://github.com/Mr-Melic/stralt/pull/851) / [#852](https://github.com/Mr-Melic/stralt/pull/852) / [#856](https://github.com/Mr-Melic/stralt/pull/856) / [#857](https://github.com/Mr-Melic/stralt/pull/857) / [#862](https://github.com/Mr-Melic/stralt/pull/862) / [#865](https://github.com/Mr-Melic/stralt/pull/865) / [#868](https://github.com/Mr-Melic/stralt/pull/868) / [#878](https://github.com/Mr-Melic/stralt/pull/878) | Kit-execute sidecars: boss buffStat / isSwap / isMark / isMirror / heal+CHC / Chain Lightning `bounces`; summon DoT ticks / heal+CHC / buffStat / Slow `debuffStat`. Keys are **metadata flags**, never `spell.name`. #868 lives under `utils/`. | Persist those flags with 09-23-005. Union sidecars. Not grants. Do not write Inferno / Swap / Mirror / Slow name tables. |
| [#847](https://github.com/Mr-Melic/stralt/pull/847) / [#854](https://github.com/Mr-Melic/stralt/pull/854) / [#860](https://github.com/Mr-Melic/stralt/pull/860) / [#864](https://github.com/Mr-Melic/stralt/pull/864) / [#866](https://github.com/Mr-Melic/stralt/pull/866) / [#869](https://github.com/Mr-Melic/stralt/pull/869) / [#877](https://github.com/Mr-Melic/stralt/pull/877) | More `saveBattleStats` remount skips (death HP keep, absolute HP keep, throw-after-accept HP, Boss Rush Doka, victory Doka death-cut, one-shot Doka death-cut). | Same class as 10-21-124. Discovery must not piggy-back these skips. |
| [#823](https://github.com/Mr-Melic/stralt/pull/823) / [#875](https://github.com/Mr-Melic/stralt/pull/875) | Expansion 10-21 037/038 and the 10-22 Expansion catalog. | Leftover feat doors unused as spell gates. New EXP ids are not `spellRewardIds`. |
| [#821](https://github.com/Mr-Melic/stralt/pull/821) / [#874](https://github.com/Mr-Melic/stralt/pull/874) | 10-21 and 10-22 enemy AI evolution increments. | AI modules belong on the spell→AI dependency view. Do not infer modules from `spell.name`. |
| [#828](https://github.com/Mr-Melic/stralt/pull/828) | Data-evolution: `spellMinLevelHydrate.ts` (minLevel ignored); `retiredFeatClaimHidden.ts` (official Claim hides inactive unclaimed). | Do not enforce `minLevel` as a substitute for `ownedSpellIds`. Retired unclaimed feats stay Doka-claimable; they are not spell grants. Union the sidecars; do not recopy into `adminSafety.ts`. |
| [#826](https://github.com/Mr-Melic/stralt/pull/826) / [#885](https://github.com/Mr-Melic/stralt/pull/885) | Both/Stride/Near (10-21) and Heave/Dual/Mid (10-22) encounter catalogs (`ENC-*` rooms). Not spell catalogs. | Rooms may later be `SPECIAL_ENCOUNTER` stamps. Clearing a room is not a grant unless a named door is stamped. |
| [#870](https://github.com/Mr-Melic/stralt/pull/870) | Master Technical Director roadmap 2026-10-22. | Do not edit `MASTER_ROADMAP.md`. Not spell-studio work. Pre-existing oldest-first conflict on that file. |

Still queued (do not re-issue): #564 `SpellSummonFields` (09-25), #568 linear⊕diagonal (09-25-055), 09-28-084…098, 09-29-099…115, 10-21-116…129, #747 / #726 / #752 / #753 / #733 / #730 / #754 / #766 / #757 / #762 / #802 / #787 / #796 / #808.

Same-hour 10-21 flock also opened telemetry / PX / balance / long-horizon / Health skip / a11y / map integrity. Those are not spell-studio work.

---

## 4. Owner UI (dev-gated — still the 08-31 studio)

Carved-stone / slate / crimson. Same `#admin` + lazy `AdminDashboard` gate.

Immediate UI honesty (can land with persist 001/004, not a restyle):

- Delete on published ids is **Retire**. Confirm lists dependents. Toast must say retired vs rejected vs draft-deleted.
- Cast-gate checkboxes stay labeled “player may cast” / “enemy may cast.” Lifecycle is a separate control.
- Validation strip: missing `targetType`, broken kit id, name-heuristic leftover = crimson.
- Spell Type includes `summon`. Summon section: `summonAI`, lifespan, piece, scales, **displayName**, kit ids.
- `⌘K` (queued #838) stays over the 15 live tabs until activate exists. Do not ship empty Discovery / Kits / Graph / Versions / Challenges / AI / Formations tabs.

Do not grow the 8 280-line dashboard until activate exists on the canister (08-31 SDA-012 / 09-23-013 / 09-23-015). Extract `SpellEditor` onto `useSpellQueries.ts`. Do not grow `WorldExploration.tsx`. Restack AdminDashboard siblings as **one** extract.

Support still required and still missing: duplicate, compare versions, draft, validate (activate gate), activate, deactivate, dependency inspection, rollback.

---

## 5. Prior ACTION_ID status @ `0f5363f`

Unchanged from 09-23 § / 09-29 § / 10-21 §:

| Series | Status |
| :--- | :--- |
| 08-31 001 | **PARTIAL** — cooldown + Motoko/bindgen summon **block**. `targetType` / complete unit def / editor summons / mechanic flags did not. |
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
| 10-21 116–129 | **OPEN** on #815. |

---

## 6. Out of scope

- Production TypeScript / Motoko / Candid in this PR
- RAF, map generation, turn logic, damage math
- Growing `WorldExploration.tsx` or concatenating a second `export function` on restack
- Re-authoring Wave-1…14 spell cards or boss adaptations
- Treating `adminSafety.ts` helpers, #775 AUX copy, #810 stack rails, or #838 five-writer rollback as persist `lifecycle`
- Re-opening 09-01-002 bindgen work
- Re-issuing 09-21…10-21 IDs
- Editing Cursor dashboard prompts (no write API)
- Landing Wave-11 / Wave-12 / Wave-13 catalog rows before 09-23-003
- Enforcing `SpellConfig.minLevel` at hydrate without `ownedSpellIds`
- Treating the merge freeze as “those drafts landed”
- Editing `MASTER_ROADMAP.md` (#338 / #783 / #814 / #870)

---

## 7. ACTION_ID index (this run)

All items: `STATUS: NEW`. Full records: [`ACTION_IDS_SDA_2026-10-22.md`](./ACTION_IDS_SDA_2026-10-22.md).

| ID | Title | Priority |
| :--- | :--- | :--- |
| SDA-2026-10-22-130 | Honour #837 Wave-13 SDE stamps; do not pre-own generationMin 13 ids | P1 |
| SDA-2026-10-22-131 | Stamp #849 Wave-13 tactical as Wave-14 CORE; Court Lag never owned | P1 |
| SDA-2026-10-22-132 | Honour #840 Wave-13 elite CORE; zone NaN still hides ADVANCED | P1 |
| SDA-2026-10-22-133 | Honour #836 Wave-14 boss / Rush Table L; closed signatures never owned | P1 |
| SDA-2026-10-22-134 | Honour #825 Wave-12 formations; consume CORE ids, do not grant | P1 |
| SDA-2026-10-22-135 | Honour #817 / #818; do not add a fourth kit source | P1 |
| SDA-2026-10-22-136 | Union #838 owner UX; five-writer rollback is not spell rollback | P1 |
| SDA-2026-10-22-137 | Union #831 dust-mote extract; do not grow WorldExploration | P1 |
| SDA-2026-10-22-138 | Hostile #842 kit casts may observe; player #861 auto-summon must not | P1 |
| SDA-2026-10-22-139 | Persist kit-execute metadata flags; union 10-21 execute sidecars | P1 |
| SDA-2026-10-22-140 | Remount skips continue after #815; not a grant path | P1 |
| SDA-2026-10-22-141 | Grow closed `knownSummonAI` with octspan / gauntpost enums | P1 |
| SDA-2026-10-22-142 | Honour #823 / #826; leftover feats and ENC rooms are not grants | P1 |
| SDA-2026-10-22-143 | Honour #821 AI increment; AI modules in the dependency view | P1 |
| SDA-2026-10-22-144 | Union #828; do not enforce minLevel as an ownership substitute | P1 |
