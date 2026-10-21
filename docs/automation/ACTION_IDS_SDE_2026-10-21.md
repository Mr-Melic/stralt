# ACTION_IDs — 2026-10-21 Dynamic Spell Discovery & Enemy Spell Evolution

Durable ledger for implementers and the Report Action Orchestrator.  
Source of every record: Dynamic Spell Discovery and Enemy Spell Evolution Designer.  
Design contract: [`SPELL_DISCOVERY_ECOSYSTEM_2026-10-21.md`](./SPELL_DISCOVERY_ECOSYSTEM_2026-10-21.md).  
Wave-1 law (still blocking): [`SPELL_DISCOVERY_ECOSYSTEM_2026-08-31.md`](./SPELL_DISCOVERY_ECOSYSTEM_2026-08-31.md) and `SDE-2026-08-31-001`…`009`.  
Wave-2…12 generation stamps (still blocking): `SDE-2026-09-01-001`…`008` through `SDE-2026-09-29-001`…`008`.  
Do not implement gameplay from this file unless a later human or orchestrator explicitly picks an ID. This run ships **docs only**.

Sibling ledgers (do not re-open): tactical ids in PRs #120 / #185 / #282 / #342 / #411 / #463 / #525 / #563 / #636 / #695 / #726 / #787; family sheets through **#796**; boss extras through **#808**; Wave-1…12 SDE ids including memory-reserved Wave 5; encounter rooms in **#771** and same-day **#826**; same-day admin **#815**.

---

ACTION_ID: SDE-2026-10-21-001  
SOURCE_AUTOMATION: Dynamic Spell Discovery and Enemy Spell Evolution Designer  
TITLE: Do not land Wave-13 data before Wave-1 ownership split and G resolve through Wave 12  
CATEGORY: dependency  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: HEAD is still `0f5363f`. `WorldExploration.tsx` 2395–2440 still forces every `starterSpells` row `isBaseSpell: true`. `BattleRecapData` (`PostBattleRecap.tsx` 6–34) has no `discoveredSpells`. `buildEnemyKit(enemy.pieceType, currentMap.levelZone)` at WX 11920 still passes a `{ name, minLevel, maxLevel }` object. Wave-1 P0 through Wave-12 P0 are still NEW. Adding 19 ids to the always-owned catalog would make discovery worse.  
SYSTEMS_AFFECTED: hydrate; recap; catalog; kit resolve  
RECOMMENDED_ACTION: Keep Wave-13 definitions `STATUS: PROPOSED` until innate four + observe + `commitSpellDiscoveries` + numeric `G` exist. Do not append Wave-13 ids to `starterSpells`.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: SDE-2026-08-31-001; SDE-2026-08-31-002; SDE-2026-08-31-003; SDE-2026-09-01-001; SDE-2026-09-29-001  
REGRESSION_RISK: HIGH if ignored (catalog pre-own; G13 verbs on G=0 kits).  
VALIDATION_REQUIRED: New character still owns only the four innate ids after Wave-1 split. `generationMin: 13` absent at G≤12.  
STATUS: NEW  

---

ACTION_ID: SDE-2026-10-21-002  
SOURCE_AUTOMATION: Dynamic Spell Discovery and Enemy Spell Evolution Designer  
TITLE: Resolve a G≥13 extra pool slot with generationMin  
CATEGORY: pool-evolution  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Wave-12 SDE-2026-09-29-002 asked for a G≥12 extra slot. Wave 13 stamps `generationMin: 13` on unique family verbs. `Math.floor(levelZone)` is still NaN (`enemyAI.ts` 194–199; WX 11920). `computeAITier` still plateaus at label 10 (`combatMath.ts` 36–52).  
SYSTEMS_AFFECTED: `resolveEnemyKit`; family overlays  
RECOMMENDED_ACTION: After SDE-2026-09-29-002, at G≥13 allow one extra ADVANCED/RARE/ELITE with `generationMin ≤ G`. Never retire CORE or G12. Empty → `[physical_attack]`. Do not retune `pickEnemyLevelFromTiers`. No `G_max`. Wave-13 family CORE consumes unique **#747** Wave-11 verbs **and** **#787** tactical Wave-12 ids (except Parched Mend). Unique §11 stay extras, not that CORE. Unique Wave-12 §11 stay extras until Wave 14.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: SDE-2026-09-29-002; SDE-2026-08-31-005; SDE-2026-08-31-006  
REGRESSION_RISK: MEDIUM — G=12 Tide must not receive Knight Stride; empty kit must stay armed.  
VALIDATION_REQUIRED: Peer pawn still has Strike. `generationMin: 13` absent at G≤12.  
STATUS: NEW  

---

ACTION_ID: SDE-2026-10-21-003  
SOURCE_AUTOMATION: Dynamic Spell Discovery and Enemy Spell Evolution Designer  
TITLE: Wire Wave-13 aiHints before assigning those ids  
CATEGORY: ai-compat  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: `inferArchetype` (`enemyAI.ts` 447–452) still maps any `healAmount > 0` to healer. Summon fallback still uses name (`enemyAI.ts` 217–224). New hints (`walk_knight_only`, `next_spell_exact_chebyshev_4`, `attract_toward_nearest_pit`, `bonus_if_share_axis_with_caster`, `detonate_if_force_moved_onto`, `negate_hit_if_leftover_ap_ge_1`, `skip_rime_leave_tax_one_tile`, `bonus_if_leftover_ap_ge_3`, `summon_spell_ap_tax`, `heal_if_target_both_pools_zero`, `swap_remaining_cooldowns`, `tax_next_walk_if_struck_last_turn`, `nudge_adjacent_barrier_away`, `overwatch_snap_steal_walker_ap`, `bonus_if_leftover_mp_eq_1`, `bonus_if_target_on_hazard`, `heal_if_target_force_moved`, `pack_walk_share_champion_file`, `fold_two_player_side_diagonal`) have no decide* branch.  
SYSTEMS_AFFECTED: `enemyAI.ts` decide*; kit resolve  
RECOMMENDED_ACTION: Implement each hint as a predicate on explicit flags / leftover AP-MP / knight dest / pit occupancy / force-move landings / remaining CDs. Drop name fallbacks. Do not assign Hollow Gift / Drift Gift to non-healer CORE. Do not assign Pit Reel when no pit exists. Do not assign Diag Fold outside boss AI. Missing hint → drop id, log once.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: SDE-2026-08-31-006; SDE-2026-09-01-003; SDE-2026-09-29-003  
REGRESSION_RISK: HIGH if Brick Nudge seals the last path, Pit Reel pulls onto a world portal, or Pack File is granted.  
VALIDATION_REQUIRED: Knight Stride confirm fails on an orthogonal dest. Pack File / Diag Fold never owned. Hollow Gift absent from non-healer CORE.  
STATUS: NEW  

---

ACTION_ID: SDE-2026-10-21-004  
SOURCE_AUTOMATION: Dynamic Spell Discovery and Enemy Spell Evolution Designer  
TITLE: Implement Wave-13 definitions as data + pool rows  
CATEGORY: catalog-wave  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Unique §11 ids are absent from `spellData.ts` / `SPELL_ID_CATALOG` (32 live ids). #747 reserved Diag Stride … Adj Fold. #787 reserved Parched Mend … Court Imprint. #802 reserved Orth Stride … Reach Fold. Tombstone in Wave-13 §0.1 must not be reused. Every frontend `mpCost` is still 0 except the three sibling spenders once they land.  
SYSTEMS_AFFECTED: `spellData.ts`; `bossKits.ts` catalog; family `EnemyKit` pools  
RECOMMENDED_ACTION: Add unique SDE ids one at a time with full metadata. **Stamp** #747 and #787 ids onto Wave-13 family CORE — do not clone them. **Do not ship** `spell-parched-mend` (Dry Gait owns both leftover-MP=0 heal). Unique §11 stay `mpCost: 0`. `spell-pack-file` / `spell-diag-fold` never enter `ownedSpellIds`. Never `if (spell.name === …)`. Do not clone Spent Tax as Strike Debt, Pack Long as Pack File, or Full Plate as Full Sting.  
AUTONOMY: HUMAN_APPROVE — each id is a combat toy.  
DEPENDENCIES: SDE-2026-10-21-001; SDE-2026-10-21-002; SDE-2026-10-21-003  
REGRESSION_RISK: HIGH per id if wired by name, assigned to the wrong profile, or if Brick Nudge skips `finalizePlayableLayout`.  
VALIDATION_REQUIRED: `validateBossKits()` still passes. Typecheck clean. G=12 Tide has no Knight Stride.  
STATUS: NEW  

---

ACTION_ID: SDE-2026-10-21-005  
SOURCE_AUTOMATION: Dynamic Spell Discovery and Enemy Spell Evolution Designer  
TITLE: Do not restamp feat / challenge / #787 / #802 / #808 extra doors  
CATEGORY: feat-challenge-boss  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Achievements still Doka-only (`admin.mo` 309–326). All 15 feat doors are claimed or leftover. `survivor` stays leftover (Last Ember / Last Ward). #787 already claimed `parched_cantor` / `imprint_precentor` / `span_six` / `court_imprint_regent`. #802 already claimed `orth_gallery` / `tri_nave` / `brick_aisle` / `wake_pulpit` / `orbit_nave` / `cap_precentor` / `reach_fold_regent`. #808 already claimed `flush_psalmist` / `lone_lector` / `plate_bursar` / `lend_proctor`. Do not use `unstoppable` / `level_10`.  
SYSTEMS_AFFECTED: `AchievementConfig`; challenge persist; boss-clear persist  
RECOMMENDED_ACTION: Unique Wave-13 grants are observe+win / ELITE / `knight_gallery` only. Do not restamp `survivor` / `jackpot` / `leader_slayer` / `spell_master`. Do not restamp #787 extra doors. Do not restamp #802 rooms or Pack Cap / Reach Fold doors. Do not restamp #808 extra doors. Pack File / Diag Fold never write `ownedSpellIds`.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: SDE-2026-08-31-007; SDE-2026-09-29-005; SDE-2026-10-21-001  
REGRESSION_RISK: MEDIUM — remount must not double-grant; first MULTI child wins.  
VALIDATION_REQUIRED: No new `AchievementConfig` row. `survivor` still Doka-only.  
STATUS: NEW  

---

ACTION_ID: SDE-2026-10-21-006  
SOURCE_AUTOMATION: Dynamic Spell Discovery and Enemy Spell Evolution Designer  
TITLE: Add knight_gallery, quad_nave, pit_aisle, shunt_pulpit, nudge_nave as tagged encounters  
CATEGORY: special-encounter  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Wave-12 specials (`orth_gallery` / `tri_nave` / `brick_aisle` / `wake_pulpit` / `orbit_nave`) already own those tags. Wave-4 `pit_gallery` owns Pit Sight. #771 owns Bash/Dry/Hood primer rooms. `fog_of_war` is still an announce-only stub.  
SYSTEMS_AFFECTED: encounter tag table; kit overlay  
RECOMMENDED_ACTION: Tag existing solvable layouts. All five teach via observe+win (Knight Stride / Quad Oath / Pit Reel / Shove Mark / Brick Nudge). Do not retag `orth_gallery` / `diag_gallery` / `pit_gallery` / `crack_nave` / `orbit_nave`. Do not consume #771 `ENC-BASH-*` / `ENC-DRY-*` / `ENC-HOOD-*` ids. Do not consume #826 `ENC-TEACH-13` / `ENC-SPELL-25` / `ENC-NEAR-01` / other 2026-10-21 ENC-* ids. Do not edit `mapGen.ts` algorithms. Do not invent a second recap. World portals stay locked while hostiles live.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: SDE-2026-08-31-003; SDE-2026-09-29-006; SDE-2026-10-21-005  
REGRESSION_RISK: MEDIUM if a tag seals portals, skips `finalizePlayableLayout`, or treats pit cells as Twin Gate pads.  
VALIDATION_REQUIRED: Maps stay solvable. Defeat does not grant. `pit_gallery` still teaches Pit Sight, not Pit Reel.  
STATUS: NEW  

---

ACTION_ID: SDE-2026-10-21-007  
SOURCE_AUTOMATION: Dynamic Spell Discovery and Enemy Spell Evolution Designer  
TITLE: Observation edge cases for knight walk, pit pull, force-move paint, spent plate, and fizzle  
CATEGORY: discovery-pipeline  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Wave-1 observe is “cast spent AP.” Knight Stride observes on the **arm**, not the later walk. Shove Mark observes on **paint**, not the force-move detonate. Spent Plate observes on the **arm**, not the negated hit. Pit Reel with no pit fizzles after AP — still observes. Pack File / Diag Fold never persist.  
SYSTEMS_AFFECTED: observe hook; recap; challenge HP/AP helpers  
RECOMMENDED_ACTION: Observe on Knight Stride / Quad Oath / Spent Plate / Rime Skip / Cadence Swap **arm**. Fizzle after AP spend still observes (Pit Reel empty, Full Sting leftover AP 2, Brick Nudge would seal, Hollow Gift leftover AP or MP ≥ 1). Illegal confirm (no AP) does not. Rime Skip consume is environmental if they then walk onto lava — use existing hazard ticks. Hollow Gift / Drift Gift HP gain uses existing healUsed only when player-side HP actually increased. `ENEMY_ONLY` / `BOSS_ONLY` never write `ownedSpellIds`. Player summons never observe.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: SDE-2026-08-31-002; SDE-2026-09-29-007; SDE-2026-10-21-004  
REGRESSION_RISK: HIGH if force-move detonate double-observes, Pack File is granted, or Brick Nudge skips solvability.  
VALIDATION_REQUIRED: Wave-13 QA rows W13-1…W13-12, W13-20.  
STATUS: NEW  

---

ACTION_ID: SDE-2026-10-21-008  
SOURCE_AUTOMATION: Dynamic Spell Discovery and Enemy Spell Evolution Designer  
TITLE: Recap cards must list Wave-13 fields on the existing popup  
CATEGORY: discovery-ux  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `PostBattleRecap.tsx` 6–34 still has no `discoveredSpells`. Wave-1 SDE-003 owns the field; Wave-13 only requires the same card shape (name, role, AP, range, target, key effect, source enemy).  
SYSTEMS_AFFECTED: `BattleRecapData`; recap chrome  
RECOMMENDED_ACTION: Do not add a second popup. Stack up to 4 cards. Defeat never shows `NEW SPELL DISCOVERED`. Carved-stone / crimson only. In-battle cue remains `TECHNIQUE OBSERVED`.  
AUTONOMY: IMPLEMENT_AFTER_HUMAN  
DEPENDENCIES: SDE-2026-08-31-003; SDE-2026-08-31-004; SDE-2026-09-29-008  
REGRESSION_RISK: LOW for combat. MEDIUM if a second modal appears.  
VALIDATION_REQUIRED: One recap at `App.tsx` root.  
STATUS: NEW  
