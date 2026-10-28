# Spell, Discovery & Achievement Admin Design — 2026-10-28 re-audit

**Author:** Spell, Discovery & Achievement Admin Designer  
**Automation:** `4efa22ec-a498-11f1-a7d1-d6b4613131ce`  
**Date:** 2026-10-28  
**HEAD audited:** `0f5363f` (`Merge pull request #332`) — unchanged since the 09-21 re-audit  
**Scope:** Owner tooling for the complete spell ecosystem. **No production code in this PR.**

This is a **delta** on [`SPELL_ADMIN_DESIGN_2026-08-31.md`](./SPELL_ADMIN_DESIGN_2026-08-31.md) (#116). Sections 2–11 of that document remain the studio contract (canonical `SpellDefinition`, acquisition routes, observe→win→unlock, CORE–SIGNATURE pools, dependency views, soft-retire + legacy owned, studio tabs, persist sketch). 09-01 / 09-02 deltas still stand (bindgen 09-01-002 LANDED; empty-AI half of 09-02-006 LANDED).

It records what is still the wrong field on `main`, and the ACTION_IDs in [`ACTION_IDS_SDA_2026-10-28.md`](./ACTION_IDS_SDA_2026-10-28.md) (**220–234** only).

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

Same-hour and later 2026-10-27 flock already opened (unique dated files — **do not overwrite**): [#1187](https://github.com/Mr-Melic/stralt/pull/1187) SDA 205–219, [#1198](https://github.com/Mr-Melic/stralt/pull/1198) Wave-19 SDE (`SPELL_DISCOVERY_ECOSYSTEM_2026-10-27.md`, `ACTION_IDS_SDE_2026-10-27.md`), [#1177](https://github.com/Mr-Melic/stralt/pull/1177) Wave-19 tactical (`SPELL_PROPOSALS_2026-10-27.md`), [#1189](https://github.com/Mr-Melic/stralt/pull/1189) Wave-19 elite, [#1170](https://github.com/Mr-Melic/stralt/pull/1170) Wave-20 bosses / Table R, [#1176](https://github.com/Mr-Melic/stralt/pull/1176) Wave-18 formations drop 19, plus later 10-27 sidecars [#1163](https://github.com/Mr-Melic/stralt/pull/1163)–[#1217](https://github.com/Mr-Melic/stralt/pull/1217). Same-hour 2026-10-28 flock uses unique dated filenames — **do not overwrite** any `*2026-10-28*` sibling (Wave-20 SDE / Wave-20 tactical / Wave-20 elite / Wave-21 bosses / drop-20 formations / ENC / WDD / WDEAD / SDEG / AEE / AFDA / Admin UX / MASTER_ROADMAP if they open). This PR only adds `SPELL_ADMIN_DESIGN_2026-10-28.md` and `ACTION_IDS_SDA_2026-10-28.md`.

Do not implement those IDs unless a human or orchestrator picks one. Do not grow `WorldExploration.tsx` (19 213 lines on HEAD). Never introduce spell-name heuristics. Next implementer still starts at **09-23-001**, then **007**, then **003+023**. Do not land Wave-9 / 10 / 11 / 12 / 13 / 14 / 15 / 16 / 17 / 18 / **19** catalog rows before 003. Persist maps go through **09-23-016** (new later EOP file after `20260901`; `check-limit = 5` today). Do not extend the `usableByPlayer=false` retire path.

---

## 1. Why this run exists

The 10-27 run closed the queue through #1187 (Wave-18 SDE/tactical/elite, Wave-19 bosses / Table Q, anticipated Wave-20 / Table R, later kit-execute/decide, remount leftover-Doka keep, `dodecaspan` / `tridecaspan` enums, SDE win on Wide Gift / Cadence Quad vs #1082 / #1063 / #1132). Same `HEAD`. Calendar is **2026-10-28**. `origin/main` has not moved since 2026-09-03 (`0f5363f`). The 10-27 audit’s “newest #1162 / 831+ open” snapshot is stale: later 10-27 Wave-19 SDE plus combat / remount / soak / a11y sidecars opened **#1163–#1217**. Open queue at this patch: **886** drafts. Newest sibling before this work: **#1217** (Broodmother larva-explode contact venom). Do not touch `MASTER_ROADMAP.md` (#870 / #946 / #998 / #1074 / #1124 / #1186 are pre-existing oldest-first conflicts on that file). Do not overwrite #1187 SDA `*2026-10-27*` files, #1198 Wave-19 SDE `*2026-10-27*` files, or same-hour `*2026-10-28*` siblings.

The product hole is unchanged: catalog still grants, discovery still does not exist, retirement is still a cast flag.

What *is* new for this studio is the flock **after** #1187 that 205–219 did not stamp as landed catalog: Wave-19 discovery (#1198, `generationMin: 19`, Pack Camel `ENEMY_ONLY`, Camel Fold `BOSS_ONLY`, Thin Gift leftover AP **=== 1 AND** leftover MP **=== 0** heal, Cadence Quint remaining `n>5` → 5), Wave-19 tactical as Wave **20** family CORE (#1177 Septet Mend leftover **sum === 7**, Cadence Quarte `n===4` → 0, Tetradeca Span occupy 14, Court Quarte never owned), Wave-19 elite CORE (#1189 leftover #1082 except Pack Ring / Lane Fold **plus** #1132 except Court Tierce), Wave-20 bosses / Rush Table R (#1170, now confirmed), Wave-18 formations drop 19 (#1176), leftover spell-level remount skip (#1215), later leftover-Doka still not a victory commit, kit-execute/modifier leftovers (#1199 Mending Mist, #1200 Iron Curse RES ×1.3, #1202 Swift Winds, #1203 / #1208 Titan’s Vigor, #1207 Doka Fever, #1210 Arcane Overflow, #1168 Chaos Initiative, #1182 Void Rift, #1216 Glyph Trap, #1217 Broodmother larva-explode), summon-control Inferno CD chain (#1205 / #1206 / #1211 / #1214), Eternal Pawn kit-first Slow (#1204 / #1212), map snaps (#1174 Latch Gate, #1201 Pendulum Censer, #1209 Hourglass Arch, #1213 Shift Slab), ENC #1195, WDD #1172, WDEAD #1183, SDEG #1171 (`spell_master_8` empty-bar padding is not `ownedSpellIds`), AEE #1192, AFDA #1193, Admin UX #1190, WX extract #1196. Closed `knownSummonAI` still omits every queued occupy enum. Wave-19 unique Deca Oath is a Chebyshev-10 **spell gate**, not occupy 10.

The 08-31 contract is still the destination. The 10-28 IDs are queue-union only. Do not mint a second 001–219.

---

## 2. Current state (re-verified against `origin/main` @ `0f5363f`)

### 2.1 Still true — do not rediscover as new

| Fact | Where (this HEAD) |
| :--- | :--- |
| Bindgen + `toBackendSpellConfig` include Motoko summon fields | `backend.ts` 130–151; `adminContract.ts`. 09-01-002 **closed**. Motoko `SummonUnitDef` is still `pieceType` / `level` / `hpScale` / `damageScale` (`types/admin.mo` 85–90). Combat also needs `summonKit` / `ap` / `mp` (`summonSpawn.ts` 22–32). Queued #1014 `summonUnitDefPersist.ts` **locks** that thin shape; it is not 09-23-002. |
| Motoko + client reject empty `summonAI` when `isSummon` | `adminGuard.mo` 423–425; `adminSafety.ts` 625–628. Runtime still does `spell.summonAI \|\| "hunter"` (`summonSpawn.ts` 139) and `inferSummonArchetype` still falls back to `summon.name` (`enemyAI.ts` 203–224). |
| Validators accept `spellType="summon"` | `adminGuard.mo` 348–349; `adminSafety.ts` 611. Editor `<select>` is still damage / heal / drain (`AdminDashboard.tsx` 2675–2687). “Heal (targets self)” is a targeting lie — `targetType` has **zero** editor matches. |
| Lifecycle is still `usableByPlayer=false` | `adminDeleteSpellConfig` (`main.mo` 882–902) error copy still says “set usableByPlayer=false to retire it” (887). Soft-retire writes that flag when `_spellReferencedByPlayers` (273–284, **keys+bar only** via `_characterHasSpell` 253–270). Else `remove`. Queued #1014 `catalogDeletePolicy.ts` **locks** that retire-when-referenced path; it is not `lifecycle`. CRC #1101 lists **zero** ids `SAFE_TO_REMOVE` — do not twin CRC-001 onto 09-23-007. |
| `upgradeSpell` treats the same flag as “Spell is retired” | `main.mo` 1011. Owned-but-never-upgraded ids are not in `spellLevelKeys`, so the check blocks the legacy upgrade 08-31 §8.2 requires. Appearance cannot mint keys (`resolveAppearanceSpellLevels`). Queued #1215 leftover spell-level remount skip is a **retry skip**, not a grant writer. |
| Library helper is still inverted | `shouldIncludeBackendSpellInLibrary` (`adminSafety.ts` 712–718) returns true when `usableByPlayer !== false`. Wired at `WorldExploration.tsx` 2412–2440. `ownedIds` is `starterSpells` ∪ `spellLevelKeys` ∪ `spellBarOrder`. All 32 frontend ids are forced `isBaseSpell: true` (2395–2408). Queued #1171 `spellMasterBarCount.ts` locks that hydrate **pads** empty bar slots from that same library — discovery grants later would auto-complete Spell Master. |
| No observation / unlock persist | No `ownedSpellIds`, `observedSpellIds`, `recordSpellObservation`, `commitSpellDiscoveries` under `src/` except the **argument name** `ownedSpellIds` on the inverted helper. Recap is still XP / Doka / feats. |
| No acquisition enum / three flags | Only `usableByPlayer` / `usableByEnemy` (`types/admin.mo` 117–118). No `ENEMY_DISCOVERY` … `SYSTEM_ONLY` in live types. No `OBSERVATION_REQUIRED` / `VICTORY_REQUIRED` / `PLAYER_LEARNABLE`. |
| Enemy pools hardcoded; zone always 0 | `ENEMY_KITS` is `Record<ChessPieceType, …>` (`enemyAI.ts` 163–185). `buildEnemyKit(enemy.pieceType, currentMap.levelZone)` (`WorldExploration.tsx` 11920) passes `{ name, minLevel, maxLevel }` (4683–4687). `Math.floor` is `NaN`; every kit stays zone 0. Admin `EnemyConfig` has no spell list (`types/admin.mo` 15–26). Summoner extras still `starterSpells.find(id === "summon-dire-wolf")` (11935–11941). |
| Achievement / challenge still Doka-only | `AchievementConfig` is `{ id, name, description, dokaReward, condition, active }` (`types/admin.mo` 249–256). `KNOWN_ACHIEVEMENT_CONDITIONS` is 15 keys (`adminSafety.ts` 306–322). Challenges stay `{ doka, xp, badge }`. Queued #996 still locks `boss_defeated` as never unlocking a spell. Queued #1083 `loot_10_doka` counter is a feat **count**, not a spell grant. Queued #1171 `spell_master_8` occupancy is a feat **count**, not a spell grant. |
| Name heuristics still live | `OLD_SPELL_NAMES_SET` matches **name and id**, including live `physical_attack` (`WorldExploration.tsx` 2356–2389). Same id is in `OLD_SPELL_IDS` purge (`main.mo` 689–697). `summonSpawn.ts` 165: `spell.name.replace("Summon ", "")`. Queued #1018 `formatSummonDisplayName` title-cases `pieceType`; it is **not** persist `displayName`. CRC-001 names the same Strike tombstone — consume 09-23-007, do not mint a second retire. |
| Three boss kit sources | Live combat: `data/bossKits.ts`. Motoko `defaultBossConfigs()` still lists purged ids (`admin.mo` 358+ `fireball`, `cursed_gust`, `entangle`, `mist_form`, …). Admin chips: `getSpellConfigs()`. Queued #818 / #887 / #929 / #934 / #980 / #996 / #1044 / #1111 / #1163 name that split — they are not a fourth kit table. |
| Bar persist still upgrade-keys only | `setSpellBarOrder` filters to `spellLevelKeys` (`main.mo` 1945–1947). Queued #950 dual `activeSpells : ?[Nat]` vs `spellBarOrder : ?[Text]` and #1014 `legacyActiveSpellsMigrate.ts` are stale-schema locks, not `ownedSpellIds`. |
| Spell Save is a live overwrite | `adminSetSpellConfig` (`main.mo` 869–879). No `adminRollbackSpellConfig`. Queued #838 / #945 / #1001 / #1066 / #1115 / #1190 types rollback / confirm-dismiss / confirm-chrome / principal-gate / confirm-snapshot / reveal-format for **other** writers — **not** spells. |
| Enemy hard delete | `adminDeleteEnemyConfig` (`main.mo` 798–804) is unconditional `remove`. #1014 `enemyConfigHardDeletesWithoutReferenceCheck()` locks that fact. |
| Achievement delete | Progress present → `active=false`; else `remove`. Unlock rejects inactive. Official Claim UI hides `active=false` while `claimAchievementReward` still pays Doka (queued #828 sidecar). |
| Activate gate is still a payload clamp | Both validators reject `apCost < 1` (`adminGuard.mo` 380–382; `adminSafety.ts` 604–606) — live Timestep is `apCost: 0` (`spellData.ts` 216–226). Closed `knownSummonAI` / `knownPieceType` still omit `font` / `dummypost` / `pentaspan` / `septspan` (`adminGuard.mo` 363–373) and queued `octspan` / `gauntpost` / `sixspan` / `ninespan` / `poisepost` / `decspan` / `tallypost` / `hendecaspan` / `scorepost` / `dodecaspan` / `tridecaspan` / **`tetradecaspan`**. Wave-19 unique Deca Oath does **not** add an occupy enum. |
| `minLevel` is catalog copy, not a gate | `void_collapse` seeds `minLevel: 30` (`admin.mo` 190) and still hydrates a level-1 book. Queued #828 `spellMinLevelHydrate.ts` locks that fact. Do **not** start enforcing `minLevel` until `ownedSpellIds` exists (09-23-003). |
| Write landing | `useSpellQueries.ts` (293 lines) already calls `validateSpellConfig`. Extract `SpellEditor` here. Do not grow `AdminDashboard.tsx` (8 280 lines) until activate exists. |
| New stables | Later EOP file after `20260901`; bump `check-limit` (today **5**). Never amend a shipped `NewActor`. Queued #950 / #1014 / #1083 / #1126 / #1156 / #1171 / #1215 do **not** approve a new required persist field. |
| Live summon cap | `ENEMY_SUMMON_CAP = 2` (`gameConstants.ts` 300). Oct Span (eight), Nine Span (nine), Dec Span (ten), Hendeca Span (eleven), Dodeca Span (twelve), Trideca Span (thirteen), and Tetradeca Span (fourteen) stay activate-blocked. Deca Oath is **not** occupy 10. |

`newSpell()` (`AdminDashboard.tsx` 85–134) still seeds cooldown + mechanic bools + empty summon fields and **omits `targetType`**. Default `usableByPlayer: true` still hydrates every account.

Delete confirm (`AdminDashboard.tsx` 3793–3794) still says the live spell is **removed immediately** and dependents **will break**. Toast is always `"Spell deleted"` (6166). Backend may have only flipped a bool.

Live tabs (5611–5626): Enemies, Regions, Player Sprites, Spells, Map Modifiers, Enemy Tiers, Visuals, Settings, Purchases, Achievements, Enemy Names, Bosses, Ad Boxes, Shop, Boss Rush. Still no Library / Discovery / Kits / Feats-as-graph / Graph / Versions. Queued #945 / #1001 / #1066 / #1115 / #1190 helpers stay over those 15 live tabs. #1162 Spellbook 44px is **player** SpellbookModal, not a sixteenth admin tab. #1196 battle-floor highlight extract is **engine**, not a studio tab.

### 2.2 Superseding rules (unchanged)

Lifecycle ≠ `usableByPlayer`. `PLAYER_LEARNABLE` ≠ the cast gate. `ENEMY_ONLY` / `BOSS_ONLY` stay `lifecycle = active` with `PLAYER_LEARNABLE = false`. Hard delete is legal **only** for `draft` with zero published revisions and zero refs. Already-owned retired spells keep `ownedSpellIds` / levels / bar; `upgradeSpell` stays legal for those ids; Spellbook shows a Retired seal; combat reads the frozen revision; new achievement grants skip a retired reward id and still pay Doka; live kits ignore retired ids at resolve (log once) and activate of a kit that still lists them is blocked.

Ownership migration (when 09-23-003 lands): seed `ownedSpellIds` from the innate four ∪ `spellLevelKeys` ∪ resolving `spellBarOrder` ids. **Do not** grant `getSpellConfigs()`. **Do not** grant the full `starterSpells` array. **Do not** grant Wave-9…19 unique ids, Pack Rank, Rank Fold, Pack Diag, Far Fold, Pack Orth, Leap Fold, Pack Ring, Lane Fold, Pack Hook, Hook Fold, Pack Camel, Camel Fold, Court Floor, Court Lag, Court Prime, Court Snuff, Court Dock, Court Tierce, Court Quarte, Pack File, Diag Fold, or any `ENEMY_ONLY` / `BOSS_ONLY` row because `usableByPlayer !== false`. **Do not** pad the spell bar with catalog ids after a discovery grant (#1171).

Default discovery (08-31 §4, still inert):

```
eligible unknown spell
  → enemy kit actually contains the id
  → enemy successfully casts it
  → observed (persist)
  → player wins that encounter
  → ownedSpellIds + root recap
```

Possession is not observation. Player-side summons do not observe. Hostile summons may. `upgradeSpell` is never the grant writer. Death-gated recap (#923) is not a victory commit. Lethal-reflect Life Drain that currently resurrects (#973) is not a victory commit either. Leftover-XP remount keep (#1036 / #1041 / #1043 / #1045 / #1046 / #1088 / #1092 / #1099) is not a victory commit. Leftover-Doka remount portal keep (#1129 / #1145 / #1147 / #1149 / #1151 / #1153 / #1157) is not a victory commit. Leftover spell-level remount skip (#1215) is not a victory commit and is not a grant. Soaked Mirror Field / Void Mirror / Thorned Ground / leftover-walk lava / Plague Zone / Void Rift (#1079 / #1084 / #1097 / #1100 / #1142 / #1182) is not a victory commit. Pale Archivist kit-first (#1089 / #1102 / #1105) , Enthroned Void kit-first (#1159 / #1164), and Eternal Pawn kit-first (#1204 / #1212) are not grants. Shrine settle (#1156) is not a grant. Spell Master empty-bar padding (#1171) is not a grant.

---

## 3. Queue union after #1187 (do not treat as landed)

| Sibling | What it actually is | Studio rule |
| :--- | :--- | :--- |
| [#1198](https://github.com/Mr-Melic/stralt/pull/1198) | Wave-19 SDE (`generationMin: 19`). Unique §11: `spell-camel-stride`, `spell-deca-oath`, `spell-glyph-reel`, `spell-camel-bite`, `spell-hollow-mark`, `spell-wide-plate`, `spell-fuse-skip`, `spell-hollow-sting`, `spell-summon-camel`, `spell-thin-gift`, `spell-cadence-quint`, `spell-prime-toll`, `spell-brick-levy`, `spell-watch-shave`, `spell-lean-gait`, `spell-glyph-cut`, `spell-fresh-plate`, `spell-pack-camel`, `spell-camel-fold`. `spell-pack-camel` is `ENEMY_ONLY` on `camel_precentor`. `spell-camel-fold` is `BOSS_ONLY` on `camel_fold_regent`. Extra rooms `camel_gallery` / `deca_nave` / `cipher_aisle` / `hollow_pulpit` / `fuse_nave`. Wave-19 family CORE is #1082 unique + #1132 (via #1189), **not** unique §11. Unique §11 stay extras until Wave 21. Unique Wave-18 §11 (#1143) stay extras until Wave 20. Thin Gift is leftover AP **=== 1 AND** leftover MP **=== 0** heal (one body). Cadence Quint is remaining `n>5` → 5. Wide Plate is leftover **AP ≥ 2 AND MP ≥ 1** negate. Hollow Mark is leftover **0/0** turn-end detonate. Camel Stride is a permutation of **(3,2)**. Deca Oath is Chebyshev **exactly 10** spell gate, not occupy 10. `mpCost: 0` on every unique row. | Same rule as 10-27-205 for Wave-18. Do not pre-own `generationMin: 19` ids. Validator rejects `PLAYER_LEARNABLE=true` on Pack Camel / Camel Fold / Court Quarte / Court Tierce. Do not clone Wide Gift / Cadence Quad / Nona Oath / Septet Mend / Cadence Quarte / Tetradeca Span / Court Quarte. **SDE wins** unique leftover collisions vs a later Wave-20 tactical. |
| [#1177](https://github.com/Mr-Melic/stralt/pull/1177) | Wave-19 tactical stamps as Wave **20** family CORE. Septet Mend is both-body leftover **sum === 7** (unequal). Cadence Quarte is remaining `n===4` → 0. Tetradeca Span is axis-aligned **2×7** occupy-weight 14 (blocked at live cap 2). Feud Turn is leftover invert on **caster + one hostile**. Court Quarte never owned. Extra doors `septet_cantor` / `quarte_precentor` / `span_tetradeca` / `court_quarte_regent`. If a same-hour Wave-20 tactical opens, unique dated name; do not overwrite `SPELL_PROPOSALS_2026-10-27.md`. | Honour as distinct leftovers vs #1198 Thin Gift / Cadence Quint / Deca Oath / Camel Stride. Do not alias onto Sestet Mend / Cadence Tierce / Trideca Span. |
| [#1189](https://github.com/Mr-Melic/stralt/pull/1189) | Wave-19 elite CORE = leftover Wave-17 unique except Pack Ring / Lane Fold **plus** #1132 except Court Tierce. #1143 / #1177 stay Wave **20** family CORE. #1198 unique §11 stay extras until Wave **21**. If a same-hour Wave-20 elite opens, unique dated name. | Honour as CORE–SIGNATURE **ids**. Do not pre-own. Do not CORE Camel Stride / Thin Gift / Pack Camel (#1198). Zone NaN still hides paper ADVANCED (09-23-010). |
| [#1170](https://github.com/Mr-Melic/stralt/pull/1170) | Wave-20 + Rush **Table R**: `trim_abbot` / `ready_commissary` / `lean_procurator` / `near_scholastic`; `CHOIR_TRIM` / `NAVE_READY` / `CHOIR_LEAN` / `NAVE_NEAR` stay `BOSS_ONLY`. Leftover #695 Cadence Trim / Near Hood + leftover #726 Ready Sting + leftover #787 Lean Sting. 10-27-206 anticipated this bible; it is now confirmed. [#1139](https://github.com/Mr-Melic/stralt/pull/1139) Wave-19 / Table Q and [#1080](https://github.com/Mr-Melic/stralt/pull/1080) Wave-18 / Table P already covered. If a same-hour Wave-21 / Table S opens, unique dated restack on `BOSS_AND_SPELL_DISCOVERY.md` — **union**, do not invent an 11th canister room. | Closed signatures never enter `ownedSpellIds`. Do not add a fourth kit source. Do not restamp Wave-1…20 feat doors. Never `roomIndex > 9`. |
| [#1176](https://github.com/Mr-Melic/stralt/pull/1176) | Wave-18 synergy formations (drop 19) in unique `docs/design/ENEMY_FORMATIONS_2026-10-27.md` packing #1138 families. Prior [#1134](https://github.com/Mr-Melic/stralt/pull/1134) Wave-17 drop 18 already covered by 10-27-207. If a same-hour Wave-19 drop 20 opens, unique `ENEMY_FORMATIONS_2026-10-28.md`. | Consume CORE ids; clearing a formation is not a grant. Do not overwrite `ENEMY_FORMATIONS_2026-10-26.md` or `ENEMY_FORMATIONS_2026-10-27.md`. Dodeca Plug skip while live cap is 2. |
| [#1199](https://github.com/Mr-Melic/stralt/pull/1199) / [#1200](https://github.com/Mr-Melic/stralt/pull/1200) / [#1202](https://github.com/Mr-Melic/stralt/pull/1202) / [#1203](https://github.com/Mr-Melic/stralt/pull/1203) / [#1207](https://github.com/Mr-Melic/stralt/pull/1207) / [#1208](https://github.com/Mr-Melic/stralt/pull/1208) / [#1210](https://github.com/Mr-Melic/stralt/pull/1210) / [#1168](https://github.com/Mr-Melic/stralt/pull/1168) / [#1182](https://github.com/Mr-Melic/stralt/pull/1182) / [#1216](https://github.com/Mr-Melic/stralt/pull/1216) / [#1217](https://github.com/Mr-Melic/stralt/pull/1217) / [#1205](https://github.com/Mr-Melic/stralt/pull/1205) / [#1206](https://github.com/Mr-Melic/stralt/pull/1206) / [#1211](https://github.com/Mr-Melic/stralt/pull/1211) / [#1214](https://github.com/Mr-Melic/stralt/pull/1214) | Later kit-execute / modifier / summon-control leftovers: Mending Mist 5% store regen (`mendingMistStoreHeal.ts`), Iron Curse player RES ×1.3 (`ironCursePlayerRes.ts`), Swift Winds +2 MP (`swiftWindsStoreMp.ts`), Titan’s Vigor +1000 HP and 1–5× rolls (`titanVigorPlayerHp.ts` / `titanVigorDamageRoll.ts`), Doka Fever +25% enemy HP (`dokaFeverEnemyHp.ts`), Arcane Overflow +10 FAIL-roll fizzle (`arcaneOverflowFailBonus.ts`), Chaos Initiative per-round reshuffle (`chaosInitiativeTurnOrder.ts`), Void Rift 3-damage turn-start tick (`voidRiftPlayerTurnStart.ts`), Pale Archivist Glyph Trap advertised 15 (`bossGlyphTrapDamageExecute.ts`), Broodmother larva-explode contact venom (`bossLarvaeExplodeWalkExecute.ts`), summon-control Inferno CD highlight / arm / kit-select / tick (`summonControlCooldown.ts` / `summonControlCooldownArm.ts` / `summonControlKitSelectCooldown.ts` / `summonControlCooldownTick.ts`). Unique sidecar files vs 10-27 #1148 / #1150 / #1155 / #1158 / #1160 / #1166. Keys are **metadata flags** / kit **ids** / modifier multipliers, never `spell.name`. | Persist those flags with 09-23-005. Union sidecars; one `export function` per name. Not grants. Hostile kit execute may observe (10-22-138); player execute must not. Map-modifier execute leftovers are not catalog ids. Glyph Trap / larva-explode are **abilities**, not catalog ids. |
| [#1215](https://github.com/Mr-Melic/stralt/pull/1215) | Leftover **spell-level** remount skip after `upgradeSpell` `#ok` or a transport throw (`spellLevelKeepRemountWriteSkip.ts`). Distinct from leftover-XP keep and leftover-Doka portal keep. Motoko `upgradeSpell` is `currentLevel + 1` and is **not** idempotent. Play-entry `spellLevelKeys` stay frozen; remount would retry and double-charge. | Same class as 10-27-209 for Doka skips. Discovery must not piggy-back this skip. `upgradeSpell` is never the grant writer. Union helpers; one `export function` per name. Leftover spell-level honour is not `commitSpellDiscoveries` and not `ownedSpellIds`. |
| [#1204](https://github.com/Mr-Melic/stralt/pull/1204) / [#1212](https://github.com/Mr-Melic/stralt/pull/1212) | Eternal Pawn leftovers: kit-first Slow from shadowing AP Drain / Advance. Unique vs Enthroned Void #1152 / #1159 / #1164 and Pale Archivist #1089 / #1102 / #1105. Tests key kit **ids**, never `"Slow"` / `"Advance"` / `"AP Drain"`. | Kit-first leftover is not a grant and not `lifecycle`. Hostile kit cast of Slow may observe once 09-23-009 exists; Advance **ability** is not a catalog id. |
| [#1182](https://github.com/Mr-Melic/stralt/pull/1182) | Void Rift advertised 3-damage player turn-start tick. Unique vs #1142 Plague Zone / #1079 Mirror Field / #1084 Void Mirror / #1097 Thorned/Rift / #1100 leftover-walk lava. | Soaked Untouchable / rift tick is not `commitSpellDiscoveries`. Environmental ticks are not spell observation. |
| [#1174](https://github.com/Mr-Melic/stralt/pull/1174) / [#1201](https://github.com/Mr-Melic/stralt/pull/1201) / [#1209](https://github.com/Mr-Melic/stralt/pull/1209) / [#1213](https://github.com/Mr-Melic/stralt/pull/1213) / [#1195](https://github.com/Mr-Melic/stralt/pull/1195) / [#1172](https://github.com/Mr-Melic/stralt/pull/1172) / [#1183](https://github.com/Mr-Melic/stralt/pull/1183) | Later map snaps (Latch Gate, Pendulum Censer, Hourglass Arch, Shift Slab) are leftover-crumb layout, not spell catalogs. ENC #1195 Score/File/Lava/Ready teaches **#1073** verbs, not unique §11. WDD #1172 Wave-19 `WF-*-MATCH_*`. WDEAD #1183 occupancy/remount rails. | Occupancy unseals / crumb snaps are not grants unless a named door is stamped (`camel_gallery` etc. stay #1198’s). `ENC-SCORE-01` is not Thin Gift. `ENC-FILE-01` is not Camel Stride. `ENC-LAVA-01` is not Fuse Skip. Do not overwrite #1195 / #1172 / #1183 `*2026-10-27*` files. |
| [#1076](https://github.com/Mr-Melic/stralt/pull/1076) / [#1109](https://github.com/Mr-Melic/stralt/pull/1109) / [#1196](https://github.com/Mr-Melic/stralt/pull/1196) | WX extracts already covered by 10-26-197 / 10-27-212. #1196 extracts battle floor highlight paint (`combatTileOverlay.ts`) — **not** AdminDashboard, not studio tabs. | Discovery helpers stay in `engine/*` / `utils/*`. Do not grow WX (19 213 on HEAD) or AdminDashboard (8 280). Do not treat a paint extract as a sixteenth admin tab. |
| [#1190](https://github.com/Mr-Melic/stralt/pull/1190) / [#1163](https://github.com/Mr-Melic/stralt/pull/1163) / [#1193](https://github.com/Mr-Melic/stralt/pull/1193) / [#1101](https://github.com/Mr-Melic/stralt/pull/1101) | Admin UX #1190 reveal-format / purchase-busy / grant-draft / copy-followup helpers do **not** restack `AdminDashboard.tsx` and are **not** spell rollback. EBA #1163 re-audit is docs only, **no new EBA IDs**. AFDA #1193 AFDA-045 unread `apMpLevelThreshold` LS key is not mechanic-flag persist. CRC #1101 still **zero** ids `SAFE_TO_REMOVE`. If same-hour 10-28 Admin UX / EBA / AFDA / CRC open, unique dated names. | Confirm-chrome is not spell rollback. Unread AP/MP cadence key is not mechanic-flag persist. CRC-001 is not a deletion. Do not ship empty Discovery / Kits / Graph / Versions tabs. Do not add a fourth kit table. |
| [#1171](https://github.com/Mr-Melic/stralt/pull/1171) / [#1215](https://github.com/Mr-Melic/stralt/pull/1215) | SDEG 10-27: `spell_master_8` counts empty-bar placeholder length and catalog-padded hydrate (`spellMasterBarCount.ts`); empty-only catalog seed never backfills (`catalogMissingIdSeed.ts`); zone-lock is a browser-global flag (`zoneLockPersist.ts`). Explicitly **no** `ownedSpellIds`. #1215 leftover spell-level remount skip is a persist lock, not observation. If same-hour 10-28 SDEG opens, unique dated names; it must not ship observation maps. | Dual bar / catalog-delete / loot_10 / explorer counter / shrine settle / Spell Master occupancy / leftover spell-level keep is not `ownedSpellIds` and not `lifecycle`. New observation maps still go through 09-23-016. After 003, hydrate must **not** pad empty bar slots with newly granted ids. |
| [#1192](https://github.com/Mr-Melic/stralt/pull/1192) / [#1135](https://github.com/Mr-Melic/stralt/pull/1135) / [#1072](https://github.com/Mr-Melic/stralt/pull/1072) / [#999](https://github.com/Mr-Melic/stralt/pull/999) | AEE 10-27 (`ENEMY_AI_EVOLUTION_2026-10-27.md`, SYS-114…119 / FUT-132…137) remains the AI increment. Inspector (08-31 §7) must list AI modules by **id**, never `inferSummonArchetype` name fallback (`enemyAI.ts` 203–224). Wave-19 unique `aiHint` strings (`walk_camel_3_2`, `next_spell_exact_chebyshev_10`, `attract_toward_nearest_glyph_tax`, `pack_walk_camel_3_2`, `fold_two_player_side_share_camel_3_2`, …) have no `decide*` branch yet (#1198 SDE-003). | Inspector lists modules by **id**. Missing Wave-19 hint → drop that id, log once. Do not emit `shadow_strike`. Do not add a fourth kit table. |
| [#982](https://github.com/Mr-Melic/stralt/pull/982) / [#942](https://github.com/Mr-Melic/stralt/pull/942) | CDA freeze: do not **ship** Wave-15/16/17/18/19 live catalog rows until Wave-1 ownership / observe / G resolve exist. #1198 / #1177 remain `STATUS: PROPOSED`. | Honour the freeze. This studio does not mint Wave-19 unique §11 into `starterSpells`. |

Still queued (do not re-issue): #564 `SpellSummonFields` (09-25), #568 linear⊕diagonal (09-25-055), 09-28-084…098, 09-29-099…115, 10-21-116…129, 10-22-130…144, 10-23-145…159, 10-24-160…174, 10-25-175…189, 10-26-190…204, 10-27-205…219, #747 / #726 / #752 / #753 / #733 / #730 / #754 / #766 / #757 / #762 / #802 / #787 / #796 / #808 / #837 / #849 / #840 / #836 / #825 / #906 / #890 / #899 / #903 / #897 / #911 / #962 / #953 / #941 / #951 / #956 / #997 / #1004 / #1005 / #1011 / #1017 / #1063 / #1073 / #1082 / #1132 / #1138 / #1080 / #1139 / #1143 / #1170 / #1176 / #1177 / #1189 / #1198.

Same-hour 10-27 flock also opened telemetry / PX / balance / long-horizon / Health skip / a11y / map integrity / content-diversity freeze. Those are not spell-studio work. Unique `*2026-10-27*` files, not this studio. #942 / #982 CDA freeze Wave-16 HP clones — this studio does not mint Wave-20 unique §11 (that is the next SDE generation). Do not restamp their files or grow WX from #995 / #1076 / #1079 / #1097 / #1196.

---

## 4. Owner UI (dev-gated — still the 08-31 studio)

Carved-stone / slate / crimson. Same `#admin` + lazy `AdminDashboard` gate.

Immediate UI honesty (can land with persist 001/004, not a restyle):

- Delete on published ids is **Retire**. Confirm lists dependents. Toast must say retired vs rejected vs draft-deleted. Union #945 `shouldDismissOwnerConfirm` and #1001 / #1066 / #1115 / #1190 confirm-chrome so Shop/GameKey/delete dialogs stay until `#ok`.
- Cast-gate checkboxes stay labeled “player may cast” / “enemy may cast.” Lifecycle is a separate control.
- Validation strip: missing `targetType`, broken kit id, name-heuristic leftover = crimson.
- Spell Type includes `summon`. Summon section: `summonAI`, lifespan, piece, scales, **displayName**, kit ids.
- `⌘K` (queued #838 / #945) stays over the 15 live tabs until activate exists. Do not ship empty Discovery / Kits / Graph / Versions / Challenges / AI / Formations tabs.

Do not grow the 8 280-line dashboard until activate exists on the canister (08-31 SDA-012 / 09-23-013 / 09-23-015). Extract `SpellEditor` onto `useSpellQueries.ts`. Do not grow `WorldExploration.tsx`. Restack AdminDashboard siblings as **one** extract. #1162 Spellbook floors stay in `SpellbookModal.tsx`. #1196 paint extract stays in `engine/*`.

Support still required and still missing: duplicate, compare versions, draft, validate (activate gate), activate, deactivate, dependency inspection, rollback.

---

## 5. Prior ACTION_ID status @ `0f5363f`

Unchanged from 09-23 § / 09-29 § / 10-21 § / 10-22 § / 10-23 § / 10-24 § / 10-25 § / 10-26 § / 10-27 §:

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

---

## 6. Out of scope

- Production TypeScript / Motoko / Candid in this PR
- RAF, map generation, turn logic, damage math
- Growing `WorldExploration.tsx` or concatenating a second `export function` on restack
- Re-authoring Wave-1…20 spell cards or boss adaptations
- Treating `adminSafety.ts` helpers, #775 AUX copy, #810 stack rails, #838 five-writer rollback, #911 pack-kit fill, #945 confirm-dismiss, #1001 confirm-chrome, #1014 catalog-delete lock, #1083 loot_10 helpers, #1156 shrine settle, #1171 Spell Master occupancy, or #1215 leftover spell-level keep as persist `lifecycle` / ownership
- Re-opening 09-01-002 bindgen work
- Re-issuing 09-21…10-27 IDs
- Editing Cursor dashboard prompts (no write API)
- Landing Wave-11 / Wave-12 / Wave-13 / Wave-14 / Wave-15 / Wave-16 / Wave-17 / Wave-18 / Wave-19 catalog rows before 09-23-003
- Enforcing `SpellConfig.minLevel` at hydrate without `ownedSpellIds`
- Treating the merge freeze as “those drafts landed”
- Editing `MASTER_ROADMAP.md` (#338 / #783 / #814 / #870 / #946 / #998 / #1074 / #1124 / #1186)
- Minting Wave-20 unique §11 (next SDE generation; #942 / #982 CDA freeze)
- Overwriting sibling `*2026-10-24*` files
- Overwriting sibling `*2026-10-25*` files
- Overwriting sibling `*2026-10-26*` files (#1108–#1162)
- Overwriting sibling `*2026-10-27*` files (#1163–#1217, including `SPELL_ADMIN_DESIGN_2026-10-27.md`, `ACTION_IDS_SDA_2026-10-27.md`, `SPELL_DISCOVERY_ECOSYSTEM_2026-10-27.md`, `ACTION_IDS_SDE_2026-10-27.md`, `SPELL_PROPOSALS_2026-10-27.md`, `ENEMY_FORMATIONS_2026-10-27.md`, `ENEMY_ELITE_EVOLUTION_2026-10-27.md`, `ENEMY_AI_EVOLUTION_2026-10-27.md`)
- Overwriting sibling `*2026-10-28*` files opened this hour

---

## 7. ACTION_ID index (this run)

All items: `STATUS: NEW`. Full records: [`ACTION_IDS_SDA_2026-10-28.md`](./ACTION_IDS_SDA_2026-10-28.md).

| ID | Title | Priority |
| :--- | :--- | :--- |
| SDA-2026-10-28-220 | Honour #1198 Wave-19 SDE stamps; do not pre-own generationMin 19 ids | P1 |
| SDA-2026-10-28-221 | Honour #1170 Wave-20 boss / Rush Table R; no fourth kit source | P1 |
| SDA-2026-10-28-222 | Honour #1176 Wave-18 formations; consume CORE ids, do not grant | P1 |
| SDA-2026-10-28-223 | Persist later kit-execute/modifier/summon-control Inferno metadata flags | P1 |
| SDA-2026-10-28-224 | Remount leftover-Doka continues; leftover spell-level keep is not a victory commit | P1 |
| SDA-2026-10-28-225 | Do not treat Deca Oath as occupy-10; grow closed knownSummonAI with tetradecaspan | P0 |
| SDA-2026-10-28-226 | Honour later map snaps / ENC / WDD / WDEAD; not grants | P1 |
| SDA-2026-10-28-227 | Keep later combat helpers in engine/*; battle-floor extract is not a studio tab | P1 |
| SDA-2026-10-28-228 | Honour #1198 extra doors; first-grant only | P1 |
| SDA-2026-10-28-229 | Keep Thin Gift ≠ Septet Mend and Cadence Quint ≠ Cadence Quarte | P0 |
| SDA-2026-10-28-230 | Honour Admin UX / EBA / AFDA / CRC; do not add empty studio tabs or a fourth kit source | P1 |
| SDA-2026-10-28-231 | Honour #1171 SDEG persist locks; Spell Master padding is not ownedSpellIds or lifecycle | P1 |
| SDA-2026-10-28-232 | Honour Eternal Pawn kit-first leftovers; kit ids are not grants | P1 |
| SDA-2026-10-28-233 | Modifier execute leftovers and ability packets are not a victory commit | P1 |
| SDA-2026-10-28-234 | Honour #1192 AI increment; inspector lists modules by id | P1 |
