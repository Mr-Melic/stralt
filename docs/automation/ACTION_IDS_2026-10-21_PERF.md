# ACTION_IDs — 2026-10-21 Performance Auditor (React / subscriptions)

Report-only audit (no SAFE implement this run). Focus: files outside WorldExploration
(GameFlow, ChatPanel, App, AdminDashboard, CharacterSelection, PostBattleRecap,
DraggablePanel, hooks, debugLogger).

Already ledgered (do not re-file): PERF 001–136 (summaries in automation prompt /
memories). Sibling same-day canvas ledger: `ACTION_IDS_2026-10-21_PERF_CANVAS.md`
(146+). Still-present but out of scope to re-open: SFX noise buffer (now also
canvas 147), catalog focus refetch defaults, doka staleTime:0, Chat poll 5s race
(114), folded-chat 500-row JSX (085 — children now gated by DraggablePanel fold).

---

ACTION_ID: PERF-2026-10-21-137
TITLE: Each DraggablePanel independently fetches the same getUserUiLayout blob
CATEGORY: runtime-performance
PRIORITY: high
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/components/DraggablePanel.tsx (~L452–550)
CURRENT_BEHAVIOUR: On mount (and whenever `actor` identity changes), every panel
calls `getUserUiLayout()`, JSON.parses the full blob, and may rewrite
localStorage. World entry mounts Chat + Battle UI + Stats + Settings +
MapModifiers → five identical canister queries in parallel before play settles.
DESIRED_BEHAVIOUR: One shared in-flight/cached layout fetch per principal;
panels subscribe to the result.
EVIDENCE: useEffect deps `[panelId, userId, actor]` always invoke
`(actor as UiLayoutActor).getUserUiLayout()` when actor is non-null.
RECOMMENDED_ACTION: Module-level promise cache keyed by principal (or
React Query key `["userUiLayout"]`). Keep localStorage instant paint.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: Stale layout if one panel's save races a shared cache without
invalidation; fold/position must still reconcile after backend blob arrives.
VALIDATION_REQUIRED: Enter world; Network shows one getUserUiLayout; drag/fold
chat and battle panels; reload; positions persist.
STATUS: NEW
WHY_NOT_DUPLICATE: Distinct from PERF-011/012 (pointer listeners / drag rAF).
Those never touched the backend layout fetch fan-out.

---

ACTION_ID: PERF-2026-10-21-138
TITLE: App small-screen resize listener keeps setState after Continue bypass
CATEGORY: runtime-performance
PRIORITY: high
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/App.tsx (~L346–355)
CURRENT_BEHAVIOUR: After the player Continues on a narrow viewport,
`smallScreenBypass` is true and the game tree mounts — but `resize` still calls
`setIsSmallScreen(window.innerWidth < 768)` on every resize/orientation change.
That re-renders App → GameFlow → WorldExploration/Chat during live play.
DESIRED_BEHAVIOUR: Once bypassed (or once width has been ≥768 this session),
stop updating `isSmallScreen`, or only update when it would change the guard
overlay decision.
EVIDENCE: `useEffect` always attaches `check = () => setIsSmallScreen(...)`;
bypass effect only sets bypass true when not small — it never removes the
listener or gates setState.
RECOMMENDED_ACTION: Early-return in `check` when `smallScreenBypassRef.current`
is true, or remove the listener after first bypass.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: Must not remount the game when rotating after Continue
(already protected by bypass); must still show the guard on a fresh narrow
session before Continue.
VALIDATION_REQUIRED: Narrow → Continue → rotate phone; no full React tree
reconcile spike; fresh session still shows the guard.
STATUS: NEW
WHY_NOT_DUPLICATE: PERF-115 is the small-screen warning UX itself, not the
post-bypass resize → setState churn into the live game tree.

---

ACTION_ID: PERF-2026-10-21-139
TITLE: Chat poll interval restarts whenever fold or channel changes
CATEGORY: runtime-performance
PRIORITY: medium
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/components/ChatPanel.tsx (~L878–957)
CURRENT_BEHAVIOUR: `fetchMessages` closes over `isFolded` and `activeChannel`
for unread bookkeeping, so its identity changes on every tab/fold toggle.
The poll effect depends on `fetchMessages`, so it clears the 2s interval,
immediately invokes `getMessages()`, and starts a new interval — even while
exploring (not paused).
DESIRED_BEHAVIOUR: Keep poll callback identity stable; read fold/channel from
refs inside the fetch; only restart the interval on actor / isPaused changes.
EVIDENCE: `useCallback(..., [actor, isFolded, activeChannel])` +
`useEffect(..., [fetchMessages, isPaused])`.
RECOMMENDED_ACTION: `isFoldedRef` / `activeChannelRef` (pattern already used
for `isPausedRef` / `tabVisibleRef`).
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: Unread badges for general channel must still increment when
folded or on another tab; battle pause must still clear the interval.
VALIDATION_REQUIRED: Explore; switch chat tabs rapidly; fold/unfold; Network
does not spam getMessages; unread still works.
STATUS: NEW
WHY_NOT_DUPLICATE: PERF-114 is the 5s Promise.race timeout / timer race inside
a single fetch. This is interval teardown/restart from React dependency churn.

---

ACTION_ID: PERF-2026-10-21-140
TITLE: Character slots query always refetches on every CharacterSelection mount
CATEGORY: runtime-performance
PRIORITY: medium
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/hooks/useCharacterQueries.ts
(`useGetCharacterSlots`); src/frontend/src/components/CharacterSelection.tsx
CURRENT_BEHAVIOUR: `staleTime: 0` + `refetchOnMount: "always"` forces a canister
`getCharacterSlots` + `deepNormalizeBigInts` of three full character records
every time the player returns from creation/edit to selection (GameFlow stage
swap remounts the screen).
DESIRED_BEHAVIOUR: Modest staleTime (e.g. 10–30s); rely on mutation
`invalidateQueries(["characterSlots"])` after create/update/delete; keep
`refetchOnWindowFocus: false`.
EVIDENCE: useCharacterQueries.ts L83–85; CharacterSelection L848–853.
RECOMMENDED_ACTION: Drop `refetchOnMount: "always"`; set staleTime ≥ 10_000.
Confirm create/edit/delete mutations already invalidate the key.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: Selection list could briefly show pre-create slots if a
mutation forgets to invalidate — audit those onSuccess paths.
VALIDATION_REQUIRED: Create character → back to selection shows new slot
without manual refresh; revisit selection within stale window does not
refetch.
STATUS: NEW
WHY_NOT_DUPLICATE: PERF-061 catalog focus refetch covers spell/enemy/gameConfig
focus paths on WorldExploration, not the character-slot mount policy.

---

ACTION_ID: PERF-2026-10-21-141
TITLE: AdminDashboard fires every catalog query on open regardless of tab
CATEGORY: runtime-performance
PRIORITY: medium
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/components/AdminDashboard.tsx (~L5364–5385)
CURRENT_BEHAVIOUR: Opening Admin (lazy) immediately runs
useGetEnemyConfigs / Region / Sprite / Spell / MapModifiers / GameConfig /
AchievementConfigs / EnemyNames in parallel — each deep-normalizing large
Candid trees — even if the admin stays on the default Enemies tab.
DESIRED_BEHAVIOUR: Enable queries per active tab (or prefetch on tab hover).
EVIDENCE: All hooks called unconditionally at the top of the dashboard
component; tab bodies are gated with `dashState.tab === …` but hooks are not.
RECOMMENDED_ACTION: Pass `enabled: dashState.tab === "spells"` (etc.), keeping
shared deps (e.g. spells for BossesTab) enabled when those tabs are active.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: Cross-tab editors that need another catalog in memory can
break if `enabled` is too narrow; boss tab needs spells.
VALIDATION_REQUIRED: Open Admin on Enemies; Network shows only enemy-related
reads; switch to Spells loads spellConfigs once.
STATUS: NEW
WHY_NOT_DUPLICATE: PERF-061 is world-session catalog focus refetch. This is
admin mount-time fan-out before any tab interaction.

---

ACTION_ID: PERF-2026-10-21-142
TITLE: Folded ChatPanel still re-renders on every battle-log append
CATEGORY: runtime-performance
PRIORITY: medium
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/components/GameFlow.tsx (~L103–110, L272–276);
src/frontend/src/components/ChatPanel.tsx (memo + unread effects)
CURRENT_BEHAVIOUR: DraggablePanel no longer mounts children while folded (fixes
085 JSX cost), but GameFlow still `setBattleLogEntries` with a new array every
log line. `memo(ChatPanel)` sees a new `battleLogEntries` prop, re-runs the
chat hook tree, summon memo, and unread effects during battle.
DESIRED_BEHAVIOUR: Keep log on a ref; push React state only when the Battle /
Summons channel is open, or expose length/unread via a narrow store.
EVIDENCE: addBattleLogEntry always allocates `[...prev, entry]`; ChatPanel
props include the full array; unread effect depends on
`battleLogEntries.length`.
RECOMMENDED_ACTION: Mirror PERF-016 Status-tab gating for battle log identity.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: Folded unread badge and open-channel virtualization can miss
lines if the gate is wrong.
VALIDATION_REQUIRED: Folded chat during a long fight; unread increments; open
Battle tab shows full capped log.
STATUS: NEW
WHY_NOT_DUPLICATE: PERF-085 was building ≤500 battle-log DOM nodes while
folded. Fold children are gone; remaining cost is prop-identity React work.

---

ACTION_ID: PERF-2026-10-21-143
TITLE: debugLogger allocates and notifies subscribers on every prod log line
CATEGORY: runtime-performance
PRIORITY: medium
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/debug/debugLogger.ts (~L91–121);
ChatPanel subscribeDebugLogs; WorldExploration ~69 logDebug* call sites
CURRENT_BEHAVIOUR: Even in production builds, every `logDebug*` allocates a
`DebugLogEntry`, pushes into a 2000-cap buffer (slice when over), and walks
`_subscribers`. ChatPanel always subscribes (setState gated to Debug tab), so
combat logging still pays object churn + subscriber dispatch on the hot path.
DESIRED_BEHAVIOUR: Buffer/notify only when the Debug channel has been opened
this session, or when `import.meta.env.DEV` — unless product requires always-on
prod export history.
EVIDENCE: Comment at L105–107 explicitly keeps the buffer in prod; ChatPanel
L709–720 subscribes for the panel lifetime.
RECOMMENDED_ACTION: Gate buffer+notify behind a `debugCaptureEnabled` flag set
when the Debug tab is first selected; keep DEV always-on.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: Prod Debug Export / PDF may miss history before the tab was
opened — product call.
VALIDATION_REQUIRED: Battle with Debug closed (no buffer growth); open Debug
then fight; export still useful.
STATUS: NEW
WHY_NOT_DUPLICATE: PERF-003 / early debug-log items were React re-renders from
mirroring the buffer into state. This is allocation + subscriber walk with
setState already gated.

---

ACTION_ID: PERF-2026-10-21-144
TITLE: Ads tab mounts three AdBoxEditors each fetching getAdBoxes
CATEGORY: runtime-performance
PRIORITY: low
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/components/AdminDashboard.tsx
(AdBoxEditor ~L8119–8141; ads tab ~L6896–6898)
CURRENT_BEHAVIOUR: Opening the Ads tab mounts three editors; each useEffect
calls `getAdBoxes()` and indexes `[index]` — triple identical canister reads.
DESIRED_BEHAVIOUR: One parent fetch (or shared query) passed as props.
EVIDENCE: Three `<AdBoxEditor index={0|1|2} />`; each effect calls getAdBoxes.
RECOMMENDED_ACTION: Lift fetch into the ads tab body; pass row props.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: Save/clear per slot must still refresh the right row.
VALIDATION_REQUIRED: Open Ads tab; one getAdBoxes; save slot 1; UI updates.
STATUS: NEW
WHY_NOT_DUPLICATE: No prior AdBox / ads-tab fetch fan-out ID in 001–136.

---

ACTION_ID: PERF-2026-10-21-145
TITLE: PostBattleRecap applies full-viewport backdrop-filter blur
CATEGORY: runtime-performance
PRIORITY: low
CONFIDENCE: medium
FILES_OR_SYSTEMS: src/frontend/src/components/PostBattleRecap.tsx (~L90)
CURRENT_BEHAVIOUR: Root dialog uses `backdropFilter: "blur(3px)"` over the
full viewport while the world canvas/HUD remain composited underneath — a
known mobile GPU tax at the moment rewards appear.
DESIRED_BEHAVIOUR: Opaque dim overlay without blur (or blur only the modal
card chrome), matching other stone dialogs that skip backdrop-filter.
EVIDENCE: `style={{ … background: "rgba(0,0,0,0.75)", backdropFilter: "blur(3px)" }}`.
RECOMMENDED_ACTION: Drop blur; keep dim + animation. Visual sign-off.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: Recap mood lighting changes on desktop.
VALIDATION_REQUIRED: Win/defeat recap on mobile width; dismiss; no hitch.
STATUS: NEW
WHY_NOT_DUPLICATE: Not covered by 001–136 (those hit starfield/vignette/HUD
CSS, not the app-root recap overlay).
