# PERF action IDs — 2026-10-31 (React / subscriptions, non-RAF)

Auditor branch on `origin/main` @ `0f5363f`. Report-only; no patches landed.
Do not re-file PERF-001–214 unless reverted. Canvas/RAF out of scope.

---

ACTION_ID: PERF-2026-10-31-215
TITLE: ChatPanel input focus effect re-arms on every battle log / message identity change
CATEGORY: runtime-performance
PRIORITY: high
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/components/ChatPanel.tsx (~972-999)
CURRENT_BEHAVIOUR: While `!isFolded`, an effect depends on `messages`, `battleLogEntries`, `summonLogEntries`, and `activeEffects.length`. Each new battle-log line (capped 500) schedules `setTimeout(() => inputRef.current?.focus(), 80)` with no cleanup. Competing with canvas / spell targeting focus; uncleared timers after fold/unmount.
DESIRED_BEHAVIOUR: Focus only when `isFolded` flips to false or `activeChannel` changes. Clear the timeout on cleanup / re-run.
EVIDENCE: Effect body gates on `!isFolded` then always schedules focus; deps include full `battleLogEntries` and `messages` arrays.
RECOMMENDED_ACTION: Narrow deps to `[isFolded, activeChannel]`; store timeout id; clear in effect cleanup. Keep unread-clear logic in a separate effect if needed.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: Opening chat / switching channel must still focus the input once.
VALIDATION_REQUIRED: Unfold chat; type during battle with battle-log updates — caret stays; no focus steal while targeting.
STATUS: NEW

---

ACTION_ID: PERF-2026-10-31-216
TITLE: Chat poll Promise.race reject timeout is never cleared on success
CATEGORY: runtime-performance
PRIORITY: low
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/components/ChatPanel.tsx (~878-924)
CURRENT_BEHAVIOUR: `fetchMessages` races `getMessages()` against an anonymous `setTimeout(..., 5000)` rejector. Only the separate `timeoutId` (didTimeout flag) is cleared. Every successful 2s poll leaves a 5s timer until it fires a no-op reject on a settled race.
DESIRED_BEHAVIOUR: Clear both timer ids in `finally` / success and error paths.
EVIDENCE: `clearTimeout(timeoutId)` only; race reject timeout has no handle.
RECOMMENDED_ACTION: `const rejectId = setTimeout(...);` clear both in finally.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: Timeout still must abort slow replica calls.
VALIDATION_REQUIRED: Explore 30s with chat open; no growing pending timers (devtools); poll still recovers after a forced timeout.
STATUS: NEW

---

## Still open on this SHA (already numbered; re-verified)

- PERF-2026-08-31-009 — `useGetCallerDokaBalance` `staleTime: 0`; `main.tsx` default `refetchOnWindowFocus`
- PERF-2026-09-02-057 / 10-28-204 — closed BuffShop still `loadInventory` / `saveInventory`
- PERF-2026-09-02-060 / 10-28-203 — closed AchievementsPanel still dual-subscribes feats queries
- PERF-2026-10-28-201 — chat poll resumes during Game Over (`isPaused={isInBattle || isTransitioning}` only; `deathOverlayActivity` absent)
- PERF-2026-10-28-202 — DraggablePanel drag still `offsetWidth`/`offsetHeight` every mousemove (012 coalesced setState only)
- PERF-2026-10-28-206 — Chat `isFolded` vs DraggablePanel restored `folded` desync
