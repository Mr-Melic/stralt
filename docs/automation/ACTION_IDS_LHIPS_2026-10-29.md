# ACTION_IDs — 2026-10-29 Long-Horizon Infinite Progression Simulator

Durable ledger for implementers and the Report Action Orchestrator.  
Source of every record: Long-Horizon Infinite Progression Simulator.  
Narrative: [`LONG_HORIZON_2026-10-29.md`](./LONG_HORIZON_2026-10-29.md).  
Harness: `src/frontend/src/utils/longHorizonSim.ts`.

Do not implement gameplay from this file unless a later human or orchestrator explicitly picks an ID. This run ships **observation only** — no curve redesign.

HEAD inspected: `0f5363f` (same commit `#357` / `#407` / `#475` / `#530` / `#560` / `#637` / `#670` / `#748` / `#777` / `#819` / `#898` / `#960` / `#1016` / `#1077` / `#1141` / `#1197` / `#1250` inspected). Stress includes 10000 / 50000 / 100000. Harness **unions** `#1250` rather than overwriting those files. This branch restacks onto `#1250` so oldest-first merge-tree stays clean.

## Still-open IDs (not re-filed)

| ACTION_ID | STATUS | Notes |
| :--- | :--- | :--- |
| `LHIPS-2026-08-31-001` | NEW | Exponential XP vs linear kill XP. Practical wall ~15–22. Portal +10 recovery is 10-29-006. |
| `LHIPS-2026-08-31-002` | NEW | IEEE Infinity of the raw float at 1019. HUD path superseded by 09-01-001. |
| `LHIPS-2026-08-31-003` | NEW | Enemy `maxTier = floor(999/tierSize)`. Overworld pick max is **1000**. Adj leak 1020. Zone label is 10-29-008. Dungeon +30 is 10-22-003. |
| `LHIPS-2026-08-31-004` | NEW | RES/SR hit 100; player SP does not scale. Iron Curse pulls rook 100 earlier (10-25-003). |
| `LHIPS-2026-08-31-005` | NEW | Three HP formulas; victory floor exceeds maxHp at 10. Victory AP/MP floors are 10-29-003. Titans +1000 is a fifth on the store (10-25-001). |
| `LHIPS-2026-08-31-006` | NEW | 30% uniform AI 1–10; saturates ~901. |
| `LHIPS-2026-08-31-007` | NEW | `buildEnemyKit(currentMap.levelZone)` still passes an object. Intended z≥2 terminal band is 10-29-007. Unused random pool is 10-29-009. |
| `LHIPS-2026-08-31-008` | NEW | All 32 starters owned at create. Enemy random pool is never assigned (10-29-009). |
| `LHIPS-2026-08-31-009` | NEW | Summoner 100% at player 44. Wolf melee uses player.level (10-25-004). |
| `LHIPS-2026-08-31-010` | NEW | Catalog world-boss HP static. RES/CHC still scale (09-29-001). |
| `LHIPS-2026-08-31-011` | NEW | Challenge under-30 / under-50 fail on one hit at 14 / 24. Thorn walk of 7 tiles also deals 30 at 75 (10-28-001). |
| `LHIPS-2026-08-31-012` | NEW | Jackpot table unchanged. Persist 100k-capped. Doka Fever 2× still clamps (10-25-002). |
| `LHIPS-2026-08-31-013` | NEW | Level frozen on `saveBattleStats`. |
| `LHIPS-2026-08-31-014` | NEW | No player telemetry. |
| `LHIPS-2026-09-01-001` | NEW | HUD saturates at MAX_SAFE from 48. |
| `LHIPS-2026-09-01-002` | NEW | applyRewards 100k/500k vs jackpot and Void+boost XP. |
| `LHIPS-2026-09-01-003` | NEW | Formula AP 21 at 325 vs silent persist 20. |
| `LHIPS-2026-09-01-004` | NEW | Leftover Nat / Motoko pow2 / Number leftover. |
| `LHIPS-2026-09-02-001` | NEW | GameKey redeem up to 10M Doka outside applyRewards 100k. |
| `LHIPS-2026-09-02-002` | NEW | `upgradeSpell` `10*2^n` outruns combat Doka at 14, GameKey at 20, Number at 50. |
| `LHIPS-2026-09-21-001` | NEW | Frozen create INIT 10 vs scaling enemy INIT. Chaos Initiative is the remaining lottery (10-27-002). Queued `#357`. |
| `LHIPS-2026-09-21-002` | NEW | Enemy CHC saturates at 100 from bishop 115. Create player CHC stays 5 (10-29-001). Queued `#357`. |
| `LHIPS-2026-09-22-001` | NEW | Unenraged fallback Crush one-shots. Paper Windstorm cannot miss it (10-27-001). Starter Shield does not apply (10-27-003). Queued `#407`. |
| `LHIPS-2026-09-23-001` | NEW | Flat lava/spikes/poison vs linear HP. Thorn is a walk-path cousin (10-28-001). Queued `#475`. |
| `LHIPS-2026-09-23-002` | NEW | `maxSpellRange` 5 homogenizes starter ranges by 40. Advertised Paper Windstorm 50% range is unused (10-27-001). Queued `#475`. |
| `LHIPS-2026-09-24-001` | NEW | Flat Blood Mend 12 vs linear HP. Advertised CHC buff never lands (10-29-001). Mending Mist 5% does not commit (10-24-001). Queued `#530`. |
| `LHIPS-2026-09-24-002` | NEW | Spell-fail hits 0 at 201. Overflow 10% remains (10-29-005). Queued `#530`. |
| `LHIPS-2026-09-25-001` | NEW | Betrayal enrage 6× Crush. Queued `#560`. |
| `LHIPS-2026-09-25-002` | NEW | Shield Charm 20; potion Doka 50/120 forever. Starter Shield RES buff is a different skip (10-27-003). |
| `LHIPS-2026-09-26-001` | NEW | Kit Strike/Frost stay catalog-flat vs Crush. Intended Inferno kit still 0 direct (10-29-007). |
| `LHIPS-2026-09-26-002` | NEW | Idle +1 HP / 10s vs linear maxHp. Queued `#637`. |
| `LHIPS-2026-09-27-001` | NEW | Player Frost vs 999-capped packs. Titans/Glass multiply chip-1 after RES (10-25-001). Paper Windstorm drops 30% of the dump (10-27-001). |
| `LHIPS-2026-09-27-002` | NEW | Catalog summon HP vs Crush. Queued `#670`. |
| `LHIPS-2026-09-27-003` | NEW | Shrine 300 vs ground `5+2L`. Queued `#670`. |
| `LHIPS-2026-09-28-001` | NEW | Boss Rush `player+2` ignores 999 cap. Queued `#748`. |
| `LHIPS-2026-09-28-002` | NEW | Catalog room Doka unused vs `1.5L` persist. Queued `#748`. |
| `LHIPS-2026-09-28-003` | NEW | Formula MP vs 16×16 grid at 300. Slime+Frozen 4× moves that to 1500 (10-27-004). Enemy step budget 3 does not (10-28-002). |
| `LHIPS-2026-09-29-001` | NEW | Catalog world-boss HP frozen while `computeEnemyStats(player+5)` rolls RES/CHC. |
| `LHIPS-2026-09-29-002` | NEW | Shop 3 HP/Doka vs potion % and 100k ceiling. Queued `#777`. |
| `LHIPS-2026-10-21-001` | NEW | Initiative overlay AP = level + hardcoded RES 0 / CHC 2. Queued `#819`. |
| `LHIPS-2026-10-21-002` | NEW | Create evasion / resilience / SR never enter combat. Queued `#819`. |
| `LHIPS-2026-10-22-001` | NEW | Family 30% combat identity wiped at battle-start. Family **string** still drives Void Mirror / Tide / Ember (10-26). Four other families have no string hook (10-28-005). |
| `LHIPS-2026-10-22-002` | NEW | Zero-CD Frost × unbounded battle AP. Catalog MP debuff never lands (10-29-004). Time Warp 15s is the wall-clock gate (10-26-003). Paper Windstorm is the miss tax (10-27-001). |
| `LHIPS-2026-10-22-003` | NEW | Dungeon +30 after the 999-cap pick. Queued `#898`. |
| `LHIPS-2026-10-23-001` | NEW | Timestep restores formula AP. Queued `#960`. |
| `LHIPS-2026-10-23-002` | NEW | Player summons have no cap. Queued `#960`. |
| `LHIPS-2026-10-23-003` | NEW | Summon INIT/RES use player level + king fallback. Melee uses the same level (10-25-004). |
| `LHIPS-2026-10-24-001` | NEW | Mending Mist 5% never commits. Same combatantsRef miss as Titans HP (10-25-001) and Swift Winds (10-28-003). |
| `LHIPS-2026-10-24-002` | NEW | Sacrifice 0.6× HP then chip-1 vs RES 100. Sacrifice skips Mirror Field and Void Mirror. |
| `LHIPS-2026-10-24-003` | NEW | Arcane Surge Frost dump. Queued `#1016`. |
| `LHIPS-2026-10-24-004` | NEW | Two-roll Surge+Overflow Frost to 1 AP. Overflow 10% fizzle after fail 0 is 10-29-005. Queued `#1016`. |
| `LHIPS-2026-10-25-001` | NEW | Titans +1000 misses the player; 1–5× multiplies only outgoing chip-1. Queued `#1077`. |
| `LHIPS-2026-10-25-002` | NEW | Doka Fever +25% HP no-op on overworld spawn. Queued `#1077`. |
| `LHIPS-2026-10-25-003` | NEW | Iron Curse rook RES 100 at 59. Heal-halved announce is 10-29-002. Queued `#1077`. |
| `LHIPS-2026-10-25-004` | NEW | Hostile summon melee === player.level. Queued `#1077`. |
| `LHIPS-2026-10-25-005` | NEW | Vampiric 15% mutates a throwaway snapshot. Queued `#1077`. |
| `LHIPS-2026-10-26-001` | NEW | Mirror Field 20% pre-RES self-hit + cancel. Queued `#1141`. |
| `LHIPS-2026-10-26-002` | NEW | Void Mirror family 25% after stat wipe. Queued `#1141`. |
| `LHIPS-2026-10-26-003` | NEW | Time Warp 15s vs Frost dump. Queued `#1141`. |
| `LHIPS-2026-10-26-004` | NEW | Tide Shade −1 MP vs formula MP. Player Frost −1 MP never lands (10-29-004). Queued `#1141`. |
| `LHIPS-2026-10-27-001` | NEW | Paper Windstorm miss vs advertised range + Crush immunity. Queued `#1197`. |
| `LHIPS-2026-10-27-002` | NEW | Chaos Initiative vs INIT freeze + shuffle-after-dispatch. Queued `#1197`. |
| `LHIPS-2026-10-27-003` | NEW | Starter Shield skipped on Crush melee. Queued `#1197`. |
| `LHIPS-2026-10-27-004` | NEW | Slime+Frozen 4× walk MP vs formula MP. Enemy step budget is 10-28-002. Queued `#1197`. |
| `LHIPS-2026-10-28-001` | NEW | Thorned Ground player-only walk tax then grid-capped 145. Queued `#1250`. |
| `LHIPS-2026-10-28-002` | NEW | AI step budget 3 vs stacked cost 4 → 0 tiles. Queued `#1250`. |
| `LHIPS-2026-10-28-003` | NEW | Swift Winds +2 never reaches live MP. Queued `#1250`. |
| `LHIPS-2026-10-28-004` | NEW | Gravity Well / Fog of War 2/22 empty slots. Queued `#1250`. |
| `LHIPS-2026-10-28-005` | NEW | 4/7 family variants paint-only after overwrite. Queued `#1250`. |
| `AQA-2026-08-30-012` | NEW | Collectors still missing. |

This file adds IDs only where a long-horizon failure was in-scope and never filed (Blood Mend / Rallying Cry CHC buff never applied and catalog 0.15 would be −85% if multiplied; Iron Curse heal-halved no-op; victory AP/MP floors `/20`/`/10` vs formula `/25`; player-cast Frost/Drain catalog debuffs dropped; Arcane Overflow 10% after spell-fail 0; portal +10 vs exponential threshold / death recovery; intended kit zone saturates at 2; map zone label uncapped vs 999 pick; `usableByEnemy` random pool never assigned; `saveKillCount` never called from play).

---

ACTION_ID: LHIPS-2026-10-29-001  
SOURCE_AUTOMATION: Long-Horizon Infinite Progression Simulator  
TITLE: Blood Mend and Rallying Cry advertise +15% CHC for 2 turns but resolvePlayerCast never applies the buff; catalog buffModifier 0.15 would multiply CHC by 0.15 (−85%) if wired  
CATEGORY: technical-limits  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Catalog `starter-heal` (`spellData.ts` 85–98) and `spell-rallying-cry` (`415–435`) set `effectType: "heal"`, `buffStat: "chc"`, `buffModifier: 0.15`, `buffDuration: 2`, copy “+15% CHC”. Live `resolvePlayerCast` heal branch (`spellEngine.ts` 655–672) heals then `return "cast"` — no `applyEffect`. Shield path (`680–718`) requires `effectType === "buff"`; both spells are `"heal"`. `getStatModifier` multiplies non-AP/MP stats (`statusEffects.ts` 45–62); `formatBattleEffectMagnitude` would show `(0.15-1)=−85%` (`111–118`). Create CHC stays 5 (09-21-002). Enemy `resolveSpellCast` still has a buff branch (`spellEngine.ts` 508–527) but live kits pass a LevelZone object so king never receives Rallying Cry (007). Harness: `BLOOD_MEND_CHC_BUFF_APPLIED === false`; `bloodMendBuffModifierAsPercentDelta() === -0.85`. Official XP wall (001) still arrives first.  
FIRST_APPROXIMATE_PROBLEM_LEVEL: **1** (buff never lands). Unreachable by official kill income past the mid-teens.  
CAUSE: Heal spells were extracted to an early return that only writes HP. The CHC buff fields were left on the catalog. The 0.15 literal looks like a percentage delta written into a multiplicative slot (shield uses 1.3).  
PLAYER_EFFECT: Blood Mend and Rallying Cry are heal-only. Crit chance stays create 5% forever. At every horizon the advertised temporary crit buff is flavor. Flat heal 12 vs linear HP remains 09-24-001.  
TECHNICAL_EFFECT: Safe Numbers. Distinct from flat heal magnitude (09-24-001) and from Mist no-op (10-24-001). If a later change wires 0.15 as a multiply without lifting it to 1.15, CHC becomes 0.75 at create.  
SYSTEMS_AFFECTED: Blood Mend; Rallying Cry; `resolvePlayerCast` heal branch; CHC; `getStatModifier`  
RECOMMENDED_ACTION: Report only. Do not wire 0.15 as a multiply or retune create CHC here. If a human picks this ID, pick one published rule (drop the buff copy, or apply `1.15` via `applyEffect` after heal) — do not silently change crit economy.  
AUTONOMY: REPORT_ONLY  
DEPENDENCIES: LHIPS-2026-09-24-001 (flat heal); LHIPS-2026-09-21-002 (create CHC 5); LHIPS-2026-08-31-007 (live kits hide Rallying Cry); LHIPS-2026-08-31-001 (XP wall)  
REGRESSION_RISK: HIGH if `0.15` is applied as multiply without fixing to `1.15`. LOW for documentation.  
VALIDATION_REQUIRED: `BLOOD_MEND_CHC_BUFF_APPLIED === false`; heal branch still returns before `applyEffect`; catalog modifier still 0.15 on Blood Mend and Rallying Cry. Re-run `longHorizonSim.test.ts`.  
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
EVIDENCE: `victoryResourceFloor` (`deathPenalty.ts` 144–154) is `ap: 6+floor(L/20)`, `mp: 5+floor(L/10)`. Formula is `8+floor(L/25)` / `4+floor(L/25)` (`progression.ts` 59–72; `PLAYER_BASE_AP/MP` in `gameConstants.ts`). `mergeVictoryRewardLiveStats` (`180–194`) raises `ap`/`mp`/`hp` only — not `maxAp`/`maxMp`. Create maxMp is 5 (`startingChampionStats.ts` 11). Live numbers: L1 fAP 8 / vAP 6, fMP 4 / vMP 5; L75 fAP 11 / vAP 9, fMP 7 / vMP 12; L1500 fAP 68 / vAP 81, fMP 64 / vMP 155; L100000 fAP 4008 / vAP 5006, fMP 4004 / vMP 10005. First AP>formula **220**; first MP>create max **10**. Battle restore still overwrites from formula. HP floor>maxHp at 10 remains 08-31-005. Official XP wall (001) still arrives first.  
FIRST_APPROXIMATE_PROBLEM_LEVEL: **1** for MP>formula; **10** for MP>create maxMp; **220** for AP>formula. Unreachable by official kill income past the mid-teens.  
CAUSE: Victory floor used older AP/MP cadences. Formula later locked to /25 with base 8/4. mergeVictory never raised maxAp/maxMp. Authors were not paired.  
PLAYER_EFFECT: After victory the HUD can show current AP/MP above maxAp/maxMp (vitals fill clamps at 100%). Next battle still uses formula. Distinct from the HP over-floor (08-31-005) and from persist 20 vs formula 21 (09-01-003).  
TECHNICAL_EFFECT: Safe Numbers through 100000. Death persist writes `maxAp`/`maxMp` fields, not the inflated current `ap`/`mp`.  
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
EVIDENCE: Frost catalog (`spellData.ts` 124–137) has `debuffStat: "mp"`, `debuffModifier: -1`, `debuffDuration: 1`. Life Drain (`103–118`) has `debuffStat: "sp"`, `debuffModifier: 0.8`. `resolvePlayerCast` damage loop (`spellEngine.ts` 876–1028) applies damage then returns — no `applyEffect` for `debuffStat`. `applyDamageToEnemy` does not apply debuffs either. Enemy AI still applies debuffs on its casts (`WorldExploration.tsx` 16594–16604). Tide Shade −1 MP on the **player** still works via family string (10-26-004). Frost dump at 100000 is 1336 casts (10-22-002) with zero MP tax. Harness: `PLAYER_CAST_APPLIES_CATALOG_DEBUFF === false`. Official XP wall (001) still arrives first.  
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
EVIDENCE: Base fail is `max(0, 20-(L-1)*0.1)` → **0 at 201** (09-24-002). Overflow `onEffectApplication` (`mapModifiers.ts` 325–332) still rolls `rng < 0.1` for non-DoT effects via `applyActiveEffect` (`WorldExploration.tsx` 1871–1885). Shield / Haste still enter that gate. Damage Frost dump uses the fail roll at cast start (already 0) and never calls `applyEffectApplication` — Overflow’s extra 10% is on **effect application**, not the damage loop. Announce says “spells fizzle 10% more.” Harness: `arcaneOverflowEffectFailAfterSpellFailZero(201) === 0.1` at 201 and at 100000. Official XP wall (001) still arrives first.  
FIRST_APPROXIMATE_PROBLEM_LEVEL: **201** for Overflow becoming the only remaining fizzle on buffs. Unreachable by official kill income past the mid-teens.  
CAUSE: Spell-fail decay and Overflow’s flat 10% were authored separately. Fail hit 0; Overflow never decayed. Damage was never wired through the effect-application hook.  
PLAYER_EFFECT: Past 201, base damage casts never fizzle, but Shield / other buffs on Overflow maps still fail 10% forever. Surge+Overflow AP dump (10-24-004) is a different axis.  
TECHNICAL_EFFECT: Distinct from spell-fail→0 (09-24-002) and from Surge+Overflow AP cost (10-24-004).  
SYSTEMS_AFFECTED: `arcane_overflow`; `applyEffectApplication`; Shield; spell-fail  
RECOMMENDED_ACTION: Report only. Do not remove Overflow’s 10% or retune spell-fail here. If a human picks this ID, publish whether Overflow is meant to remain after fail hits 0, and whether it was meant to wrap damage casts.  
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
EVIDENCE: `PORTAL_TRANSITION_XP = 10` (`applyRewardsResult.ts` 35). Threshold is `100*2^(N-1)` (`xpCurve.ts`). Fraction: **0.1** at 1; **<1e-30** at 100; **0** (IEEE) at 100000. Death cuts `floor(leftover*0.2)` (`deathPenalty.ts`). Portals to recover near-full leftover: **2** at L1 (99 XP); **>1e29** at L100 (`xpThresholdBigInt(100)-1`). Distinct from exponential-vs-kill XP wall (08-31-001) which is combat income; this is the flat portal step vs leftover death tax. Official XP wall (001) still arrives first.  
FIRST_APPROXIMATE_PROBLEM_LEVEL: **1** for portal being a real 10% step; by **15–25** portal is noise vs threshold; death recovery is already absurd by **48** (HUD MAX_SAFE). Unreachable by official kill income past the mid-teens.  
CAUSE: Portal +10 was a constant courtesy XP. Thresholds and leftover death tax later grew exponentially / as 20% of leftover. Authors were not sized together.  
PLAYER_EFFECT: Portal walks stop contributing measurable leftover XP early. A death near a full bar cannot be repaired by portal spam. Jackpot/applyRewards clamps remain 09-01-002.  
TECHNICAL_EFFECT: Safe for L1–52 Number fractions; L53+ fraction reports 0 because the bigint threshold no longer fits IEEE.  
SYSTEMS_AFFECTED: `PORTAL_TRANSITION_XP`; death XP penalty; `xpThresholdBigInt`  
RECOMMENDED_ACTION: Report only. Do not raise portal XP or change death 20% here. If a human picks this ID, treat portal XP as flavor past the mid-teens or pair it to a published fraction of threshold — do not redesign the XP curve.  
AUTONOMY: REPORT_ONLY  
DEPENDENCIES: LHIPS-2026-08-31-001 (XP wall); LHIPS-2026-09-01-001 (HUD MAX_SAFE); LHIPS-2026-09-01-004 (leftover Nat)  
REGRESSION_RISK: HIGH if portal XP becomes a % of threshold without a jackpot/clamp pass. LOW for documentation.  
VALIDATION_REQUIRED: `portalXpFractionOfThreshold(1) === 0.1`; `(100000) === 0`; `portalsToRecoverDeathXp(99) === 2`. Re-run `longHorizonSim.test.ts`.  
STATUS: NEW  

---

ACTION_ID: LHIPS-2026-10-29-007  
SOURCE_AUTOMATION: Long-Horizon Infinite Progression Simulator  
TITLE: Intended kit zone saturates at 2 (player 11) forever — even fixing the LevelZone object still never grows queen/king kits past Inferno  
CATEGORY: spell-pools  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Live call still passes `currentMap.levelZone` object (`WorldExploration.tsx` 11920) → zone-0 kits (08-31-007). Intended numeric zone is `playerTier+1` (`4679–4687`): **1** at L1, **2** at L11, **10000** at L100000. `buildEnemyKit` queen/king only branch on `zone >= 1` / `>= 2`. Queen intended at 11 / 100 / 100000 is the same `["spell-inferno","starter-heal"]`. Inferno direct damage is still 0 and skipped by `pickBestDamageSpell` (09-26-001). Harness: `firstPlayerLevelIntendedKitZoneAtLeast(2) === 11`; queen intended at 100000 equals at 11. Official XP wall (001) still arrives first.  
FIRST_APPROXIMATE_PROBLEM_LEVEL: **11** for intended saturation; **1** for live object NaN (007). Unreachable by official kill income past the mid-teens.  
CAUSE: Kit tables were written with two zone gates when zones were small. Zone tier later tracked playerTier unboundedly. No further kit bands exist.  
PLAYER_EFFECT: Fixing 007 alone would unlock Inferno/Poison kit ids at L11 and then freeze forever. Combat identity would still collapse to Crush (09-26-001 / 09-22-001). High-level enemies do not receive a deeper advanced kit.  
TECHNICAL_EFFECT: Distinct from object NaN (007), from Inferno damage 0 skip (09-26-001), and from the unused random pool (10-29-009).  
SYSTEMS_AFFECTED: `buildEnemyKit`; `currentZoneTier`; LevelZone  
RECOMMENDED_ACTION: Report only. Do not add kit bands or pass the number here. If a human picks this ID after fixing 007, publish that zone≥2 is the terminal kit band.  
AUTONOMY: REPORT_ONLY  
DEPENDENCIES: LHIPS-2026-08-31-007 (object NaN); LHIPS-2026-09-26-001 (kit vs Crush); LHIPS-2026-10-29-009 (random pool unused); LHIPS-2026-08-31-001 (XP wall)  
REGRESSION_RISK: HIGH if new kit bands are added without a Crush TTK re-sim. LOW for documentation.  
VALIDATION_REQUIRED: `intendedKitZone(11) === 2`; queen intended at 11 equals at 100000; live object kit still zone-0. Re-run `longHorizonSim.test.ts`.  
STATUS: NEW  

---

ACTION_ID: LHIPS-2026-10-29-008  
SOURCE_AUTOMATION: Long-Horizon Infinite Progression Simulator  
TITLE: Map zone label tracks uncapped playerTier (Tier 10000 / levels 99991–100000) while overworld pick max stays 1020  
CATEGORY: enemy-generation  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Zone label (`WorldExploration.tsx` 4679–4687) is `playerTier = floor((L-1)/10)`, `min/max = playerTier band` with **no** 999 clamp. Pick max is still `floor(999/tierSize)` (`combatMath.ts` 58) plus ±1/±2 adj leak that is not re-clamped → **1020**. At L100000 label is Tier **10000**, min **99991**, max **100000** while packs roll ≤1020. Dungeon +30 after the cap pick remains 10-22-003. Harness: `mapZoneLabel(100000).maxLevel === 100000`; `overworldMaxTier() === 99`; `pickMaxWithAdjLeak === 1020`. Official XP wall (001) still arrives first.  
FIRST_APPROXIMATE_PROBLEM_LEVEL: **~1000** for label max exceeding pick max; guaranteed after **2500** (100% under-level, 003). Unreachable by official kill income past the mid-teens.  
CAUSE: Zone UI was derived from player tier for naming. Spawn pick later grew a hard 999 tier ceiling. The label never joined that ceiling. ±1/±2 branches of `pickEnemyLevelFromTiers` were never re-clamped to `maxTier`.  
PLAYER_EFFECT: HUD/zone copy promises a level band the overworld cannot spawn. Extreme players see “Tier 10000 Zone” fighting ~1020 packs (and dungeon 1030).  
TECHNICAL_EFFECT: Distinct from pick cap (003) and from dungeon +30 (10-22-003). Safe Numbers.  
SYSTEMS_AFFECTED: LevelZone naming; `pickEnemyLevelFromTiers`; overworld spawn  
RECOMMENDED_ACTION: Report only. Do not raise the 999 cap or rewrite zone UI here. If a human picks this ID, clamp the label to the pick band or rename it as a player-tier index — do not treat the label as spawn truth.  
AUTONOMY: REPORT_ONLY  
DEPENDENCIES: LHIPS-2026-08-31-003 (999 cap); LHIPS-2026-10-22-003 (dungeon +30); LHIPS-2026-08-31-001 (XP wall)  
REGRESSION_RISK: LOW for documentation. MEDIUM if the label is clamped without updating admin/debug copy.  
VALIDATION_REQUIRED: `mapZoneLabel(100000).zoneTier === 10000`; pick max still 1020. Re-run `longHorizonSim.test.ts`.  
STATUS: NEW  

---

ACTION_ID: LHIPS-2026-10-29-009  
SOURCE_AUTOMATION: Long-Horizon Infinite Progression Simulator  
TITLE: Battle-start filters usableByEnemy into `_enemyUsableSpells` then never assigns it — advanced/rare pool chance is 0 at every level  
CATEGORY: spell-pools  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Comment at `WorldExploration.tsx` 11915 is “Assign 10 random spells per enemy from usableByEnemy pool.” Live code filters `normalizedSpellPool` into `_enemyUsableSpells` (`11916–11918`, biome-legal unused `_`) then `assignEnemySpells` only maps `buildEnemyKit` ids (`11919–11924`). Random sample of 10 never runs. `ENEMY_RANDOM_ADVANCED_POOL_CHANCE === 0` at 1, 100, 1000, and 100000. `enemyUsableStarterCount()` is the unused pool size (`usableByEnemy !== false`). Combined with object-NaN kits (007) and intended z≥2 freeze (10-29-007), high-level enemies never receive a deeper advanced/rare draw. Summoner 100% at 44 (08-31-009) can still append wolf/archer on top of the kit. Player already owns all 32 starters (08-31-008), so discovery is not the missing pool. Official XP wall (001) still arrives first.  
FIRST_APPROXIMATE_PROBLEM_LEVEL: **1** (the random assign is dead on every map). Extreme progression does not add a second assigner. Unreachable by official kill income past the mid-teens.  
CAUSE: Battle-start was commented as a 10-draw from `usableByEnemy`. Implementation landed as kit lookup only. The filtered array was kept (underscore-prefixed) so lint is silent. No later level-scaled advanced/rare chance was added.  
PLAYER_EFFECT: Packs do not diversify into catalog advanced/rare spells as the player levels. Role identity is the z0 kit (live) or the z2 Inferno/Heal freeze (intended) plus a 100% summoner stamp after 44. Rarity of enemy spells collapses to empty — not “every high-level enemy gets the same advanced spell,” but “no high-level enemy gets an advanced spell from the pool.”  
TECHNICAL_EFFECT: Distinct from 007 (wrong zone type) and 10-29-007 (no kit band past 2). `_enemyUsableSpells` is an unused local. `usableByEnemy` admin checkboxes still write the catalog.  
SYSTEMS_AFFECTED: `_enemyUsableSpells`; `assignEnemySpells`; `usableByEnemy`; `buildEnemyKit`; summoner append  
RECOMMENDED_ACTION: Report only. Do not start drawing 10 random spells per enemy here. If a human picks this ID, pick one published rule (delete the dead filter and the comment, or implement a level-scaled draw that keeps piece kits as the identity) — do not concatenate a 10-draw on top of Inferno kits without a TTK re-sim.  
AUTONOMY: REPORT_ONLY  
DEPENDENCIES: LHIPS-2026-08-31-007 (object NaN kits); LHIPS-2026-10-29-007 (z≥2 freeze); LHIPS-2026-08-31-008 (player owns starters); LHIPS-2026-08-31-009 (summoner 100%); LHIPS-2026-08-31-001 (XP wall)  
REGRESSION_RISK: HIGH if a 10-draw ships without pairing to kits / Crush / summoner append. LOW for documentation.  
VALIDATION_REQUIRED: `ENEMY_USABLE_SPELL_POOL_ASSIGNED === false`; `ENEMY_RANDOM_ADVANCED_POOL_CHANCE === 0`; `ENEMY_INTENDED_RANDOM_SPELLS_PER_ENEMY === 10`; live `_enemyUsableSpells` still unread. Re-run `longHorizonSim.test.ts`.  
STATUS: NEW  

---

ACTION_ID: LHIPS-2026-10-29-010  
SOURCE_AUTOMATION: Long-Horizon Infinite Progression Simulator  
TITLE: Official play never calls saveKillCount — leaderboard killCount stays at create 0; canister rejects kills > 64 per call  
CATEGORY: technical-limits  
PRIORITY: P3  
CONFIDENCE: HIGH  
EVIDENCE: `useSaveKillCount` (`useLeaderboardQueries.ts` 43–51) is the only client wrapper. `rg` of `useSaveKillCount(` finds **no** play-UI caller. Canister `saveKillCount` (`main.mo` 3078–3101) adds `kills` onto stored `stats.killCount` but returns `#err("kills exceed single-battle bound")` when `kills > 64`. Create `killCount` is 0 (`startingChampionStats.ts` 20). CharacterStats still requires the field on every persist payload. Extreme progression does not increment it. Official XP wall (001) still arrives first.  
FIRST_APPROXIMATE_PROBLEM_LEVEL: **1** (counter is frozen from create). The 64 bound is unreachable from the official client at any level.  
CAUSE: A per-battle kill writer was stubbed with a 64 guard. Play UI never mounted the mutation. Persist still carries `killCount` as a required CharacterStats field.  
PLAYER_EFFECT: Any surface that reads canister `killCount` (leaderboard, feats keyed on it) stays at 0 at level 1 and at 100000. Combat still tracks live kills for recap / `applyRewards`; this is a different counter.  
TECHNICAL_EFFECT: Distinct from `saveKillCount` rejecting >64 (the bound is dead code on the official path). Unbounded player summons (10-23-002) could in theory exceed 64 kills in one battle if the hook were wired.  
SYSTEMS_AFFECTED: `saveKillCount`; `useSaveKillCount`; CharacterStats.killCount; leaderboard  
RECOMMENDED_ACTION: Report only. Do not wire `useSaveKillCount` onto victory here. If a human picks this ID, pick one published rule (remove the unused mutation, or call it with the recap kill total and raise/drop the 64 bound against MAX_ENEMIES + summon caps) — do not start using killCount as a second XP axis.  
AUTONOMY: REPORT_ONLY  
DEPENDENCIES: LHIPS-2026-10-23-002 (player summon cap); LHIPS-2026-08-31-001 (XP wall)  
REGRESSION_RISK: HIGH if victory starts calling `saveKillCount` with an uncapped summon kill total. LOW for documentation.  
VALIDATION_REQUIRED: `SAVE_KILL_COUNT_CALLED_FROM_PLAY === false`; `SAVE_KILL_COUNT_SINGLE_BATTLE_BOUND === 64`; `report.killCountCounterFrozen.createKillCount === 0`. Re-run `longHorizonSim.test.ts`.  
STATUS: NEW  
