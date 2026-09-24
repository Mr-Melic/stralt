# ACTION_IDs — 2026-09-24 Dynamic Spell Discovery & Enemy Spell Evolution

Durable ledger for implementers and the Report Action Orchestrator.  
Source of every record: Dynamic Spell Discovery and Enemy Spell Evolution Designer.  
Design contract: [`SPELL_DISCOVERY_ECOSYSTEM_2026-09-24.md`](./SPELL_DISCOVERY_ECOSYSTEM_2026-09-24.md).  
Wave-1 law (still blocking): [`SPELL_DISCOVERY_ECOSYSTEM_2026-08-31.md`](./SPELL_DISCOVERY_ECOSYSTEM_2026-08-31.md) and `SDE-2026-08-31-001`…`009`.  
Wave-2 generation stamp (still blocking): [`SPELL_DISCOVERY_ECOSYSTEM_2026-09-01.md`](./SPELL_DISCOVERY_ECOSYSTEM_2026-09-01.md) and `SDE-2026-09-01-001`…`008`.  
Wave-3 G≥3 extra slot (still blocking): [`SPELL_DISCOVERY_ECOSYSTEM_2026-09-02.md`](./SPELL_DISCOVERY_ECOSYSTEM_2026-09-02.md) and `SDE-2026-09-02-001`…`008`.  
Wave-4 G≥4 extra slot (still blocking): still-open #371 [`SPELL_DISCOVERY_ECOSYSTEM_2026-09-21.md`](https://github.com/Mr-Melic/stralt/blob/cursor/spell-discovery-and-evolution-2940/docs/automation/SPELL_DISCOVERY_ECOSYSTEM_2026-09-21.md) and `SDE-2026-09-21-001`…`008`.  
Wave-6 G≥6 extra slot (still blocking): still-open #480 [`SPELL_DISCOVERY_ECOSYSTEM_2026-09-23.md`](https://github.com/Mr-Melic/stralt/blob/cursor/spell-discovery-and-evolution-df4f/docs/automation/SPELL_DISCOVERY_ECOSYSTEM_2026-09-23.md) and `SDE-2026-09-23-001`…`008`.  
Do not implement gameplay from this file unless a later human or orchestrator explicitly picks an ID. This run ships **docs only**.

Sibling ledgers (do not re-open): `SDA-2026-08-31-001`…`013`; tactical ids in PRs #120 / #185 / #282 / #342 / **#411** / **#463**; family sheets in PR #136 / #349 / #405 / #452; boss adaptations in PRs #137 / #197 / #367 / #406 / **#474** / **#518**; Wave-1…Wave-4 / Wave-6 SDE ids; **memory-reserved Wave-5 unique ids** (no GitHub PR — still tombstoned). Same-day #503 world features (`WF-ELT-EVEN_PICKET`, `WF-TEL-FILE_SLIDE`) are **not** grant tags.

---

ACTION_ID: SDE-2026-09-24-001  
SOURCE_AUTOMATION: Dynamic Spell Discovery and Enemy Spell Evolution Designer  
TITLE: Do not land Wave-7 data before Wave-1 ownership split, Wave-2 G resolve, Wave-3 G≥3 slot, Wave-4 G≥4 slot, and Wave-6 G≥6 slot  
CATEGORY: dependency  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: `WorldExploration.tsx` 2395–2408 still forces every `starterSpells` row `isBaseSpell: true` (WX **19,213** lines). `BattleRecapData` (`PostBattleRecap.tsx` 6–34) has no `discoveredSpells`. `buildEnemyKit(enemy.pieceType, currentMap.levelZone)` at WX 11920 still passes a `{ name, minLevel, maxLevel }` object. `executeCastAttempt` (WX 17096–17207) still AP-only. Wave-1/2/3/4/6 P0 ACTION_IDs are still NEW. Adding 19 unique ids to the always-owned catalog would make discovery worse. No `SPELL_DISCOVERY_ECOSYSTEM_2026-09-22.md` PR exists; memory-reserved Wave-5 unique ids must still not land as `starterSpells`.  
SYSTEMS_AFFECTED: hydrate; recap; catalog; kit resolve  
RECOMMENDED_ACTION: Keep Wave-7 definitions `STATUS: PROPOSED` until innate four + observe + `commitSpellDiscoveries` + numeric `G` exist. Do not append Wave-7 ids to `starterSpells`. Coordinate with #411 / #463 / #480 so those catalogs land once. Do not mint the 2026-09-22 memory catalog (`spell-gaze-sill` … `spell-void-span`) as a substitute Wave 5. If a same-day Wave-7 tactical PR opens, stamp it — do not clone it into §11.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: SDE-2026-08-31-001; SDE-2026-08-31-002; SDE-2026-08-31-003; SDE-2026-09-01-001; SDE-2026-09-02-001; SDE-2026-09-21-001; SDE-2026-09-23-001  
REGRESSION_RISK: HIGH if ignored (catalog pre-own; G7 verbs on G=0 kits; fourth `mpCost` shipped without debit; Wave-5 memory ids collide with a later resurrected catalog).  
VALIDATION_REQUIRED: New character still owns only the four innate ids after Wave-1 split. `generationMin: 7` absent at G≤6.  
STATUS: NEW  

---

ACTION_ID: SDE-2026-09-24-002  
SOURCE_AUTOMATION: Dynamic Spell Discovery and Enemy Spell Evolution Designer  
TITLE: Resolve a G≥7 extra pool slot with generationMin  
CATEGORY: pool-evolution  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Wave-6 SDE-2026-09-23-002 asked for a G≥6 extra slot. Wave 7 stamps `generationMin: 7` on family verbs. `Math.floor(levelZone)` is still NaN (`enemyAI.ts` 194–199; WX 11920). `computeAITier` still plateaus at label 10 (`combatMath.ts` 36–52). #452 Wave-6 families consume **#411** as CORE, not as this G7 extra.  
SYSTEMS_AFFECTED: `resolveEnemyKit`; family overlays  
RECOMMENDED_ACTION: After SDE-2026-09-23-002 (and the unpublished G≥5 slot if a Wave-5 SDE PR ever lands), at G≥7 allow one extra ADVANCED/RARE/ELITE/SIGNATURE with `generationMin ≤ G`. Never retire CORE, G2, G3, G4, or G6. Empty → `[physical_attack]`. Do not retune `pickEnemyLevelFromTiers`. No `G_max`. Do not put unique §11 ids in #405 / #452 CORE.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: SDE-2026-09-23-002; SDE-2026-08-31-005; SDE-2026-08-31-006  
REGRESSION_RISK: MEDIUM — G=6 Tide must not receive Walk Toll; empty kit must stay armed.  
VALIDATION_REQUIRED: Peer pawn still has Strike. `generationMin: 7` absent at G≤6.  
STATUS: NEW  

---

ACTION_ID: SDE-2026-09-24-003  
SOURCE_AUTOMATION: Dynamic Spell Discovery and Enemy Spell Evolution Designer  
TITLE: Wire Wave-7 aiHints before assigning those ids  
CATEGORY: ai-compat  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: `inferArchetype` (`enemyAI.ts` 447–452) still maps any `healAmount > 0` to healer. Summon fallback still uses name (`enemyAI.ts` 217–224). New hints (`force_even_manhattan_walk`, `forbid_strike_until_walk`, `next_spell_ground_only`, `tax_next_walk_mp`, `freeze_leftover_ap`, `attract_toward_nearest_ally`, `copy_last_paint_adjacent`, `forbid_displace_ids`, `paint_enter_plus_mp`, `split_hit_adjacent_hostile`, `bonus_if_adj_block`, `detonate_on_cast`, `pause_hostile_summon_lifespan`, `steal_summon_cooldown`, `occupy_last_cell_left`, `cap_next_incoming`, `ignore_los_if_untouched`, `pack_zero_leftover_veil`, `fold_shared_file_player_side`) have no decide* branch. `applyAttract` / `applyPushback` still have no production cast callers (`occupancy.ts` 482 / 537). Facing cards still fail closed (overworld-only write at WX 6924–6938).  
SYSTEMS_AFFECTED: `enemyAI.ts` decide*; kit resolve; occupancy callers  
RECOMMENDED_ACTION: Implement each hint as a predicate on explicit flags / leftover AP / Bresenham / `isSummon` / occupancy / last-written paint type. Drop name fallbacks. Do not assign Ally Reel until `applyAttract` has a cast caller. Do not assign Face Away / Oncoming / Glance Cut (prior waves) until battle walks write `currentView`. Do not assign Pack Still on `hex_chorister` (Pack Ledger already owns that CHAMPION aura). Missing hint → drop id, log once.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: SDE-2026-08-31-006; SDE-2026-09-01-003; SDE-2026-09-02-003; SDE-2026-09-21-003; SDE-2026-09-23-003; SDA-2026-08-31-006  
REGRESSION_RISK: HIGH if Ghost Step is treated as Twin Span occupancy, Ally Reel pulls toward the caster like File Reel, or Pack Still stacks on Pack Ledger.  
VALIDATION_REQUIRED: Ally Reel skipped with no ally. Ghost Step skipped with MP = 0. Pack Still never owned. File Fold skipped unless two player-side bodies share rank/file.  
STATUS: NEW  

---

ACTION_ID: SDE-2026-09-24-004  
SOURCE_AUTOMATION: Dynamic Spell Discovery and Enemy Spell Evolution Designer  
TITLE: Implement Wave-7 unique definitions as data + pool rows  
CATEGORY: catalog-wave  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Unique §11 ids are absent from `spellData.ts` / `SPELL_ID_CATALOG` (32 live ids). Still-open #480 reserved Choir Verse through Court Fold. Still-open #411 / #463 reserved Oncoming through About Face. Tombstone in Wave-7 §0.1 must not be reused. Every frontend `mpCost` is still 0; unique Wave-7 rows stay 0. Combined paper spenders remain Ley Toll / Undertow / Sanguine Toll. Walk Toll / Gift Sill are walk-pool **flags**, not `spell.mpCost`.  
SYSTEMS_AFFECTED: `spellData.ts`; `bossKits.ts` catalog; family `EnemyKit` pools  
RECOMMENDED_ACTION: Add unique SDE ids one at a time with full metadata. `spell-pack-still` / `spell-file-fold` never enter `ownedSpellIds`. Never `if (spell.name === …)`. Ghost Step occupancy is not `map.portals` and not Twin/Triune/Twin Span tables. Do not pool Hex Toll. Do not add a fourth `mpCost > 0` id. Do not mint memory Wave-5 ids (`spell-gaze-sill` …). If a same-day Wave-7 tactical PR exists at implementation time, stamp those ids — do not clone them as §11 rows.  
AUTONOMY: HUMAN_APPROVE — each id is a combat toy.  
DEPENDENCIES: SDE-2026-09-24-001; SDE-2026-09-24-002; SDE-2026-09-24-003  
REGRESSION_RISK: HIGH per id if wired by name, assigned to the wrong profile, or if Ghost Step reuses Twin Span occupancy.  
VALIDATION_REQUIRED: `validateBossKits()` still passes. Typecheck clean. G=6 Tide has no Walk Toll. Ghost Step is not Twin Span.  
STATUS: NEW  

---

ACTION_ID: SDE-2026-09-24-005  
SOURCE_AUTOMATION: Dynamic Spell Discovery and Enemy Spell Evolution Designer  
TITLE: Add even_gallery, toll_nave, lock_nave, paint_gallery, ghost_court; keep loaner orbs and WF-* non-owning  
CATEGORY: special-encounter  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Wave-1–6 discovery specials are the only tagged teach rooms. Same-day #503 world features (`WF-ELT-EVEN_PICKET`, `WF-TEL-FILE_SLIDE`) must not be retagged as grants. All 15 feats remain claimed or leftover. `hard_1` / `legendary_1` are this wave’s challenge MULTI children, not special tags.  
SYSTEMS_AFFECTED: encounter tag table; kit overlay; loaner persist exception  
RECOMMENDED_ACTION: Tag existing solvable layouts. `even_gallery` grants Even Stride on victory without observation (MULTI with observe+win). Other four teach via observe+win. Do not grant Even Stride on `WF-ELT-EVEN_PICKET` contact. Do not treat `WF-TEL-FILE_SLIDE` as File Fold. `ENC-SPELL-07` / `WF-SPL-*` loaners must not write `ownedSpellIds` / `spellLevelKeys` or call `upgradeSpell`. Do not edit `mapGen.ts` algorithms. Do not invent a second recap. World portals stay locked while hostiles live.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: SDE-2026-08-31-003; SDE-2026-09-23-005; SDE-2026-09-24-004  
REGRESSION_RISK: MEDIUM if a tag seals portals, skips `finalizePlayableLayout`, treats Ghost Step as `map.portals`, or persists a loaner as owned.  
VALIDATION_REQUIRED: Maps stay solvable. Defeat on `even_gallery` does not grant. Loaner pickup leaves `spellLevelKeys` unchanged. Even Picket contact does not grant Even Stride.  
STATUS: NEW  

---

ACTION_ID: SDE-2026-09-24-006  
SOURCE_AUTOMATION: Dynamic Spell Discovery and Enemy Spell Evolution Designer  
TITLE: Observation edge cases for even-walk, walk-MP tax, paint copy, ghost occupancy, and closed classes  
CATEGORY: discovery-pipeline  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Wave-1 observe is “cast spent AP.” Even Stride observes the cast, not a later failed odd walk. Walk Toll / Gift Sill observe the arm/paint, not the later MP debit/grant. Echo Paint observes itself; the original Cinder Tile observes separately. Cast Mark observes the arm, not detonation. Ghost Step observes the arm, not occupancy. Pack Still / File Fold never persist.  
SYSTEMS_AFFECTED: observe hook; recap; challenge HP/AP helpers  
RECOMMENDED_ACTION: Observe on Even Stride **cast** (even if the target is already rooted). Fizzle after AP spend still observes (Ally Reel no ally, Echo Paint no paint, Still Leash on player, Clean Blood already damaged **if AP was spent**). Illegal AI skip (no AP) does not. Pull/ghost/split landings use existing hazard ticks (`recordInBattleChallengeDamage` if lava/spikes while `inBattleRef`). `ENEMY_ONLY` / `BOSS_ONLY` never write `ownedSpellIds`. Player summons never observe. Loaner orb pickup never observes.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: SDE-2026-08-31-002; SDE-2026-09-23-006; SDE-2026-09-24-004  
REGRESSION_RISK: HIGH if Walk Toll grants Ley Toll, Ghost Step grants Twin Span, or Pack Still is owned.  
VALIDATION_REQUIRED: Wave-7 QA rows W7-1…W7-18, W7-21, W7-23, W7-24.  
STATUS: NEW  

---

ACTION_ID: SDE-2026-09-24-007  
SOURCE_AUTOMATION: Dynamic Spell Discovery and Enemy Spell Evolution Designer  
TITLE: Recap cards must list Wave-7 fields on the existing popup  
CATEGORY: discovery-ux  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `PostBattleRecap.tsx` 6–34 still has no `discoveredSpells`. Wave-1 SDE-003 owns the field; Wave-7 only requires the same card shape (name, role, AP, range, target, key effect, source enemy). `hard_1` / `legendary_1` MULTI children appear on that same recap, not a second modal. Achievement toast family is `pendingAchievementToast` at WX 2173 / 17949 — reuse, do not grow WX.  
SYSTEMS_AFFECTED: `BattleRecapData`; recap chrome  
RECOMMENDED_ACTION: Do not add a second popup. Stack up to 4 cards. Defeat never shows `NEW SPELL DISCOVERED`. Carved-stone / crimson only. Walk-MP tax, even-walk fail, and Ghost Step occupancy are not a second cue. Challenge Doka and the spell grant may share one recap.  
AUTONOMY: IMPLEMENT_AFTER_HUMAN  
DEPENDENCIES: SDE-2026-08-31-003; SDE-2026-08-31-004; SDE-2026-09-23-007  
REGRESSION_RISK: LOW for combat. MEDIUM if a second modal appears.  
VALIDATION_REQUIRED: One recap at `App.tsx` root.  
STATUS: NEW  

---

ACTION_ID: SDE-2026-09-24-008  
SOURCE_AUTOMATION: Dynamic Spell Discovery and Enemy Spell Evolution Designer  
TITLE: Stamp leftover hard_1 / legendary_1 only; no fourth mpCost; no Hex Toll pool; no Wave-5 memory clone; do not restamp claimed doors  
CATEGORY: feat-challenge-boss  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: All 15 `defaultAchievements()` ids are claimed or leftover. All nine `DEFAULT_CHALLENGES` ids except leftover `hard_1` / `legendary_1` were claimed through Wave 6. Wave 6 §13 reserved those two challenge identities for Wave 7. `easy_1` already grants Bloodless Plate (no-heal). `legendary_1` is Untouchable (`no_damage_taken`), not easy_3. #411 claimed `weeping_pawn` / `eternal_pawn_king` / `enthroned_void`. #367 / #406 / #463 / #474 extra doors stay claimed. Same-day #518 Wave-8 extra doors `gaze_beadle` / `span_chamberlain` / `cover_hospitaller` / `lintel_sacrist` stamp Facing Pin / Span Guard / Cover Step / Low Lintel — do not restamp. Combined paper `mpCost > 0` is already Ley Toll + Undertow + Sanguine Toll. Hex Toll remains a Quiet Hex near-clone.  
SYSTEMS_AFFECTED: challenge persist; family overlays; `unlockOwnedSpell`  
RECOMMENDED_ACTION: Unique grants are observe+win / ELITE / `even_gallery` / **`hard_1`** / **`legendary_1`**. Thin Ward is the under-30 incoming cap — do not also grant Bloodless Plate from `hard_1`. Clean Blood is untouched-last-turn LoS ignore — do not also grant from `easy_3`. Keep `unstoppable` unused as a spell gate. Do not stamp `survivor` (Last Ember / Last Ward). Do not add `mpCost > 0` on any unique §11 row. Do not pool `spell-hex-toll`. Do not clone memory Wave-5 ids. File Fold stays `BOSS_ONLY` on `file_regent` — do not restamp #474 extra doors or #518 extra doors.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: SDE-2026-09-24-001; SDE-2026-09-24-004  
REGRESSION_RISK: HIGH if `hard_1` double-grants Bloodless Plate, `legendary_1` double-grants a Wave-1 card, or a fourth walk-MP snipe ships without debit.  
VALIDATION_REQUIRED: Claiming `easy_1` still grants only Bloodless Plate. Completing `hard_1` grants Thin Ward at most once. Unique §11 rows all `mpCost: 0`. Hex Toll absent from SDE pools. Memory Wave-5 ids absent from `spellData.ts`.  
STATUS: NEW  
