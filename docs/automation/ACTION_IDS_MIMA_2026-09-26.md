# ACTION_IDs — 2026-09-26 Mechanic Interaction Matrix Auditor

Durable ledger for the Report Action Orchestrator.  
SOURCE_AUTOMATION: Mechanic Interaction Matrix Auditor  
HEAD inspected: `0f5363f` (`Merge pull request #332`)  
Gameplay code: not modified.

Do not re-file still-OPEN 08-31 / 09-01 / 09-02 / 09-21 / 09-22 / 09-23 / 09-24 / 09-25 items. Do not clone open PRs listed in the matrix exclude set (#327 #331 #336 #370 #376 #379 #380 #382 #386 #389 #391 #410 #443 #467 #476 #487 #489 #491 #495 #496 #498 #508 #524 #541 #543 #546 #547 #550 #551 #553 #554 #555 #566 #596 #597 #598 #599 #601 #602 #604 #606 #607).

Focus this run: Time Warp, Chaos Initiative, Vampiric Ground × healUsed, Paper Windstorm consume vs targeting, Titans 1–5×.

---

ACTION_ID: MIMA-2026-09-26-001  
SOURCE_AUTOMATION: Mechanic Interaction Matrix Auditor  
TITLE: Chaos Initiative reshuffles React turnOrder but turnOrderRef / liveTurnOrder discard it — strip and dispatch diverge  
CATEGORY: turn order + map modifiers + summons + player feedback  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `chaos_initiative` announces “turn order reshuffles each round” and implements Fisher-Yates in `onTurnOrderSort` (`mapModifiers.ts` 435–467), keeping summons after their `ownerId`. WX calls `mapModifierRegistry.applyTurnOrderSort(prevOrder, activeMapModifierTypes)` when the index wraps to 0 (`WorldExploration.tsx` 14717–14721) and returns that array from `setTurnOrder`. `liveTurnOrder` prefers the live ref whenever it is non-empty (`turnQueue.ts` 135–137). `advanceTurn` always seeds from `liveTurnOrder(reactPrevOrder, turnOrderRef.current)` (WX 14099). The Chaos return path never assigns `turnOrderRef.current` — the only WX writes are battle start (12083), cleanup empties (11639 / 13421 / 13598), and boss phase (15783); store helpers update the ref only on add/remove/update/sync. AI / End Turn / `isPlayerTurn` read `turnOrderRef` (e.g. 14897, 18833–18834); the initiative strip reads React `turnOrder` via `battleTurnOrderForUi` (17387–17412, 18899). After a wrap, the strip can show the shuffled order at `currentTurnIndex` while the next dispatch still walks the pre-shuffle ref. `Math.random()` inside the hook is non-deterministic even if the ref were synced. No test covers `applyTurnOrderSort` + ref sync. Distinct from MIMA-2026-09-24-001 (Mist/Winds mutate a turn-order **HP/MP copy**, not order identity). Distinct from 09-21-001 (player excluded from turn-start HP hooks).  
EXPECTED_INTERACTION: When Chaos Initiative is active, each new round’s turn order (strip + AI dispatch + End Turn gate) is the same shuffled sequence, with summons still immediately after their owner.  
ACTUAL_INTERACTION: The hook runs and React state may briefly show a shuffle; gameplay turn advance keeps the initiative-sorted (or last store-synced) ref order forever.  
SYSTEMS_AFFECTED: Chaos Initiative, turn queue, initiative strip, enemy AI dispatch, summon control hand-off, player feedback  
RECOMMENDED_ACTION: After `applyTurnOrderSort`, assign `turnOrderRef.current = shuffled` (same assign-ref-then-set pattern as `addCombatant`) before returning from the `setTurnOrder` updater — or shuffle into the ref first and `setTurnOrder(() => turnOrderRef.current)`. Keep summon-after-owner. Prefer a seeded `ctx.rng` later; do not change Time Warp’s 15s timer. Tests: with `chaos_initiative` active, after wrap to index 0, `turnOrderRef.current.map(c => c.id)` equals the React order and differs from the pre-wrap order (seeded RNG). Do not change `liveTurnOrder`’s removeCombatant preference without covering kill-during-turn.  
AUTONOMY: IMPLEMENT_ONE_REF_SYNC_AT_SORT_SITE  
DEPENDENCIES: None. Do not fold Mist/Winds store commit (09-24-001) or player turn-start (09-21-001 / #443).  
REGRESSION_RISK: MEDIUM — a real shuffle changes who acts after the player; summons must stay glued to owners; do not desync `currentTurnIndexRef` from the entry that already dispatched at wrap.  
VALIDATION_REQUIRED: Unit test on advanceTurn wrap with Chaos; playtest strip highlight matches who can act after round 1.  
STATUS: NEW  

---

## Focus non-findings (this run — do not invent)

- **Time Warp — wired.** `isTimeWarp` selects 15s vs 30s in `advanceTurn` (WX 14036–14038) and the turn-timer effect (14778–14806). Do not file.
- **Vampiric Ground × healUsed / no_healing** — already **MIMA-2026-09-21-001** (throwaway player attacker stub inside `enemyTakesDamage`; live HP and `challengeHealUsedRef` untouched). Do not re-file. 09-23-001 explicitly defers Vampiric stub to 09-21-001.
- **Titans 1–5×** — same `onDamageDealt` miss as Glass on primary `applyDamageToEnemy` / player-incoming — **MIMA-2026-09-23-001**. Skip.
- **Paper Windstorm consume vs targeting** — `targeting.ts` has **no** `paper_windstorm` / half-range branch. Live consume is miss (`spellEngine` `paperWindstormMiss` / enemy `range > 1` 50%). Announce vs rate remains **PXA-owned** (09-25 matrix non-finding). Skip.
