# ACTION_IDs — 2026-10-21 Long-Horizon Infinite Progression Simulator

Durable ledger for implementers and the Report Action Orchestrator.  
Source of every record: Long-Horizon Infinite Progression Simulator.  
Narrative: [`LONG_HORIZON_2026-10-21.md`](./LONG_HORIZON_2026-10-21.md).  
Harness: `src/frontend/src/utils/longHorizonSim.ts`.

Do not implement gameplay from this file unless a later human or orchestrator explicitly picks an ID. This run ships **observation only** — no curve redesign.

HEAD inspected: `0f5363f` (same commit `#357` / `#407` / `#475` / `#530` / `#560` / `#637` / `#670` / `#748` / `#777` inspected). Stress includes 10000 / 50000 / 100000. Harness **unions** `#777` rather than overwriting those files. This branch restacks onto `#777` so oldest-first merge-tree stays clean.

## Still-open IDs (not re-filed)

| ACTION_ID | STATUS | Notes |
| :--- | :--- | :--- |
| `LHIPS-2026-08-31-001` | NEW | Exponential XP vs linear kill XP. Practical wall ~15–22. |
| `LHIPS-2026-08-31-002` | NEW | IEEE Infinity of the raw float at 1019. HUD path superseded by 09-01-001. |
| `LHIPS-2026-08-31-003` | NEW | Enemy `maxTier = floor(999/tierSize)`. Player 2500+ is 100% under-level. |
| `LHIPS-2026-08-31-004` | NEW | RES/SR hit 100; player SP does not scale. Overlay hides that RES (10-21-001). |
| `LHIPS-2026-08-31-005` | NEW | Three HP formulas; victory floor exceeds maxHp at 10. Exponential HP JSON-null from 14500. Linear HP leaves MAX_SAFE at 1.801e15. |
| `LHIPS-2026-08-31-006` | NEW | 30% uniform AI 1–10; saturates ~901. |
| `LHIPS-2026-08-31-007` | NEW | `buildEnemyKit(currentMap.levelZone)` still passes an object. |
| `LHIPS-2026-08-31-008` | NEW | All 32 starters owned at create. |
| `LHIPS-2026-08-31-009` | NEW | Summoner 100% at player 44. |
| `LHIPS-2026-08-31-010` | NEW | Catalog world-boss HP static. RES/CHC still scale (09-29-001). Overlay still shows RES 0 / CHC 2 (10-21-001). |
| `LHIPS-2026-08-31-011` | NEW | Challenge under-30 / under-50 fail on one hit at 14 / 24. |
| `LHIPS-2026-08-31-012` | NEW | Jackpot table unchanged. Persist 100k-capped. |
| `LHIPS-2026-08-31-013` | NEW | Level frozen on `saveBattleStats`. AP/MP remainder is 09-01-003. |
| `LHIPS-2026-08-31-014` | NEW | No player telemetry. |
| `LHIPS-2026-09-01-001` | NEW | HUD saturates at MAX_SAFE from 48. |
| `LHIPS-2026-09-01-002` | NEW | applyRewards 100k/500k vs jackpot and Void+boost XP. |
| `LHIPS-2026-09-01-003` | NEW | Formula AP 21 at 325 vs persist 20. Overlay enemy AP = level (10-21-001). |
| `LHIPS-2026-09-01-004` | NEW | Leftover Nat / Motoko pow2 / Number leftover. |
| `LHIPS-2026-09-02-001` | NEW | GameKey redeem up to 10M Doka outside applyRewards 100k. |
| `LHIPS-2026-09-02-002` | NEW | `upgradeSpell` `10*2^n` outruns combat Doka at 14, GameKey at 20, Number at 50. |
| `LHIPS-2026-09-21-001` | NEW | Frozen create INIT 10 vs scaling enemy INIT. Queued `#357`. |
| `LHIPS-2026-09-21-002` | NEW | Enemy CHC saturates at 100 from bishop 115. Overlay still paints CHC 2 (10-21-001). |
| `LHIPS-2026-09-22-001` | NEW | Unenraged fallback Crush one-shots. Queued `#407`. |
| `LHIPS-2026-09-23-001` | NEW | Flat lava/spikes/poison vs linear HP. Queued `#475`. |
| `LHIPS-2026-09-23-002` | NEW | `maxSpellRange` 5 homogenizes starter ranges by 40. Queued `#475`. |
| `LHIPS-2026-09-24-001` | NEW | Flat Blood Mend 12 vs linear HP. Queued `#530`. |
| `LHIPS-2026-09-24-002` | NEW | Spell-fail hits 0 at 201. Queued `#530`. |
| `LHIPS-2026-09-25-001` | NEW | Betrayal enrage 6× Crush. Queued `#560`. |
| `LHIPS-2026-09-25-002` | NEW | Shield Charm 20; potion Doka 50/120 forever. Queued `#560`. |
| `LHIPS-2026-09-26-001` | NEW | Kit Strike/Frost stay catalog-flat vs Crush. Crit Frost still loses from 17 (10-21-001). |
| `LHIPS-2026-09-26-002` | NEW | Idle +1 HP / 10s vs linear maxHp. Queued `#637`. |
| `LHIPS-2026-09-27-001` | NEW | Player Frost vs 999-capped packs. Queued `#670`. |
| `LHIPS-2026-09-27-002` | NEW | Catalog summon HP vs Crush. Queued `#670`. |
| `LHIPS-2026-09-27-003` | NEW | Shrine 300 vs ground `5+2L`. Queued `#670`. |
| `LHIPS-2026-09-28-001` | NEW | Boss Rush `player+2` ignores 999 cap. Queued `#748`. |
| `LHIPS-2026-09-28-002` | NEW | Catalog room Doka unused vs `1.5L` persist. Queued `#748`. |
| `LHIPS-2026-09-28-003` | NEW | Formula MP vs 16×16 grid. Queued `#748`. |
| `LHIPS-2026-09-29-001` | NEW | Catalog world-boss HP frozen while `computeEnemyStats(player+5)` rolls RES/CHC. Overlay still shows RES 0 (10-21-001). |
| `LHIPS-2026-09-29-002` | NEW | Shop 3 HP/Doka vs potion % and 100k ceiling. Queued `#777`. |
| `AQA-2026-08-30-012` | NEW | Collectors still missing. |

This file adds IDs only where a long-horizon failure was in-scope and never filed (initiative overlay AP = enemy level + hardcoded RES 0 / CHC 2; create-time evasion / resilience / SR never enter combat).

---

ACTION_ID: LHIPS-2026-10-21-001  
SOURCE_AUTOMATION: Long-Horizon Infinite Progression Simulator  
TITLE: Initiative overlay sets enemy AP/MP/ATK from live level and hardcodes RES 0 / SP 0 / CHC 2, so the strip never shows battle-start RES/CHC and AP dumps to 1020 / 100005  
CATEGORY: technical-limits  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `battleTurnOrderForUi` (`WorldExploration.tsx` 17387–17412) spreads `resolveEnemyApMp(e, c.level)` then overwrites `atk: e.level * 2`, `res: 0`, `sp: 0`, `chc: 2`. `resolveEnemyApMp` for a non-summon (`summonIntegration.ts` 206–209) is `ap: enemy.level`, `mp: max(1, floor(level/2))`. InitiativeStrip / BattleUIPanel read those fields (`InitiativeStrip.tsx` 597; `BattleUIPanel.tsx` 354–356). Battle-start still writes rolled `res`/`sr`/`init`/`sp`/`chc` onto the enemy (`WorldExploration.tsx` 11872–11903) and AI still takes one action per turn (`enemyAI.ts` has no AP budget). Harness: `overlayEnemyAp(9) === 9` (first time overlay AP exceeds player formula AP 8); `overlayEnemyAp(1020) === 1020`, `overlayEnemyMp(1020) === 510`, `overlayEnemyAtk(1020) === 2040`; world-boss `player+5` at 100000 is AP **100005**. Overlay CHC stays 2 while bishop combat CHC hits 100 at 115 (09-21-002) and rook combat RES hits 100 at 78 (004 / 09-29-001). Always-crit kit Frost (40) still loses to Crush from enemy **17** (`firstEnemyLevelCrushExceedsCritKit(20) === 17`). Official XP wall (001) still arrives first.  
FIRST_APPROXIMATE_PROBLEM_LEVEL: enemy **9** for overlay AP > player AP 8 (already in a level-1 pack whose mean is ~11). Combat-stat lie is visible once rook RES would be 100 (enemy 78 / portal player 73) because the strip still paints 0. World-boss player 100000 shows 100005 AP. Unreachable by official kill income past the mid-teens.  
CAUSE: Display helper treats enemy level as an AP pool. Overlay then replaces live battle-start RES/SP/CHC with constants. AI never spends that AP. Those three authors were not sized together.  
PLAYER_EFFECT: The turn strip reports a resource dump and a 2% crit chance at every horizon. A rook-typed portal boss that is actually RES 100 / chip-1 (09-29-001) still reads as RES 0. Bishop always-crit (09-21-002) still reads as CHC 2. Role identity on the HUD collapses to “big AP number.” Combat is unchanged: one Crush / one kit cast per turn.  
TECHNICAL_EFFECT: Overlay AP at 100005 is a safe Number (`toLocaleString` fine). Linear HP first leaves MAX_SAFE at **1801439850948180** (`firstLevelLinearHpNotSafeInteger`). No RAF / AI extra work — the dump is display-only.  
SYSTEMS_AFFECTED: `resolveEnemyApMp`; `battleTurnOrderForUi`; InitiativeStrip; BattleUIPanel; `computeEnemyStats` visibility  
RECOMMENDED_ACTION: Report only. Do not retune Crush, overlay AP, or the 999 cap here. If a human picks this ID, pick one published rule for enemy AP/MP display (catalog budget vs battle-start stats vs hide) and stop overwriting live RES/CHC — do not start spending overlay AP as a silent AI multi-act. 004 / 09-21-002 / 09-29-001 remain the combat RES/CHC IDs.  
AUTONOMY: REPORT_ONLY  
DEPENDENCIES: LHIPS-2026-08-31-004 (RES 100); LHIPS-2026-09-21-002 (CHC 100); LHIPS-2026-09-29-001 (portal-boss overwrite); LHIPS-2026-09-01-003 (player AP persist 20); LHIPS-2026-08-31-001 (XP wall)  
REGRESSION_RISK: HIGH if overlay AP is wired into the AI loop without a paired action cap. HIGH if hardcoded RES 0 is removed without reading battle-start `e.res`. LOW for documentation.  
VALIDATION_REQUIRED: `overlayEnemyAp(9) === 9`; `overlayEnemyAp(1020) === 1020`; `worldBossEnemyLevel(100000)` overlay AP 100005; live `battleTurnOrderForUi` still sets `res: 0`, `chc: 2`; AI still one action. Re-run `longHorizonSim.test.ts`.  
STATUS: NEW  

---

ACTION_ID: LHIPS-2026-10-21-002  
SOURCE_AUTOMATION: Long-Horizon Infinite Progression Simulator  
TITLE: Create-time evasion 5, resilience 8, and SR 5 are persisted and shown, but no combat path reads them, so they cannot answer CHC 100 or Crush while RES 10 stays the only live defense  
CATEGORY: enemy-stats  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Starter caps (`main.mo` 189–194) freeze `evasion <= 5`, `resilience <= 8`, `sr <= 5`, `chc <= 5`. `saveBattleStats` writes only `atk` / `res` (defense) / `init` (`main.mo` 2059–2066) — evasion, resilience, SR, and CHC cannot rise after create. Frontend combat: `playerTakesDamage` applies only RES (`WorldExploration.tsx` 3429–3432). Incoming enemy spells reduce with `characterStats.sp` labeled as SP, not `characterStats.sr` (`16475–16535`, combat log `-${spR} SP`). Crit is `Math.random()*100 < (enemy.chc ?? 2)` with no evasion subtract (`16470–16472`). Player crit is `characterStats.chc` (create 5) with no evasion interaction (`spellEngine.ts` 90). Grep of `src/frontend` combat modules has zero reads of `.evasion` / `.resilience`. HUD still prints SR as a percent (`WorldExploration.tsx` 18535–18537). Harness: `PLAYER_CREATE_EVASION === 5`, `PLAYER_CREATE_RESILIENCE === 8`, `PLAYER_CREATE_SR === 5`, `combatReadsEvasion === false`, `incomingEnemySpellUsesPlayerSpAsSr === true`. Bishop combat CHC 100 at 115 (09-21-002) therefore cannot miss. Crush still one-shots from 52 / 75 (09-22-001) with evasion unused. Official XP wall (001) still arrives first.  
FIRST_APPROXIMATE_PROBLEM_LEVEL: **1** (the fields never apply). The lie becomes the only remaining “defense” identity once enemy CHC hits 100 (bishop 115 / Pale Archbishop player 110) and RES hits 100 (rook 78). Unreachable by official kill income past the mid-teens.  
CAUSE: CharacterStats kept 12 fields including evasion/resilience/SR. Combat reduction was later implemented as RES (+ SP misused as incoming SR). Crit was implemented as a raw CHC roll. Persist freeze then locked the unused fields at create.  
PLAYER_EFFECT: The HUD shows SR 5% and create CHC 5% as if they were live knobs. They do not reduce Crush, do not reduce kit Frost, and do not stop always-crit. The only scaling enemy offense (Crush `L/5`, CHC, INIT) is answered only by frozen RES 10 and frozen INIT 10 (09-21-001). Evasion/resilience are dead weight at every horizon.  
TECHNICAL_EFFECT: No overflow. Candid still ships the two Nats on every character write/read. `saveBattleStats` cannot raise them even if a custom client tried.  
SYSTEMS_AFFECTED: CharacterStats; `saveBattleStats`; `playerTakesDamage`; enemy kit crit roll; HUD SR/CHC row; startingChampionStats  
RECOMMENDED_ACTION: Report only. Do not wire evasion into the crit roll or start scaling SR here. If a human picks this ID, pick one published rule (use the fields in combat, or stop displaying them as live percents) — do not add an evasion dodge on top of RES 100 without retuning Crush. 004 remains player-SP-does-not-scale; 09-21-001 remains INIT; 09-21-002 remains enemy CHC 100.  
AUTONOMY: REPORT_ONLY  
DEPENDENCIES: LHIPS-2026-08-31-004; LHIPS-2026-09-21-001; LHIPS-2026-09-21-002; LHIPS-2026-09-22-001; LHIPS-2026-08-31-001  
REGRESSION_RISK: HIGH if evasion is subtracted from enemy CHC without a paired always-crit retune. HIGH if HUD SR is switched to feed `playerTakesDamage` without noticing incoming spells currently use SP. LOW for documentation.  
VALIDATION_REQUIRED: `PLAYER_CREATE_EVASION === 5`; create SR 5; `saveBattleStats` payload has no evasion/resilience/sr/chc; incoming spell path still reads `characterStats.sp`; crit roll still has no evasion. Re-run `longHorizonSim.test.ts`.  
STATUS: NEW  
