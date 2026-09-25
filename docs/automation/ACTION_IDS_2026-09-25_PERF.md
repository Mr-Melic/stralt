# ACTION_IDs — 2026-09-25 Performance Auditor

Implemented this increment: PERF-2026-09-25-108, PERF-2026-09-25-109.
Reported only: PERF-2026-09-25-110 through 113.

Did **not** change WorldExploration, the world RAF schedule, or gameplay timing.
Did **not** re-file PERF-2026-08-31-001..010, 09-01-011..036, 09-02-037..060,
09-21-061..070, 09-22-071..085, 09-23-086..101, 09-24-102..107.

`debugLogRing.ts` is a new file. `debugLogger.ts` is disjoint from open perf
PRs #350 / #392 / #412 / #429 / #447 / #511. `useAdminQueries.ts` overlaps
#350 (catalog `refetchOnWindowFocus`) and #392 (feat `console.log` gates);
this hunk only adds the flag on `useGetUserRole` (those PRs do not touch that
hook) so git should auto-merge.

## Residual on HEAD (already ledgered; still open in older PRs)

| ID | Still on HEAD | Where it lives |
|---|---|---|
| 061 | Catalog `refetchOnWindowFocus` default true | #350 |
| 062 | `playNoise` still allocates a buffer per hit | #350 |
| 009 / 070 | `callerDokaBalance` staleTime 0; global QC default | HUMAN |
| 083 | `[FEATS] UNLOCK/CLAIM` `console.log` | #392 |
| 085 | Leaderboard focus refetch | #392 |
| 094–096 | useIsMobile equality, profile focus, debug mount copy | #447 |
| 102 | Starfield resize rebuild | #511 |
| 005–008, 013, 016, 019, 027, 032, 035, 037–041, 054–055, 057, 060, 065–068, 071, 077, 081–082, 086–093, 097–101, 103–107 | Reported earlier | Do not re-file |

---

ACTION_ID: PERF-2026-09-25-108
TITLE: Stop the debug ring from allocating a 2000-entry array on every log after cap
CATEGORY: runtime-performance
PRIORITY: high
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/debug/debugLogRing.ts; src/frontend/src/debug/debugLogger.ts
CURRENT_BEHAVIOUR: `logDebug` always pushed into a module array (including production — PERF-077). Once length exceeded 2000, `_buffer = _buffer.slice(-2000)` copied the whole ring on every subsequent line. Combat / AI / spell paths call `logDebugInfo` frequently; a long session paid that copy on the main thread under the live canvas. Distinct from PERF-003 (ChatPanel React subscriber) and PERF-077 (stop prod writes entirely).
DESIRED_BEHAVIOUR: Fixed-capacity ring; overflow overwrites the oldest slot in O(1). Oldest-first snapshot only when Debug export / the Debug tab reads the buffer. Pause / subscriber behaviour unchanged.
EVIDENCE: debugLogger.ts previously `push` then `slice(-DEBUG_BUFFER_CAP)`. Callers in WorldExploration, enemyAI, spellEngine, summonIntegration.
RECOMMENDED_ACTION: Keep `pushDebugLogEntry` / `snapshotDebugLogRing`. Do not gate prod writes here (077 remains HUMAN).
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: Debug tab / Export .txt must still show oldest-first history up to 2000. Pause must still drop persisted lines while notifying subscribers.
VALIDATION_REQUIRED: node --experimental-strip-types --test src/frontend/src/debug/debugLogRing.test.ts; typecheck; open Debug after a battle — history present; Export .txt still works; pause stops growth.
STATUS: IMPLEMENTED

---

ACTION_ID: PERF-2026-09-25-109
TITLE: Stop App-level userRole query from refetching on window focus
CATEGORY: runtime-performance
PRIORITY: medium
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/hooks/useAdminQueries.ts (useGetUserRole); src/frontend/src/App.tsx
CURRENT_BEHAVIOUR: App always mounts `useGetUserRole` (`staleTime: 60000`, default `refetchOnWindowFocus`). After 60s, alt-tab back into play hit `getUserRole` and re-rendered App → GameFlow under the live canvas (WorldExploration is memo'd; GameFlow is not). Distinct from PERF-061 (WX catalogs), PERF-095 (profile), PERF-009/070 (Doka / global default), PERF-085 (leaderboard).
DESIRED_BEHAVIOUR: `refetchOnWindowFocus: false` on this query. `assignUserRole` still invalidates `userRole`. First mount / remount still loads.
EVIDENCE: useAdminQueries.ts useGetUserRole lacked a focus gate; App.tsx always calls the hook for `isAdmin`.
RECOMMENDED_ACTION: Keep the per-query flag. Do not change persist-lock or Doka hydrate. Union with #350/#392 — do not overwrite catalog / feat-log hunks.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: Role edits in another tab lag until remount or mutation invalidate (same class as catalog 061).
VALIDATION_REQUIRED: Typecheck; enter world; alt-tab after 60s does not hitch; assigning admin still shows the Admin button after invalidate.
STATUS: IMPLEMENTED

---

ACTION_ID: PERF-2026-09-25-110
TITLE: In-game Admin dashboard mounts over a still-running WorldExploration RAF
CATEGORY: runtime-performance
PRIORITY: high
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/App.tsx; src/frontend/src/components/AdminDashboard.tsx; src/frontend/src/components/GameFlow.tsx
CURRENT_BEHAVIOUR: The in-game Admin button sets `showAdmin` without unmounting GameFlow. AdminDashboard (lazy, ~8k lines) mounts on top and immediately subscribes to spell/enemy/sprite/region/modifier/achievement/boss/name catalogs while the world canvas RAF, 1 Hz turn timer, and watchdog keep running underneath. Distinct from PERF-027 (split WX islands) and PERF-001 (starfield pause in-world).
DESIRED_BEHAVIOUR: Unmount or pause the world tree while Admin is open, or pause the canvas loop without changing in-foreground combat timing. Prompt forbids RAF-loop timing changes for optimization — treat pause-on-admin as a product call.
EVIDENCE: App.tsx renders `{showAdmin && <AdminDashboard />}` and `{showGame && <GameFlow />}` independently. GameFlow Admin button calls `onOpenAdmin`. AdminDashboard hooks listed at the top of that file.
RECOMMENDED_ACTION: Product sign-off. Do not freeze combat timers as a silent side effect of opening Admin.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: Pausing RAF while Admin is open would freeze turn timers / AI timeouts; unmounting WX would drop in-flight persist. Either path needs a fixture.
VALIDATION_REQUIRED: Open Admin mid-explore and mid-battle; canvas must not stay black after Back; in-flight applyRewards / shop must not abort.
STATUS: NEW

---

ACTION_ID: PERF-2026-09-25-111
TITLE: getSpellRangeTiles writes TARGET-BISECT debug lines on a miss that can run every RAF
CATEGORY: runtime-performance
PRIORITY: medium
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/components/WorldExploration.tsx (getSpellRangeTiles ~7111–7135); src/frontend/src/debug/debugLogger.ts
CURRENT_BEHAVIOUR: When attack mode has a selectedSpellId that is missing from `activeSpells`, `getSpellRangeTiles` calls `logDebugInfo("[TARGET-BISECT] spell lookup failed", {…})` every frame (render reads it while `battleActionMode === "attack"`). Combined with PERF-077 (prod still appends the ring) that is 60 object allocations/sec plus subscriber notify. The empty-set branch is mostly gated by the caller, but the lookup-failed branch is not. Distinct from PERF-089 (ungated `console.log`) and from 108 (overflow copy).
DESIRED_BEHAVIOUR: DEV-gate or one-shot per selected id. Do not log from the RAF-driven highlight path in production.
EVIDENCE: getSpellRangeTiles empty/lookup-failed `logDebugInfo` blocks; render() calls it when `battleActionModeRef === "attack" && selectedSpellIdRef.current`.
RECOMMENDED_ACTION: Gate like the nearby SPELLBAR-BISECT DEV block. Do not change range geometry. WorldExploration is in older combat/map PRs — restack/union.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: Debug Export would lose per-frame bisect if the gate is too aggressive; one-shot per id is enough.
VALIDATION_REQUIRED: Select a spell, hover range still paints; swap bar mid-cast; production build has no TARGET-BISECT flood; DEV still logs once.
STATUS: NEW

---

ACTION_ID: PERF-2026-09-25-112
TITLE: BloodParticles ResizeObserver assigns canvas.width even when the size is unchanged
CATEGORY: runtime-performance
PRIORITY: medium
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/components/BloodParticles.tsx (~96–108)
CURRENT_BEHAVIOUR: Every ResizeObserver tick writes `canvas.width` / `height` from `contentRect`. Assigning `canvas.width` clears the 2D backing store. Character select mounts one drip canvas per filled slot (PERF-041) under Starfield; mobile URL-bar chrome fires RO often. Distinct from PERF-074 (hidden-tab 1×1 release, open PR #412) and PERF-102 (starfield equal-size skip, #511).
DESIRED_BEHAVIOUR: Skip backing-store assign when integer CSS size is unchanged. Pair with 074's hidden 1×1 release when that PR lands.
EVIDENCE: BloodParticles.tsx RO always `canvas.width = width`. Same class of cost as the pre-102 starfield resize path.
RECOMMENDED_ACTION: Integer equality guard. BloodParticles is in #392 / #412 — union, do not overwrite GPU-release hunks.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: Rotate/maximize must still fill the parent. Hidden 1×1 resume (074) must still assign the real size.
VALIDATION_REQUIRED: 1- and 3-slot select; resize without a drip hitch; background tab (after 074) still releases; Play does not leak RAF.
STATUS: NEW

---

ACTION_ID: PERF-2026-09-25-113
TITLE: MapModifiersPanel starts unfolded so Map Effects chrome is live from world entry
CATEGORY: runtime-performance
PRIORITY: low
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/components/MapModifiersPanel.tsx (`defaultFolded={false}`)
CURRENT_BEHAVIOUR: Map Effects mounts unfolded for the whole world session (PERF-052 memoized the panel; PERF-082 still fetches layout per panel). Even an empty modifier list paints header + body while the canvas RAF runs. Distinct from PERF-103 (Chat default unfolded) and from UX PR #517 (hide empty overlay — different desired UI).
DESIRED_BEHAVIOUR: Default folded, or mount body only when `modifiers.length > 0`, matching persisted unfold. Unread/active-modifier count on the title must still work.
EVIDENCE: MapModifiersPanel `defaultFolded={false}`. WorldExploration always renders `<MapModifiersPanel modifiers={visibleMapModifiers} />`.
RECOMMENDED_ACTION: UX sign-off. MapModifiersPanel is also in #526 (a11y) — union.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: Players who rely on seeing Map Effects at Play would need an extra tap. Persisted unfold must still win. #517's empty-hide must not fight this default.
VALIDATION_REQUIRED: Fresh profile: panel starts folded; a rolled modifier still appears; layout restore after reload; empty overlay rule from #517 if that lands first.
STATUS: NEW
