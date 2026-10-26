# ACTION_IDs — 2026-10-26 Dynamic Spell Discovery & Enemy Spell Evolution

Durable ledger for implementers and the Report Action Orchestrator.  
Source of every record: Dynamic Spell Discovery and Enemy Spell Evolution Designer.  
Design contract: [`SPELL_DISCOVERY_ECOSYSTEM_2026-10-26.md`](./SPELL_DISCOVERY_ECOSYSTEM_2026-10-26.md).  
Wave-1 law (still blocking): [`SPELL_DISCOVERY_ECOSYSTEM_2026-08-31.md`](./SPELL_DISCOVERY_ECOSYSTEM_2026-08-31.md) and `SDE-2026-08-31-001`…`009`.  
Wave-2…17 generation stamps (still blocking): `SDE-2026-09-01-001`…`008` through `SDE-2026-10-25-001`…`008`.  
Do not implement gameplay from this file unless a later human or orchestrator explicitly picks an ID. This run ships **docs only**.

Sibling ledgers (do not re-open): tactical ids in PRs #120 / #185 / #282 / #342 / #411 / #463 / #525 / #563 / #636 / #695 / #726 / #787 / #849 / #890 / #953 / #1011 / **#1063** (Stave Mend … Court Dock; extra doors `stave_cantor` / `dock_precentor` / `span_dodeca` / `court_dock_regent`; **stamp as Wave 18 family CORE**) / **#1132** (Sestet Mend … Court Tierce; extra doors `sestet_cantor` / `tierce_precentor` / `span_trideca` / `court_tierce_regent`; **stamp as Wave 19 family CORE**); family sheets through **#840**, **#899**, **#941**, **#997**, **#1073** (`score_mender` … `summon_plater`), **#1138** (`stave_mender` … `cast_plater`); boss extras through **#836**, **#903**, **#951**, **#1004** (`boot_subprior` / `purse_steward` / `tick_infirmarer` / `mute_notary`) / **#1080** (`slide_porter` / `both_capitular` / `heave_kitchener` / `parched_preacher`; leftover Pair Slide / Both Mend / Heave Mend / Parched Mend; spectacular `CHOIR_SLIDE` / `CHOIR_BOTH` / `NAVE_HEAVE` / `CHOIR_PARCHED` stay `BOSS_ONLY`; do not remap `pair_usher` / `both_cantor` / `heave_cantor` / `parched_cantor`) / **#1139** (`stride_chancellor` / `dual_treasurer` / `imprint_archdeacon` / `damp_provost`; leftover Stride Keep / Dual Keep / Cadence Imprint / Damp Sting; spectacular `NAVE_STRIDE` / `NAVE_DUAL` / `CHOIR_IMPRINT` / `CHOIR_DAMP` stay `BOSS_ONLY`; do not remap `stride_bursar` / `dual_bursar` / `imprint_precentor` / `keep_bursar`; Rush Table Q); Wave-1…17 SDE ids including memory-reserved Wave 5 and still-open **#906** / **#962** / **#1017** / **#1082**; encounter rooms in **#771**, **#826**, **#885**, **#957**, **#1006**, **#1056**, **#1121** (Tally/Rank/Spike/Odd; `ENC-TEACH-18` … `ENC-RUSH-70` — teach **#997** verbs, not unique §11); world dynamics **#949** / **#993** / **#1064** / **#1114** (`WF-HAZ-PAIR_SEAM` … `WF-ENV-PAIR_DRAFT`; `WF-SPL-READY_TUTOR` never writes `ownedSpellIds`); SDA **#940** / **#1007** / **#1078** (175–189; unique `ACTION_IDS_SDA_2026-10-25.md` / `SPELL_ADMIN_DESIGN_2026-10-25.md` — do not overwrite) / **#1140** (190–204; unique `ACTION_IDS_SDA_2026-10-26.md` / `SPELL_ADMIN_DESIGN_2026-10-26.md` — do not overwrite); CDA **#942** / **#982** (CDA-030 freezes **shipping** Wave-15/16 live rows until Wave-1 gates; this ledger is sequential Generation 18 **design only**, not Wave 19); CDA-031 had not opened at this stamp; EBA **#1044** / **#1111** (zero extra doors); WDEAD **#1050** / **#1128**; roadmap **#870** / **#946** / **#998** / **#1074** / **#1124**. **SDE already won** `spell-cadence-floor` vs #890. Unique Wave-17 §11 stay extras until Wave 19. Unique §11 stay extras until Wave 20. Cadence Quad is remaining `n>4` → `4`; Cadence Tern is `n>3` → `3`; Cadence Cap is `n>2` → `2`; Cadence Floor is `n>1` → `1`; Cadence Rise is `1→2`; Cadence Prime is `0→1`; Cadence Snuff is `1→0`; Cadence Dock is `2→0`; Cadence Tierce is `3→0`. Wide Gift is leftover **AP ≥ 2 AND MP ≥ 1**; Gait Gift stays **AP ≥ 2 AND MP = 0**; Prime Gift stays **1/1**; Score Mend is both-body leftover **sum === 4 AND unequal**; Stave Mend is both-body leftover **sum === 5**; Sestet Mend is both-body leftover **sum === 6 AND unequal**.

**#1063** remains Wave-17 tactical. **Stamp it as Wave 18 family CORE** together with unique **#1017** Wave-16 verbs and do not clone its ids into unique §11. **SDE wins** unique leftover collisions (Wide Gift stays AP≥2/MP≥1, not Stave Mend; Cadence Quad stays `n>4→4`, not Cadence Dock; Thin Plate stays leftover 1/0, not Stave Hood / Prime Plate).

**#1080** remains Wave-18 extra doors `slide_porter` / `both_capitular` / `heave_kitchener` / `parched_preacher` — do not restamp. **#1139** remains Wave-19 extra doors `stride_chancellor` / `dual_treasurer` / `imprint_archdeacon` / `damp_provost` — do not restamp. No new `#137` ids. First grant wins Parched Mend vs Dry Gait leftover-MP=0 heal. Do not remap `pair_usher` / `both_cantor` / `heave_cantor` / `parched_cantor` / `stride_bursar` / `dual_bursar` / `imprint_precentor` / `keep_bursar`. **#1078** owns `SDA-2026-10-25-175`…`189` — do not re-file. **#1140** owns `SDA-2026-10-26-190`…`204` — do not re-file. Same-day **#1132** tactical / **#1138** families / **#1139** boss / **#1140** SDA / **#1121** ENC / **#1114** WF / **#1111** EBA / **#1128** WDEAD / **#1112** expansion / **#1124** roadmap opened after first stamp — stamp them; do not clone unique §11. CDA-031 had not opened at this stamp.

---

ACTION_ID: SDE-2026-10-26-001  
SOURCE_AUTOMATION: Dynamic Spell Discovery and Enemy Spell Evolution Designer  
TITLE: Do not land Wave-18 data before Wave-1 ownership split and G resolve through Wave 17  
CATEGORY: dependency  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: HEAD is still `0f5363f`. `WorldExploration.tsx` 2395–2440 still forces every `starterSpells` row `isBaseSpell: true`. `BattleRecapData` (`PostBattleRecap.tsx` 6–34) has no `discoveredSpells`. `buildEnemyKit(enemy.pieceType, currentMap.levelZone)` at WX 11920 still passes a `{ name, minLevel, maxLevel }` object. Wave-1 P0 through Wave-17 P0 are still NEW. Adding 19 ids to the always-owned catalog would make discovery worse. CDA-029 (#942) and CDA-030 (#982) still forbid shipping Wave-15/16 live rows until those gates exist.  
SYSTEMS_AFFECTED: hydrate; recap; catalog; kit resolve  
RECOMMENDED_ACTION: Keep Wave-18 definitions `STATUS: PROPOSED` until innate four + observe + `commitSpellDiscoveries` + numeric `G` exist. Do not append Wave-18 ids to `starterSpells`.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: SDE-2026-08-31-001; SDE-2026-08-31-002; SDE-2026-08-31-003; SDE-2026-09-01-001; SDE-2026-10-25-001  
REGRESSION_RISK: HIGH if ignored (catalog pre-own; G18 verbs on G=0 kits).  
VALIDATION_REQUIRED: New character still owns only the four innate ids after Wave-1 split. `generationMin: 18` absent at G≤17.  
STATUS: NEW  

---

ACTION_ID: SDE-2026-10-26-002  
SOURCE_AUTOMATION: Dynamic Spell Discovery and Enemy Spell Evolution Designer  
TITLE: Resolve a G≥18 extra pool slot with generationMin  
CATEGORY: pool-evolution  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Wave-17 SDE-2026-10-25-002 asked for a G≥17 extra slot. Wave 18 stamps `generationMin: 18` on unique family verbs. `Math.floor(levelZone)` is still NaN (`enemyAI.ts` 194–199; WX 11920). `computeAITier` still plateaus at label 10 (`combatMath.ts` 36–52).  
SYSTEMS_AFFECTED: `resolveEnemyKit`; family overlays  
RECOMMENDED_ACTION: After SDE-2026-10-25-002, at G≥18 allow one extra ADVANCED/RARE/ELITE with `generationMin ≤ G`. Never retire CORE or G17. Empty → `[physical_attack]`. Do not retune `pickEnemyLevelFromTiers`. No `G_max`. Wave-18 family CORE is **#1138** (unique **#1017** Wave-16 verbs minus Pack Orth / Leap Fold **and** **#1063**; Court Dock never owned; Stave Mend healer CORE only). Unique §11 stay extras, not that CORE. Unique Wave-17 §11 stay extras until Wave 19. **#1132** stamps as Wave **19** family CORE. Unique §11 stay extras until Wave 20. Do not clone those ids into unique §11.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: SDE-2026-10-25-002; SDE-2026-08-31-005; SDE-2026-08-31-006  
REGRESSION_RISK: MEDIUM — G=17 Tide must not receive Hook Stride; empty kit must stay armed.  
VALIDATION_REQUIRED: Peer pawn still has Strike. `generationMin: 18` absent at G≤17.  
STATUS: NEW  

---

ACTION_ID: SDE-2026-10-26-003  
SOURCE_AUTOMATION: Dynamic Spell Discovery and Enemy Spell Evolution Designer  
TITLE: Wire Wave-18 aiHints before assigning those ids  
CATEGORY: ai-compat  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: `inferArchetype` (`enemyAI.ts` 447–452) still maps any `healAmount > 0` to healer. Summon fallback still uses name (`enemyAI.ts` 217–224). New hints (`walk_hook_3_1`, `next_spell_exact_chebyshev_9`, `attract_toward_nearest_slide`, `bonus_if_share_hook_3_1_with_caster`, `detonate_if_turn_end_leftover_mp_equals_max`, `negate_hit_if_leftover_ap_eq_1_and_mp_eq_0`, `skip_thorned_ground_on_path_length_2`, `bonus_if_leftover_ap_ge_2_and_mp_ge_1`, `summon_walk_hook_3_1_ap_tax`, `heal_if_leftover_ap_ge_2_and_mp_ge_1`, `cap_remaining_cds_gt_4_to_4`, `tax_next_walk_if_leftover_ap_even_ge_2`, `tax_next_spell_if_adjacent_barrier`, `overwatch_snap_forbid_walker_next_walk`, `bonus_if_leftover_ap_eq_1_and_mp_eq_1`, `bonus_if_near_slide_occupancy`, `negate_hit_if_leftover_mp_equals_max`, `pack_walk_hook_3_1`, `fold_two_player_side_share_hook_3_1`) have no decide* branch.  
SYSTEMS_AFFECTED: `enemyAI.ts` decide*; kit resolve  
RECOMMENDED_ACTION: Implement each hint as a predicate on explicit flags / leftover AP-MP / Chebyshev dest permutation of (3,1) / painted conveyor occupancy / Thorned Ground pathLength / remaining CDs / barrier adjacency. Drop name fallbacks. Do not assign Wide Gift / Score Mend / Prime Gift / Stave Mend / Gait Gift to non-healer CORE. Do not assign Slide Reel when no painted conveyor exists. Do not assign Hook Fold outside boss AI. Missing hint → drop id, log once.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: SDE-2026-08-31-006; SDE-2026-09-01-003; SDE-2026-10-25-003  
REGRESSION_RISK: HIGH if Slide Reel dest is a world portal, Brier Skip ignores lava/spikes, Pack Hook is granted, Hook Stride confirm succeeds on Tern Stride dests `(±3,0)/(0,±3)` or knight `(2,1)`, or Hook Fold ships as owned.  
VALIDATION_REQUIRED: Hook Stride confirm fails on Chebyshev ≠ 3, on orthogonal dests, on diagonal dests, on `(3,2)`, and on knight dest. Pack Hook / Hook Fold never owned. Wide Gift absent from non-healer CORE.  
STATUS: NEW  

---

ACTION_ID: SDE-2026-10-26-004  
SOURCE_AUTOMATION: Dynamic Spell Discovery and Enemy Spell Evolution Designer  
TITLE: Implement Wave-18 definitions as data + pool rows  
CATEGORY: catalog-wave  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Unique §11 ids are absent from `spellData.ts` / `SPELL_ID_CATALOG` (32 live ids). #1017 reserved Ring Stride … Leap Fold. #1063 reserved Stave Mend … Court Dock. #1082 reserved Tern Stride … Lane Fold. Tombstone in Wave-18 §0.1 must not be reused. Every frontend `mpCost` is still 0 except the three sibling spenders once they land.  
SYSTEMS_AFFECTED: `spellData.ts`; `bossKits.ts` catalog; family `EnemyKit` pools  
RECOMMENDED_ACTION: Add unique SDE ids one at a time with full metadata. **Stamp** #1017 and #1063 ids onto Wave-18 family CORE (**#1138**) — do not clone them. **Stamp** #1132 ids onto Wave-19 family CORE — do not clone them. Unique Wave-17 §11 stay extras until Wave 19. Unique §11 stay `mpCost: 0` and stay extras until Wave 20. `spell-pack-hook` / `spell-hook-fold` never enter `ownedSpellIds`. Never `if (spell.name === …)`. Do not clone Tern Stride as Hook Stride, Knight Stride as Hook Stride, Ring Stride as Hook Stride, File Bite as Hook Bite, Diag Bite as Hook Bite, Mire Reel as Slide Reel, Slide Skip as Brier Skip, Pack Ring as Pack Hook, Cadence Tern as Cadence Quad, Cadence Dock as Cadence Quad, Cadence Tierce as Cadence Quad, Gait Gift as Wide Gift, Stave Mend as Wide Gift, Sestet Mend as Wide Gift, Prime Plate as Thin Plate, Thin Gait as Wide Sting, Cast Plate as Idle Plate, Lava Cut as Slide Cut, or Lane Fold as Hook Fold. Do not restamp #941 / #997 / **#1073** / **#1138** `ENEMY_ID`s, #951 / #1004 / **#1080** / **#1139** extra doors, #953 / #1011 / **#1063** / **#1132** extra doors, or #1017 / #1082 rooms / Pack Orth / Leap Fold / Pack Ring / Lane Fold doors. Do not mint `spell-even-plate` / `spell-score-gift` / `spell-stave-gift` / `spell-sestet-gift` / `spell-eleven-span` / `spell-octa-span` / `spell-twelve-span` / `spell-nona-span` / `spell-thirteen-span` / `spell-quint-mend` / `spell-hook-line` / `spell-cadence-trey` / `spell-mixed-turn`. Stamp **#1063** `spell-dodeca-span` and **#1132** `spell-trideca-span`; do not clone them.  
AUTONOMY: HUMAN_APPROVE — each id is a combat toy.  
DEPENDENCIES: SDE-2026-10-26-001; SDE-2026-10-26-002; SDE-2026-10-26-003  
REGRESSION_RISK: HIGH per id if wired by name, assigned to the wrong profile, or if Slide Reel dest is `map.portals`.  
VALIDATION_REQUIRED: `validateBossKits()` still passes. Typecheck clean. G=17 Tide has no Hook Stride.  
STATUS: NEW  

---

ACTION_ID: SDE-2026-10-26-005  
SOURCE_AUTOMATION: Dynamic Spell Discovery and Enemy Spell Evolution Designer  
TITLE: Do not restamp feat / challenge / #890 / #899 / #903 / #906 / #941 / #951 / #953 / #962 / #997 / #1004 / #1011 / #1017 / #1063 / #1073 / #1078 / #1080 / #1082 extra doors  
CATEGORY: feat-challenge-boss  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Achievements still Doka-only (`admin.mo` 309–326). All 15 feat doors are claimed or leftover. `survivor` stays leftover (Last Ember / Last Ward). #890 already claimed `poise_cantor` / `floor_precentor` / `span_nine` / `court_floor_regent`. #899 already claimed `gaunt_mender` … `axis_cutter`. #941 already claimed `poise_mender` … `drift_gifter`. #997 already claimed `tally_mender` … `shove_gifter`. **#1073** already claimed `score_mender` … `summon_plater`. #903 already claimed `jostle_subdeacon` / `peel_friar` / `dilate_organist` / `hood_recluse`. #951 already claimed `wick_exorcist` / `dry_nuncio` / `hearth_legate` / `must_preceptor`. #1004 already claimed `boot_subprior` / `purse_steward` / `tick_infirmarer` / `mute_notary`. **#1080** already claimed `slide_porter` / `both_capitular` / `heave_kitchener` / `parched_preacher`. #953 already claimed `tally_cantor` / `prime_precentor` / `span_dec` / `court_prime_regent`. #1011 already claimed `score_cantor` / `snuff_precentor` / `span_hendeca` / `court_snuff_regent`. **#1063** already claimed `stave_cantor` / `dock_precentor` / `span_dodeca` / `court_dock_regent`. #906 already claimed `rank_gallery` / `penta_nave` / `spike_aisle` / `swap_pulpit` / `mire_nave` / `rank_precentor` / `rank_fold_regent`. #962 already claimed `file_gallery` / `hexa_nave` / `lava_aisle` / `strike_pulpit` / `shock_nave` / `diag_precentor` / `far_fold_regent`. #1017 already claimed `ring_gallery` / `hepta_nave` / `frost_aisle` / `last_pulpit` / `rift_court` / `lane_precentor` / `leap_fold_regent`. **#1082** already claimed `tern_gallery` / `octa_nave` / `bog_aisle` / `spawn_pulpit` / `belt_nave` / `hoop_precentor` / `lane_fold_regent`. Do not use `unstoppable` / `level_10`.  
SYSTEMS_AFFECTED: `AchievementConfig`; challenge persist; boss-clear persist  
RECOMMENDED_ACTION: Unique Wave-18 grants are observe+win / ELITE / `hook_gallery` only. Do not restamp `survivor` / `jackpot` / `leader_slayer` / `spell_master`. Do not restamp #890 extra doors. Do not restamp #899 / #941 / #997 / **#1073** family ids. Do not restamp #903 / #951 / #1004 / **#1080** extra doors. Do not restamp #953 / #1011 / **#1063** extra doors. Do not restamp #906 / #962 / #1017 / **#1082** rooms or Pack Rank / Rank Fold / Pack Diag / Far Fold / Pack Orth / Leap Fold / Pack Ring / Lane Fold doors. Do not overwrite **#1078** SDA 175–189 files. Pack Hook / Hook Fold never write `ownedSpellIds`. Court Snuff / Court Dock never write `ownedSpellIds`. CHOIR_SLIDE / CHOIR_BOTH / NAVE_HEAVE / CHOIR_PARCHED never write `ownedSpellIds`.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: SDE-2026-08-31-007; SDE-2026-10-25-005; SDE-2026-10-26-001  
REGRESSION_RISK: MEDIUM — remount must not double-grant; first MULTI child wins.  
VALIDATION_REQUIRED: No new `AchievementConfig` row. `survivor` still Doka-only.  
STATUS: NEW  

---

ACTION_ID: SDE-2026-10-26-006  
SOURCE_AUTOMATION: Dynamic Spell Discovery and Enemy Spell Evolution Designer  
TITLE: Add hook_gallery, nona_nave, mill_aisle, idle_pulpit, brier_nave as tagged encounters  
CATEGORY: special-encounter  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Wave-17 specials (`tern_gallery` / `octa_nave` / `bog_aisle` / `spawn_pulpit` / `belt_nave`) already own those tags. Wave-16 `ring_gallery` owns Ring Stride, not Hook Stride. Wave-3 `long_gallery` owns Far Sting, not Nona Oath. `belt_nave` owns Slide Skip, not Slide Reel. `fog_of_war` is still an announce-only stub. Thorned Ground is a live map modifier (`mapModifiers.ts` 175–186); Brier Skip keys off pathLength 2, not occupancy.  
SYSTEMS_AFFECTED: encounter tag table; kit overlay  
RECOMMENDED_ACTION: Tag existing solvable layouts. All five teach via observe+win (Hook Stride / Nona Oath / Slide Reel / Idle Mark / Brier Skip). Do not retag `tern_gallery` / `octa_nave` / `bog_aisle` / `spawn_pulpit` / `belt_nave` / `ring_gallery` / `file_gallery` / `orth_gallery` / `rank_gallery` / `knight_gallery` / `even_gallery` / `pair_gallery` / `hepta_nave` / `hexa_nave` / `penta_nave` / `span_six` / `span_dec` / `span_hendeca` / `span_dodeca` / `mire_nave` / `frost_aisle` / `lava_aisle` / `strike_pulpit` / `last_pulpit`. Do not consume #771 `ENC-BASH-*` / `ENC-DRY-*` / `ENC-HOOD-*` ids. Do not consume #826 / #885 / #957 / #1006 / **#1056** / **#1121** ENC-* ids (`ENC-TEACH-18` / `ENC-RANK-01` / `ENC-SPIKE-02` / `ENC-MIRE-01` / `ENC-RUSH-67`…`70` teach **#997** verbs). Do not consume #949 / #993 / **#1064** / **#1114** `WF-*`. Do not edit `mapGen.ts` algorithms. Do not invent a second recap. World portals stay locked while hostiles live. Twin Gate pads are not `map.portals`. Painted conveyor cells are spell occupancy, not `HazardTileType`. Thorned Ground extra is a map-modifier pathLength tax, not occupancy.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: SDE-2026-08-31-003; SDE-2026-10-25-006; SDE-2026-10-26-005  
REGRESSION_RISK: MEDIUM if a tag seals portals, skips `finalizePlayableLayout`, or treats conveyor cells as Twin Gate pads.  
VALIDATION_REQUIRED: Maps stay solvable. Defeat does not grant. `tern_gallery` still teaches Tern Stride, not Hook Stride. `belt_nave` still teaches Slide Skip, not Slide Reel. `octa_nave` still teaches Octa Oath, not Nona Oath. `span_dodeca` still teaches Dodeca Span, not Nona Oath. `ENC-KNIGHT-01` still teaches Knight Stride, not Hook Stride.  
STATUS: NEW  

---

ACTION_ID: SDE-2026-10-26-007  
SOURCE_AUTOMATION: Dynamic Spell Discovery and Enemy Spell Evolution Designer  
TITLE: Observation edge cases for hook walk, slide pull, idle-mark paint, thin plate, and fizzle  
CATEGORY: discovery-pipeline  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Wave-1 observe is “cast spent AP.” Hook Stride observes on the **arm**, not the later walk. Idle Mark observes on **paint**, not the turn-end detonate. Thin Plate observes on the **arm**, not the negated hit. Slide Reel with no painted conveyor fizzles after AP — still observes. Pack Hook / Hook Fold never persist.  
SYSTEMS_AFFECTED: observe hook; recap; challenge HP/AP helpers  
RECOMMENDED_ACTION: Observe on Hook Stride / Nona Oath / Thin Plate / Brier Skip / Cadence Quad / Watch Bind **arm**. Fizzle after AP spend still observes (Slide Reel empty, Brick Fee with no adjacent barrier, Wide Gift leftover not AP≥2/MP≥1, Even Toll while leftover AP odd or 0/1). Illegal confirm (no AP) does not. Brier Skip consume is environmental if they then walk pathLength 2 on Thorned Ground — the skip is the spell, the ignored extra is not a second observe. Wide Gift HP gain uses existing healUsed only when player-side HP actually increased. `ENEMY_ONLY` / `BOSS_ONLY` never write `ownedSpellIds`. Player summons never observe.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: SDE-2026-08-31-002; SDE-2026-10-25-007; SDE-2026-10-26-004  
REGRESSION_RISK: HIGH if idle-mark detonate double-observes, Pack Hook is granted, Slide Reel dest is a world portal, or Hook Stride confirm succeeds on Tern Stride dests.  
VALIDATION_REQUIRED: Wave-18 QA rows W18-1…W18-12, W18-20.  
STATUS: NEW  

---

ACTION_ID: SDE-2026-10-26-008  
SOURCE_AUTOMATION: Dynamic Spell Discovery and Enemy Spell Evolution Designer  
TITLE: Recap cards must list Wave-18 fields on the existing popup  
CATEGORY: discovery-ux  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `PostBattleRecap.tsx` 6–34 still has no `discoveredSpells`. Wave-1 SDE-003 owns the field; Wave-18 only requires the same card shape (name, role, AP, range, target, key effect, source enemy).  
SYSTEMS_AFFECTED: `BattleRecapData`; recap chrome  
RECOMMENDED_ACTION: Do not add a second popup. Stack up to 4 cards. Defeat never shows `NEW SPELL DISCOVERED`. Carved-stone / crimson only. In-battle cue remains `TECHNIQUE OBSERVED`.  
AUTONOMY: IMPLEMENT_AFTER_HUMAN  
DEPENDENCIES: SDE-2026-08-31-003; SDE-2026-08-31-004; SDE-2026-10-25-008  
REGRESSION_RISK: LOW for combat. MEDIUM if a second modal appears.  
VALIDATION_REQUIRED: One recap at `App.tsx` root.  
STATUS: NEW  
