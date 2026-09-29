# ACTION_IDs — 2026-09-29 Long-Horizon Infinite Progression Simulator

Durable ledger for implementers and the Report Action Orchestrator.  
Source of every record: Long-Horizon Infinite Progression Simulator.  
Narrative: [`LONG_HORIZON_2026-09-29.md`](./LONG_HORIZON_2026-09-29.md).  
Harness: `src/frontend/src/utils/longHorizonSim.ts`.

Do not implement gameplay from this file unless a later human or orchestrator explicitly picks an ID. This run ships **observation only** — no curve redesign.

HEAD inspected: `0f5363f` (same as queued `#357` / `#407` / `#475` / `#530` / `#560` / `#637` / `#670` / `#748`). Stress includes 10000 / 50000 / 100000. Harness **unions** `#748` (Boss Rush / MP / Frost TTK) rather than overwriting those files. This branch restacks onto `#748` so oldest-first merge-tree stays clean.

## Still-open IDs (not re-filed)

| ACTION_ID | STATUS | Notes |
| :--- | :--- | :--- |
| `LHIPS-2026-08-31-001` | NEW | Exponential XP vs linear kill XP. Practical wall ~15–22. |
| `LHIPS-2026-08-31-002` | NEW | IEEE Infinity of the raw float at 1019. HUD path superseded by 09-01-001. |
| `LHIPS-2026-08-31-003` | NEW | Enemy `maxTier = floor(999/tierSize)`. Player 2500+ is 100% under-level. Confirmed at 10000 / 50000 / 100000. Boss Rush bypass is 09-28-001. Catalog world-boss `player+5` stat rolls are 09-29-001. |
| `LHIPS-2026-08-31-004` | NEW | RES/SR hit 100; player SP does not scale. Rook RES 100 at 78. Catalog bosses inherit that roll at `player+5` (09-29-001). |
| `LHIPS-2026-08-31-005` | NEW | Three HP formulas; victory floor exceeds maxHp at 10 on this HEAD. Queued `#386` caps the floor; not merged. Unused exponential HP is JSON-null from **14500**. |
| `LHIPS-2026-08-31-006` | NEW | 30% uniform AI 1–10; saturates ~901. Betrayal leak ~3% at level 1. |
| `LHIPS-2026-08-31-007` | NEW | `buildEnemyKit(currentMap.levelZone)` still passes an object. Display-name rush `pieceType` also misses the table (09-28-001). Catalog bosses use real chess `pieceType` and still get zone-0 kits. |
| `LHIPS-2026-08-31-008` | NEW | All 32 starters owned at create. `shouldIncludeBackendSpellInLibrary` only hides retired ids. |
| `LHIPS-2026-08-31-009` | NEW | Summoner 100% at player 44. |
| `LHIPS-2026-08-31-010` | NEW | Catalog world-boss **HP** static (~350–400). Guide `1.08^diff` not applied. RES/CHC still scale from `player+5` (09-29-001). Rush HP is linear `player+2` (09-28-001). |
| `LHIPS-2026-08-31-011` | NEW | Challenge under-30 / under-50 fail on one hit at 14 / 24 (spawn placeholder `L*2+3`). |
| `LHIPS-2026-08-31-012` | NEW | Jackpot table unchanged. Persist 100k-capped. |
| `LHIPS-2026-08-31-013` | NEW | Level-skip claim closed (level is frozen on `saveBattleStats`). AP/MP remainder is 09-01-003. |
| `LHIPS-2026-08-31-014` | NEW | No player telemetry. |
| `LHIPS-2026-09-01-001` | NEW | HUD saturates at MAX_SAFE from 48. |
| `LHIPS-2026-09-01-002` | NEW | applyRewards 100k/500k vs jackpot and Void+boost XP. Rush two-boss clamp is 09-28-002. Shop Doka-heal vs 100k is 09-29-002. |
| `LHIPS-2026-09-01-003` | NEW | Formula AP 21 at 325 vs persist 20. MP vs the 16-grid is 09-28-003. |
| `LHIPS-2026-09-01-004` | NEW | Leftover Nat / Motoko pow2 / Number leftover. |
| `LHIPS-2026-09-02-001` | NEW | GameKey redeem up to 10M Doka outside applyRewards 100k. Death then cuts 40% of the wallet. |
| `LHIPS-2026-09-02-002` | NEW | `upgradeSpell` `10*2^n` outruns combat Doka at 14, GameKey at 20, Number at 50. |
| `LHIPS-2026-09-21-001` | NEW | Frozen create INIT 10 vs scaling enemy INIT. Queued `#357`; not re-filed. |
| `LHIPS-2026-09-21-002` | NEW | Enemy CHC saturates at 100 from bishop 115. Queued `#357`; not re-filed. Pale Archbishop (bishop) hits it at player **110** (09-29-001). |
| `LHIPS-2026-09-22-001` | NEW | Unenraged fallback Crush one-shots over-level packs at 1–10, then cannot threaten 999-capped packs after ~378. Queued `#407`; not re-filed. |
| `LHIPS-2026-09-23-001` | NEW | Flat lava 8–15 / spikes 5–10 / poison 4 vs linear HP. Queued `#475`; not re-filed. |
| `LHIPS-2026-09-23-002` | NEW | `maxSpellRange` 5 homogenizes starter ranges by 40. Queued `#475`; not re-filed. |
| `LHIPS-2026-09-24-001` | NEW | Flat Blood Mend 12 vs linear HP. Queued `#530`; not re-filed. |
| `LHIPS-2026-09-24-002` | NEW | Spell-fail 20% − 0.1%/level hits 0 at 201; Strike never rolls it. Queued `#530`; not re-filed. |
| `LHIPS-2026-09-25-001` | NEW | Betrayal enrage 6× Crush/HP vs the **capped** pack. Queued `#560`; not re-filed. Uncapped rush enrage is 09-28-001. |
| `LHIPS-2026-09-25-002` | NEW | Shield Charm 20; potion Doka 50/120 forever (% of maxHp). Shop 3 HP/Doka vs that potion is 09-29-002. |
| `LHIPS-2026-09-26-001` | NEW | Enemy kit Strike 10 / Frost 20 stay catalog-flat vs Crush `L/5`. Queued `#637`; not re-filed. |
| `LHIPS-2026-09-26-002` | NEW | Idle +1 HP / 10s vs linear maxHp. Queued `#637`; not re-filed. |
| `LHIPS-2026-09-27-001` | NEW | Player Frost 21 vs 999-capped packs: TTK 62 → 1 as AP dumps. Queued `#670`; not re-filed. Catalog-boss chip-1 TTK is 09-29-001. |
| `LHIPS-2026-09-27-002` | NEW | Catalog summon HP vs Crush `L/5`. Queued `#670`; not re-filed. |
| `LHIPS-2026-09-27-003` | NEW | Shrine 300 vs ground `5+2L`. Queued `#670`; not re-filed. |
| `LHIPS-2026-09-28-001` | NEW | Boss Rush `player+2` ignores 999 cap; enraged Crush one-shots from 11 forever. Queued `#748`; not re-filed. |
| `LHIPS-2026-09-28-002` | NEW | Catalog room Doka unused vs `1.5L` persist. Queued `#748`; not re-filed. |
| `LHIPS-2026-09-28-003` | NEW | Formula MP vs 16×16 grid, saturated at 300. Queued `#748`; not re-filed. |
| `AQA-2026-08-30-012` | NEW | Collectors still missing. |

This file adds IDs only where a long-horizon failure was in-scope and never filed (catalog world-boss HP frozen while `computeEnemyStats(player+5)` still rolls RES/CHC; shop 3 HP/Doka vs linear maxHp and the 100k combat ceiling).

---

ACTION_ID: LHIPS-2026-09-29-001  
SOURCE_AUTOMATION: Long-Horizon Infinite Progression Simulator  
TITLE: Catalog world-boss HP stays ~350 while battle-start stats roll from uncapped player+5, so rook RES hits 100 at player 73 and Frost TTK jumps from 6 to 117 chip-1 turns  
CATEGORY: bosses-dungeons  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Portal bosses spawn at `level: Math.max(1, characterStats.level + 5)` (`WorldExploration.tsx` 6537) with `id: boss_${id}_…` and spawn RES `Math.min(50, baseStats.res)` (6559). `checkBattleTrigger` always runs `computeEnemyStats(e.level, e.pieceType, e.id)` and writes `res` / `sr` / `init` / `sp` / `chc` onto every enemy (11872–11903), including `boss_` ids. Combat HP for `e.id.startsWith("boss_")` then uses `bossConf.baseStats.hp` (11958–11974) — Pale Archbishop **350**, Crimson Countess (rook) **400** (`bossDefaults.ts` 15–32, 51–62). Overworld packs still cap near 1020 (003); Boss Rush HP scales because `boss-rush-` does not match `boss_` (09-28-001). Harness: `worldBossEnemyLevel(73) === 78`; `firstPlayerLevelWorldBossStatCanHit100("rook","res") === 73`; `("bishop","chc") === 110`; `("bishop","res") === 149`. Optimistic Frost vs 350 (no RES) is **9** turns at player 1 and **6** at 73. After a max RES 100 roll, chip-1 TTK is **117** at 73 (`worldBossChip1FrostTurns(73)`), **22** at 1000, **3** at 10000, **1** at 100000. Spawn clamp 50 is not combat RES. Official XP wall (001) still arrives first.  
FIRST_APPROXIMATE_PROBLEM_LEVEL: player **73** for a rook-typed portal boss (Crimson Countess and other `pieceType: "rook"` rows). Bishop always-crit (Pale Archbishop) at **110**. Chip-1 TTK recovers to 1 only at synthetic AP-dump levels (~100000). Unreachable by official kill income past the mid-teens.  
CAUSE: Two authors. Catalog `baseStats` freeze HP (and used to freeze RES at ≤50). Battle-start later always re-rolls `getEnemyBaseStats` from live level. World-boss level is `player+5` with no 999 cap. The `boss_` branch restores HP only.  
PLAYER_EFFECT: 010 said catalog bosses become a 350-HP chip as player AP grows. From 73 a rook-typed portal boss can instead be a chip-1 *target* (117 Frost turns at AP 10) while its own Crush still scales with `player+5`. Pale Archbishop always-crits the player from 110 (09-21-002 on an uncapped `player+5` unit). Rush rooms do not use this HP freeze (09-28-001).  
TECHNICAL_EFFECT: No Number overflow. Combatant `res` after battle start can be 100 while spawn placeholder was ≤50. Guide `1.08^diff` still unused (010).  
SYSTEMS_AFFECTED: `checkBattleTrigger` `boss_` branch; `computeEnemyStats`; `DEFAULT_BOSS_CONFIGS`; Boss Guide; portal-boss spawn  
RECOMMENDED_ACTION: Report only. Do not retune catalog HP, Crush, or the 999 cap here. If a human picks this ID, pick one published rule for portal-boss RES/CHC (keep catalog `baseStats`, or scale HP with the same `player+5` roll) — do not raise overworld maxTier to match `player+5` as a silent side effect. 010 remains the static-HP ID; 004 remains the overworld RES-100 ID; 09-28-001 remains the rush-uncapped-HP ID.  
AUTONOMY: REPORT_ONLY  
DEPENDENCIES: LHIPS-2026-08-31-010 (catalog HP); LHIPS-2026-08-31-004 (RES 100); LHIPS-2026-09-21-002 (CHC 100); LHIPS-2026-08-31-003 (overworld 999 cap); LHIPS-2026-09-28-001 (rush HP path); LHIPS-2026-09-27-001 (Frost AP dump); LHIPS-2026-08-31-001 (XP wall)  
REGRESSION_RISK: HIGH if portal-boss HP is switched to `calcEnemyMaxHp(player+5)` without retuning Crush. HIGH if battle-start stops calling `computeEnemyStats` for `boss_` ids without a paired kit/INIT path. LOW for documentation.  
VALIDATION_REQUIRED: `worldBossEnemyLevel(73) === 78`; `firstPlayerLevelWorldBossStatCanHit100("rook","res") === 73`; `("bishop","chc") === 110`; `playerFrostTurnsToKillHp(350, 73) === 6`; `worldBossChip1FrostTurns(73) === 117`; live `boss_` HP still catalog; live battle-start still overwrites `res`. Re-run `longHorizonSim.test.ts`.  
STATUS: NEW  

---

ACTION_ID: LHIPS-2026-09-29-002  
SOURCE_AUTOMATION: Long-Horizon Infinite Progression Simulator  
TITLE: Shop Doka-to-HP is a flat 3 HP per Doka, so a 50-Doka potion outheals it from player 82 and a full fill from 1 HP exceeds the 100k combat ceiling at 59982  
CATEGORY: economy  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: `paidHealFromLiveWallet` (`itemShop.ts` 261–272) heals `min(hpNeeded, floor(doka * 3))` at `ceil(healHp / 3)` Doka. Live max HP is linear `floor(100 * (1 + (L-1)*0.05))` (`WorldExploration.tsx` / `linearPlayerMaxHp`). BuffShop `health_potion` still costs **50** Doka for **30%** of maxHp (09-25-002). Harness: `dokaHealCostToFillFrom(1, 1) === 33`; `(1000) === 1698`; `(50000) === 83365`; `(59981) === 100000`; `(59982) === 100002`; `(100000) === 166698`. `firstPlayerLevelDokaHealFromOneExceeds(100000) === 59982`. `healthPotionHpRestored(82) === 151` vs 50 Doka × 3 = **150**, so `firstPlayerLevelPotionBeatsFlatDokaHeal() === 82`. GameKey 10M still covers 166698 (09-02-001). Official XP wall (001) still arrives first.  
FIRST_APPROXIMATE_PROBLEM_LEVEL: player **82** for potion vs 3:1 efficiency. Player **59982** for a 1-HP → full fill exceeding one `applyRewards` Doka ceiling. 50000 still fits (83365). Unreachable by official kill income past the mid-teens.  
CAUSE: Shop converter is a constant 3 HP/Doka. Combat persist was later ceilinged at 100k/call. Potions heal a fraction of linear maxHp at a frozen Doka price. Those three were not sized together.  
PLAYER_EFFECT: After 82, the Items 50-Doka potion is the cheaper out-of-battle fill; the HUD Doka-heal button is a worse rate and, from 59982, cannot finish a 1-HP fill from a single clamped combat grant. Death respawn is 50% HP (half the Doka). GameKey wallets can still pay. Potions remain 30/70% of maxHp (09-25-002).  
TECHNICAL_EFFECT: `floor(doka * 3)` at 10M GameKey is 30M, still a safe Number. `toLocaleString` HUD is fine. Linear HP at 59982 is 300005; at 100000 is 500095.  
SYSTEMS_AFFECTED: `paidHealFromLiveWallet`; BuffShop potions; `clampApplyRewardsDeltas`; Doka HUD heal; `applyRewards` 100k  
RECOMMENDED_ACTION: Report only. Do not retune 3 HP/Doka, potion prices, or the 100k ceiling here. If a human picks this ID, pick one published HP-per-Doka rule and pair it with the combat ceiling — do not raise 100k to 166698 as a silent side effect of player 100000. 09-25-002 remains the potion-%-of-maxHp ID; 09-01-002 remains the clamp ID.  
AUTONOMY: REPORT_ONLY  
DEPENDENCIES: LHIPS-2026-09-25-002 (potion % of maxHp / flat Doka); LHIPS-2026-09-01-002 (100k ceiling); LHIPS-2026-09-02-001 (GameKey 10M); LHIPS-2026-08-31-001 (XP wall)  
REGRESSION_RISK: HIGH if shop heal is switched to a % of maxHp without retuning potion overlap. LOW for documentation.  
VALIDATION_REQUIRED: `dokaHealCostToFillFrom(1, 1) === 33`; `(59981) === 100000`; `(59982) === 100002`; `firstPlayerLevelPotionBeatsFlatDokaHeal() === 82`; `paidHealFromLiveWallet` still `floor(doka * 3)`. Re-run `longHorizonSim.test.ts`.  
STATUS: NEW  
