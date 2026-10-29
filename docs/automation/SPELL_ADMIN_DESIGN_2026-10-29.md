# Spell, Discovery & Achievement Admin Design — 2026-10-29 re-audit

**Author:** Spell, Discovery & Achievement Admin Designer  
**Automation:** `4efa22ec-a498-11f1-a7d1-d6b4613131ce`  
**Date:** 2026-10-29  
**HEAD audited:** `0f5363f` (`Merge pull request #332`) — unchanged since the 09-21 re-audit  
**Scope:** Owner tooling for the complete spell ecosystem. **No production code in this PR.**

This is a **delta** on [`SPELL_ADMIN_DESIGN_2026-08-31.md`](./SPELL_ADMIN_DESIGN_2026-08-31.md) (#116). Sections 2–11 of that document remain the studio contract (canonical `SpellDefinition`, acquisition routes, observe→win→unlock, CORE–SIGNATURE pools, dependency views, soft-retire + legacy owned, studio tabs, persist sketch). 09-01 / 09-02 deltas still stand (bindgen 09-01-002 LANDED; empty-AI half of 09-02-006 LANDED).

It records what is still the wrong field on `main`, and the ACTION_IDs in [`ACTION_IDS_SDA_2026-10-29.md`](./ACTION_IDS_SDA_2026-10-29.md) (**235–249** only).

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
| [#1140](https://github.com/Mr-Melic/stralt/pull/1140) | 10-26 pair | 190–204 |
| [#1187](https://github.com/Mr-Melic/stralt/pull/1187) | 10-27 pair | 205–219 |
| [#1226](https://github.com/Mr-Melic/stralt/pull/1226) | 10-28 pair | 220–234 |

Same-hour and later 2026-10-28 flock already opened (unique dated files — **do not overwrite**): [#1226](https://github.com/Mr-Melic/stralt/pull/1226) SDA 220–234, [#1255](https://github.com/Mr-Melic/stralt/pull/1255) Wave-20 SDE (`SPELL_DISCOVERY_ECOSYSTEM_2026-10-28.md`, `ACTION_IDS_SDE_2026-10-28.md`), [#1251](https://github.com/Mr-Melic/stralt/pull/1251) Wave-20 tactical (`SPELL_PROPOSALS_2026-10-28.md`), [#1248](https://github.com/Mr-Melic/stralt/pull/1248) Wave-20 elite, [#1244](https://github.com/Mr-Melic/stralt/pull/1244) Wave-21 bosses / Table S, [#1237](https://github.com/Mr-Melic/stralt/pull/1237) Wave-19 formations drop 20, plus later 10-28 sidecars [#1218](https://github.com/Mr-Melic/stralt/pull/1218)–[#1276](https://github.com/Mr-Melic/stralt/pull/1276). Same-hour 2026-10-29 flock uses unique dated filenames — **do not overwrite** any `*2026-10-29*` sibling (Wave-21 SDE / Wave-21 tactical / Wave-21 elite / Wave-22 bosses / drop-21 formations / ENC / WDD / WDEAD / SDEG / AEE / AFDA / Admin UX / MASTER_ROADMAP if they open). This PR only adds `SPELL_ADMIN_DESIGN_2026-10-29.md` and `ACTION_IDS_SDA_2026-10-29.md`.

Do not implement those IDs unless a human or orchestrator picks one. Do not grow `WorldExploration.tsx` (19 213 lines on HEAD). Never introduce spell-name heuristics. Next implementer still starts at **09-23-001**, then **007**, then **003+023**. Do not land Wave-9 / 10 / 11 / 12 / 13 / 14 / 15 / 16 / 17 / 18 / 19 / **20** catalog rows before 003. Persist maps go through **09-23-016** (new later EOP file after `20260901`; `check-limit = 5` today). Do not extend the `usableByPlayer=false` retire path.

---

## 1. Why this run exists

The 10-28 run closed the queue through #1226 (Wave-19 SDE/tactical/elite, Wave-20 bosses / Table R, anticipated Wave-21 / Table S, later kit-execute/decide, remount leftover-Doka / leftover spell-level keep, `tetradecaspan` enum, SDE win on Thin Gift / Cadence Quint vs #1177 Septet Mend / Cadence Quarte and vs #1143 Wide Gift / Cadence Quad). Same `HEAD`. Calendar is **2026-10-29**. `origin/main` has not moved since 2026-09-03 (`0f5363f`). The 10-28 audit’s “newest #1217 / 886+ open” snapshot is stale: later 10-28 Wave-20 SDE plus combat / remount / soak / a11y sidecars opened **#1218–#1276**. Open queue at this patch: **945** drafts. Newest sibling before this work: **#1276** (remount inventory keep after shop `saveBattleStats` throw-after-accept). Do not touch `MASTER_ROADMAP.md` (#870 / #946 / #998 / #1074 / #1124 / #1186 / **#1254** are pre-existing oldest-first conflicts on that file). Do not overwrite #1226 SDA `*2026-10-28*` files, #1255 Wave-20 SDE `*2026-10-28*` files, or same-hour `*2026-10-29*` siblings.

The product hole is unchanged: catalog still grants, discovery still does not exist, retirement is still a cast flag.

What *is* new for this studio is the flock **after** #1226 that 220–234 did not stamp as landed catalog: Wave-20 discovery (#1255, `generationMin: 20`, Pack Giraffe `ENEMY_ONLY`, Giraffe Fold `BOSS_ONLY`, Deep Gift leftover AP **=== 1 AND** leftover MP **≥ 2** heal, Cadence Sext remaining `n>6` → 6), Wave-20 tactical as Wave **21** family CORE (#1251 Octave Mend leftover **sum === 8 AND unequal**, Cadence Quinte `n===5` → 0, Pentadeca Span occupy 15, Court Quinte never owned), Wave-20 elite CORE (#1248 leftover #1143 except Pack Hook / Hook Fold **plus** #1177 except Court Quarte), Wave-21 bosses / Rush Table S (#1244, now confirmed), Wave-19 formations drop 20 (#1237), leftover spell-bar remount skip (#1268), leftover inventory remount skip (#1276), leftover spell-level remount skip continues (#1239 restack of #1215), later leftover-Doka still not a victory commit, kit-execute/modifier leftovers (#1252 Glass Realm pack melee ×2, #1257 pack SR soak, #1262 boss SR soak, #1266 player Mirror vs boss kit, #1272 Paper Windstorm miss, #1259 Enthroned Void phantom contact, #1220/#1264 Final Pawn ghost-summon, #1231/#1271 Fetid Rook split, #1273 Pale Archivist scroll-summon, #1234 Enthroned Void last-turn AP Drain), summon-control dest chain (#1238 / #1260 / #1263 / #1270 / #1274 / #1267), kit-first leftovers (#1247 Final Pawn Strike, #1261 Fetid Rook Venom), map snaps (#1229 Raise Slab, #1258 Ratchet Cog, #1265 Turnstile Ember, #1275 Twin Sparks), ENC #1249, WDD #1235, WDEAD #1236, SDEG #1253 (`DEFAULT_CHALLENGES` catalog persist is not `ownedSpellIds`), AEE #1240, AFDA #1230, Admin UX #1223, WX extract #1241, Broodmother summon-cap Archer #1269. Closed `knownSummonAI` still omits every queued occupy enum. Wave-20 unique Undeca Oath is a Chebyshev-11 **spell gate**, not occupy 11.

The 08-31 contract is still the destination. The 10-29 IDs are queue-union only. Do not mint a second 001–234.

---

## 2. Current state (re-verified against `origin/main` @ `0f5363f`)

### 2.1 Still true — do not rediscover as new

| Fact | Where (this HEAD) |
| :--- | :--- |
| Bindgen + `toBackendSpellConfig` include Motoko summon fields | `backend.ts` 130–151; `adminContract.ts`. 09-01-002 **closed**. Motoko `SummonUnitDef` is still `pieceType` / `level` / `hpScale` / `damageScale` (`types/admin.mo` 85–90). Combat also needs `summonKit` / `ap` / `mp` (`summonSpawn.ts` 22–32). Queued #1014 `summonUnitDefPersist.ts` **locks** that thin shape; it is not 09-23-002. |
| Motoko + client reject empty `summonAI` when `isSummon` | `adminGuard.mo` 423–425; `adminSafety.ts` 625–628. Runtime still does `spell.summonAI \|\| "hunter"` (`summonSpawn.ts` 139) and `inferSummonArchetype` still falls back to `summon.name` (`enemyAI.ts` 203–224). |
| Validators accept `spellType="summon"` | `adminGuard.mo` 348–349; `adminSafety.ts` 611. Editor `<select>` is still damage / heal / drain (`AdminDashboard.tsx` 2675–2687). “Heal (targets self)” is a targeting lie — `targetType` has **zero** editor matches. |
| Lifecycle is still `usableByPlayer=false` | `adminDeleteSpellConfig` (`main.mo` 882–902) error copy still says “set usableByPlayer=false to retire it” (887). Soft-retire writes that flag when `_spellReferencedByPlayers` (keys+bar only). Else `remove`. Queued #1014 `catalogDeletePolicy.ts` **locks** that retire-when-referenced path; it is not `lifecycle`. Queued #1223 `adminOwnerUx.spellDeleteCopy.ts` **locks retire-vs-remove copy** and is **not wired** — not 09-23-001. CRC #1101 lists **zero** ids `SAFE_TO_REMOVE` — do not twin CRC-001 onto 09-23-007. |
| `upgradeSpell` treats the same flag as “Spell is retired” | `main.mo` ~1011. Owned-but-never-upgraded ids are not in `spellLevelKeys`, so the check blocks the legacy upgrade 08-31 §8.2 requires. Appearance cannot mint keys (`resolveAppearanceSpellLevels`). Queued #1215 / #1239 leftover spell-level remount skip is a **retry skip**, not a grant writer. |
| Library helper is still inverted | `shouldIncludeBackendSpellInLibrary` (`adminSafety.ts` 712–718) returns true when `usableByPlayer !== false`. Wired at `WorldExploration.tsx` 2410–2440. `ownedIds` is `starterSpells` ∪ `spellLevelKeys` ∪ `spellBarOrder`. All 32 frontend ids are forced `isBaseSpell: true` (2395–2408). Queued #1171 `spellMasterBarCount.ts` locks that hydrate **pads** empty bar slots from that same library — discovery grants later would auto-complete Spell Master. |
| No observation / unlock persist | No `ownedSpellIds`, `observedSpellIds`, `recordSpellObservation`, `commitSpellDiscoveries` under `src/` except the **argument name** `ownedSpellIds` on the inverted helper. Recap is still XP / Doka / feats. |
| No acquisition enum / three flags | Only `usableByPlayer` / `usableByEnemy` (`types/admin.mo` 117–118). No `ENEMY_DISCOVERY` … `SYSTEM_ONLY` in live types. No `OBSERVATION_REQUIRED` / `VICTORY_REQUIRED` / `PLAYER_LEARNABLE`. |
| Enemy pools hardcoded; zone always 0 | `ENEMY_KITS` is `Record<ChessPieceType, …>` (`enemyAI.ts` 163–185). `buildEnemyKit(enemy.pieceType, currentMap.levelZone)` (`WorldExploration.tsx` 11920) passes `{ name, minLevel, maxLevel }` (4683–4687). `Math.floor` is `NaN`; every kit stays zone 0. Admin `EnemyConfig` has no spell list (`types/admin.mo` 15–26). Summoner extras still `starterSpells.find(id === "summon-dire-wolf")`. |
| Achievement / challenge still Doka-only | `AchievementConfig` is `{ id, name, description, dokaReward, condition, active }` (`types/admin.mo` 249–256). `KNOWN_ACHIEVEMENT_CONDITIONS` is 15 keys (`adminSafety.ts` 306–322). Challenges stay `{ doka, xp, badge }`. Queued #996 still locks `boss_defeated` as never unlocking a spell. Queued #1083 `loot_10_doka` counter is a feat **count**, not a spell grant. Queued #1171 `spell_master_8` occupancy is a feat **count**, not a spell grant. Queued #1253 `challengeCatalogPersist.ts` locks that battle-challenge ids live only in `DEFAULT_CHALLENGES` — **no ownership, discovery, or alias table**. |
| Name heuristics still live | `OLD_SPELL_NAMES_SET` matches **name and id**, including live `physical_attack` (`WorldExploration.tsx` 2356–2389). Same id is in `OLD_SPELL_IDS` purge (`main.mo` 689–697). `summonSpawn.ts` 165: `spell.name.replace("Summon ", "")`. Queued #1018 `formatSummonDisplayName` title-cases `pieceType`; it is **not** persist `displayName`. CRC-001 names the same Strike tombstone — consume 09-23-007, do not mint a second retire. |
| Three boss kit sources | Live combat: `data/bossKits.ts`. Motoko `defaultBossConfigs()` still lists purged ids (`admin.mo` 358+ `fireball`, `cursed_gust`, `entangle`, `mist_form`, …). Admin chips: `getSpellConfigs()`. Queued #818 / #887 / #929 / #934 / #980 / #996 / #1044 / #1111 / #1163 / **#1218** name that split — they are not a fourth kit table. |
| Bar persist still upgrade-keys only | `setSpellBarOrder` filters to `spellLevelKeys` (`main.mo` 1945–1947). Queued #950 dual `activeSpells` vs `spellBarOrder`, #1014 `legacyActiveSpellsMigrate.ts`, and #1268 leftover **bar keep** are stale-schema / remount locks, not `ownedSpellIds`. |
| Spell Save is a live overwrite | `adminSetSpellConfig` (`main.mo` 869–879). No `adminRollbackSpellConfig`. Queued #838 / #945 / #1001 / #1066 / #1115 / #1190 / **#1223** types rollback / confirm-dismiss / confirm-chrome / principal-gate / confirm-snapshot / reveal-format / spell-delete-copy for **other** writers — **not** spell rollback. |
| Enemy hard delete | `adminDeleteEnemyConfig` (`main.mo` 798–804) is unconditional `remove`. #1014 `enemyConfigHardDeletesWithoutReferenceCheck()` locks that fact. |
| Achievement delete | Progress present → `active=false`; else `remove`. Unlock rejects inactive. Official Claim UI hides `active=false` while `claimAchievementReward` still pays Doka (queued #828 sidecar). |
| Activate gate is still a payload clamp | Both validators reject `apCost < 1` (`adminGuard.mo` 380–382; `adminSafety.ts` 604–606) — live Timestep is `apCost: BigInt(0)` (`spellData.ts` 216–226). Closed `knownSummonAI` / `knownPieceType` still omit `font` / `dummypost` / `pentaspan` / `septspan` (`adminGuard.mo` 363–373) and queued `octspan` / `gauntpost` / `sixspan` / `ninespan` / `poisepost` / `decspan` / `tallypost` / `hendecaspan` / `scorepost` / `dodecaspan` / `tridecaspan` / `tetradecaspan` / **`pentadecaspan`**. Wave-20 unique Undeca Oath does **not** add an occupy enum. |
| `minLevel` is catalog copy, not a gate | `void_collapse` seeds `minLevel: 30` (`admin.mo` 190) and still hydrates a level-1 book. Queued #828 `spellMinLevelHydrate.ts` locks that fact. Do **not** start enforcing `minLevel` until `ownedSpellIds` exists (09-23-003). |
| Write landing | `useSpellQueries.ts` (293 lines) already calls `validateSpellConfig`. Extract `SpellEditor` here. Do not grow `AdminDashboard.tsx` (8 280 lines) until activate exists. |
| New stables | Later EOP file after `20260901`; bump `check-limit` (today **5**). Never amend a shipped `NewActor`. Queued #950 / #1014 / #1083 / #1126 / #1156 / #1171 / #1215 / #1239 / #1253 / #1268 / #1276 do **not** approve a new required persist field. |
| Live summon cap | `ENEMY_SUMMON_CAP = 2` (`gameConstants.ts` 300). Oct Span (eight) through Pentadeca Span (fifteen) stay activate-blocked. Undeca Oath is **not** occupy 11. |
| Player vs AI range split | Queued #1230 AFDA-046 locks that Admin persists StatRow `range` and Max Range `maxRange` independently. Player highlight / Attack Nearest use `spellRangeBase` (`maxRange` wins). Enemy / summon AI use `enemySpellRange` (`Number(spell.range)` only). That is **not** `targetType` persist and not mechanic-flag persist. |

`newSpell()` (`AdminDashboard.tsx` 85–134) still seeds cooldown + mechanic bools + empty summon fields and **omits `targetType`**. Default `usableByPlayer: true` still hydrates every account.

Delete confirm (`AdminDashboard.tsx` 3793–3794) still says the live spell is **removed immediately** and dependents **will break**. Toast is always `"Spell deleted"` (6166). Backend may have only flipped a bool. Queued #1223 `spellDeleteCopy` is an unwired helper, not a canister `lifecycle`.

Live tabs (5611–5626): Enemies, Regions, Player Sprites, Spells, Map Modifiers, Enemy Tiers, Visuals, Settings, Purchases, Achievements, Enemy Names, Bosses, Ad Boxes, Shop, Boss Rush. Still no Library / Discovery / Kits / Feats-as-graph / Graph / Versions. Queued #945 / #1001 / #1066 / #1115 / #1190 / #1223 helpers stay over those 15 live tabs. #1162 Spellbook 44px is **player** SpellbookModal, not a sixteenth admin tab. #1196 battle-floor highlight and #1241 floor AO gradient extracts are **engine**, not studio tabs.

### 2.2 Superseding rules (unchanged)

Lifecycle ≠ `usableByPlayer`. `PLAYER_LEARNABLE` ≠ the cast gate. `ENEMY_ONLY` / `BOSS_ONLY` stay `lifecycle = active` with `PLAYER_LEARNABLE = false`. Hard delete is legal **only** for `draft` with zero published revisions and zero refs. Already-owned retired spells keep `ownedSpellIds` / levels / bar; `upgradeSpell` stays legal for those ids; Spellbook shows a Retired seal; combat reads the frozen revision; new achievement grants skip a retired reward id and still pay Doka; live kits ignore retired ids at resolve (log once) and activate of a kit that still lists them is blocked.

Ownership migration (when 09-23-003 lands): seed `ownedSpellIds` from the innate four ∪ `spellLevelKeys` ∪ resolving `spellBarOrder` ids. **Do not** grant `getSpellConfigs()`. **Do not** grant the full `starterSpells` array. **Do not** grant Wave-9…20 unique ids, Pack Rank, Rank Fold, Pack Diag, Far Fold, Pack Orth, Leap Fold, Pack Ring, Lane Fold, Pack Hook, Hook Fold, Pack Camel, Camel Fold, Pack Giraffe, Giraffe Fold, Court Floor, Court Lag, Court Prime, Court Snuff, Court Dock, Court Tierce, Court Quarte, Court Quinte, Pack File, Diag Fold, or any `ENEMY_ONLY` / `BOSS_ONLY` row because `usableByPlayer !== false`. **Do not** pad the spell bar with catalog ids after a discovery grant (#1171). **Do not** treat leftover bar keep (#1268) or leftover inventory keep (#1276) as grants.

Default discovery (08-31 §4, still inert):

```
eligible unknown spell
  → enemy kit actually contains the id
  → enemy successfully casts it
  → observed (persist)
  → player wins that encounter
  → ownedSpellIds + root recap
```

Possession is not observation. Player-side summons do not observe. Hostile summons may. `upgradeSpell` is never the grant writer. Death-gated recap (#923) is not a victory commit. Lethal-reflect Life Drain that currently resurrects (#973) is not a victory commit either. Leftover-XP remount keep (#1036 / #1041 / #1043 / #1045 / #1046 / #1088 / #1092 / #1099) is not a victory commit. Leftover-Doka remount portal keep (#1129 / #1145 / #1147 / #1149 / #1151 / #1153 / #1157) is not a victory commit. Leftover spell-level remount skip (#1215 / #1239) is not a victory commit and is not a grant. Leftover spell-bar remount skip (#1268) is not a victory commit and is not a grant. Leftover inventory remount skip (#1276) is not a spell grant. Soaked Mirror Field / Void Mirror / Thorned Ground / leftover-walk lava / Plague Zone / Void Rift / Glass Realm pack melee / pack SR / boss SR / Paper Windstorm miss (#1079 / #1084 / #1097 / #1100 / #1142 / #1182 / #1252 / #1257 / #1262 / #1272) is not a victory commit. Pale Archivist kit-first (#1089 / #1102 / #1105), Enthroned Void kit-first (#1159 / #1164), Eternal Pawn kit-first (#1204 / #1212), Final Pawn kit-first (#1247), and Fetid Rook kit-first (#1261) are not grants. Shrine settle (#1156) is not a grant. Spell Master empty-bar padding (#1171) is not a grant. Challenge catalog persist (#1253) is not a grant.

---

## 3. Queue union after #1226 (do not treat as landed)

| Sibling | What it actually is | Studio rule |
| :--- | :--- | :--- |
| [#1255](https://github.com/Mr-Melic/stralt/pull/1255) | Wave-20 SDE (`generationMin: 20`). Unique §11: `spell-giraffe-stride`, `spell-undeca-oath`, `spell-trip-reel`, `spell-giraffe-bite`, `spell-skew-mark`, `spell-deep-plate`, `spell-trip-skip`, `spell-pair-gait`, `spell-summon-giraffe`, `spell-deep-gift`, `spell-cadence-sext`, `spell-trip-toll`, `spell-brick-split`, `spell-watch-clip`, `spell-pair-plate`, `spell-trip-cut`, `spell-giraffe-gate`, `spell-pack-giraffe`, `spell-giraffe-fold`. `spell-pack-giraffe` is `ENEMY_ONLY` on `giraffe_precentor`. `spell-giraffe-fold` is `BOSS_ONLY` on `giraffe_fold_regent`. Extra rooms `giraffe_gallery` / `undeca_nave` / `trip_aisle` / `skew_pulpit` / `trip_nave`. Wave-20 family CORE is #1143 unique + #1177 (via #1248), **not** unique §11. Unique §11 stay extras until Wave 22. Unique Wave-19 §11 (#1198) stay extras until Wave 21. Deep Gift is leftover AP **=== 1 AND** leftover MP **≥ 2** heal (one body). Cadence Sext is remaining `n>6` → 6. Deep Plate is leftover **1/≥2** negate. Skew Mark is leftover **AP − MP === 2** turn-end detonate. Pair Gait / Pair Plate are leftover **2/0**. Giraffe Stride is a permutation of **(4,1)**. Undeca Oath is Chebyshev **exactly 11** spell gate, not occupy 11. Giraffe Gate is next-spell dest **(4,1)**. `mpCost: 0` on every unique row. Target-only leftover **sum === 8** heal (`spell-octave-gift`) remains an open Wave-21 unique hole. | Same rule as 10-28-220 for Wave-19. Do not pre-own `generationMin: 20` ids. Validator rejects `PLAYER_LEARNABLE=true` on Pack Giraffe / Giraffe Fold / Court Quinte / Court Quarte / Court Tierce / Pack Camel / Camel Fold. Do not clone Thin Gift / Cadence Quint / Deca Oath / Septet Mend / Cadence Quarte / Tetradeca Span / Octave Mend / Cadence Quinte / Pentadeca Span / Court Quinte. **SDE wins** unique leftover collisions vs a later Wave-21 tactical. Do not CORE Giraffe Gate with Giraffe Bite. |
| [#1251](https://github.com/Mr-Melic/stralt/pull/1251) | Wave-20 tactical stamps as Wave **21** family CORE. Octave Mend is both-body leftover **sum === 8 AND unequal**. Cadence Quinte is remaining `n===5` → 0. Pentadeca Span is stretched plus occupy-weight 15 (blocked at live cap 2). Kin Turn is leftover invert on **caster + one same-side ally**. Court Quinte never owned. Extra doors `octave_cantor` / `quinte_precentor` / `span_pentadeca` / `court_quinte_regent` wait for Wave 22. If a same-hour Wave-21 tactical opens, unique dated name; do not overwrite `SPELL_PROPOSALS_2026-10-28.md`. | Honour as distinct leftovers vs #1255 Deep Gift / Cadence Sext / Undeca Oath / Giraffe Stride. Do not alias onto Septet Mend / Cadence Quint / Tetradeca Span. |
| [#1248](https://github.com/Mr-Melic/stralt/pull/1248) | Wave-20 elite CORE = leftover Wave-18 unique except Pack Hook / Hook Fold **plus** #1177 except Court Quarte. #1198 / #1251 stay Wave **21** family CORE. #1255 unique §11 stay extras until Wave **22**. If a same-hour Wave-21 elite opens, unique dated name. | Honour as CORE–SIGNATURE **ids**. Do not pre-own. Do not CORE Giraffe Stride / Deep Gift / Pack Giraffe (#1255). Zone NaN still hides paper ADVANCED (09-23-010). |
| [#1244](https://github.com/Mr-Melic/stralt/pull/1244) | Wave-21 + Rush **Table S**: `sip_visitor` / `halve_registrar` / `odd_penitentiary` / `sill_suffragan`; `CHOIR_SIP` / `CHOIR_HALVE` / `NAVE_ODD` / `NAVE_SILL` stay `BOSS_ONLY`. Leftover #695 Gait Sip / Cast Sill + leftover #726 Cadence Halve + leftover #787 Odd Hood. 10-28-221 anticipated this bible; it is now confirmed. [#1170](https://github.com/Mr-Melic/stralt/pull/1170) Wave-20 / Table R, [#1139](https://github.com/Mr-Melic/stralt/pull/1139) Wave-19 / Table Q, and [#1080](https://github.com/Mr-Melic/stralt/pull/1080) Wave-18 / Table P already covered. If a same-hour Wave-22 / Table T opens, unique dated restack on `BOSS_AND_SPELL_DISCOVERY.md` — **union**, do not invent an 11th canister room. | Closed signatures never enter `ownedSpellIds`. Do not add a fourth kit source. Do not restamp Wave-1…21 feat doors. Never `roomIndex > 9`. Do not remap `gait_cantor` / `halve_precentor` / `trim_precentor`. |
| [#1237](https://github.com/Mr-Melic/stralt/pull/1237) | Wave-19 synergy formations (drop 20) in unique `docs/design/ENEMY_FORMATIONS_2026-10-28.md` packing #1189 families. Prior [#1176](https://github.com/Mr-Melic/stralt/pull/1176) Wave-18 drop 19 already covered by 10-28-222. If a same-hour Wave-20 drop 21 opens, unique `ENEMY_FORMATIONS_2026-10-29.md`. | Consume CORE ids; clearing a formation is not a grant. Do not overwrite `ENEMY_FORMATIONS_2026-10-27.md` or `ENEMY_FORMATIONS_2026-10-28.md`. Trideca Plug / Tetradeca Plug / Pentadeca Plug skip while live cap is 2. Dual Keep cannot fake leftover-sum 5 or 6. Never PAIR Tern+Tierce. |
| [#1252](https://github.com/Mr-Melic/stralt/pull/1252) / [#1257](https://github.com/Mr-Melic/stralt/pull/1257) / [#1262](https://github.com/Mr-Melic/stralt/pull/1262) / [#1266](https://github.com/Mr-Melic/stralt/pull/1266) / [#1272](https://github.com/Mr-Melic/stralt/pull/1272) / [#1259](https://github.com/Mr-Melic/stralt/pull/1259) / [#1220](https://github.com/Mr-Melic/stralt/pull/1220) / [#1264](https://github.com/Mr-Melic/stralt/pull/1264) / [#1231](https://github.com/Mr-Melic/stralt/pull/1231) / [#1271](https://github.com/Mr-Melic/stralt/pull/1271) / [#1273](https://github.com/Mr-Melic/stralt/pull/1273) / [#1234](https://github.com/Mr-Melic/stralt/pull/1234) / [#1238](https://github.com/Mr-Melic/stralt/pull/1238) / [#1260](https://github.com/Mr-Melic/stralt/pull/1260) / [#1263](https://github.com/Mr-Melic/stralt/pull/1263) / [#1270](https://github.com/Mr-Melic/stralt/pull/1270) / [#1274](https://github.com/Mr-Melic/stralt/pull/1274) / [#1267](https://github.com/Mr-Melic/stralt/pull/1267) / [#1269](https://github.com/Mr-Melic/stralt/pull/1269) | Later kit-execute / modifier / summon-control leftovers: Glass Realm pack fallback melee ×2 (`glassRealmEnemyMeleeTaken.ts`), pack SR soak, boss kit SR soak, player Mirror vs boss kit single-target (`bossKitPlayerMirrorReflect.ts`), Paper Windstorm miss on boss-kit ranged, Enthroned Void phantom contact atk 5 / last-turn damage-spell AP, Final Pawn ghost-summon 1 HP / atk 5, Fetid Rook advertised half-HP split / split-rook atk 25, Pale Archivist scroll-summon atk 8, summon-control dest share (Attack Nearest / sprite click / self-ally / Digit-Numpad / Escape cancel / skip champion bar), Broodmother kit Archer honouring `ENEMY_SUMMON_CAP`. Unique sidecar files vs 10-28 #1160 / #1199 / #1200 / #1202 / #1205–#1214 / #1216 / #1217. Keys are **metadata flags** / kit **ids** / modifier multipliers / dest tokens, never `spell.name`. | Persist those flags with 09-23-005. Union sidecars; one `export function` per name. Not grants. Hostile kit execute may observe (10-22-138); player execute / player Mirror consume must not. Map-modifier execute leftovers are not catalog ids. Ghost-summon / scroll-summon / split-rook / larva-explode / Glyph Trap are **abilities**, not catalog ids. Honouring the live summon cap is occupancy, not a grant. |
| [#1239](https://github.com/Mr-Melic/stralt/pull/1239) / [#1268](https://github.com/Mr-Melic/stralt/pull/1268) / [#1276](https://github.com/Mr-Melic/stralt/pull/1276) | Leftover **spell-level** remount skip continues (`spellLevelKeepRemountWriteSkip.ts`, restack of #1215). Leftover **spell-bar** remount skip (`spellBarKeepRemountWriteSkip.ts`) honours optimistic bar order over stale Play-entry `getCharacter.spellBarOrder`. Leftover **inventory** remount skip (`inventoryKeepRemountWriteSkip.ts`) restores a shop item after `saveBattleStats` throw-after-accept. Distinct from leftover-XP keep and leftover-Doka portal keep. Motoko `upgradeSpell` is `currentLevel + 1` and is **not** idempotent. `setSpellBarOrder` is off-lock. Inventory keep is Items Buy, not a spell grant. | Same class as 10-28-224 for Doka / spell-level skips. Discovery must not piggy-back these skips. `upgradeSpell` is never the grant writer. Union helpers; one `export function` per name. Leftover bar honour is not `commitSpellDiscoveries` and not `ownedSpellIds`. Leftover inventory honour is not a spell id. |
| [#1247](https://github.com/Mr-Melic/stralt/pull/1247) / [#1261](https://github.com/Mr-Melic/stralt/pull/1261) | Kit-first leftovers: Final Pawn Strike from shadowing Ghost Summon; Fetid Rook Venom from shadowing Split. Unique vs Eternal Pawn #1204 / #1212, Enthroned Void #1152 / #1159 / #1164, and Pale Archivist #1089 / #1102 / #1105. Tests key kit **ids**, never `"Strike"` / `"Venom"` / `"Ghost Summon"` / `"Split"`. | Kit-first leftover is not a grant and not `lifecycle`. Hostile kit cast of Strike / Venom may observe once 09-23-009 exists; Ghost Summon / Split **abilities** are not catalog ids. |
| [#1229](https://github.com/Mr-Melic/stralt/pull/1229) / [#1258](https://github.com/Mr-Melic/stralt/pull/1258) / [#1265](https://github.com/Mr-Melic/stralt/pull/1265) / [#1275](https://github.com/Mr-Melic/stralt/pull/1275) / [#1249](https://github.com/Mr-Melic/stralt/pull/1249) / [#1235](https://github.com/Mr-Melic/stralt/pull/1235) / [#1236](https://github.com/Mr-Melic/stralt/pull/1236) | Later map snaps (Raise Slab, Ratchet Cog, Turnstile Ember, Twin Sparks) are leftover-crumb layout, not spell catalogs. ENC #1249 Stave/Ring/Rime/Match teaches **#1138** / **#1017** verbs, not unique §11. WDD #1235 Wave-20 `WF-*-POISE_*`. WDEAD #1236 occupancy/remount rails (ingested Wave-19 / Table R; did **not** invent Wave-20 WDD / FSN drop 20 / elite 20 / Table S — those later opened as #1235 / #1237 / #1248 / #1244). | Occupancy unseals / crumb snaps are not grants unless a named door is stamped (`giraffe_gallery` etc. stay #1255’s). `ENC-STAVE-*` is not Deep Gift. `ENC-RING-*` is not Giraffe Stride. `ENC-RIME-*` is not Trip Reel. `WF-SPL-POISE_TUTOR` never writes `ownedSpellIds`. Do not overwrite #1249 / #1235 / #1236 `*2026-10-28*` files. |
| [#1076](https://github.com/Mr-Melic/stralt/pull/1076) / [#1109](https://github.com/Mr-Melic/stralt/pull/1109) / [#1196](https://github.com/Mr-Melic/stralt/pull/1196) / [#1241](https://github.com/Mr-Melic/stralt/pull/1241) | WX extracts already covered by 10-26-197 / 10-27-212 / 10-28-227. #1241 extracts floor AO gradient paint — **not** AdminDashboard, not studio tabs. | Discovery helpers stay in `engine/*` / `utils/*`. Do not grow WX (19 213 on HEAD) or AdminDashboard (8 280). Do not treat a paint extract as a sixteenth admin tab. |
| [#1223](https://github.com/Mr-Melic/stralt/pull/1223) / [#1218](https://github.com/Mr-Melic/stralt/pull/1218) / [#1230](https://github.com/Mr-Melic/stralt/pull/1230) / [#1101](https://github.com/Mr-Melic/stralt/pull/1101) | Admin UX #1223 status-copy / consent-gate / **spell-delete copy** / ad-hydrate helpers do **not** restack `AdminDashboard.tsx` and are **not** spell rollback or `lifecycle`. EBA #1218 re-audit is docs only, **no new EBA IDs**. AFDA #1230 AFDA-046 `range` vs `maxRange` player/AI split is not `targetType` persist. CRC #1101 still **zero** ids `SAFE_TO_REMOVE`. If same-hour 10-29 Admin UX / EBA / AFDA / CRC open, unique dated names. | Confirm-chrome / delete-copy is not spell rollback. Dual range fields are not mechanic-flag persist. CRC-001 is not a deletion. Do not ship empty Discovery / Kits / Graph / Versions tabs. Do not add a fourth kit table. |
| [#1253](https://github.com/Mr-Melic/stralt/pull/1253) / [#1268](https://github.com/Mr-Melic/stralt/pull/1268) / [#1276](https://github.com/Mr-Melic/stralt/pull/1276) | SDEG 10-28: `uiLayoutVersionWipe` (HUD cache wipe can clobber a newer layout), `challengeCatalogPersist` (battle-challenge ids live only in `DEFAULT_CHALLENGES`; **no** ownership / discovery / alias table), `sessionStateShrineCap` ( Motoko `shrineCount > 100` silent max vs unbounded local). Explicitly **no** `ownedSpellIds`. #1268 leftover bar keep and #1276 leftover inventory keep are persist locks, not observation. If same-hour 10-29 SDEG opens, unique dated names; it must not ship observation maps. | Dual bar / catalog-delete / loot_10 / explorer counter / shrine settle / Spell Master occupancy / leftover spell-level keep / leftover bar keep / leftover inventory keep / challenge catalog / uiLayout wipe is not `ownedSpellIds` and not `lifecycle`. New observation maps still go through 09-23-016. After 003, hydrate must **not** pad empty bar slots with newly granted ids. Challenge `CHALLENGE` acquisition still needs `rewards.spellIds` (09-23-012); #1253 does not add them. |
| [#1240](https://github.com/Mr-Melic/stralt/pull/1240) / [#1192](https://github.com/Mr-Melic/stralt/pull/1192) | AEE 10-28 (`ENEMY_AI_EVOLUTION_2026-10-28.md`, SYS-120…125 / FUT-138…143) remains the AI increment. Inspector (08-31 §7) must list AI modules by **id**, never `inferSummonArchetype` name fallback (`enemyAI.ts` 203–224). Wave-20 unique `aiHint` strings (`walk_giraffe_4_1`, `next_spell_exact_chebyshev_11`, `attract_toward_nearest_tripwire`, `pack_walk_giraffe_4_1`, `fold_two_player_side_share_giraffe_4_1`, `halve_leftover_mp_if_adjacent_barrier`, …) have no `decide*` branch yet (#1255 SDE-003). | Inspector lists modules by **id**. Missing Wave-20 hint → drop that id, log once. Do not emit `shadow_strike`. Do not add a fourth kit table. |
| [#982](https://github.com/Mr-Melic/stralt/pull/982) / [#942](https://github.com/Mr-Melic/stralt/pull/942) | CDA freeze: do not **ship** Wave-15/16/17/18/19/20 live catalog rows until Wave-1 ownership / observe / G resolve exist. #1255 / #1251 remain `STATUS: PROPOSED`. | Honour the freeze. This studio does not mint Wave-20 unique §11 into `starterSpells`. |

Still queued (do not re-issue): #564 `SpellSummonFields` (09-25), #568 linear⊕diagonal (09-25-055), 09-28-084…098, 09-29-099…115, 10-21-116…129, 10-22-130…144, 10-23-145…159, 10-24-160…174, 10-25-175…189, 10-26-190…204, 10-27-205…219, 10-28-220…234, #747 / #726 / #752 / #753 / #733 / #730 / #754 / #766 / #757 / #762 / #802 / #787 / #796 / #808 / #837 / #849 / #840 / #836 / #825 / #906 / #890 / #899 / #903 / #897 / #911 / #962 / #953 / #941 / #951 / #956 / #997 / #1004 / #1005 / #1011 / #1017 / #1063 / #1073 / #1082 / #1132 / #1138 / #1080 / #1139 / #1143 / #1170 / #1176 / #1177 / #1189 / #1198 / #1244 / #1248 / #1251 / #1255.

Same-hour 10-28 flock also opened telemetry / PX / balance / long-horizon / Health skip / a11y / map integrity / content-diversity freeze. Those are not spell-studio work. Unique `*2026-10-28*` files, not this studio. #942 / #982 CDA freeze Wave-16 HP clones — this studio does not mint Wave-21 unique §11 (that is the next SDE generation). Do not restamp their files or grow WX from #995 / #1076 / #1079 / #1097 / #1196 / #1241.

---

## 4. Owner UI (dev-gated — still the 08-31 studio)

Carved-stone / slate / crimson. Same `#admin` + lazy `AdminDashboard` gate.

Immediate UI honesty (can land with persist 001/004, not a restyle):

- Delete on published ids is **Retire**. Confirm lists dependents. Toast must say retired vs rejected vs draft-deleted. Union #945 `shouldDismissOwnerConfirm`, #1001 / #1066 / #1115 / #1190 confirm-chrome, and #1223 `spellDeleteCopy` so Shop/GameKey/delete dialogs stay until `#ok`.
- Cast-gate checkboxes stay labeled “player may cast” / “enemy may cast.” Lifecycle is a separate control.
- Validation strip: missing `targetType`, broken kit id, name-heuristic leftover = crimson.
- Spell Type includes `summon`. Summon section: `summonAI`, lifespan, piece, scales, **displayName**, kit ids.
- `⌘K` (queued #838 / #945) stays over the 15 live tabs until activate exists. Do not ship empty Discovery / Kits / Graph / Versions / Challenges / AI / Formations tabs.
- Range honesty: persist both `range` and `maxRange` (AFDA-046) **and** `targetType`. Do not collapse them into a name heuristic.

Do not grow the 8 280-line dashboard until activate exists on the canister (08-31 SDA-012 / 09-23-013 / 09-23-015). Extract `SpellEditor` onto `useSpellQueries.ts`. Do not grow `WorldExploration.tsx`. Restack AdminDashboard siblings as **one** extract. #1162 Spellbook floors stay in `SpellbookModal.tsx`. #1196 / #1241 paint extracts stay in `engine/*`.

Support still required and still missing: duplicate, compare versions, draft, validate (activate gate), activate, deactivate, dependency inspection, rollback.

---

## 5. Prior ACTION_ID status @ `0f5363f`

Unchanged from 09-23 § / 09-29 § / 10-21 § / 10-22 § / 10-23 § / 10-24 § / 10-25 § / 10-26 § / 10-27 § / 10-28 §:

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
| 10-26 190–204 | **OPEN** on #1140. |
| 10-27 205–219 | **OPEN** on #1187. |
| 10-28 220–234 | **OPEN** on #1226. |

---

## 6. Out of scope

- Production TypeScript / Motoko / Candid in this PR
- RAF, map generation, turn logic, damage math
- Growing `WorldExploration.tsx` or concatenating a second `export function` on restack
- Re-authoring Wave-1…21 spell cards or boss adaptations
- Treating `adminSafety.ts` helpers, #775 AUX copy, #810 stack rails, #838 five-writer rollback, #911 pack-kit fill, #945 confirm-dismiss, #1001 confirm-chrome, #1014 catalog-delete lock, #1083 loot_10 helpers, #1156 shrine settle, #1171 Spell Master occupancy, #1215 leftover spell-level keep, #1223 spell-delete copy, #1253 challenge catalog, #1268 leftover bar keep, or #1276 leftover inventory keep as persist `lifecycle` / ownership
- Re-opening 09-01-002 bindgen work
- Re-issuing 09-21…10-28 IDs
- Editing Cursor dashboard prompts (no write API)
- Landing Wave-11 / Wave-12 / Wave-13 / Wave-14 / Wave-15 / Wave-16 / Wave-17 / Wave-18 / Wave-19 / Wave-20 catalog rows before 09-23-003
- Enforcing `SpellConfig.minLevel` at hydrate without `ownedSpellIds`
- Treating the merge freeze as “those drafts landed”
- Editing `MASTER_ROADMAP.md` (#338 / #783 / #814 / #870 / #946 / #998 / #1074 / #1124 / #1186 / #1254)
- Minting Wave-21 unique §11 (next SDE generation; #942 / #982 CDA freeze)
- Overwriting sibling `*2026-10-25*` files
- Overwriting sibling `*2026-10-26*` files (#1108–#1162)
- Overwriting sibling `*2026-10-27*` files (#1163–#1217, including `SPELL_ADMIN_DESIGN_2026-10-27.md`, `ACTION_IDS_SDA_2026-10-27.md`, `SPELL_DISCOVERY_ECOSYSTEM_2026-10-27.md`)
- Overwriting sibling `*2026-10-28*` files (#1218–#1276, including `SPELL_ADMIN_DESIGN_2026-10-28.md`, `ACTION_IDS_SDA_2026-10-28.md`, `SPELL_DISCOVERY_ECOSYSTEM_2026-10-28.md`, `ACTION_IDS_SDE_2026-10-28.md`, `SPELL_PROPOSALS_2026-10-28.md`, `ENEMY_FORMATIONS_2026-10-28.md`, `ENEMY_ELITE_EVOLUTION_2026-10-28.md`, `ENEMY_AI_EVOLUTION_2026-10-28.md`)
- Overwriting sibling `*2026-10-29*` files opened this hour

---

## 7. ACTION_ID index (this run)

All items: `STATUS: NEW`. Full records: [`ACTION_IDS_SDA_2026-10-29.md`](./ACTION_IDS_SDA_2026-10-29.md).

| ID | Title | Priority |
| :--- | :--- | :--- |
| SDA-2026-10-29-235 | Honour #1255 Wave-20 SDE stamps; do not pre-own generationMin 20 ids | P1 |
| SDA-2026-10-29-236 | Honour #1244 Wave-21 boss / Rush Table S; no fourth kit source | P1 |
| SDA-2026-10-29-237 | Honour #1237 Wave-19 formations; consume CORE ids, do not grant | P1 |
| SDA-2026-10-29-238 | Persist later kit-execute/modifier/summon-control dest metadata flags | P1 |
| SDA-2026-10-29-239 | Remount leftover-Doka/spell-level continues; leftover bar/inventory keep is not a victory commit | P1 |
| SDA-2026-10-29-240 | Do not treat Undeca Oath as occupy-11; grow closed knownSummonAI with pentadecaspan | P0 |
| SDA-2026-10-29-241 | Honour later map snaps / ENC / WDD / WDEAD; not grants | P1 |
| SDA-2026-10-29-242 | Keep later combat helpers in engine/*; floor-AO extract is not a studio tab | P1 |
| SDA-2026-10-29-243 | Honour #1255 extra doors; first-grant only | P1 |
| SDA-2026-10-29-244 | Keep Deep Gift ≠ Octave Mend and Cadence Sext ≠ Cadence Quinte | P0 |
| SDA-2026-10-29-245 | Honour Admin UX / EBA / AFDA / CRC; do not add empty studio tabs or a fourth kit source | P1 |
| SDA-2026-10-29-246 | Honour #1253 SDEG persist locks; challenge catalog is not ownedSpellIds or lifecycle | P1 |
| SDA-2026-10-29-247 | Honour kit-first leftovers; kit ids are not grants | P1 |
| SDA-2026-10-29-248 | Modifier execute leftovers and ability packets are not a victory commit | P1 |
| SDA-2026-10-29-249 | Honour #1240 AI increment; inspector lists modules by id | P1 |
