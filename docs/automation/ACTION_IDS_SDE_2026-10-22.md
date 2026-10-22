# ACTION_IDs — 2026-10-22 Dynamic Spell Discovery & Enemy Spell Evolution

Durable ledger for implementers and the Report Action Orchestrator.  
Source of every record: Dynamic Spell Discovery and Enemy Spell Evolution Designer.  
Design contract: [`SPELL_DISCOVERY_ECOSYSTEM_2026-10-22.md`](./SPELL_DISCOVERY_ECOSYSTEM_2026-10-22.md).  
Wave-1 law (still blocking): [`SPELL_DISCOVERY_ECOSYSTEM_2026-08-31.md`](./SPELL_DISCOVERY_ECOSYSTEM_2026-08-31.md) and `SDE-2026-08-31-001`…`009`.  
Wave-2…13 generation stamps (still blocking): `SDE-2026-09-01-001`…`008` through `SDE-2026-10-21-001`…`008`.  
Do not implement gameplay from this file unless a later human or orchestrator explicitly picks an ID. This run ships **docs only**.

Sibling ledgers (do not re-open): tactical ids in PRs #120 / #185 / #282 / #342 / #411 / #463 / #525 / #563 / #636 / #695 / #726 / #787 / **#849** / **#890**; family sheets through **#840** and same-day **#899**; boss extras through **#836** and same-day **#903**; Wave-1…13 SDE ids including memory-reserved Wave 5; encounter rooms in **#771**, **#826**, and same-day **#885**; same-day roadmap **#870**. **SDE wins** `spell-cadence-floor` vs #890.

---

ACTION_ID: SDE-2026-10-22-001  
SOURCE_AUTOMATION: Dynamic Spell Discovery and Enemy Spell Evolution Designer  
TITLE: Do not land Wave-14 data before Wave-1 ownership split and G resolve through Wave 13  
CATEGORY: dependency  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: HEAD is still `0f5363f`. `WorldExploration.tsx` 2395–2440 still forces every `starterSpells` row `isBaseSpell: true`. `BattleRecapData` (`PostBattleRecap.tsx` 6–34) has no `discoveredSpells`. `buildEnemyKit(enemy.pieceType, currentMap.levelZone)` at WX 11920 still passes a `{ name, minLevel, maxLevel }` object. Wave-1 P0 through Wave-13 P0 are still NEW. Adding 19 ids to the always-owned catalog would make discovery worse.  
SYSTEMS_AFFECTED: hydrate; recap; catalog; kit resolve  
RECOMMENDED_ACTION: Keep Wave-14 definitions `STATUS: PROPOSED` until innate four + observe + `commitSpellDiscoveries` + numeric `G` exist. Do not append Wave-14 ids to `starterSpells`.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: SDE-2026-08-31-001; SDE-2026-08-31-002; SDE-2026-08-31-003; SDE-2026-09-01-001; SDE-2026-10-21-001  
REGRESSION_RISK: HIGH if ignored (catalog pre-own; G14 verbs on G=0 kits).  
VALIDATION_REQUIRED: New character still owns only the four innate ids after Wave-1 split. `generationMin: 14` absent at G≤13.  
STATUS: NEW  

---

ACTION_ID: SDE-2026-10-22-002  
SOURCE_AUTOMATION: Dynamic Spell Discovery and Enemy Spell Evolution Designer  
TITLE: Resolve a G≥14 extra pool slot with generationMin  
CATEGORY: pool-evolution  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Wave-13 SDE-2026-10-21-002 asked for a G≥13 extra slot. Wave 14 stamps `generationMin: 14` on unique family verbs. `Math.floor(levelZone)` is still NaN (`enemyAI.ts` 194–199; WX 11920). `computeAITier` still plateaus at label 10 (`combatMath.ts` 36–52).  
SYSTEMS_AFFECTED: `resolveEnemyKit`; family overlays  
RECOMMENDED_ACTION: After SDE-2026-10-21-002, at G≥14 allow one extra ADVANCED/RARE/ELITE with `generationMin ≤ G`. Never retire CORE or G13. Empty → `[physical_attack]`. Do not retune `pickEnemyLevelFromTiers`. No `G_max`. Wave-14 family CORE is **#899**: remaining unique **#802** Wave-12 verbs (minus Dry Gait / Pack Cap / Reach Fold) **and** **#849** tactical Wave-13 ids (minus Court Lag). Unique §11 stay extras, not that CORE. Unique Wave-13 §11 **and** **#890** (except Cadence Floor — SDE wins) stay extras until Wave 15.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: SDE-2026-10-21-002; SDE-2026-08-31-005; SDE-2026-08-31-006  
REGRESSION_RISK: MEDIUM — G=13 Tide must not receive Rank Stride; empty kit must stay armed.  
VALIDATION_REQUIRED: Peer pawn still has Strike. `generationMin: 14` absent at G≤13.  
STATUS: NEW  

---

ACTION_ID: SDE-2026-10-22-003  
SOURCE_AUTOMATION: Dynamic Spell Discovery and Enemy Spell Evolution Designer  
TITLE: Wire Wave-14 aiHints before assigning those ids  
CATEGORY: ai-compat  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: `inferArchetype` (`enemyAI.ts` 447–452) still maps any `healAmount > 0` to healer. Summon fallback still uses name (`enemyAI.ts` 217–224). New hints (`walk_same_rank_only`, `next_spell_exact_chebyshev_5`, `attract_toward_nearest_spike`, `bonus_if_bresenham_blocked`, `detonate_if_teleport_onto`, `negate_hit_if_leftover_ap_odd`, `skip_mire_enter_tax_one_tile`, `bonus_if_target_leftover_ap_odd`, `summon_recast_last_id_ap_tax`, `heal_if_leftover_ap_eq_leftover_mp_ge_1`, `floor_remaining_cds_to_1`, `tax_next_spell_if_struck_last_turn`, `step_through_adjacent_barrier`, `overwatch_snap_bank_walker_ap`, `bonus_if_leftover_ap_eq_leftover_mp_eq_2`, `bonus_if_near_world_portal`, `heal_if_caster_force_moved_target`, `pack_walk_share_champion_rank`, `fold_two_player_side_share_rank`) have no decide* branch.  
SYSTEMS_AFFECTED: `enemyAI.ts` decide*; kit resolve  
RECOMMENDED_ACTION: Implement each hint as a predicate on explicit flags / leftover AP-MP / rank dest / spike occupancy / Bresenham blockage / teleport landings / remaining CDs / world-portal occupancy. Drop name fallbacks. Do not assign Equal Gift / Shove Gift to non-healer CORE. Do not assign Spike Reel when no spike exists. Do not assign Rank Fold outside boss AI. Missing hint → drop id, log once.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: SDE-2026-08-31-006; SDE-2026-09-01-003; SDE-2026-10-21-003  
REGRESSION_RISK: HIGH if Brick Step skips solvability, Spike Reel pulls onto a world portal, Portal Cut treats Twin Gate pads as `map.portals`, or Pack Rank is granted.  
VALIDATION_REQUIRED: Rank Stride confirm fails on a file-advance dest. Pack Rank / Rank Fold never owned. Equal Gift absent from non-healer CORE.  
STATUS: NEW  

---

ACTION_ID: SDE-2026-10-22-004  
SOURCE_AUTOMATION: Dynamic Spell Discovery and Enemy Spell Evolution Designer  
TITLE: Implement Wave-14 definitions as data + pool rows  
CATEGORY: catalog-wave  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Unique §11 ids are absent from `spellData.ts` / `SPELL_ID_CATALOG` (32 live ids). #802 reserved Orth Stride … Reach Fold. #837 reserved Knight Stride … Diag Fold. #849 reserved Gaunt Mend … Court Lag. Tombstone in Wave-14 §0.1 must not be reused. Every frontend `mpCost` is still 0 except the three sibling spenders once they land.  
SYSTEMS_AFFECTED: `spellData.ts`; `bossKits.ts` catalog; family `EnemyKit` pools  
RECOMMENDED_ACTION: Add unique SDE ids one at a time with full metadata. **Stamp** #802 and #849 ids onto Wave-14 family CORE via **#899** — do not clone them. **Stamp** #890 as Wave **15** family CORE — do not clone Poise Mend / Nine Span / Bar Cross. **SDE wins** `spell-cadence-floor`; do not ship a second copy from #890. **Do not ship** `spell-parched-mend` (Dry Gait owns both leftover-MP=0 heal). Unique §11 stay `mpCost: 0`. `spell-pack-rank` / `spell-rank-fold` never enter `ownedSpellIds`. Never `if (spell.name === …)`. Do not clone Tempo Invert as Equal Gift, Pack File as Pack Rank, Spent Plate as Odd Plate, Cadence Lag as Cadence Floor, Poise Mend as Equal Gift, or Oct Span as Nine Span.  
AUTONOMY: HUMAN_APPROVE — each id is a combat toy.  
DEPENDENCIES: SDE-2026-10-22-001; SDE-2026-10-22-002; SDE-2026-10-22-003  
REGRESSION_RISK: HIGH per id if wired by name, assigned to the wrong profile, or if Brick Step skips `finalizePlayableLayout`.  
VALIDATION_REQUIRED: `validateBossKits()` still passes. Typecheck clean. G=13 Tide has no Rank Stride.  
STATUS: NEW  

---

ACTION_ID: SDE-2026-10-22-005  
SOURCE_AUTOMATION: Dynamic Spell Discovery and Enemy Spell Evolution Designer  
TITLE: Do not restamp feat / challenge / #849 / #837 / #836 / #890 / #899 / #903 extra doors  
CATEGORY: feat-challenge-boss  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Achievements still Doka-only (`admin.mo` 309–326). All 15 feat doors are claimed or leftover. `survivor` stays leftover (Last Ember / Last Ward). #849 already claimed `gaunt_cantor` / `lag_precentor` / `span_oct` / `court_lag_regent`. #837 already claimed `knight_gallery` / `quad_nave` / `pit_aisle` / `shunt_pulpit` / `nudge_nave` / `file_precentor` / `diag_fold_regent`. #836 already claimed `effigy_clerk` / `enter_deacon` / `split_acolyte` / `quiet_chorister`. #890 already claimed `poise_cantor` / `floor_precentor` / `span_nine` / `court_floor_regent`. #899 already claimed `gaunt_mender` … `axis_cutter`. #903 already claimed `jostle_subdeacon` / `peel_friar` / `dilate_organist` / `hood_recluse`. Do not use `unstoppable` / `level_10`.  
SYSTEMS_AFFECTED: `AchievementConfig`; challenge persist; boss-clear persist  
RECOMMENDED_ACTION: Unique Wave-14 grants are observe+win / ELITE / `rank_gallery` only. Do not restamp `survivor` / `jackpot` / `leader_slayer` / `spell_master`. Do not restamp #849 extra doors. Do not restamp #837 rooms or Pack File / Diag Fold doors. Do not restamp #836 extra doors. Do not restamp #890 extra doors. Do not restamp #899 family ids. Do not restamp #903 extra doors. Pack Rank / Rank Fold never write `ownedSpellIds`.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: SDE-2026-08-31-007; SDE-2026-10-21-005; SDE-2026-10-22-001  
REGRESSION_RISK: MEDIUM — remount must not double-grant; first MULTI child wins.  
VALIDATION_REQUIRED: No new `AchievementConfig` row. `survivor` still Doka-only.  
STATUS: NEW  

---

ACTION_ID: SDE-2026-10-22-006  
SOURCE_AUTOMATION: Dynamic Spell Discovery and Enemy Spell Evolution Designer  
TITLE: Add rank_gallery, penta_nave, spike_aisle, swap_pulpit, mire_nave as tagged encounters  
CATEGORY: special-encounter  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Wave-13 specials (`knight_gallery` / `quad_nave` / `pit_aisle` / `shunt_pulpit` / `nudge_nave`) already own those tags. Wave-12 `orth_gallery` owns Orth Stride. #695 owns `span_penta`. `even_gallery` is Wave-7 Even Stride. `fog_of_war` is still an announce-only stub.  
SYSTEMS_AFFECTED: encounter tag table; kit overlay  
RECOMMENDED_ACTION: Tag existing solvable layouts. All five teach via observe+win (Rank Stride / Penta Oath / Spike Reel / Swap Mark / Mire Skip). Do not retag `orth_gallery` / `knight_gallery` / `even_gallery` / `pit_aisle` / `quad_nave` / `span_penta`. Do not consume #771 `ENC-BASH-*` / `ENC-DRY-*` / `ENC-HOOD-*` ids. Do not consume #826 `ENC-TEACH-13` / `ENC-SPELL-25` / `ENC-NEAR-01` / other 2026-10-21 ENC-* ids. Do not consume #885 `ENC-TEACH-14` / `ENC-SPIKE-01` / `ENC-INCH-01` / `ENC-FOLD-01` / other 2026-10-22 ENC-* ids. Do not edit `mapGen.ts` algorithms. Do not invent a second recap. World portals stay locked while hostiles live. Twin Gate pads are not `map.portals`. Spike cells are map-modifier occupancy, not painted pits. `ENC-SPIKE-01` stays Spike Skip’s room.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: SDE-2026-08-31-003; SDE-2026-10-21-006; SDE-2026-10-22-005  
REGRESSION_RISK: MEDIUM if a tag seals portals, skips `finalizePlayableLayout`, or treats spike/portal cells as Twin Gate pads.  
VALIDATION_REQUIRED: Maps stay solvable. Defeat does not grant. `orth_gallery` still teaches Orth Stride, not Rank Stride. `span_penta` still teaches Penta Span, not Penta Oath. `span_nine` stays Nine Span’s door.  
STATUS: NEW  

---

ACTION_ID: SDE-2026-10-22-007  
SOURCE_AUTOMATION: Dynamic Spell Discovery and Enemy Spell Evolution Designer  
TITLE: Observation edge cases for rank walk, spike pull, teleport paint, odd plate, and fizzle  
CATEGORY: discovery-pipeline  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Wave-1 observe is “cast spent AP.” Rank Stride observes on the **arm**, not the later walk. Swap Mark observes on **paint**, not the teleport detonate. Odd Plate observes on the **arm**, not the negated hit. Spike Reel with no spike fizzles after AP — still observes. Pack Rank / Rank Fold never persist.  
SYSTEMS_AFFECTED: observe hook; recap; challenge HP/AP helpers  
RECOMMENDED_ACTION: Observe on Rank Stride / Penta Oath / Odd Plate / Mire Skip / Cadence Floor / Watch Bank **arm**. Fizzle after AP spend still observes (Spike Reel empty, Brick Step dest occupied, Equal Gift leftover 0=0 or unequal, Cast Toll after a spell). Illegal confirm (no AP) does not. Mire Skip consume is environmental if they then walk onto lava — use existing hazard ticks. Equal Gift / Shove Gift HP gain uses existing healUsed only when player-side HP actually increased. `ENEMY_ONLY` / `BOSS_ONLY` never write `ownedSpellIds`. Player summons never observe.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: SDE-2026-08-31-002; SDE-2026-10-21-007; SDE-2026-10-22-004  
REGRESSION_RISK: HIGH if teleport detonate double-observes, Pack Rank is granted, Brick Step skips solvability, or Portal Cut treats Twin Gate pads as world portals.  
VALIDATION_REQUIRED: Wave-14 QA rows W14-1…W14-12, W14-20.  
STATUS: NEW  

---

ACTION_ID: SDE-2026-10-22-008  
SOURCE_AUTOMATION: Dynamic Spell Discovery and Enemy Spell Evolution Designer  
TITLE: Recap cards must list Wave-14 fields on the existing popup  
CATEGORY: discovery-ux  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `PostBattleRecap.tsx` 6–34 still has no `discoveredSpells`. Wave-1 SDE-003 owns the field; Wave-14 only requires the same card shape (name, role, AP, range, target, key effect, source enemy).  
SYSTEMS_AFFECTED: `BattleRecapData`; recap chrome  
RECOMMENDED_ACTION: Do not add a second popup. Stack up to 4 cards. Defeat never shows `NEW SPELL DISCOVERED`. Carved-stone / crimson only. In-battle cue remains `TECHNIQUE OBSERVED`.  
AUTONOMY: IMPLEMENT_AFTER_HUMAN  
DEPENDENCIES: SDE-2026-08-31-003; SDE-2026-08-31-004; SDE-2026-10-21-008  
REGRESSION_RISK: LOW for combat. MEDIUM if a second modal appears.  
VALIDATION_REQUIRED: One recap at `App.tsx` root.  
STATUS: NEW  
