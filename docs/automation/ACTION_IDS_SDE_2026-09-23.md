# ACTION_IDs — 2026-09-23 Dynamic Spell Discovery & Enemy Spell Evolution

Durable ledger for implementers and the Report Action Orchestrator.  
Source of every record: Dynamic Spell Discovery and Enemy Spell Evolution Designer.  
Design contract: [`SPELL_DISCOVERY_ECOSYSTEM_2026-09-23.md`](./SPELL_DISCOVERY_ECOSYSTEM_2026-09-23.md).  
Wave-1 law (still blocking): [`SPELL_DISCOVERY_ECOSYSTEM_2026-08-31.md`](./SPELL_DISCOVERY_ECOSYSTEM_2026-08-31.md) and `SDE-2026-08-31-001`…`009`.  
Wave-2 generation stamp (still blocking): [`SPELL_DISCOVERY_ECOSYSTEM_2026-09-01.md`](./SPELL_DISCOVERY_ECOSYSTEM_2026-09-01.md) and `SDE-2026-09-01-001`…`008`.  
Wave-3 G≥3 extra slot (still blocking): [`SPELL_DISCOVERY_ECOSYSTEM_2026-09-02.md`](./SPELL_DISCOVERY_ECOSYSTEM_2026-09-02.md) and `SDE-2026-09-02-001`…`008`.  
Wave-4 G≥4 extra slot (still blocking): still-open #371 [`SPELL_DISCOVERY_ECOSYSTEM_2026-09-21.md`](https://github.com/Mr-Melic/stralt/blob/cursor/spell-discovery-and-evolution-2940/docs/automation/SPELL_DISCOVERY_ECOSYSTEM_2026-09-21.md) and `SDE-2026-09-21-001`…`008`.  
Do not implement gameplay from this file unless a later human or orchestrator explicitly picks an ID. This run ships **docs only**.

Sibling ledgers (do not re-open): `SDA-2026-08-31-001`…`013`; tactical ids in PRs #120 / #185 / #282 / #342 / **#411** / **same-day #463**; family sheets in PR #136 / #349 / #405 / same-day #452; boss adaptations in PRs #137 / #197 / #367 / #406; Wave-1…Wave-4 SDE ids; **memory-reserved Wave-5 unique ids** (no GitHub PR — still tombstoned).

---

ACTION_ID: SDE-2026-09-23-001  
SOURCE_AUTOMATION: Dynamic Spell Discovery and Enemy Spell Evolution Designer  
TITLE: Do not land Wave-6 data before Wave-1 ownership split, Wave-2 G resolve, Wave-3 G≥3 slot, and Wave-4 G≥4 slot  
CATEGORY: dependency  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: `WorldExploration.tsx` 2395–2408 still forces every `starterSpells` row `isBaseSpell: true` (WX **19,213** lines). `BattleRecapData` (`PostBattleRecap.tsx` 6–34) has no `discoveredSpells`. `buildEnemyKit(enemy.pieceType, currentMap.levelZone)` at WX 11920 still passes a `{ name, minLevel, maxLevel }` object. `executeCastAttempt` (WX 17096–17207) still AP-only. Wave-1/2/3/4 P0 ACTION_IDs are still NEW. Adding 19 unique ids plus #411 / #463 stamps to the always-owned catalog would make discovery worse. No `SPELL_DISCOVERY_ECOSYSTEM_2026-09-22.md` PR exists; memory-reserved Wave-5 unique ids must still not land as `starterSpells`.  
SYSTEMS_AFFECTED: hydrate; recap; catalog; kit resolve  
RECOMMENDED_ACTION: Keep Wave-6 definitions `STATUS: PROPOSED` until innate four + observe + `commitSpellDiscoveries` + numeric `G` exist. Do not append Wave-6 ids to `starterSpells`. Coordinate with #411 so Oncoming / Span Guard / Cadence Theft land once. Coordinate with #463 so Post Sting / Twin Span / Cadence Break / File Reel land once. Do not mint the 2026-09-22 memory catalog (`spell-gaze-sill` … `spell-void-span`) as a substitute Wave 5.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: SDE-2026-08-31-001; SDE-2026-08-31-002; SDE-2026-08-31-003; SDE-2026-09-01-001; SDE-2026-09-02-001; SDE-2026-09-21-001; SDE-2026-09-21-002  
REGRESSION_RISK: HIGH if ignored (catalog pre-own; G6 verbs on G=0 kits; fourth `mpCost` shipped without debit; Wave-5 memory ids collide with a later resurrected catalog).  
VALIDATION_REQUIRED: New character still owns only the four innate ids after Wave-1 split. `generationMin: 6` absent at G≤5.  
STATUS: NEW  

---

ACTION_ID: SDE-2026-09-23-002  
SOURCE_AUTOMATION: Dynamic Spell Discovery and Enemy Spell Evolution Designer  
TITLE: Resolve a G≥6 extra pool slot with generationMin  
CATEGORY: pool-evolution  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Wave-4 SDE-2026-09-21-002 asked for a G≥4 extra slot. Wave 6 stamps `generationMin: 6` on family verbs. `Math.floor(levelZone)` is still NaN (`enemyAI.ts` 194–199; WX 11920). `computeAITier` still plateaus at label 10 (`combatMath.ts` 36–52). Same-day #452 Wave-6 families (`oncoming_knight` … `act_sexton`) consume **#411** as CORE, not as this G6 extra.  
SYSTEMS_AFFECTED: `resolveEnemyKit`; family overlays  
RECOMMENDED_ACTION: After SDE-2026-09-21-002 (and the unpublished G≥5 slot if a Wave-5 SDE PR ever lands), at G≥6 allow one extra ADVANCED/RARE/ELITE/SIGNATURE with `generationMin ≤ G`. Never retire CORE, G2, G3, or G4. Empty → `[physical_attack]`. Do not retune `pickEnemyLevelFromTiers`. No `G_max`. Do not put unique §11 ids in #405 / #452 CORE.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: SDE-2026-09-21-002; SDE-2026-08-31-005; SDE-2026-08-31-006  
REGRESSION_RISK: MEDIUM — G=5 Tide must not receive Empty Purse; empty kit must stay armed.  
VALIDATION_REQUIRED: Peer pawn still has Strike. `generationMin: 6` absent at G≤5.  
STATUS: NEW  

---

ACTION_ID: SDE-2026-09-23-003  
SOURCE_AUTOMATION: Dynamic Spell Discovery and Enemy Spell Evolution Designer  
TITLE: Wire Wave-6 aiHints before assigning those ids  
CATEGORY: ai-compat  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: `inferArchetype` (`enemyAI.ts` 447–452) still maps any `healAmount > 0` to healer. Summon fallback still uses name (`enemyAI.ts` 217–224). New hints (`copy_ally_last_id`, `force_next_walk_diagonal`, `bonus_if_target_on_hazard`, `spend_leftover_ap_for_damage`, `tax_walk_through_me`, `swap_own_summon`, `range_if_los_blocked`, `invert_one_current_view`, `zero_next_strike`, `forbid_summon_enter_cell`, `burn_leftover_ap_at_turn_end`, `share_to_living_summon`, `cut_hostile_summon_lifespan`, `forbid_axis_primary`, `skip_next_hazard_landing`, `range_if_zero_leftover_ap`, `skip_next_overwatch_walk`, `pack_leftover_aura`, `fold_adjacent_player_side`) have no decide* branch. #411 facing cards and this wave’s Face Away **fail closed** until a battle `currentView` writer exists (overworld-only write at WX 6924–6938). #463 `summonAI: "twinspan"` / `"spark"` and this wave’s pet-swap require enums, not name parses.  
SYSTEMS_AFFECTED: `enemyAI.ts` decide*; kit resolve; admin summon validation  
RECOMMENDED_ACTION: Implement each hint as a predicate on explicit flags / leftover AP / Bresenham / last-resolved **ally** id / `isSummon` / occupancy. Drop name fallbacks. Do not assign Choir Verse without an ally last-resolved pipeline. Do not assign Face Away / Oncoming / Glance Cut until battle walks write `currentView`. Do not assign Pet Swap to kits that never summon. Do not assign Twin Span (#463) as if it were Span Guard. Missing hint → drop id, log once. Accept `summonAI: "twinspan"` / `"spark"` in admin validation.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: SDE-2026-08-31-006; SDE-2026-09-01-003; SDE-2026-09-02-003; SDE-2026-09-21-003; SDA-2026-08-31-006  
REGRESSION_RISK: HIGH if Choir Verse copies a denylisted id by name, Face Away reads pixels, or Twin Span is given to a 1-cell guardian.  
VALIDATION_REQUIRED: Choir Verse skipped with no ally last-resolved. Face Away skipped with missing `currentView`. Pack auras not stacked on BASE hex. Twin Span counts as two toward the summon cap.  
STATUS: NEW  

---

ACTION_ID: SDE-2026-09-23-004  
SOURCE_AUTOMATION: Dynamic Spell Discovery and Enemy Spell Evolution Designer  
TITLE: Implement Wave-6 unique definitions as data + pool rows; stamp #411 and #463  
CATEGORY: catalog-wave  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Unique §11 ids are absent from `spellData.ts` / `SPELL_ID_CATALOG` (32 live ids). Same-day #463 reserved Post Sting through About Face. Still-open #411 reserved Oncoming through Act Bell. Tombstone in Wave-6 §0.1 must not be reused. Every frontend `mpCost` is still 0; unique Wave-6 rows stay 0. Combined paper spenders remain Ley Toll / Undertow / Sanguine Toll.  
SYSTEMS_AFFECTED: `spellData.ts`; `bossKits.ts` catalog; family `EnemyKit` pools  
RECOMMENDED_ACTION: Add unique SDE ids one at a time with full metadata. **Stamp** #411 onto #452 Wave-6 families and **stamp** #463 onto §12 overlays — do not clone either catalog. `spell-pack-ledger` / `spell-court-fold` never enter `ownedSpellIds`. Never `if (spell.name === …)`. Twin Span pads/posts are not `map.portals` and not Twin/Triune/Span Guard tables. Do not pool Hex Toll. Do not add a fourth `mpCost > 0` id. Do not mint memory Wave-5 ids (`spell-gaze-sill` …).  
AUTONOMY: HUMAN_APPROVE — each id is a combat toy.  
DEPENDENCIES: SDE-2026-09-23-001; SDE-2026-09-23-002; SDE-2026-09-23-003  
REGRESSION_RISK: HIGH per id if wired by name, assigned to the wrong profile, or if Twin Span reuses Span Guard occupancy.  
VALIDATION_REQUIRED: `validateBossKits()` still passes. Typecheck clean. G=5 Tide has no Empty Purse. Twin Span is not Span Guard.  
STATUS: NEW  

---

ACTION_ID: SDE-2026-09-23-005  
SOURCE_AUTOMATION: Dynamic Spell Discovery and Enemy Spell Evolution Designer  
TITLE: Add choir_gallery, wick_gallery, purse_nave, pet_sill_hall, dull_court; keep loaner orbs non-owning  
CATEGORY: special-encounter  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Wave-1–4 discovery specials are the only tagged teach rooms. Same-day world catalogs must not be retagged as grants. All 15 feats and 9 challenges remain claimed. #411 / #367 / #406 extra doors stay claimed.  
SYSTEMS_AFFECTED: encounter tag table; kit overlay; loaner persist exception  
RECOMMENDED_ACTION: Tag existing solvable layouts. `choir_gallery` grants Choir Verse on victory without observation (MULTI with observe+win). Other four teach via observe+win. Do not grant Choir Verse on a world-feature echo room unless tagged `choir_gallery` or the hostile used the spell. `ENC-SPELL-07` / `WF-SPL-ECHO_SCRIBE` loaners must not write `ownedSpellIds` / `spellLevelKeys` or call `upgradeSpell`. Do not edit `mapGen.ts` algorithms. Do not invent a second recap. World portals stay locked while hostiles live.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: SDE-2026-08-31-003; SDE-2026-09-21-005; SDE-2026-09-23-004  
REGRESSION_RISK: MEDIUM if a tag seals portals, skips `finalizePlayableLayout`, treats Twin Span posts as `map.portals`, or persists a loaner as owned.  
VALIDATION_REQUIRED: Maps stay solvable. Defeat on `choir_gallery` does not grant. Loaner pickup leaves `spellLevelKeys` unchanged.  
STATUS: NEW  

---

ACTION_ID: SDE-2026-09-23-006  
SOURCE_AUTOMATION: Dynamic Spell Discovery and Enemy Spell Evolution Designer  
TITLE: Observation edge cases for ally-echo, leftover-AP spend, facing invert, pet swap, and closed classes  
CATEGORY: discovery-pipeline  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Wave-1 observe is “cast spent AP.” Choir Verse observes itself; the ally’s original id observes separately if a hostile used it. Empty Purse observes the buff/hit cast, not a later leftover tick. Face Away observes the invert cast, not later walks. Pet Swap lava is environmental, not a second observe. Pack Ledger / Court Fold never persist. Cadence Break (#463) observes the reset cast, not a later free recast. Twin Span observes the summon cast, not post walks.  
SYSTEMS_AFFECTED: observe hook; recap; challenge HP/AP helpers  
RECOMMENDED_ACTION: Observe on Choir Verse **cast** (even if copy fizzles). Fizzle after AP spend still observes (Bias Step illegal geometry, Pet Swap no summon, Face Away missing view **if AP was spent**). Illegal AI skip (no AP) does not. Swap/shove landings use existing hazard ticks (`recordInBattleChallengeDamage` if lava/spikes while `inBattleRef`). `ENEMY_ONLY` / `BOSS_ONLY` never write `ownedSpellIds`. Player summons never observe. Loaner orb pickup never observes. Facing cards without a battle writer skip (no AP) → no observe.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: SDE-2026-08-31-002; SDE-2026-09-21-006; SDE-2026-09-23-004  
REGRESSION_RISK: HIGH if Choir Verse grants the copied id, Face Away grants without a writer, or Pack Ledger is owned.  
VALIDATION_REQUIRED: Wave-6 QA rows W6-1…W6-8, W6-17b, W6-21, W6-22.  
STATUS: NEW  

---

ACTION_ID: SDE-2026-09-23-007  
SOURCE_AUTOMATION: Dynamic Spell Discovery and Enemy Spell Evolution Designer  
TITLE: Recap cards must list Wave-6 fields on the existing popup  
CATEGORY: discovery-ux  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `PostBattleRecap.tsx` 6–34 still has no `discoveredSpells`. Wave-1 SDE-003 owns the field; Wave-6 only requires the same card shape (name, role, AP, range, target, key effect, source enemy). Achievement toast family is `pendingAchievementToast` at WX 2173 / 17949 — reuse, do not grow WX.  
SYSTEMS_AFFECTED: `BattleRecapData`; recap chrome  
RECOMMENDED_ACTION: Do not add a second popup. Stack up to 4 cards. Defeat never shows `NEW SPELL DISCOVERED`. Carved-stone / crimson only. Leftover-AP spend and facing invert are not a second cue.  
AUTONOMY: IMPLEMENT_AFTER_HUMAN  
DEPENDENCIES: SDE-2026-08-31-003; SDE-2026-08-31-004; SDE-2026-09-21-007  
REGRESSION_RISK: LOW for combat. MEDIUM if a second modal appears.  
VALIDATION_REQUIRED: One recap at `App.tsx` root.  
STATUS: NEW  

---

ACTION_ID: SDE-2026-09-23-008  
SOURCE_AUTOMATION: Dynamic Spell Discovery and Enemy Spell Evolution Designer  
TITLE: Do not restamp claimed feat/challenge/boss doors; no fourth mpCost; no Hex Toll pool; no Wave-5 memory clone  
CATEGORY: feat-challenge-boss  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: All 15 `defaultAchievements()` ids and all nine `DEFAULT_CHALLENGES` ids are claimed. #411 claimed `weeping_pawn` / `eternal_pawn_king` / `enthroned_void`. #367 extra doors `ram_castellan` / `fosse_warden` / `stride_censor` / `morrow_herald`. #406 extra doors `lock_marshal` / `bait_vicar` / `font_abbess` / `surplus_auditor`. #463 proposed Wave-7 extra doors `oath_censor` / `hinge_porter` / `exit_mason` / `about_regent`. Combined paper `mpCost > 0` is already Ley Toll + Undertow + Sanguine Toll. Hex Toll remains a Quiet Hex near-clone.  
SYSTEMS_AFFECTED: `AchievementConfig`; challenge persist; family overlays  
RECOMMENDED_ACTION: Wave-6 unique grants are observe+win / ELITE / `choir_gallery` only. Stamp #411 / #463 family demonstrate paths without restamping their feat/boss/MULTI doors. Keep `unstoppable` unused as a spell gate. Do not add `mpCost > 0` on any unique §11 row. Do not pool `spell-hex-toll`. Do not clone memory Wave-5 ids. Court Fold stays `BOSS_ONLY` on `fold_regent` — do not also grant Oath Blade / About Face from that fight, and do not restamp #474 extra doors (`mill_seneschal` / `counter_chaplain` / `wedge_prior` / `levy_rector`).  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: SDE-2026-09-23-001; SDE-2026-09-23-004  
REGRESSION_RISK: HIGH if a claimed door double-grants or a fourth walk-MP snipe ships without debit.  
VALIDATION_REQUIRED: Claiming `first_blood` still grants only Bias Ray. Unique §11 rows all `mpCost: 0`. Hex Toll absent from SDE pools. Memory Wave-5 ids absent from `spellData.ts`.  
STATUS: NEW  
