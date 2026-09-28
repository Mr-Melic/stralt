# ACTION_IDs — 2026-09-28 Dynamic Spell Discovery & Enemy Spell Evolution

Durable ledger for implementers and the Report Action Orchestrator.  
Source of every record: Dynamic Spell Discovery and Enemy Spell Evolution Designer.  
Design contract: [`SPELL_DISCOVERY_ECOSYSTEM_2026-09-28.md`](./SPELL_DISCOVERY_ECOSYSTEM_2026-09-28.md).  
Wave-1 law (still blocking): [`SPELL_DISCOVERY_ECOSYSTEM_2026-08-31.md`](./SPELL_DISCOVERY_ECOSYSTEM_2026-08-31.md) and `SDE-2026-08-31-001`…`009`.  
Wave-2…10 generation stamps (still blocking): `SDE-2026-09-01-001`…`008` through `SDE-2026-09-27-001`…`008`.  
Do not implement gameplay from this file unless a later human or orchestrator explicitly picks an ID. This run ships **docs only**.

Sibling ledgers (do not re-open): tactical ids in PRs #120 / #185 / #282 / #342 / #411 / #463 / #525 / #563 / #636 / **#695** / **#726**; family sheets through **#686**; boss extras through **#663**; Wave-1…10 SDE ids including memory-reserved Wave 5.

---

ACTION_ID: SDE-2026-09-28-001  
SOURCE_AUTOMATION: Dynamic Spell Discovery and Enemy Spell Evolution Designer  
TITLE: Do not land Wave-11 data before Wave-1 ownership split and G resolve through Wave 10  
CATEGORY: dependency  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: `WorldExploration.tsx` 2395–2440 still forces every `starterSpells` row `isBaseSpell: true`. `BattleRecapData` (`PostBattleRecap.tsx` 6–34) has no `discoveredSpells`. `buildEnemyKit(enemy.pieceType, currentMap.levelZone)` at WX 11920 still passes a `{ name, minLevel, maxLevel }` object. Wave-1 P0 through Wave-10 P0 are still NEW. Adding 19 ids to the always-owned catalog would make discovery worse.  
SYSTEMS_AFFECTED: hydrate; recap; catalog; kit resolve  
RECOMMENDED_ACTION: Keep Wave-11 definitions `STATUS: PROPOSED` until innate four + observe + `commitSpellDiscoveries` + numeric `G` exist. Do not append Wave-11 ids to `starterSpells`.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: SDE-2026-08-31-001; SDE-2026-08-31-002; SDE-2026-08-31-003; SDE-2026-09-01-001; SDE-2026-09-27-001  
REGRESSION_RISK: HIGH if ignored (catalog pre-own; G11 verbs on G=0 kits).  
VALIDATION_REQUIRED: New character still owns only the four innate ids after Wave-1 split. `generationMin: 11` absent at G≤10.  
STATUS: NEW  

---

ACTION_ID: SDE-2026-09-28-002  
SOURCE_AUTOMATION: Dynamic Spell Discovery and Enemy Spell Evolution Designer  
TITLE: Resolve a G≥11 extra pool slot with generationMin  
CATEGORY: pool-evolution  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Wave-10 SDE-2026-09-27-002 asked for a G≥10 extra slot. Wave 11 stamps `generationMin: 11` on unique family verbs. `Math.floor(levelZone)` is still NaN (`enemyAI.ts` 194–199; WX 11920). `computeAITier` still plateaus at label 10 (`combatMath.ts` 36–52).  
SYSTEMS_AFFECTED: `resolveEnemyKit`; family overlays  
RECOMMENDED_ACTION: After SDE-2026-09-27-002, at G≥11 allow one extra ADVANCED/RARE/ELITE with `generationMin ≤ G`. Never retire CORE or G10. Empty → `[physical_attack]`. Do not retune `pickEnemyLevelFromTiers`. No `G_max`. Wave-11 family CORE consumes **#646** unique Wave-9 verbs **and** **#695** tactical Wave-10 ids. Unique §11 stay extras, not that CORE. **#726** is Wave 12 CORE, not this CORE.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: SDE-2026-09-27-002; SDE-2026-08-31-005; SDE-2026-08-31-006  
REGRESSION_RISK: MEDIUM — G=10 Tide must not receive Diag Stride; empty kit must stay armed.  
VALIDATION_REQUIRED: Peer pawn still has Strike. `generationMin: 11` absent at G≤10.  
STATUS: NEW  

---

ACTION_ID: SDE-2026-09-28-003  
SOURCE_AUTOMATION: Dynamic Spell Discovery and Enemy Spell Evolution Designer  
TITLE: Wire Wave-11 aiHints before assigning those ids  
CATEGORY: ai-compat  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: `inferArchetype` (`enemyAI.ts` 447–452) still maps any `healAmount > 0` to healer. Summon fallback still uses name (`enemyAI.ts` 217–224). New hints (`walk_diagonal_only`, `next_spell_exact_chebyshev_2`, `attract_toward_nearest_void`, `bonus_if_adjacent_hostile`, `detonate_if_end_turn_on_cell`, `negate_hit_on_own_turn`, `skip_cinder_one_tile`, `res_if_leftover_ap_ge_3`, `summon_walk_ap_tax`, `heal_if_caster_spent_zero_walk_mp`, `own_remaining_cds_do_not_tick`, `tax_next_spell_if_walked_last_turn`, `remove_adjacent_barrier`, `overwatch_snap_grants_watcher_ap`, `bonus_if_leftover_ap_eq_2`, `bonus_if_target_has_allied_summon_in_2`, `heal_if_both_leftover_ap_eq_0`, `pack_next_spell_min_range_3`, `fold_two_adjacent_player_side`) have no decide* branch.  
SYSTEMS_AFFECTED: `enemyAI.ts` decide*; kit resolve  
RECOMMENDED_ACTION: Implement each hint as a predicate on explicit flags / leftover AP / diagonal dest / void cell / force-move / barrier occupancy. Drop name fallbacks. Do not assign Still Mend / Dry Mend to non-healer CORE. Do not assign Void Reel when no void/portal exists. Do not assign Adj Fold outside boss AI. Missing hint → drop id, log once.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: SDE-2026-08-31-006; SDE-2026-09-01-003; SDE-2026-09-27-003  
REGRESSION_RISK: HIGH if Brick Crack seals the last path, Void Reel pulls onto a world portal, or Pack Long is granted.  
VALIDATION_REQUIRED: Diag Stride confirm fails on orthogonal dest. Pack Long / Adj Fold never owned. Still Mend absent from non-healer CORE.  
STATUS: NEW  

---

ACTION_ID: SDE-2026-09-28-004  
SOURCE_AUTOMATION: Dynamic Spell Discovery and Enemy Spell Evolution Designer  
TITLE: Implement Wave-11 definitions as data + pool rows  
CATEGORY: catalog-wave  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Unique §11 ids are absent from `spellData.ts` / `SPELL_ID_CATALOG` (32 live ids). Same-day-previous #695 reserved Both Mend … Court Keep. Same-day #726 reserved Heave Mend … Court Dual. Tombstone in Wave-11 §0.1 must not be reused. Every frontend `mpCost` is still 0 except the three sibling spenders once they land.  
SYSTEMS_AFFECTED: `spellData.ts`; `bossKits.ts` catalog; family `EnemyKit` pools  
RECOMMENDED_ACTION: Add unique SDE ids one at a time with full metadata. **Stamp** #646 and #695 ids onto Wave-11 family CORE — do not clone them. **Stamp** #726 onto Wave 12 family CORE — do not clone Heave Mend as Force Mend. Unique §11 stay `mpCost: 0`. `spell-pack-long` / `spell-adj-fold` never enter `ownedSpellIds`. Never `if (spell.name === …)`.  
AUTONOMY: HUMAN_APPROVE — each id is a combat toy.  
DEPENDENCIES: SDE-2026-09-28-001; SDE-2026-09-28-002; SDE-2026-09-28-003  
REGRESSION_RISK: HIGH per id if wired by name, assigned to the wrong profile, or if Brick Crack skips `finalizePlayableLayout`.  
VALIDATION_REQUIRED: `validateBossKits()` still passes. Typecheck clean. G=10 Tide has no Diag Stride.  
STATUS: NEW  

---

ACTION_ID: SDE-2026-09-28-005  
SOURCE_AUTOMATION: Dynamic Spell Discovery and Enemy Spell Evolution Designer  
TITLE: Do not restamp feat / challenge / #695 / #726 extra doors  
CATEGORY: feat-challenge-boss  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Achievements still Doka-only (`admin.mo` 309–326). All 15 feat doors are claimed or leftover. `survivor` stays leftover (Last Ember / Last Ward). #695 already claimed `both_cantor` / `stride_bursar` / `span_penta` / `trim_precentor` / `court_keep_regent`. #726 already claimed `heave_cantor` / `dual_bursar` / `span_sept` / `halve_precentor` / `court_dual_regent`. #663 already claimed `sole_thurifer` / `bias_prebendary` / `brick_cellarer` / `rebound_almoner`. Do not use `unstoppable` / `level_10`.  
SYSTEMS_AFFECTED: `AchievementConfig`; challenge persist; boss-clear persist  
RECOMMENDED_ACTION: Unique Wave-11 grants are observe+win / ELITE / `diag_gallery` only. Do not restamp `survivor` / `jackpot` / `leader_slayer` / `spell_master`. Do not restamp #695 extra doors. Do not restamp #726 extra doors. Pack Long / Adj Fold never write `ownedSpellIds`.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: SDE-2026-08-31-007; SDE-2026-09-27-005; SDE-2026-09-28-001  
REGRESSION_RISK: MEDIUM — remount must not double-grant; first MULTI child wins.  
VALIDATION_REQUIRED: No new `AchievementConfig` row. `survivor` still Doka-only.  
STATUS: NEW  

---

ACTION_ID: SDE-2026-09-28-006  
SOURCE_AUTOMATION: Dynamic Spell Discovery and Enemy Spell Evolution Designer  
TITLE: Add diag_gallery, mid_nave, void_aisle, dwell_pulpit, crack_nave as tagged encounters  
CATEGORY: special-encounter  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Wave-10 specials (`inch_gallery` / `rite_nave` / `reach_nave` / `ash_aisle` / `pin_nave`) already own those tags. `fog_of_war` is still an announce-only stub.  
SYSTEMS_AFFECTED: encounter tag table; kit overlay  
RECOMMENDED_ACTION: Tag existing solvable layouts. All five teach via observe+win (Diag Stride / Mid Oath / Void Reel / Dwell Mark / Brick Crack). Do not retag `inch_gallery` / `pair_gallery` / `ash_aisle` / `pin_nave`. Do not edit `mapGen.ts` algorithms. Do not invent a second recap. World portals stay locked while hostiles live. Void Reel pads are not `map.portals`.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: SDE-2026-08-31-003; SDE-2026-09-27-006; SDE-2026-09-28-005  
REGRESSION_RISK: MEDIUM if a tag seals portals, skips `finalizePlayableLayout`, or treats void cells as Twin Gate pads.  
VALIDATION_REQUIRED: Maps stay solvable. Defeat does not grant. `ash_aisle` still teaches Cinder Reel, not Void Reel.  
STATUS: NEW  

---

ACTION_ID: SDE-2026-09-28-007  
SOURCE_AUTOMATION: Dynamic Spell Discovery and Enemy Spell Evolution Designer  
TITLE: Observation edge cases for diagonal walk, void pull, end-turn paint, own-turn plate, and fizzle  
CATEGORY: discovery-pipeline  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Wave-1 observe is “cast spent AP.” Diag Stride observes on the **arm**, not the later walk. Dwell Mark observes on **paint**, not the end-turn detonate. Own Plate observes on the **arm**, not the negated hit. Void Reel with no void/portal fizzles after AP — still observes. Pack Long / Adj Fold never persist.  
SYSTEMS_AFFECTED: observe hook; recap; challenge HP/AP helpers  
RECOMMENDED_ACTION: Observe on Diag Stride / Mid Oath / Own Plate / Cinder Skip / Cadence Rest **arm**. Fizzle after AP spend still observes (Void Reel empty, Full Plate leftover AP 2, Brick Crack would seal, Dry Mend leftover AP ≥ 1). Illegal confirm (no AP) does not. Cinder Skip consume is environmental if they then walk onto lava — use existing hazard ticks. Still Mend / Dry Mend HP gain uses existing healUsed only when player-side HP actually increased. `ENEMY_ONLY` / `BOSS_ONLY` never write `ownedSpellIds`. Player summons never observe.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: SDE-2026-08-31-002; SDE-2026-09-27-007; SDE-2026-09-28-004  
REGRESSION_RISK: HIGH if end-turn detonate double-observes, Pack Long is granted, or Brick Crack skips solvability.  
VALIDATION_REQUIRED: Wave-11 QA rows W11-1…W11-12, W11-20.  
STATUS: NEW  

---

ACTION_ID: SDE-2026-09-28-008  
SOURCE_AUTOMATION: Dynamic Spell Discovery and Enemy Spell Evolution Designer  
TITLE: Recap cards must list Wave-11 fields on the existing popup  
CATEGORY: discovery-ux  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `PostBattleRecap.tsx` 6–34 still has no `discoveredSpells`. Wave-1 SDE-003 owns the field; Wave-11 only requires the same card shape (name, role, AP, range, target, key effect, source enemy).  
SYSTEMS_AFFECTED: `BattleRecapData`; recap chrome  
RECOMMENDED_ACTION: Do not add a second popup. Stack up to 4 cards. Defeat never shows `NEW SPELL DISCOVERED`. Carved-stone / crimson only. In-battle cue remains `TECHNIQUE OBSERVED`.  
AUTONOMY: IMPLEMENT_AFTER_HUMAN  
DEPENDENCIES: SDE-2026-08-31-003; SDE-2026-08-31-004; SDE-2026-09-27-008  
REGRESSION_RISK: LOW for combat. MEDIUM if a second modal appears.  
VALIDATION_REQUIRED: One recap at `App.tsx` root.  
STATUS: NEW  
