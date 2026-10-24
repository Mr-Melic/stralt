# ACTION_IDs — 2026-10-24 Mechanic Interaction Matrix Auditor

Durable ledger for the Report Action Orchestrator.  
SOURCE_AUTOMATION: Mechanic Interaction Matrix Auditor  
HEAD inspected: `0f5363f` (`Merge pull request #332`)  
Gameplay code: not modified.

Do not re-file OPEN 08-31 / 09-01 / 09-02 / 09-21…09-29 / 10-21 / 10-22 / 10-23 items or this file's 001–005. Do not clone EBMA-2026-09-01-004 (player `debuffStat` never applied — still true on this HEAD; owned by EBMA) or EBMA-2026-09-01-012 (Blood Mend / Rally CHC crit read). Do not invent Gravity Well / Fog of War placeholders, push/pull unwired, or “Mirror Field unwired” (Blood Moon + Mirror Field remain wired in `resolvePlayerCast`).

---

ACTION_ID: MIMA-2026-10-24-001  
SOURCE_AUTOMATION: Mechanic Interaction Matrix Auditor  
TITLE: Summon kit damage (AI + controlled) skips Windstorm / Mirror Field / Blood Moon / crit  
CATEGORY: summons + map modifiers + damage  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Player casts use `resolvePlayerCast` (`spellEngine.ts` 895–915): Blood Moon 1.25×, Fury 1.25×, Mirror Field 20% reflect, Paper Windstorm miss, then crit via `chc`. Controlled summon kits call `resolveSpellCast` (`WorldExploration.tsx` 9849–9872) — that resolver (`spellEngine.ts` 413–505) has no `isBloodMoon` / `isMirrorField` / `isPaperWindstorm` / crit reads; `isCrit: false` and `dmgBuffModifier: 1.0` are hardcoded. Summon AI uses `executeSummonAction.applyCast` (`summonExecutor.ts` 162–167): `calcScaledDamage` → `dealDamage` with no modifier gates. Same WX session can cast Inferno (modifiers apply) then let an Archer AI kit hit (modifiers skipped). Distinct from MIMA-2026-09-29-002 (Fury × summon **melee** only), 09-02-005 (Pacifist), 10-21-009 (Sacrifice early-return). Tests: `summonExecutor.test.ts` / `summonControlCast.test.ts` cover MP/AP/range — none assert Windstorm/Mirror/Blood Moon on kit damage.  
EXPECTED_INTERACTION: Player-side kit damage (control or AI) honours the same map-modifier and crit gates as `resolvePlayerCast` outbound damage.  
ACTUAL_INTERACTION: Only the player bar path pays Windstorm/Mirror/Blood Moon/crit; summon kits always land full scaled damage.  
SYSTEMS_AFFECTED: summons, Paper Windstorm, Mirror Field, Blood Moon, crit, controlled cast  
RECOMMENDED_ACTION: Route summon kit damage through a shared outbound gate (extract from `resolvePlayerCast` pre-loop) or call `resolvePlayerCast`-equivalent helpers from control + `applyCast`. Do not change player rates (30% Windstorm / 20% Mirror). Tests: kit cast under each modifier flag.  
AUTONOMY: IMPLEMENT_SHARED_OUTBOUND_GATE  
DEPENDENCIES: Distinct from 09-29-002 Fury melee; may share helper with that fix.  
REGRESSION_RISK: MEDIUM — summon DPS drops under Windstorm/Mirror/Blood Moon.  
VALIDATION_REQUIRED: Unit tests on the shared gate; playtest Blood Moon hunter kit vs player Inferno.  
STATUS: NEW  

---

ACTION_ID: MIMA-2026-10-24-002  
SOURCE_AUTOMATION: Mechanic Interaction Matrix Auditor  
TITLE: Boss kit spell skips player SP mitigation, Windstorm miss, and Void Mirror; enemy kit applies all three  
CATEGORY: boss phases + defense + map modifiers + mirror  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Enemy kit damage (`WorldExploration.tsx` 16474–16569) computes SP+RES factors, rolls Paper Windstorm (50% when `spellRange > 1`), then `consumePlayerMirror`, else `playerTakesDamage`. Boss kit spell branch (`WorldExploration.tsx` 15859–15867) feeds raw `bossSpell.damage` straight into `playerTakesDamage` — no SP factor, no Windstorm, no `consumePlayerMirror`. Boss AI always targets the player for kit spells (`useBossAI.ts` 176–180), so the asymmetry is live every boss kit hit. Distinct from MIMA-2026-10-22-004 (`abilityResult.damageToPlayer` shield-yes / RES-no — different apply site) and 09-29-003 (Shield Charm soak vs Void Mirror reflect amount). Tests: no boss-kit × Windstorm / Mirror / SP fixture.  
EXPECTED_INTERACTION: Incoming boss kit spells share enemy-kit defense gates (SP-or-SR mitigation, Windstorm, player Void Mirror) before HP commit.  
ACTUAL_INTERACTION: Boss kits only get Shield+RES inside `playerTakesDamage`; Mirror/Windstorm never trigger; SP factor never runs.  
SYSTEMS_AFFECTED: boss kits, Paper Windstorm, Void Mirror, SP/SR, Shield Charm  
RECOMMENDED_ACTION: Share one `applyIncomingHostileSpell(raw, opts)` used by enemy kit and boss kit. Decide SP vs SR in the same change as 003. Tests: boss kit under Windstorm miss; active player Mirror consumes on boss kit.  
AUTONOMY: IMPLEMENT_SHARED_INCOMING_SPELL  
DEPENDENCIES: Coordinate with 003 (SP vs SR). Distinct from 10-22-004 ability path.  
REGRESSION_RISK: MEDIUM — bosses become less lethal under Mirror/Windstorm.  
VALIDATION_REQUIRED: Boss kit unit test; playtest Mirror then boss phase-1 damage spell.  
STATUS: NEW  

---

ACTION_ID: MIMA-2026-10-24-003  
SOURCE_AUTOMATION: Mechanic Interaction Matrix Auditor  
TITLE: Enemy kit uses player SP as incoming mitigation and double-applies RES via `playerTakesDamage`; player SR never read  
CATEGORY: defense + RES + SP/SR + enemy AI  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Outbound player math treats `sp` as Spell Power and `sr` as Spell Resistance (`WorldExploration.tsx` 3318–3363; HUD shows `characterStats.sr` at ~18536). Incoming enemy kit (`16475–16537`) multiplies by `(1 - characterStats.sp/100) * (1 - res/100)`, then `playerTakesDamage` (`3429–3432`) applies RES **again**. Melee fallback (`16722–16728`) and boss kit (`15864`) apply RES once and never touch SR. Player `sr` has no incoming consumer in WX. Distinct from MIMA-2026-10-22-002 (CL **bounce** double RES on enemies) and 10-22-004 (boss ability RES skip). Tests: none for incoming SP vs SR or double RES.  
EXPECTED_INTERACTION: Incoming spells reduce by player **SR** × **RES** once; SP stays outbound-only; melee/DoT use RES once.  
ACTUAL_INTERACTION: Enemy spells discount SP (wrong stat) and RES twice; SR is display-only; boss/DoT/melee disagree on the SP term.  
SYSTEMS_AFFECTED: enemy kit damage, RES, SP, SR, Shield Charm order  
RECOMMENDED_ACTION: Replace `plSpEff` with `characterStats.sr` (and SR buffs); pass pre-RES damage into a soak helper that does not re-apply RES, **or** drop the pre-factor and let `playerTakesDamage` own RES after an SR step. Tests: RES 20 + SR 10 ⇒ one multiply each; SP 20 does not change incoming.  
AUTONOMY: IMPLEMENT_INCOMING_MITIGATION_HELPER  
DEPENDENCIES: Same helper as 002. Do not change outbound `calculatePlayerDamage`.  
REGRESSION_RISK: HIGH — every enemy spell’s received damage changes.  
VALIDATION_REQUIRED: Fixture table SP/SR/RES combos; playtest high-SR build vs bishop kit.  
STATUS: NEW  

---

ACTION_ID: MIMA-2026-10-24-004  
SOURCE_AUTOMATION: Mechanic Interaction Matrix Auditor  
TITLE: Slow/Weaken on summons ignored by turn budget; summon damage reads player `dmg` mod via hard-coded casterId  
CATEGORY: summons + status + Slow/Weaken  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Enemy/boss (and controlled Archer via `resolveSpellCast`) can land `spell-slow` / `spell-weaken` on a summon id (`WorldExploration.tsx` 16594–16605, 15907–15918; `spellEngine.ts` 529–548). Summon turn restore uses `summonTurnBudget` (`summonControlCast.ts` 356–364) = raw `maxAp`/`maxMp` — no `getStatModifier(summonId, "mp"|"ap")`. Player turn restore **does** add AP/MP mods (`WorldExploration.tsx` 14350–14359). Summon AI/control `dealDamage` callbacks pass casterId `"player"` (`14997–15003`, `9171–9182`), so `enemyTakesDamage` (`3492–3494`) multiplies by `getStatModifier("player", "dmg")` — a Weaken on the **summon** never reduces kit damage, while a Weaken on the **player** incorrectly taxes every summon hit. Distinct from EBMA-2026-09-01-004 (player bar never writes `debuffStat` — different path; effects that **do** land still miss summon consumers). Tests: `summonTurnBudget` only checks maxAp/maxMp floors (`summonControlCast.test.ts` 605+).  
EXPECTED_INTERACTION: Slow −MP / Weaken ×dmg on a summon change that summon’s budget and outgoing damage; player Weaken does not blanket-tax minion hits.  
ACTUAL_INTERACTION: Summon-targeted Slow/Weaken are cosmetic for budget/damage; player Weaken leaks onto summon DPS.  
SYSTEMS_AFFECTED: summons, Slow, Weaken, turn restore, enemyTakesDamage  
RECOMMENDED_ACTION: `summonTurnBudget(summon, effects)` applies AP/MP additives; `dealDamage` passes `summon.id` as casterId (or explicit `dmgCasterId`). Tests: Slow −2 on wolf ⇒ `currentMp = maxMp - 2`; Weaken on wolf reduces kit hit; Weaken on player does not.  
AUTONOMY: IMPLEMENT_BUDGET_AND_CASTER_ID  
DEPENDENCIES: None on EBMA-004; once EBMA wires player Weaken onto enemies, this still owns summon consumers.  
REGRESSION_RISK: MEDIUM — summons become weaker under boss Slow/Weaken kits.  
VALIDATION_REQUIRED: Unit tests on budget + casterId; playtest bishop Slow on controlled wolf.  
STATUS: NEW  

---

ACTION_ID: MIMA-2026-10-24-005  
SOURCE_AUTOMATION: Mechanic Interaction Matrix Auditor  
TITLE: Controlled summon kit zeros target RES/SP/SR in `resolveSpellCast` (SR never applied; RES only via later `enemyTakesDamage`)  
CATEGORY: summons + RES + SP/SR + controlled cast  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: `castControlledSummonSpell` builds the target snapshot with `stats: { res: 0, sp: 0 }` (`WorldExploration.tsx` 9860–9868) and no `sr`. `resolveSpellCast` → `computeDamage` (`spellEngine.ts` 484–498) therefore skips SR/SP/RES at resolve time. `dealDamage` → `enemyTakesDamage` then applies RES once (`3489–3498`) but still not SR. Player bar path uses live enemy `res`/`sr` in `calculatePlayerDamage` (`3347–3363`) and commits via `applyDamageToEnemy` without a second RES. Distinct from 001 (map modifiers) and 003 (incoming on the player). Tests: none for controlled kit vs high-SR enemy.  
EXPECTED_INTERACTION: Controlled kit hits use the same target SR×RES as player spells.  
ACTUAL_INTERACTION: Control kits ignore SR entirely and only get a late RES pass; high-SR targets take full kit damage.  
SYSTEMS_AFFECTED: controlled summons, SR, RES, resolveSpellCast  
RECOMMENDED_ACTION: Pass live `res`/`sr`/`sp` from `targetEnemy` into the snapshot; align with player outbound. Prefer one damage helper with 001.  
AUTONOMY: IMPLEMENT_SNAPSHOT_STATS  
DEPENDENCIES: Pairs cleanly with 001.  
REGRESSION_RISK: LOW–MEDIUM — kit damage drops vs tanky enemies.  
VALIDATION_REQUIRED: Control Strike vs RES 30 / SR 20 fixture.  
STATUS: NEW  

---

ACTION_ID: MIMA-2026-10-24-006  
SOURCE_AUTOMATION: Mechanic Interaction Matrix Auditor  
TITLE: Boss Rush / rest / white / Death Realm portal paths never increment `mapsVisited` so `explore_25_maps` stalls in runs  
CATEGORY: achievements + portals + Boss Rush + dungeons  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `mapsVisitedCountRef.current += 1` exists in exactly one place (`WorldExploration.tsx` 6471), on the main free-exploration / dungeon-chain generate path after a normal portal. Boss Rush entry (`6077–6089`), Boss Rush room-advance (`6095–6110`), white sanctuary (`6115–6155`), and rest entry (`6158–6218`) each `return` after `cleanupMap` / map spawn and only bump `mapCount` (e.g. white/rest `6141` / `6187`) — never the achievement counter. Death Realm load bumps `mapCount` (`13471`) without `mapsVisited` (intentional for death). `clientTrustedVictoryAchievementConditions` / the idle effect still gate `explore_25_maps` on `mapsVisited >= 25` (`victoryAchievements.ts` 32; WX `2275–2276`). A full Boss Rush run can clear several combat rooms with 0 counter growth. Distinct from MIMA-2026-10-21-005 (React effect deps when the counter *does* increment) and 10-21-004 (Boss Rush room-clear × wallet/level threshold feats). Tests: `portalRules.test.ts` / `victoryAchievements.test.ts` never assert mapsVisited on BR room-advance.  
EXPECTED_INTERACTION: Each new combat map (including Boss Rush rooms and rest→overworld returns that regenerate a map) advances the explore counter; Death Realm stays excluded.  
ACTUAL_INTERACTION: Only the single main portal-generate path counts; Boss Rush / rest / white transitions are invisible to `explore_25_maps`.  
SYSTEMS_AFFECTED: explore_25_maps, mapsVisited, Boss Rush, rest/white portals, victory feat snapshot  
RECOMMENDED_ACTION: Extract `recordMapVisit({ countDeathRealm: false })` and call it from every non-death map publish that creates a new playable map (Boss Rush spawn/advance, rest exit back to overworld, white→sanctuary if product wants it). Keep Death Realm off the counter. Tests: BR room 0→1 increments; Death Realm load does not; rest entry policy documented. Do not change loot_10.  
AUTONOMY: IMPLEMENT_HELPER_THEN_PORTAL_CALL_SITES  
DEPENDENCIES: Distinct from 10-21-005; do not fold React-deps fix into this.  
REGRESSION_RISK: LOW–MEDIUM — explore_25 unlocks sooner for run-heavy players.  
VALIDATION_REQUIRED: Unit test on the helper; playtest Boss Rush two-room advance and Feats panel counter.  
STATUS: NEW  

---

ACTION_ID: MIMA-2026-10-24-007  
SOURCE_AUTOMATION: Mechanic Interaction Matrix Auditor  
TITLE: Version-gate localStorage wipe drops `mapsVisited` / ground-doka counters so explore_25 and loot_10 progress reset  
CATEGORY: achievements + persistence + versionGate  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `APP_VERSION` bump (`App.tsx` 298–317) `localStorage.clear()` then restores only keys `shouldPreserveVersionGateKey` allows (`versionGate.ts` 7–12): `pbv_tier_spawn_config`, `pbv_levelup_config`, `*_inventory`. Client feat counters live at `${userId}_slotN_pbv_maps_visited_count` and `…_pbv_ground_doka_pickups` (WX `6471–6477`, `11400–11407`) — not preserved. After reload the refs rehydrate from missing keys → 0 (`WX` 2193). Canister unlocks already granted stay, but a player at 24 maps / 9 ground pickups loses the unlock race and must re-farm. Distinct from unpaid-death races (09-25…09-28) and from 09-27-004 (`loot_10` claim-time / mapsVisited *gate* on claim). Tests: `versionGate.test.ts` only asserts inventory + admin configs survive.  
EXPECTED_INTERACTION: Version wipe keeps paid inventory *and* client-only feat progress counters that are not canister-backed, or those counters move to the canister.  
ACTUAL_INTERACTION: Inventory survives; explore_25 / loot_10 progress counters are erased every bump.  
SYSTEMS_AFFECTED: versionGate, explore_25_maps, loot_10_doka, localStorage  
RECOMMENDED_ACTION: Preserve keys ending `_pbv_maps_visited_count` / `_pbv_ground_doka_pickups` (and the unscoped fallbacks) in `shouldPreserveVersionGateKey`, **or** persist those counters on the profile. Do not preserve `pbv_pending_death_penalty_*` here without an unpaid-death design pass. Tests: version wipe restores a seeded mapsVisited=24 key.  
AUTONOMY: IMPLEMENT_VERSION_GATE_PRESERVE  
DEPENDENCIES: None. Do not clone unpaid-death honour filings.  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: `versionGate.test.ts` fixture; manual bump APP_VERSION with seeded counters.  
STATUS: NEW  
