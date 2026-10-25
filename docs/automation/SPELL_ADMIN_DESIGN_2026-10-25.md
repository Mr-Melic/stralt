# Spell, Discovery & Achievement Admin Design — 2026-10-25 re-audit

**Author:** Spell, Discovery & Achievement Admin Designer  
**Automation:** `4efa22ec-a498-11f1-a7d1-d6b4613131ce`  
**Date:** 2026-10-25  
**HEAD audited:** `0f5363f` (`Merge pull request #332`) — unchanged since the 09-21 re-audit  
**Scope:** Owner tooling for the complete spell ecosystem. **No production code in this PR.**

This is a **delta** on [`SPELL_ADMIN_DESIGN_2026-08-31.md`](./SPELL_ADMIN_DESIGN_2026-08-31.md) (#116). Sections 2–11 of that document remain the studio contract (canonical `SpellDefinition`, acquisition routes, observe→win→unlock, CORE–SIGNATURE pools, dependency views, soft-retire + legacy owned, studio tabs, persist sketch). 09-01 / 09-02 deltas still stand (bindgen 09-01-002 LANDED; empty-AI half of 09-02-006 LANDED).

It records what is still the wrong field on `main`, and the ACTION_IDs in [`ACTION_IDS_SDA_2026-10-25.md`](./ACTION_IDS_SDA_2026-10-25.md) (**175–189** only).

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
| [#892](https://github.com/Mr-Melic/stralt/pull/892) | 10-22 pair | 130–144 |
| [#940](https://github.com/Mr-Melic/stralt/pull/940) | 10-23 pair | 145–159 |
| [#1007](https://github.com/Mr-Melic/stralt/pull/1007) | 10-24 pair | 160–174 |

Same-hour 2026-10-25 flock (unique dated files — **do not overwrite**):

| PR | Files | Note |
| :--- | :--- | :--- |
| [#1044](https://github.com/Mr-Melic/stralt/pull/1044) | `ENEMY_BOSS_ADMIN_REAUDIT_2026-10-25.md`, `ACTION_IDS_ENEMY_BOSS_ADMIN_2026-10-25.md` | EBA re-audit; **no new EBA IDs** |
| [#1050](https://github.com/Mr-Melic/stralt/pull/1050) | `WORLD_ENCOUNTER_ADMIN_DESIGN_2026-10-25.md`, `ACTION_IDS_WDEAD_2026-10-25.md` | WDEAD occupancy/remount rails after #1015 |
| [#1055](https://github.com/Mr-Melic/stralt/pull/1055) | `ADMIN_DRIFT_AUDIT_2026-10-25.md`, `ACTION_IDS_AFDA_2026-10-25.md` | AFDA-043 unread `effectParams`; `boss_defeated` stays 042 |
| [#1056](https://github.com/Mr-Melic/stralt/pull/1056) | `docs/encounters/ENCOUNTER_EVOLUTION_2026-10-25.md` | Poise/Knight/Pit/Spent ENC rooms; not grants |
| [#1047](https://github.com/Mr-Melic/stralt/pull/1047)–[#1049](https://github.com/Mr-Melic/stralt/pull/1049), [#1051](https://github.com/Mr-Melic/stralt/pull/1051)–[#1053](https://github.com/Mr-Melic/stralt/pull/1053), [#1057](https://github.com/Mr-Melic/stralt/pull/1057) | GTAD / TADD / EBMA / VAL / Expansion / TBC / dead-code `*2026-10-25*` | Not this studio |

Do not implement those IDs unless a human or orchestrator picks one. Do not grow `WorldExploration.tsx` (19 213 lines). Never introduce spell-name heuristics. Next implementer still starts at **09-23-001**, then **007**, then **003+023**. Do not land Wave-9 / 10 / 11 / 12 / 13 / 14 / 15 / **16** catalog rows before 003. Persist maps go through **09-23-016** (new later EOP file after `20260901`; `check-limit = 5` today). Do not extend the `usableByPlayer=false` retire path.

---

## 1. Why this run exists

The 10-24 run closed the queue through #1007 (Wave-15 SDE/tactical/elite, Wave-16 bosses / Table N, later kit-execute/heal-decide, remount skips + lethal-reflect, `decspan` / `tallypost` enums, SDE win on Lean Gift / Cadence Rise vs #953). Same `HEAD`. Calendar is **2026-10-25**. `origin/main` has not moved since 2026-09-03 (`0f5363f`). The 10-24 audit’s “newest #1000 / 665+ open” snapshot is stale: the 10-24 same-hour flock plus later combat / remount sidecars opened **#1001–#1042**, then the 10-25 cron flock **#1043–#1057**. Open queue at this patch: **728+** drafts (flock continued through **#1074**). Newest sibling before this work: **#1074** (`MASTER_ROADMAP.md` 2026-10-25 — pre-existing oldest-first conflict; this PR does not touch that file). Do not touch `MASTER_ROADMAP.md` (#870 / #946 / #998 are pre-existing oldest-first conflicts on that file). Do not overwrite same-hour `*2026-10-25*` files (#1044 EBA, #1050 WDEAD, #1055 AFDA, #1056 ENC, and the telemetry/VAL/Expansion/TBC/dead-code pair).

The product hole is unchanged: catalog still grants, discovery still does not exist, retirement is still a cast flag.

What *is* new for this studio is the flock **after** #1007 that 160–174 did not stamp: Wave-16 discovery (#1017, `generationMin: 16`, Pack Orth `ENEMY_ONLY`, Leap Fold `BOSS_ONLY`), Wave-16 tactical (#1011, Wave-**17** family CORE, Court Snuff never owned, Hendeca Span blocked at cap 2), Wave-16 elite CORE (#997, #906 unique + #953 minus Court Prime), Wave-15 formations drop 16 (#1005), Wave-17 bosses / Rush Table O (#1004), later kit-execute sidecars (pack-heal approach/guard Frost+Inferno, Paper Windstorm range, boss HP commits, pack-caster wounded-retreat Frost #1054), later remount skips including leftover-XP keep (#1043 / #1045 / #1046), WDEAD 10-24 (#1015) **and** 10-25 (#1050), ENC Gaunt/Even/Brick/Orth (#1006) **and** Poise/Knight/Pit/Spent (#1056), Admin UX helpers (#1001), persist locks (#1014), UX copy including `summonDisplayName` (#1018), EBA 10-25 (#1044, no new IDs), AFDA 10-25 (#1055, unread `effectParams` 043; `boss_defeated` still 042), and closed `knownSummonAI` still omitting `hendecaspan` / `scorepost`.

The 08-31 contract is still the destination. The 10-25 IDs are queue-union only. Do not mint a second 001–174.

---

## 2. Current state (re-verified against `origin/main` @ `0f5363f`)

### 2.1 Still true — do not rediscover as new

| Fact | Where (this HEAD) |
| :--- | :--- |
| Bindgen + `toBackendSpellConfig` include Motoko summon fields | `backend.ts` 130–151; `adminContract.ts`. 09-01-002 **closed**. Motoko `SummonUnitDef` is still `pieceType` / `level` / `hpScale` / `damageScale` (`types/admin.mo` 85–90). Combat also needs `summonKit` / `ap` / `mp` (`summonSpawn.ts` 22–32). Queued #1014 `summonUnitDefPersist.ts` **locks** that thin shape; it is not 09-23-002. |
| Motoko + client reject empty `summonAI` when `isSummon` | `adminGuard.mo` 423–425; `adminSafety.ts` 625–628. Runtime still does `spell.summonAI \|\| "hunter"` (`summonSpawn.ts` 139) and `inferSummonArchetype` still falls back to `summon.name` (`enemyAI.ts` 203–224). |
| Validators accept `spellType="summon"` | `adminGuard.mo` 348–349; `adminSafety.ts` 611. Editor `<select>` is still damage / heal / drain (`AdminDashboard.tsx` 2675–2687). “Heal (targets self)” is a targeting lie — `targetType` has **zero** editor matches. |
| Lifecycle is still `usableByPlayer=false` | `adminDeleteSpellConfig` (`main.mo` 882–902) error copy still says “set usableByPlayer=false to retire it” (887). Soft-retire writes that flag when `_spellReferencedByPlayers` (273–284, **keys+bar only** via `_characterHasSpell` 253–270). Else `remove`. Queued #1014 `catalogDeletePolicy.ts` **locks** that retire-when-referenced path; it is not `lifecycle`. |
| `upgradeSpell` treats the same flag as “Spell is retired” | `main.mo` 1011. Owned-but-never-upgraded ids are not in `spellLevelKeys`, so the check blocks the legacy upgrade 08-31 §8.2 requires. Appearance cannot mint keys (`resolveAppearanceSpellLevels`). |
| Library helper is still inverted | `shouldIncludeBackendSpellInLibrary` (`adminSafety.ts` 712–718) returns true when `usableByPlayer !== false`. Wired at `WorldExploration.tsx` 2412–2440. `ownedIds` is `starterSpells` ∪ `spellLevelKeys` ∪ `spellBarOrder`. All 32 frontend ids are forced `isBaseSpell: true` (2395–2408). |
| No observation / unlock persist | No `ownedSpellIds`, `observedSpellIds`, `recordSpellObservation`, `commitSpellDiscoveries` under `src/` except the **argument name** `ownedSpellIds` on the inverted helper. Recap is still XP / Doka / feats. |
| No acquisition enum / three flags | Only `usableByPlayer` / `usableByEnemy` (`types/admin.mo` 117–118). No `ENEMY_DISCOVERY` … `SYSTEM_ONLY` in live types. No `OBSERVATION_REQUIRED` / `VICTORY_REQUIRED` / `PLAYER_LEARNABLE`. |
| Enemy pools hardcoded; zone always 0 | `ENEMY_KITS` is `Record<ChessPieceType, …>` (`enemyAI.ts` 163–185). `buildEnemyKit(enemy.pieceType, currentMap.levelZone)` (`WorldExploration.tsx` 11920) passes `{ name, minLevel, maxLevel }` (4683–4687). `Math.floor` is `NaN`; every kit stays zone 0. Admin `EnemyConfig` has no spell list (`types/admin.mo` 15–26). Summoner extras still `starterSpells.find(id === "summon-dire-wolf")` (11935–11941). |
| Achievement / challenge still Doka-only | `AchievementConfig` is `{ id, name, description, dokaReward, condition, active }` (`types/admin.mo` 249–256). `KNOWN_ACHIEVEMENT_CONDITIONS` is 15 keys (`adminSafety.ts` 306–322). Challenges stay `{ doka, xp, badge }`. Queued #996 still locks `boss_defeated` as never unlocking a spell. |
| Name heuristics still live | `OLD_SPELL_NAMES_SET` matches **name and id**, including live `physical_attack` (`WorldExploration.tsx` 2356–2389). Same id is in `OLD_SPELL_IDS` purge (`main.mo` 689–697). `summonSpawn.ts` 165: `spell.name.replace("Summon ", "")`. Queued #1018 `formatSummonDisplayName` title-cases `pieceType`; it is **not** persist `displayName`. |
| Three boss kit sources | Live combat: `data/bossKits.ts`. Motoko `defaultBossConfigs()` still lists purged ids (`admin.mo` 358+ `fireball`, `cursed_gust`, `entangle`, `mist_form`, …). Admin chips: `getSpellConfigs()`. Queued #818 / #887 / #929 / #934 / #980 / #996 name that split — they are not a fourth kit table. |
| Bar persist still upgrade-keys only | `setSpellBarOrder` filters to `spellLevelKeys` (`main.mo` 1945–1947). Queued #950 dual `activeSpells : ?[Nat]` vs `spellBarOrder : ?[Text]` and #1014 `legacyActiveSpellsMigrate.ts` are stale-schema locks, not `ownedSpellIds`. |
| Spell Save is a live overwrite | `adminSetSpellConfig` (`main.mo` 869–879). No `adminRollbackSpellConfig`. Queued #838 / #945 / #1001 types rollback / confirm-dismiss / confirm-chrome for **other** writers — **not** spells. |
| Enemy hard delete | `adminDeleteEnemyConfig` (`main.mo` 798–804) is unconditional `remove`. #1014 `enemyConfigHardDeletesWithoutReferenceCheck()` locks that fact. |
| Achievement delete | Progress present → `active=false`; else `remove`. Unlock rejects inactive. Official Claim UI hides `active=false` while `claimAchievementReward` still pays Doka (queued #828 sidecar). |
| Activate gate is still a payload clamp | Both validators reject `apCost < 1` (`adminGuard.mo` 380–382; `adminSafety.ts` 604–606) — live Timestep is `apCost: 0` (`spellData.ts` 216–226). Closed `knownSummonAI` / `knownPieceType` still omit `font` / `dummypost` / `pentaspan` / `septspan` (`adminGuard.mo` 363–373) and queued `octspan` / `gauntpost` / `sixspan` / `ninespan` / `poisepost` / `decspan` / `tallypost` / **`hendecaspan` / `scorepost`**. |
| `minLevel` is catalog copy, not a gate | `void_collapse` seeds `minLevel: 30` (`admin.mo` 190) and still hydrates a level-1 book. Queued #828 `spellMinLevelHydrate.ts` locks that fact. Do **not** start enforcing `minLevel` until `ownedSpellIds` exists (09-23-003). |
| Write landing | `useSpellQueries.ts` (293 lines) already calls `validateSpellConfig`. Extract `SpellEditor` here. Do not grow `AdminDashboard.tsx` (8 280 lines) until activate exists. |
| New stables | Later EOP file after `20260901`; bump `check-limit` (today **5**). Never amend a shipped `NewActor`. Queued #950 / #1014 do **not** approve a new required persist field. |
| Live summon cap | `ENEMY_SUMMON_CAP = 2` (`gameConstants.ts` 300). Oct Span (eight), Nine Span (nine), Dec Span (ten), and Hendeca Span (eleven) stay activate-blocked. |

`newSpell()` (`AdminDashboard.tsx` 85–134) still seeds cooldown + mechanic bools + empty summon fields and **omits `targetType`**. Default `usableByPlayer: true` still hydrates every account.

Delete confirm (`AdminDashboard.tsx` 3793–3794) still says the live spell is **removed immediately** and dependents **will break**. Toast is always `"Spell deleted"` (6166). Backend may have only flipped a bool.

Live tabs (5611–5626): Enemies, Regions, Player Sprites, Spells, Map Modifiers, Enemy Tiers, Visuals, Settings, Purchases, Achievements, Enemy Names, Bosses, Ad Boxes, Shop, Boss Rush. Still no Library / Discovery / Kits / Feats-as-graph / Graph / Versions. Queued #945 / #1001 helpers stay over those 15 live tabs.

### 2.2 Superseding rules (unchanged)

Lifecycle ≠ `usableByPlayer`. `PLAYER_LEARNABLE` ≠ the cast gate. `ENEMY_ONLY` / `BOSS_ONLY` stay `lifecycle = active` with `PLAYER_LEARNABLE = false`. Hard delete is legal **only** for `draft` with zero published revisions and zero refs. Already-owned retired spells keep `ownedSpellIds` / levels / bar; `upgradeSpell` stays legal for those ids; Spellbook shows a Retired seal; combat reads the frozen revision; new achievement grants skip a retired reward id and still pay Doka; live kits ignore retired ids at resolve (log once) and activate of a kit that still lists them is blocked.

Ownership migration (when 09-23-003 lands): seed `ownedSpellIds` from the innate four ∪ `spellLevelKeys` ∪ resolving `spellBarOrder` ids. **Do not** grant `getSpellConfigs()`. **Do not** grant the full `starterSpells` array. **Do not** grant Wave-9…16 unique ids, Pack Rank, Rank Fold, Pack Diag, Far Fold, Pack Orth, Leap Fold, Court Floor, Court Lag, Court Prime, Court Snuff, Pack File, Diag Fold, or any `ENEMY_ONLY` / `BOSS_ONLY` row because `usableByPlayer !== false`.

Default discovery (08-31 §4, still inert):

```
eligible unknown spell
  → enemy kit actually contains the id
  → enemy successfully casts it
  → observed (persist)
  → player wins that encounter
  → ownedSpellIds + root recap
```

Possession is not observation. Player-side summons do not observe. Hostile summons may. `upgradeSpell` is never the grant writer. Death-gated recap (#923) is not a victory commit. Lethal-reflect Life Drain that currently resurrects (#973) is not a victory commit either. Leftover-XP remount keep (#1036 / #1041 / #1043 / #1045 / #1046) is not a victory commit.

---

## 3. Queue union after #1007 (do not treat as landed)

| Sibling | What it actually is | Studio rule |
| :--- | :--- | :--- |
| [#1017](https://github.com/Mr-Melic/stralt/pull/1017) | Wave-16 SDE (`generationMin: 16`). Unique §11: `spell-ring-stride` … `spell-leap-fold`. `spell-pack-orth` is `ENEMY_ONLY`. `spell-leap-fold` is `BOSS_ONLY`. Extra rooms `ring_gallery` / `hepta_nave` / `frost_aisle` / `last_pulpit` / `rift_court`. Wave-16 family CORE is #906 unique + #953 (via #997), **not** unique §11. Unique §11 stay extras until Wave 18. Unique Wave-15 §11 (#962) stay extras until Wave 17. Same-day #1011 stamps as Wave **17** family CORE. Prime Gift is leftover AP **exactly 1** and leftover MP **exactly 1**. Cadence Cap is remaining `n>2` → 2. | Same rule as 10-24-160 for Wave-15. Do not pre-own `generationMin: 16` ids. Validator rejects `PLAYER_LEARNABLE=true` on Pack Orth / Leap Fold. Do not clone Score Mend / Cadence Snuff / Hendeca Span. |
| [#1011](https://github.com/Mr-Melic/stralt/pull/1011) | Wave-16 tactical. Ids: Score Mend, Cadence Snuff, Hendeca Span, Duel Turn, Score Hood / Sting / Step / Sill / Hold / Lend / Sip / Post / Bounce, Must Score, Verse Score, Court Snuff. Extra doors `score_cantor` / `snuff_precentor` / `span_hendeca` / `court_snuff_regent`. `summonAI: "hendecaspan"` / `"scorepost"`. Court Snuff is `NOT_PLAYER_LEARNABLE`. Hendeca Span counts as **eleven**; live cap is 2. Stamps as Wave **17** family CORE. | Do not clone unique §11. Court Snuff never enters `ownedSpellIds`. Do not activate Hendeca Span until occupy-weight / cap exists. Closed `knownSummonAI` must grow with 09-23-002 when those enums are real. Cadence Snuff is remaining `1→0` — **not** Cadence Rise (`1→2`), **not** Cadence Prime (`0→1`), **not** Cadence Cap (`n>2→2`). Score Mend is both-body leftover **sum === 4 AND unequal** — **not** Prime Gift (1/1) and **not** Tally Mend (sum === 3). |
| [#997](https://github.com/Mr-Melic/stralt/pull/997) | Wave-16 elite: 31 families. CORE = #906 unique (minus Pack Rank / Rank Fold / Cadence Floor) **and** #953 (minus Court Prime). SDE Wave-16 unique and #1011 stay Wave **18** / **17**. Dec Span still illegal while cap is 2. | Honour as CORE–SIGNATURE **ids**. Do not pre-own. Zone NaN still hides paper ADVANCED (09-23-010). Closed Pack Rank / Rank Fold / Pack Diag / Far Fold / Pack Orth / Leap Fold / Court Floor / Court Prime / Court Snuff stay `ENEMY_ONLY` / `BOSS_ONLY` / kit-only. |
| [#1004](https://github.com/Mr-Melic/stralt/pull/1004) | Wave-17 boss sheets + Rush **Table O**. Bosses `boot_subprior` / `purse_steward` / `tick_infirmarer` / `mute_notary`. Extra doors on leftover #636 Boot Lend / Purse Keep / Tick Plate / Last Mute. Spectacular `CHOIR_BOOT` / `NAVE_KEEP` / `NAVE_TICK` / `CHOIR_MUTE` stay `BOSS_ONLY`. Court Hinge / Court Stretch stay `NOT_PLAYER_LEARNABLE`. No new #137 spell ids. Table O is four post-Table-N rooms; never canister `roomIndex > 9`. | Closed signatures never enter `ownedSpellIds`. Do not add a fourth kit source. Do not restamp Wave-1…16 feat doors or #890 / #903 / #951 / #953 / #1011 extra doors. |
| [#1005](https://github.com/Mr-Melic/stralt/pull/1005) | Wave-15 synergy formations (drop 16) consuming #941 families (Poise Choir / Nine Plug / Knight Quad). Design only. Live `EnemyFamily` remains the original seven. Wave-16 families (#997) stay unfamilied for drop 17. | Consume CORE ids; clearing a formation is not a grant. Same class as 10-24-164 / #956. |
| [#1026](https://github.com/Mr-Melic/stralt/pull/1026) / [#1033](https://github.com/Mr-Melic/stralt/pull/1033) / [#1034](https://github.com/Mr-Melic/stralt/pull/1034) / [#1039](https://github.com/Mr-Melic/stralt/pull/1039) / [#1042](https://github.com/Mr-Melic/stralt/pull/1042) / [#1040](https://github.com/Mr-Melic/stralt/pull/1040) / [#1022](https://github.com/Mr-Melic/stralt/pull/1022) / [#1027](https://github.com/Mr-Melic/stralt/pull/1027) / [#1035](https://github.com/Mr-Melic/stralt/pull/1035) / [#1054](https://github.com/Mr-Melic/stralt/pull/1054) | Later kit-execute/decide sidecars: pack-heal approach with Frost then Inferno fallback, pack-heal backline-guard with Frost then Inferno, Paper Windstorm miss gated on `spell.range > 1`, `CURSE_ON_HIT` stat-all on dmg/res/healRecv, queen-ray / Lord of Static minion HP from `damageToTargets`, Starved Vampire Exsanguinated `healRecv` from stat healing, pack-caster wounded-retreat with Frost fallback (`wxEnemyCasterRetreatFrost.ts`). Keys are **metadata flags** (`healAmount`, `range`, `targetType`, `damageToTargets`, `debuffStat`), never `spell.name`. Unique files — no concatenate with #985/#989 `wxEnemyHealDecidePicker.ts`. | Persist those flags with 09-23-005. Union sidecars; one `export function` per name. Not grants. Hostile kit execute may observe (10-22-138); player execute must not. Paper Windstorm range is `spell.range`, never `"Paper Windstorm"` / Strike name. Leftover minion HP blocking `shouldAwardVictory` is not a grant. Caster retreat is not a grant. |
| [#1019](https://github.com/Mr-Melic/stralt/pull/1019) / [#1020](https://github.com/Mr-Melic/stralt/pull/1020) / [#1021](https://github.com/Mr-Melic/stralt/pull/1021) / [#1024](https://github.com/Mr-Melic/stralt/pull/1024) / [#1025](https://github.com/Mr-Melic/stralt/pull/1025) / [#1028](https://github.com/Mr-Melic/stralt/pull/1028) / [#1029](https://github.com/Mr-Melic/stralt/pull/1029) / [#1031](https://github.com/Mr-Melic/stralt/pull/1031) / [#1032](https://github.com/Mr-Melic/stralt/pull/1032) / [#1036](https://github.com/Mr-Melic/stralt/pull/1036) / [#1037](https://github.com/Mr-Melic/stralt/pull/1037) / [#1041](https://github.com/Mr-Melic/stralt/pull/1041) / [#1043](https://github.com/Mr-Melic/stralt/pull/1043) / [#1045](https://github.com/Mr-Melic/stralt/pull/1045) / [#1046](https://github.com/Mr-Melic/stralt/pull/1046) | More `saveBattleStats` remount skips (rename/upgrade wallet lie after GameKey / Boss Rush Doka keep; feat/GameKey wallet lie after shop/heal throw, spend, Boss Rush, victory, one-shot, GameKey, feat Doka keep; leftover-XP wipe after leftover-XP keep, after portal XP throw keep, after victory XP throw keep). Unique sidecar files vs 10-24 #986/#987/#992. #1045 and #1046 share `portalXpKeepRemountRenameSpendWriteSkip.ts` — union **one** `export function` per name, do not concatenate. | Same class as 10-24-166. Discovery must not piggy-back these skips. Union helpers; one `export function` per name. Leftover-XP keep is not `commitSpellDiscoveries`. |
| [#1015](https://github.com/Mr-Melic/stralt/pull/1015) / [#1050](https://github.com/Mr-Melic/stralt/pull/1050) | WDEAD 10-24 world/dungeon/encounter admin design. Occupancy / persist-keep rails continue after #932. 10-25 #1050 adds occupancy/remount rails that appeared after #1015 (walk-blocker / Creeping Ash / Ember Vein / Hunting Lantern; leftover-XP feat/GameKey + rename). Unique `*2026-10-25*` files. | Occupancy unseals / unique-corridor copies are not grants unless a named door is stamped. Distinct from 10-24-168 (#932 / #957 / #949). Do not overwrite #1015 `*2026-10-24*` or #1050 `*2026-10-25*` files. |
| [#1006](https://github.com/Mr-Melic/stralt/pull/1006) / [#1056](https://github.com/Mr-Melic/stralt/pull/1056) | ENC Gaunt/Even/Brick/Orth catalog (`ENC-GAUNT-01` / `ENC-BARE-01` / `ENC-EVEN-02` / `ENC-WAKE-01` / `ENC-GATE-03` / `ENC-TRI-01` / `ENC-DUMP-01` / `ENC-CURTAIN-01` / `ENC-GLYPH-01` / `ENC-ALMS-01` / `ENC-DEBT-01` / `ENC-PAIR-04` / `ENC-HOLD-05`). 10-25 #1056 is Poise/Knight/Pit/Spent (`ENC-TEACH-17` / `ENC-POISE-01` / `ENC-KNIGHT-01` / `ENC-PIT-02` / `ENC-SPENT-02` / `ENC-RUSH-63`…`66`). | Rooms may later be `SPECIAL_ENCOUNTER` stamps; clearing `ENC-*` does not append `ownedSpellIds`. Do not consume into SDE unique §11. `ENC-EVEN-02` is not Even Gait. `ENC-TRI-01` is not Hepta Oath. `ENC-POISE-01` is not Poise Mend. Do not overwrite #1056 `ENCOUNTER_EVOLUTION_2026-10-25.md`. |
| [#993](https://github.com/Mr-Melic/stralt/pull/993) | Already covered by 10-24-168. Wave-16 WDD (`WDD-2026-10-24-001`); world features still are not grants. | World features are not spell grants. Do not consume `WF-*` into unique §11 or extra doors. Do not overwrite #993 WDD dated files. |
| [#961](https://github.com/Mr-Melic/stralt/pull/961) / [#995](https://github.com/Mr-Melic/stralt/pull/995) | Already covered by 10-24-169. No new WX extract after #995. Later combat/heal helpers landed in `engine/*` (#1026/#1033/#1034/#1039/#1042). | Discovery helpers stay in `engine/*` / `utils/*`. Union WX call sites. Do not grow WX (19 213). Prefer those extracts over inlining observe/commit. |
| [#1001](https://github.com/Mr-Melic/stralt/pull/1001) / [#980](https://github.com/Mr-Melic/stralt/pull/980) / [#996](https://github.com/Mr-Melic/stralt/pull/996) / [#1044](https://github.com/Mr-Melic/stralt/pull/1044) / [#1055](https://github.com/Mr-Melic/stralt/pull/1055) | Admin UX: names-busy, role-grant, confirm-chrome, grant-link helpers. Does **not** restack `AdminDashboard.tsx`. #980 EBA 10-24 and #1044 EBA 10-25 re-audits are docs only, **no new EBA IDs**. #996 AFDA locks `boss_defeated` as never unlocking a spell (042). #1055 AFDA-043: Admin `effectParams` JSON round-trips; combat never parses `pushDistance` / `attractDistance` / `teleportMode`. | Confirm-chrome is not spell rollback. Unread `effectParams` is not mechanic-flag persist (09-23-005). Do not ship empty Discovery / Kits / Graph / Versions tabs. Do not add a fourth kit table. Do not overwrite #980 EBA or #996 AFDA `*2026-10-24*` files, or #1044 EBA / #1055 AFDA `*2026-10-25*` files. `boss_defeated` is not `spellRewardIds`. |
| [#1018](https://github.com/Mr-Melic/stralt/pull/1018) | UX: journey copy helpers plus `formatSummonDisplayName` (title-case `pieceType`). SpellbookModal / spawn still use `spell.name.replace("Summon ", "")`. | Empty-book / slot-disabled / summon title-case copy is not a catalog grant and is **not** persist `displayName`. Retired-owned still shows a Retired seal once 09-23-001 lands. |
| [#1014](https://github.com/Mr-Melic/stralt/pull/1014) | Persist: `catalogDeletePolicy` (retire-when-referenced is still `usableByPlayer=false`), `summonUnitDefPersist` (thin Motoko shape), `legacyActiveSpellsMigrate` (dual bar schema). Does **not** approve a new required persist field. | Dual bar / catalog-delete lock is not `ownedSpellIds` and not `lifecycle`. New observation maps still go through 09-23-016. Do not overwrite #1014 `*2026-10-24*` files. |
| [#999](https://github.com/Mr-Melic/stralt/pull/999) / [#958](https://github.com/Mr-Melic/stralt/pull/958) | Already covered by 10-24-173. No later AEE increment. Inspector lists modules by id. | Consume AEE / 09-23-010. Do not emit `shadow_strike`. Do not add a fourth kit table. Blood Mend `targetType: "self"` is metadata, not a name. Do not overwrite #999 AEE dated files. |
| [#982](https://github.com/Mr-Melic/stralt/pull/982) | CDA freeze: do not **ship** Wave-15/16 live catalog rows until Wave-1 ownership / observe / G resolve exist. #1017 / #1011 remain `STATUS: PROPOSED`. | Honour the freeze. This studio does not mint Wave-16 unique §11 into `starterSpells`. |
| [#1063](https://github.com/Mr-Melic/stralt/pull/1063) | Wave-17 tactical (`SPELL_PROPOSALS_2026-10-25.md`). Unique file. Stave Mend is both-body leftover **sum === 5**. Cadence Dock is remaining `n===2` → 0. Dodeca Span counts as **twelve** (cap 2 blocks). Hymn Turn inverts two allies (caster stays). Court Dock is `NOT_PLAYER_LEARNABLE`. Stamps as Wave **18** family CORE. Same-day Wave-17 SDE has not opened — if it later claims a unique leftover, SDE wins. | Do not pre-own. Do not clone #1011 / #1017 ids. Court Dock never enters `ownedSpellIds`. Do not activate Dodeca Span until occupy-weight / cap exists. Do not mint `spell-stave-gift` / `spell-cadence-deuce` / `spell-twelve-span`. Do not overwrite `SPELL_PROPOSALS_2026-10-25.md`. |
| [#1073](https://github.com/Mr-Melic/stralt/pull/1073) | Wave-17 elite: leftover SDE Wave-15 unique CORE (`spell-file-stride` … except Pack Diag / Far Fold) **and** Wave-16 tactical (`spell-score-mend` … except Court Snuff). Unique `ENEMY_ELITE_EVOLUTION_2026-10-25.md`. | Honour as CORE–SIGNATURE **ids**. Do not pre-own. Pack Diag / Far Fold / Court Snuff stay never-owned. Do not CORE Stave Mend / Cadence Dock / Dodeca Span (#1063). |
| [#1064](https://github.com/Mr-Melic/stralt/pull/1064) | WDD Wave-17 (`WDD-2026-10-25-001`) restacks `docs/WORLD_DYNAMICS.md` plus prior `ACTION_IDS_WDD_*`. | World features are not spell grants. Do not consume `WF-*` into unique §11. Do not restack `WORLD_DYNAMICS.md` from this studio. |
| [#1058](https://github.com/Mr-Melic/stralt/pull/1058) | Midnight Bishop merge with advertised `MAGIC_REFLECT` (`midnightBishopMagicReflectCommit.ts`). Metadata flag, never `spell.name`. | Persist with 09-23-005. Unique engine file; do not concatenate onto heal-decide picker. Not a grant. |
| [#1060](https://github.com/Mr-Melic/stralt/pull/1060) / [#1066](https://github.com/Mr-Melic/stralt/pull/1066) / [#1072](https://github.com/Mr-Melic/stralt/pull/1072) | Same-hour UX 10-25 copy helpers, Admin UX principal-gate/confirm-enter/reveal-mask/ban-reason, AEE 10-25 increment. Unique `*2026-10-25*` files. | Copy / confirm-enter / AI increment are not catalog grants, not `lifecycle`, not a fourth kit table. Do not overwrite those dated files. Inspector still lists modules by id (188). |

Still queued (do not re-issue): #564 `SpellSummonFields` (09-25), #568 linear⊕diagonal (09-25-055), 09-28-084…098, 09-29-099…115, 10-21-116…129, 10-22-130…144, 10-23-145…159, 10-24-160…174, #747 / #726 / #752 / #753 / #733 / #730 / #754 / #766 / #757 / #762 / #802 / #787 / #796 / #808 / #837 / #849 / #840 / #836 / #825 / #906 / #890 / #899 / #903 / #897 / #911 / #962 / #953 / #941 / #951 / #956.

Same-hour 10-24 flock also opened telemetry / PX / balance / long-horizon / Health skip / a11y / map integrity / content-diversity freeze. Those are not spell-studio work. Same-hour 10-25 flock (#1047 GTAD, #1048 TADD, #1049 EBMA, #1051 VAL, #1052 Expansion, #1053 TBC, #1057 dead-code) is the same class — unique `*2026-10-25*` files, not this studio. #942 / #982 CDA freeze Wave-16 HP clones — this studio does not mint Wave-17 unique §11 (that is the next SDE generation). 10-24 #991 Expansion / #994 TADD / #998 Master roadmap / #1000 dead-code / #1003 GFCF / #1008 PX / #1009 PERF / #1012 MIMA / #1016 long-horizon are not this studio; do not restamp their files or grow WX from #995.

---

## 4. Owner UI (dev-gated — still the 08-31 studio)

Carved-stone / slate / crimson. Same `#admin` + lazy `AdminDashboard` gate.

Immediate UI honesty (can land with persist 001/004, not a restyle):

- Delete on published ids is **Retire**. Confirm lists dependents. Toast must say retired vs rejected vs draft-deleted. Union #945 `shouldDismissOwnerConfirm` and #1001 confirm-chrome so Shop/GameKey/delete dialogs stay until `#ok`.
- Cast-gate checkboxes stay labeled “player may cast” / “enemy may cast.” Lifecycle is a separate control.
- Validation strip: missing `targetType`, broken kit id, name-heuristic leftover = crimson.
- Spell Type includes `summon`. Summon section: `summonAI`, lifespan, piece, scales, **displayName**, kit ids.
- `⌘K` (queued #838 / #945) stays over the 15 live tabs until activate exists. Do not ship empty Discovery / Kits / Graph / Versions / Challenges / AI / Formations tabs.

Do not grow the 8 280-line dashboard until activate exists on the canister (08-31 SDA-012 / 09-23-013 / 09-23-015). Extract `SpellEditor` onto `useSpellQueries.ts`. Do not grow `WorldExploration.tsx`. Restack AdminDashboard siblings as **one** extract.

Support still required and still missing: duplicate, compare versions, draft, validate (activate gate), activate, deactivate, dependency inspection, rollback.

---

## 5. Prior ACTION_ID status @ `0f5363f`

Unchanged from 09-23 § / 09-29 § / 10-21 § / 10-22 § / 10-23 § / 10-24 §:

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
| 10-22 130–144 | **OPEN** on #892. |
| 10-23 145–159 | **OPEN** on #940. |
| 10-24 160–174 | **OPEN** on #1007. |

---

## 6. Out of scope

- Production TypeScript / Motoko / Candid in this PR
- RAF, map generation, turn logic, damage math
- Growing `WorldExploration.tsx` or concatenating a second `export function` on restack
- Re-authoring Wave-1…17 spell cards or boss adaptations
- Treating `adminSafety.ts` helpers, #775 AUX copy, #810 stack rails, #838 five-writer rollback, #911 pack-kit fill, #945 confirm-dismiss, #1001 confirm-chrome, or #1014 catalog-delete lock as persist `lifecycle` / ownership
- Re-opening 09-01-002 bindgen work
- Re-issuing 09-21…10-24 IDs
- Editing Cursor dashboard prompts (no write API)
- Landing Wave-11 / Wave-12 / Wave-13 / Wave-14 / Wave-15 / Wave-16 catalog rows before 09-23-003
- Enforcing `SpellConfig.minLevel` at hydrate without `ownedSpellIds`
- Treating the merge freeze as “those drafts landed”
- Editing `MASTER_ROADMAP.md` (#338 / #783 / #814 / #870 / #946 / #998)
- Minting Wave-17 unique §11 (next SDE generation; #942 / #982 CDA freeze)
- Overwriting sibling `*2026-10-24*` files (#980 EBA, #996 AFDA, #997 elite, #999 AEE, #1005 formations, #1006 ENC, #1007 SDA, #1011 tactical, #1014 SDEG, #1015 WDEAD, #1017 SDE, #1018 UX)
- Overwriting sibling `*2026-10-25*` files (#1044 EBA, #1047 GTAD, #1048 TADD, #1049 EBMA, #1050 WDEAD, #1051 VAL, #1052 Expansion, #1053 TBC, #1055 AFDA, #1056 ENC, #1057 dead-code, #1060 UX, #1063 Wave-17 tactical, #1064 WDD, #1066 Admin UX, #1072 AEE, #1073 Wave-17 elite)

---

## 7. ACTION_ID index (this run)

All items: `STATUS: NEW`. Full records: [`ACTION_IDS_SDA_2026-10-25.md`](./ACTION_IDS_SDA_2026-10-25.md).

| ID | Title | Priority |
| :--- | :--- | :--- |
| SDA-2026-10-25-175 | Honour #1017 Wave-16 SDE stamps; do not pre-own generationMin 16 ids | P1 |
| SDA-2026-10-25-176 | Stamp #1011 Wave-16 tactical as Wave-17 CORE; Court Snuff never owned | P1 |
| SDA-2026-10-25-177 | Honour #997 Wave-16 elite CORE; zone NaN still hides ADVANCED | P1 |
| SDA-2026-10-25-178 | Honour #1004 Wave-17 boss / Rush Table O; closed signatures never owned | P1 |
| SDA-2026-10-25-179 | Honour #1005 Wave-15 formations; consume CORE ids, do not grant | P1 |
| SDA-2026-10-25-180 | Persist later kit-execute/decide metadata flags; union heal approach/guard and Paper Windstorm range | P1 |
| SDA-2026-10-25-181 | Remount skips continue after #1007; leftover-XP keep is not a victory commit | P1 |
| SDA-2026-10-25-182 | Grow closed `knownSummonAI` with hendecaspan / scorepost enums | P0 |
| SDA-2026-10-25-183 | Honour #1015/#1050 WDEAD / #1006/#1056 ENC / #993 WF; not grants | P1 |
| SDA-2026-10-25-184 | Keep later combat helpers in engine/\*; do not grow WorldExploration | P1 |
| SDA-2026-10-25-185 | Honour #1001 Admin UX helpers, #980/#1044 EBA re-audits, and #996/#1055 boss_defeated never unlocks; do not add empty studio tabs or a fourth kit source | P1 |
| SDA-2026-10-25-186 | Honour #1017 / #1011 / #1004 extra doors; first-grant only | P1 |
| SDA-2026-10-25-187 | Keep Prime Gift ≠ Score Mend and Cadence Cap ≠ Cadence Snuff | P0 |
| SDA-2026-10-25-188 | Honour #958 / #999 AI increment; inspector lists modules by id | P1 |
| SDA-2026-10-25-189 | Honour #1018 summon title-case / #1014 persist locks; not ownedSpellIds or lifecycle | P1 |
