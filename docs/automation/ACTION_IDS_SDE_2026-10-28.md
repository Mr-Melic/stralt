# ACTION_IDs — 2026-10-28 Dynamic Spell Discovery & Enemy Spell Evolution

Durable ledger for implementers and the Report Action Orchestrator.  
Source of every record: Dynamic Spell Discovery and Enemy Spell Evolution Designer.  
Design contract: [`SPELL_DISCOVERY_ECOSYSTEM_2026-10-28.md`](./SPELL_DISCOVERY_ECOSYSTEM_2026-10-28.md).  
Wave-1 law (still blocking): [`SPELL_DISCOVERY_ECOSYSTEM_2026-08-31.md`](./SPELL_DISCOVERY_ECOSYSTEM_2026-08-31.md) and `SDE-2026-08-31-001`…`009`.  
Wave-2…19 generation stamps (still blocking): `SDE-2026-09-01-001`…`008` through `SDE-2026-10-27-001`…`008`.  
Do not implement gameplay from this file unless a later human or orchestrator explicitly picks an ID. This run ships **docs only**.

Sibling ledgers (do not re-open): tactical ids in PRs #120 / #185 / #282 / #342 / #411 / #463 / #525 / #563 / #636 / #695 / #726 / #787 / #849 / #890 / #953 / #1011 / **#1063** (Stave Mend … Court Dock; extra doors `stave_cantor` / `dock_precentor` / `span_dodeca` / `court_dock_regent`; **stamp as Wave 18 family CORE**) / **#1132** (Sestet Mend … Court Tierce; extra doors `sestet_cantor` / `tierce_precentor` / `span_trideca` / `court_tierce_regent`; **stamp as Wave 19 family CORE**) / **#1177** (Septet Mend … Court Quarte; extra doors `septet_cantor` / `quarte_precentor` / `span_tetradeca` / `court_quarte_regent`; **stamp as Wave 20 family CORE**) / **#1251** (Octave Mend … Court Quinte; extra doors `octave_cantor` / `quinte_precentor` / `span_pentadeca` / `court_quinte_regent` wait for Wave 22 sheets; **stamp as Wave 21 family CORE**); family sheets through **#840**, **#899**, **#941**, **#997**, **#1073** (`score_mender` … `summon_plater`), **#1138** (`stave_mender` … `cast_plater`), **#1189** (`sestet_mender` … `strike_plater`), **#1248** (`septet_mender` … `idle_plater`); boss extras through **#836**, **#903**, **#951**, **#1004** / **#1080** (`slide_porter` / `both_capitular` / `heave_kitchener` / `parched_preacher`; leftover Pair Slide / Both Mend / Heave Mend / Parched Mend; spectacular `CHOIR_SLIDE` / `CHOIR_BOTH` / `NAVE_HEAVE` / `CHOIR_PARCHED` stay `BOSS_ONLY`) / **#1139** (`stride_chancellor` / `dual_treasurer` / `imprint_archdeacon` / `damp_provost`; leftover Stride Keep / Dual Keep / Cadence Imprint / Damp Sting; spectacular `NAVE_STRIDE` / `NAVE_DUAL` / `CHOIR_IMPRINT` / `CHOIR_DAMP` stay `BOSS_ONLY`; Rush Table Q) / **#1170** (`trim_abbot` / `ready_commissary` / `lean_procurator` / `near_scholastic`; leftover Cadence Trim / Ready Sting / Lean Sting / Near Hood; spectacular `CHOIR_TRIM` / `NAVE_READY` / `CHOIR_LEAN` / `NAVE_NEAR` stay `BOSS_ONLY`; do not remap `trim_precentor`; Rush Table R) / **#1244** (`sip_visitor` / `halve_registrar` / `odd_penitentiary` / `sill_suffragan`; leftover Gait Sip / Cadence Halve / Odd Hood / Cast Sill; spectacular `CHOIR_SIP` / `CHOIR_HALVE` / `NAVE_ODD` / `NAVE_SILL` stay `BOSS_ONLY`; do not remap `gait_cantor` / `halve_precentor` / `trim_precentor`; Rush Table S); Wave-1…19 SDE ids including memory-reserved Wave 5 and still-open **#906** / **#962** / **#1017** / **#1082** / **#1143** / **#1198**; encounter rooms in **#771**, **#826**, **#885**, **#957**, **#1006**, **#1056**, **#1121** (Tally/Rank/Spike/Odd; `ENC-TEACH-18` … `ENC-RUSH-70`) / **#1195** (Score/File/Lava/Ready; `ENC-TEACH-19` … `ENC-RUSH-74` — teach **#1073** verbs, not unique §11) / **#1249** (Stave/Ring/Rime/Match; `ENC-TEACH-20` / `ENC-SPELL-39` / `ENC-SPELL-40` / `ENC-RUSH-75`…`78` — teach **#1138** / **#1017** verbs, not unique §11 giraffe); world dynamics **#949** / **#993** / **#1064** / **#1114** (`WF-HAZ-PAIR_SEAM` … `WF-ENV-PAIR_DRAFT`; `WF-SPL-READY_TUTOR` never writes `ownedSpellIds`) / **#1172** (`WF-HAZ-MATCH_SEAM` … `WF-ENV-MATCH_DRAFT`; `WF-SPL-MATCH_TUTOR` never writes `ownedSpellIds`) / **#1235** (`WF-HAZ-POISE_SEAM` … `WF-ENV-POISE_DRAFT`; unique `ACTION_IDS_WDD_2026-10-28.md`; do **not** restack `WORLD_DYNAMICS.md` / `worldFeatures.ts`; `WF-SPL-POISE_TUTOR` never writes `ownedSpellIds`); SDA **#940** / **#1007** / **#1078** (175–189) / **#1140** (190–204) / **#1187** (205–219; unique `ACTION_IDS_SDA_2026-10-27.md` / `SPELL_ADMIN_DESIGN_2026-10-27.md` — do not overwrite) / **#1226** (220–234; unique `ACTION_IDS_SDA_2026-10-28.md` / `SPELL_ADMIN_DESIGN_2026-10-28.md` — do not overwrite); CDA **#942** / **#982** (CDA-030 freezes **shipping** Wave-15/16 live rows until Wave-1 gates; this ledger is sequential Generation 20 **design only**, not Wave 21); CDA-031 had **not** opened at this stamp (**#1222** is content diversity, not CDA-031; CDA-031 is **#1069** 2026-10-25); EBA **#1044** / **#1111** / **#1163** / **#1218** (unique files; zero extra doors); WDEAD **#1050** / **#1128** / **#1183** / **#1236** (unique files); roadmap **#870** / **#946** / **#998** / **#1074** / **#1124** / **#1186** / **#1254** (unique `ACTION_IDS_2026-10-28.md`; do **not** restack `MASTER_ROADMAP.md`); FSN **#1176** drop 19 / **#1237** drop 20; AEE **#1192** / **#1240**; PX **#1175** / **#1246**. **SDE already won** `spell-cadence-floor` vs #890. Unique Wave-19 §11 stay extras until Wave 21. Unique §11 stay extras until Wave 22. Cadence Sext is remaining `n>6` → `6`; Cadence Quint is `n>5` → `5`; Cadence Quad is `n>4` → `4`; Cadence Tern is `n>3` → `3`; Cadence Cap is `n>2` → `2`; Cadence Floor is `n>1` → `1`; Cadence Rise is `1→2`; Cadence Prime is `0→1`; Cadence Snuff is `1→0`; Cadence Dock is `2→0`; Cadence Tierce is `3→0`; Cadence Quarte is `4→0`; Cadence Quinte is `5→0`. Deep Gift is leftover **AP === 1 AND MP ≥ 2**; Thin Gift stays **1/0**; Wide Gift stays **AP ≥ 2 AND MP ≥ 1**; Gait Gift stays **AP ≥ 2 AND MP = 0**; Prime Gift stays **1/1**; Lean Gift stays **AP = 0 AND MP ≥ 1**; Score Mend is both-body leftover **sum === 4 AND unequal**; Stave Mend is both-body leftover **sum === 5**; Sestet Mend is both-body leftover **sum === 6 AND unequal**; Septet Mend is both-body leftover **sum === 7**; Octave Mend is both-body leftover **sum === 8 AND unequal**. Deep Plate is leftover **AP === 1 AND MP ≥ 2** negate; Wide Plate stays leftover **AP ≥ 2 AND MP ≥ 1** negate; Thin Plate stays leftover **1/0**; Prime Plate stays leftover **1/1**; Pair Plate stays leftover **2/0** negate (stricter than Dry Plate leftover MP=0 any AP). Skew Mark is turn-end leftover **AP − MP === 2**; Hollow Mark stays leftover **0/0**; Idle Mark stays leftover **MP equals max**. Pair Gait is leftover **2/0** damage. Tetradeca Span is occupy-weight **14** (2×7); Pentadeca Span is occupy-weight **15**; Undeca Oath is exact-11 spell gate, not Hendeca Span occupy-weight 11. Feud Turn is caster + one hostile invert. Kin Turn is caster + one same-side ally invert.

**#1177** remains Wave-19 tactical. **Stamp it as Wave 20 family CORE** together with unique **#1143** Wave-18 verbs and do not clone its ids into unique §11. **#1251** is Wave-20 tactical. **Stamp it as Wave 21 family CORE** together with unique **#1198** Wave-19 verbs and do not clone its ids into unique §11. **#1198** remains Wave-19 SDE. Unique Wave-19 §11 stay extras until Wave 21. Unique §11 stay extras until Wave 22. **SDE wins** unique leftover collisions (Deep Gift stays leftover 1/≥2, not Thin Gift and not Septet Mend both-body sum===7 and not Octave Mend both-body sum===8 unequal; Cadence Sext stays `n>6→6`, not Cadence Quint and not Cadence Quarte `4→0` and not Cadence Quinte `5→0`; Deep Plate stays leftover AP===1/MP≥2 negate, not Thin Plate / Wide Plate / Septet Hood / Octave Hood; Skew Mark stays turn-end leftover AP−MP===2, not Hollow Mark / Idle Mark / Septet Post / Octave Post — #1251 correctly held a `spell-skew-*` family; Pair Gait stays leftover 2/0 damage, not Thin Gait / Wide Sting; Pair Plate stays leftover 2/0 negate, not Dry Plate / Thin Plate; Undeca Oath stays exact-11 spell gate, not Pentadeca Span occupy-weight 15; Giraffe Gate stays next-spell dest (4,1), not Kin Turn). Do not mint `spell-septet-gift` / `spell-hept-gift` / `spell-skew-gift` / `spell-octave-gift` / `spell-eight-gift` / `spell-undeca-span` / `spell-fifteen-span` / `spell-pentakaideca-span` / `spell-giraffe-line` / `spell-alfil-stride` / `spell-cadence-six` / `spell-cadence-cinque` / `spell-cadence-fifth` / `spell-pair-toll` / `spell-duet-turn`. Do not mint `spell-fourteen-span` beside Tetradeca Span.

**#1080** remains Wave-18 extra doors `slide_porter` / `both_capitular` / `heave_kitchener` / `parched_preacher` — do not restamp. **#1139** remains Wave-19 extra doors `stride_chancellor` / `dual_treasurer` / `imprint_archdeacon` / `damp_provost` — do not restamp. **#1170** remains Wave-20 extra doors `trim_abbot` / `ready_commissary` / `lean_procurator` / `near_scholastic` — do not restamp. **#1244** remains Wave-21 extra doors `sip_visitor` / `halve_registrar` / `odd_penitentiary` / `sill_suffragan` — do not restamp. **#1251** extra doors `octave_cantor` / `quinte_precentor` / `span_pentadeca` / `court_quinte_regent` wait for Wave 22 — do not restamp. **#1248** family ids `septet_mender` … `idle_plater` — do not restamp. No new `#137` ids. First grant wins Parched Mend vs Dry Gait leftover-MP=0 heal. Do not remap `pair_usher` / `both_cantor` / `heave_cantor` / `parched_cantor` / `stride_bursar` / `dual_bursar` / `imprint_precentor` / `keep_bursar` / `trim_precentor` / `gait_cantor` / `halve_precentor`. **#1078** owns `SDA-2026-10-25-175`…`189` — do not re-file. **#1140** owns `SDA-2026-10-26-190`…`204` — do not re-file. **#1187** owns `SDA-2026-10-27-205`…`219` — do not re-file. **#1226** owns `SDA-2026-10-28-220`…`234` — do not re-file. Same-day **#1251** tactical / **#1248** families / **#1244** boss / **#1226** SDA / **#1249** ENC / **#1235** WF / **#1218** EBA / **#1236** WDEAD / **#1237** FSN / **#1240** AEE / **#1246** PX / **#1250** long-horizon / **#1222** content diversity / **#1254** MTD stamp as listed; do not clone unique §11. Do not restack `MASTER_ROADMAP.md`. CDA-031 had **not** opened at this stamp.

---

ACTION_ID: SDE-2026-10-28-001  
SOURCE_AUTOMATION: Dynamic Spell Discovery and Enemy Spell Evolution Designer  
TITLE: Do not land Wave-20 data before Wave-1 ownership split and G resolve through Wave 19  
CATEGORY: dependency  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: HEAD is still `0f5363f`. `WorldExploration.tsx` 2395–2440 still forces every `starterSpells` row `isBaseSpell: true`. `BattleRecapData` (`PostBattleRecap.tsx` 6–34) has no `discoveredSpells`. `buildEnemyKit(enemy.pieceType, currentMap.levelZone)` at WX 11920 still passes a `{ name, minLevel, maxLevel }` object. Wave-1 P0 through Wave-19 P0 are still NEW. Adding 19 ids to the always-owned catalog would make discovery worse. CDA-029 (#942) and CDA-030 (#982) still forbid shipping Wave-15/16 live rows until those gates exist.  
SYSTEMS_AFFECTED: hydrate; recap; catalog; kit resolve  
RECOMMENDED_ACTION: Keep Wave-20 definitions `STATUS: PROPOSED` until innate four + observe + `commitSpellDiscoveries` + numeric `G` exist. Do not append Wave-20 ids to `starterSpells`.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: SDE-2026-08-31-001; SDE-2026-08-31-002; SDE-2026-08-31-003; SDE-2026-09-01-001; SDE-2026-10-27-001  
REGRESSION_RISK: HIGH if ignored (catalog pre-own; G20 verbs on G=0 kits).  
VALIDATION_REQUIRED: New character still owns only the four innate ids after Wave-1 split. `generationMin: 20` absent at G≤19.  
STATUS: NEW  

---

ACTION_ID: SDE-2026-10-28-002  
SOURCE_AUTOMATION: Dynamic Spell Discovery and Enemy Spell Evolution Designer  
TITLE: Resolve a G≥20 extra pool slot with generationMin  
CATEGORY: pool-evolution  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Wave-19 SDE-2026-10-27-002 asked for a G≥19 extra slot. Wave 20 stamps `generationMin: 20` on unique family verbs. `Math.floor(levelZone)` is still NaN (`enemyAI.ts` 194–199; WX 11920). `computeAITier` still plateaus at label 10 (`combatMath.ts` 36–52).  
SYSTEMS_AFFECTED: `resolveEnemyKit`; family overlays  
RECOMMENDED_ACTION: After SDE-2026-10-27-002, at G≥20 allow one extra ADVANCED/RARE/ELITE with `generationMin ≤ G`. Never retire CORE or G19. Empty → `[physical_attack]`. Do not retune `pickEnemyLevelFromTiers`. No `G_max`. Wave-20 family CORE is unique **#1143** Wave-18 verbs (minus Pack Hook / Hook Fold; Wide Gift healer CORE only) **and** **#1177** (minus Court Quarte; Septet Mend healer CORE only). **#1248** named those families (`septet_mender` … `idle_plater`) — do not restamp. Unique §11 stay extras, not that CORE. Unique Wave-19 §11 stay extras until Wave 21. **#1251** stamps as Wave **21** family CORE. Unique §11 stay extras until Wave 22. Do not clone those ids into unique §11.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: SDE-2026-10-27-002; SDE-2026-08-31-005; SDE-2026-08-31-006  
REGRESSION_RISK: MEDIUM — G=19 Tide must not receive Giraffe Stride; empty kit must stay armed.  
VALIDATION_REQUIRED: Peer pawn still has Strike. `generationMin: 20` absent at G≤19.  
STATUS: NEW  

---

ACTION_ID: SDE-2026-10-28-003  
SOURCE_AUTOMATION: Dynamic Spell Discovery and Enemy Spell Evolution Designer  
TITLE: Wire Wave-20 aiHints before assigning those ids  
CATEGORY: ai-compat  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: `inferArchetype` (`enemyAI.ts` 447–452) still maps any `healAmount > 0` to healer. Summon fallback still uses name (`enemyAI.ts` 217–224). New hints (`walk_giraffe_4_1`, `next_spell_exact_chebyshev_11`, `attract_toward_nearest_tripwire`, `bonus_if_share_giraffe_4_1_with_caster`, `detonate_if_turn_end_leftover_ap_minus_mp_eq_2`, `negate_hit_if_leftover_ap_eq_1_and_mp_ge_2`, `skip_tripwire_trigger_on_path_length_2`, `bonus_if_leftover_ap_eq_2_and_mp_eq_0`, `summon_walk_giraffe_4_1_ap_tax`, `heal_if_leftover_ap_eq_1_and_mp_ge_2`, `cap_remaining_cds_gt_6_to_6`, `tax_next_walk_if_near_tripwire`, `halve_leftover_mp_if_adjacent_barrier`, `overwatch_snap_clip_walker_leftover_ap`, `negate_hit_if_leftover_ap_eq_2_and_mp_eq_0`, `bonus_if_near_tripwire_occupancy`, `next_spell_exact_giraffe_4_1`, `pack_walk_giraffe_4_1`, `fold_two_player_side_share_giraffe_4_1`) have no decide* branch.  
SYSTEMS_AFFECTED: `enemyAI.ts` decide*; kit resolve  
RECOMMENDED_ACTION: Implement each hint as a predicate on explicit flags / leftover AP-MP / Chebyshev dest permutation of (4,1) / painted tripwire occupancy / remaining CDs / barrier adjacency. Drop name fallbacks. Do not assign Deep Gift / Septet Mend / Wide Gift / Thin Gift / Prime Gift / Sestet Mend / Stave Mend / Score Mend / Octave Mend to non-healer CORE. Do not assign Trip Reel when no painted tripwire exists. Do not assign Giraffe Fold outside boss AI. Do not CORE Giraffe Gate with Giraffe Bite. Missing hint → drop id, log once.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: SDE-2026-08-31-006; SDE-2026-09-01-003; SDE-2026-10-27-003  
REGRESSION_RISK: HIGH if Trip Reel dest is a world portal, Trip Skip ignores lava/spikes, Pack Giraffe is granted, Giraffe Stride confirm succeeds on Camel dests `(±3,±2)` / Hook dests `(±3,±1)` / Tern dests `(±3,0)/(0,±3)` / knight `(2,1)` / orthogonal `(±4,0)`, or Giraffe Fold ships as owned.  
VALIDATION_REQUIRED: Giraffe Stride confirm fails on Chebyshev ≠ 4, on orthogonal dests including `(4,0)`, on diagonal dests, on `(3,2)`, on `(3,1)`, and on knight dest. Pack Giraffe / Giraffe Fold never owned. Deep Gift absent from non-healer CORE.  
STATUS: NEW  

---

ACTION_ID: SDE-2026-10-28-004  
SOURCE_AUTOMATION: Dynamic Spell Discovery and Enemy Spell Evolution Designer  
TITLE: Implement Wave-20 definitions as data + pool rows  
CATEGORY: catalog-wave  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Unique §11 ids are absent from `spellData.ts` / `SPELL_ID_CATALOG` (32 live ids). #1198 reserved Camel Stride … Camel Fold. #1177 reserved Septet Mend … Court Quarte. #1143 reserved Hook Stride … Hook Fold. Tombstone in Wave-20 §0.1 must not be reused. Every frontend `mpCost` is still 0 except the three sibling spenders once they land.  
SYSTEMS_AFFECTED: `spellData.ts`; `bossKits.ts` catalog; family `EnemyKit` pools  
RECOMMENDED_ACTION: Add unique SDE ids one at a time with full metadata. **Stamp** #1143 and #1177 ids onto Wave-20 family CORE — do not clone them. **Stamp** **#1251** onto Wave-21 family CORE — do not clone them. Unique Wave-19 §11 stay extras until Wave 21. Unique §11 stay `mpCost: 0` and stay extras until Wave 22. `spell-pack-giraffe` / `spell-giraffe-fold` never enter `ownedSpellIds`. Never `if (spell.name === …)`. Do not clone Camel Stride as Giraffe Stride, Hook Stride as Giraffe Stride, Knight Stride as Giraffe Stride, Ring Stride as Giraffe Stride, Camel Bite as Giraffe Bite, Glyph Reel as Trip Reel, Fuse Skip as Trip Skip, Pack Camel as Pack Giraffe, Cadence Quint as Cadence Sext, Cadence Quarte as Cadence Sext, Cadence Quinte as Cadence Sext, Thin Gift as Deep Gift, Septet Mend as Deep Gift, Octave Mend as Deep Gift, Wide Plate as Deep Plate, Thin Plate as Deep Plate, Hollow Mark as Skew Mark, Dry Plate as Pair Plate, Thin Gait as Pair Gait, Glyph Cut as Trip Cut, Watch Shave as Watch Clip, Camel Fold as Giraffe Fold, Deca Oath as Undeca Oath, Hendeca Span as Undeca Oath, or Pentadeca Span as Undeca Oath. Do not restamp #941 / #997 / **#1073** / **#1138** / **#1189** / **#1248** `ENEMY_ID`s, #951 / #1004 / **#1080** / **#1139** / **#1170** / **#1244** extra doors, #953 / #1011 / **#1063** / **#1132** / **#1177** / **#1251** extra doors, or #1017 / #1082 / **#1143** / **#1198** rooms / Pack Orth / Leap Fold / Pack Ring / Lane Fold / Pack Hook / Hook Fold / Pack Camel / Camel Fold doors. Do not mint `spell-even-plate` / `spell-score-gift` / `spell-stave-gift` / `spell-sestet-gift` / `spell-septet-gift` / `spell-octave-gift` / `spell-eight-gift` / `spell-hept-gift` / `spell-skew-gift` / `spell-eleven-span` / `spell-undeca-span` / `spell-fifteen-span` / `spell-pentakaideca-span` / `spell-quint-mend` / `spell-giraffe-line` / `spell-cadence-six` / `spell-cadence-hexa` / `spell-cadence-cinque` / `spell-cadence-fifth` / `spell-mixed-turn` / `spell-duet-turn` / `spell-alfil-stride` / `spell-pair-toll` / `spell-deep-sting`. Stamp **#1063** `spell-dodeca-span`, **#1132** `spell-trideca-span`, **#1177** `spell-tetradeca-span`, and **#1251** `spell-pentadeca-span`; do not clone them.  
AUTONOMY: HUMAN_APPROVE — each id is a combat toy.  
DEPENDENCIES: SDE-2026-10-28-001; SDE-2026-10-28-002; SDE-2026-10-28-003  
REGRESSION_RISK: HIGH per id if wired by name, assigned to the wrong profile, or if Trip Reel dest is `map.portals`.  
VALIDATION_REQUIRED: `validateBossKits()` still passes. Typecheck clean. G=19 Tide has no Giraffe Stride.  
STATUS: NEW  

---

ACTION_ID: SDE-2026-10-28-005  
SOURCE_AUTOMATION: Dynamic Spell Discovery and Enemy Spell Evolution Designer  
TITLE: Do not restamp feat / challenge / #890 / #899 / #903 / #906 / #941 / #951 / #953 / #962 / #997 / #1004 / #1011 / #1017 / #1063 / #1073 / #1078 / #1080 / #1082 / #1132 / #1138 / #1139 / #1140 / #1143 / #1170 / #1177 / #1187 / #1189 / #1198 / #1226 / #1244 / #1248 / #1251 extra doors  
CATEGORY: feat-challenge-boss  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Achievements still Doka-only (`admin.mo` 309–326). All 15 feat doors are claimed or leftover. `survivor` stays leftover (Last Ember / Last Ward). #890 already claimed `poise_cantor` / `floor_precentor` / `span_nine` / `court_floor_regent`. #899 already claimed `gaunt_mender` … `axis_cutter`. #941 already claimed `poise_mender` … `drift_gifter`. #997 already claimed `tally_mender` … `shove_gifter`. **#1073** already claimed `score_mender` … `summon_plater`. **#1138** already claimed `stave_mender` … `cast_plater`. **#1189** already claimed `sestet_mender` … `strike_plater`. **#1248** already claimed `septet_mender` … `idle_plater`. #903 already claimed `jostle_subdeacon` / `peel_friar` / `dilate_organist` / `hood_recluse`. #951 already claimed `wick_exorcist` / `dry_nuncio` / `hearth_legate` / `must_preceptor`. #1004 already claimed `boot_subprior` / `purse_steward` / `tick_infirmarer` / `mute_notary`. **#1080** already claimed `slide_porter` / `both_capitular` / `heave_kitchener` / `parched_preacher`. **#1170** already claimed `trim_abbot` / `ready_commissary` / `lean_procurator` / `near_scholastic`. **#1244** already claimed `sip_visitor` / `halve_registrar` / `odd_penitentiary` / `sill_suffragan`. #953 already claimed `tally_cantor` / `prime_precentor` / `span_dec` / `court_prime_regent`. #1011 already claimed `score_cantor` / `snuff_precentor` / `span_hendeca` / `court_snuff_regent`. **#1063** already claimed `stave_cantor` / `dock_precentor` / `span_dodeca` / `court_dock_regent`. **#1132** already claimed `sestet_cantor` / `tierce_precentor` / `span_trideca` / `court_tierce_regent`. **#1177** already claimed `septet_cantor` / `quarte_precentor` / `span_tetradeca` / `court_quarte_regent`. **#1251** already claimed `octave_cantor` / `quinte_precentor` / `span_pentadeca` / `court_quinte_regent` (Wave 22 sheets). #906 already claimed `rank_gallery` / `penta_nave` / `spike_aisle` / `swap_pulpit` / `mire_nave` / `rank_precentor` / `rank_fold_regent`. #962 already claimed `file_gallery` / `hexa_nave` / `lava_aisle` / `strike_pulpit` / `shock_nave` / `diag_precentor` / `far_fold_regent`. #1017 already claimed `ring_gallery` / `hepta_nave` / `frost_aisle` / `last_pulpit` / `rift_court` / `lane_precentor` / `leap_fold_regent`. **#1082** already claimed `tern_gallery` / `octa_nave` / `bog_aisle` / `spawn_pulpit` / `belt_nave` / `hoop_precentor` / `lane_fold_regent`. **#1143** already claimed `hook_gallery` / `nona_nave` / `mill_aisle` / `idle_pulpit` / `brier_nave` / `hook_precentor` / `hook_fold_regent`. **#1198** already claimed `camel_gallery` / `deca_nave` / `cipher_aisle` / `hollow_pulpit` / `fuse_nave` / `camel_precentor` / `camel_fold_regent`. Do not use `unstoppable` / `level_10`.  
SYSTEMS_AFFECTED: `AchievementConfig`; challenge persist; boss-clear persist  
RECOMMENDED_ACTION: Unique Wave-20 grants are observe+win / ELITE / `giraffe_gallery` only. Do not restamp `survivor` / `jackpot` / `leader_slayer` / `spell_master`. Do not restamp #890 extra doors. Do not restamp #899 / #941 / #997 / **#1073** / **#1138** / **#1189** / **#1248** family ids. Do not restamp #903 / #951 / #1004 / **#1080** / **#1139** / **#1170** / **#1244** extra doors. Do not restamp #953 / #1011 / **#1063** / **#1132** / **#1177** / **#1251** extra doors. Do not restamp #906 / #962 / #1017 / **#1082** / **#1143** / **#1198** rooms or Pack Rank / Rank Fold / Pack Diag / Far Fold / Pack Orth / Leap Fold / Pack Ring / Lane Fold / Pack Hook / Hook Fold / Pack Camel / Camel Fold doors. Do not overwrite **#1078** SDA 175–189 files. Do not overwrite **#1140** SDA 190–204 files. Do not overwrite **#1187** SDA 205–219 files. Do not overwrite **#1226** SDA 220–234 files. Pack Giraffe / Giraffe Fold never write `ownedSpellIds`. Court Snuff / Court Dock / Court Tierce / Court Quarte / Court Quinte never write `ownedSpellIds`. CHOIR_SLIDE / CHOIR_BOTH / NAVE_HEAVE / CHOIR_PARCHED / CHOIR_TRIM / NAVE_READY / CHOIR_LEAN / NAVE_NEAR / CHOIR_SIP / CHOIR_HALVE / NAVE_ODD / NAVE_SILL never write `ownedSpellIds`.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: SDE-2026-08-31-007; SDE-2026-10-27-005; SDE-2026-10-28-001  
REGRESSION_RISK: MEDIUM — remount must not double-grant; first MULTI child wins.  
VALIDATION_REQUIRED: No new `AchievementConfig` row. `survivor` still Doka-only.  
STATUS: NEW  

---

ACTION_ID: SDE-2026-10-28-006  
SOURCE_AUTOMATION: Dynamic Spell Discovery and Enemy Spell Evolution Designer  
TITLE: Add giraffe_gallery, undeca_nave, trip_aisle, skew_pulpit, trip_nave as tagged encounters  
CATEGORY: special-encounter  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Wave-19 specials (`camel_gallery` / `deca_nave` / `cipher_aisle` / `hollow_pulpit` / `fuse_nave`) already own those tags. Wave-18 `hook_gallery` owns Hook Stride, not Giraffe Stride. Wave-17 `tern_gallery` owns Tern Stride, not Giraffe Stride. Wave-16 `ring_gallery` owns Ring Stride, not Giraffe Stride. Wave-3 `long_gallery` owns Far Sting, not Undeca Oath. `span_hendeca` owns Hendeca Span occupy-weight 11, not Undeca Oath. `deca_nave` owns Deca Oath, not Undeca Oath. `hollow_pulpit` owns Hollow Mark, not Skew Mark. `fuse_nave` owns Fuse Skip, not Trip Skip. `cipher_aisle` owns Glyph Reel, not Trip Reel. `fog_of_war` is still an announce-only stub. Thorned Ground is a live map modifier (`mapModifiers.ts` 175–186); Brier Skip keys off pathLength 2, not occupancy. Tripwire is painted occupancy (`spell-tripwire`, #120). Fuse Tile is painted delayed fuse (`spell-fuse-tile`).  
SYSTEMS_AFFECTED: encounter tag table; kit overlay  
RECOMMENDED_ACTION: Tag existing solvable layouts. All five teach via observe+win (Giraffe Stride / Undeca Oath / Trip Reel / Skew Mark / Trip Skip). Do not retag `camel_gallery` / `deca_nave` / `cipher_aisle` / `hollow_pulpit` / `fuse_nave` / `hook_gallery` / `nona_nave` / `mill_aisle` / `idle_pulpit` / `brier_nave` / `tern_gallery` / `octa_nave` / `bog_aisle` / `spawn_pulpit` / `belt_nave` / `ring_gallery` / `file_gallery` / `orth_gallery` / `rank_gallery` / `knight_gallery` / `even_gallery` / `pair_gallery` / `hepta_nave` / `hexa_nave` / `penta_nave` / `span_six` / `span_dec` / `span_hendeca` / `span_dodeca` / `span_trideca` / `span_tetradeca` / `span_pentadeca` / `mire_nave` / `frost_aisle` / `lava_aisle` / `strike_pulpit` / `last_pulpit`. Do not consume #771 `ENC-BASH-*` / `ENC-DRY-*` / `ENC-HOOD-*` ids. Do not consume #826 / #885 / #957 / #1006 / **#1056** / **#1121** / **#1195** / **#1249** ENC-* ids. Do not consume #949 / #993 / **#1064** / **#1114** / **#1172** / **#1235** `WF-*`. Do not restack **#1235** `WORLD_DYNAMICS.md` / `worldFeatures.ts`. Do not edit `mapGen.ts` algorithms. Do not invent a second recap. World portals stay locked while hostiles live. Twin Gate pads are not `map.portals`. Painted tripwire / glyph-tax / fuse cells are spell occupancy, not `HazardTileType`. Thorned Ground extra is a map-modifier pathLength tax, not occupancy.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: SDE-2026-08-31-003; SDE-2026-10-27-006; SDE-2026-10-28-005  
REGRESSION_RISK: MEDIUM if a tag seals portals, skips `finalizePlayableLayout`, or treats tripwire cells as Twin Gate pads.  
VALIDATION_REQUIRED: Maps stay solvable. Defeat does not grant. `camel_gallery` still teaches Camel Stride, not Giraffe Stride. `hook_gallery` still teaches Hook Stride, not Giraffe Stride. `tern_gallery` still teaches Tern Stride, not Giraffe Stride. `deca_nave` still teaches Deca Oath, not Undeca Oath. `span_hendeca` still teaches Hendeca Span, not Undeca Oath. `cipher_aisle` still teaches Glyph Reel, not Trip Reel. `hollow_pulpit` still teaches Hollow Mark, not Skew Mark. `fuse_nave` still teaches Fuse Skip, not Trip Skip. `ENC-KNIGHT-01` still teaches Knight Stride, not Giraffe Stride.  
STATUS: NEW  

---

ACTION_ID: SDE-2026-10-28-007  
SOURCE_AUTOMATION: Dynamic Spell Discovery and Enemy Spell Evolution Designer  
TITLE: Observation edge cases for giraffe walk, tripwire pull, skew-mark paint, deep plate, and fizzle  
CATEGORY: discovery-pipeline  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Wave-1 observe is “cast spent AP.” Giraffe Stride observes on the **arm**, not the later walk. Skew Mark observes on **paint**, not the turn-end detonate. Deep Plate / Pair Plate observe on the **arm**, not the negated hit. Trip Reel with no painted tripwire fizzles after AP — still observes. Pack Giraffe / Giraffe Fold never persist.  
SYSTEMS_AFFECTED: observe hook; recap; challenge HP/AP helpers  
RECOMMENDED_ACTION: Observe on Giraffe Stride / Undeca Oath / Deep Plate / Pair Plate / Trip Skip / Cadence Sext / Watch Clip / Giraffe Gate **arm**. Fizzle after AP spend still observes (Trip Reel empty, Brick Split with no adjacent barrier, Deep Gift leftover not AP===1/MP≥2, Trip Toll while Chebyshev ≥ 2 from tripwire). Illegal confirm (no AP) does not. Trip Skip consume is the spell; an ignored tripwire trigger is not a second observe. Deep Gift HP gain uses existing healUsed only when player-side HP actually increased. Brick Split’s leftover-MP halve is **not** `recordChallengeApSpend`. Watch Clip’s leftover-AP clip is not HP and is not `recordChallengeApSpend`. `ENEMY_ONLY` / `BOSS_ONLY` never write `ownedSpellIds`. Player summons never observe.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: SDE-2026-08-31-002; SDE-2026-10-27-007; SDE-2026-10-28-004  
REGRESSION_RISK: HIGH if skew-mark detonate double-observes, Pack Giraffe is granted, Trip Reel dest is a world portal, or Giraffe Stride confirm succeeds on Camel/Hook/Tern dests.  
VALIDATION_REQUIRED: Wave-20 QA rows W20-1…W20-12, W20-20.  
STATUS: NEW  

---

ACTION_ID: SDE-2026-10-28-008  
SOURCE_AUTOMATION: Dynamic Spell Discovery and Enemy Spell Evolution Designer  
TITLE: Recap cards must list Wave-20 fields on the existing popup  
CATEGORY: discovery-ux  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `PostBattleRecap.tsx` 6–34 still has no `discoveredSpells`. Wave-1 SDE-003 owns the field; Wave-20 only requires the same card shape (name, role, AP, range, target, key effect, source enemy).  
SYSTEMS_AFFECTED: `BattleRecapData`; recap chrome  
RECOMMENDED_ACTION: Do not add a second popup. Stack up to 4 cards. Defeat never shows `NEW SPELL DISCOVERED`. Carved-stone / crimson only. In-battle cue remains `TECHNIQUE OBSERVED`.  
AUTONOMY: IMPLEMENT_AFTER_HUMAN  
DEPENDENCIES: SDE-2026-08-31-003; SDE-2026-08-31-004; SDE-2026-10-27-008  
REGRESSION_RISK: LOW for combat. MEDIUM if a second modal appears.  
VALIDATION_REQUIRED: One recap at `App.tsx` root.  
STATUS: NEW  
