# Spell, Discovery & Achievement Admin Design — 2026-10-26 re-audit

**Author:** Spell, Discovery & Achievement Admin Designer  
**Automation:** `4efa22ec-a498-11f1-a7d1-d6b4613131ce`  
**Date:** 2026-10-26  
**HEAD audited:** `0f5363f` (`Merge pull request #332`) — unchanged since the 09-21 re-audit  
**Scope:** Owner tooling for the complete spell ecosystem. **No production code in this PR.**

This is a **delta** on [`SPELL_ADMIN_DESIGN_2026-08-31.md`](./SPELL_ADMIN_DESIGN_2026-08-31.md) (#116). Sections 2–11 of that document remain the studio contract (canonical `SpellDefinition`, acquisition routes, observe→win→unlock, CORE–SIGNATURE pools, dependency views, soft-retire + legacy owned, studio tabs, persist sketch). 09-01 / 09-02 deltas still stand (bindgen 09-01-002 LANDED; empty-AI half of 09-02-006 LANDED).

It records what is still the wrong field on `main`, and the ACTION_IDs in [`ACTION_IDS_SDA_2026-10-26.md`](./ACTION_IDS_SDA_2026-10-26.md) (**190–204** only).

**Do not overwrite** still-open sibling files:

| PR | Files | IDs |
| :--- | :--- | :--- |
| [#353](https://github.com/Mr-Melic/stralt/pull/353) | `SPELL_ADMIN_DESIGN_2026-09-21.md`, `ACTION_IDS_SDA_2026-09-21.md` | 09-21 001–016 |
| [#398](https://github.com/Mr-Melic/stralt/pull/398) | 09-22 pair | 09-22 |
| [#473](https://github.com/Mr-Melic/stralt/pull/473) | 09-23 pair | **First-cuts `SDA-2026-09-23-001` … `028`** |
| [#515](https://github.com/Mr-Melic/stralt/pull/515) | 09-24 pair | 029–040 |
| [#570](https://github.com/Mr-Melic/stralt/pull/570) | 09-25 pair | 041–055 |
| [#630](https://github.com/Mr-Melic/stralt/pull/630) | 09-26 pair | 056–069 |
| [#677](https://github.com/Mr-Melic/stralt/pull/677) | 09-27 pair | 070–083 |
| [#729](https://github.com/Mr-Melic/stralt/pull/729) | 09-28 pair | 084–098 |
| [#791](https://github.com/Mr-Melic/stralt/pull/791) | 09-29 pair | 099–115 |
| [#815](https://github.com/Mr-Melic/stralt/pull/815) | 10-21 pair | 116–129 |
| [#892](https://github.com/Mr-Melic/stralt/pull/892) | 10-22 pair | 130–144 |
| [#940](https://github.com/Mr-Melic/stralt/pull/940) | 10-23 pair | 145–159 |
| [#1007](https://github.com/Mr-Melic/stralt/pull/1007) | 10-24 pair | 160–174 |
| [#1078](https://github.com/Mr-Melic/stralt/pull/1078) | 10-25 pair | 175–189 |

Same-hour 2026-10-26 flock already opened (unique dated files — **do not overwrite**): [#1108](https://github.com/Mr-Melic/stralt/pull/1108) TBC, [#1109](https://github.com/Mr-Melic/stralt/pull/1109) WX portal-cube extract, [#1110](https://github.com/Mr-Melic/stralt/pull/1110) VAL, [#1111](https://github.com/Mr-Melic/stralt/pull/1111) EBA re-audit (**no new EBA IDs**), [#1112](https://github.com/Mr-Melic/stralt/pull/1112) Expansion, [#1113](https://github.com/Mr-Melic/stralt/pull/1113) Pale Archivist Scroll HP stamp, [#1114](https://github.com/Mr-Melic/stralt/pull/1114) Wave-18 WDD, [#1115](https://github.com/Mr-Melic/stralt/pull/1115) Admin UX helpers + `ACTION_IDS_ADMIN_UX_2026-10-26.md`, [#1116](https://github.com/Mr-Melic/stralt/pull/1116) telemetry architecture, [#1117](https://github.com/Mr-Melic/stralt/pull/1117) Emergent Build, [#1118](https://github.com/Mr-Melic/stralt/pull/1118) Health skip, [#1119](https://github.com/Mr-Melic/stralt/pull/1119) dead-code, [#1120](https://github.com/Mr-Melic/stralt/pull/1120) CDA, [#1121](https://github.com/Mr-Melic/stralt/pull/1121) ENC Tally/Rank/Spike/Odd, [#1122](https://github.com/Mr-Melic/stralt/pull/1122) idle-juice RAF skip, [#1123](https://github.com/Mr-Melic/stralt/pull/1123) summon-hunter LoS Venom, [#1124](https://github.com/Mr-Melic/stralt/pull/1124) MASTER_ROADMAP (**do not touch**), [#1125](https://github.com/Mr-Melic/stralt/pull/1125) a11y floors, [#1126](https://github.com/Mr-Melic/stralt/pull/1126) SDEG helpers, [#1127](https://github.com/Mr-Melic/stralt/pull/1127) Spent Bridge snap, [#1128](https://github.com/Mr-Melic/stralt/pull/1128) WDEAD, [#1129](https://github.com/Mr-Melic/stralt/pull/1129) victory-Doka remount portal skip, [#1130](https://github.com/Mr-Melic/stralt/pull/1130) AFDA-044 unused `spellDmgGrowthPercent`, [#1131](https://github.com/Mr-Melic/stralt/pull/1131) MIMA, [#1132](https://github.com/Mr-Melic/stralt/pull/1132) Wave-18 tactical `SPELL_PROPOSALS_2026-10-26.md`, [#1133](https://github.com/Mr-Melic/stralt/pull/1133) GFCF, [#1134](https://github.com/Mr-Melic/stralt/pull/1134) Wave-17 formations drop 18, [#1135](https://github.com/Mr-Melic/stralt/pull/1135) AEE, [#1136](https://github.com/Mr-Melic/stralt/pull/1136) summon-walk tax, [#1137](https://github.com/Mr-Melic/stralt/pull/1137) UX copy helpers, [#1138](https://github.com/Mr-Melic/stralt/pull/1138) Wave-18 elite, [#1139](https://github.com/Mr-Melic/stralt/pull/1139) Wave-19 bosses / Table Q. Later this hour: Wave-18 SDE `*2026-10-26*` if they open. This PR only adds `SPELL_ADMIN_DESIGN_2026-10-26.md` and `ACTION_IDS_SDA_2026-10-26.md`.

Do not implement those IDs unless a human or orchestrator picks one. Do not grow `WorldExploration.tsx` (19 213 lines on HEAD). Never introduce spell-name heuristics. Next implementer still starts at **09-23-001**, then **007**, then **003+023**. Do not land Wave-9 / 10 / 11 / 12 / 13 / 14 / 15 / 16 / **17** catalog rows before 003. Persist maps go through **09-23-016** (new later EOP file after `20260901`; `check-limit = 5` today). Do not extend the `usableByPlayer=false` retire path.

---

## 1. Why this run exists

The 10-25 run closed the queue through #1078 (Wave-16 SDE/tactical/elite, Wave-17 bosses / Table O, later kit-execute/heal-decide, remount leftover-XP keep, `hendecaspan` / `scorepost` enums, SDE win on Prime Gift / Cadence Cap vs #1011). Same `HEAD`. Calendar is **2026-10-26**. `origin/main` has not moved since 2026-09-03 (`0f5363f`). The 10-25 audit’s “newest #1074 / 728+ open” snapshot is stale: later 10-25 combat / remount / soak sidecars plus Wave-17 SDE / Wave-18 bosses opened **#1075–#1107**. Open queue at this patch: **803+** drafts (TBC #1108 counted 776 through #1107; same-hour flock continued through **#1139**). Newest sibling before this work: **#1139** (Wave-19 bosses / Rush Table Q). Do not touch `MASTER_ROADMAP.md` (#870 / #946 / #998 / #1074 / **#1124** are pre-existing oldest-first conflicts on that file). Do not overwrite same-hour `*2026-10-25*` files (#1078 SDA, #1082 SDE, #1080 boss bible, #1101 CRC, #1106 quality audit) or `*2026-10-26*` siblings (#1108–#1139).

The product hole is unchanged: catalog still grants, discovery still does not exist, retirement is still a cast flag.

What *is* new for this studio is the flock **after** #1078 that 175–189 did not stamp: Wave-17 discovery (#1082, `generationMin: 17`, Pack Ring `ENEMY_ONLY`, Lane Fold `BOSS_ONLY`), Wave-18 bosses / Rush Table P (#1080), Wave-16 formations drop 17 (#1075), later kit-execute/decide sidecars (caster LoS Frost, healer retreat/LoS Frost, flanker/caster Strike retreat, summon-archer LoS Poison/Slow, Enthroned Void `DAMAGE_IMMUNE`, boss kit CHC, pack Crush/Fire Bolt CHC, same-hour summon-hunter LoS Venom #1123), remount one-shot skips after leftover-XP keep, Pale Archivist kit-first vs Pages / Scroll / Ink Veil plus #1113 Scroll HP stamp, same-hour ENC #1121 / WDD #1114 / Admin UX #1115, soak/reflect packets (#1079 Mirror Field, #1084 Void Mirror, #1097 Thorned Ground/Void Rift, #1100 leftover-walk lava/spikes), persist SDEG (#1083), content-retirement CRC (#1101), WX hazard-paint extract (#1076, queued shrink 19 213 → 19 117), and closed `knownSummonAI` still omitting `dodecaspan` (plus every earlier queued occupy enum).

The 08-31 contract is still the destination. The 10-26 IDs are queue-union only. Do not mint a second 001–189.

---

## 2. Current state (re-verified against `origin/main` @ `0f5363f`)

### 2.1 Still true — do not rediscover as new

| Fact | Where (this HEAD) |
| :--- | :--- |
| Bindgen + `toBackendSpellConfig` include Motoko summon fields | `backend.ts` 130–151; `adminContract.ts`. 09-01-002 **closed**. Motoko `SummonUnitDef` is still `pieceType` / `level` / `hpScale` / `damageScale` (`types/admin.mo` 85–90). Combat also needs `summonKit` / `ap` / `mp` (`summonSpawn.ts` 22–32). Queued #1014 `summonUnitDefPersist.ts` **locks** that thin shape; it is not 09-23-002. |
| Motoko + client reject empty `summonAI` when `isSummon` | `adminGuard.mo` 423–425; `adminSafety.ts` 625–628. Runtime still does `spell.summonAI \|\| "hunter"` (`summonSpawn.ts` 139) and `inferSummonArchetype` still falls back to `summon.name` (`enemyAI.ts` 203–224). |
| Validators accept `spellType="summon"` | `adminGuard.mo` 348–349; `adminSafety.ts` 611. Editor `<select>` is still damage / heal / drain (`AdminDashboard.tsx` 2675–2687). “Heal (targets self)” is a targeting lie — `targetType` has **zero** editor matches. |
| Lifecycle is still `usableByPlayer=false` | `adminDeleteSpellConfig` (`main.mo` 882–902) error copy still says “set usableByPlayer=false to retire it” (887). Soft-retire writes that flag when `_spellReferencedByPlayers` (273–284, **keys+bar only** via `_characterHasSpell` 253–270). Else `remove`. Queued #1014 `catalogDeletePolicy.ts` **locks** that retire-when-referenced path; it is not `lifecycle`. CRC #1101 lists **zero** ids `SAFE_TO_REMOVE` — do not twin CRC-001 onto 09-23-007. |
| `upgradeSpell` treats the same flag as “Spell is retired” | `main.mo` 1011. Owned-but-never-upgraded ids are not in `spellLevelKeys`, so the check blocks the legacy upgrade 08-31 §8.2 requires. Appearance cannot mint keys (`resolveAppearanceSpellLevels`). |
| Library helper is still inverted | `shouldIncludeBackendSpellInLibrary` (`adminSafety.ts` 712–718) returns true when `usableByPlayer !== false`. Wired at `WorldExploration.tsx` 2412–2440. `ownedIds` is `starterSpells` ∪ `spellLevelKeys` ∪ `spellBarOrder`. All 32 frontend ids are forced `isBaseSpell: true` (2395–2408). |
| No observation / unlock persist | No `ownedSpellIds`, `observedSpellIds`, `recordSpellObservation`, `commitSpellDiscoveries` under `src/` except the **argument name** `ownedSpellIds` on the inverted helper. Recap is still XP / Doka / feats. |
| No acquisition enum / three flags | Only `usableByPlayer` / `usableByEnemy` (`types/admin.mo` 117–118). No `ENEMY_DISCOVERY` … `SYSTEM_ONLY` in live types. No `OBSERVATION_REQUIRED` / `VICTORY_REQUIRED` / `PLAYER_LEARNABLE`. |
| Enemy pools hardcoded; zone always 0 | `ENEMY_KITS` is `Record<ChessPieceType, …>` (`enemyAI.ts` 163–185). `buildEnemyKit(enemy.pieceType, currentMap.levelZone)` (`WorldExploration.tsx` 11920) passes `{ name, minLevel, maxLevel }` (4683–4687). `Math.floor` is `NaN`; every kit stays zone 0. Admin `EnemyConfig` has no spell list (`types/admin.mo` 15–26). Summoner extras still `starterSpells.find(id === "summon-dire-wolf")` (11935–11941). |
| Achievement / challenge still Doka-only | `AchievementConfig` is `{ id, name, description, dokaReward, condition, active }` (`types/admin.mo` 249–256). `KNOWN_ACHIEVEMENT_CONDITIONS` is 15 keys (`adminSafety.ts` 306–322). Challenges stay `{ doka, xp, badge }`. Queued #996 still locks `boss_defeated` as never unlocking a spell. Queued #1083 `loot_10_doka` counter is a feat **count**, not a spell grant. |
| Name heuristics still live | `OLD_SPELL_NAMES_SET` matches **name and id**, including live `physical_attack` (`WorldExploration.tsx` 2356–2389). Same id is in `OLD_SPELL_IDS` purge (`main.mo` 689–697). `summonSpawn.ts` 165: `spell.name.replace("Summon ", "")`. Queued #1018 `formatSummonDisplayName` title-cases `pieceType`; it is **not** persist `displayName`. CRC-001 names the same Strike tombstone — consume 09-23-007, do not mint a second retire. |
| Three boss kit sources | Live combat: `data/bossKits.ts`. Motoko `defaultBossConfigs()` still lists purged ids (`admin.mo` 358+ `fireball`, `cursed_gust`, `entangle`, `mist_form`, …). Admin chips: `getSpellConfigs()`. Queued #818 / #887 / #929 / #934 / #980 / #996 / #1044 name that split — they are not a fourth kit table. |
| Bar persist still upgrade-keys only | `setSpellBarOrder` filters to `spellLevelKeys` (`main.mo` 1945–1947). Queued #950 dual `activeSpells : ?[Nat]` vs `spellBarOrder : ?[Text]` and #1014 `legacyActiveSpellsMigrate.ts` are stale-schema locks, not `ownedSpellIds`. |
| Spell Save is a live overwrite | `adminSetSpellConfig` (`main.mo` 869–879). No `adminRollbackSpellConfig`. Queued #838 / #945 / #1001 / #1066 types rollback / confirm-dismiss / confirm-chrome / principal-gate for **other** writers — **not** spells. |
| Enemy hard delete | `adminDeleteEnemyConfig` (`main.mo` 798–804) is unconditional `remove`. #1014 `enemyConfigHardDeletesWithoutReferenceCheck()` locks that fact. |
| Achievement delete | Progress present → `active=false`; else `remove`. Unlock rejects inactive. Official Claim UI hides `active=false` while `claimAchievementReward` still pays Doka (queued #828 sidecar). |
| Activate gate is still a payload clamp | Both validators reject `apCost < 1` (`adminGuard.mo` 380–382; `adminSafety.ts` 604–606) — live Timestep is `apCost: 0` (`spellData.ts` 216–226). Closed `knownSummonAI` / `knownPieceType` still omit `font` / `dummypost` / `pentaspan` / `septspan` (`adminGuard.mo` 363–373) and queued `octspan` / `gauntpost` / `sixspan` / `ninespan` / `poisepost` / `decspan` / `tallypost` / `hendecaspan` / `scorepost` / **`dodecaspan`**. |
| `minLevel` is catalog copy, not a gate | `void_collapse` seeds `minLevel: 30` (`admin.mo` 190) and still hydrates a level-1 book. Queued #828 `spellMinLevelHydrate.ts` locks that fact. Do **not** start enforcing `minLevel` until `ownedSpellIds` exists (09-23-003). |
| Write landing | `useSpellQueries.ts` (293 lines) already calls `validateSpellConfig`. Extract `SpellEditor` here. Do not grow `AdminDashboard.tsx` (8 280 lines) until activate exists. |
| New stables | Later EOP file after `20260901`; bump `check-limit` (today **5**). Never amend a shipped `NewActor`. Queued #950 / #1014 / #1083 do **not** approve a new required persist field. |
| Live summon cap | `ENEMY_SUMMON_CAP = 2` (`gameConstants.ts` 300). Oct Span (eight), Nine Span (nine), Dec Span (ten), Hendeca Span (eleven), and Dodeca Span (twelve) stay activate-blocked. |

`newSpell()` (`AdminDashboard.tsx` 85–134) still seeds cooldown + mechanic bools + empty summon fields and **omits `targetType`**. Default `usableByPlayer: true` still hydrates every account.

Delete confirm (`AdminDashboard.tsx` 3793–3794) still says the live spell is **removed immediately** and dependents **will break**. Toast is always `"Spell deleted"` (6166). Backend may have only flipped a bool.

Live tabs (5611–5626): Enemies, Regions, Player Sprites, Spells, Map Modifiers, Enemy Tiers, Visuals, Settings, Purchases, Achievements, Enemy Names, Bosses, Ad Boxes, Shop, Boss Rush. Still no Library / Discovery / Kits / Feats-as-graph / Graph / Versions. Queued #945 / #1001 / #1066 helpers stay over those 15 live tabs.

### 2.2 Superseding rules (unchanged)

Lifecycle ≠ `usableByPlayer`. `PLAYER_LEARNABLE` ≠ the cast gate. `ENEMY_ONLY` / `BOSS_ONLY` stay `lifecycle = active` with `PLAYER_LEARNABLE = false`. Hard delete is legal **only** for `draft` with zero published revisions and zero refs. Already-owned retired spells keep `ownedSpellIds` / levels / bar; `upgradeSpell` stays legal for those ids; Spellbook shows a Retired seal; combat reads the frozen revision; new achievement grants skip a retired reward id and still pay Doka; live kits ignore retired ids at resolve (log once) and activate of a kit that still lists them is blocked.

Ownership migration (when 09-23-003 lands): seed `ownedSpellIds` from the innate four ∪ `spellLevelKeys` ∪ resolving `spellBarOrder` ids. **Do not** grant `getSpellConfigs()`. **Do not** grant the full `starterSpells` array. **Do not** grant Wave-9…17 unique ids, Pack Rank, Rank Fold, Pack Diag, Far Fold, Pack Orth, Leap Fold, Pack Ring, Lane Fold, Court Floor, Court Lag, Court Prime, Court Snuff, Court Dock, Pack File, Diag Fold, or any `ENEMY_ONLY` / `BOSS_ONLY` row because `usableByPlayer !== false`.

Default discovery (08-31 §4, still inert):

```
eligible unknown spell
  → enemy kit actually contains the id
  → enemy successfully casts it
  → observed (persist)
  → player wins that encounter
  → ownedSpellIds + root recap
```

Possession is not observation. Player-side summons do not observe. Hostile summons may. `upgradeSpell` is never the grant writer. Death-gated recap (#923) is not a victory commit. Lethal-reflect Life Drain that currently resurrects (#973) is not a victory commit either. Leftover-XP remount keep (#1036 / #1041 / #1043 / #1045 / #1046 / #1088 / #1092 / #1099) is not a victory commit. Soaked Mirror Field / Void Mirror / Thorned Ground / leftover-walk lava (#1079 / #1084 / #1097 / #1100) is not a victory commit. Pale Archivist kit-first (#1089 / #1102 / #1105) is not a grant.

---

## 3. Queue union after #1078 (do not treat as landed)

| Sibling | What it actually is | Studio rule |
| :--- | :--- | :--- |
| [#1082](https://github.com/Mr-Melic/stralt/pull/1082) | Wave-17 SDE (`generationMin: 17`). Unique §11: `spell-tern-stride` … `spell-lane-fold`. `spell-pack-ring` is `ENEMY_ONLY` on `hoop_precentor`. `spell-lane-fold` is `BOSS_ONLY` on `lane_fold_regent`. Extra rooms `tern_gallery` / `octa_nave` / `bog_aisle` / `spawn_pulpit` / `belt_nave`. Wave-17 family CORE is #962 unique + #1011 (via #1073), **not** unique §11. Unique §11 stay extras until Wave 19. Unique Wave-16 §11 (#1017) stay extras until Wave 18. Same-day #1063 stamps as Wave **18** family CORE. Gait Gift is leftover AP **≥ 2 AND** leftover MP **= 0**. Cadence Tern is remaining `n>3` → 3. Prime Plate is leftover **1/1** negate. | Same rule as 10-25-175 for Wave-16. Do not pre-own `generationMin: 17` ids. Validator rejects `PLAYER_LEARNABLE=true` on Pack Ring / Lane Fold. Do not clone Stave Mend / Cadence Dock / Dodeca Span / Court Dock. |
| [#1063](https://github.com/Mr-Melic/stralt/pull/1063) / [#1132](https://github.com/Mr-Melic/stralt/pull/1132) | #1063 already covered by 10-25-176. Same-hour #1132 is Wave-**18** tactical (`SPELL_PROPOSALS_2026-10-26.md`): Sestet Mend leftover AP+MP **=== 6 AND unequal**; Cadence Tierce remaining CD `n===3` → `0`; Trideca Span occupy-weight **thirteen** (blocked at cap 2); Psalm Turn mixed invert; Court Tierce never owned. Extra doors `sestet_cantor` / `tierce_precentor` / `span_trideca` / `court_tierce_regent` (kit-only). Sestet family + Court Tierce stamp as Wave **19** family CORE. | Honour as distinct leftovers vs #1082 Gait Gift / Cadence Tern / Octa Oath. Do not alias onto Stave Mend / Cadence Dock / Dodeca Span. #1132 did **not** clone those holes. If a later Wave-18 SDE claims a unique leftover, **SDE wins**. Do not overwrite `SPELL_PROPOSALS_2026-10-25.md` or `SPELL_PROPOSALS_2026-10-26.md`. |
| [#1073](https://github.com/Mr-Melic/stralt/pull/1073) / [#1138](https://github.com/Mr-Melic/stralt/pull/1138) | Already covered by 10-25-177. Wave-17 elite CORE = leftover Wave-15 unique except Pack Diag / Far Fold **plus** #1011 except Court Snuff. Same-hour #1138 Wave-**18** elite (`ENEMY_ELITE_EVOLUTION_2026-10-26.md`): leftover Wave-16 SDE unique (#1017) except Pack Orth / Leap Fold **plus** #1063 except Court Dock. #1082 / #1132 stay Wave **19** family CORE. Dodeca Span skipped at cap 2. | Honour as CORE–SIGNATURE **ids**. Do not pre-own. Do not CORE Tern Stride / Gait Gift / Pack Ring (#1082) or Sestet Mend / Court Tierce (#1132). Zone NaN still hides paper ADVANCED (09-23-010). Do not overwrite `ENEMY_ELITE_EVOLUTION_2026-10-26.md`. |
| [#1080](https://github.com/Mr-Melic/stralt/pull/1080) / [#1139](https://github.com/Mr-Melic/stralt/pull/1139) | #1080 Wave-18 boss sheets + Rush **Table P**. Same-hour #1139 Wave-**19** bosses + Rush **Table Q**: `stride_chancellor` / `dual_treasurer` / `imprint_archdeacon` / `damp_provost`. Extra doors leftover #695 Stride Keep / Damp Sting, leftover #726 Dual Keep, leftover #787 Cadence Imprint. Spectacular `NAVE_STRIDE` / `NAVE_DUAL` / `CHOIR_IMPRINT` / `CHOIR_DAMP` stay `BOSS_ONLY`. No new #137 spell ids. Table P/Q are owner overlays; never canister `roomIndex > 9`. | Closed signatures never enter `ownedSpellIds`. Do not add a fourth kit source. Do not restamp Wave-1…18 feat doors. Do not remap `stride_bursar` / `dual_bursar` / `imprint_precentor` / `keep_bursar`. |
| [#1075](https://github.com/Mr-Melic/stralt/pull/1075) / [#1134](https://github.com/Mr-Melic/stralt/pull/1134) | #1075 Wave-16 synergy formations (drop 17) consuming #997 families. Same-hour #1134 Wave-17 formations drop 18 (`ENEMY_FORMATIONS_2026-10-26.md`, FSN-SCORE-STEP … FSN-SCORE-HOLD) consuming #1073 families. Design only. Live `EnemyFamily` remains the original seven. Hendeca Plug skipped at cap 2. | Consume CORE ids; clearing a formation is not a grant. Same class as 10-25-179 / #1005. Do not overwrite `ENEMY_FORMATIONS_2026-10-25.md` or `ENEMY_FORMATIONS_2026-10-26.md`. |
| [#1081](https://github.com/Mr-Melic/stralt/pull/1081) / [#1085](https://github.com/Mr-Melic/stralt/pull/1085) / [#1087](https://github.com/Mr-Melic/stralt/pull/1087) / [#1090](https://github.com/Mr-Melic/stralt/pull/1090) / [#1091](https://github.com/Mr-Melic/stralt/pull/1091) / [#1094](https://github.com/Mr-Melic/stralt/pull/1094) / [#1095](https://github.com/Mr-Melic/stralt/pull/1095) / [#1096](https://github.com/Mr-Melic/stralt/pull/1096) / [#1098](https://github.com/Mr-Melic/stralt/pull/1098) / [#1104](https://github.com/Mr-Melic/stralt/pull/1104) / [#1107](https://github.com/Mr-Melic/stralt/pull/1107) / [#1123](https://github.com/Mr-Melic/stralt/pull/1123) | Later kit-execute/decide sidecars: pack-caster LoS-reposition Frost (`wxEnemyCasterLosFrost.ts`), pack-heal fallback-retreat Frost, pack-flanker wounded-retreat Strike, pack-heal LoS Frost, pack-caster wounded-retreat Strike, Enthroned Void `DAMAGE_IMMUNE` (`enthronedVoidDamageImmuneCommit.ts`), auto-summon / WX summon-archer LoS Poison + Slow, boss kit damage advertised CHC (`bossKitDamageCritExecute.ts`), pack Crush/Fire Bolt fallback CHC (`packEnemyFallbackMeleeCrit.ts`), same-hour summon-hunter LoS-blocked Venom (`wxSummonHunterLosVenom.ts`). Keys are **metadata flags** (`healAmount`, `range`, `targetType`, `debuffStat`, `chc`, `DAMAGE_IMMUNE`, LoS), never `spell.name`. Unique files. #1095 `summonArcherLosPoison.ts` and #1096 `wxSummonArcherLosPoison.ts` are two leftovers — union **one** `export function` per name, do not concatenate. #1123 keys kit[1] `spell-venom-strike` **id** + Chebyshev `Number(range)`, never “Venom”. | Persist those flags with 09-23-005. Union sidecars; one `export function` per name. Not grants. Hostile kit execute may observe (10-22-138); player execute must not. Crush fallback keys `e-crush` / `e-firebolt` ids, never the display name “Crush”. Do not rebalance wolf AP or Venom cost. |
| [#1088](https://github.com/Mr-Melic/stralt/pull/1088) / [#1092](https://github.com/Mr-Melic/stralt/pull/1092) / [#1099](https://github.com/Mr-Melic/stralt/pull/1099) / [#1129](https://github.com/Mr-Melic/stralt/pull/1129) | More remount skips: leftover-XP wipe after one-shot Doka keep following victory XP throw / portal XP throw / leftover-XP keep, plus same-hour #1129 leftover-Doka wipe after portal persist following victory Doka keep (`victoryDokaKeepRemountPortalCreditWriteSkip.ts`). Unique sidecar files vs 10-25 #1045/#1046. | Same class as 10-25-181. Discovery must not piggy-back these skips. Union helpers; one `export function` per name. Leftover-XP / leftover-Doka / one-shot keep is not `commitSpellDiscoveries`. |
| [#1089](https://github.com/Mr-Melic/stralt/pull/1089) / [#1102](https://github.com/Mr-Melic/stralt/pull/1102) / [#1105](https://github.com/Mr-Melic/stralt/pull/1105) / [#1113](https://github.com/Mr-Melic/stralt/pull/1113) | Pale Archivist kit-first decide: phase-2 first-id Mark shadows Pages of Doom (`bossPagesOfDoomDecideCommit.ts`); odd-turn kit Mark shadows Scroll Summon (`bossScrollSummonDecideCommit.ts`); phase-1 Cursed Wound shadows Ink Veil (`bossInkVeilDecideCommit.ts`). Same-hour #1113 locks advertised SCROLL_SUMMON HP 30 vs WX stamp 20 (`bossScrollSummonHpCommit.ts`) and **does not restore decide**. Keys are kit **ids** (`spell-mark` / `spell-cursed-wound`), never `"Mark"` / `"Pages"`. Unique files vs #1058 Midnight Bishop Mirror / #1065 `spell_physical` remap. | Kit-first leftover is not a grant and not `lifecycle`. Scroll HP stamp is not a grant and not a victory commit. Do not remap `spell_physical` here. Hostile kit cast of Mark may observe once 09-23-009 exists; Pages / Scroll / Ink Veil abilities are not catalog ids. |
| [#1079](https://github.com/Mr-Melic/stralt/pull/1079) / [#1084](https://github.com/Mr-Melic/stralt/pull/1084) / [#1097](https://github.com/Mr-Melic/stralt/pull/1097) / [#1100](https://github.com/Mr-Melic/stralt/pull/1100) | Soak/reflect packets: Mirror Field 20% reflect through RES+Shield (`mirrorFieldReflectHit.ts`; **WX restack**), Void Mirror (`voidMirrorReflectHit.ts`), battle-walk Thorned Ground / Void Rift (`battleWalkHazardHit.ts`; **WX restack**), leftover-walk lava/spikes (`lavaSpikeWalkHit.ts`). Challenge HP uses HP actually lost. Lethal walk is not `shouldAwardVictory`. | Same class as 10-24-166 lethal-reflect. Soaked Untouchable is not `commitSpellDiscoveries`. #1079 / #1097 restack WX — this studio does not grow that file; union those call sites after they land. |
| [#1015](https://github.com/Mr-Melic/stralt/pull/1015) / [#1050](https://github.com/Mr-Melic/stralt/pull/1050) / [#1086](https://github.com/Mr-Melic/stralt/pull/1086) / [#1093](https://github.com/Mr-Melic/stralt/pull/1093) / [#1103](https://github.com/Mr-Melic/stralt/pull/1103) / [#1127](https://github.com/Mr-Melic/stralt/pull/1127) / [#1128](https://github.com/Mr-Melic/stralt/pull/1128) | WDEAD occupancy/remount rails already covered by 10-25-183. Later map snaps (Gutter Steam, Frost Pane, Triune Pads, Spent Bridge) are layout crumbs, not grants. Same-hour #1128 WDEAD (`WORLD_ENCOUNTER_ADMIN_DESIGN_2026-10-26.md`) ingests wave-17 / drop-17 / Table P — not a grant table. | Occupancy unseals / unique-corridor copies / crumb snaps are not grants unless a named door is stamped. Do not overwrite #1015 `*2026-10-24*` or #1050 `*2026-10-25*` or #1128 `*2026-10-26*` WDEAD files. |
| [#1006](https://github.com/Mr-Melic/stralt/pull/1006) / [#1056](https://github.com/Mr-Melic/stralt/pull/1056) / [#1121](https://github.com/Mr-Melic/stralt/pull/1121) | Already covered by 10-25-183. Same-hour #1121 is the eighteenth ENC catalog (`ENCOUNTER_EVOLUTION_2026-10-26.md`, `EED-2026-10-26-001`): Tally / Rank / Spike / Odd primer, leftover AP+MP === 3 Dual Keep, consumes drop-17 formations / Wave-17 WF / Rush Table P (`P0`–`P3`). Hold Dec Plug while cap is 2. | Rooms may later be `SPECIAL_ENCOUNTER` stamps; clearing `ENC-*` does not append `ownedSpellIds`. `ENC-POISE-01` is not Gait Gift. `ENC-KNIGHT-01` is not Tern Stride. `ENC-PIT-02` is not Mire Reel. Do not overwrite `ENCOUNTER_EVOLUTION_2026-10-26.md`. Do not consume ENC-TEACH-18 / ENC-SPELL-35 into unique §11. |
| [#993](https://github.com/Mr-Melic/stralt/pull/993) / [#1064](https://github.com/Mr-Melic/stralt/pull/1064) / [#1114](https://github.com/Mr-Melic/stralt/pull/1114) | Already covered by 10-25-183. Wave-16 / Wave-17 WDD. Same-hour #1114 Wave-18 WDD (`WDD-2026-10-26-001`: Pair Seam … Pair Draft). Ready Gate stays exploration-only. | World features are not spell grants. Do not consume `WF-*` into unique §11 or extra doors. Do not restack `WORLD_DYNAMICS.md`. Do not overwrite #1114 `*2026-10-26*` WDD files. |
| [#1076](https://github.com/Mr-Melic/stralt/pull/1076) / [#1109](https://github.com/Mr-Melic/stralt/pull/1109) / [#961](https://github.com/Mr-Melic/stralt/pull/961) / [#995](https://github.com/Mr-Melic/stralt/pull/995) | #1076 extracts hazard overlay paint (`mapHazardPaint.ts`); queued WX 19 213 → 19 117. Same-hour #1109 extracts in-battle portal cube paint (`battlePortalCube.ts`) and **shrinks** WX. No new WX extract after those except the soak restacks above. Later combat/heal helpers landed in `engine/*`. | Discovery helpers stay in `engine/*` / `utils/*`. Union WX call sites. Do not grow WX (19 213 on HEAD). Prefer those extracts over inlining observe/commit. Do not fold observe into `battlePortalCube` / `mapHazardPaint`. |
| [#1001](https://github.com/Mr-Melic/stralt/pull/1001) / [#1066](https://github.com/Mr-Melic/stralt/pull/1066) / [#980](https://github.com/Mr-Melic/stralt/pull/980) / [#996](https://github.com/Mr-Melic/stralt/pull/996) / [#1044](https://github.com/Mr-Melic/stralt/pull/1044) / [#1055](https://github.com/Mr-Melic/stralt/pull/1055) / [#1101](https://github.com/Mr-Melic/stralt/pull/1101) / [#1111](https://github.com/Mr-Melic/stralt/pull/1111) / [#1115](https://github.com/Mr-Melic/stralt/pull/1115) / [#1130](https://github.com/Mr-Melic/stralt/pull/1130) | Admin UX helpers already covered by 10-25-185. CRC 10-25 (#1101): **zero** ids `SAFE_TO_REMOVE`; CRC-001 is the live Strike tombstone (consume 09-23-007). `boss_defeated` stays 042. Unread `effectParams` stays 043. Same-hour #1111 EBA 10-26 is docs only, **no new EBA IDs**. Same-hour #1115 Admin UX is confirm-snapshot / mailto-secret / confirm-a11y / hit-target helpers + unique `ACTION_IDS_ADMIN_UX_2026-10-26.md` — **not wired**, not spell rollback. Same-hour #1130 AFDA-044: Settings persist `spellDmgGrowthPercent`; combat `calcScaledDamage` hardcodes `1.03 ** upgradeLevel` — unused knob, **not** mechanic-flag persist. | Confirm-chrome / confirm-snapshot is not spell rollback. Unused growth percent is not 09-23-005. CRC is not a fourth kit table and not `lifecycle`. Do not ship empty Discovery / Kits / Graph / Versions tabs. Do not overwrite #980 EBA / #996 AFDA `*2026-10-24*`, #1044 EBA / #1055 AFDA / #1101 CRC `*2026-10-25*`, or #1111 EBA / #1115 Admin UX / #1130 AFDA `*2026-10-26*` files. |
| [#1018](https://github.com/Mr-Melic/stralt/pull/1018) / [#1014](https://github.com/Mr-Melic/stralt/pull/1014) / [#1083](https://github.com/Mr-Melic/stralt/pull/1083) / [#1126](https://github.com/Mr-Melic/stralt/pull/1126) | UX summon title-case + persist catalog-delete lock already covered by 10-25-189. #1083 SDEG: ground-Doka feat counter on commit, HUD principal key, shrine/covenant localStorage, shop-package hard-delete. Same-hour #1126 SDEG (`ACTION_IDS_SDEG_2026-10-26.md`): explorer portal-counter, version-gate boss-config keep, spell-upgrade Infinity debit freeze. Explicitly **no** `ownedSpellIds`. Does **not** approve a new required persist field. | Dual bar / catalog-delete / loot_10 / explorer counter / upgrade-cost freeze is not `ownedSpellIds` and not `lifecycle`. New observation maps still go through 09-23-016. Do not overwrite #1014 `*2026-10-24*` or #1083 `*2026-10-25*` or #1126 `*2026-10-26*` SDEG files. |
| [#999](https://github.com/Mr-Melic/stralt/pull/999) / [#1072](https://github.com/Mr-Melic/stralt/pull/1072) / [#1135](https://github.com/Mr-Melic/stralt/pull/1135) | Already covered by 10-25-188. Same-hour #1135 AEE (`ENEMY_AI_EVOLUTION_2026-10-26.md`, SYS-108…113 / FUT-126…131) is design only — kit Strike SP×RES, hunter LoS-blocked venom, summon applyCast no LoS re-check. Inspector lists modules by id. | Consume AEE / 09-23-010. Do not emit `shadow_strike`. Do not add a fourth kit table. Do not overwrite #1072 or #1135 AEE dated files. |
| [#982](https://github.com/Mr-Melic/stralt/pull/982) / [#942](https://github.com/Mr-Melic/stralt/pull/942) | CDA freeze: do not **ship** Wave-15/16 live catalog rows until Wave-1 ownership / observe / G resolve exist. #1082 / #1063 remain `STATUS: PROPOSED`. | Honour the freeze. This studio does not mint Wave-17 unique §11 into `starterSpells`. |

Still queued (do not re-issue): #564 `SpellSummonFields` (09-25), #568 linear⊕diagonal (09-25-055), 09-28-084…098, 09-29-099…115, 10-21-116…129, 10-22-130…144, 10-23-145…159, 10-24-160…174, 10-25-175…189, #747 / #726 / #752 / #753 / #733 / #730 / #754 / #766 / #757 / #762 / #802 / #787 / #796 / #808 / #837 / #849 / #840 / #836 / #825 / #906 / #890 / #899 / #903 / #897 / #911 / #962 / #953 / #941 / #951 / #956 / #997 / #1004 / #1005 / #1011 / #1017 / #1063 / #1073.

Same-hour 10-25 flock also opened telemetry / PX / balance / long-horizon / Health skip / a11y / map integrity / content-diversity freeze / quality audit (#1106). Those are not spell-studio work. Unique `*2026-10-25*` files, not this studio. #942 / #982 CDA freeze Wave-16 HP clones — this studio does not mint Wave-18 unique §11 (that is the next SDE generation). Do not restamp their files or grow WX from #995 / #1076 / #1079 / #1097.

---

## 4. Owner UI (dev-gated — still the 08-31 studio)

Carved-stone / slate / crimson. Same `#admin` + lazy `AdminDashboard` gate.

Immediate UI honesty (can land with persist 001/004, not a restyle):

- Delete on published ids is **Retire**. Confirm lists dependents. Toast must say retired vs rejected vs draft-deleted. Union #945 `shouldDismissOwnerConfirm` and #1001 / #1066 confirm-chrome so Shop/GameKey/delete dialogs stay until `#ok`.
- Cast-gate checkboxes stay labeled “player may cast” / “enemy may cast.” Lifecycle is a separate control.
- Validation strip: missing `targetType`, broken kit id, name-heuristic leftover = crimson.
- Spell Type includes `summon`. Summon section: `summonAI`, lifespan, piece, scales, **displayName**, kit ids.
- `⌘K` (queued #838 / #945) stays over the 15 live tabs until activate exists. Do not ship empty Discovery / Kits / Graph / Versions / Challenges / AI / Formations tabs.

Do not grow the 8 280-line dashboard until activate exists on the canister (08-31 SDA-012 / 09-23-013 / 09-23-015). Extract `SpellEditor` onto `useSpellQueries.ts`. Do not grow `WorldExploration.tsx`. Restack AdminDashboard siblings as **one** extract.

Support still required and still missing: duplicate, compare versions, draft, validate (activate gate), activate, deactivate, dependency inspection, rollback.

---

## 5. Prior ACTION_ID status @ `0f5363f`

Unchanged from 09-23 § / 09-29 § / 10-21 § / 10-22 § / 10-23 § / 10-24 § / 10-25 §:

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
| 10-25 175–189 | **OPEN** on #1078. |

---

## 6. Out of scope

- Production TypeScript / Motoko / Candid in this PR
- RAF, map generation, turn logic, damage math
- Growing `WorldExploration.tsx` or concatenating a second `export function` on restack
- Re-authoring Wave-1…18 spell cards or boss adaptations
- Treating `adminSafety.ts` helpers, #775 AUX copy, #810 stack rails, #838 five-writer rollback, #911 pack-kit fill, #945 confirm-dismiss, #1001 confirm-chrome, #1014 catalog-delete lock, or #1083 loot_10 helpers as persist `lifecycle` / ownership
- Re-opening 09-01-002 bindgen work
- Re-issuing 09-21…10-25 IDs
- Editing Cursor dashboard prompts (no write API)
- Landing Wave-11 / Wave-12 / Wave-13 / Wave-14 / Wave-15 / Wave-16 / Wave-17 catalog rows before 09-23-003
- Enforcing `SpellConfig.minLevel` at hydrate without `ownedSpellIds`
- Treating the merge freeze as “those drafts landed”
- Editing `MASTER_ROADMAP.md` (#338 / #783 / #814 / #870 / #946 / #998 / #1074 / **#1124**)
- Minting Wave-18 unique §11 (next SDE generation; #942 / #982 CDA freeze)
- Overwriting sibling `*2026-10-24*` files (#980 EBA, #996 AFDA, #997 elite, #999 AEE, #1005 formations, #1006 ENC, #1007 SDA, #1011 tactical, #1014 SDEG, #1015 WDEAD, #1017 SDE, #1018 UX)
- Overwriting sibling `*2026-10-25*` files (#1044 EBA, #1050 WDEAD, #1055 AFDA, #1056 ENC, #1060 UX, #1063 Wave-17 tactical, #1064 WDD, #1066 Admin UX, #1072 AEE, #1073 Wave-17 elite, #1078 SDA, #1080 boss bible, #1082 SDE, #1083 SDEG, #1101 CRC, #1106 quality audit)
- Overwriting sibling `*2026-10-26*` files opened this hour (#1108–#1139, including `SPELL_PROPOSALS_2026-10-26.md`, `ENEMY_FORMATIONS_2026-10-26.md`, `ENEMY_ELITE_EVOLUTION_2026-10-26.md`, `ENEMY_AI_EVOLUTION_2026-10-26.md`, `ACTION_IDS_ADMIN_UX_2026-10-26.md`, `ACTION_IDS_SDEG_2026-10-26.md`, `ACTION_IDS_WDEAD_2026-10-26.md`, `ACTION_IDS_AFDA_2026-10-26.md`, `ACTION_IDS_AEE_2026-10-26.md`, `ENCOUNTER_EVOLUTION_2026-10-26.md`, and later Wave-18 SDE)

---

## 7. ACTION_ID index (this run)

All items: `STATUS: NEW`. Full records: [`ACTION_IDS_SDA_2026-10-26.md`](./ACTION_IDS_SDA_2026-10-26.md).

| ID | Title | Priority |
| :--- | :--- | :--- |
| SDA-2026-10-26-190 | Honour #1082 Wave-17 SDE stamps; do not pre-own generationMin 17 ids | P1 |
| SDA-2026-10-26-191 | Honour #1080 Wave-18 boss / Rush Table P; closed signatures never owned | P1 |
| SDA-2026-10-26-192 | Honour #1075 Wave-16 formations; consume CORE ids, do not grant | P1 |
| SDA-2026-10-26-193 | Persist later kit-execute/decide metadata flags; union caster LoS Frost, summon-archer Poison, and Crush CHC | P1 |
| SDA-2026-10-26-194 | Remount skips continue after #1078; leftover-XP / one-shot keep is not a victory commit | P1 |
| SDA-2026-10-26-195 | Grow closed `knownSummonAI` with dodecaspan enum | P0 |
| SDA-2026-10-26-196 | Honour #1015/#1050 WDEAD / later map snaps / #1006/#1056 ENC / #993/#1064 WF; not grants | P1 |
| SDA-2026-10-26-197 | Keep later combat helpers in engine/\*; do not grow WorldExploration | P1 |
| SDA-2026-10-26-198 | Honour #1082 / #1080 extra doors; first-grant only | P1 |
| SDA-2026-10-26-199 | Keep Gait Gift ≠ Stave Mend and Cadence Tern ≠ Cadence Dock | P0 |
| SDA-2026-10-26-200 | Honour Admin UX helpers, EBA/AFDA re-audits, and #1101 CRC zero SAFE_TO_REMOVE; do not add empty studio tabs or a fourth kit source | P1 |
| SDA-2026-10-26-201 | Honour #1083 persist locks; not ownedSpellIds or lifecycle | P1 |
| SDA-2026-10-26-202 | Honour Pale Archivist kit-first leftovers; kit ids are not grants | P1 |
| SDA-2026-10-26-203 | Soak/reflect packets are not a victory commit | P1 |
| SDA-2026-10-26-204 | Honour #958 / #999 / #1072 AI increment; inspector lists modules by id | P1 |
