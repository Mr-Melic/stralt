# ACTION_IDs — 2026-09-21 Mechanic Interaction Matrix Auditor

Durable ledger for the Report Action Orchestrator.  
SOURCE_AUTOMATION: Mechanic Interaction Matrix Auditor  
HEAD inspected: `0f5363f` (`Merge pull request #332`)  
Gameplay code: not modified.

Do not re-file still-OPEN prior items (`MIMA-2026-08-31-001/002/005/008`, `MIMA-2026-09-01-002/006`, `MIMA-2026-09-02-002/003/004/005/006`). Frozen AI (09-02-001), Frozen execute (09-01-001), Wisp healUsed (09-01-005), Drain healUsed, Challenge HUD, Boss Rush feats, and Attack Nearest **origin** are closed. Do not clone **#327** (Striker AoE/bounce) or **#331** (portal destack).

---

ACTION_ID: MIMA-2026-09-21-001  
SOURCE_AUTOMATION: Mechanic Interaction Matrix Auditor  
TITLE: Map-modifier HP/MP hooks never commit to the player after combatantsRef exclusion  
CATEGORY: statuses + healing + hazards + MP + challenges + player feedback  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Player is documented as living outside `combatantsRef` (`battleSetup.ts` 359–368 `playerTurnStartModifierTarget` returns `combatants.find(id === "player")`, tests assert `undefined` when only enemies are present). Player turn start calls that helper then `mapModifierRegistry.applyTurnStart` only if a target exists (`WorldExploration.tsx` 14262–14274). Registry `void_rift` `onTurnStart` subtracts `VOID_RIFT_TICK` (3) from `combatant.hp` (`mapModifiers.ts` 194–207); `mending_mist` adds 5% max HP (350–365); `swift_winds` adds +2 `combatant.mp` (368–376). None of those run for the player. Plague Zone is the only player special-case (`isPlagueZone` 14313–14333). Summon/enemy turns duplicate plague/void into `updateCombatant` because “applyTurnStart only mutates the turn-order entry” (14474–14478, 14570–14596) — Mending Mist has **no** store commit on any side. Battle start `applyBattleStart(combatantsRef.current)` (12076–12079) then overwrites player AP/MP from `getPlayerBaseStats` (12105–12116), so `titans_vigor` +1000 HP (300–316) lands on enemies only. `enemyTakesDamage` passes a **throwaway** `{ hp: characterStats.hp, id: "player" }` into `applyDamageDealt` (3499–3506); `vampiric_ground` does `attacker.hp += floor(damage * 0.15)` (401–416) on that stub — live HP unchanged, `challengeHealUsedRef` untouched, so easy_1 / hard_1 still pay. Distinct from MIMA-2026-08-31-008 (walk-on-rift extra via `applyBattleWalkHazards`) and 09-01-005 (Wisp `heal` callbacks).  
EXPECTED_INTERACTION: Announced modifier HP/MP changes write the same live stats challenges and death read (`characterStats.hp`, `currentBattleMp`, combatant store). In-battle player HP gains set `healUsed`.  
ACTUAL_INTERACTION: Announce fires; player HP/MP stay on the progression formula; enemy Titan's Vigor inflates hostiles; Vampiric / Mist heals are discarded; Void Rift’s “3 damage per turn” is unpaid for the player.  
SYSTEMS_AFFECTED: map modifiers, healing, hazards (Void Rift tick), MP, challenges (no_healing / Untouchable), death, player feedback  
RECOMMENDED_ACTION: One commit helper: after registry hooks, copy mutated player HP into `setCharacterStats` / challenge recorders, and mutated unit HP into `updateCombatant`. Include a synthetic player row for battle-start/turn-start **or** pass `characterStats` explicitly. Do not restore the `[0]` enemy fallback. Tests: `void_rift` player turn −3 HP; `mending_mist` in-battle healUsed; `vampiric_ground` hit either heals + fails easy_1 or does not log a heal; Titan's Vigor either buffs the player or the announce says enemies only. Do not change plague numbers.  
AUTONOMY: IMPLEMENT_HELPER_THEN_WX_TURN_START  
DEPENDENCIES: Distinct from 08-31-008 walk dest. Reuse `recordChallengeHealFromHpRestore` for Mist/Vampiric. Do not fold Dawn (002).  
REGRESSION_RISK: MEDIUM — must not tick Void Rift twice on summons that already have the WX store commit; must not tax Titan's Vigor into CharacterStats persist.  
VALIDATION_REQUIRED: Helper tests; playtest Void Rift + Mending Mist + Vampiric maps.  
STATUS: NEW  

---

ACTION_ID: MIMA-2026-09-21-002  
SOURCE_AUTOMATION: Mechanic Interaction Matrix Auditor  
TITLE: Twin Monarchs Dawn +1 MP is announced and applied as AP  
CATEGORY: boss phases + AP + MP + player feedback  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: `applyDawnBuff` (`useBossSystem.ts` 1275–1301) rolls three blessings. Roll 0 is `playerApModifier: 2` with “+2 AP” (correct). Roll 1 is `damageToPlayer: -10` (still 09-02-006 — do not re-file). Roll 2 comments “+1 MP for this turn — represented as AP modifier” and returns `playerApModifier: 1` with log “Dawn briefly blesses you with +1 MP bonus!” WX applies every nonzero `playerApModifier` via `setCurrentBattleApSynced` (16042–16046) and never touches `currentBattleMp`. No `playerMpModifier` field exists on `BossAbilityResult` (`bossTypes.ts` 343). Distinct from 09-02-006 (heal ignored).  
EXPECTED_INTERACTION: The log and the resource that changes are the same. +1 MP raises battle MP for the remainder of the turn; +AP would be logged as AP.  
ACTUAL_INTERACTION: Player reads MP, receives 1 AP; MP pool unchanged. Deterministic mislabel, not RNG.  
SYSTEMS_AFFECTED: boss phases (Twin Monarchs Dawn), AP, MP, player feedback  
RECOMMENDED_ACTION: Add `playerMpModifier` and apply it with `setCurrentBattleMp`, **or** change the log to “+1 AP”. Do not reuse `playerApModifier` for MP. Tests: roll-2 fixture ⇒ MP +1 XOR copy says AP. Do not change other Twin Monarchs damage.  
AUTONOMY: IMPLEMENT_ONE_FIELD_OR_COPY  
DEPENDENCIES: None. Do not fold into 09-02-006 (HP).  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Ability result fixture; playtest Twin Monarchs phase 1 every-3rd-turn buff.  
STATUS: NEW  

---

ACTION_ID: MIMA-2026-09-21-003  
SOURCE_AUTOMATION: Mechanic Interaction Matrix Auditor  
TITLE: Player-side summon AI kit/melee never fails Striker; control-mode already does  
CATEGORY: challenges + summons + range  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: legendary_3 requires every spent attempt within Chebyshev 2 (`challengeCompletion.ts` 379–428). Control-mode kit casts call `applyChallengeDirectHit` from the summon tile (`WorldExploration.tsx` 9874–9883); tests cover Archer range-4 (`challengeCompletion.test.ts` 712–738). Player `executeCastAttempt` records from `playerPositionRef` (17178–17187). `executeSummonAction` melee/cast (`summonExecutor.ts` 164–171, 226–228) goes through `summonCtx.dealDamage` and returns; WX applies position/HP then `advanceTurn` (15286–15317) with **zero** `applyChallengeDirectHit`. An idle player with an Archer AI can land Poison Arrow (range 4) / Slow (range 3) and persist 400 Doka / 800 XP. Distinct from 09-02-005 (Pacifist ref) and from in-flight **#327** (AoE/bounce beyond 2 on the **player** cast path).  
EXPECTED_INTERACTION: Any player-side spent attack that lands beyond 2 tiles fails Striker, whether the unit is controlled or AI. Vacuous no-cast wins stay false (`directHitAttempts`).  
ACTUAL_INTERACTION: Control path is honest; AI path is invisible to the feat.  
SYSTEMS_AFFECTED: challenges (Striker), summons (AI executor), rewards  
RECOMMENDED_ACTION: After a player-side summon `cast`/`melee` that called `dealDamage`, run `applyChallengeDirectHit` with summon origin and target cell (same helper as control). Do not mark Wisp heals. Tests: AI archer Chebyshev 4 ⇒ `directHit` false and persist entries empty; melee Chebyshev 1 stays completable. Do not edit `challengeCompletion.ts` while **#327** is open — WX/executor only, or wait and union.  
AUTONOMY: IMPLEMENT_ONE_HOOK_AFTER_EXECUTOR  
DEPENDENCIES: Do not clone #327. Distinct from 09-02-005 Pacifist.  
REGRESSION_RISK: LOW if only AI damage flips; MEDIUM if heal kits are counted as attempts.  
VALIDATION_REQUIRED: Helper test with executor log; playtest summon-AI Archer + Striker offer.  
STATUS: NEW  

---

ACTION_ID: MIMA-2026-09-21-004  
SOURCE_AUTOMATION: Mechanic Interaction Matrix Auditor  
TITLE: Summon-control still paints player-spell range from the wolf after execute was locked to the player tile  
CATEGORY: summons + range + LoS + player feedback  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: #326 / `attackNearestLiveCasterPos` (`targeting.ts` 757–761) **discards** `_activeCasterPos` and always returns the player tile. `executeCastAttempt` and Attack Nearest / HUD `canAttackNearestAgainstLive` use that helper (`WorldExploration.tsx` 17114–17117, 17276–17278, 18883–18885). Tests lock Strike-from-summon-adjacent to null at player origin (`targeting.test.ts` 431–504). Preview did not move: `getSpellRangeTiles` and `probeLiveCast` still origin at `getActiveCasterPos()` (7141–7176), which is the controlled summon (6998–7011). Canvas clicks while controlling a summon return early into kit/walk (10035+), so the blue ring is unused for execute — but it still paints Strike/heal around the wolf while Attack Nearest resolves from the player (no-target flash or a different hostile). Deterministic leftover of a half-applied origin fix.  
EXPECTED_INTERACTION: Player spells share one caster tile for highlight, live probe, Attack Nearest, and `resolvePlayerCast`. Summon **kit** previews stay on the summon.  
ACTUAL_INTERACTION: Kit path is consistent; player-spell ring during control lies.  
SYSTEMS_AFFECTED: summons (control), range, LoS, Attack Nearest, player feedback  
RECOMMENDED_ACTION: While a player spell (not kit id) is selected, pass `attackNearestLiveCasterPos(player, getActiveCasterPos())` into `getSpellRangeTiles` / `probeLiveCast`, **or** clear `selectedSpellIdRef` when entering control so the ring cannot show. Do not revert Attack Nearest to the summon tile. Tests: control + Strike selected ⇒ highlight set equals player-origin `computeTargetableTiles`. Do not change RAF.  
AUTONOMY: IMPLEMENT_ONE_ORIGIN_AT_PREVIEW  
DEPENDENCIES: Closed half is #326. Do not reopen summon-tile Strike sniping.  
REGRESSION_RISK: LOW if only player-spell preview moves; MEDIUM if kit range is accidentally forced to the player.  
VALIDATION_REQUIRED: Targeting fixture with `activeControlledSummonId`; playtest control + Attack Nearest vs painted tiles.  
STATUS: NEW  
