# ACTION_IDs — 2026-09-29 Dynamic Spell Discovery & Enemy Spell Evolution

Durable ledger for implementers and the Report Action Orchestrator.  
Source of every record: Dynamic Spell Discovery and Enemy Spell Evolution Designer.  
Design contract: [`SPELL_DISCOVERY_ECOSYSTEM_2026-09-29.md`](./SPELL_DISCOVERY_ECOSYSTEM_2026-09-29.md).  
Wave-1 law (still blocking): [`SPELL_DISCOVERY_ECOSYSTEM_2026-08-31.md`](./SPELL_DISCOVERY_ECOSYSTEM_2026-08-31.md) and `SDE-2026-08-31-001`…`009`.  
Wave-2…11 generation stamps (still blocking): `SDE-2026-09-01-001`…`008` through `SDE-2026-09-28-001`…`008`.  
Do not implement gameplay from this file unless a later human or orchestrator explicitly picks an ID. This run ships **docs only**.

Sibling ledgers (do not re-open): tactical ids in PRs #120 / #185 / #282 / #342 / #411 / #463 / #525 / #563 / #636 / #695 / **#726** / **#787**; family sheets through **#752**; boss extras through **#753**; Wave-1…11 SDE ids including memory-reserved Wave 5; encounter rooms in **#771**.

---

ACTION_ID: SDE-2026-09-29-001  
SOURCE_AUTOMATION: Dynamic Spell Discovery and Enemy Spell Evolution Designer  
TITLE: Do not land Wave-12 data before Wave-1 ownership split and G resolve through Wave 11  
CATEGORY: dependency  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: `WorldExploration.tsx` 2395–2440 still forces every `starterSpells` row `isBaseSpell: true`. `BattleRecapData` (`PostBattleRecap.tsx` 6–34) has no `discoveredSpells`. `buildEnemyKit(enemy.pieceType, currentMap.levelZone)` at WX 11920 still passes a `{ name, minLevel, maxLevel }` object. Wave-1 P0 through Wave-11 P0 are still NEW. Adding 19 ids to the always-owned catalog would make discovery worse.  
SYSTEMS_AFFECTED: hydrate; recap; catalog; kit resolve  
RECOMMENDED_ACTION: Keep Wave-12 definitions `STATUS: PROPOSED` until innate four + observe + `commitSpellDiscoveries` + numeric `G` exist. Do not append Wave-12 ids to `starterSpells`.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: SDE-2026-08-31-001; SDE-2026-08-31-002; SDE-2026-08-31-003; SDE-2026-09-01-001; SDE-2026-09-28-001  
REGRESSION_RISK: HIGH if ignored (catalog pre-own; G12 verbs on G=0 kits).  
VALIDATION_REQUIRED: New character still owns only the four innate ids after Wave-1 split. `generationMin: 12` absent at G≤11.  
STATUS: NEW  

---

ACTION_ID: SDE-2026-09-29-002  
SOURCE_AUTOMATION: Dynamic Spell Discovery and Enemy Spell Evolution Designer  
TITLE: Resolve a G≥12 extra pool slot with generationMin  
CATEGORY: pool-evolution  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Wave-11 SDE-2026-09-28-002 asked for a G≥11 extra slot. Wave 12 stamps `generationMin: 12` on unique family verbs. `Math.floor(levelZone)` is still NaN (`enemyAI.ts` 194–199; WX 11920). `computeAITier` still plateaus at label 10 (`combatMath.ts` 36–52).  
SYSTEMS_AFFECTED: `resolveEnemyKit`; family overlays  
RECOMMENDED_ACTION: After SDE-2026-09-28-002, at G≥12 allow one extra ADVANCED/RARE/ELITE with `generationMin ≤ G`. Never retire CORE or G11. Empty → `[physical_attack]`. Do not retune `pickEnemyLevelFromTiers`. No `G_max`. Wave-12 family CORE consumes unique **#679** Wave-10 verbs **and** **#726** tactical Wave-11 ids. Unique §11 stay extras, not that CORE. Unique Wave-11 §11 stay extras until Wave 13. **#787** is Wave 13 CORE, not this CORE.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: SDE-2026-09-28-002; SDE-2026-08-31-005; SDE-2026-08-31-006  
REGRESSION_RISK: MEDIUM — G=11 Tide must not receive Orth Stride; empty kit must stay armed.  
VALIDATION_REQUIRED: Peer pawn still has Strike. `generationMin: 12` absent at G≤11.  
STATUS: NEW  

---

ACTION_ID: SDE-2026-09-29-003  
SOURCE_AUTOMATION: Dynamic Spell Discovery and Enemy Spell Evolution Designer  
TITLE: Wire Wave-12 aiHints before assigning those ids  
CATEGORY: ai-compat  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: `inferArchetype` (`enemyAI.ts` 447–452) still maps any `healAmount > 0` to healer. Summon fallback still uses name (`enemyAI.ts` 217–224). New hints (`walk_orthogonal_only`, `next_spell_exact_chebyshev_3`, `attract_toward_nearest_barrier`, `bonus_if_target_isolated`, `detonate_if_start_turn_on_cell`, `negate_hit_if_leftover_mp_ge_1`, `skip_glyph_tax_one_tile`, `res_if_leftover_mp_ge_3`, `summon_walk_mp_tax`, `heal_if_target_spent_zero_walk_mp`, `next_own_spell_skips_cooldown`, `tax_next_walk_if_spelled_last_turn`, `orbit_adjacent_barrier`, `overwatch_snap_grants_walker_ap`, `bonus_if_leftover_mp_eq_2`, `bonus_if_target_shares_axis_with_allied_summon`, `heal_if_both_leftover_mp_eq_0`, `pack_next_spell_max_range_2`, `fold_two_player_side_exact_2`) have no decide* branch.  
SYSTEMS_AFFECTED: `enemyAI.ts` decide*; kit resolve  
RECOMMENDED_ACTION: Implement each hint as a predicate on explicit flags / leftover MP / orthogonal dest / barrier occupancy / start-of-turn occupy. Drop name fallbacks. Do not assign Still Gift / Dry Gait to non-healer CORE. Do not assign Brick Reel when no barrier exists. Do not assign Reach Fold outside boss AI. Missing hint → drop id, log once.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: SDE-2026-08-31-006; SDE-2026-09-01-003; SDE-2026-09-28-003  
REGRESSION_RISK: HIGH if Brick Orbit seals the last path, Brick Reel pulls onto a world portal, or Pack Cap is granted.  
VALIDATION_REQUIRED: Orth Stride confirm fails on a diagonal dest. Pack Cap / Reach Fold never owned. Still Gift absent from non-healer CORE.  
STATUS: NEW  

---

ACTION_ID: SDE-2026-09-29-004  
SOURCE_AUTOMATION: Dynamic Spell Discovery and Enemy Spell Evolution Designer  
TITLE: Implement Wave-12 definitions as data + pool rows  
CATEGORY: catalog-wave  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Unique §11 ids are absent from `spellData.ts` / `SPELL_ID_CATALOG` (32 live ids). #679 reserved Inch Stride … Mid Fold. #726 reserved Heave Mend … Court Dual. #747 reserved Diag Stride … Adj Fold. Same-day #787 reserved Parched Mend … Court Imprint. Tombstone in Wave-12 §0.1 must not be reused. Every frontend `mpCost` is still 0 except the three sibling spenders once they land.  
SYSTEMS_AFFECTED: `spellData.ts`; `bossKits.ts` catalog; family `EnemyKit` pools  
RECOMMENDED_ACTION: Add unique SDE ids one at a time with full metadata. **Stamp** #679 and #726 ids onto Wave-12 family CORE — do not clone them. **Stamp** #787 onto Wave 13 family CORE — do not clone Cadence Imprint as Cadence Grace. Unique §11 `spell-dry-gait` **wins** both leftover-MP=0 heal; **do not ship** `spell-parched-mend`. Unique §11 stay `mpCost: 0`. `spell-pack-cap` / `spell-reach-fold` never enter `ownedSpellIds`. Never `if (spell.name === …)`.  
AUTONOMY: HUMAN_APPROVE — each id is a combat toy.  
DEPENDENCIES: SDE-2026-09-29-001; SDE-2026-09-29-002; SDE-2026-09-29-003  
REGRESSION_RISK: HIGH per id if wired by name, assigned to the wrong profile, or if Brick Orbit skips `finalizePlayableLayout`.  
VALIDATION_REQUIRED: `validateBossKits()` still passes. Typecheck clean. G=11 Tide has no Orth Stride.  
STATUS: NEW  

---

ACTION_ID: SDE-2026-09-29-005  
SOURCE_AUTOMATION: Dynamic Spell Discovery and Enemy Spell Evolution Designer  
TITLE: Do not restamp feat / challenge / #726 / #753 / #787 extra doors  
CATEGORY: feat-challenge-boss  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Achievements still Doka-only (`admin.mo` 309–326). All 15 feat doors are claimed or leftover. `survivor` stays leftover (Last Ember / Last Ward). #726 already claimed `heave_cantor` / `dual_bursar` / `span_sept` / `halve_precentor` / `court_dual_regent`. #753 already claimed `infirm_chanter` / `yoke_subchanter` / `salve_wicker` / `brand_curate`. #787 already claimed `parched_cantor` / `imprint_precentor` / `span_six` / `court_imprint_regent`. Do not use `unstoppable` / `level_10`.  
SYSTEMS_AFFECTED: `AchievementConfig`; challenge persist; boss-clear persist  
RECOMMENDED_ACTION: Unique Wave-12 grants are observe+win / ELITE / `orth_gallery` only. Do not restamp `survivor` / `jackpot` / `leader_slayer` / `spell_master`. Do not restamp #726 extra doors. Do not restamp #753 extra doors. Do not restamp #787 extra doors. Pack Cap / Reach Fold never write `ownedSpellIds`. Do not ship Parched Mend beside Dry Gait.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: SDE-2026-08-31-007; SDE-2026-09-28-005; SDE-2026-09-29-001  
REGRESSION_RISK: MEDIUM — remount must not double-grant; first MULTI child wins.  
VALIDATION_REQUIRED: No new `AchievementConfig` row. `survivor` still Doka-only.  
STATUS: NEW  

---

ACTION_ID: SDE-2026-09-29-006  
SOURCE_AUTOMATION: Dynamic Spell Discovery and Enemy Spell Evolution Designer  
TITLE: Add orth_gallery, tri_nave, brick_aisle, wake_pulpit, orbit_nave as tagged encounters  
CATEGORY: special-encounter  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Wave-11 specials (`diag_gallery` / `mid_nave` / `void_aisle` / `dwell_pulpit` / `crack_nave`) already own those tags. #771 owns Bash/Dry/Hood primer rooms. `fog_of_war` is still an announce-only stub.  
SYSTEMS_AFFECTED: encounter tag table; kit overlay  
RECOMMENDED_ACTION: Tag existing solvable layouts. All five teach via observe+win (Orth Stride / Tri Oath / Brick Reel / Wake Mark / Brick Orbit). Do not retag `diag_gallery` / `mid_nave` / `crack_nave` / `dwell_pulpit` / `reach_nave`. Do not consume #771 `ENC-BASH-*` / `ENC-DRY-*` / `ENC-HOOD-*` ids. Do not edit `mapGen.ts` algorithms. Do not invent a second recap. World portals stay locked while hostiles live.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: SDE-2026-08-31-003; SDE-2026-09-28-006; SDE-2026-09-29-005  
REGRESSION_RISK: MEDIUM if a tag seals portals, skips `finalizePlayableLayout`, or treats barrier cells as Twin Gate pads.  
VALIDATION_REQUIRED: Maps stay solvable. Defeat does not grant. `crack_nave` still teaches Brick Crack, not Brick Orbit.  
STATUS: NEW  

---

ACTION_ID: SDE-2026-09-29-007  
SOURCE_AUTOMATION: Dynamic Spell Discovery and Enemy Spell Evolution Designer  
TITLE: Observation edge cases for orthogonal walk, barrier pull, start-turn paint, gait plate, and fizzle  
CATEGORY: discovery-pipeline  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Wave-1 observe is “cast spent AP.” Orth Stride observes on the **arm**, not the later walk. Wake Mark observes on **paint**, not the start-turn detonate. Gait Plate observes on the **arm**, not the negated hit. Brick Reel with no barrier fizzles after AP — still observes. Pack Cap / Reach Fold never persist.  
SYSTEMS_AFFECTED: observe hook; recap; challenge HP/AP helpers  
RECOMMENDED_ACTION: Observe on Orth Stride / Tri Oath / Gait Plate / Glyph Skip / Cadence Grace **arm**. Fizzle after AP spend still observes (Brick Reel empty, Full Gait leftover MP 2, Brick Orbit would seal, Dry Gait leftover MP ≥ 1). Illegal confirm (no AP) does not. Glyph Skip consume is environmental if they then walk onto lava — use existing hazard ticks. Still Gift / Dry Gait HP gain uses existing healUsed only when player-side HP actually increased. `ENEMY_ONLY` / `BOSS_ONLY` never write `ownedSpellIds`. Player summons never observe.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: SDE-2026-08-31-002; SDE-2026-09-28-007; SDE-2026-09-29-004  
REGRESSION_RISK: HIGH if start-turn detonate double-observes, Pack Cap is granted, or Brick Orbit skips solvability.  
VALIDATION_REQUIRED: Wave-12 QA rows W12-1…W12-12, W12-20.  
STATUS: NEW  

---

ACTION_ID: SDE-2026-09-29-008  
SOURCE_AUTOMATION: Dynamic Spell Discovery and Enemy Spell Evolution Designer  
TITLE: Recap cards must list Wave-12 fields on the existing popup  
CATEGORY: discovery-ux  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `PostBattleRecap.tsx` 6–34 still has no `discoveredSpells`. Wave-1 SDE-003 owns the field; Wave-12 only requires the same card shape (name, role, AP, range, target, key effect, source enemy).  
SYSTEMS_AFFECTED: `BattleRecapData`; recap chrome  
RECOMMENDED_ACTION: Do not add a second popup. Stack up to 4 cards. Defeat never shows `NEW SPELL DISCOVERED`. Carved-stone / crimson only. In-battle cue remains `TECHNIQUE OBSERVED`.  
AUTONOMY: IMPLEMENT_AFTER_HUMAN  
DEPENDENCIES: SDE-2026-08-31-003; SDE-2026-08-31-004; SDE-2026-09-28-008  
REGRESSION_RISK: LOW for combat. MEDIUM if a second modal appears.  
VALIDATION_REQUIRED: One recap at `App.tsx` root.  
STATUS: NEW  
