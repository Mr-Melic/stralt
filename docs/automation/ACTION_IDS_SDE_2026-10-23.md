# ACTION_IDs — 2026-10-23 Dynamic Spell Discovery & Enemy Spell Evolution

Durable ledger for implementers and the Report Action Orchestrator.  
Source of every record: Dynamic Spell Discovery and Enemy Spell Evolution Designer.  
Design contract: [`SPELL_DISCOVERY_ECOSYSTEM_2026-10-23.md`](./SPELL_DISCOVERY_ECOSYSTEM_2026-10-23.md).  
Wave-1 law (still blocking): [`SPELL_DISCOVERY_ECOSYSTEM_2026-08-31.md`](./SPELL_DISCOVERY_ECOSYSTEM_2026-08-31.md) and `SDE-2026-08-31-001`…`009`.  
Wave-2…14 generation stamps (still blocking): `SDE-2026-09-01-001`…`008` through `SDE-2026-10-22-001`…`008`.  
Do not implement gameplay from this file unless a later human or orchestrator explicitly picks an ID. This run ships **docs only**.

Sibling ledgers (do not re-open): tactical ids in PRs #120 / #185 / #282 / #342 / #411 / #463 / #525 / #563 / #636 / #695 / #726 / #787 / #849 / **#890** / same-day **#953** (Tally Mend … Court Prime; extra doors `tally_cantor` / `prime_precentor` / `span_dec` / `court_prime_regent`; stamp as Wave **16** family CORE); family sheets through **#840**, **#899**, and same-day **#941**; boss extras through **#836**, **#903**, and same-day **#951** (`wick_exorcist` / `dry_nuncio` / `hearth_legate` / `must_preceptor`); Wave-1…14 SDE ids including memory-reserved Wave 5 and still-open **#906**; encounter rooms in **#771**, **#826**, **#885**, and same-day **#957** (`ENC-DRY-02` / `ENC-LEAN-01` / `ENC-ODD-02`); world dynamics **#949**; SDA **#940**; CDA **#942** (freeze Wave 16, not this Generation 15); roadmap **#870**. **SDE already won** `spell-cadence-floor` vs #890. Wave 14 unique §11 stay extras until Wave 16. Unique §11 stay extras until Wave 17. Cadence Rise is remaining `1→2`; Cadence Prime is remaining `0→1`.

---

ACTION_ID: SDE-2026-10-23-001  
SOURCE_AUTOMATION: Dynamic Spell Discovery and Enemy Spell Evolution Designer  
TITLE: Do not land Wave-15 data before Wave-1 ownership split and G resolve through Wave 14  
CATEGORY: dependency  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: HEAD is still `0f5363f`. `WorldExploration.tsx` 2395–2440 still forces every `starterSpells` row `isBaseSpell: true`. `BattleRecapData` (`PostBattleRecap.tsx` 6–34) has no `discoveredSpells`. `buildEnemyKit(enemy.pieceType, currentMap.levelZone)` at WX 11920 still passes a `{ name, minLevel, maxLevel }` object. Wave-1 P0 through Wave-14 P0 are still NEW. Adding 19 ids to the always-owned catalog would make discovery worse.  
SYSTEMS_AFFECTED: hydrate; recap; catalog; kit resolve  
RECOMMENDED_ACTION: Keep Wave-15 definitions `STATUS: PROPOSED` until innate four + observe + `commitSpellDiscoveries` + numeric `G` exist. Do not append Wave-15 ids to `starterSpells`.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: SDE-2026-08-31-001; SDE-2026-08-31-002; SDE-2026-08-31-003; SDE-2026-09-01-001; SDE-2026-10-22-001  
REGRESSION_RISK: HIGH if ignored (catalog pre-own; G15 verbs on G=0 kits).  
VALIDATION_REQUIRED: New character still owns only the four innate ids after Wave-1 split. `generationMin: 15` absent at G≤14.  
STATUS: NEW  

---

ACTION_ID: SDE-2026-10-23-002  
SOURCE_AUTOMATION: Dynamic Spell Discovery and Enemy Spell Evolution Designer  
TITLE: Resolve a G≥15 extra pool slot with generationMin  
CATEGORY: pool-evolution  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Wave-14 SDE-2026-10-22-002 asked for a G≥14 extra slot. Wave 15 stamps `generationMin: 15` on unique family verbs. `Math.floor(levelZone)` is still NaN (`enemyAI.ts` 194–199; WX 11920). `computeAITier` still plateaus at label 10 (`combatMath.ts` 36–52).  
SYSTEMS_AFFECTED: `resolveEnemyKit`; family overlays  
RECOMMENDED_ACTION: After SDE-2026-10-22-002, at G≥15 allow one extra ADVANCED/RARE/ELITE with `generationMin ≤ G`. Never retire CORE or G14. Empty → `[physical_attack]`. Do not retune `pickEnemyLevelFromTiers`. No `G_max`. Wave-15 family CORE is unique **#837** Wave-13 verbs (minus Hollow Gift / Pack File / Diag Fold) **and** **#890** (minus Cadence Floor / Court Floor / Poise Mend on non-healer kits) — same-day **#941** already authored those CORE rows. Unique §11 stay extras, not #941 CORE. Unique Wave-14 §11 stay extras until Wave 16. Unique §11 stay extras until Wave 17.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: SDE-2026-10-22-002; SDE-2026-08-31-005; SDE-2026-08-31-006  
REGRESSION_RISK: MEDIUM — G=14 Tide must not receive File Stride; empty kit must stay armed.  
VALIDATION_REQUIRED: Peer pawn still has Strike. `generationMin: 15` absent at G≤14.  
STATUS: NEW  

---

ACTION_ID: SDE-2026-10-23-003  
SOURCE_AUTOMATION: Dynamic Spell Discovery and Enemy Spell Evolution Designer  
TITLE: Wire Wave-15 aiHints before assigning those ids  
CATEGORY: ai-compat  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: `inferArchetype` (`enemyAI.ts` 447–452) still maps any `healAmount > 0` to healer. Summon fallback still uses name (`enemyAI.ts` 217–224). New hints (`walk_same_file_only`, `next_spell_exact_chebyshev_6`, `attract_toward_nearest_lava`, `bonus_if_share_file_with_caster`, `detonate_if_strike_from`, `negate_hit_if_leftover_mp_eq_0`, `skip_shock_tile_tax_one_tile`, `bonus_if_target_leftover_ap_even_ge_2`, `summon_walk_off_rank_ap_tax`, `heal_if_leftover_ap_eq_0_and_mp_ge_1`, `bump_remaining_cds_eq_1_to_2`, `tax_next_spell_if_leftover_mp_eq_0`, `negate_hit_if_adjacent_barrier`, `overwatch_snap_zero_walker_mp`, `bonus_if_leftover_mp_odd`, `bonus_if_near_spike_occupancy`, `summon_next_hit_zero`, `pack_walk_share_champion_diag`, `fold_two_player_side_chebyshev_4`) have no decide* branch.  
SYSTEMS_AFFECTED: `enemyAI.ts` decide*; kit resolve  
RECOMMENDED_ACTION: Implement each hint as a predicate on explicit flags / leftover AP-MP / file dest / lava occupancy / shared file / Strike-from paint / remaining CDs / shock-tile occupancy / spike occupancy / barrier adjacency. Drop name fallbacks. Do not assign Lean Gift / Summon Plate to non-healer CORE. Do not assign Lava Reel when no lava exists. Do not assign Far Fold outside boss AI. Missing hint → drop id, log once.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: SDE-2026-08-31-006; SDE-2026-09-01-003; SDE-2026-10-22-003  
REGRESSION_RISK: HIGH if Lava Reel pulls onto a world portal, Shock Skip ignores lava/spikes, Pack Diag is granted, or File Stride confirm succeeds on a rank-change dest.  
VALIDATION_REQUIRED: File Stride confirm fails on `dest.x ≠ arm.x`. Pack Diag / Far Fold never owned. Lean Gift absent from non-healer CORE.  
STATUS: NEW  

---

ACTION_ID: SDE-2026-10-23-004  
SOURCE_AUTOMATION: Dynamic Spell Discovery and Enemy Spell Evolution Designer  
TITLE: Implement Wave-15 definitions as data + pool rows  
CATEGORY: catalog-wave  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Unique §11 ids are absent from `spellData.ts` / `SPELL_ID_CATALOG` (32 live ids). #837 reserved Knight Stride … Diag Fold. #890 reserved Poise Mend … Court Floor. #906 reserved Rank Stride … Rank Fold. Tombstone in Wave-15 §0.1 must not be reused. Every frontend `mpCost` is still 0 except the three sibling spenders once they land.  
SYSTEMS_AFFECTED: `spellData.ts`; `bossKits.ts` catalog; family `EnemyKit` pools  
RECOMMENDED_ACTION: Add unique SDE ids one at a time with full metadata. **Stamp** #837 and #890 ids onto Wave-15 family CORE — **#941 already owns those CORE rows**; do not clone them. **Stamp** unique Wave-14 §11 as Wave **16** extras — do not clone Rank Stride / Cadence Floor. **Stamp** #953 as Wave **16** family CORE — do not clone Tally Mend / Cadence Prime / Dec Span / Purse Turn. Unique §11 stay `mpCost: 0` and stay extras until Wave 17. `spell-pack-diag` / `spell-far-fold` never enter `ownedSpellIds`. Never `if (spell.name === …)`. Do not clone Rank Stride as File Stride, Axis Bite as File Bite, Dry Sting as Dry Plate, Pack File as Pack Diag, Cadence Stall as Cadence Rise, Cadence Prime as Cadence Rise, or Hazard Cut as Spike Cut. Do not restamp #941 `ENEMY_ID`s, #951 extra doors, or #953 extra doors.  
AUTONOMY: HUMAN_APPROVE — each id is a combat toy.  
DEPENDENCIES: SDE-2026-10-23-001; SDE-2026-10-23-002; SDE-2026-10-23-003  
REGRESSION_RISK: HIGH per id if wired by name, assigned to the wrong profile, or if Lava Reel dest is `map.portals`.  
VALIDATION_REQUIRED: `validateBossKits()` still passes. Typecheck clean. G=14 Tide has no File Stride.  
STATUS: NEW  

---

ACTION_ID: SDE-2026-10-23-005  
SOURCE_AUTOMATION: Dynamic Spell Discovery and Enemy Spell Evolution Designer  
TITLE: Do not restamp feat / challenge / #890 / #899 / #903 / #906 / #941 / #951 / #953 extra doors  
CATEGORY: feat-challenge-boss  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Achievements still Doka-only (`admin.mo` 309–326). All 15 feat doors are claimed or leftover. `survivor` stays leftover (Last Ember / Last Ward). #890 already claimed `poise_cantor` / `floor_precentor` / `span_nine` / `court_floor_regent`. #899 already claimed `gaunt_mender` … `axis_cutter`. #941 already claimed `poise_mender` … `drift_gifter`. #903 already claimed `jostle_subdeacon` / `peel_friar` / `dilate_organist` / `hood_recluse`. #951 already claimed `wick_exorcist` / `dry_nuncio` / `hearth_legate` / `must_preceptor`. #953 already claimed `tally_cantor` / `prime_precentor` / `span_dec` / `court_prime_regent`. #906 already claimed `rank_gallery` / `penta_nave` / `spike_aisle` / `swap_pulpit` / `mire_nave` / `rank_precentor` / `rank_fold_regent`. Do not use `unstoppable` / `level_10`.  
SYSTEMS_AFFECTED: `AchievementConfig`; challenge persist; boss-clear persist  
RECOMMENDED_ACTION: Unique Wave-15 grants are observe+win / ELITE / `file_gallery` only. Do not restamp `survivor` / `jackpot` / `leader_slayer` / `spell_master`. Do not restamp #890 extra doors. Do not restamp #899 / #941 family ids. Do not restamp #903 / #951 extra doors. Do not restamp #953 extra doors. Do not restamp #906 rooms or Pack Rank / Rank Fold doors. Pack Diag / Far Fold never write `ownedSpellIds`.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: SDE-2026-08-31-007; SDE-2026-10-22-005; SDE-2026-10-23-001  
REGRESSION_RISK: MEDIUM — remount must not double-grant; first MULTI child wins.  
VALIDATION_REQUIRED: No new `AchievementConfig` row. `survivor` still Doka-only.  
STATUS: NEW  

---

ACTION_ID: SDE-2026-10-23-006  
SOURCE_AUTOMATION: Dynamic Spell Discovery and Enemy Spell Evolution Designer  
TITLE: Add file_gallery, hexa_nave, lava_aisle, strike_pulpit, shock_nave as tagged encounters  
CATEGORY: special-encounter  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Wave-14 specials (`rank_gallery` / `penta_nave` / `spike_aisle` / `swap_pulpit` / `mire_nave`) already own those tags. Wave-12 `orth_gallery` owns Orth Stride. `even_gallery` is Wave-7 Even Stride. `fog_of_war` is still an announce-only stub.  
SYSTEMS_AFFECTED: encounter tag table; kit overlay  
RECOMMENDED_ACTION: Tag existing solvable layouts. All five teach via observe+win (File Stride / Hexa Oath / Lava Reel / Strike Mark / Shock Skip). Do not retag `rank_gallery` / `orth_gallery` / `penta_nave` / `span_six` / `spike_aisle` / `pit_aisle` / `swap_pulpit` / `mire_nave` / `knight_gallery`. Do not consume #771 `ENC-BASH-*` / `ENC-DRY-*` / `ENC-HOOD-*` ids. Do not consume #826 / #885 / #957 ENC-* ids. Do not consume #949 `WF-*`. Do not edit `mapGen.ts` algorithms. Do not invent a second recap. World portals stay locked while hostiles live. Twin Gate pads are not `map.portals`. Lava / shock / spike cells are map-modifier occupancy, not painted pits.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: SDE-2026-08-31-003; SDE-2026-10-22-006; SDE-2026-10-23-005  
REGRESSION_RISK: MEDIUM if a tag seals portals, skips `finalizePlayableLayout`, or treats lava/shock cells as Twin Gate pads.  
VALIDATION_REQUIRED: Maps stay solvable. Defeat does not grant. `rank_gallery` still teaches Rank Stride, not File Stride. `span_six` still teaches Six Span, not Hexa Oath.  
STATUS: NEW  

---

ACTION_ID: SDE-2026-10-23-007  
SOURCE_AUTOMATION: Dynamic Spell Discovery and Enemy Spell Evolution Designer  
TITLE: Observation edge cases for file walk, lava pull, Strike paint, dry plate, and fizzle  
CATEGORY: discovery-pipeline  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Wave-1 observe is “cast spent AP.” File Stride observes on the **arm**, not the later walk. Strike Mark observes on **paint**, not the Strike detonate. Dry Plate observes on the **arm**, not the negated hit. Lava Reel with no lava fizzles after AP — still observes. Pack Diag / Far Fold never persist.  
SYSTEMS_AFFECTED: observe hook; recap; challenge HP/AP helpers  
RECOMMENDED_ACTION: Observe on File Stride / Hexa Oath / Dry Plate / Shock Skip / Cadence Rise / Watch Root **arm**. Fizzle after AP spend still observes (Lava Reel empty, Brick Brace with no adjacent barrier, Lean Gift leftover AP ≥ 1, Still Toll while leftover MP ≥ 1). Illegal confirm (no AP) does not. Shock Skip consume is environmental if they then walk onto lava — use existing hazard ticks. Lean Gift HP gain uses existing healUsed only when player-side HP actually increased. `ENEMY_ONLY` / `BOSS_ONLY` never write `ownedSpellIds`. Player summons never observe.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: SDE-2026-08-31-002; SDE-2026-10-22-007; SDE-2026-10-23-004  
REGRESSION_RISK: HIGH if Strike detonate double-observes, Pack Diag is granted, Lava Reel dest is a world portal, or File Stride confirm succeeds on a rank-change dest.  
VALIDATION_REQUIRED: Wave-15 QA rows W15-1…W15-12, W15-20.  
STATUS: NEW  

---

ACTION_ID: SDE-2026-10-23-008  
SOURCE_AUTOMATION: Dynamic Spell Discovery and Enemy Spell Evolution Designer  
TITLE: Recap cards must list Wave-15 fields on the existing popup  
CATEGORY: discovery-ux  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `PostBattleRecap.tsx` 6–34 still has no `discoveredSpells`. Wave-1 SDE-003 owns the field; Wave-15 only requires the same card shape (name, role, AP, range, target, key effect, source enemy).  
SYSTEMS_AFFECTED: `BattleRecapData`; recap chrome  
RECOMMENDED_ACTION: Do not add a second popup. Stack up to 4 cards. Defeat never shows `NEW SPELL DISCOVERED`. Carved-stone / crimson only. In-battle cue remains `TECHNIQUE OBSERVED`.  
AUTONOMY: IMPLEMENT_AFTER_HUMAN  
DEPENDENCIES: SDE-2026-08-31-003; SDE-2026-08-31-004; SDE-2026-10-22-008  
REGRESSION_RISK: LOW for combat. MEDIUM if a second modal appears.  
VALIDATION_REQUIRED: One recap at `App.tsx` root.  
STATUS: NEW  
