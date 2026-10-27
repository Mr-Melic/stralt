# Spell, Discovery & Achievement Admin Design — 2026-10-27 re-audit

**Author:** Spell, Discovery & Achievement Admin Designer  
**Automation:** `4efa22ec-a498-11f1-a7d1-d6b4613131ce`  
**Date:** 2026-10-27  
**HEAD audited:** `0f5363f` (`Merge pull request #332`) — unchanged since the 09-21 re-audit  
**Scope:** Owner tooling for the complete spell ecosystem. **No production code in this PR.**

This is a **delta** on [`SPELL_ADMIN_DESIGN_2026-08-31.md`](./SPELL_ADMIN_DESIGN_2026-08-31.md) (#116). Sections 2–11 of that document remain the studio contract (canonical `SpellDefinition`, acquisition routes, observe→win→unlock, CORE–SIGNATURE pools, dependency views, soft-retire + legacy owned, studio tabs, persist sketch). 09-01 / 09-02 deltas still stand (bindgen 09-01-002 LANDED; empty-AI half of 09-02-006 LANDED).

It records what is still the wrong field on `main`, and the ACTION_IDs in [`ACTION_IDS_SDA_2026-10-27.md`](./ACTION_IDS_SDA_2026-10-27.md) (**205–219** only).

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

Same-hour and later 2026-10-26 flock already opened (unique dated files — **do not overwrite**): [#1140](https://github.com/Mr-Melic/stralt/pull/1140) SDA 190–204, [#1141](https://github.com/Mr-Melic/stralt/pull/1141) long-horizon, [#1142](https://github.com/Mr-Melic/stralt/pull/1142) Plague Zone soak, [#1143](https://github.com/Mr-Melic/stralt/pull/1143) Wave-18 SDE (`SPELL_DISCOVERY_ECOSYSTEM_2026-10-26.md`, `ACTION_IDS_SDE_2026-10-26.md`), [#1144](https://github.com/Mr-Melic/stralt/pull/1144) PX, plus later 10-26 sidecars [#1145](https://github.com/Mr-Melic/stralt/pull/1145)–[#1162](https://github.com/Mr-Melic/stralt/pull/1162). Same-hour 2026-10-27 flock uses unique dated filenames — **do not overwrite** any `*2026-10-27*` sibling (Wave-19 SDE / Wave-19 tactical / Wave-19 elite / Wave-20 bosses / drop-19 formations / ENC / WDD / WDEAD / SDEG / AEE / AFDA / Admin UX / MASTER_ROADMAP if they open). This PR only adds `SPELL_ADMIN_DESIGN_2026-10-27.md` and `ACTION_IDS_SDA_2026-10-27.md`.

Do not implement those IDs unless a human or orchestrator picks one. Do not grow `WorldExploration.tsx` (19 213 lines on HEAD). Never introduce spell-name heuristics. Next implementer still starts at **09-23-001**, then **007**, then **003+023**. Do not land Wave-9 / 10 / 11 / 12 / 13 / 14 / 15 / 16 / 17 / **18** catalog rows before 003. Persist maps go through **09-23-016** (new later EOP file after `20260901`; `check-limit = 5` today). Do not extend the `usableByPlayer=false` retire path.

---

## 1. Why this run exists

The 10-26 run closed the queue through #1140 (Wave-17 SDE/tactical/elite, Wave-18 bosses / Table P, Wave-19 bosses / Table Q, later kit-execute/decide, remount leftover-XP / leftover-Doka keep, `dodecaspan` / `tridecaspan` enums, SDE win on Gait Gift / Cadence Tern vs #1063 / #1132). Same `HEAD`. Calendar is **2026-10-27**. `origin/main` has not moved since 2026-09-03 (`0f5363f`). The 10-26 audit’s “newest #1139 / 803+ open” snapshot is stale: later 10-26 Wave-18 SDE plus combat / remount / soak / a11y sidecars opened **#1141–#1162**. Open queue at this patch: **831** drafts. Newest sibling before this work: **#1162** (Spellbook 44px floors). Do not touch `MASTER_ROADMAP.md` (#870 / #946 / #998 / #1074 / #1124 are pre-existing oldest-first conflicts on that file). Do not overwrite #1140 SDA `*2026-10-26*` files, #1143 Wave-18 SDE `*2026-10-26*` files, or same-hour `*2026-10-27*` siblings.

The product hole is unchanged: catalog still grants, discovery still does not exist, retirement is still a cast flag.

What *is* new for this studio is the flock **after** #1140 that 190–204 did not stamp: Wave-18 discovery (#1143, `generationMin: 18`, Pack Hook `ENEMY_ONLY`, Hook Fold `BOSS_ONLY`, Wide Gift leftover AP **≥ 2 AND** leftover MP **≥ 1**, Cadence Quad remaining `n>4` → 4), later leftover-Doka remount portal skips (#1145 / #1147 / #1149 / #1151 / #1153 / #1157), shrine settle (#1156), kit-execute/modifier leftovers (#1148 Vampiric Ground, #1150 summon-bomber Inferno CD, #1155 Iron Curse heal ×0.5, #1158 WX summon availableSpells CD, #1160 Glass Realm ×2), Enthroned Void Phantom Spawn HP + kit-first Swap (#1152 / #1159), Plague Zone soak (#1142), map snaps (#1146 Slipstream, #1154 Cinder Barrel, #1161 MAP_ROTATE), and player Spellbook 44px (#1162 — not studio tabs). Closed `knownSummonAI` still omits every queued occupy enum. Wave-18 unique Nona Oath is a Chebyshev-9 **spell gate**, not occupy 9.

The 08-31 contract is still the destination. The 10-27 IDs are queue-union only. Do not mint a second 001–204.

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
| Three boss kit sources | Live combat: `data/bossKits.ts`. Motoko `defaultBossConfigs()` still lists purged ids (`admin.mo` 358+ `fireball`, `cursed_gust`, `entangle`, `mist_form`, …). Admin chips: `getSpellConfigs()`. Queued #818 / #887 / #929 / #934 / #980 / #996 / #1044 / #1111 name that split — they are not a fourth kit table. |
| Bar persist still upgrade-keys only | `setSpellBarOrder` filters to `spellLevelKeys` (`main.mo` 1945–1947). Queued #950 dual `activeSpells : ?[Nat]` vs `spellBarOrder : ?[Text]` and #1014 `legacyActiveSpellsMigrate.ts` are stale-schema locks, not `ownedSpellIds`. |
| Spell Save is a live overwrite | `adminSetSpellConfig` (`main.mo` 869–879). No `adminRollbackSpellConfig`. Queued #838 / #945 / #1001 / #1066 / #1115 types rollback / confirm-dismiss / confirm-chrome / principal-gate / confirm-snapshot for **other** writers — **not** spells. |
| Enemy hard delete | `adminDeleteEnemyConfig` (`main.mo` 798–804) is unconditional `remove`. #1014 `enemyConfigHardDeletesWithoutReferenceCheck()` locks that fact. |
| Achievement delete | Progress present → `active=false`; else `remove`. Unlock rejects inactive. Official Claim UI hides `active=false` while `claimAchievementReward` still pays Doka (queued #828 sidecar). |
| Activate gate is still a payload clamp | Both validators reject `apCost < 1` (`adminGuard.mo` 380–382; `adminSafety.ts` 604–606) — live Timestep is `apCost: 0` (`spellData.ts` 216–226). Closed `knownSummonAI` / `knownPieceType` still omit `font` / `dummypost` / `pentaspan` / `septspan` (`adminGuard.mo` 363–373) and queued `octspan` / `gauntpost` / `sixspan` / `ninespan` / `poisepost` / `decspan` / `tallypost` / `hendecaspan` / `scorepost` / `dodecaspan` / `tridecaspan`. Wave-18 unique Nona Oath does **not** add an occupy enum. |
| `minLevel` is catalog copy, not a gate | `void_collapse` seeds `minLevel: 30` (`admin.mo` 190) and still hydrates a level-1 book. Queued #828 `spellMinLevelHydrate.ts` locks that fact. Do **not** start enforcing `minLevel` until `ownedSpellIds` exists (09-23-003). |
| Write landing | `useSpellQueries.ts` (293 lines) already calls `validateSpellConfig`. Extract `SpellEditor` here. Do not grow `AdminDashboard.tsx` (8 280 lines) until activate exists. |
| New stables | Later EOP file after `20260901`; bump `check-limit` (today **5**). Never amend a shipped `NewActor`. Queued #950 / #1014 / #1083 / #1126 / #1156 do **not** approve a new required persist field. |
| Live summon cap | `ENEMY_SUMMON_CAP = 2` (`gameConstants.ts` 300). Oct Span (eight), Nine Span (nine), Dec Span (ten), Hendeca Span (eleven), Dodeca Span (twelve), and Trideca Span (thirteen) stay activate-blocked. Nona Oath is **not** occupy 9. |

`newSpell()` (`AdminDashboard.tsx` 85–134) still seeds cooldown + mechanic bools + empty summon fields and **omits `targetType`**. Default `usableByPlayer: true` still hydrates every account.

Delete confirm (`AdminDashboard.tsx` 3793–3794) still says the live spell is **removed immediately** and dependents **will break**. Toast is always `"Spell deleted"` (6166). Backend may have only flipped a bool.

Live tabs (5611–5626): Enemies, Regions, Player Sprites, Spells, Map Modifiers, Enemy Tiers, Visuals, Settings, Purchases, Achievements, Enemy Names, Bosses, Ad Boxes, Shop, Boss Rush. Still no Library / Discovery / Kits / Feats-as-graph / Graph / Versions. Queued #945 / #1001 / #1066 / #1115 helpers stay over those 15 live tabs. #1162 Spellbook 44px is **player** SpellbookModal, not a sixteenth admin tab.

### 2.2 Superseding rules (unchanged)

Lifecycle ≠ `usableByPlayer`. `PLAYER_LEARNABLE` ≠ the cast gate. `ENEMY_ONLY` / `BOSS_ONLY` stay `lifecycle = active` with `PLAYER_LEARNABLE = false`. Hard delete is legal **only** for `draft` with zero published revisions and zero refs. Already-owned retired spells keep `ownedSpellIds` / levels / bar; `upgradeSpell` stays legal for those ids; Spellbook shows a Retired seal; combat reads the frozen revision; new achievement grants skip a retired reward id and still pay Doka; live kits ignore retired ids at resolve (log once) and activate of a kit that still lists them is blocked.

Ownership migration (when 09-23-003 lands): seed `ownedSpellIds` from the innate four ∪ `spellLevelKeys` ∪ resolving `spellBarOrder` ids. **Do not** grant `getSpellConfigs()`. **Do not** grant the full `starterSpells` array. **Do not** grant Wave-9…18 unique ids, Pack Rank, Rank Fold, Pack Diag, Far Fold, Pack Orth, Leap Fold, Pack Ring, Lane Fold, Pack Hook, Hook Fold, Court Floor, Court Lag, Court Prime, Court Snuff, Court Dock, Court Tierce, Pack File, Diag Fold, or any `ENEMY_ONLY` / `BOSS_ONLY` row because `usableByPlayer !== false`.

Default discovery (08-31 §4, still inert):

```
eligible unknown spell
  → enemy kit actually contains the id
  → enemy successfully casts it
  → observed (persist)
  → player wins that encounter
  → ownedSpellIds + root recap
```

Possession is not observation. Player-side summons do not observe. Hostile summons may. `upgradeSpell` is never the grant writer. Death-gated recap (#923) is not a victory commit. Lethal-reflect Life Drain that currently resurrects (#973) is not a victory commit either. Leftover-XP remount keep (#1036 / #1041 / #1043 / #1045 / #1046 / #1088 / #1092 / #1099) is not a victory commit. Leftover-Doka remount portal keep (#1129 / #1145 / #1147 / #1149 / #1151 / #1153 / #1157) is not a victory commit. Soaked Mirror Field / Void Mirror / Thorned Ground / leftover-walk lava / Plague Zone (#1079 / #1084 / #1097 / #1100 / #1142) is not a victory commit. Pale Archivist kit-first (#1089 / #1102 / #1105) and Enthroned Void kit-first (#1159) are not grants. Shrine settle (#1156) is not a grant.

---

## 3. Queue union after #1140 (do not treat as landed)

| Sibling | What it actually is | Studio rule |
| :--- | :--- | :--- |
| [#1143](https://github.com/Mr-Melic/stralt/pull/1143) | Wave-18 SDE (`generationMin: 18`). Unique §11: `spell-hook-stride`, `spell-nona-oath`, `spell-slide-reel`, `spell-hook-bite`, `spell-idle-mark`, `spell-thin-plate`, `spell-brier-skip`, `spell-wide-sting`, `spell-summon-hook`, `spell-wide-gift`, `spell-cadence-quad`, `spell-even-toll`, `spell-brick-fee`, `spell-watch-bind`, `spell-prime-gait`, `spell-slide-cut`, `spell-idle-plate`, `spell-pack-hook`, `spell-hook-fold`. `spell-pack-hook` is `ENEMY_ONLY` on `hook_precentor`. `spell-hook-fold` is `BOSS_ONLY` on `hook_fold_regent`. Extra rooms `hook_gallery` / `nona_nave` / `mill_aisle` / `idle_pulpit` / `brier_nave`. Wave-18 family CORE is #1017 unique + #1063 (via #1138), **not** unique §11. Unique §11 stay extras until Wave 20. Unique Wave-17 §11 (#1082) stay extras until Wave 19. Wide Gift is leftover AP **≥ 2 AND** leftover MP **≥ 1** (one body). Cadence Quad is remaining `n>4` → 4. Thin Plate is leftover **1/0** negate. Hook Stride is a permutation of **(3,1)**. Nona Oath is Chebyshev **exactly 9** spell gate, not occupy 9. `mpCost: 0` on every unique row. | Same rule as 10-26-190 for Wave-17. Do not pre-own `generationMin: 18` ids. Validator rejects `PLAYER_LEARNABLE=true` on Pack Hook / Hook Fold / Court Tierce. Do not clone Gait Gift / Cadence Tern / Octa Oath / Sestet Mend / Cadence Tierce / Trideca Span / Court Tierce. **SDE wins** unique leftover collisions vs a later Wave-19 tactical. |
| [#1132](https://github.com/Mr-Melic/stralt/pull/1132) | Already covered by 10-26-199. Wave-18 tactical stamps as Wave **19** family CORE. If a same-hour Wave-19 tactical opens, unique dated name; do not overwrite `SPELL_PROPOSALS_2026-10-26.md`. | Honour as distinct leftovers vs #1143 Wide Gift / Cadence Quad / Nona Oath / Hook Stride. Do not alias onto Stave Mend / Cadence Dock / Dodeca Span. |
| [#1138](https://github.com/Mr-Melic/stralt/pull/1138) | Already covered by 10-26-190/192. Wave-18 elite CORE = leftover Wave-16 unique except Pack Orth / Leap Fold **plus** #1063 except Court Dock. #1082 / #1132 stay Wave **19** family CORE. #1143 unique §11 stay extras until Wave **20**. If a same-hour Wave-19 elite opens, unique dated name. | Honour as CORE–SIGNATURE **ids**. Do not pre-own. Do not CORE Hook Stride / Wide Gift / Pack Hook (#1143). Zone NaN still hides paper ADVANCED (09-23-010). |
| [#1080](https://github.com/Mr-Melic/stralt/pull/1080) / [#1139](https://github.com/Mr-Melic/stralt/pull/1139) | Already covered by 10-26-191. No new boss bible after #1139. If a same-hour Wave-20 boss / Table R opens, unique dated files on `BOSS_AND_SPELL_DISCOVERY.md` restack — **union**, do not invent an 11th canister room. | Closed signatures never enter `ownedSpellIds`. Do not add a fourth kit source. Do not restamp Wave-1…19 feat doors. Never `roomIndex > 9`. |
| [#1075](https://github.com/Mr-Melic/stralt/pull/1075) / [#1134](https://github.com/Mr-Melic/stralt/pull/1134) | Already covered by 10-26-192. If a same-hour Wave-18 formations drop 19 opens, unique dated `ENEMY_FORMATIONS_2026-10-27.md`. | Consume CORE ids; clearing a formation is not a grant. Do not overwrite `ENEMY_FORMATIONS_2026-10-25.md` or `ENEMY_FORMATIONS_2026-10-26.md`. |
| [#1148](https://github.com/Mr-Melic/stralt/pull/1148) / [#1150](https://github.com/Mr-Melic/stralt/pull/1150) / [#1155](https://github.com/Mr-Melic/stralt/pull/1155) / [#1158](https://github.com/Mr-Melic/stralt/pull/1158) / [#1160](https://github.com/Mr-Melic/stralt/pull/1160) | Later kit-execute / modifier leftovers: Vampiric Ground 15% attacker lifesteal (`vampiricGroundLifesteal.ts`), summon-bomber Inferno CD shared with `findKitSpell` available (`wxSummonBomberInfernoCooldown.ts`), Iron Curse advertised healing ×0.5 (`ironCurseHealScale.ts`), WX summon `availableSpells` pack CD filter (`wxSummonAvailableCooldown.ts`), Glass Realm advertised damage ×2 (`glassRealmDamageExecute.ts`). Unique sidecar files vs 10-26 #1104 / #1107 / #1123. Keys are **metadata flags** / kit **ids** / modifier multipliers, never `spell.name`. | Persist those flags with 09-23-005. Union sidecars; one `export function` per name. Not grants. Hostile kit execute may observe (10-22-138); player execute must not. Glass Realm / Iron Curse / Vampiric Ground are map-modifier execute leftovers, not catalog ids. |
| [#1145](https://github.com/Mr-Melic/stralt/pull/1145) / [#1147](https://github.com/Mr-Melic/stralt/pull/1147) / [#1149](https://github.com/Mr-Melic/stralt/pull/1149) / [#1151](https://github.com/Mr-Melic/stralt/pull/1151) / [#1153](https://github.com/Mr-Melic/stralt/pull/1153) / [#1157](https://github.com/Mr-Melic/stralt/pull/1157) / [#1156](https://github.com/Mr-Melic/stralt/pull/1156) | More remount leftover-Doka portal skips after #1129: one-shot Doka keep, GameKey keep, feat Doka keep, Boss Rush Doka keep, spend keep, shop/heal throw-after-accept. Unique sidecar files (`oneShotDokaKeepRemountPortalCreditWriteSkip.ts`, `gameKeyDokaKeepRemountPortalCreditWriteSkip.ts`, …). #1156 keeps the shrine room open until altar Doka settle (`shrineAltarCreditFinalize.ts`) — persist lock, not a spell grant. | Same class as 10-26-194. Discovery must not piggy-back these skips. Union helpers; one `export function` per name. Leftover-Doka / shrine settle is not `commitSpellDiscoveries`. |
| [#1152](https://github.com/Mr-Melic/stralt/pull/1152) / [#1159](https://github.com/Mr-Melic/stralt/pull/1159) | Enthroned Void leftovers: #1152 locks advertised Phantom Spawn HP against WX stamp 20 (`bossPhantomSpawnHpCommit.ts`); #1159 locks kit-first Swap from shadowing Phantom Spawn (`bossPhantomSpawnDecideCommit.ts`). Unique vs Pale Archivist #1089 / #1102 / #1105 / #1113. Tests key kit **ids**, never `"Swap"` / `"Phantom Spawn"`. | Kit-first leftover is not a grant and not `lifecycle`. Phantom Spawn HP stamp is not a grant and not `shouldAwardVictory`. Hostile kit cast of Swap may observe once 09-23-009 exists; Phantom Spawn **ability** is not a catalog id. |
| [#1142](https://github.com/Mr-Melic/stralt/pull/1142) | Plague Zone turn-start tick soak like `playerTakesDamage` (`plagueZonePlayerHit.ts`). Unique vs #1079 Mirror Field / #1084 Void Mirror / #1097 Thorned/Rift / #1100 leftover-walk lava. | Soaked Untouchable / plague tick is not `commitSpellDiscoveries`. Environmental ticks are not spell observation. |
| [#1146](https://github.com/Mr-Melic/stralt/pull/1146) / [#1154](https://github.com/Mr-Melic/stralt/pull/1154) / [#1161](https://github.com/Mr-Melic/stralt/pull/1161) / [#1121](https://github.com/Mr-Melic/stralt/pull/1121) / [#1114](https://github.com/Mr-Melic/stralt/pull/1114) / [#1128](https://github.com/Mr-Melic/stralt/pull/1128) | Later map snaps (Slipstream, Cinder Barrel, MAP_ROTATE / MIRROR_INVERT) are leftover-crumb layout, not spell catalogs. ENC #1121 / WDD #1114 / WDEAD #1128 already covered by 10-26-196. If same-hour 10-27 ENC / WDD / WDEAD open, unique dated names. | Occupancy unseals / crumb snaps are not grants unless a named door is stamped (`hook_gallery` etc. stay #1143’s). `ENC-KNIGHT-01` is not Hook Stride. `ENC-POISE-01` is not Wide Gift. `ENC-FOLD-01` is not Hook Fold. Do not overwrite #1121 / #1114 / #1128 `*2026-10-26*` files. |
| [#1076](https://github.com/Mr-Melic/stralt/pull/1076) / [#1109](https://github.com/Mr-Melic/stralt/pull/1109) / [#1162](https://github.com/Mr-Melic/stralt/pull/1162) | WX extracts already covered by 10-26-197. #1162 is player Spellbook Save / Cancel / upgrade 44px (`spellbookTouchTarget.ts`) — **not** AdminDashboard, not studio tabs. | Discovery helpers stay in `engine/*` / `utils/*`. Do not grow WX (19 213 on HEAD) or AdminDashboard (8 280). Do not treat Spellbook floors as a sixteenth admin tab. |
| [#1115](https://github.com/Mr-Melic/stralt/pull/1115) / [#1111](https://github.com/Mr-Melic/stralt/pull/1111) / [#1130](https://github.com/Mr-Melic/stralt/pull/1130) / [#1101](https://github.com/Mr-Melic/stralt/pull/1101) | Already covered by 10-26-200. If same-hour 10-27 Admin UX / EBA / AFDA / CRC open, unique dated names. | Confirm-chrome is not spell rollback. Unread `effectParams` / unused `spellDmgGrowthPercent` is not mechanic-flag persist. CRC-001 is not a deletion. Do not ship empty Discovery / Kits / Graph / Versions tabs. Do not add a fourth kit table. |
| [#1083](https://github.com/Mr-Melic/stralt/pull/1083) / [#1126](https://github.com/Mr-Melic/stralt/pull/1126) / [#1156](https://github.com/Mr-Melic/stralt/pull/1156) | Persist locks already covered by 10-26-201. #1156 shrine settle is a room-open-until-credit lock, not `ownedSpellIds`. If same-hour 10-27 SDEG opens, unique dated names; it must not ship observation maps. | Dual bar / catalog-delete / loot_10 / explorer counter / shrine settle is not `ownedSpellIds` and not `lifecycle`. New observation maps still go through 09-23-016. |
| [#1135](https://github.com/Mr-Melic/stralt/pull/1135) / [#1072](https://github.com/Mr-Melic/stralt/pull/1072) / [#999](https://github.com/Mr-Melic/stralt/pull/999) | Already covered by 10-26-204. If same-hour 10-27 AEE opens, unique dated `ENEMY_AI_EVOLUTION_2026-10-27.md`. Wave-18 unique `aiHint` strings (`walk_hook_3_1`, `next_spell_exact_chebyshev_9`, `attract_toward_nearest_slide`, `pack_walk_hook_3_1`, `fold_two_player_side_share_hook_3_1`, …) have no `decide*` branch yet (#1143 SDE-003). | Inspector lists modules by **id**. Missing Wave-18 hint → drop that id, log once. Do not emit `shadow_strike`. Do not add a fourth kit table. |
| [#982](https://github.com/Mr-Melic/stralt/pull/982) / [#942](https://github.com/Mr-Melic/stralt/pull/942) | CDA freeze: do not **ship** Wave-15/16/17/18 live catalog rows until Wave-1 ownership / observe / G resolve exist. #1143 / #1132 remain `STATUS: PROPOSED`. | Honour the freeze. This studio does not mint Wave-18 unique §11 into `starterSpells`. |

Still queued (do not re-issue): #564 `SpellSummonFields` (09-25), #568 linear⊕diagonal (09-25-055), 09-28-084…098, 09-29-099…115, 10-21-116…129, 10-22-130…144, 10-23-145…159, 10-24-160…174, 10-25-175…189, 10-26-190…204, #747 / #726 / #752 / #753 / #733 / #730 / #754 / #766 / #757 / #762 / #802 / #787 / #796 / #808 / #837 / #849 / #840 / #836 / #825 / #906 / #890 / #899 / #903 / #897 / #911 / #962 / #953 / #941 / #951 / #956 / #997 / #1004 / #1005 / #1011 / #1017 / #1063 / #1073 / #1082 / #1132 / #1138 / #1080 / #1139 / #1143.

Same-hour 10-26 flock also opened telemetry / PX / balance / long-horizon / Health skip / a11y / map integrity / content-diversity freeze. Those are not spell-studio work. Unique `*2026-10-26*` files, not this studio. #942 / #982 CDA freeze Wave-16 HP clones — this studio does not mint Wave-19 unique §11 (that is the next SDE generation). Do not restamp their files or grow WX from #995 / #1076 / #1079 / #1097.

---

## 4. Owner UI (dev-gated — still the 08-31 studio)

Carved-stone / slate / crimson. Same `#admin` + lazy `AdminDashboard` gate.

Immediate UI honesty (can land with persist 001/004, not a restyle):

- Delete on published ids is **Retire**. Confirm lists dependents. Toast must say retired vs rejected vs draft-deleted. Union #945 `shouldDismissOwnerConfirm` and #1001 / #1066 / #1115 confirm-chrome so Shop/GameKey/delete dialogs stay until `#ok`.
- Cast-gate checkboxes stay labeled “player may cast” / “enemy may cast.” Lifecycle is a separate control.
- Validation strip: missing `targetType`, broken kit id, name-heuristic leftover = crimson.
- Spell Type includes `summon`. Summon section: `summonAI`, lifespan, piece, scales, **displayName**, kit ids.
- `⌘K` (queued #838 / #945) stays over the 15 live tabs until activate exists. Do not ship empty Discovery / Kits / Graph / Versions / Challenges / AI / Formations tabs.

Do not grow the 8 280-line dashboard until activate exists on the canister (08-31 SDA-012 / 09-23-013 / 09-23-015). Extract `SpellEditor` onto `useSpellQueries.ts`. Do not grow `WorldExploration.tsx`. Restack AdminDashboard siblings as **one** extract. #1162 Spellbook floors stay in `SpellbookModal.tsx`.

Support still required and still missing: duplicate, compare versions, draft, validate (activate gate), activate, deactivate, dependency inspection, rollback.

---

## 5. Prior ACTION_ID status @ `0f5363f`

Unchanged from 09-23 § / 09-29 § / 10-21 § / 10-22 § / 10-23 § / 10-24 § / 10-25 § / 10-26 §:

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

---

## 6. Out of scope

- Production TypeScript / Motoko / Candid in this PR
- RAF, map generation, turn logic, damage math
- Growing `WorldExploration.tsx` or concatenating a second `export function` on restack
- Re-authoring Wave-1…19 spell cards or boss adaptations
- Treating `adminSafety.ts` helpers, #775 AUX copy, #810 stack rails, #838 five-writer rollback, #911 pack-kit fill, #945 confirm-dismiss, #1001 confirm-chrome, #1014 catalog-delete lock, #1083 loot_10 helpers, or #1156 shrine settle as persist `lifecycle` / ownership
- Re-opening 09-01-002 bindgen work
- Re-issuing 09-21…10-26 IDs
- Editing Cursor dashboard prompts (no write API)
- Landing Wave-11 / Wave-12 / Wave-13 / Wave-14 / Wave-15 / Wave-16 / Wave-17 / Wave-18 catalog rows before 09-23-003
- Enforcing `SpellConfig.minLevel` at hydrate without `ownedSpellIds`
- Treating the merge freeze as “those drafts landed”
- Editing `MASTER_ROADMAP.md` (#338 / #783 / #814 / #870 / #946 / #998 / #1074 / #1124)
- Minting Wave-19 unique §11 (next SDE generation; #942 / #982 CDA freeze)
- Overwriting sibling `*2026-10-24*` files (#980 EBA, #996 AFDA, #997 elite, #999 AEE, #1005 formations, #1006 ENC, #1007 SDA, #1011 tactical, #1014 SDEG, #1015 WDEAD, #1017 SDE, #1018 UX)
- Overwriting sibling `*2026-10-25*` files (#1044 EBA, #1050 WDEAD, #1055 AFDA, #1056 ENC, #1060 UX, #1063 Wave-17 tactical, #1064 WDD, #1066 Admin UX, #1072 AEE, #1073 Wave-17 elite, #1078 SDA, #1080 boss bible, #1082 SDE, #1083 SDEG, #1101 CRC, #1106 quality audit)
- Overwriting sibling `*2026-10-26*` files (#1108–#1162, including `SPELL_ADMIN_DESIGN_2026-10-26.md`, `ACTION_IDS_SDA_2026-10-26.md`, `SPELL_DISCOVERY_ECOSYSTEM_2026-10-26.md`, `ACTION_IDS_SDE_2026-10-26.md`, `SPELL_PROPOSALS_2026-10-26.md`, `ENEMY_FORMATIONS_2026-10-26.md`, `ENEMY_ELITE_EVOLUTION_2026-10-26.md`, `ENEMY_AI_EVOLUTION_2026-10-26.md`)
- Overwriting sibling `*2026-10-27*` files opened this hour

---

## 7. ACTION_ID index (this run)

All items: `STATUS: NEW`. Full records: [`ACTION_IDS_SDA_2026-10-27.md`](./ACTION_IDS_SDA_2026-10-27.md).

| ID | Title | Priority |
| :--- | :--- | :--- |
| SDA-2026-10-27-205 | Honour #1143 Wave-18 SDE stamps; do not pre-own generationMin 18 ids | P1 |
| SDA-2026-10-27-206 | Honour #1139 Wave-19 boss / Rush Table Q still stands; no fourth kit source | P1 |
| SDA-2026-10-27-207 | Honour #1134 Wave-17 formations; consume CORE ids, do not grant | P1 |
| SDA-2026-10-27-208 | Persist later kit-execute/modifier metadata flags; union Inferno CD, Glass Realm, Iron Curse | P1 |
| SDA-2026-10-27-209 | Remount leftover-Doka portal skips continue after #1140; shrine settle is not a victory commit | P1 |
| SDA-2026-10-27-210 | Do not treat Nona Oath as occupy-9; grow closed knownSummonAI only with stamped occupy enums | P0 |
| SDA-2026-10-27-211 | Honour later map snaps / ENC / WDD / WDEAD; not grants | P1 |
| SDA-2026-10-27-212 | Keep later combat helpers in engine/*; Spellbook 44px is not a studio tab | P1 |
| SDA-2026-10-27-213 | Honour #1143 extra doors; first-grant only | P1 |
| SDA-2026-10-27-214 | Keep Wide Gift ≠ Gait Gift and Cadence Quad ≠ Cadence Tern | P0 |
| SDA-2026-10-27-215 | Honour Admin UX / EBA / AFDA / CRC; do not add empty studio tabs or a fourth kit source | P1 |
| SDA-2026-10-27-216 | Honour #1156 shrine settle and SDEG persist locks; not ownedSpellIds or lifecycle | P1 |
| SDA-2026-10-27-217 | Honour Enthroned Void kit-first leftovers; kit ids are not grants | P1 |
| SDA-2026-10-27-218 | Plague Zone soak and modifier lifesteal/heal packets are not a victory commit | P1 |
| SDA-2026-10-27-219 | Honour #958 / #999 / #1072 / #1135 AI increment; inspector lists modules by id | P1 |
