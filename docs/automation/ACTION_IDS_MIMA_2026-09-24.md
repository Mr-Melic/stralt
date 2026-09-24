# ACTION_IDs — 2026-09-24 Mechanic Interaction Matrix Auditor

Durable ledger for the Report Action Orchestrator.  
SOURCE_AUTOMATION: Mechanic Interaction Matrix Auditor  
HEAD inspected: `0f5363f` (`Merge pull request #332`)  
Gameplay code: not modified.

Do not re-file still-OPEN prior items (`MIMA-2026-08-31-001/002/005/008`, `MIMA-2026-09-01-002/006`, `MIMA-2026-09-02-002/003/004/005/006`, `MIMA-2026-09-21-001/002/003/004`, `MIMA-2026-09-22-001/002/003/004`, `MIMA-2026-09-23-001/002/003/004`). Frozen AI / execute, Wisp / Drain `healUsed`, Challenge HUD, Boss Rush feats, and Attack Nearest **origin** stay closed. Do not clone **#327** / **#370**, **#331** / **#373**, **#336**, **#376**, **#379**, **#380**, **#382**, **#386**, **#389**, **#391**, **#410**, **#443**, **#467**, **#476**, **#487**, **#489**, **#491**, **#495**, **#496**, **#498**, **#508**.

HEAD is unchanged since the 09-23 matrix. These IDs are consume joins that run never filed: turn-start hooks other than Void/Plague, Null Field × terrain statuses, boss relocators × hazards, Fever × non-kill Doka.

---

ACTION_ID: MIMA-2026-09-24-001  
SOURCE_AUTOMATION: Mechanic Interaction Matrix Auditor  
TITLE: Mending Mist and Swift Winds mutate the turn-order copy only; Void Rift / Plague Zone already commit the same hook to the store  
CATEGORY: healing + AP/MP + statuses + summons + player feedback  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `mending_mist` announces “5% max HP regen each turn” and writes `combatant.hp += floor(maxHp * 0.05)` in `onTurnStart` (`mapModifiers.ts` 350–365). `swift_winds` announces “+2 MP each turn” and writes `combatant.mp` (368–376). Every turn route already calls `mapModifierRegistry.applyTurnStart(nextCombatant, …)` — player-side summon (`WorldExploration.tsx` 14440–14447), enemy summon (14536–14543), enemy AI (14635–14642). `nextCombatant` is a `CombatantEntry` from `toCombatantEntry` (`combatantStore.ts` 141–168), a **new object** with `hp`/`maxHp` and **no** `mp`. The same three blocks then special-case Plague Zone and Void Rift with `enemyHpAfterHazardDamage` + `setEnemyHpMap` + `updateCombatant` (14449–14501, 14545–14596, 14644–14696) because, quote, “applyTurnStart only mutates the turn-order entry.” Mist and Winds have no such commit. InitiativeStrip paints `combatant.hp / maxHp` from that copy (269 / 594), so a Mist tick can show regen on the strip while the sprite/`enemyHpMap`/AI `hp` stay flat; Winds cannot even paint. Zero tests mention `mending_mist` or `swift_winds`. Distinct from MIMA-2026-09-21-001 (player is absent from `combatantsRef` — do not re-file). Distinct from 09-23-002 (battle-start HP snapshot). If 09-21-001 later copies player `applyTurnStart` into `setCharacterStats`, Swift Winds +2 is still wiped by the formula restore at 14357–14365 (same class as 09-22-003 Dawn AP) and Mist regen would need `recordInBattleChallengeHealUsed`.  
EXPECTED_INTERACTION: Every `onTurnStart` HP/MP write that Void/Plague already honour on the store is committed once for Mist/Winds too. Strip, bar, AI budget, and lethal checks are one number. Player Swift Winds, if wired, must apply **after** formula restore (or as an active-effect MP mod).  
ACTUAL_INTERACTION: Void/Plague are real. Mist/Winds are a strip-only (or fully silent) mutation of a throwaway row.  
SYSTEMS_AFFECTED: map modifiers (Mending Mist, Swift Winds), summons, enemy AI MP, initiative HUD, healing, challenges (no_healing if player Mist is later committed)  
RECOMMENDED_ACTION: After `applyTurnStart`, if Mist/Winds are active, `updateCombatant` with the new store HP/MP (same shape as the Void/Plague blocks). Do not also keep the copy mutation as the source of truth. Player wire stays 09-21-001 + restore-order. Tests: Mist rat `hp` after its turn-start equals `hp + floor(maxHp * 0.05)` on store **and** `enemyHpMap`; Winds archer `currentMp` is +2 for the AI spend. Do not change Void/Plague tick numbers.  
AUTONOMY: IMPLEMENT_HELPER_THEN_THREE_TURN_ROUTES  
DEPENDENCIES: Reuse the Void/Plague `updateCombatant` pattern. Do not fold 09-21-001 player ticks into this PR (inline Plague 2 + registry 1 would triple if both land). Distinct from 09-23-004 Iron Curse heal scale.  
REGRESSION_RISK: MEDIUM — Mist fights last longer; do not double-apply if `applyTurnStart` later mutates the store object in place.  
VALIDATION_REQUIRED: Turn-start fixture with each modifier on a summon and a rat; playtest Mist hunter HP bar vs strip.  
STATUS: NEW  

---

ACTION_ID: MIMA-2026-09-24-002  
SOURCE_AUTOMATION: Mechanic Interaction Matrix Auditor  
TITLE: Null Field suppresses ice Frozen (debuff) after the Slowed log, but lava Burning (dot) still applies  
CATEGORY: statuses + hazards + terrain + LoS/pathing + player feedback  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Null Field announces “buffs and debuffs are suppressed” and vetoes `effectType === "buff" || "debuff"` (`mapModifiers.ts` 419–432). `applyActiveEffect` (`WorldExploration.tsx` 1874–1886) calls `applyEffectApplication` only when `effect.type !== "dot"`. Player ice landing logs “You stepped on ice! Slowed!” then applies Frozen as `type: "debuff"`, `stat: "mp"`, `modifier: -2` (11454–11467). Lava landing applies Burning as `type: "dot"` (11443–11453), which skips the veto. Enemy ice/lava use the same types (16903–16918). Ice −2 MP is how Frozen Terrain 2× walk cost is supposed to compound through restore + `battleWalkMpCost` (09-23 non-finding). On Null Field that compound never starts, but the Slowed line still prints. Distinct from 09-23-003 (Overflow fizzle on the same hook — status-apply only). Distinct from 08-31-001 (Swap never applies ice at all).  
EXPECTED_INTERACTION: Either terrain statuses are exempt from Null Field (ice Frozen lands; drop “all debuffs”) **or** Null Field strips ice Frozen **and** the Slowed log, with copy that names terrain. Lava DoT policy must be explicit either way.  
ACTUAL_INTERACTION: Ice is a free tile with a lying Slowed line. Lava still burns. Players cannot map the announce to the two hazard types.  
SYSTEMS_AFFECTED: Null Field, ice, lava, Frozen MP restore, challenges (Untouchable still sees lava HP; ice MP is the silent half)  
RECOMMENDED_ACTION: If terrain is exempt: pass a source (`"hazard"`) into `applyEffectApplication` and let Null Field ignore it; remove the Slowed log when the apply is vetoed. If Null Field owns terrain: skip the Slowed log on veto; decide whether lava Burning should also suppress (today it cannot). Tests: Null Field ice step ⇒ no Frozen effect **xor** Frozen present; lava step still applies Burning unless copy changes. Do not change lava 8–15 / ice −2 numbers.  
AUTONOMY: IMPLEMENT_ONE_APPLY_GATE_OR_COPY  
DEPENDENCIES: None. Do not fold Iron Curse heal (09-23-004) or Overflow fizzle (09-23-003).  
REGRESSION_RISK: LOW if only the ice log is gated on the apply result.  
VALIDATION_REQUIRED: `applyActiveEffect` fixture with `null_field` + ice vs lava; playtest Null Field ice walk leftover MP.  
STATUS: NEW  

---

ACTION_ID: MIMA-2026-09-24-003  
SOURCE_AUTOMATION: Mechanic Interaction Matrix Auditor  
TITLE: Boss TELEPORT_ADJACENT and KNIGHT_JUMP write a new cell with no lava/spike/ice landing (walk already pays)  
CATEGORY: boss phases + teleport + hazards + death + challenges  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: `applyTeleportAdjacent` (`useBossSystem.ts` 275–298) picks `randomFrom(getAdjacentTiles(player))`. `getAdjacentTiles` (33–56) is bounds + `allTiles` walkable + not occupied — **no** `hazardTiles`. `applyKnightJumpIgnoreWalls` (338–364) similarly picks the closest knight cell. WX consumes `newBossPosition` as `updateCombatant(..., { x, y })` only (16021–16023, 16199–16229). Enemy **walk** landing still pays lava 8–15 + Burning / ice Frozen / spikes 5–10 with store HP (`WorldExploration.tsx` 16884–16918). A teleport onto lava is 0 HP until the boss later **steps**. Untouchable / under-N-damage can eat a phase-1 teleport that a walk would fail. Distinct from 09-02-002 (battle-start destack / unseal / `findNearestFreeCell` — summon spawn is another call site of that ID, not this). Distinct from 09-22-004 (WX **drops** `newPositions` / larvae; teleport **is** consumed). Distinct from 08-31-001 (Swap).  
EXPECTED_INTERACTION: Relocators prefer a non-hazard adjacent/jump cell; if they must land on lava/spikes/ice, the same enemy-walk landing helper runs (challenge HP if the player is the one swapped — not this path).  
ACTUAL_INTERACTION: Ability dest is any walkable neighbor/jump; hazards are ordinary floor.  
SYSTEMS_AFFECTED: boss phases, teleport, hazards, statuses (Burning / Frozen), challenges  
RECOMMENDED_ACTION: Filter `getAdjacentTiles` / knight moves with optional `avoid` for lava/spikes/ice (and live rift). After a forced land, call the shared `applyHazardLanding` from 08-31-001. Tests: player standing with lava on three sides ⇒ teleport uses the floor neighbor; if all four are lava, HP drops in band + Burning. Do not change RAF or knight-move geometry.  
AUTONOMY: IMPLEMENT_HELPER_THEN_BOSS_DEST  
DEPENDENCIES: MIMA-2026-08-31-001 / 09-02-002 if landing is extracted once. Do not grow a third lava block in WX. Do not clone 09-22-004 consume of larvae.  
REGRESSION_RISK: MEDIUM — over-avoiding can make TELEPORT_ADJACENT always “blocked”; fallback must still pick a unique floor.  
VALIDATION_REQUIRED: Ability fixture with lava-adjacent player; playtest Shadow/teleport boss on a lava map.  
STATUS: NEW  

---

ACTION_ID: MIMA-2026-09-24-004  
SOURCE_AUTOMATION: Mechanic Interaction Matrix Auditor  
TITLE: Doka Fever doubles only handleBattleEnd kill Doka; shrine, ground, dungeon-complete, and challenge Doka stay 1× while the modifier is still live  
CATEGORY: rewards + dungeons + portals + challenges + persistence  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: `doka_fever` announces “enemies +25% HP, Doka rewards doubled” (`mapModifiers.ts` 471–488). `onRewardMultiplier` is live. The **only** caller is `handleBattleEnd` on kill Doka (`WorldExploration.tsx` 12420–12427) **before** dungeon-chain / boss / boost multipliers. Challenge Doka is added later as `totalDoka + challengeDokaReward` (12785–12789) with no second multiply. Portal roll writes `activeMapModifierTypes` (6650–6654) and it persists until the next portal, so shrine 300 (`persistDokaCreditResult(..., 300)` 11303–11322), ground pickups (`hit.value` 11368–11385), and dungeon-chain complete bonus (6338–6359) run **with Fever still in the set** and never call `applyRewardMultiplier`. Tests cover `applyRewardMultiplier` in isolation (`mapModifiers.cost.test.ts`) and Fever as a clamp band (`rewardResolver.loss.test.ts`), not these other credits. Distinct from 09-23-002 (Fever **HP** never applies — do not re-file). Distinct from 09-02-003 / **#391** (GameKey × unpaid death). Distinct from **#491** (first recap missing challenge Doka — display only). Do not double GameKey IAP.  
EXPECTED_INTERACTION: While Fever is the active map modifier, every `applyRewards` Doka credit that is a map/fight **reward** (kills, challenges, shrine, ground, dungeon-complete) is 2× and still clamped. Copy that says “kill Doka” is also acceptable.  
ACTUAL_INTERACTION: Kill recap Doka is 2×. Walking a coin or finishing a dungeon on the same Fever map is 1×. Challenge pay is 1× even on the Fever fight.  
SYSTEMS_AFFECTED: Doka Fever, shrine altar, ground Doka, dungeon chain bonus, challenge rewards, persist lock  
RECOMMENDED_ACTION: One `feverDoka(amount, activeIds)` used by `handleBattleEnd` (kills **and** challenge Doka) and the three `persistDokaCreditResult` sites, **or** tighten the announce to “kill Doka doubled.” Keep `clampApplyRewardsDeltas`. Tests: Fever shrine 300 → 600 lock Doka; Fever ground 10 → 20; Fever easy_1 Doka is 2× the catalog amount. Do not change `DOKA_FEVER_REWARD_MULT` or GameKey.  
AUTONOMY: IMPLEMENT_ONE_HELPER_THEN_CREDIT_SITES  
DEPENDENCIES: 09-23-002 is HP snapshot, not this. Do not clone #491 recap list. Honour unpaid death on the doubled credit the same way other one-shots do.  
REGRESSION_RISK: MEDIUM — shrine 600 must still pass the applyRewards 100_000 cap; do not 2× a credit after Fever already rolled off.  
VALIDATION_REQUIRED: Persist helper tests with `doka_fever` in the active set; playtest Fever map coin + recap.  
STATUS: NEW  
