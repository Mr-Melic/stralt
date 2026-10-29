# ACTION_IDs — 2026-10-29 Dynamic Spell Discovery & Enemy Spell Evolution

Durable ledger for implementers and the Report Action Orchestrator.  
Source of every record: Dynamic Spell Discovery and Enemy Spell Evolution Designer.  
Design contract: [`SPELL_DISCOVERY_ECOSYSTEM_2026-10-29.md`](./SPELL_DISCOVERY_ECOSYSTEM_2026-10-29.md).  
Wave-1 law (still blocking): [`SPELL_DISCOVERY_ECOSYSTEM_2026-08-31.md`](./SPELL_DISCOVERY_ECOSYSTEM_2026-08-31.md) and `SDE-2026-08-31-001`…`009`.  
Wave-2…20 generation stamps (still blocking): `SDE-2026-09-01-001`…`008` through `SDE-2026-10-28-001`…`008`.  
Do not implement gameplay from this file unless a later human or orchestrator explicitly picks an ID. This run ships **docs only**.

Sibling ledgers (do not re-open): tactical ids in PRs #120 / #185 / #282 / #342 / #411 / #463 / #525 / #563 / #636 / #695 / #726 / #787 / #849 / #890 / #953 / #1011 / **#1063** / **#1132** / **#1177** / **#1251** (Octave Mend … Court Quinte; extra doors `octave_cantor` / `quinte_precentor` / `span_pentadeca` / `court_quinte_regent`; **stamp as Wave 21 family CORE**) / **#1309** (Nonet Mend … Court Sixte; extra doors `nonet_cantor` / `sixte_precentor` / `span_hexadeca` / `court_sixte_regent`; **stamp as Wave 22 family CORE**; unique `SPELL_PROPOSALS_2026-10-29.md` — do not overwrite); family sheets through **#1305** (`octave_mender` … `fresh_plater`; unique `ENEMY_ELITE_EVOLUTION_2026-10-29.md`) and **#1248** (`septet_mender` … `idle_plater`); boss extras through **#1302** (`shove_hosteler` / `must_armarius` / `mid_crucifer` / `parched_oblate`; leftover **#695** Shove Sting / Must Step **and** leftover **#726** Mid Hood / leftover **#787** Parched Step; spectacular `NAVE_SHOVE` / `CHOIR_MUST` / `NAVE_MID` / `NAVE_OBLATE` stay `BOSS_ONLY`; Rush Table T; do not remap `shove_cantor` / `must_preceptor` / `parched_cantor` / `parched_preacher` / `gait_cantor` / `halve_precentor` / `trim_precentor`) and **#1244** (`sip_visitor` / `halve_registrar` / `odd_penitentiary` / `sill_suffragan`; leftover Gait Sip / Cadence Halve / Odd Hood / Cast Sill; spectacular `CHOIR_SIP` / `CHOIR_HALVE` / `NAVE_ODD` / `NAVE_SILL` stay `BOSS_ONLY`; Rush Table S); Wave-1…20 SDE ids including memory-reserved Wave 5 and still-open **#906** / **#962** / **#1017** / **#1082** / **#1143** / **#1198** / **#1255**; encounter rooms through **#1303** (Sestet/Tern/Mire/Stock; `ENC-TEACH-21` / `ENC-SPELL-41` / `ENC-SPELL-42` / `ENC-HAZ-41` / `ENC-HAZ-42` / `ENC-SESTET-01` / `ENC-TERN-01` / `ENC-MIRE-01` / `ENC-RUSH-79`…`82` — teach **#1189** / **#1082** verbs, not unique antelope; STOCK ≠ `ENC-POISE-01`) and **#1249** (Stave/Ring/Rime/Match; teach **#1138** / **#1017** verbs, not unique giraffe or antelope); world dynamics **#1285** (`WF-*-QUOTA_*`; remaining AP equals max MP; unique `ACTION_IDS_WDD_2026-10-29.md`; do **not** restack `WORLD_DYNAMICS.md` / `worldFeatures.ts`; `WF-SPL-QUOTA_TUTOR` never writes `ownedSpellIds`) and **#1235** (`WF-HAZ-POISE_SEAM` … `WF-ENV-POISE_DRAFT`; unique `ACTION_IDS_WDD_2026-10-28.md`; `WF-SPL-POISE_TUTOR` never writes `ownedSpellIds`); SDA **#1291** (235–249; unique `ACTION_IDS_SDA_2026-10-29.md` / `SPELL_ADMIN_DESIGN_2026-10-29.md` — do not overwrite) and **#1226** (220–234); CDA **#982** (CDA-030 freezes **shipping** Wave-15/16 live rows until Wave-1 gates; this ledger is sequential Generation 21 **design only**); CDA-031 had **not** opened (**#1069** is 2026-10-25); EBA **#1284** (unique files; zero extra doors); WDEAD **#1289**; roadmap **#1281** (unique `ACTION_IDS_2026-10-29.md`; do **not** restack `MASTER_ROADMAP.md`); FSN **#1294** drop 21; AEE **#1307**; PX **#1300**; TBC **#1277**; EBMA **#1279**; GTAD **#1282**; VAL **#1290**; MIMA **#1304**; GFCF **#1306**; content diversity **#1295**; persist helpers **#1299**; expansion **#1287**. Same-day long-horizon **#1312** (unique `ACTION_IDS_LHIPS_2026-10-29.md` / `LONG_HORIZON_2026-10-29.md`; sim only; never writes `ownedSpellIds`; do **not** restack `longHorizonSim.ts`). **SDE already won** `spell-cadence-floor` vs #890 and unique leftover collisions vs #1251 / #1309. Unique Wave-20 §11 stay extras until Wave 22 (then CORE with #1309). Unique §11 stay extras until Wave 23. Cadence Sept is remaining `n>7` → `7`; Cadence Sext is `n>6` → `6`; Cadence Quint is `n>5` → `5`; Cadence Quad is `n>4` → `4`; Cadence Tern is `n>3` → `3`; Cadence Cap is `n>2` → `2`; Cadence Floor is `n>1` → `1`; Cadence Rise is `1→2`; Cadence Prime is `0→1`; Cadence Snuff is `1→0`; Cadence Dock is `2→0`; Cadence Tierce is `3→0`; Cadence Quarte is `4→0`; Cadence Quinte is `5→0`; Cadence Sixte is `6→0`. Octet Gift is leftover **AP + MP === 8** heal (one body); Octave Mend is both-body leftover **sum === 8 AND unequal**; Nonet Mend is both-body leftover **sum === 9**. Trio Gait is leftover **3/0** damage; Pair Gait stays leftover **2/0**. Trio Plate is leftover **3/0** negate; Pair Plate stays leftover **2/0**; Dry Plate stays leftover MP=0 at **any** AP. Split Mark is turn-end leftover **AP − MP === 3**; Skew Mark stays leftover **AP − MP === 2**. Antelope Stride is **one** next walk permutation of **(4,3)**; Giraffe Stride stays **(4,1)**; Camel Stride stays **(3,2)**. Duodeca Oath is exact-12 **spell gate**, not Dodeca Span occupy-weight 12, not Hexadeca Span occupy-weight 16. Triad Turn is caster+ally+hostile invert, not Antelope Gate.

**#1251** remains Wave-20 tactical. **Stamp it as Wave 21 family CORE** together with unique **#1198** Wave-19 verbs and do not clone its ids into unique §11. **#1309** remains Wave-21 tactical. **Stamp it as Wave 22 family CORE** together with unique **#1255** Wave-20 verbs and do not clone its ids into unique §11. **#1255** remains Wave-20 SDE. Unique Wave-20 §11 stay extras until Wave 22. Unique §11 stay extras until Wave 23. **SDE wins** unique leftover collisions (Octet Gift stays leftover AP+MP===8 one-body, not Octave Mend both-body sum===8 unequal, not Nonet Mend both-body sum===9, and not Wide Gift’s ≥2/≥1 quadrant; Cadence Sept stays `n>7→7`, not Cadence Sext `n>6→6`, not Cadence Quinte `5→0`, and not Cadence Sixte `6→0`; Octet Plate stays leftover AP+MP===8 negate, not Octave Hood / Nonet Hood; Split Mark stays turn-end leftover AP−MP===3, not Skew Mark AP−MP===2; Trio Gait stays leftover 3/0 damage, not Pair Gait 2/0 and not Wide Sting AP≥2/MP≥1; Trio Plate stays leftover 3/0 negate, not Pair Plate 2/0 and not Dry Plate any-AP/MP=0; Duodeca Oath stays exact-12 spell gate, not Dodeca Span occupy-weight 12, not Pentadeca Span occupy-weight 15, and not Hexadeca Span occupy-weight 16; Antelope Gate stays next-spell dest (4,3), not Kin Turn, not Giraffe Gate (4,1), and not Triad Turn). Do not mint `spell-octave-gift` / `spell-eight-gift` / `spell-nonet-gift` / `spell-trio-gift` / `spell-three-gait` / `spell-zebra-stride` / `spell-alfil-stride` / `spell-antelope-line` / `spell-giraffe-line` / `spell-ibis-stride` / `spell-cadence-seven` / `spell-cadence-hepta` / `spell-cadence-six` / `spell-duodeca-span` / `spell-twelve-span` / `spell-sixteen-span` / `spell-dodeca-oath` / `spell-trio-turn` / `spell-fuse-skip` (Wave 19 owns that id). Stamp **#1063** `spell-dodeca-span`, **#1132** `spell-trideca-span`, **#1177** `spell-tetradeca-span`, **#1251** `spell-pentadeca-span` / `spell-octave-mend` / `spell-cadence-quinte` / `spell-kin-turn`, and **#1309** `spell-hexadeca-span` / `spell-nonet-mend` / `spell-cadence-sixte` / `spell-triad-turn`; do not clone.

**#1244** remains Wave-21 extra doors `sip_visitor` / `halve_registrar` / `odd_penitentiary` / `sill_suffragan` — do not restamp. **#1302** remains Wave-22 extra doors `shove_hosteler` / `must_armarius` / `mid_crucifer` / `parched_oblate` — do not restamp. **#1251** extra doors `octave_cantor` / `quinte_precentor` / `span_pentadeca` / `court_quinte_regent` wait for Wave 22 — do not restamp. **#1309** extra doors `nonet_cantor` / `sixte_precentor` / `span_hexadeca` / `court_sixte_regent` wait for Wave 23 — do not restamp. **#1305** family ids `octave_mender` … `fresh_plater` — do not restamp. **#1248** family ids `septet_mender` … `idle_plater` — do not restamp. **#1255** rooms `giraffe_gallery` / `undeca_nave` / `trip_aisle` / `skew_pulpit` / `trip_nave` / `giraffe_precentor` / `giraffe_fold_regent` — do not restamp. **#1198** rooms `camel_gallery` / `deca_nave` / `cipher_aisle` / `hollow_pulpit` / `fuse_nave` / `camel_precentor` / `camel_fold_regent` — do not restamp. No new `#137` ids. First grant wins Parched Mend vs Dry Gait leftover-MP=0 heal. Do not remap `gait_cantor` / `halve_precentor` / `trim_precentor` / `octave_cantor` / `shove_cantor` / `must_preceptor` / `parched_cantor` / `parched_preacher`. **#1291** owns `SDA-2026-10-29-235`…`249` — do not re-file. **#1226** owns `SDA-2026-10-28-220`…`234` — do not re-file. Same-day **#1277** TBC / **#1285** WDD / **#1303** ENC stamp as listed; do not clone unique §11. Do not restack `MASTER_ROADMAP.md` / `WORLD_DYNAMICS.md` / `worldFeatures.ts` / `BOSS_AND_SPELL_DISCOVERY.md`. CDA-031 had **not** opened. Same-day long-horizon **#1312** is sim only.

---

ACTION_ID: SDE-2026-10-29-001  
SOURCE_AUTOMATION: Dynamic Spell Discovery and Enemy Spell Evolution Designer  
TITLE: Do not land Wave-21 data before Wave-1 ownership split and G resolve through Wave 20  
CATEGORY: dependency  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: HEAD is still `0f5363f`. `WorldExploration.tsx` 2395–2440 still forces every `starterSpells` row `isBaseSpell: true`. `BattleRecapData` (`PostBattleRecap.tsx` 6–34) has no `discoveredSpells`. `buildEnemyKit(enemy.pieceType, currentMap.levelZone)` at WX 11920 still passes a `{ name, minLevel, maxLevel }` object. Wave-1 P0 through Wave-20 P0 are still NEW. Adding 19 ids to the always-owned catalog would make discovery worse. CDA-029 (#942) and CDA-030 (#982) still forbid shipping Wave-15/16 live rows until those gates exist.  
SYSTEMS_AFFECTED: hydrate; recap; catalog; kit resolve  
RECOMMENDED_ACTION: Keep Wave-21 definitions `STATUS: PROPOSED` until innate four + observe + `commitSpellDiscoveries` + numeric `G` exist. Do not append Wave-21 ids to `starterSpells`.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: SDE-2026-08-31-001; SDE-2026-08-31-002; SDE-2026-08-31-003; SDE-2026-09-01-001; SDE-2026-10-28-001  
REGRESSION_RISK: HIGH if ignored (catalog pre-own; G21 verbs on G=0 kits).  
VALIDATION_REQUIRED: New character still owns only the four innate ids after Wave-1 split. `generationMin: 21` absent at G≤20.  
STATUS: NEW  

---

ACTION_ID: SDE-2026-10-29-002  
SOURCE_AUTOMATION: Dynamic Spell Discovery and Enemy Spell Evolution Designer  
TITLE: Resolve a G≥21 extra pool slot with generationMin  
CATEGORY: pool-evolution  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Wave-20 SDE-2026-10-28-002 asked for a G≥20 extra slot. Wave 21 stamps `generationMin: 21` on unique family verbs. `Math.floor(levelZone)` is still NaN (`enemyAI.ts` 194–199; WX 11920). `computeAITier` still plateaus at label 10 (`combatMath.ts` 36–52).  
SYSTEMS_AFFECTED: `resolveEnemyKit`; family overlays  
RECOMMENDED_ACTION: After SDE-2026-10-28-002, at G≥21 allow one extra ADVANCED/RARE/ELITE with `generationMin ≤ G`. Never retire CORE or G20. Empty → `[physical_attack]`. Do not retune `pickEnemyLevelFromTiers`. No `G_max`. Wave-21 family CORE is unique **#1198** Wave-19 verbs (minus Pack Camel / Camel Fold; Thin Gift healer CORE only) **and** **#1251** (minus Court Quinte; Octave Mend healer CORE only). Unique §11 stay extras, not that CORE. Unique Wave-20 §11 stay extras until Wave 22, then CORE with **#1309**. Unique §11 stay extras until Wave 23. Do not clone those ids into unique §11. Do not restamp **#1305** `octave_mender` … `fresh_plater`.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: SDE-2026-10-28-002; SDE-2026-08-31-005; SDE-2026-08-31-006  
REGRESSION_RISK: MEDIUM — G=20 Tide must not receive Antelope Stride; empty kit must stay armed.  
VALIDATION_REQUIRED: Peer pawn still has Strike. `generationMin: 21` absent at G≤20.  
STATUS: NEW  

---

ACTION_ID: SDE-2026-10-29-003  
SOURCE_AUTOMATION: Dynamic Spell Discovery and Enemy Spell Evolution Designer  
TITLE: Wire Wave-21 aiHints before assigning those ids  
CATEGORY: ai-compat  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: `inferArchetype` (`enemyAI.ts` 447–452) still maps any `healAmount > 0` to healer. Summon fallback still uses name (`enemyAI.ts` 217–224). New hints (`walk_antelope_4_3`, `next_spell_exact_chebyshev_12`, `attract_toward_nearest_fuse_tile`, `bonus_if_share_antelope_4_3_with_caster`, `detonate_if_turn_end_leftover_ap_minus_mp_eq_3`, `negate_hit_if_leftover_ap_plus_mp_eq_8`, `skip_fuse_trigger_on_path_length_2`, `bonus_if_leftover_ap_eq_3_and_mp_eq_0`, `summon_walk_antelope_4_3_ap_tax`, `heal_if_leftover_ap_plus_mp_eq_8`, `cap_remaining_cds_gt_7_to_7`, `tax_next_walk_if_chebyshev_ge_4`, `trim_leftover_ap_if_adjacent_barrier`, `overwatch_snap_zero_walker_leftover_mp`, `negate_hit_if_leftover_ap_eq_3_and_mp_eq_0`, `bonus_if_near_fuse_occupancy`, `next_spell_exact_antelope_4_3`, `pack_walk_antelope_4_3`, `fold_two_player_side_share_antelope_4_3`) have no decide* branch.  
SYSTEMS_AFFECTED: `enemyAI.ts` decide*; kit resolve  
RECOMMENDED_ACTION: Implement each hint as a predicate on explicit flags / leftover AP-MP / Chebyshev dest permutation of (4,3) / painted fuse-tile occupancy / remaining CDs / barrier adjacency. Drop name fallbacks. Do not assign Octet Gift / Octave Mend / Thin Gift / Wide Gift / Deep Gift to non-healer CORE. Do not assign Fuse Reel when no painted fuse-tile exists. Do not assign Antelope Fold outside boss AI. Do not CORE Antelope Gate with Antelope Bite. Missing hint → drop id, log once.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: SDE-2026-08-31-006; SDE-2026-09-01-003; SDE-2026-10-28-003  
REGRESSION_RISK: HIGH if Fuse Reel dest is a world portal, Wick Skip ignores lava/spikes, Pack Antelope is granted, Antelope Stride confirm succeeds on Giraffe dests `(±4,±1)` / Camel dests `(±3,±2)` / Hook dests `(±3,±1)` / orthogonal `(±4,0)` / diagonal `(±4,±4)`, or Antelope Fold ships as owned.  
VALIDATION_REQUIRED: Antelope Stride confirm fails on Chebyshev ≠ 4, on (4,1), on (4,0), on (3,2), on (3,1), on knight dest, and on (4,4). Pack Antelope / Antelope Fold never owned. Octet Gift absent from non-healer CORE.  
STATUS: NEW  

---

ACTION_ID: SDE-2026-10-29-004  
SOURCE_AUTOMATION: Dynamic Spell Discovery and Enemy Spell Evolution Designer  
TITLE: Implement Wave-21 definitions as data + pool rows  
CATEGORY: catalog-wave  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Unique §11 ids are absent from `spellData.ts` / `SPELL_ID_CATALOG` (32 live ids). #1255 reserved Giraffe Stride … Giraffe Fold. #1251 reserved Octave Mend … Court Quinte. #1198 reserved Camel Stride … Camel Fold. Tombstone in Wave-21 §0.1 must not be reused. Every frontend `mpCost` is still 0 except the three sibling spenders once they land.  
SYSTEMS_AFFECTED: `spellData.ts`; `bossKits.ts` catalog; family `EnemyKit` pools  
RECOMMENDED_ACTION: Add unique SDE ids one at a time with full metadata. **Stamp** #1198 and #1251 ids onto Wave-21 family CORE — do not clone them. **Stamp** #1255 and #1309 ids onto Wave-22 family CORE — do not clone them. Unique Wave-20 §11 stay extras until Wave 22. Unique §11 stay `mpCost: 0` and stay extras until Wave 23. `spell-pack-antelope` / `spell-antelope-fold` never enter `ownedSpellIds`. Never `if (spell.name === …)`. Do not clone Giraffe Stride as Antelope Stride, Camel Stride as Antelope Stride, Hook Stride as Antelope Stride, Giraffe Bite as Antelope Bite, Trip Reel as Fuse Reel, Fuse Skip as Wick Skip, Pack Giraffe as Pack Antelope, Cadence Sext as Cadence Sept, Cadence Quinte as Cadence Sept, Cadence Sixte as Cadence Sept, Deep Gift as Octet Gift, Octave Mend as Octet Gift, Nonet Mend as Octet Gift, Wide Plate as Octet Plate, Pair Plate as Trio Plate, Pair Gait as Trio Gait, Skew Mark as Split Mark, Trip Cut as Fuse Cut, Watch Clip as Watch Halt, Giraffe Fold as Antelope Fold, Undeca Oath as Duodeca Oath, Dodeca Span as Duodeca Oath, Hexadeca Span as Duodeca Oath, or Triad Turn as Antelope Gate. Do not restamp #941 / #997 / **#1073** / **#1138** / **#1189** / **#1248** / **#1305** `ENEMY_ID`s, #951 / #1004 / **#1080** / **#1139** / **#1170** / **#1244** / **#1302** extra doors, #953 / #1011 / **#1063** / **#1132** / **#1177** / **#1251** / **#1309** extra doors, or #1017 / #1082 / **#1143** / **#1198** / **#1255** rooms / Pack Camel / Camel Fold / Pack Giraffe / Giraffe Fold doors. Do not mint `spell-octave-gift` / `spell-eight-gift` / `spell-nonet-gift` / `spell-trio-gift` / `spell-zebra-stride` / `spell-alfil-stride` / `spell-antelope-line` / `spell-ibis-stride` / `spell-cadence-seven` / `spell-cadence-six` / `spell-duodeca-span` / `spell-twelve-span` / `spell-sixteen-span` / `spell-dodeca-oath` / `spell-trio-turn`. Stamp **#1063** `spell-dodeca-span`, **#1251** `spell-pentadeca-span`, and **#1309** `spell-hexadeca-span`; do not clone them.  
AUTONOMY: HUMAN_APPROVE — each id is a combat toy.  
DEPENDENCIES: SDE-2026-10-29-001; SDE-2026-10-29-002; SDE-2026-10-29-003  
REGRESSION_RISK: HIGH per id if wired by name, assigned to the wrong profile, or if Fuse Reel dest is `map.portals`.  
VALIDATION_REQUIRED: `validateBossKits()` still passes. Typecheck clean. G=20 Tide has no Antelope Stride.  
STATUS: NEW  

---

ACTION_ID: SDE-2026-10-29-005  
SOURCE_AUTOMATION: Dynamic Spell Discovery and Enemy Spell Evolution Designer  
TITLE: Do not restamp feat / challenge / prior extra doors through #1309  
CATEGORY: feat-challenge-boss  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Achievements still Doka-only (`admin.mo` 309–326). All 15 feat doors are claimed or leftover. `survivor` stays leftover (Last Ember / Last Ward). **#1305** already claimed `octave_mender` … `fresh_plater`. **#1248** already claimed `septet_mender` … `idle_plater`. **#1302** already claimed `shove_hosteler` / `must_armarius` / `mid_crucifer` / `parched_oblate`. **#1244** already claimed `sip_visitor` / `halve_registrar` / `odd_penitentiary` / `sill_suffragan`. **#1251** already claimed `octave_cantor` / `quinte_precentor` / `span_pentadeca` / `court_quinte_regent` (Wave 22 sheets). **#1309** already claimed `nonet_cantor` / `sixte_precentor` / `span_hexadeca` / `court_sixte_regent` (Wave 23 sheets). **#1255** already claimed `giraffe_gallery` / `undeca_nave` / `trip_aisle` / `skew_pulpit` / `trip_nave` / `giraffe_precentor` / `giraffe_fold_regent`. **#1198** already claimed `camel_gallery` / `fuse_nave` / `camel_precentor` / `camel_fold_regent`. Do not use `unstoppable` / `level_10`.  
SYSTEMS_AFFECTED: `AchievementConfig`; challenge persist; boss-clear persist  
RECOMMENDED_ACTION: Unique Wave-21 grants are observe+win / ELITE / `antelope_gallery` only. Do not restamp `survivor` / `jackpot` / `leader_slayer` / `spell_master`. Do not restamp #1305 / #1248 family ids. Do not restamp #1302 / #1244 extra doors. Do not restamp #1251 / #1309 extra doors. Do not restamp #1255 / #1198 rooms or Pack Giraffe / Giraffe Fold / Pack Camel / Camel Fold doors. Pack Antelope / Antelope Fold never write `ownedSpellIds`. Court Quinte / Court Sixte never write `ownedSpellIds`.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: SDE-2026-08-31-007; SDE-2026-10-28-005; SDE-2026-10-29-001  
REGRESSION_RISK: MEDIUM — remount must not double-grant; first MULTI child wins.  
VALIDATION_REQUIRED: No new `AchievementConfig` row. `survivor` still Doka-only.  
STATUS: NEW  

---

ACTION_ID: SDE-2026-10-29-006  
SOURCE_AUTOMATION: Dynamic Spell Discovery and Enemy Spell Evolution Designer  
TITLE: Add antelope_gallery, dozen_nave, wick_aisle, split_pulpit, wick_lane as tagged encounters  
CATEGORY: special-encounter  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Wave-20 specials (`giraffe_gallery` / `undeca_nave` / `trip_aisle` / `skew_pulpit` / `trip_nave`) already own those tags. Wave-19 `fuse_nave` owns Fuse Skip (pathLength **1**), not Wick Skip (pathLength **2**). Wave-3 `long_gallery` owns Far Sting, not Duodeca Oath. `span_dodeca` owns Dodeca Span occupy-weight 12, not Duodeca Oath. `skew_pulpit` owns Skew Mark, not Split Mark. `trip_aisle` owns Trip Reel, not Fuse Reel. `fog_of_war` is still an announce-only stub. Fuse Tile is painted occupancy (`spell-fuse-tile`, #185).  
SYSTEMS_AFFECTED: encounter tag table; kit overlay  
RECOMMENDED_ACTION: Tag existing solvable layouts. All five teach via observe+win (Antelope Stride / Duodeca Oath / Fuse Reel / Split Mark / Wick Skip). Do not retag `giraffe_gallery` / `undeca_nave` / `trip_aisle` / `skew_pulpit` / `trip_nave` / `camel_gallery` / `fuse_nave` / `wick_gallery` / `span_dodeca` / `span_pentadeca` / `span_hexadeca`. Do not consume prior ENC-* / WF-* ids, including **#1303** Sestet/Tern/Mire/Stock (`ENC-TEACH-21` … `ENC-RUSH-82` teach **#1189** / **#1082**, not unique antelope) and **#1285** `WF-*-QUOTA_*`. Do not edit `mapGen.ts` algorithms. Do not invent a second recap. World portals stay locked while hostiles live. Painted fuse / tripwire / glyph-tax cells are spell occupancy, not `HazardTileType`.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: SDE-2026-08-31-003; SDE-2026-10-28-006; SDE-2026-10-29-005  
REGRESSION_RISK: MEDIUM if a tag seals portals, skips `finalizePlayableLayout`, or treats fuse cells as Twin Gate pads.  
VALIDATION_REQUIRED: Maps stay solvable. Defeat does not grant. `giraffe_gallery` still teaches Giraffe Stride, not Antelope Stride. `fuse_nave` still teaches Fuse Skip, not Wick Skip. `skew_pulpit` still teaches Skew Mark, not Split Mark. `span_dodeca` still teaches Dodeca Span, not Duodeca Oath.  
STATUS: NEW  

---

ACTION_ID: SDE-2026-10-29-007  
SOURCE_AUTOMATION: Dynamic Spell Discovery and Enemy Spell Evolution Designer  
TITLE: Observation edge cases for antelope walk, fuse pull, split-mark paint, octet plate, and fizzle  
CATEGORY: discovery-pipeline  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Wave-1 observe is “cast spent AP.” Antelope Stride observes on the **arm**, not the later walk. Split Mark observes on **paint**, not the turn-end detonate. Octet Plate / Trio Plate observe on the **arm**, not the negated hit. Fuse Reel with no painted fuse-tile fizzles after AP — still observes. Pack Antelope / Antelope Fold never persist.  
SYSTEMS_AFFECTED: observe hook; recap; challenge HP/AP helpers  
RECOMMENDED_ACTION: Observe on Antelope Stride / Duodeca Oath / Octet Plate / Trio Plate / Wick Skip / Cadence Sept / Watch Halt / Antelope Gate **arm**. Fizzle after AP spend still observes (Fuse Reel empty, Brick Trim with no adjacent barrier, Octet Gift leftover AP+MP≠8, Reach Toll while Chebyshev ≤ 3). Illegal confirm (no AP) does not. Wick Skip consume is the spell; an ignored fuse trigger is not a second observe. Octet Gift HP gain uses existing healUsed only when player-side HP actually increased. Brick Trim’s leftover-AP trim is **not** `recordChallengeApSpend`. Watch Halt’s leftover-MP zero is not HP and is not `recordChallengeApSpend`. `ENEMY_ONLY` / `BOSS_ONLY` never write `ownedSpellIds`. Player summons never observe.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: SDE-2026-08-31-002; SDE-2026-10-28-007; SDE-2026-10-29-004  
REGRESSION_RISK: HIGH if split-mark detonate double-observes, Pack Antelope is granted, Fuse Reel dest is a world portal, or Antelope Stride confirm succeeds on Giraffe dests.  
VALIDATION_REQUIRED: Wave-21 QA rows W21-1…W21-12, W21-20.  
STATUS: NEW  

---

ACTION_ID: SDE-2026-10-29-008  
SOURCE_AUTOMATION: Dynamic Spell Discovery and Enemy Spell Evolution Designer  
TITLE: Recap cards must list Wave-21 fields on the existing popup  
CATEGORY: discovery-ux  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `PostBattleRecap.tsx` 6–34 still has no `discoveredSpells`. Wave-1 SDE-003 owns the field; Wave-21 only requires the same card shape (name, role, AP, range, target, key effect, source enemy).  
SYSTEMS_AFFECTED: `BattleRecapData`; recap chrome  
RECOMMENDED_ACTION: Do not add a second popup. Stack up to 4 cards. Defeat never shows `NEW SPELL DISCOVERED`. Carved-stone / crimson only. In-battle cue remains `TECHNIQUE OBSERVED`.  
AUTONOMY: IMPLEMENT_AFTER_HUMAN  
DEPENDENCIES: SDE-2026-08-31-003; SDE-2026-08-31-004; SDE-2026-10-28-008  
REGRESSION_RISK: LOW for combat. MEDIUM if a second modal appears.  
VALIDATION_REQUIRED: One recap at `App.tsx` root.  
STATUS: NEW  
