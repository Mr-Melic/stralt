# ACTION_IDs — 2026-09-23 Mechanic Interaction Matrix Auditor

Durable ledger for the Report Action Orchestrator.  
SOURCE_AUTOMATION: Mechanic Interaction Matrix Auditor  
HEAD inspected: `0f5363f` (`Merge pull request #332`)  
Gameplay code: not modified.

Do not re-file still-OPEN prior items (`MIMA-2026-08-31-001/002/005/008`, `MIMA-2026-09-01-002/006`, `MIMA-2026-09-02-002/003/004/005/006`, `MIMA-2026-09-21-001/002/003/004`, `MIMA-2026-09-22-001/002/003/004`). Frozen AI / execute, Wisp / Drain `healUsed`, Challenge HUD, Boss Rush feats, and Attack Nearest **origin** stay closed. Do not clone **#327** / **#370**, **#331** / **#373**, **#336**, **#376**, **#379**, **#380**, **#382**, **#386**, **#389**, **#391**, **#410**, **#443**, **#467**.

HEAD is unchanged since the 09-22 matrix. These IDs are modifier-consume joins that run never filed.

---

ACTION_ID: MIMA-2026-09-23-001  
SOURCE_AUTOMATION: Mechanic Interaction Matrix Auditor  
TITLE: Glass Realm and Titans Vigor onDamageDealt miss the primary player-cast HP write and every player-incoming path; bounce hops still get them  
CATEGORY: damage + statuses + challenges + summons + boss phases  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `glass_realm` announces “all damage doubled, dealt and taken” and `titans_vigor` rolls 1–5× via `onDamageDealt` (`mapModifiers.ts` 337–347 / 311–315). The only live caller is `enemyTakesDamage` (`WorldExploration.tsx` 3499–3516). The official player-cast funnel is `resolvePlayerCast` → `applyDamageToEnemy` (`castHelpers.ts` 405–428): `enemyNewHp = enemyPrevHp - finalDmg` then `commitEnemyHp` — **no** `applyDamageDealt`. Chain-Lightning **bounce** in the same helper *does* call `enemyTakesDamage` (448–455), so on Glass Realm the first hit is 1× and the bounce is 2× (and bounce also re-applies RES). Sacrifice / summon-kit `dealDamage` also uses `enemyTakesDamage` (WX 9171–9183). Player-incoming is the other half of “taken”: `playerTakesDamage` (3424–3468) never calls the registry; enemy melee writes `setCharacterStats` directly (16763–16766) after a local RES/shield; `mirrorFieldReflect` subtracts `preCritDmgBM` with no RES, no shield, no death helper (9538–9560); boss `damageToPlayer` has shield but no RES and no `playerTakesDamage` (16025–16039); `applyDamageToPlayer` is a raw HP subtract (9518–9522). Untouchable / under-N-damage therefore see 1× incoming on a map that announced 2×, while a bounce can kill what the primary hit could not. Distinct from MIMA-2026-09-21-001 (Vampiric stub on the *attacker* object inside `enemyTakesDamage` — do not re-file). Distinct from 09-22-002 (kit range).  
EXPECTED_INTERACTION: Every HP debit that combat and challenges read goes through one landing helper that runs `applyDamageDealt` once, then RES/shield, then the store. Primary hit, bounce, melee, reflect, and boss contact use that helper. Preview and log match.  
ACTUAL_INTERACTION: `onDamageDealt` is a side door on `enemyTakesDamage` only. Glass/Titans are bounce-and-summon-only outgoing and never incoming.  
SYSTEMS_AFFECTED: damage, map modifiers (Glass Realm, Titans Vigor, Vampiric on bounce only), challenges (Untouchable / under-50), summons (kit `dealDamage`), boss contact damage, player feedback  
RECOMMENDED_ACTION: Extract `applyHazard`-style `commitDamageToCombatant` used by `applyDamageToEnemy`, `playerTakesDamage`, melee, reflect, and boss `damageToPlayer`. Call `applyDamageDealt` **once** before RES. Do not also wrap bounce if the primary already did. Tests: Glass Realm Strike vs a 40 HP rat = 2× the control fixture; bounce equals half of that 2× hit, not 2× of a 1× hit; melee on Glass Realm doubles the control melee. Do not change Glass’s 2× formula or RAF.  
AUTONOMY: IMPLEMENT_HELPER_THEN_WX_FUNNELS  
DEPENDENCIES: Distinct from 09-21-001 (player turn-start / Vampiric stub). After this lands, Vampiric incoming lifesteal can reuse the same helper — do not fold the stub fix into this PR.  
REGRESSION_RISK: MEDIUM — Glass fights become deadlier both ways; bounce must not double-apply.  
VALIDATION_REQUIRED: Cast-helper fixture with `glass_realm` active; playtest Strike + Chain Lightning bounce vs melee.  
STATUS: NEW  

---

ACTION_ID: MIMA-2026-09-23-002  
SOURCE_AUTOMATION: Mechanic Interaction Matrix Auditor  
TITLE: Doka Fever never raises enemy HP (isEnemy/side missing) and Titans Vigor’s +1000 is clobbered on the AI/HUD hpMap  
CATEGORY: hazards + rewards + persistence + statuses + AI pathfinding  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `doka_fever` announces “enemies +25% HP, Doka rewards doubled” (`mapModifiers.ts` 471–488). Rewards work: `applyRewardMultiplier` at WX 12420–12427, then `clampApplyRewardsDeltas`. HP does not: `onBattleStart` gates on `c.isEnemy ?? c.side === "enemy"`. `Enemy` (`gameTypes.ts` 269–324) has optional `side` and **no** `isEnemy`; overworld hostiles are synced without `side`, so the predicate is `undefined ?? false`. `titans_vigor` has no such gate and mutates `combatantsRef` in place (`mapModifiers.ts` 305–309). Battle start builds `hpMap` from `calcEnemyMaxHp` / boss base **before** the hook (WX 11991–11998), then `applyBattleStart(combatantsRef.current)` (12076–12079), then `setEnemyHpMap(hpMap)` (12081) — the pre-hook snapshot. AI construction reads `enemyHpMap[e.id] ?? e.hp` (16277–16288) for live HP and `e.maxHp` for the max, so hazard avoid / skip-dead use 100 HP against a store row of 1100. `applyDamageToEnemy` prefers `hitTarget.hp` (store), so the first player hit can use Titans HP while the AI still thinks the unit is at the unbuffed map value. Distinct from 09-21-001 (player is absent from `combatantsRef` — this is enemy-row consume). Distinct from 09-02-003 (GameKey).  
EXPECTED_INTERACTION: After battle start, store HP, `enemyHpMap`, turn-order HP, and AI `hp`/`maxHp` are one number. Doka Fever’s +25% applies to every hostile (`side !== "player"` or `!isSummon` default-enemy). Titans +1000 is visible on the bar and in AI math. Rewards stay 2× and still clamp.  
ACTUAL_INTERACTION: Doka Fever is a reward-only modifier. Titans inflates the store then the HUD/AI snapshot overwrites it.  
SYSTEMS_AFFECTED: map modifiers (Doka Fever, Titans Vigor), enemy HP, AI pathfinding / hazard avoid, recap Doka (already 2×), player feedback  
RECOMMENDED_ACTION: Treat missing `side` as enemy (same default as `isActiveHostile`). Rebuild `hpMap` / turn-order HP from `combatantsRef` **after** `applyBattleStart`. Tests: Doka Fever rat `maxHp === floor(base * 1.25)` on store **and** `enemyHpMap`; Titans AI `hp === base + 1000`. Do not change `DOKA_FEVER_REWARD_MULT` or the applyRewards clamp.  
AUTONOMY: IMPLEMENT_ONE_PREDICATE_AND_SNAPSHOT_ORDER  
DEPENDENCIES: None. Do not fold 09-21-001 player ticks into this PR.  
REGRESSION_RISK: MEDIUM — Fever fights get tankier; Titans +1000 must not persist into overworld `saveBattleStats`.  
VALIDATION_REQUIRED: Battle-start fixture with each modifier; playtest Fever rat HP bar vs recap 2× Doka.  
STATUS: NEW  

---

ACTION_ID: MIMA-2026-09-23-003  
SOURCE_AUTOMATION: Mechanic Interaction Matrix Auditor  
TITLE: Arcane Overflow’s 10% fizzle never runs on damage, heal, or summon casts — only on buff/debuff status apply  
CATEGORY: AP + statuses + spell discovery + player feedback  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Announce is “AP cheaper, but spells fizzle 10% more” (`mapModifiers.ts` 319–332). `onApCost` is live (`playerCastPlan` / WX `applyApCost` 17129–17130). `onEffectApplication` rolls `ARCANE_OVERFLOW_FAIL_CHANCE` for every non-dot type. The **only** caller is `applyActiveEffect` (`WorldExploration.tsx` 1874–1882), which passes `effect.type` (`buff` / `debuff` / `dot`). `resolvePlayerCast` has its own fail-chance (`spellFailChance`) and never calls `applyEffectApplication`. Strike, Blood Mend, Drain, Barrier, Summon, Timestep, and Sacrifice therefore get the AP discount with no extra fizzle. A Shield / Rallying Cry *status* can fizzle after AP was spent. Distinct from Null Field (same hook, suppress buff/debuff — that half is intended). Distinct from Paper Windstorm miss (PXA).  
EXPECTED_INTERACTION: The announced 10% is on the same path as AP debit (`resolvePlayerCast` / enemy kit), **or** the announce only claims cheaper AP. Status-only fizzle must be named as status fizzle.  
ACTUAL_INTERACTION: AP −1 is real; “spells fizzle 10% more” is a status-apply roll players cannot map to the cast button.  
SYSTEMS_AFFECTED: Arcane Overflow, AP, statuses, player feedback, enemy/player casts  
RECOMMENDED_ACTION: Call `applyEffectApplication("damage"|"heal"|"summon"|…)` from `resolvePlayerCast` *before* HP writes and return `"fizzled"`, **or** drop the fizzle clause from the announce. Do not stack with `spellFailChance` unless the extra 10% is on top of that curve and tested. Tests: 1000 seeded casts with overflow active; fizzle count on Strike is ~10% XOR copy no longer says fizzle. Do not change the AP −1 min-1 formula.  
AUTONOMY: IMPLEMENT_ONE_CAST_GATE_OR_COPY  
DEPENDENCIES: None. Do not fold Null Field.  
REGRESSION_RISK: MEDIUM if damage casts start fizzling; LOW if copy-only.  
VALIDATION_REQUIRED: Seeded `resolvePlayerCast` fixture; playtest Overflow Strike vs Shield.  
STATUS: NEW  

---

ACTION_ID: MIMA-2026-09-23-004  
SOURCE_AUTOMATION: Mechanic Interaction Matrix Auditor  
TITLE: Iron Curse announces healing halved and never multiplies any heal site; player RES is also skipped  
CATEGORY: healing + statuses + challenges + player feedback  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Announce “+30% RES, healing halved” (`mapModifiers.ts` 379–394). `onBattleStart` multiplies `c.res` on `combatantsRef` only — the player is not in that array (`playerTurnStartModifierTarget` / 09-21-001). `onEffectApplication` for `"heal"` logs “Iron Curse halves healing” and **returns true**; the comment says “the WX heal site reads the active-id set to apply the 0.5 multiplier.” `MAP_MODIFIER_IRON_CURSE_HEALING_MULTIPLIER` (`gameConstants.ts` 350) has **zero** consumers outside that constant. Player `heal` (WX 9185–9206), Drain `onPlayerHealed` (`castHelpers.ts` 473–487), potions, Wisp `ctx.heal`, and boss Dawn (still 09-02-006) never multiply. `no_healing` still flips `healUsed` on a full restore, so easy_1 fails for a heal that the curse promised to cut. Distinct from 09-01-005 / Drain `healUsed` (those flags are closed). Distinct from 09-21-001 (turn-start Mist/Void — do not re-file). Distinct from 002 (Fever/Titans HP snapshot).  
EXPECTED_INTERACTION: Every in-battle HP restore is ×0.5 while Iron Curse is active, and `healUsed` still tracks a positive restore. Player RES either rises 30% or the announce says “enemy RES”.  
ACTUAL_INTERACTION: Full heals; player RES unchanged; enemy RES may stick on the store if 002’s snapshot does not also drop it.  
SYSTEMS_AFFECTED: Iron Curse, healing, challenges (no_healing still honest on *whether* you healed, not *how much*), player feedback  
RECOMMENDED_ACTION: One `scaleHeal(amount)` used by player `heal`, Drain, potions, Wisp, and any later Mist commit. Apply player RES the same way as 09-21-001’s player row **or** tighten the announce to enemies. Tests: Blood Mend 12 → 6 HP; Drain restore ×0.5; `healUsed` true. Do not change potion inventory consume.  
AUTONOMY: IMPLEMENT_ONE_HEAL_SCALE  
DEPENDENCIES: Reuse `recordChallengeHealFromHpRestore`. Do not fold 09-21-001 Void/Mist ticks.  
REGRESSION_RISK: LOW if only the ×0.5 lands on in-battle heals.  
VALIDATION_REQUIRED: Heal-site fixture; playtest Iron Curse Blood Mend vs easy_1.  
STATUS: NEW  
