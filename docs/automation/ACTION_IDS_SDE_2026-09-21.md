# ACTION_IDs — 2026-09-21 Dynamic Spell Discovery & Enemy Spell Evolution

Durable ledger for implementers and the Report Action Orchestrator.  
Source of every record: Dynamic Spell Discovery and Enemy Spell Evolution Designer.  
Design contract: [`SPELL_DISCOVERY_ECOSYSTEM_2026-09-21.md`](./SPELL_DISCOVERY_ECOSYSTEM_2026-09-21.md).  
Wave-1 law (still blocking): [`SPELL_DISCOVERY_ECOSYSTEM_2026-08-31.md`](./SPELL_DISCOVERY_ECOSYSTEM_2026-08-31.md) and `SDE-2026-08-31-001`…`009`.  
Wave-2 generation stamp (still blocking): [`SPELL_DISCOVERY_ECOSYSTEM_2026-09-01.md`](./SPELL_DISCOVERY_ECOSYSTEM_2026-09-01.md) and `SDE-2026-09-01-001`…`008`.  
Wave-3 G≥3 extra slot (still blocking): [`SPELL_DISCOVERY_ECOSYSTEM_2026-09-02.md`](./SPELL_DISCOVERY_ECOSYSTEM_2026-09-02.md) and `SDE-2026-09-02-001`…`008`.  
Do not implement gameplay from this file unless a later human or orchestrator explicitly picks an ID. This run ships **docs only**.

Sibling ledgers (do not re-open): `SDA-2026-08-31-001`…`013`; tactical ids in PRs #120 / #185 / #282 / **same-day #342**; family sheets in PR #136 / same-day #349; boss adaptations in PRs #137 / #197 / same-day #367; Wave-1, Wave-2, and Wave-3 SDE ids.

---

ACTION_ID: SDE-2026-09-21-001  
SOURCE_AUTOMATION: Dynamic Spell Discovery and Enemy Spell Evolution Designer  
TITLE: Do not land Wave-4 data before Wave-1 ownership split, Wave-2 G resolve, and Wave-3 G≥3 slot  
CATEGORY: dependency  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: `WorldExploration.tsx` 2395–2408 still forces every `starterSpells` row `isBaseSpell: true` (WX now 19,213 lines). `BattleRecapData` (`PostBattleRecap.tsx` 6–34) has no `discoveredSpells`. `buildEnemyKit(enemy.pieceType, currentMap.levelZone)` at WX 11920 still passes a `{ name, minLevel, maxLevel }` object. `executeCastAttempt` (WX 17096–17205) still AP-only. Wave-1 P0, Wave-2 P0, and Wave-3 P0 (`SDE-2026-09-02-001`, `003`) are still NEW. Adding 19 ids plus #342 stamps to the always-owned catalog would make discovery worse.  
SYSTEMS_AFFECTED: hydrate; recap; catalog; kit resolve  
RECOMMENDED_ACTION: Keep Wave-4 definitions `STATUS: PROPOSED` until innate four + observe + `commitSpellDiscoveries` + numeric `G` exist. Do not append Wave-4 ids to `starterSpells`. Coordinate with #342 so Gale Fan / Twin Guard / Sanguine Toll land once.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: SDE-2026-08-31-001; SDE-2026-08-31-002; SDE-2026-08-31-003; SDE-2026-09-01-001; SDE-2026-09-02-001; SDE-2026-09-02-002  
REGRESSION_RISK: HIGH if ignored (catalog pre-own; G4 verbs on G=0 kits; third `mpCost` shipped without debit).  
VALIDATION_REQUIRED: New character still owns only the four innate ids after Wave-1 split. `generationMin: 4` absent at G=0/1/2/3.  
STATUS: NEW  

---

ACTION_ID: SDE-2026-09-21-002  
SOURCE_AUTOMATION: Dynamic Spell Discovery and Enemy Spell Evolution Designer  
TITLE: Resolve a G≥4 extra pool slot with generationMin  
CATEGORY: pool-evolution  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Wave-3 SDE-2026-09-02-002 asked for a G≥3 extra slot. Wave 4 stamps `generationMin: 4` on family verbs. `Math.floor(levelZone)` is still NaN (`enemyAI.ts` 194–199; WX 11920). `computeAITier` still plateaus at label 10 (`combatMath.ts` 36–52).  
SYSTEMS_AFFECTED: `resolveEnemyKit`; family overlays  
RECOMMENDED_ACTION: After SDE-2026-09-02-002, at G≥4 allow one extra ADVANCED/RARE/ELITE/SIGNATURE with `generationMin ≤ G`. Never retire CORE, G2, or G3. Empty → `[physical_attack]`. Do not retune `pickEnemyLevelFromTiers`. No `G_max`.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: SDE-2026-09-02-002; SDE-2026-08-31-005; SDE-2026-08-31-006  
REGRESSION_RISK: MEDIUM — G=3 Tide must not receive Spent Stride; empty kit must stay armed.  
VALIDATION_REQUIRED: Peer pawn still has Strike. `generationMin: 4` absent at G≤3.  
STATUS: NEW  

---

ACTION_ID: SDE-2026-09-21-003  
SOURCE_AUTOMATION: Dynamic Spell Discovery and Enemy Spell Evolution Designer  
TITLE: Wire Wave-4 aiHints before assigning those ids  
CATEGORY: ai-compat  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: `inferArchetype` (`enemyAI.ts` 447–452) still maps any `healAmount > 0` to healer. Summon fallback still uses name (`enemyAI.ts` 217–224). New hints (`paint_three_pads`, `echo_hostile_last`, `dash_ally_toward_cell`, `force_next_step_cardinal`, `copy_player_last_at_wrap`, …) have no decide* branch. #342 `summonAI: "bait"` and this wave’s `summonAI: "decoy"` are enums, not name parses.  
SYSTEMS_AFFECTED: `enemyAI.ts` decide*; kit resolve; admin summon validation  
RECOMMENDED_ACTION: Implement each hint as a predicate on explicit flags / leftover AP-MP / Bresenham pit / last-resolved id lists. Drop name fallbacks. Do not assign Triune Gate until the AI can pick three cells. Do not assign Stolen Verse without a last-resolved pipeline. Do not assign Relay Dash to kits that never summon. Missing hint → drop id, log once. Accept `summonAI: "decoy"` in admin validation.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: SDE-2026-08-31-006; SDE-2026-09-01-003; SDE-2026-09-02-003; SDA-2026-08-31-006  
REGRESSION_RISK: HIGH if Stolen Verse copies a denylisted id by name, or Triune pads reuse `map.portals`.  
VALIDATION_REQUIRED: Stolen Verse skipped with no last-resolved. Triune skipped with <3 cells. Pack auras not stacked on BASE hex.  
STATUS: NEW  

---

ACTION_ID: SDE-2026-09-21-004  
SOURCE_AUTOMATION: Dynamic Spell Discovery and Enemy Spell Evolution Designer  
TITLE: Implement Wave-4 unique definitions as data + pool rows; stamp #342 / unfamilied W2  
CATEGORY: catalog-wave  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Unique §11 ids are absent from `spellData.ts` / `SPELL_ID_CATALOG` (32 live ids). Same-day #342 already reserved Gale Fan through Eclipse Fold. Tombstone in Wave-4 §0.1 must not be reused. Every frontend `mpCost` is still 0; unique Wave-4 rows stay 0. Still Brand / Grounded Lock remain unfamilied (#349 §9).  
SYSTEMS_AFFECTED: `spellData.ts`; `bossKits.ts` catalog; family `EnemyKit` pools  
RECOMMENDED_ACTION: Add unique SDE ids one at a time with full metadata. **Stamp** #342 ids onto families in §12 — do not clone them. Late-stamp `spell-still-brand` onto `hex_chorister` and `spell-grounded-lock` onto `void_mirror` at `generationMin: 2`. `spell-second-shadow` / `spell-repel-ring` / `spell-false-echo` never enter `ownedSpellIds`. Never `if (spell.name === …)`. Triune pads are `triunePads`, not `map.portals` and not Twin Gate’s pair table. Do not pool Hex Toll. Do not add a fourth `mpCost > 0` id.  
AUTONOMY: HUMAN_APPROVE — each id is a combat toy.  
DEPENDENCIES: SDE-2026-09-21-001; SDE-2026-09-21-002; SDE-2026-09-21-003  
REGRESSION_RISK: HIGH per id if wired by name, assigned to the wrong profile, or if Triune reuses `map.portals`.  
VALIDATION_REQUIRED: `validateBossKits()` still passes. Typecheck clean. G=3 Tide has no Spent Stride. Triune is not a world portal.  
STATUS: NEW  

---

ACTION_ID: SDE-2026-09-21-005  
SOURCE_AUTOMATION: Dynamic Spell Discovery and Enemy Spell Evolution Designer  
TITLE: Add triune_gallery, haze_gallery, stolen_pulpit, nail_court, pit_gallery; keep loaner orbs non-owning  
CATEGORY: special-encounter  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Wave-1–3 discovery specials are the only tagged teach rooms. Same-day #347 `ENC-SPELL-07` loans Frost/Slow as a **one-cast** (`WF-SPL-LOANER_MAGE`) and `ENC-MOVE-06` uses world-feature triune pads. Those are not this spell. Feats/challenges are all claimed — Wave 4 unique grants cannot restamp them.  
SYSTEMS_AFFECTED: encounter tag table; kit overlay; loaner persist exception  
RECOMMENDED_ACTION: Tag existing solvable layouts. `triune_gallery` grants Triune Gate on victory without observation (MULTI with observe+win). Other four teach via observe+win. Do not grant Triune Gate on #347 ENC-MOVE-06 unless tagged `triune_gallery` or the hostile painted the spell. `ENC-SPELL-07` loaner must not write `ownedSpellIds` / `spellLevelKeys` or call `upgradeSpell`. Do not edit `mapGen.ts` algorithms. Do not invent a second recap. World portals stay locked while hostiles live.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: SDE-2026-08-31-003; SDE-2026-09-02-006; SDE-2026-09-21-004  
REGRESSION_RISK: MEDIUM if a tag seals portals, skips `finalizePlayableLayout`, treats Triune cells as `map.portals`, or persists a loaner as owned.  
VALIDATION_REQUIRED: Maps stay solvable. Defeat on `triune_gallery` does not grant. Loaner pickup leaves `spellLevelKeys` unchanged.  
STATUS: NEW  

---

ACTION_ID: SDE-2026-09-21-006  
SOURCE_AUTOMATION: Dynamic Spell Discovery and Enemy Spell Evolution Designer  
TITLE: Observation edge cases for triune paint, stolen verse, dash landings, and closed classes  
CATEGORY: discovery-pipeline  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Wave-1 observe is “cast spent AP.” Triune / Nail-down observe on paint/arm, not transit/expiry. Stolen Verse observes itself; the hostile’s original id observes separately. Relay Dash lava is environmental, not a second observe. Repel Ring / Second Shadow / False Echo never persist. Spent Stride observes the buff cast, not the later +1 AP.  
SYSTEMS_AFFECTED: observe hook; recap; challenge HP/AP helpers  
RECOMMENDED_ACTION: Observe on Triune **paint** and Nail-down **arm**. Fizzle after AP spend still observes (Stolen Verse empty, Relay Dash blocked, Waste Pace at 0 MP if AP was spent). Illegal AI skip (no AP) does not. Dash/shove landings use existing hazard ticks (`recordInBattleChallengeDamage` if lava/spikes while `inBattleRef`). `ENEMY_ONLY` / `BOSS_ONLY` never write `ownedSpellIds`. Player summons never observe. Loaner orb pickup never observes.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: SDE-2026-08-31-002; SDE-2026-09-02-007; SDE-2026-09-21-004  
REGRESSION_RISK: HIGH if transit double-observes, Stolen Verse grants the stolen id, or Repel Ring is owned.  
VALIDATION_REQUIRED: Wave-4 QA rows W4-1…W4-7, W4-21, W4-22, W4-24.  
STATUS: NEW  

---

ACTION_ID: SDE-2026-09-21-007  
SOURCE_AUTOMATION: Dynamic Spell Discovery and Enemy Spell Evolution Designer  
TITLE: Recap cards must list Wave-4 fields on the existing popup  
CATEGORY: discovery-ux  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `PostBattleRecap.tsx` 6–34 still has no `discoveredSpells`. Wave-1 SDE-003 owns the field; Wave-4 only requires the same card shape (name, role, AP, range, target, key effect, source enemy).  
SYSTEMS_AFFECTED: `BattleRecapData`; recap chrome  
RECOMMENDED_ACTION: Do not add a second popup. Stack up to 4 cards. Defeat never shows `NEW SPELL DISCOVERED`. Carved-stone / crimson only. Triune transit MP and loaner orbs are not a second cue.  
AUTONOMY: IMPLEMENT_AFTER_HUMAN  
DEPENDENCIES: SDE-2026-08-31-003; SDE-2026-08-31-004; SDE-2026-09-02-008  
REGRESSION_RISK: LOW for combat. MEDIUM if a second modal appears.  
VALIDATION_REQUIRED: One recap at `App.tsx` root.  
STATUS: NEW  

---

ACTION_ID: SDE-2026-09-21-008  
SOURCE_AUTOMATION: Dynamic Spell Discovery and Enemy Spell Evolution Designer  
TITLE: Do not restamp claimed feat/challenge doors; no fourth mpCost; no Hex Toll pool  
CATEGORY: feat-challenge-boss  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: All 15 `defaultAchievements()` ids and all nine `DEFAULT_CHALLENGES` ids are claimed by Waves 1–3, #120/#185/#282, or same-day #342 (`first_blood` Bias Ray, `doka_hoarder` Surplus Ward, `betrayal_witness` Twin Guard, `rich_vampire` Sated Fang). Combined paper `mpCost > 0` is already Ley Toll + Undertow + Sanguine Toll. Hex Toll remains a Quiet Hex near-clone.  
SYSTEMS_AFFECTED: `AchievementConfig`; challenge persist; family overlays  
RECOMMENDED_ACTION: Wave-4 unique grants are observe+win / ELITE / `triune_gallery` only. Stamp #342 family demonstrate paths without restamping their feat/boss doors. Keep `unstoppable` unused as a spell gate. Do not add `mpCost > 0` on any unique §11 row. Do not pool `spell-hex-toll`. False Echo stays `BOSS_ONLY` on `unbound_pendulum` — do not also grant After Verse from that fight.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: SDE-2026-09-21-001; SDE-2026-09-21-004  
REGRESSION_RISK: HIGH if a claimed door double-grants or a fourth walk-MP snipe ships without debit.  
VALIDATION_REQUIRED: Claiming `first_blood` still grants only Bias Ray. Unique §11 rows all `mpCost: 0`. Hex Toll absent from SDE pools.  
STATUS: NEW  
