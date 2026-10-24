# ACTION_IDs — 2026-10-24 Dynamic Spell Discovery & Enemy Spell Evolution

Durable ledger for implementers and the Report Action Orchestrator.  
Source of every record: Dynamic Spell Discovery and Enemy Spell Evolution Designer.  
Design contract: [`SPELL_DISCOVERY_ECOSYSTEM_2026-10-24.md`](./SPELL_DISCOVERY_ECOSYSTEM_2026-10-24.md).  
Wave-1 law (still blocking): [`SPELL_DISCOVERY_ECOSYSTEM_2026-08-31.md`](./SPELL_DISCOVERY_ECOSYSTEM_2026-08-31.md) and `SDE-2026-08-31-001`…`009`.  
Wave-2…15 generation stamps (still blocking): `SDE-2026-09-01-001`…`008` through `SDE-2026-10-23-001`…`008`.  
Do not implement gameplay from this file unless a later human or orchestrator explicitly picks an ID. This run ships **docs only**.

Sibling ledgers (do not re-open): tactical ids in PRs #120 / #185 / #282 / #342 / #411 / #463 / #525 / #563 / #636 / #695 / #726 / #787 / #849 / #890 / **#953** (Tally Mend … Court Prime; extra doors `tally_cantor` / `prime_precentor` / `span_dec` / `court_prime_regent`; **stamp as Wave 16 family CORE**) / **#1011** (Score Mend … Court Snuff; extra doors `score_cantor` / `snuff_precentor` / `span_hendeca` / `court_snuff_regent`; **stamp as Wave 17 family CORE**); family sheets through **#840**, **#899**, **#941**, and same-day **#997** (`tally_mender` … `shove_gifter`); boss extras through **#836**, **#903**, **#951** (`wick_exorcist` / `dry_nuncio` / `hearth_legate` / `must_preceptor`), and same-day **#1004** (`boot_subprior` / `purse_steward` / `tick_infirmarer` / `mute_notary`); Wave-1…15 SDE ids including memory-reserved Wave 5 and still-open **#906** / **#962**; encounter rooms in **#771**, **#826**, **#885**, **#957**, and same-day **#1006**; world dynamics **#949** / **#993**; SDA **#940** / **#1007**; CDA **#942** / **#982** (CDA-030 freezes **shipping** Wave-15/16 live rows until Wave-1 gates; this ledger is sequential Generation 16 **design only**, not Wave 17); roadmap **#870** / **#946** / **#998**. **SDE already won** `spell-cadence-floor` vs #890. Wave 15 unique §11 stay extras until Wave 17. Unique §11 stay extras until Wave 18. Cadence Cap is remaining `n>2` → `2`; Cadence Floor is `n>1` → `1`; Cadence Rise is `1→2`; Cadence Prime is `0→1`; Cadence Snuff is `1→0`. Prime Gift is leftover **1/1**; Score Mend is both-body leftover **sum === 4 AND unequal**.

---

ACTION_ID: SDE-2026-10-24-001  
SOURCE_AUTOMATION: Dynamic Spell Discovery and Enemy Spell Evolution Designer  
TITLE: Do not land Wave-16 data before Wave-1 ownership split and G resolve through Wave 15  
CATEGORY: dependency  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: HEAD is still `0f5363f`. `WorldExploration.tsx` 2395–2440 still forces every `starterSpells` row `isBaseSpell: true`. `BattleRecapData` (`PostBattleRecap.tsx` 6–34) has no `discoveredSpells`. `buildEnemyKit(enemy.pieceType, currentMap.levelZone)` at WX 11920 still passes a `{ name, minLevel, maxLevel }` object. Wave-1 P0 through Wave-15 P0 are still NEW. Adding 19 ids to the always-owned catalog would make discovery worse. CDA-029 (#942) and CDA-030 (#982) still forbid shipping Wave-15/16 live rows until those gates exist.  
SYSTEMS_AFFECTED: hydrate; recap; catalog; kit resolve  
RECOMMENDED_ACTION: Keep Wave-16 definitions `STATUS: PROPOSED` until innate four + observe + `commitSpellDiscoveries` + numeric `G` exist. Do not append Wave-16 ids to `starterSpells`.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: SDE-2026-08-31-001; SDE-2026-08-31-002; SDE-2026-08-31-003; SDE-2026-09-01-001; SDE-2026-10-23-001  
REGRESSION_RISK: HIGH if ignored (catalog pre-own; G16 verbs on G=0 kits).  
VALIDATION_REQUIRED: New character still owns only the four innate ids after Wave-1 split. `generationMin: 16` absent at G≤15.  
STATUS: NEW  

---

ACTION_ID: SDE-2026-10-24-002  
SOURCE_AUTOMATION: Dynamic Spell Discovery and Enemy Spell Evolution Designer  
TITLE: Resolve a G≥16 extra pool slot with generationMin  
CATEGORY: pool-evolution  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Wave-15 SDE-2026-10-23-002 asked for a G≥15 extra slot. Wave 16 stamps `generationMin: 16` on unique family verbs. `Math.floor(levelZone)` is still NaN (`enemyAI.ts` 194–199; WX 11920). `computeAITier` still plateaus at label 10 (`combatMath.ts` 36–52).  
SYSTEMS_AFFECTED: `resolveEnemyKit`; family overlays  
RECOMMENDED_ACTION: After SDE-2026-10-23-002, at G≥16 allow one extra ADVANCED/RARE/ELITE with `generationMin ≤ G`. Never retire CORE or G15. Empty → `[physical_attack]`. Do not retune `pickEnemyLevelFromTiers`. No `G_max`. Wave-16 family CORE is unique **#906** Wave-14 verbs (minus Equal Gift / Pack Rank / Rank Fold / Cadence Floor on non-healer / closed kits) **and** **#953** (Court Prime never owned; Tally Mend healer CORE only) — same-day **#997** already authored those CORE rows. Unique §11 stay extras, not that CORE. Unique Wave-15 §11 stay extras until Wave 17. Unique §11 stay extras until Wave 18. Same-day **#1011** stamps as Wave **17** family CORE (Score Mend healer CORE only; Court Snuff never owned) — do not clone those ids into unique §11.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: SDE-2026-10-23-002; SDE-2026-08-31-005; SDE-2026-08-31-006  
REGRESSION_RISK: MEDIUM — G=15 Tide must not receive Ring Stride; empty kit must stay armed.  
VALIDATION_REQUIRED: Peer pawn still has Strike. `generationMin: 16` absent at G≤15.  
STATUS: NEW  

---

ACTION_ID: SDE-2026-10-24-003  
SOURCE_AUTOMATION: Dynamic Spell Discovery and Enemy Spell Evolution Designer  
TITLE: Wire Wave-16 aiHints before assigning those ids  
CATEGORY: ai-compat  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: `inferArchetype` (`enemyAI.ts` 447–452) still maps any `healAmount > 0` to healer. Summon fallback still uses name (`enemyAI.ts` 217–224). New hints (`walk_chebyshev_2_not_knight`, `next_spell_exact_chebyshev_7`, `attract_toward_nearest_rime`, `bonus_if_share_rank_with_caster`, `detonate_if_last_ap_on_cell`, `negate_hit_if_leftover_ap_even_ge2_and_mp_even_ge2`, `skip_void_rift_tax_one_tile`, `bonus_if_leftover_ap_equals_max`, `summon_walk_off_file_ap_tax`, `heal_if_leftover_ap_eq_1_and_mp_eq_1`, `cap_remaining_cds_gt_2_to_2`, `tax_next_walk_if_leftover_mp_eq_0`, `cannot_walk_if_adjacent_barrier`, `overwatch_snap_steal_walker_mp`, `bonus_if_leftover_mp_even_ge2`, `bonus_if_near_rime_occupancy`, `next_non_strike_spell_damage_zero`, `pack_walk_orthogonal_only`, `fold_two_player_side_chebyshev_3`) have no decide* branch.  
SYSTEMS_AFFECTED: `enemyAI.ts` decide*; kit resolve  
RECOMMENDED_ACTION: Implement each hint as a predicate on explicit flags / leftover AP-MP / Chebyshev dest / ice occupancy / shared rank / last-AP paint / remaining CDs / Void Rift occupancy / barrier adjacency. Drop name fallbacks. Do not assign Prime Gift / Cast Plate to non-healer CORE. Do not assign Rime Reel when no ice exists. Do not assign Leap Fold outside boss AI. Missing hint → drop id, log once.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: SDE-2026-08-31-006; SDE-2026-09-01-003; SDE-2026-10-23-003  
REGRESSION_RISK: HIGH if Rime Reel pulls onto a world portal, Rift Skip ignores lava/spikes, Pack Orth is granted, Ring Stride confirm succeeds on a knight (2,1) dest, or Leap Fold ships as owned.  
VALIDATION_REQUIRED: Ring Stride confirm fails on knight dest and on Chebyshev ≠ 2. Pack Orth / Leap Fold never owned. Prime Gift absent from non-healer CORE.  
STATUS: NEW  

---

ACTION_ID: SDE-2026-10-24-004  
SOURCE_AUTOMATION: Dynamic Spell Discovery and Enemy Spell Evolution Designer  
TITLE: Implement Wave-16 definitions as data + pool rows  
CATEGORY: catalog-wave  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Unique §11 ids are absent from `spellData.ts` / `SPELL_ID_CATALOG` (32 live ids). #906 reserved Rank Stride … Rank Fold. #953 reserved Tally Mend … Court Prime. #962 reserved File Stride … Far Fold. **#1011** reserved Score Mend … Court Snuff. Tombstone in Wave-16 §0.1 must not be reused. Every frontend `mpCost` is still 0 except the three sibling spenders once they land.  
SYSTEMS_AFFECTED: `spellData.ts`; `bossKits.ts` catalog; family `EnemyKit` pools  
RECOMMENDED_ACTION: Add unique SDE ids one at a time with full metadata. **Stamp** #906 and #953 ids onto Wave-16 family CORE — **#997 already owns those CORE rows**; do not clone them. **Stamp** unique Wave-15 §11 as Wave **17** extras — do not clone File Stride / Cadence Rise. **Stamp** #1011 ids onto Wave-17 family CORE — do not clone Score Mend / Cadence Snuff / Hendeca Span / Duel Turn. Unique §11 stay `mpCost: 0` and stay extras until Wave 18. `spell-pack-orth` / `spell-leap-fold` never enter `ownedSpellIds`. Never `if (spell.name === …)`. Do not clone Rank Stride as Ring Stride, File Bite as Rank Bite, Rime Skip as Rift Skip, Pack Diag as Pack Orth, Cadence Floor as Cadence Cap, Cadence Snuff as Cadence Cap, Score Mend as Prime Gift, or Spike Cut as Rime Cut. Do not restamp #941 / #997 `ENEMY_ID`s, #951 / #1004 extra doors, #953 extra doors, or **#1011** extra doors (`score_cantor` / `snuff_precentor` / `span_hendeca` / `court_snuff_regent`). Do not mint `spell-even-plate` / `spell-score-gift` / `spell-eleven-span`.  
AUTONOMY: HUMAN_APPROVE — each id is a combat toy.  
DEPENDENCIES: SDE-2026-10-24-001; SDE-2026-10-24-002; SDE-2026-10-24-003  
REGRESSION_RISK: HIGH per id if wired by name, assigned to the wrong profile, or if Rime Reel dest is `map.portals`.  
VALIDATION_REQUIRED: `validateBossKits()` still passes. Typecheck clean. G=15 Tide has no Ring Stride.  
STATUS: NEW  

---

ACTION_ID: SDE-2026-10-24-005  
SOURCE_AUTOMATION: Dynamic Spell Discovery and Enemy Spell Evolution Designer  
TITLE: Do not restamp feat / challenge / #890 / #899 / #903 / #906 / #941 / #951 / #953 / #962 / #997 / #1004 / #1011 extra doors  
CATEGORY: feat-challenge-boss  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Achievements still Doka-only (`admin.mo` 309–326). All 15 feat doors are claimed or leftover. `survivor` stays leftover (Last Ember / Last Ward). #890 already claimed `poise_cantor` / `floor_precentor` / `span_nine` / `court_floor_regent`. #899 already claimed `gaunt_mender` … `axis_cutter`. #941 already claimed `poise_mender` … `drift_gifter`. #997 already claimed `tally_mender` … `shove_gifter`. #903 already claimed `jostle_subdeacon` / `peel_friar` / `dilate_organist` / `hood_recluse`. #951 already claimed `wick_exorcist` / `dry_nuncio` / `hearth_legate` / `must_preceptor`. #1004 already claimed `boot_subprior` / `purse_steward` / `tick_infirmarer` / `mute_notary`. #953 already claimed `tally_cantor` / `prime_precentor` / `span_dec` / `court_prime_regent`. **#1011** already claimed `score_cantor` / `snuff_precentor` / `span_hendeca` / `court_snuff_regent`. #906 already claimed `rank_gallery` / `penta_nave` / `spike_aisle` / `swap_pulpit` / `mire_nave` / `rank_precentor` / `rank_fold_regent`. #962 already claimed `file_gallery` / `hexa_nave` / `lava_aisle` / `strike_pulpit` / `shock_nave` / `diag_precentor` / `far_fold_regent`. Do not use `unstoppable` / `level_10`.  
SYSTEMS_AFFECTED: `AchievementConfig`; challenge persist; boss-clear persist  
RECOMMENDED_ACTION: Unique Wave-16 grants are observe+win / ELITE / `ring_gallery` only. Do not restamp `survivor` / `jackpot` / `leader_slayer` / `spell_master`. Do not restamp #890 extra doors. Do not restamp #899 / #941 / #997 family ids. Do not restamp #903 / #951 / #1004 extra doors. Do not restamp #953 extra doors. Do not restamp **#1011** extra doors. Do not restamp #906 / #962 rooms or Pack Rank / Rank Fold / Pack Diag / Far Fold doors. Pack Orth / Leap Fold never write `ownedSpellIds`. Court Snuff never writes `ownedSpellIds`.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: SDE-2026-08-31-007; SDE-2026-10-23-005; SDE-2026-10-24-001  
REGRESSION_RISK: MEDIUM — remount must not double-grant; first MULTI child wins.  
VALIDATION_REQUIRED: No new `AchievementConfig` row. `survivor` still Doka-only.  
STATUS: NEW  

---

ACTION_ID: SDE-2026-10-24-006  
SOURCE_AUTOMATION: Dynamic Spell Discovery and Enemy Spell Evolution Designer  
TITLE: Add ring_gallery, hepta_nave, frost_aisle, last_pulpit, rift_court as tagged encounters  
CATEGORY: special-encounter  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Wave-15 specials (`file_gallery` / `hexa_nave` / `lava_aisle` / `strike_pulpit` / `shock_nave`) already own those tags. Wave-14 `rank_gallery` owns Rank Stride. Wave-2 `rime_gallery` owns Rime Sheet, not Rime Reel. Wave-11 `void_aisle` owns Void Reel, not Rift Skip. `fog_of_war` is still an announce-only stub.  
SYSTEMS_AFFECTED: encounter tag table; kit overlay  
RECOMMENDED_ACTION: Tag existing solvable layouts. All five teach via observe+win (Ring Stride / Hepta Oath / Rime Reel / Last Mark / Rift Skip). Do not retag `rank_gallery` / `file_gallery` / `orth_gallery` / `rime_gallery` / `void_aisle` / `ash_aisle` / `penta_nave` / `hexa_nave` / `span_six` / `span_dec` / `span_hendeca` / `strike_pulpit`. Do not consume #771 `ENC-BASH-*` / `ENC-DRY-*` / `ENC-HOOD-*` ids. Do not consume #826 / #885 / #957 / #1006 ENC-* ids. Do not consume #949 / #993 `WF-*`. Do not edit `mapGen.ts` algorithms. Do not invent a second recap. World portals stay locked while hostiles live. Twin Gate pads are not `map.portals`. Ice / Void Rift cells are map-modifier occupancy, not painted pits.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: SDE-2026-08-31-003; SDE-2026-10-23-006; SDE-2026-10-24-005  
REGRESSION_RISK: MEDIUM if a tag seals portals, skips `finalizePlayableLayout`, or treats ice cells as Twin Gate pads.  
VALIDATION_REQUIRED: Maps stay solvable. Defeat does not grant. `rank_gallery` still teaches Rank Stride, not Ring Stride. `rime_gallery` still teaches Rime Sheet, not Rime Reel. `span_dec` still teaches Dec Span, not Hepta Oath. `span_hendeca` still teaches Hendeca Span, not Hepta Oath.  
STATUS: NEW  

---

ACTION_ID: SDE-2026-10-24-007  
SOURCE_AUTOMATION: Dynamic Spell Discovery and Enemy Spell Evolution Designer  
TITLE: Observation edge cases for ring walk, ice pull, last-AP paint, dual plate, and fizzle  
CATEGORY: discovery-pipeline  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Wave-1 observe is “cast spent AP.” Ring Stride observes on the **arm**, not the later walk. Last Mark observes on **paint**, not the last-AP detonate. Dual Plate observes on the **arm**, not the negated hit. Rime Reel with no ice fizzles after AP — still observes. Pack Orth / Leap Fold never persist.  
SYSTEMS_AFFECTED: observe hook; recap; challenge HP/AP helpers  
RECOMMENDED_ACTION: Observe on Ring Stride / Hepta Oath / Dual Plate / Rift Skip / Cadence Cap / Watch Drain **arm**. Fizzle after AP spend still observes (Rime Reel empty, Brick Hold with no adjacent barrier, Prime Gift leftover not 1/1, Gait Toll while leftover MP ≥ 1). Illegal confirm (no AP) does not. Rift Skip consume is environmental if they then walk onto a Void Rift — use existing rift walk-tax. Prime Gift HP gain uses existing healUsed only when player-side HP actually increased. `ENEMY_ONLY` / `BOSS_ONLY` never write `ownedSpellIds`. Player summons never observe.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: SDE-2026-08-31-002; SDE-2026-10-23-007; SDE-2026-10-24-004  
REGRESSION_RISK: HIGH if last-AP detonate double-observes, Pack Orth is granted, Rime Reel dest is a world portal, or Ring Stride confirm succeeds on a knight dest.  
VALIDATION_REQUIRED: Wave-16 QA rows W16-1…W16-12, W16-20.  
STATUS: NEW  

---

ACTION_ID: SDE-2026-10-24-008  
SOURCE_AUTOMATION: Dynamic Spell Discovery and Enemy Spell Evolution Designer  
TITLE: Recap cards must list Wave-16 fields on the existing popup  
CATEGORY: discovery-ux  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `PostBattleRecap.tsx` 6–34 still has no `discoveredSpells`. Wave-1 SDE-003 owns the field; Wave-16 only requires the same card shape (name, role, AP, range, target, key effect, source enemy).  
SYSTEMS_AFFECTED: `BattleRecapData`; recap chrome  
RECOMMENDED_ACTION: Do not add a second popup. Stack up to 4 cards. Defeat never shows `NEW SPELL DISCOVERED`. Carved-stone / crimson only. In-battle cue remains `TECHNIQUE OBSERVED`.  
AUTONOMY: IMPLEMENT_AFTER_HUMAN  
DEPENDENCIES: SDE-2026-08-31-003; SDE-2026-08-31-004; SDE-2026-10-23-008  
REGRESSION_RISK: LOW for combat. MEDIUM if a second modal appears.  
VALIDATION_REQUIRED: One recap at `App.tsx` root.  
STATUS: NEW  
