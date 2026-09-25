# ACTION_IDs — 2026-09-25 Dynamic Spell Discovery & Enemy Spell Evolution

Durable ledger for implementers and the Report Action Orchestrator.  
Source of every record: Dynamic Spell Discovery and Enemy Spell Evolution Designer.  
Design contract: [`SPELL_DISCOVERY_ECOSYSTEM_2026-09-25.md`](./SPELL_DISCOVERY_ECOSYSTEM_2026-09-25.md).  
Wave-1 law (still blocking): [`SPELL_DISCOVERY_ECOSYSTEM_2026-08-31.md`](./SPELL_DISCOVERY_ECOSYSTEM_2026-08-31.md) and `SDE-2026-08-31-001`…`009`.  
Wave-2 generation stamp (still blocking): [`SPELL_DISCOVERY_ECOSYSTEM_2026-09-01.md`](./SPELL_DISCOVERY_ECOSYSTEM_2026-09-01.md) and `SDE-2026-09-01-001`…`008`.  
Wave-3 G≥3 extra slot (still blocking): [`SPELL_DISCOVERY_ECOSYSTEM_2026-09-02.md`](./SPELL_DISCOVERY_ECOSYSTEM_2026-09-02.md) and `SDE-2026-09-02-001`…`008`.  
Wave-4 G≥4 extra slot (still blocking): still-open #371 [`SPELL_DISCOVERY_ECOSYSTEM_2026-09-21.md`](https://github.com/Mr-Melic/stralt/blob/cursor/spell-discovery-and-evolution-2940/docs/automation/SPELL_DISCOVERY_ECOSYSTEM_2026-09-21.md) and `SDE-2026-09-21-001`…`008`.  
Wave-6 G≥6 extra slot (still blocking): still-open #480 [`SPELL_DISCOVERY_ECOSYSTEM_2026-09-23.md`](https://github.com/Mr-Melic/stralt/blob/cursor/spell-discovery-and-evolution-df4f/docs/automation/SPELL_DISCOVERY_ECOSYSTEM_2026-09-23.md) and `SDE-2026-09-23-001`…`008`.  
Wave-7 G≥7 extra slot (still blocking): still-open #533 [`SPELL_DISCOVERY_ECOSYSTEM_2026-09-24.md`](https://github.com/Mr-Melic/stralt/blob/cursor/spell-discovery-and-evolution-5522/docs/automation/SPELL_DISCOVERY_ECOSYSTEM_2026-09-24.md) and `SDE-2026-09-24-001`…`008`.  
Do not implement gameplay from this file unless a later human or orchestrator explicitly picks an ID. This run ships **docs only**.

Sibling ledgers (do not re-open): `SDA-2026-08-31-001`…`013`; tactical ids in PRs #120 / #185 / #282 / #342 / #411 / #463 / #525 / **#563**; family sheets in PR #136 / #349 / #405 / #452 / #535 / **#558**; boss adaptations in PRs #137 / #197 / #367 / #406 / #474 / #518; Wave-1…Wave-4 / Wave-6 / Wave-7 SDE ids; **memory-reserved Wave-5 unique ids** (no GitHub PR — still tombstoned). Same-day #563 extra doors (`gait_cantor` / `pair_usher` / `flush_precentor` / `dummy_castellan` / `court_hinge_regent`) are **not** About Hinge. #525 extra doors (`span_triune` / `wick_mason` / `slip_castellan` / `court_usher` / `pace_prelate`) are **not** Crown Cut.

---

ACTION_ID: SDE-2026-09-25-001  
SOURCE_AUTOMATION: Dynamic Spell Discovery and Enemy Spell Evolution Designer  
TITLE: Do not land Wave-8 data before Wave-1 ownership split, Wave-2 G resolve, Wave-3 G≥3 slot, Wave-4 G≥4 slot, Wave-6 G≥6 slot, and Wave-7 G≥7 slot  
CATEGORY: dependency  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: `WorldExploration.tsx` 2395–2408 still forces every `starterSpells` row `isBaseSpell: true` (WX **19,213** lines). `BattleRecapData` (`PostBattleRecap.tsx` 6–34) has no `discoveredSpells`. `buildEnemyKit(enemy.pieceType, currentMap.levelZone)` at WX 11920 still passes a `{ name, minLevel, maxLevel }` object. `executeCastAttempt` (WX 17096–17207) still AP-only. Wave-1/2/3/4/6/7 P0 ACTION_IDs are still NEW. Adding 19 unique ids to the always-owned catalog would make discovery worse. No `SPELL_DISCOVERY_ECOSYSTEM_2026-09-22.md` PR exists; memory-reserved Wave-5 unique ids must still not land as `starterSpells`. Same-day #563 owns the Wave-8 tactical catalog. Same-day #558 owns Wave-8 family CORE (#525 verbs).  
SYSTEMS_AFFECTED: hydrate; recap; catalog; kit resolve  
RECOMMENDED_ACTION: Keep Wave-8 definitions `STATUS: PROPOSED` until innate four + observe + `commitSpellDiscoveries` + numeric `G` exist. Do not append Wave-8 ids to `starterSpells`. Coordinate with #411 / #463 / #480 / #525 / #533 / **#563** so those catalogs land once. Do not mint the 2026-09-22 memory catalog (`spell-gaze-sill` … `spell-void-span`) as a substitute Wave 5. Stamp #563 (`spell-gait-mend` … `spell-court-hinge`) onto overlays — do not clone those ids into §11. Do not put unique §11 ids in #558 CORE.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: SDE-2026-08-31-001; SDE-2026-08-31-002; SDE-2026-08-31-003; SDE-2026-09-01-001; SDE-2026-09-02-001; SDE-2026-09-21-001; SDE-2026-09-23-001; SDE-2026-09-24-001  
REGRESSION_RISK: HIGH if ignored (catalog pre-own; G8 verbs on G=0 kits; fourth `mpCost` shipped without debit; Wave-5 memory ids collide with a later resurrected catalog; #563 ids duplicated).  
VALIDATION_REQUIRED: New character still owns only the four innate ids after Wave-1 split. `generationMin: 8` absent at G≤7.  
STATUS: NEW  

---

ACTION_ID: SDE-2026-09-25-002  
SOURCE_AUTOMATION: Dynamic Spell Discovery and Enemy Spell Evolution Designer  
TITLE: Resolve a G≥8 extra pool slot with generationMin  
CATEGORY: pool-evolution  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Wave-7 SDE-2026-09-24-002 asked for a G≥7 extra slot. Wave 8 stamps `generationMin: 8` on family verbs. `Math.floor(levelZone)` is still NaN (`enemyAI.ts` 194–199; WX 11920). `computeAITier` still plateaus at label 10 (`combatMath.ts` 36–52). #558 Wave-8 families consume **#525** as CORE, not as this G8 extra.  
SYSTEMS_AFFECTED: `resolveEnemyKit`; family overlays  
RECOMMENDED_ACTION: After SDE-2026-09-24-002 (and the unpublished G≥5 slot if a Wave-5 SDE PR ever lands), at G≥8 allow one extra ADVANCED/RARE/ELITE/SIGNATURE with `generationMin ≤ G`. Never retire CORE, G2, G3, G4, G6, or G7. Empty → `[physical_attack]`. Do not retune `pickEnemyLevelFromTiers`. No `G_max`. Do not put unique §11 ids in #405 / #452 / #558 CORE.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: SDE-2026-09-24-002; SDE-2026-08-31-005; SDE-2026-08-31-006  
REGRESSION_RISK: MEDIUM — G=7 Tide must not receive Step Rebate; empty kit must stay armed.  
VALIDATION_REQUIRED: Peer pawn still has Strike. `generationMin: 8` absent at G≤7.  
STATUS: NEW  

---

ACTION_ID: SDE-2026-09-25-003  
SOURCE_AUTOMATION: Dynamic Spell Discovery and Enemy Spell Evolution Designer  
TITLE: Wire Wave-8 aiHints before assigning those ids  
CATEGORY: ai-compat  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: `inferArchetype` (`enemyAI.ts` 447–452) still maps any `healAmount > 0` to healer. Summon fallback still uses name (`enemyAI.ts` 217–224). New hints (`force_odd_manhattan_walk`, `forbid_spell_until_walk`, `next_spell_unit_only`, `rebate_next_walk_mp`, `attract_toward_nearest_hostile`, `erase_last_paint_adjacent`, `bonus_if_open_floor`, `detonate_on_hit`, `split_incoming_adjacent_ally`, `forbid_strike_until_spell`, `next_walk_ignores_pit`, `self_buff_if_zero_leftover_ap`, `forbid_summon_leave_cell`, `heal_if_target_walked`, `stall_all_remaining_cds`, `bonus_if_target_is_leader`, `cheaper_if_bar_full`, `pack_siphon_leftover`, `fold_180_player_side`) have no decide* branch. `applyAttract` / `applyPushback` still have no production cast callers (`occupancy.ts` 482 / 537). Facing cards still fail closed (overworld-only write at WX 6924–6938). `isLeader` exists (`gameTypes.ts` 293) and must be the Crown Cut flag.  
SYSTEMS_AFFECTED: `enemyAI.ts` decide*; kit resolve; occupancy callers  
RECOMMENDED_ACTION: Implement each hint as a predicate on explicit flags / leftover AP / Bresenham / `isSummon` / `isLeader` / occupancy / last-written paint type / `walkMpSpentThisTurn`. Drop name fallbacks. Do not assign Foe Reel until `applyAttract` has a cast caller. Do not assign Chase Mend to non-healer CORE. Do not assign Face Away / Oncoming / Glance Cut / Shove Face until battle walks write `currentView`. Do not assign Pack Tithe on `tempo_precentor` (Pack Still already owns that CHAMPION aura). Missing hint → drop id, log once.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: SDE-2026-08-31-006; SDE-2026-09-01-003; SDE-2026-09-02-003; SDE-2026-09-21-003; SDE-2026-09-23-003; SDE-2026-09-24-003; SDA-2026-08-31-006  
REGRESSION_RISK: HIGH if Chase Mend lands on a charger CORE, Foe Reel pulls toward the caster like File Reel, Crown Cut name-checks `"king"`, or Pack Tithe stacks on Pack Still.  
VALIDATION_REQUIRED: Chase Mend skipped on unmoved target. Foe Reel skipped with no second hostile. Pack Tithe never owned. About Hinge skipped unless exactly two player-side bodies. Crown Cut skipped when `isLeader` is false and pack-leader flag is off.  
STATUS: NEW  

---

ACTION_ID: SDE-2026-09-25-004  
SOURCE_AUTOMATION: Dynamic Spell Discovery and Enemy Spell Evolution Designer  
TITLE: Implement Wave-8 unique definitions as data + pool rows  
CATEGORY: catalog-wave  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Unique §11 ids are absent from `spellData.ts` / `SPELL_ID_CATALOG` (32 live ids). Still-open #533 reserved Even Stride through File Fold. Same-day #563 reserved Gait Mend through Court Hinge. Tombstone in Wave-8 §0.1 must not be reused. Every frontend `mpCost` is still 0; unique Wave-8 rows stay 0. Combined paper spenders remain Ley Toll / Undertow / Sanguine Toll. Step Rebate is a walk-pool **flag**, not `spell.mpCost`.  
SYSTEMS_AFFECTED: `spellData.ts`; `bossKits.ts` catalog; family `EnemyKit` pools  
RECOMMENDED_ACTION: Add unique SDE ids one at a time with full metadata. `spell-pack-tithe` / `spell-about-hinge` never enter `ownedSpellIds`. Never `if (spell.name === …)`. About Hinge occupancy is not `map.portals` and not Twin/Triune/Twin Span/Triple Span/Pair Hinge tables. Do not pool Hex Toll. Do not add a fourth `mpCost > 0` id. Do not mint memory Wave-5 ids (`spell-gaze-sill` …). Stamp #563 ids (`spell-gait-mend` … `spell-court-hinge`) — do not clone them as §11 rows. Dummy Post keeps `summonAI: "dummypost"` (#563).  
AUTONOMY: HUMAN_APPROVE — each id is a combat toy.  
DEPENDENCIES: SDE-2026-09-25-001; SDE-2026-09-25-002; SDE-2026-09-25-003  
REGRESSION_RISK: HIGH per id if wired by name, assigned to the wrong profile, or if About Hinge reuses Pair Hinge dests as a grant.  
VALIDATION_REQUIRED: `validateBossKits()` still passes. Typecheck clean. G=7 Tide has no Step Rebate. About Hinge is not Pair Hinge. Chase Mend absent from non-healer CORE.  
STATUS: NEW  

---

ACTION_ID: SDE-2026-09-25-005  
SOURCE_AUTOMATION: Dynamic Spell Discovery and Enemy Spell Evolution Designer  
TITLE: Add odd_gallery, rebate_nave, wipe_gallery, mark_court, stall_nave; keep loaner orbs and WF-* non-owning  
CATEGORY: special-encounter  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Wave-1–7 discovery specials are the only tagged teach rooms. Wave-7 `even_gallery` / `toll_nave` / `paint_gallery` must not be retagged as Odd Stride / Step Rebate / Echo Wipe. All 15 feats remain claimed or leftover except this wave’s `leader_slayer` / `spell_master` MULTI children. `hard_1` / `legendary_1` stay Wave-7 challenge doors.  
SYSTEMS_AFFECTED: encounter tag table; kit overlay; loaner persist exception  
RECOMMENDED_ACTION: Tag existing solvable layouts. `odd_gallery` grants Odd Stride on victory without observation (MULTI with observe+win). Other four teach via observe+win. Do not grant Odd Stride on `even_gallery` or `WF-ELT-EVEN_PICKET`. `ENC-SPELL-07` / `WF-SPL-*` loaners must not write `ownedSpellIds` / `spellLevelKeys` or call `upgradeSpell`. Do not edit `mapGen.ts` algorithms. Do not invent a second recap. World portals stay locked while hostiles live.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: SDE-2026-08-31-003; SDE-2026-09-24-005; SDE-2026-09-25-004  
REGRESSION_RISK: MEDIUM if a tag seals portals, skips `finalizePlayableLayout`, treats About Hinge as `map.portals`, or persists a loaner as owned.  
VALIDATION_REQUIRED: Maps stay solvable. Defeat on `odd_gallery` does not grant. Loaner pickup leaves `spellLevelKeys` unchanged. Even Gallery victory does not grant Odd Stride.  
STATUS: NEW  

---

ACTION_ID: SDE-2026-09-25-006  
SOURCE_AUTOMATION: Dynamic Spell Discovery and Enemy Spell Evolution Designer  
TITLE: Observation edge cases for odd-walk, walk-MP rebate, paint erase, hit-detonate, and closed classes  
CATEGORY: discovery-pipeline  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Wave-1 observe is “cast spent AP.” Odd Stride observes the cast, not a later failed even walk. Step Rebate observes the arm, not the later cheaper walk. Echo Wipe observes itself even with no paint. Wound Mark observes the arm, not detonation. Chase Mend observes a 0-heal. Pack Tithe / About Hinge never persist.  
SYSTEMS_AFFECTED: observe hook; recap; challenge HP/AP helpers  
RECOMMENDED_ACTION: Observe on Odd Stride **cast** (even if the target is already rooted). Fizzle after AP spend still observes (Foe Reel no second hostile, Echo Wipe no paint, Empty Plate leftover ≥ 1, Full Bar with 7 equipped, Chase Mend unmoved **if AP was spent**). Illegal AI skip (no AP) does not. Pull/hinge landings use existing hazard ticks (`recordInBattleChallengeDamage` if lava/spikes while `inBattleRef`). Chase Mend flips `no_healing` only when HP increased. `ENEMY_ONLY` / `BOSS_ONLY` never write `ownedSpellIds`. Player summons never observe. Loaner orb pickup never observes.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: SDE-2026-08-31-002; SDE-2026-09-24-006; SDE-2026-09-25-004  
REGRESSION_RISK: HIGH if Step Rebate grants Ley Toll, Wound Mark grants Cast Mark, Chase Mend grants Gait Mend, or Pack Tithe is owned.  
VALIDATION_REQUIRED: Wave-8 QA rows W8-1…W8-18, W8-21, W8-23, W8-24.  
STATUS: NEW  

---

ACTION_ID: SDE-2026-09-25-007  
SOURCE_AUTOMATION: Dynamic Spell Discovery and Enemy Spell Evolution Designer  
TITLE: Recap cards must list Wave-8 fields on the existing popup  
CATEGORY: discovery-ux  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `PostBattleRecap.tsx` 6–34 still has no `discoveredSpells`. Wave-1 SDE-003 owns the field; Wave-8 only requires the same card shape (name, role, AP, range, target, key effect, source enemy). `leader_slayer` / `spell_master` MULTI children appear on that same recap, not a second modal. Achievement toast family is `pendingAchievementToast` at WX 2173 / 17949 — reuse, do not grow WX.  
SYSTEMS_AFFECTED: `BattleRecapData`; recap chrome  
RECOMMENDED_ACTION: Do not add a second popup. Stack up to 4 cards. Defeat never shows `NEW SPELL DISCOVERED`. Carved-stone / crimson only. Walk-MP rebate, odd-walk fail, and Wound Mark detonation are not a second cue. Feat Doka and the spell grant may share one recap.  
AUTONOMY: IMPLEMENT_AFTER_HUMAN  
DEPENDENCIES: SDE-2026-08-31-003; SDE-2026-08-31-004; SDE-2026-09-24-007  
REGRESSION_RISK: LOW for combat. MEDIUM if a second modal appears.  
VALIDATION_REQUIRED: One recap at `App.tsx` root.  
STATUS: NEW  

---

ACTION_ID: SDE-2026-09-25-008  
SOURCE_AUTOMATION: Dynamic Spell Discovery and Enemy Spell Evolution Designer  
TITLE: Stamp leftover leader_slayer / spell_master only; no fourth mpCost; no Hex Toll pool; no Wave-5 memory clone; do not restamp claimed doors  
CATEGORY: feat-challenge-boss  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: All 15 `defaultAchievements()` ids are claimed or leftover. Wave 7 stamped leftover `hard_1` / `legendary_1`. Wave 7 §13 reserved `survivor` / `leader_slayer` / `jackpot` / `spell_master` for later. `jackpot` is already #185 Absolve’s MULTI child. `survivor` stays leftover (Last Ember / Last Ward). Same-day #563 extra doors `gait_cantor` / `pair_usher` / `flush_precentor` / `dummy_castellan` / `court_hinge_regent` stamp Gait Mend / Pair Hinge / Cadence Flush / Dummy Post / Court Hinge — do not restamp. Combined paper `mpCost > 0` is already Ley Toll + Undertow + Sanguine Toll. Hex Toll remains a Quiet Hex near-clone.  
SYSTEMS_AFFECTED: feat persist; family overlays; `unlockOwnedSpell`  
RECOMMENDED_ACTION: Unique grants are observe+win / ELITE / `odd_gallery` / **`leader_slayer`** / **`spell_master`**. Crown Cut is the `isLeader` bonus — do not also grant Coup de Grace from `leader_slayer`. Full Bar is the 8-equipped AP discount — do not also grant Overcast / Hex of Silence from `spell_master`. Keep `unstoppable` unused as a spell gate. Do not stamp `survivor`. Do not restamp `jackpot`. Do not add `mpCost > 0` on any unique §11 row. Do not pool `spell-hex-toll`. Do not clone memory Wave-5 ids. About Hinge stays `BOSS_ONLY` on `about_hinge_regent` — do not restamp `about_regent`, #518 extra doors, #525 extra doors, or #563 extra doors.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: SDE-2026-09-25-001; SDE-2026-09-25-004  
REGRESSION_RISK: HIGH if `leader_slayer` double-grants Coup de Grace, `spell_master` double-grants Overcast, or a fourth walk-MP snipe ships without debit.  
VALIDATION_REQUIRED: Claiming `jackpot` still grants only Absolve. Completing `leader_slayer` grants Crown Cut at most once. Unique §11 rows all `mpCost: 0`. Hex Toll absent from SDE pools. Memory Wave-5 ids absent from `spellData.ts`.  
STATUS: NEW  
