# ACTION_IDs — 2026-10-27 Dynamic Spell Discovery & Enemy Spell Evolution

Durable ledger for implementers and the Report Action Orchestrator.  
Source of every record: Dynamic Spell Discovery and Enemy Spell Evolution Designer.  
Design contract: [`SPELL_DISCOVERY_ECOSYSTEM_2026-10-27.md`](./SPELL_DISCOVERY_ECOSYSTEM_2026-10-27.md).  
Wave-1 law (still blocking): [`SPELL_DISCOVERY_ECOSYSTEM_2026-08-31.md`](./SPELL_DISCOVERY_ECOSYSTEM_2026-08-31.md) and `SDE-2026-08-31-001`…`009`.  
Wave-2…18 generation stamps (still blocking): `SDE-2026-09-01-001`…`008` through `SDE-2026-10-26-001`…`008`.  
Do not implement gameplay from this file unless a later human or orchestrator explicitly picks an ID. This run ships **docs only**.

Sibling ledgers (do not re-open): tactical ids in PRs #120 / #185 / #282 / #342 / #411 / #463 / #525 / #563 / #636 / #695 / #726 / #787 / #849 / #890 / #953 / #1011 / **#1063** (Stave Mend … Court Dock; extra doors `stave_cantor` / `dock_precentor` / `span_dodeca` / `court_dock_regent`; **stamp as Wave 18 family CORE**) / **#1132** (Sestet Mend … Court Tierce; extra doors `sestet_cantor` / `tierce_precentor` / `span_trideca` / `court_tierce_regent`; **stamp as Wave 19 family CORE**) / **#1177** (Septet Mend … Court Quarte; extra doors `septet_cantor` / `quarte_precentor` / `span_tetradeca` / `court_quarte_regent`; **stamp as Wave 20 family CORE**); family sheets through **#840**, **#899**, **#941**, **#997**, **#1073** (`score_mender` … `summon_plater`), **#1138** (`stave_mender` … `cast_plater`), **#1189** (`sestet_mender` … `strike_plater`); boss extras through **#836**, **#903**, **#951**, **#1004** (`boot_subprior` / `purse_steward` / `tick_infirmarer` / `mute_notary`) / **#1080** (`slide_porter` / `both_capitular` / `heave_kitchener` / `parched_preacher`; leftover Pair Slide / Both Mend / Heave Mend / Parched Mend; spectacular `CHOIR_SLIDE` / `CHOIR_BOTH` / `NAVE_HEAVE` / `CHOIR_PARCHED` stay `BOSS_ONLY`; do not remap `pair_usher` / `both_cantor` / `heave_cantor` / `parched_cantor`) / **#1139** (`stride_chancellor` / `dual_treasurer` / `imprint_archdeacon` / `damp_provost`; leftover Stride Keep / Dual Keep / Cadence Imprint / Damp Sting; spectacular `NAVE_STRIDE` / `NAVE_DUAL` / `CHOIR_IMPRINT` / `CHOIR_DAMP` stay `BOSS_ONLY`; do not remap `stride_bursar` / `dual_bursar` / `imprint_precentor` / `keep_bursar`; Rush Table Q) / **#1170** (`trim_abbot` / `ready_commissary` / `lean_procurator` / `near_scholastic`; leftover Cadence Trim / Ready Sting / Lean Sting / Near Hood; spectacular `CHOIR_TRIM` / `NAVE_READY` / `CHOIR_LEAN` / `NAVE_NEAR` stay `BOSS_ONLY`; do not remap `trim_precentor`; Rush Table R); Wave-1…18 SDE ids including memory-reserved Wave 5 and still-open **#906** / **#962** / **#1017** / **#1082** / **#1143**; encounter rooms in **#771**, **#826**, **#885**, **#957**, **#1006**, **#1056**, **#1121** (Tally/Rank/Spike/Odd; `ENC-TEACH-18` … `ENC-RUSH-70` — teach **#997** verbs, not unique §11) / **#1195** (Score/File/Lava/Ready; `ENC-TEACH-19` … `ENC-RUSH-74` — teach **#1073** verbs, not unique §11); world dynamics **#949** / **#993** / **#1064** / **#1114** (`WF-HAZ-PAIR_SEAM` … `WF-ENV-PAIR_DRAFT`; `WF-SPL-READY_TUTOR` never writes `ownedSpellIds`) / **#1172** (`WF-HAZ-MATCH_SEAM` … `WF-ENV-MATCH_DRAFT`; `WF-SPL-MATCH_TUTOR` never writes `ownedSpellIds`; unique `ACTION_IDS_WDD_2026-10-27.md` — do not restack `WORLD_DYNAMICS.md` / `worldFeatures.ts`); SDA **#940** / **#1007** / **#1078** (175–189; unique `ACTION_IDS_SDA_2026-10-25.md` / `SPELL_ADMIN_DESIGN_2026-10-25.md` — do not overwrite) / **#1140** (190–204; unique `ACTION_IDS_SDA_2026-10-26.md` / `SPELL_ADMIN_DESIGN_2026-10-26.md` — do not overwrite) / **#1187** (205–219; unique `ACTION_IDS_SDA_2026-10-27.md` / `SPELL_ADMIN_DESIGN_2026-10-27.md` — do not overwrite); CDA **#942** / **#982** (CDA-030 freezes **shipping** Wave-15/16 live rows until Wave-1 gates; this ledger is sequential Generation 19 **design only**, not Wave 20); CDA-031 had **not** opened at this stamp (**#1167** is content diversity, not CDA-031); EBA **#1044** / **#1111** / **#1163** (zero extra doors); WDEAD **#1050** / **#1128** / **#1183**; roadmap **#870** / **#946** / **#998** / **#1074** / **#1124** / **#1186**; FSN **#1176** drop 19; AEE **#1192**; PX **#1175**. **SDE already won** `spell-cadence-floor` vs #890. Unique Wave-18 §11 stay extras until Wave 20. Unique §11 stay extras until Wave 21. Cadence Quint is remaining `n>5` → `5`; Cadence Quad is `n>4` → `4`; Cadence Tern is `n>3` → `3`; Cadence Cap is `n>2` → `2`; Cadence Floor is `n>1` → `1`; Cadence Rise is `1→2`; Cadence Prime is `0→1`; Cadence Snuff is `1→0`; Cadence Dock is `2→0`; Cadence Tierce is `3→0`; Cadence Quarte is `4→0`. Thin Gift is leftover **AP === 1 AND MP === 0**; Wide Gift stays **AP ≥ 2 AND MP ≥ 1**; Gait Gift stays **AP ≥ 2 AND MP = 0**; Prime Gift stays **1/1**; Lean Gift stays **AP = 0 AND MP ≥ 1**; Score Mend is both-body leftover **sum === 4 AND unequal**; Stave Mend is both-body leftover **sum === 5**; Sestet Mend is both-body leftover **sum === 6 AND unequal**; Septet Mend is both-body leftover **sum === 7**. Wide Plate is leftover **AP ≥ 2 AND MP ≥ 1** negate; Thin Plate stays leftover **1/0**; Prime Plate stays leftover **1/1**. Hollow Mark is turn-end leftover **0/0** detonate; Idle Mark stays leftover **MP equals max**; Last Mark stays last leftover **AP**. Tetradeca Span is occupy-weight **14** (2×7); Deca Oath is exact-10 spell gate. Feud Turn is caster + one hostile invert.

**#1132** remains Wave-18 tactical. **Stamp it as Wave 19 family CORE** together with unique **#1082** Wave-17 verbs and do not clone its ids into unique §11. **#1177** remains Wave-19 tactical. **Stamp it as Wave 20 family CORE** together with unique Wave-18 §11 and do not clone its ids into unique §11. **SDE wins** unique leftover collisions (Thin Gift stays leftover 1/0, not Thin Gait and not Septet Mend both-body sum===7; Cadence Quint stays `n>5→5`, not Cadence Tierce and not Cadence Quarte `4→0`; Wide Plate stays leftover AP≥2/MP≥1 negate, not Sestet Hood / Septet Hood / Wide Sting; Hollow Mark stays turn-end leftover 0/0, not Idle Mark / Gaunt Post / Septet Post; Fresh Plate stays leftover AP equals max negate, not Idle Plate / Fresh Sting). Do not mint `spell-fourteen-span` beside Tetradeca Span. Do not mint `spell-mixed-turn` beside Feud Turn.

**#1080** remains Wave-18 extra doors `slide_porter` / `both_capitular` / `heave_kitchener` / `parched_preacher` — do not restamp. **#1139** remains Wave-19 extra doors `stride_chancellor` / `dual_treasurer` / `imprint_archdeacon` / `damp_provost` — do not restamp. **#1170** remains Wave-20 extra doors `trim_abbot` / `ready_commissary` / `lean_procurator` / `near_scholastic` — do not restamp. No new `#137` ids. First grant wins Parched Mend vs Dry Gait leftover-MP=0 heal. Do not remap `pair_usher` / `both_cantor` / `heave_cantor` / `parched_cantor` / `stride_bursar` / `dual_bursar` / `imprint_precentor` / `keep_bursar` / `trim_precentor`. **#1078** owns `SDA-2026-10-25-175`…`189` — do not re-file. **#1140** owns `SDA-2026-10-26-190`…`204` — do not re-file. **#1187** owns `SDA-2026-10-27-205`…`219` — do not re-file. Same-day **#1177** tactical / **#1189** families / **#1170** boss / **#1187** SDA / **#1195** ENC / **#1172** WF / **#1163** EBA / **#1183** WDEAD / **#1186** roadmap / **#1176** FSN / **#1192** AEE / **#1175** PX / **#1197** long-horizon sim remain this UTC day’s stamp — stamp them; do not clone unique §11. CDA-031 had **not** opened at this stamp.

---

ACTION_ID: SDE-2026-10-27-001  
SOURCE_AUTOMATION: Dynamic Spell Discovery and Enemy Spell Evolution Designer  
TITLE: Do not land Wave-19 data before Wave-1 ownership split and G resolve through Wave 18  
CATEGORY: dependency  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: HEAD is still `0f5363f`. `WorldExploration.tsx` 2395–2440 still forces every `starterSpells` row `isBaseSpell: true`. `BattleRecapData` (`PostBattleRecap.tsx` 6–34) has no `discoveredSpells`. `buildEnemyKit(enemy.pieceType, currentMap.levelZone)` at WX 11920 still passes a `{ name, minLevel, maxLevel }` object. Wave-1 P0 through Wave-18 P0 are still NEW. Adding 19 ids to the always-owned catalog would make discovery worse. CDA-029 (#942) and CDA-030 (#982) still forbid shipping Wave-15/16 live rows until those gates exist.  
SYSTEMS_AFFECTED: hydrate; recap; catalog; kit resolve  
RECOMMENDED_ACTION: Keep Wave-19 definitions `STATUS: PROPOSED` until innate four + observe + `commitSpellDiscoveries` + numeric `G` exist. Do not append Wave-19 ids to `starterSpells`.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: SDE-2026-08-31-001; SDE-2026-08-31-002; SDE-2026-08-31-003; SDE-2026-09-01-001; SDE-2026-10-26-001  
REGRESSION_RISK: HIGH if ignored (catalog pre-own; G19 verbs on G=0 kits).  
VALIDATION_REQUIRED: New character still owns only the four innate ids after Wave-1 split. `generationMin: 19` absent at G≤18.  
STATUS: NEW  

---

ACTION_ID: SDE-2026-10-27-002  
SOURCE_AUTOMATION: Dynamic Spell Discovery and Enemy Spell Evolution Designer  
TITLE: Resolve a G≥19 extra pool slot with generationMin  
CATEGORY: pool-evolution  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Wave-18 SDE-2026-10-26-002 asked for a G≥18 extra slot. Wave 19 stamps `generationMin: 19` on unique family verbs. `Math.floor(levelZone)` is still NaN (`enemyAI.ts` 194–199; WX 11920). `computeAITier` still plateaus at label 10 (`combatMath.ts` 36–52).  
SYSTEMS_AFFECTED: `resolveEnemyKit`; family overlays  
RECOMMENDED_ACTION: After SDE-2026-10-26-002, at G≥19 allow one extra ADVANCED/RARE/ELITE with `generationMin ≤ G`. Never retire CORE or G18. Empty → `[physical_attack]`. Do not retune `pickEnemyLevelFromTiers`. No `G_max`. Wave-19 family CORE is unique **#1082** Wave-17 verbs (minus Pack Ring / Lane Fold; Gait Gift healer CORE only) **and** **#1132** (minus Court Tierce; Sestet Mend healer CORE only). **#1189** already named those families — do not restamp. Unique §11 stay extras, not that CORE. Unique Wave-18 §11 stay extras until Wave 20. Same-day **#1177** stamps as Wave **20** family CORE. Unique §11 stay extras until Wave 21. Do not clone those ids into unique §11.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: SDE-2026-10-26-002; SDE-2026-08-31-005; SDE-2026-08-31-006  
REGRESSION_RISK: MEDIUM — G=18 Tide must not receive Camel Stride; empty kit must stay armed.  
VALIDATION_REQUIRED: Peer pawn still has Strike. `generationMin: 19` absent at G≤18.  
STATUS: NEW  

---

ACTION_ID: SDE-2026-10-27-003  
SOURCE_AUTOMATION: Dynamic Spell Discovery and Enemy Spell Evolution Designer  
TITLE: Wire Wave-19 aiHints before assigning those ids  
CATEGORY: ai-compat  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: `inferArchetype` (`enemyAI.ts` 447–452) still maps any `healAmount > 0` to healer. Summon fallback still uses name (`enemyAI.ts` 217–224). New hints (`walk_camel_3_2`, `next_spell_exact_chebyshev_10`, `attract_toward_nearest_glyph_tax`, `bonus_if_share_camel_3_2_with_caster`, `detonate_if_turn_end_leftover_ap_and_mp_eq_0`, `negate_hit_if_leftover_ap_ge_2_and_mp_ge_1`, `skip_fuse_detonate_on_path_length_1`, `bonus_if_leftover_ap_eq_0_and_mp_eq_0`, `summon_walk_camel_3_2_ap_tax`, `heal_if_leftover_ap_eq_1_and_mp_eq_0`, `cap_remaining_cds_gt_5_to_5`, `tax_next_walk_if_leftover_ap_eq_1_and_mp_eq_1`, `tax_next_walk_mp_if_adjacent_barrier`, `overwatch_snap_shave_walker_leftover_mp`, `bonus_if_leftover_ap_eq_0_and_mp_ge_1`, `bonus_if_near_glyph_tax_occupancy`, `negate_hit_if_leftover_ap_equals_max`, `pack_walk_camel_3_2`, `fold_two_player_side_share_camel_3_2`) have no decide* branch.  
SYSTEMS_AFFECTED: `enemyAI.ts` decide*; kit resolve  
RECOMMENDED_ACTION: Implement each hint as a predicate on explicit flags / leftover AP-MP / Chebyshev dest permutation of (3,2) / painted glyph-tax occupancy / painted fuse occupancy / remaining CDs / barrier adjacency. Drop name fallbacks. Do not assign Thin Gift / Wide Gift / Score Mend / Prime Gift / Stave Mend / Gait Gift / Sestet Mend / Septet Mend / Lean Gift / Hollow Gift to non-healer CORE. Do not assign Glyph Reel when no painted glyph-tax cell exists. Do not assign Camel Fold outside boss AI. Missing hint → drop id, log once. Honour **#1192** AEE increment; inspector lists modules by id.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: SDE-2026-08-31-006; SDE-2026-09-01-003; SDE-2026-10-26-003  
REGRESSION_RISK: HIGH if Glyph Reel dest is a world portal, Fuse Skip ignores lava/spikes/Thorned extra, Pack Camel is granted, Camel Stride confirm succeeds on Tern Stride dests `(±3,0)/(0,±3)` or Hook Stride dests `(3,1)` or knight `(2,1)`, or Camel Fold ships as owned.  
VALIDATION_REQUIRED: Camel Stride confirm fails on Chebyshev ≠ 3, on orthogonal dests, on (3,1) dests, on diagonal dests, and on knight dest. Pack Camel / Camel Fold never owned. Thin Gift absent from non-healer CORE.  
STATUS: NEW  

---

ACTION_ID: SDE-2026-10-27-004  
SOURCE_AUTOMATION: Dynamic Spell Discovery and Enemy Spell Evolution Designer  
TITLE: Implement Wave-19 definitions as data + pool rows  
CATEGORY: catalog-wave  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Unique §11 ids are absent from `spellData.ts` / `SPELL_ID_CATALOG` (32 live ids). #1082 reserved Tern Stride … Lane Fold. #1132 reserved Sestet Mend … Court Tierce. #1143 reserved Hook Stride … Hook Fold. #1177 reserved Septet Mend … Court Quarte. Tombstone in Wave-19 §0.1 must not be reused. Every frontend `mpCost` is still 0 except the three sibling spenders once they land.  
SYSTEMS_AFFECTED: `spellData.ts`; `bossKits.ts` catalog; family `EnemyKit` pools  
RECOMMENDED_ACTION: Add unique SDE ids one at a time with full metadata. **Stamp** #1082 and #1132 ids onto Wave-19 family CORE — do not clone them. **Stamp** #1177 ids onto Wave-20 family CORE — do not clone them. Unique Wave-18 §11 stay extras until Wave 20. Unique §11 stay `mpCost: 0` and stay extras until Wave 21. `spell-pack-camel` / `spell-camel-fold` never enter `ownedSpellIds`. Never `if (spell.name === …)`. Do not clone Hook Stride as Camel Stride, Tern Stride as Camel Stride, Knight Stride as Camel Stride, Ring Stride as Camel Stride, File Bite as Camel Bite, Hook Bite as Camel Bite, Slide Reel as Glyph Reel, Brier Skip as Fuse Skip, Pack Hook as Pack Camel, Cadence Quad as Cadence Quint, Cadence Tierce as Cadence Quint, Cadence Quarte as Cadence Quint, Thin Gait as Thin Gift, Wide Gift as Thin Gift, Septet Mend as Thin Gift, Wide Sting as Wide Plate, Idle Mark as Hollow Mark, Idle Plate as Fresh Plate, Fresh Sting as Fresh Plate, Tetradeca Span as Deca Oath, Feud Turn as Psalm Turn, or Hook Fold as Camel Fold. Do not restamp #941 / #997 / **#1073** / **#1138** / **#1189** `ENEMY_ID`s, #951 / #1004 / **#1080** / **#1139** / **#1170** extra doors, #953 / #1011 / **#1063** / **#1132** / **#1177** extra doors, or #1017 / #1082 / **#1143** rooms / Pack Orth / Leap Fold / Pack Ring / Lane Fold / Pack Hook / Hook Fold doors. Do not mint `spell-even-plate` / `spell-score-gift` / `spell-stave-gift` / `spell-sestet-gift` / `spell-septet-gift` / `spell-eleven-span` / `spell-octa-span` / `spell-twelve-span` / `spell-nona-span` / `spell-thirteen-span` / `spell-fourteen-span` / `spell-deca-span` / `spell-quint-mend` / `spell-hook-line` / `spell-camel-line` / `spell-cadence-trey` / `spell-cadence-cinque` / `spell-mixed-turn` / `spell-thin-sting` / `spell-wide-gait` / `spell-alfil-stride`. Stamp **#1063** `spell-dodeca-span`, **#1132** `spell-trideca-span`, and **#1177** `spell-tetradeca-span`; do not clone them.  
AUTONOMY: HUMAN_APPROVE — each id is a combat toy.  
DEPENDENCIES: SDE-2026-10-27-001; SDE-2026-10-27-002; SDE-2026-10-27-003  
REGRESSION_RISK: HIGH per id if wired by name, assigned to the wrong profile, or if Glyph Reel dest is `map.portals`.  
VALIDATION_REQUIRED: `validateBossKits()` still passes. Typecheck clean. G=18 Tide has no Camel Stride.  
STATUS: NEW  

---

ACTION_ID: SDE-2026-10-27-005  
SOURCE_AUTOMATION: Dynamic Spell Discovery and Enemy Spell Evolution Designer  
TITLE: Do not restamp feat / challenge / #890 / #899 / #903 / #906 / #941 / #951 / #953 / #962 / #997 / #1004 / #1011 / #1017 / #1063 / #1073 / #1078 / #1080 / #1082 / #1132 / #1138 / #1139 / #1140 / #1143 / #1170 / #1177 / #1187 / #1189 extra doors  
CATEGORY: feat-challenge-boss  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Achievements still Doka-only (`admin.mo` 309–326). All 15 feat doors are claimed or leftover. `survivor` stays leftover (Last Ember / Last Ward). #890 already claimed `poise_cantor` / `floor_precentor` / `span_nine` / `court_floor_regent`. #899 already claimed `gaunt_mender` … `axis_cutter`. #941 already claimed `poise_mender` … `drift_gifter`. #997 already claimed `tally_mender` … `shove_gifter`. **#1073** already claimed `score_mender` … `summon_plater`. **#1138** already claimed `stave_mender` … `cast_plater`. **#1189** already claimed `sestet_mender` … `strike_plater`. #903 already claimed `jostle_subdeacon` / `peel_friar` / `dilate_organist` / `hood_recluse`. #951 already claimed `wick_exorcist` / `dry_nuncio` / `hearth_legate` / `must_preceptor`. #1004 already claimed `boot_subprior` / `purse_steward` / `tick_infirmarer` / `mute_notary`. **#1080** already claimed `slide_porter` / `both_capitular` / `heave_kitchener` / `parched_preacher`. **#1170** already claimed `trim_abbot` / `ready_commissary` / `lean_procurator` / `near_scholastic`. #953 already claimed `tally_cantor` / `prime_precentor` / `span_dec` / `court_prime_regent`. #1011 already claimed `score_cantor` / `snuff_precentor` / `span_hendeca` / `court_snuff_regent`. **#1063** already claimed `stave_cantor` / `dock_precentor` / `span_dodeca` / `court_dock_regent`. **#1132** already claimed `sestet_cantor` / `tierce_precentor` / `span_trideca` / `court_tierce_regent`. **#1177** already claimed `septet_cantor` / `quarte_precentor` / `span_tetradeca` / `court_quarte_regent`. #906 already claimed `rank_gallery` / `penta_nave` / `spike_aisle` / `swap_pulpit` / `mire_nave` / `rank_precentor` / `rank_fold_regent`. #962 already claimed `file_gallery` / `hexa_nave` / `lava_aisle` / `strike_pulpit` / `shock_nave` / `diag_precentor` / `far_fold_regent`. #1017 already claimed `ring_gallery` / `hepta_nave` / `frost_aisle` / `last_pulpit` / `rift_court` / `lane_precentor` / `leap_fold_regent`. **#1082** already claimed `tern_gallery` / `octa_nave` / `bog_aisle` / `spawn_pulpit` / `belt_nave` / `hoop_precentor` / `lane_fold_regent`. **#1143** already claimed `hook_gallery` / `nona_nave` / `mill_aisle` / `idle_pulpit` / `brier_nave` / `hook_precentor` / `hook_fold_regent`. Do not use `unstoppable` / `level_10`.  
SYSTEMS_AFFECTED: `AchievementConfig`; challenge persist; boss-clear persist  
RECOMMENDED_ACTION: Unique Wave-19 grants are observe+win / ELITE / `camel_gallery` only. Do not restamp `survivor` / `jackpot` / `leader_slayer` / `spell_master`. Do not restamp #890 extra doors. Do not restamp #899 / #941 / #997 / **#1073** / **#1138** / **#1189** family ids. Do not restamp #903 / #951 / #1004 / **#1080** / **#1139** / **#1170** extra doors. Do not restamp #953 / #1011 / **#1063** / **#1132** / **#1177** extra doors. Do not restamp #906 / #962 / #1017 / **#1082** / **#1143** rooms or Pack Rank / Rank Fold / Pack Diag / Far Fold / Pack Orth / Leap Fold / Pack Ring / Lane Fold / Pack Hook / Hook Fold doors. Do not overwrite **#1078** SDA 175–189 files. Do not overwrite **#1140** SDA 190–204 files. Do not overwrite **#1187** SDA 205–219 files. Pack Camel / Camel Fold never write `ownedSpellIds`. Court Snuff / Court Dock / Court Tierce / Court Quarte never write `ownedSpellIds`. CHOIR_SLIDE / CHOIR_BOTH / NAVE_HEAVE / CHOIR_PARCHED / CHOIR_TRIM / NAVE_READY / CHOIR_LEAN / NAVE_NEAR never write `ownedSpellIds`.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: SDE-2026-08-31-007; SDE-2026-10-26-005; SDE-2026-10-27-001  
REGRESSION_RISK: MEDIUM — remount must not double-grant; first MULTI child wins.  
VALIDATION_REQUIRED: No new `AchievementConfig` row. `survivor` still Doka-only.  
STATUS: NEW  

---

ACTION_ID: SDE-2026-10-27-006  
SOURCE_AUTOMATION: Dynamic Spell Discovery and Enemy Spell Evolution Designer  
TITLE: Add camel_gallery, deca_nave, cipher_aisle, hollow_pulpit, fuse_nave as tagged encounters  
CATEGORY: special-encounter  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Wave-18 specials (`hook_gallery` / `nona_nave` / `mill_aisle` / `idle_pulpit` / `brier_nave`) already own those tags. Wave-17 `tern_gallery` owns Tern Stride, not Camel Stride. Wave-16 `ring_gallery` owns Ring Stride, not Camel Stride. Wave-3 `long_gallery` owns Far Sting, not Deca Oath. `span_dec` owns Dec Span occupy-weight 10, not Deca Oath. `idle_pulpit` owns Idle Mark, not Hollow Mark. `brier_nave` owns Brier Skip, not Fuse Skip. `mill_aisle` owns Slide Reel, not Glyph Reel. `fog_of_war` is still an announce-only stub. Thorned Ground is a live map modifier (`mapModifiers.ts` 175–186); Brier Skip keys off pathLength 2, not occupancy. Glyph Tax is painted occupancy (`spell-glyph-tax`). Fuse Tile is painted delayed fuse (`spell-fuse-tile`).  
SYSTEMS_AFFECTED: encounter tag table; kit overlay  
RECOMMENDED_ACTION: Tag existing solvable layouts. All five teach via observe+win (Camel Stride / Deca Oath / Glyph Reel / Hollow Mark / Fuse Skip). Do not retag `hook_gallery` / `nona_nave` / `mill_aisle` / `idle_pulpit` / `brier_nave` / `tern_gallery` / `octa_nave` / `bog_aisle` / `spawn_pulpit` / `belt_nave` / `ring_gallery` / `file_gallery` / `orth_gallery` / `rank_gallery` / `knight_gallery` / `even_gallery` / `pair_gallery` / `hepta_nave` / `hexa_nave` / `penta_nave` / `span_six` / `span_dec` / `span_hendeca` / `span_dodeca` / `span_trideca` / `span_tetradeca` / `mire_nave` / `frost_aisle` / `lava_aisle` / `strike_pulpit` / `last_pulpit`. Do not consume #771 `ENC-BASH-*` / `ENC-DRY-*` / `ENC-HOOD-*` ids. Do not consume #826 / #885 / #957 / #1006 / **#1056** / **#1121** / **#1195** ENC-* ids. Do not consume #949 / #993 / **#1064** / **#1114** / **#1172** `WF-*`. Do not edit `mapGen.ts` algorithms. Do not invent a second recap. World portals stay locked while hostiles live. Twin Gate pads are not `map.portals`. Painted glyph-tax / fuse cells are spell occupancy, not `HazardTileType`. Thorned Ground extra is a map-modifier pathLength tax, not occupancy.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: SDE-2026-08-31-003; SDE-2026-10-26-006; SDE-2026-10-27-005  
REGRESSION_RISK: MEDIUM if a tag seals portals, skips `finalizePlayableLayout`, or treats glyph-tax cells as Twin Gate pads.  
VALIDATION_REQUIRED: Maps stay solvable. Defeat does not grant. `hook_gallery` still teaches Hook Stride, not Camel Stride. `tern_gallery` still teaches Tern Stride, not Camel Stride. `nona_nave` still teaches Nona Oath, not Deca Oath. `span_dec` still teaches Dec Span, not Deca Oath. `idle_pulpit` still teaches Idle Mark, not Hollow Mark. `brier_nave` still teaches Brier Skip, not Fuse Skip. `ENC-KNIGHT-01` still teaches Knight Stride, not Camel Stride.  
STATUS: NEW  

---

ACTION_ID: SDE-2026-10-27-007  
SOURCE_AUTOMATION: Dynamic Spell Discovery and Enemy Spell Evolution Designer  
TITLE: Observation edge cases for camel walk, glyph pull, hollow-mark paint, wide plate, and fizzle  
CATEGORY: discovery-pipeline  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Wave-1 observe is “cast spent AP.” Camel Stride observes on the **arm**, not the later walk. Hollow Mark observes on **paint**, not the turn-end detonate. Wide Plate observes on the **arm**, not the negated hit. Glyph Reel with no painted glyph-tax fizzles after AP — still observes. Pack Camel / Camel Fold never persist.  
SYSTEMS_AFFECTED: observe hook; recap; challenge HP/AP helpers  
RECOMMENDED_ACTION: Observe on Camel Stride / Deca Oath / Wide Plate / Fuse Skip / Cadence Quint / Watch Shave **arm**. Fizzle after AP spend still observes (Glyph Reel empty, Brick Levy with no adjacent barrier, Thin Gift leftover not 1/0, Prime Toll while leftover not 1/1). Illegal confirm (no AP) does not. Fuse Skip consume is the spell; an ignored fuse detonate is not a second observe. Thin Gift HP gain uses existing healUsed only when player-side HP actually increased. Brick Levy’s +1 walk MP is **not** `recordChallengeApSpend`. Watch Shave’s leftover-MP shave is not HP. `ENEMY_ONLY` / `BOSS_ONLY` never write `ownedSpellIds`. Player summons never observe.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: SDE-2026-08-31-002; SDE-2026-10-26-007; SDE-2026-10-27-004  
REGRESSION_RISK: HIGH if hollow-mark detonate double-observes, Pack Camel is granted, Glyph Reel dest is a world portal, or Camel Stride confirm succeeds on Hook/Tern dests.  
VALIDATION_REQUIRED: Wave-19 QA rows W19-1…W19-12, W19-20.  
STATUS: NEW  

---

ACTION_ID: SDE-2026-10-27-008  
SOURCE_AUTOMATION: Dynamic Spell Discovery and Enemy Spell Evolution Designer  
TITLE: Recap cards must list Wave-19 fields on the existing popup  
CATEGORY: discovery-ux  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `PostBattleRecap.tsx` 6–34 still has no `discoveredSpells`. Wave-1 SDE-003 owns the field; Wave-19 only requires the same card shape (name, role, AP, range, target, key effect, source enemy).  
SYSTEMS_AFFECTED: `BattleRecapData`; recap chrome  
RECOMMENDED_ACTION: Do not add a second popup. Stack up to 4 cards. Defeat never shows `NEW SPELL DISCOVERED`. Carved-stone / crimson only. In-battle cue remains `TECHNIQUE OBSERVED`.  
AUTONOMY: IMPLEMENT_AFTER_HUMAN  
DEPENDENCIES: SDE-2026-08-31-003; SDE-2026-08-31-004; SDE-2026-10-26-008  
REGRESSION_RISK: LOW for combat. MEDIUM if a second modal appears.  
VALIDATION_REQUIRED: One recap at `App.tsx` root.  
STATUS: NEW  
