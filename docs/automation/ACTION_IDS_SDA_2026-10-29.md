# ACTION_IDs — 2026-10-29 Spell, Discovery & Achievement Admin Designer

Durable ledger for implementers and the Report Action Orchestrator.  
Source of every record: Spell, Discovery & Achievement Admin Designer.  
Design contract: [`SPELL_ADMIN_DESIGN_2026-10-29.md`](./SPELL_ADMIN_DESIGN_2026-10-29.md) (this delta) + [`SPELL_ADMIN_DESIGN_2026-08-31.md`](./SPELL_ADMIN_DESIGN_2026-08-31.md) (full studio).

**First-cuts live on unmerged [#473](https://github.com/Mr-Melic/stralt/pull/473):** `SDA-2026-09-23-001` … `028`. Treat those as the current 001–028. **Do not implement a second 10-29 copy.** 09-21 IDs live on [#353](https://github.com/Mr-Melic/stralt/pull/353); 09-22 IDs live on [#398](https://github.com/Mr-Melic/stralt/pull/398); 09-24 queue-union IDs `029` … `040` live on [#515](https://github.com/Mr-Melic/stralt/pull/515); 09-25 queue-union IDs `041` … `055` live on [#570](https://github.com/Mr-Melic/stralt/pull/570); 09-26 queue-union IDs `056` … `069` live on [#630](https://github.com/Mr-Melic/stralt/pull/630); 09-27 queue-union IDs `070` … `083` live on [#677](https://github.com/Mr-Melic/stralt/pull/677); 09-28 queue-union IDs `084` … `098` live on [#729](https://github.com/Mr-Melic/stralt/pull/729); 09-29 queue-union IDs `099` … `115` live on [#791](https://github.com/Mr-Melic/stralt/pull/791); 10-21 queue-union IDs `116` … `129` live on [#815](https://github.com/Mr-Melic/stralt/pull/815); 10-22 queue-union IDs `130` … `144` live on [#892](https://github.com/Mr-Melic/stralt/pull/892); 10-23 queue-union IDs `145` … `159` live on [#940](https://github.com/Mr-Melic/stralt/pull/940); 10-24 queue-union IDs `160` … `174` live on [#1007](https://github.com/Mr-Melic/stralt/pull/1007); 10-25 queue-union IDs `175` … `189` live on [#1078](https://github.com/Mr-Melic/stralt/pull/1078); 10-26 queue-union IDs `190` … `204` live on [#1140](https://github.com/Mr-Melic/stralt/pull/1140); 10-27 queue-union IDs `205` … `219` live on [#1187](https://github.com/Mr-Melic/stralt/pull/1187); 10-28 queue-union IDs `220` … `234` live on [#1226](https://github.com/Mr-Melic/stralt/pull/1226). Prior IDs `SDA-2026-08-31-001` … `013`, `SDA-2026-09-01-001` … `014`, and `SDA-2026-09-02-001` … `015` remain OPEN, PARTIAL, or LANDED as tabulated in the 09-23 / 09-29 / 10-21 / 10-22 / 10-23 / 10-24 / 10-25 / 10-26 / 10-27 / 10-28 / 10-29 designs — do not close them from this file except 09-01-002 (bindgen) and the empty-AI half of 09-02-006, which **landed**.

This run only adds **235–249** (queue after #1226). Do not implement gameplay from this file unless a later human or orchestrator explicitly picks an ID. This run ships **docs only**.

HEAD: `0f5363f` (unchanged since 09-21). Open PRs targeting `main`: **945** at this patch (later 10-28 flock continued through **#1276**). Newest sibling before this work: **#1276** (remount inventory keep after shop `saveBattleStats` throw-after-accept). Calendar: 2026-10-29. Same-hour flock uses unique dated filenames — do not overwrite #1226 SDA, #1255 Wave-20 SDE, #1251 Wave-20 tactical, #1244 / #1170 / #1139 / #1080 boss bible, #1253 / #1171 / #1126 SDEG, #1101 CRC, #1106 quality audit `*2026-10-25*` / `*2026-10-26*` / `*2026-10-27*` / `*2026-10-28*` files, or `*2026-10-29*` siblings. #870 / #946 / #998 / #1074 / #1124 / #1186 / **#1254** `MASTER_ROADMAP.md` are pre-existing oldest-first conflicts (skipped).

Older still-open PRs (union, do not overwrite): **#327** then **#331**, then #333+. Keep one `export function` per name.

---

ACTION_ID: SDA-2026-10-29-235  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Honour #1255 Wave-20 SDE stamps; do not pre-own generationMin 20 ids  
CATEGORY: catalog-sync  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Open [#1255](https://github.com/Mr-Melic/stralt/pull/1255) is Wave-20 discovery (`SPELL_DISCOVERY_ECOSYSTEM_2026-10-28.md`, `generationMin: 20`). Unique §11 ids (`spell-giraffe-stride`, `spell-undeca-oath`, `spell-trip-reel`, `spell-giraffe-bite`, `spell-skew-mark`, `spell-deep-plate`, `spell-trip-skip`, `spell-pair-gait`, `spell-summon-giraffe`, `spell-deep-gift`, `spell-cadence-sext`, `spell-trip-toll`, `spell-brick-split`, `spell-watch-clip`, `spell-pair-plate`, `spell-trip-cut`, `spell-giraffe-gate`, `spell-pack-giraffe`, `spell-giraffe-fold`) stay this catalog’s. `spell-pack-giraffe` is `ENEMY_ONLY`. `spell-giraffe-fold` is `BOSS_ONLY`. Deep Gift is leftover AP **=== 1 AND** leftover MP **≥ 2** heal (one body). Cadence Sext is remaining `n>6` → 6. Deep Plate is leftover **1/≥2** negate. Skew Mark is leftover **AP − MP === 2** turn-end detonate. Pair Gait / Pair Plate are leftover **2/0**. Giraffe Stride is a permutation of **(4,1)**. Undeca Oath is Chebyshev **exactly 11** spell gate, not occupy 11. Giraffe Gate is next-spell dest **(4,1)**. `mpCost: 0` on every unique row. Wave-20 family CORE is #1143 unique + #1177 (via #1248). Unique §11 stay extras until Wave 22. Unique Wave-19 §11 (#1198) stay extras until Wave 21. Live hydrate still grants every `starterSpells` row with `isBaseSpell: true` (`WorldExploration.tsx` 2395–2408). Copying Wave-20 unique ids into that array, or hydrating Pack Giraffe because `usableByPlayer !== false` (`adminSafety.ts` 712–718), makes discovery worse. 10-28-220 already said the same for Wave-19 `#1198`. Still-open #982 freezes **shipping** Wave-15/16/17/18/19/20 live rows until 09-23-003. Target-only leftover **sum === 8** heal (`spell-octave-gift`) remains an open Wave-21 unique hole — this studio does not mint it.  
SYSTEMS_AFFECTED: create-character seed; `ownedSpellIds` migration; Wave-20 catalog; family pools; leftover feat doors  
RECOMMENDED_ACTION: Same rule as 09-23-018 / 026, 09-29-099, 10-21-116, 10-22-130, 10-23-145, 10-24-160, 10-25-175, 10-26-190, 10-27-205, and 10-28-220. Honour #1255 stamps (`ENEMY_DISCOVERY` default, named `MULTI_SOURCE` / `ELITE` / `ENEMY_ONLY` / `BOSS_ONLY` children). SDE unique §11 wins if a later tactical file clones the hole — do **not** also ship a second Deep Gift or Cadence Sext (see 244). Do not restamp Wave-1…19 doors or #890 / #906 / #953 / #962 / #1011 / #1017 / #1063 / #1082 / #1132 / #1143 / #1177 / #1198 extra doors. Do not implement Wave-20 or Wave-21 cards in this studio PR. Innate seed remains the four ids in 09-23-003. Validator rejects `PLAYER_LEARNABLE=true` on Pack Giraffe / Giraffe Fold / Pack Camel / Camel Fold / Court Quinte / Court Quarte / Court Tierce. Do not CORE Giraffe Gate with Giraffe Bite.  
AUTONOMY: HUMAN_APPROVE — with 09-23-003 / 009.  
DEPENDENCIES: SDA-2026-09-23-003; SDA-2026-09-23-009; SDA-2026-09-23-026; SDA-2026-10-28-220; SDA-2026-10-29-244; PR #1255; PR #1198; PR #1251  
REGRESSION_RISK: HIGH if migrate-from-`starterSpells` includes Wave-20 ids. HIGH if `ENEMY_ONLY` Pack Giraffe is hydrated because `usableByPlayer !== false`. HIGH if `giraffe_fold_regent` also grants Giraffe Stride. HIGH if a Deep Gift / Cadence Sext clone ships beside the #1255 ids.  
VALIDATION_REQUIRED: After a Wave-20 unique id exists in the catalog, a new character does not own it until the stamped route completes (`ENEMY_ONLY` / `BOSS_ONLY` never). Duplicate door stamps do not grant twice. A second Deep Gift / Cadence Sext id is absent from the live catalog.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-10-29-236  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Honour #1244 Wave-21 boss / Rush Table S; no fourth kit source  
CATEGORY: boss-kits  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Open [#1244](https://github.com/Mr-Melic/stralt/pull/1244) is Wave-21 + Rush **Table S**: `sip_visitor` / `halve_registrar` / `odd_penitentiary` / `sill_suffragan`; `CHOIR_SIP` / `CHOIR_HALVE` / `NAVE_ODD` / `NAVE_SILL` stay `BOSS_ONLY`. Leftover #695 Gait Sip / Cast Sill + leftover #726 Cadence Halve + leftover #787 Odd Hood. 10-28-221 anticipated this bible; it is now confirmed. [#1170](https://github.com/Mr-Melic/stralt/pull/1170) Wave-20 / Table R, [#1139](https://github.com/Mr-Melic/stralt/pull/1139) Wave-19 / Table Q, and [#1080](https://github.com/Mr-Melic/stralt/pull/1080) Wave-18 / Table P already covered by 10-27-206 / 10-28-221. Later 10-28 combat sidecars (#1220…#1276) are execute leftovers, not a fourth kit table. Live combat kits are still `data/bossKits.ts`; Motoko `defaultBossConfigs()` still lists purged `fireball` / `cursed_gust` / `entangle` (`admin.mo` 358+); Admin chips `getSpellConfigs()`. Three sources. Canister `completeBossRushRoom` still must not see `roomIndex > 9`. If a same-hour Wave-22 / Table T bible opens, unique dated restack on `BOSS_AND_SPELL_DISCOVERY.md` — **union**, do not invent an 11th canister room. Do not remap `gait_cantor` / `halve_precentor` / `trim_precentor`.  
SYSTEMS_AFFECTED: `bossKits.ts`; Motoko `defaultBossConfigs`; Admin Bosses tab; Rush extra tables; future `ownedSpellIds`  
RECOMMENDED_ACTION: Honour #1080 / #1139 / #1170 / #1244 stamps. Closed signatures never enter `ownedSpellIds`. Do not add a fourth kit source (09-23-011 / 10-27-206 / 10-28-221 / 10-28-230). Do not restamp Wave-1…21 feat doors. Table P/Q/R/S/T are owner overlays, never an 11th canister room. Quad Span / Hendeca Span / Dodeca Span / Trideca Span / Tetradeca Span / Pentadeca Span stay off until occupy-weight exists.  
AUTONOMY: HUMAN_APPROVE — with 09-23-011.  
DEPENDENCIES: SDA-2026-09-23-011; SDA-2026-10-28-221; SDA-2026-10-29-245; PR #1244  
REGRESSION_RISK: HIGH if CHOIR_SIP hydrates as a catalog grant. MEDIUM if Table T is written as `roomIndex > 9`. MEDIUM if a fourth kit table is added for Final Pawn / Fetid Rook leftovers.  
VALIDATION_REQUIRED: After these bosses exist, a new character does not own CHOIR_SLIDE / CHOIR_BOTH / NAVE_HEAVE / CHOIR_PARCHED / NAVE_STRIDE / NAVE_DUAL / CHOIR_IMPRINT / CHOIR_DAMP / CHOIR_TRIM / NAVE_READY / CHOIR_LEAN / NAVE_NEAR / CHOIR_SIP / CHOIR_HALVE / NAVE_ODD / NAVE_SILL. `completeBossRushRoom` still rejects `roomIndex > 9`. Admin chips still do not invent a fourth kit table.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-10-29-237  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Honour #1237 Wave-19 formations; consume CORE ids, do not grant  
CATEGORY: enemy-pools  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Open [#1237](https://github.com/Mr-Melic/stralt/pull/1237) is Wave-19 synergy formations (drop 20) in unique `docs/design/ENEMY_FORMATIONS_2026-10-28.md` packing #1189 families (Sestet choir, Tern/Octa, Mire Diag, Spawn Prime, Slide Cap, Watch Thin, Gait Tern, Psalm Sestet, Tierce Verse, Odd Brick, Purse Sestet, Sestet Hold). Dual Keep cannot fake leftover-sum 5 or 6. Prior [#1176](https://github.com/Mr-Melic/stralt/pull/1176) Wave-18 drop 19 already covered by 10-28-222. No new formation PR after #1237. If a same-hour Wave-20 drop 21 opens, unique `ENEMY_FORMATIONS_2026-10-29.md`. Live `EnemyFamily` remains the original seven. Trideca Plug / Tetradeca Plug / Pentadeca Plug skip while live cap is 2 (`gameConstants.ts` 300). Live `ENEMY_KITS` is still `Record<ChessPieceType, …>` (`enemyAI.ts` 163–185). Zone NaN still hides paper ADVANCED (WX 11920). Never PAIR Tern+Tierce. Wave-20 families (Septet Mend / Cadence Quarte / Tetradeca Span / Feud Turn, PR #1177 / #1143) stay deferred from this drop.  
SYSTEMS_AFFECTED: future formation overlay; Wave-19/20 family CORE; `ownedSpellIds`; summon cap  
RECOMMENDED_ACTION: Consume CORE ids; clearing a formation is not a grant. Do not copy FSN-* sheets into `starterSpells`. Do not CORE unique Wave-20 §11 (#1255) or Wave-21 family CORE (#1198 / #1251). Honour leftover-AP **and** leftover-MP gates as metadata, never names. Pass a numeric zone before ADVANCED rows can resolve (09-23-010). Do not overwrite `ENEMY_FORMATIONS_2026-10-28.md`.  
AUTONOMY: HUMAN_APPROVE — with 09-23-010.  
DEPENDENCIES: SDA-2026-09-23-010; SDA-2026-10-28-222; PR #1237; PR #1176  
REGRESSION_RISK: HIGH if a formation clear appends Sestet Mend / Septet Mend / Deep Gift to `ownedSpellIds`. MEDIUM if Trideca Plug / Tetradeca Plug / Pentadeca Plug ships while summon cap is 2.  
VALIDATION_REQUIRED: After FSN-* ids exist as design stamps, a new character owns none of them. Clearing Sestet Gate does not grant Sestet Mend. Pack Giraffe / Giraffe Fold / Court Quinte stay never-owned.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-10-29-238  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Persist later kit-execute/modifier/summon-control dest metadata flags  
CATEGORY: no-heuristics  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Open sidecars after #1217: [#1252](https://github.com/Mr-Melic/stralt/pull/1252) Glass Realm pack fallback melee ×2 (`glassRealmEnemyMeleeTaken.ts`), [#1257](https://github.com/Mr-Melic/stralt/pull/1257) pack SR soak, [#1262](https://github.com/Mr-Melic/stralt/pull/1262) boss kit SR soak, [#1266](https://github.com/Mr-Melic/stralt/pull/1266) player Mirror vs boss kit single-target (`bossKitPlayerMirrorReflect.ts`), [#1272](https://github.com/Mr-Melic/stralt/pull/1272) Paper Windstorm miss on boss-kit ranged, [#1238](https://github.com/Mr-Melic/stralt/pull/1238) / [#1260](https://github.com/Mr-Melic/stralt/pull/1260) / [#1263](https://github.com/Mr-Melic/stralt/pull/1263) / [#1270](https://github.com/Mr-Melic/stralt/pull/1270) / [#1274](https://github.com/Mr-Melic/stralt/pull/1274) / [#1267](https://github.com/Mr-Melic/stralt/pull/1267) summon-control dest share (Attack Nearest / sprite click / self-ally / Digit-Numpad / Escape cancel / skip champion bar). Unique files vs 10-28 #1160 / #1199 / #1200 / #1202 / #1205–#1214. Tests assert metadata / kit ids / modifier multipliers / dest tokens, not display names. Concatenating two `pickWx…` copies fails esbuild.  
SYSTEMS_AFFECTED: `engine/*` kit-execute helpers; future SpellDefinition mechanic flags; observe hook  
RECOMMENDED_ACTION: Persist those flags with 09-23-005 (`targetType`, `healAmount`, `chc`, cooldown, modifier multipliers, dest tokens). Union sidecars; **one** `export function` per name. Hostile kit execute may observe (10-22-138); player execute / player Mirror consume must not. Glass Realm / pack SR / boss SR / Paper Windstorm / summon-control dest share are execute leftovers, not catalog ids and never enter `ownedSpellIds`. Do not add `if (spell.name === "Mirror")` / `"Glass"` branches. Do not grow WX; restack call sites onto the helpers after older combat PRs land.  
AUTONOMY: IMPLEMENT_AFTER_HUMAN — once 09-23-005 fields exist.  
DEPENDENCIES: SDA-2026-09-23-005; SDA-2026-10-28-223; SDA-2026-10-29-242  
REGRESSION_RISK: MEDIUM if two copies of `executeGlassRealmEnemyMeleeTaken` / `executeBossKitPlayerMirrorReflect` land on restack. MEDIUM if player Mirror consume is treated as observation.  
VALIDATION_REQUIRED: After 09-23-005, activate of a kit that lists these ids still keys flags / kit ids, never `spell.name`. Hostile Cursed Wound observe fires once; player Mirror consume does not. Duplicate-export scan stays clean.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-10-29-239  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Remount leftover-Doka/spell-level continues; leftover bar/inventory keep is not a victory commit  
CATEGORY: discovery-pipeline  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Leftover-Doka remount portal skips (#1129 / #1145 / #1147 / #1149 / #1151 / #1153 / #1157) and leftover spell-level remount skip (#1215 / [#1239](https://github.com/Mr-Melic/stralt/pull/1239)) remain unmerged. New: [#1268](https://github.com/Mr-Melic/stralt/pull/1268) leftover **spell-bar** remount skip (`spellBarKeepRemountWriteSkip.ts`) honours optimistic bar order over stale Play-entry `getCharacter.spellBarOrder` after unmount clears the 1000ms debounce without flush. [#1276](https://github.com/Mr-Melic/stralt/pull/1276) leftover **inventory** remount skip (`inventoryKeepRemountWriteSkip.ts`) restores a shop item after Items Buy `saveBattleStats` throw-after-accept. Distinct from leftover-XP keep. Motoko `upgradeSpell` is `currentLevel + 1` and is **not** idempotent. `setSpellBarOrder` is off-lock (`main.mo` 1912+). Inventory keep is Items Buy, not a spell id. Live `setSpellBarOrder` still filters to `spellLevelKeys` (`main.mo` 1945–1947).  
SYSTEMS_AFFECTED: persist lock; remount hydrate; future `commitSpellDiscoveries`; `setSpellBarOrder`  
RECOMMENDED_ACTION: Same class as 10-27-209 / 10-28-224. Discovery must not piggy-back these skips. `upgradeSpell` is never the grant writer. Union helpers; one `export function` per name. Leftover bar honour is not `commitSpellDiscoveries` and not `ownedSpellIds`. Leftover inventory honour is not a spell grant. After 09-23-003, bar persist still follows 09-23-014 (owned ∪ level keys), not this remount stamp.  
AUTONOMY: HUMAN_APPROVE — touches remount hydrate.  
DEPENDENCIES: SDA-2026-09-23-009; SDA-2026-09-23-014; SDA-2026-10-28-224; PR #1268; PR #1276; PR #1239  
REGRESSION_RISK: HIGH if a remount skip is reused as a grant writer. MEDIUM if leftover bar keep writes unknown ids that 09-23-014 would drop. MEDIUM if leftover inventory keep is mistaken for a `CHALLENGE` spell reward.  
VALIDATION_REQUIRED: Rearrange bar then remount: order kept, no new `ownedSpellIds`. Shop throw-after-accept remount restores the potion, not a spell id. `upgradeSpell` retry skip still does not grant. Flee after observe still does not unlock.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-10-29-240  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Do not treat Undeca Oath as occupy-11; grow closed knownSummonAI with pentadecaspan  
CATEGORY: spell-contract  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: #1255 Undeca Oath is Chebyshev **exactly 11** spell gate (`next_spell_exact_chebyshev_11`), not occupy 11. Live `ENEMY_SUMMON_CAP = 2` (`gameConstants.ts` 300). Closed `knownSummonAI` / `knownPieceType` (`adminGuard.mo` 363–373) still omit `font` / `dummypost` / `pentaspan` / `septspan` and queued `octspan` / `gauntpost` / `sixspan` / `ninespan` / `poisepost` / `decspan` / `tallypost` / `hendecaspan` / `scorepost` / `dodecaspan` / `tridecaspan` / `tetradecaspan` / **`pentadecaspan`**. #1251 Pentadeca Span is stretched plus occupy-weight **15** (longArm 4 / shortArm 3), blocked at cap 2. Hendeca Span occupy-11 lives on `span_hendeca` (#1011), not Undeca Oath. Deca Oath is Chebyshev-10 (#1198). Nona Oath is Chebyshev-9 (#1143). Do not mint `spell-undeca-span` / `spell-hendeca-oath` / `spell-fifteen-span` / `spell-pentakaideca-span`. Runtime still does `spell.summonAI || "hunter"` (`summonSpawn.ts` 139).  
SYSTEMS_AFFECTED: `adminGuard.mo` `knownSummonAI` / `knownPieceType`; `adminSafety.ts` `SUMMON_AIS` / `PIECE_TYPES`; activate gate; Wave-20/21 occupy ids  
RECOMMENDED_ACTION: Keep Undeca Oath as a spell-gate metadata flag (09-23-005), never an occupy enum. Grow the **closed** summon-AI / piece-type lists only when 09-23-002 ships, and include every queued occupy enum through `pentadecaspan`. Activate of occupy-weight 8…15 stays blocked while remaining cap is 2. Missing Wave-20 `aiHint` → drop that id, log once (249). Do not treat Deca Oath as `decspan` (10-28-225) and do not treat Undeca Oath as `hendecaspan`.  
AUTONOMY: HUMAN_APPROVE — closed enum growth.  
DEPENDENCIES: SDA-2026-09-23-002; SDA-2026-09-23-005; SDA-2026-10-28-225; PR #1255; PR #1251  
REGRESSION_RISK: HIGH if Undeca Oath is implemented as occupy 11 and blows the live cap. HIGH if empty `summonAI` still falls through to hunter after enum growth. MEDIUM if `pentadecaspan` is added to the live validator before 09-23-002.  
VALIDATION_REQUIRED: Activate of Undeca Oath does not spawn 11 units. Activate of Pentadeca Span is rejected while cap is 2. `summonAI=""` still fails both validators. Deca Oath remains Chebyshev-10.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-10-29-241  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Honour later map snaps / ENC / WDD / WDEAD; not grants  
CATEGORY: catalog-sync  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Map snaps [#1229](https://github.com/Mr-Melic/stralt/pull/1229) Raise Slab, [#1258](https://github.com/Mr-Melic/stralt/pull/1258) Ratchet Cog, [#1265](https://github.com/Mr-Melic/stralt/pull/1265) Turnstile Ember, [#1275](https://github.com/Mr-Melic/stralt/pull/1275) Twin Sparks are leftover-crumb layout. ENC [#1249](https://github.com/Mr-Melic/stralt/pull/1249) Stave/Ring/Rime/Match teaches **#1138** / **#1017** verbs (Stave Mend, Ring Stride), not unique §11 giraffe. WDD [#1235](https://github.com/Mr-Melic/stralt/pull/1235) Wave-20 `WF-*-POISE_*` (remaining MP equals max MP). `WF-SPL-POISE_TUTOR` never writes `ownedSpellIds`. WDEAD [#1236](https://github.com/Mr-Melic/stralt/pull/1236) occupancy/remount rails ingested Wave-19 / Table R and did **not** invent Wave-20 WDD / FSN drop 20 / elite 20 / Table S — those later opened as #1235 / #1237 / #1248 / #1244. Remaining-MP-equals-max is **not** Skew Mark (leftover AP − MP === 2 detonate) and **not** Idle Mark (leftover MP equals max detonate).  
SYSTEMS_AFFECTED: encounter overlay; world-feature overlay; future `SPECIAL_ENCOUNTER` routes  
RECOMMENDED_ACTION: Occupancy unseals / crumb snaps are not grants unless a named door is stamped (`giraffe_gallery` / `undeca_nave` / `trip_aisle` / `skew_pulpit` / `trip_nave` stay #1255’s). `ENC-STAVE-*` is not Deep Gift. `ENC-RING-*` is not Giraffe Stride. `ENC-RIME-*` is not Trip Reel. `ENC-MATCH-*` is not Pair Gait. Do not overwrite #1249 / #1235 / #1236 `*2026-10-28*` files.  
AUTONOMY: HUMAN_APPROVE — with 09-23-009.  
DEPENDENCIES: SDA-2026-09-23-009; SDA-2026-10-28-226; SDA-2026-10-29-243; PR #1249; PR #1235; PR #1236  
REGRESSION_RISK: HIGH if a Poise Tutor or Stave encounter writes `ownedSpellIds`. MEDIUM if Skew Mark is aliased onto remaining-MP-equals-max.  
VALIDATION_REQUIRED: After these overlays exist, walking a Poise Tutor / Stave room / Raise Slab snap does not grant a Wave-20 unique id. Named #1255 doors still first-grant only.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-10-29-242  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Keep later combat helpers in engine/*; floor-AO extract is not a studio tab  
CATEGORY: owner-ui  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: WX is still 19 213 lines; AdminDashboard is still 8 280. [#1241](https://github.com/Mr-Melic/stralt/pull/1241) extracts floor AO gradient paint from WorldExploration — **not** AdminDashboard, not a sixteenth admin tab. Prior extracts #1076 / #1109 / #1196 already covered by 10-26-197 / 10-27-212 / 10-28-227. Live tabs (`AdminDashboard.tsx` 5611–5626) are still the original 15. `useSpellQueries.ts` is 293 lines and already calls `validateSpellConfig`.  
SYSTEMS_AFFECTED: `engine/*` extracts; AdminDashboard tabs; SpellEditor extract landing  
RECOMMENDED_ACTION: Discovery helpers stay in `engine/*` / `utils/*`. Do not grow WX or AdminDashboard. Do not treat a paint extract as a sixteenth admin tab. Extract `SpellEditor` onto `useSpellQueries.ts` only after 09-23-013 activate exists. Restack AdminDashboard siblings as **one** extract. Union sidecars; one `export function` per name.  
AUTONOMY: IMPLEMENT_AFTER_HUMAN — UI after persist 001/002/005/009.  
DEPENDENCIES: SDA-2026-09-23-015; SDA-2026-10-28-227; SDA-2026-10-29-238  
REGRESSION_RISK: MEDIUM if a second visual system or a player-facing studio leaks. HIGH if WX grows for editor wiring.  
VALIDATION_REQUIRED: Dev-only `#admin`. Player `#play` cannot open the studio. Floor-AO extract does not add an Admin tab. Duplicate-export scan stays clean.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-10-29-243  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Honour #1255 extra doors; first-grant only  
CATEGORY: discovery-pipeline  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: #1255 extra rooms `giraffe_gallery` / `undeca_nave` / `trip_aisle` / `skew_pulpit` / `trip_nave` teach via observe+win (not extra grants). `spell-pack-giraffe` on `giraffe_precentor` is `ENEMY_ONLY`. `spell-giraffe-fold` on `giraffe_fold_regent` is `BOSS_ONLY`. #1251 extra doors `octave_cantor` / `quinte_precentor` / `span_pentadeca` / `court_quinte_regent` wait for Wave 22. Court Quinte never owned. #1244 `CHOIR_SIP` / `CHOIR_HALVE` / `NAVE_ODD` / `NAVE_SILL` stay `BOSS_ONLY`. Pack Camel / Camel Fold / Court Quarte / Court Tierce already never-owned (10-28-228). Live hydrate still unions the whole `starterSpells` array (`WorldExploration.tsx` 2395–2440).  
SYSTEMS_AFFECTED: `SPECIAL_ENCOUNTER` routes; `ownedSpellIds`; extra-door overlay  
RECOMMENDED_ACTION: Extra doors first-grant only. Pack Giraffe / Giraffe Fold / CHOIR_SIP / CHOIR_HALVE / NAVE_ODD / NAVE_SILL / Court Quinte / Court Quarte / Court Tierce / Pack Camel / Camel Fold never enter `ownedSpellIds`. Do not restamp `camel_gallery` / `deca_nave` / `septet_cantor` / `octave_cantor` as giraffe doors. Validator rejects `PLAYER_LEARNABLE=true` on those closed ids.  
AUTONOMY: HUMAN_APPROVE — with 09-23-009.  
DEPENDENCIES: SDA-2026-09-23-009; SDA-2026-10-28-228; SDA-2026-10-29-235; PR #1255; PR #1251; PR #1244  
REGRESSION_RISK: HIGH if `giraffe_gallery` grants Pack Giraffe. HIGH if Court Quinte hydrates because `usableByPlayer !== false`.  
VALIDATION_REQUIRED: After these doors exist, a new character owns none of the closed ids. Repeat visit to `giraffe_gallery` does not grant twice. `giraffe_fold_regent` never grants Giraffe Stride.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-10-29-244  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Keep Deep Gift ≠ Octave Mend and Cadence Sext ≠ Cadence Quinte  
CATEGORY: catalog-sync  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: #1255 Deep Gift is leftover AP **=== 1 AND** leftover MP **≥ 2** heal (one body). #1251 Octave Mend is both-body leftover **sum === 8 AND unequal** (legal pairs (8,0) (0,8) (7,1) (1,7) (6,2) (2,6) (5,3) (3,5); (4,4) stays Poise). #1255 Cadence Sext is remaining `n>6` → **6**. #1251 Cadence Quinte is remaining `n===5` → **0**. #1198 Thin Gift is leftover **1/0**; Cadence Quint is `n>5` → 5. #1177 Septet Mend is both-body leftover **sum === 7**; Cadence Quarte is `n===4` → 0. #1143 Wide Gift is leftover **AP ≥ 2 AND MP ≥ 1**; Cadence Quad is `n>4` → 4. Undeca Oath is Chebyshev-11 spell gate, not #1251 Pentadeca Span occupy-15. Giraffe Stride is **(4,1)**, not Kin Turn. Target-only leftover **sum === 8** heal (`spell-octave-gift`) remains an open Wave-21 unique hole — do not mint it here. SDE leftover-collision table in #1255 §0.2 already declared **SDE wins**.  
SYSTEMS_AFFECTED: Wave-20/21 catalogs; leftover metadata flags; activate gate  
RECOMMENDED_ACTION: Keep one id per leftover window. Honour #1255 unique §11 as extras until Wave 22. Honour #1251 as Wave **21** family CORE. Do not alias Deep Gift onto Octave Mend / Septet Mend / Thin Gift / Wide Gift. Do not alias Cadence Sext onto Cadence Quinte / Cadence Quint / Cadence Quarte / Cadence Quad. Do not mint `spell-octave-gift` / `spell-eight-gift` / `spell-cadence-six` / `spell-cadence-hexa` / `spell-cadence-cinque` / `spell-duet-turn`. Metadata flags, never `spell.name`.  
AUTONOMY: HUMAN_APPROVE — catalog identity.  
DEPENDENCIES: SDA-2026-10-28-229; SDA-2026-10-29-235; PR #1255; PR #1251; PR #1198; PR #1177  
REGRESSION_RISK: HIGH if a later Wave-21 tactical clones Deep Gift or Cadence Sext. HIGH if Octave Mend is implemented as leftover 1/≥2.  
VALIDATION_REQUIRED: Catalog contains at most one id for leftover 1/≥2 heal, one for both-body sum===8 unequal, one for `n>6→6`, one for `n===5→0`. A leftover (1,6) body heals on Deep Gift and does not fire Octave Mend. A leftover (5,3) both-body pair fires Octave Mend and does not fire Deep Gift.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-10-29-245  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Honour Admin UX / EBA / AFDA / CRC; do not add empty studio tabs or a fourth kit source  
CATEGORY: owner-ui  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: [#1223](https://github.com/Mr-Melic/stralt/pull/1223) owner status-copy / consent-gate / **spell-delete copy** / ad-hydrate helpers do **not** restack `AdminDashboard.tsx` and are **not** spell rollback or `lifecycle`. Live delete confirm still says the spell is **removed immediately** (`AdminDashboard.tsx` 3793–3794); toast is always `"Spell deleted"` (6166); canister may only flip `usableByPlayer` (`main.mo` 882–902). [#1218](https://github.com/Mr-Melic/stralt/pull/1218) EBA re-audit is docs only, **no new EBA IDs**. [#1230](https://github.com/Mr-Melic/stralt/pull/1230) AFDA-046 locks Admin `range` vs `maxRange` player/AI split — not `targetType` persist. CRC #1101 still **zero** ids `SAFE_TO_REMOVE`. Live tabs remain the original 15 (`AdminDashboard.tsx` 5611–5626). Three boss kit sources remain (`bossKits.ts` / Motoko purged ids / Admin chips).  
SYSTEMS_AFFECTED: AdminDashboard; confirm/toast; AFDA range split; EBA kit sources  
RECOMMENDED_ACTION: Union #1223 `spellDeleteCopy` with 09-23-004 / 09-23-012 so Retire vs Delete toasts match the canister. Do not treat that helper as `lifecycle`. Do not ship empty Discovery / Kits / Graph / Versions tabs until 09-23-013 activate exists. Do not add a fourth kit table. Dual range fields stay honest (player `maxRange`, AI `range`) and still require `targetType` on activate (09-23-005). CRC-001 is not a deletion.  
AUTONOMY: IMPLEMENT_AFTER_HUMAN — UI after persist 001/004.  
DEPENDENCIES: SDA-2026-09-23-001; SDA-2026-09-23-004; SDA-2026-09-23-012; SDA-2026-10-28-230; PR #1223; PR #1218; PR #1230  
REGRESSION_RISK: MEDIUM if spell-delete copy is treated as 09-23-001 landed. MEDIUM if AFDA-046 is treated as `targetType` persist. HIGH if a fourth kit table is added.  
VALIDATION_REQUIRED: Retire toast ≠ delete toast once wired. Admin still has 15 tabs. Player vs AI range split tests still pass. EBA 10-28 files are not restamped.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-10-29-246  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Honour #1253 SDEG persist locks; challenge catalog is not ownedSpellIds or lifecycle  
CATEGORY: ownership-persist  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Open [#1253](https://github.com/Mr-Melic/stralt/pull/1253) SDEG 10-28: `uiLayoutVersionWipe` (HUD cache wipe can clobber a newer layout), `challengeCatalogPersist` (battle-challenge ids live only in `DEFAULT_CHALLENGES`; **no** ownership, discovery, or alias table), `sessionStateShrineCap` (Motoko `shrineCount > 100` silent max vs unbounded local). Explicitly **no** `ownedSpellIds`. #1171 Spell Master empty-bar padding already covered by 10-28-231. #1268 leftover bar keep and #1276 leftover inventory keep are remount locks, not observation. Challenges still `{ doka, xp, badge }`. `AchievementConfig` is still Doka-only (`types/admin.mo` 249–256). New observation maps still need a later EOP file after `20260901` (`check-limit = 5`).  
SYSTEMS_AFFECTED: challenge persist helpers; future `CHALLENGE` `rewards.spellIds`; EOP chain; `ownedSpellIds`  
RECOMMENDED_ACTION: Dual bar / catalog-delete / loot_10 / explorer counter / shrine settle / Spell Master occupancy / leftover spell-level keep / leftover bar keep / leftover inventory keep / challenge catalog / uiLayout wipe is not `ownedSpellIds` and not `lifecycle`. New observation maps still go through 09-23-016. After 003, hydrate must **not** pad empty bar slots with newly granted ids. Challenge `CHALLENGE` acquisition still needs `rewards.spellIds` (09-23-012); #1253 does not add them. Do not add required `Character.challengeIds` until a later chain file after `20260901`.  
AUTONOMY: HUMAN_APPROVE — persist shape.  
DEPENDENCIES: SDA-2026-09-23-003; SDA-2026-09-23-012; SDA-2026-09-23-016; SDA-2026-10-28-231; PR #1253  
REGRESSION_RISK: HIGH if challenge catalog persist is reused as a grant writer. HIGH if a required `challengeIds` field is added on a chain file at or before `20260901`. MEDIUM if uiLayout wipe is treated as a spell-bar grant.  
VALIDATION_REQUIRED: After 003, a discovery grant does not pad empty bar slots. Completing a challenge still grants neither a spell nor `ownedSpellIds` until 09-23-012. `python3 scripts/check-eop-stables.py` still passes without a new required field.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-10-29-247  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Honour kit-first leftovers; kit ids are not grants  
CATEGORY: no-heuristics  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: [#1247](https://github.com/Mr-Melic/stralt/pull/1247) Final Pawn kit-first Strike from shadowing Ghost Summon. [#1261](https://github.com/Mr-Melic/stralt/pull/1261) Fetid Rook kit-first Venom from shadowing Split. Unique vs Eternal Pawn #1204 / #1212, Enthroned Void #1152 / #1159 / #1164, and Pale Archivist #1089 / #1102 / #1105. Tests key kit **ids**, never `"Strike"` / `"Venom"` / `"Ghost Summon"` / `"Split"`. Ghost Summon / Split are **abilities**, not catalog ids. Live `ENEMY_KITS` is still piece-type + zone (`enemyAI.ts` 163–185).  
SYSTEMS_AFFECTED: kit-first execute helpers; future observe hook; `ownedSpellIds`  
RECOMMENDED_ACTION: Kit-first leftover is not a grant and not `lifecycle`. Hostile kit cast of Strike / Venom may observe once 09-23-009 exists; Ghost Summon / Split **abilities** are not catalog ids. Tests and inspector stay on kit **ids**, never display names. Do not add a fourth kit table.  
AUTONOMY: IMPLEMENT_AFTER_HUMAN — once 09-23-009 exists.  
DEPENDENCIES: SDA-2026-09-23-009; SDA-2026-10-28-232; PR #1247; PR #1261  
REGRESSION_RISK: MEDIUM if kit-first Strike is treated as a catalog grant. MEDIUM if tests start matching `"Strike"` by name.  
VALIDATION_REQUIRED: After these leftovers land, a new character does not own Strike from watching Final Pawn until 09-23-009 observe→win. Ghost Summon / Split never appear in `ownedSpellIds`.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-10-29-248  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Modifier execute leftovers and ability packets are not a victory commit  
CATEGORY: discovery-pipeline  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Later advertised packets: [#1252](https://github.com/Mr-Melic/stralt/pull/1252) Glass Realm pack melee ×2, [#1257](https://github.com/Mr-Melic/stralt/pull/1257) pack SR soak, [#1262](https://github.com/Mr-Melic/stralt/pull/1262) boss kit SR soak, [#1266](https://github.com/Mr-Melic/stralt/pull/1266) player Mirror vs boss kit, [#1272](https://github.com/Mr-Melic/stralt/pull/1272) Paper Windstorm miss, [#1259](https://github.com/Mr-Melic/stralt/pull/1259) Enthroned Void phantom contact atk 5, [#1234](https://github.com/Mr-Melic/stralt/pull/1234) Enthroned Void last-turn damage-spell AP, [#1220](https://github.com/Mr-Melic/stralt/pull/1220) / [#1264](https://github.com/Mr-Melic/stralt/pull/1264) Final Pawn ghost-summon 1 HP / atk 5, [#1231](https://github.com/Mr-Melic/stralt/pull/1231) / [#1271](https://github.com/Mr-Melic/stralt/pull/1271) Fetid Rook advertised half-HP split / split-rook atk 25, [#1273](https://github.com/Mr-Melic/stralt/pull/1273) Pale Archivist scroll-summon atk 8, [#1269](https://github.com/Mr-Melic/stralt/pull/1269) Broodmother kit Archer honouring `ENEMY_SUMMON_CAP`. Unique vs 10-28 #1182 Void Rift / #1216 Glyph Trap / #1217 Broodmother larva-explode. Recap is still XP / Doka / feats. Soaked Untouchable / SR soak / Mirror consume / miss / summon-cap occupancy is not `commitSpellDiscoveries`. Ghost-summon / scroll-summon / split-rook / larva-explode / Glyph Trap / phantom contact are **abilities**, not catalog ids.  
SYSTEMS_AFFECTED: observe hook; recap; modifier execute helpers  
RECOMMENDED_ACTION: Soaked Untouchable / rift tick / pack melee / SR soak / Mirror consume / Paper Windstorm miss / summon-cap occupancy is not `commitSpellDiscoveries`. Environmental ticks and ability packets are not spell observation. Hostile kit **cast** of a catalog id may observe (10-22-138); advertised HP/atk packets without a catalog id must not. Honouring the live summon cap is occupancy, not a grant.  
AUTONOMY: IMPLEMENT_AFTER_HUMAN — once 09-23-009 exists.  
DEPENDENCIES: SDA-2026-09-23-009; SDA-2026-10-28-233; SDA-2026-10-29-238  
REGRESSION_RISK: HIGH if a Glass Realm melee soak or SR soak is treated as observation. MEDIUM if ghost-summon / scroll-summon packets enter `ownedSpellIds`.  
VALIDATION_REQUIRED: After 09-23-009, a soaked pack Crush under Glass Realm does not observe. A hostile Cursed Wound kit cast does. Ghost-summon / scroll-summon / split-rook never appear in the recap `discoveredSpells` list. Broodmother Archer honouring cap 2 does not grant a spell.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-10-29-249  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Honour #1240 AI increment; inspector lists modules by id  
CATEGORY: dependency-safety  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Open [#1240](https://github.com/Mr-Melic/stralt/pull/1240) AEE 10-28 (`ENEMY_AI_EVOLUTION_2026-10-28.md`, SYS-120…125 / FUT-138…143). Inspector (08-31 §7) must list AI modules by **id**, never `inferSummonArchetype` name fallback (`enemyAI.ts` 203–224: `wolf` / `golem` / `wisp` / `archer` / `bomber` in `summon.name`). Wave-20 unique `aiHint` strings (`walk_giraffe_4_1`, `next_spell_exact_chebyshev_11`, `attract_toward_nearest_tripwire`, `pack_walk_giraffe_4_1`, `fold_two_player_side_share_giraffe_4_1`, `halve_leftover_mp_if_adjacent_barrier`, …) have no `decide*` branch yet (#1255 SDE-003). Prior #1192 SYS-114…119 already covered by 10-28-234. Live `ENEMY_KITS` is still piece-type + zone (`enemyAI.ts` 163–185).  
SYSTEMS_AFFECTED: dependency inspector; `enemyAI.ts`; future kit resolve  
RECOMMENDED_ACTION: Inspector lists modules by **id**. Missing Wave-20 hint → drop that id, log once. Do not emit `shadow_strike`. Do not add a fourth kit table. Empty `summonAI` is a validation error, not a name fallback (09-23-008). Prefer merge/follow #1192 / #1240 rather than competing writers.  
AUTONOMY: HUMAN_APPROVE — with 09-23-004 / 008.  
DEPENDENCIES: SDA-2026-09-23-004; SDA-2026-09-23-008; SDA-2026-10-28-234; PR #1240; PR #1255  
REGRESSION_RISK: HIGH if missing `walk_giraffe_4_1` resolves to Strike via name. MEDIUM if inspector displays `inferSummonArchetype` labels instead of ids.  
VALIDATION_REQUIRED: Kit resolve of an id whose `aiHint` has no `decide*` branch drops the id and logs once. Inspector rows are spell ids / module ids. Rename “Summon Giraffe” does not change `summonAI`.  
STATUS: NEW  
