# ACTION_IDs — 2026-09-25 Long-Horizon Infinite Progression Simulator

Durable ledger for implementers and the Report Action Orchestrator.  
Source of every record: Long-Horizon Infinite Progression Simulator.  
Narrative: [`LONG_HORIZON_2026-09-25.md`](./LONG_HORIZON_2026-09-25.md).  
Harness: `src/frontend/src/utils/longHorizonSim.ts`.

Do not implement gameplay from this file unless a later human or orchestrator explicitly picks an ID. This run ships **observation only** — no curve redesign.

HEAD inspected: `0f5363f` (same as queued `#357` / `#407` / `#475` / `#530`). Stress includes 10000 / 50000 / 100000. Harness **unions** `#357` (INIT / CHC), `#407` (Crush), `#475` (hazards / range), and `#530` (Blood Mend / fail) rather than overwriting those files. This branch restacks onto `#530` so oldest-first merge-tree stays clean.

## Still-open IDs (not re-filed)

| ACTION_ID | STATUS | Notes |
| :--- | :--- | :--- |
| `LHIPS-2026-08-31-001` | NEW | Exponential XP vs linear kill XP. Practical wall ~15–22. |
| `LHIPS-2026-08-31-002` | NEW | IEEE Infinity of the raw float at 1019. HUD path superseded by 09-01-001. |
| `LHIPS-2026-08-31-003` | NEW | Enemy `maxTier = floor(999/tierSize)`. Player 2500+ is 100% under-level. Confirmed at 10000 / 50000 / 100000. |
| `LHIPS-2026-08-31-004` | NEW | RES/SR hit 100; player SP does not scale. Rook RES 100 at 78. |
| `LHIPS-2026-08-31-005` | NEW | Three HP formulas; victory floor exceeds maxHp at 10 on this HEAD. Queued `#386` caps the floor; not merged. Unused exponential HP is JSON-null from **14500**. |
| `LHIPS-2026-08-31-006` | NEW | 30% uniform AI 1–10; saturates ~901. Betrayal leak ~3% at level 1. |
| `LHIPS-2026-08-31-007` | NEW | `buildEnemyKit(currentMap.levelZone)` still passes an object. `setCurrentZoneTier` at WX 4680 is unused by kits. |
| `LHIPS-2026-08-31-008` | NEW | All 32 starters owned at create. `shouldIncludeBackendSpellInLibrary` only hides retired ids. |
| `LHIPS-2026-08-31-009` | NEW | Summoner 100% at player 44. |
| `LHIPS-2026-08-31-010` | NEW | Boss combat HP static (~350). Guide `1.08^diff` not applied. |
| `LHIPS-2026-08-31-011` | NEW | Challenge under-30 / under-50 fail on one hit at 14 / 24 (spawn placeholder `L*2+3`). |
| `LHIPS-2026-08-31-012` | NEW | Jackpot table unchanged. Persist 100k-capped. |
| `LHIPS-2026-08-31-013` | NEW | Level-skip claim closed (level is frozen on `saveBattleStats`). AP/MP remainder is 09-01-003. |
| `LHIPS-2026-08-31-014` | NEW | No player telemetry. |
| `LHIPS-2026-09-01-001` | NEW | HUD saturates at MAX_SAFE from 48. |
| `LHIPS-2026-09-01-002` | NEW | applyRewards 100k/500k vs jackpot and Void+boost XP. Dungeon-pack XP clamp is enemy 1924 (past spawn cap). |
| `LHIPS-2026-09-01-003` | NEW | Formula AP 21 at 325 vs persist 20. Persist is formula-aware until 20 (`persistApWriteCap`); battle still uses unbounded `getPlayerBaseStats`. |
| `LHIPS-2026-09-01-004` | NEW | Leftover Nat / Motoko pow2 / Number leftover. |
| `LHIPS-2026-09-02-001` | NEW | GameKey redeem up to 10M Doka outside applyRewards 100k. Death then cuts 40% of the wallet. |
| `LHIPS-2026-09-02-002` | NEW | `upgradeSpell` `10*2^n` outruns combat Doka at 14, GameKey at 20, Number at 50. |
| `LHIPS-2026-09-21-001` | NEW | Frozen create INIT 10 vs scaling enemy INIT. Queued `#357`; not re-filed. |
| `LHIPS-2026-09-21-002` | NEW | Enemy CHC saturates at 100 from bishop 115. Queued `#357`; not re-filed. |
| `LHIPS-2026-09-22-001` | NEW | Unenraged fallback Crush one-shots over-level packs at 1–10, then cannot threaten 999-capped packs after ~378. Queued `#407`; not re-filed. Enrage ×6 is 09-25-001. |
| `LHIPS-2026-09-23-001` | NEW | Flat lava 8–15 / spikes 5–10 / poison 4 vs linear HP. Queued `#475`; not re-filed. |
| `LHIPS-2026-09-23-002` | NEW | `maxSpellRange` 5 homogenizes starter ranges by 40. Queued `#475`; not re-filed. |
| `LHIPS-2026-09-24-001` | NEW | Flat Blood Mend 12 vs linear HP. Queued `#530`; not re-filed. Potion *fraction* stays 30/70%; potion *cost* is 09-25-002. |
| `LHIPS-2026-09-24-002` | NEW | Spell-fail 20% − 0.1%/level hits 0 at 201; Strike never rolls it. Queued `#530`; not re-filed. |
| `AQA-2026-08-30-012` | NEW | Collectors still missing. |

This file adds IDs only where a long-horizon failure was in-scope and never filed (betrayal enrage 6× Crush/HP; BuffShop flat absorb / flat potion Doka cost).

---

ACTION_ID: LHIPS-2026-09-25-001  
SOURCE_AUTOMATION: Long-Horizon Infinite Progression Simulator  
TITLE: Betrayal enrage 6× reopens Crush one-shots through player 2361 and 6× HP vs flat kits  
CATEGORY: enemy-stats  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Fallback melee multiplies Crush/Fire Bolt by `enragedEnemies.has(enemyId) ? 6 : 1` (`src/frontend/src/components/WorldExploration.tsx` 16257, 16710–16720) before the two create-RES 10% passes (`16722–16728` then `playerTakesDamage` 3424–3432). Enrage is set only after a betrayal kill: `aiTier >= 10` and `Math.random() < 0.05` (`15594–15598`); the betrayer’s `hp`/`maxHp` are also `* 6` (`15638–15646`). `computeAITier` still leaks tier 10 on the 30% uniform roll (`combatMath.ts` 36–51) — this run P(tier 10) = 0.032 at enemy 1 and 0.734 at 901. Harness: `BETRAYAL_ENRAGE_MULT === 6` (`longHorizonSim.ts` 422); `firstEnemyLevelEnragedCrushOneShots(1) === 9` (recv 107 vs HP 100); `(10) === 13`; unenraged 09-22 thresholds stay 52 / 75. Enraged recv at spawn cap 1020 is **11897** (`damageAfterPlayerResPasses(fallbackCrushRawEnraged(1020))`); `firstPlayerLevelSurvivesCrushRecv` is **2361** (HP 11900). At player 2500 (100% under-level, 003) cap recv is still 94% of 12595. Unenraged cap recv stays 1983 (09-22-001). Betrayer HP at 1020 is `linearEnemyMaxHp(1020) * 6 === 15582` vs Strike 10 / Frost 20. Hunter / guardian / bomber summons (80 / 120 / 50, `gameConstants.ts` 71–78) die to **unenraged** Crush 192 at enemy 80 (`fallbackCrushVsSummon`, one RES pass, summon `res` 0).  
FIRST_APPROXIMATE_PROBLEM_LEVEL: 1 (tier-10 leak ~3%; enraged Crush one-shots from enemy 9; this run’s player-1 max enemy is 79, recv 933). Inverse “still a one-shot at the 999 cap” holds through player **2360**. Official XP wall (001) still arrives first for character leveling; 2361 is synthetic under kill income.  
CAUSE: Betrayal enrage is a flat ×6 on a linear `L/5` Crush and on linear enemy HP. Player HP is a different linear. Enemy level is independently capped near 1020. 09-22 measured only `enrageMultiplier = 1`. The 5% / tier-10 gate was never paired to that cap or to create RES 10.  
PLAYER_EFFECT: A rare early betrayal turns an already-over-level pack (003) into an instant kill from enemy 9+ instead of 52+. Late synthetic packs (901+, ~73% betrayal-eligible) can arm a 11897 hit and a 15582-HP body against zone-0 kits (007) and Blood Mend 12 (09-24-001). After 2361 the same cap crush is a large chip, then a small one by 100000 — same slope inversion as 09-22, shifted ~6× later.  
TECHNICAL_EFFECT: No Number overflow at the live cap (recv 11897). A hypothetical enemy 100000 cannot spawn; raw would be `12*(100000/5)*6 = 1.44e6`. Extra combatants from summoner 100% at 44 (009) add more betrayal targets, not more player HP.  
SYSTEMS_AFFECTED: WorldExploration betrayal gate; `enragedEnemies`; fallback Crush/Fire Bolt; `playerTakesDamage` RES; `pickEnemyLevelFromTiers`; linear `maxHp`; player/enemy summons  
RECOMMENDED_ACTION: Report only. Do not retune Crush, enrage, or spawn here. If a human picks this ID, pair the ×6 with the 999 cap and the linear HP curve — do not raise unenraged `L/5` as a substitute, and do not silently drop the double-RES apply.  
AUTONOMY: REPORT_ONLY  
DEPENDENCIES: LHIPS-2026-09-22-001 (unenraged Crush); LHIPS-2026-08-31-003 (over-level tail / 999 cap); LHIPS-2026-08-31-006 (tier-10 leak); LHIPS-2026-08-31-009 (summoner saturation); LHIPS-2026-08-31-001 (XP wall)  
REGRESSION_RISK: HIGH if the ×6 is removed without a paired betrayal-HP and kit-spell pass (frost stays 20). LOW for documentation.  
VALIDATION_REQUIRED: `firstEnemyLevelEnragedCrushOneShots(1) === 9`; `(10) === 13`; `fallbackCrushRawEnraged(80) === 1152`; enraged recv at 1020 === 11897; `firstPlayerLevelSurvivesCrushRecv(11897) === 2361`; betrayal still requires `aiTier >= 10` and 5%. Re-run `longHorizonSim.test.ts` and `longHorizonSim.fallback.test.ts`.  
STATUS: NEW  

---

ACTION_ID: LHIPS-2026-09-25-002  
SOURCE_AUTOMATION: Long-Horizon Infinite Progression Simulator  
TITLE: BuffShop Shield Charm stays 20 and potion Doka costs stay 50/120 while linear HP grows  
CATEGORY: economy  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Shield Charm writes `shieldHpRef.current = 20` (`src/frontend/src/components/WorldExploration.tsx` 3583–3585) and costs 100 Doka (`BuffShop.tsx` 64–70). Crush recv exceeds 20 from enemy **11** (`firstEnemyLevelCrushExceedsShield === 11`, `longHorizonSim.ts` 462–473) — this run’s mean enemy at player 1 is 10.9 (max 79). Enraged Crush at 80 is recv 933 (001). Health / Greater potions restore `floor(maxHp * 0.3)` / `0.7` (`WorldExploration.tsx` 3558–3571) but cost **50 / 120 forever** (`BuffShop.tsx` 31–46). Harness: `healthPotionHpRestored(1) === 30` (1.67 Doka/HP); `(100) === 178` (0.28); `(1000) === 1528` (0.033); `(100000) === 150028` (0.00033). One `applyRewards` jackpot ceiling (100_000) buys **2000** health potions. Battle Elixir +3 AP / Swift Boots +2 MP / Fury +25% for 3 turns stay flat (`3575–3588`; costs 80 / 90 / 150). Fury is +2.5 on Strike 10 (`spellData.ts` 16) because `calcScaledDamage` ignores caster level (004). Death then cuts 40% of the **wallet**, not of potion stock (`deathPenalty.ts` 12; `deathDokaLost(10_000_000) === 4_000_000`).  
FIRST_APPROXIMATE_PROBLEM_LEVEL: 1 (Shield already loses to Crush from enemy 11, inside the documented 003 over-level tail). Potion Doka/HP has already dropped 6× by 100; 50× by 1000. Official XP wall (001) still arrives first for character leveling.  
CAUSE: BuffShop effects were authored as tutorial integers and percents of `maxHp`. Crush/`L/5` and linear HP grew independently. Potion *heal* was later written as a fraction; potion *price* was not. Shield never became a fraction of incoming damage or of maxHp.  
PLAYER_EFFECT: Early Shield Charm is a 20-HP sponge against Crush 10–20 and is already useless against the mean over-level tail. Late synthetic HP makes a 50-Doka potion a near-full-bar (1528 / 5095 at 1000) while Blood Mend stays 12 (09-24-001) and Crush-without-enrage is a chip after ~378 (09-22). Combat elixir/fury/boots never become late-game tools.  
TECHNICAL_EFFECT: No Number overflow (max greater-potion heal at 100000 is 350066). `ctx.heal` / potion writes clamp to `maxHp`. Challenge `healUsed` still flags a 30%-of-max potion, so no-heal feats fail harder as HP grows.  
SYSTEMS_AFFECTED: BuffShop catalog; Shield Charm; health / greater potions; Fury / Elixir / Boots; linear `maxHp`; fallback Crush; challenge healUsed; Doka wallet / death 40%  
RECOMMENDED_ACTION: Report only. Do not retune BuffShop prices, Shield 20, or Crush here. If a human picks this ID, pair combat-item absorbs and potion prices with the linear HP curve (or keep potions as the documented percent heal and price them as a fraction of a published Doka ceiling) — do not raise Crush/`L/5` as a substitute.  
AUTONOMY: REPORT_ONLY  
DEPENDENCIES: LHIPS-2026-09-24-001 (Blood Mend vs the same linear HP; potions already called out as the scaling heal); LHIPS-2026-09-25-001 (enraged Crush vs Shield 20); LHIPS-2026-09-22-001 (unenraged Crush); LHIPS-2026-09-02-001 (GameKey wallet / death 40%); LHIPS-2026-08-31-001 (XP wall)  
REGRESSION_RISK: HIGH if potion heals are switched off percent-of-HP without a paired no-heal challenge pass, or if Shield becomes percent-of-Crush without a tutorial pass. LOW for documentation.  
VALIDATION_REQUIRED: `firstEnemyLevelCrushExceedsShield() === 11`; `healthPotionHpRestored(1) === 30`; `healthPotionDokaPerHp(1000) < healthPotionDokaPerHp(1)`; `deathDokaLost(10_000_000) === 4_000_000`; Shield write is 20. Re-run `longHorizonSim.test.ts`.  
STATUS: NEW  
