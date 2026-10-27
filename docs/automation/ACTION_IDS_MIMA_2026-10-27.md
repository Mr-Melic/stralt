# ACTION_IDs — 2026-10-27 Mechanic Interaction Matrix Auditor

Durable ledger for the Report Action Orchestrator.  
SOURCE_AUTOMATION: Mechanic Interaction Matrix Auditor  
HEAD inspected: `0f5363f` (`Merge pull request #332`)  
Gameplay code: not modified.

Do not re-file OPEN 08-31 / 09-01 / 09-02 / 09-21…09-29 / 10-21 / 10-22 / 10-23 / 10-24 / 10-25 / 10-26 items or this file's 001–005. Do not clone **#1131** (10-26 HP phase-2 / SPELL_MIRROR buffer / BOARD_CLAIM AP / Twin absorb), **#1062**, **#1012**, **#1035**, **#1040**, **#1042**, **#852**, **#858**, **#965**, **#1058**, **#1094**, **#1152** (Phantom spawn HP stamp 20), **#948**, **09-22-001**, **09-22-004**, or **09-02-004**. Do not invent Gravity Well / Fog of War, push/pull unwired, or a watch-enemy-cast unlock path.

---

ACTION_ID: MIMA-2026-10-27-001  
SOURCE_AUTOMATION: Mechanic Interaction Matrix Auditor  
TITLE: Boss WX consume ignores `type: "move"` / `"attack"` `targetX`/`targetY` and melee HP; only `abilityResult.newBossPosition` / `damageToPlayer` apply  
CATEGORY: boss phases + teleport + AP + damage + player feedback  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: The boss branch “skip[s] the regular AI pipeline entirely” (`WorldExploration.tsx` 15756–15758). After the kit-spell short-circuit, consume always reads `abilityResult` (16013–16025): position is `res?.newBossPosition ?? enemy.x/y`; HP only if `damageToPlayer > 0`. There is **zero** `bossAIAction.type === "move"` or `"attack"` branch and **zero** `targetX`/`targetY` writes on this path (the only `targetX` read is the kit-spell dest at 15823). `moveToward` (`useBossAI.ts` 90–106) returns `{ type: "move", targetX, targetY }` with no `abilityResult`. `attackPlayer` (108–119) returns `{ type: "attack", …, logMessage }` with no damage field. Hybrid moves that attach a trail to `moveToward` also omit `newBossPosition`: Countess LAVA_TRAIL (262–277) and Lord of Static SHOCK_TILES (889–903) set `targetX/Y` plus a trail result at **current** `boss.x/y`. TELEPORT_ADJACENT / KNIGHT_JUMP / ADVANCE_PER_TURN still relocate because those results carry `newBossPosition`. Final Pawn invincible `type: "skip"` with `abilityResult.newBossState` still ticks (977–989) — skip+result works; move/attack without `newBossPosition` do not. Kit-first `new Map()` (09-22-001) currently starves the fallthrough; once cooldowns are real, every adjacent `attackPlayer` logs “attacks!” for 0 HP and every `moveToward` statue-walks. Distinct from **09-22-004** / **#858** (dropped *result* `newPositions` on MAP_ROTATE), which is a different field. No boss-move consume fixture.  
EXPECTED_INTERACTION: `type: "move"` commits `targetX/Y` (and still applies trail hazards); `type: "attack"` deals advertised melee through `playerTakesDamage` (challenge + RES + shield). Trail hybrids both step and paint the vacated tile.  
ACTUAL_INTERACTION: Logs fire; the boss stays on the old cell; melee is 0 HP. LAVA_TRAIL / SHOCK_TILES paint under the boss’s feet and never vacate.  
SYSTEMS_AFFECTED: every boss decide-fn fallthrough, Countess lava, Static shock, player HP/challenges, occupancy  
RECOMMENDED_ACTION: After the spell short-circuit, if `type === "move"` and `targetX/Y` are set, use them when `newBossPosition` is missing (or copy dest into the trail result). If `type === "attack"`, apply `boss.atk` (or catalog melee) via `playerTakesDamage`. Do not change kit-spell dest. Tests: `moveToward` dest ≠ current cell after consume; `attackPlayer` adjacent ⇒ HP drops; Countess lava at *previous* cell and boss on dest. Do not change RAF.  
AUTONOMY: IMPLEMENT_WX_MOVE_ATTACK_CONSUME  
DEPENDENCIES: **09-22-001** for the fallthrough to be reachable in play. Distinct from 09-22-004 / #858. Do not fold MAP_ROTATE `newPositions` into this PR.  
REGRESSION_RISK: HIGH once kit cooldowns exist — bosses start walking and meleeing (intended). Do not also apply regular-enemy Crush fallback on the boss branch.  
VALIDATION_REQUIRED: Unit test on a consume helper (move dest / attack HP / lava vacated tile); playtest Countess after 09-22-001.  
STATUS: NEW  

---

ACTION_ID: MIMA-2026-10-27-002  
SOURCE_AUTOMATION: Mechanic Interaction Matrix Auditor  
TITLE: Alabaster Fortress RESONANCE_SHOCKWAVE never sees player casts (`resonanceCounter` / `resonanceDamageAccumulated` have zero WX writers)  
CATEGORY: boss phases + spells + damage + player feedback  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `applyResonanceShockwave` (`useBossSystem.ts` 853–873) documents “every 5 casts releases 20% of accumulated damage.” The function itself is the only increment of `resonanceCounter`, and it never writes `resonanceDamageAccumulated` (it only reads it, then zeros both on fire). Alabaster AI calls the ability only when `resonanceCounter >= 5` (`useBossAI.ts` 1074–1081) — a gate the increment never reaches because the ability is not called below 5. Repo grep of `resonanceCounter` / `resonanceDamageAccumulated`: types default 0, the apply fn, the AI gate — **no** `WorldExploration.tsx` / `recordPlayerSpellType` / `resolvePlayerCast` write. Pacifist history (`recordPlayerSpellType` 17015) is effectType-only. Guide (`BossGuideModal.tsx` 173–174) tells the player to “move out of the blast radius before it fires.” Kit-first (09-22-001) also starves the ability. Distinct from **10-26-002** / **#1131** (Mirror Sovereign `mirroredSpellBuffer` / extras default power 0): different boss, different fields, different math (5-cast 20% accum vs 90% last spell). No resonance fixture.  
EXPECTED_INTERACTION: Each player damaging spell this fight increments the counter and adds the dealt HP to the accumulator; on the 5th, the Fortress fires `floor(accum * 0.2)` (then Shield Charm / RES per 10-22-004 if that path is used).  
ACTUAL_INTERACTION: Counter stays 0, accum stays 0, the AI never selects the shockwave; if forced, damage is 0. The player can dump Inferno with no resonance.  
SYSTEMS_AFFECTED: Alabaster Fortress, player casts, Pacifist history (parallel, unused here), boss ability HP  
RECOMMENDED_ACTION: On successful `resolvePlayerCast` HP commit against Alabaster, add `{ resonanceCounter+1, resonanceDamageAccumulated+finalDmg }`. AI should fire when counter >= 5 **or** call the apply fn every boss turn and drop the `>= 5` gate (the apply fn already no-ops below 5). Tests: five Strike hits then AI shockwave ⇒ 20% of summed HP; a sixth fight with no casts ⇒ no shock. Do not reuse the Mirror buffer.  
AUTONOMY: IMPLEMENT_PLAYER_CAST_RESONANCE_THEN_AI_GATE  
DEPENDENCIES: **09-22-001** so the ability can be chosen; **10-26-001** is unrelated (Alabaster phase-2 BOARD_SHRINK). Distinct from 10-26-002 / #1131.  
REGRESSION_RISK: MEDIUM — Fortress becomes dangerous to spell-dump kits (intended). Do not accumulate summon-kit or DoT ticks unless product says so.  
VALIDATION_REQUIRED: Buffer helper unit test; playtest five casts then wait the boss turn.  
STATUS: NEW  

---

ACTION_ID: MIMA-2026-10-27-003  
SOURCE_AUTOMATION: Mechanic Interaction Matrix Auditor  
TITLE: Broodmother LARVAE_EXPLODE is never invoked on walk, destack, Swap, or summon step despite AI comment, guide, and persisted `bossState.larvae` coords  
CATEGORY: hazards + walk + summons + teleport + statuses  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `applyLarvaeExplode` (`useBossSystem.ts` 693–707) is documented “Called when the player steps on a larva tile” and returns a 5×3 poison DoT. The **only** runtime call is the dispatcher case (1607–1608). `useBossAI.ts` never `applyBossAbility(LARVAE_EXPLODE, …)`; phase-2 comment 795 says explode-on-contact is “handled on player movement side.” WX walk / destack / Swap / summon-AI landing greps of `larvae` / `LARVAE_EXPLODE` are empty (`illusionsRef` is the only nearby leftover). `applyLarvaeSpawn` does persist coords via `newBossState.larvae` (669), which WX **does** merge (16078–16086), so the tiles exist on `bossState` even when `newLarvae` is dropped (**09-22-004**). Player lava/spikes/ice landing still has no larva branch. Guide (`BossGuideModal.tsx` 159–164) and admin chrome tell the player to kill larvae at range before they explode. Distinct from **09-22-004** (dropped `newLarvae` *combatant* placement) because explode-on-step is a separate consume of the persisted coords. Distinct from **10-25-005** (INK_VEIL glyphs → GLYPH_TRAP 15). No larva-step fixture.  
EXPECTED_INTERACTION: Stepping onto a live `bossState.larvae` cell (player walk, destack, Swap, controlled summon, enemy-summon AI) runs LARVAE_EXPLODE: 5×3 DoT, challenge HP via `playerTakesDamage` if the stepper is the player, larva removed from state. Walking around them is safe.  
ACTUAL_INTERACTION: Larva coords can sit on the board in `bossState` (and Shell Armor can latch — `castHelpers.ts` 347–360) while every stepper treats the cell as ordinary floor. The explode log never prints.  
SYSTEMS_AFFECTED: Broodmother Rook, player/summon walk, Swap, destack, DoT, challenges, Shell Armor condition  
RECOMMENDED_ACTION: In the shared landing helper (08-31-001 / 09-02-002), if `bossState.larvae` contains the dest, call `applyLarvaeExplode`, apply `dotApplied`, drop that larva. Tests: player step on (4,4) larva ⇒ DoT 5×3 and larva gone; adjacent floor ⇒ no DoT. Do not spawn extra combatants unless product wants clickable larvae (09-22-004).  
AUTONOMY: IMPLEMENT_LARVA_TILE_ON_LANDING  
DEPENDENCIES: **09-22-001** for spawn to be chosen; **09-22-004** if larvae should also be combatants. Distinct from 10-25-005 / #1094 glyph/anchor step. Reuse the 08-31-001 landing helper — do not grow a third WX lava block.  
REGRESSION_RISK: MEDIUM — Broodmother maps become actually poisonous on those cells; destack onto a larva (09-02-002) must not skip the explode.  
VALIDATION_REQUIRED: Landing helper fixture; playtest walk onto a spawned larva after 09-22-001.  
STATUS: NEW  

---

ACTION_ID: MIMA-2026-10-27-004  
SOURCE_AUTOMATION: Mechanic Interaction Matrix Auditor  
TITLE: Pale Archbishop REFLECT_SHIELD sets `reflectShieldTurnsLeft: 3` but nothing ever decrements it, so 30% reflect never expires  
CATEGORY: boss phases + damage + statuses + player feedback  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `applyReflectShield` (`useBossSystem.ts` 208–217) writes `reflectShieldActive: true` and `reflectShieldTurnsLeft: 3` with log “30% of damage will be reflected for 3 turns.” Archbishop AI turns it on once in phase 2 (`useBossAI.ts` 185–192) and never re-enters because `!reflectShieldActive`. Repo grep of `reflectShieldTurnsLeft`: type default, the apply write — **zero** decrement in WX, AI, or `processActiveEffects`. `castHelpers.ts` 362–376 **does** honor `reflectShieldActive` on the player→boss damage loop (30% back via `onPlayerReflectedDamage`, which records challenge at WX 9496–9500). Guide (`BossGuideModal.tsx` 123–124) says “wait for the shield to expire.” Final Pawn *does* decrement `invincibleTurnsLeft` on `type: "skip"` (977–982) — the duration pattern exists and was not copied. Distinct from **09-29-003** (Shield Charm vs Reflect Shield *raw HP* / Void Mirror family), **10-25-004** (INVINCIBLE_PHASE flag never gates incoming HP), and **10-25-001** / **#852** (player/boss-kit Mirror *token*). Starved by 09-22-001 + 10-26-001 until phase 2 exists. No turnsLeft tick fixture.  
EXPECTED_INTERACTION: After 3 Archbishop turns (or 3 player hits — pick one and document it), `reflectShieldActive` clears and incoming spells stop reflecting.  
ACTUAL_INTERACTION: First successful REFLECT_SHIELD is permanent 30% reflect for the rest of the fight. Waiting does not expire it.  
SYSTEMS_AFFECTED: Pale Archbishop, player spell HP, challenge damage, Shield Charm (09-29-003 still applies *while* the flag is on)  
RECOMMENDED_ACTION: On each Archbishop turn start (or each reflected hit), decrement `reflectShieldTurnsLeft`; at 0, set `reflectShieldActive: false`. Tests: three boss turns after activate ⇒ flag false and a fourth Strike does not reflect; turn 1 still reflects 30%. Do not change the 30% formula.  
AUTONOMY: IMPLEMENT_REFLECT_TURNSLEFT_TICK  
DEPENDENCIES: **09-22-001** + **10-26-001** for phase 2. Distinct from 09-29-003 / 10-25-004 / #852. Do not tick INVINCIBLE_PHASE here (already decremented; incoming gate is 10-25-004).  
REGRESSION_RISK: LOW–MEDIUM — fights that currently reflect forever become 3-turn windows (intended).  
VALIDATION_REQUIRED: Tick helper unit test; playtest Archbishop phase 2 after 001.  
STATUS: NEW  

---

ACTION_ID: MIMA-2026-10-27-005  
SOURCE_AUTOMATION: Mechanic Interaction Matrix Auditor  
TITLE: Fetid Rook SPLIT_ROOKS leaves the original alive, stamps two extra minions, and never revives on a sibling death  
CATEGORY: boss phases + death + summons + victory + player feedback  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `applySplitRooks` (`useBossSystem.ts` 502–549) returns **additional** `spawns` (half-HP rook minions) and `splitRooksSpawned: true`; it does not despawn or HP-split the original, and it does not register a death callback. The ability log (546–548) says “splits into two rooks! Defeat both simultaneously or one revives the other.” Guide (`BossGuideModal.tsx` 147–148) says “splits into two independent rooks. Focus one down before the other.” AI fires once in phase 2 (`useBossAI.ts` 604–611). `splitRooksSpawned` has **zero** readers outside that spawn gate (types + apply + AI). `deathPipeline.ts` has no split/revive hook (same class of miss as Twin MONARCH_ABSORB, different consumer). WX `res.spawns` *does* addCombatant (16104–16184) then `enemyHpMap[id] = 20` (16185–16188) — spawn HP stamp is **#1152**, do not clone. Distinct from **10-26-004** / **#1131** (Twin death → absorb): Fetid is one body that should become two, not a surviving twin absorbing a name. Distinct from 09-22-004 `damageToTargets`. No split-death fixture.  
EXPECTED_INTERACTION: On split, the original is replaced by exactly two live rooks (or the original *is* one of the two). Killing one while the other lives revives the fallen **or** the log/guide drop the revive claim. Victory requires both. A leftover player-summon death does not revive.  
ACTUAL_INTERACTION: The board can hold original + two minions (three Fetid-side rooks). Killing a minion is a normal death; nothing revives. Killing the original can end the fight while the split copies still act, or the copies become leftover hostiles after “boss” death — pick-and-test. The revive sentence is a lie.  
SYSTEMS_AFFECTED: Fetid Rook, death pipeline, minion spawns, victory leftover, player feedback  
RECOMMENDED_ACTION: On split, either convert the original into rook A and spawn rook B, or hide the original until both minions die. In `processCombatantDeath`, if a split-rook minion dies and its sibling is live, respawn the fallen at half HP **or** delete the revive sentence from log + guide. Tests: after split, live Fetid-side count is 2; kill minion A, sibling live ⇒ A returns or the copy is explicit; do not revive on wolf death. Do not change spawn HP stamp (#1152).  
AUTONOMY: IMPLEMENT_SPLIT_REPLACE_PLUS_DEATH_HOOK_OR_COPY  
DEPENDENCIES: **09-22-001** + **10-26-001** for phase 2. Distinct from 10-26-004 Twin absorb. Do not clone #1152.  
REGRESSION_RISK: MEDIUM — Fetid fights change body count (intended). A leftover-summon false revive would be a serious miss — gate on `isBossMinion` + `parentBossId`.  
VALIDATION_REQUIRED: Death-pipeline fixture with two split ids; playtest split then kill-one vs kill-original.  
STATUS: NEW  
