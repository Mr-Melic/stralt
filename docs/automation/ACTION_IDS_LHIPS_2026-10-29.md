# ACTION_IDs — 2026-10-29 Long-Horizon Infinite Progression Simulator

Durable ledger for implementers and the Report Action Orchestrator.  
Source of every record: Long-Horizon Infinite Progression Simulator.  
Narrative: [`LONG_HORIZON_2026-10-29.md`](./LONG_HORIZON_2026-10-29.md).  
Harness: `src/frontend/src/utils/longHorizonSim.ts`.

Do not implement gameplay from this file unless a later human or orchestrator explicitly picks an ID. This run ships **observation only** — no curve redesign.

HEAD inspected: `0f5363f` (same commit `#357` / `#407` / `#475` / `#530` / `#560` / `#637` / `#670` / `#748` / `#777` / `#819` / `#898` / `#960` / `#1016` / `#1077` / `#1141` / `#1197` / `#1250` inspected). Stress includes 10000 / 50000 / 100000. Harness **unions** `#1250` rather than overwriting those files. This branch restacks onto `#1250` so oldest-first merge-tree stays clean.

## Still-open IDs (not re-filed)

All prior LHIPS IDs through `LHIPS-2026-10-28-005` remain NEW. Do not reopen. Queued stack through `#1250` (`#357`…`#1197` + `#1250`).

This file adds IDs only where a long-horizon failure was in-scope and never filed (Blood Mend CHC buff never applied; Iron Curse heal-halved no-op; victory AP/MP floors `/20`/`/10` vs formula `/25`; player-cast Frost/Drain catalog debuffs dropped; Arcane Overflow 10% effect fizzle after spell-fail hits 0; portal +10 vs exponential threshold / death recovery; intended kit zone saturates at 2; map zone label uncapped vs 999 pick).

---

ACTION_ID: LHIPS-2026-10-29-001  
SOURCE_AUTOMATION: Long-Horizon Infinite Progression Simulator  
TITLE: Blood Mend advertises +15% CHC for 2 turns but resolvePlayerCast never applies the buff; catalog buffModifier 0.15 would multiply CHC by 0.15 (−85%) if wired  
CATEGORY: technical-limits  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Catalog `starter-heal` (`spellData.ts` 85–98) sets `buffStat: "chc"`, `buffModifier: 0.15`, `buffDuration: 2`, description “+15% CHC”. Live `resolvePlayerCast` heal branch (`spellEngine.ts` 655–672) heals then `return "cast"` — no `applyEffect`. Shield path (`680–718`) requires `effectType === "buff"`; Blood Mend is `"heal"`. `getStatModifier` multiplies non-AP/MP stats (`statusEffects.ts` 45–62); `formatBattleEffectMagnitude` would show `(0.15-1)=−85%` (`111–118`). Create CHC stays 5 (09-21-002). Harness: `BLOOD_MEND_CHC_BUFF_APPLIED === false`; `bloodMendBuffModifierAsPercentDelta() === -0.85`. Official XP wall (001) still arrives first.  
FIRST_APPROXIMATE_PROBLEM_LEVEL: **1** (buff never lands). Unreachable by official kill income past the mid-teens.  
CAUSE: Heal spells were extracted to an early return that only writes HP. The CHC buff fields were left on the catalog. The 0.15 literal looks like a percentage delta written into a multiplicative slot (shield uses 1.3).  
PLAYER_EFFECT: Blood Mend is heal-only. Crit chance stays create 5% forever. At every horizon the advertised temporary crit buff is flavor. Flat heal 12 vs linear HP remains 09-24-001.  
TECHNICAL_EFFECT: Safe Numbers. Distinct from flat heal magnitude (09-24-001) and from Mist no-op (10-24-001).  
SYSTEMS_AFFECTED: Blood Mend; `resolvePlayerCast` heal branch; CHC; `getStatModifier`  
RECOMMENDED_ACTION: Report only. Do not wire 0.15 as a multiply or retune create CHC here. If a human picks this ID, pick one published rule (drop the buff copy, or apply `1.15` via `applyEffect` after heal) — do not silently change crit economy.  
AUTONOMY: REPORT_ONLY  
DEPENDENCIES: LHIPS-2026-09-24-001 (flat heal); LHIPS-2026-09-21-002 (create CHC 5); LHIPS-2026-08-31-001 (XP wall)  
REGRESSION_RISK: HIGH if `0.15` is applied as multiply without fixing to `1.15`. LOW for documentation.  
VALIDATION_REQUIRED: `BLOOD_MEND_CHC_BUFF_APPLIED === false`; heal branch still returns before `applyEffect`; catalog modifier still 0.15. Re-run `longHorizonSim.test.ts`.  
STATUS: NEW  

---

ACTION_ID: LHIPS-2026-10-29-002  
SOURCE_AUTOMATION: Long-Horizon Infinite Progression Simulator  
TITLE: Iron Curse announces “healing halved” but WX never halves heals; registry heal hook only logs and returns true  
CATEGORY: technical-limits  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Announce text (`mapModifiers.ts` 379–381) is “+30% RES, healing halved.” `onEffectApplication` for `"heal"` logs and returns true (`389–395`) claiming “WX heal site reads the active-id set to apply the 0.5 multiplier.” Grep of WX has **no** `iron_curse` / `isIronCurse` heal branch. Blood Mend uses `ctx.heal` (`spellEngine.ts` 664) and never calls `applyEffectApplication` with `"heal"`. RES×1.3 on `combatantsRef` still runs and still misses the player (10-25-003). Harness: `IRON_CURSE_HEAL_HALVED === false`. Official XP wall (001) still arrives first.  
FIRST_APPROXIMATE_PROBLEM_LEVEL: **1** (heal half never applies when the modifier rolls). Unreachable by official kill income past the mid-teens.  
CAUSE: Iron Curse heal tax was authored as a WX id-check that was never written. Registry kept a comment and a no-op allow. RES×1.3 stayed on battle-start only.  
PLAYER_EFFECT: Announced heal tax is flavor. Blood Mend 12 and potion % heals are unchanged on Iron Curse maps. RES pull-forward to rook 59 remains 10-25-003.  
TECHNICAL_EFFECT: Distinct from RES×1.3 (10-25-003) and from Mist/Swift Winds combatantsRef misses.  
SYSTEMS_AFFECTED: `iron_curse`; Blood Mend; potions; `applyEffectApplication`  
RECOMMENDED_ACTION: Report only. Do not add a silent 0.5 on `ctx.heal` here. If a human picks this ID, pick one published rule (drop “healing halved” from the announce, or wire 0.5 on player heals) — do not retune RES×1.3 in the same change.  
AUTONOMY: REPORT_ONLY  
DEPENDENCIES: LHIPS-2026-10-25-003 (RES×1.3); LHIPS-2026-09-24-001 (Blood Mend 12); LHIPS-2026-08-31-001 (XP wall)  
REGRESSION_RISK: HIGH if heals are halved without a potion / Mist re-sim. LOW for documentation.  
VALIDATION_REQUIRED: `IRON_CURSE_HEAL_HALVED === false`; WX still has no iron_curse heal id-check; registry heal hook still returns true. Re-run `longHorizonSim.test.ts`.  
STATUS: NEW  

---

ACTION_ID: LHIPS-2026-10-29-003  
SOURCE_AUTOMATION: Long-Horizon Infinite Progression Simulator  
TITLE: Victory AP/MP floors use /20 and /10 while formula AP/MP use /25; MP exceeds create maxMp from 10 and AP exceeds formula from 220  
CATEGORY: technical-limits  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: `victoryResourceFloor` (`deathPenalty.ts` 144–154) is `ap: 6+floor(L/20)`, `mp: 5+floor(L/10)`. Formula is `8+floor(L/25)` / `4+floor(L/25)` (`progression.ts` 59–72; `PLAYER_BASE_AP/MP` in `gameConstants.ts` 131–132). `mergeVictoryRewardLiveStats` (`180–194`) raises `ap`/`mp`/`hp` only — not `maxAp`/`maxMp`. Create maxMp is 5 (`startingChampionStats.ts` 11). Live numbers: L1 fAP 8 / vAP 6, fMP 4 / vMP 5; L75 fAP 11 / vAP 9, fMP 7 / vMP 12; L1500 fAP 68 / vAP 81, fMP 64 / vMP 155; L100000 fAP 4008 / vAP 5006, fMP 4004 / vMP 10005. First AP>formula **220**; first MP>create max **10**. Battle restore still overwrites from formula (`WorldExploration.tsx` 12105–12115, 14342–14364). HP floor>maxHp at 10 remains 08-31-005. Official XP wall (001) still arrives first.  
FIRST_APPROXIMATE_PROBLEM_LEVEL: **1** for MP>formula; **10** for MP>create maxMp; **220** for AP>formula. Unreachable by official kill income past the mid-teens.  
CAUSE: Victory floor used older AP/MP cadences. Formula later locked to /25 with base 8/4. mergeVictory never raised maxAp/maxMp. Authors were not paired.  
PLAYER_EFFECT: After victory the HUD can show current AP/MP above maxAp/maxMp (vitals fill clamps at 100%). Next battle still uses formula. Distinct from the HP over-floor (08-31-005) and from persist 20 vs formula 21 (09-01-003).  
TECHNICAL_EFFECT: Safe Numbers through 100000. Death persist writes `maxAp`/`maxMp` fields (`main.mo` 2054–2056), not the inflated current `ap`/`mp`.  
SYSTEMS_AFFECTED: `victoryResourceFloor`; `mergeVictoryRewardLiveStats`; formula AP/MP; vitals orbs  
RECOMMENDED_ACTION: Report only. Do not retune /25 or raise persist 20 here. If a human picks this ID, align victory floors to formula (or cap to maxAp/maxMp) without changing the HP floor ID.  
AUTONOMY: REPORT_ONLY  
DEPENDENCIES: LHIPS-2026-08-31-005 (HP floor); LHIPS-2026-09-01-003 (formula vs persist AP); LHIPS-2026-09-28-003 (formula MP); LHIPS-2026-08-31-001 (XP wall)  
REGRESSION_RISK: HIGH if victory floors become formula without a post-battle feel pass. LOW for documentation.  
VALIDATION_REQUIRED: `firstLevelVictoryApExceedsFormula() === 220`; `firstLevelVictoryMpExceedsCreateMax() === 10`; `victoryMpFloor(100000) === 10005`. Re-run `longHorizonSim.test.ts`.  
STATUS: NEW  

---

ACTION_ID: LHIPS-2026-10-29-004  
SOURCE_AUTOMATION: Long-Horizon Infinite Progression Simulator  
TITLE: resolvePlayerCast never applies catalog debuffs — Frost −1 MP and Life Drain SP 0.8 stay flavor on the player path  
CATEGORY: technical-limits  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Frost catalog (`spellData.ts` 124–137) has `debuffStat: "mp"`, `debuffModifier: -1`, `debuffDuration: 1`. Life Drain (`103–118`) has `debuffStat: "sp"`, `debuffModifier: 0.8`. `resolvePlayerCast` damage loop (`spellEngine.ts` 876–1028) applies damage then returns — no `applyEffect` for `debuffStat`. `applyDamageToEnemy` (`castHelpers.ts` 400–488) drains HP but does not apply debuffs either. Enemy AI still applies debuffs on its casts (`WorldExploration.tsx` 16594–16604). Tide Shade −1 MP on the **player** still works via family string (10-26-004). Frost dump at 100000 is 1336 casts (10-22-002) with zero MP tax. Harness: `PLAYER_CAST_APPLIES_CATALOG_DEBUFF === false`. Official XP wall (001) still arrives first.  
FIRST_APPROXIMATE_PROBLEM_LEVEL: **1** (debuffs never land). The miss stays at every dump size. Unreachable by official kill income past the mid-teens.  
CAUSE: Player cast was extracted to `resolvePlayerCast` with damage/DoT/heal/shield branches; the old `resolveSpellCast` debuff block (`530–548`) was not ported onto the damage success path.  
PLAYER_EFFECT: Frost is pure damage. Packs never lose MP to player Frost. Life Drain never shreds SP. Tide Shade still taxes the player. At extreme dump the missing −1 MP would not have changed the AI step budget (10-28-002) anyway.  
TECHNICAL_EFFECT: Distinct from Tide Shade (player-targeted family) and from Frost dump damage (10-22-002).  
SYSTEMS_AFFECTED: Frost Bolt; Life Drain; `resolvePlayerCast`; enemy AI debuff path  
RECOMMENDED_ACTION: Report only. Do not wire −1 MP onto AI walk budget here. If a human picks this ID, apply catalog debuffs once after a successful hit — do not stack 1336× −1 MP without a walk re-sim.  
AUTONOMY: REPORT_ONLY  
DEPENDENCIES: LHIPS-2026-10-22-002 (Frost dump); LHIPS-2026-10-26-004 (Tide Shade); LHIPS-2026-10-28-002 (AI step budget); LHIPS-2026-08-31-001 (XP wall)  
REGRESSION_RISK: HIGH if Frost −1 MP is applied per dump cast without a duration/refresh rule. LOW for documentation.  
VALIDATION_REQUIRED: `PLAYER_CAST_APPLIES_CATALOG_DEBUFF === false`; damage loop still has no `debuffStat` apply; enemy AI path still applies debuffs. Re-run `longHorizonSim.test.ts`.  
STATUS: NEW  

---

ACTION_ID: LHIPS-2026-10-29-005  
SOURCE_AUTOMATION: Long-Horizon Infinite Progression Simulator  
TITLE: Arcane Overflow keeps a flat 10% buff/debuff fizzle after spell-fail hits 0 at 201  
CATEGORY: probability  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Base fail is `max(0, 20-(L-1)*0.1)` (`gameTypes.ts` 422–423; `WorldExploration.tsx` 3646–3649) → **0 at 201** (09-24-002). Overflow `onEffectApplication` (`mapModifiers.ts` 325–332) still rolls `rng < 0.1` for non-DoT effects via `applyActiveEffect` (`WorldExploration.tsx` 1873–1885). Shield / Haste / enemy debuffs on the player path still enter that gate. Damage Frost dump uses the fail roll at cast start (which is already 0) — Overflow’s extra 10% is on **effect application**, not the damage loop. Announce says “spells fizzle 10% more.” Harness: `arcaneOverflowEffectFailAfterSpellFailZero(201) === 0.1` at 201 and at 100000. Official XP wall (001) still arrives first.  
FIRST_APPROXIMATE_PROBLEM_LEVEL: **201** for Overflow becoming the only remaining fizzle. Unreachable by official kill income past the mid-teens.  
CAUSE: Spell-fail decay and Overflow’s flat 10% were authored separately. Fail hit 0; Overflow never decayed.  
PLAYER_EFFECT: Past 201, base casts never fizzle, but Shield / other buffs on Overflow maps still fail 10% forever. Surge+Overflow AP dump (10-24-004) is a different axis.  
TECHNICAL_EFFECT: Distinct from spell-fail→0 (09-24-002) and from Surge+Overflow AP cost (10-24-004).  
SYSTEMS_AFFECTED: `arcane_overflow`; `applyEffectApplication`; Shield; spell-fail  
RECOMMENDED_ACTION: Report only. Do not remove Overflow’s 10% or retune spell-fail here. If a human picks this ID, publish whether Overflow is meant to remain after fail hits 0.  
AUTONOMY: REPORT_ONLY  
DEPENDENCIES: LHIPS-2026-09-24-002 (spell-fail 0); LHIPS-2026-10-24-004 (Surge+Overflow AP); LHIPS-2026-08-31-001 (XP wall)  
REGRESSION_RISK: LOW for documentation. MEDIUM if Overflow’s 10% is removed without a Shield reliability pass.  
VALIDATION_REQUIRED: `spellFailChance(201) === 0`; `arcaneOverflowEffectFailAfterSpellFailZero(100000) === 0.1`. Re-run `longHorizonSim.test.ts`.  
STATUS: NEW  

---

ACTION_ID: LHIPS-2026-10-29-006  
SOURCE_AUTOMATION: Long-Horizon Infinite Progression Simulator  
TITLE: Portal +10 XP is 10% of L1 threshold and ~0 of L100+; recovering a near-full-bar death cut needs 2 portals at 1 and >1e29 at 100  
CATEGORY: rewards  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: `PORTAL_TRANSITION_XP = 10` (`applyRewardsResult.ts` 35). Threshold is `100*2^(N-1)` (`xpCurve.ts`). Fraction: **0.1** at 1; **&lt;1e-30** at 100; **0** (IEEE) at 100000. Death cuts `floor(leftover*0.2)` (`deathPenalty.ts` 11–54). Portals to recover near-full leftover: **2** at L1 (99 XP); **&gt;1e29** at L100 (`xpThresholdBigInt(100)-1`). Distinct from exponential-vs-kill XP wall (08-31-001) which is combat income; this is the flat portal step vs leftover death tax. Official XP wall (001) still arrives first.  
FIRST_APPROXIMATE_PROBLEM_LEVEL: **1** for portal being a real 10% step; by **15–25** portal is noise vs threshold; death recovery is already absurd by **48** (HUD MAX_SAFE). Unreachable by official kill income past the mid-teens.  
CAUSE: Portal +10 was a constant courtesy XP. Thresholds and leftover death tax later grew exponentially / as 20% of leftover. Authors were not sized together.  
PLAYER_EFFECT: Portal walks stop contributing measurable leftover XP early. A death near a full bar cannot be repaired by portal spam. Jackpot/applyRewards clamps remain 09-01-002.  
TECHNICAL_EFFECT: Safe for L1–52 Number fractions; L53+ fraction reports 0 because the bigint threshold no longer fits IEEE.  
SYSTEMS_AFFECTED: `PORTAL_TRANSITION_XP`; death XP penalty; `xpThresholdBigInt`  
RECOMMENDED_ACTION: Report only. Do not raise portal XP or change death 20% here. If a human picks this ID, treat portal XP as flavor past the mid-teens or pair it to a published fraction of threshold — do not redesign the XP curve.  
AUTONOMY: REPORT_ONLY  
DEPENDENCIES: LHIPS-2026-08-31-001 (XP wall); LHIPS-2026-09-01-001 (HUD MAX_SAFE); LHIPS-2026-08-31-001 (leftover Nat)  
REGRESSION_RISK: HIGH if portal XP becomes a % of threshold without a jackpot/clamp pass. LOW for documentation.  
VALIDATION_REQUIRED: `portalXpFractionOfThreshold(1) === 0.1`; `(100000) === 0`; `portalsToRecoverDeathXp(99) === 2`. Re-run `longHorizonSim.test.ts`.  
STATUS: NEW  

---

ACTION_ID: LHIPS-2026-10-29-007  
SOURCE_AUTOMATION: Long-Horizon Infinite Progression Simulator  
TITLE: Intended kit zone saturates at 2 (player 11) forever — even fixing the LevelZone object still never grows queen/king kits past Inferno  
CATEGORY: enemy-stats  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Live call still passes `currentMap.levelZone` object (`WorldExploration.tsx` 11920) → zone-0 kits (08-31-007). Intended numeric zone is `playerTier+1` (`4679–4687`): **1** at L1, **2** at L11, **10000** at L100000. `buildEnemyKit` queen/king only branch on `zone >= 1` / `>= 2` (`longHorizonSim.ts` 117–124 mirroring `enemyAI`). Queen intended at 11 / 100 / 100000 is the same `["spell-inferno","starter-heal"]`. Inferno direct damage is still 0 and skipped by `pickBestDamageSpell` (09-26-001). Harness: `firstPlayerLevelIntendedKitZoneAtLeast(2) === 11`; queen intended at 100000 equals at 11. Official XP wall (001) still arrives first.  
FIRST_APPROXIMATE_PROBLEM_LEVEL: **11** for intended saturation; **1** for live object NaN (007). Unreachable by official kill income past the mid-teens.  
CAUSE: Kit tables were written with two zone gates when zones were small. Zone tier later tracked playerTier unboundedly. No further kit bands exist.  
PLAYER_EFFECT: Fixing 007 alone would unlock Inferno/Poison kit ids at L11 and then freeze forever. Combat identity would still collapse to Crush (09-26-001 / 09-22-001).  
TECHNICAL_EFFECT: Distinct from object NaN (007) and from Inferno damage 0 skip (09-26-001).  
SYSTEMS_AFFECTED: `buildEnemyKit`; `currentZoneTier`; LevelZone  
RECOMMENDED_ACTION: Report only. Do not add kit bands or pass the number here. If a human picks this ID after fixing 007, publish that zone≥2 is the terminal kit band.  
AUTONOMY: REPORT_ONLY  
DEPENDENCIES: LHIPS-2026-08-31-007 (object NaN); LHIPS-2026-09-26-001 (kit vs Crush); LHIPS-2026-08-31-001 (XP wall)  
REGRESSION_RISK: HIGH if new kit bands are added without a Crush TTK re-sim. LOW for documentation.  
VALIDATION_REQUIRED: `intendedKitZone(11) === 2`; queen intended at 11 equals at 100000; live object kit still zone-0. Re-run `longHorizonSim.test.ts`.  
STATUS: NEW  

---

ACTION_ID: LHIPS-2026-10-29-008  
SOURCE_AUTOMATION: Long-Horizon Infinite Progression Simulator  
TITLE: Map zone label tracks uncapped playerTier (Tier 10000 / levels 99991–100000) while overworld pick max stays 1020  
CATEGORY: enemy-stats  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Zone label (`WorldExploration.tsx` 4679–4687) is `playerTier = floor((L-1)/10)`, `min/max = playerTier band` with **no** 999 clamp. Pick max is still `floor(999/tierSize)` (+ adjacent leak → 1020) (`combatMath.ts` 58; 08-31-003). At L100000 label is Tier **10000**, min **99991**, max **100000** while packs roll ≤1020. Dungeon +30 after the cap pick remains 10-22-003. Harness: `mapZoneLabel(100000).maxLevel === 100000`; `overworldMaxTier() === 99`; `pickMaxWithAdjLeak === 1020`. Official XP wall (001) still arrives first.  
FIRST_APPROXIMATE_PROBLEM_LEVEL: **~1000** for label max exceeding pick max; guaranteed after **2500** (100% under-level, 003). Unreachable by official kill income past the mid-teens.  
CAUSE: Zone UI was derived from player tier for naming. Spawn pick later grew a hard 999 tier ceiling. The label never joined that ceiling.  
PLAYER_EFFECT: HUD/zone copy promises a level band the overworld cannot spawn. Extreme players see “Tier 10000 Zone” fighting ~1020 packs (and dungeon 1030).  
TECHNICAL_EFFECT: Distinct from pick cap (003) and from dungeon +30 (10-22-003). Safe Numbers.  
SYSTEMS_AFFECTED: LevelZone naming; `pickEnemyLevelFromTiers`; overworld spawn  
RECOMMENDED_ACTION: Report only. Do not raise the 999 cap or rewrite zone UI here. If a human picks this ID, clamp the label to the pick band or rename it as a player-tier index — do not treat the label as spawn truth.  
AUTONOMY: REPORT_ONLY  
DEPENDENCIES: LHIPS-2026-08-31-003 (999 cap); LHIPS-2026-10-22-003 (dungeon +30); LHIPS-2026-08-31-001 (XP wall)  
REGRESSION_RISK: LOW for documentation. MEDIUM if the label is clamped without updating admin/debug copy.  
VALIDATION_REQUIRED: `mapZoneLabel(100000).zoneTier === 10000`; pick max still 1020. Re-run `longHorizonSim.test.ts`.  
STATUS: NEW  
