# ACTION_IDs — 2026-09-26 Dynamic Spell Discovery & Enemy Spell Evolution

Durable ledger for implementers and the Report Action Orchestrator.  
Source of every record: Dynamic Spell Discovery and Enemy Spell Evolution Designer.  
Design contract: [`SPELL_DISCOVERY_ECOSYSTEM_2026-09-26.md`](./SPELL_DISCOVERY_ECOSYSTEM_2026-09-26.md).  
Wave-1 law (still blocking): [`SPELL_DISCOVERY_ECOSYSTEM_2026-08-31.md`](./SPELL_DISCOVERY_ECOSYSTEM_2026-08-31.md) and `SDE-2026-08-31-001`…`009`.  
Wave-2 generation stamp (still blocking): [`SPELL_DISCOVERY_ECOSYSTEM_2026-09-01.md`](./SPELL_DISCOVERY_ECOSYSTEM_2026-09-01.md) and `SDE-2026-09-01-001`…`008`.  
Wave-3 G≥3 extra slot (still blocking): [`SPELL_DISCOVERY_ECOSYSTEM_2026-09-02.md`](./SPELL_DISCOVERY_ECOSYSTEM_2026-09-02.md) and `SDE-2026-09-02-001`…`008`.  
Wave-4 G≥4 extra slot (still blocking): still-open #371 [`SPELL_DISCOVERY_ECOSYSTEM_2026-09-21.md`](https://github.com/Mr-Melic/stralt/blob/cursor/spell-discovery-and-evolution-2940/docs/automation/SPELL_DISCOVERY_ECOSYSTEM_2026-09-21.md) and `SDE-2026-09-21-001`…`008`.  
Wave-6 G≥6 extra slot (still blocking): still-open #480 [`SPELL_DISCOVERY_ECOSYSTEM_2026-09-23.md`](https://github.com/Mr-Melic/stralt/blob/cursor/spell-discovery-and-evolution-df4f/docs/automation/SPELL_DISCOVERY_ECOSYSTEM_2026-09-23.md) and `SDE-2026-09-23-001`…`008`.  
Wave-7 G≥7 extra slot (still blocking): still-open #533 [`SPELL_DISCOVERY_ECOSYSTEM_2026-09-24.md`](https://github.com/Mr-Melic/stralt/blob/cursor/spell-discovery-and-evolution-5522/docs/automation/SPELL_DISCOVERY_ECOSYSTEM_2026-09-24.md) and `SDE-2026-09-24-001`…`008`.  
Wave-8 G≥8 extra slot (still blocking): still-open #590 [`SPELL_DISCOVERY_ECOSYSTEM_2026-09-25.md`](https://github.com/Mr-Melic/stralt/blob/cursor/spell-discovery-and-evolution-0978/docs/automation/SPELL_DISCOVERY_ECOSYSTEM_2026-09-25.md) and `SDE-2026-09-25-001`…`008`.  
Do not implement gameplay from this file unless a later human or orchestrator explicitly picks an ID. This run ships **docs only**.

Sibling ledgers (do not re-open): `SDA-2026-08-31-001`…`013`; tactical ids in PRs #120 / #185 / #282 / #342 / #411 / #463 / #525 / **#563** / **#636**; family sheets in PR #136 / #349 / #405 / #452 / #535 / #558 / **#625**; boss adaptations in PRs #137 / #197 / #367 / #406 / #474 / #518 / **#572**; Wave-1…Wave-4 / Wave-6 / Wave-7 / Wave-8 SDE ids; **memory-reserved Wave-5 unique ids** (no GitHub PR — still tombstoned). Same-day #625 extra doors stay #563’s (`gait_cantor` / `pair_usher` / `flush_precentor` / `dummy_castellan` / `court_hinge_regent`) — **not** Pair Stride / Knight Fold. #572 extra doors (`toll_ostiary` / `hinge_precentor` / `veil_verger` / `oath_dean`) are **not** Gait Tax. #636 extra doors (`shove_cantor` / `stretch_precentor` / `span_quad` / `keep_bursar` / `court_stretch_regent`) are **not** Clash Mend / Cadence Shave / Knight Fold.

---

ACTION_ID: SDE-2026-09-26-001  
SOURCE_AUTOMATION: Dynamic Spell Discovery and Enemy Spell Evolution Designer  
TITLE: Do not land Wave-9 data before Wave-1 ownership split, Wave-2 G resolve, Wave-3 G≥3 slot, Wave-4 G≥4 slot, Wave-6 G≥6 slot, Wave-7 G≥7 slot, and Wave-8 G≥8 slot  
CATEGORY: dependency  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: `WorldExploration.tsx` 2395–2408 still forces every `starterSpells` row `isBaseSpell: true` (WX **19,213** lines). `BattleRecapData` (`PostBattleRecap.tsx` 6–34) has no `discoveredSpells`. `buildEnemyKit(enemy.pieceType, currentMap.levelZone)` at WX 11920 still passes a `{ name, minLevel, maxLevel }` object. `executeCastAttempt` (WX 17096–17207) still AP-only. Wave-1/2/3/4/6/7/8 P0 ACTION_IDs are still NEW. Adding 19 unique ids to the always-owned catalog would make discovery worse. No `SPELL_DISCOVERY_ECOSYSTEM_2026-09-22.md` PR exists; memory-reserved Wave-5 unique ids must still not land as `starterSpells`. Same-day #625 owns Wave-9 family CORE (#563 + leftover #533 verbs). Still-open #590 owns the Wave-8 unique catalog. Still-open **#636** owns the Wave-9 tactical catalog.  
SYSTEMS_AFFECTED: hydrate; recap; catalog; kit resolve  
RECOMMENDED_ACTION: Keep Wave-9 definitions `STATUS: PROPOSED` until innate four + observe + `commitSpellDiscoveries` + numeric `G` exist. Do not append Wave-9 ids to `starterSpells`. Coordinate with #411 / #463 / #480 / #525 / #533 / #563 / **#590** / **#625** / **#636** so those catalogs land once. Do not mint the 2026-09-22 memory catalog (`spell-gaze-sill` … `spell-void-span`) as a substitute Wave 5. Stamp #563 (`spell-gait-mend` … `spell-court-hinge`) and #636 (`spell-shove-mend` … `spell-court-stretch`) onto overlays — do not clone those ids into §11. Do not put unique §11 ids in #558 CORE or #625 CORE.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: SDE-2026-08-31-001; SDE-2026-08-31-002; SDE-2026-08-31-003; SDE-2026-09-01-001; SDE-2026-09-02-001; SDE-2026-09-21-001; SDE-2026-09-23-001; SDE-2026-09-24-001; SDE-2026-09-25-001  
REGRESSION_RISK: HIGH if ignored (catalog pre-own; G9 verbs on G=0 kits; fourth `mpCost` shipped without debit; Wave-5 memory ids collide with a later resurrected catalog; #563 / #590 / #636 ids duplicated).  
VALIDATION_REQUIRED: New character still owns only the four innate ids after Wave-1 split. `generationMin: 9` absent at G≤8.  
STATUS: NEW  

---

ACTION_ID: SDE-2026-09-26-002  
SOURCE_AUTOMATION: Dynamic Spell Discovery and Enemy Spell Evolution Designer  
TITLE: Resolve a G≥9 extra pool slot with generationMin  
CATEGORY: pool-evolution  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Wave-8 SDE-2026-09-25-002 asked for a G≥8 extra slot. Wave 9 stamps `generationMin: 9` on family verbs. `Math.floor(levelZone)` is still NaN (`enemyAI.ts` 194–199; WX 11920). `computeAITier` still plateaus at label 10 (`combatMath.ts` 36–52). #625 Wave-9 families consume **#563** plus leftover **#533** as CORE, not as this G9 extra. Wave-8 unique CORE stays a G≥8 extra until a Wave-10 family pass.  
SYSTEMS_AFFECTED: `resolveEnemyKit`; family overlays  
RECOMMENDED_ACTION: After SDE-2026-09-25-002 (and the unpublished G≥5 slot if a Wave-5 SDE PR ever lands), at G≥9 allow one extra ADVANCED/RARE/ELITE/SIGNATURE with `generationMin ≤ G`. Never retire CORE, G2, G3, G4, G6, G7, or G8. Empty → `[physical_attack]`. Do not retune `pickEnemyLevelFromTiers`. No `G_max`. Do not put unique §11 ids in #405 / #452 / #558 / #625 CORE.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: SDE-2026-09-25-002; SDE-2026-08-31-005; SDE-2026-08-31-006  
REGRESSION_RISK: MEDIUM — G=8 Tide must not receive Gait Tax / Pair Stride; empty kit must stay armed.  
VALIDATION_REQUIRED: Peer pawn still has Strike. `generationMin: 9` absent at G≤8.  
STATUS: NEW  

---

ACTION_ID: SDE-2026-09-26-003  
SOURCE_AUTOMATION: Dynamic Spell Discovery and Enemy Spell Evolution Designer  
TITLE: Wire Wave-9 aiHints before assigning those ids  
CATEGORY: ai-compat  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: `inferArchetype` (`enemyAI.ts` 447–452) still maps any `healAmount > 0` to healer. Summon fallback still uses name (`enemyAI.ts` 217–224). New hints (`force_exact_manhattan_2`, `forbid_walk_until_strike`, `next_spell_range_le_1`, `attract_toward_nearest_paint`, `bonus_if_exactly_one_adj_block`, `detonate_on_walk_leave_cell`, `split_incoming_adjacent_enemy`, `next_walk_ignores_lava`, `self_buff_if_zero_leftover_mp`, `forbid_primary_leave_cell`, `heal_if_target_struck`, `shave_all_remaining_cds`, `tax_next_spell_if_walked`, `erase_adjacent_barrier`, `next_overwatch_deals_zero`, `bonus_if_leftover_ap_ge_3`, `bonus_if_player_side_summon`, `pack_siphon_leftover_mp`, `fold_knight_player_side`) have no decide* branch. `applyAttract` / `applyPushback` still have no production cast callers (`occupancy.ts` 482 / 537). Facing cards still fail closed (overworld-only write at WX 6924–6938). `isSummon` / `isLeader` exist and must be the Pet Cut / Crown Cut flags.  
SYSTEMS_AFFECTED: `enemyAI.ts` decide*; kit resolve; occupancy callers  
RECOMMENDED_ACTION: Implement each hint as a predicate on explicit flags / leftover AP-MP / Bresenham / `isSummon` / occupancy / last-written paint type / `walkMpSpentThisTurn` / `struckThisTurn`. Drop name fallbacks. Do not assign Paint Reel until `applyAttract` has a cast caller. Do not assign Clash Mend to non-healer CORE. Do not assign Face Away / Oncoming / Glance Cut / Shove Face until battle walks write `currentView`. Do not assign Pack Stride on `cadence_lender` (Pack Tithe) or `tempo_precentor` (Pack Still). Do not reuse #636 `mark_if_target_still_has_walk_mp` for Stride Mark. Missing hint → drop id, log once.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: SDE-2026-08-31-006; SDE-2026-09-01-003; SDE-2026-09-02-003; SDE-2026-09-21-003; SDE-2026-09-23-003; SDE-2026-09-24-003; SDE-2026-09-25-003; SDA-2026-08-31-006  
REGRESSION_RISK: HIGH if Clash Mend lands on a charger CORE, Paint Reel pulls toward a body like Foe Reel, Stride Mark follows the unit like Gait Wick, Pet Cut name-checks `"wolf"`, or Pack Stride stacks on Pack Tithe.  
VALIDATION_REQUIRED: Clash Mend skipped on unstruck target. Paint Reel skipped with no paint. Pack Stride never owned. Knight Fold skipped unless exactly two player-side bodies and both dests are free. Pet Cut skipped when `isSummon` is false. Stride Mark skipped after a shove off the painted cell.  
STATUS: NEW  

---

ACTION_ID: SDE-2026-09-26-004  
SOURCE_AUTOMATION: Dynamic Spell Discovery and Enemy Spell Evolution Designer  
TITLE: Implement Wave-9 unique definitions as data + pool rows  
CATEGORY: catalog-wave  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Unique §11 ids are absent from `spellData.ts` / `SPELL_ID_CATALOG` (32 live ids). Still-open #590 reserved Odd Stride through About Hinge. Same-day #563 reserved Gait Mend through Court Hinge. Same-day **#636** reserved Shove Mend through Court Stretch. Tombstone in Wave-9 §0.1 must not be reused. Every frontend `mpCost` is still 0; unique Wave-9 rows stay 0. Combined paper spenders remain Ley Toll / Undertow / Sanguine Toll. Gait Tax / Pack Stride are flags, not `spell.mpCost`.  
SYSTEMS_AFFECTED: `spellData.ts`; `bossKits.ts` catalog; family `EnemyKit` pools  
RECOMMENDED_ACTION: Add unique SDE ids one at a time with full metadata. `spell-pack-stride` / `spell-knight-fold` never enter `ownedSpellIds`. Never `if (spell.name === …)`. Knight Fold occupancy is not `map.portals` and not Twin/Triune/Twin Span/Triple Span/Pair Hinge/About Hinge/Quad Span tables. Do not pool Hex Toll. Do not add a fourth `mpCost > 0` id. Do not mint memory Wave-5 ids (`spell-gaze-sill` …). Stamp #563 and **#636** ids — do not clone them as §11 rows. Dummy Post keeps `summonAI: "dummypost"` (#563). Quad Span keeps `summonAI: "quadspan"` (#636) and is not a unique §11 id.  
AUTONOMY: HUMAN_APPROVE — each id is a combat toy.  
DEPENDENCIES: SDE-2026-09-26-001; SDE-2026-09-26-002; SDE-2026-09-26-003  
REGRESSION_RISK: HIGH per id if wired by name, assigned to the wrong profile, if Knight Fold reuses About Hinge dests as a grant, or if Stride Mark reuses `gaitWickDamage`.  
VALIDATION_REQUIRED: `validateBossKits()` still passes. Typecheck clean. G=8 Tide has no Gait Tax. Knight Fold is not About Hinge. Clash Mend absent from non-healer CORE. Unique §11 ids absent from #636.  
STATUS: NEW  

---

ACTION_ID: SDE-2026-09-26-005  
SOURCE_AUTOMATION: Dynamic Spell Discovery and Enemy Spell Evolution Designer  
TITLE: Add pair_gallery, hold_nave, nook_court, stride_pulpit, shave_nave; keep loaner orbs and WF-* non-owning  
CATEGORY: special-encounter  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Wave-1–8 discovery specials are the only tagged teach rooms. Wave-8 `odd_gallery` / `stall_nave` must not be retagged as Pair Stride / Cadence Shave. `pair_usher` is Pair Hinge’s extra door, not `pair_gallery`. All 15 feats remain claimed or leftover. `hard_1` / `legendary_1` stay Wave-7 challenge doors. `leader_slayer` / `spell_master` stay Wave-8 MULTI children.  
SYSTEMS_AFFECTED: encounter tag table; kit overlay; loaner persist exception  
RECOMMENDED_ACTION: Tag existing solvable layouts. `pair_gallery` grants Pair Stride on victory without observation (MULTI with observe+win). Other four teach via observe+win. Do not grant Pair Stride on `odd_gallery`, `even_gallery`, `pair_usher`, or a Must Span (#636) room. `ENC-SPELL-07` / `WF-SPL-*` loaners must not write `ownedSpellIds` / `spellLevelKeys` or call `upgradeSpell`. Do not edit `mapGen.ts` algorithms. Do not invent a second recap. World portals stay locked while hostiles live.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: SDE-2026-08-31-003; SDE-2026-09-25-005; SDE-2026-09-26-004  
REGRESSION_RISK: MEDIUM if a tag seals portals, skips `finalizePlayableLayout`, treats Knight Fold as `map.portals`, or persists a loaner as owned.  
VALIDATION_REQUIRED: Maps stay solvable. Defeat on `pair_gallery` does not grant. Loaner pickup leaves `spellLevelKeys` unchanged. Odd Gallery / Pair Usher / Must Span victory does not grant Pair Stride.  
STATUS: NEW  

---

ACTION_ID: SDE-2026-09-26-006  
SOURCE_AUTOMATION: Dynamic Spell Discovery and Enemy Spell Evolution Designer  
TITLE: Observation edge cases for exact-2 walk, walk-until-Strike, paint attract, walk-MP detonate, and closed classes  
CATEGORY: discovery-pipeline  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Wave-1 observe is “cast spent AP.” Pair Stride observes the cast, not a later failed 1-step. Gait Tax observes the arm, not the later +1 AP. Stride Mark observes the **cell paint**, not detonation. Clash Mend observes a 0-heal. Pack Stride / Knight Fold never persist.  
SYSTEMS_AFFECTED: observe hook; recap; challenge HP/AP helpers  
RECOMMENDED_ACTION: Observe on Pair Stride **cast** (even if the target is already rooted). Fizzle after AP spend still observes (Paint Reel no paint, Brick Wipe no barrier, Still Plate leftover MP ≥ 1, Clash Mend unstruck **if AP was spent**). Illegal AI skip (no AP) does not. Pull/fold landings use existing hazard ticks (`recordInBattleChallengeDamage` if lava/spikes while `inBattleRef`). Clash Mend flips `no_healing` only when HP increased. `ENEMY_ONLY` / `BOSS_ONLY` never write `ownedSpellIds`. Player summons never observe. Loaner orb pickup never observes. Do not observe Gait Wick when Stride Mark detonates, or the reverse.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: SDE-2026-08-31-002; SDE-2026-09-25-006; SDE-2026-09-26-004  
REGRESSION_RISK: HIGH if Gait Tax grants Ley Toll, Stride Mark grants Gait Wick / Wound Mark, Clash Mend grants Shove Mend / Chase Mend, or Pack Stride is owned.  
VALIDATION_REQUIRED: Wave-9 QA rows W9-1…W9-18, W9-21, W9-23, W9-24, W9-25.  
STATUS: NEW  

---

ACTION_ID: SDE-2026-09-26-007  
SOURCE_AUTOMATION: Dynamic Spell Discovery and Enemy Spell Evolution Designer  
TITLE: Recap cards must list Wave-9 fields on the existing popup  
CATEGORY: discovery-ux  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `PostBattleRecap.tsx` 6–34 still has no `discoveredSpells`. Wave-1 SDE-003 owns the field; Wave-9 only requires the same card shape (name, role, AP, range, target, key effect, source enemy). `pair_gallery` MULTI child appears on that same recap, not a second modal. Achievement toast family is `pendingAchievementToast` at WX 2173 / 17949 — reuse, do not grow WX.  
SYSTEMS_AFFECTED: `BattleRecapData`; recap chrome  
RECOMMENDED_ACTION: Do not add a second popup. Stack up to 4 cards. Defeat never shows `NEW SPELL DISCOVERED`. Carved-stone / crimson only. Gait Tax, exact-2 fail, and Stride Mark detonation are not a second cue.  
AUTONOMY: IMPLEMENT_AFTER_HUMAN  
DEPENDENCIES: SDE-2026-08-31-003; SDE-2026-08-31-004; SDE-2026-09-25-007  
REGRESSION_RISK: LOW for combat. MEDIUM if a second modal appears.  
VALIDATION_REQUIRED: One recap at `App.tsx` root.  
STATUS: NEW  

---

ACTION_ID: SDE-2026-09-26-008  
SOURCE_AUTOMATION: Dynamic Spell Discovery and Enemy Spell Evolution Designer  
TITLE: No leftover feat/challenge stamps; no fourth mpCost; no Hex Toll pool; no Wave-5 memory clone; do not restamp claimed doors  
CATEGORY: feat-challenge-boss  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: All 15 `defaultAchievements()` ids are claimed or leftover. Wave 8 stamped leftover `leader_slayer` / `spell_master`. `jackpot` is already #185 Absolve’s MULTI child. `survivor` stays leftover (Last Ember / Last Ward). Same-day #625 extra doors stay #563’s. #572 extra doors stamp Exit Tithe / Hinge Tile / Aim Veil / Oath Blade — do not restamp. #636 extra doors stamp Shove Mend / Cadence Stretch / Quad Span / Purse Keep / Court Stretch — do not restamp. Combined paper `mpCost > 0` is already Ley Toll + Undertow + Sanguine Toll. Hex Toll remains a Quiet Hex near-clone.  
SYSTEMS_AFFECTED: family overlays; `unlockOwnedSpell`  
RECOMMENDED_ACTION: Unique grants are observe+win / ELITE / `pair_gallery` only. Keep `unstoppable` unused as a spell gate. Do not stamp `survivor`. Do not restamp `jackpot` / `leader_slayer` / `spell_master`. Do not add `mpCost > 0` on any unique §11 row. Do not pool `spell-hex-toll`. Do not clone memory Wave-5 ids. Do not clone #636 ids. Knight Fold stays `BOSS_ONLY` on `knight_fold_regent` — do not restamp `about_hinge_regent`, `court_hinge_regent`, `span_quad`, `court_stretch_regent`, #518 extra doors, #525 extra doors, #563 extra doors, #572 extra doors, or #636 extra doors.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: SDE-2026-09-26-001; SDE-2026-09-26-004  
REGRESSION_RISK: HIGH if `leader_slayer` double-grants Crown Cut, `pair_usher` grants Pair Stride, `shove_cantor` grants Clash Mend, or a fourth walk-MP snipe ships without debit.  
VALIDATION_REQUIRED: Claiming `jackpot` still grants only Absolve. Completing `leader_slayer` still grants only Crown Cut. Unique §11 rows all `mpCost: 0`. Hex Toll absent from SDE pools. Memory Wave-5 ids absent from `spellData.ts`. #636 ids absent from unique §11.  
STATUS: NEW  
