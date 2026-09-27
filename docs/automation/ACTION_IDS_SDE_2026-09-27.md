# ACTION_IDs — 2026-09-27 Dynamic Spell Discovery & Enemy Spell Evolution

Durable ledger for implementers and the Report Action Orchestrator.  
Source of every record: Dynamic Spell Discovery and Enemy Spell Evolution Designer.  
Design contract: [`SPELL_DISCOVERY_ECOSYSTEM_2026-09-27.md`](./SPELL_DISCOVERY_ECOSYSTEM_2026-09-27.md).  
Wave-1 law (still blocking): [`SPELL_DISCOVERY_ECOSYSTEM_2026-08-31.md`](./SPELL_DISCOVERY_ECOSYSTEM_2026-08-31.md) and `SDE-2026-08-31-001`…`009`.  
Wave-2 generation stamp (still blocking): [`SPELL_DISCOVERY_ECOSYSTEM_2026-09-01.md`](./SPELL_DISCOVERY_ECOSYSTEM_2026-09-01.md) and `SDE-2026-09-01-001`…`008`.  
Wave-3 G≥3 extra slot (still blocking): [`SPELL_DISCOVERY_ECOSYSTEM_2026-09-02.md`](./SPELL_DISCOVERY_ECOSYSTEM_2026-09-02.md) and `SDE-2026-09-02-001`…`008`.  
Wave-4 G≥4 extra slot (still blocking): still-open #371 [`SPELL_DISCOVERY_ECOSYSTEM_2026-09-21.md`](https://github.com/Mr-Melic/stralt/blob/cursor/spell-discovery-and-evolution-2940/docs/automation/SPELL_DISCOVERY_ECOSYSTEM_2026-09-21.md) and `SDE-2026-09-21-001`…`008`.  
Wave-6 G≥6 extra slot (still blocking): still-open #480 [`SPELL_DISCOVERY_ECOSYSTEM_2026-09-23.md`](https://github.com/Mr-Melic/stralt/blob/cursor/spell-discovery-and-evolution-df4f/docs/automation/SPELL_DISCOVERY_ECOSYSTEM_2026-09-23.md) and `SDE-2026-09-23-001`…`008`.  
Wave-7 G≥7 extra slot (still blocking): still-open #533 [`SPELL_DISCOVERY_ECOSYSTEM_2026-09-24.md`](https://github.com/Mr-Melic/stralt/blob/cursor/spell-discovery-and-evolution-5522/docs/automation/SPELL_DISCOVERY_ECOSYSTEM_2026-09-24.md) and `SDE-2026-09-24-001`…`008`.  
Wave-8 G≥8 extra slot (still blocking): still-open #590 [`SPELL_DISCOVERY_ECOSYSTEM_2026-09-25.md`](https://github.com/Mr-Melic/stralt/blob/cursor/spell-discovery-and-evolution-0978/docs/automation/SPELL_DISCOVERY_ECOSYSTEM_2026-09-25.md) and `SDE-2026-09-25-001`…`008`.  
Wave-9 G≥9 extra slot (still blocking): still-open #646 [`SPELL_DISCOVERY_ECOSYSTEM_2026-09-26.md`](https://github.com/Mr-Melic/stralt/blob/cursor/spell-discovery-and-evolution-163b/docs/automation/SPELL_DISCOVERY_ECOSYSTEM_2026-09-26.md) and `SDE-2026-09-26-001`…`008`.  
Do not implement gameplay from this file unless a later human or orchestrator explicitly picks an ID. This run ships **docs only**.

Sibling ledgers (do not re-open): `SDA-2026-08-31-001`…`013`; tactical ids in PRs #120 / #185 / #282 / #342 / #411 / #463 / #525 / **#563** / **#636**; family sheets in PR #136 / #349 / #405 / #452 / #535 / #558 / **#625**; boss adaptations in PRs #137 / #197 / #367 / #406 / #474 / #518 / **#572** / **#638**; Wave-1…Wave-4 / Wave-6 / Wave-7 / Wave-8 / Wave-9 SDE ids; **memory-reserved Wave-5 unique ids** (no GitHub PR — still tombstoned). Same-day #625 extra doors stay #563’s (`gait_cantor` / `pair_usher` / `flush_precentor` / `dummy_castellan` / `court_hinge_regent`). #572 extra doors (`toll_ostiary` / `hinge_precentor` / `veil_verger` / `oath_dean`) are **not** Still Tax. #636 extra doors (`shove_cantor` / `stretch_precentor` / `span_quad` / `keep_bursar` / `court_stretch_regent`) are **not** Bar Mend / Cadence Pin / Mid Fold. #638 extra doors (`crypt_sexton` / `march_prefect` / `aisle_canon` / `orbit_succentor`) stamp Pit Wick / Must Pace / Triple Span / Pivot Foe — **not** Spike Skip / Inch Stride / Pack Close. Same-day #663 extra doors (`sole_thurifer` / `bias_prebendary` / `brick_cellarer` / `rebound_almoner`) stamp Gait Seal / Diag Lock / Brick Shift / Return Sting — **not** Brick Sprout / Off Plate.

---

ACTION_ID: SDE-2026-09-27-001  
SOURCE_AUTOMATION: Dynamic Spell Discovery and Enemy Spell Evolution Designer  
TITLE: Do not land Wave-10 data before Wave-1 ownership split and G resolve through Wave-9  
CATEGORY: dependency  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: `WorldExploration.tsx` 2395–2408 still forces every `starterSpells` row `isBaseSpell: true` (WX **19,213** lines). `BattleRecapData` (`PostBattleRecap.tsx` 6–34) has no `discoveredSpells`. `buildEnemyKit(enemy.pieceType, currentMap.levelZone)` at WX 11920 still passes a `{ name, minLevel, maxLevel }` object. `executeCastAttempt` (WX 17096–17207) still AP-only. Wave-1/2/3/4/6/7/8/9 P0 ACTION_IDs are still NEW. Adding 19 unique ids to the always-owned catalog would make discovery worse. No `SPELL_DISCOVERY_ECOSYSTEM_2026-09-22.md` PR exists; memory-reserved Wave-5 unique ids must still not land as `starterSpells`. Same-day #625 owns Wave-9 family CORE (#563 + leftover #533 verbs). Still-open #590 owns the Wave-8 unique catalog. Still-open #646 owns the Wave-9 unique catalog. Still-open **#636** owns the Wave-9 tactical catalog. Wave-10 families consume **#636** as CORE, not unique §11.  
SYSTEMS_AFFECTED: hydrate; recap; catalog; kit resolve  
RECOMMENDED_ACTION: Keep Wave-10 definitions `STATUS: PROPOSED` until innate four + observe + `commitSpellDiscoveries` + numeric `G` exist. Do not append Wave-10 ids to `starterSpells`. Coordinate with #411 / #463 / #480 / #525 / #533 / #563 / **#590** / **#625** / **#636** / **#646** / **#638** so those catalogs land once. Do not mint the 2026-09-22 memory catalog (`spell-gaze-sill` … `spell-void-span`) as a substitute Wave 5. Stamp #636 (`spell-shove-mend` … `spell-court-stretch`) onto Wave-10 family CORE — do not clone those ids into §11. Do not put unique §11 ids in #558 / #625 CORE or in Wave-10 family CORE. Dedicated CORE families for Wave-8 unique verbs (#625 deferred those here) are a family-sheet job, not unique §11.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: SDE-2026-08-31-001; SDE-2026-08-31-002; SDE-2026-08-31-003; SDE-2026-09-01-001; SDE-2026-09-02-001; SDE-2026-09-21-001; SDE-2026-09-23-001; SDE-2026-09-24-001; SDE-2026-09-25-001; SDE-2026-09-26-001  
REGRESSION_RISK: HIGH if ignored (catalog pre-own; G10 verbs on G=0 kits; fourth `mpCost` shipped without debit; Wave-5 memory ids collide; #563 / #590 / #636 / #646 ids duplicated).  
VALIDATION_REQUIRED: New character still owns only the four innate ids after Wave-1 split. `generationMin: 10` absent at G≤9.  
STATUS: NEW  

---

ACTION_ID: SDE-2026-09-27-002  
SOURCE_AUTOMATION: Dynamic Spell Discovery and Enemy Spell Evolution Designer  
TITLE: Resolve a G≥10 extra pool slot with generationMin  
CATEGORY: pool-evolution  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Wave-9 SDE-2026-09-26-002 asked for a G≥9 extra slot. Wave 10 stamps `generationMin: 10` on unique family extras. `Math.floor(levelZone)` is still NaN (`enemyAI.ts` 194–199; WX 11920). `computeAITier` still plateaus at label 10 (`combatMath.ts` 36–52). #625 Wave-9 families consume **#563** plus leftover **#533** as CORE. Wave-10 families consume **#636** as CORE. Wave-8 unique CORE may finally land on dedicated families this generation — still not unique §11. Wave-9 unique CORE stays a G≥9 extra until a Wave-11 family pass.  
SYSTEMS_AFFECTED: `resolveEnemyKit`; family overlays  
RECOMMENDED_ACTION: After SDE-2026-09-26-002, at G≥10 allow one extra ADVANCED/RARE/ELITE/SIGNATURE with `generationMin ≤ G`. Never retire CORE or G2…G9. Empty → `[physical_attack]`. Do not retune `pickEnemyLevelFromTiers`. No `G_max`. Do not put unique §11 ids in #405 / #452 / #558 / #625 CORE or in Wave-10 #636 CORE.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: SDE-2026-09-26-002; SDE-2026-08-31-005; SDE-2026-08-31-006  
REGRESSION_RISK: MEDIUM — G=9 Tide must not receive Still Tax / Inch Stride; empty kit must stay armed.  
VALIDATION_REQUIRED: Peer pawn still has Strike. `generationMin: 10` absent at G≤9.  
STATUS: NEW  

---

ACTION_ID: SDE-2026-09-27-003  
SOURCE_AUTOMATION: Dynamic Spell Discovery and Enemy Spell Evolution Designer  
TITLE: Wire Wave-10 aiHints before assigning those ids  
CATEGORY: ai-compat  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: `inferArchetype` (`enemyAI.ts` 447–452) still maps any `healAmount > 0` to healer. Summon fallback still uses name (`enemyAI.ts` 217–224). New hints (`force_next_walk_chebyshev_le_1`, `forbid_strike_until_spell`, `next_spell_range_ge_3`, `attract_toward_nearest_hazard`, `bonus_if_adjacent_ally`, `detonate_on_walk_enter_cell`, `next_off_turn_hit_zero`, `next_walk_ignores_spikes`, `self_buff_if_zero_leftover_ap`, `allied_summon_ignores_forced_move`, `heal_if_target_resolved_spell`, `freeze_one_remaining_cd`, `tax_next_spell_if_zero_walk_mp_last_turn`, `grow_adjacent_barrier`, `next_overwatch_also_costs_ap`, `bonus_if_leftover_ap_eq_1`, `bonus_if_target_is_leader`, `pack_clamp_next_spell_range_1`, `fold_share_rank_or_file`) have no decide* branch. `applyAttract` / `applyPushback` still have no production cast callers (`occupancy.ts` 482 / 537). Facing cards still fail closed (overworld-only write at WX 6924–6938). `isSummon` / `isLeader` exist (`gameTypes.ts` 293) and must be the Banner Cut / Pet Cut flags.  
SYSTEMS_AFFECTED: `enemyAI.ts` decide*; kit resolve; occupancy callers  
RECOMMENDED_ACTION: Implement each hint as a predicate on explicit flags / leftover AP-MP / Bresenham / `isLeader` / `isSummon` / occupancy / last-written paint type / `walkMpSpentLastTurn` / `resolvedSpellThisTurn`. Drop name fallbacks. Do not assign Cinder Reel until `applyAttract` has a cast caller. Do not assign Bar Mend to non-healer CORE. Do not assign Face Away / Oncoming / Glance Cut / Shove Face / About Face until battle walks write `currentView`. Do not assign Pack Close on `stride_precentor` (Pack Stride) or `cadence_lender` (Pack Tithe) or `tempo_precentor` (Pack Still). Do not reuse #636 `mark_if_target_still_has_walk_mp` for Ingress Mark. Missing hint → drop id, log once.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: SDE-2026-08-31-006; SDE-2026-09-01-003; SDE-2026-09-02-003; SDE-2026-09-21-003; SDE-2026-09-23-003; SDE-2026-09-24-003; SDE-2026-09-25-003; SDE-2026-09-26-003; SDA-2026-08-31-006  
REGRESSION_RISK: HIGH if Bar Mend lands on a charger CORE, Cinder Reel pulls toward a body like Foe Reel, Ingress Mark follows the unit like Gait Wick, Banner Cut name-checks `"king"`, or Pack Close stacks on Pack Stride.  
VALIDATION_REQUIRED: Bar Mend skipped on a target that only Struck. Cinder Reel skipped with no hazard tile. Pack Close never owned. Mid Fold skipped unless two player-side bodies share rank or file. Banner Cut skipped when `isLeader` is false. Ingress Mark skipped after a walk that never entered the painted cell.  
STATUS: NEW  

---

ACTION_ID: SDE-2026-09-27-004  
SOURCE_AUTOMATION: Dynamic Spell Discovery and Enemy Spell Evolution Designer  
TITLE: Implement Wave-10 unique definitions as data + pool rows  
CATEGORY: catalog-wave  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Unique §11 ids are absent from `spellData.ts` / `SPELL_ID_CATALOG` (32 live ids). Still-open #646 reserved Pair Stride through Knight Fold. Same-day #563 reserved Gait Mend through Court Hinge. Same-day **#636** reserved Shove Mend through Court Stretch. Tombstone in Wave-10 §0.1 must not be reused. Every frontend `mpCost` is still 0; unique Wave-10 rows stay 0. Combined paper spenders remain Ley Toll / Undertow / Sanguine Toll. Still Tax / Watch Fee / Pack Close are flags, not `spell.mpCost`.  
SYSTEMS_AFFECTED: `spellData.ts`; `bossKits.ts` catalog; family `EnemyKit` pools  
RECOMMENDED_ACTION: Add unique SDE ids one at a time with full metadata. `spell-pack-close` / `spell-mid-fold` never enter `ownedSpellIds`. Never `if (spell.name === …)`. Mid Fold occupancy is not `map.portals` and not Twin/Triune/Twin Span/Triple Span/Pair Hinge/About Hinge/Quad Span/Knight Fold tables. Do not pool Hex Toll. Do not add a fourth `mpCost > 0` id. Do not mint memory Wave-5 ids (`spell-gaze-sill` …). Stamp #636 ids onto Wave-10 family CORE — do not clone them as §11 rows. Dummy Post keeps `summonAI: "dummypost"` (#563). Quad Span keeps `summonAI: "quadspan"` (#636) and is not a unique §11 id.  
AUTONOMY: HUMAN_APPROVE — each id is a combat toy.  
DEPENDENCIES: SDE-2026-09-27-001; SDE-2026-09-27-002; SDE-2026-09-27-003  
REGRESSION_RISK: HIGH per id if wired by name, assigned to the wrong profile, if Mid Fold reuses Knight Fold dests as a grant, or if Ingress Mark reuses `gaitWickDamage`.  
VALIDATION_REQUIRED: `validateBossKits()` still passes. Typecheck clean. G=9 Tide has no Still Tax. Mid Fold is not Knight Fold. Bar Mend absent from non-healer CORE. Unique §11 ids absent from #636 / #646.  
STATUS: NEW  

---

ACTION_ID: SDE-2026-09-27-005  
SOURCE_AUTOMATION: Dynamic Spell Discovery and Enemy Spell Evolution Designer  
TITLE: Add inch_gallery, rite_nave, reach_nave, ash_aisle, pin_nave; keep loaner orbs and WF-* non-owning  
CATEGORY: special-encounter  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Wave-1–9 discovery specials are the only tagged teach rooms. Wave-9 `pair_gallery` / `shave_nave` must not be retagged as Inch Stride / Cadence Pin. `pair_usher` is Pair Hinge’s extra door. `span_quad` is Quad Span’s extra door. `march_prefect` is Must Pace’s #638 door, not Inch Stride. All 15 feats remain claimed or leftover. `hard_1` / `legendary_1` stay Wave-7 challenge doors.  
SYSTEMS_AFFECTED: encounter tag table; kit overlay; loaner persist exception  
RECOMMENDED_ACTION: Tag existing solvable layouts. `inch_gallery` grants Inch Stride on victory without observation (MULTI with observe+win). Other four teach via observe+win. Do not grant Inch Stride on `pair_gallery`, `odd_gallery`, `even_gallery`, `must_span` rooms, or `march_prefect`. `ENC-SPELL-07` / `WF-SPL-*` loaners must not write `ownedSpellIds` / `spellLevelKeys` or call `upgradeSpell`. Do not edit `mapGen.ts` algorithms. Do not invent a second recap. World portals stay locked while hostiles live.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: SDE-2026-08-31-003; SDE-2026-09-26-005; SDE-2026-09-27-004  
REGRESSION_RISK: MEDIUM if a tag seals portals, skips `finalizePlayableLayout`, treats Mid Fold as `map.portals`, or persists a loaner as owned.  
VALIDATION_REQUIRED: Maps stay solvable. Defeat on `inch_gallery` does not grant. Loaner pickup leaves `spellLevelKeys` unchanged. Pair Gallery / Must Pace / March Prefect victory does not grant Inch Stride.  
STATUS: NEW  

---

ACTION_ID: SDE-2026-09-27-006  
SOURCE_AUTOMATION: Dynamic Spell Discovery and Enemy Spell Evolution Designer  
TITLE: Observation edge cases for inch walk, Strike-until-spell, hazard attract, enter-detonate, and closed classes  
CATEGORY: discovery-pipeline  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Wave-1 observe is “cast spent AP.” Inch Stride observes the cast, not a later failed 2-step. Still Tax observes the arm, not the later +1 AP. Ingress Mark observes the **cell paint**, not detonation. Bar Mend observes a 0-heal. Pack Close / Mid Fold never persist.  
SYSTEMS_AFFECTED: observe hook; recap; challenge HP/AP helpers  
RECOMMENDED_ACTION: Observe on Inch Stride **cast** (even if the target is already rooted). Fizzle after AP spend still observes (Cinder Reel no hazard, Brick Sprout no adjacent barrier, Tapped Plate leftover AP ≥ 1, Bar Mend no-spell **if AP was spent**). Illegal AI skip (no AP) does not. Pull/fold landings use existing hazard ticks (`recordInBattleChallengeDamage` if lava/spikes while `inBattleRef`). Bar Mend flips `no_healing` only when HP increased. `ENEMY_ONLY` / `BOSS_ONLY` never write `ownedSpellIds`. Player summons never observe. Loaner orb pickup never observes. Do not observe Gait Wick / Stride Mark when Ingress Mark detonates, or the reverse.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: SDE-2026-08-31-002; SDE-2026-09-26-006; SDE-2026-09-27-004  
REGRESSION_RISK: HIGH if Still Tax grants Ley Toll, Ingress Mark grants Gait Wick / Stride Mark, Bar Mend grants Clash Mend / Shove Mend, or Pack Close is owned.  
VALIDATION_REQUIRED: Wave-10 QA rows W10-1…W10-18, W10-21, W10-23, W10-24, W10-25.  
STATUS: NEW  

---

ACTION_ID: SDE-2026-09-27-007  
SOURCE_AUTOMATION: Dynamic Spell Discovery and Enemy Spell Evolution Designer  
TITLE: Recap cards must list Wave-10 fields on the existing popup  
CATEGORY: discovery-ux  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `PostBattleRecap.tsx` 6–34 still has no `discoveredSpells`. Wave-1 SDE-003 owns the field; Wave-10 only requires the same card shape (name, role, AP, range, target, key effect, source enemy). `inch_gallery` MULTI child appears on that same recap, not a second modal. Achievement toast family is `pendingAchievementToast` at WX 2173 / 17949 — reuse, do not grow WX.  
SYSTEMS_AFFECTED: `BattleRecapData`; recap chrome  
RECOMMENDED_ACTION: Do not add a second popup. Stack up to 4 cards. Defeat never shows `NEW SPELL DISCOVERED`. Carved-stone / crimson only. Still Tax, exact-2 fail under Inch Stride, and Ingress Mark detonation are not a second cue.  
AUTONOMY: IMPLEMENT_AFTER_HUMAN  
DEPENDENCIES: SDE-2026-08-31-003; SDE-2026-08-31-004; SDE-2026-09-26-007  
REGRESSION_RISK: LOW for combat. MEDIUM if a second modal appears.  
VALIDATION_REQUIRED: One recap at `App.tsx` root.  
STATUS: NEW  

---

ACTION_ID: SDE-2026-09-27-008  
SOURCE_AUTOMATION: Dynamic Spell Discovery and Enemy Spell Evolution Designer  
TITLE: No leftover feat/challenge stamps; no fourth mpCost; no Hex Toll pool; no Wave-5 memory clone; do not restamp claimed doors  
CATEGORY: feat-challenge-boss  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: All 15 `defaultAchievements()` ids are claimed or leftover (`admin.mo` 309–326). Wave 8 stamped leftover `leader_slayer` / `spell_master`. `jackpot` is already #185 Absolve’s MULTI child. `survivor` stays leftover (Last Ember / Last Ward). Same-day #625 extra doors stay #563’s. #572 extra doors stamp Exit Tithe / Hinge Tile / Aim Veil / Oath Blade. #636 extra doors stamp Shove Mend / Cadence Stretch / Quad Span / Purse Keep / Court Stretch. #638 extra doors stamp Pit Wick / Must Pace / Triple Span / Pivot Foe. Combined paper `mpCost > 0` is already Ley Toll + Undertow + Sanguine Toll. Hex Toll remains a Quiet Hex near-clone.  
SYSTEMS_AFFECTED: family overlays; `unlockOwnedSpell`  
RECOMMENDED_ACTION: Unique grants are observe+win / ELITE / `inch_gallery` only. Keep `unstoppable` unused as a spell gate. Do not stamp `survivor`. Do not restamp `jackpot` / `leader_slayer` / `spell_master`. Do not add `mpCost > 0` on any unique §11 row. Do not pool `spell-hex-toll`. Do not clone memory Wave-5 ids. Do not clone #636 / #646 ids. Mid Fold stays `BOSS_ONLY` on `mid_fold_regent` — do not restamp `knight_fold_regent`, `about_hinge_regent`, `court_hinge_regent`, `span_quad`, `court_stretch_regent`, #518 extra doors, #525 extra doors, #563 extra doors, #572 extra doors, #636 extra doors, #638 extra doors, or #663 extra doors (`sole_thurifer` / `bias_prebendary` / `brick_cellarer` / `rebound_almoner`).  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: SDE-2026-09-27-001; SDE-2026-09-27-004  
REGRESSION_RISK: HIGH if `leader_slayer` double-grants Crown Cut, `pair_gallery` grants Inch Stride, `shove_cantor` grants Bar Mend, `crypt_sexton` grants Spike Skip, or a fourth walk-MP snipe ships without debit.  
VALIDATION_REQUIRED: Claiming `jackpot` still grants only Absolve. Completing `leader_slayer` still grants only Crown Cut. Unique §11 rows all `mpCost: 0`. Hex Toll absent from SDE pools. Memory Wave-5 ids absent from `spellData.ts`. #636 / #646 ids absent from unique §11.  
STATUS: NEW  
