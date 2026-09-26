# ACTION_IDs — 2026-09-26 Performance Auditor

Implemented this increment: PERF-2026-09-26-115, 118.
Reported only: PERF-2026-09-26-114, 116, 117.

Did **not** change WorldExploration, the world RAF schedule, or gameplay timing.
Did **not** re-file PERF-2026-08-31-001..010, 09-01-011..036, 09-02-037..060,
09-21-061..070, 09-22-071..085, 09-23-086..101, 09-24-102..107, 09-25-108..113.

Did **not** implement previously reported PERF-081 (skip ChatPanel body while
folded): wrapping children forces Biome to reindent ~900 lines and would
overwrite union with open ChatPanel PRs #350 / #392 / #447. Default remains
unfolded (PERF-103, HUMAN).

Did **not** wire ChatPanel `fetchMessages` (PERF-114): that file is in the
oldest-first ChatPanel stack (#350 / #392 / #447 and later combat PRs). A
`raceWithTimeout` helper was dropped so this PR stays merge-clean. `sonner.tsx`
and `smallScreenActivity.ts` are new or disjoint from open perf PRs #350 /
#392 / #412 / #429 / #447 / #511 / #594. `App.tsx` only changes the
small-screen resize updater.

## Residual on HEAD (already ledgered; still open in older PRs)

| ID | Still on HEAD | Where it lives |
|---|---|---|
| 061 | Catalog `refetchOnWindowFocus` default true | #350 |
| 062 | `playNoise` still allocates a buffer per hit | #350 |
| 009 / 070 | `callerDokaBalance` staleTime 0; global QC default | HUMAN |
| 081 | Folded chat still evaluates 500-row JSX | older ChatPanel PRs |
| 114 | Chat poll 5s race timer never cleared | ChatPanel stack; this increment reports only |
| 083 | `[FEATS] UNLOCK/CLAIM` `console.log` | #392 |
| 085 | Leaderboard focus refetch | #392 |
| 094–096 | useIsMobile equality, profile focus, debug mount copy | #447 |
| 102 | Starfield resize rebuild | #511 |
| 108–109 | debug ring overflow; userRole focus | #594 |
| 005–008, 013, 016, 019, 027, 032, 035, 037–041, 054–055, 057, 060, 065–068, 071, 077, 082, 086–093, 097–101, 103–107, 110–113 | Reported earlier | Do not re-file |

---

ACTION_ID: PERF-2026-09-26-114
TITLE: Chat getMessages poll leaves a 5s timer running after the canister returns
CATEGORY: runtime-performance
PRIORITY: medium
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/components/ChatPanel.tsx (fetchMessages)
CURRENT_BEHAVIOUR: Every 2s explore poll `Promise.race`s `getMessages()` against `setTimeout(..., 5000)` and never `clearTimeout` when the actor wins. A successful poll still occupies a timer until 5s. Distinct from PERF-101 (10s `withTimeout` in React Query hooks) and PERF-063 (poll identity vs fold/channel).
DESIRED_BEHAVIOUR: Race helper clears the timer in `finally` when either side settles. Timeouts still reject hung replica calls. Fold/channel unread counting unchanged.
EVIDENCE: ChatPanel.tsx fetchMessages creates two 5s timers (didTimeout flag + race reject) and only clears the flag timer.
RECOMMENDED_ACTION: After older ChatPanel PRs land, wrap getMessages in a finally-cleared timeout. Do not change 2s interval, hidden-tab skip, or in-battle pause. Do not restack ChatPanel in this increment — open-pr-stack-compat conflicts on that file through the oldest-first prefix.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: Hung getMessages must still fail closed at 5s so polls do not queue. ChatPanel is in #350/#392/#447 plus later combat PRs.
VALIDATION_REQUIRED: fold chat; send a line; poll continues; no growing timer list in DevTools.
STATUS: NEW

---

ACTION_ID: PERF-2026-09-26-115
TITLE: Skip App small-screen resize setState when width stays on the same side of 768
CATEGORY: runtime-performance
PRIORITY: medium
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/engine/smallScreenActivity.ts; src/frontend/src/App.tsx
CURRENT_BEHAVIOUR: App's Continue-anyway guard used `setIsSmallScreen(window.innerWidth < 768)` on every resize. After bypass, App still hosts GameFlow (not memoized). Distinct from PERF-094 (`useIsMobile` in WorldExploration) and PERF-092 (WX `isDesktop` > 1024).
DESIRED_BEHAVIOUR: Seed from `window.innerWidth`. Commit React state only when the boolean flips. Continue warning and sessionStorage bypass unchanged.
EVIDENCE: App.tsx resize effect always called setIsSmallScreen with a fresh boolean expression; GameFlow re-renders whenever App does.
RECOMMENDED_ACTION: Keep `shouldCommitIsSmallScreen`. Do not change the 768px Continue copy.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: Crossing 768 must still show or hide the warning before bypass; after bypass a portrait rotate must not remount the world tree (already true).
VALIDATION_REQUIRED: node --experimental-strip-types --test src/frontend/src/engine/smallScreenActivity.test.ts; drag a desktop window that stays >768; narrow viewport still shows Continue until tapped.
STATUS: IMPLEMENTED

---

ACTION_ID: PERF-2026-09-26-116
TITLE: World entry fetches Boss Rush / tier / palette configs twice (raw actor + hook)
CATEGORY: runtime-performance
PRIORITY: medium
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/components/WorldExploration.tsx (mount config sync ~898–955); src/frontend/src/hooks/useBossRush.ts (~234–248 getBossRushConfig)
CURRENT_BEHAVIOUR: On Play, WorldExploration sequentially calls `getTierSpawnConfig`, `getColorPalette`, and `getBossRushConfig` and writes localStorage, then `setTierConfigLoaded`. `useBossRush` independently fetches `getBossRushConfig` again and JSON.parses `rewardMultiplier`. React Query also loads spells/modifiers/gameConfig/achievements/names/regions. Duplicate canister + JSON work on the main thread under Starfield→canvas startup. Distinct from PERF-061 (catalog focus refetch) and PERF-082 (uiLayout).
DESIRED_BEHAVIOUR: One shared fetch per config blob; WX localStorage paint-first can await the same promise as useBossRush. Do not change spawn/Rush persist.
EVIDENCE: WX effect `actor.getBossRushConfig?.()` ~946; useBossRush.ts `actor.getBossRushConfig?.()` ~238. WX also getTierSpawnConfig / getColorPalette with no React Query counterpart.
RECOMMENDED_ACTION: Deduplicate behind a module in-flight map (same class as 082). WorldExploration is in older combat/map PRs — restack/union.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: Rush multiplier or tier percents can desync if one consumer reads a stale blob. Map-gen must still see localStorage after the first portal.
VALIDATION_REQUIRED: Enter world; network tab shows one getBossRushConfig; Boss Rush rewards still scale; admin palette/tier save still applies after remount.
STATUS: NEW

---

ACTION_ID: PERF-2026-09-26-117
TITLE: Achievement toast injects a style tag and runs infinite scale + drop-shadow
CATEGORY: runtime-performance
PRIORITY: low
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/components/AchievementToast.tsx; src/frontend/src/components/WorldExploration.tsx (~17949)
CURRENT_BEHAVIOUR: Each unlock mounts a toast that injects `@keyframes achievementTrophyPulse` via an inline `<style>` and runs `animation: ... infinite` plus `filter: drop-shadow(...)` for 4s over the live canvas. Distinct from PERF-097 (battle HUD caret) and from recap feat list.
DESIRED_BEHAVIOUR: Move keyframes to index.css (once); pause on `document.hidden` / `prefers-reduced-motion`; optional static trophy. Persist-claim path unchanged.
EVIDENCE: AchievementToast.tsx inline style block ~168–174; drop-shadow ~100; WorldExploration mounts it when `pendingAchievementToast` is set.
RECOMMENDED_ACTION: Visual-approved. index.css is in a11y/dead-code PRs — restack if implementing.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: Unlock affordance is a player-facing juice cue; rapid remount (LEAK-13) must still cancel timers.
VALIDATION_REQUIRED: Unlock a feat in overworld; toast slides, dismisses at 4s, click dismisses; reduced-motion; no leaked timers after unmount.
STATUS: NEW

---

ACTION_ID: PERF-2026-09-26-118
TITLE: Game toaster subscribed to next-themes with no ThemeProvider
CATEGORY: runtime-performance
PRIORITY: medium
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/components/ui/sonner.tsx; src/frontend/src/App.tsx (`<Toaster />` while GameFlow is mounted)
CURRENT_BEHAVIOUR: App always mounts the sonner Toaster during play. The wrapper called `useTheme()` from `next-themes` although the app never mounts `ThemeProvider`. That still hydrates a "system" theme on game entry under the world canvas. The UI is dark-only (carved stone). Distinct from PERF-110 (Admin over a running RAF).
DESIRED_BEHAVIOUR: Hardcode `theme="dark"`. Toast copy/position unchanged.
EVIDENCE: sonner.tsx imported useTheme; grep shows no ThemeProvider in src/frontend/src; App.tsx renders Toaster next to GameFlow.
RECOMMENDED_ACTION: Keep the dark theme prop. Do not add a ThemeProvider in a perf-only PR.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: None for players; there is no light theme. Toast still uses CSS variables for colors.
VALIDATION_REQUIRED: Typecheck; trigger a rename/shop toast in world; toast is readable on the dark HUD.
STATUS: IMPLEMENTED
