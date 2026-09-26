# Mechanic interaction matrix — 2026-09-26

**Auditor:** Mechanic Interaction Matrix Auditor  
**HEAD:** `0f5363f` (unchanged since #332 / 09-21…09-25 matrices)  
**Gameplay code:** not modified.

Pairs are scored only when current source shows a real join. Do not re-file OPEN 08-31 / 09-01 / 09-02 / 09-21 / 09-22 / 09-23 / 09-24 / 09-25 items. Do not clone in-flight **#327** / **#331** / **#336** / **#370** / **#376** / **#379** / **#380** / **#382** / **#386** / **#389** / **#391** / **#410** / **#443** / **#467** / **#476** / **#487** / **#489** / **#491** / **#495** / **#496** / **#498** / **#508** / **#524** / **#541** / **#543** / **#546** / **#547** / **#550** / **#551** / **#553** / **#554** / **#555** / **#566** / **#596** / **#597** / **#598** / **#599** / **#601** / **#602** / **#604** / **#606** / **#607** / **#608**.

## Focus this run

| Pair | Verdict |
| :--- | :--- |
| Summons × portals (occupy / AI path / portal cleanup) | **CLOSED** — portals impassable; transition resets roster; victory despawns. Do not clone #331/#553/#603/#608. |
| DoT / plague × last-hostile victory / leftover player DoT | **CLOSED** — `shouldAdvanceAfterEnemyTurn` / `shouldAwardVictory` + tests. |
| Player death × leftover summons completing victory | **CLOSED** — `deathTriggered` + cleanup before victory/challenge. |
| Death × challenge completion | **CLOSED** — `handleBattleEnd` bails on `deathTriggered` before challenge eval. |
| Spell observation × battle failure | **Non-finding** — no observe path; `ownedSpells` = starter ∪ catalog. |
| Boss phase × summon death | **CLOSED** — `checkPhaseTransition` uses boss HP only. |
| Shrine / ground / dungeon-complete × unpaid death | **Broken join** — one-shot `applyRewards` credits skip unpaid 20/40. **MIMA-2026-09-26-002**. |
| Ice Frozen status × summon MP vs player MP | **Broken join** — player restore consumes −2 MP; `summonTurnBudget` / enemy reach ignore it. **MIMA-2026-09-26-003**. Not landing (08-31-002 / 09-01-006), not Null Field (09-24-002), not Frozen Terrain 2×. |
| Time Warp | **Wired** — 15s timer via `isTimeWarp`. Do not file. |
| Chaos Initiative | **Broken join** — hook runs; `turnOrderRef` / `liveTurnOrder` discard the shuffle. **MIMA-2026-09-26-001**. |
| Vampiric Ground × healUsed / no_healing | Already **09-21-001**. Do not re-file. |

## New ACTION_IDs

`docs/automation/ACTION_IDS_MIMA_2026-09-26.md` — **001–003**.

## Matrix (evidence-backed, new gaps)

| Pair | Should they interact? | Do they? | Deterministic? | Contradictory state? | Bypass? | Player feedback? | Regression tests? | Why distinct |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| Chaos Initiative × turn-queue authority (strip vs `turnOrderRef`) | Yes — announce “reshuffles each round” | Hook called at wrap-to-0 (WX 14717–14721); `liveTurnOrder` prefers unsynced ref (`turnQueue.ts` 135–137; WX 14099) | Hook uses `Math.random()` | Yes — React strip can show shuffled order; AI / `isPlayerTurn` read ref | Gameplay never leaves initiative (or last store) order | Chip + announce fire; strip may lie about who is next | None for sort+ref sync | Not 09-24-001 (Mist/Winds HP copy); call site exists but authority is the ref |
| Shrine / ground / dungeon-complete × unpaid death 20/40 | Yes — any lock credit must honour pending cut | `persistDokaCreditResult` + `creditLiveDoka` with no `applyUnpaidDeathPenaltyToWrite` (WX 11303–11385, 6340–6357; `dokaPersist.ts` 250–261) | Yes | Lock+HUD above honoured wallet until next absolute write | Absolute heal/shop still honour (WX 13134–13147) | Coin/altar/bonus toasts fire at full credit | Remint tests only | Not #391 GameKey; not 09-25-004 feat claim; not 09-24-004 Fever; not #604 Death Realm gate |
| Ice Frozen −2 MP × summon / enemy MP budget | Yes — status should cut next-turn MP for the holder | Player restore uses `getStatModifier("mp")` (WX 14357–14364); `summonTurnBudget` is raw maxMp (`summonControlCast.ts` 356–363; WX 14524–14529 / 14987–14988); enemy reach ignores status | Yes | Frozen icon on enemy/summon after ice landing (WX 16913–16928) while walk budget unchanged | Player ice path works | Log “Slowed!” + icon; no MP change for non-players | None for summon Frozen consume | Not landing miss (08-31-002 / 09-01-006); not Null Field (09-24-002); not Frozen Terrain 2×; not #596–598 Haste/Slow/Sentinel |

## Non-findings (do not invent)

- Summons cannot path onto / through portals; portal and Death Realm transitions clear or replace the roster; victory despawns summons before overworld walk.
- DoT/plague last-hostile and player-plague death vs victory are already gated and tested.
- Dying cannot complete a challenge or award victory through leftover summons.
- No watch-enemy-cast spell unlock path.
- Boss phase 2 keys off boss HP only — killing a summon does not advance/skip phase.
- Time Warp **is** wired (15s).
- Vampiric × challenge healUsed stays under **09-21-001** (and 09-23-001’s “do not re-file Vampiric stub”).
- Gravity Well / Fog unused placeholders; Blood Moon / Mirror Field wired in `spellEngine`; push/pull unwired; Drain / Wisp healUsed closed — unchanged.

Actionable record: [`ACTION_IDS_MIMA_2026-09-26.md`](./ACTION_IDS_MIMA_2026-09-26.md).
