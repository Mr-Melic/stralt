# ACTION_IDs — 2026-09-24 Long-Horizon Infinite Progression Simulator

Durable ledger for implementers and the Report Action Orchestrator.  
Source of every record: Long-Horizon Infinite Progression Simulator.  
Narrative: [`LONG_HORIZON_2026-09-24.md`](./LONG_HORIZON_2026-09-24.md).  
Harness: `src/frontend/src/utils/longHorizonSim.ts`.

Do not implement gameplay from this file unless a later human or orchestrator explicitly picks an ID. This run ships **observation only** — no curve redesign.

HEAD inspected: `0f5363f` (same as queued `#357` / `#407` / `#475`). Stress includes 10000 / 50000 / 100000. Harness **unions** `#357` (INIT / CHC), `#407` (Crush), and `#475` (hazards / range) rather than overwriting those files. This branch restacks onto `#475` (which already contains `#357` and `#407`) so oldest-first merge-tree stays clean.

## Still-open IDs (not re-filed)

| ACTION_ID | STATUS | Notes |
| :--- | :--- | :--- |
| `LHIPS-2026-08-31-001` | NEW | Exponential XP vs linear kill XP. Practical wall ~15–22. |
| `LHIPS-2026-08-31-002` | NEW | IEEE Infinity of the raw float at 1019. HUD path superseded by 09-01-001. |
| `LHIPS-2026-08-31-003` | NEW | Enemy `maxTier = floor(999/tierSize)`. Player 2500+ is 100% under-level. Confirmed at 10000 / 50000 / 100000. |
| `LHIPS-2026-08-31-004` | NEW | RES/SR hit 100; player SP does not scale. Rook RES 100 at 78. |
| `LHIPS-2026-08-31-005` | NEW | Three HP formulas; victory floor exceeds maxHp at 10 on this HEAD. Queued `#386` caps the floor; not merged. Unused exponential HP is JSON-null from **14500**. |
| `LHIPS-2026-08-31-006` | NEW | 30% uniform AI 1–10; saturates ~901. |
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
| `LHIPS-2026-09-02-001` | NEW | GameKey redeem up to 10M Doka outside applyRewards 100k. |
| `LHIPS-2026-09-02-002` | NEW | `upgradeSpell` `10*2^n` outruns combat Doka at 14, GameKey at 20, Number at 50. |
| `LHIPS-2026-09-21-001` | NEW | Frozen create INIT 10 vs scaling enemy INIT. Queued `#357`; not re-filed. |
| `LHIPS-2026-09-21-002` | NEW | Enemy CHC saturates at 100 from bishop 115. Queued `#357`; not re-filed. |
| `LHIPS-2026-09-22-001` | NEW | Fallback Crush one-shots over-level packs at 1–10, then cannot threaten 999-capped packs after ~378. Queued `#407`; not re-filed. |
| `LHIPS-2026-09-23-001` | NEW | Flat lava 8–15 / spikes 5–10 / poison 4 vs linear HP. Queued `#475`; not re-filed. |
| `LHIPS-2026-09-23-002` | NEW | `maxSpellRange` 5 homogenizes starter ranges by 40. Queued `#475`; not re-filed. |
| `AQA-2026-08-30-012` | NEW | Collectors still missing. |

This file adds IDs only where a long-horizon failure was in-scope and never filed (flat Blood Mend vs linear HP; spell-fail linear decay to 0).

---

ACTION_ID: LHIPS-2026-09-24-001  
SOURCE_AUTOMATION: Long-Horizon Infinite Progression Simulator  
TITLE: Flat Blood Mend 12 ignores linear HP; shop potions are the only heal that scales  
CATEGORY: spells  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Blood Mend is `healAmount: 12` (`src/frontend/src/data/spellData.ts` 85–95). `resolvePlayerCast` (`src/frontend/src/engine/spellEngine.ts` 655–663) uses that integer, optional `healRecv`, then crit ×2 on create CHC 5% (`startingChampionStats.ts` 19). It does **not** call `calcScaledDamage` / `1.03^upgrade` (that path is damage-only, `combatMath.ts` 130–137). Live max HP is `floor(100 * (1 + (L-1)*0.05))` (`WorldExploration.tsx` 3400–3406). Harness: `firstLevelHazardMaxBelowHpPercent(12, 0.05) === 30`; `(12, 0.01) === 222`; crit 24 drops under 5% from **78**. Mend / HP = 0.12 at 1, 0.020 at 100, 0.0024 at 1000, 0.000024 at 100000. Out-of-battle regen is `+1` / 10s (`WorldExploration.tsx` 3617–3624). Health potions are `floor(maxHp * 0.3)` / `0.7` (`3558–3571`) and stay a constant fraction. Player Life Drain’s live return is `0.5 * scaled(10)` (`castHelpers.ts` 474–478) — ~5 at upgrade 0, ~15 at spell 14 (already unbuyable from combat Doka, 09-02-002) — same collapse class. Crush recv at the spawn cap is still 1983 (09-22-001); 12 HP cannot close a tutorial one-shot or a late chip. All 32 starters are already owned (008).  
FIRST_APPROXIMATE_PROBLEM_LEVEL: 30 (Blood Mend drops under 5% of linear HP). Under 1% from 222. Official XP wall (001) still arrives first for character leveling; this is a recovery collapse on the same linear HP 09-22 Crush and 09-23 lava already used.  
CAUSE: Spell heals are unscaled catalog integers. Player HP is a different linear. Shop potions were later written as percents of `maxHp`. The three were never paired, and heal is excluded from the +3%/upgrade damage curve.  
PLAYER_EFFECT: Early Blood Mend is a real 12% (24% on the rare crit). From the 30s it is a chip; from the 200s it is HUD noise. Late synthetic fights already have Crush-trivial defense after ~378 and zone-0 kits (007); the owned heal cannot reopen a threat window. Potions remain the only official recover-by-fraction tool.  
TECHNICAL_EFFECT: No Number overflow (max 24). `ctx.heal` clamps to `maxHp` (`WorldExploration.tsx` 9185–9190). Challenge `healUsed` still records a 12-HP restore, so no-heal feats can fail on a mend that no longer moves the pool.  
SYSTEMS_AFFECTED: Blood Mend; `resolvePlayerCast` heal branch; live linear `maxHp`; shop potions; passive regen; challenge healUsed  
RECOMMENDED_ACTION: Report only. Do not retune heal, HP, or potions here. If a human picks this ID, pair combat heals with the linear HP curve — or route them through the same percent-of-max path potions already use — and do not raise Crush/`L/5` as a substitute.  
AUTONOMY: REPORT_ONLY  
DEPENDENCIES: LHIPS-2026-09-22-001 (Crush vs the same linear HP); LHIPS-2026-09-23-001 (flat hazards vs the same HP); LHIPS-2026-08-31-005 (HP formula split); LHIPS-2026-08-31-008 (heal already owned); LHIPS-2026-08-31-001 (XP wall)  
REGRESSION_RISK: HIGH if Blood Mend is switched to percent-of-HP without a paired no-heal challenge pass. LOW for documentation.  
VALIDATION_REQUIRED: `healAmount === 12`; `firstLevelHazardMaxBelowHpPercent(12, 0.05) === 30`; `=== 222` at 1%; potions use `maxHp * 0.3 / 0.7`; resolvePlayerCast heal does not call `calcScaledDamage`. Re-run `longHorizonSim.test.ts`.  
STATUS: NEW  

---

ACTION_ID: LHIPS-2026-09-24-002  
SOURCE_AUTOMATION: Long-Horizon Infinite Progression Simulator  
TITLE: Spell-fail 20% − 0.1%/level hits 0 at 201; Strike never rolls it  
CATEGORY: spells  
PRIORITY: P3  
CONFIDENCE: HIGH  
EVIDENCE: Live chance is `max(0, spellFailBaseChance - (level-1) * spellFailReductionPerLevel)` with defaults 20 and 0.1 (`src/frontend/src/types/gameTypes.ts` 417–423; `WorldExploration.tsx` 3646–3649). `resolvePlayerCast` (`src/frontend/src/engine/spellEngine.ts` 642–651) rolls `rng()*100 < spellFailChance` only when `!isPhysical`. Strike sets `isPhysical: true` (`spellData.ts` 20). Harness: `firstLevelSpellFailHitsZero() === 201`; `spellFailChance(15) === 18.6`; `spellFailChance(101) === 10`; `spellFailChance(201) === 0` and stays 0 through 100000. Enemy/summon `resolveSpellCast` uses a different `caster.stats.fail` field (`spellEngine.ts` 428–431), not this curve. Admin can edit the two knobs (`adminSafety.ts` 523–526) but the live default is the linear decay to zero.  
FIRST_APPROXIMATE_PROBLEM_LEVEL: 201 (fail hits 0). Half-rate at 101. Official XP wall (001) still arrives first; 201 is synthetic under kill income. At the practical wall (15) fail is still 18.6%.  
CAUSE: Fail is a linear subtract with no floor above 0 and no pairing to the exponential XP curve or to physical vs magical identity. Strike is exempt, so the gate never applied to the zone-0 physical kit (007) anyway.  
PLAYER_EFFECT: Past 201, every non-physical starter always lands (range already homogenized by 40 — 09-23-002). Combined with 008 there is no late-game miss identity left to discover. Strike was never in the pool.  
TECHNICAL_EFFECT: No overflow (`Math.max(0, …)`). HUD prints `toFixed(1)` (`WorldExploration.tsx` 18560). A stored level 201+ with leftover XP still computes 0 without a NaN.  
SYSTEMS_AFFECTED: `spellFailChance`; `resolvePlayerCast` fail roll; Strike `isPhysical`; Admin level-up knobs  
RECOMMENDED_ACTION: Report only. Do not raise the reduction or add a floor here. If a human wants fail to remain defined at any level, pair a floor / relative-to-content function with the existing 20% start — and document that Strike stays exempt.  
AUTONOMY: REPORT_ONLY  
DEPENDENCIES: LHIPS-2026-08-31-001 (XP wall makes 201 synthetic); LHIPS-2026-08-31-007 (zone-0 Strike already bypasses); LHIPS-2026-09-23-002 (range already collapsed by 40)  
REGRESSION_RISK: HIGH if `isPhysical` is removed from the fail skip without a Strike retune. LOW for documentation.  
VALIDATION_REQUIRED: `spellFailChance(1) === 20`; `spellFailChance(201) === 0`; `firstLevelSpellFailHitsZero() === 201`; Strike `isPhysical === true`. Re-run `longHorizonSim.test.ts`.  
STATUS: NEW  
