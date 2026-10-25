# ACTION_IDs — 2026-10-25 Dynamic Spell Discovery & Enemy Spell Evolution

Durable ledger for implementers and the Report Action Orchestrator.  
Source of every record: Dynamic Spell Discovery and Enemy Spell Evolution Designer.  
Design contract: [`SPELL_DISCOVERY_ECOSYSTEM_2026-10-25.md`](./SPELL_DISCOVERY_ECOSYSTEM_2026-10-25.md).  
Wave-1 law (still blocking): [`SPELL_DISCOVERY_ECOSYSTEM_2026-08-31.md`](./SPELL_DISCOVERY_ECOSYSTEM_2026-08-31.md) and `SDE-2026-08-31-001`…`009`.  
Wave-2…16 generation stamps (still blocking): `SDE-2026-09-01-001`…`008` through `SDE-2026-10-24-001`…`008`.  
Do not implement gameplay from this file unless a later human or orchestrator explicitly picks an ID. This run ships **docs only**.

Sibling ledgers (do not re-open): tactical ids in PRs #120 / #185 / #282 / #342 / #411 / #463 / #525 / #563 / #636 / #695 / #726 / #787 / #849 / #890 / #953 / **#1011** (Score Mend … Court Snuff; extra doors `score_cantor` / `snuff_precentor` / `span_hendeca` / `court_snuff_regent`; **stamp as Wave 17 family CORE**) / **#1063** (Stave Mend … Court Dock; extra doors `stave_cantor` / `dock_precentor` / `span_dodeca` / `court_dock_regent`; **stamp as Wave 18 family CORE**); family sheets through **#840**, **#899**, **#941**, **#997**, **#1073** (`score_mender` … `summon_plater`); boss extras through **#836**, **#903**, **#951**, **#1004** (`boot_subprior` / `purse_steward` / `tick_infirmarer` / `mute_notary`) / **#1080** (`slide_porter` / `both_capitular` / `heave_kitchener` / `parched_preacher`; leftover Pair Slide / Both Mend / Heave Mend / Parched Mend; spectacular `CHOIR_SLIDE` / `CHOIR_BOTH` / `NAVE_HEAVE` / `CHOIR_PARCHED` stay `BOSS_ONLY`; do not remap `pair_usher` / `both_cantor` / `heave_cantor` / `parched_cantor`); Wave-1…16 SDE ids including memory-reserved Wave 5 and still-open **#906** / **#962** / **#1017**; encounter rooms in **#771**, **#826**, **#885**, **#957**, **#1006**, **#1056**; world dynamics **#949** / **#993** / **#1064**; SDA **#940** / **#1007** / **#1078** (175–189; unique `ACTION_IDS_SDA_2026-10-25.md` / `SPELL_ADMIN_DESIGN_2026-10-25.md` — do not overwrite); CDA **#942** / **#982** (CDA-030 freezes **shipping** Wave-15/16 live rows until Wave-1 gates; this ledger is sequential Generation 17 **design only**, not Wave 18); CDA-031 had not opened at this stamp; EBA **#1044** (zero extra doors); WDEAD **#1050**; roadmap **#870** / **#946** / **#998** / **#1074**. **SDE already won** `spell-cadence-floor` vs #890. Unique Wave-16 §11 stay extras until Wave 18. Unique §11 stay extras until Wave 19. Cadence Tern is remaining `n>3` → `3`; Cadence Cap is `n>2` → `2`; Cadence Floor is `n>1` → `1`; Cadence Rise is `1→2`; Cadence Prime is `0→1`; Cadence Snuff is `1→0`; Cadence Dock is `2→0`. Gait Gift is leftover **AP ≥ 2 AND MP = 0**; Prime Gift stays **1/1**; Score Mend is both-body leftover **sum === 4 AND unequal**; Stave Mend is both-body leftover **sum === 5**.

**#1063** opened 00:15 UTC. **Stamp it as Wave 18 family CORE** and do not clone its ids into unique §11. **SDE wins** unique leftover collisions (Gait Gift stays AP≥2/MP=0, not Stave Mend; Cadence Tern stays `n>3→3`, not Cadence Dock; Prime Plate stays leftover 1/1, not Stave Hood).

**#1080** opened 00:23 UTC. **Stamp Wave-18 extra doors** `slide_porter` / `both_capitular` / `heave_kitchener` / `parched_preacher` — do not restamp. No new `#137` ids. First grant wins Parched Mend vs Dry Gait leftover-MP=0 heal. Do not remap `pair_usher` / `both_cantor` / `heave_cantor` / `parched_cantor`. **#1078** owns `SDA-2026-10-25-175`…`189` — do not re-file.

---

ACTION_ID: SDE-2026-10-25-001  
SOURCE_AUTOMATION: Dynamic Spell Discovery and Enemy Spell Evolution Designer  
TITLE: Do not land Wave-17 data before Wave-1 ownership split and G resolve through Wave 16  
CATEGORY: dependency  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: HEAD is still `0f5363f`. `WorldExploration.tsx` 2395–2440 still forces every `starterSpells` row `isBaseSpell: true`. `BattleRecapData` (`PostBattleRecap.tsx` 6–34) has no `discoveredSpells`. `buildEnemyKit(enemy.pieceType, currentMap.levelZone)` at WX 11920 still passes a `{ name, minLevel, maxLevel }` object. Wave-1 P0 through Wave-16 P0 are still NEW. Adding 19 ids to the always-owned catalog would make discovery worse. CDA-029 (#942) and CDA-030 (#982) still forbid shipping Wave-15/16 live rows until those gates exist.  
SYSTEMS_AFFECTED: hydrate; recap; catalog; kit resolve  
RECOMMENDED_ACTION: Keep Wave-17 definitions `STATUS: PROPOSED` until innate four + observe + `commitSpellDiscoveries` + numeric `G` exist. Do not append Wave-17 ids to `starterSpells`.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: SDE-2026-08-31-001; SDE-2026-08-31-002; SDE-2026-08-31-003; SDE-2026-09-01-001; SDE-2026-10-24-001  
REGRESSION_RISK: HIGH if ignored (catalog pre-own; G17 verbs on G=0 kits).  
VALIDATION_REQUIRED: New character still owns only the four innate ids after Wave-1 split. `generationMin: 17` absent at G≤16.  
STATUS: NEW  

---

ACTION_ID: SDE-2026-10-25-002  
SOURCE_AUTOMATION: Dynamic Spell Discovery and Enemy Spell Evolution Designer  
TITLE: Resolve a G≥17 extra pool slot with generationMin  
CATEGORY: pool-evolution  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Wave-16 SDE-2026-10-24-002 asked for a G≥16 extra slot. Wave 17 stamps `generationMin: 17` on unique family verbs. `Math.floor(levelZone)` is still NaN (`enemyAI.ts` 194–199; WX 11920). `computeAITier` still plateaus at label 10 (`combatMath.ts` 36–52).  
SYSTEMS_AFFECTED: `resolveEnemyKit`; family overlays  
RECOMMENDED_ACTION: After SDE-2026-10-24-002, at G≥17 allow one extra ADVANCED/RARE/ELITE with `generationMin ≤ G`. Never retire CORE or G16. Empty → `[physical_attack]`. Do not retune `pickEnemyLevelFromTiers`. No `G_max`. Wave-17 family CORE is unique **#962** Wave-15 verbs (minus Pack Diag / Far Fold / Lean Gift on non-healer kits) **and** **#1011** (Court Snuff never owned; Score Mend healer CORE only). **#1073** owns those CORE family ids (`score_mender` … `summon_plater`) — do not restamp. Unique §11 stay extras, not that CORE. Unique Wave-16 §11 stay extras until Wave 18. Unique §11 stay extras until Wave 19. Same-day tactical **#1063** stamps as Wave **18** family CORE — do not clone those ids into unique §11.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: SDE-2026-10-24-002; SDE-2026-08-31-005; SDE-2026-08-31-006  
REGRESSION_RISK: MEDIUM — G=16 Tide must not receive Tern Stride; empty kit must stay armed.  
VALIDATION_REQUIRED: Peer pawn still has Strike. `generationMin: 17` absent at G≤16.  
STATUS: NEW  

---

ACTION_ID: SDE-2026-10-25-003  
SOURCE_AUTOMATION: Dynamic Spell Discovery and Enemy Spell Evolution Designer  
TITLE: Wire Wave-17 aiHints before assigning those ids  
CATEGORY: ai-compat  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: `inferArchetype` (`enemyAI.ts` 447–452) still maps any `healAmount > 0` to healer. Summon fallback still uses name (`enemyAI.ts` 217–224). New hints (`walk_chebyshev_3_orthogonal`, `next_spell_exact_chebyshev_8`, `attract_toward_nearest_mire`, `bonus_if_share_diagonal_with_caster`, `detonate_if_summon_spawned_on_cell`, `negate_hit_if_leftover_ap_eq_1_and_mp_eq_1`, `skip_slide_tile_push_one_tile`, `bonus_if_leftover_mp_equals_max`, `summon_walk_diagonal_ap_tax`, `heal_if_leftover_ap_ge_2_and_mp_eq_0`, `cap_remaining_cds_gt_3_to_3`, `tax_next_walk_if_leftover_ap_odd`, `tax_next_walk_if_adjacent_barrier`, `overwatch_snap_tax_walker_next_spell`, `bonus_if_leftover_ap_eq_1_and_mp_eq_0`, `bonus_if_near_lava_occupancy`, `next_strike_damage_zero`, `pack_walk_chebyshev_2_not_knight`, `fold_two_player_side_share_axis_chebyshev_3`) have no decide* branch.  
SYSTEMS_AFFECTED: `enemyAI.ts` decide*; kit resolve  
RECOMMENDED_ACTION: Implement each hint as a predicate on explicit flags / leftover AP-MP / Chebyshev dest / painted mire occupancy / shared diagonal / summon-spawn paint / remaining CDs / conveyor occupancy / lava occupancy / barrier adjacency. Drop name fallbacks. Do not assign Gait Gift / Score Mend / Prime Gift / Stave Mend to non-healer CORE. Do not assign Mire Reel when no painted mire exists. Do not assign Lane Fold outside boss AI. Missing hint → drop id, log once.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: SDE-2026-08-31-006; SDE-2026-09-01-003; SDE-2026-10-24-003  
REGRESSION_RISK: HIGH if Mire Reel dest is a world portal, Slide Skip ignores lava/spikes, Pack Ring is granted, Tern Stride confirm succeeds on a diagonal dest, or Lane Fold ships as owned.  
VALIDATION_REQUIRED: Tern Stride confirm fails on Chebyshev ≠ 3, on diagonal dests, and on knight dest. Pack Ring / Lane Fold never owned. Gait Gift absent from non-healer CORE.  
STATUS: NEW  

---

ACTION_ID: SDE-2026-10-25-004  
SOURCE_AUTOMATION: Dynamic Spell Discovery and Enemy Spell Evolution Designer  
TITLE: Implement Wave-17 definitions as data + pool rows  
CATEGORY: catalog-wave  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Unique §11 ids are absent from `spellData.ts` / `SPELL_ID_CATALOG` (32 live ids). #962 reserved File Stride … Far Fold. #1011 reserved Score Mend … Court Snuff. #1017 reserved Ring Stride … Leap Fold. Tombstone in Wave-17 §0.1 must not be reused. Every frontend `mpCost` is still 0 except the three sibling spenders once they land.  
SYSTEMS_AFFECTED: `spellData.ts`; `bossKits.ts` catalog; family `EnemyKit` pools  
RECOMMENDED_ACTION: Add unique SDE ids one at a time with full metadata. **Stamp** #962 and #1011 ids onto Wave-17 family CORE — do not clone them. **Stamp** unique Wave-16 §11 **and** **#1063** as Wave **18** family CORE — do not clone Ring Stride / Cadence Cap / Stave Mend / Cadence Dock / Dodeca Span. Unique §11 stay `mpCost: 0` and stay extras until Wave 19. `spell-pack-ring` / `spell-lane-fold` never enter `ownedSpellIds`. Never `if (spell.name === …)`. Do not clone Ring Stride as Tern Stride, File Stride as Tern Stride, Orth Stride as Tern Stride, File Bite as Diag Bite, Rank Bite as Diag Bite, Mire Skip as Slide Skip, Rift Skip as Slide Skip, Pack Orth as Pack Ring, Cadence Cap as Cadence Tern, Cadence Snuff as Cadence Tern, Cadence Dock as Cadence Tern, Prime Gift as Gait Gift, Score Mend as Gait Gift, Stave Mend as Gait Gift, Fresh Sting as Capped Sting, Cast Plate as Strike Plate, Rime Cut as Lava Cut, or Leap Fold as Lane Fold. Do not restamp #941 / #997 / **#1073** `ENEMY_ID`s, #951 / #1004 / **#1080** extra doors, #953 extra doors, #1011 extra doors, **#1063** extra doors, or #1017 rooms / Pack Orth / Leap Fold doors. Do not mint `spell-even-plate` / `spell-score-gift` / `spell-stave-gift` / `spell-eleven-span` / `spell-octa-span` / `spell-twelve-span` / `spell-quint-mend`. Stamp **#1063** `spell-dodeca-span`; do not clone it.  
AUTONOMY: HUMAN_APPROVE — each id is a combat toy.  
DEPENDENCIES: SDE-2026-10-25-001; SDE-2026-10-25-002; SDE-2026-10-25-003  
REGRESSION_RISK: HIGH per id if wired by name, assigned to the wrong profile, or if Mire Reel dest is `map.portals`.  
VALIDATION_REQUIRED: `validateBossKits()` still passes. Typecheck clean. G=16 Tide has no Tern Stride.  
STATUS: NEW  

---

ACTION_ID: SDE-2026-10-25-005  
SOURCE_AUTOMATION: Dynamic Spell Discovery and Enemy Spell Evolution Designer  
TITLE: Do not restamp feat / challenge / #890 / #899 / #903 / #906 / #941 / #951 / #953 / #962 / #997 / #1004 / #1011 / #1017 / #1063 / #1073 / #1078 / #1080 extra doors  
CATEGORY: feat-challenge-boss  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Achievements still Doka-only (`admin.mo` 309–326). All 15 feat doors are claimed or leftover. `survivor` stays leftover (Last Ember / Last Ward). #890 already claimed `poise_cantor` / `floor_precentor` / `span_nine` / `court_floor_regent`. #899 already claimed `gaunt_mender` … `axis_cutter`. #941 already claimed `poise_mender` … `drift_gifter`. #997 already claimed `tally_mender` … `shove_gifter`. **#1073** already claimed `score_mender` … `summon_plater`. #903 already claimed `jostle_subdeacon` / `peel_friar` / `dilate_organist` / `hood_recluse`. #951 already claimed `wick_exorcist` / `dry_nuncio` / `hearth_legate` / `must_preceptor`. #1004 already claimed `boot_subprior` / `purse_steward` / `tick_infirmarer` / `mute_notary`. **#1080** already claimed `slide_porter` / `both_capitular` / `heave_kitchener` / `parched_preacher` (leftover Pair Slide / Both Mend / Heave Mend / Parched Mend; `CHOIR_SLIDE` / `CHOIR_BOTH` / `NAVE_HEAVE` / `CHOIR_PARCHED` stay `BOSS_ONLY`; do not remap `pair_usher` / `both_cantor` / `heave_cantor` / `parched_cantor`). #953 already claimed `tally_cantor` / `prime_precentor` / `span_dec` / `court_prime_regent`. #1011 already claimed `score_cantor` / `snuff_precentor` / `span_hendeca` / `court_snuff_regent`. **#1063** already claimed `stave_cantor` / `dock_precentor` / `span_dodeca` / `court_dock_regent`. #906 already claimed `rank_gallery` / `penta_nave` / `spike_aisle` / `swap_pulpit` / `mire_nave` / `rank_precentor` / `rank_fold_regent`. #962 already claimed `file_gallery` / `hexa_nave` / `lava_aisle` / `strike_pulpit` / `shock_nave` / `diag_precentor` / `far_fold_regent`. #1017 already claimed `ring_gallery` / `hepta_nave` / `frost_aisle` / `last_pulpit` / `rift_court` / `lane_precentor` / `leap_fold_regent`. Do not use `unstoppable` / `level_10`.  
SYSTEMS_AFFECTED: `AchievementConfig`; challenge persist; boss-clear persist  
RECOMMENDED_ACTION: Unique Wave-17 grants are observe+win / ELITE / `tern_gallery` only. Do not restamp `survivor` / `jackpot` / `leader_slayer` / `spell_master`. Do not restamp #890 extra doors. Do not restamp #899 / #941 / #997 / **#1073** family ids. Do not restamp #903 / #951 / #1004 / **#1080** extra doors. Do not restamp #953 / #1011 / **#1063** extra doors. Do not restamp #906 / #962 / #1017 rooms or Pack Rank / Rank Fold / Pack Diag / Far Fold / Pack Orth / Leap Fold doors. Do not overwrite **#1078** SDA 175–189 files. Pack Ring / Lane Fold never write `ownedSpellIds`. Court Snuff / Court Dock never write `ownedSpellIds`. CHOIR_SLIDE / CHOIR_BOTH / NAVE_HEAVE / CHOIR_PARCHED never write `ownedSpellIds`.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: SDE-2026-08-31-007; SDE-2026-10-24-005; SDE-2026-10-25-001  
REGRESSION_RISK: MEDIUM — remount must not double-grant; first MULTI child wins.  
VALIDATION_REQUIRED: No new `AchievementConfig` row. `survivor` still Doka-only.  
STATUS: NEW  

---

ACTION_ID: SDE-2026-10-25-006  
SOURCE_AUTOMATION: Dynamic Spell Discovery and Enemy Spell Evolution Designer  
TITLE: Add tern_gallery, octa_nave, bog_aisle, spawn_pulpit, belt_nave as tagged encounters  
CATEGORY: special-encounter  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Wave-16 specials (`ring_gallery` / `hepta_nave` / `frost_aisle` / `last_pulpit` / `rift_court`) already own those tags. Wave-14 `mire_nave` owns Mire Skip, not Mire Reel. Wave-15 `lava_aisle` owns Lava Reel, not Lava Cut. Wave-3 `long_gallery` owns Far Sting, not Tern Stride. `fog_of_war` is still an announce-only stub.  
SYSTEMS_AFFECTED: encounter tag table; kit overlay  
RECOMMENDED_ACTION: Tag existing solvable layouts. All five teach via observe+win (Tern Stride / Octa Oath / Mire Reel / Summon Mark / Slide Skip). Do not retag `ring_gallery` / `file_gallery` / `orth_gallery` / `rank_gallery` / `knight_gallery` / `even_gallery` / `pair_gallery` / `hepta_nave` / `hexa_nave` / `penta_nave` / `span_six` / `span_dec` / `span_hendeca` / `span_dodeca` / `mire_nave` / `frost_aisle` / `lava_aisle` / `strike_pulpit` / `last_pulpit`. Do not consume #771 `ENC-BASH-*` / `ENC-DRY-*` / `ENC-HOOD-*` ids. Do not consume #826 / #885 / #957 / #1006 / **#1056** ENC-* ids. Do not consume #949 / #993 / **#1064** `WF-*`. Do not edit `mapGen.ts` algorithms. Do not invent a second recap. World portals stay locked while hostiles live. Twin Gate pads are not `map.portals`. Painted mire / conveyor cells are spell occupancy, not `HazardTileType`.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: SDE-2026-08-31-003; SDE-2026-10-24-006; SDE-2026-10-25-005  
REGRESSION_RISK: MEDIUM if a tag seals portals, skips `finalizePlayableLayout`, or treats mire cells as Twin Gate pads.  
VALIDATION_REQUIRED: Maps stay solvable. Defeat does not grant. `ring_gallery` still teaches Ring Stride, not Tern Stride. `mire_nave` still teaches Mire Skip, not Mire Reel. `hepta_nave` still teaches Hepta Oath, not Octa Oath. `span_hendeca` still teaches Hendeca Span, not Octa Oath. `span_dodeca` still teaches Dodeca Span, not Octa Oath. `ENC-KNIGHT-01` still teaches Knight Stride, not Tern Stride.  
STATUS: NEW  

---

ACTION_ID: SDE-2026-10-25-007  
SOURCE_AUTOMATION: Dynamic Spell Discovery and Enemy Spell Evolution Designer  
TITLE: Observation edge cases for tern walk, mire pull, summon-spawn paint, prime plate, and fizzle  
CATEGORY: discovery-pipeline  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Wave-1 observe is “cast spent AP.” Tern Stride observes on the **arm**, not the later walk. Summon Mark observes on **paint**, not the summon-spawn detonate. Prime Plate observes on the **arm**, not the negated hit. Mire Reel with no painted mire fizzles after AP — still observes. Pack Ring / Lane Fold never persist.  
SYSTEMS_AFFECTED: observe hook; recap; challenge HP/AP helpers  
RECOMMENDED_ACTION: Observe on Tern Stride / Octa Oath / Prime Plate / Slide Skip / Cadence Tern / Watch Tax **arm**. Fizzle after AP spend still observes (Mire Reel empty, Brick Tax with no adjacent barrier, Gait Gift leftover not AP≥2/MP=0, Odd Toll while leftover AP even). Illegal confirm (no AP) does not. Slide Skip consume is environmental if they then walk onto a conveyor — the skip is the spell, the ignored push is not a second observe. Gait Gift HP gain uses existing healUsed only when player-side HP actually increased. `ENEMY_ONLY` / `BOSS_ONLY` never write `ownedSpellIds`. Player summons never observe.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: SDE-2026-08-31-002; SDE-2026-10-24-007; SDE-2026-10-25-004  
REGRESSION_RISK: HIGH if summon-spawn detonate double-observes, Pack Ring is granted, Mire Reel dest is a world portal, or Tern Stride confirm succeeds on a diagonal dest.  
VALIDATION_REQUIRED: Wave-17 QA rows W17-1…W17-12, W17-20.  
STATUS: NEW  

---

ACTION_ID: SDE-2026-10-25-008  
SOURCE_AUTOMATION: Dynamic Spell Discovery and Enemy Spell Evolution Designer  
TITLE: Recap cards must list Wave-17 fields on the existing popup  
CATEGORY: discovery-ux  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `PostBattleRecap.tsx` 6–34 still has no `discoveredSpells`. Wave-1 SDE-003 owns the field; Wave-17 only requires the same card shape (name, role, AP, range, target, key effect, source enemy).  
SYSTEMS_AFFECTED: `BattleRecapData`; recap chrome  
RECOMMENDED_ACTION: Do not add a second popup. Stack up to 4 cards. Defeat never shows `NEW SPELL DISCOVERED`. Carved-stone / crimson only. In-battle cue remains `TECHNIQUE OBSERVED`.  
AUTONOMY: IMPLEMENT_AFTER_HUMAN  
DEPENDENCIES: SDE-2026-08-31-003; SDE-2026-08-31-004; SDE-2026-10-24-008  
REGRESSION_RISK: LOW for combat. MEDIUM if a second modal appears.  
VALIDATION_REQUIRED: One recap at `App.tsx` root.  
STATUS: NEW  
