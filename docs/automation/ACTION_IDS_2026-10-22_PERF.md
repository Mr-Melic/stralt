# ACTION_IDs — 2026-10-22 Performance Auditor

Implemented this increment: PERF-2026-09-23-101 (previously NEW; never landed).
Reported only: PERF-2026-10-22-143 through 147.

Did **not** change WorldExploration, the world RAF schedule, or gameplay timing.
Did **not** re-file PERF-2026-08-31-001..010, 09-01-011..036, 09-02-037..060,
09-21-061..070, 09-22-071..085, 09-23-086..101, 09-24-102..107, 09-25-108..113,
09-26-114..118, 09-27-119..125, 09-28-126..132, 09-29-133..136, 10-21-137..142.

`withTimeout.ts` is new. Hook hunks only replace the four local `Promise.race`
copies (query option blocks in #350 / #392 / #447 / #594 stay). ChatPanel's
5s poll race remains PERF-114.

Did **not** restack WorldExploration (089, 120, 128, 129, 141, 142) or
ChatPanel (081, 114, 140) or soundEngine (062, 127, 130) or App.tsx (115, 135)
or `vite.config.js` (137, 138). Prefer landing already-open SAFE PRs #350,
#392/#412, #429, #447, #511, #594, #643, #687, #745, #797, #841.

## Residual on HEAD (already ledgered; still open in older PRs)

| ID | Still on HEAD | Where it lives |
|---|---|---|
| 061 | Catalog `refetchOnWindowFocus` default true | #350 |
| 062 | `playNoise` still allocates a buffer per hit | #350 |
| 009 / 070 | `callerDokaBalance` staleTime 0; global QC default | HUMAN |
| 081 | Folded chat still evaluates 500-row JSX | older ChatPanel PRs |
| 114 | Chat poll 5s race timer never cleared | ChatPanel stack |
| 083 | `[FEATS] UNLOCK/CLAIM` `console.log` | #392 |
| 085 | Leaderboard focus refetch | #392 |
| 094–096 | useIsMobile equality, profile focus, debug mount copy | #447 |
| 102 | Starfield resize rebuild | #511 |
| 108–109 | debug ring overflow; userRole focus | #594 |
| 115 / 118 | App small-screen equality; toaster theme | #643 |
| 121 | landing chessDrift CSS while hidden | #687 |
| 126 | pause class-based infinite HUD CSS while hidden | #745 |
| 133 | unused Share Tech Mono + fonts preconnect | #797 |
| 137 | production clickTrace stub | #841 |
| 127–132, 134–136, 138–142 | reported on those days | do not re-file |

---

ACTION_ID: PERF-2026-09-23-101
TITLE: Query withTimeout leaves a 10s timer running after the actor resolves
CATEGORY: runtime-performance
PRIORITY: low
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/utils/withTimeout.ts; src/frontend/src/hooks/useCharacterQueries.ts; useAdminQueries.ts; useSpellQueries.ts; useShopQueries.ts
CURRENT_BEHAVIOUR: Four identical `Promise.race` helpers raced the actor against `setTimeout(..., 10000)` and never `clearTimeout`. Every catalog/profile/Doka fetch left a timer that rejected a dangling promise (`unhandledrejection`) 10s after the actor already won. World entry fires several of these at once.
DESIRED_BEHAVIOUR: `clearTimeout` when the actor promise settles. Shared helper so the four copies stay in sync. Hung replica calls still reject at 10s.
EVIDENCE: Pre-change local `withTimeout` in the four hook files; no `clearTimeout`. Distinct from PERF-114 (ChatPanel `getMessages` 5s race).
RECOMMENDED_ACTION: Keep the shared helper. Do not change query keys, staleTime, or wallet hydrate. Chat poll stays 114.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: Timeouts must still reject hung replica calls so UI does not spin forever.
VALIDATION_REQUIRED: `node --experimental-strip-types --test src/frontend/src/utils/withTimeout.test.ts`; typecheck; hung queries still time out at 10s; resolved queries do not reject later.
STATUS: IMPLEMENTED

---

ACTION_ID: PERF-2026-10-22-143
TITLE: World canvas RAF and 1 Hz watchdog keep running while the tab is hidden
CATEGORY: runtime-performance
PRIORITY: high
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/components/WorldExploration.tsx (animate ~8730, watchdog ~13778); src/frontend/src/engine/canvasLoopActivity.ts
CURRENT_BEHAVIOUR: Decorative loops already stop on `document.hidden` (058/059/074/121/126). The world `animate()` callback has no visibility guard and the watchdog `setInterval(1000)` keeps restarting RAF if background throttling makes frames look stale. Mobile browsers may still deliver ~1 fps rAF in the background, so the full isometric pass (floor shimmer, AO, entities, juice) plus wander still runs off-screen.
DESIRED_BEHAVIOUR: Product call. Pausing draw while hidden saves battery, but path-follow RAF, juice TTL, and the 30s turn timer must not silently desync. Distinct from PERF-010 (watchdog exists) and from decorative pause helpers.
EVIDENCE: No `visibilitychange` / `document.hidden` in WorldExploration; `canvasLoopActivity.ts` documents that the world loop must not change combat timing; watchdog at ~13778 restarts after 2s staleness.
RECOMMENDED_ACTION: Do not land in a perf-only PR. Prompt forbids RAF-loop timing changes. If ever paused: freeze wander/juice, leave the turn `setInterval` authoritative, resume on visible without a double-loop.
AUTONOMY:
- REPORT_ONLY
REGRESSION_RISK: Mid-walk portal/encounter checks and hit-stop would stall if RAF pauses; watchdog could start a second loop on resume.
VALIDATION_REQUIRED: If ever changed: hide tab mid-walk and mid-turn; return; camera, MP, and turn clock match wall-clock policy.
STATUS: NEW

---

ACTION_ID: PERF-2026-10-22-144
TITLE: World canvas backing store uses uncapped devicePixelRatio
CATEGORY: runtime-performance
PRIORITY: high
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/components/WorldExploration.tsx (applySize ~13950, context-restore ~13830)
CURRENT_BEHAVIOUR: ResizeObserver sets `canvas.width/height = css * devicePixelRatio` with no cap. On a 3× phone that is a ~9× pixel buffer for the opaque world canvas (plus fill/AO/shimmer over the full grid). Starfield already drops to 1×1 in-world (049); the playable canvas does not. Distinct from PERF-044 (getContext twice) and PERF-102 (starfield resize rebuild).
DESIRED_BEHAVIOUR: Cap DPR at 2 (or 1.5 on low-memory) while keeping CSS size 1:1. Context-restore must use the same cap and the container rect, not `window.innerWidth/Height`.
EVIDENCE: `const dpr = window.devicePixelRatio || 1` then `canvas.width = Math.floor(cssW * dpr)` at ~13953–13957; restore path at ~13830 uses window size.
RECOMMENDED_ACTION: Visual-approved cap. WorldExploration is in the oldest-first combat/map stack — restack. Do not change occupancy or zoom rules.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: Soft-looking pixels on 3× screens; restore-after-GPU-loss can mismatch container size today even before a cap.
VALIDATION_REQUIRED: Desktop 1×/2× and a 3× mobile viewport; rotate; context-loss restore; tile click hit-test still matches diamonds.
STATUS: NEW

---

ACTION_ID: PERF-2026-10-22-145
TITLE: advanceTurn flushSync reconciles the full WorldExploration tree every turn
CATEGORY: runtime-performance
PRIORITY: high
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/components/WorldExploration.tsx (advanceTurn ~14019)
CURRENT_BEHAVIOUR: Every turn dispatch runs `flushSync` then several `setState`s (controlled summon, selected summon spell, turn time, turn order). That forces a synchronous ~19k-line reconcile in the same task as combat/AI before paint. Combined with PERF-007 (1 Hz timer) and PERF-027 (unsplit tree), this is a player-visible hitch at turn change, especially on mobile after an enemy action.
DESIRED_BEHAVIOUR: Keep store/ref-authoritative combat; lift only HUD chips that must match the new actor before the next click. Do not drop the leftover-summon-control clear.
EVIDENCE: `flushSync(() => { setActiveControlledSummonId(null); ...` at ~14020; comment cites leftover summon control and spell-range cache.
RECOMMENDED_ACTION: Do not land in a perf-only PR. Pair with a targeting fixture so End Turn / timer expiry cannot leave summon control armed.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: Without flushSync, a click in the same frame can still target the previous summon or a stale range cache.
VALIDATION_REQUIRED: End Turn, 30s expiry, summon-control then player turn, Attack Nearest immediately after advance.
STATUS: NEW

---

ACTION_ID: PERF-2026-10-22-146
TITLE: Character-select slots query uses staleTime 0 and refetchOnMount always
CATEGORY: runtime-performance
PRIORITY: medium
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/hooks/useCharacterQueries.ts (useGetCharacterSlots); src/frontend/src/components/CharacterSelection.tsx
CURRENT_BEHAVIOUR: Returning to character select always refetches three slot records and `deepNormalizeBigInts` walks the full character trees (stats, spells, loadouts). `refetchOnWindowFocus` is already false. Distinct from PERF-123 (GameFlow still subscribes to `callerDokaBalance` on select) and PERF-095 (profile focus refetch).
DESIRED_BEHAVIOUR: Modest staleTime (e.g. 30s) so a back-navigation reuses cache; keep `refetchOnMount: "always"` only if create/delete must be visible immediately (mutations already invalidate `characterSlots`).
EVIDENCE: useGetCharacterSlots `refetchOnMount: "always"`, `staleTime: 0`; CharacterSelection is the subscriber; `deepNormalizeBigInts` clones recursively.
RECOMMENDED_ACTION: Product call on freshness vs hitch. Mutations already invalidate. Do not skip the 12-field CharacterStats shape.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: After create/delete, a stale cache could show an empty or old slot until invalidate lands.
VALIDATION_REQUIRED: Create, delete, edit name; returning from Play still shows current XP/Doka/spells.
STATUS: NEW

---

ACTION_ID: PERF-2026-10-22-147
TITLE: Canvas ResizeObserver always commits a new canvasSize object
CATEGORY: runtime-performance
PRIORITY: medium
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/components/WorldExploration.tsx (applySize ~13968)
CURRENT_BEHAVIOUR: Debounced ResizeObserver (50ms) always `setCanvasSize({ width, height })` with a new object. React state identity changes even when the integers did not (HUD layout, URL-bar chrome, sibling panel snap). `canvasSize` is in the `render` useCallback deps, so the huge render closure is rebuilt and the world tree reconciles under the live RAF. Distinct from PERF-092 (`isDesktop` 1024 listener) and PERF-094 (`useIsMobile` equality).
DESIRED_BEHAVIOUR: Commit only when floored width or height actually changes (`setCanvasSize(prev => prev.width === w && prev.height === h ? prev : { width: w, height: h })`).
EVIDENCE: applySize ~13968; `useState({ width: 1200, height: 800 })` at ~1165; `render` deps include `canvasSize` at ~8692.
RECOMMENDED_ACTION: Equality guard. WorldExploration restack required. Do not skip the ctx.scale / backing-store assign when CSS size is unchanged but DPR changed (pair with 144).
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: If DPR changes without CSS size change, skipping setState is fine only if applySize still rewrites canvas.width and ctx.scale.
VALIDATION_REQUIRED: Rotate phone; drag window; tile hit-test; no extra WX renders when size is stable.
STATUS: NEW
